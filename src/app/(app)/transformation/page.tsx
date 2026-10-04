"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceChip } from "@/components/shared/Badges";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/useAppStore";
import { formatINR, formatNumber } from "@/lib/formatters";
import { nowISO } from "@/lib/utils";
import { defaultEvidence } from "@/data/plans";

export default function TransformationPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TransformationContent />
    </Suspense>
  );
}

function TransformationContent() {
  const params = useSearchParams();
  const completeStep = useAppStore((s) => s.completeStep);
  const incrementPlanItems = useAppStore((s) => s.incrementPlanItems);
  const advanceTour = useAppStore((s) => s.advanceTour);
  const addAudit = useAppStore((s) => s.addAudit);
  const openEvidence = useAppStore((s) => s.openEvidence);
  const modelVersion = useAppStore((s) => s.modelVersion);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getTransformation>> | null>(null);
  const [from, setFrom] = useState(params.get("from") || "Industrial Electrician");
  const [to, setTo] = useState(params.get("to") || "Automation Technician");

  useEffect(() => {
    completeStep("transformation");
    api.getTransformation().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [completeStep]);

  if (loading || !data) return <PageSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Transformation Lab</h1>
          <p className="text-xs text-slate-500">Bridge current capability to target occupations</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            openEvidence({
              title: "Why this transformation path?",
              evidence: defaultEvidence,
              assumptions: ["Worker availability within 40 km", "NSQF bridge modules available"],
              confidence: 84,
              model: modelVersion,
              timestamp: nowISO(),
            })
          }
        >
          Why?
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3">
        <Select value={from} onValueChange={setFrom}>
          <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Industrial Electrician">Industrial Electrician</SelectItem>
            <SelectItem value="Fitter">Fitter</SelectItem>
            <SelectItem value="Welder">Welder</SelectItem>
          </SelectContent>
        </Select>
        <ArrowRight className="h-4 w-4 text-saffron" />
        <Select value={to} onValueChange={setTo}>
          <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Automation Technician">Automation Technician</SelectItem>
            <SelectItem value="EV Technician">EV Technician</SelectItem>
            <SelectItem value="Industrial Maintenance">Industrial Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-india-green">Has ✓</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.has.map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-india-green" /> {s}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Missing ✗</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.missing.map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-red-500" /> {s}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-saffron/40">
          <CardHeader>
            <CardTitle className="text-saffron-dark">Bridge modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.bridge.map((s) => (
              <Badge key={s} variant="saffron">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill ontology graph</CardTitle>
        </CardHeader>
        <CardContent>
          <svg viewBox="0 0 560 180" className="h-44 w-full">
            {data.edges.map(([a, b], i) => {
              const nodes = data.ontology;
              const na = nodes.find((n) => n.id === a)!;
              const nb = nodes.find((n) => n.id === b)!;
              const ia = nodes.indexOf(na);
              const ib = nodes.indexOf(nb);
              const xa = 60 + ia * 110;
              const xb = 60 + ib * 110;
              return (
                <line key={i} x1={xa} y1={90} x2={xb} y2={90} stroke="#94a3b8" strokeWidth="2" />
              );
            })}
            {data.ontology.map((n, i) => (
              <g key={n.id}>
                <circle cx={60 + i * 110} cy={90} r={28} fill="#0B1F3A" />
                <text
                  x={60 + i * 110}
                  y={94}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="600"
                >
                  {n.label.split(" ")[0]}
                </text>
              </g>
            ))}
          </svg>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {data.paths.map((p) => (
          <Card key={p.id} className={p.id === "path-a" ? "ring-1 ring-india-green/40" : ""}>
            <CardHeader>
              <CardTitle>{p.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <p>
                  <span className="text-slate-500">Duration</span>
                  <br />
                  <strong>{p.durationWeeks} weeks</strong>
                </p>
                <p>
                  <span className="text-slate-500">Cost</span>
                  <br />
                  <strong>{formatINR(p.cost)}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Distance</span>
                  <br />
                  <strong>{p.distanceKm} km</strong>
                </p>
                <p>
                  <span className="text-slate-500">Centres nearby</span>
                  <br />
                  <strong>{p.centresNearby}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Employer demand</span>
                  <br />
                  <strong>{p.employerDemand}%</strong>
                </p>
                <p>
                  <span className="text-slate-500">Historical success</span>
                  <br />
                  <strong>{p.historicalSuccess}%</strong>
                </p>
                <p>
                  <span className="text-slate-500">Placement probability</span>
                  <br />
                  <strong>{p.placementProbability}%</strong>
                </p>
                <p>
                  <span className="text-slate-500">Confidence</span>
                  <br />
                  <ConfidenceChip level={p.confidence} />
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.modules.map((m) => (
                  <Badge key={m} variant="outline">
                    {m}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Demand: {p.demand} · Wage potential: {p.wagePotential}
              </p>
              <Button
                variant="saffron"
                className="w-full"
                onClick={() => {
                  incrementPlanItems();
                  completeStep("transformation");
                  advanceTour();
                  addAudit({
                    action: "Added to activation plan",
                    detail: `${from} → ${to} via ${p.label}`,
                    category: "plan",
                  });
                  toast.success(`Added ${p.label} to Activation Plan`);
                }}
              >
                Add to Activation Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Plan items queued: use Activation Plans to generate full allocation ({formatNumber(2)} path options compared).
      </p>
    </div>
  );
}
