import { delay, randomLatency } from "@/lib/utils";
import { economicEvents } from "@/data/events";
import { emergingDemand, stateMetrics, districtMetricsGujarat } from "@/data/geography";
import {
  capabilityKPIs,
  districtCapability,
  workers,
  occupationMix,
  hiringRamp,
  skillsNeeded,
} from "@/data/capability";
import { trainingCentres, trainingKPIs, convertibleCapacity } from "@/data/training";
import {
  alerts,
  seedPlans,
  implementationFunnel,
  weeklyEnrollment,
  outcomeDrivers,
  forecastVsActual,
  transformationPaths,
  defaultEvidence,
} from "@/data/plans";
import {
  adminUsers,
  permissionMatrix,
  dataSources,
  modelVersions,
  skillOntology,
  occupationMapping,
} from "@/data/admin";
import type { EconomicEvent, ActivationPlan } from "@/types";

async function simulate<T>(data: T): Promise<T> {
  await delay(randomLatency());
  return data;
}

export const api = {
  getEvents: () => simulate([...economicEvents]),
  getEvent: async (id: string) => {
    await delay(randomLatency());
    return economicEvents.find((e) => e.id === id) ?? null;
  },
  getControlRoom: () =>
    simulate({
      kpis: {
        emergingDemandPct: 18,
        workforceRequired: 2_400_000,
        deployable: 1_300_000,
        transformable: 620_000,
        residualGap: 480_000,
        trainingCapacity: 710_000,
        activePlans: 126,
        forecastConfidence: 78,
      },
      stateMetrics,
      districtMetricsGujarat,
      emergingDemand,
      alerts,
      sparklines: {
        emerging: [12, 13, 14, 15, 16, 17, 18],
        required: [2.1, 2.15, 2.2, 2.25, 2.3, 2.35, 2.4],
        deployable: [1.1, 1.15, 1.18, 1.22, 1.25, 1.28, 1.3],
        transformable: [0.5, 0.52, 0.55, 0.58, 0.6, 0.61, 0.62],
        gap: [0.55, 0.53, 0.52, 0.5, 0.49, 0.485, 0.48],
        training: [0.6, 0.62, 0.65, 0.67, 0.69, 0.7, 0.71],
        plans: [90, 98, 105, 112, 118, 122, 126],
        confidence: [70, 72, 73, 74, 76, 77, 78],
      },
    }),
  getEventAnalysis: (id: string) =>
    simulate({
      event: economicEvents.find((e) => e.id === id) ?? economicEvents[0],
      forecast: { low: 2100, base: 2400, high: 2700, confidence: 72, confidenceLevel: "Medium" as const },
      occupationMix,
      hiringRamp,
      skillsNeeded,
      evidence: defaultEvidence,
      assumptions: [
        "Project operational by Q3 2027",
        "Hiring ramp of 6 months to steady state",
        "Regional labour elasticity held constant",
      ],
    }),
  getCapability: () =>
    simulate({
      kpis: capabilityKPIs,
      districts: districtCapability,
      workers,
      gap: { demand: 2400, direct: 620, transformable: 1010, residual: 770 },
    }),
  getWorker: async (id: string) => {
    await delay(randomLatency());
    return workers.find((w) => w.id === id) ?? workers[0];
  },
  getTransformation: () =>
    simulate({
      from: "Industrial Electrician",
      to: "Automation Technician",
      has: ["Electrical Systems", "Troubleshooting", "Industrial Safety"],
      missing: ["PLC", "Automation"],
      bridge: ["PLC Fundamentals", "Industrial Automation", "Control Systems"],
      paths: transformationPaths,
      ontology: [
        { id: "elec", label: "Electrical Systems" },
        { id: "plc", label: "PLC" },
        { id: "auto", label: "Automation" },
        { id: "safe", label: "Industrial Safety" },
        { id: "ctrl", label: "Control Systems" },
      ],
      edges: [
        ["elec", "plc"],
        ["elec", "safe"],
        ["plc", "auto"],
        ["auto", "ctrl"],
      ] as [string, string][],
    }),
  getTraining: () =>
    simulate({
      kpis: trainingKPIs,
      centres: trainingCentres,
      convertible: convertibleCapacity,
    }),
  getPlans: () => simulate([...seedPlans] as ActivationPlan[]),
  generatePlan: async () => {
    await delay(2200);
    return seedPlans[0];
  },
  getImplementation: () =>
    simulate({
      funnel: implementationFunnel,
      weekly: weeklyEnrollment,
      districts: [
        { district: "Ahmedabad", enrolled: 160, completed: 110, placed: 85 },
        { district: "Vadodara", enrolled: 200, completed: 150, placed: 120 },
        { district: "Gandhinagar", enrolled: 130, completed: 95, placed: 70 },
        { district: "Sanand", enrolled: 180, completed: 130, placed: 75 },
        { district: "Dholera", enrolled: 140, completed: 85, placed: 40 },
        { district: "Kutch", enrolled: 80, completed: 50, placed: 20 },
      ],
      batches: [
        { centre: "ITI Vadodara", course: "Automation", status: "On track", enrolled: 110, capacity: 150 },
        { centre: "SkillForge Gandhinagar", course: "PLC", status: "Delayed", enrolled: 55, capacity: 80 },
        { centre: "PMKK Ahmedabad East", course: "EV", status: "On track", enrolled: 62, capacity: 100 },
        { centre: "PMKK Sanand", course: "Maintenance", status: "Bottleneck", enrolled: 72, capacity: 120 },
      ],
      alerts: [
        "SkillForge Gandhinagar batch delayed by 2 weeks (trainer shortage)",
        "Dholera placement lagging — employer onboarding slot constrained",
      ],
    }),
  getOutcomes: () =>
    simulate({
      card: { forecast: 500, actual: 430, errorPct: -14 },
      series: forecastVsActual,
      drivers: outcomeDrivers,
    }),
  getAdmin: () =>
    simulate({
      users: adminUsers,
      permissions: permissionMatrix,
      dataSources,
      models: modelVersions,
      ontology: skillOntology,
      occupations: occupationMapping,
    }),
  createEvent: async (event: Partial<EconomicEvent>) => {
    await delay(randomLatency());
    return {
      ...economicEvents[0],
      ...event,
      id: `evt-${Date.now()}`,
    } as EconomicEvent;
  },
};
