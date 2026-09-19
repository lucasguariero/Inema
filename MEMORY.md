# Memória Arquitetural & Padrão de Prototipagem GLA (INEMA)

Este arquivo consolida as decisões arquiteturais estáveis, regras visuais invioláveis e o protocolo de execução padrão para criação e refinamento de protótipos na codebase do INEMA.

---

## 1. Identidade Visual Inviolável (Anti-AI-Slop)

- **Cor Primária**: `#0F4C3A` (hover: `#0c3d2e`, active: `#092e23`). É a cor de marca institucional do INEMA. Usada em botões primários de ação, indicador ativo de abas e bordas de seleção ativa.
- **Cores Estritamente Proibidas**:
  - `purple-*` / `violet-*` (Roxo / Púrpura): terminantemente proibido.
  - `teal-500/600/700` genérico: botões primários NUNCA usam teal.
  - Gradientes berrantes ou fundos chamativos artificiais.
- **Tipografia e Ícones**:
  - **Títulos Limpos**: Nunca usar ícones decorativos antes de títulos de cards ou títulos textuais (h1/h2).
  - **Identificadores Governamentais**: Protocolos SEI-BA, códigos AAD, AAV, Pesc e datas de SLA sempre em fonte monoespacial (`font-mono`) com contraste neutro (`text-slate-800 dark:text-slate-200`).
  - **Status Sóbrios**:
    - Concluído / Autorizado / Deferido: `bg-emerald-50 text-emerald-700 border-emerald-200`
    - Em Análise: `bg-amber-50 text-amber-700 border-amber-200`
    - Pendências / Complementação: `bg-orange-50 text-orange-700 border-orange-200`
    - Indeferido: `bg-rose-50 text-rose-700 border-rose-200`

---

## 2. Arquitetura de Navegação GLA / Filament (Botão vs Aba)

- **Ações de Criação NÃO são Abas**:
  - "Novo Projeto", "Nova Solicitação", "Novo Agendamento", "Cadastrar Plantonista" são **AÇÕES** e devem ser **BOTÕES PRIMÁRIOS** (`#0F4C3A`) posicionados no topo direito da página ou acima da tabela.
- **Abas (`FilamentTabs`)**:
  - Reservadas exclusivamente para alternar visões de pauta, consulta e pós-autorização (ex: *Projetos de Pesquisa* vs *Atos e Relatórios*; *Pauta de Agendamentos* vs *Calendário da UC*; *Processos AAD* vs *Análise e Decisão*).
- **Entrada Padrão de Rota**:
  - Toda página de módulo administrativo SEMPRE abre na **Pauta / Painel Gerencial de Processos** (visão do gestor), nunca em um formulário em branco.
- **Fluxo de Preenchimento (Wizard/Formulário)**:
  - Acionado pelo botão primário.
  - As abas de listagem não são exibidas na visualização do formulário.
  - O formulário tem cabeçalho próprio com código oficial (ex: `F-DUC-069-00`, `DOR004`) e botão: `← Voltar aos [Registros]`.

---

## 3. Sidebar e Menu Lateral

- Badges de códigos de requisitos (`DOR001`, `DOR002`, `DOR006`, etc.):
  - Pílula sutil de texto puro sem ícone (`text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700`).
  - Sem destaque vermelho e sem bolinhas de notificação.

---

## 4. Super Prompt Automático ao Receber Requisitos (DOR / Cards)

Ao receber um documento de requisito do INEMA, executar automaticamente:
1. Extrair RNs, formulários oficiais, portarias de embasamento e fluxo de decisão (deferido, pendente, indeferido).
2. Estruturar a navegação com Pauta + Abas de contexto + Botão primário de novo registro.
3. Aplicar estilo Filament GLA sem AI Slop (zero roxo, zero teal, zero ícones em títulos).
4. Compilar `npm run build` (0 erros).
5. Capturar screenshots headless via Playwright e validar com `view_file`.
6. `git commit` + `git push origin main`.
7. `npx vercel --prod --yes` e teste no link oficial: `https://inema.acto.com.br/`.
