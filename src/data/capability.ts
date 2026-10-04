import type { DistrictCapability, Worker } from "@/types";

export const capabilityKPIs = {
  total: 1630,
  direct: 620,
  oneStep: 540,
  twoStep: 470,
};

export const districtCapability: DistrictCapability[] = [
  { district: "Ahmedabad", state: "Gujarat", direct: 120, oneStep: 130, twoStep: 80, total: 330 },
  { district: "Vadodara", state: "Gujarat", direct: 180, oneStep: 90, twoStep: 60, total: 330 },
  { district: "Gandhinagar", state: "Gujarat", direct: 90, oneStep: 45, twoStep: 25, total: 160 },
  { district: "Sanand", state: "Gujarat", direct: 70, oneStep: 55, twoStep: 40, total: 165 },
  { district: "Dholera", state: "Gujarat", direct: 40, oneStep: 50, twoStep: 55, total: 145 },
  { district: "Kutch", state: "Gujarat", direct: 35, oneStep: 40, twoStep: 40, total: 115 },
  { district: "Pune", state: "Maharashtra", direct: 45, oneStep: 70, twoStep: 90, total: 205 },
  { district: "Nashik", state: "Maharashtra", direct: 40, oneStep: 60, twoStep: 80, total: 180 },
];

export const workers: Worker[] = [
  {
    id: "wrk-001",
    maskedId: "WRK-GJ-•••4821",
    name: "Amit Patel",
    occupation: "Industrial Electrician",
    experienceYears: 7,
    location: "Vadodara",
    district: "Vadodara",
    state: "Gujarat",
    verifiedSkills: ["Electrical Systems", "Industrial Safety", "Troubleshooting"],
    estimatedSkills: [
      {
        name: "PLC",
        low: 48,
        high: 57,
        confidence: "Medium",
        evidence: "Certification + work history",
      },
      {
        name: "Automation",
        low: 35,
        high: 48,
        confidence: "Medium",
        evidence: "Adjacent role exposure",
      },
    ],
    certifications: ["ITI Electrician", "NSQF Level 4 · Industrial Safety", "Basic First Aid"],
    trainingHistory: [
      { title: "Industrial Safety Refresher", date: "2025-11-12", provider: "PMKK Vadodara" },
      { title: "Electrical Systems Advanced", date: "2024-06-20", provider: "ITI Vadodara" },
      { title: "PLC Awareness Workshop", date: "2023-09-05", provider: "Skill India Hub" },
    ],
    workHistory: [
      { role: "Industrial Electrician", org: "Gujarat Auto Components", from: "2021", to: "Present" },
      { role: "Junior Electrician", org: "Baroda Power Services", from: "2018", to: "2021" },
      { role: "Apprentice Electrician", org: "ITI Vadodara Partner Co.", from: "2017", to: "2018" },
    ],
    transformationOptions: ["Automation Technician", "EV Technician", "Industrial Maintenance"],
    consent: { shareWithEmployers: true, trainingRecommendations: true },
    meta: {
      sourceType: "PARTNER",
      sourceName: "Skill India Digital + State DBT",
      timestamp: "2026-09-01T08:00:00+05:30",
      dataVersion: "dv-2026.09",
      confidence: 86,
      confidenceLevel: "High",
    },
  },
  {
    id: "wrk-002",
    maskedId: "WRK-GJ-•••3190",
    name: "Sneha Desai",
    occupation: "Maintenance Technician",
    experienceYears: 5,
    location: "Ahmedabad",
    district: "Ahmedabad",
    state: "Gujarat",
    verifiedSkills: ["Equipment Maintenance", "Quality Control", "Industrial Safety"],
    estimatedSkills: [
      {
        name: "PLC",
        low: 40,
        high: 52,
        confidence: "Medium",
        evidence: "Course certificate",
      },
    ],
    certifications: ["Diploma Mechanical", "NSQF Level 5"],
    trainingHistory: [
      { title: "Predictive Maintenance Basics", date: "2025-08-10", provider: "PMKK Ahmedabad" },
    ],
    workHistory: [
      { role: "Maintenance Technician", org: "Sanand Auto Park", from: "2020", to: "Present" },
    ],
    transformationOptions: ["Automation Technician", "Industrial Maintenance"],
    consent: { shareWithEmployers: true, trainingRecommendations: true },
    meta: {
      sourceType: "PUBLIC",
      sourceName: "NCVET Registry",
      timestamp: "2026-08-20T08:00:00+05:30",
      dataVersion: "dv-2026.08",
      confidence: 81,
      confidenceLevel: "High",
    },
  },
  {
    id: "wrk-003",
    maskedId: "WRK-GJ-•••7742",
    name: "Rahul Chauhan",
    occupation: "Fitter",
    experienceYears: 6,
    location: "Gandhinagar",
    district: "Gandhinagar",
    state: "Gujarat",
    verifiedSkills: ["Mechanical Fitting", "Blueprint Reading", "Industrial Safety"],
    estimatedSkills: [
      {
        name: "Process Operations",
        low: 45,
        high: 58,
        confidence: "Medium",
        evidence: "Shop-floor tenure",
      },
    ],
    certifications: ["ITI Fitter"],
    trainingHistory: [
      { title: "Lean Manufacturing Intro", date: "2025-03-14", provider: "GSDM Centre" },
    ],
    workHistory: [
      { role: "Fitter", org: "Gandhinagar Precision Works", from: "2019", to: "Present" },
    ],
    transformationOptions: ["Process Operator", "Industrial Maintenance"],
    consent: { shareWithEmployers: false, trainingRecommendations: true },
    meta: {
      sourceType: "SYNTHETIC",
      sourceName: "Workforce Graph (synthetic)",
      timestamp: "2026-09-10T08:00:00+05:30",
      dataVersion: "dv-2026.09",
      confidence: 70,
      confidenceLevel: "Medium",
    },
  },
  {
    id: "wrk-004",
    maskedId: "WRK-GJ-•••5518",
    name: "Kiran Solanki",
    occupation: "Welder",
    experienceYears: 8,
    location: "Sanand",
    district: "Sanand",
    state: "Gujarat",
    verifiedSkills: ["TIG/MIG Welding", "Industrial Safety", "Quality Control"],
    estimatedSkills: [
      {
        name: "Equipment Maintenance",
        low: 50,
        high: 62,
        confidence: "High",
        evidence: "Verified work history",
      },
    ],
    certifications: ["ITI Welder", "AWS Equivalent (India)"],
    trainingHistory: [
      { title: "Advanced Welding", date: "2024-11-01", provider: "ITI Sanand" },
    ],
    workHistory: [
      { role: "Senior Welder", org: "Sanand Fabricators", from: "2017", to: "Present" },
    ],
    transformationOptions: ["Industrial Maintenance", "EV Technician"],
    consent: { shareWithEmployers: true, trainingRecommendations: true },
    meta: {
      sourceType: "PARTNER",
      sourceName: "Employer Skill Passport",
      timestamp: "2026-09-05T08:00:00+05:30",
      dataVersion: "dv-2026.09",
      confidence: 84,
      confidenceLevel: "High",
    },
  },
];

