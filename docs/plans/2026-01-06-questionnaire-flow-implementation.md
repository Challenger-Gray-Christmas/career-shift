# Questionnaire Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a career assessment demo at `/assess` showing how questionnaire data leads to personalized career transition recommendations.

**Architecture:** New `/assess` route with wizard reveal animation landing on tabbed results. All data is hardcoded. Reuses existing outlook card components.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Recharts, Lucide React icons

---

## Task 1: Add Types for Assessment Data

**Files:**
- Modify: `lib/data/types.ts`

**Step 1: Add new types at the end of the file**

Add after line 104:

```typescript
// Assessment/Questionnaire types
export interface WorkExperience {
  company: string;
  jobTitle: string;
  location: string;
  startYear: string;
  endYear: string;
  responsibilities: string;
}

export interface Education {
  school: string;
  degree: string;
  location: string;
  endYear: string;
  major?: string;
}

export interface QuestionnaireProfile {
  name: string;
  currentRole: string;
  location: string;
  email: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
}

export interface CourseraCourse {
  title: string;
  provider: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  url: string;
}

export interface SkillGapWithCourse {
  skill: string;
  course: CourseraCourse;
}

export interface CareerMatch {
  id: string;
  title: string;
  matchPercent: number;
  outlookPercent: number;
  salaryRange: { min: number; max: number };
  rationale: string;
  transferableSkills: string[];
  skillsGap: SkillGapWithCourse[];
}
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add lib/data/types.ts
git commit -m "feat(assess): add types for questionnaire and career matches"
```

---

## Task 2: Create Hardcoded Questionnaire Profile Data

**Files:**
- Create: `lib/data/questionnaire-data.ts`

**Step 1: Create the questionnaire data file**

```typescript
import type { QuestionnaireProfile } from "./types";

// Hardcoded Customer Service Representative profile for demo
export const demoProfile: QuestionnaireProfile = {
  name: "Sarah Mitchell",
  currentRole: "Customer Service Representative",
  location: "Phoenix, AZ",
  email: "sarah.mitchell@example.com",
  skills: [
    "Customer Communication",
    "Problem Resolution",
    "CRM Software (Zendesk)",
    "Conflict De-escalation",
    "Active Listening",
    "Data Entry",
    "Multi-tasking",
    "Phone Etiquette",
    "Email Support",
    "Team Collaboration",
    "Time Management",
    "Product Knowledge",
  ],
  experience: [
    {
      company: "TechSupport Plus",
      jobTitle: "Senior Customer Service Representative",
      location: "Phoenix, AZ",
      startYear: "2021",
      endYear: "Present",
      responsibilities: "Handle escalated customer issues, mentor new team members, process refunds and returns, maintain 95%+ satisfaction rating.",
    },
    {
      company: "RetailCo",
      jobTitle: "Customer Service Representative",
      location: "Phoenix, AZ",
      startYear: "2018",
      endYear: "2021",
      responsibilities: "Answered 50+ calls daily, resolved billing inquiries, processed orders, maintained detailed records in CRM.",
    },
    {
      company: "QuickMart",
      jobTitle: "Cashier / Customer Service",
      location: "Tucson, AZ",
      startYear: "2016",
      endYear: "2018",
      responsibilities: "Processed transactions, handled customer complaints, managed returns desk.",
    },
  ],
  education: [
    {
      school: "Phoenix Community College",
      degree: "Associate of Arts in Business",
      location: "Phoenix, AZ",
      endYear: "2016",
    },
  ],
  certifications: [
    "Zendesk Support Administrator Certification",
    "Customer Service Excellence (ICMI)",
  ],
};

export function getQuestionnaireProfile(): QuestionnaireProfile {
  return demoProfile;
}
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add lib/data/questionnaire-data.ts
git commit -m "feat(assess): add hardcoded customer service rep profile"
```

---

## Task 3: Create Career Matches Data

**Files:**
- Create: `lib/data/career-matches.ts`

**Step 1: Create the career matches data file**

