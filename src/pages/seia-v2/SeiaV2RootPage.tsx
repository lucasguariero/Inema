import React, { useState, useEffect } from 'react';
import { SeiaV2Layout, SeiaV2Screen } from '@/components/seia-v2/SeiaV2Layout';
import { SeiaV2DashboardPage } from '@/components/seia-v2/SeiaV2DashboardPage';
import { SeiaV2FormularioComplexoPage } from '@/components/seia-v2/SeiaV2FormularioComplexoPage';
import { SeiaV2TabelaOperacionalPage } from '@/components/seia-v2/SeiaV2TabelaOperacionalPage';

export const SeiaV2RootPage: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<SeiaV2Screen>('dashboard');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tela = params.get('tela') || params.get('tab') || params.get('v2');
    if (tela === 'formulario' || tela === 'form' || tela === 'novo') {
      setCurrentScreen('formulario');
    } else if (tela === 'tabela' || tela === 'pauta' || tela === 'processos') {
      setCurrentScreen('tabela');
    } else if (tela === 'dashboard' || tela === 'painel') {
      setCurrentScreen('dashboard');
    }
  }, []);

  const handleScreenChange = (screen: SeiaV2Screen) => {
    setCurrentScreen(screen);
    const url = new URL(window.location.href);
    url.searchParams.set('tela', screen);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <SeiaV2Layout currentScreen={currentScreen} onScreenChange={handleScreenChange}>
      {currentScreen === 'dashboard' && <SeiaV2DashboardPage />}
      {currentScreen === 'formulario' && <SeiaV2FormularioComplexoPage />}
      {currentScreen === 'tabela' && <SeiaV2TabelaOperacionalPage />}
    </SeiaV2Layout>
  );
};
