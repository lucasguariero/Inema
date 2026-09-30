# Checklist de Homologação — Card 07: ENQ001 — Análise das Etapas do Requerimento e Tratamento de Pendências (Spec 049)

## 📌 Contexto do Teste
- **Ambiente**: https://gla-inema-hml.acto.com.br/
- **Módulo**: Pauta da Área → Pauta Técnica → Efetuar Enquadramento
- **Requerimento Validado**: `2026.011.000011/INEMA/TS0002` (Requerente: caick teste externo, CPF: 19762424018, Empreendimento: teste ex)
- **Telas Inspecionadas**: TL005 (Identificação), TL006 (Tipo de Solicitação), TL007 (Localização), TL008 (Questionário), Modal C270 (Reprovar Etapa)

---

## 🎯 Itens Validados

### 1. Pauta da Área e Retenção para Análise
- [x] Requerimento listado em `Pauta da Área — Enquadramento` com status "Aguardando Enquadramento".
- [x] Ação "Reter Requerimento" disponível no menu Outros.
- [x] Modal de confirmação: *"Deseja reter o requerimento 2026.011.000011/INEMA/TS0002 para a sua pauta? O requerimento será movido para sua Pauta Técnica e associado ao seu usuário."*.
- [x] Sucesso da retenção com notificação toast e vinculação do requerimento ao técnico analista.

### 2. Acesso à Pauta Técnica e Início do Enquadramento
- [x] Ação "Efetuar Enquadramento" liberada na Pauta Técnica após a retenção.
- [x] Transição de status automática e notificação: *"O enquadramento do requerimento 2026.011.000011/INEMA/TS0002 foi iniciado."*.
- [x] Bloqueio de edição paralela pelo usuário externo garantido.

### 3. Cabeçalho Fixo Informativo (C144–C153)
- [x] Nº Requerimento exibido: `2026.011.000011/INEMA/TS0002`.
- [x] Nº Processo exibido como "Não formado" (conforme regra de pré-formação processual).
- [x] CPF/CNPJ, Nome/Razão Social, Empreendimento e Município devidamente apresentados.
- [x] Botão "Histórico de Tramitações" presente e funcional, abrindo modal com log cronológico de eventos.

### 4. Etapa 01 — Identificação (TL005)
- [x] Perfil "Quem sou eu?" exibido em modo somente-leitura (Requerente).
- [x] Dados do Representado e Contato para Solicitação apresentados.
- [x] Seção "Análise das Informações" com botões "Aprovar" e "Reprovar".
- [x] Acionamento de "Aprovar": atualiza o veredito da etapa para "Aprovada" com sucesso.
- [x] Acionamento de "Reprovar": abre modal "Reprovar Etapa — Identificação" com listagem dos itens específicos (Perfil, Dados do Representado, Contato) com checkboxes e justificativa individual.

### 5. Etapa 02 — Tipo de Solicitação (TL006)
- [x] Tipo de solicitação preenchido exibido em modo somente-leitura ("Atos Administrativos Ambientais").
- [x] Seção de análise com botões Aprovar e Reprovar disponíveis.

### 6. Etapa 03 — Localização (TL007)
- [x] Tipo de vínculo exibido ("urbano"), dados do empreendimento e endereço estruturado.
- [x] Seção de documentos vinculados em modo somente leitura para visualização e download (sem aprovação/reprovação precoce nesta fase, reservada ao CARD 4 pós-pagamento).
- [x] Regra de negócio confirmada: pendências de dados de localização são direcionadas ao Cadastro do Empreendimento vinculado.

### 7. Etapa 04 — Questionário (TL008)
- [x] Perguntas e respostas do requerente carregadas dinamicamente conforme fluxo original preenchido.
- [x] Seção de análise com botões Aprovar e Reprovar por item específico do questionário.

---

## 🏁 Veredito Final
- **Status**: ✅ **100% APROVADO**
- **Divergências ou Bloqueios**: Nenhum.
