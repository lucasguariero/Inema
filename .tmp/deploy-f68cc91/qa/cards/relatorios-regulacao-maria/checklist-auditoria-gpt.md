# Roteiro de Auditoria e Validação Técnica (Para Revisão via GPT)

- **Módulo**: Relatórios de Regulação SEIA (Refino de Negócio, UX e Coerência de Mocks 2024)
- **Analista Solicitante**: Maria (Diretoria de Regulação — DIRRE / INEMA)
- **Documento de Referência**: `01 - Guia UX - Relatorios de Regulacao SEIA.md` + Diretrizes de Refino Cirúrgico
- **Link Exclusivo da Entrega**: `https://inema.acto.com.br/?escopo=regulacao`
- **Resolução de Validação**: 1920x1080px (Full HD nativo)
- **Pacote de Evidências**: `qa/cards/relatorios-regulacao-maria/anexos-1080p-auditoria-gpt.zip` (e `anexos.zip`)

---

## 📸 Pilar 2 — Mapeamento Detalhado dos 15 Prints vs Requisitos de Negócio

### 1. `Print 01 - Aba 1 Tramitacoes no Periodo - Metricas e Controles 2024.png`
- **Requisito Atendido**: Visão Geral de Tramitações, Controles de Gráficos e Coerência Temporal 2024.
- **Evidências Visíveis**:
  - Menu lateral restrito à entrega (`Regulação` -> `Relatórios de Regulação`).
  - Carimbo institucional: `Dados do SEIA` e `Atualizado em: 24/09/2024 10:00`.
  - Abas Filament: `Tramitações no período (4.182)` e `Acompanhamento da pauta (3.840)`.
  - Controles de gráfico: **Evolução** com seletor de granularidade (`ESCALA: Mês`, Trimestre, Semestre, Ano) exibindo dados de Jan a Dez de 2024.
  - Controles de gráfico: **Distribuição** com agrupamento (`AGRUPAR: Unidade / Coordenação`, Ato/Atividade, Situação, Técnico).
  - Padrão visual institucional estrito `#0F4C3A`, sem qualquer elemento roxo ou teal genérico.

### 2. `Print 02 - Aba 1 Tramitacoes no Periodo - Tabela de Registros 2024.png`
- **Requisito Atendido**: Tabela de Detalhamento dos Registros e Paginação Dense UI.
- **Evidências Visíveis**:
  - Tabela com processos de 2024: Processo/CEFIR, Data da Tramitação, Interessado, Coordenação, Ato/Atividade, Situação, Equipe Técnica e botão `Detalhar`.
  - Badges semânticos de situação (`RL APROVADA`, `REVISADO`, `NOTIFICADO`, `CONCLUÍDO`).
  - Botão de exportação `Exportar Excel`.

### 3. `Print 03 - Modal Sobre os Dados - Criterios SEIA e Carimbo Atualizado.png`
- **Requisito Atendido**: Painel Informativo e Critérios Metodológicos SEIA.
- **Evidências Visíveis**:
  - Origem oficial (SEIA), cobertura DIRRE e Unidades Regionais, contagem de processos distintos vs atos, regras de auditoria e conformidade.

### 4. `Print 04 - Modal de Filtros Avancados - Tramitacoes.png`
- **Requisito Atendido**: Gaveta de Filtros Avançados das Tramitações.
- **Evidências Visíveis**:
  - Filtros multi-seleção para Unidades, intervalo de datas 2024, Situações, Atos, Técnicos e Papel na equipe, com botões `Limpar filtros` e `Consultar`.

### 5. `Print 05 - Aba 1 Atividades por Tecnico - Medias NOUT 2024.png`
- **Requisito Atendido**: Regra Condicional NOUT e Bloco de Médias com Rótulos Dinâmicos de 2024.
- **Evidências Visíveis**:
  - Seletor de Coordenação / Unidade: `NOUT (Núcleo de Outorga)`.
  - Exibição exclusiva dos 3 cards de média histórica:
    - **MÉDIA MENSAL EM 2024 (12 MESES)**: `18,4 processos/mês` (`Jan/2024 a Dez/2024 (12 meses completos considerados)`).
    - **MÉDIA TRIMESTRAL EM 2024 (4 TRIMESTRES)**: `54,2 processos/trimestre` (`1º ao 4º Trimestre 2024 (4 trimestres completos)`).
    - **MÉDIA SEMESTRAL EM 2024 (2 SEMESTRES)**: `108,1 processos/semestre` (`1º e 2º Semestre 2024 (2 semestres completos)`).
  - Nota metodológica: *"Média dos totais de processos distintos de cada período completo considerado (Exclusivo NOUT)"*.

### 6. `Print 06 - Aba 1 Atividades por Tecnico - Regra Condicional CRAS sem Medias.png`
- **Requisito Atendido**: Cenário de Contraste da Regra Condicional NOUT.
- **Evidências Visíveis**:
  - Seletor com outra unidade selecionada: `CRAS`.
  - Os 3 cards de médias são **completamente suprimidos da interface**, mantendo apenas o seletor e a listagem de técnicos.

