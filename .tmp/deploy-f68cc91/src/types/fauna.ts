/**
 * Tipagens Oficiais do Módulo de Gestão de Fauna Silvestre
 * Sistema: INEMA / SEIA (Bahia)
 * Escopo: Ciclo de vida completo do animal (Dia 1 até destinação final/óbito),
 * Prontuário Clínico, Biometria, Cadastros Transversais (CETAS, ASAS, Guardião, Zoo)
 */

export type ClasseTaxonomica = 
  | 'Aves'
  | 'Mamíferos'
  | 'Répteis'
  | 'Anfíbios'
  | 'Peixes'
  | 'Invertebrados';

export type StatusConservacao = 
  | 'LC - Pouco Preocupante'
  | 'NT - Quase Ameaçada'
  | 'VU - Vulnerável'
  | 'EN - Em Perigo'
  | 'CR - Criticamente em Perigo'
  | 'EW - Extinta na Natureza'
  | 'DD - Dados Insuficientes';

export type TipoMarcacao = 
  | 'Microchip'
  | 'Anilha Aberta'
  | 'Anilha Fechada'
  | 'Brinco Auricular'
  | 'Tatuagem'
  | 'Fotoid/Padrão Natural'
  | 'Sem Marcação (Aguardando)';

export type OrigemEntrada = 
  | 'Unidade Regional INEMA'
  | 'Posto Avançado INEMA'
  | 'Apreensão Policial (BPAmb/PRF/PF)'
  | 'Fiscalização INEMA'
  | 'Resgate em Área de Risco/Urbana'
  | 'Entrega Voluntária por Cidadão'
  | 'Transferência de outro CETAS'
  | 'Nascimento em Cativeiro Autorizado';

export type StatusAnimal = 
  | 'Triagem Inicial'
  | 'Quarentena'
  | 'Em Tratamento Clínico'
  | 'Reabilitação / Treinamento de Voo'
  | 'Apto para Soltura (ASAS)'
  | 'Solto na Natureza (ASAS Monitorada)'
  | 'Em Guarda Responsável (Guardião)'
  | 'Transferido para Zoológico/Mantenedouro'
  | 'Óbito - Destinado a Pesquisa Científica'
  | 'Óbito - Destinação Sanitária / Incineração';

export type DestinacaoFinalTipo =
  | 'Soltura em ASAS'
  | 'Guarda Fiel / Guardião'
  | 'Zoológico / Criadouro Científico'
  | 'Transferência Interestadual'
  | 'Doação de Carcaça para Pesquisa / Universidade'
  | 'Descarte Sanitário Adequado';

export interface RegistroBiometria {
  id: string;
  dataHora: string;
  pesoGramas: number;
  escoreCorporal: 1 | 2 | 3 | 4 | 5; // 1: Muito Magro, 3: Ideal, 5: Obeso
  comprimentoTotalCm?: number;
  envergaduraCm?: number;
  temperaturaCorporalC?: number;
  responsavelNome: string;
  responsavelCargo: 'Veterinário' | 'Biólogo' | 'Técnico em Manejo';
  observacoes?: string;
}

export interface ConsultaVeterinaria {
  id: string;
  dataHora: string;
  veterinarioNome: string;
  crmv: string;
  tipoAtendimento: 'Triagem Admissional' | 'Rotina' | 'Emergência' | 'Cirurgia' | 'Exame Periódico' | 'Avaliação para Soltura';
  sintomasAnamnese: string;
  diagnosticoPresuntivo: string;
  condutaTerapeutica: string;
  medicamentosPrescritos?: Array<{
    farmaco: string;
    dose: string;
    frequencia: string;
    duracaoDias: number;
  }>;
  examesSolicitados?: string[];
  aptoParaSoltura: boolean;
  proximoRetorno?: string;
}

export interface DocumentoAnexo {
  id: string;
  nomeArquivo: string;
  tamanhoBytes: number;
  tipoMime: string;
  categoria: 
    | 'Foto de Admissão'
    | 'Foto da Marcação/Microchip'
    | 'Laudo Veterinário'
    | 'Termo de Apreensão / Resgate'
    | 'Termo de Depósito e Guarda (TDG)'
    | 'Guia de Transporte Animal (GTA)'
    | 'Atestado de Óbito e Necropsia'
    | 'Termo de Doação Científica / Pesquisa'
    | 'Termo de Soltura em ASAS'
    | 'Exame Laboratorial / Raio-X';
  url: string;
  dataUpload: string;
  usuarioUpload: string;
}

