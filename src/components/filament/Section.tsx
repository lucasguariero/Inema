import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ElementType;
  iconColor?: 'primary' | 'gray' | 'danger' | 'warning' | 'success' | 'info';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  compact?: boolean;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  heading,
  description,
  icon: Icon,
  iconColor = 'gray',
  collapsible = false,
  defaultCollapsed = false,
  compact = false,
  headerActions,
  footer,
  className,
  children,
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const iconColorStyles = {
    primary: 'text-blue-600 dark:text-blue-400',
    gray: 'text-slate-500 dark:text-slate-400',
    danger: 'text-rose-600 dark:text-rose-400',
    warning: 'text-amber-600 dark:text-amber-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    info: 'text-sky-600 dark:text-sky-400',
  };

  const hasHeader = heading || description || Icon || headerActions || collapsible;

  return (
    <div
      className={cn(
        'fi-section fi-sc-section rounded-xl bg-white shadow-xs ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10 overflow-hidden text-slate-800 dark:text-slate-100 transition-all duration-150',
        compact ? 'fi-section-compact' : '',
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div
          className={cn(
            'fi-section-header flex items-center justify-between gap-x-3 border-b border-slate-100 dark:border-slate-800/80',
            compact ? 'px-4 py-2.5' : 'px-5 py-3.5',
            collapsible ? 'cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-slate-800/30' : ''
          )}
          onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {Icon && (
              <div className={cn('fi-section-header-icon shrink-0', iconColorStyles[iconColor])}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              {heading && (
                <h3 className="fi-section-header-heading text-sm sm:text-base font-semibold text-slate-950 dark:text-white leading-6 tracking-tight truncate">
                  {heading}
                </h3>
              )}
              {description && (
                <p className="fi-section-header-description text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {headerActions && <div onClick={(e) => e.stopPropagation()}>{headerActions}</div>}
            {collapsible && (
              <button
                type="button"
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-transform duration-150"
                aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
              >
                <ChevronDown
                  className={cn('w-4 h-4 transition-transform duration-200', isCollapsed && '-rotate-90')}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {!isCollapsed && (
        <div className={cn('fi-section-content', compact ? 'p-4' : 'p-5')}>
          {children}
        </div>
      )}

      {!isCollapsed && footer && (
        <div className="fi-section-footer px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};
