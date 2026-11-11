/**
 * Dados Mock e Estado Reativo da Assinatura Eletrônica SEIA V2
 * 
 * Classificações de Regras:
 * [CAT-A] Solicitação expressa (Thays/Matheus)
 * [CAT-B] Proposta do artifact Claude ACTO v0.2
 * [CAT-C] Decisão técnica de prototipação demonstrativa
 */

import {
  SignableDocument,
  SignatureStepConfig,
  SimulatedUser,
} from '@/types/signature';

// =========================================================================
// USUÁRIOS SIMULADOS PARA TESTE E DEMONSTRAÇÃO
// =========================================================================
export const SIMULATED_USERS: SimulatedUser[] = [
  {
    id: 'carlos-analista',
    nome: 'Carlos Eduardo Lima',
    cargo: 'Analista em Meio Ambiente e Recursos Hídricos',
    matricula: '29.841.092',
    papel: 'analista',
    tipoVinculo: 'servidor_efetivo',
    area: 'DIPRE / Regulação Ambiental',
    ehSuplente: false,
  },
  {
    id: 'mariana-suplente',
    nome: 'Mariana Costa Ribeiro',
    cargo: 'Especialista em Regulação Ambiental (Suplente Designada)',
    matricula: '31.402.118',
    papel: 'analista',
    tipoVinculo: 'servidor_efetivo',
    area: 'DIPRE / Regulação Ambiental',
    ehSuplente: true,
  },
  {
    id: 'joao-terceirizado',
    nome: 'João Paulo Silva',
    cargo: 'Assistente Técnico de Apoio Operacional (Contrato 41/2024)',
    matricula: 'TER-9941',
    papel: 'terceirizado',
    tipoVinculo: 'terceirizado',
    area: 'DIPRE / Apoio Administrativo',
    ehSuplente: false,
  },
  {
    id: 'maria-coordenadora',
    nome: 'Dra. Maria Santos Guimarães',
    cargo: 'Coordenadora de Atos Regulatórios e Enquadramento',
    matricula: '18.239.004',
    papel: 'coordenador',
    tipoVinculo: 'cargo_comissao',
    area: 'DIPRE / Coordenação Geral',
    ehSuplente: false,
  },
  {
    id: 'herikles-diretor',
    nome: 'Dr. Hérikles Vasconcelos',
    cargo: 'Diretor de Regulação e Controle Ambiental',
    matricula: '11.094.221',
    papel: 'diretor',
    tipoVinculo: 'cargo_comissao',
    area: 'DIRRE / Diretoria Colegiada',
    ehSuplente: false,
  },
];

