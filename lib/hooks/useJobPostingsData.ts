/**
 * Lightcast hook - Fetches job postings market data
 */

import { useState, useEffect } from 'react';
import type { JobPostingsData } from '@/lib/data/types';

interface UseJobPostingsDataParams {
  occupationName: string;
  enabled?: boolean;
}

interface UseJobPostingsDataResult {
  data: JobPostingsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useJobPostingsData({
  occupationName,
  enabled = true,
}: UseJobPostingsDataParams): UseJobPostingsDataResult {
  const [data, setData] = useState<JobPostingsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!enabled || !occupationName) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/lightcast/job-postings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ occupationName }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch job postings data');
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
  }, [occupationName, enabled, refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
}
