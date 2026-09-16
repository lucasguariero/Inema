import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const data = [
  { unidade: 'DIRRE', quantidade: 1254, percent: '33%', descricao: 'Diretoria de Regulação' },
  { unidade: 'DIREC', quantidade: 856, percent: '22%', descricao: 'Recursos Hídricos' },
  { unidade: 'DIBA', quantidade: 642, percent: '17%', descricao: 'Biodiversidade' },
  { unidade: 'DILIC', quantidade: 511, percent: '13%', descricao: 'Licenciamento' },
  { unidade: 'DISUC', quantidade: 309, percent: '8%', descricao: 'Sustentabilidade' },
  { unidade: 'Outras', quantidade: 254, percent: '7%', descricao: 'Demais Diretorias' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700/60 shadow-2xl text-xs space-y-1.5 min-w-[180px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <span className="font-bold text-slate-100">{item.unidade}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/60">
            {item.percent} da carteira
          </span>
        </div>
        <p className="text-[11px] text-slate-400">{item.descricao}</p>
        <div className="flex items-center justify-between pt-1 text-slate-300">
          <span>Processos ativos:</span>
          <strong className="text-white font-bold tabular-nums">
            {item.quantidade.toLocaleString('pt-BR')}
          </strong>
        </div>
      </div>
    );
  }
  return null;
};

export const UnidadeBarChart: React.FC = () => {
  const { themeConfig } = useTheme();
  const primaryColor = themeConfig.tokens.chartColors.primary;
  const secondaryColor = themeConfig.tokens.chartColors.secondary;

  return (
    <Card className={cn("flex flex-col justify-between hover:border-slate-300/80 transition-all duration-300 shadow-2xs", themeConfig.tokens.cardBorder)}>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Processos por Unidade
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Carga de trabalho distribuída pelas diretorias
          </CardDescription>
        </div>
        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", themeConfig.tokens.accentPillBg, themeConfig.tokens.accentPillText, themeConfig.tokens.accentPillBorder)}>
          DIRRE lidera
        </span>
      </CardHeader>

      <CardContent className="pt-0 pb-4 pr-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 55, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 1500]}
                stroke="#64748B"
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => val.toLocaleString('pt-BR')}
              />
              <YAxis
                type="category"
                dataKey="unidade"
                stroke="#334155"
                tick={{ fill: '#0F172A', fontSize: 11, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="quantidade"
                radius={[0, 4, 4, 0]}
                barSize={18}
                fill={primaryColor}
              >
                <LabelList
                  dataKey="quantidade"
                  position="right"
                  formatter={(val: any) => Number(val).toLocaleString('pt-BR')}
                  style={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
                />
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? primaryColor : secondaryColor}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
