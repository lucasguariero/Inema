# Instrução Técnica de Execução — Pacote de Ajustes SEIA V2 (Fevereiro/2026)

Este documento estabelece o roteiro detalhado, estruturado etapa por etapa, para a execução cirúrgica das 11 frentes de refinamento solicitadas pelo usuário. **Nenhuma alteração de código foi realizada nesta etapa de planejamento.**

---

## 📋 Sumário das Frentes Mapeadas

1. **Transição de Login Sem "Cara de IA"**: Remoção da barra de carregamento artificial com badges de validação e dos 3 pontinhos. Implementação de animação minimalista contínua (estilo waveform/spinner orbital branco fino) com a logo oficial do SEIA centralizada acima (-10% de tamanho).
2. **Badge / Pill 'COMUNICADO OFICIAL' (Tela Inicial)**: Ajuste de contraste para o verde institucional sólido `#0F4C3A` com tipografia nítida (eliminando a aparência apagada/lavada tanto no Light quanto no Dark Mode).
3. **Outline do Campo de Busca em Dark Mode (Dispensa ANSLA e Demais Telas)**: Correção do wrapper de input (`InputWrapper.tsx` e `TableToolbar.tsx`) para garantir contorno 100% íntegro e visível em todos os lados no Dark Mode (`border border-slate-700/80` com anel de foco verde suave).
4. **Saneamento do Header de 'Nova Emergência'**: Remoção do pill `'Nº do Registro: 2026.000073/INEMA/RE'` do cabeçalho da página `EmergenciaInternaPage.tsx`, preservando a geração do número de registro exclusivamente no fluxo oficial pós-finalização ou no bloco de identificação interna.
5. **Harmonização de Status em Dark Mode (DAE e Tabelas)**: Adequação das cores dos pills `Emitido` (âmbar com fundo escuro `dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800`), `Pago` (esmeralda `dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800`) e `Vencido` (rosa/vermelho), eliminando amarelos claros sólidos cegos no modo escuro.
6. **Remoção de Itens Internos da Sidebar e Command Palette**: Supressão imediata de `Roteiro de Apresentação`, `Design System` e `Card Sorting` de todos os menus visíveis (`seiaV2Menu.ts` e `GlobalCommandPalette.tsx`).
7. **Roteiro de Apresentação em Layout Lado a Lado (Duas Colunas)**: Reformulação dos blocos do roteiro em `RoteiroApresentacaoPage.tsx` com `grid grid-cols-1 lg:grid-cols-2`: Coluna Esquerda com checklist, tempo, o que mostrar e botão "Abrir Tela"; Coluna Direita com o roteiro falado e o argumento-chave de ouro.
8. **Isolamento e Segurança de Rotas Internas**: Garantia de que as rotas de suporte (`roteiro`, `apresentacao`, `design-system`, `card-sorting`) continuem operacionais estritamente via parâmetro de URL (`?rota=seia-v2&tela=roteiro-apresentacao`), sem exposição em menus para técnicos e gestores do Inema.
9. **Tabela de Notificações com Título e Ações Padronizadas**: Inclusão de cabeçalho descritivo com contadores no container da tabela em `NotificacoesPage.tsx` para eliminar o vazio à esquerda, e padronização dos botões de ação em cada linha e barra superior.
10. **Tabela e Ações de Acesso Público (Acompanhar Registros)**: Refatoração da tabela para os componentes canônicos do Design System (`TableContainer`/`TableToolbar`), padronização visual dos botões de ação e reinclusão do botão proeminente `Acompanhar Registros`.
11. **Refinamento do Catálogo do Design System & Scroll Suave Global**: Remoção do texto de versão `"Design System · SEIA Plataforma · v1.0"` e do input redundante da sidebar interna; adição de ícones para cada seção do menu lateral; busca focada exclusivamente no catálogo; e ativação de rolagem suave (`scroll-smooth` com microinterações) em toda a aplicação.

---

## 🛠️ Detalhamento Passo a Passo de Execução

---

### Frente 1: Transição de Login Fluida & Institucional
- **Arquivo Alvo**: `src/pages/seia-v2/SeiaV2LoginPage.tsx`
- **Problema Atual**:
  - Exibe um card translúcido com porcentagem animada ("15%", "42%", "75%", "100%"), barra de gradiente com efeito shimmer e texto com passos artificiais ("• Credenciais • Perfil • Módulos • Acesso"), conferindo visual clichê de IA.
