"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Role,
  User,
  ActivationPlan,
  AuditEntry,
  EconomicEvent,
  SavedScenario,
  WorkflowStep,
  ScenarioParams,
} from "@/types";
import type { Locale } from "@/lib/i18n";
import { DEMO_USERS } from "@/lib/roles";
import { seedPlans } from "@/data/plans";
import { economicEvents } from "@/data/events";
import { uid, nowISO } from "@/lib/utils";

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  login: (role: Role, email?: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;

  // Locale & UI
  locale: Locale;
  setLocale: (l: Locale) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  stepperCollapsed: boolean;
  toggleStepper: () => void;
  guidedDemo: boolean;
  setGuidedDemo: (v: boolean) => void;
  demoStep: number;
  setDemoStep: (n: number) => void;
  advanceDemo: () => void;

  // Model
  modelVersion: string;
  setModelVersion: (v: string) => void;

  // Workflow
  completedSteps: WorkflowStep[];
  completeStep: (step: WorkflowStep) => void;
  currentWorkflowStep: WorkflowStep;
  setCurrentWorkflowStep: (s: WorkflowStep) => void;

  // Domain data
  events: EconomicEvent[];
  addEvent: (e: EconomicEvent) => void;
  plans: ActivationPlan[];
  updatePlan: (id: string, patch: Partial<ActivationPlan>) => void;
  setPlans: (plans: ActivationPlan[]) => void;
  activationPlanCount: number;
  incrementPlanItems: () => void;
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;

  // Evidence drawer
  evidenceOpen: boolean;
  evidencePayload: {
    title: string;
    evidence: { id: string; title: string; detail: string; sourceType: string; sourceName: string }[];
    assumptions: string[];
    confidence: number;
    model: string;
    timestamp: string;
  } | null;
  openEvidence: (payload: AppState["evidencePayload"]) => void;
  closeEvidence: () => void;

  // Audit
  auditLog: AuditEntry[];
  addAudit: (entry: Omit<AuditEntry, "id" | "timestamp" | "modelVersion" | "user" | "role"> & {
    user?: string;
    role?: Role;
    modelVersion?: string;
  }) => void;

  // Scenarios
  savedScenarios: SavedScenario[];
  saveScenario: (name: string, params: ScenarioParams, result: SavedScenario["result"]) => void;

  // Notifications
  notifications: { id: string; message: string; read: boolean }[];
  markNotificationsRead: () => void;

  // Worker reveal
  revealedWorkers: string[];
  revealWorker: (id: string) => void;
}

export const WORKFLOW_STEPS: { id: WorkflowStep; label: string; href: string }[] = [
  { id: "signal", label: "Signal", href: "/signals" },
  { id: "demand", label: "Demand Forecast", href: "/signals/evt-semiconductor" },
  { id: "capability", label: "Capability", href: "/capability" },
  { id: "gap", label: "Gap", href: "/capability" },
  { id: "transformation", label: "Transformation", href: "/transformation" },
  { id: "training", label: "Training Capacity", href: "/training" },
  { id: "activation", label: "Activation Plan", href: "/activation" },
  { id: "scenario", label: "Scenario", href: "/scenarios" },
  { id: "approval", label: "Approval", href: "/approvals" },
  { id: "monitoring", label: "Monitoring", href: "/implementation" },
  { id: "outcome", label: "Outcome", href: "/outcomes" },
  { id: "recalibration", label: "Recalibration", href: "/outcomes" },
];

