import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart } from "@/components/charts/line-chart";
import { TrendingUp, TrendingDown, Minus, Check, BookOpen, ExternalLink } from "lucide-react";
import type { CareerMatch } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface ComparisonViewProps {
  match: CareerMatch;
}

export function ComparisonView({ match }: ComparisonViewProps) {
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

  // Generate simple outlook trend data
  const outlookData = Array.from({ length: 7 }, (_, i) => ({
    month: (2024 + i).toString(),
    value: 100 + (match.outlookPercent / 6) * i,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-gold">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-charcoal">{match.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gold/10 text-gold font-bold">
                  {match.matchPercent}%
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skill Match</p>
                  <p className="font-medium text-charcoal">
                    {formatSalary(match.salaryRange.min)} - {formatSalary(match.salaryRange.max)} / year
                  </p>
                </div>
              </div>
            </div>
            <div className={cn("flex items-center gap-2 text-lg font-semibold", outlookColor)}>
              <OutlookIcon className="h-6 w-6" />
              {match.outlookPercent > 0 ? "+" : ""}{match.outlookPercent}%
              <span className="text-sm font-normal text-gray-500">by 2030</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <LineChart
              data={outlookData}
              valueFormatter={(v) => `${v.toFixed(0)}%`}
              color={match.outlookPercent >= 0 ? "#22c55e" : "#ef4444"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transferable Skills */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-charcoal flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            Skills You Have (Transferable)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {match.transferableSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-green-50 text-green-700 border border-green-200"
              >
                <Check className="h-3 w-3 mr-1" />
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Gap with Courses */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-charcoal flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gold" />
            Skills to Develop
          </CardTitle>
          <p className="text-xs text-gray-500">
            Recommended courses to bridge the gap
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {match.skillsGap.map((gap) => (
              <div key={gap.skill} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-charcoal">{gap.skill}</p>
                    <p className="text-sm text-gold mt-1">{gap.course.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{gap.course.provider}</span>
                      <span>|</span>
                      <span>{gap.course.duration}</span>
                      <span>|</span>
                      <Badge variant="outline" className="text-xs py-0">
                        {gap.course.level}
                      </Badge>
                    </div>
                  </div>
                  <a
                    href={gap.course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bridge the Gap Summary */}
      <Card className="bg-gold/5 border-gold">
        <CardContent className="p-4">
          <p className="text-charcoal">
            <span className="font-semibold">Bridge the Gap:</span>{" "}
            With {match.skillsGap.length} targeted course{match.skillsGap.length !== 1 ? "s" : ""},
            you could be transition-ready. Your {match.transferableSkills.length} transferable skills
            give you a strong foundation for this role.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
