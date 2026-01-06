# Career Shift Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive career shifting web app with job market explorer and career pathways visualization using static sample data.

**Architecture:** Next.js App Router with TypeScript, shadcn/ui components, Recharts for visualizations. Static JSON data extracted from Postman collection. Three pages: Home (CTAs), Explore (job market dashboard), Pathways (career transitions with skill gaps).

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Vercel

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `next.config.js`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

**Step 1: Create Next.js project with TypeScript and Tailwind**

Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm`

Expected: Project scaffolded with App Router structure

**Step 2: Verify project runs**

Run: `npm run dev`
Expected: Dev server starts on http://localhost:3000

**Step 3: Commit initial setup**

```bash
git init
git add .
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind"
```

---

## Task 2: Configure Challenger Gray Brand Colors

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Step 1: Add brand colors to Tailwind config**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#32373c",
        gold: "#cd995c",
        lightgray: "#eaeaea",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 2: Verify Tailwind compiles**

Run: `npm run dev`
Expected: No errors, dev server running

**Step 3: Commit brand config**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: add Challenger Gray brand colors to Tailwind config"
```

---

## Task 3: Install and Configure shadcn/ui

**Files:**
- Create: `components.json`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/select.tsx`
- Create: `components/ui/badge.tsx`

**Step 1: Initialize shadcn/ui**

Run: `npx shadcn@latest init`

Select options:
- Style: Default
- Base color: Slate
- CSS variables: Yes

**Step 2: Install required components**

Run: `npx shadcn@latest add button card select badge`

Expected: Components created in `components/ui/`

**Step 3: Verify components work**

Add a test button to `app/page.tsx`:
```tsx
import { Button } from "@/components/ui/button";
export default function Home() {
  return <Button>Test</Button>;
}
```

Run: `npm run dev`
Expected: Button renders with shadcn styling

**Step 4: Commit shadcn setup**

```bash
git add .
git commit -m "feat: install and configure shadcn/ui with button, card, select, badge"
```

---

## Task 4: Create Static Data Layer

**Files:**
- Create: `lib/data/job-postings.ts`
- Create: `lib/data/career-pathways.ts`
- Create: `lib/data/types.ts`

**Step 1: Create TypeScript types**

```typescript
// lib/data/types.ts
export interface TimeseriesData {
  month: string[];
  values: number[];
}

export interface SalaryTrend {
  timeseries: TimeseriesData;
  total: number;
}

export interface PostingsTrend {
  timeseries: TimeseriesData;
  total: number;
}

export interface RegionRanking {
  name: string;
  unique_postings: number;
}

export interface CompanyRanking {
  name: string;
  unique_postings: number;
  median_salary: number;
}

export interface EducationRanking {
  name: string;
  unique_postings: number;
}

export interface TitleRanking {
  name: string;
  unique_postings: number;
  median_salary: number;
}

export interface JobPostingsData {
  occupation: string;
  salaryTrend: SalaryTrend;
  postingsTrend: PostingsTrend;
  topRegions: RegionRanking[];
  topCompanies: CompanyRanking[];
  educationRequirements: EducationRanking[];
  topTitles: TitleRanking[];
}

export type PathwayCategory = "Advancement" | "LateralTransition" | "Similar" | "LateralAdvancement";

export interface PathwayJob {
  id: string;
  name: string;
  category: PathwayCategory;
  score: number;
  meanSalary: number;
  meanSalaryDiff: number;
  jobLevel: number;
  jobLevelDiff: number;
}

export interface SkillGapItem {
  id: string;
  name: string;
  importanceScore: number;
}

export interface CareerPathwaysData {
  id: string;
  name: string;
  jobLevel: number;
  meanSalary: number;
  feederJobs: PathwayJob[];
  advancementJobs: PathwayJob[];
}

export interface SkillGapData {
  source: { id: string; name: string };
  destination: { id: string; name: string };
  skillGap: SkillGapItem[];
}
```

**Step 2: Create job postings data**

```typescript
// lib/data/job-postings.ts
import type { JobPostingsData } from "./types";

