# Checklist de Homologação — Relatórios de Regulação SEIA (Entrega Analista Maria)

- **Analista Responsável**: Maria (Diretoria de Regulação — DIRRE / INEMA)
- **Documento Base**: `01 - Guia UX - Relatorios de Regulacao SEIA.md`
- **Ambiente de Entrega Isolada**: `https://inema-regulacao.vercel.app/` (ou `https://inema.acto.com.br/?escopo=regulacao`)
- **Ambiente Master Consolidado**: `https://inema.acto.com.br/`
- **Identidade Visual**: Padrão Oficial GLA / Filament (`#0F4C3A`, sem roxo/teal genérico, sem badges chamativos)

---

## 1. Protocolo de Isolamento da Entrega (Sidebar Escopada)
- [x] Link com parâmetro `?escopo=regulacao` ou domínio `inema-regulacao.vercel.app` exibe **SOMENTE** o grupo `Regulação` e o item `Relatórios de Regulação` no menu lateral.
- [x] Ocultação estrita de módulos alheios nesta visão: Fiscalização, Unidades de Conservação e SEIA Plataforma não poluem a visualização da analista.
- [x] Rota padrão na visualização escopada direciona imediatamente para `/relatorios`.
- [x] O Portal Master (`inema.acto.com.br`) preserva integralmente todos os módulos consolidados (SEIA, Regulação, Fiscalização, UCs).
- [x] Protótipos congelados de entregas anteriores (ex.: `inema-lucas.vercel.app`) permanecem intocados.

---

## 2. Metadados e Painel "Sobre os Dados" (Seção 2)
- [x] Botão discreto `Sobre os dados` no cabeçalho superior direito.
- [x] Carimbo institucional: `Dados do SEIA` e `Atualizado em: 22/09/2026 10:00`.
- [x] Modal informativo com:
  - Sistema de origem: SEIA (Sistema Estadual de Informações Ambientais e Recursos Hídricos).
  - Escopo e Cobertura: DIRRE (CGF, CEG, CRH, COASP) e Unidades Regionais (URs).
  - Regras cadastrais e de agrupamento explicadas com clareza.

---

## 3. Arquitetura de Detalhamento Compartilhada em 2 Níveis (Seção 5)
- [x] **Nível 1 (Painel Lateral / Drawer de Resumo Rápido)**:
  - Acionado ao clicar em `Detalhar` em qualquer registro da tabela.
  - Contextual para **Tramitações**: exibe Processo, Interessado, Registro Selecionado (Ato, Data, Situação, Unidade) e Situação Atual do Processo (Unidade atual, Equipe técnica, Última movimentação).
  - Contextual para **Pauta**: prioriza a situação atual e equipe/técnico sem inventar registro selecionado inexistente.
  - Ação primária destacada: botão `Ver detalhes completos` (`#0F4C3A`) que abre o Nível 2.
- [x] **Nível 2 (Modal Canônico em 7 Blocos Estruturados)**:
  - **Bloco 1 - Identificação**: Processo, Requerimento SEIA vinculado, Interessado (sem CPF/CNPJ), Empreendimento, Município, Tipologia, Data de formação.
  - **Bloco 2 - Registro Selecionado**: Ato/Atividade, Data da ocorrência, Situação do ato, Unidade responsável institucional e Observação do despacho/manifestação.
  - **Bloco 3 - Situação Atual do Processo**: Situação geral, Unidade atual, Equipe técnica (líder e membros), Última movimentação com contador de dias sem movimentação.
  - **Bloco 4 - Atos Vinculados ao Processo**: Tabela com Ato, Tipologia e a situação própria de cada ato (evitando misturar situação do ato com situação geral do processo).
  - **Bloco 5 - Histórico de Tramitação**: Linha do tempo com Data/Hora, Ocorrência, Situação, Responsável, Destinatário e Observações.
  - **Bloco 6 - Histórico de Comunicação (Apartado)**: Bloco autônomo com Notificações emitidas, avisos eletrônicos, data de envio, ciência e prazo de resposta.
  - **Bloco 7 - Tempos e Prazos**: Tempo total em análise, tempo aguardando resposta do requerente, espécie do prazo formal, vencimento, situação (No prazo/Atenção/Excedido) e nota institucional sobre prazos concorrentes.

