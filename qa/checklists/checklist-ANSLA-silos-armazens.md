# Checklist de Teste e Homologação — ANSLA: Silos e Armazéns

> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Card**: Rótulos, Navegação e Validações Divergentes do Requisito — Silos e Armazéns  
> **Data**: 2026-09-09  
> **Líder de QA**: Lucas Guariero  
> **Status Geral**: 🟡 Em Fila / Pronto para Execução  
> **Módulo**: Atividades Não Sujeitas a Licenciamento Ambiental (ANSLA)

---

## 📋 Matriz de Teste — 4 Problemas Corrigidos & Validações

### Item 1: Rótulo de Operação (Problema 1)
- [ ] **1.1** Acessar *Atividades Não Sujeitas a Licenciamento Ambiental › Iniciar Cadastro*
- [ ] **1.2** Selecionar atividade *Silos e Armazéns* na etapa *Dados Básicos*, vincular empreendimento e avançar
- [ ] **1.3** Na etapa *Caracterização da Atividade*, seção *Operações desenvolvidas no empreendimento*:
  - Validar que o rótulo exibido é `"Armazém de insumos"` (e **não** `"Aerização de insumos"`) — RG009 / C009

### Item 2: Padronização da Nomenclatura da Funcionalidade (Problema 2)
- [ ] **2.1** Conferir nome no Menu Lateral: `"Atividades Não Sujeitas a Licenciamento Ambiental"`
- [ ] **2.2** Conferir nome na Trilha de Navegação (Breadcrumb)
- [ ] **2.3** Conferir Cabeçalho em novo cadastro: `"Cadastrar Atividade Não Sujeita a Licenciamento Ambiental"`
- [ ] **2.4** Salvar e reabrir via *Meus Processos › Continuar Preenchimento*:
  - Conferir Cabeçalho em edição: `"Editar Atividade Não Sujeita a Licenciamento Ambiental"` (mesmo nome, mudando apenas o verbo)

### Item 3: Obrigatoriedade do CNAE com Seleção Múltipla (Problema 3)
- [ ] **3.1** Na seção CNAE: validar texto de apoio `"Selecione ao menos um CNAE"` (e **não** `"Preenchimento opcional"`)
- [ ] **3.2** Tentar clicar em *Próximo* sem nenhum CNAE selecionado:
  - Validar que o avanço é bloqueado com a mensagem `"Selecione pelo menos um CNAE."` (`MSG002` / RG004)
- [ ] **3.3** Selecionar múltiplos CNAEs da árvore e validar a inserção na tabela de CNAEs selecionados
- [ ] **3.4** Cenário Negativo: iniciar cadastro de *Pesquisa Mineral* ou *Perfuração de Poços* e validar que a seção CNAE não aparece e o cadastro conclui sem ela

### Item 4: Limpeza Dinâmica de Mensagens de Validação (Problema 4 & Código CDA)
- [ ] **4.1** Provocar validações pendentes na *Caracterização da Atividade*:
  - Marcar *Sim* em queima de combustíveis (sem selecionar combustível)
  - Abrir modal de Unidade Armazenadora, deixar *Código CDA* vazio e informar coordenadas fora da Bahia (Lat `-12.5`, Long `-60.0`)
  - Clicar em *Próximo* para disparar as mensagens de erro na tela
- [ ] **4.2** Testar limpeza seletiva em tempo real (sem recarregar a página):
  - Selecionar um combustível: a mensagem do combustível deve sumir imediatamente
  - Preencher o *Código CDA*: a mensagem do código CDA deve sumir imediatamente
  - Corrigir a longitude para `-41.5` (coordenada válida na Bahia): a mensagem de coordenada fora da Bahia deve sumir
  - Validar que a limpeza é seletiva: os campos que continuarem inválidos mantêm suas respectivas mensagens na tela
