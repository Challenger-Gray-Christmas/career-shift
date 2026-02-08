"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink, MapPin, Calendar, Loader2 } from "lucide-react";
import { useCompanyJobs } from "@/lib/hooks";
import type { CompanyRanking } from "@/lib/data/types";

interface CompaniesCardProps {
  data: CompanyRanking[];
  occupationName?: string;
}

export function CompaniesCard({ data, occupationName }: CompaniesCardProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const companyRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const displayData = showAll ? data : data.slice(0, 10);

  const handleCompanyClick = (companyName: string) => {
    const isClosing = expandedCompany === companyName;
    setExpandedCompany(isClosing ? null : companyName);

    // Only scroll when opening a new company
    if (!isClosing) {
      setTimeout(() => {
        companyRefs.current[companyName]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 320); // Match the CSS transition duration
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Companies</CardTitle>
        <p className="text-xs text-gray-500">Hiring for this role (click to view openings)</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-3 text-xs font-medium text-gray-500 border-b pb-2">
            <span>Company</span>
            <span className="text-right">Postings</span>
            <span className="text-right">Med. Salary</span>
          </div>
          {displayData.map((company) => (
            <CompanyRow
              key={company.name}
              ref={(el) => {
                companyRefs.current[company.name] = el;
              }}
              company={company}
              occupationName={occupationName}
              isExpanded={expandedCompany === company.name}
              onToggle={() => handleCompanyClick(company.name)}
            />
          ))}
        </div>
        {data.length > 10 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-xs text-gray-500"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `Show all ${data.length} companies`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface CompanyRowProps {
  company: CompanyRanking;
  occupationName?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const CompanyRow = React.forwardRef<HTMLDivElement, CompanyRowProps>(
  ({ company, occupationName, isExpanded, onToggle }, ref) => {
  const { data, loading, error } = useCompanyJobs({
    companyName: company.name,
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
      <div className="grid grid-cols-3 text-sm items-center py-2 hover:bg-gray-50 transition-colors">
        <button
          onClick={onToggle}
          className="text-left text-charcoal truncate hover:text-gold transition-colors cursor-pointer flex items-center gap-1.5"
          title={`Click to view jobs at ${company.name}`}
        >
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-gold flex-shrink-0" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          )}
          <span className="truncate">{company.name}</span>
        </button>
        <span className="text-right text-gray-600">{company.unique_postings.toLocaleString()}</span>
        <span className="text-right text-gold">
          {company.median_salary > 0
            ? `$${(company.median_salary / 1000).toFixed(0)}k`
            : 'N/A'}
        </span>
      </div>

      {/* Expanded Job Listings */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? '500px' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div className="pl-6 pr-2 pb-3 pt-1">
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
                <p className="text-xs text-gray-500 py-3">No active openings found</p>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto">
                  {data.jobs.map((job: any) => (
                    <div
                      key={job.id}
                      className="bg-white border border-gray-200 rounded p-3 hover:border-gold/50 transition-colors text-xs"
                    >
                      <h4 className="font-medium text-charcoal text-sm mb-1.5">{job.title}</h4>

                      <div className="space-y-1 text-gray-600 mb-2">
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

CompanyRow.displayName = 'CompanyRow';
