import React from 'react';
import { X, Filter, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { FilamentSelect } from '@/components/filament';

export interface FilterState {
  unidades: string[];
  tipos: string[];
  status: string[];
  prazo: 'todos' | 'vencidos' | 'alerta';
  etapa: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (newFilters: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

const availableUnits = [
  { id: 'DIRRE', label: 'DIRRE (Recursos Hídricos)' },
  { id: 'DIREC', label: 'DIREC (Regulação)' },
  { id: 'DIBA', label: 'DIBA (Biodiversidade)' },
  { id: 'DIBIO', label: 'DIBIO (Biodiversidade)' },
  { id: 'DILIC', label: 'DILIC (Licenciamento)' },
  { id: 'DISUC', label: 'DISUC (Sustentabilidade)' },
];

const availableTypes = [
  'Licenciamento Ambiental',
  'Autorização Ambiental',
  'Outorga de Uso de Água',
];

const availableStatus = [
  'Em Análise',
  'Pendentes',
  'Aguard. Pagamento',
  'Condicionantes',
  'Concluídos',
];

const availableEtapas = [
  { id: '', label: 'Todas as Etapas' },
  { id: 'Triagem', label: 'Triagem' },
  { id: 'Análise Técnica', label: 'Análise Técnica (Gargalo)' },
  { id: 'Coordenação', label: 'Coordenação' },
  { id: 'Diretoria', label: 'Diretoria' },
  { id: 'Publicação', label: 'Publicação' },
];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
}) => {
  const { themeConfig, isDarkMode } = useTheme();

  const toggleUnit = (unitId: string) => {
    const updated = filters.unidades.includes(unitId)
      ? filters.unidades.filter((u) => u !== unitId)
      : [...filters.unidades, unitId];
    onFiltersChange({ ...filters, unidades: updated });
  };

  const toggleType = (tipo: string) => {
    const updated = filters.tipos.includes(tipo)
      ? filters.tipos.filter((t) => t !== tipo)
      : [...filters.tipos, tipo];
    onFiltersChange({ ...filters, tipos: updated });
  };

  const toggleStatus = (st: string) => {
    const updated = filters.status.includes(st)
      ? filters.status.filter((s) => s !== st)
      : [...filters.status, st];
    onFiltersChange({ ...filters, status: updated });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Slide-over Drawer à Direita */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F4C3A] dark:text-emerald-300 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60 shadow-2xs">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Filtros Avançados
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Refine as métricas e processos do painel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Unidades Organizacionais */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Unidade / Diretoria
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableUnits.map((unit) => {
                const isChecked = filters.unidades.includes(unit.id);
                return (
                  <label
                    key={unit.id}
                    onClick={() => toggleUnit(unit.id)}
                    className={cn(
                      'flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none',
                      isChecked
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-semibold shadow-2xs'
                        : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-emerald-700 focus:ring-emerald-600 w-3.5 h-3.5"
                    />
                    <span className="truncate">{unit.id}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Tipo de Processo */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Tipo de Processo
            </label>
            <div className="space-y-2">
              {availableTypes.map((tipo) => {
                const isChecked = filters.tipos.includes(tipo);
                return (
                  <label
                    key={tipo}
                    onClick={() => toggleType(tipo)}
                    className={cn(
                      'flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none',
                      isChecked
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-semibold shadow-2xs'
                        : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-emerald-700 focus:ring-emerald-600 w-3.5 h-3.5"
                    />
                    <span>{tipo}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Status de Tramitação (Pills) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {availableStatus.map((st) => {
                const isSelected = filters.status.includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleStatus(st)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
                      isSelected
                        ? st === 'Pendentes'
                          ? 'bg-amber-500 text-white border-amber-600 font-semibold shadow-2xs'
                          : 'bg-[#0F4C3A] text-white border-[#0F4C3A] font-semibold shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Situação de Prazo */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Situação de Prazo
            </label>
            <div className="space-y-2">
              <label
                onClick={() => onFiltersChange({ ...filters, prazo: 'todos' })}
                className={cn(
                  'flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none',
                  filters.prazo === 'todos'
                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                )}
              >
                <input
                  type="radio"
                  name="prazo"
                  checked={filters.prazo === 'todos'}
                  onChange={() => {}}
                  className="text-emerald-700 focus:ring-emerald-600 w-3.5 h-3.5"
                />
                <span>Todos os Processos</span>
              </label>

              <label
                onClick={() => onFiltersChange({ ...filters, prazo: 'vencidos' })}
                className={cn(
                  'flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none',
                  filters.prazo === 'vencidos'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-semibold shadow-2xs'
                    : 'border-rose-200 dark:border-rose-900/40 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 text-rose-700 dark:text-rose-400'
                )}
              >
                <input
                  type="radio"
                  name="prazo"
                  checked={filters.prazo === 'vencidos'}
                  onChange={() => {}}
                  className="text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                />
                <span>Somente Processos Vencidos (&gt; 0 dias)</span>
              </label>

              <label
                onClick={() => onFiltersChange({ ...filters, prazo: 'alerta' })}
                className={cn(
                  'flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none',
                  filters.prazo === 'alerta'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold shadow-2xs'
                    : 'border-amber-200 dark:border-amber-900/40 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 text-amber-700 dark:text-amber-400'
                )}
              >
                <input
                  type="radio"
                  name="prazo"
                  checked={filters.prazo === 'alerta'}
                  onChange={() => {}}
                  className="text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                />
                <span>Próximos ao Vencimento (&lt; 15 dias)</span>
              </label>
            </div>
          </div>

          {/* 5. Etapa Atual */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Etapa Atual
            </label>
            <FilamentSelect
              value={filters.etapa}
              onChange={(val) => onFiltersChange({ ...filters, etapa: val })}
              options={availableEtapas.map((et) => ({ value: et.id, label: et.label }))}
            />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center gap-3">
          <button
            onClick={onClear}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Limpar
          </button>
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className={cn(
              'flex-1 px-4 py-2.5 text-xs font-semibold text-white rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer',
              themeConfig.tokens.brandPrimary,
              themeConfig.tokens.brandPrimaryHover
            )}
          >
            <Check className="w-4 h-4" />
            <span>Aplicar Filtros</span>
          </button>
        </div>
      </div>
    </>
  );
};
