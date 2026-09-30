# 🏛️ Plano de Execução SEIA V2 (INEMA) — Arquitetura de Software & Design System

> **Documento Oficial de Planejamento e Especificação Técnica**  
> **Status:** Fase 1 Concluída • Pronto para Execução da Fase 2, 3 e 4  
> **Stack Alvo:** TALL Stack (Tailwind CSS, Alpine.js, Laravel 11/12, Livewire 3) + Filament PHP 5.x/4.x  
> **Referência de Negócio:** Sistema Estadual de Informações Ambientais e de Recursos Hídricos da Bahia (SEIA/INEMA)

---

## 1. Diagnóstico e Ingestão de Contexto

A concepção do **SEIA V2** resulta da síntese crítica entre três frentes de design e engenharia mapeadas no projeto:

1. **Sistema Legado GLA (Homologação INEMA):**
   - *Pontos Positivos:* Alta densidade de informação (*Dense UI*), objetividade operacional para o técnico público, ausência de ruído decorativo, paleta institucional séria.
   - *Gargalos Superados:* Layout estático, falta de flexibilidade responsiva, elementos desalinhados e dependência de fluxos fragmentados.
2. **Figma de Média Fidelidade (Equipe de UX / Edital Oficial):**
   - *Diretriz Central:* Estruturação da navegação focada no fluxo de trabalho do **Técnico/Analista Ambiental**, com **9 Grupos de Navegação (`NavigationGroups`)** que cobrem todo o espectro do órgão (Atendimento, Recursos Hídricos, Flora, Fauna, Fiscalização, Conservação, Monitoramento e Gestão).
   - *Invariante:* Recursos transversais (LGPD, Gov.br, barramentos de autenticação, OCR) operam como infraestrutura e salvaguardas internas, não poluindo o menu principal.
3. **Redesign Shadcn / Filament:**
   - *Evolução Visual:* Cartões refinados, métricas analíticas inspiradas no Filament `StatsOverviewWidget`, microinterações táteis, e tipografia moderna e legível (*Plus Jakarta Sans / Inter*).

---

## 2. Princípios Inflexíveis do Design System (Fase 2)

| Requisito de Layout | Diretriz Técnica | Especificação CSS / Filament |
| :--- | :--- | :--- |
| **Topbar Institucional** | Verde oficial do INEMA cruzando **100% da largura** da janela de ponta a ponta. Contém logo do Governo da Bahia / INEMA, atalhos de notificações, perfil do analista e chave de perfil. | `w-full bg-[#0F4C3A] text-white h-14 border-b border-[#0c3d2e] z-40 fixed top-0` |
| **Sidebar Clara Abaixo da Topbar** | A Sidebar **NUNCA** corta ou sobrepõe a Topbar. É renderizada estritamente abaixo dela (`top-14`), com fundo claro (`bg-white` / `bg-slate-50`), borda lateral sutil (`border-r border-slate-200`) e largura fixa ergonômica (272px). | `fixed top-14 left-0 bottom-0 w-[272px] bg-white border-r border-slate-200 z-30` |
| **Global Search na Sidebar** | Campo de busca rápida integrado no topo da Sidebar para localização instantânea de processos, módulos e ferramentas com atalho visual `Ctrl+K`. | `h-9 bg-slate-50 border-slate-200 text-xs rounded-lg pl-8 pr-3` |
| **Ultra-Wide Defense** | Proibido esticar o conteúdo indiscriminadamente em monitores ultrawide (21:9 e 4K). O container de conteúdo principal adota obrigatoriamente contenção visual centralizada. | `max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6` |
| **Dense UI (Alta Densidade)** | Campos de formulário, comboboxes e botões padronizados em altura compacta institucional (`h-9` / 36px). Redução de paddings redundantes e eliminação de áreas mortas. | `h-9 text-xs sm:text-sm px-3 rounded-md border-slate-300` |
| **Ergonomia dos Rodapés** | Botões primários de avanço/salvamento (`Salvar`, `Avançar`, `Emitir Parecer`) **sempre à direita**. Botões de cancelamento/retorno (`Voltar`, `Cancelar`, `Salvar Rascunho`) **sempre à esquerda**. Proibido botão "Voltar" flutuando isolado no topo direito. | `<div class="flex items-center justify-between border-t p-4">` |

