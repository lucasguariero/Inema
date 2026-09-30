import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { THEMES, ThemeMode } from '@/types/theme';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface ThemeOption {
  id: ThemeMode;
  icon: string;
  label: string;
  shortLabel: string;
  path: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'default',
    icon: '🏛️',
    label: 'Atual',
    shortLabel: 'Atual',
    path: '/',
  },
  {
    id: 'nordic',
    icon: '❄️',
    label: '01. Nordic',
    shortLabel: '01. Nordic',
    path: '/conceito-01',
  },
  {
    id: 'forest',
    icon: '🌲',
    label: '02. Deep Forest',
    shortLabel: '02. Forest',
    path: '/conceito-02',
  },
  {
    id: 'biophilic',
    icon: '🌾',
    label: '03. Mineral',
    shortLabel: '03. Mineral',
    path: '/conceito-03',
  },
];

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleSelect = (id: ThemeMode, e: React.MouseEvent<HTMLAnchorElement>) => {
    // Permite abrir em nova aba com Ctrl/Cmd + click ou clique do meio
    if (e.metaKey || e.ctrlKey || e.button === 1) {
      return;
    }
    e.preventDefault();
    setTheme(id);
  };

  return (
    <div
      className="inline-flex items-center p-0.5 rounded-lg bg-slate-100/90 border border-slate-200/80 shadow-2xs"
      role="group"
      aria-label="Alternar Direção de Arte"
    >
      <div className="hidden xl:flex items-center gap-1 pl-2 pr-1.5 text-[11px] font-semibold text-slate-400 select-none">
        <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
        <span>DIREÇÃO DE ARTE:</span>
      </div>

      {THEME_OPTIONS.map((opt) => {
        const isActive = theme === opt.id;
        return (
          <a
            key={opt.id}
            href={opt.path}
            onClick={(e) => handleSelect(opt.id, e)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 select-none cursor-pointer',
              isActive
                ? 'bg-white text-slate-900 shadow-2xs font-semibold border border-slate-200/90'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            )}
            title={`${THEMES[opt.id].name} — ${THEMES[opt.id].description}`}
          >
            <span className="text-[11px] leading-none">{opt.icon}</span>
            <span className="hidden sm:inline">{opt.label}</span>
            <span className="sm:hidden">{opt.shortLabel}</span>
          </a>
        );
      })}
    </div>
  );
};
