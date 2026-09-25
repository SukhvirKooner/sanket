"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceChip, DataSourceBadge } from "@/components/shared/Badges";
import { LockButton } from "@/components/shared/LockButton";
import { formatCrore } from "@/lib/formatters";
import { useAppStore } from "@/store/useAppStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECTORS } from "@/data/geography";
import type { EconomicEvent } from "@/types";
import { cn } from "@/lib/utils";

export default function SignalsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SignalsContent />
    </Suspense>
  );
}

function SignalsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const highlight = params.get("highlight");
  const storeEvents = useAppStore((s) => s.events);
  const setSelectedEventId = useAppStore((s) => s.setSelectedEventId);
  const completeStep = useAppStore((s) => s.completeStep);
  const role = useAppStore((s) => s.user?.role);
  const advanceDemo = useAppStore((s) => s.advanceDemo);

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [sector, setSector] = useState("All");
  const [impact, setImpact] = useState("All");

  useEffect(() => {
    completeStep("signal");
    api.getEvents().then((d) => {
      // merge store-created events
      const ids = new Set(d.map((e) => e.id));
      const extra = storeEvents.filter((e) => !ids.has(e.id));
      setEvents([...extra, ...d]);
      setLoading(false);
    });
  }, [completeStep, storeEvents]);

  const filtered = useMemo(() => {
    let list = events;
    if (role === "employer") {
      list = list.filter((e) => e.ownerId === "employer" || e.id === "evt-semiconductor" || e.id === "evt-ev-pune");
    }
    if (sector !== "All") list = list.filter((e) => e.sector === sector);
    if (impact !== "All") list = list.filter((e) => e.workforceImpact === impact);
    return list;
  }, [events, sector, impact, role]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Economic Signals</h1>
          <p className="text-xs text-slate-500">Investment and project events driving workforce demand</p>
        </div>
        <LockButton action="createEvent" variant="saffron" onClick={() => router.push("/signals/create")}>
          <Plus className="h-4 w-4" /> Create Economic Event
        </LockButton>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Sector" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All sectors</SelectItem>
            {SECTORS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={impact} onValueChange={setImpact}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Impact" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All impact</SelectItem>
            <SelectItem value="HIGH">HIGH</SelectItem>
            <SelectItem value="MEDIUM">MEDIUM</SelectItem>
            <SelectItem value="LOW">LOW</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((e) => (
          <Card
            key={e.id}
            className={cn(
              "transition hover:shadow-md",
              highlight === e.id && "ring-2 ring-saffron"
            )}
          >
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-navy-900">{e.name}</h3>
                  <p className="text-xs text-slate-500">
                    {e.location} · {e.sector}
                  </p>
                </div>
                <Badge variant={e.workforceImpact === "HIGH" ? "saffron" : "secondary"}>
                  Impact: {e.workforceImpact}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                <span className="font-semibold text-navy-900">{formatCrore(e.investmentCr, 0)}</span>
                <span>Operational in {e.operationalMonths} months</span>
                <ConfidenceChip level={e.confidenceLevel} value={e.confidence} />
              </div>
              <div className="flex items-center justify-between">
                <DataSourceBadge type={e.meta.sourceType} name={e.meta.sourceName} />
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedEventId(e.id);
                    completeStep("signal");
                    if (e.id === "evt-semiconductor") advanceDemo();
                    router.push(`/signals/${e.id}`);
                  }}
                >
                  Analyse
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-slate-500">No events match filters.{" "}
          <Link href="/signals/create" className="underline">Create one</Link>
        </p>
      )}
    </div>
  );
}
