# Plano Estratégico de Merge: Protótipo Cliente SEIA × Arquitetura Filament INEMA

## 1. Contexto e Diagnóstico do Protótipo do Cliente (Figma)
O protótipo fornecido pelo cliente (`Seia-Plataforma`) traz a modelagem funcional concebida internamente pelas equipes de negócio do INEMA. Trata-se de uma interface de média fidelidade com alto valor funcional em regras de fluxo, mas com fragilidades visuais típicas de ferramentas de desenho livre (espaçamentos desalinhados, falta de hierarquia tipográfica consistente, tabelas sem componentização de estados de linha e paleta de cores não ancorada nas diretrizes oficiais do Estado).

---

## 2. Ingestão de Ideias Funcionais do Cliente

| Módulo / Funcionalidade do Cliente | Valor de Negócio Identificado | O que Aproveitar (A Boa Ideia) | O que Eliminar / Refatorar (Ajuste Técnico) |
| :--- | :--- | :--- | :--- |
| **Home / Central de Notificações e Atalhos** | Centraliza comunicados do sistema, alertas de prazos de processos (CERH/Licenças) e atalhos de rotina. | • Bloco de alertas com prazos de vencimento;<br>• Feed de comunicados institucionais;<br>• Grid de atalhos rápidos (`Novo Processo`, `Consultar DAE`, `Emitir Relatório`). | • Substituir o layout solto por cards de widgets estruturados (`FilamentWidget`);<br>• Padronizar métricas numéricas com badge de tendência. |
| **Módulo Financeiro & Gestão de DAEs** | Gestão de Documentos de Arrecadação Estadual com acompanhamento de taxas e multas. | • Listagem densa com status de pagamento (`Pago`, `Emitido`, `Vencido`);<br>• Ações diretas: `Emitir DAE`, `Arquivo de Retorno`, `Exportar PDF`. | • Reconstruir como `FilamentTable` canônica com paginação oficial, badges semânticos e ordenação por coluna;<br>• Alinhar com os requisitos do Banco do Brasil e SEFAZ-BA. |
| **Visualização / Ficha do Processo** | Consulta unificada de dados cadastrais, interessado, taxas associadas e histórico. | • Visão holística sem necessidade de abrir múltiplas abas;<br>• Histórico cronológico de tramitação. | • Uso de abas oficiais `FilamentTabs` e cartões de metadados padronizados. |
| **Wizard de Cadastro (5 Etapas)** | Requerimento de atos ambientais dividido em: Identificação ➔ Localização ➔ Atividades ➔ Documentos ➔ Resumo. | • Segmentação clara do formulário;<br>• Stepper sequencial com validações por etapa. | • Implementar como `FilamentWizard` com salvaguardas de validação, auto-save e barra de navegação responsiva. |

---

## 3. Matriz de Merge Arquitetural (Filament vs. Figma)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   SEIA PLATAFORMA HÍBRIDO (FILAMENT)                     │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. HEADER INSTITUCIONAL: Verde Oficial (#0F4C3A) + Logo SEIA / INEMA     │
│ 2. SIDEBAR HIERÁRQUICA: Árvore Filament com ícones sóbrios e badges mono │
├──────────────────────────────────┬───────────────────────────────────────┤
│    VISÕES PRINCIPAIS DO MERGE    │        PADRÃO TÉCNICO APLICADO        │
├──────────────────────────────────┼───────────────────────────────────────┤
│ A. Dashboard & Central SEIA      │ Filament Stats Overview + Alert Feeds │
│ B. Gestão de DAEs & Arrecadação  │ Filament Dense Data Table + Actions   │
│ C. Wizard de Requerimento        │ Filament Step-by-Step Multi-Form      │
│ D. Relatórios Consolidados       │ Filament Filter Toolbar + Recharts    │
└──────────────────────────────────┴───────────────────────────────────────┘
```

---

## 4. Estratégia DevOps de Apresentação (Os 3 Ambientes)

Para a apresentação de amanhã, o cliente poderá transitar entre as três perspectivas estratégicas:

1. **Inema Legado (`/relatorios-antigo.html` ou branch `legado`):**
   - Prova de respeito ao ecossistema atual: o sistema exatamente como eles conhecem e operam hoje, com as correções de bugs aplicadas.
2. **Novo INEMA - Conceito Premium Moderno (`/proposta-01.html` ou rota `conceito`):**
   - Demonstração da nossa capacidade técnica avançada, gráficos modernos e dashboards de alta densidade.
3. **INEMA Híbrido (O Merge Oficial - Rota Padrão / `hibrido`):**
   - A fusão perfeita: o modelo mental que o cliente desenhou no Figma (DAEs, Central de Alertas, Atalhos e Fluxos), executado com o rigor, a robustez e a componentização enterprise do Filament.

---

## 5. Escopo da Base do INEMA Híbrido (Etapa 4)
Para a entrega desta noite sem dispersão de esforço, implementaremos com acabamento pixel-perfect:
- **Base do Sistema Híbrido:** Design tokens oficiais SEIA (`#0F4C3A`, `#10B981`, `#F59E0B`, `#E11D48`), Navbar com busca integrada e Sidebar unificada.
- **Tela Chave 1 (A Central):** `Home SEIA` (Alertas de Prazos, Comunicados, Atalhos de Ação Rápida e Métricas de Processos).
- **Tela Chave 2 (A Tabela Operacional):** `Gestão de DAEs` (Tabela Filament com paginação, filtros, badges de arrecadação e ações de emissão/retorno).
