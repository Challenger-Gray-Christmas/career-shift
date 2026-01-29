"use client";

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTH_ABBREV = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonthLabel(value: string): string {
  // Handle YYYY-MM format (e.g., "2025-01" -> "Jan '25")
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");
    const monthIndex = parseInt(month, 10) - 1;
    return `${MONTH_ABBREV[monthIndex]} '${year.slice(2)}`;
  }
  // Handle 4-digit year format (e.g., "2025" -> "2025")
  return value;
}

interface LineChartProps {
  data: { month: string; value: number }[];
  valueFormatter?: (value: number) => string;
  color?: string;
}

export function LineChart({ data, valueFormatter = (v) => v.toString(), color = "#cd995c" }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "#32373c" }}
          tickFormatter={formatMonthLabel}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#32373c" }}
          tickFormatter={valueFormatter}
          width={60}
        />
        <Tooltip
          formatter={(value) => [valueFormatter(value as number), "Value"]}
          labelFormatter={formatMonthLabel}
          contentStyle={{ borderColor: "#eaeaea" }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 0, r: 3 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
