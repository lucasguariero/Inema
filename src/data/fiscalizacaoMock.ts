export interface RegistroFiscalizacao {
  id: string;
  protocolo: string;
  tipo: 'RD' | 'RE';
  tipoNome: 'Denúncia Ambiental' | 'Emergência Química';
  origem: string;
  dataRegistro: string;
  dataOcorrencia: string;
  municipio: string;
  localidade: string;
  descricao: string;
  status: 'Registrado' | 'Em Triagem' | 'Em Análise' | 'Vistoria Agendada' | 'Notificado' | 'Auto de Infração' | 'Concluído';
  prioridade: 'Crítica' | 'Alta' | 'Média' | 'Normal';
  substancia?: string;
  onu?: string;
  classeRisco?: string;
  volumeAproximado?: string;
  infratorOuResponsavel: string;
  cpfCnpj?: string;
  tecnicoResponsavel?: string;
  unidadeRegional: string;
  historico: {
    data: string;
    titulo: string;
    descricao: string;
    responsavel: string;
  }[];
}

export const MUNICIPIOS_BAHIA = [
  'Salvador',
  'Camaçari',
  'Feira de Santana',
  'Vitória da Conquista',
  'Barreiras',
  'Ilhéus',
  'Itabuna',
  'Juazeiro',
  'Porto Seguro',
  'Lauro de Freitas',
  'Jequié',
  'Alagoinhas',
  'Teixeira de Freitas',
  'Simões Filho',
  'Paulo Afonso',
  'Eunápolis',
  'Santo Antônio de Jesus',
  'Valença',
  'Candeias',
  'Luís Eduardo Magalhães',
  'Dias d’Ávila',
  'Guanambi',
  'Serrinha',
  'Senhor do Bonfim',
  'Jacobina',
  'Itapetinga',
  'Madre de Deus',
  'Cruz das Almas',
  'Bom Jesus da Lapa',
  'Brumado'
];

export const SUBSTANCIAS_QUIMICAS = [
  { nome: 'Óleo Diesel / Combustível', onu: '1202', classe: 'Classe 3 - Líquidos Inflamáveis' },
  { nome: 'Gasolina Comum / Aditivada', onu: '1203', classe: 'Classe 3 - Líquidos Inflamáveis' },
  { nome: 'Ácido Sulfúrico', onu: '1830', classe: 'Classe 8 - Substâncias Corrosivas' },
  { nome: 'Hidróxido de Sódio (Soda Cáustica)', onu: '1824', classe: 'Classe 8 - Substâncias Corrosivas' },
  { nome: 'Amônia Anidra', onu: '1005', classe: 'Classe 2.3 - Gases Tóxicos' },
  { nome: 'Gás Liquefeito de Petróleo (GLP)', onu: '1075', classe: 'Classe 2.1 - Gases Inflamáveis' },
  { nome: 'Etanol Hidratado Combustível', onu: '1170', classe: 'Classe 3 - Líquidos Inflamáveis' },
  { nome: 'Defensivo Agrícola / Pesticida Líquido', onu: '2902', classe: 'Classe 6.1 - Substâncias Tóxicas' },
  { nome: 'Solução de Hipoclorito de Sódio', onu: '1791', classe: 'Classe 8 - Substâncias Corrosivas' },
  { nome: 'Benzeno', onu: '1114', classe: 'Classe 3 - Líquidos Inflamáveis' }
];

