/**
 * Lightcast Occupation Search API - Returns LOT ID + name pairs
 * Supports fuzzy matching for better search results
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

interface ScoredOccupation extends TaxonomyItem {
  score: number;
}

/**
 * Fuzzy match scoring algorithm
 * - Exact match: highest score
 * - All words match: high score
 * - Partial word matches: medium score
 * - Word order bonus: slight bonus for matching word order
 */
function fuzzyScore(occupationName: string, query: string): number {
  const nameLower = occupationName.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match gets highest score
  if (nameLower === queryLower) {
    return 1000;
  }
  
  // Contains full query string
  if (nameLower.includes(queryLower)) {
    return 500 + (queryLower.length / nameLower.length) * 100;
  }
  
  // Split into words and score based on matches
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
  const nameWords = nameLower.split(/\s+/);
  
  if (queryWords.length === 0) return 0;
  
  let score = 0;
  let matchedWords = 0;
  let partialMatches = 0;
  
  for (const queryWord of queryWords) {
    // Check for exact word match
    if (nameWords.some(nw => nw === queryWord)) {
      matchedWords++;
      score += 50;
    }
    // Check for word starting with query word
    else if (nameWords.some(nw => nw.startsWith(queryWord))) {
      partialMatches++;
      score += 30;
    }
    // Check for word containing query word
    else if (nameWords.some(nw => nw.includes(queryWord))) {
      partialMatches++;
      score += 15;
    }
    // Check if any name word starts with query word (prefix match)
    else if (nameLower.includes(queryWord)) {
      partialMatches++;
      score += 10;
    }
  }
  
  // Bonus for matching most/all query words
  const matchRatio = (matchedWords + partialMatches * 0.5) / queryWords.length;
  score += matchRatio * 100;
  
  // Bonus for shorter occupation names (more specific matches)
  if (score > 0) {
    score += Math.max(0, 20 - nameWords.length);
  }
  
  return score;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const cacheKey = lightcastCache.generateKey('occupations:search:v2', { query: query.toLowerCase() });
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

    // Score all occupations with fuzzy matching
    const scored: ScoredOccupation[] = allOccupations
      .map((occupation) => ({
        ...occupation,
        score: fuzzyScore(occupation.name, query),
      }))
      .filter((o) => o.score > 0)
      .sort((a, b) => b.score - a.score);

    // Return top 20 results (remove score from response)
    const results: TaxonomyItem[] = scored.slice(0, 20).map(({ score, ...rest }) => rest);

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
