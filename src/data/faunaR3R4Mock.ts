/**
 * INEMA / NOVO SEIA - Gestão de Fauna Silvestre - Releases 3 & 4
 * Base de Dados Simulada (Mock) e Gerenciador de Estado Reativo
 * Módulos:
 * - DR009: Cadastro e Análise de ASAS
 * - DR010: Mapa de ASAS e Destinações
 * - DR012: Guardião de Animais Silvestres / TGAS
 */

import {
  AsasItem,
  GuardiaoItem,
  LaudoTecnicoCetasLote,
  TgasDocumento,
  SolturaHistoricaAsas
} from '@/types/faunaR3R4';

const STORAGE_KEY_ASAS = 'inema_fauna_asas_v1';
const STORAGE_KEY_GUARDIOES = 'inema_fauna_guardioes_v1';

/* ========================================================================= */
/* SEMENTES INICIAIS — DR009 / DR010 (ASAS)                                  */
/* ========================================================================= */

export const SEED_ASAS: AsasItem[] = [
  {
    id: 'asas-001',
    numero: 'ASAS-000.001',
    processoSei: '015.1102.2024.0041289-51',
    canalEntrada: 'Técnico de Fauna',
    requerente: {
      tipoPessoa: 'PJ',
      nomeOuRazaoSocial: 'Fundação Biodiversidade Paraguaçu',
      cpfCnpj: '12.345.678/0001-90',
      rgOuIe: '109.876.543',
      email: 'contato@biodiversidadeparaguacu.org.br',
      telefone: '(75) 3251-4000',
      representanteLegal: 'Dra. Carolina Mendes Peixoto',
      representanteCpf: '321.654.987-00'
    },
    categoria: 'Categoria II',
    justificativaCategoria:
      'Área equipada com recintos de aclimatação e reabilitação intermediária de psitacídeos e passeriformes.',
    propriedade: {
      nome: 'Fazenda Boa Esperança (Bacia do Paraguaçu)',
      tipoPropriedade: 'Imóvel Próprio',
      numeroCefir: 'BA-2901007-7F12.98CD.4E1A.9B5C',
      municipio: 'Andaraí',
      cep: '46830-000',
      localizacaoDescritiva: 'Rodovia BA-142, Km 34, Zona Rural',
      bioma: 'Caatinga',
      bacia: 'Rio Paraguaçu',
      ur: 'URCH'
    },
    responsavelTecnico: {
      nome: 'Dr. Lucas Sampaio Guimarães',
      formacao: 'Médico Veterinário',
      conselhoClasse: 'CRMV/BA',
      numeroRegistro: '4890',
      artNumero: 'ART-2024-998812',
      artValidade: '2027-10-15'
    },
    delimitacao: {
      tipo: 'CEFIR',
      areaHa: 1450.75,
      centro: { lat: -12.8021, lng: -41.3312, datum: 'SIRGAS 2000', xPct: 53.5, yPct: 54.0 },
      pontos: [
        [-12.78, -41.35],
        [-12.79, -41.31],
        [-12.82, -41.32],
        [-12.81, -41.36]
      ],
      valido: true,
      dataDefinicao: '2024-03-10'
    },
    documentos: {
      cefir: 'CEFIR_Fazenda_Boa_Esperanca.pdf',
      autorizacaoProprietario: 'Escritura_Publica_RGI.pdf',
      croqui: 'Croqui_Acesso_e_Areas.pdf',
      art: 'ART_Lucas_Guimaraes_2024.pdf',
      art_val: '2027-10-15',
      planoTrabalho: 'Plano_Manejo_Aclimatacao_v2.pdf',
      plantasRecintos: 'Plantas_Tecnicas_Recintos.pdf',
      propostaMarcacao: 'Manual_Marcacao_Anilhas_Microchip.pdf',
      certidaoIbama: 'Certidao_Negativa_IBAMA_Valida.pdf',
      certidaoAscai: 'Certidao_Negativa_ASCAI_INEMA.pdf',
      termoCompromissoAssinado: 'Termo_Compromisso_ASAS_Assinado.pdf'
    },
    // Vencido em 10/05/2026; atualizado automaticamente por RNF-105 e elegível para DR008 (RN-026)
    situacao: 'Certificado vencido',
    dataCadastro: '2024-02-15',
    dataProtocolo: '2024-02-20',
    dataUltimaVistoria: '2024-04-12',
    dataEmissaoCertificado: '2024-05-10',
    dataValidadeCertificado: '2026-05-10',
    vistoria: {
      id: 'vist-001',
      numero: 'F-TEC-133/2024-012',
      data: '2024-04-12',
      equipe: ['Mariana Lins (Bióloga INEMA)', 'Roberto Freire (Eng. Florestal INEMA)'],
      ucAte3km: 'Parque Nacional da Chapada Diamantina (Zona de Amortecimento)',
      vegetacaoPct: 78,
      vegetacaoHa: 1131.5,
      acoesAntropicas: ['Cerca perimetral conservada', 'Pastagem histórica em regeneração natural'],
      recursosHidricos: ['Nascente perene protegida', 'Açude com mata ciliar contínua'],
      recintos: [
        {
          id: 'rec-01',
          nome: 'Recinto Aclimatização Aves I',
          finalidade: 'Aclimatação',
          comprimentoM: 12,
          larguraM: 4,
          alturaM: 3.5,
          areaM2: 48,
          capacidadeIndividuos: 25
        },
        {
          id: 'rec-02',
          nome: 'Recinto Readaptação Passeriformes',
          finalidade: 'Readaptação',
          comprimentoM: 8,
          larguraM: 3,
          alturaM: 3.0,
          areaM2: 24,
          capacidadeIndividuos: 15
        }
      ],
      especiesAdequadasTexto:
        'Apto para recepção de aves da Caatinga (Psittacidae, Columbidae, Thraupidae) e pequenos mamíferos silvestres nativos.',
      fotos: ['vistoria_recinto_01.jpg', 'vistoria_vegetacao_caatinga.jpg', 'nascente_preservada.jpg'],
      relatorioPdfNome: 'Relatorio_Vistoria_F_TEC_133_Andarai.pdf',
      resultado: 'Favorável',
      justificativa: 'Área com excelente estado de conservação e recintos em conformidade com as normas.',
      concluida: true
    },
    solturas: [
      {
        id: 'solt-001',
        data: '2025-06-18',
        especie: 'Arara-canindé',
        nomeCientifico: 'Ara ararauna',
        grupo: 'Aves',
        quantidade: 6,
        unidadeOrigem: 'CETAS Salvador',
        termoSolturaNumero: 'TS-2025/089',
        ano: 2025
      },
      {
        id: 'solt-002',
        data: '2026-02-10',
        especie: 'Papagaio-verdadeiro',
        nomeCientifico: 'Amazona aestiva',
        grupo: 'Aves',
        quantidade: 12,
        unidadeOrigem: 'CETAS Salvador',
        termoSolturaNumero: 'TS-2026/014',
        ano: 2026
      }
    ],
    relatoriosTrimestrais: [
      {
        id: 'rel-tri-01',
        trimestre: '1º Trimestre',
        ano: 2026,
        dataEnvio: '2026-04-05',
        responsavelTecnico: 'Dr. Lucas Sampaio Guimarães',
        artNumero: 'ART-2024-998812',
        status: 'Entregue',
        resumoManejo: 'Monitoramento via rádio-telemetria de 6 araras; taxa de adaptação de 100%.',
        animaisEmReabilitacao: []
      }
    ],
    historico: [
      {
        id: 'h-01',
        dataHora: '2024-02-20 10:15',
        usuario: 'Carlos Silva (Técnico)',
        papel: 'Técnico de Fauna',
        acao: 'Protocolo de Requerimento realizado no SEIA.'
      },
      {
        id: 'h-02',
        dataHora: '2024-04-15 14:30',
        usuario: 'Mariana Lins (Bióloga)',
        papel: 'Equipe de Vistoria',
        acao: 'Vistoria F-TEC-133 concluída com resultado Favorável.'
      },
      {
        id: 'h-03',
        dataHora: '2024-05-10 09:00',
        usuario: 'Dr. Herickles Almado',
        papel: 'Coordenador CGFAU',
        acao: 'Certificado de ASAS emitido e Termo de Compromisso homologado.'
      }
    ],
    recintos: []
  },
  {
    id: 'asas-002',
    numero: 'ASAS-000.002',
    processoSei: '015.1102.2023.0019854-11',
    canalEntrada: 'Portal Externo',
    requerente: {
      tipoPessoa: 'PF',
      nomeOuRazaoSocial: 'Geraldo Antunes Bastos',
      cpfCnpj: '456.789.123-45',
      rgOuIe: '3.456.789-0 SSP/BA',
      email: 'geraldo.bastos@agroflorestal.com.br',
      telefone: '(77) 99123-8877'
    },
    categoria: 'Categoria I',
    justificativaCategoria: 'Propriedade rural com 80% de mata nativa preservada para soltura imediata.',
    propriedade: {
      nome: 'Reserva Particular Vale do Rio de Contas',
      tipoPropriedade: 'Imóvel Próprio',
      numeroCefir: 'BA-2918001-A1B2.C3D4.E5F6.0012',
      municipio: 'Jequié',
      cep: '45200-000',
      localizacaoDescritiva: 'Estrada da Barragem de Pedras, Km 12',
      bioma: 'Caatinga',
      bacia: 'Rio de Contas',
      ur: 'URRC'
    },
    delimitacao: {
      tipo: 'CEFIR',
      areaHa: 890.3,
      centro: { lat: -13.8569, lng: -40.0833, datum: 'SIRGAS 2000', xPct: 62.0, yPct: 62.5 },
      pontos: [
        [-13.84, -40.09],
        [-13.84, -40.06],
        [-13.87, -40.07],
        [-13.87, -40.10]
      ],
      valido: true,
      dataDefinicao: '2023-08-15'
    },
    documentos: {
      cefir: 'CEFIR_Reserva_Jequie.pdf',
      autorizacaoProprietario: 'Registro_Imovel_Comarca_Jequie.pdf',
      croqui: 'Croqui_Acesso.pdf',
      certidaoIbama: 'CND_IBAMA_Geraldo.pdf',
      certidaoAscai: 'CND_INEMA_Geraldo.pdf',
      termoCompromissoAssinado: 'Termo_Compromisso_Assinado_Jequie.pdf'
    },
    // ASAS plenamente Ativa com certificado bienal vigente até 2027
    situacao: 'Ativa',
    dataCadastro: '2025-06-10',
    dataProtocolo: '2025-06-25',
    dataUltimaVistoria: '2025-08-04',
    dataEmissaoCertificado: '2025-09-01',
    dataValidadeCertificado: '2027-09-01', // Vigente até 2027
    vistoria: {
      id: 'vist-002',
      numero: 'F-TEC-133/2023-044',
      data: '2023-08-04',
      equipe: ['Juliana Barreto (Técnica INEMA)'],
      vegetacaoPct: 84,
      vegetacaoHa: 747.8,
      acoesAntropicas: ['Estrada de terra com tráfego reduzido'],
      recursosHidricos: ['Rio das Pedras com vazão contínua'],
      recintos: [],
      especiesAdequadasTexto: 'Adequada para passeriformes, répteis e pequenos mamíferos.',
      fotos: ['mata_jequie_01.jpg'],
      relatorioPdfNome: 'Vistoria_Jequie_2023.pdf',
      resultado: 'Favorável',
      justificativa: 'Vegetação exuberante e isolamento satisfatório.',
      concluida: true
    },
    solturas: [
      {
        id: 'solt-003',
        data: '2024-03-22',
        especie: 'Jiboia',
        nomeCientifico: 'Boa constrictor',
        grupo: 'Répteis',
        quantidade: 3,
        unidadeOrigem: 'CETAS Vitória da Conquista',
        termoSolturaNumero: 'TS-2024/033',
        ano: 2024
      }
    ],
    relatoriosTrimestrais: [],
    historico: [
      {
        id: 'h-04',
        dataHora: '2025-09-02 00:00',
        usuario: 'Sistema SEIA Automático',
        papel: 'Rotina de Validade',
        acao: 'Certificado atingiu a vigência limite de 2 anos (Situação: Certificado vencido). Área permanece elegível com alerta.'
      }
    ],
    recintos: []
  },
  {
    id: 'asas-003',
    numero: 'ASAS-000.003',
    processoSei: '015.1102.2024.0089201-87',
    canalEntrada: 'Portal Externo',
    requerente: {
      tipoPessoa: 'PJ',
      nomeOuRazaoSocial: 'Agropecuária Serra da Jibóia Ltda.',
      cpfCnpj: '08.765.432/0001-10',
      rgOuIe: '234.567.890',
      email: 'meioambiente@serrajiboia.com.br',
      telefone: '(75) 3634-1122',
      representanteLegal: 'Marcos Vinícius Silva',
      representanteCpf: '987.654.321-88'
    },
    categoria: 'Categoria III',
    justificativaCategoria: 'Centro avançado para readaptação de mamíferos carnívoros e primatas.',
    propriedade: {
      nome: 'Fazenda Refúgio dos Macacos',
      tipoPropriedade: 'Imóvel Próprio',
      numeroCefir: 'BA-2931350-9876.5432.10FE.DCBA',
      municipio: 'Santa Inês',
      cep: '45320-000',
      localizacaoDescritiva: 'Serra da Jibóia, Acesso Norte',
      bioma: 'Mata Atlântica',
      bacia: 'Rio de Contas',
      ur: 'URRC'
    },
    responsavelTecnico: {
      nome: 'Dra. Fernanda Albuquerque',
      formacao: 'Bióloga',
      conselhoClasse: 'CRBio/BA',
      numeroRegistro: '12890/08',
      artNumero: 'ART-2024-554433',
      artValidade: '2026-12-31'
    },
    delimitacao: {
      tipo: 'Upload SHP/KML/GeoJSON',
      areaHa: 620.0,
      centro: { lat: -13.2942, lng: -39.8167, datum: 'SIRGAS 2000', xPct: 64.0, yPct: 58.0 },
      pontos: [
        [-13.28, -39.82],
        [-13.28, -39.80],
        [-13.31, -39.81],
        [-13.30, -39.83]
      ],
      valido: true,
      dataDefinicao: '2024-06-01'
    },
    documentos: {
      cefir: 'CEFIR_Santa_Ines.pdf',
      autorizacaoProprietario: 'Anuencia_Socios.pdf',
      croqui: 'Croqui_Serra_Jiboia.pdf',
      art: 'ART_Fernanda_Albuquerque.pdf',
      art_val: '2026-12-31',
      planoTrabalho: 'Plano_Readaptacao_Primatas.pdf',
      plantasRecintos: 'Plantas_Tunel_Voo_Recintos.pdf',
      propostaMarcacao: 'Microchip_Tatuagem.pdf',
      certidaoIbama: 'Certidao_IBAMA.pdf',
      certidaoAscai: 'Certidao_INEMA.pdf'
    },
    situacao: 'Suspensa',
    motivoSuspensao:
      'Atraso na entrega dos relatórios trimestrais de acompanhamento dos animais em readaptação (RN-024).',
    dataCadastro: '2024-05-18',
    dataProtocolo: '2024-06-05',
    dataUltimaVistoria: '2024-07-20',
    dataEmissaoCertificado: '2024-08-15',
    dataValidadeCertificado: '2026-08-15',
    solturas: [],
    relatoriosTrimestrais: [],
    historico: [
      {
        id: 'h-05',
        dataHora: '2025-08-20 11:00',
        usuario: 'Dr. Herickles Almado',
        papel: 'Coordenador CGFAU',
        acao: 'Área Suspensa por inadimplência reiterada de relatórios trimestrais e ART vencida.'
      }
    ],
    recintos: [
      {
        id: 'rec-03',
        nome: 'Recinto de Readaptação Primatas',
        finalidade: 'Readaptação',
        comprimentoM: 20,
        larguraM: 10,
        alturaM: 6,
        areaM2: 200,
        capacidadeIndividuos: 8,
        animaisAbrigadosIds: ['anim-101', 'anim-102']
      }
    ]
  },
  {
    id: 'asas-004',
    numero: 'ASAS-000.004',
    canalEntrada: 'Portal Externo',
    requerente: {
      tipoPessoa: 'PF',
      nomeOuRazaoSocial: 'Beatriz Vasconcelos Prado',
      cpfCnpj: '789.012.345-67',
      rgOuIe: '5.678.901-2 SSP/BA',
      email: 'beatriz.prado@florestalbahia.org',
      telefone: '(71) 98877-6655'
    },
    categoria: 'Categoria I',
    propriedade: {
      nome: 'Sítio Mata do Sossego',
      tipoPropriedade: 'Imóvel Próprio',
      numeroCefir: 'BA-2921003-CCBB.1122.3344.5566',
      municipio: 'Mata de São João',
      cep: '48280-000',
      localizacaoDescritiva: 'Litoral Norte, Km 68',
      bioma: 'Mata Atlântica',
      bacia: 'Rio Itapicuru',
      ur: 'URES'
    },
    delimitacao: {
      tipo: 'CEFIR',
      areaHa: 340.5,
      centro: { lat: -12.5311, lng: -38.0033, datum: 'SIRGAS 2000', xPct: 81.0, yPct: 51.5 },
      pontos: [
        [-12.52, -38.01],
        [-12.52, -37.99],
        [-12.54, -38.0],
        [-12.55, -38.02]
      ],
      valido: true,
      dataDefinicao: '2026-01-10'
    },
    documentos: {
      cefir: 'CEFIR_Mata_Sao_Joao.pdf',
      autorizacaoProprietario: 'Escritura_Sitio.pdf',
      croqui: 'Croqui_Litoral.pdf'
    },
    // Em análise -> aparece no DR010 agrupado como Cinza
    situacao: 'Em análise',
    dataCadastro: '2026-01-08',
    dataProtocolo: '2026-01-15',
    solturas: [],
    relatoriosTrimestrais: [],
    historico: [
      {
        id: 'h-06',
        dataHora: '2026-01-15 16:40',
        usuario: 'Beatriz Vasconcelos Prado',
        papel: 'Requerente',
        acao: 'Protocolo de Requerimento realizado no Portal Externo.'
      }
    ],
    recintos: []
  },
  {
    id: 'asas-005',
    numero: 'ASAS-000.005',
    canalEntrada: 'Técnico de Fauna',
    requerente: {
      tipoPessoa: 'PF',
      nomeOuRazaoSocial: 'Otávio Mendonça Ramos',
      cpfCnpj: '234.567.890-12',
      rgOuIe: '4.567.890-1 SSP/BA',
      email: 'otavio.ramos@cerradovivo.com.br',
      telefone: '(77) 3611-9000'
    },
    categoria: 'Categoria I',
    propriedade: {
      nome: 'Fazenda Veredas do Rio Grande',
      tipoPropriedade: 'Imóvel Próprio',
      numeroCefir: 'BA-2903201-1234.ABCD.5678.EFGH',
      municipio: 'Barreiras',
      cep: '47800-000',
      localizacaoDescritiva: 'Vale do Rio de Ondas, Km 22',
      bioma: 'Cerrado',
      bacia: 'Rio Grande',
      ur: 'UROE'
    },
    // ÁREA SEM DELIMITAÇÃO CADASTRADA (Para testar alerta RN-003 / CA003 do DR010)
    delimitacao: undefined,
    documentos: {
      cefir: 'CEFIR_Barreiras.pdf',
      autorizacaoProprietario: 'Escritura_Barreiras.pdf'
    },
    situacao: 'Em complementação',
    complementacaoPendente: 'Apresentar arquivo georreferenciado (SHP/KML) com a delimitação do imóvel e da reserva legal.',
    dataCadastro: '2026-02-01',
    dataProtocolo: '2026-02-05',
    solturas: [],
    relatoriosTrimestrais: [],
    historico: [
      {
        id: 'h-07',
        dataHora: '2026-02-20 14:00',
        usuario: 'Técnico UR Barreiras',
        papel: 'Técnico de Fauna',
        acao: 'Solicitada complementação de delimitação geográfica sem prazo fixo.'
      }
    ],
    recintos: []
  },
  {
    id: 'asas-006',
    numero: 'ASAS-000.006',
    canalEntrada: 'Portal Externo',
    requerente: {
      tipoPessoa: 'PJ',
      nomeOuRazaoSocial: 'Ecoparque Litoral Sul Conservação',
      cpfCnpj: '44.555.666/0001-22',
      rgOuIe: '556.778.899',
      email: 'diretoria@ecoparquelitoralsul.org',
      telefone: '(73) 3231-5000',
      representanteLegal: 'Renata Lemos Guimarães',
      representanteCpf: '111.222.333-44'
    },
    categoria: 'Categoria II',
    propriedade: {
      nome: 'Reserva Natural Ilhéus-Una',
      tipoPropriedade: 'Imóvel Próprio',
      numeroCefir: 'BA-2913606-AABB.CCDD.EEFF.0099',
      municipio: 'Ilhéus',
      cep: '45650-000',
      localizacaoDescritiva: 'Rodovia Ilhéus-Olivença, Km 18',
      bioma: 'Mata Atlântica',
      bacia: 'Rio Cachoeira',
      ur: 'URSU'
    },
    delimitacao: {
      tipo: 'CEFIR',
      areaHa: 520.4,
      centro: { lat: -14.7889, lng: -39.0494, datum: 'SIRGAS 2000', xPct: 72.0, yPct: 73.0 },
      pontos: [
        [-14.77, -39.06],
        [-14.77, -39.03],
        [-14.8, -39.04],
        [-14.8, -39.07]
      ],
      valido: true,
      dataDefinicao: '2026-03-01'
    },
    documentos: {
      cefir: 'CEFIR_Ilheus.pdf',
      autorizacaoProprietario: 'Certidao_RGI.pdf',
      croqui: 'Croqui_Acesso.pdf',
      art: 'ART_Renata.pdf',
      art_val: '2027-03-01',
      planoTrabalho: 'Plano_Manejo.pdf'
    },
    // Aguardando termo -> parecer favorável emitido, aguarda anexo do Termo de Compromisso assinado
    situacao: 'Aguardando termo',
    dataCadastro: '2026-02-12',
    dataProtocolo: '2026-02-18',
    dataUltimaVistoria: '2026-03-25',
    vistoria: {
      id: 'vist-006',
      numero: 'F-TEC-133/2026-088',
      data: '2026-03-25',
      equipe: ['Dra. Larissa Ramos (Técnica INEMA)'],
      vegetacaoPct: 92,
      vegetacaoHa: 478.7,
      acoesAntropicas: ['Trilha ecológica monitorada'],
      recursosHidricos: ['Rio Cachoeira e 3 lagoas costeiras'],
      recintos: [
        {
          id: 'rec-06',
          nome: 'Recinto Aclimatização Mico-leão',
          finalidade: 'Aclimatação',
          comprimentoM: 10,
          larguraM: 5,
          alturaM: 4,
          areaM2: 50,
          capacidadeIndividuos: 10
        }
      ],
      especiesAdequadasTexto: 'Primatas neotropicais e aves costeiras de Mata Atlântica.',
      fotos: ['mata_atlantica_ilheus.jpg'],
      relatorioPdfNome: 'Vistoria_Ilheus_2026.pdf',
      resultado: 'Favorável',
      justificativa: 'Ambiente preservado e equipe técnica especializada.',
      concluida: true
    },
    solturas: [],
    relatoriosTrimestrais: [],
    historico: [
      {
        id: 'h-08',
        dataHora: '2026-04-02 10:00',
        usuario: 'Dr. Herickles Almado',
        papel: 'Coordenador CGFAU',
        acao: 'Decisão favorável proferida. Termo de Compromisso emitido aguardando assinatura do proprietário.'
      }
    ],
    recintos: []
  },
  {
    id: 'asas-007',
    numero: 'ASAS-000.007',
    canalEntrada: 'Portal Externo',
    requerente: {
      tipoPessoa: 'PF',
      nomeOuRazaoSocial: 'Cláudio Ferreira Lima',
      cpfCnpj: '345.678.901-23',
      rgOuIe: '6.789.012-3 SSP/BA',
      email: 'claudio.ferreira@agrovales.com',
      telefone: '(74) 3611-3344'
    },
    categoria: 'Categoria I',
    propriedade: {
      nome: 'Fazenda Vereda das Aves',
      tipoPropriedade: 'Imóvel Próprio',
      numeroCefir: 'BA-2918407-3344.5566.7788.9900',
      municipio: 'Juazeiro',
      cep: '48900-000',
      localizacaoDescritiva: 'Margens do Rio São Francisco, Km 15',
      bioma: 'Caatinga',
      bacia: 'Rio São Francisco',
      ur: 'URSF'
    },
    delimitacao: {
      tipo: 'CEFIR',
      areaHa: 410.0,
      centro: { lat: -9.4167, lng: -40.5, datum: 'SIRGAS 2000', xPct: 60.0, yPct: 22.0 },
      pontos: [
        [-9.4, -40.51],
        [-9.4, -40.48],
        [-9.43, -40.49],
        [-9.43, -40.52]
      ],
      valido: true,
      dataDefinicao: '2025-04-10'
    },
    documentos: {
      cefir: 'CEFIR_Juazeiro.pdf',
      autorizacaoProprietario: 'Escritura_Juazeiro.pdf'
    },
    // Indeferida -> não é plotada no DR010
    situacao: 'Indeferida',
    dataCadastro: '2025-03-10',
    dataProtocolo: '2025-03-15',
    dataUltimaVistoria: '2025-04-20',
    vistoria: {
      id: 'vist-007',
      numero: 'F-TEC-133/2025-031',
      data: '2025-04-20',
      equipe: ['Técnico de Fauna Juazeiro'],
      vegetacaoPct: 25,
      vegetacaoHa: 102.5,
      acoesAntropicas: ['Intensa atividade agrícola com agrotóxicos no entorno', 'Caça predatória'],
      recursosHidricos: [],
      recintos: [],
      especiesAdequadasTexto: 'Inadequada para soltura.',
      fotos: ['degradacao_entorno.jpg'],
      relatorioPdfNome: 'Parecer_Desfavoravel_Juazeiro.pdf',
      resultado: 'Desfavorável',
      justificativa: 'Área com intensa pulverização de defensivos agrícolas e isolamento insuficiente.',
      concluida: true
    },
    solturas: [],
    relatoriosTrimestrais: [],
    historico: [
      {
        id: 'h-09',
        dataHora: '2025-05-02 15:30',
        usuario: 'Dr. Herickles Almado',
        papel: 'Coordenador CGFAU',
        acao: 'Requerimento Indeferido com emissão de DOC002 Notificação de Indeferimento. Registro somente leitura.'
      }
    ],
    recintos: []
  },
  {
    id: 'asas-008',
    numero: 'ASAS-000.008',
    processoSei: '015.3344.2023.0019283-44',
    canalEntrada: 'Técnico de Fauna',
    requerente: {
      tipoPessoa: 'PF',
      nomeOuRazaoSocial: 'Otávio Silveira Meireles',
      cpfCnpj: '456.789.012-34',
      rgOuIe: '3.456.789-0 SSP/BA',
      email: 'otavio.meireles@agroba.com.br',
      telefone: '(77) 3611-9000'
    },
    categoria: 'Categoria II',
    justificativaCategoria: 'Área com recintos desativada a pedido do proprietário com realocação dos animais.',
    propriedade: {
      nome: 'Fazenda Rio Verde',
      tipoPropriedade: 'Imóvel Próprio',
      numeroCefir: 'BA-2903201-1A2B.3C4D.5E6F.7A8B',
      municipio: 'Barreiras',
      cep: '47800-000',
      localizacaoDescritiva: 'Estrada do Rio de Pedras, Km 18',
      bioma: 'Cerrado',
      bacia: 'Rio Grande',
      ur: 'UROE'
    },
    delimitacao: {
      tipo: 'CEFIR',
      areaHa: 980.0,
      centro: { lat: -12.15, lng: -44.99, datum: 'SIRGAS 2000', xPct: 22.0, yPct: 48.0 },
      pontos: [
        [-12.14, -45.0],
        [-12.14, -44.98],
        [-12.16, -44.98],
        [-12.16, -45.0]
      ],
      valido: true,
      dataDefinicao: '2023-01-10'
    },
    documentos: {
      cefir: 'CEFIR_Fazenda_Rio_Verde.pdf',
      autorizacaoProprietario: 'Certidao_RGI_Barreiras.pdf',
      croqui: 'Croqui_Acesso.pdf',
      certidaoIbama: 'CND_IBAMA_Otavio.pdf',
      certidaoAscai: 'CND_INEMA_Otavio.pdf',
      termoCompromissoAssinado: 'Termo_Compromisso_Rio_Verde.pdf'
    },
    situacao: 'Desativada',
    dataCadastro: '2023-01-10',
    dataProtocolo: '2023-01-15',
    dataUltimaVistoria: '2023-03-20',
    dataEmissaoCertificado: '2023-04-10',
    dataValidadeCertificado: '2025-04-10',
    solturas: [],
    recintos: [],
    relatoriosTrimestrais: [],
    historico: [
      {
        id: 'tram-desat-01',
        dataHora: '2024-08-10 14:30',
        usuario: 'Mariana Lins (CGFAU)',
        papel: 'Analista CGFAU',
        acao: 'Área desativada a pedido do titular com destinação de todos os animais para o CETAS Salvador (RN-027 e MSG010).'
      }
    ]
  }
];