export const occupationMix = [
  { occupation: "Technicians", count: 620, pct: 26 },
  { occupation: "Operators", count: 480, pct: 20 },
  { occupation: "Engineers", count: 310, pct: 13 },
  { occupation: "Maintenance", count: 290, pct: 12 },
  { occupation: "Other", count: 700, pct: 29 },
];

export const hiringRamp = [
  { month: "M1", hired: 40 },
  { month: "M2", hired: 80 },
  { month: "M3", hired: 140 },
  { month: "M4", hired: 220 },
  { month: "M5", hired: 320 },
  { month: "M6", hired: 450 },
  { month: "M7", hired: 620 },
  { month: "M8", hired: 820 },
  { month: "M9", hired: 1050 },
  { month: "M10", hired: 1320 },
  { month: "M11", hired: 1650 },
  { month: "M12", hired: 1900 },
  { month: "M13", hired: 2100 },
  { month: "M14", hired: 2250 },
  { month: "M15", hired: 2350 },
  { month: "M16", hired: 2400 },
  { month: "M17", hired: 2400 },
  { month: "M18", hired: 2400 },
];

export const skillsNeeded = [
  "PLC",
  "Industrial Safety",
  "Equipment Maintenance",
  "Automation",
  "Quality Control",
  "Process Operations",
];
