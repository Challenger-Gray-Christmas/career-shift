/**
 * Lightcast Region Search API - Searches all regions by name and returns posting counts
 * Cache: 10min | Rate: 10 req/sec
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  lightcastClient,
  lightcastCache,
  CACHE_TTL,
  jobPostingsQueue,
  type JobPostingsRankingResponse,
} from '@/lib/api/lightcast';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, occupationName } = body as {
      query: string;
      occupationName: string;
    };

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'query must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (!occupationName) {
      return NextResponse.json(
        { error: 'occupationName is required' },
        { status: 400 }
      );
    }

    // Cache the full region list per occupation (not per query)
    // so different search terms reuse the same Lightcast response
    const allRegionsCacheKey = lightcastCache.generateKey('all-regions', {
      occupationName,
    });

    let allRegions = lightcastCache.get<{ name: string; unique_postings: number }[]>(allRegionsCacheKey);

    if (!allRegions) {
      // Same 18-month date range as the main job-postings route
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 18);

      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
      };

      const response = await jobPostingsQueue.enqueue(() =>
        lightcastClient.request<JobPostingsRankingResponse>('/jpa/rankings/city_name', {
          method: 'POST',
          body: JSON.stringify({
            filter: {
              when: {
                start: formatDate(startDate),
                end: formatDate(endDate),
              },
              lot_specialized_occupation_name: [occupationName],
            },
            rank: { by: 'unique_postings', limit: 390 },
          }),
        })
      );

      allRegions = response.data.ranking.buckets
        .filter((r) => {
          const nameLower = r.name.toLowerCase();
          return nameLower !== 'unclassified' && !nameLower.includes('unknown');
        })
        .map((r) => ({ name: r.name, unique_postings: r.unique_postings }));

      lightcastCache.set(allRegionsCacheKey, allRegions, CACHE_TTL.JOB_POSTINGS);
    }

    // Filter cached regions by search query
    const queryLower = query.toLowerCase();
    const matchingRegions = allRegions.filter((r) =>
      r.name.toLowerCase().includes(queryLower)
    );

    const result = {
      query,
      occupationName,
      regions: matchingRegions,
      totalMatches: matchingRegions.length,
    };

    return NextResponse.json({ ...result, cached: false });
  } catch (error) {
    console.error('Region search error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to search regions',
      },
      { status: 500 }
    );
  }
}
