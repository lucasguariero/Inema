# Plano de execução - Fiscalização / Pauta do Gestor - Registros

Status atualizado em 05/10/2026: execução autônoma do protótipo realizada. Build e TypeScript com zero erros; 48/48 verificações locais aprovadas. As dependências documentais e de integração abaixo continuam pendentes, sem simulação de emissão oficial.

## Registro da execução autorizada

A autorização posterior do usuário substituiu a pausa obrigatória da fase de planejamento. As instruções históricas de não implementar, não publicar e parar após salvar o plano aplicavam-se somente àquela fase.

| Camada | Entrega desta execução | Verificação |
| --- | --- | --- |
| 1 | Rota e item no shell legado; oito guias; RA/AC sem dados. | Build aprovado; prints 01-02. |
| 2 | F001-F016 aplicáveis, grupos recolhidos, dependências e validação. Setor em RT permanece na divergência documental, não inventado. | Build/TypeScript aprovados; prints 03-04; testes de critérios. |
| 3 | Oito colunas, semáforo completo, ordenação, paginação e configuração protegida. | Build/TypeScript aprovados; prints 05-06 e 09. |
| 4 | Detalhes somente leitura, ações, anexação/desanexação em memória, pai mais antigo/processo. | Build/TypeScript aprovados; prints 07-08 e 16. |
| 5 | Arquivar, encaminhar, arquivos, comentar e alterar eixo funcionais em memória. PDF, ofício, processo e conclusão da conversão dependem dos contratos identificados no DOR e não são emitidos. | Build/TypeScript aprovados; prints 10-12, 17-18 e 20. |
| 6 | Decimal/GMS/UTM, referência espacial, fallback e CAR exclusivamente simulado; GeoBahia real não conectado. | Build/TypeScript aprovados; print 13 e 19; testes geométricos. |
| 7 | QA funcional, visual, foco, tela estreita e escopo exclusivo da entrega. | Build final aprovado; TypeScript zero erros; 48/48 verificações locais; prints 14-23. |

Evidências e relatório técnico: `qa/cards/dor011-pauta-gestor/`. Este estado não equivale a 100% do DOR integrado ao backend. A matriz de segurança demonstrada não substitui autenticação/autorização do servidor.

## Fonte, objetivo e limites

- Documento lido integralmente: `C:/Users/lguar/Downloads/DOR011 - Módulo Fiscalização - Pauta do Gestor - Registros.pdf`, 41 páginas, última atualização indicada em 02/10/2026, versão 1.4.
- Referência funcional: RN001-RN055, MSG001-MSG034, LEG001-LEG024, F001-F016, BOT001-BOT023 e TL001-TL015 (C001-C093).
- Usuário: gestor interno autenticado, autorizado e com vínculo organizacional compatível.
- Objetivo: consultar registros autorizados, combinar critérios, analisar localização e duplicidades e executar as operações previstas.
- Esta rodada cria apenas este plano. Não criar TSX/React, alterar componentes, rotas ou menu, executar build de implementação, fazer commit ou publicar.
- A futura implementação usará estritamente o documento e as diretrizes do pedido. Não incluir indicadores gerenciais, cards de métricas, badges em títulos, notificações fictícias, filtros extras ou ações de criação não especificadas.
- As imagens do PDF são propostas ilustrativas. O próprio documento afirma que catálogos demonstrativos, oito itens por página e a data de referência não constituem definições corporativas.
- Preservar alterações preexistentes do projeto, inclusive `.gitignore` e `REFACTOR.md`.
- Planejamento elaborado com apoio das habilidades `pdf:pdf` (leitura do documento e inspeção das figuras) e `impeccable` (planejamento e conferência dos componentes existentes). As restrições explícitas desta tarefa prevalecem sobre sugestões de expansão ou implementação dessas habilidades.

## Contrato de componentes e identidade

