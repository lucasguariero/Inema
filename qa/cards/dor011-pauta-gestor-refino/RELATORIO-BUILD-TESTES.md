# Build e testes — evidência real

Logs em 05_logs do ZIP, com comando, início/fim, saída, erro e exitCode. Versões são as do package-lock.json; não houve atualização de dependências.

| Comando | Resultado final | Arquivo |
|---|---|---|
| npm ci | exit 0 no retry; 145 pacotes instalados | npm-ci-retry.log/json |
| npx tsc --noEmit | exit 0, zero diagnósticos | tsc-final.log/json |
| npm run lint | exit 1: Missing script lint | lint.log/json |
| npm run build | exit 0, zero erros Vite | build-final.log/json |
| node qa/cards/dor011-pauta-gestor-refino/qa-legacy.cjs | 48/48, exit 0 | legado-final.log/json e resultado-qa.json |
| npx playwright test --config qa/cards/dor011-pauta-gestor-refino/playwright.config.cjs | 43/43, exit 0 | playwright-final.log/json e playwright-resultados.json |
| npm audit --json | exit 1: source-map-js, uma vulnerabilidade alta | audit.log/json |
| Detector impeccable (arquivos UI alterados) | exit 0; nenhuma saída reportada | detector.log/json |

Não declarar “lint 0 erros”: lint não está configurado. Não se adicionou uma ferramenta/configuração nova a todo o repositório nesta rodada. Essa validação fica NÃO VERIFICADA por configuração ausente.

Primeiro npm ci falhou EPERM por biblioteca nativa do Vite em uso. O servidor local desta tarefa foi encerrado, a instalação repetida com êxito e o servidor reiniciado. Ambos logs foram preservados.

Build avisa chunk >500kB (JS aproximadamente 2,53 MB). npm audit registra source-map-js <1.2.2 / [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). Ambas condições existiam na base desta rodada; não houve correção de dependência fora do escopo.

Playwright inicial 39/43; logs e traces de diagnóstico preservados em subpasta de logs. Playwright final 43/43. Não foram ocultadas as falhas iniciais nem somadas rodadas repetidas para inflar resultados.

Build local/tsc não confirmam deploy. Logs de push/deploy/produção e identificação do commit são entregues separadamente no mesmo pacote.
