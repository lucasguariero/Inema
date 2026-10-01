# Instrução Arquitetural — Componentização Absoluta & Imutabilidade do Design System SEIA V2

> **DOCUMENTO NORMATIVO DE ENGENHARIA DE SOFTWARE E DESIGN SYSTEM**  
> **Sistema**: SEIA V2 / GLA — Instituto do Meio Ambiente e Recursos Hídricos (INEMA)  
> **Finalidade**: Erradicar a criação dispersa de código HTML/CSS cru nas páginas e estabelecer a regra inegociável de **Single Source of Truth (SSOT)**: qualquer redesign futuro deve ser viável alterando **exclusivamente os componentes e tokens do Design System**, sem tocar em uma única linha de código das páginas operacionais.

---

## 1. O Princípio Fundamental: Por que TUDO Deve Estar Componentizado?

### O Problema do Código Ad-Hoc ("Go-Horse")
Quando uma página constrói sua própria tabela com `<table>`, `<div className="overflow-x-auto">`, `<th>` estilizados manualmente, ou cria badges manuais com `<span className="bg-amber-50 text-amber-700 border border-amber-200">`, ou inventa botões com classes utilitárias isoladas:
1. **Quebra o Dark Mode**: Cores estáticas não reagem às variáveis de tema.
2. **Impede Redesigns**: Se a diretoria ou a equipe de design do Inema solicitar uma alteração na identidade visual (ex: diminuir o raio de borda de `rounded-xl` para `rounded-lg`, trocar a fonte de dados monoespaciais, ajustar a densidade das linhas da tabela ou adotar uma nova paleta semântica), o time é obrigado a caçar e reescrever dezenas de páginas individuais.
3. **Multiplica Inconsistências**: Cada analista ou modelo de IA implementa um espaçamento diferente, uma sombra diferente e uma altura de botão diferente, degradando a percepção de qualidade do sistema.

### A Arquitetura em 3 Camadas Invioláveis
```
┌────────────────────────────────────────────────────────┐
│ Camada 1: Design Tokens Globais                        │
│ (src/styles/globals.css)                               │
│ - Paleta primária (#0F4C3A), Semânticas, Raios, Sombras│
└──────────────────────────┬─────────────────────────────┘
                           │ Consumido por
┌──────────────────────────▼─────────────────────────────┐
│ Camada 2: Componentes do Design System (Imutáveis)     │
│ (src/components/filament/ & src/components/ui/)        │
│ - Button, Badge, InputWrapper, TableContainer,         │
│   TableToolbar, Section, FilamentSelect, Wizard, Tabs  │
└──────────────────────────┬─────────────────────────────┘
                           │ Consumido por
┌──────────────────────────▼─────────────────────────────┐
│ Camada 3: Páginas Operacionais (Composição Pura)       │
│ (src/pages/seia-v2/, src/pages/fiscalizacao/, etc.)    │
│ - Zero HTML cru, Zero estilos utilitários de tema.     │
│ - Responsabilidade: Estado, Regras de Negócio e Dados. │
└────────────────────────────────────────────────────────┘
```
**Regra de Ouro**: Se o design mudar amanhã, você mexe **SOMENTE na Camada 1 e na Camada 2**. A Camada 3 reflete o novo design **automaticamente**, sem necessidade de refatoração manual.

---

## 2. Diagnóstico dos Débitos Técnicos Atuais nas Páginas

Uma auditoria no repositório identificou violações críticas dessa arquitetura em páginas recém-criadas ou editadas:

