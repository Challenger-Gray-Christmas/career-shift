import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { PathwayJob } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface PathwayListItemProps {
  job: PathwayJob;
  isSelected: boolean;
  onClick: () => void;
}

export function PathwayListItem({ job, isSelected, onClick }: PathwayListItemProps) {
  const SalaryIcon = job.meanSalaryDiff > 0
    ? ArrowUp
    : job.meanSalaryDiff < 0
      ? ArrowDown
      : Minus;

  const salaryColor = job.meanSalaryDiff > 0
    ? "text-green-600"
    : job.meanSalaryDiff < 0
      ? "text-red-500"
      : "text-gray-500";

  const formatSalary = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all",
        isSelected
          ? "border-gold bg-gold/5 ring-1 ring-gold"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-charcoal text-sm">{job.name}</span>
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gold/10 text-gold font-bold text-xs">
          {job.score}%
        </div>
      </div>
      <div className="mt-1 flex items-center gap-3 text-xs">
        <span className={cn("flex items-center gap-1", salaryColor)}>
          <SalaryIcon className="h-3 w-3" />
          {job.meanSalaryDiff > 0 ? "+" : ""}{formatSalary(job.meanSalaryDiff)}
        </span>
        <span className="text-gray-500">
          {formatSalary(job.meanSalary)}
        </span>
        <span className="text-gray-400">
          Level {job.jobLevelDiff > 0 ? "+" : ""}{job.jobLevelDiff}
        </span>
      </div>
    </button>
  );
}
