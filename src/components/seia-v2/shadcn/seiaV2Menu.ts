export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  route?: string;
  badge?: string;
  badgeVariant?: 'sage' | 'rose' | 'amber' | 'slate';
  disabled?: boolean;
  subgroup?: string;
  targetBlank?: boolean;
  htmlId?: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  section: string;
  icon: string;
  materialIcon?: string;
  badge?: string;
  badgeVariant?: 'sage' | 'rose' | 'amber' | 'slate';
  disabled?: boolean;
  defaultOpen?: boolean;
  href?: string;
  route?: string;
  isDirectItem?: boolean;
  htmlId?: string;
  items: MenuItem[];
}

export interface TopDirectItem {
  id: string;
  label: string;
  href: string;
  route?: string;
  icon: string;
  materialIcon?: string;
  badge?: string;
  disabled?: boolean;
  htmlId?: string;
}

const seiaHref = (route: string) => `/?rota=seia-v2&tela=${route}`;

export const TOP_DIRECT_ITEMS: TopDirectItem[] = [
  { id: 'inicio', label: 'Início', href: seiaHref('inicio'), route: 'inicio', icon: 'Home' },
  { id: 'iniciar-requerimento', label: 'Iniciar Requerimento', href: seiaHref('formulario'), route: 'formulario', icon: 'FilePlus2' },
  { id: 'meus-processos', label: 'Meus Processos', href: seiaHref('tabela'), route: 'tabela', icon: 'FolderKanban' },
  { id: 'notificacoes', label: 'Notificações', href: seiaHref('tabela'), route: 'tabela', icon: 'Bell', badge: '13', badgeVariant: 'rose' },
  { id: 'acesso-publico', label: 'Acesso Público', href: seiaHref('consulta-externa'), route: 'consulta-externa', icon: 'Globe' },
];

