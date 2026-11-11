import type { CerhData,Point,Venture } from './types';
import { officialStatuses,useTypes } from './types';
import { str } from './fields';
import { consolidation,num,regimeVolumes } from './rules';
import { purposeKey } from './administration';
import { displayStatus } from './decisions';
export interface TransferredPoint { number:string; type:Point['type']; fields:Record<string,unknown>; locked:string[]; source:string[] }
export interface RequestTransfer { ventureId:string; questions:Record<string,string>; locked:string[]; points:TransferredPoint[]; requester:{name:string;document:string;email:string;address:string}; payload:unknown[]; manual:string[]; geospatial:{codes:string;state:'INSTITUTIONAL PENDING';coordinates:unknown[]}; blocked?:string }
export const manualFields=['C002–C011: métodos de fornecimento quando não houver CERH','C016, C018, C019: recursos regularizados, DRDH e processo ANA','C017: aproveitamento hidrelétrico','C022–C024, C032–C038, C050–C056, C068–C074, C079–C085: poço/APPO/outorga anterior','C039, C057, C075, C125: processos e autorizações INEMA','C113, C143: outorga preventiva','C115–C127: barragem da captação superficial','C128–C168: shape, ANM, mineral e aquicultura','C170–C191, C196–C202: licença, área, descarga e proprietário','C210–C224: recursos regularizados, passivos CEFIR, DRDH, ANA','C229, C233: descrição da atividade'];
export function eligiblePoints(data:CerhData,ventureId:string) {return data.points.filter(p=>p.ventureId===ventureId&&!!p.number&&p.lifecycle!=='Rascunho'&&displayStatus(p)!=='Cancelado');}
export function interventionTransfer(p:Point) {
 if(p.type==='BAR')return {type:'Construção de barragem',description:''};
 const work=str(p.technical,'work'),service=str(p.technical,'service'),category=str(p.technical,'category');
 const type=category==='Aquicultura em tanque rede'?'Aquicultura':service==='Extração Mineral (sem uso de água para composição de polpa)'?'Exploração mineral':work==='Retificação/Canalização'?'Canalização/retificação':'Outras intervenções';
 return {type,description:type==='Outras intervenções'?[work||service||category,str(p.technical,'workDescription')||str(p.technical,'serviceDescription')].filter(Boolean).join(' — '):''};
}
export function transferCerh(data:CerhData,venture:Venture,manual:{C001?:string;appoCoordinates?:Record<string,{latitude:string;longitude:string}>}={}):RequestTransfer {
 const points=eligiblePoints(data,venture.id),has=(types:Point['type'][])=>points.some(p=>types.includes(p.type))?'Sim':'Não';
 const questions={C001:points.length?'Sim':manual.C001||'',C012:has(['SUB']),C013:has(['SUP']),C014:has(['BAR','INT']),C015:has(['EFL'])};
 const transferred=points.map(p=>{
   const max=consolidation(p.regimes).maximum;
   const coordinates= p.type==='SUB'&&manual.appoCoordinates?.[p.id] ? manual.appoCoordinates[p.id] : {latitude:p.location.latitude,longitude:p.location.longitude};
   const fields:Record<string,unknown>={identification:p.number,coordinates:{...coordinates,datum:'SIRGAS 2000'}};
   const source=['DC002::DP06'],codes:string[]=[];
   if(p.type==='SUB'){Object.assign(fields,{C226:str(p.technical,'depth'),C227:max===undefined?undefined:{litersPerSecond:max/3.6,cubicMetersPerHour:max},C228:p.purposes.map(purposeKey).filter(k=>['Abastecimento humano','Abastecimento industrial','Irrigação'].includes(k)).map(k=>k==='Abastecimento humano'?'Abastecimento Humano':k==='Abastecimento industrial'?'Abastecimento Industrial':k)});codes.push('C025/C086','C028/C089','C226','C227','C228');source.push(...['DP07','DP08','DP09','DP10'].map(x=>'DC002::'+x));}
   if(p.type==='SUP'){Object.assign(fields,{C097:p.regimes.length?Math.max(...p.regimes.map(r=>regimeVolumes(r).daily)):undefined,C114:str(p.technical,'reservoir'),C231:max===undefined?undefined:{litersPerSecond:max/3.6,cubicMetersPerHour:max},C232:p.purposes.map(purposeKey).filter(k=>['Abastecimento humano','Abastecimento industrial','Irrigação'].includes(k)).map(k=>k==='Abastecimento humano'?'Abastecimento Humano':k==='Abastecimento industrial'?'Abastecimento Industrial':k)});codes.push('C093/C096','C097','C114','C231','C232');source.push(...['DP11','DP12','DP13','DP14','DP15'].map(x=>'DC002::'+x));}
   if(p.type==='BAR'||p.type==='INT'){const i=interventionTransfer(p);Object.assign(fields,{intervention:i.type,...(i.description?{C203:i.description}:{})});source.push('DC002::DP'+(p.type==='BAR'?'17':'16'));codes.push('intervention');if(i.description){codes.push('C203');source.push('DC002::DP18');}if(p.type==='BAR'){fields.C192=str(p.technical,'damType')==='Barramento de regularização de vazão'?'Regularização de vazão':str(p.technical,'damType')==='Barramento de regularização de nível'?'Nível':undefined;fields.C195=str(p.technical,'volume');codes.push('C192','C195');source.push('DC002::DP19','DC002::DP20');}}
   if(p.type==='EFL'){codes.push('C204/C207');source.push('DC002::DP21');}
   return {number:p.number!,type:p.type,fields,locked:['identification','coordinates',...codes],source};
 });
 return {ventureId:venture.id,questions,locked:[...(points.length?['C001']:[]),'C012','C013','C014','C015'],points:transferred,requester:{name:venture.holder,document:venture.document,email:venture.email,address:venture.address},payload:points.map(p=>({DP23:p.number,DP24:useTypes[p.type],DP25:{latitude:p.location.latitude,longitude:p.location.longitude,datum:'SIRGAS 2000'},DP26:p.regimes.map(r=>({flow:num(r.flow),hours:num(r.hours)+(r.minutes?num(r.minutes):0)/60,days:num(r.days),months:r.months}))})),manual:manualFields,geospatial:{codes:'C099–C112',state:'INSTITUTIONAL PENDING',coordinates:transferred.map(p=>p.fields.coordinates)},...(!points.length&&manual.C001==='Sim'?{blocked:'É necessário realizar o Cadastro Estadual de Recursos Hídricos (CERH) em Meu Cadastro > Empreendimento para continuar.'}:{})};
}
export interface RequestDraft { status:'draft'|'finalized';transfer:RequestTransfer;manual:Record<string,unknown> }
export function syncOpenRequest(request:RequestDraft,data:CerhData,venture:Venture) {return request.status==='finalized'?request:{...request,transfer:transferCerh(data,venture,{C001:String(request.manual.C001||''),appoCoordinates:request.manual.appoCoordinates as Record<string,{latitude:string;longitude:string}>|undefined})};}
export function requestPreclassification(flowLs:number,options:{ruralIdentified?:boolean;purpose?:string}={}) {return {limit:options.ruralIdentified&&options.purpose==='Abastecimento humano'?1.5:0.5,dispensed:Number.isFinite(flowLs)&&flowLs<=(options.ruralIdentified&&options.purpose==='Abastecimento humano'?1.5:0.5)};}
export type ProcessEvent = {kind:'request';responsible:NonNullable<Point['requerimento']>}|{kind:'formed';number:string}|{kind:'closed';number:string;status:typeof officialStatuses[number];act?:Record<string,string>};
export function applyProcessReturn(point:Point,event:ProcessEvent):Point {
 if(!point.number||point.lifecycle==='Rascunho'||displayStatus(point)==='Cancelado')throw new Error('Ponto inelegível para retorno demonstrativo.');
 const next=structuredClone(point);
 if(event.kind==='request')next.requerimento=event.responsible;
 if(event.kind==='formed'){if(!event.number.trim())throw new Error('Informe o número do processo.');next.process=event.number;}
 if(event.kind==='closed'){if(!officialStatuses.includes(event.status))throw new Error('Situação oficial inválida.');next.process=event.number;next.processSituation=event.status;next.effectiveStatus=event.status;next.cnarh={state:'retorno',processClosed:true,lastResult:{...(event.act||{}),'Número do processo':event.number}};}
 return next;
}
