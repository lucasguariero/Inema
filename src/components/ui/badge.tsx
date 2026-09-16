import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  dot?: boolean;
}

function Badge({ className, variant = 'default', dot = false, children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[#0F4C3A] text-white border-transparent shadow-2xs dark:bg-emerald-900/80 dark:text-emerald-200 dark:border-emerald-700/50',
    secondary: 'bg-[#E2ECE9] text-[#0F4C3A] border-[#CBDED8]/70 font-semibold dark:bg-slate-800 dark:text-emerald-300 dark:border-slate-700',
    outline: 'border-slate-200 bg-white text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300',
    emerald: 'bg-emerald-50/90 text-emerald-800 border-emerald-200/80 shadow-2xs dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
    amber: 'bg-amber-50/90 text-amber-800 border-amber-200/80 shadow-2xs dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
    rose: 'bg-rose-50/90 text-rose-700 border-rose-200/80 shadow-2xs dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60',
    blue: 'bg-sky-50/90 text-sky-800 border-sky-200/80 shadow-2xs dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60',
    purple: 'bg-purple-50/90 text-purple-800 border-purple-200/80 shadow-2xs dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60',
  };

  const dotColors = {
    default: 'bg-white',
    secondary: 'bg-[#0F4C3A]',
    outline: 'bg-slate-400',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-sky-500',
    purple: 'bg-purple-500',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      <span>{children}</span>
    </div>
  );
}

export { Badge };
