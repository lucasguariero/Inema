# Checklist Interno — Card 11: DAE – Requerente – Acesso e Consulta do Parcelamento (DR003 / TL001 / TL002)

> **Ambiente**: Homologação GLA Inema (`https://gla-inema-hml.acto.com.br/`)  
> **Perfil Testado**: Requerente / Usuário Externo (`00000000000`)  
> **Data**: 11/09/2026  
> **Resultado**: ✅ 100% APROVADO (PASS)

---

## 1. Tela Inicial de Parcelamento (TL002)
- [x] Menu lateral: agrupador `Requerimentos › Parcelamento` navegando com destaque.
- [x] Painéis expansíveis conformes ao DR003:
  - `Informações`: orientações gerais sobre débitos administrativos.
  - `Documentação Exigida`: relação de documentos.
  - `Valor`: condições de cálculo e pagamento.
  - `Prazos`: prazos regimentais.
- [x] Botão `Voltar`: navegação para tela anterior.
- [x] Botão `Solicitar Parcelamento`: visível e desabilitado com tooltip/badge "A solicitação de parcelamento ainda será disponibilizada." (conforme decisão de escopo do Card 1).

## 2. Tela Meus Processos (TL001)
- [x] Rota acessada: `/meus-processos`.
- [x] Abas de filtragem por status presentes: `Todos` (padrão), `Rascunho`, `Aguardando Pagamento`, `Em Análise`, `Pendentes` e `Concluído`.
- [x] Colunas ordenáveis: `Nº Processo`, `Data Formação`, `Ato`, `Etapa / Status`.
- [x] Campo de pesquisa rápida e listagem de processos reais vinculados ao usuário.
- [x] Ações por linha com menu suspenso de ações contextuais.
