/**
 * INEMA / NOVO SEIA - Módulo de Gestão de Fauna Silvestre - Releases 3 e 4
 * Especificações Oficiais:
 * - DR009 v1.3 (23/10/2026): Cadastro e Análise de ASAS (Áreas de Soltura de Animais Silvestres)
 * - DR010 v1.2 (22/10/2026): Mapa de ASAS e Destinações (Dashboard)
 * - DR012 v1.1 (22/10/2026): Guardião de Animais Silvestres / Termo de Guarda (TGAS)
 */

export type CategoriaAsas = 'Categoria I' | 'Categoria II' | 'Categoria III';

export type SituacaoAsas =
  | 'Em cadastro'
  | 'Em análise'
  | 'Em complementação'
  | 'Aguardando termo'
  | 'Ativa'
  | 'Certificado vencido'
  | 'Suspensa'
  | 'Indeferida'
  | 'Desativada';

export type CanalEntradaAsas = 'Portal Externo' | 'Técnico de Fauna';

export type TipoPropriedadeAsas =
  | 'Imóvel Próprio'
  | 'Imóvel de Terceiros (com anuência)'
  | 'Posse'
  | 'Concessão / Uso';

export type BiomaBahia = 'Caatinga' | 'Cerrado' | 'Mata Atlântica';

export type BaciaHidrograficaBahia =
  | 'Rio Paraguaçu'
  | 'Rio São Francisco'
  | 'Rio de Contas'
  | 'Rio Itapicuru'
  | 'Rio Pardo'
  | 'Rio Grande'
  | 'Rio Cachoeira'
  | 'Rio Una';

export type UnidadeRegionalBahia =
  | 'URCH'
  | 'URES'
  | 'UROE'
  | 'URPD'
  | 'URPS'
  | 'URRC'
  | 'URSF'
  | 'URSO'
  | 'URSU';

export interface CoordenadaSIRGAS2000 {
  lat: number;
  lng: number;
  datum: 'SIRGAS 2000';
  xPct?: number; // Para projeção no mapa SVG da Bahia
  yPct?: number;
}

export interface PoligonoDelimitacaoAsas {
  tipo: 'CEFIR' | 'Upload SHP/KML/GeoJSON' | 'Desenho em Mapa';
  areaHa: number;
  centro: CoordenadaSIRGAS2000;
  pontos: [number, number][]; // [lat, lng]
  valido: boolean;
  sobreposicaoUc?: string;
  sobreposicaoAsasJustificada?: boolean;
  justificativaSobreposicao?: string;
  dataDefinicao: string;
}

export interface RecintoAsas {
  id: string;
  nome: string;
  finalidade: 'Aclimatação' | 'Readaptação' | 'Quarentena' | 'Manutenção';
  comprimentoM: number;
  larguraM: number;
  alturaM: number;
  areaM2: number;
  capacidadeIndividuos: number;
  animaisAbrigadosIds?: string[];
}

export interface VistoriaAsas {
  id: string;
  numero: string;
  data: string;
  equipe: string[];
  ucAte3km?: string;
  vegetacaoPct: number;
  vegetacaoHa: number;
  acoesAntropicas: string[];
  recursosHidricos: string[];
  recintos: RecintoAsas[];
  especiesAdequadasTexto: string; // RN-018: espécies/grupos adequados descritos pelo técnico em texto livre (não catálogo fechado)
  fotos: string[];
  relatorioPdfNome?: string;
  resultado: 'Favorável' | 'Desfavorável';
  justificativa: string;
  concluida: boolean;
}

export interface SolturaHistoricaAsas {
  id: string;
  data: string;
  especie: string;
  nomeCientifico: string;
  grupo: string;
  quantidade: number;
  unidadeOrigem: string;
  termoSolturaNumero: string;
  ano: number;
}

export interface EventoHistoricoAsas {
  id: string;
  dataHora: string;
  usuario: string;
  papel: string;
  acao: string;
  detalhes?: string;
  justificativa?: string;
}

export interface RelatorioTrimestralAsas {
  id: string;
  trimestre: string;
  ano: number;
  dataEnvio: string;
  responsavelTecnico: string;
  artNumero: string;
  status: 'Entregue' | 'Atrasado';
  resumoManejo: string;
  animaisEmReabilitacao: {
    animalId: string;
    nomeComum: string;
    mesesReabilitacao: number; // Max 12 prorrogável por mais 12
    prorrogacaoAutorizada?: boolean;
  }[];
}

