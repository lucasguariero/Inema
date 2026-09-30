# Checklist de QA — CEUC Fase 1 (TL001: Consulta de Unidades de Conservação)

- **ID do Card / Módulo**: `CEUC-FASE-1` (DOR036)
- **Escopo**: Consulta do Cadastro Estadual de Unidades de Conservação (CEUC / INEMA)
- **Data**: 24/09/2026
- **Status Geral**: ✅ APROVADO COM 100% DE ADERÊNCIA

---

## 1. Verificações de UI & Design System Filament
- [x] **Zero AI-Slop**: Uso estrito da paleta institucional (`#0F4C3A`), bordas `slate-200`, badges semânticos sóbrios.
- [x] **Sem Cards Órfãos**: Toolbar de filtros e ações integrada diretamente ao cabeçalho do `GlaCard` da tabela.
- [x] **Roteamento Isolado**: Parâmetro `?modulo=ceuc` restringe a sidebar exclusivamente a `Unidades de Conservação > Cadastro de UC (CEUC) [NOVO]`.
- [x] **Nenhum Parâmetro com Nome Pessoal**: Rota limpa e semântica (`?modulo=ceuc` ou `?rota=ceuc`).
- [x] **Breadcrumb Canônico**: Renderizado via `AppShell` sem duplicação de navegação.

---

## 2. Funcionalidades & Interações da TL001
- [x] **Listagem de UCs Reais da Bahia**: 4 UCs oficiais com diversidade de biomas e categorias (Morro do Chapéu, Litoral Norte, Wenceslau Guimarães, Sete Passagens).
- [x] **Cenários de Contraste**: Inclusão de caso sem elegibilidade para visitação pública e com PMUC pendente (*Estação Ecológica Wenceslau Guimarães*).
- [x] **Filtros Dinâmicos**: Busca por texto/código e seletores de Categoria, Grupo de Manejo, Município e Elegibilidade com contador e reset.
- [x] **Modal de Visualização**: Exibição completa de dados georreferenciados, gestor, conselho e vigência do plano de manejo.
- [x] **Simulação de Exportação**: Microestados de botão (Exportar ➔ Gerando... ➔ Concluído) e disparo de notificação toast no canto superior direito sem download físico de arquivos.