// =========================================================================
// PARAMETRIZAÇÃO COMPLETA POR ETAPA, DOCUMENTO E SIGNATÁRIO (SEÇÃO 3)
// =========================================================================
export const INITIAL_STEP_CONFIGS: SignatureStepConfig[] = [
  {
    id: 'CONF-ANSLA-01',
    fluxoId: 'regulacao_ansla',
    fluxoNome: 'Regulação / ANSLA (Dispensa)',
    etapaId: 'etapa-analise-parecer',
    etapaNome: 'Instrução e Parecer Técnico de Dispensa',
    tipoDocumentoCodigo: 'PAR-ANSLA-01',
    tipoDocumentoNome: 'Parecer Técnico Conclusivo de Inexigibilidade',
    exigenciaAssinatura: 'obrigatoria',
    papelAutorizado: 'analista',
    papelNome: 'Analista Ambiental / Técnico Titular',
    responsavelTitularNome: 'Carlos Eduardo Lima',
    responsavelTitularMatricula: '29.841.092',
    responsavelSuplenteNome: 'Mariana Costa Ribeiro',
    responsavelSuplenteMatricula: '31.402.118',
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '2026-12-31',
    suplenteAtivo: true,
    tipoOrdemPadrao: 'sequencial',
    quantidadeSignatariosPadrao: 2,
    podeAdicionarSignatarioAvulso: true,
    descricaoRegra: 'Assinatura sequencial obrigatória: primeiro o Analista Relator e subsequentemente o Coordenador da DIPRE.',
  },
  {
    id: 'CONF-ANSLA-02',
    fluxoId: 'regulacao_ansla',
    fluxoNome: 'Regulação / ANSLA (Dispensa)',
    etapaId: 'etapa-emissao-certidao',
    etapaNome: 'Emissão e Homologação de Certidão',
    tipoDocumentoCodigo: 'CERT-ANSLA-02',
    tipoDocumentoNome: 'Certidão Oficial de Dispensa de Licença Ambiental',
    exigenciaAssinatura: 'obrigatoria',
    papelAutorizado: 'coordenador',
    papelNome: 'Coordenador de Regulação / Diretoria',
    responsavelTitularNome: 'Dra. Maria Santos Guimarães',
    responsavelTitularMatricula: '18.239.004',
    responsavelSuplenteNome: 'Dr. Hérikles Vasconcelos',
    responsavelSuplenteMatricula: '11.094.221',
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '2026-12-31',
    suplenteAtivo: false,
    tipoOrdemPadrao: 'indiferente',
    quantidadeSignatariosPadrao: 1,
    podeAdicionarSignatarioAvulso: false,
    descricaoRegra: 'Ato administrativo final. Assinatura monocrática do Coordenador ou do Diretor da Regulação.',
  },
  {
    id: 'CONF-FISC-01',
    fluxoId: 'fiscalizacao_rfa',
    fluxoNome: 'Fiscalização Ambiental / DIFIS',
    etapaId: 'etapa-conclusao-rfa',
    etapaNome: 'Conclusão de Relatório de Fiscalização',
    tipoDocumentoCodigo: 'DOR008-RFA-01',
    tipoDocumentoNome: 'Relatório de Fiscalização Ambiental (RFA)',
    exigenciaAssinatura: 'obrigatoria',
    papelAutorizado: 'analista',
    papelNome: 'Equipe de Fiscalização Autuada',
    responsavelTitularNome: 'Carlos Eduardo Lima',
    responsavelTitularMatricula: '29.841.092',
    responsavelSuplenteNome: 'Mariana Costa Ribeiro',
    responsavelSuplenteMatricula: '31.402.118',
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '2026-12-31',
    suplenteAtivo: true,
    tipoOrdemPadrao: 'indiferente',
    quantidadeSignatariosPadrao: 2,
    podeAdicionarSignatarioAvulso: true,
    descricaoRegra: 'Assinatura conjunta indiferente: todos os agentes autuantes que participaram da fiscalização de campo.',
  },
  {
    id: 'CONF-CERH-01',
    fluxoId: 'recursos_hidricos_cerh',
    fluxoNome: 'Recursos Hídricos / CERH',
    etapaId: 'etapa-parecer-outorga',
    etapaNome: 'Instrução do Parecer Técnico de Outorga',
    tipoDocumentoCodigo: 'PAR-CERH-OUT-01',
    tipoDocumentoNome: 'Parecer Técnico de Disponibilidade Hídrica e Vazão',
    exigenciaAssinatura: 'obrigatoria',
    papelAutorizado: 'analista',
    papelNome: 'Especialista em Recursos Hídricos',
    responsavelTitularNome: 'Carlos Eduardo Lima',
    responsavelTitularMatricula: '29.841.092',
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '2026-12-31',
    suplenteAtivo: false,
    tipoOrdemPadrao: 'sequencial',
    quantidadeSignatariosPadrao: 2,
    podeAdicionarSignatarioAvulso: false,
    descricaoRegra: 'Assinatura sequencial: parecer técnico do hidrólogo seguido de homologação pela coordenação de outorga.',
  },
  {
    id: 'CONF-UC-01',
    fluxoId: 'biodiversidade_uc',
    fluxoNome: 'Biodiversidade & UCs / DISUC',
    etapaId: 'etapa-termo-anuencia',
    etapaNome: 'Anuência de Atividade em Unidade de Conservação',
    tipoDocumentoCodigo: 'ANU-DISUC-01',
    tipoDocumentoNome: 'Termo de Anuência Prévia do Gestor da UC',
    exigenciaAssinatura: 'obrigatoria',
    papelAutorizado: 'coordenador',
    papelNome: 'Gestor da Unidade de Conservação',
    responsavelTitularNome: 'Dra. Maria Santos Guimarães',
    responsavelTitularMatricula: '18.239.004',
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '2026-12-31',
    suplenteAtivo: false,
    tipoOrdemPadrao: 'indiferente',
    quantidadeSignatariosPadrao: 1,
    podeAdicionarSignatarioAvulso: true,
    descricaoRegra: 'Assinatura institucional exclusiva de gestores de UCs cadastrados no CEUC.',
  },
];

