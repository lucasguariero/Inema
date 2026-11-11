import { ACTORS, applyCommand, newInfraction, newReport, uid, emptyPerson } from './domain';
import { EVIDENCE_BASE64 } from './evidenceData';
import type { Attachment, Coordinate, GeoLayer, GeoResult, Person, Report, ReportKind, Repository } from './types';

export const PEOPLE: Person[] = [
 { ...emptyPerson(), name: 'Pessoa Fictícia Um — demonstração', document: '52998224725', address: 'Endereço demonstrativo, s/n', email: 'pessoa.um@example.invalid', phone: '00000000000', cep: '00000000' },
 { ...emptyPerson(), name: 'Empresa Fictícia Modelo — demonstração', document: '11222333000181', address: 'Local ilustrativo, s/n', email: 'empresa@example.invalid', phone: '00000000000', cep: '00000000' },
];
export const PROCESSES = [
 { id: 'PROC-DEMO-001', label: 'PROC-DEMO-001/2026 — Fiscalização (fictício)', autos: ['AUTO-DEMO-01'], notices: ['NOT-DEMO-01'] },
 { id: 'PROC-DEMO-002', label: 'PROC-DEMO-002/2026 — Emergência (fictício)', autos: ['AUTO-DEMO-02'], notices: [] },
 { id: 'PROC-DEMO-003', label: 'PROC-DEMO-003/2026 — Registro relacionado (fictício)', autos: [], notices: ['NOT-DEMO-03'] },
];
export const MUNICIPALITIES = ['Salvador', 'Feira de Santana', 'Barreiras'];
export const HISTORY_FIXTURES = [
 { id: 'HIST-DEMO-01', process: 'PROC-DEMO-001', date: '2026-08-15', type: 'Licença', detail: 'Licença demonstrativa vinculada à identificação e ao município pesquisados. Nenhuma consulta institucional.' },
 { id: 'HIST-DEMO-02', process: 'PROC-DEMO-001', date: '2026-09-01', type: 'Notificação', detail: 'Notificação fictícia com obrigação em acompanhamento local.' },
 { id: 'HIST-DEMO-03', process: 'PROC-DEMO-003', date: '2026-09-20', type: 'Requerimento em aberto', detail: 'Requerimento sintético ainda aberto para a consulta demonstrativa.' },
];
export function searchHistory(document: string, municipality: string, start: string, end: string, mode = 'success') {
 if (!document || !municipality || !start || !end || end < start) throw Error('Informe CPF/CNPJ, município, data inicial e data final em ordem válida.');
 if (mode === 'error') throw Error('A fonte demonstrativa de histórico está indisponível. Tente novamente.');
 return mode === 'empty' || document !== PEOPLE[0].document || municipality !== 'Salvador' ? [] : HISTORY_FIXTURES.filter(x => x.date >= start && x.date <= end);
}
export interface ReuseFilters { document: string; name: string; number: string; process: string; car: string; date: string; municipality: string; uc: string }
export const EMPTY_REUSE_FILTERS: ReuseFilters = { document: '', name: '', number: '', process: '', car: '', date: '', municipality: '', uc: '' };
export function searchReports(reports: Report[], kind: ReportKind, filters: ReuseFilters) {
 const fold = (v: string) => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
 return reports.filter(r => r.kind === kind && [
  [r.content.person.document, filters.document], [r.content.person.name, filters.name], [r.number || '', filters.number], [r.content.originator, filters.process],
  [r.content.geo?.layers.filter(x => x.layer === 'CAR/CEFIR').flatMap(x => x.values.map(v => v.text)).join(' ') || '', filters.car], [r.createdAt.slice(0, 10), filters.date],
  [r.content.location.municipality, filters.municipality], [r.content.geo?.layers.filter(x => x.layer === 'Unidade de Conservação').flatMap(x => x.values.map(v => v.text)).join(' ') || '', filters.uc],
 ].every(([value, filter]) => !filter || fold(value).includes(fold(filter.trim()))));
}
export const coordFingerprint = (c: Coordinate[]) => JSON.stringify(c.map(p => [p.id, p.original, p.format, p.lat, p.lng]));
export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
 const rad = Math.PI / 180, dlat = (b.lat - a.lat) * rad, dlng = (b.lng - a.lng) * rad;
 return 6371000 * 2 * Math.asin(Math.min(1, Math.sqrt(Math.sin(dlat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dlng / 2) ** 2)));
}
export const GEO_LAYERS = ['Município', 'Bacia hidrográfica', 'Recurso hídrico', 'Unidade de Conservação', 'CAR/CEFIR', 'Lei da Mata Atlântica', 'Bioma', 'Reserva legal', 'APP', 'Sede municipal', 'Empreendimentos', 'Licenças', 'Autorizações'];
export function queryGeo(coordinates: Coordinate[], mode: GeoResult['mode'], previous?: GeoResult, now = new Date().toISOString()): GeoResult {
 if (!coordinates.length) throw Error('Informe ao menos uma coordenada válida.');
 const center = { lat: -12.9714, lng: -38.5014 }, layers: GeoLayer[] = [];
 for (const p of coordinates) for (const layer of GEO_LAYERS) {
  const unavailable = mode === 'unavailable' || mode === 'partial' && ['Empreendimentos', 'Licenças', 'Autorizações'].includes(layer);
  const rule = layer === 'Recurso hídrico' ? '500m' : layer === 'Sede municipal' ? 'mais próxima' : 'toca';
  const match = mode !== 'empty' && (rule === 'mais próxima' || Math.abs(p.lat - center.lat) < .03 && Math.abs(p.lng - center.lng) < .03);
  const old = previous?.layers.find(x => x.coordinateId === p.id && x.layer === layer);
  const values: GeoLayer['values'] = [];
  if (!unavailable && match) {
   if (layer === 'Recurso hídrico') {
    // Synthetic features have known metric distances from the entered point.
    for (const distance of [100, 499.9, 500, 500.1]) if (distance <= 500) values.push({ id: `${p.id}-agua-${distance}`, text: `Recurso hídrico fictício — ${distance} m`, distance, selected: false });
   } else {
    const text = layer === 'Município' ? 'Salvador — base sintética' : layer === 'CAR/CEFIR' ? 'CEFIR-DEMO-01 — imóvel rural; assentamento e povos/comunidades tradicionais: Não se aplica' : layer + ' — ocorrência fictícia de demonstração';
    values.push({ id: `${p.id}-${layer}`, text, selected: true, ...(rule === 'mais próxima' ? { distance: Math.round(distanceMeters(p, center)) } : {}) });
   }
  }
  layers.push({ coordinateId: p.id, layer, rule, status: unavailable ? 'unavailable' : match ? 'ok' : 'empty', values: unavailable ? old?.values || [] : values });
 }
 return { at: now, mode, coordinateFingerprint: coordFingerprint(coordinates), layers };
}
export function imageFixture(): Attachment {
 const data = Uint8Array.from(atob(EVIDENCE_BASE64), ch => ch.charCodeAt(0)), blob = new Blob([data], { type: 'image/png' });
 return { id: uid(), name: 'evidencia-sintetica.png', format: 'png', mime: 'image/png', size: blob.size, description: 'Diagrama sintético; não representa ocorrência, pessoa ou local real.', user: ACTORS[0].name, at: '2026-10-20T12:00:00Z', purpose: 'image', blob };
}
export function completeFixture(kind: ReportKind): Report {
 const r = newReport(kind, ACTORS[0], '2026-10-20T12:00:00Z'), c = r.content;
 c.originator = PROCESSES[0].id; c.person = structuredClone(PEOPLE[0]); c.location = { address: 'Local sintético de observação', number: 's/n', municipality: 'Salvador', reference: 'Referência fictícia para avaliação' };
 c.coordinates = [{ id: 'COORD-DEMO-1', original: '-12,9714; -38,5014', format: 'decimal', datum: 'WGS84-demo', lat: -12.9714, lng: -38.5014 }];
 c.geo = queryGeo(c.coordinates, 'success', undefined, '2026-10-20T12:00:00Z');
 c.description = 'Inspeção demonstrativa realizada para conferir o preenchimento do relatório. As informações, evidências e pessoas são fictícias. Foram registradas observações de campo em cenário sintético, sem constatação de infração ou conclusão institucional.';
 c.conclusion = 'Conclui-se o preenchimento demonstrativo. Esta avaliação não constitui parecer oficial e não produz encaminhamento institucional.';
 c.attachments = [imageFixture()];
 if (r.kind === 'DOR008') { r.content.attendance = { id: uid(), start: '2026-10-20T08:00:00-03:00', end: '2026-10-20T10:00:00-03:00' }; c.participants = [{ id: uid(), userId: ACTORS[0].id, name: ACTORS[0].name, job: 'Técnico responsável', phone: '', email: '', responsible: true }]; }
 else { r.content.attendances = [{ id: uid(), start: '2026-10-20T08:00:00-03:00', end: '2026-10-20T10:00:00-03:00' }]; r.content.companies = [{ id: uid(), name: PEOPLE[1].name, document: PEOPLE[1].document, representatives: [{ id: uid(), userId: '', name: 'Representante Fictício — demonstração', job: 'Representante', phone: '', email: 'representante@example.invalid', responsible: false }] }]; r.content.recommendations = 'Recomendação exclusivamente ilustrativa: conferir a documentação e registrar os dados necessários à avaliação do protótipo.'; }
 return r;
}
export function completeInfraction(person: Person) { const n = newInfraction(person); n.description = 'Caracterização textual fictícia para testar os controles; sem enquadramento institucional.'; n.sources = ['estadual']; n.articles = ['254']; n.clauses = { '254': ['I'] }; n.mitigating = ['V']; n.nature = 'material'; n.severity = 'leve'; n.penalties = ['Advertência']; return n; }
export function initialRepository(empty = false): Repository {
 let repo: Repository = { schema: 1, records: [], sequences: {}, deleted: [] };
 if (empty) return repo;
 for (const kind of ['DOR008', 'DOR009'] as const) {
  const r = completeFixture(kind); r.id = kind === 'DOR008' ? 'rfa-modelo' : 'rae-modelo'; repo = applyCommand(repo, ACTORS[0], { action: 'finalize', report: r, expectedRevision: 0 }, '2026-10-20T15:00:00Z');
  const draft = newReport(kind, ACTORS[0], '2026-10-21T12:00:00Z'); draft.id = kind === 'DOR008' ? 'rfa-rascunho' : 'rae-rascunho'; repo = applyCommand(repo, ACTORS[0], { action: 'save', report: draft, expectedRevision: 0 }, '2026-10-21T12:00:00Z');
 }
 return repo;
}
