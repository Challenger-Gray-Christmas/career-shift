/**
 * Lightcast Company Jobs API - Fetches individual job postings by company
 * Returns actual job listings with titles, locations, and URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  lightcastClient,
  lightcastCache,
  CACHE_TTL,
  jobPostingsQueue,
} from '@/lib/api/lightcast';

interface JobPosting {
  id: string;
  title: string;
  company_name: string;
  city?: string;
  state?: string;
  posted_date?: string;
  url?: string;
  description?: string;
  salary?: {
    min?: number;
    max?: number;
    median?: number;
  };
}

interface JobPostingsResponse {
  data: JobPosting[] | any;
}

export async function POST(request: NextRequest) {
  let companyName: string = '';
  let occupationName: string | undefined;

  try {
    const body = await request.json();
    companyName = body.companyName;
    occupationName = body.occupationName;

    if (!companyName) {
      return NextResponse.json(
        { error: 'companyName is required' },
        { status: 400 }
      );
    }

    // Generate cache key
    const cacheKey = lightcastCache.generateKey('company-jobs', {
      companyName,
      occupationName: occupationName || 'all',
    });

    // Check cache first
    const cached = lightcastCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
      });
    }

    // Build filter for company and optional occupation
    // For /jpa/postings endpoint, use "active" for current postings
    const filter: any = {
      when: "active",
      company_name: [companyName],
    };

    // Add occupation filter if provided
    if (occupationName) {
      filter.lot_specialized_occupation_name = [occupationName];
    }

    // Fetch job postings with correct pagination format
    const response = await jobPostingsQueue.enqueue(() =>
      lightcastClient.request<JobPostingsResponse>('/jpa/postings', {
        method: 'POST',
        body: JSON.stringify({
          filter,
          page: 1,
          limit: 10,
        }),
      })
    );

    // Handle different response structures
    const jobs = Array.isArray(response.data)
      ? response.data
      : (response.data?.postings || response.data?.data || []);

    const result = {
      companyName,
      occupationName: occupationName || null,
      jobs: jobs.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        location: [job.city, job.state].filter(Boolean).join(', '),
        posted_date: job.posted_date,
        url: job.url,
        description: job.description,
      })),
      count: jobs.length,
    };

    // Cache for 10 minutes
    lightcastCache.set(cacheKey, result, CACHE_TTL.JOB_POSTINGS);

    return NextResponse.json({
      ...result,
      cached: false,
    });
  } catch (error) {
    console.error('Company jobs API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch company jobs';
    const statusCode = (error as any)?.status || 500;

    return NextResponse.json(
      {
        error: errorMessage,
        companyName,
        occupationName: occupationName || null,
      },
      { status: statusCode }
    );
  }
}
