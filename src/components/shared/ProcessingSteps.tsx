"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ProcessingSteps({
  steps,
  onComplete,
  intervalMs = 700,
}: {
  steps: string[];
  onComplete?: () => void;
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (active >= steps.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete?.();
      }
      return;
    }
    const t = setTimeout(() => setActive((a) => a + 1), intervalMs);
    return () => clearTimeout(t);
  }, [active, steps.length, intervalMs, onComplete]);

  return (
    <div className="mx-auto max-w-md space-y-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-navy-900">Processing…</p>
      <ul className="space-y-2">
        {steps.map((step, i) => {
          const done = i < active;
          const current = i === active && active < steps.length;
          return (
            <motion.li
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm"
            >
              {done || active >= steps.length ? (
                <CheckCircle2 className="h-4 w-4 text-india-green" />
              ) : current ? (
                <Loader2 className="h-4 w-4 animate-spin text-saffron" />
              ) : (
                <span className="h-4 w-4 rounded-full border border-slate-300" />
              )}
              <span
                className={
                  done || active >= steps.length
                    ? "text-slate-700"
                    : current
                      ? "font-medium text-navy-900"
                      : "text-slate-400"
                }
              >
                {step}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
