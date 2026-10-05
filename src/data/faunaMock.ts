export interface NomePopularItem {
  id: string;
  nome: string;
  principal: boolean;
}

export interface ClassificacaoAmeacaItem {
  id: string;
  listaOficial: 'Nacional (MMA)' | 'Estadual (Bahia)' | 'CITES' | 'IUCN';
  categoria: string;
  atoNormativoAno: string;
}

export type GrupoAnimal = 'Aves' | 'Mamíferos' | 'Répteis' | 'Anfíbios' | 'Peixes' | 'Invertebrados';

export interface EspecieItem {
  id: string;
  codigo: string;
  nomeCientifico: string;
  autorAno?: string;
  taxonSuperior: boolean;
  classe: string;
  ordem: string;
  familia: string;
  genero: string;
  grupoAnimal: GrupoAnimal;
  nomesPopulares: NomePopularItem[];
  classificacoesAmeaca: ClassificacaoAmeacaItem[];
  ameacada: boolean;
  exoticaInvasora: boolean;
  restricoesSoltura: string;
  observacoes?: string;
  justificativaEdicao?: string;
  statusRegistro: 'rascunho' | 'definitivo';
  situacao: 'Ativo' | 'Inativo';
  dataCadastro: string;
  atualizadoEm?: string;
}

export const LISTAS_OFICIAIS = [
  'Nacional (MMA)',
  'Estadual (Bahia)',
  'CITES',
  'IUCN',
] as const;

export const CATEGORIAS_AMEACA = [
  'CR - Criticamente em Perigo',
  'EN - Em Perigo',
  'VU - Vulnerável',
  'NT - Quase Ameaçada',
  'LC - Menos Preocupante',
  'DD - Dados Insuficientes',
  'Apêndice I',
  'Apêndice II',
  'Apêndice III',
] as const;

export const GRUPOS_ANIMAIS: GrupoAnimal[] = [
  'Aves',
  'Mamíferos',
  'Répteis',
  'Anfíbios',
  'Peixes',
  'Invertebrados',
];