---

## 4. Aba 1: Tramitações no Período
- [x] **Alternância de Medida dos Gráficos**:
  - Switcher entre `Processos` e `Registros de atos/atividades`.
  - Títulos e eixos dos gráficos atualizam dinamicamente conforme a medida selecionada.
  - Gráfico 1 (Evolução no período) renderiza barras verdes `#0F4C3A` sem falhas.
  - Gráfico 2 (Distribuição por unidade) horizontal limpo com barras proporcionais.
- [x] **Visualização "Atividades por Técnico"**:
  - Context switcher: `Apenas NOUT (Núcleo de Outorga)` vs `Geral DIRRE`.
  - No contexto NOUT, exibição dos 3 cartões de médias analíticas:
    - Média Mensal: **18,4** atos/técnico
    - Média Trimestral: **54,2** atos/técnico
    - Média Semestral: **108,1** atos/técnico
  - Indicador explícito de períodos completos considerados e tooltip explicativo da metodologia de cálculo.
  - Botão de simulação/teste para o estado: *"Média indisponível: cobertura do período não confirmada"*.
  - Remoção de qualquer coluna de ranking/posição ou pódio punitivo.
- [x] **Visualização "Por Agrupamento"**:
  - Sub-filtros rápidos por Município, Tipologia, Ato/Atividade e Situação.
  - Nota de rodapé mandatória: *"Um processo pode aparecer em mais de um grupo. O total geral considera processos distintos."*
- [x] **Visualização "Anual DIRRE"**:
  - Seletor de Ano Base (2026, 2025, 2024).
  - Seletor de Família do Ato (Todas, Florestal/CEFIR, Licenciamento/Regularização, Outorga, Outros).
  - Cartão de destaque: `Registros concluídos ou encaminhados para publicação` com valor consolidado.
  - Badge de status: `Situações consideradas: Concluído e Para publicação`.
  - Nota institucional alertando sobre atos descontinuados e regras de corte anual.
- [x] **Exportação Excel**:
  - Botão no cabeçalho do detalhamento que exporta a massa de dados referente à visão ativa (Registros, Por Técnico, Agrupamento ou Anual).

---

## 5. Aba 2: Acompanhamento da Pauta & Casos de Contraste
- [x] **Casos de Contraste Canônicos no Topo da Pauta**:
  - Caso 1: Processo em análise técnica com equipe e líder definidos.
  - Caso 2: Processo aguardando resposta do requerente (com notificação pendente).
  - Caso 3: Processo formado sem nenhuma tramitação (`Sem tramitação registrada`, `45d (desde formação)`).
  - Caso 4: Processo ainda sem atribuição técnica (`Sem atribuição técnica` com destaque sutil em âmbar).
- [x] **Espécie do Prazo**:
  - Indicador nos KPIs e no detalhamento referenciando a norma oficial: *"Espécie do prazo: Análise Regulatória Conclusiva (Portaria INEMA nº 25.753/2022)"*.
- [x] **Exportação Excel**:
  - Ação `Exportar Excel` com tooltip confirmando que exporta o resultado da última consulta confirmada pelos filtros.

---

## 6. Verificação Visual e Validação Técnica
- [x] `npm run build` executado com 0 erros de compilação.
- [x] 10 screenshots capturados e auditados em alta resolução via Playwright.
- [x] Paleta oficial mantida rigorosamente (#0F4C3A, bordas semânticas, zero roxo/teal).
- [x] Pacote `anexos.zip` gerado com os 6 prints canônicos para apresentação.
- [x] Parecer formatado em `comentario-card.txt` para comunicação no card/chat da analista.
