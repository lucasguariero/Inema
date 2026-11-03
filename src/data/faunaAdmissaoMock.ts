/**
 * INEMA / SEIA - Módulo de Gestão de Fauna Silvestre - Release 2
 * Banco de Dados e Serviços Mock em Memória para DR008 (Admissão Animal)
 * Conectado ontologicamente à base única do DR001 (MOCK_ANIMAIS).
 */

import {
  TermoRecebimentoItem,
  RegistroTriagemItem,
  AvaliacaoClinicaItem,
  EvolucaoClinicaItem,
  DesfechoClinicoItem,
  RegistroObitoItem,
  TermoSolturaDestinacaoItem,
} from '@/types/faunaAdmissao';
import { MOCK_ANIMAIS, MOCK_UNIDADES, AnimalItem } from '@/data/faunaMock';

// Sequenciais contínuos em memória por unidade (RN-003: não reinicia anualmente)
const SEQUENCIAIS_TR: Record<string, number> = {
  CTS: 32,
  CTR: 18,
  CTO: 5,
  URCH: 15,
  URES: 8,
  UROE: 12,
  URPD: 4,
  URPS: 19,
  URRC: 2,
  URSF: 7,
  URSO: 11,
  URSU: 14,
};

// Sequencial anual estadual do Número Digital (RN-015: reinicia anualmente a cada exercício)
const SEQUENCIAIS_DIGITAIS_POR_ANO: Record<number, number> = {
  2026: 126,
};

// Sequencial anual de Termos de Soltura / Destinação (RN-026)
let SEQUENCIAL_TERMO_SOLTURA_2026 = 14;

// Sequenciais de óbito por TR (RN-028: [Nº TR]-OB01, OB02)
const SEQUENCIAIS_OBITO_POR_TR: Record<string, number> = {
  'CTS-000.010': 1,
  'CTS-000.032': 1,
};

/**
 * Gera o Número do TR no padrão oficial [SIGLA]-000.000 (RN-003, CA002, CA003)
 */
export function gerarProximoNumeroTR(siglaUnidade: string): string {
  const sigla = siglaUnidade.toUpperCase();
  const atual = SEQUENCIAIS_TR[sigla] || 0;
  const proximo = atual + 1;
  SEQUENCIAIS_TR[sigla] = proximo;
  return `${sigla}-${String(proximo).padStart(6, '0').slice(0, 3)}.${String(proximo).padStart(6, '0').slice(3)}`;
}

/**
 * Consulta o próximo número sem incrementar (para exibição em tela)
 */
export function consultarProximoNumeroTR(siglaUnidade: string): string {
  const sigla = siglaUnidade.toUpperCase();
  const proximo = (SEQUENCIAIS_TR[sigla] || 0) + 1;
  const formatado = String(proximo).padStart(6, '0');
  return `${sigla}-${formatado.slice(0, 3)}.${formatado.slice(3)}`;
}

/**
 * Gera o Número Digital oficial no padrão 000.000/AAAA (RN-015, CA007).
 * Utiliza o exercício anual corrente ou especificado, mantendo a sequência estadual anual.
 */
export function gerarProximoNumeroDigital(ano?: number, comSufixoClinico: boolean = false): string {
  const anoFinal = ano || new Date().getFullYear();
  const seqAtual = SEQUENCIAIS_DIGITAIS_POR_ANO[anoFinal] || 0;
  const proximo = seqAtual + 1;
  SEQUENCIAIS_DIGITAIS_POR_ANO[anoFinal] = proximo;
  const formatado = String(proximo).padStart(6, '0');
  const base = `${formatado.slice(0, 3)}.${formatado.slice(3)}/${anoFinal}`;
  return comSufixoClinico ? `${base}-CL` : base;
}

/**
 * Gera a numeração do cadáver no padrão [Nº TR]-OB00 (RN-028, CA017)
 */
export function gerarProximoNumeroCadaver(numeroTr: string): string {
  const seqAtual = SEQUENCIAIS_OBITO_POR_TR[numeroTr] || 0;
  const proximo = seqAtual + 1;
  SEQUENCIAIS_OBITO_POR_TR[numeroTr] = proximo;
  return `${numeroTr}-OB${String(proximo).padStart(2, '0')}`;
}

/**
 * Gera número do Termo de Soltura/Destinação (RN-026)
 */
export function gerarProximoNumeroTermoSoltura(ano: number = 2026): string {
  SEQUENCIAL_TERMO_SOLTURA_2026 += 1;
  return `TSD-${ano}-${String(SEQUENCIAL_TERMO_SOLTURA_2026).padStart(4, '0')}`;
}

