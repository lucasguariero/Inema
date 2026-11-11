import { PENALIDADES, CRITERIOS_250, CRITERIOS_251 } from './aiadNormas';
import { documentoValido } from './pautaGestor';
import { CLAUSES as NORMAS_CLAUSES } from './aiadNormas';

export const AIAD_TITLE = 'Auto de Infração - Advertência';
export const FUNDAMENTO = 'Art. 180, I, da Lei 10.431 de 20/12/2006, c/c Art. 248, I do Regulamento, aprovado pelo Decreto Estadual nº 14.024 de 06/06/2012.';

export const MSG: Record<number, string> = {
  1: 'Preencha os campos obrigatórios destacados.',
  2: 'Informe um CPF ou CNPJ válido.',
  3: 'O texto de outras normas deve possuir no máximo 500 caracteres.',
  4: 'Rascunho salvo com sucesso.',
  5: 'Após a assinatura, qualquer alteração exigirá uma nova versão e novas assinaturas. Deseja continuar?',
  6: 'Documento assinado com sucesso.',
  7: 'Deseja encaminhar o Auto de Infração para a Coordenação Técnica?',
  8: 'Auto de Infração encaminhado com sucesso.',
  9: 'Informe a justificativa da solicitação de ajuste.',
  10: 'Solicitação de ajuste enviada ao técnico autor.',
  11: 'Deseja expedir o Auto de Infração?',
  12: 'Auto de Infração expedido com sucesso.',
  13: 'Você não possui permissão para realizar esta ação.',
  14: 'Não foi possível salvar o Auto de Infração. Tente novamente.',
  15: 'Não foi possível assinar o documento. Tente novamente.',
  16: 'Não foi possível concluir a tramitação. Tente novamente.',
  17: 'O arquivo selecionado não atende aos formatos ou limites permitidos.',
  18: 'A data de elaboração do auto não pode ser futura.',
  19: 'Coordenada validada.',
  20: 'Informe uma coordenada válida para o tipo selecionado.',
  21: 'A pessoa autuada não possui correspondência eletrônica reconhecida. Encaminhe o auto à ATEND.',
  22: 'Não existem informações sobre empreendimentos vinculados ao CNPJ informado.',
  23: 'Auto salvo com status Formado. Processo relacionado criado com sucesso.',
  24: 'Selecione a área para encaminhar o processo.',
  25: 'Análise técnica concluída. Processo devolvido à coordenação.',
  26: 'Não foi possível gerar o PDF do Auto de Infração. Tente novamente.',
  27: 'Não foi possível visualizar o Auto de Infração. Tente novamente.',
  28: 'O encaminhamento à ATEND só é permitido após o decurso integral do prazo de defesa ou recurso.',
  29: 'Valide ao menos um par de coordenadas e corrija ou remova os pares incompletos ou inválidos antes de assinar.',
  30: 'Não foi possível obter a localização do dispositivo. Utilize a digitação manual ou a seleção pelo mapa.',
  31: 'Não foi possível carregar o mapa. Tente novamente ou utilize as demais formas de preenchimento.'
};

export const LEG: Record<number, string> = {
  1: 'Gerado ao salvar o auto elaborado como Formado; rascunhos não possuem número definitivo. RN005 e RN066.',
  2: 'Quando não houver vínculo, será exibido “Sem processo vinculado”. Após a vinculação, será apresentado automaticamente o número do processo originador.',
  3: 'Informe somente um documento válido da pessoa autuada.',
  4: 'Selecione o empreendimento ou a atividade vinculada ao CNPJ.',
  5: 'Preenchida no início da elaboração; pode ser alterada antes da assinatura ou em retorno autorizado para ajuste.',
  6: 'Descreva objetivamente a conduta, os fatos constatados e a degradação ou o risco identificado.',
  7: 'Informe local, endereço, CEP, município e estado.',
  8: 'Selecione a norma, o artigo e os respectivos desdobramentos aplicáveis.',
  9: 'Informe outras normas infringidas em até 500 caracteres.',
  10: 'Prazo para defesa junto ao INEMA: 20 dias da ciência do Auto, de acordo com o Art. 192, I, da Lei 10.431 de 20/12/2006.',
  11: 'Prazo para recurso ao CEPRAM: 20 dias da decisão do INEMA, de acordo com o Art. 192, II, da Lei 10.431 de 20/12/2006.',
  12: 'Assinatura do técnico autor do auto.',
  13: 'Assinatura do gestor responsável pela validação.',
  14: 'Informe claramente as correções necessárias.',
  15: 'Inclua documentos relacionados à infração ou à diligência técnica.',
  16: 'Preenchimento parcial, sem número definitivo e sem formação do processo do auto.'
};

export const DEFENSE_TEXT = 'Prazo para defesa junto ao INEMA: 20 dias da ciência do Auto, de acordo com o Art. 192, I, da Lei 10.431 de 20/12/2006.';
export const APPEAL_TEXT = 'Prazo para recurso ao CEPRAM: 20 dias da decisão do INEMA, de acordo com o Art. 192, II, da Lei 10.431 de 20/12/2006.';

export type Role = 'tecnico' | 'coordenacao' | 'diretoria';
export const ROLES: Record<Role, string> = {
  tecnico: 'Técnico Autor',
  coordenacao: 'Coordenação da Fiscalização',
  diretoria: 'Diretor da Fiscalização'
};

