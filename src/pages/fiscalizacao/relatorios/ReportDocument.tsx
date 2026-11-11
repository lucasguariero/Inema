import { useEffect, useState, useId } from 'react';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { Button } from '@/components/ui/button';
import { Download, Printer, ChevronDown } from 'lucide-react';
import inemaLogo from '@/assets/logo-inema-color.png';
import { Modal } from './controls';
import { SHORT, TITLES } from './domain';
import { LEGAL_CATALOG } from './legalCatalog';
import { coordFingerprint } from './fixtures';
import type { Report } from './types';
import { planRfaDocument } from './rfaDocumentLayout';

interface TextOp { type: 'text'; text: string; x: number; y: number; size: number; bold?: boolean; color?: string; box?: { x: number; y: number; w: number; h: number; fill?: string; stroke?: string } }
interface ImageOp { type: 'image'; image: number; x: number; y: number; w: number; h: number }
export type Op = TextOp | ImageOp;
export interface Picture { data: Uint8Array; url: string; width: number; height: number }
export interface Plan { pages: Op[][]; pictures: Picture[] }
const W = 595.276, H = 841.89, L = 42, RIGHT = W - 42, BOTTOM = H - 68;

function documentDate(value: string) {
 if (!value) return 'Não informado';
 const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value), date = new Date(dateOnly ? value + 'T00:00:00Z' : value);
 if (!Number.isFinite(date.getTime()) || (dateOnly ? date.toISOString().slice(0, 10) !== value : !/(Z|[+-]\d{2}:\d{2})$/i.test(value))) return 'Data indisponível';
 // Calendar dates have no time zone; UTC instants are displayed once in Bahia.
 return new Intl.DateTimeFormat('pt-BR', dateOnly ? { dateStyle: 'short', timeZone: 'UTC' } : { dateStyle: 'short', timeStyle: 'medium', hourCycle: 'h23', timeZone: 'America/Bahia' }).format(date);
}
const GEO_MODE_LABELS = { success: 'Consulta demonstrativa concluída', empty: 'Consulta demonstrativa sem ocorrências', partial: 'Consulta demonstrativa parcialmente indisponível', unavailable: 'Consulta demonstrativa indisponível' };

