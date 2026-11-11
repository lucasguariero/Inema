import { useSyncExternalStore } from 'react';
import type { Answer, Block, CerhData, HistoryEvent, Identification, Point, PointData, Session, UseType, Venture } from './types';
import { defaultIdentification, makePoint, mockSession, seedData } from './mocks';
import { useTypes, useTypeOrder } from './types';
import { capabilities, currentData, snapshotRelated, preclassify, validateIdentification, validatePoint } from './rules';
import { str } from './fields';
import { migrateCerh } from './migration';
import { hasGrant, sessionForProfile, purposeLabel, identificationRoles } from './administration';
const params = () => typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search);
const scenario = params().get('cerh-cenario') || 'base';
const storageKey = `inema:cerh:fase3:v1:${scenario}`;
let legacyLoaded = false;
export let cerhStorageIssue = '';
let preserveUnreadable = false;
function loadData(): CerhData {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(storageKey);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved?.revision !== 1 || !Array.isArray(saved.points) || !Array.isArray(saved.ventures) || !Number.isInteger(saved.sequence)) throw new Error('Esquema não reconhecido.');
      legacyLoaded = saved.schemaVersion !== 2;
      if (legacyLoaded) { try { if (!localStorage.getItem(`${storageKey}:before-missao02`)) localStorage.setItem(`${storageKey}:before-missao02`,raw); } catch { cerhStorageIssue='A cópia de segurança não pôde ser gravada. Os dados anteriores foram mantidos.'; } }
      return migrateCerh(saved);
    }
  } catch {
    preserveUnreadable = raw !== null;
    cerhStorageIssue = raw ? 'Os dados locais existentes não puderam ser lidos e foram preservados. A gravação está bloqueada neste cenário; use outro cenário para demonstrar sem sobrescrevê-los.' : 'O armazenamento local não está disponível. Não será possível confirmar o salvamento neste navegador.';
  }
  const seeded = migrateCerh(seedData(scenario));
  if (!raw && !cerhStorageIssue) try { localStorage.setItem(storageKey,JSON.stringify(seeded)); } catch { cerhStorageIssue='O armazenamento local não está disponível. Não será possível confirmar o salvamento neste navegador.'; }
  return seeded;
}
let data = loadData();
if (typeof window !== 'undefined') {
  (window as unknown as { __getCerhData?: () => CerhData }).__getCerhData = () => data;
}
const listeners = new Set<() => void>();
function publish(next: CerhData) {
  if (preserveUnreadable) throw new Error(cerhStorageIssue);
  try { localStorage.setItem(storageKey, JSON.stringify({ ...next, ventures:next.ventures.filter(v=>!v.unsaved),points:next.points.filter(p=>!p.unsaved) })); } catch { throw new Error('Não foi possível salvar neste navegador. Libere espaço ou permita o armazenamento local e tente novamente.'); }
  data = next;
  listeners.forEach(l => l());
}
function preview(next: CerhData) { data=next;listeners.forEach(l=>l()); }
export const getCerhData = () => data;
export function useCerhData() { return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, getCerhData, getCerhData); }
export const getSession = () => mockSession(params().get('cerh-perfil') || undefined);
// Local working copies survive refresh, never replace an official declaration/snapshot.
const draftKey = `${storageKey}:form-drafts`;
export const formDrafts = new Map<string, { version: number; data: PointData }>();
try {
  const raw = localStorage.getItem(draftKey);
  const drafts = JSON.parse(raw || '[]');
  if (legacyLoaded && raw) { try { if (!localStorage.getItem(draftKey+':before-missao02')) localStorage.setItem(draftKey+':before-missao02',raw); } catch { /* Original bytes retained at the original key. */ } }
  for (const [pointId,draft] of drafts) {
    const point=data.points.find(p=>p.id===pointId && p.version===draft.version);
    if (!point || !draft.data?.location || !draft.data?.technical) continue;
    const upgraded = legacyLoaded ? migrateCerh({ revision:1, sequence:1,ventures:structuredClone(data.ventures),points:[{...structuredClone(point),...structuredClone(draft.data)}] }).points[0] : draft.data;
    formDrafts.set(pointId,{version:draft.version,data:currentData(upgraded)});
  }
} catch { /* Optional prototype persistence. */ }
function persistFormDrafts() {
  try { localStorage.setItem(draftKey, JSON.stringify([...formDrafts])); } catch { /* No productive persistence. */ }
}
function forgetFormDraft(pointId: string) { formDrafts.delete(pointId); persistFormDrafts(); }
const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
function event(point: Point, session: Session, name: string, reason?: string, changes?: HistoryEvent['changes']): HistoryEvent {
  return { id: id('EV'), date: now(), event: name, author: session.name, profile: session.profile, reason, changes, version: point.version };
}
function replacePoint(point: Point) { publish({ ...data, points: data.points.map(p => p.id === point.id ? point : p) }); }
function fail(message: string): never { throw new Error(message); }
const checked = (pointId: string, session: Session) => {
  const point = data.points.find(p => p.id === pointId);
  if (!point || !capabilities(point, session.userId ? sessionForProfile(session.userId) : session).access) fail('Você não possui acesso a este cadastro.');
  return point!;
};
// FZ06: a separate demonstration number, allocated only at first print.
export function prepareCertificate(pointId: string, session: Session) {
  const point = checked(pointId, session);
  if (!capabilities(point, session).certificate) fail('O certificado não pode ser impresso enquanto o cadastro estiver Rascunho.');
  if (point.certificateNumber) return point.certificateNumber;
  const certificateNumber = `${new Date(point.firstSentAt || point.createdAt).getFullYear()}.000.${String(data.points.filter(p => p.number).findIndex(p => p.id === point.id) + 1).padStart(5, '0')}/CERH`;
  replacePoint({ ...point, certificateNumber });
  return certificateNumber;
}
export function addPoint(ventureId: string, type: UseType, session: Session) {
  session = session.userId ? sessionForProfile(session.userId) : session;
  const venture = mutableVenture(ventureId, session);
  if (venture.water !== 'Sim' || !enabledTypes(venture).includes(type)) fail('Este tipo de uso não está habilitado.');
  const point = makePoint(type, ventureId, id(`RASC-MOCK-${type}`));
  point.unsaved = true; point.createdAt = now(); point.author = session.name; point.authorId = session.userId;
  point.holderId = venture.holderId; point.propertyId = venture.propertyId;
  point.effectiveStatus = 'Rascunho'; point.agreement = venture.identification.instrumentId;
  point.history = [event(point, session, 'Criação do rascunho')];
  preview({ ...data, points: [...data.points, point] });
  return point.id;
}
export function enabledTypes(v: Venture): UseType[] {
  if (v.water !== 'Sim') return [];
  const available = useTypeOrder.filter(t => v[t === 'BAR' || t === 'INT' ? 'intervention' : t === 'SUP' || t === 'SUB' ? 'capture' : 'discharge'] === 'Sim');
  return available.filter(t => v.selectedTypes === undefined || v.selectedTypes.includes(t));
}
export function affectedTypes(field: 'water' | 'intervention' | 'capture' | 'discharge'): UseType[] {
  return field === 'water' ? useTypeOrder : field === 'intervention' ? ['BAR', 'INT'] : field === 'capture' ? ['SUP', 'SUB'] : ['EFL'];
}
export function validateWaterSelection(venture: Venture): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!venture.water) errors.water = 'Informe se o empreendimento faz uso da água.';
  if (venture.water !== 'Sim') return errors;
  const active = enabledTypes(venture);
  for (const [category, label] of [['intervention', 'intervenção'], ['capture', 'captação'], ['discharge', 'lançamento']] as const) {
    if (!venture[category]) errors[category] = `Responda à pergunta sobre ${label}.`;
    else if (venture[category] === 'Sim' && !affectedTypes(category).some(type => active.includes(type))) errors[category] = `Selecione ao menos um tipo de ${label}.`;
  }
  return errors;
}
export function saveWaterUse(ventureId: string, session: Session, incoming?: Pick<Venture, 'water' | 'intervention' | 'capture' | 'discharge' | 'selectedTypes' | 'identification'>, draft = false) {
  session = session.userId ? sessionForProfile(session.userId) : session;
  const venture = mutableVenture(ventureId, session);
  const next = { ...venture, ...structuredClone(incoming || {}) };
  const allowedRoles = identificationRoles(session);
  if (!draft && (Object.keys(validateWaterSelection(next)).length || Object.keys(validateIdentification(next.identification)).length || !allowedRoles.includes(next.identification.role))) fail('Preencha todos os campos obrigatórios antes de prosseguir.');
  if (next.identification.role === 'ACT/CONVÊNIO/CONTRATO' && next.identification.instrumentId && !session.instrumentIds?.includes(next.identification.instrumentId)) fail('Selecione um instrumento vigente vinculado ao seu usuário.');
  next.identification.actorEmail = session.email; next.identification.actorName = session.name; next.identification.actorId = session.userId;
  next.savedStages = [...new Set([...(next.savedStages || []), ...(draft ? [] : ['water'])])];
  publish({ ...data, ventures: data.ventures.map(v => v.id === ventureId ? next : v) });
}
export function canReadVenture(venture: Venture, session: Session) {
  return session.authorized && (session.external ? venture.holderId === session.personId || !!venture.linkedUserIds?.includes(session.userId || '') : hasGrant(session, 'emp.access'));
}
function mutableVenture(ventureId: string, session: Session) {
  const fresh = session.userId ? sessionForProfile(session.userId) : session;
  const venture = data.ventures.find(v => v.id === ventureId);
  if (!venture || !canReadVenture(venture, fresh) || (!fresh.external && !hasGrant(fresh, 'emp.water'))) fail('Você não possui permissão para cadastrar o uso da água neste empreendimento.');
  return venture!;
}
export function changeUseType(ventureId: string, type: UseType, selected: boolean, session: Session) {
  const venture = mutableVenture(ventureId, session);
  const active = enabledTypes(venture);
  publish({ ...data, ventures: data.ventures.map(v => v.id === ventureId ? { ...v, selectedTypes: useTypeOrder.filter(t => t === type ? selected : active.includes(t)) } : v) });
}
export function createVenture(session: Session) {
  session = session.userId ? sessionForProfile(session.userId) : session;
  if (!session.authorized || (!session.external && (!hasGrant(session, 'emp.access') || !hasGrant(session, 'emp.create')))) fail('Você não possui permissão para criar empreendimento.');
  const identification = defaultIdentification();
  identification.actorEmail = session.email; identification.actorName = session.name; identification.actorId = session.userId; identification.role = session.external ? 'Requerente' : '';
  const venture: Venture = { id: id('VENT-MOCK'), name: '', holder: '', holderId: session.external ? session.personId : undefined, document: '', email: '', phone: '', property: '', address: '', municipality: '', latitude: '', longitude: '', addressFields: { cep: '', street: '', number: '', neighborhood: '', complement: '' }, water: '', intervention: '', capture: '', discharge: '', selectedTypes: [], draft: true, unsaved: true, savedStages: [], identification, creationAudit: { date: now(), author: session.name } };
  preview({ ...data, ventures: [...data.ventures, venture] }); return venture.id;
}
export function ventureReferences() {
  const ventures = data.ventures.filter(v => v.name && v.holderId && v.holder && v.propertyId);
  return { people: [...new Map(ventures.map(v => [v.holderId!, { id: v.holderId!, name: v.holder, document: v.document, email: v.email, phone: v.phone, address: v.address }])).values()], properties: [...new Map(ventures.map(v => [v.propertyId!, { id: v.propertyId!, holderId: v.holderId!, name: v.propertyName || `${v.property} — ${v.name}`, type: v.property, municipality: v.municipality, address: v.address, latitude: v.latitude, longitude: v.longitude }])).values()] };
}
export function saveVentureStage(ventureId: string, stage: string, incoming: Partial<Venture>, session: Session, draft = false) {
  const venture = data.ventures.find(v => v.id === ventureId);
  const fresh = session.userId ? sessionForProfile(session.userId) : session;
  if (!venture || !canReadVenture(venture, fresh) || (!fresh.external && !hasGrant(fresh, venture.draft ? 'emp.create' : 'emp.water'))) fail('Edição cadastral indisponível para este perfil.');
  const next = { ...venture!, ...structuredClone(incoming), id: ventureId, unsaved:false };
  if (!draft && (stage === 'user-property' ? !next.holderId || !next.propertyId : stage === 'venture' ? !next.name.trim() : !next.holderId || !next.name.trim() || !next.propertyId)) fail('Preencha todos os campos obrigatórios antes de prosseguir.');
  if (!draft && fresh.external && stage === 'location' && (!next.municipality || !next.latitude || !next.longitude)) fail('Preencha todos os campos obrigatórios antes de prosseguir.');
  if (!draft) next.savedStages = [...new Set([...(next.savedStages || []), stage])];
  if (!draft && stage === 'location') next.draft = false;
  publish({ ...data, ventures: data.ventures.map(v => v.id === ventureId ? next : v) });
}
export function discardEmptyVenture(ventureId: string, session: Session) {
  const v = data.ventures.find(v => v.id === ventureId);
  if (v?.unsaved && v.creationAudit?.author === session.name && !data.points.some(p => p.ventureId === ventureId)) preview({ ...data, ventures: data.ventures.filter(v => v.id !== ventureId) });
}
export function recordDuplicateContinuation(ventureId: string, session: Session) {
  const v = data.ventures.find(v => v.id === ventureId);
  if (v?.draft && v.creationAudit?.author === session.name) publish({ ...data, ventures: data.ventures.map(v => v.id === ventureId ? { ...v, creationAudit: { date: now(), author: session.name } } : v) });
}
function changedBlocks(before: PointData, after: PointData): NonNullable<HistoryEvent['changes']> {
  const groups: [string, unknown, unknown][] = [['Localização', before.location, after.location], ['Caracterização', { technical: before.technical, appoFile: before.appoFile }, { technical: after.technical, appoFile: after.appoFile }], ['Finalidades', { purposes: before.purposes, data: before.purposeData, animals: before.animals }, { purposes: after.purposes, data: after.purposeData, animals: after.animals }], ['Regimes', before.regimes, after.regimes]];
  return groups.filter(([, a, b]) => JSON.stringify(a) !== JSON.stringify(b)).map(([field, a, b]) => ({ field, before: JSON.stringify(a), after: JSON.stringify(b) }));
}
function reclassifyGroups(next: CerhData, session: Session) {
  for (const point of next.points) {
    if (!point.number || point.lifecycle === 'Rascunho') continue;
    if (['BAR', 'SUP', 'SUB'].includes(point.type)) point.relatedComposition = snapshotRelated(next, point);
    if (['Outorgado','Inexigível','Dispensado','Indeferido','Cancelado'].includes(point.effectiveStatus || '')) continue;
    const status = preclassify(next, point);
    if (point.effectiveStatus !== status) point.history.push(event(point, session, 'Atualização da pré-classificação', undefined, [{ field: 'Situação', before: point.effectiveStatus || point.classification, after: status }]));
    point.effectiveStatus = status;
    point.classification = status as Point['classification'];
  }
  return next;
}
export function savePoint(pointId: string, incoming: PointData, session: Session, options: { conclude?: boolean; reason?: string; reviewed?: boolean } = {}) {
  session = session.userId ? sessionForProfile(session.userId) : session;
  const old = checked(pointId, session), cap = capabilities(old, session);
  if (!cap.direct) fail(cap.reason || 'A edição precisa de autorização.');
  if (options.conclude) fail('Envie os pontos pelo Resumo e Confirmação do empreendimento.');
  const before = currentData(old), allowed = cap.editableBlocks;
  const nextData: PointData = {
    location: allowed.includes('Localização') ? incoming.location : before.location,
    technical: allowed.includes('Caracterização') ? incoming.technical : before.technical,
    purposes: allowed.includes('Finalidades') ? incoming.purposes : before.purposes,
    purposeData: allowed.includes('Finalidades') ? incoming.purposeData : before.purposeData,
    animals: allowed.includes('Finalidades') ? incoming.animals : before.animals,
    regimes: allowed.includes('Regimes') ? incoming.regimes : before.regimes,
    appoFile: allowed.includes('Caracterização') ? incoming.appoFile : before.appoFile,
  };
  if (old.lifecycle !== 'Rascunho' && Object.keys(validatePoint(old.type,nextData)).length) fail('Preencha todos os campos obrigatórios antes de prosseguir.');
  const next = { ...structuredClone(old), ...structuredClone(nextData), unsaved:false };
  if (old.lifecycle !== 'Rascunho') { next.snapshots.push({ version: old.version, data: before, classification: old.classification }); next.version++; }
  next.purposeLabels = Object.fromEntries(next.purposes.map(id => [id,purposeLabel(id)]));
  next.history.push(event(next,session,old.lifecycle === 'Rascunho' ? 'Salvamento do rascunho' : 'Alteração do cadastro',undefined,changedBlocks(before,nextData)));
  if (cap.approved && old.lifecycle !== 'Rascunho') next.requests = next.requests.map(r => r.id === cap.approved!.id ? { ...r, status: 'Utilizada' } : r);
  next.consideredFlow = undefined;
  const result = { ...structuredClone(data), points: data.points.map(p => p.id === pointId ? next : structuredClone(p)) };
  if (old.lifecycle === 'Rascunho') result.ventures = result.ventures.map(v=>v.id===old.ventureId ? {...v,savedStages:[...new Set([...(v.savedStages||[]),old.type])]} : v);
  publish(old.lifecycle === 'Rascunho' ? result : reclassifyGroups(result,session));
  forgetFormDraft(pointId);
}
export function submitConsolidatedVenture(ventureId: string, session: Session, options: { reviewed?: boolean } = {}) {
  session = session.userId ? sessionForProfile(session.userId) : session;
  const venture = mutableVenture(ventureId,session);
  const enabled = enabledTypes(venture);
  const drafts = data.points.filter(p => p.ventureId === ventureId && p.lifecycle === 'Rascunho' && !p.unsaved && enabled.includes(p.type));
  if (!drafts.length) fail('Não há cadastros em rascunho para envio neste empreendimento.');
  if (!identificationRoles(session).includes(venture.identification.role) || !options.reviewed || Object.keys(validateIdentification(venture.identification)).length || enabled.some(t => !data.points.some(p => p.ventureId === ventureId && p.type === t)) || drafts.some(p => Object.keys(validatePoint(p.type,currentData(p))).length)) fail('Preencha todos os campos obrigatórios antes de prosseguir.');
  // Check the current instrument at the final mutation, not only while opening the form.
  if (session.profile === 'Conveniado' && drafts.some(p => p.agreement && !session.instrumentIds?.includes(p.agreement))) fail('Instrumento do rascunho indisponível ou encerrado.');
  const next = structuredClone(data), sentAt = now(), year = new Date(sentAt).getFullYear();
  const ids = drafts.map(p => p.id);
  for (const p of next.points.filter(p => ids.includes(p.id))) {
    p.lifecycle = 'Concluído'; p.number = `${year}.000.${String(next.sequence).padStart(5,'0')}`;
    p.certificateNumber = `${p.number}/CERH`; next.sequence++;
    p.firstSentAt = sentAt; p.author = session.name; p.authorId = session.userId;
    p.identification = { ...structuredClone(venture.identification), actorName: session.name, actorId: session.userId, actorEmail: session.email };
    p.agreement = venture.identification.role === 'ACT/CONVÊNIO/CONTRATO' ? venture.identification.instrumentId : undefined;
    p.holderId = venture.holderId; p.propertyId = venture.propertyId;
    p.purposeLabels = Object.fromEntries(p.purposes.map(id => [id,purposeLabel(id)]));
    p.effectiveStatus = preclassify(next,p); p.history.push(event(p,session,'Conclusão do cadastro'));
  }
  const submission = { id:id('SEND-MOCK'),ventureId,pointIds:ids,date:sentAt,actor:session.name,recipient:venture.email,internal:!session.external };
  next.submissions = [...(next.submissions || []),submission];
  publish(reclassifyGroups(next,session));
  ids.forEach(forgetFormDraft);
  return submission;
}
export function deleteDraft(pointId: string, session: Session) {
  const p = checked(pointId, session);
  if (!capabilities(p, session).remove) fail('Somente rascunhos elegíveis podem ser excluídos.');
  forgetFormDraft(pointId);
  publish({ ...data, points: data.points.filter(p => p.id !== pointId) });
}
export function cancelPoint(pointId: string, reason: string, session: Session, fileName?: string) {
  session = session.userId ? sessionForProfile(session.userId) : session;
  const p = checked(pointId, session);
  if (!capabilities(p, session).cancel) fail('Cancelamento indisponível para este cadastro.');
  if (!reason.trim()) fail('Informe a justificativa do cancelamento.');
  const next = structuredClone(p);
  next.lifecycle = 'Cancelado'; next.history.push(event(next, session, 'Cancelamento do cadastro', reason + (fileName ? ` Anexo de sessão: ${fileName}.` : ''), [{ field: 'Situação', before: p.lifecycle, after: 'Cancelado' }]));
  next.effectiveStatus = 'Cancelado';
  publish(reclassifyGroups({ ...structuredClone(data), points:data.points.map(p => p.id === pointId ? next : structuredClone(p)) },session));
}
export function requestEdit(pointId: string, reason: string, requested: Block[], session: Session) {
  session = session.userId ? sessionForProfile(session.userId) : session;
  const p = checked(pointId, session);
  if (!capabilities(p, session).request) fail(capabilities(p, session).reason || 'Solicitação indisponível.');
  if (!reason.trim() || !requested.length) fail('Informe a justificativa e selecione os blocos solicitados.');
  const next = structuredClone(p);
  next.requests.push({ id: id('ED-MOCK'), date: now(), author: session.name, profile: session.profile, reason, requested, approved: [], status: 'Pendente' });
  next.history.push(event(next, session, 'Solicitação de edição', reason)); replacePoint(next);
}
export function decideEdit(pointId: string, approved: Block[], reason: string, accept: boolean, session: Session) {
  session = session.userId ? sessionForProfile(session.userId) : session;
  const p = checked(pointId, session), cap = capabilities(p, session);
  if (!cap.decide) fail('A decisão está indisponível para este perfil ou cadastro.');
  const request = p.requests.find(r => r.status === 'Pendente')!;
  if (!reason.trim()) fail('Informe a justificativa da decisão.');
  approved = [...request.requested];
  const next = structuredClone(p);
  next.requests = next.requests.map(r => r.id === request.id ? { ...r, approved: accept ? approved : [], status: accept ? 'Aprovada' : 'Recusada', decisionReason: reason, decidedBy: session.name, decidedAt: now() } : r);
  next.history.push(event(next, session, accept ? 'Aprovação da edição' : 'Recusa da edição', reason, [{ field:'Blocos liberados',before:'Nenhum',after:accept ? approved.join(', ') : 'Nenhum' }]));
  const notification = { id:id('NOTICE-MOCK'),recipient:request.author,pointId:pointId,number:p.number!,decision:accept ? 'Aprovada' : 'Recusada',reason,date:now(),read:false };
  publish({ ...data,points:data.points.map(p => p.id===pointId ? next : p),notifications:[...(data.notifications || []),notification] });
}
export function markNotificationRead(notificationId: string, session: Session) {
  publish({ ...data, notifications:(data.notifications||[]).map(n=>n.id===notificationId && n.recipient===session.name ? {...n,read:true} : n) });
}

export function discardUnsavedPoint(pointId: string) {
 if(data.points.some(p=>p.id===pointId&&p.unsaved)) preview({...data,points:data.points.filter(p=>p.id!==pointId)});
}
