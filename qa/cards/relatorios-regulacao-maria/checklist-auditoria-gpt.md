# Roteiro de Auditoria e Validação Técnica (Para Revisão via GPT)

- **Módulo**: Relatórios de Regulação SEIA
- **Analista Solicitante**: Maria (Diretoria de Regulação — DIRRE / INEMA)
- **Documento de Referência**: `01 - Guia UX - Relatorios de Regulacao SEIA.md`
- **Link Exclusivo da Entrega**: `https://inema.acto.com.br/?analista=maria`
- **Resolução de Validação**: 1920x1080px (Full HD nativo)
- **Arquivo com Todos os Prints**: `qa/cards/relatorios-regulacao-maria/anexos-1080p-auditoria-gpt.zip`

---

## 📸 Mapeamento dos 15 Prints vs Requisitos do Guia UX

### 1. `Print 01 - Aba 1 Visao Geral Metricas e Graficos (1080p).png`
- **Requisito Atendido**: Seção 1 (Arquitetura Geral), Seção 2 (Carimbo e Metadados) e Seção 3 (Alternância de Métrica nos Gráficos).
- **Evidências Visíveis**:
  - Menu lateral (sidebar) estritamente isolado contendo apenas `Regulação` ➔ `Relatórios de Regulação (NOVO)`.
  - Carimbo institucional: `Dados do SEIA` e `Atualizado em: 22/09/2026 10:00`.
  - Botão `Sobre os dados`.
  - Abas Filament: `Tramitações no período (4.182)` e `Acompanhamento da pauta (3.840)`.
  - KPIs: 4.182 processos com tramitação e 9.450 registros de atos/atividades (média de 2,26 atos/processo).
  - Seletor de Medida: botões `Processos` e `Registros de atos/atividades` que alteram os títulos e eixos em tempo real.
  - Gráficos renderizados no verde oficial `#0F4C3A`.

### 2. `Print 02 - Aba 1 Tabela de Registros e Paginacao (1080p).png`
- **Requisito Atendido**: Seção 4 (Detalhamento dos Dados e Visualização por Registros).
- **Evidências Visíveis**:
  - Tabela com colunas: Cód. Processo / CEFIR, Data da Tramitação, Interessado / Razão Social, Coordenação, Ato / Atividade, Situação, Equipe Técnica e Ação `Detalhar`.
  - Badges semânticos de situação (ex.: `RL APROVADA`, `NOTIFICADO`, `CONCLUÍDO`).
  - Botão `Exportar Excel`.

### 3. `Print 03 - Modal Sobre os Dados SEIA e Criterios (1080p).png`
- **Requisito Atendido**: Seção 2 (Painel Informativo Metodológico).
- **Evidências Visíveis**:
  - Modal aberto com sistema de origem (SEIA).
  - Escopo e Cobertura: DIRRE (CGF, CEG, CRH, COASP) e Unidades Regionais (URs).
  - Critérios de contagem e regras cadastrais explicados sem ambiguidade.

### 4. `Print 04 - Modal de Filtros Avancados (1080p).png`
- **Requisito Atendido**: Seção 1 (Barra e Gaveta de Filtros Operacionais).
- **Evidências Visíveis**:
  - Gaveta de filtros com Unidades/Coordenações, Intervalo de datas (De / Até), Situações com checkboxes, Atos e Atividades com contadores dinâmicos, Técnicos com checkboxes e papel na equipe.
  - Botões `Limpar filtros` e `Consultar`.

### 5. `Print 05 - Nivel 1 Drawer Lateral de Resumo Rapido (1080p).png`
- **Requisito Atendido**: Seção 5 (Arquitetura de Detalhamento em 2 Níveis — Nível 1 a partir de Tramitações).
- **Evidências Visíveis**:
  - Drawer lateral deslizando à direita.
  - Cabeçalho: Número do Processo e Interessado.
  - Card 1: `Registro Selecionado` (Ato focado, data da tramitação, situação e unidade do registro).
  - Card 2: `Situação Atual do Processo` (Unidade atual, equipe técnica, localização e tipologia).
  - Alerta institucional de consulta aprofundada.
  - CTA primário: `Ver detalhes completos →` (`#0F4C3A`).

### 6. `Print 06 - Nivel 2 Detalhes 7 Blocos - Topo Identificacao e Situacao (1080p).png`
- **Requisito Atendido**: Seção 5 (Nível 2 — Blocos 1, 2, 3 e 4).
- **Evidências Visíveis**:
  - Modal expandido com botão `Voltar ao resumo`.
  - **Bloco 1 (Identificação)**: Processo, Requerimento Vinculado, Data de Formação, Interessado, Município, Empreendimento, Tipologia (ZERO exibição de CPF/CNPJ).
  - **Bloco 2 (Registro Selecionado)**: Ato em foco, Data, Situação registrada, Unidade, Responsável e Observação do despacho.
  - **Bloco 3 (Situação Atual)**: Situação geral, Unidade, Equipe/Técnico, Última movimentação e contador de dias sem movimentação.
  - **Bloco 4 (Atos Vinculados)**: Tabela de atos com tipologia e situação própria de cada ato.

