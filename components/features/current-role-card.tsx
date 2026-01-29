import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CareerPathwaysData, RegionRanking } from "@/lib/data/types";

interface CurrentRoleCardProps {
  data: CareerPathwaysData;
  regions?: RegionRanking[];
  selectedRegion?: string;
  onRegionChange?: (region: string) => void;
}

export function CurrentRoleCard({
  data,
  regions,
  selectedRegion = "national",
  onRegionChange
}: CurrentRoleCardProps) {
  return (
    <Card className="border-l-4 border-l-charcoal">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-gray-500">Current Role</CardTitle>
            <p className="text-xl font-bold text-charcoal">{data.name}</p>
          </div>
          {regions && onRegionChange && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Viewing outlook for:</span>
              <Select value={selectedRegion} onValueChange={onRegionChange}>
                <SelectTrigger className="w-[200px] h-8 text-xs">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">National (All Regions)</SelectItem>
                  {regions.slice(0, 20).map((region) => (
                    <SelectItem key={region.name} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
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
