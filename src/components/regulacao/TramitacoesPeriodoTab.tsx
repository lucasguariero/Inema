import React, { useState, useMemo } from 'react';
import {
  Filter,
  FileSpreadsheet,
  Check,
  Loader2,
  X,
  ChevronRight,
  Eye,
  ChevronLeft,
  Info,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TramitacaoItem,
  FiltrosTramitacao,
  MOCK_TRAMITACOES,
  MOCK_EVOLUCAO_MENSAL,
  MOCK_EVOLUCAO_TRIMESTRAL_2024,
  MOCK_EVOLUCAO_SEMESTRAL_2024,
  MOCK_EVOLUCAO_ANUAL_HISTORICO,
  MOCK_DISTRIBUICAO_UNIDADE,
  MOCK_DISTRIBUICAO_ATO_2024,
  MOCK_DISTRIBUICAO_SITUACAO_2024,
  MOCK_DISTRIBUICAO_TECNICO_2024,
  MOCK_ATIVIDADES_TECNICO,
  MOCK_ANUAL_DIRRE,
  MOCK_ANUAL_DIRRE_FAMILIAS,
  MOCK_ANUAL_DIRRE_EVOLUCAO,
  LISTA_FAMILIAS
} from '@/data/regulacaoMock';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  GlaTable,
  GlaTableHead,
  GlaTh,
  GlaTableBody,
  GlaTableRow,
  GlaTd,
  GlaTableAction,
  GlaPagination
} from '@/components/common/GlaTable';

interface TramitacoesPeriodoTabProps {
  filtros: FiltrosTramitacao;
  onOpenFiltros: () => void;
  onRemoveFiltro: (chave: keyof FiltrosTramitacao, valor?: string) => void;
  onLimparFiltros: () => void;
  onSelectProcesso: (item: TramitacaoItem) => void;
}

type ModoVisualizacao = 'registros' | 'tecnicos' | 'agrupamento' | 'anual';
type CriterioAgrupamento = 'municipio' | 'tipologia' | 'ato' | 'situacao';
type MedidaGrafico = 'processos' | 'registros';
type GranularidadeEvolucao = 'mes' | 'trimestre' | 'semestre' | 'ano';
type CriterioDistribuicao = 'unidade' | 'ato' | 'situacao' | 'tecnico';

