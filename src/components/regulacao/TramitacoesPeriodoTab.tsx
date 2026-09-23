import React, { useState, useMemo } from 'react';
import {
  Filter,
  FileSpreadsheet,
  Check,
  Loader2,
  X,
  ChevronRight,
  Eye,
  ChevronLeft
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  TramitacaoItem,
  FiltrosTramitacao,
  MOCK_TRAMITACOES,
  MOCK_EVOLUCAO_MENSAL,
  MOCK_DISTRIBUICAO_UNIDADE,
  MOCK_ATIVIDADES_TECNICO,
  MOCK_ANUAL_DIRRE,
  LISTA_FAMILIAS
} from '@/data/regulacaoMock';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const [anoDirre, setAnoDirre] = useState<number>(2026);
  const [familiaDirre, setFamiliaDirre] = useState<string>('Todas as Famílias');

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

  // Dados para o modo D (Anual DIRRE)
  const dadosAnualDirre = useMemo(() => {
    return MOCK_ANUAL_DIRRE.filter((item) => {
      if (familiaDirre !== 'Todas as Famílias' && item.familia !== familiaDirre) {
        return false;
      }
      return true;
    });
  }, [familiaDirre]);

  // Handler de exportação para Excel
  const handleExportarExcel = () => {
    if (statusExportacao !== 'disponivel') return;

    setStatusExportacao('gerando');

    setTimeout(() => {
      const cabecalhos = 'Data Tramitação,Processo,Interessado,Unidade,Ato,Situação,Líder Equipe,Membros Equipe\n';
      const linhas = tramitacoesFiltradas
        .map(
          (t) =>
            `"${t.dataTramitacao}","${t.processo}","${t.interessado}","${t.unidade}","${t.ato}","${t.situacao}","${t.liderEquipe}","${t.membrosEquipe.join('; ')}"`
        )
        .join('\n');

      const blob = new Blob([cabecalhos + linhas], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio_tramitacoes_regulacao_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatusExportacao('sucesso');

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
    <div className="space-y-6">
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

        <div className="text-xs font-mono text-slate-400 dark:text-slate-500 hidden sm:block">
          SEIA / DIRRE • Base 2024
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Evolução Mensal */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">Evolução no período</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Volume mensal de tramitações e atos registrados em 2026.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_EVOLUCAO_MENSAL} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
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
                <Bar dataKey="tramitacoes" name="Tramitações" fill="#0F4C3A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="atos" name="Atos/Atividades" fill="#52796F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Distribuição por Unidade */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">Distribuição por Unidade</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribuição do total de atos entre diretorias e unidades regionais.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_DISTRIBUICAO_UNIDADE}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <YAxis dataKey="unidade" type="category" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD5E1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="total" name="Atos Registrados" fill="#0F4C3A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
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

            <Badge variant="outline" className="text-xs font-mono">
              {tramitacoesFiltradas.length} processos
            </Badge>

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
            {/* Bloco de médias de processos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Média Mensal</div>
                <div className="text-xl font-bold text-slate-800 mt-0.5">18,4 processos/mês</div>
                <div className="text-[11px] text-slate-500">Por técnico ativo na regulação</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Média Trimestral</div>
                <div className="text-xl font-bold text-slate-800 mt-0.5">54,2 processos/trimestre</div>
                <div className="text-[11px] text-slate-500">Média ponderada do quadro</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Média Semestral</div>
                <div className="text-xl font-bold text-slate-800 mt-0.5">108,1 processos/semestre</div>
                <div className="text-[11px] text-slate-500">Consolidação semestral DIRRE</div>
              </div>
            </div>

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
                  {MOCK_ATIVIDADES_TECNICO.map((tec, idx) => (
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
              <span className="text-xs font-bold text-slate-700">Critério de agrupamento:</span>
              <div className="inline-flex rounded-lg bg-white border border-slate-300 p-0.5">
                <button
                  onClick={() => setCriterioAgrupamento('municipio')}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    criterioAgrupamento === 'municipio'
                      ? 'bg-[#0F4C3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Município
                </button>
                <button
                  onClick={() => setCriterioAgrupamento('tipologia')}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    criterioAgrupamento === 'tipologia'
                      ? 'bg-[#0F4C3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tipologia
                </button>
                <button
                  onClick={() => setCriterioAgrupamento('ato')}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    criterioAgrupamento === 'ato'
                      ? 'bg-[#0F4C3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ato/Atividade
                </button>
                <button
                  onClick={() => setCriterioAgrupamento('situacao')}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    criterioAgrupamento === 'situacao'
                      ? 'bg-[#0F4C3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
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
                    <th className="py-2.5 px-3.5 text-center">Registros</th>
                    <th className="py-2.5 px-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dadosAgrupamento.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3.5 font-bold text-slate-900">{item.grupo}</td>
                      <td className="py-2.5 px-3.5 text-center font-bold text-slate-800">{item.processos}</td>
                      <td className="py-2.5 px-3.5 text-center font-bold text-slate-800">{item.registros}</td>
                      <td className="py-2.5 px-3.5 text-right">
                        <button
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
          </div>
        )}

        {/* MODO D: ANUAL DIRRE */}
        {modoVisualizacao === 'anual' && (
          <div className="p-4 space-y-4">
            {/* Controles de filtro Anual */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
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

            {/* Card Destacado Sóbrio */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-[#0F4C3A] uppercase tracking-wider">
                Registros concluídos ou encaminhados para publicação
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">1.482 atos</div>
              <p className="text-xs text-slate-500 mt-0.5">
                Atos regulatórios finalizados pelas coordenações da DIRRE com publicação oficial no Diário Oficial do Estado (DOE) ou certificado SEIA emitido.
              </p>
            </div>

            <div className="overflow-x-auto">
              <GlaTable>
                <GlaTableHead>
                  <tr>
                    <GlaTh>Família</GlaTh>
                    <GlaTh>Ato/atividade</GlaTh>
                    <GlaTh>Situação</GlaTh>
                    <GlaTh align="center">Registros totais</GlaTh>
                    <GlaTh align="center">Concluídos / Publicados</GlaTh>
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
                      <GlaTd align="center" className="font-bold text-emerald-700">{item.concluidosPublicados}</GlaTd>
                      <GlaTd align="right">
                        <GlaTableAction
                          variant="outline"
                          onClick={() => setModoVisualizacao('registros')}
                        >
                          Detalhar
                        </GlaTableAction>
                      </GlaTd>
                    </GlaTableRow>
                  ))}
                </GlaTableBody>
              </GlaTable>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
