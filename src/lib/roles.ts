import type { Role } from "@/types";

export const ROLE_LABELS: Record<Role, string> = {
  government_planner: "Government Planner",
  training_authority: "Training Authority",
  employer: "Employer",
  administrator: "Administrator",
};

/** Sidebar nav IDs visible per role */
export const ROLE_NAV: Record<Role, string[]> = {
  government_planner: [
    "control-room",
    "signals",
    "demand",
    "capability",
    "transformation",
    "training",
    "activation",
    "scenarios",
    "approvals",
    "implementation",
    "outcomes",
    "evidence",
  ],
  training_authority: [
    "control-room",
    "transformation",
    "training",
    "activation",
    "implementation",
  ],
  employer: ["control-room", "signals", "capability", "implementation"],
  administrator: ["admin", "evidence"],
};

/** Actions restricted per role — show lock */
export const ROLE_ACTIONS: Record<Role, Record<string, boolean>> = {
  government_planner: {
    createEvent: true,
    analyse: true,
    approve: true,
    modify: true,
    reject: true,
    generatePlan: true,
    runScenario: true,
    recalibrate: true,
    revealWorker: true,
    editTraining: false,
    admin: false,
  },
  training_authority: {
    createEvent: false,
    analyse: false,
    approve: false,
    modify: false,
    reject: false,
    generatePlan: false,
    runScenario: false,
    recalibrate: false,
    revealWorker: false,
    editTraining: true,
    admin: false,
  },
  employer: {
    createEvent: true,
    analyse: false,
    approve: false,
    modify: false,
    reject: false,
    generatePlan: false,
    runScenario: false,
    recalibrate: false,
    revealWorker: false,
    editTraining: false,
    admin: false,
  },
  administrator: {
    createEvent: false,
    analyse: false,
    approve: false,
    modify: false,
    reject: false,
    generatePlan: false,
    runScenario: false,
    recalibrate: false,
    revealWorker: false,
    editTraining: false,
    admin: true,
  },
};

export function canAccess(role: Role, navId: string): boolean {
  return ROLE_NAV[role].includes(navId);
}

export function canAct(role: Role, action: string): boolean {
  return ROLE_ACTIONS[role][action] ?? false;
}

export const DEMO_USERS: Record<Role, { name: string; email: string; org: string }> = {
  government_planner: {
    name: "Ananya Sharma",
    email: "ananya.sharma@msde.gov.in",
    org: "MSDE · Planning Cell",
  },
  training_authority: {
    name: "Ravi Mehta",
    email: "ravi.mehta@gujarat-skill.gov.in",
    org: "Gujarat Skill Development Mission",
  },
  employer: {
    name: "Priya Nair",
    email: "priya.nair@dholera-semi.in",
    org: "Dholera Semi Fab Pvt Ltd",
  },
  administrator: {
    name: "Suresh Iyer",
    email: "suresh.iyer@sanket.gov.in",
    org: "SANKET Platform Ops",
  },
};