export const TramitacoesPeriodoTab: React.FC<TramitacoesPeriodoTabProps> = ({
  filtros,
  onOpenFiltros,
  onRemoveFiltro,
  onLimparFiltros,
  onSelectProcesso,
}) => {
  const [modoVisualizacao, setModoVisualizacao] = useState<ModoVisualizacao>('registros');
  const [statusExportacao, setStatusExportacao] = useState<'disponivel' | 'gerando' | 'sucesso'>('disponivel');
  const [criterioAgrupamento, setCriterioAgrupamento] = useState<CriterioAgrupamento>('municipio');
  const [anoDirre, setAnoDirre] = useState<number>(2024);
  const [familiaDirre, setFamiliaDirre] = useState<string>('Todas');

  // Novos Controles de Gráficos (Requisito 1)
  const [granularidadeEvolucao, setGranularidadeEvolucao] = useState<GranularidadeEvolucao>('mes');
  const [criterioDistribuicao, setCriterioDistribuicao] = useState<CriterioDistribuicao>('unidade');

  // Controle de medida dos gráficos: Processos vs Registros
  const [medidaGrafico, setMedidaGrafico] = useState<MedidaGrafico>('processos');

  // Controle de filtro de unidade para visão Atividades por técnico (Requisito 2)
  const [unidadeFiltroTecnico, setUnidadeFiltroTecnico] = useState<string>('NOUT');
  const [simularMediaIndisponivel, setSimularMediaIndisponivel] = useState<boolean>(false);

  // Regra Condicional NOUT: Só renderiza médias se unidade for NOUT
  const isNout = (filtros.unidades.length === 1 && (filtros.unidades[0] === 'NOUT' || filtros.unidades[0] === 'DIRRE/NOUT')) || unidadeFiltroTecnico === 'NOUT';

  // Dados calculados para Evolução (Requisito 1)
  const dadosEvolucao = useMemo(() => {
    switch (granularidadeEvolucao) {
      case 'trimestre':
        return MOCK_EVOLUCAO_TRIMESTRAL_2024.map((item) => ({
          label: item.periodo,
          processos: item.total,
          atos: item.atos
        }));
      case 'semestre':
        return MOCK_EVOLUCAO_SEMESTRAL_2024.map((item) => ({
          label: item.periodo,
          processos: item.total,
          atos: item.atos
        }));
      case 'ano':
        return MOCK_EVOLUCAO_ANUAL_HISTORICO.map((item) => ({
          label: item.periodo,
          processos: item.total,
          atos: item.atos
        }));
      case 'mes':
      default:
        return MOCK_EVOLUCAO_MENSAL.map((item) => ({
          label: item.mes,
          processos: item.total,
          atos: item.atos
        }));
    }
  }, [granularidadeEvolucao]);

  // Dados calculados para Distribuição (Requisito 1)
  const dadosDistribuicao = useMemo(() => {
    switch (criterioDistribuicao) {
      case 'ato':
        return MOCK_DISTRIBUICAO_ATO_2024;
      case 'situacao':
        return MOCK_DISTRIBUICAO_SITUACAO_2024;
      case 'tecnico':
        return MOCK_DISTRIBUICAO_TECNICO_2024;
      case 'unidade':
      default:
        return MOCK_DISTRIBUICAO_UNIDADE.map((u) => ({ label: u.unidade, total: u.total }));
    }
  }, [criterioDistribuicao]);

  // Dados filtrados Anual DIRRE (Requisito 3)
  const dadosAnualDirre = useMemo(() => {
    if (familiaDirre === 'Todas') return MOCK_ANUAL_DIRRE;
    return MOCK_ANUAL_DIRRE.filter((item) => item.familia === familiaDirre);
  }, [familiaDirre]);

  // Filtros ativos para exibir nas pílulas
  const pillsFiltros = useMemo(() => {
    const pills: { chave: keyof FiltrosTramitacao; label: string; valor?: string }[] = [];

    if (filtros.dataInicio || filtros.dataFim) {
      pills.push({
        chave: 'dataInicio',
        label: `Período: ${filtros.dataInicio || 'Início'} até ${filtros.dataFim || 'Hoje'}`
      });
    }
    filtros.unidades.forEach((u) => {
      pills.push({ chave: 'unidades', label: `Unidade: ${u}`, valor: u });
    });
    filtros.atos.forEach((a) => {
      pills.push({ chave: 'atos', label: `Ato: ${a.length > 25 ? a.substring(0, 25) + '...' : a}`, valor: a });
    });
    filtros.situacoes.forEach((s) => {
      pills.push({ chave: 'situacoes', label: `Situação: ${s}`, valor: s });
    });
    filtros.tecnicos.forEach((t) => {
      pills.push({ chave: 'tecnicos', label: `Técnico: ${t}`, valor: t });
    });
    if (filtros.papelEquipe && filtros.papelEquipe !== 'qualquer') {
      pills.push({
        chave: 'papelEquipe',
        label: `Papel: ${filtros.papelEquipe === 'lider' ? 'Líder da Equipe' : 'Membro da Equipe'}`
      });
    }
    if (filtros.processo) {
      pills.push({ chave: 'processo', label: `Processo: ${filtros.processo}` });
    }
    if (filtros.interessado) {
      pills.push({ chave: 'interessado', label: `Interessado: ${filtros.interessado}` });
    }
    filtros.municipios.forEach((m) => {
      pills.push({ chave: 'municipios', label: `Município: ${m}`, valor: m });
    });
    filtros.tipologias.forEach((tip) => {
      pills.push({ chave: 'tipologias', label: `Tipologia: ${tip}`, valor: tip });
    });

    return pills;
  }, [filtros]);

  const totalFiltrosAtivos = pillsFiltros.length;

  // Filtragem dos dados de tramitações
  const tramitacoesFiltradas = useMemo(() => {
    return MOCK_TRAMITACOES.filter((item) => {
      if (filtros.processo && !item.processo.toLowerCase().includes(filtros.processo.toLowerCase())) {
        return false;
      }
      if (filtros.interessado && !item.interessado.toLowerCase().includes(filtros.interessado.toLowerCase())) {
        return false;
      }
      if (filtros.unidades.length > 0 && !filtros.unidades.includes(item.unidade)) {
        return false;
      }
      if (filtros.atos.length > 0 && !filtros.atos.includes(item.ato)) {
        return false;
      }
      if (filtros.situacoes.length > 0 && !filtros.situacoes.includes(item.situacao)) {
        return false;
      }
      if (filtros.municipios.length > 0 && !filtros.municipios.includes(item.municipio)) {
        return false;
      }
      if (filtros.tipologias.length > 0 && !filtros.tipologias.includes(item.tipologia)) {
        return false;
      }
      if (filtros.tecnicos.length > 0) {
        const participaLider = filtros.tecnicos.includes(item.liderEquipe);
        const participaMembro = item.membrosEquipe.some((m) => filtros.tecnicos.includes(m));

        if (filtros.papelEquipe === 'lider' && !participaLider) return false;
        if (filtros.papelEquipe === 'membro' && !participaMembro) return false;
        if (filtros.papelEquipe === 'qualquer' && !participaLider && !participaMembro) return false;
      }
      return true;
    });
  }, [filtros]);

  // Agrupamentos calculados para o modo C
  const dadosAgrupamento = useMemo(() => {
    const mapa = new Map<string, { grupo: string; processos: number; registros: number }>();

    MOCK_TRAMITACOES.forEach((item) => {
      let chave = '';
      if (criterioAgrupamento === 'municipio') chave = item.municipio;
      else if (criterioAgrupamento === 'tipologia') chave = item.tipologia;
      else if (criterioAgrupamento === 'ato') chave = item.ato;
      else if (criterioAgrupamento === 'situacao') chave = item.situacao;

      const atual = mapa.get(chave) || { grupo: chave, processos: 0, registros: 0 };
      atual.processos += 1;
      atual.registros += 1;
      mapa.set(chave, atual);
    });

    return Array.from(mapa.values());
  }, [criterioAgrupamento]);

  // Técnicos filtrados conforme a coordenação/unidade selecionada
  const tecnicosFiltrados = useMemo(() => {
    if (unidadeFiltroTecnico === 'Todas') return MOCK_ATIVIDADES_TECNICO;
    return MOCK_ATIVIDADES_TECNICO.filter(
      (tec) => tec.unidade === unidadeFiltroTecnico || tec.unidade.includes(unidadeFiltroTecnico)
    );
  }, [unidadeFiltroTecnico]);

  // Estado de notificação toast de exportação
  const [toastNotificacao, setToastNotificacao] = useState<string | null>(null);

  // Handler de exportação para Excel (respeita a visão ativa, 100% front-end sem download físico)
  const handleExportarExcel = () => {
    if (statusExportacao !== 'disponivel') return;

    setStatusExportacao('gerando');

    setTimeout(() => {
      setStatusExportacao('sucesso');
      setToastNotificacao('Relatório de tramitações exportado com sucesso.');

      // Auto-fechamento do toast após 4 segundos
      setTimeout(() => {
        setToastNotificacao(null);
      }, 4000);

      // Retorno do botão ao estado disponível após 3 segundos
      setTimeout(() => {
        setStatusExportacao('disponivel');
      }, 3000);
    }, 1200);
  };

  // Badges Sóbrios Institucionais GLA
  const renderSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case 'RL APROVADA':
      case 'DEFERIDO':
      case 'CONCLUÍDO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {situacao}
          </span>
        );
      case 'EM ANÁLISE TÉCNICA':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            {situacao}
          </span>
        );
      case 'NOTIFICADO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            {situacao}
          </span>
        );
      case 'REVISADO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            {situacao}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {situacao}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* TOAST DE SUCESSO NO CANTO SUPERIOR DIREITO - PADRÃO GLA / FILAMENT */}
      {toastNotificacao && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-emerald-300 text-slate-800 text-xs rounded-xl shadow-lg ring-1 ring-slate-950/5 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="pr-2">
            <span className="font-bold text-slate-900 block">Exportação concluída</span>
            <span className="text-slate-600 text-[11px]">{toastNotificacao}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastNotificacao(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer text-xs"
            title="Fechar notificação"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. BARRA DE FILTROS SUPERIOR (LEVE E INTEGRADA) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenFiltros}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Filtros</span>
            {totalFiltrosAtivos > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#0F4C3A] text-white">
                {totalFiltrosAtivos}
              </span>
            )}
          </button>

          {/* Pílulas de filtros aplicados */}
          {pillsFiltros.map((pill, idx) => (
            <span
              key={`${pill.chave}-${idx}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              <span>{pill.label}</span>
              <button
                onClick={() => onRemoveFiltro(pill.chave, pill.valor)}
                className="hover:text-rose-600 focus:outline-hidden cursor-pointer"
                title="Remover filtro"
              >
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
              </button>
            </span>
          ))}

          {totalFiltrosAtivos > 0 && (
            <button
              onClick={onLimparFiltros}
              className="text-xs font-semibold text-[#0F4C3A] hover:underline cursor-pointer transition-colors ml-1"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* 2. CARDS DE RESUMO (KPIs) - PADRÃO GLA LEGADO (fi-wi-stats-overview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs ring-1 ring-slate-950/5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Processos com tramitação no período
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">4.182</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              +12% em relação ao período anterior
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Total acumulado de processos do SEIA movimentados no intervalo selecionado.
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs ring-1 ring-slate-950/5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Registros de atos/atividades no período
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">9.450</span>
            <span className="text-xs font-semibold text-slate-600">
              Média de 2,26 atos/processo
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Soma de todos os atos regulatórios analisados, vistoriados ou despachados.
          </p>
        </div>
      </div>

      {/* 3. GRÁFICOS: EVOLUÇÃO NO PERÍODO & DISTRIBUIÇÃO POR UNIDADE */}
      <div className="space-y-4">
        {/* Seletor de Medida dos Gráficos (Processos vs Registros de Atos/Atividades) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-700">Medida dos Gráficos:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setMedidaGrafico('processos')}
                className={cn(
                  'px-3 py-1 text-xs rounded-md font-semibold transition-colors cursor-pointer',
                  medidaGrafico === 'processos'
                    ? 'bg-white text-[#0F4C3A] font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Processos
              </button>
              <button
                type="button"
                onClick={() => setMedidaGrafico('registros')}
                className={cn(
                  'px-3 py-1 text-xs rounded-md font-semibold transition-colors cursor-pointer',
                  medidaGrafico === 'registros'
                    ? 'bg-white text-[#0F4C3A] font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Registros de atos/atividades
              </button>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            O título e os valores refletem a medida selecionada.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 1: Evolução com Controles de Granularidade (Requisito 1) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Evolução no período • {medidaGrafico === 'processos' ? 'Processos' : 'Registros de atos/atividades'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Volume {granularidadeEvolucao === 'mes' ? 'mensal' : granularidadeEvolucao === 'trimestre' ? 'trimestral' : granularidadeEvolucao === 'semestre' ? 'semestral' : 'anual'} de {medidaGrafico === 'processos' ? 'processos distintos com tramitação' : 'registros de atos e atividades'} em 2024.
                </p>
              </div>

              {/* Seletor Compacto de Granularidade */}
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Escala:</span>
                <select
                  value={granularidadeEvolucao}
                  onChange={(e) => setGranularidadeEvolucao(e.target.value as any)}
                  className="h-7 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-800 px-2 shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="mes">Mês</option>
                  <option value="trimestre">Trimestre</option>
                  <option value="semestre">Semestre</option>
                  <option value="ano">Ano</option>
                </select>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosEvolucao} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#CBD5E1',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  {medidaGrafico === 'processos' ? (
                    <Bar dataKey="processos" name="Processos com Tramitação" fill="#0F4C3A" radius={[4, 4, 0, 0]} />
                  ) : (
                    <Bar dataKey="atos" name="Registros de Atos/Atividades" fill="#52796F" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Distribuição com Controles de Critério (Requisito 1) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Distribuição por {criterioDistribuicao === 'unidade' ? 'Unidade' : criterioDistribuicao === 'ato' ? 'Ato / Atividade' : criterioDistribuicao === 'situacao' ? 'Situação' : 'Técnico'} • {medidaGrafico === 'processos' ? 'Processos' : 'Registros'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribuição apurada no exercício de 2024.
                </p>
              </div>

              {/* Seletor Compacto de Distribuição */}
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Agrupar:</span>
                <select
                  value={criterioDistribuicao}
                  onChange={(e) => setCriterioDistribuicao(e.target.value as any)}
                  className="h-7 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-800 px-2 shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="unidade">Unidade / Coordenação</option>
                  <option value="ato">Ato / Atividade</option>
                  <option value="situacao">Situação</option>
                  <option value="tecnico">Técnico</option>
                </select>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosDistribuicao}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 45, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                  <YAxis dataKey="label" type="category" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} width={85} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#CBD5E1',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="total"
                    name={medidaGrafico === 'processos' ? 'Processos' : 'Registros'}
                    fill="#0F4C3A"
                    radius={[0, 4, 4, 0]}
                    className="cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TABELA DE DETALHAMENTO DOS DADOS (PADRÃO DOR003 / DOR002) */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Cabeçalho do Bloco de Dados - Idêntico a DOR003 e DOR002 */}
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Detalhamento dos Dados
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Alterne a visualização conforme a granularidade e o objetivo da análise.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Segmented Control Legado GLA */}
            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 shrink-0">
              <button
                onClick={() => setModoVisualizacao('registros')}
                className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  modoVisualizacao === 'registros'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'
                }`}
              >
                Registros
              </button>
              <button
                onClick={() => setModoVisualizacao('tecnicos')}
                className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  modoVisualizacao === 'tecnicos'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'
                }`}
              >
                Atividades por técnico
              </button>
              <button
                onClick={() => setModoVisualizacao('agrupamento')}
                className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  modoVisualizacao === 'agrupamento'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'
                }`}
              >
                Por agrupamento
              </button>
              <button
                onClick={() => setModoVisualizacao('anual')}
                className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  modoVisualizacao === 'anual'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'
                }`}
              >
                Anual DIRRE
              </button>
            </div>

            {/* Ação Primária da Tabela: Exportar Excel */}
            {statusExportacao === 'disponivel' && (
              <button
                onClick={handleExportarExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold rounded-md shadow-2xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar Excel</span>
              </button>
            )}

            {statusExportacao === 'gerando' && (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-500 text-xs font-semibold rounded-md cursor-not-allowed shadow-2xs"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
                <span>Gerando...</span>
              </button>
            )}

            {statusExportacao === 'sucesso' && (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C3A] text-white text-xs font-semibold rounded-md shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Gerado</span>
              </button>
            )}
          </div>
        </CardHeader>

        {/* MODO A: REGISTROS (PADRÃO DOR003 / DOR002) */}
        {modoVisualizacao === 'registros' && (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Cód. Processo / CEFIR</th>
                    <th className="py-3 px-4">Data da Tramitação</th>
                    <th className="py-3 px-4">Interessado / Razão Social</th>
                    <th className="py-3 px-4">Coordenação</th>
                    <th className="py-3 px-4">Ato / Atividade</th>
                    <th className="py-3 px-4">Situação</th>
                    <th className="py-3 px-4">Equipe Técnica</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {tramitacoesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        Nenhum registro encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    tramitacoesFiltradas.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">{item.processo}</div>
                          <div className="text-[10px] text-slate-400 font-mono">SEIA / DIRRE</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                          {item.dataTramitacao}
                        </td>
                        <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate" title={item.interessado}>
                          {item.interessado}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                          {item.unidade}
                        </td>
                        <td className="py-3 px-4 text-slate-700 max-w-[180px] truncate font-medium" title={item.ato}>
                          {item.ato}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {renderSituacaoBadge(item.situacao)}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="font-semibold text-slate-800">{item.liderEquipe}</span>
                          {item.membrosEquipe.length > 0 && (
                            <span className="text-slate-500 block text-[10px]">
                              +{item.membrosEquipe.length} participante(s)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectProcesso(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            <span>Detalhar</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação Padrão GLA / DOR003 */}
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <GlaPagination
                currentCount={tramitacoesFiltradas.length}
                totalCount={4182}
                page={1}
                totalPages={1}
                entityName="registros"
              />
            </div>
          </CardContent>
        )}

        {/* MODO B: ATIVIDADES POR TÉCNICO */}
        {modoVisualizacao === 'tecnicos' && (
          <div className="p-4 space-y-4">
            {/* Seletor de Coordenação / Unidade */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Coordenação / Unidade:</span>
                <select
                  value={unidadeFiltroTecnico}
                  onChange={(e) => setUnidadeFiltroTecnico(e.target.value)}
                  className="h-8 px-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden font-medium shadow-2xs"
                >
                  <option value="NOUT">NOUT (Núcleo de Outorga)</option>
                  <option value="Todas">Todas as Coordenações</option>
                  <option value="DIRRE">DIRRE (Diretoria de Regulação)</option>
                  <option value="CRAS">CRAS</option>
                  <option value="DITEC">DITEC</option>
                  <option value="DIFIS">DIFIS</option>
                </select>
              </div>

              {isNout && (
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-slate-500 font-medium cursor-pointer flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={simularMediaIndisponivel}
                      onChange={(e) => setSimularMediaIndisponivel(e.target.checked)}
                      className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
                    />
                    <span>Simular período não consolidado</span>
                  </label>
                </div>
              )}
            </div>

            {/* Bloco de médias de processos (Exclusivo NOUT: só renderiza se coordenação/unidade for NOUT) */}
            {isNout && (
              simularMediaIndisponivel ? (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold block text-sm">Média indisponível: cobertura do período não confirmada</span>
                    <p className="text-[11px] text-amber-800/80 mt-0.5">
                      O período selecionado na consulta não atende aos requisitos de consolidação temporal para apuração das médias dos técnicos do NOUT.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs ring-1 ring-slate-950/5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Média Mensal em 2024 (12 meses)</div>
                      <div className="text-xl font-bold text-slate-800 mt-1">18,4 <span className="text-xs font-normal text-slate-500">processos/mês</span></div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Jan/2024 a Dez/2024 (12 meses completos considerados)
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs ring-1 ring-slate-950/5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Média Trimestral em 2024 (4 trimestres)</div>
                      <div className="text-xl font-bold text-slate-800 mt-1">54,2 <span className="text-xs font-normal text-slate-500">processos/trimestre</span></div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        1º ao 4º Trimestre 2024 (4 trimestres completos)
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs ring-1 ring-slate-950/5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Média Semestral em 2024 (2 semestres)</div>
                      <div className="text-xl font-bold text-slate-800 mt-1">108,1 <span className="text-xs font-normal text-slate-500">processos/semestre</span></div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        1º e 2º Semestre 2024 (2 semestres completos)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-500">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Média dos totais de processos distintos de cada período completo considerado (Exclusivo NOUT).</span>
                  </div>
                </div>
              )
            )}

            <div className="overflow-x-auto">
              <GlaTable>
                <GlaTableHead>
                  <tr>
                    <GlaTh>Técnico</GlaTh>
                    <GlaTh>Unidade de lotação</GlaTh>
                    <GlaTh align="center">Processos com participação</GlaTh>
                    <GlaTh align="center">Registros com participação</GlaTh>
                    <GlaTh align="right">Ação</GlaTh>
                  </tr>
                </GlaTableHead>
                <GlaTableBody>
                  {tecnicosFiltrados.map((tec, idx) => (
                    <GlaTableRow key={idx}>
                      <GlaTd className="font-bold text-slate-900">{tec.tecnico}</GlaTd>
                      <GlaTd className="text-slate-600 font-medium">{tec.unidade}</GlaTd>
                      <GlaTd align="center" className="font-bold text-slate-800">
                        {tec.processosParticipacao}
                      </GlaTd>
                      <GlaTd align="center" className="font-bold text-slate-800">
                        {tec.registrosParticipacao}
                      </GlaTd>
                      <GlaTd align="right">
                        <GlaTableAction
                          variant="outline"
                          onClick={() => setModoVisualizacao('registros')}
                          icon={<ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        >
                          Ver registros
                        </GlaTableAction>
                      </GlaTd>
                    </GlaTableRow>
                  ))}
                </GlaTableBody>
              </GlaTable>
            </div>
          </div>
        )}

        {/* MODO C: POR AGRUPAMENTO */}
        {modoVisualizacao === 'agrupamento' && (
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Agrupar por:</span>
              <div className="inline-flex rounded-lg bg-white border border-slate-300 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setCriterioAgrupamento('municipio')}
                  className={cn(
                    'px-3 py-1 text-xs rounded font-semibold transition-colors cursor-pointer',
                    criterioAgrupamento === 'municipio'
                      ? 'bg-[#0F4C3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Município
                </button>
                <button
                  type="button"
                  onClick={() => setCriterioAgrupamento('tipologia')}
                  className={cn(
                    'px-3 py-1 text-xs rounded font-semibold transition-colors cursor-pointer',
                    criterioAgrupamento === 'tipologia'
                      ? 'bg-[#0F4C3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Tipologia
                </button>
                <button
                  type="button"
                  onClick={() => setCriterioAgrupamento('ato')}
                  className={cn(
                    'px-3 py-1 text-xs rounded font-semibold transition-colors cursor-pointer',
                    criterioAgrupamento === 'ato'
                      ? 'bg-[#0F4C3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Ato / Atividade
                </button>
                <button
                  type="button"
                  onClick={() => setCriterioAgrupamento('situacao')}
                  className={cn(
                    'px-3 py-1 text-xs rounded font-semibold transition-colors cursor-pointer',
                    criterioAgrupamento === 'situacao'
                      ? 'bg-[#0F4C3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Situação
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3.5">Grupo ({criterioAgrupamento.toUpperCase()})</th>
                    <th className="py-2.5 px-3.5 text-center">Processos</th>
                    <th className="py-2.5 px-3.5 text-center">Registros de atos/atividades</th>
                    <th className="py-2.5 px-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {dadosAgrupamento.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3.5 font-bold text-slate-900">{item.grupo}</td>
                      <td className="py-2.5 px-3.5 text-center font-bold text-slate-800">{item.processos}</td>
                      <td className="py-2.5 px-3.5 text-center font-bold text-slate-800">{item.registros}</td>
                      <td className="py-2.5 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setModoVisualizacao('registros')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                        >
                          <span>Ver registros</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Nota Obrigatória conforme Guia UX */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                Um processo pode aparecer em mais de um grupo. O total geral considera processos distintos.
              </span>
            </div>
          </div>
        )}

        {/* MODO D: ANUAL DIRRE */}
        {modoVisualizacao === 'anual' && (
          <div className="p-4 space-y-4">
            {/* Controles de filtro Anual */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Ano base:</label>
                  <select
                    value={anoDirre}
                    onChange={(e) => setAnoDirre(Number(e.target.value))}
                    className="h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden font-medium"
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Família do ato:</label>
                  <select
                    value={familiaDirre}
                    onChange={(e) => setFamiliaDirre(e.target.value)}
                    className="h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden font-medium"
                  >
                    {LISTA_FAMILIAS.map((fam) => (
                      <option key={fam} value={fam}>
                        {fam}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Situações consideradas: Concluído e Para publicação
              </span>
            </div>

            {/* Card Destacado Sóbrio */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-[#0F4C3A] uppercase tracking-wider">
                Ano Referência: {anoDirre}
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">1.482 registros</div>
              <p className="text-xs text-slate-600 mt-0.5">
                Registros concluídos ou encaminhados para publicação.
              </p>
            </div>

            {/* 2 Gráficos Específicos: Donut de Famílias + Barras Mensal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Gráfico 1: Distribuição por Família (Donut) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
                  <span>Distribuição por Família ({anoDirre})</span>
                  <span className="text-[11px] text-slate-500 font-normal">Total: 1.482</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MOCK_ANUAL_DIRRE_FAMILIAS}
                        dataKey="total"
                        nameKey="familia"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {MOCK_ANUAL_DIRRE_FAMILIAS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [`${val} registros`, 'Volume']}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px'
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico 2: Evolução Mensal no Ano Selecionado (Barras) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
                  <span>Evolução Mensal ({anoDirre})</span>
                  <span className="text-[11px] text-slate-500 font-normal">Jan a Dez</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_ANUAL_DIRRE_EVOLUCAO} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                      <Tooltip
                        formatter={(val: any) => [`${val} registros`, 'Concluídos/Publicados']}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="registros" fill="#0F4C3A" radius={[4, 4, 0, 0]} name="Registros" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <GlaTable>
                <GlaTableHead>
                  <tr>
                    <GlaTh>Família</GlaTh>
                    <GlaTh>Ato / Atividade</GlaTh>
                    <GlaTh>Situação</GlaTh>
                    <GlaTh align="center">Registros</GlaTh>
                    <GlaTh align="right">Ação</GlaTh>
                  </tr>
                </GlaTableHead>
                <GlaTableBody>
                  {dadosAnualDirre.map((item, idx) => (
                    <GlaTableRow key={idx}>
                      <GlaTd className="text-slate-600 font-medium">{item.familia}</GlaTd>
                      <GlaTd className="font-bold text-slate-900">{item.ato}</GlaTd>
                      <GlaTd>{renderSituacaoBadge(item.situacao)}</GlaTd>
                      <GlaTd align="center" className="font-bold text-slate-800">{item.registros}</GlaTd>
                      <GlaTd align="right">
                        <GlaTableAction
                          variant="outline"
                          onClick={() => setModoVisualizacao('registros')}
                        >
                          Ver registros
                        </GlaTableAction>
                      </GlaTd>
                    </GlaTableRow>
                  ))}
                </GlaTableBody>
              </GlaTable>
            </div>

            {/* Avisos Institucionais Conforme Guia UX */}
            <div className="p-3 bg-slate-100/70 rounded-lg border border-slate-200 text-slate-600 text-[11px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
                <span>38 atos Não classificados identificados na base. Registros Fora do recorte anual não são contabilizados nesta perspectiva.</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
