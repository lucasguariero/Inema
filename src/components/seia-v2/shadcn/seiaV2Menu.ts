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
  badgeVariant?: 'sage' | 'rose' | 'amber' | 'slate';
  disabled?: boolean;
  htmlId?: string;
}

const seiaHref = (route: string) => `/?rota=seia-v2&tela=${route}`;

export const TOP_DIRECT_ITEMS: TopDirectItem[] = [
  { id: 'inicio', label: 'Início', href: seiaHref('inicio'), route: 'inicio', icon: 'Home' },
  { id: 'novo-requerimento', label: 'Novo Requerimento', href: seiaHref('formulario'), route: 'formulario', icon: 'FilePlus2' },
  { id: 'meus-processos', label: 'Meus Processos', href: seiaHref('tabela'), route: 'tabela', icon: 'FolderKanban' },
  { id: 'notificacoes', label: 'Notificações', href: seiaHref('notificacoes'), route: 'notificacoes', icon: 'Bell', badge: '13', badgeVariant: 'rose' },
  { id: 'acesso-publico', label: 'Acesso Público', href: seiaHref('acesso-publico'), route: 'acesso-publico', icon: 'Globe' },
  { id: 'meus-cadastros', label: 'Meus Cadastros', href: seiaHref('cadastros-basicos'), route: 'cadastros-basicos', icon: 'UserCircle' },
];

