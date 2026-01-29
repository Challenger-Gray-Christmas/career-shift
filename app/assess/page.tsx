"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuestionnaireProfile } from "@/lib/data/questionnaire-data";
import { getCareerMatches } from "@/lib/data/career-matches";
import { getProjectedOutlookData } from "@/lib/data/projected-outlook";
import { getJobPostingsData } from "@/lib/data/job-postings";
import { getCareerPathwaysData, getSkillGapData } from "@/lib/data/career-pathways";
import { ProfileSummaryCard } from "@/components/features/profile-summary-card";
import { MarketDataGrid } from "@/components/features/market-data-grid";
import { CurrentRoleCard } from "@/components/features/current-role-card";
import { CareerMatchListItem } from "@/components/features/career-match-list-item";
import { CareerMatchDetail } from "@/components/features/career-match-detail";
import { PathwayListItem } from "@/components/features/pathway-list-item";
import { PathwayDetail } from "@/components/features/pathway-detail";
import { PathwaySectionCard } from "@/components/features/pathway-section-card";
import { OccupationSearch } from "@/components/features/occupation-search";
import { MarketDataGridSkeleton } from "@/components/features/market-data-grid-skeleton";
import { MasterDetailSkeleton } from "@/components/features/master-detail-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import type { CareerMatch, PathwayJob } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type Tab = "profile" | "current-role" | "career-matches" | "career-pathways" | "job-explorer";

type SelectedItem =
  | { type: "match"; data: CareerMatch }
  | { type: "pathway"; data: PathwayJob };

function AssessPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;

  const [activeTab, setActiveTab] = useState<Tab>(tabParam || "profile");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [selectedOccupation, setSelectedOccupation] = useState("Customer Service Representative");
  const [tabLoadingState, setTabLoadingState] = useState<Record<Tab, "idle" | "loading" | "loaded">>({
    "profile": "loaded",
    "current-role": "idle",
    "career-matches": "idle",
    "career-pathways": "idle",
    "job-explorer": "idle",
  });

  const profile = getQuestionnaireProfile();
  const careerMatches = getCareerMatches();
  const outlookData = getProjectedOutlookData();
  const jobPostingsData = getJobPostingsData(profile.currentRole);
  const pathwaysData = getCareerPathwaysData("23111410");

  const skillGapData = selectedItem?.type === "pathway"
    ? getSkillGapData(pathwaysData.id, selectedItem.data.id)
    : null;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);

    // Simulate loading for tabs that haven't been loaded yet
    if (tabLoadingState[tab] === "idle") {
      setTabLoadingState(prev => ({ ...prev, [tab]: "loading" }));
      // Simulate API delay
      setTimeout(() => {
        setTabLoadingState(prev => ({ ...prev, [tab]: "loaded" }));
        // Auto-select first item when switching to career tabs
        if (tab === "career-matches" && careerMatches.length > 0) {
          setSelectedItem({ type: "match", data: careerMatches[0] });
        }
        if (tab === "career-pathways" && pathwaysData.advancementJobs.length > 0) {
          setSelectedItem({ type: "pathway", data: pathwaysData.advancementJobs[0] });
        }
      }, 800);
    } else {
      // Tab already loaded, just auto-select if needed
      if (tab === "career-matches" && selectedItem?.type !== "match" && careerMatches.length > 0) {
        setSelectedItem({ type: "match", data: careerMatches[0] });
      }
      if (tab === "career-pathways" && selectedItem?.type !== "pathway" && pathwaysData.advancementJobs.length > 0) {
        setSelectedItem({ type: "pathway", data: pathwaysData.advancementJobs[0] });
      }
    }
  };

  const handleSelectMatch = (match: CareerMatch) => {
    setSelectedItem({ type: "match", data: match });
  };

  const handleSelectPathway = (job: PathwayJob) => {
    setSelectedItem({ type: "pathway", data: job });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Client Profile" },
    { id: "current-role", label: "Current Role" },
    { id: "career-matches", label: "Career Matches" },
    { id: "career-pathways", label: "Career Pathways" },
    { id: "job-explorer", label: "Job Explorer" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-charcoal">Career Assessment Results</h1>
        <p className="mt-2 text-gray-600">
          Based on your profile, here are your personalized career insights.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "py-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-gold text-gold"
                  : "border-transparent text-gray-500 hover:text-charcoal hover:border-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && <ProfileSummaryCard profile={profile} />}

      {activeTab === "current-role" && (
        <div className="space-y-4">
          {tabLoadingState["current-role"] === "loading" ? (
            <>
              <Card className="p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </Card>
              <MarketDataGridSkeleton />
            </>
          ) : (
            <>
              <CurrentRoleCard data={pathwaysData} />
              <MarketDataGrid
                jobPostingsData={jobPostingsData}
                outlookData={outlookData}
              />
            </>
          )}
        </div>
      )}

      {activeTab === "career-matches" && (
        <div className="space-y-4">
          {tabLoadingState["career-matches"] === "loading" ? (
            <>
              <Card className="p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </Card>
              <MasterDetailSkeleton />
            </>
          ) : (
            <>
              <CurrentRoleCard data={pathwaysData} />
              <div className="grid gap-6 lg:grid-cols-5">
                {/* Master Panel - List */}
                <div className="lg:col-span-2 space-y-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Select a career to see details
                  </p>
                  {careerMatches.map((match) => (
                    <CareerMatchListItem
                      key={match.id}
                      match={match}
                      isSelected={selectedItem?.type === "match" && selectedItem.data.id === match.id}
                      onClick={() => handleSelectMatch(match)}
                    />
                  ))}
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-3">
                  {selectedItem?.type === "match" ? (
                    <CareerMatchDetail
                      match={selectedItem.data}
                      jobPostingsData={jobPostingsData}
                      outlookData={outlookData}
                    />
                  ) : (
                    <div className="border border-dashed rounded-lg p-8 text-center text-gray-500">
                      <p>Select a career from the list to see detailed information</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "career-pathways" && (
        <div className="space-y-4">
          {tabLoadingState["career-pathways"] === "loading" ? (
            <>
              <Card className="p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </Card>
              <MasterDetailSkeleton />
            </>
          ) : (
            <>
              <CurrentRoleCard data={pathwaysData} />
              <div className="grid gap-6 lg:grid-cols-5">
                {/* Master Panel - List */}
                <div className="lg:col-span-2 space-y-4">
                  <PathwaySectionCard type="advancement">
                    {pathwaysData.advancementJobs.slice(0, 6).map((job) => (
                      <PathwayListItem
                        key={job.id}
                        job={job}
                        isSelected={selectedItem?.type === "pathway" && selectedItem.data.id === job.id}
                        onClick={() => handleSelectPathway(job)}
                      />
                    ))}
                  </PathwaySectionCard>

                  <PathwaySectionCard type="feeder">
                    {pathwaysData.feederJobs.slice(0, 6).map((job) => (
                      <PathwayListItem
                        key={job.id}
                        job={job}
                        isSelected={selectedItem?.type === "pathway" && selectedItem.data.id === job.id}
                        onClick={() => handleSelectPathway(job)}
                      />
                    ))}
                  </PathwaySectionCard>
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-3">
                  {selectedItem?.type === "pathway" ? (
                    <PathwayDetail
                      job={selectedItem.data}
                      skillGapData={skillGapData}
                      jobPostingsData={jobPostingsData}
                      outlookData={outlookData}
                    />
                  ) : (
                    <div className="border border-dashed rounded-lg p-8 text-center text-gray-500">
                      <p>Select a career pathway to see detailed information</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "job-explorer" && (
        <div className="space-y-6">
          {tabLoadingState["job-explorer"] === "loading" ? (
            <>
              <Skeleton className="h-10 w-full max-w-md" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <MarketDataGridSkeleton />
            </>
          ) : (
            <>
              <OccupationSearch value={selectedOccupation} onChange={setSelectedOccupation} />
              <div className="flex flex-col gap-1">
                <span className="text-lg font-medium text-charcoal">
                  {selectedOccupation}
                </span>
                <span className="text-sm text-gray-500">
                  {getJobPostingsData(selectedOccupation).postingsTrend.total.toLocaleString()} recent postings
                </span>
              </div>
              <MarketDataGrid
                jobPostingsData={getJobPostingsData(selectedOccupation)}
                outlookData={outlookData}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function AssessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md mt-20">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-charcoal">Loading...</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <AssessPageContent />
    </Suspense>
  );
}
