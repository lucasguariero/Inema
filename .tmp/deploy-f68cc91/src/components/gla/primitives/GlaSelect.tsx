import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GlaSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface GlaSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: GlaSelectOption[];
  placeholder?: string;
}

export const GlaSelect = React.forwardRef<HTMLSelectElement, GlaSelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      options,
      placeholder,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 leading-tight"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'h-9 relative flex items-center rounded-md border bg-white dark:bg-slate-800 transition-colors shadow-2xs overflow-hidden',
            error
              ? 'border-rose-400 focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 focus-within:border-[#0F4C3A] focus-within:ring-2 focus-within:ring-[#0F4C3A]/20',
            disabled && 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed opacity-60'
          )}
        >
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'h-full w-full appearance-none pl-3 pr-8 text-xs text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none cursor-pointer disabled:cursor-not-allowed leading-normal',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-400">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800"
              >
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>

        {hint && !error && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">{hint}</p>
        )}

        {error && (
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1 leading-tight">{error}</p>
        )}
      </div>
    );
  }
);

GlaSelect.displayName = 'GlaSelect';
