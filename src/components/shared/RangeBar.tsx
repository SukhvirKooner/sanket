import { ConfidenceChip } from "./Badges";
import type { ConfidenceLevel } from "@/types";
import { formatNumber } from "@/lib/formatters";

export function RangeBar({
  low,
  base,
  high,
  confidence,
  confidenceLevel,
  label,
}: {
  low: number;
  base: number;
  high: number;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  label?: string;
}) {
  const span = high - low || 1;
  const basePct = ((base - low) / span) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-navy-900">
          {label ?? "Forecast range"}:{" "}
          <span className="tabular-nums">
            {formatNumber(low)} – {formatNumber(high)}
          </span>{" "}
          <span className="text-slate-500">(base {formatNumber(base)})</span>
        </p>
        <ConfidenceChip level={confidenceLevel} value={confidence} />
      </div>
      <div className="relative h-3 rounded-full bg-slate-100">
        <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-navy-700/30 via-navy-800/50 to-navy-700/30" />
        <div
          className="absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded bg-saffron shadow"
          style={{ left: `calc(${basePct}% - 2px)` }}
          title={`Base: ${formatNumber(base)}`}
        />
      </div>
      <div className="flex justify-between text-[11px] text-slate-500 tabular-nums">
        <span>{formatNumber(low)}</span>
        <span>base {formatNumber(base)}</span>
        <span>{formatNumber(high)}</span>
      </div>
    </div>
  );
}