- **Ação Técnica**:
  1. Remover o card de etapas, porcentagem e barra shimmer dos passos 15% a 100% (linhas 178 a 223).
  2. Reduzir a logo horizontal branca (`logoHorizontalWhite`) em 10% (ex: `h-16 sm:h-20 md:h-22` ao invés de `h-22 sm:h-26 md:h-30`).
  3. Adicionar logo centralizada e, imediatamente abaixo, um spinner elegante, minimalista e 100% branco baseado em SVG/CSS de ondas suaves (circular waveform spinner com opacidade suave `text-white animate-spin` ou SVG orbital com rastro suave e delay harmônico).
  4. Manter apenas um texto sutil de carregamento institucional (`Carregando ambiente seguro SEIA...`) em `text-xs font-mono text-emerald-100/80 mt-4`.

---

### Frente 2: Correção do Badge 'COMUNICADO OFICIAL'
- **Arquivo Alvo**: `src/pages/seia-v2/SeiaV2InicioPage.tsx` (linhas 280-288)
- **Problema Atual**:
  - Utiliza `<Badge color="primary" size="sm">COMUNICADO OFICIAL</Badge>`, cuja cor de fundo sutil (`--color-brand-primary-subtle`) fica muito desbotada e sem peso visual sobre o card de fundo claro.
- **Ação Técnica**:
  1. Substituir a estilização padrão do badge por uma classe de alto contraste institucional:
     ```tsx
     <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase bg-[#0F4C3A] text-white shadow-2xs">
       COMUNICADO OFICIAL
     </span>
     ```
  2. Validar o contraste no Dark Mode (`dark:bg-emerald-700 dark:text-white`) e a harmonia com o título adjacente `Portaria Conjunta INEMA nº 25.753/2022`.

---

### Frente 3: Outline dos Campos de Busca em Dark Mode
- **Arquivos Alvo**:
  - `src/components/filament/InputWrapper.tsx`
  - `src/components/filament/Table.tsx` (`TableToolbar`)
  - `src/pages/seia-v2/AnslaPage.tsx`
  - Auditoria em: `CerhPage.tsx`, `DtrpPage.tsx`, `ConsultaExternaPage.tsx`, `SeiaDaesPage.tsx`
- **Problema Atual**:
  - `InputWrapper.tsx` utiliza `ring-1 ring-inset ring-slate-300 dark:ring-slate-700`. No Tailwind v4, essa combinação com fundo de container escuro e prefixo com ícone gera falha de renderização onde apenas o lado esquerdo parece ter contorno, deixando o restante do input sem borda aparente.
- **Ação Técnica**:
  1. No `InputWrapper.tsx`, migrar de `ring-1 ring-inset` para uma borda explícita:
     ```tsx
     // Antes:
     // valid ? 'ring-slate-300 dark:ring-slate-700 focus-within:ring-2 ... bg-white dark:bg-slate-900'
     // Depois:
     valid
       ? 'border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 focus-within:border-[#0F4C3A] dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-[#0F4C3A]/20 dark:focus-within:ring-emerald-500/20'
       : ...
     ```
  2. Garantir que o `<input>` interno não possua bordas sobrepostas nem fundos que mascarem a borda direita/inferior.
  3. Auditar a visualização em tela com o Playwright nas páginas `AnslaPage`, `CerhPage` e `SeiaDaesPage` em modo escuro.

---

### Frente 4: Remoção do Pill 'Nº do Registro' do Header da Nova Emergência
- **Arquivo Alvo**: `src/pages/fiscalizacao/EmergenciaInternaPage.tsx` (linhas 261-266)
- **Problema Atual**:
  - O header principal exibe `<span>Nº do Registro: 2026.000073/INEMA/RE</span>` como um pill vermelho antes mesmo de o técnico preencher e protocolar a emergência.
- **Ação Técnica**:
  1. Remover o elemento `<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 ...">` do topo da tela.
  2. Conforme documentação GLA (DOR003 - F-DIFIS-001):
     - Na abertura em branco, a página deve exibir apenas o título institucional `Cadastro de Emergência Ambiental (Interno)` e subtítulo explicativo.
     - O número de registro oficial é gerado e consolidado exclusivamente após o clique em "Registrar Comunicado" (no modal de sucesso e no espelho do RE).
     - Como referência informativa durante o rascunho, mover o número provisório para dentro do Card 1 ("Dados do Atendimento"), em um campo somente leitura discreto intitulado `Nº Provisório Previsto`.