| Finalidade | Importação exata prevista | Aplicação |
| --- | --- | --- |
| Casca legada | `AppShell` de `@/components/layout/AppShell` | Manter a topbar e a sidebar atuais; aproveitar o ramo legado de `src/App.tsx`. |
| Guias | `FilamentTabs` de `@/components/filament/Tabs` | Todos, RD, RE, RA, RC, RT, OF e AC. |
| Containers e filtros | `Section` de `@/components/filament/Section` | `rounded-xl`, cabeçalho sutil; grupos com `collapsible` e `defaultCollapsed`. |
| Botões | `Button` de `@/components/ui/button` | Primário `#0F4C3A`, tamanho `sm` ou `md`; todas as ações e confirmações. |
| Status e quantidades | `Badge` de `@/components/ui/badge` | Somente variantes oficiais `success`, `warning`, `danger`, `info`, `primary`, `gray`; quantidade de duplicados e semáforo. |
| Campos | `InputWrapper` de `@/components/filament/InputWrapper` | Inputs, datas, coordenada, descrição e justificativas; controles simples com altura `h-9`, validação com `valid` e `hint`. |
| Seleções | `FilamentSelect` de `@/components/filament/Select` | Catálogos e dependências; `h-9`, pesquisa quando aplicável. |
| Lista e toolbar | `TableContainer`, `TableToolbar` de `@/components/filament/Table` | Estrutura de listagens e ações da tabela. |
| Partes da tabela | `GlaTable`, `GlaTableHead`, `GlaTh`, `GlaTableBody`, `GlaTableRow`, `GlaTd` de `@/components/common/GlaTable` | Reusar cabeçalho, linhas e células dentro de `TableContainer`, sem segundo container concorrente. |
| Modais | `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose` de `@/components/ui/dialog` | Detalhes, operações, duplicidades, confirmações e configuração de colunas. |
| Seleção de colunas | `GlaCheckbox` de `@/components/gla/primitives/GlaCheckbox` | Colunas opcionais e obrigatórias na TL010. |
| Seleção de um duplicado | `GlaRadioGroup` de `@/components/gla/primitives/GlaRadioGroup` | Escolha de um registro ou processo antes de anexar. |
| Wizard, somente se houver fluxo documentado | `FilamentWizard` de `@/components/filament/Wizard` | O DOR011 não define um formulário multi-etapas de criação; não inserir Wizard na pauta. |

- Elementos nativos estritamente necessários, como input, textarea, file input ou link geoespacial, devem compor os wrappers existentes; não constituirão componentes visuais paralelos em HTML cru.
- Não importar `ShadcnHeader`, `ShadcnSidebar`, `SeiaV2RootPage` ou a navegação externa do novo Design System nesta tela.
- Foco, hover e active: usar os tokens verdes existentes em `src/styles/globals.css`, especialmente `--color-green-700`, `--color-border-focus`, `--color-text-link` e `--color-green-alpha-20`.
- Não inserir azul genérico em interações. Cores semânticas de status não devem ser confundidas com cor de foco.
- `TableToolbar` possui um contador interno com `bg-blue-600`: evitar esse caminho usando os quatro grupos externos de filtros e o slot `actions`; não adicionar uma segunda busca redundante. Se esse controle vier a ser indispensável, tratar a correção estritamente no escopo e sem mudar telas anteriores.
- `Badge` não possui variante `orange`: para 150-180 dias, usar o próprio `Badge` com variante oficial e ajuste localizado por `className` baseado em `--color-orange-50`, `--color-orange-200` e `--color-orange-800`. Manter o amarelo da variante `warning` distinto do laranja. Não criar nova paleta nem nova variante global.
- Usar interfaces neutras, densidade compatível com o legado e mensagens somente quando previstas no DOR.

## Camada 1 - Layout base, rota e guias

Referências: TL001/C001-C002, TL012/C079-C082, TL015/C091; RN001-RN006, RN024, RN047.

Componentes: `AppShell`, `Section`, `FilamentTabs`, `Button`, `TableContainer`, `Dialog` quando necessário para mensagem prevista.

