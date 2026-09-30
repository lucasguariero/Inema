# 03 — Roteiro de Prompts para o ChatGPT (Auditoria por Lotes)

Copie e cole os prompts abaixo no ChatGPT conforme for fazendo o upload de cada lote de arquivos.

---

## 💬 Prompt 1 (Junto com os arquivos da pasta `Lote_1_Textos`)

```text
Olá, ChatGPT! Você atuará como o meu Auditor Sênior de UI/UX e Engenharia de Software.
Estou te enviando os arquivos de documentação técnica e regras de negócio da entrega do módulo "Relatórios de Regulação SEIA" (solicitação da analista Maria do INEMA).

O objetivo desta auditoria é verificar se a implementação desenvolvida atende rigorosamente aos requisitos do "Guia UX - Relatórios de Regulação SEIA", sem vícios de IA (AI-slop), com padrão visual Filament/GLA (#0F4C3A) e foco em usabilidade governamental.

Por favor, leia estes arquivos de texto com atenção. Em seguida, confirme que entendeu o escopo, as regras de negócio (RN001 a RN008) e as limitações declaradas para que eu possa enviar os lotes de capturas de tela (Lote 2: Visão Geral, Lote 3: Painéis e Filtros, Lote 4: Interações e Estados).
```

---

## 💬 Prompt 2 (Junto com os arquivos da pasta `Lote_2_Visao_Geral`)

```text
Aqui estão as capturas de tela do Lote 2: Visão Geral das interfaces em resolução 1920x1080px (Full HD nativo).

Arquivos anexados:
1. Aba_1_Tramitacoes_no_Periodo_Completa.png
2. Aba_1_Tabela_Registros_Paginacao.png
3. Aba_2_Acompanhamento_da_Pauta_Completa.png
4. Aba_2_Tabela_Pauta_Casos_Contraste.png
5. Tela_Cheia_Detalhes_Completos_Nivel_2_Topo.png
6. Detalhes_Completos_Nivel_2_Atos_Tramitacao.png
7. Detalhes_Completos_Nivel_2_Comunicacao_Tempos.png

Avalie especificamente:
- A fidelidade visual da paleta Filament (#0F4C3A, superfícies limpas, ausência de roxo ou teal genérico);
- O isolamento do menu lateral (sidebar exibindo apenas Regulação > Relatórios de Regulação para a analista Maria);
- O carimbo temporal de corte (SEIA, 22/09/2026 10:00) e alternância de métricas dos gráficos (Processos vs Registros);
- Os casos de contraste canônicos na tabela da Pauta (processo sem tramitação com 45d, sem atribuição técnica, aguardando requerente e em análise);
- A estrutura completa do modal de Detalhes em 7 blocos (especialmente a ausência de CPF/CNPJ público e a separação de comunicação e tempos com a Portaria 25.753/2022).
```

---

## 💬 Prompt 3 (Junto com os arquivos da pasta `Lote_3_Paineis_e_Filtros`)

```text
Aqui estão as capturas de tela do Lote 3: Painéis e Filtros em resolução 1920x1080px.

Arquivos anexados:
1. Painel_Filtros_Aba_1_Tramitacoes.png
2. Painel_Filtros_Aba_2_Pauta.png
3. Painel_Lateral_Resumo_Aba_1_Tramitacoes.png
4. Painel_Lateral_Resumo_Aba_2_Pauta.png
5. Modal_Sobre_os_Dados_SEIA.png

Avalie especificamente:
- A ergonomia e completude das duas gavetas laterais de filtros (Tramitações vs Pauta);
- O comportamento do Drawer de Resumo Rápido (Nível 1) quando aberto a partir de Tramitações (foco no ato) vs quando aberto a partir da Pauta (foco na situação atual e equipe técnica, sem inventar registro inexistente);
- O botão de ação primária "Ver detalhes completos" e o alerta de orientação institucional;
- A clareza metodológica do modal "Sobre os dados" (origem SEIA, DIRRE/URs e regras de corte).
```

---

## 💬 Prompt 4 (Junto com os arquivos da pasta `Lote_4_Interacoes_e_Estados`)

```text
Aqui estão as capturas de tela do Lote 4: Interações e Estados em resolução 1920x1080px.

Arquivos anexados:
1. Sub_Visao_Atividades_Tecnico_Medias_NOUT.png
2. Estado_Contingencia_Media_Indisponivel.png
3. Sub_Visao_Por_Agrupamento_Nota_Distintos.png
4. Sub_Visao_Anual_DIRRE_Atos_Concluidos.png
5. Dropdown_Select_Estilizado_CSS.png
6. Estado_Tabela_Nenhum_Resultado.png
7. Botao_Exportar_Excel_Processando.png
8. Botao_Exportar_Excel_Concluido.png

Avalie especificamente:
- A implementação das visualizações especializadas da DIRRE (especialmente as médias do NOUT 18,4 / 54,2 / 108,1 com períodos completos e sem ranking punitivo);
- O estado de contingência "Média indisponível: cobertura do período não confirmada";
- A nota mandatória na visão por agrupamento sobre processos distintos;
- O acabamento dos selects/dropdowns institucionais e o estado vazio de busca ("Nenhum registro encontrado");
- Os micro-estados de feedback visual do botão "Exportar Excel" (processando com loader e concluído com ícone de check).

Por fim, emita o seu parecer consolidado: você aprova a entrega técnica desta task? Identifica algum vício de IA, inconsistência ou gap em relação ao Guia de UX?
```
