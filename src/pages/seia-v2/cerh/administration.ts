import { useSyncExternalStore } from 'react';
import { capturePurposes } from './catalogSeed';
import { useTypeOrder, useTypes, type Session, type UseType } from './types';

export interface AuditEntry { id: string; date: string; action: string; actor: string; before?: string; after?: string }
export interface Purpose { id: string; code: number; description: string; active: boolean; deleted?: boolean; formKey?: string; history: AuditEntry[] }
export interface WaterType { id: string; code: number; description: string; active: boolean; deleted?: boolean; formKey?: UseType; purposeIds: string[]; history: AuditEntry[] }
export interface Instrument { id: string; type: 'ACT' | 'Contrato' | 'Convênio'; number: string; name: string; process: string; cnpj: string; organization: string; start: string; end: string; history: AuditEntry[] }
export interface DemoGroup { id: string; name: string; external: boolean; fixed?: boolean; grants: string[] }
export interface DemoUser { id: string; name: string; email: string; profile: Session['profile']; external: boolean; types?: ('Interno' | 'Externo')[]; personId?: string; groupIds: string[]; instrumentIds: string[]; history: AuditEntry[] }
export interface Administration { revision: 1; purposes: Purpose[]; types: WaterType[]; instruments: Instrument[]; groups: DemoGroup[]; users: DemoUser[]; purposeSequence: number; typeSequence: number; expiredEvents: string[] }
export const EMP_PERMISSIONS = [['emp.access', 'Acessar'], ['emp.view', 'Visualizar empreendimento'], ['emp.create', 'Criar empreendimento'], ['emp.water', 'Cadastrar uso da água']] as const;
export const CONSULT_PERMISSIONS = [['consult.access', 'Acessar'], ['consult.view', 'Visualizar cadastro'], ['consult.report', 'Gerar relatório'], ['consult.decide', 'Analisar solicitação de edição'], ['consult.cancel', 'Cancelar cadastro']] as const;
export const CATALOG_PERMISSIONS = ['purpose.view', 'purpose.create', 'purpose.edit', 'purpose.delete', 'type.view', 'type.create', 'type.edit', 'type.delete'];
export const ALL_GRANTS: string[] = [...[...EMP_PERMISSIONS, ...CONSULT_PERMISSIONS].map(p => p[0]), ...CATALOG_PERMISSIONS];
export const fold = (v: string) => v.trim().toLocaleLowerCase('pt-BR');
export const civilToday = () => new URLSearchParams(typeof location === 'undefined' ? '' : location.search).get('cerh-data') || new Date().toLocaleDateString('en-CA');
export function instrumentStatus(i: Instrument, today = civilToday()) { return today < i.start ? 'Futuro' : today > i.end ? 'Encerrado' : 'Vigente'; }
export function validCnpj(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!/^\d{14}$/.test(digits) || /^(\d)\1{13}$/.test(digits)) return false;
  const digit = (base: string) => { let weight = base.length - 7; const total = [...base].reduce((sum, c) => { const next = sum + Number(c) * weight; weight = weight === 2 ? 9 : weight - 1; return next; }, 0); return total % 11 < 2 ? 0 : 11 - total % 11; };
  return digit(digits.slice(0, 12)) === Number(digits[12]) && digit(digits.slice(0, 13)) === Number(digits[13]);
}
export const audit = (action: string, actor: string, before?: unknown, after?: unknown): AuditEntry => ({ id: crypto.randomUUID(), date: new Date().toISOString(), action, actor, before: before === undefined ? undefined : JSON.stringify(before), after: after === undefined ? undefined : JSON.stringify(after) });
function seed(): Administration {
  const purposes = [...capturePurposes, 'Reservatório'].map((formKey, n) => ({ id: `PUR-${n + 1}`, code: n + 1, description: formKey === 'Reservatório' ? 'Reservatório/Barramento/Regularização de Vazões para Usos Múltiplos' : formKey, formKey, active: true, history: [] }));
  const types = useTypeOrder.map((formKey, n) => ({ id: formKey, code: n + 1, description: useTypes[formKey], formKey, active: true, purposeIds: formKey === 'BAR' ? purposes.filter(p => ['Reservatório', 'Aproveitamento Hidrelétrico'].includes(p.formKey)).map(p => p.id) : ['SUP', 'SUB'].includes(formKey) ? purposes.filter(p => p.formKey !== 'Reservatório').map(p => p.id) : [], history: [] }));
  const instruments: Instrument[] = [
    { id: 'ACT-MOCK-01', type: 'ACT', number: '001/2026', name: 'Levantamento hídrico — demonstração', process: 'PROC-MOCK-ACT-01', cnpj: '00.000.000/0001-91', organization: 'Entidade de demonstração ACT', start: '2026-01-01', end: '2027-12-31', history: [] },
    { id: 'CONVÊNIO-MOCK-02', type: 'Convênio', number: '002/2026', name: 'Cadastro futuro — demonstração', process: 'PROC-MOCK-CONV-02', cnpj: '00.000.000/0001-91', organization: 'Entidade de demonstração Convênio', start: '2027-01-01', end: '2027-12-31', history: [] },
    { id: 'CONTRATO-MOCK-03', type: 'Contrato', number: '003/2025', name: 'Cadastro encerrado — demonstração', process: 'PROC-MOCK-CONT-03', cnpj: '00.000.000/0001-91', organization: 'Entidade de demonstração Contrato', start: '2025-01-01', end: '2026-09-30', history: [] },
  ];
  const groups: DemoGroup[] = [{ id: 'admin', name: 'Administrador', external: false, grants: [...ALL_GRANTS] }, { id: 'diram', name: 'DIRAM', external: false, grants: [...ALL_GRANTS] }, { id: 'tecnico', name: 'Técnico do Inema', external: false, grants: [] }, { id: 'conveniado', name: 'Conveniado CERH', external: true, fixed: true, grants: EMP_PERMISSIONS.map(p => p[0]) }, { id: 'externo', name: 'Usuário Externo', external: true, grants: [] }];
  const users: DemoUser[] = [
    { id: 'diram', name: 'Analista DIRAM — demonstração', email: 'diram@example.invalid', profile: 'DIRAM', external: false, groupIds: ['diram'], instrumentIds: [], history: [] },
    { id: 'admin', name: 'Administrador — demonstração', email: 'admin@example.invalid', profile: 'DIRAM', external: false, groupIds: ['admin'], instrumentIds: [], history: [] },
    { id: 'tecnico', name: 'Técnico — demonstração', email: 'tecnico@example.invalid', profile: 'Técnico', external: false, types: ['Interno', 'Externo'], groupIds: ['tecnico'], instrumentIds: [], history: [] },
    { id: 'conveniado', name: 'Conveniado — demonstração', email: 'conveniado@example.invalid', profile: 'Conveniado', external: true, groupIds: ['conveniado'], instrumentIds: instruments.map(i => i.id), history: [] },
    { id: 'externo', name: 'Titular — demonstração', email: 'titular@example.invalid', profile: 'Requerente', external: true, personId: 'PERSON-01', groupIds: ['externo'], instrumentIds: [], history: [] },
    {id:'titular-02',name:'Titular do contexto 02 — demonstração',email:'titular02@example.invalid',profile:'Requerente',external:true,personId:'PERSON-02',groupIds:['externo'],instrumentIds:[],history:[]},
    {id:'titular-03',name:'Titular do contexto 03 — demonstração',email:'titular03@example.invalid',profile:'Requerente',external:true,personId:'PERSON-03',groupIds:['externo'],instrumentIds:[],history:[]},
    { id: 'procurador', name: 'Procurador — demonstração', email: 'procurador@example.invalid', profile: 'Procurador', external: true, personId: 'PERSON-01', groupIds: ['externo'], instrumentIds: [], history: [] },
    { id: 'representante', name: 'Representante legal — demonstração', email: 'representante@example.invalid', profile: 'Requerente', external: true, personId: 'PERSON-01', groupIds: ['externo'], instrumentIds: [], history: [] },
  ];
  return { revision: 1, purposes, types, instruments, groups, users, purposeSequence: purposes.length + 1, typeSequence: types.length + 1, expiredEvents: [] };
}
const storageKey = `inema:cerh:administration:v1:${new URLSearchParams(typeof location === 'undefined' ? '' : location.search).get('cerh-cenario') || 'base'}`;
export let administrationStorageIssue = '';
let preserveUnreadableAdministration = false;
function load(): Administration {
 let raw:string|null=null;
 try {
  raw=localStorage.getItem(storageKey);
  if(!raw)return seed();
  const saved=JSON.parse(raw);
  if(saved?.revision!==1 || !['groups','purposes','types','instruments','users','expiredEvents'].every(k=>Array.isArray(saved[k])) || !Number.isInteger(saved.purposeSequence) || !Number.isInteger(saved.typeSequence)) throw new Error('Esquema não reconhecido.');
  return saved;
 } catch {
  preserveUnreadableAdministration=raw!==null;
  administrationStorageIssue=raw?'Os dados administrativos locais não puderam ser lidos e foram preservados. A gravação está bloqueada neste cenário.':'O armazenamento administrativo local não está disponível.';
  return seed();
 }
}
let data = load();
const listeners = new Set<() => void>();
export const getAdministration = () => data;
export function useAdministration() { return useSyncExternalStore(fn => { listeners.add(fn); return () => listeners.delete(fn); }, getAdministration, getAdministration); }
export function saveAdministration(next: Administration) {
  if(preserveUnreadableAdministration)throw new Error(administrationStorageIssue);
  // Persist before publishing: a quota failure must never be reported as a save.
  try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { throw new Error('Não foi possível salvar neste navegador. Libere espaço ou permita o armazenamento local e tente novamente.'); }
  data = next; listeners.forEach(fn => fn());
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('cerh-administration-change'));
}
export function hasGrant(session: Session, grant: string) { const current = session.userId ? sessionForProfile(session.userId) : session; return Boolean(current.authorized && current.grants?.includes(grant)); }
export function sessionForProfile(profile = 'diram'): Session {
  const key = profile === 'rt' ? 'externo' : profile;
  const user = data.users.find(u => u.id === key);
  if (!user) return { name: 'Sem vínculo — demonstração', profile: 'Sem vínculo', authorized: false, agreements: [], grants: [], external: true, userId: key };
  const linked = data.instruments.filter(i => user.instrumentIds.includes(i.id) && instrumentStatus(i) === 'Vigente');
  const grants = [...new Set(data.groups.filter(g => user.groupIds.includes(g.id) && (g.id !== 'conveniado' || linked.length > 0)).flatMap(g => g.grants))];
  const convenioAccess = user.groupIds.includes('conveniado') && grants.includes('emp.access') && linked.length > 0;
  return { name: user.name, email:user.email, userId: user.id, profile: user.profile, external: user.external && user.profile !== 'Conveniado', personId: user.personId, groupIds: user.groupIds, grants, instrumentIds: linked.map(i => i.id), agreements: linked.map(i => i.id), authorized: user.profile === 'Conveniado' ? convenioAccess : user.external || grants.some(g => g.endsWith('.access') || g.endsWith('.view')) };
}
export function resolvePurpose(value: string) { return data.purposes.find(p => p.id === value || p.formKey === value); }
export function purposeLabel(value: string) { return resolvePurpose(value)?.description || value; }
export function purposeKey(value: string) { return resolvePurpose(value)?.formKey || value; }
export function purposeOptions(type: UseType) { const t = data.types.find(t => t.formKey === type && t.active && !t.deleted); return data.purposes.filter(p => p.active && !p.deleted && t?.purposeIds.includes(p.id)); }
export function typeLabel(type: UseType) { return data.types.find(t => t.formKey === type)?.description || useTypes[type]; }
export function instrumentLabel(id: string) { const i = data.instruments.find(i => i.id === id); return i ? `${i.number} - ${i.name}` : id; }

