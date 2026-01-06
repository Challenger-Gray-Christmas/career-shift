import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SkillGapData } from "@/lib/data/types";

interface SkillGapPanelProps {
  data: SkillGapData;
}

export function SkillGapPanel({ data }: SkillGapPanelProps) {
  const maxScore = Math.max(...data.skillGap.map(s => s.importanceScore));

  return (
    <Card className="border-l-4 border-l-gold">
      <CardHeader>
        <CardTitle className="text-lg text-charcoal">
          Skills to Acquire
        </CardTitle>
        <p className="text-sm text-gray-500">
          {data.source.name} → {data.destination.name}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.skillGap.map((skill) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
