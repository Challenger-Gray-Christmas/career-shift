import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TitleRanking } from "@/lib/data/types";

interface TitlesCardProps {
  data: TitleRanking[];
}

export function TitlesCard({ data }: TitlesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Job Titles</CardTitle>
        <p className="text-xs text-gray-500">Common titles for this occupation</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-3 text-xs font-medium text-gray-500 border-b pb-2">
            <span>Title</span>
            <span className="text-right">Postings</span>
            <span className="text-right">Med. Salary</span>
          </div>
          {data.slice(0, 5).map((title) => (
            <div key={title.name} className="grid grid-cols-3 text-sm">
              <span className="text-charcoal truncate">{title.name}</span>
              <span className="text-right text-gray-600">{title.unique_postings.toLocaleString()}</span>
              <span className="text-right text-gold">
                {title.median_salary > 0
                  ? `$${(title.median_salary / 1000).toFixed(0)}k`
                  : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