---

### Frente 5: Harmonização de Cores dos Pills de Status (DAE e Listagens)
- **Arquivo Alvo**: `src/pages/hibrido/SeiaDaesPage.tsx` (linhas 438-450)
- **Problema Atual**:
  - `isEmitido` usa `bg-amber-50 text-amber-700 border-amber-200` fixos, que no Dark Mode ficam com fundo amarelo claro sólido e texto escuro, sem contraste e destoando do tema.
- **Ação Técnica**:
  1. Atualizar para tokens semânticos completos de Light e Dark Mode:
     - **Emitido**: `bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800`
     - **Pago**: `bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800`
     - **Vencido**: `bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800`
  2. Auditar outras páginas onde badges de status foram aplicados com classes Tailwind estáticas sem variantes `dark:`.

---

### Frente 6: Saneamento da Sidebar & Command Palette (Remover Roteiro, Design System e Card Sorting)
- **Arquivos Alvo**:
  - `src/components/seia-v2/shadcn/seiaV2Menu.ts`
  - `src/components/seia-v2/GlobalCommandPalette.tsx`
- **Problema Atual**:
  - Itens internos de prototipagem e apresentação estão visíveis na navegação lateral do sistema.
- **Ação Técnica**:
  1. Em `seiaV2Menu.ts`:
     - Excluir o item `rel-roteiro-apresentacao` do grupo `ferramentas-gerenciais`.
     - Excluir o grupo `design-system` (linhas 240-250).
     - Garantir que nenhum item de card sorting esteja presente na árvore de menus.
  2. Em `GlobalCommandPalette.tsx`:
     - Remover os comandos rápidos `cmd-design-system` e `cmd-roteiro` da lista de sugestões de busca rápida para analistas.

---

### Frente 7: Roteiro de Apresentação em Colunas Lado a Lado
- **Arquivo Alvo**: `src/pages/seia-v2/RoteiroApresentacaoPage.tsx`
- **Problema Atual**:
  - As seções de "O que falar", "O que mostrar" e "Argumento de ouro" estão dispostas em blocos verticais empilhados, dificultando a visualização rápida durante uma videoconferência.
- **Ação Técnica**:
  1. Refatorar o container de cada item para uma grade de 2 colunas no desktop (`grid grid-cols-1 lg:grid-cols-2 gap-4`):
     - **Coluna Esquerda (Ação & Visualização)**:
       - Checkbox e título com tempo sugerido (ex: `Abertura & Posicionamento do Projeto (1:30 min)`).
       - Botão com link rápido `Abrir Tela ↗`.
       - Bloco `O que mostrar / clicar no compartilhamento`: lista com marcadores verdes dos elementos exatos da tela a serem destacados.
     - **Coluna Direita (Discurso & Argumentação)**:
       - Bloco `Como você vai falar (Direto ao ponto)`: transcrição em tom natural e confiante.
       - Bloco `Argumento-Chave`: destaque com fundo verde suave e ícone de brilho trazendo o benefício central para o Inema.
  2. Manter a barra de progresso do apresentador e o contador de itens concluídos no topo da página.

---

### Frente 8: Proteção das Rotas Internas
- **Arquivo Alvo**: `src/pages/seia-v2/SeiaV2RootPage.tsx`
- **Ação Técnica**:
  1. Manter a resolução de rotas operante no roteador do SEIA V2 para acesso direto via URL:
     - `/?rota=seia-v2&tela=roteiro` ou `tela=apresentacao` ➔ Abre o Roteiro de Apresentação.
     - `/?rota=seia-v2&tela=design-system` ➔ Abre o Design System SEIA V2.
     - `/?rota=seia-v2&tela=card-sorting` ➔ Abre o painel de Card Sorting (se requisitado).
  2. Essas telas **não aparecem** em links, sidebars, breadcrumbs ou paletas públicas do sistema.

---

### Frente 9: Estruturação da Tabela de Notificações
- **Arquivo Alvo**: `src/pages/seia-v2/NotificacoesPage.tsx`
- **Problema Atual**:
  - A barra superior da tabela possui `justify-end`, deixando um grande espaço em branco do lado esquerdo sem título. Na coluna de ações, a palavra "Ações" estava com `sr-only` e os botões tinham alinhamento tímido.
