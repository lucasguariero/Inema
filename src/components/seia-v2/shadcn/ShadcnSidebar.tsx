import React, { useEffect, useState, useMemo } from 'react';
import {
  Home,
  FilePlus2,
  FolderKanban,
  Bell,
  Globe,
  BarChart3,
  FileCheck,
  BookmarkCheck,
  Compass,
  ShieldAlert,
  Files,
  Bird,
  Landmark,
  UserCircle,
  ShieldCheck,
  Send,
  Sliders,
  PawPrint,
  History,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
  Building,
  FileText,
  ExternalLink,
  X,
  Sparkles,
  Layers,
  Table as TableIcon,
  FileSpreadsheet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  TOP_DIRECT_ITEMS,
  SEIA_V2_MENU_GROUPS,
  MenuItem,
  MenuGroup,
  TopDirectItem,
} from './seiaV2Menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from '@/context/ThemeContext';

interface SidebarProps {
  activeRoute?: string;
  isCollapsed?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onNavigate?: (route: string) => void;
  onToggleCollapse?: () => void;
}

// Mapa de ícones do Lucide
const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  FilePlus2,
  FolderKanban,
  Bell,
  Globe,
  BarChart3,
  FileCheck,
  BookmarkCheck,
  Compass,
  ShieldAlert,
  Files,
  Bird,
  Landmark,
  UserCircle,
  ShieldCheck,
  Send,
  Sliders,
  PawPrint,
  History,
  Settings,
  Building,
  FileText,
  Layers,
  Table: TableIcon,
  FileSpreadsheet,
};

export const SIDEBAR_SECTIONS = [
  { label: 'Operação Ambiental', icon: 'FileCheck' },
  { label: 'Serviços e Receita', icon: 'Globe' },
  { label: 'Gestão e Controle', icon: 'BarChart3' },
  { label: 'Configuração do Sistema', icon: 'Settings' },
];

const getGroupForRoute = (route?: string) =>
  SEIA_V2_MENU_GROUPS.find((group) =>
    group.items.some((item) => item.route === route)
  )?.id;

const getSectionForRoute = (route?: string) =>
  SEIA_V2_MENU_GROUPS.find(
    (group) =>
      group.route === route || group.items.some((item) => item.route === route)
  )?.section || null;

