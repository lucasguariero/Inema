# Microcorreções — legendas e compliance v3

06/10/2026. Base auditada v2: `56848551c3a1e946cb8156473cfef368e55ae469`.

## Execução técnica

Somente cinco fontes de produto alteradas: lib/pautaGestor.ts (textos oficiais centralizados), PautaFiltros.tsx, PautaRegistroDialog.tsx, PautaGestorRegistrosPage.tsx e pautaGestor.css. AppShell, topbar, sidebar, navegação, tabelas, regras, mocks, Select compartilhado e dependências não foram alterados.

23 helpers oficiais implementados, conferidos nas páginas físicas 12–13 do PDF e no DOM. LEG002 permanece BLOQUEADA, sem renderização e sem restringir o campo Órgão. LEG003 segue o controle já existente em RD/Todos com origem compatível; não arbitra F003/RT. A matriz detalha as condições das 24 LEG.

InputWrapper.hint e DialogDescription são reutilizados. Tipografia 12px/16px, cor `--color-text-secondary`, espaçamento herdado, quebra natural. LEG005 aparece uma vez sob Data inicial e descreve o par; ambos os inputs referenciam o helper. LEG011 acompanha Eixo, não se repete no Subitem. LEG018 só aparece em Outros. LEG016 entra uma vez na lista TL005, sem alterar a tabela ou subvisão do candidato. LEG022 fica acima dos grupos. LEG023 acompanha adição de arquivos, não leitura de metadados. Sem DR/RN/LEG técnicos visíveis na UI.

TL011 preserva estrutura, referência principal, municípios, coordenadas, fontes, anexos comuns/estruturados e ações. LEG024 é literal; a indicação independente “GeoBahia: integração pendente.” permanece. Abrir GeoBahia continua disabled na mesma posição, agora na variante gray do Button existente, com cursor not-allowed e opacity 0.5. Não foi habilitado nenhum serviço.

## Evidência e classificação

48/48 verificações, 43/43 regressões, 24/24 microtestes reexecutados. Novos testes: 39/39 na suíte principal e 5/5 no complemento (quatro repetidos, um adicional); 40 casos únicos. Compara textos exatos, guias, condições, ausência de controles e estado disabled.

Matriz: 268 IDs únicos, apenas os 23 status LEG passaram de NÃO ATENDIDO para ATENDIDO. Distribuição: 126 A / 111 P / 12 NA / 19 B / 0 NV. C001–C093 mantidos: 49 A / 37 P / 3 NA / 4 B / 0 NV. Texto/aplicabilidade da legenda atendidos não tornam a regra associada ou backend atendidos.

## O que falta

Os serviços reais, contratos e contradições registrados em LIMITACOES-E-BLOQUEIOS-v3.md permanecem. Sem nota, homologação ou declaração de conclusão integral do DOR011. Evidência de publicação será registrada em PUBLICACAO-E-VALIDACAO-v3.md e no metadata do ZIP.