export const USERS: Record<Role, string> = {
  tecnico: 'Ana Ribeiro — demonstração',
  coordenacao: 'Carlos Souza — demonstração',
  diretoria: 'Marina Lima — demonstração'
};

export const STATUS = {
  formado: 'Formado',
  ajustes: 'Pendente de ajuste',
  validado: 'Validado',
  expedido: 'Expedido',
  aguardando: 'Aguardando expedição',
  devolvido: 'Devolvido para área',
  tecnico: 'Encaminhado para técnico',
  analise: 'Análise técnica concluída',
  area: 'Encaminhado para área'
} as const;

export type Status = 'rascunho' | keyof typeof STATUS;
export type Holder = Role | 'externo';
export const LEGACY_NOTICE = 'Registro legado preservado, somente leitura: a conciliação de status, processo e assinaturas exige confirmação. Nenhum vínculo ou número foi recriado.';

export type CoordType = 'decimal' | 'gms' | 'utm23' | 'utm24';

export interface Coordinates {
  type: CoordType;
  lat: string;
  lon: string;
  latD: string;
  latM: string;
  latS: string;
  lonD: string;
  lonM: string;
  lonS: string;
  validated: boolean;
  id?: string;
}

export interface CoordinatePair extends Coordinates {
  id: string;
}

export interface Infraction {
  id: string;
  characterization: string;
  annexVI: string;
  criteria250: string[];
  criteria251: string[];
  criterion251VII: string[];
  optionalCriteria: Record<string, string>;
  nature: string;
  formalItems: string[];
  severity: string;
  penalties: string[];
  source: string;
  sources?: string[];
  article: string;
  clause: string;
  devices?: { article: string; clause: string }[];
  other: string;
}

export function newInfraction(): Infraction {
  return { id: crypto.randomUUID(), characterization: '', annexVI: '', criteria250: [], criteria251: [], criterion251VII: [], optionalCriteria: {}, nature: '', formalItems: [], severity: '', penalties: [], source: '', article: '', clause: '', other: '' };
}
export function getInfractions(f: Fields): Infraction[] {
  if (f.infractions?.length) return f.infractions;
  return [{ ...newInfraction(), id: 'legacy-primary', characterization: f.characterization || '', source: f.source, article: f.article, clause: f.clause, other: f.other }];
}
export function infractionSummary(i: Infraction): string {
  return [`Caracterização: ${i.characterization || 'Não informada'}`, i.annexVI && `Anexo VI: ${i.annexVI}`,
    `Art. 249: I, II, VI${Object.keys(i.optionalCriteria).length ? ', ' + Object.keys(i.optionalCriteria).join(', ') : ''}`,
    ...Object.entries(i.optionalCriteria).map(([key,value]) => `${key}: ${value}`),
    `Art. 250: ${i.criteria250.map(code => CRITERIOS_250.find(t => t.startsWith(code + ' ')) || code).join('; ') || '—'}; Art. 251: ${i.criteria251.map(code => CRITERIOS_251.find(t => t.startsWith(code + ' ')) || code).join('; ') || '—'}${i.criterion251VII.length ? ' (VII: ' + i.criterion251VII.join(', ') + ')' : ''}`,
    `Art. 257: ${i.nature || '—'}${i.formalItems.length ? ' (' + i.formalItems.join(', ') + ')' : ''}; Art. 258: ${i.severity || '—'}; Penalidades: ${i.penalties.join(', ') || '—'}`,
    `Fontes: ${(i.sources || (i.source ? [i.source] : [])).join(', ') || '—'}; Dispositivos: ${(i.devices?.length ? i.devices : [{article:i.article,clause:i.clause}]).map(d => `${d.article || '—'} ${d.clause || '—'}`).join('; ')}`,
    i.other && `Outras normas: ${i.other}; art. 254, parágrafo único, VIII`].filter(Boolean).join('\n');
}
export interface Fields {
  document: string;
  name: string;
  enterprise: string;
  address: string;
  cep: string;
  city: string;
  uf: string;
  email: string;
  phone: string;
  date: string;
  inspectionDate?: string;
  inspectionTime?: string;
  facts: string;
  characterization?: string;
  infractions?: Infraction[];
  inspection: string;
  inspectionAddress: string;
  inspectionCep: string;
  inspectionCity: string;
  inspectionUf: string;
  source: string;
  article: string;
  clause: string;
  other: string;
  coords: Coordinates;
  coordsList?: CoordinatePair[];
}

export interface Attachment {
  id: string;
  name: string;
  format: string;
  size: number;
  description: string;
  user: string;
  at: string;
  kind: string;
  scope?: 'auto' | 'processo';
}

export interface Signature {
  user: string;
  role: Role;
  at: string;
  hash: string;
  version: number;
  signedProcess?: string;
  simulatedFixture?: boolean;
  fixtureContent?: string;
}

export interface Event {
  user: string;
  profile: string;
  at: string;
  action: string;
  version: number;
  detail: string;
  origin?: string;
  destination?: string;
  statusBefore?: Status;
  statusAfter?: Status;
  result?: string;
}

export interface Snapshot {
  version: number;
  fields: Fields;
  signatures: Signature[];
  attachments: Attachment[];
  reason: string;
  number?: string;
  relatedProcess?: string;
  process?: string;
  status?: Status;
  dispatch?: Aiad['dispatch'];
}

export interface AiadDispatch {
  at: string;
  user: string;
  role: Role;
  recipient?: string;
  receiptAt?: string;
  termDays?: number;
  termEndAt?: string;
  termCompleted?: boolean;
}

