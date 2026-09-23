export interface TramitacaoItem {
  id: string;
  processo: string;
  dataTramitacao: string;
  interessado: string;
  unidade: string;
  ato: string;
  familiaAto: string;
  situacao: 'RL APROVADA' | 'REVISADO' | 'NOTIFICADO' | 'EM ANÁLISE TÉCNICA' | 'DEFERIDO' | 'AGUARDANDO PARECER TÉCNICO' | 'CONCLUÍDO';
  municipio: string;
  tipologia: string;
  liderEquipe: string;
  membrosEquipe: string[];
  ano: number;
  diasSemMovimentacao: number;
  prazoExcedido: boolean;
  resumoDespacho: string;
  etapaAtual: string;
}

export interface PautaItem {
  id: string;
  processo: string;
  interessado: string;
  unidadeAtual: string;
  tecnicoAtual: string;
  situacaoAtual: 'RL APROVADA' | 'REVISADO' | 'NOTIFICADO' | 'EM ANÁLISE TÉCNICA' | 'DEFERIDO' | 'AGUARDANDO DOCUMENTAÇÃO' | 'AGUARDANDO PARECER TÉCNICO';
  qtdAtos: number;
  atos: string[];
  ultimaMovimentacao: string;
  diasSemMovimentacao: number;
  situacaoPrazo: 'No prazo' | 'Atenção' | 'Prazo Excedido';
  municipio: string;
  tipologia: string;
  liderEquipe: string;
  membrosEquipe: string[];
  observacoes: string;
}

export interface FiltrosTramitacao {
  unidades: string[];
  dataInicio: string;
  dataFim: string;
  atos: string[];
  situacoes: string[];
  tecnicos: string[];
  papelEquipe: 'qualquer' | 'lider' | 'membro';
  processo: string;
  interessado: string;
  municipios: string[];
  tipologias: string[];
}

export const FILTROS_INICIAIS: FiltrosTramitacao = {
  unidades: [],
  dataInicio: '2026-01-01',
  dataFim: '2026-09-22',
  atos: [],
  situacoes: [],
  tecnicos: [],
  papelEquipe: 'qualquer',
  processo: '',
  interessado: '',
  municipios: [],
  tipologias: []
};

export interface FiltrosPauta {
  busca: string;
  prazo: string;
  unidade: string;
  tecnico: string;
  situacao: string;
}

export const FILTROS_PAUTA_INICIAIS: FiltrosPauta = {
  busca: '',
  prazo: 'todos',
  unidade: 'todas',
  tecnico: 'todos',
  situacao: 'todas'
};

export const LISTA_UNIDADES = [
  'DIRRE/CGF',
  'DIRRE/CEG',
  'DIRRE/CRH',
  'DILIC/UR-OESTE',
  'DILIC/UR-SUL',
  'DILIC/UR-METRO',
  'DILIC/UR-SUDOESTE',
  'DIREC/CORRE'
];

export const LISTA_ATOS = [
  'Autorização de Supressão de Vegetação (ASV)',
  'Licença Prévia (LP)',
  'Licença de Instalação (LI)',
  'Licença de Operação (LO)',
  'Licença Unificada (LU)',
  'Outorga de Captação Subterrânea',
  'Outorga de Lançamento de Efluentes',
  'Cadastro Estadual Florestal de Imóveis Rurais (CEFIR)'
];

export const LISTA_SITUACOES = [
  'EM ANÁLISE TÉCNICA',
  'NOTIFICADO',
  'RL APROVADA',
  'REVISADO',
  'AGUARDANDO PARECER TÉCNICO',
  'DEFERIDO',
  'CONCLUÍDO'
];

export const LISTA_TECNICOS = [
  'Eng. Agr. Renata Vasconcelos',
  'Biól. Marcos Lima',
  'Geól. André Martins',
  'Eng. Amb. Juliana Castro',
  'Biól. Fernando Sampaio',
  'Eng. Florestal Carolina Medeiros',
  'Sem atribuição técnica'
];

export const LISTA_MUNICIPIOS = [
  'Barreiras',
  'Ilhéus',
  'Juazeiro',
  'Salvador',
  'Caetité',
  'Feira de Santana',
  'Vitória da Conquista',
  'Luís Eduardo Magalhães',
  'Porto Seguro',
  'Camaçari'
];

export const LISTA_TIPOLOGIAS = [
  'Agrossilvopastoril',
  'Mineração',
  'Energia Eólica',
  'Infraestrutura Rodoviária',
  'Indústria Química',
  'Recursos Hídricos',
  'Empreendimentos Turísticos'
];

