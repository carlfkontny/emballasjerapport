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

  for (let year = 2022; year <= 2025; year++) {
    const monthsToInclude = year === 2025 ? 3 : 12; // Only include 3 months for 2025

    for (let month = 1; month <= monthsToInclude; month++) {
      // Random variation between -5 and +15
      const change = Math.floor(Math.random() * 20) - 5;
      currentValue = Math.max(currentValue + change, 50); // Ensure value doesn't go below 50

      data.push({
        name: `${month.toString().padStart(2, "0")}/${year}`,
        value: currentValue,
        goal: 50, // Constant goal line
      });
    }
  }

  // Add remaining months of 2025 and all of 2026 with only goal value
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
  return (
    <div className="h-[400px] rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
        Progress Towards Goal
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval={11} // Show one tick per year
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="goal"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
