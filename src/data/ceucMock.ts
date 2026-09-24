export interface UcItem {
  id: string; // ID interno no CEUC
  codigoCeu: string; // Código SNUC/CEUC
  nome: string;
  sigla?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
  categoria: 'Parque Estadual' | 'APA' | 'Estação Ecológica' | 'Floresta Estadual' | 'Monumento Natural' | 'Refúgio de Vida Silvestre';
  grupoManejo: 'Proteção Integral' | 'Uso Sustentável';
  municipio: string;
  municipiosAbrangidos?: string[];
  gestor: string;
  statusPmuc: 'Publicado' | 'Em Elaboração' | 'Em Revisão' | 'Pendente';
  anoPmuc?: number;
  statusConselho: 'Ativo e Paritário' | 'Em Formação' | 'Inativo';
  elegivelVisitacao: boolean;
  bioma: 'Caatinga' | 'Mata Atlântica' | 'Cerrado';
  areaHectares: number;
  populacaoEstimada?: number;
  rpga?: string;
  territorioIdentidade?: string;
  percentualRegularizado?: number;
  descricaoSituacaoFundiaria?: string;
  normaCriacaoArquivo?: string;
  normaAlteracaoArquivo?: string;
}

export const MOCK_UNIDADES_CONSERVACAO: UcItem[] = [
  {
    id: 'uc-001',
    codigoCeu: 'BA-029-PI',
    nome: 'Parque Estadual do Morro do Chapéu',
    sigla: 'PE Morro do Chapéu',
    dataCriacao: '1998-08-17',
    dataAtualizacao: '2026-02-10',
    categoria: 'Parque Estadual',
    grupoManejo: 'Proteção Integral',
    municipio: 'Morro do Chapéu',
    municipiosAbrangidos: ['Morro do Chapéu', 'Cafarnaum'],
    gestor: 'Carlos Eduardo Assis',
    statusPmuc: 'Publicado',
    anoPmuc: 2021,
    statusConselho: 'Ativo e Paritário',
    elegivelVisitacao: true,
    bioma: 'Caatinga',
    areaHectares: 46000,
    populacaoEstimada: 0,
    rpga: 'RPGA do Rio Paraguaçu',
    territorioIdentidade: 'Piemonte da Diamantina',
    percentualRegularizado: 91.5,
    descricaoSituacaoFundiaria: 'Desapropriações em fase conclusiva com áreas remanescentes do Estado da Bahia.',
    normaCriacaoArquivo: 'Decreto_Estadual_7413_1998_Criacao.pdf'
  },
  {
    id: 'uc-002',
    codigoCeu: 'BA-014-US',
    nome: 'Área de Proteção Ambiental Litoral Norte',
    sigla: 'APA Litoral Norte',
    dataCriacao: '1992-03-19',
    dataAtualizacao: '2026-01-15',
    categoria: 'APA',
    grupoManejo: 'Uso Sustentável',
    municipio: 'Conde',
    municipiosAbrangidos: ['Conde', 'Jandaíra', 'Entre Rios'],
    gestor: 'Beatriz Lins Fagundes',
    statusPmuc: 'Em Revisão',
    anoPmuc: 2017,
    statusConselho: 'Ativo e Paritário',
    elegivelVisitacao: true,
    bioma: 'Mata Atlântica',
    areaHectares: 142000,
    populacaoEstimada: 42500,
    rpga: 'RPGA do Litoral Norte',
    territorioIdentidade: 'Litoral Norte e Agreste Baiano',
    percentualRegularizado: 68.0,
    descricaoSituacaoFundiaria: 'Propriedades privadas compatibilizadas com zoneamento ecológico-econômico estadual.',
    normaCriacaoArquivo: 'Decreto_Estadual_1046_1992_Criacao.pdf'
  },
  {
    id: 'uc-003',
    codigoCeu: 'BA-045-PI',
    nome: 'Estação Ecológica Wenceslau Guimarães',
    sigla: 'ESEC Wenceslau Guimarães',
    dataCriacao: '1997-02-21',
    dataAtualizacao: '2025-11-20',
    categoria: 'Estação Ecológica',
    grupoManejo: 'Proteção Integral',
    municipio: 'Wenceslau Guimarães',
    municipiosAbrangidos: ['Wenceslau Guimarães'],
    gestor: 'Marcos Vinícius Cunha',
    statusPmuc: 'Pendente',
    statusConselho: 'Em Formação',
    elegivelVisitacao: false, // Cenário de contraste: Proteção integral restrita a pesquisas
    bioma: 'Mata Atlântica',
    areaHectares: 2400,
    populacaoEstimada: 0,
    rpga: 'RPGA do Rio das Contas',
    territorioIdentidade: 'Baixo Sul',
    percentualRegularizado: 45.0,
    descricaoSituacaoFundiaria: 'Áreas devolutas estaduais em regularização fundiária pela CDA/BA.',
    normaCriacaoArquivo: 'Decreto_Estadual_6225_1997_Criacao.pdf'
  },
  {
    id: 'uc-004',
    codigoCeu: 'BA-008-PI',
    nome: 'Parque Estadual das Sete Passagens',
    sigla: 'PE Sete Passagens',
    dataCriacao: '2000-05-24',
    dataAtualizacao: '2026-03-01',
    categoria: 'Parque Estadual',
    grupoManejo: 'Proteção Integral',
    municipio: 'Miguel Calmon',
    municipiosAbrangidos: ['Miguel Calmon', 'Jacobina'],
    gestor: 'Clarisse Dias Cruz',
    statusPmuc: 'Publicado',
    anoPmuc: 2023,
    statusConselho: 'Ativo e Paritário',
    elegivelVisitacao: true,
    bioma: 'Caatinga',
    areaHectares: 2821,
    populacaoEstimada: 0,
    rpga: 'RPGA do Rio Itapicuru',
    territorioIdentidade: 'Piemonte do Paraguaçu',
    percentualRegularizado: 88.0,
    descricaoSituacaoFundiaria: 'Predomínio de áreas públicas desapropriadas com indenizações de benfeitorias quitadas.',
    normaCriacaoArquivo: 'Decreto_Estadual_7808_2000_Criacao.pdf'
  }
];
