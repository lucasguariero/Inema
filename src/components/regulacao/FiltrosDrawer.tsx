import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  FiltrosTramitacao,
  LISTA_UNIDADES,
  LISTA_ATOS,
  LISTA_SITUACOES,
  LISTA_TECNICOS,
  LISTA_MUNICIPIOS,
  LISTA_TIPOLOGIAS
} from '@/data/regulacaoMock';

interface FiltrosDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filtros: FiltrosTramitacao;
  onAplicarFiltros: (novosFiltros: FiltrosTramitacao) => void;
  onLimparFiltros: () => void;
}

export const FiltrosDrawer: React.FC<FiltrosDrawerProps> = ({
  isOpen,
  onClose,
  filtros,
  onAplicarFiltros,
  onLimparFiltros
}) => {
  const [localFiltros, setLocalFiltros] = useState<FiltrosTramitacao>(filtros);

  // Sincronizar ao abrir
  React.useEffect(() => {
    setLocalFiltros(filtros);
  }, [filtros, isOpen]);

  if (!isOpen) return null;

  const toggleItem = (campo: 'unidades' | 'atos' | 'situacoes' | 'tecnicos' | 'municipios' | 'tipologias', valor: string) => {
    setLocalFiltros((prev) => {
      const listaAtual = prev[campo];
      const existe = listaAtual.includes(valor);
      return {
        ...prev,
        [campo]: existe ? listaAtual.filter((i) => i !== valor) : [...listaAtual, valor]
      };
    });
  };

  const handleConsultar = () => {
    onAplicarFiltros(localFiltros);
    onClose();
  };

  const handleLimpar = () => {
    onLimparFiltros();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-xl flex flex-col">
          {/* Cabeçalho do Drawer */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Filtros de Consulta
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Refine a pesquisa de processos e atos no período
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              aria-label="Fechar painel de filtros"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo com Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
            {/* 1. Período */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 block">Período de Tramitação</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Data inicial</span>
                  <input
                    type="date"
                    value={localFiltros.dataInicio}
                    onChange={(e) => setLocalFiltros({ ...localFiltros, dataInicio: e.target.value })}
                    className="w-full h-9 px-2.5 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Data final</span>
                  <input
                    type="date"
                    value={localFiltros.dataFim}
                    onChange={(e) => setLocalFiltros({ ...localFiltros, dataFim: e.target.value })}
                    className="w-full h-9 px-2.5 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Processo e Interessado */}
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-900 block mb-1">Número do Processo</label>
                <input
                  type="text"
                  placeholder="Ex: 2026.000.000000/INEMA/LIC-00000"
                  value={localFiltros.processo}
                  onChange={(e) => setLocalFiltros({ ...localFiltros, processo: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-900 block mb-1">Interessado / Razão Social</label>
                <input
                  type="text"
                  placeholder="Ex: Nome da empresa ou requerente"
                  value={localFiltros.interessado}
                  onChange={(e) => setLocalFiltros({ ...localFiltros, interessado: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                />
              </div>
            </div>

            {/* 3. Papel na Equipe */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-900 block">Papel na Equipe</label>
              <select
                value={localFiltros.papelEquipe}
                onChange={(e) => setLocalFiltros({ ...localFiltros, papelEquipe: e.target.value as any })}
                className="w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
              >
                <option value="qualquer">Qualquer papel</option>
                <option value="lider">Líder da equipe técnica</option>
                <option value="membro">Membro da equipe</option>
              </select>
            </div>

            {/* 4. Unidade / Coordenação (Multi) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-900">Unidade / Coordenação</label>
                {localFiltros.unidades.length > 0 && (
                  <span className="text-[11px] text-[#0F4C3A] font-medium">
                    {localFiltros.unidades.length} selecionada(s)
                  </span>
                )}
              </div>
              <div className="max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-md space-y-1 bg-slate-50/50">
                {LISTA_UNIDADES.map((unidade) => {
                  const checked = localFiltros.unidades.includes(unidade);
                  return (
                    <label key={unidade} className="flex items-center gap-2 cursor-pointer py-1 px-1 rounded hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem('unidades', unidade)}
                        className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                      <span className="text-xs text-slate-800">{unidade}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. Situação (Multi) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-900">Situação</label>
                {localFiltros.situacoes.length > 0 && (
                  <span className="text-[11px] text-[#0F4C3A] font-medium">
                    {localFiltros.situacoes.length} selecionada(s)
                  </span>
                )}
              </div>
              <div className="max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-md space-y-1 bg-slate-50/50">
                {LISTA_SITUACOES.map((sit) => {
                  const checked = localFiltros.situacoes.includes(sit);
                  return (
                    <label key={sit} className="flex items-center gap-2 cursor-pointer py-1 px-1 rounded hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem('situacoes', sit)}
                        className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                      <span className="text-xs text-slate-800">{sit}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 6. Atos / Atividades (Multi) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-900">Ato / Atividade</label>
                {localFiltros.atos.length > 0 && (
                  <span className="text-[11px] text-[#0F4C3A] font-medium">
                    {localFiltros.atos.length} selecionado(s)
                  </span>
                )}
              </div>
              <div className="max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-md space-y-1 bg-slate-50/50">
                {LISTA_ATOS.map((ato) => {
                  const checked = localFiltros.atos.includes(ato);
                  return (
                    <label key={ato} className="flex items-center gap-2 cursor-pointer py-1 px-1 rounded hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem('atos', ato)}
                        className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                      <span className="text-xs text-slate-800">{ato}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 7. Técnico (Multi) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-900">Técnico</label>
                {localFiltros.tecnicos.length > 0 && (
                  <span className="text-[11px] text-[#0F4C3A] font-medium">
                    {localFiltros.tecnicos.length} selecionado(s)
                  </span>
                )}
              </div>
              <div className="max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-md space-y-1 bg-slate-50/50">
                {LISTA_TECNICOS.map((tec) => {
                  const checked = localFiltros.tecnicos.includes(tec);
                  return (
                    <label key={tec} className="flex items-center gap-2 cursor-pointer py-1 px-1 rounded hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem('tecnicos', tec)}
                        className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                      <span className="text-xs text-slate-800">{tec}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 8. Município e Tipologia */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900 block">Município</label>
                <div className="max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-md space-y-1 bg-slate-50/50">
                  {LISTA_MUNICIPIOS.map((mun) => {
                    const checked = localFiltros.municipios.includes(mun);
                    return (
                      <label key={mun} className="flex items-center gap-2 cursor-pointer py-0.5 px-1 rounded hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleItem('municipios', mun)}
                          className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
                        />
                        <span className="text-[11px] text-slate-800">{mun}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900 block">Tipologia</label>
                <div className="max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-md space-y-1 bg-slate-50/50">
                  {LISTA_TIPOLOGIAS.map((tipo) => {
                    const checked = localFiltros.tipologias.includes(tipo);
                    return (
                      <label key={tipo} className="flex items-center gap-2 cursor-pointer py-0.5 px-1 rounded hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleItem('tipologias', tipo)}
                          className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
                        />
                        <span className="text-[11px] text-slate-800">{tipo}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé Fixo do Filtro */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleLimpar}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors shadow-xs"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={handleConsultar}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0F4C3A] hover:bg-[#0c3d2e] rounded-md transition-colors shadow-xs"
            >
              Consultar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
