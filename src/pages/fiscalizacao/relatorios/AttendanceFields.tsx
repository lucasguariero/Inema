import { useEffect, useRef, useState } from 'react';
import { Field } from './controls';
import { attendanceInstant, attendanceParts } from './attendanceTime';

export function AttendanceFields({ label, name, value, onChange, disabled, error }: { label: string; name?: string; value: string; onChange: (v: string) => void; disabled: boolean; error?: string }) {
 const [parts, setParts] = useState(() => attendanceParts(value)), emitted = useRef(value);
 useEffect(() => { if (value !== emitted.current) { emitted.current = value; setParts(attendanceParts(value)); } }, [value]);
 const update = (patch: Partial<typeof parts>) => {
  const next = { ...parts, ...patch }; setParts(next);
  const instant = attendanceInstant(next.date, next.time); emitted.current = instant; onChange(instant);
 };
 return <fieldset className="fr-attendance-fields"><legend>{label}</legend><div className="fr-attendance-pair"><Field label="Data" ariaLabel={'Data de ' + label.toLocaleLowerCase('pt-BR')} name={name ? name + '.date' : undefined} type="date" value={parts.date} onChange={date => update({ date })} disabled={disabled} required error={error}/><Field label="Hora" ariaLabel={'Hora de ' + label.toLocaleLowerCase('pt-BR')} name={name ? name + '.time' : undefined} type="time" step={parts.time.includes('.') ? '0.001' : parts.time.length > 5 ? '1' : '60'} value={parts.time} onChange={time => update({ time })} disabled={disabled} required error={error}/></div></fieldset>;
}
