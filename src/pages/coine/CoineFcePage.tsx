import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Plus, Save, Trash2 } from 'lucide-react';
import { FilamentWizard } from '@/components/filament/Wizard';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GlaTable, GlaTableBody, GlaTableContainer, GlaTableHead, GlaTh, GlaTd, GlaTableRow } from '@/components/common/GlaTable';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';
import { activeFields, computedOccupation, FceData, FceDefinition, FceField, FceValue, isFieldRequired, stepErrors } from './coineFces';
import { FilamentSelect } from '@/components/filament/Select';
import './coine-fces.css';

const inputClass = 'w-full min-w-0 border-0 bg-transparent px-3 py-2 text-sm text-[var(--color-text-primary)] focus:ring-0';
const hasOther = (value: FceValue | undefined) => (Array.isArray(value) ? value : [value]).some(v=>typeof v==='string' && /^(outro|outra)/i.test(v));
const displayValue = (field: FceField, data: FceData): string => {
  if(field.type==='computed')return field.compute ? field.compute(data) : `${computedOccupation(data)}${computedOccupation(data)==='Não calculado'?'':' ha/torre'}`;
  if(field.type==='pending')return 'Pendente de integração';
  const value=data[field.key];
  if(field.type==='table')return `${Array.isArray(value)?value.length:0} registro(s)`;
  if(Array.isArray(value))return (value as string[]).join(', ') || 'Não informado';
  return (value?.trim() || 'Não informado') + (value?.trim() && field.unit?` ${field.unit}`:'');
};

function Field({field,data,onChange,error,prefix=''}:{field:FceField;data:FceData;onChange:(key:string,value:FceValue)=>void;error?:string;prefix?:string}) {
  const id = `coine-${prefix}${field.key}`;
  const value = data[field.key] || '';
  const description = [field.hint?`${id}-hint`:'',error?`${id}-error`:''].filter(Boolean).join(' ') || undefined;
  const isReq = isFieldRequired(field, data);
  let control: React.ReactNode;
  if(field.type==='computed') control=<output id={id} className="coine-output">{field.compute ? field.compute(data) : <>{computedOccupation(data)}{computedOccupation(data)!=='Não calculado'&&' ha/torre'}</>}</output>;
  else if(field.type==='document')control=<div><InputWrapper valid={!error}><input id={id} type="file" aria-required={isReq} aria-invalid={!!error} aria-describedby={description} className={inputClass} onChange={e=>{const file=e.target.files?.[0]; if(file)onChange(field.key,`${file.name} (${file.size} bytes — metadados locais)`); e.target.value='';}}/></InputWrapper>{value&&<p className="coine-hint">{String(value)} <Button type="button" variant="ghost" aria-label={`Remover referência de ${field.label}`} onClick={()=>onChange(field.key,'')}>Remover</Button></p>}</div>;
  else if(field.type==='pending')control=<p id={id} className="coine-pending">Pendente de integração</p>;
  else if(field.type==='radio' || field.type==='checks')control=<div className="coine-options" role={field.type==='radio'?'radiogroup':'group'} aria-labelledby={`${id}-label`} aria-describedby={description} aria-required={isReq || undefined}>
    {field.options?.map(option=><label className="coine-option" key={option}><input type={field.type==='radio'?'radio':'checkbox'} name={id} value={option} checked={field.type==='radio'?value===option:Array.isArray(value)&&(value as string[]).includes(option)} onChange={e=>onChange(field.key,field.type==='radio'?option:e.target.checked?[...(Array.isArray(value)?value:[]),option] as string[]:(Array.isArray(value)?value:[]).filter(v=>v!==option) as string[])} aria-invalid={!!error}/><span>{option}</span></label>)}
  </div>;
  else if(field.type==='table') {
    const rows=(Array.isArray(value)?value:[]) as Record<string,string>[];
    control=<div className="coine-table-field"><GlaTableContainer heading={field.label} actions={<Button type="button" variant="outline" onClick={()=>onChange(field.key,[...rows,Object.fromEntries((field.columns || []).map(c=>[c.key,'']))])}><Plus className="size-4"/>Adicionar registro</Button>}>
      <div className="coine-table-scroll" role="region" aria-label={field.label} tabIndex={0}><GlaTable><GlaTableHead><tr>{field.columns?.map(c=><GlaTh key={c.key}>{c.label}{c.unit?` (${c.unit})`:''}</GlaTh>)}<GlaTh>Ações</GlaTh></tr></GlaTableHead><GlaTableBody>
      {!rows.length?<GlaTableRow><GlaTd colSpan={(field.columns?.length || 0)+1}>Nenhum registro adicionado.</GlaTd></GlaTableRow>:rows.map((row,i)=><GlaTableRow key={i}>{field.columns?.map(column=><GlaTd key={column.key}><Field field={{...column,label:`${column.label} — registro ${i+1}`}} data={row} prefix={`${field.key}-${i}-`} onChange={(key,v)=>onChange(field.key,rows.map((r,n)=>n===i?{...r,[key]:String(v)}:r))}/>{hasOther(row[column.key])&&column.options?.some(o=>/^(outro|outra)/i.test(o))&&<Field field={{key:column.key+'Descricao',label:`Descreva a outra opção — ${column.label}`,required:true}} data={row} prefix={`${field.key}-${i}-`} onChange={(key,v)=>onChange(field.key,rows.map((r,n)=>n===i?{...r,[key]:String(v)}:r))}/>}</GlaTd>)}<GlaTd><Button type="button" variant="outline" aria-label={`Remover registro ${i+1} de ${field.label}`} onClick={()=>onChange(field.key,rows.filter((_,n)=>n!==i))}><Trash2 className="size-4"/></Button></GlaTd></GlaTableRow>)}
      </GlaTableBody></GlaTable></div></GlaTableContainer></div>;
  } else control=<InputWrapper valid={!error} suffix={field.unit} suffixIcon={field.type==='select'?ChevronDown:undefined}>
    {field.type==='select'?<select id={id} name={field.key} value={String(value)} className={inputClass} aria-required={isReq} aria-invalid={!!error} aria-describedby={description} onChange={e=>onChange(field.key,e.target.value)}><option value="">Selecione...</option>{field.options?.map(o=><option key={o}>{o}</option>)}</select>:
    field.type==='textarea'?<textarea id={id} name={field.key} value={String(value)} className={inputClass} aria-required={isReq} aria-invalid={!!error} aria-describedby={description} onChange={e=>onChange(field.key,e.target.value)}/>:
    <input id={id} name={field.key} type="text" inputMode={field.type==='integer'?'numeric':field.type==='number'?'decimal':'text'} value={String(value)} className={inputClass} aria-required={isReq} aria-invalid={!!error} aria-describedby={description} onChange={e=>onChange(field.key,e.target.value)}/>}
  </InputWrapper>;
  return <div className={`coine-field ${['table','textarea','radio','checks'].includes(field.type || '')?'coine-field-wide':''}`} data-field={field.key}>
    {field.type!=='table'&&(['radio','checks','pending'].includes(field.type || '')?<span id={`${id}-label`} className="coine-label">{field.label}{isReq&&<span aria-hidden="true"> *</span>}</span>:<label className="coine-label" htmlFor={id}>{field.label}{isReq&&<span aria-hidden="true"> *</span>}</label>)}
    {control}
    {field.hint&&<p id={`${id}-hint`} className="coine-hint">{field.hint}</p>}
    {error&&<p id={`${id}-error`} className="coine-error">{error}</p>}
  </div>;
}