export const LISTA_FAMILIAS = [
  'Todas as Famílias',
  'Licenciamento Ordinário',
  'Autorizações Florestais',
  'Outorga de Recursos Hídricos',
  'Cadastro Estadual Florestal'
];

export const MOCK_TRAMITACOES: TramitacaoItem[] = [
  {
    id: 'tram-001',
    processo: '2026.000.001842/INEMA/LIC-00341',
    dataTramitacao: '22/09/2026 09:40',
    interessado: 'Agropecuária Vale do São Francisco S/A',
    unidade: 'DIRRE/CGF',
    ato: 'Autorização de Supressão de Vegetação (ASV)',
    familiaAto: 'Autorizações Florestais',
    situacao: 'RL APROVADA',
    municipio: 'Barreiras',
    tipologia: 'Agrossilvopastoril',
    liderEquipe: 'Eng. Agr. Renata Vasconcelos',
    membrosEquipe: ['Biól. Marcos Lima', 'Geól. André Martins'],
    ano: 2026,
    diasSemMovimentacao: 4,
    prazoExcedido: false,
    resumoDespacho: 'Aprovação da Reserva Legal e emissão de parecer favorável da vistoria florestal.',
    etapaAtual: 'Emissão da Autorização de Supressão de Vegetação'
  },
  {
    id: 'tram-002',
    processo: '2026.000.002109/INEMA/LIC-00812',
    dataTramitacao: '21/09/2026 16:15',
    interessado: 'Complexo Eólico Ventos da Bahia SPE Ltda',
    unidade: 'DIRRE/CEG',
    ato: 'Licença de Instalação (LI)',
    familiaAto: 'Licenciamento Ordinário',
    situacao: 'EM ANÁLISE TÉCNICA',
    municipio: 'Caetité',
    tipologia: 'Energia Eólica',
    liderEquipe: 'Eng. Amb. Juliana Castro',
    membrosEquipe: ['Geól. André Martins', 'Biól. Fernando Sampaio'],
    ano: 2026,
    diasSemMovimentacao: 18,
    prazoExcedido: false,
    resumoDespacho: 'Análise de atendimento de condicionantes da Licença Prévia e compatibilidade das subestações.',
    etapaAtual: 'Análise de Condicionantes Ambientais'
  },
  {
    id: 'tram-003',
    processo: '2025.000.009412/INEMA/LIC-00120',
    dataTramitacao: '20/09/2026 11:05',
    interessado: 'Mineração Rio de Contas Ltda',
    unidade: 'DILIC/UR-SUL',
    ato: 'Licença Prévia (LP)',
    familiaAto: 'Licenciamento Ordinário',
    situacao: 'NOTIFICADO',
    municipio: 'Ilhéus',
    tipologia: 'Mineração',
    liderEquipe: 'Geól. André Martins',
    membrosEquipe: ['Eng. Florestal Carolina Medeiros'],
    ano: 2025,
    diasSemMovimentacao: 42,
    prazoExcedido: true,
    resumoDespacho: 'Notificação técnica expedida para complementação do Estudo de Impacto Ambiental e audiência pública.',
    etapaAtual: 'Cumprimento de Notificação pelo Interessado'
  },
  {
    id: 'tram-004',
    processo: '2026.000.003314/INEMA/LIC-00455',
    dataTramitacao: '19/09/2026 15:50',
    interessado: 'Consórcio Rodovias do Oeste Baiano',
    unidade: 'DIRRE/CGF',
    ato: 'Licença de Operação (LO)',
    familiaAto: 'Licenciamento Ordinário',
    situacao: 'REVISADO',
    municipio: 'Luís Eduardo Magalhães',
    tipologia: 'Infraestrutura Rodoviária',
    liderEquipe: 'Eng. Agr. Renata Vasconcelos',
    membrosEquipe: ['Eng. Amb. Juliana Castro'],
    ano: 2026,
    diasSemMovimentacao: 9,
    prazoExcedido: false,
    resumoDespacho: 'Parecer técnico revisado pela coordenação para homologação e encaminhamento à diretoria.',
    etapaAtual: 'Homologação do Parecer Técnico'
  },
  {
    id: 'tram-005',
    processo: '2026.000.004018/INEMA/LIC-00620',
    dataTramitacao: '18/09/2026 10:20',
    interessado: 'Fazenda Santa Maria do Rio Grande',
    unidade: 'DIRRE/CRH',
    ato: 'Outorga de Captação Subterrânea',
    familiaAto: 'Outorga de Recursos Hídricos',
    situacao: 'DEFERIDO',
    municipio: 'Juazeiro',
    tipologia: 'Recursos Hídricos',
    liderEquipe: 'Biól. Fernando Sampaio',
    membrosEquipe: ['Eng. Agr. Renata Vasconcelos', 'Biól. Marcos Lima'],
    ano: 2026,
    diasSemMovimentacao: 2,
    prazoExcedido: false,
    resumoDespacho: 'Portaria de Outorga de Direito de Uso dos Recursos Hídricos emitida com vazão autorizada de 45 m³/h.',
    etapaAtual: 'Publicação de Portaria de Outorga'
  },
  {
    id: 'tram-006',
    processo: '2016.000.004128/CEFIR',
    dataTramitacao: '17/09/2026 14:00',
    interessado: 'Associação Comunitária dos Produtores de Caetité',
    unidade: 'DIRRE/CGF',
    ato: 'Cadastro Estadual Florestal de Imóveis Rurais (CEFIR)',
    familiaAto: 'Cadastro Estadual Florestal',
    situacao: 'CONCLUÍDO',
    municipio: 'Caetité',
    tipologia: 'Agrossilvopastoril',
    liderEquipe: 'Eng. Florestal Carolina Medeiros',
    membrosEquipe: ['Biól. Marcos Lima'],
    ano: 2026,
    diasSemMovimentacao: 1,
    prazoExcedido: false,
    resumoDespacho: 'Homologação final do cadastro do imóvel rural com demarcação validada no sistema SEIA.',
    etapaAtual: 'Certificado CEFIR Disponibilizado'
  },
  {
    id: 'tram-007',
    processo: '2026.000.005119/INEMA/LIC-00790',
    dataTramitacao: '16/09/2026 08:30',
    interessado: 'Polo Petroquímico Camaçari Revestimentos Ltda',
    unidade: 'DILIC/UR-METRO',
    ato: 'Licença Unificada (LU)',
    familiaAto: 'Licenciamento Ordinário',
    situacao: 'AGUARDANDO PARECER TÉCNICO',
    municipio: 'Camaçari',
    tipologia: 'Indústria Química',
    liderEquipe: 'Eng. Amb. Juliana Castro',
    membrosEquipe: ['Geól. André Martins', 'Biól. Fernando Sampaio'],
    ano: 2026,
    diasSemMovimentacao: 28,
    prazoExcedido: false,
    resumoDespacho: 'Aguardando manifestação técnica conclusiva do setor de resíduos industriais perigosos.',
    etapaAtual: 'Parecer Setorial de Resíduos'
  },
  {
    id: 'tram-008',
    processo: '2025.000.008102/INEMA/LIC-00215',
    dataTramitacao: '15/09/2026 17:10',
    interessado: 'Empresa Baiana de Saneamento e Infraestrutura',
    unidade: 'DILIC/UR-METRO',
    ato: 'Outorga de Lançamento de Efluentes',
    familiaAto: 'Outorga de Recursos Hídricos',
    situacao: 'EM ANÁLISE TÉCNICA',
    municipio: 'Salvador',
    tipologia: 'Recursos Hídricos',
    liderEquipe: 'Biól. Fernando Sampaio',
    membrosEquipe: ['Eng. Agr. Renata Vasconcelos'],
    ano: 2025,
    diasSemMovimentacao: 55,
    prazoExcedido: true,
    resumoDespacho: 'Vistoria técnica de qualidade de corpos hídricos receptores em fase de consolidação.',
    etapaAtual: 'Relatório Técnico de Qualidade Hídrica'
  }
];

