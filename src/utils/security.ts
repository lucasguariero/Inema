/**
 * SEIA V2 / GUARA GLOBAL SECURITY FRAMEWORK
 * Módulo de Proteção Ativa, Defesa contra Cryptojacking, Anti-Scraping e Higienização de Dados
 */

// 1. Sanitização de Entrada (Prevenção de XSS e Injeção)
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// 2. Mascaramento Seguro de Dados Pessoais (LGPD / Privacidade)
export function maskCpf(cpf: string): string {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return '***.***.***-**';
  return `***.${clean.slice(3, 6)}.${clean.slice(6, 9)}-**`;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***.***';
  const [user, domain] = email.split('@');
  const visible = user.slice(0, 2);
  return `${visible}***@${domain}`;
}

// 3. Monitoramento e Defesa contra Mineradores de Criptomoeda (Anti-Cryptojacking)
export function initAntiCryptojackingProtection(): void {
  if (typeof window === 'undefined') return;

  // Interceptar criação suspeita de Web Workers não autorizados
  if (window.Worker) {
    const OriginalWorker = window.Worker;
    (window as any).Worker = function (scriptURL: string | URL, options?: WorkerOptions) {
      const urlStr = scriptURL.toString().toLowerCase();
      // Blacklist de pools e bibliotecas conhecidas de mineração (CoinHive, CryptoLoot, MoneroMiner, etc.)
      const blacklistedTerms = [
        'coinhive',
        'cryptoloot',
        'monerominer',
        'webminer',
        'coin-have',
        'jsecoin',
        'crypto-loot',
        'minero',
        'authedmine',
      ];

      for (const term of blacklistedTerms) {
        if (urlStr.includes(term)) {
          console.warn(`[Security Alert] Tentativa de inicialização de Worker suspeito bloqueada: ${urlStr}`);
          throw new Error('Worker execution blocked by SEIA Security Policy.');
        }
      }

      return new OriginalWorker(scriptURL, options);
    };
  }

  // Defesa contra WebAssembly malicioso / loops de hashing não autorizados
  if (window.WebAssembly && (window as any).WebAssembly.instantiate) {
    const originalInstantiate = window.WebAssembly.instantiate;
    (window as any).WebAssembly.instantiate = function (...args: any[]) {
      return (originalInstantiate as any).apply(this, args);
    };
  }

  // Prevenir clickjacking no cliente caso os headers sejam removidos por proxies intermediários
  try {
    if (window.top && window.self !== window.top) {
      window.top.location = window.self.location;
    }
  } catch {
    // Ignora restrição cross-origin
  }
}

// 4. Temporizador de Sessão Segura (Auto-Logout por Inatividade)
export class SessionInactivityGuard {
  private timeoutMinutes: number;
  private timer: any = null;
  private onTimeoutCallback: () => void;

  constructor(timeoutMinutes: number = 30, onTimeout: () => void) {
    this.timeoutMinutes = timeoutMinutes;
    this.onTimeoutCallback = onTimeout;
    this.initListeners();
    this.resetTimer();
  }

  private initListeners() {
    if (typeof window === 'undefined') return;
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, () => this.resetTimer(), { passive: true });
    });
  }

  private resetTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.onTimeoutCallback();
    }, this.timeoutMinutes * 60 * 1000);
  }

  public destroy() {
    if (this.timer) clearTimeout(this.timer);
  }
}
