import React, { createContext, useContext, useId, useRef } from 'react';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Section } from '@/components/filament/Section';
import { Badge } from '@/components/ui/badge';
import { canEdit, legend } from './domain';
import type { Actor, Errors, Person, Report, ReportContent } from './types';

export interface EditorState { report: Report; actor: Actor; errors: Errors; change: React.Dispatch<React.SetStateAction<Report>>; notice: (text: string) => void }
export const EditorContext = createContext<EditorState | null>(null);
export function useEditor() {
 const state = useContext(EditorContext); if (!state) throw Error('Editor de relatório ausente.');
 const set = (key: string, value: unknown) => { state.change(previous => previous.id === state.report.id && canEdit(previous, state.actor, key) ? { ...previous, content: { ...previous.content, [key]: value } } as Report : previous); };
 const recordQuery = (scope: 'geo' | 'history' | 'person', detail: string) => state.change(previous => previous.id === state.report.id && canEdit(previous, state.actor, scope) ? { ...previous, pendingQueries: [...(previous.pendingQueries || []), { at: new Date().toISOString(), scope, detail }] } : previous);
 return { ...state, set, recordQuery, editable: (key: string) => canEdit(state.report, state.actor, key), c: state.report.content };
}
export function Field({ label, value, onChange, required, disabled, error, hint, multiline, type = 'text', maxLength, inputMode, name, step, ariaLabel }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; disabled?: boolean; error?: string; hint?: React.ReactNode; multiline?: boolean; type?: string; maxLength?: number; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; name?: string; step?: string; ariaLabel?: string }) {
 const id = useId(), helpId = id + '-hint', errorId = id + '-error';
 const props = { id, 'aria-label': ariaLabel, value, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value), disabled, 'aria-required': required, 'aria-invalid': !!error, 'aria-describedby': [hint ? helpId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined, maxLength, name, 'data-field': name, className: 'fr-input fi-input' };
 return <div className="fr-field"><label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label><InputWrapper disabled={disabled} valid={!error}>{multiline ? <textarea {...props} rows={4} /> : <input {...props} type={type} inputMode={inputMode} step={step} />}</InputWrapper>{hint && <div className="fr-hint" id={helpId}>{hint}</div>}{error && <p className="fr-error" id={errorId}>{error}</p>}{maxLength && multiline && <span className="fr-hint fr-count">{value.length.toLocaleString('pt-BR')} / {maxLength.toLocaleString('pt-BR')}</span>}</div>;
}
export function SelectField({ label, value, onChange, options, disabled, required, error, hint }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] | string[]; disabled?: boolean; required?: boolean; error?: string; hint?: React.ReactNode }) {
 const id = useId(); return <div className="fr-field" role="group" aria-labelledby={id} aria-describedby={[hint ? id + '-hint' : '', error ? id + '-error' : ''].filter(Boolean).join(' ') || undefined} aria-invalid={!!error}><span id={id} className="fr-label">{label}{required ? ' *' : ''}</span><FilamentSelect value={value} onChange={onChange} options={options} disabled={disabled} required={required} ariaLabel={label} searchable />{hint && <div className="fr-hint" id={id + '-hint'}>{hint}</div>}{error && <p role="alert" className="fr-error" id={id + '-error'}>{error}</p>}</div>;
}
export function Choices({ title, values, options, onChange, disabled, locked = [] }: { title: string; values: string[]; options: { id: string; text: string }[]; onChange: (v: string[]) => void; disabled?: boolean; locked?: string[] }) {
 return <fieldset className="fr-choices"><legend>{title}</legend>{options.map(o => <label key={o.id}><input type="checkbox" checked={values.includes(o.id)} disabled={disabled || locked.includes(o.id)} onChange={e => onChange(e.target.checked ? [...values, o.id] : values.filter(x => x !== o.id))} /><span>{o.text}{locked.includes(o.id) && <small className="fr-hint"> — obrigatório e bloqueado</small>}</span></label>)}</fieldset>;
}
export function Modal({ title, children, onClose, footer, wide = false }: { title: string; children: React.ReactNode; onClose: () => void; footer?: React.ReactNode; wide?: boolean }) {
 const opener = useRef<HTMLElement | null>(null);
 return <Dialog open onOpenChange={v => { if (!v) onClose(); }}><DialogContent className={'fr-dialog ' + (wide ? 'fr-dialog-wide' : '')} onOpenAutoFocus={() => { opener.current = document.activeElement as HTMLElement; }} onCloseAutoFocus={e => { if (document.activeElement?.id === 'report-notice') { e.preventDefault(); return; } if (opener.current?.isConnected) { e.preventDefault(); opener.current.focus(); } }} onInteractOutside={e => e.preventDefault()}><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Operação demonstrativa local. Nenhum dado será enviado a serviços institucionais.</DialogDescription></DialogHeader><div className="fr-dialog-body">{children}</div><DialogFooter>{footer || <Button color="gray" onClick={onClose}>Fechar</Button>}</DialogFooter></DialogContent></Dialog>;
}
export function Confirm({ title, text, onCancel, onConfirm, danger = false }: { title: string; text: string; onCancel: () => void; onConfirm: () => void; danger?: boolean }) { return <Modal title={title} onClose={onCancel} footer={<><Button color="gray" onClick={onCancel}>Cancelar</Button><Button color={danger ? 'danger' : 'primary'} onClick={onConfirm}>Confirmar</Button></>}><p>{text}</p></Modal>; }
export function ReportSection({ id, title, field, children, description }: { id: string; title: string; field?: keyof ReportContent | string; children: React.ReactNode; description?: string }) {
 const { c, report, errors } = useEditor();
 const grouped = id === 'sec-2' ? ['participants', ...(report.kind === 'DOR009' ? ['companies'] : [])] : id === 'sec-3' ? ['coordinates'] : id === (report.kind === 'DOR008' ? 'sec-6' : 'sec-7') ? ['outcomes'] : [];
 const origins = [...new Set([...(field ? [field] : []), ...grouped])].filter(key => c.provenance[key]).map(key => ({ key, origin: c.provenance[key] }));
 const names: Record<string, string> = { person:'Identificação', participants:'Participantes', companies:'Empresas e representantes', coordinates:'Coordenadas', location:'Local', outcomes:'Desdobramentos', description:'Descrição', conclusion:'Conclusão', history:'Histórico', infractions:'Infrações', notifications:'Notificações', recommendations:'Recomendações' };
 return <section id={id} className="fr-section-anchor" data-section={id} data-dor={report.kind}><Section title={title} description={description} compact headerActions={origins.length ? <Badge>Importado</Badge> : undefined}>{origins.map(({key,origin}) => <p className="fr-import" key={key}>{names[key] || key} — origem: {origin.label}. {legend(report.kind, report.kind === 'DOR008' ? 14 : 18)}</p>)}{field && errors[field] && <p className="fr-error">{errors[field]}</p>}{children}</Section></section>;
}
export function PersonFields({ person, onChange, disabled, prefix = 'person', required = false }: { person: Person; onChange: (v: Person) => void; disabled: boolean; prefix?: string; required?: boolean }) {
 const { errors, report } = useEditor();
 return <div className="fr-grid">{([['name', 'Nome/Razão social'], ['document', 'CPF/CNPJ'], ['address', 'Endereço'], ['complement', 'Complemento'], ['cep', 'CEP'], ['email', 'E-mail'], ['phone', 'Telefone']] as const).map(([key, label]) => <Field key={key} name={prefix + '.' + key} label={label} value={person[key]} onChange={v => onChange({ ...person, [key]: ['document', 'cep', 'phone'].includes(key) ? v.replace(/\D/g, '') : v })} disabled={disabled} required={required && ['name', 'document', 'address'].includes(key)} error={errors[prefix + '.' + key]} type={key === 'email' ? 'email' : 'text'} hint={key === 'document' ? legend(report.kind, 4) : undefined} />)}</div>;
}
