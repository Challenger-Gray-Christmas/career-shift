import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HorizontalBarChart } from "@/components/charts/bar-chart";
import type { RegionRanking } from "@/lib/data/types";

interface RegionsCardProps {
  data: RegionRanking[];
}

export function RegionsCard({ data }: RegionsCardProps) {
  const chartData = data.slice(0, 10).map(item => ({
    name: item.name,
    value: item.unique_postings,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Regions</CardTitle>
        <p className="text-xs text-gray-500">By unique job postings</p>
      </CardHeader>
      <CardContent>
        <HorizontalBarChart data={chartData} />
      </CardContent>
    </Card>
  );
}
