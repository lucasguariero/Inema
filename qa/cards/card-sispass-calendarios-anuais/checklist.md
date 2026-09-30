# Checklist de QA — Ajustes SISPASS: Calendário Anual

## 1. Identificação do Card
- **Título**: Ajustes SISPASS - Calendario
- **Módulo**: SISPASS / Meus Calendários Anuais (`/calendario-anual`) e Análise de Calendários (`/validacao-calendario-anual`)
- **Tipo**: Reteste de Correção (Bugfix)
- **Branch do Dev**: `fix/sispass-calendario-cep-documentos-analise`
- **Situação de HML**: Bruno reportou 10h atrás que a build de HML ainda estava na versão antiga (sem a branch subida). Necessário verificar se a build atualizou para validar o comportamento corrigido.

---

## 2. Escopo & Pontos de Correção

### Bloco A: Cadastro do Calendário (Limpeza de Campos no CEP)
- [ ] **A1 — Preenchimento com CEP completo**:
  - Digitar CEP com dados completos (ex: Salvador, Comércio) -> Logradouro, Bairro e Município preenchem corretamente.
- [ ] **A2 — Troca para CEP genérico/sem logradouro (O Ponto do Bug)**:
  - Alterar para um CEP genérico sem rua/bairro vinculado (ex: Barreiras/BA ou CEP único de cidade).
  - **Esperado pós-fix**: Logradouro e Bairro devem ser limpos (ficar em branco), e Município atualizar para a nova cidade.
  - **Comportamento anterior**: Mantinha o texto do endereço anterior na tela devido a dessincronia no Livewire.

### Bloco B: Análise do Calendário
- [x] **B1 — Aba Única**: Tela de análise em uma única página consolidada (Aprovado).
- [x] **B2 — Remoção da Aba "Documentos"**: Aba removida da interface (Aprovado).
- [x] **B3 — Nomenclatura da Tabela**: Tabela renomeada para "Documentos Apresentados" com coluna "Documento" (Aprovado).
- [ ] **B4 — Exibição das Fotos na Análise (O Ponto do Bug)**:
  - Cadastro possui 4 fotos anexadas (Fachada, Local, Telhado, Ventilação) + Laudo Técnico Assinado.
  - **Esperado pós-fix**: As 4 fotos devem ser apresentadas na tabela da Análise junto com o Laudo Técnico.
  - **Comportamento anterior**: Aparecia apenas o Laudo Técnico, ocultando as 4 fotos para o analista.

---

## 3. Evidências Mapeadas
- `Print 01 - CEP geral mantem endereco anterior.jpg` (Evidência do bug anterior)
- `Print 02 - Autopreenchimento quando ha dado.jpg`
- `Print 03 - Fotos do local anexadas no cadastro.jpg`
- `Print 04 - Analise exibindo apenas laudo tecnico.jpg` (Evidência do bug anterior)
