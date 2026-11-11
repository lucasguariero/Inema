import { downloadDocument } from './cerhPdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { GlaTable, GlaTableHead, GlaTableBody, GlaTableRow, GlaTh, GlaTd } from '@/components/common/GlaTable';
import { TableContainer } from '@/components/filament/Table';
import { Download, Printer } from 'lucide-react';
import { pautaPdf } from '@/data/pautaPdf';
import inemaLogo from '@/assets/logo-inema-color.png';

export interface ReportData { title: string; author: string; filters: string; columns: string[]; rows: string[][]; date?: string }
export function downloadCerhPdf(name: string, lines: string[] | string[][]) {
  const url = URL.createObjectURL(pautaPdf(lines)); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 60000);
}
export function ReportPreview({ report, onClose }: { report: ReportData; onClose: () => void }) {
  const date = report.date || new Date().toLocaleString('pt-BR');
  const pages = Array.from({ length: Math.max(1, Math.ceil(report.rows.length / 12)) }, (_, n) => report.rows.slice(n * 12, n * 12 + 12));
  return <Dialog open onOpenChange={v => { if (!v) onClose(); }}><DialogContent className="cerh-dialog max-w-6xl"><DialogHeader><DialogTitle>{report.title}</DialogTitle><DialogDescription>Relatório demonstrativo local. Sem envio ou validação institucional.</DialogDescription></DialogHeader><div className="cerh-dialog-body">
    <div className="cerh-print-document">{pages.map((rows, i) => <article className={"cerh-report-page"+(report.columns.length>5?" cerh-report-wide":"")} key={i}><header><img src={inemaLogo} alt="INEMA" /><div><h2>{report.title}</h2><p>Data e hora de geração: {date}</p><p>Usuário emissor: {report.author}</p></div></header><p><strong>Filtros aplicados:</strong> {report.filters || 'Nenhum filtro aplicado'}</p><p>Quantidade total: {report.rows.length}</p><TableContainer stableHeight={false} className="cerh-report-table"><GlaTable style={{minWidth:report.columns.length*130}}><GlaTableHead><GlaTableRow>{report.columns.map(c => <GlaTh scope="col" key={c}>{c}</GlaTh>)}</GlaTableRow></GlaTableHead><GlaTableBody>{rows.map((row, n) => <GlaTableRow key={n}>{row.map((value, j) => <GlaTd key={j}>{value || '—'}</GlaTd>)}</GlaTableRow>)}</GlaTableBody></GlaTable></TableContainer>{i === pages.length - 1 && <p>Total ({report.rows.length} registros)</p>}<footer><span>Sistema SEIA / INEMA - Documento gerado eletronicamente para fins de conferência e arquivo.</span><span>Página {i + 1} de {pages.length}</span></footer></article>)}</div>
  </div><DialogFooter><Button color="gray" size="sm" onClick={onClose}>Fechar</Button><Button color="gray" outlined size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" />Imprimir</Button><Button size="sm" onClick={() => downloadDocument(report.title+'.pdf',{title:report.title,metadata:['Data e hora de geração: '+date,'Usuário emissor: '+report.author,'Filtros aplicados: '+(report.filters||'Nenhum filtro aplicado'),'Quantidade total: '+report.rows.length],columns:report.columns,rows:report.rows,footer:'Sistema SEIA / INEMA - Documento gerado eletronicamente para fins de conferência e arquivo.',logoUrl:inemaLogo})}><Download className="h-4 w-4" />Baixar PDF</Button></DialogFooter></DialogContent></Dialog>;
}