| Arquivo / Tela | Violação Identificada | Correção Obrigatória |
| :--- | :--- | :--- |
| `AcessoPublicoPage.tsx` | Tabela crua manual com tags `<table>`, `<thead>`, `<tbody>` soltas; barra de busca não integrada; botões de ação como texto cru (`Ver detalhes →`); badge usando classes condicionais inline. | Substituir integralmente por `<TableContainer>`, `<TableToolbar>`, botões `<Button variant="outline" size="xs">` e `<Badge>`. |
| `NotificacoesPage.tsx` | Tabela construída manualmente com divs de barra de ferramentas isoladas, cabeçalho de ações oculto com `sr-only`, e botões de marcação com classes soltas. | Migrar para `<TableContainer>` com header padronizado, e botões canônicos do Design System. |
| `SeiaDaesPage.tsx` | Badges de status com classes Tailwind fixas no JSX (`bg-amber-50 text-amber-700 border border-amber-200`) sem suporte a Dark Mode. | Substituir por `<Badge color="warning">` para *Emitido*, `<Badge color="success">` para *Pago* e `<Badge color="danger">` para *Vencido*. |
| `AnslaPage.tsx` | Inputs e checkboxes manuais no wizard (`<input className="w-full px-3 py-2..." />`) em vez do wrapper oficial. | Padronizar com `<InputWrapper>` e componentes primitivos de formulário. |
| `EmergenciaInternaPage.tsx` | Card de protocolo manual com pill solto no header principal da página. | Eliminar pill do header; utilizar o componente `<Section>` e `<InputWrapper>` para campos informativos. |
| `ConsultaExternaPage.tsx` | Tabela de resultados com cabeçalhos e células estilizados ad-hoc. | Padronizar com `TableContainer` e `GlaTable`. |

---

## 3. Catálogo Canônico de Componentes (O que Usar para Cada Elemento)

É **TERMINANTEMENTE PROIBIDO** criar HTML cru para qualquer elemento repetitivo. Todo elemento DEVE importar seu correspondente oficial de `src/components/filament/` ou `src/components/ui/`:

### 3.1. Tabelas & Listagens de Dados
- **Componentes**: `TableContainer` e `TableToolbar` (de `src/components/filament/Table.tsx`) ou componentes canônicos `GlaTableContainer`, `GlaThead`, `GlaTbody`, `GlaTr`, `GlaTh`, `GlaTd`, `GlaTablePagination` (de `src/components/common/GlaTable.tsx`).
- **O que NUNCA fazer**:
  ```tsx
  // ❌ PROIBIDO: Tabela manual crua
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b">...</tr>
      </thead>
  ```
- **O que SEMPRE fazer**:
  ```tsx
  // ✅ OBRIGATÓRIO: Uso dos componentes oficiais
  import { TableContainer, TableToolbar, Badge, Button } from '@/components/filament';

  <TableContainer
    heading="Histórico de Consultas"
    description="Relação de portarias e atos expedidos pelo INEMA"
    toolbar={
      <TableToolbar
        searchValue={termoBusca}
        onSearchChange={setTermoBusca}
        searchPlaceholder="Buscar por protocolo, interessado ou município..."
        actions={
          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Exportar</span>
          </Button>
        }
      />
    }
    pagination={<GlaTablePagination ... />}
  >
    <table className="w-full text-left text-xs">
      {/* Células padronizadas */}
    </table>
  </TableContainer>
  ```

### 3.2. Ações & Botões
- **Componente**: `Button` (de `src/components/ui/button.tsx` ou reexportado em `src/components/filament`).
- **Variantes Oficiais**: `primary` (`#0F4C3A`), `outline`, `ghost`, `danger`, `warning`, `success`.
- **Tamanhos Oficiais**: `xs` (28px - para tabelas e ações densas), `sm` (32px), `default`/`md` (36px), `lg` (40px).
- **O que NUNCA fazer**:
  ```tsx
  // ❌ PROIBIDO: Botão ou link feito do zero com texto e setinha solta
  <button className="text-xs font-semibold text-slate-700 hover:text-[#0F4C3A]">
    Ver detalhes →
  </button>
  ```
- **O que SEMPRE fazer**:
  ```tsx
  // ✅ OBRIGATÓRIO: Botão do Design System
  <Button
    variant="outline"
    size="xs"
    onClick={() => handleVisualizar(item)}
    className="h-7 text-xs font-medium"
  >
    <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
    <span>Visualizar</span>
  </Button>
  ```

