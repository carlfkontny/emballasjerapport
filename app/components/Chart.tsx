"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";

const chartData = [
  {
    month: "Jan 2022",
    drikkebegre_helt: 120,
    drikkebegre_delvis: 80,
    matbeholder_helt: 90,
    matbeholder_delvis: 60,
  },
  {
    month: "Feb 2022",
    drikkebegre_helt: 150,
    drikkebegre_delvis: 100,
    matbeholder_helt: 110,
    matbeholder_delvis: 70,
  },
  {
    month: "Mar 2022",
    drikkebegre_helt: 135,
    drikkebegre_delvis: 95,
    matbeholder_helt: 100,
    matbeholder_delvis: 65,
  },
  {
    month: "Apr 2022",
    drikkebegre_helt: 140,
    drikkebegre_delvis: 90,
    matbeholder_helt: 95,
    matbeholder_delvis: 75,
  },
  {
    month: "Mai 2022",
    drikkebegre_helt: 160,
    drikkebegre_delvis: 110,
    matbeholder_helt: 120,
    matbeholder_delvis: 80,
  },
  {
    month: "Jun 2022",
    drikkebegre_helt: 180,
    drikkebegre_delvis: 120,
    matbeholder_helt: 130,
    matbeholder_delvis: 85,
  },
  {
    month: "Jul 2022",
    drikkebegre_helt: 200,
    drikkebegre_delvis: 130,
    matbeholder_helt: 140,
    matbeholder_delvis: 90,
  },
  {
    month: "Aug 2022",
    drikkebegre_helt: 190,
    drikkebegre_delvis: 125,
    matbeholder_helt: 135,
    matbeholder_delvis: 88,
  },
  {
    month: "Sep 2022",
    drikkebegre_helt: 170,
    drikkebegre_delvis: 115,
    matbeholder_helt: 125,
    matbeholder_delvis: 82,
  },
  {
    month: "Okt 2022",
    drikkebegre_helt: 155,
    drikkebegre_delvis: 105,
    matbeholder_helt: 115,
    matbeholder_delvis: 76,
  },
  {
    month: "Nov 2022",
    drikkebegre_helt: 145,
    drikkebegre_delvis: 98,
    matbeholder_helt: 108,
    matbeholder_delvis: 71,
  },
  {
    month: "Des 2022",
    drikkebegre_helt: 165,
    drikkebegre_delvis: 112,
    matbeholder_helt: 122,
    matbeholder_delvis: 81,
  },
  {
    month: "Jan 2023",
    drikkebegre_helt: 175,
    drikkebegre_delvis: 118,
    matbeholder_helt: 128,
    matbeholder_delvis: 84,
  },
  {
    month: "Feb 2023",
    drikkebegre_helt: 185,
    drikkebegre_delvis: 124,
    matbeholder_helt: 134,
    matbeholder_delvis: 87,
  },
];

const chartConfig = {
  drikkebegre_helt: {
    label: "Drikkebegre (Helt av plast)",
    color: "#93c5fd",
  },
  drikkebegre_delvis: {
    label: "Drikkebegre (Delvis av plast)",
    color: "#bfdbfe",
  },
  matbeholder_helt: {
    label: "Matbeholdere (Helt av plast)",
    color: "#a78bfa",
  },
  matbeholder_delvis: {
    label: "Matbeholdere (Delvis av plast)",
    color: "#c4b5fd",
  },
} satisfies ChartConfig;

export function Component() {
  return (
    <div className="flex flex-col gap-4 pt-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Utvikling over tid</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Månedlig oversikt over solgte drikkebegre og matbeholdere av plast
          </p>
        </div>
        <div className="flex gap-2">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Velg målenhet:
          </p>  
          <button className="rounded-md border px-3 py-1 text-base hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            Antall enheter  
          </button>
          <button className="rounded-md border px-3 py-1 text-base hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            Prosent endring
          </button>
        </div>
      </div>

      <ChartContainer
        config={chartConfig}
        className="aspect-[4/3] sm:aspect-[16/9] w-full bg-transparent pt-20"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 10,
            right: 5,
            bottom: 40,
            left: 0,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fontSize: 15 }}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            tickMargin={5}
            axisLine={false}
            tick={{ fontSize: 15 }}
            width={30}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend
            content={
              <ChartLegendContent className="flex-wrap text-[10px] sm:text-base" />
            }
          />
          <Bar
            dataKey="drikkebegre_helt"
            stackId="drikkebegre"
            fill="var(--color-drikkebegre_helt)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="drikkebegre_delvis"
            stackId="drikkebegre"
            fill="var(--color-drikkebegre_delvis)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="matbeholder_helt"
            stackId="matbeholder"
            fill="var(--color-matbeholder_helt)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="matbeholder_delvis"
            stackId="matbeholder"
            fill="var(--color-matbeholder_delvis)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="rounded-md border p-3 dark:border-gray-700 text-center">
          <p className="font-medium">Totalt antall drikkebegre</p>
          <p className="mt-1 text-xl sm:text-2xl font-semibold">
            {chartData
              .reduce(
                (acc, curr) =>
                  acc + curr.drikkebegre_helt + curr.drikkebegre_delvis,
                0
              )
              .toLocaleString()}
          </p>
        </div>
        <div className="rounded-md border p-3 dark:border-gray-700 text-center">
          <p className="font-medium">Totalt antall matbeholdere</p>
          <p className="mt-1 text-2xl font-semibold">
            {chartData
              .reduce(
                (acc, curr) =>
                  acc + curr.matbeholder_helt + curr.matbeholder_delvis,
                0
              )
              .toLocaleString()}
          </p>
        </div>
      </div> */}
    </div>
  );
}
