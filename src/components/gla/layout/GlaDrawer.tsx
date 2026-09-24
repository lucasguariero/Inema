import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type GlaDrawerWidth = 'sm' | 'md' | 'lg' | 'xl';

export interface GlaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  width?: GlaDrawerWidth;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const GlaDrawer: React.FC<GlaDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  width = 'md',
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses: Record<GlaDrawerWidth, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex pl-10 max-w-full">
        {/* Painel Lateral */}
        <div
          className={cn(
            'w-screen bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-250',
            widthClasses[width],
            className
          )}
        >
          {/* Header do Drawer */}
          {(title || subtitle) && (
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                {title && (
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Fechar painel lateral"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Conteúdo rolável */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700 dark:text-slate-300">
            {children}
          </div>

          {/* Rodapé de Ações */}
          {footer && (
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