/* ========================================================================= */
/* SEMENTES INICIAIS — DR012 (GUARDIÕES E TGAS)                             */
/* ========================================================================= */

export const SEED_GUARDIOES: GuardiaoItem[] = [
  {
    id: 'guard-001',
    numeroCadastro: 'GUARD-2026/001',
    canalEntrada: 'Portal Externo',
    requerente: {
      tipoPessoa: 'PF',
      nomeOuRazaoSocial: 'Dr. Marcelo Ribeiro Sampaio',
      cpfCnpj: '123.456.789-01',
      rgOuIe: '7.890.123-4 SSP/BA',
      orgaoExpedidor: 'SSP/BA',
      ufRg: 'BA',
      sexo: 'M',
      estadoCivil: 'Casado(a)',
      filiacaoMae: 'Maria de Lourdes Ribeiro Sampaio',
      filiacaoPai: 'Antônio Carlos Sampaio',
      email: 'marcelo.sampaio@ufrb.edu.br',
      telefone: '(75) 99881-2233',
      enderecoResidencial: 'Rua das Palmeiras, 142, Bairro Sim',
      municipio: 'Feira de Santana',
      cep: '44085-120'
    },
    recinto: {
      endereco: 'Sítio Recanto dos Pássaros, Km 08, Estrada do Feira VII',
      municipio: 'Feira de Santana',
      coordenadas: { lat: -12.2667, lng: -38.9667, datum: 'SIRGAS 2000' },
      tipoRecinto: 'Viveiro Telado para Psitacídeos',
      comprimentoM: 6,
      larguraM: 3,
      alturaM: 2.5,
      areaM2: 18,
      materiais: 'Estrutura metálica galvanizada, tela anti-predador 1/2 polegada, piso lavável de concreto com brita',
      enriquecimento: 'Poleiros naturais de diâmetros variáveis, cordas de sisal, área de banho com água corrente',
      segurancaContraFuga: 'Antecâmara com porta dupla de segurança e tranca cadeado'
    },
    possuiAnimalPrevio: false,
    documentos: {
      documentoFotoIdentidade: 'RG_Marcelo_Sampaio.pdf',
      comprovanteResidenciaAtualizado: 'Conta_Energia_Fev2026.pdf',
      certidaoAntecedentesCriminais: 'Certidao_Antecedentes_Pol_Civil.pdf',
      certidaoNegativaIbama: 'CND_IBAMA_Marcelo.pdf',
      certidaoNegativaInemaAscai: 'CND_INEMA_Marcelo.pdf',
      declaracaoAusenciaCondenacao5Anos: 'Declaracao_Ausencia_Condenacao_Assinada.pdf',
      declaracaoNaoCriadouroSispass: 'Declaracao_Nao_Sispass_Assinada.pdf',
      requerimentoAssinado: 'Requerimento_Guardiao_F_TEC_187.pdf'
    },
    declaracoesAceitas: true,
    situacao: 'Habilitado',
    dataCadastro: '2026-01-10',
    vistoria: {
      data: '2026-02-05',
      equipe: ['Dr. Thiago Moreira (CRMV/BA 5512)'],
      resultado: 'Favorável',
      parecer: 'Recinto em excelente estado de higienização, segurança contra fuga e enriquecimento ambiental.',
      fotos: ['recinto_feira_01.jpg', 'recinto_feira_02.jpg']
    },
    laudosCetas: [
      {
        id: 'laudo-001',
        numero: 'LAUDO-CETAS-2026/012',
        dataEmissao: '2026-02-15',
        veterinarioNome: 'Dr. Thiago Moreira',
        veterinarioCrmv: 'CRMV/BA 5512',
        assinado: true,
        dataAssinatura: '2026-02-15',
        animaisLote: [
          {
            animalId: 'anim-001',
            numeroDigital: 'FAU-2026-0001',
            nomeComum: 'Papagaio-verdadeiro',
            nomeCientifico: 'Amazona aestiva',
            grupo: 'Aves',
            sexo: 'Fêmea',
            tipoMarcacao: 'Anilha Fechada',
            codigoMarcacao: 'BA-2026-AN-0881',
            situacaoAnimal: 'Sob guarda',
            anamnese: 'Apreensão em cativeiro doméstico de longa data, sem habilidade de voo por atrofia muscular crônica.',
            exameFisicoSistemas: 'Ausência de fraturas; plumagem das rêmiges cortadas no passado com folículos inativos.',
            avaliacaoComportamental: 'Animal humanizado que busca ativamente contato humano; incapaz de forrageamento.',
            justificativaImpossibilidadeSoltura: 'Inaptidão definitiva para vida livre decorrente de humanização crônica e perda funcional de voo.',
            fotoUrl: 'papagaio_verdadeiro_01.jpg'
          },
          {
            animalId: 'anim-002',
            numeroDigital: 'FAU-2026-0002',
            nomeComum: 'Maritaca / Periquito-rico',
            nomeCientifico: 'Brotogeris tirica',
            grupo: 'Aves',
            sexo: 'Macho',
            tipoMarcacao: 'Microchip',
            codigoMarcacao: '982.000.412.339.102',
            situacaoAnimal: 'Sob guarda',
            anamnese: 'Entregue voluntariamente com histórico de 8 anos em gaiola.',
            exameFisicoSistemas: 'Amputação traumática da extremidade da asa esquerda.',
            avaliacaoComportamental: 'Mansidão extrema e dependência humana.',
            justificativaImpossibilidadeSoltura: 'Deficiência física permanente que impede o voo sustentado na natureza.',
            fotoUrl: 'periquito_rico_01.jpg'
          }
        ]
      }
    ],
    tgasVigente: {
      id: 'tgas-001',
      numero: 'TGAS-2026/0001',
      guardiaoId: 'guard-001',
      laudoTecnicoId: 'laudo-001',
      dataEmissao: '2026-02-20',
      dataValidade: '2027-02-20',
      situacao: 'Vigente',
      animaisSobGuarda: [
        {
          animalId: 'anim-001',
          numeroDigital: 'FAU-2026-0001',
          nomeComum: 'Papagaio-verdadeiro',
          nomeCientifico: 'Amazona aestiva',
          grupo: 'Aves',
          sexo: 'Fêmea',
          tipoMarcacao: 'Anilha Fechada',
          codigoMarcacao: 'BA-2026-AN-0881',
          situacaoAnimal: 'Sob guarda'
        },
        {
          animalId: 'anim-002',
          numeroDigital: 'FAU-2026-0002',
          nomeComum: 'Maritaca / Periquito-rico',
          nomeCientifico: 'Brotogeris tirica',
          grupo: 'Aves',
          sexo: 'Macho',
          tipoMarcacao: 'Microchip',
          codigoMarcacao: '982.000.412.339.102',
          situacaoAnimal: 'Sob guarda'
        }
      ],
      assinaturaGuardiao: {
        concluida: true,
        data: '2026-02-22 11:15',
        tipo: 'gov.br'
      },
      assinaturaDiretorGeral: {
        concluida: true,
        data: '2026-02-24 16:30',
        processoSei: '015.1102.2026.0001928-33'
      },
      dataEntregaAnimais: '2026-02-26',
      prorrogacaoBloqueadaPorAtraso: false
    },
    historicoTgas: [],
    relatoriosSemestrais: [],
    ocorrencias: []
  },
  {
    id: 'guard-002',
    numeroCadastro: 'GUARD-2026/002',
    canalEntrada: 'Portal Externo',
    requerente: {
      tipoPessoa: 'PF',
      nomeOuRazaoSocial: 'Helena Fontes Barreto',
      cpfCnpj: '987.654.321-09',
      rgOuIe: '8.901.234-5 SSP/BA',
      email: 'helena.fontes@gmail.com',
      telefone: '(71) 99191-4455',
      enderecoResidencial: 'Condomínio Enseada do Castelo, Casa 12',
      municipio: 'Camaçari',
      cep: '42827-000'
    },
    recinto: {
      endereco: 'Condomínio Enseada do Castelo, Casa 12, Área Verde',
      municipio: 'Camaçari',
      coordenadas: { lat: -12.7, lng: -38.2, datum: 'SIRGAS 2000' },
      tipoRecinto: 'Recinto de Sauí',
      comprimentoM: 5,
      larguraM: 3,
      alturaM: 3,
      areaM2: 15,
      materiais: 'Tela galvanizada e mourões de eucalipto tratado',
      enriquecimento: 'Cipós, tocas de madeira suspensas e comedouros em plataforma',
      segurancaContraFuga: 'Porta com antecâmara'
    },
    possuiAnimalPrevio: false,
    documentos: {
      documentoFotoIdentidade: 'RG_Helena.pdf',
      comprovanteResidenciaAtualizado: 'Conta_Agua_Jan2026.pdf',
      certidaoAntecedentesCriminais: 'Certidao_Antecedentes_Helena.pdf',
      certidaoNegativaIbama: 'CND_IBAMA_Helena.pdf',
      certidaoNegativaInemaAscai: 'CND_INEMA_Helena.pdf',
      declaracaoAusenciaCondenacao5Anos: 'Declaracao_Ausencia_Condenacao.pdf',
      declaracaoNaoCriadouroSispass: 'Declaracao_Nao_Sispass.pdf',
      requerimentoAssinado: 'Requerimento_Assinado_Helena.pdf'
    },
    declaracoesAceitas: true,
    // Habilitado, mas TGAS em estado Aguardando assinatura (guardião assinou, DG ainda não)
    situacao: 'Habilitado',
    dataCadastro: '2026-02-01',
    vistoria: {
      data: '2026-02-28',
      equipe: ['Bióloga Roberta Rios (INEMA)'],
      resultado: 'Favorável',
      parecer: 'Instalações adequadas para mamíferos de pequeno porte não ameaçados.',
      fotos: ['recinto_camacari_01.jpg']
    },
    laudosCetas: [
      {
        id: 'laudo-002',
        numero: 'LAUDO-CETAS-2026/019',
        dataEmissao: '2026-03-05',
        veterinarioNome: 'Dr. Thiago Moreira',
        veterinarioCrmv: 'CRMV/BA 5512',
        assinado: true,
        dataAssinatura: '2026-03-05',
        animaisLote: [
          {
            animalId: 'anim-003',
            numeroDigital: 'FAU-2026-0003',
            nomeComum: 'Sagui-de-tufos-brancos',
            nomeCientifico: 'Callithrix jacchus',
            grupo: 'Mamíferos',
            sexo: 'Macho',
            tipoMarcacao: 'Microchip',
            codigoMarcacao: '982.000.778.991.004',
            situacaoAnimal: 'Sob guarda',
            anamnese: 'Vítima de eletrocussão na rede elétrica com amputação parcial de cauda.',
            exameFisicoSistemas: 'Cicatriz consolidada; perda de equilíbrio para saltos em dossel florestal.',
            avaliacaoComportamental: 'Excelente interação com tratadores; impossibilidade de vida em bando selvagem.',
            justificativaImpossibilidadeSoltura: 'Perda do leme caudal e descoordenação motora grave para saltos em altura.',
            fotoUrl: 'sagui_tufos_brancos.jpg'
          }
        ]
      }
    ],
    tgasVigente: {
      id: 'tgas-002',
      numero: 'TGAS-2026/0002',
      guardiaoId: 'guard-002',
      laudoTecnicoId: 'laudo-002',
      dataEmissao: '2026-03-10',
      dataValidade: '2027-03-10',
      situacao: 'Aguardando assinatura',
      animaisSobGuarda: [
        {
          animalId: 'anim-003',
          numeroDigital: 'FAU-2026-0003',
          nomeComum: 'Sagui-de-tufos-brancos',
          nomeCientifico: 'Callithrix jacchus',
          grupo: 'Mamíferos',
          sexo: 'Macho',
          tipoMarcacao: 'Microchip',
          codigoMarcacao: '982.000.778.991.004',
          situacaoAnimal: 'Sob guarda'
        }
      ],
      assinaturaGuardiao: {
        concluida: true,
        data: '2026-03-12 14:00',
        tipo: 'gov.br'
      },
      // Diretor-Geral ainda não assinou -> Não pode entregar animal
      assinaturaDiretorGeral: {
        concluida: false,
        processoSei: '015.1102.2026.0002341-99'
      },
      prorrogacaoBloqueadaPorAtraso: false
    },
    historicoTgas: [],
    relatoriosSemestrais: [],
    ocorrencias: []
  },
  {
    id: 'guard-003',
    numeroCadastro: 'GUARD-2026/003',
    canalEntrada: 'Portal Externo',
    requerente: {
      tipoPessoa: 'PF',
      nomeOuRazaoSocial: 'Rogério de Souza Pinto',
      cpfCnpj: '567.890.123-44',
      rgOuIe: '9.012.345-6 SSP/BA',
      email: 'rogerio.pinto@terrabrasil.com.br',
      telefone: '(77) 98112-3344',
      enderecoResidencial: 'Fazenda Santa Maria, Zona Rural',
      municipio: 'Vitória da Conquista',
      cep: '45000-000'
    },
    recinto: {
      endereco: 'Fazenda Santa Maria, Galpão de Fauna',
      municipio: 'Vitória da Conquista',
      coordenadas: { lat: -14.8667, lng: -40.8333, datum: 'SIRGAS 2000' },
      tipoRecinto: 'Recinto Rústico',
      comprimentoM: 4,
      larguraM: 2,
      alturaM: 2,
      areaM2: 8,
      materiais: 'Madeira e tela comum',
      enriquecimento: 'Inexistente',
      segurancaContraFuga: 'Porta simples sem antecâmara'
    },
    possuiAnimalPrevio: false,
    documentos: {
      documentoFotoIdentidade: 'RG_Rogerio.pdf',
      comprovanteResidenciaAtualizado: 'Conta_Luz_Conquista.pdf'
    },
    declaracoesAceitas: true,
    // Em adequação -> vistoria desfavorável com prazo de 60 dias para reforma
    situacao: 'Em adequação',
    dataCadastro: '2026-01-20',
    vistoria: {
      data: '2026-02-18',
      equipe: ['Técnico UR Vitória da Conquista'],
      resultado: 'Em adequação',
      parecer:
        'Recinto sem antecâmara de segurança e sem enriquecimento ambiental. Prazo de 60 dias para adequação técnica.',
      prazoAdequacaoDias: 60,
      fotos: ['recinto_inadequado_01.jpg']
    },
    laudosCetas: [],
    historicoTgas: [],
    relatoriosSemestrais: [],
    ocorrencias: []
  },
  {
    id: 'guard-004',
    numeroCadastro: 'GUARD-2026/004',
    canalEntrada: 'Portal Externo',
    requerente: {
      tipoPessoa: 'PF',
      nomeOuRazaoSocial: 'Reginaldo de Alencar Barros',
      cpfCnpj: '654.321.987-11',
      rgOuIe: '4.567.890-1 SSP/BA',
      email: 'reginaldo.barros@terra.com.br',
      telefone: '(71) 99881-9988',
      enderecoResidencial: 'Alameda das Espatódias, 500, Caminho das Árvores',
      municipio: 'Salvador',
      cep: '41820-460'
    },
    recinto: {
      endereco: 'Alameda das Espatódias, 500, Caminho das Árvores',
      municipio: 'Salvador',
      coordenadas: { lat: -12.98, lng: -38.46, datum: 'SIRGAS 2000' },
      tipoRecinto: 'Gaiolão Telado',
      comprimentoM: 5,
      larguraM: 3,
      alturaM: 2.2,
      areaM2: 15,
      materiais: 'Telas galvanizadas e estrutura de aço',
      enriquecimento: 'Poleiros e brinquedos de madeira',
      segurancaContraFuga: 'Porta com antecâmara e trava'
    },
    possuiAnimalPrevio: true,
    documentos: {
      documentoFotoIdentidade: 'RG_Reginaldo.pdf',
      comprovanteResidenciaAtualizado: 'Comprovante_Residencia.pdf'
    },
    declaracoesAceitas: true,
    situacao: 'Habilitado',
    dataCadastro: '2026-01-05',
    laudosCetas: [],
    tgasVigente: {
      id: 'tgas-004',
      numero: 'TGAS-2026/0004',
      guardiaoId: 'guard-004',
      laudoTecnicoId: 'laudo-004',
      dataEmissao: '2026-01-20',
      dataValidade: '2027-01-20',
      situacao: 'Vigente',
      assinaturaGuardiao: {
        concluida: true,
        data: '2026-01-20',
        tipo: 'gov.br'
      },
      assinaturaDiretorGeral: {
        concluida: true,
        data: '2026-01-21',
        processoSei: '015.8821.2026.0019234-55'
      },
      animaisSobGuarda: [
        { animalId: 'anim-101', numeroDigital: 'FAU-2026-0101', nomeComum: 'Periquito-rico', nomeCientifico: 'Brotogeris tirica', grupo: 'Aves', sexo: 'Macho', tipoMarcacao: 'Anilha Fechada', codigoMarcacao: 'BA-2026-AN-1001', situacaoAnimal: 'Sob guarda' },
        { animalId: 'anim-102', numeroDigital: 'FAU-2026-0102', nomeComum: 'Canário-da-terra', nomeCientifico: 'Sicalis flaveola', grupo: 'Aves', sexo: 'Macho', tipoMarcacao: 'Anilha Fechada', codigoMarcacao: 'BA-2026-AN-1002', situacaoAnimal: 'Sob guarda' },
        { animalId: 'anim-103', numeroDigital: 'FAU-2026-0103', nomeComum: 'Coleirinho', nomeCientifico: 'Sporophila caerulescens', grupo: 'Aves', sexo: 'Macho', tipoMarcacao: 'Anilha Fechada', codigoMarcacao: 'BA-2026-AN-1003', situacaoAnimal: 'Sob guarda' },
        { animalId: 'anim-104', numeroDigital: 'FAU-2026-0104', nomeComum: 'Trinca-ferro', nomeCientifico: 'Saltator similis', grupo: 'Aves', sexo: 'Fêmea', tipoMarcacao: 'Anilha Fechada', codigoMarcacao: 'BA-2026-AN-1004', situacaoAnimal: 'Sob guarda' },
        { animalId: 'anim-105', numeroDigital: 'FAU-2026-0105', nomeComum: 'Papagaio-do-mangue', nomeCientifico: 'Amazona amazonica', grupo: 'Aves', sexo: 'Macho', tipoMarcacao: 'Microchip', codigoMarcacao: '982.000.111.222.333', situacaoAnimal: 'Sob guarda' }
      ]
    },
    historicoTgas: [],
    relatoriosSemestrais: [],
    ocorrencias: []
  }
];

