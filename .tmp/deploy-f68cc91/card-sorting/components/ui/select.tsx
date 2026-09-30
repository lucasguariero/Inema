import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-9 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-1.5 pr-8 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0F4C3A] focus-visible:border-[#0F4C3A] disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-2xs cursor-pointer",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-slate-500" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
