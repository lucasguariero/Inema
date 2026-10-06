# Regressões — componentes compartilhados

## Alterado

FilamentSelect em src/components/filament/Select.tsx:101: teclado, foco, ARIA e normalização de busca. Contrato de props, callback onChange, valor controlado, renderização/estética e ativação automática de busca acima de 8 opções preservados. Não foi introduzida dependência nova.

## Efetivamente exercido

- Fixture do mesmo componente, listbox e combobox: Tab/Shift+Tab, Enter/Space quando aplicável, Escape, ArrowDown/Up, Home/End, aria-activedescendant, seleção e retorno de foco.
- DOR011: município com 417 itens, busca, tipos/formato, ordenação, paginação e selects em modal.
- uc-agendamento: abriu Novo Agendamento, focou um Select real, abriu por ArrowDown, fechou com Escape e conferiu foco/ausência de pageerror.
- fauna-especies: abriu Nova Espécie, mesmo teste no Select real.
- seia-v2: smoke de navegação e renderização da dashboard; NÃO teste completo dos Selects/formulários do SEIA V2.

Esses testes constam nos 43 casos de playwright-resultados.json. Não se confunde smoke com QA completo de funcionalidade.

## Preservados sem alteração nesta rodada

src/App.tsx, src/data/navigationConfig.json, AppShell/Header/Sidebar, Table/Section/InputWrapper/Tabs/GlaTable/Dialog/Button/Badge. DOR011 mantém o nome da página igual ao menu e a sidebar dedicada via escopo=pauta-gestor. Os arquivos compartilhados não alterados foram verificados por diff e exercidos no DOR011.

## Outros consumidores não homologados

Demais telas de Fiscalização, Fauna, UC, FilterDrawer, anexos de relatório, CERH, CRAS, usuários, parametrizações, formulário/tabela/design-system SEIA V2 também importam o Select. Constam no inventário consumidores-select.txt. Não se declarou regressão exaustiva dessas funcionalidades, nem se executaram testes HML que poderiam modificar registros. Testes adicionais por domínio continuam recomendados antes de integrar esse componente ao produto real.