### 7. `Print 07 - Nivel 2 Detalhes 7 Blocos - Atos Vinculados e Tramitacao (1080p).png`
- **Requisito Atendido**: Seção 5 (Nível 2 — Bloco 5: Histórico de Tramitação).
- **Evidências Visíveis**:
  - Histórico cronológico completo com colunas: Data / Hora, Ocorrência, Situação, Responsável, Destinatário e Observação técnica.

### 8. `Print 08 - Nivel 2 Detalhes 7 Blocos - Comunicacao e Tempos Prazos (1080p).png`
- **Requisito Atendido**: Seção 5 (Nível 2 — Bloco 6 e Bloco 7).
- **Evidências Visíveis**:
  - **Bloco 6 (Histórico de Comunicação)**: Notificações e ofícios apresentados em bloco autônomo separado da tramitação física.
  - **Bloco 7 (Tempos e Prazos)**: Tempo em análise técnica (48 dias), tempo aguardando resposta (30 dias), espécie normativa formal (*Análise Regulatória Conclusiva - Portaria INEMA 25.753/2022*), situação do prazo e nota metodológica sobre tempos concorrentes.

### 9. `Print 09 - Aba 1 Atividades por Tecnico e Medias NOUT (1080p).png`
- **Requisito Atendido**: Seção 4 (Visualização "Atividades por técnico" e Médias NOUT).
- **Evidências Visíveis**:
  - Context switcher ativo: `Apenas NOUT (Núcleo de Outorga)`.
  - 3 cartões de médias analíticas:
    - Média Mensal: **18,4** atos/técnico
    - Média Trimestral: **54,2** atos/técnico
    - Média Semestral: **108,1** atos/técnico
  - Indicador de períodos completos considerados e ausência de qualquer ranking/pódio punitivo.

### 10. `Print 10 - Aba 1 Estado Contingencia Media Indisponivel (1080p).png`
- **Requisito Atendido**: Seção 4 (Estado de Contingência de Médias).
- **Evidências Visíveis**:
  - Estado: *"Média indisponível: cobertura do período não confirmada"*.
  - Tooltip e notas explicativas orientando que a análise exige intervalo histórico completo.

### 11. `Print 11 - Aba 1 Visao Por Agrupamento e Nota Distintos (1080p).png`
- **Requisito Atendido**: Seção 4 (Visualização "Por agrupamento").
- **Evidências Visíveis**:
  - Sub-filtros por Município, Tipologia, Ato e Situação.
  - Nota de rodapé mandatória: *"Um processo pode aparecer em mais de um grupo. O total geral considera processos distintos."*

### 12. `Print 12 - Aba 1 Visao Anual DIRRE e Avisos Institucionais (1080p).png`
- **Requisito Atendido**: Seção 4 (Visualização "Anual DIRRE").
- **Evidências Visíveis**:
  - Seletor de Ano Base (2026, 2025, 2024).
  - Seletor de Família do Ato (Todas, Florestal, Licenciamento, etc.).
  - Cartão de destaque: `Registros concluídos ou encaminhados para publicação`.
  - Badge: `Situações consideradas: Concluído e Para publicação`.
  - Nota alertando sobre atos descontinuados fora da contagem.

### 13. `Print 13 - Aba 2 Acompanhamento da Pauta Visao Geral (1080p).png`
- **Requisito Atendido**: Seção 1 e Seção 6 (Aba Acompanhamento da Pauta).
- **Evidências Visíveis**:
  - Pauta consolidada em 22/09/2026 10:00 (Base SEIA).
  - KPI de processos na pauta (3.840) e processos com prazo excedido (412 - 10,7%).
  - Espécie do prazo explícita no card: *Análise Regulatória Conclusiva (Portaria INEMA nº 25.753/2022)*.
  - Gráficos de processos por situação atual (donut) e processos por faixas de dias sem movimentação (barras).

### 14. `Print 14 - Aba 2 Tabela Pauta Casos de Contraste Canonicos (1080p).png`
- **Requisito Atendido**: Seção 6 (Casos de Contraste Canônicos na Pauta).
- **Evidências Visíveis**:
  - Linha 1: Processo em análise técnica com líder e equipe definidos.
  - Linha 2: Processo aguardando resposta do requerente.
  - Linha 3: Processo formado sem nenhuma tramitação (`Sem tramitação registrada`, `45d (desde formação)`).
  - Linha 4: Processo sem atribuição técnica (`Sem atribuição técnica` com destaque sutil).

### 15. `Print 15 - Aba 2 Drawer Nivel 1 Contextualizado da Pauta (1080p).png`
- **Requisito Atendido**: Seção 5 (Nível 1 aberto a partir da Pauta).
- **Evidências Visíveis**:
  - Drawer contextualizado: prioriza `Situação e Atribuição Atuais`, técnico responsável e dias sem movimentação, sem criar dados artificiais de registro selecionado.
  - Botão de transição para Nível 2 (`Ver detalhes completos →`).
