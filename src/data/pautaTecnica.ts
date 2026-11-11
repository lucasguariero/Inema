import { PAUTA_PROCESSOS, PAUTA_COLUMNS, PAUTA_STATUSES, foldPauta, type PautaProcesso } from './pautaCoordenador';

// Complemento fictício da MESMA fonte: IDs e campos legados permanecem intactos.
export const COORDENACOES = ['COASP', 'COMIN', 'COIND', 'COINE', 'COINS', 'COFAQ', 'NOUT'];
export const STATUS_CATALOG = [...new Set([...PAUTA_STATUSES, 'Retificado', 'Formado', 'Aguardando distribuição', 'Em Análise Técnica', 'Análise Técnica Concluído', 'Concluído', 'Notificado', 'Notificação respondida', 'Em espera', 'Arquivado', 'Suspenso', 'Enviado para consulta', 'Cancelado'])];
export type ReferenceFilter = 'diretoria' | 'coordenacao' | 'coordenador' | 'tecnicoId' | 'atos' | 'status' | 'municipio' | 'bacias' | 'ucs';
export interface PautaReference { id: string; label: string; nome?: string; ordem?: number }
const reference = (id: string, label: string): PautaReference => ({ id, label });
export const statusReference = (label: string) => reference(`status-demo-${STATUS_CATALOG.indexOf(label)}`, label);
const techLabels = [...new Set(PAUTA_PROCESSOS.map(p => p.tecnico).filter(Boolean))];
const municipalityLabels = [...new Set(PAUTA_PROCESSOS.map(p => p.municipio))];
const directorLabels = [...new Set(PAUTA_PROCESSOS.map(p => p.diretoria))];
export interface PautaTecnica extends PautaProcesso {
  coordenacao: string; coordenador: string; tecnicoId: string; cpf: string; razao: string;
  atos: string[]; tecnicos: string[]; bacias: string[]; ucs: string[]; portarias: string[];
  refs: Record<ReferenceFilter, PautaReference[]>; demonstrativo: true; origemComplemento: string;
}
export const PAUTA_TECNICA: PautaTecnica[] = PAUTA_PROCESSOS.map((p, i) => {
 const tecnicos = p.tecnico ? [p.tecnico, ...(i === 2 ? ['Equipe técnica'] : [])] : [];
 const atos = [p.ato.includes('(LO)') ? 'LO' : 'LP', ...(i % 3 === 0 ? ['ASV', 'OUT'] : [])];
 return {
  ...p, coordenacao: COORDENACOES[i % 7], coordenador: `Gestor demonstrativo ${i % 3 + 1}`,
  tecnicoId: p.tecnico ? `tecnico-demo-${techLabels.indexOf(p.tecnico)}` : 'sem-atribuicao', tecnicos,
  cpf: i % 2 ? `00000000${String(i + 1).padStart(3, '0')}` : `0000000000${String(i + 1).padStart(4, '0')}`,
  razao: `Responsável demonstrativo ${i + 1}`, atos,
  bacias: [i % 2 ? 'Bacia demonstrativa Leste' : 'Bacia demonstrativa Oeste'],
  ucs: [i % 3 ? 'UC demonstrativa Serra' : 'UC demonstrativa Lagoa'],
  portarias: [`${String(i + 1).padStart(4, '0')}/2026`, ...(i === 0 ? ['0099/2025'] : [])],
  demonstrativo: true, origemComplemento: 'Fixture local Pautas Técnicas; sem vínculo cadastral institucional',
  refs: {
   diretoria: [reference(`diretoria-demo-${directorLabels.indexOf(p.diretoria)}`, p.diretoria)],
   coordenacao: [reference(`coordenacao-demo-${i % 7}`, COORDENACOES[i % 7])],
   coordenador: [reference(`gestor-demo-${i % 3}`, `Gestor demonstrativo ${i % 3 + 1}`)],
   tecnicoId: tecnicos.map(label => reference(`tecnico-demo-${techLabels.indexOf(label)}`, label)),
   atos: atos.map((label, ordem) => ({ ...reference(`ato-demo-${['LO','LP','ASV','OUT'].indexOf(label)}`, label), nome: ({ LO: 'Licença de Operação', LP: 'Licença Prévia', ASV: 'Autorização de Supressão de Vegetação', OUT: 'Outorga — exemplo' } as Record<string,string>)[label], ordem })),
   status: [statusReference(p.status)], municipio: [reference(`municipio-demo-${municipalityLabels.indexOf(p.municipio)}`,p.municipio)],
   bacias: [reference(`bacia-demo-${i % 2}`, i % 2 ? 'Bacia demonstrativa Leste' : 'Bacia demonstrativa Oeste')],
   ucs: [reference(`uc-demo-${i % 3 ? 1 : 0}`, i % 3 ? 'UC demonstrativa Serra' : 'UC demonstrativa Lagoa')],
  },
 };});