// =========================================================================
// DOCUMENTOS SIGNÁVEIS INICIAIS COM CASOS DE CONTRASTE
// =========================================================================
export const INITIAL_DOCUMENTS: SignableDocument[] = [
  {
    id: 'DOC-ANSLA-001',
    numeroProcesso: '2026-004128/TEC/ANSLA',
    tipoDocumento: 'Parecer Técnico Conclusivo de Inexigibilidade',
    codigoDocumento: 'PAR-ANSLA-01',
    titulo: 'Parecer Conclusivo — Silos e Armazéns de Grãos até 10.000 t',
    fluxo: 'regulacao_ansla',
    fluxoNome: 'Regulação / ANSLA',
    etapaAtual: 'Validação da Coordenação (Signatário 2)',
    requerente: 'Cooperativa Agrícola do Oeste Baiano Ltda.',
    municipio: 'Luís Eduardo Magalhães / BA',
    dataCriacao: '28/10/2026 14:20',
    prazoLimite: '02/11/2026',
    urgente: true,
    statusGeral: 'em_assinatura',
    ordemTipo: 'sequencial',
    codigoVerificador: '4KZ9-7YTR-2M1B',
    hashSha256: '9f83a42c679a831e50f3b0e12d4a9918b95c02d131f479a8120ec0b82f129a07',
    conteudoResumido: 'Trata-se de enquadramento técnico para instalação de unidade de armazenamento de grãos secos. Vistoria virtual e documentação conferida.',
    parecerMinuta: {
      sintese: 'Instalação de armazém de grãos com capacidade estática de 9.500 toneladas em zona rural consolidada sem supressão de vegetação.',
      fundamentacao: 'Atividade prevista no Art. 4º, Inciso II da Resolução CEPRAM nº 4.579/2018 como inexigível de licenciamento ordinário.',
      conclusao: 'deferido',
      observacoes: 'Deverão ser observadas as normas de segurança contra incêndio e pânico do Corpo de Bombeiros Militar da Bahia.',
    },
    signatarios: [
      {
        id: 'sig-001',
        nome: 'Carlos Eduardo Lima',
        cargo: 'Analista em Meio Ambiente e Recursos Hídricos',
        matricula: '29.841.092',
        tipoVinculo: 'servidor_efetivo',
        papel: 'analista',
        status: 'assinado',
        ordem: 1,
        dataAssinatura: '28/10/2026',
        horaAssinatura: '16:45',
        ipHash: '177.20.14.88 (Proxy INEMA)',
      },
      {
        id: 'sig-002',
        nome: 'Dra. Maria Santos Guimarães',
        cargo: 'Coordenadora de Atos Regulatórios e Enquadramento',
        matricula: '18.239.004',
        tipoVinculo: 'cargo_comissao',
        papel: 'coordenador',
        status: 'pendente',
        ordem: 2,
      },
    ],
    historico: [
      {
        id: 'h-01',
        dataHora: '28/10/2026 14:20',
        autorNome: 'Carlos Eduardo Lima',
        autorCargo: 'Analista Técnico',
        tipo: 'criacao',
        descricao: 'Minuta do parecer técnico elaborada e submetida para colheita de assinaturas.',
        mensagemCodigo: 'MSG001',
      },
      {
        id: 'h-02',
        dataHora: '28/10/2026 16:45',
        autorNome: 'Carlos Eduardo Lima',
        autorCargo: 'Analista Técnico (Ordem 1)',
        tipo: 'assinatura',
        descricao: 'Documento assinado eletronicamente pelo relator titular.',
        mensagemCodigo: 'MSG002',
      },
      {
        id: 'h-03',
        dataHora: '28/10/2026 16:46',
        autorNome: 'Sistema SEIA V2',
        autorCargo: 'Notificador Automático',
        tipo: 'disponibilizacao',
        descricao: 'Notificação encaminhada à Coordenadora Dra. Maria Santos para assinatura do segundo nível da ordem sequencial.',
        mensagemCodigo: 'MSG003',
      },
    ],
  },
  {
    id: 'DOC-ANSLA-002',
    numeroProcesso: '2026-003891/TEC/ANSLA',
    tipoDocumento: 'Certidão Oficial de Dispensa de Licença Ambiental',
    codigoDocumento: 'CERT-ANSLA-02',
    titulo: 'Certidão de Inexigibilidade — Usina Solar em Coberturas de Edificações',
    fluxo: 'regulacao_ansla',
    fluxoNome: 'Regulação / ANSLA',
    etapaAtual: 'Minuta Inicial (Aguardando Assinatura do Relator)',
    requerente: 'Solaris Energia Sustentável da Bahia S.A.',
    municipio: 'Feira de Santana / BA',
    dataCriacao: '29/10/2026 09:15',
    prazoLimite: '05/11/2026',
    urgente: false,
    statusGeral: 'pendente',
    ordemTipo: 'sequencial',
    codigoVerificador: '8H2P-3W9Q-1L7V',
    hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    conteudoResumido: 'Geração fotovoltaica distribuída instalada sobre telhados industriais sem alteração de uso do solo.',
    parecerMinuta: {
      sintese: 'Instalação de 1.200 módulos fotovoltaicos em galpões logísticos pré-existentes, potência de 650 kWp.',
      fundamentacao: 'Portaria INEMA nº 112/2020 c/c Decreto Estadual nº 14.024/2012.',
      conclusao: 'deferido',
    },
    signatarios: [
      {
        id: 'sig-003',
        nome: 'Carlos Eduardo Lima',
        cargo: 'Analista em Meio Ambiente e Recursos Hídricos',
        matricula: '29.841.092',
        tipoVinculo: 'servidor_efetivo',
        papel: 'analista',
        status: 'pendente',
        ordem: 1,
      },
      {
        id: 'sig-004',
        nome: 'Dra. Maria Santos Guimarães',
        cargo: 'Coordenadora de Atos Regulatórios e Enquadramento',
        matricula: '18.239.004',
        tipoVinculo: 'cargo_comissao',
        papel: 'coordenador',
        status: 'bloqueado_ordem',
        ordem: 2,
      },
    ],
    historico: [
      {
        id: 'h-04',
        dataHora: '29/10/2026 09:15',
        autorNome: 'Carlos Eduardo Lima',
        autorCargo: 'Analista Técnico',
        tipo: 'criacao',
        descricao: 'Minuta da Certidão cadastrada no fluxo regulatório.',
        mensagemCodigo: 'MSG001',
      },
    ],
  },
  {
    id: 'DOC-RFA-003',
    numeroProcesso: '2026-001982/DIFIS/RFA',
    tipoDocumento: 'Relatório de Fiscalização Ambiental (RFA)',
    codigoDocumento: 'DOR008-RFA-01',
    titulo: 'RFA — Fiscalização de Empreendimento Minerário em Área de Preservação',
    fluxo: 'fiscalizacao_rfa',
    fluxoNome: 'Fiscalização Ambiental / DIFIS',
    etapaAtual: 'Colheita Conjunta de Assinaturas (Ordem Indiferente)',
    requerente: 'Mineradora Vale do Paramirim Eireli',
    municipio: 'Paramirim / BA',
    dataCriacao: '27/10/2026 11:00',
    prazoLimite: '31/10/2026',
    urgente: true,
    statusGeral: 'em_assinatura',
    ordemTipo: 'indiferente',
    codigoVerificador: '9M4K-6R2T-8X1C',
    hashSha256: '4a5e1e5e8e7a6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c',
    conteudoResumido: 'Constatação de atividade extrativa em desacordo com as condicionantes da licença de operação.',
    parecerMinuta: {
      sintese: 'Operação de britagem fora do polígono homologado e ausência de canaletas de drenagem pluvial.',
      fundamentacao: 'Lei Estadual nº 10.431/2006, Art. 162 e Decreto Estadual nº 14.024/2012.',
      conclusao: 'pendente_diligencia',
      observacoes: 'Lavrado Auto de Infração nº 2026-00441 e Notificação nº 2026-00912.',
    },
    signatarios: [
      {
        id: 'sig-005',
        nome: 'Carlos Eduardo Lima',
        cargo: 'Analista em Meio Ambiente e Recursos Hídricos (Fiscal 1)',
        matricula: '29.841.092',
        tipoVinculo: 'servidor_efetivo',
        papel: 'analista',
        status: 'pendente',
        ordem: 1,
      },
      {
        id: 'sig-006',
        nome: 'Mariana Costa Ribeiro',
        cargo: 'Especialista em Regulação (Fiscal 2 - Co-relatora)',
        matricula: '31.402.118',
        tipoVinculo: 'servidor_efetivo',
        papel: 'analista',
        status: 'assinado',
        ordem: 1,
        dataAssinatura: '28/10/2026',
        horaAssinatura: '10:15',
        ipHash: '177.20.14.88 (Proxy INEMA)',
      },
    ],
    historico: [
      {
        id: 'h-05',
        dataHora: '27/10/2026 11:00',
        autorNome: 'Equipe DIFIS',
        autorCargo: 'Fiscais Ambientais',
        tipo: 'criacao',
        descricao: 'RFA lavrado no local e disponibilizado para assinaturas simultâneas.',
        mensagemCodigo: 'MSG001',
      },
      {
        id: 'h-06',
        dataHora: '28/10/2026 10:15',
        autorNome: 'Mariana Costa Ribeiro',
        autorCargo: 'Especialista em Regulação',
        tipo: 'assinatura',
        descricao: 'Assinatura realizada pela Fiscal 2.',
        mensagemCodigo: 'MSG002',
      },
    ],
  },
  {
    id: 'DOC-CERH-004',
    numeroProcesso: '2026-005510/CERH/OUT',
    tipoDocumento: 'Parecer Técnico de Disponibilidade Hídrica e Vazão',
    codigoDocumento: 'PAR-CERH-OUT-01',
    titulo: 'Outorga Prévia de Captação Superficial — Bacia do Rio de Contas',
    fluxo: 'recursos_hidricos_cerh',
    fluxoNome: 'Recursos Hídricos / CERH',
    etapaAtual: 'Documento Concluído e Autenticado',
    requerente: 'Agropecuária Rio de Contas S.A.',
    municipio: 'Jequié / BA',
    dataCriacao: '25/10/2026 08:30',
    prazoLimite: '30/10/2026',
    urgente: false,
    statusGeral: 'concluido',
    ordemTipo: 'sequencial',
    codigoVerificador: '7T9X-4M2K-1Q8P',
    hashSha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    conteudoResumido: 'Outorga preventiva de captação de vazão de 45 l/s para fins de irrigação de fruticultura.',
    parecerMinuta: {
      sintese: 'Balanço hídrico da sub-bacia demonstra disponibilidade para o volume requerido sem prejuízo aos usuários a jusante.',
      fundamentacao: 'Lei das Águas nº 11.612/2009 e Portaria INEMA nº 062/2021.',
      conclusao: 'deferido',
    },
    signatarios: [
      {
        id: 'sig-007',
        nome: 'Carlos Eduardo Lima',
        cargo: 'Analista em Meio Ambiente e Recursos Hídricos',
        matricula: '29.841.092',
        tipoVinculo: 'servidor_efetivo',
        papel: 'analista',
        status: 'assinado',
        ordem: 1,
        dataAssinatura: '26/10/2026',
        horaAssinatura: '11:30',
        ipHash: '177.20.14.88 (Proxy INEMA)',
      },
      {
        id: 'sig-008',
        nome: 'Dra. Maria Santos Guimarães',
        cargo: 'Coordenadora de Atos Regulatórios e Recursos Hídricos',
        matricula: '18.239.004',
        tipoVinculo: 'cargo_comissao',
        papel: 'coordenador',
        status: 'assinado',
        ordem: 2,
        dataAssinatura: '27/10/2026',
        horaAssinatura: '15:10',
        ipHash: '177.20.14.88 (Proxy INEMA)',
      },
    ],
    historico: [
      {
        id: 'h-07',
        dataHora: '25/10/2026 08:30',
        autorNome: 'Carlos Eduardo Lima',
        autorCargo: 'Analista Técnico',
        tipo: 'criacao',
        descricao: 'Parecer submetido à colheita de assinaturas.',
        mensagemCodigo: 'MSG001',
      },
      {
        id: 'h-08',
        dataHora: '26/10/2026 11:30',
        autorNome: 'Carlos Eduardo Lima',
        autorCargo: 'Analista Técnico (Ordem 1)',
        tipo: 'assinatura',
        descricao: 'Assinatura confirmada pelo titular.',
        mensagemCodigo: 'MSG002',
      },
      {
        id: 'h-09',
        dataHora: '27/10/2026 15:10',
        autorNome: 'Dra. Maria Santos Guimarães',
        autorCargo: 'Coordenadora (Ordem 2)',
        tipo: 'assinatura',
        descricao: 'Homologação e assinatura final concluídas. Selo de autenticidade emitido.',
        mensagemCodigo: 'MSG002',
      },
    ],
  },
  {
    id: 'DOC-UC-005',
    numeroProcesso: '2026-002231/DISUC/CRF',
    tipoDocumento: 'Termo de Anuência Prévia do Gestor da UC',
    codigoDocumento: 'ANU-DISUC-01',
    titulo: 'Anuência Prévia para Atividade em Zona de Amortecimento do Parque Estadual da Serra do Conduru',
    fluxo: 'biodiversidade_uc',
    fluxoNome: 'Biodiversidade & UCs / DISUC',
    etapaAtual: 'Recusa Registrada com Justificativa',
    requerente: 'Pousada Recanto dos Pássaros ME',
    municipio: 'Uruçuca / BA',
    dataCriacao: '20/10/2026 16:00',
    prazoLimite: '25/10/2026',
    urgente: false,
    statusGeral: 'recusado',
    ordemTipo: 'indiferente',
    codigoVerificador: '5J1W-8Z3P-4M7N',
    hashSha256: '8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c',
    conteudoResumido: 'Solicitação de ampliação de leitos turísticos em área contígua à UC estadual.',
    parecerMinuta: {
      sintese: 'A proposta carece de estudo de capacidade de carga e tratamento adequado de esgoto.',
      fundamentacao: 'Plano de Manejo do PESC e Lei do SNUC nº 9.985/2000.',
      conclusao: 'indeferido',
      observacoes: 'Recusada pelo Gestor da UC com exigência de complementação prévia.',
    },
    signatarios: [
      {
        id: 'sig-009',
        nome: 'Dra. Maria Santos Guimarães',
        cargo: 'Gestora da Unidade de Conservação',
        matricula: '18.239.004',
        tipoVinculo: 'cargo_comissao',
        papel: 'coordenador',
        status: 'recusado',
        ordem: 1,
        justificativaRecusa: 'Ausência do laudo acústico e do projeto sanitário exigidos no Art. 12 do Plano de Manejo da UC. Processo deve ser devolvido ao requerente para saneamento.',
      },
    ],
    historico: [
      {
        id: 'h-10',
        dataHora: '20/10/2026 16:00',
        autorNome: 'Técnico DISUC',
        autorCargo: 'Analista de UC',
        tipo: 'criacao',
        descricao: 'Minuta do Termo de Anuência encaminhada para assinatura do Gestor.',
        mensagemCodigo: 'MSG001',
      },
      {
        id: 'h-11',
        dataHora: '22/10/2026 14:40',
        autorNome: 'Dra. Maria Santos Guimarães',
        autorCargo: 'Gestora da UC',
        tipo: 'recusa',
        descricao: 'Assinatura recusada justificadamente: pendência de laudo técnico sanitário.',
        mensagemCodigo: 'MSG005',
        detalhe: 'Ausência do laudo acústico e do projeto sanitário exigidos no Art. 12 do Plano de Manejo.',
      },
    ],
  },
  {
    id: 'DOC-RAE-006',
    numeroProcesso: '2026-000843/DIFIS/RAE',
    tipoDocumento: 'Relatório de Atendimento de Emergência (RAE)',
    codigoDocumento: 'DOR009-RAE-01',
    titulo: 'RAE — Tombamento de Carga Perigosa (Ácido Sulfúrico) na BR-101',
    fluxo: 'fiscalizacao_rae',
    fluxoNome: 'Fiscalização / Emergências Químicas',
    etapaAtual: 'Solicitação Cancelada pelo Coordenador',
    requerente: 'Transportadora TransQuímica Brasil S.A.',
    municipio: 'Gandu / BA',
    dataCriacao: '15/10/2026 07:30',
    prazoLimite: '18/10/2026',
    urgente: true,
    statusGeral: 'cancelado',
    ordemTipo: 'sequencial',
    codigoVerificador: '3N8V-9C2K-5L1B',
    hashSha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    conteudoResumido: 'Contenção emergencial e transbordo de carga com neutralização de solo.',
    signatarios: [
      {
        id: 'sig-010',
        nome: 'Carlos Eduardo Lima',
        cargo: 'Analista em Meio Ambiente (Fiscal Plantonista)',
        matricula: '29.841.092',
        tipoVinculo: 'servidor_efetivo',
        papel: 'analista',
        status: 'cancelado',
        ordem: 1,
      },
    ],
    historico: [
      {
        id: 'h-12',
        dataHora: '15/10/2026 07:30',
        autorNome: 'Carlos Eduardo Lima',
        autorCargo: 'Plantonista RAE',
        tipo: 'criacao',
        descricao: 'Abertura da solicitação de assinatura para o RAE preliminar.',
        mensagemCodigo: 'MSG001',
      },
      {
        id: 'h-13',
        dataHora: '16/10/2026 09:00',
        autorNome: 'Dr. Hérikles Vasconcelos',
        autorCargo: 'Diretoria DIFIS',
        tipo: 'cancelamento',
        descricao: 'Solicitação cancelada devido à unificação com o Auto de Infração principal.',
        mensagemCodigo: 'MSG007',
        detalhe: 'Cancelamento administrativo para reabertura em procedimento único consolidado.',
      },
    ],
  },
];

