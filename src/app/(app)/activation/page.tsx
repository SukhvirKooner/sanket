"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { KPICard } from "@/components/shared/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill, SyntheticFooterBadge } from "@/components/shared/Badges";
import { LockButton } from "@/components/shared/LockButton";
import { ProcessingSteps } from "@/components/shared/ProcessingSteps";
import { formatCrore, formatLakh, formatNumber } from "@/lib/formatters";
import { useAppStore } from "@/store/useAppStore";
import { defaultEvidence, defaultAllocations } from "@/data/plans";
import { nowISO } from "@/lib/utils";

const OPT_STEPS = [
  "Loading seats, trainers, equipment constraints",
  "Encoding objective (cost + time + movement + gap)",
  "Solving MILP (OR-Tools simulator)",
  "Allocating districts → centres → batches",
  "Plan ready",
];

export default function ActivationPage() {
  const router = useRouter();
  const plans = useAppStore((s) => s.plans);
  const updatePlan = useAppStore((s) => s.updatePlan);
  const completeStep = useAppStore((s) => s.completeStep);
  const advanceDemo = useAppStore((s) => s.advanceDemo);
  const openEvidence = useAppStore((s) => s.openEvidence);
  const modelVersion = useAppStore((s) => s.modelVersion);
  const addAudit = useAppStore((s) => s.addAudit);
  const planCount = useAppStore((s) => s.activationPlanCount);

  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    api.getPlans().then(() => setLoading(false));
  }, []);

  const plan = plans.find((p) => p.id === "plan-semi-gj") ?? plans[0];

  if (loading) return <PageSkeleton />;

  if (optimizing) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-navy-900 p-4 text-white">
          <p className="text-xs text-saffron">Optimizer running (OR-Tools / MILP)</p>
          <p className="mt-1 text-sm">
            Minimize: training cost + activation time + movement cost + residual gap
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Subject to: seats, trainers, equipment, budget, worker availability, training duration,
            geography, demand, horizon
          </p>
        </div>
        <ProcessingSteps
          steps={OPT_STEPS}
          intervalMs={650}
          onComplete={() => {
            setOptimizing(false);
            setGenerated(true);
            completeStep("activation");
            advanceDemo();
            updatePlan(plan.id, {
              status: "Draft",
              allocations: defaultAllocations,
            });
            addAudit({
              action: "Activation plan generated",
              detail: plan.name,
              category: "plan",
              confidence: 78,
            });
            toast.success("Activation plan generated");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Activation Plans</h1>
          <p className="text-xs text-slate-500">
            Semiconductor Facility, Gujarat · Queue items: {planCount}
          </p>
        </div>
        <LockButton
          action="generatePlan"
          variant="saffron"
          onClick={() => setOptimizing(true)}
        >
          Generate Activation Plan
        </LockButton>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>All plans</CardTitle>
          <SyntheticFooterBadge />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Location</th>
                <th>Demand</th>
                <th>Gap</th>
                <th>Training</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.location}</td>
                  <td>{formatNumber(p.demand)}</td>
                  <td>{formatNumber(p.residual)}</td>
                  <td>{formatCrore(p.trainingCostCr)}</td>
                  <td>
                    <StatusPill status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {(generated || plan.allocations.length > 0) && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard label="Demand" value={formatNumber(plan.demand)} />
            <KPICard label="Directly deployable" value={formatNumber(plan.direct)} accent="green" />
            <KPICard label="Transformable" value={formatNumber(plan.transformable)} accent="saffron" />
            <KPICard label="Residual" value={formatNumber(plan.residual)} accent="red" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Allocation</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Workers</th>
                    <th>Track</th>
                    <th>Centre</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {(plan.allocations.length ? plan.allocations : defaultAllocations).map((a) => (
                    <tr key={a.id}>
                      <td>{a.district}</td>
                      <td>{a.workers}</td>
                      <td>{a.track}</td>
                      <td>{a.centre}</td>
                      <td>{a.durationWeeks} weeks</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <KPICard label="Workers activated" value={formatNumber(plan.workersActivated)} />
            <KPICard label="Training cost" value={formatCrore(plan.trainingCostCr)} />
            <KPICard label="Activation time" value={`${plan.activationMonths} months`} />
            <KPICard label="Movement cost" value={formatLakh(plan.movementCostL)} />
            <KPICard label="Remaining gap" value={formatNumber(plan.residual)} accent="red" />
            <KPICard label="Capacity utilization" value={`${plan.capacityUtilization}%`} accent="green" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Batch timeline (Gantt)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(plan.allocations.length ? plan.allocations : defaultAllocations).map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 text-xs">
                  <span className="w-24 shrink-0 font-medium">{a.district}</span>
                  <div className="relative h-6 flex-1 rounded bg-slate-100">
                    <div
                      className="absolute h-6 rounded bg-navy-800 text-[10px] leading-6 text-white"
                      style={{
                        left: `${i * 8}%`,
                        width: `${a.durationWeeks * 6}%`,
                        paddingLeft: 6,
                      }}
                    >
                      {a.track} · {a.durationWeeks}w
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                openEvidence({
                  title: "Why this activation plan?",
                  evidence: defaultEvidence,
                  assumptions: [
                    "Seats and trainers held constant over horizon",
                    "Worker willingness-to-train ≥ 70%",
                  ],
                  confidence: plan.confidence,
                  model: modelVersion,
                  timestamp: nowISO(),
                })
              }
            >
              Why?
            </Button>
            <Button variant="outline" onClick={() => router.push("/scenarios")}>
              Run Scenario
            </Button>
            <LockButton
              action="approve"
              variant="saffron"
              onClick={() => {
                updatePlan(plan.id, { status: "Pending approval" });
                addAudit({
                  action: "Sent for approval",
                  detail: plan.name,
                  category: "plan",
                });
                toast.success("Sent for approval");
                router.push("/approvals");
              }}
            >
              Send for Approval
            </LockButton>
          </div>
        </>
      )}
    </div>
  );
}
