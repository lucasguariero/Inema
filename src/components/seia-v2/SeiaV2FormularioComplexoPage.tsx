import React, { useState } from 'react';
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
import { CustomSelect, SelectOption } from './CustomSelect';

const tipologiaOptions: SelectOption[] = [
  { value: 'Agricultura Irrigada de Grãos e Fibras', label: 'Agricultura Irrigada de Grãos e Fibras' },
  { value: 'Mineração a Céu Aberto e Britagem', label: 'Mineração a Céu Aberto e Britagem' },
  { value: 'Geração de Energia Eólica / Solar Fotovoltaica', label: 'Geração de Energia Eólica / Solar Fotovoltaica' },
  { value: 'Indústria de Alimentos e Bebidas', label: 'Indústria de Alimentos e Bebidas' },
  { value: 'Loteamento e Obras de Urbanização', label: 'Loteamento e Obras de Urbanização' },
];

const tipoLicencaOptions: SelectOption[] = [
  { value: 'Licença Prévia (LP)', label: 'Licença Prévia (LP)' },
  { value: 'Licença de Instalação (LI) com ampliação', label: 'Licença de Instalação (LI) com ampliação' },
  { value: 'Licença de Operação (LO)', label: 'Licença de Operação (LO)' },
  { value: 'Licença Unificada (LU)', label: 'Licença Unificada (LU)' },
  { value: 'Autorização Ambiental (AA)', label: 'Autorização Ambiental (AA)' },
];

const tipoCaptacaoOptions: SelectOption[] = [
  { value: 'Subterrânea (Poço Tubular Profundo)', label: 'Subterrânea (Poço Tubular Profundo)' },
  { value: 'Superficial Direta (Rio / Riacho)', label: 'Superficial Direta (Rio / Riacho)' },
  { value: 'Barramento com regularização de vazão', label: 'Barramento com regularização de vazão' },
  { value: 'Canal de Irrigação de Distrito Público', label: 'Canal de Irrigação de Distrito Público' },
];