export const MOCK_ESPECIES: EspecieItem[] = [
  {
    id: 'esp-001',
    codigo: 'ESP-0001',
    nomeCientifico: 'Ara ararauna',
    autorAno: '(Linnaeus, 1758)',
    taxonSuperior: false,
    classe: 'Aves',
    ordem: 'Psittaciformes',
    familia: 'Psittacidae',
    genero: 'Ara',
    grupoAnimal: 'Aves',
    nomesPopulares: [
      { id: 'np-1', nome: 'Arara-canindé', principal: true },
      { id: 'np-2', nome: 'Arara-amarela', principal: false },
      { id: 'np-3', nome: 'Canindé', principal: false },
    ],
    classificacoesAmeaca: [
      { id: 'ca-1', listaOficial: 'CITES', categoria: 'Apêndice II', atoNormativoAno: 'CoP19 / 2023' },
      { id: 'ca-2', listaOficial: 'IUCN', categoria: 'LC - Menos Preocupante', atoNormativoAno: 'Red List 2022' },
    ],
    ameacada: false,
    exoticaInvasora: false,
    restricoesSoltura: 'Soltura permitida apenas em áreas de Caatinga e Cerrado baiano cadastradas como ASAS. Exige anilhamento oficial e teste prévio para Clamidiose e Circovírus.',
    observacoes: 'Espécie com grande entrada no CETAS Salvador via entrega voluntária e apreensões em feiras livres.',
    statusRegistro: 'definitivo',
    situacao: 'Ativo',
    dataCadastro: '12/03/2024',
  },
  {
    id: 'esp-002',
    codigo: 'ESP-0002',
    nomeCientifico: 'Panthera onca',
    autorAno: '(Linnaeus, 1758)',
    taxonSuperior: false,
    classe: 'Mammalia',
    ordem: 'Carnivora',
    familia: 'Felidae',
    genero: 'Panthera',
    grupoAnimal: 'Mamíferos',
    nomesPopulares: [
      { id: 'np-4', nome: 'Onça-pintada', principal: true },
      { id: 'np-5', nome: 'Jaguar', principal: false },
      { id: 'np-6', nome: 'Yaguareté', principal: false },
    ],
    classificacoesAmeaca: [
      { id: 'ca-3', listaOficial: 'Nacional (MMA)', categoria: 'VU - Vulnerável', atoNormativoAno: 'Portaria MMA nº 148/2022' },
      { id: 'ca-4', listaOficial: 'Estadual (Bahia)', categoria: 'EN - Em Perigo', atoNormativoAno: 'Portaria INEMA nº 37/2017' },
      { id: 'ca-5', listaOficial: 'CITES', categoria: 'Apêndice I', atoNormativoAno: 'CoP19 / 2023' },
    ],
    ameacada: true,
    exoticaInvasora: false,
    restricoesSoltura: 'Soltura restrita com monitoramento via colar GPS satelital. Proibida soltura sem aprovação formal expressa do Plano de Ação Nacional (PAN) e comissão técnica do INEMA.',
    observacoes: 'Animal topo de cadeia. Exemplares resgatados exigem recinto de alta contenção.',
    statusRegistro: 'definitivo',
    situacao: 'Ativo',
    dataCadastro: '18/01/2024',
  },
  {
    id: 'esp-003',
    codigo: 'ESP-0003',
    nomeCientifico: 'Leopardus pardalis',
    autorAno: '(Linnaeus, 1758)',
    taxonSuperior: false,
    classe: 'Mammalia',
    ordem: 'Carnivora',
    familia: 'Felidae',
    genero: 'Leopardus',
    grupoAnimal: 'Mamíferos',
    nomesPopulares: [
      { id: 'np-7', nome: 'Jaguatirica', principal: true },
      { id: 'np-8', nome: 'Gato-do-mato-grande', principal: false },
    ],
    classificacoesAmeaca: [
      { id: 'ca-6', listaOficial: 'Nacional (MMA)', categoria: 'VU - Vulnerável', atoNormativoAno: 'Portaria MMA nº 148/2022' },
      { id: 'ca-7', listaOficial: 'CITES', categoria: 'Apêndice I', atoNormativoAno: 'CoP19 / 2023' },
    ],
    ameacada: true,
    exoticaInvasora: false,
    restricoesSoltura: 'Requer avaliação comportamental de caça viva e microchipagem obrigatória antes de qualquer transferência ou soltura em ASAS cadastrada.',
    observacoes: 'Espécie sensível a estresse em cativeiro prolongado.',
    statusRegistro: 'definitivo',
    situacao: 'Ativo',
    dataCadastro: '05/02/2024',
  },
  {
    id: 'esp-004',
    codigo: 'ESP-0004',
    nomeCientifico: 'Cyanopsitta spixii',
    autorAno: '(Wagler, 1832)',
    taxonSuperior: false,
    classe: 'Aves',
    ordem: 'Psittaciformes',
    familia: 'Psittacidae',
    genero: 'Cyanopsitta',
    grupoAnimal: 'Aves',
    nomesPopulares: [
      { id: 'np-9', nome: 'Ararinha-azul', principal: true },
    ],
    classificacoesAmeaca: [
      { id: 'ca-8', listaOficial: 'Nacional (MMA)', categoria: 'CR - Criticamente em Perigo', atoNormativoAno: 'Portaria MMA nº 148/2022' },
      { id: 'ca-9', listaOficial: 'Estadual (Bahia)', categoria: 'CR - Criticamente em Perigo', atoNormativoAno: 'Portaria INEMA nº 37/2017' },
      { id: 'ca-10', listaOficial: 'CITES', categoria: 'Apêndice I', atoNormativoAno: 'CoP19 / 2023' },
      { id: 'ca-11', listaOficial: 'IUCN', categoria: 'CR - Criticamente em Perigo', atoNormativoAno: 'Red List 2023' },
    ],
    ameacada: true,
    exoticaInvasora: false,
    restricoesSoltura: 'Soltura exclusivamente vinculada ao Programa Oficial de Reintrodução na Região de Curaçá/BA. Intervenção cirúrgica e protocolo genético obrigatório.',
    observacoes: 'Espécie emblemática da Caatinga com protocolo de segurança máxima de registro no sistema.',
    statusRegistro: 'definitivo',
    situacao: 'Ativo',
    dataCadastro: '20/04/2024',
  },
  {
    id: 'esp-005',
    codigo: 'ESP-0005',
    nomeCientifico: 'Chelonia mydas',
    autorAno: '(Linnaeus, 1758)',
    taxonSuperior: false,
    classe: 'Reptilia',
    ordem: 'Testudines',
    familia: 'Cheloniidae',
    genero: 'Chelonia',
    grupoAnimal: 'Répteis',
    nomesPopulares: [
      { id: 'np-10', nome: 'Tartaruga-verde', principal: true },
      { id: 'np-11', nome: 'Aruanã', principal: false },
    ],
    classificacoesAmeaca: [
      { id: 'ca-12', listaOficial: 'Nacional (MMA)', categoria: 'VU - Vulnerável', atoNormativoAno: 'Portaria MMA nº 148/2022' },
      { id: 'ca-13', listaOficial: 'CITES', categoria: 'Apêndice I', atoNormativoAno: 'CoP19 / 2023' },
      { id: 'ca-14', listaOficial: 'IUCN', categoria: 'EN - Em Perigo', atoNormativoAno: 'Red List 2021' },
    ],
    ameacada: true,
    exoticaInvasora: false,
    restricoesSoltura: 'Soltura apenas em ambiente marinho costeiro baiano, coordenada com centro de reabilitação e monitoramento de telemetria.',
    observacoes: 'Frequente em encalhes no litoral norte e Recôncavo.',
    statusRegistro: 'definitivo',
    situacao: 'Ativo',
    dataCadastro: '14/05/2024',
  },
  {
    id: 'esp-006',
    codigo: 'ESP-0006',
    nomeCientifico: 'Bothrops leucurus',
    autorAno: 'Wagler, 1824',
    taxonSuperior: false,
    classe: 'Reptilia',
    ordem: 'Squamata',
    familia: 'Viperidae',
    genero: 'Bothrops',
    grupoAnimal: 'Répteis',
    nomesPopulares: [
      { id: 'np-12', nome: 'Jararaca-da-seca', principal: true },
      { id: 'np-13', nome: 'Jararaca-do-rabo-branco', principal: false },
      { id: 'np-14', nome: 'Patrona', principal: false },
    ],
    classificacoesAmeaca: [
      { id: 'ca-15', listaOficial: 'IUCN', categoria: 'LC - Menos Preocupante', atoNormativoAno: 'Red List 2021' },
    ],
    ameacada: false,
    exoticaInvasora: false,
    restricoesSoltura: 'Soltura restrita a Unidades de Conservação de Mata Atlântica e áreas de mata contínua distantes de aglomerados populacionais.',
    observacoes: 'Serpente peçonhenta de interesse médico.',
    statusRegistro: 'definitivo',
    situacao: 'Ativo',
    dataCadastro: '28/05/2024',
  },
  {
    id: 'esp-007',
    codigo: 'ESP-0007',
    nomeCientifico: 'Amazona aestiva',
    autorAno: '(Linnaeus, 1758)',
    taxonSuperior: false,
    classe: 'Aves',
    ordem: 'Psittaciformes',
    familia: 'Psittacidae',
    genero: 'Amazona',
    grupoAnimal: 'Aves',
    nomesPopulares: [
      { id: 'np-15', nome: 'Papagaio-verdadeiro', principal: true },
      { id: 'np-16', nome: 'Louro', principal: false },
      { id: 'np-17', nome: 'Papagaio-comum', principal: false },
    ],
    classificacoesAmeaca: [
      { id: 'ca-16', listaOficial: 'CITES', categoria: 'Apêndice II', atoNormativoAno: 'CoP19 / 2023' },
      { id: 'ca-17', listaOficial: 'Nacional (MMA)', categoria: 'LC - Menos Preocupante', atoNormativoAno: 'Portaria MMA nº 148/2022' },
    ],
    ameacada: false,
    exoticaInvasora: false,
    restricoesSoltura: 'Exige teste comportamental para descartar domesticação/humanização crônica. Proibida soltura de aves mutiladas ou não aptas ao voo.',
    observacoes: 'Maior volume de animais sob tutela do INEMA com destinação prioritária para guarda ou ASAS.',
    statusRegistro: 'definitivo',
    situacao: 'Ativo',
    dataCadastro: '02/06/2024',
  },
  {
    id: 'esp-008',
    codigo: 'ESP-0008',
    nomeCientifico: 'Lithobates catesbeianus',
    autorAno: '(Shaw, 1802)',
    taxonSuperior: false,
    classe: 'Amphibia',
    ordem: 'Anura',
    familia: 'Ranidae',
    genero: 'Lithobates',
    grupoAnimal: 'Anfíbios',
    nomesPopulares: [
      { id: 'np-18', nome: 'Rã-touro', principal: true },
      { id: 'np-19', nome: 'Rã-touro-americana', principal: false },
    ],
    classificacoesAmeaca: [
      { id: 'ca-18', listaOficial: 'IUCN', categoria: 'LC - Menos Preocupante', atoNormativoAno: 'Red List 2022' },
    ],
    ameacada: false,
    exoticaInvasora: true,
    restricoesSoltura: 'SOLTURA EXPRESSAMENTE PROIBIDA EM QUALQUER HIPÓTESE. Espécie invasora com alto potencial de predação e transmissão de fungo quitrídio. Destinação exclusiva para eutanásia ou pesquisa.',
    observacoes: 'Espécie introduzida da América do Norte.',
    statusRegistro: 'definitivo',
    situacao: 'Ativo',
    dataCadastro: '15/07/2024',
  },
  {
    id: 'esp-009',
    codigo: 'ESP-0009',
    nomeCientifico: 'Callithrix jacchus',
    autorAno: '(Linnaeus, 1758)',
    taxonSuperior: false,
    classe: 'Mammalia',
    ordem: 'Primates',
    familia: 'Callitrichidae',
    genero: 'Callithrix',
    grupoAnimal: 'Mamíferos',
    nomesPopulares: [
      { id: 'np-20', nome: 'Sagui-de-tufo-branco', principal: true },
      { id: 'np-21', nome: 'Mico-estrela', principal: false },
    ],
    classificacoesAmeaca: [
      { id: 'ca-19', listaOficial: 'CITES', categoria: 'Apêndice II', atoNormativoAno: 'CoP19 / 2023' },
      { id: 'ca-20', listaOficial: 'IUCN', categoria: 'LC - Menos Preocupante', atoNormativoAno: 'Red List 2021' },
    ],
    ameacada: false,
    exoticaInvasora: false,
    restricoesSoltura: 'Permitida soltura somente dentro da bacia hidrográfica de distribuição nativa histórica. Proibida translocação para áreas com Callithrix aurita ou Callithrix flaviceps.',
    observacoes: 'Muito comum em centros urbanos baianos.',
    statusRegistro: 'definitivo',
    situacao: 'Ativo',
    dataCadastro: '10/08/2024',
  },
  {
    id: 'esp-010',
    codigo: 'ESP-0010',
    nomeCientifico: 'Alouatta',
    autorAno: 'Lacépède, 1799',
    taxonSuperior: true,
    classe: 'Mammalia',
    ordem: 'Primates',
    familia: 'Atelidae',
    genero: 'Alouatta',
    grupoAnimal: 'Mamíferos',
    nomesPopulares: [
      { id: 'np-22', nome: 'Bugio (gênero)', principal: true },
      { id: 'np-23', nome: 'Guariba', principal: false },
    ],
    classificacoesAmeaca: [],
    ameacada: false,
    exoticaInvasora: false,
    restricoesSoltura: 'Necessária identificação definitiva em nível de espécie e laudo virológico para febre amarela antes de qualquer deliberação de destinação ou soltura.',
    observacoes: 'Cadastro em nível taxonômico superior provisório para filhotes em quarentena sem confirmação morfológica da espécie.',
    statusRegistro: 'rascunho',
    situacao: 'Ativo',
    dataCadastro: '01/09/2024',
  },
];

