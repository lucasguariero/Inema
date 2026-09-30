import React, { useState } from 'react';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Table as TableIcon,
  Home,
  Briefcase,
  Droplets,
  Trees,
  Bird,
  ShieldAlert,
  Sprout,
  Activity,
  Landmark,
  ExternalLink,
  SlidersHorizontal,
  FolderOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export type SeiaV2Screen = 'dashboard' | 'formulario' | 'tabela';

interface SeiaV2LayoutProps {
  currentScreen: SeiaV2Screen;
  onScreenChange: (screen: SeiaV2Screen) => void;
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  badge?: string | number;
  badgeColor?: string;
  screenTarget?: SeiaV2Screen;
}

interface NavGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

export const SeiaV2Layout: React.FC<SeiaV2LayoutProps> = ({
  currentScreen,
  onScreenChange,
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'inicio': true,
    'atendimento': true,
    'recursos-hidricos': false,
    'flora': false,
    'fauna': false,
    'fiscalizacao': true,
    'conservacao': false,
    'monitoramento': false,
    'gestao': false,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Os 9 Grupos Oficiais do Edital / Técnico Analista
  const navigationGroups: NavGroup[] = [
    {
      id: 'inicio',
      title: '1. Início / Área de Trabalho',
      icon: Home,
      items: [
        { id: 'dashboard', label: 'Painel Geral & Métricas', screenTarget: 'dashboard' },
        { id: 'pendencias', label: 'Minhas Pendências', badge: 14, badgeColor: 'bg-amber-100 text-amber-800' },
        { id: 'meus-processos', label: 'Meus Processos Atribuídos', badge: 28, badgeColor: 'bg-emerald-100 text-[#0F4C3A]' },
        { id: 'notificacoes', label: 'Notificações & Prazos' },
        { id: 'favoritos', label: 'Processos Favoritos' },
      ],
    },
    {
      id: 'atendimento',
      title: '2. Atendimento e Cadastros',
      icon: Briefcase,
      items: [
        { id: 'novo-requerimento', label: 'Novo Requerimento Unificado', screenTarget: 'formulario', badge: 'Novo' },
        { id: 'pauta-processos', label: 'Pauta Geral de Processos', screenTarget: 'tabela' },
        { id: 'cadastros-basicos', label: 'Cadastros Básicos (PF/PJ)' },
        { id: 'cefir', label: 'Imóveis Rurais (CEFIR)' },
        { id: 'ativ-nao-passiveis', label: 'Atividades Não Passíveis' },
        { id: 'regulacao', label: 'Regulação Ambiental' },
      ],
    },
    {
      id: 'recursos-hidricos',
      title: '3. Recursos Hídricos',
      icon: Droplets,
      items: [
        { id: 'cerh', label: 'Cadastro Estadual (CERH)' },
        { id: 'vazoes-outorgadas', label: 'Vazões Outorgadas' },
        { id: 'balanco-hidrico', label: 'Balanço Hídrico' },
        { id: 'cobranca-agua', label: 'Cobrança pelo Uso da Água' },
        { id: 'barragens', label: 'Segurança de Barragens' },
      ],
    },
    {
      id: 'flora',
      title: '4. Flora e Vegetação',
      icon: Trees,
      items: [
        { id: 'reposicao-florestal', label: 'Reposição Florestal' },
        { id: 'raf', label: 'Registro de Atividades (RAF)' },
        { id: 'decremento-veg', label: 'Decremento de Veg. Nativa' },
      ],
    },
    {
      id: 'fauna',
      title: '5. Fauna',
      icon: Bird,
      items: [
        { id: 'sispass', label: 'Gestão Passeriformes (SISPASS)' },
        { id: 'cetas', label: 'Triagem de Silvestres (CETAS)' },
      ],
    },
    {
      id: 'fiscalizacao',
      title: '6. Fiscalização e Controle',
      icon: ShieldAlert,
      items: [
        { id: 'difis', label: 'Fiscalização Ambiental (DIFIS)' },
        { id: 'ceapd', label: 'Poluidores (CEAPD / TCFA)' },
        { id: 'mtr', label: 'Manifesto de Resíduos (MTR)' },
      ],
    },
    {
      id: 'conservacao',
      title: '7. Conservação e Socioambiental',
      icon: Sprout,
      items: [
        { id: 'compensacao', label: 'Compensação Ambiental' },
        { id: 'ceuc', label: 'Unidades de Conservação (CEUC)' },
        { id: 'cepps', label: 'Povos Tradicionais (CEPPS)' },
      ],
    },
    {
      id: 'monitoramento',
      title: '8. Monitoramento e Informação',
      icon: Activity,
      items: [
        { id: 'qualidade-amb', label: 'Monitoramento da Qualidade' },
        { id: 'consulta-publica', label: 'Consulta Pública Cidadã' },
        { id: 'painel-ambiental', label: 'Painel Ambiental da Bahia' },
        { id: 'ciam', label: 'Centro Integrado (CIAM)' },
      ],
    },
    {
      id: 'gestao',
      title: '9. Gestão Institucional',
      icon: Landmark,
      items: [
        { id: 'financeiro', label: 'Financeiro e Arrecadação (DAE)' },
        { id: 'auditoria', label: 'Auditoria e Corregedoria' },
        { id: 'administracao', label: 'Administração do Sistema' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* ========================================================= */}
      {/* TOPBAR: 100% DA LARGURA DA TELA - VERDE INSTITUCIONAL #0F4C3A */}
      {/* ========================================================= */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0F4C3A] text-white border-b border-[#0c3d2e] z-50 flex items-center justify-between px-4 sm:px-6 shadow-md select-none">
        {/* Lado Esquerdo: Identidade Institucional Governo da Bahia / INEMA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white tracking-wider text-xs">
              IN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                  SEIA V2
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold uppercase">
                  Protótipo Oficial
                </span>
              </div>
              <p className="text-[10px] text-emerald-100/70 hidden sm:block">
                Governo do Estado da Bahia • Instituto do Meio Ambiente e Recursos Hídricos
              </p>
            </div>
          </div>
        </div>

        {/* Lado Central: Atalhos Rápidos das 3 Telas-Chave */}
        <div className="hidden md:flex items-center gap-1 bg-black/15 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => onScreenChange('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ease-in-out cursor-pointer ${
              currentScreen === 'dashboard'
                ? 'bg-white text-[#0F4C3A] shadow-xs ring-1 ring-black/5'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>1. Dashboard Gerencial</span>
          </button>

          <button
            onClick={() => onScreenChange('formulario')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ease-in-out cursor-pointer ${
              currentScreen === 'formulario'
                ? 'bg-white text-[#0F4C3A] shadow-xs ring-1 ring-black/5'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Requerimento Unificado</span>
          </button>

          <button
            onClick={() => onScreenChange('tabela')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ease-in-out cursor-pointer ${
              currentScreen === 'tabela'
                ? 'bg-white text-[#0F4C3A] shadow-xs ring-1 ring-black/5'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>3. Tabela Operacional</span>
          </button>
        </div>

        {/* Lado Direito: Notificações e Perfil do Analista */}
        <div className="flex items-center gap-3">
          <button
            className="relative p-2 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-all duration-200 ease-in-out cursor-pointer"
            title="Notificações do SEIA"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse ring-2 ring-[#0F4C3A]" />
          </button>

          <div className="h-6 w-px bg-white/20 hidden sm:block" />

          {/* Perfil Técnico */}
          <div className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-200 ease-in-out cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-600/40 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              CA
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold leading-tight text-white">
                Carlos Albuquerque
              </div>
              <div className="text-[10px] text-emerald-200/80 leading-tight">
                Analista Técnico • DIRRE/COASP
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/60 hidden sm:block" />
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SIDEBAR: CLARA, RENDERIZADA ESTRITAMENTE ABAIXO DA TOPBAR */}
      {/* ========================================================= */}
      <aside className="fixed top-14 left-0 bottom-0 w-[280px] bg-white border-r border-slate-200 z-40 flex flex-col select-none">
        {/* Barra de Busca Global no topo da Sidebar (Fase 2) */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar no SEIA (Ctrl+K)..."
              className="w-full h-9 pl-8 pr-12 text-xs bg-white border border-slate-200 hover:border-slate-300 rounded-lg placeholder-slate-400 text-slate-700 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all duration-200 ease-in-out"
            />
            <span className="absolute right-2 top-2 text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
              ⌘K
            </span>
          </div>
        </div>

        {/* Lista de NavigationGroups (Fase 3) */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1 divide-y divide-slate-100">
          {navigationGroups.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroups[group.id];

            // Filtro por busca rápida
            const filteredItems = searchQuery
              ? group.items.filter((item) =>
                  item.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : group.items;

            if (searchQuery && filteredItems.length === 0) {
              return null;
            }

            return (
              <div key={group.id} className="pt-2 first:pt-0">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all duration-200 ease-in-out uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <GroupIcon className="w-3.5 h-3.5 text-[#0F4C3A] shrink-0" />
                    <span className="truncate">{group.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200" />
                  )}
                </button>

                {isOpen && (
                  <div className="mt-1 space-y-0.5 pl-2">
                    {filteredItems.map((item) => {
                      const isActive =
                        item.screenTarget && currentScreen === item.screenTarget;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.screenTarget) {
                              onScreenChange(item.screenTarget);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-in-out text-left cursor-pointer ${
                            isActive
                              ? 'bg-[#0F4C3A]/10 text-[#0F4C3A] font-semibold border-l-2 border-[#0F4C3A]'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-1.5 shrink-0 ${
                                item.badgeColor || 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono font-semibold text-slate-700">SEIA v2.4.0</span>
          </div>
          <span className="text-[10px] text-slate-400">Ambiente Técnico</span>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* ÁREA DE CONTEÚDO PRINCIPAL COM CONTENÇÃO ULTRA-WIDE       */}
      {/* ========================================================= */}
      <main className="pl-[280px] pt-14 min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};
