# Gates técnicos — v2
06/10/2026. A referência de verdade é cada log JSON com comando, início/fim UTC, stdout, stderr e exitCode.

| Gate | Resultado | Log |
|---|---|---|
| TypeScript (tsc --noEmit) | 0 erros, exit 0 | tsc-final |
| npm run build | 0 erros, exit 0 | build-final |
| Verificações anteriores | 48/48 | verificacoes-48-final-v2, resultado-qa.json |
| Regressão v1 | 43/43, sem skipped/flaky | regressao-43-final, playwright-resultados.json |
| Micro-rodada | 24/24, sem skipped/flaky | micro-testes-final-24, micro-playwright-resultados.json |
| Produção, fluxos anteriores | 12/12 | producao-final, resultado-producao.json |
| Produção, delta | 3/3 P01–P03 | producao-delta, producao-playwright-resultados.json |
| Lint | NÃO VERIFICADO: script inexistente | lint-script-check |
| Auditoria de dependências | 1 alta preexistente, exit 1 | npm-audit, source-map-cadeia |
| Inspeção de padrão UI | Detector [] | impeccable-scan |

Build avisa chunk acima de 500 kB. Aviso preexistente, sem nova dependência/code-splitting nesta rodada. Node também registra aviso NO_COLOR/FORCE_COLOR; não tratado como erro TypeScript.
O exit 0 do comando de inspeção do script lint NÃO é execução de lint. Não foi instalado ESLint.
48 incluem 35 verificações puras e uma linha agregadora; não são 48 testes Playwright independentes. 43 e 24 têm sobreposição; soma não comprova 115 requisitos distintos.
Há logs de execução diagnóstica com falha antes da correção: heading duplicado, Escape real e duas falhas de expectativa do teste (botão externo coberto / formulários de página confundidos com modal). Últimas execuções completas aprovadas.
Build não executa validação TypeScript por si só; tsc separado consta no pacote.
Snapshot inclui harness v1 usado pelos 43 testes e harness v2. Rodar somente configurações deste card; suites históricas gerais contra homologação estão fora do escopo.