// ============================================================================
// DR004 — UNIDADES E DESTINOS
// ============================================================================

export type NaturezaUnidade = 'Unidade do INEMA' | 'Destino externo';

export interface TipoUnidadeItem {
  id: string;
  nome: string;
  natureza: NaturezaUnidade;
  permiteAdmissao: boolean;
  permiteDestinacao: boolean;
  permiteRecintos: boolean;
  situacao: 'Ativo' | 'Inativo';
}

export interface UnidadeItem {
  id: string;
  tipoUnidadeId: string;
  tipoUnidadeNome: string;
  nome: string;
  municipio: string;
  uf: string;
  responsavel: string;
  telefone: string;
  email: string;
  natureza: NaturezaUnidade;
  // Campos exclusivos para Destino Externo
  cpfCnpj?: string;
  razaoSocial?: string;
  endereco?: string;
  latitude?: string;
  longitude?: string;
  restricoesDestino?: string;
  situacao: 'Ativo' | 'Inativo';
  dataCadastro: string;
}

export const MOCK_TIPOS_UNIDADE: TipoUnidadeItem[] = [
  {
    id: 'tu-01',
    nome: 'CETAS - Centro de Triagem de Animais Silvestres',
    natureza: 'Unidade do INEMA',
    permiteAdmissao: true,
    permiteDestinacao: true,
    permiteRecintos: true,
    situacao: 'Ativo',
  },
  {
    id: 'tu-02',
    nome: 'Zoológico Municipal ou Estadual',
    natureza: 'Destino externo',
    permiteAdmissao: false,
    permiteDestinacao: true,
    permiteRecintos: true,
    situacao: 'Ativo',
  },
  {
    id: 'tu-03',
    nome: 'ASAS - Área de Soltura de Animais Silvestres',
    natureza: 'Destino externo',
    permiteAdmissao: false,
    permiteDestinacao: true,
    permiteRecintos: false,
    situacao: 'Ativo',
  },
  {
    id: 'tu-04',
    nome: 'Criatório Conservacionista',
    natureza: 'Destino externo',
    permiteAdmissao: false,
    permiteDestinacao: true,
    permiteRecintos: true,
    situacao: 'Ativo',
  },
  {
    id: 'tu-05',
    nome: 'Base Operacional Regional INEMA',
    natureza: 'Unidade do INEMA',
    permiteAdmissao: true,
    permiteDestinacao: true,
    permiteRecintos: false,
    situacao: 'Ativo',
  },
];

