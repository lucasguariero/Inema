import type { Block, CerhData, Fields, Identification, Point, PointData, Regime, RelatedComposition, Session, UseType } from './types';
import { activeData, list, purposeFields, str, technicalFields, type FieldSpec } from './fields';
import { hasGrant, purposeKey, purposeOptions, sessionForProfile } from './administration';
import { displayStatus } from './decisions';
export const num = (value: string) => value.trim() === '' ? NaN : Number(value.replace(',', '.'));
export const format = (value: number | undefined, decimals = 3) => value === undefined || !Number.isFinite(value) ? '—' : value.toLocaleString('pt-BR', { maximumFractionDigits: decimals });
export const missing = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
export const messages = {
  required: 'Preencha todos os campos obrigatórios antes de prosseguir.',
  filter: 'Informe pelo menos um filtro para realizar a pesquisa.',
  collision: 'O período informado já está cadastrado em outro regime deste ponto.',
  treatment: "O valor de 'Efluente Tratado' não pode ser superior ao valor de 'Efluente Bruto'.",
};
export function regimeError(r: Regime, others: Regime[], type: UseType): string | undefined {
  if (missing(r.flow) || missing(r.hours) || missing(r.days) || r.months.length === 0) return messages.required;
  const q = num(r.flow), h = num(r.hours), m = r.minutes === '' ? 0 : num(r.minutes), d = num(r.days);
  if (![q, h, m, d].every(Number.isFinite) || q <= 0 || !Number.isInteger(h) || h < 0 || h > 24 || !Number.isInteger(m) || m < 0 || m > 59 || h + m / 60 > 24 || !Number.isInteger(d) || d < 1 || d > 31) return 'Verifique a vazão positiva, o período de até 24 horas e os dias por mês (1 a 31).';
  if (new Set(r.months).size !== r.months.length || r.months.some(v => !Number.isInteger(v) || v < 0 || v > 11)) return 'Selecione meses válidos.';
  if (others.some(o => o.id !== r.id && o.months.some(mo => r.months.includes(mo)))) return messages.collision;
}
export function regimeVolumes(r: Regime) {
  const daily = num(r.flow) * (num(r.hours) + (r.minutes === '' ? 0 : num(r.minutes)) / 60);
  const monthly = daily * num(r.days);
  return { daily, monthly, annual: monthly * r.months.length };
}
export function consolidation(regimes: Regime[]) {
  return { annual: regimes.reduce((sum, r) => sum + regimeVolumes(r).annual, 0), maximum: regimes.length ? Math.max(...regimes.map(r => num(r.flow))) : undefined };
}
export function efficiency(raw: string, treated: string) {
  const r = num(raw), t = num(treated);
  return r > 0 && Number.isFinite(t) && t >= 0 && t <= r ? (r - t) / r * 100 : undefined;
}
export function fieldErrors(specs: FieldSpec[], data: Fields, prefix = '') {
  const errors: Record<string, string> = {};
  for (const f of specs) {
    const value = data[f.key];
    if (f.required && missing(value)) errors[prefix + f.key] = 'Campo obrigatório.';
    else if (f.kind === 'number' && !missing(value)) {
      const n = num(typeof value === 'string' ? value : '');
      if (!Number.isFinite(n) || (f.positive && n <= 0) || (f.integer && !Number.isInteger(n)) || (f.min !== undefined && n < f.min) || (f.max !== undefined && n > f.max)) errors[prefix + f.key] = f.positive ? 'Informe um número positivo.' : 'Informe um número válido.';
    } else if (f.kind === 'date' && !missing(value) && (!/^\d{4}-\d{2}-\d{2}$/.test(String(value)) || !Number.isFinite(Date.parse(String(value))) || new Date(String(value)).toISOString().slice(0,10) !== value)) errors[prefix + f.key] = 'Informe uma data válida.';
    else if (f.options && !missing(value) && (Array.isArray(value) ? value.some(v => !f.options!.includes(v)) : !f.options.includes(value as string))) errors[prefix + f.key] = 'Selecione uma opção válida.';
  }
  return errors;
}
export function validatePoint(type: UseType, data: PointData) {
  const errors: Record<string, string> = {};
  for (const key of ['latitude', 'longitude', 'municipality', 'rpga', 'basin'] as const) if (missing(data.location[key])) errors[`location.${key}`] = 'Campo obrigatório.';
  for (const [key, min, max] of [['latitude', -90, 90], ['longitude', -180, 180]] as const) if (data.location[key] && (!Number.isFinite(num(data.location[key])) || num(data.location[key]) < min || num(data.location[key]) > max)) errors[`location.${key}`] = 'Informe uma coordenada válida em graus decimais.';
  if (type !== 'SUB') for (const key of ['waterBody', 'bodyType'] as const) if (missing(data.location[key])) errors[`location.${key}`] = 'Campo obrigatório.';
  Object.assign(errors, fieldErrors(technicalFields(type, data.technical), data.technical, 'technical.'));
  if (['BAR', 'SUP', 'SUB'].includes(type) && purposeOptions(type).length > 0 && !data.purposes.length) errors.purposes = 'Selecione pelo menos uma finalidade.';
  for (const p of data.purposes) {
    const values = data.purposeData[p] || {};
    Object.assign(errors, fieldErrors(purposeFields(type, p, values), values, `purpose.${p}.`));
    if (purposeKey(p) === 'Irrigação' && !list(values, 'systems').length) errors[`purpose.${p}.systems`] = 'Selecione pelo menos um sistema de irrigação.';
    if (purposeKey(p) === 'Outras' && !list(values, 'uses').length) errors[`purpose.${p}.uses`] = 'Selecione pelo menos um uso.';
    if (purposeKey(p) === 'Dessedentação animal' && (!data.animals.length || data.animals.some(a => !a.species || !a.system || !a.heads || !Number.isInteger(num(a.heads)) || num(a.heads) < 0))) errors.animals = 'Inclua pelo menos uma linha completa com espécie, sistema e número de cabeças.';
  }
  if (['SUP', 'SUB', 'EFL'].includes(type)) {
    if (!data.regimes.length) errors.regimes = 'Inclua pelo menos um regime.';
    for (const r of data.regimes) { const e = regimeError(r, data.regimes, type); if (e) errors.regimes = e; }
  }
  if (type === 'EFL') {
    if (!list(data.technical, 'origins').length) errors['technical.origins'] = 'Selecione pelo menos uma origem.';
    if (data.technical.treated === 'Sim') for (const [raw, treated] of [['rawDbo', 'treatedDbo'], ['rawColiform', 'treatedColiform']]) if (num(str(data.technical, treated)) > num(str(data.technical, raw))) errors[`technical.${treated}`] = messages.treatment;
  }
  return errors;
}
export function validateIdentification(i: Identification) {
  const errors: Record<string, string> = {};
  if (!i.role) errors.role = 'Selecione sua forma de participação.';
  if (i.role === 'ACT/CONVÊNIO/CONTRATO' && !i.instrumentId) errors.instrumentId = 'Selecione o instrumento de parceria vigente.';
  if (i.role === 'ACT/CONVÊNIO/CONTRATO' && !i.authorization) errors.authorization = 'Confirme a autorização do titular.';
  return errors;
}
export function capabilities(point: Point, session: Session) {
  session = session.userId ? sessionForProfile(session.userId) : session;
  const external = session.external ?? ['Requerente', 'Procurador', 'Responsável técnico'].includes(session.profile);
  const owns = !external || point.holderId === session.personId;
  const access = session.authorized && owns && (external || hasGrant(session, 'emp.water') || hasGrant(session, 'consult.access') || hasGrant(session, 'emp.access'));
  const locked = false;
  const pending = point.requests.some(r => r.status === 'Pendente');
  const approved = [...point.requests].reverse().find(r => r.status === 'Aprovada' && r.author === session.name);
  const terminal = displayStatus(point) === 'Cancelado';
  const instrumentAllowed = session.profile !== 'Conveniado' || !point.agreement || Boolean(session.instrumentIds?.includes(point.agreement));
  const draft = point.lifecycle === 'Rascunho';
  const canEdit = access && (external || (hasGrant(session, 'emp.access') && hasGrant(session, 'emp.water'))) && instrumentAllowed && !pending && !terminal;
  const direct = canEdit && (draft || !point.process || Boolean(approved));
  return { access, locked, pending, direct, request: canEdit && !draft && Boolean(point.process), approved,
    editableBlocks: (approved ? approved.approved : direct ? ['Localização', 'Caracterização', 'Finalidades', 'Regimes'] : []) as Block[],
    remove: canEdit && draft,
    cancel: access && hasGrant(session, 'consult.access') && hasGrant(session, 'consult.cancel') && !draft && !terminal,
    certificate: access && instrumentAllowed && point.lifecycle !== 'Rascunho',
    decide: access && hasGrant(session, 'consult.access') && hasGrant(session, 'consult.decide') && pending && point.requests.find(r => r.status === 'Pendente')?.author !== session.name && !terminal,
    reason: !access ? 'Você não possui vínculo autorizado com este cadastro.' : !instrumentAllowed ? 'O instrumento deste rascunho não está vigente ou não está vinculado ao seu usuário.' : pending ? 'Há uma solicitação de edição pendente de análise.' : terminal ? 'Cadastro cancelado disponível somente para consulta.' : undefined,
  };
}
export function currentData(point: Point): PointData {
  return activeData(point.type, { location: point.location, technical: point.technical, purposes: point.purposes, purposeData: point.purposeData, animals: point.animals, regimes: point.regimes, appoFile: point.appoFile });
}
export function snapshotRelated(data: CerhData, point: Point): RelatedComposition {
  const entries = data.points.filter(p => p.id !== point.id && sameGroup(data, point, p));
  const value = pointValue;
  const own = value(point);
  return { entries: entries.map(p => ({ id: p.id, number: p.number!, value: value(p) })), own, total: [own, ...entries.map(value)].every(v => v !== undefined && Number.isFinite(v)) ? (own || 0) + entries.reduce((sum, p) => sum + (value(p) || 0), 0) : undefined, unit: point.type === 'BAR' ? 'm³' : 'L/s' };
}
export function sameGroup(data: CerhData, a: Point, b: Point) {
  if (a.type !== b.type || !['BAR', 'SUP', 'SUB'].includes(a.type) || !b.number || ['Cancelado', 'Indeferido', 'Rascunho'].includes(displayStatus(b))) return false;
  const av = data.ventures.find(v => v.id === a.ventureId), bv = data.ventures.find(v => v.id === b.ventureId);
  if (!av || !bv || (av.holderId || av.document) !== (bv.holderId || bv.document)) return false;
  return a.type === 'SUB' ? Boolean(av.propertyId || av.property) && (av.propertyId || av.property) === (bv.propertyId || bv.property) : a.ventureId === b.ventureId && Boolean(a.location.waterBody.trim()) && a.location.waterBody.trim().toLocaleLowerCase() === b.location.waterBody.trim().toLocaleLowerCase();
}
export function pointValue(point: Point) { return point.type === 'BAR' ? num(str(point.technical, 'volume')) : (consolidation(point.regimes).maximum ?? NaN) / 3.6; }
export function preclassify(data: CerhData, point: Point): NonNullable<Point['effectiveStatus']> {
  if (point.type === 'EFL') return 'Necessária análise técnica';
  if (point.type === 'INT') {
    const answers = ['quantity', 'quality', 'waterRegime'].map(k => str(point.technical, k));
    return answers.includes('Sim') ? 'Passível de outorga' : answers.every(a => a === 'Não') ? 'Passível de inexigibilidade de outorga' : 'Necessária análise técnica';
  }
  const total = snapshotRelated(data, point).total;
  if (total === undefined) return 'Necessária análise técnica';
  return (point.type === 'BAR' ? total < 200000 : total <= 0.5) ? 'Passível de dispensa de outorga' : 'Passível de outorga';
}
export function related(data: CerhData, point: Point) {
  const composition = point.relatedComposition || snapshotRelated(data, point);
  return { ...composition, value: (p: { id: string }) => composition.entries.find(e => e.id === p.id)?.value };
}
