"use client";

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartProps {
  data: { name: string; value: number }[];
  valueFormatter?: (value: number) => string;
  color?: string;
}

export function HorizontalBarChart({ data, valueFormatter = (v) => v.toLocaleString(), color = "#cd995c" }: BarChartProps) {
  // Truncate long names
  const chartData = data.map(item => ({
    ...item,
    shortName: item.name.length > 25 ? item.name.slice(0, 22) + "..." : item.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 100, bottom: 5 }}>
        <XAxis type="number" tick={{ fontSize: 10, fill: "#32373c" }} tickFormatter={valueFormatter} />
        <YAxis
          type="category"
          dataKey="shortName"
          tick={{ fontSize: 10, fill: "#32373c" }}
          width={95}
        />
        <Tooltip
          formatter={(value) => [valueFormatter(value as number), "Postings"]}
          labelFormatter={(label) => data.find(d => d.name.startsWith(String(label).replace("...", "")))?.name || String(label)}
          contentStyle={{ borderColor: "#eaeaea" }}
        />
        <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
