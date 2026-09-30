# Checklist Master de Homologação — ANSLA: Silos e Armazéns (Feature & Reteste)

> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Card**: Cadastro de Atividade Não Sujeita – Silos e Armazéns (DR001 / DR003 / MR 235 / MR 259)  
> **Data**: 2026-09-10  
> **Líder de QA**: Lucas Guariero  
> **Status Geral**: ✅ **APROVADO / HOMOLOGADO COM SUCESSO (100%)**  
> **Módulo**: Atividades Não Sujeitas a Licenciamento Ambiental (ANSLA)

---

## 👥 Perfis e Credenciais de Teste

| Perfil | Login / CPF | Senha | Finalidade no Teste |
|---|---|---|---|
| **Requerente / Admin** | `000.000.000-00` / `992.924.740-81` | `admin123` / `Inema@2026` | Iniciar cadastro, preenchimento, edição, conclusão e visualização |

---

## 📋 Matriz Completa de Testes & Reteste de Homologação

### Bloco 1: Padronização de Nomenclatura & Dados Básicos
- [x] **1.1** Padronização visual: validado que o nome oficial é `"Atividades Não Sujeitas a Licenciamento Ambiental"` no Menu Lateral, na trilha de navegação (Breadcrumb) e no título da página (Print 01).
- [x] **1.2** Cabeçalho de criação: `"Cadastrar Atividade Não Sujeita a Licenciamento Ambiental"` conferido com sucesso (Print 01).
- [x] **1.3** Selecionar Tipo de Responsável (*O Próprio Requerente*), Tipo de Atividade (*ANSLA-003 - SILOS E ARMAZÉNS DESTINADOS AO ARMAZENAMENTO, SECAGEM E BENEFICIAMENTO DE PRODUTOS AGRÍCOLAS NÃO INDUSTRIALIZADOS*) e Empreendimento (*Fazenda Demo ANSLA*).
- [x] **1.4** Declarações obrigatórias: marcadas todas as declarações de veracidade e regras da atividade, liberando avanço para Caracterização da Atividade.

### Bloco 2: Caracterização da Atividade — Validações, Rótulos e Catálogos
- [x] **2.1** Responsável Técnico: validação de obrigatoriedade ativa ("Informe ao menos um responsável técnico.") com persistência dos dados profissionais (Formação, Registro Profissional e Órgão de Registro) no Visualizar (Print 03, Print 06).
- [x] **2.2** CNAE Obrigatório (Problema 3):
  - Texto de apoio conferido: `"Classificação Nacional de Atividades Econômicas correspondente à atividade declarada. Selecione ao menos um CNAE."` (não mais opcional) (Print 03).
  - Bloqueio com mensagem `MSG002`: `"Selecione pelo menos um CNAE."` disparado com sucesso ao tentar avançar sem seleção (Print 03).
  - Suporte a seleção de múltiplos CNAEs com remoção individual conferido.
- [x] **2.3** Rótulo de Operação (Problema 1):
  - Item `"Armazém de insumos"` presente na listagem de operações desenvolvidas, em estrita conformidade com o RG009 do Documento de Requisitos (Print 02).
  - O rótulo divergente anterior (`"Aerização de insumos"`) foi completamente extirpado.
- [x] **2.4** Combustível & RAF:
  - Selecionado queima para secagem = Sim (Print 02).
  - Opções exibidas: `GLP`, `Gás Natural`, `Óleo`, `Madeira`, `Outro` (confirmado que **Lenha** foi removida e **Óleo** está disponível).
  - Seleção de *Madeira* dispara os campos condicionais de Certificado RAF Nativa e Exótica.
- [x] **2.5** Origem da Água:
  - Selecionado utilização de água = Sim (Print 04).
  - Presença de `"Captação de Água de Chuva/Pluviométrica"`, Concessionária Pública, Captação Superficial e Subterrânea com abertura de campos de Outorga.
- [x] **2.6** Efluentes Líquidos (MR235/259):
  - Selecionado *"Possui sistema de tratamento?"* = Sim (Print 04).
  - Renderização completa dos 8 sistemas: DAFA, Estação de tratamento dentro da empresa, Fossa séptica, Sumidouro, Caixa separadora de água e óleo (CSAO), Wetland, Filtros e Outros.
- [x] **2.7** Emissões Atmosféricas (MR235/259):
  - Selecionado *"Possui medidas de controle de emissões?"* = Sim (Print 04).
  - Renderização das 7 medidas: Barreira vegetal/artificial, Pavimentação de vias, Enclausuramento de equipamentos, Monitoramento de PTS/PI, Cobertura superior/lateral de correias, Aspersão de água nas vias e Outros.

### Bloco 3: Unidades Armazenadoras & Localização Geográfica
- [x] **3.1** Inclusão de Unidade Armazenadora: campos de Identificação, Código CDA obrigatório, Espécie (Convencional / Graneleiro), Tipo e Capacidade Estática.
- [x] **3.2** Localização Geográfica da Unidade: Sistema de coordenadas SIRGAS2000, validação de coordenadas geográficas no estado da Bahia (Latitude / Longitude).
- [x] **3.3** Coexistência de múltiplas unidades armazenadoras conferida e validada na tabela e na visualização do cadastro (Print 06).

### Bloco 4: Limpeza Dinâmica de Mensagens de Erro (Problema 4)
- [x] **4.1** Disparo de mensagens de erro nos campos obrigatórios ao submeter sem dados.
- [x] **4.2** Reatividade Livewire via `$this->validateOnly()` testada: ao preencher/corrigir os campos com validação customizada (combustível, CDA e coordenadas), a mensagem de erro é removida de imediato em tempo real sem demandar reload da página.

### Bloco 5: Persistência em Edição, Conclusão e Visualização
- [x] **5.1** Salvamento e listagem na tela *Meus Processos*: registros rascunhos e concluídos auditáveis na listagem oficial (Print 05).
- [x] **5.2** Cabeçalho de edição padronizado em `"Editar Atividade Não Sujeita a Licenciamento Ambiental"`, com preservação integral de dados, declarações e coordenadas ao reabrir.
- [x] **5.3** Transição e integridade de status: validação de completude no botão de conclusão, bloqueando registros incompletos e transitando com sucesso para Concluído.
- [x] **5.4** Tela de Visualizar (`/ansla/anslas/[id]`): dados completos de Dados Básicos (Utiliza Água: Sim), Caracterização da Atividade (Responsáveis Técnicos, CNAEs, Unidades Armazenadoras com Coordenadas, Efluentes, Emissões e Resíduos) e Documentos e Estudos (Print 06).