### 3.3. Badges, Tags & Indicadores de Status
- **Componente**: `Badge` (de `src/components/ui/badge.tsx`).
- **Cores Semânticas**: `primary` (verde institucional), `gray`, `danger` (crítico/indeferido), `warning` (pendência/análise/emitido), `success` (deferido/pago/concluído), `info`.
- **Propriedades**: `size="xs" | "sm" | "md"`, `dot={true}` para status com ponto indicador.
- **O que NUNCA fazer**:
  ```tsx
  // ❌ PROIBIDO: Pílula manual com classes estáticas
  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs">
    Emitido
  </span>
  ```
- **O que SEMPRE fazer**:
  ```tsx
  // ✅ OBRIGATÓRIO: Badge do Design System
  <Badge color="warning" size="sm" dot>
    Emitido
  </Badge>
  ```

### 3.4. Campos de Entrada (Inputs & Wrappers)
- **Componentes**: `InputWrapper` (de `src/components/filament/InputWrapper.tsx`).
- **Recursos Nativos**: Suporte automático a `prefixIcon`, `suffixIcon`, `label`, `required`, `hint`, feedback de erro `valid={false}` e anel de foco suave em conformidade com o tema.
- **O que NUNCA fazer**:
  ```tsx
  // ❌ PROIBIDO: Input jogado dentro de div arbitrária
  <div className="space-y-1">
    <label>Nome:</label>
    <input className="w-full px-3 py-2 border rounded-lg" />
  </div>
  ```
- **O que SEMPRE fazer**:
  ```tsx
  // ✅ OBRIGATÓRIO: InputWrapper do Design System
  <InputWrapper label="Município de Instalação" required prefixIcon={MapPin}>
    <input
      type="text"
      value={municipio}
      onChange={(e) => setMunicipio(e.target.value)}
      className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
      placeholder="Informe o município..."
    />
  </InputWrapper>
  ```

### 3.5. Seletores & Comboboxes Pesquisáveis
- **Componente**: `FilamentSelect` (de `src/components/filament/Select.tsx`).
- **Recursos Nativos**: Popover pesquisável com teclado, filtragem em tempo real, suporte a descrições e estados de foco institucionais.
- **O que NUNCA fazer**: Usar `<select>` cru do HTML para campos mestres com dezenas de opções (tipologias, técnicos, órgãos).

### 3.6. Seções Modulares de Telas & Formulários
- **Componente**: `Section` / `FilamentSection` (de `src/components/filament/Section.tsx`).
- **Recursos Nativos**: Recolhimento (`collapsible`), ícone de cabeçalho, `headerActions` para botões secundários e `footer` para botões de submissão.
- **O que NUNCA fazer**: `<div className="border border-slate-200 rounded-xl p-4 bg-white">` manual com títulos `<h2>` soltos.

### 3.7. Assistentes / Formulários Passo a Passo (Wizards)
- **Componente**: `FilamentWizard` (de `src/components/filament/Wizard.tsx`).
- **Regra**: Todo formulário em etapas deve usar o `FilamentWizard` oficial com chevrons SVG institucionais. **NUNCA** criar stepper próprio em nenhuma tela.

### 3.8. Abas de Alternância de Visão
- **Componente**: `FilamentTabs` (de `src/components/filament/Tabs.tsx`).
- **Regra**: Usar exclusivamente para alternar contextos de consulta e gestão (ex: *Pauta* vs *Calendário*).

---

## 4. Regras Rígidas para Novos Componentes

Caso uma nova funcionalidade exija um padrão de UI que **realmente não exista** no Design System:

1. **PROIBIDO CRIAR DIRETO NA PÁGINA**: O desenvolvedor ou IA está terminantemente proibido de programar a solução dentro do arquivo da página (`src/pages/...`).
2. **CRIAR PRIMEIRO NO DESIGN SYSTEM**:
   - Criar o componente em `src/components/filament/[NomeDoComponente].tsx` ou `src/components/ui/`.
   - Exportá-lo no índice `src/components/filament/index.ts`.
   - Utilizar exclusivamente tokens CSS (`var(--color-brand-primary)`, `var(--color-surface-default)`, etc.).
   - Suportar nativamente Light Mode e Dark Mode neutro.