export interface Aiad {
  id: string;
  process: string;
  eligible: boolean;
  number: string;
  version: number;
  status: Status;
  fields: Fields;
  emailValidated: boolean;
  electronicNoticeRecognized?: boolean;
  signatures: Signature[];
  attachments: Attachment[];
  audit: Event[];
  versions: Snapshot[];
  dispatch?: AiadDispatch;
  diligence: boolean;
  adjustmentAuthorized: boolean;
  request: string;
  recipient: string;
  lastSavedFields?: Fields;
  schemaVersion: 11;
  revision: number;
  holder: Holder;
  relatedProcess: string;
  formationSequence?: number;
  adjustmentsConfirmed: boolean;
  analysisConfirmed: boolean;
  returnDocumentIds: string[];
  returnBaseline?: Fields;
  returnContext?: { origin: string; recommendation: string; documents: string[] };
  legacyReview?: boolean;
  legacyRecord?: unknown;
}

export function statusLabel(a: Aiad): string {
  return a.legacyReview ? 'Registro legado — conciliação pendente' : a.status === 'rascunho' ? 'Rascunho' : STATUS[a.status];
}

export type Action =
  | 'linkProcess'
  | 'save'
  | 'form'
  | 'sign'
  | 'coordination'
  | 'adjust'
  | 'director'
  | 'atend'
  | 'toTechnician'
  | 'conclude'
  | 'toArea'
  | 'beginCorrection'
  | 'attach'
  | 'remove'
  | 'expedir'
  | 'receipt'
  | 'termElapsed';

export interface Command {
  action: Action;
  reason?: string;
  process?: string;
  recipient?: string;
  attachment?: Attachment;
  attachmentId?: string;
  fail?: boolean;
  confirmAdjustments?: boolean;
  confirmAnalysis?: boolean;
  authorizeCorrection?: boolean;
}

export const SOURCES = [
  { value: 'estadual', label: 'Leis Estaduais nº 10.431/2006 e nº 11.612/2009 e Regulamento (Decreto nº 14.024/2012)' },
  { value: 'federal', label: 'Lei Federal nº 9.605/1998 e Decreto Federal nº 6.514/2008' },
  { value: 'outras', label: 'Outras normas' }
];

export const ARTICLES = [
  { value: '254', label: 'Art. 254 — Risco ou efetiva poluição ou degradação' },
  { value: '254pu', label: 'Art. 254, Parágrafo Único — Infrações administrativas gerais e cadastrais' },
  { value: '255', label: 'Art. 255 — Infrações ao regime de recursos hídricos e outorga' }
];

export const CLAUSES: Record<string, string[]> = {
  '254': [
    'I - risco de poluição ou degradação;',
    'II - efetiva poluição ou degradação ambiental;',
    'III - emissão, lançamento ou liberação de efluentes líquidos, gasosos ou resíduos sólidos em desacordo com os padrões estabelecidos ou capaz de ultrapassar padrões de qualidade ambiental.',
    ...(NORMAS_CLAUSES['254'] || [])
  ],
  '254pu': [
    'I - ausência ou desacordo de licenças;',
    'II - descumprimento de normas;',
    'III - condicionantes;',
    'IV - TCRA;',
    'V - termo de compromisso;',
    'VI - determinações ambientais;',
    'VII - embaraço à fiscalização;',
    'VIII - inobservância da legislação;',
    'IX - informação falsa ou omitida;',
    'X - irregularidade cadastral;',
    'XI - falta de registro no SEIA.',
    ...(NORMAS_CLAUSES['254pu'] || [])
  ],
  '255': [
    'I - captação ou uso sem outorga;',
    'II - poços;',
    'III - obras que afetem recursos hídricos;',
    'IV - fraude de medições;',
    'V - interferência em corpos hídricos;',
    'VI - infração à legislação hídrica;',
    'VII - lançamento sem outorga.',
    ...(NORMAS_CLAUSES['255'] || [])
  ]
};

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const digits = (v: string) => v.replace(/\D/g, '');