- [ ] Criar futuramente uma página dedicada em `src/pages/fiscalizacao/PautaGestorRegistrosPage.tsx`, sem substituir o Painel Interno DIFIS existente.
- [ ] Cadastrar em `src/data/navigationConfig.json`, grupo `fiscalizacao`, item com rótulo **Pauta do Gestor - Registros**.
- [ ] Adotar identificador técnico de rota `fisc-pauta-gestor-registros` e URL `/?rota=fisc-pauta-gestor-registros`, conforme o roteamento atual do protótipo.
- [ ] Registrar o ramo no `renderContent` de `src/App.tsx`, mantendo a página dentro do `AppShell` legado.
- [ ] Registrar em `ROUTE_INFO` de `@/components/layout/AppShell` o mesmo título do menu e módulo Fiscalização, sem modificar o layout da casca.
- [ ] Garantir igualdade literal entre título visível e nome do item lateral.
- [ ] Não criar RF002/Página Inicial nem RF004/Processo: seus escopos pertencem a outros documentos.
- [ ] Abrir em **Todos**, carregando somente o escopo autorizado, sem filtro obrigatório.
- [ ] Renderizar guias exatamente na ordem **Todos | RD | RE | RA | RC | RT | OF | AC**.
- [ ] Filtrar cada guia pelo tipo correspondente, sem ampliar a permissão.
- [ ] Manter RA e AC visíveis e clicáveis, com estado vazio e sem operações sobre registros enquanto não houver dados.
- [ ] Exibir a mensagem curta solicitada **Não há dados disponíveis** no estado vazio; preservar no mapeamento a MSG004 exata do PDF, **Não há dados disponíveis para esta guia.**
- [ ] Não inserir contadores fictícios nas guias, pills de código no título ou botão Novo Registro: o DOR não define criação nesta pauta.
- [ ] Ações de criação que futuramente pertençam a outro documento serão botões no canto superior direito, nunca abas.
- [ ] Bloquear acesso sem autorização, inclusive por URL direta, com MSG003.

Aceite da camada: oito guias navegáveis no shell legado; RA/AC acessíveis sem dados; título/menu consistentes; nenhuma alteração no shell SEIA V2.

## Camada 2 - Acordeões e filtros de consulta

Referências: TL002/C009-C026, TL014/C087-C090; F001-F016; RN006-RN024, RN051-RN052; BOT001, BOT002, BOT022; LEG001-LEG015 e LEG022.

Componentes: `Section`, `InputWrapper`, `FilamentSelect`, `Button`.

- [ ] Criar somente quatro grupos: **Dados do registro**, **Localização**, **Período e situação**, **Classificação**.
- [ ] Todos recolhidos por padrão; expansão independente, preservando valores ao recolher.
- [ ] Não exibir filtros inaplicáveis como desabilitados; ocultar e limpar seus valores quando a troca de guia os tornar inaplicáveis.
- [ ] Manter valores em edição separados dos critérios da última consulta executada, para não substituir resultados com critérios inválidos.

### Matriz exata de campos

| Código | Grupo | Campo | Controle | Aplicabilidade descrita |
| --- | --- | --- | --- | --- |
| F001 | Dados do registro | Origem | `FilamentSelect` | RD, RE e RC. |
| F002 | Dados do registro | Órgão | `FilamentSelect` | RD, RE e RC; SINF está fora desta entrega. |
| F003 | Dados do registro | Setor de origem | `FilamentSelect` | RD e RT segundo tabela; dependência de Origem em RT pendente de alinhamento. |
| F007 | Dados do registro | Número do Registro | `InputWrapper` | Todas as guias com dados. |
| F008 | Dados do registro | Palavra-chave | `InputWrapper` | Guias com conteúdo textual autorizado. |
| F009 | Dados do registro | Demandante | `InputWrapper` | RD/Denunciante, RE e RC/Comunicante, RT/Técnico. |
| F004 | Localização | Município | `FilamentSelect` | Todas as guias com dados; municípios da Bahia. |
| F010 | Localização | Formato / Coordenada | `FilamentSelect` + `InputWrapper` | Guias com geolocalização; Grau Decimal, GMS e UTM. Formato é parte de F010, não um novo filtro. |
| F013 | Localização | Área Atingida | `FilamentSelect` | RD, RE, RA e RT; catálogo do Documento de Emergência. |
| F016 | Localização | Unidade de Conservação | `FilamentSelect` | RT, RD e RE; unidades associadas aos registros. |
| F005 | Período e situação | Data inicial | `InputWrapper` | Todas as guias com dados. |
| F006 | Período e situação | Data final | `InputWrapper` | Todas as guias com dados. |
| F011 | Período e situação | Status | `FilamentSelect` | Somente status aplicáveis à guia; PE001. |
| F014 | Período e situação | Dias em Aberto | `FilamentSelect` | 0-89, 90-149, 150-180, 181 dias ou mais. |
| F012 | Classificação | Eixo Temático / Subitem | Dois `FilamentSelect` dependentes | RD, RT, RC e RA; SINF fora do escopo. |
| F015 | Classificação | Tipo de Emergência | `FilamentSelect` | RE, com os quinze valores do DOR. |

