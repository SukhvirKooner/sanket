import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-navy-900 text-white",
        secondary: "border-transparent bg-slate-100 text-slate-700",
        outline: "border-slate-300 text-slate-700",
        success: "border-transparent bg-india-green/15 text-india-green",
        warning: "border-amber-400 text-amber-700 bg-amber-50 border-dashed",
        saffron: "border-transparent bg-saffron/20 text-saffron-dark",
        danger: "border-transparent bg-red-100 text-red-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
