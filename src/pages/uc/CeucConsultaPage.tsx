import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Eye,
  Edit2,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  MapPin,
  Trees
} from 'lucide-react';
import {
  GlaCard,
  GlaCardHeader,
  GlaCardTitle,
  GlaCardDescription,
  GlaButton,
  GlaBadge,
  GlaInput,
  GlaSelect,
  GlaNotification,
  GlaModal
} from '@/components/gla';
import { MOCK_UNIDADES_CONSERVACAO, UcItem } from '@/data/ceucMock';
import { CeucFormularioPage } from './CeucFormularioPage';

export const CeucConsultaPage: React.FC = () => {
  // Lista de UCs
  const [unidades, setUnidades] = useState<UcItem[]>(MOCK_UNIDADES_CONSERVACAO);

  // Modo de visualização: 'lista' (TL001) ou 'formulario' (TL002)
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'formulario'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('acao') === 'novo' || params.get('acao') === 'cadastro') return 'formulario';
    }
    return 'lista';
  });
  const [ucEmEdicao, setUcEmEdicao] = useState<UcItem | null>(null);

  // Filtros de pesquisa
  const [buscaNome, setBuscaNome] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const [filtroGrupo, setFiltroGrupo] = useState('TODOS');
  const [filtroMunicipio, setFiltroMunicipio] = useState('TODOS');
  const [filtroGestor, setFiltroGestor] = useState('TODOS');
  const [filtroElegibilidade, setFiltroElegibilidade] = useState('TODAS');

  // Estados de exportação
  const [statusExportacao, setStatusExportacao] = useState<'disponivel' | 'gerando' | 'sucesso'>('disponivel');
  const [toastNotificacao, setToastNotificacao] = useState<string | null>(null);

  // Modal de visualização de detalhes
  const [ucVisualizar, setUcVisualizar] = useState<UcItem | null>(null);

  // Opções para comboboxes baseadas nos dados
  const categorias = useMemo(() => {
    return Array.from(new Set(MOCK_UNIDADES_CONSERVACAO.map((u) => u.categoria)));
  }, []);

  const gruposManejo = useMemo(() => {
    return Array.from(new Set(MOCK_UNIDADES_CONSERVACAO.map((u) => u.grupoManejo)));
  }, []);

  const municipios = useMemo(() => {
    return Array.from(new Set(MOCK_UNIDADES_CONSERVACAO.map((u) => u.municipio))).sort();
  }, []);

  const gestores = useMemo(() => {
    return Array.from(new Set(MOCK_UNIDADES_CONSERVACAO.map((u) => u.gestor))).sort();
  }, []);

  // Filtragem dos registros
  const unidadesFiltradas = useMemo(() => {
    return unidades.filter((uc) => {
      if (
        buscaNome &&
        !uc.nome.toLowerCase().includes(buscaNome.toLowerCase()) &&
        !uc.codigoCeu.toLowerCase().includes(buscaNome.toLowerCase())
      ) {
        return false;
      }
      if (filtroCategoria !== 'TODAS' && uc.categoria !== filtroCategoria) {
        return false;
      }
      if (filtroGrupo !== 'TODOS' && uc.grupoManejo !== filtroGrupo) {
        return false;
      }
      if (filtroMunicipio !== 'TODOS' && uc.municipio !== filtroMunicipio) {
        return false;
      }
      if (filtroGestor !== 'TODOS' && uc.gestor !== filtroGestor) {
        return false;
      }
      if (filtroElegibilidade === 'SIM' && !uc.elegivelVisitacao) {
        return false;
      }
      if (filtroElegibilidade === 'NAO' && uc.elegivelVisitacao) {
        return false;
      }
      return true;
    });
  }, [
    unidades,
    buscaNome,
    filtroCategoria,
    filtroGrupo,
    filtroMunicipio,
    filtroGestor,
    filtroElegibilidade
  ]);

  const totalFiltrosAtivos =
    (buscaNome ? 1 : 0) +
    (filtroCategoria !== 'TODAS' ? 1 : 0) +
    (filtroGrupo !== 'TODOS' ? 1 : 0) +
    (filtroMunicipio !== 'TODOS' ? 1 : 0) +
    (filtroGestor !== 'TODOS' ? 1 : 0) +
    (filtroElegibilidade !== 'TODAS' ? 1 : 0);

  const handleLimparFiltros = () => {
    setBuscaNome('');
    setFiltroCategoria('TODAS');
    setFiltroGrupo('TODOS');
    setFiltroMunicipio('TODOS');
    setFiltroGestor('TODOS');
    setFiltroElegibilidade('TODAS');
  };

  // Handler de exportação para Excel (100% front-end sem download físico)
  const handleExportarLista = () => {
    if (statusExportacao !== 'disponivel') return;
    setStatusExportacao('gerando');

    setTimeout(() => {
      setStatusExportacao('sucesso');
      setToastNotificacao('Exportação da listagem de UCs concluída com sucesso.');

      // Auto-fechamento do toast
      setTimeout(() => setToastNotificacao(null), 4000);

      // Retorno do botão ao estado original
      setTimeout(() => setStatusExportacao('disponivel'), 3000);
    }, 1200);
  };

  if (modoVisualizacao === 'formulario') {
    return (
      <CeucFormularioPage
        uc={ucEmEdicao}
        onVoltar={() => {
          setModoVisualizacao('lista');
          setUcEmEdicao(null);
        }}
        onSalvar={(dados, mensagem) => {
          if (ucEmEdicao) {
            setUnidades((prev) =>
              prev.map((item) =>
                item.id === ucEmEdicao.id ? ({ ...item, ...dados } as UcItem) : item
              )
            );
          } else {
            const novoId = `uc-${String(unidades.length + 1).padStart(3, '0')}`;
            const novoCodigo = `BA-0${30 + unidades.length}-PI`;
            const novaUc: UcItem = {
              id: novoId,
              codigoCeu: novoCodigo,
              nome: dados.nome || 'Nova Unidade de Conservação',
              sigla: dados.sigla || '',
              categoria: dados.categoria || 'Parque Estadual',
              grupoManejo: dados.grupoManejo || 'Proteção Integral',
              municipio: dados.municipio || 'Salvador',
              municipiosAbrangidos: dados.municipiosAbrangidos || [dados.municipio || 'Salvador'],
              gestor: 'Técnico Responsável INEMA',
              statusPmuc: 'Pendente',
              statusConselho: 'Em Formação',
              elegivelVisitacao: false,
              bioma: dados.bioma || 'Caatinga',
              areaHectares: dados.areaHectares || 1000,
              rpga: dados.rpga || 'RPGA do Rio Paraguaçu',
              territorioIdentidade: dados.territorioIdentidade || 'Metropolitana de Salvador',
              percentualRegularizado: dados.percentualRegularizado || 0,
              descricaoSituacaoFundiaria: dados.descricaoSituacaoFundiaria || '',
              normaCriacaoArquivo: dados.normaCriacaoArquivo,
              normaAlteracaoArquivo: dados.normaAlteracaoArquivo,
              dataCriacao: dados.dataCriacao || new Date().toISOString().split('T')[0],
              dataAtualizacao: new Date().toISOString().split('T')[0]
            };
            setUnidades((prev) => [novaUc, ...prev]);
          }
          setModoVisualizacao('lista');
          setUcEmEdicao(null);
          setToastNotificacao(mensagem);
        }}
      />
    );
  }

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Toast Notificação de Sucesso */}
      {toastNotificacao && (
        <GlaNotification
          type="success"
          title="Operação Realizada"
          message={toastNotificacao}
          onClose={() => setToastNotificacao(null)}
        />
      )}

      {/* 1. CABEÇALHO INSTITUCIONAL DA PÁGINA */}
      <div className="space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Cadastro Estadual de Unidades de Conservação
              </h1>
              <GlaBadge variant="primary" size="sm">
                CEUC / INEMA
              </GlaBadge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registro centralizado e base cadastral unificada de parâmetros para os módulos integrados do SEIA.
            </p>
          </div>
        </div>
      </div>

      {/* 2. CARD PRINCIPAL DA LISTAGEM COM TOOLBAR INTEGRADA (PADRÃO FILAMENT) */}
      <GlaCard noPadding className="border-slate-200 shadow-sm">
        {/* Header da Tabela com Título e Ações Primárias */}
        <GlaCardHeader
          className="pb-3"
          actions={
            <>
              {/* Botão Exportar Lista */}
              <GlaButton
                variant="outline"
                size="sm"
                onClick={handleExportarLista}
                isLoading={statusExportacao === 'gerando'}
                leftIcon={statusExportacao === 'sucesso' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />}
              >
                {statusExportacao === 'sucesso' ? 'Lista Exportada' : 'Exportar Lista'}
              </GlaButton>

              {/* Botão Primário Adicionar Nova UC */}
              <GlaButton
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setUcEmEdicao(null);
                  setModoVisualizacao('formulario');
                }}
              >
                Nova UC
              </GlaButton>
            </>
          }
        >
          <div className="flex items-center gap-2.5">
            <GlaCardTitle>Unidades de Conservação Cadastradas</GlaCardTitle>
            <GlaBadge variant="neutral" size="xs" mono>
              {unidadesFiltradas.length} de {unidades.length} UCs
            </GlaBadge>
          </div>
          <GlaCardDescription>
            Consulte, filtre e gerencie as Unidades de Conservação estaduais da Bahia.
          </GlaCardDescription>
        </GlaCardHeader>

        {/* TOOLBAR DE FILTROS INTEGRADA (SEM CARDS ÓRFÃOS) */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* 1. Nome da UC */}
            <div>
              <GlaInput
                placeholder="Buscar por nome ou código..."
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              />
            </div>

            {/* 2. Categoria */}
            <div>
              <GlaSelect
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                options={[
                  { value: 'TODAS', label: 'Todas as Categorias' },
                  ...categorias.map((cat) => ({ value: cat, label: cat }))
                ]}
              />
            </div>

            {/* 3. Grupo de Manejo */}
            <div>
              <GlaSelect
                value={filtroGrupo}
                onChange={(e) => setFiltroGrupo(e.target.value)}
                options={[
                  { value: 'TODOS', label: 'Todos os Grupos' },
                  ...gruposManejo.map((g) => ({ value: g, label: g }))
                ]}
              />
            </div>

            {/* 4. Município */}
            <div>
              <GlaSelect
                value={filtroMunicipio}
                onChange={(e) => setFiltroMunicipio(e.target.value)}
                options={[
                  { value: 'TODOS', label: 'Todos os Municípios' },
                  ...municipios.map((m) => ({ value: m, label: m }))
                ]}
              />
            </div>

            {/* 5. Gestor Responsável */}
            <div>
              <GlaSelect
                value={filtroGestor}
                onChange={(e) => setFiltroGestor(e.target.value)}
                options={[
                  { value: 'TODOS', label: 'Todos os Gestores' },
                  ...gestores.map((g) => ({ value: g, label: g }))
                ]}
              />
            </div>

            {/* 6. Elegível para Visitação */}
            <div>
              <GlaSelect
                value={filtroElegibilidade}
                onChange={(e) => setFiltroElegibilidade(e.target.value)}
                options={[
                  { value: 'TODAS', label: 'Elegibilidade: Todas' },
                  { value: 'SIM', label: 'Elegível: Sim' },
                  { value: 'NAO', label: 'Elegível: Não' }
                ]}
              />
            </div>
          </div>

          {/* Linha de Status de Filtros e Ação Limpar */}
          {totalFiltrosAtivos > 0 && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-medium">
                {totalFiltrosAtivos} filtro(s) aplicado(s) aos resultados.
              </span>
              <button
                type="button"
                onClick={handleLimparFiltros}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F4C3A] hover:underline cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpar filtros</span>
              </button>
            </div>
          )}
        </div>

        {/* TABELA DE REGISTROS (FULL-BLEED FILAMENT) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Cód. CEUC</th>
                <th className="py-3 px-4">Nome da Unidade de Conservação</th>
                <th className="py-3 px-4">Categoria / Grupo</th>
                <th className="py-3 px-4">Gestor Responsável</th>
                <th className="py-3 px-4 text-center">Plano de Manejo (PMUC)</th>
                <th className="py-3 px-4 text-center">Conselho Gestor</th>
                <th className="py-3 px-4 text-center">Visitação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {unidadesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Nenhuma Unidade de Conservação encontrada com os filtros informados.
                  </td>
                </tr>
              ) : (
                unidadesFiltradas.map((uc) => (
                  <tr
                    key={uc.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Código CEUC */}
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700 whitespace-nowrap">
                      {uc.codigoCeu}
                    </td>

                    {/* Nome da UC e Município */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 leading-snug">
                        {uc.nome}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{uc.municipio} • {uc.areaHectares.toLocaleString('pt-BR')} ha</span>
                      </div>
                    </td>

                    {/* Categoria / Grupo de Manejo */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{uc.categoria}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {uc.grupoManejo}
                      </div>
                    </td>

                    {/* Gestor */}
                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {uc.gestor}
                    </td>

                    {/* Status PMUC */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {uc.statusPmuc === 'Publicado' && (
                        <GlaBadge variant="success" size="xs">
                          Publicado {uc.anoPmuc ? `(${uc.anoPmuc})` : ''}
                        </GlaBadge>
                      )}
                      {uc.statusPmuc === 'Em Revisão' && (
                        <GlaBadge variant="warning" size="xs">
                          Em Revisão
                        </GlaBadge>
                      )}
                      {uc.statusPmuc === 'Em Elaboração' && (
                        <GlaBadge variant="warning" size="xs">
                          Em Elaboração
                        </GlaBadge>
                      )}
                      {uc.statusPmuc === 'Pendente' && (
                        <GlaBadge variant="danger" size="xs">
                          Pendente
                        </GlaBadge>
                      )}
                    </td>

                    {/* Status Conselho */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {uc.statusConselho === 'Ativo e Paritário' && (
                        <GlaBadge variant="success" size="xs">
                          Ativo e Paritário
                        </GlaBadge>
                      )}
                      {uc.statusConselho === 'Em Formação' && (
                        <GlaBadge variant="warning" size="xs">
                          Em Formação
                        </GlaBadge>
                      )}
                      {uc.statusConselho === 'Inativo' && (
                        <GlaBadge variant="neutral" size="xs">
                          Inativo
                        </GlaBadge>
                      )}
                    </td>

                    {/* Elegível para Visitação (Sim/Não com Badge) */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {uc.elegivelVisitacao ? (
                        <GlaBadge variant="success" size="xs" dot>
                          Sim
                        </GlaBadge>
                      ) : (
                        <GlaBadge variant="neutral" size="xs" dot>
                          Não
                        </GlaBadge>
                      )}
                    </td>

                    {/* Ações por linha: Visualizar e Editar */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <GlaButton
                          variant="ghost"
                          size="xs"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => setUcVisualizar(uc)}
                          title="Visualizar detalhes da UC"
                        >
                          Visualizar
                        </GlaButton>
                        <GlaButton
                          variant="outline"
                          size="xs"
                          leftIcon={<Edit2 className="w-3 h-3 text-slate-500" />}
                          onClick={() => {
                            setUcEmEdicao(uc);
                            setModoVisualizacao('formulario');
                          }}
                          title="Editar cadastro da UC"
                        >
                          Editar
                        </GlaButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé e Paginação Canônica */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Mostrando <strong>1</strong> a <strong>{unidadesFiltradas.length}</strong> de <strong>{unidades.length}</strong> registros
          </div>
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <GlaButton variant="outline" size="xs" disabled leftIcon={<ChevronLeft className="w-3 h-3" />}>
              Anterior
            </GlaButton>
            <span className="px-2 py-1 text-xs font-bold text-[#0F4C3A] bg-white border border-slate-300 rounded shadow-2xs">
              1
            </span>
            <GlaButton variant="outline" size="xs" disabled rightIcon={<ChevronRight className="w-3 h-3" />}>
              Próximo
            </GlaButton>
          </div>
        </div>
      </GlaCard>

      {/* MODAL DE VISUALIZAÇÃO RÁPIDA (TL001) */}
      {ucVisualizar && (
        <GlaModal
          isOpen={!!ucVisualizar}
          onClose={() => setUcVisualizar(null)}
          title={ucVisualizar.nome}
          description={`Código CEUC: ${ucVisualizar.codigoCeu} • Gestão Integrada do Sistema Estadual de UCs`}
          size="lg"
          footer={
            <GlaButton variant="outline" size="sm" onClick={() => setUcVisualizar(null)}>
              Fechar
            </GlaButton>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Categoria</span>
              <span className="text-xs font-semibold text-slate-800">{ucVisualizar.categoria} ({ucVisualizar.grupoManejo})</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Município & Bioma</span>
              <span className="text-xs font-semibold text-slate-800">{ucVisualizar.municipio} • Bioma {ucVisualizar.bioma}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gestor da Unidade</span>
              <span className="text-xs font-semibold text-slate-800">{ucVisualizar.gestor}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Área Georreferenciada</span>
              <span className="text-xs font-semibold text-slate-800">{ucVisualizar.areaHectares.toLocaleString('pt-BR')} hectares</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plano de Manejo (PMUC)</span>
              <span className="text-xs font-semibold text-slate-800">{ucVisualizar.statusPmuc} {ucVisualizar.anoPmuc ? `(${ucVisualizar.anoPmuc})` : ''}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Elegibilidade para Visitação</span>
              <span className="text-xs font-semibold text-slate-800">{ucVisualizar.elegivelVisitacao ? 'Sim (Disponível no Módulo de Visitação)' : 'Não (Restrito)'}</span>
            </div>
          </div>
        </GlaModal>
      )}
    </div>
  );
};
