import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  Filter
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
  TramitacaoItem
} from '@/data/regulacaoMock';

interface AcompanhamentoPautaTabProps {
  onSelectProcesso: (item: TramitacaoItem) => void;
}

export const AcompanhamentoPautaTab: React.FC<AcompanhamentoPautaTabProps> = ({
  onSelectProcesso,
}) => {
  const [busca, setBusca] = useState('');
  const [filtroPrazo, setFiltroPrazo] = useState<string>('todos');
  const [filtroUnidade, setFiltroUnidade] = useState<string>('todas');

  const pautaFiltrada = useMemo(() => {
    return MOCK_PAUTA.filter((item) => {
      if (busca) {
        const termo = busca.toLowerCase();
        const bateuProcesso = item.processo.toLowerCase().includes(termo);
        const bateuInteressado = item.interessado.toLowerCase().includes(termo);
        const bateuTecnico = item.tecnicoAtual.toLowerCase().includes(termo);
        if (!bateuProcesso && !bateuInteressado && !bateuTecnico) return false;
      }
      if (filtroPrazo !== 'todos' && item.situacaoPrazo !== filtroPrazo) {
        return false;
      }
      if (filtroUnidade !== 'todas' && item.unidadeAtual !== filtroUnidade) {
        return false;
      }
      return true;
    });
  }, [busca, filtroPrazo, filtroUnidade]);

  // Converter PautaItem em TramitacaoItem para reutilizar o modal de detalhamento
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
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          Prazo Excedido
        </span>
      );
    }
    if (prazo === 'Atenção') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          Atenção
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        No prazo
      </span>
    );
  };

  const renderSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case 'RL APROVADA':
      case 'DEFERIDO':
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
      case 'AGUARDANDO DOCUMENTAÇÃO':
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
      {/* 1. NOTA DE ATUALIZAÇÃO NO TOPO */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-600">
            Pauta consolidada em: <strong className="text-slate-900 font-semibold">22/09/2026 10:00</strong>
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Base: SEIA / Regulação Ambiental Estadual
        </div>
      </div>

      {/* 2. CARDS DE RESUMO (KPIs) - ZERO ÍCONES NO TÍTULO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Processos na pauta consultada
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">3.840</span>
            <span className="text-xs text-slate-600 font-medium">
              Processos ativos em tramitação
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Total de processos distribuídos entre as coordenações da regulação ambiental.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Processos com prazo excedido
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-rose-700">412</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
              10,7% da pauta em alerta
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Processos sem movimentação técnica dentro do prazo regulamentar previsto pelo INEMA.
          </p>
        </div>
      </div>

      {/* 3. GRÁFICOS: DONUT DE SITUAÇÃO & BARCHART DE FAIXAS DE DIAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Donut de Situação */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Processos por situação atual</h3>
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
                  paddingAngle={3}
                  dataKey="value"
                >
                  {MOCK_SITUACOES_PAUTA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Faixas de Dias sem Movimentação */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Processos por faixas de dias sem movimentação</h3>
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
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="processos" name="Processos" fill="#0F4C3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. TABELA DE ACOMPANHAMENTO DA PAUTA */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs">
        {/* Controles de Busca e Filtro Rápido */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Processos na Pauta Ativa</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Lista operacional com alerta de prazos e distribuição de técnicos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Input de Busca */}
            <div className="relative w-56">
              <input
                type="text"
                placeholder="Buscar processo, interessado..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 rounded border border-slate-300 focus:bg-white focus:outline-hidden text-slate-800 placeholder-slate-400"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Filtro Prazo */}
            <select
              value={filtroPrazo}
              onChange={(e) => setFiltroPrazo(e.target.value)}
              className="h-8 px-2 text-xs rounded border border-slate-300 bg-white text-slate-800 focus:outline-hidden"
            >
              <option value="todos">Todos os prazos</option>
              <option value="No prazo">No prazo</option>
              <option value="Atenção">Atenção</option>
              <option value="Prazo Excedido">Prazo Excedido</option>
            </select>

            {/* Filtro Unidade */}
            <select
              value={filtroUnidade}
              onChange={(e) => setFiltroUnidade(e.target.value)}
              className="h-8 px-2 text-xs rounded border border-slate-300 bg-white text-slate-800 focus:outline-hidden"
            >
              <option value="todas">Todas as Unidades</option>
              <option value="DIRRE/CGF">DIRRE/CGF</option>
              <option value="DIRRE/CEG">DIRRE/CEG</option>
              <option value="DIRRE/CRH">DIRRE/CRH</option>
              <option value="DILIC/UR-METRO">DILIC/UR-METRO</option>
              <option value="DILIC/UR-SUL">DILIC/UR-SUL</option>
            </select>
          </div>
        </div>

        {/* Tabela da Pauta */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Processo</th>
                <th className="py-3 px-4">Interessado</th>
                <th className="py-3 px-4">Unidade atual</th>
                <th className="py-3 px-4">Técnico atual</th>
                <th className="py-3 px-4">Situação atual</th>
                <th className="py-3 px-4 text-center">Atos</th>
                <th className="py-3 px-4">Última mov.</th>
                <th className="py-3 px-4 text-center">Dias s/ mov.</th>
                <th className="py-3 px-4">Situação prazo</th>
                <th className="py-3 px-4 text-right">Ação</th>
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
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-semibold text-slate-900">
                      {item.processo}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-[190px] truncate" title={item.interessado}>
                      {item.interessado}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {item.unidadeAtual}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.tecnicoAtual === 'Sem atribuição técnica' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Sem atribuição técnica
                        </span>
                      ) : (
                        <span className="font-medium text-slate-800">{item.tecnicoAtual}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderSituacaoBadge(item.situacaoAtual)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className="inline-flex items-center justify-center w-6 h-5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 cursor-help"
                        title={item.atos.join(' • ')}
                      >
                        {item.qtdAtos}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {item.ultimaMovimentacao}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap font-medium">
                      <span className={item.diasSemMovimentacao > 30 ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                        {item.diasSemMovimentacao}d
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderBadgePrazo(item.situacaoPrazo)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDetalhar(item)}
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
            Exibindo {pautaFiltrada.length} de 3.840 processos na pauta consultada.
          </span>
          <span className="text-slate-500">
            Página 1 de 480
          </span>
        </div>
      </div>
    </div>
  );
};