export const REGISTROS_MOCK_INICIAIS: RegistroFiscalizacao[] = [
  {
    id: '1',
    protocolo: '2026.000089/INEMA/RE',
    tipo: 'RE',
    tipoNome: 'Emergência Química',
    origem: 'Call center (Plantão 24h)',
    dataRegistro: '15/09/2026 08:30',
    dataOcorrencia: '15/09/2026 07:15',
    municipio: 'Candeias',
    localidade: 'BA-522, Km 14 - Polo Petroquímico',
    descricao: 'Tombamento de carreta transportadora com vazamento ativo de Ácido Sulfúrico próximo à drenagem pluvial.',
    status: 'Em Análise',
    prioridade: 'Crítica',
    substancia: 'Ácido Sulfúrico',
    onu: '1830',
    classeRisco: 'Classe 8 - Substâncias Corrosivas',
    volumeAproximado: '12.000 Litros',
    infratorOuResponsavel: 'Transquímica Logística Ltda',
    cpfCnpj: '14.289.412/0001-90',
    tecnicoResponsavel: 'Eng. Carlos Andrade (DIFIS)',
    unidadeRegional: 'UR Metropolitana',
    historico: [
      {
        data: '15/09/2026 08:30',
        titulo: 'Registro de Emergência Aberto',
        descricao: 'Comunicado via PRF e Call Center INEMA. Prioridade máxima acionada.',
        responsavel: 'Plantão DIFIS'
      },
      {
        data: '15/09/2026 08:45',
        titulo: 'Acionamento de Equipe de Resposta',
        descricao: 'Empresa de atendimento emergencial Ambipar acionada com dique de contenção.',
        responsavel: 'Eng. Carlos Andrade'
      }
    ]
  },
  {
    id: '2',
    protocolo: '2026.000142/INEMA/RD',
    tipo: 'RD',
    tipoNome: 'Denúncia Ambiental',
    origem: 'Ouvidoria Geral do Estado',
    dataRegistro: '14/09/2026 14:10',
    dataOcorrencia: '13/09/2026 10:00',
    municipio: 'Barreiras',
    localidade: 'Fazenda Santa Luzia - Gleba B, Rio de Ondas',
    descricao: 'Supressão de vegetação nativa do bioma Cerrado em Área de Preservação Permanente (APP) hídrica com maquinário pesado.',
    status: 'Vistoria Agendada',
    prioridade: 'Alta',
    infratorOuResponsavel: 'Agropecuária Vale Verde S.A.',
    cpfCnpj: '08.912.441/0002-15',
    tecnicoResponsavel: 'Bióloga Fernanda Mattos (UR Barreiras)',
    unidadeRegional: 'UR Oeste',
    historico: [
      {
        data: '14/09/2026 14:10',
        titulo: 'Denúncia Registrada e Triada',
        descricao: 'Encaminhada para a Unidade Regional de Barreiras para verificação in loco.',
        responsavel: 'Triagem DIFIS Central'
      },
      {
        data: '15/09/2026 11:20',
        titulo: 'Vistoria de Campo Agendada',
        descricao: 'Ordem de serviço nº 441/2026 expedida para averiguação de supressão.',
        responsavel: 'Fernanda Mattos'
      }
    ]
  },
  {
    id: '3',
    protocolo: '2026.000078/INEMA/RE',
    tipo: 'RE',
    tipoNome: 'Emergência Química',
    origem: 'Defesa Civil Estadual',
    dataRegistro: '12/09/2026 19:40',
    dataOcorrencia: '12/09/2026 19:00',
    municipio: 'Camaçari',
    localidade: 'Via Atlântica, Km 8 - Distrito Industrial',
    descricao: 'Vazamento de GLP em válvula reguladora durante operação de descarregamento industrial.',
    status: 'Notificado',
    prioridade: 'Alta',
    substancia: 'Gás Liquefeito de Petróleo (GLP)',
    onu: '1075',
    classeRisco: 'Classe 2.1 - Gases Inflamáveis',
    volumeAproximado: '450 Kg',
    infratorOuResponsavel: 'Petrovale Derivados Ltda',
    cpfCnpj: '03.456.789/0001-22',
    tecnicoResponsavel: 'Inspetor Marcos Ribeiro (DIFIS)',
    unidadeRegional: 'UR Metropolitana',
    historico: [
      {
        data: '12/09/2026 19:40',
        titulo: 'Ocorrência Registrada',
        descricao: 'Acionamento de contenção imediata e isolamento de raio de 300m.',
        responsavel: 'Plantão DIFIS'
      },
      {
        data: '13/09/2026 09:00',
        titulo: 'Notificação Expedida',
        descricao: 'Empresa intimada a apresentar Plano de Investigação de Passivo Ambiental em 48h.',
        responsavel: 'Marcos Ribeiro'
      }
    ]
  },
  {
    id: '4',
    protocolo: '2026.000138/INEMA/RD',
    tipo: 'RD',
    tipoNome: 'Denúncia Ambiental',
    origem: 'Formulário Cidadão (Gov.br)',
    dataRegistro: '10/09/2026 11:15',
    dataOcorrencia: '09/09/2026',
    municipio: 'Salvador',
    localidade: 'Bairro Stella Maris - Dunas e Restinga',
    descricao: 'Descarte clandestino de entulho de construção civil e queima de resíduos plásticos ao ar livre em área de proteção.',
    status: 'Auto de Infração',
    prioridade: 'Média',
    infratorOuResponsavel: 'Empreendimentos Litoral Norte Eireli',
    cpfCnpj: '22.333.444/0001-55',
    tecnicoResponsavel: 'Fiscal Rodrigo Santos',
    unidadeRegional: 'UR Metropolitana',
    historico: [
      {
        data: '10/09/2026 11:15',
        titulo: 'Registro Cidadão Confirmado',
        descricao: 'Fotos e localização georreferenciada validadas.',
        responsavel: 'Sistema Automático'
      },
      {
        data: '11/09/2026 15:30',
        titulo: 'Auto de Infração Lavrado',
        descricao: 'Auto nº 2026-08892 lavrado por infração ao Decreto Estadual nº 14.024/12.',
        responsavel: 'Rodrigo Santos'
      }
    ]
  },
  {
    id: '5',
    protocolo: '2026.000135/INEMA/RD',
    tipo: 'RD',
    tipoNome: 'Denúncia Ambiental',
    origem: 'Ofício / Polícia Militar (COPPA)',
    dataRegistro: '08/09/2026 16:50',
    dataOcorrencia: '08/09/2026',
    municipio: 'Ilhéus',
    localidade: 'Rodovia Ilhéus-Itacaré, Km 22',
    descricao: 'Desmatamento não autorizado de Mata Atlântica primária para loteamento irregular.',
    status: 'Concluído',
    prioridade: 'Normal',
    infratorOuResponsavel: 'Investimentos Turísticos Baía Azul',
    tecnicoResponsavel: 'Eng. Luciana Prado (UR Ilhéus)',
    unidadeRegional: 'UR Litoral Sul',
    historico: [
      {
        data: '08/09/2026 16:50',
        titulo: 'Ofício COPPA autuado',
        descricao: 'Processo instaurado com laudo da polícia ambiental anexado.',
        responsavel: 'Protocolo Geral'
      },
      {
        data: '14/09/2026 17:00',
        titulo: 'Embargo e Conclusão',
        descricao: 'Área embargada e termo de compromisso de recuperação assinado.',
        responsavel: 'Luciana Prado'
      }
    ]
  }
];
