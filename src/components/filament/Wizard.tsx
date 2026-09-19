import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface WizardStep {
  id: string | number;
  label: string;
}

export interface FilamentWizardProps {
  steps: WizardStep[];
  currentStep: number; // 0-indexed or 1-indexed
  onStepClick?: (stepNumber: number) => void;
  className?: string;
}

export function FilamentWizard({
  steps,
  currentStep,
  onStepClick,
  className
}: FilamentWizardProps) {
  // Support both 0-indexed and 1-indexed
  const activeIndex = currentStep >= 1 && currentStep <= steps.length && !steps.some(s => s.id === 0)
    ? currentStep - 1
    : currentStep;

  return (
    <ol
      role="list"
      className={cn(
        'fi-sc-wizard-header flex items-stretch overflow-x-auto border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 select-none scrollbar-none',
        className
      )}
    >
      {steps.map((step, idx) => {
        const isActive = idx === activeIndex;
        const isCompleted = idx < activeIndex;

        return (
          <li
            key={step.id}
            className={cn(
              'fi-sc-wizard-header-step relative flex-1 flex items-center min-w-[140px] sm:min-w-[170px] h-[72px]',
              isActive && 'fi-active',
              isCompleted && 'fi-completed'
            )}
          >
            <button
              type="button"
              onClick={() => onStepClick && onStepClick(idx + 1)}
              disabled={!onStepClick}
              className={cn(
                'fi-sc-wizard-header-step-btn flex items-center gap-3 px-4 sm:px-5 py-3.5 w-full h-full text-left transition-colors',
                onStepClick ? 'cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/50' : 'cursor-default'
              )}
            >
              {/* Step Circle */}
              <div
                className={cn(
                  'fi-sc-wizard-header-step-icon-ctn w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0 transition-colors',
                  isActive
                    ? 'border-2 border-[#005B52] text-[#005B52] bg-white dark:bg-gray-900'
                    : isCompleted
                    ? 'border-2 border-[#005B52] bg-[#005B52] text-white'
                    : 'border-2 border-gray-300 text-gray-400 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                ) : (
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="fi-sc-wizard-header-step-text flex flex-col justify-center min-w-0 pr-2">
                <span
                  className={cn(
                    'fi-sc-wizard-header-step-label text-xs sm:text-sm truncate whitespace-nowrap',
                    isActive
                      ? 'font-bold text-gray-900 dark:text-white'
                      : isCompleted
                      ? 'font-medium text-gray-700 dark:text-gray-300'
                      : 'font-normal text-gray-500 dark:text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
            </button>

            {/* Active bottom border indicator (exact Filament design) */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#005B52]" />
            )}

            {/* Separator Chevron SVG (exact GLA design) */}
            {idx < steps.length - 1 && (
              <svg
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 22 80"
                aria-hidden="true"
                className="fi-sc-wizard-header-step-separator absolute right-0 top-0 bottom-0 h-full w-4 sm:w-5 text-gray-200 dark:text-gray-700 pointer-events-none select-none shrink-0"
              >
                <path
                  d="M0 -2L20 40L0 82"
                  strokeLinejoin="round"
                  stroke="currentColor"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
          </li>
        );
      })}
    </ol>
  );
}
