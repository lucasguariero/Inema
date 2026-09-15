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
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const data = [
  { unidade: 'DIRRE', vencidos: 78, percentual: '39%', diasMedioAtraso: 18 },
  { unidade: 'DIBIO', vencidos: 46, percentual: '23%', diasMedioAtraso: 12 },
  { unidade: 'DILIC', vencidos: 34, percentual: '17%', diasMedioAtraso: 9 },
  { unidade: 'DIREC', vencidos: 25, percentual: '13%', diasMedioAtraso: 7 },
  { unidade: 'DISUC', vencidos: 15, percentual: '8%', diasMedioAtraso: 5 },
];

const totalVencidos = data.reduce((acc, curr) => acc + curr.vencidos, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-rose-500/40 shadow-2xl text-xs space-y-1.5 min-w-[180px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <span className="font-bold text-rose-300 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            {item.unidade}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800/60">
            {item.percentual} do total
          </span>
        </div>
        <div className="flex items-center justify-between pt-0.5 text-slate-300">
          <span>Processos Vencidos:</span>
          <strong className="text-white font-bold tabular-nums">{item.vencidos}</strong>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Atraso médio:</span>
          <span className="tabular-nums text-rose-300">{item.diasMedioAtraso} dias após prazo</span>
        </div>
      </div>
    );
  }
  return null;
};

export const VencidosBarChart: React.FC = () => {
  return (
    <Card className="flex flex-col justify-between border-rose-200/80 hover:border-rose-300 transition-all duration-300 shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>Processos Vencidos por Unidade</span>
            </CardTitle>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
              {totalVencidos} Total
            </span>
          </div>
          <CardDescription className="text-xs">Pontos de atenção que ultrapassaram o prazo legal</CardDescription>
        </div>
        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center shrink-0 shadow-2xs">
          <AlertTriangle className="w-4 h-4" />
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradientRose" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#BE123C" />
                  <stop offset="100%" stopColor="#F43F5E" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis
                type="number"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => val.toLocaleString('pt-BR')}
              />
              <YAxis
                type="category"
                dataKey="unidade"
                stroke="#64748B"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="vencidos"
                fill="url(#barGradientRose)"
                radius={[0, 6, 6, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