function documentSections(r: Report) {
 const c = r.content, person = c.person;
 const sections: { title: string; rows: [string, string][] }[] = [
  { title: 'Processo originador', rows: [['Processo fictício', c.originator || 'Não informado'], ...(r.kind === 'DOR009' ? [['Processos relacionados', r.content.relatedProcesses.join(', ') || 'Nenhum']] as [string, string][] : [])] },
  { title: 'Atendimento', rows: (r.kind === 'DOR008' ? [r.content.attendance] : r.content.attendances).map((p, i) => [`Período ${i + 1}`, `${documentDate(p.start)} até ${documentDate(p.end)}${p.overlapConfirmed ? ' — sobreposição confirmada explicitamente' : ''}`]) as [string, string][] },
  { title: 'Identificação', rows: [['Nome/Razão social', person.name], ['CPF/CNPJ', person.document], ['Endereço', person.address], ['Complemento', person.complement], ['CEP', person.cep], ['E-mail', person.email], ['Telefone', person.phone]] },
 ];
 if (r.kind === 'DOR009') sections.push({ title: 'Empresas e representantes', rows: r.content.companies.flatMap(x => [[x.name, x.document], ...x.representatives.map(p => ['Representante', `${p.name}; ${p.job}; ${p.phone || 'sem telefone'}; ${p.email || 'sem e-mail'}`])] as [string, string][]) });
 sections.push({ title: 'Participantes', rows: c.participants.map(p => [p.name, `${p.job}; ${p.phone || 'sem telefone'}; ${p.email || 'sem e-mail'}${p.responsible ? '; responsável' : ''}`]) }, { title: r.kind === 'DOR008' ? 'Local da inspeção' : 'Local da emergência', rows: [['Endereço/local', c.location.address], ['Número', c.location.number], ['Município', c.location.municipality], ['Referência', c.location.reference], ...c.coordinates.map((p, i) => [`Coordenada ${i + 1}`, `${p.original} (${p.format}); decimal ${p.lat}, ${p.lng}; ${p.datum}`] as [string, string])] });
 sections.push({ title: 'Contexto geoespacial demonstrativo', rows: c.geo ? [['Fonte/consulta', `Dados fictícios; ${GEO_MODE_LABELS[c.geo.mode]}; ${documentDate(c.geo.at)}${c.geo.coordinateFingerprint !== coordFingerprint(c.coordinates) ? '; DESATUALIZADA após edição de coordenadas' : ''}`], ...c.geo.layers.map(x => [`${x.layer} — ${x.rule}`, x.status === 'unavailable' ? 'Camada indisponível; dados anteriores, sem atualização: ' + (x.values.filter(v => v.selected).map(v => v.text).join('; ') || 'nenhum') : x.status === 'empty' ? 'Não se aplica' : x.values.filter(v => v.selected).map(v => v.text).join('; ') || 'Nenhum recurso hídrico selecionado'] as [string, string])] : [['Consulta', 'Não realizada. Não é condição impeditiva da finalização.']] });
 sections.push({ title: 'Histórico incorporado', rows: c.history.length ? c.history.map(x => [x.process + ' — ' + documentDate(x.date) + ' — ' + x.type, x.detail]) : [['Histórico', 'Nenhum item incorporado']] }, { title: r.kind === 'DOR008' ? 'Descrição da inspeção' : 'Descrição da emergência', rows: [['Descrição', c.description]] }, { title: 'Conclusão e desdobramentos', rows: [['Conclusão', c.conclusion], ['Desdobramentos', c.outcomes.join(', ') || 'Nenhum selecionado']] });
 for (const [i, n] of c.infractions.entries()) {
  const text: [string, string][] = [['Caracterização textual', n.description], ['Anexo VI', n.annexVI.length ? n.annexVI.join(', ') : 'Opcional; catálogo completo não fornecido'], ['Fontes do dispositivo', n.sources.join(', ')], ['Autuado', `${n.recipient.name}; ${n.recipient.document}; ${n.recipient.address}`], ['Justificativa do autuado diferente', n.recipientReason], ['Outras normas', n.other]];
  for (const a of n.articles) for (const id of n.clauses[a] || []) { const catalog = LEGAL_CATALOG[r.kind][a as keyof typeof LEGAL_CATALOG[typeof r.kind]]; text.push([`Art.${a}, ${id}`, catalog?.options.find(o => o.id === id)?.text || (id === 'PU' ? 'Parágrafo único' : id)]); }
  for (const id of n.criteria) text.push([`Art.249, ${id}`, (LEGAL_CATALOG[r.kind]['249'].options.find(o => o.id === id)?.text || '') + (n.reasons[id] ? ' — ' + n.reasons[id] : '')]);
  for (const a of ['250', '251'] as const) for (const id of a === '250' ? n.mitigating : n.aggravating) text.push([`Art.${a}, ${id}`, LEGAL_CATALOG[r.kind][a].options.find(o => o.id === id)?.text || id]);
  text.push(['Art.251, VII', n.aggravatingVII.join(', ')], ['Art.257', n.nature + (n.natureFormal.length ? '; opções ' + n.natureFormal.join(', ') : '')], ['Art.258 — gravidade', n.severity], ['Penalidade (Anexo VII)', n.penalties.join(', ')]); sections.push({ title: `Infração ${i + 1}`, rows: text });
 }
 if (!c.infractions.length) sections.push({ title: 'Infrações', rows: [['Registro', 'Nenhuma infração incluída']] });
 for (const [i, n] of c.notifications.entries()) sections.push({ title: `Notificação ${i + 1}`, rows: [['Processo originador', n.processId], ['Destinatário', `${n.recipient.name}; ${n.recipient.document}; ${n.recipient.address}`], ['Justificativa do destinatário diferente', n.recipientReason], ['Descrição', n.description], ['Resumo manual', n.summary]] });
 if (!c.notifications.length) sections.push({ title: 'Notificações', rows: [['Registro', 'Nenhuma notificação incluída']] });
 if (r.kind === 'DOR009') sections.push({ title: 'Recomendações técnicas', rows: [['Recomendações', r.content.recommendations || 'Não informadas (opcional)']] });
 sections.push({ title: 'Anexos e evidências', rows: c.attachments.length ? c.attachments.map(a => [a.name, `${a.description}; ${a.format}; ${a.size} bytes; ${a.user}; ${documentDate(a.at)}; ${a.purpose === 'image' ? 'imagem da descrição' : 'anexo'}`]) : [['Arquivos', 'Nenhum arquivo incluído']] });
 sections.push({ title: 'Responsabilidade técnica', rows: [['Responsável demonstrativo', r.authorName], ['Criado em', documentDate(r.createdAt)], ['Último registro', documentDate(r.updatedAt)], ['Finalizado/reenviado em', r.finalizedAt ? documentDate(r.finalizedAt) : 'Ainda não finalizado'], ['Validade', 'Documento demonstrativo. Sem assinatura digital, numeração oficial ou encaminhamento institucional.']] });
 return sections;
}
async function picture(source: string): Promise<Picture> { const img = new Image(); img.src = source; await img.decode(); const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d')!; ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); const url = canvas.toDataURL('image/jpeg', .9); return { data: Uint8Array.from(atob(url.split(',')[1]), c => c.charCodeAt(0)), url, width: canvas.width, height: canvas.height }; }
export async function planReportDocument(r: Report): Promise<Plan> {
 const pictures: Picture[] = [await picture(inemaLogo)];
 if (r.kind === 'DOR008') return planRfaDocument(r, pictures, documentSections(r), picture, documentDate);
 const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d')!;
 const wrap = (value: string, width: number, size: number, bold = false) => { ctx.font = `${bold ? 'bold ' : ''}${size}px Arial`; const lines: string[] = []; let line = ''; for (const word of (value || 'Não informado').split(/\s+/)) { if (line && ctx.measureText(line + ' ' + word).width > width) { lines.push(line); line = ''; } for (const ch of word) { if (line && ctx.measureText(line + ch).width > width) { lines.push(line); line = ''; } line += ch; } line += ' '; } if (line.trim()) lines.push(line.trim()); return lines; };
 const pages: Op[][] = []; let current: Op[] = [], y = 0;
 const newPage = () => { current = []; pages.push(current); current.push({ type: 'image', image: 0, x: L, y: 32, w: 57, h: 57 * pictures[0].height / pictures[0].width }); const title = wrap(TITLES[r.kind], RIGHT - L - 75, 13, true); title.forEach((text, i) => current.push({ type: 'text', text, x: 114, y: 42 + i * 17, size: 13, bold: true })); y = Math.max(78, 44 + title.length * 17); current.push({ type: 'text', text: 'DEMONSTRAÇÃO — SEM VALIDADE LEGAL', x: L, y, size: 9, bold: true }); y += 18; current.push({ type: 'text', text: `${SHORT[r.kind]} · ${r.number ? 'Número demonstrativo: ' + r.number : 'Rascunho sem número definitivo'} · ${r.status} · versão ${r.version}`, x: L, y, size: 8 }); y += 28; };
 const text = (value: string, size = 10, bold = false) => { for (const line of wrap(value, RIGHT - L, size, bold)) { if (y + 16 > BOTTOM) newPage(); current.push({ type: 'text', text: line, x: L, y, size, bold }); y += size + 4; } y += 5; };
 newPage();
 for (const section of documentSections(r)) { if (y + 55 > BOTTOM) newPage(); text(section.title, 11, true); for (const [label, value] of section.rows) text(label + ': ' + (value || 'Não informado')); y += 9; }
 for (const a of r.content.attachments.filter(a => a.mime.startsWith('image/'))) {
  const url = URL.createObjectURL(a.blob); try { const img = await picture(url), idx = pictures.push(img) - 1; const w = Math.min(RIGHT - L, img.width), h = Math.min(260, w * img.height / img.width), fittedW = h * img.width / img.height; if (y + h + 55 > BOTTOM) newPage(); text('Evidência: ' + a.name, 10, true); current.push({ type: 'image', image: idx, x: L + (RIGHT - L - fittedW) / 2, y, w: fittedW, h }); y += h + 18; text(a.description, 9); } finally { URL.revokeObjectURL(url); }
 }
 pages.forEach((p, i) => { p.push({ type: 'text', text: 'Datas e horários: Bahia (America/Bahia, UTC-03:00).', x: L, y: H - 47, size: 7 }, { type: 'text', text: 'Conteúdo fictício para avaliação. Sem assinatura ou encaminhamento institucional.', x: L, y: H - 35, size: 7 }, { type: 'text', text: `Página ${i + 1} de ${pages.length}`, x: RIGHT - 65, y: H - 22, size: 8 }); });
 return { pages, pictures };
}
// Adapted from the existing CERH core-PDF output pattern; scoped here for mixed text/image reports.
export function reportPdf(plan: Plan) {
 const enc = new TextEncoder(), bytes = (s: string) => enc.encode(s), concat = (list: Uint8Array[]) => { const out = new Uint8Array(list.reduce((n, p) => n + p.length, 0)); let offset = 0; for (const p of list) { out.set(p, offset); offset += p.length; } return out; };
 const escape = (s: string) => Array.from(s.replace(/[–—·]/g, '-').replace(/[“”]/g, '"').replace(/[‘’′]/g, "'").replace(/″/g, '"')).map(c => '\\()'.includes(c) ? '\\' + c : c.charCodeAt(0) > 126 && c.charCodeAt(0) <= 255 ? '\\' + c.charCodeAt(0).toString(8).padStart(3, '0') : c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126 ? c : '-').join('');
 const start = 5 + plan.pictures.length, kids = plan.pages.map((_, i) => `${start + i * 2} 0 R`).join(' ');
 const objects: (string | Uint8Array)[] = ['<< /Type /Catalog /Pages 2 0 R >>', `<< /Type /Pages /Kids [${kids}] /Count ${plan.pages.length} >>`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
 plan.pictures.forEach(p => objects.push(concat([bytes(`<< /Type /XObject /Subtype /Image /Width ${p.width} /Height ${p.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.data.length} >>\nstream\n`), p.data, bytes('\nendstream')])));
 const resources = plan.pictures.map((_, i) => `/I${i} ${5 + i} 0 R`).join(' ');
 const rgb = (color: string) => [1,3,5].map(at => (parseInt(color.slice(at, at+2),16)/255).toFixed(5)).join(' ');
 const paintText = (op: TextOp) => {
  const b = op.box;
  const background = b ? `q ${b.fill ? rgb(b.fill)+' rg ' : ''}${b.stroke ? rgb(b.stroke)+' RG 0.5 w ' : ''}${b.x} ${H-b.y-b.h} ${b.w} ${b.h} re ${b.fill && b.stroke ? 'B' : b.stroke ? 'S' : 'f'} Q\n` : '';
  return background + `${op.color ? rgb(op.color)+' rg' : '0 g'} BT /${op.bold ? 'F2' : 'F1'} ${op.size} Tf 1 0 0 1 ${op.x} ${H-op.y} Tm (${escape(op.text)}) Tj ET`;
 };

 plan.pages.forEach((page, i) => { const stream = page.map(op => op.type === 'text' ? paintText(op) : `q ${op.w} 0 0 ${op.h} ${op.x} ${H - op.y - op.h} cm /I${op.image} Do Q`).join('\n'); objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << ${resources} >> >> /Contents ${start + i * 2 + 1} 0 R >>`, `<< /Length ${bytes(stream).length} >>\nstream\n${stream}\nendstream`); });
 const chunks = [bytes('%PDF-1.4\n')], offsets: number[] = []; let length = chunks[0].length;
 objects.forEach((obj, i) => { offsets.push(length); const b = concat([bytes(`${i + 1} 0 obj\n`), typeof obj === 'string' ? bytes(obj) : obj, bytes('\nendobj\n')]); chunks.push(b); length += b.length; });
 chunks.push(bytes(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map(n => String(n).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${length}\n%%EOF`));
 return new Blob([concat(chunks).buffer as ArrayBuffer], { type: 'application/pdf' });
}
export function ReportDocument({ report, onClose }: { report: Report; onClose: () => void }) {
 const zoomId = useId();
 const [plan, setPlan] = useState<Plan | null>(null), [error, setError] = useState(''), [zoom, setZoom] = useState('fit');
 useEffect(() => { let live = true; void planReportDocument(report).then(p => { if (live) setPlan(p); }).catch(() => { if (live) setError('Não foi possível preparar o documento. Confira as imagens e tente novamente.'); }); return () => { live = false; }; }, [report]);
 const download = () => { if (!plan) return; const url = URL.createObjectURL(reportPdf(plan)), a = document.createElement('a'); a.href = url; a.download = `${SHORT[report.kind]}-${report.number?.replace(/\//g, '-') || 'rascunho'}-DEMONSTRATIVO.pdf`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 60000); };
 return <Modal title={'Documento demonstrativo — ' + SHORT[report.kind]} onClose={onClose} wide footer={<><Button color="gray" onClick={onClose}>Fechar</Button><Button color="gray" disabled={!plan} onClick={() => window.print()}><Printer className="w-4 h-4" />Imprimir</Button><Button disabled={!plan} onClick={download}><Download className="w-4 h-4" />Baixar PDF demonstrativo</Button></>}><div className="fr-actions fr-doc-controls"><div className="fr-field w-56"><label htmlFor={zoomId}>Zoom do documento</label><InputWrapper className="min-h-[38px]" suffixIcon={ChevronDown}><select id={zoomId} style={{ minHeight: '36px', height: '36px' }} className="fr-input fi-input bg-transparent cursor-pointer appearance-none pr-8" aria-label="Zoom do documento" value={zoom} onChange={e => setZoom(e.target.value)}><option value="fit">Ajustar à largura</option><option value="100">100%</option><option value="125">125%</option><option value="150">150%</option></select></InputWrapper></div>{plan && <span>{plan.pages.length} páginas A4 · sem validade legal</span>}</div>{error && <p role="alert">{error}</p>}{!plan && !error && <p role="status">Preparando páginas A4…</p>}<div className="fr-doc-pages fr-print-target">{plan?.pages.map((page, i) => <article key={i} className="fr-document-paper" aria-label={`Página ${i + 1} de ${plan.pages.length}`} style={zoom === 'fit' ? undefined : { width: `${794 * Number(zoom) / 100}px`, maxWidth: 'none' }}><svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Conteúdo da página ${i + 1}`}><rect width={W} height={H} fill="white" />{page.map((op, j) => op.type === 'text' ? <g key={j}>{op.box && <rect x={op.box.x} y={op.box.y} width={op.box.w} height={op.box.h} fill={op.box.fill || 'none'} stroke={op.box.stroke || 'none'} strokeWidth={0.5}/>}<text x={op.x} y={op.y} fontSize={op.size} fontWeight={op.bold ? 700 : 400} fontFamily="Arial, sans-serif" fill={op.color || '#17212b'}>{op.text}</text></g> : <image key={j} href={plan.pictures[op.image].url} x={op.x} y={op.y} width={op.w} height={op.h} />)}</svg></article>)}</div></Modal>;
}
