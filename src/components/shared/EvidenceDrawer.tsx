"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ConfidenceChip, DataSourceBadge } from "./Badges";
import { formatDate } from "@/lib/formatters";
import type { SourceType } from "@/types";

export function EvidenceDrawer() {
  const open = useAppStore((s) => s.evidenceOpen);
  const payload = useAppStore((s) => s.evidencePayload);
  const close = useAppStore((s) => s.closeEvidence);
  const modelVersion = useAppStore((s) => s.modelVersion);
  const [expanded, setExpanded] = useState<string | null>("ev1");

  if (!payload) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-900/40" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between border-b border-slate-200 p-4">
            <div>
              <Dialog.Title className="text-base font-semibold text-navy-900">
                {payload.title || "Why this forecast?"}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-slate-500">
                Evidence, assumptions and model provenance
              </Dialog.Description>
            </div>
            <Dialog.Close className="rounded p-1 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Evidence
              </h4>
              <div className="space-y-2">
                {payload.evidence.map((item) => (
                  <div key={item.id} className="rounded-md border border-slate-200">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-navy-900 hover:bg-slate-50"
                      onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-india-green" />
                        {item.title}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition ${expanded === item.id ? "rotate-180" : ""}`}
                      />
                    </button>
                    {expanded === item.id && (
                      <div className="space-y-2 border-t border-slate-100 px-3 py-2 text-xs text-slate-600">
                        <p>{item.detail}</p>
                        <DataSourceBadge
                          type={item.sourceType as SourceType}
                          name={item.sourceName}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Assumptions
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                {payload.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Confidence
              </h4>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <ConfidenceChip
                  level={payload.confidence >= 75 ? "High" : payload.confidence >= 60 ? "Medium" : "Low"}
                  value={payload.confidence}
                />
                <p className="mt-2 text-xs text-slate-600">
                  Driven up by comparable project coverage and employer MoU signals; driven down by
                  regional labour elasticity uncertainty and long hiring horizon.
                </p>
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Model
              </h4>
              <div className="space-y-1 text-sm text-slate-700">
                <p className="font-medium text-navy-900">{payload.model || modelVersion}</p>
                <p className="text-xs text-slate-500">{formatDate(payload.timestamp)}</p>
                <p className="text-xs text-slate-500">Data version · dv-2026.09</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <DataSourceBadge type="PUBLIC" />
                  <DataSourceBadge type="PARTNER" />
                  <DataSourceBadge type="SYNTHETIC" />
                </div>
              </div>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