export const SEIA_V2_MENU_GROUPS: MenuGroup[] = [
  {
    id: 'analise',
    label: 'Análise',
    section: 'Processos',
    icon: 'FileCheck',
    items: [
      { id: 'analise-pauta-area', label: 'Pauta da Área', href: seiaHref('enquadramento'), route: 'enquadramento' },
      { id: 'analise-pauta-tecnico', label: 'Pauta Técnico', href: seiaHref('tabela'), route: 'tabela' },
    ],
  },
  {
    id: 'enquadramento',
    label: 'Enquadramento',
    section: 'Processos',
    icon: 'BookmarkCheck',
    items: [
      { id: 'enquadramento-pauta-area', label: 'Pauta da Área', href: seiaHref('enquadramento'), route: 'enquadramento' },
      { id: 'enquadramento-pauta-tecnica', label: 'Pauta Técnica', href: seiaHref('enquadramento'), route: 'enquadramento' },
    ],
  },
  {
    id: 'analise-tecnica',
    label: 'Análise Técnica',
    section: 'Processos',
    icon: 'FileCheck',
    items: [
      { id: 'analise-tec-geral', label: 'Pauta Geral', href: seiaHref('tabela'), route: 'tabela' },
      { id: 'analise-tec-pauta', label: 'Pauta Técnica', href: seiaHref('tabela'), route: 'tabela' },
      { id: 'analise-tec-coordenador', label: 'Pauta Coordenador', href: seiaHref('enquadramento'), route: 'enquadramento' },
    ],
  },
  {
    id: 'fiscalizacao',
    label: 'Fiscalização',
    section: 'Fiscalização',
    icon: 'ShieldAlert',
    badge: '3',
    badgeVariant: 'rose',
    items: [
      { id: 'fisc-denuncia-interna', label: 'Nova Denúncia', href: seiaHref('atendente'), route: 'atendente' },
      { id: 'fisc-minhas-denuncias', label: 'Minhas Denúncias', href: seiaHref('consulta-interna'), route: 'consulta-interna' },
      { id: 'fisc-denuncia-cidadao', label: 'Denúncia Cidadão', href: seiaHref('cidadao'), route: 'cidadao' },
      { id: 'fisc-emergencia-interna', label: 'Nova Emergência', href: seiaHref('emergencia-interna'), route: 'emergencia-interna' },
      { id: 'fisc-minhas-emergencias', label: 'Minhas Emergências', href: seiaHref('consulta-interna'), route: 'consulta-interna' },
      { id: 'fisc-minhas-analises', label: 'Minhas Análises', href: seiaHref('consulta-interna'), route: 'consulta-interna' },
      { id: 'fisc-associar-tecnico', label: 'Associar Técnico', href: seiaHref('consulta-interna'), route: 'consulta-interna' },
    ],
  },
  {
    id: 'processos',
    label: 'Processos',
    section: 'Processos',
    icon: 'Files',
    items: [
      { id: 'processos-consultar', label: 'Consultar Processos', href: seiaHref('tabela'), route: 'tabela' },
      { id: 'processos-finalizados', label: 'Processos Finalizados', href: seiaHref('tabela'), route: 'tabela' },
    ],
  },
  {
    id: 'sispass',
    label: 'SISPASS',
    section: 'Fauna e Flora',
    icon: 'Bird',
    items: [
      { id: 'sispass-meus-perfis', label: 'Meus Perfis', href: seiaHref('sispass'), route: 'sispass' },
      { id: 'sispass-pauta-geral', label: 'Pauta Geral de Perfis', href: seiaHref('sispass'), route: 'sispass' },
      { id: 'sispass-meus-calendarios', label: 'Meus Calendários Anuais', href: seiaHref('sispass'), route: 'sispass' },
      { id: 'sispass-calendario-anual', label: 'Calendário Anual', href: seiaHref('sispass'), route: 'sispass' },
      { id: 'sispass-convites', label: 'Convites de Associação', href: seiaHref('sispass'), route: 'sispass' },
    ],
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    section: 'Serviços e Receita',
    icon: 'Landmark',
    items: [
      { id: 'financeiro-dae', label: 'DAE', href: seiaHref('seia-daes'), route: 'seia-daes' },
      { id: 'financeiro-certidao', label: 'Certidão de Débito Ambiental', href: seiaHref('certidao-debito'), route: 'certidao-debito' },
      { id: 'financeiro-parcelamento', label: 'Parcelamento', href: seiaHref('parcelamento'), route: 'parcelamento' },
      { id: 'financeiro-relatorios', label: 'Relatórios Financeiros', href: seiaHref('relatorios'), route: 'relatorios' },
    ],
  },
  {
    id: 'meu-cadastro',
    label: 'Meu Cadastro',
    section: 'Identificação',
    icon: 'UserCircle',
    items: [
      { id: 'cad-dados-pessoais', label: 'Dados Pessoais', href: seiaHref('cadastros-basicos'), route: 'cadastros-basicos' },
      { id: 'cad-representante-legal', label: 'Representante Legal', href: seiaHref('cadastros-basicos'), route: 'cadastros-basicos' },
      { id: 'cad-responsavel-tecnico', label: 'Responsável Técnico', href: seiaHref('cadastros-basicos'), route: 'cadastros-basicos' },
      { id: 'cad-empreendimentos', label: 'Empreendimentos', href: seiaHref('cadastros-basicos'), route: 'cadastros-basicos' },
      { id: 'cad-propriedades-rurais', label: 'Propriedades Rurais (CEFIR)', href: seiaHref('cefir'), route: 'cefir' },
      { id: 'cad-pessoas-juridicas', label: 'Pessoas Jurídicas', href: seiaHref('cadastros-basicos'), route: 'cadastros-basicos' },
      { id: 'cad-procurador', label: 'Procurador', href: seiaHref('cadastros-basicos'), route: 'cadastros-basicos' },
      { id: 'cad-representacoes', label: 'Representações', href: seiaHref('cadastros-basicos'), route: 'cadastros-basicos' },
    ],
  },
  {
    id: 'atividades-dispensadas',
    label: 'Atividades Não Sujeitas a Licenciamento',
    section: 'Regularização',
    icon: 'FileText',
    items: [
      { id: 'ansla-tela-inicial', label: 'Tela Inicial ANSLA', href: seiaHref('ansla'), route: 'ansla' },
      { id: 'ansla-dispensa', label: 'Dispensa de Licença Ambiental', href: seiaHref('ansla'), route: 'ansla' },
    ],
  },
  {
    id: 'requerimentos',
    label: 'Requerimentos',
    section: 'Regularização',
    icon: 'FilePlus2',
    items: [
      { id: 'req-cerh', label: 'CERH', href: seiaHref('cerh'), route: 'cerh' },
      { id: 'req-dtrp', label: 'Declaração de Transportes (DTRP)', href: seiaHref('dtrp'), route: 'dtrp' },
      { id: 'req-reposicao', label: 'Reposição Florestal', href: seiaHref('reposicao-florestal'), route: 'reposicao-florestal' },
      { id: 'req-parcelamento', label: 'Parcelamento', href: seiaHref('parcelamento'), route: 'parcelamento' },
    ],
  },
  {
    id: 'administracao',
    label: 'Administração',
    section: 'Configuração',
    icon: 'Building',
    items: [
      { id: 'admin-tipologia', label: 'Tipologias & Divisões', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
      { id: 'admin-residuos', label: 'Resíduos & Classes', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
      { id: 'admin-porte', label: 'Porte & Potencial Poluidor', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
      { id: 'admin-tipos-solicitacao', label: 'Tipos de Solicitação', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
      { id: 'admin-plantonistas', label: 'Plantonistas & Escalas', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
      { id: 'admin-setores', label: 'Setores & Órgãos Ambientais', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
      { id: 'admin-legislacoes', label: 'Legislações & Unidades de Medida', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
      { id: 'admin-usuarios', label: 'Usuários', href: seiaHref('usuarios-roles'), route: 'usuarios-roles' },
      { id: 'admin-grupos', label: 'Grupos & Perfis (RBAC)', href: seiaHref('usuarios-roles'), route: 'usuarios-roles' },
      { id: 'admin-pessoas-fisicas', label: 'Pessoas Físicas', href: seiaHref('usuarios-roles'), route: 'usuarios-roles' },
      { id: 'admin-trilha-auditoria', label: 'Trilha de Auditoria (Logs)', href: seiaHref('usuarios-roles'), route: 'usuarios-roles' },
    ],
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    section: 'Configuração',
    icon: 'Sliders',
    items: [
      { id: 'config-parametros', label: 'Parâmetros Gerais do Sistema', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
      { id: 'config-informativos', label: 'Parametrização de Informativos', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
      { id: 'config-juros-mora', label: 'Configuração de Juros de Mora', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
    ],
  },
  {
    id: 'auditoria',
    label: 'Auditoria',
    section: 'Configuração',
    icon: 'ShieldCheck',
    items: [
      { id: 'auditoria-registros', label: 'Auditorias do Sistema', href: seiaHref('usuarios-roles'), route: 'usuarios-roles' },
    ],
  },
  {
    id: 'gestao-fauna',
    label: 'Gestão de Fauna',
    section: 'Fauna e Flora',
    icon: 'PawPrint',
    items: [
      { id: 'fauna-prontuario', label: 'Prontuário de Animais (CRAS)', href: seiaHref('cras'), route: 'cras' },
      { id: 'fauna-admissao', label: 'Admissão Animal', href: seiaHref('cras'), route: 'cras' },
      { id: 'fauna-manejo', label: 'Manejo de Animais', href: seiaHref('cras'), route: 'cras' },
    ],
  },
  {
    id: 'diretoria-desenvolvimento',
    label: 'Diretoria de Desenvolvimento',
    section: 'Fauna e Flora',
    icon: 'Compass',
    items: [
      { id: 'dir-especies', label: 'Espécies Animais', href: seiaHref('cras'), route: 'cras' },
      { id: 'dir-destinacoes', label: 'Tipos de Destinação', href: seiaHref('cras'), route: 'cras' },
      { id: 'dir-recintos', label: 'Recintos & Instalações', href: seiaHref('cras'), route: 'cras' },
    ],
  },
  {
    id: 'relatorios-gerenciais',
    label: 'Relatórios Gerenciais',
    section: 'Gestão e BI',
    icon: 'BarChart3',
    items: [
      { id: 'rel-gerenciais-bi', label: 'Relatórios Gerenciais & Indicadores', href: seiaHref('relatorios'), route: 'relatorios' },
      { id: 'rel-metricas-analista', label: 'Métricas do Analista', href: seiaHref('seia-painel'), route: 'seia-painel' },
      { id: 'rel-roteiro-apresentacao', label: 'Roteiro de Apresentação', href: seiaHref('apresentacao'), route: 'apresentacao' },
    ],
  },
  {
    id: 'design-system',
    label: 'Design System',
    section: 'Configuração',
    icon: 'Layers',
    route: 'design-system',
    href: seiaHref('design-system'),
    isDirectItem: true,
    badge: 'V2',
    badgeVariant: 'sage',
    items: [],
  },
];
