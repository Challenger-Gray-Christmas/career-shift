# Assess Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the assess page with master-detail layout, remove comparison tab, add region selector, and fix chart readability issues.

**Architecture:** Replace tab-based comparison navigation with inline master-detail panels on Career Matches and Career Pathways tabs. Add global region state that filters market data. Convert Top Regions from chart to table.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Radix UI (Select component), Recharts

---

## Task 1: Remove Fake Forecast Chart from ComparisonView

**Files:**
- Modify: `components/features/comparison-view.tsx:30-72`

**Step 1: Remove the fake chart data generation and chart component**

Delete lines 30-34 (outlookChartData generation) and lines 63-71 (the chart rendering in CardContent).

The header card should only contain the title, skill match badge, salary, and outlook badge - no chart.

```tsx
// comparison-view.tsx - Updated header card (replace lines 36-72)
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
    </Card>
    {/* ... rest of component */}
```

**Step 2: Remove unused LineChart import**

Delete line 3: `import { LineChart } from "@/components/charts/line-chart";`

**Step 3: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add components/features/comparison-view.tsx
git commit -m "fix: remove fake forecast chart from comparison view

The synthetic 2024-2030 chart was confusing - it just interpolated
the outlookPercent linearly. The badge already shows the same info.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Convert Top Regions from Chart to Table

**Files:**
- Modify: `components/features/regions-card.tsx`

**Step 1: Replace the horizontal bar chart with a table**

