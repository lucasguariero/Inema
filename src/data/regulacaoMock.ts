export interface TramitacaoItem {
  id: string;
  processo: string;
  dataTramitacao: string;
  interessado: string;
  unidade: string;
  ato: string;
  familiaAto: string;
  situacao: string;
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
  situacaoAtual: string;
  qtdAtos: number;
  atos: string[];
  ultimaMovimentacao: string;
  diasSemMovimentacao: number;
  situacaoPrazo: 'No prazo' | 'Excedido' | 'Suspenso' | 'Não aplicável' | 'Indeterminado';
  municipio: string;
  tipologia: string;
  liderEquipe: string;
  membrosEquipe: string[];
  observacoes: string;
  semTramitacao?: boolean;
  diasDesdeFormacao?: number;
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
  dataInicio: '2024-01-01',
  dataFim: '2024-12-31',
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
  atoVinculado: string;
  municipio: string;
  tipologia: string;
  diasMin: string;
  diasMax: string;
  atribuicao: string;
}

export const FILTROS_PAUTA_INICIAIS: FiltrosPauta = {
  busca: '',
  prazo: 'todos',
  unidade: 'todas',
  tecnico: 'todos',
  situacao: 'todas',
  atoVinculado: 'todos',
  municipio: 'todos',
  tipologia: 'todas',
  diasMin: '',
  diasMax: '',
  atribuicao: 'todos'
};

export const LISTA_UNIDADES = [
  'NOUT',
  'COASP',
  'CGDIS',
  'COMIN',
  'CGF',
  'CEG',
  'CRH',
  'DIRRE/CGF',
  'DIRRE/CEG',
  'DIRRE/CRH',
  'DIRRE/NOUT',
  'DILIC/UR-OESTE',
  'DILIC/UR-SUL',
  'DILIC/UR-METRO'
];

export const LISTA_SISTEMAS = ['SEI', 'SEIA', 'DOF', 'CERBERUS', 'SINAFLOR'];

export const LISTA_ATOS = [
  'Despacho',
  'NOT',
  'Autorização de Supressão de Vegetação (ASV)',
  'Autorização por procedimento especial (APE)',
  'Autorizações para o Manejo de Fauna',
  'Homologação de pátio',
  'Carta',
  'Auto de Infração Advertência (AIAD)',
  'Ofício',
  'Aprovação da Relocação da Reserva Legal (ARRL)',
  'Aprovação da Localização da Reserva Legal (ARL)',
  'Licença Prévia (LP)',
  'Licença de Instalação (LI)',
  'Licença de Operação (LO)'
];

export const LISTA_SITUACOES = [
  'CONCLUÍDO',
  'NOTIFICADO',
  'HOMOLOGAÇÃO DOF+',
  'AUTUADO',
  'REVISADO',
  'ARQUIVADO',
  'RL APROVADA',
  'NOTIFICAÇÃO DE COMUNICAÇÃO',
  'EM ANÁLISE TÉCNICA',
  'AGUARDANDO PARECER TÉCNICO',
  'DEFERIDO',
  'CANCELADO',
  'INDEFERIDO'
];

export const LISTA_TECNICOS = [
  'JOSELICE LEONE LIMA FONSECA',
  'WENDELL VILAS BOAS SANTOS',
  'RUTE DE OLIVEIRA SANTANA',
  'MAGDA RANIELE RODRIGUES MAGALHAES',
  'THOMAZ BORGES ARARIPE BARBOSA',
  'GENI DE SENA DIAS URPIA',
  'ADELINA DE OLIVEIRA E SILVA',
  'CAMILA DAPHINY PEREIRA VITORIO',
  'MARIA CRISTINA GOMES SANCHES',
  'SARAH PATRICIA LIMA NUNES',
  'CLARISSE DIAS CRUZ',
  'ANDRESSA CRISTINA RIBEIRO ASSUNCAO',
  'FELIPE DOS SANTOS DE OLIVEIRA',
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
  'Todas',
  'Florestal',
  'Licença',
  'Outorga'
];

