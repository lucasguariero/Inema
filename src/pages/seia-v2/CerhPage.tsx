import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Calendar,
  Layers,
  Building2,
  MapPin,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  HelpCircle,
  Eye,
  FileText,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { FilamentWizard, Step } from '@/components/filament/Wizard';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface CerhPageProps {
  onNavigate?: (route: string) => void;
}

export const CerhPage: React.FC<CerhPageProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'pauta' | 'novo-cadastro' | 'detalhes'>('pauta');
  const [activeTab, setActiveTab] = useState('declaracoes');
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedProcesso, setSelectedProcesso] = useState<any>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroBacia, setFiltroBacia] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const tabs: FilamentTabItem[] = [
    { id: 'declaracoes', label: 'Declarações CERH', badge: '1.420', badgeVariant: 'primary' },
    { id: 'outorgas', label: 'Pauta de Outorgas', badge: '84', badgeVariant: 'warning' },
    { id: 'monitoramento', label: 'Monitoramento & Poços', badge: '210', badgeVariant: 'gray' },
  ];

  const wizardSteps: Step[] = [
    { id: 1, label: 'Empreendimento & Bacia', description: 'Localização e bacia hidrográfica' },
    { id: 2, label: 'Interferência Hídrica', description: 'Captação, poço ou lançamento' },
    { id: 3, label: 'Vazão & Finalidade', description: 'Regime de vazão e volumes' },
    { id: 4, label: 'Documentos & ART', description: 'Estudos e responsabilidade técnica' },
  ];

  const declaracoesMock = [
    {
      id: 'CERH-2026-00891',
      interessado: 'Agropecuária Vale Verde S.A.',
      documento: '04.892.112/0001-90',
      bacia: 'Bacia do Rio São Francisco',
      rio: 'Rio Grande / Aquífero Urucuia',
      tipo: 'Captação Subterrânea (Poço Tubular)',
      vazao: '45,00 m³/h',
      finalidade: 'Irrigação de Pivô Central',
      status: 'Outorgado',
      statusColor: 'success',
      data: '24/09/2026',
      sla: 'Em dia',
    },
    {
      id: 'CERH-2026-00742',
      interessado: 'Mineração Serra do Ouro Ltda.',
      documento: '12.441.908/0001-33',
      bacia: 'Bacia do Rio Paraguaçu',
      rio: 'Rio Paraguaçu',
      tipo: 'Captação Superficial',
      vazao: '120,00 m³/h',
      finalidade: 'Processamento Mineral',
      status: 'Em Análise Técnica',
      statusColor: 'warning',
      data: '18/09/2026',
      sla: 'SLA: 6 dias',
    },
    {
      id: 'CERH-2026-00615',
      interessado: 'Cooperativa de Produtores do Oeste',
      documento: '33.910.221/0001-05',
      bacia: 'Bacia do Rio de Contas',
      rio: 'Rio de Contas',
      tipo: 'Lançamento de Efluentes Tratados',
      vazao: '15,00 m³/h',
      finalidade: 'Agroindústria de Frutas',
      status: 'Dispensa de Outorga',
      statusColor: 'info',
      data: '11/09/2026',
      sla: 'Emitida',
    },
    {
      id: 'CERH-2026-00430',
      interessado: 'Fazenda Santa Helena Agro',
      documento: '22.189.774/0002-14',
      bacia: 'Bacia do Rio Itapicuru',
      rio: 'Aquífero Bambuí',
      tipo: 'Captação Subterrânea (Poço Tubular)',
      vazao: '18,50 m³/h',
      finalidade: 'Dessedentação Animal',
      status: 'Outorgado',
      statusColor: 'success',
      data: '02/09/2026',
      sla: 'Em dia',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb Padrão */}
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Regulação' },
          { label: 'Recursos Hídricos / CERH', route: viewMode !== 'pauta' ? 'cerh' : undefined },
          ...(viewMode === 'novo-cadastro' ? [{ label: 'Nova Declaração CERH' }] : []),
          ...(viewMode === 'detalhes' ? [{ label: selectedProcesso?.id || 'Ficha CERH' }] : []),
        ]}
        onNavigate={onNavigate}
      />

      {/* VISÃO 1: PAUTA OPERACIONAL CERH */}
      {viewMode === 'pauta' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header da Página */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Cadastro Estadual de Recursos Hídricos (CERH)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Gestão integrada de captações subterrâneas, superficiais, lançamentos de efluentes e outorgas de água.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-9"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>Exportar Base</span>
              </Button>
              <Button
                onClick={() => {
                  setViewMode('novo-cadastro');
                  setWizardStep(1);
                }}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>+ Nova Declaração / Outorga</span>
              </Button>
            </div>
          </div>

          {/* KPIs de Recursos Hídricos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Volume Outorgado Anual"
              value="12.4M m³"
              trend="+8.2% vs 2025"
              trendType="up"
              icon={Droplets}
              chartData={[30, 42, 55, 60, 72, 85, 94]}
            />
            <KpiCard
              title="Poços Subterrâneos"
              value="842"
              trend="68% Bacia São Francisco"
              trendType="neutral"
              icon={MapPin}
              chartData={[12, 18, 25, 30, 42, 50, 68]}
            />
            <KpiCard
              title="Captações Superficiais"
              value="578"
              trend="Rios e Barramentos"
              trendType="neutral"
              icon={Compass}
              chartData={[20, 22, 28, 35, 40, 48, 55]}
            />
            <KpiCard
              title="Outorgas Pendentes"
              value="84"
              trend="SLA Médio: 18 dias"
              trendType="down"
              icon={Clock}
              chartData={[45, 40, 35, 30, 28, 22, 18]}
            />
          </div>

          {/* Abas de Contexto */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            <FilamentTabs
              items={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {/* Tabela de Declarações CERH */}
          <TableContainer
            toolbar={
              <TableToolbar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar por protocolo CERH, interessado, CPF/CNPJ ou rio..."
                activeFilterCount={(filtroBacia !== 'todas' ? 1 : 0) + (filtroTipo !== 'todos' ? 1 : 0)}
                filters={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Bacia Hidrográfica
                      </label>
                      <select
                        value={filtroBacia}
                        onChange={(e) => setFiltroBacia(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                      >
                        <option value="todas">Todas as Bacias Hidrográficas</option>
                        <option value="sf">Bacia do Rio São Francisco (RPGA)</option>
                        <option value="paraguacu">Bacia do Rio Paraguaçu</option>
                        <option value="contas">Bacia do Rio de Contas</option>
                        <option value="itapicuru">Bacia do Rio Itapicuru</option>
                        <option value="leste">Bacias do Recôncavo e Leste</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Tipo de Interferência
                      </label>
                      <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                      >
                        <option value="todos">Todos os Tipos de Interferência</option>
                        <option value="subterranea">Captação Subterrânea (Poço)</option>
                        <option value="superficial">Captação Superficial</option>
                        <option value="efluente">Lançamento de Efluentes</option>
                        <option value="barragem">Barramento / Canal</option>
                      </select>
                    </div>
                  </div>
                }
                actions={
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    <span>Exportar</span>
                  </Button>
                }
              />
            }
            pagination={
              <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Exibindo {declaracoesMock.length} de 1.420 declarações</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="xs" disabled>Anterior</Button>
                  <Button variant="outline" size="xs" className="bg-[#0F4C3A] text-white">1</Button>
                  <Button variant="outline" size="xs">2</Button>
                  <Button variant="outline" size="xs">3</Button>
                  <Button variant="outline" size="xs">Próxima</Button>
                </div>
              </div>
            }
          >
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <th className="py-3 px-4">Protocolo CERH</th>
                  <th className="py-3 px-4">Interessado / CPF-CNPJ</th>
                  <th className="py-3 px-4">Bacia & Manancial</th>
                  <th className="py-3 px-4">Tipo de Interferência</th>
                  <th className="py-3 px-4">Vazão & Finalidade</th>
                  <th className="py-3 px-4">Status & SLA</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {declaracoesMock
                  .filter(
                    (row) =>
                      !searchTerm ||
                      row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      row.interessado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      row.documento.includes(searchTerm) ||
                      row.rio.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {row.id}
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">{row.data}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{row.interessado}</div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{row.documento}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{row.bacia}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{row.rio}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                          {row.tipo}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">{row.vazao}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{row.finalidade}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge color={row.statusColor as any} dot size="xs">
                          {row.status}
                        </Badge>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">{row.sla}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setSelectedProcesso(row);
                            setViewMode('detalhes');
                          }}
                          className="text-[#0F4C3A] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Detalhes</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </TableContainer>
        </div>
      )}

      {/* VISÃO 2: NOVO CADASTRO / WIZARD (TEMPLATE 3) */}
      {viewMode === 'novo-cadastro' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header do Documento Oficial */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('pauta')}
                className="text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Voltar à Pauta</span>
              </Button>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                    F-DIPRE-CERH-01
                  </span>
                  <Badge variant="warning" className="text-[10px]">Em Preenchimento</Badge>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  Declaração de Recursos Hídricos & Pedido de Outorga
                </h2>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Salvar Rascunho
            </Button>
          </div>

          {/* Stepper Oficial com Chevron SVG */}
          <FilamentWizard
            steps={wizardSteps}
            currentStep={wizardStep}
            onStepClick={(step) => setWizardStep(step)}
          />

          {/* ETAPA 1: EMPREENDIMENTO E BACIA */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <Section
                title="1. Identificação do Requerente e Imóvel"
                icon={<Building2 className="w-4 h-4 text-[#0F4C3A]" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputWrapper label="Nome / Razão Social do Requerente" required>
                    <input
                      type="text"
                      defaultValue="Agropecuária Vale Verde S.A."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                  <InputWrapper label="CPF ou CNPJ" required>
                    <input
                      type="text"
                      defaultValue="04.892.112/0001-90"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                  <InputWrapper label="Nome do Empreendimento / Fazenda" required>
                    <input
                      type="text"
                      placeholder="Ex: Fazenda Boa Esperança - Gleba A"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                  <InputWrapper label="Número do CEFIR / CAR Estadual">
                    <input
                      type="text"
                      placeholder="BA-2903201-98AF234190"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                </div>
              </Section>

              <Section
                title="2. Enquadramento Hidrográfico e Município"
                icon={<MapPin className="w-4 h-4 text-[#0F4C3A]" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputWrapper label="Bacia Hidrográfica (RPGA)" required>
                    <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <option>Bacia do Rio São Francisco</option>
                      <option>Bacia do Rio Paraguaçu</option>
                      <option>Bacia do Rio de Contas</option>
                    </select>
                  </InputWrapper>
                  <InputWrapper label="Município da Captação" required>
                    <input
                      type="text"
                      defaultValue="Barreiras"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                  <InputWrapper label="Coordenadas Geográficas (SIRGAS 2000)" required>
                    <input
                      type="text"
                      placeholder="-12.148500, -45.002100"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                </div>
              </Section>
            </div>
          )}

          {/* ETAPA 2: INTERFERÊNCIA HÍDRICA */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <Section
                title="Tipo e Detalhes da Interferência"
                icon={<Droplets className="w-4 h-4 text-[#0F4C3A]" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputWrapper label="Modalidade de Interferência *" required>
                    <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <option>Captação Subterrânea (Poço Tubular)</option>
                      <option>Captação Superficial Direta (Rio / Riacho)</option>
                      <option>Barramento com Regularização de Vazão</option>
                      <option>Lançamento de Efluentes Tratados</option>
                    </select>
                  </InputWrapper>
                  <InputWrapper label="Nome do Corpo Hídrico / Aquífero *" required>
                    <input
                      type="text"
                      defaultValue="Aquífero Urucuia / Rio de Ondas"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                  <InputWrapper label="Profundidade do Poço (metros)">
                    <input
                      type="number"
                      defaultValue="180"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                  <InputWrapper label="Nível Estático / Dinâmico (m)">
                    <input
                      type="text"
                      defaultValue="NE: 32m / ND: 68m"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                </div>
              </Section>
            </div>
          )}

          {/* ETAPA 3: VAZÃO E FINALIDADE */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <Section
                title="Regime de Uso e Finalidades da Água"
                icon={<Clock className="w-4 h-4 text-[#0F4C3A]" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputWrapper label="Finalidade Principal *" required>
                    <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <option>Irrigação Agrícola (Pivô / Gotejamento)</option>
                      <option>Consumo Humano / Abastecimento Público</option>
                      <option>Industrial e Transformação</option>
                      <option>Dessedentação Animal</option>
                    </select>
                  </InputWrapper>
                  <InputWrapper label="Vazão Máxima Instantânea (m³/h) *" required>
                    <input
                      type="text"
                      defaultValue="45.00"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                  <InputWrapper label="Horas de Operação por Dia (h/dia) *" required>
                    <input
                      type="number"
                      defaultValue="16"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                </div>
              </Section>
            </div>
          )}

          {/* ETAPA 4: DOCUMENTOS E ART */}
          {wizardStep === 4 && (
            <div className="space-y-4">
              <Section
                title="Responsabilidade Técnica e Anexos"
                icon={<FileCheck className="w-4 h-4 text-[#0F4C3A]" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputWrapper label="Nome do Responsável Técnico *" required>
                    <input
                      type="text"
                      defaultValue="Eng. Carlos Eduardo Pinheiro (CREA-BA 19.824-D)"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                  <InputWrapper label="Número da ART / RRT *" required>
                    <input
                      type="text"
                      defaultValue="ART-BA-2026-9912048"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </InputWrapper>
                </div>

                <div className="mt-4 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800/40">
                  <FileText className="w-8 h-8 text-[#0F4C3A] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Anexar Teste de Bombeamento e Perfil Construtivo do Poço (.pdf)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Limite máximo de 25MB por arquivo</p>
                </div>
              </Section>
            </div>
          )}

          {/* Rodapé de Ações do Wizard */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={wizardStep === 1}
              onClick={() => setWizardStep((s) => s - 1)}
              className="text-xs"
            >
              Voltar Etapa
            </Button>

            {wizardStep < 4 ? (
              <Button
                size="sm"
                onClick={() => setWizardStep((s) => s + 1)}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold"
              >
                Avançar Etapa
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  alert('Declaração CERH enviada com sucesso!');
                  setViewMode('pauta');
                }}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold"
              >
                Finalizar e Emitir Declaração CERH
              </Button>
            )}
          </div>
        </div>
      )}

      {/* VISÃO 3: FICHA DETALHADA COM ABAS (TEMPLATE 4) */}
      {viewMode === 'detalhes' && selectedProcesso && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('pauta')}
                className="text-xs text-slate-600 dark:text-slate-300"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Voltar à Pauta</span>
              </Button>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                  {selectedProcesso.id}
                </span>
                <span className="text-xs text-slate-500 ml-2">• {selectedProcesso.interessado}</span>
              </div>
            </div>
            <Badge variant={selectedProcesso.statusColor as any}>
              {selectedProcesso.status}
            </Badge>
          </div>

          <Section title="Dados da Outorga / Interferência Hídrica">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Bacia Hidrográfica:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selectedProcesso.bacia}</p>
              </div>
              <div>
                <span className="text-slate-500">Manancial / Aquífero:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selectedProcesso.rio}</p>
              </div>
              <div>
                <span className="text-slate-500">Vazão Autorizada:</span>
                <p className="font-mono font-semibold text-[#0F4C3A] mt-0.5">{selectedProcesso.vazao}</p>
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
};
