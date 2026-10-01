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
import { CerhPage } from '@/pages/seia-v2/CerhPage';
import { DtrpPage } from '@/pages/seia-v2/DtrpPage';
import { ReposicaoFlorestalPage } from '@/pages/seia-v2/ReposicaoFlorestalPage';
import { CertidaoDebitoPage } from '@/pages/seia-v2/CertidaoDebitoPage';
import { AnslaPage } from '@/pages/seia-v2/AnslaPage';
import { ParcelamentoDebitoPage } from '@/pages/seia-v2/ParcelamentoDebitoPage';
import { CrasFaunaPage } from '@/pages/seia-v2/CrasFaunaPage';
import { CefirImoveisPage } from '@/pages/seia-v2/CefirImoveisPage';
import { SispassPerfisPage } from '@/pages/seia-v2/SispassPerfisPage';
import { RoteiroApresentacaoPage } from '@/pages/seia-v2/RoteiroApresentacaoPage';
import { CadastrosBasicosPage } from '@/pages/seia-v2/CadastrosBasicosPage';
import { PautaEnquadramentoPage } from '@/pages/seia-v2/PautaEnquadramentoPage';
import { ParametrizacoesMasterPage } from '@/pages/seia-v2/ParametrizacoesMasterPage';
import { UsuariosRolesPage } from '@/pages/seia-v2/UsuariosRolesPage';
import { SeiaV2LoginPage } from '@/pages/seia-v2/SeiaV2LoginPage';
import { SeiaV2InicioPage } from '@/pages/seia-v2/SeiaV2InicioPage';
import { NotificacoesPage } from '@/pages/seia-v2/NotificacoesPage';
import { AcessoPublicoPage } from '@/pages/seia-v2/AcessoPublicoPage';

