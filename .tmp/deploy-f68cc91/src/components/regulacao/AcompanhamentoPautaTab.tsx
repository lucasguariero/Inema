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
  Loader2,
  CheckCircle2
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
  onFiltrosChange?: (novos: FiltrosPauta) => void;
}

export const AcompanhamentoPautaTab: React.FC<AcompanhamentoPautaTabProps> = ({
  filtros,
  onOpenFiltros,
  onRemoveFiltro,
  onLimparFiltros,
  onSelectProcesso,
  onFiltrosChange,
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
    if (filtros.atribuicao && filtros.atribuicao !== 'todos') {
      pills.push({
        chave: 'atribuicao',
        label: filtros.atribuicao === 'sem_atribuicao' ? 'Sem atribuição' : 'Com equipe'
      });
    }
    if (filtros.atoVinculado && filtros.atoVinculado !== 'todos') {
      pills.push({ chave: 'atoVinculado', label: `Ato: ${filtros.atoVinculado}` });
    }
    if (filtros.municipio && filtros.municipio !== 'todos') {
      pills.push({ chave: 'municipio', label: `Município: ${filtros.municipio}` });
    }
    if (filtros.tipologia && filtros.tipologia !== 'todas') {
      pills.push({ chave: 'tipologia', label: `Tipologia: ${filtros.tipologia}` });
    }
    const temDiasMin = filtros.diasMin !== undefined && filtros.diasMin !== '' && !isNaN(Number(filtros.diasMin));
    const temDiasMax = filtros.diasMax !== undefined && filtros.diasMax !== '' && !isNaN(Number(filtros.diasMax));
    if (temDiasMin || temDiasMax) {
      pills.push({
        chave: 'diasMin',
        label: `Dias: ${temDiasMin ? filtros.diasMin : 0} a ${temDiasMax ? filtros.diasMax : '∞'}`
      });
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
      if (filtros.prazo && filtros.prazo !== 'todos' && item.situacaoPrazo !== filtros.prazo) {
        return false;
      }
      if (filtros.atribuicao && filtros.atribuicao !== 'todos') {
        if (filtros.atribuicao === 'sem_atribuicao' && item.tecnicoAtual !== 'Sem atribuição técnica') {
          return false;
        }
        if (filtros.atribuicao === 'com_equipe' && item.tecnicoAtual === 'Sem atribuição técnica') {
          return false;
        }
      }
      if (filtros.atoVinculado && filtros.atoVinculado !== 'todos') {
        if (!item.atos.some((a) => a.toLowerCase().includes(filtros.atoVinculado!.toLowerCase()))) {
          return false;
        }
      }
      if (filtros.municipio && filtros.municipio !== 'todos' && item.municipio !== filtros.municipio) {
        return false;
      }
      if (filtros.tipologia && filtros.tipologia !== 'todas' && item.tipologia !== filtros.tipologia) {
        return false;
      }
      const temFiltroMin = filtros.diasMin !== undefined && filtros.diasMin !== '' && !isNaN(Number(filtros.diasMin));
      if (temFiltroMin && item.diasSemMovimentacao < Number(filtros.diasMin)) {
        return false;
      }
      const temFiltroMax = filtros.diasMax !== undefined && filtros.diasMax !== '' && !isNaN(Number(filtros.diasMax));
      if (temFiltroMax && item.diasSemMovimentacao > Number(filtros.diasMax)) {
        return false;
      }
      if (filtros.unidade && filtros.unidade !== 'todas' && item.unidadeAtual !== filtros.unidade) {
        return false;
      }
      if (filtros.tecnico && filtros.tecnico !== 'todos' && item.tecnicoAtual !== filtros.tecnico) {
        return false;
      }
      if (filtros.situacao && filtros.situacao !== 'todas' && item.situacaoAtual !== filtros.situacao) {
        return false;
      }
      return true;
    });
  }, [filtros]);

  // Estado de notificação toast de exportação
  const [toastNotificacao, setToastNotificacao] = useState<string | null>(null);

  // Handler de exportação (100% front-end sem download físico)
  const handleExportarExcel = () => {
    if (statusExportacao !== 'disponivel') return;
    setStatusExportacao('gerando');
    setTimeout(() => {
      setStatusExportacao('sucesso');
      setToastNotificacao('Pauta consolidada exportada com sucesso.');

      // Auto-fechamento do toast após 4 segundos
      setTimeout(() => {
        setToastNotificacao(null);
      }, 4000);

      // Retorno do botão ao estado disponível após 3 segundos
      setTimeout(() => setStatusExportacao('disponivel'), 3000);
    }, 1200);
  };

  const handleDetalhar = (pauta: PautaItem) => {
    onSelectProcesso(pauta as any);
  };

  const renderBadgePrazo = (prazo: string) => {
    switch (prazo) {
      case 'Excedido':
      case 'Prazo Excedido':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Excedido
          </span>
        );
      case 'Suspenso':
      case 'Atenção':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Suspenso
          </span>
        );
      case 'Não aplicável':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Não aplicável
          </span>
        );
      case 'Indeterminado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Indeterminado
          </span>
        );
      case 'No prazo':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            No prazo
          </span>
        );
    }
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
    <div className="space-y-6 relative">
      {/* CARIMBO OFICIAL DE ATUALIZAÇÃO DA PAUTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C3A]"></span>
          <span className="font-mono font-bold text-xs text-slate-800">
            Pauta em: 24/09/2024 10:00
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">•</span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Posição oficial consolidada de processos ativos
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium">
            Regra normativa: Portaria INEMA nº 25.753/2022
          </span>
        </div>
      </div>

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

      {/* 1. CARDS DE RESUMO (KPIs) - PADRÃO GLA LEGADO (fi-wi-stats-overview) */}
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
            <span className="text-3xl font-bold text-rose-700 tracking-tight">
              {totalFiltrosAtivos > 0
                ? pautaFiltrada.filter((p) => p.situacaoPrazo === 'Excedido').length
                : 412}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              {totalFiltrosAtivos > 0
                ? `${((pautaFiltrada.filter((p) => p.situacaoPrazo === 'Excedido').length / (pautaFiltrada.length || 1)) * 100).toFixed(1)}% dos filtrados`
                : '10,7% da pauta em alerta'}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Espécie do prazo: <strong>Análise Regulatória Conclusiva (Portaria INEMA nº 25.753/2022)</strong>. Não contabiliza prazos indeterminados.
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

      {/* 3. TABELA DA PAUTA ATIVA COM TOOLBAR DE FILTROS INTEGRADA */}
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
            {/* Acionador Integrado de Filtros da Pauta */}
            <button
              onClick={onOpenFiltros}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filtros</span>
              {totalFiltrosAtivos > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#0F4C3A] text-white">
                  {totalFiltrosAtivos}
                </span>
              )}
            </button>

            <Badge variant="outline" className="text-xs font-mono">
              {pautaFiltrada.length} de 3.840 processos
            </Badge>

            {/* Ação Primária da Tabela: Exportar Pauta para Excel */}
            {statusExportacao === 'disponivel' && (
              <button
                onClick={handleExportarExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold rounded-md shadow-2xs transition-colors cursor-pointer"
                title="Exporta os resultados da pauta consultada"
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

        {/* Toolbar de Filtros Integrados da Pauta */}
        <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center gap-2.5">
          {/* Busca Rápida */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar processo, interessado, técnico..."
              value={filtros.busca || ''}
              onChange={(e) => onFiltrosChange?.({ ...filtros, busca: e.target.value })}
              className="w-full pl-8 pr-2.5 h-8 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#0F4C3A]"
            />
          </div>

          {/* Situação do Prazo */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">Prazo:</span>
            <select
              value={filtros.prazo || 'todos'}
              onChange={(e) => onFiltrosChange?.({ ...filtros, prazo: e.target.value as any })}
              className="h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden font-medium"
            >
              <option value="todos">Todos</option>
              <option value="No prazo">No prazo</option>
              <option value="Excedido">Excedido</option>
              <option value="Suspenso">Suspenso</option>
              <option value="Não aplicável">Não aplicável</option>
              <option value="Indeterminado">Indeterminado</option>
            </select>
          </div>

          {/* Atribuição */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">Atribuição:</span>
            <select
              value={filtros.atribuicao || 'todos'}
              onChange={(e) => onFiltrosChange?.({ ...filtros, atribuicao: e.target.value as any })}
              className="h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden font-medium"
            >
              <option value="todos">Todos</option>
              <option value="sem_atribuicao">Sem atribuição técnica</option>
              <option value="com_equipe">Com técnico / equipe</option>
            </select>
          </div>

          {/* Ato Vinculado */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">Ato:</span>
            <select
              value={filtros.atoVinculado || 'todos'}
              onChange={(e) => onFiltrosChange?.({ ...filtros, atoVinculado: e.target.value })}
              className="h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden font-medium max-w-[140px] truncate"
            >
              <option value="todos">Todos os Atos</option>
              <option value="Outorga">Outorga Hídrica</option>
              <option value="Licença Prévia">Licença Prévia (LP)</option>
              <option value="Licença de Instalação">Licença Instalação (LI)</option>
              <option value="Licença de Operação">Licença Operação (LO)</option>
              <option value="Supressão">Supressão Vegetal (ASV)</option>
            </select>
          </div>

          {/* Município */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">Município:</span>
            <select
              value={filtros.municipio || 'todos'}
              onChange={(e) => onFiltrosChange?.({ ...filtros, municipio: e.target.value })}
              className="h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden font-medium max-w-[130px] truncate"
            >
              <option value="todos">Todos</option>
              <option value="Salvador">Salvador</option>
              <option value="Feira de Santana">Feira de Santana</option>
              <option value="Camaçari">Camaçari</option>
              <option value="Luís Eduardo Magalhães">Luís Eduardo Magalhães</option>
              <option value="Barreiras">Barreiras</option>
              <option value="Juazeiro">Juazeiro</option>
              <option value="Ilhéus">Ilhéus</option>
              <option value="Vitória da Conquista">Vitória da Conquista</option>
            </select>
          </div>

          {/* Tipologia */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">Tipologia:</span>
            <select
              value={filtros.tipologia || 'todas'}
              onChange={(e) => onFiltrosChange?.({ ...filtros, tipologia: e.target.value })}
              className="h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden font-medium max-w-[130px] truncate"
            >
              <option value="todas">Todas</option>
              <option value="Recursos Hídricos">Recursos Hídricos</option>
              <option value="Florestal">Florestal</option>
              <option value="Indústria">Indústria</option>
              <option value="Mineração">Mineração</option>
              <option value="Infraestrutura">Infraestrutura</option>
            </select>
          </div>

          {/* Faixa Dias s/ Movimentação */}
          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-bold whitespace-nowrap">
            <span>Dias:</span>
            <input
              type="number"
              min={0}
              placeholder="Mín"
              value={filtros.diasMin ?? ''}
              onChange={(e) =>
                onFiltrosChange?.({
                  ...filtros,
                  diasMin: e.target.value ? Number(e.target.value) : undefined
                })
              }
              className="w-12 h-8 px-1 text-xs text-center rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden"
            />
            <span className="text-slate-400 font-normal">-</span>
            <input
              type="number"
              min={0}
              placeholder="Máx"
              value={filtros.diasMax ?? ''}
              onChange={(e) =>
                onFiltrosChange?.({
                  ...filtros,
                  diasMax: e.target.value ? Number(e.target.value) : undefined
                })
              }
              className="w-12 h-8 px-1 text-xs text-center rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Barra de chips de filtros ativos integrada na tabela quando houver filtros */}
        {totalFiltrosAtivos > 0 && (
          <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Filtros ativos:</span>
            {pillsFiltros.map((pill) => (
              <span
                key={pill.chave}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
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
            <button
              onClick={onLimparFiltros}
              className="text-xs font-semibold text-[#0F4C3A] hover:underline cursor-pointer transition-colors ml-1"
            >
              Limpar todos
            </button>
          </div>
        )}

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
                        {item.semTramitacao || item.ultimaMovimentacao === 'Sem tramitação registrada' ? (
                          <span className="text-slate-500 italic">Sem tramitação registrada</span>
                        ) : (
                          item.ultimaMovimentacao
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {item.semTramitacao || item.ultimaMovimentacao === 'Sem tramitação registrada' ? (
                          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            {item.diasDesdeFormacao ?? item.diasSemMovimentacao}d (desde formação)
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
