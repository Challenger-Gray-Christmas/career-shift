import type { QuestionnaireProfile } from "./types";

// Hardcoded Customer Service Representative profile for demo
export const demoProfile: QuestionnaireProfile = {
  name: "Sarah Mitchell",
  currentRole: "Customer Service Representative (General)",
  location: "Phoenix, AZ",
  email: "sarah.mitchell@example.com",
  skills: [
    "Customer Communication",
    "Problem Resolution",
    "CRM Software (Zendesk)",
    "Conflict De-escalation",
    "Active Listening",
    "Data Entry",
    "Multi-tasking",
    "Phone Etiquette",
    "Email Support",
    "Team Collaboration",
    "Time Management",
    "Product Knowledge",
  ],
  experience: [
    {
      company: "TechSupport Plus",
      jobTitle: "Senior Customer Service Representative",
      location: "Phoenix, AZ",
      startYear: "2021",
      endYear: "Present",
      responsibilities: "Handle escalated customer issues, mentor new team members, process refunds and returns, maintain 95%+ satisfaction rating.",
    },
    {
      company: "RetailCo",
      jobTitle: "Customer Service Representative",
      location: "Phoenix, AZ",
      startYear: "2018",
      endYear: "2021",
      responsibilities: "Answered 50+ calls daily, resolved billing inquiries, processed orders, maintained detailed records in CRM.",
    },
    {
      company: "QuickMart",
      jobTitle: "Cashier / Customer Service",
      location: "Tucson, AZ",
      startYear: "2016",
      endYear: "2018",
      responsibilities: "Processed transactions, handled customer complaints, managed returns desk.",
    },
  ],
  education: [
    {
      school: "Phoenix Community College",
      degree: "Associate of Arts in Business",
      location: "Phoenix, AZ",
      endYear: "2016",
    },
  ],
  certifications: [
    "Zendesk Support Administrator Certification",
    "Customer Service Excellence (ICMI)",
  ],
};

export function getQuestionnaireProfile(): QuestionnaireProfile {
  return demoProfile;
}
