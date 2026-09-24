import React from 'react';
import { cn } from '@/lib/utils';

export interface GlaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const GlaCard = React.forwardRef<HTMLDivElement, GlaCardProps>(
  ({ className, noPadding = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs ring-1 ring-slate-950/5 overflow-hidden',
          noPadding ? 'p-0' : '',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlaCard.displayName = 'GlaCard';

export interface GlaCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode;
}

export const GlaCardHeader: React.FC<GlaCardHeaderProps> = ({
  className,
  actions,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3',
        className
      )}
      {...props}
    >
      <div className="space-y-0.5">{children}</div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};

export const GlaCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3
      className={cn('text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const GlaCardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p className={cn('text-xs text-slate-500 dark:text-slate-400', className)} {...props}>
      {children}
    </p>
  );
};

export const GlaCardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
};

export const GlaCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-5 py-3 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
