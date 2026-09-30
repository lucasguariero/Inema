/**
 * Tipagens Oficiais do Módulo Fiscalização - DOR004 e DOR005.1
 * Sistema: INEMA / SEIA
 */

export type TipoRegistroFiscalizacao = 'Denúncia Ambiental (RD)' | 'Emergência Química (RE)';

export type StatusRegistroExterno =
  | 'Emergência Registrada'
  | 'Denúncia Registrada'
  | 'Análise Técnica'
  | 'Em Fiscalização'
  | 'Em Vistoria'
  | 'Concluído'
  | 'Arquivado'
  | 'Cancelado';

export type TipoRelatorioRegulatorio = 'Preliminar' | 'Conclusivo' | 'Complementar';

export interface EventoHistoricoRegistro {
  id: string;
  dataHora: string;
  usuario: string;
  acao: string;
  tipoArquivo?: TipoRelatorioRegulatorio | string;
  nomeArquivo?: string;
  detalhes?: string;
}

export interface RegistroFiscalizacaoExterno {
  id: string;
  numeroRegistro: string; // Ex: 2026.000142/INEMA/RE ou 2026.000088/INEMA/RD
  tipoRegistro: TipoRegistroFiscalizacao;
  dataHoraCadastro: string; // DD/MM/AAAA HH:mm
  dataHoraIso: string; // YYYY-MM-DDTHH:mm
  municipio: string;
  status: StatusRegistroExterno;
  
  // Detalhes da ocorrência
  tipoEmergenciaQuimica?: string;
  descricaoTipoOutros?: string;
  descricao: string;
  pontoReferencia: string;
  endereco: string;
  bairro?: string;
  numero?: string;
  cep?: string;
  descricaoCenario?: string;
  areasAtingidas?: string[];
  
  // Coordenadas
  coordenadas?: {
    tipo: string;
    latitude: string;
    longitude: string;
    latDecimal: string;
    lngDecimal: string;
  }[];

  // Comunicante (Gov.br)
  comunicante: {
    nomeRazaoSocial: string;
    cpfCnpj?: string;
    telefone: string;
    outroTelefone?: string;
    email?: string;
    vinculoEmpresa: 'SIM' | 'NÃO';
    nomeEmpresaTrabalho?: string;
    cargo?: string;
    classificacaoSemVinculo?: string;
    outrasInstituicoesNome?: string;
    empresaResponsavelInformada?: string;
  };

  // Processo SEIA associado
  processoFormal?: string;

  // Anexos iniciais
  anexosIniciais?: {
    id: string;
    nome: string;
    tamanho: string;
    dataUpload: string;
  }[];

  // Relatórios Regulatórios Anexados
  relatoriosAnexados: {
    id: string;
    tipo: TipoRelatorioRegulatorio;
    nomeArquivo: string;
    tamanhoBytes: number;
    dataHoraEnvio: string;
    usuarioEnvio: string;
  }[];

  // Histórico auditável
  historico: EventoHistoricoRegistro[];
}

export interface FiltrosConsultaExterna {
  status?: string;
  numeroRegistro?: string;
  municipio?: string;
  tipoRegistro?: string; // Todos, RD ou RE
  tipoEmergencia?: string;
  dataInicial?: string;
  dataFinal?: string;
}
