/**
 * Hook to fetch job postings for a specific company
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

interface CompanyJobsData {
  companyName: string;
  occupationName: string | null;
  jobs: JobPosting[];
  count: number;
}

interface UseCompanyJobsParams {
  companyName: string;
  occupationName?: string;
  enabled?: boolean;
}

interface UseCompanyJobsResult {
  data: CompanyJobsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCompanyJobs({
  companyName,
  occupationName,
  enabled = true,
}: UseCompanyJobsParams): UseCompanyJobsResult {
  const [data, setData] = useState<CompanyJobsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!enabled || !companyName) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/lightcast/company-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyName, occupationName }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch company jobs');
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
  }, [companyName, occupationName, enabled, refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
}
