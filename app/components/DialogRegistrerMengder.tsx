import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CSVUploader from "@/components/CSVUploader";
import type { CSVRow } from "@/components/CSVUploader";
import { useState } from "react";
import { useRevalidator } from "react-router-dom";
import type { SalesData } from "@prisma/client";

type ActionData =
  | {
      error: string | null;
      failedRecords: (CSVRow & { error: string })[] | null;
      successfulRecords: SalesData[] | null;
    }
  | undefined;

export function DialogRegistrerMengder() {
  const [actionData, setActionData] = useState<ActionData>();
  const [open, setOpen] = useState(false);
  const revalidator = useRevalidator();

  const handleCSVData = async (data: CSVRow[]) => {
    try {
      const formData = new FormData();
      formData.append("csvData", JSON.stringify(data));

      const response = await fetch("/registrer_mengder", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setOpen(false);
        revalidator.revalidate();
      } else {
        const errorData = await response.json();
        setActionData(errorData);
      }
    } catch (_error) {
      setActionData({
        error: "Failed to process request",
        failedRecords: null,
        successfulRecords: null,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="min-w-[180px] bg-gray-800 text-white py-2.5 px-6 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium shadow-sm">
        Registrer mengder
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-700 dark:text-gray-100">
            Registrer Mengder
          </DialogTitle>
          <DialogDescription>
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
            <CSVUploader onDataSubmit={handleCSVData} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
