import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type GlaButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type GlaButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface GlaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlaButtonVariant;
  size?: GlaButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const GlaButton = React.forwardRef<HTMLButtonElement, GlaButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'sm',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-md transition-colors cursor-pointer select-none focus:outline-hidden focus:ring-2 focus:ring-offset-1 focus:ring-[#0F4C3A]/30 disabled:opacity-60 disabled:cursor-not-allowed';

    const variants: Record<GlaButtonVariant, string> = {
      primary:
        'bg-[#0F4C3A] hover:bg-[#0c3d2e] active:bg-[#092e22] text-white shadow-2xs border border-transparent',
      outline:
        'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs',
      ghost:
        'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent',
      danger:
        'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-2xs border border-transparent',
    };

    const sizes: Record<GlaButtonSize, string> = {
      xs: 'text-[11px] px-2 py-0.5 gap-1',
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-xs sm:text-sm px-3.5 py-2 gap-2',
      lg: 'text-sm px-4 py-2.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-current" />
            <span>Carregando...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

GlaButton.displayName = 'GlaButton';
