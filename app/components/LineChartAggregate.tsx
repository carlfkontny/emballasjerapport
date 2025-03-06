"use client";

/* import { TrendingDown, TrendingUp } from "lucide-react"; */
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  /* CardFooter, */
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { beregnProsentVekst } from "~/lib/prosentVekst";
import type { Tiltak } from "@prisma/client";
// const chartData = [
//   { year: "2022", "Antall drikkebegre og matbeholdere": 186 },
//   { year: "2023", "Antall drikkebegre og matbeholdere": 305 },
//   { year: "2024", "Antall drikkebegre og matbeholdere": 237 },
// ];

const chartConfig = (companyName: string) => {
  return {
    numberSoldCompany: {
      label: `${companyName}`,
      color: "#81b29a",
    },
    numberSoldAll: {
      label: "Plastpartnerskapet",
      color: "#000000",
    },
  } satisfies ChartConfig;
};

type SalesByYear = {
  year: number;
  numberSold: number;
};

export type SalesByYearCombined = {
  year: number;
  numberSoldCompany?: number;
  numberSoldAll?: number;
  prosentVekstCompany?: number;
  prosentVekstAll?: number;
};

export function LineChartAggregate({
  salesByYearCompany,
  salesByYearAll,
  companyName,
  tiltak,
}: {
  salesByYearCompany: SalesByYear[];
  salesByYearAll: SalesByYear[];
  companyName: string;
  tiltak: Tiltak[];
}) {
  const salesByYearCombined: SalesByYearCombined[] = salesByYearAll.map(
    (sale) => ({
      year: sale.year,
      numberSoldCompany:
        salesByYearCompany.find((s) => s.year === sale.year)?.numberSold ||
        undefined,
      numberSoldAll: sale.numberSold,
    })
  );
  const salesByYearWith2026 = [
    ...salesByYearCombined,
    {
      year: 2026,
      numberSoldCompany: undefined,
      numberSoldAll: undefined,
    },
  ];

  return salesByYearCombined?.length > 0 ? (
    <LineChartAggregateWithData
      salesByYearCombined={salesByYearWith2026}
      chartConfig={chartConfig(companyName)}
      tiltak={tiltak}
    />
  ) : (
    <NoData />
  );
}

function LineChartAggregateWithData({
  salesByYearCombined,
  chartConfig,
  tiltak,
}: {
  salesByYearCombined: SalesByYearCombined[];
  chartConfig: ChartConfig;
  tiltak: Tiltak[];
}) {
  const [unit, setUnit] = useState<"prosent" | "antall">("prosent");
  const [chartData, setChartData] = useState<SalesByYearCombined[]>([]);
  useEffect(() => {
    if (unit === "prosent") {
      try {
        setChartData(beregnProsentVekst(salesByYearCombined));
      } catch (error) {
        setChartData([]);
        console.error("Error calculating percentage growth:", error);
      }
    } else {
      setChartData(salesByYearCombined);
    }
  }, [salesByYearCombined, unit]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Antall solgte drikkebegre og matbeholdere</CardTitle>
            <CardDescription>2022 - 2026</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            Velg målenhet:
            <button
              className={`rounded-md px-3 py-1 text-sm ${
                unit === "prosent"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => setUnit("prosent")}
            >
              % endring
            </button>
            <button
              className={`rounded-md px-3 py-1 text-sm ${
                unit === "antall"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => setUnit("antall")}
            >
              Antall enheter
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 0,
              right: 70,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent labelFormatter={() => `Solgte enheter`} />
              }
            />
            {tiltak.map((tiltak) => (
              <ReferenceLine
                key={tiltak.id}
                x={tiltak.datoIverksatt.getFullYear()}
                stroke="green"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: tiltak.kortBeskrivelse,
                  position: "top",
                  offset: 10,
                  style: { fontSize: "12px" },
                }}
              />
            ))}
            {unit === "prosent" && (
              <ReferenceLine
                y={50}
                stroke="#e76f51"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: "Mål i 2026: -50%",
                  position: "right",
                  offset: 10,
                  style: { fontSize: "12px" },
                }}
              />
            )}
            <Line
              dataKey={
                unit === "prosent" ? "prosentVekstCompany" : "numberSoldCompany"
              }
              type="monotone"
              stroke={chartConfig["numberSoldCompany"].color}
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey={unit === "prosent" ? "prosentVekstAll" : "numberSoldAll"}
              type="monotone"
              stroke={chartConfig["numberSoldAll"].color}
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
function NoData() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ingen data tilgjengelig</CardTitle>
      </CardHeader>
    </Card>
  );
}
