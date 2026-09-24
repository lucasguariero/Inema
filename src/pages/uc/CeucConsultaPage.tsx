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

export const CeucConsultaPage: React.FC = () => {
  // Lista de UCs
  const [unidades, setUnidades] = useState<UcItem[]>(MOCK_UNIDADES_CONSERVACAO);

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

  // Estados de modal de visualização e edição (placeholder para Fases seguintes)
  const [ucVisualizar, setUcVisualizar] = useState<UcItem | null>(null);
  const [ucEditar, setUcEditar] = useState<UcItem | null>(null);

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

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Toast Notificação de Sucesso */}
      {toastNotificacao && (
        <GlaNotification
          type="success"
          title="Exportação concluída"
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
                onClick={() => alert('O formulário completo de cadastro (Fases seguintes) será aberto.')}
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
            <div className="lg:col-span-2">
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

            {/* 5. Elegível para Visitação */}
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
                          onClick={() => setUcEditar(uc)}
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

      {/* MODAL DE EDIÇÃO (PLACEHOLDER INFORMATIVO FASE 1) */}
      {ucEditar && (
        <GlaModal
          isOpen={!!ucEditar}
          onClose={() => setUcEditar(null)}
          title={`Editar Cadastro: ${ucEditar.nome}`}
          description="Formulário completo do CEUC (DOR036) com dados geográficos, atos e equipe técnica."
          size="md"
          footer={
            <div className="flex items-center gap-2">
              <GlaButton variant="outline" size="sm" onClick={() => setUcEditar(null)}>
                Cancelar
              </GlaButton>
              <GlaButton
                variant="primary"
                size="sm"
                onClick={() => {
                  setUcEditar(null);
                  setToastNotificacao(`Dados da UC ${ucEditar.codigoCeu} atualizados com sucesso.`);
                }}
              >
                Salvar Alterações
              </GlaButton>
            </div>
          }
        >
          <div className="space-y-3">
            <GlaInput label="Nome da Unidade de Conservação" defaultValue={ucEditar.nome} />
            <GlaInput label="Gestor Responsável" defaultValue={ucEditar.gestor} />
            <GlaSelect
              label="Status do Conselho Gestor"
              defaultValue={ucEditar.statusConselho}
              options={[
                { value: 'Ativo e Paritário', label: 'Ativo e Paritário' },
                { value: 'Em Formação', label: 'Em Formação' },
                { value: 'Inativo', label: 'Inativo' }
              ]}
            />
          </div>
        </GlaModal>
      )}
    </div>
  );
};
