import React, { useState } from 'react';
import { SignableDocument } from '@/types/signature';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ban, AlertTriangle } from 'lucide-react';

interface CancelSignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SignableDocument | null;
  onConfirmCancel: (documentId: string, reason: string) => void;
}

export const CancelSignatureModal: React.FC<CancelSignatureModalProps> = ({
  open,
  onOpenChange,
  document,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!document) return null;

  const minChars = 10;
  const isValid = reason.trim().length >= minChars;

  const handleConfirm = () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCancel(document.id, reason.trim());
      setIsSubmitting(false);
      onOpenChange(false);
      setReason('');
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <DialogHeader className="bg-amber-50/70 dark:bg-amber-950/20 px-6 py-4 border-b border-amber-200/80 dark:border-amber-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-amber-950 dark:text-amber-100">
                Cancelar Solicitação de Assinatura
              </DialogTitle>
              <DialogDescription className="text-xs text-amber-800 dark:text-amber-300">
                Interrupção demonstrativa da solicitação de assinatura em andamento
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-semibold text-slate-800 dark:text-slate-200">{document.tipoDocumento}</div>
            <div className="text-slate-500 font-mono text-[11px]">{document.numeroProcesso}</div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cancel-reason" className="font-semibold text-slate-800 dark:text-slate-200 block">
              Motivo do Cancelamento * (mínimo de {minChars} caracteres)
            </label>
            <textarea
              id="cancel-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo para interromper a coleta de assinaturas deste documento..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] placeholder:text-slate-400"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>{reason.trim().length} de {minChars} caracteres</span>
            </div>
          </div>

          {/* Aviso Regras Seção 4: Preservação de Histórico Demonstrativo */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Preservação do Histórico Demonstrativo</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              O cancelamento interrompe o fluxo de coleta de assinaturas deste documento. As assinaturas previamente
              registradas na simulação permanecem conservadas no histórico e o motivo informado será registrado
              na trilha de eventos demonstrativa.
            </p>
          </div>
        </div>

        <DialogFooter className="bg-slate-50/90 dark:bg-slate-850 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Voltar
          </Button>

          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!isValid || isSubmitting}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 font-semibold shadow-xs"
          >
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
