"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp, ExternalLink, MapPin, Calendar, Building2, Loader2 } from "lucide-react";
import { useRegionJobs } from "@/lib/hooks";
import type { RegionRanking } from "@/lib/data/types";

interface RegionsCardProps {
  data: RegionRanking[];
  occupationName?: string;
}

export function RegionsCard({ data, occupationName }: RegionsCardProps) {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const regionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Filter by search query first
  const filteredData = searchQuery
    ? data.filter((region) =>
        region.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  // Then apply show/hide toggle
  const displayData = showAll ? filteredData : filteredData.slice(0, 10);
  const maxPostings = Math.max(...data.map(d => d.unique_postings));

  const handleRegionClick = (regionName: string) => {
    const isClosing = expandedRegion === regionName;
    setExpandedRegion(isClosing ? null : regionName);

    if (!isClosing) {
      setTimeout(() => {
        regionRefs.current[regionName]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 320);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Regions</CardTitle>
        <p className="text-xs text-gray-500">Unique job postings in the last 18 months (click to view active openings)</p>
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

        <div className="space-y-0">
          {displayData.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No regions found matching &quot;{searchQuery}&quot;
            </p>
          ) : (
            displayData.map((region, index) => (
              <RegionRow
                key={region.name}
                ref={(el) => {
                  regionRefs.current[region.name] = el;
                }}
                region={region}
                index={index}
                maxPostings={maxPostings}
                occupationName={occupationName}
                isExpanded={expandedRegion === region.name}
                onToggle={() => handleRegionClick(region.name)}
              />
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

interface RegionRowProps {
  region: RegionRanking;
  index: number;
  maxPostings: number;
  occupationName?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const RegionRow = React.forwardRef<HTMLDivElement, RegionRowProps>(
  ({ region, index, maxPostings, occupationName, isExpanded, onToggle }, ref) => {
  const { data, loading, error } = useRegionJobs({
    regionName: region.name,
    occupationName,
    enabled: isExpanded,
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return null;
    }
  };

  return (
    <div ref={ref} className="border-b border-gray-100 last:border-0 scroll-mt-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
        title={`Click to view active openings in ${region.name}`}
      >
        <span className="text-xs text-gray-400 w-5 text-right">{index + 1}</span>
        {isExpanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-gold flex-shrink-0" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-charcoal truncate text-left" title={region.name}>
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
          {region.unique_postings.toLocaleString()}
        </span>
      </button>

      {/* Expanded Job Listings */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? '500px' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div className="pl-12 pr-2 pb-3 pt-1">
          {loading && (
            <div className="flex items-center justify-center py-8 min-h-[120px]">
              <Loader2 className="h-5 w-5 animate-spin text-gold" />
            </div>
          )}

          {error && (
            <div className="text-xs text-red-600 py-4 min-h-[120px]">
              {error}
            </div>
          )}

          {!loading && !error && data && (
            <div className="min-h-[120px]">
              <p className="text-xs text-gray-500 mb-3">
                {data.count} active job{data.count !== 1 ? 's' : ''} found
              </p>
              {data.count === 0 ? (
                <p className="text-xs text-gray-500 py-3">No active openings found in this region</p>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto">
                  {data.jobs.map((job: any) => (
                    <div
                      key={job.id}
                      className="bg-white border border-gray-200 rounded p-3 hover:border-gold/50 transition-colors text-xs"
                    >
                      <h4 className="font-medium text-charcoal text-sm mb-1.5">{job.title}</h4>

                      <div className="space-y-1 text-gray-600 mb-2">
                        {job.company && (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3 w-3 flex-shrink-0" />
                            <span>{job.company}</span>
                          </div>
                        )}
                        {job.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {formatDate(job.posted_date) && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span>Posted {formatDate(job.posted_date)}</span>
                          </div>
                        )}
                      </div>

                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
                        >
                          View Job
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

RegionRow.displayName = 'RegionRow';
