import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Check,
  Moon,
  Sun,
  History,
} from 'lucide-react';
import seiaLogoWhite from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_HORIZONTAL_W.svg';
import seiaIconWhite from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_ICON_W.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isSidebarCollapsed?: boolean;
  isMobileSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const ShadcnHeader: React.FC<HeaderProps> = ({
  isSidebarCollapsed,
  isMobileSidebarOpen,
  onToggleSidebar,
}) => {
  const { theme, setTheme, isDarkMode, setDarkMode, toggleDarkMode } = useTheme();

  const appearanceOptions: {
    id: 'vizora-blue' | 'vizora-green' | 'inema-light' | 'dark';
    label: string;
    sub: string;
    color: string;
    border: string;
  }[] = [
    {
      id: 'vizora-blue',
      label: 'Azul Petróleo',
      sub: '#0c4353',
      color: '#0c4353',
      border: '#145366',
    },
    {
      id: 'vizora-green',
      label: 'Verde Refinado',
      sub: '#185846',
      color: '#185846',
      border: '#206954',
    },
    {
      id: 'inema-light',
      label: 'Sidebar Branca',
      sub: '#FFFFFF',
      color: '#FFFFFF',
      border: '#CBD5E1',
    },
    {
      id: 'dark',
      label: 'Modo Escuro',
      sub: '#020617',
      color: '#020617',
      border: '#334155',
    },
  ];

  const handleSelectAppearance = (optId: 'vizora-blue' | 'vizora-green' | 'inema-light' | 'dark') => {
    if (optId === 'dark') {
      setDarkMode(true);
    } else {
      setDarkMode(false);
      setTheme(optId);
    }
  };

  const isAppearanceSelected = (optId: 'vizora-blue' | 'vizora-green' | 'inema-light' | 'dark') => {
    if (optId === 'dark') return isDarkMode;
    if (isDarkMode) return false;
    return theme === optId || (optId === 'vizora-blue' && (theme === 'default' || theme === 'inema-forest'));
  };

  return (
    <header className={cn(
      "h-16 shrink-0 flex items-center px-3 sm:px-4 lg:px-5 select-none transition-colors duration-200",
      "bg-[var(--topbar-bg)] text-[var(--topbar-text)]"
    )}>
      <div className={cn(
        "flex shrink-0 items-center transition-[width] duration-200 ease-in-out",
        isSidebarCollapsed ? "w-64 lg:w-16" : "w-64 lg:w-72"
      )}>
        <a
          href="/?rota=seia-v2"
          className={cn("flex min-w-0 items-center", isSidebarCollapsed && "lg:justify-center lg:w-full")}
          title="SEIA Plataforma"
        >
          <img src={seiaLogoWhite} alt="SEIA Plataforma" className={cn("h-8 w-auto max-w-[122px] object-contain", isSidebarCollapsed && "lg:hidden")} />
          {isSidebarCollapsed && <img src={seiaIconWhite} alt="" className="hidden lg:block h-8 w-auto object-contain" />}
        </a>
        <button
          onClick={onToggleSidebar}
          className="ml-auto mr-2 h-9 w-9 lg:hidden inline-flex items-center justify-center rounded-lg text-white/85 hover:text-white hover:bg-white/12 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 cursor-pointer"
          aria-label={isMobileSidebarOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
          title={isMobileSidebarOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
        >
          {isMobileSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>
      </div>

      {/* Centro: Barra de busca omnibox global compacta */}
      <div className="flex-1 max-w-xl mx-4 lg:mx-10 hidden md:block">
        <div className="relative group">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/65 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Buscar processos, requerimentos SEIA ou atos..."
            className="w-full pl-8 pr-3 py-2 bg-white/10 hover:bg-white/14 focus:bg-white/16 border border-white/18 focus:border-white/45 rounded-lg text-white placeholder:text-white/65 text-xs focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      {/* Lado direito: Dark mode toggle, Notificações e menu de perfil */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Alternador Rápido de Dark Mode Direto no Topo */}
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 rounded-lg hover:bg-white/12 active:scale-95 flex items-center justify-center text-white/85 hover:text-white transition-colors cursor-pointer"
          title={isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notificações */}
        <button
          className="relative w-8 h-8 rounded-lg hover:bg-white/12 active:scale-95 flex items-center justify-center text-white/85 hover:text-white transition-colors cursor-pointer"
          title="Notificações"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-status-critical)] rounded-full" />
        </button>

        <div className="h-4 w-px bg-white/25 mx-0.5 hidden sm:block" />

        {/* Menu de Perfil do Gestor com Seletores de Aparência */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/12 active:scale-98 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/70">
              <div className="w-7 h-7 rounded-full bg-white/18 border border-white/25 text-white font-medium text-xs flex items-center justify-center transition-colors">
                LM
              </div>
              <span className="hidden lg:inline text-xs font-medium text-white">Lucas Manager</span>
              <ChevronDown className="w-3 h-3 text-white/70 hidden lg:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-76 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-2.5 z-50 text-slate-800 dark:text-slate-100 opacity-100"
          >
            {/* Cabeçalho do usuário */}
            <DropdownMenuLabel className="font-normal normal-case tracking-normal p-2">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs normal-case tracking-normal">Lucas Manager</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal lowercase tracking-normal mt-0.5" title="lucas.manager@inema.ba.gov.br">
                  lucas.manager@inema.ba.gov.br
                </span>
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border border-[var(--badge-success-border)] text-[10px] font-medium w-fit normal-case tracking-normal">
                  <ShieldCheck className="w-3 h-3" />
                  DIFIS / Coordenação
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1.5" />

            {/* Seletor Unificado de Aparência (4 Opções) */}
            <div className="px-2 py-1.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Aparência da Sidebar
                </span>
                {isDarkMode && (
                  <span className="text-[10px] font-semibold text-[var(--badge-success-text)] bg-[var(--badge-success-bg)] px-1.5 py-0.2 rounded border border-[var(--badge-success-border)]">
                    Dark Fixo
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {appearanceOptions.map((opt) => {
                  const selected = isAppearanceSelected(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAppearance(opt.id)}
                      className={cn(
                        "flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer",
                        selected
                          ? "bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-500 shadow-2xs ring-1 ring-slate-400 dark:ring-slate-500"
                          : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                      title={opt.id === 'dark' ? "Ativar Modo Escuro total" : `Ativar tema ${opt.label}`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-2xs border flex items-center justify-center text-[9px]"
                        style={{ backgroundColor: opt.color, borderColor: opt.border }}
                      >
                        {opt.id === 'dark' && <Moon className="w-2.5 h-2.5 text-amber-400" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                          {opt.label}
                        </div>
                        <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono leading-tight">
                          {opt.sub}
                        </div>
                      </div>
                      {selected && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1.5" />

            {/* Alternar para o portal padrão */}
            <DropdownMenuItem asChild className="cursor-pointer text-xs dark:text-slate-300 dark:hover:text-white dark:focus:bg-slate-800">
              <a href="/?rota=relatorios" className="flex items-center gap-2 w-full py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <History className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="font-medium text-xs text-slate-700 dark:text-slate-200">Acessar Sistema GLA (Legado)</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />

            {/* Links Padrão */}
            <DropdownMenuItem className="cursor-pointer text-xs dark:text-slate-300 dark:hover:text-white dark:focus:bg-slate-800">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-xs dark:text-slate-300 dark:hover:text-white dark:focus:bg-slate-800">
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Configurações</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />

            <DropdownMenuItem className="text-[var(--badge-critical-text)] focus:text-[var(--badge-critical-text)] focus:bg-[var(--badge-critical-bg)] cursor-pointer text-xs">
              <LogOut className="w-3.5 h-3.5 text-[var(--color-status-critical)]" />
              <span>Encerrar Sessão</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
