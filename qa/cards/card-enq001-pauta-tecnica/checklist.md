# Checklist Interno — Card 10: ENQ001 – Pauta Técnica de Enquadramento e Históricos (spec 048)

> **Ambiente**: Homologação GLA Inema (`https://gla-inema-hml.acto.com.br/`)  
> **Perfil Testado**: Admin / Técnico ATEND (`00000000000`)  
> **Data**: 11/09/2026  
> **Resultado**: ✅ 100% APROVADO (PASS)

---

## 1. Listagem da Pauta Técnica (TL003)
- [x] Rota acessada: `/pauta-tecnica-enquadramento`.
- [x] Abas de status por situação: `Todos`, `Aguardando`, `Em Análise`, `Pendências` ativas e filtrando corretamente.
- [x] Colunas da tabela: `Requerimento`, `Data Abertura`, `Requerente`, `Empreendimento`, `Atos`, `Situação` e `Ações`.
- [x] Preferências e controle de colunas da grid persistidos por usuário.
- [x] Ação de Visualização direta sem alteração de status ou atribuição indevida.

## 2. Menu de Ações "Outros" (C099–C106)
- [x] `Continuar Análise`: link funcional direcionando para `/pauta-tecnica-enquadramento/16/efetuar-enquadramento`.
- [x] `Tramitar Requerimento`: modal com aviso de persistência automática dos dados analisados, campo obrigatório de `Técnico de destino*` e campo de `Justificativa*`.
- [x] `Devolver Requerimento`: modal de confirmação com mensagem explícita de retorno para a Pauta da Área e registro no histórico.
- [x] `Cancelar Requerimento`: modal com campo obrigatório de `Justificativa*` e bloqueio de cancelamento para requerimentos já formados.

## 3. Modal de Histórico de Tramitações e Notificações (TL003 / TL004)
- [x] Cabeçalho expandido com todos os metadados:
  - `CPF/CNPJ`: 19762424018
  - `Nome/Razão Social`: caick teste externo
  - `Empreendimento`: teste ex
  - `Nº Requerimento`: 2026.011.000011/INEMA/TS0002
  - `CEFIR/CAR`: `-`
  - `Atos Vinculados`: `-`
- [x] Aba `Histórico de Tramitação`: timeline com registros ordenados por data/hora (ex.: Retenção em 11/09/2026 00:58 e Mudança de Status).
- [x] Aba `Histórico de Notificação`: integrada e pronta para apresentação das comunicações enviadas.
