"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuestionnaireProfile } from "@/lib/data/questionnaire-data";
import { getCareerMatches } from "@/lib/data/career-matches";
import { getProjectedOutlookData } from "@/lib/data/projected-outlook";
import { ProfileSummaryCard } from "@/components/features/profile-summary-card";
import { CareerMatchCard } from "@/components/features/career-match-card";
import { ComparisonView } from "@/components/features/comparison-view";
import { NationalOutlookCard } from "@/components/features/national-outlook-card";
import { RegionalOutlookCard } from "@/components/features/regional-outlook-card";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { CareerMatch } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type AnalysisStep = {
  label: string;
  status: "pending" | "loading" | "complete";
};

type Tab = "profile" | "current-role" | "career-matches" | "comparison";

export default function AssessPage() {
  const [phase, setPhase] = useState<"questionnaire" | "analyzing" | "results">("questionnaire");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [selectedMatch, setSelectedMatch] = useState<CareerMatch | null>(null);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    { label: "Evaluating current role outlook", status: "pending" },
    { label: "Finding career matches", status: "pending" },
    { label: "Identifying skills gaps", status: "pending" },
  ]);

  const profile = getQuestionnaireProfile();
  const careerMatches = getCareerMatches();
  const outlookData = getProjectedOutlookData();

  const handleAnalyze = () => {
    setPhase("analyzing");

    // Simulate progressive analysis steps
    const stepDuration = 1000;

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

    // Transition to results after all steps
    setTimeout(() => {
      setPhase("results");
    }, analysisSteps.length * stepDuration + 500);
  };

  const handleSelectMatch = (match: CareerMatch) => {
    setSelectedMatch(match);
    setActiveTab("comparison");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Your Profile" },
    { id: "current-role", label: "Current Role" },
    { id: "career-matches", label: "Career Matches" },
    { id: "comparison", label: "Comparison" },
  ];

  // Questionnaire Summary Phase
  if (phase === "questionnaire") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal">Career Assessment</h1>
          <p className="mt-2 text-gray-600">
            Review your profile and discover personalized career transition opportunities.
          </p>
        </div>

        <ProfileSummaryCard profile={profile} />

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="bg-gold hover:bg-gold/90 text-white px-8"
            onClick={handleAnalyze}
          >
            Analyze My Career
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <NationalOutlookCard data={outlookData.national} />
            <RegionalOutlookCard data={outlookData.regional} />
          </div>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <p className="text-charcoal">
                <span className="font-semibold">Insight:</span>{" "}
                Based on the projected {Math.abs(outlookData.national.percentChange)}% decline in
                Customer Service Representative roles by 2030, now may be a good time to explore
                adjacent career paths that leverage your existing skills.
              </p>
            </CardContent>
          </Card>
        </div>
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
                isSelected={selectedMatch?.id === match.id}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "comparison" && (
        selectedMatch ? (
          <ComparisonView match={selectedMatch} />
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-gray-500">
              <p>Select a career match to see detailed comparison</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveTab("career-matches")}
              >
                View Career Matches
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