export const MOCK_PAUTA: PautaItem[] = [
  {
    id: 'pauta-001',
    processo: '2026.000.001842/INEMA/LIC-00341',
    interessado: 'Agropecuária Vale do São Francisco S/A',
    unidadeAtual: 'DIRRE/CGF',
    tecnicoAtual: 'Eng. Agr. Renata Vasconcelos',
    situacaoAtual: 'RL APROVADA',
    qtdAtos: 2,
    atos: ['Autorização de Supressão de Vegetação (ASV)', 'CEFIR'],
    ultimaMovimentacao: '22/09/2026',
    diasSemMovimentacao: 4,
    situacaoPrazo: 'No prazo',
    municipio: 'Barreiras',
    tipologia: 'Agrossilvopastoril',
    liderEquipe: 'Eng. Agr. Renata Vasconcelos',
    membrosEquipe: ['Biól. Marcos Lima', 'Geól. André Martins'],
    observacoes: 'Processo prioritário com análise de campo concluída favoravelmente.'
  },
  {
    id: 'pauta-002',
    processo: '2026.000.002109/INEMA/LIC-00812',
    interessado: 'Complexo Eólico Ventos da Bahia SPE Ltda',
    unidadeAtual: 'DIRRE/CEG',
    tecnicoAtual: 'Eng. Amb. Juliana Castro',
    situacaoAtual: 'EM ANÁLISE TÉCNICA',
    qtdAtos: 1,
    atos: ['Licença de Instalação (LI)'],
    ultimaMovimentacao: '04/09/2026',
    diasSemMovimentacao: 18,
    situacaoPrazo: 'No prazo',
    municipio: 'Caetité',
    tipologia: 'Energia Eólica',
    liderEquipe: 'Eng. Amb. Juliana Castro',
    membrosEquipe: ['Geól. André Martins', 'Biól. Fernando Sampaio'],
    observacoes: 'Aguardando parecer final de rotas de avifauna migratória.'
  },
  {
    id: 'pauta-003',
    processo: '2025.000.009412/INEMA/LIC-00120',
    interessado: 'Mineração Rio de Contas Ltda',
    unidadeAtual: 'DILIC/UR-SUL',
    tecnicoAtual: 'Geól. André Martins',
    situacaoAtual: 'NOTIFICADO',
    qtdAtos: 2,
    atos: ['Licença Prévia (LP)', 'ASV'],
    ultimaMovimentacao: '11/08/2026',
    diasSemMovimentacao: 42,
    situacaoPrazo: 'Prazo Excedido',
    municipio: 'Ilhéus',
    tipologia: 'Mineração',
    liderEquipe: 'Geól. André Martins',
    membrosEquipe: ['Eng. Florestal Carolina Medeiros'],
    observacoes: 'Notificação com prazo de resposta de 30 dias expirada. Em reanálise pelo coordenador.'
  },
  {
    id: 'pauta-004',
    processo: '2026.000.003314/INEMA/LIC-00455',
    interessado: 'Consórcio Rodovias do Oeste Baiano',
    unidadeAtual: 'DIRRE/CGF',
    tecnicoAtual: 'Sem atribuição técnica',
    situacaoAtual: 'REVISADO',
    qtdAtos: 1,
    atos: ['Licença de Operação (LO)'],
    ultimaMovimentacao: '13/09/2026',
    diasSemMovimentacao: 9,
    situacaoPrazo: 'No prazo',
    municipio: 'Luís Eduardo Magalhães',
    tipologia: 'Infraestrutura Rodoviária',
    liderEquipe: 'Eng. Agr. Renata Vasconcelos',
    membrosEquipe: ['Eng. Amb. Juliana Castro'],
    observacoes: 'Pendente de redistribuição pelo coordenador após desligamento de técnico anterior.'
  },
  {
    id: 'pauta-005',
    processo: '2025.000.007810/INEMA/LIC-00910',
    interessado: 'Bahia Termoelétrica Energia Verde',
    unidadeAtual: 'DILIC/UR-METRO',
    tecnicoAtual: 'Sem atribuição técnica',
    situacaoAtual: 'AGUARDANDO DOCUMENTAÇÃO',
    qtdAtos: 2,
    atos: ['Licença Prévia (LP)', 'Outorga Preventiva'],
    ultimaMovimentacao: '20/06/2026',
    diasSemMovimentacao: 94,
    situacaoPrazo: 'Prazo Excedido',
    municipio: 'Camaçari',
    tipologia: 'Indústria Química',
    liderEquipe: 'Sem atribuição técnica',
    membrosEquipe: [],
    observacoes: 'Processo paralisado aguardando envio de certidão municipal de uso do solo.'
  },
  {
    id: 'pauta-006',
    processo: '2026.000.005119/INEMA/LIC-00790',
    interessado: 'Polo Petroquímico Camaçari Revestimentos Ltda',
    unidadeAtual: 'DILIC/UR-METRO',
    tecnicoAtual: 'Eng. Amb. Juliana Castro',
    situacaoAtual: 'AGUARDANDO PARECER TÉCNICO',
    qtdAtos: 1,
    atos: ['Licença Unificada (LU)'],
    ultimaMovimentacao: '25/08/2026',
    diasSemMovimentacao: 28,
    situacaoPrazo: 'Atenção',
    municipio: 'Camaçari',
    tipologia: 'Indústria Química',
    liderEquipe: 'Eng. Amb. Juliana Castro',
    membrosEquipe: ['Geól. André Martins', 'Biól. Fernando Sampaio'],
    observacoes: 'Faltam 2 dias úteis para o vencimento do prazo regulamentar.'
  }
];

