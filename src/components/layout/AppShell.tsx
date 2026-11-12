import { CerhShellContext } from '@/pages/seia-v2/cerh/CerhShellContext';
import React, { useEffect, useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { getCurrentScope } from '@/lib/scope';

interface AppShellProps {
 children: React.ReactNode;
 activeRoute?: string;
 onNavigate?: (route: string) => void;
 variant?: 'default' | 'document-explorer';
}

const ROUTE_INFO: Record<string, { module: string; page: string }> = {
  'a-assinar': { module: 'Assinatura Eletrônica', page: 'A Assinar' },
  'assinatura-eletronica': { module: 'Assinatura Eletrônica', page: 'Documentos & Atos' },
 'coine-bess': { module: 'COINE', page: 'FCE BESS (Licença Prévia)' },
 'coine-metro': { module: 'COINE', page: 'FCE de Metrô, VLT e BRT' },
 'coine-transmissao': { module: 'COINE', page: 'FCE de Linha de Transmissão' },
 'coine-rodovia': { module: 'COINE', page: 'FCE de Rodovia' },
 'coine-termeletrica': { module: 'COINE', page: 'FCE de Termelétrica' },
 'coine-aeroporto': { module: 'COINE', page: 'FCE de Aeroporto' },
 'coine-eolica': { module: 'COINE', page: 'FCE de Energia Eólica' },
 'coine-solar': { module: 'COINE', page: 'FCE de Energia Solar' },
 'coine-datacenter': { module: 'COINE', page: 'FCE de Data Center' },
 'coine-turismo': { module: 'COINE', page: 'FCE de Turismo e Lazer' },
 'coind-industria': { module: 'COIND', page: 'FCE de Indústria' },
 'coind-desmantelamento': { module: 'COIND', page: 'FCE Desmantelamento / Autorização Ambiental' },
 'coind-dutovia': { module: 'COIND', page: 'FCE de Dutovia' },
 'uc-conselhos': { module: 'Gestão de UC', page: 'Conselhos Gestores' },
 'uc-conselho-criacao': { module: 'Gestão de UC', page: 'Criação e Renovação de Conselho Gestor' },
 'uc-conselho-implementacao': { module: 'Gestão de UC', page: 'Implementação de Conselho Gestor' },
 'cerh-contrato': { module: 'Regulação', page: 'Requerimentos — contrato CERH' },
 'cerh-finalidades': { module: 'Administração › Processo', page: 'Finalidade' },
 'cerh-tipos-uso': { module: 'Administração › Processo', page: 'Tipo de Uso' },
 'cerh-usuarios': { module: 'Administração › Segurança', page: 'Usuários' },
 'cerh-grupos': { module: 'Administração › Segurança', page: 'Grupos' },
 'reg-pauta-area': { module: 'Regulação', page: 'Pauta da Área' },
 'iniciar-requerimento': { module: 'Regulação', page: 'Iniciar Requerimento' },
 'requerimento': { module: 'Regulação', page: 'Iniciar Requerimento' },
 'requerimento-informacoes': { module: 'Regulação', page: 'Iniciar Requerimento' },
 relatorios: { module: 'Regulação', page: 'Relatórios de Regulação' },
 regulacao: { module: 'Regulação', page: 'Relatórios de Regulação' },
 dashboard: { module: 'Regulação', page: 'Dashboard Gerencial' },
 'cad-empreendimentos': { module: 'Regulação', page: 'Empreendimentos (CERH)' },
 empreendimentos: { module: 'Regulação', page: 'Empreendimentos (CERH)' },
 cerh: { module: 'Regulação', page: 'Consulta CERH' },
 outorga: { module: 'Regulação', page: 'Consulta CERH' },
 atendente: { module: 'Fiscalização', page: 'Denúncia Interna' },
 cidadao: { module: 'Fiscalização', page: 'Formulário Cidadão' },
 'emergencia-interna': { module: 'Fiscalização', page: 'Emergência Química' },
 'emergencia-externa': { module: 'Fiscalização', page: 'Registro Emergência' },
 'consulta-externa': { module: 'Fiscalização', page: 'Consulta Cidadão' },
 'consulta-interna': { module: 'Fiscalização', page: 'Painel DIFIS' },
 'fisc-plantonista': { module: 'Fiscalização', page: 'Cadastro de Plantonista' },
 'fisc-escala': { module: 'Fiscalização', page: 'Escala de Plantonistas' },
 'fisc-pauta-gestor-registros': { module: 'Fiscalização', page: 'Pauta do Gestor - Registros' },
 'fisc-aiad': { module: 'Fiscalização', page: 'Auto de Infração - Advertência' },
 'fisc-aiap': { module: 'Fiscalização', page: 'Auto de Infração – Apreensão' },
 'fisc-rfa': { module: 'Fiscalização', page: 'Relatório de Fiscalização Ambiental' },
 'fisc-rae': { module: 'Fiscalização', page: 'Relatório de Atendimento de Emergência' },
 'ceuc-consulta': { module: 'Gestão de UC', page: 'Cadastro Estadual de UC (CEUC)' },
 ceuc: { module: 'Gestão de UC', page: 'Cadastro Estadual de UC (CEUC)' },
 'uc-agendamento': { module: 'Unidades de Conservação', page: 'Entrada Única para Realização de Atividade em Unidade de Conservação' },
 'uc-entrada-unica': { module: 'Unidades de Conservação', page: 'Entrada Única para Realização de Atividade em Unidade de Conservação' },
 'uc-autorizacao-visitacao': { module: 'Unidades de Conservação', page: 'Autorização de Eventos - AAV' },
 'uc-atividades-didaticas': { module: 'Unidades de Conservação', page: 'Atividades Didáticas - AAD' },
 'uc-pesquisa-cientifica': { module: 'Unidades de Conservação', page: 'Pesquisa Científica - Pesc' },
 'fauna-especies': { module: 'Gestão de Fauna', page: 'Espécies e Taxonomia' },
 'fauna-unidades': { module: 'Gestão de Fauna', page: 'Unidades e Destinos' },
 'fauna-documentos': { module: 'Gestão de Fauna', page: 'Documentos e Termos' },
 'fauna-procedencia': { module: 'Gestão de Fauna', page: 'Procedência Animal' },
 'fauna-recintos': { module: 'Gestão de Fauna', page: 'Recintos e Áreas' },
 'fauna-manejos': { module: 'Gestão de Fauna', page: 'Tipos de Manejo' },
 'fauna-animais': { module: 'Gestão de Fauna', page: 'Animais' },
    'fauna-asas': { module: 'Gestão de Fauna', page: 'Áreas de Soltura (ASAS)' },
    'fauna-mapa-asas': { module: 'Gestão de Fauna', page: 'Mapa de ASAS e Destinações' },
    'fauna-guardiao': { module: 'Gestão de Fauna', page: 'Guardiões e TGAS' },
};

export const AppShell: React.FC<AppShellProps> = ({
 children,
 activeRoute = 'relatorios',
 onNavigate,
 variant = 'default',
}) => {
 const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
 const cerhContext = ['cad-empreendimentos','empreendimentos','cerh','outorga','cerh-finalidades','cerh-tipos-uso','cerh-usuarios','cerh-grupos','cerh-contrato'].includes(activeRoute);
 const immersive = variant === 'document-explorer';
 useEffect(() => { if (immersive) setIsMobileSidebarOpen(false); }, [immersive]);
 const currentRoute = (() => {
    const base = ROUTE_INFO[activeRoute] || { module: 'Sistema', page: activeRoute };
    if (activeRoute === 'assinatura-eletronica' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('aba') === 'parametrizacao') {
        return { module: 'Assinatura Eletrônica', page: 'Parametrização por Etapa' };
      }
    }
    return base;
  })();
 const scope = getCurrentScope();
 const homeHref = scope === 'assinatura-eletronica'
   ? '/?rota=a-assinar&escopo=assinatura-eletronica'
   : '/?rota=relatorios';

 return (
 <div data-layout={variant} className={cn('bg-[#F8FAFC] text-slate-800 antialiased flex flex-col', immersive ? 'h-dvh overflow-hidden' : 'min-h-screen', ['uc-agendamento','uc-entrada-unica'].includes(activeRoute) && 'entrada-unica-shell')}>
 {/* 1. HEADER INSTITUCIONAL INEMA / SEIA (Layout Antigo: Verde #0F4C3A) */}
 {!immersive && <header className="h-[60px] bg-[#0F4C3A] text-white fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 shadow-xs select-none">
 <div className="flex items-center gap-3">
 <button
 onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
 className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
 aria-label="Menu principal"
 >
 <Menu className="w-5 h-5" />
 </button>
 <a href={homeHref} className="flex items-center">
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

 {cerhContext ? <CerhShellContext /> : <>
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
 </>}
 </div>
 </header>}

 {/* 2. CORPO PRINCIPAL COM SIDEBAR LATERAL + MIOLO */}
 <div className={cn('flex flex-1', immersive ? 'min-h-0' : 'pt-[60px]')}>
 {/* Overlay Mobile */}
 {!immersive && isMobileSidebarOpen && (
 <div
 onClick={() => setIsMobileSidebarOpen(false)}
 className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
 style={{ top: '60px' }}
 />
 )}

 {/* Sidebar Lateral Padronizada */}
 {!immersive && <Sidebar
 activeRoute={activeRoute}
 isOpenMobile={isMobileSidebarOpen}
 onCloseMobile={() => setIsMobileSidebarOpen(false)}
 onNavigate={onNavigate}
 />}

 {/* Conteúdo da Tela */}
 <main className={immersive ? 'flex-1 min-w-0 min-h-0 overflow-hidden' : 'flex-1 lg:ml-[280px] p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-[calc(100vh-60px)] bg-[#F8FAFC]'}>
 {/* Breadcrumbs Oficiais */}
 {!immersive && <nav className={cn("flex items-center gap-2 text-xs text-slate-500 font-medium", ['uc-agendamento','uc-entrada-unica'].includes(activeRoute) && 'flex-wrap')} aria-label="Breadcrumb">
 <a href={homeHref} className="hover:text-slate-700">Início</a>
 <span>›</span>
 <span className="hover:text-slate-700">{currentRoute.module}</span>
 <span>›</span>
 <span className="text-[#0F4C3A] font-bold">{currentRoute.page}</span>
 </nav>}

 {children}
 </main>
 </div>
 </div>
 );
};
