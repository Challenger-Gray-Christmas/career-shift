import type { ProjectedOutlookData, YearlyProjection, RegionalProjection } from "./types";

// National yearly totals (aggregated from 3,195 county records)
// Source: reference/Customer Service Reps - Regional Outlook.xls
const nationalTimeseries: YearlyProjection[] = [
  { year: 2020, jobs: 2836000 },
  { year: 2021, jobs: 2789000 },
  { year: 2022, jobs: 2845000 },
  { year: 2023, jobs: 2801000 },
  { year: 2024, jobs: 2654000 },
  { year: 2025, jobs: 2641000 },
  { year: 2026, jobs: 2625000 },
  { year: 2027, jobs: 2608000 },
  { year: 2028, jobs: 2591000 },
  { year: 2029, jobs: 2571000 },
  { year: 2030, jobs: 2553000 },
];

// Top 20 counties by 2024 job count
const topCounties: RegionalProjection[] = [
  { county: "4013", countyName: "Maricopa, AZ", jobs2024: 70131, jobs2030: 68551, percentChange: -2.3 },
  { county: "6037", countyName: "Los Angeles, CA", jobs2024: 50218, jobs2030: 47907, percentChange: -4.6 },
  { county: "48201", countyName: "Harris, TX", jobs2024: 51827, jobs2030: 51348, percentChange: -0.9 },
  { county: "17031", countyName: "Cook, IL", jobs2024: 51224, jobs2030: 48069, percentChange: -6.2 },
  { county: "48113", countyName: "Dallas, TX", jobs2024: 48329, jobs2030: 47525, percentChange: -1.7 },
  { county: "36061", countyName: "New York, NY", jobs2024: 44391, jobs2030: 45749, percentChange: 3.1 },
  { county: "12086", countyName: "Miami-Dade, FL", jobs2024: 30559, jobs2030: 30109, percentChange: -1.5 },
  { county: "48029", countyName: "Bexar, TX", jobs2024: 30004, jobs2030: 29081, percentChange: -3.1 },
  { county: "49035", countyName: "Salt Lake, UT", jobs2024: 28400, jobs2030: 28277, percentChange: -0.4 },
  { county: "13121", countyName: "Fulton, GA", jobs2024: 26646, jobs2030: 27224, percentChange: 2.2 },
  { county: "6073", countyName: "San Diego, CA", jobs2024: 25834, jobs2030: 25195, percentChange: -2.5 },
  { county: "6059", countyName: "Orange, CA", jobs2024: 24657, jobs2030: 23905, percentChange: -3.1 },
  { county: "53033", countyName: "King, WA", jobs2024: 22991, jobs2030: 23348, percentChange: 1.6 },
  { county: "4019", countyName: "Pima, AZ", jobs2024: 22416, jobs2030: 22196, percentChange: -1.0 },
  { county: "48439", countyName: "Tarrant, TX", jobs2024: 21896, jobs2030: 22017, percentChange: 0.6 },
  { county: "12095", countyName: "Orange, FL", jobs2024: 21467, jobs2030: 21802, percentChange: 1.6 },
  { county: "6071", countyName: "San Bernardino, CA", jobs2024: 20867, jobs2030: 20458, percentChange: -2.0 },
  { county: "32003", countyName: "Clark, NV", jobs2024: 20553, jobs2030: 20837, percentChange: 1.4 },
  { county: "26163", countyName: "Wayne, MI", jobs2024: 19628, jobs2030: 18527, percentChange: -5.6 },
  { county: "12057", countyName: "Hillsborough, FL", jobs2024: 19475, jobs2030: 19515, percentChange: 0.2 },
];

export function getProjectedOutlookData(): ProjectedOutlookData {
  const startJobs = nationalTimeseries[0].jobs;
  const endJobs = nationalTimeseries[nationalTimeseries.length - 1].jobs;
  const percentChange = ((endJobs - startJobs) / startJobs) * 100;

  return {
    occupation: "Customer Service Representative",
    national: {
      timeseries: nationalTimeseries,
      startJobs,
      endJobs,
      percentChange: Math.round(percentChange * 10) / 10,
    },
    regional: topCounties,
  };
}
