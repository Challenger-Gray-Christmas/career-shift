# Unified Tab Hub Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate multi-page app into single tabbed hub with 5 tabs and on-demand loading.

**Architecture:** Remove home page and standalone routes. Enhance `/assess` to be the main hub with Client Profile, Current Role, Career Matches, Career Pathways, and Job Explorer tabs. Each tab loads data on-demand with skeleton UI.

**Tech Stack:** Next.js App Router, React state for tab loading, Tailwind CSS for skeleton animations.

---

## Task 1: Create Skeleton UI Component

**Files:**
- Create: `components/ui/skeleton.tsx`

**Step 1: Create the skeleton component**

```tsx
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

export { Skeleton };
```

**Step 2: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -20`
Expected: No errors related to skeleton.tsx

**Step 3: Commit**

```bash
git add components/ui/skeleton.tsx
git commit -m "feat: add skeleton UI component"
```

---

## Task 2: Create MarketDataGridSkeleton Component

**Files:**
- Create: `components/features/market-data-grid-skeleton.tsx`

**Step 1: Create the skeleton grid component**

```tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketDataGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -20`
Expected: No errors

**Step 3: Commit**

```bash
git add components/features/market-data-grid-skeleton.tsx
git commit -m "feat: add MarketDataGridSkeleton component"
```

---

## Task 3: Create MasterDetailSkeleton Component

**Files:**
- Create: `components/features/master-detail-skeleton.tsx`

**Step 1: Create the master-detail skeleton component**

```tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MasterDetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Master Panel - List */}
      <div className="lg:col-span-2 space-y-2">
        <Skeleton className="h-4 w-40 mb-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </Card>
        ))}
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
            <Skeleton className="h-32 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -20`
Expected: No errors

**Step 3: Commit**

```bash
git add components/features/master-detail-skeleton.tsx
git commit -m "feat: add MasterDetailSkeleton component"
```

---

## Task 4: Update Assess Page - Add Tab Type and State

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Update Tab type to include job-explorer**

Find this code (around line 27):
```tsx
type Tab = "profile" | "current-role" | "career-matches" | "career-pathways";
```

Replace with:
```tsx
type Tab = "profile" | "current-role" | "career-matches" | "career-pathways" | "job-explorer";
```

**Step 2: Add loading state type and state variable**

Find this code (around line 38-44):
```tsx
  const [phase, setPhase] = useState<"analyzing" | "results">("analyzing");
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || "profile");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
```

Replace with:
```tsx
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
```

**Step 3: Remove analysisSteps state and the analyzing useEffect**

Delete the analysisSteps useState (lines 40-44) and the entire useEffect that handles the analyzing animation (around lines 57-83).

**Step 4: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -30`
Expected: May have errors about unused imports - that's okay for now

**Step 5: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: add job-explorer tab type and loading state"
```

---

## Task 5: Update Assess Page - Modify Tab Change Handler

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Update handleTabChange to trigger loading state**

Find this code (around line 85-94):
```tsx
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
```

Replace with:
```tsx
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
```

**Step 2: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -30`
Expected: No errors

**Step 3: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: add loading state simulation to tab changes"
```

---

## Task 6: Update Assess Page - Add Job Explorer Tab to Tabs Array

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Add OccupationSearch import**

Find the imports at the top of the file and add:
```tsx
import { OccupationSearch } from "@/components/features/occupation-search";
```

**Step 2: Add skeleton imports**

Add these imports:
```tsx
import { MarketDataGridSkeleton } from "@/components/features/market-data-grid-skeleton";
import { MasterDetailSkeleton } from "@/components/features/master-detail-skeleton";
```

**Step 3: Update tabs array**

Find this code (around line 104-109):
```tsx
  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Client Profile" },
    { id: "current-role", label: "Current Role" },
    { id: "career-matches", label: "Career Matches" },
    { id: "career-pathways", label: "Career Pathways" },
  ];
```

Replace with:
```tsx
  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Client Profile" },
    { id: "current-role", label: "Current Role" },
    { id: "career-matches", label: "Career Matches" },
    { id: "career-pathways", label: "Career Pathways" },
    { id: "job-explorer", label: "Job Explorer" },
  ];
```

**Step 4: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -30`
Expected: No errors

**Step 5: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: add Job Explorer to tabs array and imports"
```

---

## Task 7: Update Assess Page - Remove Analyzing Phase

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Remove the analyzing phase render block**

Delete the entire block (around lines 111-149):
```tsx
  // Analyzing Phase
  if (phase === "analyzing") {
    return (
      ...
    );
  }
```

**Step 2: Remove unused imports**

Remove these imports that were only used for analyzing phase:
- `Loader2` (if not used elsewhere)
- `CheckCircle2`

Also remove the `AnalysisStep` type definition.

**Step 3: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -30`
Expected: No errors

**Step 4: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: remove analyzing phase, go straight to tabs"
```

---

## Task 8: Update Assess Page - Add Skeleton UI to Current Role Tab

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Update Current Role tab content to show skeleton when loading**

