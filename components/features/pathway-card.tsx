"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PathwayJob, PathwayCategory } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface PathwayCardProps {
  job: PathwayJob;
  onClick: () => void;
  isSelected: boolean;
}

const categoryColors: Record<PathwayCategory, string> = {
  Advancement: "bg-green-100 text-green-800 border-green-200",
  LateralTransition: "bg-blue-100 text-blue-800 border-blue-200",
  Similar: "bg-gray-100 text-gray-800 border-gray-200",
  LateralAdvancement: "bg-amber-100 text-amber-800 border-amber-200",
};

const categoryLabels: Record<PathwayCategory, string> = {
  Advancement: "Advancement",
  LateralTransition: "Lateral",
  Similar: "Similar",
  LateralAdvancement: "Lateral Adv.",
};

export function PathwayCard({ job, onClick, isSelected }: PathwayCardProps) {
  const salaryDiff = job.meanSalaryDiff;
  const salaryDiffFormatted = salaryDiff >= 0
    ? `+$${(salaryDiff / 1000).toFixed(0)}k`
    : `-$${(Math.abs(salaryDiff) / 1000).toFixed(0)}k`;

  const levelDiff = job.jobLevelDiff;
  const levelDiffText = levelDiff > 0
    ? `+${levelDiff} level${levelDiff > 1 ? "s" : ""}`
    : levelDiff < 0
    ? `${levelDiff} level${Math.abs(levelDiff) > 1 ? "s" : ""}`
    : "Same level";

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-gold"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium text-charcoal">
            {job.name}
          </CardTitle>
          <Badge variant="outline" className={cn("text-xs", categoryColors[job.category])}>
            {categoryLabels[job.category]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {(job.score * 100).toFixed(0)}% match
          </span>
          <span className={cn(
            "font-medium",
            salaryDiff >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {salaryDiffFormatted}
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {levelDiffText} | ${(job.meanSalary / 1000).toFixed(0)}k avg
        </div>
      </CardContent>
    </Card>
  );
}
