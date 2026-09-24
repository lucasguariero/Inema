# Relatórios de Regulação — Guia para UX

Versão refinada · 22/09/2026

## 1. Objetivo e contexto

Desenhar uma área para consultar o trabalho realizado pelas unidades de regulação do INEMA e acompanhar os processos que precisam de atenção.

As planilhas e a reunião orientam as necessidades de consulta. **Esta versão utiliza somente dados do SEIA.** Não apresentar filtro, seletor ou coluna de sistema, nem telas de integração.

A entrega é o desenho das telas e de suas variações. Não é necessário produzir um protótipo navegável.

## 2. Organização

Reutilizar o padrão visual do SEIA apresentado nas referências: cabeçalho, menu lateral, tipografia, campos e botões.

Título: **Relatórios de Regulação**.

Descrição: “Consulte as tramitações e acompanhe os processos da regulação ambiental.”

Duas abas principais:

1. **Tramitações no período** — o que foi registrado em um intervalo.
2. **Acompanhamento da pauta** — quais processos precisam de acompanhamento na data de referência.

O detalhamento é compartilhado pelas duas abas. As visões por técnico, agrupamento e anual DIRRE são variações da primeira aba, não módulos separados.

No cabeçalho do conteúdo, mostrar **Dados do SEIA** e **Atualizado em: data e hora**. Usar datas e valores ilustrativos no desenho, identificados como tais na apresentação.

## 3. Tela 1 — Tramitações no período

Descrição da aba: “Consulte as tramitações e atividades registradas em um período.”

### Ordem dos componentes

1. Botão **Filtros**, com ícone de funil.
2. Filtros aplicados, com possibilidade de remover cada filtro opcional.
3. Dois cards de resumo.
4. Dois gráficos.
5. Seletor da visualização dos resultados.
6. Tabela.

Na área de ações dos resultados, próxima ao seletor de visualização e à tabela, incluir **Exportar Excel**, disponível após consulta válida com dados. A ação utiliza a visualização selecionada: Registros, Atividades por técnico, Por agrupamento ou Anual DIRRE.

### Painel lateral de filtros

| Campo | Componente |
|---|---|
| Unidade/coordenação | Lista pesquisável, múltipla, limitada ao acesso do usuário |
| Data inicial e data final da tramitação | Campos de data |
| Ato/atividade | Lista pesquisável, múltipla |
| Situação registrada | Lista pesquisável, múltipla |
| Técnico participante | Lista pesquisável, múltipla |
| Papel na equipe | Seleção única: qualquer, líder ou membro |
| Número do processo | Texto |
| Nome/razão social | Texto |
| Município | Lista pesquisável, múltipla |
| Tipologia | Lista pesquisável, múltipla |

Rodapé fixo do painel: **Limpar** e **Consultar**.

Período obrigatório, exceto na busca pelo número completo do processo. Nas listas, nenhuma seleção significa não restringir aquele critério dentro do acesso autorizado.

Município e tipologia representam os vínculos cadastrais disponíveis no SEIA. Prever campo desabilitado com mensagem “Informação indisponível para esta consulta” quando não houver cobertura.

Se o recorte histórico utilizar somente o cadastro atual desses campos, mostrar a nota “Município e tipologia conforme cadastro atual”.

### Cards

- **Processos com tramitação no período**.
- **Registros de atos/atividades no período**.

Um processo pode ter vários registros. Não usar “atos emitidos” como nome do segundo card.

### Gráficos

**Evolução no período:** colunas, com seleção de mês, trimestre, semestre ou ano. Mostrar o ano junto ao período.

**Distribuição:** barras horizontais, com seleção de unidade/coordenação, ato/atividade, situação ou técnico.

Permitir escolher a medida **Processos** ou **Registros de atos/atividades**. O título de cada gráfico deve indicar a medida. Clicar em uma barra aplica um filtro visível e removível.

### Visualização “Registros”

É a visualização inicial. Uma linha por registro de tramitação/atividade.

Colunas:

- Data da tramitação.
- Processo.
- Interessado.
- Unidade/coordenação do registro.
- Ato/atividade.
- Situação registrada.
- Equipe/participantes, quando disponíveis.
- **Detalhar**.

Ordenação inicial: registros mais recentes. Responsável institucional, quando existir, deve ter esse rótulo; não deve ser apresentado como técnico participante.

### Visualização “Atividades por técnico”

Colunas: **Técnico**, **Processos com participação**, **Registros com participação** e **Ver registros**.

No contexto exclusivo do NOUT, mostrar acima da tabela o bloco **Médias de processos**:

- Média mensal.
- Média trimestral.
- Média semestral.

Cada valor deve mostrar o período considerado e a quantidade de meses, trimestres ou semestres usados no cálculo. Incluir ícone de informação com a explicação: “Média dos totais de processos distintos de cada período completo considerado.”