/**
 * Registra a transferência interna entre unidades do INEMA (RN-037, CA029)
 * - Preserva o TR inicial (não gera novo TR nem TSD)
 * - Preserva o Número Digital do animal
 * - Atualiza a unidade de localização/visibilidade para a unidade destinatária (RN-034)
 * - Mantém o histórico aberto e preserva o estado clínico oficial da RN-032 (não altera para 'Transferido')
 * - Captura a unidade de origem antes de modificar os dados
 * - Impede transferência para a mesma unidade de origem
 * - Averba a movimentação no animal e no TR correspondente (origem, destino, data, responsável, motivo)
 */
export function registrarTransferenciaInterna(params: {
  animalId: string;
  unidadeDestinoId: string;
  responsavel: string;
  motivo: string;
  dataMovimentacao?: string;
}): {
  sucesso: boolean;
  mensagem: string;
  animal?: AnimalItem;
  tr?: TermoRecebimentoItem;
  origemNome?: string;
  destinoNome?: string;
} {
  const animal = MOCK_ANIMAIS.find((a) => a.id === params.animalId);
  if (!animal) {
    return { sucesso: false, mensagem: `Animal ${params.animalId} não encontrado.` };
  }

  // Captura unidade de origem ANTES de qualquer alteração
  const unidadeOrigemId = animal.unidadeAtualId || 'und-01';
  const unidadeOrigemNome = animal.unidadeAtualNome || animal.unidadeRegional || 'CETAS Salvador (Cabula)';

  // Impede transferência para a própria unidade de origem (movimentação inválida)
  if (params.unidadeDestinoId === unidadeOrigemId) {
    return {
      sucesso: false,
      mensagem: `A unidade de destino não pode ser a mesma unidade de origem (${unidadeOrigemNome}). Movimentação inválida.`,
    };
  }

  const unidadeDestino = MOCK_UNIDADES.find((u) => u.id === params.unidadeDestinoId);
  if (!unidadeDestino) {
    return { sucesso: false, mensagem: `Unidade de destino ${params.unidadeDestinoId} não encontrada.` };
  }

  const dataHora = params.dataMovimentacao || new Date().toLocaleDateString('pt-BR');

  const movimentacao = {
    unidadeOrigemId,
    unidadeOrigemNome,
    unidadeDestinoId: unidadeDestino.id,
    unidadeDestinoNome: unidadeDestino.nome,
    dataHora,
    responsavel: params.responsavel,
    motivo: params.motivo,
  };

  // Atualiza localização e visibilidade do animal (RN-034 e RN-037)
  // Preserva estritamente o numeroTr e numeroDigital originais!
  animal.unidadeAtualId = unidadeDestino.id;
  animal.unidadeAtualNome = unidadeDestino.nome;
  // RN-032 define 8 estados oficiais. Transferência interna NÃO altera o status operacional
  // para 'Transferido'; o animal mantém seu estado clínico/operacional ativo (ex: 'Em quarentena', 'Alta Médica', etc.)
  if (!animal.movimentacoes) {
    animal.movimentacoes = [];
  }
  animal.movimentacoes.push(movimentacao);

  // Localiza e averba no TR original correspondente (sem criar novo TR)
  const tr = MOCK_TERMOS_RECEBIMENTO.find((t) => t.numeroTr === animal.numeroTr);
  if (tr) {
    tr.movimentacaoRegional = movimentacao;
    if (!tr.movimentacoes) tr.movimentacoes = [];
    tr.movimentacoes.push(movimentacao);
  }

  return {
    sucesso: true,
    mensagem: `Animal transferido com sucesso para ${unidadeDestino.nome}. TR ${animal.numeroTr} e Número Digital mantidos conforme RN-037 e CA029. Estado clínico '${animal.status}' preservado.`,
    animal,
    tr,
    origemNome: unidadeOrigemNome,
    destinoNome: unidadeDestino.nome,
  };
}

// ============================================================================
// DATASETS INICIAIS DE ADMISSÃO (DR008)
// ============================================================================

