# Checklist de QA — Refino Cirúrgico CEUC (TL001 e TL002)

- **ID do Card / Módulo**: `CEUC-REFINO-CIRURGICO` (DOR036)
- **Escopo**: Compliance com DOR036 e Polimento de UI/UX em TL001 (Consulta) e TL002 (Formulário)
- **Data**: 24/09/2026
- **Status Geral**: ✅ APROVADO COM 100% DE ADERÊNCIA

---

## 1. Compliance de Negócio (DOR036)
- [x] **Filtro por Gestor (TL001)**: Adicionado seletor `GlaSelect` para Gestores na toolbar da tabela, integrado lado a lado com Categoria, Grupo, Municípios e Elegibilidade.
- [x] **População Estimada (TL002)**: Input numérico com label auxiliar "Famílias/Habitantes", fundamental para a gestão de UCs de Uso Sustentável (ex: APA Litoral Norte com 42.500 habitantes).
- [x] **Duplo Enquadramento SEUC/SNUC (TL002)**: Atualização do label para `Categoria de Manejo (SEUC/SNUC) *`.
- [x] **Status e Contexto Fundiário (TL002)**: Campo dedicado `Observações / Status Fundiário` para registro do estágio de terras públicas, devolutas e desapropriações.

---

## 2. Refinamento de UI/UX (Padrão Filament/GLA)
- [x] **Erradicação do Breadcrumb Duplicado**: Removida a trilha interna redundante no cabeçalho da TL002, preservando apenas o breadcrumb canônico superior do `AppShell`.
- [x] **Ações Primárias no Cabeçalho**: Botões `Salvar Rascunho` e `Avançar` replicados no canto superior direito do `PageHeader`, eliminando a necessidade de rolagem excessiva até o rodapé.
- [x] **Interação com Anexos (RN006)**: Botão de ação rápida `Visualizar` com ícone de olho nos arquivos PDF já carregados, abrindo modal com metadados e certificação SEI-BA.
- [x] **Limpeza Visual das Abas (GlaTabs)**: Remoção dos badges repetitivos de "Em breve", mantendo navegação limpa, sóbria e profissional.
- [x] **Envelopamento de Chips de Municípios**: Contêiner com `flex-wrap` e proteção contra estouro de largura.
