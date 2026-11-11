import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, Modal, Choices } from './controls';
import { EMPTY_REUSE_FILTERS, searchReports } from './fixtures';
import { SHORT, message } from './domain';
import { documentoValido } from '@/lib/pautaGestor';
import type { Report, ReportKind } from './types';

export function ReportLookup({ kind, reports, onClose, onImport }: { kind: ReportKind; reports: Report[]; onClose: () => void; onImport: (source: Report, fields: string[]) => void }) {
 const [filters, setFilters] = useState({ ...EMPTY_REUSE_FILTERS }), [results, setResults] = useState<Report[] | null>(null), [source, setSource] = useState<Report | null>(null), [fields, setFields] = useState(['person', 'location', 'description']), [error, setError] = useState(''), [confirm, setConfirm] = useState(false);
 const options = [{ id: 'person', text: 'Identificação' }, { id: 'participants', text: 'Participantes (o autor atual permanece responsável)' }, { id: 'location', text: 'Local' }, { id: 'coordinates', text: 'Coordenadas e valores originais' }, { id: 'description', text: 'Descrição textual' }, { id: 'conclusion', text: 'Conclusão' }, { id: 'outcomes', text: 'Desdobramentos' }, { id: 'infractions', text: 'Infrações' }, { id: 'notifications', text: 'Notificações (vínculo com o originador atual)' }, ...(kind === 'DOR009' ? [{ id: 'companies', text: 'Empresas e representantes' }, { id: 'recommendations', text: 'Recomendações' }] : [])];
 return <Modal title={confirm ? 'Confirmar aproveitamento de dados' : `Buscar ${SHORT[kind]} para reaproveitamento`} onClose={onClose} wide footer={confirm ? <><Button color="gray" onClick={() => setConfirm(false)}>Cancelar</Button><Button onClick={() => onImport(source!, fields)}>Confirmar aproveitamento</Button></> : <><Button color="gray" onClick={onClose}>Cancelar</Button><Button disabled={!source || !fields.length} onClick={() => setConfirm(true)}>Aproveitar dados</Button></>}>{confirm ? <p>{message(kind, 11)} Apenas os grupos selecionados serão substituídos; número, autor, estado, atendimento, processo originador, arquivos e assinaturas não serão copiados.</p> : <>
  <div className="fr-grid">{([['document', 'CPF/CNPJ'], ['name', 'Nome/Razão social'], ['number', 'Número do relatório'], ['process', 'Número do processo'], ['car', 'CEFIR/CAR'], ['date', 'Data'], ['municipality', 'Município'], ['uc', 'Unidade de Conservação']] as const).map(([key, label]) => <Field key={key} label={'Busca — ' + label} value={filters[key]} onChange={v => setFilters({ ...filters, [key]: key === 'document' ? v.replace(/\D/g, '') : v })} type={key === 'date' ? 'date' : 'text'} />)}</div>
  <Button onClick={() => { if (filters.document && !documentoValido(filters.document)) { setError(message(kind, 6)); return; } setError(''); setResults(searchReports(reports, kind, filters)); setSource(null); }}>Buscar relatório</Button>
  {error && <p role="alert" className="fr-error">{error}</p>}{results && !results.length && <p role="status">{message(kind, 10)}</p>}
  {results?.map(r => <div className="fr-item" key={r.id}><label><input type="radio" name="reuse-report" checked={source?.id === r.id} onChange={() => setSource(r)} /> {SHORT[r.kind]} {r.number || 'Rascunho sem número'} — {r.content.person.name || 'Identificação pendente'}</label><details><summary>Expandir relatório {r.number || r.id.slice(0, 8)}</summary><p>Estado: {r.status}; processo: {r.content.originator || 'não selecionado'}; criado em {new Date(r.createdAt).toLocaleDateString('pt-BR')}</p><p>{r.content.description || 'Sem descrição'}</p></details></div>)}
  {source && <Choices title="Grupos a importar seletivamente" values={fields} options={options} onChange={setFields} />}
 </>}</Modal>;
}
