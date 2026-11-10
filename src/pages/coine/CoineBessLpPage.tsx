import React, { useMemo, useState } from 'react';
import { FilamentWizard, WizardStep } from '@/components/filament/Wizard';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { Button } from '@/components/ui/button';
import { GlaTableContainer, GlaTable, GlaTableHead, GlaTh, GlaTableBody, GlaTableRow, GlaTd } from '@/components/common/GlaTable';
import './coine-bess-lp.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trash2, Plus, Pencil, ArrowLeft, ArrowRight, Save, Send, ChevronDown } from 'lucide-react';

/*
 * FCE BESS — Licença Prévia (COINE) — protótipo demonstrativo local.
 * Fonte: COINE_BESS_LP_MATRIZ_2026-10-27 (BESS-LP-001..060, D01–D10).
 * - Campos iniciam em branco (BESS-LP-049 / #242); seleções do Figma não são defaults.
 * - Não há integração com Documentos Obrigatórios: nenhum arquivo é conectado,
 *   baixado, substituído ou validado.
 * - Não há envio ao SEIA/SEI: a etapa 5 encerra apenas a demonstração.
 */

export interface SoundSource {
  id: string;
  equipamento: string;
  quantidade: string;
  lwaDba: string;
}

type Arranjo = '' | 'containers' | 'alvenaria';
type SimNao = '' | 'sim' | 'nao';

export interface BessLpFormData {
  // Etapa 1 - Engenharia e Tecnologia
  potenciaInstalada: string;
  areaOcupadaHa: string;
  vidaUtilAnos: string;
  quimicaCelula: string;
  fabricante: string;
  modelo: string;
  arranjoConstrutivo: Arranjo;
  areaContainerM2: string;
  qtdContainers: string;
  areaGalpaoM2: string;
  descricaoBms: string;
  numInversoresPcs: string;
  potenciaTransformadores: string;
  tensaoConexaoKv: string;
  subestacaoAcesso: string;

  // Etapa 2 - Diagnóstico Acústico
  fontesSonoras: SoundSource[];
  componentesTonais: SimNao;

  // Etapa 3 - Riscos e Incêndio
  tipoDeteccao: string[];
  descricaoOutroDeteccao: string;
  agenteSupressao: string;
  reservaAguaM3: string;
  capacidadeBaciaM3: string;
  contencaoOleoTransf: string;

  // Etapa 4 - Resíduos e Colocalização
  empresaDestinacao: string;
  qtdBaterias: string;
  colocalizado: SimNao;
  usinaAssociada: string;
  infraCompartilhada: string[];
  descricaoOutraInfra: string;
}

/** Estado inicial em branco (BESS-LP-049). Nenhum valor ilustrativo. */
export const INITIAL_FORM_DATA: BessLpFormData = {
  potenciaInstalada: '',
  areaOcupadaHa: '',
  vidaUtilAnos: '',
  quimicaCelula: '',
  fabricante: '',
  modelo: '',
  arranjoConstrutivo: '',
  areaContainerM2: '',
  qtdContainers: '',
  areaGalpaoM2: '',
  descricaoBms: '',
  numInversoresPcs: '',
  potenciaTransformadores: '',
  tensaoConexaoKv: '',
  subestacaoAcesso: '',

  fontesSonoras: [],
  componentesTonais: '',

  tipoDeteccao: [],
  descricaoOutroDeteccao: '',
  agenteSupressao: '',
  reservaAguaM3: '',
  capacidadeBaciaM3: '',
  contencaoOleoTransf: '',

  empresaDestinacao: '',
  qtdBaterias: '',
  colocalizado: '',
  usinaAssociada: '',
  infraCompartilhada: [],
  descricaoOutraInfra: '',
};

const DETECCAO_OPCOES = [
  { id: 'fumaca', label: 'Fumaça óptica' },
  { id: 'gases', label: 'Gases inflamáveis (off-gas)' },
  { id: 'temperatura', label: 'Elevação de temperatura' },
  { id: 'outro', label: 'Outro' },
];

const INFRA_OPCOES = [
  { id: 'subestacao', label: 'Subestação' },
  { id: 'linha', label: 'Linha de Transmissão' },
  { id: 'acessos', label: 'Acessos' },
  { id: 'drenagem', label: 'Drenagem' },
  { id: 'outro', label: 'Outro' },
];

const inputClass =
  'w-full h-9 px-3 text-xs sm:text-sm bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400';
const selectClass =
  'w-full h-9 px-2 text-xs sm:text-sm bg-transparent outline-none text-slate-900 dark:text-slate-100 cursor-pointer';

/**
 * Representação de documento previsto no FCE. Não existe vínculo real com
 * Documentos Obrigatórios neste protótipo: nenhum arquivo, metadado ou ação
 * de visualizar/substituir é simulado.
 */
const DocumentItemCard: React.FC<{ id: string; title: string; required?: boolean }> = ({ id, title, required }) => (
 <div data-doc-id={id} className="bess-document-row">
  <h4>{title}{required && <span className="text-rose-500 ml-0.5" aria-hidden="true">*</span>}</h4>
  <p>Vínculo com Documentos Obrigatórios não disponível neste protótipo.</p>
 </div>
);

