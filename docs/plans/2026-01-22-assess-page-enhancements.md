# Assess Page Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate /assess, /explore, and /pathways into a unified coach experience with 5 tabs, search functionality, and enhanced comparison views.

**Architecture:** Refactor /assess to include all client data (profile, current role market data, career matches, career pathways, and comparison). Enhance /explore with search. Filter trend charts to exclude current month. Remove /pathways page.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui components, Recharts

---

## Task 1: Create utility to filter current month from timeseries data

**Files:**
- Create: `lib/utils/filter-timeseries.ts`

**Step 1: Create the filter utility**

```typescript
// lib/utils/filter-timeseries.ts

/**
 * Filters timeseries data to exclude the current month.
 * Returns data only through the last complete month.
 */
export function filterCurrentMonth<T extends { month: string[]; values: number[] }>(
  timeseries: T
): T {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const filteredIndices: number[] = [];
  timeseries.month.forEach((month, index) => {
    if (month !== currentMonth) {
      filteredIndices.push(index);
    }
  });

  return {
    ...timeseries,
    month: filteredIndices.map((i) => timeseries.month[i]),
    values: filteredIndices.map((i) => timeseries.values[i]),
  } as T;
}
```

**Step 2: Commit**

```bash
git add lib/utils/filter-timeseries.ts
git commit -m "feat: add utility to filter current month from timeseries"
```

---

## Task 2: Update PostingsTrendCard to exclude current month

**Files:**
- Modify: `components/features/postings-trend-card.tsx`

**Step 1: Update the component**

```typescript
// components/features/postings-trend-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/line-chart";
import { filterCurrentMonth } from "@/lib/utils/filter-timeseries";
import type { PostingsTrend } from "@/lib/data/types";

interface PostingsTrendCardProps {
  data: PostingsTrend;
}

export function PostingsTrendCard({ data }: PostingsTrendCardProps) {
  const filteredTimeseries = filterCurrentMonth(data.timeseries);

  const chartData = filteredTimeseries.month.map((month, i) => ({
    month,
    value: filteredTimeseries.values[i],
  }));

  const formatPostings = (value: number) => `${(value / 1000).toFixed(0)}k`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Job Postings Trend</CardTitle>
        <p className="text-2xl font-bold text-gold">{data.total.toLocaleString()}</p>
        <p className="text-xs text-gray-500">Total Unique Postings</p>
      </CardHeader>
      <CardContent>
        <LineChart data={chartData} valueFormatter={formatPostings} color="#32373c" />
      </CardContent>
    </Card>
  );
}
```

**Step 2: Commit**

```bash
git add components/features/postings-trend-card.tsx
git commit -m "feat: filter current month from postings trend chart"
```

---

## Task 3: Update SalaryTrendCard to exclude current month

**Files:**
- Modify: `components/features/salary-trend-card.tsx`

**Step 1: Update the component**

```typescript
// components/features/salary-trend-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/line-chart";
import { filterCurrentMonth } from "@/lib/utils/filter-timeseries";
import type { SalaryTrend } from "@/lib/data/types";

interface SalaryTrendCardProps {
  data: SalaryTrend;
}

export function SalaryTrendCard({ data }: SalaryTrendCardProps) {
  const filteredTimeseries = filterCurrentMonth(data.timeseries);

  const chartData = filteredTimeseries.month.map((month, i) => ({
    month,
    value: filteredTimeseries.values[i],
  }));

  const formatSalary = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Salary Trend</CardTitle>
        <p className="text-2xl font-bold text-gold">{formatSalary(data.total)}</p>
        <p className="text-xs text-gray-500">Median Annual Salary</p>
      </CardHeader>
      <CardContent>
        <LineChart data={chartData} valueFormatter={formatSalary} />
      </CardContent>
    </Card>
  );
}
```

**Step 2: Commit**

```bash
git add components/features/salary-trend-card.tsx
git commit -m "feat: filter current month from salary trend chart"
```

---

## Task 4: Create MarketDataGrid component for reusable chart layout

