"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { KPICard } from "@/components/shared/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/formatters";
import { useAppStore } from "@/store/useAppStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Worker } from "@/types";
import { SyntheticFooterBadge } from "@/components/shared/Badges";

export default function CapabilityPage() {
  const router = useRouter();
  const completeStep = useAppStore((s) => s.completeStep);
  const advanceTour = useAppStore((s) => s.advanceTour);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getCapability>> | null>(null);
  const [districtWorkers, setDistrictWorkers] = useState<Worker[] | null>(null);

  useEffect(() => {
    completeStep("capability");
    completeStep("gap");
    api.getCapability().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [completeStep]);

  if (loading || !data) return <PageSkeleton />;

  const { kpis, districts, workers, gap } = data;
  const total = kpis.total;
  const funnel = [
    { label: "Total relevant", value: kpis.total, w: 100 },
    { label: "Directly deployable", value: kpis.direct, w: (kpis.direct / total) * 100 },
    { label: "One-step transformable", value: kpis.oneStep, w: (kpis.oneStep / total) * 100 },
    { label: "Two-step transformable", value: kpis.twoStep, w: (kpis.twoStep / total) * 100 },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Capability Map</h1>
        <p className="text-xs text-slate-500">Do we already have these people?</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total relevant workforce" value={formatNumber(kpis.total)} />
        <KPICard label="Directly deployable" value={formatNumber(kpis.direct)} accent="green" />
        <KPICard label="One-step transformable" value={formatNumber(kpis.oneStep)} accent="saffron" />
        <KPICard label="Two-step transformable" value={formatNumber(kpis.twoStep)} />
      </div>

      <div className="rounded-lg border border-navy-800/20 bg-navy-900 px-4 py-3 text-sm text-white">
        Gap summary: Residual = Demand − Direct − Feasible transformable →{" "}
        <span className="font-semibold text-saffron">
          {formatNumber(gap.demand)} − {formatNumber(gap.direct)} − {formatNumber(gap.transformable)} ={" "}
          {formatNumber(gap.residual)}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Capability funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnel.map((f) => (
              <div key={f.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{f.label}</span>
                  <span className="font-semibold tabular-nums">{formatNumber(f.value)}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-navy-800"
                    style={{ width: `${Math.max(f.w, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>District capability</CardTitle>
            <SyntheticFooterBadge />
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex flex-wrap gap-2">
              {["Occupation", "Skill", "District", "Experience", "Certification", "Distance", "Availability"].map(
                (f) => (
                  <Select key={f} defaultValue="all">
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <SelectValue placeholder={f} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {f}</SelectItem>
                      <SelectItem value="f1">Sample filter</SelectItem>
                    </SelectContent>
                  </Select>
                )
              )}
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>District</th>
                  <th>Direct</th>
                  <th>1-step</th>
                  <th>2-step</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {districts.map((d) => (
                  <tr key={d.district}>
                    <td className="font-medium">{d.district}</td>
                    <td>{d.direct}</td>
                    <td>{d.oneStep}</td>
                    <td>{d.twoStep}</td>
                    <td>{d.total}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setDistrictWorkers(
                            workers.filter((w) => w.district === d.district).length
                              ? workers.filter((w) => w.district === d.district)
                              : workers
                          )
                        }
                      >
                        View workers
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!districtWorkers} onOpenChange={() => setDistrictWorkers(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anonymized workers</DialogTitle>
          </DialogHeader>
          <ul className="space-y-2">
            {(districtWorkers ?? []).map((w) => (
              <li key={w.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={() => {
                    advanceTour();
                    router.push(`/workers/${w.id}`);
                  }}
                >
                  <span>
                    <span className="font-mono text-xs">{w.maskedId}</span>
                    <span className="ml-2 text-slate-600">{w.occupation}</span>
                  </span>
                  <span className="text-xs text-slate-500">{w.district}</span>
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
