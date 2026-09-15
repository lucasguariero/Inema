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
import { Info, Building2 } from 'lucide-react';

const data = [
  { unidade: 'DIRRE', quantidade: 1254, percent: '33%', descricao: 'Diretoria de Regulação' },
  { unidade: 'DIREC', quantidade: 856, percent: '22%', descricao: 'Recursos Hídricos' },
  { unidade: 'DIBA', quantidade: 642, percent: '17%', descricao: 'Biodiversidade' },
  { unidade: 'DILIC', quantidade: 511, percent: '13%', descricao: 'Licenciamento' },
  { unidade: 'DISUC', quantidade: 309, percent: '8%', descricao: 'Sustentabilidade' },
  { unidade: 'Outras', quantidade: 254, percent: '7%', descricao: 'Outras Unidades' },
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
  return (
    <Card className="flex flex-col justify-between hover:border-slate-300/80 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              Processos por Unidade
            </CardTitle>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-[#0F4C3A] border border-emerald-200/70">
              DIRRE lidera
            </span>
          </div>
          <CardDescription className="text-xs">Carga de trabalho distribuída pelas diretorias</CardDescription>
        </div>
        <button
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Processos sob responsabilidade técnica ativa de cada diretoria."
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
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradientForest" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0A3528" />
                  <stop offset="100%" stopColor="#145A45" />
                </linearGradient>
                <linearGradient id="barGradientTeal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0F4C3A" />
                  <stop offset="100%" stopColor="#10B981" />
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
                dataKey="quantidade"
                radius={[0, 6, 6, 0]}
                barSize={18}
                fill="url(#barGradientForest)"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? 'url(#barGradientTeal)' : 'url(#barGradientForest)'}
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

