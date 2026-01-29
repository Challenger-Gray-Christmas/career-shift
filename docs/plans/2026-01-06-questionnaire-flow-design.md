# Questionnaire Flow & Career Analysis Design

## Overview

Add a career assessment feature that demonstrates how questionnaire data leads to personalized career transition recommendations. This is a hardcoded demo for leadership review - no dynamic data processing.

## Scope

- **Purpose**: Internal leadership demo / proof of concept
- **Persona**: Customer Service Representative (hardcoded profile)
- **Location**: New `/assess` route
- **Data**: All static/hardcoded

## User Flow

```
/assess (Questionnaire Summary)
    ↓ Click "Analyze My Career"
Progressive Reveal Animation (3-4 seconds)
    ↓ Lands on...
Tabbed Results View
    ├── Your Profile
    ├── Current Role Analysis
    ├── Career Matches (5-10 options)
    └── Comparison (single-select detail view)
```

**Entry point**: New "Career Assessment" card on home page alongside existing cards.

## Tab Details

### Tab 1: Your Profile

Displays hardcoded questionnaire data:

| Section | Display |
|---------|---------|
| **Header** | Name, current title ("Customer Service Representative"), location |
| **Key Skills** | Pill/badge layout (communication, problem-solving, CRM, etc.) |
| **Experience** | Compact list: Company, title, years |
| **Education** | Degree, school, year |
| **Certifications** | List any relevant certs |

### Tab 2: Current Role Analysis

Reuses existing outlook components:

- **NationalOutlookCard** - "-18% by 2030" trend
- **RegionalOutlookCard** - Top 10 metros with color-coded outlook
- **Summary callout** - "Based on projected decline, now may be a good time to explore adjacent career paths"

### Tab 3: Career Matches

5-10 alternative careers as scrollable cards. Each shows:

| Element | Example |
|---------|---------|
| **Job Title** | Sales Representative |
| **Match Score** | 74% skill match (circular badge) |
| **Outlook Indicator** | +12% by 2030 (green) |
| **Why This Fits** | "Your communication and problem-solving skills transfer directly." |
| **Key Stats** | Median salary: $52K |

**Hardcoded matches:**

1. Sales Representative - 74% match, +12% outlook
2. Administrative Assistant - 71% match, -5% outlook
3. HR Coordinator - 68% match, +8% outlook
4. Account Manager - 65% match, +15% outlook
5. Insurance Agent - 62% match, +6% outlook
6. Retail Manager - 60% match, +3% outlook
7. Bank Teller - 58% match, -12% outlook
8. Receptionist - 55% match, -9% outlook

Clicking a card navigates to Comparison tab with that career selected.

### Tab 4: Comparison

When a career is selected, shows detailed breakdown:

**Selected Career Header**
- Title, match score (large), outlook with mini chart, salary range

**Skills You Have (Transferable)**
- Green checkmarks: Communication, Problem-solving, CRM, Conflict resolution, Active listening, Data entry

**Skills Gap (What You Need)**

| Skill | Coursera Course | Duration | Level |
|-------|-----------------|----------|-------|
| Sales Techniques | "Sales Training: Techniques for a Human-Centric Sales Process" (HubSpot) | 4 weeks | Beginner |
| Negotiation | "Successful Negotiation" (University of Michigan) | 7 weeks | Intermediate |
| CRM Software | "Salesforce Sales Operations" (Salesforce) | 4 weeks | Beginner |
| Lead Generation | "Sales Prospecting and Lead Generation" | 3 weeks | Beginner |

**Bridge the Gap Summary**
- Callout: "With 3-4 courses, you could be transition-ready."

## Progressive Reveal Animation

When user clicks "Analyze My Career":

1. **Loading state** (1 sec) - Spinner with "Analyzing your profile..."
2. **Step 1** (1 sec) - "Evaluating current role outlook..." → checkmark
3. **Step 2** (1 sec) - "Finding career matches..." → checkmark
4. **Step 3** (1 sec) - "Identifying skills gaps..." → checkmark
5. **Complete** - Transitions to tabbed view on "Your Profile" tab

Implementation: State machine with setTimeout. Purely theatrical.

## Implementation

### New Files

| File | Purpose |
|------|---------|
| `app/assess/page.tsx` | Main assessment page with wizard reveal + tabs |
| `lib/data/questionnaire-data.ts` | Hardcoded Customer Service Rep profile |
| `lib/data/career-matches.ts` | Hardcoded career matches with scores, outlook, rationale |
| `lib/data/skills-gap.ts` | Skills mapping and Coursera course suggestions per career |
| `components/features/profile-summary-card.tsx` | Your Profile tab content |
| `components/features/career-match-card.tsx` | Individual career match card |
| `components/features/skills-gap-section.tsx` | Skills gap with course suggestions |
| `components/features/comparison-view.tsx` | Full comparison tab layout |

### Modified Files

| File | Changes |
|------|---------|
| `app/page.tsx` | Add third card: "Career Assessment" linking to `/assess` |
| `components/navigation.tsx` | Add "Assess" nav link if needed |

### Data Types

```typescript
// questionnaire-data.ts
type QuestionnaireProfile = {
  name: string;
  currentRole: string;
  location: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
}

// career-matches.ts
type CareerMatch = {
  id: string;
  title: string;
  matchPercent: number;
  outlookPercent: number;  // positive = growth
  salaryRange: { min: number; max: number };
  rationale: string;
  transferableSkills: string[];
  skillsGap: SkillGap[];
}

type SkillGap = {
  skill: string;
  course: CourseraCourse;
}

type CourseraCourse = {
  title: string;
  provider: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  url?: string;  // placeholder for demo
}
```

## Out of Scope

- Actual questionnaire form input (data is pre-filled)
- Dynamic calculations (all hardcoded)
- Coursera API integration (links are placeholders)
- Save/export functionality
- Mobile optimization (desktop/tablet focus for demo)

## Future Considerations

If demo lands well:
- Coursera API integration for dynamic course suggestions
- Actual questionnaire form with data capture
- Dynamic skills matching algorithm
- Save/share assessment results
- Integration with existing Pathways page
