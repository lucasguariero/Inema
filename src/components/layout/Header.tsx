import React from 'react';
import { Menu, Search, Bell, User, LogOut, Settings, ShieldCheck, Command } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-[60px] bg-gradient-to-r from-[#07261C] via-[#0F4C3A] to-[#0A382B] text-white fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 border-b border-emerald-950/50 shadow-[0_1px_3px_rgba(0,0,0,0.15)] select-none">
      {/* Esquerda: Hambúrguer + Logo INEMA + Tag SEIA */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-xl hover:bg-white/10 active:scale-95 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>
        <a href="/" className="flex items-center gap-3 group">
          <img src="/src/logo.svg" alt="INEMA" className="h-8 w-auto group-hover:opacity-95 transition-opacity" />
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/15">
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300/90 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
              SEIA • v2.0
            </span>
          </div>
        </a>
      </div>

      {/* Centro: Barra de Busca com atalho ⌘K */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative group">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-emerald-300 transition-colors" />
          <input
            type="text"
            placeholder="Buscar processos, atos, REs ou empreendimentos..."
            className="w-full pl-9 pr-14 py-1.5 bg-black/20 hover:bg-black/25 focus:bg-black/35 border border-white/15 focus:border-emerald-400/50 rounded-full text-white placeholder-white/50 text-xs focus:outline-none transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] text-white/60 font-mono pointer-events-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Direita: Status dos Sistemas, Notificações e Perfil */}
      <div className="flex items-center gap-3">
        {/* Status Operacional Integrado */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[11px] font-medium tracking-tight">Sistemas Operando 100%</span>
        </div>

        {/* Notificações com badge com glow */}
        <button
          className="relative w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
          title="Notificações operacionais"
        >
          <Bell className="w-4 h-4 text-white/90" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.6)]">
            3
          </span>
        </button>

        <div className="h-5 w-px bg-white/15 mx-0.5 hidden sm:block" />

        {/* Dropdown de Usuário (Radix UI) com avatar refinado */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/10 active:scale-98 transition-all cursor-pointer outline-none">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white to-emerald-100 text-[#0F4C3A] font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-emerald-400/40">
                  LM
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0F4C3A]" />
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="text-xs font-semibold text-white tracking-tight">Lucas Manager</span>
                <span className="text-[10px] text-emerald-200/70">DIFIS / Coordenação</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 glass-dropdown">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2.5 py-1">
                <div className="w-9 h-9 rounded-full bg-[#E2ECE9] text-[#0F4C3A] font-bold text-xs flex items-center justify-center">
                  LM
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">Lucas Manager</p>
                  <p className="text-[10px] text-slate-500 font-normal">lucas.manager@inema.ba.gov.br</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded bg-emerald-50 text-[#0F4C3A] border border-emerald-200/60 text-[9px] font-bold">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Perfil Gestor Master
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Meu Perfil de Acesso</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Configurações & Parâmetros</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600 focus:text-rose-700 focus:bg-rose-50">
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Encerrar Sessão Segura</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
