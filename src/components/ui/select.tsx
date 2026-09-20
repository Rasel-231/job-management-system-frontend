"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

// Minimal native <select> wrapper — no Radix dependency, keeps the project
// buildable without a package registry round-trip for shadcn primitives.
export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-10 rounded-lg border border-input bg-card px-3 text-sm shadow-sm transition-colors",
      "hover:border-muted-foreground/40",
      "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";
