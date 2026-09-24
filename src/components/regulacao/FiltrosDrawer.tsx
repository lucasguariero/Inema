import React, { useState, useEffect } from 'react';
import { X, Filter, RotateCcw, Search } from 'lucide-react';
import {
  FiltrosTramitacao,
  FiltrosPauta,
  FILTROS_INICIAIS,
  FILTROS_PAUTA_INICIAIS,
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
  abaAtiva: 'tramitacoes' | 'pauta';
  filtrosTramitacao: FiltrosTramitacao;
  filtrosPauta: FiltrosPauta;
  onAplicarFiltrosTramitacao: (novos: FiltrosTramitacao) => void;
  onLimparFiltrosTramitacao: () => void;
  onAplicarFiltrosPauta: (novos: FiltrosPauta) => void;
  onLimparFiltrosPauta: () => void;
}

export const FiltrosDrawer: React.FC<FiltrosDrawerProps> = ({
  isOpen,
  onClose,
  abaAtiva,
  filtrosTramitacao,
  filtrosPauta,
  onAplicarFiltrosTramitacao,
  onLimparFiltrosTramitacao,
  onAplicarFiltrosPauta,
  onLimparFiltrosPauta
}) => {
  const [localTramitacao, setLocalTramitacao] = useState<FiltrosTramitacao>(filtrosTramitacao);
  const [localPauta, setLocalPauta] = useState<FiltrosPauta>(filtrosPauta);

  useEffect(() => {
    setLocalTramitacao(filtrosTramitacao);
  }, [filtrosTramitacao, isOpen]);

  useEffect(() => {
    setLocalPauta(filtrosPauta);
  }, [filtrosPauta, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleItemTramitacao = (
    campo: 'unidades' | 'atos' | 'situacoes' | 'tecnicos' | 'municipios' | 'tipologias',
    valor: string
  ) => {
    setLocalTramitacao((prev) => {
      const listaAtual = prev[campo];
      const existe = listaAtual.includes(valor);
      return {
        ...prev,
        [campo]: existe ? listaAtual.filter((i) => i !== valor) : [...listaAtual, valor]
      };
    });
  };

  const handleSubmeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (abaAtiva === 'tramitacoes') {
      onAplicarFiltrosTramitacao(localTramitacao);
    } else {
      onAplicarFiltrosPauta(localPauta);
    }
    onClose();
  };

  const handleLimpar = () => {
    if (abaAtiva === 'tramitacoes') {
      setLocalTramitacao(FILTROS_INICIAIS);
      onLimparFiltrosTramitacao();
    } else {
      setLocalPauta(FILTROS_PAUTA_INICIAIS);
      onLimparFiltrosPauta();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop com blur sutil conforme GLA */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header do Drawer - Padrão GLA Legado */}
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#0F4C3A]" />
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  {abaAtiva === 'tramitacoes' ? 'Filtros de Tramitações' : 'Filtros da Pauta'}
                </h2>
                <p className="text-[11px] text-slate-500">
                  {abaAtiva === 'tramitacoes'
                    ? 'Refine as tramitações e atos regulatórios do período'
                    : 'Refine os processos em análise técnica na pauta ativa'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corpo do Formulário com Scroll Suave */}
          <form id="drawerFiltrosForm" onSubmit={handleSubmeter} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {abaAtiva === 'tramitacoes' ? (
              <>
                {/* 1. Período de Tramitação */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Período de Tramitação
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Data inicial</span>
                      <input
                        type="date"
                        value={localTramitacao.dataInicio}
                        onChange={(e) => setLocalTramitacao({ ...localTramitacao, dataInicio: e.target.value })}
                        className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Data final</span>
                      <input
                        type="date"
                        value={localTramitacao.dataFim}
                        onChange={(e) => setLocalTramitacao({ ...localTramitacao, dataFim: e.target.value })}
                        className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Processo e Interessado */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Número do Processo
                  </label>
                  <input
                    type="text"
                    value={localTramitacao.processo}
                    onChange={(e) => setLocalTramitacao({ ...localTramitacao, processo: e.target.value })}
                    placeholder="Ex: 2026.000.001842/INEMA/LIC-00341"
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Interessado / Razão Social
                  </label>
                  <input
                    type="text"
                    value={localTramitacao.interessado}
                    onChange={(e) => setLocalTramitacao({ ...localTramitacao, interessado: e.target.value })}
                    placeholder="Ex: Nome da empresa, empreendimento..."
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none"
                  />
                </div>

                {/* 3. Papel na Equipe */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Papel na Equipe Técnica
                  </label>
                  <select
                    value={localTramitacao.papelEquipe}
                    onChange={(e) =>
                      setLocalTramitacao({ ...localTramitacao, papelEquipe: e.target.value as any })
                    }
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none font-medium"
                  >
                    <option value="qualquer">Qualquer papel na equipe</option>
                    <option value="lider">Apenas Líder da Equipe</option>
                    <option value="membro">Apenas Membro Participante</option>
                  </select>
                </div>

                {/* 4. Unidades e Coordenações */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Unidade / Coordenação</label>
                    {localTramitacao.unidades.length > 0 && (
                      <span className="text-[10px] text-[#0F4C3A] font-semibold">
                        {localTramitacao.unidades.length} selecionada(s)
                      </span>
                    )}
                  </div>
                  <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    {LISTA_UNIDADES.map((u) => (
                      <label key={u} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={localTramitacao.unidades.includes(u)}
                          onChange={() => toggleItemTramitacao('unidades', u)}
                          className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A] accent-[#0F4C3A]"
                        />
                        <span className="text-xs text-slate-700">{u}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 5. Situação */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Situação da Tramitação</label>
                    {localTramitacao.situacoes.length > 0 && (
                      <span className="text-[10px] text-[#0F4C3A] font-semibold">
                        {localTramitacao.situacoes.length} selecionada(s)
                      </span>
                    )}
                  </div>
                  <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    {LISTA_SITUACOES.map((s) => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={localTramitacao.situacoes.includes(s)}
                          onChange={() => toggleItemTramitacao('situacoes', s)}
                          className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A] accent-[#0F4C3A]"
                        />
                        <span className="text-xs text-slate-700">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 6. Atos e Atividades */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Ato / Atividade</label>
                    {localTramitacao.atos.length > 0 && (
                      <span className="text-[10px] text-[#0F4C3A] font-semibold">
                        {localTramitacao.atos.length} selecionado(s)
                      </span>
                    )}
                  </div>
                  <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    {LISTA_ATOS.map((a) => (
                      <label key={a} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={localTramitacao.atos.includes(a)}
                          onChange={() => toggleItemTramitacao('atos', a)}
                          className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A] accent-[#0F4C3A]"
                        />
                        <span className="text-xs text-slate-700 truncate" title={a}>
                          {a}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 7. Técnicos */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Técnicos</label>
                    {localTramitacao.tecnicos.length > 0 && (
                      <span className="text-[10px] text-[#0F4C3A] font-semibold">
                        {localTramitacao.tecnicos.length} selecionado(s)
                      </span>
                    )}
                  </div>
                  <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    {LISTA_TECNICOS.map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={localTramitacao.tecnicos.includes(t)}
                          onChange={() => toggleItemTramitacao('tecnicos', t)}
                          className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A] accent-[#0F4C3A]"
                        />
                        <span className="text-xs text-slate-700">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 8. Município e Tipologia */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Município</label>
                    <div className="max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                      {LISTA_MUNICIPIOS.map((m) => (
                        <label key={m} className="flex items-center gap-1.5 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={localTramitacao.municipios.includes(m)}
                            onChange={() => toggleItemTramitacao('municipios', m)}
                            className="rounded border-slate-300 text-[#0F4C3A] accent-[#0F4C3A]"
                          />
                          <span className="text-slate-700 truncate">{m}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tipologia</label>
                    <div className="max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                      {LISTA_TIPOLOGIAS.map((tip) => (
                        <label key={tip} className="flex items-center gap-1.5 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={localTramitacao.tipologias.includes(tip)}
                            onChange={() => toggleItemTramitacao('tipologias', tip)}
                            className="rounded border-slate-300 text-[#0F4C3A] accent-[#0F4C3A]"
                          />
                          <span className="text-slate-700 truncate">{tip}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* FILTROS DA PAUTA OPERACIONAL */
              <>
                {/* 1. Busca Rápida */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Buscar Processo ou Interessado
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={localPauta.busca}
                      onChange={(e) => setLocalPauta({ ...localPauta, busca: e.target.value })}
                      placeholder="Ex: 2026.000 ou Razão Social..."
                      className="w-full text-xs py-2 pl-8 pr-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none"
                    />
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>

                {/* 2. Situação do Prazo Regulamentar */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Situação do Prazo Regulamentar
                  </label>
                  <select
                    value={localPauta.prazo}
                    onChange={(e) => setLocalPauta({ ...localPauta, prazo: e.target.value as any })}
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none font-medium"
                  >
                    <option value="todos">Todos os prazos</option>
                    <option value="No prazo">No prazo</option>
                    <option value="Excedido">Excedido</option>
                    <option value="Suspenso">Suspenso</option>
                    <option value="Não aplicável">Não aplicável</option>
                    <option value="Indeterminado">Indeterminado</option>
                  </select>
                </div>

                {/* 3. Atribuição Técnica */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Atribuição Técnica
                  </label>
                  <select
                    value={localPauta.atribuicao || 'todos'}
                    onChange={(e) => setLocalPauta({ ...localPauta, atribuicao: e.target.value as any })}
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none font-medium"
                  >
                    <option value="todos">Todas as atribuições</option>
                    <option value="sem_atribuicao">Sem atribuição técnica</option>
                    <option value="com_equipe">Com técnico / equipe designada</option>
                  </select>
                </div>

                {/* 4. Ato Vinculado */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ato Vinculado
                  </label>
                  <select
                    value={localPauta.atoVinculado || 'todos'}
                    onChange={(e) => setLocalPauta({ ...localPauta, atoVinculado: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none font-medium"
                  >
                    <option value="todos">Todos os atos</option>
                    <option value="Outorga">Outorga de Recursos Hídricos</option>
                    <option value="Licença Prévia">Licença Prévia (LP)</option>
                    <option value="Licença de Instalação">Licença de Instalação (LI)</option>
                    <option value="Licença de Operação">Licença de Operação (LO)</option>
                    <option value="Supressão">Autorização de Supressão (ASV)</option>
                  </select>
                </div>

                {/* 5. Município e Tipologia */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Município</label>
                    <select
                      value={localPauta.municipio || 'todos'}
                      onChange={(e) => setLocalPauta({ ...localPauta, municipio: e.target.value })}
                      className="w-full text-xs py-2 px-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none font-medium"
                    >
                      <option value="todos">Todos</option>
                      {LISTA_MUNICIPIOS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tipologia</label>
                    <select
                      value={localPauta.tipologia || 'todas'}
                      onChange={(e) => setLocalPauta({ ...localPauta, tipologia: e.target.value })}
                      className="w-full text-xs py-2 px-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none font-medium"
                    >
                      <option value="todas">Todas</option>
                      {LISTA_TIPOLOGIAS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 6. Faixa de Dias Sem Movimentação */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dias Sem Movimentação
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Mínimo</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="Ex: 0"
                        value={localPauta.diasMin ?? ''}
                        onChange={(e) =>
                          setLocalPauta({
                            ...localPauta,
                            diasMin: e.target.value ? Number(e.target.value) : undefined
                          })
                        }
                        className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Máximo</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="Ex: 90"
                        value={localPauta.diasMax ?? ''}
                        onChange={(e) =>
                          setLocalPauta({
                            ...localPauta,
                            diasMax: e.target.value ? Number(e.target.value) : undefined
                          })
                        }
                        className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 7. Unidade Atual */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unidade / Coordenação Atual
                  </label>
                  <select
                    value={localPauta.unidade}
                    onChange={(e) => setLocalPauta({ ...localPauta, unidade: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none font-medium"
                  >
                    <option value="todas">Todas as Unidades</option>
                    {LISTA_UNIDADES.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 8. Técnico Designado */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Técnico Responsável
                  </label>
                  <select
                    value={localPauta.tecnico}
                    onChange={(e) => setLocalPauta({ ...localPauta, tecnico: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none font-medium"
                  >
                    <option value="todos">Todos os técnicos</option>
                    {LISTA_TECNICOS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 9. Situação do Processo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Situação Atual do Processo
                  </label>
                  <select
                    value={localPauta.situacao}
                    onChange={(e) => setLocalPauta({ ...localPauta, situacao: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] outline-none font-medium"
                  >
                    <option value="todas">Todas as situações</option>
                    {LISTA_SITUACOES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </form>

          {/* Rodapé Fixo do Drawer - Padrão GLA Legado */}
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleLimpar}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Limpar filtros</span>
            </button>
            <button
              type="button"
              onClick={handleSubmeter}
              className="px-5 py-2 bg-[#0F4C3A] hover:bg-[#155d47] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Consultar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
