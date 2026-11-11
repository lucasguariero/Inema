import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Plus, Save, Trash2 } from 'lucide-react';
import { FilamentWizard } from '@/components/filament/Wizard';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GlaTable, GlaTableBody, GlaTableContainer, GlaTableHead, GlaTh, GlaTd, GlaTableRow } from '@/components/common/GlaTable';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';
import {
  activeFields,
  CoindDefinition,
  FceData,
  FceField,
  FcePhase,
  FceValue,
  isFieldRequired,
  stepErrors,
  visibleField,
  visibleSection,
  visibleStep,
} from './coindFces';
import './coind-fces.css';

const inputClass = 'w-full min-w-0 border-0 bg-transparent px-3 py-2 text-sm text-[var(--color-text-primary)] focus:ring-0';
const hasOther = (value: FceValue | undefined) =>
  (Array.isArray(value) ? value : [value]).some(v => typeof v === 'string' && /^(outro|outra)/i.test(v));

const displayValue = (field: FceField, data: FceData, phase?: FcePhase): string => {
  if (field.type === 'pending') return 'Pendente de integração';
  if (field.type === 'computed') return field.compute ? field.compute(data, phase) : 'Não calculado';
  const value = data[field.key];
  if (field.type === 'table') return `${Array.isArray(value) ? value.length : 0} registro(s)`;
  if (Array.isArray(value)) return (value as string[]).join(', ') || 'Não informado';
  return (value?.trim() || 'Não informado') + (value?.trim() && field.unit ? ` ${field.unit}` : '');
};