// =========================================================================
// GESTÃO REATIVA DE ESTADO EM STORAGE LOCAL
// =========================================================================
const STORAGE_KEY_DOCS = 'seia_v2_signature_documents';
const STORAGE_KEY_CONFIGS = 'seia_v2_signature_step_configs';
const STORAGE_KEY_ACTIVE_USER = 'seia_v2_signature_active_user';

export function getStoredDocuments(): SignableDocument[] {
  if (typeof window === 'undefined') return INITIAL_DOCUMENTS;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_DOCS);
    if (!raw) {
      sessionStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DOCUMENTS;
  }
}

export function saveStoredDocuments(docs: SignableDocument[]): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(docs));
    window.dispatchEvent(new Event('seia-signature-updated'));
  } catch (err) {
    console.error('Falha ao salvar documentos de assinatura no storage:', err);
  }
}

export function getStoredStepConfigs(): SignatureStepConfig[] {
  if (typeof window === 'undefined') return INITIAL_STEP_CONFIGS;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_CONFIGS);
    if (!raw) {
      sessionStorage.setItem(STORAGE_KEY_CONFIGS, JSON.stringify(INITIAL_STEP_CONFIGS));
      return INITIAL_STEP_CONFIGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STEP_CONFIGS;
  }
}

export function saveStoredStepConfigs(configs: SignatureStepConfig[]): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY_CONFIGS, JSON.stringify(configs));
    window.dispatchEvent(new Event('seia-signature-configs-updated'));
  } catch (err) {
    console.error('Falha ao salvar configurações de etapa no storage:', err);
  }
}

export function getActiveSimulatedUser(): SimulatedUser {
  if (typeof window === 'undefined') return SIMULATED_USERS[0];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_ACTIVE_USER);
    if (!raw) {
      sessionStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(SIMULATED_USERS[0]));
      return SIMULATED_USERS[0];
    }
    return JSON.parse(raw);
  } catch {
    return SIMULATED_USERS[0];
  }
}

export function setActiveSimulatedUser(user: SimulatedUser): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(user));
    window.dispatchEvent(new Event('seia-signature-user-changed'));
  } catch (err) {
    console.error('Falha ao alternar usuário simulado:', err);
  }
}

export function resetSignatureState(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY_DOCS);
  sessionStorage.removeItem(STORAGE_KEY_CONFIGS);
  sessionStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
  window.dispatchEvent(new Event('seia-signature-updated'));
  window.dispatchEvent(new Event('seia-signature-configs-updated'));
  window.dispatchEvent(new Event('seia-signature-user-changed'));
}
