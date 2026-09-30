import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GlaCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const GlaCheckbox = React.forwardRef<HTMLInputElement, GlaCheckboxProps>(
  ({ className, label, description, id, checked, disabled, onChange, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'flex items-start gap-2.5 cursor-pointer select-none text-xs',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded border transition-colors flex items-center justify-center',
              'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-2xs',
              'peer-checked:bg-[#0F4C3A] peer-checked:border-[#0F4C3A]',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[#0F4C3A]/30',
              className
            )}
          >
            <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="font-medium text-slate-800 dark:text-slate-200 leading-tight">
                {label}
              </span>
            )}
            {description && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

GlaCheckbox.displayName = 'GlaCheckbox';
