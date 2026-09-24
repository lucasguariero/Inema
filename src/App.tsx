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
import { CadastroPlantonistaPage } from '@/pages/fiscalizacao/CadastroPlantonistaPage';
import { CadastroEscalaPage } from '@/pages/fiscalizacao/CadastroEscalaPage';
import { AgendamentoVisitacaoPage } from '@/pages/uc/AgendamentoVisitacaoPage';
import { AutorizacaoVisitacaoPage } from '@/pages/uc/AutorizacaoVisitacaoPage';
import { AtividadesDidaticasPage } from '@/pages/uc/AtividadesDidaticasPage';
import { PesquisaCientificaPage } from '@/pages/uc/PesquisaCientificaPage';
import { RelatoriosRegulacaoPage } from '@/pages/regulacao/RelatoriosRegulacaoPage';
import { CeucConsultaPage } from '@/pages/uc/CeucConsultaPage';
import { SeiaHomePage } from '@/pages/hibrido/SeiaHomePage';
import { SeiaDaesPage } from '@/pages/hibrido/SeiaDaesPage';
import { getCurrentScope } from '@/lib/scope';

export function App() {
  const [activeRoute, setActiveRoute] = useState(() => {
    const scope = getCurrentScope();
    if (scope === 'ceuc') return 'ceuc';
    return scope === 'regulacao' ? 'relatorios' : 'seia-home';
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Keep ?layout=antigo support if explicitly requested
    if (params.get('layout') === 'antigo' || params.get('v') === 'antigo') {
      window.location.replace('/relatorios-antigo.html');
      return;
    }

    const rotaParam = params.get('rota') || params.get('route') || params.get('r');
    const vParam = params.get('v');
    const fluxoParam = params.get('fluxo');
    const path = window.location.pathname;
    const scope = getCurrentScope();

    if (vParam === 'hibrido' || rotaParam === 'hibrido' || rotaParam === 'seia') {
      setActiveRoute('seia-home');
    } else if (rotaParam === 'ceuc' || rotaParam === 'ceuc-consulta') {
      setActiveRoute('ceuc');
    } else if (rotaParam) {
      setActiveRoute(rotaParam);
    } else if (scope === 'ceuc') {
      setActiveRoute('ceuc');
    } else if (scope === 'regulacao') {
      setActiveRoute('relatorios');
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
      case 'seia-home':
      case 'hibrido':
        return <SeiaHomePage onNavigate={handleNavigate} />;
      case 'seia-daes':
        return <SeiaDaesPage onNavigate={handleNavigate} />;
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
      case 'fisc-plantonista':
        return <CadastroPlantonistaPage onNavigate={handleNavigate} />;
      case 'fisc-escala':
        return <CadastroEscalaPage onNavigate={handleNavigate} />;
      case 'ceuc':
      case 'ceuc-consulta':
        return <CeucConsultaPage />;
      case 'uc-agendamento':
        return <AgendamentoVisitacaoPage onNavigate={handleNavigate} />;
      case 'uc-autorizacao-visitacao':
        return <AutorizacaoVisitacaoPage onNavigate={handleNavigate} />;
      case 'uc-atividades-didaticas':
        return <AtividadesDidaticasPage onNavigate={handleNavigate} />;
      case 'uc-pesquisa-cientifica':
        return <PesquisaCientificaPage onNavigate={handleNavigate} />;
      case 'relatorios':
      case 'regulacao':
        return <RelatoriosRegulacaoPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <SeiaHomePage onNavigate={handleNavigate} />;
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
