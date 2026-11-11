import { addAudit, signatureContent, today, newInfraction, type Aiad, type Role, type Fields } from '@/lib/aiad';

export const PROCESSES = [
  { id: '2026.000142/INEMA/PROC', label: '2026.000142/INEMA/PROC — fiscalização em análise', eligible: true },
  { id: '2026.000143/INEMA/PROC', label: '2026.000143/INEMA/PROC — processo encerrado', eligible: false }
];

export const SCENARIOS = [
  { value: 'tecnico', label: '1. Elaboração / Rascunho parcial', role: 'tecnico' },
  { value: 'formado', label: '2. Formação inicial / Salvar auto', role: 'tecnico' },
  { value: 'coordenacao', label: '3. Avaliação pela Coordenação', role: 'coordenacao' },
  { value: 'ajustes', label: '4. Correção autorizada / Pendente de ajuste', role: 'tecnico' },
  { value: 'validado', label: '5. Validado / Saída sem correspondência reconhecida', role: 'coordenacao' },
  { value: 'expedido', label: '6. Expedição eletrônica e controle de prazos', role: 'coordenacao' },
  { value: 'diretoria', label: '7. Retorno DIREG / Pauta do Diretor', role: 'diretoria' },
  { value: 'retorno-coordenacao', label: '8. Retorno / Coordenação seleciona técnico', role: 'coordenacao' },
  { value: 'diligencia', label: '9. Retorno / Atendimento técnico (diligência)', role: 'tecnico' },
  { value: 'analise', label: '10. Retorno / Análise concluída à Coordenação', role: 'coordenacao' }
] satisfies { value: string; label: string; role: Role }[];

export function createAiad(process = ''): Aiad {
  if (process && !PROCESSES.some(p => p.id === process && p.eligible)) throw new Error('O processo não está elegível para receber desdobramentos.');
  
  const coords = {
    type: 'decimal' as const,
    lat: '-12,9714',
    lon: '-38,5014',
    latD: '',
    latM: '',
    latS: '',
    lonD: '',
    lonM: '',
    lonS: '',
    validated: false
  };

  const fields: Fields = {
    document: '11.222.333/0001-81',
    name: 'Indústria Ambiental Bahia — demonstração',
    enterprise: 'Unidade Industrial Salvador — demonstração',
    address: 'Rua de demonstração, 100',
    cep: '40000-000',
    city: 'Salvador',
    uf: 'BA',
    email: 'autuado@example.invalid',
    phone: '(71) 0000-0000',
    date: today(),
    inspectionDate: today(),
    inspectionTime: '10:00',
    characterization: 'Armazenamento de resíduos sem medidas de contenção.',
    infractions: [{ ...newInfraction(), characterization: 'Armazenamento de resíduos sem medidas de contenção.', criteria250: ['III'], nature: 'material', severity: 'leve', penalties: ['Advertência'], source: 'estadual', article: '254', clause: 'I — risco de poluição ou degradação do meio ambiente;' }],
    facts: 'Armazenamento de resíduos sem as medidas de contenção previstas, com risco de degradação ambiental.',
    inspection: 'Área de armazenamento',
    inspectionAddress: 'Rua de demonstração, 100',
    inspectionCep: '40000-000',
    inspectionCity: 'Salvador',
    inspectionUf: 'BA',
    source: 'estadual',
    article: '254',
    clause: 'I - risco de poluição ou degradação;',
    other: '',
    coords,
    coordsList: [{ ...coords, id: 'coord-main' }]
  };

  const a: Aiad = {
    id: `AIAD-MOCK-${crypto.randomUUID()}`,
    process,
    eligible: true,
    number: '',
    version: 1,
    status: 'rascunho',
    fields,
    emailValidated: false,
    electronicNoticeRecognized: false,
    signatures: [],
    attachments: [],
    audit: [],
    versions: [],
    diligence: false,
    adjustmentAuthorized: false,
    request: '',
    recipient: '',
    schemaVersion: 11,
    revision: 0,
    holder: 'tecnico',
    relatedProcess: '',
    adjustmentsConfirmed: false,
    analysisConfirmed: false,
    returnDocumentIds: []
  };

  addAudit(a, 'tecnico', 'Criação', process ? 'Desdobramento vinculado a processo elegível; dados demonstrativos' : 'Sem processo originador; dados demonstrativos');
  return a;
}

