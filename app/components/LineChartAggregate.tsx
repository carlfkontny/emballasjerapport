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

type SalesByYearCombined = {
  year: number;
  numberSoldCompany: number;
  numberSoldAll: number;
};

export function LineChartAggregate({
  salesByYearCompany,
  salesByYearAll,
  companyName,
}: {
  salesByYearCompany: SalesByYear[];
  salesByYearAll: SalesByYear[];
  companyName: string;
}) {
  const salesByYearCombined: SalesByYearCombined[] = salesByYearAll.map(
    (sale) => ({
      year: sale.year,
      numberSoldCompany:
        salesByYearCompany.find((s) => s.year === sale.year)?.numberSold || 0,
      numberSoldAll: sale.numberSold,
    })
  );

  return salesByYearCombined?.length > 0 ? (
    <LineChartAggregateWithData
      salesByYearCombined={salesByYearCombined}
      chartConfig={chartConfig(companyName)}
    />
  ) : (
    <NoData />
  );
}

function LineChartAggregateWithData({
  salesByYearCombined,
  chartConfig,
}: {
  salesByYearCombined: SalesByYearCombined[];
  chartConfig: ChartConfig;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Antall solgte drikkebegre og matbeholdere</CardTitle>
            <CardDescription>2022 - 2026</CardDescription>
          </div>
          {/* <div className="flex items-center gap-2">
            <button className="rounded-md bg-secondary px-3 py-1 text-sm">
              Daily
            </button>
            <button className="rounded-md bg-primary text-primary-foreground px-3 py-1 text-sm">
              Monthly
            </button>
          </div> */}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <LineChart
            accessibilityLayer
            data={salesByYearCombined}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={() => `Solgte enheter`} />} />
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
            <Line
              dataKey="numberSoldCompany"
              type="monotone"
              stroke={chartConfig["numberSoldCompany"].color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="numberSoldAll"
              type="monotone"
              stroke={chartConfig["numberSoldAll"].color}
              strokeWidth={2}
              dot={false}
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
