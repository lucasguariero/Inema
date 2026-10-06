# Build e quality gates — DOR011 v3

TypeScript (`tsc --noEmit`): exit 0, sem erros. Build (`npm run build`): exit 0, sem erros de compilação, 2742 módulos. Aviso preexistente sobre tamanho de chunk (>500kB), não corrigido por estar fora do escopo. Logs reais registram comando, diretório, início/fim, saída e código de retorno.

Gates: 48/48, 43/43, 24/24; novas LEG 39/39 + complemento 5/5 (40 casos únicos). Smoke de produção registrado separadamente. As suítes anteriores foram copiadas para o card v3 sem relaxar asserções. Harness v1/v2 é reaproveitado e incluído no snapshot; não é código de UI publicado.

Lint: **NÃO VERIFICADO**, script inexistente em package.json. Inspeção registrada em lint-inspecao.json; não instalado nem configurado nesta tarefa.

Segurança: npm audit exit 1, uma vulnerabilidade HIGH transitiva em source-map-js 1.2.1. Ver SEGURANCA-PENDENCIAS-v3.md. package.json/package-lock.json permanecem idênticos à v2. Nenhum update global.

Reprodução: snapshot em 02_codigo/projeto; `npm ci`, servidor Vite em 127.0.0.1:3000, Chrome instalado. Rodar os três configs específicos de Playwright e qa-legacy.cjs do card v3; **não** rodar npm test global, pois contém suites históricas de HML fora do escopo. As 40 LEG podem ser executadas em uma única rodada pelo config de legendas; nesta entrega os logs distinguem principal e complemento. gerar-matriz.py exige Python/pypdf e o caminho do PDF original, ajustável pelo auditor, mantendo checksum.
