# Career Shift Web App - Design Document

**Date:** 2026-01-05
**Status:** Approved
**Client:** Challenger, Gray & Christmas

---

## Overview

A career shifting web application that visualizes Lightcast job market and career pathways data. The app helps users explore job market trends for specific occupations and identify career transition opportunities with skill gap analysis.

## Scope

- **Minimum:** Static demo with sample data from Postman collection
- **Ideal:** Interactive prototype with sample data (dropdowns, expandable cards, cross-page navigation)
- **Not included:** Live API integration (future phase)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js | React framework |
| Vercel | Deployment |
| shadcn/ui | UI components |
| Tailwind CSS | Styling |
| Recharts | Charts and data visualization |
| TypeScript | Type safety |

---

## Brand Colors (Challenger Gray)

| Color | Hex | Usage |
|-------|-----|-------|
| Dark Charcoal | `#32373c` | Navigation, headers, primary buttons |
| Gold/Tan | `#cd995c` | Accent, hover states, highlights |
| White | `#ffffff` | Backgrounds |
| Light Gray | `#eaeaea` | Borders, dividers |
| Black | `#000000` | Body text |

---

## Project Structure

```
career-shift/
├── app/
│   ├── page.tsx              # Landing/home page
│   ├── explore/
│   │   └── page.tsx          # Job Explorer dashboard
│   ├── pathways/
│   │   └── page.tsx          # Career Transition flow
│   └── layout.tsx            # Shared nav, footer
├── components/
│   ├── ui/                   # shadcn components
│   ├── charts/               # Recharts wrappers
│   └── features/             # Page-specific components
├── lib/
│   └── data/                 # Sample JSON from Postman
└── tailwind.config.ts        # Challenger Gray brand tokens
```

---

## Pages

### 1. Home Page (`/`)

Brief introduction with two CTA cards:
- "Explore Job Market" → links to `/explore`
- "Plan Career Transition" → links to `/pathways`

### 2. Job Explorer Page (`/explore`)

**Header:**
- Page title: "Job Market Explorer"
- Occupation dropdown (pre-populated with "Customer Service Representative (General)")
- Summary stat: total unique postings

**Dashboard Grid (6 cards):**

| Card | Visualization | Data Source |
|------|---------------|-------------|
| Salary Trend | Line chart (median salary by month) | `timeseries.median_salary` |
| Posting Trend | Line chart (unique postings by month) | `timeseries.unique_postings` |
| Top Regions | Horizontal bar chart (top 10 metros) | `rankings/msa_name` |
| Top Companies | Table (company, postings, salary) | `rankings/company_name` |
| Education Requirements | Donut chart (degree breakdown) | `rankings/edulevels_name` |
| Top Job Titles | Table (title, postings, salary) | `rankings/title_name` |

**Interactive elements:**
- Card expansion on click (prototype)
- "Plan Career Transition" button → `/pathways` with occupation pre-selected

### 3. Career Pathways Page (`/pathways`)

**Header:**
- Page title: "Career Pathways"
- Occupation dropdown (pre-populated with "Data Scientist")
- Current role card: job name, level, mean salary

**Two-Column Layout:**

| Left: "Where You Could Go" | Right: "Where People Come From" |
|----------------------------|----------------------------------|
| Advancement/next-step jobs | Feeder jobs |
| Roles people transition TO | Roles people transition FROM |

**Job Card Content:**
- Job title
- Category badge (color-coded):
  - Advancement: Green
  - Lateral Transition: Blue
  - Similar: Gray
  - Lateral Advancement: Gold
- Match score (e.g., "88% match")
- Salary diff (↑ $48,035 or ↓ $12,059)
- Job level change (+1 level, Same level, etc.)

**Skill Gap Panel (expands on card click):**
- Source role → Target role header
- Skills to acquire (ranked by importance score)
- Displayed as progress bars or ranked list

**Interactive elements:**
- Card click expands skill gap panel
- "Explore this role in Job Market" → `/explore` with role pre-selected

---

## User Flows

1. **Explore flow:** Home → "Explore Job Market" → Dashboard for selected occupation
2. **Pathways flow:** Home → "Plan Career Transition" → Pathways for role → Click job → See skill gaps
3. **Cross-navigation:** Job Explorer → "Plan Career Transition" button → Pathways (pre-selected)
4. **Reverse navigation:** Pathways → "Explore this role" → Job Explorer (pre-selected)

---

## Visual Design

**Typography:**
- System font stack (or Inter)
- Large bold headings for page titles
- Medium weight for card titles
- Regular for body text

**Card Styling:**
- Subtle border (`#eaeaea`)
- Light shadow on hover
- Rounded corners (8px)
- Gold left-border accent on key stat cards

**Chart Styling:**
- Line charts: Gold (`#cd995c`) primary, charcoal (`#32373c`) secondary
- Bar charts: Gold bars, charcoal labels
- Donut chart: Gold, charcoal, gray segments

**Responsive Breakpoints:**
- Desktop: 2-3 column grid
- Tablet: 2 columns
- Mobile: Single column stack

---

## Data Sources (Static JSON)

From Postman collection `reference/Challengergray.postman_collection.json`:

**Job Postings API:**
- Meta (available facets, filters)
- Salary Trend (timeseries)
- Postings Trend (timeseries)
- Regional Breakdown (rankings/msa_name)
- Educational Requirements (rankings/edulevels_name)
- Companies Posting (rankings/company_name)
- Top Job Titles (rankings/title_name)
- Top Industries (rankings/naics6_name)

**Career Pathways API:**
- Feeder Jobs (dimensions/lotspecocc/feederjobs)
- Advancement Jobs (dimensions/lotspecocc/nextstepjobs)
- Skill Gap (dimensions/lotspecocc/skillgap)

---

## Future Considerations (Out of Scope)

- Live Lightcast API integration with OAuth
- User accounts and saved career paths
- Job posting search and filtering
- Geographic map visualization
- PDF export of career transition plans