export const MOCK_TRAMITACOES: TramitacaoItem[] = [
  {
    "id": "tram-001",
    "processo": "2016.001.029630/CEFIR",
    "dataTramitacao": "02/05/2024",
    "interessado": "Gape Giuberti Agropecuaria Ltda",
    "unidade": "COASP",
    "ato": "Aprovação da Localização da Reserva Legal (ARL)",
    "familiaAto": "Florestal / CEFIR",
    "situacao": "RL APROVADA",
    "municipio": "Salvador",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "CLARISSE DIAS CRUZ",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 4,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Aprovação da Localização da Reserva Legal (ARL) com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-002",
    "processo": "2024.001.000006/INEMA/LIC-00006",
    "dataTramitacao": "02/05/2024",
    "interessado": "CONSORCIO RZ PERNAMBUCO",
    "unidade": "COASP",
    "ato": "Autorização de Supressão de Vegetação (ASV)",
    "familiaAto": "Florestal / CEFIR",
    "situacao": "REVISADO",
    "municipio": "Barreiras",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 11,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização de Supressão de Vegetação (ASV) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-003",
    "processo": "046.0539.2024.0010739-10",
    "dataTramitacao": "02/05/2024",
    "interessado": "THIAGO DANTE FORMAGIO",
    "unidade": "COASP",
    "ato": "NOT",
    "familiaAto": "Outros",
    "situacao": "NOTIFICADO",
    "municipio": "Ilhéus",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "ANDRESSA CRISTINA RIBEIRO ASSUNCAO",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 18,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato NOT com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-004",
    "processo": "046.0539.2024.0011691-94",
    "dataTramitacao": "02/05/2024",
    "interessado": "GILMAR TAGLIARI BORTOLIN",
    "unidade": "COASP",
    "ato": "NOT",
    "familiaAto": "Outros",
    "situacao": "NOTIFICADO",
    "municipio": "Feira de Santana",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "FELIPE DOS SANTOS DE OLIVEIRA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 25,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato NOT com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-005",
    "processo": "046.0539.2024.0010676-00",
    "dataTramitacao": "02/05/2024",
    "interessado": "JOSE FELIPE MENEZES DE FREITAS",
    "unidade": "COASP",
    "ato": "NOTC",
    "familiaAto": "Outros",
    "situacao": "NOTIFICAÇÃO DE COMUNICAÇÃO",
    "municipio": "Salvador",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "ANDRESSA CRISTINA RIBEIRO ASSUNCAO",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 32,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato NOTC com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-006",
    "processo": "046.0525.2023.0036946-72",
    "dataTramitacao": "02/01/2024",
    "interessado": "Marlucio Rodrigues Abreu",
    "unidade": "COASP",
    "ato": "Despacho",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Barreiras",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 39,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Despacho com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-007",
    "processo": "046.0525.2024.0011829-69",
    "dataTramitacao": "03/05/2024",
    "interessado": "JOSE ORLEANS DO NASCIMENTO",
    "unidade": "COASP",
    "ato": "Cancelamento de Cadastro",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CANCELADO",
    "municipio": "Ilhéus",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 1,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Cancelamento de Cadastro com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-008",
    "processo": "046.0539.2024.0011880-67",
    "dataTramitacao": "03/05/2024",
    "interessado": "BERNARDO BATISTA DE ARAÚJO",
    "unidade": "COASP",
    "ato": "NOT",
    "familiaAto": "Outros",
    "situacao": "NOTIFICADO",
    "municipio": "Feira de Santana",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "SARAH PATRICIA LIMA NUNES",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 8,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato NOT com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-009",
    "processo": "2023.001.000639/INEMA/LIC-00639",
    "dataTramitacao": "03/05/2024",
    "interessado": "FERNANDO DE OLIVEIRA VAZ",
    "unidade": "COASP",
    "ato": "Autorização de Supressão de Vegetação (ASV)",
    "familiaAto": "Florestal / CEFIR",
    "situacao": "REVISADO",
    "municipio": "Salvador",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 15,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização de Supressão de Vegetação (ASV) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-010",
    "processo": "046.0539.2024.0011776-18",
    "dataTramitacao": "07/05/2024",
    "interessado": "COMPANHIA DE FERRO LIGAS DA BAHIA - FERBASA",
    "unidade": "COASP",
    "ato": "Auto de Infração Multa (AIMU)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "AUTUADO",
    "municipio": "Barreiras",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "GENI DE SENA DIAS URPIA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 22,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Auto de Infração Multa (AIMU) com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-011",
    "processo": "046.0539.2024.0011477-19",
    "dataTramitacao": "06/05/2024",
    "interessado": "COMERCIAL ARCOVERDE LTDA",
    "unidade": "COASP",
    "ato": "Auto de Infração Advertência (AIAD)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "AUTUADO",
    "municipio": "Ilhéus",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "GENI DE SENA DIAS URPIA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 29,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Auto de Infração Advertência (AIAD) com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-012",
    "processo": "2023.001.006188/INEMA/LIC-06188",
    "dataTramitacao": "06/05/2024",
    "interessado": "GAPE GIUBERTI AGROPECUARIA LTDA",
    "unidade": "COASP",
    "ato": "Aprovação da Localização da Servidão Florestal (ASF)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "NOTIFICADO",
    "municipio": "Feira de Santana",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "CLARISSE DIAS CRUZ",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 36,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Aprovação da Localização da Servidão Florestal (ASF) com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-013",
    "processo": "2023.001.000537/INEMA/LIC-00537",
    "dataTramitacao": "06/05/2024",
    "interessado": "GERSON JOSÉ BONFANTTI",
    "unidade": "COASP",
    "ato": "Autorização de Supressão de Vegetação (ASV)",
    "familiaAto": "Florestal / CEFIR",
    "situacao": "CONCLUÍDO",
    "municipio": "Salvador",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "JOSE DA SILVA CERQUEIRA NETO",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 43,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização de Supressão de Vegetação (ASV) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-014",
    "processo": "2023.001.002904/INEMA/LIC-02904",
    "dataTramitacao": "06/05/2024",
    "interessado": "AFONSO CHRISTIANO NETTO",
    "unidade": "COASP",
    "ato": "Autorização Ambiental (AA)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CONCLUÍDO",
    "municipio": "Barreiras",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "MARIA CRISTINA GOMES SANCHES",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 5,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização Ambiental (AA) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-015",
    "processo": "2022.001.009334/INEMA/LIC-09334",
    "dataTramitacao": "06/05/2024",
    "interessado": "JAILTON SANTOS FERREIRA",
    "unidade": "COASP",
    "ato": "Autorização de Supressão de Vegetação (ASV)",
    "familiaAto": "Florestal / CEFIR",
    "situacao": "NOTIFICADO",
    "municipio": "Ilhéus",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "RUTE DE OLIVEIRA SANTANA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 12,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização de Supressão de Vegetação (ASV) com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-016",
    "processo": "2012.001.000874/INEMA/LIC-00874",
    "dataTramitacao": "02/01/2024",
    "interessado": "Andre Luis Nascimento Guimaraes",
    "unidade": "COASP",
    "ato": "Autorização de Supressão de Vegetação (ASV)",
    "familiaAto": "Florestal / CEFIR",
    "situacao": "REVISADO",
    "municipio": "Feira de Santana",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 19,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização de Supressão de Vegetação (ASV) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-017",
    "processo": "2017.001.002538/INEMA/LIC-02538",
    "dataTramitacao": "19/04/2019",
    "interessado": "Fazenda Progresso Ltda",
    "unidade": "COASP",
    "ato": "Autorização de Supressão de Vegetação (ASV)",
    "familiaAto": "Florestal / CEFIR",
    "situacao": "REVISADO",
    "municipio": "Salvador",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 26,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização de Supressão de Vegetação (ASV) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-018",
    "processo": "2023.001.011523/INEMA/LIC-11523",
    "dataTramitacao": "03/01/2024",
    "interessado": "Marlucio Rodrigues Abreu",
    "unidade": "COASP",
    "ato": "Autorização por procedimento especial (APE)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CONCLUÍDO",
    "municipio": "Barreiras",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 33,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização por procedimento especial (APE) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-019",
    "processo": "2023.001.012115/INEMA/LIC-012115",
    "dataTramitacao": "03/01/2024",
    "interessado": "Carlos Andrade Sampaio Júnior",
    "unidade": "COASP",
    "ato": "Autorização por procedimento especial (APE)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CONCLUÍDO",
    "municipio": "Ilhéus",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 40,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização por procedimento especial (APE) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-020",
    "processo": "046.0525.2023.0037650-14",
    "dataTramitacao": "02/01/2024",
    "interessado": "Carlos Andrade Sampaio Júnior",
    "unidade": "COASP",
    "ato": "Despacho",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Feira de Santana",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 2,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Despacho com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-021",
    "processo": "2023.001.012242/INEMA/LIC-12242",
    "dataTramitacao": "03/01/2024",
    "interessado": "Carlos Andrade Sampaio Júnior",
    "unidade": "COASP",
    "ato": "Autorização por procedimento especial (APE)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CONCLUÍDO",
    "municipio": "Salvador",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 9,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização por procedimento especial (APE) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-022",
    "processo": "046.0525.2023.0037656-18",
    "dataTramitacao": "02/01/2024",
    "interessado": "Carlos Andrade Sampaio Júnior",
    "unidade": "COASP",
    "ato": "Despacho",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Barreiras",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 16,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Despacho com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-023",
    "processo": "046.0539.2024.0000117-83",
    "dataTramitacao": "03/01/2024",
    "interessado": "IVANILDO PONATH",
    "unidade": "COASP",
    "ato": "NOT",
    "familiaAto": "Outros",
    "situacao": "NOTIFICADO",
    "municipio": "Ilhéus",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 23,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato NOT com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-024",
    "processo": "046.0539.2024.0000111-98",
    "dataTramitacao": "03/01/2024",
    "interessado": "WALTER SATORU HIRATA",
    "unidade": "COASP",
    "ato": "NOT",
    "familiaAto": "Outros",
    "situacao": "NOTIFICADO",
    "municipio": "Feira de Santana",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 30,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato NOT com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-025",
    "processo": "046.0539.2024.0000102-05",
    "dataTramitacao": "03/01/2024",
    "interessado": "JOSE MARIA LELIS",
    "unidade": "COASP",
    "ato": "NOT",
    "familiaAto": "Outros",
    "situacao": "NOTIFICADO",
    "municipio": "Salvador",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 37,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato NOT com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-026",
    "processo": "046.0525.2022.0021410-16",
    "dataTramitacao": "02/05/2024",
    "interessado": "GABRIEL FURUTAN",
    "unidade": "COASP",
    "ato": "Despacho",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Barreiras",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "FELIPE DOS SANTOS DE OLIVEIRA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 44,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Despacho com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-027",
    "processo": "046.0525.2024.0004637-60",
    "dataTramitacao": "02/05/2024",
    "interessado": "MONICA DINA ADAM",
    "unidade": "COASP",
    "ato": "Despacho",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Ilhéus",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "CLARISSE DIAS CRUZ",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 6,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Despacho com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-028",
    "processo": "046.0539.2024.0000106-21",
    "dataTramitacao": "03/01/2024",
    "interessado": "JOSE MARIA LELIS",
    "unidade": "COASP",
    "ato": "NOT",
    "familiaAto": "Outros",
    "situacao": "NOTIFICADO",
    "municipio": "Feira de Santana",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 13,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato NOT com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-029",
    "processo": "2022.001.002055/INEMA/LIC-02055",
    "dataTramitacao": "18/01/2024",
    "interessado": "BRACELL BAHIA FLORESTAL LTDA",
    "unidade": "COASP",
    "ato": "Licença de Instalação (LI)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CONCLUÍDO",
    "municipio": "Salvador",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "LUANA PRISCILA DE CARVALHO PEREIRA",
    "membrosEquipe": [
      "ADELINA DE OLIVEIRA E SILVA"
    ],
    "ano": 2024,
    "diasSemMovimentacao": 20,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Licença de Instalação (LI) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-030",
    "processo": "046.0525.2024.0004639-21",
    "dataTramitacao": "02/05/2024",
    "interessado": "MONICA DINA ADAM",
    "unidade": "COASP",
    "ato": "Despacho",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Barreiras",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "CLARISSE DIAS CRUZ",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 27,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Despacho com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-031",
    "processo": "046.0539.2024.0011852-11",
    "dataTramitacao": "02/05/2024",
    "interessado": "JACQUES SCHMITT",
    "unidade": "COASP",
    "ato": "Ofício",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Ilhéus",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "RUTE DE OLIVEIRA SANTANA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 34,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Ofício com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-032",
    "processo": "046.0539.2024.0011864-47",
    "dataTramitacao": "02/05/2024",
    "interessado": "Fazenda Vale Verde IX.",
    "unidade": "COASP",
    "ato": "Ofício",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Feira de Santana",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "RUTE DE OLIVEIRA SANTANA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 41,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Ofício com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-033",
    "processo": "2023.001.007591/INEMA/LIC-07591",
    "dataTramitacao": "03/01/2024",
    "interessado": "LEMA CONSULTORIA S;C LTDA",
    "unidade": "COASP",
    "ato": "Autorização de Supressão de Vegetação (ASV)",
    "familiaAto": "Florestal / CEFIR",
    "situacao": "NOTIFICADO",
    "municipio": "Salvador",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "SARAH PATRICIA LIMA NUNES",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 3,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização de Supressão de Vegetação (ASV) com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-034",
    "processo": "046.0525.2024.0007611-91",
    "dataTramitacao": "02/05/2024",
    "interessado": "ANDREA LEMOS - MPBA",
    "unidade": "COASP",
    "ato": "Ofício",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Barreiras",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 10,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Ofício com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-035",
    "processo": "046.0525.2024.0011665-05",
    "dataTramitacao": "03/05/2024",
    "interessado": "WELISSA MIRANDA",
    "unidade": "COASP",
    "ato": "Despacho",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Ilhéus",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 17,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Despacho com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-036",
    "processo": "2023.001.005794/INEMA/LIC-05794",
    "dataTramitacao": "05/04/2024",
    "interessado": "SYMBIOSI INVESTIMENTOS E PARTICIPAÇÕES S.A.",
    "unidade": "COASP",
    "ato": "Aprovação da Exploração ou Corte de Florestas Plantadas (ACFP)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CONCLUÍDO",
    "municipio": "Feira de Santana",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "ADELINA DE OLIVEIRA E SILVA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 24,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Aprovação da Exploração ou Corte de Florestas Plantadas (ACFP) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-037",
    "processo": "046.0539.2024.0009338-26",
    "dataTramitacao": "08/04/2024",
    "interessado": "EDIVON OLIVEIRA DA SILVA LTDA",
    "unidade": "COASP",
    "ato": "Auto de Infração Advertência (AIAD)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "AUTUADO",
    "municipio": "Salvador",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "WENDELL VILAS BOAS SANTOS",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 31,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Auto de Infração Advertência (AIAD) com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-038",
    "processo": "2016.001.003460/INEMA/LIC-03460",
    "dataTramitacao": "10/05/2024",
    "interessado": "ALDORI JULIANI",
    "unidade": "COASP",
    "ato": "Autorização por procedimento especial (APE)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CONCLUÍDO",
    "municipio": "Barreiras",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "MAGDA RANIELE RODRIGUES MAGALHAES",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 38,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização por procedimento especial (APE) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-039",
    "processo": "2016.001.003369/INEMA/LIC-03369",
    "dataTramitacao": "10/05/2024",
    "interessado": "JUNIOR SOMAVILLA",
    "unidade": "COASP",
    "ato": "Autorização por procedimento especial (APE)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CONCLUÍDO",
    "municipio": "Ilhéus",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "MAGDA RANIELE RODRIGUES MAGALHAES",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 0,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização por procedimento especial (APE) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-040",
    "processo": "2023.001.001152/INEMA/LIC-01152",
    "dataTramitacao": "08/04/2024",
    "interessado": "Osvaldo Takemoto",
    "unidade": "COASP",
    "ato": "Autorização de Supressão de Vegetação (ASV)",
    "familiaAto": "Florestal / CEFIR",
    "situacao": "NOTIFICADO",
    "municipio": "Feira de Santana",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "CAMILA DAPHINY PEREIRA VITORIO",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 7,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização de Supressão de Vegetação (ASV) com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  },
  {
    "id": "tram-041",
    "processo": "046.0525.2024.0006670-98",
    "dataTramitacao": "09/04/2024",
    "interessado": "GEORGE SIMOES VIEIRA",
    "unidade": "COASP",
    "ato": "Despacho",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Salvador",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 14,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Despacho com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-042",
    "processo": "046.0525.2024.0008103-11",
    "dataTramitacao": "10/04/2024",
    "interessado": "CARACOL AGROPECUÁRIA LTDA",
    "unidade": "COASP",
    "ato": "Despacho",
    "familiaAto": "Outros",
    "situacao": "CONCLUÍDO",
    "municipio": "Barreiras",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "MAGDA RANIELE RODRIGUES MAGALHAES",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 21,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEI referente ao ato Despacho com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-043",
    "processo": "2017.001.004238/INEMA/LIC-04238",
    "dataTramitacao": "10/04/2024",
    "interessado": "Francisco Klein",
    "unidade": "COASP",
    "ato": "Autorização por procedimento especial (APE)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CONCLUÍDO",
    "municipio": "Ilhéus",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "MAGDA RANIELE RODRIGUES MAGALHAES",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 28,
    "prazoExcedido": false,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização por procedimento especial (APE) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-044",
    "processo": "2016.001.003283/INEMA/LIC-03283",
    "dataTramitacao": "10/04/2024",
    "interessado": "EZELINO CARVALHO",
    "unidade": "COASP",
    "ato": "Autorização por procedimento especial (APE)",
    "familiaAto": "Licenciamento / Regularização",
    "situacao": "CONCLUÍDO",
    "municipio": "Feira de Santana",
    "tipologia": "Infraestrutura / Energia",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 35,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização por procedimento especial (APE) com parecer técnico.",
    "etapaAtual": "Instrução e Análise Conclusiva"
  },
  {
    "id": "tram-045",
    "processo": "2023.001.001469/INEMA/LIC-01469",
    "dataTramitacao": "12/04/2024",
    "interessado": "FAZENDA ALDEIA AGROPASTORIL LTDA",
    "unidade": "COASP",
    "ato": "Autorização de Supressão de Vegetação (ASV)",
    "familiaAto": "Florestal / CEFIR",
    "situacao": "NOTIFICADO",
    "municipio": "Salvador",
    "tipologia": "Mineração / Indústria",
    "liderEquipe": "CAMILA DAPHINY PEREIRA VITORIO",
    "membrosEquipe": [],
    "ano": 2024,
    "diasSemMovimentacao": 42,
    "prazoExcedido": true,
    "resumoDespacho": "Tramitação registrada via SEIA referente ao ato Autorização de Supressão de Vegetação (ASV) com parecer técnico.",
    "etapaAtual": "Aguardando Providências"
  }
];

