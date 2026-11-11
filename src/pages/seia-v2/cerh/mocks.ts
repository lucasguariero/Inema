import type { CerhData, Classification, Identification, Point, PointData, Session, UseType, Venture } from './types';
import { basins, rpgas } from './catalogs';
import { snapshotRelated } from './rules';
export const emptyLocation = () => ({ latitude: '', longitude: '', datum: 'SIRGAS 2000' as const, municipality: '', rpga: '', basin: '', waterBody: '', bodyType: '' });
export const emptyPointData = (): PointData => ({ location: emptyLocation(), technical: {}, purposes: [], purposeData: {}, animals: [], regimes: [] });
export const defaultIdentification = (): Identification => ({ actorName: 'Ana Técnica — demonstração', actorDocument: '000.000.000-00', actorAddress: 'Rua do requerente — demonstração, 100, Salvador/BA', actorEmail: 'ana@example.invalid', role: 'Requerente', representedDocument: '', representedName: '', agreementEnabled: 'Não', agreement: '', contactEnabled: 'Não', contact: {} });
const date = '2026-10-07T12:00:00.000Z';
export const cnarhResult = {
  'Processo de outorga': 'PROC-MOCK-2026-001', 'Portaria de outorga': 'PORTARIA-MOCK-001',
  'Publicação': '01/10/2026', 'Validade': '01/10/2030', 'Vazão concedida': '1,2 m³/h',
  'Quantidade': '8 horas/dia; 20 dias/mês', 'Finalidade': 'Irrigação', 'Irrigação': 'Gotejamento',
  'Área irrigada': '12 ha', 'Cultura': 'Milho', 'Situação da integração': 'Disponibilizado',
};
const completedLocation = () => ({ latitude: '-12.9714', longitude: '-38.5014', datum: 'SIRGAS 2000' as const, municipality: 'Salvador', rpga: rpgas[0], basin: basins[0], waterBody: 'Rio de demonstração', bodyType: 'Rio' });
export function makePoint(type: UseType, ventureId: string, id: string): Point {
  return { ...emptyPointData(), id, ventureId, type, createdAt: date, lifecycle: 'Rascunho', classification: 'Análise técnica necessária', version: 1, author: 'Ana Técnica — demonstração', history: [], requests: [], snapshots: [], eligibleRelatedIds: [], cnarh: { state: 'indisponível', processClosed: false } };
}
function fixture(type: UseType, suffix: string, lifecycle: Point['lifecycle'] = 'Concluído', classification: Classification = 'Análise técnica necessária', ventureId = 'VENT-01'): Point {
  const p = makePoint(type, ventureId, ventureId === 'VENT-01' ? `CERH-MOCK-${type}-${suffix}` : `CERH-MOCK-${ventureId}-${type}-${suffix}`);
  p.number = lifecycle === 'Rascunho' ? undefined : `2026.MOCK.${type}.${suffix}`;
  p.lifecycle = lifecycle; p.classification = classification;
  if (ventureId === 'VENT-REF') {
    p.location = {
      latitude: suffix === '01' ? (type === 'SUB' ? '-12.1480' : '-12.1490') : '-12.1475',
      longitude: suffix === '01' ? (type === 'SUB' ? '-45.0025' : '-45.0010') : '-45.0035',
      datum: 'SIRGAS 2000' as const,
      municipality: 'Barreiras',
      rpga: rpgas[1],
      basin: basins[1],
      waterBody: type === 'SUB' ? 'Aquífero Urucuia' : 'Rio das Ondas',
      bodyType: type === 'SUB' ? '' : 'Rio',
    };
  } else {
    p.location = completedLocation();
    if (type === 'SUB') p.location.waterBody = 'Aquífero Urucuia';
    else if (suffix === '01') p.location.waterBody = 'Rio Principal';
    else if (suffix === '02') p.location.waterBody = 'Córrego Seco';
    else p.location.waterBody = 'Rio de demonstração';
  }
  if (lifecycle !== 'Rascunho') p.identification = defaultIdentification();
  p.agreement = 'ACT-MOCK-01';
  p.history = [{ id: `EV-${p.id}`, date, event: lifecycle === 'Rascunho' ? 'Criação do rascunho' : 'Conclusão do cadastro', author: p.author, profile: 'Técnico', version: 1 }];
  p.technical = type === 'BAR' ? { snisb: '', damName: `Barragem de demonstração ${suffix}`, damType: 'Barramento de regularização de vazão', situation: 'Operação', height: '8', volume: suffix === '01' ? '0.12' : '0.11', guaranteedFlow: '100' }
    : type === 'INT' ? { category: 'Obras Hidráulicas', work: 'Retificação/Canalização', situation: 'Operação', pch: 'Não', power: '2', operating: 'Sim', startDate: '2026-01-01', energy: '800', quantity: 'Não', quality: 'Não', waterRegime: 'Não sei informar' }
    : type === 'SUP' ? { reservoir: 'Não', situation: 'Operação', startDate: '2026-01-01', pump: 'Sim', pumpFlow: '3', pumpHead: '12', pumpPower: '2', pumpType: 'Centrífuga' }
    : type === 'SUB' ? { nature: 'Poço Escavado', aquifer: '', situation: 'Operação', startDate: '2026-01-01', depth: '12', testFlow: '0.8', staticLevel: '3', dynamicLevel: '5', pump: 'Não', noPump: 'Por gravidade — tubulação' }
    : { situation: 'Operação', startDate: '2026-01-01', origins: ['Criação Animal'], treated: 'Sim', treatment: 'Secundário', rawDbo: '300', treatedDbo: '30', rawColiform: '10000', treatedColiform: '100' };
  p.purposes = type === 'BAR' ? ['Reservatório'] : type === 'SUP' || type === 'SUB' ? ['Irrigação', 'Dessedentação animal'] : [];
  p.purposeData = p.purposes.length && type !== 'BAR' ? { 'Irrigação': { systems: ['Gotejamento'], area: '12', crop: 'Milho' }, 'Dessedentação animal': {} } : {};
  if (type === 'SUP' || type === 'SUB') {
    p.animals = [{ id: `${p.id}-AN-1`, species: 'Bovino', system: 'Intensivo', heads: '20' }, { id: `${p.id}-AN-2`, species: 'Caprino', system: 'Extensivo', heads: '10' }];
    p.regimes = [{ id: `${p.id}-R1`, flow: type === 'SUB' ? '0.8' : '1.2', hours: '8', minutes: '30', days: '20', months: [0, 1] }, { id: `${p.id}-R2`, flow: '0.9', hours: '6', minutes: '0', days: '22', months: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }];
    p.consideredFlow = type === 'SUB' ? (suffix === '01' ? 0.8 : 0.9) : (suffix === '01' ? 1.2 : 0.9);
  }
  if (type === 'EFL') p.regimes = [{ id: `${p.id}-R1`, flow: '2', hours: '12', minutes: '30', days: '25', months: [0, 1, 2, 3, 4, 5] }];
  return p;
}
export function seedData(scenario = 'base'): CerhData {
  const ventures: Venture[] = [
    { id: 'VENT-01', name: 'Empreendimento Rio Vivo — demonstração', holder: 'Cooperativa Rio Vivo — demonstração', document: '00.000.000/0000-00', email: 'contato@example.invalid', phone: '(00) 0000-0000', property: 'Imóvel rural', address: 'Estrada de demonstração, 10, Salvador/BA', municipality: 'Salvador', latitude: '-12.9714', longitude: '-38.5014', water: 'Sim', intervention: 'Sim', capture: 'Sim', discharge: 'Sim', identification: defaultIdentification() },
    { id: 'VENT-02', name: 'Empreendimento sem uso — demonstração', holder: 'Titular de demonstração', document: '00.000.000/0000-00', email: 'semuso@example.invalid', phone: '(00) 0000-0000', property: 'Imóvel urbano', address: 'Rua de demonstração, 20, Barreiras/BA', municipality: 'Barreiras', latitude: '-12.1485', longitude: '-45.0021', water: 'Não', intervention: '', capture: '', discharge: '', identification: defaultIdentification() },
    { id: 'VENT-03', name: 'Novo contexto — demonstração', holder: 'Titular de demonstração', document: '00.000.000/0000-00', email: 'novo@example.invalid', phone: '(00) 0000-0000', property: 'Imóvel urbano', address: 'Rua de demonstração, 30, Camaçari/BA', municipality: 'Camaçari', latitude: '-12.6984', longitude: '-38.3219', water: '', intervention: '', capture: '', discharge: '', identification: defaultIdentification() },
    { id: 'VENT-REF', name: 'Fazenda Rio das Ondas — demonstração', holder: 'Agropecuária Rio das Ondas LTDA — demonstração', document: '12.345.678/0001-90', email: 'ondas@example.invalid', phone: '(77) 3611-0000', property: 'Imóvel rural', address: 'Rodovia BR-242, Km 30, Barreiras/BA', municipality: 'Barreiras', latitude: '-12.1485', longitude: '-45.0021', water: 'Sim', intervention: 'Não', capture: 'Sim', discharge: 'Não', identification: defaultIdentification() },
  ];
  const points = [
    fixture('BAR', '01', 'Concluído', 'Passível de outorga'),
    fixture('BAR', '02', 'Concluído', 'Passível de dispensa'),
    fixture('INT', '01', 'Concluído', 'Passível de inexigibilidade'),
    fixture('SUP', '01', 'Concluído', 'Passível de outorga'),
    fixture('SUP', '02', 'Pendente de complementação', 'Passível de dispensa'),
    fixture('SUB', '01', 'Concluído', 'Passível de dispensa'),
    fixture('SUB', '02', 'Concluído', 'Análise técnica necessária'),
    fixture('EFL', '01'),
    makePoint('SUP', 'VENT-01', 'RASC-MOCK-SUP-01'),
    fixture('SUP', '01', 'Rascunho', 'Passível de outorga', 'VENT-REF'),
    fixture('SUP', '02', 'Rascunho', 'Passível de dispensa', 'VENT-REF'),
    fixture('SUB', '01', 'Rascunho', 'Passível de dispensa', 'VENT-REF'),
  ];
  for (const type of ['BAR', 'SUP', 'SUB'] as const) {
    points.find(p => p.id === `CERH-MOCK-${type}-01`)!.eligibleRelatedIds = [`CERH-MOCK-${type}-02`];
  }
  const sup = points.find(p => p.id === 'CERH-MOCK-SUP-01')!;
  if (scenario.startsWith('cnarh')) {
    sup.process = 'PROC-MOCK-2026-001'; sup.tramitation = 'Encerrado';
    sup.cnarh = { state: scenario === 'cnarh-empty' ? 'sem retorno' : scenario.startsWith('cnarh-error') ? 'erro' : 'retorno', processClosed: true, attemptedAt: date };
    if (!['cnarh-empty', 'cnarh-error-empty'].includes(scenario)) { sup.cnarh.lastResult = { ...cnarhResult }; sup.cnarh.updatedAt = date; }
  }
  if (scenario === 'process') { sup.process = 'PROC-MOCK-2026-001'; sup.tramitation = 'Em análise'; }
  if (scenario === 'process-return') { sup.process = 'PROC-MOCK-2026-001'; sup.tramitation = 'Encerrado'; sup.processSituation = 'Outorgado'; sup.cnarh={state:'retorno',processClosed:true,lastResult:{...cnarhResult}}; }
  if (scenario === 'boundary') { points[0].technical.volume = '0.2'; points[0].classification = 'Análise técnica necessária'; }
  if (scenario === 'origin') points[1].originId = points[0].id;
  if (scenario === 'tubular') { points[5].technical.nature = 'Poço Tubular'; points[5].classification = 'Passível de outorga'; }
  if (scenario === 'cancelled') sup.lifecycle = 'Cancelado';
  if (scenario.includes('missing-type')) {
    const vRef = ventures.find(v => v.id === 'VENT-REF');
    if (vRef) {
      vRef.discharge = 'Sim';
      vRef.selectedTypes = ['SUP', 'SUB', 'EFL'];
    }
  }
  if (scenario.includes('preservation-test')) {
    const sup01 = points.find(p => p.id === 'CERH-MOCK-VENT-REF-SUP-01');
    if (sup01) {
      sup01.lifecycle = 'Concluído';
      sup01.number = '2026.MOCK.VENT-REF.0001';
      sup01.certificateNumber = '2026.MOCK.00001/CERH';
      sup01.snapshots = [{ version: 1, data: { location: sup01.location, technical: sup01.technical, purposes: sup01.purposes, purposeData: sup01.purposeData, animals: sup01.animals, regimes: sup01.regimes }, classification: sup01.classification }];
      sup01.history = [{ id: 'EV-PRESERVE-01', date, event: 'Conclusão do cadastro anterior', author: 'Ana Técnica — demonstração', profile: 'Técnico', version: 1 }];
    }
    const sub01 = points.find(p => p.id === 'CERH-MOCK-VENT-REF-SUB-01');
    if (sub01) {
      sub01.lifecycle = 'Concluído';
      sub01.number = '2026.MOCK.VENT-REF.0002';
    }
  }
  if (['edit-pending', 'edit-approved', 'edit-refused', 'edit-locked'].includes(scenario)) {
    sup.requests = [{ id: 'ED-MOCK-01', date, author: 'Requerente — demonstração', profile: 'Requerente', reason: 'Atualização dos regimes e finalidades declarados.', requested: ['Finalidades', 'Regimes'], approved: scenario === 'edit-approved' || scenario === 'edit-locked' ? ['Regimes'] : [], status: scenario === 'edit-pending' ? 'Pendente' : scenario === 'edit-refused' ? 'Recusada' : 'Aprovada', decidedBy: scenario === 'edit-pending' ? undefined : 'DIRAM — demonstração', decidedAt: scenario === 'edit-pending' ? undefined : date, decisionReason: scenario === 'edit-refused' ? 'Solicitação sem elementos suficientes para liberação.' : undefined }];
    if (scenario === 'edit-locked') sup.cnarh = { state: 'retorno', processClosed: true, lastResult: { ...cnarhResult }, updatedAt: date };
  }
  for (const [n, venture] of ventures.entries()) {
    venture.identification.role = 'Técnico do Inema';
    venture.addressFields = { cep: '00000-000', street: n === 0 ? 'Estrada de demonstração' : 'Rua de demonstração', number: String((n + 1) * 10), neighborhood: 'Área de demonstração', complement: '' };
    const x = Number(venture.longitude), y = Number(venture.latitude);
    venture.polygon = [[x - .004, y - .002], [x + .003, y - .002], [x + .004, y + .003], [x - .003, y + .004], [x - .004, y - .002]];
  }
  const result: CerhData = { revision: 1, ventures, points: scenario === 'empty' ? [] : points, sequence: 1 };
  for (const point of result.points) if (point.lifecycle !== 'Rascunho') point.relatedComposition = snapshotRelated(result, point);
  return result;
}
export { sessionForProfile as mockSession } from './administration';
