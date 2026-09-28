import React, { useState } from 'react';
import { ShadcnHeader } from './ShadcnHeader';
import { ShadcnSidebar } from './ShadcnSidebar';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  activeRoute?: string;
  onNavigate?: (route: string) => void;
}

export const ShadcnAppShell: React.FC<AppShellProps> = ({
  children,
  activeRoute = 'relatorios',
  onNavigate,
}) => {
  const { isDarkMode } = useTheme();
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
    <div className={cn('h-screen w-screen overflow-hidden flex flex-col antialiased transition-colors duration-200', isDarkMode ? 'dark bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)]' : 'bg-[var(--color-surface-canvas)]')}>
      <ShadcnHeader
        isSidebarCollapsed={isSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
        <ShadcnSidebar
          activeRoute={activeRoute}
          isCollapsed={isSidebarCollapsed}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onNavigate={onNavigate}
          onToggleCollapse={handleToggleSidebar}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-200 ease-in-out bg-transparent">
          <main className="flex-1 w-full min-w-0 overflow-y-auto text-[var(--color-text-primary)]">
          <div className="w-full max-w-[2000px] mx-auto p-3.5 sm:p-6 lg:p-8 pb-32">
            {children}
          </div>
          </main>
        </div>
      </div>
    </div>
  );
};
