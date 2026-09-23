import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  Calendar,
  ShieldCheck,
  RefreshCw,
  Plus,
  ArrowRight,
  UserCheck,
  Building2,
  FileSpreadsheet,
  BarChart3,
  Trees,
  Droplets,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { StatsOverviewWidget } from '@/components/filament/StatsOverviewWidget';
import {
  MOCK_NOTIFICACOES_SEIA,
  MOCK_COMUNICADOS_SEIA,
  MOCK_MENSAGENS_RECENTES,
  MOCK_PROCESSOS_MENSAL_SEIA,
  NotificacaoSeia
} from '@/data/hibridoMock';

interface SeiaHomePageProps {
  onNavigate?: (route: string) => void;
}

export const SeiaHomePage: React.FC<SeiaHomePageProps> = ({ onNavigate }) => {
  const [notificacoes, setNotificacoes] = useState<NotificacaoSeia[]>(MOCK_NOTIFICACOES_SEIA);
  const [comunicadoAberto, setComunicadoAberto] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleMarcarLida = (id: string) => {
    setNotificacoes(prev =>
      prev.map(item => item.id === id ? { ...item, lida: true } : item)
    );
  };

  const handleDispararAcao = (titulo: string, rotaDestino?: string) => {
    if (rotaDestino && onNavigate) {
      onNavigate(rotaDestino);
      return;
    }
    setFeedbackMsg(`Ação executada com sucesso: ${titulo}`);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const stats = [
    {
      label: 'Processos Ativos no SEIA',
      value: '248',
      description: '+12% em relação ao mês anterior',
      descriptionIcon: TrendingUp,
      color: 'success' as const
    },
    {
      label: 'DAEs Aguardando Pagamento',
      value: '14',
      description: 'R$ 84.320,00 a recolher',
      descriptionIcon: Clock,
      color: 'warning' as const,
      onClick: () => onNavigate?.('seia-daes')
    },
    {
      label: 'Alertas de Prazo Crítico',
      value: '3',
      description: 'Vencimento em menos de 5 dias',
      descriptionIcon: AlertTriangle,
      color: 'danger' as const
    },
    {
      label: 'Atos Emitidos este Mês',
      value: '42',
      description: '98.5% concluídos dentro do SLA',
      descriptionIcon: ShieldCheck,
      color: 'primary' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOAST TEMPORÁRIO DE AÇÃO */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{feedbackMsg}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. CABEÇALHO DA TELA HÍBRIDA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Central SEIA — Gestão e Monitoramento
            </h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              INEMA HÍBRIDO
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Plataforma unificada de acompanhamento de prazos, atos administrativos, DAEs e comunicados normativos.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleDispararAcao('Dados atualizados com sucesso')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Atualizar Painel</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('seia-daes')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Requerimento</span>
          </button>
        </div>
      </div>

      {/* 3. WIDGETS DE OVERVIEW (STATS FILAMENT) */}
      <StatsOverviewWidget stats={stats} columns={4} />

      {/* 4. CONTEÚDO PRINCIPAL (GRID 2/3 + 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* COLUNA ESQUERDA: ALERTAS DE PRAZOS + ATALHOS + GRÁFICO */}
        <div className="lg:col-span-2 space-y-6">
          {/* A. CENTRAL DE ALERTAS DE PRAZO (CONCEITO FORTE DO FIGMA DO CLIENTE) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                  Central de Alertas e Prazos Processuais
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Notificações prioritárias que exigem providência técnica ou manifestação do interessado
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {notificacoes.filter(n => !n.lida).length} pendentes
              </span>
            </div>

            <div className="p-4 space-y-3">
              {notificacoes.map((item) => {
                const isAlerta = item.tipo === 'alerta';
                const isSucesso = item.tipo === 'sucesso';

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.lida
                        ? 'bg-slate-50/60 border-slate-200/80 opacity-75'
                        : isAlerta
                        ? 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
                        : isSucesso
                        ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isAlerta ? (
                          <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        ) : isSucesso ? (
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
                            <Info className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-800">
                            {item.titulo}
                          </span>
                          {!item.lida && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200/60 text-amber-800 border border-amber-300">
                              Urgente
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                          <span className="font-mono font-medium text-slate-700 bg-white/70 px-1.5 py-0.5 rounded border border-slate-200">
                            {item.processo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.tempo}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {!item.lida && (
                        <button
                          type="button"
                          onClick={() => handleMarcarLida(item.id)}
                          className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-xs font-medium hover:bg-white rounded transition-colors cursor-pointer"
                        >
                          Marcar como lida
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDispararAcao(item.titulo, isAlerta ? 'seia-daes' : undefined)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs ${
                          isAlerta
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : isSucesso
                            ? 'bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{isAlerta ? 'Regularizar' : isSucesso ? 'Baixar Ato' : 'Ver Detalhes'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. ATALHOS RÁPIDOS OPERACIONAIS (MOLDADOS EM FILAMENT CARDS) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                  Atalhos de Acesso Rápido
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Operações frequentes de licenciamento, arrecadação estadual e consultas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate?.('seia-daes')}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0F4C3A] bg-slate-50/60 hover:bg-emerald-50/30 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-[#0F4C3A] mb-2.5 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#0F4C3A] transition-colors">
                  Consultar DAEs
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Arrecadação e taxas de licenças
                </p>
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('relatorios')}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0F4C3A] bg-slate-50/60 hover:bg-emerald-50/30 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-2.5 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#0F4C3A] transition-colors">
                  Relatórios de Regulação
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Pauta e acompanhamento
                </p>
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('dashboard')}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0F4C3A] bg-slate-50/60 hover:bg-emerald-50/30 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-2.5 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#0F4C3A] transition-colors">
                  Dashboard Executivo
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Painel de indicadores gerenciais
                </p>
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('uc-pesquisa-cientifica')}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0F4C3A] bg-slate-50/60 hover:bg-emerald-50/30 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-2.5 group-hover:scale-105 transition-transform">
                  <Trees className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#0F4C3A] transition-colors">
                  Unidades de Conservação
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Atos de Pesquisa e Autorizações
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleDispararAcao('Módulo CERH / Outorga selecionado')}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0F4C3A] bg-slate-50/60 hover:bg-emerald-50/30 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-2.5 group-hover:scale-105 transition-transform">
                  <Droplets className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#0F4C3A] transition-colors">
                  Outorgas & Recursos Hídricos
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Gestão de captação de água
                </p>
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('consulta-interna')}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0F4C3A] bg-slate-50/60 hover:bg-emerald-50/30 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-2.5 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#0F4C3A] transition-colors">
                  Painel DIFIS
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Autos de infração e fiscalização
                </p>
              </button>
            </div>
          </div>

          {/* C. GRÁFICO DE EVOLUÇÃO MENSAL DE PROCESSOS (FIGMA BAR CHART CONVERTIDO) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                  Evolução Mensal de Processos Autuados
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Volume de novas solicitações protocoladas no SEIA nos últimos 6 meses
                </p>
              </div>
              <span className="text-xs font-bold text-[#0F4C3A] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Total: 357 no semestre
              </span>
            </div>

            <div className="h-[220px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_PROCESSOS_MENSAL_SEIA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="mes"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                            <span className="font-semibold">{payload[0].payload.mes}:</span>{' '}
                            <span className="font-mono font-bold text-emerald-400">{payload[0].value} processos</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="quantidade"
                    fill="#0F4C3A"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: COMUNICADOS INSTITUCIONAIS + MENSAGENS RECENTES */}
        <div className="space-y-6">
          {/* 1. COMUNICADOS OFICIAIS */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Comunicados Oficiais
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                INEMA/BA
              </span>
            </div>

            <div className="p-4 space-y-3">
              {MOCK_COMUNICADOS_SEIA.map((com) => (
                <div
                  key={com.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                        com.tipo === 'AVISO'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {com.tipo}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {com.data}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 leading-snug">
                    {com.titulo}
                  </h4>

                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {com.texto}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate">{com.autor}</span>
                    <button
                      type="button"
                      onClick={() => setComunicadoAberto(com.id === comunicadoAberto ? null : com.id)}
                      className="text-[#0F4C3A] font-semibold hover:underline cursor-pointer"
                    >
                      {comunicadoAberto === com.id ? 'Recolher' : 'Ler mais'}
                    </button>
                  </div>

                  {comunicadoAberto === com.id && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-700 bg-white p-2.5 rounded-lg border">
                      {com.texto}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. DESPACHOS & MENSAGENS RECENTES */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Despachos Recentes
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Tempo Real</span>
            </div>

            <div className="divide-y divide-slate-100">
              {MOCK_MENSAGENS_RECENTES.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer"
                  onClick={() => handleDispararAcao(`Despacho aberto: ${msg.nome}`)}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                    {msg.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {msg.nome}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {msg.horario}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                      {msg.assunto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. PLANTÃO & SUPORTE DISUC */}
          <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />
              <span className="text-xs font-bold text-slate-900">
                Suporte Integrado SEIA / INEMA
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dúvidas quanto a parâmetros de cálculo de DAE ou enquadramento de licenças ambientais:
            </p>
            <div className="text-[11px] font-mono text-slate-700 space-y-0.5 bg-white p-2 rounded-lg border border-slate-200">
              <div>Horário: 08:30 às 17:30 (Segunda a Sexta)</div>
              <div>Central: (71) 3118-4000</div>
              <div>Atendimento: suporte.seia@inema.ba.gov.br</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
