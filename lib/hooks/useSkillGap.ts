/**
 * Lightcast hook - Fetches skill gap analysis between two occupations
 */

import { useState, useEffect } from 'react';
import type { SkillGapData } from '@/lib/data/types';

interface UseSkillGapParams {
  sourceId: string;
  destinationId: string;
  enabled?: boolean;
}

interface UseSkillGapResult {
  data: SkillGapData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSkillGap({
  sourceId,
  destinationId,
  enabled = true,
}: UseSkillGapParams): UseSkillGapResult {
  const [data, setData] = useState<SkillGapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!enabled || !sourceId || !destinationId) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/lightcast/career-pathways/skill-gap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sourceId, destinationId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch skill gap data');
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
  }, [sourceId, destinationId, enabled, refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
}
