import React from 'react';
import { X } from 'lucide-react';
import { TramitacaoItem, PautaItem } from '@/data/regulacaoMock';

interface DetalheProcessoModalProps {
  isOpen: boolean;
  onClose: () => void;
  processo: TramitacaoItem | PautaItem | null;
}

export const DetalheProcessoModal: React.FC<DetalheProcessoModalProps> = ({
  isOpen,
  onClose,
  processo
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !processo) return null;

  const isTramitacao = 'dataTramitacao' in processo;
  const situacao = isTramitacao ? (processo as TramitacaoItem).situacao : (processo as PautaItem).situacaoAtual;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl border border-slate-200 overflow-hidden">
          {/* Header do Modal */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#0F4C3A] uppercase tracking-wider block">
                Detalhamento do Processo SEIA
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {processo.processo}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo do Modal */}
          <div className="p-6 space-y-5 text-xs text-slate-700">
            {/* Bloco 1: Identificação Principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500 block">Interessado / Razão Social</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{processo.interessado}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Situação Atual</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                  {situacao}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Município</span>
                <span className="font-medium text-slate-800 block mt-0.5">{processo.municipio}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Tipologia</span>
                <span className="font-medium text-slate-800 block mt-0.5">{processo.tipologia}</span>
              </div>
            </div>

            {/* Bloco 2: Unidade e Equipe Técnica */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-xs border-b border-slate-100 pb-1">
                Lotação e Equipe Técnica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 block">Unidade / Coordenação</span>
                  <span className="font-medium text-slate-800 block mt-0.5">
                    {isTramitacao ? (processo as TramitacaoItem).unidade : (processo as PautaItem).unidadeAtual}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Líder da Equipe</span>
                  <span className="font-medium text-slate-800 block mt-0.5">{processo.liderEquipe}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[11px] text-slate-500 block">Membros da Equipe</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {processo.membrosEquipe.length > 0 ? (
                      processo.membrosEquipe.map((membro) => (
                        <span
                          key={membro}
                          className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-700"
                        >
                          {membro}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">Nenhum membro adicional alocado</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 3: Atos e Atividades */}
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-xs border-b border-slate-100 pb-1">
                Atos e Atividades Requeridas
              </h3>
              <div className="p-3 bg-white border border-slate-200 rounded-md">
                <span className="font-medium text-slate-800 block">
                  {isTramitacao ? (processo as TramitacaoItem).ato : (processo as PautaItem).atos.join(', ')}
                </span>
                {isTramitacao && (
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Família: {(processo as TramitacaoItem).familiaAto}
                  </span>
                )}
              </div>
            </div>

            {/* Bloco 4: Movimentação Recente */}
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-xs border-b border-slate-100 pb-1">
                Informações da Última Movimentação
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 block">Data da Movimentação</span>
                  <span className="font-medium text-slate-800 block mt-0.5">
                    {isTramitacao ? (processo as TramitacaoItem).dataTramitacao : (processo as PautaItem).ultimaMovimentacao}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Dias sem Movimentação</span>
                  <span className="font-medium text-slate-800 block mt-0.5">
                    {processo.diasSemMovimentacao} dias
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Status do Prazo</span>
                  <span className="font-medium text-slate-800 block mt-0.5">
                    {('situacaoPrazo' in processo && (processo.situacaoPrazo === 'Excedido' || (processo.situacaoPrazo as string) === 'Prazo Excedido')) || Boolean((processo as any).prazoExcedido)
                      ? 'Prazo Regulamentar Excedido'
                      : 'Dentro do Prazo Regulamentar'}
                  </span>
                </div>
              </div>

              {isTramitacao && (processo as TramitacaoItem).resumoDespacho && (
                <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <span className="text-[11px] font-semibold text-slate-600 block">Despacho / Síntese:</span>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">
                    {(processo as TramitacaoItem).resumoDespacho}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rodapé do Modal */}
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors shadow-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