export const customerServiceRepData: JobPostingsData = {
  occupation: "Customer Service Representative (General)",
  salaryTrend: {
    timeseries: {
      month: ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01"],
      values: [40320, 40576, 40064, 40064, 40064, 40320, 40064, 39616, 39616, 39552, 40576, 41600, 41600],
    },
    total: 40896,
  },
  postingsTrend: {
    timeseries: {
      month: ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01"],
      values: [89309, 90160, 92142, 96682, 91065, 89174, 104558, 107696, 102679, 104396, 96014, 89052, 51262],
    },
    total: 529431,
  },
  topRegions: [
    { name: "New York-Newark-Jersey City, NY-NJ", unique_postings: 19920 },
    { name: "Los Angeles-Long Beach-Anaheim, CA", unique_postings: 17546 },
    { name: "Chicago-Naperville-Elgin, IL-IN", unique_postings: 15811 },
    { name: "Dallas-Fort Worth-Arlington, TX", unique_postings: 15426 },
    { name: "Miami-Fort Lauderdale-West Palm Beach, FL", unique_postings: 11430 },
    { name: "Phoenix-Mesa-Chandler, AZ", unique_postings: 9896 },
    { name: "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD", unique_postings: 9363 },
    { name: "Atlanta-Sandy Springs-Roswell, GA", unique_postings: 9208 },
    { name: "Boston-Cambridge-Newton, MA-NH", unique_postings: 9116 },
    { name: "Houston-Pasadena-The Woodlands, TX", unique_postings: 8896 },
  ],
  topCompanies: [
    { name: "Amazon", unique_postings: 5200, median_salary: 42000 },
    { name: "Walmart", unique_postings: 4800, median_salary: 38000 },
    { name: "Target", unique_postings: 3200, median_salary: 39000 },
    { name: "CVS Health", unique_postings: 2900, median_salary: 41000 },
    { name: "Bank of America", unique_postings: 2700, median_salary: 45000 },
  ],
  educationRequirements: [
    { name: "High school diploma or GED", unique_postings: 320000 },
    { name: "Bachelor's degree", unique_postings: 95000 },
    { name: "Associate's degree", unique_postings: 45000 },
    { name: "No education listed", unique_postings: 69431 },
  ],
  topTitles: [
    { name: "Customer Service Representative", unique_postings: 180000, median_salary: 40000 },
    { name: "Customer Support Specialist", unique_postings: 95000, median_salary: 42000 },
    { name: "Call Center Representative", unique_postings: 78000, median_salary: 38000 },
    { name: "Client Services Representative", unique_postings: 62000, median_salary: 44000 },
    { name: "Customer Care Specialist", unique_postings: 55000, median_salary: 41000 },
  ],
};

export function getJobPostingsData(occupation: string): JobPostingsData {
  // For now, return sample data regardless of occupation
  return customerServiceRepData;
}
```

**Step 3: Create career pathways data**

```typescript
// lib/data/career-pathways.ts
import type { CareerPathwaysData, SkillGapData } from "./types";