export const MOCK_TERMOS_RECEBIMENTO: TermoRecebimentoItem[] = [
  {
    id: 'tr-001',
    numeroTr: 'CTS-000.032',
    unidadeId: 'und-01',
    unidadeNome: 'CETAS Salvador (Cabula)',
    unidadeSigla: 'CTS',
    tipoUnidade: 'CETAS',
    dataRecebimento: '12/10/2026',
    horaRecebimento: '14:35',
    lote: true,
    quantidadeTotal: 150,
    fatoGerador: 'Apreensão',
    instituicaoResponsavel: 'INEMA',
    orgaoOrigem: 'COPPA - Polícia Militar da Bahia / DIFIS INEMA',
    documentoApreensaoTipo: 'Auto de Infração',
    documentoApreensaoNumero: 'AI-2026-9812-DIFIS',
    dataLavratura: '12/10/2026',
    comprovanteAnexado: false, // Cenário CA004: Comprovante pendente
    comprovantePendente: true,
    agenteNomeRazaoSocial: 'Capitão PM Rodrigo Tavares - Cmt 2ª Cia COPPA',
    agenteRgMatricula: 'PMBA 30.412.980',
    agenteCpfCnpj: '456.789.012-34',
    agenteLogradouro: 'Av. Dorival Caymmi, 1200, Itapuã',
    agenteMunicipio: 'Salvador',
    agenteUf: 'BA',
    agenteCep: '41635-150',
    entregadorNome: 'Sgt. PM Marcos Valério Santos',
    entregadorDocumento: 'Matrícula 28.112.450',
    recebedorNome: 'Dra. Gabriela Santos',
    recebedorMatricula: 'CRMV/BA 4821 - Matrícula INEMA 8841-2',
    localOrigemLogradouro: 'Feira Livre do Rolo, Bairro Tomba',
    localOrigemMunicipio: 'Feira de Santana',
    localOrigemUf: 'BA',
    localOrigemCep: '44090-000',
    animais: [
      {
        id: 'linha-01',
        especieId: 'esp-006',
        especieNomeCientifico: 'Sicalis flaveola',
        especieNomePopular: 'Canário-da-terra',
        quantidadeMacho: 0,
        quantidadeFemea: 0,
        quantidadeIndeterminado: 150,
        quantidadeTotal: 150,
        condicaoAnimal: 'Saudável',
        origemAnimal: 'Vida livre',
        localOrigemPontoOuCoordenadas: 'Bacia do Rio Jacuípe / Feira de Santana',
        saldoPendenteTriagem: 147, // 3 já foram individualizados
      },
    ],
    observacoes: 'Apreensão volumosa em gaiolas coletivas tipo viajante. Aves com sinais de estresse hídrico leve.',
    situacaoTr: 'Triagem em Andamento',
    siscetasStatus: 'Fila Local Demonstrativa (PPV-19)',
    siscetasLog: [
      {
        id: 'log-01',
        dataHora: '12/10/2026 14:36:10',
        evento: 'Entrada de Animais Silvestres (TR)',
        status: 'Fila Offline',
        mensagem:
          'Entrada retida em fila local demonstrativa aguardando integração e credenciais oficiais do SISCETAS/IBAMA (PPV-19). Nenhuma transmissão externa realizada.',
      },
    ],
  },
  {
    id: 'tr-002',
    numeroTr: 'URCH-000.015',
    unidadeId: 'und-04',
    unidadeNome: 'Unidade Regional Chapada (Lençóis / Seabra)',
    unidadeSigla: 'URCH',
    tipoUnidade: 'UR',
    dataRecebimento: '14/10/2026',
    horaRecebimento: '09:15',
    lote: false,
    quantidadeTotal: 1,
    fatoGerador: 'Resgate',
    instituicaoResponsavel: 'INEMA',
    agenteNomeRazaoSocial: 'Corpo de Bombeiros Militar da Bahia - 11º BBM Itaberaba',
    agenteCpfCnpj: '13.937.071/0001-90',
    agenteLogradouro: 'BR-242 Km 180',
    agenteMunicipio: 'Seabra',
    agenteUf: 'BA',
    recebedorNome: 'Carlos Eduardo Oliveira',
    recebedorMatricula: 'Matrícula 7721-0',
    localOrigemLogradouro: 'Margem da BR-242 próximo a Seabra',
    localOrigemMunicipio: 'Seabra',
    localOrigemUf: 'BA',
    animais: [
      {
        id: 'linha-02',
        especieId: 'esp-004',
        especieNomeCientifico: 'Cyanopsitta spixii',
        especieNomePopular: 'Ararinha-azul',
        quantidadeMacho: 0,
        quantidadeFemea: 0,
        quantidadeIndeterminado: 1,
        quantidadeTotal: 1,
        condicaoAnimal: 'Saudável',
        origemAnimal: 'Vida livre',
        saldoPendenteTriagem: 0, // RN-036: URs realizam apenas recepção/encaminhamento; triagem é executada exclusivamente nos CETAS
      },
    ],
    observacoes: 'Animal resgatado em perímetro rural. Na Regional Chapada não há triagem nem marcação; aguardando encaminhamento para o CETAS.',
    situacaoTr: 'Gerado',
    comprovanteAnexado: true,
    comprovantePendente: false,
    siscetasStatus: 'Pendente (Demonstrativo)',
  },
  {
    id: 'tr-003',
    numeroTr: 'CTR-000.018',
    unidadeId: 'und-02',
    unidadeNome: 'CETAS Recôncavo (Cruz das Almas)',
    unidadeSigla: 'CTR',
    tipoUnidade: 'CETAS',
    dataRecebimento: '15/10/2026',
    horaRecebimento: '11:00',
    lote: false,
    quantidadeTotal: 2,
    fatoGerador: 'Entrega voluntária',
    instituicaoResponsavel: 'Outras',
    instituicaoEspecificar: 'Cidadão Local',
    agenteNomeRazaoSocial: 'Maria de Fátima Alencar',
    agenteCpfCnpj: '321.654.987-11',
    agenteLogradouro: 'Rua Rui Barbosa, 45, Centro',
    agenteMunicipio: 'Cruz das Almas',
    agenteUf: 'BA',
    recebedorNome: 'Dr. Thiago Moreira',
    recebedorMatricula: 'CRMV/BA 5512',
    localOrigemMunicipio: 'Cruz das Almas',
    localOrigemUf: 'BA',
    animais: [
      {
        id: 'linha-03',
        especieId: 'esp-005',
        especieNomeCientifico: 'Chelonia mydas',
        especieNomePopular: 'Tartaruga-verde',
        quantidadeMacho: 0,
        quantidadeFemea: 1,
        quantidadeIndeterminado: 0,
        quantidadeTotal: 1,
        condicaoAnimal: 'Mutilado/Ferido',
        origemAnimal: 'Vida livre',
        saldoPendenteTriagem: 0,
      },
      {
        id: 'linha-04',
        especieId: 'esp-001',
        especieNomeCientifico: 'Ara ararauna',
        especieNomePopular: 'Arara-canindé',
        quantidadeMacho: 1,
        quantidadeFemea: 0,
        quantidadeIndeterminado: 0,
        quantidadeTotal: 1,
        condicaoAnimal: 'Saudável',
        origemAnimal: 'Cativeiro',
        saldoPendenteTriagem: 0,
      },
    ],
    comprovanteAnexado: true,
    comprovantePendente: false,
    situacaoTr: 'Triagem Concluída',
    siscetasStatus: 'Simulado Localmente',
  },
];

