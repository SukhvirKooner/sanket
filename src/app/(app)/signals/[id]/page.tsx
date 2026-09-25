"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RangeBar } from "@/components/shared/RangeBar";
import { useAppStore } from "@/store/useAppStore";
import { formatCrore, formatNumber } from "@/lib/formatters";
import { nowISO } from "@/lib/utils";

const COLORS = ["#0B1F3A", "#FF9933", "#138808", "#1a3a5c", "#94a3b8"];

export default function EventAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const openEvidence = useAppStore((s) => s.openEvidence);
  const modelVersion = useAppStore((s) => s.modelVersion);
  const completeStep = useAppStore((s) => s.completeStep);
  const advanceDemo = useAppStore((s) => s.advanceDemo);
  const addAudit = useAppStore((s) => s.addAudit);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getEventAnalysis>> | null>(null);

  useEffect(() => {
    completeStep("demand");
    api.getEventAnalysis(id).then((d) => {
      setData(d);
      setLoading(false);
      addAudit({
        action: "Demand forecast generated",
        detail: `${d.event.name}: ${d.forecast.low}–${d.forecast.high} (base ${d.forecast.base})`,
        category: "recommendation",
        confidence: d.forecast.confidence,
        assumptions: d.assumptions,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !data) return <PageSkeleton />;

  const { event, forecast, occupationMix, hiringRamp, skillsNeeded, evidence, assumptions } = data;

  const openWhy = () => {
    openEvidence({
      title: "Why this forecast?",
      evidence,
      assumptions,
      confidence: forecast.confidence,
      model: modelVersion,
      timestamp: nowISO(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-navy-900 p-5 text-white">
        <p className="text-xs uppercase tracking-wide text-saffron">Economic Event Analysis</p>
        <h1 className="mt-1 text-2xl font-bold">
          {event.name} · {event.state}
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          {event.location} · Operational in {event.operationalMonths} months ·{" "}
          {formatCrore(event.investmentCr, 0)}
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <RangeBar
            low={forecast.low}
            base={forecast.base}
            high={forecast.high}
            confidence={forecast.confidence}
            confidenceLevel={forecast.confidenceLevel}
            label="Workforce demand"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Occupation mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupationMix}
                    dataKey="count"
                    nameKey="occupation"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {occupationMix.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatNumber(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <table className="data-table mt-2">
              <thead>
                <tr>
                  <th>Occupation</th>
                  <th>Count</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {occupationMix.map((o) => (
                  <tr key={o.occupation}>
                    <td>{o.occupation}</td>
                    <td>{formatNumber(o.count)}</td>
                    <td>{o.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hiring ramp (18 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hiringRamp}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="hired" stroke="#0B1F3A" fill="#0B1F3A33" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills needed</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {skillsNeeded.map((s) => (
            <Badge key={s} variant="outline" className="border-navy-800/30">
              {s}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={openWhy}>
          Why this forecast?
        </Button>
        <Button
          variant="saffron"
          onClick={() => {
            completeStep("capability");
            advanceDemo();
            router.push("/capability");
          }}
        >
          Find Existing Workforce →
        </Button>
      </div>
    </div>
  );
}