- **Ação Técnica**:
  1. No header da tabela (linha 402), estruturar layout flex entre esquerda e direita:
     - **Lado Esquerdo**: Título da seção `Painel de Notificações` e subtítulo com contagem ativa de notificações não lidas (`text-xs text-slate-500`).
     - **Lado Direito**: Botão de busca com filtro por dropdown e botão `Marcar todas como lidas`.
  2. Na coluna de ações da tabela:
     - Tornar visível o título `Ações` no cabeçalho `<th>`.
     - Padronizar os botões da linha utilizando botões estilizados (`Button` tamanho `xs` com variantes `outline` ou `ghost`), com ícones claros para `Visualizar / Abrir` e `Marcar lida`.

---

### Frente 10: Padronização da Tabela de Acesso Público & Botão "Acompanhar Registros"
- **Arquivo Alvo**: `src/pages/seia-v2/AcessoPublicoPage.tsx`
- **Problema Atual**:
  - A tabela de portarias foi feita com elementos HTML manuais em vez do componente oficial `TableContainer` e `TableToolbar`. O botão de ação por linha é um texto puro simples com seta (`Ver detalhes →`). Faltava o botão destacado `Acompanhar Registros`.
- **Ação Técnica**:
  1. Migrar a tabela para o componente padrão `TableContainer` com toolbar integrado.
  2. Substituir o link de texto da ação por um botão no padrão do Design System:
     ```tsx
     <Button
       variant="outline"
       size="xs"
       onClick={() => setSelectedConsulta(item)}
       className="h-7 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0F4C3A] dark:hover:text-emerald-400"
     >
       <Eye className="w-3.5 h-3.5 mr-1" />
       <span>Visualizar</span>
     </Button>
     ```
  3. Adicionar no topo da página ou no cabeçalho das consultas públicas o botão primário:
     ```tsx
     <Button
       variant="primary"
       onClick={() => setIsAcompanharModalOpen(true)}
       className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white h-9 px-4 font-semibold shadow-xs"
     >
       <SearchCheck className="w-4 h-4 mr-1.5" />
       <span>Acompanhar Registros</span>
     </Button>
     ```
  4. Conectar o modal de acompanhamento de protocolo (busca por número de processo e chave de segurança).

---

### Frente 11: Refinamento do Design System & Scroll Suave Global
- **Arquivos Alvo**:
  - `src/pages/seia-v2/SeiaV2DesignSystemPage.tsx`
  - `src/styles/globals.css`
- **Problema Atual**:
  - A sidebar do catálogo possui o texto redundante `"Design System · SEIA Plataforma · v1.0"` e um campo de busca que compete com o shell. Os itens da lista não possuem ícones próprios por categoria. A rolagem pode ser mais suave e fluida.
- **Ação Técnica**:
  1. Em `SeiaV2DesignSystemPage.tsx`:
     - Remover o bloco de cabeçalho com `"SEIA Plataforma · v1.0"`.
     - Remover o campo de busca da sidebar interna ou transformá-lo em busca filtrada estritamente local que navega pelos tokens do catálogo.
     - Atribuir um ícone do `lucide-react` para cada item de `catalogSections` (ex: `Palette` para Cores, `Type` para Tipografia, `Square` para Botões, `Table` para Tabelas, `Sliders` para Filtros, etc.).
  2. Em `globals.css`:
     - Adicionar rolagem suave nativa com `html { scroll-behavior: smooth; }`.
     - Definir compensação de âncora `scroll-padding-top: 5rem` para evitar que títulos fiquem ocultos sob a topbar verde ao navegar pelos atalhos.
     - Adicionar transições sutis (`transition-all duration-150 ease-out`) em hovers de tabelas, botões e cards de todo o sistema.

---

## 🔒 Checklist de Validação & Homologação

Ao receber a confirmação para início da execução, a seguinte rotina de garantia de qualidade será aplicada:
- [ ] Compilação local com `npm run build` (0 erros TypeScript / Vite).
- [ ] Captura de prints comparativos em alta resolução (1920x1080) com Playwright.
- [ ] Verificação visual do Dark Mode em todas as telas alteradas (`Dispensa ANSLA`, `DAE`, `Notificações`, `Início`).
- [ ] Confirmação de que as rotas internas não aparecem na sidebar pública do SEIA V2.
- [ ] Deploy de produção no Vercel (`https://inema.acto.com.br/`) e validação ao vivo.

---
*Aguardando sua autorização para iniciar a execução sequencial deste plano.*
