import React, { useState, useMemo } from 'react';
import {
  FileText,
  Clock,
  AlertOctagon,
  CheckCircle2,
  Award,
  Hourglass,
  ArrowUpRight,
  ExternalLink,
  Search,
  Copy,
  Check,
  Eye,
  AlertCircle,
  Filter,
  Building,
  MapPin,
  Calendar,
  UserCheck,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { Toolbar } from '@/components/dashboard/Toolbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { EntradaSaidaChart } from '@/components/dashboard/EntradaSaidaChart';
import { StatusDonutChart } from '@/components/dashboard/StatusDonutChart';
import { UnidadeBarChart } from '@/components/dashboard/UnidadeBarChart';
import { AgingBarChart } from '@/components/dashboard/AgingBarChart';
import { TempoAnaliseChart } from '@/components/dashboard/TempoAnaliseChart';
import { VencidosBarChart } from '@/components/dashboard/VencidosBarChart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface ProcessoPrioritario {
  numero: string;
  interessado: string;
  tipo: string;
  unidade: string;
  municipio: string;
  cnpj: string;
  dataProtocolo: string;
  analista: string;
  diasRestantes: number;
  urgencia: 'Crítico' | 'Atenção' | 'Normal';
  resumo: string;
}

const prioridadesIniciais: ProcessoPrioritario[] = [
  {
    numero: '2026.000189/INEMA/REG',
    interessado: 'Consórcio Eólico Chapada Diamantina S.A.',
    tipo: 'Licença de Instalação (LI)',
    unidade: 'DILIC',
    municipio: 'Morro do Chapéu / BA',
    cnpj: '18.942.301/0001-92',
    dataProtocolo: '14/01/2026',
    analista: 'Eng. Marcelo Albuquerque (DILIC)',
    diasRestantes: 2,
    urgencia: 'Crítico',
    resumo: 'Complexo com 48 aerogeradores. Aguardando validação final de supressão vegetal autorizada.',
  },
  {
    numero: '2026.000142/INEMA/RE',
    interessado: 'Polo Petroquímico de Camaçari S.A.',
    tipo: 'Emergência Química - Contenção',
    unidade: 'DIRRE / DIFIS',
    municipio: 'Camaçari / BA',
    cnpj: '04.120.485/0001-44',
    dataProtocolo: '28/02/2026',
    analista: 'Bióloga Fernanda Souza (DIFIS)',
    diasRestantes: 1,
    urgencia: 'Crítico',
    resumo: 'Relatório técnico conclusivo sobre neutralização de efluente orgânico em canal de drenagem.',
  },
  {
    numero: '2026.000098/INEMA/OUT',
    interessado: 'Agropecuária Vale do São Francisco Ltda.',
    tipo: 'Outorga Subterrânea de Água',
    unidade: 'DIREC',
    municipio: 'Juazeiro / BA',
    cnpj: '09.832.110/0002-18',
    dataProtocolo: '05/02/2026',
    analista: 'Hidrólogo Ricardo Neves (DIREC)',
    diasRestantes: 5,
    urgencia: 'Atenção',
    resumo: 'Captação tubular profunda para irrigação de fruticultura irrigada (vazão requerida: 120 m³/h).',
  },
  {
    numero: '2026.000045/INEMA/ASL',
    interessado: 'Cooperativa Agrícola de Barreiras',
    tipo: 'ANSLA Silos e Armazéns Graneleiros',
    unidade: 'DIRRE',
    municipio: 'Barreiras / BA',
    cnpj: '12.441.982/0001-70',
    dataProtocolo: '10/02/2026',
    analista: 'Eng. Roberto Antunes (DIRRE)',
    diasRestantes: 8,
    urgencia: 'Normal',
    resumo: 'Regularização e ampliação de capacidade estática de estocagem de soja e milho.',
  },
];