### 7. `Print 07 - Aba 1 Visao Por Agrupamento - Consolidado 2024.png`
- **Requisito Atendido**: Sub-aba "Por agrupamento" e Nota de Processos Distintos.
- **Evidências Visíveis**:
  - Segmented control com botões: Unidade, Município, Tipologia, Ato/Atividade, Situação.
  - Tabela com contagem de processos e atos, e nota informativa de processos distintos.

### 8. `Print 08 - Aba 1 Visao Anual DIRRE - Familias e Evolucao Mensal.png`
- **Requisito Atendido**: Sub-aba "Anual DIRRE", Seletor de Famílias Estrito e 2 Gráficos Específicos.
- **Evidências Visíveis**:
  - Seletor `Ano base: 2024` e `Família do ato:` limitado estritamente a `Todas`, `Florestal`, `Licença`, `Outorga`.
  - Tag indicativa: `Situações consideradas: Concluído e Para publicação`.
  - Card institucional: `ANO REFERÊNCIA: 2024` | `1.482 registros` | *"Registros concluídos ou encaminhados para publicação"*.
  - **Gráfico 1 (Donut)**: Distribuição por Família (2024) com total 1.482.
  - **Gráfico 2 (Barras)**: Evolução Mensal (2024) de Jan a Dez.
  - Tabela canônica de atos e famílias com ações `Ver registros`.

### 9. `Print 09 - Aba 2 Acompanhamento da Pauta - Carimbo e Metricas 412 Excedidos.png`
- **Requisito Atendido**: Aba Acompanhamento da Pauta, Carimbo Temporal e Contagem de Prazos Excedidos.
- **Evidências Visíveis**:
  - Carimbo fixo: `Pauta em: 24/09/2024 10:00 • Posição oficial consolidada de processos ativos` | `Regra normativa: Portaria INEMA nº 25.753/2022`.
  - Card 1: `3.840` processos na pauta consultada.
  - Card 2: `412` processos com prazo excedido (`10,7% da pauta em alerta`), com explicação explícita de que **não contabiliza prazos indeterminados**.
  - Gráficos: Donut de Processos por Situação Atual e Barras de Processos por faixas de dias sem movimentação.

### 10. `Print 10 - Aba 2 Acompanhamento da Pauta - Tabela Ativa e Badges de Prazo.png`
- **Requisito Atendido**: Tabela Operacional da Pauta, Toolbar Integrada e Badges Semânticos.
- **Evidências Visíveis**:
  - Toolbar compacta: Campo de busca, selects compactos (`Prazo`, `Atribuição`, `Ato`, `Município`, `Tipologia`) e inputs de dias (`Mín`, `Máx`).
  - Badges semânticos de prazo nos padrões oficiais:
    - Verde: `No prazo`
    - Vermelho: `Excedido`
    - Âmbar: `Suspenso`
    - Cinza: `Não aplicável`
    - Cinza: `Indeterminado`
  - Terceira linha com o processo `FORM-00319`: última movimentação *"Sem tramitação registrada"*, dias sem movimentação `45d (desde formação)` e situação do prazo `Indeterminado`.

### 11. `Print 11 - Aba 2 Filtros da Pauta - Drawer com Filtros Sincronizados.png`
- **Requisito Atendido**: Drawer de Filtros da Pauta Operacional.
- **Evidências Visíveis**:
  - Filtros alinhados com os requisitos: Situação do Prazo Regulamentar, Atribuição Técnica, Ato Vinculado, Município, Tipologia, Dias sem movimentação (Min e Max), Unidade Atual, Técnico e Situação Atual.

### 12. `Print 12 - Aba 2 Caso Sem Tramitacao - Destaque FORM-00319 na Tabela.png`
- **Requisito Atendido**: Caso Crítico da Pauta — Processo Sem Tramitação Registrada.
- **Evidências Visíveis**:
  - Linha do processo `2024.001.000319/INEMA/FORM-00319` em destaque: Bioenergia Campo Limpo Ltda, COASP, Sem atribuição técnica, `FORMADO - SEM TRAMITAÇÃO`, última movimentação `Sem tramitação registrada`, `45d (desde formação)`, badge cinza `Indeterminado` e botão `Detalhar`.

### 13. `Print 13 - Aba 2 Caso Sem Tramitacao - Drawer Nivel 1 Resumo Rapido.png`
- **Requisito Atendido**: Drawer Lateral Nível 1 para Processo Sem Tramitação.
- **Evidências Visíveis**:
  - Identificação: `2024.001.000319/INEMA/FORM-00319` • `Bioenergia Campo Limpo Ltda`.
  - Situação: `FORMADO - SEM TRAMITAÇÃO`.
  - Equipe/Técnico: `Sem atribuição técnica` (itálico).
  - Última Movimentação: `Sem tramitação registrada` (itálico).
  - Rótulo de dias ajustado cirurgicamente: `DIAS DESDE A FORMAÇÃO: 45 dias` (em vez de dias sem movimentação).
  - Situação do prazo: `Indeterminado`.
  - CTA primário: `Ver detalhes completos →` (`#0F4C3A`).