```typescript
import type { CareerMatch } from "./types";

export const careerMatches: CareerMatch[] = [
  {
    id: "sales-rep",
    title: "Sales Representative",
    matchPercent: 74,
    outlookPercent: 12,
    salaryRange: { min: 45000, max: 65000 },
    rationale: "Your communication and problem-solving skills transfer directly. Customer service reps often move into sales roles where relationship-building is key.",
    transferableSkills: [
      "Customer Communication",
      "Problem Resolution",
      "CRM Software",
      "Active Listening",
      "Product Knowledge",
      "Time Management",
    ],
    skillsGap: [
      {
        skill: "Sales Techniques",
        course: {
          title: "Sales Training: Techniques for a Human-Centric Sales Process",
          provider: "HubSpot Academy",
          duration: "4 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/sales-training-techniques-customers",
        },
      },
      {
        skill: "Negotiation",
        course: {
          title: "Successful Negotiation: Essential Strategies and Skills",
          provider: "University of Michigan",
          duration: "7 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/negotiation-skills",
        },
      },
      {
        skill: "Lead Generation",
        course: {
          title: "Sales Prospecting and Lead Generation",
          provider: "LinkedIn Learning",
          duration: "3 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/lead-generation",
        },
      },
    ],
  },
  {
    id: "admin-assistant",
    title: "Administrative Assistant",
    matchPercent: 71,
    outlookPercent: -5,
    salaryRange: { min: 38000, max: 52000 },
    rationale: "Your organizational skills and attention to detail from handling customer records translate well to administrative roles.",
    transferableSkills: [
      "Data Entry",
      "Multi-tasking",
      "Email Support",
      "Time Management",
      "Team Collaboration",
      "CRM Software",
    ],
    skillsGap: [
      {
        skill: "Calendar Management",
        course: {
          title: "Administrative Professional Tips",
          provider: "LinkedIn Learning",
          duration: "2 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/admin-professional",
        },
      },
      {
        skill: "Microsoft Office Suite",
        course: {
          title: "Microsoft Office Specialist Certification",
          provider: "Microsoft",
          duration: "6 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/microsoft-office",
        },
      },
    ],
  },
  {
    id: "hr-coordinator",
    title: "HR Coordinator",
    matchPercent: 68,
    outlookPercent: 8,
    salaryRange: { min: 45000, max: 58000 },
    rationale: "Your experience handling sensitive customer situations and conflict resolution applies directly to employee relations.",
    transferableSkills: [
      "Conflict De-escalation",
      "Active Listening",
      "Problem Resolution",
      "Team Collaboration",
      "Data Entry",
      "Email Support",
    ],
    skillsGap: [
      {
        skill: "HR Fundamentals",
        course: {
          title: "Human Resource Management: HR for People Managers",
          provider: "University of Minnesota",
          duration: "5 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/human-resources-management",
        },
      },
      {
        skill: "Employment Law Basics",
        course: {
          title: "Employment Law for Business",
          provider: "University of Colorado",
          duration: "4 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/employment-law",
        },
      },
      {
        skill: "HRIS Systems",
        course: {
          title: "HR Analytics Using Python",
          provider: "HRCI",
          duration: "3 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/hr-analytics",
        },
      },
    ],
  },
  {
    id: "account-manager",
    title: "Account Manager",
    matchPercent: 65,
    outlookPercent: 15,
    salaryRange: { min: 55000, max: 80000 },
    rationale: "Your customer relationship experience is the foundation of account management. This role focuses on maintaining and growing client relationships.",
    transferableSkills: [
      "Customer Communication",
      "Problem Resolution",
      "CRM Software",
      "Active Listening",
      "Product Knowledge",
    ],
    skillsGap: [
      {
        skill: "Account Strategy",
        course: {
          title: "Strategic Account Management",
          provider: "LinkedIn Learning",
          duration: "4 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/account-management",
        },
      },
      {
        skill: "Business Development",
        course: {
          title: "Business Development & B2B Sales",
          provider: "HubSpot Academy",
          duration: "5 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/business-development",
        },
      },
      {
        skill: "Financial Acumen",
        course: {
          title: "Finance for Non-Finance Professionals",
          provider: "Rice University",
          duration: "4 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/finance-for-non-finance",
        },
      },
    ],
  },
  {
    id: "insurance-agent",
    title: "Insurance Agent",
    matchPercent: 62,
    outlookPercent: 6,
    salaryRange: { min: 40000, max: 70000 },
    rationale: "Your ability to explain complex information simply and build trust with customers is essential for selling insurance products.",
    transferableSkills: [
      "Customer Communication",
      "Active Listening",
      "Problem Resolution",
      "Product Knowledge",
      "Phone Etiquette",
    ],
    skillsGap: [
      {
        skill: "Insurance Fundamentals",
        course: {
          title: "Introduction to Insurance",
          provider: "Insurance Institute",
          duration: "6 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/insurance-fundamentals",
        },
      },
      {
        skill: "State Licensing",
        course: {
          title: "Insurance License Exam Prep",
          provider: "Kaplan",
          duration: "8 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/insurance-license",
        },
      },
    ],
  },
  {
    id: "retail-manager",
    title: "Retail Manager",
    matchPercent: 60,
    outlookPercent: 3,
    salaryRange: { min: 42000, max: 62000 },
    rationale: "Your customer service experience combined with team collaboration prepares you for managing a retail team and store operations.",
    transferableSkills: [
      "Customer Communication",
      "Team Collaboration",
      "Problem Resolution",
      "Multi-tasking",
      "Time Management",
    ],
    skillsGap: [
      {
        skill: "People Management",
        course: {
          title: "Management Fundamentals",
          provider: "University of California, Irvine",
          duration: "4 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/management-fundamentals",
        },
      },
      {
        skill: "Inventory Management",
        course: {
          title: "Supply Chain and Inventory Management",
          provider: "Rutgers University",
          duration: "4 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/inventory-management",
        },
      },
      {
        skill: "P&L Basics",
        course: {
          title: "Financial Statements for Managers",
          provider: "Wharton",
          duration: "3 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/financial-statements",
        },
      },
    ],
  },
  {
    id: "bank-teller",
    title: "Bank Teller",
    matchPercent: 58,
    outlookPercent: -12,
    salaryRange: { min: 32000, max: 42000 },
    rationale: "Your cash handling experience and customer service skills align well, though this field has declining job growth.",
    transferableSkills: [
      "Customer Communication",
      "Data Entry",
      "Multi-tasking",
      "Problem Resolution",
      "Active Listening",
    ],
    skillsGap: [
      {
        skill: "Banking Regulations",
        course: {
          title: "Banking Fundamentals",
          provider: "American Bankers Association",
          duration: "4 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/banking-fundamentals",
        },
      },
      {
        skill: "Financial Products",
        course: {
          title: "Personal & Family Financial Planning",
          provider: "University of Florida",
          duration: "5 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/financial-planning",
        },
      },
    ],
  },
  {
    id: "receptionist",
    title: "Receptionist",
    matchPercent: 55,
    outlookPercent: -9,
    salaryRange: { min: 30000, max: 40000 },
    rationale: "Your phone skills and professional communication transfer directly, but this role has fewer growth opportunities.",
    transferableSkills: [
      "Phone Etiquette",
      "Customer Communication",
      "Multi-tasking",
      "Email Support",
      "Data Entry",
    ],
    skillsGap: [
      {
        skill: "Office Administration",
        course: {
          title: "Office Administration Fundamentals",
          provider: "LinkedIn Learning",
          duration: "2 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/office-administration",
        },
      },
    ],
  },
];

export function getCareerMatches(): CareerMatch[] {
  return careerMatches;
}

export function getCareerMatchById(id: string): CareerMatch | undefined {
  return careerMatches.find((match) => match.id === id);
}
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add lib/data/career-matches.ts
git commit -m "feat(assess): add hardcoded career matches with skills and courses"
```

