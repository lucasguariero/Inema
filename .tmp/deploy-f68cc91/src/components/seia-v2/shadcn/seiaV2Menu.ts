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
  { id: 'novo-requerimento', label: 'Novo Requerimento', href: seiaHref('formulario'), route: 'formulario', icon: 'FilePlus2' },
  { id: 'meus-processos', label: 'Meus Processos', href: seiaHref('tabela'), route: 'tabela', icon: 'FolderKanban' },
  { id: 'meus-cadastros', label: 'Meus Cadastros', href: '#', icon: 'UserCircle', badge: 'Em breve', disabled: true },
];

export const SEIA_V2_MENU_GROUPS: MenuGroup[] = [
  {
    id: 'regulacao',
    label: 'Regulação',
    section: 'Operação Ambiental',
    icon: 'FileCheck',
    defaultOpen: true,
    items: [
      { id: 'regulacao-pauta', label: 'Pauta de Processos', href: seiaHref('tabela'), route: 'tabela' },
      { id: 'regulacao-requerimento', label: 'Requerimento Unificado', href: seiaHref('formulario'), route: 'formulario' },
      { id: 'regulacao-painel', label: 'Métricas do Analista', href: seiaHref('seia-painel'), route: 'seia-painel' },
    ],
  },
  {
    id: 'fiscalizacao',
    label: 'Fiscalização',
    section: 'Operação Ambiental',
    icon: 'ShieldAlert',
    items: [
      { id: 'fisc-denuncia-interna', label: 'Nova Denúncia', href: seiaHref('atendente'), route: 'atendente' },
      { id: 'fisc-emergencia-interna', label: 'Nova Emergência', href: seiaHref('emergencia-interna'), route: 'emergencia-interna' },
      { id: 'fisc-painel-interno-difis', label: 'Consultar Registros', href: seiaHref('consulta-interna'), route: 'consulta-interna', badge: '3', badgeVariant: 'rose' },
    ],
  },
  {
    id: 'gestao-fauna',
    label: 'Gestão de Fauna',
    section: 'Operação Ambiental',
    icon: 'PawPrint',
    badge: 'Em breve',
    badgeVariant: 'slate',
    disabled: true,
    items: [],
  },
  {
    id: 'unidade-conservacao',
    label: 'Unidade de Conservação',
    section: 'Operação Ambiental',
    icon: 'Compass',
    badge: 'Em breve',
    badgeVariant: 'slate',
    disabled: true,
    items: [],
  },
  {
    id: 'ansla',
    label: 'ANSLA',
    section: 'Operação Ambiental',
    icon: 'BookmarkCheck',
    badge: 'Em breve',
    badgeVariant: 'slate',
    disabled: true,
    items: [],
  },
  {
    id: 'sispass',
    label: 'SISPASS',
    section: 'Operação Ambiental',
    icon: 'Bird',
    badge: 'Em breve',
    badgeVariant: 'slate',
    disabled: true,
    items: [],
  },
  {
    id: 'acesso-publico',
    label: 'Acesso Público',
    section: 'Serviços e Receita',
    icon: 'Globe',
    items: [
      { id: 'acesso-denuncia', label: 'Registrar Denúncia', href: seiaHref('cidadao'), route: 'cidadao' },
      { id: 'acesso-emergencia', label: 'Registrar Emergência', href: seiaHref('emergencia-externa'), route: 'emergencia-externa' },
      { id: 'acesso-consulta', label: 'Acompanhar Registros', href: seiaHref('consulta-externa'), route: 'consulta-externa' },
    ],
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    section: 'Serviços e Receita',
    icon: 'Landmark',
    items: [{ id: 'financeiro-dae', label: 'DAE', href: seiaHref('seia-daes'), route: 'seia-daes' }],
  },
  {
    id: 'ferramentas-gerenciais',
    label: 'Ferramentas Gerenciais / Relatórios',
    section: 'Gestão e Controle',
    icon: 'BarChart3',
    items: [
      { id: 'relatorios-gerenciais', label: 'Relatórios Gerenciais', href: seiaHref('relatorios'), route: 'relatorios' },
      { id: 'indicadores-analista', label: 'Indicadores do Analista', href: seiaHref('seia-painel'), route: 'seia-painel' },
    ],
  },
  {
    id: 'auditoria',
    label: 'Auditoria',
    section: 'Gestão e Controle',
    icon: 'History',
    badge: 'Em breve',
    badgeVariant: 'slate',
    disabled: true,
    items: [],
  },
  {
    id: 'cadastros-basicos',
    label: 'Cadastros Básicos',
    section: 'Configuração do Sistema',
    icon: 'Files',
    badge: 'Em breve',
    badgeVariant: 'slate',
    disabled: true,
    items: [],
  },
  {
    id: 'administracao',
    label: 'Administração',
    section: 'Configuração do Sistema',
    icon: 'Settings',
    badge: 'Em breve',
    badgeVariant: 'slate',
    disabled: true,
    items: [],
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
