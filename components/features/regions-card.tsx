import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RegionRanking } from "@/lib/data/types";

interface RegionsCardProps {
  data: RegionRanking[];
}

export function RegionsCard({ data }: RegionsCardProps) {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, 10);
  const maxPostings = Math.max(...data.map(d => d.unique_postings));

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Regions</CardTitle>
        <p className="text-xs text-gray-500">By unique job postings</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayData.map((region, index) => (
            <div key={region.name} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-5 text-right">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-charcoal truncate" title={region.name}>
                  {region.name}
                </p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-gold/60"
                    style={{ width: `${(region.unique_postings / maxPostings) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-charcoal tabular-nums">
                {formatNumber(region.unique_postings)}
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
            {showAll ? "Show less" : `Show all ${data.length} regions`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
