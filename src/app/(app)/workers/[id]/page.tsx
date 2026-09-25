"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Eye, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge, EstimatedBadge, ConfidenceChip } from "@/components/shared/Badges";
import { useAppStore } from "@/store/useAppStore";
import { canAct } from "@/lib/roles";
import type { Worker } from "@/types";

export default function WorkerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const role = useAppStore((s) => s.user?.role ?? "government_planner");
  const revealed = useAppStore((s) => s.revealedWorkers);
  const revealWorker = useAppStore((s) => s.revealWorker);
  const addAudit = useAppStore((s) => s.addAudit);
  const advanceDemo = useAppStore((s) => s.advanceDemo);

  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    if (!canAct(role, "revealWorker") && role === "training_authority") {
      toast.error("Individual worker search not permitted for Training Authority");
      router.replace("/capability");
      return;
    }
    api.getWorker(id).then((w) => {
      setWorker(w);
      setLoading(false);
      addAudit({
        action: "Worker profile accessed",
        detail: `Authorized access to ${w.maskedId}`,
        category: "reveal",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, role]);

  if (loading || !worker) return <PageSkeleton />;

  const isRevealed = revealed.includes(worker.id);
  const plc = worker.estimatedSkills.find((s) => s.name === "PLC");

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        Authorized access · Logged — profile views write to Evidence & Audit
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-slate-500">{worker.maskedId}</p>
          <h1 className="text-xl font-bold text-navy-900">
            {isRevealed ? worker.name : "•••••••• •••••"}
          </h1>
          <p className="text-sm text-slate-600">
            {worker.occupation} · {worker.experienceYears} years · {worker.location}{" "}
            <VerifiedBadge />
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={isRevealed || !canAct(role, "revealWorker")}
          onClick={() => {
            revealWorker(worker.id);
            addAudit({
              action: "Worker identity revealed",
              detail: `Reveal (logged) for ${worker.maskedId}`,
              category: "reveal",
            });
            toast.message("Identity reveal logged to audit trail");
          }}
        >
          <Eye className="h-4 w-4" /> Reveal (logged)
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Verified skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {worker.verifiedSkills.map((s) => (
              <Badge key={s} variant="success">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Estimated skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {worker.estimatedSkills.map((s) => (
              <div key={s.name} className="rounded border border-dashed border-amber-300 bg-amber-50/50 p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {s.name} {s.low}–{s.high}%
                  </span>
                  <div className="flex gap-1">
                    <EstimatedBadge />
                    <ConfidenceChip level={s.confidence} />
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">Evidence: {s.evidence}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {plc && (
        <Card>
          <CardHeader>
            <CardTitle>Inferred vs Verified · PLC</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-dashed border-amber-300 p-3">
              <EstimatedBadge />
              <p className="mt-2 text-lg font-bold tabular-nums">
                {plc.low}–{plc.high}%
              </p>
              <p className="text-xs text-slate-500">Model-inferred proficiency</p>
            </div>
            <div className="rounded-md border border-india-green/40 bg-india-green/5 p-3">
              <VerifiedBadge />
              <p className="mt-2 text-lg font-bold">Not yet assessed</p>
              <p className="text-xs text-slate-500">No formal PLC certification on record</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc text-sm text-slate-700">
              {worker.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Consent</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700">
            Share with employers:{" "}
            <strong>{worker.consent.shareWithEmployers ? "ON" : "OFF"}</strong>
            <br />
            Use for training recommendations:{" "}
            <strong>{worker.consent.trainingRecommendations ? "ON" : "OFF"}</strong>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training history</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 border-l-2 border-slate-200 pl-4">
            {worker.trainingHistory.map((t) => (
              <li key={t.title} className="text-sm">
                <p className="font-medium text-navy-900">{t.title}</p>
                <p className="text-xs text-slate-500">
                  {t.date} · {t.provider}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work history</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {worker.workHistory.map((w) => (
              <li key={w.role + w.org}>
                <span className="font-medium">{w.role}</span> · {w.org}{" "}
                <span className="text-xs text-slate-500">
                  ({w.from}–{w.to})
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transformation options</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {worker.transformationOptions.map((opt) => (
            <Button
              key={opt}
              variant="saffron"
              size="sm"
              onClick={() => {
                advanceDemo();
                router.push(`/transformation?from=${encodeURIComponent(worker.occupation)}&to=${encodeURIComponent(opt)}`);
              }}
            >
              {opt} →
            </Button>
          ))}
        </CardContent>
      </Card>

      <Link href="/capability" className="text-sm text-navy-800 underline">
        ← Back to Capability Map
      </Link>
    </div>
  );
}
