export type Locale = "en" | "hi";

const dict = {
  appName: { en: "SANKET · Workforce Command Centre", hi: "संकेत · कार्यबल कमांड सेंटर" },
  ministry: {
    en: "Ministry of Skill Development & Entrepreneurship (Demo)",
    hi: "कौशल विकास और उद्यमिता मंत्रालय (डेमो)",
  },
  controlRoom: { en: "Control Room", hi: "कंट्रोल रूम" },
  economicSignals: { en: "Economic Signals", hi: "आर्थिक संकेत" },
  workforceDemand: { en: "Workforce Demand", hi: "कार्यबल मांग" },
  capabilityMap: { en: "Capability Map", hi: "क्षमता मानचित्र" },
  transformationLab: { en: "Transformation Lab", hi: "रूपांतरण प्रयोगशाला" },
  trainingCapacity: { en: "Training Capacity", hi: "प्रशिक्षण क्षमता" },
  activationPlans: { en: "Activation Plans", hi: "सक्रियण योजनाएँ" },
  scenarioLab: { en: "Scenario Lab", hi: "परिदृश्य प्रयोगशाला" },
  approvals: { en: "Approvals", hi: "अनुमोदन" },
  implementation: { en: "Implementation", hi: "कार्यान्वयन" },
  outcomes: { en: "Outcomes", hi: "परिणाम" },
  evidenceAudit: { en: "Evidence & Audit", hi: "साक्ष्य और लेखापरीक्षा" },
  administration: { en: "Administration", hi: "प्रशासन" },
  emergingDemand: { en: "Emerging demand", hi: "उभरती मांग" },
  workforceRequired: { en: "Workforce required", hi: "आवश्यक कार्यबल" },
  deployableCapability: { en: "Deployable capability", hi: "तैनात योग्य क्षमता" },
  transformableCapability: { en: "Transformable capability", hi: "रूपांतरणीय क्षमता" },
  residualGap: { en: "Residual gap", hi: "शेष अंतर" },
  trainingCapacityKpi: { en: "Training capacity", hi: "प्रशिक्षण क्षमता" },
  activePlans: { en: "Active plans", hi: "सक्रिय योजनाएँ" },
  forecastConfidence: { en: "Forecast confidence", hi: "पूर्वानुमान विश्वास" },
  workflowProgress: { en: "Workflow progress", hi: "कार्यप्रवाह प्रगति" },
  guidedDemo: { en: "Guided demo", hi: "मार्गदर्शित डेमो" },
  logout: { en: "Log out", hi: "लॉग आउट" },
  switchRole: { en: "Switch role", hi: "भूमिका बदलें" },
  syntheticBadge: { en: "SYNTHETIC DATA · Demo", hi: "सिंथेटिक डेटा · डेमो" },
  notPermitted: { en: "Not permitted for your role", hi: "आपकी भूमिका के लिए अनुमति नहीं" },
  geography: { en: "Geography", hi: "भूगोल" },
  sector: { en: "Sector", hi: "क्षेत्र" },
  timeHorizon: { en: "Time horizon", hi: "समय क्षितिज" },
  confidence: { en: "Confidence", hi: "विश्वास" },
  verified: { en: "Verified", hi: "सत्यापित" },
  estimated: { en: "Estimated", hi: "अनुमानित" },
  whyForecast: { en: "Why this forecast?", hi: "यह पूर्वानुमान क्यों?" },
  approve: { en: "Approve", hi: "अनुमोदित करें" },
  modify: { en: "Modify", hi: "संशोधित करें" },
  reject: { en: "Reject", hi: "अस्वीकार करें" },
} as const;

export type I18nKey = keyof typeof dict;

export function t(key: I18nKey, locale: Locale): string {
  return dict[key][locale];
}

export const NAV_KEYS: { key: I18nKey; href: string; id: string }[] = [
  { key: "controlRoom", href: "/control-room", id: "control-room" },
  { key: "economicSignals", href: "/signals", id: "signals" },
  { key: "workforceDemand", href: "/signals/evt-semiconductor", id: "demand" },
  { key: "capabilityMap", href: "/capability", id: "capability" },
  { key: "transformationLab", href: "/transformation", id: "transformation" },
  { key: "trainingCapacity", href: "/training", id: "training" },
  { key: "activationPlans", href: "/activation", id: "activation" },
  { key: "scenarioLab", href: "/scenarios", id: "scenarios" },
  { key: "approvals", href: "/approvals", id: "approvals" },
  { key: "implementation", href: "/implementation", id: "implementation" },
  { key: "outcomes", href: "/outcomes", id: "outcomes" },
  { key: "evidenceAudit", href: "/evidence", id: "evidence" },
  { key: "administration", href: "/admin", id: "admin" },
];