- [ ] Origem: somente Call Center, Correspondência, E-mail, Ofício, Presencial, Ouvidoria, SEI e Telefone.
- [ ] Órgão: sem Origem, listar todos os órgãos do escopo; com Origem, atualizar opções compatíveis e limpar valor incompatível sem desabilitar o campo (RN009).
- [ ] Setor: mostrar somente para Call Center, E-mail, Ofício, Presencial, SEI ou Telefone quando aplicável à guia; nas demais condições, ocultar e limpar. Usar catálogo existente.
- [ ] Datas: ambas vazias permitem consulta; se uma for preenchida, exigir a outra; rejeitar final anterior à inicial com MSG005.
- [ ] Número do Registro: correspondência exata do identificador completo, respeitando a guia.
- [ ] Palavra-chave: texto livre; desconsiderar acentuação; pesquisar palavras completas, combinando todos os termos; não aceitar pesquisa por fragmentos (RN014).
- [ ] Demandante: nome ou CPF/CNPJ; validar documento quando informado e proteger dados restritos.
- [ ] Coordenada: validar completude, domínio e formato; conversão para padrão geoespacial; falha MSG006. Interseção com CAR conforme camada 6.
- [ ] Status iniciais previstos: Anexado, Arquivado, Encaminhado, Processo formado, Registrado, Relacionado, Em Análise Técnica e Ofício Gerado; aplicação por tipo sujeita à PE001.
- [ ] Eixo/subitem: limpar seleção incompatível ao trocar eixo, sem gerar itens adicionais.
- [ ] Consultar aplica interseção de critérios válidos e escopo autorizado, inclusive consulta sem filtros.
- [ ] Limpar filtros limpa valores, mantém guia ativa e aguarda nova consulta; não consultar automaticamente.
- [ ] Manter valores e contexto em consulta vazia ou falha; mensagens MSG001 e MSG002.
- [ ] Conforme RN007, grupos recolhidos não restringem a próxima consulta, mas seus valores permanecem. Registrar a necessidade de validação da área, já indicada na página 40.

### Catálogos definidos no DOR

Eixos: Saneamento (Lixão; Esgoto doméstico); Indústria (Resíduos Sólidos; Efluentes; Poluição do Ar); Mineração (Garimpo; Extração de Gemas); Recursos Hídricos (Rios; Lagos; Lagoas; Poços); Fauna Silvestre (Caça; Tráfico; Pesca predatória); Vegetação nativa (Desmatamento; Incêndio).

Tipos de Emergência: Acidente no transporte rodoviário de produtos químicos; Acidente em via férrea; Acidente industrial em planta química ou petroquímica; Incidente no modal aquaviário ou terminal marítimo; Lançamento ou descarte irregular de efluentes ou produtos químicos; Vazamento em sistema subterrâneo de armazenamento de combustíveis; Ocorrência com produto químico perigoso em ETA/ETE; Efluente de barragem de rejeitos; Efluente de barragem de aterro industrial ou sanitário; Ruptura ou falha em sistema de contenção; Mortandade de peixes ou fauna aquática por contaminação química; Pluma de contaminação; Mancha de origem desconhecida; Afloramento de contaminantes; Outros.

Aceite da camada: exatamente F001-F016, com controles auxiliares apenas quando previstos, quatro grupos recolhidos e comportamento condicional rastreável.

## Camada 3 - Data grid, semáforo, ordenação, paginação e colunas

Referências: TL001/C003-C008, TL010/C069-C073, TL013/C083-C086, TL015/C092-C093; RN005, RN021, RN025-RN029, RN051-RN053; BOT011-BOT013, BOT020-BOT021.

Componentes: `TableContainer`, `TableToolbar`, `GlaTable`, `GlaTableHead`, `GlaTh`, `GlaTableBody`, `GlaTableRow`, `GlaTd`, `Badge`, `Button`, `FilamentSelect`, `GlaCheckbox`, família `Dialog`.

