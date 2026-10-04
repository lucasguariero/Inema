# 📋 Plano de Execução — Módulo de Gestão de Fauna (DR001 ao DR007)
## Sistema Integrado de Gestão Ambiental (GLA / INEMA)

> **Documento:** Plano Diretor de Implementação em Lote  
> **Objetivo:** Planejamento sequencial, arquitetural e cirúrgico dos 7 Documentos de Requisitos (DR001 a DR007) para o Módulo de Gestão de Fauna.  
> **Arquitetura Visual:** Casca externa no **Shell Legado GLA** (`AppShell.tsx` com Topbar verde `#0F4C3A` e Sidebar oficial) + Miolo construído com os componentes estritos do **Design System Refinado** (`@/components/...`).  
> **Diretriz de Escopo:** **ZERO Invenção / Zero AI-Slop**. Apenas os campos, validações e fluxos normativos especificados na documentação técnica oficial da DISUC/COTIC.

---

## 🏛️ 1. Arquitetura de Casca & Integração no Menu Legado

### 1.1 Casca Externa (Shell Legado Inviolável)
- **Topbar**: Header oficial de 60px (`bg-[#0F4C3A]`), logo institucional do INEMA, busca de sistema, notificações e perfil do usuário. É terminantemente proibido utilizar o header moderno do SEIA V2.
- **Sidebar**: Barra lateral do GLA (280px, `bg-white`, borda `border-[#E5E7EB]`) com acordeão exclusivo, ícones e estados ativos em verde institucional (`bg-[#E2ECE9] text-[#0F4C3A] font-bold`).
- **Morte ao Azul Genérico**: Todos os estados de foco, hover e anéis de seleção devem utilizar exclusivamente os tokens e variáveis da paleta verde do INEMA (`#0F4C3A`, `ring-[#0F4C3A]/20`, `hover:bg-[#0F4C3A]/10`).

### 1.2 Mapeamento de Menu (`src/data/navigationConfig.json`) & Rotas (`src/App.tsx`)
O Módulo de Gestão de Fauna será configurado como um novo grupo principal no menu lateral:

```json
{
  "id": "fauna",
  "label": "Gestão de Fauna",
  "icon": "Trees",
  "materialIcon": "pets",
  "defaultOpen": true,
  "htmlId": "subFauna",
  "items": [
    { "id": "fauna-especies", "label": "Espécies e Taxonomia", "href": "/?rota=fauna-especies", "route": "fauna-especies", "htmlId": "menu-fauna-especies" },
    { "id": "fauna-unidades", "label": "Unidades e Destinos", "href": "/?rota=fauna-unidades", "route": "fauna-unidades", "htmlId": "menu-fauna-unidades" },
    { "id": "fauna-documentos", "label": "Documentos e Termos", "href": "/?rota=fauna-documentos", "route": "fauna-documentos", "htmlId": "menu-fauna-documentos" },
    { "id": "fauna-procedencia", "label": "Procedência Animal", "href": "/?rota=fauna-procedencia", "route": "fauna-procedencia", "htmlId": "menu-fauna-procedencia" },
    { "id": "fauna-recintos", "label": "Recintos e Áreas", "href": "/?rota=fauna-recintos", "route": "fauna-recintos", "htmlId": "menu-fauna-recintos" },
    { "id": "fauna-manejos", "label": "Tipos de Manejo", "href": "/?rota=fauna-manejos", "route": "fauna-manejos", "htmlId": "menu-fauna-manejos" },
    { "id": "fauna-animais", "label": "Animais", "href": "/?rota=fauna-animais", "route": "fauna-animais", "htmlId": "menu-fauna-animais" }
  ]
}
```

---

## 📦 2. Catálogo Oficial de Componentes Reutilizados (Design System)