export const MOCK_PAUTA: PautaItem[] = [
  {
    "id": "pauta-001",
    "processo": "2024.001.008412/INEMA/LIC-00841",
    "interessado": "Agroflorestal Bahia Sul S.A.",
    "unidadeAtual": "DIRRE/CGF",
    "tecnicoAtual": "RUTE DE OLIVEIRA SANTANA",
    "situacaoAtual": "EM ANÁLISE TÉCNICA",
    "qtdAtos": 2,
    "atos": [
      "Autorização de Supressão de Vegetação (ASV)",
      "Licença Prévia (LP)"
    ],
    "ultimaMovimentacao": "15/09/2024",
    "diasSemMovimentacao": 9,
    "situacaoPrazo": "No prazo",
    "municipio": "Ilhéus",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "RUTE DE OLIVEIRA SANTANA",
    "membrosEquipe": [
      "GENI DE SENA DIAS URPIA"
    ],
    "observacoes": "Processo em análise técnica instrutória pela equipe multidisciplinar da DIRRE."
  },
  {
    "id": "pauta-002",
    "processo": "2023.001.019432/INEMA/OUT-01943",
    "interessado": "Mineração Serra Dourada Ltda",
    "unidadeAtual": "DIRRE/CRH",
    "tecnicoAtual": "THOMAZ BORGES ARARIPE BARBOSA",
    "situacaoAtual": "AGUARDANDO RESPOSTA DO REQUERENTE",
    "qtdAtos": 1,
    "atos": [
      "Outorga de Direito de Uso de Recursos Hídricos"
    ],
    "ultimaMovimentacao": "20/08/2024",
    "diasSemMovimentacao": 35,
    "situacaoPrazo": "Suspenso",
    "municipio": "Barreiras",
    "tipologia": "Mineração",
    "liderEquipe": "THOMAZ BORGES ARARIPE BARBOSA",
    "membrosEquipe": [],
    "observacoes": "Notificação nº 2024/0412 expedida. Requerente em prazo regulamentar para juntada de complementações."
  },
  {
    "id": "pauta-003",
    "processo": "2024.001.000319/INEMA/FORM-00319",
    "interessado": "Bioenergia Campo Limpo Ltda",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "Sem atribuição técnica",
    "situacaoAtual": "FORMADO - SEM TRAMITAÇÃO",
    "qtdAtos": 1,
    "atos": [
      "Aprovação da Localização da Reserva Legal (ARL)"
    ],
    "ultimaMovimentacao": "Sem tramitação registrada",
    "diasSemMovimentacao": 45,
    "situacaoPrazo": "Indeterminado",
    "municipio": "Luís Eduardo Magalhães",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "Sem atribuição técnica",
    "membrosEquipe": [],
    "observacoes": "Processo formado via balcão do SEIA sem movimentação ou atribuição técnica inicial.",
    "semTramitacao": true,
    "diasDesdeFormacao": 45
  },
  {
    "id": "pauta-004",
    "processo": "2024.001.002841/INEMA/LIC-00284",
    "interessado": "Consórcio Eólico Ventos da Bahia",
    "unidadeAtual": "DIRRE/CEG",
    "tecnicoAtual": "Sem atribuição técnica",
    "situacaoAtual": "AGUARDANDO DISTRIBUIÇÃO",
    "qtdAtos": 3,
    "atos": [
      "Licença Prévia (LP)",
      "Licença de Instalação (LI)",
      "ASV"
    ],
    "ultimaMovimentacao": "01/09/2024",
    "diasSemMovimentacao": 23,
    "situacaoPrazo": "No prazo",
    "municipio": "Caetité",
    "tipologia": "Energia Eólica",
    "liderEquipe": "Sem atribuição técnica",
    "membrosEquipe": [],
    "observacoes": "Processo triado aguardando despacho da chefia para designação de responsável técnico."
  },
  {
    "id": "pauta-005",
    "processo": "046.0539.2024.0010739-10",
    "interessado": "THIAGO DANTE FORMAGIO",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "ANDRESSA CRISTINA RIBEIRO ASSUNCAO",
    "situacaoAtual": "NOTIFICADO",
    "qtdAtos": 3,
    "atos": [
      "NOT"
    ],
    "ultimaMovimentacao": "02/05/2024",
    "diasSemMovimentacao": 21,
    "situacaoPrazo": "Suspenso",
    "municipio": "Ilhéus",
    "tipologia": "Mineração",
    "liderEquipe": "ANDRESSA CRISTINA RIBEIRO ASSUNCAO",
    "membrosEquipe": [],
    "observacoes": "Processo em acompanhamento ativo na DIRRE/COASP."
  },
  {
    "id": "pauta-006",
    "processo": "046.0539.2024.0011691-94",
    "interessado": "GILMAR TAGLIARI BORTOLIN",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "FELIPE DOS SANTOS DE OLIVEIRA",
    "situacaoAtual": "NOTIFICADO",
    "qtdAtos": 1,
    "atos": [
      "NOT",
      "Despacho"
    ],
    "ultimaMovimentacao": "02/05/2024",
    "diasSemMovimentacao": 30,
    "situacaoPrazo": "Excedido",
    "municipio": "Feira de Santana",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "FELIPE DOS SANTOS DE OLIVEIRA",
    "membrosEquipe": [],
    "observacoes": "Processo com prazo regulamentar excedido aguardando manifestação do setor."
  },
  {
    "id": "pauta-007",
    "processo": "046.0539.2024.0010676-00",
    "interessado": "JOSE FELIPE MENEZES DE FREITAS",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "ANDRESSA CRISTINA RIBEIRO ASSUNCAO",
    "situacaoAtual": "NOTIFICAÇÃO DE COMUNICAÇÃO",
    "qtdAtos": 2,
    "atos": [
      "NOTC"
    ],
    "ultimaMovimentacao": "02/05/2024",
    "diasSemMovimentacao": 39,
    "situacaoPrazo": "Suspenso",
    "municipio": "Salvador",
    "tipologia": "Infraestrutura Rodoviária",
    "liderEquipe": "ANDRESSA CRISTINA RIBEIRO ASSUNCAO",
    "membrosEquipe": [],
    "observacoes": "Processo em acompanhamento ativo na DIRRE/COASP."
  },
  {
    "id": "pauta-008",
    "processo": "046.0525.2023.0036946-72",
    "interessado": "Marlucio Rodrigues Abreu",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "situacaoAtual": "CONCLUÍDO",
    "qtdAtos": 3,
    "atos": [
      "Despacho",
      "Despacho"
    ],
    "ultimaMovimentacao": "02/01/2024",
    "diasSemMovimentacao": 48,
    "situacaoPrazo": "Não aplicável",
    "municipio": "Barreiras",
    "tipologia": "Mineração",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "observacoes": "Processo concluído no SEIA. Prazos encerrados regularmente."
  },
  {
    "id": "pauta-009",
    "processo": "046.0525.2024.0011829-69",
    "interessado": "JOSE ORLEANS DO NASCIMENTO",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "situacaoAtual": "CANCELADO",
    "qtdAtos": 1,
    "atos": [
      "Cancelamento de Cadastro"
    ],
    "ultimaMovimentacao": "03/05/2024",
    "diasSemMovimentacao": 57,
    "situacaoPrazo": "Não aplicável",
    "municipio": "Ilhéus",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "observacoes": "Processo cancelado. Não aplicável regime de prazos regulamentares."
  },
  {
    "id": "pauta-010",
    "processo": "046.0539.2024.0011880-67",
    "interessado": "BERNARDO BATISTA DE ARAÚJO",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "SARAH PATRICIA LIMA NUNES",
    "situacaoAtual": "NOTIFICADO",
    "qtdAtos": 2,
    "atos": [
      "NOT",
      "Despacho"
    ],
    "ultimaMovimentacao": "03/05/2024",
    "diasSemMovimentacao": 66,
    "situacaoPrazo": "Excedido",
    "municipio": "Feira de Santana",
    "tipologia": "Energia Eólica",
    "liderEquipe": "SARAH PATRICIA LIMA NUNES",
    "membrosEquipe": [],
    "observacoes": "Processo com prazo vencido para análise instrutória complementar."
  },
  {
    "id": "pauta-011",
    "processo": "2023.001.000639/INEMA/LIC-00639",
    "interessado": "FERNANDO DE OLIVEIRA VAZ",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "JOSELICE LEONE LIMA FONSECA",
    "situacaoAtual": "REVISADO",
    "qtdAtos": 3,
    "atos": [
      "Autorização de Supressão de Vegetação (ASV)"
    ],
    "ultimaMovimentacao": "03/05/2024",
    "diasSemMovimentacao": 75,
    "situacaoPrazo": "Excedido",
    "municipio": "Salvador",
    "tipologia": "Mineração",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "observacoes": "Processo com prazo excedido na fila de revisão técnica da DIRRE."
  },
  {
    "id": "pauta-012",
    "processo": "2023.001.006188/INEMA/LIC-06188",
    "interessado": "GAPE GIUBERTI AGROPECUARIA LTDA",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "CLARISSE DIAS CRUZ",
    "situacaoAtual": "NOTIFICADO",
    "qtdAtos": 3,
    "atos": [
      "Aprovação da Localização da Servidão Florestal (ASF)",
      "Despacho"
    ],
    "ultimaMovimentacao": "06/05/2024",
    "diasSemMovimentacao": 7,
    "situacaoPrazo": "No prazo",
    "municipio": "Feira de Santana",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "CLARISSE DIAS CRUZ",
    "membrosEquipe": [],
    "observacoes": "Processo em acompanhamento regular dentro do prazo normativo."
  },
  {
    "id": "pauta-013",
    "processo": "2023.001.000537/INEMA/LIC-00537",
    "interessado": "GERSON JOSÉ BONFANTTI",
    "unidadeAtual": "NOUT",
    "tecnicoAtual": "JOSE DA SILVA CERQUEIRA NETO",
    "situacaoAtual": "EM ANÁLISE TÉCNICA",
    "qtdAtos": 1,
    "atos": [
      "Outorga de Direito de Uso de Recursos Hídricos"
    ],
    "ultimaMovimentacao": "06/05/2024",
    "diasSemMovimentacao": 16,
    "situacaoPrazo": "No prazo",
    "municipio": "Salvador",
    "tipologia": "Recursos Hídricos",
    "liderEquipe": "JOSE DA SILVA CERQUEIRA NETO",
    "membrosEquipe": [],
    "observacoes": "Processo em análise técnica no Núcleo de Outorga (NOUT)."
  },
  {
    "id": "pauta-014",
    "processo": "2023.001.002904/INEMA/LIC-02904",
    "interessado": "AFONSO CHRISTIANO NETTO",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "MARIA CRISTINA GOMES SANCHES",
    "situacaoAtual": "NOTIFICADO",
    "qtdAtos": 2,
    "atos": [
      "Autorização Ambiental (AA)",
      "Despacho"
    ],
    "ultimaMovimentacao": "06/05/2024",
    "diasSemMovimentacao": 25,
    "situacaoPrazo": "Suspenso",
    "municipio": "Barreiras",
    "tipologia": "Infraestrutura Rodoviária",
    "liderEquipe": "MARIA CRISTINA GOMES SANCHES",
    "membrosEquipe": [],
    "observacoes": "Processo com prazo suspenso durante período de notificação técnica."
  },
  {
    "id": "pauta-015",
    "processo": "2022.001.009334/INEMA/LIC-09334",
    "interessado": "JAILTON SANTOS FERREIRA",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "RUTE DE OLIVEIRA SANTANA",
    "situacaoAtual": "NOTIFICADO",
    "qtdAtos": 3,
    "atos": [
      "Autorização de Supressão de Vegetação (ASV)"
    ],
    "ultimaMovimentacao": "06/05/2024",
    "diasSemMovimentacao": 34,
    "situacaoPrazo": "Excedido",
    "municipio": "Ilhéus",
    "tipologia": "Mineração",
    "liderEquipe": "RUTE DE OLIVEIRA SANTANA",
    "membrosEquipe": [],
    "observacoes": "Processo com prazo expirado na DIRRE."
  },
  {
    "id": "pauta-016",
    "processo": "2024.001.001289/INEMA/OUT-00128",
    "interessado": "Agropecuária Vale do São Francisco",
    "unidadeAtual": "NOUT",
    "tecnicoAtual": "CLARISSE DIAS CRUZ",
    "situacaoAtual": "EM ANÁLISE TÉCNICA",
    "qtdAtos": 1,
    "atos": [
      "Outorga Preventiva"
    ],
    "ultimaMovimentacao": "10/05/2024",
    "diasSemMovimentacao": 12,
    "situacaoPrazo": "No prazo",
    "municipio": "Juazeiro",
    "tipologia": "Recursos Hídricos",
    "liderEquipe": "CLARISSE DIAS CRUZ",
    "membrosEquipe": [],
    "observacoes": "Processo tramitado no NOUT com parecer hidrogeológico em elaboração."
  },
  {
    "id": "pauta-017",
    "processo": "2017.001.002538/INEMA/LIC-02538",
    "interessado": "Fazenda Progresso Ltda",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "JOSELICE LEONE LIMA FONSECA",
    "situacaoAtual": "REVISADO",
    "qtdAtos": 2,
    "atos": [
      "Autorização de Supressão de Vegetação (ASV)"
    ],
    "ultimaMovimentacao": "19/04/2024",
    "diasSemMovimentacao": 52,
    "situacaoPrazo": "Excedido",
    "municipio": "Salvador",
    "tipologia": "Infraestrutura Rodoviária",
    "liderEquipe": "JOSELICE LEONE LIMA FONSECA",
    "membrosEquipe": [],
    "observacoes": "Processo em acompanhamento com prazo estourado."
  },
  {
    "id": "pauta-018",
    "processo": "2023.001.011523/INEMA/LIC-11523",
    "interessado": "Marlucio Rodrigues Abreu",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "situacaoAtual": "CONCLUÍDO",
    "qtdAtos": 3,
    "atos": [
      "Autorização por procedimento especial (APE)",
      "Despacho"
    ],
    "ultimaMovimentacao": "03/01/2024",
    "diasSemMovimentacao": 61,
    "situacaoPrazo": "Não aplicável",
    "municipio": "Barreiras",
    "tipologia": "Mineração",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "observacoes": "Processo concluído no SEIA."
  },
  {
    "id": "pauta-019",
    "processo": "2023.001.012115/INEMA/LIC-012115",
    "interessado": "Carlos Andrade Sampaio Júnior",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "situacaoAtual": "CONCLUÍDO",
    "qtdAtos": 1,
    "atos": [
      "Autorização por procedimento especial (APE)"
    ],
    "ultimaMovimentacao": "03/01/2024",
    "diasSemMovimentacao": 70,
    "situacaoPrazo": "Não aplicável",
    "municipio": "Ilhéus",
    "tipologia": "Agrossilvopastoril",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "observacoes": "Processo concluído com expedição de ato."
  },
  {
    "id": "pauta-020",
    "processo": "046.0525.2023.0037650-14",
    "interessado": "Carlos Andrade Sampaio Júnior",
    "unidadeAtual": "COASP",
    "tecnicoAtual": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "situacaoAtual": "CONCLUÍDO",
    "qtdAtos": 2,
    "atos": [
      "Despacho",
      "Despacho"
    ],
    "ultimaMovimentacao": "02/01/2024",
    "diasSemMovimentacao": 79,
    "situacaoPrazo": "Não aplicável",
    "municipio": "Feira de Santana",
    "tipologia": "Infraestrutura Rodoviária",
    "liderEquipe": "GEORGE WEBER DOS SANTOS ARAUJO SOUZA",
    "membrosEquipe": [],
    "observacoes": "Processo arquivado no SEIA."
  }
];

