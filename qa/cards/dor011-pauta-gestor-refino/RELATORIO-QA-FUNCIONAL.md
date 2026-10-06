# QA funcional — DOR011 Refino v1

Ambiente: protótipo local, Chrome headless, dados exclusivamente simulados. GLA homologação não foi alterado. Rota: /?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor.

## Resultado real

- Bateria anterior adaptada ao contrato revisado do PDF: 48/48 verificações (35 regras puras + cenário agregador + 12 fluxos UI), zero pageerror.
- Nova bateria Playwright: 43/43 testes (26 testes de regras e 17 cenários UI/teclado/visual/rotas).
- Não somar esses números como requisitos independentes homologados: há sobreposição, e todos os dados são mock.
- Primeira bateria nova: 39/43. Os quatro problemas eram expectativa de 2 em vez de 3 registros Salvador, texto de fixture diferente, comparação de innerText com textContent, e tentativa de clicar no input sr-only em vez do rótulo do rádio. Corrigidos os testes, não os requisitos, preservando logs/diagnósticos.

## Dez achados obrigatórios

| Achado | Contraste executado | Evidência |
|---|---|---|
| Escopo diferente de DIFIS | OUTRO retorna 3, DIFIS 13; sessão negada zero | Regras escopo + UI Sessão OUTRO |
| Municípios completos | 417 códigos únicos, Abaíra/Jaguaquara/Xique-Xique, acento/sem acento/inexistente | Município + Print 02/09 |
| Candidato autorizado | Abrir candidato e voltar mantendo rádio | TL005 + Print 03/04 |
| Candidato negado | Allowlist só do registro atual oculta todos os candidatos; itemAutorizado nega abrir | TL005 negado + regra candidato negado |
| Contexto documental | RAE/RFA identificados, abrir conteúdo simulado e voltar | TL011 + Print 05 |
| Colunas por guia | RE sem Eixo, RT sem Den/Com; OF libera Dups sem relação | TL010 + Print 06 |
| Matriz de ações | Sem regra/permissão/type/status/relação nega; desconhecidas bloqueadas | 3 regras matriz + Print 20 |
| Teclado no Select | Tab/Shift+Tab, Enter/Space, Escape, setas, Home/End e ARIA | 2 casos Select teclado |
| Ordenação persistente | Mais antigos mantém página/filtro/modal | Ordenação preservada |
| Filtro inaplicável | RE com emergência Outros para RD volta a 4 dados; RE retorna filtro limpo | Troca RE para RD |

## Operações locais e falhas

Anexação com referência antiga, confirmação, cancelamento, clique duplo, versão divergente e snapshot sem efeito parcial; desanexação exige justificativa e devolve participantes à análise. Arquivamento exige motivo/justificativa/descrição de Outros. Encaminhamento nega destino não listado na sessão. Eixo valida combinação. Comentário preserva status/responsável/data. Arquivos inválidos rejeitam o lote inteiro; permitidos/seleção múltipla/remover pendente/nome longo/vazio testados.

As falhas acima são validações/exceções locais. Não são respostas de backend nem transações reais. Não há simulação de sucesso do serviço PDF/GeoBahia.

## Não executado

Falha real da consulta (MSG002), upload do storage (MSG008), arquivamento remoto (MSG013), desanexação remota (MSG022), PDF (MSG025), GeoBahia (MSG034), matrizes corporativas, persistência, concorrência distribuída e todos os fluxos detalhados de outras rotas. Suites históricas qa/tests contra HML não foram disparadas: contêm cadastros/ações fora deste escopo. A bateria anterior DOR011 foi efetivamente reexecutada por qa-legacy.cjs.

Validação do deploy será arquivada em resultado-producao.json e logs/producao.log; consultar esses arquivos, não presumir sucesso por esta frase.
