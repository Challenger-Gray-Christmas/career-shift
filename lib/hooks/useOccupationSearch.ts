/**
 * Lightcast hook - Debounced occupation search with autocomplete
 */

import { useState, useEffect, useCallback } from 'react';

interface OccupationSearchResult {
  id: string;
  name: string;
}

interface UseOccupationSearchResult {
  results: OccupationSearchResult[];
  loading: boolean;
  error: string | null;
}

export function useOccupationSearch(query: string, debounceMs = 300): UseOccupationSearchResult {
  const [results, setResults] = useState<OccupationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/lightcast/occupations/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error('Failed to search occupations');
      }

      const data = await response.json();
      setResults(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, search]);

  return { results, loading, error };
}