**Files:**
- Create: `components/features/market-data-grid.tsx`

**Step 1: Create the component**

This component will be reused in Current Role tab, Comparison tab, and Explore page.

```typescript
// components/features/market-data-grid.tsx
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
        <div className="grid gap-6 md:grid-cols-2">
          <NationalOutlookCard data={outlookData.national} />
          <RegionalOutlookCard data={outlookData.regional} />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <SalaryTrendCard data={jobPostingsData.salaryTrend} />
        <PostingsTrendCard data={jobPostingsData.postingsTrend} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RegionsCard data={jobPostingsData.topRegions} />
        <CompaniesCard data={jobPostingsData.topCompanies} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <EducationCard data={jobPostingsData.educationRequirements} />
        <TitlesCard data={jobPostingsData.topTitles} />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/features/market-data-grid.tsx
git commit -m "feat: add MarketDataGrid component for reusable chart layout"
```

---

## Task 5: Update /assess page - Add 5 tabs and Career Pathways

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Update imports and types**

At the top of `app/assess/page.tsx`, update imports:

```typescript
"use client";

import { useState, useEffect } from "react";
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
```

**Step 2: Update state and data loading**

Replace the state and data loading section (lines 25-37):

```typescript
export default function AssessPage() {
  const [phase, setPhase] = useState<"analyzing" | "results">("analyzing");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
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
```

**Step 3: Update selection handlers**

Replace the handleAnalyze and handleSelectMatch functions:

```typescript
  const handleSelectMatch = (match: CareerMatch) => {
    setSelectedItem({ type: "match", data: match });
    setActiveTab("comparison");
  };

  const handleSelectPathway = (job: PathwayJob) => {
    setSelectedItem({ type: "pathway", data: job });
    setActiveTab("comparison");
  };
```

**Step 4: Update tabs array**

Replace the tabs definition (around line 76-81):

```typescript
  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Client Profile" },
    { id: "current-role", label: "Current Role" },
    { id: "career-matches", label: "Career Matches" },
    { id: "career-pathways", label: "Career Pathways" },
    { id: "comparison", label: "Comparison" },
  ];
```

**Step 5: Remove questionnaire phase**

Delete the entire questionnaire phase block (lines 83-106 in original file) - the `if (phase === "questionnaire")` block.

**Step 6: Update current-role tab content**

Replace the current-role tab content (lines 182-198 in original):

```typescript
      {activeTab === "current-role" && (
        <MarketDataGrid
          jobPostingsData={jobPostingsData}
          outlookData={outlookData}
        />
      )}
```

**Step 7: Add career-pathways tab content**

After the career-matches tab content, add:

```typescript
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
```

**Step 8: Update comparison tab content**

Replace the comparison tab content:

```typescript
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
```

**Step 9: Update career-matches tab to use new selection**

Update the career-matches tab:

```typescript
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
```

**Step 10: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: update assess page with 5 tabs and career pathways"
```

---

## Task 6: Update ComparisonView to include market data

**Files:**
- Modify: `components/features/comparison-view.tsx`

**Step 1: Update the component**

```typescript
// components/features/comparison-view.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart } from "@/components/charts/line-chart";
import { MarketDataGrid } from "@/components/features/market-data-grid";
import { TrendingUp, TrendingDown, Minus, Check, BookOpen, ExternalLink } from "lucide-react";
import type { CareerMatch, JobPostingsData, ProjectedOutlookData } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface ComparisonViewProps {
  match: CareerMatch;
  jobPostingsData?: JobPostingsData;
  outlookData?: ProjectedOutlookData;
}