Prever o estado “Média indisponível: cobertura do período não confirmada”. Não desenhar ranking de eficiência.

### Visualização “Por agrupamento”

Seletor **Agrupar por**: município, tipologia, ato/atividade ou situação.

Colunas: **Grupo**, **Processos**, **Registros de atos/atividades** e **Ver registros**.

Ao consultar os registros de um grupo, acrescentar município e tipologia à tabela quando disponíveis.

Nota abaixo da tabela: “Um processo pode aparecer em mais de um grupo. O total geral considera processos distintos.”

Não é necessário desenhar mapa.

### Visualização “Anual DIRRE”

Disponível para quem tiver permissão de consultar esse recorte.

Controles: **Ano** e **Família do ato** — todas, Florestal, Licença e Outorga. O ano substitui o intervalo de datas nessa visualização.

Mostrar:

- Resumo **Registros concluídos ou encaminhados para publicação**.
- Distribuição dos registros por família.
- Evolução mensal no ano.
- Tabela com **Família**, **Ato**, **Situação**, **Registros** e **Ver registros**.

Identificar as situações consideradas: **Concluído** e **Para publicação**. Esta visão conta registros; não oferecer troca para “atos emitidos”.

Prever aviso de atos **Não classificados** e informação sobre registros **Fora do recorte anual**. Na listagem detalhada, incluir responsável institucional e observação, quando disponíveis.

## 4. Tela 2 — Acompanhamento da pauta

Descrição: “Acompanhe a situação atual e o tempo sem movimentação dos processos.”

Mostrar **Pauta em: data e hora**. Não apresentar filtro de período histórico de tramitação.

### Filtros

- Unidade/coordenação atual.
- Técnico/equipe atual.
- Atribuição: todos, sem atribuição técnica ou com técnico/equipe.
- Situação atual do processo.
- Ato vinculado.
- Número do processo.
- Nome/razão social.
- Município e tipologia, quando disponíveis.
- Dias sem movimentação: mínimo e máximo.
- Situação do prazo, quando houver regra disponível: no prazo, excedido, suspenso, não aplicável ou indeterminado.

Manter funil, painel lateral, **Limpar**, **Consultar** e filtros aplicados no mesmo padrão da primeira tela.

### Resumo e gráficos

- Card **Processos na pauta consultada**.
- Card **Processos com prazo excedido**, somente no contexto com prazo disponível. Identificar a espécie do prazo.
- Gráfico de processos por situação atual.
- Gráfico de processos por faixas de dias sem movimentação. As faixas do desenho são ilustrativas, não prazos legais.

### Tabela

- Processo.
- Interessado.
- Unidade/coordenação atual.
- Técnico/equipe atual ou **Sem atribuição técnica**.
- Situação atual.
- Quantidade de atos vinculados.
- Última movimentação.
- Dias sem movimentação.
- Situação do prazo, quando aplicável.
- **Detalhar**.

Uma linha por processo, mesmo quando vários atos corresponderem ao filtro. Ordenação inicial: maior tempo sem movimentação; valores indeterminados ficam ao final.

Próximo às ações da tabela, incluir **Exportar Excel**, disponível após consulta válida com dados. Exportar a pauta consultada com os campos da tabela e uma linha por processo.

Desenhar exemplos de:

- Processo em análise técnica.
- Processo aguardando resposta do requerente.
- Processo formado sem nenhuma tramitação: mostrar **Sem tramitação registrada** e **Dias desde a formação**.
- Processo ainda sem atribuição técnica.

Dias sem movimentação não significam atraso automaticamente. Arquivados ficam fora da pauta pendente.

## 5. Detalhamento compartilhado

### Painel lateral de resumo

Abrir pela ação **Detalhar**. Mostrar processo, interessado, ato/atividade selecionado, data e situação do registro. Separar um bloco de **Situação atual**, com unidade, equipe e atualização.

Quando aberto pela pauta, priorizar situação e atribuição atuais; não inventar um “registro selecionado”.

Botão: **Ver detalhes completos**.

### Tela de detalhes completos

| Bloco | Campos |
|---|---|
| Identificação | Processo, requerimento vinculado quando disponível, interessado, empreendimento, município, tipologia e data de formação |
| Registro selecionado | Ato/atividade, data da tramitação, situação registrada, unidade do registro, participantes/responsável institucional e observação |
| Situação atual | Situação do processo, unidade atual, equipe atual, última movimentação, dias sem movimentação e atualização |
| Atos vinculados | Tabela com ato, tipologia e situação própria do ato |
| Histórico de tramitação | Data/hora, ocorrência, situação, responsável pela ação, destinatário e observação |
| Histórico de comunicação | Data/hora, tipo e descrição da comunicação |
| Tempos e prazos | Tempo em análise, tempo aguardando resposta, espécie do prazo, vencimento e situação, quando calculáveis |