export const SeiaV2FormularioComplexoPage: React.FC = () => {
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
    tipoLicenca: 'Licença de Instalação (LI) com ampliação',
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
    <div className="space-y-6">
      {/* Cabeçalho Oficial (Sem botão voltar flutuante no topo direito) */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Início</span>
          <span>/</span>
          <span>Atendimento e Cadastros</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Novo Requerimento</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
          Requerimento Ambiental Unificado (SEIA V2)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Formulário oficial para Licenciamento Ambiental, Outorga de Recursos Hídricos e Autorização de Supressão Vegetal (ASV).
        </p>
      </div>

      {/* ========================================================= */}
      {/* STEPPER WIZARD NATIVO FILAMENT                            */}
      {/* ========================================================= */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {steps.map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-all duration-200 ease-in-out cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-50 border border-emerald-300 shadow-2xs'
                    : isDone
                    ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-colors duration-200 ${
                    isCurrent
                      ? 'bg-[#0F4C3A] text-white shadow-xs'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? '✓' : s.num}
                </div>
                <div className="truncate">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Etapa 0{s.num}
                  </div>
                  <div className={`text-xs font-bold truncate ${isCurrent ? 'text-[#0F4C3A]' : 'text-slate-700'}`}>
                    {s.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* CORPO DO FORMULÁRIO DENSE UI (GRID DE 12 COLUNAS)         */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner da Etapa Atual */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Etapa {currentStep}: {steps[currentStep - 1].label}
            </h2>
            <p className="text-xs text-slate-500">
              Preencha os campos obrigatórios identificados com asterisco (*).
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-[#0F4C3A]">
            F-DIRRE-092
          </span>
        </div>

        <div className="p-6">
          {/* ETAPA 1: IDENTIFICAÇÃO E LOCALIZAÇÃO */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#0F4C3A]" />
                  1.1. Dados Cadastrais do Empreendimento
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">CNPJ / CPF *</label>
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-8 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Razão Social / Nome Oficial *</label>
                    <input
                      type="text"
                      value={formData.razaoSocial}
                      onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nome Fantasia do Imóvel / Fazenda</label>
                    <input
                      type="text"
                      value={formData.nomeFantasia}
                      onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Inscrição Estadual (SEFAZ)</label>
                    <input
                      type="text"
                      value={formData.inscricaoEstadual}
                      onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0F4C3A]" />
                  1.2. Localização e Coordenadas Georreferenciadas (SIRGAS 2000)
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Município Polo *</label>
                    <input
                      type="text"
                      value={formData.municipio}
                      onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Latitude Decimal (SIRGAS 2000) *</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Longitude Decimal (SIRGAS 2000) *</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Número do Registro CEFIR / CAR *</label>
                    <input
                      type="text"
                      value={formData.cefirNumero}
                      onChange={(e) => setFormData({ ...formData, cefirNumero: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Área Total do Imóvel (hectares) *</label>
                    <input
                      type="text"
                      value={formData.areaTotal}
                      onChange={(e) => setFormData({ ...formData, areaTotal: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: ENQUADRAMENTO DA ATIVIDADE */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-8 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tipologia Principal da Atividade *</label>
                  <CustomSelect
                    options={tipologiaOptions}
                    value={formData.tipologia}
                    onChange={(v) => setFormData({ ...formData, tipologia: v })}
                  />
                </div>

                <div className="col-span-12 md:col-span-4 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tipo de Ato Requerido *</label>
                  <CustomSelect
                    options={tipoLicencaOptions}
                    value={formData.tipoLicenca}
                    onChange={(v) => setFormData({ ...formData, tipoLicenca: v })}
                  />
                </div>

                <div className="col-span-12 md:col-span-6 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Porte do Empreendimento *</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.porte}
                    className="w-full h-9 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-500">Calculado automaticamente com base na área declarada.</p>
                </div>

                <div className="col-span-12 md:col-span-6 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Potencial Poluidor / Degradador *</label>
                  <input
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
                    <span className="text-xs font-bold text-[#0F4C3A]">Enquadramento Automático Homologado:</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 font-semibold">
                    {formData.enquadramentoLegal} • Modalidade Trifásica com Conselho Estadual.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3: RECURSOS HÍDRICOS E FLORA */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-[#0F4C3A]" />
                  3.1. Uso de Recursos Hídricos (CERH / Outorga)
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Tipo de Ponto de Captação *</label>
                    <CustomSelect
                      options={tipoCaptacaoOptions}
                      value={formData.tipoCaptacao}
                      onChange={(v) => setFormData({ ...formData, tipoCaptacao: v })}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Vazão Máxima Requerida (m³/dia) *</label>
                    <input
                      type="text"
                      value={formData.vazaoDia}
                      onChange={(e) => setFormData({ ...formData, vazaoDia: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-[#0F4C3A]" />
                  3.2. Autorização de Supressão de Vegetação Nativa (ASV)
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Área de Supressão Solicitada (ha) *</label>
                    <input
                      type="text"
                      value={formData.areaSupressao}
                      onChange={(e) => setFormData({ ...formData, areaSupressao: e.target.value })}
                      className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Bioma e Fitofisionomia Incidente *</label>
                    <input
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
                <div className="col-span-12 md:col-span-4 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Número da ART / RRT Ativa *</label>
                  <input
                    type="text"
                    value={formData.artNumero}
                    onChange={(e) => setFormData({ ...formData, artNumero: e.target.value })}
                    className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono"
                  />
                </div>

                <div className="col-span-12 md:col-span-5 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nome do Responsável Técnico *</label>
                  <input
                    type="text"
                    value={formData.nomeRT}
                    onChange={(e) => setFormData({ ...formData, nomeRT: e.target.value })}
                    className="w-full h-9 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                </div>

                <div className="col-span-12 md:col-span-3 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Registro Profissional (CREA/CRBio) *</label>
                  <input
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
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Resumo de Taxas de Vistoria e Licenciamento (DAE)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0F4C3A]">SEFAZ-BA</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Taxa de Licenciamento (LI):</span>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">R$ 14.850,00</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Vistoria Hidrológica (Outorga):</span>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">R$ 3.420,00</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Total a Recolher via DAE:</span>
                    <div className="font-mono font-bold text-emerald-800 text-sm mt-0.5">R$ 18.270,00</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2 shadow-2xs">
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
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          {/* Lado Esquerdo: Ações de Retorno */}
          <div className="flex items-center gap-2">
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
                onClick={() => alert('Requerimento protocolado com sucesso no SEIA V2 sob o número 020.14920.2026/0001!')}
                className="h-9 px-6 text-xs font-bold bg-[#0F4C3A] hover:bg-[#0b382b] text-white rounded-lg transition-all duration-200 ease-in-out shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Protocolar e Gerar DAE</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Rascunho salvo com sucesso no banco de dados local.</span>
        </div>
      )}
    </div>
  );
};