```tsx
// regions-card.tsx - Complete replacement
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RegionRanking } from "@/lib/data/types";

interface RegionsCardProps {
  data: RegionRanking[];
}

export function RegionsCard({ data }: RegionsCardProps) {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, 10);
  const maxPostings = Math.max(...data.map(d => d.unique_postings));

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Regions</CardTitle>
        <p className="text-xs text-gray-500">By unique job postings</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayData.map((region, index) => (
            <div key={region.name} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-5 text-right">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-charcoal truncate" title={region.name}>
                  {region.name}
                </p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-gold/60"
                    style={{ width: `${(region.unique_postings / maxPostings) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-charcoal tabular-nums">
                {formatNumber(region.unique_postings)}
              </span>
            </div>
          ))}
        </div>
        {data.length > 10 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-xs text-gray-500"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `Show all ${data.length} regions`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

**Step 2: Verify the component renders correctly**

Run: `npm run dev`
Navigate to: `/assess?tab=current-role`
Expected: Top Regions shows as a table with full region names, numbers, and small progress bars

**Step 3: Commit**

```bash
git add components/features/regions-card.tsx
git commit -m "feat: convert Top Regions from chart to table

Horizontal bar chart was truncating long region names. Table format
shows full names with inline progress bars for visual comparison.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Create Collapsible Section Component

**Files:**
- Create: `components/ui/collapsible-section.tsx`

**Step 1: Create the collapsible section component**

```tsx
// components/ui/collapsible-section.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-charcoal">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
```

**Step 2: Verify the component exports correctly**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/ui/collapsible-section.tsx
git commit -m "feat: add CollapsibleSection component

Reusable accordion-style section for detail panel content.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create Career Match Detail Panel Component

**Files:**
- Create: `components/features/career-match-detail.tsx`

**Step 1: Create the detail panel that shows when a career match is selected**

```tsx
// components/features/career-match-detail.tsx
"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { MarketDataGrid } from "@/components/features/market-data-grid";
import { TrendingUp, TrendingDown, Minus, Check, BookOpen, ExternalLink } from "lucide-react";
import type { CareerMatch, JobPostingsData, ProjectedOutlookData } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface CareerMatchDetailProps {
  match: CareerMatch;
  jobPostingsData?: JobPostingsData;
  outlookData?: ProjectedOutlookData;
}

export function CareerMatchDetail({ match, jobPostingsData, outlookData }: CareerMatchDetailProps) {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-l-4 border-l-gold">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl text-charcoal">{match.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gold/10 text-gold font-bold text-sm">
                  {match.matchPercent}%
                </div>
                <div>
                  <p className="text-xs text-gray-500">Skill Match</p>
                  <p className="text-sm font-medium text-charcoal">
                    {formatSalary(match.salaryRange.min)} - {formatSalary(match.salaryRange.max)} / year
                  </p>
                </div>
              </div>
            </div>
            <div className={cn("flex items-center gap-1 text-sm font-semibold", outlookColor)}>
              <OutlookIcon className="h-4 w-4" />
              {match.outlookPercent > 0 ? "+" : ""}{match.outlookPercent}%
              <span className="text-xs font-normal text-gray-500">by 2030</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Skills & Training - Open by default */}
      <CollapsibleSection
        title="Skills & Training"
        icon={<BookOpen className="h-4 w-4 text-gold" />}
        defaultOpen={true}
      >
        <div className="space-y-4">
          {/* Transferable Skills */}
          <div>
            <p className="text-sm font-medium text-charcoal flex items-center gap-2 mb-2">
              <Check className="h-4 w-4 text-green-600" />
              Skills You Have
            </p>
            <div className="flex flex-wrap gap-2">
              {match.transferableSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-green-50 text-green-700 border border-green-200 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills to Develop */}
          <div>
            <p className="text-sm font-medium text-charcoal mb-2">Skills to Develop</p>
            <div className="space-y-3">
              {match.skillsGap.map((gap) => (
                <div key={gap.skill} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{gap.skill}</p>
                      <p className="text-xs text-gold mt-1">{gap.course.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{gap.course.provider}</span>
                        <span>•</span>
                        <span>{gap.course.duration}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs py-0 px-1">
                          {gap.course.level}
                        </Badge>
                      </div>
                    </div>
                    <a
                      href={gap.course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 flex-shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Market Data - Collapsed by default */}
      {jobPostingsData && outlookData && (
        <CollapsibleSection
          title="Market Data"
          icon={<TrendingUp className="h-4 w-4 text-charcoal" />}
          defaultOpen={false}
        >
          <MarketDataGrid
            jobPostingsData={jobPostingsData}
            outlookData={outlookData}
          />
        </CollapsibleSection>
      )}
    </div>
  );
}
```

**Step 2: Verify the component builds**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/features/career-match-detail.tsx
git commit -m "feat: add CareerMatchDetail component for master-detail panel

Shows career match details with collapsible Skills & Training (open)
and Market Data (collapsed) sections.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Create Compact Career Match List Item Component

**Files:**
- Create: `components/features/career-match-list-item.tsx`

**Step 1: Create a compact list item for the master panel**

```tsx
// components/features/career-match-list-item.tsx
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CareerMatch } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface CareerMatchListItemProps {
  match: CareerMatch;
  isSelected: boolean;
  onClick: () => void;
}

export function CareerMatchListItem({ match, isSelected, onClick }: CareerMatchListItemProps) {
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

  const formatSalary = (value: number) => `$${(value / 1000).toFixed(0)}K`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all",
        isSelected
          ? "border-gold bg-gold/5 ring-1 ring-gold"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-charcoal text-sm">{match.title}</span>
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gold/10 text-gold font-bold text-xs">
          {match.matchPercent}%
        </div>
      </div>
      <div className="mt-1 flex items-center gap-3 text-xs">
        <span className={cn("flex items-center gap-1", outlookColor)}>
          <OutlookIcon className="h-3 w-3" />
          {match.outlookPercent > 0 ? "+" : ""}{match.outlookPercent}%
        </span>
        <span className="text-gray-500">
          {formatSalary(match.salaryRange.min)} - {formatSalary(match.salaryRange.max)}
        </span>
      </div>
    </button>
  );
}
```

**Step 2: Verify the component builds**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/features/career-match-list-item.tsx
git commit -m "feat: add CareerMatchListItem for compact master panel list

Compact clickable item showing title, match %, outlook, and salary.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Create Pathway Detail Panel Component

**Files:**
- Create: `components/features/pathway-detail.tsx`

**Step 1: Create the detail panel for pathway jobs**

```tsx
// components/features/pathway-detail.tsx
"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { MarketDataGrid } from "@/components/features/market-data-grid";
import { TrendingUp, ArrowRight } from "lucide-react";
import type { PathwayJob, SkillGapData, JobPostingsData, ProjectedOutlookData } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface PathwayDetailProps {
  job: PathwayJob;
  skillGapData: SkillGapData | null;
  jobPostingsData?: JobPostingsData;
  outlookData?: ProjectedOutlookData;
}

export function PathwayDetail({ job, skillGapData, jobPostingsData, outlookData }: PathwayDetailProps) {
  const formatSalary = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  const salaryDiffColor = job.meanSalaryDiff > 0
    ? "text-green-600"
    : job.meanSalaryDiff < 0
      ? "text-red-500"
      : "text-gray-500";

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-l-4 border-l-gold">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl text-charcoal">{job.name}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Avg Salary</p>
                  <p className="text-sm font-medium text-charcoal">
                    {formatSalary(job.meanSalary)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">vs Current</p>
                  <p className={cn("text-sm font-medium", salaryDiffColor)}>
                    {job.meanSalaryDiff > 0 ? "+" : ""}{formatSalary(job.meanSalaryDiff)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Level Change</p>
                  <p className="text-sm font-medium text-charcoal">
                    {job.jobLevelDiff > 0 ? "+" : ""}{job.jobLevelDiff}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gold/10 text-gold font-bold text-sm">
              {job.score}%
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Skills Gap - Open by default */}
      {skillGapData && skillGapData.skillGap.length > 0 && (
        <CollapsibleSection
          title="Skills to Acquire"
          icon={<ArrowRight className="h-4 w-4 text-gold" />}
          defaultOpen={true}
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-3">
              {skillGapData.source.name} → {skillGapData.destination.name}
            </p>
            {skillGapData.skillGap.map((skill) => {
              const maxScore = Math.max(...skillGapData.skillGap.map(s => s.importanceScore));
              return (
                <div key={skill.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal">{skill.name}</span>
                    <span className="text-gray-500 text-xs">
                      {skill.importanceScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-gold"
                      style={{ width: `${(skill.importanceScore / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Market Data - Collapsed by default */}
      {jobPostingsData && outlookData && (
        <CollapsibleSection
          title="Market Data"
          icon={<TrendingUp className="h-4 w-4 text-charcoal" />}
          defaultOpen={false}
        >
          <MarketDataGrid
            jobPostingsData={jobPostingsData}
            outlookData={outlookData}
          />
        </CollapsibleSection>
      )}
    </div>
  );
}
```

**Step 2: Verify the component builds**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/features/pathway-detail.tsx
git commit -m "feat: add PathwayDetail component for pathway master-detail

Shows pathway job details with skill gap bars and market data sections.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Create Compact Pathway List Item Component

**Files:**
- Create: `components/features/pathway-list-item.tsx`

**Step 1: Create a compact list item for pathways**

```tsx
// components/features/pathway-list-item.tsx
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { PathwayJob } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface PathwayListItemProps {
  job: PathwayJob;
  isSelected: boolean;
  onClick: () => void;
}

export function PathwayListItem({ job, isSelected, onClick }: PathwayListItemProps) {
  const SalaryIcon = job.meanSalaryDiff > 0
    ? ArrowUp
    : job.meanSalaryDiff < 0
      ? ArrowDown
      : Minus;

  const salaryColor = job.meanSalaryDiff > 0
    ? "text-green-600"
    : job.meanSalaryDiff < 0
      ? "text-red-500"
      : "text-gray-500";

  const formatSalary = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all",
        isSelected
          ? "border-gold bg-gold/5 ring-1 ring-gold"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-charcoal text-sm">{job.name}</span>
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gold/10 text-gold font-bold text-xs">
          {job.score}%
        </div>
      </div>
      <div className="mt-1 flex items-center gap-3 text-xs">
        <span className={cn("flex items-center gap-1", salaryColor)}>
          <SalaryIcon className="h-3 w-3" />
          {job.meanSalaryDiff > 0 ? "+" : ""}{formatSalary(job.meanSalaryDiff)}
        </span>
        <span className="text-gray-500">
          {formatSalary(job.meanSalary)}
        </span>
        <span className="text-gray-400">
          Level {job.jobLevelDiff > 0 ? "+" : ""}{job.jobLevelDiff}
        </span>
      </div>
    </button>
  );
}
```

**Step 2: Verify the component builds**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/features/pathway-list-item.tsx
git commit -m "feat: add PathwayListItem for compact master panel list

Compact clickable item showing name, score, salary diff, and level.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Add Region Selector to CurrentRoleCard

**Files:**
- Modify: `components/features/current-role-card.tsx`

**Step 1: Update CurrentRoleCard to accept region state and callback**

```tsx
// components/features/current-role-card.tsx - Complete replacement
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CareerPathwaysData, RegionRanking } from "@/lib/data/types";

interface CurrentRoleCardProps {
  data: CareerPathwaysData;
  regions?: RegionRanking[];
  selectedRegion?: string;
  onRegionChange?: (region: string) => void;
}

export function CurrentRoleCard({
  data,
  regions,
  selectedRegion = "national",
  onRegionChange
}: CurrentRoleCardProps) {
  return (
    <Card className="border-l-4 border-l-charcoal">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-gray-500">Current Role</CardTitle>
            <p className="text-xl font-bold text-charcoal">{data.name}</p>
          </div>
          {regions && onRegionChange && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Viewing outlook for:</span>
              <Select value={selectedRegion} onValueChange={onRegionChange}>
                <SelectTrigger className="w-[200px] h-8 text-xs">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">National (All Regions)</SelectItem>
                  {regions.slice(0, 20).map((region) => (
                    <SelectItem key={region.name} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-gray-500">Level:</span>
            <span className="ml-1 font-medium text-charcoal">{data.jobLevel}</span>
          </div>
          <div>
            <span className="text-gray-500">Avg Salary:</span>
            <span className="ml-1 font-medium text-gold">${(data.meanSalary / 1000).toFixed(0)}k</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Verify the component builds**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/features/current-role-card.tsx
git commit -m "feat: add region selector to CurrentRoleCard

Optional region dropdown for filtering market data globally.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Update Assess Page - Remove Comparison Tab

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Remove comparison tab from tabs array and update Tab type**

Change line 28 to remove "comparison":
```tsx
type Tab = "profile" | "current-role" | "career-matches" | "career-pathways";
```

Update tabs array (lines 96-102) to remove comparison:
```tsx
const tabs: { id: Tab; label: string }[] = [
  { id: "profile", label: "Client Profile" },
  { id: "current-role", label: "Current Role" },
  { id: "career-matches", label: "Career Matches" },
  { id: "career-pathways", label: "Career Pathways" },
];
```

**Step 2: Remove comparison tab content (lines 242-280)**

Delete the entire `{activeTab === "comparison" && ...}` block.

**Step 3: Remove handleSelectMatch and handleSelectPathway navigation to comparison tab**

Update lines 86-94 to not change tabs:
```tsx
const handleSelectMatch = (match: CareerMatch) => {
  setSelectedItem({ type: "match", data: match });
};

const handleSelectPathway = (job: PathwayJob) => {
  setSelectedItem({ type: "pathway", data: job });
};
```

**Step 4: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add app/assess/page.tsx
git commit -m "refactor: remove comparison tab from assess page

First step toward master-detail layout - tab removed, selection
no longer navigates away.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Update Assess Page - Add Region State

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Add selectedRegion state after selectedItem state (around line 40)**

```tsx
const [selectedRegion, setSelectedRegion] = useState<string>("national");
```

**Step 2: Verify the state is added correctly**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: add selectedRegion state to assess page

Global region state for filtering market data.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Update Assess Page - Career Matches Master-Detail Layout

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Add imports for new components at top of file**

```tsx
import { CareerMatchListItem } from "@/components/features/career-match-list-item";
import { CareerMatchDetail } from "@/components/features/career-match-detail";
```

**Step 2: Replace career-matches tab content with master-detail layout**

Replace the `{activeTab === "career-matches" && ...}` block:

```tsx
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
```

**Step 3: Auto-select first career match when tab opens**

Add useEffect after the existing useEffect (around line 84):

```tsx
// Auto-select first career match when switching to career-matches tab
useEffect(() => {
  if (activeTab === "career-matches" && !selectedItem && careerMatches.length > 0) {
    setSelectedItem({ type: "match", data: careerMatches[0] });
  }
}, [activeTab, selectedItem, careerMatches]);
```

**Step 4: Verify the layout works**

Run: `npm run dev`
Navigate to: `/assess?tab=career-matches`
Expected: Master-detail layout with list on left, details on right

**Step 5: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: implement master-detail layout for Career Matches tab

- CurrentRoleCard with region selector at top
- Compact list on left (40%)
- Detail panel with collapsible sections on right (60%)
- Auto-selects first match on tab open

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Update Assess Page - Career Pathways Master-Detail Layout

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Add imports for pathway components**

```tsx
import { PathwayListItem } from "@/components/features/pathway-list-item";
import { PathwayDetail } from "@/components/features/pathway-detail";
```

**Step 2: Replace career-pathways tab content with master-detail layout**

Replace the `{activeTab === "career-pathways" && ...}` block:

```tsx
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
```

**Step 3: Update auto-select useEffect to handle pathways tab**

```tsx
// Auto-select first item when switching tabs
useEffect(() => {
  if (activeTab === "career-matches" && selectedItem?.type !== "match" && careerMatches.length > 0) {
    setSelectedItem({ type: "match", data: careerMatches[0] });
  }
  if (activeTab === "career-pathways" && selectedItem?.type !== "pathway" && pathwaysData.advancementJobs.length > 0) {
    setSelectedItem({ type: "pathway", data: pathwaysData.advancementJobs[0] });
  }
}, [activeTab]);
```

**Step 4: Verify the layout works**

Run: `npm run dev`
Navigate to: `/assess?tab=career-pathways`
Expected: Master-detail layout with grouped list on left, details on right

**Step 5: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: implement master-detail layout for Career Pathways tab

- CurrentRoleCard with region selector at top
- Grouped list (Advancement/Feeder) on left
- Detail panel with skill gaps and market data on right
- Auto-selects first advancement job on tab open

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 13: Clean Up Unused Components and Imports

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Remove unused imports**

Remove these imports that are no longer needed:
- `ComparisonView`
- `CareerMatchCard`
- `PathwayCard`
- `SkillGapPanel`

Keep only what's used:
```tsx
import { ProfileSummaryCard } from "@/components/features/profile-summary-card";
import { MarketDataGrid } from "@/components/features/market-data-grid";
import { CurrentRoleCard } from "@/components/features/current-role-card";
import { CareerMatchListItem } from "@/components/features/career-match-list-item";
import { CareerMatchDetail } from "@/components/features/career-match-detail";
import { PathwayListItem } from "@/components/features/pathway-list-item";
import { PathwayDetail } from "@/components/features/pathway-detail";
```

**Step 2: Verify the app builds and runs**

Run: `npm run build && npm run dev`
Expected: Build succeeds, app runs correctly

**Step 3: Commit**

```bash
git add app/assess/page.tsx
git commit -m "chore: clean up unused imports from assess page

Remove ComparisonView, CareerMatchCard, PathwayCard, SkillGapPanel
imports that are no longer needed after master-detail refactor.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 14: Final Verification and Testing

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors or warnings

**Step 2: Manual testing checklist**

Run: `npm run dev`

Test the following:
- [ ] `/assess` - Analyzing animation works, then shows results
- [ ] Client Profile tab - Shows profile summary
- [ ] Current Role tab - Shows market data grid with new table-based Top Regions
- [ ] Career Matches tab:
  - [ ] CurrentRoleCard at top with region selector
  - [ ] Master-detail layout (list left, detail right)
  - [ ] First match auto-selected
  - [ ] Clicking different matches updates detail panel
  - [ ] Skills & Training section open by default
  - [ ] Market Data section collapsed by default
  - [ ] Region selector dropdown works
- [ ] Career Pathways tab:
  - [ ] Same layout as Career Matches
  - [ ] Advancement and Feeder sections in list
  - [ ] Skill gap bars in detail panel
- [ ] Mobile responsive (resize browser)

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete assess page redesign

Addresses client feedback:
- Removed confusing Comparison tab
- Master-detail layout for Career Matches and Pathways
- Region selector in CurrentRoleCard
- Top Regions as readable table instead of chart
- Removed fake forecast chart

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary of Files Changed

**Created:**
- `components/ui/collapsible-section.tsx`
- `components/features/career-match-detail.tsx`
- `components/features/career-match-list-item.tsx`
- `components/features/pathway-detail.tsx`
- `components/features/pathway-list-item.tsx`

**Modified:**
- `components/features/comparison-view.tsx` (removed fake chart)
- `components/features/regions-card.tsx` (chart → table)
- `components/features/current-role-card.tsx` (added region selector)
- `app/assess/page.tsx` (master-detail layout, removed comparison tab)