// 4 KPIS OFICIAIS DO EXCEL (CPDIRRE - ABA MONITORAMENTO GERAL)
export const MOCK_RESUMO_DIRRE = {
  totalProcessos: 12151,
  totalAtos: 12151,
  maiorTramitacaoMes: 482,
  menorTramitacaoMes: 15,
  mediaMensal: 347,
  processosConcluidos: 7391,
  processosNotificados: 2688
};

// DADOS DOS GRÁFICOS DO EXCEL - MONITORAMENTO GERAL
export const MOCK_SISTEMAS_DONUT = [
  { name: 'SEI', value: 6697, percentual: 55.1 },
  { name: 'SEIA', value: 3975, percentual: 32.7 },
  { name: 'DOF', value: 1217, percentual: 10.0 },
  { name: 'CERBERUS', value: 174, percentual: 1.4 },
  { name: 'SINAFLOR', value: 84, percentual: 0.8 }
];

export const MOCK_STATUS_BARRA = [
  { name: 'CONCLUÍDO', total: 7391 },
  { name: 'NOTIFICADO', total: 2688 },
  { name: 'HOMOLOGAÇÃO DOF+', total: 748 },
  { name: 'AUTUADO', total: 308 },
  { name: 'REVISADO', total: 282 },
  { name: 'ARQUIVADO', total: 254 },
  { name: 'RL APROVADA', total: 199 }
];

