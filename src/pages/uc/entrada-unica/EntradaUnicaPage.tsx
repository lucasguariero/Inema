import { aadDocuments } from '../aadDomain';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, History, Info, Save } from 'lucide-react';
import { Section, FilamentSelect, FilamentWizard } from '@/components/filament';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GlaInput } from '@/components/gla/primitives/GlaInput';
import { GlaRadioGroup } from '@/components/gla/primitives/GlaRadioGroup';
import { GlaCheckbox } from '@/components/gla/primitives/GlaCheckbox';
import { GlaTableContainer, GlaTable, GlaTableHead, GlaTh, GlaTableBody, GlaTableRow, GlaTd, GlaPagination } from '@/components/common/GlaTable';
import { ATRATIVOS_MOCK, UNIDADES_CONSERVACAO_BAHIA as UCS } from '../AgendamentoVisitacaoPage';
import { CATEGORIAS, CONDICOES, LEGENDAS, MENSAGENS, PARAMETROS, REQUERENTE } from '@/data/entradaUnicaUc';
import { categoriaNome, classificarEntrada, destinoEntrada, eventoEntrada, formatEntrada, invalidarEntrada, isVisitacao, nomeResultado, novaEntrada, telasEntrada, validarOndeEntrada, validarTipoEntrada, verificarDataEntrada, type EntradaRecord, type TelaEntrada } from '@/lib/entradaUnicaUc';
import { entradaPorId, gravarEntrada, minhasEntradas } from '@/lib/entradaUnicaUcStorage';
import './entradaUnica.css';

