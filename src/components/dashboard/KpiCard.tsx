import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
    period?: string;
  };
  icon?: LucideIcon;
  themeColor?: 'emerald' | 'blue' | 'amber' | 'rose' | 'teal' | 'slate';
  sparklineData?: number[];
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  themeColor = 'emerald',
  sparklineData = [10, 15, 12, 18, 16, 22, 25],
}) => {
  const topGradients = {
    emerald: 'from-[#0F4C3A] via-emerald-500 to-teal-400',
    blue: 'from-blue-700 via-sky-500 to-indigo-400',
    amber: 'from-amber-600 via-amber-500 to-yellow-400',
    rose: 'from-rose-600 via-rose-500 to-pink-400',
    teal: 'from-teal-700 via-emerald-500 to-teal-300',
    slate: 'from-slate-700 via-slate-500 to-slate-400',
  };

  const iconContainers = {
    emerald: 'bg-emerald-50 text-[#0F4C3A] border border-emerald-100 group-hover:bg-[#0F4C3A] group-hover:text-white',
    blue: 'bg-blue-50 text-blue-700 border border-blue-100 group-hover:bg-blue-700 group-hover:text-white',
    amber: 'bg-amber-50 text-amber-700 border border-amber-100 group-hover:bg-amber-600 group-hover:text-white',
    rose: 'bg-rose-50 text-rose-700 border border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    teal: 'bg-teal-50 text-teal-700 border border-teal-100 group-hover:bg-teal-700 group-hover:text-white',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-slate-700 group-hover:text-white',
  };

  const sparklineStroke = {
    emerald: '#10B981',
    blue: '#38BDF8',
    amber: '#F59E0B',
    rose: '#F43F5E',
    teal: '#14B8A6',
    slate: '#94A3B8',
  };

  // Coordenadas para o mini-sparkline SVG
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 64;
      const y = 20 - ((val - min) / (max - min || 1)) * 16;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card className="relative overflow-hidden p-5 bg-white/95 backdrop-blur-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 group cursor-default">
      {/* Barra superior em gradiente iluminado */}
      <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', topGradients[themeColor])} />

      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {value}
          </div>
        </div>

        {Icon && (
          <div
            className={cn(
              'w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-2xs group-hover:scale-105',
              iconContainers[themeColor]
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Linha inferior: Tendência + Mini Sparkline */}
      <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between">
        {trend && (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] sm:text-[11px]',
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/80'
              )}
            >
              {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}
            </span>
            <span className="text-slate-400 text-[10px] hidden sm:inline">{trend.period || 'vs. anterior'}</span>
          </div>
        )}

        {/* Mini Sparkline SVG elegante */}
        <div className="w-16 h-5 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 64 20" className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={sparklineStroke[themeColor]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </Card>
  );
};
