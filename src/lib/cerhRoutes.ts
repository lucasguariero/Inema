export interface CerhShortRoute {
  path: string;
  route: 'cad-empreendimentos' | 'cerh';
  defaultVentureId?: string;
  defaultEtapa?: string;
  title: string;
}

export const CERH_SHORT_ROUTES: Record<string, CerhShortRoute> = {
  '/cerh/demo/resumo': {
    path: '/cerh/demo/resumo',
    route: 'cad-empreendimentos',
    defaultVentureId: 'VENT-REF',
    defaultEtapa: 'summary',
    title: 'Resumo Consolidado CERH (Demonstração)',
  },
  '/cerh/demo/uso-da-agua': {
    path: '/cerh/demo/uso-da-agua',
    route: 'cad-empreendimentos',
    defaultVentureId: 'VENT-01',
    defaultEtapa: 'water',
    title: 'Uso da Água CERH (Demonstração)',
  },
  '/cerh/demo/barragem': {
    path: '/cerh/demo/barragem',
    route: 'cad-empreendimentos',
    defaultVentureId: 'VENT-01',
    defaultEtapa: 'BAR',
    title: 'Barragem CERH (Demonstração)',
  },
  '/cerh/demo/intervencao': {
    path: '/cerh/demo/intervencao',
    route: 'cad-empreendimentos',
    defaultVentureId: 'VENT-01',
    defaultEtapa: 'INT',
    title: 'Intervenção em Corpo Hídrico CERH (Demonstração)',
  },
  '/cerh/demo/captacao-superficial': {
    path: '/cerh/demo/captacao-superficial',
    route: 'cad-empreendimentos',
    defaultVentureId: 'VENT-REF',
    defaultEtapa: 'SUP',
    title: 'Captação Superficial CERH (Demonstração)',
  },
  '/cerh/demo/captacao-subterranea': {
    path: '/cerh/demo/captacao-subterranea',
    route: 'cad-empreendimentos',
    defaultVentureId: 'VENT-REF',
    defaultEtapa: 'SUB',
    title: 'Captação Subterrânea CERH (Demonstração)',
  },
  '/cerh/demo/lancamento-efluentes': {
    path: '/cerh/demo/lancamento-efluentes',
    route: 'cad-empreendimentos',
    defaultVentureId: 'VENT-01',
    defaultEtapa: 'EFL',
    title: 'Lançamento de Efluentes CERH (Demonstração)',
  },
  '/cerh/consulta': {
    path: '/cerh/consulta',
    route: 'cerh',
    title: 'Consulta CERH',
  },
  '/cerh': {
    path: '/cerh',
    route: 'cerh',
    title: 'Consulta CERH',
  },
};

export function getShortRouteConfig(pathname: string): CerhShortRoute | undefined {
  if (!pathname) return undefined;
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  return CERH_SHORT_ROUTES[cleanPath];
}

export function isCerhRoute(pathname: string, searchParams: URLSearchParams): boolean {
  const cleanPath = (pathname || '').replace(/\/$/, '') || '/';
  if (cleanPath === '/cerh' || cleanPath.startsWith('/cerh/')) {
    return true;
  }

  const tela = (searchParams.get('tela') || '').toLowerCase();
  const rota = (searchParams.get('rota') || searchParams.get('route') || searchParams.get('r') || '').toLowerCase();
  // Administration is a CERH extension in the existing router, not a venture.
  if (['cerh-finalidades', 'cerh-tipos-uso', 'cerh-usuarios', 'cerh-grupos', 'cerh-contrato'].includes(rota)) return false;

  if (rota && !['cad-empreendimentos','empreendimentos','cerh','outorga','seia-v2'].includes(rota)) return false;

  // Explicit CERH parameters
  if (
    searchParams.has('cerh-empreendimento') ||
    searchParams.has('cerh-etapa') ||
    searchParams.has('cerh-ponto') ||
    searchParams.has('cerh-cenario')
  ) {
    return true;
  }

  if (tela === 'cad-empreendimentos' || tela === 'cerh' || tela === 'outorga') {
    return true;
  }

  if (rota === 'cad-empreendimentos' || rota === 'cerh' || rota === 'outorga') {
    return true;
  }

  return false;
}

export function getCerhTargetRoute(pathname: string, searchParams: URLSearchParams): 'cad-empreendimentos' | 'cerh' {
  const cleanPath = (pathname || '').replace(/\/$/, '') || '/';
  if (cleanPath === '/cerh' || cleanPath === '/cerh/consulta') {
    return 'cerh';
  }

  const shortConfig = getShortRouteConfig(cleanPath);
  if (shortConfig) {
    return shortConfig.route;
  }

  const tela = (searchParams.get('tela') || '').toLowerCase();
  const rota = (searchParams.get('rota') || searchParams.get('route') || searchParams.get('r') || '').toLowerCase();

  if (tela === 'cerh' || rota === 'cerh' || tela === 'outorga' || rota === 'outorga' || searchParams.has('cerh-ponto')) {
    return 'cerh';
  }

  return 'cad-empreendimentos';
}

export function getCerhInitialVenture(pathname: string, searchParams: URLSearchParams): string | undefined {
  const fromQuery = searchParams.get('cerh-empreendimento');
  if (fromQuery) return fromQuery;
  const shortConfig = getShortRouteConfig(pathname);
  return shortConfig?.defaultVentureId;
}

export function getCerhInitialEtapa(pathname: string, searchParams: URLSearchParams): string | undefined {
  const fromQuery = searchParams.get('cerh-etapa');
  if (fromQuery) return fromQuery;
  const shortConfig = getShortRouteConfig(pathname);
  return shortConfig?.defaultEtapa;
}
