# Checklist de Homologação — Administração ANSLA: Configuração do Tipo de Atividade x Tramitação

> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Módulo**: Administração › Tipos de Atividade Não Sujeita a Licenciamento Ambiental  
> **Data**: 2026-09-10  
> **Líder de QA**: Lucas Guariero  
> **Status**: ✅ **APROVADO / HOMOLOGADO (100% PASS)**

---

## 📋 Matriz de Testes Executada

### Bloco 1: Fidelidade Visual ao Protótipo Figma (Telas TL001 a TL005)
- [x] **1.1** Listagem de Tipos de Atividade (`TL001`): Colunas `Código`, `Descrição`, `Categoria de Caracterização`, `Situação` e `Ações` (Visualizar / Editar). Botão `Novo Tipo de Atividade` posicionado no topo.
- [x] **1.2** Estrutura de Abas do Cadastro / Edição:
  - Aba 1: `Criar Atividade` (Código, Nome, Categoria de Caracterização, Situação Ativo/Inativo);
  - Aba 2: `Criar Instruções` (Editor de texto com formatação);
  - Aba 3: `Documentos e Estudos` (Vinculação de documentos exigidos);
  - Aba 4: `Setor` (Repeater de setores com Ordem de Análise e Ações).

### Bloco 2: Regra de Congelamento de Configuração (Processos em Trâmite)
- [x] **2.1** Bloqueio de alteração em Código e Nome para atividades com processos em andamento:
  - Mensagem validada: *"Não é possível alterar: esta atividade já possui solicitações em trâmite ou concluídas, que exibem o código e o nome registrados na abertura do processo."*
- [x] **2.2** Aviso explícito de congelamento na aba Setor:
  - Mensagem validada: *"Esta atividade já possui solicitações em trâmite ou concluídas. As alterações feitas aqui valem apenas para solicitações enviadas a partir de agora: processos já em tramitação mantêm a configuração vigente no momento em que foram enviados."*

### Bloco 3: Ordem de Análise e Tramitação entre Setores
- [x] **3.1** Ordem de Análise estritamente sequencial: cada setor ocupa uma posição ordinal na fila (1, 2, 3...) determinando o fluxo sequencial (RG008 e RG010).
- [x] **3.2** Pauta de análise: encaminhamento inicial automático para o primeiro setor da ordem e avanço sequencial conforme conclusão técnica.
