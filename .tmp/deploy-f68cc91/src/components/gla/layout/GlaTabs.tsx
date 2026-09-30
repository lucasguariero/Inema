import React from 'react';
import { cn } from '@/lib/utils';

export interface GlaTabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface GlaTabsProps {
  tabs: GlaTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'segmented' | 'underline';
}

export const GlaTabs: React.FC<GlaTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}) => {
  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs',
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-md transition-colors cursor-pointer select-none font-medium',
                isActive
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 text-[10px] font-mono rounded-full font-semibold',
                    isActive
                      ? 'bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Variant 'underline' (Padrão de abas de topo do Filament)
  return (
    <div className={cn('border-b border-slate-200 dark:border-slate-800', className)}>
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'group inline-flex items-center gap-2 py-3 px-1 border-b-2 text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors select-none',
                isActive
                  ? 'border-[#0F4C3A] text-[#0F4C3A] dark:text-emerald-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-[10px] font-mono rounded-full',
                    isActive
                      ? 'bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-950/80 dark:text-emerald-300 font-bold'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
