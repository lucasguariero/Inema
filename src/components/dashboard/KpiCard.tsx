import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
    period?: string;
  };
  icon?: LucideIcon;
  sparklineData?: number[];
  themeColor?: string;
  isSolid?: boolean;
  variant?: 'default' | 'emerald' | 'amber' | 'rose' | 'slate';
  isSelected?: boolean;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  sparklineData = [10, 15, 12, 18, 16, 22, 25],
  isSolid = false,
  variant,
  isSelected = false,
  onClick,
}) => {
  const { theme, isDarkMode } = useTheme();
  const isPositive = trend?.isPositive ?? true;

  // Determine explicit status type
  const isPendente = variant === 'amber' || title.toLowerCase().includes('pendente');
  const isVencido = variant === 'rose' || title.toLowerCase().includes('vencido');
  const isEmAnalise = variant === 'slate' || title.toLowerCase().includes('análise');

  // Sparkline SVG normalization
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 52;
      const y = 16 - ((val - min) / (max - min || 1)) * 12;
      return `${x},${y}`;
    })
    .join(' ');

  // Color logic according to exact user instruction:
  // "cor pra vencido = vermelho mesmo"
  // "cor pra pendente = laranja mesmo"
  let sparklineStroke = '#10B981';
  if (isVencido) {
    sparklineStroke = '#E11D48'; // Vermelho
  } else if (isPendente) {
    sparklineStroke = '#F59E0B'; // Laranja
  } else if (isEmAnalise) {
    sparklineStroke = '#64748B';
  } else if (isPositive) {
    sparklineStroke = '#10B981';
  } else {
    sparklineStroke = '#E11D48';
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'fi-wi-stats-overview-stat p-5 bg-white dark:bg-slate-900 rounded-xl flex flex-col justify-between transition-all duration-150 cursor-pointer select-none shadow-xs ring-1',
        isSelected
          ? 'ring-2 ring-blue-600 dark:ring-blue-500 shadow-sm'
          : 'ring-slate-950/5 dark:ring-white/10 hover:ring-slate-300 dark:hover:ring-slate-700'
      )}
    >
      {/* Linha 1: Label em caixa alta suave com ícone sutil à direita */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase truncate">
          {title}
        </span>
        {Icon && (
          <div
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
              isVencido
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                : isPendente
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                : isEmAnalise
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Linha 2: Valor principal com números tabulares grandes */}
      <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums mt-2">
        {value}
      </div>

      {/* Linha 3: Micro-sparkline ou variação percentual com cores estritas */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        {trend && (
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded text-[11px] tabular-nums shrink-0 border',
                isVencido
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60'
                  : isPendente
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                  : isEmAnalise
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 shrink-0" />
              ) : (
                <TrendingDown className="w-3 h-3 shrink-0" />
              )}
              {trend.value}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {trend.period || 'vs. mês ant.'}
            </span>
          </div>
        )}

        <div className="w-13 h-4 opacity-75 shrink-0">
          <svg viewBox="0 0 52 16" className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={sparklineStroke}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
