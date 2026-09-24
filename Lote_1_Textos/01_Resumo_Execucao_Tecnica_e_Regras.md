# 01 — Resumo da Execução Técnica & Regras de Negócio (Relatórios de Regulação SEIA)

- **Módulo**: Relatórios de Regulação SEIA
- **Analista Solicitante**: Maria (Diretoria de Regulação — DIRRE / INEMA)
- **Documento Base**: `01 - Guia UX - Relatorios de Regulacao SEIA.md`
- **Ambiente Exclusivo**: `https://inema.acto.com.br/?analista=maria`
- **Padrão Visual**: Sistema Legado GLA / Filament (`#0F4C3A`, verde institucional, tabelas e abas canônicas)

---

## 1. Decisões Arquiteturais e Diretrizes de Design
1. **Padrão Dual-Track e Isolamento Total**:
   - As demandas das analistas seguem o padrão visual do sistema legado GLA/Filament.
   - O link exclusivo `?analista=maria` filtra o menu lateral para exibir **estritamente o módulo `Regulação` ➔ `Relatórios de Regulação`**, sem poluição visual de Fiscalização, UCs ou SEIA Plataforma.
2. **Anti-AI-Slop Rigoroso**:
   - Zero roxo / púrpura.
   - Zero teal genérico (`teal-600/700`) — botões primários usam o verde institucional `#0F4C3A`.
   - Zero ícones decorativos colados antes de títulos textuais (`h1/h2`) ou títulos de cards.
   - Protocolos e identificadores em fonte monoespacial neutra (`font-mono`).
3. **Navegação (Botão vs Aba)**:
   - Ações de criação são botões primários no topo direito (`#0F4C3A`).
   - Abas (`FilamentTabs`) alternam estritamente contextos de pauta e gestão de dados.
   - A rota abre diretamente na tela operacional de relatórios.

---

## 2. Regras de Negócio Implementadas (RNs)

### RN001 — Metadados e Carimbo Institucional
- Exibição visível no topo direito: `Dados do SEIA` e `Atualizado em: 22/09/2026 10:00`.
- Modal `Sobre os dados` detalhando o sistema de origem (SEIA), abrangência DIRRE (CGF, CEG, CRH, COASP) e URs, e regras de contagem cadastral.

### RN002 — Alternância Dinâmica de Medida nos Gráficos (Aba 1)
- Switcher entre `Processos` (4.182 processos distintos com tramitação) e `Registros de atos/atividades` (9.450 registros com média de 2,26 atos/processo).
- Gráficos de Evolução Mensal e Distribuição por Unidade atualizam títulos, descrições e valores dinamicamente.

### RN003 — Atividades por Técnico e Médias Analíticas NOUT
- Seletor de contexto: `Apenas NOUT (Núcleo de Outorga)` vs `Geral DIRRE`.
- No contexto NOUT, exibição dos 3 cartões de médias analíticas:
  - Média Mensal: **18,4** atos/técnico
  - Média Trimestral: **54,2** atos/técnico
  - Média Semestral: **108,1** atos/técnico
- Indicador explícito de períodos completos considerados e tooltip explicativo.
- Botão de simulação para o estado de contingência: *"Média indisponível: cobertura do período não confirmada"*.
- Remoção total de qualquer coluna de ranking/posição ou pódio punitivo.

### RN004 — Agrupamentos e Nota de Processos Distintos
- Visão `Por agrupamento` com sub-filtros por Município, Tipologia, Ato e Situação.
- Nota de rodapé mandatória: *"Um processo pode aparecer em mais de um grupo. O total geral considera processos distintos."*

### RN005 — Visão Anual DIRRE
- Seletores de Ano Base (2026/2025/2024) e Família do Ato.
- Cartão de destaque de `Registros concluídos ou encaminhados para publicação`.
- Badge: `Situações consideradas: Concluído e Para publicação`.
- Aviso sobre atos descontinuados e regras de corte.

### RN006 — Arquitetura Compartilhada de Detalhamento em 2 Níveis
- **Nível 1 (Drawer Lateral de Resumo Rápido)**: Aberto ao clicar em `Detalhar` na tabela.
  - Contextual para Tramitações: Registro Selecionado, Situação Atual e CTA `Ver detalhes completos →`.
  - Contextual para Pauta: Prioriza situação atual, equipe técnica e dias sem movimentação sem forçar ato específico.
- **Nível 2 (Modal Completo em 7 Blocos Canônicos)**:
  1. Identificação do Processo (**ZERO CPF/CNPJ**, em estrita conformidade com LGPD);
  2. Registro Selecionado (ato focado e despacho);
  3. Situação Atual do Processo (dias sem movimentação);
  4. Atos Vinculados (tabela com status individualizado de cada ato);
  5. Histórico de Tramitação (linha cronológica com despachos);
  6. Histórico de Comunicação (notificações e avisos eletrônicos em bloco autônomo);
  7. Tempos e Prazos (tempo em análise, tempo aguardando resposta, espécie formal do prazo conforme Portaria 25.753/2022 e nota de prazos concorrentes).

### RN007 — Casos de Contraste Canônicos na Pauta (Aba 2)
- Topo da tabela com 4 cenários essenciais:
  1. Processo em análise técnica com equipe;
  2. Processo aguardando resposta do requerente;
  3. Processo formado sem nenhuma tramitação (`Sem tramitação registrada - 45d desde formação`);
  4. Processo sem atribuição técnica (`Sem atribuição técnica` com destaque em tom âmbar sutil).

### RN008 — Exportação em Excel com Estados de Feedback
- Botão `Exportar Excel` dinâmico por visão com estados:
  - Disponível (`Exportar Excel`);
  - Processando (`Gerando...` / `Gerando Excel...` com loader girando);
  - Concluído (`Gerado` / `Excel gerado. Baixar arquivo`).

---

## 3. O que falta ainda / Limitações Conhecidas (Declaração Transparente)

1. **Camada de Backend Real**: Os dados exibidos estão simulados em memória (`regulacaoMock.ts`). A integração com APIs REST e queries diretas do SEIA/PostgreSQL será a etapa posterior da equipe de engenharia.
2. **Formato Binário de Planilhas**: O download atual entrega `.csv` estruturado; se for requerido `.xlsx` com múltiplas planilhas formatadas, isso será executado via job assíncrono no backend.
3. **Persistência de Sessão**: Ao recarregar a tela (`F5`), os filtros reiniciam no padrão institucional (`2024-01-01` a `2024-12-31`).
