export const ATTENDANCE_ZONE = 'America/Bahia';

export function attendanceParts(value: string) {
 if (!value || !/(Z|[+-]\d{2}:\d{2})$/i.test(value)) return { date: '', time: '' };
 const instant = new Date(value);
 if (!Number.isFinite(instant.getTime())) return { date: '', time: '' };
 const parts = new Intl.DateTimeFormat('en-CA', { timeZone: ATTENDANCE_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(instant);
 const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
 const seconds = instant.getUTCSeconds(), ms = instant.getUTCMilliseconds();
 return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}${seconds || ms ? ':' + p.second : ''}${ms ? '.' + String(ms).padStart(3, '0') : ''}` };
}

export function attendanceInstant(date: string, time: string) {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?$/.test(time)) return '';
 const wall = Date.parse(`${date}T${time}Z`);
 if (!Number.isFinite(wall) || new Date(wall).toISOString().slice(0, 10) !== date) return '';
 let guess = wall;
 for (let i = 0; i < 3; i++) {
  const rendered = attendanceParts(new Date(guess).toISOString());
  const difference = wall - Date.parse(`${rendered.date}T${rendered.time}Z`);
  if (!difference) return new Date(guess).toISOString();
  guess += difference;
 }
 return '';
}

export function attendanceDisplay(value: string) {
 if (!value || !Number.isFinite(Date.parse(value))) return 'Não informado';
 return new Intl.DateTimeFormat('pt-BR', { timeZone: ATTENDANCE_ZONE, dateStyle: 'short', timeStyle: 'short', hourCycle: 'h23' }).format(new Date(value));
}
