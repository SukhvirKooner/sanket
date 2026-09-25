"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { KPICard } from "@/components/shared/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataSourceBadge, SyntheticFooterBadge } from "@/components/shared/Badges";
import { formatIndianCount, formatNumber } from "@/lib/formatters";
import { useAppStore } from "@/store/useAppStore";
import { canAct } from "@/lib/roles";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TrainingCentre } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function TrainingPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TrainingContent />
    </Suspense>
  );
}

function TrainingContent() {
  const params = useSearchParams();
  const highlight = params.get("highlight");
  const completeStep = useAppStore((s) => s.completeStep);
  const advanceDemo = useAppStore((s) => s.advanceDemo);
  const role = useAppStore((s) => s.user?.role ?? "government_planner");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getTraining>> | null>(null);
  const [selected, setSelected] = useState<TrainingCentre | null>(null);
  const [centres, setCentres] = useState<TrainingCentre[]>([]);

  useEffect(() => {
    completeStep("training");
    advanceDemo();
    api.getTraining().then((d) => {
      setData(d);
      setCentres(d.centres);
      setLoading(false);
      if (highlight) {
        const c = d.centres.find((x) => x.id === highlight);
        if (c) setSelected(c);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeStep]);

  if (loading || !data) return <PageSkeleton />;

  const utilData = selected
    ? [
        { week: "W1", util: 45 },
        { week: "W2", util: 52 },
        { week: "W3", util: 58 },
        { week: "W4", util: selected.utilization },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Training Capacity</h1>
        <p className="text-xs text-slate-500">Where infrastructure exists to close the gap</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard label="Centres" value={formatNumber(data.kpis.centres)} />
        <KPICard label="Total seats" value={formatIndianCount(data.kpis.totalSeats)} />
        <KPICard label="Available seats" value={formatIndianCount(data.kpis.availableSeats)} accent="green" />
        <KPICard label="Avg utilization" value={`${data.kpis.avgUtilization}%`} />
        <KPICard label="Convertible capacity" value={formatNumber(data.kpis.convertibleCapacity)} accent="saffron" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Centres</CardTitle>
            <SyntheticFooterBadge />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Centre</th>
                  <th>Course</th>
                  <th>Seats</th>
                  <th>Available</th>
                  <th>Util.</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {centres.map((c) => (
                  <tr
                    key={c.id}
                    className={cn(highlight === c.id && "bg-saffron/10")}
                  >
                    <td>
                      <p className="font-medium text-navy-900">{c.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {c.type} · {c.district}
                      </p>
                    </td>
                    <td>{c.course}</td>
                    <td>
                      {canAct(role, "editTraining") ? (
                        <Input
                          className="h-8 w-20"
                          type="number"
                          value={c.seats}
                          onChange={(e) => {
                            const seats = Number(e.target.value);
                            setCentres((prev) =>
                              prev.map((x) => (x.id === c.id ? { ...x, seats } : x))
                            );
                            toast.message("Seats updated (demo)");
                          }}
                        />
                      ) : (
                        c.seats
                      )}
                    </td>
                    <td>{c.available}</td>
                    <td>
                      <span
                        className={cn(
                          "font-medium",
                          c.utilization < 40 && "text-india-green",
                          c.utilization > 70 && "text-red-600"
                        )}
                      >
                        {c.utilization}%
                      </span>
                    </td>
                    <td>
                      <Button size="sm" variant="outline" onClick={() => setSelected(c)}>
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Utilisation by centre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {centres.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50",
                  highlight === c.id && "border-saffron bg-saffron/5"
                )}
              >
                <div>
                  <p className="font-medium text-navy-900">{c.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {c.district}, {c.state} · {c.course}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-semibold tabular-nums",
                      c.utilization < 40 && "text-india-green",
                      c.utilization > 70 && "text-red-600"
                    )}
                  >
                    {c.utilization}%
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {c.available}/{c.seats} free
                  </p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Convertible capacity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Current</p>
            <ul className="space-y-1 text-sm">
              {data.convertible.current.map((c) => (
                <li key={c.occupation} className="flex justify-between rounded bg-slate-50 px-3 py-2">
                  <span>{c.occupation}</span>
                  <strong>{c.seats}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Convertible →</p>
            <ul className="space-y-1 text-sm">
              {data.convertible.convertible.map((c) => (
                <li
                  key={c.occupation}
                  className="flex justify-between rounded border border-saffron/30 bg-saffron/5 px-3 py-2"
                >
                  <span>{c.occupation}</span>
                  <strong>{c.seats}</strong>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <p>
                {selected.course} · {selected.trainers} trainers · Next batch {selected.nextBatch}
              </p>
              <DataSourceBadge type={selected.meta.sourceType} name={selected.meta.sourceName} />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Equipment / Labs</p>
                <ul className="mt-1 list-inside list-disc">
                  {selected.equipment.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="util" fill="#0B1F3A" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