- [ ] Exibir inicialmente somente oito colunas, nesta ordem: **Tipo do Registro**, **Data**, **Nº do Registro**, **Dias em Aberto**, **Status/Situação**, **Municípios**, **Ações**, **Duplicados**.
- [ ] Mostrar RD, RE, RA, RC, RT, OF ou AC conforme o tipo; identificadores em monoespaçada institucional.
- [ ] Calcular Dias em Aberto conforme dados e regra corporativa, sem presumir data de encerramento ou pausas não definidas no DOR.
- [ ] Aplicar semáforo: 0-89 sem destaque/gray; 90-149 amarelo/warning; 150-180 laranja pelos tokens existentes; 181+ vermelho/danger.
- [ ] Manter número de dias legível para que a informação não dependa exclusivamente da cor.
- [ ] Ordenação inicial decrescente por data; inversão crescente; número do registro como critério secundário estável.
- [ ] Configurar colunas em modal, com edição provisória: Aplicar confirma; Cancelar não modifica o grid.
- [ ] Permitir colunas adicionais somente **Eixo Temático** e **Denunciante/Comunicante**, quando aplicáveis e autorizadas.
- [ ] Ações e Duplicados ficam obrigatórias quando houver dados, conforme a diretriz do pedido; não oferecer controle que as oculte nessas condições.
- [ ] Configuração dura durante o acesso atual; novo acesso à pauta restaura colunas padrão.
- [ ] Duplicados apresenta quantidade em `Badge` acionável quando houver correspondências; abrir modal de duplicidades.
- [ ] Ações abre o modal de operações do registro, sem mudar de página.
- [ ] Totalizar resultados e paginar preservando guia, filtros aplicados, ordenação, colunas e posição de consulta.
- [ ] Não transformar oito itens por página da captura em regra corporativa; usar configuração existente ou registrar ausência dela.
- [ ] Consulta sem resultados: grid sem linhas, total zero e MSG001, mantendo filtros.
- [ ] Falha técnica: MSG002, contexto preservado e nenhuma apresentação de resultado parcial como completo.

Aceite da camada: limites 89/90/149/150/180/181 corretos; colunas obrigatórias protegidas; contexto mantido entre páginas e operações.

## Camada 4 - Detalhes, ações e duplicidades

Referências: TL003/C027-C032, TL004/C033-C042, TL005/C043-C047, TL006/C048-C052; RN030-RN035, RN042, RN047-RN050, RN053; BOT008, BOT013-BOT015, BOT018-BOT019.

Componentes: família `Dialog`, `Section`, `Button`, `Badge`, `InputWrapper`, `GlaRadioGroup`, `TableContainer` e partes de `GlaTable`.

- [ ] Adotar modais reutilizáveis de `@/components/ui/dialog`, alternativa expressamente permitida ao Drawer, para consulta e ações; não navegar para uma nova tela de detalhes.
- [ ] Ao fechar, devolver foco ao acionador e manter posição, filtros, guia e página da listagem.
- [ ] Detalhes: identificação/situação, data, origem, município, dias em aberto, demandante, classificação, descrição, coordenada, arquivos e histórico, somente quando existentes e autorizados.
- [ ] Visualizar não altera status, responsável, dias ou relações.
- [ ] Modal de Ações: Visualizar, Gerar PDF, GeoBahia/Visualizar informações geoespaciais, Arquivos/Adicionar arquivo, Encaminhar, Gerar Ofício, Alterar eixo temático, Arquivar, Formar Processo e Converter Registro.
- [ ] Incluir também Adicionar comentário e Desanexar quando aplicáveis: ambos são explicitamente previstos em TL004/RN035/RN045, não melhorias extras.
- [ ] Aplicar matriz por perfil, tipo, status e relacionamento; não mostrar todas as operações indiscriminadamente nem inferir permissões por aparência do registro.
- [ ] Comparar possíveis duplicidades de registros e processos de qualquer status usando igualdade dos dados de coordenada, CEP, município, endereço/local ou bairro disponíveis (RN030).
- [ ] Não inferir localização ausente, criar fuzzy matching ou inventar palavras-chave de duplicidade; PE002 permanece dependência explícita.
- [ ] Modal de duplicidades: identificação do registro de referência, lista de registros/processos autorizados, seleção única, Anexar e Cancelar; respeitar TL005.
- [ ] Anexar exige seleção e MSG016 antes da conclusão; sucesso MSG017, falha MSG018 sem relação parcial.
- [ ] Entre registros, o mais antigo é pai/referência principal; anexação a processo torna o processo pai. Manter histórico individual e da relação.
- [ ] Formação posterior de processo inclui todos os registros relacionados, conservando o pai como referência de origem.
- [ ] Desanexar exige gestor autorizado, referência da relação, justificativa obrigatória e MSG019; ausência de justificativa MSG020.
- [ ] Sucesso de desanexação devolve os registros à pauta com status Em Análise Técnica e MSG021; falha preserva relação e MSG022.

