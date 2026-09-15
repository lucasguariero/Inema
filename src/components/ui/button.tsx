import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'pill';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C3A]/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer select-none';

    const variantStyles = {
      default:
        'bg-gradient-to-b from-[#145A45] to-[#0F4C3A] text-white shadow-[0_1px_3px_rgba(15,76,58,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-[#17664f] hover:to-[#125441] hover:shadow-[0_4px_12px_rgba(15,76,58,0.25)] border border-[#0A3528]/40',
      secondary:
        'bg-[#E2ECE9]/80 text-[#0F4C3A] hover:bg-[#CBDED8] font-bold border border-[#CBDED8]/60 shadow-2xs',
      outline:
        'border border-slate-200/90 bg-white/90 text-slate-700 hover:bg-slate-50/80 hover:text-slate-900 hover:border-slate-300 shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
      ghost:
        'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
      destructive:
        'bg-rose-50 text-rose-600 border border-rose-200/80 hover:bg-rose-100/90 hover:border-rose-300 shadow-2xs',
      pill:
        'rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-medium',
    };

    const sizeStyles = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-lg px-3 text-xs',
      lg: 'h-11 rounded-xl px-6 text-base',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <Comp
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
