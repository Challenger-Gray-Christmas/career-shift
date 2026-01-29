"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { MarketDataGrid } from "@/components/features/market-data-grid";
import { TrendingUp, TrendingDown, Minus, Check, BookOpen, ExternalLink } from "lucide-react";
import type { CareerMatch, JobPostingsData, ProjectedOutlookData } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface CareerMatchDetailProps {
  match: CareerMatch;
  jobPostingsData?: JobPostingsData;
  outlookData?: ProjectedOutlookData;
}

export function CareerMatchDetail({ match, jobPostingsData, outlookData }: CareerMatchDetailProps) {
  const OutlookIcon = match.outlookPercent > 2
    ? TrendingUp
    : match.outlookPercent < -2
      ? TrendingDown
      : Minus;

  const outlookColor = match.outlookPercent > 2
    ? "text-green-600"
    : match.outlookPercent < -2
      ? "text-red-500"
      : "text-yellow-600";

  const formatSalary = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-l-4 border-l-gold">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl text-charcoal">{match.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gold/10 text-gold font-bold text-sm">
                  {match.matchPercent}%
                </div>
                <div>
                  <p className="text-xs text-gray-500">Skill Match</p>
                  <p className="text-sm font-medium text-charcoal">
                    {formatSalary(match.salaryRange.min)} - {formatSalary(match.salaryRange.max)} / year
                  </p>
                </div>
              </div>
            </div>
            <div className={cn("flex items-center gap-1 text-sm font-semibold", outlookColor)}>
              <OutlookIcon className="h-4 w-4" />
              {match.outlookPercent > 0 ? "+" : ""}{match.outlookPercent}%
              <span className="text-xs font-normal text-gray-500">by 2030</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Skills & Training - Open by default */}
      <CollapsibleSection
        title="Skills & Training"
        icon={<BookOpen className="h-4 w-4 text-gold" />}
        defaultOpen={true}
      >
        <div className="space-y-4">
          {/* Transferable Skills */}
          <div>
            <p className="text-sm font-medium text-charcoal flex items-center gap-2 mb-2">
              <Check className="h-4 w-4 text-green-600" />
              Skills You Have
            </p>
            <div className="flex flex-wrap gap-2">
              {match.transferableSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-green-50 text-green-700 border border-green-200 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills to Develop */}
          <div>
            <p className="text-sm font-medium text-charcoal mb-2">Skills to Develop</p>
            <div className="space-y-3">
              {match.skillsGap.map((gap) => (
                <div key={gap.skill} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{gap.skill}</p>
                      <p className="text-xs text-gold mt-1">{gap.course.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{gap.course.provider}</span>
                        <span>•</span>
                        <span>{gap.course.duration}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs py-0 px-1">
                          {gap.course.level}
                        </Badge>
                      </div>
                    </div>
                    <a
                      href={gap.course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 flex-shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Market Data - Collapsed by default */}
      {jobPostingsData && outlookData && (
        <CollapsibleSection
          title="Market Data"
          icon={<TrendingUp className="h-4 w-4 text-charcoal" />}
          defaultOpen={false}
        >
          <MarketDataGrid
            jobPostingsData={jobPostingsData}
            outlookData={outlookData}
          />
        </CollapsibleSection>
      )}
    </div>
  );
}
