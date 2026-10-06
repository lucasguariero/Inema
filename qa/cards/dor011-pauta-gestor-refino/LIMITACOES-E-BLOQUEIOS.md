# Limitações e bloqueios reais

## Bloqueado por definição externa

- PE001: status por tipo; PE002: palavras-chave de duplicidade; PE003: formação de processo.
- RN047: matriz corporativa perfil/tipo/status/relação/situação da pauta. Política presente é exclusivamente mock; ausência de regra nega.
- RN041: modelo oficial, numeração, perfil e fluxo do Ofício.
- RN044: documentos/validações obrigatórias do tipo de destino na conversão.
- RN026: fórmula completa de dias em aberto com pausas/encerramentos/eventos. Classificação dos limites está implementada, fórmula integral não homologada.
- RT/RD em F003 vs F001; RN009 vs LEG002. O próprio PDF p40 registra esses alinhamentos. Não se inventaram novos filtros para resolver RT.
- Nome externo DOR011 e rodapé interno DOR010: original preservado byte a byte; requer confirmação documental, não renomeação arbitrária.

## Integrações não implementadas

- Autenticação/perfis/escopo reais: sessão frontend simulada; servidor deve aplicar a autorização antes de entregar os dados.
- Backend e persistência: registros, relações e histórico em memória; recarregar perde operações/configuração.
- PDF oficial com anexos incorporados: NÃO IMPLEMENTADO; botão bloqueado. Nenhum PDF improvisado por impressão.
- GeoBahia interno/autenticação: NÃO IMPLEMENTADO; contexto documental local é PARCIAL/MOCK, não integração.
- CAR: algoritmo demonstrativo de uma poligonal fixture, não consulta ao cadastro real.
- Upload/storage documental: mock com URLs blob; nenhum envio remoto. Remoção existe apenas para seleção ainda não vinculada; remoção de arquivo armazenado não foi definida/inventada.
- Auditoria de sucessos persistente e falhas: não implementada no servidor.
- RN049/RN050: versão e atomicidade local demonstradas; concorrência distribuída, idempotência de servidor e transação ACID pendentes.
- MSG002/falhas de consulta remota, MSG008/013/022/025/034 de serviço: não implementadas/exercidas como transporte real.

## Validações ainda limitadas

- Lint não configurado: comando real falhou. Não equivale a “lint passou”.
- Vulnerabilidade alta source-map-js e chunk JS >500 kB persistem, ambos preexistentes; não se aplicou atualização global.
- Regressão aprofundada só em consumidores representativos; as demais telas não estão homologadas por esta rodada.
- Leitor de tela, contraste WCAG completo, dark mode e todas as legendas/componentes C individualmente: NÃO VERIFICADOS.

## Classificação

UI/algoritmos corrigidos: IMPLEMENTADOS onde independem de serviço. Operações: MOCK/PARCIAL. Geo/PDF/storage: NÃO IMPLEMENTADOS. Processo/ofício/conversão e catálogo/matriz corporativos: BLOQUEADOS. Mensagens existentes sem fluxo: apenas DECLARADAS, não funcionalidades.

Não há declaração de nota, homologação ou conclusão integral do DOR011. A matriz mostra exatamente o que os testes não autorizam concluir.
