import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GlaTableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  toolbar?: React.ReactNode;
  actions?: React.ReactNode;
  pagination?: React.ReactNode;
  noScroll?: boolean;
}

export const GlaTableContainer: React.FC<GlaTableContainerProps> = ({
  heading,
  description,
  badge,
  toolbar,
  actions,
  pagination,
  noScroll = false,
  children,
  className,
  ...props
}) => {
  const hasHeader = heading || description || badge || actions;

  return (
    <div
      className={cn(
        'fi-ta fi-ta-ctn overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800 text-slate-800 dark:text-slate-100',
        className
      )}
      {...props}
    >
      {/* 1. Header institucional da Tabela */}
      {hasHeader && (
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 dark:bg-slate-800/50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            {heading && (
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {heading}
              </h3>
            )}
            {description && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {badge && (
              <span className="inline-flex items-center text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                {badge}
              </span>
            )}
            {actions}
          </div>
        </div>
      )}

      {/* 2. Toolbar opcional (busca / filtros inline) */}
      {toolbar}

      {/* 3. Tabela com scroll horizontal suave */}
      <div className={noScroll ? 'w-full' : 'overflow-x-auto'}>{children}</div>

      {/* 4. Paginação Oficial */}
      {pagination && (
        <div className="fi-ta-pagination px-5 py-3 border-t border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          {pagination}
        </div>
      )}
    </div>
  );
};

export interface GlaTableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const GlaTable: React.FC<GlaTableProps> = ({ className, children, ...props }) => (
  <table className={cn('w-full text-left text-xs border-collapse font-sans', className)} {...props}>
    {children}
  </table>
);

export interface GlaTableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const GlaTableHead: React.FC<GlaTableHeadProps> = ({ className, children, ...props }) => (
  <thead
    className={cn(
      'bg-slate-100/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[10px] tracking-wider select-none',
      className
    )}
    {...props}
  >
    {children}
  </thead>
);

export interface GlaThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
}

export const GlaTh: React.FC<GlaThProps> = ({ className, align = 'left', children, ...props }) => (
  <th
    className={cn(
      'py-2.5 px-3.5 whitespace-nowrap',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}
    {...props}
  >
    {children}
  </th>
);

export interface GlaTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const GlaTableBody: React.FC<GlaTableBodyProps> = ({ className, children, ...props }) => (
  <tbody className={cn('divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-200', className)} {...props}>
    {children}
  </tbody>
);

export interface GlaTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const GlaTableRow: React.FC<GlaTableRowProps> = ({ className, children, ...props }) => (
  <tr className={cn('hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors', className)} {...props}>
    {children}
  </tr>
);

export interface GlaTdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
}

export const GlaTd: React.FC<GlaTdProps> = ({ className, align = 'left', children, ...props }) => (
  <td
    className={cn(
      'py-2.5 px-3.5 align-middle',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}
    {...props}
  >
    {children}
  </td>
);

export interface GlaTableActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: React.ReactNode;
}

export const GlaTableAction: React.FC<GlaTableActionProps> = ({
  variant = 'outline',
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-2xs',
        variant === 'primary' && 'bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white',
        variant === 'outline' &&
          'bg-white border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700',
        variant === 'ghost' && 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 shadow-none',
        className
      )}
      {...props}
    >
      {icon}
      {children && <span>{children}</span>}
    </button>
  );
};

export interface GlaPaginationProps {
  currentCount: number;
  totalCount: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (newPage: number) => void;
  entityName?: string;
}

export const GlaPagination: React.FC<GlaPaginationProps> = ({
  currentCount,
  totalCount,
  page = 1,
  totalPages = 1,
  onPageChange,
  entityName = 'processos'
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
      <div>
        Exibindo <span className="font-bold text-slate-900 dark:text-white">1</span>-
        <span className="font-bold text-slate-900 dark:text-white">{currentCount}</span> de{' '}
        <span className="font-bold text-slate-900 dark:text-white">{totalCount.toLocaleString('pt-BR')}</span> {entityName}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange?.(page - 1)}
          className="px-2.5 py-1 bg-white border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-md font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Anterior</span>
        </button>

        <span className="px-2.5 py-1 bg-[#0F4C3A] text-white rounded-md font-bold text-xs">
          {page}
        </span>

        {totalPages > 1 && (
          <span className="text-xs text-slate-500 font-medium px-1">
            de {totalPages}
          </span>
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange?.(page + 1)}
          className="px-2.5 py-1 bg-white border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-md font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs transition-colors"
        >
          <span>Próxima</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
