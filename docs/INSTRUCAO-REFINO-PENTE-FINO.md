# 🦅 INSTRUÇÃO OPERACIONAL PENTE-FINO & PIXEL-PERFECT (SEIA V2)

> **Documento de Execução Técnica**: Este arquivo serve como diretriz viva e guia de checagem obrigatório para o refino final de todas as telas do **SEIA V2**. Nenhuma alteração pode violar os parâmetros aqui mapeados.
> **Ambiente Oficial Alvo**: `https://inema.acto.com.br/?rota=seia-v2`  
> **Catálogo Canônico do Design System**: `https://inema.acto.com.br/?rota=seia-v2&tela=design-system`

---

## 1. Princípios Invioláveis de Consistência Visual (Pixel-Perfect)

### 1.1. Geometria, Raios e Contornos (`border-radius` e `border`)
- **Cards e Seções**: Estritamente `rounded-xl` (12px). É **terminantemente proibido** usar `rounded-2xl` (16px) ou `rounded-3xl` em telas operacionais e cabeçalhos Hero.
- **Botões e Campos de Entrada (Inputs/Selects)**: Estritamente `rounded-lg` (8px).
- **Badges e Tags**: Estritamente `rounded-md` (6px) ou `rounded-full` apenas quando for status com `dot`.
- **Bordas Semânticas**: 
  - Light mode: `border-[var(--color-border-default)]` (equivalente ao sutil `border-slate-200/80` ou `ring-1 ring-slate-950/5`).
  - Dark mode: `dark:border-[var(--color-border-subtle)]` (`dark:border-slate-800` ou `dark:ring-white/10`).
  - Proibido misturar `border-slate-200/90`, `border-slate-300` e bordas grossas arbitrárias.

### 1.2. Superfícies e Backgrounds de Cabeçalho (Cards & Sections)
- **Cabeçalhos de Cards (`CardHeader` / `Section`)**: 
  - Todo cabeçalho de seção ou card deve adotar o background sutil institucional: `bg-slate-50/50 dark:bg-slate-800/30` com borda divisória inferior `border-b border-slate-100 dark:border-slate-800/80`.
  - Padding de cabeçalho padronizado: `px-5 py-3.5` (compacto) ou `px-6 py-4` (padrão).
- **Corpo dos Cards (`CardContent`)**: `bg-white dark:bg-slate-900` com padding interno `p-5` ou `p-6`.
- **Fundo Canônico da Tela**: `bg-[var(--color-surface-canvas)]` (`bg-slate-50/60 dark:bg-slate-950`).

### 1.3. Tipografia & Hierarquia de Fontes
- **Família Tipográfica**: `Inter, sans-serif` para interface geral e `font-mono tabular-nums` para processos, protocolos SEI, datas e valores quantitativos.
- **Escala Modular Rigorosa**:
  - **H1 de Página**: `text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100` (proibido usar `text-3xl` em dashboards para não quebrar a densidade).
  - **Subtítulo de Apoio**: `text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-normal`.
  - **H3 de Card / Seção**: `text-sm sm:text-base font-semibold text-slate-950 dark:text-white leading-6`.
  - **Rótulos de Métrica (KPI)**: `text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`.
  - **Valor Numérico Principal**: `text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums`.

### 1.4. Paleta Oficial & Eliminação Total de AI-Slop (Anti-Fantasia)
- **Verde Primário Oficial**: `#0F4C3A` (hover `#0c3d2e`, active `#092f24`).
- **PROIBIDO ROXO / PURPLE / VIOLET**: Zero elementos roxos em todo o SEIA V2.
- **PROIBIDO TEAL GENÉRICO**: Botões primários usam estritamente `#0F4C3A`.
- **PROIBIDO Pills e Tags Decorativas em Títulos**:
  - Nunca colocar pílulas de contagem flutuantes abaixo do título H1 (ex: "31 notificações totais").
  - Nunca inventar caixas de aviso berrantes ("COMUNICADO OFICIAL") coladas no título de comunicados.
  - Nunca adicionar caixas numeradas azuis isoladas (ex: badge quadrado com número "1") antes do título do card.
  - Títulos devem ser limpos, sóbrios e institucionais.
- **PROIBIDO Ícones Decorativos em Títulos de Cards**:
  - Títulos de cards e seções não devem vir antecedidos de ícones soltos colados no texto. Ícones ficam contidos no botão de ação ou alinhados à direita no header.

---

## 2. Pente-Fino Tela a Tela & Mapeamento de Correções