// Local association adapter: preserve the canonical InputWrapper without
// changing the shared component used by other missions.
function BessField({label,required,hint,error,suffix,children}:{label:string;required?:boolean;hint?:React.ReactNode;error?:string;suffix?:React.ReactNode;children:React.ReactElement<{name?:string;id?:string;disabled?:boolean;required?:boolean;'aria-label'?:string;'aria-describedby'?:string;'aria-invalid'?:boolean}>}){
 const generated=React.useId(),id=children.props.id||'bess-'+(children.props.name||generated),help=id+'-help';
 return <div className="bess-field"><label htmlFor={id}>{label}{required&&<span aria-hidden="true" className="text-rose-500 ml-0.5">*</span>}</label><InputWrapper valid={!error} disabled={children.props.disabled} suffix={suffix || (children.type==='select' ? <ChevronDown size={16} aria-hidden="true"/> : undefined)}>{React.cloneElement(children,{id,required,'aria-describedby':hint||error?help:undefined,'aria-invalid':!!error})}</InputWrapper>{(hint||error)&&<p id={help} className={error?'bess-field-error':'bess-field-hint'} role={error?'alert':undefined}>{error||hint}</p>}</div>;
}

const RadioOption: React.FC<{
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}> = ({ name, value, checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="text-[var(--color-brand-primary)] focus:ring-[var(--color-border-focus)]"
    />
    <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">{label}</span>
  </label>
);

const filled = (v: string) => v.trim() !== '';

/** Technical format checks only; no environmental ranges, noise limits or
 * structured transformer model are inferred from examples. */
export function numericIssue(value:string,integer=false,nonnegative=false):string|undefined {
 if(!filled(value))return;
 const normalized=value.trim().replace(',','.');
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)||!Number.isFinite(Number(normalized)))return 'Informe um número válido.';
 if(integer&&!Number.isInteger(Number(normalized)))return 'Informe uma quantidade inteira.';
 if(nonnegative&&Number(normalized)<0)return 'Informe um valor maior ou igual a zero.';
}
export function computeInputErrors(d:BessLpFormData):Record<string,string>{
 const errors:Record<string,string>={};
 const fields=['areaOcupadaHa','vidaUtilAnos','numInversoresPcs','tensaoConexaoKv','reservaAguaM3','qtdBaterias'];
 if(d.arranjoConstrutivo==='containers')fields.push('areaContainerM2','qtdContainers');
 if(d.arranjoConstrutivo==='alvenaria')fields.push('areaGalpaoM2');
 for(const name of fields){const issue=numericIssue(d[name as keyof BessLpFormData] as string,['numInversoresPcs','qtdContainers','qtdBaterias'].includes(name),true);if(issue)errors[name]=issue;}
 return errors;
}

/**
 * Pendências contabilizadas somente para campos com obrigatoriedade confirmada
 * na matriz BESS LP e sem decisão institucional aberta. Ficam fora da contagem:
 * química/agente (D02, sem catálogo), bacia (D03), resíduos (D05), documentos
 * (D04/D06/D07) e tabela acústica (obrigatoriedade não marcada).
 */
export function computePendencias(d: BessLpFormData): Record<1 | 2 | 3 | 4, string[]> {
  const e1: string[] = [];
  if (!filled(d.potenciaInstalada)) e1.push('Potência instalada');
  if (!filled(d.areaOcupadaHa)) e1.push('Área ocupada');
  if (!filled(d.vidaUtilAnos)) e1.push('Vida útil prevista');
  if (!filled(d.fabricante)) e1.push('Fabricante');
  if (!filled(d.modelo)) e1.push('Modelo');
  if (!d.arranjoConstrutivo) e1.push('Arranjo construtivo');
  if (d.arranjoConstrutivo === 'containers') {
    if (!filled(d.areaContainerM2)) e1.push('Área do container');
    if (!filled(d.qtdContainers)) e1.push('Quantidade de containers');
  }
  if (d.arranjoConstrutivo === 'alvenaria' && !filled(d.areaGalpaoM2)) e1.push('Área do galpão');
  if (!filled(d.descricaoBms)) e1.push('Descrição do BMS');
  if (!filled(d.numInversoresPcs)) e1.push('Número de inversores (PCS)');
  if (!filled(d.potenciaTransformadores)) e1.push('Potência dos transformadores');
  if (!filled(d.tensaoConexaoKv)) e1.push('Tensão de conexão');
  if (!filled(d.subestacaoAcesso)) e1.push('Subestação de acesso');

  const e2: string[] = [];
  if (!d.componentesTonais) e2.push('Componentes tonais');

  const e3: string[] = [];
  if (d.tipoDeteccao.length === 0) e3.push('Tipo de detecção');
  if (d.tipoDeteccao.includes('outro') && !filled(d.descricaoOutroDeteccao)) e3.push('Descrição do outro tipo de detecção');
  if (!filled(d.reservaAguaM3)) e3.push('Reserva de água para combate a incêndio');
  if (!filled(d.contencaoOleoTransf)) e3.push('Contenção de óleo dos transformadores');

  const e4: string[] = [];
  if (!d.colocalizado) e4.push('Colocalização com usina existente');
  if (d.colocalizado === 'sim') {
    if (!filled(d.usinaAssociada)) e4.push('Usina geradora associada');
    if (d.infraCompartilhada.length === 0) e4.push('Infraestruturas compartilhadas');
    if (d.infraCompartilhada.includes('outro') && !filled(d.descricaoOutraInfra)) e4.push('Descrição de outra infraestrutura');
  }
  const errors=computeInputErrors(d);
  for(const [key,error]of Object.entries(errors)){
   const target=key==='reservaAguaM3'?e3:key==='qtdBaterias'?e4:e1;
   target.push(`${key==='qtdBaterias'?'Quantidade de baterias':key==='reservaAguaM3'?'Reserva de água':({areaOcupadaHa:'Área ocupada',vidaUtilAnos:'Vida útil prevista',numInversoresPcs:'Número de inversores (PCS)',tensaoConexaoKv:'Tensão de conexão',areaContainerM2:'Área do container',qtdContainers:'Quantidade de containers',areaGalpaoM2:'Área do galpão'} as Record<string,string>)[key]}: ${error}`);
  }
  for(const row of d.fontesSonoras)if(!filled(row.equipamento)||!filled(row.quantidade)||!filled(row.lwaDba)||numericIssue(row.quantidade,true,true)||numericIssue(row.lwaDba))e2.push('Revise a fonte sonora '+(row.equipamento||'sem identificação')+'.');
  return { 1: e1, 2: e2, 3: e3, 4: e4 };
}