export const dataScientistPathways: CareerPathwaysData = {
  id: "23111410",
  name: "Data Scientist",
  jobLevel: 6,
  meanSalary: 148325,
  feederJobs: [
    { id: "23111310", name: "Data Analyst", category: "Advancement", score: 0.88105, meanSalary: 105105, meanSalaryDiff: -43220, jobLevel: 5, jobLevelDiff: -1 },
    { id: "33131216", name: "Research Scientist", category: "LateralTransition", score: 0.8763, meanSalary: 136266, meanSalaryDiff: -12059, jobLevel: 6, jobLevelDiff: 0 },
    { id: "23111810", name: "Data Analytics Manager", category: "Similar", score: 0.86919, meanSalary: 152868, meanSalaryDiff: 4543, jobLevel: 5, jobLevelDiff: -1 },
    { id: "27111310", name: "Analytics Product Manager", category: "LateralTransition", score: 0.86318, meanSalary: 153957, meanSalaryDiff: 5632, jobLevel: 6, jobLevelDiff: 0 },
    { id: "23111710", name: "Statistician", category: "Advancement", score: 0.8446, meanSalary: 105360, meanSalaryDiff: -42965, jobLevel: 6, jobLevelDiff: 0 },
    { id: "27121317", name: "Marketing Analytics Specialist", category: "LateralAdvancement", score: 0.84095, meanSalary: 118613, meanSalaryDiff: -29712, jobLevel: 4, jobLevelDiff: -2 },
    { id: "23101010", name: "Business Intelligence Analyst", category: "LateralAdvancement", score: 0.8216, meanSalary: 109479, meanSalaryDiff: -38846, jobLevel: 5, jobLevelDiff: -1 },
    { id: "23121010", name: "Data Engineer", category: "LateralTransition", score: 0.81858, meanSalary: 139803, meanSalaryDiff: -8522, jobLevel: 5, jobLevelDiff: -1 },
  ],
  advancementJobs: [
    { id: "23111811", name: "Data Science Manager", category: "Advancement", score: 0.97742, meanSalary: 196360, meanSalaryDiff: 48035, jobLevel: 5, jobLevelDiff: -1 },
    { id: "23112014", name: "Natural Language Processing Engineer", category: "Advancement", score: 0.92347, meanSalary: 170511, meanSalaryDiff: 22186, jobLevel: 6, jobLevelDiff: 0 },
    { id: "23112013", name: "Machine Learning Engineer", category: "Advancement", score: 0.91001, meanSalary: 187441, meanSalaryDiff: 39116, jobLevel: 5, jobLevelDiff: -1 },
    { id: "23112012", name: "Generative Artificial Intelligence Engineer", category: "Advancement", score: 0.90266, meanSalary: 181086, meanSalaryDiff: 32761, jobLevel: 6, jobLevelDiff: 0 },
    { id: "23112010", name: "Artificial Intelligence Engineer (General)", category: "Advancement", score: 0.8868, meanSalary: 178218, meanSalaryDiff: 29893, jobLevel: 5, jobLevelDiff: -1 },
    { id: "33131216", name: "Research Scientist", category: "LateralTransition", score: 0.8763, meanSalary: 136266, meanSalaryDiff: -12059, jobLevel: 6, jobLevelDiff: 0 },
    { id: "23111810", name: "Data Analytics Manager", category: "Similar", score: 0.86919, meanSalary: 152868, meanSalaryDiff: 4543, jobLevel: 5, jobLevelDiff: -1 },
    { id: "23112011", name: "Deep Learning Engineer", category: "Advancement", score: 0.86408, meanSalary: 185658, meanSalaryDiff: 37333, jobLevel: 6, jobLevelDiff: 0 },
  ],
};

export const sampleSkillGap: SkillGapData = {
  source: { id: "23111310", name: "Data Analyst" },
  destination: { id: "23112014", name: "Natural Language Processing Engineer" },
  skillGap: [
    { id: "ES2DCA677488DDF61152", name: "Large Language Modeling", importanceScore: 4.95 },
    { id: "ES621714B943488C07C8", name: "Generative Artificial Intelligence", importanceScore: 4.68 },
    { id: "KS1261Z68KSKR1X31KS3", name: "Machine Learning", importanceScore: 4.39 },
    { id: "KS120BV6SR75RBKQH0G3", name: "Artificial Intelligence", importanceScore: 4.27 },
    { id: "KSBZ9LW988KC56I219SP", name: "Deep Learning", importanceScore: 4.23 },
    { id: "KS1271Z6JS5110PHSPC6", name: "Natural Language Processing (NLP)", importanceScore: 4.16 },
    { id: "KSWXHT30GQY9B4QSXC5O", name: "PyTorch (Machine Learning Library)", importanceScore: 4.05 },
    { id: "KS2GHRCYA6TRT29F1HOO", name: "TensorFlow", importanceScore: 3.97 },
    { id: "KS120D96FHL88PZDKZKH", name: "Algorithms", importanceScore: 3.42 },
    { id: "KS440QS66YCBN23Y8K25", name: "Software Engineering", importanceScore: 2.92 },
  ],
};

export function getCareerPathwaysData(occupationId: string): CareerPathwaysData {
  // For now, return sample data regardless of occupation
  return dataScientistPathways;
}

