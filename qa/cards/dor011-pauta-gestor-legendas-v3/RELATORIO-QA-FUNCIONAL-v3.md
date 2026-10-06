# QA funcional — DOR011 v3

Ambiente local: Chrome headless / Vite, rota `?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor`; dados exclusivamente simulados. Nenhum dado de HML foi criado, alterado ou excluído.

| Gate | Resultado | Evidência |
|---|---|---|
| Verificações existentes | 48/48 PASS, console 0 | resultado-qa.json; logs/verificacoes-48-final.log |
| Regressão anterior | 43/43 PASS | logs/playwright-resultados.json; regressao-43-final.log |
| Microtestes v2 | 24/24 PASS | logs/micro-playwright-resultados.json; micro-testes-final-24.log |
| LEG principal | 39/39 PASS | logs/legendas-resultados.json; legendas-final.log |
| LEG complementar | 5/5 PASS; 1 novo + 4 repetidos | logs/legendas-complementar-resultados.json; legendas-complementar.log |

23 testes individuais (todos exceto LEG002) confrontam texto independente transcrito do PDF, ocorrência única, fonte 12px e ausência de código técnico. Outros testes verificam as oito guias, filtros recolhidos, Setor, permissão verDemandante, motivo Outros, confirmação/candidato sem helper de campo ausente, referência espacial ausente e permissão negada. As instruções oficiais são demonstradas em cada contexto aplicável sem reescrever as regras existentes.

Os quatro consumidores Select foram reexecutados em M10: Fiscalização, Fauna, SEIA V2 e Unidade de Conservação; mouse, teclado, busca, Home/End, Tab, Shift+Tab, foco, fechamento e Escape. Primeiro Escape no Select do modal SEIA V2 não fecha o modal; segundo fecha. Novo Usuário tem seleção de Lotação previamente fixa no mock: teste demonstra valor inicial/fechamento/foco, não persistência de uma edição inexistente. Não se declara regressão global exaustiva.

Primeira tentativa de LEG: servidor local estava desligado; ensaio interrompido e reiniciado após subir Vite. Primeira execução dos 24 microtestes: faltava a cópia da fixture mensagens-pdf.json no novo card; 23 PASS/1 falha de infraestrutura. Fixture copiada sem mudar asserções; suíte completa reexecutada com 24 PASS. Logs iniciais preservados quando disponíveis. Uma chamada complementar com grep contendo espaços não encontrou testes; chamada com grep de uma palavra executou 5 PASS. Nenhuma dessas falhas exigiu mudar os fluxos de produto.

Produção: smoke e testes direcionados com logs próprios; ver PUBLICACAO-E-VALIDACAO-v3.md. Testes não são homologação de backend, serviço documental, autorização corporativa, CAR ou GeoBahia.
