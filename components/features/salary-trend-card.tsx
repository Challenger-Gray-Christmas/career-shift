import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/line-chart";
import { filterCurrentMonth } from "@/lib/utils/filter-timeseries";
import type { SalaryTrend } from "@/lib/data/types";

interface SalaryTrendCardProps {
  data: SalaryTrend;
}

export function SalaryTrendCard({ data }: SalaryTrendCardProps) {
  const filteredTimeseries = filterCurrentMonth(data.timeseries);

  const chartData = filteredTimeseries.month.map((month, i) => ({
    month,
    value: filteredTimeseries.values[i],
  }));

  const formatSalary = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Salary Trend</CardTitle>
        <p className="text-2xl font-bold text-gold">{formatSalary(data.total)}</p>
        <p className="text-xs text-gray-500">Median Annual Salary</p>
      </CardHeader>
      <CardContent>
        <LineChart data={chartData} valueFormatter={formatSalary} />
      </CardContent>
    </Card>
  );
}
