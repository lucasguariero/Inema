/**
 * INEMA / SEIA - Módulo de Gestão de Fauna Silvestre - Release 2
 * Especificação: DR008 v1.2 (21/10/2026)
 * Tipos e Modelos para Admissão Animal, Termo de Recebimento (TR), Triagem,
 * Avaliação Clínica, Evolução, Óbito, Destinação/Soltura e Integração SISCETAS.
 */

import { MarcacaoFisicaItem } from '@/data/faunaMock';

export type FatoGeradorTR =
  | 'Entrega voluntária'
  | 'Apreensão'
  | 'Resgate'
  | 'Transferência'
  | 'Transferência interestadual';

export type InstituicaoResponsavelTR = 'INEMA' | 'Outras';

export type DocumentoApreensaoTipo =
  | 'Auto de Infração'
  | 'Boletim de Ocorrência'
  | 'Termo de Apreensão/Depósito';

export type CondicaoAnimalTR = 'Saudável' | 'Mutilado/Ferido' | 'Doente' | 'Óbito';
export type OrigemAnimalTR = 'Vida livre' | 'Cativeiro';
export type SexoSimples = 'Macho' | 'Fêmea' | 'Indeterminado';

export type FaixaEtariaOficial =
  | 'Indeterminado'
  | 'Neonato'
  | 'Filhote'
  | 'Jovem'
  | 'Adulto'
  | 'Idoso';

export type EncaminhamentoTriagem =
  | 'Quarentena'
  | 'Soltura imediata'
  | 'Isolamento'
  | 'Internamento'
  | 'Óbito';

export type AtitudeClinica = 'Ativo' | 'Hipoativo' | 'Prostrado';
export type TemperamentoClinico = 'Manso' | 'Agressivo' | 'Em alerta';
export type EstadoNutricionalClinico = 'Caquético' | 'Magro' | 'Normal' | 'Sobrepeso' | 'Obeso';
export type HidratacaoClinica = 'Hidratado' | 'Desidratado';

export const EXAMES_COMPLEMENTARES_LISTA = [
  'Hemograma',
  'Bioquímica Sérica',
  'Biópsia',
  'Microbiológico',
  'Parasitológico',
  'Molecular',
  'Imagem',
  'Outros',
] as const;

export type ExameComplementarTipo = typeof EXAMES_COMPLEMENTARES_LISTA[number];

export type DesfechoClinicoTipo = 'Alta Médica' | 'Óbito' | 'Destinação';
export type DestinoFinalTipo = 'Soltura' | 'Recinto' | 'Transferência' | 'Guardião';

export type DestinacaoCarcacaTipo =
  | 'Universidades'
  | 'Laboratórios'
  | 'Centros de Pesquisa'
  | 'Museus'
  | 'Empresas de Limpeza'
  | 'Descarte'
  | 'Outros';

export interface LinhaPreCadastroTR {
  id: string;
  especieId: string;
  especieNomeCientifico: string;
  especieNomePopular: string;
  generoOuFamilia?: string; // Permitido quando espécie não puder ser identificada (ex filhotes)
  quantidadeMacho: number;
  quantidadeFemea: number;
  quantidadeIndeterminado: number;
  quantidadeTotal: number;
  condicaoAnimal?: CondicaoAnimalTR;
  tipoNumeroMarcacao?: string;
  origemAnimal?: OrigemAnimalTR;
  localOrigemPontoOuCoordenadas?: string;
  saldoPendenteTriagem: number; // Baixado à medida que é individualizado na triagem
}

export interface HistoricoAlteracaoTR {
  id: string;
  dataHora: string;
  usuario: string;
  campo: string;
  valorAnterior: string;
  valorNovo: string;
  justificativa: string;
}

export interface MovimentacaoRegionalTR {
  unidadeOrigemId: string;
  unidadeOrigemNome: string;
  unidadeDestinoId: string;
  unidadeDestinoNome: string;
  dataHora: string;
  responsavel: string;
  motivo: string;
}

export interface TermoRecebimentoItem {
  id: string;
  numeroTr: string; // Formato [SIGLA]-000.000 (ex: CTS-000.032)
  unidadeId: string;
  unidadeNome: string;
  unidadeSigla: string;
  tipoUnidade: 'CETAS' | 'UR';
  dataRecebimento: string; // dd/mm/aaaa
  horaRecebimento: string; // hh:mm
  lote: boolean; // Sim / Não
  quantidadeTotal: number;
  fatoGerador: FatoGeradorTR;
  instituicaoResponsavel: InstituicaoResponsavelTR;
  instituicaoEspecificar?: string;
  orgaoOrigem?: string;

  // Apreensão (RN-005)
  documentoApreensaoTipo?: DocumentoApreensaoTipo;
  documentoApreensaoNumero?: string;
  dataLavratura?: string;
  comprovanteAnexado: boolean;
  comprovanteArquivoNome?: string;
  comprovantePendente: boolean; // Alerta MSG003

  // Agente / Instituição responsável pela destinação
  agenteNomeRazaoSocial: string;
  agenteRgMatricula?: string;
  agenteCpfCnpj: string;
  agenteLogradouro?: string;
  agenteMunicipio: string;
  agenteUf: string;
  agenteCep?: string;

  // Entregador (opcional)
  entregadorNome?: string;
  entregadorDocumento?: string;