export function maskDocument(v: string) {
  const d = digits(v).slice(0, 14);
  return d.length <= 11
    ? d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    : d.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function maskDecimal(v: string) {
  const d = digits(v).slice(0, 8);
  return d ? `-${d.slice(0, 2)}${d.length > 2 ? ',' + d.slice(2) : ''}` : '';
}

export function maskSeconds(v: string, pad = false) {
  let d = digits(v).slice(0, 4);
  if (!d) return '';
  if (pad) d = d.padEnd(4, '0');
  return d.length > 2 ? d.slice(0, 2) + ',' + d.slice(2) : d;
}

export function validCoordinates(c: Coordinates) {
  if (c.type === 'decimal') {
    return /^-\d{2},\d{1,6}$/.test(c.lat) && /^-\d{2},\d{1,6}$/.test(c.lon) && Math.abs(Number(c.lat.replace(',', '.'))) <= 90 && Math.abs(Number(c.lon.replace(',', '.'))) <= 180 && c.lat.length <= 10 && c.lon.length <= 10;
  }
  if (c.type === 'gms') {
    return ['lat', 'lon'].every(axis => {
      const [d, m, s] = axis === 'lat' ? [c.latD, c.latM, c.latS] : [c.lonD, c.lonM, c.lonS];
      const deg = Number(d), min = Number(m), sec = Number(s.replace(',', '.')), max = axis === 'lat' ? 90 : 180;
      return /^\d{1,2}$/.test(d) && /^\d{1,2}$/.test(m) && /^\d{2},\d{2}$/.test(s) && deg <= max && min < 60 && sec < 60 && (deg < max || (min === 0 && sec === 0));
    });
  }
  return /^\d+$/.test(c.lat) && /^\d+$/.test(c.lon) && Number.isSafeInteger(Number(c.lat)) && Number.isSafeInteger(Number(c.lon)) && Number(c.lat) > 0 && Number(c.lon) > 0;
}

export function coordinateText(c: Coordinates) {
  return c.type === 'gms'
    ? `${c.latD}° ${c.latM}′ ${c.latS}″ / ${c.lonD}° ${c.lonM}′ ${c.lonS}″`
    : `${c.lat} / ${c.lon} (${c.type.toUpperCase()})`;
}

export function getCoordsList(f: Fields): CoordinatePair[] {
  if (f.coordsList && f.coordsList.length > 0) {
    if (f.coords.validated && !f.coordsList[0].validated) {
      f.coordsList[0].validated = true;
    }
    return f.coordsList;
  }
  return [{ ...f.coords, id: 'coord-main' }];
}

export function allCoordinatesText(f: Fields): string {
  const list = getCoordsList(f);
  return list.map((c, i) => `Ponto ${i + 1}: ${coordinateText(c)}`).join('; ');
}

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

export function diaPorExtenso(day: number): string {
  const nomes = [
    '', 'primeiro', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
    'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove', 'vinte',
    'vinte e um', 'vinte e dois', 'vinte e três', 'vinte e quatro', 'vinte e cinco', 'vinte e seis', 'vinte e sete', 'vinte e oito', 'vinte e nove', 'trinta',
    'trinta e um'
  ];
  return nomes[day] || String(day);
}

export function cleanFactsDescription(facts: string): string {
  let text = (facts || '').trim().replace(/[\.\s]+$/, '');
  const duranteMatch = text.match(/^durante\s+(?:a\s+)?(?:inspeção|vistoria|fiscalização|diligência)[,\s]*(?:foi\s+constatad[oa]\s+|constatou-se\s+(?:que\s+)?)?(.*)$/i);
  if (duranteMatch && duranteMatch[1]) {
    text = duranteMatch[1].trim();
  }
  return text || 'infração ambiental constatada';
}

export function formatAiadDisplayNumber(number: string | undefined): string {
  if (!number) return 'Rascunho em elaboração';
  if (number.includes('DEMO-CENARIO/') || number.includes('AIAD-MOCK-')) {
    const parts = number.split('-');
    const suffix = parts[parts.length - 1] || 'DEMO';
    return `AIAD-DEMO nº ${suffix.slice(0, 8).toUpperCase()}/2026`;
  }
  return number;
}

export function formatAiadDisplayProcess(process: string | undefined): string {
  if (!process) return 'Aguardando formação';
  if (process.includes('DEMO-AIAD-') && process.includes('MOCK-')) {
    const parts = process.split('-');
    const suffix = parts[parts.length - 1] || 'DEMO';
    return `PROC-DEMO nº ${suffix.slice(0, 8).toUpperCase()}/2026`;
  }
  return process;
}

export function formatLocalPreposition(local: string): string {
  const l = (local || '').trim();
  if (!l || l.toLowerCase() === 'local da inspeção') return 'no local da inspeção';
  if (/^(?:no|na|em|num|numa)\s+/i.test(l)) return l;
  if (/^(?:área|fazenda|propriedade|chácara|gleba|sede|rodovia|estrada|comunidade|baixa|reserva|estação|margem|vila)\b/i.test(l)) {
    return `na ${l}`;
  }
  return `no ${l}`;
}

export function composedText(a: Aiad) {
  const f = a.fields;
  const d = f.date ? new Date(f.date + 'T12:00:00') : new Date();
  const day = !Number.isNaN(d.getTime()) ? d.getDate() : 21;
  const monthName = !Number.isNaN(d.getTime()) ? MESES[d.getMonth()] : 'outubro';
  const year = !Number.isNaN(d.getTime()) ? d.getFullYear() : 2026;
  const diaExtenso = diaPorExtenso(day);

  const inspDate = f.inspectionDate
    ? new Date(f.inspectionDate + 'T12:00:00')
    : new Date('invalid');
  const inspDateStr = !Number.isNaN(inspDate.getTime()) ? inspDate.toLocaleDateString('pt-BR') : (f.inspectionDate || 'data não informada');
  const timeStr = f.inspectionTime ? (f.inspectionTime.includes('hora') ? f.inspectionTime : `${f.inspectionTime} horas`) : 'horário não informado';
  
  const localFormatted = formatLocalPreposition(f.inspection);
  const endParts = [
    f.inspectionAddress || f.address,
    (f.inspectionCep || f.cep) ? `CEP ${f.inspectionCep || f.cep}` : '',
    `${f.inspectionCity || f.city || 'Salvador'}/${f.inspectionUf || f.uf || 'BA'}`
  ].filter(Boolean).map(s => String(s).trim().replace(/[\,\.]+$/, ''));
  const enderecoStr = endParts.join(', ');
  const coordsDesc = allCoordinatesText(f);
  const factsDesc = cleanFactsDescription(f.facts);

  const abertura = `Aos ${diaExtenso} dias do mês de ${monthName} de ${year}, o Instituto do Meio Ambiente e Recursos Hídricos - INEMA, por meio da sua Coordenação Técnica, aplica ao supracitado a penalidade de ADVERTÊNCIA por ${factsDesc}.`;
  const constata = `A infração foi constatada no dia ${inspDateStr}, às ${timeStr}, ${localFormatted}, localizado na ${enderecoStr}, no ponto de coordenadas geográficas ${coordsDesc}.`;
  const fundamento = `Fundamento legal: ${FUNDAMENTO}`;

  return `${abertura} ${constata} ${fundamento}`;
}

export const formed = (a: Aiad) => !!a.number && !!a.relatedProcess;
export const currentSignature = (a: Aiad, role: Role) => a.signatures.find(s => s.role === role && s.version === a.version);
export const editable = (a: Aiad, role: Role) =>
  !a.legacyReview &&
  role === 'tecnico' &&
  a.holder === 'tecnico' &&
  a.signatures.length === 0 &&
  (['rascunho', 'formado', 'ajustes'].includes(a.status) || (a.status === 'tecnico' && a.adjustmentAuthorized));

export const validatedEmail = (a: Aiad) => a.emailValidated && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.fields.email);

