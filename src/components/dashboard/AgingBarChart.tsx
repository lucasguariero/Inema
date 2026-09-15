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
import { Info, Clock } from 'lucide-react';

const data = [
  { faixa: '0-15 dias', quantidade: 412, percent: '14%', color: '#10B981', status: 'Fluxo Normal' },
  { faixa: '16-30 dias', quantidade: 678, percent: '22%', color: '#0284C7', status: 'Em Prazo' },
  { faixa: '31-60 dias', quantidade: 945, percent: '31%', color: '#F59E0B', status: 'Atenção Médio' },
  { faixa: '61-90 dias', quantidade: 612, percent: '20%', color: '#EA580C', status: 'Risco de Atraso' },
  { faixa: '> 90 dias', quantidade: 389, percent: '13%', color: '#E11D48', status: 'Crítico / Vencendo' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700/60 shadow-2xl text-xs space-y-1.5 min-w-[180px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <span className="font-bold text-slate-100">{item.faixa}</span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.2 rounded"
            style={{ backgroundColor: `${item.color}25`, color: item.color }}
          >
            {item.status}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 text-slate-300">
          <span>Estoque parado:</span>
          <strong className="text-white font-bold tabular-nums">
            {item.quantidade.toLocaleString('pt-BR')} ({item.percent})
          </strong>
        </div>
      </div>
    );
  }
  return null;
};

export const AgingBarChart: React.FC = () => {
  return (
    <Card className="flex flex-col justify-between hover:border-slate-300/80 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              Aging do Estoque
            </CardTitle>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Média: 42 dias
            </span>
          </div>
          <CardDescription className="text-xs">Tempo de permanência sem decisão final</CardDescription>
        </div>
        <button
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Contagem em dias corridos desde o protocolo até a data atual."
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 15, bottom: 0 }}
            >
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
                dataKey="faixa"
                stroke="#64748B"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantidade" radius={[0, 6, 6, 0]} barSize={18}>
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

