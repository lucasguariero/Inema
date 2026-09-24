import React, { useEffect } from 'react';
import { X, ArrowRight, FileText, UserCheck, Calendar, MapPin, Building2, Clock, AlertCircle } from 'lucide-react';
import { TramitacaoItem, PautaItem } from '@/data/regulacaoMock';
import { cn } from '@/lib/utils';

interface PainelResumoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  origem: 'tramitacoes' | 'pauta';
  item: TramitacaoItem | PautaItem | null;
  onVerDetalhesCompletos: () => void;
}

export const PainelResumoDrawer: React.FC<PainelResumoDrawerProps> = ({
  isOpen,
  onClose,
  origem,
  item,
  onVerDetalhesCompletos,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isTramitacao = origem === 'tramitacoes' && 'dataTramitacao' in item;
  const tramitacao = isTramitacao ? (item as TramitacaoItem) : null;
  const pauta = !isTramitacao ? (item as PautaItem) : null;

  const processoNumero = item.processo;
  const interessado = item.interessado;
  const situacao = isTramitacao ? tramitacao?.situacao : pauta?.situacaoAtual;
  const unidade = isTramitacao ? tramitacao?.unidade : pauta?.unidadeAtual;
  const equipeLider = isTramitacao ? tramitacao?.liderEquipe : pauta?.tecnicoAtual || pauta?.liderEquipe;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header do Drawer */}
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#0F4C3A] tracking-wider uppercase">
                Painel de Resumo • SEIA
              </span>
              <h2 className="text-base font-bold font-mono text-slate-900 mt-0.5">
                {processoNumero}
              </h2>
              <span className="text-[11px] text-slate-500 truncate block max-w-[280px]">
                {interessado}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Fechar painel de resumo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo rolável */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700">
            {/* Contexto: Aberto por Tramitações */}
            {isTramitacao && tramitacao && (
              <>
                {/* Bloco: Registro Selecionado */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80">
                    <FileText className="w-4 h-4 text-[#0F4C3A]" />
                    <span className="font-bold text-slate-800 text-xs">Registro Selecionado</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Ato / Atividade</span>
                      <span className="font-semibold text-slate-900 block mt-0.5">{tramitacao.ato}</span>
                      <span className="text-[10px] text-slate-400">Família: {tramitacao.familiaAto}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Data do Registro</span>
                        <span className="font-medium text-slate-800 block mt-0.5">{tramitacao.dataTramitacao}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Situação Registrada</span>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
                          {tramitacao.situacao}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Unidade do Registro</span>
                      <span className="font-medium text-slate-800 block mt-0.5">{tramitacao.unidade}</span>
                    </div>
                  </div>
                </div>

                {/* Bloco: Situação Atual */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <UserCheck className="w-4 h-4 text-[#0F4C3A]" />
                    <span className="font-bold text-slate-800 text-xs">Situação Atual do Processo</span>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Unidade Atual</span>
                        <span className="font-medium text-slate-800 block mt-0.5">{unidade}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Equipe / Técnico</span>
                        <span className="font-semibold text-slate-900 block mt-0.5">{equipeLider}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Localização / Tipologia</span>
                      <span className="text-slate-700 block mt-0.5 font-medium">
                        {tramitacao.municipio} • {tramitacao.tipologia}
                      </span>
                    </div>

                    <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Atualização da pauta: 22/09/2026 10:00</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Contexto: Aberto pela Pauta */}
            {!isTramitacao && pauta && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80">
                  <UserCheck className="w-4 h-4 text-[#0F4C3A]" />
                  <span className="font-bold text-slate-800 text-xs">Situação e Atribuição Atuais</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Situação Atual do Processo</span>
                    <span className="inline-block mt-1 px-2.5 py-1 rounded text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">
                      {pauta.situacaoAtual}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Unidade / Coordenação</span>
                      <span className="font-medium text-slate-800 block mt-0.5">{pauta.unidadeAtual}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Técnico / Equipe</span>
                      <span
                        className={cn(
                          'block mt-0.5 text-xs font-semibold',
                          pauta.tecnicoAtual === 'Sem atribuição técnica'
                            ? 'text-amber-700 italic'
                            : 'text-slate-900'
                        )}
                      >
                        {pauta.tecnicoAtual}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Última Movimentação</span>
                      <span
                        className={cn(
                          'block mt-0.5 font-medium',
                          pauta.ultimaMovimentacao === 'Sem tramitação registrada'
                            ? 'text-slate-500 italic'
                            : 'text-slate-800'
                        )}
                      >
                        {pauta.ultimaMovimentacao}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Dias Sem Movimentação</span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        {pauta.diasSemMovimentacao} dias
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Atos Vinculados ({pauta.qtdAtos})</span>
                    <span className="text-slate-700 block mt-0.5 font-medium">{pauta.atos.join(', ')}</span>
                  </div>

                  <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Situação do prazo: <strong>{pauta.situacaoPrazo}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Nota de Orientação Institucional */}
            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg text-amber-800 text-[11px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Para consultar o histórico de comunicações, cadeia de tramitações cronológicas e prazos de análise detalhados, acesse a visão completa.
              </span>
            </div>
          </div>

          {/* Footer Fixo com Botão Nível 2 */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
            <button
              type="button"
              onClick={onVerDetalhesCompletos}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#0F4C3A] text-white font-semibold text-xs hover:bg-[#0c3d2e] transition-colors shadow-2xs cursor-pointer"
            >
              <span>Ver detalhes completos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-1.5 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Fechar resumo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