export const MOCK_EVOLUCAO_MENSAL = [
  { mes: 'Jan/26', tramitacoes: 210, atos: 340 },
  { mes: 'Fev/26', tramitacoes: 245, atos: 390 },
  { mes: 'Mar/26', tramitacoes: 290, atos: 460 },
  { mes: 'Abr/26', tramitacoes: 320, atos: 510 },
  { mes: 'Mai/26', tramitacoes: 280, atos: 440 },
  { mes: 'Jun/26', tramitacoes: 350, atos: 570 },
  { mes: 'Jul/26', tramitacoes: 390, atos: 620 },
  { mes: 'Ago/26', tramitacoes: 410, atos: 670 },
  { mes: 'Set/26', tramitacoes: 342, atos: 540 }
];

export const MOCK_DISTRIBUICAO_UNIDADE = [
  { unidade: 'DIRRE/CGF', total: 680 },
  { unidade: 'DIRRE/CEG', total: 540 },
  { unidade: 'DILIC/UR-OESTE', total: 490 },
  { unidade: 'DIRRE/CRH', total: 420 },
  { unidade: 'DILIC/UR-METRO', total: 390 },
  { unidade: 'DILIC/UR-SUL', total: 360 },
  { unidade: 'DILIC/UR-SUDOESTE', total: 240 },
  { unidade: 'DIREC/CORRE', total: 170 }
];

