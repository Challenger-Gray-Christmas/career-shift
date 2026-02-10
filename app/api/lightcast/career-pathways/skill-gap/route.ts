/**
 * Lightcast Skill Gap API - Analyzes skill gap between two occupations
 * Requires LOT IDs | Cache: 15min | Rate: 5 req/sec
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  lightcastClient,
  lightcastCache,
  CACHE_TTL,
  careerPathwaysQueue,
  type SkillGapResponse,
} from '@/lib/api/lightcast';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceId, destinationId } = body as { sourceId: string; destinationId: string };

    if (!sourceId || !destinationId) {
      return NextResponse.json(
        { error: 'sourceId and destinationId are required' },
        { status: 400 }
      );
    }

    // Generate cache key
    const cacheKey = lightcastCache.generateKey('skill-gap', { sourceId, destinationId });

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
      lightcastClient.request<SkillGapResponse>('/career-pathways/dimensions/lotspecocc/skillgap?lot_version=7', {
        method: 'POST',
        body: JSON.stringify({
          sourceId,
          destinationId,
          region: { nation: 'us' },
        }),
      })
    );

    // Transform to match existing SkillGapData interface
    const result = {
      source: { id: response.data.source.id, name: response.data.source.name },
      destination: { id: response.data.destination.id, name: response.data.destination.name },
      skillGap: (response.data.skillGap || []).map((skill: any) => ({
        id: skill.id || skill.name,
        name: skill.name,
        importanceScore: skill.importanceScore || 0,
      })),
      transferableSkills: (response.data.transferableSkills || []).map((skill: any) => ({
        id: skill.id || skill.name,
        name: skill.name,
        importanceScore: skill.importanceScore || 0,
      })),
    };

    // Cache for 15 minutes
    lightcastCache.set(cacheKey, result, CACHE_TTL.CAREER_PATHWAYS);

    return NextResponse.json({
      ...result,
      cached: false,
    });
  } catch (error) {
    console.error('Skill gap error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch skill gap data',
      },
      { status: 500 }
    );
  }
}