export const FILTERS = [
  ['diretoria', 'Diretoria', 'select'], ['coordenacao', 'Coordenação', 'select'],
  ['coordenador', 'Coordenador/Pauta do Gestor', 'select'], ['tecnicoId', 'Técnico', 'select'],
  ['cpf', 'CPF/CNPJ', 'text'], ['empreendimento', 'Nome do empreendimento', 'text'],
  ['razao', 'Razão Social', 'text'], ['atos', 'Ato Autorizativo', 'select'],
  ['status', 'Status', 'select'], ['numero', 'Número do processo', 'text'],
  ['municipio', 'Município', 'select'], ['bacias', 'Bacia Hidrográfica', 'select'],
  ['ucs', 'Unidade de Conservação', 'select'], ['portarias', 'Número de Portaria', 'text'],
] as const;
export type FilterId = typeof FILTERS[number][0];
export type PautaFilters = Record<FilterId, string>;
export const emptyFilters = (): PautaFilters => Object.fromEntries(FILTERS.map(([id]) => [id, ''])) as PautaFilters;
export const COLUMNS = [...PAUTA_COLUMNS, ['diretoria', 'Diretoria'], ['coordenacao', 'Coordenação'],
  ['coordenador', 'Coordenador/Pauta do Gestor'], ['cpf', 'CPF/CNPJ'], ['razao', 'Razão Social'],
  ['municipio', 'Município'], ['bacias', 'Bacia Hidrográfica'], ['ucs', 'Unidade de Conservação'], ['portarias', 'Número de Portaria']] as const;
