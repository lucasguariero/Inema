import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      label,
      description,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isChecked = controlledChecked !== undefined ? controlledChecked : uncontrolledChecked;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const next = !isChecked;
      if (controlledChecked === undefined) {
        setUncontrolledChecked(next);
      }
      onCheckedChange?.(next);
      props.onClick?.(e);
    };

    const switchControl = (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        id={id}
        onClick={handleClick}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
          isChecked ? 'bg-[var(--color-brand-primary,#0F4C3A)]' : 'bg-slate-300 dark:bg-slate-700',
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-xs ring-0 transition-transform duration-200 ease-in-out',
            isChecked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
    );

    if (!label && !description) {
      return switchControl;
    }

    return (
      <div className="flex items-start gap-2.5 select-none">
        {switchControl}
        <div className="flex flex-col min-w-0">
          {label && (
            <label
              htmlFor={id}
              onClick={handleClick}
              className={cn(
                'text-xs sm:text-sm font-medium text-[var(--color-text-primary)] cursor-pointer leading-5 select-none',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <span className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] leading-4 mt-0.5 select-none">
              {description}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
