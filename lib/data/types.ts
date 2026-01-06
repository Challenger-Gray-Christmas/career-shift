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
