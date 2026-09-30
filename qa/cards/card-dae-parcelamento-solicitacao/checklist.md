# Checklist Interno — Card 13: DAE – Requerente – Solicitação de Parcelamento (Wizard 3 Etapas: TL003–TL005)

> **Ambiente**: Homologação GLA Inema (`https://gla-inema-hml.acto.com.br/`)  
> **Perfil Testado**: Requerente / Usuário Externo (`00000000000`)  
> **Data**: 11/09/2026  
> **Resultado**: ✅ 100% APROVADO (PASS)

---

## 1. Etapa 01: Participantes (TL003)
- [x] Rota acessada: `/parcelamento/solicitar`.
- [x] Opções de "Quem sou eu?": `Requerente`, `Representante Legal`, `Procurador de Pessoa Física`, `Procurador de Pessoa Jurídica`.
- [x] Botão `Adicionar`: validação obrigatória dos dados e inserção na grid de partícipes com `CPF/CNPJ`, `Nome/Razão Social`, `Papel` e `Ações`.
- [x] Bloqueio de avanço para Etapa 2 sem ao menos 1 participante do tipo Requerente.

## 2. Etapa 02: Processo (TL004)
- [x] Banner informativo: *"Caso não possua o número do processo, solicite a Certidão de Debito."*.
- [x] Campo `Número do processo`: entrada de identificador alfanumérico e inclusão via ação `Incluir Processo`.
- [x] Tabela de processos adicionados com `Número do Processo`, `Data da Inclusão` e ações.
- [x] Persistência: navegação de retorno via `Anterior` mantendo os partícipes da Etapa 1 100% preservados.

## 3. Etapa 03: Resumo (TL005)
- [x] Tabelas consolidadas em somente leitura (Partícipes e Processos).
- [x] Alerta explicativo de encaminhamento das movimentações aos partícipes.
- [x] Checkbox obrigatório do Termo de Declaração de veracidade das informações.
- [x] Ação `Finalizar Pedido`: habilitada para submissão do parcelamento.
