import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Printer, Search, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, PanelLeft, PanelLeftClose, FileText, RotateCcw, MoveHorizontal, Maximize, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputWrapper } from './InputWrapper';
import { ProcessTree, ProcessTreeNode } from './ProcessTree';
import { DocumentPaper } from './DocumentPaper';
import './documentExplorer.css';

export interface ExplorerDocument { id: string; title: string; process: string; kind: string; pages: string[][]; state?: 'restricted' | 'unavailable' | 'unsupported'; pdfUrl?: string; pdfSource?: 'generated' | 'original'; onDownload?: () => void }
export interface DocumentExplorerProps {
  nodes: ProcessTreeNode[]; selectedId: string; onSelect: (id: string) => void; document?: ExplorerDocument;
  expandedIds: string[]; onExpandedChange: (ids: string[]) => void;
  immersive?: boolean; searchRequest?: number; initialPane?: 'tree' | 'document';
}
const A4_WIDTH = 210 * 96 / 25.4, A4_HEIGHT = 297 * 96 / 25.4;
export function DocumentExplorer(props: DocumentExplorerProps) {
  const [mobileDocument, setMobileDocument] = useState(props.initialPane ? props.initialPane === 'document' : !!props.document);
  const [page, setPage] = useState(0), [zoom, setZoom] = useState(100), [fit, setFit] = useState<'width' | 'page' | 'manual'>('width');
  const [search, setSearch] = useState(''), [nativePdf, setNativePdf] = useState(() => !!props.document?.pdfUrl && props.document.pdfSource !== 'generated'), [textMode, setTextMode] = useState(false);
  const [retry, setRetry] = useState(false), [message, setMessage] = useState('');
  const [collapsed, setCollapsed] = useState(false), [ratio, setRatio] = useState(30), [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 }), [readerSize, setReaderSize] = useState({ width: A4_WIDTH, height: A4_HEIGHT });
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const root = useRef<HTMLDivElement>(null), navigation = useRef<HTMLElement>(null), scroll = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null), reopen = useRef<HTMLButtonElement>(null), frame = useRef<HTMLIFrameElement>(null);
  const wasCollapsed = useRef(false), id = useId(); const doc = props.document;
  const originalPdf = !!doc?.pdfUrl && doc.pdfSource !== 'generated';
  const available = doc && !doc.state, pages = doc?.pages ?? [];
  const pageScroll = !!props.immersive && viewport.width < 768;
  const minTree = Math.min(240, size.width * .35), maxTree = Math.max(minTree, Math.min(640, size.width * .45, size.width - 488));
  const treeWidth = Math.max(minTree, Math.min(maxTree, size.width * ratio / 100));
  const scale = textMode ? zoom / 100 : fit === 'manual' ? zoom / 100 : Math.max(.2, Math.min(2, readerSize.width / A4_WIDTH, fit === 'page' ? (pageScroll ? viewport.height - 24 : readerSize.height) / A4_HEIGHT : 2));
  const percent = Math.round(scale * 100);
  useEffect(() => {
    const resizeViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', resizeViewport);
    return () => window.removeEventListener('resize', resizeViewport);
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(entries => entries.forEach(entry => {
      const value = { width: entry.contentRect.width, height: entry.contentRect.height };
      if (entry.target === root.current) setSize(value); else setReaderSize(value);
    }));
    if (root.current) observer.observe(root.current); if (scroll.current) observer.observe(scroll.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { setPage(0); setZoom(100); setFit('width'); setSearch(''); setNativePdf(originalPdf); setTextMode(false); setRetry(false); setMessage(''); if (scroll.current) scroll.current.scrollTop = 0; }, [props.selectedId, originalPdf]);
  useEffect(() => { if (props.searchRequest) { setMobileDocument(false); setCollapsed(false); } }, [props.searchRequest]);
  useEffect(() => { if (props.searchRequest && !mobileDocument && !collapsed) navigation.current?.querySelector<HTMLInputElement>('input[type=search]')?.focus(); }, [props.searchRequest, mobileDocument, collapsed]);
  useEffect(() => {
    if (collapsed) reopen.current?.focus(); else if (wasCollapsed.current) navigation.current?.querySelector<HTMLInputElement>('input[type=search]')?.focus();
    wasCollapsed.current = collapsed;
  }, [collapsed]);
  const goPage = (index: number) => {
    const next = Math.max(0, Math.min(pages.length - 1, index)); setPage(next);
    const sheet = scroll.current?.querySelector<HTMLElement>(`[data-page="${next}"]`);
    if (sheet && scroll.current) {
      if (pageScroll) window.scrollTo({ top: window.scrollY + sheet.getBoundingClientRect().top - 12, behavior: 'instant' });
      else scroll.current.scrollTop += sheet.getBoundingClientRect().top - scroll.current.getBoundingClientRect().top - 12;
    }
  };
  useEffect(() => { if (!nativePdf && (!pageScroll || (scroll.current?.getBoundingClientRect().top ?? 1) <= 0)) goPage(page); }, [scale, textMode]);
  const updateVisiblePage = () => {
    if (nativePdf || !scroll.current) return;
    const sheets = Array.from(scroll.current.querySelectorAll<HTMLElement>('[data-page]'));
    let index = -1;
    if (pageScroll) {
      let largest = 0;
      sheets.forEach((sheet, i) => { const rect = sheet.getBoundingClientRect(); const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)); if (visible > largest) { largest = visible; index = i; } });
    } else {
      const top = scroll.current.getBoundingClientRect().top + 32;
      index = sheets.findIndex(sheet => sheet.getBoundingClientRect().bottom > top);
    }
    if (index >= 0) setPage(index);
  };
  useEffect(() => {
    if (!pageScroll) return;
    window.addEventListener('scroll', updateVisiblePage, { passive: true });
    return () => window.removeEventListener('scroll', updateVisiblePage);
  }, [pageScroll, nativePdf, props.selectedId]);
  const highlight = (line: string) => {
    if (!search.trim()) return line;
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return line.split(new RegExp(`(${escaped})`, 'gi')).map((part, i) => part.toLocaleLowerCase() === search.trim().toLocaleLowerCase() ? <mark key={i}>{part}</mark> : part);
  };
  const matches = search.trim() ? pages.flat().reduce((sum, line) => sum + line.toLocaleLowerCase().split(search.trim().toLocaleLowerCase()).length - 1, 0) : 0;
  const select = (nodeId: string) => {
    props.onSelect(nodeId);
    const find = (items: ProcessTreeNode[]): ProcessTreeNode | undefined => { for (const node of items) { if (node.id === nodeId) return node; const child = node.children && find(node.children); if (child) return child; } };
    if (!find(props.nodes)?.children) { setMobileDocument(true); window.requestAnimationFrame(() => title.current?.focus()); }
  };
  const resize = (pixels: number) => { if (size.width) setRatio(Math.max(minTree, Math.min(maxTree, pixels)) / size.width * 100); };
  const changeZoom = (delta: number) => { setZoom(Math.max(25, Math.min(200, percent + delta))); setFit('manual'); };
  const print = () => {
    if (originalPdf) {
      try { frame.current?.contentWindow?.focus(); frame.current?.contentWindow?.print(); }
      catch { setMessage('Use o comando de impressão do leitor PDF para imprimir o arquivo original.'); }
    } else { window.print(); }
  };
  return <div ref={root} className={`fi-document-explorer ${mobileDocument ? 'show-document' : ''} ${props.immersive ? 'is-immersive' : ''} ${collapsed ? 'is-tree-collapsed' : ''} ${dragging ? 'is-resizing' : ''}`} style={{ '--tree-width': size.width ? `${treeWidth}px` : '30%' } as React.CSSProperties}>
    <aside id={`${id}-tree`} ref={navigation} className="fi-explorer-navigation" aria-label="Navegação documental"><div className="fi-explorer-pane-title"><span>Processos e documentos</span>{props.immersive && <Button color="gray" size="icon" aria-label="Recolher árvore documental" title="Recolher árvore documental" onClick={() => setCollapsed(true)}><PanelLeftClose /></Button>}</div><ProcessTree {...props} onSelect={select} /></aside>
    {props.immersive && <div className="fi-explorer-splitter" role="separator" aria-label="Largura da árvore documental" aria-orientation="vertical" aria-controls={`${id}-tree ${id}-reader`} aria-valuemin={Math.round(minTree)} aria-valuemax={Math.round(maxTree)} aria-valuenow={Math.round(treeWidth)} aria-valuetext={`${Math.round(size.width ? treeWidth / size.width * 100 : 30)}% para a árvore`} tabIndex={0}
      onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); }}
      onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId) && root.current) resize(event.clientX - root.current.getBoundingClientRect().left); }}
      onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); setDragging(false); }} onLostPointerCapture={() => setDragging(false)}
      onKeyDown={event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'].includes(event.key)) return; event.preventDefault(); if (event.key === 'Enter') setRatio(30); else resize(event.key === 'Home' ? minTree : event.key === 'End' ? maxTree : treeWidth + (event.key === 'ArrowRight' ? 1 : -1) * (event.shiftKey ? 48 : 16)); }}><span /></div>}
    <section id={`${id}-reader`} className="fi-explorer-reader" aria-label="Leitor documental">
      <div className="fi-document-heading"><Button className="fi-tree-mobile-back" color="gray" size="sm" onClick={() => { setMobileDocument(false); setCollapsed(false); }}><PanelLeft className="w-4 h-4" />Árvore</Button>{props.immersive && collapsed && <Button ref={reopen} className="fi-tree-desktop-reopen" color="gray" size="sm" aria-label="Reabrir árvore documental" onClick={() => setCollapsed(false)}><PanelLeft />Árvore</Button>}<div><h2 ref={title} tabIndex={-1}>{doc?.title || 'Visualização do documento'}</h2><p>{doc ? `${doc.process} · ${doc.kind}` : 'Selecione um documento na árvore para consultar.'}</p></div></div>
      {available && <>
        <div className="fi-document-toolbar" role="toolbar" aria-label="Ferramentas do documento">
          <Button color="gray" size="icon" title="Diminuir zoom" aria-label="Diminuir zoom" disabled={percent <= 25 || nativePdf} onClick={() => changeZoom(-25)}><ZoomOut /></Button><output aria-label="Zoom do documento">{nativePdf ? 'PDF' : `${percent}%`}</output><Button color="gray" size="icon" title="Aumentar zoom" aria-label="Aumentar zoom" disabled={percent >= 200 || nativePdf} onClick={() => changeZoom(25)}><ZoomIn /></Button>
          <Button color="gray" size="icon" title="Página anterior" aria-label="Página anterior do documento" disabled={!page || nativePdf} onClick={() => goPage(page - 1)}><ChevronLeft /></Button><span aria-label="Página atual">{nativePdf ? 'Leitor PDF' : `${page + 1} / ${pages.length}`}</span><Button color="gray" size="icon" title="Próxima página" aria-label="Próxima página do documento" disabled={page >= pages.length - 1 || nativePdf} onClick={() => goPage(page + 1)}><ChevronRight /></Button>
          <Button color="gray" size="sm" disabled={nativePdf || textMode} aria-pressed={fit === 'width' && !textMode} onClick={() => setFit('width')}><MoveHorizontal />Ajustar à largura</Button><Button color="gray" size="sm" disabled={nativePdf || textMode} aria-pressed={fit === 'page' && !textMode} onClick={() => setFit('page')}><Maximize />Página inteira</Button>
          <Button color="gray" size="sm" disabled={nativePdf || !pages.length || originalPdf} aria-pressed={textMode} onClick={() => { setTextMode(value => !value); setZoom(100); setFit('width'); }}><AlignLeft />Texto acessível</Button>
          {doc.pdfUrl && <Button color="gray" size="sm" aria-pressed={nativePdf} disabled={originalPdf} onClick={() => setNativePdf(value => !value)}><FileText />{originalPdf ? 'PDF original' : nativePdf ? 'Leitura acessível' : 'Visualizar PDF'}</Button>}
          <Button color="gray" size="icon" title="Baixar documento" aria-label="Baixar documento" disabled={!doc.onDownload} onClick={doc.onDownload}><Download /></Button><Button color="gray" size="icon" title="Imprimir documento" aria-label="Imprimir documento" onClick={print}><Printer /></Button>
        </div>
        <div className="fi-document-search"><InputWrapper prefixIcon={Search}><input type="search" aria-label="Buscar no documento" placeholder="Buscar no texto do documento..." value={search} disabled={nativePdf} onChange={event => setSearch(event.target.value)} /></InputWrapper>{search.trim() && <span role="status">{matches} ocorrência(s){matches > 0 && <Button color="gray" size="xs" onClick={() => goPage(pages.findIndex(lines => lines.some(line => line.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))))}>Ir ao resultado</Button>}</span>}</div>
      </>}
      {message && <p className="fi-pdf-help" role="status">{message}</p>}
      <div className={`fi-document-scroll${pageScroll && !textMode && A4_WIDTH * scale > readerSize.width + 1 ? ' has-horizontal-pan' : ''}`} ref={scroll} onScroll={pageScroll ? undefined : updateVisiblePage}>
        {!doc && <div className="fi-document-empty"><FileText /><h3>Escolha um documento</h3><p>Expanda o processo e selecione um arquivo para visualizar seu conteúdo.</p></div>}
        {doc?.state && <div className="fi-document-empty" role="status"><FileText /><h3>{doc.state === 'restricted' ? 'Documento com acesso restrito' : doc.state === 'unsupported' ? 'Formato sem prévia disponível' : 'Documento indisponível'}</h3><p>{doc.state === 'restricted' ? 'Este é um exemplo de restrição. O protótipo não concede permissões de acesso.' : doc.state === 'unsupported' ? 'O formato deste arquivo não pode ser exibido neste leitor demonstrativo.' : retry ? 'O arquivo continua indisponível neste cenário demonstrativo. Selecione outro documento.' : 'Não foi possível carregar o arquivo demonstrativo.'}</p>{doc.state === 'unavailable' && <Button color="gray" size="sm" onClick={() => setRetry(true)}><RotateCcw />Tentar novamente</Button>}</div>}
        {available && (nativePdf || originalPdf ? <><p className="fi-pdf-help">{originalPdf ? 'Arquivo PDF original: proporção e conteúdo são exibidos pelo navegador.' : 'PDF local demonstrativo. Use os controles do leitor do navegador.'}</p><iframe ref={frame} title={`PDF — ${doc.title}`} src={doc.pdfUrl} className="fi-document-pdf" /></> : <article aria-label={doc.title} className={`fi-document-pages ${textMode ? 'is-text-reading' : ''}`}>
          {pages.map((lines, index) => <div key={index} data-page={index} className="fi-document-sheet" style={textMode ? { fontSize: `${16 * scale}px` } : { width: A4_WIDTH * scale, height: A4_HEIGHT * scale, '--paper-scale': scale } as React.CSSProperties}><DocumentPaper title={doc.title} process={doc.process} lines={lines} index={index} total={pages.length} scale={textMode || pageScroll ? 1 : scale} highlight={highlight} /></div>)}
        </article>)}
      </div>
    </section>
    {props.immersive && available && !originalPdf && createPortal(<div className="fi-document-print" aria-hidden="true"><style media="print">{'@page { size: A4; margin: 0; }'}</style>{pages.map((lines, index) => <DocumentPaper key={index} title={doc.title} process={doc.process} lines={lines} index={index} total={pages.length} />)}</div>, document.body)}
  </div>;
}
