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
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Info, Gauge } from 'lucide-react';

const data = [
  { etapa: 'Triagem', dias: 2.3, meta: 3.0, status: 'No Prazo', delta: '-0.7d' },
  { etapa: 'Análise Técnica', dias: 18.7, meta: 15.0, status: 'Acima SLA', delta: '+3.7d' },
  { etapa: 'Coordenação', dias: 5.2, meta: 5.0, status: 'No Limite', delta: '+0.2d' },
  { etapa: 'Diretoria', dias: 8.1, meta: 7.0, status: 'Acima SLA', delta: '+1.1d' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const isOver = item.dias > item.meta;

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700/60 shadow-2xl text-xs space-y-1.5 min-w-[180px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <span className="font-bold text-slate-100">{item.etapa}</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
              isOver
                ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
            }`}
          >
            {item.status} ({item.delta})
          </span>
        </div>
        <div className="flex items-center justify-between pt-0.5 text-slate-300">
          <span>Tempo Médio Real:</span>
          <strong className="text-white font-bold tabular-nums">{item.dias} dias</strong>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Meta SLA Acordada:</span>
          <span className="tabular-nums">{item.meta} dias</span>
        </div>
      </div>
    );
  }
  return null;
};

export const TempoAnaliseChart: React.FC = () => {
  return (
    <Card className="flex flex-col justify-between hover:border-slate-300/80 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              Tempo Médio por Fase (dias)
            </CardTitle>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
              SLA vs. Real
            </span>
          </div>
          <CardDescription className="text-xs">Duração média de permanência em cada etapa</CardDescription>
        </div>
        <button
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Tempo médio decorrido entre o recebimento da tarefa e a emissão do despacho/parecer."
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
              margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis
                type="number"
                unit="d"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="etapa"
                stroke="#64748B"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="dias" radius={[0, 6, 6, 0]} barSize={18}>
                {data.map((entry, index) => {
                  const isOver = entry.dias > entry.meta;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isOver ? '#E11D48' : '#0F4C3A'}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

