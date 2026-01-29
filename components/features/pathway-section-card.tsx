import { TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PathwaySectionType = "advancement" | "feeder";

interface PathwaySectionCardProps {
  type: PathwaySectionType;
  children: React.ReactNode;
}

const sectionConfig = {
  advancement: {
    title: "Where You Could Go",
    subtitle: "Career advancement opportunities",
    icon: TrendingUp,
    accentColor: "bg-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderAccent: "border-l-emerald-500",
  },
  feeder: {
    title: "Where People Come From",
    subtitle: "Common entry paths to this role",
    icon: Users,
    accentColor: "bg-blue-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    borderAccent: "border-l-blue-500",
  },
};

export function PathwaySectionCard({ type, children }: PathwaySectionCardProps) {
  const config = sectionConfig[type];
  const Icon = config.icon;

  return (
    <Card className={cn(
      "border-l-4 shadow-sm",
      config.borderAccent
    )}>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg",
            config.iconBg
          )}>
            <Icon className={cn("h-5 w-5", config.iconColor)} />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-charcoal">
              {config.title}
            </CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              {config.subtitle}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-2">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