export function getSkillGapData(sourceId: string, destinationId: string): SkillGapData {
  // For now, return sample data
  return sampleSkillGap;
}
```

**Step 4: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 5: Commit data layer**

```bash
git add lib/data/
git commit -m "feat: add static data layer with types for job postings and career pathways"
```

---

## Task 5: Create Shared Layout with Navigation

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/navigation.tsx`
- Create: `components/footer.tsx`

**Step 1: Create navigation component**

```tsx
// components/navigation.tsx
import Link from "next/link";

export function Navigation() {
  return (
    <header className="border-b border-lightgray bg-white">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-charcoal">
          Career Shift
        </Link>
        <div className="flex gap-6">
          <Link href="/explore" className="text-charcoal hover:text-gold transition-colors">
            Job Explorer
          </Link>
          <Link href="/pathways" className="text-charcoal hover:text-gold transition-colors">
            Career Pathways
          </Link>
        </div>
      </nav>
    </header>
  );
}
```

**Step 2: Create footer component**

```tsx
// components/footer.tsx
export function Footer() {
  return (
    <footer className="border-t border-lightgray bg-white py-8">
      <div className="container mx-auto px-4 text-center text-sm text-charcoal">
        <p>Powered by Lightcast data. Demo for Challenger, Gray & Christmas.</p>
      </div>
    </footer>
  );
}
```

**Step 3: Update layout with navigation and footer**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Career Shift - Challenger, Gray & Christmas",
  description: "Explore job market trends and plan career transitions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col bg-white`}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Step 4: Verify layout renders**

Run: `npm run dev`
Expected: Navigation and footer visible on all pages

**Step 5: Commit layout**

```bash
git add app/layout.tsx components/navigation.tsx components/footer.tsx
git commit -m "feat: add shared navigation and footer layout"
```

---

## Task 6: Build Home Page with CTA Cards

**Files:**
- Modify: `app/page.tsx`

**Step 1: Create home page with CTAs**

```tsx
// app/page.tsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-charcoal">
          Navigate Your Career Journey
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore job market trends and discover career transition opportunities with data-driven insights.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-gold hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-charcoal">Explore Job Market</CardTitle>
            <CardDescription>
              Analyze salary trends, top employers, and regional job postings for any occupation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/explore">
              <Button className="w-full bg-charcoal hover:bg-charcoal/90">
                Start Exploring
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gold hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-charcoal">Plan Career Transition</CardTitle>
            <CardDescription>
              Discover career pathways, advancement opportunities, and skills gaps for your next role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pathways">
              <Button className="w-full bg-charcoal hover:bg-charcoal/90">
                View Pathways
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**Step 2: Verify home page renders**

Run: `npm run dev`
Expected: Home page with two CTA cards visible

**Step 3: Commit home page**

```bash
git add app/page.tsx
git commit -m "feat: add home page with CTA cards for explore and pathways"
```

---

## Task 7: Install Recharts and Create Chart Components

**Files:**
- Create: `components/charts/line-chart.tsx`
- Create: `components/charts/bar-chart.tsx`
- Create: `components/charts/donut-chart.tsx`

**Step 1: Install Recharts**

Run: `npm install recharts`

**Step 2: Create line chart component**

```tsx
// components/charts/line-chart.tsx
"use client";

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LineChartProps {
  data: { month: string; value: number }[];
  valueFormatter?: (value: number) => string;
  color?: string;
}

