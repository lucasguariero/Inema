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
import { Info } from 'lucide-react';

const data = [
  { etapa: 'Triagem', dias: 2.3, color: '#005ea3' },
  { etapa: 'Análise Técnica', dias: 18.7, color: '#0F4C3A' }, // Gargalo
  { etapa: 'Coordenação', dias: 5.2, color: '#0284C7' },
  { etapa: 'Diretoria', dias: 8.1, color: '#0c4353' },
  { etapa: 'Publicação', dias: 3.4, color: '#78C043' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const isBottleneck = item.etapa === 'Análise Técnica';

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl border border-slate-700/60 shadow-2xl text-xs space-y-1 min-w-[170px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <span className="font-bold text-slate-100">{item.etapa}</span>
          {isBottleneck && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Gargalo
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-0.5 text-slate-300">
          <span>Tempo Médio:</span>
          <strong className="text-white font-bold tabular-nums">{item.dias} dias</strong>
        </div>
      </div>
    );
  }
  return null;
};

export const TempoAnaliseChart: React.FC = () => {
  return (
    <Card className="flex flex-col justify-between hover:border-slate-300/80 transition-all duration-300 shadow-2xs dark:bg-slate-900 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Tempo Médio de Análise (dias)
            </CardTitle>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Por Etapa
            </span>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Duração média por etapa do processo
          </CardDescription>
        </div>
        <button
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          title="Tempo médio decorrido entre o recebimento da tarefa e a emissão do parecer."
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      <CardContent className="pt-0 pb-4 pr-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 40, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis
                type="number"
                unit="d"
                stroke="#64748B"
                tick={{ fill: '#64748B', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="etapa"
                stroke="#334155"
                tick={{ fill: '#64748B', fontSize: 10, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="dias" radius={[0, 4, 4, 0]} barSize={18}>
                <LabelList
                  dataKey="dias"
                  position="right"
                  formatter={(val: any) => `${val}d`}
                  style={{ fill: '#64748B', fontSize: 10, fontWeight: 600 }}
                />
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
