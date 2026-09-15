import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Download,
  ChevronDown,
  FileText,
  Table,
  RefreshCw,
  Sparkles,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ToolbarProps {
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
  selectedUnit: string;
  onSelectUnit: (unit: string) => void;
  onRefresh?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedPeriod,
  onSelectPeriod,
  selectedUnit,
  onSelectUnit,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const quickPeriods = [
    { label: '1º Trimestre', value: 'Q1-2026' },
    { label: '30 dias', value: '30d' },
    { label: '7 dias', value: '7d' },
    { label: 'Ano 2026', value: '2026' },
  ];

  const units = [
    { name: 'Todas as Unidades', count: '8.455' },
    { name: 'DIRRE - Regulação', count: '3.420' },
    { name: 'DIREC - Recursos Hídricos', count: '1.980' },
    { name: 'DIBA - Biodiversidade', count: '1.450' },
    { name: 'DILIC - Licenciamento', count: '1.090' },
    { name: 'DISUC - Sustentabilidade', count: '515' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex flex-col gap-4 pb-1">
      {/* Linha Superior: Título Executivo + Badges de Status Operacional */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Regulação – Painel Executivo
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F4C3A] border border-emerald-200/80 text-[11px] font-bold tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync SEIA
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
              Atualizado há 2 min
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visão unificada dos indicadores operacionais, prazos regulatórios e pontos de estrangulamento.
          </p>
        </div>

        {/* Botões de Ação Rápida */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          {/* Botão de Atualização Manual */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-9 px-3 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs gap-1.5"
            title="Atualizar dados do painel"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-[#0F4C3A]' : ''}`} />
            <span className="hidden sm:inline text-xs font-semibold">Atualizar</span>
          </Button>

          {/* Exportação Executiva */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="h-9 px-3.5 gap-2 bg-[#0F4C3A] hover:bg-[#145A45] text-white shadow-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-xs">Exportar</span>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-dropdown">
              <DropdownMenuLabel className="text-xs font-bold text-slate-800">
                Relatórios e Dados
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => alert('Gerando Relatório Executivo Oficial em PDF com selo do INEMA...')}
                className="gap-2.5 py-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Relatório Executivo (.PDF)</p>
                  <p className="text-[10px] text-slate-400">Consolidado com gráficos e parecer</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => alert('Exportando Planilha Gerencial em Excel com 8.455 registros...')}
                className="gap-2.5 py-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#0F4C3A]">
                  <Table className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Planilha Completa (.XLSX)</p>
                  <p className="text-[10px] text-slate-400">Dados brutos e detalhados de pauta</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Linha Inferior: Controles Segmentados e Filtros de Unidade */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-white/80 border border-slate-200/80 backdrop-blur-xs shadow-2xs">
        {/* Segmented Control de Período */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/50">
          {quickPeriods.map((period) => {
            const isActive = selectedPeriod === period.value;
            return (
              <button
                key={period.value}
                onClick={() => onSelectPeriod(period.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0F4C3A] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {period.label}
              </button>
            );
          })}
        </div>

        {/* Filtro de Diretoria e Unidade Técnica */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 bg-white border-slate-200/90 text-slate-700 text-xs font-semibold hover:border-emerald-300 transition-colors"
              >
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedUnit}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 glass-dropdown">
              <DropdownMenuLabel className="text-xs font-bold text-slate-800">
                Filtrar por Diretoria
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {units.map((unit) => {
                const isSelected = selectedUnit === unit.name;
                return (
                  <DropdownMenuItem
                    key={unit.name}
                    onClick={() => onSelectUnit(unit.name)}
                    className={`flex items-center justify-between py-2 cursor-pointer ${
                      isSelected ? 'bg-[#E2ECE9] text-[#0F4C3A] font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0F4C3A] shrink-0" />}
                      <span className="truncate">{unit.name}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                      {unit.count}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