Para garantir padronização absoluta e eliminar qualquer HTML cru:
- **Botões de Ação**: `Button` de `@/components/ui/button.tsx` (variante `primary` `#0F4C3A`, `outline`, `ghost`, tamanhos `sm` e `md`).
- **Badges de Status & Indicadores**: `Badge` de `@/components/ui/badge.tsx` (variantes semânticas: `success`, `warning`, `danger`, `info`, `primary`, `gray`, com/sem `dot`).
- **Campos de Entrada & Formulários**: `InputWrapper` e `Input` de `@/components/filament/InputWrapper.tsx` (altura densa `h-9`, label sóbrio com asterisco vermelho para obrigatórios, anel de foco verde).
- **Selects Pesquisáveis & Dropdowns**: `FilamentSelect` de `@/components/filament/Select.tsx` (popover com filtro, suporte a teclado).
- **Seções Estruturais**: `Section` de `@/components/filament/Section.tsx` (`rounded-xl`, borda sutil, cabeçalho recolhível).
- **Tabelas Operacionais & Data Grids**: `TableContainer` e `TableToolbar` de `@/components/filament/Table.tsx` (busca com filtro imediato, filtros em dropdown, contadores e paginação).
- **Gavetas de Detalhe (Drawer Nível 1)**: Componente lateral contextual para inspeção rápida sem perda do cursor na tabela.
- **Modais Canônicos (Nível 2)**: `Dialog` de `@/components/ui/dialog.tsx` para formulários e detalhamentos complexos.
- **Tabelas Editáveis Inline**: Padrão do Design System com linhas de adição, botões de exclusão e inputs integrados para listas dinâmicas.

---

## 🎯 3. Checklist Sequencial de Execução (Fila Técnica DR002 ➔ DR001)

A ordem de implementação respeita estritamente as dependências ontológicas e relacionais do banco de dados e fluxos de negócio do INEMA:

```
[1: DR002 Espécies] ➔ [2: DR004 Unidades] ➔ [3: DR007 Documentos] ➔ [4: DR003 Procedência] ➔ [5: DR005 Recintos] ➔ [6: DR006 Manejo] ➔ [7: DR001 Animais]
```

---

### 🟢 ETAPA 1: DR002 — Espécies e Taxonomia
* **Identificador de Rota**: `fauna-especies` (`/?rota=fauna-especies`)
* **Título Oficial da Página**: `Espécies e Taxonomia`
* **Dependência**: Nenhuma (base primária de taxonomia da fauna silvestre).

#### Telas a Implementar:
1. **TL001 — Listagem de Espécies**:
   - **Cabeçalho**: Título institucional `Espécies e Taxonomia`, descrição normativa e botão primário no canto superior direito `+ Nova Espécie` (`#0F4C3A`).
   - **Filtros do Toolbar**: Busca por Nome Científico / Nome Popular, Filtro por Grupo Animal (Aves, Mamíferos, Répteis, Anfíbios, Peixes, Invertebrados), Filtro Ameaçada (Sim/Não/Todas), Filtro Exótica/Invasora (Sim/Não/Todas) e Situação (Ativo/Inativo).
   - **Colunas da Tabela**:
     * Nome Científico (em *itálico*, com marcação se for táxon superior / gênero);
     * Nome Popular Principal (com indicação "+N" se houver múltiplos nomes);
     * Família / Ordem / Classe;
     * Grupo Animal;
     * Grau de Ameaça (`Badge` com Lista Oficial + Categoria: MMA CR/EN/VU, CITES I/II, IUCN);
     * Exótica / Invasora (`Badge` Sim/Não);
     * Situação (`Badge` Ativo/Inativo);
     * Ações: `Visualizar` (Drawer Nível 1), `Editar`, `Inativar/Ativar`, `Histórico`.
2. **TL002 — Nova / Editar Espécie**:
   - **Ações de Topo/Rodapé**: Botão `← Voltar para a Listagem`, `[Cancelar]`, `[Salvar Rascunho]` e `[Salvar Definitivo]` (`#0F4C3A`).
   - **Campos Oficiais (C001 a C011)**:
     * `C001 - Nome científico`: Campo texto com validação (Gênero + epíteto específico em itálico, RN-001/002).
     * `C002 - Autor e ano`: Campo texto opcional.
     * `C003 - Táxon superior`: Caixa de seleção / checkbox para indicar se é registro em nível de gênero/família (RN-004).
     * `C004 - Classe / Ordem / Família / Gênero`: Campos de seleção/texto integrados (OBG, RN-003).
     * `C005 - Grupo animal`: Select obrigatório (Aves, Mamíferos, Répteis, Anfíbios, Peixes, Invertebrados).
     * `C006 - Nomes populares`: **Tabela editável** com colunas `Nome Popular` e checkbox `Principal` (RN-005). Pelo menos um nome obrigatório.
     * `C007 - Classificações de ameaça`: **Tabela editável** com colunas: `Lista Oficial` (Nacional/MMA, Estadual/BA, CITES, IUCN), `Categoria` (CR, EN, VU, NT, LC, DD) e `Ato Normativo / Ano` (RN-006, RN-007).
       > ⚠️ **Regra de Ouro DR002**: O campo "Categoria de Ameaça" **NÃO deve ser duplicado**. Exibir exclusivamente como coluna dentro desta tabela de classificações. Uma classificação por lista.
     * `C008 - Exótica/Invasora`: Toggle switch / chave, **padrão DESLIGADO** (RN-009).
     * `C009 - Restrições de soltura`: Campo de texto aberto para digitação, **OBRIGATÓRIO (*)** (RN-010).
       > ⚠️ **Regra de Ouro DR002**: "Restrições de soltura" é texto livre obrigatório (não é combobox fechado).
     * `C010 - Observações`: Área de texto (até 2.000 caracteres, opcional).
     * `C011 - Justificativa de Edição`: Área de texto, visível e obrigatória **somente** na edição de registros que já foram salvos definitivamente (RN-016).

