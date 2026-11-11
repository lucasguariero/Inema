import type { Administration,DemoUser } from './administration';
import { fold } from './administration';
import type { Fields } from './types';
// Read-only fictitious attributes represent the pre-existing filter fields.
export function demoUserMetadata(user:DemoUser) {return {cpf:'000.000.000-00',status:'Ativo',sector:user.external?'':'DIRAM',validation:'Validado',verified:'Sim',complete:'Sim',created:'2026-10-01',lastLogin:'2026-10-23'};}
export function queryDemoUsers(data:Administration,filters:Fields,search='') {
 const value=(k:string)=>String(filters[k]||'');
 return data.users.filter(u=>{
  const m=demoUserMetadata(u);
  const text=fold(u.name+' '+u.email+' '+u.id);
  const exact=(k:string,current:string)=>!value(k)||value(k)==='Todos'||value(k)===current;
  return text.includes(fold(search))&&(!value('name')||text.includes(fold(value('name'))))&&(!value('cpf')||m.cpf.replace(/\D/g,'')===value('cpf').replace(/\D/g,''))&&exact('status',m.status)&&(!value('type')||value('type')==='Todos'||(u.external?'Externo':'Interno')===value('type'))&&exact('sector',m.sector)&&exact('validation',m.validation)&&exact('verified',m.verified)&&exact('complete',m.complete)&&(!value('instrument')||u.instrumentIds.includes(value('instrument')))&&(!value('instrumentType')||value('instrumentType')==='Todos'||u.instrumentIds.some(id=>data.instruments.some(i=>i.id===id&&i.type===value('instrumentType'))))&&(!value('createdFrom')||m.created>=value('createdFrom'))&&(!value('createdTo')||m.created<=value('createdTo'))&&(!value('loginFrom')||m.lastLogin>=value('loginFrom'))&&(!value('loginTo')||m.lastLogin<=value('loginTo'));
 });
}
