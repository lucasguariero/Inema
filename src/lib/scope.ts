export type AnalystScope = 'naiane' | 'herickles' | 'thays' | 'maria' | 'regulacao' | 'fiscalizacao' | 'todas';

/**
 * Detects whether the current session is scoped to a specific analyst delivery.
 * Criteria:
 * 1. Hostname (e.g. inema-regulacao.vercel.app -> 'regulacao')
 * 2. URL search parameters: ?escopo=regulacao or ?analista=naiane
 */
export function getCurrentScope(): AnalystScope {
  if (typeof window === 'undefined') return 'todas';

  const host = window.location.hostname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const paramScope = (params.get('escopo') || params.get('analista') || '').toLowerCase();

  if (
    paramScope === 'maria' ||
    paramScope === 'naiane' ||
    paramScope === 'regulacao' ||
    host.includes('inema-regulacao') ||
    host.includes('regulacao')
  ) {
    return 'regulacao';
  }

  if (
    paramScope === 'herickles' ||
    paramScope === 'fiscalizacao' ||
    host.includes('inema-fiscalizacao')
  ) {
    return 'fiscalizacao';
  }

  if (paramScope === 'thays') return 'thays';
  if (paramScope === 'maria') return 'maria';

  return 'todas';
}

/**
 * Returns whether a menu group should be displayed under the current scope.
 */
export function isGroupVisibleInScope(groupId: string, scope: AnalystScope): boolean {
  if (scope === 'todas') return true;
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
  if (scope === 'regulacao') {
    // Only 'relatorios' (Relatórios de Regulação) is in scope for Naiane
    return itemId === 'relatorios';
  }
  return true;
}
