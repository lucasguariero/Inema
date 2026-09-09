# Inema - Sistema de Fiscalização

Sistema institucional para gestão ambiental - INEMA.

## Tecnologia

- Frontend: HTML + Tailwind CSS
- Design: Baseado no DESIGN.md do projeto

## Páginas & Módulos

- [x] Homepage - Portal inicial com dashboard (`src/index.html`)
- [x] Módulo de Fiscalização - Atendente & Cidadão (`src/fiscalizacao.html`)
- [x] Módulo de Emergência Química - DOR003 / DOR004 (`src/emergencia-quimica.html`)
- [x] Módulo de Gestão de Fauna Silvestre - CETAS / ASAS / SEIA (`src/fauna.html`)
- [x] Relatórios Gerenciais & Auditoria (`src/relatorios.html`)

## Estrutura

```
/src           - Código fonte (HTML, CSS, JS)
/obsidian      - Notas do projeto (Obsidian)
/docs          - Documentação
/Stitch        - Layouts e interfaces de referência
```

## Design System

- Primary: #0a473a (verde institucional)
- Sidebar: 280px fixa
- Tipografia: Inter
- Cards com ícones e links de acesso

## Comandos

```bash
# Abrir homepage
open src/index.html
```

## Autonomous Execution & Zero-Interruption Rules

- **Total Autonomy**: Execute all tasks end-to-end without pausing for trivial questions, micro-approvals, or intermediate confirmations.
- **Proactive Implementation**: Read, create, edit files, and run commands immediately as needed to complete the task. Never ask "Can I run this?" or "Should I proceed?".
- **Engineering Judgment**: When requirements have minor ambiguity, make sensible, industry-standard engineering decisions instead of stopping to ask clarifying questions. Document choices in the final summary.
- **Autonomous Error Resolution**: When a command, test, or build fails, inspect the error output, diagnose the root cause, apply fixes, and re-run automatically until successful.
- **Concise Reporting**: Report back only when significant milestones are achieved or when the task is fully accomplished with a clear, concise summary of what was done.

