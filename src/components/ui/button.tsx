import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

type TButtonVariant = "default" | "outline" | "destructive" | "ghost";
type TButtonSize = "default" | "sm";

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: TButtonVariant;
  size?: TButtonSize;
};

const variantClasses: Record<TButtonVariant, string> = {
  default: "bg-black text-white hover:bg-gray-800",
  outline: "border border-gray-300 bg-white hover:bg-gray-50",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  ghost: "hover:bg-gray-100",
};

const sizeClasses: Record<TButtonSize, string> = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
};

export const Button = forwardRef<HTMLButtonElement, TButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