#### Componentes Exatos Utilizados:
- `@/components/ui/button.tsx` (`Button`)
- `@/components/ui/badge.tsx` (`Badge`)
- `@/components/filament/InputWrapper.tsx` (`InputWrapper`, `Input`, `Textarea`)
- `@/components/filament/Select.tsx` (`FilamentSelect`)
- `@/components/filament/Section.tsx` (`Section`)
- `@/components/filament/Table.tsx` (`TableContainer`, `TableToolbar`)

---

### 🟢 ETAPA 2: DR004 — Unidades e Destinos
* **Identificador de Rota**: `fauna-unidades` (`/?rota=fauna-unidades`)
* **Título Oficial da Página**: `Unidades e Destinos`
* **Dependência**: DR002.

#### Telas a Implementar:
1. **TL001 — Listagem de Unidades e Destinos**:
   - **Cabeçalho**: Título institucional, botão `+ Nova Unidade/Destino` e aba/botão secundário para `Parametrização de Tipos (TL003)`.
   - **Filtros**: Busca por Nome/Município, Filtro por Tipo de Unidade, Natureza (Unidade INEMA / Destino Externo), Situação.
   - **Colunas da Tabela**: Tipo de Unidade, Nome da Unidade/Destino, Natureza, Município, Responsável, Telefone/E-mail, Situação, Ações.
2. **TL002 — Nova / Editar Unidade ou Destino**:
   - **Ações**: `← Voltar`, `[Cancelar]`, `[Salvar]` (`#0F4C3A`).
   - **Ordem EXATA dos Campos (Regra de Ouro)**:
     ```
     1. Tipo de Unidade (Select OBG)
     2. Nome (Texto OBG, até 150 caracteres)
     3. Município (Select OBG)
     4. Responsável (Texto livre OBRIGATÓRIO com *)
     5. Telefone (Texto formatado (00) 00000-0000 OBG)
     6. E-mail (Texto formatado OBG)
     ```
     > ⚠️ **Regras de Ouro DR004**:
     > - "Responsável" é campo de texto livre **OBRIGATÓRIO (*)**, associado aos contatos, sem exigir pré-cadastro em pessoas.
     > - **PROIBIDO** exigir ou exibir os campos `Capacidade`, `Autorização` e `Validade` (foram excluídos do cadastro transversal).
   - **Campos Condicionais para Destino Externo (Natureza Externa)**:
     * `Pessoa física/jurídica (CPF/CNPJ)`: Campo de busca/identificação do titular (OBG para destino externo).
     * `Endereço completo`: Texto OBG.
     * `Coordenadas`: Latitude / Longitude (opcional).
     * `Restrições do destino`: Área de texto (opcional, até 1.000 caracteres).
3. **TL003 — Parametrização de Tipos de Unidade**:
   - Sub-tabela ou modal de gestão de tipos: Nome do Tipo (OBG único), Natureza (`Unidade do INEMA` ou `Destino externo`), Chaves/Toggles: `Permite Admissão`, `Permite Destinação`, `Permite Recintos`.

#### Componentes Exatos Utilizados:
- `@/components/ui/button.tsx`, `@/components/ui/badge.tsx`
- `@/components/filament/InputWrapper.tsx`, `@/components/filament/Select.tsx`
- `@/components/filament/Section.tsx`, `@/components/filament/Table.tsx`
- `@/components/ui/dialog.tsx` (para modal de Tipos TL003)

