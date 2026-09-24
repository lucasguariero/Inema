# Memória Arquitetural & Padrão de Prototipagem GLA (INEMA)

Este arquivo consolida as decisões arquiteturais estáveis, regras visuais invioláveis, o protocolo de entrega por analista e o padrão de comunicação para criação e refinamento de protótipos na codebase do INEMA.

---

## 1. Diretriz Dual-Track (Trilha Analistas vs Trilha Redesign)

Temos duas frentes de trabalho com propósitos, linguagens visuais e links estritamente isolados:

### Trilha 1 — Solicitações dos Analistas (Naiane, Herickles, Thays, Maria)
- **Padrão Visual**: Sistema Legado GLA / Filament (`#0F4C3A`, verde institucional, tabelas canônicas e abas contextuais).
- **Link Isolado por Solicitação**: Cada entrega concluída recebe um link exclusivo e isolado (ex.: `https://inema.acto.com.br/?escopo=regulacao` ou `inema-regulacao.vercel.app`).
- **Sidebar Estritamente Focada (Zero Ruído)**:
  - No link entregue ao analista, a barra lateral deve conter **SOMENTE as telas executadas naquela task específica**.
  - Ocultar qualquer tela de tarefas anteriores ou de outros analistas. O analista precisa desse link limpo para validar e apresentar exclusivamente o seu escopo.
- **Portal Master Consolidado (`https://inema.acto.com.br/`)**:
  - Reúne todos os módulos e telas finalizados, funcionando como portal corporativo integrado.
- **Imutabilidade das Entregas Anteriores**:
  - Links passados permanecem intocados e congelados no estado em que foram aprovados.

### Trilha 2 — Solicitações sobre o Redesign do Inema
- **Padrão Visual**: Padrão **shadcn adaptado para Filament** (estilo moderno, paleta slate/azul, dark mode nativo, cartões refinados, métricas modernas e microinterações).
- **Link Separado e Exclusivo**: Mantido em link próprio dedicado a essa proposta: `https://inema-lucas.vercel.app/`.
- **Sidebar do Redesign**: Focada nas telas refinadas dessa versão (módulos de Fiscalização e Relatórios Gerenciais refinados), mantendo os mesmos links em todas as páginas dessa proposta.
- **Isolamento Absoluto**: Mudanças da Trilha 1 não alteram o link do redesign shadcn, e alterações de redesign não afetam as telas legadas dos analistas.

---

## 2. Identidade Visual Inviolável (Anti-AI-Slop)

- **Cor Primária Institucional**: `#0F4C3A` (hover: `#0c3d2e`, active: `#092e23`). Usada em botões primários de ação, indicador ativo de abas e bordas semânticas.
- **Cores Estritamente Proibidas**:
  - `purple-*` / `violet-*` (Roxo / Púrpura): terminantemente proibido.
  - `teal-500/600/700` genérico: botões primários NUNCA usam teal.
  - Gradientes berrantes ou fundos artificiais.
- **Tipografia e Ícones**:
  - **Títulos Limpos**: Nunca colocar ícones decorativos antes de títulos textuais (h1/h2) ou títulos de cards.
  - **Identificadores Governamentais**: Protocolos SEI-BA, códigos de processos (AAD, AAV, Pesc, LIC, CERH) e datas de SLA sempre em fonte monoespacial (`font-mono`) com contraste neutro (`text-slate-800 dark:text-slate-200`).
  - **Privacidade Cadastral**: Nunca expor CPF ou CNPJ público em interfaces abertas; manter identificadores anonimizados ou corporativos.
  - **Badges Semânticos**:
    - Concluído / Deferido: `bg-emerald-50 text-emerald-700 border-emerald-200`
    - Em Análise / Em Trâmite: `bg-amber-50 text-amber-700 border-amber-200`
    - Pendências / Notificado: `bg-orange-50 text-orange-700 border-orange-200`
    - Indeferido / Cancelado: `bg-rose-50 text-rose-700 border-rose-200`
  - **Badges de Requisitos no Menu Lateral** (`DOR001`, `DOR002`, `DOR006`, etc.):
    - Pílula sutil de texto puro (`text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700`).
    - Sem destaque vermelho e sem bolinhas chamativas de notificação.

