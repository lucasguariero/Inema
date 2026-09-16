import * as React from 'react';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InputWrapper } from './InputWrapper';

export interface TableToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  activeFilterCount?: number;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchPlaceholder = 'Buscar registros...',
  searchValue = '',
  onSearchChange,
  filters,
  actions,
  activeFilterCount = 0,
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="fi-ta-header-toolbar flex flex-col gap-3 p-4 border-b border-slate-100 dark:border-slate-800/80 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        {onSearchChange && (
          <InputWrapper prefixIcon={Search} className="w-full">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </InputWrapper>
        )}

        {filters && (
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'fi-btn fi-btn-size-sm inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ring-1 ring-inset shadow-2xs transition-colors shrink-0 cursor-pointer',
              activeFilterCount > 0 || showFilters
                ? 'bg-blue-50 text-blue-700 ring-blue-300 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-700'
                : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {activeFilterCount > 0 && (
              <span className="fi-badge rounded-full bg-blue-600 text-white text-[10px] px-1.5 py-0.2 font-bold ml-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {actions && <div className="fi-ta-header-actions flex items-center gap-2 shrink-0">{actions}</div>}

      {/* Filter Drawer / Dropdown Bar if open */}
      {showFilters && filters && (
        <div className="w-full sm:col-span-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
          {filters}
        </div>
      )}
    </div>
  );
};

export interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  toolbar?: React.ReactNode;
  pagination?: React.ReactNode;
  noScroll?: boolean;
}

export const TableContainer: React.FC<TableContainerProps> = ({
  toolbar,
  pagination,
  noScroll = false,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'fi-ta fi-ta-ctn overflow-hidden rounded-xl bg-white shadow-xs ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10 text-slate-800 dark:text-slate-100',
        className
      )}
      {...props}
    >
      {toolbar}
      <div className={noScroll ? 'w-full' : 'overflow-x-auto'}>{children}</div>
      {pagination && (
        <div className="fi-ta-pagination px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
          {pagination}
        </div>
      )}
    </div>
  );
};
