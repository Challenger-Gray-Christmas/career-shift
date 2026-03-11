import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EducationRanking } from "@/lib/data/types";

interface EducationCardProps {
  data: EducationRanking[];
}

export function EducationCard({ data }: EducationCardProps) {
  const total = data.reduce((sum, item) => sum + item.unique_postings, 0);
  const maxPostings = Math.max(...data.map(d => d.unique_postings));

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercent = (num: number) => `${((num / total) * 100).toFixed(1)}%`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Education Requirements</CardTitle>
        <p className="text-xs text-gray-500">Distribution by degree level (last 18 months)</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-charcoal truncate" title={item.name}>
                    {item.name}
                  </p>
                  <span className="text-sm font-medium text-charcoal ml-2">
                    {formatPercent(item.unique_postings)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-gold"
                    style={{
                      width: `${(item.unique_postings / maxPostings) * 100}%`,
                      opacity: 1 - (index * 0.15)
                    }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500 tabular-nums w-16 text-right">
                {formatNumber(item.unique_postings)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