---

## Task 4: Create Profile Summary Card Component

**Files:**
- Create: `components/features/profile-summary-card.tsx`

**Step 1: Create the profile summary card**

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Award, MapPin, Mail } from "lucide-react";
import type { QuestionnaireProfile } from "@/lib/data/types";

interface ProfileSummaryCardProps {
  profile: QuestionnaireProfile;
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-l-4 border-l-gold">
        <CardHeader>
          <CardTitle className="text-2xl text-charcoal">{profile.name}</CardTitle>
          <p className="text-lg text-gold font-medium">{profile.currentRole}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {profile.email}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-charcoal">Key Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-gray-100 text-charcoal">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-charcoal flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <p className="font-medium text-charcoal">{exp.jobTitle}</p>
                <p className="text-sm text-gold">{exp.company}</p>
                <p className="text-xs text-gray-500">
                  {exp.location} | {exp.startYear} - {exp.endYear}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Education & Certifications */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-charcoal flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.education.map((edu, index) => (
              <div key={index}>
                <p className="font-medium text-charcoal">{edu.degree}</p>
                <p className="text-sm text-gray-500">{edu.school}, {edu.endYear}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-charcoal flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {profile.certifications.map((cert, index) => (
                <li key={index} className="text-sm text-gray-600">{cert}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add components/features/profile-summary-card.tsx
git commit -m "feat(assess): add profile summary card component"
```

---

## Task 5: Create Career Match Card Component

**Files:**
- Create: `components/features/career-match-card.tsx`

**Step 1: Create the career match card**

```typescript
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import type { CareerMatch } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface CareerMatchCardProps {
  match: CareerMatch;
  onClick: () => void;
  isSelected?: boolean;
}

export function CareerMatchCard({ match, onClick, isSelected }: CareerMatchCardProps) {
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
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-gold border-gold"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-charcoal">{match.title}</h3>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gold/10 text-gold font-bold text-sm">
                {match.matchPercent}%
              </div>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className={cn("flex items-center gap-1", outlookColor)}>
                <OutlookIcon className="h-4 w-4" />
                {match.outlookPercent > 0 ? "+" : ""}{match.outlookPercent}% by 2030
              </span>
              <span className="text-gray-500">
                {formatSalary(match.salaryRange.min)} - {formatSalary(match.salaryRange.max)}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {match.rationale}
            </p>
          </div>

          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add components/features/career-match-card.tsx
git commit -m "feat(assess): add career match card component"
```

---

## Task 6: Create Comparison View Component

**Files:**
- Create: `components/features/comparison-view.tsx`

**Step 1: Create the comparison view**

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart } from "@/components/charts/line-chart";
import { TrendingUp, TrendingDown, Minus, Check, BookOpen, ExternalLink } from "lucide-react";
import type { CareerMatch } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface ComparisonViewProps {
  match: CareerMatch;
}

export function ComparisonView({ match }: ComparisonViewProps) {
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
  const outlookData = Array.from({ length: 7 }, (_, i) => ({
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
          <div className="h-32">
            <LineChart
              data={outlookData}
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

      {/* Bridge the Gap Summary */}
      <Card className="bg-gold/5 border-gold">
        <CardContent className="p-4">
          <p className="text-charcoal">
            <span className="font-semibold">Bridge the Gap:</span>{" "}
            With {match.skillsGap.length} targeted course{match.skillsGap.length !== 1 ? "s" : ""},
            you could be transition-ready. Your {match.transferableSkills.length} transferable skills
            give you a strong foundation for this role.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add components/features/comparison-view.tsx
git commit -m "feat(assess): add comparison view with skills gap and courses"
```

---

## Task 7: Create Assessment Page with Wizard and Tabs

**Files:**
- Create: `app/assess/page.tsx`

**Step 1: Create the assessment page**

```typescript
"use client";

import { useState, useEffect } from "react";
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
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes without errors

**Step 3: Verify page works**

Run: `npm run dev`
Navigate to: `http://localhost:3000/assess`
Expected: See questionnaire summary, click "Analyze My Career", see animation, land on tabbed results

**Step 4: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat(assess): add assessment page with wizard reveal and tabs"
```

---

## Task 8: Update Home Page with Assessment Card

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add the Career Assessment card**

Replace the entire file content:

```typescript
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">
          Navigate Your Career Journey
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore job market trends and discover career transition opportunities with data-driven insights.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-gold hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-charcoal">Career Assessment</CardTitle>
            <CardDescription>
              Get personalized career transition recommendations based on your skills and experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/assess">
              <Button className="w-full bg-gold hover:bg-gold/90 text-white">
                Start Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-charcoal hover:shadow-lg transition-shadow">
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

        <Card className="border-l-4 border-l-charcoal hover:shadow-lg transition-shadow">
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

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): add career assessment card to home page"
```

---

## Task 9: Update Navigation with Assess Link

**Files:**
- Modify: `components/navigation.tsx`

**Step 1: Add the Assess link**

Replace the entire file content:

```typescript
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
          <Link href="/pathways" className="text-sm sm:text-base text-charcoal hover:text-gold transition-colors">
            Career Pathways
          </Link>
        </div>
      </nav>
    </header>
  );
}
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add components/navigation.tsx
git commit -m "feat(nav): add assessment link to navigation"
```

---

## Task 10: Final Verification and Feature Commit

**Step 1: Run full build**

Run: `npm run build`
Expected: Build completes without errors

**Step 2: Manual verification**

Run: `npm run dev`

Test the following:
1. Home page shows 3 cards including "Career Assessment"
2. Navigation shows "Assessment" link
3. `/assess` page shows profile summary with "Analyze My Career" button
4. Clicking button shows loading animation with 3 steps
5. After animation, lands on tabbed results
6. "Your Profile" tab shows profile data
7. "Current Role" tab shows outlook cards and insight callout
8. "Career Matches" tab shows 8 career options
9. Clicking a career navigates to "Comparison" tab with details
10. "Comparison" shows skills, courses with external links

**Step 3: Commit feature complete**

```bash
git add .
git commit -m "feat(assess): complete questionnaire flow demo feature

- Add /assess route with wizard reveal animation
- Add tabbed results: Profile, Current Role, Career Matches, Comparison
- Add 8 hardcoded career matches for Customer Service Rep
- Add skills gap analysis with Coursera course suggestions
- Update home page with Assessment card
- Update navigation with Assessment link"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Add assessment types | `lib/data/types.ts` |
| 2 | Create questionnaire profile data | `lib/data/questionnaire-data.ts` |
| 3 | Create career matches data | `lib/data/career-matches.ts` |
| 4 | Create profile summary card | `components/features/profile-summary-card.tsx` |
| 5 | Create career match card | `components/features/career-match-card.tsx` |
| 6 | Create comparison view | `components/features/comparison-view.tsx` |
| 7 | Create assessment page | `app/assess/page.tsx` |
| 8 | Update home page | `app/page.tsx` |
| 9 | Update navigation | `components/navigation.tsx` |
| 10 | Final verification | - |