Aceite da camada: nenhuma perda de posição da lista; pai correto; operações condicionais; cancelamento e falha sem efeitos parciais.

## Camada 5 - Operações gerenciais e documentos

Referências: TL004, TL007/C053-C058, TL008/C059-C063, TL009/C064-C068; RN036-RN046, RN047-RN050, RN053; BOT003-BOT010, BOT016-BOT019.

Componentes: família `Dialog`, `Section`, `InputWrapper`, `FilamentSelect`, `Button`, `Badge`, `TableContainer` e partes de `GlaTable` para arquivos/histórico quando houver lista.

- [ ] Arquivar: identificação do registro, motivo, justificativa e descrição do motivo somente quando Outros; nenhum campo adicional.
- [ ] Motivos exatos: Não é demanda ambiental; Informações insuficientes; Encaminhamento externo; Outros.
- [ ] Validar MSG009/MSG010, confirmar MSG011; sucesso MSG012 e auditoria; falha MSG013 preserva estado. Cancelar não altera dados.
- [ ] Encaminhar: identificação e seleção de destino autorizado; revisar e confirmar; não inventar justificativa obrigatória para esta operação.
- [ ] Destinos: diretorias, coordenações e unidades regionais existentes e autorizadas; não copiar destinos fictícios das figuras como catálogo oficial.
- [ ] Encaminhamento atualiza status/responsável e registra origem, destino, usuário, data e hora; MSG014/MSG015; sem movimentação parcial.
- [ ] Arquivos: seleção múltipla opcional, formatos aceitos e lista antes de concluir; persistência real depende do contrato de upload.
- [ ] Formatos exatos: `.pdf`, `.doc`, `.docx`, `.txt`, `.jpeg`, `.jpg`, `.png`, `.bmp`, `.xls`, `.xlsx`, `.mp3`, `.mp4`, `.shp`, `.shx`, `.dbf`, `.prj`, `.kml`, `.kmz`, `.zip`.
- [ ] Rejeitar outros formatos com MSG032; sucesso MSG007; falha MSG008. Não inventar limite de tamanho ou quantidade.
- [ ] PDF: dados autorizados, identificação e arquivos incorporados; auditoria e MSG025 em falha. Impressão local não comprova geração final com anexos.
- [ ] Formar Processo: entrada para fluxo específico, vínculo rastreável, prevenção de criação duplicada e status atualizado apenas em sucesso; MSG023. Campos e etapas dependem da PE003.
- [ ] Gerar Ofício: modelo editável e vínculo com registro; Ofício Gerado somente após sucesso/MSG024. Modelo, numeração, edição, perfis e fluxo posterior pendentes (RN041).
- [ ] Converter: somente RD -> RT/RE; RE -> RD/RT; RT -> RE/RD. Confirmar MSG026, validar campos obrigatórios do destino, atualizar nomenclatura/identificação e preservar histórico; sucesso MSG027.
- [ ] Não inventar formulário de conversão sem consultar a definição dos campos do tipo de destino.
- [ ] Comentário opcional: texto, autor, data e hora; MSG028; sem alteração de status, responsável ou prazo.
- [ ] Alterar eixo: dois selects dependentes, eixo e subitem; combinação válida, auditoria de valores anterior/novo e MSG029.
- [ ] Todas as mutações: prevenir duplo acionamento, verificar conflito MSG030 e concluir de modo integral ou reverter com mensagem específica/MSG031.
- [ ] Atualizar grid após sucesso sem perder contexto; manter estado anterior em erro.

