# Reauditoria — DOR011 v3

Auditar contra o PDF original em 01_requisitos, não contra os relatórios como fonte normativa. Snapshot frontend e QA em 02_codigo/projeto, patch v2→v3 e metadata do commit/deployment; matrizes em 03_matriz, relatórios em 04_relatorios, evidências selecionadas em 05_evidencias e logs reais em 06_logs.

Esta rodada implementa as 23 legendas oficiais não conflitantes e reforça somente o disabled GeoBahia. LEG002 e contratos externos permanecem bloqueados/pendentes. 126 A/111 P/12 NA/19 B/0 NV; C93 49 A/37 P/3 NA/4 B/0 NV. Não significa homologação ou implementação integral.

Para testar: npm ci, npm run dev -- --host 127.0.0.1 (porta3000), Chrome; configs específicos do card v3 e qa-legacy.cjs. Não execute suites históricas globais de HML. Novos testes usam transcrição independente da lista LEG do PDF. Confira aplicabilidade positiva/negativa, coluna obrigatória, RA/AC, TL005 retorno e TL011 fontes/pendência, Select Escape nas quatro áreas.

As imagens são viewports nativos; 390px exige rolagem. Os logs registram tentativas iniciais e finais; considere os gates finais e investigue as falhas de infraestrutura documentadas. Compare código publicado com commit final pela lista de fontes/metadata. O manifesto permite conferir cada entrada; PDF original e CRC/hashes são verificados pelo empacotador. Artefatos pessoais/credenciais não são incluídos.

Lint NÃO VERIFICADO (script ausente), HIGH source-map-js preexistente, sem updates. Não atribua integração funcional por helper/MSG/disabled. Atribuição de nota cabe à auditoria independente.
