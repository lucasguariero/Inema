import React from 'react';
import { cn } from '@/lib/utils';

export interface SeiaV2BreadcrumbItem {
  label: string;
  href?: string;
}

interface SeiaV2BreadcrumbProps {
  items: SeiaV2BreadcrumbItem[];
  className?: string;
}

export const SeiaV2Breadcrumb: React.FC<SeiaV2BreadcrumbProps> = ({ items, className }) => (
  <nav
    aria-label="Navegação estrutural"
    className={cn('flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400', className)}
  >
    {items.map((item, index) => {
      const isCurrent = index === items.length - 1;

      return (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">/</span>}
          {isCurrent ? (
            <span className="font-semibold text-slate-800 dark:text-slate-200" aria-current="page">
              {item.label}
            </span>
          ) : (
            <a
              href={item.href}
              className="rounded-sm text-slate-500 underline-offset-4 transition-colors hover:text-[var(--color-text-link)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-border-focus)] dark:text-slate-400"
            >
              {item.label}
            </a>
          )}
        </React.Fragment>
      );
    })}
  </nav>
);
