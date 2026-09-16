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
import { AlertTriangle } from 'lucide-react';

const data = [
  { unidade: 'DIRRE', vencidos: 78, percentual: '39%' },
  { unidade: 'DIBIO', vencidos: 46, percentual: '23%' },
  { unidade: 'DILIC', vencidos: 34, percentual: '17%' },
  { unidade: 'DIREC', vencidos: 25, percentual: '13%' },
  { unidade: 'DISUC', vencidos: 15, percentual: '8%' },
];

const totalVencidos = data.reduce((acc, curr) => acc + curr.vencidos, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl border border-rose-500/40 shadow-2xl text-xs space-y-1 min-w-[170px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <span className="font-bold text-rose-300 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            {item.unidade}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800/60">
            {item.percentual}
          </span>
        </div>
        <div className="flex items-center justify-between pt-0.5 text-slate-300">
          <span>Processos Vencidos:</span>
          <strong className="text-white font-bold tabular-nums">{item.vencidos}</strong>
        </div>
      </div>
    );
  }
  return null;
};

export const VencidosBarChart: React.FC = () => {
  return (
    <Card className="flex flex-col justify-between border-rose-200/80 dark:border-rose-900/50 hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-300 shadow-2xs dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Processos Vencidos por Unidade</span>
            </CardTitle>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
              {totalVencidos} Total
            </span>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Quantidade de processos vencidos por unidade
          </CardDescription>
        </div>
        <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-center shrink-0 shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
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
                dataKey="unidade"
                stroke="#334155"
                tick={{ fill: '#64748B', fontSize: 10, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="vencidos"
                fill="#E11D48"
                radius={[0, 4, 4, 0]}
                barSize={18}
              >
                <LabelList
                  dataKey="vencidos"
                  position="right"
                  formatter={(val: any) => Number(val).toLocaleString('pt-BR')}
                  style={{ fill: '#E11D48', fontSize: 10, fontWeight: 700 }}
                />
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#E11D48" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
