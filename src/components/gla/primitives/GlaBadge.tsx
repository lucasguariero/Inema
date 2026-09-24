import React from 'react';
import { cn } from '@/lib/utils';

export type GlaBadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'primary';
export type GlaBadgeSize = 'xs' | 'sm' | 'md';

export interface GlaBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: GlaBadgeVariant;
  size?: GlaBadgeSize;
  mono?: boolean;
  dot?: boolean;
}

export const GlaBadge: React.FC<GlaBadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'sm',
  mono = false,
  dot = false,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-md border tracking-tight select-none';

  const variants: Record<GlaBadgeVariant, string> = {
    primary: 'bg-[#0F4C3A]/10 text-[#0F4C3A] border-[#0F4C3A]/25 dark:bg-[#0F4C3A]/20 dark:text-emerald-300 dark:border-[#0F4C3A]/40',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const dotColors: Record<GlaBadgeVariant, string> = {
    primary: 'bg-[#0F4C3A]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-400',
  };

  const sizes: Record<GlaBadgeSize, string> = {
    xs: 'text-[10px] px-1.5 py-0.2 gap-1',
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        mono && 'font-mono text-slate-800 dark:text-slate-200',
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
