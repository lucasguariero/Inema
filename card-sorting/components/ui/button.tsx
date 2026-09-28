import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[#0F4C3A] text-white hover:bg-[#0b382b] shadow-xs active:scale-[0.99]",
      destructive: "bg-rose-600 text-white hover:bg-rose-700 shadow-xs",
      outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
      secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
      ghost: "hover:bg-slate-100 text-slate-700",
      link: "text-[#0F4C3A] underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-9 px-4 py-2 text-sm",
      sm: "h-8 rounded-md px-3 text-xs font-medium",
      lg: "h-11 rounded-lg px-8 text-base font-semibold",
      icon: "h-9 w-9",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0F4C3A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
