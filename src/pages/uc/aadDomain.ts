import { REQUERENTE } from '@/data/entradaUnicaUc';
import { civilDate, destinoEntrada, type EntradaRecord } from '@/lib/entradaUnicaUc';

export const AAD_MESSAGES = {
 missing: 'Preencha os campos obrigatórios para continuar.',
 confirm: 'O envio da solicitação não implica deferimento automático. Deseja continuar?',
 success: 'Solicitação registrada com sucesso. Aguarde análise do INEMA.',
 pending: 'Há pendências documentais ou técnicas. Providencie as complementações indicadas.',
 soon: 'O prazo de análise ou resposta está próximo do vencimento.',
 overdue: 'O prazo de análise ou resposta encontra-se vencido.',
 forwarded: 'Processo encaminhado com sucesso para a área responsável.',
 emitted: 'Documento emitido e disponibilizado ao interessado ou área demandante.',
 denied: 'Solicitação indeferida. Consulte a justificativa e, quando cabível, o prazo de recurso.',
 warning: 'A atividade somente poderá ocorrer após emissão formal do ato ou autorização pelo INEMA, quando aplicável.',
 typeI: 'Esta atividade se enquadra como Atividade Didática Tipo I pela finalidade de contato com o meio/educação ambiental. A coleta de material não é permitida neste enquadramento.'
};
export const AAD_STATUSES = ['Rascunho','Protocolado','Em triagem','Aguardando complementação','Em análise técnica','Em validação jurídica','Emitido/Respondido','Indeferido','Encerrado','Arquivado/Cancelado'] as const;
export type AadStatus = typeof AAD_STATUSES[number];
export type AadRole = 'requerente'|'gestor'|'cgeuc'|'consulta';
export interface AadField { key:string; label:string; type?:string; options?:string[]; optional?:boolean; multiline?:boolean; }
export const APPLICANT_FIELDS: AadField[] = [
 {key:'name',label:'Nome do titular'},{key:'cpf',label:'CPF'},{key:'area',label:'Área de atuação (áreas do conhecimento CNPq)'},
 {key:'link',label:'Vínculo institucional'},{key:'address',label:'Endereço para correspondência'},{key:'cep',label:'CEP'},
 {key:'city',label:'Município'},{key:'uf',label:'UF'},{key:'country',label:'País'},{key:'phone',label:'Telefone'},{key:'email',label:'E-mail',type:'email'}
];
export const INSTITUTION_FIELDS: AadField[] = [
 {key:'institution',label:'Instituição'},{key:'nature',label:'Natureza da instituição',options:['Pública','Particular']},{key:'cnpj',label:'CNPJ'},
 ...['address','cep','city','uf','country'].map(key=>({key:'institution_'+key,label:({address:'Endereço',cep:'CEP',city:'Município',uf:'UF',country:'País'} as Record<string,string>)[key]+' da instituição'}))
];
export const AAD_QUESTIONS: AadField[] = [
 {key:'traditional',label:'Acesso ao conhecimento tradicional'},{key:'genetic',label:'Acesso ao patrimônio genético'},
 {key:'bioprospecting',label:'Bioprospecção'},{key:'technology',label:'Desenvolvimento tecnológico'},
 {key:'social',label:'Pesquisa socioambiental/governança/gestão de unidades de conservação'},
 {key:'questionnaires',label:'Aplicação de questionários aos usuários e/ou funcionários da UC'},
 {key:'recording',label:'Observação e gravação de imagem ou som'},{key:'abioticData',label:'Levantamento de dados abióticos'},
 {key:'abiotic',label:'Coleta de amostras abióticas'},{key:'biological',label:'Coleta de material biológico'},
 {key:'capture',label:'Captura/contenção/marcação/soltura'},{key:'threatened',label:'Captura, transporte, armazenamento, guarda e manejo de espécie ameaçada de extinção'}
];
export interface AadRow { id:string; description:string; quantity:string; }
export interface AadDestination { id:string; institution:string; collection:string; curator:string; curatorEmail:string; institutionEmail:string; }
export interface AadAttachment { id:string; kind:string; name:string; type:string; size:number; content:string; }
export interface AadEvent { at:string; actor:string; action:string; before:AadStatus; after:AadStatus; reason:string; documents:string[]; previousData?:string; currentData?:string; }
export interface AadRecord {
 version:1; id:string; revision:number; owner:string; entrada:EntradaRecord; kind:'I'|'II'; status:AadStatus;
 data:Record<string,string>; choices:Record<string,string[]>; taxa:AadRow[]; materials:AadRow[]; destinations:AadDestination[];
 terms:Record<string,boolean>; attachments:AadAttachment[]; history:AadEvent[]; submittedAt?:string;
 responsible:string; opinionDeadline:string; soonDays:string; responseDeadline:string; opinion:string; conditions:string; checklist:string[];
}
export function newAad(entrada:EntradaRecord):AadRecord {
 if(destinoEntrada(entrada)!=='uc-atividades-didaticas' || !entrada.acceptedAt || entrada.owner!==REQUERENTE.id)throw Error('Conclua a Entrada Única antes de abrir o formulário AAD.');
 return {version:1,id:'AAD-DEMO-'+crypto.randomUUID(),revision:0,owner:entrada.owner,entrada:structuredClone(entrada),kind:entrada.category==='10'?'II':'I',status:'Rascunho',
 data:{name:REQUERENTE.name,cpf:REQUERENTE.cpf,email:REQUERENTE.email,phone:REQUERENTE.phone,accessStart:entrada.date.slice(0,7),accessEnd:entrada.date.slice(0,7),fieldStart:entrada.date},
 choices:{},taxa:[],materials:[],destinations:[],terms:{},attachments:[],history:[],responsible:'',opinionDeadline:'',soonDays:'',responseDeadline:'',opinion:'',conditions:'',checklist:[]};
}
export function canEditAad(r:AadRecord,role:AadRole) {return role==='requerente'&&r.owner===REQUERENTE.id&&['Rascunho','Aguardando complementação'].includes(r.status);}
export function aadDocuments(r:Pick<AadRecord,'kind'|'data'|'choices'>) {
 if(r.data.request==='Alteração de cronograma')return [{key:'identity',label:'RG e CPF',proposal:true},{key:'schedule',label:'Novo cronograma',proposal:true}];
 if(r.kind==='I')return [{key:'identity',label:'RG e CPF',proposal:true},{key:'link',label:'Comprovação de vínculo',proposal:true}];
 const list=[{key:'identity',label:'RG e CPF',proposal:false},{key:'institution',label:'Identificação da instituição (CNPJ, contrato ou estatuto social)',proposal:false},{key:'link',label:'Comprovação de vínculo',proposal:false},{key:'syllabus',label:'Ementa da disciplina',proposal:false},{key:'project',label:'Projeto da atividade',proposal:false},{key:'schedule',label:'Cronograma de execução',proposal:false},{key:'lattes',label:'Currículo Lattes',proposal:false}];
 if(r.data.biological==='Sim')list.push({key:'deposit',label:'Aceite da instituição depositária do material biológico',proposal:false});
 if(r.choices.bio?.includes('Fauna — vertebrados')&&(r.data.biological==='Sim'||r.data.capture==='Sim'))list.push({key:'ethics',label:'Declaração do comitê de ética (vertebrados silvestres)',proposal:false});
 return list;
}
export function aadChoiceEntries(r:AadRecord):[string,string[]][] {
 const pairs:[string,string,string][]=[['infrastructure','Infraestrutura','infrastructure']];
 if(r.kind==='II')pairs.push(['abiotic','Amostras abióticas','abiotic'],['bio','Material biológico','biological'],['fauna','Material da fauna','biological'],['capture','Método de coleta/captura','capture'],['marking','Método de marcação','capture'],['threatened','Espécies ameaçadas','threatened'],['threatenedList','Listas de referência','threatened']);
 return pairs.filter(([key,,condition])=>(r.data[condition]==='Sim'||key==='bio'&&r.data.capture==='Sim')&&r.choices[key]?.length&&(key!=='fauna'||r.choices.bio?.some(v=>v.startsWith('Fauna')))).map(([key,label])=>[label,r.choices[key]]);
}
export function activeAadFields(r:AadRecord):AadField[] {
 const fields=[...APPLICANT_FIELDS,...INSTITUTION_FIELDS,{key:'request',label:'Requerimento para',options:['Autorização de atividade didática','Alteração de cronograma']},{key:'objective',label:'Objetivo da atividade',multiline:true},{key:'level',label:'Nível de ensino',options:r.kind==='I'?['Básico','Médio','Técnico','Superior','Pós-Graduação','Outros']:['Técnico','Superior','Pós-Graduação','Outros']},{key:'accessStart',label:'Início do acesso à UC (mês/ano)',type:'month'},{key:'accessEnd',label:'Fim do acesso à UC (mês/ano)',type:'month'},{key:'infrastructure',label:'Utilização de infraestrutura',options:['Sim','Não']}];
 if(r.data.level==='Outros')fields.push({key:'levelOther',label:'Outro nível de ensino'});
 if(r.data.infrastructure==='Sim')fields.push({key:'infrastructureReason',label:'Justificativa para utilização da infraestrutura',multiline:true});
 if(r.choices.infrastructure?.includes('Outros')&&r.data.infrastructure==='Sim')fields.push({key:'infrastructureOther',label:'Outra infraestrutura'});
 if(r.kind==='I')return fields;
 fields.push(...AAD_QUESTIONS.map(f=>({...f,options:['Sim','Não']})),{key:'fieldStart',label:'Início da execução das atividades de campo',type:'date'},{key:'fieldEnd',label:'Fim da execução das atividades de campo',type:'date'});
 if(r.data.abiotic==='Sim')fields.push({key:'abioticQuantity',label:'Quantidade de amostras abióticas (com unidade)'});
 if(r.data.biological==='Sim'&&r.choices.bio?.includes('Flora'))fields.push({key:'flora',label:'Material da flora',options:['Partes da planta','Indivíduo','Partes da planta e indivíduo']});
 if(r.data.biological==='Sim'&&r.choices.bio?.some(v=>v.startsWith('Fauna'))&&r.choices.fauna?.includes('Outros'))fields.push({key:'faunaOther',label:'Outro material da fauna'});
 if(r.data.capture==='Sim'){
 fields.push({key:'effort',label:'Esforço de captura (número de armadilhas e frequência)'},{key:'chemical',label:'Contenção química',options:['Sim','Não']},{key:'euthanasia',label:'Eutanásia',options:['Sim','Não']});
 for(const key of ['capture','marking'])if(r.choices[key]?.includes('Outros'))fields.push({key:key+'Other',label:key==='capture'?'Outro método de coleta/captura':'Outro método de marcação'});
 for(const key of ['chemical','euthanasia'])if(r.data[key]==='Sim')fields.push({key:key+'Drugs',label:(key==='chemical'?'Contenção química':'Eutanásia')+' — princípios ativos'},{key:key+'Dose',label:(key==='chemical'?'Contenção química':'Eutanásia')+' — concentrações, doses e vias de administração'});
 }
 if((r.data.biological==='Sim'||r.data.abiotic==='Sim')&&r.taxa.some(t=>!t.quantity.trim()))fields.push({key:'quantityReason',label:'Justificativa para não prever a quantidade'});
 return fields;
}
export function validateAad(r:AadRecord):Record<string,string> {
 const errors:Record<string,string>={};
 for(const f of activeAadFields(r)){
 const v=r.data[f.key]?.trim();if(!v&&!f.optional)errors[f.key]='Informe '+f.label.toLocaleLowerCase('pt-BR')+'.';
 else if(v&&f.options&&!f.options.includes(v))errors[f.key]='Selecione uma opção disponível.';
 else if(v&&f.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))errors[f.key]='Informe um e-mail válido.';
 else if(v&&f.type==='date'&&!civilDate(v))errors[f.key]='Informe uma data válida.';
 else if(v&&f.type==='month'&&!/^\d{4}-(0[1-9]|1[0-2])$/.test(v))errors[f.key]='Informe mês e ano válidos.';
 }
 for(const [start,end]of[['accessStart','accessEnd'],...(r.kind==='II'?[['fieldStart','fieldEnd']]:[])])if(r.data[start]&&r.data[end]&&r.data[end]<r.data[start])errors[end]='O término não pode ser anterior ao início.';
 // Antecedência mínima pertence exclusivamente à Entrada Única; não é recalculada aqui.
 const choose=(key:string,label:string)=>{if(!r.choices[key]?.length)errors[key]='Selecione '+label+'.';};
 if(r.data.infrastructure==='Sim')choose('infrastructure','a infraestrutura');
 if(r.kind==='II'){
 if(r.data.abiotic==='Sim')choose('abiotic','o tipo de amostra');
 if(r.data.capture==='Sim'&&r.data.biological!=='Sim')choose('bio','o grupo envolvido na captura');
 if(r.data.biological==='Sim'){
 choose('bio','o material biológico');
 if(r.choices.bio?.some(b=>b.startsWith('Fauna')))choose('fauna','o material da fauna');
 if(!r.destinations.length)errors.destinations='Informe ao menos um destino do material biológico.';
 for(const d of r.destinations)if([d.institution,d.collection,d.curator,d.curatorEmail,d.institutionEmail].some(v=>!v.trim())||![d.curatorEmail,d.institutionEmail].every(v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)))errors.destinations='Complete instituição, coleção, curador e e-mails válidos de cada destino.';
 }
 if(r.data.capture==='Sim'){choose('capture','o método de coleta/captura');choose('marking','o método de marcação');}
 if(r.data.threatened==='Sim'){choose('threatened','fauna e/ou flora');choose('threatenedList','a lista brasileira e/ou baiana');}
 if(r.data.abiotic==='Sim'||r.data.biological==='Sim'){
 if(!r.taxa.length||r.taxa.some(t=>!t.description.trim()||(t.quantity.trim()&&!Number.isFinite(Number(t.quantity.replace(',','.'))))||(t.quantity.trim()&&Number(t.quantity.replace(',','.'))<=0)))errors.taxa='Informe táxon/substrato e quantidade positiva, ou justifique a quantidade não prevista.';
 }
 if(r.data.capture==='Sim'||r.data.abiotic==='Sim'||r.data.biological==='Sim')if(!r.materials.length||r.materials.some(t=>!t.description.trim()||!Number.isFinite(Number(t.quantity.replace(',','.')))||Number(t.quantity.replace(',','.'))<=0))errors.materials='Descreva os materiais utilizados e suas quantidades positivas.';
 }
 for(const d of aadDocuments(r))if(!r.attachments.some(a=>a.kind===d.key))errors['doc.'+d.key]='Inclua '+d.label+'.';
 for(const key of ['responsibility','commitment','risks'])if(!r.terms[key]&&!r.attachments.some(a=>a.kind==='term.'+key))errors['term.'+key]='Registre o aceite ou anexe o termo correspondente.';
 return errors;
}
export function aadEvent(r:AadRecord,action:string,actor:string,after=r.status,reason=''):AadRecord {
 return {...r,status:after,history:[...r.history,{at:new Date().toISOString(),actor,action,before:r.status,after,reason,documents:r.attachments.map(a=>a.name)}]};
}
export function submitAad(r:AadRecord,role:AadRole):AadRecord {
 if(!canEditAad(r,role))throw Error('Este perfil ou estado não permite enviar a solicitação.');
 if(Object.keys(validateAad(r)).length)throw Error(AAD_MESSAGES.missing);
 return {...aadEvent(r,r.status==='Aguardando complementação'?'Complementação registrada localmente':'Solicitação registrada localmente',REQUERENTE.name,'Protocolado'),submittedAt:new Date().toISOString()};
}
export type AadAction = 'Deferir/emitir'|'Indeferir'|'Solicitar complementação'|'Encaminhar'|'Arquivar'|'Cancelar';
export function decideAad(r:AadRecord,role:AadRole,action:AadAction,reason:string,destination=''):AadRecord {
 if(!['gestor','cgeuc'].includes(role)||['Rascunho','Emitido/Respondido','Indeferido','Encerrado','Arquivado/Cancelado'].includes(r.status))throw Error('Ação indisponível para este perfil ou estado demonstrativo.');
 if(['Indeferir','Arquivar','Cancelar','Encaminhar'].includes(action)&&!reason.trim())throw Error('Informe a justificativa da decisão.');
 if(action==='Encaminhar'&&!destination.trim())throw Error('Informe a área de destino.');
 if(action==='Solicitar complementação'&&(!reason.trim()||!civilDate(r.responseDeadline)))throw Error('Informe as pendências e o prazo de resposta.');
 if(action==='Deferir/emitir'&&(!r.opinion.trim()||Object.keys(validateAad(r)).length))throw Error('Conclua o parecer e as pendências obrigatórias antes de emitir a representação demonstrativa.');
 const status:AadStatus=action==='Deferir/emitir'?'Emitido/Respondido':action==='Indeferir'?'Indeferido':action==='Solicitar complementação'?'Aguardando complementação':action==='Encaminhar'?'Em análise técnica':'Arquivado/Cancelado';
 return aadEvent(r,action+' — demonstração',role==='gestor'?'Gestor da UC (demo)':'CGEUC/DISUC (demo)',status,reason+(destination?' | Destino: '+destination:''));
}
export function aadDeadline(r:AadRecord,today:string) {
 const date=r.status==='Aguardando complementação'?r.responseDeadline:r.opinionDeadline;
 if(!civilDate(date))return 'Sem prazo definido';
 if(date<today)return AAD_MESSAGES.overdue;
 const days=(Date.parse(date+'T12:00:00Z')-Date.parse(today+'T12:00:00Z'))/86400000;
 return r.soonDays.trim()&&Number(r.soonDays)>=0&&days<=Number(r.soonDays)?AAD_MESSAGES.soon:'Dentro do prazo configurado';
}
export function analysisAad(r:AadRecord,role:AadRole,patch:Pick<AadRecord,'responsible'|'opinionDeadline'|'soonDays'|'responseDeadline'|'opinion'|'conditions'|'checklist'>):AadRecord {
 if(!['gestor','cgeuc'].includes(role)||['Rascunho','Emitido/Respondido','Indeferido','Encerrado','Arquivado/Cancelado'].includes(r.status))throw Error('Análise indisponível para este perfil ou estado.');
 for(const d of [patch.opinionDeadline,patch.responseDeadline])if(d&&!civilDate(d))throw Error('Informe uma data de prazo válida.');
 if(patch.soonDays.trim()&&(!Number.isInteger(Number(patch.soonDays))||Number(patch.soonDays)<0))throw Error('O alerta deve ter um número inteiro de dias não negativo.');
 return aadEvent({...r,...patch},'Análise e prazos atualizados localmente',role==='gestor'?'Gestor da UC (demo)':'CGEUC/DISUC (demo)');
}