---

### 🟢 ETAPA 3: DR007 — Documentos e Termos
* **Identificador de Rota**: `fauna-documentos` (`/?rota=fauna-documentos`)
* **Título Oficial da Página**: `Documentos e Termos`
* **Dependência**: DR004.

#### Telas a Implementar:
1. **TL001 — Listagem de Documentos e Termos**:
   - **Filtros**: Nome, Natureza (`Documento Anexado` ou `Termo Emitido`), Versão Vigente, Anexo Obrigatório (Sim/Não), Assinatura (Sim/Não), Situação.
   - **Colunas**: Nome, Natureza, Versão Vigente, Anexo Obrigatório, Exige Assinatura, Situação, Ações.
2. **TL002 — Novo / Editar Documento ou Termo**:
   - **Campos Oficiais**:
     * `Natureza`: Select (`Documento anexado` ou `Termo emitido`) — **TRAVA o formulário após o primeiro uso/salvamento** (RN-001).
     * `Nome`: Texto OBG único (RN-002).
     * `Descrição / Finalidade`: Área de texto opcional (até 1.000 caracteres).
     * `Unidades aplicáveis`: Seleção múltipla com opção `Todas` ou seleção específica das unidades do DR004 (RN-007).
     * `Anexo obrigatório`: Chave/Toggle (padronizado como "Anexo obrigatório").
     * *Campos exclusivos para Termo Emitido*:
       - `Modelo do termo`: Editor de texto com variáveis parametrizáveis (`[NOME_ANIMAL]`, `[ESPECIE]`, `[DESTINO]`, `[DATA]`, etc.) — OBG para Termo Emitido (RN-003).
       - `Versão vigente`: Gerada automaticamente pelo sistema (somente leitura, RN-004).
       - `Início de vigência`: Data obrigatória (RN-005).
       - `Validade do termo`: Prazo numérico expresso em **DIAS** após a emissão (RN-011).
       - `Exige assinatura`: Toggle. Se Sim: `Forma de assinatura` (Digital Gov.br, Upload assinado) e `Signatários` (Servidor, Responsável, Testemunhas).
       - `Histórico de Versões anteriores`: Tabela somente leitura com versões anteriores preservadas.

#### Componentes Exatos Utilizados:
- `@/components/ui/button.tsx`, `@/components/ui/badge.tsx`
- `@/components/filament/InputWrapper.tsx`, `@/components/filament/Select.tsx`
- `@/components/filament/Section.tsx`, `@/components/filament/Table.tsx`

---

### 🟢 ETAPA 4: DR003 — Procedência Animal
* **Identificador de Rota**: `fauna-procedencia` (`/?rota=fauna-procedencia`)
* **Título Oficial da Página**: `Procedência Animal`
* **Dependência**: DR004, DR007.

#### Telas a Implementar:
1. **TL001 — Listagem de Procedência Animal**:
   - **Colunas**: Tipo de Procedência (Entrega Voluntária, Apreensão, Resgate, Transferência), Subtipo, Subtipo Padrão (Sim/Não), Informações Exigidas na Admissão, Situação, Ações.
2. **TL002 — Nova / Editar Procedência Animal**:
   - **Campos Oficiais**:
     * `Tipo`: Select com os tipos consolidados (Entrega voluntária, Apreensão, Resgate, Transferência).
       > ⚠️ **Regra de Ouro DR003**: Transferência é Tipo único; modalidades (ex: de CETAS, de Zoológico) são tratadas por **Subtipo**.
     * `Subtipo`: Texto OBG (até 150 caracteres, único no tipo).
     * `Descrição de uso`: Área de texto orientativa (opcional, até 1.000 caracteres).
     * `Subtipo padrão`: Checkbox para definir se é a opção default selecionada na admissão (RN-005).
     * `Informações exigidas na Admissão`: Checkboxes (`Órgão/Instituição`, `Responsável`, `Unidade de origem`, `Observação`).
       > ⚠️ **Regra de Ouro DR003**:
       > - O campo **"Ocorrência" foi removido** do sistema; usar estritamente **"Observação"**.
       > - "Unidade de origem" fica habilitado **SOMENTE para subtipos de Transferência** (RN-007).
     * `Órgãos permitidos`: Seleção múltipla de órgãos cadastrados (habilitado se Órgão/Instituição estiver marcado).
     * `Documentos exigidos`: Seleção múltipla integrada aos tipos do DR007.
       > ⚠️ **Regra de Ouro DR003**: No fluxo de Admissão, a anexação documental segue a regra *"Anexar documento? Sim / Não"*. Se responder "Não", o campo *"Pendência documental"* torna-se **obrigatório**.
     * `Código SISCETAS`: Campo texto opcional para correspondência federal (RN-013).
     * `Observações`: Área de texto complementar (até 1.000 caracteres).

