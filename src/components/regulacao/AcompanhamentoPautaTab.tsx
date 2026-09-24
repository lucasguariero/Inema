import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  Filter,
  FileSpreadsheet,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  PautaItem,
  MOCK_PAUTA,
  MOCK_SITUACOES_PAUTA,
  MOCK_FAIXAS_DIAS_PAUTA,
  TramitacaoItem,
  FiltrosPauta
} from '@/data/regulacaoMock';
import {
  GlaPagination
} from '@/components/common/GlaTable';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AcompanhamentoPautaTabProps {
  filtros: FiltrosPauta;
  onOpenFiltros: () => void;
  onRemoveFiltro: (chave: keyof FiltrosPauta) => void;
  onLimparFiltros: () => void;
  onSelectProcesso: (item: TramitacaoItem) => void;
}

export const AcompanhamentoPautaTab: React.FC<AcompanhamentoPautaTabProps> = ({
  filtros,
  onOpenFiltros,
  onRemoveFiltro,
  onLimparFiltros,
  onSelectProcesso,
}) => {
  const [statusExportacao, setStatusExportacao] = useState<'disponivel' | 'gerando' | 'sucesso'>('disponivel');

  // Filtros ativos para pílulas
  const pillsFiltros = useMemo(() => {
    const pills: { chave: keyof FiltrosPauta; label: string }[] = [];
    if (filtros.busca) {
      pills.push({ chave: 'busca', label: `Busca: "${filtros.busca}"` });
    }
    if (filtros.prazo && filtros.prazo !== 'todos') {
      pills.push({ chave: 'prazo', label: `Prazo: ${filtros.prazo}` });
    }
    if (filtros.unidade && filtros.unidade !== 'todas') {
      pills.push({ chave: 'unidade', label: `Unidade: ${filtros.unidade}` });
    }
    if (filtros.tecnico && filtros.tecnico !== 'todos') {
      pills.push({ chave: 'tecnico', label: `Técnico: ${filtros.tecnico}` });
    }
    if (filtros.situacao && filtros.situacao !== 'todas') {
      pills.push({ chave: 'situacao', label: `Situação: ${filtros.situacao}` });
    }
    return pills;
  }, [filtros]);

  const totalFiltrosAtivos = pillsFiltros.length;

  const pautaFiltrada = useMemo(() => {
    return MOCK_PAUTA.filter((item) => {
      if (filtros.busca) {
        const termo = filtros.busca.toLowerCase();
        const bateuProcesso = item.processo.toLowerCase().includes(termo);
        const bateuInteressado = item.interessado.toLowerCase().includes(termo);
        const bateuTecnico = item.tecnicoAtual.toLowerCase().includes(termo);
        if (!bateuProcesso && !bateuInteressado && !bateuTecnico) return false;
      }
      if (filtros.prazo !== 'todos' && item.situacaoPrazo !== filtros.prazo) {
        return false;
      }
      if (filtros.unidade !== 'todas' && item.unidadeAtual !== filtros.unidade) {
        return false;
      }
      if (filtros.tecnico !== 'todos' && item.tecnicoAtual !== filtros.tecnico) {
        return false;
      }
      if (filtros.situacao !== 'todas' && item.situacaoAtual !== filtros.situacao) {
        return false;
      }
      return true;
    });
  }, [filtros]);

  // Handler de exportação
  const handleExportarExcel = () => {
    if (statusExportacao !== 'disponivel') return;
    setStatusExportacao('gerando');
    setTimeout(() => {
      const cabecalhos = 'Processo,Interessado,Unidade Atual,Técnico Atual,Situação Atual,Qtd Atos,Última Movimentação,Dias Sem Mov,Situação Prazo\n';
      const linhas = pautaFiltrada
        .map(
          (p) =>
            `"${p.processo}","${p.interessado}","${p.unidadeAtual}","${p.tecnicoAtual}","${p.situacaoAtual}","${p.qtdAtos}","${p.ultimaMovimentacao}","${p.diasSemMovimentacao}","${p.situacaoPrazo}"`
        )
        .join('\n');

      const blob = new Blob([cabecalhos + linhas], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `pauta_regulacao_inema_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatusExportacao('sucesso');
      setTimeout(() => setStatusExportacao('disponivel'), 3000);
    }, 1200);
  };

  const handleDetalhar = (pauta: PautaItem) => {
    const itemAdaptado: TramitacaoItem = {
      id: pauta.id,
      processo: pauta.processo,
      dataTramitacao: pauta.ultimaMovimentacao + ' 10:00',
      interessado: pauta.interessado,
      unidade: pauta.unidadeAtual,
      ato: pauta.atos.join(', '),
      familiaAto: 'Regulação Geral',
      situacao: pauta.situacaoAtual as any,
      municipio: pauta.municipio,
      tipologia: pauta.tipologia,
      liderEquipe: pauta.liderEquipe,
      membrosEquipe: pauta.membrosEquipe,
      ano: 2026,
      diasSemMovimentacao: pauta.diasSemMovimentacao,
      prazoExcedido: pauta.situacaoPrazo === 'Prazo Excedido',
      resumoDespacho: pauta.observacoes,
      etapaAtual: 'Análise de Pauta Regulatória'
    };
    onSelectProcesso(itemAdaptado);
  };

  const renderBadgePrazo = (prazo: string) => {
    if (prazo === 'Prazo Excedido') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Prazo Excedido
        </span>
      );
    }
    if (prazo === 'Atenção') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          Atenção
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        No prazo
      </span>
    );
  };

  const renderSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case 'RL APROVADA':
      case 'DEFERIDO':
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
      case 'AGUARDANDO DOCUMENTAÇÃO':
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
      {/* 1. NOTA DE ATUALIZAÇÃO NO TOPO - PADRÃO GLA LEGADO */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0F4C3A]" />
          <span className="text-xs font-medium text-slate-600">
            Pauta consolidada em: <strong className="text-slate-900 font-bold">22/09/2026 10:00</strong>
          </span>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Base: SEIA / Regulação Ambiental Estadual
        </div>
      </div>

      {/* 2. CARDS DE RESUMO (KPIs) - PADRÃO GLA LEGADO (fi-wi-stats-overview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs ring-1 ring-slate-950/5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Processos na pauta consultada
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">3.840</span>
            <span className="text-xs font-semibold text-slate-600">
              Processos ativos em tramitação
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Total de processos distribuídos entre as coordenações da regulação ambiental.
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs ring-1 ring-slate-950/5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Processos com prazo excedido
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-rose-700 tracking-tight">412</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              10,7% da pauta em alerta
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Espécie do prazo: <strong>Análise Regulatória Conclusiva (Portaria INEMA nº 25.753/2022)</strong>.
          </p>
        </div>
      </div>

      {/* 3. GRÁFICOS: DONUT DE SITUAÇÃO & BARCHART DE FAIXAS DE DIAS (PALETA INSTITUCIONAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Donut de Situação */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">Processos por situação atual</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proporção dos processos conforme a etapa em que se encontram na pauta.
            </p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_SITUACOES_PAUTA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {MOCK_SITUACOES_PAUTA.map((_, index) => {
                    const colors = ['#0F4C3A', '#2D6A4F', '#52796F', '#64748B', '#94A3B8', '#CBD5E1'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD5E1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Faixas de Dias sem Movimentação */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">Processos por faixas de dias sem movimentação</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tempo decorrido desde o último despacho ou manifestação técnica.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_FAIXAS_DIAS_PAUTA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="faixa" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
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
                <Bar dataKey="quantidade" name="Processos" fill="#0F4C3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. BARRA DE FILTROS SUPERIOR (LEVE E INTEGRADA) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenFiltros}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filtros da Pauta</span>
            {totalFiltrosAtivos > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#0F4C3A] text-white">
                {totalFiltrosAtivos}
              </span>
            )}
          </button>

          {/* Pílulas de filtros ativos */}
          {pillsFiltros.map((pill) => (
            <span
              key={pill.chave}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              <span>{pill.label}</span>
              <button
                onClick={() => onRemoveFiltro(pill.chave)}
                className="hover:text-rose-600 focus:outline-hidden cursor-pointer"
                title="Remover filtro"
              >
                <X className="w-3 h-3 text-slate-400 hover:text-rose-600" />
              </button>
            </span>
          ))}

          {totalFiltrosAtivos > 0 && (
            <button
              onClick={onLimparFiltros}
              className="text-xs font-semibold text-[#0F4C3A] hover:underline cursor-pointer transition-colors ml-1"
            >
              Limpar todos
            </button>
          )}
        </div>
      </div>

      {/* 5. TABELA DA PAUTA ATIVA (PADRÃO DOR003 / DOR002) */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Processos na Pauta Ativa
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Lista operacional com alerta de prazos e distribuição técnica das coordenações.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Badge variant="outline" className="text-xs font-mono">
              {pautaFiltrada.length} de 3.840 processos
            </Badge>

            {/* Ação Primária da Tabela: Exportar Pauta para Excel */}
            {statusExportacao === 'disponivel' && (
              <button
                onClick={handleExportarExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold rounded-md shadow-2xs transition-colors cursor-pointer"
                title="Exporta os resultados da última consulta confirmada"
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
                <span>Gerando Excel...</span>
              </button>
            )}

            {statusExportacao === 'sucesso' && (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C3A] text-white text-xs font-semibold rounded-md shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Excel gerado. Baixar arquivo</span>
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Cód. Processo</th>
                  <th className="py-3 px-4">Interessado</th>
                  <th className="py-3 px-4">Unidade Atual</th>
                  <th className="py-3 px-4">Técnico / Equipe</th>
                  <th className="py-3 px-4">Situação Atual</th>
                  <th className="py-3 px-4 text-center">Atos</th>
                  <th className="py-3 px-4">Última Movimentação</th>
                  <th className="py-3 px-4 text-center">Dias s/ Mov.</th>
                  <th className="py-3 px-4">Situação Prazo</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {pautaFiltrada.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500">
                      Nenhum processo encontrado na pauta com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  pautaFiltrada.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">{item.processo}</div>
                        <div className="text-[10px] text-slate-400 font-mono">SEIA / Regulação</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate" title={item.interessado}>
                        {item.interessado}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {item.unidadeAtual}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.tecnicoAtual === 'Sem atribuição técnica' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Sem atribuição técnica
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-800">{item.tecnicoAtual}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderSituacaoBadge(item.situacaoAtual)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className="inline-flex items-center justify-center w-6 h-5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 cursor-help"
                          title={item.atos.join(' • ')}
                        >
                          {item.qtdAtos}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {item.ultimaMovimentacao === 'Sem tramitação registrada' ? (
                          <span className="text-slate-500 italic">Sem tramitação registrada</span>
                        ) : (
                          item.ultimaMovimentacao
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {item.ultimaMovimentacao === 'Sem tramitação registrada' ? (
                          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {item.diasSemMovimentacao}d (desde formação)
                          </span>
                        ) : (
                          <span className={item.diasSemMovimentacao > 30 ? 'text-rose-700 font-bold' : 'text-slate-700 font-medium'}>
                            {item.diasSemMovimentacao}d
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderBadgePrazo(item.situacaoPrazo)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDetalhar(item)}
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

          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <GlaPagination
              currentCount={pautaFiltrada.length}
              totalCount={3840}
              page={1}
              totalPages={1}
              entityName="processos"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
