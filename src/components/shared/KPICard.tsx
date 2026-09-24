"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KPICard({
  label,
  value,
  delta,
  sparkline,
  accent,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  sparkline?: number[];
  accent?: "default" | "saffron" | "green" | "red";
  className?: string;
}) {
  const trend =
    delta?.startsWith("+") || delta?.startsWith("↑")
      ? "up"
      : delta?.startsWith("-") || delta?.startsWith("↓")
        ? "down"
        : "flat";

  const max = sparkline ? Math.max(...sparkline) : 1;
  const min = sparkline ? Math.min(...sparkline) : 0;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1",
          accent === "saffron" && "bg-saffron",
          accent === "green" && "bg-india-green",
          accent === "red" && "bg-red-500",
          (!accent || accent === "default") && "bg-navy-800"
        )}
      />
      <CardContent className="p-4 pl-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <div className="mt-1 flex items-end justify-between gap-2">
          <p className="text-2xl font-bold text-navy-900 tabular-nums">{value}</p>
          {sparkline && (
            <svg width="64" height="28" className="opacity-70" aria-hidden>
              <polyline
                fill="none"
                stroke="#0B1F3A"
                strokeWidth="1.5"
                points={sparkline
                  .map((v, i) => {
                    const x = (i / (sparkline.length - 1)) * 64;
                    const y = 26 - ((v - min) / (max - min || 1)) * 22;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
            </svg>
          )}
        </div>
        {delta && (
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              trend === "up" && "text-india-green",
              trend === "down" && "text-red-600",
              trend === "flat" && "text-slate-500"
            )}
          >
            {trend === "up" && <TrendingUp className="h-3 w-3" />}
            {trend === "down" && <TrendingDown className="h-3 w-3" />}
            {trend === "flat" && <Minus className="h-3 w-3" />}
            {delta}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
