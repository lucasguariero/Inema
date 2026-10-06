# QA visual — DOR011 Refino v1

## Inspeção

Capturas nativas com deviceScaleFactor 1: 1920x1080, 3840x2160 e 390x844. Inspeção humana do agente sobre imagens reais, com passe batelado e confirmação final, conforme impeccable. Não houve redesign para aproveitar a rodada.

Shell legado verde #0F4C3A preservado. Densidade h-9/h-8, tabela compacta, títulos sem ícones decorativos novos, foco verde por tokens, modais compactos e estados disabled. Catálogo usa busca/scroll interno. Nome longo de arquivo quebra dentro da célula e tem title. Tabela estreita mantém scroll interno sem expandir o documento.

## Prints da nova bateria

| Print | Tamanho | O que mostra |
|---|---|---|
| 01 | Full HD | Layout final, 8 guias, 4 grupos recolhidos, Ordenar e semáforo |
| 02 | Full HD | Busca municipal inexistente, sem menu impraticável |
| 03 | Full HD | Leitura de candidato autorizado |
| 04 | Full HD | Retorno com seleção de duplicidade preservada |
| 05 | Full HD | TL011 com fontes e documentos; integração pendente |
| 06 | Full HD | Colunas em RT sem Denunciante/Comunicante |
| 07 | Full HD | Nome longo de arquivo e remoção da seleção pendente |
| 08 | 4K | Pauta completa em alta resolução |
| 09 | 4K | Catálogo completo, busca e foco no Select |
| 10 | 390x844 | Pauta sem overflow do documento |
| 11 | 390x844 | Modal de arquivamento sem corte do viewport |

Prints 14–21 foram regenerados pela bateria anterior: AC vazia, consulta vazia, justificativa desanexar, histórico, upload, GeoBahia pendente, operações bloqueadas e tela estreita. Não são capturas históricas antigas reutilizadas. Full HD não elimina scroll vertical existente; tabela continua rolável, sem mudar layout.

## Limites da auditoria visual

Sem aparência nova azul/roxa/gradiente no escopo editado. Neutros slate e componentes institucionais existentes foram preservados. Detector de código executado uma vez, saída arquivada em detector.log; não equivale a certificação de acessibilidade. Não foi realizado teste com leitor de tela ou matriz completa de contraste WCAG. Dark mode não está nesta rodada; validação é Light Mode. A mudança compartilhada de teclado tem regressão específica descrita no relatório de regressões.
