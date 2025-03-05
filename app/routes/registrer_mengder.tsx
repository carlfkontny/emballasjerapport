import CSVUploader from "@/components/CSVUploader";
import type { CSVRow } from "@/components/CSVUploader";
import { prisma } from "../../lib/prisma";
import type { SalesData } from "@prisma/client";
import type { Route } from "./+types/registrer_mengder";
import { getAuth } from "@clerk/react-router/ssr.server";

type ActionData =
  | undefined
  | {
      error: string | null;
      failedRecords: (CSVRow & { error: string })[] | null;
      successfulRecords: SalesData[] | null;
    };

export async function action(args : Route.ActionArgs) {
  const auth = await getAuth(args);
  const company = auth.sessionClaims?.company as string;
  if (!company) return new Response("Unauthorized", { status: 401 });
  try {
    const formData = await args.request.formData();
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
              plasticType: String(record["Helt/delvis av plast"]),
              numberSold: Number(record["Enheter solgt"]),
              tonsOfPlastic: Number(record["Tonn plast"]) || null,
              company: company,
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

        <CSVUploader onDataSubmit={handleCSVData} />
      </main>
    </div>
  );
}
