/**
 * Lightcast Career Pathways API - Fetches advancement and feeder jobs
 * Requires LOT ID | Cache: 15min | Rate: 5 req/sec
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  lightcastClient,
  lightcastCache,
  CACHE_TTL,
  careerPathwaysQueue,
  type CareerPathwaysResponse,
  type CareerPathwaysJob,
} from '@/lib/api/lightcast';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { occupationId } = body as { occupationId: string };

    if (!occupationId) {
      return NextResponse.json(
        { error: 'occupationId is required' },
        { status: 400 }
      );
    }

    // Generate cache key
    const cacheKey = lightcastCache.generateKey('career-pathways', { occupationId });

    // Check cache first
    const cached = lightcastCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
      });
    }

    // Queue the request to respect rate limits (5 req/sec)
    const response = await careerPathwaysQueue.enqueue(() =>
      lightcastClient.request<CareerPathwaysResponse>('/career-pathways/dimensions/lotspecocc/nextstepjobs?lot_version=7', {
        method: 'POST',
        body: JSON.stringify({
          id: occupationId,
          region: { nation: 'us' },
        }),
      })
    );

    // Categorize jobs based on category
    const feederJobs: CareerPathwaysJob[] = [];
    const advancementJobs: CareerPathwaysJob[] = [];

    response.data.pathways.forEach((job: CareerPathwaysJob) => {
      if (job.category === 'Similar' || job.category === 'LateralTransition') {
        feederJobs.push(job);
      } else if (job.category === 'Advancement' || job.category === 'LateralAdvancement') {
        advancementJobs.push(job);
      }
    });

    // Sort by score (descending)
    feederJobs.sort((a, b) => b.score - a.score);
    advancementJobs.sort((a, b) => b.score - a.score);

    const result = {
      id: response.data.id,
      name: response.data.name,
      jobLevel: response.data.jobLevel,
      meanSalary: response.data.meanSalary,
      feederJobs: feederJobs.slice(0, 20), // Top 20
      advancementJobs: advancementJobs.slice(0, 20), // Top 20
    };

    // Cache for 15 minutes
    lightcastCache.set(cacheKey, result, CACHE_TTL.CAREER_PATHWAYS);

    return NextResponse.json({
      ...result,
      cached: false,
    });
  } catch (error) {
    console.error('Career pathways error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch career pathways data',
      },
      { status: 500 }
    );
  }
}
