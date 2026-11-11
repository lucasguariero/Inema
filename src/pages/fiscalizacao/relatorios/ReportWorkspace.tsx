import { SeiaV2PageHeader } from '@/components/seia-v2/SeiaV2PageHeader';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Section } from '@/components/filament/Section';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { GlaTable, GlaTableHead, GlaTableBody, GlaTableRow, GlaTh, GlaTd, GlaPagination } from '@/components/common/GlaTable';
import { Plus, ArrowLeft, Save, Eye, History, Send, Trash2, Copy, RotateCcw, ChevronDown } from 'lucide-react';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { EditorContext, Field, SelectField, Confirm, Modal } from './controls';
import { ACTORS, canEdit, canRead, importSelected, message, legend, newReport, SHORT, TITLES, validateReport } from './domain';
import { initialRepository, EMPTY_REUSE_FILTERS, searchReports } from './fixtures';
import { loadRepository, persistCommand } from './repository';
import { RfaForm, RFA_SECTIONS } from './RfaForm';
import { RaeForm, RAE_SECTIONS } from './RaeForm';
import { ReportLookup } from './ReportLookup';
import { ReportDocument } from './ReportDocument';
import type { Actor, Command, Errors, Report, ReportKind, Repository } from './types';
import './relatorios.css';

