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
  icon: string;
  materialIcon?: string;
  badge?: string;
  badgeVariant?: 'sage' | 'rose' | 'amber' | 'slate';
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

export const TOP_DIRECT_ITEMS: TopDirectItem[] = [];

export const SEIA_V2_MENU_GROUPS: MenuGroup[] = [
  {
    id: 'relatorios',
    label: 'Relatórios Gerenciais',
    icon: 'BarChart3',
    materialIcon: 'bar_chart',
    href: '/?rota=seia-v2&tela=relatorios',
    route: 'relatorios',
    isDirectItem: true,
    htmlId: 'menu-relatorios',
    items: [],
  },
  {
    id: 'seia-v2-processos',
    label: 'SEIA V2 (Processos)',
    icon: 'Layers',
    materialIcon: 'dashboard_customize',
    defaultOpen: true,
    htmlId: 'subSeiaV2',
    items: [
      {
        id: 'seia-v2-pauta',
        label: 'Pauta de Processos',
        href: '/?rota=seia-v2&tela=tabela',
        route: 'tabela',
        badge: 'V2',
        badgeVariant: 'sage',
        htmlId: 'menu-pauta-processos',
      },
      {
        id: 'seia-v2-formulario',
        label: 'Requerimento Unificado',
        href: '/?rota=seia-v2&tela=formulario',
        route: 'formulario',
        badge: 'F-DUC',
        badgeVariant: 'sage',
        htmlId: 'menu-requerimento-unificado',
      },
      {
        id: 'seia-v2-painel',
        label: 'Métricas do Analista',
        href: '/?rota=seia-v2&tela=seia-painel',
        route: 'seia-painel',
        badge: 'NOVO',
        badgeVariant: 'slate',
        htmlId: 'menu-seia-painel',
      },
    ],
  },
  {
    id: 'fiscalizacao',
    label: 'Fiscalização',
    icon: 'ShieldAlert',
    materialIcon: 'fact_check',
    defaultOpen: true,
    htmlId: 'subFiscalizacao',
    items: [
      {
        id: 'fisc-denuncia-interna',
        label: 'Denúncia Interna (DIFIS)',
        href: '/?rota=seia-v2&tela=atendente',
        route: 'atendente',
        htmlId: 'menu-denuncia-interna',
      },
      {
        id: 'fisc-denuncia-externa',
        label: 'Denúncia Cidadão',
        href: '/?rota=seia-v2&tela=cidadao',
        route: 'cidadao',
        htmlId: 'menu-denuncia-externa',
      },
      {
        id: 'fisc-emergencia-interna',
        label: 'Emergência Química Interna',
        href: '/?rota=seia-v2&tela=emergencia-interna',
        route: 'emergencia-interna',
        htmlId: 'menu-emergencia-interna',
      },
      {
        id: 'fisc-emergencia-externa',
        label: 'Emergência Química Cidadão',
        href: '/?rota=seia-v2&tela=emergencia-externa',
        route: 'emergencia-externa',
        htmlId: 'menu-emergencia-externa',
      },
      {
        id: 'fisc-consulta-cidadao',
        label: 'Consulta Cidadão',
        href: '/?rota=seia-v2&tela=consulta-externa',
        route: 'consulta-externa',
        htmlId: 'menu-consulta-externa',
      },
      {
        id: 'fisc-painel-interno-difis',
        label: 'Painel Interno DIFIS',
        href: '/?rota=seia-v2&tela=consulta-interna',
        route: 'consulta-interna',
        badge: '3',
        badgeVariant: 'rose',
        htmlId: 'menu-consulta-interna',
      },
    ],
  },
];