---

## 3. Arquitetura de Informação — Os 9 Grupos de Navegação (Fase 3)

A Sidebar é configurada através de `NavigationGroups` do Filament, refletindo a persona do **Técnico/Analista Governamental**:

```text
┌──────────────────────────────────────────────────────────┐
│  INEMA • SEIA V2 (Topbar 100% #0F4C3A)                   │
└──────────────────────────────────────────────────────────┘
┌─────────────────────┬────────────────────────────────────┐
│ [🔍 Buscar no SEIA] │                                    │
│                     │                                    │
│ 1. Início / Área    │                                    │
│    • Minhas pendênc.│                                    │
│    • Meus processos │                                    │
│    • Notificações   │                                    │
│    • Favoritos      │                                    │
│ ─────────────────── │                                    │
│ 2. Atendimento & Cad│                                    │
│    • Cadastros Básico│                                   │
│    • Imóveis Rurais │                                    │
│    • Ativ. Não Pass.│                                    │
│    • Regulação      │                                    │
│ ─────────────────── │                                    │
│ 3. Recursos Hídricos│                                    │
│    • CERH           │                                    │
│    • Vazões Outorg. │                                    │
│    • Balanço Hídrico│                                    │
│    • Cobrança       │                                    │
│    • Barragens      │                                    │
│ ─────────────────── │         ÁREA DE CONTEÚDO           │
│ 4. Flora e Vegetação│     (max-w-screen-2xl mx-auto)     │
│    • Reposição Flor.│                                    │
│    • RAF            │                                    │
│    • Decremento Veg.│                                    │
│ ─────────────────── │                                    │
│ 5. Fauna            │                                    │
│    • SISPASS        │                                    │
│    • CETAS          │                                    │
│ ─────────────────── │                                    │
│ 6. Fiscalização & Ct│                                    │
│    • Fiscalização Amb│                                   │
│    • CEAPD / TCFA   │                                    │
│    • MTR            │                                    │
│ ─────────────────── │                                    │
│ 7. Conservação & Soc│                                    │
│    • Compensação Amb│                                    │
│    • Unidades de Con│                                    │
│    • CEPPS          │                                    │
│ ─────────────────── │                                    │
│ 8. Monitoramento & I│                                    │
│    • Monitoramento  │                                    │
│    • Consulta Públic│                                    │
│    • Painel Ambient.│                                    │
│    • CIAM           │                                    │
│ ─────────────────── │                                    │
│ 9. Gestão Instituc. │                                    │
│    • Financeiro/DAE │                                    │
│    • Auditoria      │                                    │
│    • Administração  │                                    │
└─────────────────────┴────────────────────────────────────┘
```

---

## 4. As 3 Telas-Chave a Serem Executadas (Fase 4)

### 4.1. Tela 1: Dashboard Gerencial do Analista
- **Header:** Título h1 sóbrio, período de competência (ano corrente 2026), seletor rápido de diretoria/unidade regional.
- **Widgets Filament (`StatsOverviewWidget`):**
  - *Card 1:* Processos Atribuídos (Volume da carteira ativa com indicador de variação mensal).
  - *Card 2:* Em Análise Técnica (Processos em triagem ou vistoria).
  - *Card 3:* Pendências Externas (Aguardando complementação do empreendedor com alerta de contagem).
  - *Card 4:* Prazos Críticos / Vencidos (SLA expirado ou < 5 dias úteis com destaque em tom rose/amber).
- **Gráficos Integrados:**
  - Fluxo Mensal de Tramitação (Entradas vs. Saídas homologadas).
  - Distribuição da Carga de Trabalho por Coordenação (DIRRE, DIFIS, DISUC, DIPRE, COASP).
- **Painel de Acesso Rápido:** Tabela de "Ações Urgentes de Hoje" com atalhos diretos para análise.