### 14. `Print 14 - Aba 2 Caso Sem Tramitacao - Modal Nivel 2 Topo Identificacao.png`
- **Requisito Atendido**: Modal Nível 2 — Estrutura de 7 Blocos (Topo: Blocos 1, 3 e 4).
- **Evidências Visíveis**:
  - Tag superior: `Origem: Acompanhamento da pauta`.
  - Bloco 1 (Identificação): Processo, Requerimento, Data de formação, Empreendimento, Tipologia (ZERO dados sensíveis).
  - Bloco 3 (Situação Atual): `FORMADO - SEM TRAMITAÇÃO`, `COASP`, `Sem atribuição técnica`, `DIAS DESDE A FORMAÇÃO: 45 dias`, `ATUALIZAÇÃO DA CONSULTA: 24/09/2024 às 10:00`.
  - Bloco 4 (Atos Vinculados): `Aprovação da Localização da Reserva Legal (ARL)`.

### 15. `Print 15 - Aba 2 Caso Sem Tramitacao - Modal Nivel 2 Empty State e Tempos Indisponiveis.png`
- **Requisito Atendido**: Modal Nível 2 — Empty State de Histórico de Tramitação e Tempos Indisponíveis (Blocos 5, 6 e 7).
- **Evidências Visíveis**:
  - **Bloco 5 (Histórico de Tramitação)**: Empty state com ícone de relógio e mensagem: *"Sem tramitação registrada — Este processo não possui despachos, encaminhamentos ou movimentações internas registradas no SEIA desde sua formação."*
  - **Bloco 6 (Histórico de Comunicação)**: Registros de notificações eletrônicas e aviso de formação de processo.
  - **Bloco 7 (Tempos e Prazos)**:
    - `TEMPO EM ANÁLISE TÉCNICA`: *Tempo indisponível* (Período com equipe técnica)
    - `TEMPO AGUARDANDO RESPOSTA`: *Tempo indisponível* (Prazos de notificação requerente)
    - `ESPÉCIE DO PRAZO`: Análise Regulatória Conclusiva (Portaria INEMA 25.753/2022)
    - `SITUAÇÃO DO PRAZO`: Badge cinza `Indeterminado`.
  - Rodapé fixo com botões `Voltar ao resumo` e `Concluir`.

---

## 🏗️ Pilar 1 — Explicação da Execução Técnica & Decisões de Arquitetura

1. **Correção de Filtragem Falsa de Dias no Front-End:**
   - Detectou-se que a verificação `filtros.diasMin !== undefined` tratava a string vazia `""` como filtro ativo, gerando uma pílula espúria e filtrando a pauta para zero registros.
   - Refatoração cirúrgica para checar `filtros.diasMin !== undefined && filtros.diasMin !== '' && !isNaN(Number(filtros.diasMin))` tanto na exibição de pílulas quanto na filtragem do array.

2. **Cálculo Desacoplado de Prazos Excedidos:**
   - A métrica do KPI de prazos excedidos calcula estritamente `p.situacaoPrazo === 'Excedido'`, garantindo que processos com prazo `Indeterminado` (como o `FORM-00319`) ou `Suspenso`/`Não aplicável` não inflem a contagem de processos em alerta.

3. **Arquitetura de Apresentação Dual-Track & Isolamento:**
   - A página opera sob o escopo `regulacao` (`https://inema.acto.com.br/?escopo=regulacao`), com menu lateral estritamente dedicado à entrega da analista, mantendo as demais rotas corporativas preservadas.

---

## 🔍 Pilar 3 — Declaração Explícita de "O Que Falta Ainda" (Para Auditoria GPT)

Para transparência com o GPT auditor do usuário:
1. **Natureza dos Dados (Client-Side Mock):**
   - Os dados exibidos (tramitações, pauta, técnicos, históricos e gráficos) são servidos por um mock TypeScript estruturado (`src/data/regulacaoMock.ts`), simulando com 100% de realismo as APIs REST do SEIA. Quando os endpoints reais forem integrados, os tipos TypeScript já mapeiam 1:1 o payload JSON.
2. **Exportação Excel (Client-Side Simulado):**
   - O botão `Exportar Excel` simula o ciclo de vida completo de geração (estado de loading com spinner, estado de sucesso e notificação toast com auto-fechamento), sem realizar download físico de arquivo binário `.xlsx`.
3. **Persistência de Novos Registros:**
   - As consultas e filtros reagem dinamicamente em memória durante a sessão; recarregar a página restaura o estado inicial padrão de 2024.