export const SEIA_V2_MENU_GROUPS: MenuGroup[] = [
  // ==========================================
  // 1. OPERAÇÃO AMBIENTAL
  // ==========================================
  {
    id: 'regulacao',
    label: 'Regulação',
    section: 'Operação Ambiental',
    icon: 'FileCheck',
    defaultOpen: true,
    items: [
      { id: 'regulacao-pauta', label: 'Pauta de Processos', href: seiaHref('processos'), route: 'processos' },
      { id: 'regulacao-enquadramento', label: 'Enquadramento & Triagem', href: seiaHref('enquadramento'), route: 'enquadramento', badge: 'DIPRE', badgeVariant: 'sage' },
      { id: 'regulacao-pauta-area', label: 'Pauta da Área', href: seiaHref('pauta-area'), route: 'pauta-area' },
      { id: 'regulacao-pauta-tecnica', label: 'Pauta Técnica', href: seiaHref('enquadramento-tecnica'), route: 'enquadramento-tecnica' },
      { id: 'regulacao-requerimento', label: 'Requerimento Unificado', href: seiaHref('formulario'), route: 'formulario' },
      { id: 'regulacao-cerh', label: 'Recursos Hídricos / CERH', href: seiaHref('cerh'), route: 'cerh', badge: 'CERH', badgeVariant: 'sage' },
      { id: 'regulacao-ansla', label: 'Dispensa ANSLA', href: seiaHref('ansla'), route: 'ansla' },
      { id: 'regulacao-cefir', label: 'Imóveis Rurais (CEFIR)', href: seiaHref('cefir'), route: 'cefir' },
      { id: 'regulacao-painel', label: 'Métricas do Analista', href: seiaHref('seia-painel'), route: 'seia-painel' },
      { id: 'regulacao-desbloqueios', label: 'Desbloqueios da APE', href: seiaHref('desbloqueios-ape'), route: 'desbloqueios-ape' },
    ],
  },
  {
    id: 'fiscalizacao',
    label: 'Fiscalização',
    section: 'Operação Ambiental',
    icon: 'ShieldAlert',
    badge: '3',
    badgeVariant: 'rose',
    items: [
      { id: 'fisc-denuncia-interna', label: 'Nova Denúncia', href: seiaHref('atendente'), route: 'atendente' },
      { id: 'fisc-minhas-denuncias', label: 'Minhas Denúncias', href: seiaHref('consulta-interna'), route: 'consulta-interna' },
      { id: 'fisc-denuncia-cidadao', label: 'Denúncia Cidadão', href: seiaHref('cidadao'), route: 'cidadao' },
      { id: 'fisc-emergencia-interna', label: 'Nova Emergência', href: seiaHref('emergencia-interna'), route: 'emergencia-interna' },
      { id: 'fisc-minhas-emergencias', label: 'Minhas Emergências', href: seiaHref('minhas-emergencias'), route: 'minhas-emergencias' },
      { id: 'fisc-minhas-analises', label: 'Minhas Análises', href: seiaHref('minhas-analises'), route: 'minhas-analises' },
      { id: 'fisc-dtrp', label: 'Transporte de Resíduos (DTRP)', href: seiaHref('dtrp'), route: 'dtrp', badge: 'DIFIS', badgeVariant: 'sage' },
      { id: 'fisc-associar-tecnico', label: 'Associar Técnico', href: seiaHref('associar-tecnico'), route: 'associar-tecnico' },
    ],
  },
  {
    id: 'gestao-fauna',
    label: 'Gestão de Fauna',
    section: 'Operação Ambiental',
    icon: 'PawPrint',
    items: [
      { id: 'fauna-cras', label: 'Animais & Prontuários (CRAS)', href: seiaHref('cras'), route: 'cras', badge: 'CRAS', badgeVariant: 'sage' },
      { id: 'fauna-admissao', label: 'Admissão Animal', href: seiaHref('fauna-admissao'), route: 'fauna-admissao' },
      { id: 'fauna-manejo', label: 'Manejo de Animais', href: seiaHref('fauna-manejo'), route: 'fauna-manejo' },
      { id: 'fauna-especies', label: 'Espécies Animais', href: seiaHref('dir-especies'), route: 'dir-especies' },
      { id: 'fauna-destinacoes', label: 'Destinações Animais', href: seiaHref('dir-destinacoes'), route: 'dir-destinacoes' },
      { id: 'fauna-recintos', label: 'Recintos & Quarentena', href: seiaHref('dir-recintos'), route: 'dir-recintos' },
      { id: 'fauna-marcacoes', label: 'Marcações Animais', href: seiaHref('cras-marcacoes'), route: 'cras-marcacoes' },
      { id: 'fauna-sispass', label: 'Criadores SISPASS', href: seiaHref('sispass'), route: 'sispass' },
      { id: 'fauna-pauta-sispass', label: 'Pauta Geral de Perfis', href: seiaHref('sispass-pauta'), route: 'sispass-pauta' },
      { id: 'fauna-calendarios', label: 'Meus Calendários Anuais', href: seiaHref('sispass-calendarios'), route: 'sispass-calendarios' },
    ],
  },
  {
    id: 'unidade-conservacao',
    label: 'Biodiversidade & UCs',
    section: 'Operação Ambiental',
    icon: 'Compass',
    items: [
      { id: 'uc-reposicao', label: 'Reposição Florestal (CRF)', href: seiaHref('reposicao-florestal'), route: 'reposicao-florestal', badge: 'CRF', badgeVariant: 'sage' },
      { id: 'uc-unidades', label: 'Unidades de Conservação', href: seiaHref('unidade-conservacao'), route: 'unidade-conservacao' },
    ],
  },

  // ==========================================
  // 2. SERVIÇOS E RECEITA
  // ==========================================
  {
    id: 'financeiro',
    label: 'Financeiro & Arrecadação',
    section: 'Serviços e Receita',
    icon: 'Landmark',
    items: [
      { id: 'financeiro-dae', label: 'DAE', href: seiaHref('seia-daes'), route: 'seia-daes' },
      { id: 'financeiro-cnd', label: 'Certidão de Débito (CND)', href: seiaHref('certidao-debito'), route: 'certidao-debito', badge: 'CND', badgeVariant: 'sage' },
      { id: 'financeiro-parcelamento', label: 'Parcelamento de Débitos', href: seiaHref('parcelamento'), route: 'parcelamento' },
      { id: 'financeiro-relatorios', label: 'Relatórios Financeiros', href: seiaHref('financeiro-relatorios'), route: 'financeiro-relatorios' },
    ],
  },
  {
    id: 'atividades-dispensadas',
    label: 'Atividades Não Sujeitas a Licenciamento',
    section: 'Serviços e Receita',
    icon: 'FileText',
    items: [
      { id: 'ansla-tela-inicial', label: 'Tela Inicial ANSLA', href: seiaHref('ansla'), route: 'ansla' },
      { id: 'ansla-dispensa', label: 'Dispensa de Licença Ambiental', href: seiaHref('ansla-dispensa'), route: 'ansla-dispensa' },
    ],
  },
  {
    id: 'requerimentos',
    label: 'Requerimentos',
    section: 'Serviços e Receita',
    icon: 'FilePlus2',
    items: [
      { id: 'req-cerh', label: 'CERH', href: seiaHref('cerh'), route: 'cerh' },
      { id: 'req-dtrp', label: 'Declaração de Transportes (DTRP)', href: seiaHref('dtrp'), route: 'dtrp' },
      { id: 'req-reposicao', label: 'Reposição Florestal', href: seiaHref('reposicao-florestal'), route: 'reposicao-florestal' },
      { id: 'req-parcelamento', label: 'Parcelamento', href: seiaHref('req-parcelamento'), route: 'req-parcelamento' },
    ],
  },

  // ==========================================
  // 3. GESTÃO E CONTROLE
  // ==========================================
  {
    id: 'ferramentas-gerenciais',
    label: 'Ferramentas Gerenciais / Relatórios',
    section: 'Gestão e Controle',
    icon: 'BarChart3',
    items: [
      { id: 'rel-gerenciais-bi', label: 'Relatórios Gerenciais & Indicadores', href: seiaHref('relatorios'), route: 'relatorios' },
      { id: 'rel-metricas-analista', label: 'Métricas do Analista', href: seiaHref('seia-painel'), route: 'seia-painel' },
      { id: 'rel-roteiro-apresentacao', label: 'Roteiro de Apresentação (Call Thays)', href: seiaHref('apresentacao'), route: 'apresentacao', badge: 'Guia', badgeVariant: 'sage' },
    ],
  },
  {
    id: 'auditoria',
    label: 'Auditoria & Governança',
    section: 'Gestão e Controle',
    icon: 'ShieldCheck',
    items: [
      { id: 'auditoria-registros', label: 'Auditorias do Sistema', href: seiaHref('auditoria-registros'), route: 'auditoria-registros' },
      { id: 'admin-auditoria', label: 'Trilha de Auditoria (Logs)', href: seiaHref('admin-auditoria'), route: 'admin-auditoria' },
    ],
  },

  // ==========================================
  // 4. CONFIGURAÇÃO DO SISTEMA
  // ==========================================
  {
    id: 'cadastros-basicos',
    label: 'Cadastros Básicos',
    section: 'Configuração do Sistema',
    icon: 'UserCircle',
    items: [
      { id: 'cad-dados-pessoais', label: 'Dados Pessoais', href: seiaHref('cadastros-basicos'), route: 'cadastros-basicos' },
      { id: 'cad-responsavel', label: 'Responsáveis Técnicos', href: seiaHref('cad-responsavel'), route: 'cad-responsavel' },
      { id: 'cad-representante', label: 'Representantes Legais', href: seiaHref('cad-representante'), route: 'cad-representante' },
      { id: 'cad-empreendimentos', label: 'Empreendimentos', href: seiaHref('cad-empreendimentos'), route: 'cad-empreendimentos' },
      { id: 'cad-cefir', label: 'Propriedades Rurais (CEFIR)', href: seiaHref('cad-cefir'), route: 'cad-cefir' },
      { id: 'cad-pj', label: 'Pessoas Jurídicas', href: seiaHref('cad-pj'), route: 'cad-pj' },
      { id: 'cad-procurador', label: 'Procuradores', href: seiaHref('cad-procurador'), route: 'cad-procurador' },
      { id: 'cad-representacoes', label: 'Representações / Consultorias', href: seiaHref('cad-representacoes'), route: 'cad-representacoes' },
    ],
  },
  {
    id: 'parametrizacoes',
    label: 'Parametrizações & Tabelas',
    section: 'Configuração do Sistema',
    icon: 'Sliders',
    items: [
      { id: 'param-tipologia', label: 'Tipologias & Divisões', href: seiaHref('parametrizacao'), route: 'parametrizacao' },
      { id: 'param-residuos', label: 'Resíduos & Classes IBAMA', href: seiaHref('admin-residuos'), route: 'admin-residuos' },
      { id: 'param-produtos-perigosos', label: 'Produtos Perigosos', href: seiaHref('produtos-perigosos'), route: 'produtos-perigosos' },
      { id: 'param-porte', label: 'Porte & Potencial Poluidor', href: seiaHref('admin-porte'), route: 'admin-porte' },
      { id: 'param-solicitacao', label: 'Tipos de Solicitação', href: seiaHref('admin-solicitacao'), route: 'admin-solicitacao' },
      { id: 'param-plantonistas', label: 'Plantonistas & Escalas', href: seiaHref('admin-plantonistas'), route: 'admin-plantonistas' },
      { id: 'param-setores', label: 'Setores & Órgãos Ambientais', href: seiaHref('admin-setores'), route: 'admin-setores' },
      { id: 'param-legislacoes', label: 'Legislações & Portarias', href: seiaHref('admin-legislacoes'), route: 'admin-legislacoes' },
      { id: 'param-tipos-documento', label: 'Tipos de Documento', href: seiaHref('admin-tipos-documento'), route: 'admin-tipos-documento' },
      { id: 'param-informativos', label: 'Informativos do Requerimento', href: seiaHref('config-informativos'), route: 'config-informativos' },
      { id: 'param-juros', label: 'Configuração de Juros de Mora', href: seiaHref('config-juros'), route: 'config-juros' },
      { id: 'param-confissao', label: 'Parametrização do Instrumento de Confissão', href: seiaHref('config-confissao'), route: 'config-confissao' },
    ],
  },
  {
    id: 'administracao',
    label: 'Administração & Acessos',
    section: 'Configuração do Sistema',
    icon: 'Settings',
    items: [
      { id: 'admin-usuarios', label: 'Usuários do Sistema', href: seiaHref('usuarios-roles'), route: 'usuarios-roles' },
      { id: 'admin-grupos', label: 'Grupos & Perfis (RBAC)', href: seiaHref('admin-grupos'), route: 'admin-grupos' },
      { id: 'admin-pf', label: 'Pessoas Físicas', href: seiaHref('admin-pf'), route: 'admin-pf' },
      { id: 'admin-atos-ambientais', label: 'Atos Ambientais & Portarias', href: seiaHref('atos-ambientais'), route: 'atos-ambientais' },
    ],
  },
  {
    id: 'design-system',
    label: 'Design System',
    section: 'Configuração do Sistema',
    icon: 'Layers',
    route: 'design-system',
    href: seiaHref('design-system'),
    isDirectItem: true,
    badge: 'V2',
    badgeVariant: 'sage',
    items: [],
  },
];
