# Pacote de auditoria independente — DOR011 Refino v1

Comece pelo PDF original em 01_requisitos e pela matriz em 03_relatorios. A fonte de verdade é o PDF, não os testes nem a autoavaliação. O arquivo chama DOR011; o rodapé do documento diz DOR010. Essa divergência foi preservada e registrada.

02_codigo/projeto é um snapshot do Git final com fontes, assets, Design System existente, dados, arquivos de build/configuração e scripts de QA desta rodada. Não contém node_modules, .env, histórico .git, credenciais Vercel nem alterações particulares preexistentes do usuário. O patch compara somente commits desta rodada; os arquivos alterados estão listados separadamente. Não aplicar patch sobre o snapshot final; ele já contém as alterações.

Para reproduzir, entre em 02_codigo/projeto, execute npm ci e npm run dev -- --host 127.0.0.1. Com Chrome disponível e o servidor em localhost:3000, execute somente:

```
npx tsc --noEmit
npm run build
node qa/cards/dor011-pauta-gestor-refino/qa-legacy.cjs
npx playwright test --config qa/cards/dor011-pauta-gestor-refino/playwright.config.cjs
```

Não executar npm test indiscriminadamente no repositório original: existem suites históricas contra homologação que fazem cadastros e operações fora deste escopo. Os testes enviados são limitados a este protótipo; as importações de /src das regras e o harness exigem o servidor Vite de desenvolvimento. A validação UI de produção usa PAUTA_PRODUCTION=1 e PAUTA_URL para pular essas importações locais.

Lint não está configurado: npm run lint retorna exit 1, não “zero erros”. Há vulnerabilidade alta preexistente source-map-js e aviso de chunk grande. Ver logs reais em 05_logs, incluindo falhas iniciais. Há 48 verificações antigas adaptadas + 43 novos testes, com sobreposição; não são 91 requisitos homologados.

Audite requisitos, campos, regras, ações negativas, contexto, keyboard/ARIA e estados visuais. Classifique cada ponto como ATENDIDO, PARCIAL, NÃO ATENDIDO, BLOQUEADO ou NÃO VERIFICADO. Diferencie comportamento em memória, integrações não implementadas e definições externas ausentes. Placeholder, toast e mock não comprovam atendimento integral. Não atribua automaticamente nota ou homologação.

Confira especialmente escopo OUTRO, 417 municípios, TL005 autorizado/negado/retorno, TL011 documental, colunas contextuais, deny-by-default, ordenação, filtros inaplicáveis, SLA nos limites, operações atômicas locais e Select por teclado. A matriz identifica também os campos C001–C093 não verificados individualmente. Confirme-os contra o PDF; o teste de um container não aprova todos os campos.

MANIFESTO-SHA256.json permite verificar cada entrada do pacote. VALIDACAO-PACOTE.json registra a integridade do ZIP, dimensões das capturas, contagens de testes e hashes. O anexo resumido de seis capturas Full HD é opcional e não substitui este pacote completo.
