import type { ChangeEvent } from "react";
import { useState, useRef } from "react";
import Papa from "papaparse";

// Define types for column structure
type ColumnType = "string" | "number" | "date";

interface ExpectedColumn {
  name: string;
  type: ColumnType;
  required: boolean;
}

interface ValidationResult {
  valid: boolean;
  message?: string | null;
}

interface RowError {
  column: string;
  message: string;
}

interface RowValidationError {
  rowIndex: number;
  errors: RowError[];
}

interface ValidationResults {
  missingColumns: string[];
  unexpectedColumns: string[];
  rowErrors: RowValidationError[];
}

export interface CSVRow {
  "Dato for salg": string;
  Kategori: "Matbeholder" | "Drikkebegre";
  "Helt/delvis av plast": "Helt av plast" | "Delvis av plast";
  "Enheter solgt": number;
  "Tonn plast"?: number;
}

// Define your expected column structure
const EXPECTED_COLUMNS: ExpectedColumn[] = [
  { name: "Dato for salg", type: "date", required: true },
  { name: "Kategori", type: "string", required: true },
  { name: "Helt/delvis av plast", type: "string", required: true },
  { name: "Enheter solgt", type: "number", required: true },
  { name: "Tonn plast", type: "number", required: false },
];

const VALID_CATEGORIES = ["Matbeholder", "Drikkebegre"];
const VALID_PLASTIC_TYPES = ["Helt av plast", "Delvis av plast"];

interface CSVUploaderProps {
  onDataSubmit: (data: CSVRow[]) => Promise<void>;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({
  onDataSubmit,
}: {
  onDataSubmit: (data: CSVRow[]) => Promise<void>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [validationResults, setValidationResults] =
    useState<ValidationResults | null>(null);
  const [data, setData] = useState<CSVRow[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check data type of a value based on expected type
  const validateDataType = (
    value: string | null | undefined,
    expectedType: ColumnType,
    columnName: string
  ): ValidationResult => {
    if (value === null || value === undefined || value === "") {
      return { valid: false, message: "Tomt felt" };
    }

    switch (expectedType) {
      case "string": {
        if (columnName === "Kategori" && !VALID_CATEGORIES.includes(value)) {
          return {
            valid: false,
            message: `Ugyldig kategori. Må være enten 'Matbeholder' eller 'Drikkebegre'`,
          };
        }
        if (
          columnName === "Plastinnhold" &&
          !VALID_PLASTIC_TYPES.includes(value)
        ) {
          return {
            valid: false,
            message: `Ugyldig plastinnhold. Må være enten 'Helt av plast' eller 'Delvis av plast'`,
          };
        }
        return { valid: true };
      }
      case "number": {
        const num = Number(value);
        if (isNaN(num)) {
          return {
            valid: false,
            message: `&quot;${value}&quot; er ikke et gyldig tall`,
          };
        }
        if (columnName === "Number sold" && num <= 0) {
          return {
            valid: false,
            message: "Antall solgt må være større enn 0",
          };
        }
        if (columnName === "Tons of plastic" && num < 0) {
          return {
            valid: false,
            message: "Tonn plast kan ikke være negativt",
          };
        }
        return { valid: true };
      }
      case "date": {
        const date = new Date(value);
        return {
          valid: !isNaN(date.getTime()),
          message: isNaN(date.getTime())
            ? `&quot;${value}&quot; er ikke en gyldig dato`
            : null,
        };
      }
      default: {
        return { valid: true };
      }
    }
  };

  // Validate CSV data against expected columns
  const validateCSV = (
    parsedData: Papa.ParseResult<CSVRow>
  ): ValidationResults => {
    const headers = parsedData.meta.fields || [];
    const rows = parsedData.data;
    const validationResults: ValidationResults = {
      missingColumns: [],
      unexpectedColumns: [],
      rowErrors: [],
    };

    // Check for missing required columns
    EXPECTED_COLUMNS.forEach((col) => {
      if (col.required && !headers.includes(col.name)) {
        validationResults.missingColumns.push(col.name);
      }
    });

    // Check for unexpected columns
    headers.forEach((header) => {
      if (!EXPECTED_COLUMNS.some((col) => col.name === header)) {
        validationResults.unexpectedColumns.push(header);
      }
    });

    // Validate each row
    rows.forEach((row, rowIndex) => {
      const rowErrors: RowError[] = [];

      EXPECTED_COLUMNS.forEach((column) => {
        if (headers.includes(column.name)) {
          const value = row[column.name as keyof CSVRow];

          // Skip validation for empty optional fields
          if (
            (value === null || value === undefined || value === "") &&
            !column.required
          ) {
            return;
          }

          // Validate required fields are present
          if (
            column.required &&
            (value === null || value === undefined || value === "")
          ) {
            rowErrors.push({
              column: column.name,
              message: "Påkrevd felt er tomt",
            });
            return;
          }

          // Validate data type
          const typeValidation = validateDataType(
            String(value),
            column.type,
            column.name
          );
          if (!typeValidation.valid) {
            rowErrors.push({
              column: column.name,
              message:
                typeValidation.message ||
                `Ugyldig ${column.type} verdi: &quot;${value}&quot;`,
            });
          }
        }
      });

      if (rowErrors.length > 0) {
        validationResults.rowErrors.push({
          rowIndex: rowIndex + 2, // +2 because rowIndex is 0-based and we need to account for the header row
          errors: rowErrors,
        });
      }
    });

    return validationResults;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrors([]);
      setValidationResults(null);
      setData(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setErrors(["Vennligst velg en fil å laste opp."]);
      return;
    }

    setParsing(true);
    setErrors([]);

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        setParsing(false);

        if (results.errors.length > 0) {
          setErrors(
            results.errors.map(
              (err) => `Parsefeil: ${err.message} i rad ${err.row}`
            )
          );
          return;
        }

        // Validate the CSV structure and data
        const validationResults = validateCSV(results);
        setValidationResults(validationResults);

        // If there are no validation issues, set the data
        const hasErrors =
          validationResults.missingColumns.length > 0 ||
          validationResults.unexpectedColumns.length > 0 ||
          validationResults.rowErrors.length > 0;

        if (!hasErrors) {
          setData(results.data);
        }
      },
      error: (error: Error) => {
        setParsing(false);
        setErrors([`Feil ved parsing av CSV: ${error.message}`]);
      },
    });
  };

