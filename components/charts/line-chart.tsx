"use client";

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
          tickFormatter={(value) => value.slice(5)} // Show only MM
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#32373c" }}
          tickFormatter={valueFormatter}
          width={60}
        />
        <Tooltip
          formatter={(value) => [valueFormatter(value as number), "Value"]}
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
