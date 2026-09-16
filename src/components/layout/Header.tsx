import React from 'react';
import {
  PanelLeft,
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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import { ThemeMode } from '@/types/theme';
import { cn } from '@/lib/utils';

interface HeaderProps {
  activeRoute?: string;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const ROUTE_INFO: Record<string, { module: string; page: string }> = {
  relatorios: { module: 'Regulação', page: 'Relatórios Gerenciais' },
  atendente: { module: 'Fiscalização', page: 'Denúncia Interna' },
  cidadao: { module: 'Fiscalização', page: 'Formulário Cidadão' },
  'emergencia-interna': { module: 'Fiscalização', page: 'Emergência Química' },
  'emergencia-externa': { module: 'Fiscalização', page: 'Registro Emergência' },
  'consulta-externa': { module: 'Fiscalização', page: 'Consulta Cidadão' },
  'consulta-interna': { module: 'Fiscalização', page: 'Painel DIFIS' },
};

export const Header: React.FC<HeaderProps> = ({ activeRoute = 'relatorios', isSidebarCollapsed, onToggleSidebar }) => {
  const { theme, themeConfig, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const currentRoute = ROUTE_INFO[activeRoute] || ROUTE_INFO.relatorios;

  const colorOptions: { id: ThemeMode; label: string; sub: string; color: string; border: string }[] = [
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
      id: 'inema-forest',
      label: 'Verde Institucional',
      sub: '#0F4C3A',
      color: '#0F4C3A',
      border: '#143B2E',
    },
    {
      id: 'inema-light',
      label: 'Sidebar Branca',
      sub: '#FFFFFF',
      color: '#FFFFFF',
      border: '#CBD5E1',
    },
  ];

  return (
    <header className={cn(
      "h-16 shrink-0 flex items-center justify-between px-3 sm:px-4 lg:px-6 select-none shadow-2xs transition-colors duration-200 border-b",
      "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100",
      !isDarkMode && cn(themeConfig.tokens.headerBg, themeConfig.tokens.headerBorder)
    )}>
      {/* Lado esquerdo: Botão Mobile SidebarTrigger + Breadcrumb dinâmico */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none cursor-pointer lg:hidden"
          aria-label={isSidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          title={isSidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <nav className="flex items-center gap-1 sm:gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium select-none" aria-label="Breadcrumb">
          <a href="/" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors hidden sm:inline">
            Início
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:inline" />
          <span className="text-slate-500 dark:text-slate-400 hidden md:inline">{currentRoute.module}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden md:inline" />
          <span className="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[180px] sm:max-w-none">{currentRoute.page}</span>
        </nav>
      </div>

      {/* Centro: Barra de busca omnibox global compacta (⌘K) */}
      <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
        <div className="relative group">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors" />
          <input
            type="text"
            placeholder="Buscar processos, atos, REs ou requerimentos..."
            className="w-full pl-8 pr-12 py-1.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-slate-300 dark:focus:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] text-slate-500 dark:text-slate-300 font-mono shadow-2xs pointer-events-none">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Lado direito: Dark mode toggle, Notificações e menu de perfil */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Alternador Rápido de Dark Mode Direto no Topo */}
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          title={isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
        </button>

        {/* Notificações */}
        <button
          className="relative w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          title="Notificações"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* Menu de Perfil do Gestor com Seletores e 100% Opacidade */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-98 transition-all cursor-pointer outline-none">
              <div className={cn("w-7 h-7 rounded-full text-white font-medium text-xs flex items-center justify-center shadow-2xs transition-colors", themeConfig.tokens.brandPrimary)}>
                LM
              </div>
              <span className="hidden lg:inline text-xs font-medium text-slate-700 dark:text-slate-200">Lucas Manager</span>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:inline" />
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
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-[#0F4C3A] dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-[10px] font-medium w-fit normal-case tracking-normal">
                  <ShieldCheck className="w-3 h-3" />
                  DIFIS / Coordenação
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1.5" />

            {/* Seletor dos 4 Temas de Cores da Sidebar */}
            <div className="px-2 py-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Cor da Sidebar (4 Opções)
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {colorOptions.map((opt) => {
                  const isSelected =
                    theme === opt.id || (opt.id === 'vizora-blue' && theme === 'default');
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id)}
                      className={cn(
                        "flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer",
                        isSelected
                          ? "bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-500 shadow-2xs ring-1 ring-slate-400 dark:ring-slate-500"
                          : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-2xs border"
                        style={{ backgroundColor: opt.color, borderColor: opt.border }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                          {opt.label}
                        </div>
                        <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono leading-tight">
                          {opt.sub}
                        </div>
                      </div>
                      {isSelected && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1.5" />

            {/* Alternador de Dark Mode */}
            <div className="px-2 py-1.5">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                    {isDarkMode ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      Modo Escuro
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-400 leading-tight">
                      {isDarkMode ? "Ativado para todas as telas" : "Desativado"}
                    </div>
                  </div>
                </div>

                {/* Switch visual */}
                <div
                  className={cn(
                    "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 flex items-center",
                    isDarkMode ? "bg-emerald-600 justify-end" : "bg-slate-300 dark:bg-slate-600 justify-start"
                  )}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200" />
                </div>
              </button>
            </div>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1.5" />

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

            <DropdownMenuItem className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/40 cursor-pointer text-xs">
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Encerrar Sessão</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
