import React, { useState } from 'react';
import {
  PawPrint,
  Plus,
  ArrowLeft,
  Search,
  Download,
  Eye,
  HeartPulse,
  Activity,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { Section } from '@/components/filament/Section';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface CrasFaunaPageProps {
  onNavigate?: (route: string) => void;
}

export const CrasFaunaPage: React.FC<CrasFaunaPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('tratamento');
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);

  const tabs: FilamentTabItem[] = [
    { id: 'tratamento', label: 'Animais em Tratamento / Quarentena', badge: '38', badgeVariant: 'warning' },
    { id: 'admissoes', label: 'Admissões do Mês', badge: '112', badgeVariant: 'primary' },
    { id: 'solturas', label: 'Reabilitados & Solturas', badge: '84', badgeVariant: 'success' },
    { id: 'recintos', label: 'Ocupação de Recintos', badge: '16 recintos', badgeVariant: 'gray' },
  ];

  const animaisMock = [
    {
      id: 'CRAS-BA-2026-00491',
      especie: 'Arara-azul-de-lear (Anodorhynchus leari)',
      classe: 'Aves (Psittacidae)',
      procedencia: 'Resgate de Apreensão — Fiscalização Regional Canudos',
      recinto: 'Recinto de Voo 03 (Quarentena)',
      anilhaMicrochip: 'Microchip 981.098.221.002',
      condicaoClinica: 'Reabilitação de Plumagem e Musculatura',
      status: 'Apto para Soltura Suave',
      statusColor: 'success',
      dataEntrada: '14/08/2026',
    },
    {
      id: 'CRAS-BA-2026-00478',
      especie: 'Tamanduá-bandeira (Myrmecophaga tridactyla)',
      classe: 'Mamíferos (Pilosa)',
      procedencia: 'Atropelamento na BR-242 / Resgate Policial',
      recinto: 'Enfermaria Veterinária 01',
      anilhaMicrochip: 'Microchip 981.098.221.099',
      condicaoClinica: 'Pós-Cirúrgico Ortopédico (Membro Posterior)',
      status: 'Tratamento Intensivo',
      statusColor: 'warning',
      dataEntrada: '02/09/2026',
    },
    {
      id: 'CRAS-BA-2026-00412',
      especie: 'Jaguatirica (Leopardus pardalis)',
      classe: 'Mamíferos (Carnivora)',
      procedencia: 'Entrega Voluntária em Parque Estadual',
      recinto: 'Recinto de Felinos 02',
      anilhaMicrochip: 'Microchip 981.098.221.145',
      condicaoClinica: 'Exames Hematológicos Normais',
      status: 'Treinamento de Caça',
      statusColor: 'info',
      dataEntrada: '20/07/2026',
    },
  ];

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Biodiversidade & Fauna', route: 'cras' },
          { label: 'CRAS — Animais Silvestres' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Centro de Triagem e Reabilitação de Animais Silvestres (CRAS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão clínica veterinária, prontuários, admissão por apreensão, recintos e programas de soltura e reintrodução.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>+ Nova Admissão de Animal</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Animais em Cuidados"
          value="142"
          trend="82% Aves e Mamíferos"
          trendType="neutral"
          icon={PawPrint}
          chartData={[120, 125, 130, 138, 140, 142, 142]}
        />
        <KpiCard
          title="Taxa de Reabilitação"
          value="78.5%"
          trend="+5.2% no ano"
          trendType="up"
          icon={HeartPulse}
          chartData={[65, 68, 70, 72, 75, 76, 78]}
        />
        <KpiCard
          title="Solturas Realizadas"
          value="84 espécimes"
          trend="Áreas de Soltura Cadastradas"
          trendType="up"
          icon={MapPin}
          chartData={[10, 18, 25, 40, 55, 70, 84]}
        />
        <KpiCard
          title="Ocupação de Recintos"
          value="82%"
          trend="16 de 20 recintos"
          trendType="neutral"
          icon={Layers}
          chartData={[70, 75, 78, 80, 80, 82, 82]}
        />
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Prontuário CRAS</th>
                <th className="py-3 px-4">Espécie (Nome Comum / Científico)</th>
                <th className="py-3 px-4">Procedência & Apreensão</th>
                <th className="py-3 px-4">Recinto Atual</th>
                <th className="py-3 px-4">Marcação / Microchip</th>
                <th className="py-3 px-4">Status Clínico</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {animaisMock.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {row.id}
                    <div className="text-[10px] text-slate-400 font-normal">{row.dataEntrada}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{row.especie}</div>
                    <div className="text-[11px] text-slate-500">{row.classe}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {row.procedencia}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#0F4C3A] dark:text-emerald-400">
                    {row.recinto}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {row.anilhaMicrochip}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={row.statusColor as any} hasDot className="text-[10px]">
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setSelectedAnimal(row)}
                      className="text-[#0F4C3A] dark:text-emerald-400"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Prontuário</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Ficha Veterinária do Animal */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{selectedAnimal.id}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedAnimal.especie}</h3>
              </div>
              <Badge variant={selectedAnimal.statusColor as any}>{selectedAnimal.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Procedência:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{selectedAnimal.procedencia}</p>
              </div>
              <div>
                <span className="text-slate-500">Identificação Individual:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedAnimal.anilhaMicrochip}</p>
              </div>
              <div className="col-span-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-500 font-semibold">Avaliação Clínica & Manejo:</span>
                <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">{selectedAnimal.condicaoClinica}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" onClick={() => setSelectedAnimal(null)} className="bg-[#0F4C3A] text-white">
                Fechar Prontuário
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