3. **DOCUMENTAR NO CATÁLOGO DO DESIGN SYSTEM**:
   - Adicionar o espécime visual e o código de exemplo em `src/pages/seia-v2/SeiaV2DesignSystemPage.tsx`.
4. **CONSUMIR NA PÁGINA**:
   - Só depois de homologado no Design System, a página importa e consome o componente.

---

## 5. Plano de Ação para Saneamento Imediato do Código (Passo a Passo)

A execução deste saneamento deve seguir esta ordem cronológica estrita:

### Fase 1: Saneamento das Listagens e Tabelas (Prioridade Crítica)
1. **Refatorar `AcessoPublicoPage.tsx`**:
   - Substituir tabela manual por `<TableContainer>` e `<TableToolbar>`.
   - Substituir links `Ver detalhes →` por `<Button variant="outline" size="xs">`.
   - Adicionar o botão primário institucional `+ Acompanhar Registros` via `<Button variant="primary">`.
   - Substituir pílulas manuais de tipo de licença por `<Badge>`.
2. **Refatorar `NotificacoesPage.tsx`**:
   - Adicionar cabeçalho oficial com título e contadores no container da tabela.
   - Substituir ações da linha por botões compactos do Design System (`Visualizar` e `Marcar Lida`).
3. **Refatorar `SeiaDaesPage.tsx`**:
   - Substituir as tags `<span>` manuais dos status `Pago`, `Emitido` e `Vencido` por chamadas canônicas a `<Badge color="...">` com variantes de Dark Mode automáticas.

### Fase 2: Saneamento dos Formulários & Wizards
1. **Refatorar `AnslaPage.tsx`**:
   - Padronizar os campos do wizard com `<InputWrapper>` e `<FilamentSelect>`.
   - Substituir caixas de critérios por componentes padronizados de checkbox com tokens semânticos.
2. **Refatorar `EmergenciaInternaPage.tsx`**:
   - Remover pill solto do cabeçalho.
   - Garantir que todos os blocos utilizem `<Section>` oficial do Filament.

### Fase 3: Auditoria do Dark Mode & Tokens
1. Executar varredura em todo o diretório `src/pages/` buscando ocorrências de:
   - `bg-emerald-50`, `bg-amber-50`, `bg-rose-50`, `bg-slate-50` sem a correspondente classe `dark:bg-...`.
   - `text-emerald-700`, `text-amber-700`, `text-rose-700` sem a correspondente classe `dark:text-...`.
2. Substituir todas as ocorrências encontradas pelas variantes de `<Badge>` ou variáveis semânticas do Design System.

---

## 6. Critérios de Homologação da Componentização

Um card ou tela só será considerado concluído e aprovado se atender a 100% dos seguintes requisitos:
- [ ] **Zero HTML cru**: Nenhuma tabela crua `<table>` solta; nenhum input sem `<InputWrapper>`; nenhum status sem `<Badge>`.
- [ ] **Zero Cores Estáticas Soltas**: Não conter classes utilitárias de cores de fundo ou texto aplicadas diretamente em elementos de status.
- [ ] **Compatibilidade com Dark Mode 100% Nativa**: A tela deve ser inspecionada visualmente tanto no tema claro quanto no escuro, garantindo legibilidade e contornos perfeitos.
- [ ] **Prova de Redesign**: Se o token `--color-brand-primary` ou os estilos do componente `Button` forem alterados em `globals.css` ou `button.tsx`, a tela deve refletir a mudança instantaneamente sem qualquer edição em seu próprio código.

---
*Esta instrução torna-se a diretriz oficial mandatória para toda e qualquer intervenção no repositório do INEMA/SEIA V2.*
