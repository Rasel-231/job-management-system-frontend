"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type TCheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = forwardRef<HTMLInputElement, TCheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 cursor-pointer rounded border-input accent-primary",
        className
      )}
      {...props}
    />
  )
);

Checkbox.displayName = "Checkbox";