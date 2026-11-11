import { execute, MSG, STATUS, USERS, type Action, type Aiad, type Command, type Role } from './aiad';

export const LEGACY_STORAGE = 'inema-dor013-aiad-v1';
export const STORAGE = 'inema-dor013-aiad-v1.1';
export const PERSISTENT_ACTIONS: Action[] = ['linkProcess','save','form','sign','coordination','adjust','director','atend','toTechnician','conclude','toArea','beginCorrection','expedir','receipt','termElapsed'];
type StoragePort = Pick<Storage,'getItem'|'setItem'>;
interface Repository { schemaVersion: 11; sequence: number; activeId: string; records: Record<string,Aiad> }
export const STORAGE_ERROR = 'Não foi possível ler o armazenamento local. Os dados foram preservados; não salve sobre o registro sem conciliação.';

function legacyRecord(raw:string):Aiad {
  const a=JSON.parse(raw);
  if(!a || typeof a.id!=='string' || !a.id || !validFields(a.fields) || !Array.isArray(a.audit) || !Array.isArray(a.versions) || !Array.isArray(a.signatures) || !Array.isArray(a.attachments)) throw new Error(STORAGE_ERROR);
  const review=a.status!=='rascunho' || !!a.number || a.signatures.length>0 || !!a.dispatch || a.versions.length>0;
  return {...structuredClone(a),schemaVersion:11,revision:0,holder:'tecnico',relatedProcess:a.relatedProcess||'',adjustmentsConfirmed:false,analysisConfirmed:false,returnDocumentIds:[],legacyReview:review,legacyRecord:structuredClone(a)};
}
function validFields(fields:Aiad['fields']) {
  return fields && ['document','name','enterprise','address','cep','city','uf','email','phone','date','facts','inspection','inspectionAddress','inspectionCep','inspectionCity','inspectionUf','source','article','clause','other'].every(key=>typeof fields[key as keyof typeof fields]==='string') && fields.coords && ['lat','lon','latD','latM','latS','lonD','lonM','lonS'].every(key=>typeof fields.coords[key as keyof typeof fields.coords]==='string') && ['decimal','gms','utm23','utm24'].includes(fields.coords.type);
}
function validRecord(a:Aiad) {
  return a && a.schemaVersion===11 && typeof a.id==='string' && validFields(a.fields) && Number.isSafeInteger(a.revision) && a.revision>=0 && Array.isArray(a.audit) && Array.isArray(a.versions) && Array.isArray(a.signatures) && Array.isArray(a.attachments) && Array.isArray(a.returnDocumentIds) && (a.legacyReview || (Object.hasOwn(STATUS,a.status) || a.status==='rascunho') && ['tecnico','coordenacao','diretoria','externo'].includes(a.holder));
}
export function readRepository(storage:StoragePort):Repository {
  try {
    const raw=storage.getItem(STORAGE);
    const repository:Repository=raw?JSON.parse(raw):{schemaVersion:11,sequence:0,activeId:'',records:{}};
    if(repository.schemaVersion!==11 || !Number.isSafeInteger(repository.sequence) || repository.sequence<0 || typeof repository.activeId!=='string' || !repository.records || typeof repository.records!=='object' || Array.isArray(repository.records) || Object.entries(repository.records).some(([id,a])=>!validRecord(a)||a.id!==id) || repository.activeId && !Object.hasOwn(repository.records,repository.activeId)) throw new Error(STORAGE_ERROR);
    // Read-only adaptation. The original key is never written, removed or cleared.
    const legacy=storage.getItem(LEGACY_STORAGE);
    if(legacy) {
      const record=legacyRecord(legacy);
      if(!Object.hasOwn(repository.records,record.id)) Object.defineProperty(repository.records,record.id,{value:record,writable:true,enumerable:true,configurable:true});
      if(!repository.activeId)repository.activeId=record.id;
      const match=String(record.number).match(/^\d{4}-(\d{6})\/TEC\/AIAD-\d{4}$/);
      if(match)repository.sequence=Math.max(repository.sequence,Number(match[1]));
    }
    return repository;
  } catch { throw new Error(STORAGE_ERROR); }
}
export function loadAiad(storage:StoragePort):Aiad|null {
  const r=readRepository(storage); return r.records[r.activeId] || null;
}
export async function executeAndPersist(storage:StoragePort,a:Aiad,role:Role,cmd:Command) {
  const repository=readRepository(storage), previous=repository.records[a.id], before=storage.getItem(STORAGE), legacyBefore=storage.getItem(LEGACY_STORAGE);
  if(previous && (a.revision!==previous.revision || a.process!==previous.process || a.number!==previous.number || a.relatedProcess!==previous.relatedProcess || JSON.stringify(a.versions)!==JSON.stringify(previous.versions) || JSON.stringify(a.signatures)!==JSON.stringify(previous.signatures) || JSON.stringify(a.audit.slice(0,previous.audit.length))!==JSON.stringify(previous.audit))) throw new Error('O registro foi atualizado em outra sessão ou diverge do conteúdo salvo. Reabra o registro salvo antes de continuar.');
  const result=await execute(a,role,cmd,repository.sequence+1);
  // Optimistic compare immediately before the single synchronous write: no partial formation,
  // stale tab overwrite or separate sequence/process writes. This is a local demo, not a DB.
  if(storage.getItem(STORAGE)!==before || storage.getItem(LEGACY_STORAGE)!==legacyBefore) throw new Error(MSG[14]);
  result.auto.revision=a.revision+1;
  repository.records[a.id]=result.auto; repository.activeId=a.id;
  repository.sequence=Math.max(repository.sequence,result.auto.formationSequence||0);
  try { storage.setItem(STORAGE,JSON.stringify(repository)); }
  catch { throw new Error(MSG[['save','form'].includes(cmd.action)?14:cmd.action==='sign'?15:16]); }
  return result;
}
export function responsibleLabel(a:Aiad) {
  return a.holder==='externo'?a.recipient:a.holder==='tecnico'?a.recipient||USERS.tecnico:a.holder==='coordenacao'?'Coordenação da Fiscalização':'Diretor da Fiscalização';
}
