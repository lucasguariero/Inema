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
            Processos sem movimentação técnica dentro do prazo regulamentar previsto pelo INEMA.
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
                  {MOCK_SITUACOES_PAUTA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
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
                <Bar dataKey="processos" name="Processos" fill="#0F4C3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. BARRA DE FILTROS LIMPA (SEM SELECTS SOLTOS NA TELA) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenFiltros}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-slate-600" />
              <span>Filtros da Pauta</span>
              {totalFiltrosAtivos > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#0F4C3A] text-white">
                  {totalFiltrosAtivos}
                </span>
              )}
            </button>

            {totalFiltrosAtivos > 0 && (
              <button
                onClick={onLimparFiltros}
                className="text-xs font-semibold text-[#0F4C3A] hover:underline cursor-pointer transition-colors ml-1"
              >
                Limpar todos
              </button>
            )}
          </div>

          <div>
            {statusExportacao === 'disponivel' && (
              <button
                onClick={handleExportarExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0F4C3A] hover:bg-[#155d47] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Exportar Pauta</span>
              </button>
            )}

            {statusExportacao === 'gerando' && (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 border border-slate-300 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed shadow-2xs"
              >
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                <span>Gerando Planilha...</span>
              </button>
            )}

            {statusExportacao === 'sucesso' && (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0F4C3A] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Planilha gerada</span>
              </button>
            )}
          </div>
        </div>

        {/* Pílulas de filtros da pauta */}
        {totalFiltrosAtivos > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600">Filtros aplicados:</span>
            {pillsFiltros.map((pill) => (
              <span
                key={pill.chave}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                <span>{pill.label}</span>
                <button
                  onClick={() => onRemoveFiltro(pill.chave)}
                  className="hover:text-rose-600 focus:outline-hidden cursor-pointer"
                  title="Remover filtro"
                >
                  <X className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 5. TABELA DENSA DA PAUTA OPERACIONAL */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Cabeçalho da Tabela */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-700">Processos na Pauta Ativa</h3>
            <p className="text-[11px] text-slate-500 block">
              Lista operacional com alerta de prazos e distribuição técnica.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600">
            Total: {pautaFiltrada.length} de 3.840 processos
          </span>
        </div>

        {/* Tabela da Pauta */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Processo</th>
                <th className="py-2.5 px-3.5">Interessado</th>
                <th className="py-2.5 px-3.5">Unidade atual</th>
                <th className="py-2.5 px-3.5">Técnico atual</th>
                <th className="py-2.5 px-3.5">Situação atual</th>
                <th className="py-2.5 px-3.5 text-center">Atos</th>
                <th className="py-2.5 px-3.5">Última mov.</th>
                <th className="py-2.5 px-3.5 text-center">Dias s/ mov.</th>
                <th className="py-2.5 px-3.5">Situação prazo</th>
                <th className="py-2.5 px-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pautaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    Nenhum processo encontrado na pauta com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                pautaFiltrada.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3.5 whitespace-nowrap font-bold text-slate-900">
                      {item.processo}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-700 max-w-[190px] truncate" title={item.interessado}>
                      {item.interessado}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-slate-600 font-medium">
                      {item.unidadeAtual}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      {item.tecnicoAtual === 'Sem atribuição técnica' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Sem atribuição técnica
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-800">{item.tecnicoAtual}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      {renderSituacaoBadge(item.situacaoAtual)}
                    </td>
                    <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                      <span
                        className="inline-flex items-center justify-center w-6 h-5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 cursor-help"
                        title={item.atos.join(' • ')}
                      >
                        {item.qtdAtos}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-slate-600 font-medium">
                      {item.ultimaMovimentacao}
                    </td>
                    <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                      <span className={item.diasSemMovimentacao > 30 ? 'text-rose-700 font-bold' : 'text-slate-700 font-medium'}>
                        {item.diasSemMovimentacao}d
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      {renderBadgePrazo(item.situacaoPrazo)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
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

        {/* Paginação Padrão GLA */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Exibindo <span className="font-bold text-slate-900">1</span>-<span className="font-bold text-slate-900">{pautaFiltrada.length}</span> de <span className="font-bold text-slate-900">3.840</span> processos
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-md font-semibold text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Anterior
            </button>
            <span className="px-2.5 py-1 bg-[#0F4C3A] text-white font-bold rounded-md text-xs">1</span>
            <button
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-md font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              Próxima
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