export const MOCK_TRIAGENS: RegistroTriagemItem[] = [
  {
    id: 'tri-01',
    trId: 'tr-001',
    trNumero: 'CTS-000.032',
    linhaTrId: 'linha-01',
    animalId: 'ani-001',
    numeroDigital: '000.124/2026',
    sufixoCl: false,
    especieId: 'esp-001',
    especieNomeCientifico: 'Ara ararauna',
    especieNomePopular: 'Arara-canindé',
    sexo: 'Fêmea',
    faixaEtaria: 'Adulto',
    marcacoes: [
      { id: 'm-01', tipo: 'Anilha', numero: 'AN-XPNH00089', dataAplicacao: '12/10/2026', situacao: 'Ativa' },
      { id: 'm-02', tipo: 'Microchip', numero: 'MC-981098102345678', dataAplicacao: '12/10/2026', situacao: 'Ativa' },
    ],
    identificacaoComplementar: 'Canindé adulta resgatada',
    procedencia: 'Entrega voluntária',
    localOrigem: 'Feira de Santana / BA',
    condicaoTriagem: 'Saudável',
    apresentaSinalClinico: false,
    encaminhamento: 'Quarentena', // RN-019 / RN-020: sem sinal clínico
    responsavelTriagem: 'Dra. Gabriela Santos - CRMV/BA 4821',
    dataHoraTriagem: '12/10/2026 15:10',
    observacoes: 'Animal bem nutrido, escore corporal 4/5, sem ectoparasitas visíveis.',
  },
  {
    id: 'tri-02',
    trId: 'tr-001',
    trNumero: 'CTS-000.032',
    linhaTrId: 'linha-01',
    animalId: 'ani-002',
    numeroDigital: '000.125/2026-CL',
    sufixoCl: true,
    especieId: 'esp-003',
    especieNomeCientifico: 'Leopardus pardalis',
    especieNomePopular: 'Jaguatirica',
    sexo: 'Macho',
    faixaEtaria: 'Jovem',
    marcacoes: [
      { id: 'm-03', tipo: 'Microchip', numero: 'MC-981098109876543', dataAplicacao: '12/10/2026', situacao: 'Ativa' },
    ],
    identificacaoComplementar: 'Jaguatirica jovem politraumatizada',
    procedencia: 'Resgate',
    localOrigem: 'BR-101 Eunápolis / BA',
    condicaoTriagem: 'Mutilado/Ferido',
    apresentaSinalClinico: true,
    encaminhamento: 'Internamento', // RN-016 / RN-019: com sinal clínico gera -CL
    responsavelTriagem: 'Dr. Alberto Vinícius - CRMV/BA 3110',
    dataHoraTriagem: '12/10/2026 15:40',
    observacoes: 'Suspeita de fratura fechada em membro pélvico esquerdo. Dor aguda à palpação.',
  },
  {
    id: 'tri-03',
    trId: 'tr-001',
    trNumero: 'CTS-000.032',
    linhaTrId: 'linha-01',
    animalId: 'ani-006',
    numeroDigital: '000.126/2026',
    sufixoCl: false,
    especieId: 'esp-006',
    especieNomeCientifico: 'Sicalis flaveola',
    especieNomePopular: 'Canário-da-terra',
    sexo: 'Macho',
    faixaEtaria: 'Adulto',
    marcacoes: [],
    identificacaoComplementar: 'Canário do lote de apreensão',
    procedencia: 'Apreensão',
    localOrigem: 'Feira de Santana / BA',
    condicaoTriagem: 'Óbito',
    apresentaSinalClinico: true,
    encaminhamento: 'Óbito', // Morte na chegada/triagem (RN-019)
    responsavelTriagem: 'Dra. Gabriela Santos - CRMV/BA 4821',
    dataHoraTriagem: '12/10/2026 16:00',
    observacoes: 'Animal já recebido sem sinais vitais decorrente do transporte inadequado.',
  },
];

