import { CATEGORIAS, MENSAGENS, PARAMETROS, REQUERENTE } from '../data/entradaUnicaUc';

export type TelaEntrada = 'inicio' | 'dados' | 'atividade' | 'condicoes' | 'data' | 'resultado' | 'consulta' | 'historico';
export type DestinoEntrada = 'uc-autorizacao-visitacao' | 'uc-atividades-didaticas' | 'uc-pesquisa-cientifica';
export interface EntradaEvent { at: string; action: string; revision: number; actor: string; snapshot: string; rules: string; }
export interface EntradaRecord {
  id: string; owner: string; opening: string; updated: string; revision: number;
  ucId: string; ucName: string; localId: string; localName: string; category: string; description: string;
  conditions: Record<'regular' | 'restricted' | 'structure' | 'people', boolean>; date: string;
  screen: TelaEntrada; status: 'Rascunho' | 'Classificada' | 'Formulário aberto' | 'Cancelada';
  conditionsReviewed?: boolean; result?: string; policy?: string; calendar?: string; destination?: DestinoEntrada; acceptedAt?: string; events: EntradaEvent[];
}
export interface EntradaProps { entrada?: EntradaRecord; }
export interface UcEntrada { value: string; label: string; habilitada: boolean; categoria: string; municipio: string; }
export interface LocalEntrada { value: string; label: string; disponivel: boolean; motivo?: string; }
export const EMPTY_CONDITIONS = { regular: false, restricted: false, structure: false, people: false };
export const telasEntrada: TelaEntrada[] = ['inicio','dados','atividade','condicoes','data','resultado','consulta','historico'];
export const todayEntrada = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bahia' }).format(new Date());
export function novaEntrada(): EntradaRecord {
  return { id: crypto.randomUUID(), owner: REQUERENTE.id, opening: todayEntrada(), updated: new Date().toISOString(), revision: 0, ucId: '', ucName: '', localId: '', localName: '', category: '', description: '', conditions: { ...EMPTY_CONDITIONS }, date: '', screen: 'dados', status: 'Rascunho', events: [] };
}
export function isVisitacao(category: string) { return /^[1-8]$/.test(category); }
export function classificarEntrada(r: Pick<EntradaRecord,'category'|'conditions'>) {
  if (isVisitacao(r.category)) return Object.values(r.conditions).some(Boolean) ? 'visitacao' : 'dispensa';
  return ({ '9': 'tipo1', '10': 'tipo2', '11': 'pesquisa', outra: 'manual' } as Record<string,string>)[r.category] ?? 'incompleta';
}
export function destinoEntrada(r: EntradaRecord): DestinoEntrada | undefined {
  const type = classificarEntrada(r);
  return type === 'visitacao' ? 'uc-autorizacao-visitacao' : ['tipo1','tipo2'].includes(type) ? 'uc-atividades-didaticas' : type === 'pesquisa' ? 'uc-pesquisa-cientifica' : undefined;
}
export function nomeResultado(r: EntradaRecord) {
  return ({ visitacao: 'Solicitação de autorização para visitação', dispensa: 'Possível dispensa de solicitação', tipo1: 'Atividade Didática Tipo 1', tipo2: 'Atividade Didática Tipo 2', pesquisa: 'Pesquisa Científica', manual: 'Enquadramento pendente' } as Record<string,string>)[classificarEntrada(r)] ?? 'Triagem em preenchimento';
}
export function categoriaNome(id: string) { return id === 'outra' ? 'Outra atividade' : CATEGORIAS.find(c => c.id === id)?.label ?? 'Não informada'; }
export function civilDate(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
  const d = new Date(value + 'T12:00:00Z');
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0,10) !== value) return;
  return d;
}
export function formatEntrada(value: string, weekday = false) {
  const d = civilDate(value); return d ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric', ...(weekday ? { weekday: 'long' as const } : {}) }).format(d) : 'Não informada';
}
const iso = (d: Date) => d.toISOString().slice(0,10);
export function primeiraDataEntrada(opening: string, amount: number, business: boolean, holidays: string[] = []) {
  const d = civilDate(opening); if (!d || !Number.isInteger(amount) || amount < 0 || amount > 3660) return '';
  let count = 0;
  // Demonstração: exclui a abertura e inclui a data final. Convenção a homologar.
  while (count < amount) { d.setUTCDate(d.getUTCDate()+1); if (!business || (![0,6].includes(d.getUTCDay()) && !holidays.includes(iso(d)))) count++; }
  return iso(d);
}
export function verificarDataEntrada(r: EntradaRecord, config = PARAMETROS) {
  const type = classificarEntrada(r), key = type as keyof typeof config.days;
  const amount = config.daysByUc[r.ucId]?.[key] ?? config.days[key], business = ['tipo1','tipo2','pesquisa'].includes(type);
  let next = amount === undefined ? r.opening : primeiraDataEntrada(r.opening, amount, business, config.holidays);
  const blocked = (date: string) => config.blocks.find(b => b.ucId === r.ucId && (!b.localId || b.localId === r.localId) && date >= b.from && date <= b.to);
  for (let tries = 0; next && blocked(next) && tries < 3660; tries++) { const d = civilDate(next)!; d.setUTCDate(d.getUTCDate()+1); next = iso(d); }
  if (!next || blocked(next)) return { valid: false, next: '', amount, business, message: 'Não foi possível encontrar uma data compatível com os parâmetros demonstrativos.' };
  if (!civilDate(r.date)) return { valid: false, next, amount, business, message: 'Informe uma data válida para o início da atividade.' };
  if (r.date < r.opening) return { valid: false, next, amount, business, message: 'No protótipo, a data pretendida deve ser igual ou posterior à abertura da triagem.' };
  if (r.date < next) return { valid: false, next, amount, business, message: MENSAGENS.MSG005.replace('[data]', formatEntrada(next)) };
  const restriction = blocked(r.date);
  if (restriction) return { valid: false, next, amount, business, message: `${MENSAGENS.MSG004} ${restriction.reason}` };
  return { valid: true, next, amount, business, message: amount === undefined ? 'Data registrada. O prazo para este resultado depende de definição institucional.' : 'Data compatível com o cálculo demonstrativo. Parâmetros e feriados sujeitos à homologação.' };
}
export function validarOndeEntrada(r: EntradaRecord, ucs: UcEntrada[], locais: Record<string,LocalEntrada[]>) {
  const uc = ucs.find(u => u.value === r.ucId);
  if (!uc) return 'Selecione uma Unidade de Conservação.';
  if (!uc.habilitada) return MENSAGENS.MSG003;
  if (r.localId && !locais[r.ucId]?.some(l => l.value === r.localId && l.disponivel)) return MENSAGENS.MSG004;
  return '';
}
export function validarTipoEntrada(r: EntradaRecord) {
  if (r.category !== 'outra' && !CATEGORIAS.some(c => c.id === r.category)) return MENSAGENS.MSG006;
  if (r.category === 'outra' && (!r.description.trim() || r.description.length > PARAMETROS.otherLimit)) return `Descreva a atividade em até ${PARAMETROS.otherLimit} caracteres (limite demonstrativo).`;
  return '';
}
export function eventoEntrada(r: EntradaRecord, action: string): EntradaRecord {
  const revision = r.revision + 1, at = new Date().toISOString();
  const snapshot = JSON.stringify({ uc: r.ucName, local: r.localName, category: categoriaNome(r.category), description:r.description, conditions: r.conditions, date: r.date, opening:r.opening, result: r.result, destination: r.destination, status:r.status });
  const type=classificarEntrada(r), rules=['RN001','RN002','RN003','RN004','RN021'];
  if(r.category) rules.push('RN005');
  if(type==='manual')rules.push('RN006');
  if(isVisitacao(r.category))rules.push('RN007',type==='dispensa'?'RN008':'RN015');
  if(['tipo1','tipo2'].includes(type))rules.push('RN013');
  if(type==='pesquisa')rules.push('RN014');
  if(['visitacao','tipo1','tipo2','pesquisa'].includes(type))rules.push('RN009','RN010');
  if(r.date)rules.push('RN011');
  if(r.destination)rules.push('RN018');
  return { ...r, revision, updated: at, events: [...r.events, { at, action, revision, actor: REQUERENTE.name, snapshot, rules: `${PARAMETROS.version}; ${PARAMETROS.calendarVersion}; ${rules.join('/')}` }] };
}
export function invalidarEntrada(r: EntradaRecord, patch: Partial<EntradaRecord>): EntradaRecord {
  const next = { ...r, ...patch, status: 'Rascunho' as const, result: undefined, destination: undefined, acceptedAt: undefined, policy: undefined, calendar: undefined };
  if ('ucId' in patch && patch.ucId !== r.ucId) { next.localId = ''; next.localName = ''; }
  if ('category' in patch && patch.category !== r.category) { next.conditionsReviewed = false; next.conditions = { ...EMPTY_CONDITIONS }; }
  return next;
}
