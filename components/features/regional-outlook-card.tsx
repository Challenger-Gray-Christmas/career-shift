"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { RegionalProjection } from "@/lib/data/types";

interface RegionalOutlookCardProps {
  data: RegionalProjection[];
}

export function RegionalOutlookCard({ data }: RegionalOutlookCardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = searchTerm
    ? data.filter(region =>
        region.countyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data.slice(0, 10);

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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-medium text-charcoal">
              Outlook by Region
            </CardTitle>
            <p className="text-xs text-gray-500">
              {searchTerm ? `${filteredData.length} matching counties` : "Top 10 counties by current job count"}
            </p>
          </div>
          <div className="relative w-48">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-7 text-xs"
            />
          </div>
        </div>
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
              {filteredData.length > 0 ? (
                filteredData.slice(0, 20).map((region) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No regions found matching &quot;{searchTerm}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
