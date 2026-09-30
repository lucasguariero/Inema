import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Download,
  Eye,
  Building2,
  CheckCircle2,
  Compass,
  FileText,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { Section } from '@/components/filament/Section';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface CefirImoveisPageProps {
  onNavigate?: (route: string) => void;
}

export const CefirImoveisPage: React.FC<CefirImoveisPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('inscritos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImovel, setSelectedImovel] = useState<any>(null);

  const tabs: FilamentTabItem[] = [
    { id: 'inscritos', label: 'Imóveis Inscritos no CEFIR', badge: '1.240.890 ha', badgeVariant: 'primary' },
    { id: 'pendentes', label: 'Validação de Sobreposição', badge: '62', badgeVariant: 'warning' },
  ];

  const imoveisMock = [
    {
      id: 'CEFIR-BA-2903201-88912',
      denominacao: 'Fazenda Rio das Pedras - Gleba 01',
      proprietario: 'Agrícola e Pecuária Santa Maria Ltda.',
      municipio: 'Barreiras/BA',
      areaTotal: '1.840,50 ha',
      reservaLegal: '368,10 ha (20%)',
      app: '142,30 ha',
      status: 'Inscrito e Homologado',
      statusColor: 'success',
      moduloFiscal: '28,4 MF',
    },
    {
      id: 'CEFIR-BA-2918001-44120',
      denominacao: 'Sítio Recanto dos Pássaros',
      proprietario: 'Antônio Carlos Mendonça',
      municipio: 'Jacobina/BA',
      areaTotal: '84,20 ha',
      reservaLegal: '16,84 ha (20%)',
      app: '12,00 ha',
      status: 'Aguardando Validação Cartográfica',
      statusColor: 'warning',
      moduloFiscal: '1,8 MF',
    },
  ];

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Regulação' },
          { label: 'Imóveis Rurais (CEFIR)' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Cadastro Estadual Florestal de Imóveis Rurais (CEFIR)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Integração oficial com o CAR nacional, poligonais de Reserva Legal, APPs e passivos florestais.
          </p>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <TableContainer
        toolbar={
          <TableToolbar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar por código CEFIR, denominação, proprietário..."
            actions={
              <Button variant="outline" size="sm" className="text-xs h-8">
                <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
                <span>Exportar SHP / CSV</span>
              </Button>
            }
          />
        }
      >
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              <th className="py-3 px-4">Código CEFIR / CAR</th>
              <th className="py-3 px-4">Denominação do Imóvel</th>
              <th className="py-3 px-4">Proprietário / Posseiro</th>
              <th className="py-3 px-4">Área Total & Módulos</th>
              <th className="py-3 px-4">Reserva Legal & APP</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {imoveisMock
              .filter(
                (row) =>
                  !searchTerm ||
                  row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  row.denominacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  row.proprietario.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">{row.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{row.denominacao}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{row.proprietario}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">{row.areaTotal} ({row.moduloFiscal})</td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-600 dark:text-slate-400">RL: {row.reservaLegal} • APP: {row.app}</td>
                  <td className="py-3.5 px-4">
                    <Badge color={row.statusColor as any} dot size="xs">
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="ghost" size="xs" onClick={() => setSelectedImovel(row)} className="text-[#0F4C3A] dark:text-emerald-400">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Mapa</span>
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </TableContainer>
    </div>
  );
};
