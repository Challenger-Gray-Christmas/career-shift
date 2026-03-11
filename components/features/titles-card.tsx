import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TitleRanking } from "@/lib/data/types";

interface TitlesCardProps {
  data: TitleRanking[];
}

export function TitlesCard({ data }: TitlesCardProps) {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, 10);

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
            <span className="text-right">Postings (18mo)</span>
            <span className="text-right">Med. Salary</span>
          </div>
          {displayData.map((title) => (
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
        {data.length > 10 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-xs text-gray-500"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `Show all ${data.length} titles`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
