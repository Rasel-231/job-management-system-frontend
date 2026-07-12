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
      "h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black/20",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";
