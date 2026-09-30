# Checklist de Homologação — Card 12: Certidão de Débito Ambiental – Análise da Solicitação (TL003 / TL004 / TL005)

## 📌 Contexto do Teste
- **Ambiente**: https://gla-inema-hml.acto.com.br/
- **Módulos / Rotas**:
  - `Análise › Pauta Técnico` (`/pauta-tecnica-certidao-debito`)
  - `Análise › Pauta da Área` (`/pauta-certidao-debito`)
- **Telas Inspecionadas**:
  - `TL002` — Pauta da Área de Certidão de Débito Ambiental
  - `TL003` — Analisar Solicitação de Certidão (Aba Análise & Dados do Requerente)
  - `TL004` — Modal de Adicionar/Gerenciar Pendências
  - `TL005` — Aba de Resumo e Conclusão da Análise (Negativa / Positiva com Efeito Negativo / Positiva)

---

## 🎯 Itens Validados

### 1. Pauta Técnico & Permissões (TL003 / RG001 / RG002)
- [x] Acesso à Pauta Técnico em `/pauta-tecnica-certidao-debito` com perfil de Técnico e bypass administrativo concedido a Admin e Gestor.
- [x] Grid de processos exibindo colunas: `Nº Processo`, `Data Entrada`, `Requerente`, `Status` e menu de ações.
- [x] Tratamento de empty state ("Sem registros") quando não há processos pendentes de análise na fila.
- [x] Transição de processos retidos da Pauta da Área (`/pauta-certidao-debito`) para a Pauta individual do Técnico.

### 2. Tela de Análise da Solicitação & Dados do Requerente (TL003 / RG003 / RG004)
- [x] Visualização em somente leitura dos dados cadastrais do requerente (CPF/CNPJ, Razão Social, E-mail, Telefone e Endereço).
- [x] Identificação das abas estruturadas: "Análise" e "Resumo".
- [x] Disponibilização do botão "Devolver para a Pauta Geral" com confirmação (RG006).
- [x] Disponibilização do botão "Download do Processo" (RG010 / TL002 C008).

### 3. Modal de Gestão de Pendências (TL004 / RG008 / MSG003)
- [x] Abertura do modal "Adicionar Pendência" ao acionar a respectiva ação na aba de Análise.
- [x] Campos obrigatórios presentes: Número do Processo, Origem da Pendência, Indicador de Dívida Ativa (Sim / Não) e Valor Inicial (R$).
- [x] Validação de campos obrigatórios e persistência da pendência com mensagem de sucesso (MSG003).
- [x] Inclusão e listagem da pendência na grid de Pendências Vinculadas, com suporte a edição e exclusão.

### 4. Aba de Resumo, Conclusão e Finalização (TL005 / RG009 / MSG004)
- [x] Cálculo automático da Conclusão da Análise no painel de Resumo:
  - Sem pendências vinculadas: conclui como **Certidão Negativa**.
  - Com pendência e Dívida Ativa = Não: conclui como **Certidão Positiva com Efeito Negativo**.
  - Com pendência e Dívida Ativa = Sim: conclui como **Certidão Positiva**.
- [x] Ação de "Visualizar Certidão" gerando a prévia em PDF correspondente ao resultado apurado.
- [x] Ação "Finalizar" gravando a análise com emissão da confirmação (MSG004) e encaminhamento do processo para a fase de coordenação.

---

## 🏁 Veredito Final
- **Status**: ✅ **100% APROVADO**
- **Divergências ou Bloqueios**: Nenhum.