export const MOCK_UNIDADES: UnidadeItem[] = [
  {
    id: 'und-01',
    tipoUnidadeId: 'tu-01',
    tipoUnidadeNome: 'CETAS - Centro de Triagem de Animais Silvestres',
    nome: 'CETAS Salvador (Cabula)',
    municipio: 'Salvador',
    uf: 'BA',
    responsavel: 'Dra. Gabriela Santos - CRMV/BA 4821',
    telefone: '(71) 3117-1234',
    email: 'cetas.salvador@inema.ba.gov.br',
    natureza: 'Unidade do INEMA',
    situacao: 'Ativo',
    dataCadastro: '15/01/2024',
  },
  {
    id: 'und-02',
    tipoUnidadeId: 'tu-01',
    tipoUnidadeNome: 'CETAS - Centro de Triagem de Animais Silvestres',
    nome: 'CETAS Porto Seguro (Costa do Descobrimento)',
    municipio: 'Porto Seguro',
    uf: 'BA',
    responsavel: 'Dr. Rodrigo Mendes - Biólogo CRBio 18942',
    telefone: '(73) 3288-5678',
    email: 'cetas.portoseguro@inema.ba.gov.br',
    natureza: 'Unidade do INEMA',
    situacao: 'Ativo',
    dataCadastro: '20/02/2024',
  },
  {
    id: 'und-03',
    tipoUnidadeId: 'tu-02',
    tipoUnidadeNome: 'Zoológico Municipal ou Estadual',
    nome: 'Parque Zoobotânico Getúlio Vargas (Zoo de Salvador)',
    municipio: 'Salvador',
    uf: 'BA',
    responsavel: 'Dr. Vinícius Dantas - CRMV/BA 3110',
    telefone: '(71) 3116-7954',
    email: 'zoologico.salvador@inema.ba.gov.br',
    natureza: 'Destino externo',
    cpfCnpj: '13.937.071/0001-90',
    razaoSocial: 'Estado da Bahia - Secretaria do Meio Ambiente',
    endereco: 'Rua Alto de Ondina, s/n, Ondina, Salvador - BA, CEP 40170-110',
    latitude: '-13.0078',
    longitude: '-38.5086',
    restricoesDestino: 'Recebimento condicionado à autorização prévia da coordenação médica e vagas em quarentenário.',
    situacao: 'Ativo',
    dataCadastro: '10/03/2024',
  },
  {
    id: 'und-04',
    tipoUnidadeId: 'tu-03',
    tipoUnidadeNome: 'ASAS - Área de Soltura de Animais Silvestres',
    nome: 'ASAS Fazenda Boa Esperança (Bacia do Paraguaçu)',
    municipio: 'Andaraí',
    uf: 'BA',
    responsavel: 'Carlos Eduardo Oliveira - Proprietário / Gestor Ambiental',
    telefone: '(75) 99876-5432',
    email: 'boaesperanca.asas@chapada.org.br',
    natureza: 'Destino externo',
    cpfCnpj: '123.456.789-00',
    razaoSocial: 'Fazenda Boa Esperança Agropecuária e Preservação',
    endereco: 'Rodovia BA-142, Km 45, Zona Rural, Andaraí - BA, CEP 46830-000',
    latitude: '-12.8021',
    longitude: '-41.3312',
    restricoesDestino: 'Autorizada exclusivamente para soltura e reabilitação de aves da Caatinga e mamíferos de pequeno porte.',
    situacao: 'Ativo',
    dataCadastro: '05/04/2024',
  },
  {
    id: 'und-05',
    tipoUnidadeId: 'tu-04',
    tipoUnidadeNome: 'Criatório Conservacionista',
    nome: 'Criadouro Conservacionista Canto da Mata',
    municipio: 'Feira de Santana',
    uf: 'BA',
    responsavel: 'Renata Albuquerque - Bióloga Responsável',
    telefone: '(75) 3221-9988',
    email: 'cantodamata@conservacao.org.br',
    natureza: 'Destino externo',
    cpfCnpj: '22.334.556/0001-77',
    razaoSocial: 'Instituto Canto da Mata de Proteção à Fauna',
    endereco: 'Estrada do Papagaio, S/N, Fazenda Morada, Feira de Santana - BA',
    latitude: '-12.2667',
    longitude: '-38.9667',
    restricoesDestino: 'Foco exclusivo em Psittaciformes e Passeriformes ameaçados da Bahia.',
    situacao: 'Ativo',
    dataCadastro: '18/05/2024',
  },
];

// ============================================================================
// DR007 — DOCUMENTOS E TERMOS
// ============================================================================

export type NaturezaDocTermo = 'Documento anexado' | 'Termo emitido';

export interface VersaoAnteriorItem {
  versao: string;
  dataCriacao: string;
  modeloTermo?: string;
  motivoAtualizacao?: string;
}

export interface DocumentoTermoItem {
  id: string;
  nome: string;
  natureza: NaturezaDocTermo;
  descricao?: string;
  unidadesAplicaveis: 'todas' | string[]; // 'todas' ou IDs de unidades
  anexoObrigatorio: boolean;
  // Campos para Termo emitido
  modeloTermo?: string;
  versaoVigente: string;
  inicioVigencia?: string;
  validadeDias?: number; // em DIAS conforme Regra de Ouro
  exigeAssinatura: boolean;
  formaAssinatura?: 'Digital Gov.br' | 'Upload assinado' | 'Ambas';
  signatarios?: string[];
  situacao: 'Ativo' | 'Inativo';
  dataCadastro: string;
  travadoEdicao: boolean;
  historicoVersoes?: VersaoAnteriorItem[];
}

