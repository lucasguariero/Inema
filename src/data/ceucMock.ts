export interface UcItem {
  id: string; // ID interno no CEUC
  codigoCeu: string; // Código SNUC/CEUC
  nome: string;
  categoria: 'Parque Estadual' | 'APA' | 'Estação Ecológica' | 'Floresta Estadual' | 'Monumento Natural' | 'Refúgio de Vida Silvestre';
  grupoManejo: 'Proteção Integral' | 'Uso Sustentável';
  municipio: string;
  gestor: string;
  statusPmuc: 'Publicado' | 'Em Elaboração' | 'Em Revisão' | 'Pendente';
  anoPmuc?: number;
  statusConselho: 'Ativo e Paritário' | 'Em Formação' | 'Inativo';
  elegivelVisitacao: boolean;
  bioma: 'Caatinga' | 'Mata Atlântica' | 'Cerrado';
  areaHectares: number;
}

export const MOCK_UNIDADES_CONSERVACAO: UcItem[] = [
  {
    id: 'uc-001',
    codigoCeu: 'BA-029-PI',
    nome: 'Parque Estadual do Morro do Chapéu',
    categoria: 'Parque Estadual',
    grupoManejo: 'Proteção Integral',
    municipio: 'Morro do Chapéu',
    gestor: 'Carlos Eduardo Assis',
    statusPmuc: 'Publicado',
    anoPmuc: 2021,
    statusConselho: 'Ativo e Paritário',
    elegivelVisitacao: true,
    bioma: 'Caatinga',
    areaHectares: 46000
  },
  {
    id: 'uc-002',
    codigoCeu: 'BA-014-US',
    nome: 'Área de Proteção Ambiental Litoral Norte',
    categoria: 'APA',
    grupoManejo: 'Uso Sustentável',
    municipio: 'Conde',
    gestor: 'Beatriz Lins Fagundes',
    statusPmuc: 'Em Revisão',
    anoPmuc: 2017,
    statusConselho: 'Ativo e Paritário',
    elegivelVisitacao: true,
    bioma: 'Mata Atlântica',
    areaHectares: 142000
  },
  {
    id: 'uc-003',
    codigoCeu: 'BA-045-PI',
    nome: 'Estação Ecológica Wenceslau Guimarães',
    categoria: 'Estação Ecológica',
    grupoManejo: 'Proteção Integral',
    municipio: 'Wenceslau Guimarães',
    gestor: 'Marcos Vinícius Cunha',
    statusPmuc: 'Pendente',
    statusConselho: 'Em Formação',
    elegivelVisitacao: false, // Cenário de contraste: Proteção integral restrita a pesquisas
    bioma: 'Mata Atlântica',
    areaHectares: 2400
  },
  {
    id: 'uc-004',
    codigoCeu: 'BA-008-PI',
    nome: 'Parque Estadual das Sete Passagens',
    categoria: 'Parque Estadual',
    grupoManejo: 'Proteção Integral',
    municipio: 'Miguel Calmon',
    gestor: 'Clarisse Dias Cruz',
    statusPmuc: 'Publicado',
    anoPmuc: 2023,
    statusConselho: 'Ativo e Paritário',
    elegivelVisitacao: true,
    bioma: 'Caatinga',
    areaHectares: 2821
  }
];
