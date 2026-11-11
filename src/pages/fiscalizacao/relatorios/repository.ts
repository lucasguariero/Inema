import { applyCommand } from './domain';
import { packBinaries, unpackBinaries } from './binaryCodec';
import type { Actor, Command, Repository } from './types';

const DB_NAME = 'inema-fiscalizacao-relatorios-demo-v1';
function openDatabase(): Promise<IDBDatabase> {
 return new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => request.result.createObjectStore('repositories');
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(Error('Não foi possível abrir o armazenamento local. Os dados não foram sobrescritos.'));
  request.onblocked = () => reject(Error('Feche outras abas antigas para atualizar o armazenamento demonstrativo.'));
 });
}
function checkRepository(value: Repository) {
 if (!value || typeof value !== 'object' || value.schema !== 1 || !Array.isArray(value.records) || !Array.isArray(value.deleted) || !value.sequences || value.records.some(r => !r || !['DOR008', 'DOR009'].includes(r.kind) || !r.content || !Array.isArray(r.audit) || !Number.isInteger(r.revision))) throw Error('Armazenamento desconhecido ou corrompido. Preserve os dados e solicite recuperação.');
}
function hydrate(value: unknown) { const repo = unpackBinaries(value) as Repository; checkRepository(repo); return repo; }
function read(db: IDBDatabase, scenario: string): Promise<unknown> {
 return new Promise((resolve, reject) => {
  const tx = db.transaction('repositories'), request = tx.objectStore('repositories').get(scenario);
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(Error('Não foi possível ler o armazenamento local. Nenhum dado foi sobrescrito.'));
 });
}
// Conservative compare-and-swap keeps binary serialization outside the live IDB transaction.
// ponytail: simultaneous edits to different reports may require retry; split stores for real concurrency.
const token = (r: Repository) => JSON.stringify([r.records.map(x => [x.id, x.revision]), r.sequences, r.deleted.map(x => [x.id, x.at])]);
export async function loadRepository(scenario: string, initial: () => Repository): Promise<Repository> {
 const db = await openDatabase();
 try {
  const stored = await read(db, scenario); if (stored !== undefined) return hydrate(stored);
  const candidate = initial(); checkRepository(candidate); const packed = await packBinaries(candidate);
  return await new Promise((resolve, reject) => {
   const tx = db.transaction('repositories', 'readwrite'), store = tx.objectStore('repositories'), request = store.get(scenario); let result: Repository, failure: unknown;
   request.onsuccess = () => { try { result = request.result === undefined ? candidate : hydrate(request.result); if (request.result === undefined) store.add(packed, scenario); } catch (e) { failure = e; tx.abort(); } };
   tx.oncomplete = () => resolve(result);
   tx.onerror = tx.onabort = () => reject(failure || Error('Não foi possível inicializar o armazenamento local. Nenhum salvamento foi confirmado.'));
  });
 } finally { db.close(); }
}
export async function persistCommand(scenario: string, actor: Actor, command: Command): Promise<Repository> {
 const db = await openDatabase();
 try {
  const stored = await read(db, scenario); if (stored === undefined) throw Error('Repositório ausente. Reabra a página sem descartar os dados.');
  const before = hydrate(stored), result = applyCommand(before, actor, command), packed = await packBinaries(result);
  return await new Promise((resolve, reject) => {
   const tx = db.transaction('repositories', 'readwrite'), store = tx.objectStore('repositories'), request = store.get(scenario); let failure: unknown;
   request.onsuccess = () => { try { if (token(hydrate(request.result)) !== token(before)) throw Error('O repositório mudou em outra sessão. Reabra os dados salvos antes de continuar.'); store.put(packed, scenario); } catch (e) { failure = e; tx.abort(); } };
   tx.oncomplete = () => resolve(result);
   tx.onerror = tx.onabort = () => reject(failure || Error('Não foi possível salvar. Confira espaço/permissões do navegador. Seus dados em edição foram mantidos.'));
  });
 } finally { db.close(); }
}