export const MOCK_DOCUMENTOS_TERMOS: DocumentoTermoItem[] = [
  {
    id: 'doc-01',
    nome: 'Termo de Entrega Voluntária de Animal Silvestre (TEVAS)',
    natureza: 'Termo emitido',
    descricao: 'Emitido no ato do recebimento voluntário pelo cidadão, atestando a isenção de sanções penais/administrativas.',
    unidadesAplicaveis: 'todas',
    anexoObrigatorio: false,
    modeloTermo: 'Pelo presente termo, o(a) Sr.(a) [NOME_ENTREGADOR], CPF [CPF_ENTREGADOR], faz a entrega voluntária do animal [ESPECIE_ANIMAL], código [CODIGO_ANIMAL], ao CETAS/INEMA em [DATA_ATUAL]. Conforme Art. 24 do Decreto Federal nº 6.514/2008, a entrega espontânea elide a aplicação de multa.',
    versaoVigente: 'v1.2',
    inicioVigencia: '01/01/2024',
    validadeDias: 365,
    exigeAssinatura: true,
    formaAssinatura: 'Digital Gov.br',
    signatarios: ['Entregador / Cidadão', 'Técnico Responsável do INEMA'],
    situacao: 'Ativo',
    dataCadastro: '02/01/2024',
    travadoEdicao: true,
    historicoVersoes: [
      {
        versao: 'v1.1',
        dataCriacao: '15/10/2023',
        modeloTermo: 'Pelo presente termo, o(a) entregador(a) faz entrega do animal silvestre ao INEMA na data de [DATA_ATUAL].',
        motivoAtualizacao: 'Inclusão de fundamentação jurídica do Art. 24 do Decreto Federal nº 6.514/2008.',
      },
      {
        versao: 'v1.0',
        dataCriacao: '01/06/2023',
        modeloTermo: 'Termo simplificado de entrega de espécime ao CETAS.',
        motivoAtualizacao: 'Versão inicial homologada.',
      },
    ],
  },
  {
    id: 'doc-02',
    nome: 'Termo de Apreensão e Depósito de Animais (TADA)',
    natureza: 'Termo emitido',
    descricao: 'Lavrado pela fiscalização ambiental (POLÍCIA MILITAR / COPPA / DIFIS) no flagrante de tráfico ou cativeiro irregular.',
    unidadesAplicaveis: 'todas',
    anexoObrigatorio: false,
    modeloTermo: 'Certifico que nesta data foi apreendido o espécime [ESPECIE_ANIMAL] em poder de [AUTUADO], ficando o mesmo depositado sob guarda do [UNIDADE_INEMA] para triagem e destinação.',
    versaoVigente: 'v2.0',
    inicioVigencia: '15/02/2024',
    validadeDias: 180,
    exigeAssinatura: true,
    formaAssinatura: 'Digital Gov.br',
    signatarios: ['Agente Autuante', 'Fiel Depositário INEMA'],
    situacao: 'Ativo',
    dataCadastro: '15/02/2024',
    travadoEdicao: true,
    historicoVersoes: [
      {
        versao: 'v1.0',
        dataCriacao: '10/01/2023',
        modeloTermo: 'Auto de apreensão e entrega provisória de espécimes sob fiscalização.',
        motivoAtualizacao: 'Atualização do texto base para integração com o módulo DIFIS.',
      },
    ],
  },
  {
    id: 'doc-03',
    nome: 'Laudo Veterinário de Admissão e Triagem',
    natureza: 'Documento anexado',
    descricao: 'Ficha clínica detalhada preenchida pelo médico veterinário com histórico, biometria e prognóstico do animal.',
    unidadesAplicaveis: ['und-01', 'und-02'],
    anexoObrigatorio: true,
    versaoVigente: 'v1.0',
    exigeAssinatura: false,
    situacao: 'Ativo',
    dataCadastro: '20/02/2024',
    travadoEdicao: true,
  },
  {
    id: 'doc-04',
    nome: 'Guia de Trânsito Animal (GTA / SISFAUNA)',
    natureza: 'Documento anexado',
    descricao: 'Documento oficial de transporte interestadual ou intermunicipal emitido pela ADAB / MAPA.',
    unidadesAplicaveis: 'todas',
    anexoObrigatorio: true,
    versaoVigente: 'v1.0',
    exigeAssinatura: false,
    situacao: 'Ativo',
    dataCadastro: '01/03/2024',
    travadoEdicao: true,
  },
  {
    id: 'doc-05',
    nome: 'Termo de Soltura e Monitoramento em ASAS',
    natureza: 'Termo emitido',
    descricao: 'Autoriza e formaliza a soltura de grupo de animais reabilitados em área de soltura cadastrada.',
    unidadesAplicaveis: ['und-01', 'und-02', 'und-04'],
    anexoObrigatorio: false,
    modeloTermo: 'Autorizo a soltura técnica de [QUANTIDADE] espécimes da espécie [ESPECIE] na propriedade [ASAS_DESTINO], após cumprimento integral do protocolo sanitário e quarentena.',
    versaoVigente: 'v1.1',
    inicioVigencia: '10/03/2024',
    validadeDias: 60,
    exigeAssinatura: true,
    formaAssinatura: 'Ambas',
    signatarios: ['Coordenador CETAS', 'Responsável Técnico ASAS', 'Fiscal INEMA'],
    situacao: 'Ativo',
    dataCadastro: '10/03/2024',
    travadoEdicao: true,
    historicoVersoes: [
      {
        versao: 'v1.0',
        dataCriacao: '05/01/2024',
        modeloTermo: 'Termo de autorização de soltura em área cadastrada.',
        motivoAtualizacao: 'Versão piloto de soltura.',
      },
    ],
  },
];

// ============================================================================
// DR003 — PROCEDÊNCIA ANIMAL
// ============================================================================

export type TipoProcedencia = 'Entrega voluntária' | 'Apreensão' | 'Resgate' | 'Transferência';

export interface ProcedenciaItem {
  id: string;
  tipo: TipoProcedencia;
  subtipo: string;
  descricaoUso?: string;
  observacoes?: string;
  subtipoPadrao: boolean;
  exigeOrgaoInstituicao: boolean;
  exigeResponsavel: boolean;
  exigeUnidadeOrigem: boolean; // Habilitado SOMENTE se tipo === 'Transferência'
  exigeObservacao: boolean;
  orgaosPermitidos?: string[];
  documentosExigidos?: string[]; // IDs de doc-termo
  codigoSiscetas?: string;
  situacao: 'Ativo' | 'Inativo';
  dataCadastro: string;
}

export const MOCK_PROCEDENCIAS: ProcedenciaItem[] = [
  {
    id: 'proc-01',
    tipo: 'Entrega voluntária',
    subtipo: 'Entrega Espontânea por Cidadão',
    descricaoUso: 'Quando o cidadão comparece espontaneamente ao CETAS para entregar espécime mantido em cativeiro doméstico.',
    observacoes: 'Isenção de multa conforme termo próprio.',
    subtipoPadrao: true,
    exigeOrgaoInstituicao: false,
    exigeResponsavel: true,
    exigeUnidadeOrigem: false,
    exigeObservacao: true,
    documentosExigidos: ['doc-01'],
    codigoSiscetas: 'EV-CID-01',
    situacao: 'Ativo',
    dataCadastro: '10/01/2024',
  },
  {
    id: 'proc-02',
    tipo: 'Apreensão',
    subtipo: 'Operação Policial / Fiscalização Ambiental',
    descricaoUso: 'Espécimes apreendidos pela COPPA, Polícia Rodoviária Federal, Polícia Civil ou fiscais do INEMA.',
    subtipoPadrao: true,
    exigeOrgaoInstituicao: true,
    exigeResponsavel: true,
    exigeUnidadeOrigem: false,
    exigeObservacao: true,
    orgaosPermitidos: ['COPPA - Polícia Militar da Bahia', 'PRF - Polícia Rodoviária Federal', 'DIFIS / INEMA', 'IBAMA'],
    documentosExigidos: ['doc-02'],
    codigoSiscetas: 'APR-POL-02',
    situacao: 'Ativo',
    dataCadastro: '12/01/2024',
  },
  {
    id: 'proc-03',
    tipo: 'Resgate',
    subtipo: 'Resgate em Área Urbana ou Rodovia (Acidentado/Ferido)',
    descricaoUso: 'Animal recolhido em situação de risco, choque elétrico em fiação, atropelamento ou invasão de domicílio.',
    subtipoPadrao: true,
    exigeOrgaoInstituicao: false,
    exigeResponsavel: true,
    exigeUnidadeOrigem: false,
    exigeObservacao: true,
    documentosExigidos: ['doc-03'],
    codigoSiscetas: 'RES-URB-03',
    situacao: 'Ativo',
    dataCadastro: '15/01/2024',
  },
  {
    id: 'proc-04',
    tipo: 'Transferência',
    subtipo: 'Transferência entre CETAS do INEMA',
    descricaoUso: 'Remoção planejada de animais entre unidades de triagem do Estado da Bahia para balanceamento de recintos.',
    subtipoPadrao: true,
    exigeOrgaoInstituicao: true,
    exigeResponsavel: true,
    exigeUnidadeOrigem: true, // Habilitado por ser Transferência
    exigeObservacao: true,
    orgaosPermitidos: ['INEMA - Diretoria de Biodiversidade'],
    documentosExigidos: ['doc-03', 'doc-04'],
    codigoSiscetas: 'TRA-INT-04',
    situacao: 'Ativo',
    dataCadastro: '20/01/2024',
  },
  {
    id: 'proc-05',
    tipo: 'Transferência',
    subtipo: 'Transferência Interestadual (Outro Estado/IBAMA)',
    descricaoUso: 'Recebimento de animais vindos de CETAS de outras unidades federativas com autorização prévia.',
    subtipoPadrao: false,
    exigeOrgaoInstituicao: true,
    exigeResponsavel: true,
    exigeUnidadeOrigem: true,
    exigeObservacao: true,
    orgaosPermitidos: ['IBAMA', 'SEMAD-MG', 'CPRH-PE', 'IDEMA-RN'],
    documentosExigidos: ['doc-04'],
    codigoSiscetas: 'TRA-EXT-05',
    situacao: 'Ativo',
    dataCadastro: '25/01/2024',
  },
];

