import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  badgeColor?: 'default' | 'primary' | 'warning' | 'danger' | 'success' | 'gray' | 'sage';
  badgeVariant?: string;
}

export type FilamentTabItem = TabItem;

interface FilamentTabsProps {
  tabs?: TabItem[];
  items?: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'contained';
  id?: string;
  panelId?: string;
}

export const FilamentTabs: React.FC<FilamentTabsProps> = ({
  tabs,
  items,
  activeTab,
  onChange,
  className,
  variant = 'underline',
  id,
  panelId
}) => {
  const tabList = tabs || items || [];
  const contained = variant === 'contained';
  const navRef = React.useRef<HTMLElement>(null);
  return (
    <nav
      ref={navRef}
      id={id}
      role={contained ? 'tablist' : undefined}
      aria-label="Abas de navegação"
      className={cn(
        contained
          ? 'fi-tabs flex w-fit max-w-full items-center gap-1 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-hover)] p-1 overflow-x-auto select-none'
          : 'fi-tabs flex items-center gap-x-4 sm:gap-x-6 border-b border-slate-200 dark:border-slate-800 -mb-px overflow-x-auto scrollbar-none select-none',
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
            id={contained && id ? `${id}-${tab.id}` : undefined}
            aria-controls={contained ? panelId : undefined}
            tabIndex={contained ? (isActive ? 0 : -1) : undefined}
            onClick={() => onChange(tab.id)}
            onKeyDown={contained ? e => {
              if (e.altKey || e.ctrlKey || e.metaKey || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
              e.preventDefault();
              const index = tabList.findIndex(item => item.id === tab.id);
              const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabList.length - 1
                : (index + (e.key === 'ArrowRight' ? 1 : -1) + tabList.length) % tabList.length;
              const target = navRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
              onChange(tabList[next].id);
              target?.focus({ preventScroll: true });
              target?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            } : undefined}
            className={cn(
              contained
                ? 'group relative inline-flex h-8 items-center gap-1.5 px-3 rounded-lg text-xs font-medium transition-colors outline-none cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-inset'
                : 'group relative flex items-center gap-x-2 py-3 text-xs sm:text-sm font-medium transition-colors outline-none cursor-pointer border-b-2 whitespace-nowrap shrink-0',
              contained ? (isActive
                ? 'bg-[var(--color-surface-default)] text-[var(--color-text-link)] font-semibold shadow-2xs'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-default)] hover:text-[var(--color-text-primary)]') : isActive
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
