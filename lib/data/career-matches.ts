import type { CareerMatch } from "./types";

export const careerMatches: CareerMatch[] = [
  {
    id: "sales-rep",
    title: "Sales Representative",
    matchPercent: 74,
    outlookPercent: 12,
    salaryRange: { min: 45000, max: 65000 },
    rationale: "Your communication and problem-solving skills transfer directly. Customer service reps often move into sales roles where relationship-building is key.",
    transferableSkills: [
      "Customer Communication",
      "Problem Resolution",
      "CRM Software",
      "Active Listening",
      "Product Knowledge",
      "Time Management",
    ],
    skillsGap: [
      {
        skill: "Sales Techniques",
        course: {
          title: "Sales Training: Techniques for a Human-Centric Sales Process",
          provider: "HubSpot Academy",
          duration: "4 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/sales-training-techniques-customers",
        },
      },
      {
        skill: "Negotiation",
        course: {
          title: "Successful Negotiation: Essential Strategies and Skills",
          provider: "University of Michigan",
          duration: "7 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/negotiation-skills",
        },
      },
      {
        skill: "Lead Generation",
        course: {
          title: "Sales Prospecting and Lead Generation",
          provider: "LinkedIn Learning",
          duration: "3 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/lead-generation",
        },
      },
    ],
  },
  {
    id: "admin-assistant",
    title: "Administrative Assistant",
    matchPercent: 71,
    outlookPercent: -5,
    salaryRange: { min: 38000, max: 52000 },
    rationale: "Your organizational skills and attention to detail from handling customer records translate well to administrative roles.",
    transferableSkills: [
      "Data Entry",
      "Multi-tasking",
      "Email Support",
      "Time Management",
      "Team Collaboration",
      "CRM Software",
    ],
    skillsGap: [
      {
        skill: "Calendar Management",
        course: {
          title: "Administrative Professional Tips",
          provider: "LinkedIn Learning",
          duration: "2 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/admin-professional",
        },
      },
      {
        skill: "Microsoft Office Suite",
        course: {
          title: "Microsoft Office Specialist Certification",
          provider: "Microsoft",
          duration: "6 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/microsoft-office",
        },
      },
    ],
  },
  {
    id: "hr-coordinator",
    title: "HR Coordinator",
    matchPercent: 68,
    outlookPercent: 8,
    salaryRange: { min: 45000, max: 58000 },
    rationale: "Your experience handling sensitive customer situations and conflict resolution applies directly to employee relations.",
    transferableSkills: [
      "Conflict De-escalation",
      "Active Listening",
      "Problem Resolution",
      "Team Collaboration",
      "Data Entry",
      "Email Support",
    ],
    skillsGap: [
      {
        skill: "HR Fundamentals",
        course: {
          title: "Human Resource Management: HR for People Managers",
          provider: "University of Minnesota",
          duration: "5 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/human-resources-management",
        },
      },
      {
        skill: "Employment Law Basics",
        course: {
          title: "Employment Law for Business",
          provider: "University of Colorado",
          duration: "4 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/employment-law",
        },
      },
      {
        skill: "HRIS Systems",
        course: {
          title: "HR Analytics Using Python",
          provider: "HRCI",
          duration: "3 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/hr-analytics",
        },
      },
    ],
  },
  {
    id: "account-manager",
    title: "Account Manager",
    matchPercent: 65,
    outlookPercent: 15,
    salaryRange: { min: 55000, max: 80000 },
    rationale: "Your customer relationship experience is the foundation of account management. This role focuses on maintaining and growing client relationships.",
    transferableSkills: [
      "Customer Communication",
      "Problem Resolution",
      "CRM Software",
      "Active Listening",
      "Product Knowledge",
    ],
    skillsGap: [
      {
        skill: "Account Strategy",
        course: {
          title: "Strategic Account Management",
          provider: "LinkedIn Learning",
          duration: "4 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/account-management",
        },
      },
      {
        skill: "Business Development",
        course: {
          title: "Business Development & B2B Sales",
          provider: "HubSpot Academy",
          duration: "5 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/business-development",
        },
      },
      {
        skill: "Financial Acumen",
        course: {
          title: "Finance for Non-Finance Professionals",
          provider: "Rice University",
          duration: "4 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/finance-for-non-finance",
        },
      },
    ],
  },
  {
    id: "insurance-agent",
    title: "Insurance Agent",
    matchPercent: 62,
    outlookPercent: 6,
    salaryRange: { min: 40000, max: 70000 },
    rationale: "Your ability to explain complex information simply and build trust with customers is essential for selling insurance products.",
    transferableSkills: [
      "Customer Communication",
      "Active Listening",
      "Problem Resolution",
      "Product Knowledge",
      "Phone Etiquette",
    ],
    skillsGap: [
      {
        skill: "Insurance Fundamentals",
        course: {
          title: "Introduction to Insurance",
          provider: "Insurance Institute",
          duration: "6 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/insurance-fundamentals",
        },
      },
      {
        skill: "State Licensing",
        course: {
          title: "Insurance License Exam Prep",
          provider: "Kaplan",
          duration: "8 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/insurance-license",
        },
      },
    ],
  },
  {
    id: "retail-manager",
    title: "Retail Manager",
    matchPercent: 60,
    outlookPercent: 3,
    salaryRange: { min: 42000, max: 62000 },
    rationale: "Your customer service experience combined with team collaboration prepares you for managing a retail team and store operations.",
    transferableSkills: [
      "Customer Communication",
      "Team Collaboration",
      "Problem Resolution",
      "Multi-tasking",
      "Time Management",
    ],
    skillsGap: [
      {
        skill: "People Management",
        course: {
          title: "Management Fundamentals",
          provider: "University of California, Irvine",
          duration: "4 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/management-fundamentals",
        },
      },
      {
        skill: "Inventory Management",
        course: {
          title: "Supply Chain and Inventory Management",
          provider: "Rutgers University",
          duration: "4 weeks",
          level: "Intermediate",
          url: "https://www.coursera.org/learn/inventory-management",
        },
      },
      {
        skill: "P&L Basics",
        course: {
          title: "Financial Statements for Managers",
          provider: "Wharton",
          duration: "3 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/financial-statements",
        },
      },
    ],
  },
  {
    id: "bank-teller",
    title: "Bank Teller",
    matchPercent: 58,
    outlookPercent: -12,
    salaryRange: { min: 32000, max: 42000 },
    rationale: "Your cash handling experience and customer service skills align well, though this field has declining job growth.",
    transferableSkills: [
      "Customer Communication",
      "Data Entry",
      "Multi-tasking",
      "Problem Resolution",
      "Active Listening",
    ],
    skillsGap: [
      {
        skill: "Banking Regulations",
        course: {
          title: "Banking Fundamentals",
          provider: "American Bankers Association",
          duration: "4 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/banking-fundamentals",
        },
      },
      {
        skill: "Financial Products",
        course: {
          title: "Personal & Family Financial Planning",
          provider: "University of Florida",
          duration: "5 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/financial-planning",
        },
      },
    ],
  },
  {
    id: "receptionist",
    title: "Receptionist",
    matchPercent: 55,
    outlookPercent: -9,
    salaryRange: { min: 30000, max: 40000 },
    rationale: "Your phone skills and professional communication transfer directly, but this role has fewer growth opportunities.",
    transferableSkills: [
      "Phone Etiquette",
      "Customer Communication",
      "Multi-tasking",
      "Email Support",
      "Data Entry",
    ],
    skillsGap: [
      {
        skill: "Office Administration",
        course: {
          title: "Office Administration Fundamentals",
          provider: "LinkedIn Learning",
          duration: "2 weeks",
          level: "Beginner",
          url: "https://www.coursera.org/learn/office-administration",
        },
      },
    ],
  },
];

export function getCareerMatches(): CareerMatch[] {
  return careerMatches;
}

export function getCareerMatchById(id: string): CareerMatch | undefined {
  return careerMatches.find((match) => match.id === id);
}
