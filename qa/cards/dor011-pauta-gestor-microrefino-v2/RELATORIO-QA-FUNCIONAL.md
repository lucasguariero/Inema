# QA funcional — DOR011 v2
Fonte: PDF DOR011 v1.4, 41 páginas; original intacto em 01_requisitos. Execução em 06/10/2026, dados exclusivamente simulados. Nenhuma operação no GLA de homologação.

## Suítes e alcance
48 verificações anteriores (35 regras + agregador + 12 fluxos UI), 43 testes de regressão v1 (26 regras + 17 UI) e 24 testes desta micro-rodada passaram. Há sobreposição; não somar como requisitos homologados. Logs completos em 06_logs, scripts no snapshot.
- M01/M02: anexo comum/estruturado/inválido, prioridade, fallback/ausência, upload sem extração geográfica, documentos, fonte e retorno.
- M03/M04: ausência de regra, permissão ausente, escopo diferente, status e relacionamento incompatíveis: DENY sem mutação; regra explícita: ALLOW. Abertura direta de visão restrita/estado inválido negada.
- M05: catálogos, resultados, busca, informações pessoais e duplicidades filtrados por sessão DIFIS, OUTRO e allowlist. Não comprova ACL de servidor.
- M06 (8 casos): configurador e colunas aplicáveis em Todas as guias; ações/duplicados obrigatórios conforme dados/operações; ausência de configurador em RA/AC; paginação ausente em zero/uma página.
- M07: 22 RD autorizados para forçar página 2; filtro municipal, seleção, visualizar candidato/voltar, cancelar, confirmar/duplo envio, pai mais antigo, desanexar com justificativa, cancelar/confirmar, contexto após operação.
- M08: origens/campos, número exato, resultado vazio, limpar sem nova consulta, período inválido preserva lista.
- M09/M10: Select controlado + quatro consumidores reais; ver relatório próprio.
- M11: 4K/390px, scroll interno da tabela, modal, foco e disabled.
- M12: 34 mensagens literais, quatro rótulos oficiais e ações externas desabilitadas.
Produção: 12 fluxos UI repetidos no domínio principal e 3 testes P01–P03 de anexos, Escape e paginação. A certificação da execução fica nos JSONs, não em prints isolados.

## Colunas contextuais
Colunas base: Tipo, Data, Número, Dias, Status, Municípios, Ações, Duplicados. Eixo adicional: Todos/RD/RT/RC/RA. Denunciante/Comunicante adicional: Todos/RD/RE/RC, condicionado à permissão pessoal.
Todos: 13 itens; RD 4; RE 3; RA 0; RC 2; RT 3; OF 1; AC 0 na fixture DIFIS.
Ações e Duplicados obrigatórios: Todos/RD/RE/RC/RT. OF: Ações obrigatória, Duplicados não obrigatório por ausência de relação. RA/AC: nenhum dado, nenhum configurador oferecido; aplicabilidade teórica não significa coluna renderizada. JSON colunas-oito-guias contém detalhe.

## Leitura honesta das mensagens
MSG002/008/013/022/025/034 não têm caminho de falha de serviço real. Estão declaradas literalmente, mas NÃO ATENDIDAS no contrato de integração.
MSG023/024/026/027 dependem de Ofício/conversão sem definição suficiente. Mensagem local de conflito/versionamento não simula transporte remoto.
A antiga verificação com título “falha GeoBahia” só prova bloqueio e contexto: NÃO houve chamada externa nem falha remota exercida.

## Resultado
Nenhuma falha restante nas suítes executadas. As limitações na matriz continuam válidas, mesmo com resultados positivos em memória.
