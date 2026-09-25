"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BASE_SCENARIO, SCENARIO_PRESETS, runScenario } from "@/lib/scenario";
import type { ScenarioParams } from "@/types";
import { formatCrore, formatNumber } from "@/lib/formatters";
import { useAppStore } from "@/store/useAppStore";
import { LockButton } from "@/components/shared/LockButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { defaultEvidence } from "@/data/plans";
import { nowISO } from "@/lib/utils";

const defaultParams: ScenarioParams = {
  demandPct: 0,
  delayMonths: 0,
  migration: "Base",
  hiringVelocity: "Base",
  capacityPct: 0,
  investmentScale: 100,
};

export default function ScenariosPage() {
  const completeStep = useAppStore((s) => s.completeStep);
  const advanceDemo = useAppStore((s) => s.advanceDemo);
  const saveScenario = useAppStore((s) => s.saveScenario);
  const saved = useAppStore((s) => s.savedScenarios);
  const addAudit = useAppStore((s) => s.addAudit);
  const openEvidence = useAppStore((s) => s.openEvidence);
  const modelVersion = useAppStore((s) => s.modelVersion);

  const [params, setParams] = useState<ScenarioParams>(defaultParams);
  const [result, setResult] = useState<ReturnType<typeof runScenario> | null>(null);
  const [name, setName] = useState("");

  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      { metric: "Demand", Base: BASE_SCENARIO.demand, Scenario: result.demand },
      { metric: "Direct", Base: BASE_SCENARIO.direct, Scenario: result.direct },
      { metric: "Transform", Base: BASE_SCENARIO.transformable, Scenario: result.transformable },
      { metric: "Residual", Base: BASE_SCENARIO.residual, Scenario: result.residual },
    ];
  }, [result]);

  const rows = result
    ? [
        { metric: "Demand", base: BASE_SCENARIO.demand, scenario: result.demand },
        { metric: "Directly deployable", base: BASE_SCENARIO.direct, scenario: result.direct },
        { metric: "Transformable", base: BASE_SCENARIO.transformable, scenario: result.transformable },
        { metric: "Residual gap", base: BASE_SCENARIO.residual, scenario: result.residual },
        { metric: "Training cost (₹ Cr)", base: BASE_SCENARIO.cost, scenario: result.cost },
        { metric: "Activation time (mo)", base: BASE_SCENARIO.activationTime, scenario: result.activationTime },
        { metric: "Utilization %", base: BASE_SCENARIO.utilization, scenario: result.utilization },
        { metric: "Unfilled demand", base: BASE_SCENARIO.unfilledDemand, scenario: result.unfilledDemand },
        { metric: "Unused capacity", base: BASE_SCENARIO.unusedCapacity, scenario: result.unusedCapacity },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Scenario Lab</h1>
          <p className="text-xs text-slate-500">Stress-test the activation plan before approval</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            openEvidence({
              title: "Why these scenario outcomes?",
              evidence: defaultEvidence,
              assumptions: ["Deterministic demo formula", "Base case = Semiconductor Gujarat plan"],
              confidence: 70,
              model: modelVersion,
              timestamp: nowISO(),
            })
          }
        >
          Why?
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {SCENARIO_PRESETS.map((p) => (
          <Button
            key={p.name}
            size="sm"
            variant="outline"
            onClick={() => setParams(p.params)}
          >
            {p.name}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>Demand {params.demandPct}%</Label>
              <Slider
                value={[params.demandPct]}
                min={-20}
                max={20}
                step={1}
                onValueChange={([v]) => setParams((p) => ({ ...p, demandPct: v }))}
              />
            </div>
            <div>
              <Label>Project delay {params.delayMonths} months</Label>
              <Slider
                value={[params.delayMonths]}
                min={0}
                max={12}
                step={1}
                onValueChange={([v]) => setParams((p) => ({ ...p, delayMonths: v }))}
              />
            </div>
            <div>
              <Label>Training capacity {params.capacityPct}%</Label>
              <Slider
                value={[params.capacityPct]}
                min={-30}
                max={30}
                step={1}
                onValueChange={([v]) => setParams((p) => ({ ...p, capacityPct: v }))}
              />
            </div>
            <div>
              <Label>Investment scale {params.investmentScale}%</Label>
              <Slider
                value={[params.investmentScale]}
                min={50}
                max={150}
                step={5}
                onValueChange={([v]) => setParams((p) => ({ ...p, investmentScale: v }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Migration</Label>
                <Select
                  value={params.migration}
                  onValueChange={(v) =>
                    setParams((p) => ({ ...p, migration: v as ScenarioParams["migration"] }))
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Base">Base</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hiring velocity</Label>
                <Select
                  value={params.hiringVelocity}
                  onValueChange={(v) =>
                    setParams((p) => ({
                      ...p,
                      hiringVelocity: v as ScenarioParams["hiringVelocity"],
                    }))
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Base">Base</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <LockButton
              action="runScenario"
              variant="saffron"
              className="w-full"
              onClick={() => {
                const r = runScenario(params);
                setResult(r);
                completeStep("scenario");
                advanceDemo();
                addAudit({
                  action: "Scenario run",
                  detail: `Demand ${params.demandPct}%, delay ${params.delayMonths}m, capacity ${params.capacityPct}%`,
                  category: "scenario",
                });
                toast.success("Scenario computed");
              }}
            >
              Run Scenario
            </LockButton>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Base vs Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <p className="text-sm text-slate-500">
                Adjust controls and run a scenario. Use &quot;Stress test (demo table)&quot; for the
                judging example (delay +6, demand −10%, capacity −15%, migration +5%).
              </p>
            ) : (
              <>
                <table className="data-table mb-4">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Base</th>
                      <th>Scenario</th>
                      <th>Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const delta = r.scenario - r.base;
                      return (
                        <tr key={r.metric}>
                          <td>{r.metric}</td>
                          <td className="tabular-nums">
                            {r.metric.includes("cost")
                              ? formatCrore(r.base)
                              : formatNumber(r.base)}
                          </td>
                          <td className="tabular-nums font-medium">
                            {r.metric.includes("cost")
                              ? formatCrore(r.scenario)
                              : formatNumber(r.scenario)}
                          </td>
                          <td
                            className={cn(
                              "tabular-nums font-medium",
                              delta < 0 && "text-india-green",
                              delta > 0 && r.metric.includes("gap") && "text-red-600",
                              delta > 0 && !r.metric.includes("gap") && "text-saffron-dark",
                              delta === 0 && "text-slate-400"
                            )}
                          >
                            {delta > 0 ? "+" : ""}
                            {r.metric.includes("cost")
                              ? formatCrore(delta)
                              : formatNumber(delta)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Base" fill="#0B1F3A" />
                      <Bar dataKey="Scenario" fill="#FF9933" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder="Scenario name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      saveScenario(name || `Scenario ${saved.length + 1}`, params, result);
                      toast.success("Scenario saved (max 3)");
                      setName("");
                    }}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {saved.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved scenarios (compare up to 3)</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Demand</th>
                  <th>Residual</th>
                  <th>Cost</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {saved.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{formatNumber(s.result.demand)}</td>
                    <td>{formatNumber(s.result.residual)}</td>
                    <td>{formatCrore(s.result.cost)}</td>
                    <td>{s.result.activationTime} mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
