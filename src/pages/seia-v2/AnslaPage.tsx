import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  ArrowLeft,
  Search,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building2,
  HelpCircle,
  Eye,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { FilamentWizard, Step } from '@/components/filament/Wizard';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface AnslaPageProps {
  onNavigate?: (route: string) => void;
}

export const AnslaPage: React.FC<AnslaPageProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'pauta' | 'novo-enquadramento'>('pauta');
  const [activeTab, setActiveTab] = useState('declaracoes');
  const [searchTerm, setSearchTerm] = useState('');
  const [wizardStep, setWizardStep] = useState(1);

  const tabs: FilamentTabItem[] = [
    { id: 'declaracoes', label: 'Declarações Emitidas', badge: '3.890', badgeVariant: 'primary' },
    { id: 'catalogo', label: 'Tipologias Dispensadas', badge: '42 itens', badgeVariant: 'gray' },
  ];

  const wizardSteps: Step[] = [
    { id: 1, label: 'Identificação', description: 'Requerente e imóvel' },
    { id: 2, label: 'Critérios de Dispensa', description: 'Questionário de impacto' },
    { id: 3, label: 'Emissão da Declaração', description: 'Certificado oficial imediato' },
  ];

  const anslaMock = [
    {
      id: 'ANSLA-2026-00912',
      requerente: 'Cooperativa Agrícola do Vale do Irecê',
      tipologia: 'Silos e Armazéns de Grãos até 10.000 t',
      municipio: 'Irecê/BA',
      dataEmissao: '29/09/2026',
      status: 'Dispensado de Licença',
      statusColor: 'success',
    },
    {
      id: 'ANSLA-2026-00845',
      requerente: 'Energia Limpa Nordeste Ltda.',
      tipologia: 'Usinas Solares Fotovoltaicas em Telhados',
      municipio: 'Feira de Santana/BA',
      dataEmissao: '25/09/2026',
      status: 'Dispensado de Licença',
      statusColor: 'success',
    },
  ];

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Atividades Não Sujeitas a Licenciamento', route: 'ansla' },
          { label: 'Dispensa ANSLA' },
        ]}
        onNavigate={onNavigate}
      />

      {viewMode === 'pauta' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Atividades Não Sujeitas a Licenciamento (ANSLA)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Declaração automatizada de inexigibilidade e dispensa de licenciamento para atividades de baixo impacto.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                onClick={() => {
                  setViewMode('novo-enquadramento');
                  setWizardStep(1);
                }}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>+ Nova Declaração de Dispensa</span>
              </Button>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-800">
            <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {activeTab === 'declaracoes' && (
            <TableContainer
              toolbar={
                <TableToolbar
                  searchValue={searchTerm}
                  onSearchChange={setSearchTerm}
                  searchPlaceholder="Buscar por protocolo, requerente, tipologia ou município..."
                  actions={
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      <span>Exportar Lista</span>
                    </Button>
                  }
                />
              }
            >
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    <th className="py-3 px-4">Protocolo ANSLA</th>
                    <th className="py-3 px-4">Requerente</th>
                    <th className="py-3 px-4">Tipologia / Atividade</th>
                    <th className="py-3 px-4">Município</th>
                    <th className="py-3 px-4">Data de Emissão</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {anslaMock
                    .filter(
                      (row) =>
                        !searchTerm ||
                        row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        row.requerente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        row.tipologia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        row.municipio.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                          {row.id}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{row.requerente}</td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{row.tipologia}</td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{row.municipio}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">{row.dataEmissao}</td>
                        <td className="py-3.5 px-4">
                          <Badge color={row.statusColor as any} dot size="xs">
                            {row.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button variant="ghost" size="xs" className="text-[#0F4C3A] dark:text-emerald-400">
                            <Download className="w-3.5 h-3.5 mr-1" />
                            <span>Certificado</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </TableContainer>
          )}

          {activeTab === 'catalogo' && (
            <TableContainer
              toolbar={
                <TableToolbar
                  searchValue={searchTerm}
                  onSearchChange={setSearchTerm}
                  searchPlaceholder="Buscar por tipologia, enquadramento ou base legal..."
                  actions={
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      <span>Baixar Catálogo Oficial</span>
                    </Button>
                  }
                />
              }
            >
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    <th className="py-3 px-4">Código / Item</th>
                    <th className="py-3 px-4">Tipologia / Atividade</th>
                    <th className="py-3 px-4">Critério de Dispensa & Limites</th>
                    <th className="py-3 px-4">Fundamento Legal</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    {
                      id: 'DISP-001',
                      nome: 'Silos e Armazéns de Grãos até 10.000 t',
                      criterio: 'Capacidade estática total inferior a 10.000 toneladas, sem queima de biomassa',
                      baseLegal: 'Decreto Estadual nº 14.024/2012, Art. 8º',
                      status: 'Dispensada de Licença',
                    },
                    {
                      id: 'DISP-002',
                      nome: 'Usinas Fotovoltaicas em Telhados / Coberturas',
                      criterio: 'Instalação predial sem ampliação de área de solo nem supressão vegetal',
                      baseLegal: 'Resolução CEPRAM nº 4.570/2017',
                      status: 'Dispensada de Licença',
                    },
                    {
                      id: 'DISP-003',
                      nome: 'Manutenção de Estradas Vicinais Rurais',
                      criterio: 'Sem alargamento de faixa de domínio e sem movimentação de terra > 500 m³',
                      baseLegal: 'Portaria INEMA nº 19.822/2021',
                      status: 'Dispensada de Licença',
                    },
                    {
                      id: 'DISP-004',
                      nome: 'Piscicultura Familiar em Tanque-Rede',
                      criterio: 'Volume útil de até 1.000 m³ em corpos d’água públicos ou privados',
                      baseLegal: 'Instrução Normativa Conjunta SEMA/INEMA nº 02/2020',
                      status: 'Dispensada de Licença',
                    },
                  ].map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {cat.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{cat.nome}</td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{cat.criterio}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">{cat.baseLegal}</td>
                      <td className="py-3.5 px-4">
                        <Badge color="success" dot size="xs">
                          {cat.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableContainer>
          )}
        </div>
      )}

      {viewMode === 'novo-enquadramento' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setViewMode('pauta')} className="text-xs">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Voltar à Pauta ANSLA</span>
            </Button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Formulário de Inexigibilidade e Dispensa de Licenciamento
            </span>
          </div>

          <FilamentWizard steps={wizardSteps} currentStep={wizardStep} onStepClick={setWizardStep} />

          {wizardStep === 1 && (
            <Section title="1. Seleção da Atividade Dispensada" icon={<Building2 className="w-4 h-4 text-[#0F4C3A]" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWrapper label="Tipologia da Atividade *" required>
                  <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option>Silos e Armazéns de Grãos até 10.000 t</option>
                    <option>Usinas Solares Fotovoltaicas em Telhados / Coberturas</option>
                    <option>Manutenção Periódica de Estradas Vicinais Sem Supressão</option>
                    <option>Agroindústria Familiar de Polpa de Frutas</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Município de Instalação *" required>
                  <input type="text" defaultValue="Irecê" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
              </div>
            </Section>
          )}

          {wizardStep === 2 && (
            <Section title="2. Critérios de Não-Incidência Ambiental" icon={<CheckCircle2 className="w-4 h-4 text-[#0F4C3A]" />}>
              <div className="space-y-3 text-xs">
                <label className="flex items-center gap-2 p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <input type="checkbox" defaultChecked className="rounded text-[#0F4C3A]" />
                  <span>A atividade não realizará supressão de vegetação nativa (ASV).</span>
                </label>
                <label className="flex items-center gap-2 p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <input type="checkbox" defaultChecked className="rounded text-[#0F4C3A]" />
                  <span>A atividade não está localizada em Área de Preservação Permanente (APP) ou Unidade de Conservação.</span>
                </label>
                <label className="flex items-center gap-2 p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <input type="checkbox" defaultChecked className="rounded text-[#0F4C3A]" />
                  <span>A atividade não ultrapassa os limites de porte previstos no Decreto Estadual nº 14.024/2012.</span>
                </label>
              </div>
            </Section>
          )}

          {wizardStep === 3 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 p-8 rounded-xl text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100">Atividade Enquadrada como Não Sujeita a Licenciamento</h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                Sua declaração foi processada com sucesso. O certificado oficial de dispensa possui fé pública e validade indeterminada.
              </p>
              <Button onClick={() => setViewMode('pauta')} className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold">
                Emitir Declaração de Dispensa (PDF)
              </Button>
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
