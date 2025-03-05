"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
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
  CardFooter,
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

const chartConfig = {
  "Antall drikkebegre og matbeholdere": {
    label: "Antall drikkebegre og matbeholdere",
    color: "#81b29a",
  },
} satisfies ChartConfig;

type SalesByYear = {
  year: number;
  numberSold: number;
};

export function LineChartAggregate({
  salesByYear,
}: {
  salesByYear: SalesByYear[];
}) {
  const thisYear = salesByYear[salesByYear.length - 1] || 0;
  const lastYear = salesByYear[salesByYear.length - 2] || 0;

  const trend = thisYear.numberSold - lastYear.numberSold;

  const trendPercentage = (trend / lastYear.numberSold) * 100;

  const trendDirection = trend > 0 ? "Stigende" : "Synkende";

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Antall solgte drikkebegre og matbeholdere</CardTitle>
            <CardDescription>
              {/* {Math.min(...salesByYear.map((sale) => sale.year))} */}2022-
              {Math.max(...salesByYear.map((sale) => sale.year))}
            </CardDescription>
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
        <ChartContainer config={chartConfig} className="h-[calc(100%-2rem)]">
          <LineChart
            accessibilityLayer
            data={salesByYear}
            margin={{
              top: 20,
              left: 12,
              right: 110,
              bottom: 20,
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
              dataKey="numberSold"
              type="monotone"
              stroke={chartConfig["Antall drikkebegre og matbeholdere"].color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trendDirection} trend på {trendPercentage.toFixed(0)}% i{" "}
              {thisYear.year}
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            {/* <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div> */}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
