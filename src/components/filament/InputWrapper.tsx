import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
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
    return (
      <div
        ref={ref}
        className={cn(
          'fi-input-wrp flex items-center rounded-lg shadow-2xs ring-1 ring-inset transition-colors duration-75 overflow-hidden',
          valid
            ? 'ring-slate-300 dark:ring-slate-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 dark:focus-within:ring-blue-500 bg-white dark:bg-slate-900'
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
  }
);

InputWrapper.displayName = 'InputWrapper';
