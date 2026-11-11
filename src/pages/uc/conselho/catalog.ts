import source from './requirements.json';
import type { Category, Dor, Values } from './types';
export const CATALOG = source;
export const SEGMENTS = ['Poder Público', 'Sociedade Civil Local', 'Empreendedores Locais'] as const;
export const CATEGORIES: Category[] = ['Poder Público','Sociedade Civil Local Formalizada','Sociedade Civil Local Não Formalizada','Empreendedor Local'];
export const STATUSES = ['Não criado','Renovação em andamento','Aguardando formalização','Ativo','Mandato ampliado (aditivo)','Recondução em andamento','Inativo','Vencido'] as const;
export const STAGES = ['Publicação do Edital','Mobilização e Inscrição','Análise das Inscrições','Lista Preliminar','Recursos / Impugnações / Complementações','Análise dos recursos — 1','Lista após Recurso','Impugnação — 48 horas','Análise dos recursos — 2','Lista Final','Plenárias Eleitorais por Segmento'];
export const fields = (dor: Dor, section: string) => source.fields.filter(f => f.dor === dor && f.section === section);
export const valueByLabel = (dor: Dor, section: string, values: Values, label: string) => values[fields(dor,section).find(f=>f.label === label)?.key || ''] || '';
export function setByLabel(dor: Dor, section: string, values: Values, label: string, value: string) { const f=fields(dor,section).find(f=>f.label===label); if(f)values[f.key]=value; }
export const message = (dor: Dor, n: number) => (source.messages as Record<string,string>)[`${dor}::MSG${String(n).padStart(3,'0')}`];
export const legend = (dor: Dor, n: number) => (source.legends as Record<string,string>)[`${dor}::LEG${String(n).padStart(3,'0')}`];
export function categoryFields(dor: Dor, section: string, category?: Category) {
 return fields(dor,section).filter(f=>!f.required.startsWith('Condicional à categoria:') || !category || f.required.includes(category === 'Sociedade Civil Local Formalizada' ? 'Sociedade Civil Formalizada' : category === 'Sociedade Civil Local Não Formalizada' ? 'Sociedade Civil Não Formalizada' : category));
}
export function formErrors(dor: Dor, section: string, values: Values, category?: Category) {
 const errors: Record<string,string>={};
 for(const f of categoryFields(dor,section,category)){
  let needed=f.required.startsWith('Sim') || f.required.startsWith('Condicional à categoria:');
  if(f.label==='CNPJ')needed=category!=='Sociedade Civil Local Não Formalizada';
  if(f.label==='Descrição resumida das ações')needed=false;
  if(needed && !values[f.key]?.trim())errors[f.key]='Preencha este campo obrigatório.';
 }
 return errors;
}

export function isFileField(f:{type:string;label:string}){return /Upload|Anexo/i.test(f.type)&&!f.type.includes('Assinatura')&&(!/Grid/i.test(f.type)||/PDF|documento|anexo|comprova/i.test(f.label));}