Find the current-role tab content (around line 184-192):
```tsx
      {activeTab === "current-role" && (
        <div className="space-y-4">
          <CurrentRoleCard data={pathwaysData} />
          <MarketDataGrid
            jobPostingsData={jobPostingsData}
            outlookData={outlookData}
          />
        </div>
      )}
```

Replace with:
```tsx
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
```

**Step 2: Add Skeleton import**

Add to imports:
```tsx
import { Skeleton } from "@/components/ui/skeleton";
```

**Step 3: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -30`
Expected: No errors

**Step 4: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: add skeleton UI to Current Role tab"
```

---

## Task 9: Update Assess Page - Add Skeleton UI to Career Matches Tab

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Update Career Matches tab content to show skeleton when loading**

Find the career-matches tab content and wrap with loading check. Replace the entire `{activeTab === "career-matches" && (...)}` block with:

```tsx
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
```

**Step 2: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -30`
Expected: No errors

**Step 3: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: add skeleton UI to Career Matches tab"
```

---

## Task 10: Update Assess Page - Add Skeleton UI to Career Pathways Tab

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Update Career Pathways tab content to show skeleton when loading**

Replace the entire `{activeTab === "career-pathways" && (...)}` block with:

```tsx
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
            </>
          )}
        </div>
      )}
```

**Step 2: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -30`
Expected: No errors

**Step 3: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: add skeleton UI to Career Pathways tab"
```

---

## Task 11: Update Assess Page - Add Job Explorer Tab Content

**Files:**
- Modify: `app/assess/page.tsx`

**Step 1: Add Job Explorer tab content after the career-pathways tab block**

Add this new block right before the closing `</div>` of the main container:

```tsx
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
```

**Step 2: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -30`
Expected: No errors

**Step 3: Commit**

```bash
git add app/assess/page.tsx
git commit -m "feat: add Job Explorer tab content with search and market data"
```

---

## Task 12: Update Home Page to Redirect

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace home page with redirect**

Replace the entire file content with:

```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/assess");
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -20`
Expected: No errors

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: redirect home page to /assess"
```

---

## Task 13: Remove Explore Page

**Files:**
- Delete: `app/explore/page.tsx`

**Step 1: Delete the explore page**

```bash
rm /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift/app/explore/page.tsx
```

**Step 2: Verify build still works**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -20`
Expected: No errors (explore functionality is now in Job Explorer tab)

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: remove standalone explore page (now a tab)"
```

---

## Task 14: Remove Pathways Page

**Files:**
- Delete: `app/pathways/page.tsx`

**Step 1: Delete the pathways page**

```bash
rm /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift/app/pathways/page.tsx
```

**Step 2: Verify build still works**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -20`
Expected: No errors

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: remove standalone pathways page (now a tab)"
```

---

## Task 15: Update Navigation Component

**Files:**
- Modify: `components/navigation.tsx`

**Step 1: Simplify navigation to remove dead links**

Replace the entire file content with:

```tsx
import Image from "next/image";
import Link from "next/link";

export function Navigation() {
  return (
    <header className="border-b border-lightgray bg-white">
      <nav className="container mx-auto flex h-16 items-center px-4">
        <Link href="/assess">
          <Image
            src="/cgc-logo.svg"
            alt="Challenger, Gray & Christmas"
            width={160}
            height={28}
            priority
          />
        </Link>
      </nav>
    </header>
  );
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build 2>&1 | head -20`
Expected: No errors

**Step 3: Commit**

```bash
git add components/navigation.tsx
git commit -m "feat: simplify navigation, remove dead links"
```

---

## Task 16: Manual Testing

**Step 1: Start dev server**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run dev`

**Step 2: Test checklist**

- [ ] Visit `/` - should redirect to `/assess`
- [ ] `/assess` loads with Client Profile tab active
- [ ] Click "Current Role" tab - skeleton appears briefly, then content loads
- [ ] Click "Career Matches" tab - skeleton appears briefly, then content loads, first match auto-selected
- [ ] Click "Career Pathways" tab - skeleton appears briefly, then content loads, first pathway auto-selected
- [ ] Click "Job Explorer" tab - skeleton appears briefly, then search + market data appears
- [ ] In Job Explorer, search for different occupation - data updates
- [ ] Switch between tabs - previously loaded tabs show content immediately (no skeleton)
- [ ] `/explore` returns 404 (page removed)
- [ ] `/pathways` returns 404 (page removed)

**Step 3: Stop dev server and final commit if any fixes needed**

---

## Task 17: Final Cleanup and Build Verification

**Step 1: Run production build**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run build`
Expected: Build succeeds with no errors

**Step 2: Run linting**

Run: `cd /Users/christopherbrownridge/Desktop/projects/challenger-gray/career-shift && npm run lint`
Expected: No errors (warnings okay)

**Step 3: Final commit if any cleanup needed**

```bash
git status
# If any uncommitted changes:
git add -A
git commit -m "chore: final cleanup"
```
