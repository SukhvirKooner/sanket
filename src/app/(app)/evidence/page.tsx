"use client";

import { useMemo, useState } from "react";
import { Download, ChevronDown, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { formatDate } from "@/lib/formatters";
import { ROLE_LABELS } from "@/lib/roles";
import { defaultEvidence } from "@/data/plans";
import { cn } from "@/lib/utils";

export default function EvidencePage() {
  const auditLog = useAppStore((s) => s.auditLog);
  const modelVersion = useAppStore((s) => s.modelVersion);
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return auditLog.filter(
      (a) =>
        a.action.toLowerCase().includes(term) ||
        a.detail.toLowerCase().includes(term) ||
        a.user.toLowerCase().includes(term)
    );
  }, [auditLog, q]);

  const recommendations = filtered.filter((a) =>
    ["recommendation", "plan", "scenario", "recalibration"].includes(a.category)
  );

  const exportCsv = () => {
    const header = "id,timestamp,action,detail,user,role,modelVersion,category,reason\n";
    const rows = auditLog
      .map((a) =>
        [
          a.id,
          a.timestamp,
          JSON.stringify(a.action),
          JSON.stringify(a.detail),
          a.user,
          a.role,
          a.modelVersion,
          a.category,
          JSON.stringify(a.reason ?? ""),
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = "sanket-audit.csv";
    el.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Evidence & Audit</h1>
          <p className="text-xs text-slate-500">
            Every major AI recommendation and human decision · {modelVersion}
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Input
        placeholder="Search audit log…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI recommendations (with Why?)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recommendations.length === 0 && (
              <p className="text-sm text-slate-500">
                No recommendations yet — walk the planner journey to populate this log.
              </p>
            )}
            {recommendations.map((a) => (
              <div key={a.id} className="rounded-md border border-slate-200">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm"
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                >
                  <span>
                    <span className="font-medium text-navy-900">{a.action}</span>
                    <span className="ml-2 text-xs text-slate-500">{formatDate(a.timestamp)}</span>
                  </span>
                  <ChevronDown
                    className={cn("h-4 w-4", expanded === a.id && "rotate-180")}
                  />
                </button>
                {expanded === a.id && (
                  <div className="space-y-2 border-t border-slate-100 px-3 py-2 text-xs text-slate-600">
                    <p>{a.detail}</p>
                    <p>
                      Model: <strong>{a.modelVersion}</strong>
                      {a.confidence !== undefined && ` · Confidence ${a.confidence}%`}
                    </p>
                    <p className="font-semibold text-slate-500">Evidence</p>
                    <ul className="space-y-1">
                      {defaultEvidence.map((e) => (
                        <li key={e.id} className="flex items-start gap-1">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 text-india-green" />
                          {e.title} · {e.sourceName}
                        </li>
                      ))}
                    </ul>
                    {a.assumptions && (
                      <>
                        <p className="font-semibold text-slate-500">Assumptions</p>
                        <ul className="list-inside list-disc">
                          {a.assumptions.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit trail timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <p className="text-sm text-slate-500">No audit entries yet.</p>
            ) : (
              <ol className="relative space-y-4 border-l-2 border-slate-200 pl-4">
                {filtered.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-navy-800" />
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {a.category}
                      </Badge>
                      <span className="text-[11px] text-slate-500">{formatDate(a.timestamp)}</span>
                    </div>
                    <p className="text-sm font-medium text-navy-900">{a.action}</p>
                    <p className="text-xs text-slate-600">{a.detail}</p>
                    <p className="text-[11px] text-slate-500">
                      {a.user} · {ROLE_LABELS[a.role]} · {a.modelVersion}
                    </p>
                    {a.reason && (
                      <p className="mt-1 text-xs italic text-slate-500">Reason: {a.reason}</p>
                    )}
                    {a.finalDecision && (
                      <p className="text-xs font-medium text-india-green">
                        Decision: {a.finalDecision}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
