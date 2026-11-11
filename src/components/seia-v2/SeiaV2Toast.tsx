import React from 'react';
import { Check, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export interface SeiaV2ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'warning' | 'error';
  onClose?: () => void;
}

/**
 * SeiaV2Toast — Feedback flutuante institucional para confirmação de ações assíncronas
 * (rascunhos salvos, itens marcados/excluídos, trâmites atualizados).
 */
export const SeiaV2Toast: React.FC<SeiaV2ToastProps> = ({
  message,
  type = 'success',
  onClose,
}) => {
  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-[#0F4C3A] text-white',
      icon: <Check className="w-4 h-4 text-emerald-300 shrink-0" />,
    },
    info: {
      bg: 'bg-slate-900 dark:bg-slate-800 text-white',
      icon: <Info className="w-4 h-4 text-sky-300 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-700 text-white',
      icon: <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-700 text-white',
      icon: <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />,
    },
  }[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border border-white/10 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${typeConfig.bg}`}
    >
      {typeConfig.icon}
      <span className="leading-snug">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-1 text-white/70 hover:text-white p-0.5 rounded cursor-pointer"
          aria-label="Fechar notificação"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
