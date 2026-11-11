import { MOCK_UNIDADES_CONSERVACAO } from '@/data/ceucMock';
import { CATEGORIES, fields, isFileField, setByLabel } from './catalog';
import { civil, defaultParameters, id, mandateEnd, newElection, newImplementation, refreshAlerts } from './domain';
import { documentPdf, planDocument } from './documents';
import type { Actor, Category, Council, Dor, Meeting, Registration, Repository, Role, Seat, Segment, Values } from './types';
export const CLOCK='2026-10-26T15:00:00Z';
export const ROLE_NAMES:Record<Role,string>={coordenador:'Coordenação CGEUC',tecnico:'Técnico CGEUC',gestor:'Gestor da UC',dg:'Diretoria-Geral',projur:'PROJUR',comissao:'Comissão Eleitoral',candidato:'Instituição candidata',conselheiro:'Conselheiro / representante legal',secretaria:'Secretaria Executiva delegada',publico:'Consulta pública'};
export function actorFor(role:Role):Actor{return {id:['candidato','conselheiro','secretaria'].includes(role)?'usuario-externo-demo':role+'-demo',role,ucIds:MOCK_UNIDADES_CONSERVACAO.map(u=>u.id),institutionId:['candidato','conselheiro','secretaria'].includes(role)?'sc-1':undefined,delegated:role==='secretaria'};}
export function demoForm(dor:Dor,section:string,c:Council,file='demo-base'):Values {
 const v:Values={};for(const f of fields(dor,section)){
  let value='Informação fictícia para demonstração';
  if(isFileField(f))value=file;else if(/Assinatura/i.test(f.label))value='Aceite demonstrativo — sem assinatura institucional';
  if(/Nome da UC|Nome do conselho|^Conselho$/.test(f.label))value=c.uc.name;
  else if(f.label==='Atuação')value='Municipal';
  else if(/Nome do gestor/.test(f.label))value=c.uc.manager;
  else if(/Cargo/.test(f.label))value='Gestor — demonstração';
  else if(/Matrícula/.test(f.label))value='DEMO-001';
  else if(/Lotação/.test(f.label))value='CGEUC — contexto fictício';
  else if(/Grupo da UC/.test(f.label))value=c.uc.group;
  else if(/Categoria da UC/.test(f.label))value=c.uc.category;
  else if(/RPGA/.test(f.label))value=c.uc.rpga;
  else if(/Bacia/.test(f.label))value=c.uc.basin;
  else if(/Município da sede|Cidade/.test(f.label))value=c.uc.municipalities[0];
  else if(/Endereço/.test(f.label))value='Endereço fictício de avaliação, s/n';
  else if(/e-mail|E-mail/.test(f.label))value='conselho@example.invalid';
  else if(/Telefone|Celular/.test(f.label))value='00000000000';
  else if(/CPF/.test(f.label)&&!/Upload/.test(f.type))value='52998224725';
  else if(f.label==='CNPJ')value='11222333000181';
  else if(/Data|^Local/.test(f.label)&&!/Upload|Anexo/.test(f.type))value=f.label.startsWith('Data')?civil(CLOCK):'Local fictício de avaliação';
  else if(/Número do processo|Nº do processo/.test(f.label))value='SEI-DEMO-'+c.uc.id;
  else if(/Biênio/.test(f.label))value='2026–2028';
  else if(f.type==='Numérico')value='2';
  v[f.key]=value;
 }return v;
}
export function blankMeeting(c:Council,date='2026-11-20'):Meeting{return {id:id(),type:'Ordinária',order:(c.implementation?.meetings.length||0)+1,date,time:'09:00',place:'Local fictício de reunião',mode:'Presencial',duration:'2 horas',agenda:'',sendPlanned:civil(CLOCK),shortNoticeReason:'',state:'Prevista',attendance:c.composition.filter(s=>s.active).map(s=>({seatId:s.id,titular:'N/A',alternate:'N/A',proxy:'',proxyDocument:'',justification:''})),minute:'',acts:[],externalAttendance:''};}
export function blankRegistration(c:Council,actor:Actor):Registration {return {id:id(),institutionId:actor.institutionId||id(),owner:actor.id,forms:{'18.5':{},'18.7':{}},category:'Poder Público',name:'',segment:'Poder Público',origin:actor.role==='candidato'?'Portal Externo':'E-mail',receivedAt:'2026-10-26T12:00',reference:'',status:'Rascunho',reason:''};}
export function registrationFixture(c:Council,category:Category,owner='usuario-externo-demo',file='demo-'+owner):Registration {
 const r=blankRegistration(c,{...actorFor('candidato'),id:owner});r.category=category;if(category==='Sociedade Civil Local Não Formalizada')r.participants=[{name:'Participante Fictício',cpf:'52998224725',signature:'Aceite demonstrativo'}];r.forms={'18.5':demoForm('DOR0031','18.5',c,file),'18.7':demoForm('DOR0031','18.7',c,file)};r.name=category==='Sociedade Civil Local Formalizada'?'Associação Fictícia de Demonstração':category+' — instituição fictícia';r.segment=category==='Poder Público'?'Poder Público':category==='Empreendedor Local'?'Empreendedores Locais':'Sociedade Civil Local';
 setByLabel('DOR0031','18.5',r.forms['18.5'],'Nome da instituição',r.name);setByLabel('DOR0031','18.5',r.forms['18.5'],'Nome do titular','Titular Fictício');setByLabel('DOR0031','18.5',r.forms['18.5'],'Nome do suplente','Suplente Fictício');setByLabel('DOR0031','18.5',r.forms['18.5'],'Categoria de atuação',category);return r;
}
export function initialRepository():Repository {
 const councils:Council[]=MOCK_UNIDADES_CONSERVACAO.map((u,index)=>{
  const c:Council={id:'cg-'+u.id,uc:{id:u.id,name:u.nome,group:u.grupoManejo,category:u.categoria,municipalities:u.municipiosAbrangidos||[u.municipio],territory:u.territorioIdentidade||'Território do CEUC',rpga:u.rpga||'RPGA demonstrativa',basin:'Bacia demonstrativa — contrato CEUC pendente',address:'Endereço fictício de avaliação, s/n',phone:'00000000000',manager:'Gestor de demonstração',managerAssigned:true,job:'Gestor da UC',registration:'DEMO-001',office:'CGEUC — demonstração',email:'gestor@example.invalid',source:'Identidade da UC: contrato CEUC local. Conselho e contatos: dados fictícios.'},pastElections:[],pastImplementations:[],composition:[],waiting:[],appointmentNumber:'',publication:'',expiry:'',posse:'',reconductions:0,addenda:[],attachments:[],audit:[]};
  const base=documentPdf(planDocument('Documento fictício de avaliação',['Arquivo de teste sem ocorrência ou assinatura real.'],CLOCK));c.attachments.push({id:'demo-base',name:'documento-ficticio.pdf',mime:'application/pdf',size:base.size,hash:'fixture-local',blob:base,at:CLOCK,purpose:'Base demonstrativa',ownerId:'gestor-demo'});
  for(const owner of ['usuario-externo-demo','outro-candidato-0','outro-candidato-2','outro-candidato-3'])c.attachments.push({...c.attachments[0],id:'demo-'+owner,ownerId:owner,purpose:'Arquivo fictício da instituição'});
  if(index===1){const e=newElection(c,CLOCK);e.technician='tecnico-demo';e.forms={'18.1':demoForm('DOR0031','18.1',c),'18.2':demoForm('DOR0031','18.2',c),'18.3':demoForm('DOR0031','18.3',c)};e.signedAt='2026-10-01T12:00:00Z';e.entities=[{id:id(),segment:'Poder Público',name:'Órgão Público Fictício',representative:'Representante Fictício',phone:'00000000000',email:'entidade@example.invalid',address:'Endereço fictício',city:u.municipio,channel:'E-mail'}];const ranges=[['2026-10-01T00:00','2026-10-01T23:59'],['2026-10-02T09:00','2026-10-28T18:00'],['2026-10-29T09:00','2026-10-31T18:00'],['2026-11-01T00:00','2026-11-01T23:59'],['2026-11-02T00:00','2026-11-04T23:59'],['2026-11-05T00:00','2026-11-05T23:59'],['2026-11-06T00:00','2026-11-06T17:59'],['2026-11-06T18:00','2026-11-08T18:00'],['2026-11-09T00:00','2026-11-09T23:59'],['2026-11-10T00:00','2026-11-10T23:59'],['2026-11-12T09:00','2026-11-12T18:00']];e.stages=e.stages.map((s,i)=>({...s,start:ranges[i][0],end:ranges[i][1]}));e.publishedAt='2026-10-01';e.doeAttachment='demo-base';e.state='Em andamento — Mobilização e Inscrição';e.registrations=CATEGORIES.map((cat,n)=>{const r=registrationFixture(c,cat,n===1?'usuario-externo-demo':'outro-candidato-'+n);r.institutionId=n===1?'sc-1':'instituicao-'+n;return r;});e.plenarySchedule=(['Poder Público','Sociedade Civil Local','Empreendedores Locais'] as Segment[]).map(segment=>({segment,date:'2026-11-12',time:'09:00',mode:'Presencial'}));e.plenaryHistory=[];e.projurReference='SEI-PROJUR-DEMO-001';e.projurAttachment='demo-base';c.election=e;} if(index===2){const e=newElection(c,CLOCK);e.technician='tecnico-demo';e.forms={'18.1':demoForm('DOR0031','18.1',c)};c.election=e;}
  if(index===0||index===3){c.publication=index===0?'2026-08-05':'2024-08-05';c.expiry=mandateEnd(c.publication);c.appointmentNumber='PORTARIA-DEMO-'+(index+1);c.posse=addDate(c.publication,15);const i=newImplementation(c.publication+'T12:00:00Z');i.forms={'18.1':demoForm('DOR0032','18.1',c),'18.2':demoForm('DOR0032','18.2',c)};i.signedAt=index===0?c.publication+'T12:00:00Z':'';i.checkedAt=index===0?i.signedAt:'';i.approvedAt=index===0?c.posse+'T12:00:00Z':'';i.calendarApproval='Planejamento inicial demonstrativo — aprovação anterior pendente L21';c.implementation=i;c.composition=(['Poder Público','Sociedade Civil Local','Empreendedores Locais'] as Segment[]).flatMap((segment,g)=>[0,1].map((n):Seat=>({id:`s-${g}-${n}`,institutionId:g===1&&n===0?'sc-1':`inst-${g}-${n}`,institution:n===0&&g===0?'Órgão Gestor — reserva':'Instituição Fictícia '+(g+1)+'.'+(n+1),segment,titular:`Titular Fictício ${g+1}.${n+1}`,alternate:`Suplente Fictício ${g+1}.${n+1}`,reserved:n===0&&g===0,active:true})));if(index===0){const m=blankMeeting(c,'2026-10-10');m.agenda='Avaliação demonstrativa das ações do conselho';m.approvedAt='2026-09-20T12:00:00Z';m.signedAt=m.approvedAt;m.sentAt=m.approvedAt;m.sendPlanned='2026-09-20';m.state='Realizada';m.attendance=m.attendance.map(a=>({...a,titular:'P'}));m.minute='demo-base';i.meetings.push(m);const m2=blankMeeting(c,'2026-11-20');m2.order=2;m2.agenda='Planejamento das ações do conselho para o próximo exercício';m2.state='Prevista';i.meetings.push(m2);const m3=blankMeeting(c,'2026-12-15');m3.order=3;m3.agenda='Reunião extraordinária de deliberação orçamentária';m3.approvedAt='2026-10-20T10:00:00Z';m3.signedAt='2026-10-21T10:00:00Z';m3.state='Prevista';i.meetings.push(m3);i.documents.push(planDocument('Calendário de reuniões',[`${m.date} — ${m.agenda}`,`${m2.date} — ${m2.agenda}`],CLOCK,true));}}
  return c;
 });
 const repo:Repository={schema:1,revision:0,clock:CLOCK,councils,settings:{mandateAlerts:[120,60],stageLead:2,posseLead:5},alerts:[]};refreshAlerts(repo);return repo;
}
function addDate(value:string,days:number){const d=new Date(value+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
