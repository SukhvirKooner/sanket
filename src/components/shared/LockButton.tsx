"use client";

import { Lock } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppStore } from "@/store/useAppStore";
import { canAct } from "@/lib/roles";
import { t } from "@/lib/i18n";

export function LockButton({
  action,
  children,
  ...props
}: ButtonProps & { action: string }) {
  const role = useAppStore((s) => s.user?.role ?? "government_planner");
  const locale = useAppStore((s) => s.locale);
  const allowed = canAct(role, action);

  if (allowed) {
    return <Button {...props}>{children}</Button>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button {...props} disabled className="opacity-60">
              <Lock className="h-3.5 w-3.5" />
              {children}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{t("notPermitted", locale)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
