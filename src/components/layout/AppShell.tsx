import React, { useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface AppShellProps {
 children: React.ReactNode;
 activeRoute?: string;
 onNavigate?: (route: string) => void;
}

const ROUTE_INFO: Record<string, { module: string; page: string }> = {
 relatorios: { module: 'Regulação', page: 'Relatórios de Regulação' },
 regulacao: { module: 'Regulação', page: 'Relatórios de Regulação' },
 atendente: { module: 'Fiscalização', page: 'Denúncia Interna' },
 cidadao: { module: 'Fiscalização', page: 'Formulário Cidadão' },
 'emergencia-interna': { module: 'Fiscalização', page: 'Emergência Química' },
 'emergencia-externa': { module: 'Fiscalização', page: 'Registro Emergência' },
 'consulta-externa': { module: 'Fiscalização', page: 'Consulta Cidadão' },
 'consulta-interna': { module: 'Fiscalização', page: 'Painel DIFIS' },
 'fisc-plantonista': { module: 'Fiscalização', page: 'Cadastro de Plantonista' },
 'fisc-escala': { module: 'Fiscalização', page: 'Escala de Plantonistas' },
 'uc-agendamento': { module: 'Unidades de Conservação', page: 'Agendamento de Visitação' },
 'uc-autorizacao-visitacao': { module: 'Unidades de Conservação', page: 'Autorização de Eventos - AAV' },
 'uc-atividades-didaticas': { module: 'Unidades de Conservação', page: 'Atividades Didáticas - AAD' },
 'uc-pesquisa-cientifica': { module: 'Unidades de Conservação', page: 'Pesquisa Científica - Pesc' },
};

export const AppShell: React.FC<AppShellProps> = ({
 children,
 activeRoute = 'relatorios',
 onNavigate,
}) => {
 const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
 const currentRoute = ROUTE_INFO[activeRoute] || { module: 'Sistema', page: activeRoute };

 return (
 <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased flex flex-col">
 {/* 1. HEADER INSTITUCIONAL INEMA / SEIA (Layout Antigo: Verde #0F4C3A) */}
 <header className="h-[60px] bg-[#0F4C3A] text-white fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 shadow-xs select-none">
 <div className="flex items-center gap-3">
 <button
 onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
 className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
 aria-label="Menu principal"
 >
 <Menu className="w-5 h-5" />
 </button>
 <a href="/relatorios-antigo.html" className="flex items-center">
 <img src="/logo.svg" alt="INEMA" className="h-9 w-auto object-contain" />
 </a>
 </div>

 <div className="flex items-center gap-3 ml-auto">
 {/* Pesquisa */}
 <div className="relative hidden sm:block w-48 md:w-64">
 <input
 type="text"
 placeholder="Buscar no sistema..."
 className="w-full h-9 pl-9 pr-3 bg-white/10 hover:bg-white/15 focus:bg-white focus:text-slate-800 text-white placeholder-white/60 text-xs rounded-lg border border-white/20 focus:border-white focus:outline-none transition-all duration-150"
 />
 <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
 </div>

 {/* Notificações */}
 <button
 className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-white relative transition-colors cursor-pointer"
 aria-label="Notificações"
 >
 <Bell className="w-4 h-4 text-white" />
 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
 </button>

 {/* Perfil */}
 <div className="flex items-center gap-2 pl-2 border-l border-white/20">
 <div className="w-8 h-8 rounded-full bg-emerald-700 border border-white/30 flex items-center justify-center text-xs font-bold text-white shadow-xs">
 LM
 </div>
 <span className="text-xs font-medium hidden md:inline text-white/90">Lucas Manager</span>
 </div>
 </div>
 </header>

 {/* 2. CORPO PRINCIPAL COM SIDEBAR LATERAL + MIOLO */}
 <div className="flex flex-1 pt-[60px]">
 {/* Overlay Mobile */}
 {isMobileSidebarOpen && (
 <div
 onClick={() => setIsMobileSidebarOpen(false)}
 className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
 style={{ top: '60px' }}
 />
 )}

 {/* Sidebar Lateral Padronizada */}
 <Sidebar
 activeRoute={activeRoute}
 isOpenMobile={isMobileSidebarOpen}
 onCloseMobile={() => setIsMobileSidebarOpen(false)}
 onNavigate={onNavigate}
 />

 {/* Conteúdo da Tela */}
 <main className="flex-1 lg:ml-[280px] p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-[calc(100vh-60px)] bg-[#F8FAFC]">
 {/* Breadcrumbs Oficiais */}
 <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
 <a href="/relatorios-antigo.html" className="hover:text-slate-700">Início</a>
 <span>›</span>
 <span className="hover:text-slate-700">{currentRoute.module}</span>
 <span>›</span>
 <span className="text-[#0F4C3A] font-bold">{currentRoute.page}</span>
 </nav>

 {children}
 </main>
 </div>
 </div>
 );
};