export interface HistoricoCicloVida {
  id: string;
  dataHora: string;
  titulo: string;
  descricao: string;
  tipoEvento: 
    | 'admissao'
    | 'triagem'
    | 'marcacao'
    | 'consulta'
    | 'pesagem'
    | 'mudanca_recinto'
    | 'transferencia'
    | 'soltura'
    | 'guarda'
    | 'vistoria'
    | 'obito'
    | 'doacao_pesquisa';
  responsavel: string;
  documentoRefId?: string;
}

export interface AnimalFauna {
  id: string;
  rgAnimal: string; // Ex: FAUNA-BA-2026-00482
  numeroCetas: string; // Ex: CETAS-SSA-10492
  tipoMarcacao: TipoMarcacao;
  codigoMarcacao: string; // Ex: 981020002938192 (Microchip) ou BA-3921 (Anilha)
  nomePopular: string;
  nomeCientifico: string;
  classe: ClasseTaxonomica;
  sexo: 'Macho' | 'Fêmea' | 'Indeterminado';
  faseVida: 'Filhote / Neonato' | 'Jovem' | 'Subadulto' | 'Adulto' | 'Senil';
  statusConservacao: StatusConservacao;
  origem: OrigemEntrada;
  unidadeOrigemNome: string;
  dataAdmissao: string;
  localApreensaoResgate?: string;
  numeroBoletimOcorrencia?: string;
  cetasAtual: string;
  recintoAtual: string;
  status: StatusAnimal;
  pesagens: RegistroBiometria[];
  consultas: ConsultaVeterinaria[];
  documentos: DocumentoAnexo[];
  linhaDoTempo: HistoricoCicloVida[];
  destinacaoFinal?: {
    tipo: DestinacaoFinalTipo;
    data: string;
    entidadeDestinoNome: string;
    termoReferencia: string;
    laudoVeterinarioAprovacao: string;
    universidadePesquisa?: string;
    motivoObito?: string;
  };
}

export interface CadastroCETAS {
  id: string;
  nome: string;
  unidadeRegionalVinculada: string;
  capacidadeTotal: number;
  ocupacaoAtual: number;
  responsavelTecnico: string;
  crmvResponsavel: string;
  telefone: string;
  email: string;
  recintos: Array<{
    codigo: string;
    tipo: 'Quarentena' | 'Ambulatório' | 'Recinto de Voo' | 'Gaiolas de Tratamento' | 'Recinto de Reabilitação Coletiva';
    capacidade: number;
    ocupados: number;
    classeDestinada: ClasseTaxonomica;
  }>;
}

export interface CadastroASAS {
  id: string;
  codigoASAS: string;
  tipoPropriedade: 'Pública' | 'Privada';
  nomePropriedade: string;
  proprietarioNome: string;
  cpfCnpj: string;
  municipio: string;
  uf: 'BA';
  bioma: 'Caatinga' | 'Cerrado' | 'Mata Atlântica' | 'Zona Costeira';
  areaTotalHectares: number;
  numeroCar: string;
  statusAutorizacao: 'Autorizada' | 'Em Análise de Viabilidade' | 'Vistoria Agendada' | 'Suspensa';
  classesAptasSoltura: ClasseTaxonomica[];
  dataUltimaVistoria?: string;
  responsavelTecnicoInema: string;
  totalSolturasRealizadas: number;
}

export interface CadastroGuardiao {
  id: string;
  numeroTDG: string;
  tipoPessoa: 'Física' | 'Jurídica';
  nomeRazaoSocial: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  enderecoCompleto: string;
  municipio: string;
  animaisSobGuarda: Array<{
    animalId: string;
    rgAnimal: string;
    especie: string;
    dataInicioGuarda: string;
  }>;
  statusGuarda: 'Regular' | 'Notificado' | 'Vistoria Pendente' | 'Termo Revogado';
  dataUltimaVistoria?: string;
  dataProximaVistoria: string;
  laudoVistoriaResumo?: string;
}

export interface CadastroZoologico {
  id: string;
  nomeInstituicao: string;
  cnpj: string;
  registroIbamaInema: string;
  categoria: 'Zoológico Municipal/Estadual' | 'Criadouro Científico' | 'Mantenedouro de Fauna Silvestre';
  municipio: string;
  diretorTecnicoVeterinario: string;
  crmv: string;
  totalAnimaisCustodiados: number;
  convenioPesquisaUniversidades: string[];
  statusRegularidade: 'Ativo e Regular' | 'Renovação de Licença' | 'Vistoria Obrigatória';
}
