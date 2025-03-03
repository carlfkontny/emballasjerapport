import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/DatePicker";
import CSVUploader from "@/components/CSVUploader";
import { useState } from "react";
import type { CSVRow } from "@/components/CSVUploader";
import { prisma } from "../../lib/prisma";
import type { SalesData } from "@prisma/client";
import type { Route } from "./+types/registrer_mengder";

type ActionData =
  | undefined
  | {
      error: string | null;
      failedRecords: (CSVRow & { error: string })[] | null;
      successfulRecords: SalesData[] | null;
    };

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const csvData = JSON.parse(formData.get("csvData") as string) as CSVRow[];

    if (!Array.isArray(csvData)) {
      return new Response(
        JSON.stringify({ error: "Data must be an array of sales records" }),
        { status: 400 }
      );
    }

    // Process each record
    const results = await Promise.all(
      csvData.map(async (record) => {
        try {
          return await prisma.salesData.create({
            data: {
              saleDate: new Date(record["Dato for salg"]),
              category: record.Kategori,
              plasticType: record.Plastinnhold,
              numberSold: Number(record["Number sold"]),
              tonsOfPlastic: Number(record["Tons of plastic"]) || null,
            },
          });
        } catch (error) {
          console.error("Error creating record:", error);
          return { error: "Failed to create record", record };
        }
      })
    );

    // Check if any records failed to create
    const failedRecords = results.filter(
      (result): result is { error: string; record: CSVRow } => "error" in result
    );

    if (failedRecords.length > 0) {
      return new Response(
        JSON.stringify({
          message: "Some records failed to create",
          failedRecords,
          successfulRecords: results.filter(
            (result): result is SalesData => !("error" in result)
          ),
        }),
        { status: 207 }
      );
    }

    // Redirect to front page on success
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500 }
    );
  }
}

export default function RegistrerMengder({
  actionData: ad,
}: Route.ComponentProps) {
  const actionData = ad as ActionData;
  const [showCSVUploader, setShowCSVUploader] = useState(false);

  const handleCSVData = async (data: CSVRow[]) => {
    const formData = new FormData();
    formData.append("csvData", JSON.stringify(data));

    // The form submission will be handled by React Router's Form component
    // We just need to set the data in the form
    const form = document.createElement("form");
    form.method = "post";
    formData.forEach((value, key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-100">
            Registrer Mengder
          </h1>
          <Button
            onClick={() => setShowCSVUploader(!showCSVUploader)}
            variant="outline"
          >
            {showCSVUploader ? "Manuell registrering" : "Last opp CSV"}
          </Button>
        </div>

        {actionData && (
          <div className="mb-4">
            {actionData.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                <h3 className="font-medium mb-2">Feil ved opplasting</h3>
                <p>{actionData.error}</p>
                {actionData.failedRecords &&
                  actionData.failedRecords.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">
                        Feil i følgende rader:
                      </h4>
                      <ul className="list-disc list-inside">
                        {actionData.failedRecords.map((record, index) => (
                          <li key={index}>
                            Rad {index + 1}: {record.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ) : null}
          </div>
        )}

        {showCSVUploader ? (
          <CSVUploader onDataSubmit={handleCSVData} />
        ) : (
          <Form>
            <div className="mt-6 space-y-8">
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100">
                  Velg tidsperiode
                </h2>
                <DatePickerWithRange className="w-full" />
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100">
                  Hva vil du registrere?
                </h2>
                <RadioGroup defaultValue="Matbeholdere">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Matbeholdere" id="Matbeholdere" />
                      <label
                        htmlFor="Matbeholdere"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Matbeholdere
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Drikkebegre" id="Drikkebegre" />
                      <label
                        htmlFor="Drikkebegre"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Drikkebegre
                      </label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100">
                  Hva er de laget av?
                </h2>
                <RadioGroup defaultValue="Helt av plast">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Helt av plast"
                        id="Helt av plast"
                      />
                      <label
                        htmlFor="Helt av plast"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Helt av plast
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Delvis av plast"
                        id="Delvis av plast"
                      />
                      <label
                        htmlFor="Delvis av plast"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Delvis av plast
                      </label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <Button type="submit" className="w-full">
                Lagre
              </Button>

              <Link to="/." className="w-36">
                <Button variant="destructive" className="w-full">
                  Avbryt
                </Button>
              </Link>
            </div>
          </Form>
        )}
      </main>
    </div>
  );
}
