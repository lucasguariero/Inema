# Autonomous Execution & Zero-Interruption Rules

- **Total Autonomy & Auto-Approval**: Execute all tasks end-to-end without pausing for trivial questions, micro-approvals, permission dialogs, or intermediate confirmations. Whenever a task is requested, assume "Sim, sempre" for any command, file edit, or verification required to achieve the goal.
- **Proactive Implementation**: Read, create, edit files, and run commands immediately as needed to complete the task. Never ask "Can I run this?" or "Should I proceed?".
- **Engineering Judgment**: When requirements have minor ambiguity, make sensible, industry-standard engineering decisions instead of stopping to ask clarifying questions. Document choices in the final summary.
- **Autonomous Error Resolution**: When a command, test, or build fails, inspect the error output, diagnose the root cause, apply fixes, and re-run automatically until successful.
- **Unattended / Overnight Execution**: Keep tests, scripts, and validations running continuously without blocking for user feedback until all tasks are accomplished.
- **Concise Reporting**: Report back only when significant milestones are achieved ou quando a tarefa for concluída, gerando o parecer final pronto para colar no card/Mattermost.

---

# Diretrizes de Homologação & Testes — GLA Inema

- **NUNCA APAGAR DADOS DO SISTEMA**: É terminantemente proibido deletar registros existentes, cadastros de terceiros, históricos de processos ou configurações do ambiente de homologação (`https://gla-inema-hml.acto.com.br/`).
- **NUNCA APAGAR PARÂMETROS**: Parâmetros mestres e configurações do sistema nunca devem ser deletados, sob hipótese alguma.
- **CAMPOS PARAMETRIZADOS (CRIAR ANTES DE USAR)**:
  - Uma grande quantidade de campos no GLA depende de dados parametrizados (ex.: Responsável Técnico, instituições parceiras, tipos de denúncia/emergência, órgãos intervenientes, etc.).
  - Esses campos não aceitam texto livre arbitrário. Se um teste necessitar de um dado que não consta no combobox/listagem, **ele deve ser previamente cadastrado/criado no módulo de parametrização correspondente** antes de ser selecionado na tela de atendimento.
  - Certifique-se de que a parametrização existe e está ativa antes de executar o fluxo principal.

---

# Padrão Oficial de Organização de Pastas & Relatórios de QA (Acto/Inema)

Para cada card/teste a ser executado, a estrutura de pastas e arquivos DEVE ser rigorosamente padronizada:

### 📁 Estrutura de Pastas por Card (`qa/cards/[identificador-do-card]/`):
```text
qa/cards/[identificador-do-card]/
├── checklist.md             # Checklist interno com o mapeamento e validações (NÃO ANEXAR NO CARD)
├── comentario-card.txt      # Texto pronto e formatado para copiar e colar no card/Mattermost
├── anexos.zip               # Pacote zip contendo APENAS os prints necessários devidamente nomeados
└── prints/                  # Capturas de tela (ex.: "Print 01 - Visualizar bloqueado.png")
```

### 🖼️ Regra de Seleção de Prints (Evidências):
- **O checklist NÃO é anexado no card**: fica apenas arquivado internamente na pasta do teste.
- **Anexar apenas os prints estritamente necessários**: não anexar dezenas de telas triviais. Manter seleção cirúrgica (normalmente 4 a 6 prints relevantes, com contraste e comprovação clara).
- **Se o teste NÃO passar**: anexar obrigatoriamente o print do erro, demonstrando a divergência com o requisito e o comportamento incorreto da tela.
- **Nomenclatura descritiva dos prints**: Sempre no formato:
  - `Print 01 - [Descrição curta do que está sendo comprovado].png`
  - `Print 02 - [Descrição curta].png`

### 📝 Padrão do Texto (`comentario-card.txt`):
```markdown
Fala @[nome-do-dev]! Retestei o card de "[Nome da Funcionalidade / Título do Card]". Segue o resultado:

Resolvido: [Ação executada com dados concretos (valores, cadastros)] e confirmei que [comportamento observado], com a mensagem "[mensagem exata]" (Print 01). Pra contraste, testei [cenário de contraste] (Print 02).
Não resolvido: [Caso algum ponto tenha falhado, descrever exatamente o que aconteceu e o que era esperado] (Print XX).
Fora do escopo deste card: [Bugs periféricos encontrados que não impedem o fechamento do card atual].
Com isso, considero este card resolvido / [ou parecer correspondente].
Fico à disposição se precisar de mais detalhes de qualquer um desses pontos.
```