export function ComparisonView({ match, jobPostingsData, outlookData }: ComparisonViewProps) {
  const OutlookIcon = match.outlookPercent > 2
    ? TrendingUp
    : match.outlookPercent < -2
      ? TrendingDown
      : Minus;

  const outlookColor = match.outlookPercent > 2
    ? "text-green-600"
    : match.outlookPercent < -2
      ? "text-red-500"
      : "text-yellow-600";

  const formatSalary = (value: number) => `$${value.toLocaleString()}`;

  // Generate simple outlook trend data
  const outlookChartData = Array.from({ length: 7 }, (_, i) => ({
    month: (2024 + i).toString(),
    value: 100 + (match.outlookPercent / 6) * i,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-gold">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-charcoal">{match.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gold/10 text-gold font-bold">
                  {match.matchPercent}%
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skill Match</p>
                  <p className="font-medium text-charcoal">
                    {formatSalary(match.salaryRange.min)} - {formatSalary(match.salaryRange.max)} / year
                  </p>
                </div>
              </div>
            </div>
            <div className={cn("flex items-center gap-2 text-lg font-semibold", outlookColor)}>
              <OutlookIcon className="h-6 w-6" />
              {match.outlookPercent > 0 ? "+" : ""}{match.outlookPercent}%
              <span className="text-sm font-normal text-gray-500">by 2030</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <LineChart
              data={outlookChartData}
              valueFormatter={(v) => `${v.toFixed(0)}%`}
              color={match.outlookPercent >= 0 ? "#22c55e" : "#ef4444"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transferable Skills */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-charcoal flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            Skills You Have (Transferable)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {match.transferableSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-green-50 text-green-700 border border-green-200"
              >
                <Check className="h-3 w-3 mr-1" />
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Gap with Courses */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-charcoal flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gold" />
            Skills to Develop
          </CardTitle>
          <p className="text-xs text-gray-500">
            Recommended courses to bridge the gap
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {match.skillsGap.map((gap) => (
              <div key={gap.skill} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-charcoal">{gap.skill}</p>
                    <p className="text-sm text-gold mt-1">{gap.course.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{gap.course.provider}</span>
                      <span>|</span>
                      <span>{gap.course.duration}</span>
                      <span>|</span>
                      <Badge variant="outline" className="text-xs py-0">
                        {gap.course.level}
                      </Badge>
                    </div>
                  </div>
                  <a
                    href={gap.course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Data - only show if data provided */}
      {jobPostingsData && outlookData && (
        <>
          <h2 className="text-lg font-semibold text-charcoal mt-8">Market Data for {match.title}</h2>
          <MarketDataGrid
            jobPostingsData={jobPostingsData}
            outlookData={outlookData}
          />
        </>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/features/comparison-view.tsx
git commit -m "feat: add market data section to ComparisonView"
```

---

## Task 7: Create OccupationSearch component for explore page

**Files:**
- Create: `components/features/occupation-search.tsx`

**Step 1: Create the search component**

```typescript
// components/features/occupation-search.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Sample occupations for autocomplete (will be replaced by API)
const SAMPLE_OCCUPATIONS = [
  "Customer Service Representative",
  "Sales Representative",
  "Administrative Assistant",
  "HR Coordinator",
  "Account Manager",
  "Insurance Agent",
  "Retail Manager",
  "Bank Teller",
  "Receptionist",
  "Data Analyst",
  "Software Developer",
  "Project Manager",
  "Marketing Coordinator",
  "Financial Analyst",
  "Operations Manager",
];

interface OccupationSearchProps {
  value: string;
  onChange: (occupation: string) => void;
}

export function OccupationSearch({ value, onChange }: OccupationSearchProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = SAMPLE_OCCUPATIONS.filter((occ) =>
    occ.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSelect = (occupation: string) => {
    setQuery(occupation);
    onChange(occupation);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => (i + 1) % filtered.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => (i - 1 + filtered.length) % filtered.length);
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightedIndex]) {
          handleSelect(filtered[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search any job title..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          className="pl-10"
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filtered.map((occupation, index) => (
            <li
              key={occupation}
              className={cn(
                "px-4 py-2 cursor-pointer text-sm",
                index === highlightedIndex
                  ? "bg-gold/10 text-gold"
                  : "text-charcoal hover:bg-gray-50"
              )}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseDown={() => handleSelect(occupation)}
            >
              {occupation}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/features/occupation-search.tsx
git commit -m "feat: add OccupationSearch component with autocomplete"
```

---

## Task 8: Update /explore page with search functionality

**Files:**
- Modify: `app/explore/page.tsx`

**Step 1: Update the explore page**

```typescript
// app/explore/page.tsx
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
```

**Step 2: Commit**

```bash
git add app/explore/page.tsx
git commit -m "feat: update explore page with search functionality"
```

---

## Task 9: Update navigation - remove pathways link

**Files:**
- Modify: `components/navigation.tsx`

**Step 1: Update navigation**

```typescript
// components/navigation.tsx
import Image from "next/image";
import Link from "next/link";

export function Navigation() {
  return (
    <header className="border-b border-lightgray bg-white">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <Image
            src="/cgc-logo.svg"
            alt="Challenger, Gray & Christmas"
            width={160}
            height={28}
            priority
          />
        </Link>
        <div className="flex gap-4 sm:gap-6">
          <Link href="/assess" className="text-sm sm:text-base text-charcoal hover:text-gold transition-colors">
            Assessment
          </Link>
          <Link href="/explore" className="text-sm sm:text-base text-charcoal hover:text-gold transition-colors">
            Job Explorer
          </Link>
        </div>
      </nav>
    </header>
  );
}
```

**Step 2: Commit**

```bash
git add components/navigation.tsx
git commit -m "feat: remove pathways link from navigation"
```

---

## Task 10: Remove /pathways page (redirect to /assess)

**Files:**
- Modify: `app/pathways/page.tsx`

**Step 1: Replace with redirect**

```typescript
// app/pathways/page.tsx
import { redirect } from "next/navigation";

export default function PathwaysPage() {
  redirect("/assess?tab=career-pathways");
}
```

**Step 2: Commit**

```bash
git add app/pathways/page.tsx
git commit -m "feat: redirect /pathways to /assess"
```

---

## Task 11: Handle tab query parameter in /assess

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Add URL parameter handling**

Add `useSearchParams` to handle the tab query parameter. Update the imports at the top:

```typescript
import { useSearchParams } from "next/navigation";
```

Update the component to read the tab from URL:

```typescript
export default function AssessPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;

  const [phase, setPhase] = useState<"analyzing" | "results">("analyzing");
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || "profile");
  // ... rest of state
```

**Step 2: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: handle tab query parameter in assess page"
```

---

## Task 12: Final verification and cleanup

**Step 1: Run the build to check for errors**

```bash
npm run build
```

**Step 2: Fix any TypeScript or build errors**

Address any errors that appear.

**Step 3: Run the dev server and manually test**

```bash
npm run dev
```

Test:
- [ ] /assess loads with analyzing animation, then shows 5 tabs
- [ ] "Client Profile" tab shows profile data
- [ ] "Current Role" tab shows all 8 charts in 2-column grid
- [ ] "Career Matches" tab shows cards, clicking navigates to Comparison
- [ ] "Career Pathways" tab shows advancement/feeder jobs
- [ ] "Comparison" tab shows skills + market data for selected item
- [ ] /explore has search bar and shows market data
- [ ] /pathways redirects to /assess
- [ ] Trend charts exclude current month (January 2026)

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Filter timeseries utility | `lib/utils/filter-timeseries.ts` |
| 2 | Update PostingsTrendCard | `components/features/postings-trend-card.tsx` |
| 3 | Update SalaryTrendCard | `components/features/salary-trend-card.tsx` |
| 4 | Create MarketDataGrid | `components/features/market-data-grid.tsx` |
| 5 | Update /assess with 5 tabs | `app/assess/page.tsx` |
| 6 | Update ComparisonView | `components/features/comparison-view.tsx` |
| 7 | Create OccupationSearch | `components/features/occupation-search.tsx` |
| 8 | Update /explore with search | `app/explore/page.tsx` |
| 9 | Update navigation | `components/navigation.tsx` |
| 10 | Redirect /pathways | `app/pathways/page.tsx` |
| 11 | Handle tab query param | `app/assess/page.tsx` |
| 12 | Final verification | - |
