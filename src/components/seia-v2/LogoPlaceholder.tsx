import React from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LogoPlaceholderProps {
  variant?:
    | 'header'
    | 'header-collapsed'
    | 'login-hero'
    | 'login-transition'
    | 'login-mobile'
    | 'specimen-horizontal'
    | 'specimen-icon';
  theme?: 'white' | 'dark' | 'auto';
  className?: string;
}

/**
 * Componente oficial de Placeholder para a marca do sistema SEIA V2.
 * Design refinado com ícone de imagem centralizado e tipografia sóbria.
 */
export const LogoPlaceholder: React.FC<LogoPlaceholderProps> = ({
  variant = 'header',
  theme = 'auto',
  className,
}) => {
  // Ícone quadrado compacto para sidebar recolhida (32x32px)
  if (variant === 'header-collapsed') {
    return (
      <div
        className={cn(
          'h-8 w-8 rounded-lg border border-white/25 bg-white/10 backdrop-blur-xs',
          'flex items-center justify-center text-white/90 select-none shadow-2xs transition-colors hover:bg-white/15',
          className
        )}
        title="Logo"
        aria-label="Logo"
      >
        <ImageIcon className="w-4 h-4 stroke-[1.75]" />
      </div>
    );
  }

  // Header com sidebar expandida (32px de altura)
  if (variant === 'header') {
    return (
      <div
        className={cn(
          'h-8 px-2.5 rounded-lg border border-white/25 bg-white/10 backdrop-blur-xs',
          'flex items-center gap-2 text-white select-none shadow-2xs transition-colors hover:bg-white/15',
          className
        )}
        title="Logo"
        aria-label="Logo"
      >
        <div className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center shrink-0">
          <ImageIcon className="w-3.5 h-3.5 text-white stroke-[1.75]" />
        </div>
        <span className="font-bold text-xs tracking-wider uppercase">Logo</span>
      </div>
    );
  }

  // Tela de transição / carregamento pós-login
  if (variant === 'login-transition') {
    return (
      <div
        className={cn(
          'px-6 py-4 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md',
          'flex flex-col items-center justify-center gap-2 text-white select-none shadow-lg',
          className
        )}
        title="Logo"
        aria-label="Logo"
      >
        <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner">
          <ImageIcon className="w-6 h-6 stroke-[1.75]" />
        </div>
        <span className="text-xs font-bold tracking-widest uppercase">Logo</span>
      </div>
    );
  }

  // Hero da tela de login (desktop)
  if (variant === 'login-hero') {
    return (
      <div
        className={cn(
          'px-8 py-6 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md',
          'flex flex-col items-center justify-center gap-2.5 text-white select-none shadow-xl',
          className
        )}
        title="Logo"
        aria-label="Logo"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner">
          <ImageIcon className="w-7 h-7 stroke-[1.75]" />
        </div>
        <span className="text-sm font-bold tracking-widest uppercase">Logo</span>
      </div>
    );
  }

  // Header mobile na tela de login
  if (variant === 'login-mobile') {
    return (
      <div
        className={cn(
          'h-8 px-2.5 rounded-lg border select-none',
          'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900',
          'text-slate-800 dark:text-slate-200 flex items-center gap-1.5',
          className
        )}
        title="Logo"
        aria-label="Logo"
      >
        <ImageIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[1.75]" />
        <span className="font-bold text-xs tracking-wider uppercase">Logo</span>
      </div>
    );
  }

  // Símbolo compacto para o Design System
  if (variant === 'specimen-icon') {
    const isWhite = theme === 'white';
    return (
      <div
        className={cn(
          'h-16 w-16 rounded-2xl border flex flex-col items-center justify-center gap-1 select-none shadow-2xs',
          isWhite
            ? 'border-white/25 bg-white/10 text-white'
            : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
          className
        )}
        title="Símbolo Logo"
        aria-label="Logo"
      >
        <ImageIcon className="w-5 h-5 stroke-[1.75]" />
        <span className="text-xs font-bold tracking-wider uppercase">Logo</span>
      </div>
    );
  }

  // Logo horizontal para o Design System
  const isWhite = theme === 'white';
  return (
    <div
      className={cn(
        'h-14 px-5 rounded-xl border flex items-center justify-center gap-3 select-none shadow-2xs',
        isWhite
          ? 'border-white/25 bg-white/10 text-white'
          : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
        className
      )}
      title="Logo Horizontal"
      aria-label="Logo"
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          isWhite ? 'bg-white/15 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
        )}
      >
        <ImageIcon className="w-4 h-4 stroke-[1.75]" />
      </div>
      <span className="text-sm font-bold tracking-wider uppercase">Logo</span>
    </div>
  );
};