export const DashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Q1-2026');
  const [selectedUnit, setSelectedUnit] = useState('Todas as Unidades');
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'Todos' | 'Crítico' | 'Atenção' | 'Normal'>('Todos');
  const [copiedNumero, setCopiedNumero] = useState<string | null>(null);
  const [activeProcessModal, setActiveProcessModal] = useState<ProcessoPrioritario | null>(null);

  // Filtro reativo de processos
  const processosFiltrados = useMemo(() => {
    return prioridadesIniciais.filter((item) => {
      const matchSearch =
        item.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.interessado.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.municipio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchUrgency = urgencyFilter === 'Todos' || item.urgencia === urgencyFilter;
      return matchSearch && matchUrgency;
    });
  }, [searchQuery, urgencyFilter]);

  // Cópia elegante do número do processo
  const handleCopy = (numero: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(numero);
    setCopiedNumero(numero);
    setTimeout(() => setCopiedNumero(null), 1800);
  };

  // KPIs dinâmicos reativos ao período selecionado
  const kpiMultipliers: Record<string, number> = {
    'Q1-2026': 1,
    '30d': 0.35,
    '7d': 0.09,
    '2026': 1.15,
  };
  const mult = kpiMultipliers[selectedPeriod] || 1;

  const kpis = {
    protocolados: Math.round(1245 * mult).toLocaleString('pt-BR'),
    emAnalise: Math.round(2356 * mult).toLocaleString('pt-BR'),
    pendentes: Math.round(873 * mult).toLocaleString('pt-BR'),
    vencidos: Math.round(198 * mult).toLocaleString('pt-BR'),
    concluidos: Math.round(1987 * mult).toLocaleString('pt-BR'),
    atosEmitidos: Math.round(1604 * mult).toLocaleString('pt-BR'),
  };

  return (
    <div className="space-y-6">
      {/* 1. Barra de Ações Superior & Filtros */}
      <Toolbar
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        selectedUnit={selectedUnit}
        onSelectUnit={setSelectedUnit}
      />

      {/* 2. Banner de Alerta Gerencial com Ação Imediata */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-300/40 backdrop-blur-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Atenção Executiva: 2 processos com prazo fatal nas próximas 48h</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </h2>
            <p className="text-xs text-slate-600">
              Demandas com prioridade de despacho na DIRRE e DIFIS exigem homologação do gestor.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setUrgencyFilter('Crítico');
            const el = document.getElementById('tabela-prioridades');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white hover:bg-amber-50 text-amber-900 border-amber-300 text-xs font-bold shadow-2xs shrink-0 cursor-pointer"
        >
          <span>Filtrar Casos Críticos</span>
          <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-amber-700" />
        </Button>
      </div>

      {/* 3. Grid de 6 KPIs Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Protocolados"
          value={kpis.protocolados}
          trend={{ value: "+12%", isPositive: true }}
          icon={FileText}
          themeColor="emerald"
        />
        <KpiCard
          title="Em Análise"
          value={kpis.emAnalise}
          trend={{ value: "-3%", isPositive: false }}
          icon={Clock}
          themeColor="blue"
        />
        <KpiCard
          title="Pendentes"
          value={kpis.pendentes}
          trend={{ value: "+8%", isPositive: false }}
          icon={Hourglass}
          themeColor="amber"
        />
        <KpiCard
          title="Vencidos"
          value={kpis.vencidos}
          trend={{ value: "+15%", isPositive: false }}
          icon={AlertOctagon}
          themeColor="rose"
        />
        <KpiCard
          title="Concluídos"
          value={kpis.concluidos}
          trend={{ value: "+18%", isPositive: true }}
          icon={CheckCircle2}
          themeColor="emerald"
        />
        <KpiCard
          title="Atos Emitidos"
          value={kpis.atosEmitidos}
          trend={{ value: "+20%", isPositive: true }}
          icon={Award}
          themeColor="teal"
        />
      </div>

      {/* 4. Grid Principal de Gráficos (Linha 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EntradaSaidaChart />
        <StatusDonutChart />
        <UnidadeBarChart />
      </div>

      {/* 5. Grid Secundário de Gráficos (Linha 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AgingBarChart />
        <TempoAnaliseChart />
        <VencidosBarChart />
      </div>

      {/* 6. Tabela de Casos Prioritários com Busca e Filtros Vivos */}
      <Card id="tabela-prioridades" className="overflow-hidden hover:border-slate-300/80 transition-all duration-300">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Processos Prioritários com Limite de Prazo Imediato</span>
              </CardTitle>
              <Badge variant="rose" dot={true}>
                {processosFiltrados.length} em pauta
              </Badge>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Processos com necessidade de despacho ou intervenção técnica urgente
            </CardDescription>
          </div>

          {/* Controles de Busca e Filtro da Tabela */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Input de Busca */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por processo, interessado..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition-all shadow-2xs"
              />
            </div>

            {/* Segmented Filtro por Urgência */}
            <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/60">
              {(['Todos', 'Crítico', 'Atenção', 'Normal'] as const).map((urg) => {
                const isActive = urgencyFilter === urg;
                return (
                  <button
                    key={urg}
                    onClick={() => setUrgencyFilter(urg)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#0F4C3A] shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {urg}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Número do Processo</th>
                  <th className="py-3 px-4">Interessado / Município</th>
                  <th className="py-3 px-4">Tipo do Ato</th>
                  <th className="py-3 px-4">Diretoria</th>
                  <th className="py-3 px-4">Prazo Restante</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      Nenhum processo encontrado para o filtro aplicado.
                    </td>
                  </tr>
                ) : (
                  processosFiltrados.map((item) => (
                    <tr
                      key={item.numero}
                      onClick={() => setActiveProcessModal(item)}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      {/* Número com botão de copiar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.urgencia === 'Crítico'
                                ? 'bg-rose-500 animate-pulse'
                                : item.urgencia === 'Atenção'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {item.numero}
                          </span>
                          <button
                            onClick={(e) => handleCopy(item.numero, e)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                            title="Copiar número do processo"
                          >
                            {copiedNumero === item.numero ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Interessado + Município */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-semibold">{item.interessado}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            {item.municipio}
                          </span>
                        </div>
                      </td>

                      {/* Tipo do Ato */}
                      <td className="py-3 px-4 text-slate-600 font-medium">{item.tipo}</td>

                      {/* Unidade */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {item.unidade}
                        </span>
                      </td>

                      {/* Prazo */}
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            item.urgencia === 'Crítico'
                              ? 'rose'
                              : item.urgencia === 'Atenção'
                              ? 'amber'
                              : 'secondary'
                          }
                          dot={item.urgencia === 'Crítico'}
                        >
                          {item.diasRestantes} {item.diasRestantes === 1 ? 'dia restante' : 'dias restantes'}
                        </Badge>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveProcessModal(item);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F4C3A] hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Visualizar detalhes da pauta"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href="/src/fiscalizacao.html"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Abrir no módulo SEIA"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 7. Modal de Detalhes Rápidos do Processo */}
      <Dialog
        open={activeProcessModal !== null}
        onOpenChange={(open) => {
          if (!open) setActiveProcessModal(null);
        }}
      >
        {activeProcessModal && (
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={
                    activeProcessModal.urgencia === 'Crítico'
                      ? 'rose'
                      : activeProcessModal.urgencia === 'Atenção'
                      ? 'amber'
                      : 'secondary'
                  }
                  dot={true}
                >
                  Urgência: {activeProcessModal.urgencia}
                </Badge>
                <span className="text-[11px] font-mono text-slate-400">
                  Protocolo: {activeProcessModal.dataProtocolo}
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-slate-900">
                {activeProcessModal.numero}
              </DialogTitle>
              <DialogDescription>
                {activeProcessModal.tipo} – {activeProcessModal.unidade}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Card de Dados Cadastrais */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Interessado:</span>
                  <strong className="text-slate-900">{activeProcessModal.interessado}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">CNPJ / CPF:</span>
                  <span className="font-mono text-slate-700">{activeProcessModal.cnpj}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Município / Localização:</span>
                  <span className="text-slate-700">{activeProcessModal.municipio}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Técnico Responsável:</span>
                  <span className="text-emerald-800 font-semibold">{activeProcessModal.analista}</span>
                </div>
              </div>

              {/* Resumo do Objeto */}
              <div>
                <span className="font-bold text-slate-700 block mb-1">Resumo do Parecer Técnico:</span>
                <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                  {activeProcessModal.resumo}
                </p>
              </div>

              {/* Alerta de Prazo Fatal */}
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/70 text-rose-800 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="text-[11px] leading-tight font-medium">
                  Este processo atinge o prazo legal máximo de permanência em{' '}
                  <strong>{activeProcessModal.diasRestantes} dia(s)</strong>.
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveProcessModal(null)}
                className="cursor-pointer"
              >
                Fechar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  alert(`Despacho iniciado com sucesso para o processo ${activeProcessModal.numero}!`);
                  setActiveProcessModal(null);
                }}
                className="bg-[#0F4C3A] hover:bg-[#145A45] text-white cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5 mr-1.5" />
                <span>Emitir Despacho</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

