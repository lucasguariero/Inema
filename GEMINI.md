# Inema

# Autonomous Execution & Zero-Interruption Rules (Antigravity & Gemini)

- **Total Autonomy**: Execute all tasks end-to-end without pausing for trivial questions, micro-approvals, or intermediate confirmations.
- **Proactive Implementation**: Read, create, edit files, and run commands immediately as needed to complete the task. Never ask "Can I run this?", "Should I proceed?" or "Would you like me to do X?". Proceed directly with the optimal implementation.
- **Engineering Judgment**: When requirements have minor ambiguity, make sensible, industry-standard engineering decisions instead of stopping to ask clarifying questions. Document choices in the final summary.
- **Autonomous Error Resolution**: When a command, test, or build fails, inspect the error output, diagnose the root cause, apply fixes, and re-run automatically until successful.
- **Concise Reporting**: Report back only when significant milestones are achieved or when the task is fully accomplished with a clear, concise summary of what was done.

---

# 🚀 Protocolo Padrão de Prototipagem GLA / INEMA (Super Prompt Automático)

Sempre que o usuário enviar um Documento de Requisito (DORxxx, DRxxx, card, issue, texto ou PDF) para prototipar ou ajustar telas, execute AUTOMATICAMENTE este protocolo:

1. **Auditoria de Requisitos**: Extrair todas as RNs, formulários oficiais (`F-DUC-xxx`, `F-DIFIS-xxx`), base legal (portarias INEMA, SEI-BA) e fluxos de contraste (Deferido, Análise, Pendência, Indeferido).
2. **Navegação GLA/Filament (Botão vs Aba)**:
   - **NUNCA usar ações de criação como abas** ("Novo Projeto", "Nova Solicitação" são botões primários no canto superior direito: `#0F4C3A`).
   - **Abas (`FilamentTabs`)** servem unicamente para alternar visões gerenciais de pauta/dados (ex: *Projetos* vs *Atos e Relatórios*; *Pauta* vs *Calendário*; *Processos* vs *Análise e Decisão*).
   - A rota SEMPRE abre na **Pauta / Painel Gerencial**, nunca em formulário vazio.
   - O formulário/wizard contém barra de documento oficial e botão de retorno limpo: `← Voltar aos [Registros]`.
3. **Anti-AI-Slop Absoluto**:
   - **ZERO ROXO / PÚRPURA** (`purple`, `violet`).
   - **ZERO TEAL GENÉRICO** (`teal-600/700`) — botões primários usam estritamente o verde `#0F4C3A`.
   - **ZERO ícones decorativos antes de títulos textuais** (nada de ícone colado em h1/h2 ou títulos de cards).
   - Protocolos e números SEI em `font-mono` neutro (`text-slate-800 dark:text-slate-200`).
   - Badges do sidebar em formato sutil de texto puro (`DOR001`, `DOR002`), sem notificações vermelhas.
4. **Ciclo Autônomo de Verificação & Deploy**:
   - Build local com `npm run build` (0 erros).
   - Inspeção visual autônoma capturando screenshot Playwright e auditando com `view_file`.
   - `git commit` e `git push origin main`.
   - `npx vercel --prod --yes` e validação no link de produção (`https://inema.acto.com.br/`).

