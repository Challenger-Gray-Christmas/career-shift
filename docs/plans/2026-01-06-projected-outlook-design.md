# Projected Outlook Feature Design

## Overview

Add projected job outlook visualization to the Explore page, showing leadership how the Career Shift product can communicate job market trajectory to help users understand when career transition may be necessary.

## Scope

- **Purpose**: Internal leadership demo / proof of concept
- **Occupation**: Customer Service Representatives only
- **Data source**: `reference/Customer Service Reps - Regional Outlook.xls`
- **Location**: Explore page

## Data

The Excel file contains:
- 3,195 county-level job projections
- Years: 2020-2030
- Fields: County code, County name, Jobs per year

National trend: ~2.8M jobs (2020) declining to ~2.3M (2030) = approximately 18% decline

## UI Components

### National Outlook Card

- **Headline**: "Projected Job Outlook"
- **Chart**: Line chart showing 2020-2030 trajectory
- **Key stat**: "−18% by 2030" with declining indicator
- **Context**: "Jobs expected to decline from 2.8M to 2.3M nationally"
- **Styling**: Match existing card design (border-l-4 gold accent)

### Regional Outlook Card

- **Headline**: "Outlook by Region"
- **Display**: Table or bar chart showing top 10 metros
- **Columns**: Region name, 2024 jobs, 2030 jobs, % change
- **Color coding**: Red (decline), green (growth), yellow (flat)
- **Styling**: Match existing card design

## Implementation

### New Files

| File | Purpose |
|------|---------|
| `lib/data/projected-outlook.ts` | Static data extracted from Excel, helper functions for aggregation |
| `components/features/national-outlook-card.tsx` | National trend line chart component |
| `components/features/regional-outlook-card.tsx` | Regional breakdown table/chart component |

### Modified Files

| File | Changes |
|------|---------|
| `app/explore/page.tsx` | Remove occupation dropdown, add two new outlook cards |
| `lib/data/occupations.ts` | Simplify to single occupation (Customer Service Rep) |

### Data Processing

1. Extract Excel data into TypeScript
2. Aggregate counties into metro areas for regional view
3. Pre-calculate national totals for trend chart
4. Store as static data (no runtime Excel parsing)

### Chart Approach

Use same pattern as existing trend cards. Check if Recharts is installed; if not, use CSS-based simple visualization.

## Future Considerations

If this demo lands well, potential next steps:
- B: Simple questionnaire flow
- C: Career match recommendations with viability scores
- Expand outlook data to Pathways page for transition comparison
