import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  activeRoute?: string;
  onNavigate?: (route: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeRoute = 'relatorios',
  onNavigate,
}) => {
  const { themeConfig, isDarkMode } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className={cn('h-screen w-screen overflow-hidden flex antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100', isDarkMode ? 'dark bg-slate-950 text-slate-100' : themeConfig.tokens.canvasBg)}>
      {/* Sidebar: h-screen fixa à esquerda com suporte a colapso */}
      <Sidebar
        activeRoute={activeRoute}
        isCollapsed={isSidebarCollapsed}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onNavigate={onNavigate}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Coluna flexível à direita: Topbar + Conteúdo (expande dinamicamente) */}
      <div className={cn("flex-1 flex flex-col h-screen min-w-0 overflow-hidden transition-all duration-200 ease-in-out dark:bg-slate-950", isDarkMode ? "bg-slate-950" : "bg-transparent")}>
        {/* Topbar: 100% da largura horizontal da coluna à direita */}
        <Header
          activeRoute={activeRoute}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Miolo principal com overflow-y-auto e padding confortável para mobile e desktop */}
        <main className={cn("flex-1 w-full min-w-0 overflow-y-auto dark:bg-slate-950 dark:text-slate-100", isDarkMode ? "bg-slate-950 text-slate-100" : "")}>
          <div className="w-full max-w-[2000px] mx-auto p-3.5 sm:p-6 lg:p-8 pb-32">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
