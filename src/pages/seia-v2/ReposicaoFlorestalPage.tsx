import React, { useState } from 'react';
import {
  Trees,
  Plus,
  ArrowLeft,
  Search,
  Download,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  Building2,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface ReposicaoFlorestalPageProps {
  onNavigate?: (route: string) => void;
}

export const ReposicaoFlorestalPage: React.FC<ReposicaoFlorestalPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('processos');
  const [selectedProcesso, setSelectedProcesso] = useState<any>(null);

  const tabs: FilamentTabItem[] = [
    { id: 'processos', label: 'Processos de Reposição', badge: '128', badgeVariant: 'primary' },
    { id: 'creditos', label: 'Conta Corrente CRF', badge: 'R$ 4.2M', badgeVariant: 'gray' },
    { id: 'plantios', label: 'Vistorias de Plantio', badge: '45', badgeVariant: 'warning' },
  ];

  const reposicaoMock = [
    {
      id: 'REP-2026-00192',
      processoAsv: 'SEI-BA-019.2241.2025/ASV',
      detentor: 'Complexo Solar Alto Sertão IV',
      volumeDevido: '14.200 m³ st',
      volumeCompensado: '14.200 m³ st',
      saldo: '0 m³ st (Quitado)',
      formaCompensacao: 'Plantio em Área Própria (18,5 ha)',
      status: 'Adimplente',
      statusColor: 'success',
      municipio: 'Caetité/BA',
    },
    {
      id: 'REP-2026-00155',
      processoAsv: 'SEI-BA-014.8812.2025/ASV',
      detentor: 'Linhas de Transmissão Oeste-Leste',
      volumeDevido: '8.400 m³ st',
      volumeCompensado: '4.200 m³ st',
      saldo: '4.200 m³ st Pendente',
      formaCompensacao: 'Créditos de Reposição Florestal (CRF)',
      status: 'Aguardando Comprovante',
      statusColor: 'warning',
      municipio: 'Bom Jesus da Lapa/BA',
    },
    {
      id: 'REP-2026-00088',
      processoAsv: 'SEI-BA-011.0491.2024/ASV',
      detentor: 'Mineração Vale do Jacuípe Ltda.',
      volumeDevido: '22.000 m³ st',
      volumeCompensado: '22.000 m³ st',
      saldo: '0 m³ st',
      formaCompensacao: 'Associação de Fomento Florestal',
      status: 'Certificado Emitido',
      statusColor: 'info',
      municipio: 'Riachão do Jacuípe/BA',
    },
  ];

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Biodiversidade & Florestas', route: 'reposicao-florestal' },
          { label: 'Reposição Florestal (CRF)' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Reposição Florestal Obrigatória & Créditos (CRF)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Controle de cumprimento da reposição florestal por Autorização de Supressão Vegetal (ASV) e conta corrente.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="text-xs h-9">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Extrato Geral</span>
          </Button>
          <Button className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>+ Vincular Projeto / Crédito</span>
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Saldo de Créditos (CRF)"
          value="45.200 m³ st"
          trend="Disponível para abatimento"
          trendType="up"
          icon={Trees}
          chartData={[30, 35, 40, 42, 45, 48, 52]}
        />
        <KpiCard
          title="Volume a Compensar"
          value="18.450 m³ st"
          trend="128 processos ativos"
          trendType="neutral"
          icon={Layers}
          chartData={[25, 24, 22, 20, 19, 18, 18]}
        />
        <KpiCard
          title="Áreas em Plantio"
          value="1.240 ha"
          trend="Mata Atlântica & Caatinga"
          trendType="up"
          icon={MapPin}
          chartData={[10, 15, 20, 28, 35, 40, 48]}
        />
        <KpiCard
          title="Taxa de Adimplência"
          value="88.4%"
          trend="+3.2% no trimestre"
          trendType="up"
          icon={Percent}
          chartData={[75, 78, 80, 82, 85, 86, 88]}
        />
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tabela de Reposição Florestal */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Processo Reposição</th>
                <th className="py-3 px-4">Processo ASV / Detentor</th>
                <th className="py-3 px-4">Volume Devido / Compensado</th>
                <th className="py-3 px-4">Forma de Compensação</th>
                <th className="py-3 px-4">Município</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reposicaoMock.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {row.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{row.detentor}</div>
                    <div className="text-[11px] font-mono text-slate-500">{row.processoAsv}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{row.volumeDevido}</div>
                    <div className="text-[11px] text-emerald-600 font-medium">Pago: {row.volumeCompensado}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {row.formaCompensacao}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {row.municipio}
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
                      onClick={() => setSelectedProcesso(row)}
                      className="text-[#0F4C3A] dark:text-emerald-400"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Extrato</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Extrato da Conta Corrente */}
      {selectedProcesso && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Extrato da Conta Corrente de Reposição Florestal
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Processo: <strong className="font-mono">{selectedProcesso.id}</strong> — {selectedProcesso.detentor}
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Volume Total da ASV:</span>
                <span className="font-mono font-bold">{selectedProcesso.volumeDevido}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Créditos Abatidos:</span>
                <span className="font-mono">-{selectedProcesso.volumeCompensado}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold">
                <span>Saldo Devedor:</span>
                <span className="font-mono text-[#0F4C3A]">{selectedProcesso.saldo}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button size="sm" onClick={() => setSelectedProcesso(null)} className="bg-[#0F4C3A] text-white">
                Fechar Extrato
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
