# 🛡️ DIRETRIZ GLOBAL DE SEGURANÇA & DEFESA DE APLICAÇÕES WEB
**Padrão Corporativo Unificado: INEMA • GUARAS • GUARAS STORE / CRM**  
**Versão:** 1.0.0 — Produção  
**Classificação:** Segurança da Informação & Governança  

---

## 🎯 1. Objetivo & Escopo

Este documento estabelece o **padrão obrigatório de segurança, proteção contra invasões, defesa contra cryptojacking (mineração de criptomoeda oculta), isolamento de dados sensíveis (LGPD) e blindagem de borda** para todas as aplicações web desenvolvidas no ecossistema (SEIA V2 / INEMA, Guaras, Guaras Store / CRM).

---

## 🔒 2. Os 7 Pilares de Blindagem Obrigatória

### Pilar 1: Headers HTTP de Segurança em Borda (Vercel / Cloudflare / Nginx)
Toda aplicação em produção DEVE retornar os seguintes cabeçalhos de resposta:

```json
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=(), accelerometer=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https: wss:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin"
}
```

- **Bloqueio de Clickjacking (`X-Frame-Options: DENY`)**: Impede que a página seja aberta dentro de iframes maliciosos ou invisíveis.
- **Isolamento de Hardware (`Permissions-Policy`)**: Desativa acesso não solicitado a câmera, microfone, USB e sensores de movimento.
- **HSTS Forçado**: Garante 100% de tráfego criptografado TLS/HTTPS.

---

### Pilar 2: Proteção Anti-Cryptojacking & Mineradores Ocultos
Mineradores utilizam `Web Workers` e `WebAssembly` em background para consumir CPU dos clientes sem autorização.

**Implementação Ativa (`src/utils/security.ts`):**
1. **Interceptor de Web Workers**: Intercepta e barra a inicialização de scripts com padrões de pools de mineração conhecidos (`coinhive`, `cryptoloot`, `monerominer`, `webminer`, `jsecoin`, `minero`, `authedmine`).
2. **CSP Restritiva de Workers (`worker-src 'self' blob:`)**: Impede o download de scripts de workers de domínios desconhecidos.

---

### Pilar 3: Proteção de Dados Sensíveis e Mascaramento (LGPD)
Nenhum dado pessoal completo (CPF, senhas, tokens ou dados bancários) deve ficar exposto em logs de console, URLs (Query Params) ou visível sem necessidade:
- **CPF:** Exibir apenas no formato mascarado `***.456.789-**`.
- **E-mails:** Exibir no formato `th***@inema.ba.gov.br` ou `gu***@guaras.com.br`.
- **Tokens & Secrets:** Jamais trafegar em query strings de URL (usar cabeçalho `Authorization: Bearer <token>` ou cookies `HttpOnly; Secure; SameSite=Strict`).

---

### Pilar 4: Defesa Contra Bots & Scrapers Não Autorizados (`robots.txt`)
Configurar o arquivo `public/robots.txt` em todos os projetos para proibir bots de IA predatórios e scrapers de vasculharem áreas administrativas ou autenticadas:

```text
User-agent: *
Disallow: /?rota=*
Disallow: /?tela=*
Disallow: /admin
Disallow: /usuarios
Disallow: /auditoria
Disallow: /api/
Disallow: /login
Disallow: /auth

# Bloqueio de Crawlers de IA & Scrapers
User-agent: GPTBot
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: Bytespider
Disallow: /
```

---

### Pilar 5: Sanitização de Input & Prevenção de XSS
- Todo texto renderizado que venha de formulários de usuários ou integrações externas deve ser sanitizado contra injeção de HTML/JavaScript (`<script>`, `onerror=`, `javascript:`).
- Utilizar a função utilitária `sanitizeInput()` antes de armazenar ou repassar dados para o DOM.

---

### Pilar 6: Proteção de Sessão & Auto-Logout por Inatividade
- Sessões autenticadas devem possuir um watchdog de inatividade (`SessionInactivityGuard`).
- Após **30 minutos** sem movimentação de mouse, toque ou digitação, a aplicação encerra a sessão localmente, remove tokens da memória e redireciona para a tela de login.

---

### Pilar 7: Tratamento de Variáveis de Ambiente & Secrets (.env)
- **Regra de Ouro:** NUNCA prefixar chaves de backend privadas, senhas de banco ou tokens de API de terceiros com `VITE_` ou `NEXT_PUBLIC_`.
- Variáveis `VITE_` são embutidas em texto claro no JavaScript final do cliente.
- Apenas URLs públicas de backend e identificadores não confidenciais podem usar o prefixo `VITE_`.

---

## 📋 Checklist de Aplicação Rápida para Novos Projetos (Guaras / CRM / Store)

1. [x] Copiar o bloco `headers` de segurança para o `vercel.json` do projeto.
2. [x] Adicionar o `public/robots.txt` com as diretrizes de bloqueio de bots.
3. [x] Importar e invocar `initAntiCryptojackingProtection()` no ponto de entrada (`main.tsx` / `_app.tsx`).
4. [x] Verificar se `.env` não possui nenhuma chave privada exposta no bundle.
5. [x] Rodar `npm run build` e auditar os headers de resposta em produção.