function Field({
  field,
  data,
  onChange,
  error,
  prefix = '',
  phase,
}: {
  field: FceField;
  data: FceData;
  onChange: (key: string, value: FceValue) => void;
  error?: string;
  prefix?: string;
  phase?: FcePhase;
}) {
  const id = `coind-${prefix}${field.key}`;
  const value = data[field.key] || '';
  const description = [field.hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  const isReq = isFieldRequired(field, data, phase);
  let control: React.ReactNode;

  if (field.type === 'pending') {
    control = <p id={id} className="coind-pending">Pendente de integração</p>;
  } else if (field.type === 'computed') {
    control = (
      <p id={id} className="coind-output" aria-describedby={description}>
        {field.compute ? field.compute(data, phase) : 'Não calculado'}
      </p>
    );
  } else if (field.type === 'radio' || field.type === 'checks') {
    control = (
      <div
        className="coind-options"
        role={field.type === 'radio' ? 'radiogroup' : 'group'}
        aria-labelledby={`${id}-label`}
        aria-describedby={description}
        aria-required={isReq || undefined}
      >
        {field.options?.map(option => (
          <label className="coind-option" key={option}>
            <input
              type={field.type === 'radio' ? 'radio' : 'checkbox'}
              name={id}
              value={option}
              checked={field.type === 'radio' ? value === option : Array.isArray(value) && (value as string[]).includes(option)}
              onChange={e =>
                onChange(
                  field.key,
                  field.type === 'radio'
                    ? option
                    : e.target.checked
                    ? [...((Array.isArray(value) ? value : []) as string[]), option]
                    : ((Array.isArray(value) ? value : []) as string[]).filter(v => v !== option)
                )
              }
              aria-invalid={!!error}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    );
  } else if (field.type === 'table') {
    const rows = (Array.isArray(value) ? value : []) as Record<string, string>[];

    const addRow = () => {
      const initialRow = Object.fromEntries((field.columns || []).map(c => [c.key, '']));
      onChange(field.key, [...rows, initialRow]);
    };

    const updateRow = (rowIndex: number, columnKey: string, cellValue: string) => {
      const updatedRows = rows.map((r, n) => (n === rowIndex ? { ...r, [columnKey]: cellValue } : r));
      onChange(field.key, updatedRows);
    };

    control = (
      <div className="coind-table-field">
        <GlaTableContainer
          heading={field.label}
          actions={
            <Button type="button" variant="outline" onClick={addRow}>
              <Plus className="size-4" />
              Adicionar registro
            </Button>
          }
        >
          <div className="coind-table-scroll" role="region" aria-label={field.label} tabIndex={0}>
            <GlaTable>
              <GlaTableHead>
                <tr>
                  {field.columns?.map(c => (
                    <GlaTh key={c.key}>
                      {c.label}
                      {c.unit ? ` (${c.unit})` : ''}
                    </GlaTh>
                  ))}
                  <GlaTh>Ações</GlaTh>
                </tr>
              </GlaTableHead>
              <GlaTableBody>
                {!rows.length ? (
                  <GlaTableRow>
                    <GlaTd colSpan={(field.columns?.length || 0) + 1}>Nenhum registro adicionado.</GlaTd>
                  </GlaTableRow>
                ) : (
                  rows.map((row, i) => (
                    <GlaTableRow key={i}>
                      {field.columns?.map(column => (
                        <GlaTd key={column.key}>
                          <Field
                            field={{ ...column, label: `${column.label} — registro ${i + 1}` }}
                            data={row}
                            prefix={`${field.key}-${i}-`}
                            onChange={(colKey, v) => updateRow(i, colKey, String(v))}
                            phase={phase}
                          />
                        </GlaTd>
                      ))}
                      <GlaTd>
                        <Button
                          type="button"
                          variant="outline"
                          aria-label={`Remover registro ${i + 1} de ${field.label}`}
                          onClick={() => onChange(field.key, rows.filter((_, n) => n !== i))}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </GlaTd>
                    </GlaTableRow>
                  ))
                )}
              </GlaTableBody>
            </GlaTable>
          </div>
        </GlaTableContainer>
      </div>
    );
  } else {
    control = (
      <InputWrapper valid={!error} suffix={field.unit} suffixIcon={field.type === 'select' ? ChevronDown : undefined}>
        {field.type === 'select' ? (
          <select
            id={id}
            name={field.key}
            value={String(value)}
            className={inputClass}
            aria-required={isReq}
            aria-invalid={!!error}
            aria-describedby={description}
            onChange={e => onChange(field.key, e.target.value)}
          >
            <option value="">Selecione...</option>
            {field.options?.map(o => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            id={id}
            name={field.key}
            value={String(value)}
            className={inputClass}
            aria-required={isReq}
            aria-invalid={!!error}
            aria-describedby={description}
            onChange={e => onChange(field.key, e.target.value)}
          />
        ) : (
          <input
            id={id}
            name={field.key}
            type="text"
            inputMode={field.type === 'integer' ? 'numeric' : field.type === 'number' ? 'decimal' : 'text'}
            value={String(value)}
            className={inputClass}
            aria-required={isReq}
            aria-invalid={!!error}
            aria-describedby={description}
            onChange={e => onChange(field.key, e.target.value)}
          />
        )}
      </InputWrapper>
    );
  }

  return (
    <div className={`coind-field ${['table', 'textarea', 'radio', 'checks'].includes(field.type || '') ? 'coind-field-wide' : ''}`} data-field={field.key}>
      {field.type !== 'table' &&
        (['radio', 'checks', 'pending', 'computed'].includes(field.type || '') ? (
          <span id={`${id}-label`} className="coind-label">
            {field.label}
            {isReq && <span aria-hidden="true"> *</span>}
          </span>
        ) : (
          <label className="coind-label" htmlFor={id}>
            {field.label}
            {isReq && <span aria-hidden="true"> *</span>}
          </label>
        ))}
      {control}
      {field.hint && (
        <p id={`${id}-hint`} className="coind-hint">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="coind-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function CoindFcePage({
  definition,
  onNavigate,
  nested = false,
}: {
  definition: CoindDefinition;
  onNavigate: (route: string) => void;
  nested?: boolean;
}) {
  const [phase, setPhase] = useState<FcePhase>(definition.defaultPhase);
  const [data, setData] = useState<FceData>({});
  const [step, setStep] = useState(1);
  const [checked, setChecked] = useState<number[]>([]);
  const [notice, setNotice] = useState('');
  const [saved, setSaved] = useState('{}');
  const [exit, setExit] = useState(false);
  const [complete, setComplete] = useState(false);

  const heading = useRef<HTMLHeadingElement>(null);
  const wizard = useRef<HTMLDivElement>(null);

  const steps = definition.steps.filter(s => visibleStep(s, phase));
  const current = steps[Math.min(step, steps.length) - 1];
  const last = step === steps.length;
  const errors = last
    ? Object.assign({}, ...steps.map(s => stepErrors(s, data, phase)))
    : stepErrors(current, data, phase);
  const dirty = JSON.stringify(data) !== saved;
  const storageKey = `inema-coind-${definition.kind}-${phase}-v1`;

  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', listener);
    return () => window.removeEventListener('beforeunload', listener);
  }, [dirty]);

  useEffect(() => {
    const active = wizard.current?.querySelectorAll('li')[step - 1];
    if (active && wizard.current) {
      const list = active.parentElement;
      if (list) list.scrollLeft = Math.max(0, (active as HTMLElement).offsetLeft - list.offsetLeft);
    }
  }, [step]);

  function update(key: string, value: FceValue) {
    setData(d => ({ ...d, [key]: value }));
    setComplete(false);
    setNotice('');
  }

  function go(next: number) {
    setStep(next);
    setNotice('');
    requestAnimationFrame(() => heading.current?.focus());
  }

  function validate() {
    setChecked(c => [...new Set([...c, step])]);
    if (Object.keys(errors).length) {
      setNotice(last ? 'Revise os campos indicados antes de concluir a demonstração.' : 'Revise os campos indicados antes de avançar.');
      requestAnimationFrame(() => document.querySelector<HTMLElement>('.coind-fce [aria-invalid="true"]')?.focus());
      return false;
    }
    return true;
  }

  function saveDraft() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, kind: definition.kind, phase, data, step }));
      setSaved(JSON.stringify(data));
      setNotice('Rascunho salvo somente neste navegador. Nenhum dado foi enviado ao INEMA.');
    } catch {
      setNotice('Não foi possível salvar neste navegador. Os dados permanecem nesta sessão.');
    }
  }

  function restoreDraft() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        setNotice('Não há rascunho local salvo para este FCE nesta fase.');
        return;
      }
      const draft = JSON.parse(raw);
      if (draft && typeof draft === 'object' && draft.data) {
        setData(draft.data as FceData);
        setSaved(JSON.stringify(draft.data));
        setChecked([]);
        setComplete(false);
        setNotice('Rascunho local recuperado. Revise os dados antes de continuar.');
      }
    } catch {
      setNotice('O rascunho não pôde ser recuperado. Os dados atuais foram preservados.');
    }
  }

  function returnToOrigin() {
    if (window.history.state?.coindOrigin) window.history.back();
    else onNavigate(nested ? 'inicio' : 'relatorios');
  }

  const requestBack = () => (dirty ? setExit(true) : returnToOrigin());

  return (
    <div className="coind-fce" data-fce={definition.kind}>
      {nested && <SeiaV2Breadcrumb items={[{ label: 'Início', route: 'inicio' }, { label: definition.title }]} onNavigate={() => requestBack()} />}
      <header className="coind-heading">
        <Button type="button" variant="ghost" className="coind-back" aria-label="Voltar ao portal" onClick={requestBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 ref={heading} tabIndex={-1}>
            {definition.title}
          </h1>
          <p>Coordenação de Indústria e Mineração (COIND) — Protótipo de Alta Fidelidade.</p>
        </div>
      </header>

      <div className="coind-phase-bar">
        <div className="coind-phase-selector">
          <label htmlFor="coind-phase-select">Fase / Tipo de Licença:</label>
          <select
            id="coind-phase-select"
            value={phase}
            onChange={e => {
              const nextPhase = e.target.value as FcePhase;
              const nextCount = definition.steps.filter(s => visibleStep(s, nextPhase)).length;
              setPhase(nextPhase);
              setStep(s => Math.min(s, Math.max(1, nextCount)));
              setChecked([]);
              setNotice(`Fase alterada para ${nextPhase}. O formulário reajustou etapas, seções e regras condicionais.`);
            }}
          >
            {definition.availablePhases.map(p => (
              <option key={p} value={p}>
                {p === 'AA'
                  ? 'AA — Autorização Ambiental'
                  : p === 'LP'
                  ? 'LP — Licença Prévia'
                  : p === 'LI'
                  ? 'LI — Licença de Instalação'
                  : p === 'LU'
                  ? 'LU — Licença de Unificação'
                  : p === 'LA'
                  ? 'LA — Licença de Alteração'
                  : p === 'LO'
                  ? 'LO — Licença de Operação'
                  : 'Renovação de Licença'}
              </option>
            ))}
          </select>
        </div>
        <span className="coind-phase-badge">Cenário demonstrativo ativo: {phase}</span>
      </div>

      <p className="coind-context">
        Demonstração local COIND (INEM-19). As seções e validações reagem dinamicamente à fase selecionada (LP, LI, LU, LA, LO, AA). O enquadramento formal e o upload de arquivos são delegados aos serviços institucionais ATEND. Não há envio oficial ou emissão de protocolo.
      </p>

      <div className="coind-draft-actions">
        <span>Dados preservados ao navegar entre as etapas.</span>
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            if (dirty) {
              if (!window.confirm('Recuperar o rascunho salvo e substituir os dados ainda não salvos desta sessão?')) return;
            }
            restoreDraft();
          }}
        >
          Retomar rascunho local
        </Button>
      </div>

      <div ref={wizard} className="coind-wizard">
        <FilamentWizard
          currentStep={step}
          steps={steps.map((s, i) => ({
            id: i + 1,
            label: s.title,
            isCompleted: checked.includes(i + 1) && !Object.keys(stepErrors(s, data, phase)).length && i < steps.length - 1,
          }))}
          onStepClick={go}
        />
      </div>

      <main>
        <p className="coind-stage" aria-live="polite">
          Etapa {step} de {steps.length} — {current.title}
        </p>

        {notice && (
          <p className="coind-notice" role="status">
            {notice}
          </p>
        )}

        {!last ? (
          <div className="coind-sections">
            {current.sections
              .filter(s => visibleSection(s, phase, data))
              .map(section => (
                <Section key={section.title} heading={section.title} description={section.note}>
                  <div className="coind-grid">
                    {activeFields(section, data, phase).map(field => (
                      <React.Fragment key={field.key}>
                        <Field field={field} data={data} onChange={update} error={checked.includes(step) ? errors[field.key] : undefined} phase={phase} />
                        {hasOther(data[field.key]) && field.options?.some(o => /^(outro|outra)/i.test(o)) && (
                          <Field
                            field={{
                              key: field.key + 'Descricao',
                              label: `Descreva a outra opção — ${field.label}`,
                              required: true,
                              type: 'textarea',
                            }}
                            data={data}
                            onChange={update}
                            error={checked.includes(step) ? errors[field.key + 'Descricao'] : undefined}
                            phase={phase}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {!!section.documents?.length && (
                    <div className="coind-documents">
                      <h4>Referências documentais institucionais</h4>
                      <ul>
                        {section.documents.map(doc => (
                          <li key={doc}>{doc}</li>
                        ))}
                      </ul>
                      <p>Os arquivos devem ser anexados na aba Documentos Obrigatórios (ATEND). Esta demonstração local não realiza upload nem valida anexos.</p>
                    </div>
                  )}
                </Section>
              ))}
          </div>
        ) : (
          <div className="coind-sections">
            <Section heading="Revisão das informações declaradas" description="Confira os dados preenchidos no formulário da COIND antes de concluir a demonstração.">
              {complete && (
                <p className="coind-notice" role="status">
                  Demonstração COIND concluída com sucesso. Nenhum dado foi submetido a servidores oficiais.
                </p>
              )}
              <p className="coind-review-count">
                {Object.keys(errors).length} campo(s) local(is) pendente(s). Documentos, catálogos e certidões permanecem sujeitos à integração institucional.
              </p>
            </Section>

            {steps.slice(0, -1).map((stage, i) => (
              <Section
                key={stage.title}
                heading={stage.title}
                headerActions={
                  <Button type="button" variant="outline" onClick={() => go(i + 1)}>
                    Revisar etapa {i + 1}
                  </Button>
                }
              >
                {stage.sections
                  .filter(s => visibleSection(s, phase, data))
                  .map(section => (
                    <div className="coind-review-section" key={section.title}>
                      <h4>{section.title}</h4>
                      <dl>
                        {activeFields(section, data, phase).map(f => (
                          <React.Fragment key={f.key}>
                            <dt>{f.label}</dt>
                            <dd data-review={f.key}>
                              {displayValue(f, data, phase)}
                              {hasOther(data[f.key]) && data[f.key + 'Descricao'] ? ` — ${data[f.key + 'Descricao']}` : ''}
                              {f.type === 'table' &&
                                ((data[f.key] as Record<string, string>[]) || []).map((r, index) => (
                                  <ul key={index}>
                                    {f.columns?.map(c => (
                                      <li key={c.key}>
                                        {c.label}: {r[c.key] || 'Não informado'}
                                        {c.unit ? ` ${c.unit}` : ''}
                                      </li>
                                    ))}
                                  </ul>
                                ))}
                              {errors[f.key] && <span className="coind-error">{errors[f.key]}</span>}
                            </dd>
                          </React.Fragment>
                        ))}
                      </dl>
                      {!!section.documents?.length && <p className="coind-hint">Referências documentais: {section.documents.join('; ')}.</p>}
                    </div>
                  ))}
              </Section>
            ))}
          </div>
        )}

        <footer className="coind-footer">
          <Button type="button" variant="outline" onClick={() => (step > 1 ? go(step - 1) : requestBack())}>
            <ArrowLeft className="size-4" />
            {step > 1 ? 'Anterior' : 'Voltar'}
          </Button>
          <div>
            <Button type="button" variant="outline" onClick={saveDraft}>
              <Save className="size-4" />
              Salvar rascunho local
            </Button>
            {last ? (
              <Button
                type="button"
                onClick={() => {
                  if (validate()) setComplete(true);
                }}
              >
                Concluir demonstração
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  if (validate()) go(step + 1);
                }}
              >
                Próxima
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </footer>
      </main>

      <Dialog open={exit} onOpenChange={setExit}>
        <DialogContent className="coind-dialog">
          <DialogHeader>
            <DialogTitle>Sair sem salvar as alterações?</DialogTitle>
            <DialogDescription>
              Existem dados ainda não salvos neste navegador. Você pode voltar ao preenchimento ou sair sem atualizar o rascunho local.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExit(false)}>
              Continuar preenchendo
            </Button>
            <Button
              color="danger"
              onClick={() => {
                setExit(false);
                returnToOrigin();
              }}
            >
              Sair sem salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
