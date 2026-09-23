export interface DaeItem {
  id: string;
  codigo: string;
  emissao: string;
  tipo: 'Taxa' | 'Multa' | 'Outorga' | 'Análise';
  requerente: string;
  tecnico: string;
  vencimento: string;
  valor: number;
  situacao: 'Pago' | 'Emitido' | 'Vencido' | 'Cancelado';
  processoVinculado: string;
  descricao: string;
}

export const MOCK_DAES: DaeItem[] = [
  {
    id: 'dae-1',
    codigo: '00456',
    emissao: '29/10/2026',
    tipo: 'Taxa',
    requerente: 'Gabriel Santos Agropecuária',
    tecnico: 'Gabriel Santos',
    vencimento: '01/01/2027',
    valor: 100000.00,
    situacao: 'Pago',
    processoVinculado: '2026.001.029630/CEFIR',
    descricao: 'Taxa de Fiscalização e Licenciamento Ambiental - Fase 1'
  },
  {
    id: 'dae-2',
    codigo: '00789',
    emissao: '11/11/2026',
    tipo: 'Multa',
    requerente: 'Ana Clara Oliveira ME',
    tecnico: 'Ana Clara Oliveira',
    vencimento: '15/02/2027',
    valor: 100.00,
    situacao: 'Pago',
    processoVinculado: '2026.000135/INEMA/RD',
    descricao: 'Auto de Infração nº 2026-088 - Descarte irregular'
  },
  {
    id: 'dae-3',
    codigo: '01234',
    emissao: '24/12/2026',
    tipo: 'Taxa',
    requerente: 'Lucas Almeida Energia Solar',
    tecnico: 'Lucas Almeida',
    vencimento: '30/03/2027',
    valor: 250.00,
    situacao: 'Emitido',
    processoVinculado: 'SEI-021.7820.2026.000188-42',
    descricao: 'Taxa de Análise de Requerimento de Outorga de Água Superficial'
  },
  {
    id: 'dae-4',
    codigo: '00567',
    emissao: '01/01/2027',
    tipo: 'Taxa',
    requerente: 'Mariana Costa Mineração Ltda',
    tecnico: 'Mariana Costa',
    vencimento: '12/04/2027',
    valor: 75.50,
    situacao: 'Emitido',
    processoVinculado: '2026.000142/INEMA/RD',
    descricao: 'Emissão de Certidão Negativa de Débito Ambiental (CND)'
  },
  {
    id: 'dae-5',
    codigo: '00987',
    emissao: '14/02/2027',
    tipo: 'Multa',
    requerente: 'Felipe Pereira Construções',
    tecnico: 'Felipe Pereira',
    vencimento: '25/05/2027',
    valor: 1200.00,
    situacao: 'Emitido',
    processoVinculado: '2026.000089/INEMA/RE',
    descricao: 'Notificação Técnica de Regularização Florestal'
  },
  {
    id: 'dae-6',
    codigo: '00321',
    emissao: '27/03/2027',
    tipo: 'Multa',
    requerente: 'Juliana Mendes Reflorestamento',
    tecnico: 'Juliana Mendes',
    vencimento: '10/06/2027',
    valor: 500.00,
    situacao: 'Pago',
    processoVinculado: '2026.000078/INEMA/RE',
    descricao: 'Termo de Ajustamento de Conduta Ambiental (TAC)'
  },
  {
    id: 'dae-7',
    codigo: '00654',
    emissao: '09/04/2027',
    tipo: 'Multa',
    requerente: 'Ricardo Lima Indústria Química',
    tecnico: 'Ricardo Lima',
    vencimento: '22/07/2027',
    valor: 50.00,
    situacao: 'Emitido',
    processoVinculado: 'SEI-021.9901.2026.0041',
    descricao: 'Taxa Complementar de Vistoria em Área de Preservação Permanente'
  },
  {
    id: 'dae-8',
    codigo: '00876',
    emissao: '21/05/2027',
    tipo: 'Taxa',
    requerente: 'Fernanda Rocha & Cia Ltda',
    tecnico: 'Fernanda Rocha',
    vencimento: '05/08/2027',
    valor: 300.00,
    situacao: 'Emitido',
    processoVinculado: '2026.001.000006/INEMA/LIC',
    descricao: 'Taxa de Renovação de Licença Ambiental Simplificada (LS)'
  },
  {
    id: 'dae-9',
    codigo: '00112',
    emissao: '10/06/2027',
    tipo: 'Taxa',
    requerente: 'Bahia Agronegócios S.A.',
    tecnico: 'Clarisse Dias Cruz',
    vencimento: '15/07/2027',
    valor: 14500.00,
    situacao: 'Pago',
    processoVinculado: '2026.001.029630/CEFIR',
    descricao: 'Taxa de Inscrição no Cadastro Estadual Florestal de Imóveis Rurais'
  },
  {
    id: 'dae-10',
    codigo: '00245',
    emissao: '18/06/2027',
    tipo: 'Outorga',
    requerente: 'Consórcio RZ Pernambuco-Bahia',
    tecnico: 'Joselice Leone Lima',
    vencimento: '20/07/2027',
    valor: 8200.00,
    situacao: 'Vencido',
    processoVinculado: '2024.001.000006/INEMA/LIC-00006',
    descricao: 'Taxa de Outorga de Captação Subterrânea em Aquífero'
  }
];

