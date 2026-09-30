export type AnalystScope = 'naiane' | 'herickles' | 'thays' | 'maria' | 'regulacao' | 'fiscalizacao' | 'ceuc' | 'todas';

/**
 * Detects whether the current session is scoped to a specific analyst delivery.
 * Criteria:
 * 1. Hostname (e.g. inema-regulacao.vercel.app -> 'regulacao')
 * 2. URL search parameters: ?escopo=ceuc or ?modulo=ceuc
 */
export function getCurrentScope(): AnalystScope {
  if (typeof window === 'undefined') return 'todas';

  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const paramScope = (params.get('escopo') || params.get('modulo') || params.get('rota') || params.get('route') || '').toLowerCase();

  if (
    paramScope === 'ceuc' ||
    path.startsWith('/ceuc') ||
    host.includes('inema-ceuc')
  ) {
    return 'ceuc';
  }

  if (
    paramScope === 'regulacao' ||
    paramScope === 'relatorios' ||
    path.startsWith('/regulacao') ||
    path.startsWith('/relatorios') ||
    host.includes('inema-regulacao') ||
    host.includes('regulacao')
  ) {
    return 'regulacao';
  }

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
  if (scope === 'todas') return true;
  if (scope === 'ceuc') {
    return groupId === 'unidades-conservacao';
  }
  if (scope === 'regulacao') {
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
  if (scope === 'todas') return true;
  if (scope === 'ceuc') {
    return itemId === 'ceuc-consulta';
  }
  if (scope === 'regulacao') {
    // Only 'relatorios' (Relatórios de Regulação) is in scope for Naiane/Maria
    return itemId === 'relatorios';
  }
  return true;
}
