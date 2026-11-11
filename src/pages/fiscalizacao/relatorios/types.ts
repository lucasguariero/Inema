export type ReportKind = 'DOR008' | 'DOR009';
export type ReportStatus = 'Rascunho' | 'Finalizado' | 'Devolvido para ajuste';
export type Role = 'tecnico' | 'gestor' | 'consulta' | 'externo';
export interface Actor { id: string; name: string; role: Role }
export interface Person { name: string; document: string; address: string; complement: string; cep: string; email: string; phone: string }
export interface Participant { id: string; userId: string; name: string; job: string; phone: string; email: string; responsible: boolean }
export interface Company { id: string; name: string; document: string; representatives: Participant[] }
export interface Attendance { id: string; start: string; end: string; overlapConfirmed?: string }
export interface Coordinate { id: string; format: 'decimal' | 'gms' | 'utm23' | 'utm24'; original: string; datum: 'WGS84-demo'; lat: number; lng: number }
export interface GeoLayer { coordinateId: string; layer: string; status: 'ok' | 'empty' | 'unavailable'; values: { id: string; text: string; distance?: number; selected: boolean }[]; rule: 'toca' | '500m' | 'mais próxima' }
export interface GeoResult { at: string; mode: 'success' | 'empty' | 'partial' | 'unavailable'; coordinateFingerprint: string; layers: GeoLayer[] }
export interface Attachment { id: string; name: string; format: string; mime: string; size: number; description: string; user: string; at: string; purpose: 'image' | 'attachment'; blob: Blob }
export interface Infraction {
 id: string; description: string; annexVI: string[]; sources: string[]; articles: string[]; clauses: Record<string, string[]>; other: string;
 criteria: string[]; reasons: Record<string, string>; mitigating: string[]; aggravating: string[]; aggravatingVII: string[];
 nature: string; natureFormal: string[]; severity: string; penalties: string[]; recipient: Person; differentRecipient: boolean; recipientReason: string;
}
export interface Notification { id: string; description: string; summary: string; recipient: Person; differentRecipient: boolean; recipientReason: string; processId: string; summarySource: 'manual' }
export interface AuditEvent { id: string; actor: string; role: Role; at: string; action: string; detail: string; revision: number; from?: string; to?: string }
export interface Provenance { sourceId: string; label: string; at: string; reviewed: boolean }
export interface ReportContent {
 originator: string; person: Person; participants: Participant[]; location: { address: string; number: string; municipality: string; reference: string };
 coordinates: Coordinate[]; geo?: GeoResult; history: { id: string; process: string; date: string; type: string; detail: string }[];
 description: string; conclusion: string; outcomes: string[]; infractions: Infraction[]; notifications: Notification[]; attachments: Attachment[];
 provenance: Record<string, Provenance>;
}
export interface RfaContent extends ReportContent { attendance: Attendance }
export interface RaeContent extends ReportContent { attendances: Attendance[]; relatedProcesses: string[]; companies: Company[]; recommendations: string }
interface BaseReport { id: string; authorId: string; authorName: string; status: ReportStatus; revision: number; version: number; createdAt: string; updatedAt: string; finalizedAt?: string; number?: string; audit: AuditEvent[]; returnReason?: string; pendingQueries?: { at: string; scope: 'geo' | 'history' | 'person'; detail: string }[] }
export type RfaReport = BaseReport & { kind: 'DOR008'; content: RfaContent; versions: { version: number; at: string; content: RfaContent }[] };
export type RaeReport = BaseReport & { kind: 'DOR009'; content: RaeContent; versions: { version: number; at: string; content: RaeContent }[] };
export type Report = RfaReport | RaeReport;
export interface Repository { schema: 1; records: Report[]; sequences: Record<string, number>; deleted: { id: string; kind: ReportKind; at: string; actor: string; audit: AuditEvent[] }[] }
export type Command = { action: 'save' | 'finalize'; report: Report; expectedRevision: number } | { action: 'return' | 'delete'; id: string; expectedRevision: number; reason?: string };
export type Errors = Record<string, string>;
