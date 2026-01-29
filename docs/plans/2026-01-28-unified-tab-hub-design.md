# Unified Tab Hub Design

## Overview

Consolidate the multi-page app into a single tabbed hub experience. Coaches land directly on the tabbed interface with the client profile preloaded, and access all features (career matches, pathways, job explorer) via tabs instead of separate pages.

## User Flow

1. Coach clicks link with URL like `/assess?clientId=abc123`
2. Tabbed interface loads with Client Profile tab active and populated
3. Coach clicks other tabs → skeleton UI appears → data loads on-demand
4. Tab state persists in URL (`/assess?clientId=abc123&tab=career-matches`)

**Demo Mode:** For now, `clientId` is accepted but unused. All tabs load existing mock data. Real Bubble API integration comes later when embedding in coach-control-center.

## Route Changes

| Before | After |
|--------|-------|
| `/` (3-choice home) | Redirect to `/assess` |
| `/assess` | Main hub (enhanced) |
| `/explore` | Removed (now a tab) |
| `/pathways` | Removed (now a tab) |

## Tab Structure

| # | Tab Name | Data Source | Load Behavior |
|---|----------|-------------|---------------|
| 1 | Client Profile | Bubble API (mock for now) | Preloaded on page load |
| 2 | Current Role | Market data | On-demand with skeleton |
| 3 | Career Matches | Matching API (mock) | On-demand with skeleton |
| 4 | Career Pathways | Pathways API (mock) | On-demand with skeleton |
| 5 | Job Explorer | Market data | On-demand with skeleton + search |

## Data Loading

### Loading States

Each tab tracks its own state: `idle` | `loading` | `loaded` | `error`

- First click → `loading` → show skeleton → fetch data → `loaded`
- Subsequent clicks → show cached data (no refetch)
- Data cached in React state for session duration
- Page refresh resets all tabs except profile

### Skeleton UI Per Tab

| Tab | Skeleton Pattern |
|-----|------------------|
| Current Role | Card skeleton + grid of 8 card placeholders |
| Career Matches | List skeleton (left) + detail card skeleton (right) |
| Career Pathways | List skeleton (left) + detail card skeleton (right) |
| Job Explorer | Search bar + grid of 8 card placeholders |

## Component Changes

### Assess Page (`app/assess/page.tsx`)

- Remove "analyzing" animation phase - go straight to tabs
- Add 5th tab: "Job Explorer"
- Read `clientId` from URL (unused for now, ready for future)
- Track per-tab loading state

### New Job Explorer Tab Content

- Move `OccupationSearch` component from `/explore` into tab
- Reuse existing `MarketDataGrid` component
- Default occupation: "Customer Service Representative"
- Search triggers skeleton → load new market data

### New Skeleton Components

- `MarketDataGridSkeleton` - 8 placeholder cards in grid layout
- `MasterDetailSkeleton` - list placeholders + detail panel placeholder

### Files to Remove

- `app/explore/page.tsx`
- `app/pathways/page.tsx`

### Files to Modify

- `app/page.tsx` - Change to redirect to `/assess`
- `app/assess/page.tsx` - Add Job Explorer tab, remove analyzing phase, add loading states
- Navigation component - Remove Explore/Pathways links

## URL Parameters

| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| `clientId` | No (for demo) | — | Client identifier for API (future use) |
| `tab` | No | `profile` | Active tab: `profile`, `current-role`, `career-matches`, `career-pathways`, `job-explorer` |

## Edge Cases

- **No clientId:** Load default mock data (demo mode)
- **Invalid tab param:** Default to `profile` tab
- **Mobile:** Tabs scroll horizontally if needed (5 tabs)

## What's NOT Changing

- Tab content components (ProfileSummaryCard, CareerMatchDetail, PathwayDetail, etc.)
- MarketDataGrid and all chart components
- Overall styling and Challenger Gray branding
- Master-detail layout patterns

## Future Integration

When embedding in coach-control-center:
- `clientId` will come from parent app context or URL
- Replace mock data with real Bubble API calls
- Profile data fetched from Bubble, market data from external APIs
