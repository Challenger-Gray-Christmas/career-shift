"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { MarketDataGrid } from "@/components/features/market-data-grid";
import { TrendingUp, ArrowRight } from "lucide-react";
import type { PathwayJob, SkillGapData, JobPostingsData, ProjectedOutlookData } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface PathwayDetailProps {
  job: PathwayJob;
  skillGapData: SkillGapData | null;
  jobPostingsData?: JobPostingsData;
  outlookData?: ProjectedOutlookData;
}

export function PathwayDetail({ job, skillGapData, jobPostingsData, outlookData }: PathwayDetailProps) {
  const formatSalary = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  const salaryDiffColor = job.meanSalaryDiff > 0
    ? "text-green-600"
    : job.meanSalaryDiff < 0
      ? "text-red-500"
      : "text-gray-500";

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-l-4 border-l-gold">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl text-charcoal">{job.name}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Avg Salary</p>
                  <p className="text-sm font-medium text-charcoal">
                    {formatSalary(job.meanSalary)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">vs Current</p>
                  <p className={cn("text-sm font-medium", salaryDiffColor)}>
                    {job.meanSalaryDiff > 0 ? "+" : ""}{formatSalary(job.meanSalaryDiff)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Level Change</p>
                  <p className="text-sm font-medium text-charcoal">
                    {job.jobLevelDiff > 0 ? "+" : ""}{job.jobLevelDiff}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gold/10 text-gold font-bold text-sm">
              {Math.round(job.score * 100)}%
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Skills Gap - Open by default */}
      {skillGapData && skillGapData.skillGap.length > 0 && (
        <CollapsibleSection
          title="Skills to Acquire"
          icon={<ArrowRight className="h-4 w-4 text-gold" />}
          defaultOpen={true}
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-3">
              {skillGapData.source.name} → {skillGapData.destination.name}
            </p>
            {skillGapData.skillGap.map((skill) => {
              const maxScore = Math.max(...skillGapData.skillGap.map(s => s.importanceScore));
              return (
                <div key={skill.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal">{skill.name}</span>
                    <span className="text-gray-500 text-xs">
                      {skill.importanceScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-gold"
                      style={{ width: `${(skill.importanceScore / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

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