Histórico de tramitação e comunicação são blocos separados. Prever **Tempo indisponível** quando os eventos não permitirem calcular a duração.

Se atos diferentes estiverem em análise e espera simultaneamente, mostrar essa condição no detalhe. Não representar os tempos como partes exclusivas de um total.

Não incluir CPF/CNPJ, contatos pessoais ou anexos nesta versão do relatório.

Ao retornar, preservar consulta, visualização, ordenação e página anteriores.

## 6. Comportamentos e estados

- Primeiro acesso sem números, com orientação para consultar.
- **Limpar** esvazia os campos editáveis e retorna ao estado inicial, preservando as restrições de acesso. Informar novamente período/ano quando necessário.
- Alteração de filtros mostra aviso: **Filtros alterados. Consulte para atualizar os resultados.**
- Cada aba mantém sua própria consulta. Não transferir situação histórica como situação atual.
- Paginação de 25 registros, com opções de 50 e 100.
- Totais e gráficos correspondem ao conjunto filtrado completo, não à página atual.

Desenhar: carregando, resultado, nenhum resultado, erro com **Tentar novamente**, informação indisponível, dados parciais/desatualizados e acesso restrito.

Ao lado da atualização, incluir **Sobre os dados**, abrindo um painel simples com data de atualização, referência e cobertura da consulta no SEIA. Não criar lista de sistemas.

### Exportar Excel — comportamento comum às duas perspectivas

**A exportação para Excel faz parte do escopo desta versão e deve permitir baixar o conjunto completo de resultados da consulta, respeitando os filtros aplicados.** É uma ação opcional sobre o resultado, sem nova tela, configuração ou seleção de colunas.

- Exportar os dados tabulares da visualização selecionada, com seus campos já definidos e a ordenação aplicada. Ações de interface como Detalhar e Ver registros não são colunas de dados do arquivo. Se Ver registros tiver aberto uma listagem detalhada, exportar essa listagem e seu recorte confirmado.
- Incluir todos os resultados filtrados, não apenas a página visível. Nas visões agrupadas, exportar todos os grupos/linhas da visualização; não substituir por registros detalhados não selecionados.
- Usar os filtros confirmados e o mesmo conjunto/referência da consulta exibida, mantendo seus totais e critérios. Não executar uma consulta diferente nem atualizar silenciosamente os dados para exportar.
- Se houver filtros em edição ainda não aplicados, manter o aviso existente e identificar junto à ação: “Exporta os resultados da última consulta confirmada.”
- Identificar no arquivo o relatório, perspectiva/visualização, data e hora da geração, filtros aplicados e referência dos dados, quando disponível. Preservar avisos de parcialidade/desatualização que afetem a interpretação.
- Não incluir novas colunas, fórmulas ou gráficos como imagens. Não é necessário desenhar um Excel real.
- Eventuais totais, médias ou resumos auxiliares no arquivo devem reproduzir os já apresentados nessa visualização, com os mesmos avisos. Não criar uma estrutura executiva adicional nem exigir diagramação ou abas específicas.

Desenhar os estados junto à ação, sem tela independente:

| Estado | Apresentação |
|---|---|
| Antes da consulta ou sem resultado válido | Exportar Excel desabilitado. |
| Resultado válido com dados | Exportar Excel disponível. |
| Processando | “Gerando Excel...” e ação desabilitada durante a geração. |
| Concluído | “Excel gerado. Baixar arquivo.” Disponibilizar o download. |
| Falha | “Não foi possível gerar o Excel. Tentar novamente.” Preservar a consulta e não substituir seus dados. |
| Sem dados | Exportar Excel desabilitado; “Não há dados para exportar.” |

Se o conjunto consultado não puder ser recuperado para a geração, informar: “Não foi possível recuperar os dados desta consulta. Consulte novamente para exportar.” Não gerar um resultado atualizado diferente sem nova consulta explícita.

## 7. Peças a entregar

1. Tramitações — registros.
2. Variação atividades por técnico, com médias NOUT.
3. Variação por agrupamento, exemplificando município/tipologia.
4. Variação anual DIRRE.
5. Acompanhamento da pauta, incluindo sem atribuição e sem tramitação.
6. Dois painéis de filtros.
7. Painel lateral de resumo e tela de detalhes completos.
8. Painel **Sobre os dados**.
9. Estados de consulta e indisponibilidade.
10. Ação **Exportar Excel** nas duas perspectivas e seus estados, sem criar tela independente ou desenhar o arquivo Excel.

Não incluir filtro por sistema, integrações, edição, distribuição de processos, tramitação ou emissão de atos. Questões de fonte e homologação de cálculo ficam nas anotações da entrega, não em novas telas de configuração.

As regras para apoiar a documentação posterior estão no arquivo **02 - Base funcional - Decisoes e fluxos SEIA.md**, desta mesma pasta.
