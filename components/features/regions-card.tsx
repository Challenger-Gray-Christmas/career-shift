import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { RegionRanking } from "@/lib/data/types";

interface RegionsCardProps {
  data: RegionRanking[];
}

export function RegionsCard({ data }: RegionsCardProps) {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter by search query first
  const filteredData = searchQuery
    ? data.filter((region) =>
        region.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  // Then apply show/hide toggle
  const displayData = showAll ? filteredData : filteredData.slice(0, 10);
  const maxPostings = Math.max(...data.map(d => d.unique_postings));

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Regions</CardTitle>
        <p className="text-xs text-gray-500">By unique job postings</p>
      </CardHeader>
      <CardContent>
        {/* Search input */}
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        <div className="space-y-2">
          {displayData.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No regions found matching "{searchQuery}"
            </p>
          ) : (
            displayData.map((region, index) => (
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
          ))
          )}
        </div>
        {!searchQuery && filteredData.length > 10 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-xs text-gray-500"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `Show all ${filteredData.length} regions`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
