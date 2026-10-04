"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessingSteps } from "@/components/shared/ProcessingSteps";
import { LockButton } from "@/components/shared/LockButton";
import { useAppStore } from "@/store/useAppStore";
import { formatNumber } from "@/lib/formatters";

const RECAL_STEPS = [
  "Ingesting realized hiring outcomes",
  "Re-estimating demand elasticity",
  "Updating regional priors",
  "Validating holdout error",
  "Publishing Demand Model v0.5",
];

export default function OutcomesPage() {
  const completeStep = useAppStore((s) => s.completeStep);
  const advanceTour = useAppStore((s) => s.advanceTour);
  const setModelVersion = useAppStore((s) => s.setModelVersion);
  const modelVersion = useAppStore((s) => s.modelVersion);
  const addAudit = useAppStore((s) => s.addAudit);

  const [loading, setLoading] = useState(true);
  const [recalibrating, setRecalibrating] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getOutcomes>> | null>(null);

  useEffect(() => {
    completeStep("outcome");
    api.getOutcomes().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [completeStep]);

  if (loading || !data) return <PageSkeleton />;

  if (recalibrating) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <ProcessingSteps
          steps={RECAL_STEPS}
          onComplete={() => {
            setModelVersion("Demand Model v0.5");
            completeStep("recalibration");
            advanceTour();
            addAudit({
              action: "Forecast recalibrated",
              detail: "Demand Model v0.4 → v0.5",
              category: "recalibration",
              modelVersion: "Demand Model v0.5",
            });
            setRecalibrating(false);
            toast.success("Model updated to Demand Model v0.5");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Outcome / Reality Loop</h1>
        <p className="text-xs text-slate-500">
          What makes SANKET different — forecasts are accountable · Active model:{" "}
          <strong>{modelVersion}</strong>
        </p>
      </div>

      <Card className="border-saffron/40">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-slate-500">Forecast</p>
            <p className="text-2xl font-bold text-navy-900">
              {formatNumber(data.card.forecast)} EV technicians
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Actual hiring</p>
            <p className="text-2xl font-bold text-navy-900">
              {formatNumber(data.card.actual)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Forecast error</p>
            <p className="text-2xl font-bold text-red-600">{data.card.errorPct}%</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Forecast vs actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="forecast" stroke="#0B1F3A" strokeWidth={2} />
                  <Line type="monotone" dataKey="actual" stroke="#138808" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Likely drivers (ranked)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.drivers} layout="vertical" margin={{ left: 110 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" unit="%" />
                  <YAxis type="category" dataKey="driver" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="contribution" fill="#FF9933" name="Contribution %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <LockButton
        action="recalibrate"
        variant="saffron"
        onClick={() => setRecalibrating(true)}
        disabled={modelVersion === "Demand Model v0.5"}
      >
        {modelVersion === "Demand Model v0.5"
          ? "Already recalibrated to v0.5"
          : "Recalibrate Forecast"}
      </LockButton>
    </div>
  );
}
