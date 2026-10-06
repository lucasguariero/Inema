# QA visual — DOR011 v2
Light Mode, viewports nativos 1920×1080, 3840×2160 e 390×844. Capturas de viewport, não fotografias redimensionadas nem screenshots fullPage. Imagens não editadas.
Revisão manual de 8 capturas locais e confirmação publicada: tipografia, densidade, scroll, fonte documental, foco, estados desabilitados, modais e colunas. Sem alteração de espaçamento, paleta, CSS ou arquitetura externa.

## Evidências selecionadas (05_evidencias)
- Print 01 — FullHD pauta final: lista e semáforo (C003/C004), oito guias, quatro filtros fechados. Paginação pode ficar abaixo da dobra: rolagem vertical normal.
- Print 08 — 4K pauta final: mesmos componentes/layout, área ampliada sem mudança de tokens.
- Print 10 — Estreita pauta final: 390px, tabela com rolagem interna (C090–093).
- Print 04 — Duplicidades preservam selecao: TL005 após abrir candidato e voltar; seleção preservada.
- Print 25 — TL005 selecao e contexto pagina 2: fixture de estresse com 22 candidatos; conteúdo rolável. Rodapé acessível funcionalmente, não todos os controles cabem na mesma captura.
- Print 22 — TL011 anexos e fontes FullHD: documentos relacionados, anexos comuns e estruturados, URL blob do upload, GeoBahia desabilitado (RN036/054).
- Print 27 — TL011 4K anexos: modal mantém densidade e largura oficial, não vira dashboard.
- Print 24 — Configurador colunas condicionais: obrigatório desabilitado, opcionais editáveis.
- Print 26 — Filtros e datas invalidas preservam resultado: mensagem sem executar consulta inválida.
- Print 28 — Modal estreito e foco: motivo Outros, campos existentes e foco verde.
- Print 14 — AC vazia no escopo exclusivo: guia clicável sem dados inventados.
- Print 15 — Consulta sem resultados: total zero e critérios preservados (RN051).
- Print 29 — Producao TL011 FullHD: confirma o código publicado.
- Print 30 — Producao TL011 390px rodape: conteúdo rolado até anexos/rodapé e botão de integração desabilitado.

## Avaliação
Reuso Dense UI preservado; sem KPI, card decorativo, ícone em heading, gradiente ou foco azul genérico introduzido. Estados de perigo/warning são semânticos, não decoração.
390px exige rolagem vertical dos modais e horizontal interna da tabela. O teste verifica que documentElement.scrollWidth não excede a viewport. Isso não afirma que uma lista larga caiba sem scroll.
Detector impeccable: saída [] na varredura dos três componentes modificados. Não substitui revisão manual/acessibilidade integral.
Testes não atribuem nota UX ou homologação. Falhas iniciais foram corrigidas; logs históricos permanecem. O print do heading duplicado está em 06_logs/diagnosticos/Falha 45.png; screenshots/traces temporários do Playwright foram substituídos pelas execuções seguintes.
