import React, { useState } from 'react';
import {
  Home,
  ShieldAlert,
  ChevronDown,
  BarChart3,
  Sparkles,
  FileCheck,
  UserCheck,
  Flame,
  Search,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeRoute?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onNavigate?: (route: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute = 'relatorios',
  isOpenMobile = false,
  onCloseMobile,
  onNavigate,
}) => {
  const [isFiscalizacaoOpen, setIsFiscalizacaoOpen] = useState(true);

  const handleNav = (route: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigate) onNavigate(route);
    if (onCloseMobile) onCloseMobile();
  };

  const navItemClass = (route: string) =>
    cn(
      'group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-150 select-none cursor-pointer',
      activeRoute === route
        ? 'bg-[#E2ECE9] text-[#0F4C3A] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
    );

  return (
    <>
      {/* Overlay Mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden transition-opacity"
          style={{ top: '60px' }}
        />
      )}

      {/* Aside Container */}
      <aside
        className={cn(
          'w-[280px] bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex flex-col fixed top-[60px] bottom-0 left-0 z-40 transition-transform duration-200 ease-out shadow-[1px_0_10px_rgba(0,0,0,0.02)]',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 select-none">
          {/* 1. Item Principal: Início */}
          <a
            href="/"
            onClick={(e) => handleNav('inicio', e)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer',
              activeRoute === 'inicio'
                ? 'bg-[#E2ECE9] text-[#0F4C3A] font-bold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
            )}
          >
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', activeRoute === 'inicio' ? 'bg-[#0F4C3A] text-white shadow-xs' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200')}>
              <Home className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold">Início</span>
          </a>

          {/* 2. Módulo Principal: Fiscalização (Accordion) */}
          <div className="pt-2">
            <button
              onClick={() => setIsFiscalizacaoOpen(!isFiscalizacaoOpen)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer',
                activeRoute.startsWith('fiscalizacao') || activeRoute.startsWith('emergencia') || activeRoute.startsWith('consulta')
                  ? 'text-slate-900 font-bold bg-slate-50'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0F4C3A] border border-emerald-100/80 flex items-center justify-center">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold">Fiscalização</span>
              </div>
              <ChevronDown
                className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', isFiscalizacaoOpen && 'rotate-180')}
              />
            </button>

            {/* Subitens agrupados */}
            {isFiscalizacaoOpen && (
              <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-100 space-y-4 py-1">
                {/* Subgrupo: Denúncias */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1 flex items-center gap-1.5">
                    <span>Denúncias Ambientais</span>
                  </div>
                  <div className="space-y-0.5">
                    <a
                      href="/src/fiscalizacao.html"
                      onClick={(e) => handleNav('atendente', e)}
                      className={navItemClass('atendente')}
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Atendente</span>
                      </div>
                    </a>
                    <a
                      href="/src/fiscalizacao.html?fluxo=externo"
                      onClick={(e) => handleNav('cidadao', e)}
                      className={navItemClass('cidadao')}
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Formulário Cidadão</span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Subgrupo: Emergências Químicas */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1 flex items-center gap-1.5">
                    <span>Emergências Químicas</span>
                  </div>
                  <div className="space-y-0.5">
                    <a
                      href="/src/emergencia-quimica.html?fluxo=interna"
                      onClick={(e) => handleNav('emergencia-interna', e)}
                      className={navItemClass('emergencia-interna')}
                    >
                      <div className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Cadastro Interno</span>
                      </div>
                    </a>
                    <a
                      href="/src/emergencia-quimica-externa.html"
                      onClick={(e) => handleNav('emergencia-externa', e)}
                      className={navItemClass('emergencia-externa')}
                    >
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                        <span>Registro Externo</span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Subgrupo: Consultas */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1 flex items-center gap-1.5">
                    <span>Painéis de Consulta</span>
                  </div>
                  <div className="space-y-0.5">
                    <a
                      href="/src/consulta-externa.html"
                      onClick={(e) => handleNav('consulta-externa', e)}
                      className={navItemClass('consulta-externa')}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <span>Consulta Cidadão</span>
                      </div>
                    </a>
                    <a
                      href="/src/consulta-interna.html"
                      onClick={(e) => handleNav('consulta-interna', e)}
                      className={navItemClass('consulta-interna')}
                    >
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F4C3A]" />
                        <span>Painel Interno DIFIS</span>
                      </div>
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                        3
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Item: Relatórios Gerenciais (Ativo) */}
          <div className="pt-2">
            <a
              href="/src/relatorios.html"
              onClick={(e) => handleNav('relatorios', e)}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer',
                activeRoute === 'relatorios'
                  ? 'bg-[#E2ECE9] text-[#0F4C3A] font-bold shadow-2xs border border-[#CBDED8]/70'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', activeRoute === 'relatorios' ? 'bg-[#0F4C3A] text-white shadow-xs' : 'bg-slate-100 text-slate-500')}>
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold">Relatórios Gerenciais</span>
              </div>
              {activeRoute === 'relatorios' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C3A]" />
              )}
            </a>
          </div>
        </nav>

        {/* Card Moderno: Assistente INEMA (AI Engine) */}
        <div className="p-3 border-t border-slate-100 bg-gradient-to-b from-transparent to-slate-50/80">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0A3528] via-[#0F4C3A] to-[#145A45] text-white shadow-sm border border-emerald-600/30 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <span className="text-xs font-bold text-white tracking-tight">Assistente INEMA</span>
            </div>
            <p className="text-[11px] text-emerald-100/80 leading-snug mb-3">
              Inteligência operacional para triagem de denúncias e pautas.
            </p>
            <button
              onClick={() => alert('Assistente IA do INEMA: pronto para tirar dúvidas e sugerir enquadramentos de processos.')}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white text-[#0F4C3A] hover:bg-emerald-50 text-xs font-bold transition-all active:scale-98 shadow-xs cursor-pointer"
            >
              <span>Abrir Assistente</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
