import React, { useState } from 'react';
import { SignableDocument, SimulatedUser } from '@/types/signature';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, AlertCircle, FileText, CheckCircle2, UserCheck, Lock } from 'lucide-react';

interface SignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SignableDocument | null;
  activeUser: SimulatedUser;
  onConfirmSign: (documentId: string, signerMatricula: string) => void;
}

export const SignModal: React.FC<SignModalProps> = ({
  open,
  onOpenChange,
  document,
  activeUser,
  onConfirmSign,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!document) return null;

  // Encontra o signatário correspondente ao usuário ativo no documento
  const currentSigner = document.signatarios.find(
    (s) => s.matricula === activeUser.matricula || s.nome.toLowerCase() === activeUser.nome.toLowerCase()
  );

  // [CAT-A] Regra MSG021: Terceirizado não possui fé pública para assinar
  const isTerceirizado = activeUser.tipoVinculo === 'terceirizado' || activeUser.papel === 'terceirizado';

  // [CAT-B] Regra MSG004: Ordem sequencial
  const isBlockedByOrder =
    document.ordemTipo === 'sequencial' &&
    currentSigner &&
    currentSigner.ordem > 1 &&
    document.signatarios.some((s) => s.ordem < currentSigner.ordem && s.status !== 'assinado');

  const isAlreadySigned = currentSigner?.status === 'assinado';

  const canSign = !isTerceirizado && !isBlockedByOrder && !isAlreadySigned && agreed;

  const handleConfirm = () => {
    if (!canSign || !currentSigner) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmSign(document.id, currentSigner.matricula);
      setIsSubmitting(false);
      onOpenChange(false);
      setAgreed(false);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <DialogHeader className="bg-slate-50/90 dark:bg-slate-850 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Confirmar Assinatura Eletrônica
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Ambiente demonstrativo — Novo SEIA V2 (INEMA)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4 text-xs">
          {/* Card Resumo do Documento */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-medium">Processo Administrativo</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {document.numeroProcesso}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-medium">Tipo de Documento</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                {document.tipoDocumento}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-medium">Requerente / Interessado</span>
              <span className="text-slate-700 dark:text-slate-300 text-right">{document.requerente}</span>
            </div>
          </div>

          {/* Dados do Signatário Ativo */}
          <div className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#0F4C3A]" />
              <span>Identificação do Signatário Habilitado</span>
            </div>
            <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              {activeUser.nome}
            </div>
            <div className="text-slate-500 text-[11px]">
              {activeUser.cargo} • Matrícula <span className="font-mono">{activeUser.matricula}</span> • {activeUser.area}
            </div>
          </div>

          {/* Alerta MSG021: Bloqueio para Colaborador Terceirizado */}
          {isTerceirizado && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Restrição Funcional (Regra MSG021)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Colaboradores contratados sob regime terceirizado não possuem fé pública para assinar documentos
                oficiais do INEMA. A formalização deste ato deve ser realizada pelo servidor público titular
                ou coordenador responsável.
              </p>
            </div>
          )}

          {/* Alerta MSG004: Bloqueio por Ordem Sequencial */}
          {isBlockedByOrder && (
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Ordem Sequencial em Andamento (Regra MSG004)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                Este documento foi configurado com colheita de assinaturas sequencial. O signatário da ordem 1
                ainda não concluiu sua assinatura. O botão estará disponível assim que a ordem anterior for formalizada.
              </p>
            </div>
          )}

          {/* Alerta de já assinado */}
          {isAlreadySigned && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Você já assinou este documento eletronicamente.</span>
            </div>
          )}

          {/* Declaração de Confirmação */}
          {!isTerceirizado && !isBlockedByOrder && !isAlreadySigned && (
            <label className="flex items-start gap-3 p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A] w-4 h-4 cursor-pointer"
              />
              <span className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                Declaro, sob as penas da lei, que examinei os autos e conferi os dados técnicos, jurídicos e
                operacionais constantes neste documento, manifestando minha expressa concordância com sua formalização.
              </span>
            </label>
          )}

          <div className="text-[10px] text-slate-400 italic">
            * Ação de simulação de assinatura eletrônica do SEIA V2. Não requer senha de produção nem token físico.
          </div>
        </div>

        <DialogFooter className="bg-slate-50/90 dark:bg-slate-850 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Cancelar
          </Button>

          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!canSign || isSubmitting}
            className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 font-semibold shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            <span>{isSubmitting ? 'Formalizando...' : 'Confirmar Assinatura Demonstrativa'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
