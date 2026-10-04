"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, GraduationCap, Landmark, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/useAppStore";
import { ROLE_LABELS } from "@/lib/roles";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

const QUICK: { role: Role; icon: React.ElementType; desc: string }[] = [
  { role: "government_planner", icon: Landmark, desc: "Full planning journey" },
  { role: "training_authority", icon: GraduationCap, desc: "Centres & seats" },
  { role: "employer", icon: Building2, desc: "Own projects & hires" },
  { role: "administrator", icon: Shield, desc: "Admin + audit" },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState("ananya.sharma@msde.gov.in");
  const [password, setPassword] = useState("sanket");
  const [role, setRole] = useState<Role>("government_planner");

  const doLogin = (r: Role = role) => {
    login(r, email);
    router.push("/control-room");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-900 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,153,51,0.15),_transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-saffron text-xs font-bold text-saffron">
              Ash
            </div>
            <div>
              <p className="text-lg font-semibold">SANKET</p>
              <p className="text-xs text-slate-300">Workforce Command Centre</p>
            </div>
          </div>

          <div className="my-10 max-w-lg space-y-6">
            <div className="flex gap-2">
              {["Signal", "Forecast", "Capability", "Activate"].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35 }}
                  className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200"
                >
                  {step}
                </motion.div>
              ))}
            </div>
            <h1 className="text-3xl font-bold leading-tight">
              Turning economic signals into workforce action
            </h1>
            <p className="max-w-sm text-sm text-slate-300">
              See · Predict · Analyze · Transform · Optimize · Simulate · Approve · Monitor
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Ministry of Skill Development & Entrepreneurship
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center bg-slate-50 px-6 py-10">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Sign in</CardTitle>
            <p className="text-xs text-slate-500">Any credentials work · Pilot authentication</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email / ID</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="saffron" className="w-full" onClick={() => doLogin()}>
              Enter Command Centre
            </Button>

            <div className="pt-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quick login
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK.map(({ role: r, icon: Icon, desc }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => doLogin(r)}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-md border border-slate-200 bg-white p-3 text-left hover:border-navy-800 hover:shadow-sm",
                      r === "government_planner" && "border-saffron/50 bg-saffron/5"
                    )}
                  >
                    <Icon className="h-4 w-4 text-navy-800" />
                    <span className="text-xs font-semibold text-navy-900">{ROLE_LABELS[r]}</span>
                    <span className="text-[10px] text-slate-500">{desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-[11px] text-slate-500">
          Synthetic data · Pilot build · Ministry of Skill Development & Entrepreneurship
        </p>
      </div>
    </div>
  );
}
