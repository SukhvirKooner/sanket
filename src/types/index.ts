export type Role =
  | "government_planner"
  | "training_authority"
  | "employer"
  | "administrator";

export type SourceType = "PUBLIC" | "PARTNER" | "SYNTHETIC";
export type ConfidenceLevel = "High" | "Medium" | "Low";
export type PlanStatus =
  | "Draft"
  | "Pending approval"
  | "Approved"
  | "In progress"
  | "Rejected"
  | "Modified";

export type WorkflowStep =
  | "signal"
  | "demand"
  | "capability"
  | "gap"
  | "transformation"
  | "training"
  | "activation"
  | "scenario"
  | "approval"
  | "monitoring"
  | "outcome"
  | "recalibration";

export interface DataMeta {
  sourceType: SourceType;
  sourceName: string;
  timestamp: string;
  dataVersion: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  org: string;
}

export interface EconomicEvent {
  id: string;
  name: string;
  sector: string;
  state: string;
  district: string;
  location: string;
  investmentCr: number;
  projectType: string;
  expectedStart: string;
  operationalDate: string;
  operationalMonths: number;
  technology: string;
  employer: string;
  expectedHiring: number;
  workforceImpact: "HIGH" | "MEDIUM" | "LOW";
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  meta: DataMeta;
  ownerId?: string;
}

export interface ForecastRange {
  low: number;
  base: number;
  high: number;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
}

export interface OccupationMixItem {
  occupation: string;
  count: number;
  pct: number;
}

export interface SkillChip {
  name: string;
  verified?: boolean;
}

export interface DistrictCapability {
  district: string;
  state: string;
  direct: number;
  oneStep: number;
  twoStep: number;
  total: number;
}

export interface Worker {
  id: string;
  maskedId: string;
  name: string;
  occupation: string;
  experienceYears: number;
  location: string;
  district: string;
  state: string;
  verifiedSkills: string[];
  estimatedSkills: { name: string; low: number; high: number; confidence: ConfidenceLevel; evidence: string }[];
  certifications: string[];
  trainingHistory: { title: string; date: string; provider: string }[];
  workHistory: { role: string; org: string; from: string; to: string }[];
  transformationOptions: string[];
  consent: { shareWithEmployers: boolean; trainingRecommendations: boolean };
  meta: DataMeta;
}

export interface TransformationPath {
  id: string;
  label: string;
  durationWeeks: number;
  demand: "High" | "Medium" | "Low";
  wagePotential: "Higher" | "High" | "Medium";
  confidence: ConfidenceLevel;
  cost: number;
  distanceKm: number;
  centresNearby: number;
  employerDemand: number;
  historicalSuccess: number;
  placementProbability: number;
  modules: string[];
}

export interface TrainingCentre {
  id: string;
  name: string;
  type: "ITI" | "PMKK" | "Private";
  course: string;
  seats: number;
  available: number;
  trainers: number;
  equipment: string[];
  durationWeeks: number;
  utilization: number;
  convertible: boolean;
  district: string;
  state: string;
  lat: number;
  lng: number;
  nextBatch: string;
  meta: DataMeta;
}

export interface AllocationRow {
  id: string;
  district: string;
  workers: number;
  track: string;
  centre: string;
  durationWeeks: number;
}

export interface ActivationPlan {
  id: string;
  name: string;
  eventId: string;
  location: string;
  demand: number;
  direct: number;
  transformable: number;
  residual: number;
  trainingCostCr: number;
  activationMonths: number;
  movementCostL: number;
  capacityUtilization: number;
  workersActivated: number;
  status: PlanStatus;
  allocations: AllocationRow[];
  confidence: number;
  meta: DataMeta;
}

export interface EvidenceItem {
  id: string;
  title: string;
  detail: string;
  sourceType: SourceType;
  sourceName: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  detail: string;
  user: string;
  role: Role;
  timestamp: string;
  modelVersion: string;
  category:
    | "recommendation"
    | "approval"
    | "modification"
    | "rejection"
    | "reveal"
    | "recalibration"
    | "plan"
    | "scenario"
    | "login";
  evidenceIds?: string[];
  assumptions?: string[];
  confidence?: number;
  originalRecommendation?: string;
  finalDecision?: string;
  modifiedValues?: Record<string, string | number>;
  reason?: string;
}

export interface AlertItem {
  id: string;
  severity: "warning" | "critical" | "info";
  message: string;
  href: string;
  state?: string;
}

export interface ScenarioResult {
  demand: number;
  direct: number;
  transformable: number;
  residual: number;
  cost: number;
  activationTime: number;
  utilization: number;
  unfilledDemand: number;
  unusedCapacity: number;
}

export interface SavedScenario {
  id: string;
  name: string;
  params: ScenarioParams;
  result: ScenarioResult;
  createdAt: string;
}

export interface ScenarioParams {
  demandPct: number;
  delayMonths: number;
  migration: "Low" | "Base" | "High";
  hiringVelocity: "Low" | "Base" | "High";
  capacityPct: number;
  investmentScale: number;
}

export interface StateMetric {
  state: string;
  demand: number;
  capability: number;
  gap: number;
  training: number;
  code: string;
}

export interface EmergingDemandRow {
  sector: string;
  occupation: string;
  geography: string;
  growthPct: number;
  timeline: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
}