export function updateField<K extends keyof Fields>(a: Aiad, key: K, value: Fields[K]): Aiad {
  const next = structuredClone(a);
  const oldVal = next.fields[key];
  next.fields[key] = value;
  if (key === 'document') {
    const oldDigits = digits(String(oldVal));
    const newDigits = digits(String(value));
    if (oldDigits !== newDigits) {
      next.emailValidated = false;
      next.electronicNoticeRecognized = false;
      next.fields.enterprise = '';
    }
  } else if (key === 'email') {
    if (String(oldVal).trim().toLowerCase() !== String(value).trim().toLowerCase()) {
      next.emailValidated = false;
      next.electronicNoticeRecognized = false;
    }
  } else if (key === 'coords') {
    const coordsVal = value as Coordinates;
    if (next.fields.coordsList && next.fields.coordsList.length > 0) {
      next.fields.coordsList[0] = { ...coordsVal, id: next.fields.coordsList[0].id || 'coord-main' };
    }
  }
  return next;
}

export function updateCoordsList(a: Aiad, list: CoordinatePair[]): Aiad {
  const next = structuredClone(a);
  next.fields.coordsList = list;
  if (list.length > 0) {
    next.fields.coords = { ...list[0] };
  }
  return next;
}

export const DILIGENCE_TECHNICAL_FIELDS: (keyof Fields)[] = [
  'facts', 'inspection', 'inspectionAddress', 'inspectionCep', 'inspectionCity', 'inspectionUf',
  'coords', 'source', 'article', 'clause', 'other', 'infractions', 'date', 'inspectionDate', 'inspectionTime'
];

export function diligenceAnswered(a: Aiad): boolean {
  return (
    (a.returnDocumentIds.length > 0 && a.attachments.some(att => a.returnDocumentIds.includes(att.id))) ||
    (!!a.returnBaseline && a.adjustmentAuthorized && JSON.stringify(a.returnBaseline) !== JSON.stringify(a.fields))
  );
}

export function fieldErrors(a: Aiad): Record<string, string> {
  const f = a.fields, errors: Record<string, string> = {};
  for (const key of ['name', 'address', 'city', 'uf', 'facts', 'date', 'inspection', 'inspectionAddress', 'inspectionCity', 'inspectionUf'] as const) {
    if (!f[key]?.trim()) errors[key] = MSG[1];
  }
  if (a.process && !a.eligible) errors.process = MSG[1];
  const infractions = getInfractions(f);
  infractions.forEach((i, index) => {
    const prefix = `Infração ${index + 1}: `;
    if (!i.characterization.trim() || i.characterization.length > 1000) errors.infractions = prefix + 'informe a caracterização em até 1.000 caracteres.';
    else if (!i.criteria250.length && !i.criteria251.length) errors.infractions = prefix + 'selecione ao menos uma circunstância dos arts. 250 ou 251.';
    else if (i.criteria251.includes('VII') && !i.criterion251VII.length) errors.infractions = prefix + 'selecione o desdobramento do art. 251, VII.';
    else if (Object.values(i.optionalCriteria).some(v => !v.trim() || v.length > 500)) errors.infractions = prefix + 'preencha os critérios opcionais em até 500 caracteres.';
    else if (!['formal','material'].includes(i.nature) || (i.nature === 'formal' && !i.formalItems.length)) errors.infractions = prefix + 'complete o enquadramento do art. 257.';
    else if (!PENALIDADES[i.severity] || !i.penalties.length || i.penalties.some(p => !PENALIDADES[i.severity].includes(p))) errors.infractions = prefix + 'selecione gravidade e penalidade aplicável.';
    else if (!(i.sources || (i.source ? [i.source] : [])).some(source => SOURCES.some(s => s.value === source))) errors.infractions = prefix + 'selecione a fonte normativa.';
    else if ((i.sources || [i.source]).includes('estadual') && !(i.devices?.length ? i.devices : [{article:i.article,clause:i.clause}]).some(d => (CLAUSES[d.article] || []).includes(d.clause))) errors.infractions = prefix + 'selecione artigo e desdobramento.';
    else if ((i.sources || [i.source]).includes('federal')) errors.infractions = prefix + 'catálogo federal completo pendente de fornecimento.';
    else if ((i.sources || [i.source]).includes('outras') && !i.other.trim()) errors.infractions = prefix + 'descreva outras normas.';
    else if (i.other.length > 500) errors.infractions = prefix + 'outras normas limitadas a 500 caracteres.';
  });
  if (!f.inspectionDate) errors.inspectionDate = MSG[1];
  if (!f.inspectionTime) errors.inspectionTime = MSG[1];
  if (f.document && !documentoValido(f.document)) errors.document = MSG[2];
  if (f.date > today()) errors.date = MSG[18];
  if (f.date && !/^\d{4}-\d{2}-\d{2}$/.test(f.date)) errors.date = MSG[1];
  const parsedDate = new Date(f.date + 'T12:00:00Z');
  if (f.date && (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== f.date)) errors.date = MSG[1];
  
  if (f.inspectionDate) {
    if (f.inspectionDate > today()) errors.inspectionDate = MSG[18];
    const inspectionDate = new Date(f.inspectionDate + 'T12:00:00Z');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.inspectionDate) || Number.isNaN(inspectionDate.getTime()) || inspectionDate.toISOString().slice(0, 10) !== f.inspectionDate) errors.inspectionDate = MSG[1];
  }
  if (f.inspectionTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(f.inspectionTime)) errors.inspectionTime = MSG[1];


  if (!validCoordinates(f.coords) || !f.coords.validated) {
    errors.coords = MSG[20];
  } else if (f.coordsList && f.coordsList.length > 1) {
    const allValid = f.coordsList.every(c => c.validated && validCoordinates(c));
    if (!allValid) {
      errors.coords = MSG[29];
    }
  }

  return errors;
}

