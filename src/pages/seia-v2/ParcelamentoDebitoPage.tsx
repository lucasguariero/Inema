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
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface ParcelamentoDebitoPageProps {
  onNavigate?: (route: string) => void;
}

export const ParcelamentoDebitoPage: React.FC<ParcelamentoDebitoPageProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'pauta' | 'novo-parcelamento'>('pauta');
  const [activeTab, setActiveTab] = useState('ativos');
  const [wizardStep, setWizardStep] = useState(1);
  const [numeroParcelas, setNumeroParcelas] = useState(24);

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

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Financeiro & Arrecadação', route: 'seia-daes' },
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

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-6 text-center text-xs text-slate-500">
            <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Painel de Contratos de Parcelamento</h3>
            <p className="mt-1">Gerenciamento automatizado de conciliação bancária SEFAZ e alertas de atraso.</p>
          </div>
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
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 flex justify-between font-bold text-emerald-950 dark:text-emerald-300">
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
                <Badge variant="success" className="text-xs">Sem juros moratórios adicionais no plano padrão</Badge>
              </div>
            </Section>
          )}

          {wizardStep === 3 && (
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950">Acordo de Parcelamento Gerado com Sucesso!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                O Termo de Compromisso e Confissão de Dívida e o carnê de DAEs em <strong>{numeroParcelas}x de R$ {valorParcela}</strong> estão disponíveis para download e pagamento.
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm">Baixar Termo Assinado (.pdf)</Button>
                <Button size="sm" onClick={() => setViewMode('pauta')} className="bg-[#0F4C3A] text-white">
                  Baixar Carnê de DAEs (.pdf)
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
    </div>
  );
};
