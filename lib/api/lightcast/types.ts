/**
 * Lightcast API TypeScript Types
 */

// Authentication
export interface LightcastAuthRequest {
  client_id: string;
  client_secret: string;
  grant_type: 'client_credentials';
  scope: string;
}

export interface LightcastAuthResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface CachedToken {
  token: string;
  expiresAt: number;
  refreshAt: number;
  scope: string;
}

// Error Responses
export interface LightcastError {
  errors: {
    status: string;
    title: string;
    detail: string;
  };
}

// Taxonomies (Occupation Search)
export interface TaxonomyItem {
  id: string;
  name: string;
}

export interface TaxonomiesResponse {
  data: TaxonomyItem[];
}

// Job Postings API
export interface JobPostingsTimeseriesRequest {
  filter: {
    when: {
      start: string;
      end: string;
    };
    lot_specialized_occupation_name?: string[];
  };
  rank?: {
    by: string;
    limit?: number;
  };
}

export interface JobPostingsTimeseriesResponse {
  data: {
    timeseries: {
      day?: string[];
      month?: string[];
      unique_postings?: number[];
      median_posting_duration?: number[];
      median_salary?: number[];
    };
  };
}

export interface JobPostingsRankingRequest {
  filter: {
    when: {
      start: string;
      end: string;
    };
    lot_specialized_occupation_name?: string[];
  };
  rank: {
    by: string;
    limit: number;
  };
}

export interface RankingItem {
  name: string;
  unique_postings: number;
  median_salary?: number;
}

export interface JobPostingsRankingResponse {
  data: {
    ranking: {
      buckets: RankingItem[];
    };
  };
}

// Career Pathways API
export interface CareerPathwaysRequest {
  dimension: string;
  dimensionValue: string;
  category?: string[];
}

export interface CareerPathwaysJob {
  id: string;
  name: string;
  category: 'Advancement' | 'LateralAdvancement' | 'Similar' | 'LateralTransition';
  score: number;
  meanSalary: number;
  meanSalaryDiff: number;
  jobLevel: number;
  jobLevelDiff: number;
}

export interface CareerPathwaysResponse {
  data: {
    id: string;
    name: string;
    jobLevel: number;
    meanSalary: number;
    pathways: CareerPathwaysJob[];
  };
}

// Skill Gap API
export interface SkillGapRequest {
  dimension: string;
  sourceDimensionValue: string;
  destinationDimensionValue: string;
}

export interface SkillGapItem {
  id: string;
  name: string;
  importanceScore: number;
  type?: string;
  category?: string;
}

export interface SkillGapResponse {
  data: {
    source: {
      id: string;
      name: string;
    };
    destination: {
      id: string;
      name: string;
    };
    skillGap: SkillGapItem[];
    transferableSkills: SkillGapItem[];
  };
}

// Request Queue
export interface QueuedRequest<T> {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
}

// Cache
export interface CacheOptions {
  ttl: number;
}

export type CacheKey = string;
