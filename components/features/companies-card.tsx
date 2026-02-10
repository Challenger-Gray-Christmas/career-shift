import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CompanyRanking } from "@/lib/data/types";

interface CompaniesCardProps {
  data: CompanyRanking[];
}

export function CompaniesCard({ data }: CompaniesCardProps) {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, 10);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Companies</CardTitle>
        <p className="text-xs text-gray-500">Hiring for this role</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-3 text-xs font-medium text-gray-500 border-b pb-2">
            <span>Company</span>
            <span className="text-right">Postings</span>
            <span className="text-right">Med. Salary</span>
          </div>
          {displayData.map((company) => (
            <div key={company.name} className="grid grid-cols-3 text-sm">
              <span className="text-charcoal truncate">{company.name}</span>
              <span className="text-right text-gray-600">{company.unique_postings.toLocaleString()}</span>
              <span className="text-right text-gold">
                {company.median_salary > 0
                  ? `$${(company.median_salary / 1000).toFixed(0)}k`
                  : 'N/A'}
              </span>
            </div>
          ))}
        </div>
        {data.length > 10 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-xs text-gray-500"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `Show all ${data.length} companies`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
