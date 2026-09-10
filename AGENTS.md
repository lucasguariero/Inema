# Autonomous Execution & Zero-Interruption Rules

- **Total Autonomy & Auto-Approval**: Execute all tasks end-to-end without pausing for trivial questions, micro-approvals, permission dialogs, or intermediate confirmations. Whenever a task is requested, assume "Sim, sempre" for any command, file edit, or verification required to achieve the goal.
- **Proactive Implementation**: Read, create, edit files, and run commands immediately as needed to complete the task. Never ask "Can I run this?" or "Should I proceed?".
- **Engineering Judgment**: When requirements have minor ambiguity, make sensible, industry-standard engineering decisions instead of stopping to ask clarifying questions. Document choices in the final summary.
- **Autonomous Error Resolution**: When a command, test, or build fails, inspect the error output, diagnose the root cause, apply fixes, and re-run automatically until successful.
- **Unattended / Overnight Execution**: Keep tests, scripts, and validations running continuously without blocking for user feedback until all tasks are accomplished.
- **Concise Reporting**: Report back only when significant milestones are achieved ou quando a tarefa for concluída, gerando o parecer final pronto para colar no card/Mattermost.

---

# Diretrizes de Homologação & Testes — GLA Inema

- **NUNCA APAGAR DADOS DO SISTEMA**: É terminantemente proibido deletar registros existentes, cadastros de terceiros, históricos de processos ou configurações do ambiente de homologação (`https://gla-inema-hml.acto.com.br/`).
- **NUNCA APAGAR PARÂMETROS**: Parâmetros mestres e configurações do sistema nunca devem ser deletados, sob hipótese alguma.
- **CAMPOS PARAMETRIZADOS (CRIAR ANTES DE USAR)**:
  - Uma grande quantidade de campos no GLA depende de dados parametrizados (ex.: Responsável Técnico, instituições parceiras, tipos de denúncia/emergência, órgãos intervenientes, etc.).
  - Esses campos não aceitam texto livre arbitrário. Se um teste necessitar de um dado que não consta no combobox/listagem, **ele deve ser previamente cadastrado/criado no módulo de parametrização correspondente** antes de ser selecionado na tela de atendimento.
  - Certifique-se de que a parametrização existe e está ativa antes de executar o fluxo principal.

---

# Padrão Oficial de Organização de Pastas & Relatórios de QA (Acto/Inema)

Para cada card/teste a ser executado, a estrutura de pastas e arquivos DEVE ser rigorosamente padronizada:

### 📁 Estrutura de Pastas por Card (`qa/cards/[identificador-do-card]/`):
```text
qa/cards/[identificador-do-card]/
├── checklist.md             # Checklist interno com o mapeamento e validações (NÃO ANEXAR NO CARD)
├── comentario-card.txt      # Texto pronto e formatado para copiar e colar no card/Mattermost
├── anexos.zip               # Pacote zip contendo APENAS os prints necessários devidamente nomeados
└── prints/                  # Capturas de tela (ex.: "Print 01 - Visualizar bloqueado.png")
```

### 🖼️ Regra de Seleção de Prints (Evidências):
- **O checklist NÃO é anexado no card**: fica apenas arquivado internamente na pasta do teste.
- **Anexar apenas os prints estritamente necessários**: não anexar dezenas de telas triviais. Manter seleção cirúrgica (normalmente 4 a 6 prints relevantes, com contraste e comprovação clara).
- **Se o teste NÃO passar**: anexar obrigatoriamente o print do erro, demonstrando a divergência com o requisito e o comportamento incorreto da tela.
- **Nomenclatura descritiva dos prints**: Sempre no formato:
  - `Print 01 - [Descrição curta do que está sendo comprovado].png`
  - `Print 02 - [Descrição curta].png`

### 📝 Padrão do Texto (`comentario-card.txt`):
```markdown
Fala @[nome-do-dev]! Retestei o card de "[Nome da Funcionalidade / Título do Card]". Segue o resultado:

Resolvido: [Ação executada com dados concretos (valores, cadastros)] e confirmei que [comportamento observado], com a mensagem "[mensagem exata]" (Print 01). Pra contraste, testei [cenário de contraste] (Print 02).
Não resolvido: [Caso algum ponto tenha falhado, descrever exatamente o que aconteceu e o que era esperado] (Print XX).
Fora do escopo deste card: [Bugs periféricos encontrados que não impedem o fechamento do card atual].
Com isso, considero este card resolvido / [ou parecer correspondente].
Fico à disposição se precisar de mais detalhes de qualquer um desses pontos.
```
