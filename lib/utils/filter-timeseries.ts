/**
 * Filters timeseries data to exclude the current month.
 * Returns data only through the last complete month.
 */
export function filterCurrentMonth<T extends { month: string[]; values: number[] }>(
  timeseries: T
): T {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const filteredIndices: number[] = [];
  timeseries.month.forEach((month, index) => {
    if (month !== currentMonth) {
      filteredIndices.push(index);
    }
  });

  return {
    ...timeseries,
    month: filteredIndices.map((i) => timeseries.month[i]),
    values: filteredIndices.map((i) => timeseries.values[i]),
  } as T;
}
