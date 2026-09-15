import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased">
      {/* Header fixo 60px */}
      <Header onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* Casca principal: pt-[60px] */}
      <div className="flex pt-[60px] flex-1">
        <Sidebar
          activeRoute={activeRoute}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onNavigate={onNavigate}
        />

        {/* Área de conteúdo: margem esquerda desktop de 280px */}
        <main className="flex-1 lg:ml-[280px] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};
