# Checklist Interno de Homologacao - DOR006 (Cadastro de Plantonista)

- **Tela / Modulo**: Modulo Fiscalizacao > Cadastro de Plantonista (TL001)
- **Documento de Referencia**: DOR006 - Cadastro de Plantonista
- **Data da Validacao**: 18/09/2026
- **Status Geral**: APROVADO

---

## Mapeamento de Regras de Negocio (RN)
- [x] **RN001 - Consulta e Importacao do Cadastro Basico**: O sistema busca pelo Nome ou CPF na base basica de servidores e preenche Nome, CPF, Telefone e E-mail automaticamente.
- [x] **RN002 - Obrigatoriedade de Campos**: Todos os campos (Nome, CPF, Telefone Institucional, Telefone do Plantonista, E-mail, UR e Abrangencia) sao obrigatorios para gravacao.
- [x] **RN003 - Unicidade do Cadastro**: Impede duplicidade de cadastro por Nome, CPF e Telefone.
- [x] **RN004 - Parametrizacao da UR**: A Unidade Regional aceita selecao unica oficial parametrizada no INEMA.
- [x] **RN005 - Area de Abrangencia Obrigatoria**: Exige ao menos um municipio da Bahia selecionado e associado a UR.
- [x] **RN006 - Bloqueio de Gravacao**: Impede salvar se qualquer dado obrigatorio estiver pendente.
- [x] **RN007 - Chave de Consulta no Recuperar**: Permite recuperar cadastro a partir de CPF informado.
- [x] **RN008 - Confirmacao de Exclusao**: Dispara modal de confirmacao (MSG004) antes de excluir.
- [x] **RN009 - Integridade com Escala**: Alerta de impedimento se o plantonista estiver vinculado a uma escala ativa.
- [x] **RN010 - Protecao de Campos na Edicao**: Ao recuperar registro, somente Telefone Institucional, UR e Abrangencia podem ser modificados. Nome, CPF e contatos importados ficam bloqueados.

---

## Mapeamento de Mensagens Normativas
- [x] **MSG001**: "Cadastro de plantonista gravado com sucesso." (Validado no modal de gravacao)
- [x] **MSG002**: "Campos obrigatorios nao preenchidos."
- [x] **MSG003**: "Ja existe um plantonista cadastrado com este CPF."
- [x] **MSG004**: "Deseja excluir o cadastro do plantonista?"
- [x] **MSG005**: "Exclusao realizada com sucesso."
- [x] **MSG006**: "Nao existe cadastro para o plantonista informado."
- [x] **MSG007**: "Nao e possivel excluir o plantonista pois existem escalas vinculadas."

---

## Botoes e Acoes Mapeadas
- [x] **BOT001 - Salvar**: Valida obrigatoriedades e grava o plantonista.
- [x] **BOT002 - Recuperar**: Recupera dados cadastrais bloqueando campos conforme RN010.
- [x] **BOT003 - Excluir**: Dispara fluxo de confirmacao e exclusao logica/fisica segura.
