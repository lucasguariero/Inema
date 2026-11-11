import { useEditor, ReportSection } from './controls';
import { ProcessFields, IdentityFields, ParticipantList, LocationFields, CoordinateList, GeoContext, HistoricalLookup, DescriptionFields, ConclusionFields, AttachmentList, NotificationsEditor, Responsibility } from './sharedSections';
import { AttendanceFields } from './AttendanceFields';
import { attendanceParts, attendanceInstant } from './attendanceTime';
import { legend } from './domain';
import { InfractionsEditor } from './InfractionEditor';

export const RFA_SECTIONS = ['Atendimento', 'Identificação', 'Local da inspeção', 'Histórico', 'Descrição da inspeção', 'Conclusão e desdobramentos', 'Infrações', 'Notificações', 'Anexos', 'Responsabilidade técnica'];
export function localDateTime(value: string) { const p = attendanceParts(value); return p.date && p.time ? p.date + 'T' + p.time : ''; }
export function isoDateTime(value: string) { if (/(Z|[+-]\d{2}:\d{2})$/i.test(value)) return Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : ''; const [date, time = ''] = value.split('T'); return attendanceInstant(date, time); }
export function RfaForm() {
 const { report, set, editable, errors } = useEditor(); if (report.kind !== 'DOR008') throw Error('O formulário RFA exige DOR008.');
 const attendance = report.content.attendance;
 return <>
  <ReportSection id="processo" title="Processo originador" field="originator"><ProcessFields /></ReportSection>
  <ReportSection id="sec-1" title="1. Atendimento" field="attendance"><p className="fr-hint">{legend('DOR008', 3)} Um período, sem datas futuras. Horários da Bahia; instantes preservados em UTC.</p><div className="fr-grid fr-attendance-grid"><AttendanceFields key={report.id+'-start'} label="Início do atendimento" name="attendance.start" value={attendance.start} onChange={start => set('attendance', { ...attendance, start })} disabled={!editable('attendance')} error={errors.attendance}/><AttendanceFields key={report.id+'-end'} label="Término do atendimento" name="attendance.end" value={attendance.end} onChange={end => set('attendance', { ...attendance, end })} disabled={!editable('attendance')} error={errors.attendance}/></div></ReportSection>
  <ReportSection id="sec-2" title="2. Identificação" field="person"><IdentityFields /><h3>Participantes da inspeção</h3><ParticipantList /></ReportSection>
  <ReportSection id="sec-3" title="3. Local da inspeção" field="location"><LocationFields /><h3>Coordenadas</h3><CoordinateList /><GeoContext /></ReportSection>
  <ReportSection id="sec-4" title="4. Histórico" field="history"><HistoricalLookup /></ReportSection>
  <ReportSection id="sec-5" title="5. Descrição da inspeção" field="description"><DescriptionFields /></ReportSection>
  <ReportSection id="sec-6" title="6. Conclusão e desdobramentos" field="conclusion"><ConclusionFields /></ReportSection>
  <ReportSection id="sec-7" title="7. Infrações" field="infractions"><InfractionsEditor /></ReportSection>
  <ReportSection id="sec-8" title="8. Notificações" field="notifications"><NotificationsEditor /></ReportSection>
  <ReportSection id="sec-9" title="9. Anexos" field="attachments"><AttachmentList /></ReportSection>
  <ReportSection id="sec-10" title="10. Responsabilidade técnica"><Responsibility /></ReportSection>
 </>;
}
