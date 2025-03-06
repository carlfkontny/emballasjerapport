import { Form, Link, redirect, useLoaderData } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import { prisma } from "../../lib/prisma";
import type { Route } from "./+types/registrer_tiltak";


export async function loader(args: Route.LoaderArgs) {
  const auth = await getAuth(args);
  const company = auth.sessionClaims?.company as string;
  if (!company) return new Response("Unauthorized", { status: 401 });

  const tiltak = await prisma.tiltak.findMany({
    where: {
      company: company,
    },
    orderBy: {
      datoIverksatt: "desc",
    },
  });

  return { tiltak };
}

export async function action(args: Route.ActionArgs) {
  const auth = await getAuth(args);
  const company = auth.sessionClaims?.company as string;
  if (!company) return new Response("Unauthorized", { status: 401 });
  const formData = await args.request.formData();

  const typeTiltak = formData.get("typeTiltak") as string;
  const kortBeskrivelse = formData.get("kortBeskrivelse") as string;
  const langBeskrivelse = formData.get("langBeskrivelse") as string;
  const datoIverksatt = new Date(formData.get("datoIverksatt") as string);
  const intent = formData.get("intent") as string;

  if (intent === "delete") {
    const tiltakId = formData.get("tiltakId") as string;
    if (!tiltakId) throw new Error("Tiltak ID er påkrevd");

    await prisma.tiltak.delete({
      where: { id: parseInt(tiltakId) },
    });

    return redirect("/registrer_tiltak");
  }

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

  return redirect("/registrer_tiltak");
}

export default function RegistrerTiltak() {
  const { tiltak } = useLoaderData<typeof loader>();

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

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="min-w-[180px] bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium shadow-sm"
          >
            Registrer tiltak
          </button>
          <Link to="/">
            <button className="min-w-[180px] bg-gray-800 text-white py-2.5 px-6 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium shadow-sm">
              Tilbake til hovedsiden
            </button>
          </Link>
        </div>
      </Form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Registrerte tiltak</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type tiltak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kort beskrivelse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dato iverksatt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Handling
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tiltak.map((t) => (
                <tr key={t.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {t.typeTiltak}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {t.kortBeskrivelse}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(t.datoIverksatt).toLocaleDateString("nb-NO", {
                      year: "numeric",
                      month: "long",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Form method="post">
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="tiltakId" value={t.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => {
                          if (
                            !confirm(
                              "Er du sikker på at du vil slette dette tiltaket?"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Slett
                      </button>
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
