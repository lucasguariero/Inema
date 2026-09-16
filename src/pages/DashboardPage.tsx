import React, { useState, useMemo } from 'react';
import {
  FileText,
  Clock,
  Hourglass,
  AlertTriangle,
  CheckCircle2,
  Award,
  ChevronRight,
  ExternalLink,
  X,
  Copy,
  Check,
  Building,
  Calendar,
  User,
  AlertCircle,
} from 'lucide-react';
import { Toolbar } from '@/components/dashboard/Toolbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { EntradaSaidaChart } from '@/components/dashboard/EntradaSaidaChart';
import { StatusDonutChart } from '@/components/dashboard/StatusDistributionList';
import { UnidadeBarChart } from '@/components/dashboard/UnidadeBarChart';
import { AgingBarChart } from '@/components/dashboard/AgingBarChart';
import { TempoAnaliseChart } from '@/components/dashboard/TempoAnaliseChart';
import { VencidosBarChart } from '@/components/dashboard/VencidosBarChart';
import { FilterDrawer, FilterState } from '@/components/dashboard/FilterDrawer';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface ProcessoVencido {
  processo: string;
  tipo: string;
  unidade: string;
  etapa: string;
  responsavel: string;
  dias: number;
}

const unitDescriptions: Record<string, string> = {
  DIRRE: 'Diretoria de Recursos Hídricos e Saneamento',
  DIREC: 'Diretoria de Regulação e Controle',
  DIBA: 'Diretoria de Biodiversidade e Áreas Protegidas',
  DIBIO: 'Diretoria de Biodiversidade',
  DILIC: 'Diretoria de Licenciamento Ambiental',
  DISUC: 'Diretoria de Sustentabilidade e Unidades de Conservação',
};

const processosVencidosIniciais: ProcessoVencido[] = [
  {
    processo: 'SEIA-REG-2024/001234',
    tipo: 'Licenciamento Ambiental',
    unidade: 'DIRRE',
    etapa: 'Análise Técnica',
    responsavel: 'João Silva',
    dias: 32,
  },
  {
    processo: 'SEIA-REG-2024/001198',
    tipo: 'Autorização Ambiental',
    unidade: 'DIBIO',
    etapa: 'Análise Técnica',
    responsavel: 'Maria Santos',
    dias: 28,
  },
  {
    processo: 'SEIA-REG-2024/001145',
    tipo: 'Licenciamento Ambiental',
    unidade: 'DILIC',
    etapa: 'Coordenação',
    responsavel: 'Carlos Lima',
    dias: 25,
  },
  {
    processo: 'SEIA-REG-2024/001089',
    tipo: 'Outorga',
    unidade: 'DIRRE',
    etapa: 'Análise Técnica',
    responsavel: 'João Silva',
    dias: 22,
  },
  {
    processo: 'SEIA-REG-2024/001077',
    tipo: 'Autorização Ambiental',
    unidade: 'DIREC',
    etapa: 'Diretoria',
    responsavel: 'Ana Paula',
    dias: 19,
  },
];

