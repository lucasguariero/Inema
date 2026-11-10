import { ConselhoPage } from '@/pages/uc/conselho/ConselhoPage';
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
import { PautaGestorRegistrosPage } from '@/pages/fiscalizacao/PautaGestorRegistrosPage';
import { AiadPage } from '@/pages/fiscalizacao/AiadPage';
import { AiapPage } from '@/pages/fiscalizacao/apreensao/AiapPage';
import { RfaPage, RaePage } from '@/pages/fiscalizacao/relatorios/ReportWorkspace';
import { EntradaUnicaPage } from '@/pages/uc/entrada-unica/EntradaUnicaPage';
import { EntradaDestino } from '@/pages/uc/entrada-unica/EntradaDestino';
import { AutorizacaoVisitacaoPage } from '@/pages/uc/AutorizacaoVisitacaoPage';
import { AtividadesDidaticasPage } from '@/pages/uc/AtividadesDidaticasPage';
import { PesquisaCientificaPage } from '@/pages/uc/PesquisaCientificaPage';
import { RelatoriosRegulacaoPage } from '@/pages/regulacao/RelatoriosRegulacaoPage';
import { PautaCoordenadorPage } from '@/pages/regulacao/pauta/PautaCoordenadorPage';
import { CeucConsultaPage } from '@/pages/uc/CeucConsultaPage';
import { EspeciesTaxonomiaPage } from '@/pages/fauna/EspeciesTaxonomiaPage';
import { UnidadesDestinosPage } from '@/pages/fauna/UnidadesDestinosPage';
import { DocumentosTermosPage } from '@/pages/fauna/DocumentosTermosPage';
import { ProcedenciaAnimalPage } from '@/pages/fauna/ProcedenciaAnimalPage';
import { RecintosAreasPage } from '@/pages/fauna/RecintosAreasPage';
import { TiposManejoPage } from '@/pages/fauna/TiposManejoPage';
import { AnimaisPage } from '@/pages/fauna/AnimaisPage';
import { AdmissaoPainelPage } from '@/pages/fauna/admissao/AdmissaoPainelPage';
import { AsasModulePage } from '@/pages/fauna/AsasModulePage';
import { MapaAsasDestinacoesPage } from '@/pages/fauna/MapaAsasDestinacoesPage';
import { GuardiaoModulePage } from '@/pages/fauna/GuardiaoModulePage';
import { CadastrosBasicosPage } from '@/pages/seia-v2/CadastrosBasicosPage';
import { CerhPage } from '@/pages/seia-v2/CerhPage';
import { CatalogPage } from '@/pages/seia-v2/cerh/CatalogPage';
import { ContractPreview } from '@/pages/seia-v2/cerh/ContractPreview';
import { PartnersPage } from '@/pages/seia-v2/cerh/PartnersPage';
import { SeiaV2RootPage } from '@/pages/seia-v2/SeiaV2RootPage';
import { CoineBessLpPage } from '@/pages/coine/CoineBessLpPage';
import { CoineFcePage } from '@/pages/coine/CoineFcePage';
import { eolica, solar, datacenter, turismo } from '@/pages/coine/coineFces';
import { CoindFcePage } from '@/pages/coind/CoindFcePage';
import { industria, desmantelamento, dutovia } from '@/pages/coind/coindFces';
import { SignatureWorkspacePage } from '@/pages/signature/SignatureWorkspacePage';
import { SignaturePublicValidationPage } from '@/pages/signature/SignaturePublicValidationPage';
import { getCurrentScope } from '@/lib/scope';
import { isCerhRoute, getCerhTargetRoute } from '@/lib/cerhRoutes';

