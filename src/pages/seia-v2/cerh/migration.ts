import type { CerhData, EffectiveStatus } from './types';
import { canonicalClassification } from './decisions';
import { resolvePurpose, purposeLabel } from './administration';
import { preclassify, snapshotRelated } from './rules';

/** A copy is upgraded; persisted revision-1 bytes are backed up by the caller. */
export function migrateCerh(input: CerhData): CerhData {
  if (input.schemaVersion === 2) return input;
  const next = structuredClone(input);
  next.schemaVersion = 2;
  next.notifications ||= [];
  next.submissions ||= [];
  for (const v of next.ventures) {
    v.holderId ||= v.id === 'VENT-03' ? 'PERSON-02' : v.id === 'VENT-REF' ? 'PERSON-03' : 'PERSON-01';
    v.propertyId ||= `PROPERTY-${v.id}`;
    v.savedStages ||= v.draft ? [] : ['user-property', 'venture', 'location', ...(v.water ? ['water'] : [])];
    v.identification.instrumentId ||= v.identification.agreementEnabled === 'Sim' ? v.identification.agreement : undefined;
    v.identification.actorId ||= 'tecnico';
  }
  for (const p of next.points) {
    const v = next.ventures.find(v => v.id === p.ventureId);
    p.holderId ||= v?.holderId; p.propertyId ||= v?.propertyId;
    if (p.type === 'BAR' && typeof p.technical.volume === 'string' && p.technical.volume !== '') p.technical.volume = String(Number(p.technical.volume.replace(',', '.')) * 1000000);
    const oldData = p.purposeData;
    const originalPurposes = [...p.purposes];
    p.purposes = originalPurposes.map(key => resolvePurpose(key)?.id || key);
    p.purposeData = Object.fromEntries(originalPurposes.map((key, n) => [p.purposes[n], oldData[key] || {}]));
    p.purposeLabels ||= Object.fromEntries(p.purposes.map(key => [key, purposeLabel(key)]));
    p.firstSentAt ||= p.lifecycle !== 'Rascunho' ? p.history.find(e => /Conclusão|Envio/.test(e.event))?.date || p.createdAt : undefined;
    p.effectiveStatus = p.lifecycle === 'Rascunho' || p.lifecycle === 'Cancelado' ? p.lifecycle : (['Outorgado', 'Inexigível', 'Dispensado', 'Indeferido'].includes(p.processSituation || '') ? p.processSituation : canonicalClassification(p.classification)) as EffectiveStatus;
    p.certificateNumber ||= p.number ? `${new Date(p.firstSentAt || p.createdAt).getFullYear()}.000.${String(next.points.filter(x => x.number).findIndex(x => x.id === p.id) + 1).padStart(5, '0')}/CERH` : undefined;
    for (const a of p.animals) a.system = a.system === 'Intensivo' ? 'Intensiva' : a.system === 'Extensivo' ? 'Extensiva' : a.system;
  }
  for (const p of next.points) {
    if (p.lifecycle !== 'Rascunho' && p.lifecycle !== 'Cancelado' && !['Outorgado', 'Inexigível', 'Dispensado', 'Indeferido'].includes(p.effectiveStatus!)) p.effectiveStatus = preclassify(next, p);
    if (['SUP', 'SUB', 'BAR'].includes(p.type) && p.number) p.relatedComposition = snapshotRelated(next, p);
  }
  for (const v of next.ventures) v.savedStages = [...new Set([...(v.savedStages||[]),...next.points.filter(p=>p.ventureId===v.id && (p.number || p.history.some(e=>e.event==='Salvamento do rascunho'))).map(p=>p.type)])];
  next.sequence = Math.max(next.sequence, next.points.filter(p => p.number).length + 1);
  return next;
}
