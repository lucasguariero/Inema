import config from './navigationConfig.json';

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

export const TOP_DIRECT_ITEMS: TopDirectItem[] = config.topDirectItems as TopDirectItem[];
export const GLA_MENU_GROUPS: MenuGroup[] = config.menuGroups as MenuGroup[];

export default config;
