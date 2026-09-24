import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type GlaNotificationType = 'success' | 'warning' | 'danger' | 'info';

export interface GlaNotificationProps {
  type?: GlaNotificationType;
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number; // em ms, 0 para persistente
  className?: string;
}

export const GlaNotification: React.FC<GlaNotificationProps> = ({
  type = 'success',
  title,
  message,
  onClose,
  duration = 4000,
  className,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig: Record<
    GlaNotificationType,
    { border: string; iconBg: string; iconColor: string; icon: React.ReactNode }
  > = {
    success: {
      border: 'border-emerald-300 dark:border-emerald-700/80',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/80',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    warning: {
      border: 'border-amber-300 dark:border-amber-700/80',
      iconBg: 'bg-amber-50 dark:bg-amber-950/80',
      iconColor: 'text-amber-600 dark:text-amber-400',
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    danger: {
      border: 'border-rose-300 dark:border-rose-700/80',
      iconBg: 'bg-rose-50 dark:bg-rose-950/80',
      iconColor: 'text-rose-600 dark:text-rose-400',
      icon: <AlertCircle className="w-4 h-4" />,
    },
    info: {
      border: 'border-blue-300 dark:border-blue-700/80',
      iconBg: 'bg-blue-50 dark:bg-blue-950/80',
      iconColor: 'text-blue-600 dark:text-blue-400',
      icon: <Info className="w-4 h-4" />,
    },
  };

  const current = typeConfig[type];

  return (
    <div
      role="status"
      className={cn(
        'fixed top-20 right-6 z-50 flex items-start gap-3 px-4 py-3 bg-white dark:bg-slate-900 border text-slate-800 dark:text-slate-100 text-xs rounded-xl shadow-lg ring-1 ring-slate-950/5 animate-in fade-in slide-in-from-top-3 duration-200 max-w-sm',
        current.border,
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5',
          current.iconBg,
          current.iconColor
        )}
      >
        {current.icon}
      </div>

      <div className="flex-1 pr-1 space-y-0.5">
        <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">
          {title}
        </span>
        {message && (
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            {message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors cursor-pointer"
        aria-label="Fechar notificação"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