/* ========================================================================= */
/* GERENCIADOR DE ESTADO LOCALSTORAGE E EVENTOS REATIVOS                     */
/* ========================================================================= */

let asasMemory: AsasItem[] = [];
let guardioesMemory: GuardiaoItem[] = [];

function carregarDoStorage() {
  if (typeof window === 'undefined') {
    asasMemory = [...SEED_ASAS];
    guardioesMemory = [...SEED_GUARDIOES];
    return;
  }

  try {
    const rawAsas = localStorage.getItem(STORAGE_KEY_ASAS);
    if (rawAsas) {
      asasMemory = JSON.parse(rawAsas);
    } else {
      asasMemory = [...SEED_ASAS];
      localStorage.setItem(STORAGE_KEY_ASAS, JSON.stringify(asasMemory));
    }
  } catch (e) {
    console.error('Erro ao ler ASAS do localStorage', e);
    asasMemory = [...SEED_ASAS];
  }

  try {
    const rawGuard = localStorage.getItem(STORAGE_KEY_GUARDIOES);
    if (rawGuard) {
      guardioesMemory = JSON.parse(rawGuard);
    } else {
      guardioesMemory = [...SEED_GUARDIOES];
      localStorage.setItem(STORAGE_KEY_GUARDIOES, JSON.stringify(guardioesMemory));
    }
  } catch (e) {
    console.error('Erro ao ler Guardiões do localStorage', e);
    guardioesMemory = [...SEED_GUARDIOES];
  }

  // RNF-105: Executa rotina diária de prazos automática
  executarRotinaPrazosAutomaticos();
}

