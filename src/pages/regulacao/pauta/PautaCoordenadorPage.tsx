import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button, DocumentExplorer } from '@/components/filament';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PAUTA_PROCESSOS, downloadPauta, pautaPdf, pautaParecerAtual } from '@/data/pautaCoordenador';
import { canOpen, PROFILES, type ProfileId, type PautaMode } from '@/data/pautaTecnica';
import { pautaDocumentos } from '@/data/pautaDocumentos';
import { pautaZip } from '@/data/pautaExportacao';
import { DocumentCommands, DocumentCommandState } from './DocumentCommands';
import { PautaArea } from './PautaArea';
import { ValidacaoTecnica, ValidacaoDraft } from './ValidacaoTecnica';
import './pautaCoordenador.css';

const STORAGE = 'inema.pauta-coordenador.rascunhos.v1';
const PROFILE_STORAGE = 'inema.pauta.perfil-demonstrativo.v1';
function readProfile(): ProfileId {
  try { const value = sessionStorage.getItem(PROFILE_STORAGE); return value === null ? 'compatibilidade' : PROFILES.find(p => p.id === value)?.id || 'sem-acesso'; } catch { return 'sem-acesso'; }
}
const emptyDraft = (): ValidacaoDraft => ({ notes: '', step: 1 });
function readDrafts(): Record<string, ValidacaoDraft> {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE) || '{}');
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    return Object.fromEntries(Object.entries(raw).filter(([id, d]) => PAUTA_PROCESSOS.some(p => p.id === id) && d && typeof d === 'object' && typeof d.notes === 'string' && d.notes.length <= 4000 && Number.isInteger(d.step) && d.step >= 1 && d.step <= 3));
  } catch { return {}; }
}
function locationState() {
  const params = new URLSearchParams(window.location.search), view = params.get('pauta-tela');
  return { view: view === 'validacao' || view === 'documentos' ? view : 'pauta', id: params.get('processo') || 'p03', doc: params.get('documento') || '', mode: (params.get('pauta-modo') === 'validation' || !params.has('pauta-modo') ? 'validation' : 'view') as PautaMode };
}
export function PautaCoordenadorPage({ onImmersiveChange }: { onImmersiveChange?: (immersive: boolean) => void }) {
  const [profile, setProfile] = useState<ProfileId>(readProfile);
  const [route, setRoute] = useState(locationState); const [saved, setSaved] = useState(readDrafts); const [drafts, setDrafts] = useState<Record<string, ValidacaoDraft>>(() => readDrafts());
  const [viewSteps, setViewSteps] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState(['processo-pai', 'processo-filho', 'outros']); const [history, setHistory] = useState(false); const [confirm, setConfirm] = useState(false); const [feedback, setFeedback] = useState(''); const [pdfUrl, setPdfUrl] = useState('');
  const [events, setEvents] = useState<Record<string, string[]>>({}); const focusRoot = useRef<HTMLDivElement>(null); const historyTrigger = useRef<HTMLElement | null>(null);
  const [commandStates, setCommandStates] = useState<Record<string, DocumentCommandState>>({});
  const [searchRequest, setSearchRequest] = useState(0); const lastDocument = useRef<Record<string, string>>({});
  const [documentEntry, setDocumentEntry] = useState<'tree' | 'document'>(() => locationState().doc ? 'document' : 'tree');
  const processo = PAUTA_PROCESSOS.find(p => p.id === route.id); const draft = drafts[route.id] || emptyDraft();
  const allowed = !!processo && canOpen(processo, profile, route.mode);
  const canEdit = allowed && route.mode === 'validation';
  const shownDraft = route.mode === 'view' ? { ...(saved[route.id] || emptyDraft()), step: viewSteps[route.id] || 1 } : draft;
  const dirty = canEdit && route.view !== 'pauta' && draft.notes !== (saved[route.id]?.notes || '');
  const tree = useMemo(() => processo ? pautaDocumentos(processo) : { nodes: [], documents: [] }, [processo]);
  const doc = tree.documents.find(d => d.id === route.doc);
  const immersive = route.view === 'documentos' && allowed;
  const commandState = commandStates[route.id] || {};
  useEffect(() => { try { sessionStorage.setItem(PROFILE_STORAGE, profile); } catch { /* In-memory permissions remain restrictive. */ } }, [profile]);
  useEffect(() => { setHistory(false); setConfirm(false); }, [route.id, route.mode, profile]);
  useEffect(() => { onImmersiveChange?.(immersive); }, [immersive, onImmersiveChange]);
  useEffect(() => { if (route.view === 'documentos' && route.doc) lastDocument.current[route.id] = route.doc; }, [route.view, route.id, route.doc]);
  const pdfLines = doc ? doc.pages.map(lines => [doc.title, `Processo: ${doc.process}`, ...lines]) : [];
  useEffect(() => {
    if (!doc || doc.state) { setPdfUrl(''); return; }
    const url = URL.createObjectURL(pautaPdf(pdfLines)); setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [route.id, route.doc]);
  useEffect(() => { const listener = () => setRoute(locationState()); window.addEventListener('popstate', listener); return () => window.removeEventListener('popstate', listener); }, []);
  useEffect(() => { if (route.view !== 'pauta') focusRoot.current?.querySelector<HTMLElement>('h1')?.focus(); }, [route.view, route.id, route.mode]);
  useEffect(() => { if (!dirty) return; const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);
  const navigate = (view: string, id = route.id, document?: string, replace = false, mode: PautaMode = route.mode) => {
    const url = new URL(window.location.href); url.searchParams.set('pauta-tela', view);
    if (view === 'pauta') { url.searchParams.delete('processo'); url.searchParams.delete('documento'); url.searchParams.delete('pauta-modo'); }
    else { url.searchParams.set('pauta-modo', mode); url.searchParams.set('processo', id); const selected = view === 'documentos' ? document ?? lastDocument.current[id] ?? '' : ''; selected ? url.searchParams.set('documento', selected) : url.searchParams.delete('documento'); }
    window.history[replace ? 'replaceState' : 'pushState']({}, '', url); setRoute(locationState()); setFeedback('');
  };
  const changeDraft = (update: Partial<ValidacaoDraft>) => { if (!canEdit) return; setDrafts(prev => ({ ...prev, [route.id]: { ...(prev[route.id] || emptyDraft()), ...update } })); };
  const save = (notes = draft.notes) => {
    if (!canEdit) return false;
    const next = { ...saved, [route.id]: { ...draft, notes, savedAt: new Date().toISOString() } };
    try { localStorage.setItem(STORAGE, JSON.stringify(next)); setSaved(next); changeDraft({ notes }); setEvents(e => ({ ...e, [route.id]: [...(e[route.id] || []), `Rascunho salvo localmente em ${new Date().toLocaleString('pt-BR')}`] })); setFeedback('Rascunho salvo neste navegador. Nenhuma decisão ou tramitação foi realizada.'); return true; }
    catch { setFeedback('Não foi possível salvar: o armazenamento do navegador está indisponível. Suas anotações continuam abertas.'); return false; }
  };
  const availableDocuments = tree.documents.filter(document => !document.state);
  const processPdf = () => pautaPdf(availableDocuments.flatMap(document => document.pages.map(lines => [document.title, `Processo: ${document.process}`, ...lines])));
  const exportZip = async () => {
    if (!processo) return;
    const files = availableDocuments.map(document => ({ name: `${document.id}.pdf`, content: pautaPdf(document.pages.map(lines => [document.title, `Processo: ${document.process}`, ...lines])) }));
    const index = { demonstrativo: true, processo: processo.numero, documentos: tree.documents.map(document => ({ titulo: document.title, arquivo: document.state ? null : `${document.id}.pdf`, disponibilidade: document.state || 'local' })) };
    files.push({ name: 'indice.json', content: new Blob([JSON.stringify(index, null, 2)], { type: 'application/json' }) });
    files.push({ name: 'LEIA-ME.txt', content: new Blob(['DEMONSTRACAO SEM VALIDADE LEGAL. Somente documentos locais ficticios. Documentos restritos, indisponiveis ou sem previa nao estao incluidos. Nenhuma consulta aos autos oficiais ou ao SEI.']) });
    downloadPauta(await pautaZip(files), `processo-${processo.numero.replace('/', '-')}-demonstrativo.zip`);
    setFeedback('ZIP demonstrativo baixado com os PDFs locais disponíveis e seu índice. Não contém autos oficiais.');
  };
  const back = () => dirty ? setConfirm(true) : navigate('pauta');
  return <div className={`pauta-padronizacao${immersive ? ' pauta-immersive' : route.view === 'validacao' ? ' pauta-validation-view' : ''}`} ref={focusRoot}>
    {!immersive && <div className="pd-prototype-note">Protótipo navegável · dados fictícios · sem integração com o SEI</div>}
    <div hidden={route.view !== 'pauta'}><PautaArea profile={profile} onProfileChange={setProfile} onOpen={(p, mode) => { if (!canOpen(p, profile, mode)) return; setExpanded(['processo-pai', 'processo-filho', 'outros']); navigate('validacao', p.id, undefined, false, mode); }} /></div>
    {route.view !== 'pauta' && processo && !allowed && <div className="pd-empty" role="alert"><h1 tabIndex={-1}>Acesso ao fluxo não concedido</h1><p>O cenário demonstrativo não autoriza este processo ou o modo solicitado. A URL não concede permissão de edição.</p><Button onClick={() => navigate('pauta')}>Voltar à Pauta</Button></div>}
    {route.view !== 'pauta' && !processo && <div className="pd-empty" role="alert"><h1 tabIndex={-1}>Processo não encontrado</h1><p>O identificador informado não pertence aos dados demonstrativos.</p><Button onClick={() => navigate('pauta')}>Voltar à Pauta</Button></div>}
    {route.view === 'validacao' && processo && allowed && <ValidacaoTecnica key={`${route.id}-${route.mode}`} mode={route.mode} processo={processo} draft={shownDraft} onChange={notes => changeDraft({ notes })} onStep={step => { const next = Math.min(3, Math.max(1, step)); if (route.mode === 'view') setViewSteps(steps => ({ ...steps, [route.id]: next })); else changeDraft({ step: next }); }} onSave={() => { save(); }} onBack={back} onHistory={() => { historyTrigger.current = document.activeElement as HTMLElement; setHistory(true); }} onDocuments={id => { if (id === 'parecer' && !pautaParecerAtual(processo)) { setFeedback('Parecer da análise atual indisponível nos dados demonstrativos deste processo.'); return; } setDocumentEntry(id ? 'document' : 'tree'); navigate('documentos', processo.id, id); }} onDownload={() => { downloadPauta(pautaPdf(['Resumo demonstrativo do processo', `Processo: ${processo.numero}`, `Requerente: ${processo.requerente}`, `Empreendimento: ${processo.empreendimento}`, `Ato: ${processo.ato}`, `Situacao: ${processo.status}`, '', 'Indice documental:', ...tree.documents.map(d => d.title), '', 'Este resumo nao e copia integral de autos nem documento oficial.']), `processo-${processo.numero.replace('/', '-')}-demonstrativo.pdf`); setFeedback('Resumo demonstrativo do processo baixado em PDF. Os autos oficiais não são consultados.'); }} />}
    {route.view === 'documentos' && processo && allowed && <>
      <header className="pd-immersive-heading"><Button color="gray" size="sm" onClick={() => navigate('validacao')}><ArrowLeft className="w-4 h-4" />{route.mode === 'view' ? 'Voltar à Visualização' : 'Voltar à Validação'}</Button><div><h1 tabIndex={-1}>Explorador Documental <span>Processo <span className="font-mono">{processo.numero}</span></span></h1><p>{processo.empreendimento}{commandState.marker ? ` · ${commandState.marker}` : ''}</p></div><span className="pd-demonstration-label">{route.mode === 'view' ? 'Somente leitura · demonstração' : 'Ambiente demonstrativo'}</span></header>
      {route.doc === 'parecer' && !pautaParecerAtual(processo) && <p className="pd-feedback" role="status">Parecer da análise atual indisponível nos dados demonstrativos deste processo. Selecione outro documento na árvore.</p>}
      <DocumentCommands key={`${route.id}-${route.mode}`} readOnly={!canEdit} state={commandState} onChange={update => { if (canEdit) setCommandStates(states => ({ ...states, [route.id]: { ...states[route.id], ...update } })); }} notes={shownDraft.notes} onSaveNotes={save} onPdf={() => { downloadPauta(processPdf(), `processo-${processo.numero.replace('/', '-')}-documentos-demonstrativos.pdf`); setFeedback('PDF demonstrativo gerado com os documentos locais disponíveis. Não inclui autos oficiais.'); }} onZip={exportZip} onSearch={() => setSearchRequest(value => value + 1)} onFeedback={setFeedback} />
      <div className="pd-document-workspace"><DocumentExplorer immersive initialPane={documentEntry} searchRequest={searchRequest} nodes={tree.nodes} expandedIds={expanded} onExpandedChange={setExpanded} selectedId={route.doc} onSelect={id => navigate('documentos', route.id, id, true)} document={doc ? { ...doc, pdfSource: 'generated', pdfUrl: pdfUrl || undefined, onDownload: () => { downloadPauta(pautaPdf(pdfLines), `${doc.id}-${processo.numero.replace('/', '-')}-demonstrativo.pdf`); setFeedback('PDF demonstrativo baixado. Documento fictício, sem validade legal.'); } } : undefined} /></div>
    </>}
    {(immersive || feedback) && <p className={`pd-feedback${immersive ? ' pd-document-status' : ''}`} role="status">{feedback || (commandState.documentType ? `Tipo escolhido: ${commandState.documentType}. Seleção demonstrativa; nenhum documento foi criado.` : 'Consulta local com dados fictícios · sem conexão com o SEI')}</p>}
    <Dialog open={history} onOpenChange={setHistory}><DialogContent onCloseAutoFocus={event => { event.preventDefault(); if (historyTrigger.current?.isConnected) historyTrigger.current.focus(); }}><DialogTitle>Histórico de Ações — {processo?.numero}</DialogTitle><DialogDescription>Eventos desta demonstração. Nenhuma consulta ao histórico oficial.</DialogDescription><ol className="pd-history"><li>Formação do processo — dado fictício de referência.</li><li>Situação atual: {processo?.status}.</li>{(events[route.id] || []).map((e, i) => <li key={i}>{e}</li>)}</ol><Button color="gray" onClick={() => setHistory(false)}>Fechar histórico</Button></DialogContent></Dialog>
    <Dialog open={canEdit && confirm} onOpenChange={setConfirm}><DialogContent><DialogTitle>Anotações não salvas</DialogTitle><DialogDescription>As alterações deste processo ainda não foram salvas neste navegador.</DialogDescription><div className="pd-dialog-actions"><Button color="gray" onClick={() => setConfirm(false)}>Continuar editando</Button><Button color="gray" onClick={() => { setDrafts(prev => ({ ...prev, [route.id]: saved[route.id] || emptyDraft() })); setConfirm(false); navigate('pauta'); }}>Descartar e voltar</Button></div></DialogContent></Dialog>
  </div>;
}