export interface AsasItem {
  id: string;
  numero: string; // Ex: ASAS-000.001
  processoSei?: string;
  canalEntrada: CanalEntradaAsas;
  requerente: {
    tipoPessoa: 'PF' | 'PJ';
    nomeOuRazaoSocial: string;
    cpfCnpj: string;
    rgOuIe: string;
    email: string;
    telefone: string;
    representanteLegal?: string;
    representanteCpf?: string;
  };
  categoria: CategoriaAsas;
  justificativaCategoria?: string;
  propriedade: {
    nome: string;
    tipoPropriedade: TipoPropriedadeAsas;
    numeroCefir?: string;
    municipio: string;
    cep: string;
    localizacaoDescritiva: string;
    bioma: BiomaBahia;
    bacia: BaciaHidrograficaBahia;
    ur: UnidadeRegionalBahia;
    justificativaAjusteLoc?: string;
  };
  responsavelTecnico?: {
    nome: string;
    formacao: string;
    conselhoClasse: string;
    numeroRegistro: string;
    artNumero: string;
    artValidade: string;
  };
  delimitacao?: PoligonoDelimitacaoAsas;
  documentos: {
    cefir?: string;
    autorizacaoProprietario?: string;
    croqui?: string;
    art?: string;
    art_val?: string;
    planoTrabalho?: string;
    plantasRecintos?: string;
    propostaMarcacao?: string;
    certidaoIbama?: string;
    certidaoAscai?: string;
    termoCompromissoAssinado?: string;
    [key: string]: string | undefined;
  };
  situacao: SituacaoAsas;
  motivoSuspensao?: string;
  dataCadastro: string;
  dataProtocolo?: string;
  dataUltimaVistoria?: string;
  dataEmissaoCertificado?: string;
  dataValidadeCertificado?: string; // 2 anos após emissão
  vistoria?: VistoriaAsas;
  solturas: SolturaHistoricaAsas[];
  relatoriosTrimestrais: RelatorioTrimestralAsas[];
  historico: EventoHistoricoAsas[];
  complementacaoPendente?: string;
  recintos: RecintoAsas[];
}

/* ========================================================================= */
/* DR010 — Mapa de ASAS e Destinações                                        */
/* ========================================================================= */

export interface FiltrosMapaAsas {
  situacoes: SituacaoAsas[];
  categorias: CategoriaAsas[];
  municipio: string;
  ur: string;
  grupo: string;
  especie: string;
  dataInicio: string;
  dataFim: string;
  ano: string;
  termoBusca: string;
}

export interface CamadasMapaAsas {
  cefir: boolean; // Padrão: ligada ao abrir (RN-004)
  vegetacao: boolean;
  hidrografia: boolean;
  uc: boolean;
  areasPotenciais: boolean;
  municipios: boolean;
  biomas: boolean;
  bacias: boolean;
  urs: boolean;
  base: 'ruas' | 'satelite';
}

/* ========================================================================= */
/* DR012 — Guardião de Animais Silvestres / Termo de Guarda (TGAS)           */
/* ========================================================================= */

export type SituacaoGuardiao =
  | 'Em cadastro'
  | 'Em análise'
  | 'Em complementação'
  | 'Em adequação'
  | 'Habilitado'
  | 'Indeferido'
  | 'Cancelado';

export type SituacaoTgas =
  | 'Aguardando assinatura'
  | 'Vigente'
  | 'Substituído'
  | 'Encerrado';

export type SituacaoAnimalSobGuarda =
  | 'Sob guarda'
  | 'Óbito'
  | 'Fuga ou furto'
  | 'Recolhido'
  | 'Excluído';

export interface RecintoGuardiao {
  endereco: string;
  municipio: string;
  coordenadas: CoordenadaSIRGAS2000;
  tipoRecinto: string;
  comprimentoM: number;
  larguraM: number;
  alturaM: number;
  areaM2: number;
  materiais: string;
  enriquecimento: string;
  segurancaContraFuga: string;
}

export interface AnimalIndicadoGuardiao {
  animalId: string;
  numeroDigital: string;
  nomeComum: string;
  nomeCientifico: string;
  grupo: string;
  sexo: string;
  tipoMarcacao: string;
  codigoMarcacao: string;
  situacaoAnimal: SituacaoAnimalSobGuarda;
  anamnese?: string;
  exameFisicoSistemas?: string;
  avaliacaoComportamental?: string;
  justificativaImpossibilidadeSoltura?: string;
  fotoUrl?: string;
  laudoTecnicoId?: string;
  tsdNumero?: string;
  dataVinculo?: string;
}

export interface LaudoTecnicoCetasLote {
  id: string;
  numero: string; // Ex: LAUDO-CETAS-2026/042
  dataEmissao: string;
  veterinarioNome: string;
  veterinarioCrmv: string;
  animaisLote: AnimalIndicadoGuardiao[];
  assinado: boolean;
  dataAssinatura?: string;
}

export interface TgasDocumento {
  id: string;
  numero: string; // Ex: TGAS-2026/0014
  guardiaoId: string;
  laudoTecnicoId: string;
  dataEmissao: string;
  dataValidade: string; // 1 ano com prorrogação automática se relatórios regulares
  situacao: SituacaoTgas;
  animaisSobGuarda: AnimalIndicadoGuardiao[];
  assinaturaGuardiao: {
    concluida: boolean;
    data?: string;
    tipo: 'gov.br' | 'Física digitalizada';
  };
  assinaturaDiretorGeral: {
    concluida: boolean;
    data?: string;
    processoSei: string;
  };
  dataEntregaAnimais?: string;
  prorrogacaoBloqueadaPorAtraso?: boolean;
  termoAnteriorSubstituido?: string;
}