// ============================================================================
// DR005 — RECINTOS E ÁREAS
// ============================================================================

export type EstadoSanitarioRecinto = 'Adequado' | 'Em Desinfecção' | 'Quarentena Sanitária' | 'Contaminado';
export type SituacaoOperacionalRecinto = 'Disponível' | 'Quase Lotado' | 'Lotado' | 'Indisponível';

export interface RecintoItem {
  id: string;
  codigo: string; // REC-NNNN
  nomeLocal: string;
  unidadeId: string;
  unidadeNome: string;
  tipoRecinto: 'Quarentena' | 'Triagem' | 'Reabilitação' | 'Berçário' | 'Recinto de Exposição' | 'Clínica Veterinária';
  areaM2: number;
  capacidade: number; // Obrigatório se Zoo, opcional para CETAS
  especiesPermitidas?: string[]; // IDs de espécies (OBG se Zoo)
  possuiRestricao: boolean;
  estadoSanitario: EstadoSanitarioRecinto;
  ocupacaoAtual: number; // Calculado somente leitura
  situacaoOperacional: SituacaoOperacionalRecinto; // Calculado somente leitura
  observacao?: string; // Obras e reformas registradas aqui conforme Regra de Ouro
  situacao: 'Ativo' | 'Inativo';
  dataCadastro: string;
}

export const MOCK_RECINTOS: RecintoItem[] = [
  {
    id: 'rec-01',
    codigo: 'REC-0001',
    nomeLocal: 'Gaiolão de Psittaciformes 01 (Quarentenário A)',
    unidadeId: 'und-01',
    unidadeNome: 'CETAS Salvador (Cabula)',
    tipoRecinto: 'Quarentena',
    areaM2: 45.5,
    capacidade: 20,
    especiesPermitidas: ['esp-001', 'esp-004', 'esp-007'],
    possuiRestricao: true,
    estadoSanitario: 'Adequado',
    ocupacaoAtual: 14,
    situacaoOperacional: 'Disponível',
    observacao: 'Recinto telado duplo com barreira anti-roedores e controle microbiológico rigoroso.',
    situacao: 'Ativo',
    dataCadastro: '01/02/2024',
  },
  {
    id: 'rec-02',
    codigo: 'REC-0002',
    nomeLocal: 'VIVEIRO DE REABILITAÇÃO E VOO (ÁREA EXTERNA)',
    unidadeId: 'und-01',
    unidadeNome: 'CETAS Salvador (Cabula)',
    tipoRecinto: 'Reabilitação',
    areaM2: 120.0,
    capacidade: 30,
    especiesPermitidas: ['esp-001', 'esp-007'],
    possuiRestricao: false,
    estadoSanitario: 'Adequado',
    ocupacaoAtual: 28,
    situacaoOperacional: 'Quase Lotado',
    observacao: 'Viveiro circular de 25m de comprimento próprio para fortalecimento peitoral de araras e papagaios pré-soltura.',
    situacao: 'Ativo',
    dataCadastro: '05/02/2024',
  },
  {
    id: 'rec-03',
    codigo: 'REC-0003',
    nomeLocal: 'Recinto de Carnívoros de Grande Porte (Onça-Pintada)',
    unidadeId: 'und-03',
    unidadeNome: 'Parque Zoobotânico Getúlio Vargas (Zoo de Salvador)',
    tipoRecinto: 'Recinto de Exposição',
    areaM2: 380.0,
    capacidade: 2,
    especiesPermitidas: ['esp-002'],
    possuiRestricao: true,
    estadoSanitario: 'Adequado',
    ocupacaoAtual: 1,
    situacaoOperacional: 'Disponível',
    observacao: 'Fosso com água, muro de contenção de 4 metros e área de cambamento duplo.',
    situacao: 'Ativo',
    dataCadastro: '10/02/2024',
  },
  {
    id: 'rec-04',
    codigo: 'REC-0004',
    nomeLocal: 'Quarentena de Répteis e Serpentes Peçonhentas',
    unidadeId: 'und-01',
    unidadeNome: 'CETAS Salvador (Cabula)',
    tipoRecinto: 'Quarentena',
    areaM2: 22.0,
    capacidade: 12,
    especiesPermitidas: ['esp-006'],
    possuiRestricao: true,
    estadoSanitario: 'Quarentena Sanitária',
    ocupacaoAtual: 6,
    situacaoOperacional: 'Disponível',
    observacao: 'Caixas de policarbonato com fechamento e trava hermética.',
    situacao: 'Ativo',
    dataCadastro: '15/02/2024',
  },
  {
    id: 'rec-05',
    codigo: 'REC-0005',
    nomeLocal: 'Berçário de Mamíferos e Primatas Órfãos',
    unidadeId: 'und-02',
    unidadeNome: 'CETAS Porto Seguro (Costa do Descobrimento)',
    tipoRecinto: 'Berçário',
    areaM2: 30.0,
    capacidade: 8,
    especiesPermitidas: ['esp-009', 'esp-010'],
    possuiRestricao: false,
    estadoSanitario: 'Em Desinfecção',
    ocupacaoAtual: 0,
    situacaoOperacional: 'Indisponível',
    observacao: 'Em processo de desinfecção terminal com amônia quaternária para receber novo lote de filhotes.',
    situacao: 'Ativo',
    dataCadastro: '01/03/2024',
  },
];

// ============================================================================
// DR006 — TIPOS DE MANEJO
// ============================================================================

export interface CampoAdicionalManejo {
  id: string;
  nome: string;
  tipoDado: 'Texto' | 'Numérico' | 'Data' | 'Seleção' | 'Booleano';
  unidadeMedida?: string;
  obrigatorio: boolean;
  ordemExibicao: number;
}

export interface TipoManejoItem {
  id: string;
  nome: string;
  descricao?: string;
  permiteMultiplosAnimais: boolean; // Padrão DESLIGADO (RN-004)
  exigeAnexo: boolean; // Padrão DESLIGADO (RN-002)
  documentosExigidos?: string[]; // IDs de doc-termo
  exigeTermo: boolean; // Padrão DESLIGADO (RN-003)
  termoExigidoId?: string;
  termoExigidoNome?: string;
  camposAdicionais: CampoAdicionalManejo[];
  situacao: 'Ativo' | 'Inativo';
  dataCadastro: string;
}

