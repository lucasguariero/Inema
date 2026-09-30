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
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface ReposicaoFlorestalPageProps {
  onNavigate?: (route: string) => void;
}

export const ReposicaoFlorestalPage: React.FC<ReposicaoFlorestalPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('processos');
  const [searchTerm, setSearchTerm] = useState('');
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
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Requerimentos', route: 'reposicao-florestal' },
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

      {activeTab === 'processos' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Buscar por processo, detentor, ASV ou município..."
              actions={
                <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <span>Exportar CSV</span>
                </Button>
              }
            />
          }
        >
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
              {reposicaoMock
                .filter(
                  (row) =>
                    !searchTerm ||
                    row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    row.detentor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    row.processoAsv.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    row.municipio.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((row) => (
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
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Pago: {row.volumeCompensado}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {row.formaCompensacao}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {row.municipio}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color={row.statusColor as any} dot size="xs">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setSelectedProcesso(row)}
                        className="text-[#0F4C3A] dark:text-emerald-400 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Extrato</span>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'creditos' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Buscar por conta CRF, titular ou bioma..."
              actions={
                <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <span>Livro de Créditos</span>
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Conta Corrente CRF</th>
                <th className="py-3 px-4">Titular do Crédito</th>
                <th className="py-3 px-4">Bioma de Origem</th>
                <th className="py-3 px-4">Créditos Emitidos</th>
                <th className="py-3 px-4">Créditos Utilizados</th>
                <th className="py-3 px-4">Saldo Disponível</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  id: 'CRF-CTA-2026-0041',
                  titular: 'BioFlorestal Conservação e Fomento S.A.',
                  bioma: 'Caatinga Arbórea',
                  emitidos: '80.000 m³ st',
                  utilizados: '34.800 m³ st',
                  saldo: '45.200 m³ st',
                  status: 'Disponível para Negociação',
                  statusColor: 'success',
                },
                {
                  id: 'CRF-CTA-2025-0112',
                  titular: 'Reflorestadora Sul Baiano Ltda.',
                  bioma: 'Mata Atlântica',
                  emitidos: '50.000 m³ st',
                  utilizados: '50.000 m³ st',
                  saldo: '0 m³ st',
                  status: 'Conta Esgotada',
                  statusColor: 'gray',
                },
              ].map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">{c.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{c.titular}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{c.bioma}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">{c.emitidos}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">{c.utilizados}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0F4C3A] dark:text-emerald-400">{c.saldo}</td>
                  <td className="py-3.5 px-4">
                    <Badge color={c.statusColor as any} dot size="xs">
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'plantios' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Buscar por projeto de plantio, fazenda ou município..."
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Projeto de Plantio</th>
                <th className="py-3 px-4">Imóvel Rural / CEFIR</th>
                <th className="py-3 px-4">Área Efetiva</th>
                <th className="py-3 px-4">Espécies Plantadas</th>
                <th className="py-3 px-4">Última Vistoria INEMA</th>
                <th className="py-3 px-4">Status do Estande</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  id: 'PLANT-2026-0089',
                  imovel: 'Fazenda Rio Verde (CEFIR 2903201-8891)',
                  area: '18,50 ha',
                  especies: 'Aroeira, Pau-ferro, Ipê-amarelo e Angico',
                  vistoria: '14/08/2026 (Laudo Favorável)',
                  status: 'Estande Estabelecido',
                  statusColor: 'success',
                },
                {
                  id: 'PLANT-2026-0044',
                  imovel: 'Gleba Santa Maria (CEFIR 2918001-4412)',
                  area: '12,00 ha',
                  especies: 'Canafístula, Braúna e Jacarandá',
                  vistoria: '22/09/2026 (Replantio parcial exigido)',
                  status: 'Notificado para Adensamento',
                  statusColor: 'warning',
                },
              ].map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">{p.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{p.imovel}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">{p.area}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{p.especies}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{p.vistoria}</td>
                  <td className="py-3.5 px-4">
                    <Badge color={p.statusColor as any} dot size="xs">
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {/* Modal / Extrato da Conta Corrente com divisores de ponta a ponta */}
      {selectedProcesso && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Extrato da Conta Corrente de Reposição Florestal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Processo: <strong className="font-mono">{selectedProcesso.id}</strong> — {selectedProcesso.detentor}
              </p>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Volume Total da ASV:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedProcesso.volumeDevido}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Créditos Abatidos:</span>
                  <span className="font-mono">-{selectedProcesso.volumeCompensado}</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700/80 pt-2 flex justify-between font-bold">
                  <span className="text-slate-800 dark:text-slate-200">Saldo Devedor:</span>
                  <span className="font-mono text-[#0F4C3A] dark:text-emerald-400">{selectedProcesso.saldo}</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 flex justify-end">
              <Button size="sm" onClick={() => setSelectedProcesso(null)} className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 font-semibold">
                Fechar Extrato
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
