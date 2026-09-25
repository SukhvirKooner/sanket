"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { KPICard } from "@/components/shared/KPICard";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfidenceChip, StatusPill, SyntheticFooterBadge } from "@/components/shared/Badges";
import { formatIndianCount, formatNumber } from "@/lib/formatters";
import { useAppStore } from "@/store/useAppStore";
import { t } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function ControlRoomPage() {
  const router = useRouter();
  const locale = useAppStore((s) => s.locale);
  const plans = useAppStore((s) => s.plans);
  const completeStep = useAppStore((s) => s.completeStep);
  const advanceDemo = useAppStore((s) => s.advanceDemo);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getControlRoom>> | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>("Gujarat");
  const [geo, setGeo] = useState("India");
  const [sector, setSector] = useState("All");
  const [horizon, setHorizon] = useState("18");

  useEffect(() => {
    completeStep("signal");
    api.getControlRoom().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [completeStep]);

  if (loading || !data) return <PageSkeleton />;

  const { kpis, sparklines, emergingDemand, alerts, stateMetrics, districtMetricsGujarat } = data;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{t("controlRoom", locale)}</h1>
          <p className="text-xs text-slate-500">
            India&apos;s workforce situation on one screen · 18-month horizon
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={geo} onValueChange={setGeo}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Geography" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Gujarat">Gujarat</SelectItem>
              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sector" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All sectors</SelectItem>
              <SelectItem value="Semi">Electronics & Semiconductor</SelectItem>
              <SelectItem value="EV">Automotive / EV</SelectItem>
            </SelectContent>
          </Select>
          <Select value={horizon} onValueChange={setHorizon}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Horizon" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="18">18 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <KPICard label={t("emergingDemand", locale)} value={`+${kpis.emergingDemandPct}%`} delta="+3pp vs prior" sparkline={sparklines.emerging} accent="saffron" />
        <KPICard label={t("workforceRequired", locale)} value={formatIndianCount(kpis.workforceRequired, true)} delta="+2.1%" sparkline={sparklines.required} />
        <KPICard label={t("deployableCapability", locale)} value={formatIndianCount(kpis.deployable, true)} delta="+1.6%" sparkline={sparklines.deployable} accent="green" />
        <KPICard label={t("transformableCapability", locale)} value={formatIndianCount(kpis.transformable, true)} delta="+0.8%" sparkline={sparklines.transformable} />
        <KPICard label={t("residualGap", locale)} value={formatIndianCount(kpis.residualGap, true)} delta="−1.2%" sparkline={sparklines.gap} accent="red" />
        <KPICard label={t("trainingCapacityKpi", locale)} value={formatIndianCount(kpis.trainingCapacity, true)} delta="+2%" sparkline={sparklines.training} />
        <KPICard label={t("activePlans", locale)} value={formatNumber(kpis.activePlans)} delta="+4" sparkline={sparklines.plans} />
        <KPICard label={t("forecastConfidence", locale)} value={`${kpis.forecastConfidence}%`} delta="+2pp" sparkline={sparklines.confidence} accent="green" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>State workforce snapshot</CardTitle>
            <span className="text-[11px] text-slate-500">Click a state to drill into districts</span>
          </CardHeader>
          <CardContent className="space-y-3 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Demand</th>
                  <th>Capability</th>
                  <th>Gap</th>
                  <th>Training</th>
                </tr>
              </thead>
              <tbody>
                {stateMetrics.map((s) => (
                  <tr
                    key={s.code}
                    className={cn(
                      "cursor-pointer",
                      selectedState === s.state && "bg-saffron/10"
                    )}
                    onClick={() => {
                      setSelectedState(s.state);
                      setGeo(s.state === "Gujarat" || s.state === "Maharashtra" ? s.state : geo);
                    }}
                  >
                    <td className="font-medium text-navy-900">{s.state}</td>
                    <td>{formatIndianCount(s.demand)}</td>
                    <td>{formatIndianCount(s.capability)}</td>
                    <td className="font-medium text-red-600">{formatIndianCount(s.gap)}</td>
                    <td>{formatIndianCount(s.training)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedState === "Gujarat" && (
              <div className="overflow-x-auto rounded-md border border-slate-200">
                <p className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-navy-900">
                  Gujarat districts
                </p>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>District</th>
                      <th>Demand</th>
                      <th>Capability</th>
                      <th>Gap</th>
                      <th>Training</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtMetricsGujarat.map((d) => (
                      <tr key={d.district}>
                        <td>{d.district}</td>
                        <td>{d.demand}</td>
                        <td>{d.capability}</td>
                        <td>{d.gap}</td>
                        <td>{d.training}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  if (a.id === "alert-1") {
                    advanceDemo();
                    completeStep("signal");
                  }
                  router.push(a.href);
                }}
                className="flex w-full items-start gap-2 rounded-md border border-saffron/40 bg-saffron/5 p-3 text-left text-sm hover:bg-saffron/10"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-saffron-dark" />
                <span className="text-navy-900">{a.message}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Emerging demand</CardTitle>
            <SyntheticFooterBadge />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Occupation</th>
                  <th>Geography</th>
                  <th>Growth</th>
                  <th>Timeline</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {emergingDemand.map((r) => (
                  <tr key={`${r.occupation}-${r.geography}`}>
                    <td>{r.sector}</td>
                    <td>{r.occupation}</td>
                    <td>{r.geography}</td>
                    <td className="font-medium text-india-green">+{r.growthPct}%</td>
                    <td>{r.timeline}</td>
                    <td>
                      <ConfidenceChip level={r.confidenceLevel} value={r.confidence} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Active workforce plans</CardTitle>
            <Link href="/activation" className="text-xs font-medium text-navy-800 underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Location</th>
                  <th>Demand</th>
                  <th>Gap</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id} className="cursor-pointer" onClick={() => router.push("/activation")}>
                    <td className="font-medium text-navy-900">{p.name}</td>
                    <td>{p.location}</td>
                    <td>{formatNumber(p.demand)}</td>
                    <td>{formatNumber(p.residual)}</td>
                    <td>
                      <StatusPill status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
