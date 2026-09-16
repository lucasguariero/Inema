import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { DenunciaInternaPage } from '@/pages/fiscalizacao/DenunciaInternaPage';
import { DenunciaExternaPage } from '@/pages/fiscalizacao/DenunciaExternaPage';
import { EmergenciaInternaPage } from '@/pages/fiscalizacao/EmergenciaInternaPage';
import { EmergenciaExternaPage } from '@/pages/fiscalizacao/EmergenciaExternaPage';
import { ConsultaExternaPage } from '@/pages/fiscalizacao/ConsultaExternaPage';
import { ConsultaInternaPage } from '@/pages/fiscalizacao/ConsultaInternaPage';

export function App() {
  const [activeRoute, setActiveRoute] = useState('relatorios');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('layout') === 'antigo' || params.get('v') === 'antigo') {
      window.location.href = '/relatorios-antigo.html';
      return;
    }

    const rotaParam = params.get('rota') || params.get('route') || params.get('r');
    const fluxoParam = params.get('fluxo');
    const path = window.location.pathname;

    if (rotaParam) {
      setActiveRoute(rotaParam);
    } else if (fluxoParam === 'externo') {
      setActiveRoute('cidadao');
    } else if (fluxoParam === 'interna') {
      setActiveRoute('emergencia-interna');
    } else if (path.includes('emergencia-quimica-externa')) {
      setActiveRoute('emergencia-externa');
    } else if (path.includes('consulta-externa')) {
      setActiveRoute('consulta-externa');
    } else if (path.includes('consulta-interna')) {
      setActiveRoute('consulta-interna');
    } else if (path.includes('fiscalizacao')) {
      setActiveRoute('atendente');
    }
  }, []);

  const handleNavigate = (route: string) => {
    setActiveRoute(route);
    const url = new URL(window.location.href);
    url.searchParams.set('rota', route);
    window.history.pushState({}, '', url.toString());
  };

  const renderContent = () => {
    switch (activeRoute) {
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
      case 'relatorios':
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ThemeProvider>
      <AppShell activeRoute={activeRoute} onNavigate={handleNavigate}>
        {renderContent()}
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
