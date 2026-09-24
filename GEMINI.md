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

---

# 🎯 Padrão Obrigatório de Entregas por Analista (Naiane, Herickles, Thays, Maria)

Trabalhamos com demandas de 4 analistas: **Naiane, Herickles, Thays e Maria**. Toda entrega deve seguir rigorosamente:

1. **Padrão Visual Institucional**: Todas as solicitações dos analistas levam **estritamente o padrão do sistema legado GLA / Filament** (`#0F4C3A`, verde institucional).
2. **Link Separado por Solicitação / Task**: Cada entrega concluída recebe um **link exclusivo e isolado no Vercel** (ex: `inema-regulacao.vercel.app`, `inema-uc.vercel.app`).
3. **Sidebar Estritamente Focada (Zero Ruído)**:
   - Na sidebar do link entregue ao analista, deve constar **SOMENTE as telas executadas naquela task específica**.
   - É terminantemente proibido exibir na sidebar telas de solicitações anteriores ou de outros analistas (a não ser que o usuário peça explicitamente). O analista precisa desse link limpo para apresentar exclusivamente o seu escopo.
4. **Link Principal Consolidado (`https://inema.acto.com.br`)**:
   - Mantemos o link principal onde a sidebar reúne **todos os módulos e telas desenvolvidos** (visão geral consolidada).
5. **Imutabilidade das Entregas Anteriores**:
   - Links já enviados para solicitações passadas continuam no ar, intocados e congelados no estado em que foram aprovados. Nenhuma nova task pode sobrescrever ou alterar a navegação dos links anteriores.

---

# 🎨 Diretriz Dual-Track: Solicitações dos Analistas vs Redesign do Inema

Temos duas trilhas de desenvolvimento e apresentação completamente distintas que NUNCA se misturam:

### 1. Trilha de Solicitações dos Analistas (Naiane, Herickles, Thays, Maria)
- **Padrão Visual**: Sistema Legado GLA / Filament (`#0F4C3A`, verde institucional, tabelas canônicas e abas contextuais).
- **Links Separados por Task**: Cada solicitação recebe um link exclusivo e isolado (ex.: `https://inema.acto.com.br/?escopo=regulacao` ou `inema-regulacao.vercel.app`).
- **Sidebar Estritamente Focada**: Exibe **SOMENTE** as telas daquela solicitação específica para apresentação limpa ao analista e gestores.
- **Link Principal Consolidado**: `https://inema.acto.com.br/` reúne todos os módulos já finalizados para visão corporativa integrada.

### 2. Trilha de Solicitações sobre o Redesign do Inema
- **Padrão Visual**: Padrão **shadcn adaptado para Filament** (estilo moderno, paleta slate/azul, dark mode, cartões refinados, métricas modernas e microinterações).
- **Link Separado e Exclusivo**: Mantido em link próprio dedicado exclusivamente a essa frente (ex.: `https://inema-lucas.vercel.app/`).
- **Sidebar do Redesign**: Focada nas telas refinadas dessa proposta de redesign (módulos de Fiscalização e Relatórios Gerenciais refinados), consistente em todas as páginas dessa versão.
- **Isolamento Total**: Alterações das solicitações dos analistas não alteram o link do redesign shadcn, e alterações de redesign não afetam as telas legadas dos analistas.

