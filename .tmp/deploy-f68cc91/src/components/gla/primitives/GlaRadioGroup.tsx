import React from 'react';
import { cn } from '@/lib/utils';

export interface GlaRadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface GlaRadioGroupProps {
  name: string;
  label?: string;
  options: GlaRadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  direction?: 'vertical' | 'horizontal';
}

export const GlaRadioGroup: React.FC<GlaRadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  className,
  direction = 'vertical',
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}

      <div
        className={cn(
          'gap-3',
          direction === 'vertical' ? 'flex flex-col space-y-1' : 'flex flex-wrap items-center'
        )}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          const inputId = `${name}-${opt.value}`;

          return (
            <label
              key={opt.value}
              htmlFor={inputId}
              className={cn(
                'flex items-start gap-2.5 cursor-pointer select-none text-xs',
                opt.disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  id={inputId}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => onChange(opt.value)}
                  className="peer sr-only"
                />
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border transition-colors flex items-center justify-center',
                    'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-2xs',
                    'peer-checked:border-[#0F4C3A]',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-[#0F4C3A]/30'
                  )}
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full bg-[#0F4C3A] transition-transform scale-0',
                      isSelected && 'scale-100'
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <span
                  className={cn(
                    'font-medium text-slate-800 dark:text-slate-200 leading-tight',
                    isSelected && 'font-semibold text-slate-900 dark:text-white'
                  )}
                >
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
