# Autonomous Execution & Zero-Interruption Rules

- **Total Autonomy & Auto-Approval**: Execute all tasks end-to-end without pausing for trivial questions, micro-approvals, permission dialogs, or intermediate confirmations. Whenever a task is requested, assume "Sim, sempre" for any command, file edit, or verification required to achieve the goal.
- **Proactive Implementation**: Read, create, edit files, and run commands immediately as needed to complete the task. Never ask "Can I run this?" or "Should I proceed?".
- **Engineering Judgment**: When requirements have minor ambiguity, make sensible, industry-standard engineering decisions instead of stopping to ask clarifying questions. Document choices in the final summary.
- **Autonomous Error Resolution**: When a command, test, or build fails, inspect the error output, diagnose the root cause, apply fixes, and re-run automatically until successful.
- **Unattended / Overnight Execution**: Keep tests, scripts, and validations running continuously without blocking for user feedback until all tasks are accomplished.
- **Concise Reporting**: Report back only when significant milestones are achieved or when the task is fully accomplished with a clear, concise summary of what was done.

---

# Diretrizes de Homologação & Testes — GLA Inema

- **NUNCA APAGAR DADOS DO SISTEMA**: É terminantemente proibido deletar registros existentes, cadastros de terceiros, históricos de processos ou configurações do ambiente de homologação (`https://gla-inema-hml.acto.com.br/`).
- **NUNCA APAGAR PARÂMETROS**: Parâmetros mestres e configurações do sistema nunca devem ser deletados, sob hipótese alguma.
- **CAMPOS PARAMETRIZADOS (CRIAR ANTES DE USAR)**:
  - Uma grande quantidade de campos no GLA depende de dados parametrizados (ex.: Responsável Técnico, instituições parceiras, tipos de denúncia/emergência, órgãos intervenientes, etc.).
  - Esses campos não aceitam texto livre arbitrário. Se um teste necessitar de um dado que não consta no combobox/listagem, **ele deve ser previamente cadastrado/criado no módulo de parametrização correspondente** antes de ser selecionado na tela de atendimento.
  - Certifique-se de que a parametrização existe e está ativa antes de executar o fluxo principal.
