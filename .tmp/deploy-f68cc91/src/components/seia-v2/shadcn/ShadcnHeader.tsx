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
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className={cn(
      "relative h-16 w-full min-w-0 shrink-0 flex items-center px-3 sm:px-4 lg:px-5 select-none transition-colors duration-200",
      "bg-[var(--topbar-bg)] text-[var(--topbar-text)]"
    )}>
      <div className="relative z-10 flex shrink-0 items-center gap-2">
        <a
          href="/?rota=seia-v2"
          className="flex min-w-0 items-center"
          title="SEIA Plataforma"
        >
          <img
            src={seiaLogoWhite}
            alt="SEIA Plataforma"
            className={cn("h-8 w-auto max-w-[122px] object-contain", isSidebarCollapsed && "lg:hidden")}
          />
          {isSidebarCollapsed && (
            <img src={seiaIconWhite} alt="SEIA Plataforma" className="hidden h-8 w-8 object-contain lg:block" />
          )}
        </a>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 cursor-pointer lg:hidden"
          aria-label={isMobileSidebarOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
          title={isMobileSidebarOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
        >
          {isMobileSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 cursor-pointer lg:inline-flex"
          aria-label={isSidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          title={isSidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
        >
          {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Centro: Barra de busca omnibox global compacta */}
      <div className="mx-2 flex min-w-0 flex-1 md:hidden">
        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 cursor-pointer"
          aria-label="Busca geral"
          title="Busca geral"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
      <div className="group pointer-events-none absolute left-1/2 hidden w-[36rem] max-w-[40vw] -translate-x-1/2 md:block">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/65 transition-colors group-focus-within:text-white" />
        <input
          type="search"
          aria-label="Busca geral"
          placeholder="Buscar processos, requerimentos SEIA ou atos..."
          className="pointer-events-auto w-full rounded-lg border border-white/18 bg-white/10 py-2 pl-8 pr-3 text-xs text-white placeholder:text-white/65 transition-all hover:bg-white/14 focus:border-white/45 focus:bg-white/16 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      <div className="hidden min-w-0 flex-1 md:block" />

      {/* Lado direito: Dark mode toggle, Notificações e menu de perfil */}
      <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
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

        {/* Menu de Perfil do Gestor */}
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
