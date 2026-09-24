import { Badge } from "@/components/ui/badge";
import type { ConfidenceLevel, PlanStatus, SourceType } from "@/types";
import { cn } from "@/lib/utils";

export function ConfidenceChip({
  level,
  value,
  className,
}: {
  level: ConfidenceLevel;
  value?: number;
  className?: string;
}) {
  const color =
    level === "High"
      ? "bg-india-green/15 text-india-green border-india-green/30"
      : level === "Medium"
        ? "bg-amber-50 text-amber-700 border-amber-300"
        : "bg-red-50 text-red-700 border-red-300";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        color,
        className
      )}
    >
      {level}
      {value !== undefined && <span>· {value}%</span>}
    </span>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="success" className={cn("border border-india-green/40", className)}>
      Verified
    </Badge>
  );
}

export function EstimatedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="warning" className={className}>
      Estimated
    </Badge>
  );
}

export function DataSourceBadge({
  type,
  name,
  className,
}: {
  type: SourceType;
  name?: string;
  className?: string;
}) {
  const variant =
    type === "PUBLIC" ? "success" : type === "PARTNER" ? "secondary" : "saffron";
  return (
    <Badge variant={variant as "success" | "secondary" | "saffron"} className={className} title={name}>
      {type}
      {name ? ` · ${name}` : ""}
    </Badge>
  );
}

export function StatusPill({ status }: { status: PlanStatus }) {
  const map: Record<PlanStatus, "secondary" | "saffron" | "success" | "default" | "danger" | "warning"> = {
    Draft: "secondary",
    "Pending approval": "saffron",
    Approved: "success",
    "In progress": "default",
    Rejected: "danger",
    Modified: "warning",
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

export function SyntheticFooterBadge() {
  return (
    <span className="inline-flex items-center rounded border border-dashed border-saffron/60 bg-saffron/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-saffron-dark">
      SYNTHETIC DATA · Demo
    </span>
  );
}
