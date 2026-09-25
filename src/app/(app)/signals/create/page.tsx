"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProcessingSteps } from "@/components/shared/ProcessingSteps";
import { DISTRICTS, SECTORS, STATES } from "@/data/geography";
import { useAppStore } from "@/store/useAppStore";
import { uid, nowISO } from "@/lib/utils";
import type { EconomicEvent } from "@/types";

const ANALYSE_STEPS = [
  "Classifying sector",
  "Finding comparable projects",
  "Building occupation mix",
  "Mapping skills",
  "Regional adjustment",
  "Forecast ready",
];

export default function CreateEventPage() {
  const router = useRouter();
  const addEvent = useAppStore((s) => s.addEvent);
  const setSelectedEventId = useAppStore((s) => s.setSelectedEventId);
  const completeStep = useAppStore((s) => s.completeStep);
  const addAudit = useAppStore((s) => s.addAudit);

  const [processing, setProcessing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sector: "Electronics & Semiconductor",
    state: "Gujarat",
    district: "Ahmedabad",
    investmentCr: "91000",
    projectType: "Greenfield Manufacturing",
    expectedStart: "2026-04-01",
    operationalDate: "2027-10-01",
    technology: "",
    employer: "",
    expectedHiring: "2400",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onDrop = () => {
    setExtracting(true);
    setTimeout(() => {
      setForm({
        name: "Semiconductor Fabrication Facility",
        sector: "Electronics & Semiconductor",
        state: "Gujarat",
        district: "Ahmedabad",
        investmentCr: "91000",
        projectType: "Greenfield Manufacturing",
        expectedStart: "2026-04-01",
        operationalDate: "2027-10-01",
        technology: "300mm Wafer Fab · Advanced Nodes",
        employer: "Dholera Semi Fab Pvt Ltd",
        expectedHiring: "2400",
      });
      setExtracting(false);
      toast.success("AI extracted 7 fields from document");
    }, 1200);
  };

  const analyse = () => {
    const event: EconomicEvent = {
      id: uid("evt"),
      name: form.name || "New Economic Event",
      sector: form.sector,
      state: form.state,
      district: form.district,
      location: `${form.district}, ${form.state}`,
      investmentCr: Number(form.investmentCr) || 0,
      projectType: form.projectType,
      expectedStart: form.expectedStart,
      operationalDate: form.operationalDate,
      operationalMonths: 18,
      technology: form.technology,
      employer: form.employer,
      expectedHiring: Number(form.expectedHiring) || 0,
      workforceImpact: "HIGH",
      confidence: 72,
      confidenceLevel: "Medium",
      meta: {
        sourceType: "SYNTHETIC",
        sourceName: "Planner-created event",
        timestamp: nowISO(),
        dataVersion: "dv-2026.09",
        confidence: 72,
        confidenceLevel: "Medium",
      },
    };
    addEvent(event);
    setSelectedEventId(event.id);
    addAudit({
      action: "Economic event created",
      detail: event.name,
      category: "recommendation",
    });
    setProcessing(true);
  };

  if (processing) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <ProcessingSteps
          steps={ANALYSE_STEPS}
          onComplete={() => {
            completeStep("demand");
            // For demo consistency, route to semiconductor analysis
            router.push("/signals/evt-semiconductor");
          }}
        />
      </div>
    );
  }

  const districts = DISTRICTS[form.state] ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Create Economic Event</h1>
        <p className="text-xs text-slate-500">Capture a project signal for workforce impact analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Upload className="h-4 w-4" /> Supporting documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            onClick={onDrop}
            className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-600 hover:border-navy-800"
          >
            {extracting ? (
              <span className="flex items-center gap-2 text-navy-900">
                <Sparkles className="h-4 w-4 animate-pulse text-saffron" />
                AI extracting fields…
              </span>
            ) : (
              <>
                <Upload className="mb-2 h-6 w-6 text-slate-400" />
                Drag & drop MoU / DPR (or click) — demo will AI-extract 7 fields
              </>
            )}
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Project name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Semiconductor Fabrication Facility" />
          </div>
          <div className="space-y-1.5">
            <Label>Sector</Label>
            <Select value={form.sector} onValueChange={(v) => set("sector", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SECTORS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Project type</Label>
            <Input value={form.projectType} onChange={(e) => set("projectType", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>State</Label>
            <Select
              value={form.state}
              onValueChange={(v) => {
                set("state", v);
                set("district", DISTRICTS[v]?.[0] ?? "");
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>District</Label>
            <Select value={form.district} onValueChange={(v) => set("district", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Investment (₹ Cr)</Label>
            <Input value={form.investmentCr} onChange={(e) => set("investmentCr", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Expected hiring</Label>
            <Input value={form.expectedHiring} onChange={(e) => set("expectedHiring", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Expected start</Label>
            <Input type="date" value={form.expectedStart} onChange={(e) => set("expectedStart", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Expected operational</Label>
            <Input type="date" value={form.operationalDate} onChange={(e) => set("operationalDate", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Technology</Label>
            <Input value={form.technology} onChange={(e) => set("technology", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Employer / Owner</Label>
            <Input value={form.employer} onChange={(e) => set("employer", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push("/signals")}>Cancel</Button>
        <Button variant="saffron" onClick={analyse}>Analyse Workforce Impact</Button>
      </div>
    </div>
  );
}