---

## 3. Arquitetura de Navegação GLA / Filament (Regra de Ouro: Botão vs Aba)

- **Ações de Criação NÃO são Abas**:
  - Expressões como *"Novo Projeto"*, *"Nova Solicitação"*, *"Novo Agendamento"*, *"Cadastrar Plantonista"* **NÃO SÃO ABAS**, são **AÇÕES**.
  - Devem ser implementadas como **BOTÕES PRIMÁRIOS** (`#0F4C3A`) posicionados no canto superior direito do cabeçalho da página ou acima da listagem de dados.
- **O que são Abas (`FilamentTabs`)**:
  - Reservadas exclusivamente para alternar **visões de dados ou contextos de consulta/gestão** sobre a mesma entidade (ex: *Projetos de Pesquisa* vs *Atos e Relatórios*; *Pauta de Agendamentos* vs *Calendário da UC*; *Tramitações no período* vs *Acompanhamento da pauta*).
- **Entrada Padrão de Rota**:
  - Toda página de módulo administrativo SEMPRE abre na **Pauta / Painel Gerencial de Processos** (visão do gestor), NUNCA jogando o usuário diretamente em um formulário em branco.
- **Fluxo de Preenchimento (Wizard / Formulário)**:
  - Acionado pelo botão primário.
  - As abas de listagem não são exibidas na visualização de formulário.
  - O formulário tem cabeçalho claro com código oficial (ex: `F-DUC-069-00`, `DOR004`) e botão: `← Voltar aos [Registros]`.

---

## 4. Arquitetura de Detalhamento Compartilhada em 2 Níveis

Toda consulta/tabela de processos do sistema segue a estrutura de aprofundamento:
- **Nível 1 (Painel Lateral / Drawer de Resumo Rápido)**:
  - Abre ao clicar em `Detalhar` em qualquer registro da tabela.
  - Contextual para a visualização ativa (mostra dados essenciais, situação atual e equipe técnica sem inventar campos vazios).
  - CTA primário: `Ver detalhes completos` (`#0F4C3A`) que direciona ao Nível 2.
- **Nível 2 (Modal Canônico em 7 Blocos)**:
  1. Identificação do Processo (sem CPF/CNPJ desnecessário);
  2. Registro Selecionado / Manifestação;
  3. Situação Atual do Processo (dias sem movimentação, unidade, equipe);
  4. Atos Vinculados (com status individualizado de cada ato);
  5. Histórico de Tramitação;
  6. Histórico de Comunicação (notificações apartadas do trâmite físico);
  7. Tempos e Prazos (espécie normativa formal, tempo em análise, tempos concorrentes).

---

## 5. Diretrizes de Comunicação e Discurso de Produto (Apresentações e Reuniões)

Ao redigir roteiros, atas, apresentações ou comentários para stakeholders:
- **Respeito ao Sistema Existente**: Nunca criticar o sistema anterior ("tava ruim", "não dava pra achar nada").
  - Padrão de fala: *"O sistema já operava na arquitetura Filament. O que realizamos foi uma evolução substancial de design de componentes, ergonomia visual e usabilidade."*
- **Pontos Fortes a Enfatizar**:
  - Manutenção da familiaridade do usuário com modernização dos componentes;
  - Introdução de breadcrumbs contextuais e consistência de alinhamentos;
  - Busca dinâmica de filtros no menu lateral para ganho de agilidade;
  - Portas de entrada organizadas em blocos funcionais sólidos para clareza cognitiva.
- **Alinhamento com Propostas Externas (Figma / Terceiros)**:
  - Nunca assumir que o Figma externo já considerava o Filament.
  - Padrão de alinhamento: *"Identificamos grande convergência funcional no material proposto. Nosso objetivo é absorver as melhores ideias práticas e refiná-las tecnicamente dentro dos padrões Filament do INEMA."*

---

## 6. Padrão Oficial de Entregas e Pacote de QA (Acto/Inema)

