import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart } from "@/components/charts/donut-chart";
import type { EducationRanking } from "@/lib/data/types";

interface EducationCardProps {
  data: EducationRanking[];
}

export function EducationCard({ data }: EducationCardProps) {
  const chartData = data.map(item => ({
    name: item.name,
    value: item.unique_postings,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Education Requirements</CardTitle>
        <p className="text-xs text-gray-500">Distribution by degree level</p>
      </CardHeader>
      <CardContent>
        <DonutChart data={chartData} />
      </CardContent>
    </Card>
  );
}