export const ShadcnSidebar: React.FC<SidebarProps> = ({
  activeRoute = 'relatorios',
  isCollapsed = false,
  isOpenMobile = false,
  onCloseMobile,
  onNavigate,
  onToggleCollapse,
}) => {
  const { theme, isDarkMode } = useTheme();
  const isInemaLight = theme === 'inema-light';
  const isVizoraGreen = theme === 'vizora-green';

  // Scrollbar dinâmica acompanhando a cor do seletor de aparência
  const getSidebarScrollClass = () => {
    if (isDarkMode) return 'sidebar-scroll-dark';
    if (isVizoraGreen) return 'sidebar-scroll-green';
    if (isInemaLight) return 'sidebar-scroll-white';
    return 'sidebar-scroll-blue';
  };

  const getDirectItemClass = (isActive: boolean) => {
    if (isDarkMode) {
      if (isActive) return 'bg-slate-800 text-white font-semibold shadow-xs border border-slate-700';
      return 'text-slate-400 hover:bg-slate-900 hover:text-white font-medium';
    }
    if (isActive) {
      if (isVizoraGreen) return 'bg-[#22725b] text-white font-semibold shadow-xs border border-[#2c8d71]';
      if (isInemaLight) return 'bg-[#d1e1de] text-[#002f25] font-bold';
      return 'bg-[#165a6e] text-white font-semibold shadow-xs border border-[#207087]';
    }
    if (isVizoraGreen) return 'text-[#bce0d3] hover:bg-[#1f6853] hover:text-white font-medium';
    if (isInemaLight) return 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium';
    return 'text-[#9ec3cc] hover:bg-[#135467] hover:text-white font-medium';
  };

  const getSubItemClass = (isActive: boolean, disabled?: boolean) => {
    if (disabled) return 'opacity-50 cursor-not-allowed text-slate-400';
    if (isDarkMode) {
      if (isActive) return 'bg-slate-800 text-white font-semibold border-l-2 border-emerald-400 shadow-xs';
      return 'text-slate-400 hover:bg-slate-900 hover:text-white font-medium cursor-pointer';
    }
    if (isActive) {
      if (isVizoraGreen) return 'bg-[#22725b] text-white font-semibold border-l-2 border-[#34D399] shadow-xs';
      if (isInemaLight) return 'bg-[#d1e1de] text-[#002f25] font-semibold border-l-2 border-[#0F4C3A]';
      return 'bg-[#165a6e] text-white font-semibold border-l-2 border-[#34D399] shadow-xs';
    }
    if (isVizoraGreen) return 'text-[#bce0d3] hover:bg-[#1f6853] hover:text-white font-medium cursor-pointer';
    if (isInemaLight) return 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium cursor-pointer';
    return 'text-[#9ec3cc] hover:bg-[#135467] hover:text-white font-medium cursor-pointer';
  };

  const getGroupBtnClass = (hasActiveChild: boolean) => {
    if (isDarkMode) {
      if (hasActiveChild) return 'text-white font-semibold bg-slate-900';
      return 'text-slate-400 hover:bg-slate-900 hover:text-white font-medium';
    }
    if (hasActiveChild) {
      if (isVizoraGreen) return 'text-white font-semibold bg-[#1f6853]/70';
      if (isInemaLight) return 'text-[#002f25] font-semibold bg-slate-100/80';
      return 'text-white font-semibold bg-[#135467]/70';
    }
    if (isVizoraGreen) return 'text-[#d2ede2] hover:bg-[#1f6853] hover:text-white font-medium';
    if (isInemaLight) return 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium';
    return 'text-[#c6e1e8] hover:bg-[#135467] hover:text-white font-medium';
  };

  // Um único módulo aberto por vez mantém a navegação curta e previsível.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const activeGroup = getGroupForRoute(activeRoute);
    return activeGroup ? { [activeGroup]: true } : {};
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const activeSec = getSectionForRoute(activeRoute);
    return activeSec ? { [activeSec]: true } : { 'Operação Ambiental': true };
  });

  useEffect(() => {
    const activeGroup = getGroupForRoute(activeRoute);
    if (activeGroup) {
      setOpenGroups((prev) => ({ ...prev, [activeGroup]: true }));
    }
    const activeSec = getSectionForRoute(activeRoute);
    if (activeSec) {
      setOpenSections((prev) => ({ ...prev, [activeSec]: true }));
    }
  }, [activeRoute]);

  // Filtro de busca instantâneo
  const [searchFilter, setSearchFilter] = useState('');

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => (prev[groupId] ? {} : { [groupId]: true }));
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNav = (item: MenuItem | TopDirectItem, e?: React.MouseEvent) => {
    if (item.disabled) {
      if (e) e.preventDefault();
      return;
    }

    if (item.route) {
      if (e) e.preventDefault();
      if (onNavigate) onNavigate(item.route);
      if (onCloseMobile) onCloseMobile();
      return;
    }

    if (item.href) {
      if (onCloseMobile) onCloseMobile();
    }
  };

  // Normalização para busca por aproximação (insensível a acentos, cedilhas e maiúsculas/minúsculas)
  const normalizeSearchText = (text: string) =>
    (text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  // Filtragem dos itens de menu em tempo real por aproximação
  const filteredGroups = useMemo(() => {
    if (!searchFilter.trim()) return SEIA_V2_MENU_GROUPS;

    const term = normalizeSearchText(searchFilter);

    return SEIA_V2_MENU_GROUPS.map((group) => {
      const groupMatches = normalizeSearchText(group.label).includes(term);

      const matchingItems = group.items.filter(
        (item) =>
          normalizeSearchText(item.label).includes(term) ||
          (item.subgroup && normalizeSearchText(item.subgroup).includes(term)) ||
          (item.badge && normalizeSearchText(item.badge).includes(term))
      );

      if (groupMatches || matchingItems.length > 0) {
        return {
          ...group,
          items: groupMatches ? group.items : matchingItems,
        };
      }
      return null;
    }).filter(Boolean) as MenuGroup[];
  }, [searchFilter]);

  const filteredDirectItems = useMemo(() => {
    if (!searchFilter.trim()) return TOP_DIRECT_ITEMS;
    const term = normalizeSearchText(searchFilter);
    return TOP_DIRECT_ITEMS.filter(
      (item) =>
        normalizeSearchText(item.label).includes(term) ||
        (item.badge && normalizeSearchText(item.badge).includes(term))
    );
  }, [searchFilter]);

  const isGroupExpanded = (groupId: string) => {
    if (searchFilter.trim()) return true;
    return !!openGroups[groupId];
  };

  const isSectionExpanded = (section: string) => {
    if (searchFilter.trim()) return true;
    return !!openSections[section];
  };

  const renderBadge = (badge?: string, variant?: string) => {
    if (!badge) return null;

    if (badge === 'Em breve' || variant === 'slate') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700 select-none">
          {badge}
        </span>
      );
    }

    if (variant === 'sage' || badge === 'V2' || badge === 'F-DUC') {
      return (
        <span
          className={cn(
            'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
            isDarkMode
              ? 'bg-slate-800 text-emerald-400 border border-slate-700'
              : isVizoraGreen
              ? 'bg-[#103d30] text-[#a7f3d0] border border-[#206954]'
              : isInemaLight
              ? 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border border-[var(--badge-success-border)]'
              : 'bg-[#165a6e] text-emerald-300 border border-[#207087]'
          )}
        >
          {badge}
        </span>
      );
    }

    if (badge === '3' || variant === 'rose') {
      return (
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[var(--badge-critical-bg)] text-[var(--badge-critical-text)] border border-[var(--badge-critical-border)]">
          {badge}
        </span>
      );
    }

    return (
      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
        {badge}
      </span>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* Overlay Mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-x-0 top-16 bottom-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden transition-opacity"
        />
      )}

      {/* Aside Container: h-screen fixa à esquerda com colapso compacto de 64px (w-16) */}
      <aside
        className={cn(
          'flex flex-col fixed top-16 bottom-0 left-0 z-40 lg:static lg:z-auto lg:h-full shrink-0 transition-all duration-200 ease-in-out shadow-xl lg:shadow-none overflow-hidden',
          isDarkMode
            ? 'bg-slate-950 border-r-0 text-slate-300'
            : isVizoraGreen
            ? 'bg-[#185846] border-r border-[#206954] text-[#bce0d3]'
            : isInemaLight
              ? 'bg-[var(--sidebar-bg)] border-r-0 text-[var(--sidebar-text)]'
            : 'bg-[#0c4353] border-r border-[#145366] text-[#9ec3cc]',
          isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'lg:w-16' : 'lg:w-72'
        )}
      >
        <div
          className={cn(
            'h-full flex flex-col shrink-0 transition-all duration-200',
            isCollapsed ? 'w-16 items-center' : 'w-64 lg:w-72'
          )}
        >
          {/* Filtro da navegação */}
          {isCollapsed ? (
            <div className="p-3 pb-2 flex justify-center">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onToggleCollapse}
                    className={cn(
                      'h-10 w-10 inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 cursor-pointer',
                      isDarkMode
                        ? 'text-slate-400 hover:bg-slate-900 hover:text-white focus-visible:ring-emerald-500/50'
                        : isVizoraGreen
                        ? 'text-[#bce0d3] hover:bg-[#1f6853] hover:text-white focus-visible:ring-emerald-300/50'
                        : isInemaLight
                        ? 'text-[var(--nav-item-text)] hover:bg-[var(--nav-item-hover-bg)] hover:text-[var(--nav-item-selected-text)] focus-visible:ring-[var(--color-green-alpha-32)]'
                        : 'text-[#9ec3cc] hover:bg-[#135467] hover:text-white focus-visible:ring-sky-300/50'
                    )}
                    aria-label="Abrir busca da sidebar"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>Buscar no menu</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className={cn("p-3 pb-2", isDarkMode ? "border-slate-800" : isVizoraGreen ? "border-[#206954]" : isInemaLight ? "" : "border-[#145366]")}>
              <div className="relative min-w-0 flex-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filtrar menu..."
                  className={cn(
                    'w-full pl-8 pr-7 py-1.5 text-xs rounded-xl transition-all focus:outline-none focus:ring-1',
                    isDarkMode
                      ? 'bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 focus:ring-emerald-500 focus:border-emerald-500'
                      : isVizoraGreen
                      ? 'bg-[#103d30]/85 border border-[#23755e] text-white placeholder:text-[#97c7b6] focus:ring-emerald-400 focus:border-emerald-400'
                      : isInemaLight
                      ? 'bg-[var(--input-bg)] hover:bg-[var(--color-surface-raised)] focus:bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] focus:ring-[var(--input-border-focus)] focus:border-[var(--input-border-focus)]'
                      : 'bg-[#083340]/85 border border-[#155b70] text-white placeholder:text-[#7ea8b3] focus:ring-sky-400 focus:border-sky-400'
                  )}
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
                    title="Limpar filtro"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Lista de Navegação */}
          {isCollapsed ? (
            <nav className={cn("flex-1 overflow-y-auto py-3 px-2 space-y-1.5 flex flex-col items-center select-none w-full", getSidebarScrollClass())}>
              {/* Itens Raiz Diretos */}
              {TOP_DIRECT_ITEMS.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || Home;
                const isActive = activeRoute === item.route;

                return (
                  <Tooltip key={item.id} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <a
                        id={item.htmlId || item.id}
                        data-testid={`nav-${item.label}`}
                        href={item.href}
                        onClick={(e) => handleNav(item, e)}
                        className={cn(
                          'h-10 w-10 flex items-center justify-center rounded-md transition-all duration-150 cursor-pointer',
                          isActive
                            ? isDarkMode
                              ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700'
                              : isVizoraGreen
                              ? 'bg-[#22725b] text-white font-bold shadow-xs border border-[#2c8d71]'
                              : isInemaLight
                              ? 'bg-[var(--nav-item-selected-bg)] text-[var(--nav-item-selected-text)] font-bold'
                              : 'bg-[#165a6e] text-white font-bold shadow-xs border border-[#207087]'
                            : isDarkMode
                            ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            : isVizoraGreen
                            ? 'text-[#bce0d3] hover:bg-[#1f6853] hover:text-white'
                            : isInemaLight
                            ? 'text-[var(--nav-item-text)] hover:bg-[var(--nav-item-hover-bg)] hover:text-[var(--nav-item-selected-text)]'
                            : 'text-[#9ec3cc] hover:bg-[#135467] hover:text-white',
                          item.disabled && 'opacity-45 cursor-not-allowed'
                        )}
                        aria-label={item.label}
                        aria-disabled={item.disabled || undefined}
                        tabIndex={item.disabled ? -1 : undefined}
                      >
                        <IconComponent className="w-4 h-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              {/* Divisor sutil */}
              <div className={cn("w-6 h-px my-1", isDarkMode ? "bg-slate-800" : isVizoraGreen ? "bg-[#206954]" : isInemaLight ? "bg-slate-200" : "bg-[#145366]")} />

              {/* Seções Canônicas na Sidebar Colapsada */}
              {SIDEBAR_SECTIONS.map((section) => {
                const SectionIcon = ICON_MAP[section.icon] || Layers;
                const sectionGroups = SEIA_V2_MENU_GROUPS.filter(
                  (group) => group.section === section.label
                );
                const isActive = sectionGroups.some(
                  (group) =>
                    activeRoute === group.route ||
                    group.items.some((item) => item.route === activeRoute)
                );

                return (
                  <Tooltip key={section.label} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        data-testid={`nav-section-${section.label}`}
                        onClick={() => {
                          setOpenSections((prev) => ({ ...prev, [section.label]: true }));
                          onToggleCollapse?.();
                        }}
                        className={cn(
                          'h-10 w-10 flex items-center justify-center rounded-md transition-all duration-150 cursor-pointer',
                          isActive
                            ? isDarkMode
                              ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700'
                              : isVizoraGreen
                              ? 'bg-[#22725b] text-white font-bold shadow-xs border border-[#2c8d71]'
                              : isInemaLight
                              ? 'bg-[#d1e1de] text-[#002f25] font-bold'
                              : 'bg-[#165a6e] text-white font-bold shadow-xs border border-[#207087]'
                            : isDarkMode
                            ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            : isVizoraGreen
                            ? 'text-[#bce0d3] hover:bg-[#1f6853] hover:text-white'
                            : isInemaLight
                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            : 'text-[#9ec3cc] hover:bg-[#135467] hover:text-white'
                        )}
                        aria-label={section.label}
                      >
                        <SectionIcon className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12}>
                      {section.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          ) : (
            /* Lista de Navegação com Scroll customizado (Expandida) */
            <nav className={cn("flex-1 overflow-y-auto pt-2 pb-6 px-2.5 space-y-0.5 select-none", getSidebarScrollClass())}>
              {/* Itens Diretos do Topo */}
              {filteredDirectItems.length > 0 && (
                <div className="space-y-0.5 pb-2">
                  {filteredDirectItems.map((item) => {
                    const IconComponent = ICON_MAP[item.icon] || Home;
                    const isActive = activeRoute === item.route;

                    return (
                      <a
                        key={item.id}
                        id={item.htmlId || item.id}
                        data-testid={item.htmlId || item.id}
                        href={item.href}
                        onClick={(e) => handleNav(item, e)}
                        className={cn(
                          'group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs md:text-sm transition-all duration-150 cursor-pointer',
                          getDirectItemClass(isActive),
                          item.disabled && 'opacity-45 cursor-not-allowed'
                        )}
                        aria-disabled={item.disabled || undefined}
                        tabIndex={item.disabled ? -1 : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={cn(
                              'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                              isActive
                                ? isDarkMode
                                  ? 'bg-slate-700 text-white shadow-xs'
                                  : isVizoraGreen
                                  ? 'bg-[#298369] text-white shadow-xs'
                                  : isInemaLight
                                  ? 'bg-[var(--sidebar-item-active-indicator)] text-white'
                                  : 'bg-[#1d6b82] text-white shadow-xs'
                                : isDarkMode
                                ? 'bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white'
                                : isVizoraGreen
                                ? 'bg-[#103d30] text-[#bce0d3] group-hover:bg-[#1f6853] group-hover:text-white'
                                : isInemaLight
                                ? 'bg-[var(--color-surface-hover)] text-[var(--color-text-tertiary)] group-hover:bg-[var(--sidebar-item-hover-bg)] group-hover:text-[var(--sidebar-item-active-text)]'
                                : 'bg-[#083340] text-[#9ec3cc] group-hover:bg-[#135467] group-hover:text-white'
                            )}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {renderBadge(item.badge)}
                          {isActive && (
                            <span
                              className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                isDarkMode
                                  ? 'bg-emerald-400'
                                  : isVizoraGreen
                                  ? 'bg-[#34D399]'
                                  : isInemaLight
                                  ? 'bg-[var(--sidebar-item-active-indicator)]'
                                  : 'bg-[#34D399]'
                              )}
                            />
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Grupos Organizados por Seções Canônicas com Cabeçalho e Acordeão */}
              {filteredGroups.map((group, index) => {
                const GroupIcon = ICON_MAP[group.icon] || Sliders;
                const startsSection = index === 0 || group.section !== filteredGroups[index - 1].section;
                const sectionExpanded = isSectionExpanded(group.section);
                const sectionHeading = startsSection ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(group.section)}
                    aria-expanded={sectionExpanded}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-left cursor-pointer transition-colors select-none',
                      index > 0 ? 'mt-3 pt-3 border-t' : 'mt-1 pt-1',
                      isDarkMode
                        ? 'text-slate-500 border-slate-800 hover:text-slate-300'
                        : isVizoraGreen
                        ? 'text-[#97c7b6] border-[#206954] hover:text-white'
                        : isInemaLight
                        ? 'text-[var(--color-text-tertiary)] border-[var(--color-border-subtle)] hover:text-[var(--nav-item-selected-text)]'
                        : 'text-[#7ea8b3] border-[#145366] hover:text-white'
                    )}
                  >
                    <span>{group.section}</span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 shrink-0 transition-transform duration-200',
                        sectionExpanded ? 'rotate-0' : '-rotate-90'
                      )}
                    />
                  </button>
                ) : null;

                // Item Direto (ex.: Design System)
                if (group.isDirectItem) {
                  const isDirectActive = activeRoute === group.route;

                  return (
                    <React.Fragment key={group.id}>
                      {sectionHeading}
                      <div
                        aria-hidden={!sectionExpanded}
                        inert={!sectionExpanded ? true : undefined}
                        className={cn(
                          'grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none',
                          sectionExpanded
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                        )}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="pt-0.5">
                            <a
                              id={group.htmlId || group.id}
                              data-testid={`nav-${group.label}`}
                              href={group.href || '#'}
                              onClick={(e) => {
                                if (group.route && onNavigate) {
                                  e.preventDefault();
                                  onNavigate(group.route);
                                  if (onCloseMobile) onCloseMobile();
                                }
                              }}
                              className={cn(
                                'group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs md:text-sm transition-all duration-150 cursor-pointer',
                                getDirectItemClass(isDirectActive)
                              )}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={cn(
                                    'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                                    isDirectActive
                                      ? isDarkMode
                                        ? 'bg-slate-700 text-white shadow-xs'
                                        : isVizoraGreen
                                        ? 'bg-[#298369] text-white shadow-xs'
                                        : isInemaLight
                                        ? 'bg-[#0F4C3A] text-white'
                                        : 'bg-[#1d6b82] text-white shadow-xs'
                                      : isDarkMode
                                      ? 'bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white'
                                      : isVizoraGreen
                                      ? 'bg-[#103d30] text-[#bce0d3] group-hover:bg-[#1f6853] group-hover:text-white'
                                      : isInemaLight
                                      ? 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                                      : 'bg-[#083340] text-[#9ec3cc] group-hover:bg-[#135467] group-hover:text-white'
                                  )}
                                >
                                  <GroupIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className="truncate">{group.label}</span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {renderBadge(group.badge, group.badgeVariant)}
                                {isDirectActive && (
                                  <span
                                    className={cn(
                                      'w-1.5 h-1.5 rounded-full',
                                      isDarkMode
                                        ? 'bg-emerald-400'
                                        : isVizoraGreen
                                        ? 'bg-[#34D399]'
                                        : isInemaLight
                                        ? 'bg-[#0F4C3A]'
                                        : 'bg-[#34D399]'
                                    )}
                                  />
                                )}
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                }

                const expanded = isGroupExpanded(group.id);
                const hasActiveChild = group.items.some(
                  (it) => it.route && it.route === activeRoute
                );

                return (
                  <React.Fragment key={group.id}>
                    {sectionHeading}
                    <div
                      aria-hidden={!sectionExpanded}
                      inert={!sectionExpanded ? true : undefined}
                      className={cn(
                        'grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none',
                        sectionExpanded
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                      )}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="pt-0.5">
                          {/* Cabeçalho do Grupo (Botão de Acordeão com chevron no estilo GLA) */}
                          <button
                            id={`btn-${group.id}`}
                            data-testid={`nav-${group.label}`}
                            onClick={() => toggleGroup(group.id)}
                            disabled={group.disabled}
                            aria-expanded={expanded}
                            aria-controls={`group-${group.id}`}
                            className={cn(
                              'w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-150 cursor-pointer text-left',
                              getGroupBtnClass(hasActiveChild),
                              group.disabled && 'opacity-55 cursor-not-allowed'
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={cn(
                                  'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-colors',
                                  hasActiveChild
                                    ? isDarkMode
                                      ? 'bg-slate-800 text-white border-slate-700'
                                      : isVizoraGreen
                                      ? 'bg-[#298369] text-white border-[#298369]'
                                      : isInemaLight
                                      ? 'bg-slate-200 border-slate-300 text-[#0F4C3A]'
                                      : 'bg-[#1d6b82] text-white border-[#1d6b82]'
                                    : isDarkMode
                                    ? 'bg-slate-900 border-slate-800 text-slate-400'
                                    : isVizoraGreen
                                    ? 'bg-[#103d30] border-[#185846] text-[#bce0d3]'
                                    : isInemaLight
                                    ? 'bg-slate-100 border-slate-200 text-slate-500'
                                    : 'bg-[#083340] border-[#0c4353] text-[#9ec3cc]'
                                )}
                              >
                                <GroupIcon className="w-3.5 h-3.5" />
                              </div>
                              <span className="min-w-0 text-xs md:text-sm font-semibold leading-4 truncate">
                                {group.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {renderBadge(group.badge, group.badgeVariant)}
                              {!group.disabled && (
                                <ChevronRight
                                  className={cn(
                                    'w-3.5 h-3.5 transition-transform duration-200 text-slate-400',
                                    expanded ? 'rotate-90 text-slate-600 dark:text-slate-200' : ''
                                  )}
                                />
                              )}
                            </div>
                          </button>

                          {/* Subitens Expansíveis */}
                          {!group.disabled && (
                            <div
                              aria-hidden={!expanded}
                              inert={!expanded ? true : undefined}
                              className={cn(
                                'grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none',
                                expanded
                                  ? 'grid-rows-[1fr] opacity-100'
                                  : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                              )}
                            >
                              <div
                                id={`group-${group.id}`}
                                className={cn(
                                  'min-h-0 overflow-hidden mt-1 ml-3.5 pl-3 border-l space-y-0.5',
                                  isDarkMode
                                    ? 'border-slate-800'
                                    : isVizoraGreen
                                    ? 'border-[#206954]'
                                    : isInemaLight
                                    ? 'border-slate-200'
                                    : 'border-[#145366]'
                                )}
                              >
                                {group.items.map((subItem) => {
                                  const isSubActive = activeRoute === subItem.route;

                                  return (
                                    <a
                                      key={subItem.id}
                                      id={subItem.htmlId || subItem.id}
                                      data-testid={`subnav-${subItem.label}`}
                                      href={subItem.href || '#'}
                                      onClick={(e) => {
                                        if (subItem.disabled) {
                                          e.preventDefault();
                                        } else if (subItem.route && onNavigate) {
                                          e.preventDefault();
                                          onNavigate(subItem.route);
                                          if (onCloseMobile) onCloseMobile();
                                        }
                                      }}
                                      className={cn(
                                        'group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150',
                                        getSubItemClass(isSubActive, subItem.disabled)
                                      )}
                                      aria-disabled={subItem.disabled || undefined}
                                      tabIndex={subItem.disabled ? -1 : undefined}
                                    >
                                      <span className="truncate pr-1">{subItem.label}</span>

                                      <div className="flex items-center gap-1 shrink-0">
                                        {subItem.badge && (
                                          <span
                                            id={
                                              subItem.id === 'fisc-painel-interno-difis'
                                                ? 'sidebarBadgeEmergencias'
                                                : undefined
                                            }
                                            className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[var(--color-status-critical)] text-white shadow-2xs"
                                          >
                                            {subItem.badge}
                                          </span>
                                        )}
                                      </div>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* Estado Vazio de Busca */}
              {filteredGroups.length === 0 && filteredDirectItems.length === 0 && (
                <div className="py-8 text-center px-4">
                  <p className="text-xs text-slate-500 font-medium">
                    Nenhum item encontrado para &quot;{searchFilter}&quot;
                  </p>
                  <button
                    onClick={() => setSearchFilter('')}
                    className="mt-2 text-xs text-[var(--color-text-link)] hover:text-[var(--color-text-link-hover)] hover:underline font-semibold"
                  >
                    Limpar filtro
                  </button>
                </div>
              )}
            </nav>
          )}

          {/* Rodapé Fixo da Sidebar: Assistente Inema */}
          {isCollapsed ? (
            <div
              className={cn(
                'p-3 border-t shrink-0 flex items-center justify-center w-full bg-transparent transition-colors',
                isDarkMode
                  ? 'border-slate-800'
                  : isVizoraGreen
                  ? 'border-[#206954]'
                  : isInemaLight
                  ? 'border-[var(--color-border-subtle)]'
                  : 'border-[#145366]'
              )}
            >
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    id="btn-assistente-inema"
                    data-testid="btn-assistente-inema"
                    onClick={() => {
                      alert('Assistente IA INEMA ativado. Em que posso auxiliá-lo com as demandas de Processos e Fiscalização do SEIA V2?');
                    }}
                    className={cn(
                      'h-10 w-10 flex items-center justify-center rounded-md active:scale-95 group cursor-pointer transition-colors',
                      isDarkMode
                        ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                        : 'text-[var(--nav-item-text)] hover:bg-[var(--nav-item-hover-bg)] hover:text-[var(--nav-item-selected-text)]'
                    )}
                    aria-label="Assistente INEMA"
                  >
                    <Sparkles className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  Assistente INEMA
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div
              className={cn(
                'p-3 border-t shrink-0 bg-transparent transition-colors',
                isDarkMode
                  ? 'border-slate-800'
                  : isVizoraGreen
                  ? 'border-[#206954]'
                  : isInemaLight
                  ? 'border-[var(--color-border-subtle)]'
                  : 'border-[#145366]'
              )}
            >
              <button
                id="btn-assistente-inema"
                data-testid="btn-assistente-inema"
                onClick={() => {
                  alert('Assistente IA INEMA ativado. Em que posso auxiliá-lo com as demandas de Processos e Fiscalização do SEIA V2?');
                }}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 active:scale-98 group cursor-pointer shadow-xs',
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    : isVizoraGreen
                    ? 'bg-[#155342] hover:bg-[#1a624f] text-white'
                    : isInemaLight
                    ? 'bg-[#002f25] hover:bg-[#0a473a] text-white'
                    : 'bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white'
                )}
              >
                <Sparkles className="w-4 h-4 text-emerald-300 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span className="font-semibold tracking-tight">Assistente INEMA</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
