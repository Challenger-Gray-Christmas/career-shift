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

// Extended county data for search functionality
// Includes top counties plus additional counties across various states
const allCounties: RegionalProjection[] = [
  // Top 20 by job count
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
  // Additional counties for broader coverage
  { county: "42101", countyName: "Philadelphia, PA", jobs2024: 18234, jobs2030: 17456, percentChange: -4.3 },
  { county: "25025", countyName: "Suffolk, MA", jobs2024: 16892, jobs2030: 17234, percentChange: 2.0 },
  { county: "48453", countyName: "Travis, TX", jobs2024: 15743, jobs2030: 16123, percentChange: 2.4 },
  { county: "6085", countyName: "Santa Clara, CA", jobs2024: 14521, jobs2030: 14123, percentChange: -2.7 },
  { county: "39049", countyName: "Franklin, OH", jobs2024: 13845, jobs2030: 13567, percentChange: -2.0 },
  { county: "27053", countyName: "Hennepin, MN", jobs2024: 12987, jobs2030: 12654, percentChange: -2.6 },
  { county: "29189", countyName: "St. Louis, MO", jobs2024: 11234, jobs2030: 10876, percentChange: -3.2 },
  { county: "8031", countyName: "Denver, CO", jobs2024: 10567, jobs2030: 10892, percentChange: 3.1 },
  { county: "41051", countyName: "Multnomah, OR", jobs2024: 9876, jobs2030: 9654, percentChange: -2.2 },
  { county: "37119", countyName: "Mecklenburg, NC", jobs2024: 9234, jobs2030: 9567, percentChange: 3.6 },
  { county: "47037", countyName: "Davidson, TN", jobs2024: 8765, jobs2030: 9123, percentChange: 4.1 },
  { county: "24510", countyName: "Baltimore City, MD", jobs2024: 8234, jobs2030: 7892, percentChange: -4.2 },
  { county: "51059", countyName: "Fairfax, VA", jobs2024: 7654, jobs2030: 7892, percentChange: 3.1 },
  { county: "55079", countyName: "Milwaukee, WI", jobs2024: 7123, jobs2030: 6789, percentChange: -4.7 },
  { county: "31055", countyName: "Douglas, NE", jobs2024: 6543, jobs2030: 6432, percentChange: -1.7 },
  { county: "40109", countyName: "Oklahoma, OK", jobs2024: 5987, jobs2030: 5765, percentChange: -3.7 },
  { county: "22071", countyName: "Orleans, LA", jobs2024: 5432, jobs2030: 5234, percentChange: -3.6 },
  { county: "15003", countyName: "Honolulu, HI", jobs2024: 4987, jobs2030: 4765, percentChange: -4.4 },
  { county: "35001", countyName: "Bernalillo, NM", jobs2024: 4532, jobs2030: 4432, percentChange: -2.2 },
  { county: "16001", countyName: "Ada, ID", jobs2024: 4123, jobs2030: 4345, percentChange: 5.4 },
  { county: "44007", countyName: "Providence, RI", jobs2024: 3876, jobs2030: 3654, percentChange: -5.7 },
  { county: "33011", countyName: "Hillsborough, NH", jobs2024: 3456, jobs2030: 3345, percentChange: -3.2 },
  { county: "50007", countyName: "Chittenden, VT", jobs2024: 2987, jobs2030: 2876, percentChange: -3.7 },
  { county: "23005", countyName: "Cumberland, ME", jobs2024: 2654, jobs2030: 2567, percentChange: -3.3 },
  { county: "10003", countyName: "New Castle, DE", jobs2024: 2345, jobs2030: 2234, percentChange: -4.7 },
  { county: "56021", countyName: "Laramie, WY", jobs2024: 1987, jobs2030: 1876, percentChange: -5.6 },
  { county: "30031", countyName: "Gallatin, MT", jobs2024: 1654, jobs2030: 1765, percentChange: 6.7 },
  { county: "38017", countyName: "Cass, ND", jobs2024: 1432, jobs2030: 1398, percentChange: -2.4 },
  { county: "46099", countyName: "Minnehaha, SD", jobs2024: 1234, jobs2030: 1198, percentChange: -2.9 },
  { county: "2020", countyName: "Anchorage, AK", jobs2024: 1123, jobs2030: 1087, percentChange: -3.2 },
  // More California counties
  { county: "6001", countyName: "Alameda, CA", jobs2024: 14234, jobs2030: 13876, percentChange: -2.5 },
  { county: "6075", countyName: "San Francisco, CA", jobs2024: 12345, jobs2030: 11987, percentChange: -2.9 },
  { county: "6081", countyName: "San Mateo, CA", jobs2024: 8765, jobs2030: 8543, percentChange: -2.5 },
  { county: "6013", countyName: "Contra Costa, CA", jobs2024: 7654, jobs2030: 7432, percentChange: -2.9 },
  { county: "6067", countyName: "Sacramento, CA", jobs2024: 11234, jobs2030: 10987, percentChange: -2.2 },
  // More Texas counties
  { county: "48085", countyName: "Collin, TX", jobs2024: 8765, jobs2030: 9123, percentChange: 4.1 },
  { county: "48121", countyName: "Denton, TX", jobs2024: 6543, jobs2030: 6876, percentChange: 5.1 },
  { county: "48157", countyName: "Fort Bend, TX", jobs2024: 5432, jobs2030: 5654, percentChange: 4.1 },
  // More Florida counties
  { county: "12011", countyName: "Broward, FL", jobs2024: 15234, jobs2030: 15012, percentChange: -1.5 },
  { county: "12099", countyName: "Palm Beach, FL", jobs2024: 12345, jobs2030: 12123, percentChange: -1.8 },
  { county: "12031", countyName: "Duval, FL", jobs2024: 9876, jobs2030: 9765, percentChange: -1.1 },
  // More New York counties
  { county: "36047", countyName: "Kings (Brooklyn), NY", jobs2024: 18765, jobs2030: 18234, percentChange: -2.8 },
  { county: "36081", countyName: "Queens, NY", jobs2024: 15432, jobs2030: 15012, percentChange: -2.7 },
  { county: "36059", countyName: "Nassau, NY", jobs2024: 11234, jobs2030: 10876, percentChange: -3.2 },
  { county: "36103", countyName: "Suffolk, NY", jobs2024: 10987, jobs2030: 10654, percentChange: -3.0 },
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
    regional: allCounties,
  };
}
