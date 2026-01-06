"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getJobPostingsData } from "@/lib/data/job-postings";
import { getProjectedOutlookData } from "@/lib/data/projected-outlook";
import { SalaryTrendCard } from "@/components/features/salary-trend-card";
import { PostingsTrendCard } from "@/components/features/postings-trend-card";
import { RegionsCard } from "@/components/features/regions-card";
import { CompaniesCard } from "@/components/features/companies-card";
import { EducationCard } from "@/components/features/education-card";
import { TitlesCard } from "@/components/features/titles-card";
import { NationalOutlookCard } from "@/components/features/national-outlook-card";
import { RegionalOutlookCard } from "@/components/features/regional-outlook-card";

export default function ExplorePage() {
  const data = getJobPostingsData("Customer Service Representative");
  const outlookData = getProjectedOutlookData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Job Market Explorer</h1>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-medium text-charcoal">
              {outlookData.occupation}
            </span>
            <span className="text-sm text-gray-500">
              {data.postingsTrend.total.toLocaleString()} recent postings
            </span>
          </div>
          <Link href="/pathways?occupation=customer-service-rep">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
              Plan Career Transition
            </Button>
          </Link>
        </div>
      </div>

      {/* Projected Outlook Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-charcoal">Projected Outlook</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NationalOutlookCard data={outlookData.national} />
          <RegionalOutlookCard data={outlookData.regional} />
        </div>
      </div>

      {/* Current Market Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-charcoal">Current Market</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SalaryTrendCard data={data.salaryTrend} />
          <PostingsTrendCard data={data.postingsTrend} />
          <RegionsCard data={data.topRegions} />
          <CompaniesCard data={data.topCompanies} />
          <EducationCard data={data.educationRequirements} />
          <TitlesCard data={data.topTitles} />
        </div>
      </div>
    </div>
  );
}