export const DEMO_STEPS = [
  { title: "Start at Control Room", href: "/control-room", hint: "Open the Gujarat semiconductor alert" },
  { title: "Open Economic Signals", href: "/signals", hint: "Analyse the Semiconductor Fabrication Facility" },
  { title: "Review Event Analysis", href: "/signals/evt-semiconductor", hint: "Open Why this forecast?" },
  { title: "Find Existing Workforce", href: "/capability", hint: "Open a worker from the district table" },
  { title: "Transformation Lab", href: "/transformation", hint: "Compare Path A vs B, add to plan" },
  { title: "Training Capacity", href: "/training", hint: "Inspect centres and convertible capacity" },
  { title: "Generate Activation Plan", href: "/activation", hint: "Run the optimizer" },
  { title: "Scenario Lab", href: "/scenarios", hint: "Run the stress-test preset" },
  { title: "Approve the Plan", href: "/approvals", hint: "Modify with reason, then Approve" },
  { title: "Implementation", href: "/implementation", hint: "Compare plan vs actual" },
  { title: "Outcome & Recalibrate", href: "/outcomes", hint: "Recalibrate to Demand Model v0.5" },
  { title: "Evidence & Audit", href: "/evidence", hint: "Confirm every step is logged" },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      login: (role, email) => {
        const demo = DEMO_USERS[role];
        const user: User = {
          id: `user-${role}`,
          name: demo.name,
          email: email || demo.email,
          role,
          org: demo.org,
        };
        set({ isAuthenticated: true, user });
        get().addAudit({
          action: "Login",
          detail: `Signed in as ${demo.name} (${role})`,
          category: "login",
          user: demo.name,
          role,
        });
      },
      logout: () => set({ isAuthenticated: false, user: null }),
      switchRole: (role) => {
        const demo = DEMO_USERS[role];
        set({
          user: {
            id: `user-${role}`,
            name: demo.name,
            email: demo.email,
            role,
            org: demo.org,
          },
        });
        get().addAudit({
          action: "Role switch",
          detail: `Switched demo role to ${role}`,
          category: "login",
        });
      },

      locale: "en",
      setLocale: (l) => set({ locale: l }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      stepperCollapsed: false,
      toggleStepper: () => set((s) => ({ stepperCollapsed: !s.stepperCollapsed })),
      guidedDemo: false,
      setGuidedDemo: (v) => set({ guidedDemo: v }),
      demoStep: 0,
      setDemoStep: (n) => set({ demoStep: n }),
      advanceDemo: () => set((s) => ({ demoStep: Math.min(s.demoStep + 1, DEMO_STEPS.length - 1) })),

      modelVersion: "Demand Model v0.4",
      setModelVersion: (v) => set({ modelVersion: v }),

      completedSteps: [],
      completeStep: (step) =>
        set((s) => ({
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
          currentWorkflowStep: step,
        })),
      currentWorkflowStep: "signal",
      setCurrentWorkflowStep: (s) => set({ currentWorkflowStep: s }),

      events: economicEvents,
      addEvent: (e) => set((s) => ({ events: [e, ...s.events] })),
      plans: seedPlans,
      updatePlan: (id, patch) =>
        set((s) => ({
          plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      setPlans: (plans) => set({ plans }),
      activationPlanCount: 0,
      incrementPlanItems: () => set((s) => ({ activationPlanCount: s.activationPlanCount + 1 })),
      selectedEventId: "evt-semiconductor",
      setSelectedEventId: (id) => set({ selectedEventId: id }),

      evidenceOpen: false,
      evidencePayload: null,
      openEvidence: (payload) => set({ evidenceOpen: true, evidencePayload: payload }),
      closeEvidence: () => set({ evidenceOpen: false }),

      auditLog: [],
      addAudit: (entry) => {
        const state = get();
        const record: AuditEntry = {
          id: uid("audit"),
          timestamp: nowISO(),
          modelVersion: entry.modelVersion ?? state.modelVersion,
          user: entry.user ?? state.user?.name ?? "System",
          role: entry.role ?? state.user?.role ?? "government_planner",
          action: entry.action,
          detail: entry.detail,
          category: entry.category,
          evidenceIds: entry.evidenceIds,
          assumptions: entry.assumptions,
          confidence: entry.confidence,
          originalRecommendation: entry.originalRecommendation,
          finalDecision: entry.finalDecision,
          modifiedValues: entry.modifiedValues,
          reason: entry.reason,
        };
        set((s) => ({ auditLog: [record, ...s.auditLog] }));
      },

      savedScenarios: [],
      saveScenario: (name, params, result) =>
        set((s) => ({
          savedScenarios: [
            { id: uid("scn"), name, params, result, createdAt: nowISO() },
            ...s.savedScenarios,
          ].slice(0, 3),
        })),

      notifications: [
        { id: "n1", message: "Semiconductor gap alert · Gujarat", read: false },
        { id: "n2", message: "Plan pending approval · EV Pune", read: false },
        { id: "n3", message: "Nashik training capacity underused", read: false },
      ],
      markNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      revealedWorkers: [],
      revealWorker: (id) =>
        set((s) => ({
          revealedWorkers: s.revealedWorkers.includes(id)
            ? s.revealedWorkers
            : [...s.revealedWorkers, id],
        })),
    }),
    {
      name: "sanket-demo-store",
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        user: s.user,
        locale: s.locale,
        modelVersion: s.modelVersion,
        completedSteps: s.completedSteps,
        plans: s.plans,
        events: s.events,
        auditLog: s.auditLog,
        guidedDemo: s.guidedDemo,
        demoStep: s.demoStep,
        activationPlanCount: s.activationPlanCount,
        revealedWorkers: s.revealedWorkers,
        savedScenarios: s.savedScenarios,
        selectedEventId: s.selectedEventId,
      }),
    }
  )
);
