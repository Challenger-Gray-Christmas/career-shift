/**
 * Hook to search Lightcast regions by name (debounced)
 * Searches beyond the preloaded top 20 regions
 */

import { useState, useEffect, useRef } from 'react';
import type { RegionRanking } from '@/lib/data/types';

interface UseRegionSearchParams {
  query: string;
  occupationName?: string;
  /** Region names already loaded (top 20) — these are excluded from results */
  preloadedRegionNames?: string[];
}

interface UseRegionSearchResult {
  results: RegionRanking[];
  loading: boolean;
  error: string | null;
}

export function useRegionSearch({
  query,
  occupationName,
  preloadedRegionNames = [],
}: UseRegionSearchParams): UseRegionSearchResult {
  const [results, setResults] = useState<RegionRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Only search if query is 2+ chars and we have an occupation
    if (query.length < 2 || !occupationName) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Debounce: 300ms
    const timer = setTimeout(async () => {
      // Abort any in-flight request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/lightcast/region-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, occupationName }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to search regions');
        }

        const data = await response.json();

        // Exclude regions already in the preloaded top 20
        const preloadedSet = new Set(
          preloadedRegionNames.map((n) => n.toLowerCase())
        );
        const newRegions = (data.regions || []).filter(
          (r: RegionRanking) => !preloadedSet.has(r.name.toLowerCase())
        );

        setResults(newRegions);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      abortControllerRef.current?.abort();
    };
  }, [query, occupationName, preloadedRegionNames]);

  return { results, loading, error };
}