### 4.2. Tela 2: Formulário de Cadastro Complexo (Requerimento Ambiental Unificado)
- **Estrutura Wizard (Steppers Filament):**
  - **Passo 1: Identificação do Empreendimento e Requerente:** CNPJ/CPF, Razão Social, Inscrição Estadual, Município polo, Coordenadas SIRGAS 2000 (Latitude/Longitude decimais).
  - **Passo 2: Enquadramento e Atividades Passíveis:** Combobox de tipologia ambiental, porte do empreendimento, potencial poluidor (Pequeno, Médio, Alto), cálculo de enquadramento automatizado.
  - **Passo 3: Intervenções em Recursos Hídricos e Flora:** Captação subterrânea/superficial (m³/dia), coordenadas dos pontos de captação, estimativa de Supressão Vegetal (ha) e plano de compensação biológica.
  - **Passo 4: Documentos Técnicos e Responsabilidade:** Upload com drag-and-drop de ART/RRT do Responsável Técnico, Planta Georreferenciada e Estudos Ambientais (EIA/RIMA ou PCA).
  - **Passo 5: Declarações e Resumo Financeiro:** Termo de veracidade sob as penas da lei, prévia de cálculo do DAE (Documento de Arrecadação Estadual).
- **Ergonomia dos Controles:** Inputs em grid de 12 colunas, validações inline reativas, e barra de rodapé fixa com **"Salvar Rascunho" e "Voltar" à esquerda**, e **"Avançar para Próxima Etapa" à direita**.

### 4.3. Tela 3: Tabela Operacional (List/Data Grid do SEIA V2)
- **Header & Filtros Rápidos (Filament Table Filters):**
  - Busca rápida por número de processo, requerente ou número do auto.
  - Linha de filtros colapsáveis: Status, Coordenação/Diretoria, Município, Tipologia do Ato, Intervalo de Datas.
- **Estrutura da Grade de Dados:**
  - Checkbox de seleção em massa para despachos múltiplos.
  - Coluna *Processo / Protocolo SEI* (estilizado em `font-mono text-xs font-semibold`).
  - Coluna *Requerente / Empreendimento*.
  - Coluna *Ato Requerido* (LP, LI, LO, ASV, Outorga).
  - Coluna *Data de Entrada & SLA* (alerta visual de proximidade do prazo legal de 120/180 dias).
  - Coluna *Status* com pills semânticas compactas (Verde = Deferido/Emitido, Âmbar = Em Análise, Azul = Pendência do Cidadão, Vermelho = Indeferido).
  - Coluna *Ações de Linha* (ícones táteis de Visualizar, Parecer Técnico, Despachar, Histórico).
- **Rodapé da Tabela:** Paginação completa ("Exibindo 1 a 10 de 142 resultados"), seletor de densidade (10, 25, 50, 100) e exportação em formato aberto.

---

## 5. Roteiro Passo a Passo de Implementação Autônoma

1. **Fase 1 (Atual):** Concluir e registrar formalmente o plano executivo `plano_execucao_seia_v2.md` na raiz do projeto.
2. **Fase 2:** Implementar a fundação do layout do SEIA V2 no ecossistema web:
   - Topbar verde institucional `#0F4C3A` cruzando 100% da viewport.
   - Sidebar clara abaixo da Topbar (`top-14`) com Global Search.
   - Container mestre com salvaguarda `max-w-screen-2xl mx-auto`.
   - Classes e componentes de Dense UI (`h-9`).
3. **Fase 3:** Construir a navegação completa dos 9 grupos de menu com hierarquia, contadores e atalhos rápidos.
4. **Fase 4:** Codificar as três telas-chave interativas:
   - Dashboard Gerencial.
   - Formulário Complexo em Wizard.
   - Tabela Operacional de Alta Densidade.
   - Disponibilizar também o correspondente em PHP/Filament para o repositório backend.
5. **Fase 5:** Validação visual automatizada em alta resolução (Full HD / 4K) comprovando que a Topbar cruza 100%, a Sidebar é clara e abaixo da barra, e as regras de usabilidade foram atendidas.