export const SeiaV2RootPage: React.FC = () => {
  const [activeSubRoute, setActiveSubRoute] = useState<string>('inicio');

  const parseRouteFromUrl = (): string => {
    if (typeof window === 'undefined') return 'inicio';
    const params = new URLSearchParams(window.location.search);
    const tela = params.get('tela') || params.get('tab') || params.get('subrota');
    if (tela) {
      if (tela === 'login' || tela === 'auth' || tela === 'entrar') return 'login';
      if (tela === 'inicio' || tela === 'home') return 'inicio';
      if (tela === 'relatorios' || tela === 'dashboard' || tela === 'gerencial') return 'relatorios';
      if (tela === 'formulario' || tela === 'form' || tela === 'novo') return 'formulario';
      if (tela === 'tabela' || tela === 'pauta' || tela === 'processos') return 'tabela';
      if (tela === 'notificacoes' || tela === 'notificacao' || tela === 'notifs') return 'notificacoes';
      if (tela === 'acesso-publico' || tela === 'publico') return 'acesso-publico';
      if (tela === 'seia-painel' || tela === 'painel') return 'seia-painel';
      if (tela === 'atendente' || tela === 'denuncia-interna') return 'atendente';
      if (tela === 'cidadao' || tela === 'denuncia-externa') return 'cidadao';
      if (tela === 'emergencia-interna') return 'emergencia-interna';
      if (tela === 'emergencia-externa') return 'emergencia-externa';
      if (tela === 'consulta-externa') return 'consulta-externa';
      if (tela === 'consulta-interna') return 'consulta-interna';
      if (tela === 'cadastros' || tela === 'cadastros-basicos' || tela === 'responsaveis-tecnicos' || tela === 'empreendimentos') return 'cadastros-basicos';
      if (tela === 'pauta-enquadramento' || tela === 'enquadramento' || tela === 'pauta-area') return 'enquadramento';
      if (tela === 'parametrizacoes' || tela === 'parametrizacao' || tela === 'parametrizacoes-master' || tela === 'tipologias' || tela === 'residuos') return 'parametrizacao';
      if (tela === 'usuarios' || tela === 'usuarios-roles' || tela === 'roles' || tela === 'administracao') return 'usuarios-roles';
      if (tela === 'cras' || tela === 'cras-fauna' || tela === 'fauna') return 'cras';
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
      case 'login':
      case 'auth':
        return <SeiaV2LoginPage onNavigate={handleNavigate} onLoginSuccess={() => handleNavigate('inicio')} />;
      case 'tabela':
      case 'processos':
      case 'meus-processos':
      case 'analise-pauta-tecnico':
      case 'analise-tec-geral':
      case 'analise-tec-pauta':
      case 'processos-consultar':
      case 'processos-finalizados':
        return <SeiaV2TabelaOperacionalPage onNavigate={handleNavigate} />;
      case 'notificacoes':
        return <NotificacoesPage onNavigate={handleNavigate} />;
      case 'formulario':
        return <SeiaV2FormularioComplexoPage onNavigate={handleNavigate} />;
      case 'seia-painel':
        return <SeiaV2DashboardPage onNavigate={handleNavigate} />;
      case 'atendente':
        return <DenunciaInternaPage onNavigate={handleNavigate} />;
      case 'cidadao':
        return <DenunciaExternaPage onNavigate={handleNavigate} />;
      case 'acesso-publico':
        return <AcessoPublicoPage onNavigate={handleNavigate} />;
      case 'emergencia-interna':
        return <EmergenciaInternaPage onNavigate={handleNavigate} />;
      case 'emergencia-externa':
        return <EmergenciaExternaPage onNavigate={handleNavigate} />;
      case 'consulta-externa':
        return <ConsultaExternaPage onNavigate={handleNavigate} />;
      case 'consulta-interna':
      case 'minhas-emergencias':
      case 'minhas-analises':
      case 'associar-tecnico':
        return <ConsultaInternaPage onNavigate={handleNavigate} />;
      case 'seia-daes':
        return <SeiaDaesPage onNavigate={handleNavigate} />;
      case 'cerh':
      case 'outorga':
        return <CerhPage onNavigate={handleNavigate} />;
      case 'dtrp':
        return <DtrpPage onNavigate={handleNavigate} />;
      case 'reposicao-florestal':
      case 'crf':
        return <ReposicaoFlorestalPage onNavigate={handleNavigate} />;
      case 'certidao-debito':
      case 'cnd':
        return <CertidaoDebitoPage onNavigate={handleNavigate} />;
      case 'ansla':
      case 'dispensa':
      case 'ansla-dispensa':
        return <AnslaPage onNavigate={handleNavigate} />;
      case 'parcelamento':
      case 'req-parcelamento':
        return <ParcelamentoDebitoPage onNavigate={handleNavigate} />;
      case 'cras':
      case 'cras-fauna':
      case 'fauna':
      case 'fauna-admissao':
      case 'fauna-manejo':
      case 'dir-especies':
      case 'dir-destinacoes':
      case 'dir-recintos':
        return <CrasFaunaPage onNavigate={handleNavigate} />;
      case 'cefir':
      case 'cefir-imoveis':
        return <CefirImoveisPage onNavigate={handleNavigate} />;
      case 'sispass':
      case 'sispass-perfis':
      case 'sispass-pauta':
      case 'sispass-calendarios':
      case 'sispass-calendario-anual':
      case 'sispass-convites':
        return <SispassPerfisPage onNavigate={handleNavigate} />;
      case 'cadastros-basicos':
      case 'cadastros':
      case 'responsaveis-tecnicos':
      case 'cad-representante':
      case 'cad-responsavel':
      case 'cad-empreendimentos':
      case 'cad-pj':
      case 'cad-procurador':
      case 'cad-representacoes':
        return <CadastrosBasicosPage onNavigate={handleNavigate} />;
      case 'enquadramento':
      case 'pauta-enquadramento':
      case 'pauta-area':
      case 'enquadramento-tecnica':
      case 'analise-pauta-area':
      case 'analise-tec-coordenador':
        return <PautaEnquadramentoPage onNavigate={handleNavigate} />;
      case 'parametrizacao':
      case 'parametrizacoes':
      case 'parametrizacoes-master':
      case 'tipologias':
      case 'admin-residuos':
      case 'admin-porte':
      case 'admin-solicitacao':
      case 'admin-plantonistas':
      case 'admin-setores':
      case 'admin-legislacoes':
      case 'config-parametros':
      case 'config-informativos':
      case 'config-juros':
        return <ParametrizacoesMasterPage onNavigate={handleNavigate} />;
      case 'usuarios-roles':
      case 'usuarios':
      case 'roles':
      case 'administracao':
      case 'auditoria':
      case 'admin-grupos':
      case 'admin-pf':
      case 'admin-auditoria':
      case 'auditoria-registros':
        return <UsuariosRolesPage onNavigate={handleNavigate} />;
      case 'apresentacao':
      case 'pitch':
      case 'roteiro':
        return <RoteiroApresentacaoPage onNavigate={handleNavigate} />;
      case 'design-system':
        return <SeiaV2DesignSystemPage />;
      case 'relatorios':
      case 'dashboard':
      case 'financeiro-relatorios':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'inicio':
      default:
        return <SeiaV2InicioPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      {activeSubRoute === 'login' || activeSubRoute === 'auth' ? (
        <SeiaV2LoginPage onNavigate={handleNavigate} onLoginSuccess={() => handleNavigate('inicio')} />
      ) : activeSubRoute === 'design-system' ? (
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