### 2.1. Tela Inicial (`SeiaV2InicioPage.tsx`)
- [ ] **Hero Header**:
  - Trocar `rounded-2xl` por `rounded-xl`.
  - Reduzir título de `text-2xl sm:text-3xl` para `text-xl sm:text-2xl font-bold`.
  - Remover completamente o bloco de pills arbitrárias: `31 notificações totais` e `13 mensagens não lidas` (esse feedback já reside na topbar e sidebar).
  - Normalizar padding de `p-6 sm:p-7 lg:p-8` para `p-6`.
- [ ] **Grid de 6 Métricas / Status**:
  - Remover as caixinhas quadradas coloridas genéricas (`bg-sky-50`, `bg-rose-50`, `bg-amber-50`).
  - Padronizar cada item com a estrutura oficial do `KpiCard`: título em caixa alta discreto (`text-[11px] font-semibold tracking-wider text-slate-500 uppercase`), valor grande em `font-mono tabular-nums`, badge semântico com dot e micro-sparkline ou barra discreta.
  - Alinhar responsividade para evitar quebras de texto feias em resoluções 1366x768 e 1440x900.
- [ ] **Card Comunicado Oficial (Requerimento Único)**:
  - Trocar `rounded-2xl` por `rounded-xl`.
  - Remover a tag verde berrante em caixa alta `COMUNICADO OFICIAL`.
  - Aplicar o cabeçalho oficial com `bg-slate-50/50 dark:bg-slate-800/30` e exibir apenas a referência normativa: *"Portaria Conjunta INEMA nº 25.753/2022"*.
  - Garantir que os 6 blocos de atos integrados utilizem `rounded-lg` e bordas semânticas sutis.
- [ ] **Grid de Acesso Rápido**:
  - Remover as tags arbitrárias flutuantes (`Cadastros`, `Unidades`, `Hídrico`, `Resíduos`, `Florestal`).
  - Manter o card sóbrio e direto: Ícone oficial institucional, Título em `text-sm font-bold` e Descrição em `text-xs text-slate-500`.

---

### 2.2. Roteamento & Redirecionamentos Incorretos (`SeiaV2RootPage.tsx` e `seiaV2Menu.ts`)
- [ ] **Minhas Emergências (`tela=minhas-emergencias`)**:
  - **Problema atual**: Redireciona para `ConsultaInternaPage` com título *"Consulta de Denúncias Ambientais"*.
  - **Ação**: Passar propriedade `tipoPadrao="EMERGENCIA"` para `ConsultaInternaPage` ou abrir com o filtro de emergência ativado e título ajustado para *"Consulta de Emergências Ambientais"*.
- [ ] **Minhas Análises (`tela=minhas-analises`)**:
  - **Problema atual**: Abre a consulta geral de denúncias.
  - **Ação**: Renderizar a pauta de análises do técnico fiscal com abas contextuais *"Aguardando Parecer"* e *"Vistorias Agendadas"*.
- [ ] **Associar Técnico (`tela=associar-tecnico`)**:
  - **Problema atual**: Abre consulta de denúncias sem ação direta.
  - **Ação**: Abrir a gaveta ou tela com a lista de denúncias pendentes de distribuição e modal de vinculação do técnico.
- [ ] **Relatórios Financeiros (`tela=financeiro-relatorios`)**:
  - **Problema atual**: Redireciona para o `DashboardPage` geral de processos e regulação.
  - **Ação**: Renderizar a tela de relatórios financeiros / arrecadação DAE (`SeiaDaesPage` ou módulo financeiro com KPIs de receita arrecadada, parcelamentos e certidões).
- [ ] **Cadastros Básicos (Sub-rotas do Menu)**:
  - `tela=cad-responsavel`: Deve abrir diretamente com `activeTab="rt"`.
  - `tela=cad-representante`: Deve abrir diretamente com `activeTab="representantes"`.
  - `tela=cad-empreendimentos`: Deve abrir diretamente com `activeTab="empreendimentos"`.
  - `tela=cad-cefir`: Deve abrir diretamente com `activeTab="propriedades"`.
  - `tela=cad-procurador`: Deve abrir diretamente com `activeTab="procuradores"`.
  - `tela=cad-representacoes`: Deve abrir diretamente com `activeTab="consultorias"`.
- [ ] **Pauta da Área vs Pauta Técnica (`PautaEnquadramentoPage`)**:
  - `tela=pauta-area`: Abrir na aba `todos` (Pauta da Área).
  - `tela=enquadramento-tecnica`: Abrir na aba `em-analise` (Pauta Técnica).

