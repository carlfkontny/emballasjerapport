import { Form, redirect } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import { prisma } from "../../lib/prisma";
import type { Route } from "./+types/registrer_tiltak";

export async function action(args: Route.ActionArgs) {
  const auth = await getAuth(args);
  const company = auth.sessionClaims?.company as string;
  if (!company) return new Response("Unauthorized", { status: 401 });
  const formData = await args.request.formData();

  const typeTiltak = formData.get("typeTiltak") as string;
  const kortBeskrivelse = formData.get("kortBeskrivelse") as string;
  const langBeskrivelse = formData.get("langBeskrivelse") as string;
  const datoIverksatt = new Date(formData.get("datoIverksatt") as string);

  if (
    !typeTiltak ||
    !kortBeskrivelse ||
    !langBeskrivelse ||
    !datoIverksatt ||
    !company
  ) {
    throw new Error("Alle felt må fylles ut");
  }

  await prisma.tiltak.create({
    data: {
      typeTiltak,
      kortBeskrivelse,
      langBeskrivelse,
      datoIverksatt,
      company,
    },
  });

  return redirect("/");
}

export default function RegistrerTiltak() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Registrer nytt tiltak</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label
            htmlFor="typeTiltak"
            className="block text-sm font-medium text-gray-700"
          >
            Type tiltak
          </label>
          <input
            type="text"
            id="typeTiltak"
            name="typeTiltak"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="kortBeskrivelse"
            className="block text-sm font-medium text-gray-700"
          >
            Kort beskrivelse
          </label>
          <input
            type="text"
            id="kortBeskrivelse"
            name="kortBeskrivelse"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="langBeskrivelse"
            className="block text-sm font-medium text-gray-700"
          >
            Lang beskrivelse
          </label>
          <textarea
            id="langBeskrivelse"
            name="langBeskrivelse"
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="datoIverksatt"
            className="block text-sm font-medium text-gray-700"
          >
            Dato iverksatt
          </label>
          <input
            type="month"
            id="datoIverksatt"
            name="datoIverksatt"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Registrer tiltak
        </button>
      </Form>
    </div>
  );
}