# 🎯 Padrão Obrigatório de Entregas por Analista (Naiane, Herickles, Thays, Maria)

Trabalhamos com demandas de 4 analistas principais: **Naiane, Herickles, Thays e Maria**. Toda entrega de protótipo deve seguir rigorosamente as seguintes diretrizes:

1. **Padrão Visual Institucional**: Todas as solicitações dos analistas levam **estritamente o padrão visual do sistema legado GLA / Filament** (`#0F4C3A`, verde institucional, tabelas canônicas e abas de contexto).
2. **Link Separado por Solicitação / Task**: Cada entrega concluída recebe um **link exclusivo e dedicado no Vercel** (ex: `inema-regulacao.vercel.app`, `inema-uc.vercel.app`, etc.).
3. **Sidebar Estritamente Focada (Zero Ruído)**:
   - Na sidebar do link entregue ao analista, deve constar **SOMENTE as telas executadas naquela task específica**.
   - É terminantemente proibido exibir na sidebar telas de solicitações anteriores ou de outros analistas (a não ser que o usuário peça explicitamente). O analista precisa desse link limpo para apresentar e validar exclusivamente o seu escopo.
4. **Link Principal Consolidado (`https://inema.acto.com.br`)**:
   - Mantemos o link principal onde a sidebar reúne **todos os módulos e telas já desenvolvidos**, funcionando como o portal mestre integrado da plataforma.
5. **Imutabilidade das Entregas Anteriores**:
   - Links já enviados para solicitações passadas continuam no ar, intocados e congelados no estado em que foram aprovados. Nenhuma nova task pode sobrescrever ou desconfigurar os links anteriores.

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

---

# 🚀 Padrão Oficial de Prototipagem GLA / INEMA (Super Prompt & Regras de Ouro)

Sempre que o usuário enviar um Documento de Requisito (DORxxx, DRxxx, card, issue, texto ou PDF) para criar ou refatorar protótipos de telas do INEMA/GLA, execute AUTOMATICAMENTE este protocolo de excelência de ponta a ponta:

### 1. Auditoria e Mapeamento de Requisitos (RNs e Telas)
- **Extrair todas as Regras de Negócio (RN001, RN002...)**: salvaguardas, travas de envio, cálculos, prazos/SLAs (ex: SLA 20 dias da DISUC, contagem regressiva, vigência de 12/24 meses).
- **Mapear Telas Operacionais (TL001 a TL007)**: formular a hierarquia exata de navegação e os formulários oficiais integrados (ex: `F-DUC-066`, `F-DUC-067`, `F-DUC-068`, `F-DUC-069`, `F-DUC-070`, `F-DUC-072`).
- **Base Normativa Real**: fundamentar as telas nas portarias reais do INEMA e leis ambientais (ex: Portaria INEMA nº 25.753/2022, Lei do SNUC nº 9.985/2000, integração com processos formais do SEI-BA).
- **Cenários de Contraste**: prever dados e estados de contraste realistas (Deferido/Emitido, Em Análise Técnica, Pendência/Complementação, Indeferido com prazo recursal de 10 dias).

### 2. Arquitetura de Navegação GLA / Filament (Regra de Ouro: Botão vs Aba)
- **NUNCA transformar ações de criação em ABAS**:
  - Expressões como *"Novo Projeto"*, *"Nova Solicitação"*, *"Novo Agendamento"*, *"Cadastrar Plantonista"* **NÃO SÃO ABAS**, são **AÇÕES**.
- **O que são ABAS (`FilamentTabs`)**:
  - São estritamente usadas para alternar **visões de dados ou contextos de consulta/gestão** sobre uma mesma entidade:
    - Ex: `Projetos de Pesquisa (3)` | `Atos e Relatórios` (gestão de relatórios pós-autorização e acervo de teses/artigos).
    - Ex: `Pauta de Agendamentos (1)` | `Calendário da UC` (ocupação de atrativos e prevenção de conflitos).
    - Ex: `Processos AAD (2)` | `Análise e Decisão` (parecer técnico do gestor, condicionantes e emissão).
    - Ex: `Painel de Processos (3)` | `Análise e Portaria` (minuta conclusiva e prazos).
