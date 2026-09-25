import React, { useState } from 'react';
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export const SeiaV2DashboardPage: React.FC = () => {
  const [period, setPeriod] = useState<'2026' | '30d' | '7d'>('2026');

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Início</span>
            <span>/</span>
            <span>Área de Trabalho</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Painel Gerencial</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Painel Geral & Métricas do Analista
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoramento de processos atribuídos, cumprimento de prazos regulatórios e metas da DIRRE/COASP.
          </p>
        </div>

        {/* Controles de Período e Filtros (Dense UI) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold text-slate-600 shadow-2xs">
            {(['2026', '30d', '7d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-md transition-all duration-200 ease-in-out cursor-pointer ${
                  period === p
                    ? 'bg-[#0F4C3A] text-white shadow-2xs font-bold'
                    : 'hover:bg-slate-100 hover:text-[#0F4C3A] text-slate-600 font-medium'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button className="h-9 px-3 text-xs font-medium bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 hover:text-[#0F4C3A] hover:bg-slate-50 transition-all duration-200 ease-in-out flex items-center gap-1.5 shadow-2xs cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0F4C3A]" />
            <span>Filtrar Unidade</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. STATS OVERVIEW WIDGET (PADRÃO FILAMENT PHP 5.X)        */}
      {/* ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0F4C3A]" />
            Visão Geral da Carteira Ativa
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Atualizado hoje às 16:30</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Card 1 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-500">Carteira Ativa</span>
              <div className="p-1 rounded bg-slate-100 text-slate-600">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-slate-900 font-mono">128</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-0.5">
                <ArrowUpRight className="w-3 h-3" />
                <span>+4% vs mês ant.</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">Processos atribuídos</div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-500">Em Análise Técnica</span>
              <div className="p-1 rounded bg-emerald-50 text-[#0F4C3A]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-[#0F4C3A] font-mono">42</div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                <span>Média: 18 dias</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">Triagem / Vistoria de campo</div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-500">Pendências Externas</span>
              <div className="p-1 rounded bg-amber-50 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-amber-700 font-mono">31</div>
              <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium mt-0.5">
                <span>Aguardando requerente</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">Notificações enviadas</div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-500">Prazos Críticos</span>
              <div className="p-1 rounded bg-rose-50 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-rose-600 font-mono">9</div>
              <div className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold mt-0.5">
                <span>Vencendo em até 10d</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">Exige despacho imediato</div>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-500">Atos Concluídos</span>
              <div className="p-1 rounded bg-emerald-50 text-[#0F4C3A]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-slate-900 font-mono">214</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-0.5">
                <span>89% taxa resolutividade</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">Ano corrente 2026</div>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-500">Arrecadação DAE</span>
              <div className="p-1 rounded bg-slate-100 text-slate-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-lg font-bold text-slate-900 font-mono truncate">R$ 4,28M</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-0.5">
                <span>+12% meta SEFAZ</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">Taxas e outorgas quitadas</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. GRÁFICOS INTEGRADOS DE MACRO-LAYOUT                    */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico 1: Tramitação Mensal */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Fluxo Mensal de Tramitação de Processos
              </h3>
              <p className="text-xs text-slate-500">
                Comparativo entre novos requerimentos protocolados e atos regulatórios emitidos.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C3A]" />
                <span className="text-slate-600 font-medium">Entradas (Requerimentos)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-600 font-medium">Saídas (Deferidos)</span>
              </div>
            </div>
          </div>

          {/* Gráfico Visual */}
          <div className="pt-6 pb-2">
            <div className="h-64 flex items-end justify-between gap-3 px-2">
              {[
                { mes: 'Jan', ent: 120, sai: 105 },
                { mes: 'Fev', ent: 145, sai: 130 },
                { mes: 'Mar', ent: 190, sai: 175 },
                { mes: 'Abr', ent: 160, sai: 155 },
                { mes: 'Mai', ent: 210, sai: 198 },
                { mes: 'Jun', ent: 230, sai: 215 },
                { mes: 'Jul', ent: 185, sai: 190 },
                { mes: 'Ago', ent: 240, sai: 228 },
                { mes: 'Set', ent: 205, sai: 210 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-48">
                    <div
                      style={{ height: `${(item.ent / 260) * 100}%` }}
                      className="w-full max-w-[20px] bg-[#0F4C3A] rounded-t-sm group-hover:brightness-110 transition-all relative"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1 py-0.5 rounded font-mono transition-opacity">
                        {item.ent}
                      </span>
                    </div>
                    <div
                      style={{ height: `${(item.sai / 260) * 100}%` }}
                      className="w-full max-w-[20px] bg-emerald-400 rounded-t-sm group-hover:brightness-110 transition-all relative"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1 py-0.5 rounded font-mono transition-opacity">
                        {item.sai}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {item.mes}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico 2: Carga de Trabalho por Coordenação */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Distribuição por Diretoria
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Carga concentrada na carteira do INEMA.
            </p>

            <div className="space-y-3.5 mt-5">
              {[
                { nome: 'DIRRE • Regulação e Outorga', qtd: 420, pct: 45, cor: 'bg-[#0F4C3A]' },
                { nome: 'DIFIS • Fiscalização e Autos', qtd: 260, pct: 28, cor: 'bg-emerald-600' },
                { nome: 'DISUC • Unidades de Conservação', qtd: 140, pct: 15, cor: 'bg-emerald-400' },
                { nome: 'DIPRE • Recursos Hídricos', qtd: 110, pct: 12, cor: 'bg-slate-400' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate">{item.nome}</span>
                    <span className="font-mono font-bold text-slate-900">{item.qtd} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.cor} rounded-full`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mt-4 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Tempo Médio Global: <strong>26,4 dias</strong></span>
            <span className="text-emerald-700 font-semibold font-mono">-14% em 2026</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. PAUTA OPERACIONAL: AÇÕES PRIORITÁRIAS DE HOJE          */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Pauta de Urgências e Prazos do Analista
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">5 processos críticos</span>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            {
              sei: '020.12948.2026/0014',
              requerente: 'Agropecuária Vale Verde S.A.',
              municipio: 'Barreiras',
              ato: 'Licença de Instalação (LI) + Outorga',
              sla: 'Expira em 3 dias',
              slaColor: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
              status: 'Minuta Pronta',
            },
            {
              sei: '020.11409.2026/0009',
              requerente: 'Complexo Eólico Ventos da Bahia',
              municipio: 'Gentio do Ouro',
              ato: 'Supressão Vegetal (ASV)',
              sla: 'Expira em 5 dias',
              slaColor: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
              status: 'Vistoria Concluída',
            },
            {
              sei: '020.08920.2026/0032',
              requerente: 'Mineração Diamantina Ltda.',
              municipio: 'Lençóis',
              ato: 'Renovação de LO',
              sla: 'Expira em 7 dias',
              slaColor: 'bg-amber-50 text-amber-700 border-amber-200',
              status: 'Parecer Técnico',
            },
            {
              sei: '020.13840.2026/0041',
              requerente: 'Consórcio Rodoviário do Oeste',
              municipio: 'Luís Eduardo Magalhães',
              ato: 'Outorga Subterrânea',
              sla: 'Expira em 9 dias',
              slaColor: 'bg-slate-100 text-slate-700 border-slate-200',
              status: 'Análise Hidrológica',
            },
          ].map((proc, idx) => (
            <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/90 transition-all duration-200 ease-in-out">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {proc.sei}
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {proc.requerente} <span className="font-normal text-slate-500">• {proc.municipio}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {proc.ato}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${proc.slaColor}`}>
                  {proc.sla}
                </span>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {proc.status}
                </span>
                <button className="h-8 px-3.5 text-xs font-semibold bg-[#0F4C3A] hover:bg-[#0b382b] text-white rounded-lg transition-all duration-200 ease-in-out flex items-center gap-1.5 shadow-2xs cursor-pointer">
                  <span>Analisar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