export type ColumnId = typeof COLUMNS[number][0];
export interface ColumnPreference { id: ColumnId; visible: boolean; pinned: boolean }
export const defaultColumns = (): ColumnPreference[] => COLUMNS.map(([id], i) => ({ id, visible: i < 7, pinned: false }));
export const ADMIN_STATUSES = ['Em espera', 'Suspenso', 'Arquivado', 'Concluído', 'Cancelado'];
export const PROFILES = [
  { id: 'compatibilidade', label: 'Compatibilidade — processos legados', description: 'Concessão fictícia explícita aos 12 processos legados; consulta, exportação e fluxo local.', flow: true, export: true },
  { id: 'diretor-dirre', label: 'Diretor DIRRE — demonstração', description: 'Somente processos da DIRRE; consulta, exportação e fluxo local.', flow: true, export: true },
  { id: 'consulta-dirre', label: 'Consulta DIRRE — concessão fictícia', description: 'Consulta de processos e documentos da DIRRE, somente leitura. Sem exportação CSV ou edição.', flow: false, export: false },
  { id: 'sem-acesso', label: 'Sem concessão DIRRE', description: 'Nenhum processo autorizado neste cenário.', flow: false, export: false },
] as const;
export type ProfileId = typeof PROFILES[number]['id'];
export function accessible(p: PautaProcesso, profile: string) {
  if (profile === 'compatibilidade') return PAUTA_PROCESSOS.some(original => original.id === p.id);
  return (profile === 'diretor-dirre' || profile === 'consulta-dirre') && p.diretoria === 'DIRRE';
}
export type PautaMode = 'view' | 'validation';
export function canOpen(p: PautaProcesso, profile: string, mode: PautaMode = 'validation') { return accessible(p, profile) && (mode === 'view' || (mode === 'validation' && !!PROFILES.find(v => v.id === profile)?.flow)); }
export function columnText(p: PautaTecnica, id: ColumnId): string {
  if (id === 'ato') return p.atos.join(' · ');
  if (id === 'tecnico') return p.tecnicos.join(' · ') || 'Sem atribuição';
  if (id === 'formacao') return p.formacao.split('-').reverse().join('/');
  const value = p[id]; return Array.isArray(value) ? value.join(' · ') : value || '—';
}
const numberText = (s: string) => foldPauta(s).replace(/\s/g, '');
export function filterErrors(filters: PautaFilters) {
  const errors: Partial<Record<FilterId, string>> = {};
  if (filters.cpf && ![11, 14].includes(filters.cpf.replace(/\D/g, '').length)) errors.cpf = 'Informe os 11 dígitos do CPF ou os 14 do CNPJ.';
  return errors;
}
export function queryTecnica(source: PautaTecnica[], filters: PautaFilters, profile: string, search = '', sort: ColumnId | '' = '', ascending = true) {
  if (Object.keys(filterErrors(filters)).length) return [];
  const rows = source.filter(p => accessible(p, profile) && FILTERS.every(([id]) => {
    const value = filters[id].trim(); if (!value) return true;
    if (id === 'cpf') return p.cpf === value.replace(/\D/g, '');
    if (id === 'empreendimento' || id === 'razao') return foldPauta(p[id]).includes(foldPauta(value));
    if (id === 'numero') return numberText(p.numero) === numberText(value);
    if (id === 'portarias') return p.portarias.some(v => numberText(v) === numberText(value));
    if (id === 'tecnicoId' && value === 'sem-atribuicao') return p.refs.tecnicoId.length === 0;
    return p.refs[id].some(ref => ref.id === value);
  }) && foldPauta(COLUMNS.map(([id]) => columnText(p, id)).join(' ')).includes(foldPauta(search.trim())));
  return sort ? rows.sort((a, b) => ((sort === 'formacao' ? a.formacao : columnText(a, sort)).localeCompare(sort === 'formacao' ? b.formacao : columnText(b, sort), 'pt-BR', { numeric: true }) || a.id.localeCompare(b.id)) * (ascending ? 1 : -1)) : rows;
}
export function filterOptions(source: PautaTecnica[], id: FilterId) {
  const refs = id === 'status' ? STATUS_CATALOG.map(statusReference) : id === 'coordenacao' ? COORDENACOES.map((label,i) => reference(`coordenacao-demo-${i}`,label)) : source.flatMap(p => p.refs[id as ReferenceFilter] || []);
  if (id === 'tecnicoId' && source.some(p => !p.refs.tecnicoId.length)) refs.push(reference('sem-atribuicao','Sem atribuição'));
  const unique = [...new Map(refs.map(ref => [ref.id,ref])).values()];
  return unique.map(ref => ({ value: ref.id, label: unique.some(other => other.id !== ref.id && other.label === ref.label) ? `${ref.label} (${ref.id})` : ref.label })).sort((a,b) => a.label.localeCompare(b.label,'pt-BR'));
}
export function filterLabel(source: PautaTecnica[], id: FilterId, value: string) { return filterOptions(source,id).find(option => option.value === value)?.label || value; }
export function exportTecnica(rows: PautaTecnica[], ids: ColumnId[]) {
  const cell = (s: string) => `"${(/^[\s]*[=+\-@\t\r]/.test(s) ? "'" : '') + s.replace(/"/g, '""')}"`;
  return '\uFEFF' + [ids.map(id => COLUMNS.find(c => c[0] === id)![1]), ...rows.map(p => ids.map(id => columnText(p, id)))].map(r => r.map(cell).join(';')).join('\r\n');
}