#### Componentes Exatos Utilizados:
- `@/components/ui/button.tsx`, `@/components/ui/badge.tsx`
- `@/components/filament/InputWrapper.tsx`, `@/components/filament/Select.tsx`
- `@/components/filament/Section.tsx`, `@/components/filament/Table.tsx`

---

### 🟢 ETAPA 5: DR005 — Recintos e Áreas
* **Identificador de Rota**: `fauna-recintos` (`/?rota=fauna-recintos`)
* **Título Oficial da Página**: `Recintos e Áreas`
* **Dependência**: DR002, DR004.

#### Telas a Implementar:
1. **TL001 — Listagem de Recintos e Áreas**:
   - **Filtros**: Unidade INEMA, Tipo de Recinto, Situação Operacional, Estado Sanitário.
   - **Colunas**: Código (`REC-NNNN`), Nome Local, Tipo de Recinto, Unidade do INEMA, Ocupação / Capacidade (ex: `12/15`), Situação Operacional (`Badge`: Disponível, Quase Lotado, Lotado, Indisponível), Estado Sanitário, Situação, Ações.
2. **TL002 — Novo / Editar Recinto ou Área**:
   - **Campos Oficiais**:
     * `Código`: Gerado pelo sistema (`REC-NNNN`), somente leitura (RN-002).
     * `Nome local`: Identificação física na unidade (OBG único na unidade, até 100 caracteres).
     * `Unidade`: Select OBG restrito às unidades do DR004 que possuem a flag `Permite Recintos`.
     * `Tipo de recinto`: Select OBG (Quarentena, Triagem, Reabilitação, Berçário, Recinto de Exposição, etc.).
     * `Área`: Metragem física em m² (campo numérico, RN-013).
     * `Capacidade`: Número máximo de animais.
       > ⚠️ **Regra de Ouro DR005**: "Capacidade" e "Espécies Permitidas" são **OBRIGATÓRIAS SOMENTE se a Unidade for Zoológico**. Para CETAS e demais unidades, são opcionais.
     * `Espécies permitidas`: Seleção múltipla integrada ao DR002 (OBG somente para Zoológico).
     * `Possui restrição?`: Select Sim / Não (RN-014).
     * `Estado Sanitário do recinto`: Select OBG parametrizado (Adequado, Em Desinfecção, Quarentena Sanitária, Contaminado - RN-009).
     * `Observação`: Área de texto (até 1.000 caracteres) — utilizada para detalhar restrições, contaminação e situações de obra/reforma.
       > ⚠️ **Regra de Ouro DR005**: O campo "Manutenção" foi **removido**. Casos de manutenção ou obra devem ser descritos dentro de "Observação".
     * `Ocupação / Situação operacional`: Campos **calculados e de somente leitura** (RN-005, RN-006).

#### Componentes Exatos Utilizados:
- `@/components/ui/button.tsx`, `@/components/ui/badge.tsx`
- `@/components/filament/InputWrapper.tsx`, `@/components/filament/Select.tsx`
- `@/components/filament/Section.tsx`, `@/components/filament/Table.tsx`

---

### 🟢 ETAPA 6: DR006 — Tipos de Manejo
* **Identificador de Rota**: `fauna-manejos` (`/?rota=fauna-manejos`)
* **Título Oficial da Página**: `Tipos de Manejo`
* **Dependência**: DR007.

#### Telas a Implementar:
1. **TL001 — Listagem de Tipos de Manejo**:
   - **Colunas**: Tipo de Manejo, Exige Anexo (Sim/Não), Exige Termo (Sim/Não), Permite Múltiplos Animais (Sim/Não), Situação, Ações.
