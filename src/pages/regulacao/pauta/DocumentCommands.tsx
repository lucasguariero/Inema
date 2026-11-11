import React, { useRef, useState } from 'react';
import { FilePlus2, FolderPlus, FilePenLine, Binoculars, BadgeCheck, Send, ListPlus, UserRoundPlus, Star, Copy, Mail, Workflow, Boxes, Network, StickyNote, CirclePause, Paperclip, CircleCheckBig, FileDown, Archive, MessageSquareText, Tags, CalendarClock, ListChecks, Search, Sparkles } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { Button, InputWrapper } from '@/components/filament';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { foldPauta } from '@/data/pautaCoordenador';
import './documentCommands.css';

export const DOCUMENT_TYPES = ['Externo', 'Análise de Risco', 'Comunicação Interna', 'Despacho', 'Documento de Formalização da Demanda (DFD)', 'Estudo Técnico Preliminar (ETP)', 'Justificativa', 'Mapa Comparativo de Preços'];
export const PROCESS_COMMANDS = [
  { label: 'Novo documento', icon: FilePlus2, detail: 'Escolher um tipo documental local. Nenhum documento oficial é criado.', local: true },
  { label: 'Iniciar processo relacionado', icon: FolderPlus, detail: 'Indisponível: iniciar processo oficial exige integração e permissões do SEI.' },
  { label: 'Consultar/alterar processo', icon: FilePenLine, detail: 'Indisponível: alterar o cadastro oficial exige integração e permissões do SEI.' },
  { label: 'Acompanhamento especial', icon: Binoculars, detail: 'Marcar acompanhamento somente nesta consulta demonstrativa.', local: true },
  { label: 'Ciência', icon: BadgeCheck, detail: 'Indisponível: registrar ciência oficial exige autenticação no SEI.' },
  { label: 'Enviar processo', icon: Send, detail: 'Indisponível: envio e tramitação dependem do SEI real.' },
  { label: 'Atualizar andamento', icon: ListPlus, detail: 'Indisponível: o andamento oficial depende do SEI real.' },
  { label: 'Atribuir processo', icon: UserRoundPlus, detail: 'Indisponível: atribuição oficial exige usuários e permissões do SEI.' },
  { label: 'Adicionar aos favoritos', icon: Star, detail: 'Alternar favorito local nesta consulta; não altera o SEI.', local: true },
  { label: 'Duplicar processos', icon: Copy, detail: 'Indisponível: duplicação de autos exige o SEI real.' },
  { label: 'Enviar correspondência eletrônica', icon: Mail, detail: 'Indisponível: o protótipo não envia mensagens ou correspondências.' },
  { label: 'Relacionamentos do processo', icon: Workflow, detail: 'Indisponível: gerir relacionamentos oficiais exige o SEI. A árvore mostra apenas exemplos locais.' },
  { label: 'Incluir em bloco', icon: Boxes, detail: 'Indisponível: blocos oficiais dependem do SEI e das permissões da unidade.' },
  { label: 'Gerenciar envio para o SEI Federação', icon: Network, detail: 'Indisponível: não há conexão com o SEI Federação.' },
  { label: 'Anotações', icon: StickyNote, detail: 'Editar as anotações de consulta e salvar no rascunho local da validação.', local: true },
  { label: 'Sobrestar processo', icon: CirclePause, detail: 'Indisponível: sobrestamento tem efeito administrativo e exige o SEI.' },
  { label: 'Anexar processo', icon: Paperclip, detail: 'Indisponível: anexação oficial depende do SEI e não será simulada como concluída.' },
  { label: 'Concluir processo', icon: CircleCheckBig, detail: 'Indisponível: conclusão oficial exige o SEI e não será simulada como concluída.' },
  { label: 'Gerar arquivo PDF', icon: FileDown, detail: 'Baixar PDF demonstrativo dos documentos locais disponíveis. Não inclui autos oficiais.', local: true },
  { label: 'Gerar arquivo ZIP do processo', icon: Archive, detail: 'Baixar ZIP dos PDFs locais disponíveis e seu índice demonstrativo.', local: true },
  { label: 'Comentários', icon: MessageSquareText, detail: 'Registrar um comentário local, mantido apenas enquanto esta consulta estiver aberta.', local: true },
  { label: 'Gerenciar marcador', icon: Tags, detail: 'Escolher um marcador demonstrativo de consulta. Não altera classificações oficiais.', local: true },
  { label: 'Controle de prazos', icon: CalendarClock, detail: 'Indisponível: cálculo e gestão de prazos oficiais dependem das regras e dos dados do SEI.' },
  { label: 'Controle de processos', icon: ListChecks, detail: 'Indisponível: o controle oficial da unidade depende do SEI.' },
  { label: 'Pesquisar no processo', icon: Search, detail: 'Pesquisar títulos na árvore dos documentos locais deste processo.', local: true },
  { label: 'Inteligência Artificial', icon: Sparkles, detail: 'Indisponível: nenhum serviço de inteligência artificial está conectado; nenhum documento será enviado.' },
];
export interface DocumentCommandState { documentType?: string; following?: boolean; favorite?: boolean; comment?: string; marker?: string }
interface Props {
  readOnly?: boolean; state: DocumentCommandState; onChange: (update: Partial<DocumentCommandState>) => void;
  notes: string; onSaveNotes: (value: string) => boolean; onPdf: () => void; onZip: () => Promise<void>;
  onSearch: () => void; onFeedback: (message: string) => void;
}
export function DocumentCommands({ readOnly = false, state, onChange, notes, onSaveNotes, onPdf, onZip, onSearch, onFeedback }: Props) {
  const [panel, setPanel] = useState(''); const [query, setQuery] = useState(''); const [text, setText] = useState('');
  const [focusIndex, setFocusIndex] = useState(0); const [exporting, setExporting] = useState(false);
  const [noteError, setNoteError] = useState(false);
  const toolbar = useRef<HTMLDivElement>(null);
  const blocked = (index: number) => readOnly && [0, 3, 8, 14, 20, 21].includes(index);
  const invoke = (index: number) => {
    if (!PROCESS_COMMANDS[index].local || blocked(index)) return;
    if (index === 0) { setQuery(''); setPanel('types'); }
    if (index === 3) { onChange({ following: !state.following }); onFeedback(state.following ? 'Acompanhamento local removido.' : 'Acompanhamento marcado somente nesta consulta.'); }
    if (index === 8) { onChange({ favorite: !state.favorite }); onFeedback(state.favorite ? 'Favorito local removido.' : 'Favorito marcado somente nesta consulta.'); }
    if (index === 14) { setText(notes); setNoteError(false); setPanel('notes'); }
    if (index === 18) onPdf();
    if (index === 19 && !exporting) { setExporting(true); void onZip().catch(() => onFeedback('Não foi possível gerar o ZIP local. Os documentos continuam disponíveis no leitor.')).finally(() => setExporting(false)); }
    if (index === 20) { setText(state.comment || ''); setPanel('comments'); }
    if (index === 21) setPanel('marker');
    if (index === 24) onSearch();
  };
  const command = (index: number) => {
    const item = PROCESS_COMMANDS[index], Icon = item.icon;
    const detail = blocked(index) ? 'Indisponível no modo somente leitura.' : item.detail;
    const pressed = index === 3 ? !!state.following : index === 8 ? !!state.favorite : undefined;
    const button = <Button color="gray" size="icon" className="pd-command" data-command={index + 1} aria-label={item.label}
      aria-disabled={blocked(index) || !item.local || (index === 19 && exporting)} aria-pressed={pressed}
      aria-expanded={index === 0 ? panel === 'types' : undefined} aria-haspopup={[0, 14, 20, 21].includes(index) ? 'dialog' : undefined}
      aria-busy={index === 19 && exporting} tabIndex={focusIndex === index ? 0 : -1}
      title={`${item.label} — ${detail}`} onFocus={() => setFocusIndex(index)} onClick={() => invoke(index)}><Icon aria-hidden="true" /></Button>;
    return <Tooltip key={item.label}><TooltipTrigger asChild>{index === 0 ? <Popover.Anchor asChild>{button}</Popover.Anchor> : button}</TooltipTrigger><TooltipContent side="bottom" className="pd-command-tooltip">{item.label} — {item.detail}</TooltipContent></Tooltip>;
  };
  return <>
    <TooltipProvider delayDuration={250} skipDelayDuration={100} disableHoverableContent>
      <Popover.Root open={!readOnly && panel === 'types'} onOpenChange={open => { if (!open) setPanel(''); }}>
        <div className="pd-process-toolbar" role="toolbar" aria-label="Comandos do processo" aria-orientation="horizontal" ref={toolbar} onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
          const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-command]'); if (!button) return;
          event.preventDefault(); const i = Number(button.dataset.command) - 1;
          const count = PROCESS_COMMANDS.length;
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : (i + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + count) % count;
          toolbar.current?.querySelector<HTMLButtonElement>(`[data-command="${next + 1}"]`)?.focus();
        }}>
          {PROCESS_COMMANDS.map((_, i) => command(i))}
        </div>
        <p className="pd-command-help">{readOnly ? 'Somente leitura: comandos de alteração indisponíveis. Demais comandos em cinza dependem de serviços externos.' : 'Comandos em cinza dependem de serviços externos.'}</p>
        <Popover.Portal><Popover.Content role="dialog" aria-label="Novo documento" className="pd-document-types" align="start" sideOffset={6} collisionPadding={12} onCloseAutoFocus={event => { event.preventDefault(); toolbar.current?.querySelector<HTMLButtonElement>('[data-command="1"]')?.focus(); }}>
          <h2>Novo documento</h2><p>Escolha um tipo para demonstração. Nenhum documento institucional será criado.</p>
          <InputWrapper prefixIcon={Search}><input type="search" aria-label="Pesquisar tipo documental" placeholder="Pesquisar tipo documental..." value={query} onChange={e => setQuery(e.target.value)} /></InputWrapper>
          <div role="listbox" aria-label="Tipos documentais" className="pd-document-type-list">{DOCUMENT_TYPES.filter(type => foldPauta(type).includes(foldPauta(query.trim()))).map(type => <button key={type} role="option" aria-selected={state.documentType === type} onClick={() => { if (readOnly) return; onChange({ documentType: type }); setPanel(''); onFeedback(`Tipo escolhido: ${type}. Seleção demonstrativa; nenhum documento foi criado.`); }}>{type}</button>)}</div>
          {!DOCUMENT_TYPES.some(type => foldPauta(type).includes(foldPauta(query.trim()))) && <p role="status">Nenhum tipo encontrado. Altere ou limpe a busca.</p>}
          <Button color="gray" size="sm" onClick={() => setPanel('')}>Voltar ao explorador</Button>
        </Popover.Content></Popover.Portal>
      </Popover.Root>
    </TooltipProvider>
    <Dialog open={!readOnly && ['notes', 'comments', 'marker'].includes(panel)} onOpenChange={open => { if (!open) setPanel(''); }}><DialogContent className="pd-document-command-dialog" onCloseAutoFocus={event => { event.preventDefault(); toolbar.current?.querySelector<HTMLButtonElement>(`[data-command="${focusIndex + 1}"]`)?.focus(); }}>
      <DialogTitle>{panel === 'notes' ? 'Anotações de consulta' : panel === 'comments' ? 'Comentários locais' : 'Marcador demonstrativo'}</DialogTitle>
      <DialogDescription>{panel === 'notes' ? 'Mesmo rascunho local da validação. Não envia manifestação nem registra decisão.' : 'Somente nesta consulta aberta. Não altera registros ou classificações no SEI.'}</DialogDescription>
      {panel === 'marker' ? <div className="pd-marker-options">{['Sem marcador', 'Em consulta — exemplo', 'Conferir documentos — exemplo'].map(marker => <Button key={marker} color="gray" aria-pressed={(state.marker || 'Sem marcador') === marker} onClick={() => { if (readOnly) return; onChange({ marker: marker === 'Sem marcador' ? '' : marker }); setPanel(''); onFeedback(`Marcador local: ${marker}.`); }}>{marker}</Button>)}</div> : <><InputWrapper label={panel === 'notes' ? 'Anotações de consulta' : 'Comentário local'}><textarea aria-label={panel === 'notes' ? 'Anotações de consulta' : 'Comentário local'} rows={4} maxLength={4000} value={text} onChange={e => setText(e.target.value)} /></InputWrapper>{noteError && panel === 'notes' && <p role="alert">O armazenamento do navegador está indisponível. Copie suas anotações ou tente novamente; elas continuam neste campo.</p>}<div className="pd-dialog-actions"><Button color="gray" onClick={() => setPanel('')}>Cancelar</Button><Button onClick={() => { if (readOnly) return; if (panel === 'notes') { if (onSaveNotes(text)) setPanel(''); else setNoteError(true); } else { onChange({ comment: text }); onFeedback('Comentário mantido nesta consulta, sem publicação no SEI.'); setPanel(''); } }}>{panel === 'notes' ? 'Salvar rascunho local' : 'Manter nesta consulta'}</Button></div></>}
      {panel === 'marker' && <Button color="gray" onClick={() => setPanel('')}>Voltar ao explorador</Button>}
    </DialogContent></Dialog>
  </>;
}
