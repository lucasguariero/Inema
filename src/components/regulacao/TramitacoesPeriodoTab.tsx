import React, { useState, useMemo } from 'react';
import {
  Filter,
  FileSpreadsheet,
  Check,
  Loader2,
  X,
  ChevronRight,
  Eye,
  ArrowUpDown
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
      atual.registros += 1; // cada tramitação conta como 1 registro neste agrupamento
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
      // Gera CSV simples para download real
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

  // Badge de Situação
  const renderSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case 'RL APROVADA':
      case 'DEFERIDO':
      case 'CONCLUÍDO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {situacao}
          </span>
        );
      case 'EM ANÁLISE TÉCNICA':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            {situacao}
          </span>
        );
      case 'NOTIFICADO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            {situacao}
          </span>
        );
      case 'REVISADO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            {situacao}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {situacao}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. BARRA SUPERIOR: FILTROS, PÍLULAS E EXPORTAÇÃO */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenFiltros}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              <Filter className="w-4 h-4 text-slate-600" />
              <span>Filtros</span>
              {totalFiltrosAtivos > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-[#0F4C3A] text-white">
                  {totalFiltrosAtivos}
                </span>
              )}
            </button>

            {totalFiltrosAtivos > 0 && (
              <button
                onClick={onLimparFiltros}
                className="text-xs font-medium text-slate-500 hover:text-rose-600 underline underline-offset-2 ml-1 cursor-pointer transition-colors"
              >
                Limpar todos
              </button>
            )}
          </div>

          <div>
            {statusExportacao === 'disponivel' && (
              <button
                onClick={handleExportarExcel}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Exportar Excel</span>
              </button>
            )}

            {statusExportacao === 'gerando' && (
              <button
                disabled
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-200 text-slate-500 cursor-not-allowed"
              >
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                <span>Gerando Excel...</span>
              </button>
            )}

            {statusExportacao === 'sucesso' && (
              <button
                disabled
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white"
              >
                <Check className="w-4 h-4" />
                <span>Excel gerado</span>
              </button>
            )}
          </div>
        </div>

        {/* Pílulas de filtros aplicados */}
        {totalFiltrosAtivos > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500">Filtros aplicados:</span>
            {pillsFiltros.map((pill, idx) => (
              <span
                key={`${pill.chave}-${idx}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-100 text-slate-700 border border-slate-200"
              >
                <span>{pill.label}</span>
                <button
                  onClick={() => onRemoveFiltro(pill.chave, pill.valor)}
                  className="hover:text-rose-600 focus:outline-hidden cursor-pointer"
                  title="Remover filtro"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. CARDS DE RESUMO (KPIs) - ZERO ÍCONES NO TÍTULO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Processos com tramitação no período
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">4.182</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              +12% em relação ao período anterior
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Total acumulado de processos do SEIA movimentados no intervalo selecionado.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Registros de atos/atividades no período
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">9.450</span>
            <span className="text-xs text-slate-600 font-medium">
              Média de 2,26 atos/processo
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Soma de todos os atos regulatórios analisados, vistoriados ou despachados.
          </p>
        </div>
      </div>

      {/* 3. GRÁFICOS: EVOLUÇÃO NO PERÍODO & DISTRIBUIÇÃO POR UNIDADE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Evolução Mensal */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Evolução no período</h3>
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
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="tramitacoes" name="Tramitações" fill="#0F4C3A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="atos" name="Atos/Atividades" fill="#1E6B52" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Distribuição por Unidade */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Distribuição por Unidade</h3>
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
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="total" name="Atos Registrados" fill="#0F4C3A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. VISUALIZAÇÕES DA TABELA COM SEGMENTED CONTROLS */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs">
        {/* Cabeçalho do Bloco de Dados */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Detalhamento dos Dados</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Alterne a visualização conforme a granularidade e o objetivo da análise.
            </p>
          </div>

          {/* Segmented Control */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setModoVisualizacao('registros')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                modoVisualizacao === 'registros'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registros
            </button>
            <button
              onClick={() => setModoVisualizacao('tecnicos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                modoVisualizacao === 'tecnicos'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Atividades por técnico
            </button>
            <button
              onClick={() => setModoVisualizacao('agrupamento')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                modoVisualizacao === 'agrupamento'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por agrupamento
            </button>
            <button
              onClick={() => setModoVisualizacao('anual')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                modoVisualizacao === 'anual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Anual DIRRE
            </button>
          </div>
        </div>

        {/* MODO A: REGISTROS (PADRÃO) */}
        {modoVisualizacao === 'registros' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Data tramitação</th>
                    <th className="py-3 px-4">Processo</th>
                    <th className="py-3 px-4">Interessado</th>
                    <th className="py-3 px-4">Unidade/coord.</th>
                    <th className="py-3 px-4">Ato/atividade</th>
                    <th className="py-3 px-4">Situação</th>
                    <th className="py-3 px-4">Equipe técnica</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tramitacoesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        Nenhum registro encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    tramitacoesFiltradas.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                          {item.dataTramitacao}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-900 font-semibold">
                          {item.processo}
                        </td>
                        <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate" title={item.interessado}>
                          {item.interessado}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                          {item.unidade}
                        </td>
                        <td className="py-3 px-4 text-slate-700 max-w-[180px] truncate" title={item.ato}>
                          {item.ato}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {renderSituacaoBadge(item.situacao)}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="font-medium text-slate-800">{item.liderEquipe}</span>
                          {item.membrosEquipe.length > 0 && (
                            <span className="text-slate-500 block text-[11px]">
                              +{item.membrosEquipe.length} participante(s)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectProcesso(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
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

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>
                Exibindo {tramitacoesFiltradas.length} de 4.182 processos no período selecionado.
              </span>
              <span className="text-slate-500">
                Página 1 de 523
              </span>
            </div>
          </div>
        )}

        {/* MODO B: ATIVIDADES POR TÉCNICO */}
        {modoVisualizacao === 'tecnicos' && (
          <div className="p-4 space-y-4">
            {/* Bloco de médias de processos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <div className="text-[11px] font-medium text-slate-500 uppercase">Média Mensal</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">18,4 processos/mês</div>
                <div className="text-[11px] text-slate-500">Por técnico ativo na regulação</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 uppercase">Média Trimestral</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">54,2 processos/trimestre</div>
                <div className="text-[11px] text-slate-500">Média ponderada do quadro</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 uppercase">Média Semestral</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">108,1 processos/semestre</div>
                <div className="text-[11px] text-slate-500">Consolidação semestral DIRRE</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Técnico</th>
                    <th className="py-3 px-4">Unidade de lotação</th>
                    <th className="py-3 px-4 text-center">Processos com participação</th>
                    <th className="py-3 px-4 text-center">Registros com participação</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {MOCK_ATIVIDADES_TECNICO.map((tec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{tec.tecnico}</td>
                      <td className="py-3 px-4 text-slate-600">{tec.unidade}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-800">
                        {tec.processosParticipacao}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-slate-800">
                        {tec.registrosParticipacao}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setModoVisualizacao('registros');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
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

        {/* MODO C: POR AGRUPAMENTO */}
        {modoVisualizacao === 'agrupamento' && (
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Critério de agrupamento:</span>
              <div className="inline-flex rounded-md bg-white border border-slate-300 p-0.5">
                <button
                  onClick={() => setCriterioAgrupamento('municipio')}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    criterioAgrupamento === 'municipio'
                      ? 'bg-[#0F4C3A] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Município
                </button>
                <button
                  onClick={() => setCriterioAgrupamento('tipologia')}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    criterioAgrupamento === 'tipologia'
                      ? 'bg-[#0F4C3A] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tipologia
                </button>
                <button
                  onClick={() => setCriterioAgrupamento('ato')}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    criterioAgrupamento === 'ato'
                      ? 'bg-[#0F4C3A] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ato/Atividade
                </button>
                <button
                  onClick={() => setCriterioAgrupamento('situacao')}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    criterioAgrupamento === 'situacao'
                      ? 'bg-[#0F4C3A] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Situação
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Grupo ({criterioAgrupamento.toUpperCase()})</th>
                    <th className="py-3 px-4 text-center">Processos</th>
                    <th className="py-3 px-4 text-center">Registros</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dadosAgrupamento.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.grupo}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-800">{item.processos}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-800">{item.registros}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setModoVisualizacao('registros')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
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
            <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700">Ano base:</label>
                <select
                  value={anoDirre}
                  onChange={(e) => setAnoDirre(Number(e.target.value))}
                  className="h-8 px-2 text-xs rounded border border-slate-300 bg-white text-slate-800 focus:outline-hidden"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700">Família do ato:</label>
                <select
                  value={familiaDirre}
                  onChange={(e) => setFamiliaDirre(e.target.value)}
                  className="h-8 px-2 text-xs rounded border border-slate-300 bg-white text-slate-800 focus:outline-hidden"
                >
                  {LISTA_FAMILIAS.map((fam) => (
                    <option key={fam} value={fam}>
                      {fam}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Card Destacado */}
            <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200">
              <div className="text-xs font-semibold text-emerald-900 uppercase">
                Registros concluídos ou encaminhados para publicação
              </div>
              <div className="text-2xl font-bold text-emerald-900 mt-1">1.482 atos</div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Atos regulatórios finalizados pelas coordenações da DIRRE com publicação oficial no Diário Oficial do Estado (DOE) ou certificado SEIA emitido.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Família</th>
                    <th className="py-3 px-4">Ato/atividade</th>
                    <th className="py-3 px-4">Situação</th>
                    <th className="py-3 px-4 text-center">Registros totais</th>
                    <th className="py-3 px-4 text-center">Concluídos / Publicados</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dadosAnualDirre.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-600">{item.familia}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.ato}</td>
                      <td className="py-3 px-4">{renderSituacaoBadge(item.situacao)}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-800">{item.registros}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">{item.concluidosPublicados}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setModoVisualizacao('registros')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
                        >
                          <span>Detalhar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
