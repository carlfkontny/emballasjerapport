import { prisma } from "../../lib/prisma";
import { type Tiltak } from "@prisma/client";

export async function loader() {
  const tiltak = await prisma.tiltak.findMany();
  /*legg til where company = company  */
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
