import type { EmergingDemandRow, StateMetric } from "@/types";

export const STATES = [
  "Gujarat",
  "Maharashtra",
  "Tamil Nadu",
  "Karnataka",
  "Uttar Pradesh",
] as const;

export const DISTRICTS: Record<string, string[]> = {
  Gujarat: ["Ahmedabad", "Gandhinagar", "Dholera", "Sanand", "Vadodara", "Kutch"],
  Maharashtra: ["Pune", "Chhatrapati Sambhajinagar", "Nashik", "Thane"],
  "Tamil Nadu": ["Chennai", "Krishnagiri", "Hosur"],
  Karnataka: ["Bengaluru Urban", "Bengaluru Rural"],
  "Uttar Pradesh": ["Gautam Buddha Nagar", "Noida"],
};

export const stateMetrics: StateMetric[] = [
  { state: "Gujarat", code: "GJ", demand: 420000, capability: 280000, gap: 140000, training: 95000 },
  { state: "Maharashtra", code: "MH", demand: 510000, capability: 340000, gap: 170000, training: 120000 },
  { state: "Tamil Nadu", code: "TN", demand: 380000, capability: 260000, gap: 120000, training: 110000 },
  { state: "Karnataka", code: "KA", demand: 350000, capability: 290000, gap: 60000, training: 98000 },
  { state: "Uttar Pradesh", code: "UP", demand: 480000, capability: 220000, gap: 260000, training: 85000 },
  { state: "Rajasthan", code: "RJ", demand: 180000, capability: 110000, gap: 70000, training: 45000 },
  { state: "Telangana", code: "TS", demand: 210000, capability: 160000, gap: 50000, training: 72000 },
  { state: "Andhra Pradesh", code: "AP", demand: 190000, capability: 120000, gap: 70000, training: 55000 },
  { state: "West Bengal", code: "WB", demand: 160000, capability: 100000, gap: 60000, training: 40000 },
  { state: "Haryana", code: "HR", demand: 140000, capability: 95000, gap: 45000, training: 38000 },
];

export const districtMetricsGujarat = [
  { district: "Ahmedabad", demand: 820, capability: 330, gap: 490, training: 210 },
  { district: "Vadodara", demand: 540, capability: 330, gap: 210, training: 180 },
  { district: "Gandhinagar", demand: 310, capability: 160, gap: 150, training: 95 },
  { district: "Dholera", demand: 420, capability: 80, gap: 340, training: 40 },
  { district: "Sanand", demand: 190, capability: 110, gap: 80, training: 70 },
  { district: "Kutch", demand: 120, capability: 60, gap: 60, training: 35 },
];

export const emergingDemand: EmergingDemandRow[] = [
  {
    sector: "Electronics & Semiconductor",
    occupation: "Process Technician",
    geography: "Gujarat · Dholera",
    growthPct: 42,
    timeline: "18 months",
    confidence: 72,
    confidenceLevel: "Medium",
  },
  {
    sector: "Automotive / EV",
    occupation: "EV Technician",
    geography: "Maharashtra · Pune",
    growthPct: 38,
    timeline: "12 months",
    confidence: 78,
    confidenceLevel: "High",
  },
  {
    sector: "Energy Storage",
    occupation: "Battery Assembly Operator",
    geography: "Tamil Nadu · Hosur",
    growthPct: 35,
    timeline: "18 months",
    confidence: 70,
    confidenceLevel: "Medium",
  },
  {
    sector: "Green Energy",
    occupation: "Hydrogen Plant Operator",
    geography: "Gujarat · Kutch",
    growthPct: 28,
    timeline: "24 months",
    confidence: 65,
    confidenceLevel: "Medium",
  },
  {
    sector: "Electronics",
    occupation: "SMT Technician",
    geography: "UP · Noida",
    growthPct: 31,
    timeline: "12 months",
    confidence: 80,
    confidenceLevel: "High",
  },
  {
    sector: "Renewable Energy",
    occupation: "Solar Module Technician",
    geography: "Tamil Nadu · Chennai",
    growthPct: 24,
    timeline: "12 months",
    confidence: 74,
    confidenceLevel: "Medium",
  },
  {
    sector: "IT Infrastructure",
    occupation: "Data Centre Technician",
    geography: "Maharashtra · Navi Mumbai",
    growthPct: 22,
    timeline: "12 months",
    confidence: 76,
    confidenceLevel: "High",
  },
  {
    sector: "Defence & Aerospace",
    occupation: "Avionics Maintenance Tech",
    geography: "Karnataka · Bengaluru",
    growthPct: 19,
    timeline: "18 months",
    confidence: 68,
    confidenceLevel: "Medium",
  },
];

export const SECTORS = [
  "Electronics & Semiconductor",
  "Automotive / EV",
  "Energy Storage",
  "Green Energy",
  "Renewable Energy",
  "IT / Digital Infrastructure",
  "Defence & Aerospace",
];
