# Pacote de reauditoria DOR011 — Refino v2
A fonte de verdade é o PDF em 01_requisitos. Inicie por ele, pela matriz em 03_matriz e por LIMITACOES-E-BLOQUEIOS. Não inferir integração ou homologação a partir de um mock que passa.

Estrutura: 01_requisitos original; 02_codigo commit-final.json/patch/arquivos alterados/snapshot; 03_matriz; 04_relatorios; 05_evidencias selecionadas; 06_logs stdout/stderr e resultados. MANIFESTO-SHA256 permite conferir conteúdo. VALIDACAO-PACOTE.json registra CRC, dimensões, PDF e contagens. Hash do ZIP fica fora do ZIP.

## Reprodução
Entre em 02_codigo/projeto, use Node/npm e Chrome compatíveis. Instale dependências com npm ci. Inicie npm run dev -- --host 127.0.0.1 (porta 3000). Em outro terminal:
```
npx tsc --noEmit
npm run build
node qa/cards/dor011-pauta-gestor-microrefino-v2/qa-legacy.cjs
npx playwright test --config qa/cards/dor011-pauta-gestor-microrefino-v2/playwright.config.cjs
npx playwright test --config qa/cards/dor011-pauta-gestor-microrefino-v2/playwright-micro.config.cjs
```
Importações /src e harness exigem Vite de desenvolvimento. O harness v1 importado pelos 43 testes também está no snapshot. Os harnesses não são rotas de produção.
P01–P03 validam o domínio principal e o bundle publicado nesta rodada; uma publicação futura pode alterar esse bundle e falhar corretamente na comparação. URL congelada/commit no metadata.
NÃO executar npm test geral: o repositório contém suites antigas com operações contra homologação fora desta autorização.
Lint NÃO VERIFICADO/script ausente; source-map-js HIGH preexistente; build avisa chunk grande.

## Para o auditor
Reaudite C001–C093, RN/MSG/LEG/BOT, condições e escopo negativo contra o PDF. Distinguir ausência comprovada, contrato mock, integração e bloqueio. Não tratar literalidade como execução.
D11-R2-02…11 não receberam descrição original; a associação no delta é explicitamente não verificada. Verifique-a com o relatório externo, sem supor mapeamento.
O patch compara v1 ff91135 com o commit final; snapshot já está aplicado. Não reaplicar patch no snapshot. Credenciais/.env/.git/.vercel/node_modules e arquivos particulares não incluídos.
