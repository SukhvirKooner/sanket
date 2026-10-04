"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KPICard } from "@/components/shared/KPICard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LockButton } from "@/components/shared/LockButton";
import { formatCrore, formatNumber } from "@/lib/formatters";
import { useAppStore } from "@/store/useAppStore";
import { defaultAllocations } from "@/data/plans";

export default function ApprovalsPage() {
  const router = useRouter();
  const plans = useAppStore((s) => s.plans);
  const updatePlan = useAppStore((s) => s.updatePlan);
  const completeStep = useAppStore((s) => s.completeStep);
  const advanceTour = useAppStore((s) => s.advanceTour);
  const addAudit = useAppStore((s) => s.addAudit);
  const modelVersion = useAppStore((s) => s.modelVersion);

  const plan = plans.find((p) => p.id === "plan-semi-gj") ?? plans[0];
  const [mode, setMode] = useState<"none" | "modify" | "reject">("none");
  const [reason, setReason] = useState("");
  const [confirm, setConfirm] = useState<"approve" | "modify" | "reject" | null>(null);
  const [rows, setRows] = useState(
    (plan.allocations.length ? plan.allocations : defaultAllocations).map((a) => ({
      ...a,
    }))
  );

  const submit = (decision: "approve" | "modify" | "reject") => {
    if ((decision === "modify" || decision === "reject") && !reason.trim()) {
      toast.error("Reason is mandatory");
      return;
    }
    setConfirm(decision);
  };

  const finalize = () => {
    if (!confirm) return;
    const original = `Recommend activate ${plan.workersActivated} workers, residual ${plan.residual}, cost ${formatCrore(plan.trainingCostCr)}`;

    if (confirm === "reject") {
      updatePlan(plan.id, { status: "Rejected" });
      addAudit({
        action: "Plan rejected",
        detail: plan.name,
        category: "rejection",
        originalRecommendation: original,
        finalDecision: "REJECTED",
        reason,
        modelVersion,
      });
      toast.error("Plan rejected");
    } else if (confirm === "modify") {
      updatePlan(plan.id, {
        status: "Approved",
        allocations: rows,
      });
      addAudit({
        action: "Plan modified then approved",
        detail: plan.name,
        category: "modification",
        originalRecommendation: original,
        finalDecision: "APPROVED_WITH_MODIFICATIONS",
        reason,
        modifiedValues: Object.fromEntries(rows.map((r) => [r.district, r.workers])),
        modelVersion,
      });
      addAudit({
        action: "Plan approved",
        detail: `${plan.name} (after modification)`,
        category: "approval",
        originalRecommendation: original,
        finalDecision: "APPROVED",
        reason,
        modelVersion,
      });
      toast.success("Plan modified and approved");
    } else {
      updatePlan(plan.id, { status: "Approved" });
      addAudit({
        action: "Plan approved",
        detail: plan.name,
        category: "approval",
        originalRecommendation: original,
        finalDecision: "APPROVED",
        modelVersion,
      });
      toast.success("Plan approved");
    }

    completeStep("approval");
    advanceTour();
    setConfirm(null);
    setMode("none");
    router.push("/implementation");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Approval</h1>
        <p className="text-sm text-slate-600">
          Workforce Activation Plan · Semiconductor Facility, Gujarat
        </p>
      </div>

      <div className="rounded-md border border-navy-800/30 bg-navy-900 px-4 py-3 text-sm text-white">
        AI recommends. The authorized officer decides.
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard label="Total workers" value={formatNumber(plan.workersActivated)} />
        <KPICard label="In training" value={formatNumber(plan.transformable)} accent="saffron" />
        <KPICard label="Expected residual" value={formatNumber(plan.residual)} accent="red" />
        <KPICard label="Confidence" value={`${plan.confidence}%`} accent="green" />
        <KPICard label="Estimated cost" value={formatCrore(plan.trainingCostCr)} />
        <KPICard label="Timeline" value={`${plan.activationMonths} months`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended allocation</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>District</th>
                <th>Workers</th>
                <th>Centre</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => (
                <tr key={a.id}>
                  <td>{a.district}</td>
                  <td>
                    {mode === "modify" ? (
                      <Input
                        className="h-8 w-24"
                        type="number"
                        value={a.workers}
                        onChange={(e) => {
                          const workers = Number(e.target.value);
                          setRows((prev) =>
                            prev.map((r, idx) => (idx === i ? { ...r, workers } : r))
                          );
                        }}
                      />
                    ) : (
                      a.workers
                    )}
                  </td>
                  <td>
                    {mode === "modify" ? (
                      <Input
                        className="h-8"
                        value={a.centre}
                        onChange={(e) => {
                          const centre = e.target.value;
                          setRows((prev) =>
                            prev.map((r, idx) => (idx === i ? { ...r, centre } : r))
                          );
                        }}
                      />
                    ) : (
                      a.centre
                    )}
                  </td>
                  <td>
                    {mode === "modify" ? (
                      <Input
                        className="h-8 w-20"
                        type="number"
                        value={a.durationWeeks}
                        onChange={(e) => {
                          const durationWeeks = Number(e.target.value);
                          setRows((prev) =>
                            prev.map((r, idx) => (idx === i ? { ...r, durationWeeks } : r))
                          );
                        }}
                      />
                    ) : (
                      `${a.durationWeeks} weeks`
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {(mode === "modify" || mode === "reject") && (
        <div className="space-y-1.5">
          <Label>Reason (mandatory)</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Document why you are modifying or rejecting the AI recommendation…"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <LockButton action="approve" variant="success" onClick={() => submit("approve")}>
          APPROVE
        </LockButton>
        <LockButton
          action="modify"
          variant="warning"
          onClick={() => {
            setMode("modify");
            if (mode === "modify") submit("modify");
          }}
        >
          MODIFY
        </LockButton>
        <LockButton
          action="reject"
          variant="danger"
          onClick={() => {
            setMode("reject");
            if (mode === "reject") submit("reject");
          }}
        >
          REJECT
        </LockButton>
        {mode === "modify" && (
          <Button variant="warning" onClick={() => submit("modify")}>
            Submit modification
          </Button>
        )}
        {mode === "reject" && (
          <Button variant="danger" onClick={() => submit("reject")}>
            Confirm rejection
          </Button>
        )}
      </div>

      <Dialog open={!!confirm} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {confirm?.toUpperCase()}</DialogTitle>
            <DialogDescription>
              This writes an immutable audit record with planner, timestamp, original
              recommendation, decision, modified values, reason and model version ({modelVersion}).
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant={confirm === "reject" ? "danger" : "success"}
              onClick={finalize}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
