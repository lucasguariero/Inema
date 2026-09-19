import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  badgeColor?: 'default' | 'primary' | 'warning' | 'danger';
}

interface FilamentTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const FilamentTabs: React.FC<FilamentTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className
}) => {
  return (
    <nav
      aria-label="Abas de navegação"
      className={cn(
        'fi-tabs flex items-center gap-x-6 border-b border-slate-200 dark:border-slate-800 -mb-px',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'group relative flex items-center gap-x-2 py-3 text-sm font-medium transition-colors outline-none cursor-pointer border-b-2',
              isActive
                ? 'border-[#0F4C3A] text-[#0F4C3A] dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-[11px] font-medium rounded-full leading-none transition-colors',
                  isActive
                    ? 'bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