export function LineChart({ data, valueFormatter = (v) => v.toString(), color = "#cd995c" }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "#32373c" }}
          tickFormatter={(value) => value.slice(5)} // Show only MM
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#32373c" }}
          tickFormatter={valueFormatter}
          width={60}
        />
        <Tooltip
          formatter={(value: number) => [valueFormatter(value), "Value"]}
          contentStyle={{ borderColor: "#eaeaea" }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 0, r: 3 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
```

**Step 3: Create horizontal bar chart component**

```tsx
// components/charts/bar-chart.tsx
"use client";

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartProps {
  data: { name: string; value: number }[];
  valueFormatter?: (value: number) => string;
  color?: string;
}

export function HorizontalBarChart({ data, valueFormatter = (v) => v.toLocaleString(), color = "#cd995c" }: BarChartProps) {
  // Truncate long names
  const chartData = data.map(item => ({
    ...item,
    shortName: item.name.length > 25 ? item.name.slice(0, 22) + "..." : item.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 100, bottom: 5 }}>
        <XAxis type="number" tick={{ fontSize: 10, fill: "#32373c" }} tickFormatter={valueFormatter} />
        <YAxis
          type="category"
          dataKey="shortName"
          tick={{ fontSize: 10, fill: "#32373c" }}
          width={95}
        />
        <Tooltip
          formatter={(value: number) => [valueFormatter(value), "Postings"]}
          labelFormatter={(label) => data.find(d => d.name.startsWith(label.replace("...", "")))?.name || label}
          contentStyle={{ borderColor: "#eaeaea" }}
        />
        <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
```

**Step 4: Create donut chart component**

```tsx
// components/charts/donut-chart.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#cd995c", "#32373c", "#6b7280", "#9ca3af"];

export function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`${((value / total) * 100).toFixed(1)}%`, "Share"]}
          contentStyle={{ borderColor: "#eaeaea" }}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          formatter={(value) => value.length > 20 ? value.slice(0, 17) + "..." : value}
          wrapperStyle={{ fontSize: 10 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

**Step 5: Verify charts render**

Create a test in `app/page.tsx` temporarily to verify charts work.

Run: `npm run dev`
Expected: Charts render without errors

**Step 6: Commit chart components**

```bash
git add components/charts/ package.json package-lock.json
git commit -m "feat: add Recharts line, bar, and donut chart components"
```

---

## Task 8: Build Job Explorer Page

**Files:**
- Create: `app/explore/page.tsx`
- Create: `components/features/salary-trend-card.tsx`
- Create: `components/features/postings-trend-card.tsx`
- Create: `components/features/regions-card.tsx`
- Create: `components/features/companies-card.tsx`
- Create: `components/features/education-card.tsx`
- Create: `components/features/titles-card.tsx`

**Step 1: Create salary trend card**

```tsx
// components/features/salary-trend-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/line-chart";
import type { SalaryTrend } from "@/lib/data/types";

interface SalaryTrendCardProps {
  data: SalaryTrend;
}

export function SalaryTrendCard({ data }: SalaryTrendCardProps) {
  const chartData = data.timeseries.month.map((month, i) => ({
    month,
    value: data.timeseries.values[i],
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

**Step 2: Create postings trend card**

```tsx
// components/features/postings-trend-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/line-chart";
import type { PostingsTrend } from "@/lib/data/types";

interface PostingsTrendCardProps {
  data: PostingsTrend;
}

export function PostingsTrendCard({ data }: PostingsTrendCardProps) {
  const chartData = data.timeseries.month.map((month, i) => ({
    month,
    value: data.timeseries.values[i],
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

**Step 3: Create regions card**

```tsx
// components/features/regions-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HorizontalBarChart } from "@/components/charts/bar-chart";
import type { RegionRanking } from "@/lib/data/types";

interface RegionsCardProps {
  data: RegionRanking[];
}

export function RegionsCard({ data }: RegionsCardProps) {
  const chartData = data.slice(0, 10).map(item => ({
    name: item.name,
    value: item.unique_postings,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Regions</CardTitle>
        <p className="text-xs text-gray-500">By unique job postings</p>
      </CardHeader>
      <CardContent>
        <HorizontalBarChart data={chartData} />
      </CardContent>
    </Card>
  );
}
```

**Step 4: Create companies table card**

```tsx
// components/features/companies-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyRanking } from "@/lib/data/types";

interface CompaniesCardProps {
  data: CompanyRanking[];
}

export function CompaniesCard({ data }: CompaniesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Companies</CardTitle>
        <p className="text-xs text-gray-500">Hiring for this role</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-3 text-xs font-medium text-gray-500 border-b pb-2">
            <span>Company</span>
            <span className="text-right">Postings</span>
            <span className="text-right">Med. Salary</span>
          </div>
          {data.slice(0, 5).map((company) => (
            <div key={company.name} className="grid grid-cols-3 text-sm">
              <span className="text-charcoal truncate">{company.name}</span>
              <span className="text-right text-gray-600">{company.unique_postings.toLocaleString()}</span>
              <span className="text-right text-gold">${(company.median_salary / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 5: Create education donut card**

```tsx
// components/features/education-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart } from "@/components/charts/donut-chart";
import type { EducationRanking } from "@/lib/data/types";

interface EducationCardProps {
  data: EducationRanking[];
}

export function EducationCard({ data }: EducationCardProps) {
  const chartData = data.map(item => ({
    name: item.name,
    value: item.unique_postings,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Education Requirements</CardTitle>
        <p className="text-xs text-gray-500">Distribution by degree level</p>
      </CardHeader>
      <CardContent>
        <DonutChart data={chartData} />
      </CardContent>
    </Card>
  );
}
```

**Step 6: Create titles table card**

```tsx
// components/features/titles-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TitleRanking } from "@/lib/data/types";

interface TitlesCardProps {
  data: TitleRanking[];
}

export function TitlesCard({ data }: TitlesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-charcoal">Top Job Titles</CardTitle>
        <p className="text-xs text-gray-500">Common titles for this occupation</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-3 text-xs font-medium text-gray-500 border-b pb-2">
            <span>Title</span>
            <span className="text-right">Postings</span>
            <span className="text-right">Med. Salary</span>
          </div>
          {data.slice(0, 5).map((title) => (
            <div key={title.name} className="grid grid-cols-3 text-sm">
              <span className="text-charcoal truncate">{title.name}</span>
              <span className="text-right text-gray-600">{title.unique_postings.toLocaleString()}</span>
              <span className="text-right text-gold">${(title.median_salary / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 7: Create explore page**

```tsx
// app/explore/page.tsx
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
```

**Step 8: Verify explore page renders**

Run: `npm run dev`
Navigate to: http://localhost:3000/explore
Expected: 6-card dashboard with charts and tables

**Step 9: Commit explore page**

```bash
git add app/explore/ components/features/
git commit -m "feat: add job explorer page with 6-card dashboard"
```

---

## Task 9: Build Career Pathways Page

**Files:**
- Create: `app/pathways/page.tsx`
- Create: `components/features/pathway-card.tsx`
- Create: `components/features/skill-gap-panel.tsx`
- Create: `components/features/current-role-card.tsx`

**Step 1: Create pathway card component**

```tsx
// components/features/pathway-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PathwayJob, PathwayCategory } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface PathwayCardProps {
  job: PathwayJob;
  onClick: () => void;
  isSelected: boolean;
}

const categoryColors: Record<PathwayCategory, string> = {
  Advancement: "bg-green-100 text-green-800 border-green-200",
  LateralTransition: "bg-blue-100 text-blue-800 border-blue-200",
  Similar: "bg-gray-100 text-gray-800 border-gray-200",
  LateralAdvancement: "bg-amber-100 text-amber-800 border-amber-200",
};

const categoryLabels: Record<PathwayCategory, string> = {
  Advancement: "Advancement",
  LateralTransition: "Lateral",
  Similar: "Similar",
  LateralAdvancement: "Lateral Adv.",
};

export function PathwayCard({ job, onClick, isSelected }: PathwayCardProps) {
  const salaryDiff = job.meanSalaryDiff;
  const salaryDiffFormatted = salaryDiff >= 0
    ? `+$${(salaryDiff / 1000).toFixed(0)}k`
    : `-$${(Math.abs(salaryDiff) / 1000).toFixed(0)}k`;

  const levelDiff = job.jobLevelDiff;
  const levelDiffText = levelDiff > 0
    ? `+${levelDiff} level${levelDiff > 1 ? "s" : ""}`
    : levelDiff < 0
    ? `${levelDiff} level${Math.abs(levelDiff) > 1 ? "s" : ""}`
    : "Same level";

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-gold"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium text-charcoal">
            {job.name}
          </CardTitle>
          <Badge variant="outline" className={cn("text-xs", categoryColors[job.category])}>
            {categoryLabels[job.category]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {(job.score * 100).toFixed(0)}% match
          </span>
          <span className={cn(
            "font-medium",
            salaryDiff >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {salaryDiffFormatted}
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {levelDiffText} | ${(job.meanSalary / 1000).toFixed(0)}k avg
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Create skill gap panel**

```tsx
// components/features/skill-gap-panel.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SkillGapData } from "@/lib/data/types";

interface SkillGapPanelProps {
  data: SkillGapData;
}

export function SkillGapPanel({ data }: SkillGapPanelProps) {
  const maxScore = Math.max(...data.skillGap.map(s => s.importanceScore));

  return (
    <Card className="border-l-4 border-l-gold">
      <CardHeader>
        <CardTitle className="text-lg text-charcoal">
          Skills to Acquire
        </CardTitle>
        <p className="text-sm text-gray-500">
          {data.source.name} → {data.destination.name}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.skillGap.map((skill) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 3: Create current role card**

```tsx
// components/features/current-role-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CareerPathwaysData } from "@/lib/data/types";

interface CurrentRoleCardProps {
  data: CareerPathwaysData;
}

export function CurrentRoleCard({ data }: CurrentRoleCardProps) {
  return (
    <Card className="border-l-4 border-l-charcoal">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">Current Role</CardTitle>
        <p className="text-xl font-bold text-charcoal">{data.name}</p>
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

**Step 4: Create pathways page**

```tsx
// app/pathways/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCareerPathwaysData, getSkillGapData } from "@/lib/data/career-pathways";
import { CurrentRoleCard } from "@/components/features/current-role-card";
import { PathwayCard } from "@/components/features/pathway-card";
import { SkillGapPanel } from "@/components/features/skill-gap-panel";
import type { PathwayJob } from "@/lib/data/types";

export default function PathwaysPage() {
  const data = getCareerPathwaysData("23111410"); // Data Scientist
  const [selectedJob, setSelectedJob] = useState<PathwayJob | null>(null);

  const skillGapData = selectedJob
    ? getSkillGapData(data.id, selectedJob.id)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Career Pathways</h1>
        <p className="mt-2 text-gray-600">
          Explore where you could go next and see what skills you need to get there.
        </p>
      </div>

      <div className="mb-8">
        <CurrentRoleCard data={data} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-charcoal">
                Where You Could Go
              </h2>
              <div className="space-y-3">
                {data.advancementJobs.slice(0, 6).map((job) => (
                  <PathwayCard
                    key={job.id}
                    job={job}
                    onClick={() => setSelectedJob(job)}
                    isSelected={selectedJob?.id === job.id}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-charcoal">
                Where People Come From
              </h2>
              <div className="space-y-3">
                {data.feederJobs.slice(0, 6).map((job) => (
                  <PathwayCard
                    key={job.id}
                    job={job}
                    onClick={() => setSelectedJob(job)}
                    isSelected={selectedJob?.id === job.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          {skillGapData ? (
            <>
              <SkillGapPanel data={skillGapData} />
              <div className="mt-4">
                <Link href="/explore">
                  <Button variant="outline" className="w-full border-charcoal text-charcoal hover:bg-charcoal hover:text-white">
                    Explore {selectedJob?.name} in Job Market
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
              <p>Click on a role to see skill gaps</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 5: Verify pathways page renders**

Run: `npm run dev`
Navigate to: http://localhost:3000/pathways
Expected: Two-column layout with pathway cards and skill gap panel

**Step 6: Commit pathways page**

```bash
git add app/pathways/ components/features/pathway-card.tsx components/features/skill-gap-panel.tsx components/features/current-role-card.tsx
git commit -m "feat: add career pathways page with skill gap visualization"
```

---

## Task 10: Add Occupation Dropdown Selector

**Files:**
- Create: `components/features/occupation-select.tsx`
- Modify: `app/explore/page.tsx`
- Modify: `app/pathways/page.tsx`

**Step 1: Create occupation select component**

```tsx
// components/features/occupation-select.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OccupationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  occupations: { id: string; name: string }[];
}

export function OccupationSelect({ value, onValueChange, occupations }: OccupationSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[320px]">
        <SelectValue placeholder="Select an occupation" />
      </SelectTrigger>
      <SelectContent>
        {occupations.map((occ) => (
          <SelectItem key={occ.id} value={occ.id}>
            {occ.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**Step 2: Create available occupations data**

```typescript
// lib/data/occupations.ts
export const availableOccupations = [
  { id: "customer-service-rep", name: "Customer Service Representative (General)" },
  { id: "data-scientist", name: "Data Scientist" },
  { id: "software-engineer", name: "Software Developer / Engineer" },
  { id: "project-manager", name: "Project Manager" },
  { id: "marketing-manager", name: "Marketing Manager" },
];
```

**Step 3: Update explore page to use client-side state**

```tsx
// app/explore/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getJobPostingsData } from "@/lib/data/job-postings";
import { availableOccupations } from "@/lib/data/occupations";
import { OccupationSelect } from "@/components/features/occupation-select";
import { SalaryTrendCard } from "@/components/features/salary-trend-card";
import { PostingsTrendCard } from "@/components/features/postings-trend-card";
import { RegionsCard } from "@/components/features/regions-card";
import { CompaniesCard } from "@/components/features/companies-card";
import { EducationCard } from "@/components/features/education-card";
import { TitlesCard } from "@/components/features/titles-card";

export default function ExplorePage() {
  const [selectedOccupation, setSelectedOccupation] = useState("customer-service-rep");
  const occupation = availableOccupations.find(o => o.id === selectedOccupation);
  const data = getJobPostingsData(occupation?.name || "");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Job Market Explorer</h1>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <OccupationSelect
              value={selectedOccupation}
              onValueChange={setSelectedOccupation}
              occupations={availableOccupations}
            />
            <span className="text-sm text-gray-500">
              {data.postingsTrend.total.toLocaleString()} postings
            </span>
          </div>
          <Link href={`/pathways?occupation=${selectedOccupation}`}>
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
```

**Step 4: Verify dropdown works**

Run: `npm run dev`
Navigate to: http://localhost:3000/explore
Expected: Dropdown changes occupation (data same for prototype)

**Step 5: Commit occupation selector**

```bash
git add components/features/occupation-select.tsx lib/data/occupations.ts app/explore/page.tsx app/pathways/page.tsx
git commit -m "feat: add occupation dropdown selector to explore and pathways pages"
```

---

## Task 11: Final Styling and Responsive Polish

**Files:**
- Modify: `app/globals.css`
- Modify: various component files for responsive tweaks

**Step 1: Add responsive utilities**

Review all pages on mobile viewport (375px) and tablet (768px).

Run: `npm run dev`
Test in browser with dev tools responsive mode.

**Step 2: Fix any layout issues**

Ensure:
- Cards stack on mobile
- Navigation collapses appropriately
- Charts resize correctly
- Text is readable at all sizes

**Step 3: Commit responsive fixes**

```bash
git add .
git commit -m "style: responsive polish for mobile and tablet viewports"
```

---

## Task 12: Build and Deploy Verification

**Files:**
- None (verification only)

**Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Run production preview**

Run: `npm run start`
Navigate to: http://localhost:3000
Expected: All pages render correctly

**Step 3: Verify all navigation works**

- Home → Explore
- Home → Pathways
- Explore → Pathways
- Pathways → Explore
- Navigation links
- Footer visible

**Step 4: Create final commit**

```bash
git add .
git commit -m "chore: verify production build passes"
```

---

## Summary

This plan covers:
1. Project initialization with Next.js, TypeScript, Tailwind
2. Brand color configuration
3. shadcn/ui component setup
4. Static data layer with types
5. Shared layout with navigation
6. Home page with CTAs
7. Recharts visualization components
8. Job Explorer dashboard (6 cards)
9. Career Pathways page with skill gaps
10. Occupation dropdown selector
11. Responsive styling
12. Build verification

Each task follows TDD principles where applicable and includes explicit commits for traceability.