export function can(a: Aiad, role: Role, action: Action): boolean {
  if (!Object.hasOwn(ROLES, role) || a.legacyReview || (!Object.hasOwn(STATUS, a.status) && a.status !== 'rascunho')) return false;
  if (a.status !== 'rascunho' && !formed(a)) return false;
  const tech = !!currentSignature(a, 'tecnico'), coord = !!currentSignature(a, 'coordenacao');
  const author = role === 'tecnico' && a.holder === 'tecnico';

  switch (action) {
    case 'linkProcess': return a.holder === role && !a.process;
    case 'save': return editable(a, role) && a.status === 'rascunho';
    case 'form': return editable(a, role) && (!a.process || a.eligible);
    case 'sign': return formed(a) && ((author && editable(a, role) && !tech) || (role === 'coordenacao' && a.holder === 'coordenacao' && ['formado', 'ajustes', 'analise'].includes(a.status) && tech && !coord));
    case 'coordination': return author && ['formado', 'ajustes'].includes(a.status) && tech;
    case 'adjust': return role === 'coordenacao' && a.holder === 'coordenacao' && ['formado', 'ajustes'].includes(a.status) && tech && !coord;
    case 'director': return role === 'diretoria' && a.holder === 'diretoria' && !!a.returnContext;
    case 'toTechnician': return role === 'coordenacao' && a.holder === 'coordenacao' && a.status === 'devolvido';
    case 'conclude': return author && a.status === 'tecnico' && diligenceAnswered(a) && (a.signatures.length > 0 || !a.adjustmentAuthorized || tech);
    case 'toArea': return role === 'coordenacao' && a.holder === 'coordenacao' && a.analysisConfirmed && ['analise', 'validado'].includes(a.status) && (!a.adjustmentAuthorized || coord);
    case 'atend':
      if (role === 'coordenacao' && a.holder === 'coordenacao' && a.status === 'validado' && !a.analysisConfirmed && tech && coord && !a.electronicNoticeRecognized && !a.dispatch) return true;
      if (role === 'coordenacao' && a.status === 'expedido' && a.dispatch?.termCompleted === true) return true;
      return false;
    case 'beginCorrection': return author && a.status === 'tecnico' && a.adjustmentAuthorized && a.signatures.length > 0;
    case 'attach': return editable(a, role) || (author && a.status === 'tecnico' && !a.analysisConfirmed);
    case 'remove': return editable(a, role) || (author && a.status === 'tecnico' && !a.analysisConfirmed);
    case 'expedir': return role === 'coordenacao' && a.holder === 'coordenacao' && a.status === 'validado' && tech && coord && !!a.electronicNoticeRecognized && !a.dispatch;
    case 'receipt': return role === 'coordenacao' && a.status === 'expedido' && !!a.dispatch && !a.dispatch.receiptAt;
    case 'termElapsed': return role === 'coordenacao' && a.status === 'expedido' && !!a.dispatch?.receiptAt && !a.dispatch?.termCompleted;
  }
}

export function addAudit(a: Aiad, role: Role, action: string, detail = '', at = new Date().toISOString(), context: Partial<Event> = {}) {
  a.audit.push({
    user: USERS[role],
    profile: ROLES[role],
    at,
    action,
    version: a.version,
    detail,
    origin: a.holder,
    destination: a.holder,
    statusBefore: a.status,
    statusAfter: a.status,
    result: 'sucesso',
    ...context
  });
}

export function nextVersion(a: Aiad, role: Role, reason: string) {
  a.versions.push(structuredClone({
    version: a.version,
    fields: a.fields,
    signatures: a.signatures,
    attachments: a.attachments,
    reason,
    number: a.number,
    relatedProcess: a.relatedProcess,
    process: a.process,
    status: a.status,
    dispatch: a.dispatch
  }));
  a.version++;
  a.signatures = [];
  addAudit(a, role, 'Nova versão', reason);
}

export function signatureContent(a: Aiad) {
  return JSON.stringify({
    process: a.process,
    relatedProcess: a.relatedProcess,
    number: a.number,
    version: a.version,
    fields: a.fields,
    attachments: a.attachments.filter(f => f.scope !== 'processo')
  });
}

