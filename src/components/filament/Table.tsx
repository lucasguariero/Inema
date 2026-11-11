import * as React from 'react';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InputWrapper } from './InputWrapper';
import { Button } from '@/components/ui/button';
import { CoticDrawer } from '@/components/seia-v2/CoticDrawer';

/** Opt-in presentation contract; legacy consumers retain their existing anatomy. */
export const TablePresentationContext = React.createContext(false);

/** Keep ten real row-heights reserved; do not mistake an empty-state row for data. */
export function useTenRowMinimum(enabled: boolean, content: React.ReactNode) {
  const ref = React.useRef<HTMLDivElement>(null);
  const largestRow = React.useRef(60);
  const measuredWidth = React.useRef(0);
  React.useLayoutEffect(() => {
    const container = ref.current;
    if (!enabled || !container) return;
    const table = container.querySelector('table');
    if (!table) return;
    const body = table.parentElement ?? container;
    const measure = () => {
      if (body.clientWidth !== measuredWidth.current) {
        largestRow.current = 60;
        measuredWidth.current = body.clientWidth;
      }
      const rows = Array.from(table.querySelectorAll('tbody tr')).filter(row =>
        Array.from(row.querySelectorAll('td')).every(cell => cell.colSpan === 1));
      largestRow.current = Math.max(largestRow.current, ...rows.map(row => row.getBoundingClientRect().height));
      body.style.minHeight = `${Math.ceil(largestRow.current * 10 + (table.querySelector('thead')?.getBoundingClientRect().height ?? 48))}px`;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(table);
    return () => observer.disconnect();
  }, [enabled, content]);
  return ref;
}

export interface TableToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  activeFilterCount?: number;
  heading?: React.ReactNode;
  description?: React.ReactNode;
  onFiltersOpen?: () => void;
  onFiltersApply?: () => void;
  onFiltersCancel?: () => void;
  restoreFilterFocus?: boolean;
  searchAlign?: 'left' | 'right';
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchPlaceholder = 'Buscar registros...',
  searchValue = '',
  onSearchChange,
  filters,
  actions,
  activeFilterCount = 0,
  heading, description, onFiltersOpen, onFiltersApply, onFiltersCancel, restoreFilterFocus = false,
  searchAlign = 'right',
}) => {
  const [showFilters, setShowFilters] = React.useState(false);
  const scopedPresentation = React.useContext(TablePresentationContext);
  const unified = scopedPresentation || Boolean(onFiltersApply);
  if (unified) return <>
    <div className="fi-ta-header-toolbar flex flex-col gap-3 p-4 border-b border-[var(--color-border-subtle)] lg:flex-row lg:items-center lg:justify-between">
      {(heading || description) && <div className="min-w-0 lg:mr-auto">{heading && <h3 className="text-base font-semibold">{heading}</h3>}{description && <p className="text-xs mt-1 text-[var(--color-text-secondary)]">{description}</p>}</div>}
      <div className={cn(
        "flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center min-w-0",
        searchAlign === 'left' ? "lg:mr-auto lg:ml-0" : "lg:ml-auto"
      )}>
        {onSearchChange && <InputWrapper prefixIcon={Search} className="w-full sm:w-72"><input aria-label={searchPlaceholder} type="search" value={searchValue} onChange={e => onSearchChange(e.target.value)} placeholder={searchPlaceholder} className="fi-input w-full min-w-0 bg-transparent border-0 px-3 py-2 text-sm" /></InputWrapper>}
        {filters && <Button variant="outline" onClick={() => {onFiltersOpen?.();setShowFilters(true);}} aria-label={`Filtros (${activeFilterCount} aplicados)`}><Filter className="w-4 h-4" />Filtros{activeFilterCount > 0 && <span>{activeFilterCount}</span>}</Button>}
        {actions && <div className="fi-ta-header-actions flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
    {filters && <CoticDrawer restoreFocus={restoreFilterFocus} open={showFilters} onClose={() => {onFiltersCancel?.();setShowFilters(false);}} title="Filtros de consulta" footer={<>
      <Button variant="outline" onClick={() => {onFiltersCancel?.();setShowFilters(false);}}>Cancelar</Button>
      <Button onClick={() => {onFiltersApply?.();setShowFilters(false);}}>Aplicar</Button>
    </>}>{filters}</CoticDrawer>}
  </>;

  return (
    <div className="fi-ta-header-toolbar flex flex-col gap-3 p-4 border-b border-slate-100 dark:border-slate-800/80 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900">
      <div className={cn(
        "flex items-center gap-2 flex-1 max-w-md",
        searchAlign === 'left' ? "order-first mr-auto" : ""
      )}>
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
                ? 'bg-[var(--color-brand-primary-subtle)] text-[var(--color-text-link)] ring-[var(--color-border-focus)]'
                : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {activeFilterCount > 0 && (
              <span className="fi-badge rounded-full bg-blue-600 text-white text-xs px-1.5 py-0.2 font-bold ml-0.5">
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
  heading?: React.ReactNode;
  description?: React.ReactNode;
  stableHeight?: boolean;
}

export const TableContainer: React.FC<TableContainerProps> = ({
  toolbar,
  pagination,
  noScroll = false,
  heading,
  description,
  children,
  className,
  stableHeight = true,
  ...props
}) => {
  const unified = React.useContext(TablePresentationContext);
  const bodyRef = useTenRowMinimum(unified && stableHeight, children);
  const mergedToolbar = unified && React.isValidElement<TableToolbarProps>(toolbar) && toolbar.type === TableToolbar
    ? React.cloneElement(toolbar, { heading, description }) : toolbar;
  const combinedHeader = unified && React.isValidElement(toolbar) && toolbar.type === TableToolbar;
  return (
    <div
      className={cn(
        'fi-ta fi-ta-ctn overflow-hidden rounded-xl bg-white shadow-xs ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10 text-slate-800 dark:text-slate-100 flex flex-col',
        className
      )}
      {...props}
    >
      {!combinedHeader && (heading || description) && (
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          {heading && <h3 className="text-base font-semibold text-slate-900 dark:text-white">{heading}</h3>}
          {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
      )}
      {mergedToolbar}
      <div ref={bodyRef} className={cn('flex-1', noScroll ? 'w-full' : 'overflow-x-auto', stableHeight && (unified ? 'min-h-[648px]' : 'min-h-[400px] sm:min-h-[513px]'))}>
        {children}
      </div>
      {pagination && (
        <div className="fi-ta-pagination px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between shrink-0">
          {pagination}
        </div>
      )}
    </div>
  );
};