export const MOCK_AVALIACOES_CLINICAS: AvaliacaoClinicaItem[] = [
  {
    id: 'av-01',
    animalId: 'ani-002',
    trNumero: 'CTS-000.032',
    numeroDigital: '000.125/2026-CL',
    dataEntradaClinica: '12/10/2026',
    veterinarioResponsavel: 'Dr. Alberto Vinícius Dantas',
    crmv: 'CRMV/BA 3110',
    atitude: 'Hipoativo', // RN-022: Atitude e não Comportamento
    temperamento: 'Em alerta',
    estadoNutricional: 'Magro', // RN-022: Estado nutricional único
    hidratacao: 'Desidratado',
    grauDesidratacao: 'Desidratação moderada (estimada em 7% com turgor cutâneo diminuído)',
    anamneseHistorico: 'Animal resgatado em acostamento da BR-101 após abalroamento com veículo. Apresentava sangramento epistaxe contido e impotência funcional do membro pélvico esquerdo.',
    exameFisico: 'Mucosas pálidas, tempo de preenchimento capilar 3s, frequência cardíaca 140 bpm, ausculta pulmonar limpa. Crepitação óssea evidente no terço distal do fêmur esquerdo.',
    examesComplementares: ['Hemograma', 'Bioquímica Sérica', 'Imagem'],
    laudos: [
      {
        id: 'laud-01',
        exameTipo: 'Imagem (Radiografia Digital)',
        arquivoNome: 'RX_LEOPARDUS_FEMUR_ESQ_20261012.pdf',
        tamanhoKb: 1420,
        dataUpload: '12/10/2026 17:30',
      },
    ],
    diagnosticoSuspeito: 'Fratura simples transversa de diáfise femoral esquerda.',
    diagnosticoDefinitivo: 'Fratura completa fechada de diáfise distal do fêmur esquerdo.',
    condutaClinica: 'Fluidoterapia com Ringer Lactato, analgesia com cloridrato de tramadol 3mg/kg e meloxicam 0.1mg/kg. Tala de contenção e encaminhamento cirúrgico ortopédico.',
    restricoes: 'Repouso absoluto em recinto de contenção clínica com piso acolchoado.',
    observacoes: 'Programada osteossíntese com placa bloqueada e pinos intramedulares.',
  },
];

