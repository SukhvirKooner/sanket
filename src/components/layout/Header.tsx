"use client";

import { Bell, ChevronDown, Compass, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore, TOUR_STEPS } from "@/store/useAppStore";
import { t } from "@/lib/i18n";
import { ROLE_LABELS } from "@/lib/roles";
import type { Role } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function Header() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const modelVersion = useAppStore((s) => s.modelVersion);
  const guidedTour = useAppStore((s) => s.guidedTour);
  const setGuidedTour = useAppStore((s) => s.setGuidedTour);
  const tourStep = useAppStore((s) => s.tourStep);
  const notifications = useAppStore((s) => s.notifications);
  const markRead = useAppStore((s) => s.markNotificationsRead);
  const switchRole = useAppStore((s) => s.switchRole);
  const logout = useAppStore((s) => s.logout);

  const unread = notifications.filter((n) => !n.read).length;
  const coach = TOUR_STEPS[tourStep];

  return (
    <header className="relative z-40 border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center justify-between gap-4 px-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy-900">{t("appName", locale)}</p>
          <p className="truncate text-[11px] text-slate-500">{t("ministry", locale)}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden font-mono text-[10px] md:inline-flex">
            {modelVersion}
          </Badge>

          <div className="flex items-center gap-1 rounded-md border border-slate-200 p-0.5 text-xs">
            <button
              type="button"
              className={`rounded px-2 py-1 font-medium ${locale === "en" ? "bg-navy-900 text-white" : "text-slate-600"}`}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`rounded px-2 py-1 font-medium ${locale === "hi" ? "bg-navy-900 text-white" : "text-slate-600"}`}
              onClick={() => setLocale("hi")}
              style={{ fontFamily: "var(--font-devanagari), sans-serif" }}
            >
              हिंदी
            </button>
          </div>

          <div className="hidden items-center gap-2 rounded-md border border-slate-200 px-2 py-1 lg:flex">
            <Compass className="h-3.5 w-3.5 text-saffron" />
            <span className="text-xs text-slate-600">{t("guidedTour", locale)}</span>
            <Switch checked={guidedTour} onCheckedChange={setGuidedTour} aria-label="Guided tour" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative rounded-md p-2 hover:bg-slate-100"
                aria-label="Notifications"
                onClick={() => markRead()}
              >
                <Bell className="h-4 w-4 text-navy-800" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-saffron" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="text-xs">
                  {n.message}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1.5 hover:bg-slate-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-xs text-white">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-navy-900">{user?.name}</p>
                  <p className="text-[10px] text-slate-500">
                    {user ? ROLE_LABELS[user.role] : ""}
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t("switchRole", locale)}</DropdownMenuLabel>
              {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                <DropdownMenuItem key={r} onClick={() => switchRole(r)}>
                  {ROLE_LABELS[r]}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                {t("logout", locale)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tricolor accent */}
      <div className="flex h-1 w-full">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-india-green" />
      </div>

      {guidedTour && coach && (
        <div className="border-b border-saffron/40 bg-saffron/10 px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <p className="font-medium text-navy-900">
              <span className="text-saffron-dark">Tour step {tourStep + 1}/{TOUR_STEPS.length}:</span>{" "}
              {coach.title} — {coach.hint}
            </p>
            <Link href={coach.href} className="font-semibold text-navy-800 underline">
              Go →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