Aceite da camada: exatamente os campos documentados em cada operação; permissões, validações, cancelamento e mensagens correspondentes.

## Camada 6 - Pesquisa espacial e GeoBahia

Referências: TL011/C074-C078, TL003/C029; RN016-RN017, RN054-RN055; BOT023; MSG006, MSG033, MSG034; LEG009 e LEG024.

Componentes: `FilamentSelect`, `InputWrapper`, `Button`, família `Dialog`, `Section`; links de coordenadas dentro da leitura do registro.

- [ ] Pesquisa espacial aceita Grau Decimal, Grau/Minuto/Segundo e UTM; valida e converte com serviço/biblioteca já adotado no projeto, sem fingir suporte por simples comparação textual.
- [ ] Ao sobrepor imóvel rural, identificar CAR e ampliar consulta à sua poligonal conforme RN017.
- [ ] Cada coordenada disponível é link que dispara **Visualizar informações geoespaciais**.
- [ ] Considerar coordenadas do registro e documentos relacionados: RAE, RFA, desdobramentos, Nota Técnica, PTAD e ATN, quando existirem.
- [ ] Sem coordenadas no registro e nesses documentos, usar município como referência espacial.
- [ ] Abrir ambiente interno do GeoBahia com referência e contexto documental; exigir usuário interno autorizado no módulo conforme RN055.
- [ ] Sem coordenada nem município: MSG033. Indisponibilidade: MSG034, preservando registro.
- [ ] Não inventar URL, mapa, camada, poligonal, documento vinculado ou integração concluída. Obter contrato de integração antes de conectar.

Aceite da camada: coordenadas acionáveis e referência correta; tratamento de ausência/indisponibilidade; integração real distinguida de demonstração local.

## Camada 7 - Mensagens, segurança, auditoria e QA da futura implementação

Referências: RN001, RN047-RN053; MSG001-MSG034; TL012-TL015; BOT019-BOT023.

Componentes: `InputWrapper` para validação; `DialogDescription`/família `Dialog` para mensagens e confirmação; `Button`, `Badge`, `Section`, `TableContainer` para os estados existentes.

- [ ] Centralizar textos MSG001-MSG034 e legendas LEG001-LEG024 conforme PDF; não criar alertas sem evento documentado.
- [ ] Guardar estado da consulta: guia, filtros em edição/aplicados, ordenação, colunas, página, posição, registro selecionado e operação aberta.
- [ ] Autorização aplicada também à URL direta, itens relacionados e operações; UI não substitui controle no backend.
- [ ] Auditoria das operações da RN048 com usuário, perfil, data/hora, registro, valores anterior/novo, justificativa e resultado quando aplicáveis.
- [ ] Diferenciar demonstração em memória de autenticação, persistência, auditoria, concorrência e transação reais; não apresentar simulação como implementação desses requisitos.
- [ ] Validar funcionalmente: oito guias; RA/AC sem dados; quatro grupos recolhidos; filtros condicionais; datas incompletas/invertidas; palavra inteira; número exato; CPF/CNPJ; coordenada inválida; catálogo de status por tipo.
- [ ] Validar grid: oito colunas padrão; opcionais corretas; proteção Ações/Duplicados; semáforo nos limites; ordenação estável; paginação e total.
- [ ] Validar modais: abertura pela linha, retorno à mesma posição, seleção/anexação, pai antigo/processo, justificativa de desanexação, arquivamento Outros, confirmação/cancelamento, encaminhamento, arquivos e conversões permitidas.
- [ ] Validar mensagens de falha, preservação de contexto, ausência de efeitos parciais e prevenção de duplo envio.
- [ ] Rodar `npm run build` após implementação e obter zero erros; não executar como comprovação de uma UI ainda inexistente nesta etapa.
- [ ] Realizar QA visual em Light Mode: layout legado, título/menu iguais, componentes institucionais, ausência de azul em foco/hover/active, contraste dos quatro níveis de SLA e ausência de conteúdo decorativo.
- [ ] Conferir tela ampla e estreita conforme TL015: guias em faixa horizontal, filtros verticais e rolagem da tabela mantendo todas as informações e regras de permissão.
- [ ] Publicação e validação no ambiente serão etapas posteriores à autorização da implementação; manter entregas anteriores preservadas.

