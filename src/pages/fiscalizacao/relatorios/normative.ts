import { LEGAL_CATALOG } from './legalCatalog';
import { documentoValido } from '@/lib/pautaGestor';
import type { Errors, Infraction, ReportKind } from './types';

export const PENALTIES: Record<string, string[]> = {
 leve: ['Advertência', 'Multa'],
 grave: ['Advertência', 'Multa', 'Embargo Temporário', 'Destruição de fornos para produção de carvão vegetal', 'Interdição Temporária', 'Apreensão'],
 gravissima: ['Advertência', 'Multa', 'Embargo Temporário', 'Embargo Definitivo', 'Demolição', 'Interdição Temporária', 'Interdição Definitiva'],
};
export const articleOptions = (kind: ReportKind, article: string) => LEGAL_CATALOG[kind][article as keyof typeof LEGAL_CATALOG[typeof kind]]?.options || [];
export function setOtherNorms(n: Infraction, value: string): Infraction {
 const next = structuredClone(n); next.other = value;
 if (value.trim() || next.sources.includes('outras')) { next.sources = [...new Set([...next.sources, 'outras'])]; next.articles = [...new Set([...next.articles, '254pu'])]; next.clauses['254pu'] = [...new Set([...(next.clauses['254pu'] || []), 'VIII'])]; }
 return next;
}
export function validateInfraction(n: Infraction): Errors {
 const e: Errors = {}, need = (k: string, ok: unknown, text: string) => { if (!ok) e[k] = text; };
 need('description', n.description.trim() && n.description.length <= 1000, 'Descreva a caracterização em até 1.000 caracteres.');
 need('annexVI', n.annexVI.length === 0, 'Catálogo completo do Anexo VI pendente; nenhum enquadramento pode ser inventado.');
 need('sources', n.sources.length && n.sources.every(s => ['estadual', 'outras'].includes(s)), 'Selecione uma fonte disponível. Catálogo federal completo pendente.');
 need('articles', n.articles.every(a => ['254', '254pu', '255'].includes(a)), 'Artigo não disponível no catálogo transcrito.');
 if (n.sources.includes('estadual')) need('stateArticle', n.articles.some(a => ['254', '255'].includes(a)), 'Selecione o artigo 254 e/ou 255 para a fonte estadual.');
 if (n.sources.includes('outras')) need('other', n.other.trim() && n.other.length <= 500 && n.articles.includes('254pu') && n.clauses['254pu']?.includes('VIII'), 'Informe outras normas em até 500 caracteres; Art.254, parágrafo único, VIII deve estar selecionado.');
 need('otherLimit', n.other.length <= 500, 'Outras normas: máximo de 500 caracteres.');
 for (const a of n.articles) {
  const allowed = a === '254' ? ['I', 'II', 'III', 'PU'] : a === '254pu' ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'] : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  need('clauses.' + a, n.clauses[a]?.length && n.clauses[a].every(x => allowed.includes(x)), `Selecione ao menos um elemento válido do Art.${a === '254pu' ? '254, parágrafo único' : a}.`);
 }
 if (n.clauses['254']?.includes('PU')) need('paragraph', n.articles.includes('254pu') && n.clauses['254pu']?.length, 'Detalhe o parágrafo único do artigo 254.');
 need('criteria', ['I', 'II', 'VI'].every(c => n.criteria.includes(c)) && n.criteria.every(c => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].includes(c)), 'Art.249: I, II e VI são obrigatórios e bloqueados.');
 if (n.criteria.includes('I')) need('circumstances', n.mitigating.length + n.aggravating.length > 0, 'Selecione ao menos uma circunstância dos artigos 250 ou 251.');
 need('mitigating', n.mitigating.every(x => ['I', 'II', 'III', 'IV', 'V', 'VI'].includes(x)), 'Circunstância atenuante inválida.');
 need('aggravating', n.aggravating.every(x => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'].includes(x)), 'Circunstância agravante inválida.');
 if (n.aggravating.includes('VII')) need('aggravatingVII', n.aggravatingVII.length && n.aggravatingVII.every(x => ['a', 'b'].includes(x)), 'Art.251, VII: selecione a e/ou b.');
 for (const c of ['III', 'IV', 'V', 'VII']) if (n.criteria.includes(c)) need('reasons.' + c, n.reasons[c]?.trim() && n.reasons[c].length <= 500, `Art.249, ${c}: justifique em até 500 caracteres.`);
 need('nature', ['formal', 'material'].includes(n.nature), 'Art.257: selecione apenas infração formal ou material.');
 if (n.nature === 'formal') need('natureFormal', n.natureFormal.length && n.natureFormal.every(x => ['a', 'b'].includes(x)), 'Art.257, I: selecione a e/ou b.');
 need('severity', Object.hasOwn(PENALTIES, n.severity), 'Selecione uma gravidade do artigo 258.');
 need('penalties', n.penalties.length && n.penalties.every(x => PENALTIES[n.severity]?.includes(x)), 'Selecione ao menos uma penalidade permitida para a gravidade.');
 need('recipient', n.recipient.name.trim() && documentoValido(n.recipient.document) && n.recipient.address.trim() && (!n.differentRecipient || n.recipientReason.trim()), 'Confira o autuado e justifique quando diferente da identificação.');
 return e;
}
