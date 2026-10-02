# 🎯 Roteiro de Apresentação — SEIA V2 para Tales (UX Inema)

> **Público-Alvo:** Tales (UX Designer do Inema)  
> **Contexto do Tales:** Está conduzindo a inspeção heurística e mapeamento de fluxos/telas no sistema legado do Inema.  
> **Objetivo da Reunião:** Apresentar a arquitetura de UX, o Design System e os arquétipos do SEIA V2 como a **plataforma modular pronta** para receber e implementar as telas que ele revisar no legado.  
> **Diretriz de Ouro:** **ZERO "tela a tela"**. O foco é arquitetura, consistência, resolução das dores do legado e parceria de produto.  
> **Ambiente Oficial de Demonstração:** [https://inema.acto.com.br/?rota=seia-v2](https://inema.acto.com.br/?rota=seia-v2)  
> **Duração Estimada:** 10 a 12 minutos (+ espaço para debate e alinhamento).

---

## 📌 Visão Geral da Apresentação (Os 4 Blocos)

| Bloco | Tema | Foco de UX | Tempo Sugerido |
| :---: | :--- | :--- | :---: |
| **01** | **Abertura & Conexão Estratégica** | Valorização da inspeção do legado e proposta de parceria de produto | ~1:30 min |
| **02** | **Design System Vivo & Fundações** | Tokens semânticos, densidade compacta (36px), grid de 8pt, WCAG e Dark Mode | ~3:30 min |
| **03** | **Os 3 Arquétipos de Interação** | Pautas/Tabelas com Drawers, Formulários em Stepper SVG e Dashboards Sóbrios | ~4:30 min |
| **04** | **Handover & Próximos Passos** | Fluxo contínuo: do wireframe/revisão do Tales para a implementação direta no SEIA V2 | ~2:00 min |

---

## 🎙️ Bloco 1: Abertura & Conexão com a Inspeção do Legado
*(Sem compartilhar tela nos primeiros 30 segundos — aprox. 1:30 min)*

### 🗣️ O que falar:
> *"Fala Tales! Tudo bem?*
> 
> *Cara, eu sei que você está bem focado aí na inspeção das telas e dos fluxos do Inema legado — que é um trabalho fundamental pra gente mapear as fricções cognitivas, os campos reais e a lógica de trabalho dos analistas.*
> 
> *Pra nossa conversa de hoje, eu não vou te cansar passando tela a tela de um sistema inteiro. Como você é de UX, eu quero te mostrar **a infraestrutura e a arquitetura de interface** que nós construímos aqui no SEIA V2:*
> 
> *Montamos um Design System vivo, definimos os padrões fundamentais de interação e deixamos essa base 100% pronta para plugar com velocidade exatamente as telas e jornadas que você for refinando na sua inspeção.*
> 
> *Vou compartilhar minha tela pra você ver como estruturamos essa fundação."*

### 🖥️ Ação na tela:
- Iniciar compartilhamento já na URL oficial: `https://inema.acto.com.br/?rota=seia-v2` (na tela inicial ou direto no menu).

### 💡 Argumento de Ouro:
> *"Nós não criamos telas isoladas: criamos um sistema de design escalável que absorve qualquer fluxo que você desenhar sem retrabalho de componentes."*

---

## 🎨 Bloco 2: O Design System Vivo & Fundações de UI
*(Acessar `/?rota=seia-v2&tela=design-system` — aprox. 3:30 min)*

### 🗣️ O que falar:
> *"Tales, começando pela nossa fonte de verdade: construímos um ambiente autônomo do **Design System oficial do INEMA**, documentando desde as fundações atômicas até componentes complexos.*
> 
> *Quero destacar 4 decisões de UX que tomamos aqui:*
> 
> 1. **Identidade Institucional sem Ruído:** Fixamos a paleta no verde institucional oficial (`#0F4C3A`), eliminando totalmente qualquer roxo, gradientes artificiais ou teals genéricos que costumam poluir sistemas de governo.
> 2. **Densidade de Informação (Dense UI):** O legado sofre muito com desperdício de espaço vertical. Aqui adotamos alturas de controle de 36px e 32px (padrão Filament/Dense), com tipografia modular (Inter) e dados em fonte monoespacial tabular (`font-mono tabular-nums`). Isso aumenta a área útil da tela sem cansar a vista.
> 3. **Grid de 8pt & Consistência Geométrica:** Todos os contêineres e cards seguem estritamente `rounded-xl` (12px), enquanto inputs e botões seguem `rounded-lg` (8px), com anéis de foco suaves de acessibilidade.
> 4. **Acessibilidade & Dark Mode Nativo:** Contraste validado em WCAG AA e dark mode neutro em carvão/ardósia, essencial para os analistas que trabalham 8 horas diárias analisando processos extensos."*

### 🖥️ O que mostrar:
1. Abrir a rota `/?rota=seia-v2&tela=design-system`.
2. Rolar brevemente pelas seções de **Tokens de Cores** e **Componentes Base** (`Button`, `Badge` com e sem dot, `InputWrapper`, `FilamentSelect`).
3. Alternar rapidamente para o **Dark Mode** (ícone de lua na topbar) e voltar para o Light Mode para demonstrar a consistência de contraste.
4. Apontar o comportamento dos componentes com estados de foco suave e transições de 150ms.

### 💡 Argumento de Ouro:
> *"Como já temos os tokens e componentes refinados, quando você terminar de desenhar uma tela no Figma, a nossa conversa técnica de implementação será em cima de blocos prontos, sem discussão de botões descartáveis ou inconsistências visuais."*

---

## 🧩 Bloco 3: Os 3 Arquétipos de Interação (Como Resolvemos o Legado)
*(Demonstração prática dos 3 padrões fundamentais — aprox. 4:30 min)*

> *"Tales, em vez de repassar 20 telas parecidas, vou te mostrar os **3 arquétipos fundamentais** que resolvem 95% de tudo o que existe no Inema legado:"*

---

### 🔹 Padrão 1: Pautas Operacionais & Data Grids (Tabelas com Contexto)
* **Rota para abrir:** `/?rota=seia-v2&tela=pauta-area` ou `/?rota=seia-v2&tela=tabela`
* **O que falar:**
  > *"O analista técnico passa 90% do dia em pautas de processos. No legado, o problema crônico são tabelas pesadas, sem filtros inteligentes e com popups que quebram o fluxo de raciocínio.*
  > 
  > *Aqui nós resolvemos isso com a **Tabela Canônica**:*
  > - *Toolbar com busca em tempo real (`debounced`) e filtros dinâmicos que exibem contagem ativa em badges.*
  > - *Badges semânticos de SLA com status dots (`danger` para atrasado, `warning` para atenção e `success` para deferido).*
  > - *Ações contextuais que abrem gavetas laterais (Drawers) ou modais refinados, permitindo analisar o processo sem que o técnico perca o contexto ou a posição na lista."*
* **O que mostrar:**
  - Digitar no filtro de busca da tabela.
  - Mostrar a contagem de itens e paginação limpa.
  - Clicar na ação da linha para abrir detalhes contextuais.

---

### 🔹 Padrão 2: Formulários Modulares & Wizard com Stepper SVG
* **Rota para abrir:** `/?rota=seia-v2&tela=formulario` ou `/?rota=seia-v2&tela=ansla-dispensa`
* **O que falar:**
  > *"O segundo arquétipo são os formulários ambientais. No legado, o usuário enfrenta páginas intermináveis com 70 a 80 campos monolíticos jogados na mesma tela, o que gera abandono e erros frequentes de preenchimento.*
  > 
  > *Nossa solução de UX foi o **FilamentWizard** com divisórias em chevron institucional SVG:*
  > - *Fatiamos a complexidade em etapas lógicas e digestíveis (Identificação, Tipologia, Recursos Hídricos, Documentos).*
  > - *O usuário sempre sabe onde está, o que concluiu e o que falta, com validação de campos e salvamento de rascunhos.*
  > - *Seções recolhíveis (`Section`) para dados complementares, mantendo a tela limpa."*
* **O que mostrar:**
  - Avançar entre etapas no Wizard (Etapa 1 ➔ Etapa 2).
  - Destacar os chevrons institucionais com indicador de etapa ativa e concluída.
  - Apontar o botão de retorno claro no topo: `← Voltar à Pauta`.

---

### 🔹 Padrão 3: Dashboards & Métricas de Produtividade Sóbrias
* **Rota para abrir:** `/?rota=seia-v2&tela=inicio`
* **O que falar:**
  > *"O terceiro arquétipo é a visão executiva e a gestão diária. No legado há uma grande escassez de visibilidade sobre pendências e prazos.*
  > 
  > *Aqui nós implementamos o padrão de **KpiCards Sóbrios**:*
  > - *Títulos em caixa alta discreta (`text-[11px] uppercase`), valores em `font-mono tabular-nums` e micro-sparklines de tendência.*
  > - *Zero ilustrações genéricas ou caixas coloridas berrantes: é uma interface densa, informativa e profissional, feita para tomada rápida de decisão pelo gestor e pelo técnico."*
* **O que mostrar:**
  - Passar o cursor sobre as métricas principais da Home (Mensagens, Notificações, Prazos, Requerimentos, Vencimentos).
  - Apontar a hierarquia limpa entre o Hero e os cards de Acesso Rápido.

---

## 🤝 Bloco 4: Handover & Fluxo de Implementação Contínua
*(Finalização abrindo a parceria — aprox. 2:00 min)*

### 🗣️ O que falar:
> *"Tales, essa é a arquitetura que está operando hoje no SEIA V2, já compilada, testada e publicada no link oficial `inema.acto.com.br`.*
> 
> *A grande vantagem prática para o seu trabalho de UX é que **você tem total liberdade de desenhar os fluxos na sua inspeção do legado sabendo que a base técnica já está resolvida**.*
> 
> *Conforme você for concluindo a inspeção de cada lote de telas (seja Regulação, Fiscalização, Recursos Hídricos ou Cadastros), a gente pega as telas que você revisar e pluga diretamente dentro dessa estrutura de componentes.*
> 
> *Como você prefere que a gente organize esse fluxo de repasse? Quer que a gente defina lotes de telas por sprint ou você prefere validar as jornadas principais primeiro no Figma?"*

---

## 📋 Checklist Rápido de Pré-Apresentação para o Tales

- [ ] **Aba 1:** `https://inema.acto.com.br/?rota=seia-v2&tela=design-system` (já aberta para mostrar o Design System).
- [ ] **Aba 2:** `https://inema.acto.com.br/?rota=seia-v2&tela=pauta-area` (pronta para demonstrar o Arquétipo 1 de Tabela).
- [ ] **Aba 3:** `https://inema.acto.com.br/?rota=seia-v2&tela=formulario` (pronta para demonstrar o Arquétipo 2 de Wizard).
- [ ] **Aba 4:** `https://inema.acto.com.br/?rota=seia-v2&tela=inicio` (pronta para demonstrar o Arquétipo 3 de Dashboards).
- [ ] **Tela de Apoio / Celular:** O teleprompter em `/?rota=seia-v2&tela=apresentacao` com o cronômetro ativo.
- [ ] Notificações e alertas silenciados.