export const MOCK_ATOS_DISTRIBUICAO = [
  { ato: 'Despacho', total: 3352 },
  { ato: 'NOT', total: 1469 },
  { ato: 'Supressão (ASV)', total: 995 },
  { ato: 'Proc. Especial (APE)', total: 971 },
  { ato: 'Manejo Fauna', total: 947 },
  { ato: 'Homologação Pátio', total: 752 },
  { ato: 'Carta / Ofício', total: 1051 },
  { ato: 'Infração (AIAD)', total: 472 },
  { ato: 'Reserva Legal (ARL)', total: 335 }
];

export const MOCK_TECNICOS_COMPARATIVO = [
  { tecnico: 'JOSELICE LEONE', atos: 2947, processos: 2810 },
  { tecnico: 'WENDELL VILAS BOAS', atos: 1254, processos: 1190 },
  { tecnico: 'RUTE DE OLIVEIRA', atos: 964, processos: 920 },
  { tecnico: 'MAGDA RANIELE', atos: 915, processos: 880 },
  { tecnico: 'THOMAZ BORGES', atos: 865, processos: 840 },
  { tecnico: 'GENI DE SENA', atos: 712, processos: 690 },
  { tecnico: 'ADELINA DE OLIVEIRA', atos: 512, processos: 495 },
  { tecnico: 'CAMILA DAPHINY', atos: 510, processos: 480 },
  { tecnico: 'MARIA CRISTINA', atos: 467, processos: 450 },
  { tecnico: 'SARAH PATRICIA', atos: 466, processos: 440 }
];

