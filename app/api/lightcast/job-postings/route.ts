/**
 * Lightcast Job Postings API - Aggregates 6 parallel requests (salary, trends, regions, companies, education, titles)
 * Cache: 10min | Rate: 10 req/sec
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  lightcastClient,
  lightcastCache,
  CACHE_TTL,
  jobPostingsQueue,
  type JobPostingsTimeseriesResponse,
  type JobPostingsRankingResponse,
} from '@/lib/api/lightcast';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { occupationName } = body as { occupationName: string };

    if (!occupationName) {
      return NextResponse.json(
        { error: 'occupationName is required' },
        { status: 400 }
      );
    }

    // Generate cache key
    const cacheKey = lightcastCache.generateKey('job-postings', { occupationName });

    // Check cache first
    const cached = lightcastCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
      });
    }

    // Date range: last 90 days (API maximum)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Base filter for all requests
    const baseFilter = {
      when: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
      lot_specialized_occupation_name: [occupationName],
    };

    // Make 6 parallel requests (queued to respect rate limits)
    const [
      salaryTrendsRes,
      postingsTrendsRes,
      regionRankingRes,
      companyRankingRes,
      educationRankingRes,
      jobTitleRankingRes,
    ] = await Promise.all([
      // 1. Salary trends
      jobPostingsQueue.enqueue(() =>
        lightcastClient.request<JobPostingsTimeseriesResponse>('/jpa/timeseries', {
          method: 'POST',
          body: JSON.stringify({
            filter: baseFilter,
            metrics: ['unique_postings', 'median_salary'],
          }),
        })
      ),

      // 2. Postings trends
      jobPostingsQueue.enqueue(() =>
        lightcastClient.request<JobPostingsTimeseriesResponse>('/jpa/timeseries', {
          method: 'POST',
          body: JSON.stringify({
            filter: baseFilter,
            metrics: ['unique_postings'],
          }),
        })
      ),

      // 3. Top regions
      jobPostingsQueue.enqueue(() =>
        lightcastClient.request<JobPostingsRankingResponse>('/jpa/rankings/city_name', {
          method: 'POST',
          body: JSON.stringify({
            filter: baseFilter,
            rank: { by: 'unique_postings', limit: 20 },
          }),
        })
      ),

      // 4. Top companies
      jobPostingsQueue.enqueue(() =>
        lightcastClient.request<JobPostingsRankingResponse>('/jpa/rankings/company_name', {
          method: 'POST',
          body: JSON.stringify({
            filter: baseFilter,
            rank: { by: 'unique_postings', limit: 20 },
          }),
        })
      ),

      // 5. Education requirements
      jobPostingsQueue.enqueue(() =>
        lightcastClient.request<JobPostingsRankingResponse>('/jpa/rankings/min_edulevels_name', {
          method: 'POST',
          body: JSON.stringify({
            filter: baseFilter,
            rank: { by: 'unique_postings', limit: 10 },
          }),
        })
      ),

      // 6. Job titles
      jobPostingsQueue.enqueue(() =>
        lightcastClient.request<JobPostingsRankingResponse>('/jpa/rankings/title_name', {
          method: 'POST',
          body: JSON.stringify({
            filter: baseFilter,
            rank: { by: 'unique_postings', limit: 20 },
          }),
        })
      ),
    ]);

    // Helper function to filter out "Unclassified" entries from rankings
    const filterUnclassified = <T extends { name: string }>(items: T[]): T[] => {
      return items.filter((item) => item.name.toLowerCase() !== 'unclassified');
    };

    // Transform to match existing JobPostingsData interface
    const result = {
      occupation: occupationName,

      // Salary trend
      salaryTrend: {
        timeseries: {
          month: salaryTrendsRes.data.timeseries.day || [],
          values: salaryTrendsRes.data.timeseries.median_salary || [],
        },
        total: (salaryTrendsRes.data.timeseries.median_salary || []).reduce((sum: number, val: number) => sum + val, 0),
      },

      // Postings trend
      postingsTrend: {
        timeseries: {
          month: postingsTrendsRes.data.timeseries.day || [],
          values: postingsTrendsRes.data.timeseries.unique_postings || [],
        },
        total: (postingsTrendsRes.data.timeseries.unique_postings || []).reduce((sum: number, val: number) => sum + val, 0),
      },

      // Top regions (filtered)
      topRegions: filterUnclassified(regionRankingRes.data.ranking.buckets),

      // Top companies (filtered)
      topCompanies: filterUnclassified(
        companyRankingRes.data.ranking.buckets.map((bucket) => ({
          name: bucket.name,
          unique_postings: bucket.unique_postings,
          median_salary: bucket.median_salary || 0,
        }))
      ),

      // Education requirements (filtered)
      educationRequirements: filterUnclassified(
        educationRankingRes.data.ranking.buckets.map((bucket) => ({
          name: bucket.name,
          unique_postings: bucket.unique_postings,
        }))
      ),

      // Job titles (filtered)
      topTitles: filterUnclassified(
        jobTitleRankingRes.data.ranking.buckets.map((bucket) => ({
          name: bucket.name,
          unique_postings: bucket.unique_postings,
          median_salary: bucket.median_salary || 0,
        }))
      ),
    };

    // Cache for 10 minutes
    lightcastCache.set(cacheKey, result, CACHE_TTL.JOB_POSTINGS);

    return NextResponse.json({
      ...result,
      cached: false,
    });
  } catch (error) {
    console.error('Job postings error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch job postings data',
      },
      { status: 500 }
    );
  }
}
