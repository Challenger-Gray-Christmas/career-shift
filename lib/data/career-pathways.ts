import type { CareerPathwaysData, SkillGapData } from "./types";

const dataScientistPathways: CareerPathwaysData = {
  id: "23111410",
  name: "Data Scientist",
  jobLevel: 6,
  meanSalary: 148325,
  feederJobs: [
    {
      id: "15119908",
      name: "Data Analyst",
      category: "Similar",
      score: 0.89,
      meanSalary: 75420,
      meanSalaryDiff: -72905,
      jobLevel: 4,
      jobLevelDiff: -2,
    },
    {
      id: "19309900",
      name: "Research Scientist",
      category: "LateralTransition",
      score: 0.82,
      meanSalary: 98750,
      meanSalaryDiff: -49575,
      jobLevel: 6,
      jobLevelDiff: 0,
    },
    {
      id: "15119909",
      name: "Data Analytics Manager",
      category: "LateralAdvancement",
      score: 0.78,
      meanSalary: 125000,
      meanSalaryDiff: -23325,
      jobLevel: 7,
      jobLevelDiff: 1,
    },
    {
      id: "15119910",
      name: "Analytics Product Manager",
      category: "LateralTransition",
      score: 0.75,
      meanSalary: 135000,
      meanSalaryDiff: -13325,
      jobLevel: 7,
      jobLevelDiff: 1,
    },
    {
      id: "15204300",
      name: "Statistician",
      category: "Similar",
      score: 0.72,
      meanSalary: 92150,
      meanSalaryDiff: -56175,
      jobLevel: 5,
      jobLevelDiff: -1,
    },
    {
      id: "13116100",
      name: "Marketing Analytics Specialist",
      category: "LateralTransition",
      score: 0.68,
      meanSalary: 78500,
      meanSalaryDiff: -69825,
      jobLevel: 4,
      jobLevelDiff: -2,
    },
    {
      id: "15119911",
      name: "Business Intelligence Analyst",
      category: "Similar",
      score: 0.65,
      meanSalary: 82300,
      meanSalaryDiff: -66025,
      jobLevel: 5,
      jobLevelDiff: -1,
    },
    {
      id: "15113200",
      name: "Data Engineer",
      category: "LateralTransition",
      score: 0.62,
      meanSalary: 125800,
      meanSalaryDiff: -22525,
      jobLevel: 6,
      jobLevelDiff: 0,
    },
  ],
  advancementJobs: [
    {
      id: "15119912",
      name: "Data Science Manager",
      category: "Advancement",
      score: 0.92,
      meanSalary: 185000,
      meanSalaryDiff: 36675,
      jobLevel: 8,
      jobLevelDiff: 2,
    },
    {
      id: "15119913",
      name: "NLP Engineer",
      category: "LateralAdvancement",
      score: 0.88,
      meanSalary: 165000,
      meanSalaryDiff: 16675,
      jobLevel: 7,
      jobLevelDiff: 1,
    },
    {
      id: "15119914",
      name: "Machine Learning Engineer",
      category: "LateralAdvancement",
      score: 0.85,
      meanSalary: 172500,
      meanSalaryDiff: 24175,
      jobLevel: 7,
      jobLevelDiff: 1,
    },
    {
      id: "15119915",
      name: "Generative AI Engineer",
      category: "Advancement",
      score: 0.82,
      meanSalary: 195000,
      meanSalaryDiff: 46675,
      jobLevel: 7,
      jobLevelDiff: 1,
    },
    {
      id: "15119916",
      name: "AI Engineer",
      category: "LateralAdvancement",
      score: 0.79,
      meanSalary: 178000,
      meanSalaryDiff: 29675,
      jobLevel: 7,
      jobLevelDiff: 1,
    },
    {
      id: "19309901",
      name: "Research Scientist",
      category: "LateralTransition",
      score: 0.76,
      meanSalary: 155000,
      meanSalaryDiff: 6675,
      jobLevel: 7,
      jobLevelDiff: 1,
    },
    {
      id: "15119917",
      name: "Data Analytics Manager",
      category: "Advancement",
      score: 0.73,
      meanSalary: 162000,
      meanSalaryDiff: 13675,
      jobLevel: 8,
      jobLevelDiff: 2,
    },
    {
      id: "15119918",
      name: "Deep Learning Engineer",
      category: "LateralAdvancement",
      score: 0.70,
      meanSalary: 185000,
      meanSalaryDiff: 36675,
      jobLevel: 7,
      jobLevelDiff: 1,
    },
  ],
};

const sampleSkillGap: SkillGapData = {
  source: { id: "23111410", name: "Data Scientist" },
  destination: { id: "15119915", name: "Generative AI Engineer" },
  skillGap: [
    { id: "SK001", name: "Large Language Modeling", importanceScore: 0.95 },
    { id: "SK002", name: "Generative AI", importanceScore: 0.92 },
    { id: "SK003", name: "Machine Learning", importanceScore: 0.88 },
    { id: "SK004", name: "Artificial Intelligence", importanceScore: 0.85 },
    { id: "SK005", name: "Deep Learning", importanceScore: 0.82 },
    { id: "SK006", name: "Natural Language Processing", importanceScore: 0.79 },
    { id: "SK007", name: "PyTorch", importanceScore: 0.75 },
    { id: "SK008", name: "TensorFlow", importanceScore: 0.72 },
    { id: "SK009", name: "Algorithms", importanceScore: 0.68 },
    { id: "SK010", name: "Software Engineering", importanceScore: 0.65 },
  ],
};

export function getCareerPathwaysData(
  occupationId: string
): CareerPathwaysData {
  // For the prototype, return sample data (Data Scientist pathways)
  // In production, this would fetch real data based on occupationId
  return dataScientistPathways;
}

export function getSkillGapData(
  sourceId: string,
  destinationId: string
): SkillGapData | null {
  // For the prototype, return sample skill gap data
  if (sourceId === "23111410" && destinationId === "15119915") {
    return sampleSkillGap;
  }

  // Return a generic skill gap for any source/destination combination (demo purposes)
  return {
    source: { id: sourceId, name: "Source Occupation" },
    destination: { id: destinationId, name: "Destination Occupation" },
    skillGap: sampleSkillGap.skillGap,
  };
}