export const MOCK_EVOLUCAO_MENSAL_DIRRE = [
  { mes: 'Jan', ano2023: 210, ano2024: 315 },
  { mes: 'Fev', ano2023: 180, ano2024: 290 },
  { mes: 'Mar', ano2023: 295, ano2024: 412 },
  { mes: 'Abr', ano2023: 310, ano2024: 445 },
  { mes: 'Mai', ano2023: 350, ano2024: 482 }, // Pico: 482
  { mes: 'Jun', ano2023: 320, ano2024: 390 },
  { mes: 'Jul', ano2023: 280, ano2024: 360 },
  { mes: 'Ago', ano2023: 310, ano2024: 410 },
  { mes: 'Set', ano2023: 290, ano2024: 375 },
  { mes: 'Out', ano2023: 240, ano2024: 330 },
  { mes: 'Nov', ano2023: 190, ano2024: 280 },
  { mes: 'Dez', ano2023: 85, ano2024: 15 }    // Menor: 15
];

export const MOCK_SITUACOES_PAUTA = [
  { name: 'CONCLUÍDO', value: 1240, percentual: 32.3 },
  { name: 'NOTIFICADO', value: 890, percentual: 23.2 },
  { name: 'REVISADO', value: 650, percentual: 16.9 },
  { name: 'RL APROVADA', value: 520, percentual: 13.5 },
  { name: 'EM ANÁLISE TÉCNICA', value: 340, percentual: 8.9 },
  { name: 'AUTUADO', value: 200, percentual: 5.2 }
];

