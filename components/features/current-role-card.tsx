import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CareerPathwaysData } from "@/lib/data/types";

interface CurrentRoleCardProps {
  data: CareerPathwaysData;
}

export function CurrentRoleCard({ data }: CurrentRoleCardProps) {
  return (
    <Card className="border-l-4 border-l-charcoal">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">Current Role</CardTitle>
        <p className="text-xl font-bold text-charcoal">{data.name}</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-gray-500">Level:</span>
            <span className="ml-1 font-medium text-charcoal">{data.jobLevel}</span>
          </div>
          <div>
            <span className="text-gray-500">Avg Salary:</span>
            <span className="ml-1 font-medium text-gold">${(data.meanSalary / 1000).toFixed(0)}k</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