const nomes: Record<TelaEntrada,string> = { inicio:'Entrada Única para Realização de Atividade em Unidade de Conservação', dados:'Quem e Onde', atividade:'Tipo de atividade', condicoes:'Condições da atividade', data:'Data pretendida', resultado:'Resultado da triagem', consulta:'Minhas triagens', historico:'Histórico da triagem' };
const codes: Record<TelaEntrada,string> = { inicio:'TL001',dados:'TL002',atividade:'TL003',condicoes:'TL004',data:'TL005',resultado:'TL006',consulta:'TL007',historico:'TL008' };
const etapas = [{id:1,label:'Dados comuns'},{id:2,label:'Tipo de atividade'},{id:3,label:'Condições e data'}];
const erro = (e: unknown) => e instanceof Error ? e.message : 'Não foi possível concluir a operação.';
// Atualiza somente a apresentação do rótulo legado; o evento armazenado permanece íntegro.
function snapshotApresentacao(snapshot: string) {
  const data = JSON.parse(snapshot);
  if (data.category === 'Atividade Didática Tipo 1 (educação formal)') data.category = categoriaNome('9');
  return JSON.stringify(data, null, 2);
}
export function EntradaAviso({ children, danger = false }: {children:React.ReactNode;danger?:boolean}) {
  return <div className={`eu-aviso${danger ? ' eu-erro' : ''}`} role={danger ? 'alert' : 'note'} tabIndex={danger?-1:undefined}><Info size={18} aria-hidden="true"/><div>{children}</div></div>;
}
export function EntradaResumo({ record:r }: {record:EntradaRecord}) {
  return <dl className="eu-resumo"><div><dt>Requerente</dt><dd>{REQUERENTE.name}</dd></div><div><dt>Unidade de Conservação</dt><dd>{r.ucName || 'Não informada'}</dd></div><div><dt>Local / atrativo</dt><dd>{r.localName || 'Não especificado'}</dd></div><div><dt>Atividade</dt><dd>{categoriaNome(r.category)}{r.category === 'outra' && <p>{r.description}</p>}</dd></div><div><dt>Data pretendida</dt><dd>{formatEntrada(r.date,true)}</dd></div><div><dt>Abertura da triagem</dt><dd>{formatEntrada(r.opening)}</dd></div></dl>;
}
function guardarTela(tela:TelaEntrada,r?:EntradaRecord):TelaEntrada {
  if (['inicio','consulta'].includes(tela)) return tela;
  if (!r) return 'inicio';
  if (tela === 'historico') return tela;
  if (r.status === 'Cancelada') return 'historico';
  if (tela !== 'dados' && validarOndeEntrada(r,UCS,ATRATIVOS_MOCK)) return 'dados';
  if (['condicoes','data','resultado'].includes(tela) && validarTipoEntrada(r)) return 'atividade';
  if (['data','resultado'].includes(tela) && isVisitacao(r.category) && !r.conditionsReviewed) return 'condicoes';
  if (tela === 'condicoes' && !isVisitacao(r.category)) return 'data';
  if (tela === 'resultado' && (r.policy !== PARAMETROS.version || r.calendar !== PARAMETROS.calendarVersion)) return 'data';
  if (tela === 'resultado' && (verificarDataEntrada(r).valid === false || !r.result)) return 'data';
  return tela;
}
export function EntradaUnicaPage({onNavigate}:{onNavigate?:(route:string)=>void}) {
  const [tela,setTela] = useState<TelaEntrada>('inicio');
  const [record,setRecord] = useState<EntradaRecord>();
  const [records,setRecords] = useState<EntradaRecord[]>([]);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [cadastro,setCadastro] = useState(false);
  const [cancel,setCancel] = useState<EntradaRecord>();
  const [search,setSearch] = useState('');
  const [status,setStatus] = useState('Todos');
  const [page,setPage] = useState(1);
  const title = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLDivElement>(null);
  function refresh() { try { setRecords(minhasEntradas()); return true; } catch(e) { setError(erro(e)); return false; } }
  function load() {
    try {
      const params = new URLSearchParams(location.search), id = params.get('triagem-id');
      const current = id ? entradaPorId(id) : undefined;
      const requested = params.get('triagem-tela') || 'inicio';
      const valid = telasEntrada.includes(requested as TelaEntrada);
      const safe = guardarTela(valid ? requested as TelaEntrada : 'inicio',current);
      setRecord(current);setTela(safe);setRecords(minhasEntradas());
      setError(id && !current ? 'Triagem não encontrada para este requerente. Consulte os registros deste navegador.' : !valid ? 'Tela não reconhecida. Retorne ao início do serviço.' : safe !== requested ? 'Conclua as informações anteriores para acessar esta etapa.' : '');
    } catch(e) {setTela('inicio');setError(erro(e));}
  }
  useEffect(()=>{load();const changed=()=>load();window.addEventListener('popstate',changed);return()=>window.removeEventListener('popstate',changed);},[]);
  useEffect(()=>{
    title.current?.focus();
    root.current?.querySelectorAll('.fi-sc-wizard-header-step-btn').forEach((button,index)=>{if(index === (tela==='dados'?0:tela==='atividade'?1:2)) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current');});
  },[tela]);
  useEffect(()=>{if(error){const alert=root.current?.querySelector<HTMLElement>('[role="alert"]');alert?.scrollIntoView({block:'center'});alert?.focus();}},[error]);
  useEffect(()=>{const warn=(event:BeforeUnloadEvent)=>{try{if(!record || JSON.stringify(record)===JSON.stringify(entradaPorId(record.id)))return;}catch{/* Falha de armazenamento: manter aviso de edição aberta. */}event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[record]);
  function go(next:TelaEntrada,r=record) {
    const safe=guardarTela(next,r);setTela(safe);setError(safe!==next?'Conclua as informações anteriores para acessar esta etapa.':'');setNotice('');
    const url=new URL(location.href);url.searchParams.set('rota','uc-entrada-unica');url.searchParams.set('triagem-tela',safe);
    if(r)url.searchParams.set('triagem-id',r.id);else url.searchParams.delete('triagem-id');
    history.pushState({},'',url);window.scrollTo({top:0,behavior:'instant'});
  }
  function persist(r:EntradaRecord,action:string) {
    try { const saved=gravarEntrada(eventoEntrada(r,action));setRecord(saved);refresh();setError('');return saved;}catch(e){setError(erro(e));return;}
  }
  function patch(p:Partial<EntradaRecord>) {if(record){const next={...invalidarEntrada(record,p),screen:tela,updated:new Date().toISOString()};setRecord(next);setNotice('');try{gravarEntrada(next);setError('');}catch(e){setError(erro(e));}}}
  function start() {const saved=persist(novaEntrada(),'Triagem iniciada');if(saved)go('dados',saved);}
  function move(next:TelaEntrada) {if(!record)return;const saved=persist({...record,screen:next,...(tela==='condicoes'&&next==='data'?{conditionsReviewed:true}:{})},'Etapa registrada: '+nomes[tela]);if(saved)go(next,saved);}
  function next() {
    if(!record)return;
    const message=tela==='dados'?validarOndeEntrada(record,UCS,ATRATIVOS_MOCK):tela==='atividade'?validarTipoEntrada(record):tela==='data'&&!verificarDataEntrada(record).valid?verificarDataEntrada(record).message:'';
    if(message){setError(message);return;}
    if(tela==='data') {
      const r={...record,status:'Classificada' as const,result:classificarEntrada(record),destination:destinoEntrada(record),policy:PARAMETROS.version,calendar:PARAMETROS.calendarVersion,screen:'resultado' as const};
      const saved=persist(r,'Triagem classificada: '+nomeResultado(r));if(saved)go('resultado',saved);
    } else move(tela==='dados'?'atividade':tela==='atividade'?(isVisitacao(record.category)?'condicoes':'data'):'data');
  }
  function save() {if(record){const saved=persist({...record,screen:tela},'Rascunho salvo');if(saved)setNotice(MENSAGENS.MSG016);}}
  function handoff(r=record) {
    if(!r || r.status==='Cancelada' || !destinoEntrada(r))return;
    if(r.policy!==PARAMETROS.version || r.calendar!==PARAMETROS.calendarVersion){setRecord(r);go('data',r);setError('Os parâmetros foram atualizados. Confira a data e refaça a classificação.');return;}
    if(validarOndeEntrada(r,UCS,ATRATIVOS_MOCK)||validarTipoEntrada(r)||!verificarDataEntrada(r).valid){setError('Revise os dados antes de abrir o formulário.');return;}
    const saved=persist({...r,destination:destinoEntrada(r)},'Continuidade solicitada');
    if(saved){const url=new URL(location.href);url.searchParams.set('triagem-id',saved.id);url.searchParams.set('triagem-tela','resultado');history.replaceState({},'',url);onNavigate?.(saved.destination!);}
  }
  const active=['dados','atividade','condicoes','data'].includes(tela);
  const uc=UCS.find(u=>u.value===record?.ucId);
  const locais=record?ATRATIVOS_MOCK[record.ucId]||[]:[];
  const date=record?verificarDataEntrada(record):undefined;
  const filtered=records.filter(r=>(status==='Todos'||r.status===status)&&`${r.ucName} ${r.localName} ${categoriaNome(r.category)} ${r.id}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const pageItems=filtered.slice((page-1)*5,page*5);
  return <div ref={root} className="entrada-unica" data-screen={codes[tela]}>
    <div className="eu-actions"><Button color="gray" outlined onClick={()=>{if(record&&active){const saved=persist({...record,screen:tela},'Consulta aberta');if(!saved)return;}refresh();go('consulta');}}><ClipboardList size={16}/>Minhas triagens</Button></div>
    <header className="eu-title"><div><h1 tabIndex={-1} ref={title}>{nomes[tela]}</h1><p>{tela==='inicio'?'Identifique sua atividade e encontre o formulário adequado.':tela==='consulta'?'Acompanhe e retome os registros salvos neste navegador.':tela==='historico'?'Eventos e decisões deste registro demonstrativo.':'Entrada Única para Realização de Atividade em Unidade de Conservação'}</p></div><Badge color="warning">Demonstração</Badge></header>
    <p className="eu-demo">Dados fictícios • Sem protocolo ou envio ao INEMA • Salvos somente neste navegador</p>
    {error&&<EntradaAviso danger>{error}</EntradaAviso>}
    {notice&&<div role="status" className="eu-aviso"><CheckCircle2 size={18}/>{notice}</div>}
    {active&&<div className="eu-stepper"><FilamentWizard steps={etapas} currentStep={tela==='dados'?1:tela==='atividade'?2:3} onStepClick={n=>{const target=n===1?'dados':n===2?'atividade':isVisitacao(record?.category||'')?'condicoes':'data';if(record){const safe=guardarTela(target,record);if(safe!==target){setError('Conclua as informações anteriores para acessar esta etapa.');return;}move(target);}}}/></div>}
    {tela==='inicio'&&<>
      <Section heading="Antes de começar" description={LEGENDAS.LEG001}><p>{MENSAGENS.MSG001}</p><div className="eu-grid eu-intro"><div><h2>1. Dados comuns</h2><p>Confira quem solicita e informe a Unidade de Conservação e o local.</p></div><div><h2>2. Tipo de atividade</h2><p>Escolha uma categoria para orientar o enquadramento.</p></div><div><h2>3. Condições e data</h2><p>Informe as condições aplicáveis e a data pretendida.</p></div></div><EntradaAviso>Unidades de Conservação são áreas protegidas para conservação da natureza. Texto de orientação provisório, sujeito à validação da área responsável.</EntradaAviso><p className="eu-muted">Nesta triagem não são solicitados anexos, horários, infraestrutura detalhada nem dados de pesquisa. O preenchimento específico acontece no formulário de destino.</p><div className="eu-actions"><Button onClick={start}>Iniciar<ArrowRight size={16}/></Button></div></Section>
    </>}
    {tela==='dados'&&record&&<>
      <Section heading="Quem solicita" description={MENSAGENS.MSG002} headerActions={<Button color="gray" outlined onClick={()=>setCadastro(true)}>Conferir cadastro</Button>}><dl className="eu-resumo"><div><dt>Nome</dt><dd>{REQUERENTE.name}</dd></div><div><dt>CPF fictício</dt><dd>{REQUERENTE.cpf}</dd></div><div><dt>E-mail</dt><dd>{REQUERENTE.email}</dd></div><div><dt>Telefone fictício</dt><dd>{REQUERENTE.phone}</dd></div></dl><p className="eu-muted">{LEGENDAS.LEG002}</p></Section>
      <Section heading="Onde será realizada" description="Selecione a UC e, quando necessário, um local cadastrado."><div className="eu-fields"><div><label htmlFor="eu-uc">Unidade de Conservação <span aria-hidden="true">*</span></label><FilamentSelect id="eu-uc" ariaLabel="Unidade de Conservação" required searchable value={record.ucId} options={UCS.filter(u=>u.habilitada)} placeholder="Selecione a UC" onChange={value=>{const chosen=UCS.find(u=>u.value===value);patch({ucId:value,ucName:chosen?.label||''});}}/><p className="eu-muted">{LEGENDAS.LEG003}</p></div>{uc&&<p className="eu-muted">Habilitação demonstrativa: disponível para esta triagem.</p>}{uc&&<dl className="eu-resumo eu-summary"><div><dt>Categoria</dt><dd>{uc.categoria}</dd></div><div><dt>Município</dt><dd>{uc.municipio}</dd></div></dl>}
      {!!locais.length&&<div><label htmlFor="eu-local">Local / atrativo (opcional)</label><FilamentSelect id="eu-local" ariaLabel="Local ou atrativo" searchable value={record.localId} options={[{value:'',label:'Não especificado'},...locais.filter(l=>l.disponivel)]} placeholder="Selecione, se aplicável" onChange={value=>patch({localId:value,localName:locais.find(l=>l.value===value)?.label||''})}/><p className="eu-muted">{LEGENDAS.LEG004}</p></div>}
      {uc&&!locais.length&&<EntradaAviso>Nenhum atrativo disponível no catálogo demonstrativo desta UC. Você pode continuar sem especificar um local; isso não confirma disponibilidade ou capacidade.</EntradaAviso>}
      {!!locais.filter(l=>!l.disponivel).length&&<details><summary>Locais indisponíveis</summary>{locais.filter(l=>!l.disponivel).map(l=><p key={l.value}>{l.label} — {l.motivo}. {MENSAGENS.MSG004}</p>)}</details>}
      <details><summary>UC indisponível no catálogo demonstrativo</summary>{UCS.filter(u=>!u.habilitada).map(u=><p key={u.value}>{u.label}. {MENSAGENS.MSG003}</p>)}</details><p className="eu-muted">Catálogo reaproveitado do protótipo. Não há consulta em tempo real ao CEUC.</p></div></Section>
    </>}
    {tela==='atividade'&&record&&<Section heading="O que pretende realizar?" description={MENSAGENS.MSG006}><fieldset><legend className="sr-only">Escolha uma única atividade</legend><GlaRadioGroup name="eu-atividade" options={[...CATEGORIAS.map(c=>({value:c.id,label:c.label,description:c.description})),{value:'outra',label:'Outra atividade',description:'Descreva a atividade quando nenhuma categoria corresponder.'}]} value={record.category} onChange={category=>patch({category})} className="eu-categorias"/></fieldset><p className="eu-muted">{LEGENDAS.LEG005}</p>{record.category==='outra'&&<div className="eu-fields"><label htmlFor="eu-outra">Descrição da atividade <span aria-hidden="true">*</span></label><textarea id="eu-outra" value={record.description} maxLength={PARAMETROS.otherLimit} rows={4} onChange={e=>patch({description:e.target.value})} aria-describedby="eu-outra-hint"/><p id="eu-outra-hint" className="eu-muted">{LEGENDAS.LEG006} {record.description.length}/{PARAMETROS.otherLimit} caracteres; limite demonstrativo.</p><EntradaAviso>Enquadramento manual pendente. Esta demonstração registra as informações, sem criar uma tramitação oficial.</EntradaAviso></div>}{record.category==='9'&&<EntradaAviso>Tipo 1: contato com o meio e educação ambiental, em qualquer nível de ensino. A ausência de coleta é condição da atividade; não define sua finalidade.</EntradaAviso>}</Section>}
    {tela==='condicoes'&&record&&<Section heading="Condições para solicitação de autorização" description={LEGENDAS.LEG007}><fieldset className="eu-condicoes"><legend>Marque todas as situações aplicáveis. Se nenhuma se aplicar, continue sem marcar.</legend>{CONDICOES.map(c=><GlaCheckbox key={c.key} id={`eu-${c.key}`} label={c.label} description={c.help} checked={record.conditions[c.key]} onChange={e=>patch({conditions:{...record.conditions,[c.key]:e.target.checked}})}/>)}</fieldset><EntradaAviso>{Object.values(record.conditions).some(Boolean)?MENSAGENS.MSG008:MENSAGENS.MSG009}</EntradaAviso>{!Object.values(record.conditions).some(Boolean)&&<p className="eu-muted">{LEGENDAS.LEG008}</p>}</Section>}
    {tela==='data'&&record&&date&&<Section heading="Quando pretende iniciar?" description={LEGENDAS.LEG009}><div className="eu-fields"><GlaInput id="eu-data" type="date" label="Data pretendida de início *" required value={record.date} onChange={e=>patch({date:e.target.value})} aria-describedby="eu-data-feedback"/><p className="eu-weekday">{record.date?formatEntrada(record.date,true):'O dia da semana será exibido após informar a data.'}</p><div className="eu-summary"><h2>Prazo mínimo demonstrativo</h2>{date.amount!==undefined?<><p><strong>{date.amount} dias {date.business?'úteis':'corridos'}</strong> a partir da abertura em {formatEntrada(record.opening)}.</p><p title={LEGENDAS.LEG011}>Primeira data compatível: <strong>{formatEntrada(date.next,true)}</strong></p></>:<p>Não há prazo homologado para este enquadramento. A data será registrada sem aplicar um prazo de outro processo.</p>}<p className="eu-muted">{LEGENDAS.LEG010}</p></div><div className="eu-row-actions"><Button color="gray" outlined onClick={()=>{setError(date.valid?'':date.message);setNotice(date.valid?date.message:'');}}>Verificar prazo</Button>{date.next && !date.valid && <Button color="gray" outlined onClick={()=>patch({date:date.next})}>Selecionar próxima data</Button>}</div><p id="eu-data-feedback" className="eu-muted">{record.date?date.message:'Informe uma data para verificar o prazo e os bloqueios demonstrativos.'}</p><EntradaAviso>Simulação de calendário: dias úteis de segunda a sexta, sem feriados oficiais. Exclui a abertura e inclui o último dia. Parâmetros, disponibilidade e forma de contagem dependem de homologação. A proposta de 60 dias para visitação permanece pendente.</EntradaAviso></div></Section>}
    {tela==='resultado'&&record&&<>
      <Section heading={nomeResultado(record)} description="A triagem orienta a continuidade; não concede autorização nem gera protocolo."><EntradaAviso>{({visitacao:MENSAGENS.MSG008+' '+MENSAGENS.MSG010,dispensa:MENSAGENS.MSG009,tipo1:MENSAGENS.MSG011,tipo2:MENSAGENS.MSG011,pesquisa:MENSAGENS.MSG012,manual:'Enquadramento pendente. '+MENSAGENS.MSG007}[classificarEntrada(record)])}</EntradaAviso>{classificarEntrada(record)==='manual'&&<p className="eu-muted">Mensagem de referência do fluxo futuro. Nenhuma análise foi enviada ou iniciada junto à equipe responsável.</p>}<EntradaResumo record={record}/><p className="eu-muted">{classificarEntrada(record)==='visitacao'?LEGENDAS.LEG012:['tipo1','tipo2'].includes(classificarEntrada(record))?LEGENDAS.LEG013:classificarEntrada(record)==='pesquisa'?LEGENDAS.LEG014:'A confirmação institucional permanece necessária.'}</p></Section>
      {destinoEntrada(record)&&<Section heading="Prepare os documentos" description={MENSAGENS.MSG014}>{['9','10'].includes(record.category)?<div className="eu-grid"><div><h2>Documentos para Atividade Didática {record.category==='9'?'Tipo I':'Tipo II'}</h2>{record.category==='9'&&<p>Proposta, pendente de confirmação.</p>}<ul className="list-disc pl-5">{aadDocuments({kind:record.category==='9'?'I':'II',data:{},choices:{}}).map(d=><li key={d.key}>{d.label}</li>)}</ul></div><div><h2>Documentos condicionais</h2>{record.category==='10'?<ul className="list-disc pl-5"><li>Aceite da instituição depositária, quando houver coleta de material biológico.</li><li>Declaração do comitê de ética, quando houver captura, coleta ou experimento com vertebrados silvestres.</li></ul>:<p>Lista complementar pendente de confirmação.</p>}<p>Termos de responsabilidade, compromisso e riscos: ciência ou anexação no formulário específico. Não anexe o requerimento em branco; o preenchimento é digital.</p><p>Alteração de cronograma: RG e CPF e novo cronograma — proposta, pendente de confirmação.</p></div></div>:<div className="eu-grid"><div><h2>Documentos obrigatórios</h2><p>Lista oficial não fornecida nas fontes disponíveis. Consulte a orientação do processo antes de um envio real.</p></div><div><h2>Documentos complementares</h2><p>Lista oficial pendente de validação. A ausência da lista nesta demonstração não significa dispensa documental.</p></div></div>}<p className="eu-muted">Apenas orientação: nenhum arquivo é solicitado aqui. {LEGENDAS.LEG016}</p></Section>}
      <div className="eu-actions"><Button color="gray" outlined onClick={()=>move('data')}><ArrowLeft size={16}/>Revisar triagem</Button><Button color="gray" outlined onClick={()=>go('historico')}>Abrir histórico</Button>{destinoEntrada(record)?<Button onClick={()=>handoff()}>Abrir formulário específico<ArrowRight size={16}/></Button>:<Button onClick={()=>{refresh();go('consulta');}}>Concluir e consultar triagem</Button>}</div>
      {destinoEntrada(record)&&<p className="eu-muted">{MENSAGENS.MSG013} O contexto é transferido localmente; nenhum processo institucional é criado.</p>}
    </>}
    {tela==='consulta'&&<>
      <div className="eu-filters"><GlaInput id="eu-busca" label="Buscar triagem" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="UC, atividade ou identificador"/><div><label htmlFor="eu-status">Situação</label><FilamentSelect id="eu-status" ariaLabel="Situação" value={status} options={['Todos','Rascunho','Classificada','Formulário aberto','Cancelada']} onChange={value=>{setStatus(value);setPage(1);}}/></div><Button onClick={start}>Nova triagem</Button></div>
      <GlaTableContainer heading="Registros do requerente demonstrativo" badge={`${filtered.length} ${filtered.length===1?'registro':'registros'}`} pagination={<GlaPagination page={page} totalPages={Math.max(1,Math.ceil(filtered.length/5))} totalCount={filtered.length} startIndex={filtered.length?(page-1)*5+1:0} currentCount={Math.min(page*5,filtered.length)} entityName={filtered.length===1?'triagem':'triagens'} rangeSeparator="–" onPageChange={setPage}/> }><GlaTable><GlaTableHead><tr><GlaTh scope="col">Triagem / UC</GlaTh><GlaTh scope="col">Atividade / data</GlaTh><GlaTh scope="col">Resultado / destino</GlaTh><GlaTh scope="col">Situação</GlaTh><GlaTh scope="col">Atualização</GlaTh><GlaTh scope="col">Ações</GlaTh></tr></GlaTableHead><GlaTableBody>{pageItems.map(r=><GlaTableRow key={r.id}><GlaTd><strong>{r.id.slice(0,8)}</strong><p>{r.ucName||'UC não informada'}</p><p className="eu-muted">{r.localName||'Local não especificado'}</p></GlaTd><GlaTd>{categoriaNome(r.category)}<p>{formatEntrada(r.date)}</p></GlaTd><GlaTd>{r.result?nomeResultado(r):'Não classificado'}<p className="eu-muted">{r.destination?'Formulário demonstrativo disponível':'Sem processo de destino definido'}</p></GlaTd><GlaTd><Badge color="gray">{r.status}</Badge></GlaTd><GlaTd><time dateTime={r.updated}>{new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(r.updated))}</time></GlaTd><GlaTd><div className="eu-row-actions">{r.status!=='Cancelada'&&<Button color="gray" outlined onClick={()=>{setRecord(r);go(r.result?'resultado':r.screen,r);}}>{r.result?'Ver resultado':'Retomar'}</Button>}<Button color="gray" outlined onClick={()=>{setRecord(r);go('historico',r);}}><History size={15}/>Abrir histórico</Button>{r.destination&&r.result&&r.status!=='Cancelada'&&<Button color="gray" outlined onClick={()=>handoff(r)}>Abrir formulário específico</Button>}{r.status==='Rascunho'&&PARAMETROS.cancelledDrafts&&<Button color="danger" outlined onClick={()=>setCancel(r)}>Cancelar</Button>}</div></GlaTd></GlaTableRow>)}{!pageItems.length&&<GlaTableRow><GlaTd colSpan={6}><div className="eu-empty"><ClipboardList size={26}/><h2>{records.length?'Nenhuma triagem corresponde aos filtros':'Você ainda não tem triagens neste navegador'}</h2><p>{records.length?'Altere a busca ou a situação para consultar outros registros.':'Inicie uma triagem para salvar e retomar seu preenchimento.'}</p></div></GlaTd></GlaTableRow>}</GlaTableBody></GlaTable></GlaTableContainer><p className="eu-table-hint">Deslize a tabela para consultar todas as colunas e ações. Com teclado, use Tab para acessar as ações.</p><p className="eu-muted">Sem expiração automática demonstrativa. Limpar os dados do navegador remove os registros. O cancelamento local mantém o histórico e não cancela um processo oficial.</p><Button color="gray" outlined onClick={()=>go('inicio')}><ArrowLeft size={16}/>Início do serviço</Button>
    </>}
    {tela==='historico'&&record&&<><Section heading={`Triagem ${record.id.slice(0,8)}`} description="Linha do tempo local, sem vínculo com o histórico do SEI."><EntradaResumo record={record}/><p className="eu-muted">Situação: {record.status}. {record.acceptedAt?'Vínculo demonstrativo: formulário de destino aberto com este contexto.':'Nenhum formulário de destino confirmou o recebimento deste registro.'}</p></Section><Section heading="Eventos da triagem"><ol className="eu-timeline">{[...record.events].reverse().map(e=><li key={e.revision}><div><h2>{e.action}</h2><time dateTime={e.at}>{new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(e.at))}</time><p className="eu-muted">{e.actor} • Revisão {e.revision}</p><details><summary>Dados e regras desta revisão</summary><pre>{snapshotApresentacao(e.snapshot)}</pre><p className="eu-muted">{e.rules}</p></details></div></li>)}</ol>{!record.events.length&&<p>Nenhum evento registrado.</p>}</Section><div className="eu-actions"><Button color="gray" outlined onClick={()=>{refresh();go('consulta');}}><ArrowLeft size={16}/>Voltar à consulta</Button>{record.acceptedAt&&record.destination&&record.status!=='Cancelada'&&<Button color="gray" outlined onClick={()=>handoff(record)}>Abrir formulário específico</Button>}{record.status!=='Cancelada'&&<Button onClick={()=>go(record.result?'resultado':record.screen)}>Retomar triagem</Button>}</div></>}
    {active&&<footer className="eu-actions eu-form-footer"><Button color="gray" outlined onClick={()=>move(tela==='dados'?'inicio':tela==='atividade'?'dados':tela==='condicoes'?'atividade':isVisitacao(record?.category||'')?'condicoes':'atividade')}><ArrowLeft size={16}/>Voltar</Button><Button color="gray" outlined onClick={save}><Save size={16}/>Salvar rascunho</Button><Button onClick={next}>{tela==='data'?'Ver resultado':tela==='atividade'?'Continuar classificação':'Avançar'}<ArrowRight size={16}/></Button></footer>}
    <Dialog open={cadastro} onOpenChange={setCadastro}><DialogContent><DialogHeader><DialogTitle>Cadastro demonstrativo</DialogTitle><DialogDescription>A identificação é fictícia e está disponível apenas para leitura neste protótipo.</DialogDescription></DialogHeader><p>A atualização cadastral pertence ao serviço de cadastro, que não está conectado nesta demonstração. Nenhuma alteração cadastral será simulada como gravada.</p><DialogFooter><Button onClick={()=>setCadastro(false)}>Entendi</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={!!cancel} onOpenChange={open=>{if(!open)setCancel(undefined);}}><DialogContent><DialogHeader><DialogTitle>Cancelar este rascunho?</DialogTitle><DialogDescription>Operação local demonstrativa. O registro e seu histórico serão preservados; nenhum processo institucional será afetado.</DialogDescription></DialogHeader><DialogFooter><Button color="gray" outlined onClick={()=>setCancel(undefined)}>Manter rascunho</Button><Button color="danger" onClick={()=>{if(cancel){const saved=persist({...cancel,status:'Cancelada'},'Rascunho cancelado localmente');if(saved){setCancel(undefined);setNotice('Rascunho cancelado neste navegador. Histórico preservado.');}}}}>Confirmar cancelamento</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}