2. **TL002 — Novo / Editar Tipo de Manejo**:
   - **Campos Oficiais**:
     * `Tipo de manejo`: Nome do manejo (OBG único, até 100 caracteres, RN-001).
     * `Descrição`: Finalidade do manejo (opcional, até 1.000 caracteres).
     * `Permite múltiplos animais`: Toggle switch — **PADRÃO DESLIGADO** (RN-004, RN-006).
     * `Exige anexo`: Toggle switch — **PADRÃO DESLIGADO** (RN-002). Se ativado: exibe `Documentos exigidos` (Seleção múltipla integrada ao DR007).
     * `Exige termo`: Toggle switch — **PADRÃO DESLIGADO** (RN-003). Se ativado: exibe `Termo exigido` (Select integrado aos termos do DR007).
       > ⚠️ **Regra de Ouro DR006**: As três chaves (`Exige anexo`, `Exige termo` e `Permite múltiplos animais`) vêm **DESLIGADAS por padrão**.
     * `Campos adicionais do formulário`: **Tabela editável** (RN-005) com colunas:
       - `Nome do campo` (texto)
       - `Tipo de dado` (Texto, Numérico, Data, Seleção, Booleano)
       - `Unidade de medida` (opcional: kg, cm, dose)
       - `Obrigatório` (checkbox)
       - `Ordem de exibição` (número)

#### Componentes Exatos Utilizados:
- `@/components/ui/button.tsx`, `@/components/ui/badge.tsx`
- `@/components/filament/InputWrapper.tsx`, `@/components/filament/Select.tsx`
- `@/components/filament/Section.tsx`, `@/components/filament/Table.tsx`

---

### 🟢 ETAPA 7: DR001 — Animais (Base Única de Fauna)
* **Identificador de Rota**: `fauna-animais` (`/?rota=fauna-animais`)
* **Título Oficial da Página**: `Animais`
* **Dependência**: DR002 (Espécies), DR003 (Procedência), DR004 (Unidades), DR005 (Recintos).

#### Telas a Implementar:
1. **TL001 — Listagem de Animais**:
   - **Filtros**: Busca por Código (`UR-XXX-000001`), Microchip/Marcação, Espécie, Unidade Atual, Procedência, Status, Sigilo (apenas perfis autorizados), Candidato à Guarda.
   - **Colunas**:
     * Código oficial (`UR-XXX-000001` em `font-mono`);
     * Espécie (Nome científico em itálico + nome popular);
     * Sexo / Faixa Etária (ex: `Macho · Adulto`);
     * Unidade Atual;
     * Procedência;
     * Status (`Badge`: Em Quarentena, Em Tratamento, Apto para Soltura, Destinado, Óbito);
     * Indicadores (`Badge` discreto de Sigilo e Candidato à Guarda);
     * Ações: Visualizar (Drawer completo), Editar (apenas dados permitidos), Histórico, Ações do Gestor de Fauna.
2. **TL002 — Novo / Editar Animal**:
   - **Acesso à Criação Manual**: Restrito ao Gestor de Fauna (RN-003).
   - **Campos Oficiais**:
     * `Unidade Regional`: Select OBG na criação (informa a regional que compõe a sigla do código, RN-022).
     * `Código do animal`: Gerado automaticamente no padrão `UR-XXX-000001` (RN-002) — **SOMENTE LEITURA**.
     * `Identificação complementar`: Nome/apelido do animal (opcional, até 100 caracteres).
     * `Espécie`: Select com busca em tempo real integrado ao DR002 (OBG, RN-004).
     * `Identificação a confirmar`: Checkbox habilitado se selecionado táxon acima de espécie.
     * `Grupo taxonômico`: Derivado automaticamente da espécie — **SOMENTE LEITURA** (RN-005).
     * `Sexo`: Select OBG (Macho, Fêmea, Indeterminado - RN-006).
     * `Faixa etária`: Select OBG (Filhote, Jovem, Adulto, Senil, Indeterminada - RN-006).
     * `Origem Geográfica`: `Origem - Estado (UF)` e `Origem - Município` (não confundir com procedência, RN-012).
     * `Marcações físicas`: **Tabela editável separada** com colunas: `Tipo de marcação` (Microchip, Anilha, Tatuagem, Brinco, Colar), `Número da marcação`, `Data de aplicação` e `Situação` (Ativa, Perdida, Danificada - RN-007).
       > ⚠️ **Regra de Ouro DR001**: O identificador oficial `UR-XXX-000001` é gerado pelo sistema e independe de microchip. Marcações físicas ficam em tabela separada.
     * `Unidade atual`: **Somente leitura** derivada do fluxo de alocação (na inclusão manual, selecionada entre as unidades do usuário - RN-010).
     * `Procedência`: **Somente leitura** derivada da Admissão (selecionada na inclusão manual conforme DR003 - RN-011).
     * `Status`: **Somente leitura** derivado dos eventos (RN-009).
     * `Sigilo`: Toggle switch — **PADRÃO DESLIGADO**, restrito ao Gestor de Fauna com justificativa obrigatória (RN-013).
     * `Candidato à guarda`: Toggle switch — **PADRÃO DESLIGADO**, restrito ao Gestor de Fauna (RN-014).
     * `Observações`: Área de texto (até 2.000 caracteres).

