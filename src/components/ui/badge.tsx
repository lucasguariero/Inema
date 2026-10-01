import * as React from 'react';
import { cn } from '@/lib/utils';

export type FilamentBadgeColor = 'primary' | 'gray' | 'danger' | 'warning' | 'success' | 'info';
export type FilamentBadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: FilamentBadgeColor;
  size?: FilamentBadgeSize;
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'emerald'
    | 'amber'
    | 'rose'
    | 'blue'
    | 'purple'
    | 'success'
    | 'warning'
    | 'danger'
    | 'primary'
    | 'gray'
    | 'info';
  dot?: boolean;
  hasDot?: boolean;
}

function Badge({ className, color, size = 'sm', variant = 'default', dot = false, hasDot = false, children, ...props }: BadgeProps) {
  const showDot = dot || hasDot;
  // Map variant to Filament color
  let effectiveColor: FilamentBadgeColor = color || 'primary';

  if (!color && variant) {
    switch (variant) {
      case 'success':
      case 'emerald':
        effectiveColor = 'success';
        break;
      case 'warning':
      case 'amber':
        effectiveColor = 'warning';
        break;
      case 'danger':
      case 'rose':
        effectiveColor = 'danger';
        break;
      case 'info':
      case 'blue':
        effectiveColor = 'info';
        break;
      case 'gray':
      case 'secondary':
      case 'outline':
        effectiveColor = 'gray';
        break;
      case 'primary':
      case 'default':
      default:
        effectiveColor = 'primary';
        break;
    }
  }

  // Filament badge colors
  const colorStyles: Record<FilamentBadgeColor, string> = {
    primary:
      'bg-emerald-50 text-[#0F4C3A] ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-500/30',
    gray:
      'bg-slate-100 text-slate-700 ring-slate-300/60 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    danger:
      'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-500/30',
    warning:
      'bg-amber-50 text-amber-850 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-500/30',
    success:
      'bg-emerald-50 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-500/30',
    info:
      'bg-sky-50 text-sky-800 ring-sky-600/20 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-500/30',
  };

  const sizeStyles: Record<FilamentBadgeSize, string> = {
    xs: 'px-1.5 py-0.2 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const dotColors: Record<FilamentBadgeColor, string> = {
    primary: 'bg-[#0F4C3A] dark:bg-emerald-400',
    gray: 'bg-slate-500 dark:bg-slate-400',
    danger: 'bg-rose-600 dark:bg-rose-400',
    warning: 'bg-amber-600 dark:bg-amber-400',
    success: 'bg-emerald-600 dark:bg-emerald-400',
    info: 'bg-sky-600 dark:bg-sky-400',
  };

  return (
    <div
      className={cn(
        'fi-badge inline-flex items-center justify-center gap-x-1.5 whitespace-nowrap shrink-0 rounded-md ring-1 ring-inset font-medium tracking-tight transition-colors',
        `fi-badge-color-${effectiveColor}`,
        `fi-badge-size-${size}`,
        colorStyles[effectiveColor],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[effectiveColor])} />
      )}
      {children}
    </div>
  );
}

export { Badge };
