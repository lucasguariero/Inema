/**
 * Tipos e Contratos do Módulo de Assinatura Eletrônica SEIA V2
 * 
 * Classificação de Regras:
 * [CAT-A] Solicitação expressa (Thays/Matheus)
 * [CAT-B] Proposta do artifact Claude ACTO v0.2
 * [CAT-C] Decisão técnica de prototipação demonstrativa
 */

export type RequirementClassification = 'A' | 'B' | 'C';

export type ProcessFlow =
  | 'regulacao_ansla'
  | 'regulacao_licenciamento'
  | 'fiscalizacao_rfa'
  | 'fiscalizacao_rae'
  | 'biodiversidade_uc'
  | 'recursos_hidricos_cerh';

export type SignerRole =
  | 'analista'
  | 'coordenador'
  | 'diretor'
  | 'terceirizado'
  | 'requerente';

export type SignerStatus =
  | 'pendente'
  | 'assinado'
  | 'recusado'
  | 'bloqueado_ordem'
  | 'cancelado';

export type OrderType = 'sequencial' | 'indiferente';

export type RequirementType = 'obrigatoria' | 'opcional' | 'nao_exigida';

export interface Signer {
  id: string;
  nome: string;
  cargo: string;
  matricula: string;
  tipoVinculo: 'servidor_efetivo' | 'cargo_comissao' | 'terceirizado';
  papel: SignerRole;
  status: SignerStatus;
  ordem: number; // 1, 2, 3...
  dataAssinatura?: string;
  horaAssinatura?: string;
  ipHash?: string;
  justificativaRecusa?: string;
  ehSuplente?: boolean;
  suplenteDe?: string;
}

export interface SignatureHistoryEvent {
  id: string;
  dataHora: string;
  autorNome: string;
  autorCargo: string;
  tipo:
    | 'criacao'
    | 'disponibilizacao'
    | 'assinatura'
    | 'recusa'
    | 'cancelamento'
    | 'adicao_signatario'
    | 'substituicao_suplente';
  descricao: string;
  mensagemCodigo?: string; // ex: MSG001, MSG004, MSG005, MSG007, MSG021
  detalhe?: string;
}

export interface SignatureStepConfig {
  id: string;
  fluxoId: ProcessFlow;
  fluxoNome: string;
  etapaId: string;
  etapaNome: string;
  tipoDocumentoCodigo: string;
  tipoDocumentoNome: string;
  exigenciaAssinatura: RequirementType;
  papelAutorizado: SignerRole;
  papelNome: string;
  responsavelTitularNome: string;
  responsavelTitularMatricula: string;
  responsavelSuplenteNome?: string;
  responsavelSuplenteMatricula?: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  suplenteAtivo: boolean;
  tipoOrdemPadrao: OrderType;
  quantidadeSignatariosPadrao: number;
  podeAdicionarSignatarioAvulso: boolean;
  descricaoRegra: string;
}

export interface SignableDocument {
  id: string;
  numeroProcesso: string;
  tipoDocumento: string;
  codigoDocumento: string;
  titulo: string;
  fluxo: ProcessFlow;
  fluxoNome: string;
  etapaAtual: string;
  requerente: string;
  municipio: string;
  dataCriacao: string;
  prazoLimite: string;
  urgente: boolean;
  statusGeral: 'pendente' | 'em_assinatura' | 'concluido' | 'recusado' | 'cancelado';
  ordemTipo: OrderType;
  signatarios: Signer[];
  historico: SignatureHistoryEvent[];
  codigoVerificador: string;
  hashSha256: string;
  conteudoResumido: string;
  parecerMinuta?: {
    sintese: string;
    fundamentacao: string;
    conclusao: 'deferido' | 'indeferido' | 'pendente_diligencia';
    observacoes?: string;
  };
}

export interface SimulatedUser {
  id: string;
  nome: string;
  cargo: string;
  matricula: string;
  papel: SignerRole;
  tipoVinculo: 'servidor_efetivo' | 'cargo_comissao' | 'terceirizado';
  area: string;
  ehSuplente?: boolean;
}
