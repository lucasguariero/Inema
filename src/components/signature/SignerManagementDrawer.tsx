import React from 'react';
import { SignableDocument, SimulatedUser } from '@/types/signature';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Ban,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  ArrowRight,
} from 'lucide-react';

interface SignerManagementDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SignableDocument | null;
  activeUser: SimulatedUser;
  onOpenAddSigner: () => void;
  onOpenCancel: () => void;
  onOpenSign: () => void;
  onOpenRefuse: () => void;
  onOpenViewDocument: () => void;
}

export const SignerManagementDrawer: React.FC<SignerManagementDrawerProps> = ({
  open,
  onOpenChange,
  document,
  activeUser,
  onOpenAddSigner,
  onOpenCancel,
  onOpenSign,
  onOpenRefuse,
  onOpenViewDocument,
}) => {
  if (!document) return null;

  const currentSigner = document.signatarios.find(
    (s) => s.matricula === activeUser.matricula || s.nome.toLowerCase() === activeUser.nome.toLowerCase()
  );

  const isUserPending = currentSigner && currentSigner.status === 'pendente';
  const isTerceirizado = activeUser.tipoVinculo === 'terceirizado';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <DialogHeader className="bg-slate-50/90 dark:bg-slate-850 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Gestão de Signatários & Trilha de Auditoria
                </DialogTitle>
                <div className="text-xs text-slate-500 font-mono">
                  {document.numeroProcesso} • {document.tipoDocumento}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                color={
                  document.statusGeral === 'concluido'
                    ? 'success'
                    : document.statusGeral === 'recusado'
                    ? 'danger'
                    : document.statusGeral === 'cancelado'
                    ? 'gray'
                    : 'warning'
                }
                dot
                size="xs"
              >
                {document.statusGeral === 'concluido'
                  ? 'Concluído'
                  : document.statusGeral === 'recusado'
                  ? 'Recusado'
                  : document.statusGeral === 'cancelado'
                  ? 'Cancelado'
                  : 'Em Assinatura'}
              </Badge>
              <Badge color="primary" size="xs">
                Ordem {document.ordemTipo === 'sequencial' ? 'Sequencial' : 'Indiferente'}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Corpo com Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Card de Ações Rápidas do Usuário Ativo */}
          {isUserPending && (
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Sua assinatura está pendente neste documento</span>
                </div>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Você está logado como <strong className="font-semibold">{activeUser.nome}</strong> ({activeUser.cargo}).
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenSign();
                  }}
                  className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 font-semibold shadow-xs"
                >
                  Assinar Agora
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenRefuse();
                  }}
                  className="text-xs h-8 text-rose-700 hover:bg-rose-50 border-rose-200"
                >
                  Recusar
                </Button>
              </div>
            </div>
          )}

          {/* Barra de Ações Administrativas */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[11px]">
              Signatários Habilitados ({document.signatarios.length})
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenViewDocument}
                className="text-xs h-8 text-slate-700 dark:text-slate-300"
              >
                <FileText className="w-3.5 h-3.5 mr-1 text-[#0F4C3A]" />
                <span>Ver Documento</span>
              </Button>

              {document.statusGeral !== 'concluido' && document.statusGeral !== 'cancelado' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenAddSigner}
                    className="text-xs h-8 text-slate-700 dark:text-slate-300"
                  >
                    <UserPlus className="w-3.5 h-3.5 mr-1 text-[#0F4C3A]" />
                    <span>Adicionar Signatário</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenCancel}
                    className="text-xs h-8 text-amber-700 hover:bg-amber-50 border-amber-200"
                  >
                    <Ban className="w-3.5 h-3.5 mr-1" />
                    <span>Cancelar Coleta</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Tabela de Signatários */}
          <div className="space-y-2.5">
            {document.signatarios.map((sig, idx) => (
              <div
                key={sig.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  sig.status === 'assinado'
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40'
                    : sig.status === 'recusado'
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40'
                    : sig.status === 'cancelado'
                    ? 'bg-slate-100/60 dark:bg-slate-800/50 border-slate-300 text-slate-500 line-through'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-[11px]">
                      {document.ordemTipo === 'sequencial' ? sig.ordem : idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span>{sig.nome}</span>
                        {sig.ehSuplente && (
                          <Badge color="warning" size="xs">
                            Suplente
                          </Badge>
                        )}
                        {sig.tipoVinculo === 'terceirizado' && (
                          <Badge color="danger" size="xs">
                            Terceirizado (Sem fé pública)
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {sig.cargo} • Matrícula <span className="font-mono">{sig.matricula}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {sig.status === 'assinado' ? (
                      <div className="space-y-0.5">
                        <Badge color="success" dot size="xs">
                          Assinado
                        </Badge>
                        <div className="text-[10px] text-slate-400">
                          {sig.dataAssinatura} {sig.horaAssinatura}
                        </div>
                      </div>
                    ) : sig.status === 'recusado' ? (
                      <Badge color="danger" dot size="xs">
                        Recusado
                      </Badge>
                    ) : sig.status === 'bloqueado_ordem' ? (
                      <Badge color="gray" size="xs">
                        Bloqueado por ordem
                      </Badge>
                    ) : (
                      <Badge color="warning" dot size="xs">
                        Pendente
                      </Badge>
                    )}
                  </div>
                </div>

                {sig.justificativaRecusa && (
                  <div className="mt-2.5 pt-2 border-t border-rose-200/60 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-[11px] italic bg-rose-50/40 p-2 rounded">
                    <strong>Justificativa da recusa:</strong> {sig.justificativaRecusa}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Trilha de Histórico & Auditoria */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[11px]">
              <History className="w-3.5 h-3.5 text-[#0F4C3A]" />
              <span>Trilha de Eventos & Histórico Demonstrativo (Rastreabilidade)</span>
            </div>

            <div className="space-y-2">
              {document.historico.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-lg bg-slate-50/80 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {evt.autorNome} ({evt.autorCargo})
                    </span>
                    <div className="flex items-center gap-2">
                      {evt.mensagemCodigo && (
                        <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded text-slate-700 dark:text-slate-300">
                          {evt.mensagemCodigo}
                        </span>
                      )}
                      <span className="font-mono text-[10px]">{evt.dataHora}</span>
                    </div>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">{evt.descricao}</div>
                  {evt.detalhe && (
                    <div className="text-slate-500 italic text-[10px]">{evt.detalhe}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