  // Recebedor (usuário logado)
  recebedorNome: string;
  recebedorMatricula: string;

  // Local de Origem
  localOrigemLogradouro?: string;
  localOrigemMunicipio: string;
  localOrigemUf: string;
  localOrigemCep?: string;

  // Animais (Pré-cadastro)
  animais: LinhaPreCadastroTR[];

  observacoes?: string;

  // Status operacional do TR
  situacaoTr: 'Gerado' | 'Triagem em Andamento' | 'Triagem Concluída' | 'Encaminhado ao CETAS' | 'Solto na Regional';
  historicoAlteracoes?: HistoricoAlteracaoTR[];
  movimentacaoRegional?: MovimentacaoRegionalTR;
  movimentacoes?: MovimentacaoRegionalTR[];

  // SISCETAS demonstrativo
  siscetasStatus:
    | 'Pendente'
    | 'Enviado'
    | 'Fila Reprocessamento'
    | 'Pendente (Demonstrativo)'
    | 'Fila Local Demonstrativa (PPV-19)'
    | 'Simulado Localmente';
  siscetasLog?: {
    id: string;
    dataHora: string;
    evento: string;
    status: 'Sucesso' | 'Falha' | 'Fila Offline';
    mensagem: string;
  }[];
}

export interface RegistroTriagemItem {
  id: string;
  trId: string;
  trNumero: string;
  linhaTrId: string;
  animalId: string; // Identificador do animal na base única DR001
  numeroDigital: string; // 000.000/AAAA (estadual único anual)
  sufixoCl: boolean; // 000.000/AAAA-CL se internado
  especieId: string;
  especieNomeCientifico: string;
  especieNomePopular: string;
  justificativaDivergenciaEspecie?: string;
  justificativaExcessoSaldo?: string;
  sexo: SexoSimples;
  faixaEtaria: FaixaEtariaOficial;
  marcacoes: MarcacaoFisicaItem[];
  identificacaoComplementar?: string; // Sem apelido, apenas referência interna
  procedencia: string;
  localOrigem: string;
  condicaoTriagem: CondicaoAnimalTR;
  apresentaSinalClinico: boolean;
  encaminhamento: EncaminhamentoTriagem;
  responsavelTriagem: string;
  dataHoraTriagem: string;
  observacoes?: string;
}

export interface LaudoExameAnexo {
  id: string;
  exameTipo: string;
  arquivoNome: string;
  tamanhoKb: number;
  dataUpload: string;
}

export interface AvaliacaoClinicaItem {
  id: string;
  animalId: string;
  trNumero: string;
  numeroDigital: string;
  dataEntradaClinica: string;
  veterinarioResponsavel: string;
  crmv: string;
  atitude: AtitudeClinica;
  temperamento: TemperamentoClinico;
  estadoNutricional: EstadoNutricionalClinico;
  hidratacao: HidratacaoClinica;
  grauDesidratacao?: string;
  anamneseHistorico?: string;
  exameFisico: string; // Campo único aberto
  examesComplementares: ExameComplementarTipo[];
  examesOutrosDescricao?: string; // Obrigatório se 'Outros' selecionado
  laudos: LaudoExameAnexo[];
  diagnosticoSuspeito?: string;
  diagnosticoDefinitivo?: string;
  condutaClinica?: string;
  restricoes?: string;
  observacoes?: string;
}

export interface EvolucaoClinicaItem {
  id: string;
  animalId: string;
  dataHora: string;
  veterinario: string;
  pesoKg?: number;
  tratamento: string;
  conduta: string;
  evolucao: string;
  observacoes?: string;
}

export interface DesfechoClinicoItem {
  id: string;
  animalId: string;
  desfecho: DesfechoClinicoTipo;
  tipoDestino?: DestinoFinalTipo;
  destinoTransferencia?: string;
  dataDesfecho: string;
  responsavel: string;
  justificativa?: string;
}

export interface RegistroObitoItem {
  id: string;
  animalId?: string;
  trId: string;
  trNumero: string;
  numeroCadaver: string; // Formato [Nº TR]-OB01
  numeroDigital?: string;
  dataObito: string;
  momentoObito: 'Na chegada' | 'Durante a triagem' | 'Durante o tratamento';
  diagnosticoPosMorte?: string;
  laudoNecroscopicoNome?: string;
  destinacaoCarcaca: DestinacaoCarcacaTipo;
  instituicaoDestinataria?: string; // Obrigatória exceto se Descarte
  destinacaoOutrosDescricao?: string; // Obrigatória se Outros
  dataEntregaCarcaca?: string;
  observacoes?: string;
}

export interface TermoSolturaDestinacaoItem {
  id: string;
  numeroTermo: string; // Ex: TSD-2026-0001
  animalId: string;
  trNumero: string;
  numeroDigital: string;
  marcacao: string;
  dataSaida: string;
  localSaida: string;
  responsavelSaida: string;
  condicaoAnimalSaida: string;
  destinacaoFinal: DestinoFinalTipo;
  modalidadeTransferencia?: 'Interna' | 'Externa';
  instituicaoDestino?: string;
  unidadeDestinoInemaNome?: string;
  statusFinal: 'Soltura' | 'Destinação' | 'Transferido';
  observacoes?: string;
}