/**
 * RNF-105: Rotina automática diária para atualizar a situação por certificado vencido
 * e registrar a execução e histórico (RN-025, RN-026, RNF-105).
 */
export function executarRotinaPrazosAutomaticos(): { alteradas: number; log: string[] } {
  const hoje = '2026-11-03';
  let alteradas = 0;
  const log: string[] = [];

  asasMemory = asasMemory.map((asas) => {
    // Se a ASAS estiver Ativa mas com certificado expirado, transiciona para 'Certificado vencido'
    if (asas.situacao === 'Ativa' && asas.dataValidadeCertificado && asas.dataValidadeCertificado < hoje) {
      alteradas++;
      const msg = `[RNF-105] ASAS ${asas.numero} teve sua situação atualizada de 'Ativa' para 'Certificado vencido' (Certificado expirado em ${asas.dataValidadeCertificado}).`;
      log.push(msg);

      const novoHistorico = [
        ...(asas.historico || []),
        {
          id: `tram-exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          dataHora: `${hoje} 00:00`,
          usuario: 'Sistema SEIA (Rotina Diária RNF-105)',
          papel: 'Serviço Automatizado',
          acao: `Situação alterada automaticamente para 'Certificado vencido' por decurso do prazo de 2 anos (expirado em ${asas.dataValidadeCertificado}, RN-025 e RNF-105). Área continua elegível para soltura com MSG011 (RN-026).`
        }
      ];

      return {
        ...asas,
        situacao: 'Certificado vencido' as any,
        historico: novoHistorico
      };
    }
    return asas;
  });

  if (alteradas > 0) {
    salvarNoStorage();
  }

  return { alteradas, log };
}

export function resetFaunaR3R4Data(): void {
  asasMemory = [...SEED_ASAS];
  guardioesMemory = [...SEED_GUARDIOES];
  salvarNoStorage();
  executarRotinaPrazosAutomaticos();
}

// Inicializa no carregamento do módulo
carregarDoStorage();

function salvarNoStorage() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ASAS, JSON.stringify(asasMemory));
    localStorage.setItem(STORAGE_KEY_GUARDIOES, JSON.stringify(guardioesMemory));
    window.dispatchEvent(new CustomEvent('inema_fauna_r3r4_changed'));
  } catch (e) {
    console.error('Erro ao salvar fauna R3R4 no localStorage', e);
  }
}

/* ========================================================================= */
/* API DR009 (ASAS)                                                          */
/* ========================================================================= */

export function getAsasList(): AsasItem[] {
  carregarDoStorage();
  return [...asasMemory];
}

export function getAsasById(id: string): AsasItem | undefined {
  carregarDoStorage();
  return asasMemory.find((a) => a.id === id || a.numero === id);
}

export function saveAsasItem(item: AsasItem): AsasItem {
  carregarDoStorage();
  const index = asasMemory.findIndex((a) => a.id === item.id);
  if (index >= 0) {
    asasMemory[index] = item;
  } else {
    asasMemory.unshift(item);
  }
  salvarNoStorage();
  return item;
}

export function deleteAsasItem(id: string): boolean {
  carregarDoStorage();
  const initialLength = asasMemory.length;
  asasMemory = asasMemory.filter((a) => a.id !== id);
  if (asasMemory.length !== initialLength) {
    salvarNoStorage();
    return true;
  }
  return false;
}

/* ========================================================================= */
/* API DR012 (GUARDIÕES)                                                     */
/* ========================================================================= */

export function getGuardioesList(): GuardiaoItem[] {
  carregarDoStorage();
  return [...guardioesMemory];
}

export function getGuardiaoById(id: string): GuardiaoItem | undefined {
  carregarDoStorage();
  return guardioesMemory.find((g) => g.id === id || g.numeroCadastro === id);
}

export function saveGuardiaoItem(item: GuardiaoItem): GuardiaoItem {
  carregarDoStorage();
  const index = guardioesMemory.findIndex((g) => g.id === item.id);
  if (index >= 0) {
    guardioesMemory[index] = item;
  } else {
    guardioesMemory.unshift(item);
  }
  salvarNoStorage();
  return item;
}

export function deleteGuardiaoItem(id: string): boolean {
  carregarDoStorage();
  const initialLength = guardioesMemory.length;
  guardioesMemory = guardioesMemory.filter((g) => g.id !== id);
  if (guardioesMemory.length !== initialLength) {
    salvarNoStorage();
    return true;
  }
  return false;
}

/* ========================================================================= */
/* REINICIAR CENÁRIO PARA DADOS SEED                                         */
/* ========================================================================= */

export function resetFaunaR3R4ToSeed(): void {
  asasMemory = [...SEED_ASAS];
  guardioesMemory = [...SEED_GUARDIOES];
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_ASAS);
    localStorage.removeItem(STORAGE_KEY_GUARDIOES);
  }
  salvarNoStorage();
}

export function subscribeFaunaR3R4(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('inema_fauna_r3r4_changed', handler);
  return () => window.removeEventListener('inema_fauna_r3r4_changed', handler);
}
