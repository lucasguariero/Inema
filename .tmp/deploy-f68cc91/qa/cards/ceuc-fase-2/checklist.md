# Checklist de QA — CEUC Fase 2 (TL002: Estrutura do Formulário e Aba 1)

- **ID do Card / Módulo**: `CEUC-FASE-2` (DOR036)
- **Escopo**: Formulário de Cadastro e Edição do CEUC — Informações Gerais e Territoriais
- **Data**: 24/09/2026
- **Status Geral**: ✅ APROVADO COM 100% DE ADERÊNCIA

---

## 1. Estrutura de Navegação & Abertura do Formulário
- [x] **Abertura do Formulário**: Transição reativa e suave a partir de `+ Nova UC` e da ação `Editar` de cada linha da tabela.
- [x] **Cabeçalho Canônico**:
  - Breadcrumb oficial: `Gestão de UC > Cadastros Básicos > CEUC > Cadastro de Unidade de Conservação`.
  - Título dinâmico: "Nova Unidade de Conservação" (com badge `Em Preenchimento`) ou nome da UC em edição (com badge de código e `Cadastrada`).
  - Botão de escape rápido: `Voltar à Lista`.
- [x] **Barra de Abas (GlaTabs)**:
  - 1. *Informações Gerais e Territoriais* (Ativa nesta Fase 2).
  - 2. *Instrumentos de Gestão* (Estruturada / Em breve).
  - 3. *Zonas de Manejo e Áreas de Visitação* (Estruturada / Em breve).
  - 4. *Conselho Gestor e Equipe* (Estruturada / Em breve).
  - 5. *Infraestrutura e Serviços* (Estruturada / Em breve).
  - Estado vazio/placeholder informativo para as abas 2 a 5 com retorno imediato à Aba 1.

---

## 2. Campos da Aba 1 (TL002 — Informações Gerais e Territoriais)
- [x] **Seção 1: Dados Básicos e Enquadramento Legal**:
  - Nome da UC (obrigatório com validação) e Sigla/Abreviação.
  - Data de Criação e Data da Última Atualização automática (`suffixText="Auto"`).
  - Grupo de Manejo (*Proteção Integral* | *Uso Sustentável*).
  - Categoria de Manejo SEUC/SNUC (*Parque Estadual*, *APA*, *Estação Ecológica*, etc.).
  - Upload de documentação normativa (Norma de Criação DOE/Decreto e Normas de Alteração).
- [x] **Seção 2: Informações Geográficas e Territoriais**:
  - Área Total Declarada em hectares (`ha`).
  - Bioma predominante (*Caatinga*, *Mata Atlântica*, *Cerrado*).
  - RPGA (Região de Planejamento e Gestão das Águas da Bahia) e Território de Identidade.
  - Municípios Abrangidos com seleção interativa de tags/chips e adição inline.
  - Situação Fundiária: Percentual regularizado (`%`) e histórico fundiário descritivo.
- [x] **Rodapé Fixo de Ações**:
  - Botão secundário: `Cancelar / Voltar para a Lista`.
  - Botão outline: `Salvar Rascunho` (persiste rascunho e emite notificação toast).
  - Botão primário (`#0F4C3A`): `Avançar para Instrumentos de Gestão`.
