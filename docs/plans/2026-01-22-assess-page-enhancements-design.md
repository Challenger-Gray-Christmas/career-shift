# Assess Page Enhancements Design

**Date:** 2026-01-22
**Status:** Approved

## Context

This app helps career coaches analyze job market data for their clients. Coaches need to:
1. See job trends for a client's current role
2. Explore potential career matches and pathways
3. Deep-dive into any career option with full market data

Currently, data is spread across multiple pages (/assess, /explore, /pathways). This design consolidates everything into /assess for a streamlined coach experience.

## Design

### 1. /assess Page - 5 Tabs

#### Tab 1: Client Profile
- Shows client info: name, skills, experience, education, certifications
- No changes from current "Your Profile" tab (renamed only)

#### Tab 2: Current Role
All market data for the client's current job, arranged in rows of 2:

| Row | Left | Right |
|-----|------|-------|
| 1 | National Outlook (line chart: 2020-2030) | Regional Outlook (table: top 10 counties) |
| 2 | Salary Trend (monthly line chart) | Job Postings Trend (monthly line chart) |
| 3 | Top Regions (horizontal bar chart) | Top Companies (table) |
| 4 | Education Requirements (donut chart) | Top Job Titles (table) |

- Remove "Insight" text that currently appears at bottom
- Charts exclude current month (show only complete months)

#### Tab 3: Career Matches
- Grid of 8 career match cards (unchanged)
- Each shows: role name, match %, outlook %, salary range
- Clicking a card navigates to Comparison tab

#### Tab 4: Career Pathways
Moved from /pathways page. Three-column layout:

- **Left:** Current Role Card (job, level, salary)
- **Middle:** "Where You Could Go" - 8 advancement opportunity cards
- **Right:** "Where People Come From" - 8 feeder/lateral role cards

Each pathway card shows: role name, match score, salary diff, level diff.
Clicking a card navigates to Comparison tab.

#### Tab 5: Comparison
Shows detailed analysis when a career is selected from Matches or Pathways:

**Section A: Skills Analysis**
- Transferable Skills list
- Skills Gap with recommended courses

**Section B: Market Data (rows of 2)**
| Row | Left | Right |
|-----|------|-------|
| 1 | Salary Trend | Job Postings Trend |
| 2 | Top Regions | Top Companies |
| 3 | Education Requirements | Top Job Titles |

**Section C: Outlook**
- National Outlook (2020-2030 projection)
- Regional Outlook (top counties)

**Header:** Shows selected role name and match % (e.g., "Sales Representative - 74% match")

**Empty State:** "Select a career from Career Matches or Career Pathways to see detailed analysis."

### 2. /explore Page Enhancements

Add search functionality for exploring any job title:

**Search Bar**
- Autocomplete input at top: "Search any job title..."
- Dropdown shows matching occupations as user types
- Selecting loads market data below

**Charts (same layout as Current Role tab)**
- Rows of 2, same 8 charts
- Exclude current month from trend charts

**Default State:** Prompt to search, or pre-load common role

**Future:** Connect to Lightcast API for real occupation data

### 3. Global Changes

**Job Postings & Salary Trend Charts**
- Exclude current month across all pages
- Show data through last complete month only
- Prevents misleading partial-month data

**Page Load**
- Brief analyzing animation (2-3 seconds) before showing tabs
- Profile data is pre-populated (no questionnaire)

**Remove /pathways Page**
- Consolidated into /assess Career Pathways tab
- Update navigation to remove /pathways link

### 4. Files to Modify

**Assess Page:**
- `app/assess/page.tsx` - Add tabs, update layout
- `components/features/current-role-tab.tsx` - New component with all charts
- `components/features/career-pathways-tab.tsx` - New component (moved from /pathways)
- `components/features/comparison-view.tsx` - Add market data section

**Explore Page:**
- `app/explore/page.tsx` - Add search bar, update layout

**Charts:**
- `components/cards/postings-trend-card.tsx` - Filter current month
- `components/cards/salary-trend-card.tsx` - Filter current month

**Navigation:**
- Remove /pathways link from nav

**Cleanup:**
- Remove `app/pathways/page.tsx` (or redirect to /assess)

## Data Notes

- Currently uses hardcoded demo data in `/lib/data/`
- Search autocomplete will need occupation list
- Future: Lightcast API integration for real data
