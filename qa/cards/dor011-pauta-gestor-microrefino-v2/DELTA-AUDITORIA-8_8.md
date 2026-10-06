# Delta da auditoria 8,8 — DOR011 v2
Não atribui nova nota nem homologação.

## D11-R2-01 → PARCIAL
Antes: TL011 considerava registro e documentos relacionados, mas arquivos RN036 não contribuíam coerentemente.
Alteração: anexo comum listado sem coordenada; documento estruturado simulado pode fornecer referência; origem e fonte explícitas, visualização conforme disponibilidade.
Evidência: M01/M02/M11/P01; Prints 22/27/29/30; pautaGestor.ts:271 e PautaRegistroDialog.tsx:82.
Resolvido no contrato local de anexos. Permanece PARCIAL no requisito integral: sem parsing/storage/documento real/GeoBahia.

## Ressalva de identificação — D11-R2-02 a D11-R2-11
O texto recebido traz a definição nominal de D11-R2-01, mas não os textos originais dos outros dez achados. Os IDs abaixo ficam NÃO VERIFICADOS quanto à associação com o relatório externo. NÃO são inventadas descrições originais do auditor. Os eixos do pedido foram executados e são registrados separadamente:

| ID solicitado | Status da associação | Eixo interno avaliado (não título original do achado) | Antes → mudança / evidência / limitação |
|---|---|---|---|
| D11-R2-02 | NÃO VERIFICADO | Hierarquia TL011 | Heading duplicado/sem anexos → Referência principal e seções compactas; Prints 22/27; integração parcial |
| D11-R2-03 | NÃO VERIFICADO | C001–C093 | Muitos C sem revisão individual → 93 revisados; matriz: 49 atendidos/37 parciais/3 não atendidos/4 bloqueados; não é 93 PASS |
| D11-R2-04 | NÃO VERIFICADO | MSG/LEG/BOT | Rótulos divergentes e condições pouco rastreadas → 4 rótulos corrigidos, 34 constantes literais, condição paginação; M06/M08/M12; legendas/erros externos permanecem |
| D11-R2-05 | NÃO VERIFICADO | Duplicidades | Evidência parcial do ciclo → M07 ciclo completo e negativo v1; seleção/contexto; backend/processos externos pendentes |
| D11-R2-06 | NÃO VERIFICADO | Colunas | Cobertura pontual → 8 guias, JSON aplicáveis/oferecidas/obrigatórias; M06; RA/AC sem dados |
| D11-R2-07 | NÃO VERIFICADO | Escopo negativo | Cobertura anterior limitada → M03/M04/M05: DIFIS/OUTRO/allowlist, catálogos e escrita direta; ACL corporativa ausente |
| D11-R2-08 | NÃO VERIFICADO | Ações negativas | Política existente → DENY por regra/permissão/escopo/status/relação e ALLOW explícito; M03; RN047 definitiva não entregue |
| D11-R2-09 | NÃO VERIFICADO | Select | Smoke restrito → M09/M10 quatro consumidores, bug Escape corrigido; P02; no-op mock consumidor SEIA preservado |
| D11-R2-10 | NÃO VERIFICADO | QA visual | Prints anteriores → FullHD/4K/390, contexto/overflow/foco; relatório visual e capturas; sem redesign |
| D11-R2-11 | NÃO VERIFICADO | Gates/pacote/segurança | Evidência dispersa → 48+43+24+12+3, logs reais/ZIP/matriz; lint NV, 1 HIGH preexistente, integrações ausentes |

Confrontar esta associação com a lista original da segunda auditoria quando disponível. NÃO VERIFICADO aqui não altera automaticamente os status dos 268 requisitos na matriz; são conjuntos de IDs diferentes.
