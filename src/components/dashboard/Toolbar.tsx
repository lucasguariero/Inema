import React from 'react';
import { Filter, Download, ChevronDown, FileText, Table, Check, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
  selectedUnit: string;
  onSelectUnit: (unit: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedPeriod,
  onSelectPeriod,
  selectedUnit,
  onSelectUnit,
  onOpenFilters,
  activeFilterCount,
}) => {
  const { themeConfig, isDarkMode } = useTheme();

  const quickPeriods = [
    { label: '30d', value: '30d' },
    { label: '7d', value: '7d' },
    { label: 'Trimestre', value: 'Q1-2026' },
    { label: '2026', value: '2026' },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
      {/* Esquerda: Título da tela e subtítulo */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Regulação – Dashboard Gerencial
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Acompanhamento em tempo real do desempenho e gargalos dos processos de regulação.
        </p>
      </div>

      {/* Direita: Controles e Ações */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Seletor Segmentado de Período Rápido: BRANCO no ativo em todos os temas (verde, azul e branco) */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
          {quickPeriods.map((p) => {
            const isActive = selectedPeriod === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onSelectPeriod(p.value)}
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer select-none',
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Botão de Filtros com Badge (Abre Drawer à Direita) */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFilters}
          className={cn(
            "h-8 gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs cursor-pointer transition-all",
            activeFilterCount > 0 && "border-emerald-500 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300"
          )}
        >
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filtros</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] bg-[#0F4C3A] text-white rounded-full font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Botão de Exportar Relatório */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-1.5 z-50">
            <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-2 py-1">
              Formatos de Exportação
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
            <DropdownMenuItem
              onClick={() => alert('Exportando Relatório em PDF...')}
              className="gap-2 text-xs py-2 cursor-pointer dark:text-slate-300 dark:hover:text-white dark:focus:bg-slate-800 rounded-lg"
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>Relatório PDF (.pdf)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert('Exportando Planilha em Excel...')}
              className="gap-2 text-xs py-2 cursor-pointer dark:text-slate-300 dark:hover:text-white dark:focus:bg-slate-800 rounded-lg"
            >
              <Table className="w-3.5 h-3.5 text-emerald-600" />
              <span>Planilha Excel (.xlsx)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botão Primário: Novo Requerimento */}
        <Button
          variant="default"
          size="sm"
          onClick={() => alert('Abrindo formulário de Novo Requerimento...')}
          className={cn(
            "h-8 gap-1.5 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-all",
            themeConfig.tokens.brandPrimary,
            themeConfig.tokens.brandPrimaryHover
          )}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Requerimento</span>
        </Button>
      </div>
    </div>
  );
};
