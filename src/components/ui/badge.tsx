import * as React from 'react';
import { cn } from '@/lib/utils';

export type FilamentBadgeColor = 'primary' | 'gray' | 'danger' | 'warning' | 'success' | 'info';
export type FilamentBadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: FilamentBadgeColor;
  size?: FilamentBadgeSize;
  variant?: 'default' | 'secondary' | 'outline' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  dot?: boolean;
}

function Badge({ className, color, size = 'sm', variant = 'default', dot = false, children, ...props }: BadgeProps) {
  // Map variant to Filament color
  let effectiveColor: FilamentBadgeColor = color || 'primary';

  if (!color && variant) {
    switch (variant) {
      case 'emerald':
        effectiveColor = 'success';
        break;
      case 'amber':
        effectiveColor = 'warning';
        break;
      case 'rose':
        effectiveColor = 'danger';
        break;
      case 'blue':
        effectiveColor = 'info';
        break;
      case 'secondary':
      case 'outline':
        effectiveColor = 'gray';
        break;
      case 'default':
      default:
        effectiveColor = 'primary';
        break;
    }
  }

  // Filament badge colors
  const colorStyles: Record<FilamentBadgeColor, string> = {
    primary:
      'bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30',
    gray:
      'bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    danger:
      'bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-400/30',
    warning:
      'bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/30',
    success:
      'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/30',
    info:
      'bg-sky-50 text-sky-700 ring-sky-600/10 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/30',
  };

  const sizeStyles: Record<FilamentBadgeSize, string> = {
    xs: 'px-1.5 py-0.2 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const dotColors: Record<FilamentBadgeColor, string> = {
    primary: 'bg-blue-500',
    gray: 'bg-slate-400',
    danger: 'bg-rose-500',
    warning: 'bg-amber-500',
    success: 'bg-emerald-500',
    info: 'bg-sky-500',
  };

  return (
    <div
      className={cn(
        'fi-badge inline-flex items-center justify-center gap-x-1 rounded-md ring-1 ring-inset font-medium tracking-tight transition-colors',
        `fi-badge-color-${effectiveColor}`,
        `fi-badge-size-${size}`,
        colorStyles[effectiveColor],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[effectiveColor])} />
      )}
      <span>{children}</span>
    </div>
  );
}

export { Badge };