const DB='inema-aad-dor003-v1';
function openAad():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const q=indexedDB.open(DB,1);q.onupgradeneeded=()=>q.result.createObjectStore('records',{keyPath:'id'});q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(Error('Armazenamento local indisponível. Seus dados em edição foram preservados.'));q.onblocked=()=>reject(Error('Feche abas antigas para abrir os rascunhos locais.'));});}
export async function listAad():Promise<AadRecord[]>{const db=await openAad();return new Promise((resolve,reject)=>{const t=db.transaction('records'),q=t.objectStore('records').getAll();q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(Error('Não foi possível ler os registros locais.'));t.oncomplete=()=>db.close();});}
export async function saveAad(r:AadRecord):Promise<AadRecord>{
 const db=await openAad();return new Promise((resolve,reject)=>{const t=db.transaction('records','readwrite'),s=t.objectStore('records'),q=s.get(r.id);let result:AadRecord;let conflict=false;
 q.onsuccess=()=>{const old:AadRecord|undefined=q.result;if(old&&old.revision!==r.revision){conflict=true;t.abort();return;}
 const snapshot=(v:AadRecord|undefined)=>v?JSON.stringify({data:v.data,choices:v.choices,taxa:v.taxa,materials:v.materials,destinations:v.destinations,terms:v.terms,responsible:v.responsible,opinionDeadline:v.opinionDeadline,soonDays:v.soonDays,responseDeadline:v.responseDeadline,opinion:v.opinion,conditions:v.conditions,checklist:v.checklist,documents:v.attachments.map(({content,...metadata})=>metadata)}):'Registro ainda não existente';
 result={...r,revision:r.revision+1,history:r.history.map((h,i)=>i===r.history.length-1&&r.history.length>(old?.history.length||0)?{...h,previousData:snapshot(old),currentData:snapshot(r)}:h)};s.put(result);};
 t.oncomplete=()=>{db.close();resolve(result);};t.onabort=t.onerror=()=>{db.close();reject(Error(conflict?'Este registro mudou em outra aba. Reabra a versão atual antes de salvar.':'Não foi possível salvar neste navegador. Seus dados em edição foram preservados.'));};
 });
}
export function aadDate(value:string){if(!value)return 'Não informado';return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Bahia',dateStyle:'short',...(value.includes('T')?{timeStyle:'short' as const}:{})}).format(new Date(value.length===10?value+'T12:00:00Z':value));}
