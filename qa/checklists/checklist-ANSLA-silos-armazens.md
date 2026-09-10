# Checklist Master de Homologação — ANSLA: Silos e Armazéns (Feature & Reteste)

> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Card**: Cadastro de Atividade Não Sujeita – Silos e Armazéns (DR001 / DR003 / MR 235 / MR 259)  
> **Data**: 2026-09-09  
> **Líder de QA**: Lucas Guariero  
> **Status Geral**: 🟡 Em Fila / Pronto para Execução  
> **Módulo**: Atividades Não Sujeitas a Licenciamento Ambiental (ANSLA)

---

## 👥 Perfis e Credenciais de Teste

| Perfil | Login / CPF | Senha | Finalidade no Teste |
|---|---|---|---|
| **Requerente / Admin** | `000.000.000-00` ou `992.924.740-81` | Conforme perfil | Iniciar cadastro, preenchimento, edição, conclusão e visualização |

---

## 📋 Matriz Completa de Testes & Reteste de Homologação

### Bloco 1: Padronização de Nomenclatura & Dados Básicos
- [ ] **1.1** Padronização visual: validar que o nome oficial é `"Atividades Não Sujeitas a Licenciamento Ambiental"` no Menu Lateral e no Breadcrumb
- [ ] **1.2** Cabeçalho de criação: `"Cadastrar Atividade Não Sujeita a Licenciamento Ambiental"`
- [ ] **1.3** Selecionar Tipo de Responsável, Tipo de Atividade (*Silos e Armazéns*) e Empreendimento
- [ ] **1.4** Declarações obrigatórias: marcar as 3 declarações e avançar para Caracterização

### Bloco 2: Caracterização da Atividade — Validações, Rótulos e Catálogos
- [ ] **2.1** Responsável Técnico: validar auto-preenchimento de Formação e Registro Profissional
- [ ] **2.2** CNAE Obrigatório (Problema 3):
  - Validar texto de apoio `"Selecione ao menos um CNAE"` (não mais "opcional")
  - Tentar avançar sem CNAE -> bloqueio com `MSG002` (`"Selecione pelo menos um CNAE."`)
  - Selecionar múltiplos CNAEs e validar remoção individual
- [ ] **2.3** Rótulo de Operação (Problema 1):
  - Validar na lista de operações desenvolvidas o item `"Armazém de insumos"` (não mais `"Aerização de insumos"`)
- [ ] **2.4** Combustível & RAF:
  - Marcar queima para secagem = Sim
  - Validar opções de combustível: `GLP`, `Gás Natural`, `Óleo`, `Madeira`, `Outro` (validar que **Lenha** foi removida e **Óleo** está presente)
  - Selecionar *Madeira* -> validar exibição de Certificado RAF Nativa e Exótica
- [ ] **2.5** Origem da Água:
  - Marcar utilização de água = Sim
  - Validar presença de `"Captação de Água de Chuva/Pluviométrica"` na listagem múltipla
  - Validar seleção de Concessionária com opções únicas `Embasa` e `SAAE`
- [ ] **2.6** Efluentes Líquidos (Item crítico MR235/259):
  - Marcar *"Possui sistema de tratamento?"* = Sim
  - **Validar renderização das 8 opções de tratamento**: DAFA, ETE interna, Fossa Séptica, Sumidouro, CSAO, Wetland, Filtros, Outros
- [ ] **2.7** Emissões Atmosféricas (Item crítico MR235/259):
  - Marcar *"Possui medidas de controle?"* = Sim
  - **Validar renderização das 7 opções de medidas**: Barreira vegetal, Pavimentação, Enclausuramento, Monitoramento PTS/PI, Cobertura de correias, Aspersão de água, Outros

### Bloco 3: Unidades Armazenadoras & Localização Geográfica
- [ ] **3.1** Inclusão de Unidade Armazenadora via modal:
  - Validar que o campo *Código CDA* é obrigatório (TL005 C002)
  - Preencher Identificação, Espécie (Convencional/Graneleiro), Tipo e Capacidade
- [ ] **3.2** Localização Geográfica da Unidade:
  - Testar validação com coordenadas fora da Bahia (Lat `-12.5`, Long `-60.0`) -> alerta de fora do estado
  - Corrigir longitude para `-41.5` -> validar que o erro limpa dinamicamente em tempo real
- [ ] **3.3** Inclusão de múltiplas unidades armazenadoras: salvar 2 unidades e conferir coexistência na tabela

### Bloco 4: Limpeza Dinâmica de Mensagens de Erro (Problema 4)
- [ ] **4.1** Disparar mensagens de erro nos campos obrigatórios
- [ ] **4.2** Corrigir individualmente cada campo (combustível, CDA, coordenadas) e validar que cada mensagem desaparece imediatamente sem recarregar a etapa

### Bloco 5: Persistência em Edição, Conclusão e Visualização
- [ ] **5.1** Salvar cadastro como Incompleto
- [ ] **5.2** Reabrir via *Meus Processos › Continuar Preenchimento*:
  - Validar cabeçalho: `"Editar Atividade Não Sujeita a Licenciamento Ambiental"`
  - **Conferir persistência 100% íntegra**: Localização Geográfica da unidade completa, as 3 declarações marcadas, combustível marcado, origem da água marcada
- [ ] **5.3** Ação *"Concluir Cadastro"* na listagem da tabela:
  - Tentar concluir um cadastro incompleto -> validar bloqueio obrigatório (não pular validação)
  - Concluir cadastro preenchido -> validar transição de status para *Aguardando Análise*
- [ ] **5.4** Tela de Visualizar:
  - Abrir cadastro concluído e validar que nada sumiu (Utiliza Água: Sim, Caracterização completa, Unidades Armazenadoras exibidas)
