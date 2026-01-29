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

export interface YearlyProjection {
  year: number;
  jobs: number;
}

export interface RegionalProjection {
  county: string;
  countyName: string;
  jobs2024: number;
  jobs2030: number;
  percentChange: number;
}

export interface ProjectedOutlookData {
  occupation: string;
  national: {
    timeseries: YearlyProjection[];
    startJobs: number;
    endJobs: number;
    percentChange: number;
  };
  regional: RegionalProjection[];
}

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
