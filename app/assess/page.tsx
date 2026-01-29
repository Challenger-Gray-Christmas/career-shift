"use client";

import { useState, useEffect, Suspense } from "react";
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
import { Loader2, CheckCircle2 } from "lucide-react";
import type { CareerMatch, PathwayJob } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type AnalysisStep = {
  label: string;
  status: "pending" | "loading" | "complete";
};

type Tab = "profile" | "current-role" | "career-matches" | "career-pathways";

type SelectedItem =
  | { type: "match"; data: CareerMatch }
  | { type: "pathway"; data: PathwayJob };

function AssessPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;

  const [phase, setPhase] = useState<"analyzing" | "results">("analyzing");
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || "profile");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("national");
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    { label: "Evaluating current role outlook", status: "pending" },
    { label: "Finding career matches", status: "pending" },
    { label: "Identifying skills gaps", status: "pending" },
  ]);

  const profile = getQuestionnaireProfile();
  const careerMatches = getCareerMatches();
  const outlookData = getProjectedOutlookData();
  const jobPostingsData = getJobPostingsData(profile.currentRole);
  const pathwaysData = getCareerPathwaysData("23111410");

  const skillGapData = selectedItem?.type === "pathway"
    ? getSkillGapData(pathwaysData.id, selectedItem.data.id)
    : null;

  // Auto-start analyzing animation on mount
  useEffect(() => {
    const stepDuration = 800;

    analysisSteps.forEach((_, index) => {
      setTimeout(() => {
        setAnalysisSteps((prev) =>
          prev.map((step, i) => ({
            ...step,
            status: i < index ? "complete" : i === index ? "loading" : "pending",
          }))
        );
      }, index * stepDuration);

      setTimeout(() => {
        setAnalysisSteps((prev) =>
          prev.map((step, i) => ({
            ...step,
            status: i <= index ? "complete" : "pending",
          }))
        );
      }, (index + 1) * stepDuration - 100);
    });

    setTimeout(() => {
      setPhase("results");
    }, analysisSteps.length * stepDuration + 300);
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // Auto-select first item when switching to career tabs
    if (tab === "career-matches" && selectedItem?.type !== "match" && careerMatches.length > 0) {
      setSelectedItem({ type: "match", data: careerMatches[0] });
    }
    if (tab === "career-pathways" && selectedItem?.type !== "pathway" && pathwaysData.advancementJobs.length > 0) {
      setSelectedItem({ type: "pathway", data: pathwaysData.advancementJobs[0] });
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
  ];

  // Analyzing Phase
  if (phase === "analyzing") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md mt-20">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-charcoal">Analyzing Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {step.status === "loading" ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gold" />
                    ) : step.status === "complete" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-200" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        step.status === "complete" && "text-green-600",
                        step.status === "loading" && "text-gold font-medium",
                        step.status === "pending" && "text-gray-400"
                      )}
                    >
                      {step.label}...
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results Phase with Tabs
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
          <CurrentRoleCard
            data={pathwaysData}
            regions={jobPostingsData.topRegions}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />
          <MarketDataGrid
            jobPostingsData={jobPostingsData}
            outlookData={outlookData}
          />
        </div>
      )}

      {activeTab === "career-matches" && (
        <div className="space-y-4">
          <CurrentRoleCard
            data={pathwaysData}
            regions={jobPostingsData.topRegions}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />

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
        </div>
      )}

      {activeTab === "career-pathways" && (
        <div className="space-y-4">
          <CurrentRoleCard
            data={pathwaysData}
            regions={jobPostingsData.topRegions}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Master Panel - List */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <p className="text-sm font-medium text-charcoal mb-2">Where You Could Go</p>
                <div className="space-y-2">
                  {pathwaysData.advancementJobs.slice(0, 6).map((job) => (
                    <PathwayListItem
                      key={job.id}
                      job={job}
                      isSelected={selectedItem?.type === "pathway" && selectedItem.data.id === job.id}
                      onClick={() => handleSelectPathway(job)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-charcoal mb-2">Where People Come From</p>
                <div className="space-y-2">
                  {pathwaysData.feederJobs.slice(0, 6).map((job) => (
                    <PathwayListItem
                      key={job.id}
                      job={job}
                      isSelected={selectedItem?.type === "pathway" && selectedItem.data.id === job.id}
                      onClick={() => handleSelectPathway(job)}
                    />
                  ))}
                </div>
              </div>
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
