import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/line-chart";
import { filterCurrentMonth } from "@/lib/utils/filter-timeseries";
import type { PostingsTrend } from "@/lib/data/types";

interface PostingsTrendCardProps {
  data: PostingsTrend;
}

export function PostingsTrendCard({ data }: PostingsTrendCardProps) {
  const filteredTimeseries = filterCurrentMonth(data.timeseries);

  const chartData = filteredTimeseries.month.map((month, i) => ({
    month,
    value: filteredTimeseries.values[i],
  }));

  const formatPostings = (value: number) => `${(value / 1000).toFixed(0)}k`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Job Postings Trend</CardTitle>
        <p className="text-2xl font-bold text-gold">{data.total.toLocaleString()}</p>
        <p className="text-xs text-gray-500">Total Unique Postings (Last 18 Months)</p>
      </CardHeader>
      <CardContent>
        <LineChart data={chartData} valueFormatter={formatPostings} color="#32373c" />
      </CardContent>
    </Card>
  );
}
