import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/line-chart";
import { TrendingDown } from "lucide-react";
import type { ProjectedOutlookData } from "@/lib/data/types";

interface NationalOutlookCardProps {
  data: ProjectedOutlookData["national"];
}

export function NationalOutlookCard({ data }: NationalOutlookCardProps) {
  const chartData = data.timeseries.map((item) => ({
    month: item.year.toString(),
    value: item.jobs,
  }));

  const formatJobs = (value: number) => `${(value / 1000000).toFixed(1)}M`;

  const isDecline = data.percentChange < 0;

  return (
    <Card className="border-l-4 border-l-gold">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">
          Projected Job Outlook
        </CardTitle>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-gold">
            {data.percentChange > 0 ? "+" : ""}
            {data.percentChange}%
          </p>
          {isDecline && <TrendingDown className="h-5 w-5 text-red-500" />}
        </div>
        <p className="text-xs text-gray-500">
          Jobs expected to {isDecline ? "decline" : "grow"} from{" "}
          {formatJobs(data.startJobs)} to {formatJobs(data.endJobs)} by 2030
        </p>
      </CardHeader>
      <CardContent>
        <LineChart
          data={chartData}
          valueFormatter={formatJobs}
          color={isDecline ? "#ef4444" : "#22c55e"}
        />
      </CardContent>
    </Card>
  );
}