export const MOCK_FAIXAS_DIAS_PAUTA = [
  { faixa: 'Até 15 dias', quantidade: 1450 },
  { faixa: '16 a 30 dias', quantidade: 1120 },
  { faixa: '31 a 60 dias', quantidade: 780 },
  { faixa: '61 a 90 dias', quantidade: 310 },
  { faixa: 'Mais de 90 dias', quantidade: 180 }
];

export const MOCK_EVOLUCAO_MENSAL = [
  { mes: 'Jan', total: 315, atos: 330 },
  { mes: 'Fev', total: 290, atos: 305 },
  { mes: 'Mar', total: 412, atos: 430 },
  { mes: 'Abr', total: 445, atos: 460 },
  { mes: 'Mai', total: 482, atos: 482 },
  { mes: 'Jun', total: 390, atos: 405 },
  { mes: 'Jul', total: 360, atos: 375 },
  { mes: 'Ago', total: 410, atos: 425 },
  { mes: 'Set', total: 375, atos: 390 },
  { mes: 'Out', total: 330, atos: 345 },
  { mes: 'Nov', total: 280, atos: 295 },
  { mes: 'Dez', total: 15, atos: 15 }
];

export const MOCK_DISTRIBUICAO_UNIDADE = [
  { unidade: 'COASP', total: 6850 },
  { unidade: 'DIRRE/CGF', total: 2150 },
  { unidade: 'DIRRE/CEG', total: 1420 },
  { unidade: 'DIRRE/CRH', total: 980 },
  { unidade: 'CGDIS', total: 450 },
  { unidade: 'DILIC/UR-SUL', total: 301 }
];