export function ReportWorkspace({ kind }: { kind: ReportKind }) {
 const query = new URLSearchParams(location.search), scenario = query.get('relatorio-cenario') || 'padrao', [repo, setRepo] = useState<Repository | null>(null), [loadError, setLoadError] = useState('');
 const [actor, setActor] = useState<Actor>(() => ACTORS.find(a => a.id === query.get('relatorio-perfil')) || ACTORS[0]), [activeId, setActiveId] = useState(query.get('relatorio-id') || ''), [draft, setDraft] = useState<Report | null>(null), [errors, setErrors] = useState<Errors>({}), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false);
 const [newChoice, setNewChoice] = useState(false), [reuse, setReuse] = useState<'new' | 'current' | null>(null), [preview, setPreview] = useState<Report | null>(null), [history, setHistory] = useState(false), [confirmAction, setConfirmAction] = useState<'finalize' | 'delete' | 'return' | null>(null), [returnReason, setReturnReason] = useState('');
 const [discard, setDiscard] = useState<(() => void) | null>(null), [search, setSearch] = useState(''), [page, setPage] = useState(1), [filters, setFilters] = useState({ status: '', person: '', process: '' }), [workingFilters, setWorkingFilters] = useState(filters);
 const saved = repo?.records.find(r => r.id === activeId && r.kind === kind), dirty = !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved), dirtyRef = useRef(dirty), currentUrl = useRef(location.href), locked = useRef(false);
 dirtyRef.current = dirty;
 const sections = kind === 'DOR008' ? RFA_SECTIONS : RAE_SECTIONS;
 const sectionItems = [
  { id: 'processo', label: kind === 'DOR008' ? 'Processo originador' : 'Processo originador e processos relacionados' },
  ...sections.map((s, i) => ({ id: `sec-${i + 1}`, label: `${i + 1}. ${s}` }))
 ];
 const [activeSection, setActiveSection] = useState('processo');
 useEffect(() => {
  if (!activeId || !draft) return;
  const ids = ['processo', ...sections.map((_, i) => `sec-${i + 1}`)];
  const handleScroll = () => {
   const scrollY = window.scrollY + 130;
   let current = ids[0];
   for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
   }
   setActiveSection(current);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  return () => window.removeEventListener('scroll', handleScroll);
 }, [activeId, draft, sections]);
 const scrollToSection = (id: string, e?: React.MouseEvent) => {
  if (e) e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
   el.scrollIntoView({ behavior: 'smooth', block: 'start' });
   setActiveSection(id);
  }
 };
 const hasSectionError = (secId: string) => Object.keys(errors).some(path => {
  const head = path.split('.')[0];
  const targetSec = head === 'originator' ? 'processo' : head.startsWith('attend') ? 'sec-1' : ['person', 'participants', 'companies'].includes(head) ? 'sec-2' : ['coordinates', 'location'].includes(head) ? 'sec-3' : head === 'infractions' ? (kind === 'DOR008' ? 'sec-7' : 'sec-8') : head === 'notifications' ? (kind === 'DOR008' ? 'sec-8' : 'sec-9') : (head === 'description' || (head === 'attachments' && path.includes('images'))) ? (kind === 'DOR008' ? 'sec-5' : 'sec-6') : head === 'conclusion' ? (kind === 'DOR008' ? 'sec-6' : 'sec-7') : head === 'recommendations' ? 'sec-10' : (kind === 'DOR008' ? 'sec-9' : 'sec-11');
  return targetSec === secId;
 });
 useEffect(() => { let live = true; if (query.get('relatorio-falha') === 'storage') { setLoadError('Armazenamento demonstrativo indisponível neste cenário. Nenhum dado anterior foi sobrescrito.'); return; } void loadRepository(scenario, () => initialRepository(query.get('relatorio-vazio') === '1')).then(r => { if (live) { setRepo(r); const selected = r.records.find(x => x.id === activeId && x.kind === kind); setDraft(selected ? structuredClone(selected) : null); } }).catch(e => { if (live) setLoadError(e instanceof Error ? e.message : 'Erro no armazenamento local.'); }); return () => { live = false; }; }, [scenario, kind]);
 const change = useCallback((value: React.SetStateAction<Report>) => { setDraft(previous => previous ? typeof value === 'function' ? value(previous) : value : null); }, []);
 const navigate = (id: string, replace = false) => { const url = new URL(location.href); if (id) url.searchParams.set('relatorio-id', id); else url.searchParams.delete('relatorio-id'); window.history[replace ? 'replaceState' : 'pushState']({}, '', url); currentUrl.current = url.href; setActiveId(id); setDraft(id ? structuredClone(repo!.records.find(x => x.id === id)!) : null); setErrors({}); setNotice(''); window.scrollTo(0, 0); };
 const protect = (fn: () => void) => { if (dirtyRef.current) setDiscard(() => fn); else fn(); };
 useEffect(() => {
  const beforeUnload = (e: BeforeUnloadEvent) => { if (dirtyRef.current) { e.preventDefault(); e.returnValue = ''; } };
  const pop = () => { const requested = new URL(location.href).searchParams.get('relatorio-id') || ''; if (dirtyRef.current && !window.confirm('Há alterações não salvas. Descartar e navegar?')) { window.history.pushState({}, '', currentUrl.current); return; } setActiveId(requested); setDraft(repo?.records.find(r => r.id === requested && r.kind === kind) ? structuredClone(repo.records.find(r => r.id === requested)!) : null); currentUrl.current = location.href; setErrors({}); };
  const link = (e: MouseEvent) => { const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null; if (!dirtyRef.current || !a || a.target === '_blank' || a.hasAttribute('download') || a.getAttribute('href')?.startsWith('#')) return; if (a.origin === location.origin && a.href !== location.href) { e.preventDefault(); e.stopPropagation(); setDiscard(() => () => location.assign(a.href)); } };
  window.addEventListener('beforeunload', beforeUnload); window.addEventListener('popstate', pop); document.addEventListener('click', link, true);
  return () => { window.removeEventListener('beforeunload', beforeUnload); window.removeEventListener('popstate', pop); document.removeEventListener('click', link, true); };
 }, [repo, kind]);
 const run = async (cmd: Command) => {
  if (locked.current) return; locked.current = true; setBusy(true); setNotice('');
  try { if (new URLSearchParams(location.search).get('relatorio-falha') === 'save') throw Error('Falha simulada ao salvar. Os dados em edição foram preservados.'); const next = await persistCommand(scenario, actor, cmd); setRepo(next); const id = 'report' in cmd ? cmd.report.id : cmd.id; const item = next.records.find(r => r.id === id); setDraft(item ? structuredClone(item) : null); if (item) { setActiveId(item.id); const u = new URL(location.href); u.searchParams.set('relatorio-id', item.id); historyReplace(u); } else { setActiveId(''); const u = new URL(location.href); u.searchParams.delete('relatorio-id'); historyReplace(u); } setErrors({}); setConfirmAction(null); setReturnReason(''); setNotice(cmd.action === 'save' ? message(kind, 2) : cmd.action === 'delete' ? message(kind, 5) : cmd.action === 'return' ? 'Relatório devolvido para ajuste no ambiente demonstrativo.' : message(kind, 3) + ' Encaminhamento apenas simulado; nenhum envio institucional.'); return next; } catch (e) { setConfirmAction(null); setNewChoice(false); setReuse(null); setNotice(message(kind, cmd.action === 'delete' ? 20 : 16) + (e instanceof Error ? ' ' + e.message : '')); requestAnimationFrame(() => requestAnimationFrame(() => { const feedback = document.getElementById('report-notice'); feedback?.scrollIntoView({ block: 'center', behavior: 'instant' }); feedback?.focus({ preventScroll: true }); })); } finally { locked.current = false; setBusy(false); }
 };
 const historyReplace = (u: URL) => { window.history.replaceState({}, '', u); currentUrl.current = u.href; };
 const create = async (source?: Report, fields?: string[]) => { let r = newReport(kind, actor); if (source) r = importSelected(r, source, fields || []); const next = await run({ action: 'save', report: r, expectedRevision: 0 }); if (next) { setNewChoice(false); setReuse(null); window.scrollTo(0, 0); requestAnimationFrame(() => document.getElementById('processo')?.querySelector('button')?.focus({ preventScroll: true })); } };
 const validate = () => { if (!draft) return; const e = validateReport(draft); setErrors(e); if (Object.keys(e).length) { setNotice(message(kind, 1)); setTimeout(() => document.getElementById('report-errors')?.focus(), 0); } else setConfirmAction('finalize'); };
 const switchActor = (id: string) => protect(() => { const next = ACTORS.find(a => a.id === id)!; setActor(next); setDraft(saved ? structuredClone(saved) : null); setErrors({}); const u = new URL(location.href); u.searchParams.set('relatorio-perfil', id); historyReplace(u); });
 const eligible = repo?.records.filter(r => r.kind === kind && canRead(r, actor)) || [];
 const filtered = searchReports(eligible, kind, { ...EMPTY_REUSE_FILTERS, name: search, process: filters.process, document: filters.person }).filter(r => !filters.status || r.status === filters.status), totalPages = Math.max(1, Math.ceil(filtered.length / 10));
 const heading = <SeiaV2PageHeader title={`${TITLES[kind]} — ${SHORT[kind]}`} subtitle={activeId?'Elaboração, consulta e revisão do relatório':'Relatórios acessíveis ao perfil demonstrativo'} backButton={activeId?{label:'Voltar à consulta',onClick:()=>protect(()=>navigate(''))}:undefined} actions={!activeId&&<Button disabled={actor.role!=='tecnico'||busy||!!loadError} onClick={()=>setNewChoice(true)}><Plus className="w-4 h-4"/>Novo {SHORT[kind]}</Button>}/>;
 const accessDenied = actor.role === 'externo' || !!activeId && (!saved || !canRead(saved, actor));
 const focusError = (path: string) => { const field = document.querySelector(`[data-field="${path}"]`) as HTMLElement | null; const head = path.split('.')[0], idx = head === 'originator' ? 'processo' : head.startsWith('attend') ? 'sec-1' : ['person', 'participants', 'companies'].includes(head) ? 'sec-2' : ['coordinates', 'location'].includes(head) ? 'sec-3' : head === 'infractions' ? kind === 'DOR008' ? 'sec-7' : 'sec-8' : head === 'notifications' ? kind === 'DOR008' ? 'sec-8' : 'sec-9' : head === 'description' || head === 'attachments' && path.includes('images') ? kind === 'DOR008' ? 'sec-5' : 'sec-6' : head === 'conclusion' ? kind === 'DOR008' ? 'sec-6' : 'sec-7' : head === 'recommendations' ? 'sec-10' : kind === 'DOR008' ? 'sec-9' : 'sec-11'; const section = document.getElementById(idx); if (section) for (const detail of section.querySelectorAll('details')) detail.open = true; const target = field || section?.querySelector('input:not(:disabled),textarea:not(:disabled),button:not(:disabled)') as HTMLElement | null; section?.scrollIntoView({ block: 'start' }); target?.focus({ preventScroll: true }); };
 const body = <div className="fr-page" data-report-kind={kind}>
  {heading}
  <details className="fr-hint"><summary>Ambiente demonstrativo — dados fictícios e operações locais</summary><p>Nenhuma integração real com SEI, GeoServer, pessoas, processos, CAR/CEFIR, notificações ou assinatura digital. Numeração apenas ilustrativa; definições institucionais pendentes. Os arquivos e rascunhos ficam neste navegador.</p><p>RFA: devolução restrita a infrações, notificações e desdobramentos (P01); caracterização textual e Anexo VI separado (P02). RAE: todos os campos somente ao autor após devolução. Catálogos incompletos permanecem indisponíveis.</p></details>
  <div className="fr-grid"><SelectField label="Perfil demonstrativo" value={actor.id} onChange={switchActor} options={ACTORS.map(a => ({ value: a.id, label: a.name }))} disabled={busy} /><div className="fr-hint">{draft && !accessDenied ? <><strong>{draft.status}</strong><p>{draft.number ? 'Número demonstrativo: ' + draft.number : 'Sem número definitivo'} · versão {draft.version} · revisão {draft.revision}</p><p>{legend(kind, 1)} Numeração exclusivamente demonstrativa.</p>{kind === 'DOR008' && <p id="report-geo-summary">Contexto geoespacial: {draft.content.geo ? `${draft.content.geo.layers.length} resultados de camadas/pontos fictícios.` : 'Consulta não realizada.'} <a href="#sec-3" className="underline">Consultar resultados</a></p>}<p>{dirty ? 'Alterações não salvas' : 'Dados salvos neste navegador'}</p><p>{legend(kind, draft.status === 'Rascunho' ? kind === 'DOR008' ? 15 : 19 : draft.status === 'Finalizado' ? kind === 'DOR008' ? 16 : 20 : kind === 'DOR008' ? 17 : 21)}{draft.status === 'Finalizado' && ' Encaminhamento somente demonstrativo, sem envio real.'}</p></> : 'Os perfis simulam permissões na interface. Não representam autenticação corporativa.'}</div></div>
  {notice && <div id="report-notice" tabIndex={-1} role="status" aria-live="polite" className="fr-notice">{notice}</div>}
  {loadError ? <div role="alert" className="fr-notice"><p>{loadError}</p><Button color="gray" onClick={() => location.reload()}>Tentar novamente</Button></div> : !repo ? <p role="status">Carregando relatórios locais…</p> : accessDenied ? <div role="alert" className="fr-notice"><p>{message(kind, 17)}</p>{activeId && <Button color="gray" onClick={() => navigate('')}>Voltar à consulta</Button>}</div> : !activeId ? <TableContainer stableHeight={false} heading={`Relatórios de ${kind === 'DOR008' ? 'Fiscalização Ambiental' : 'Atendimento de Emergência'}`} description={`${filtered.length} relatório${filtered.length === 1 ? '' : 's'} acessíve${filtered.length === 1 ? 'l' : 'is'} ao perfil demonstrativo`} toolbar={<TableToolbar searchPlaceholder={`Buscar ${SHORT[kind]} por nome/razão social`} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }} activeFilterCount={Object.values(filters).filter(Boolean).length} onFiltersOpen={() => setWorkingFilters({ ...filters })} onFiltersApply={() => { setFilters(workingFilters); setPage(1); }} onFiltersCancel={() => setWorkingFilters({ ...filters })} restoreFilterFocus filters={<div className="fr-toolbar-filters"><SelectField label="Estado do relatório" value={workingFilters.status} onChange={v => setWorkingFilters({ ...workingFilters, status: v })} options={['Rascunho', 'Finalizado', 'Devolvido para ajuste']} /><Field label="CPF/CNPJ do relatório" value={workingFilters.person} onChange={v => setWorkingFilters({ ...workingFilters, person: v.replace(/\D/g, '') })} /><Field label="Processo do relatório" value={workingFilters.process} onChange={v => setWorkingFilters({ ...workingFilters, process: v })} /><Button color="gray" onClick={() => setWorkingFilters({ status: '', person: '', process: '' })}>Limpar filtros</Button></div>} />} pagination={<GlaPagination page={Math.min(page, totalPages)} totalPages={totalPages} totalCount={filtered.length} currentCount={Math.min(Math.min(page, totalPages) * 10, filtered.length)} startIndex={filtered.length ? (Math.min(page, totalPages) - 1) * 10 + 1 : 0} entityName="relatórios" onPageChange={setPage} />}><GlaTable><GlaTableHead><GlaTableRow>{['Relatório / número demonstrativo', 'Identificação', 'Processo originador', 'Estado', 'Último registro', 'Ações'].map(t => <GlaTh scope="col" key={t}>{t}</GlaTh>)}</GlaTableRow></GlaTableHead><GlaTableBody>{filtered.slice((Math.min(page, totalPages) - 1) * 10, Math.min(page, totalPages) * 10).map(r => <GlaTableRow key={r.id}><GlaTd className="font-semibold text-slate-900">{r.number || 'Rascunho sem número'}</GlaTd><GlaTd>{r.content.person.name || 'Identificação pendente'}</GlaTd><GlaTd className="font-mono text-xs">{r.content.originator || 'Não selecionado'}</GlaTd><GlaTd><Badge color={r.status === 'Finalizado' ? 'success' : r.status === 'Devolvido para ajuste' ? 'warning' : 'gray'} dot>{r.status}</Badge></GlaTd><GlaTd className="text-slate-600 text-xs">{new Date(r.updatedAt).toLocaleString('pt-BR')}</GlaTd><GlaTd><Button color="gray" size="sm" onClick={() => navigate(r.id)} aria-label={`Abrir ${SHORT[kind]} ${r.number || 'rascunho'}`}>Abrir</Button></GlaTd></GlaTableRow>)}{!filtered.length && <GlaTableRow><GlaTd colSpan={6}><div className="py-8 text-center text-slate-500"><p className="font-medium">Nenhum relatório encontrado</p><p className="text-xs text-slate-400 mt-1">Ajuste os filtros de busca{actor.role === 'tecnico' ? ` ou inicie um novo ${SHORT[kind]}` : ''}.</p></div></GlaTd></GlaTableRow>}</GlaTableBody></GlaTable></TableContainer> : draft && <>
   <div className="fr-actions"><Button color="gray" disabled={!canEdit(draft, actor, 'person')} onClick={() => setReuse('current')}><Copy className="w-4 h-4" />Aproveitar relatório anterior</Button><Button color="gray" onClick={() => setPreview(draft)}><Eye className="w-4 h-4" />Visualizar relatório</Button><Button color="gray" onClick={() => setHistory(true)}><History className="w-4 h-4" />Histórico e versões</Button></div>
   {draft.status === 'Devolvido para ajuste' && <div className="fr-notice"><strong>Devolvido: {draft.returnReason}</strong><p>{kind === 'DOR008' ? 'Apenas infrações, notificações e desdobramentos podem ser corrigidos pelo autor. Política RFA provisória documentada.' : 'Todos os campos estão liberados exclusivamente ao técnico autor até o reenvio.'}</p></div>}
   <div className="fr-form-layout">
    <aside className="fr-form-sidebar" aria-label="Índice de seções">
     <div className="fr-sidebar-header"><h2>Seções do Relatório</h2></div>
     <nav className="fr-section-nav-list" aria-label="Navegação interna do formulário">
      {sectionItems.map(item => {
       const isActive = activeSection === item.id;
       const err = hasSectionError(item.id);
       return (
        <a key={item.id} href={`#${item.id}`} onClick={e => scrollToSection(item.id, e)} className={`fr-section-nav-link ${isActive ? 'active' : ''}`} aria-current={isActive ? 'location' : undefined}>
         <span className="min-w-0 leading-snug text-left break-words line-clamp-2">{item.label}</span>
         {err && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Seção com pendência" />}
        </a>
       );
      })}
     </nav>
    </aside>
    <div className="fr-form-main">
     <div className="fr-mobile-section-nav" aria-label="Navegação rápida de seções">
      <label htmlFor="mobile-section-select" className="text-xs font-semibold text-slate-700 dark:text-slate-200 shrink-0">Ir para seção:</label>
      <div className="flex-1 min-w-0"><InputWrapper suffixIcon={ChevronDown} className="h-9 min-h-[36px] bg-white dark:bg-slate-800"><select id="mobile-section-select" className="w-full h-9 min-h-[36px] bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 pl-3 pr-8 rounded-lg outline-none cursor-pointer appearance-none truncate" value={activeSection} onChange={e => scrollToSection(e.target.value)} aria-label="Ir para a seção do formulário">
       {sectionItems.map(item => <option key={item.id} value={item.id} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">{item.label}</option>)}
      </select></InputWrapper></div>
     </div>
     {!!Object.keys(errors).length && <div id="report-errors" tabIndex={-1} role="alert" className="fr-notice"><h2>Confira os campos antes de finalizar</h2>{kind === 'DOR009' && <p>{legend(kind, 24)}</p>}<ul className="fr-error-list">{Object.entries(errors).map(([key, value]) => <li key={key}><button type="button" className="underline text-left" onClick={() => focusError(key)}>{value}</button></li>)}</ul></div>}
     {kind === 'DOR008' ? <RfaForm /> : <RaeForm />}
     <div className="fr-footer">{actor.role === 'gestor' && draft.status === 'Finalizado' && <Button disabled={busy || dirty} onClick={() => setConfirmAction('return')}><RotateCcw className="w-4 h-4" />Devolver para ajuste</Button>}{actor.id === draft.authorId && actor.role === 'tecnico' && draft.status !== 'Finalizado' && <><Button color="danger" outlined disabled={busy || draft.status !== 'Rascunho'} onClick={() => setConfirmAction('delete')}><Trash2 className="w-4 h-4" />Excluir rascunho</Button><Button color="gray" disabled={busy} onClick={() => void run({ action: 'save', report: draft, expectedRevision: saved?.revision || 0 })}><Save className="w-4 h-4" />{busy ? 'Salvando…' : 'Salvar rascunho'}</Button><Button disabled={busy} onClick={validate}><Send className="w-4 h-4" />Finalizar relatório</Button></>}{draft.status === 'Finalizado' && <p className="fr-hint">{message(kind, kind === 'DOR008' ? 21 : 28)}</p>}</div>
    </div>
   </div>
  </>}

  {newChoice && <Modal title={`Iniciar novo ${SHORT[kind]}`} onClose={() => setNewChoice(false)} footer={<Button color="gray" onClick={() => setNewChoice(false)}>Cancelar</Button>}><p>Deseja aproveitar os dados de um relatório existente? As duas opções iniciam um novo rascunho, sem número definitivo.</p><Button onClick={() => void create()}>Formulário em branco</Button><Button color="gray" onClick={() => { setNewChoice(false); setReuse('new'); }}>Aproveitar relatório existente</Button></Modal>}
  {reuse && <ReportLookup kind={kind} reports={eligible.filter(r => reuse === 'new' || r.id !== activeId)} onClose={() => setReuse(null)} onImport={(source, fields) => { if (reuse === 'new') void create(source, fields); else if (draft) { setDraft(importSelected(draft, source, fields)); setReuse(null); setNotice('Dados fictícios importados seletivamente. Confira a origem e salve o rascunho.'); } }} />}
  {discard && <Confirm title="Alterações não salvas" text="Deseja descartar as alterações em edição e continuar? A última versão salva será mantida." onCancel={() => setDiscard(null)} onConfirm={() => { dirtyRef.current = false; const action = discard; setDiscard(null); action(); }} />}
  {confirmAction === 'finalize' && draft && <Confirm title={draft.status === 'Devolvido para ajuste' ? 'Validar e reenviar ajustes' : 'Finalizar relatório'} text={message(kind, 18) + ' Operação apenas demonstrativa; sem encaminhamento real.'} onCancel={() => setConfirmAction(null)} onConfirm={() => void run({ action: 'finalize', report: draft, expectedRevision: saved!.revision })} />}
  {confirmAction === 'delete' && draft && <Confirm title="Excluir rascunho" text={message(kind, 4)} danger onCancel={() => setConfirmAction(null)} onConfirm={() => void run({ action: 'delete', id: draft.id, expectedRevision: saved!.revision })} />}
  {confirmAction === 'return' && draft && <Modal title="Devolver para ajuste" onClose={() => setConfirmAction(null)} footer={<><Button color="gray" onClick={() => setConfirmAction(null)}>Cancelar</Button><Button disabled={!returnReason.trim() || busy} onClick={() => void run({ action: 'return', id: draft.id, expectedRevision: saved!.revision, reason: returnReason })}>Confirmar devolução demonstrativa</Button></>}><Field label="Motivo/contexto da devolução" value={returnReason} onChange={setReturnReason} multiline required /><p className="fr-hint">Nenhuma notificação real será enviada. O motivo contextual é demonstrativo e não cria regra institucional de aprovação.</p></Modal>}
  {history && draft && <Modal title="Histórico e versões do relatório" wide onClose={() => setHistory(false)}><h3>Eventos locais registrados</h3>{draft.audit.map(e => <div className="fr-item" key={e.id}><strong>{e.action}</strong><p>{e.actor} · {new Date(e.at).toLocaleString('pt-BR')} · revisão {e.revision}</p><p>{e.detail}</p></div>)}<h3>Versões finalizadas</h3>{!draft.versions.length && <p>O rascunho ainda não possui versão finalizada.</p>}{draft.versions.map(v => <div className="fr-item" key={v.version}><strong>Versão {v.version}</strong><p>{new Date(v.at).toLocaleString('pt-BR')}</p><Button color="gray" onClick={() => { setHistory(false); setPreview({ ...draft, status: 'Finalizado', version: v.version, finalizedAt: v.at, updatedAt: v.at, content: v.content } as Report); }}>Visualizar versão {v.version}</Button></div>)}</Modal>}
  {preview && <ReportDocument report={preview} onClose={() => setPreview(null)} />}
 </div>;
 return draft && !accessDenied ? <EditorContext.Provider value={{ report: draft, actor, errors, change, notice: setNotice }}>{body}</EditorContext.Provider> : body;
}
export function RfaPage() { return <ReportWorkspace kind="DOR008" />; }
export function RaePage() { return <ReportWorkspace kind="DOR009" />; }
