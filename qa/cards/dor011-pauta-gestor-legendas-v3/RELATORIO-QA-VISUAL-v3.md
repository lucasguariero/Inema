# QA visual — DOR011 v3

Revisão Light Mode em viewports nativos 1920×1080, 3840×2160 e 390×844. Uma inspeção agrupada de desktop/mobile: filtros, Arquivar com Outros, TL011, configurador e Arquivos; confirmação funcional agrupada, sem ciclo aberto de polimento e sem redesenho.

As imagens são capturas de viewport, não imagem longa redimensionada. No mobile, modais/lista rolam internamente e os prints registram trechos; o topo não precisa permanecer visível no print do rodapé. No FullHD, abrir todos os filtros exige rolagem, comportamento esperado; os quatro continuam recolhidos inicialmente. 4K mantém os mesmos valores de fonte/espaçamento, sem ampliar margens artificialmente.

| Print (nome abreviado) | Comprova |
|---|---|
| 01 FullHD filtros recolhidos; 08 4K; 12 390px | LEG022; estado inicial preservado |
| 02 FullHD filtros; 09 4K; 13 390px | LEG001/003/004/006/007/008/009/012/015, labels próximos, quebra natural |
| 03 FullHD período/classificação; 10 4K; 14 390px | LEG005/010/011/013/014; ações acessíveis por rolagem |
| 04 FullHD Arquivar; 11 4K; 15 390px | LEG017/018/019, Outros, foco verde, footer sem corte |
| 05 FullHD TL011; 12 4K TL011; 16 390px TL011 | LEG024, fontes e anexos preservados, pending separado, disabled neutro no rodapé |
| 17 FullHD TL005 | LEG016, seleção/Visualizar preservados |
| 18 FullHD comentário | LEG020 |
| 19 FullHD configuração | LEG021, colunas obrigatórias preservadas |
| 20 FullHD arquivos | LEG023 junto ao seletor, formatos e tabela existentes |

Os nomes completos (que distinguem os dois Print 12) constam no manifesto do ZIP. Screenshots adicionais dos gates anteriores são preservados na pasta de trabalho; o pacote principal contém seleção representativa, não dezenas de telas repetidas.

Helpers usam 12px/16px e token neutro do DS. Verificados wrapping/overflow dos helpers, documento sem overflow horizontal, rolagem dos modais, foco de Justificativa, disabled real, disponibilidade dos botões de rodapé. Não foi introduzido azul de estado, gradiente, card adicional ou ícone decorativo. O detector executado não retornou saída estruturada; não é usado como prova automática de conformidade. A conclusão visual se apoia nos renders e testes DOM/computed.

Não se declara auditoria WCAG completa, todos os navegadores, todos os leitores de tela nem Dark Mode integral nesta rodada. Os tokens são os existentes; a mudança não altera a paleta global.
