import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { SeiaV2Breadcrumb } from './SeiaV2Breadcrumb';
import type { SeiaV2BreadcrumbItem } from './SeiaV2Breadcrumb';
import { Button } from '@/components/ui/button';
import './pageHeader.css';

export interface SeiaV2PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  breadcrumbItems?: SeiaV2BreadcrumbItem[];
  onNavigate?: (route: string) => void;
  actions?: React.ReactNode;
  backButton?: {
    label?: string;
    title?: string;
    onClick: () => void;
    dataTestId?: string;
  };
  className?: string;
}

/**
 * SeiaV2PageHeader — Componente canônico de cabeçalho para telas do Novo SEIA V2.
 * Unifica navegação (breadcrumb), hierarquia tipográfica (h1 institucional),
 * subtítulo descritivo, controles de retorno e grupos de ações contextuais.
 */
export const SeiaV2PageHeader = React.forwardRef<HTMLHeadingElement, SeiaV2PageHeaderProps>(({
  title,
  subtitle,
  badge,
  breadcrumbItems,
  onNavigate,
  actions,
  backButton,
  className = '',
}, ref) => {
  return (
    <div className={`seia-v2-page-header space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800 ${className}`}>
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <SeiaV2Breadcrumb items={breadcrumbItems} onNavigate={onNavigate} className="flex-wrap leading-relaxed" />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
        <div className="seia-v2-page-heading min-w-0">
          {backButton && (
            <Button type="button" color="gray" size="icon"
              className="seia-v2-page-back"
              data-testid={backButton.dataTestId}
              aria-label={backButton.label || 'Voltar'}
              title={backButton.title || backButton.label || 'Voltar'}
              onClick={backButton.onClick}>
              <ArrowLeft size={16} aria-hidden="true" />
            </Button>
          )}
          <div className={`min-w-0 ${backButton ? 'seia-v2-page-heading-copy' : ''}`}>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 ref={ref} tabIndex={-1} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight break-words min-w-0">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
          </div>
        </div>

        {actions && <div className="seia-v2-page-actions flex items-center gap-2 flex-wrap sm:self-center">{actions}</div>}
      </div>
    </div>
  );
});
SeiaV2PageHeader.displayName = 'SeiaV2PageHeader';
