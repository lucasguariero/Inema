# Autonomous Execution & Zero-Interruption Rules

- **Total Autonomy & Auto-Approval**: Execute all tasks end-to-end without pausing for trivial questions, micro-approvals, permission dialogs, or intermediate confirmations. Whenever a task is requested, assume "Sim, sempre" for any command, file edit, or verification required to achieve the goal.
- **Proactive Implementation**: Read, create, edit files, and run commands immediately as needed to complete the task. Never ask "Can I run this?" or "Should I proceed?".
- **Engineering Judgment**: When requirements have minor ambiguity, make sensible, industry-standard engineering decisions instead of stopping to ask clarifying questions. Document choices in the final summary.
- **Autonomous Error Resolution**: When a command, test, or build fails, inspect the error output, diagnose the root cause, apply fixes, and re-run automatically until successful.
- **Unattended / Overnight Execution**: Keep tests, scripts, and validations running continuously without blocking for user feedback until all tasks are accomplished.
- **Concise Reporting**: Report back only when significant milestones are achieved or quando a tarefa for concluída, gerando o parecer final pronto para colar no card/Mattermost.

---

# Diretrizes de Homologação & Testes — GLA Inema

- **NUNCA APAGAR DADOS DO SISTEMA**: É terminantemente proibido deletar registros existentes, cadastros de terceiros, históricos de processos ou configurações do ambiente de homologação (`https://gla-inema-hml.acto.com.br/`).
- **NUNCA APAGAR PARÂMETROS**: Parâmetros mestres e configurações do sistema nunca devem ser deletados, sob hipótese alguma.
- **CAMPOS PARAMETRIZADOS (CRIAR ANTES DE USAR)**:
  - Uma grande quantidade de campos no GLA depende de dados parametrizados (ex.: Responsável Técnico, instituições parceiras, tipos de denúncia/emergência, órgãos intervenientes, etc.).
  - Esses campos não aceitam texto livre arbitrário. Se um teste necessitar de um dado que não consta no combobox/listagem, **ele deve ser previamente cadastrado/criado no módulo de parametrização correspondente** antes de ser selecionado na tela de atendimento.
  - Certifique-se de que a parametrização existe e está ativa antes de executar o fluxo principal.

---

# Padrão Oficial de Relatório de Teste / Comentário de Card (QA Acto/Inema)

Ao finalizar a execução e validação de qualquer card, o resultado final DEVE SEMPRE ser apresentado no formato padrão adotado pelo time de QA no Mattermost/GitLab/Jira, pronto para copiar e colar:

```markdown
Fala @[nome-do-dev]! Retestei o card completo hoje. Segue o resultado, item por item:
Resolvido: [Ação executada com dados concretos (valores, CPFs, textos)] e confirmei que [comportamento observado], com a mensagem "[mensagem exata do sistema]" (Print 01).
Resolvido: [Ponto 2 testado e validado] (Print 02).
Não resolvido: [Caso algum ponto tenha falhado, descrever exatamente o que aconteceu e o que era esperado] (Print XX).
Fora do escopo deste card: [Bugs periféricos ou comportamentos anômalos encontrados durante o teste que não pertencem ao escopo do card atual].
Com isso, considero este card resolvido / [ou o parecer correspondente].
Fico à disposição se precisar de mais detalhes de qualquer um desses pontos.
Prints anexados: Print 01 a Print XX (zip em anexo).
```

### Regras do Padrão:
1. **Item por item**: Começar cada linha com `Resolvido:` ou `Não resolvido:`.
2. **Dados concretos e literais**: Citar valores digitados, mensagens exatas entre aspas, nomes de botões e abas.
3. **Mapeamento de Prints**: Cada item referenciado no texto deve ter seu respectivo `(Print XX)` correspondente.
4. **Pacote Zip**: Gerar sempre um arquivo `.zip` com os prints renomeados sequencialmente (`Print 01.png`, `Print 02.png`, etc.) na pasta de saída.