Para cada solicitação/card finalizado, manter a estrutura em `qa/cards/[identificador-do-card]/`:
- `checklist.md`: Auditoria interna de todos os requisitos (permanece arquivado, não vai no card).
- `comentario-card.txt`: Texto pronto no formato padrão para colar no card/chat do analista:
  - Resolvido (com dados concretos e prints de evidência);
  - Não resolvido (ou confirmação de 0 pendências);
  - Fora do escopo do card (portal consolidado mantido em paralelo);
  - Parecer final e disponibilidade.
- `anexos.zip`: Pacote com 4 a 6 capturas de tela cirúrgicas em alta resolução com nomes descritivos (`Print 01 - ...`).
- `prints/`: Pasta com as capturas originais geradas pelo Playwright.

---

## 7. Super Prompt Automático de Ciclo de Vida (Execução Contínua)

Ao receber qualquer documento de requisito (DOR, DR, card, issue, texto ou PDF):
1. **Auditoria de RNs e Telas**: Extrair regras de negócio, formulários oficiais (`F-DUC-xxx`, `F-DIFIS-xxx`), base legal (portarias do INEMA, SEI-BA) e casos de contraste.
2. **Definição da Trilha**:
   - Se for demanda de analista (Naiane, Herickles, Thays, Maria) ➔ Padrão GLA Legado / Filament (`#0F4C3A`) + link com escopo exclusivo na sidebar.
   - Se for demanda de Redesign do Inema ➔ Padrão shadcn/filament moderno + link `inema-lucas`.
3. **Estruturação de Telas**: Pauta inicial + Abas Filament + Botão primário de novo registro.
4. **Build Local**: `npm run build` (0 erros).
5. **Inspeção Visual Autônoma**: Executar Playwright headless para capturar screenshots e auditar visualmente com `view_file`.
6. **Versionamento e Deploy**: `git commit` + `git push origin main` + `npx vercel --prod --yes`.
7. **Emissão do Relatório**: Gerar `checklist.md`, `anexos.zip`, `comentario-card.txt` e apresentar link direto testado ao usuário.

---

## 8. Protocolo de Validação em Duas Etapas & Handover para Auditoria GPT

Ao finalizar qualquer entrega ou protótipo, o agente deve obrigatoriamente rodar a etapa de auditoria visual em alta resolução e estruturar a entrega nos 3 pilares fundamentais para validação humana e revisão externa pelo GPT do usuário:

### 1. Captura em Alta Resolução (1920x1080px)
- Acessar o link exclusivo da entrega (ex.: `?analista=...`) na resolução de tela do analista: **1920x1080px (Full HD nativo)**.
- Capturar prints abrangentes cobrindo:
  - Todas as abas e sub-visões de dados;
  - Todas as gavetas laterais (Drawers Nível 1) abertas em seus devidos contextos;
  - Todos os modais abertos (Sobre os dados, Filtros avançados, Detalhamentos completos Nível 2 em todos os blocos rolados);
  - Tabelas evidenciando casos de contraste canônicos.
- Empacotar todas as capturas em `qa/cards/[id-do-card]/anexos-1080p-auditoria-gpt.zip`.

### 2. Os 3 Pilares Obrigatórios da Resposta de Entrega
Toda entrega de protótipo deve fornecer no relatório:
1. **Pilar 1 — Explicação da Execução Técnica**: O que exatamente foi codificado, decisões de arquitetura de dados adotadas, componentes criados/ajustados e regras de negócio implementadas.
2. **Pilar 2 — Explicação Detalhada dos Prints**: Mapeamento 1-a-1 de cada print capturado associado ao requisito exato do documento original (DOR, Guia UX ou Card) que ele comprova visualmente.
3. **Pilar 3 — Declaração Explícita de "O que falta ainda" (Gaps / Limitações / Próximos Passos)**: No entendimento do agente, declarar com total transparência o que não foi implementado, o que depende de backend real (SEIA/PostgreSQL), o que está mockado e eventuais regras secundárias pendentes, permitindo ao GPT auditor do usuário validar se os requisitos foram compreendidos e executados corretamente.
