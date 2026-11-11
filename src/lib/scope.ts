export type AnalystScope = 'fiscalizacao-autos' | 'coine-fces' | 'conselho-gestor' | 'naiane' | 'herickles' | 'herikles' | 'thays' | 'maria' | 'regulacao' | 'fiscalizacao' | 'pauta-gestor' | 'ceuc' | 'todas' | 'padronizacao-pauta' | 'assinatura-eletronica' | 'fauna' | 'uc-release3' | 'uc-release2';

/**
 * Detects whether the current session is scoped to a specific delivery/demand.
 * Criteria:
 * 1. URL search parameters: ?escopo=regulacao, ?escopo=ceuc, ?escopo=dor036, ?escopo=dr13, etc.
 * 2. Hostname or path conventions.
 * NOTE: URLs presented to users must use demand names (e.g. escopo=regulacao, escopo=ceuc, escopo=dor036), never individual names.
 */
export function getCurrentScope(): AnalystScope {
  if (typeof window === 'undefined') return 'todas';

  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const paramScope = (params.get('escopo') || params.get('modulo') || params.get('demanda') || params.get('analista') || '').toLowerCase();
  const rotaParam = (params.get('rota') || params.get('route') || '').toLowerCase();

  if (paramScope === 'fiscalizacao-autos') return 'fiscalizacao-autos';
  // Assinatura Eletrônica (Thays + Matheus) — Módulo demonstrativo isolado
  if (
    paramScope === 'assinatura-eletronica' ||
    paramScope === 'assinatura' ||
    ['a-assinar', 'assinatura-eletronica'].includes(rotaParam) ||
    (paramScope === 'thays' && ['a-assinar', 'assinatura-eletronica'].includes(rotaParam))
  ) {
    return 'assinatura-eletronica';
  }
  if (paramScope === 'uc-release2' || ['uc-anuencia-estadual', 'uc-anuencia-federal', 'uc-ciencia-estadual'].includes(rotaParam)) return 'uc-release2';
  if (paramScope === 'coine-fces' || ['coine-eolica','coine-solar','coine-datacenter','coine-turismo'].includes(rotaParam)) return 'coine-fces';
  if (
    paramScope === 'uc-release3' ||
    paramScope === 'dor0025' ||
    paramScope === 'dor008' ||
    paramScope === 'apdo' ||
    paramScope === 'dso' ||
    ['uc-apdo-portal', 'uc-apdo', 'uc-dso-portal', 'uc-dso'].includes(rotaParam)
  ) {
    return 'uc-release3';
  }
  if (paramScope === 'conselho-gestor' || rotaParam.startsWith('uc-conselh')) return 'conselho-gestor';
  if (paramScope === 'padronizacao-pauta' || rotaParam === 'reg-pauta-area') return 'padronizacao-pauta';

  // Demanda Gestão de Fauna Silvestre (DR009 / DR010 / DR012)
  if (
    paramScope === 'fauna' ||
    paramScope === 'dr009' ||
    paramScope === 'dr010' ||
    paramScope === 'dr012' ||
    paramScope === 'asas' ||
    paramScope === 'guardiao' ||
    rotaParam.startsWith('fauna-')
  ) {
    return 'fauna';
  }

  // 1. Demanda Pauta do Gestor (DOR011)
  if (paramScope === 'pauta-gestor' || paramScope === 'dor011' || paramScope === 'dor11' || rotaParam === 'fisc-pauta-gestor-registros') {
    return 'pauta-gestor';
  }

  // 2. Demanda CEUC / Gestão de UCs (DOR036 - Érick)
  if (
    paramScope === 'ceuc' ||
    paramScope === 'dor036' ||
    paramScope === 'dor36' ||
    paramScope === 'herikles' ||
    paramScope === 'erick' ||
    paramScope === 'érick' ||
    path.startsWith('/ceuc') ||
    host.includes('inema-ceuc') ||
    host.includes('inema-uc')
  ) {
    return 'ceuc';
  }

  // 3. Demanda Relatórios de Regulação SEIA (Naiane / Regulação / DR13)
  if (
    paramScope === 'regulacao' ||
    paramScope === 'relatorios' ||
    paramScope === 'dr13' ||
    paramScope === 'dr013' ||
    paramScope === 'reg013' ||
    paramScope === 'reg13' ||
    paramScope === 'naiane' ||
    path.startsWith('/relatorios') ||
    path.startsWith('/regulacao') ||
    host.includes('inema-regulacao')
  ) {
    return 'regulacao';
  }

  // 4. Demanda CERH (DR001 / Maria)
  if (
    paramScope === 'cerh' ||
    paramScope === 'dr001' ||
    paramScope === 'dr01' ||
    paramScope === 'dr1' ||
    paramScope === 'maria' ||
    host.includes('inema-cerh')
  ) {
    return 'maria';
  }

  // 5. Demanda SEIA V2 (Thays / COTIC / Tales)
  if (
    paramScope === 'seia-v2' ||
    paramScope === 'thays' ||
    paramScope === 'cotic' ||
    paramScope === 'tales' ||
    host.includes('inema-thays')
  ) {
    return 'thays';
  }

  // 6. Demanda Fiscalização Geral
  if (
    paramScope === 'fiscalizacao' ||
    path.startsWith('/fiscalizacao') ||
    host.includes('inema-fiscalizacao')
  ) {
    return 'fiscalizacao';
  }

  return 'todas';
}

