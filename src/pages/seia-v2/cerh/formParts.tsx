import React, { useId, useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Search, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { GlaCheckbox } from '@/components/gla/primitives/GlaCheckbox';
import { GlaRadioGroup } from '@/components/gla/primitives/GlaRadioGroup';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { Fields, Value } from './types';
import type { FieldSpec } from './fields';
import { list, str, maskValue } from './fields';
export function Notice({ children, error = false }: { children: React.ReactNode; error?: boolean }) {
  return <p role={error ? 'alert' : 'status'} className={error ? 'cerh-message cerh-error' : 'cerh-message'}>{children}</p>;
}
export function ReadValues({ values }: { values: [string, React.ReactNode][] }) {
  return <dl className="cerh-values">{values.map(([label, value], index) => <div key={label + index}><dt>{label}</dt><dd>{value === '' || value === undefined || value === null ? '—' : value}</dd></div>)}</dl>;
}
export function MultiChoice({ label, values, options, onChange, disabled, error, required, optionLabel = v => v }: { label: string; values: string[]; options: string[]; onChange: (v: string[]) => void; disabled?: boolean; error?: string; required?: boolean; optionLabel?: (value: string) => string }) {
  const fieldId = useId(), [search, setSearch] = useState('');
  const fold = (v: string) => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return <div className="cerh-field">
    <span id={fieldId} className="cerh-label">{label}{required && <span className="cerh-required"> *</span>}</span>
    <Popover.Root onOpenChange={() => setSearch('')}>
      <Popover.Trigger asChild><Button type="button" size="md" color="gray" outlined disabled={disabled} aria-labelledby={fieldId} aria-required={required} aria-invalid={!!error} aria-describedby={error ? `${fieldId}-error` : undefined} className="w-full justify-between font-normal"><span className="truncate">{values.length ? values.map(optionLabel).join(', ') : 'Selecione...'}</span><ChevronDown className="h-4 w-4 shrink-0" /></Button></Popover.Trigger>
      <Popover.Portal><Popover.Content sideOffset={5} collisionPadding={16} className="cerh-multi z-[60]" onCloseAutoFocus={() => {}}>
        <InputWrapper prefixIcon={Search}><input aria-label={`Pesquisar ${label}`} value={search} onChange={e => setSearch(e.target.value)} className="cerh-input" /></InputWrapper>
        <div className="cerh-multi-options" role="group" aria-label={label}>{options.filter(o => fold(optionLabel(o)).includes(fold(search))).map(o => <GlaCheckbox key={o} id={`${fieldId}-${options.indexOf(o)}`} label={optionLabel(o)} checked={values.includes(o)} onChange={() => onChange(values.includes(o) ? values.filter(v => v !== o) : [...values, o])} />)}</div>
        {options.every(o => !fold(optionLabel(o)).includes(fold(search))) && <p className="cerh-helper">Nenhum resultado encontrado.</p>}
      </Popover.Content></Popover.Portal>
    </Popover.Root>
    {error && <p id={`${fieldId}-error`} className="cerh-error" role="alert">{error}</p>}
  </div>;
}
export function Field({ spec: f, value, onChange, error, disabled = false, readOnly = false }: { spec: FieldSpec; value: Value; onChange: (v: Value) => void; error?: string; disabled?: boolean; readOnly?: boolean }) {
  const id = useId();
  const label = <span id={`${id}-label`} onClick={() => document.getElementById(id)?.focus()}>{f.label}</span>;
  const described = error || f.hint ? `${id}-hint` : undefined;
  const hint = error ? <span id={`${id}-hint`} role="alert" className="cerh-error">{error}</span> : f.hint ? <span id={`${id}-hint`} className="cerh-helper">{f.hint}</span> : undefined;
  if (f.kind === 'multi') return <MultiChoice label={f.label} values={Array.isArray(value) ? value : []} options={f.options || []} onChange={onChange} disabled={disabled || readOnly} error={error} required={f.required} />;
  if (f.kind === 'radio') return <fieldset className="cerh-field" aria-describedby={described} aria-invalid={!!error}><legend className="cerh-label">{label}{f.required && <span className="cerh-required"> *</span>}</legend><GlaRadioGroup name={id} value={typeof value === 'string' ? value : ''} onChange={onChange} direction="horizontal" options={(f.options || []).map(v => ({ value: v, label: v, disabled: disabled || readOnly }))} />{hint}</fieldset>;
  const scalar = typeof value === 'string' ? value : '';
  const presented = f.mask ? maskValue(scalar, f.mask) : scalar;
  function maskedChange(input: HTMLInputElement, raw: string, digitPosition: number) {
    const next = maskValue(raw, f.mask!);
    onChange(next);
    let caret = 0, digits = 0;
    while (caret < next.length && digits < digitPosition) if (/\d/.test(next[caret++])) digits++;
    requestAnimationFrame(() => { if (document.activeElement === input) input.setSelectionRange(caret, caret); });
  }
  return <InputWrapper label={label} required={f.required} hint={hint} valid={!error} disabled={disabled} suffix={f.unit} className={f.kind === 'select' ? 'border-0 shadow-none overflow-visible bg-transparent' : undefined}>
    {f.kind === 'select' ? <div aria-describedby={described} aria-invalid={!!error}><FilamentSelect id={id} ariaLabel={f.label} name={f.key} required={f.required} value={scalar} options={f.options || []} onChange={onChange} disabled={disabled || readOnly} inlinePopup className="cerh-select" /></div>
      : f.kind === 'textarea' ? <textarea id={id} aria-labelledby={`${id}-label`} aria-describedby={described} aria-invalid={!!error} aria-required={f.required} value={scalar} onChange={e => onChange(e.target.value)} disabled={disabled} readOnly={readOnly} className="cerh-input cerh-textarea" />
      : <input id={id} aria-labelledby={`${id}-label`} aria-describedby={described} aria-invalid={!!error} aria-required={f.required} type={f.kind === 'date' ? 'date' : 'text'} inputMode={f.mask === 'phone' ? 'tel' : f.mask ? 'numeric' : f.kind === 'number' ? 'decimal' : undefined} value={presented} onChange={e => f.mask ? maskedChange(e.currentTarget, e.target.value, e.target.value.slice(0, e.target.selectionStart ?? 0).replace(/\D/g, '').length) : onChange(e.target.value)} onKeyDown={e => {
        if (!f.mask || disabled || readOnly || !['Backspace', 'Delete'].includes(e.key)) return;
        const input = e.currentTarget, caret = input.selectionStart ?? 0;
        if (caret !== input.selectionEnd) return;
        const index = e.key === 'Backspace' ? caret - 1 : caret;
        if (index < 0 || index >= input.value.length || /\d/.test(input.value[index])) return;
        e.preventDefault();
        const digits = input.value.replace(/\D/g, ''), before = input.value.slice(0, caret).replace(/\D/g, '').length;
        const remove = e.key === 'Backspace' ? before - 1 : before;
        if (remove >= 0 && remove < digits.length) maskedChange(input, digits.slice(0, remove) + digits.slice(remove + 1), remove);
      }} disabled={disabled} readOnly={readOnly} className="cerh-input" />}
  </InputWrapper>;
}
export function FieldGrid({ specs, data, onChange, errors = {}, prefix = '', disabled = false }: { specs: FieldSpec[]; data: Fields; onChange: (key: string, value: Value) => void; errors?: Record<string, string>; prefix?: string; disabled?: boolean }) {
  return <div className="cerh-field-grid">{specs.map(f => <Field key={f.key} spec={f} value={data[f.key] ?? ''} onChange={v => onChange(f.key, v)} error={errors[prefix + f.key]} disabled={disabled} />)}</div>;
}
export function Confirm({ title, description, onCancel, onConfirm, destructive = false }: { title: string; description: React.ReactNode; onCancel: () => void; onConfirm: () => void; destructive?: boolean }) {
  const restore = useRef(document.activeElement as HTMLElement | null);
  return <Dialog open onOpenChange={open => { if (!open) onCancel(); }}><DialogContent className="cerh-dialog" onCloseAutoFocus={e => { e.preventDefault(); if (restore.current?.isConnected) restore.current.focus(); }} onOpenAutoFocus={e => { e.preventDefault(); document.getElementById('cerh-confirm-cancel')?.focus(); }}><DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader><DialogDescription asChild><div className="cerh-dialog-body">{description}</div></DialogDescription><DialogFooter><Button id="cerh-confirm-cancel" color="gray" size="sm" onClick={onCancel}>Cancelar</Button><Button color={destructive ? 'danger' : 'primary'} size="sm" onClick={onConfirm}>Confirmar</Button></DialogFooter></DialogContent></Dialog>;
}
// Composition from the DS upload specimen. Session files only; no storage or upload service.
export function PdfUpload({ label, file, onChange, disabled }: { label: string; file?: { name: string; size: number }; onChange: (file?: { name: string; size: number }) => void; disabled?: boolean }) {
  const input = useRef<HTMLInputElement>(null), [error, setError] = useState(''), [drag, setDrag] = useState(false), fileId = useId();
  const select = (files: File[]) => {
    if (!files.length) return;
    if (files.some(f => !/\.pdf$/i.test(f.name) || (f.type && f.type !== 'application/pdf'))) { setError('Selecione um arquivo PDF.'); return; }
    const f = files[0]; sessionFiles.set(fileId, f); onChange({ name: f.name, size: f.size }); setError('');
  };
return <div className="cerh-field"><span className="cerh-label">{label}{!label.includes('opcional') && ' (opcional)'}</span><div className={`cerh-upload ${drag ? 'cerh-upload-drag' : ''}`} onDragOver={e => { if (!disabled) { e.preventDefault(); setDrag(true); } }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); if (!disabled) select(Array.from(e.dataTransfer.files)); }}>
    <input ref={input} type="file" accept="application/pdf,.pdf" disabled={disabled} aria-label={label} className="sr-only" onChange={e => { select(Array.from(e.target.files || [])); e.target.value = ''; }} />
    {file ? <div className="flex flex-wrap items-center justify-between gap-2"><span className="break-all text-xs">{file.name}</span><Button size="icon" color="gray" aria-label={`Remover ${label}`} disabled={disabled} onClick={() => { sessionFiles.delete(fileId); onChange(undefined); }}><X className="h-4 w-4" /></Button></div> : <Button type="button" color="gray" size="sm" disabled={disabled} onClick={() => input.current?.click()}><Upload className="h-4 w-4" />Selecionar PDF</Button>}
    <p className="cerh-helper">Arraste um PDF ou selecione um arquivo do computador.</p>
  </div>{error && <Notice error>{error}</Notice>}</div>;
}
const sessionFiles = new Map<string, File>();
export function fieldsHaveData(data: Fields) { return Object.values(data).some(v => Array.isArray(v) ? v.length > 0 : v !== ''); }
export function droppedValues(previous: Fields, next: Fields, keys: string[]) { return keys.some(key => Array.isArray(previous[key]) ? list(previous, key).length > 0 && !list(next, key).length : str(previous, key) !== '' && str(next, key) === ''); }
