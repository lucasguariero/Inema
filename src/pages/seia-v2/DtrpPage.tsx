import React, { useState } from 'react';
import {
  Truck,
  Plus,
  ArrowLeft,
  Search,
  Download,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Clock,
  Eye,
  ShieldCheck,
  MapPin,
  FileText,
  Building2,
  QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { FilamentWizard, Step } from '@/components/filament/Wizard';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';
import { PdfPreviewDrawer, PdfDocumentData } from '@/components/seia-v2/PdfPreviewDrawer';

interface DtrpPageProps {
  onNavigate?: (route: string) => void;
}

export const DtrpPage: React.FC<DtrpPageProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'pauta' | 'novo-manifesto' | 'detalhes'>('pauta');
  const [activeTab, setActiveTab] = useState('manifestos');
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedManifesto, setSelectedManifesto] = useState<any>(null);
  const [pdfDrawerOpen, setPdfDrawerOpen] = useState(false);
  const [pdfData, setPdfData] = useState<PdfDocumentData | null>(null);

  const tabs: FilamentTabItem[] = [
    { id: 'manifestos', label: 'Manifestos Ativos', badge: '342', badgeVariant: 'primary' },
    { id: 'transito', label: 'Cargas em Trânsito', badge: '18', badgeVariant: 'warning' },
    { id: 'historico', label: 'Histórico DIFIS', badge: '1.890', badgeVariant: 'gray' },
  ];

  const wizardSteps: Step[] = [
    { id: 1, label: 'Gerador & Destinador', description: 'Empresas e licenças ambientais' },
    { id: 2, label: 'Classificação do Resíduo', description: 'Código ONU e Classe de Risco' },
    { id: 3, label: 'Veículo & Motorista', description: 'Placa, CIPP e condutor' },
    { id: 4, label: 'Rota & Seguro Ambiental', description: 'Trajeto rodoviário e apólice' },
  ];

  const manifestosMock = [
    {
      id: 'DTRP-2026-00412',
      gerador: 'Petroquímica Camaçari S.A.',
      transportador: 'Transquímica Logística Ltda.',
      residuo: 'Solventes Orgânicos Halogenados (Classe I)',
      onu: 'ONU 1993',
      quantidade: '14.500 kg',
      origemDestino: 'Camaçari/BA ➔ Candeias/BA',
      placa: 'BRA-2E19 (Cavalo Mecânico)',
      status: 'Em Trânsito',
      statusColor: 'warning',
      dataEmissao: '29/09/2026 14:30',
      validade: '02/10/2026',
    },
    {
      id: 'DTRP-2026-00398',
      gerador: 'Refinaria Mataripe (Acelen)',
      transportador: 'Rodoviário Cargas Perigosas Bahia',
      residuo: 'Borra Oleosa de Tanques (Classe I)',
      onu: 'ONU 3082',
      quantidade: '22.000 L',
      origemDestino: 'São Francisco do Conde/BA ➔ Dias d’Ávila/BA',
      placa: 'PKJ-8812 (Tanque Inox)',
      status: 'Autorizado',
      statusColor: 'success',
      dataEmissao: '28/09/2026 09:15',
      validade: '05/10/2026',
    },
    {
      id: 'DTRP-2026-00315',
      gerador: 'Complexo Eólico do São Francisco',
      transportador: 'Ecotrans Logística Ambiental',
      residuo: 'Óleos Lubrificantes Usados (OLUC)',
      onu: 'ONU 3082',
      quantidade: '8.200 L',
      origemDestino: 'Sento Sé/BA ➔ Feira de Santana/BA',
      placa: 'OZE-4491',
      status: 'Concluído e Descarregado',
      statusColor: 'info',
      dataEmissao: '20/09/2026 11:00',
      validade: 'Finalizado',
    },
  ];

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Fiscalização (DIFIS)', route: 'dtrp' },
          { label: 'Transporte de Resíduos (DTRP)' },
        ]}
        onNavigate={onNavigate}
      />

      {viewMode === 'pauta' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Declaração de Transporte de Resíduos Perigosos (DTRP)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Controle de manifestos de transporte de resíduos perigosos (MTR), rotas de risco e cargas químicas.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button variant="outline" size="sm" className="text-xs h-9">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>Exportar Manifestos</span>
              </Button>
              <Button
                onClick={() => {
                  setViewMode('novo-manifesto');
                  setWizardStep(1);
                }}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>+ Novo Manifesto DTRP</span>
              </Button>
            </div>
          </div>

          {/* KPIs do DTRP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Manifestos Ativos"
              value="342"
              trend="+14% vs mês anterior"
              trendType="up"
              icon={Truck}
              chartData={[45, 50, 62, 70, 78, 85, 92]}
            />
            <KpiCard
              title="Cargas em Trânsito"
              value="18"
              trend="Rastreamento em tempo real"
              trendType="neutral"
              icon={Clock}
              chartData={[10, 14, 12, 18, 15, 20, 18]}
            />
            <KpiCard
              title="Volume Transportado"
              value="4.820 t"
              trend="Classe I e II-A"
              trendType="up"
              icon={AlertTriangle}
              chartData={[30, 35, 42, 50, 60, 68, 75]}
            />
            <KpiCard
              title="Autos / Bloqueios"
              value="02"
              trend="Irregularidade sanada"
              trendType="down"
              icon={ShieldCheck}
              chartData={[8, 6, 5, 4, 3, 2, 2]}
            />
          </div>

          <div className="border-b border-slate-200 dark:border-slate-800">
            <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {/* Tabela de Manifestos DTRP */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    <th className="py-3 px-4">Manifesto DTRP</th>
                    <th className="py-3 px-4">Gerador / Transportador</th>
                    <th className="py-3 px-4">Resíduo & Código ONU</th>
                    <th className="py-3 px-4">Origem ➔ Destino</th>
                    <th className="py-3 px-4">Veículo / Placa</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {manifestosMock.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {row.id}
                        <div className="text-[10px] text-slate-400 font-normal">{row.dataEmissao}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{row.gerador}</div>
                        <div className="text-[11px] text-slate-500">{row.transportador}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{row.residuo}</div>
                        <div className="text-[11px] font-mono text-slate-500">{row.onu} • {row.quantidade}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-600 dark:text-slate-300">
                        {row.origemDestino}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {row.placa}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={row.statusColor as any} hasDot className="text-[10px]">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                              setPdfData({
                                tipo: 'DTRP',
                                titulo: 'Declaração de Transporte de Resíduos Perigosos (DTRP)',
                                codigoDocumento: row.id,
                                interessado: `${row.gerador} / ${row.transportador}`,
                                cpfCnpj: '00.123.456/0001-89',
                                dataEmissao: row.dataEmissao,
                                validade: row.validade,
                                autenticidadeToken: 'DTRP-AUT-9921-X81',
                                status: 'Válido',
                              });
                              setPdfDrawerOpen(true);
                            }}
                            className="text-slate-600 dark:text-slate-400"
                            title="Visualizar PDF Oficial"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1" />
                            <span>PDF</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                              setSelectedManifesto(row);
                              setViewMode('detalhes');
                            }}
                            className="text-[#0F4C3A] dark:text-emerald-400 font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            <span>Detalhes</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISÃO 2: WIZARD DTRP (TEMPLATE 3) */}
      {viewMode === 'novo-manifesto' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('pauta')}
                className="text-xs"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Voltar aos Manifestos</span>
              </Button>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                  F-DIFIS-DTRP-045
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  Requerimento de Declaração de Transporte de Resíduos
                </h2>
              </div>
            </div>
          </div>

          <FilamentWizard
            steps={wizardSteps}
            currentStep={wizardStep}
            onStepClick={(step) => setWizardStep(step)}
          />

          {wizardStep === 1 && (
            <Section title="1. Dados do Gerador e Destinador Final" icon={<Building2 className="w-4 h-4 text-[#0F4C3A]" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWrapper label="Razão Social do Gerador" required>
                  <input type="text" defaultValue="Petroquímica Camaçari S.A." className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
                <InputWrapper label="Licença de Operação do Gerador (LO)" required>
                  <input type="text" defaultValue="Portaria INEMA nº 2024/0912-LO" className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
                <InputWrapper label="Empresa Destinadora Autorizada" required>
                  <input type="text" defaultValue="Cetrel S.A. Tratamento de Efluentes e Resíduos" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
                <InputWrapper label="Método de Destinação Final" required>
                  <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option>Incineração Térmica Controlada</option>
                    <option>Co-processamento em Fornos de Clínquer</option>
                    <option>Aterro Industrial de Resíduos Perigosos (Classe I)</option>
                    <option>Rerrefino de Óleos Minerais</option>
                  </select>
                </InputWrapper>
              </div>
            </Section>
          )}

          {wizardStep === 2 && (
            <Section title="2. Classificação Técnica do Resíduo" icon={<AlertTriangle className="w-4 h-4 text-[#0F4C3A]" />}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputWrapper label="Código ONU" required>
                  <input type="text" defaultValue="ONU 1993" className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
                <InputWrapper label="Classe de Risco" required>
                  <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option>Classe 3 — Líquidos Inflamáveis</option>
                    <option>Classe 8 — Substâncias Corrosivas</option>
                    <option>Classe 9 — Substâncias Perigosas Diversas</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Volume / Peso Total" required>
                  <input type="text" defaultValue="14.500 kg" className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
              </div>
            </Section>
          )}

          {wizardStep === 3 && (
            <Section title="3. Veículo Transportador e Motorista" icon={<Truck className="w-4 h-4 text-[#0F4C3A]" />}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputWrapper label="Placa do Cavalo / Veículo" required>
                  <input type="text" defaultValue="BRA-2E19" className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
                <InputWrapper label="Certificado CIPP do Tanque" required>
                  <input type="text" defaultValue="CIPP-BA-991823" className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
                <InputWrapper label="Condutor Habilitado com MOPP" required>
                  <input type="text" defaultValue="Marcos Vinicius Ribeiro (CNH 0491823910)" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
              </div>
            </Section>
          )}

          {wizardStep === 4 && (
            <Section title="4. Rota Rodoviária e Apólice de Seguro" icon={<ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWrapper label="Trajeto Rodoviário Principal" required>
                  <input type="text" defaultValue="BA-093 km 12 ➔ BR-324 ➔ BA-522" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
                <InputWrapper label="Apólice de Seguro Ambiental (RCTR-C)" required>
                  <input type="text" defaultValue="Porto Seguro Ambiental Nº 991.241.902" className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
              </div>
            </Section>
          )}

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={wizardStep === 1}
              onClick={() => setWizardStep((s) => s - 1)}
            >
              Voltar Etapa
            </Button>
            {wizardStep < 4 ? (
              <Button
                size="sm"
                onClick={() => setWizardStep((s) => s + 1)}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
              >
                Avançar Etapa
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  alert('Manifesto DTRP emitido com sucesso!');
                  setViewMode('pauta');
                }}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
              >
                Emitir Manifesto DTRP Oficial
              </Button>
            )}
          </div>
        </div>
      )}

      {/* VISÃO 3: DETALHES COM QR CODE (TEMPLATE 4) */}
      {viewMode === 'detalhes' && selectedManifesto && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setViewMode('pauta')}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Voltar à Pauta</span>
              </Button>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                {selectedManifesto.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setPdfData({
                    tipo: 'DTRP',
                    titulo: 'Declaração de Transporte de Resíduos Perigosos (DTRP)',
                    codigoDocumento: selectedManifesto.id,
                    interessado: `${selectedManifesto.gerador} / ${selectedManifesto.transportador}`,
                    cpfCnpj: '00.123.456/0001-89',
                    dataEmissao: selectedManifesto.dataEmissao,
                    validade: selectedManifesto.validade,
                    autenticidadeToken: 'DTRP-AUT-9921-X81',
                    status: 'Válido',
                  });
                  setPdfDrawerOpen(true);
                }}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                <span>Visualizar PDF Timbrado</span>
              </Button>
              <Badge variant={selectedManifesto.statusColor as any}>{selectedManifesto.status}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Section title="Dados da Carga e Rota">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Resíduo:</span>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{selectedManifesto.residuo}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Volume:</span>
                    <p className="font-mono font-semibold text-[#0F4C3A]">{selectedManifesto.quantidade}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Origem ➔ Destino:</span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{selectedManifesto.origemDestino}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Veículo:</span>
                    <p className="font-mono text-slate-900 dark:text-slate-100">{selectedManifesto.placa}</p>
                  </div>
                </div>
              </Section>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center">
              <QrCode className="w-32 h-32 text-slate-900 dark:text-slate-100 mb-3" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">QR Code de Fiscalização</span>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Apresente este código à fiscalização da Polícia Rodoviária e agentes do INEMA na via.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Drawer / Modal Oficial de Pré-Visualização PDF */}
      <PdfPreviewDrawer
        open={pdfDrawerOpen}
        onOpenChange={setPdfDrawerOpen}
        data={pdfData}
      />
    </div>
  );
};
