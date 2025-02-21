import { useState } from "react";
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Generate monthly data from Jan 2022 to Mar 2025
const generateData = () => {
  const data = [];
  let currentValue = 100;
  let baseUnits = 1000; // Base units sold in 2022

  for (let year = 2022; year <= 2025; year++) {
    const monthsToInclude = year === 2025 ? 3 : 12;

    for (let month = 1; month <= monthsToInclude; month++) {
      const change = Math.floor(Math.random() * 5) - 2;
      currentValue = Math.max(currentValue + change, 50);

      // Calculate actual units based on the percentage
      const units = Math.round((baseUnits * currentValue) / 100);

      data.push({
        name: `${month.toString().padStart(2, "0")}/${year}`,
        percentage: currentValue,
        units,
        goal: 50,
      });
    }
  }

  // Add remaining months with only goal value
  for (let year = 2025; year <= 2026; year++) {
    const startMonth = year === 2025 ? 4 : 1;
    for (let month = startMonth; month <= 12; month++) {
      data.push({
        name: `${month.toString().padStart(2, "0")}/${year}`,
        goal: 50,
      });
    }
  }

  return data;
};

const data = generateData();

export function LineChart() {
  const [showUnits, setShowUnits] = useState(false);

  return (
    <div className="h-[400px] rounded-lg bg-white p-12 shadow-sm dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Utvikling over tid
          </h2>
          <h3 className="text-sm text-gray-500">
            For Plastpartnerskapet og egen virksomhet{" "}
            {showUnits ? "(enheter solgt)" : "(indeks, 2022 = 100)"}
          </h3>
        </div>
        <button
          onClick={() => setShowUnits(!showUnits)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Vis {showUnits ? "prosent" : "enheter"}
        </button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval={11}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}${showUnits ? "" : "%"}`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={showUnits ? "units" : "percentage"}
            stroke="green"
            strokeWidth={2}
            dot={true}
          />
          <Line
            type="monotone"
            dataKey="goal"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="4 8"
            dot={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
