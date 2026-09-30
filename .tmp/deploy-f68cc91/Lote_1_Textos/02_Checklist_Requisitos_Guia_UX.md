# 02 — Checklist de Requisitos vs Implementação (Guia UX SEIA)

Mapeamento de confronto entre o documento `01 - Guia UX - Relatorios de Regulacao SEIA.md` e o código implementado:

| Seção do Guia UX | Item / Requisito | Status | Como foi Implementado |
| :--- | :--- | :---: | :--- |
| **Seção 1: Arquitetura Geral** | Duas abas principais | ✅ APROVADO | FilamentTabs com "Tramitações no período" (4.182) e "Acompanhamento da pauta" (3.840). |
| **Seção 1: Arquitetura Geral** | Filtros operacionais | ✅ APROVADO | Barra de filtros com chips de remoção e gaveta lateral de filtros detalhados. |
| **Seção 2: Carimbo e Metadados** | Data/hora de corte | ✅ APROVADO | "Atualizado em: 22/09/2026 10:00" e "Dados do SEIA" fixados no cabeçalho. |
| **Seção 2: Carimbo e Metadados** | Painel Sobre os Dados | ✅ APROVADO | Modal dedicado com origem SEIA, escopo DIRRE/URs e regras de agrupamento. |
| **Seção 3: Métricas e Gráficos** | Alternância Processos vs Atos | ✅ APROVADO | Switcher reativo que altera títulos, eixos e dados dos gráficos de evolução e distribuição. |
| **Seção 3: Métricas e Gráficos** | Paleta institucional | ✅ APROVADO | Barras em verde oficial `#0F4C3A`, zero roxo e zero teal genérico. |
| **Seção 4: Detalhamento dos Dados** | Visão Registros | ✅ APROVADO | Tabela com colunas canônicas, paginação e botão Exportar Excel. |
| **Seção 4: Detalhamento dos Dados** | Visão Atividades por Técnico | ✅ APROVADO | Switcher NOUT vs DIRRE Geral com 3 cartões de médias (18,4 / 54,2 / 108,1). |
| **Seção 4: Detalhamento dos Dados** | Contingência de Médias | ✅ APROVADO | Botão de simulação do estado "Média indisponível: cobertura do período não confirmada". |
| **Seção 4: Detalhamento dos Dados** | Ausência de Ranking | ✅ APROVADO | Zero colunas de ranqueamento/posição ou pódio punitivo. |
| **Seção 4: Detalhamento dos Dados** | Visão Por Agrupamento | ✅ APROVADO | Agrupamento por Município, Tipologia, Ato e Situação com nota de processos distintos. |
| **Seção 4: Detalhamento dos Dados** | Visão Anual DIRRE | ✅ APROVADO | Seletores de Ano Base, Família do Ato, destaque de Concluídos/Publicados e avisos institucionais. |
| **Seção 5: Detalhamento em 2 Níveis** | Nível 1: Drawer Lateral | ✅ APROVADO | Painel de resumo contextualizado (Tramitações vs Pauta) com CTA "Ver detalhes completos". |
| **Seção 5: Detalhamento em 2 Níveis** | Nível 2: 7 Blocos Canônicos | ✅ APROVADO | Modal completo com Identificação (sem CPF/CNPJ), Registro Selecionado, Situação Atual, Atos, Tramitação, Comunicação e Tempos. |
| **Seção 5: Detalhamento em 2 Níveis** | Comunicação Apartada | ✅ APROVADO | Bloco autônomo para notificações e ofícios, desvinculado do fluxo de trâmite físico. |
| **Seção 5: Detalhamento em 2 Níveis** | Tempos e Prazos | ✅ APROVADO | Espécie formal referenciando a Portaria INEMA 25.753/2022 e nota de tempos concorrentes. |
| **Seção 6: Acompanhamento da Pauta** | KPIs da Pauta | ✅ APROVADO | Cards com processos na pauta (3.840) e processos com prazo excedido (412 - 10,7%). |
| **Seção 6: Acompanhamento da Pauta** | Casos de Contraste | ✅ APROVADO | Em análise, Aguardando requerente, Formado sem tramitação e Sem atribuição técnica. |
| **Seção 6: Acompanhamento da Pauta** | Drawer Contextualizado | ✅ APROVADO | Focado em situação atual e equipe técnica, sem forçar ato selecionado individual. |
| **Diretrizes Institucionais** | Isolamento de Sidebar | ✅ APROVADO | Parâmetro ?analista=maria exibe estritamente o módulo de Regulação. |
