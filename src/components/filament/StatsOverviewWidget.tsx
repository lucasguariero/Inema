import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StatItem {
  id?: string;
  label: string;
  value: string | number;
  description?: string;
  descriptionIcon?: React.ElementType;
  descriptionIconPosition?: 'before' | 'after';
  color?: 'primary' | 'gray' | 'danger' | 'warning' | 'success' | 'info';
  chart?: number[];
  onClick?: () => void;
}

export interface StatsOverviewWidgetProps {
  stats: StatItem[];
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export const StatsOverviewWidget: React.FC<StatsOverviewWidgetProps> = ({
  stats,
  columns = 3,
  className,
}) => {
  const colGrid = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  };

  const colorClasses: Record<string, { text: string; bg: string }> = {
    primary: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' },
    gray: { text: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
    danger: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' },
    warning: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' },
    success: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' },
    info: { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300' },
  };

  return (
    <div className={cn('fi-wi-stats-overview grid gap-4 sm:gap-5', colGrid[columns] || 'grid-cols-3', className)}>
      {stats.map((stat, idx) => {
        const color = stat.color || 'gray';
        const DescIcon = stat.descriptionIcon;
        const isClickable = !!stat.onClick;

        return (
          <div
            key={stat.id || idx}
            onClick={stat.onClick}
            className={cn(
              'fi-wi-stats-overview-stat rounded-xl bg-white p-5 shadow-xs ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10 transition-all duration-150',
              isClickable && 'cursor-pointer hover:ring-slate-300 dark:hover:ring-slate-700 hover:shadow-sm'
            )}
          >
            <span className="fi-wi-stats-overview-stat-label text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 block truncate">
              {stat.label}
            </span>

            <div className="fi-wi-stats-overview-stat-value text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 dark:text-white mt-1">
              {stat.value}
            </div>

            {stat.description && (
              <div
                className={cn(
                  'fi-wi-stats-overview-stat-description flex items-center gap-1.5 text-xs font-medium mt-2',
                  colorClasses[color]?.text || 'text-slate-500'
                )}
              >
                {DescIcon && stat.descriptionIconPosition !== 'after' && (
                  <DescIcon className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate">{stat.description}</span>
                {DescIcon && stat.descriptionIconPosition === 'after' && (
                  <DescIcon className="w-3.5 h-3.5 shrink-0" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
