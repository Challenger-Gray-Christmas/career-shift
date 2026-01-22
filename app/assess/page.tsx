"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuestionnaireProfile } from "@/lib/data/questionnaire-data";
import { getCareerMatches } from "@/lib/data/career-matches";
import { getProjectedOutlookData } from "@/lib/data/projected-outlook";
import { getJobPostingsData } from "@/lib/data/job-postings";
import { getCareerPathwaysData, getSkillGapData } from "@/lib/data/career-pathways";
import { ProfileSummaryCard } from "@/components/features/profile-summary-card";
import { CareerMatchCard } from "@/components/features/career-match-card";
import { ComparisonView } from "@/components/features/comparison-view";
import { MarketDataGrid } from "@/components/features/market-data-grid";
import { CurrentRoleCard } from "@/components/features/current-role-card";
import { PathwayCard } from "@/components/features/pathway-card";
import { SkillGapPanel } from "@/components/features/skill-gap-panel";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { CareerMatch, PathwayJob } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type AnalysisStep = {
  label: string;
  status: "pending" | "loading" | "complete";
};

type Tab = "profile" | "current-role" | "career-matches" | "career-pathways" | "comparison";

type SelectedItem =
  | { type: "match"; data: CareerMatch }
  | { type: "pathway"; data: PathwayJob };

function AssessPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;

  const [phase, setPhase] = useState<"analyzing" | "results">("analyzing");
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || "profile");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
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

  const handleSelectMatch = (match: CareerMatch) => {
    setSelectedItem({ type: "match", data: match });
    setActiveTab("comparison");
  };

  const handleSelectPathway = (job: PathwayJob) => {
    setSelectedItem({ type: "pathway", data: job });
    setActiveTab("comparison");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Client Profile" },
    { id: "current-role", label: "Current Role" },
    { id: "career-matches", label: "Career Matches" },
    { id: "career-pathways", label: "Career Pathways" },
    { id: "comparison", label: "Comparison" },
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
              onClick={() => setActiveTab(tab.id)}
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
        <MarketDataGrid
          jobPostingsData={jobPostingsData}
          outlookData={outlookData}
        />
      )}

      {activeTab === "career-matches" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Click on a career to see detailed comparison and skills gap analysis.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {careerMatches.map((match) => (
              <CareerMatchCard
                key={match.id}
                match={match}
                onClick={() => handleSelectMatch(match)}
                isSelected={selectedItem?.type === "match" && selectedItem.data.id === match.id}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "career-pathways" && (
        <div className="space-y-6">
          <CurrentRoleCard data={pathwaysData} />

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-charcoal">
                Where You Could Go
              </h2>
              <div className="space-y-3">
                {pathwaysData.advancementJobs.slice(0, 6).map((job) => (
                  <PathwayCard
                    key={job.id}
                    job={job}
                    onClick={() => handleSelectPathway(job)}
                    isSelected={selectedItem?.type === "pathway" && selectedItem.data.id === job.id}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-charcoal">
                Where People Come From
              </h2>
              <div className="space-y-3">
                {pathwaysData.feederJobs.slice(0, 6).map((job) => (
                  <PathwayCard
                    key={job.id}
                    job={job}
                    onClick={() => handleSelectPathway(job)}
                    isSelected={selectedItem?.type === "pathway" && selectedItem.data.id === job.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "comparison" && (
        selectedItem ? (
          selectedItem.type === "match" ? (
            <ComparisonView
              match={selectedItem.data}
              jobPostingsData={jobPostingsData}
              outlookData={outlookData}
            />
          ) : (
            <div className="space-y-6">
              <SkillGapPanel data={skillGapData!} />
              <MarketDataGrid
                jobPostingsData={jobPostingsData}
                outlookData={outlookData}
              />
            </div>
          )
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-gray-500">
              <p>Select a career from Career Matches or Career Pathways to see detailed analysis</p>
              <div className="mt-4 flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("career-matches")}
                >
                  View Career Matches
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("career-pathways")}
                >
                  View Career Pathways
                </Button>
              </div>
            </CardContent>
          </Card>
        )
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
