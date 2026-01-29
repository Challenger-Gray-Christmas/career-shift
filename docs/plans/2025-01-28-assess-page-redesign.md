# Assess Page Redesign

## Overview

Redesign the Career Assessment Results page to address client feedback on navigation confusion, chart readability, and regional filtering.

## Changes

### 1. Remove Comparison Tab

**Problem:** The flow from Career Matches → Comparison and Career Pathways → Comparison is confusing. Users lose context when navigating to a separate tab.

**Solution:** Remove the Comparison tab entirely. Display comparison data inline using a master-detail layout.

**Result:** 4 tabs remain:
- Client Profile
- Current Role
- Career Matches
- Career Pathways

### 2. Master-Detail Layout for Career Matches & Career Pathways

**Layout:**
- **Current Role card** pinned at top (provides context anchor)
- **Left panel (~40% width):** Scrollable list of career options
- **Right panel (~60% width):** Detail view for selected career

**Behavior:**
- Clicking a card in the left list highlights it and shows details on right
- First item auto-selected by default (right panel never empty)
- No page navigation required

**Career Matches left panel:** Compact career match cards (title, match %, salary, outlook)

**Career Pathways left panel:** Two collapsible sections:
- Advancement Jobs
- Feeder Jobs

### 3. Detail Panel Content

**Header (always visible):**
- Career title
- Skill match percentage badge
- Salary range
- Outlook badge with trend icon (+X% by 2030)

**Expandable sections:**

1. **Skills & Training** (open by default)
   - "Skills You Have" - green badges for transferable skills
   - "Skills to Develop" - skill gaps with recommended Coursera courses

2. **Market Data** (collapsed by default)
   - National Outlook card (year-by-year projection chart)
   - Regional Outlook table
   - Salary Trend chart
   - Postings Trend chart
   - Top Regions table
   - Top Companies
   - Education Requirements
   - Top Titles

**For Career Pathways:** Same structure, but Skills section shows skill gap importance bars instead of courses.

### 4. Global Region Selector

**Placement:** Dropdown in the Current Role card at top of page

**Label:** "Viewing outlook for:" with current selection

**Options:**
- "National (All Regions)" - default
- List of available MSAs from API data
- Search/filter within dropdown if list is long

**Affects:**
- Regional Outlook table
- Top Regions table
- Salary trends (when regional data available)
- Postings trends (when regional data available)
- Top companies (filtered by region)

**Does not affect:**
- National outlook projections (always national)
- Skills/courses sections

**Persistence:** Selection persists across tab switches and career selections.

### 5. Top Regions: Chart → Table

**Problem:** Horizontal bar chart truncates long region names, making them unreadable.

**Solution:** Replace with a table.

| Region | Job Postings |
|--------|-------------|
| New York-Newark-Jersey City, NY-NJ-PA | 42,156 |
| Los Angeles-Long Beach-Anaheim, CA | 38,291 |
| Chicago-Naperville-Elgin, IL-IN-WI | 27,845 |

**Features:**
- Full region names (no truncation)
- Formatted numbers with commas
- Optional small inline bar for visual comparison
- Top 10 by default with "Show more" to expand
- Matches existing Regional Outlook table styling

### 6. Remove Fake Forecast Chart

**Problem:** The 2024-2030 line chart in the comparison header shows fabricated data (linear interpolation of outlookPercent). It's confusing and redundant.

**Solution:** Remove the chart entirely.

**Keep:**
- "+X% by 2030" badge in header (communicates the same info concisely)
- Real projected outlook chart in Market Data section (has actual year-by-year data)

## Data Sources

**Lightcast/EMSI Job Postings API:**
- Salary trends (timeseries) - supports MSA filtering
- Postings trends (timeseries) - supports MSA filtering
- Regional rankings (msa_name) - supports MSA filtering
- Top companies, titles, education, industries - supports MSA filtering

**Career Pathways API:**
- Feeder jobs, advancement jobs, skill gaps
- Supports regional filtering via `area` object

**Projected Outlook (static Excel data):**
- National year-by-year projections (2020-2030)
- County-level projections (currently top 20, full regional data coming via future API endpoint)

## Implementation Notes

- Region selector dropdown should populate from available MSAs in the data
- When regional data is unavailable, fall back to national data with indicator
- Consider loading state for detail panel when switching between careers
- Ensure keyboard navigation works for master-detail layout
- Mobile: Stack master-detail vertically (list above, detail below)