export const MOCK_TIPOS_MANEJO: TipoManejoItem[] = [
  {
    id: 'man-01',
    nome: 'Avaliação Clínica e Biométrica Inicial',
    descricao: 'Exame físico completo, pesagem, aferição de medidas biométricas e registro de escore corporal.',
    permiteMultiplosAnimais: false,
    exigeAnexo: true,
    documentosExigidos: ['doc-03'],
    exigeTermo: false,
    camposAdicionais: [
      { id: 'ca-1', nome: 'Peso Corporal', tipoDado: 'Numérico', unidadeMedida: 'gramas', obrigatorio: true, ordemExibicao: 1 },
      { id: 'ca-2', nome: 'Escore Corporal (1 a 5)', tipoDado: 'Seleção', obrigatorio: true, ordemExibicao: 2 },
      { id: 'ca-3', nome: 'Envergadura Alar / Comprimento', tipoDado: 'Numérico', unidadeMedida: 'cm', obrigatorio: false, ordemExibicao: 3 },
      { id: 'ca-4', nome: 'Sinais de Desidratação', tipoDado: 'Booleano', obrigatorio: true, ordemExibicao: 4 },
    ],
    situacao: 'Ativo',
    dataCadastro: '10/01/2024',
  },
  {
    id: 'man-02',
    nome: 'Aplicação de Marcação Física (Anilhamento / Microchipagem)',
    descricao: 'Implantação de transponder microchip estéril intramuscular ou colocação de anilha metálica oficial.',
    permiteMultiplosAnimais: false,
    exigeAnexo: false,
    exigeTermo: false,
    camposAdicionais: [
      { id: 'ca-5', nome: 'Número Gravado na Anilha/Microchip', tipoDado: 'Texto', obrigatorio: true, ordemExibicao: 1 },
      { id: 'ca-6', nome: 'Local Anatômico da Aplicação', tipoDado: 'Texto', obrigatorio: true, ordemExibicao: 2 },
      { id: 'ca-7', nome: 'Diâmetro da Anilha (mm)', tipoDado: 'Numérico', unidadeMedida: 'mm', obrigatorio: false, ordemExibicao: 3 },
    ],
    situacao: 'Ativo',
    dataCadastro: '15/01/2024',
  },
  {
    id: 'man-03',
    nome: 'Transferência de Recinto Interna',
    descricao: 'Movimentação física do animal entre diferentes recintos e setores da mesma unidade do INEMA.',
    permiteMultiplosAnimais: true, // Manejo em lote permitido
    exigeAnexo: false,
    exigeTermo: false,
    camposAdicionais: [
      { id: 'ca-8', nome: 'Motivo da Movimentação', tipoDado: 'Texto', obrigatorio: true, ordemExibicao: 1 },
      { id: 'ca-9', nome: 'Recinto de Destino', tipoDado: 'Texto', obrigatorio: true, ordemExibicao: 2 },
    ],
    situacao: 'Ativo',
    dataCadastro: '20/01/2024',
  },
  {
    id: 'man-04',
    nome: 'Soltura Monitorada em Natureza (ASAS)',
    descricao: 'Procedimento final de reintegração do animal reabilitado ao seu bioma de ocorrência natural.',
    permiteMultiplosAnimais: true,
    exigeAnexo: true,
    documentosExigidos: ['doc-05'],
    exigeTermo: true,
    termoExigidoId: 'doc-05',
    termoExigidoNome: 'Termo de Soltura e Monitoramento em ASAS',
    camposAdicionais: [
      { id: 'ca-10', nome: 'Coordenadas do Ponto de Soltura (GPS)', tipoDado: 'Texto', obrigatorio: true, ordemExibicao: 1 },
      { id: 'ca-11', nome: 'Método de Soltura (Branda / Rápida)', tipoDado: 'Seleção', obrigatorio: true, ordemExibicao: 2 },
      { id: 'ca-12', nome: 'Previsão de Monitoramento Pós-Soltura', tipoDado: 'Numérico', unidadeMedida: 'dias', obrigatorio: true, ordemExibicao: 3 },
    ],
    situacao: 'Ativo',
    dataCadastro: '25/01/2024',
  },
];

// ============================================================================
// DR001 — ANIMAIS (BASE ÚNICA DE FAUNA)
// ============================================================================

export type StatusAnimal = 'Em Quarentena' | 'Em Tratamento' | 'Apto para Soltura' | 'Destinado' | 'Óbito';
export type SexoAnimal = 'Macho' | 'Fêmea' | 'Indeterminado';
export type FaixaEtariaAnimal = 'Filhote' | 'Jovem' | 'Adulto' | 'Senil' | 'Indeterminada';

export interface MarcacaoFisicaItem {
  id: string;
  tipo: 'Microchip' | 'Anilha' | 'Tatuagem' | 'Brinco' | 'Colar';
  numero: string;
  dataAplicacao: string;
  situacao: 'Ativa' | 'Perdida' | 'Danificada';
}

export interface AnimalItem {
  id: string;
  codigo: string; // UR-XXX-000001 (Somente leitura gerado)
  unidadeRegional: string;
  identificacaoComplementar?: string;
  especieId: string;
  especieNomeCientifico: string;
  especieNomePopular: string;
  grupoAnimal: GrupoAnimal;
  identificacaoAConfirmar: boolean;
  sexo: SexoAnimal;
  faixaEtaria: FaixaEtariaAnimal;
  origemUf: string;
  origemMunicipio: string;
  marcacoesFisicas: MarcacaoFisicaItem[];
  unidadeAtualId: string;
  unidadeAtualNome: string;
  procedenciaId: string;
  procedenciaNome: string;
  status: StatusAnimal;
  sigilo: boolean; // Padrão DESLIGADO, restrito Gestor
  justificativaSigilo?: string;
  candidatoGuarda: boolean; // Padrão DESLIGADO, restrito Gestor
  observacoes?: string;
  dataAdmissao: string;
  situacao: 'Ativo' | 'Inativo';
}

