import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';

export function App() {
  const [activeRoute, setActiveRoute] = useState('relatorios');

  const handleNavigate = (route: string) => {
    setActiveRoute(route);
    // Para links de páginas HTML legadas:
    if (route === 'inicio') window.location.href = '/src/index.html';
    if (route === 'atendente') window.location.href = '/src/fiscalizacao.html';
    if (route === 'cidadao') window.location.href = '/src/fiscalizacao.html?fluxo=externo';
    if (route === 'emergencia-interna') window.location.href = '/src/emergencia-quimica.html?fluxo=interna';
    if (route === 'emergencia-externa') window.location.href = '/src/emergencia-quimica-externa.html';
    if (route === 'consulta-externa') window.location.href = '/src/consulta-externa.html';
    if (route === 'consulta-interna') window.location.href = '/src/consulta-interna.html';
  };

  return (
    <AppShell activeRoute={activeRoute} onNavigate={handleNavigate}>
      <DashboardPage />
    </AppShell>
  );
}

export default App;