export const MOCK_EVOLUCOES_CLINICAS: EvolucaoClinicaItem[] = [
  {
    id: 'evo-01',
    animalId: 'ani-002',
    dataHora: '13/10/2026 09:30',
    veterinario: 'Dr. Alberto Vinícius Dantas (CRMV/BA 3110)',
    pesoKg: 9.85,
    tratamento: 'Fluidoterapia de manutenção + Enrofloxacina 5mg/kg IM + Cetoprofeno 1mg/kg',
    conduta: 'Troca de curativo cirúrgico. Manter imobilização externa temporária.',
    evolucao: 'Animal mais atento, aceitou alimentação espontânea (carne bovina moída com suplemento vitamínico). Urina e fezes presentes.',
    observacoes: 'Turgor cutâneo normalizado.',
  },
  {
    id: 'evo-02',
    animalId: 'ani-002',
    dataHora: '15/10/2026 14:00',
    veterinario: 'Dra. Gabriela Santos (CRMV/BA 4821)',
    pesoKg: 10.1,
    tratamento: 'Antibioticoterapia suspensa. Manutenção de condroprotetor oral.',
    conduta: 'Início de protocolo de fisioterapia passiva para extensão do membro.',
    evolucao: 'Apoio parcial do membro ao caminhar pelo recinto clínico. Ferida cirúrgica em cicatrização de primeira intenção sem exsudato.',
    observacoes: 'Animal demonstra excelente tolerância aos exercícios fisioterápicos.',
  },
];

export const MOCK_REGISTROS_OBITO: RegistroObitoItem[] = [
  {
    id: 'ob-01',
    animalId: 'ani-006',
    trId: 'tr-001',
    trNumero: 'CTS-000.032',
    numeroCadaver: 'CTS-000.032-OB01', // RN-028, CA017
    numeroDigital: '000.126/2026',
    dataObito: '12/10/2026',
    momentoObito: 'Na chegada', // RN-027
    diagnosticoPosMorte: 'Choque hipovolêmico e asfixia mecânica por hiperdensidade em gaiola de transporte clandestino.',
    laudoNecroscopicoNome: 'Laudo_Necropsia_CTS-000.032-OB01.pdf',
    destinacaoCarcaca: 'Universidades', // RN-029, CA030
    instituicaoDestinataria: 'Museu de Zoologia - Universidade Federal da Bahia (UFBA)',
    dataEntregaCarcaca: '14/10/2026',
    observacoes: 'Carcaça fixada em formol a 10% para incorporação ao acervo científico de ornitologia.',
  },
];

export const MOCK_TERMOS_SOLTURA: TermoSolturaDestinacaoItem[] = [
  {
    id: 'tsd-01',
    numeroTermo: 'TSD-2026-0014',
    animalId: 'ani-001',
    trNumero: 'CTS-000.032',
    numeroDigital: '000.124/2026',
    marcacao: 'AN-XPNH00089 · MC-981098102345678',
    dataSaida: '22/10/2026',
    localSaida: 'ASAS Fazenda Boa Esperança (Andaraí / Bacia do Paraguaçu)',
    responsavelSaida: 'Dr. Thiago Moreira - CRMV/BA 5512',
    condicaoAnimalSaida: 'Excelente condição de empenamento, vôo simétrico, escore corporal 4/5, apto para soltura branda com monitoramento.',
    destinacaoFinal: 'Soltura',
    instituicaoDestino: 'ASAS Fazenda Boa Esperança',
    statusFinal: 'Soltura',
    observacoes: 'Soltura branda realizada no recinto de aclimatação com acompanhamento por telemetria e anilhamento oficial.',
  },
];

// =========================================================================
// SISTEMA REATIVO DE ATUALIZAÇÃO EM MEMÓRIA (G8.1)
// Permite que qualquer mutação reflita instantaneamente nos KPIs e listagens
// sem recarregar a página (F5).
// =========================================================================

let faunaDataVersion = 0;
const faunaDataListeners = new Set<() => void>();

export function notificarAtualizacaoDadosFauna() {
  faunaDataVersion += 1;
  faunaDataListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Erro em faunaDataListener:', e);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('fauna-data-updated', {
        detail: { version: faunaDataVersion, timestamp: Date.now() },
      })
    );
  }
}

export function subscribeDadosFauna(callback: () => void) {
  faunaDataListeners.add(callback);
  return () => {
    faunaDataListeners.delete(callback);
  };
}

export function getFaunaDataVersion(): number {
  return faunaDataVersion;
}
