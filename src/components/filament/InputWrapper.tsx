import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
  prefix?: React.ReactNode;
  prefixIcon?: React.ElementType;
  suffix?: React.ReactNode;
  suffixIcon?: React.ElementType;
  disabled?: boolean;
  valid?: boolean;
}

export const InputWrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>(
  (
    {
      label,
      required,
      hint,
      prefix,
      prefixIcon: PrefixIcon,
      suffix,
      suffixIcon: SuffixIcon,
      disabled = false,
      valid = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const inputContent = (
      <div
        ref={ref}
        className={cn(
          'fi-input-wrp flex items-center rounded-lg shadow-2xs ring-1 ring-inset transition-colors duration-75 overflow-hidden',
          valid
            ? 'ring-slate-300 dark:ring-slate-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[var(--input-border-focus)] bg-white dark:bg-slate-900'
            : 'ring-rose-400 dark:ring-rose-600 focus-within:ring-2 focus-within:ring-inset focus-within:ring-rose-600 bg-rose-50/20 dark:bg-rose-950/20',
          disabled && 'bg-slate-100/70 dark:bg-slate-800/50 cursor-not-allowed opacity-75',
          className
        )}
        {...props}
      >
        {(PrefixIcon || prefix) && (
          <div className="fi-input-wrp-prefix flex items-center ps-3 text-slate-400 dark:text-slate-500 select-none shrink-0 text-xs sm:text-sm">
            {PrefixIcon && <PrefixIcon className="w-4 h-4 mr-1 text-slate-400" />}
            {prefix}
          </div>
        )}

        <div className="flex-1 min-w-0">{children}</div>

        {(SuffixIcon || suffix) && (
          <div className="fi-input-wrp-suffix flex items-center pe-3 text-slate-400 dark:text-slate-500 select-none shrink-0 text-xs sm:text-sm">
            {suffix}
            {SuffixIcon && <SuffixIcon className="w-4 h-4 ml-1 text-slate-400" />}
          </div>
        )}
      </div>
    );

    if (label) {
      return (
        <div className="space-y-1.5 w-full">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
          {inputContent}
          {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
        </div>
      );
    }

    return inputContent;
  }
);

InputWrapper.displayName = 'InputWrapper';