## Dependências e divergências documentais - não preencher por invenção

| Ponto | Evidência | Tratamento previsto |
| --- | --- | --- |
| Código do documento | Capa DOR011; rodapés DOR010. | Referenciar funcionalmente DOR011, preservando o registro da inconsistência editorial. |
| Nome do grupo de período | Apêndice do pedido usa Período; RN006/UI/TL002 usam Período e situação. | Usar Período e situação conforme o documento completo. |
| Aplicação de filtros recolhidos | RN006 preserva valores; RN007 exclui filtros recolhidos; página 40 solicita confirmação. | Registrar comportamento literal da RN007 e validar com a área antes de consolidar regra diferente. |
| Órgão | RN009 mantém disponível; LEG002 limita a Ofício. | Seguir RN009 e diretriz explícita do pedido; legenda depende de alinhamento, sem impor a restrição contraditória. |
| Setor de origem em RT | F003 inclui RT, mas F001/Origem não inclui RT. | Não acrescentar Origem em RT nem fabricar dependência; resolver esta aplicabilidade com a área. |
| Status por tipo | PE001. | Validar catálogo por tipo antes de definir opções finais e ações dependentes. |
| Palavras-chave de duplicidade | RN030/PE002. | Aguardar lista fornecida pelo usuário; não substituir por algoritmo inventado. |
| Cálculo de Dias em Aberto | RN026 define cálculo e cores, sem fórmula completa para pausas/encerramento. | Aproveitar regra existente verificável ou manter pendência; não definir nova regra corporativa. |
| Formação de processo | RN040/PE003. | Detalhamento em documento próprio; não inventar numeração, campos ou Wizard. |
| Ofício | RN041. | Obter modelo e regras de numeração, edição, perfis e fluxo posterior. |
| Segurança e catálogos | RN001/RN047; órgãos, setores, municípios, áreas, unidades e destinos. | Utilizar dados oficiais existentes; declarar dependências ausentes. |
| Conversão | RN044; campos do destino em documentos próprios. | Consultar esses documentos antes de criar formulários ou validações. |
| GeoBahia, CAR e PDF com anexos | RN017/RN043/RN054/RN055; página 40. | Exigir contrato/serviços; prévia não equivale à integração concluída. |
| Colunas obrigatórias | RN028 condiciona a operações/relações; pedido torna obrigatórias com dados. | Cumprir a proteção mais restritiva explicitamente solicitada. |
| Estado vazio RA/AC | Pedido: Não há dados disponíveis; MSG004 adiciona para esta guia. | Usar mensagem curta solicitada e manter a MSG004 completa rastreável, sem inventar dados. |

## Rastreamento final por tela

| Tela/estado | Camada |
| --- | --- |
| TL001 - Pauta do Gestor - Registros | 1 e 3 |
| TL002 - Filtros de Consulta | 2 |
| TL003 - Detalhes do Registro | 4 e 6 |
| TL004 - Ações do Registro | 4 e 5 |
| TL005 - Possíveis Duplicidades e Anexação | 4 |
| TL006 - Desanexar Registros | 4 |
| TL007 - Arquivar Registro | 5 |
| TL008 - Encaminhar Registro | 5 |
| TL009 - Adicionar Arquivos | 5 |
| TL010 - Configurar Colunas | 3 |
| TL011 - Visualizar Informações Geoespaciais | 6 |
| TL012 - Guia sem Dados | 1 e 7 |
| TL013 - Consulta sem Resultados | 3 e 7 |
| TL014 - Validação do Período | 2 e 7 |
| TL015 - Visualização em Tela Estreita | 1, 3 e 7 |

## Ordem de execução após autorização

1. Layout base e guias no shell legado.
2. Grupos recolhíveis e filtros.
3. Grid, semáforo, ordenação, paginação e configuração de colunas.
4. Detalhes, ações e duplicidades.
5. Operações gerenciais e documentos conforme dependências disponíveis.
6. Pesquisa espacial e GeoBahia conforme contratos disponíveis.
7. Build e QA funcional/visual em Light Mode, com pendências claramente registradas.

Encerramento desta etapa: salvar este documento e parar imediatamente, sem implementar código de interface.
