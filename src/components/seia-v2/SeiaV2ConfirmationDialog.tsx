import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface SeiaV2ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

/**
 * SeiaV2ConfirmationDialog — Diálogo modal canônico para confirmação de ações críticas
 * (exclusão em lote, distribuição de pauta, cancelamento de trâmite).
 * Consome o Dialog primitivo institucional com consistência visual e acessibilidade.
 */
export const SeiaV2ConfirmationDialog: React.FC<SeiaV2ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  onConfirm,
  onCancel,
  icon,
  isLoading = false,
}) => {
  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  const confirmVariantClass =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white border-transparent'
      : variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-700 text-white border-transparent'
      : 'bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white border-transparent';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {icon && <span className="shrink-0">{icon}</span>}
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600 dark:text-slate-300 pt-2 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
            className="text-xs h-8 text-slate-700 dark:text-slate-300"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={`text-xs h-8 font-semibold shadow-xs ${confirmVariantClass}`}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
