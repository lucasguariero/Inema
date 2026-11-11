import { DirreRequestTypeSelect } from './DirreRequestTypeSelect';
import { getAtoDetails, dirreRequest, dirreRequestLabel } from '@/data/dirreRequestTypes';
import React, { useRef, useState } from 'react';
import {
  Building2,
  MapPin,
  FileCheck,
  Droplets,
  Trees,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import { FilamentSelect, SelectOption } from '@/components/filament';
import { SeiaV2Breadcrumb } from './SeiaV2Breadcrumb';
import { FilamentWizard } from '@/components/filament/Wizard';
import { SeiaV2PageHeader } from './SeiaV2PageHeader';
import { SeiaV2ConfirmationDialog } from './SeiaV2ConfirmationDialog';
import { SeiaV2Toast } from './SeiaV2Toast';
import { InputWrapper } from '@/components/filament/InputWrapper';

const tipologiaOptions: SelectOption[] = [
  { value: 'Agricultura Irrigada de Grãos e Fibras', label: 'Agricultura Irrigada de Grãos e Fibras' },
  { value: 'Mineração a Céu Aberto e Britagem', label: 'Mineração a Céu Aberto e Britagem' },
  { value: 'Geração de Energia Eólica / Solar Fotovoltaica', label: 'Geração de Energia Eólica / Solar Fotovoltaica' },
  { value: 'Indústria de Alimentos e Bebidas', label: 'Indústria de Alimentos e Bebidas' },
  { value: 'Loteamento e Obras de Urbanização', label: 'Loteamento e Obras de Urbanização' },
];

export interface AtoInfo {
  sigla: string;
  nome: string;
  categoria: string;
  taxaBase: string;
  descricao: string;
  legislacao: string;
}

export const ATOS_CATALOGO: Record<string, AtoInfo> = new Proxy({} as Record<string, AtoInfo>, {
  get: (_target, prop: string) => {
    return getAtoDetails(prop) as AtoInfo | undefined;
  },
});

const tipoCaptacaoOptions: SelectOption[] = [
  { value: 'Subterrânea (Poço Tubular Profundo)', label: 'Subterrânea (Poço Tubular Profundo)' },
  { value: 'Superficial Direta (Rio / Riacho)', label: 'Superficial Direta (Rio / Riacho)' },
  { value: 'Barramento com regularização de vazão', label: 'Barramento com regularização de vazão' },
  { value: 'Canal de Irrigação de Distrito Público', label: 'Canal de Irrigação de Distrito Público' },
];

interface SeiaV2FormularioComplexoPageProps {
  onNavigate?: (route: string) => void;
}

export const SeiaV2FormularioComplexoPage: React.FC<SeiaV2FormularioComplexoPageProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saveToast, setSaveToast] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    cnpj: '14.892.401/0001-92',
    razaoSocial: 'Agropecuária Chapada Sustentável S.A.',
    nomeFantasia: 'Fazenda Santa Maria dos Buritis',
    inscricaoEstadual: '071.294.182-BA',
    municipio: 'Morro do Chapéu',
    distrito: 'Sede Regional',
    latitude: '-11.550278',
    longitude: '-41.156389',
    areaTotal: '4.850,00',
    cefirNumero: 'CEFIR-BA-2921708-2024-00192',

    // Step 2
    tipologia: 'Agricultura Irrigada de Grãos e Fibras',
    porte: 'Grande Porte',
    potencialPoluidor: 'Médio Potencial',
    tipoLicenca: 'licencas-03',
    enquadramentoLegal: 'Classe 5 (Decreto Estadual nº 14.024/2012)',

    // Step 3
    temOutorga: 'sim',
    tipoCaptacao: 'Subterrânea (Poço Tubular Profundo)',
    vazaoDia: '1.200,00',
    temSupressao: 'sim',
    areaSupressao: '145,50',
    bioma: 'Caatinga / Cerrado (Transição)',

    // Step 4
    artNumero: 'ART-BA-2026-0819234',
    nomeRT: 'Eng. Florestal Mariana Dantas Rios',
    creaRT: 'CREA-BA 39.284/D',

    // Step 5
    declaracaoVeracidade: true,
  });

  const initialData = useRef(JSON.stringify(formData));
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const handleNavigateAway = (route: string) => {
    if (!onNavigate || route === 'formulario') return;
    if (JSON.stringify(formData) !== initialData.current) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setPendingRoute(route);
    } else onNavigate(route);
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const steps = [
    { num: 1, label: 'Identificação & Localização' },
    { num: 2, label: 'Enquadramento da Atividade' },
    { num: 3, label: 'Água & Supressão Vegetal' },
    { num: 4, label: 'Documentos & Responsabilidade' },
    { num: 5, label: 'Declarações & Taxas' },
  ];

  return (
    <div className="cotic-form space-y-6">
      {/* Cabeçalho Canônico da Página */}
      <SeiaV2PageHeader
        title="Requerimento Ambiental Unificado"
        subtitle="Formulário demonstrativo para Licenciamento Ambiental, Outorga de Recursos Hídricos e Autorização de Supressão Vegetal (ASV)."
        breadcrumbItems={[
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Requerimentos', route: 'formulario' },
          { label: 'Requerimento Unificado' },
        ]}
        onNavigate={handleNavigateAway}
        backButton={onNavigate ? {
          label: 'Voltar à Pauta',
          onClick: () => handleNavigateAway('tabela'),
        } : undefined}
      />

      {/* ========================================================= */}
      {/* STEPPER WIZARD NATIVO FILAMENT                            */}
      {/* ========================================================= */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <FilamentWizard
          steps={steps.map((step) => ({ id: step.num, label: step.label }))}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
      </div>

      {/* ========================================================= */}
      {/* CORPO DO FORMULÁRIO DENSE UI                              */}
      {/* ========================================================= */}
      <div className={currentStep === 5 ? "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" : "w-full"}>
        {/* Formulário Principal (largura total nas etapas 1-4, 8 colunas na etapa 5) */}
        <div className={currentStep === 5 ? "lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden" : "w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"}>
          <div className="p-6">
          {/* ETAPA 1: IDENTIFICAÇÃO E LOCALIZAÇÃO */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                  Dados Cadastrais do Empreendimento
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4">
                    <InputWrapper label="CNPJ / CPF" required>
                      <input aria-label="CNPJ / CPF"
                        type="text"
                        value={formData.cnpj}
                        onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                        className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-transparent border-0 focus:outline-hidden font-mono"
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-8">
                    <InputWrapper label="Razão Social / Nome Oficial" required>
                      <input aria-label="Razão Social / Nome Oficial"
                        type="text"
                        value={formData.razaoSocial}
                        onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                        className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-transparent border-0 focus:outline-hidden"
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <InputWrapper label="Nome Fantasia do Imóvel / Fazenda">
                      <input aria-label="Nome Fantasia do Imóvel / Fazenda"
                        type="text"
                        value={formData.nomeFantasia}
                        onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                        className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-transparent border-0 focus:outline-hidden"
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <InputWrapper label="Inscrição Estadual (SEFAZ)">
                      <input aria-label="Inscrição Estadual (SEFAZ)"
                        type="text"
                        value={formData.inscricaoEstadual}
                        onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                        className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-transparent border-0 focus:outline-hidden font-mono"
                      />
                    </InputWrapper>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                  Localização e Coordenadas Georreferenciadas (SIRGAS 2000)
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4">
                    <InputWrapper label="Município Polo" required>
                      <input aria-label="Município Polo"
                        type="text"
                        value={formData.municipio}
                        onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                        className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-transparent border-0 focus:outline-hidden"
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <InputWrapper label="Latitude Decimal (SIRGAS 2000)" required>
                      <input aria-label="Latitude Decimal (SIRGAS 2000)"
                        type="text"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-transparent border-0 focus:outline-hidden font-mono"
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <InputWrapper label="Longitude Decimal (SIRGAS 2000)" required>
                      <input aria-label="Longitude Decimal (SIRGAS 2000)"
                        type="text"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-transparent border-0 focus:outline-hidden font-mono"
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <InputWrapper label="Número do Registro CEFIR / CAR" required>
                      <input aria-label="Número do Registro CEFIR / CAR"
                        type="text"
                        value={formData.cefirNumero}
                        onChange={(e) => setFormData({ ...formData, cefirNumero: e.target.value })}
                        className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-transparent border-0 focus:outline-hidden font-mono"
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <InputWrapper label="Área Total do Imóvel (hectares)" required>
                      <input aria-label="Área Total do Imóvel (hectares)"
                        type="text"
                        value={formData.areaTotal}
                        onChange={(e) => setFormData({ ...formData, areaTotal: e.target.value })}
                        className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-transparent border-0 focus:outline-hidden font-mono"
                      />
                    </InputWrapper>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: ENQUADRAMENTO DA ATIVIDADE */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4 space-y-1">
                  <label htmlFor="cotic-field-1" className="text-xs font-semibold text-slate-700 dark:text-slate-200">Tipologia Principal da Atividade *</label>
                  <FilamentSelect id="cotic-field-1"
                    options={tipologiaOptions}
                    value={formData.tipologia}
                    onChange={(v) => setFormData({ ...formData, tipologia: v })}
                  />
                </div>

                <div className="col-span-12 md:col-span-8">
                  <DirreRequestTypeSelect value={formData.tipoLicenca} onChange={v=>setFormData({...formData,tipoLicenca:v})}/>

                </div>

                {/* Card do Ato Selecionado - Descrição Completa para todos os 53 Atos */}
                {(() => {
                  const ato = getAtoDetails(formData.tipoLicenca);
                  if (!ato) return null;
                  return (
                    <div data-testid="card-ato-detalhes" className="col-span-12 p-4 rounded-xl border border-slate-200 bg-slate-50/70 dark:bg-slate-800/50 dark:border-slate-700 shadow-2xs space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <span data-testid="card-ato-sigla" className="px-2 py-0.5 rounded text-xs font-bold bg-[#0F4C3A] text-white font-mono">
                            {ato.sigla}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{ato.nome}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">({ato.categoria})</span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Taxa DAE: <span className="text-[#0F4C3A] dark:text-emerald-400 font-semibold">{ato.taxaBase}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {ato.descricao}
                      </p>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <strong className="text-slate-700 dark:text-slate-200">Base Legal:</strong> {ato.legislacao}
                      </div>
                    </div>
                  );
                })()}

                {getAtoDetails(formData.tipoLicenca) && (
                  <>
                    <div className="col-span-12 md:col-span-6 space-y-1">
                      <label htmlFor="cotic-field-3" className="text-xs font-semibold text-slate-700">Porte do Empreendimento *</label>
                      <input id="cotic-field-3"
                        type="text"
                        readOnly
                        value={formData.porte}
                        className="w-full h-9 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-slate-500">Definido com base na área declarada e tipologia da atividade.</p>
                    </div>

                    <div className="col-span-12 md:col-span-6 space-y-1">
                      <label htmlFor="cotic-field-4" className="text-xs font-semibold text-slate-700">Potencial Poluidor / Degradador *</label>
                      <input id="cotic-field-4"
                        type="text"
                        readOnly
                        value={formData.potencialPoluidor}
                        className="w-full h-9 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-slate-500">Enquadramento conforme Resolução CEPRAM nº 4.579.</p>
                    </div>

                    <div className="col-span-12 p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0F4C3A]" />
                        <span className="text-xs font-bold text-[#0F4C3A]">Enquadramento da Atividade:</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 font-semibold">
                        {formData.enquadramentoLegal} • Requerimento Ambiental Unificado.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ETAPA 3: RECURSOS HÍDRICOS E FLORA */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                  Uso de Recursos Hídricos (CERH / Outorga)
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label htmlFor="cotic-field-5" className="text-xs font-semibold text-slate-700">Tipo de Ponto de Captação *</label>
                    <FilamentSelect id="cotic-field-5"
                      options={tipoCaptacaoOptions}
                      value={formData.tipoCaptacao}
                      onChange={(v) => setFormData({ ...formData, tipoCaptacao: v })}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label htmlFor="cotic-field-6" className="text-xs font-semibold text-slate-700">Vazão Máxima Requerida (m³/dia) *</label>
                    <input id="cotic-field-6"
                      type="text"
                      value={formData.vazaoDia}
                      onChange={(e) => setFormData({ ...formData, vazaoDia: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                  Autorização de Supressão de Vegetação Nativa (ASV)
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label htmlFor="cotic-field-7" className="text-xs font-semibold text-slate-700">Área de Supressão Solicitada (ha) *</label>
                    <input id="cotic-field-7"
                      type="text"
                      value={formData.areaSupressao}
                      onChange={(e) => setFormData({ ...formData, areaSupressao: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label htmlFor="cotic-field-8" className="text-xs font-semibold text-slate-700">Bioma e Fitofisionomia Incidente *</label>
                    <input id="cotic-field-8"
                      type="text"
                      value={formData.bioma}
                      onChange={(e) => setFormData({ ...formData, bioma: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 4: DOCUMENTOS E RESPONSABILIDADE */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-8">
                  <label htmlFor="cotic-field-9" className="text-xs font-semibold text-slate-700">Número da ART / RRT Ativa *</label>
                  <input id="cotic-field-9"
                    type="text"
                    value={formData.artNumero}
                    onChange={(e) => setFormData({ ...formData, artNumero: e.target.value })}
                    className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                  />
                </div>

                <div className="col-span-12 md:col-span-5 space-y-1">
                  <label htmlFor="cotic-field-10" className="text-xs font-semibold text-slate-700">Nome do Responsável Técnico *</label>
                  <input id="cotic-field-10"
                    type="text"
                    value={formData.nomeRT}
                    onChange={(e) => setFormData({ ...formData, nomeRT: e.target.value })}
                    className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                </div>

                <div className="col-span-12 md:col-span-3 space-y-1">
                  <label htmlFor="cotic-field-11" className="text-xs font-semibold text-slate-700">Registro Profissional (CREA/CRBio) *</label>
                  <input id="cotic-field-11"
                    type="text"
                    value={formData.creaRT}
                    onChange={(e) => setFormData({ ...formData, creaRT: e.target.value })}
                    className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                  />
                </div>
              </div>

              {/* Uploads em Bloco */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Documentação Obrigatória Digitalizada (PDF / GeoPackage / SHP)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { nome: 'Planta Planialtimétrica Georreferenciada', status: 'planta_fazenda_buritis.zip (3.8MB)' },
                    { nome: 'Estudo de Impacto Ambiental (EIA/RIMA)', status: 'eia_rima_revisao_04.pdf (18.2MB)' },
                    { nome: 'Inventário Florestal e Censo Amostral', status: 'inventario_asv_2026.pdf (7.1MB)' },
                  ].map((doc, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 ease-in-out flex flex-col justify-between shadow-2xs">
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{doc.nome}</div>
                        <div className="text-[11px] text-[#0F4C3A] font-mono mt-1.5 flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{doc.status}</span>
                        </div>
                      </div>
                      <button className="mt-3 text-[11px] font-semibold text-[#0F4C3A] hover:text-[#0b382b] hover:underline text-left transition-colors duration-200 cursor-pointer">
                        Substituir arquivo...
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 5: DECLARAÇÕES E RESUMO FINANCEIRO */}
          {currentStep === 5 && (
            <div className="space-y-6">
              {/* Resumo Consolidado do Requerimento (T-05) */}
              <section data-testid="requerimento-review" className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Resumo do requerimento
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Confira os dados informados nas etapas anteriores. Esta demonstração não envia requerimentos nem gera protocolo.
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 font-medium">Requerente / Imóvel:</span>
                    <div className="font-semibold text-slate-800">{formData.razaoSocial}</div>
                    <div className="font-mono text-[11px] text-slate-500">{formData.cnpj}</div>
                    <div className="text-[11px] text-slate-500">{formData.municipio} • {formData.areaTotal} ha</div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 font-medium">Ato & Enquadramento:</span>
                    <div className="font-semibold text-[#0F4C3A]">{dirreRequestLabel(formData.tipoLicenca)}</div>
                    <div className="text-[11px] text-slate-600">{formData.tipologia}</div>
                    <div className="text-[11px] text-slate-500">{ATOS_CATALOGO[formData.tipoLicenca]?formData.porte+' • '+formData.potencialPoluidor:'Enquadramento específico pendente de validação'}</div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 font-medium">Intervenções Declaradas:</span>
                    <div className="text-slate-700">Captação: <span className="font-medium">{formData.temOutorga==='sim'?formData.tipoCaptacao:'Não declarada'}</span></div>
                    {formData.temOutorga==='sim'&&<div className="text-slate-700">Vazão: <span className="font-mono font-medium">{formData.vazaoDia} m³/dia</span></div>}
                    <div className="text-slate-700">Supressão (ASV): <span className="font-mono font-medium">{formData.temSupressao==='sim'?formData.areaSupressao+' ha':'Não declarada'}</span></div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 font-medium">Responsável Técnico:</span>
                    <div className="font-semibold text-slate-800">{formData.nomeRT}</div>
                    <div className="font-mono text-[11px] text-slate-500">{formData.creaRT}</div>
                    <div className="font-mono text-[11px] text-slate-500">{formData.artNumero}</div>
                  </div>
                </div>
              </section>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <h3 className="text-sm font-semibold text-slate-800">Taxas e DAE</h3>
                <p className="text-sm text-slate-600">Cálculo de taxas e emissão de DAE pendentes de validação e integração institucional. Esta demonstração não gera cobrança ou guia de pagamento.</p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.declaracaoVeracidade}
                    onChange={(e) => setFormData({ ...formData, declaracaoVeracidade: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]/20 transition-all duration-200 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    Declaro sob as penas da Lei nº 9.605/1998 (Lei de Crimes Ambientais) e do Código Penal Brasileiro que todas as informações prestadas, coordenadas e estudos anexados correspondem à fiel realidade do empreendimento.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RODAPÉ ERGONÔMICO OFICIAL: VOLTAR À ESQUERDA, AVANÇAR À DIR */}
        {/* ========================================================= */}
        <div className="cotic-form-footer p-4 border-t border-slate-200 bg-slate-50/80 flex flex-wrap gap-3 items-center justify-between">
          {/* Lado Esquerdo: Ações de Retorno */}
          <div className="flex items-center flex-wrap gap-2">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="h-9 px-4 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 hover:text-[#0F4C3A] text-slate-700 rounded-lg transition-all duration-200 ease-in-out flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar à Etapa Anterior</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNavigateAway('tabela')}
                className="h-9 px-3 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 ease-in-out cursor-pointer"
              >
                Cancelar Requerimento
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#0F4C3A] rounded-lg transition-all duration-200 ease-in-out flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Salvar Rascunho</span>
            </button>
          </div>

          {/* Lado Direito: Ação Primária em Verde #0F4C3A */}
          <div className="flex items-center gap-2">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="h-9 px-5 text-xs font-semibold bg-[#0F4C3A] hover:bg-[#0b382b] text-white rounded-lg transition-all duration-200 ease-in-out shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Avançar para Etapa 0{currentStep + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => alert('Demonstração concluída. Nenhum requerimento foi enviado; não houve protocolo ou geração de DAE.')}
                className="h-9 px-6 text-xs font-bold bg-[#0F4C3A] hover:bg-[#0b382b] text-white rounded-lg transition-all duration-200 ease-in-out shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Concluir demonstração</span>
              </button>
            )}
          </div>
        </div>
        </div>

        {/* Card Lateral — Resumo do Requerimento (Aparece SOMENTE na Etapa 5 de Revisão, conforme T-05) */}
        {currentStep === 5 && (
          <aside aria-label="Resumo do Requerimento" className="lg:col-span-4 lg:sticky lg:top-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Resumo do Requerimento
              </h3>
            </div>

          <div className="space-y-3.5 text-xs">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Requerente / Imóvel</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {formData.razaoSocial || 'Não informado'}
              </div>
              <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {formData.cnpj || 'CNPJ não informado'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {formData.municipio ? `${formData.municipio} • ` : ''}{formData.areaTotal ? `${formData.areaTotal} ha` : 'Área não informada'}
              </div>
            </div>

            <div className="space-y-0.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Ato Ambiental Requerido</span>
              <div className="font-semibold text-[#0F4C3A] dark:text-emerald-400">
                {dirreRequestLabel(formData.tipoLicenca) || 'Ato não selecionado'}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                {formData.tipologia || 'Tipologia não selecionada'}
              </div>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Intervenções Declaradas</span>
              <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Outorga: </span>
                <span className="font-medium">
                  {formData.temOutorga === 'sim' ? `${formData.tipoCaptacao || 'Declarada'} (${formData.vazaoDia ? formData.vazaoDia + ' m³/dia' : 'vazão não inf.'})` : 'Não declarada'}
                </span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Supressão (ASV): </span>
                <span className="font-medium">
                  {formData.temSupressao === 'sim' ? `${formData.areaSupressao ? formData.areaSupressao + ' ha' : 'Declarada'}` : 'Não declarada'}
                </span>
              </div>
            </div>

            <div className="space-y-0.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Responsável Técnico</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {formData.nomeRT || 'Não informado'}
              </div>
              {formData.creaRT && (
                <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {formData.creaRT}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/60">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Demonstração institucional SEIA V2. Dados conservados apenas na sessão da página.
              </p>
            </div>
          </div>
        </aside>
        )}
      </div>

      <SeiaV2ConfirmationDialog
        open={pendingRoute !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRoute(null);
            requestAnimationFrame(() => returnFocus.current?.focus());
          }
        }}
        title="Sair do requerimento?"
        description="As alterações estão somente nesta página e serão perdidas ao sair. Deseja continuar?"
        confirmLabel="Sair sem salvar"
        cancelLabel="Continuar preenchendo"
        onConfirm={() => { if (pendingRoute) onNavigate?.(pendingRoute); }}
      />
      <SeiaV2Toast
        message={saveToast ? 'Demonstração: os dados permanecem somente nesta página. Não há gravação de rascunho persistente.' : null}
        onClose={() => setSaveToast(false)}
      />
    </div>
  );
};