  const resetForm = () => {
    setFile(null);
    setErrors([]);
    setValidationResults(null);
    setData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const headers = EXPECTED_COLUMNS.map((col) => col.name).join(",");
    const exampleRow = [
      "2024-03-15",
      "Matbeholder",
      "Helt av plast",
      "100",
      "0.5",
    ].join(",");
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${exampleRow}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "csv_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Last opp CSV-fil</h1>

      {/* CSV Column Requirements */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Forventet CSV-format</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Kolonne</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Påkrevd</th>
              </tr>
            </thead>
            <tbody>
              {EXPECTED_COLUMNS.map((col, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 border">{col.name}</td>
                  <td className="px-4 py-2 border">{col.type}</td>
                  <td className="px-4 py-2 border">
                    {col.required ? "Ja" : "Nei"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={downloadTemplate}
          className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Last ned mal
        </button>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            disabled={!file || parsing}
            className={`ml-4 px-4 py-2 rounded whitespace-nowrap ${
              !file || parsing
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {parsing ? "Behandler..." : "Last opp"}
          </button>
          <button
            onClick={resetForm}
            className="ml-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Nullstill
          </button>
        </div>

        {file && (
          <div className="text-sm text-gray-600">
            Valgt fil: <span className="font-medium">{file.name}</span> (
            {Math.round(file.size / 1024)} KB)
          </div>
        )}
      </div>

      {/* Parse Errors */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Feil</h3>
          <ul className="list-disc list-inside text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Validation Results */}
      {validationResults && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Valideringsresultater</h3>

          {/* Missing Columns */}
          {validationResults.missingColumns.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-medium text-yellow-700 mb-2">
                Manglende påkrevde kolonner
              </h4>
              <ul className="list-disc list-inside text-yellow-600">
                {validationResults.missingColumns.map((col, index) => (
                  <li key={index}>{col}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Unexpected Columns */}
          {validationResults.unexpectedColumns.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-blue-700 mb-2">
                Uventede kolonner (vil bli ignorert)
              </h4>
              <ul className="list-disc list-inside text-blue-600">
                {validationResults.unexpectedColumns.map((col, index) => (
                  <li key={index}>{col}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Row Errors */}
          {validationResults.rowErrors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-700 mb-2">
                Datavalideringsfeil
              </h4>
              <div className="max-h-64 overflow-y-auto">
                {validationResults.rowErrors.map((rowError, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="mb-3 pb-3 border-b border-red-100 last:border-b-0"
                  >
                    <p className="font-medium">Rad {rowError.rowIndex}:</p>
                    <ul className="list-disc list-inside text-red-600 ml-4">
                      {rowError.errors.map((error, errorIndex) => (
                        <li key={errorIndex}>
                          Kolonne &quot;{error.column}&quot;: {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {validationResults.missingColumns.length === 0 &&
            validationResults.rowErrors.length === 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-700">
                  CSV validert vellykket med {data?.length || 0} rader med data.
                </p>
              </div>
            )}
        </div>
      )}

      {/* Success - Submit Button */}
      {data && (
        <div className="flex justify-end">
          <button
            onClick={async () => {
              try {
                await onDataSubmit(data);
                resetForm();
              } catch (error) {
                console.error("Error saving data:", error);
                alert("Failed to save data. Please try again.");
              }
            }}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Lagre data
          </button>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
