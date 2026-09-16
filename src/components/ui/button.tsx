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
          'bg-blue-600 text-white shadow-xs hover:bg-blue-500 focus-visible:ring-blue-600/50 dark:bg-blue-600 dark:hover:bg-blue-500 border border-blue-700/20',
        outlined:
          'bg-white text-blue-700 ring-1 ring-inset ring-blue-300 hover:bg-blue-50/70 focus-visible:ring-blue-600/50 dark:bg-slate-900 dark:text-blue-400 dark:ring-blue-700 dark:hover:bg-blue-950/40 shadow-xs',
      },
      gray: {
        solid:
          'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400/50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700/80 shadow-xs',
        outlined:
          'bg-transparent text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50/80 focus-visible:ring-slate-400/50 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800/80 shadow-xs',
      },
      danger: {
        solid:
          'bg-rose-600 text-white shadow-xs hover:bg-rose-500 focus-visible:ring-rose-600/50 dark:bg-rose-600 dark:hover:bg-rose-500 border border-rose-700/20',
        outlined:
          'bg-white text-rose-700 ring-1 ring-inset ring-rose-300 hover:bg-rose-50/80 focus-visible:ring-rose-600/50 dark:bg-slate-900 dark:text-rose-400 dark:ring-rose-800 dark:hover:bg-rose-950/40 shadow-xs',
      },
      warning: {
        solid:
          'bg-amber-600 text-white shadow-xs hover:bg-amber-500 focus-visible:ring-amber-600/50 dark:bg-amber-600 dark:hover:bg-amber-500 border border-amber-700/20',
        outlined:
          'bg-white text-amber-700 ring-1 ring-inset ring-amber-300 hover:bg-amber-50/80 focus-visible:ring-amber-600/50 dark:bg-slate-900 dark:text-amber-400 dark:ring-amber-800 dark:hover:bg-amber-950/40 shadow-xs',
      },
      success: {
        solid:
          'bg-emerald-600 text-white shadow-xs hover:bg-emerald-500 focus-visible:ring-emerald-600/50 dark:bg-emerald-600 dark:hover:bg-emerald-500 border border-emerald-700/20',
        outlined:
          'bg-white text-emerald-700 ring-1 ring-inset ring-emerald-300 hover:bg-emerald-50/80 focus-visible:ring-emerald-600/50 dark:bg-slate-900 dark:text-emerald-400 dark:ring-emerald-800 dark:hover:bg-emerald-950/40 shadow-xs',
      },
      info: {
        solid:
          'bg-sky-600 text-white shadow-xs hover:bg-sky-500 focus-visible:ring-sky-600/50 dark:bg-sky-600 dark:hover:bg-sky-500 border border-sky-700/20',
        outlined:
          'bg-white text-sky-700 ring-1 ring-inset ring-sky-300 hover:bg-sky-50/80 focus-visible:ring-sky-600/50 dark:bg-slate-900 dark:text-sky-400 dark:ring-sky-800 dark:hover:bg-sky-950/40 shadow-xs',
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

