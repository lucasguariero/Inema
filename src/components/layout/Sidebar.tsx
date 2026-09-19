import React, { useState } from 'react';
import {
  FileCheck,
  Trees,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GLA_MENU_GROUPS, MenuItem } from '@/data/glaMenu';

interface SidebarProps {
  activeRoute?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onNavigate?: (route: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldAlert: FileCheck,
  Trees: Trees,
  fact_check: FileCheck,
  forest: Trees,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute = 'relatorios',
  isOpenMobile = false,
  onCloseMobile,
  onNavigate,
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    fiscalizacao: true,
    'unidades-conservacao': true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleItemClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    if (item.route) {
      e.preventDefault();
      if (onNavigate) onNavigate(item.route);
      if (onCloseMobile) onCloseMobile();
      return;
    }
    if (item.href && onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      id="sidebar"
      className={cn(
        'w-[280px] bg-white border-r border-[#E5E7EB] flex flex-col fixed top-[60px] bottom-0 left-0 z-40 transition-transform duration-200 select-none',
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        {GLA_MENU_GROUPS.map((group) => {
          const GroupIcon = ICON_MAP[group.icon] || ICON_MAP[group.materialIcon || ''] || FileCheck;
          const isExpanded = openGroups[group.id] ?? true;
          const hasActiveChild = group.items.some((it) => it.route && it.route === activeRoute);

          return (
            <div key={group.id} className="pt-1">
              <button
                id={`btn-${group.id}`}
                data-testid={`nav-${group.label}`}
                onClick={() => toggleGroup(group.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold transition-colors duration-150 cursor-pointer',
                  hasActiveChild && 'text-slate-900'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <GroupIcon className="w-5 h-5 text-slate-500 shrink-0" />
                  <span className="text-sm font-semibold truncate">{group.label}</span>
                </div>
                <ChevronDown
                  id={`icon_${group.id}`}
                  className={cn(
                    'w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0',
                    isExpanded && 'rotate-180'
                  )}
                />
              </button>

              {isExpanded && (
                <div
                  id={group.htmlId}
                  className="mt-1 border-l-2 border-slate-200 ml-4 pl-3 space-y-1"
                >
                  {group.items.map((subItem) => {
                    const isSubActive = subItem.route && subItem.route === activeRoute;

                    return (
                      <a
                        key={subItem.id}
                        id={subItem.htmlId || subItem.id}
                        data-testid={subItem.htmlId || subItem.id}
                        href={subItem.href || '#'}
                        onClick={(e) => handleItemClick(subItem, e)}
                        className={cn(
                          'flex items-center justify-between px-3 py-1.5 rounded-lg text-xs md:text-sm transition-colors duration-150',
                          isSubActive
                            ? 'bg-[#E2ECE9] text-[#0F4C3A] font-bold'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
                        )}
                      >
                        <span className="truncate">{subItem.label}</span>
                        {subItem.badge && (
                          <span
                            className={cn(
                              "text-[9px] font-mono tracking-tight px-1.5 py-0.5 rounded shrink-0 ml-1.5 whitespace-nowrap transition-colors select-none",
                              isSubActive
                                ? "bg-[#0F4C3A]/10 text-[#0F4C3A] font-semibold"
                                : "text-slate-400 dark:text-slate-500 bg-slate-100/70 dark:bg-slate-800/60"
                            )}
                          >
                            {subItem.badge}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 bg-white">
        <button
          id="btn-assistente-inema"
          data-testid="btn-assistente-inema"
          onClick={() => alert('Assistente IA INEMA ativado. Em que posso auxiliá-lo com as demandas de Fiscalização e SEIA?')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0F4C3A] text-white font-medium text-xs hover:bg-[#0c3d2e] transition-colors shadow-xs group cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform shrink-0" />
          <span>Assistente INEMA</span>
        </button>
      </div>
    </aside>
  );
};
