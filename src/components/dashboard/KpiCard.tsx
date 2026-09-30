import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export interface KpiCardProps {
  title: string;
  value: string | number;
  trend?:
    | {
        value: string;
        isPositive: boolean;
        period?: string;
      }
    | string;
  trendType?: 'up' | 'down' | 'neutral';
  chartData?: number[];
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
  trendType = 'up',
  chartData,
  icon: Icon,
  sparklineData,
  isSolid = false,
  variant,
  isSelected = false,
  onClick,
}) => {
  const { theme, isDarkMode } = useTheme();
  const rawSparkline = sparklineData || chartData || [10, 15, 12, 18, 16, 22, 25];
  const isPositive = typeof trend === 'object' && trend !== null ? trend.isPositive : trendType !== 'down';
  const trendText = typeof trend === 'object' && trend !== null ? trend.value : trend;
  const trendPeriod = typeof trend === 'object' && trend !== null ? trend.period : '';

  // Determine explicit status type
  const isPendente = variant === 'amber' || title.toLowerCase().includes('pendente');
  const isVencido = variant === 'rose' || title.toLowerCase().includes('vencido');
  const isEmAnalise = variant === 'slate' || title.toLowerCase().includes('análise');

  // Sparkline SVG normalization
  const min = Math.min(...rawSparkline);
  const max = Math.max(...rawSparkline);
  const points = rawSparkline
    .map((val, idx) => {
      const x = (idx / (rawSparkline.length - 1)) * 52;
      const y = 16 - ((val - min) / (max - min || 1)) * 12;
      return `${x},${y}`;
    })
    .join(' ');

  // Color logic according to exact user instruction:
  // "cor pra vencido = vermelho mesmo"
  // "cor pra pendente = laranja mesmo"
  let sparklineStroke = 'var(--color-status-success)';
  if (isVencido) {
    sparklineStroke = 'var(--color-status-critical)';
  } else if (isPendente) {
    sparklineStroke = 'var(--color-status-warning)';
  } else if (isEmAnalise) {
    sparklineStroke = 'var(--color-status-info)';
  } else if (isPositive) {
    sparklineStroke = 'var(--color-status-success)';
  } else {
    sparklineStroke = 'var(--color-status-critical)';
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'fi-wi-stats-overview-stat p-5 bg-white dark:bg-slate-900 rounded-xl flex flex-col justify-between transition-all duration-150 cursor-pointer select-none shadow-xs ring-1',
        isSelected
          ? 'ring-2 ring-[var(--color-border-focus)] shadow-sm'
          : 'ring-slate-950/5 dark:ring-white/10 hover:ring-slate-300 dark:hover:ring-slate-700'
      )}
    >
      {/* Linha 1: Label em caixa alta suave com ícone sutil à direita */}
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-normal sm:tracking-wider uppercase line-clamp-1">
          {title}
        </span>
        {Icon && (
          <div
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
              isVencido
                ? 'bg-[var(--badge-critical-bg)] text-[var(--color-status-critical)]'
                : isPendente
                ? 'bg-[var(--badge-warning-bg)] text-[var(--color-status-warning)]'
                : isEmAnalise
                ? 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)]'
                : 'bg-[var(--badge-success-bg)] text-[var(--color-status-success)]'
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
        {trendText && (
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded text-[11px] tabular-nums shrink-0 border',
                isVencido
                  ? 'bg-[var(--badge-critical-bg)] text-[var(--badge-critical-text)] border-[var(--badge-critical-border)]'
                  : isPendente
                  ? 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-[var(--badge-warning-border)]'
                  : isEmAnalise
                  ? 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] border-[var(--badge-info-border)]'
                  : 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--badge-success-border)]'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 shrink-0" />
              ) : (
                <TrendingDown className="w-3 h-3 shrink-0" />
              )}
              {trendText}
            </span>
            {trendPeriod && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                {trendPeriod}
              </span>
            )}
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