export interface RelatorioSemestralGuardiao {
  id: string;
  dataEnvio: string;
  periodoSemestral: string; // Ex: "1º Semestre 2026"
  veterinarioNome: string;
  veterinarioCrmv: string;
  status: 'Regular' | 'Em atraso' | 'Notificado';
  animaisInspecionados: {
    animalId: string;
    marcacaoFisicaConferida: boolean;
    condicaoSanitaria: string;
    fotoAnimalUrl: string;
  }[];
  fotoRecintoUrl: string;
  observacoesManejo: string;
}

export interface OcorrenciaGuardiao {
  id: string;
  dataRegistro: string;
  dataOcorrencia: string;
  tipo:
    | 'Óbito'
    | 'Fuga / Furto'
    | 'Nascimento'
    | 'Transporte Veterinário'
    | 'Outro Transporte'
    | 'Substituição de Marcação';
  animalId?: string;
  animalNome?: string;
  descricao: string;
  prazoComunicacaoHoras: number; // 48h para óbito e fuga
  dentroDoPrazo: boolean;
  boletimOcorrenciaNumero?: string; // Obrigatório para furto/fuga em 5 dias
  laudoNecropsiaNome?: string; // 30 dias úteis para óbito
  recolhimentoMarcador?: boolean;
  status: 'Pendente' | 'Concluída';
}

export type HipoteseEncerramentoTgas =
  | 'I - Morte do responsável'
  | 'II - Impedimento'
  | 'III - Desistência'
  | 'IV - Extinção de pessoa jurídica'
  | 'V - Infração ambiental ou crime contra a fauna'
  | 'VI - Descumprimento das condicionantes'
  | 'VII - Maus-tratos ou condições insalubres'
  | 'VIII - Necessidade do animal para projeto de conservação';

export interface EncerramentoTgasRegistro {
  id: string;
  dataEncerramento: string;
  dataDoFato: string;
  dataDaComunicacao: string;
  dataLimiteRealocacao?: string; // 120 dias calculados a partir da comunicação (hipóteses I a IV)
  hipotese: HipoteseEncerramentoTgas;
  justificativaDetalhada: string;
  prazoRealocacaoDias: number; // 120 dias para I-IV; 0 (imediato) para V-VII
  recolhimentoImediato: boolean;
  apreensaoCautelar?: boolean; // RN-027
  animaisRetornados: {
    animalId: string;
    numeroDigital: string;
    cetasDestino: string;
    termoRecebimentoTrGerado: string;
    dataReadmissaoCetas: string;
  }[];
  concluido: boolean;
}

export interface GuardiaoItem {
  id: string;
  numeroCadastro: string; // Ex: GUARD-2026/001
  canalEntrada: 'Portal Externo' | 'Técnico de Fauna';
  requerente: {
    tipoPessoa: 'PF' | 'PJ';
    nomeOuRazaoSocial: string;
    cpfCnpj: string;
    rgOuIe: string;
    orgaoExpedidor?: string;
    ufRg?: string;
    sexo?: 'M' | 'F' | 'Outro';
    estadoCivil?: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)' | 'União Estável';
    filiacaoMae?: string;
    filiacaoPai?: string;
    email: string;
    telefone: string;
    enderecoResidencial: string;
    municipio: string;
    cep: string;
    representanteLegal?: string;
    representanteCpf?: string;
  };
  recinto: RecintoGuardiao;
  especiePretendida?: string;
  possuiAnimalPrevio: boolean;
  documentos: {
    documentoFotoIdentidade?: string;
    comprovanteResidenciaAtualizado?: string; // <= 60 dias
    certidaoAntecedentesCriminais?: string;
    certidaoNegativaIbama?: string;
    certidaoNegativaInemaAscai?: string;
    declaracaoAusenciaCondenacao5Anos?: string;
    declaracaoNaoCriadouroSispass?: string;
    requerimentoAssinado?: string;
    [key: string]: string | undefined;
  };
  declaracoesAceitas: boolean;
  situacao: SituacaoGuardiao;
  complementacaoSolicitada?: string;
  vistoria?: {
    data: string;
    equipe: string[];
    resultado: 'Favorável' | 'Em adequação' | 'Desfavorável';
    parecer: string;
    prazoAdequacaoDias?: number;
    fotos: string[];
  };
  dataCadastro: string;
  tgasVigente?: TgasDocumento;
  historicoTgas: TgasDocumento[];
  laudosCetas: LaudoTecnicoCetasLote[];
  relatoriosSemestrais: RelatorioSemestralGuardiao[];
  ocorrencias: OcorrenciaGuardiao[];
  encerramento?: EncerramentoTgasRegistro;
}
