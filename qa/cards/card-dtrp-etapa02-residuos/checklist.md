# Checklist de Homologação — Card 08: DTRP — Etapa 02: Resíduos Perigosos (Questionário DQC)

## 📌 Contexto do Teste
- **Ambiente**: https://gla-inema-hml.acto.com.br/
- **Módulo**: DTRP › Requerimentos › Edição do Requerimento nº 2
- **Telas Inspecionadas**: TL002 — Etapa 02 (Questionário DQC), Seção Tratamento e Disposição Final, Seção SINIR, Catálogo NBR 10.004 e Caracterização de Resíduos Perigosos

---

## 🎯 Itens Validados

### 1. Seleção de Formas de Tratamento e Disposição Final (RF01 / RNG-021)
- [x] Lista de formas de tratamento e disposição final exibida com seleção múltipla (checkboxes).
- [x] Relação completa presente: armazenamento, aterro industrial, coprocessamento em cimento, descontaminação, encapsulamento, blend de resíduos, incineração, landfarming, logística reversa, poço injetor, tratamento biológico, tratamento efluentes, tratamento físico-químico, etc.
- [x] Campo de busca de formas de tratamento com filtragem em tempo real preservando seleções.

### 2. Campo SINIR (Cadastro Nacional de Resíduos)
- [x] Opções em radio button: "Sim" (1) e "Não" (0).
- [x] Exibição condicional de upload de comprovante SINIR em PDF quando selecionado "Sim".

### 3. Seleção de Resíduos Perigosos (Catálogo ABNT NBR 10.004) (RF02 / RNG-015 / RNG-016)
- [x] Campo de pesquisa do catálogo NBR com busca assíncrona ("Comece a digitar para pesquisar...").
- [x] Botão "Adicionar resíduo" vinculado ao catálogo parametrizado.
- [x] Resíduo adicionado apresenta Código (ex.: D001), Nome (Resíduos Inflamáveis) e Periculosidade (Classe I – Perigoso).

### 4. Gerenciamento e Caracterização Individual Obrigatória (RF03 / RNG-019 / RNG-020)
- [x] Campos de caracterização individual estruturados:
  - Quantidade média anual transportada (campo numérico obrigatório).
  - Estado Físico (select com opções: Sólido, Líquido, Gases Contidos, Pastoso/Lodo, Emulsão).
  - Tipo de Acondicionamento (select com opções normalizadas E01 a E08: Tambor de 200L, A granel, Caçamba, Tanque, Bombonas, Fardos, Sacos plásticos, Outras formas).
  - Tipo de Veículo (select com opções: Carga, Tanque).
- [x] Ações de edição, visualização e exclusão com tratamento de rascunho preservado.

---

## 🏁 Veredito Final
- **Status**: ✅ **100% APROVADO**
- **Divergências ou Bloqueios**: Nenhum.
