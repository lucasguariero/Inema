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
  { faixa: '0-15 dias', quantidade: 412, percent: '12%', color: '#10B981' },
  { faixa: '16-30 dias', quantidade: 678, percent: '20%', color: '#0D9488' },
  { faixa: '31-60 dias', quantidade: 945, percent: '28%', color: '#F59E0B' },
  { faixa: '61-90 dias', quantidade: 612, percent: '18%', color: '#EA580C' },
  { faixa: '91-180 dias', quantidade: 403, percent: '12%', color: '#E11D48' },
  { faixa: '> 180 dias', quantidade: 198, percent: '6%', color: '#BE123C' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl border border-slate-700/60 shadow-2xl text-xs space-y-1 min-w-[170px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <span className="font-bold text-slate-100">{item.faixa}</span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.2 rounded"
            style={{ backgroundColor: `${item.color}25`, color: item.color }}
          >
            {item.percent}
          </span>
        </div>
        <div className="flex items-center justify-between pt-0.5 text-slate-300">
          <span>Processos:</span>
          <strong className="text-white font-bold tabular-nums">
            {item.quantidade.toLocaleString('pt-BR')}
          </strong>
        </div>
      </div>
    );
  }
  return null;
};

export const AgingBarChart: React.FC = () => {
  return (
    <Card className="relative flex flex-col justify-between hover:border-slate-300/80 transition-all duration-300 shadow-2xs dark:bg-slate-900 dark:border-slate-800">
      <CardHeader className="flex flex-row items-start justify-between pb-2 pr-10">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Aging do Estoque
            </CardTitle>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              Média: 42 dias
            </span>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Tempo de permanência do estoque de processos
          </CardDescription>
        </div>
        <button
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Contagem em dias corridos desde o protocolo até a data atual."
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
                stroke="#64748B"
                tick={{ fill: '#64748B', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => val.toLocaleString('pt-BR')}
              />
              <YAxis
                type="category"
                dataKey="faixa"
                stroke="#334155"
                tick={{ fill: '#64748B', fontSize: 10, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantidade" radius={[0, 4, 4, 0]} barSize={18}>
                <LabelList
                  dataKey="quantidade"
                  position="right"
                  formatter={(val: any) => Number(val).toLocaleString('pt-BR')}
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
