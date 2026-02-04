/**
 * Lightcast Occupation Search API - Returns LOT ID + name pairs
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  lightcastClient,
  lightcastCache,
  CACHE_TTL,
  jobPostingsQueue,
  type TaxonomiesResponse,
  type TaxonomyItem,
} from '@/lib/api/lightcast';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const cacheKey = lightcastCache.generateKey('occupations:search', { query });
    const cached = lightcastCache.get<TaxonomyItem[]>(cacheKey);

    if (cached) {
      return NextResponse.json({ data: cached, cached: true });
    }

    const allOccupationsCacheKey = 'occupations:all';
    let allOccupations = lightcastCache.get<TaxonomyItem[]>(allOccupationsCacheKey);

    if (!allOccupations) {
      allOccupations = await jobPostingsQueue.enqueue(async () => {
        const response = await lightcastClient.request<TaxonomiesResponse>(
          '/jpa/taxonomies/lot_specialized_occupation?limit=10000'
        );
        return response.data;
      });

      lightcastCache.set(allOccupationsCacheKey, allOccupations, CACHE_TTL.OCCUPATION_SEARCH);
    }

    const queryLower = query.toLowerCase();
    const filtered = allOccupations.filter((occupation) =>
      occupation.name.toLowerCase().includes(queryLower)
    );
    const results = filtered.slice(0, 20);

    lightcastCache.set(cacheKey, results, CACHE_TTL.OCCUPATION_SEARCH);

    return NextResponse.json({ data: results, cached: false });
  } catch (error) {
    console.error('Occupation search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search occupations' },
      { status: 500 }
    );
  }
}
