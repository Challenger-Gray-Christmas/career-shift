import type { JobPostingsData } from "./types";

const customerServiceRepData: JobPostingsData = {
  occupation: "Customer Service Representative (General)",
  salaryTrend: {
    timeseries: {
      month: [
        "2025-01",
        "2025-02",
        "2025-03",
        "2025-04",
        "2025-05",
        "2025-06",
        "2025-07",
        "2025-08",
        "2025-09",
        "2025-10",
        "2025-11",
        "2025-12",
        "2026-01",
      ],
      values: [
        40320, 40576, 40064, 40064, 40064, 40320, 40064, 39616, 39616, 39552,
        40576, 41600, 41600,
      ],
    },
    total: 40896,
  },
  postingsTrend: {
    timeseries: {
      month: [
        "2025-01",
        "2025-02",
        "2025-03",
        "2025-04",
        "2025-05",
        "2025-06",
        "2025-07",
        "2025-08",
        "2025-09",
        "2025-10",
        "2025-11",
        "2025-12",
        "2026-01",
      ],
      values: [
        89309, 90160, 92142, 96682, 91065, 89174, 104558, 107696, 102679,
        104396, 96014, 89052, 51262,
      ],
    },
    total: 529431,
  },
  topRegions: [
    { name: "New York-Newark-Jersey City, NY-NJ-PA", unique_postings: 42156 },
    { name: "Los Angeles-Long Beach-Anaheim, CA", unique_postings: 38924 },
    { name: "Chicago-Naperville-Elgin, IL-IN-WI", unique_postings: 28347 },
    { name: "Dallas-Fort Worth-Arlington, TX", unique_postings: 25891 },
    { name: "Miami-Fort Lauderdale-Pompano Beach, FL", unique_postings: 21543 },
    { name: "Phoenix-Mesa-Chandler, AZ", unique_postings: 19876 },
    { name: "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD", unique_postings: 18234 },
    { name: "Atlanta-Sandy Springs-Alpharetta, GA", unique_postings: 17654 },
    { name: "Boston-Cambridge-Newton, MA-NH", unique_postings: 16892 },
    { name: "Houston-The Woodlands-Sugar Land, TX", unique_postings: 15743 },
  ],
  topCompanies: [
    { name: "Amazon", unique_postings: 8945, median_salary: 42500 },
    { name: "Walmart", unique_postings: 7234, median_salary: 38000 },
    { name: "Target", unique_postings: 5621, median_salary: 39500 },
    { name: "CVS Health", unique_postings: 4892, median_salary: 41000 },
    { name: "Bank of America", unique_postings: 4156, median_salary: 45000 },
  ],
  educationRequirements: [
    { name: "High school diploma or GED", unique_postings: 312456 },
    { name: "Bachelor's degree", unique_postings: 98234 },
    { name: "Associate's degree", unique_postings: 45678 },
    { name: "No education listed", unique_postings: 73063 },
  ],
  topTitles: [
    { name: "Customer Service Representative", unique_postings: 215634, median_salary: 40500 },
    { name: "Customer Support Specialist", unique_postings: 87234, median_salary: 42000 },
    { name: "Call Center Representative", unique_postings: 65432, median_salary: 38500 },
    { name: "Client Services Representative", unique_postings: 54321, median_salary: 43500 },
    { name: "Customer Care Specialist", unique_postings: 48765, median_salary: 41000 },
  ],
};

export function getJobPostingsData(occupation: string): JobPostingsData | null {
  // For the prototype, return sample data for known occupation
  if (
    occupation.toLowerCase().includes("customer service") ||
    occupation.toLowerCase().includes("customer service representative")
  ) {
    return customerServiceRepData;
  }

  // Return default data for any occupation (for demo purposes)
  return {
    ...customerServiceRepData,
    occupation,
  };
}