export function CoineFcePage({definition,onNavigate,nested=false}:{definition:FceDefinition;onNavigate:(route:string)=>void;nested?:boolean}) {
  const [data,setData]=useState<FceData>(definition.phases?{_phase:definition.phases[0]}:{});
  const [step,setStep]=useState(1);
  const [checked,setChecked]=useState<number[]>([]);
  const [notice,setNotice]=useState('');
  const [saved,setSaved]=useState(()=>JSON.stringify(definition.phases?{_phase:definition.phases[0]}:{}));
  const [exit,setExit]=useState(false);
  const [complete,setComplete]=useState(false);
  const heading=useRef<HTMLHeadingElement>(null);
  const wizard=useRef<HTMLDivElement>(null);
  const phase=String(data._phase || definition.phases?.[0] || 'LP');
  const current=definition.steps[step-1]; const last=step===definition.steps.length;
  const errors=last?Object.assign({},...definition.steps.map(s=>stepErrors(s,data))):stepErrors(current,data);
  const dirty=JSON.stringify(data)!==saved;
  const storageKey=`inema-coine-${definition.kind}-lp-v1`;
  useEffect(()=>{
    const listener=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};
    window.addEventListener('beforeunload',listener);return()=>window.removeEventListener('beforeunload',listener);
  },[dirty]);
  useEffect(()=>{
    const active=wizard.current?.querySelectorAll('li')[step-1];
    if(active&&wizard.current){const list=active.parentElement; if(list)list.scrollLeft=Math.max(0,(active as HTMLElement).offsetLeft-list.offsetLeft);}
  },[step]);
  function update(key:string,value:FceValue){setData(d=>({...d,[key]:value}));setComplete(false);setNotice('');}
  function go(next:number){setStep(next);setNotice('');requestAnimationFrame(()=>heading.current?.focus());}
  function validate(){
    setChecked(c=>[...new Set([...c,step])]);
    if(Object.keys(errors).length){setNotice(last?'Revise os campos indicados antes de concluir a demonstração.':'Revise os campos indicados antes de avançar.');requestAnimationFrame(()=>document.querySelector<HTMLElement>('.coine-fce [aria-invalid="true"]')?.focus());return false;}
    return true;
  }
  function saveDraft(){try{localStorage.setItem(storageKey,JSON.stringify({version:1,kind:definition.kind,data,step}));setSaved(JSON.stringify(data));setNotice('Rascunho salvo somente neste navegador. Nenhum dado foi enviado ao INEMA.');}catch{setNotice('Não foi possível salvar neste navegador. Os dados permanecem nesta sessão.');}}
  function restoreDraft(){
    try{
      const raw=localStorage.getItem(storageKey); if(!raw){setNotice('Não há rascunho local salvo para este FCE.');return;}
      const draft:unknown=JSON.parse(raw);
      if(!draft||typeof draft!=='object'||!('version'in draft)||draft.version!==1||!('kind'in draft)||draft.kind!==definition.kind||!('data'in draft)||!draft.data||typeof draft.data!=='object')throw new Error('invalid');
      const source=draft.data as Record<string,unknown>; const clean:FceData={};
      if(definition.phases){if(typeof source._phase!=='string'||!definition.phases.includes(source._phase))throw new Error('invalid phase');clean._phase=source._phase;}
      for(const stage of definition.steps)for(const section of stage.sections)for(const f of section.fields){
        const v=source[f.key];
        if(typeof v==='string'&& !['table','checks','pending','computed'].includes(f.type || '')) {
          if((f.type==='select'||f.type==='radio')&&v&&!f.options?.includes(v))throw new Error('invalid choice');
          clean[f.key]=v;
        }
        else if(Array.isArray(v)&&f.type==='checks'&&v.every(x=>typeof x==='string'&&f.options?.includes(x)))clean[f.key]=v;
        else if(Array.isArray(v)&&f.type==='table'&&v.every(x=>x&&typeof x==='object'&&!Array.isArray(x)))clean[f.key]=v.map(row=>Object.fromEntries((f.columns || []).flatMap(c=>[[c.key,typeof row[c.key]==='string'?row[c.key]:''],[c.key+'Descricao',typeof row[c.key+'Descricao']==='string'?row[c.key+'Descricao']:'']])));
        else if(v!==undefined && !['pending','computed'].includes(f.type || ''))throw new Error('invalid field');
        if(typeof source[f.key+'Descricao']==='string')clean[f.key+'Descricao']=source[f.key+'Descricao'] as string;
      }
      setData(clean);setSaved(JSON.stringify(clean));setChecked([]);setComplete(false);setNotice('Rascunho local recuperado. Revise os dados antes de continuar.');
    }catch{setNotice('O rascunho não pôde ser recuperado. Os dados atuais foram preservados.');}
  }
  function returnToOrigin(){if(window.history.state?.coineOrigin)window.history.back();else onNavigate(nested?'inicio':'relatorios');}
  const requestBack=()=>dirty?setExit(true):returnToOrigin();
  return <div className="coine-fce" data-fce={definition.kind}>
    {nested&&<SeiaV2Breadcrumb items={[{label:'Início',route:'inicio'},{label:definition.title}]} onNavigate={()=>requestBack()}/>}
    <header className="coine-heading"><Button type="button" variant="ghost" className="coine-back" aria-label="Voltar ao portal" onClick={requestBack}><ArrowLeft className="size-4"/></Button><div><h1 ref={heading} tabIndex={-1}>{definition.title}</h1><p>Caracterização do empreendimento — {definition.phases?`cenário ${phase}`:'Licença Prévia (LP)' }.</p></div></header>
    <p className="coine-context">{definition.phases?`Demonstração local com dados sintéticos. ${definition.phaseNote || 'Enquadramento e licença anterior não conectados; fase informada no contexto demonstrativo.'} Não há envio oficial ou protocolo.`:'Demonstração local. A fase representa o cenário LP; o enquadramento e os documentos do requerimento não estão conectados. Não há envio oficial ou protocolo.'}</p>
    {definition.phases&&<Section heading="Contexto demonstrativo" description="Selecione o cenário de origem para conferir as regras por fase. Nenhum enquadramento real é executado."><div className="coine-grid"><div className="coine-field"><label className="coine-label" htmlFor="coine-phase">Fase de solicitação — cenário local</label><FilamentSelect id="coine-phase" value={phase} options={definition.phases} onChange={v=>update('_phase',v)} ariaLabel="Fase de solicitação — cenário local"/></div></div></Section>}
    <div className="coine-draft-actions"><span>Dados preservados ao navegar entre as etapas.</span><Button variant="outline" type="button" onClick={()=>{if(dirty){if(!window.confirm('Recuperar o rascunho salvo e substituir os dados ainda não salvos desta sessão?'))return;}restoreDraft();}}>Retomar rascunho local</Button></div>
    <div ref={wizard} className="coine-wizard"><FilamentWizard currentStep={step} steps={definition.steps.map((s,i)=>({id:i+1,label:s.title,isCompleted:checked.includes(i+1)&&!Object.keys(stepErrors(s,data)).length&&i<definition.steps.length-1}))} onStepClick={go}/></div>
    <main><p className="coine-stage" aria-live="polite">Etapa {step} de {definition.steps.length} — {current.title}</p>
      {notice&&<p className="coine-notice" role="status">{notice}</p>}
      {!last?<div className="coine-sections">{current.sections.filter(section=>section.fields.length===0||activeFields(section,data).length>0).map(section=><Section key={section.title} heading={section.title} description={section.note}>
        <div className="coine-grid">{activeFields(section,data).map(field=><React.Fragment key={field.key}><Field field={field} data={data} onChange={update} error={checked.includes(step)?errors[field.key]:undefined}/>{hasOther(data[field.key])&&field.options?.some(o=>/^(outro|outra)/i.test(o))&&<Field field={{key:field.key+'Descricao',label:`Descreva a outra opção — ${field.label}`,required:true,type:'textarea'}} data={data} onChange={update} error={checked.includes(step)?errors[field.key+'Descricao']:undefined}/>}</React.Fragment>)}</div>
        {!!section.documents?.length&&<div className="coine-documents"><h4>Referências documentais</h4><ul>{section.documents.map(doc=><li key={doc}>{doc}</li>)}</ul><p>Os arquivos devem vir de Documentos Obrigatórios do requerimento. Esta demonstração não anexa nem confirma a análise desses documentos.</p></div>}
      </Section>)}</div>:<div className="coine-sections">
        <Section heading="Revisão das informações" description="Confira os dados declarados. Campos condicionais não aplicáveis ficam fora deste resumo.">
          {complete&&<p className="coine-notice" role="status">Demonstração concluída. Não houve envio oficial, emissão de licença ou geração de protocolo.</p>}
          <p className="coine-review-count">{Object.keys(errors).length} campo(s) local(is) pendente(s). Documentos, catálogos e verificações institucionais continuam sujeitos às integrações indicadas.</p>
        </Section>
        {definition.steps.slice(0,-1).map((stage,i)=><Section key={stage.title} heading={stage.title} headerActions={<Button type="button" variant="outline" onClick={()=>go(i+1)}>Revisar etapa {i+1}</Button>}>
          {stage.sections.filter(section=>section.fields.length===0||activeFields(section,data).length>0).map(section=><div className="coine-review-section" key={section.title}><h4>{section.title}</h4><dl>{activeFields(section,data).map(f=><React.Fragment key={f.key}><dt>{f.label}</dt><dd data-review={f.key}>{displayValue(f,data)}{hasOther(data[f.key])&&data[f.key+'Descricao']?` — ${data[f.key+'Descricao']}`:''}{f.type==='table'&&(data[f.key] as Record<string,string>[] || []).map((r,index)=><ul key={index}>{f.columns?.map(c=><li key={c.key}>{c.label}: {r[c.key] || 'Não informado'}{c.unit?` ${c.unit}`:''}</li>)}</ul>)}{errors[f.key]&&<span className="coine-error">{errors[f.key]}</span>}</dd></React.Fragment>)}</dl>{!!section.documents?.length&&<p className="coine-hint">Referências documentais: {section.documents.join('; ')}. Vínculo institucional pendente.</p>}</div>)}
        </Section>)}
      </div>}
      <footer className="coine-footer"><Button type="button" variant="outline" onClick={()=>step>1?go(step-1):requestBack()}><ArrowLeft className="size-4"/>{step>1?'Anterior':'Voltar'}</Button><div><Button type="button" variant="outline" onClick={saveDraft}><Save className="size-4"/>Salvar rascunho local</Button>{last?<Button type="button" onClick={()=>{if(validate())setComplete(true);}}>Concluir demonstração</Button>:<Button type="button" onClick={()=>{if(validate())go(step+1);}}>Próxima<ArrowRight className="size-4"/></Button>}</div></footer>
    </main>
    <Dialog open={exit} onOpenChange={setExit}><DialogContent className="coine-dialog"><DialogHeader><DialogTitle>Sair sem salvar as alterações?</DialogTitle><DialogDescription>Existem dados ainda não salvos neste navegador. Você pode voltar ao preenchimento ou sair sem atualizar o rascunho local.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={()=>setExit(false)}>Continuar preenchendo</Button><Button color="danger" onClick={()=>{setExit(false);returnToOrigin();}}>Sair sem salvar</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}
