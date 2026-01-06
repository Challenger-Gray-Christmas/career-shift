import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RegionalProjection } from "@/lib/data/types";

interface RegionalOutlookCardProps {
  data: RegionalProjection[];
}

export function RegionalOutlookCard({ data }: RegionalOutlookCardProps) {
  const topRegions = data.slice(0, 10);

  const getChangeColor = (change: number) => {
    if (change > 1) return "text-green-600";
    if (change < -1) return "text-red-600";
    return "text-yellow-600";
  };

  const formatJobs = (jobs: number) => {
    if (jobs >= 1000) {
      return `${(jobs / 1000).toFixed(1)}k`;
    }
    return jobs.toLocaleString();
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">
          Outlook by Region
        </CardTitle>
        <p className="text-xs text-gray-500">Top 10 counties by current job count</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-lightgray">
                <th className="pb-2 text-left font-medium text-charcoal">Region</th>
                <th className="pb-2 text-right font-medium text-charcoal">2024 Jobs</th>
                <th className="pb-2 text-right font-medium text-charcoal">2030 Jobs</th>
                <th className="pb-2 text-right font-medium text-charcoal">Change</th>
              </tr>
            </thead>
            <tbody>
              {topRegions.map((region) => (
                <tr key={region.county} className="border-b border-lightgray/50">
                  <td className="py-2 text-charcoal">{region.countyName}</td>
                  <td className="py-2 text-right text-gray-600">
                    {formatJobs(region.jobs2024)}
                  </td>
                  <td className="py-2 text-right text-gray-600">
                    {formatJobs(region.jobs2030)}
                  </td>
                  <td className={`py-2 text-right font-medium ${getChangeColor(region.percentChange)}`}>
                    {region.percentChange > 0 ? "+" : ""}
                    {region.percentChange}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
