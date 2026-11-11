import { REQUERENTE } from '../data/entradaUnicaUc';
import { civilDate, telasEntrada, type EntradaRecord } from './entradaUnicaUc';
export const ENTRADA_STORAGE = 'inema.entrada-unica-uc.v1';
export const ENTRADA_STORAGE_ERROR = 'Não foi possível acessar os rascunhos deste navegador. Os registros existentes foram preservados. Tente novamente; suas alterações abertas permanecem em memória.';
type RepoEntrada = { version: 1; records: EntradaRecord[] };
function validRecord(r: EntradaRecord): boolean {
  return !!r && typeof r.id === 'string' && typeof r.owner === 'string' && !!civilDate(r.opening) && Number.isFinite(Date.parse(r.updated)) && Number.isInteger(r.revision) && r.revision >= 0 && ['ucId','ucName','localId','localName','category','description','date'].every(k => typeof (r as unknown as Record<string,unknown>)[k] === 'string') && ['result','policy','calendar','acceptedAt'].every(k => (r as unknown as Record<string,unknown>)[k] === undefined || typeof (r as unknown as Record<string,unknown>)[k] === 'string') && (r.destination === undefined || ['uc-autorizacao-visitacao','uc-atividades-didaticas','uc-pesquisa-cientifica'].includes(r.destination)) && (r.conditionsReviewed === undefined || typeof r.conditionsReviewed === 'boolean') && !!r.conditions && ['regular','restricted','structure','people'].every(k => typeof r.conditions[k as keyof typeof r.conditions] === 'boolean') && telasEntrada.includes(r.screen) && ['Rascunho','Classificada','Formulário aberto','Cancelada'].includes(r.status) && Array.isArray(r.events) && r.events.every(e => {
    if (!e || !['at','action','actor','snapshot','rules'].every(k => typeof (e as unknown as Record<string,unknown>)[k] === 'string') || !Number.isInteger(e.revision) || !Number.isFinite(Date.parse(e.at))) return false;
    try { return !!JSON.parse(e.snapshot) && typeof JSON.parse(e.snapshot) === 'object'; } catch { return false; }
  });
}
export function lerEntradas(storage: Pick<Storage,'getItem'> = localStorage): RepoEntrada {
  try {
    const raw = storage.getItem(ENTRADA_STORAGE); if (!raw) return { version: 1, records: [] };
    const repo: RepoEntrada = JSON.parse(raw);
    if (repo.version !== 1 || !Array.isArray(repo.records) || !repo.records.every(validRecord) || new Set(repo.records.map(r => r.id)).size !== repo.records.length) throw new Error();
    return repo;
  } catch { throw new Error(ENTRADA_STORAGE_ERROR); }
}
export function minhasEntradas(storage: Pick<Storage,'getItem'> = localStorage) { return lerEntradas(storage).records.filter(r => r.owner === REQUERENTE.id).sort((a,b) => b.updated.localeCompare(a.updated)); }
export function entradaPorId(id: string, storage: Pick<Storage,'getItem'> = localStorage) { return minhasEntradas(storage).find(r => r.id === id); }
export function gravarEntrada(record: EntradaRecord, storage: Pick<Storage,'getItem'|'setItem'> = localStorage) {
  try {
    if (!validRecord(record) || record.owner !== REQUERENTE.id) throw new Error();
    const repo = lerEntradas(storage), index = repo.records.findIndex(r => r.id === record.id);
    if (index >= 0 && repo.records[index].owner !== record.owner) throw new Error();
    if (index >= 0) repo.records[index] = record; else repo.records.push(record);
    storage.setItem(ENTRADA_STORAGE, JSON.stringify(repo));
    if (storage.getItem(ENTRADA_STORAGE) !== JSON.stringify(repo)) throw new Error();
    return record;
  } catch { throw new Error(ENTRADA_STORAGE_ERROR); }
}