export const adminMessages = {
  required: 'Preencha todos os campos obrigatórios antes de prosseguir.',
  purposeDuplicate: 'Já existe uma finalidade com esta descrição.',
  typeDuplicate: 'Já existe um tipo de uso com este nome.',
  success: 'Operação realizada com sucesso.',
  delete: 'Deseja excluir este registro? A exclusão não poderá ser desfeita. Os cadastros que já utilizam o registro não serão alterados.',
};
export function requireGrant(session: Session, permission: string) {
  const fresh = session.userId ? sessionForProfile(session.userId) : session;
  if (!hasGrant(fresh, permission)) throw new Error('Você não possui permissão para esta ação.');
}
export function saveCatalog(kind: 'purpose' | 'type', incoming: { id?: string; description: string; active: boolean; purposeIds?: string[] }, session: Session) {
  requireGrant(session, `${kind}.${incoming.id ? 'edit' : 'create'}`);
  if (!incoming.description.trim()) throw new Error(adminMessages.required);
  const list = kind === 'purpose' ? data.purposes : data.types;
  if (list.some(p => !p.deleted && p.id !== incoming.id && fold(p.description) === fold(incoming.description))) throw new Error(kind === 'purpose' ? adminMessages.purposeDuplicate : adminMessages.typeDuplicate);
  const next = structuredClone(data);
  const collection = kind === 'purpose' ? next.purposes : next.types;
  const old = collection.find(p => p.id === incoming.id);
  if (incoming.id && (!old || old.deleted)) throw new Error('Registro não disponível.');
  if (kind === 'type' && (old as WaterType | undefined)?.formKey && !incoming.active) throw new Error('Este tipo de uso é protegido e não pode ser inativado.');
  const code = old?.code || (kind === 'purpose' ? next.purposeSequence++ : next.typeSequence++);
  const item = { ...(old || { id: `${kind === 'purpose' ? 'PUR' : 'TYPE'}-${code}`, code, history: [] as AuditEntry[] }), description: incoming.description.trim(), active: incoming.active };
  if (kind === 'type') {
    const current = item as WaterType;
    const links = incoming.purposeIds || [];
    if (['INT', 'EFL'].includes(current.formKey || '') && links.length) throw new Error('Este tipo de uso não permite vínculo de finalidades.');
    if (links.some(id => !next.purposes.some(p => p.id === id && !p.deleted))) throw new Error('Revise as finalidades vinculadas.');
    current.purposeIds = [...new Set(links)];
    for (const id of current.purposeIds.filter(id => !(old as WaterType | undefined)?.purposeIds.includes(id))) current.history.push(audit('Vínculo de finalidade incluído', session.name, undefined, { finalidade: purposeLabel(id) }));
    for (const id of ((old as WaterType | undefined)?.purposeIds || []).filter(id => !current.purposeIds.includes(id))) current.history.push(audit('Vínculo de finalidade removido', session.name, { finalidade: purposeLabel(id) }));
  }
  item.history.push(audit(old ? 'Alteração' : 'Inclusão', session.name, old && { description: old.description, active: old.active }, { description: item.description, active: item.active }));
  if (old) collection.splice(collection.indexOf(old), 1, item as Purpose & WaterType); else collection.push(item as Purpose & WaterType);
  saveAdministration(next); return item.id;
}
export function deleteCatalog(kind: 'purpose' | 'type', id: string, session: Session) {
  requireGrant(session, `${kind}.delete`);
  const next = structuredClone(data), item = (kind === 'purpose' ? next.purposes : next.types).find(p => p.id === id && !p.deleted);
  if (!item) throw new Error('Registro não disponível.');
  if (kind === 'type' && (item as WaterType).formKey) throw new Error('Este tipo de uso é protegido e não pode ser excluído.');
  item.deleted = true; item.history.push(audit('Exclusão', session.name, { description: item.description, active: item.active }));
  if (kind === 'purpose') for (const type of next.types.filter(t => t.purposeIds.includes(id))) { type.purposeIds = type.purposeIds.filter(p => p !== id); type.history.push(audit('Vínculo de finalidade removido por exclusão', session.name, { finalidade: item.description })); }
  saveAdministration(next);
}
export function canManageUsers(session: Session) { return Boolean(session.authorized && session.groupIds?.some(id => ['admin', 'diram'].includes(id))); }
function requireAdministration(session: Session) { if (!canManageUsers(session.userId ? sessionForProfile(session.userId) : session)) throw new Error('Você não possui permissão para administrar os usuários deste protótipo.'); }
export function saveGroup(group: DemoGroup, session: Session) {
  requireAdministration(session);
  const old = data.groups.find(g => g.id === group.id);
  if (!old || !group.name.trim()) throw new Error(adminMessages.required);
  if (old.fixed && (group.name !== old.name || !group.external)) throw new Error('O grupo Conveniado CERH é fixo e do tipo Externo.');
  const allowed = [...CATALOG_PERMISSIONS, ...(!group.external ? [...EMP_PERMISSIONS, ...CONSULT_PERMISSIONS].map(p => p[0]) : group.id === 'conveniado' ? EMP_PERMISSIONS.map(p => p[0]) : [])];
  if (group.grants.some(p => !allowed.includes(p))) throw new Error('Há uma permissão incompatível com o tipo do grupo.');
  const next = structuredClone(data); next.groups = next.groups.map(g => g.id === group.id ? { ...group, name: group.name.trim(), grants: [...new Set(group.grants)] } : g);
  for (const u of next.users.filter(u => u.groupIds.includes(group.id))) u.history.push(audit('Permissões do grupo alteradas', session.name, old, group));
  saveAdministration(next);
}
export function saveUserLinks(userId: string, groupIds: string[], instrumentIds: string[], session: Session) {
  requireAdministration(session);
  const next = structuredClone(data), user = next.users.find(u => u.id === userId);
  if (!user) throw new Error('Usuário não encontrado.');
  if (groupIds.some(id => !next.groups.some(g => g.id === id && (g.external === user.external || user.types?.includes(g.external ? 'Externo' : 'Interno'))))) throw new Error('Selecione grupos compatíveis com o tipo do usuário.');
  if (groupIds.includes('conveniado') && !instrumentIds.length) throw new Error('Vincule pelo menos um instrumento de parceria para salvar um usuário do grupo Conveniado CERH.');
  if (instrumentIds.some(id => !next.instruments.some(i => i.id === id))) throw new Error('Instrumento não encontrado.');
  for (const id of instrumentIds.filter(id => !user.instrumentIds.includes(id))) user.history.push(audit('Vínculo incluído', session.name, undefined, instrumentLabel(id)));
  for (const id of user.instrumentIds.filter(id => !instrumentIds.includes(id))) user.history.push(audit('Vínculo removido', session.name, instrumentLabel(id)));
  if (JSON.stringify(groupIds) !== JSON.stringify(user.groupIds)) user.history.push(audit('Grupos alterados', session.name, user.groupIds, groupIds));
  user.groupIds = [...new Set(groupIds)]; user.instrumentIds = [...new Set(instrumentIds)];
  saveAdministration(next);
}
export function saveInstrument(incoming: Omit<Instrument, 'history'>, userId: string, session: Session) {
  requireAdministration(session);
  if (['type', 'number', 'name', 'process', 'cnpj', 'organization', 'start', 'end'].some(k => !String(incoming[k as keyof typeof incoming] || '').trim())) throw new Error(adminMessages.required);
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  if (!validDate(incoming.start) || !validDate(incoming.end)) throw new Error('Informe datas válidas.');
  if (incoming.end < incoming.start) throw new Error('O fim da vigência deve ser igual ou posterior ao início da vigência.');
  if (!validCnpj(incoming.cnpj)) throw new Error('Informe um CNPJ válido.');
  const old = data.instruments.find(i => i.id === incoming.id);
  if (old && old.type !== incoming.type) throw new Error('O tipo do instrumento não pode ser alterado.');
  if (data.instruments.some(i => i.id !== incoming.id && i.type === incoming.type && fold(i.number) === fold(incoming.number))) throw new Error('Já existe um instrumento deste tipo com este número. Pesquise o instrumento antes de cadastrar.');
  const next = structuredClone(data), id = old?.id || `INSTR-${crypto.randomUUID()}`;
  const change = audit(old ? 'Instrumento alterado' : 'Instrumento cadastrado', session.name, old && { ...old, history: undefined }, incoming);
  const item: Instrument = { ...incoming, id, number: incoming.number.trim(), name: incoming.name.trim(), organization: incoming.organization.trim(), history: [...(old?.history || []), change] };
  next.instruments = old ? next.instruments.map(i => i.id === id ? item : i) : [...next.instruments, item];
  for (const user of next.users.filter(u => old ? u.instrumentIds.includes(id) : u.id === userId)) user.history.push(change);
  saveAdministration(next); return id;
}
export function sweepInstrumentExpiry(today = civilToday()) {
  const events = data.instruments.filter(i => instrumentStatus(i, today) === 'Encerrado' && !data.expiredEvents.includes(`${i.id}:${i.end}`));
  if (!events.length) return;
  const next = structuredClone(data);
  for (const instrument of events) {
    next.expiredEvents.push(`${instrument.id}:${instrument.end}`);
    for (const user of next.users.filter(u => u.instrumentIds.includes(instrument.id))) user.history.push(audit('Instrumento encerrado', 'Sistema', undefined, { instrumento: instrumentLabel(instrument.id), fim: instrument.end }));
  }
  saveAdministration(next);
}

export function identificationRoles(session: Session) { return session.external ? ['Requerente','Representante Legal de Pessoa Jurídica','Procurador de Pessoa Física','Procurador de Pessoa Jurídica'] : [...(session.profile !== 'Conveniado' ? ['Técnico do Inema'] : []),...(session.instrumentIds?.length ? ['ACT/CONVÊNIO/CONTRATO'] : [])]; }