export const MOCK_SITUACOES_PAUTA = [
  { name: 'EM ANÁLISE TÉCNICA', value: 342, color: '#0F4C3A' },
  { name: 'RL APROVADA', value: 215, color: '#2D6A4F' },
  { name: 'NOTIFICADO', value: 128, color: '#52796F' },
  { name: 'REVISADO', value: 89, color: '#475569' },
  { name: 'AGUARDANDO DOC.', value: 72, color: '#94A3B8' }
];

export const MOCK_FAIXAS_DIAS_PAUTA = [
  { faixa: 'Até 15 dias', processos: 395 },
  { faixa: '16 a 30 dias', processos: 214 },
  { faixa: '31 a 60 dias', processos: 125 },
  { faixa: '61 a 90 dias', processos: 68 },
  { faixa: 'Mais de 90 dias', processos: 44 }
];

export const MOCK_ATIVIDADES_TECNICO = [
  {
    tecnico: 'Eng. Agr. Renata Vasconcelos',
    unidade: 'DIRRE/CGF',
    processosParticipacao: 182,
    registrosParticipacao: 310
  },
  {
    tecnico: 'Eng. Amb. Juliana Castro',
    unidade: 'DIRRE/CEG',
    processosParticipacao: 154,
    registrosParticipacao: 265
  },
  {
    tecnico: 'Geól. André Martins',
    unidade: 'DILIC/UR-SUL',
    processosParticipacao: 138,
    registrosParticipacao: 220
  },
  {
    tecnico: 'Biól. Marcos Lima',
    unidade: 'DIRRE/CGF',
    processosParticipacao: 122,
    registrosParticipacao: 195
  },
  {
    tecnico: 'Biól. Fernando Sampaio',
    unidade: 'DIRRE/CRH',
    processosParticipacao: 110,
    registrosParticipacao: 184
  },
  {
    tecnico: 'Eng. Florestal Carolina Medeiros',
    unidade: 'DIRRE/CGF',
    processosParticipacao: 98,
    registrosParticipacao: 162
  }
];

export const MOCK_ANUAL_DIRRE = [
  {
    familia: 'Autorizações Florestais',
    ato: 'Autorização de Supressão de Vegetação (ASV)',
    situacao: 'DEFERIDO',
    registros: 840,
    concluidosPublicados: 790
  },
  {
    familia: 'Licenciamento Ordinário',
    ato: 'Licença de Instalação (LI)',
    situacao: 'DEFERIDO',
    registros: 615,
    concluidosPublicados: 580
  },
  {
    familia: 'Licenciamento Ordinário',
    ato: 'Licença de Operação (LO)',
    situacao: 'DEFERIDO',
    registros: 520,
    concluidosPublicados: 495
  },
  {
    familia: 'Outorga de Recursos Hídricos',
    ato: 'Outorga de Captação Subterrânea',
    situacao: 'DEFERIDO',
    registros: 480,
    concluidosPublicados: 460
  },
  {
    familia: 'Cadastro Estadual Florestal',
    ato: 'Cadastro Estadual Florestal de Imóveis Rurais (CEFIR)',
    situacao: 'CONCLUÍDO',
    registros: 835,
    concluidosPublicados: 810
  }
];