export const MOCK_ATIVIDADES_TECNICO = [
  { tecnico: 'JOSELICE LEONE LIMA FONSECA', unidade: 'COASP', processosParticipacao: 2810, registrosParticipacao: 2947 },
  { tecnico: 'WENDELL VILAS BOAS SANTOS', unidade: 'COASP', processosParticipacao: 1190, registrosParticipacao: 1254 },
  { tecnico: 'RUTE DE OLIVEIRA SANTANA', unidade: 'COASP', processosParticipacao: 920, registrosParticipacao: 964 },
  { tecnico: 'MAGDA RANIELE RODRIGUES MAGALHAES', unidade: 'COASP', processosParticipacao: 880, registrosParticipacao: 915 },
  { tecnico: 'THOMAZ BORGES ARARIPE BARBOSA', unidade: 'COASP', processosParticipacao: 840, registrosParticipacao: 865 },
  { tecnico: 'GENI DE SENA DIAS URPIA', unidade: 'COASP', processosParticipacao: 690, registrosParticipacao: 712 },
  { tecnico: 'ADELINA DE OLIVEIRA E SILVA', unidade: 'COASP', processosParticipacao: 495, registrosParticipacao: 512 },
  { tecnico: 'CAMILA DAPHINY PEREIRA VITORIO', unidade: 'COASP', processosParticipacao: 480, registrosParticipacao: 510 },
  { tecnico: 'MARIA CRISTINA GOMES SANCHES', unidade: 'COASP', processosParticipacao: 450, registrosParticipacao: 467 },
  { tecnico: 'SARAH PATRICIA LIMA NUNES', unidade: 'COASP', processosParticipacao: 440, registrosParticipacao: 466 },
  { tecnico: 'CLARISSE DIAS CRUZ', unidade: 'COASP', processosParticipacao: 380, registrosParticipacao: 395 }
];

export const MOCK_ANUAL_DIRRE = [
  { familia: 'Florestal', ato: 'Aprovação da Localização da Reserva Legal (ARL)', situacao: 'RL APROVADA', registros: 335, concluidosPublicados: 310 },
  { familia: 'Florestal', ato: 'Autorização de Supressão de Vegetação (ASV)', situacao: 'CONCLUÍDO', registros: 995, concluidosPublicados: 850 },
  { familia: 'Florestal', ato: 'Homologação de pátio (DOF+)', situacao: 'CONCLUÍDO', registros: 752, concluidosPublicados: 748 },
  { familia: 'Licença', ato: 'Autorização por procedimento especial (APE)', situacao: 'CONCLUÍDO', registros: 971, concluidosPublicados: 940 },
  { familia: 'Licença', ato: 'Licença Prévia (LP)', situacao: 'CONCLUÍDO', registros: 840, concluidosPublicados: 820 },
  { familia: 'Licença', ato: 'Licença de Instalação (LI)', situacao: 'CONCLUÍDO', registros: 620, concluidosPublicados: 600 },
  { familia: 'Outorga', ato: 'Outorga de Direito de Uso de Recursos Hídricos', situacao: 'DEFERIDO', registros: 1240, concluidosPublicados: 1180 },
  { familia: 'Outorga', ato: 'Outorga Preventiva de Recursos Hídricos', situacao: 'CONCLUÍDO', registros: 410, concluidosPublicados: 390 }
];

export const MOCK_ANUAL_DIRRE_FAMILIAS = [
  { name: 'Florestal', registros: 2082, percentual: 33.8, fill: '#0F4C3A' },
  { name: 'Licença', registros: 2431, percentual: 39.4, fill: '#2D6A4F' },
  { name: 'Outorga', registros: 1650, percentual: 26.8, fill: '#52796F' }
];

export const MOCK_ANUAL_DIRRE_EVOLUCAO = [
  { mes: 'Jan', registros: 315 },
  { mes: 'Fev', registros: 290 },
  { mes: 'Mar', registros: 412 },
  { mes: 'Abr', registros: 445 },
  { mes: 'Mai', registros: 482 },
  { mes: 'Jun', registros: 390 },
  { mes: 'Jul', registros: 360 },
  { mes: 'Ago', registros: 410 },
  { mes: 'Set', registros: 375 },
  { mes: 'Out', registros: 330 },
  { mes: 'Nov', registros: 280 },
  { mes: 'Dez', registros: 15 }
];

export const MOCK_EVOLUCAO_TRIMESTRAL_2024 = [
  { periodo: '1º Trimestre', total: 1017, atos: 1065 },
  { periodo: '2º Trimestre', total: 1317, atos: 1347 },
  { periodo: '3º Trimestre', total: 1145, atos: 1190 },
  { periodo: '4º Trimestre', total: 625, atos: 655 }
];

export const MOCK_EVOLUCAO_SEMESTRAL_2024 = [
  { periodo: '1º Semestre', total: 2334, atos: 2412 },
  { periodo: '2º Semestre', total: 1770, atos: 1845 }
];

export const MOCK_EVOLUCAO_ANUAL_HISTORICO = [
  { periodo: '2021', total: 3210, atos: 3450 },
  { periodo: '2022', total: 3680, atos: 3920 },
  { periodo: '2023', total: 3840, atos: 4120 },
  { periodo: '2024', total: 4182, atos: 9450 }
];

export const MOCK_DISTRIBUICAO_ATO_2024 = [
  { label: 'Despacho', total: 3352 },
  { label: 'NOT', total: 1469 },
  { label: 'Outorga Hídrica', total: 1240 },
  { label: 'Carta / Ofício', total: 1051 },
  { label: 'Supressão (ASV)', total: 995 },
  { label: 'Proc. Especial (APE)', total: 971 },
  { label: 'Manejo Fauna', total: 947 },
  { label: 'Homologação Pátio', total: 752 },
  { label: 'Reserva Legal (ARL)', total: 335 }
];

export const MOCK_DISTRIBUICAO_SITUACAO_2024 = [
  { label: 'CONCLUÍDO', total: 7391 },
  { label: 'NOTIFICADO', total: 2688 },
  { label: 'HOMOLOGAÇÃO DOF+', total: 748 },
  { label: 'AUTUADO', total: 308 },
  { label: 'REVISADO', total: 282 },
  { label: 'ARQUIVADO', total: 254 },
  { label: 'RL APROVADA', total: 199 }
];

export const MOCK_DISTRIBUICAO_TECNICO_2024 = [
  { label: 'JOSELICE LEONE', total: 2947 },
  { label: 'WENDELL VILAS BOAS', total: 1254 },
  { label: 'RUTE DE OLIVEIRA', total: 964 },
  { label: 'MAGDA RANIELE', total: 915 },
  { label: 'THOMAZ BORGES', total: 865 },
  { label: 'GENI DE SENA', total: 712 },
  { label: 'ADELINA DE OLIVEIRA', total: 512 },
  { label: 'CAMILA DAPHINY', total: 510 }
];