/**
 * Returns whether a menu group should be displayed under the current scope.
 */
export function isGroupVisibleInScope(groupId: string, scope: AnalystScope): boolean {
  if (scope === 'fiscalizacao-autos') return groupId === 'fiscalizacao';
  if (scope === 'assinatura-eletronica') return groupId === 'assinatura-eletronica';
  if (groupId === 'assinatura-eletronica') return false;
  if (scope === 'fauna') return groupId === 'fauna';
  if (scope === 'coine-fces') return groupId === 'regulacao';
  if (scope === 'conselho-gestor') return groupId === 'unidades-conservacao';
  if (scope === 'uc-release2') return groupId === 'unidades-conservacao';
  if (scope === 'uc-release3') return groupId === 'unidades-conservacao';
  if (scope === 'padronizacao-pauta') return groupId === 'regulacao';
  if (scope === 'todas') return true;
  if (scope === 'pauta-gestor') return groupId === 'fiscalizacao';
  if (scope === 'ceuc' || scope === 'herikles') {
    return groupId === 'unidades-conservacao';
  }
  if (scope === 'regulacao' || scope === 'naiane' || scope === 'maria') {
    return groupId === 'regulacao';
  }
  if (scope === 'fiscalizacao') {
    return groupId === 'fiscalizacao';
  }
  return true;
}

/**
 * Returns whether a specific menu item should be displayed under the current scope.
 */
export function isItemVisibleInScope(itemId: string, scope: AnalystScope): boolean {
  if (scope === 'fiscalizacao-autos') return ['fisc-aiad','fisc-aiap','fisc-aiin','fisc-aiid','fisc-aiet','fisc-aied'].includes(itemId);
  if (scope === 'assinatura-eletronica') return ['a-assinar', 'assinatura-eletronica'].includes(itemId);
  if (scope === 'fauna') return itemId.startsWith('fauna-');
  if (scope === 'coine-fces') return ['coine-bess','coine-eolica','coine-solar','coine-datacenter','coine-turismo'].includes(itemId);
  if (scope === 'conselho-gestor') return itemId === 'uc-conselhos';
  if (scope === 'uc-release2') return ['uc-anuencia-estadual', 'uc-anuencia-federal', 'uc-ciencia-estadual'].includes(itemId);
  if (scope === 'uc-release3') return ['uc-apdo-portal', 'uc-apdo', 'uc-dso-portal', 'uc-dso'].includes(itemId);
  if (scope === 'padronizacao-pauta') return itemId === 'reg-pauta-area';
  if (scope === 'todas') return true;
  if (scope === 'pauta-gestor') return itemId === 'fisc-pauta-gestor-registros';
  if (scope === 'fiscalizacao' && itemId === 'fisc-pauta-gestor-registros') return false;
  
  // Demanda CEUC (DOR036): apenas Cadastro de UC (CEUC)
  if (scope === 'ceuc' || scope === 'herikles') {
    return itemId === 'ceuc-consulta';
  }

  // Demanda Regulação (Relatórios SEIA): apenas Relatórios de Regulação
  if (scope === 'naiane' || scope === 'regulacao') {
    return itemId === 'relatorios';
  }

  // Demanda CERH: apenas Empreendimentos e Consulta CERH
  if (scope === 'maria') {
    return itemId === 'cerh-empreendimentos' || itemId === 'cerh-consulta';
  }

  return true;
}
