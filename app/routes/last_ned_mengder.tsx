import { getAuth } from "@clerk/react-router/ssr.server";
import { prisma } from "../../lib/prisma";
import { type SalesData } from "@prisma/client";
import type { Route } from "./+types/registrer_mengder";

export async function loader(args: Route.LoaderArgs) {
  const auth = await getAuth(args);
  const company = auth.sessionClaims?.company as string;
  if (!company) return new Response("Unauthorized", { status: 401 });
  const mengder = await prisma.salesData.findMany({
    where: { company },
  });

  return new Response(toCSV(mengder), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=mengder.csv",
    },
  });
}

function toCSV(mengder: SalesData[]) {
  const headers = [
    "Salgsdato",
    "Kategori",
    "Helt/delvis av plast",
    "Antall solgt",
    "Tonn plast",
  ].join(";");
  const data = mengder
    .map(
      (mengde) =>
        `${mengde.saleDate.toLocaleDateString("nb-NO")};${mengde.category};${
          mengde.plasticType
        };${mengde.numberSold};${mengde.tonsOfPlastic}`
    )
    .join("\n");
  return `${headers}\n${data}`;
}
