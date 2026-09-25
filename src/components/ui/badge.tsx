import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type TBadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";

const badgeVariants: Record<TBadgeVariant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  outline: "border-border text-foreground",
  success: "border-transparent bg-emerald-100 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
  warning: "border-transparent bg-amber-100 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
  info: "border-transparent bg-sky-100 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: TBadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}