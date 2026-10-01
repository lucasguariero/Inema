import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  ArrowLeft,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { FilamentWizard, Step } from '@/components/filament/Wizard';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';
import { PdfPreviewDrawer, PdfDocumentData } from '@/components/seia-v2/PdfPreviewDrawer';

interface ParcelamentoDebitoPageProps {
  onNavigate?: (route: string) => void;
}

export const ParcelamentoDebitoPage: React.FC<ParcelamentoDebitoPageProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'pauta' | 'novo-parcelamento'>('pauta');
  const [activeTab, setActiveTab] = useState('ativos');
  const [searchTerm, setSearchTerm] = useState('');
  const [wizardStep, setWizardStep] = useState(1);
  const [numeroParcelas, setNumeroParcelas] = useState(24);
  const [pdfDrawerOpen, setPdfDrawerOpen] = useState(false);
  const [pdfData, setPdfData] = useState<PdfDocumentData | null>(null);

  const valorTotalDebito = 48000.0;
  const valorParcela = (valorTotalDebito / numeroParcelas).toFixed(2);

  const tabs: FilamentTabItem[] = [
    { id: 'ativos', label: 'Parcelamentos em Dia', badge: '142', badgeVariant: 'success' },
    { id: 'atraso', label: 'Parcelas em Atraso', badge: '19', badgeVariant: 'danger' },
    { id: 'quitados', label: 'Quitados', badge: '610', badgeVariant: 'gray' },
  ];

  const wizardSteps: Step[] = [
    { id: 1, label: 'Seleção dos Débitos', description: 'Autos de infração e multas' },
    { id: 2, label: 'Simulação do Plano', description: 'Parcelas e vencimentos' },
    { id: 3, label: 'Confissão de Dívida', description: 'Assinatura e carnê DAE' },
  ];

  const contratosMock = [
    {
      id: 'PARC-2026-0089',
      requerente: 'Agropecuária Vale do São Francisco Ltda.',
      cnpj: '12.345.678/0001-90',
      autoInfracao: '2025/0812-AI',
      valorTotal: 'R$ 48.000,00',
      plano: '06 / 24 parcelas',
      valorParcela: 'R$ 2.000,00',
      vencimento: '10/10/2026',
      status: 'Em Dia',
      statusColor: 'success',
      categoria: 'ativos',
    },
    {
      id: 'PARC-2026-0045',
      requerente: 'Cerâmica Santa Luzia Eireli',
      cnpj: '08.192.831/0001-44',
      autoInfracao: '2024/1102-AI',
      valorTotal: 'R$ 72.000,00',
      plano: '14 / 36 parcelas',
      valorParcela: 'R$ 2.000,00',
      vencimento: 'Atrasado (12 dias)',
      status: 'Parcela em Atraso',
      statusColor: 'danger',
      categoria: 'atraso',
    },
    {
      id: 'PARC-2025-0012',
      requerente: 'Mineração Morro Dourado S.A.',
      cnpj: '33.411.092/0001-18',
      autoInfracao: '2023/0419-AI',
      valorTotal: 'R$ 120.000,00',
      plano: '24 / 24 parcelas',
      valorParcela: 'R$ 5.000,00',
      vencimento: 'Quitado em 15/08/2026',
      status: 'Quitado',
      statusColor: 'gray',
      categoria: 'quitados',
    },
  ];

  const filteredContratos = contratosMock.filter((c) => {
    if (activeTab === 'ativos' && c.categoria !== 'ativos') return false;
    if (activeTab === 'atraso' && c.categoria !== 'atraso') return false;
    if (activeTab === 'quitados' && c.categoria !== 'quitados') return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.id.toLowerCase().includes(term) ||
      c.requerente.toLowerCase().includes(term) ||
      c.cnpj.includes(term) ||
      c.autoInfracao.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Financeiro', route: 'parcelamento' },
          { label: 'Parcelamento de Débitos' },
        ]}
        onNavigate={onNavigate}
      />

      {viewMode === 'pauta' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Parcelamento de Débitos & Multas Ambientais
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Acordos de confissão de dívida, simulação de parcelas em até 60x e emissão de carnê de DAEs.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                onClick={() => {
                  setViewMode('novo-parcelamento');
                  setWizardStep(1);
                }}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>+ Novo Acordo de Parcelamento</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              title="Valor em Parcelamento"
              value="R$ 3.84M"
              trend="142 acordos ativos"
              trendType="up"
              icon={DollarSign}
              chartData={[20, 24, 28, 30, 32, 35, 38]}
            />
            <KpiCard
              title="Arrecadação Mensal DAE"
              value="R$ 412k"
              trend="94.2% adimplência"
              trendType="up"
              icon={CreditCard}
              chartData={[300, 320, 350, 380, 395, 410, 412]}
            />
            <KpiCard
              title="Contratos Quitados"
              value="610"
              trend="Baixa definitiva concedida"
              trendType="neutral"
              icon={CheckCircle2}
              chartData={[40, 45, 50, 52, 55, 58, 61]}
            />
          </div>

          <div className="border-b border-slate-200 dark:border-slate-800">
            <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <TableContainer
            toolbar={
              <TableToolbar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar por contrato, contribuinte, CNPJ ou auto de infração..."
                actions={
                  <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                    <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Exportar Extrato (CSV)
                  </Button>
                }
              />
            }
          >
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <th className="py-3 px-4">Termo / Acordo</th>
                  <th className="py-3 px-4">Contribuinte / CNPJ</th>
                  <th className="py-3 px-4">Origem / Auto de Infração</th>
                  <th className="py-3 px-4">Valor Consolidado</th>
                  <th className="py-3 px-4">Plano & Parcela</th>
                  <th className="py-3 px-4">Situação</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredContratos.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {c.id}
                      <div className="text-[10px] text-slate-400 font-normal">Venc: {c.vencimento}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{c.requerente}</div>
                      <div className="text-[11px] font-mono text-slate-500">{c.cnpj}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {c.autoInfracao}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F4C3A] dark:text-emerald-400">
                      {c.valorTotal}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{c.plano}</div>
                      <div className="text-[11px] text-slate-500">{c.valorParcela} / mês</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color={c.statusColor as any} dot size="xs">
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setPdfData({
                              tipo: 'DAE',
                              titulo: 'Carnê de Parcelamento DAE (Documento de Arrecadação Estadual)',
                              codigoDocumento: c.id,
                              interessado: c.requerente,
                              cpfCnpj: c.cnpj,
                              dataEmissao: '30/09/2026',
                              validade: c.vencimento,
                              autenticidadeToken: 'DAE-BARCODE-PARC-2026',
                              status: 'Emitido',
                            });
                            setPdfDrawerOpen(true);
                          }}
                          className="text-[#0F4C3A] dark:text-emerald-400"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          <span>DAEs</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        </div>
      )}

      {viewMode === 'novo-parcelamento' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setViewMode('pauta')} className="text-xs">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Voltar aos Parcelamentos</span>
            </Button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Termo de Ajuste e Confissão de Dívida
            </span>
          </div>

          <FilamentWizard steps={wizardSteps} currentStep={wizardStep} onStepClick={setWizardStep} />

          {wizardStep === 1 && (
            <Section title="1. Autos de Infração Selecionados" icon={<FileText className="w-4 h-4 text-[#0F4C3A]" />}>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 border rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <strong className="font-mono text-slate-900 dark:text-slate-100">Auto de Infração nº 2025/0812-AI</strong>
                    <p className="text-slate-500 mt-0.5">Supressão vegetal não autorizada em área de cerrado</p>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">R$ 32.000,00</span>
                </div>
                <div className="p-3.5 border rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <strong className="font-mono text-slate-900 dark:text-slate-100">Taxa de Vistoria em Atraso (DAE-8812)</strong>
                    <p className="text-slate-500 mt-0.5">Vistoria técnica da regional Oeste</p>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">R$ 16.000,00</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex justify-between font-bold text-emerald-950 dark:text-emerald-300">
                  <span>Valor Total Consolidado do Débito:</span>
                  <span className="font-mono">R$ 48.000,00</span>
                </div>
              </div>
            </Section>
          )}

          {wizardStep === 2 && (
            <Section title="2. Simulação do Plano de Pagamento" icon={<CreditCard className="w-4 h-4 text-[#0F4C3A]" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWrapper label="Número de Parcelas Desejado *" required>
                  <select
                    value={numeroParcelas}
                    onChange={(e) => setNumeroParcelas(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value={6}>6 parcelas</option>
                    <option value={12}>12 parcelas</option>
                    <option value={24}>24 parcelas (Recomendado)</option>
                    <option value={36}>36 parcelas</option>
                    <option value={48}>48 parcelas</option>
                    <option value={60}>60 parcelas (Máximo Legal)</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Dia de Vencimento Mensal *" required>
                  <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option>Dia 10 de cada mês</option>
                    <option>Dia 20 de cada mês</option>
                    <option>Dia 30 de cada mês</option>
                  </select>
                </InputWrapper>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Valor Estimado de Cada Parcela:</span>
                  <p className="font-mono text-lg font-bold text-[#0F4C3A]">R$ {valorParcela} / mês</p>
                </div>
                <Badge color="success" dot size="xs">Sem juros moratórios adicionais no plano padrão</Badge>
              </div>
            </Section>
          )}

          {wizardStep === 3 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 p-8 rounded-2xl text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100">Acordo de Parcelamento Gerado com Sucesso!</h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                O Termo de Compromisso e Confissão de Dívida e o carnê de DAEs em <strong>{numeroParcelas}x de R$ {valorParcela}</strong> estão disponíveis para download e pagamento.
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPdfData({
                      tipo: 'CONFISSAO_DIVIDA',
                      titulo: 'Termo de Compromisso e Confissão de Dívida Ambiental',
                      codigoDocumento: 'TCD-INEMA-2026-0089',
                      interessado: 'Agropecuária Vale do São Francisco Ltda.',
                      cpfCnpj: '12.345.678/0001-90',
                      dataEmissao: new Date().toLocaleDateString('pt-BR'),
                      validade: `Plano em ${numeroParcelas} meses`,
                      autenticidadeToken: 'TCD-CONF-2026-9921',
                      status: 'Aprovado',
                    });
                    setPdfDrawerOpen(true);
                  }}
                >
                  <FileText className="w-4 h-4 mr-1.5" />
                  <span>Visualizar Termo Assinado (.pdf)</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setPdfData({
                      tipo: 'DAE',
                      titulo: 'Carnê de Parcelamento DAE (Documento de Arrecadação Estadual)',
                      codigoDocumento: `CARNE-DAE-2026-${numeroParcelas}X`,
                      interessado: 'Agropecuária Vale do São Francisco Ltda.',
                      cpfCnpj: '12.345.678/0001-90',
                      dataEmissao: new Date().toLocaleDateString('pt-BR'),
                      validade: `Parcela 01/${numeroParcelas} - Venc. 10/10/2026`,
                      autenticidadeToken: 'DAE-BARCODE-85800000001-4',
                      status: 'Emitido',
                    });
                    setPdfDrawerOpen(true);
                  }}
                  className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  <span>Baixar Carnê de DAEs (.pdf)</span>
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
            <Button variant="outline" size="sm" disabled={wizardStep === 1} onClick={() => setWizardStep((s) => s - 1)}>
              Voltar
            </Button>
            {wizardStep < 3 && (
              <Button size="sm" onClick={() => setWizardStep((s) => s + 1)} className="bg-[#0F4C3A] text-white">
                Avançar
              </Button>
            )}
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
