import React from 'react';
import { cn } from '@/lib/utils';

export interface GlaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefixText?: string;
  suffixText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const GlaInput = React.forwardRef<HTMLInputElement, GlaInputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      prefixText,
      suffixText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 leading-tight"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'h-9 flex items-center rounded-md border bg-white dark:bg-slate-800 transition-colors shadow-2xs overflow-hidden',
            error
              ? 'border-rose-400 focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 focus-within:border-[#0F4C3A] focus-within:ring-2 focus-within:ring-[#0F4C3A]/20',
            disabled && 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed opacity-60'
          )}
        >
          {leftIcon && (
            <span className="pl-2.5 pr-1 text-slate-400 dark:text-slate-500 shrink-0">
              {leftIcon}
            </span>
          )}

          {prefixText && (
            <span className="h-full flex items-center px-2.5 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-medium select-none shrink-0">
              {prefixText}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'h-full w-full px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 bg-transparent focus:outline-none disabled:cursor-not-allowed leading-normal',
              className
            )}
            {...props}
          />

          {suffixText && (
            <span className="h-full flex items-center px-2.5 bg-slate-50 dark:bg-slate-900/60 border-l border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-medium select-none shrink-0">
              {suffixText}
            </span>
          )}

          {rightIcon && (
            <span className="pr-2.5 pl-1 text-slate-400 dark:text-slate-500 shrink-0">
              {rightIcon}
            </span>
          )}
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

GlaInput.displayName = 'GlaInput';
