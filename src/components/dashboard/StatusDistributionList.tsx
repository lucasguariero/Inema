import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface StatusItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
  bgHex: string;
  description: string;
}

const data: StatusItem[] = [
  {
    name: 'Em Análise',
    value: 4569,
    percentage: 54,
    color: 'bg-[#0F4C3A]',
    bgHex: '#0F4C3A',
    description: 'Em triagem técnica ou pauta de parecer',
  },
  {
    name: 'Pendentes',
    value: 1692,
    percentage: 20,
    color: 'bg-amber-500',
    bgHex: '#F59E0B',
    description: 'Aguardando interessado ou documentos',
  },
  {
    name: 'Aguard. Pagamento',
    value: 677,
    percentage: 8,
    color: 'bg-sky-500',
    bgHex: '#0284C7',
    description: 'Boleto/DAE emitido aguardando liquidação',
  },
  {
    name: 'Condicionantes',
    value: 508,
    percentage: 6,
    color: 'bg-purple-500',
    bgHex: '#8B5CF6',
    description: 'Cumprimento de cláusula de licença',
  },
  {
    name: 'Outros',
    value: 1015,
    percentage: 12,
    color: 'bg-slate-400',
    bgHex: '#94A3B8',
    description: 'Em trânsito administrativo ou arquivo',
  },
];

const total = data.reduce((acc, curr) => acc + curr.value, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl border border-slate-700/60 shadow-2xl text-xs space-y-1 min-w-[160px]">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.bgHex }} />
          <span className="font-bold text-slate-100">{item.name}</span>
        </div>
        <div className="flex items-center justify-between pt-0.5 text-slate-300">
          <span>Processos:</span>
          <strong className="text-white font-bold tabular-nums">
            {item.value.toLocaleString('pt-BR')} ({item.percentage}%)
          </strong>
        </div>
      </div>
    );
  }
  return null;
};

export const StatusDistributionList: React.FC = () => {
  const { themeConfig, isDarkMode } = useTheme();
  const primaryColor = themeConfig.tokens.chartColors.primary;

  return (
    <Card className={cn("flex flex-col justify-between hover:border-slate-300/80 transition-all duration-300 shadow-2xs dark:bg-slate-900 dark:border-slate-800", themeConfig.tokens.cardBorder)}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Processos por Status
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Distribuição proporcional da carteira ativa
          </CardDescription>
        </div>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2 py-0.5 rounded-full tabular-nums">
          {total.toLocaleString('pt-BR')} total
        </span>
      </CardHeader>

      <CardContent className="pt-0 pb-4 flex items-center gap-2">
        {/* Donut Chart com Total centralizado */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => {
                  const sliceColor = index === 0 ? primaryColor : entry.bgHex;
                  return <Cell key={`cell-${index}`} fill={sliceColor} />;
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none tabular-nums">
              8.461
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              Total
            </span>
          </div>
        </div>

        {/* Legenda Lateral Interativa */}
        <div className="flex-1 space-y-1.5 pl-2">
          {data.map((item, idx) => {
            const isFirst = idx === 0;
            const itemColor = isFirst ? primaryColor : item.bgHex;
            return (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 p-1 rounded-md transition-colors group cursor-default"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: itemColor }}
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pl-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const StatusDonutChart = StatusDistributionList;
