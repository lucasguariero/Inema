# Publicação e validação do deploy — DOR011 Refino v1

Data das execuções: 05/10/2026 no fuso America/Cuiaba; logs em UTC 06/10/2026.

## Versão publicada

- Base anterior: ef2665d40f8ac7301b603d554a2d9649b4cac08d.
- Commit do código publicado: 362e6f1993b1f88ac6fde61b7adef623944aafbb.
- Deployment: dpl_FAj1AMY2nzYXzMbGkXhQmM951FV4, READY.
- Link principal validado: https://inema.acto.com.br/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor
- Link congelado desta rodada: https://inema-15rbqfulv-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor
- Bundle observado no domínio e no HTML autenticado do deployment: /assets/index-BQaBDNaP.js.

O commit posterior de fechamento só acrescenta documentação/evidências e corrige o escape de argumentos do logger de QA no Windows. Não altera src/public/build nem dependências. O hash final de Git e a comparação estão em 02_codigo/commit-final.json. Não confundir esse fechamento documental com um segundo deploy de interface.

## Verificação efetiva

- Push do código e deploy: exit 0; logs push/deploy/deploy-inspect.
- Produção no domínio principal: 12/12 fluxos UI, zero pageerror; resultado-producao.json e producao.log.
- Verificação adicional: heading, ordenação, grid, 417 municípios + Todos, extremos do catálogo, PDF/GeoBahia desabilitados, fontes RAE/RFA e zero pageerror. HTTP 200; producao-detalhada.log e validacao-producao-detalhada.json.
- Ações exercidas no domínio são operações do protótipo em memória, NÃO gravações no GLA ou backend real.
- Link congelado: browser anônimo direcionou ao login Vercel (exclusivo.log). Não houve QA UI anônimo nesse link. Consulta autenticada pela CLI confirmou o mesmo bundle, com --fail e exit 0 (exclusivo-http.log). A proteção pública não foi desativada.
- A CLI oficial criou automaticamente sua credencial de bypass para essa leitura autenticada. Nenhuma credencial foi exportada ao pacote.

## Falhas preservadas sem maquiar resultados

A primeira leitura CLI do URL exclusivo com & foi separada pelo cmd no logger; exit 1. Uma tentativa de escape produziu HTTP 404 com exit 0 do curl (sem --fail); NÃO foi considerada sucesso. A execução final usa caminho sem & e --fail, e confirma o HTML correto. Os logs exclusivo-autenticado/exclusivo-autenticado-retry/exclusivo-http preservam essa sequência. O logger passou a proteger argumentos com metacaracteres; as execuções de build/testes anteriores não continham URLs & na linha de comando (URL de QA era variável de ambiente).

## Capturas e alcance

04_evidencias/local contém 19 PNGs finais do QA local: Full HD, 4K e 390x844.
04_evidencias/producao contém 10 PNGs capturados no domínio publicado: 8 Full HD, 1 4K e 1 estreito. Os Prints 14–21 repetem cenários, mas são execuções distintas, não evidências antigas reaproveitadas.
Print 22 demonstra pauta inicial Full HD; Print 23, pauta com Localização aberta em 4K. Ambos foram inspecionados visualmente.

O checklist registrado antes desta publicação deve ser lido junto deste documento e dos logs. Este relatório complementa os sete relatórios obrigatórios, sem promover pendências corporativas a ATENDIDO.
