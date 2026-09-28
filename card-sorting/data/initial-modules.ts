import { CardItem } from '@/types/card-sorting';

export const INITIAL_MODULES: CardItem[] = [
  {
    id: 'mod-dae',
    code: 'FIN-01',
    title: 'Gerar DAE (Arrecadação Estadual)',
    description: 'Emissão de taxas de vistoria, outorga, parcelamento de débitos ambientais e integração bancária SEFAZ/SEIA.',
    systemOrigin: 'Financeiro'
  },
  {
    id: 'mod-consulta-difis',
    code: 'DIFIS-05',
    title: 'Consultar Registros (Painel DIFIS)',
    description: 'Pauta centralizada de apurações ambientais, despachos conclusivos e autos de infração lavrados pela fiscalização.',
    systemOrigin: 'Fiscalização'
  },
  {
    id: 'mod-nova-denuncia',
    code: 'DOR001',
    title: 'Nova Denúncia Ambiental',
    description: 'Triagem de ilícitos ambientais, desmatamento ilegal, tráfico de fauna e poluição hídrica ou sonora (cidadão e presencial).',
    systemOrigin: 'Fiscalização'
  },
  {
    id: 'mod-ceuc-cadastro',
    code: 'CEUC-TL002',
    title: 'Cadastro de Unidade de Conservação',
    description: 'Registro de poligonais georreferenciadas, instrumentos de gestão, conselho gestor e enquadramento SNUC/SEUC.',
    systemOrigin: 'Biodiversidade / UC'
  },
  {
    id: 'mod-emergencia-quimica',
    code: 'DOR003',
    title: 'Comunicação de Emergência Química',
    description: 'Plantão 24h para registro imediato de acidentes com cargas e produtos perigosos em rodovias e recursos hídricos.',
    systemOrigin: 'Fiscalização'
  },
  {
    id: 'mod-agendamento-uc',
    code: 'DOR001-UC',
    title: 'Agendamento de Visitação Pública em UC',
    description: 'Gestão de capacidade diária de atrativos turísticos, controle de ingressos e prevenção de superlotação em Parques.',
    systemOrigin: 'Biodiversidade / UC'
  },
  {
    id: 'mod-autorizacao-eventos',
    code: 'DOR002-UC',
    title: 'Autorização de Eventos em UC (AAV)',
    description: 'Análise de impacto e emissão de autorização de visitação para filmagens comerciais, competições esportivas e trilhas.',
    systemOrigin: 'Biodiversidade / UC'
  },
  {
    id: 'mod-supressao-asv',
    code: 'REG-ASV',
    title: 'Autorização de Supressão Vegetal (ASV)',
    description: 'Requerimento florestal com inventário fitossociológico, coordenadas de talhões e plano de compensação biológica.',
    systemOrigin: 'Regulação'
  },
  {
    id: 'mod-outorga-agua',
    code: 'REG-OUT',
    title: 'Outorga de Uso de Recursos Hídricos',
    description: 'Análise técnica de captação subterrânea (poços), captação superficial (rios), barramentos e lançamento de efluentes.',
    systemOrigin: 'Regulação'
  },
  {
    id: 'mod-controle-pauta',
    code: 'REG-PAUTA',
    title: 'Controle de Pauta e Tramitação Regulatória',
    description: 'Distribuição automatizada de processos para equipes técnicas, controle de prazos legais e monitoramento de SLA.',
    systemOrigin: 'Regulação'
  },
  {
    id: 'mod-pesquisa-cientifica',
    code: 'DOR004-UC',
    title: 'Pesquisa Científica em UC (Pesc)',
    description: 'Avaliação técnica de projetos acadêmicos para coleta de espécimes, bioética e entrega obrigatória de relatórios finais.',
    systemOrigin: 'Biodiversidade / UC'
  },
  {
    id: 'mod-escala-fiscalizacao',
    code: 'DOR007-FISC',
    title: 'Escala e Plantão Fiscalizatório',
    description: 'Planejamento mensal de escala de plantonistas, rodízio de agentes nas Unidades Regionais e regime de sobreaviso.',
    systemOrigin: 'Fiscalização'
  },
  {
    id: 'mod-certidao-debito',
    code: 'FIN-CND',
    title: 'Certidão de Débito e Regularidade Ambiental',
    description: 'Emissão automatizada de certidões negativas ou positivas com efeito de negativa para licitações e financiamentos.',
    systemOrigin: 'Financeiro'
  },
  {
    id: 'mod-gestao-fauna',
    code: 'FAUNA-SISPASS',
    title: 'Gestão e Manejo de Fauna Silvestre',
    description: 'Cadastro de criadores amadores de passeriformes, anilhamento oficial, declaração de reprodução e transferências.',
    systemOrigin: 'Biodiversidade'
  },
  {
    id: 'mod-metricas-dirre',
    code: 'DIRRE-DASH',
    title: 'Relatórios e Métricas Gerenciais DIRRE',
    description: 'Painel analítico com tempo médio de análise, volume de atos emitidos, taxa de pendências e gargalos por coordenação.',
    systemOrigin: 'Diretoria / Gestão'
  }
];

export const DEPARTMENTS = [
  { value: 'Fiscalização (DIFIS)', label: 'Fiscalização Ambiental (DIFIS)' },
  { value: 'Regulação (DIRRE)', label: 'Regulação e Licenciamento (DIRRE)' },
  { value: 'Biodiversidade (DISUC/CEUC)', label: 'Biodiversidade e Unidades de Conservação (DISUC)' },
  { value: 'Recursos Hídricos (DIPRE)', label: 'Recursos Hídricos e Monitoramento (DIPRE)' },
  { value: 'Financeiro e Arrecadação', label: 'Financeiro e Arrecadação (DAE)' },
  { value: 'Tecnologia da Informação (TI/DTI)', label: 'Tecnologia da Informação e Sistemas (DTI)' },
  { value: 'Diretoria Geral / Gabinete', label: 'Diretoria Geral / Gabinete do INEMA' },
  { value: 'Atendimento ao Cidadão / Ouvidoria', label: 'Atendimento ao Cidadão e Ouvidoria' }
];
