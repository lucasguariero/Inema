# Checklist de Homologação e Validação Técnica — SEIA V2 (INEMA)

## 1. Fundação de Layout & Identidade Visual Filament PHP
- [x] Topbar com largura total de 100vw na cor institucional oficial (`#0F4C3A`).
- [x] Sidebar clara (`bg-white` / `border-slate-200`) posicionada rigorosamente abaixo da Topbar (`top-14`), sem sobreposição.
- [x] Campo de Busca Global (`Ctrl+K`, `h-9`) no topo da Sidebar com atalho de teclado visual.
- [x] Container de conteúdo com proteção ultra-wide (`max-w-screen-2xl mx-auto`).
- [x] Ausência total de AI-Slop: zero púrpura/roxo, zero teal genérico, zero ícones decorativos antes de títulos textuais.
- [x] Padrão *Dense UI* com inputs e controles `h-9`, tipografia sóbria e números em `font-mono`.

## 2. Arquitetura de Informação (9 NavigationGroups Oficiais)
- [x] 1. Início / Área de Trabalho
- [x] 2. Atendimento e Cadastros
- [x] 3. Recursos Hídricos
- [x] 4. Flora e Vegetação
- [x] 5. Fauna
- [x] 6. Fiscalização e Controle
- [x] 7. Conservação e Socioambiental
- [x] 8. Monitoramento e Informação Ambiental
- [x] 9. Gestão Institucional
- [x] Funcionalidades transversais (Gov.br, OCR, LGPD) preservadas na lógica interna e sem poluição do menu.

## 3. Telas-Chave Executadas
- [x] **Dashboard Gerencial**: 6 `StatsOverviewWidgets`, gráfico de tramitação mensal de processos, distribuição de carga por diretoria e pauta de urgências com SLAs críticos.
- [x] **Formulário de Cadastro Complexo (Wizard 5 Etapas)**: Grid responsivo de 12 colunas, validação de etapas, enquadramento automático classe 5 e rodapé ergonômico (cancelar/voltar à esquerda, avançar à direita, sem botão flutuante no topo).
- [x] **Tabela Operacional de Alta Densidade**: Filtros superiores, contadores de SLA decrescentes, badges semânticos, paginação completa, seleção em lote com barra flutuante e modal de detalhes completo com atalho para o SEI-BA.
