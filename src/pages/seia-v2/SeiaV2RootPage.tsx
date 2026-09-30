import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ShadcnAppShell } from '@/components/seia-v2/shadcn/ShadcnAppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { SeiaV2TabelaOperacionalPage } from '@/components/seia-v2/SeiaV2TabelaOperacionalPage';
import { SeiaV2FormularioComplexoPage } from '@/components/seia-v2/SeiaV2FormularioComplexoPage';
import { SeiaV2DashboardPage } from '@/components/seia-v2/SeiaV2DashboardPage';
import { DenunciaInternaPage } from '@/pages/fiscalizacao/DenunciaInternaPage';
import { DenunciaExternaPage } from '@/pages/fiscalizacao/DenunciaExternaPage';
import { EmergenciaInternaPage } from '@/pages/fiscalizacao/EmergenciaInternaPage';
import { EmergenciaExternaPage } from '@/pages/fiscalizacao/EmergenciaExternaPage';
import { ConsultaExternaPage } from '@/pages/fiscalizacao/ConsultaExternaPage';
import { ConsultaInternaPage } from '@/pages/fiscalizacao/ConsultaInternaPage';
import { SeiaDaesPage } from '@/pages/hibrido/SeiaDaesPage';
import { SeiaV2DesignSystemPage } from '@/pages/seia-v2/SeiaV2DesignSystemPage';

export const SeiaV2RootPage: React.FC = () => {
  const [activeSubRoute, setActiveSubRoute] = useState<string>('inicio');

  const parseRouteFromUrl = (): string => {
    if (typeof window === 'undefined') return 'inicio';
    const params = new URLSearchParams(window.location.search);
    const tela = params.get('tela') || params.get('tab') || params.get('subrota');
    if (tela) {
      if (tela === 'formulario' || tela === 'form' || tela === 'novo') return 'formulario';
      if (tela === 'tabela' || tela === 'pauta' || tela === 'processos') return 'tabela';
      if (tela === 'seia-painel' || tela === 'painel') return 'seia-painel';
      if (tela === 'atendente' || tela === 'denuncia-interna') return 'atendente';
      if (tela === 'cidadao' || tela === 'denuncia-externa') return 'cidadao';
      if (tela === 'emergencia-interna') return 'emergencia-interna';
      if (tela === 'emergencia-externa') return 'emergencia-externa';
      if (tela === 'consulta-externa') return 'consulta-externa';
      if (tela === 'consulta-interna') return 'consulta-interna';
      if (tela === 'relatorios' || tela === 'dashboard') return 'relatorios';
      return tela;
    }
    return 'inicio';
  };

  useEffect(() => {
    setActiveSubRoute(parseRouteFromUrl());

    const handlePopState = () => {
      setActiveSubRoute(parseRouteFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: string) => {
    setActiveSubRoute(route);
    const url = new URL(window.location.href);
    url.searchParams.set('rota', 'seia-v2');
    url.searchParams.set('tela', route);
    window.history.pushState({}, '', url.toString());
  };

  const renderContent = () => {
    switch (activeSubRoute) {
      case 'tabela':
        return <SeiaV2TabelaOperacionalPage onNavigate={handleNavigate} />;
      case 'formulario':
        return <SeiaV2FormularioComplexoPage onNavigate={handleNavigate} />;
      case 'seia-painel':
        return <SeiaV2DashboardPage />;
      case 'atendente':
        return <DenunciaInternaPage onNavigate={handleNavigate} />;
      case 'cidadao':
        return <DenunciaExternaPage onNavigate={handleNavigate} />;
      case 'emergencia-interna':
        return <EmergenciaInternaPage onNavigate={handleNavigate} />;
      case 'emergencia-externa':
        return <EmergenciaExternaPage onNavigate={handleNavigate} />;
      case 'consulta-externa':
        return <ConsultaExternaPage onNavigate={handleNavigate} />;
      case 'consulta-interna':
        return <ConsultaInternaPage onNavigate={handleNavigate} />;
      case 'seia-daes':
        return <SeiaDaesPage onNavigate={handleNavigate} />;
      case 'design-system':
        return <SeiaV2DesignSystemPage />;
      case 'inicio':
      case 'relatorios':
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ThemeProvider>
      {activeSubRoute === 'design-system' ? (
        <SeiaV2DesignSystemPage />
      ) : (
        <ShadcnAppShell activeRoute={activeSubRoute} onNavigate={handleNavigate}>
          {renderContent()}
        </ShadcnAppShell>
      )}
    </ThemeProvider>
  );
};

export default SeiaV2RootPage;
