import React, { useState } from 'react';
import { FilamentTabs } from '@/components/filament';
import { TramitacoesPeriodoTab } from '@/components/regulacao/TramitacoesPeriodoTab';
import { AcompanhamentoPautaTab } from '@/components/regulacao/AcompanhamentoPautaTab';
import { FiltrosDrawer } from '@/components/regulacao/FiltrosDrawer';
import { DetalheProcessoModal } from '@/components/regulacao/DetalheProcessoModal';
import {
  FiltrosTramitacao,
  FiltrosPauta,
  FILTROS_INICIAIS,
  FILTROS_PAUTA_INICIAIS,
  TramitacaoItem
} from '@/data/regulacaoMock';

type AbaPrincipal = 'tramitacoes' | 'pauta';

export const RelatoriosRegulacaoPage: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<AbaPrincipal>('tramitacoes');
  const [drawerFiltrosAberto, setDrawerFiltrosAberto] = useState(false);
  const [filtrosTramitacao, setFiltrosTramitacao] = useState<FiltrosTramitacao>(FILTROS_INICIAIS);
  const [filtrosPauta, setFiltrosPauta] = useState<FiltrosPauta>(FILTROS_PAUTA_INICIAIS);
  const [processoSelecionado, setProcessoSelecionado] = useState<TramitacaoItem | null>(null);

  // Handlers para Tramitações
  const handleAplicarFiltrosTramitacao = (novos: FiltrosTramitacao) => {
    setFiltrosTramitacao(novos);
  };

  const handleLimparFiltrosTramitacao = () => {
    setFiltrosTramitacao(FILTROS_INICIAIS);
  };

  const handleRemoverFiltroTramitacao = (chave: keyof FiltrosTramitacao, valor?: string) => {
    setFiltrosTramitacao((prev) => {
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

  // Handlers para Pauta
  const handleAplicarFiltrosPauta = (novos: FiltrosPauta) => {
    setFiltrosPauta(novos);
  };

  const handleLimparFiltrosPauta = () => {
    setFiltrosPauta(FILTROS_PAUTA_INICIAIS);
  };

  const handleRemoverFiltroPauta = (chave: keyof FiltrosPauta) => {
    setFiltrosPauta((prev) => ({
      ...prev,
      [chave]: chave === 'prazo' || chave === 'unidade' || chave === 'tecnico' || chave === 'situacao' ? 'todos' : ''
    }));
  };

  return (
    <div className="w-full space-y-6 font-sans">
      {/* 1. CABEÇALHO OFICIAL GLA - FORA DE CARD, SÓBRIO E LIMPO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Relatórios de Regulação
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Consulte as tramitações e acompanhe os processos da regulação ambiental.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Dados do SEIA
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Atualizado em: 22/09/2026 10:00
          </span>
        </div>
      </div>

      {/* 2. BARRA DE ABAS OFICIAL FILAMENT (GLA) */}
      <FilamentTabs
        tabs={[
          { id: 'tramitacoes', label: 'Tramitações no período', badge: '4.182' },
          { id: 'pauta', label: 'Acompanhamento da pauta', badge: '3.840' }
        ]}
        activeTab={abaAtiva}
        onChange={(tabId) => setAbaAtiva(tabId as any)}
        className="mb-2"
      />

      {/* 3. CONTEÚDO DAS ABAS */}
      {abaAtiva === 'tramitacoes' && (
        <TramitacoesPeriodoTab
          filtros={filtrosTramitacao}
          onOpenFiltros={() => setDrawerFiltrosAberto(true)}
          onRemoveFiltro={handleRemoverFiltroTramitacao}
          onLimparFiltros={handleLimparFiltrosTramitacao}
          onSelectProcesso={(p) => setProcessoSelecionado(p)}
        />
      )}

      {abaAtiva === 'pauta' && (
        <AcompanhamentoPautaTab
          filtros={filtrosPauta}
          onOpenFiltros={() => setDrawerFiltrosAberto(true)}
          onRemoveFiltro={handleRemoverFiltroPauta}
          onLimparFiltros={handleLimparFiltrosPauta}
          onSelectProcesso={(p) => setProcessoSelecionado(p)}
        />
      )}

      {/* 4. GAVETA LATERAL DE FILTROS INTEGRADA */}
      <FiltrosDrawer
        isOpen={drawerFiltrosAberto}
        onClose={() => setDrawerFiltrosAberto(false)}
        abaAtiva={abaAtiva}
        filtrosTramitacao={filtrosTramitacao}
        filtrosPauta={filtrosPauta}
        onAplicarFiltrosTramitacao={handleAplicarFiltrosTramitacao}
        onLimparFiltrosTramitacao={handleLimparFiltrosTramitacao}
        onAplicarFiltrosPauta={handleAplicarFiltrosPauta}
        onLimparFiltrosPauta={handleLimparFiltrosPauta}
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
