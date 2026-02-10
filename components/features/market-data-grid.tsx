import { SalaryTrendCard } from "@/components/features/salary-trend-card";
import { PostingsTrendCard } from "@/components/features/postings-trend-card";
import { RegionsCard } from "@/components/features/regions-card";
import { CompaniesCard } from "@/components/features/companies-card";
import { EducationCard } from "@/components/features/education-card";
import { TitlesCard } from "@/components/features/titles-card";
import { NationalOutlookCard } from "@/components/features/national-outlook-card";
import { RegionalOutlookCard } from "@/components/features/regional-outlook-card";
import type { JobPostingsData, ProjectedOutlookData } from "@/lib/data/types";

interface MarketDataGridProps {
  jobPostingsData: JobPostingsData;
  outlookData: ProjectedOutlookData;
  showOutlook?: boolean;
}

export function MarketDataGrid({
  jobPostingsData,
  outlookData,
  showOutlook = true
}: MarketDataGridProps) {
  return (
    <div className="space-y-6">
      {showOutlook && (
        <>
          <NationalOutlookCard data={outlookData.national} />
          <RegionalOutlookCard data={outlookData.regional} />
        </>
      )}

      <SalaryTrendCard data={jobPostingsData.salaryTrend} />
      <PostingsTrendCard data={jobPostingsData.postingsTrend} />

      <RegionsCard data={jobPostingsData.topRegions} />
      <CompaniesCard
        data={jobPostingsData.topCompanies}
        occupationName={jobPostingsData.occupation}
      />

      <EducationCard data={jobPostingsData.educationRequirements} />
      <TitlesCard data={jobPostingsData.topTitles} />
    </div>
  );
}
