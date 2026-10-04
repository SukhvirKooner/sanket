"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { formatNumber } from "@/lib/formatters";

export default function ImplementationPage() {
  const completeStep = useAppStore((s) => s.completeStep);
  const advanceTour = useAppStore((s) => s.advanceTour);
  const plans = useAppStore((s) => s.plans);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getImplementation>> | null>(null);

  useEffect(() => {
    completeStep("monitoring");
    advanceTour();
    api.getImplementation().then((d) => {
      setData(d);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeStep]);

  if (loading || !data) return <PageSkeleton />;

  const plan = plans.find((p) => p.id === "plan-semi-gj");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Implementation Monitoring</h1>
        <p className="text-xs text-slate-500">
          Plan vs Actual · Semiconductor Facility, Gujarat · Status:{" "}
          <strong>{plan?.status ?? "Draft"}</strong>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funnel — Planned vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.funnel} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="planned" fill="#0B1F3A" name="Planned" />
                <Bar dataKey="actual" fill="#FF9933" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            {data.funnel.map((f) => (
              <span key={f.stage}>
                {f.stage}: {formatNumber(f.actual)}/{formatNumber(f.planned)}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Per-district progress</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>District</th>
                  <th>Enrolled</th>
                  <th>Completed</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {data.districts.map((d) => (
                  <tr key={d.district}>
                    <td>{d.district}</td>
                    <td>{d.enrolled}</td>
                    <td>{d.completed}</td>
                    <td>{d.placed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Centre batch status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.batches.map((b) => (
              <div
                key={b.centre}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{b.centre}</p>
                  <p className="text-xs text-slate-500">
                    {b.course} · {b.enrolled}/{b.capacity}
                  </p>
                </div>
                <Badge
                  variant={
                    b.status === "On track"
                      ? "success"
                      : b.status === "Bottleneck"
                        ? "danger"
                        : "saffron"
                  }
                >
                  {b.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly enrollment vs target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="target" stroke="#0B1F3A" strokeWidth={2} />
                <Line type="monotone" dataKey="actual" stroke="#FF9933" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bottleneck alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.alerts.map((a) => (
            <div
              key={a}
              className="flex items-start gap-2 rounded-md border border-saffron/40 bg-saffron/5 p-3 text-sm"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 text-saffron-dark" />
              {a}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
