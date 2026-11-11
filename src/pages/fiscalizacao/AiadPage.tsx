import { SeiaV2PageHeader } from '@/components/seia-v2/SeiaV2PageHeader';
import { CRITERIOS_250, CRITERIOS_251, PENALIDADES } from '@/lib/aiadNormas';
import { useRef, useState, type ReactNode } from 'react';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect, type SelectOption } from '@/components/filament/Select';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { GlaTable, GlaTableHead, GlaTh, GlaTableBody, GlaTableRow, GlaTd } from '@/components/common/GlaTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlaNotification } from '@/components/gla/feedback/GlaNotification';
import { History, Plus, Upload, Eye, Download, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PROCESSES, SCENARIOS, createAiad, scenarioAiad } from '@/data/aiadMock';
import {
  getInfractions, newInfraction,
  AIAD_TITLE,
  FUNDAMENTO,
  MSG,
  LEG,
  LEGACY_NOTICE,
  STATUS,
  statusLabel,
  ROLES,
  USERS,
  SOURCES,
  ARTICLES,
  CLAUSES,
  today,
  maskDocument,
  digits,
  editable,
  fieldErrors,
  can,
  execute,
  addAudit,
  composedText,
  fileAllowed,
  MOCK_FILE_POLICY,
  updateField,
  updateCoordsList,
  diligenceAnswered,
  validatedEmail,
  type Aiad,
  type Role,
  type Fields,
  type Action,
  type Command,
  type CoordinatePair,
  formatAiadDisplayNumber,
  formatAiadDisplayProcess
} from '@/lib/aiad';
import { ESTADUAL_ARTIGOS, FEDERAL_NOTICE } from '@/lib/aiadNormas';
import { downloadAiadPdf } from '@/lib/aiadPdf';
import { documentoValido } from '@/lib/pautaGestor';
import { AiadCoordinates } from './AiadCoordinates';
import { AiadPreviewModal } from './AiadPreviewModal';
import { PERSISTENT_ACTIONS, loadAiad, readRepository, executeAndPersist, responsibleLabel } from '@/lib/aiadStorage';
import './aiad.css';

function auditDescription(detail: string) {
  try {
    const data = JSON.parse(detail);
    return [
      data.reason,
      data.recipient && `Destinatário: ${data.recipient}`,
      data.number && `Auto: ${data.number}`,
      data.relatedProcess && `Processo do auto: ${data.relatedProcess}`,
      data.changes && Object.keys(data.changes).length ? 'Dados do auto salvos.' : '',
      data.confirmAdjustments ? 'Atendimento dos ajustes confirmado.' : '',
      data.confirmAnalysis ? 'Atendimento da solicitação confirmado.' : '',
      data.authorizeCorrection ? 'Ajuste do auto autorizado.' : '',
      data.attachment && `Documento: ${data.attachment}`
    ]
      .filter(Boolean)
      .join(' · ') || 'Operação registrada.';
  } catch {
    return detail || '—';
  }
}

const actorLabel = (value: string) => ROLES[value as Role] || value;
const eventStatus = (value: string | undefined) => (value === 'rascunho' ? 'Rascunho' : STATUS[value as keyof typeof STATUS] || value);

function ReadonlyCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-3 flex flex-col justify-between">
      <div>
        <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</span>
        <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{value}</p>
      </div>
      {hint && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5">{hint}</p>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly = false,
  required = false,
  hint,
  error,
  type = 'text',
  maxLength,
  multiline = false
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  required?: boolean;
  hint?: string;
  error?: string;
  type?: string;
  maxLength?: number;
  multiline?: boolean;
}) {
  const props = {
    className: 'aiad-input',
    value,
    readOnly,
    disabled: readOnly,
    'aria-label': label,
    'aria-invalid': !!error,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(e.target.value),
    maxLength
  };
  return (
    <div>
      <InputWrapper label={label} required={required} hint={hint} valid={!error} disabled={readOnly}>
        {multiline ? <textarea {...props} className="aiad-input aiad-textarea" /> : <input {...props} type={type} max={type === 'date' ? today() : undefined} />}
      </InputWrapper>
      {error && <p role="alert" className="aiad-error">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  disabled = false,
  hint,
  required = false
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
  disabled?: boolean;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <label className="aiad-label">
        {label}
        {required && ' *'}
      </label>
      <FilamentSelect
        ariaLabel={label}
        value={value}
        options={options}
        onChange={onChange}
        disabled={disabled}
        className="aiad-select"
      />
      {hint && <p className="aiad-helper mt-1">{hint}</p>}
    </div>
  );
}

export function AiadPage({ onNavigate }: { onNavigate?: (route: string) => void }) {
  const params = new URLSearchParams(window.location.search),
    initialScenario = params.get('aiad-cenario') || '';

  const [initial] = useState(() => {
    try {
      return {
        auto: initialScenario && SCENARIOS.some(s => s.value === initialScenario) ? scenarioAiad(initialScenario) : loadAiad(localStorage),
        error: ''
      };
    } catch (e) {
      return { auto: null, error: e instanceof Error ? e.message : MSG[14] };
    }
  });

  const [auto, setAuto] = useState<Aiad | null>(initial.auto);
  const saved = useRef<Aiad | null>(initial.auto ? structuredClone(initial.auto) : null);
  const [savedId, setSavedId] = useState('');
  let savedRecords: Aiad[] = [];
  try {
    savedRecords = Object.values(readRepository(localStorage).records);
  } catch {
    /* Safe fallback */
  }

  const [scenario, setScenario] = useState(initialScenario || 'tecnico');
  const [role, setRole] = useState<Role>(SCENARIOS.find(s => s.value === initialScenario)?.role || 'tecnico');
  const [process, setProcess] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [modal, setModal] = useState<Action | 'history' | 'scenario' | 'cancel' | 'preview' | 'expedir' | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [recipient, setRecipient] = useState('');
  const [kind, setKind] = useState('Anexo');
  const [file, setFile] = useState<File | null>(null);
  const [attachmentId, setAttachmentId] = useState('');
  const [busy, setBusy] = useState(false);
  const [versionView, setVersionView] = useState('current');
  const [confirmed, setConfirmed] = useState(false);
  const [authorizeCorrection, setAuthorizeCorrection] = useState(false);

  const lock = useRef(false);
  const trigger = useRef<HTMLElement | null>(null);
  const unauthorized = params.get('aiad-acesso') === 'negado';
  const write = auto ? editable(auto, role) && !busy : false;

  const flash = (message: string) => {
    setError('');
    setNotice(message);
  };

  const open = (v: typeof modal) => {
    trigger.current = document.activeElement as HTMLElement;
    setReason('');
    setConfirmed(false);
    setAuthorizeCorrection(false);
    setRecipient('');
    setFile(null);
    setError('');
    setModal(v);
  };

  const setField = (key: keyof Fields, value: Fields[keyof Fields]) => {
    if (!auto || !write) return;
    const next = updateField(auto, key, value);
    if (key === 'document') {
      if (documentoValido(String(value)) && digits(String(value)).length === 14 && digits(String(value)) !== '11222333000181') {
        setNotice(MSG[22]);
      }
    }
    setAuto(next);
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const consult = () => {
    if (!auto || !write) return;
    if (!documentoValido(auto.fields.document)) {
      setErrors(e => ({ ...e, document: MSG[2] }));
      setError(MSG[2]);
      return;
    }
    setErrors(e => ({ ...e, document: '' }));
    if (digits(auto.fields.document) === '11222333000181') {
      const next = structuredClone(auto);
      const source = createAiad(auto.process).fields;
      for (const key of ['name', 'enterprise', 'address', 'cep', 'city', 'uf', 'email', 'phone'] as const) {
        next.fields[key] = source[key];
      }
      next.emailValidated = false;
      addAudit(next, role, 'Consulta da pessoa autuada', 'Dados recuperados da fonte mock RFA/registro');
      setAuto(next);
      flash('Consulta demonstrativa concluída com sucesso. Dados recuperados de RFA.');
    } else {
      flash(digits(auto.fields.document).length === 14 ? MSG[22] : 'Nenhum dado disponível na fonte demonstrativa. Complete a identificação manualmente.');
    }
  };

  const switchScenario = () => {
    const next = scenarioAiad(scenario);
    saved.current = structuredClone(next);
    setAuto(next);
    setRole(SCENARIOS.find(s => s.value === scenario)!.role);
    setErrors({});
    setNotice('');
    setModal(null);
  };

  const command = async (cmd: Command) => {
    if (!auto || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      if (unauthorized) throw new Error(MSG[13]);
      const fail = params.get('aiad-falha');
      const request = {
        ...cmd,
        fail:
          (fail === 'salvar' && ['save', 'form'].includes(cmd.action)) ||
          (fail === 'assinar' && cmd.action === 'sign') ||
          (fail === 'tramitar' && !['save', 'form', 'sign'].includes(cmd.action))
      };
      const persistent = PERSISTENT_ACTIONS.includes(cmd.action);
      const result = persistent ? await executeAndPersist(localStorage, auto, role, request) : await execute(auto, role, request);
      if (persistent) saved.current = structuredClone(result.auto);
      setAuto(result.auto);
      setModal(null);
      flash(result.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : MSG[14]);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };

  const requestSign = () => {
    if (!auto) return;
    const invalid = fieldErrors(auto);
    setErrors(invalid);
    if (Object.values(invalid).some(Boolean)) {
      setError(invalid.infractions || invalid.characterization || invalid.document || invalid.date || invalid.coords || invalid.other || invalid.article || invalid.inspectionDate || invalid.inspectionTime || MSG[1]);
      return;
    }
    open('sign');
  };

  const close = () => {
    setModal(null);
    setError('');
  };

  const actionButton = (action: Action, label: string, callback?: () => void, color: 'primary' | 'gray' = 'primary') =>
    auto && (
      <Button size="sm" color={color} disabled={busy || !can(auto, role, action)} onClick={callback || (() => open(action))}>
        {label}
      </Button>
    );

  const changeNorm = (key: 'source' | 'article', v: string) => {
    if (!auto || !write) return;
    const next = structuredClone(auto);
    next.fields = {
      ...next.fields,
      [key]: v,
      clause: '',
      ...(key === 'source' ? { article: '', other: '' } : {})
    };
    setAuto(next);
    setErrors({});
  };

  const pickFile = (f: File | undefined) => {
    if (f && !fileAllowed(f.name, f.size)) {
      setFile(null);
      setError(MSG[17]);
    } else {
      setFile(f || null);
      setError('');
    }
  };

  const field = (
    key: keyof Omit<Fields, 'coords' | 'coordsList' | 'infractions'>,
    label: string,
    required = false,
    hint?: string,
    type = 'text',
    multiline = false
  ) =>
    auto && (
      <Field
        label={label}
        value={auto.fields[key] || ''}
        required={required}
        hint={hint}
        type={type}
        multiline={multiline}
        readOnly={!write}
        error={errors[key]}
        onChange={v =>
          setField(
            key,
            key === 'document'
              ? maskDocument(v)
              : key === 'cep' || key === 'inspectionCep'
              ? digits(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
              : v
          )
        }
      />
    );

  const readonly = (label: string, value: string, hint?: string) => (
    <Field label={label} value={value} readOnly hint={hint} multiline={value.length > 60} />
  );

  if (unauthorized) {
    return (
      <div className="aiad-page">
        <h1>{AIAD_TITLE}</h1>
        <p role="alert">{MSG[13]}</p>
      </div>
    );
  }

  const buttons: ReactNode = auto && (
    <>
      <Button color="gray" size="sm" disabled={busy} onClick={() => open('cancel')}>
        Cancelar
      </Button>

      {/* Ações Técnicas */}
      {role === 'tecnico' && (
        <>
          {can(auto, role, 'save') && actionButton('save', 'Salvar rascunho', () => command({ action: 'save' }), 'gray')}
          {actionButton('form', 'Salvar auto', () => command({ action: 'form' }), 'gray')}
          {actionButton('sign', 'Assinar', requestSign, 'primary')}
          {actionButton('coordination', 'Encaminhar para Coordenação', undefined, 'primary')}
          {auto.status === 'tecnico' && (
            <>
              {actionButton('beginCorrection', 'Iniciar ajuste autorizado', undefined, 'gray')}
              {actionButton('conclude', 'Concluir análise técnica', undefined, 'primary')}
            </>
          )}
        </>
      )}

      {/* Ações da Coordenação */}
      {role === 'coordenacao' && (
        <>
          {['formado', 'ajustes'].includes(auto.status) && actionButton('adjust', 'Solicitar ajustes', undefined, 'gray')}
          {actionButton('sign', 'Assinar e validar', requestSign, 'primary')}

          {auto.status === 'validado' && !auto.analysisConfirmed && (
            <>
              {auto.electronicNoticeRecognized ? (
                actionButton('expedir', 'Expedir', () => open('expedir'), 'primary')
              ) : (
                <Button size="sm" color="gray" disabled title="Exige correspondência eletrônica reconhecida">
                  Expedir — disponível após G3
                </Button>
              )}
              {actionButton('atend', 'Encaminhar à ATEND', undefined, 'primary')}
            </>
          )}

          {auto.status === 'expedido' && (
            <>
              {can(auto, role, 'receipt') && (
                <Button size="sm" color="gray" onClick={() => command({ action: 'receipt' })}>
                  Confirmar recebimento formal
                </Button>
              )}
              {can(auto, role, 'termElapsed') && (
                <Button size="sm" color="gray" onClick={() => command({ action: 'termElapsed' })}>
                  Simular decurso dos 20 dias
                </Button>
              )}
              {actionButton('atend', 'Encaminhar à ATEND', undefined, 'primary')}
            </>
          )}

          {auto.status === 'devolvido' && actionButton('toTechnician', 'Encaminhar ao técnico', undefined, 'primary')}
          {['analise', 'validado'].includes(auto.status) && auto.analysisConfirmed && actionButton('toArea', 'Encaminhar para área', undefined, 'primary')}
        </>
      )}

      {/* Ações da Diretoria */}
      {role === 'diretoria' && actionButton('director', 'Encaminhar à Coordenação', undefined, 'primary')}
    </>
  );

  const titles: Record<string, string> = {
    form: 'Salvar auto',
    sign: 'Confirmar assinatura',
    coordination: 'Encaminhar para Coordenação',
    adjust: 'Solicitar ajustes',
    director: 'Encaminhar à Coordenação',
    atend: 'Encaminhar à ATEND',
    toTechnician: 'Encaminhar ao técnico',
    conclude: 'Concluir análise técnica',
    toArea: 'Encaminhar para área',
    beginCorrection: 'Iniciar ajuste autorizado',
    attach: auto?.status === 'tecnico' ? 'Adicionar documento' : 'Adicionar anexo',
    remove: 'Remover anexo',
    history: 'Histórico de versões e auditoria',
    scenario: 'Carregar cenário demonstrativo',
    cancel: 'Cancelar edição',
    expedir: 'Confirmar expedição eletrônica'
  };

  const confirmation =
    modal === 'sign' || modal === 'beginCorrection'
      ? MSG[5]
      : modal === 'coordination'
      ? MSG[7]
      : modal === 'expedir'
      ? MSG[11]
      : modal === 'remove'
      ? 'Deseja remover este anexo não formalizado?'
      : modal === 'cancel'
      ? 'Sair sem executar a ação pendente? Somente os dados previamente salvos serão preservados.'
      : modal === 'scenario'
      ? 'Carregar os dados demonstrativos deste cenário? Alterações não salvas do cenário atual serão descartadas.'
      : '';

  const doConfirm = () => {
    if (modal === 'cancel') {
      setAuto(saved.current ? structuredClone(saved.current) : null);
      setModal(null);
      setError('');
      return;
    }
    if (modal === 'scenario') {
      switchScenario();
      return;
    }
    if (modal === 'adjust' && !reason.trim()) {
      setError(MSG[9]);
      return;
    }
    if (modal === 'attach') {
      if (!file) {
        setError(MSG[17]);
        return;
      }
      const id = crypto.randomUUID();
      command({
        action: 'attach',
        attachment: {
          id,
          name: file.name,
          format: file.name.split('.').pop()!.toUpperCase(),
          size: file.size,
          description: reason,
          user: USERS[role],
          at: new Date().toISOString(),
          kind
        }
      });
      return;
    }
    if (modal && modal !== 'history') {
      command({
        action: modal as Action,
        reason,
        recipient,
        attachmentId,
        confirmAdjustments: confirmed,
        confirmAnalysis: confirmed,
        authorizeCorrection
      });
    }
  };

  return (
    <div className="aiad-page space-y-6">
      {initial.error && <p role="alert" className="aiad-error">{initial.error}</p>}

      <SeiaV2PageHeader title={AIAD_TITLE} subtitle="Protótipo demonstrativo de elaboração e tramitação do auto de infração." actions={
        auto && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              color="gray"
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-1.5"
              title="Visualização institucional oficial somente leitura (BOT020)"
            >
              <Eye className="h-4 w-4" />
              Visualizar
            </Button>

            <Button
              size="sm"
              color="gray"
              type="button"
              onClick={() => {
                const ok = downloadAiadPdf(auto);
                if (!ok) setError(MSG[26]);
                else flash('Download do PDF demonstrativo realizado com sucesso.');
              }}
              className="flex items-center gap-1.5"
              title="Baixar PDF com duas vias e rodapé oficial (BOT019)"
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>

            <Button size="sm" color="gray" type="button" onClick={() => open('history')} className="flex items-center gap-1.5">
              <History className="h-4 w-4" />
              Histórico e versões
            </Button>
          </div>
        )} />

      {/* Simulador de Perfil e 10 Contextos Demonstrativos */}
      <Section compact heading="Simulador de Perfil e Etapas de Tramitação">
        <div className="aiad-simulator grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-3 items-end">
          <SelectField
            label="Perfil atual"
            disabled={busy}
            value={role}
            options={Object.entries(ROLES).map(([value, label]) => ({ value, label }))}
            onChange={v => {
              setRole(v as Role);
              setErrors({});
              setError('');
            }}
          />
          <SelectField
            label="Contextos demonstrativos"
            disabled={busy}
            value={scenario}
            options={SCENARIOS}
            onChange={setScenario}
          />
          <div className="flex items-end">
            <Button size="sm" color="gray" disabled={busy} onClick={() => open('scenario')} className="w-full md:w-auto h-9 px-4">
              Carregar cenário
            </Button>
          </div>
        </div>

        {savedRecords.length > 0 && (
          <div className="aiad-consult mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-end gap-2.5">
            <div className="flex-1 min-w-[260px]">
              <SelectField
                label="Registros locais salvos nesta máquina"
                disabled={busy}
                value={savedId}
                options={savedRecords.map(a => ({
                  value: a.id,
                  label: `${formatAiadDisplayNumber(a.number) || `Rascunho ${a.id.slice(-8)}`} — ${formatAiadDisplayProcess(a.process)}${a.legacyReview ? ' — legado preservado' : ''}`
                }))}
                onChange={setSavedId}
              />
            </div>
            <Button
              size="sm"
              color="gray"
              disabled={busy || !savedId}
              onClick={() => {
                try {
                  const record = readRepository(localStorage).records[savedId];
                  if (record) {
                    setAuto(structuredClone(record));
                    saved.current = structuredClone(record);
                    setErrors({});
                    setError('');
                    flash('Registro salvo carregado.');
                  }
                } catch (e) {
                  setError(e instanceof Error ? e.message : MSG[14]);
                }
              }}
              className="h-9"
            >
              Abrir registro salvo
            </Button>
          </div>
        )}
      </Section>

      {!auto ? (
        <Section compact heading="Processo Originador">
          <div className="aiad-grid">
            <SelectField
              label="Processo de fiscalização"
              value={process}
              options={[{ value: '', label: 'Sem processo vinculado' }, ...PROCESSES.map(p => ({ value: p.id, label: p.label }))]}
              onChange={setProcess}
            />
            <div className="aiad-actions items-end">
              <Button
                size="sm"
                disabled={role !== 'tecnico' || (!!process && !PROCESSES.find(p => p.id === process)?.eligible)}
                onClick={() => {
                  const a = createAiad(process);
                  saved.current = null;
                  setAuto(a);
                  flash('Novo auto iniciado em elaboração.');
                }}
              >
                <Plus className="h-4 w-4" />
                Elaborar auto
              </Button>
            </div>
          </div>
          <p className="aiad-helper mt-3">
            O processo originador é opcional e pode ser vinculado posteriormente.
          </p>
        </Section>
      ) : (
        <>
          {/* Dados Gerais do Auto */}
          <Section
            compact
            heading="AUTO DE INFRAÇÃO - ADVERTÊNCIA"
            headerActions={
              <div className="aiad-actions flex items-center gap-2">
                <Badge color={auto.status === 'rascunho' || auto.legacyReview ? 'gray' : auto.status === 'ajustes' ? 'warning' : 'primary'}>
                  {statusLabel(auto)}
                </Badge>
                <span className="aiad-helper font-mono font-medium">v{auto.version}</span>
              </div>
            }
          >
            <div className="aiad-grid">
              {readonly('Número do Auto', auto.number ? formatAiadDisplayNumber(auto.number) : 'Sem número definitivo — rascunho', LEG[1])}
              {readonly('Processo originador', auto.process ? formatAiadDisplayProcess(auto.process) : 'Sem processo vinculado', LEG[2])}
              {readonly('Processo relacionado do auto', auto.relatedProcess ? formatAiadDisplayProcess(auto.relatedProcess) : 'Ainda não formado (RN003 / RN056)')}
              {readonly('Responsável atual', responsibleLabel(auto))}
            </div>

            {!auto.process && can(auto, role, 'linkProcess') && (
              <div className="aiad-actions mt-3">
                <SelectField label="Vincular processo originador" value={process} options={[{ value: '', label: 'Selecione' }, ...PROCESSES.filter(p => p.eligible).map(p => ({ value: p.id, label: p.label }))]} onChange={setProcess} />
                <Button size="sm" disabled={!PROCESSES.some(p => p.id === process && p.eligible)} onClick={() => command({ action: 'linkProcess', process })}>Vincular processo</Button>
              </div>
            )}
            {auto.number && !auto.legacyReview && (
              <p className="aiad-helper mt-3">
                Número e processo próprios gerados ao salvar o auto.
              </p>
            )}
            {auto.status === 'rascunho' && <p className="aiad-helper mt-3">{LEG[16]}</p>}
            {auto.legacyReview && <p role="status" className="aiad-helper mt-3">{LEGACY_NOTICE}</p>}
            {auto.holder === 'coordenacao' && ['formado', 'ajustes'].includes(auto.status) && (
              <p className="aiad-helper mt-3">
                Recebido para avaliação. O envio inicial não altera o status oficial; evento sem status próprio definido no PDF (RN025 / RN061).
              </p>
            )}
            {auto.returnContext && (
              <p className="aiad-helper mt-3">
                <strong>Contexto externo recebido (somente leitura): </strong>
                {auto.returnContext.origin}. {auto.returnContext.recommendation} Documentos: {auto.returnContext.documents.join('; ')}.
              </p>
            )}
            {auto.request && (
              <p className="aiad-helper mt-3">
                <strong>Solicitação: </strong>
                {auto.request} <strong>Destinatário: </strong>
                {auto.recipient || 'Responsável atual'}
              </p>
            )}
            {auto.status === 'tecnico' && (
              <p className="aiad-helper mt-3">
                Atenda à solicitação com documento ou ajuste autorizado. Alteração do auto exige nova versão e assinaturas. Edição autorizada:{' '}
                {auto.adjustmentAuthorized ? 'sim' : 'não'}.
              </p>
            )}
          </Section>

          {/* Identificação do Autuado */}
          <Section compact heading="Identificação da pessoa autuada">
            <div className="aiad-grid">
              {field('name', 'Nome ou Razão Social', true)}
              <div>
                <label className="aiad-label">CPF/CNPJ</label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 min-w-0">
                    <InputWrapper valid={!errors.document} disabled={!write}>
                      <input
                        className="aiad-input font-mono"
                        value={auto.fields.document}
                        readOnly={!write}
                        disabled={!write}
                        aria-label="CPF/CNPJ"
                        aria-invalid={!!errors.document}
                        maxLength={18}
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        onChange={e => setField('document', maskDocument(e.target.value))}
                      />
                    </InputWrapper>
                  </div>
                  <Button size="sm" color="gray" disabled={!write} onClick={consult} className="h-9 shrink-0">
                    Consultar
                  </Button>
                </div>
                {errors.document && <p role="alert" className="aiad-error">{errors.document}</p>}
                <p className="aiad-helper mt-1">{LEG[3]}</p>
              </div>


              {field('address', 'Endereço da pessoa autuada', true)}
              {field('cep', 'CEP da pessoa autuada')}
              {field('city', 'Município da pessoa autuada', true)}
              {field('uf', 'UF da pessoa autuada', true)}
              {field('email', 'E-mail', false, undefined, 'email')}
              {field('phone', 'Telefone')}

              <SelectField
                label="Empreendimento / Atividade"
                value={auto.fields.enterprise}
                disabled={!write || !documentoValido(auto.fields.document) || digits(auto.fields.document).length !== 14}
                options={
                  digits(auto.fields.document) === '11222333000181'
                    ? [{ value: 'Unidade Industrial Salvador — demonstração', label: 'Unidade Industrial Salvador — demonstração' }]
                    : []
                }
                onChange={v => setField('enterprise', v)}
                hint={LEG[4]}
              />

            </div>

            {/* Simulação da Validação Eletrônica de E-mail e Reconhecimento */}
            <div className="aiad-actions mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge color={auto.emailValidated ? 'success' : 'gray'}>
                  {auto.emailValidated ? 'E-mail Validado Eletronicamente' : 'E-mail Não Validado'}
                </Badge>
                <Badge color={auto.electronicNoticeRecognized ? 'success' : 'gray'}>
                  {auto.electronicNoticeRecognized ? 'Correspondência Eletrônica Reconhecida (RN051)' : 'Sem Reconhecimento Eletrônico'}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="xs"
                  color="gray"
                  disabled={!write}
                  onClick={() => {
                    const next = structuredClone(auto);
                    next.emailValidated = !next.emailValidated;
                    addAudit(next, role, 'Simulação de validação do e-mail', String(next.emailValidated));
                    setAuto(next);
                  }}
                >
                  Alternar validação e-mail
                </Button>

                <Button
                  size="xs"
                  color="gray"
                  disabled={!write}
                  onClick={() => {
                    const next = structuredClone(auto);
                    next.electronicNoticeRecognized = !next.electronicNoticeRecognized;
                    if (next.electronicNoticeRecognized) next.emailValidated = true;
                    addAudit(next, role, 'Simulação de correspondência eletrônica reconhecida', String(next.electronicNoticeRecognized));
                    setAuto(next);
                    flash(
                      next.electronicNoticeRecognized
                        ? 'Correspondência eletrônica reconhecida pela pessoa autuada.'
                        : 'Correspondência eletrônica desmarcada.'
                    );
                  }}
                >
                  Alternar reconhecimento eletrônico
                </Button>
              </div>
            </div>
          </Section>

          {/* Dados do Auto e Fundamentação */}
          <Section compact heading="Dados do auto e fundamentação">
            <div className="space-y-4">
              {readonly('Fundamento legal fixo', FUNDAMENTO)}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {field('date', 'Data de elaboração', true, LEG[5], 'date')}
                {field('inspectionDate', 'Data da constatação (RN070)', true, 'Data da constatação da infração', 'date')}
                {field('inspectionTime', 'Horário da constatação (RN070)', true, 'Horário em formato HH:mm', 'time')}
              </div>

              {field('facts', 'Descrição da Infração / Texto do Auto', true, LEG[6], 'text', true)}

              <div>
                <span className="aiad-label">Texto composto automático do auto (RN012)</span>
                <p className="aiad-composed">{composedText(auto)}</p>
              </div>
            </div>
          </Section>

          {/* Localização da Inspeção e Múltiplas Coordenadas */}
          <Section compact heading="Localização da inspeção e coordenadas geográficas">
            <div className="space-y-4">
              <p className="aiad-helper">{LEG[7]}</p>
              <div className="aiad-grid">
                {field('inspection', 'Local da inspeção', true)}
                {field('inspectionAddress', 'Endereço da inspeção', true)}
                {field('inspectionCep', 'CEP da inspeção')}
                {field('inspectionCity', 'Município da inspeção', true)}
                {field('inspectionUf', 'UF da inspeção', true)}
              </div>

              {/* Componente de Múltiplas Coordenadas */}
              <AiadCoordinates
                value={auto.fields.coords}
                coordsList={auto.fields.coordsList}
                disabled={!write}
                onChange={(main, list) => {
                  const next = updateCoordsList(auto, list);
                  setAuto(next);
                }}
                onError={v => {
                  setErrors(e => ({ ...e, coords: v }));
                  setError(v);
                }}
                onNotice={flash}
              />
              {errors.coords && <p role="alert" className="aiad-error">{errors.coords}</p>}
            </div>
          </Section>

          <Section compact heading="Infrações e fundamentação normativa">
            {getInfractions(auto.fields).map((infraction, index) => {
              const change = (patch: Partial<typeof infraction>) => {
                const list = getInfractions(auto.fields).map((item, n) => n === index ? { ...item, ...patch } : item);
                setField('infractions', list);
              };
              const toggle = (items: string[], value: string) => items.includes(value) ? items.filter(v => v !== value) : [...items, value];
              return <div key={infraction.id} className="space-y-3 border-b border-slate-200 py-4">
                <h3 className="font-semibold">Infração {index + 1}</h3>
                <Field label="Caracterização da Infração (Anexo VI)" value={infraction.characterization} readOnly={!write} multiline required maxLength={1000} onChange={v => change({characterization:v})} />
                <a href="https://www.legislabahia.ba.gov.br/documentos/decreto-no-14024-de-06-de-junho-de-2012" target="_blank" rel="noreferrer">Consultar Anexo VI</a>
                <p className="aiad-helper">A seleção de itens do Anexo VI é opcional.</p>
                <Field label="Item do Anexo VI (opcional)" value={infraction.annexVI} readOnly={!write} onChange={v => change({annexVI:v})} hint="Informe a referência do item consultado." />
                <fieldset disabled={!write} className="space-y-2"><legend className="font-semibold">Art. 249 — critérios para gradação</legend>
                  {['I — circunstâncias atenuantes e agravantes','II — gravidade do fato','VI — infração formal ou material'].map(v => <label key={v} className="block"><input type="checkbox" checked disabled /> {v}</label>)}
                  {Object.entries({'III':'Antecedentes do infrator','IV':'Porte do empreendimento','V':'Grau de compreensão e escolaridade','VII':'Condição socioeconômica'}).map(([key,label]) => <div key={key}>
                    <label><input type="checkbox" checked={Object.hasOwn(infraction.optionalCriteria,key)} onChange={() => {const optionalCriteria={...infraction.optionalCriteria}; if (Object.hasOwn(optionalCriteria,key)) delete optionalCriteria[key]; else optionalCriteria[key]=''; change({optionalCriteria});}} /> {key} — {label}</label>
                    {Object.hasOwn(infraction.optionalCriteria,key) && <Field label={`Detalhamento ${key}`} value={infraction.optionalCriteria[key]} maxLength={500} required onChange={v => change({optionalCriteria:{...infraction.optionalCriteria,[key]:v}})} />}
                  </div>)}
                </fieldset>
                {([['250',CRITERIOS_250,infraction.criteria250],['251',CRITERIOS_251,infraction.criteria251]] as const).map(([article, options, selected]) => <fieldset key={article} disabled={!write} className="space-y-1"><legend className="font-semibold">Art. {article} — {article === '250' ? 'atenuantes' : 'agravantes'}</legend>
                  {options.map((label, n) => {const code=label.split(' ')[0]; return <label className="block" key={n}><input type="checkbox" checked={selected.includes(code)} onChange={() => change(article === '250' ? {criteria250:toggle(infraction.criteria250,code)} : {criteria251:toggle(infraction.criteria251,code), ...(code === 'VII' && infraction.criteria251.includes(code) ? {criterion251VII:[]} : {})})} /> {label}</label>})}
                  {article === '251' && infraction.criteria251.includes('VII') && ['a — para obter vantagem pecuniária','b — coagindo outrem para execução material'].map(label => <label className="block ml-4" key={label}><input type="checkbox" checked={infraction.criterion251VII.includes(label[0])} onChange={() => change({criterion251VII:toggle(infraction.criterion251VII,label[0])})} /> {label}</label>)}
                </fieldset>)}
                <SelectField label="Art. 257 — natureza da infração" required value={infraction.nature} disabled={!write} options={[{value:'',label:'Selecione'},{value:'formal',label:'I — Infração formal'},{value:'material',label:'II — Infração material'}]} onChange={v => change({nature:v,formalItems:[]})} />
                {infraction.nature === 'formal' && <fieldset disabled={!write}><legend>Infração formal — selecione ao menos uma opção</legend>{['a — falta de anuência, autorização, licença ambiental ou registro, quando necessários','b — descumprimento de prazos sem consequência direta para o meio ambiente'].map(label => <label className="block" key={label}><input type="checkbox" checked={infraction.formalItems.includes(label[0])} onChange={() => change({formalItems:toggle(infraction.formalItems,label[0])})} /> {label}</label>)}</fieldset>}
                <SelectField label="Art. 258 — gravidade" required value={infraction.severity} disabled={!write} options={[{value:'',label:'Selecione'},{value:'leve',label:'I — Leve'},{value:'grave',label:'II — Grave'},{value:'gravissima',label:'III — Gravíssima'}]} onChange={v => change({severity:v,penalties:[]})} />
                {infraction.severity && <fieldset disabled={!write}><legend className="font-semibold">Penalidade (Anexo VII) *</legend>{(PENALIDADES[infraction.severity] || []).map(label => <label className="block" key={label}><input type="checkbox" checked={infraction.penalties.includes(label)} onChange={() => change({penalties:toggle(infraction.penalties,label)})} /> {label}</label>)}</fieldset>}
                <fieldset disabled={!write}><legend className="font-semibold">Fontes normativas * (ordem de prioridade)</legend>
                  {SOURCES.map(source => {const selected=infraction.sources || (infraction.source ? [infraction.source] : []); return <label className="block" key={source.value}><input type="checkbox" checked={selected.includes(source.value)} onChange={() => change({sources:toggle(selected,source.value)})} /> {source.label}</label>})}
                </fieldset>
                {(infraction.sources || [infraction.source]).includes('estadual') && <fieldset disabled={!write}><legend className="font-semibold">Dispositivos estaduais — selecione pelo menos um inciso</legend>
                  {['254','254pu','255'].map(article => <div key={article}><strong>Art. {article === '254pu' ? '254, parágrafo único' : article}</strong>
                    {(CLAUSES[article] || []).filter(label => label.includes('—')).map(clause => {
                      const devices = infraction.devices || (infraction.article && infraction.clause ? [{article:infraction.article,clause:infraction.clause}] : []);
                      const checked=devices.some(d => d.article === article && d.clause === clause);
                      return <label className="block" key={clause}><input type="checkbox" checked={checked} disabled={!!infraction.other && article === '254pu' && clause.startsWith('VIII —')} onChange={() => change({article:'',clause:'',devices:checked ? devices.filter(d => !(d.article === article && d.clause === clause)) : [...devices,{article,clause}]})} /> {clause}</label>;
                    })}
                  </div>)}
                </fieldset>}
                {(infraction.sources || [infraction.source]).includes('federal') && <p className="aiad-helper">{FEDERAL_NOTICE}</p>}
                <Field label="Outras normas infringidas" value={infraction.other} readOnly={!write} multiline maxLength={500} onChange={v => { const sources=infraction.sources || (infraction.source ? [infraction.source] : []); const devices=infraction.devices || (infraction.article && infraction.clause ? [{article:infraction.article,clause:infraction.clause}] : []); const clause=(CLAUSES['254pu'] || []).find(c => c.startsWith('VIII —')) || 'VIII - inobservância da legislação;'; change({other:v, sources:v && !sources.includes('outras') ? [...sources,'outras'] : sources, devices:v && !devices.some(d => d.article === '254pu' && d.clause === clause) ? [...devices,{article:'254pu',clause}] : devices}); }} hint="Até 500 caracteres; o art. 254, parágrafo único, VIII acompanha a descrição." />
                {getInfractions(auto.fields).length > 1 && <Button color="gray" size="sm" disabled={!write} onClick={() => setField('infractions',getInfractions(auto.fields).filter((_,n) => n !== index))}>Remover infração {index + 1}</Button>}
              </div>;
            })}
            {errors.infractions && <p role="alert" className="aiad-error">{errors.infractions}</p>}
            <Button color="gray" size="sm" disabled={!write} onClick={() => setField('infractions',[...getInfractions(auto.fields),newInfraction()])}>Adicionar infração</Button>
          </Section>

          {/* Prazos Legais e Expedição Eletrônica (G3) */}
          <Section compact heading="Prazos Legais e Expedição Eletrônica (G3)">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ReadonlyCard
                  label="Prazo para Defesa (RN021)"
                  value="20 dias da ciência do Auto (Art. 192, I, Lei 10.431/2006)"
                  hint={LEG[10]}
                />
                <ReadonlyCard
                  label="Prazo para Recurso (RN022)"
                  value="20 dias da decisão do INEMA (Art. 192, II, Lei 10.431/2006)"
                  hint={LEG[11]}
                />
              </div>

              {auto.dispatch ? (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Expedição Eletrônica Realizada
                    </span>
                    <Badge color={auto.dispatch.termCompleted ? 'success' : 'warning'}>
                      {auto.dispatch.termCompleted ? 'Prazo de 20 dias concluído' : 'Prazo em curso'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <div>
                      <strong>Expedido em: </strong>
                      {new Date(auto.dispatch.at).toLocaleString('pt-BR')}
                    </div>
                    <div>
                      <strong>Por: </strong>
                      {auto.dispatch.user} ({ROLES[auto.dispatch.role]})
                    </div>
                    <div>
                      <strong>Destinatário: </strong>
                      {auto.dispatch.recipient || auto.fields.name}
                    </div>
                  </div>

                  {auto.dispatch.receiptAt ? (
                    <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                      <p>
                        <strong>Recebimento formal confirmado em: </strong>
                        {new Date(auto.dispatch.receiptAt).toLocaleString('pt-BR')} (marco temporal do prazo, RN054).
                      </p>
                      <p>
                        <strong>Data limite para manifestação: </strong>
                        {auto.dispatch.termEndAt ? new Date(auto.dispatch.termEndAt).toLocaleDateString('pt-BR') : '20 dias'}
                      </p>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
                      <span className="text-xs text-amber-800 dark:text-amber-300 italic">
                        Aguardando confirmação de ciência/recebimento formal pela pessoa autuada.
                      </span>
                      {role === 'coordenacao' && (
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => command({ action: 'receipt' })}
                        >
                          Confirmar recebimento (ciência)
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="aiad-helper">
                  A contagem dos prazos tem início na confirmação do recebimento formal da correspondência eletrônica pela pessoa autuada (RN054 / RN064).
                </p>
              )}
            </div>
          </Section>

          {/* Anexos e Diligências */}
          <TableContainer
            heading="Anexos do auto e diligências"
            description={LEG[15]}
            stableHeight={false}
            toolbar={
              <TableToolbar
                actions={
                  <Button
                    size="sm"
                    color="gray"
                    disabled={busy || !can(auto, role, 'attach')}
                    onClick={() => {
                      setKind(auto.status === 'tecnico' ? 'PTAD' : 'Anexo');
                      open('attach');
                    }}
                  >
                    <Upload className="h-4 w-4" />
                    {auto.status === 'tecnico' ? 'Adicionar documento' : 'Adicionar anexo'}
                  </Button>
                }
              />
            }
          >
            <GlaTable>
              <GlaTableHead>
                <GlaTableRow>
                  {['Nome do arquivo', 'Formato', 'Tamanho', 'Descrição', 'Usuário', 'Data/Hora', 'Ações'].map(t => (
                    <GlaTh key={t}>{t}</GlaTh>
                  ))}
                </GlaTableRow>
              </GlaTableHead>
              <GlaTableBody>
                {auto.attachments.length ? (
                  auto.attachments.map(f => (
                    <GlaTableRow key={f.id}>
                      <GlaTd>{f.name}</GlaTd>
                      <GlaTd>{f.format}</GlaTd>
                      <GlaTd>{(f.size / 1024).toFixed(1)} KB</GlaTd>
                      <GlaTd>
                        {f.description || '—'}
                        {f.kind !== 'Anexo' && <span className="block aiad-helper">{f.kind}</span>}
                      </GlaTd>
                      <GlaTd>{f.user}</GlaTd>
                      <GlaTd>{new Date(f.at).toLocaleString('pt-BR')}</GlaTd>
                      <GlaTd>
                        <Button
                          color="danger"
                          outlined
                          size="sm"
                          disabled={busy || !can(auto, role, 'remove')}
                          onClick={() => {
                            setAttachmentId(f.id);
                            open('remove');
                          }}
                        >
                          Remover
                        </Button>
                      </GlaTd>
                    </GlaTableRow>
                  ))
                ) : (
                  <GlaTableRow>
                    <GlaTd colSpan={7}>
                      <p className="aiad-empty">Não há anexos disponíveis.</p>
                    </GlaTd>
                  </GlaTableRow>
                )}
              </GlaTableBody>
            </GlaTable>
            {errors.attachments && <p role="alert" className="aiad-error p-4">{errors.attachments}</p>}
          </TableContainer>

          {/* Assinaturas Eletrônicas */}
          <Section compact heading="Assinaturas eletrônicas">
            <p className="aiad-helper mb-4">
              Assinaturas demonstrativas com integridade criptográfica SHA-256 (RN023 / RN024).
            </p>
            <div className="aiad-grid aiad-signatures">
              {(['tecnico', 'coordenacao'] as const).map(r => {
                const s = auto.signatures.find(sig => sig.role === r);
                return (
                  <div key={r}>
                    <h4 className="aiad-label">{r === 'tecnico' ? 'Autoridade Fiscalizadora (Técnico Autor)' : 'Coordenação Técnica'}</h4>
                    <p className="aiad-helper">{LEG[r === 'tecnico' ? 12 : 13]}</p>
                    <Badge className="mt-2" color={s ? 'success' : 'gray'}>
                      {s ? 'Assinado' : 'Aguardando assinatura'}
                    </Badge>
                    {r === 'tecnico' && auto.status === 'tecnico' && !diligenceAnswered(auto) && (
                      <p className="aiad-helper text-amber-700 dark:text-amber-400 mt-1">
                        Aguardando atendimento da solicitação para concluir a análise.
                      </p>
                    )}
                    {s && (
                      <dl className="aiad-signature-data">
                        <dt>Signatário</dt>
                        <dd>{s.user}</dd>
                        <dt>Data/hora</dt>
                        <dd>{new Date(s.at).toLocaleString('pt-BR')}</dd>
                        <dt>Versão assinada</dt>
                        <dd>v{s.version}</dd>
                        <dt>Integridade</dt>
                        <dd className="font-mono break-all">{s.hash}</dd>
                      </dl>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Rodapé e Ações do Formulário */}
          <div className="aiad-footer flex flex-col items-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            {role === 'tecnico' && auto.status === 'tecnico' && !diligenceAnswered(auto) && (
              <div className="w-full text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Atenção (Diligência Técnica):</strong> A conclusão requer atender à solicitação com documento (PTAD, Nota Técnica ou Anexo) ou alteração autorizada do auto. Alterações exigem novas assinaturas.
                </span>
              </div>
            )}

            {role === 'coordenacao' && auto.status === 'validado' && !auto.analysisConfirmed && !auto.electronicNoticeRecognized && (
              <div className="w-full text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Expedição eletrônica indisponível (RN051 / RN052):</strong> A pessoa autuada não possui correspondência eletrônica reconhecida. A saída inicial é para a ATEND, com status <em>Aguardando expedição</em>.
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 w-full">
              {buttons}
            </div>
          </div>
        </>
      )}

      {error && !modal && <p role="alert" className="aiad-error">{error}</p>}
      {notice && <GlaNotification title={notice} type={notice === MSG[22] ? 'info' : 'success'} onClose={() => setNotice('')} />}

      {/* Modal de Histórico e Ações de Confirmação */}
      <Dialog
        open={!!modal}
        onOpenChange={v => {
          if (!v && !busy) close();
        }}
      >
        <DialogContent
          className={`aiad-dialog ${modal === 'history' ? 'aiad-dialog-wide' : ''}`}
          onPointerDownOutside={e => {
            if (modal !== 'history') e.preventDefault();
          }}
          onEscapeKeyDown={e => {
            if (busy) e.preventDefault();
          }}
          onCloseAutoFocus={e => {
            e.preventDefault();
            trigger.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>{modal ? titles[modal] : ''}</DialogTitle>
            <DialogDescription>
              {modal === 'history'
                ? `Auto ${auto?.number || 'em rascunho'} — ${auto?.process}`
                : confirmation || 'Operação demonstrativa registrada na trilha de auditoria.'}
            </DialogDescription>
          </DialogHeader>

          <div className="aiad-dialog-body space-y-4">
            {modal === 'scenario' && (
              <p className="aiad-helper">
                O perfil pode ser alternado sem carregar outro cenário. Carregar cenário substitui apenas a demonstração em edição, não o rascunho salvo.
              </p>
            )}

            {modal === 'adjust' && (
              <Field label="Justificativa do ajuste" value={reason} onChange={setReason} multiline required hint={LEG[14]} />
            )}

            {modal === 'toTechnician' && (
              <>
                <SelectField
                  label="Técnico responsável"
                  required
                  value={recipient}
                  options={[{ value: USERS.tecnico, label: USERS.tecnico }]}
                  onChange={setRecipient}
                />
                <label className="aiad-helper flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={authorizeCorrection}
                    onChange={e => setAuthorizeCorrection(e.target.checked)}
                  />
                  Autorizar ajuste do auto no retorno (simulação da Coordenação)
                </label>
              </>
            )}

            {modal === 'toArea' && (
              <Field
                label="Área destinatária"
                value={recipient}
                onChange={v => {
                  setRecipient(v);
                  setError('');
                }}
                required
                hint="Identificação demonstrativa livre; catálogo corporativo e permissões de áreas dependem de integração."
              />
            )}

            {(modal === 'conclude' || (modal === 'sign' && role === 'coordenacao' && !!auto?.request)) && (
              <label className="aiad-helper flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
                {modal === 'conclude'
                  ? 'Confirmo o atendimento da solicitação de retorno.'
                  : 'Após avaliação, confirmo que os ajustes solicitados foram atendidos.'}
              </label>
            )}

            {modal === 'attach' && (
              <>
                <p className="aiad-helper">{MOCK_FILE_POLICY}</p>
                {auto?.status === 'tecnico' && (
                  <SelectField
                    label="Tipo de documento"
                    value={kind}
                    options={['PTAD', 'Nota Técnica', 'Anexo'].map(label => ({ label, value: label }))}
                    onChange={setKind}
                  />
                )}
                <InputWrapper label="Arquivo" required>
                  <input
                    aria-label="Arquivo"
                    className="aiad-input aiad-file"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={e => pickFile(e.target.files?.[0])}
                  />
                </InputWrapper>
                <Field label="Descrição do arquivo" value={reason} onChange={setReason} multiline />
              </>
            )}

            {modal === 'history' && auto && (
              <>
                <SelectField
                  label="Versão para consulta"
                  value={versionView}
                  options={[
                    { value: 'current', label: `Atual — v${auto.version}` },
                    ...auto.versions.map(v => ({ value: String(v.version), label: `Versão preservada — v${v.version}` }))
                  ]}
                  onChange={setVersionView}
                />

                {versionView !== 'current' &&
                  auto.versions
                    .filter(v => String(v.version) === versionView)
                    .map(v => (
                      <Section key={v.version} compact heading={`Versão ${v.version} preservada`}>
                        <p className="aiad-helper">{v.reason}</p>
                        <p className="text-sm mt-2">{v.fields.facts}</p>
                        <p className="aiad-helper mt-2">
                          Assinaturas preservadas:{' '}
                          {v.signatures
                            .map(s => `${ROLES[s.role]} — ${s.user}, v${s.version}, ${s.at}, ${s.hash}`)
                            .join(' / ') || 'Sem assinatura'}
                        </p>
                        <p className="aiad-helper mt-2">
                          Anexos: {v.attachments.map(f => f.name).join(', ') || 'Sem anexos'}
                        </p>
                      </Section>
                    ))}

                <TableContainer stableHeight={false}>
                  <GlaTable>
                    <GlaTableHead>
                      <GlaTableRow>
                        {['Usuário / Perfil', 'Data/Hora', 'Ação', 'Versão', 'Detalhes / Justificativa'].map(t => (
                          <GlaTh key={t}>{t}</GlaTh>
                        ))}
                      </GlaTableRow>
                    </GlaTableHead>
                    <GlaTableBody>
                      {auto.audit.map((e, i) => (
                        <GlaTableRow key={i}>
                          <GlaTd>
                            {e.user}
                            <span className="block aiad-helper">{e.profile}</span>
                          </GlaTd>
                          <GlaTd>{new Date(e.at).toLocaleString('pt-BR')}</GlaTd>
                          <GlaTd>{e.action}</GlaTd>
                          <GlaTd>v{e.version}</GlaTd>
                          <GlaTd>
                            {auditDescription(e.detail)}
                            {e.origin && (
                              <span className="block aiad-helper">
                                {actorLabel(e.origin)} → {actorLabel(e.destination || '')}; {eventStatus(e.statusBefore)} →{' '}
                                {eventStatus(e.statusAfter)}; {e.result}
                              </span>
                            )}
                          </GlaTd>
                        </GlaTableRow>
                      ))}
                    </GlaTableBody>
                  </GlaTable>
                </TableContainer>
              </>
            )}

            {error && <p role="alert" className="aiad-error">{error}</p>}
          </div>

          <DialogFooter>
            <Button size="sm" color="gray" disabled={busy} onClick={close}>
              {modal === 'history' ? 'Fechar' : 'Cancelar'}
            </Button>
            {modal !== 'history' && (
              <Button
                size="sm"
                disabled={busy}
                color={modal === 'remove' ? 'danger' : 'primary'}
                onClick={doConfirm}
              >
                {busy ? 'Processando…' : 'Confirmar'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização Institucional Oficial (RN063 / RN065) */}
      <AiadPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        auto={auto}
      />
    </div>
  );
}