export const DashboardPage: React.FC = () => {
  const { themeConfig, isDarkMode } = useTheme();

  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedUnit, setSelectedUnit] = useState('Todas as Unidades');
  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeModalProcess, setActiveModalProcess] = useState<ProcessoVencido | null>(null);
  const [copiedNumero, setCopiedNumero] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    unidades: [],
    tipos: [],
    status: [],
    prazo: 'todos',
    etapa: '',
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.unidades.length;
    count += filters.tipos.length;
    count += filters.status.length;
    if (filters.prazo !== 'todos') count += 1;
    if (filters.etapa) count += 1;
    if (activeKpiFilter) count += 1;
    return count;
  }, [filters, activeKpiFilter]);

  const clearAllFilters = () => {
    setFilters({
      unidades: [],
      tipos: [],
      status: [],
      prazo: 'todos',
      etapa: '',
    });
    setActiveKpiFilter(null);
  };

  const handleToggleKpi = (kpiKey: string) => {
    if (activeKpiFilter === kpiKey) {
      setActiveKpiFilter(null);
    } else {
      setActiveKpiFilter(kpiKey);
    }
  };

  const handleCopy = (num: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(num);
    setCopiedNumero(num);
    setTimeout(() => setCopiedNumero(null), 1800);
  };

  // Filtragem da tabela
  const processosFiltrados = useMemo(() => {
    return processosVencidosIniciais.filter((proc) => {
      if (filters.unidades.length > 0 && !filters.unidades.includes(proc.unidade)) {
        return false;
      }
      if (filters.tipos.length > 0 && !filters.tipos.some((t) => proc.tipo.includes(t))) {
        return false;
      }
      if (filters.etapa && proc.etapa !== filters.etapa) {
        return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="w-full space-y-6">
      {/* 1. Barra de Ações Superior */}
      <Toolbar
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        selectedUnit={selectedUnit}
        onSelectUnit={setSelectedUnit}
        onOpenFilters={() => setIsFilterDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Banner de Filtros Ativos */}
      {activeFilterCount > 0 && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-xs text-emerald-950 dark:text-emerald-200 flex-wrap gap-2 animate-in fade-in">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold flex items-center gap-1 text-[#0F4C3A] dark:text-emerald-400">
              Filtros ativos:
            </span>
            {activeKpiFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs">
                Métrica: {activeKpiFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveKpiFilter(null)} />
              </span>
            )}
            {filters.unidades.map((u) => (
              <span key={u} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs">
                Unidade: {u}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilters({ ...filters, unidades: filters.unidades.filter((x) => x !== u) })}
                />
              </span>
            ))}
            {filters.tipos.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs">
                Tipo: {t}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilters({ ...filters, tipos: filters.tipos.filter((x) => x !== t) })}
                />
              </span>
            ))}
            {filters.status.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs">
                Status: {s}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilters({ ...filters, status: filters.status.filter((x) => x !== s) })}
                />
              </span>
            ))}
            {filters.prazo !== 'todos' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs">
                Prazo: {filters.prazo}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilters({ ...filters, prazo: 'todos' })}
                />
              </span>
            )}
            {filters.etapa && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs">
                Etapa: {filters.etapa}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilters({ ...filters, etapa: '' })}
                />
              </span>
            )}
          </div>
          <button
            onClick={clearAllFilters}
            className="font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 ml-auto cursor-pointer"
          >
            Limpar todos <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Grid de 6 KPIs Oficiais com Cores de Requisito */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Protocolados"
          value="1.245"
          trend={{ value: '+12%', isPositive: true }}
          icon={FileText}
          variant="emerald"
          sparklineData={[10, 14, 12, 19, 17, 24, 28]}
          isSelected={activeKpiFilter === 'Protocolados'}
          onClick={() => handleToggleKpi('Protocolados')}
        />
        <KpiCard
          title="Em Análise"
          value="2.356"
          trend={{ value: '-3%', isPositive: false }}
          icon={Clock}
          variant="slate"
          sparklineData={[25, 22, 24, 18, 20, 16, 15]}
          isSelected={activeKpiFilter === 'Em Análise'}
          onClick={() => handleToggleKpi('Em Análise')}
        />
        <KpiCard
          title="Pendentes"
          value="873"
          trend={{ value: '+8%', isPositive: false }}
          icon={Hourglass}
          variant="amber"
          sparklineData={[8, 10, 9, 13, 11, 15, 16]}
          isSelected={activeKpiFilter === 'Pendentes'}
          onClick={() => handleToggleKpi('Pendentes')}
        />
        <KpiCard
          title="Vencidos"
          value="198"
          trend={{ value: '+15%', isPositive: false }}
          icon={AlertTriangle}
          variant="rose"
          sparklineData={[5, 8, 7, 10, 9, 12, 14]}
          isSelected={activeKpiFilter === 'Vencidos'}
          onClick={() => handleToggleKpi('Vencidos')}
        />
        <KpiCard
          title="Concluídos"
          value="1.987"
          trend={{ value: '+18%', isPositive: true }}
          icon={CheckCircle2}
          variant="emerald"
          sparklineData={[12, 15, 18, 20, 22, 26, 30]}
          isSelected={activeKpiFilter === 'Concluídos'}
          onClick={() => handleToggleKpi('Concluídos')}
        />
        <KpiCard
          title="Atos Emitidos"
          value="1.604"
          trend={{ value: '+20%', isPositive: true }}
          icon={Award}
          variant="emerald"
          sparklineData={[10, 12, 16, 19, 21, 25, 29]}
          isSelected={activeKpiFilter === 'Atos Emitidos'}
          onClick={() => handleToggleKpi('Atos Emitidos')}
        />
      </div>

      {/* 3. Linha 1 de Gráficos (3 Colunas) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EntradaSaidaChart />
        <StatusDonutChart />
        <UnidadeBarChart />
      </div>

      {/* 4. Linha 2 de Gráficos (3 Colunas) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AgingBarChart />
        <TempoAnaliseChart />
        <VencidosBarChart />
      </div>

      {/* 5. Tabela Oficial: Processos Vencidos (Top 5) */}
      <Card className="w-full overflow-hidden shadow-2xs border border-slate-200 dark:border-slate-800 dark:bg-slate-900 transition-all">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Processos Vencidos (Top 5)
              </CardTitle>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                (Exibindo {processosFiltrados.length} de 198)
              </span>
            </div>
          </div>
          <button
            onClick={() => alert('Abrindo listagem completa de todos os 198 processos vencidos...')}
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Ver todos os 198 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Processo</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Unidade</th>
                <th className="p-4">Etapa</th>
                <th className="p-4">Responsável</th>
                <th className="p-4">Vencido há</th>
                <th className="p-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {processosFiltrados.map((proc) => (
                <tr
                  key={proc.processo}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalProcess(proc)}
                        className="font-semibold text-slate-900 dark:text-slate-100 hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{proc.processo}</span>
                      </button>
                      <button
                        onClick={(e) => handleCopy(proc.processo, e)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded transition-colors"
                        title="Copiar número"
                      >
                        {copiedNumero === proc.processo ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    {proc.tipo}
                  </td>
                  <td className="p-4">
                    <span
                      className="cursor-help font-semibold text-slate-700 dark:text-slate-200 underline decoration-dotted decoration-slate-300 dark:decoration-slate-600"
                      title={unitDescriptions[proc.unidade] || proc.unidade}
                    >
                      {proc.unidade}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {proc.etapa}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {proc.responsavel}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      {proc.dias} dias
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setActiveModalProcess(proc)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300 transition-all shadow-2xs cursor-pointer"
                    >
                      Detalhes
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drawer de Filtros Avançados (Lateral Direita) */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={() => {}}
        onClear={clearAllFilters}
      />

      {/* Modal de Detalhes do Processo Vencido */}
      {activeModalProcess && (
        <Dialog open={!!activeModalProcess} onOpenChange={() => setActiveModalProcess(null)}>
          <DialogContent className="max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl">
            <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#0F4C3A] dark:text-emerald-300 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <DialogTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {activeModalProcess.processo}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Detalhes do processo regulatório em atraso
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                    Tipo do Requerimento
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {activeModalProcess.tipo}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                    Diretoria Responsável
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {activeModalProcess.unidade}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                    Etapa Atual (Gargalo)
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {activeModalProcess.etapa}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                    Técnico / Analista
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {activeModalProcess.responsavel}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span className="font-semibold text-rose-900 dark:text-rose-200 text-xs">
                    Vencimento ultrapassado em
                  </span>
                </div>
                <span className="font-bold text-rose-700 dark:text-rose-300 text-sm tabular-nums">
                  {activeModalProcess.dias} dias
                </span>
              </div>
            </div>

            <DialogFooter className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModalProcess(null)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Fechar
              </Button>
              <Button
                size="sm"
                onClick={() => alert('Redirecionando para o SEIA...')}
                className={cn(
                  "text-xs font-semibold text-white shadow-2xs gap-1 cursor-pointer",
                  themeConfig.tokens.brandPrimary,
                  themeConfig.tokens.brandPrimaryHover
                )}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir no SEIA</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
