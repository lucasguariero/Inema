import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export type FilamentButtonColor = 'primary' | 'gray' | 'danger' | 'warning' | 'success' | 'info';
export type FilamentButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'default' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  color?: FilamentButtonColor;
  outlined?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'pill';
  size?: FilamentButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, color, outlined = false, variant, size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    // Map legacy variant to Filament color & outline if color is not explicitly specified
    let effectiveColor: FilamentButtonColor = color || 'primary';
    let isOutlined = outlined;

    if (!color && variant) {
      switch (variant) {
        case 'secondary':
          effectiveColor = 'gray';
          break;
        case 'outline':
          effectiveColor = 'gray';
          isOutlined = true;
          break;
        case 'destructive':
          effectiveColor = 'danger';
          isOutlined = true;
          break;
        case 'ghost':
          effectiveColor = 'gray';
          break;
        case 'pill':
          effectiveColor = 'gray';
          break;
        case 'default':
        default:
          effectiveColor = 'primary';
          break;
      }
    }

    // Filament base classes: fi-btn
    const baseStyles =
      'fi-btn relative inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-75 outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-1';

    // Filament color styles (Solid vs Outlined)
    const colorStyles: Record<FilamentButtonColor, { solid: string; outlined: string }> = {
      primary: {
        solid:
          'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-xs hover:bg-[var(--button-primary-bg-hover)] active:bg-[var(--button-primary-bg-active)] focus-visible:ring-[var(--color-green-alpha-32)] border border-transparent',
        outlined:
          'bg-[var(--button-secondary-bg)] text-[var(--color-text-link)] ring-1 ring-inset ring-[var(--button-secondary-border)] hover:bg-[var(--color-brand-primary-subtle)] focus-visible:ring-[var(--color-green-alpha-32)] shadow-xs',
      },
      gray: {
        solid:
          'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] ring-1 ring-inset ring-[var(--button-secondary-border)] hover:bg-[var(--button-secondary-bg-hover)] focus-visible:ring-[var(--color-border-focus)] shadow-xs',
        outlined:
          'bg-transparent text-[var(--button-secondary-text)] ring-1 ring-inset ring-[var(--button-secondary-border)] hover:bg-[var(--button-secondary-bg-hover)] focus-visible:ring-[var(--color-border-focus)] shadow-xs',
      },
      danger: {
        solid:
          'bg-[var(--color-status-critical)] text-white shadow-xs hover:bg-[var(--color-red-800)] focus-visible:ring-[var(--color-red-300)] border border-transparent',
        outlined:
          'bg-[var(--button-secondary-bg)] text-[var(--badge-critical-text)] ring-1 ring-inset ring-[var(--badge-critical-border)] hover:bg-[var(--badge-critical-bg)] focus-visible:ring-[var(--color-status-critical)] shadow-xs',
      },
      warning: {
        solid:
          'bg-[var(--color-status-warning)] text-white shadow-xs hover:bg-[var(--color-orange-800)] focus-visible:ring-[var(--color-orange-300)] border border-transparent',
        outlined:
          'bg-[var(--button-secondary-bg)] text-[var(--badge-warning-text)] ring-1 ring-inset ring-[var(--badge-warning-border)] hover:bg-[var(--badge-warning-bg)] focus-visible:ring-[var(--color-status-warning)] shadow-xs',
      },
      success: {
        solid:
          'bg-[var(--color-status-success)] text-white shadow-xs hover:bg-[var(--color-green-700)] focus-visible:ring-[var(--color-green-alpha-32)] border border-transparent',
        outlined:
          'bg-[var(--button-secondary-bg)] text-[var(--badge-success-text)] ring-1 ring-inset ring-[var(--badge-success-border)] hover:bg-[var(--badge-success-bg)] focus-visible:ring-[var(--color-status-success)] shadow-xs',
      },
      info: {
        solid:
          'bg-[var(--color-status-info)] text-white shadow-xs hover:bg-[var(--color-neutral-800)] focus-visible:ring-[var(--color-neutral-400)] border border-transparent',
        outlined:
          'bg-[var(--button-secondary-bg)] text-[var(--badge-info-text)] ring-1 ring-inset ring-[var(--badge-info-border)] hover:bg-[var(--badge-info-bg)] focus-visible:ring-[var(--color-status-info)] shadow-xs',
      },
    };

    // Filament standard sizes
    const sizeStyles: Record<FilamentButtonSize, string> = {
      xs: 'h-7 px-2 text-xs gap-1',
      sm: 'h-8 px-2.5 text-xs gap-1.5',
      default: 'h-9 px-3.5 py-2 text-xs sm:text-sm gap-2',
      md: 'h-9 px-3.5 py-2 text-xs sm:text-sm gap-2',
      lg: 'h-10 px-4 text-sm gap-2',
      xl: 'h-11 px-5 text-base gap-2.5',
      icon: 'h-8 w-8 p-0',
    };

    const variantClass = isOutlined
      ? colorStyles[effectiveColor].outlined
      : colorStyles[effectiveColor].solid;

    const hookColorClass = `fi-btn-color-${effectiveColor}`;
    const hookSizeClass = `fi-btn-size-${size}`;
    const hookOutlinedClass = isOutlined ? 'fi-btn-outlined' : '';

    return (
      <Comp
        className={cn(
          baseStyles,
          hookColorClass,
          hookSizeClass,
          hookOutlinedClass,
          variantClass,
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
