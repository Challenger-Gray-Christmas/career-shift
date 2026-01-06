import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import type { CareerMatch } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface CareerMatchCardProps {
  match: CareerMatch;
  onClick: () => void;
  isSelected?: boolean;
}

export function CareerMatchCard({ match, onClick, isSelected }: CareerMatchCardProps) {
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
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-gold border-gold"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-charcoal">{match.title}</h3>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gold/10 text-gold font-bold text-sm">
                {match.matchPercent}%
              </div>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className={cn("flex items-center gap-1", outlookColor)}>
                <OutlookIcon className="h-4 w-4" />
                {match.outlookPercent > 0 ? "+" : ""}{match.outlookPercent}% by 2030
              </span>
              <span className="text-gray-500">
                {formatSalary(match.salaryRange.min)} - {formatSalary(match.salaryRange.max)}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {match.rationale}
            </p>
          </div>

          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}
