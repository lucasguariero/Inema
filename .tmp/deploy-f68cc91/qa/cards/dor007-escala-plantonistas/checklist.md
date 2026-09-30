# Checklist Interno de Homologacao - DOR007 (Cadastro de Escala de Plantonistas)

- **Tela / Modulo**: Modulo Fiscalizacao > Cadastro de Escala de Plantonistas (TL001)
- **Documento de Referencia**: DOR007 - Cadastro de Escala de Plantonistas
- **Data da Validacao**: 18/09/2026
- **Status Geral**: APROVADO

---

## Mapeamento de Regras de Negocio (RN)
- [x] **RN001 - Periodo da Escala**: Data de inicio e data de fim sem horario, aceitando datas futuras e intervalo semanal.
- [x] **RN002 - Unidade Regional Obrigatoria**: Selecao obrigatoria de UR a partir do catalogo oficial do INEMA.
- [x] **RN003 - Multiplos Plantonistas**: Permite adicionar varios tecnicos plantonistas a mesma escala, associados ao mesmo periodo e UR.
- [x] **RN004 - Selecao Obrigatoria do Plantonista**: Exige ao menos um plantonista vinculado a escala para permitir salvamento.
- [x] **RN005 - Integracao dos Telefones**: Ao selecionar o plantonista, recupera automaticamente telefone institucional e pessoal do cadastro (DOR006), protegendo de edicao direta.
- [x] **RN006 - Motorista Opcional**: Motorista da semana e telefone do motorista configurados como opcionais.
- [x] **RN007 - Numero de Horas**: Aceita apenas numeros ate 10 digitos.
- [x] **RN008 - Numero Equivalente**: Aceita numeros e simbolos (ponto, virgula) ate 10 caracteres.
- [x] **RN009 - Validacao de Campos Obrigatorios**: Bloqueia gravacao com MSG001 se qualquer dado obrigatorio faltar.
- [x] **RN010 - Prevencao de Duplicidade**: Impede mesma combinacao de periodo, UR e mesmo plantonista (MSG003).
- [x] **RN011 - Salvamento da Escala**: Grava escala valida exibindo MSG002 ("Escala criada com sucesso!").
- [x] **RN012 - Recuperacao da Escala**: Consulta escala existente no periodo ou via lista lateral exibindo MSG005.
- [x] **RN013 - Exclusao da Escala**: Exibe confirmacao MSG004 (SIM/NAO) e confirma com MSG006.
- [x] **RN014 - Bloqueio de Sobreposicao**: Impede que o mesmo plantonista participe de escalas simultaneas em datas conflitantes.
- [x] **RN015 - Alteracao da Escala**: Permite edicao de escala recuperada, incluindo/removendo plantonistas e confirmando com MSG007.
- [x] **RN016 - Controle de Acesso e Auditoria**: Mapeado no fluxo interno e visualizacao das escalas.

---

## Mapeamento de Mensagens Normativas
- [x] **MSG001**: "Campo obrigatorio nao preenchido!"
- [x] **MSG002**: "Escala criada com sucesso!"
- [x] **MSG003**: "Escala ja cadastrada"
- [x] **MSG004**: "Deseja excluir a escala do periodo?"
- [x] **MSG005**: "Escala ja registrada"
- [x] **MSG006**: "Exclusao realizada com sucesso"
- [x] **MSG007**: "Escala atualizada com sucesso!"

---

## Botoes e Acoes Mapeadas
- [x] **BOT001 - Salvar**: Valida RN009, RN010 e RN011, gravando ou atualizando a escala.
- [x] **BOT002 - Recuperar**: Consulta escala cadastrada no periodo ou selecionada (RN012).
- [x] **BOT003 - Excluir**: Dispara modal de confirmacao MSG004 e efetua exclusao segura (RN013).
