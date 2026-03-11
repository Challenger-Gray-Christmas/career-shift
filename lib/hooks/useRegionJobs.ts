/**
 * Hook to fetch job postings for a specific region/city
 */

import { useState, useEffect } from 'react';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  posted_date?: string;
  url?: string;
  description?: string;
}

interface RegionJobsData {
  regionName: string;
  occupationName: string | null;
  jobs: JobPosting[];
  count: number;
}

interface UseRegionJobsParams {
  regionName: string;
  occupationName?: string;
  enabled?: boolean;
}

interface UseRegionJobsResult {
  data: RegionJobsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRegionJobs({
  regionName,
  occupationName,
  enabled = true,
}: UseRegionJobsParams): UseRegionJobsResult {
  const [data, setData] = useState<RegionJobsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!enabled || !regionName) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/lightcast/region-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regionName, occupationName }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch region jobs');
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
  }, [regionName, occupationName, enabled, refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
}