export async function integrity(a: Aiad) {
  const bytes = new TextEncoder().encode(signatureContent(a));
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
}

async function verifySignatures(a: Aiad) {
  const checks = await Promise.all(a.signatures.map(async s => {
    const signed = s.signedProcess === undefined ? a : { ...a, process: s.signedProcess };
    return s.version === a.version && (s.simulatedFixture ? s.fixtureContent === signatureContent(signed) : s.hash === await integrity(signed));
  }));
  if (checks.some(ok => !ok)) {
    throw new Error('Integridade da versão assinada divergente. Preserve o registro e solicite ajuste autorizado.');
  }
}

export async function execute(original: Aiad, role: Role, cmd: Command, formationSequence?: number): Promise<{ auto: Aiad; message: string }> {
  if (cmd.action === 'atend' && role === 'coordenacao' && original.status === 'expedido' && original.dispatch && !original.dispatch.termCompleted) {
    throw new Error(MSG[28]);
  }
  if (!can(original, role, cmd.action)) throw new Error(MSG[13]);
  if (cmd.action === 'adjust' && !cmd.reason?.trim()) throw new Error(MSG[9]);
  if (cmd.action === 'toTechnician' && !cmd.recipient?.trim()) throw new Error(MSG[1]);
  if (cmd.action === 'toTechnician' && cmd.recipient !== USERS.tecnico) throw new Error(MSG[13]);
  if (cmd.action === 'toArea' && !cmd.recipient?.trim()) throw new Error(MSG[24]);
  if (cmd.action === 'conclude' && !cmd.confirmAnalysis) throw new Error('Confirme o atendimento da solicitação de retorno.');
  if (cmd.action === 'sign' && role === 'coordenacao' && original.request && !cmd.confirmAdjustments) throw new Error('Confirme que os ajustes solicitados foram atendidos.');
  if (cmd.action === 'sign') {
    const errors = fieldErrors(original);
    if (Object.keys(errors).length) throw new Error(errors.infractions || errors.characterization || errors.document || errors.date || errors.coords || errors.other || errors.article || errors.inspectionDate || errors.inspectionTime || MSG[1]);
  }
  if (cmd.action === 'atend' && original.status === 'expedido' && !original.dispatch?.termCompleted) {
    throw new Error(MSG[28]);
  }

  if (original.signatures.length) await verifySignatures(original);
  if (cmd.fail) throw new Error(MSG[['save', 'form'].includes(cmd.action) ? 14 : cmd.action === 'sign' ? 15 : 16]);

  const a = structuredClone(original), at = new Date().toISOString(), before = a.status, origin = a.holder;
  let message = MSG[8], action = cmd.action as string;

  switch (cmd.action) {
    case 'linkProcess':
      if (!cmd.process?.trim()) throw new Error(MSG[1]);
      a.signatures.forEach(s => { if (s.signedProcess === undefined) s.signedProcess = a.process; });
      a.process = cmd.process.trim();
      a.eligible = true;
      action = 'Vínculo posterior de processo originador';
      message = 'Processo originador vinculado; número e processo do auto preservados.';
      break;
    case 'save':
      a.lastSavedFields = structuredClone(a.fields);
      action = 'Rascunho salvo';
      message = MSG[4];
      break;
    case 'form': {
      if (!formed(a)) {
        if (a.number || a.relatedProcess || !Number.isSafeInteger(formationSequence) || formationSequence! <= 0 || formationSequence! > 9999) throw new Error(MSG[14]);
        const seq = String(formationSequence);
        a.number = `${today().slice(0, 4)}-${seq.padStart(6, '0')}/TEC/AIAD-${seq.padStart(4, '0')}`;
        a.relatedProcess = `DEMO-AIAD-${a.id}`;
        a.formationSequence = formationSequence;
        a.status = 'formado';
        action = 'Formação do auto e processo relacionado';
        message = MSG[23];
      } else {
        action = 'Atualização do auto formado';
        message = 'Auto atualizado. Número e processo relacionado preservados.';
      }
      a.lastSavedFields = structuredClone(a.fields);
      break;
    }
    case 'sign':
      a.signatures.push({ user: USERS[role], role, at, hash: await integrity(a), version: a.version, signedProcess: a.process });
      if (role === 'coordenacao') {
        a.status = 'validado';
        a.adjustmentsConfirmed = !!cmd.confirmAdjustments;
        action = 'Validação por assinatura';
      } else {
        action = 'Assinatura técnica';
      }
      message = MSG[6];
      break;
    case 'coordination':
      a.holder = 'coordenacao';
      action = 'Encaminhamento inicial à Coordenação';
      break;
    case 'adjust':
      nextVersion(a, role, cmd.reason!);
      a.status = 'ajustes';
      a.holder = 'tecnico';
      a.request = cmd.reason!.trim();
      a.recipient = USERS.tecnico;
      a.adjustmentAuthorized = true;
      a.adjustmentsConfirmed = false;
      action = 'Solicitação de ajuste e notificação demonstrativa ao Técnico Autor';
      message = MSG[10];
      break;
    case 'director':
      a.status = 'devolvido';
      a.holder = 'coordenacao';
      a.recipient = ROLES.coordenacao;
      action = 'Retorno do Diretor à Coordenação';
      break;
    case 'toTechnician':
      a.status = 'tecnico';
      a.holder = 'tecnico';
      a.recipient = cmd.recipient!;
      a.adjustmentAuthorized = !!cmd.authorizeCorrection;
      a.returnDocumentIds = [];
      a.returnBaseline = structuredClone(a.fields);
      a.analysisConfirmed = false;
      action = 'Retorno ao técnico responsável';
      break;
    case 'beginCorrection':
      nextVersion(a, role, 'Ajuste do auto autorizado pela Coordenação no retorno');
      action = 'Início do ajuste autorizado';
      break;
    case 'conclude':
      a.status = 'analise';
      a.holder = 'coordenacao';
      a.analysisConfirmed = true;
      action = 'Conclusão da análise técnica';
      message = MSG[25];
      break;
    case 'toArea':
      a.status = 'area';
      a.holder = 'externo';
      a.recipient = cmd.recipient!.trim();
      a.diligence = false;
      action = 'Encaminhamento para área';
      break;
    case 'expedir':
      if (!a.electronicNoticeRecognized) throw new Error(MSG[21]);
      a.status = 'expedido';
      a.holder = 'externo';
      a.recipient = a.fields.name;
      a.dispatch = {
        at,
        user: USERS[role],
        role,
        recipient: a.fields.name,
        termDays: 20,
        termCompleted: false
      };
      action = 'Expedição eletrônica concluída';
      message = MSG[12];
      break;
    case 'receipt':
      if (!a.dispatch) throw new Error('O auto ainda não foi expedido.');
      a.dispatch.receiptAt = at;
      const termEnd = new Date(at);
      termEnd.setDate(termEnd.getDate() + 20);
      a.dispatch.termEndAt = termEnd.toISOString();
      action = 'Recebimento formal confirmado pela pessoa autuada';
      message = 'Recebimento formal registrado. Prazo legal de 20 dias em curso.';
      break;
    case 'termElapsed':
      if (!a.dispatch?.receiptAt) throw new Error('O recebimento formal deve ser registrado antes de computar o prazo.');
      a.dispatch.termCompleted = true;
      action = 'Decurso integral do prazo legal (20 dias)';
      message = 'Prazo legal de defesa/recurso decorrido integralmente.';
      break;
    case 'atend':
      if (a.status === 'expedido') {
        if (!a.dispatch?.termCompleted) throw new Error(MSG[28]);
        a.status = 'aguardando';
        a.holder = 'externo';
        a.recipient = 'ATEND';
        action = 'Encaminhamento à ATEND após decurso do prazo';
        message = 'Processo encaminhado à ATEND após decurso do prazo legal.';
      } else {
        a.status = 'aguardando';
        a.holder = 'externo';
        a.recipient = 'ATEND';
        action = 'Saída da Fiscalização à ATEND';
        message = MSG[8];
      }
      break;
    case 'attach': {
      if (!cmd.attachment || !fileAllowed(cmd.attachment.name, cmd.attachment.size) || a.attachments.some(f => f.id === cmd.attachment!.id)) throw new Error(MSG[17]);
      const attachment = { ...cmd.attachment, scope: a.status === 'tecnico' ? ('processo' as const) : ('auto' as const) };
      a.attachments.push(attachment);
      if (a.status === 'tecnico') a.returnDocumentIds.push(attachment.id);
      action = 'Anexação';
      break;
    }
    case 'remove': {
      const target = a.attachments.find(f => f.id === cmd.attachmentId);
      if (!target || a.versions.some(v => v.attachments.some(f => f.id === target.id)) || (target.scope !== 'processo' && a.signatures.length > 0) || (target.scope === 'processo' && !a.returnDocumentIds.includes(target.id))) throw new Error(MSG[13]);
      a.attachments = a.attachments.filter(f => f.id !== target.id);
      a.returnDocumentIds = a.returnDocumentIds.filter(id => id !== target.id);
      action = 'Remoção de anexo não formalizado';
      break;
    }
  }

  const changes = ['save', 'form'].includes(cmd.action)
    ? Object.fromEntries(
        Object.entries(a.fields)
          .filter(([key, value]) => JSON.stringify(original.lastSavedFields?.[key as keyof Fields]) !== JSON.stringify(value))
          .map(([key, value]) => [key, { before: original.lastSavedFields?.[key as keyof Fields], after: value }])
      )
    : undefined;

  addAudit(
    a,
    role,
    action,
    JSON.stringify({
      reason: cmd.reason,
      recipient: a.recipient,
      number: a.number,
      process: a.process,
      relatedProcess: a.relatedProcess,
      authorizeCorrection: cmd.authorizeCorrection,
      confirmAdjustments: cmd.confirmAdjustments,
      confirmAnalysis: cmd.confirmAnalysis,
      changes,
      attachment: cmd.attachment?.name,
      attachmentId: cmd.attachmentId
    }),
    at,
    {
      origin,
      destination: a.holder === 'externo' ? a.recipient : a.holder,
      statusBefore: before,
      statusAfter: a.status
    }
  );

  return { auto: a, message };
}

export const MOCK_FILE_POLICY = 'Política demonstrativa: PDF, PNG, JPG e JPEG, até 10 MB. Padrão corporativo pendente de validação.';
export function fileAllowed(name: string, size: number) {
  return /\.(pdf|png|jpe?g)$/i.test(name) && size > 0 && size <= 10 * 1024 * 1024;
}

export function deadline(a: Aiad) {
  if (!a.dispatch?.receiptAt) return '';
  const d = new Date(a.dispatch.receiptAt);
  d.setUTCDate(d.getUTCDate() + (a.dispatch.termDays || 20));
  return d.toISOString();
}
