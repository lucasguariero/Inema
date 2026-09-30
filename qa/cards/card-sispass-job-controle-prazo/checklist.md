# Checklist de QA — SISPASS: Job de Controle de Prazo para Nova Homologação

## 1. Identificação do Card
- **Título**: SISPASS: Job de Controle de Prazo para Nova Homologação
- **Módulo**: SISPASS / Jobs em Segundo Plano
- **Tipo**: Backend / Job Automático de Controle Temporal

---

## 2. Objetivo & Descrição
Implementar Job executado periodicamente responsável por controlar o prazo de 30 dias corridos para que usuários com perfil SISPASS na situação **Pendente** (por alteração cadastral) solicitem nova homologação. Caso expire o prazo sem solicitação, realizar o tratamento automático.

---

## 3. Regras de Negócio Chave
- [ ] **Elegibilidade**: Apenas perfis na situação \Pendente\ com data limite definida.
- [ ] **Prazo de Controle**: 30 dias corridos.
- [ ] **Dentro do Prazo**:
  - Perfil permanece \Pendente\.
  - Continua elegível para próximas execuções.
- [ ] **Prazo Expirado (> 30 dias)**:
  - Perfil Geral: Altera status para \Indeferido\.
  - Perfil Criador Amador: Altera status para \Suspenso\.
  - Registra motivo no histórico de tramitação.
  - Registra data da alteração.
  - Registra log de execução do Job (rastreabilidade).
  - Envia notificação ao usuário.
  - Retira perfil da elegibilidade para próximas execuções.
- [ ] **Ação do Usuário dentro do Prazo**:
  - Ao solicitar nova homologação, status muda para \Aguardando Análise\ (via fluxo de solicitação).
  - Perfil deixa de ser elegível para o Job.
- [ ] **Resiliência e Tolerância a Falhas**:
  - Falha em um perfil não interrompe processamento dos demais.
  - Registro de erro com identificação do perfil.
  - Permite reprocessamento posterior.

---

## 4. Cenários de Teste Mapeados
- [ ] **CT01 — Perfil Pendente dentro do prazo**: Permanece \Pendente\ e elegível.
- [ ] **CT02 — Perfil Geral com prazo expirado**: Altera para \Indeferido\ + motivo + data + notificação.
- [ ] **CT03 — Perfil Criador Amador com prazo expirado**: Altera para \Suspenso\ + motivo + data + notificação.
- [ ] **CT04 — Histórico de Tramitação**: Validação do registro do motivo nas tramitações.
- [ ] **CT05 — Data de Alteração**: Validação da data gravada no status/histórico.
- [ ] **CT06 — Solicitação dentro do prazo**: Usuário solicita nova homologação -> status vira \Aguardando Análise\.
- [ ] **CT07 — Perfil fora do Job após solicitação**: \Aguardando Análise\ não é processado pelo Job.
- [ ] **CT08 — Perfis não elegíveis ignorados**: Perfis ativos, indeferidos ou suspensos não são alterados.
- [ ] **CT09 — Isolamento de falha**: Falha individual não aborta lote.
- [ ] **CT10 — Reprocessamento de registro com falha**: Elegível em execução posterior.

---

## 5. Fora do Escopo Desta Entrega
- Fluxo de alteração para \Aguardando Análise\ (pertence ao fluxo de solicitação).
- Telas de acompanhamento manual do Job.
- Identificação de alterações cadastrais (gatilho de entrada).