#### Componentes Exatos Utilizados:
- `@/components/ui/button.tsx`, `@/components/ui/badge.tsx`
- `@/components/filament/InputWrapper.tsx`, `@/components/filament/Select.tsx`
- `@/components/filament/Section.tsx`, `@/components/filament/Table.tsx`
- Drawer lateral para visualização rápida (Nível 1) e Modal de auditoria (Nível 2).

---

## 🔒 4. Matriz de Conformidade com o Apêndice de Regras de Ouro

| Documento | Regra de Ouro Obrigatória | Validação Implementada no Planejamento |
| :--- | :--- | :--- |
| **DR002** | Categoria de Ameaça não duplicada; tabela oficial (Lista, Categoria, Ato/Ano); Restrições de soltura como texto livre obrigatório (*). | Tabela editável única; remoção da duplicação de campos na UI; campo `Restrições de soltura` em textarea livre com validação `required`. |
| **DR004** | Ordem EXATA: Tipo ➔ Nome ➔ Município ➔ Responsável ➔ Telefone ➔ E-mail. Responsável texto livre com (*). Proibido Capacidade, Autorização e Validade. | Layout em grid com ordem posicional estrita; input de texto livre para Responsável; exclusão total dos campos e cálculos de capacidade/autorização na tela da unidade. |
| **DR007** | Natureza trava após primeiro uso; Versão gerada pelo sistema; Modelo do termo em Rich Text; Validade em DIAS. | Select de Natureza com estado `disabled` quando o formulário for editado; versão gerada automaticamente em label mono; input numérico de validade com sufixo "dias". |
| **DR003** | Campo "Ocorrência" removido (usar "Observação"); Pergunta "Anexar documento? Sim/Não" (se Não, Pendência documental obrigatória); Unidade de Origem só para Transferência. | Exclusão do termo Ocorrência; rádio button de anexação condicional com validação de justificativa de pendência; dependência dinâmica de `Tipo === 'Transferência'` para exibir Unidade de Origem. |
| **DR005** | Capacidade e Espécies Permitidas obrigatórias SOMENTE para Zoológico; Ocupação e Situação Operacional calculadas (somente leitura); Campo Manutenção removido. | Validação condicional acionada pela seleção da Unidade; badges e inputs readonly para ocupação/situação; registro de obras exclusivamente no campo Observação. |
| **DR006** | "Exige anexo", "Exige termo" e "Múltiplos animais" desligadas por padrão; Tabela editável de Campos Adicionais. | Estado inicial `false` para todos os toggles; tabela dinâmica de atributos com tipo de dado, unidade e ordem. |
| **DR007 / DR001** | Código oficial `UR-XXX-000001` gerado pelo sistema; Marcações físicas (microchip) em tabela separada; Status, Unidade e Procedência somente leitura; Sigilo e Candidato à Guarda desligados por padrão. | Gerador automático de código a partir da regional; tabela independente para microchips/anilhas; inputs travados para situação operacional; switches restritos ao Gestor de Fauna. |

---

## 🚀 5. Critérios de Homologação & Gate de Qualidade

1. **Zero Erros de Compilação**: Execução mandatória de `npm run build` a cada tela criada.
2. **Inspeção Visual Autônoma**: Capturas Playwright no Light Mode oficial do GLA para verificação de alinhamento, densidade e contrastes.
3. **Persistência de Dados em Mock**: Criação de stores de dados relacionais e mockados em `src/data/faunaMock.ts` conectando Espécies, Unidades, Documentos, Procedências, Recintos, Manejos e Animais com dados baianos realistas.
4. **Deploy Automático**: Sincronização contínua com `git push origin main` e validação ao vivo em `https://inema.acto.com.br/`.
