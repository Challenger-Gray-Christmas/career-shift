"use client";

import { useState } from "react";
import { getJobPostingsData } from "@/lib/data/job-postings";
import { getProjectedOutlookData } from "@/lib/data/projected-outlook";
import { MarketDataGrid } from "@/components/features/market-data-grid";
import { OccupationSearch } from "@/components/features/occupation-search";

export default function ExplorePage() {
  const [occupation, setOccupation] = useState("Customer Service Representative");

  const jobPostingsData = getJobPostingsData(occupation);
  const outlookData = getProjectedOutlookData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Job Market Explorer</h1>
        <p className="mt-2 text-gray-600">
          Search any job title to explore market trends, salaries, and opportunities.
        </p>
      </div>

      <div className="mb-8">
        <OccupationSearch value={occupation} onChange={setOccupation} />
      </div>

      <div className="mb-6 flex flex-col gap-1">
        <span className="text-lg font-medium text-charcoal">
          {occupation}
        </span>
        <span className="text-sm text-gray-500">
          {jobPostingsData.postingsTrend.total.toLocaleString()} recent postings
        </span>
      </div>

      <MarketDataGrid
        jobPostingsData={jobPostingsData}
        outlookData={outlookData}
      />
    </div>
  );
}
