export type UseType = 'BAR' | 'INT' | 'SUP' | 'SUB' | 'EFL';
export type Answer = '' | 'Sim' | 'Não';
export type EffectiveStatus = 'Rascunho' | 'Passível de outorga' | 'Passível de inexigibilidade de outorga' | 'Passível de dispensa de outorga' | 'Necessária análise técnica' | 'Outorgado' | 'Inexigível' | 'Dispensado' | 'Indeferido' | 'Cancelado';
export type Classification = 'Passível de inexigibilidade de outorga' | 'Passível de dispensa de outorga' | 'Necessária análise técnica' | 'Passível de outorga' | 'Passível de inexigibilidade' | 'Análise técnica necessária' | 'Passível de dispensa';
export type Lifecycle = 'Rascunho' | 'Concluído' | 'Pendente de complementação' | 'Cancelado';
export type Block = 'Localização' | 'Caracterização' | 'Finalidades' | 'Regimes';
export type Value = string | string[];
export type Fields = Record<string, Value>;
export interface Animal { id: string; species: string; system: string; heads: string }
export interface Regime { id: string; flow: string; hours: string; minutes: string; days: string; months: number[] }
export interface Location { latitude: string; longitude: string; datum: 'SIRGAS 2000'; municipality: string; rpga: string; basin: string; waterBody: string; bodyType: string }
export interface Identification {
  actorName: string; actorDocument: string; role: string; representedDocument: string;
  representedName: string; agreementEnabled: Answer; agreement: string; contactEnabled: Answer;
  actorAddress?: string; actorEmail?: string; representedAddress?: string; representedEmail?: string;
  contact: Fields; instrumentId?: string; authorization?: boolean; actorId?: string;
}
export interface Venture {
  id: string; name: string; holder: string; document: string; email: string; phone: string;
  property: string; address: string; municipality: string; latitude: string; longitude: string;
  addressFields?: { cep: string; street: string; number: string; neighborhood: string; complement: string };
  polygon?: [number, number][]; propertyName?: string;
  water: Answer; intervention: Answer; capture: Answer; discharge: Answer;
  // Absent only in v3 fixtures: retain their previously enabled types on migration.
  selectedTypes?: UseType[];
  draft?: boolean; unsaved?: boolean;
  identification: Identification; holderId?: string; propertyId?: string; linkedUserIds?: string[]; savedStages?: string[]; creationAudit?: { date: string; author: string };
}
export interface PointData {
  location: Location; technical: Fields; purposes: string[]; purposeData: Record<string, Fields>;
  animals: Animal[]; regimes: Regime[]; appoFile?: { name: string; size: number };
}
export interface HistoryEvent {
  id: string; date: string; event: string; author: string; profile: string; reason?: string;
  changes?: { field: string; before: string; after: string }[]; version: number;
}
export interface EditRequest {
  id: string; date: string; author: string; profile: string; reason: string; requested: Block[];
  approved: Block[]; status: 'Pendente' | 'Aprovada' | 'Recusada' | 'Utilizada';
  decisionReason?: string; decidedBy?: string; decidedAt?: string;
}
export interface Cnarh {
  state: 'indisponível' | 'sem retorno' | 'retorno' | 'erro'; processClosed: boolean;
  attemptedAt?: string; updatedAt?: string; lastResult?: Record<string, string>;
}
export interface RelatedComposition {
  entries: { id: string; number: string; value?: number }[];
  own?: number; total?: number; unit: 'hm³' | 'm³/h' | 'm³' | 'L/s';
}
export interface Point extends PointData {
  id: string; ventureId: string; type: UseType; unsaved?: boolean; number?: string; createdAt: string;
  lifecycle: Lifecycle; classification: Classification; tramitation?: string; process?: string;
  // Definitive returned situation; never inferred from an intermediate tramitation.
  processSituation?: string;
  agreement?: string; version: number; author: string; history: HistoryEvent[];
  identification?: Identification;
  certificateNumber?: string;
  requests: EditRequest[]; snapshots: { version: number; data: PointData; classification: Classification }[];
  cnarh: Cnarh; eligibleRelatedIds: string[]; consideredFlow?: number; originId?: string;
  relatedComposition?: RelatedComposition; holderId?: string; propertyId?: string; effectiveStatus?: EffectiveStatus; firstSentAt?: string; authorId?: string; purposeLabels?: Record<string, string>; requerimento?: { number: string; name: string; document: string; email: string };
}
export interface CerhNotification { id: string; recipient: string; pointId: string; number: string; decision: string; reason: string; date: string; read: boolean }
export interface Submission { id: string; ventureId: string; pointIds: string[]; date: string; actor: string; recipient: string; internal: boolean }
export interface CerhData { revision: 1; schemaVersion?: 2; ventures: Venture[]; points: Point[]; sequence: number; notifications?: CerhNotification[]; submissions?: Submission[] }
export interface Session { email?: string; name: string; profile: 'Técnico' | 'Conveniado' | 'Requerente' | 'Procurador' | 'Responsável técnico' | 'DIRAM' | 'Sem vínculo'; authorized: boolean; agreements: string[]; userId?: string; grants?: string[]; groupIds?: string[]; personId?: string; external?: boolean; instrumentIds?: string[] }
export const useTypes: Record<UseType, string> = {
  BAR: 'Barragem', INT: 'Outros tipos de intervenção', SUP: 'Captação superficial',
  SUB: 'Captação subterrânea', EFL: 'Lançamento de efluentes',
};
export const useTypeOrder: UseType[] = ['BAR', 'INT', 'SUP', 'SUB', 'EFL'];
export const blocks: Block[] = ['Localização', 'Caracterização', 'Finalidades', 'Regimes'];
export const classifications = ['Passível de outorga', 'Passível de inexigibilidade de outorga', 'Passível de dispensa de outorga', 'Necessária análise técnica'];
export const officialStatuses = ['Outorgado', 'Inexigível', 'Dispensado', 'Indeferido'] as const;
export const ressalva = 'A inscrição no Cadastro Estadual de Recursos Hídricos — CERH não autoriza, por si só, o uso de recursos hídricos.';
