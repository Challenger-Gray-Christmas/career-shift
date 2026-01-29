import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CareerMatch } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface CareerMatchListItemProps {
  match: CareerMatch;
  isSelected: boolean;
  onClick: () => void;
}

export function CareerMatchListItem({ match, isSelected, onClick }: CareerMatchListItemProps) {
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

  const formatSalary = (value: number) => `$${(value / 1000).toFixed(0)}K`;

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
        <span className="font-medium text-charcoal text-sm">{match.title}</span>
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gold/10 text-gold font-bold text-xs">
          {match.matchPercent}%
        </div>
      </div>
      <div className="mt-1 flex items-center gap-3 text-xs">
        <span className={cn("flex items-center gap-1", outlookColor)}>
          <OutlookIcon className="h-3 w-3" />
          {match.outlookPercent > 0 ? "+" : ""}{match.outlookPercent}%
        </span>
        <span className="text-gray-500">
          {formatSalary(match.salaryRange.min)} - {formatSalary(match.salaryRange.max)}
        </span>
      </div>
    </button>
  );
}