export interface NotificacaoSeia {
  id: string;
  tipo: 'alerta' | 'sucesso' | 'info';
  titulo: string;
  tempo: string;
  processo: string;
  lida: boolean;
}

export const MOCK_NOTIFICACOES_SEIA: NotificacaoSeia[] = [
  {
    id: 'notif-1',
    tipo: 'alerta',
    titulo: 'Prazo de renovação expira em 3 dias',
    tempo: 'Há 2 horas',
    processo: 'Processo CERH-2026-087',
    lida: false
  },
  {
    id: 'notif-2',
    tipo: 'sucesso',
    titulo: 'Documento aprovado com êxito pelo corpo técnico',
    tempo: 'Há 5 horas',
    processo: 'Certificado CERH-2026-001',
    lida: false
  },
  {
    id: 'notif-3',
    tipo: 'info',
    titulo: 'Novo processo de licenciamento ambiental recebido',
    tempo: 'Há 1 dia',
    processo: 'LIC-2026/00912-BA',
    lida: true
  }
];

export interface ComunicadoSeia {
  id: string;
  tipo: 'AVISO' | 'COMUNICADO';
  titulo: string;
  texto: string;
  autor: string;
  data: string;
}

export const MOCK_COMUNICADOS_SEIA: ComunicadoSeia[] = [
  {
    id: 'com-1',
    tipo: 'AVISO',
    titulo: 'Prazo para entrega de documentação técnica',
    texto: 'Prazo para entrega de documentação do processo de renovação encerra em 30/09/2026. Verifique pendências no portal.',
    autor: 'Secretaria Ambiental / INEMA',
    data: '21/09/2026'
  },
  {
    id: 'com-2',
    tipo: 'COMUNICADO',
    titulo: 'Manutenção programada de servidores',
    texto: 'Manutenção técnica de rotina no domingo das 02h às 06h. Serviços de consulta pública permanecerão disponíveis.',
    autor: 'Equipe de TI e Infraestrutura',
    data: '20/09/2026'
  }
];

export interface MensagemRecente {
  id: string;
  nome: string;
  assunto: string;
  horario: string;
  avatar: string;
}

export const MOCK_MENSAGENS_RECENTES: MensagemRecente[] = [
  {
    id: 'msg-1',
    nome: 'João Silva',
    assunto: 'Consulta sobre processo de licenciamento mineral...',
    horario: '14:32',
    avatar: 'JS'
  },
  {
    id: 'msg-2',
    nome: 'Maria Santos',
    assunto: 'Documentação necessária para análise de outorga...',
    horario: '11:15',
    avatar: 'MS'
  },
  {
    id: 'msg-3',
    nome: 'Equipe Técnica DISUC',
    assunto: 'Resultado da análise de vistoria no Parque do Conduru...',
    horario: '10:05',
    avatar: 'ET'
  }
];

export const MOCK_ATALHOS_SEIA = [
  { id: 'novo-processo', label: 'Novo Processo', rota: 'seia-cadastro', icon: 'PlusCircle', destaque: true },
  { id: 'consultar-dae', label: 'Consultar DAE', rota: 'seia-daes', icon: 'FileSpreadsheet' },
  { id: 'emitir-relatorio', label: 'Emitir Relatório', rota: 'relatorios', icon: 'BarChart3' },
  { id: 'cadastrar-imovel', label: 'Cadastrar Imóvel (CEFIR)', rota: 'seia-cadastro', icon: 'Trees' },
  { id: 'cerh', label: 'Outorga / CERH', rota: 'seia-daes', icon: 'Droplets' },
  { id: 'dashboard', label: 'Dashboard Gerencial', rota: 'dashboard', icon: 'Activity' }
];

export const MOCK_PROCESSOS_MENSAL_SEIA = [
  { mes: 'Dez', quantidade: 38 },
  { mes: 'Jan', quantidade: 47 },
  { mes: 'Fev', quantidade: 54 },
  { mes: 'Mar', quantidade: 68 },
  { mes: 'Abr', quantidade: 61 },
  { mes: 'Mai', quantidade: 89 }
];
