import { documentoValido, lerCoordenada } from '@/lib/pautaGestor';
import { REQUIREMENTS } from './requirements';
import type { Actor, Attachment, Attendance, Command, Coordinate, Errors, Infraction, Person, Report, ReportContent, ReportKind, Repository } from './types';
import { validateInfraction } from './normative';

export const TITLES = { DOR008: 'Relatório de Fiscalização Ambiental', DOR009: 'Relatório de Atendimento de Emergência' };
export const SHORT = { DOR008: 'RFA', DOR009: 'RAE' };
export const ACTORS: Actor[] = [
 { id: 'tec-1', role: 'tecnico', name: 'Técnico Autor — demonstração' }, { id: 'gestor-1', role: 'gestor', name: 'Gestor — demonstração' },
 { id: 'tec-2', role: 'tecnico', name: 'Outro Técnico — demonstração' }, { id: 'consulta-1', role: 'consulta', name: 'Consulta Interna — demonstração' }, { id: 'externo-1', role: 'externo', name: 'Externo — sem acesso' },
];
export const uid = () => crypto.randomUUID();
export const emptyPerson = (): Person => ({ name: '', document: '', address: '', complement: '', cep: '', email: '', phone: '' });
export function message(kind: ReportKind, n: number) { return REQUIREMENTS[kind][`MSG${String(n).padStart(3, '0')}` as keyof typeof REQUIREMENTS[typeof kind]]?.text || 'Confira os dados informados.'; }
export function legend(kind: ReportKind, n: number) { return REQUIREMENTS[kind][`LEG${String(n).padStart(3, '0')}` as keyof typeof REQUIREMENTS[typeof kind]]?.text || ''; }
export const canRead = (r: Report, a: Actor) => a.role === 'gestor' || a.role === 'consulta' || a.role === 'tecnico' && r.authorId === a.id;
export function canEdit(r: Report, a: Actor, field: string) {
 if (a.role !== 'tecnico' || a.id !== r.authorId || r.status === 'Finalizado') return false;
 if (r.status === 'Rascunho' || r.kind === 'DOR009') return true;
 // P01: provisional RFA policy from Mission01; never inherit the RAE policy.
 return ['infractions', 'notifications', 'outcomes'].includes(field);
}
export function newReport(kind: ReportKind, actor: Actor, now = new Date().toISOString()): Report {
 if (actor.role !== 'tecnico') throw Error(message(kind, 17));
 const content: ReportContent = { originator: '', person: emptyPerson(), participants: [], location: { address: '', number: '', municipality: '', reference: '' }, coordinates: [], history: [], description: '', conclusion: '', outcomes: [], infractions: [], notifications: [], attachments: [], provenance: {} };
 const base = { id: uid(), authorId: actor.id, authorName: actor.name, status: 'Rascunho' as const, revision: 0, version: 0, createdAt: now, updatedAt: now, audit: [], versions: [] };
 return kind === 'DOR008' ? { ...base, kind, content: { ...content, attendance: { id: uid(), start: '', end: '' } } } : { ...base, kind, content: { ...content, attendances: [], relatedProcesses: [], companies: [], recommendations: '', participants: [{ id: uid(), userId: actor.id, name: actor.name, job: 'Técnico responsável', phone: '', email: '', responsible: true }] } };
}
export function validAttendance(p: Attendance, now = new Date().toISOString()) {
 const start = Date.parse(p.start), end = Date.parse(p.end);
 return Number.isFinite(start) && Number.isFinite(end) && end >= start && end <= Date.parse(now) && start <= Date.parse(now);
}
export const overlapFingerprint = (p: Attendance, list: Attendance[]) => JSON.stringify([p.start, p.end, list.filter(x => x.id !== p.id && Date.parse(x.start) < Date.parse(p.end) && Date.parse(p.start) < Date.parse(x.end)).map(x => [x.id, x.start, x.end]).sort()]);
export function overlapping(p: Attendance, list: Attendance[]) { return list.filter(x => x.id !== p.id && Date.parse(x.start) < Date.parse(p.end) && Date.parse(p.start) < Date.parse(x.end)); }
export function parseCoordinate(original: string, format: Coordinate['format']): Omit<Coordinate, 'id'> | null {
 const text = format.startsWith('utm') ? `${format === 'utm23' ? 23 : 24} S ${original}` : original;
 const result = lerCoordenada(text, format === 'decimal' ? 'Grau Decimal' : format === 'gms' ? 'Grau/Minuto/Segundo' : 'UTM');
 if (!result) return null;
 // Ten numeric characters per geographic axis; signs and separators are presentation.
 if (format === 'decimal' && original.split(';').some(v => v.replace(/\D/g, '').length > 10)) return null;
 return { original, format, datum: 'WGS84-demo', ...result };
}
export const EXTENSIONS = ['jpeg', 'jpg', 'png', 'bmp', 'mp3', 'mp4', 'pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'shp', 'shx', 'dbf', 'prj', 'kml', 'kmz', 'zip'];
export const IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'bmp'];
export function fileIssue(file: Pick<File, 'name' | 'size' | 'type'>, image: boolean) {
 const ext = file.name.split('.').pop()?.toLowerCase() || '';
 if (!(image ? IMAGE_EXTENSIONS : EXTENSIONS).includes(ext) || !file.size || /\.(?:exe|js|html|svg|bat|cmd|ps1)\./i.test(file.name)) return 'Formato de arquivo não permitido ou arquivo vazio.';
 const expected: Record<string, string[]> = { png: ['image/png'], jpg: ['image/jpeg'], jpeg: ['image/jpeg'], bmp: ['image/bmp', 'image/x-ms-bmp'], pdf: ['application/pdf'] };
 if (file.type && expected[ext] && !expected[ext].includes(file.type)) return 'O conteúdo declarado do arquivo não corresponde à extensão.';
 return '';
}
export function validateReport(r: Report, now = new Date().toISOString()): Errors {
 const c = r.content, e: Errors = {}, need = (path: string, ok: unknown, text: string) => { if (!ok) e[path] = text; };
 need('originator', c.originator, 'Selecione o processo originador.');
 need('person.name', c.person.name.trim(), 'Informe o nome ou razão social.'); need('person.document', documentoValido(c.person.document), message(r.kind, 6)); need('person.address', c.person.address.trim(), 'Informe o endereço da pessoa fiscalizada.');
 if (c.person.email) need('person.email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.person.email), 'Informe um e-mail válido.');
 need('participants', c.participants.length && c.participants.every(p => p.name.trim() && p.job.trim()), 'Adicione ao menos um participante com nome e função.');
 c.participants.forEach((p, i) => { need(`participants.${i}.name`, p.name.trim(), `Informe o nome do participante ${i + 1}.`); need(`participants.${i}.job`, p.job.trim(), `Informe a função do participante ${i + 1}.`); if (p.email) need(`participants.${i}.email`, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email), 'Informe um e-mail válido.'); });
 need('location.address', c.location.address.trim(), 'Informe o endereço/local.'); need('location.municipality', c.location.municipality, 'Informe o município.');
 need('coordinates', c.coordinates.length && c.coordinates.every(p => { const value = parseCoordinate(p.original, p.format); return value && Math.abs(value.lat - p.lat) < 1e-8 && Math.abs(value.lng - p.lng) < 1e-8; }), message(r.kind, 8));
 need('description', c.description.trim(), 'Descreva os fatos observados.'); need('conclusion', c.conclusion.trim(), 'Registre a conclusão.');
 if (r.kind === 'DOR008') need('attendance', validAttendance(r.content.attendance, now), message(r.kind, 7) + ' Confira também campos vazios e datas futuras.');
 else {
  need('attendances', r.content.attendances.length, 'Adicione ao menos um período de atendimento.');
  r.content.attendances.forEach((p, i) => { need(`attendances.${i}`, validAttendance(p, now), message(r.kind, 7)); if (overlapping(p, r.content.attendances).length) need(`attendances.${i}.overlap`, p.overlapConfirmed === overlapFingerprint(p, r.content.attendances), 'Confirme explicitamente a sobreposição após a última alteração dos períodos.'); });
  need('companies', r.content.companies.length && r.content.companies.every(x => x.name.trim() && documentoValido(x.document) && x.representatives.length && x.representatives.every(p => p.name.trim() && p.job.trim())), message(r.kind, 24));
  r.content.companies.forEach((company, i) => { need(`companies.${i}.name`, company.name.trim(), `Informe o nome/razão social da empresa ${i + 1}.`); need(`companies.${i}.document`, documentoValido(company.document), message(r.kind, 6)); company.representatives.forEach((p, j) => { need(`companies.${i}.representatives.${j}.name`, p.name.trim(), `Informe o nome do representante ${j + 1} da empresa ${i + 1}.`); need(`companies.${i}.representatives.${j}.job`, p.job.trim(), `Informe a função do representante ${j + 1} da empresa ${i + 1}.`); if (p.email) need(`companies.${i}.representatives.${j}.email`, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email), 'Informe um e-mail válido.'); }); });
  need('participants.responsible', c.participants.some(p => p.userId === r.authorId && p.responsible), 'O técnico autor deve permanecer como responsável pelo atendimento.');
  need('recommendations', r.content.recommendations.length <= 7000, message(r.kind, 23));
  need('attachments.images', c.attachments.some(a => a.purpose === 'image' && !fileIssue({ name: a.name, size: a.size, type: a.mime }, true)), 'Inclua ao menos uma imagem JPEG, JPG, PNG ou BMP na descrição.');
  need('relatedProcesses', !r.content.relatedProcesses.includes(c.originator) && new Set(r.content.relatedProcesses).size === r.content.relatedProcesses.length, 'O originador não pode ser duplicado entre os processos relacionados.');
 }
 c.attachments.forEach((a, i) => { need(`attachments.${i}`, a.blob instanceof Blob && a.size === a.blob.size && !fileIssue({ name: a.name, size: a.size, type: a.mime }, a.purpose === 'image') && a.description.trim(), 'Confira formato, conteúdo e descrição do arquivo.'); });
 c.infractions.forEach((n, i) => Object.entries(validateInfraction(n)).forEach(([p, error]) => { e[`infractions.${i}.${p}`] = error; }));
 c.notifications.forEach((n, i) => {
  need(`notifications.${i}.description`, n.description.trim(), 'Descreva a notificação.'); need(`notifications.${i}.summary`, n.summary.trim() && n.summary.length <= 500, 'O resumo manual é obrigatório e deve possuir até 500 caracteres.');
  need(`notifications.${i}.process`, n.processId === c.originator, 'A notificação deve estar vinculada ao processo originador.');
  need(`notifications.${i}.recipient`, n.recipient.name.trim() && documentoValido(n.recipient.document) && n.recipient.address.trim() && (!n.differentRecipient || n.recipientReason.trim()), 'Confira destinatário e justifique quando diferente da identificação.');
 });
 return e;
}
function equalContent(a: unknown, b: unknown) { return JSON.stringify(a) === JSON.stringify(b); }
export function applyCommand(repo: Repository, actor: Actor, cmd: Command, now = new Date().toISOString()): Repository {
 const next = structuredClone(repo), incoming = 'report' in cmd ? cmd.report : undefined, id = incoming?.id || ('id' in cmd ? cmd.id : '');
 const previous = next.records.find(r => r.id === id), r = incoming ? structuredClone(incoming) : previous;
 if (!r) throw Error('Relatório não encontrado.');
 if (previous && !canRead(previous, actor)) throw Error(message(r.kind, 17));
 if ((previous?.revision || 0) !== cmd.expectedRevision) throw Error('O relatório mudou em outra sessão. Reabra a versão salva antes de continuar.');
 if (previous && (r.kind !== previous.kind || r.authorId !== previous.authorId || r.number !== previous.number || r.version !== previous.version || r.createdAt !== previous.createdAt || r.status !== previous.status)) throw Error('Identidade ou estado do relatório divergente da versão salva.');
 if (cmd.action === 'return') {
  if (actor.role !== 'gestor' || r.status !== 'Finalizado' || !cmd.reason?.trim()) throw Error(message(r.kind, 17));
  r.status = 'Devolvido para ajuste'; r.returnReason = cmd.reason.trim();
 } else if (cmd.action === 'delete') {
  if (actor.role !== 'tecnico' || actor.id !== r.authorId || r.status !== 'Rascunho') throw Error(message(r.kind, 17));
  next.records = next.records.filter(x => x.id !== r.id); next.deleted.push({ id: r.id, kind: r.kind, at: now, actor: actor.name, audit: [...r.audit, { id: uid(), at: now, actor: actor.name, role: actor.role, revision: r.revision + 1, action: 'Exclusão de rascunho', detail: 'Confirmação local; sem efeito institucional.' }] }); return next;
 } else {
  if (actor.role !== 'tecnico' || actor.id !== r.authorId || r.status === 'Finalizado' || (!previous && (r.revision || r.number || r.version || r.status !== 'Rascunho'))) throw Error(message(r.kind, 17));
  const documents = [r.content.person.document, ...r.content.infractions.map(n => n.recipient.document), ...r.content.notifications.map(n => n.recipient.document), ...(r.kind === 'DOR009' ? r.content.companies.map(c => c.document) : [])];
  if (documents.some(d => !!d && !documentoValido(d))) throw Error(message(r.kind, 6));
  const periods = r.kind === 'DOR008' ? [r.content.attendance] : r.content.attendances;
  if (periods.some(p => [p.start, p.end].some(v => !!v && (!Number.isFinite(Date.parse(v)) || Date.parse(v) > Date.parse(now))) || p.start && p.end && !validAttendance(p, now))) throw Error(message(r.kind, 7) + ' Confira o período: datas futuras não são permitidas.');
  if (r.content.infractions.some(n => n.other.length > 500)) throw Error(message(r.kind, 19));
  if (r.kind === 'DOR009' && r.content.recommendations.length > 7000) throw Error(message(r.kind, 23));
  if (r.content.infractions.some(n => n.description.length > 1000 || Object.values(n.reasons).some(v => v.length > 500)) || r.content.notifications.some(n => n.summary.length > 500)) throw Error('Há texto acima do limite permitido. Confira os campos antes de salvar.');
  // Compare all content fields at the command boundary, not merely disabled controls.
  if (previous) for (const field of Object.keys(r.content)) if (!canEdit(previous, actor, field)) {
   const incomingFields = r.content as unknown as Record<string, unknown>, savedFields = previous.content as unknown as Record<string, unknown>;
   if (!equalContent(incomingFields[field], savedFields[field])) throw Error('Campo bloqueado pela política específica do RFA devolvido.');
   incomingFields[field] = structuredClone(savedFields[field]);
  }
  r.versions = structuredClone(previous?.versions || []) as Report['versions']; r.authorName = previous?.authorName || actor.name;
  if (cmd.action === 'finalize') {
   const errors = validateReport(r, now); if (Object.keys(errors).length) throw Error(message(r.kind, 1));
   if (!r.number) { const key = `${r.kind}:${now.slice(0, 4)}`, n = (next.sequences[key] || 0) + 1; if (n > 9999) throw Error('Limite da sequência demonstrativa atingido.'); next.sequences[key] = n; r.number = `0000/${now.slice(0, 4)}-${String(n).padStart(4, '0')}`; }
   r.status = 'Finalizado'; r.version += 1; r.finalizedAt = now;
   r.versions = [...r.versions, { version: r.version, at: now, content: structuredClone(r.content) }] as Report['versions'];
  }
 }
 // Server-like metadata is derived from the saved record, never trusted from a form.
 const fieldEvents: typeof r.audit = [];
 if (cmd.action === 'save' || cmd.action === 'finalize') for (const q of r.pendingQueries || []) {
  if (!['geo', 'history', 'person'].includes(q.scope) || !canEdit(r.status === 'Finalizado' && previous ? previous : r, actor, q.scope) || !Number.isFinite(Date.parse(q.at))) continue;
  fieldEvents.push({ id: uid(), actor: actor.name, role: actor.role, at: q.at, revision: (previous?.revision || 0) + 1, action: 'Consulta demonstrativa', detail: `${q.scope}: ${q.detail}. Evento consolidado ao salvar; sem acesso institucional.` });
 }
 delete r.pendingQueries;
 if (!previous) fieldEvents.push({ id: uid(), actor: actor.name, role: actor.role, at: now, revision: 1, action: 'Criação de relatório', detail: `${r.kind}; rascunho sem numeração institucional.` });
 const eventNames: Record<string, string> = { geo: 'Consulta de dados geoespaciais', history: 'Importação de histórico', provenance: 'Aproveitamento de dados com origem', attachments: 'Anexação, edição ou remoção de arquivos', originator: 'Associação de processo originador' };
 if (cmd.action === 'save' || cmd.action === 'finalize') for (const field of Object.keys(r.content)) {
  const value = (r.content as unknown as Record<string, unknown>)[field], old = (previous?.content as unknown as Record<string, unknown> | undefined)?.[field];
  if (!equalContent(value, old)) fieldEvents.push({ id: uid(), actor: actor.name, role: actor.role, at: field === 'geo' && r.content.geo ? r.content.geo.at : now, revision: (previous?.revision || 0) + 1, action: eventNames[field] || 'Alteração de dados', detail: field === 'geo' ? `Fonte fictícia; cenário ${r.content.geo?.mode}; resultados e indisponibilidades registrados ao salvar.` : `Campo/grupo: ${field}. Conteúdo preservado no registro e nas versões finalizadas.` });
 }
 r.audit = [...(previous?.audit || []), ...fieldEvents, { id: uid(), actor: actor.name, role: actor.role, at: now, revision: (previous?.revision || 0) + 1, action: cmd.action === 'save' ? 'Rascunho/ajustes salvos' : cmd.action === 'return' ? 'Devolução para ajuste' : previous?.number ? 'Reenvio demonstrativo' : 'Finalização demonstrativa', detail: cmd.action === 'return' ? r.returnReason || '' : 'Operação local. Sem encaminhamento ou assinatura institucional.', from: previous?.status, to: r.status }];
 r.revision = (previous?.revision || 0) + 1; r.updatedAt = now;
 next.records = [...next.records.filter(x => x.id !== r.id), r]; return next;
}
export function newInfraction(person: Person): Infraction { return { id: uid(), description: '', annexVI: [], sources: [], articles: [], clauses: {}, other: '', criteria: ['I', 'II', 'VI'], reasons: {}, mitigating: [], aggravating: [], aggravatingVII: [], nature: '', natureFormal: [], severity: '', penalties: [], recipient: structuredClone(person), differentRecipient: false, recipientReason: '' }; }
export function importSelected(target: Report, source: Report, fields: string[], now = new Date().toISOString()) {
 if (target.kind !== source.kind) throw Error('O aproveitamento deve utilizar um relatório do mesmo tipo.');
 const allowed = ['person', 'participants', 'location', 'coordinates', 'description', 'conclusion', 'outcomes', 'infractions', 'notifications', ...(target.kind === 'DOR009' ? ['companies', 'recommendations'] : [])];
 const next = structuredClone(target);
 for (const field of fields) { if (!allowed.includes(field)) throw Error('Campo não elegível para aproveitamento.'); (next.content as unknown as Record<string, unknown>)[field] = structuredClone((source.content as unknown as Record<string, unknown>)[field]); next.content.provenance[field] = { sourceId: source.id, label: `${SHORT[source.kind]} ${source.number || 'rascunho demonstrativo'}`, at: now, reviewed: false }; }
 if (next.kind === 'DOR009') { next.content.participants = next.content.participants.filter(p => !p.responsible || p.userId === next.authorId); if (!next.content.participants.some(p => p.userId === next.authorId && p.responsible)) next.content.participants.unshift({ id: uid(), userId: next.authorId, name: next.authorName, responsible: true, job: 'Técnico responsável', phone: '', email: '' }); }
 // Source documents never replace identity, chronology, authorship, originator or files.
 next.content.notifications.forEach(n => { n.processId = next.content.originator; }); return next;
}
