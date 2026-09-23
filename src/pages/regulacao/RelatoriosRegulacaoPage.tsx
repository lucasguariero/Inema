import React, { useState } from 'react';
import { TramitacoesPeriodoTab } from '@/components/regulacao/TramitacoesPeriodoTab';
import { AcompanhamentoPautaTab } from '@/components/regulacao/AcompanhamentoPautaTab';
import { FiltrosDrawer } from '@/components/regulacao/FiltrosDrawer';
import { DetalheProcessoModal } from '@/components/regulacao/DetalheProcessoModal';
import {
  FiltrosTramitacao,
  FILTROS_INICIAIS,
  TramitacaoItem
} from '@/data/regulacaoMock';

type AbaPrincipal = 'tramitacoes' | 'pauta';

export const RelatoriosRegulacaoPage: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<AbaPrincipal>('tramitacoes');
  const [drawerFiltrosAberto, setDrawerFiltrosAberto] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosTramitacao>(FILTROS_INICIAIS);
  const [processoSelecionado, setProcessoSelecionado] = useState<TramitacaoItem | null>(null);

  const handleAplicarFiltros = (novosFiltros: FiltrosTramitacao) => {
    setFiltros(novosFiltros);
    setDrawerFiltrosAberto(false);
  };

  const handleLimparFiltros = () => {
    setFiltros(FILTROS_INICIAIS);
  };

  const handleRemoverFiltro = (chave: keyof FiltrosTramitacao, valor?: string) => {
    setFiltros((prev) => {
      const atual = prev[chave];
      if (Array.isArray(atual) && valor) {
        return {
          ...prev,
          [chave]: (atual as string[]).filter((item) => item !== valor)
        };
      }
      if (chave === 'papelEquipe') {
        return { ...prev, papelEquipe: 'qualquer' };
      }
      if (typeof atual === 'string') {
        return { ...prev, [chave]: '' };
      }
      return prev;
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* 1. CABEÇALHO SÓBRIO INSTITUCIONAL - ZERO ÍCONES NO H1 */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Relatórios de Regulação
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Consulte as tramitações e acompanhe os processos da regulação ambiental.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Dados do SEIA
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Atualizado em: 22/09/2026 10:00
            </span>
          </div>
        </div>

        {/* 2. ABAS PRINCIPAIS (GLA FILAMENT TABS) */}
        <div className="mt-6 border-b border-slate-200 flex items-center gap-8">
          <button
            onClick={() => setAbaAtiva('tramitacoes')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              abaAtiva === 'tramitacoes'
                ? 'border-[#0F4C3A] text-[#0F4C3A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tramitações no período
          </button>
          <button
            onClick={() => setAbaAtiva('pauta')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              abaAtiva === 'pauta'
                ? 'border-[#0F4C3A] text-[#0F4C3A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Acompanhamento da pauta
          </button>
        </div>
      </div>

      {/* 3. CONTEÚDO DAS ABAS */}
      {abaAtiva === 'tramitacoes' && (
        <TramitacoesPeriodoTab
          filtros={filtros}
          onOpenFiltros={() => setDrawerFiltrosAberto(true)}
          onRemoveFiltro={handleRemoverFiltro}
          onLimparFiltros={handleLimparFiltros}
          onSelectProcesso={(p) => setProcessoSelecionado(p)}
        />
      )}

      {abaAtiva === 'pauta' && (
        <AcompanhamentoPautaTab
          onSelectProcesso={(p) => setProcessoSelecionado(p)}
        />
      )}

      {/* 4. GAVETA LATERAL DE FILTROS */}
      <FiltrosDrawer
        isOpen={drawerFiltrosAberto}
        onClose={() => setDrawerFiltrosAberto(false)}
        filtros={filtros}
        onAplicarFiltros={handleAplicarFiltros}
        onLimparFiltros={handleLimparFiltros}
      />

      {/* 5. MODAL DE DETALHAMENTO DO PROCESSO */}
      <DetalheProcessoModal
        isOpen={Boolean(processoSelecionado)}
        onClose={() => setProcessoSelecionado(null)}
        processo={processoSelecionado}
      />
    </div>
  );
};
