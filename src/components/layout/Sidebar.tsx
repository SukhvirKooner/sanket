"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  TrendingUp,
  Map,
  FlaskConical,
  GraduationCap,
  ClipboardList,
  GitBranch,
  CheckSquare,
  Activity,
  Target,
  FileSearch,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { NAV_KEYS, t } from "@/lib/i18n";
import { canAccess } from "@/lib/roles";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  "control-room": LayoutDashboard,
  signals: Radio,
  demand: TrendingUp,
  capability: Map,
  transformation: FlaskConical,
  training: GraduationCap,
  activation: ClipboardList,
  scenarios: GitBranch,
  approvals: CheckSquare,
  implementation: Activity,
  outcomes: Target,
  evidence: FileSearch,
  admin: Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const locale = useAppStore((s) => s.locale);
  const role = useAppStore((s) => s.user?.role ?? "government_planner");
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggle = useAppStore((s) => s.toggleSidebar);
  const planCount = useAppStore((s) => s.activationPlanCount);

  const items = NAV_KEYS.filter((n) => canAccess(role, n.id));

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-navy-900 text-white transition-all duration-200",
        collapsed ? "w-[68px]" : "w-60"
      )}
    >
      <div className="flex h-14 items-center justify-between px-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-saffron/50 bg-navy-800 text-[10px] font-bold text-saffron">
              Ash
            </div>
            <span className="text-sm font-semibold tracking-wide">SANKET</span>
          </div>
        )}
        <button
          type="button"
          onClick={toggle}
          className="rounded p-1.5 hover:bg-navy-800"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4" aria-label="Main">
        {items.map((item) => {
          const Icon = ICONS[item.id] ?? LayoutDashboard;
          const active =
            pathname === item.href ||
            (item.href !== "/control-room" && pathname.startsWith(item.href.split("?")[0]));
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-saffron/20 text-saffron"
                  : "text-slate-300 hover:bg-navy-800 hover:text-white"
              )}
              title={t(item.key, locale)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="truncate">
                  {t(item.key, locale)}
                  {item.id === "activation" && planCount > 0 && (
                    <span className="ml-1 rounded bg-saffron px-1.5 text-[10px] font-bold text-navy-900">
                      {planCount}
                    </span>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
