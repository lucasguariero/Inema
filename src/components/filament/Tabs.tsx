import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  badgeColor?: 'default' | 'primary' | 'warning' | 'danger';
}

export type FilamentTabItem = TabItem;

interface FilamentTabsProps {
  tabs?: TabItem[];
  items?: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const FilamentTabs: React.FC<FilamentTabsProps> = ({
  tabs,
  items,
  activeTab,
  onChange,
  className
}) => {
  const tabList = tabs || items || [];
  return (
    <nav
      aria-label="Abas de navegação"
      className={cn(
        'fi-tabs flex items-center gap-x-6 border-b border-slate-200 dark:border-slate-800 -mb-px',
        className
      )}
    >
      {tabList.map((tab) => {
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
                ? 'border-[var(--color-border-focus)] text-[var(--color-text-link)] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-[11px] font-medium rounded-full leading-none transition-colors',
                  isActive
                    ? 'bg-[var(--color-brand-primary-subtle)] text-[var(--color-text-link)]'
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
