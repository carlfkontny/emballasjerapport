import { prisma } from "../../lib/prisma";
import { type Tiltak } from "@prisma/client";

import type { Route } from "./+types/registrer_mengder";
import { getAuth } from "@clerk/react-router/ssr.server";

export async function loader(args: Route.LoaderArgs) {
  const auth = await getAuth(args);
  const company = auth.sessionClaims?.company as string;
  if (!company) return new Response("Unauthorized", { status: 401 });
  const tiltak = await prisma.tiltak.findMany({
    where: { company },
  });

  return new Response(toCSV(tiltak), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=tiltak.csv",
    },
  });
}

function toCSV(tiltak: Tiltak[]) {
  const headers = [
    "Dato",
    "Type tiltak",
    "Kort beskrivelse",
    "Lengre beskrivelse",
  ].join(";");
  const data = tiltak
    .map(
      (tiltak) =>
        `${tiltak.datoIverksatt.toLocaleDateString("nb-NO")};${
          tiltak.typeTiltak
        };${tiltak.kortBeskrivelse};${tiltak.langBeskrivelse}`
    )
    .join("\n");
  return `${headers}\n${data}`;
}
