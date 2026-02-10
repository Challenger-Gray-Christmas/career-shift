/**
 * In-memory cache with scope-specific TTLs
 */

import NodeCache from 'node-cache';
import type { CacheKey } from './types';

export const CACHE_TTL = {
  JOB_POSTINGS: 10 * 60,
  CAREER_PATHWAYS: 15 * 60,
  OCCUPATION_SEARCH: 30 * 60,
  TOKEN: 55 * 60,
} as const;

class LightcastCache {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: CACHE_TTL.JOB_POSTINGS,
      checkperiod: 120,
      useClones: false,
    });
  }

  generateKey(endpoint: string, params: Record<string, unknown>): CacheKey {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, unknown>);

    return `${endpoint}:${JSON.stringify(sortedParams)}`;
  }

  get<T>(key: CacheKey): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: CacheKey, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || CACHE_TTL.JOB_POSTINGS);
  }

  delete(key: CacheKey): number {
    return this.cache.del(key);
  }

  clear(): void {
    this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }

  has(key: CacheKey): boolean {
    return this.cache.has(key);
  }
}

export const lightcastCache = new LightcastCache();
