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

        {/* Área de conteúdo: ocupa toda a largura disponível ao lado da sidebar */}
        <main className="flex-1 w-full min-w-0 overflow-y-auto lg:ml-[280px] transition-all duration-200">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-6 pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