---

### 2.3. Pauta de Processos & Tabela Operacional (`SeiaV2TabelaOperacionalPage.tsx`)
- [ ] **Substituição de Componentes Não Padronizados**:
  - Localizar instâncias de `CustomSelect` e substituir por `FilamentSelect` oficial do Design System.
- [ ] **Tabela & Toolbar**:
  - Garantir que a toolbar utilize `h-9` com botão de filtros exibindo contagem ativa.
  - Coluna de Processo / SEI: Estritamente em `font-mono font-semibold text-slate-900 dark:text-slate-100`.
  - Coluna de Status: Badges com `dot` nas cores semânticas (`success` para deferido, `warning` para pendente, `info` para análise, `danger` para indeferido).
  - Rodapé de paginação: Compacto, integrado com seletor de linhas (10, 25, 50).

---

### 2.4. Módulo de Fiscalização (`DenunciaInternaPage.tsx` e `EmergenciaInternaPage.tsx`)
- [ ] **Limpeza de Decorações**:
  - Remover as caixinhas quadradas azuis com números (`<span className="w-7 h-7 bg-blue-100...">1</span>`) antes de *"Detalhes do Registro"*.
  - Remover o badge flutuante `Nº Previsto: 2026.XXXXXX/INEMA/RD` colado no header do card.
  - Alinhar todos os cards para o padrão `Section` ou `Card` com `CardHeader` sem enfeites.
- [ ] **Inputs & Coordenadas**:
  - Ajustar campos de latitude/longitude e complementos para `h-9 rounded-lg` com anel de foco `focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]`.
  - Botão de envio primário no rodapé: `bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold h-10 px-6 rounded-lg`.

---

### 2.5. Relatórios Gerenciais & BI (`DashboardPage.tsx`)
- [ ] **Cards de Gráficos**:
  - Envelopar os 6 gráficos (`EntradaSaidaChart`, `StatusDonutChart`, `UnidadeBarChart`, `AgingBarChart`, `TempoAnaliseChart`, `VencidosBarChart`) em `Card` estruturado com `CardHeader` e `CardTitle` padrão (títulos em `text-sm sm:text-base font-semibold`).
  - Eliminar variações de padding: usar `p-5` uniforme em todos os cards de gráficos.
- [ ] **Tabela de Processos Vencidos**:
  - Padronizar o cabeçalho com `px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30`.
  - Garantir que dias vencidos utilizem badge semântico `danger` com `font-mono`.

---

## 3. Matriz Completa de Roteamento & Correções de Divergência

| Menu Lateral (Item Clicado) | Rota Solicitada (`tela=...`) | Componente Alvo | Ação Exata de Correção |
| :--- | :--- | :--- | :--- |
| **Fiscalização > Minhas Emergências** | `minhas-emergencias` | `ConsultaInternaPage` | Passar prop/estado forçando tipo `EMERGENCIA` e título *"Consulta de Emergências Ambientais"* |
| **Fiscalização > Minhas Análises** | `minhas-analises` | `ConsultaInternaPage` | Passar filtro de pauta do fiscal logado (`status=em-analise`) e título contextual *"Minhas Análises de Fiscalização"* |
| **Fiscalização > Associar Técnico** | `associar-tecnico` | `ConsultaInternaPage` | Abrir com filtro de pendência de distribuição e acionar gaveta/modal de vínculo de fiscal |
| **Regulação > Pauta da Área** | `pauta-area` | `PautaEnquadramentoPage` | Abrir forçando `activeTab="todos"` (Pauta da Área) |
| **Regulação > Pauta Técnica** | `enquadramento-tecnica` | `PautaEnquadramentoPage` | Abrir forçando `activeTab="em-analise"` (Pauta Técnica) |
| **Serviços > Dispensa de Licença** | `ansla-dispensa` | `AnslaPage` | Abrir forçando a aba ou modal de declaração de dispensa |
| **Gestão > Relatórios Financeiros** | `financeiro-relatorios` | `SeiaDaesPage` / Módulo DAE | Renderizar módulo de arrecadação financeira, DAEs e CND em vez do BI geral de processos |
| **Cadastros > Responsáveis Técnicos** | `cad-responsavel` | `CadastrosBasicosPage` | Abrir forçando `activeTab="rt"` |
| **Cadastros > Representantes Legais** | `cad-representante` | `CadastrosBasicosPage` | Abrir forçando `activeTab="representantes"` |
| **Cadastros > Empreendimentos** | `cad-empreendimentos` | `CadastrosBasicosPage` | Abrir forçando `activeTab="empreendimentos"` |
| **Cadastros > Propriedades Rurais (CEFIR)** | `cad-cefir` | `CadastrosBasicosPage` | Abrir forçando `activeTab="propriedades"` |
| **Cadastros > Procuradores** | `cad-procurador` | `CadastrosBasicosPage` | Abrir forçando `activeTab="procuradores"` |
| **Cadastros > Consultorias** | `cad-representacoes` | `CadastrosBasicosPage` | Abrir forçando `activeTab="consultorias"` |