- **O que são BOTÕES PRIMÁRIOS**:
  - O botão de ação primária (ex.: `+ Novo Projeto`, `+ Nova Solicitação`, `+ Novo Agendamento`) deve ficar no **canto superior direito do cabeçalho da página** (ou no header da tabela/filtros), estilizado com o verde oficial do INEMA (`bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white`).
- **Fluxo do Formulário / Wizard**:
  - Ao clicar no botão de criação, a aplicação exibe o formulário/wizard de preenchimento.
  - A barra de abas de listagem NÃO é exibida enquanto o usuário preenche o formulário.
  - O formulário DEVE conter um cabeçalho claro com o código do formulário oficial (ex: `DOR004`, `F-DUC-069-00`) e botão de retorno limpo: `← Voltar aos [Registros]`.
  - Ao enviar ou cancelar, retorna diretamente para a pauta/listagem com o novo registro inserido.
- **Tela Inicial Padrão**:
  - A rota SEMPRE deve abrir na **Pauta / Painel Gerencial de Processos** (visão do gestor/técnico), NUNCA jogar o usuário de cara em um formulário em branco.

### 3. Eliminação Total de AI Slop & Identidade Visual Estrita
- **PROIBIDO paletas artificiais de IA**:
  - **ZERO ROXO / PÚRPURA (`purple`, `violet`)**: O sistema GLA não tem elementos roxos.
  - **ZERO TEAL GENÉRICO (`teal-600/700`)**: Botões primários NUNCA usam teal. Devem usar exclusivamente o verde primário oficial: `#0F4C3A`.
  - **ZERO gradientes artificiais ou fundos chamativos**: Manter superfícies limpas (`bg-white dark:bg-slate-900`, `bg-slate-50 dark:bg-slate-950/40`, bordas `border-slate-200 dark:border-slate-800`).
- **PROIBIDO ícones decorativos antes de títulos textuais**:
  - Nunca colocar `<Award>`, `<BookOpen>`, `<Users>`, `<FlaskConical>` antes de títulos de cards ou cabeçalhos (h1/h2).
  - Títulos devem ser sóbrios, institucionais e em `font-bold` / `font-semibold`.
- **Badges e Tipografia Institucionais**:
  - Protocolos e números de processos (SEI-BA, AAD, AAV, Pesc) SEMPRE em fonte monoespacial (`font-mono`), com cores neutras (`text-slate-800 dark:text-slate-200`).
  - Badges semânticos de status:
    - Verde institucional para Concluído/Autorizado (`bg-emerald-50 text-emerald-700 border-emerald-200`).
    - Âmbar suave para Em Análise (`bg-amber-50 text-amber-700 border-amber-200`).
    - Azul/laranja sóbrio para Pendências/Complementação.
    - Vermelho sutil para Indeferido (`bg-rose-50 text-rose-700 border-rose-200`).
- **Sidebar & Badges de Códigos**:
  - Badges de códigos no menu lateral (`DOR001`, `DOR002`, `DOR006`...): pílula sutil de texto puro sem ícone (`text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700`).
  - NUNCA chamar atenção excessiva ou ficar vermelho/berrante ao navegar.
  - SEM pontos de notificação vermelha no sidebar.

### 4. Ciclo de Execução, Verificação Visual e Publicação Automática
Para qualquer tela criada ou editada:
1. **Build Local**: Rodar `npm run build` e garantir 0 erros de compilação TypeScript/Vite.
2. **Inspeção Visual Autônoma**: Executar script Playwright headless para capturar screenshot em alta resolução da tela e visualizá-lo com `view_file`. Auditar ativamente tipografia, ausência de AI Slop, alinhamentos e contraste.
3. **Commit Padronizado**: `git add .` dos arquivos alterados e `git commit -m "feat(...) ou refactor(...)"`.
4. **Deploy Simultâneo**:
   - `git push origin main`
   - `npx vercel --prod --yes`
5. **Verificação em Produção**: Acessar `https://inema.acto.com.br/` via script de automação, validar ao vivo e emitir o parecer final pronto para uso.

