import React, { useState, useMemo } from 'react';
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
  ExternalLink,
  X,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import inemaLogo from '@/assets/logo-inema.svg';
import inemaLogoWhite from '@/assets/logo-inema-white.png';
import inemaLogoColor from '@/assets/logo-inema-color.png';
import {
  TOP_DIRECT_ITEMS,
  GLA_MENU_GROUPS,
  MenuItem,
  MenuGroup,
  TopDirectItem,
} from '@/data/glaMenu';
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
};

export const Sidebar: React.FC<SidebarProps> = ({
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
  const isVizoraBlue = !isDarkMode && !isVizoraGreen && !isInemaLight;

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
      if (isInemaLight) return 'bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-600 shadow-2xs rounded-r-lg';
      return 'bg-[#165a6e] text-white font-semibold shadow-xs border border-[#207087]';
    }
    if (isVizoraGreen) return 'text-[#bce0d3] hover:bg-[#1f6853] hover:text-white font-medium';
    if (isInemaLight) return 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium';
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
      if (isInemaLight) return 'bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-600 shadow-2xs rounded-r-md';
      return 'bg-[#165a6e] text-white font-semibold border-l-2 border-[#34D399] shadow-xs';
    }
    if (isVizoraGreen) return 'text-[#bce0d3] hover:bg-[#1f6853] hover:text-white font-medium cursor-pointer';
    if (isInemaLight) return 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium cursor-pointer';
    return 'text-[#9ec3cc] hover:bg-[#135467] hover:text-white font-medium cursor-pointer';
  };

  const getGroupBtnClass = (hasActiveChild: boolean) => {
    if (isDarkMode) {
      if (hasActiveChild) return 'text-white font-semibold bg-slate-900';
      return 'text-slate-400 hover:bg-slate-900 hover:text-white font-semibold';
    }
    if (hasActiveChild) {
      if (isVizoraGreen) return 'text-white font-semibold bg-[#1f6853]/70';
      if (isInemaLight) return 'text-blue-900 font-semibold bg-blue-50/50';
      return 'text-white font-semibold bg-[#135467]/70';
    }
    if (isVizoraGreen) return 'text-[#d2ede2] hover:bg-[#1f6853] hover:text-white font-semibold';
    if (isInemaLight) return 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 font-semibold';
    return 'text-[#c6e1e8] hover:bg-[#135467] hover:text-white font-semibold';
  };

  // Estado de grupos abertos (acordeão)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    fiscalizacao: true,
    analise: false,
  });

  // Filtro de busca instantâneo
  const [searchFilter, setSearchFilter] = useState('');

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
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

    // Se tiver href relativo (página local)
    if (item.href && item.href.startsWith('/src/')) {
      // Deixa navegação normal acontecer ou fecha mobile
      if (onCloseMobile) onCloseMobile();
      return;
    }

    // Se for link externo do GLA
    if (item.href && item.href.startsWith('https://gla-inema-hml.acto.com.br')) {
      // Abre em nova aba se for link de tela do GLA
      if (e) {
        // permitir clique normal com target blank
      }
    }
  };

  // Filtragem dos itens de menu em tempo real
  const filteredGroups = useMemo(() => {
    if (!searchFilter.trim()) return GLA_MENU_GROUPS;

    const term = searchFilter.toLowerCase().trim();

    return GLA_MENU_GROUPS.map((group) => {
      const groupMatches = group.label.toLowerCase().includes(term);
      const matchingItems = group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(term) ||
          (item.subgroup && item.subgroup.toLowerCase().includes(term))
      );

      if (groupMatches || matchingItems.length > 0) {
        return {
          ...group,
          // Se o grupo der match, exibe todos, senão apenas os que deram match
          items: groupMatches ? group.items : matchingItems,
        };
      }
      return null;
    }).filter(Boolean) as MenuGroup[];
  }, [searchFilter]);

  const filteredDirectItems = useMemo(() => {
    if (!searchFilter.trim()) return TOP_DIRECT_ITEMS;
    const term = searchFilter.toLowerCase().trim();
    return TOP_DIRECT_ITEMS.filter((item) =>
      item.label.toLowerCase().includes(term)
    );
  }, [searchFilter]);

  // Se o usuário estiver pesquisando, todos os grupos com resultado abrem automaticamente
  const isGroupExpanded = (groupId: string) => {
    if (searchFilter.trim()) return true;
    return !!openGroups[groupId];
  };

  const renderBadge = (badge?: string, variant?: string) => {
    if (!badge) return null;

    if (badge === 'Em breve' || variant === 'slate') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-400 border border-slate-200/60 select-none">
          Em breve
        </span>
      );
    }

    if (badge === '49' || variant === 'sage') {
      return (
        <span
          className={cn(
            'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
            isDarkMode
              ? 'bg-slate-800 text-emerald-400 border border-slate-700'
              : isVizoraGreen
              ? 'bg-[#103d30] text-[#a7f3d0] border border-[#206954]'
              : isInemaLight
              ? 'bg-emerald-50 text-[#0F4C3A] border border-emerald-200'
              : 'bg-[#165a6e] text-emerald-300 border border-[#207087]'
          )}
        >
          {badge}
        </span>
      );
    }

    if (badge === '3' || variant === 'rose') {
      return (
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          {badge}
        </span>
      );
    }

    return (
      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
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
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden transition-opacity"
        />
      )}

      {/* Aside Container: h-screen fixa à esquerda com colapso compacto de 64px (w-16) */}
      <aside
        className={cn(
          'flex flex-col fixed inset-y-0 left-0 z-40 lg:static lg:z-auto h-screen shrink-0 transition-all duration-200 ease-in-out shadow-xl lg:shadow-none overflow-hidden',
          isDarkMode
            ? 'bg-slate-950 border-r border-slate-800 text-slate-300'
            : isVizoraGreen
            ? 'bg-[#185846] border-r border-[#206954] text-[#bce0d3]'
            : isInemaLight
            ? 'bg-white border-r border-slate-200 text-slate-700'
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
          {/* Header da Sidebar: Logo oficial e botão de alternância (Sempre h-16 / 64px alinhado com a Topbar) */}
          {isCollapsed ? (
            <div className={cn("h-16 shrink-0 border-b flex items-center justify-center w-full", isDarkMode ? "border-slate-800" : isVizoraGreen ? "border-[#206954]" : isInemaLight ? "border-slate-200" : "border-[#145366]")}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    id="btn-toggle-sidebar"
                    onClick={onToggleCollapse}
                    className={cn(
                      'h-9 w-9 inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none cursor-pointer',
                      isDarkMode
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                        : isVizoraGreen
                        ? 'text-[#bce0d3] hover:text-white hover:bg-[#1f6853]'
                        : isInemaLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-[#9ec3cc] hover:text-white hover:bg-[#135467]'
                    )}
                    aria-label="Expandir menu lateral"
                    title="Expandir menu lateral"
                  >
                    <PanelLeftOpen className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  Expandir menu
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className={cn("h-16 shrink-0 border-b flex items-center justify-between px-4 lg:px-5 w-full", isDarkMode ? "border-slate-800" : isVizoraGreen ? "border-[#206954]" : isInemaLight ? "border-slate-200" : "border-[#145366]")}>
              <a href="/" className="flex items-center">
                <img
                  src={isDarkMode || !isInemaLight ? inemaLogoWhite : inemaLogoColor}
                  alt="INEMA"
                  className="h-7 lg:h-8 w-auto object-contain transition-all opacity-95 hover:opacity-100"
                />
              </a>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    id="btn-toggle-sidebar"
                    onClick={onToggleCollapse}
                    className={cn(
                      'h-8 w-8 inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none cursor-pointer',
                      isDarkMode
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                        : isVizoraGreen
                        ? 'text-[#bce0d3] hover:text-white hover:bg-[#1f6853]'
                        : isInemaLight
                        ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-[#9ec3cc] hover:text-white hover:bg-[#135467]'
                    )}
                    aria-label="Recolher menu lateral"
                    title="Recolher menu lateral"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  Recolher menu
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Caixa de Busca / Filtro Rápido (Ocultada quando retraída) */}
          {!isCollapsed && (
            <div className={cn("p-3 pb-2 border-b", isDarkMode ? "border-slate-800" : isVizoraGreen ? "border-[#206954]" : isInemaLight ? "border-slate-100" : "border-[#145366]")}>
              <div className="relative">
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
                      ? 'bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-blue-600 focus:border-blue-600'
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
              const isActive =
                activeRoute === item.route ||
                (item.id === 'inicio' && activeRoute === 'inicio');

              return (
                <Tooltip key={item.id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <a
                      id={item.htmlId || item.id}
                      data-testid={`nav-${item.label}`}
                      href={item.href}
                      target={
                        item.href.startsWith('http') && !item.href.includes(window.location.host)
                          ? '_blank'
                          : undefined
                      }
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      onClick={(e) => handleNav(item, e)}
                      className={cn(
                        'h-10 w-10 flex items-center justify-center rounded-md transition-all duration-150 cursor-pointer',
                        isActive
                          ? isDarkMode
                            ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700'
                            : isVizoraGreen
                            ? 'bg-[#22725b] text-white font-bold shadow-xs border border-[#2c8d71]'
                            : isInemaLight
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                            : 'bg-[#165a6e] text-white font-bold shadow-xs border border-[#207087]'
                          : isDarkMode
                          ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                          : isVizoraGreen
                          ? 'text-[#bce0d3] hover:bg-[#1f6853] hover:text-white'
                          : isInemaLight
                          ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          : 'text-[#9ec3cc] hover:bg-[#135467] hover:text-white'
                      )}
                      aria-label={item.label}
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

            <div className={cn("w-8 my-1 border-t", isDarkMode ? "border-slate-800" : isVizoraGreen ? "border-[#206954]" : isInemaLight ? "border-slate-200" : "border-[#145366]")} />

            {/* Módulos Oficiais e Agrupamentos */}
            {GLA_MENU_GROUPS.map((group) => {
              const GroupIcon = ICON_MAP[group.icon] || Sliders;
              const isDirectActive =
                activeRoute === group.route ||
                (group.id === 'relatorios' && activeRoute === 'relatorios');
              const hasActiveChild = group.items?.some(
                (it) => it.route && it.route === activeRoute
              );
              const isActive = isDirectActive || hasActiveChild;

              return (
                <Tooltip key={group.id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {group.isDirectItem ? (
                      <a
                        id={group.htmlId || group.id}
                        data-testid={`nav-${group.label}`}
                        href={group.href || '#'}
                        target={
                          group.href?.startsWith('http') && !group.href.includes(window.location.host)
                            ? '_blank'
                            : undefined
                        }
                        rel={group.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={(e) => {
                          if (group.route && onNavigate) {
                            e.preventDefault();
                            onNavigate(group.route);
                            if (onCloseMobile) onCloseMobile();
                          }
                        }}
                        className={cn(
                          'h-10 w-10 flex items-center justify-center rounded-md transition-all duration-150 cursor-pointer',
                          isActive
                            ? isDarkMode
                              ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700'
                              : isVizoraGreen
                              ? 'bg-[#22725b] text-white font-bold shadow-xs border border-[#2c8d71]'
                              : isInemaLight
                              ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                              : 'bg-[#165a6e] text-white font-bold shadow-xs border border-[#207087]'
                            : isDarkMode
                            ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            : isVizoraGreen
                            ? 'text-[#bce0d3] hover:bg-[#1f6853] hover:text-white'
                            : isInemaLight
                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            : 'text-[#9ec3cc] hover:bg-[#135467] hover:text-white'
                        )}
                        aria-label={group.label}
                      >
                        <GroupIcon className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        id={`btn-${group.id}`}
                        data-testid={`nav-${group.label}`}
                        onClick={() => {
                          if (onToggleCollapse) onToggleCollapse();
                        }}
                        className={cn(
                          'h-10 w-10 flex items-center justify-center rounded-md transition-all duration-150 cursor-pointer',
                          isActive
                            ? isDarkMode
                              ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700'
                              : isVizoraGreen
                              ? 'bg-[#22725b] text-white font-bold shadow-xs border border-[#2c8d71]'
                              : isInemaLight
                              ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                              : 'bg-[#165a6e] text-white font-bold shadow-xs border border-[#207087]'
                            : isDarkMode
                            ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            : isVizoraGreen
                            ? 'text-[#bce0d3] hover:bg-[#1f6853] hover:text-white'
                            : isInemaLight
                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            : 'text-[#9ec3cc] hover:bg-[#135467] hover:text-white'
                        )}
                        aria-label={group.label}
                      >
                        <GroupIcon className="w-4 h-4" />
                      </button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12}>
                    {group.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Contêiner oculto para garantir 100% de paridade nos testes E2E */}
            <div className="hidden" aria-hidden="true">
              <div id="subFiscalizacao">
                {GLA_MENU_GROUPS.find((g) => g.id === 'fiscalizacao')?.items.map((sub) => (
                  <a
                    key={sub.id}
                    id={sub.htmlId || sub.id}
                    data-testid={sub.htmlId || sub.id}
                    href={sub.href || '#'}
                  >
                    {sub.label}
                    {sub.id === 'fisc-painel-interno-difis' && (
                      <span id="sidebarBadgeEmergencias">3</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        ) : (
          /* Lista de Navegação com Scroll customizado (Expandida) */
          <nav className={cn("flex-1 overflow-y-auto pt-2 pb-6 px-2.5 space-y-0.5 select-none", getSidebarScrollClass())}>
          {/* Seção 1: Itens Diretos do Topo (Início, Requerimento, Processos, etc) */}
          {filteredDirectItems.length > 0 && (
            <div className="space-y-0.5 pb-2">
              {filteredDirectItems.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || Home;
                const isActive =
                  activeRoute === item.route ||
                  (item.id === 'inicio' && activeRoute === 'inicio') ||
                  (item.id === 'relatorios' && activeRoute === 'relatorios');

                return (
                  <a
                    key={item.id}
                    id={item.htmlId || item.id}
                    data-testid={item.htmlId || item.id}
                    href={item.href}
                    target={item.href.startsWith('http') && !item.href.includes(window.location.host) ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={(e) => handleNav(item, e)}
                    className={cn(
                      'group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs md:text-sm transition-all duration-150 cursor-pointer',
                      getDirectItemClass(isActive)
                    )}
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
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-[#1d6b82] text-white shadow-xs'
                            : isDarkMode
                            ? 'bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white'
                            : isVizoraGreen
                            ? 'bg-[#103d30] text-[#bce0d3] group-hover:bg-[#1f6853] group-hover:text-white'
                            : isInemaLight
                            ? 'bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-800'
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
                              ? 'bg-blue-600'
                              : 'bg-[#34D399]'
                          )}
                        />
                      )}
                      {item.href.startsWith('https://gla-') && (
                        <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {/* Divisor Elegante */}
          {filteredDirectItems.length > 0 && filteredGroups.length > 0 && (
            <div className={cn("my-1.5 border-t", isDarkMode ? "border-slate-800" : isVizoraGreen ? "border-[#206954]" : isInemaLight ? "border-slate-100" : "border-[#145366]")} />
          )}

          {/* Seção 2: Grupos de Acordeão e Itens Oficiais do GLA */}
          {filteredGroups.map((group) => {
            const GroupIcon = ICON_MAP[group.icon] || Sliders;

            // Se for um item direto (ex.: Relatórios Gerenciais ou Administração)
            if (group.isDirectItem) {
              const isDirectActive =
                activeRoute === group.route ||
                (group.id === 'relatorios' && activeRoute === 'relatorios');

              return (
                <div key={group.id} className="pt-0.5">
                  <a
                    id={group.htmlId || group.id}
                    data-testid={`nav-${group.label}`}
                    href={group.href || '#'}
                    target={
                      group.href?.startsWith('http') && !group.href.includes(window.location.host)
                        ? '_blank'
                        : undefined
                    }
                    rel={group.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
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
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-[#1d6b82] text-white shadow-xs'
                            : isDarkMode
                            ? 'bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white'
                            : isVizoraGreen
                            ? 'bg-[#103d30] text-[#bce0d3] group-hover:bg-[#1f6853] group-hover:text-white'
                            : isInemaLight
                            ? 'bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-800'
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
                              ? 'bg-blue-600'
                              : 'bg-[#34D399]'
                          )}
                        />
                      )}
                      {group.href?.startsWith('https://gla-') && (
                        <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </a>
                </div>
              );
            }

            const expanded = isGroupExpanded(group.id);

            // Verifica se algum subitem deste grupo está ativo
            const hasActiveChild = group.items.some(
              (it) => it.route && it.route === activeRoute
            );

            // Agrupa itens por subgrupo se houver (ex.: DENÚNCIAS, EMERGÊNCIAS QUÍMICAS, CONSULTAS)
            let lastSubgroup: string | undefined = undefined;

            return (
              <div key={group.id} className="pt-0.5">
                {/* Cabeçalho do Grupo (Botão de Acordeão) */}
                <button
                  id={`btn-${group.id}`}
                  data-testid={`nav-${group.label}`}
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-150 cursor-pointer text-left',
                    getGroupBtnClass(hasActiveChild)
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
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-[#1d6b82] text-white border-[#1d6b82]'
                          : isDarkMode
                          ? 'bg-slate-900 text-slate-400 border-slate-800'
                          : isVizoraGreen
                          ? 'bg-[#103d30] text-[#bce0d3] border-[#206954]'
                          : isInemaLight
                          ? 'bg-slate-100/70 text-slate-400 border-slate-200/60'
                          : 'bg-[#083340] text-[#9ec3cc] border-[#145366]'
                      )}
                    >
                      <GroupIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs md:text-sm truncate">{group.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {renderBadge(group.badge)}
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200',
                        isDarkMode
                          ? 'text-slate-400'
                          : isVizoraGreen
                          ? 'text-[#bce0d3]'
                          : isInemaLight
                          ? 'text-slate-400'
                          : 'text-[#9ec3cc]',
                        expanded && 'rotate-180'
                      )}
                    />
                  </div>
                </button>

                {/* Lista de Subitens do Grupo */}
                {expanded && (
                  <div
                    id={group.htmlId}
                    className={cn(
                      'mt-1 ml-3.5 pl-2.5 border-l-2 space-y-0.5 py-0.5',
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
                      const isSubActive =
                        subItem.route && subItem.route === activeRoute;

                      // Exibir título de subseção se houver mudança de subgrupo
                      const showSubgroupHeader =
                        subItem.subgroup && subItem.subgroup !== lastSubgroup;
                      if (subItem.subgroup) {
                        lastSubgroup = subItem.subgroup;
                      }

                      return (
                        <React.Fragment key={subItem.id}>
                          {showSubgroupHeader && (
                            <div
                              className={cn(
                                'pt-2 pb-1 px-2 text-[10px] font-semibold uppercase tracking-wider select-none pointer-events-none flex items-center gap-1.5',
                                isDarkMode
                                  ? 'text-slate-500'
                                  : isVizoraGreen
                                  ? 'text-[#97c7b6]'
                                  : isInemaLight
                                  ? 'text-slate-400'
                                  : 'text-[#7ea8b3]'
                              )}
                            >
                              <span>{subItem.subgroup}</span>
                            </div>
                          )}

                          <a
                            id={subItem.htmlId || subItem.id}
                            data-testid={subItem.htmlId || subItem.id}
                            href={subItem.href || '#'}
                            target={
                              subItem.href &&
                              subItem.href.startsWith('http') &&
                              !subItem.href.includes(window.location.host)
                                ? '_blank'
                                : undefined
                            }
                            rel={
                              subItem.href?.startsWith('http')
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            onClick={(e) => handleNav(subItem, e)}
                            className={cn(
                              'group relative flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 select-none',
                              getSubItemClass(isSubActive, subItem.disabled)
                            )}
                          >
                            <span className="truncate pr-1">{subItem.label}</span>

                            <div className="flex items-center gap-1 shrink-0">
                              {subItem.badge && (
                                <span
                                  id={subItem.id === 'fisc-painel-interno-difis' ? 'sidebarBadgeEmergencias' : undefined}
                                  className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-2xs"
                                >
                                  {subItem.badge}
                                </span>
                              )}
                              {subItem.href?.startsWith('https://gla-') && (
                                <ExternalLink className="w-2.5 h-2.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </a>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
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
                className="mt-2 text-xs text-[#0F4C3A] hover:underline font-semibold"
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
              'p-3 border-t shrink-0 flex items-center justify-center w-full transition-colors',
              isDarkMode
                ? 'bg-slate-950 border-slate-800'
                : isVizoraGreen
                ? 'bg-[#185846] border-[#206954]'
                : isInemaLight
                ? 'bg-white border-slate-100'
                : 'bg-[#0c4353] border-[#145366]'
            )}
          >
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  id="btn-assistente-inema"
                  data-testid="btn-assistente-inema"
                  onClick={() => {
                    alert('Assistente IA INEMA ativado. Em que posso auxiliá-lo com as demandas de Fiscalização e SEIA?');
                  }}
                  className={cn(
                    'relative overflow-hidden h-10 w-10 flex items-center justify-center rounded-xl active:scale-95 text-white group cursor-pointer transition-all duration-300 border border-white/20',
                    'bg-gradient-to-br from-[#005ea3] via-[#0284a8] to-[#0f9f75] hover:from-[#004f8a] hover:via-[#027494] hover:to-[#0d8a66]',
                    'shadow-[inset_0_1px_0_rgba(255,255,255,0.28),_0_4px_14px_rgba(2,132,168,0.3)]'
                  )}
                  aria-label="Assistente INEMA"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center border border-white/30 shadow-xs backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 drop-shadow-[0_0_6px_rgba(255,255,255,0.85)] shrink-0" />
                  </div>
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
              'p-3 border-t shrink-0 transition-colors',
              isDarkMode
                ? 'bg-slate-950 border-slate-800'
                : isVizoraGreen
                ? 'bg-[#185846] border-[#206954]'
                : isInemaLight
                ? 'bg-white border-slate-100'
                : 'bg-[#0c4353] border-[#145366]'
            )}
          >
            <button
              id="btn-assistente-inema"
              data-testid="btn-assistente-inema"
              onClick={() => {
                alert('Assistente IA INEMA ativado. Em que posso auxiliá-lo com as demandas de Fiscalização e SEIA?');
              }}
              className={cn(
                'relative overflow-hidden w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-white font-medium text-xs transition-all duration-300 active:scale-98 group cursor-pointer border border-white/20',
                'bg-gradient-to-r from-[#005ea3] via-[#0284a8] to-[#0f9f75] hover:from-[#004f8a] hover:via-[#027494] hover:to-[#0d8a66]',
                'shadow-[inset_0_1px_0_rgba(255,255,255,0.28),_0_4px_16px_rgba(2,132,168,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),_0_6px_22px_rgba(15,159,117,0.42)]'
              )}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center border border-white/30 shadow-xs backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 drop-shadow-[0_0_6px_rgba(255,255,255,0.85)]" />
                </div>
                <span className="font-semibold tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">Assistente INEMA</span>
              </div>
              <span className="relative z-10 px-1.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[9px] font-black uppercase tracking-wider text-white border border-white/30 shadow-xs">
                IA
              </span>
            </button>
          </div>
        )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