export function App() {
  const [pautaImmersive, setPautaImmersive] = useState(() => new URLSearchParams(window.location.search).get('pauta-tela') === 'documentos');
  const [activeRoute, setActiveRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname.toLowerCase();
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);

      // 1. Prioridade absoluta: rotas do CERH (curtas ou com parâmetros legados)
      if (isCerhRoute(path, params)) {
        return getCerhTargetRoute(path, params);
      }

      // 2. SEIA V2 genuíno (telas e rotas internas do novo sistema / Tales COTIC)
      const v = params.get('v');
      const r = (params.get('rota') || params.get('route') || params.get('r') || '').toLowerCase();
      const escopo = (params.get('escopo') || '').toLowerCase();
      if (
        host.includes('inema-lucas') ||
        v === 'v2' ||
        v === 'seia-v2' ||
        r === 'seia-v2' ||
        r === 'tales' ||
        r === 'cotic' ||
        escopo === 'tales' ||
        escopo === 'cotic' ||
        path.startsWith('/seia-v2') ||
        path.startsWith('/tales') ||
        path.startsWith('/cotic')
      ) {
        return 'seia-v2';
      }

      if (r) {
        return r;
      }

      const scope = getCurrentScope();
      if (scope === 'assinatura-eletronica') return 'a-assinar';
      if (scope === 'padronizacao-pauta') return 'reg-pauta-area';
      if (scope === 'pauta-gestor') return 'fisc-pauta-gestor-registros';
      if (scope === 'ceuc' || scope === 'herikles' || path.startsWith('/ceuc')) return 'ceuc';
      if (scope === 'fiscalizacao') return 'consulta-interna';
      if (scope === 'naiane' || scope === 'regulacao' || path.startsWith('/relatorios') || path.startsWith('/regulacao')) return 'relatorios';
      if (scope === 'maria') return 'cad-empreendimentos';
    }
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

    // 1. CERH Interception: Resolve para a shell do Legado, mesmo se houver rota=seia-v2
    if (isCerhRoute(path, params)) {
      setActiveRoute(getCerhTargetRoute(path, params));
      return;
    }

    const rLower = (rotaParam || '').toLowerCase();
    const escopoLower = (params.get('escopo') || '').toLowerCase();
    if (
      host.includes('inema-lucas') ||
      vParam === 'v2' ||
      vParam === 'seia-v2' ||
      rLower === 'seia-v2' ||
      rLower === 'tales' ||
      rLower === 'cotic' ||
      escopoLower === 'tales' ||
      escopoLower === 'cotic' ||
      path.includes('seia-v2') ||
      path.startsWith('/tales') ||
      path.startsWith('/cotic')
    ) {
      setActiveRoute('seia-v2');
      return;
    }

    if (rotaParam === 'ceuc' || rotaParam === 'ceuc-consulta' || path.startsWith('/ceuc')) {
      setActiveRoute('ceuc');
    } else if (rotaParam) {
      setActiveRoute(rotaParam);
    } else if (scope === 'assinatura-eletronica') {
      setActiveRoute('a-assinar');
    } else if (scope === 'padronizacao-pauta') {
      setActiveRoute('reg-pauta-area');
    } else if (scope === 'ceuc' || scope === 'herikles') {
      setActiveRoute('ceuc');
    } else if (scope === 'regulacao' || scope === 'naiane' || path.startsWith('/relatorios') || path.startsWith('/regulacao')) {
      setActiveRoute('relatorios');
    } else if (scope === 'maria') {
      setActiveRoute('cad-empreendimentos');
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

  useEffect(() => {
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const currentPath = window.location.pathname;
      if (isCerhRoute(currentPath, currentParams)) {
        setActiveRoute(getCerhTargetRoute(currentPath, currentParams));
        return;
      }
      const r = currentParams.get('rota') || currentParams.get('route') || currentParams.get('r');
      if (r) setActiveRoute(r);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: string) => {
    // A entrada na Pauta precisa receber a política HTTP própria do leitor PDF.
    if (route === 'reg-pauta-area' && activeRoute !== 'reg-pauta-area') {
      window.location.assign('/?rota=reg-pauta-area&escopo=padronizacao-pauta');
      return;
    }
    setActiveRoute(route);
    const url = new URL(window.location.href);
    if (url.pathname.startsWith('/cerh')) {
      url.pathname = '/';
    }
    url.searchParams.set('rota', route);
    if (['a-assinar', 'assinatura-eletronica'].includes(route)) {
      url.searchParams.set('escopo', 'assinatura-eletronica');
    }
    if (!route.startsWith('uc-conselh')) for (const key of ['conselho-id','cg-dor','cg-tela','cg-perfil','cg-reuniao']) url.searchParams.delete(key);
    if (!['uc-entrada-unica','uc-agendamento','uc-autorizacao-visitacao','uc-atividades-didaticas','uc-pesquisa-cientifica'].includes(route)) {
      url.searchParams.delete('triagem-id'); url.searchParams.delete('triagem-tela');
    }
    url.searchParams.delete('cerh-empreendimento');
    url.searchParams.delete('cerh-etapa');
    url.searchParams.delete('cerh-ponto');
    if (!['cad-empreendimentos','empreendimentos','cerh','outorga','cerh-finalidades','cerh-tipos-uso','cerh-usuarios','cerh-grupos','cerh-contrato'].includes(route)) for (const key of [...url.searchParams.keys()]) if (key.startsWith('cerh-')) url.searchParams.delete(key);
    window.history.pushState({}, '', url.toString());
  };

  const renderContent = () => {
    switch (activeRoute) {
      case 'atendente':
      case 'nova-denuncia':
        return <DenunciaInternaPage onNavigate={handleNavigate} />;
      case 'cidadao':
        return <DenunciaExternaPage onNavigate={handleNavigate} />;
      case 'emergencia-interna':
      case 'nova-emergencia':
        return <EmergenciaInternaPage onNavigate={handleNavigate} />;
      case 'emergencia-externa':
        return <EmergenciaExternaPage onNavigate={handleNavigate} />;
      case 'consulta-externa':
        return <ConsultaExternaPage onNavigate={handleNavigate} />;
      case 'consulta-interna':
      case 'fisc-denuncia':
      case 'denuncia':
      case 'minhas-denuncias':
        return <ConsultaInternaPage onNavigate={handleNavigate} modoContexto="denuncias" />;
      case 'fisc-emergencia':
      case 'emergencia':
      case 'minhas-emergencias':
        return <ConsultaInternaPage onNavigate={handleNavigate} modoContexto="emergencias" />;
      case 'fisc-plantonista':
        return <CadastroPlantonistaPage onNavigate={handleNavigate} />;
      case 'fisc-escala':
        return <CadastroEscalaPage onNavigate={handleNavigate} />;
      case 'fisc-pauta-gestor-registros':
        return <PautaGestorRegistrosPage />;
      case 'fisc-aiad':
        return <AiadPage onNavigate={handleNavigate} />;
      case 'fisc-aiap':
        return <AiapPage onNavigate={handleNavigate} />;
      case 'fisc-rfa':
        return <RfaPage />;
      case 'fisc-rae':
        return <RaePage />;
      case 'uc-conselhos':
      case 'uc-conselho-criacao':
      case 'uc-conselho-implementacao':
        return <ConselhoPage route={activeRoute} />;
      case 'ceuc':
      case 'ceuc-consulta':
        return <CeucConsultaPage />;
      case 'uc-agendamento':
      case 'uc-entrada-unica':
        return <EntradaUnicaPage onNavigate={handleNavigate} />;
      case 'uc-autorizacao-visitacao':
        return <EntradaDestino key="uc-autorizacao-visitacao" route="uc-autorizacao-visitacao" onNavigate={handleNavigate}>{props => <AutorizacaoVisitacaoPage {...props} onNavigate={handleNavigate} />}</EntradaDestino>;
      case 'uc-atividades-didaticas':
        return <EntradaDestino key="uc-atividades-didaticas" route="uc-atividades-didaticas" onNavigate={handleNavigate}>{props => <AtividadesDidaticasPage {...props} onNavigate={handleNavigate} />}</EntradaDestino>;
      case 'uc-pesquisa-cientifica':
        return <EntradaDestino key="uc-pesquisa-cientifica" route="uc-pesquisa-cientifica" onNavigate={handleNavigate}>{props => <PesquisaCientificaPage {...props} onNavigate={handleNavigate} />}</EntradaDestino>;
      case 'fauna-especies':
        return <EspeciesTaxonomiaPage onNavigate={handleNavigate} />;
      case 'fauna-unidades':
        return <UnidadesDestinosPage onNavigate={handleNavigate} />;
      case 'fauna-documentos':
        return <DocumentosTermosPage onNavigate={handleNavigate} />;
      case 'fauna-procedencia':
        return <ProcedenciaAnimalPage onNavigate={handleNavigate} />;
      case 'fauna-recintos':
        return <RecintosAreasPage onNavigate={handleNavigate} />;
      case 'fauna-manejos':
        return <TiposManejoPage onNavigate={handleNavigate} />;
      case 'fauna-admissao':
        return <AdmissaoPainelPage onNavigate={handleNavigate} />;
      case 'fauna-animais':
        return <AnimaisPage onNavigate={handleNavigate} />;
      case 'fauna-asas':
        return <AsasModulePage onNavigate={handleNavigate} />;
      case 'fauna-mapa-asas':
        return <MapaAsasDestinacoesPage onNavigate={handleNavigate} />;
      case 'fauna-guardiao':
        return <GuardiaoModulePage onNavigate={handleNavigate} />;
      case 'relatorios':
      case 'regulacao':
        return <RelatoriosRegulacaoPage />;
      case 'reg-pauta-area':
        return <PautaCoordenadorPage onImmersiveChange={setPautaImmersive} />;
      case 'cad-empreendimentos':
      case 'empreendimentos':
        return <CadastrosBasicosPage onNavigate={handleNavigate} initialTab="empreendimentos" />;
      case 'cerh':
      case 'outorga':
        return <CerhPage onNavigate={handleNavigate} />;
      case 'cerh-contrato':
        return <ContractPreview />;
      case 'cerh-finalidades':
        return <CatalogPage kind="purpose" />;
      case 'cerh-tipos-uso':
        return <CatalogPage kind="type" />;
      case 'cerh-usuarios':
        return <PartnersPage mode="users" />;
      case 'cerh-grupos':
        return <PartnersPage mode="groups" />;
      case 'coine-bess':
      case 'bess-lp':
        return <CoineBessLpPage onNavigate={handleNavigate} />;
      case 'coine-eolica':
        return <CoineFcePage key="eolica" definition={eolica} onNavigate={handleNavigate} />;
      case 'coine-solar':
        return <CoineFcePage key="solar" definition={solar} onNavigate={handleNavigate} />;
      case 'coine-datacenter':
        return <CoineFcePage key="datacenter" definition={datacenter} onNavigate={handleNavigate} />;
      case 'coine-turismo':
        return <CoineFcePage key="turismo" definition={turismo} onNavigate={handleNavigate} />;
      case 'coind-industria':
        return <CoindFcePage key="industria" definition={industria} onNavigate={handleNavigate} />;
      case 'coind-desmantelamento':
        return <CoindFcePage key="desmantelamento" definition={desmantelamento} onNavigate={handleNavigate} />;
      case 'coind-dutovia':
        return <CoindFcePage key="dutovia" definition={dutovia} onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'assinatura-eletronica':
        return <SignatureWorkspacePage key="todos" onNavigate={handleNavigate} initialTab="todos" />;
      case 'a-assinar':
        return <SignatureWorkspacePage key="a-assinar" onNavigate={handleNavigate} initialTab="a-assinar" />;
      case 'autenticidade-documento':
        return <SignaturePublicValidationPage />;
      default:
        return <RelatoriosRegulacaoPage />;
    }
  };

  if (activeRoute === 'autenticidade-documento') {
    return <ThemeProvider><SignaturePublicValidationPage /></ThemeProvider>;
  }

  if (['uc-conselho-publico','uc-conselho-portal'].includes(activeRoute)) {
    return <ThemeProvider><ConselhoPage route={activeRoute} /></ThemeProvider>;
  }

  if (activeRoute === 'seia-v2') {
    return <SeiaV2RootPage />;
  }

  return (
    <ThemeProvider>
      <AppShell activeRoute={activeRoute} onNavigate={handleNavigate} variant={activeRoute === 'reg-pauta-area' && pautaImmersive ? 'document-explorer' : 'default'}>
        {renderContent()}
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