---

## 4. Matriz Comparativa: SEIA V2 vs. Sistema Legado GLA (`gla-inema-hml.acto.com.br`)

| Módulo / Tela SEIA V2 | Tela Equivalente no Legado GLA | Regras de Negócio e Campos Canônicos a Preservar |
| :--- | :--- | :--- |
| **Início / Home** | Painel Principal SEIA | Apresentar visão executiva limpa, sem cards ilustrativos coloridos com ícones genéricos |
| **Fiscalização (Denúncia Interna)** | Atendimento > Denúncia (`DOR001`) | Preservar estrutura formal: Dados Gerais, Ocorrência, Localização (com complementos obrigatórios RN009) e Denunciante |
| **Fiscalização (Emergência Interna)** | Atendimento > Emergência (`DOR002`) | Distinção explícita entre denúncia e emergência em todas as listagens e formulários |
| **Regulação (Pauta de Processos)** | Processos > Pauta do Técnico | Colunas oficiais: Nº Processo (SEI), Interessado, Empreendimento, Tipologia, Município, Dias em Análise e Status semântico |
| **Recursos Hídricos (CERH)** | Regulação > Outorga e CERH | Foco na Bacia Hidrográfica (RPGA), Ponto de Captação e Vazão outorgada em m³/h com stepper oficial |
| **Cadastros Básicos** | Cadastro Único > Pessoas e Empreendimentos | Unificação via `FilamentTabs`, garantindo abertura instantânea na aba exata do item clicado |

---

## 5. Checklist de Auditoria Visual & Funcional Durante a Execução

Ao editar qualquer arquivo, verificar item por item:

| Critério | Verificação Obrigatória | Status |
| :--- | :--- | :---: |
| **Header do Card** | Possui `bg-slate-50/50 dark:bg-slate-800/30` e borda inferior sutil? | [ ] |
| **Arredondamento** | É estritamente `rounded-xl` nos blocos e `rounded-lg` nos controles? | [ ] |
| **Zero Pills em Títulos**| O título H1/H2 está sem badges, contadores ou pills coladas? | [ ] |
| **Zero Cores Artificiais**| Não contém roxo (`purple`), violeta ou teal nos botões? | [ ] |
| **Tipografia de Dados** | Códigos, processos e números estão com `font-mono tabular-nums`? | [ ] |
| **Dark Mode** | O contraste de texto e divisores permanece visível e confortável? | [ ] |
| **Roteamento Exato** | O item do menu abre exatamente a tela e a aba descritas no label? | [ ] |
| **Build & Tipagem** | O comando `npm run build` passa com 0 erros de compilação? | [ ] |

---

## 4. Ordem Sequencial de Execução

1. **Passo 1**: Normalização do Roteamento e Sub-rotas em `src/pages/seia-v2/SeiaV2RootPage.tsx` e `src/components/seia-v2/shadcn/seiaV2Menu.ts`.
2. **Passo 2**: Faxina anti-slop e alinhamento de tokens em `src/pages/seia-v2/SeiaV2InicioPage.tsx`.
3. **Passo 3**: Padronização dos cards e formulários em `src/pages/fiscalizacao/DenunciaInternaPage.tsx` e `src/pages/fiscalizacao/EmergenciaInternaPage.tsx`.
4. **Passo 4**: Ajuste de abas pré-selecionadas em `src/pages/seia-v2/CadastrosBasicosPage.tsx` e `src/pages/seia-v2/PautaEnquadramentoPage.tsx`.
5. **Passo 5**: Uniformização dos cards de gráficos e tabelas em `src/pages/DashboardPage.tsx` e `src/components/seia-v2/SeiaV2TabelaOperacionalPage.tsx`.
6. **Passo 6**: Verificação de compilação (`npm run build`) e validação visual de ponta a ponta.
