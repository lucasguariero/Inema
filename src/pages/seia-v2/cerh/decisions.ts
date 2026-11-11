// Analyst ACTO decisions, 2026-10-07: one creation entry, one initial stage,
// one visual situation, controlled editing. Labels never grant a capability.
import type { Point } from './types';
export const presentation = {
  directEditLabel: 'Editar',
  requestEditLabel: 'Solicitar edição',
};
export function displayStatus(point: Point) {
  if (point.effectiveStatus) return point.effectiveStatus;
  if (point.lifecycle === 'Rascunho' || point.lifecycle === 'Cancelado') return point.lifecycle;
  if (['Outorgado', 'Inexigível', 'Dispensado', 'Indeferido'].includes(point.processSituation || '')) return point.processSituation!;
  return canonicalClassification(point.classification);
}
export function canonicalClassification(value: string) {
  return value === 'Passível de dispensa' ? 'Passível de dispensa de outorga' : value === 'Passível de inexigibilidade' ? 'Passível de inexigibilidade de outorga' : value === 'Análise técnica necessária' ? 'Necessária análise técnica' : value;
}