export const CoineBessLpPage: React.FC<{
  onNavigate?: (route: string) => void;
}> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<BessLpFormData>(INITIAL_FORM_DATA);
  const [showDraftNotice, setShowDraftNotice] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [demoConcluida, setDemoConcluida] = useState<boolean>(false);
  const dialogTrigger = React.useRef<HTMLElement | null>(null);

  // Inclusão de linha no inventário acústico (ver D09 no relatório)
  const [showAddSoundModal, setShowAddSoundModal] = useState<boolean>(false);
  const [newSoundEquip, setNewSoundEquip] = useState<string>('');
  const [newSoundQtd, setNewSoundQtd] = useState<string>('');
  const [newSoundLwa, setNewSoundLwa] = useState<string>('');

  const steps: WizardStep[] = [
    { id: 1, isCompleted: false, label: 'Engenharia e Tecnologia' },
    { id: 2, isCompleted: false, label: 'Diagnóstico Acústico' },
    { id: 3, isCompleted: false, label: 'Riscos e Incêndio' },
    { id: 4, isCompleted: false, label: 'Resíduos e Colocalização' },
    { id: 5, label: 'Revisão e Envio' },
  ];

  const heading=React.useRef<HTMLHeadingElement>(null),wizard=React.useRef<HTMLDivElement>(null);
  React.useEffect(()=>{
   const nav=wizard.current?.querySelector<HTMLElement>('ol'),button=nav?.querySelectorAll<HTMLButtonElement>('button')[currentStep-1];
   nav?.querySelectorAll('button').forEach((b,i)=>{if(i===currentStep-1)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
   if(nav&&button){const a=button.getBoundingClientRect(),r=nav.getBoundingClientRect();if(a.left<r.left||a.right>r.right)nav.scrollLeft+=a.left-r.left;}
   if(!document.activeElement?.closest('.fi-sc-wizard-header')){heading.current?.focus();window.scrollTo({top:0,behavior:'instant'});}
  },[currentStep]);
  const fieldErrors=computeInputErrors(formData);
  const [editingSoundId,setEditingSoundId]=useState<string>();
  const soundQuantityError=numericIssue(newSoundQtd,true,true),soundLwaError=numericIssue(newSoundLwa);
  const pendencias = useMemo(() => computePendencias(formData), [formData]);
  const totalPendencias = pendencias[1].length + pendencias[2].length + pendencias[3].length + pendencias[4].length;

  const handleInputChange = <K extends keyof BessLpFormData>(field: K, value: BessLpFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    setShowDraftNotice(true);
    setTimeout(() => setShowDraftNotice(false), 4000);
  };

  const handleCancel = () => {
    if (onNavigate) onNavigate('inicio');
    else window.history.back();
  };

  const handlePilotBack = () => {
    const hasEntries = Object.values(formData).some(value => Array.isArray(value) ? value.length > 0 : filled(value));
    if (hasEntries && !window.confirm('Os dados desta página não foram gravados. Deseja sair e voltar ao início do portal?')) return;
    // Mesmo destino do link Início do AppShell; não inventar uma tela de requerimentos.
    window.location.assign('/?rota=relatorios');
  };

  const canAddSound = filled(newSoundEquip) && filled(newSoundQtd) && filled(newSoundLwa) && !soundQuantityError && !soundLwaError;
  const openSound=(source?:SoundSource)=>{dialogTrigger.current=document.activeElement as HTMLElement;setEditingSoundId(source?.id);setNewSoundEquip(source?.equipamento||'');setNewSoundQtd(source?.quantidade||'');setNewSoundLwa(source?.lwaDba||'');setShowAddSoundModal(true);};

  const handleAddSoundSource = () => {
    if (!canAddSound) return;
    const newSource: SoundSource = {
      id: editingSoundId || crypto.randomUUID(),
      equipamento: newSoundEquip.trim(),
      quantidade: newSoundQtd.trim(),
      lwaDba: newSoundLwa.trim(),
    };
    setFormData((prev) => ({ ...prev, fontesSonoras: editingSoundId ? prev.fontesSonoras.map(row=>row.id===editingSoundId?newSource:row) : [...prev.fontesSonoras, newSource] }));
    setNewSoundEquip('');
    setNewSoundQtd('');
    setNewSoundLwa('');
    setShowAddSoundModal(false);
  };

  const handleRemoveSoundSource = (id: string) => {
    setFormData((prev) => ({ ...prev, fontesSonoras: prev.fontesSonoras.filter((s) => s.id !== id) }));
  };

  const toggleList = (field: 'tipoDeteccao' | 'infraCompartilhada', item: string) => {
    setFormData((prev) => {
      const list = prev[field];
      const next = list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
      return { ...prev, [field]: next };
    });
  };

  const labelsOf = (ids: string[], opts: { id: string; label: string }[]) =>
    ids.map((id) => opts.find((o) => o.id === id)?.label ?? id).join(', ');

  const v = (s: string, suffix = '') => (filled(s) ? `${s}${suffix}` : 'Não informado');

  const ReviewBlock: React.FC<{ step: 1 | 2 | 3 | 4; title: string; children: React.ReactNode }> = ({ step, title, children }) => {
    const p=pendencias[step];return <div data-review-step={step}><Section heading={title} headerActions={<Button color="gray" size="sm" onClick={()=>setCurrentStep(step)}>Corrigir</Button>}><p className={p.length?'bess-field-error':'bess-field-hint'}>{p.length?`${p.length} ${p.length===1?'pendência':'pendências'} de preenchimento: ${p.join('; ')}`:'Campos disponíveis conferidos nesta demonstração.'}</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mt-4">{children}</div></Section></div>;
  };
  const soundTable=(review=false)=><GlaTableContainer noScroll><div className="bess-sound-scroll" role="region" aria-label="Inventário acústico — rolagem horizontal" tabIndex={0}><GlaTable aria-label={review?'Fontes sonoras na revisão':'Inventário de fontes sonoras'}><GlaTableHead><tr><GlaTh>Equipamento ou fonte</GlaTh><GlaTh>Quantidade</GlaTh><GlaTh>LWA (dBA)</GlaTh>{!review&&<GlaTh>Ações</GlaTh>}</tr></GlaTableHead><GlaTableBody>{formData.fontesSonoras.map(src=><GlaTableRow key={src.id} data-sound-row><GlaTd>{src.equipamento}</GlaTd><GlaTd>{src.quantidade}</GlaTd><GlaTd>{src.lwaDba}</GlaTd>{!review&&<GlaTd><div className="flex gap-2"><Button color="gray" size="xs" aria-label={`Editar ${src.equipamento}`} onClick={()=>openSound(src)}><Pencil size={16}/></Button><Button color="gray" size="xs" aria-label={`Excluir ${src.equipamento}`} onClick={()=>handleRemoveSoundSource(src.id)}><Trash2 size={16}/></Button></div></GlaTd>}</GlaTableRow>)}</GlaTableBody></GlaTable></div>{!formData.fontesSonoras.length&&<p data-empty-row className="bess-empty">Nenhuma fonte sonora informada.</p>}</GlaTableContainer>;

  const Item: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="min-w-0">
      <span className="text-slate-500 dark:text-slate-400 block">{label}</span>
      <span className="font-medium text-slate-800 dark:text-slate-200 break-words">{value}</span>
    </div>
  );

  return (
    <div className={'bess-lp-page' + (currentStep === 1 ? ' bess-pilot' : '')}>
      {showDraftNotice && (
        <div role="status" className="bess-draft-notice fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700">
          <span className="text-xs sm:text-sm font-medium">
            Demonstração: os dados permanecem apenas nesta página. Nenhum rascunho foi gravado.
          </span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="bess-page-header">
        <div className="bess-heading">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 ref={heading} tabIndex={-1} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                FCE — Sistemas de Armazenamento de Energia em Baterias (BESS)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Formulário de Caracterização do Empreendimento — Licença Prévia (LP)
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9"
                onClick={currentStep === 1 ? handlePilotBack : handleCancel}
                title={currentStep === 1 ? 'Voltar ao início do portal' : 'Voltar'}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="bess-wizard-frame">
          <div ref={wizard} className="bess-wizard">
            <FilamentWizard steps={steps} currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />
          </div>
        </div>
      </div>

      <main className="bess-content"><p className="bess-stage-label" aria-live="polite">Etapa {currentStep} de 5 — {steps[currentStep-1].label}</p>
        {/* ETAPA 1 */}
        {currentStep === 1 && (
          <div data-step="1" className="space-y-6 animate-in fade-in-50 duration-150">
            <Section heading="Dados técnicos do sistema de armazenamento">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <BessField label="Potência instalada" required hint="Unidade não informada neste protótipo.">
                  <input name="potenciaInstalada" type="text" inputMode="decimal" value={formData.potenciaInstalada}
                    onChange={(e) => handleInputChange('potenciaInstalada', e.target.value)} className={inputClass} />
                </BessField>
                <BessField label="Área ocupada (ha)" required suffix="ha" error={fieldErrors.areaOcupadaHa}>
                  <input name="areaOcupadaHa" type="number" step="any" value={formData.areaOcupadaHa}
                    onChange={(e) => handleInputChange('areaOcupadaHa', e.target.value)} className={inputClass} />
                </BessField>
                <BessField label="Vida útil prevista (anos)" required suffix="anos" error={fieldErrors.vidaUtilAnos}>
                  <input name="vidaUtilAnos" type="number" step="any" value={formData.vidaUtilAnos}
                    onChange={(e) => handleInputChange('vidaUtilAnos', e.target.value)} className={inputClass} />
                </BessField>
                <BessField label="Química da célula" required hint="Opções não disponíveis neste protótipo.">
                  <select disabled name="quimicaCelula" value={formData.quimicaCelula}
                    onChange={(e) => handleInputChange('quimicaCelula', e.target.value)} className={selectClass}>
                    <option value="" className="dark:bg-slate-800">Selecione...</option>
                  </select>
                </BessField>
                <BessField label="Fabricante" required>
                  <input name="fabricante" type="text" value={formData.fabricante}
                    onChange={(e) => handleInputChange('fabricante', e.target.value)} className={inputClass} />
                </BessField>
                <BessField label="Modelo" required>
                  <input name="modelo" type="text" value={formData.modelo}
                    onChange={(e) => handleInputChange('modelo', e.target.value)} className={inputClass} />
                </BessField>
              </div>
            </Section>

            <Section heading="Arranjo construtivo">
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Arranjo construtivo <span className="text-rose-500 ml-0.5">*</span>
                  </span>
                  <div role="radiogroup" aria-label="Arranjo construtivo" aria-required="true" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      { value: 'containers', label: 'Containers modulares outdoor' },
                      { value: 'alvenaria', label: 'Edificação de alvenaria dedicada' },
                    ] as const).map((opt) => (
                      <label key={opt.value}
                        className={`flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${
                          formData.arranjoConstrutivo === opt.value
                            ? 'border-[var(--color-brand-primary)] bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-[var(--color-brand-primary)]'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}>
                        <input type="radio" name="arranjoConstrutivo" value={opt.value}
                          checked={formData.arranjoConstrutivo === opt.value}
                          onChange={() => handleInputChange('arranjoConstrutivo', opt.value)}
                          className="text-[var(--color-brand-primary)] focus:ring-[var(--color-border-focus)]" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.arranjoConstrutivo === 'containers' && (
                  <div data-branch="containers" className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60">
                    <BessField label="Área do container (m²)" required suffix="m²" error={fieldErrors.areaContainerM2}>
                      <input name="areaContainerM2" type="number" step="any" value={formData.areaContainerM2}
                        onChange={(e) => handleInputChange('areaContainerM2', e.target.value)} className={inputClass} />
                    </BessField>
                    <BessField label="Quantidade de containers" required error={fieldErrors.qtdContainers}>
                      <input name="qtdContainers" type="number" step="1" value={formData.qtdContainers}
                        onChange={(e) => handleInputChange('qtdContainers', e.target.value)} className={inputClass} />
                    </BessField>
                  </div>
                )}
                {formData.arranjoConstrutivo === 'alvenaria' && (
                  <div data-branch="alvenaria" className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60">
                    <BessField label="Área do galpão (m²)" required suffix="m²" error={fieldErrors.areaGalpaoM2}>
                      <input name="areaGalpaoM2" type="number" step="any" value={formData.areaGalpaoM2}
                        onChange={(e) => handleInputChange('areaGalpaoM2', e.target.value)} className={inputClass} />
                    </BessField>
                  </div>
                )}
              </div>
            </Section>

            <Section heading="Controle, inversores e conexão">
              <div className="space-y-4">
                <BessField label="Descrição do BMS (desligamento automático por célula ou rack)" required>
                  <textarea name="descricaoBms" rows={3} value={formData.descricaoBms}
                    onChange={(e) => handleInputChange('descricaoBms', e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm bg-transparent outline-none text-slate-900 dark:text-slate-100 resize-none" />
                </BessField>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <BessField label="Número de inversores (PCS)" required error={fieldErrors.numInversoresPcs}>
                    <input name="numInversoresPcs" type="number" step="1" value={formData.numInversoresPcs}
                      onChange={(e) => handleInputChange('numInversoresPcs', e.target.value)} className={inputClass} />
                  </BessField>
                  <BessField label="Potência dos transformadores" required>
                    <input name="potenciaTransformadores" type="text" value={formData.potenciaTransformadores}
                      onChange={(e) => handleInputChange('potenciaTransformadores', e.target.value)} className={inputClass} />
                  </BessField>
                  <BessField label="Tensão de conexão (kV)" required suffix="kV" error={fieldErrors.tensaoConexaoKv}>
                    <input name="tensaoConexaoKv" type="number" step="any" value={formData.tensaoConexaoKv}
                      onChange={(e) => handleInputChange('tensaoConexaoKv', e.target.value)} className={inputClass} />
                  </BessField>
                  <BessField label="Subestação de acesso" required>
                    <input name="subestacaoAcesso" type="text" value={formData.subestacaoAcesso}
                      onChange={(e) => handleInputChange('subestacaoAcesso', e.target.value)} className={inputClass} />
                  </BessField>
                </div>
              </div>
            </Section>

            <Section heading="Documentos">
              <div className="space-y-3">
                <DocumentItemCard id="BESS-LP-015" title="Polígono do BESS e da subestação" required />
                <DocumentItemCard id="BESS-LP-050" title="Planta do projeto" />
              </div>
            </Section>
          </div>
        )}

        {/* ETAPA 2 */}
        {currentStep === 2 && (
          <div data-step="2" className="space-y-6 animate-in fade-in-50 duration-150">
            <Section
              heading="Inventário de fontes sonoras"
              headerActions={
                <Button type="button" size="xs" variant="outline" className="gap-1.5 h-8" onClick={() => openSound()}>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar fonte</span>
                </Button>
              }
            >
              {soundTable()}
            </Section>

            <Section heading="Componentes tonais">
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Há presença de componentes tonais (zumbido de baixa frequência)? <span className="text-rose-500 ml-0.5">*</span>
                </span>
                <div role="radiogroup" aria-label="Componentes tonais" aria-required="true" className="flex items-center gap-6 pt-1">
                  <RadioOption name="componentesTonais" value="sim" label="Sim" checked={formData.componentesTonais === 'sim'} onChange={() => handleInputChange('componentesTonais', 'sim')} />
                  <RadioOption name="componentesTonais" value="nao" label="Não" checked={formData.componentesTonais === 'nao'} onChange={() => handleInputChange('componentesTonais', 'nao')} />
                </div>
              </div>
            </Section>

            <Section heading="Documentos">
              <div className="space-y-3">
                <DocumentItemCard id="BESS-LP-019" title="Espectro de frequências por fonte (catálogos ou ensaios)" required />
                <DocumentItemCard id="BESS-LP-020" title="Medição do ruído residual (baseline) na APTA" required />
                <DocumentItemCard id="BESS-LP-021" title="Plano de atenuação física (barreiras ou enclausuramento)" />
              </div>
            </Section>
          </div>
        )}

        {/* ETAPA 3 */}
        {currentStep === 3 && (
          <div data-step="3" className="space-y-6 animate-in fade-in-50 duration-150">
            <Section heading="Detecção">
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Tipo de detecção <span className="text-rose-500 ml-0.5">*</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {DETECCAO_OPCOES.map((item) => (
                      <label key={item.id}
                        className={`flex items-center gap-2.5 p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.tipoDeteccao.includes(item.id)
                            ? 'border-[var(--color-brand-primary)] bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-900 dark:text-white font-medium ring-1 ring-[var(--color-brand-primary)]'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}>
                        <input type="checkbox" name={`deteccao-${item.id}`} checked={formData.tipoDeteccao.includes(item.id)}
                          onChange={() => toggleList('tipoDeteccao', item.id)} className="rounded text-[var(--color-brand-primary)] focus:ring-[var(--color-border-focus)]" />
                        <span className="text-xs sm:text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.tipoDeteccao.includes('outro') && (
                  <div data-branch="deteccao-outro" className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60">
                    <BessField label="Descrição do outro tipo de detecção" required>
                      <input name="descricaoOutroDeteccao" type="text" value={formData.descricaoOutroDeteccao}
                        onChange={(e) => handleInputChange('descricaoOutroDeteccao', e.target.value)} className={inputClass} />
                    </BessField>
                  </div>
                )}
              </div>
            </Section>

            <Section heading="Supressão, reserva e contenção">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <BessField label="Agente de supressão automática" required hint="Opções não disponíveis neste protótipo.">
                  <select disabled name="agenteSupressao" value={formData.agenteSupressao}
                    onChange={(e) => handleInputChange('agenteSupressao', e.target.value)} className={selectClass}>
                    <option value="" className="dark:bg-slate-800">Selecione...</option>
                  </select>
                </BessField>
                <BessField label="Reserva de água para combate a incêndio (m³)" required suffix="m³" error={fieldErrors.reservaAguaM3}>
                  <input name="reservaAguaM3" type="number" step="any" value={formData.reservaAguaM3}
                    onChange={(e) => handleInputChange('reservaAguaM3', e.target.value)} className={inputClass} />
                </BessField>
                <BessField label="Capacidade da bacia de contenção de óleo (m³)" required suffix="m³">
                  <input name="capacidadeBaciaM3" type="text" inputMode="decimal" value={formData.capacidadeBaciaM3}
                    onChange={(e) => handleInputChange('capacidadeBaciaM3', e.target.value)} className={inputClass} />
                </BessField>
                <div className="sm:col-span-2 lg:col-span-3">
                  <BessField label="Contenção de óleo dos transformadores" required>
                    <input name="contencaoOleoTransf" type="text" value={formData.contencaoOleoTransf}
                      onChange={(e) => handleInputChange('contencaoOleoTransf', e.target.value)} className={inputClass} />
                  </BessField>
                </div>
              </div>
            </Section>

            <Section heading="Documentos">
              <div className="space-y-3">
                <DocumentItemCard id="BESS-LP-028" title="Programa de Gerenciamento de Riscos (PGR)" />
                <DocumentItemCard id="BESS-LP-029" title="PAEA específico para disparada térmica" />
              </div>
            </Section>
          </div>
        )}

        {/* ETAPA 4 */}
        {currentStep === 4 && (
          <div data-step="4" className="space-y-6 animate-in fade-in-50 duration-150">
            <Section heading="Resíduos">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <BessField label="Empresa de destinação das baterias danificadas">
                  <input name="empresaDestinacao" type="text" value={formData.empresaDestinacao}
                    onChange={(e) => handleInputChange('empresaDestinacao', e.target.value)} className={inputClass} />
                </BessField>
                <BessField label="Quantidade de baterias" error={fieldErrors.qtdBaterias}>
                  <input name="qtdBaterias" type="number" step="1" value={formData.qtdBaterias}
                    onChange={(e) => handleInputChange('qtdBaterias', e.target.value)} className={inputClass} />
                </BessField>
              </div>
              <div className="mt-4">
                <DocumentItemCard id="BESS-LP-033" title="Certificado de Destinação" />
              </div>
            </Section>

            <Section heading="Colocalização">
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    O BESS é colocalizado com usina existente? <span className="text-rose-500 ml-0.5">*</span>
                  </span>
                  <div role="radiogroup" aria-label="Colocalização" aria-required="true" className="flex flex-wrap items-center gap-6 pt-1">
                    <RadioOption name="colocalizado" value="sim" label="Sim" checked={formData.colocalizado === 'sim'} onChange={() => handleInputChange('colocalizado', 'sim')} />
                    <RadioOption name="colocalizado" value="nao" label="Não (stand-alone)" checked={formData.colocalizado === 'nao'} onChange={() => handleInputChange('colocalizado', 'nao')} />
                  </div>
                </div>

                {formData.colocalizado === 'sim' && (
                  <div data-branch="colocalizado-sim" className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60">
                    <BessField label="Usina geradora associada: Nº do processo ou portaria" required>
                      <input name="usinaAssociada" type="text" value={formData.usinaAssociada}
                        onChange={(e) => handleInputChange('usinaAssociada', e.target.value)} className={inputClass} />
                    </BessField>
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Infraestruturas compartilhadas <span className="text-rose-500 ml-0.5">*</span>
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {INFRA_OPCOES.map((item) => (
                          <label key={item.id}
                            className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-all ${
                              formData.infraCompartilhada.includes(item.id)
                                ? 'border-[var(--color-brand-primary)] bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-900 dark:text-white font-medium ring-1 ring-[var(--color-brand-primary)]'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}>
                            <input type="checkbox" name={`infra-${item.id}`} checked={formData.infraCompartilhada.includes(item.id)}
                              onChange={() => toggleList('infraCompartilhada', item.id)} className="rounded text-[var(--color-brand-primary)] focus:ring-[var(--color-border-focus)]" />
                            <span className="text-xs">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {formData.infraCompartilhada.includes('outro') && (
                      <div data-branch="infra-outro">
                        <BessField label="Descrição de outra infraestrutura" required>
                          <input name="descricaoOutraInfra" type="text" value={formData.descricaoOutraInfra}
                            onChange={(e) => handleInputChange('descricaoOutraInfra', e.target.value)} className={inputClass} />
                        </BessField>
                      </div>
                    )}
                    <DocumentItemCard id="BESS-LP-051" title="Avaliação de impactos cumulativos e incrementais" />
                  </div>
                )}
              </div>
            </Section>
          </div>
        )}

        {/* ETAPA 5 */}
        {currentStep === 5 && (
          <div data-step="5" className="space-y-6 animate-in fade-in-50 duration-150">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Revisão do FCE BESS — Licença Prévia</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Conferência dos campos disponíveis nesta página. Dados Gerais, catálogos e documentos vinculados não estão conectados; o envio oficial permanece indisponível.
              </p>
            </div>

            <ReviewBlock step={1} title="Engenharia e Tecnologia">
              <Item label="Potência instalada" value={v(formData.potenciaInstalada)} />
              <Item label="Área ocupada" value={v(formData.areaOcupadaHa, ' ha')} />
              <Item label="Vida útil prevista" value={v(formData.vidaUtilAnos, ' anos')} />
              <Item label="Arranjo construtivo" value={formData.arranjoConstrutivo === 'containers' ? 'Containers modulares outdoor' : formData.arranjoConstrutivo === 'alvenaria' ? 'Edificação de alvenaria dedicada' : 'Não informado'} />
              <Item label="Fabricante" value={v(formData.fabricante)} />
              <Item label="Modelo" value={v(formData.modelo)} />
              <Item label="Química da célula" value={formData.quimicaCelula || 'Opções indisponíveis'} />
              {formData.arranjoConstrutivo==='containers'&&<><Item label="Área do container" value={v(formData.areaContainerM2,' m²')}/><Item label="Quantidade de containers" value={v(formData.qtdContainers)}/></>}
              {formData.arranjoConstrutivo==='alvenaria'&&<Item label="Área do galpão" value={v(formData.areaGalpaoM2,' m²')}/>}
              <Item label="Descrição do BMS" value={v(formData.descricaoBms)}/><Item label="Potência dos transformadores" value={v(formData.potenciaTransformadores)}/><Item label="Subestação de acesso" value={v(formData.subestacaoAcesso)}/>
              <Item label="Número de inversores (PCS)" value={v(formData.numInversoresPcs)} />
              <Item label="Tensão de conexão" value={v(formData.tensaoConexaoKv, ' kV')} />
            </ReviewBlock>

            <ReviewBlock step={2} title="Diagnóstico Acústico">
              <div className="sm:col-span-2 lg:col-span-3">{soundTable(true)}</div>
              <Item label="Componentes tonais" value={formData.componentesTonais === 'sim' ? 'Sim' : formData.componentesTonais === 'nao' ? 'Não' : 'Não informado'} />
            </ReviewBlock>

            <ReviewBlock step={3} title="Riscos e Incêndio">
              <Item label="Tipo de detecção" value={formData.tipoDeteccao.length ? labelsOf(formData.tipoDeteccao, DETECCAO_OPCOES) : 'Não informado'} />
              {formData.tipoDeteccao.includes('outro')&&<Item label="Descrição do outro tipo de detecção" value={v(formData.descricaoOutroDeteccao)}/>}
              <Item label="Agente de supressão automática" value={formData.agenteSupressao || 'Opções indisponíveis'}/><Item label="Contenção de óleo dos transformadores" value={v(formData.contencaoOleoTransf)}/>
              <Item label="Reserva de água" value={v(formData.reservaAguaM3, ' m³')} />
              <Item label="Capacidade da bacia" value={v(formData.capacidadeBaciaM3, ' m³')} />
            </ReviewBlock>

            <ReviewBlock step={4} title="Resíduos e Colocalização">
              <Item label="Colocalizado com usina existente" value={formData.colocalizado === 'sim' ? 'Sim' : formData.colocalizado === 'nao' ? 'Não (stand-alone)' : 'Não informado'} />
              {formData.colocalizado === 'sim' && <Item label="Usina geradora associada" value={v(formData.usinaAssociada)} />}
              {formData.colocalizado === 'sim' && <Item label="Infraestruturas compartilhadas" value={formData.infraCompartilhada.length ? labelsOf(formData.infraCompartilhada, INFRA_OPCOES) : 'Não informado'} />}
              {formData.colocalizado==='sim'&&formData.infraCompartilhada.includes('outro')&&<Item label="Descrição de outra infraestrutura" value={v(formData.descricaoOutraInfra)}/>}
              <Item label="Empresa de destinação" value={v(formData.empresaDestinacao)} /><Item label="Quantidade de baterias" value={v(formData.qtdBaterias)}/>
            </ReviewBlock>
            <Section heading="Documentos referenciados" description="O vínculo com Documentos Obrigatórios não está conectado. Esta conferência não valida anexos nem gera envio.">
              <DocumentItemCard id="BESS-LP-015" title="Polígono do BESS e da subestação" required/>
              <DocumentItemCard id="BESS-LP-050" title="Planta do projeto"/>
              <DocumentItemCard id="BESS-LP-019" title="Espectro de frequências por fonte (catálogos ou ensaios)" required/>
              <DocumentItemCard id="BESS-LP-020" title="Medição do ruído residual (baseline) na APTA" required/>
              <DocumentItemCard id="BESS-LP-021" title="Plano de atenuação física (barreiras ou enclausuramento)"/>
              <DocumentItemCard id="BESS-LP-028" title="Programa de Gerenciamento de Riscos (PGR)"/>
              <DocumentItemCard id="BESS-LP-029" title="PAEA específico para disparada térmica"/>
              <DocumentItemCard id="BESS-LP-033" title="Certificado de Destinação"/>
              {formData.colocalizado==='sim'&&<DocumentItemCard id="BESS-LP-051" title="Avaliação de impactos cumulativos e incrementais"/>}
            </Section>
          </div>
        )}

        {/* Navegação */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" className="text-xs h-9" onClick={handleCancel}>Cancelar</Button>
            {currentStep > 1 && (
              <Button type="button" variant="outline" size="sm" className="gap-2 text-xs h-9" onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}>
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs h-9" onClick={handleSaveDraft}>
              <Save className="w-4 h-4" />
              <span>Salvar Rascunho</span>
            </Button>
            {currentStep < 5 ? (
              <Button type="button" color="primary" size="sm" className="gap-2 text-xs h-9"
                onClick={() => setCurrentStep((p) => Math.min(5, p + 1))}>
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <><Button type="button" color="gray" size="sm" disabled title="Envio oficial indisponível neste protótipo."><Send size={16}/>Enviar FCE</Button><Button type="button" color="primary" size="sm" disabled={totalPendencias > 0}
                className="gap-2 text-xs h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => { dialogTrigger.current=document.activeElement as HTMLElement; setDemoConcluida(false); setShowSubmitModal(true); }}>
                <span>{totalPendencias > 0 ? `Concluir demonstração (${totalPendencias} ${totalPendencias === 1 ? 'pendência' : 'pendências'})` : 'Concluir demonstração'}</span>
              </Button></>
            )}
          </div>
        </div>
      </main>

      {/* MODAL: Adicionar fonte sonora */}
      <Dialog open={showAddSoundModal} onOpenChange={setShowAddSoundModal}>
        <DialogContent className="bess-dialog sm:max-w-md" onCloseAutoFocus={event=>{event.preventDefault();dialogTrigger.current?.focus();}}>
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">{editingSoundId?'Editar fonte sonora':'Adicionar fonte sonora'}</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Informe o equipamento ou fonte, a quantidade e o LWA (dBA).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <BessField label="Equipamento ou fonte" required>
              <input name="novaFonteEquipamento" type="text" value={newSoundEquip} onChange={(e) => setNewSoundEquip(e.target.value)} className={inputClass} />
            </BessField>
            <div className="grid grid-cols-2 gap-4">
              <BessField label="Quantidade" required error={soundQuantityError}>
                <input name="novaFonteQuantidade" type="number" step="1" value={newSoundQtd} onChange={(e) => setNewSoundQtd(e.target.value)} className={inputClass} />
              </BessField>
              <BessField label="LWA" suffix="dBA" required error={soundLwaError}>
                <input name="novaFonteLwa" type="number" step="any" value={newSoundLwa} onChange={(e) => setNewSoundLwa(e.target.value)} className={inputClass} />
              </BessField>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setShowAddSoundModal(false)}>Cancelar</Button>
            <Button type="button" color="primary" size="sm" disabled={!canAddSound}
              className="text-xs disabled:opacity-50" onClick={handleAddSoundSource}>
              {editingSoundId?'Salvar alterações':'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Envio demonstrativo */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="bess-dialog sm:max-w-lg" onCloseAutoFocus={event=>{event.preventDefault();dialogTrigger.current?.focus();}}>
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              {demoConcluida ? 'Demonstração concluída' : 'Confirmar conclusão da demonstração'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 pt-1">
              {demoConcluida
                ? 'Demonstração concluída. Nenhum FCE foi enviado ao SEIA/SEI e nenhum protocolo foi gerado.'
                : 'Este protótipo não está conectado ao SEIA/SEI. A confirmação apenas encerra a demonstração da jornada; nenhum dado será enviado ou gravado.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {!demoConcluida ? (
              <>
                <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setShowSubmitModal(false)}>Continuar editando</Button>
                <Button type="button" color="primary" size="sm" className="text-xs" onClick={() => setDemoConcluida(true)}>
                  Concluir demonstração
                </Button>
              </>
            ) : (
              <Button type="button" color="primary" size="sm" data-action="fechar-conclusao" className="text-xs" onClick={() => setShowSubmitModal(false)}>
                Fechar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoineBessLpPage;
