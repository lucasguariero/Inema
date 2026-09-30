# Protocolo de Homologação GLA

Este arquivo é a memória operacional das baterias de teste. Deve ser atualizado antes, durante e depois de cada lote.

## Entrada de uma bateria

1. Registrar em `qa/STATUS-BATERIA-ATUAL.md` todos os cards recebidos, a ordem, os perfis envolvidos, as dependências e o estado inicial.
2. Ler integralmente cada card e separar objetivo, permissões, pré-condições, dados parametrizados, cenários e mensagens esperadas.
3. Não reprovar por tela ausente antes de conferir, com ADMIN, permissões, feature flags, menus equivalentes e dependências do fluxo.
4. Preparar previamente dados de teste, arquivos e parametrizações necessárias.

## Execução em cascata

1. Validar permissões do perfil correto no ADMIN.
2. Criar ou ajustar somente dados de teste necessários.
3. Executar o fluxo positivo completo como usuário real.
4. Executar os cenários negativos e de contraste previstos no card.
5. Quando um card depender de outro, gerar primeiro o estado exigido e continuar o fluxo sem declarar falha prematuramente.
6. Registrar imediatamente no status: ponto alcançado, dados criados, mensagens observadas, pendência e próxima ação.
7. Continuar para o card seguinte sem encerrar a tarefa, exceto quando uma confirmação obrigatória de segurança for exigida.

## Critério do parecer

- Aprovado: todos os cenários relevantes foram concluídos. Comentário curto, sem anexo desnecessário.
- Parcial: parte passou e parte falhou ou ficou objetivamente bloqueada. Comentário curto explicando o ponto e um print do erro.
- Reprovado: requisito central não funciona apó validar permissões e pré-condições. Comentário curto e um print do erro.
- Não testado: nunca converter em reprovação. Explicar o dado ou confirmação que falta.

## Evidências

- Zero prints para aprovação limpa.
- Um print por divergência, salvo em `qa/cards/<card>/prints/`.
- `anexos.zip` contém somente os prints que comprovam falhas.
- O comentário do card fica em `comentario-card.txt`; o checklist interno nunca é anexado.

## Continuidade

- A tarefa permanece em andamento até todos os cards terem um parecer sustentado por teste.
- Antes de terminar qualquer turno, atualizar `qa/STATUS-BATERIA-ATUAL.md` com o último ponto confirmado e a próxima ação exata.
- Ao retomar, ler primeiro esse status e continuar do ponto registrado, sem reiniciar nem depender da memória da conversa.
