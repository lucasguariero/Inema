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
      'bg-[var(--color-brand-primary-subtle)] text-[var(--color-brand-primary)] ring-[var(--color-green-alpha-20)]',
    gray:
      'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] ring-[var(--badge-info-border)]',
    danger:
      'bg-[var(--badge-critical-bg)] text-[var(--badge-critical-text)] ring-[var(--badge-critical-border)]',
    warning:
      'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] ring-[var(--badge-warning-border)]',
    success:
      'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] ring-[var(--badge-success-border)]',
    info:
      'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] ring-[var(--badge-info-border)]',
  };

  const sizeStyles: Record<FilamentBadgeSize, string> = {
    xs: 'px-1.5 py-0.2 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const dotColors: Record<FilamentBadgeColor, string> = {
    primary: 'bg-[var(--color-brand-primary)]',
    gray: 'bg-[var(--color-status-info)]',
    danger: 'bg-[var(--color-status-critical)]',
    warning: 'bg-[var(--color-status-warning)]',
    success: 'bg-[var(--color-status-success)]',
    info: 'bg-[var(--color-status-info)]',
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
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[effectiveColor])} />
      )}
      {children}
    </div>
  );
}

export { Badge };
