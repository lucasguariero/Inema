import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Info, PieChart as PieIcon } from 'lucide-react';

interface StatusItem {
  name: string;
  value: number;
  percentage: string;
  color: string;
  description: string;
}

const data: StatusItem[] = [
  { name: 'Em Análise', value: 4569, percentage: '54%', color: '#0F4C3A', description: 'Em triagem ou parecer' },
  { name: 'Pendentes', value: 1692, percentage: '20%', color: '#D97706', description: 'Aguardando interessado' },
  { name: 'Aguard. Pagamento', value: 677, percentage: '8%', color: '#0284C7', description: 'Boleto/DAE emitido' },
  { name: 'Condicionantes', value: 508, percentage: '6%', color: '#8B5CF6', description: 'Cumprimento de cláusula' },
  { name: 'Outros', value: 1015, percentage: '12%', color: '#94A3B8', description: 'Em trânsito / arquivo' },
];

const total = data.reduce((acc, curr) => acc + curr.value, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as StatusItem;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700/60 shadow-2xl text-xs space-y-1.5 min-w-[170px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="font-bold text-slate-100">{item.name}</span>
        </div>
        <p className="text-[11px] text-slate-400">{item.description}</p>
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-slate-300">
          <span>Quantidade:</span>
          <strong className="font-bold text-white tabular-nums">
            {item.value.toLocaleString('pt-BR')} ({item.percentage})
          </strong>
        </div>
      </div>
    );
  }
  return null;
};

export const StatusDonutChart: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Card className="flex flex-col justify-between hover:border-slate-300/80 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              Processos por Status
            </CardTitle>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Ativos
            </span>
          </div>
          <CardDescription className="text-xs">Distribuição percentual da carteira ativa</CardDescription>
        </div>
        <button
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Status atualizado conforme última movimentação oficial no SEIA."
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-64">
          {/* Donut Container com total no miolo */}
          <div className="relative w-48 h-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={activeIndex === index ? 3 : 1}
                      style={{
                        transform: activeIndex === index ? 'scale(1.04)' : 'scale(1)',
                        transformOrigin: 'center center',
                        transition: 'transform 0.2s ease-out',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Texto no Centro do Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                {activeIndex !== null
                  ? data[activeIndex].value.toLocaleString('pt-BR')
                  : total.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {activeIndex !== null ? data[activeIndex].name : 'Total Carteira'}
              </span>
            </div>
          </div>

          {/* Legenda Customizada com Mini Barras de Progresso */}
          <div className="space-y-2 w-full max-w-[200px]">
            {data.map((item, index) => {
              const isHovered = activeIndex === index;
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    isHovered ? 'bg-slate-100/90 shadow-2xs' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: item.color }}
                      />
                      <span
                        className={`truncate ${
                          isHovered ? 'font-bold text-slate-900' : 'text-slate-600 font-medium'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 shrink-0 text-[11px] tabular-nums ml-1">
                      {item.percentage}
                    </span>
                  </div>

                  {/* Micro Barra de Proporção */}
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: item.percentage,
                        backgroundColor: item.color,
                        opacity: isHovered ? 1 : 0.7,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

