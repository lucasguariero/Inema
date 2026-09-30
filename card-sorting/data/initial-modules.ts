import { CardItem } from '@/types/card-sorting';

export const INITIAL_MODULES: CardItem[] = [
  {
    id: 'mod-pauta-processos',
    code: 'REG-01',
    title: 'Pauta de Processos (Regulação)',
    description: 'Pauta operacional de processos regulatórios, com filtros por status, técnico responsável, tipo de ato ambiental e tramitação.',
    systemOrigin: 'Regulação'
  },
  {
    id: 'mod-requerimento-unificado',
    code: 'REG-02',
    title: 'Requerimento Unificado com Stepper',
    description: 'Formulário oficial com etapas para solicitação unificada de licenças ambientais, outorgas hídricas e autorizações florestais.',
    systemOrigin: 'Regulação'
  },
  {
    id: 'mod-metricas-analista',
    code: 'REG-03',
    title: 'Métricas do Analista (Indicadores)',
    description: 'Painel individual de acompanhamento de produtividade, processos sob análise técnica, pendências e cumprimento de prazos legais.',
    systemOrigin: 'Regulação'
  },
  {
    id: 'mod-relatorios-gerenciais',
    code: 'REL-01',
    title: 'Relatórios Gerenciais & Executivos',
    description: 'Dashboard executivo com volume de entrada e saída de processos, distribuição por diretoria (DILIC, DIRRE, DIBIO, DIFIS) e tempos médios.',
    systemOrigin: 'Gestão e Controle'
  },
  {
    id: 'mod-denuncia-interna',
    code: 'FISC-01',
    title: 'Nova Denúncia (Atendimento Interno)',
    description: 'Triagem e cadastro interno de denúncias ambientais recebidas via telefone, atendimento presencial ou encaminhamento de órgãos.',
    systemOrigin: 'Fiscalização'
  },
  {
    id: 'mod-denuncia-externa',
    code: 'PUB-01',
    title: 'Registrar Denúncia (Portal Cidadão)',
    description: 'Canal público aberto para a sociedade registrar denúncias ambientais anônimas ou identificadas, com fotos e geolocalização.',
    systemOrigin: 'Acesso Público'
  },
  {
    id: 'mod-emergencia-interna',
    code: 'FISC-02',
    title: 'Nova Emergência Ambiental (Plantão Interno)',
    description: 'Registro e despacho ágil de ocorrências graves, vazamentos de produtos químicos e desastres ambientais no plantão da fiscalização.',
    systemOrigin: 'Fiscalização'
  },
  {
    id: 'mod-emergencia-externa',
    code: 'PUB-02',
    title: 'Registrar Emergência (Comunicação Externa)',
    description: 'Canal 24h para transportadoras, concessionárias e indústrias comunicarem acidentes com cargas perigosas e sinistros em rodovias.',
    systemOrigin: 'Acesso Público'
  },
  {
    id: 'mod-consulta-interna-difis',
    code: 'FISC-03',
    title: 'Consultar Registros (Painel DIFIS)',
    description: 'Consulta técnica detalhada de apurações ambientais, despachos conclusivos, autos de infração e histórico de ocorrências fiscais.',
    systemOrigin: 'Fiscalização'
  },
  {
    id: 'mod-consulta-externa-cidadao',
    code: 'PUB-03',
    title: 'Acompanhar Registros (Consulta Pública)',
    description: 'Consulta pública simplificada do andamento de denúncias e comunicações de emergência através do número de protocolo oficial.',
    systemOrigin: 'Acesso Público'
  },
  {
    id: 'mod-cadastro-plantonistas',
    code: 'FISC-04',
    title: 'Cadastro de Plantonistas',
    description: 'Parametrização e cadastro dos fiscais e técnicos habilitados para atuar no regime de sobreaviso e plantão de emergências ambientais.',
    systemOrigin: 'Fiscalização'
  },
  {
    id: 'mod-escala-fiscalizacao',
    code: 'FISC-05',
    title: 'Escala de Plantão Fiscalizatório',
    description: 'Planejamento mensal e quinzenal das escalas de plantão de sobreaviso, alocação de equipes regionais e registro de substituições.',
    systemOrigin: 'Fiscalização'
  },
  {
    id: 'mod-agendamento-uc',
    code: 'UC-01',
    title: 'Agendamento de Visitação em UC',
    description: 'Gestão da capacidade de carga diária, controle de reservas e prevenção de superlotação em trilhas e atrativos de Parques Estaduais.',
    systemOrigin: 'Biodiversidade / UC'
  },
  {
    id: 'mod-autorizacao-eventos-uc',
    code: 'UC-02',
    title: 'Autorização de Eventos em UC (AAV)',
    description: 'Análise técnica de impacto e emissão de autorização de visitação para filmagens comerciais, competições esportivas e trilhas.',
    systemOrigin: 'Biodiversidade / UC'
  },
  {
    id: 'mod-atividades-didaticas-uc',
    code: 'UC-03',
    title: 'Atividades Didáticas em UC (AAD)',
    description: 'Fluxo de análise e autorização para instituições de ensino realizarem visitas escolares, aulas de campo e projetos de educação ambiental.',
    systemOrigin: 'Biodiversidade / UC'
  },
  {
    id: 'mod-pesquisa-cientifica-uc',
    code: 'UC-04',
    title: 'Pesquisa Científica em UC (Pesc)',
    description: 'Avaliação técnica de projetos acadêmicos para coleta de material biológico, termo de compromisso e entrega de relatórios finais.',
    systemOrigin: 'Biodiversidade / UC'
  },
  {
    id: 'mod-ceuc-cadastro',
    code: 'UC-05',
    title: 'Cadastro Estadual de UCs (CEUC)',
    description: 'Registro e consulta oficial de poligonais georreferenciadas, instrumentos de gestão, conselhos gestores e enquadramento SNUC/SEUC.',
    systemOrigin: 'Biodiversidade / UC'
  },
  {
    id: 'mod-dae-financeiro',
    code: 'FIN-01',
    title: 'Emissão e Gestão de DAE (Financeiro)',
    description: 'Geração e controle de Documento de Arrecadação Estadual para taxas de vistoria, outorgas, multas e conciliação bancária SEFAZ.',
    systemOrigin: 'Financeiro'
  },
  {
    id: 'mod-fauna-sispass',
    code: 'FAU-01',
    title: 'Manejo de Fauna Silvestre (SISPASS)',
    description: 'Cadastro de criadores amadores de passeriformes, emissão de certidões, transferências e registro de anilhamento oficial.',
    systemOrigin: 'Biodiversidade'
  },
  {
    id: 'mod-design-system',
    code: 'SYS-01',
    title: 'Design System & Padrões Visuais',
    description: 'Catálogo de componentes, tokens institucionais, diretrizes de acessibilidade e templates de páginas homologados para o SEIA V2.',
    systemOrigin: 'Configuração'
  }
];

export const DEPARTMENTS = [
  { value: 'Fiscalização (DIFIS)', label: 'Fiscalização Ambiental (DIFIS)' },
  { value: 'Regulação (DIRRE)', label: 'Regulação e Licenciamento (DIRRE)' },
  { value: 'Biodiversidade (DISUC/DIBIO)', label: 'Biodiversidade e Unidades de Conservação (DISUC / DIBIO)' },
  { value: 'Recursos Hídricos (DIPRE)', label: 'Recursos Hídricos e Monitoramento (DIPRE)' },
  { value: 'Financeiro e Arrecadação (DAE)', label: 'Financeiro e Arrecadação (DAE)' },
  { value: 'Tecnologia da Informação (DTI)', label: 'Tecnologia da Informação e Sistemas (DTI)' },
  { value: 'Diretoria Geral / Gabinete', label: 'Diretoria Geral / Gabinete do INEMA' },
  { value: 'Atendimento ao Cidadão / Ouvidoria', label: 'Atendimento ao Cidadão e Ouvidoria' },
  { value: 'Assessoria Jurídica (PROJU)', label: 'Assessoria Jurídica (PROJU)' }
];
