/**
 * Filters timeseries data to exclude the current month.
 * Returns data only through the last complete month.
 * Works with both monthly ("2025-11") and daily ("2025-11-09") date formats.
 */
export function filterCurrentMonth<T extends { month: string[]; values: number[] }>(
  timeseries: T
): T {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const filteredIndices: number[] = [];
  timeseries.month.forEach((dateStr, index) => {
    // Extract month from date string (works for both "2025-11" and "2025-11-09")
    const dateMonth = dateStr.substring(0, 7); // Gets "2025-11" from either format
    if (dateMonth !== currentMonth) {
      filteredIndices.push(index);
    }
  });

  return {
    ...timeseries,
    month: filteredIndices.map((i) => timeseries.month[i]),
    values: filteredIndices.map((i) => timeseries.values[i]),
  } as T;
}
