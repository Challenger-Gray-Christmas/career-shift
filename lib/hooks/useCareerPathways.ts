/**
 * Lightcast hook - Fetches career pathways (advancement/feeder jobs)
 */

import { useState, useEffect } from 'react';
import type { CareerPathwaysData } from '@/lib/data/types';

interface UseCareerPathwaysParams {
  occupationId: string;
  enabled?: boolean;
}

interface UseCareerPathwaysResult {
  data: CareerPathwaysData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCareerPathways({
  occupationId,
  enabled = true,
}: UseCareerPathwaysParams): UseCareerPathwaysResult {
  const [data, setData] = useState<CareerPathwaysData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!enabled || !occupationId) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/lightcast/career-pathways', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ occupationId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch career pathways data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [occupationId, enabled, refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
}
