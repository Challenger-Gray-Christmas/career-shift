"use client";

import { useState, useEffect } from "react";

interface UseOccupationIdOptions {
  occupationName: string;
  enabled?: boolean;
}

interface UseOccupationIdResult {
  id: string | null;
  name: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Lightcast hook - Converts occupation name to LOT ID
 */
export function useOccupationId({
  occupationName,
  enabled = true,
}: UseOccupationIdOptions): UseOccupationIdResult {
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !occupationName) {
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function fetchOccupationId() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/lightcast/occupations/search?q=${encodeURIComponent(occupationName)}`
        );

        if (!response.ok) {
          throw new Error("Failed to search occupation");
        }

        const result = await response.json();

        if (isCancelled) return;

        if (result.data && result.data.length > 0) {
          setId(result.data[0].id);
          setName(result.data[0].name);
        } else {
          setError("Occupation not found");
        }
      } catch (err) {
        if (isCancelled) return;
        setError(err instanceof Error ? err.message : "Failed to search occupation");
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchOccupationId();

    return () => {
      isCancelled = true;
    };
  }, [occupationName, enabled]);

  return { id, name, loading, error };
}
