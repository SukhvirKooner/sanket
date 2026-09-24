"use client";

import Link from "next/link";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useAppStore, WORKFLOW_STEPS } from "@/store/useAppStore";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function WorkflowStepper() {
  const completed = useAppStore((s) => s.completedSteps);
  const current = useAppStore((s) => s.currentWorkflowStep);
  const collapsed = useAppStore((s) => s.stepperCollapsed);
  const toggle = useAppStore((s) => s.toggleStepper);
  const locale = useAppStore((s) => s.locale);

  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between px-3 py-2 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t("workflowProgress", locale)}
        </span>
        {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
      {!collapsed && (
        <div className="flex gap-1 overflow-x-auto px-3 pb-3">
          {WORKFLOW_STEPS.map((step, i) => {
            const done = completed.includes(step.id);
            const isCurrent = current === step.id;
            return (
              <Link
                key={step.id}
                href={step.href}
                className={cn(
                  "flex min-w-[88px] flex-col items-center gap-1 rounded-md border px-2 py-2 text-center transition",
                  done && "border-india-green/40 bg-india-green/5",
                  isCurrent && !done && "border-saffron bg-saffron/10",
                  !done && !isCurrent && "border-slate-200 bg-slate-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    done && "bg-india-green text-white",
                    isCurrent && !done && "bg-saffron text-navy-900",
                    !done && !isCurrent && "bg-slate-200 text-slate-600"
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="text-[10px] font-medium leading-tight text-navy-900">
                  {step.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
