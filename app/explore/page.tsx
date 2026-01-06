import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getJobPostingsData } from "@/lib/data/job-postings";
import { SalaryTrendCard } from "@/components/features/salary-trend-card";
import { PostingsTrendCard } from "@/components/features/postings-trend-card";
import { RegionsCard } from "@/components/features/regions-card";
import { CompaniesCard } from "@/components/features/companies-card";
import { EducationCard } from "@/components/features/education-card";
import { TitlesCard } from "@/components/features/titles-card";

export default function ExplorePage() {
  const data = getJobPostingsData("Customer Service Representative (General)");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Job Market Explorer</h1>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-lg text-gray-600">
              Viewing: <span className="font-semibold text-charcoal">{data.occupation}</span>
            </p>
            <p className="text-sm text-gray-500">
              {data.postingsTrend.total.toLocaleString()} unique postings in the last 12 months
            </p>
          </div>
          <Link href="/pathways">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
              Plan Career Transition
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SalaryTrendCard data={data.salaryTrend} />
        <PostingsTrendCard data={data.postingsTrend} />
        <RegionsCard data={data.topRegions} />
        <CompaniesCard data={data.topCompanies} />
        <EducationCard data={data.educationRequirements} />
        <TitlesCard data={data.topTitles} />
      </div>
    </div>
  );
}
