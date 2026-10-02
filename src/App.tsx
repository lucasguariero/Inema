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
import { SeiaV2RootPage } from '@/pages/seia-v2/SeiaV2RootPage';
import { getCurrentScope } from '@/lib/scope';

export function App() {
  const [activeRoute, setActiveRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      const r = params.get('rota') || params.get('route') || params.get('r');
      if (host.includes('inema-lucas') || v === 'v2' || v === 'seia-v2' || r === 'seia-v2') {
        return 'seia-v2';
      }
    }
    const scope = getCurrentScope();
    if (scope === 'ceuc') return 'ceuc';
    if (scope === 'fiscalizacao') return 'consulta-interna';
    return 'relatorios';
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
    const host = window.location.hostname.toLowerCase();
    const scope = getCurrentScope();

    if (host.includes('inema-lucas') || vParam === 'v2' || vParam === 'seia-v2' || rotaParam === 'seia-v2' || path.includes('seia-v2')) {
      setActiveRoute('seia-v2');
      return;
    }

    if (rotaParam === 'ceuc' || rotaParam === 'ceuc-consulta') {
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
        return <RelatoriosRegulacaoPage />;
    }
  };

  if (activeRoute === 'seia-v2') {
    return <SeiaV2RootPage />;
  }

  return (
    <ThemeProvider>
      <AppShell activeRoute={activeRoute} onNavigate={handleNavigate}>
        {renderContent()}
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