export function scenarioAiad(scenario: string): Aiad {
  if (!SCENARIOS.some(s => s.value === scenario)) throw new Error('Cenário não disponível.');
  const a = createAiad();
  if (scenario === 'tecnico') return a;

  a.number = `DEMO-CENARIO/${a.id}`;
  a.relatedProcess = `DEMO-AIAD-${a.id}`;
  a.fields.coords.validated = true;
  if (a.fields.coordsList && a.fields.coordsList.length > 0) {
    a.fields.coordsList[0].validated = true;
  }
  a.status = 'formado';
  if (scenario === 'formado') return a;

  const at = new Date().toISOString();
  a.signatures = [
    {
      user: 'Ana Ribeiro — demonstração',
      role: 'tecnico',
      at,
      hash: 'Fixture demonstrativa — não é assinatura corporativa',
      version: 1,
      simulatedFixture: true,
      fixtureContent: signatureContent(a)
    }
  ];
  a.holder = 'coordenacao';
  if (scenario === 'coordenacao') return a;

  if (scenario === 'ajustes') {
    a.versions = [
      structuredClone({
        version: 1,
        fields: a.fields,
        signatures: a.signatures,
        attachments: a.attachments,
        reason: 'Correção solicitada pela Coordenação',
        number: a.number,
        relatedProcess: a.relatedProcess,
        status: a.status
      })
    ];
    a.version = 2;
    a.signatures = [];
    a.status = 'ajustes';
    a.holder = 'tecnico';
    a.adjustmentAuthorized = true;
    a.request = 'Detalhar as medidas de contenção.';
    return a;
  }

  a.signatures.push({
    user: 'Carlos Souza — demonstração',
    role: 'coordenacao',
    at,
    hash: 'Fixture demonstrativa — não é assinatura corporativa',
    version: 1,
    simulatedFixture: true,
    fixtureContent: signatureContent(a)
  });
  a.status = 'validado';
  if (scenario === 'validado') return a;

  if (scenario === 'expedido') {
    a.status = 'expedido';
    a.holder = 'externo';
    a.recipient = a.fields.name;
    a.emailValidated = true;
    a.electronicNoticeRecognized = true;
    a.dispatch = {
      at,
      user: 'Carlos Souza — demonstração',
      role: 'coordenacao',
      recipient: a.fields.name,
      termDays: 20,
      termCompleted: false
    };
    addAudit(a, 'coordenacao', 'Expedição eletrônica concluída', 'Cenário demonstrativo de expedição e prazos');
    return a;
  }

  a.status = 'expedido';
  a.diligence = true;
  a.holder = 'diretoria';
  a.returnContext = {
    origin: 'DIREG → Diretor da Fiscalização (referência externa)',
    recommendation: 'Exemplo fictício: apresentar Nota Técnica sobre as medidas de contenção.',
    documents: ['Recomendação jurídica — documento externo demonstrativo']
  };
  a.request = a.returnContext.recommendation;

  if (scenario === 'retorno-coordenacao') {
    a.status = 'devolvido';
    a.holder = 'coordenacao';
  }
  if (scenario === 'diligencia') {
    a.status = 'tecnico';
    a.holder = 'tecnico';
    a.recipient = 'Ana Ribeiro — demonstração';
  }
  if (scenario === 'analise') {
    a.status = 'analise';
    a.holder = 'coordenacao';
    a.analysisConfirmed = true;
    a.attachments.push({
      id: 'nota-fixture',
      name: 'Nota-tecnica-demonstrativa.pdf',
      format: 'PDF',
      size: 1000,
      description: 'Metadados de fixture; não contém arquivo real.',
      user: 'Ana Ribeiro — demonstração',
      at,
      kind: 'Nota Técnica',
      scope: 'processo'
    });
    a.returnDocumentIds = ['nota-fixture'];
  }

  addAudit(a, SCENARIOS.find(s => s.value === scenario)!.role, 'Contexto externo demonstrativo carregado', scenario);
  return a;
}
