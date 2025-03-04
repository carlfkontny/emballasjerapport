import { getAuth } from "@clerk/react-router/ssr.server";
import { Card } from "~/components/Card";
/* import { LineChart } from "~/components/LineChart"; */
import type { Route } from "../+types/root";
import { prisma } from "../../lib/prisma";
import { useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { Link } from "react-router-dom";
import { LineChartDetails } from "~/components/LineChartDetails";
import { LineChartAggregate } from "~/components/LineChartAggregate";
export function meta() {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Analytics Dashboard" },
  ];
}

const monthNames = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export async function loader(args: Route.LoaderArgs) {
  const auth = await getAuth(args);
  const email = auth.sessionClaims?.email as string;
  if (!email) return new Response("Unauthorized", { status: 401 });

  // example database request

  // sum salesData.numberSold
  const totalSold = await prisma.salesData.aggregate({
    _sum: {
      numberSold: true,
    },
  });

  // number sold per year
  const salesByYearRaw = await prisma.salesData.groupBy({
    by: ["saleDate"],
    _sum: {
      numberSold: true,
    },
    orderBy: {
      saleDate: "asc",
    },
  });

  const salesByYear = Object.values(
    salesByYearRaw.reduce((acc, { saleDate, _sum }) => {
      const year = saleDate.getFullYear();
      if (!acc[year]) {
        acc[year] = {
          year,
          numberSold: _sum.numberSold || 0,
        };
      } else {
        acc[year].numberSold += _sum.numberSold || 0;
      }
      return acc;
    }, {} as Record<number, { year: number; numberSold: number }>)
  );

  // number sol per month
  const currentYear = new Date().getFullYear();

  const salesByMonthRaw = await prisma.salesData.groupBy({
    by: ["saleDate"],
    _sum: {
      numberSold: true,
    },
    where: {
      saleDate: {
        gte: new Date(currentYear, 0, 1), // Start of the current year
        lt: new Date(currentYear + 1, 0, 1), // Start of next year
      },
    },
    orderBy: {
      saleDate: "asc",
    },
  });

  const salesByMonth = salesByMonthRaw.map(({ saleDate, _sum }) => ({
    month: monthNames[saleDate.getMonth()],
    numberSold: _sum.numberSold || 0,
  }));

  console.log({ salesByYear, salesByMonth });

  return { totalSold, salesByYear, salesByMonth };
}

export default function Index() {
  const { totalSold, salesByYear, salesByMonth } =
    useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Mine solgte kopper og matbeholdere"
            value={totalSold._sum.numberSold ?? 0}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.171-.879-1.172-2.303 0-3.182C10.536 7.719 11.768 7.5 12 7.5c.725 0 1.45.22 2.003.659"
                />
              </svg>
            }
          />
          <Card
            title="Mine solgte kopper og matbeholdere"
            value={totalSold._sum.numberSold ?? 0}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.171-.879-1.172-2.303 0-3.182C10.536 7.719 11.768 7.5 12 7.5c.725 0 1.45.22 2.003.659"
                />
              </svg>
            }
          />
          <Card
            title="Active Users"
            value={42}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            }
          />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-lg bg-white/80 p-6 shadow-sm dark:bg-gray-800/80">
            <LineChartAggregate salesByYear={salesByYear} />
          </div>
          <div className="rounded-lg bg-white/80 p-6 shadow-sm dark:bg-gray-800/80">
            <LineChartDetails salesByMonth={salesByMonth} />
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/registrer_mengder" className="w-36">
            <Button className="w-full">Registrer mengder</Button>
          </Link>
          <Link to="/statistics" className="w-36">
            <Button variant="outline" className="w-full">
              Registrer tiltak
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
