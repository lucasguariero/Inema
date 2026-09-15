import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  dot?: boolean;
}

function Badge({ className, variant = 'default', dot = false, children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[#0F4C3A] text-white border-transparent shadow-2xs',
    secondary: 'bg-[#E2ECE9] text-[#0F4C3A] border-[#CBDED8]/70 font-semibold',
    outline: 'border-slate-200 bg-white text-slate-700 shadow-2xs',
    emerald: 'bg-emerald-50/90 text-emerald-800 border-emerald-200/80 shadow-2xs',
    amber: 'bg-amber-50/90 text-amber-800 border-amber-200/80 shadow-2xs',
    rose: 'bg-rose-50/90 text-rose-700 border-rose-200/80 shadow-2xs',
    blue: 'bg-sky-50/90 text-sky-800 border-sky-200/80 shadow-2xs',
    purple: 'bg-purple-50/90 text-purple-800 border-purple-200/80 shadow-2xs',
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
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span
            className={cn('absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping', dotColors[variant])}
          />
          <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', dotColors[variant])} />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}

export { Badge };
