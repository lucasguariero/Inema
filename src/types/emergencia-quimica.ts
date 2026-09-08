/**
 * Tipagens Oficiais do Módulo de Fiscalização - Emergência Química
 * Normas: DOR003 (Fluxo Interno) e DOR004 (Fluxo Externo)
 * Sistema: INEMA / SEIA
 */

export type StatusEmergencia = 
  | 'Emergência Registrada'
  | 'Análise Técnica'
  | 'Em Vistoria'
  | 'Concluída'
  | 'Cancelada';

export type TipoOrigemComunicado =
  | 'Call center (empresa oficial)'
  | 'Correspondência'
  | 'E-mail'
  | 'Ofício'
  | 'Ouvidoria'
  | 'Presencial'
  | 'SEI'
  | 'Telefone (interno INEMA)';

export type TipoEmergenciaQuimica =
  | 'Acidente no transporte rodoviário de produtos químicos'
  | 'Acidente em via férrea'
  | 'Acidente industrial em planta química ou petroquímica'
  | 'Incidente no modal aquaviário ou terminal marítimo'
  | 'Lançamento ou descarte irregular de efluentes ou produtos químicos'
  | 'Vazamento em sistema subterrâneo de armazenamento de combustíveis'
  | 'Ocorrência com produto químico perigoso em ETA/ETE'
  | 'Efluente de barragem de rejeitos'
  | 'Efluente de barragem de aterro industrial ou sanitário'
  | 'Ruptura ou falha em sistema de contenção'
  | 'Mortandade de peixes ou fauna aquática por contaminação química'
  | 'Pluma de contaminação'
  | 'Mancha de origem desconhecida'
  | 'Afloramento de contaminantes'
  | 'Outros';

export type AreaAtingidaTipo =
  | 'Área Urbana'
  | 'Distrito'
  | 'Assentamento Rural'
  | 'Comunidade Indígena'
  | 'Área Industrial'
  | 'Dutovia'
  | 'Colônia de Pescadores'
  | 'Comunidade Tradicional'
  | 'Povoado'
  | 'Posto de Combustível'
  | 'Recurso Hídrico'
  | 'Rodovia'
  | 'Área de Marinha'
  | 'Unidade de Conservação';

export type SistemaCoordenada =
  | 'Geográfica/Grau Decimal'
  | 'Grau/Min/Seg'
  | 'UTM 23'
  | 'UTM 24';

export interface CoordenadaGeografica {
  id: string;
  tipo: SistemaCoordenada;
  latitude: string | number;
  longitude: string | number;
  latitudeDecimal?: number;
  longitudeDecimal?: number;
}

export interface AnexoEmergencia {
  id: string;
  nome: string;
  tamanhoBytes: number;
  tipoMime: string;
  dataUpload: string;
  categoria?: 'inicial' | 'rpeq' | 'conclusivo' | 'complementar';
}

export interface ComunicanteInterno {
  nomeRazaoSocial: string;
  telefone: string;
  cpfCnpj?: string;
  outroTelefone?: string;
  email?: string;
  vinculoEmpresa: 'SIM' | 'NÃO';
  empresaResponsavelInformada?: string;
}

export interface ComunicanteExternoGovBr {
  nomeRazaoSocial: string;
  telefone: string;
  cpfCnpj?: string;
  outroTelefone?: string;
  email?: string;
  autenticadoGovBr: boolean;
  vinculoEmpresa: 'SIM' | 'NÃO';
  // Se SIM:
  nomeEmpresaTrabalho?: string;
  cargo?: string;
  // Se NÃO:
  classificacaoSemVinculo?: 'Cidadão comum' | 'Força Policial' | 'Outras instituições';
  outrasInstituicoesNome?: string;
  empresaResponsavelInformada?: string;
}

export interface Plantonista {
  id: string;
  nome: string;
  matricula: string;
  cargo: string;
  municipioEscala: string;
  telefonePlantao: string;
  emEscalaHoje: boolean;
  municipioCoincide: boolean;
}

export interface InformacaoAdicionalPosRegistro {
  texto: string;
  dataRegistro: string;
  usuarioRegistro: string;
  anexos?: AnexoEmergencia[];
}

export interface RelatoriosRegulatorios {
  rpeq?: {
    enviado: boolean;
    dataEnvio?: string;
    arquivo?: AnexoEmergencia;
  };
  conclusivo?: {
    enviado: boolean;
    dataEnvio?: string;
    arquivo?: AnexoEmergencia;
  };
  complementares?: AnexoEmergencia[];
}

export interface RegistroEmergenciaQuimica {
  id: string;
  numeroRE: string; // Formato: 2026.XXXXXX/INEMA/RE
  tipoFluxo: 'DOR003_INTERNO' | 'DOR004_EXTERNO';
  status: StatusEmergencia;
  dataCriacao: string;
  
  // Detalhes do Registro (DOR003)
  origem?: TipoOrigemComunicado;
  dataHoraComunicado?: string;
  numeroOriginal?: string;

  // Detalhes da Emergência (comum)
  periodoOcorrencia: string; // Data/hora da ocorrência (ou constatação no externo)
  tipoEmergencia: TipoEmergenciaQuimica;
  descricaoTipoOutros?: string;
  descricao: string; // até 7.000 chars
  anexos: AnexoEmergencia[];

  // Localização (comum)
  municipio: string;
  cep?: string;
  endereco: string;
  bairro?: string;
  numero?: string;
  pontoReferencia: string; // até 1.000 chars
  areasAtingidas: AreaAtingidaTipo[]; // 1 a 3
  descricaoCenario?: string; // até 1.000 chars
  coordenadas: CoordenadaGeografica[];

  // Dados do Comunicante
  comunicante: ComunicanteInterno | ComunicanteExternoGovBr;

  // Associação de Plantonista (Call Center)
  plantonistaAssociado?: Plantonista;
  dataHoraAssociacaoPlantonista?: string;
  dataHoraContatoPlantonista?: string;

  // Informações Adicionais (RN018)
  informacoesAdicionais?: InformacaoAdicionalPosRegistro[];

  // Relatórios Regulatórios (DOR004)
  relatoriosRegulatorios?: RelatoriosRegulatorios;

  // Vinculação formal (TEC/EMER)
  numeroProcessoFormal?: string; // Ex: TEC/EMER/2026/000142
}
