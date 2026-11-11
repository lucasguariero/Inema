import React, { useState } from 'react';
import { SignableDocument, SimulatedUser } from '@/types/signature';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XCircle, AlertTriangle } from 'lucide-react';

interface RefuseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SignableDocument | null;
  activeUser: SimulatedUser;
  onConfirmRefuse: (documentId: string, signerMatricula: string, reason: string) => void;
}

export const RefuseModal: React.FC<RefuseModalProps> = ({
  open,
  onOpenChange,
  document,
  activeUser,
  onConfirmRefuse,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!document) return null;

  const currentSigner = document.signatarios.find(
    (s) => s.matricula === activeUser.matricula || s.nome.toLowerCase() === activeUser.nome.toLowerCase()
  );

  const minChars = 15;
  const isReasonValid = reason.trim().length >= minChars;

  const handleConfirm = () => {
    if (!isReasonValid || !currentSigner) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmRefuse(document.id, currentSigner.matricula, reason.trim());
      setIsSubmitting(false);
      onOpenChange(false);
      setReason('');
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <DialogHeader className="bg-rose-50/70 dark:bg-rose-950/20 px-6 py-4 border-b border-rose-200/80 dark:border-rose-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-rose-950 dark:text-rose-100">
                Recusa Fundamentada de Assinatura
              </DialogTitle>
              <DialogDescription className="text-xs text-rose-800 dark:text-rose-300">
                Registro de manifestação contrária ou pendência técnica nos autos
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
            <label htmlFor="refuse-reason" className="font-semibold text-slate-800 dark:text-slate-200 block">
              Justificativa Técnica da Recusa * (mínimo de {minChars} caracteres)
            </label>
            <textarea
              id="refuse-reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva claramente o motivo da discordância, pendência de documentação ou inconsistência técnica que motivou a recusa..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] placeholder:text-slate-400"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>{reason.trim().length} de {minChars} caracteres mínimos</span>
              {!isReasonValid && reason.length > 0 && (
                <span className="text-rose-600 font-medium">Justificativa muito curta</span>
              )}
            </div>
          </div>

          {/* Aviso sobre regras institucionais pendentes (Seção 4 e 7) */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Efeito Institucional da Recusa (Proposta em Validação)</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              A recusa fundamentada é registrada na trilha de auditoria e notifica o autor da minuta (`MSG005`/`MSG006`).
              O efeito sobre o andamento do processo (devolução para diligência ou reapreciação) permanece como
              pendência de deliberação institucional por Thays e Matheus.
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
            disabled={!isReasonValid || isSubmitting}
            className="bg-rose-700 hover:bg-rose-800 text-white text-xs h-8 font-semibold shadow-xs"
          >
            <XCircle className="w-3.5 h-3.5 mr-1.5" />
            <span>{isSubmitting ? 'Registrando...' : 'Confirmar Recusa Fundamentada'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