export const MOCK_ANIMAIS: AnimalItem[] = [
  {
    id: 'ani-001',
    codigo: 'UR-MET-000001',
    unidadeRegional: 'UR Metropolitana (Salvador)',
    identificacaoComplementar: 'Canindé Dócil Resgatada',
    especieId: 'esp-001',
    especieNomeCientifico: 'Ara ararauna',
    especieNomePopular: 'Arara-canindé',
    grupoAnimal: 'Aves',
    identificacaoAConfirmar: false,
    sexo: 'Fêmea',
    faixaEtaria: 'Adulto',
    origemUf: 'BA',
    origemMunicipio: 'Camaçari',
    marcacoesFisicas: [
      { id: 'mf-1', tipo: 'Anilha', numero: 'INEMA-BA-2024-8841', dataAplicacao: '15/02/2024', situacao: 'Ativa' },
      { id: 'mf-2', tipo: 'Microchip', numero: '981098102345678', dataAplicacao: '15/02/2024', situacao: 'Ativa' },
    ],
    unidadeAtualId: 'und-01',
    unidadeAtualNome: 'CETAS Salvador (Cabula)',
    procedenciaId: 'proc-01',
    procedenciaNome: 'Entrega voluntária · Entrega Espontânea por Cidadão',
    status: 'Apto para Soltura',
    sigilo: false,
    candidatoGuarda: false,
    observacoes: 'Animal com excelente empenamento e vôo vigoroso no viveiro de reabilitação. Triagem sorológica negativa para clamidiose.',
    dataAdmissao: '12/02/2024',
    situacao: 'Ativo',
  },
  {
    id: 'ani-002',
    codigo: 'UR-SUL-000002',
    unidadeRegional: 'UR Sul (Ilhéus / Porto Seguro)',
    identificacaoComplementar: 'Jaguatirica Macho Atropelada',
    especieId: 'esp-003',
    especieNomeCientifico: 'Leopardus pardalis',
    especieNomePopular: 'Jaguatirica',
    grupoAnimal: 'Mamíferos',
    identificacaoAConfirmar: false,
    sexo: 'Macho',
    faixaEtaria: 'Jovem',
    origemUf: 'BA',
    origemMunicipio: 'Eunápolis',
    marcacoesFisicas: [
      { id: 'mf-3', tipo: 'Microchip', numero: '981098109876543', dataAplicacao: '22/03/2024', situacao: 'Ativa' },
    ],
    unidadeAtualId: 'und-02',
    unidadeAtualNome: 'CETAS Porto Seguro (Costa do Descobrimento)',
    procedenciaId: 'proc-03',
    procedenciaNome: 'Resgate · Resgate em Área Urbana ou Rodovia (Acidentado/Ferido)',
    status: 'Em Tratamento',
    sigilo: false,
    candidatoGuarda: false,
    observacoes: 'Recuperando de fratura consolidada de fêmur esquerdo. Fisioterapia veterinária em andamento.',
    dataAdmissao: '20/03/2024',
    situacao: 'Ativo',
  },
  {
    id: 'ani-003',
    codigo: 'UR-OES-000003',
    unidadeRegional: 'UR Oeste (Barreiras)',
    identificacaoComplementar: 'Ararinha Cativeiro Apreensão COPPA',
    especieId: 'esp-004',
    especieNomeCientifico: 'Cyanopsitta spixii',
    especieNomePopular: 'Ararinha-azul',
    grupoAnimal: 'Aves',
    identificacaoAConfirmar: false,
    sexo: 'Indeterminado',
    faixaEtaria: 'Jovem',
    origemUf: 'BA',
    origemMunicipio: 'Curaçá',
    marcacoesFisicas: [
      { id: 'mf-4', tipo: 'Anilha', numero: 'C-SPIXII-BA-001', dataAplicacao: '05/04/2024', situacao: 'Ativa' },
    ],
    unidadeAtualId: 'und-01',
    unidadeAtualNome: 'CETAS Salvador (Cabula)',
    procedenciaId: 'proc-02',
    procedenciaNome: 'Apreensão · Operação Policial / Fiscalização Ambiental',
    status: 'Em Quarentena',
    sigilo: true,
    justificativaSigilo: 'Espécie criticamente ameaçada (CR) com programa federal sigiloso de reprodução em cativeiro com o ICMBio.',
    candidatoGuarda: false,
    observacoes: 'Isolamento microbiológico total na quarentena de alta segurança do CETAS.',
    dataAdmissao: '04/04/2024',
    situacao: 'Ativo',
  },
  {
    id: 'ani-004',
    codigo: 'UR-MET-000004',
    unidadeRegional: 'UR Metropolitana (Salvador)',
    identificacaoComplementar: 'Tartaruga Encalhada com Linha de Pesca',
    especieId: 'esp-005',
    especieNomeCientifico: 'Chelonia mydas',
    especieNomePopular: 'Tartaruga-verde',
    grupoAnimal: 'Répteis',
    identificacaoAConfirmar: false,
    sexo: 'Fêmea',
    faixaEtaria: 'Subadulto' as any,
    origemUf: 'BA',
    origemMunicipio: 'Lauro de Freitas',
    marcacoesFisicas: [
      { id: 'mf-5', tipo: 'Anilha', numero: 'TAMAR-BA-9921', dataAplicacao: '10/05/2024', situacao: 'Ativa' },
    ],
    unidadeAtualId: 'und-01',
    unidadeAtualNome: 'CETAS Salvador (Cabula)',
    procedenciaId: 'proc-03',
    procedenciaNome: 'Resgate · Resgate em Área Urbana ou Rodovia (Acidentado/Ferido)',
    status: 'Em Tratamento',
    sigilo: false,
    candidatoGuarda: false,
    observacoes: 'Acompanhamento conjunto com o Projeto TAMAR em tanque de reabilitação.',
    dataAdmissao: '09/05/2024',
    situacao: 'Ativo',
  },
  {
    id: 'ani-005',
    codigo: 'UR-MET-000005',
    unidadeRegional: 'UR Metropolitana (Salvador)',
    identificacaoComplementar: 'Papagaio Doméstico Falador',
    especieId: 'esp-007',
    especieNomeCientifico: 'Amazona aestiva',
    especieNomePopular: 'Papagaio-verdadeiro',
    grupoAnimal: 'Aves',
    identificacaoAConfirmar: false,
    sexo: 'Macho',
    faixaEtaria: 'Senil',
    origemUf: 'BA',
    origemMunicipio: 'Salvador',
    marcacoesFisicas: [
      { id: 'mf-6', tipo: 'Anilha', numero: 'INEMA-BA-2024-3310', dataAplicacao: '18/06/2024', situacao: 'Ativa' },
    ],
    unidadeAtualId: 'und-01',
    unidadeAtualNome: 'CETAS Salvador (Cabula)',
    procedenciaId: 'proc-01',
    procedenciaNome: 'Entrega voluntária · Entrega Espontânea por Cidadão',
    status: 'Destinado',
    sigilo: false,
    candidatoGuarda: true, // Candidato à guarda pelo perfil senil e humanizado
    observacoes: 'Animal humanizado que não apresenta aptidão para reabilitação e soltura em natureza. Encaminhado para guarda sob Termo de Depósito.',
    dataAdmissao: '15/06/2024',
    situacao: 'Ativo',
  },
];

