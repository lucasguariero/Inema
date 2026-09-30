import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const monthlyData = [
  { mes: 'Jan/26', entrada: 1250, saida: 980, saldo: 270 },
  { mes: 'Fev/26', entrada: 1380, saida: 1120, saldo: 260 },
  { mes: 'Mar/26', entrada: 1190, saida: 1450, saldo: -260 },
  { mes: 'Abr/26', entrada: 1420, saida: 1280, saldo: 140 },
  { mes: 'Mai/26', entrada: 1560, saida: 1390, saldo: 170 },
  { mes: 'Jun/26', entrada: 1680, saida: 1540, saldo: 140 },
];

const accumulatedData = [
  { mes: 'Jan/26', entrada: 1250, saida: 980, saldo: 270 },
  { mes: 'Fev/26', entrada: 2630, saida: 2100, saldo: 530 },
  { mes: 'Mar/26', entrada: 3820, saida: 3550, saldo: 270 },
  { mes: 'Abr/26', entrada: 5240, saida: 4830, saldo: 410 },
  { mes: 'Mai/26', entrada: 6800, saida: 6220, saldo: 580 },
  { mes: 'Jun/26', entrada: 8480, saida: 7760, saldo: 720 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const entrada = payload[0]?.value || 0;
    const saida = payload[1]?.value || 0;
    const diff = entrada - saida;

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700/60 shadow-2xl text-xs space-y-2 min-w-[170px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-bold text-slate-200">{label}</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
              diff >= 0
                ? 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border border-[var(--badge-success-border)]'
                : 'bg-[var(--badge-critical-bg)] text-[var(--badge-critical-text)] border border-[var(--badge-critical-border)]'
            }`}
          >
            {diff >= 0 ? `+${diff.toLocaleString('pt-BR')}` : diff.toLocaleString('pt-BR')} saldo
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[var(--color-green-300)] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--data-primary)]" />
              Entrada:
            </span>
            <strong className="font-bold text-white tabular-nums">
              {entrada.toLocaleString('pt-BR')}
            </strong>
          </div>
          <div className="flex items-center justify-between text-[var(--color-green-200)] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--data-secondary)]" />
              Saída:
            </span>
            <strong className="font-bold text-white tabular-nums">
              {saida.toLocaleString('pt-BR')}
            </strong>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const EntradaSaidaChart: React.FC = () => {
  const { themeConfig } = useTheme();
  const primaryColor = themeConfig.tokens.chartColors.primary;
  const secondaryColor = themeConfig.tokens.chartColors.secondary;
  const [viewMode, setViewMode] = useState<'mensal' | 'acumulado'>('mensal');
  const data = viewMode === 'mensal' ? monthlyData : accumulatedData;

  return (
    <Card className={cn("flex flex-col justify-between hover:border-slate-300/80 transition-all duration-300 shadow-2xs", themeConfig.tokens.cardBorder)}>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Entrada vs. Saída
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
            {viewMode === 'mensal' ? 'Volume apurado mês a mês' : 'Crescimento acumulado no exercício'}
          </CardDescription>
        </div>

        {/* Topo Direita: Legenda compacta + Alternador */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span className="text-[11px] font-medium">Entrada</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
              <span className="text-[11px] font-medium">Saída</span>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setViewMode('mensal')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'mensal'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setViewMode('acumulado')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'acumulado'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Acumulado
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={secondaryColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="mes"
                stroke="var(--chart-axis)"
                tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--chart-axis)"
                tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="entrada"
                stroke={primaryColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEntrada)"
                activeDot={{ r: 4, stroke: 'var(--chart-point-ring)', strokeWidth: 2, fill: primaryColor }}
              />
              <Area
                type="monotone"
                dataKey="saida"
                stroke={secondaryColor}
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorSaida)"
                activeDot={{ r: 4, stroke: 'var(--chart-point-ring)', strokeWidth: 2, fill: secondaryColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
