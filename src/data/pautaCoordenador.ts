export const PAUTA_STATUSES = ['Aguardando Distribuição', 'Aguardando Aprovação', 'Em Análise', 'Revisões', 'Manifestações Pendentes', 'Pausados'] as const;
export interface PautaProcesso {
  id: string; numero: string; formacao: string; requerente: string; empreendimento: string;
  ato: string; tecnico: string; status: string; diretoria: string; municipio: string;
}
const first: PautaProcesso[] = [
  { id: 'p01', numero: '024519/2026', formacao: '2026-05-27', requerente: 'Fazenda Boa Vista Ltda', empreendimento: 'Fazenda Boa Vista Ltda', ato: 'Licença de Operação (LO)', tecnico: '', status: PAUTA_STATUSES[0], diretoria: 'DIRRE', municipio: 'Barreiras' },
  { id: 'p02', numero: '024518/2026', formacao: '2026-04-27', requerente: 'Ana Maria Braga', empreendimento: 'Chalé da Ana', ato: 'Licença de Operação (LO)', tecnico: 'Kleber Toledo', status: PAUTA_STATUSES[1], diretoria: 'DIRRE', municipio: 'Salvador' },
  { id: 'p03', numero: '024517/2026', formacao: '2026-03-27', requerente: 'João Gomes da Silva', empreendimento: 'Recanto das Araras', ato: 'Licença Prévia (LP)', tecnico: 'Larissa Manoela', status: PAUTA_STATUSES[2], diretoria: 'DILIC', municipio: 'Salvador' },
  { id: 'p04', numero: '024516/2026', formacao: '2026-02-27', requerente: 'Mário de Andrade', empreendimento: 'Pousada Pôr-do-Sol', ato: 'Licença Prévia (LP)', tecnico: 'Patrícia Pilar', status: 'Retificado', diretoria: 'DILIC', municipio: 'Ilhéus' },
  { id: 'p05', numero: '024515/2024', formacao: '2024-01-27', requerente: 'Hilton do Brasil S.A.', empreendimento: 'Hilton do Brasil S.A.', ato: 'Licença Prévia (LP)', tecnico: 'Larissa Manoela', status: 'Pausados', diretoria: 'DIBIO', municipio: 'Salvador' },
];
export const PAUTA_PROCESSOS: PautaProcesso[] = [...first, ...Array.from({ length: 7 }, (_, i) => ({
  id: `p${String(i + 6).padStart(2, '0')}`, numero: `${24100 + i}/2026`, formacao: `2026-01-${String(i + 10).padStart(2, '0')}`,
  requerente: `Requerente demonstrativo ${i + 6}`, empreendimento: `Empreendimento demonstrativo ${i + 6}`,
  ato: 'Licença Prévia (LP)', tecnico: i % PAUTA_STATUSES.length === 0 ? '' : 'Equipe técnica', status: PAUTA_STATUSES[i % PAUTA_STATUSES.length],
  diretoria: ['DIRRE', 'DILIC', 'DIBIO'][i % 3], municipio: ['Barreiras', 'Salvador', 'Ilhéus'][i % 3],
}))];
// Disponibilidade documental do exemplo recebido, não uma regra institucional de transição.
// MEMORIA_EXECUCAO.md/T2 associa o resultado DEFERIDO exclusivamente ao processo p03.
const PARECER_ATUAL_DEMONSTRATIVO = { processoId: 'p03', statusReferencia: 'Em Análise', resultado: 'DEFERIDO' };
export function pautaParecerAtual(p: PautaProcesso | undefined) {
  return p?.id === PARECER_ATUAL_DEMONSTRATIVO.processoId && p.status === PARECER_ATUAL_DEMONSTRATIVO.statusReferencia && !!p.tecnico
    ? PARECER_ATUAL_DEMONSTRATIVO : undefined;
}
export const PAUTA_COLUMNS = [
  ['numero', 'Nº Processo'], ['formacao', 'Formação'], ['requerente', 'Requerente'], ['empreendimento', 'Empreendimento'],
  ['ato', 'Ato'], ['tecnico', 'Líder Técnico'], ['status', 'Status/Situação'],
] as const;
export type PautaColumn = typeof PAUTA_COLUMNS[number][0];
export const foldPauta = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
export function queryPauta(rows: PautaProcesso[], query: string, status: string, diretoria: string, municipio: string, sort: PautaColumn | '', ascending: boolean) {
  const found = rows.filter(p => (!status || p.status === status) && (!diretoria || p.diretoria === diretoria) && (!municipio || p.municipio === municipio) && foldPauta(Object.values(p).join(' ')).includes(foldPauta(query.trim())));
  return sort ? found.sort((a, b) => a[sort].localeCompare(b[sort], 'pt-BR', { numeric: true }) * (ascending ? 1 : -1)) : found;
}
export function pautaCsv(rows: PautaProcesso[], columns: readonly PautaColumn[]) {
  const cell = (value: string) => `"${(/^[=+\-@\t\r]/.test(value) ? "'" : '') + value.replace(/"/g, '""')}"`;
  return '\uFEFF' + [columns.map(c => PAUTA_COLUMNS.find(v => v[0] === c)![1]), ...rows.map(row => columns.map(c => row[c]))].map(row => row.map(cell).join(';')).join('\r\n');
}
export function downloadPauta(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export { pautaPdf } from './pautaPdf';
