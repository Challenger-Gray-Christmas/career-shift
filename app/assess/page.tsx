"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { getQuestionnaireProfile } from "@/lib/data/questionnaire-data";
import { getCareerMatches } from "@/lib/data/career-matches";
import { getProjectedOutlookData } from "@/lib/data/projected-outlook";
import { useJobPostingsData, useCareerPathways, useSkillGap, useOccupationId } from "@/lib/hooks";
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
import type { CareerMatch, PathwayJob } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type Tab = "profile" | "current-role" | "career-matches" | "career-pathways" | "job-explorer";

type SelectedItem =
  | { type: "match"; data: CareerMatch }
  | { type: "pathway"; data: PathwayJob };

// Error Card Component
function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Failed to load data</p>
            <p className="text-sm text-red-700 mt-1">{message}</p>
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Try Again
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssessPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;

  const [activeTab, setActiveTab] = useState<Tab>(tabParam || "profile");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  // Static data (not changed to API yet)
  const profile = getQuestionnaireProfile();
  // Job Explorer starts empty - user must search and select
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const careerMatches = getCareerMatches();
  const outlookData = getProjectedOutlookData();

  // Get occupation LOT ID from profile occupation name
  const occupationLookup = useOccupationId({
    occupationName: profile.currentRole,
    enabled: true,
  });

  // API hooks for real-time data
  const currentRoleJobData = useJobPostingsData({
    occupationName: profile.currentRole,
    enabled: activeTab === "current-role" || activeTab === "career-matches",
  });

  const pathwaysData = useCareerPathways({
    occupationId: occupationLookup.id || "",
    enabled: !!occupationLookup.id && (activeTab === "career-pathways" || activeTab === "career-matches" || activeTab === "current-role"),
  });

  const explorerJobData = useJobPostingsData({
    occupationName: selectedOccupation,
    enabled: activeTab === "job-explorer" && selectedOccupation.length > 0,
  });

  const skillGapData = useSkillGap({
    sourceId: pathwaysData.data?.id || occupationLookup.id || "",
    destinationId: selectedItem?.type === "pathway" ? selectedItem.data.id : "",
    enabled: selectedItem?.type === "pathway" && !!selectedItem.data.id,
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);

    // Auto-select first item when switching to career tabs
    if (tab === "career-matches" && selectedItem?.type !== "match" && careerMatches.length > 0) {
      setSelectedItem({ type: "match", data: careerMatches[0] });
    }
    if (tab === "career-pathways" && selectedItem?.type !== "pathway" && pathwaysData.data?.advancementJobs.length) {
      setSelectedItem({ type: "pathway", data: pathwaysData.data.advancementJobs[0] });
    }
  };

  const pathwayDetailRef = useRef<HTMLDivElement>(null);
  const matchDetailRef = useRef<HTMLDivElement>(null);

  const handleSelectMatch = (match: CareerMatch) => {
    setSelectedItem({ type: "match", data: match });
    setTimeout(() => {
      matchDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleSelectPathway = (job: PathwayJob) => {
    setSelectedItem({ type: "pathway", data: job });
    setTimeout(() => {
      pathwayDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
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
          {occupationLookup.loading || pathwaysData.loading || currentRoleJobData.loading ? (
            <>
              <Card className="p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </Card>
              <MarketDataGridSkeleton />
            </>
          ) : occupationLookup.error || pathwaysData.error || currentRoleJobData.error ? (
            <ErrorCard
              message={occupationLookup.error || pathwaysData.error || currentRoleJobData.error || "Unknown error"}
              onRetry={() => {
                window.location.reload();
              }}
            />
          ) : (
            <>
              {pathwaysData.data && <CurrentRoleCard data={pathwaysData.data} />}
              {currentRoleJobData.data && (
                <MarketDataGrid
                  jobPostingsData={currentRoleJobData.data}
                  outlookData={outlookData}
                />
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "career-matches" && (
        <div className="space-y-4">
          {occupationLookup.loading || pathwaysData.loading || currentRoleJobData.loading ? (
            <>
              <Card className="p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </Card>
              <MasterDetailSkeleton />
            </>
          ) : occupationLookup.error || pathwaysData.error || currentRoleJobData.error ? (
            <ErrorCard
              message={occupationLookup.error || pathwaysData.error || currentRoleJobData.error || "Unknown error"}
              onRetry={() => {
                window.location.reload();
              }}
            />
          ) : (
            <>
              {pathwaysData.data && <CurrentRoleCard data={pathwaysData.data} />}
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
                <div ref={matchDetailRef} className="lg:col-span-3 scroll-mt-4">
                  {selectedItem?.type === "match" ? (
                    currentRoleJobData.data ? (
                      <CareerMatchDetail
                        match={selectedItem.data}
                        jobPostingsData={currentRoleJobData.data}
                        outlookData={outlookData}
                      />
                    ) : (
                      <Card className="p-4">
                        <Skeleton className="h-40" />
                      </Card>
                    )
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
          {occupationLookup.loading || pathwaysData.loading || currentRoleJobData.loading ? (
            <>
              <Card className="p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </Card>
              <MasterDetailSkeleton />
            </>
          ) : occupationLookup.error || pathwaysData.error || currentRoleJobData.error ? (
            <ErrorCard
              message={occupationLookup.error || pathwaysData.error || currentRoleJobData.error || "Unknown error"}
              onRetry={() => {
                window.location.reload();
              }}
            />
          ) : (
            <>
              {pathwaysData.data && <CurrentRoleCard data={pathwaysData.data} />}
              <div className="grid gap-6 lg:grid-cols-5">
                {/* Master Panel - List */}
                <div className="lg:col-span-2 space-y-4">
                  {pathwaysData.data && (
                    <>
                      <PathwaySectionCard type="advancement">
                        {pathwaysData.data.advancementJobs.slice(0, 6).map((job) => (
                          <PathwayListItem
                            key={job.id}
                            job={job}
                            isSelected={selectedItem?.type === "pathway" && selectedItem.data.id === job.id}
                            onClick={() => handleSelectPathway(job)}
                          />
                        ))}
                      </PathwaySectionCard>

                      <PathwaySectionCard type="feeder">
                        {pathwaysData.data.feederJobs.slice(0, 6).map((job) => (
                          <PathwayListItem
                            key={job.id}
                            job={job}
                            isSelected={selectedItem?.type === "pathway" && selectedItem.data.id === job.id}
                            onClick={() => handleSelectPathway(job)}
                          />
                        ))}
                      </PathwaySectionCard>
                    </>
                  )}
                </div>

                {/* Detail Panel */}
                <div ref={pathwayDetailRef} className="lg:col-span-3 scroll-mt-4">
                  {selectedItem?.type === "pathway" ? (
                    currentRoleJobData.data ? (
                      <PathwayDetail
                        job={selectedItem.data}
                        skillGapData={skillGapData.data}
                        jobPostingsData={currentRoleJobData.data}
                        outlookData={outlookData}
                      />
                    ) : (
                      <Card className="p-4">
                        <Skeleton className="h-40" />
                      </Card>
                    )
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
          <OccupationSearch value={selectedOccupation} onChange={setSelectedOccupation} />

          {!selectedOccupation ? (
            // Empty state - no occupation selected yet
            <Card className="border-dashed">
              <CardContent className="pt-6 pb-6">
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-base font-medium text-charcoal mb-1">
                    Enter your preferred job here
                  </p>
                  <p className="text-sm text-gray-500">
                    Search and select an occupation above to view market data
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : explorerJobData.loading ? (
            <>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <MarketDataGridSkeleton />
            </>
          ) : explorerJobData.error ? (
            <ErrorCard
              message={explorerJobData.error}
              onRetry={explorerJobData.refetch}
            />
          ) : explorerJobData.data ? (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-lg font-medium text-charcoal">
                  {selectedOccupation}
                </span>
                <span className="text-sm text-gray-500">
                  {explorerJobData.data.postingsTrend.total.toLocaleString()} recent postings
                </span>
              </div>
              <MarketDataGrid
                jobPostingsData={explorerJobData.data}
                outlookData={outlookData}
              />
            </>
          ) : null}
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
