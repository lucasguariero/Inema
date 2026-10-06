# MEMÓRIA DOR011 — REFINO FINAL

Registro persistente do projeto INEMA / ACTO, criado em 06/10/2026 por solicitação do usuário.

## Estado e autorização

- FASE 1: concluída somente quanto ao registro das instruções.
- FASE 2: aguardando autorização explícita do usuário; não iniciada.
- FASE 3: depende de nova autorização explícita após o inventário/plano.
- FASE 4: revisão adversarial da implementação, sem declarar pronto ou publicar automaticamente.
- FASE 5: evidências e pacote de auditoria somente com revisão PASS.
- Nenhuma navegação, alteração de código/componente, build, teste ou deploy foi executado nesta Fase 1.

## Aplicação nas próximas fases

Este briefing integral governa exclusivamente a próxima rodada de refino do DOR011. Os gates explícitos prevalecem sobre protocolos genéricos de autonomia, implementação e publicação automática do projeto. Não afeta a rodada de Fauna nem autoriza alterações em outras funcionalidades.

O produto é um protótipo frontend com mocks locais. Reutilizar efetivamente os componentes reais do Design System no miolo; preservar o shell legado e as regras aprovadas. O PDF governa conteúdo/estrutura/comportamento; seus wireframes não são referência pixel-perfect. O Design System governa a implementação visual. O Figma Filament é referência secundária de anatomia, não de identidade cromática.

Não implementar backend, banco, autenticação/autorização real, storage, APIs ou integrações GeoBahia/CAR. Simular corretamente experiências previstas, distinguindo dados demonstrativos de integrações reais.

A lista A–T, as condições de aplicabilidade, todos os detalhes de modais, labels, helpers, mocks, sequência de execução, critérios de QA e estrutura do ZIP estão preservados integralmente abaixo. Não assumir que componentes existem ou que algo foi verificado: confirmar arquivos/fontes na Fase 2.

## Briefing integral fornecido pelo usuário

<!-- INICIO_BRIEFING_ORIGINAL -->
TAREFA-MESTRE — REFINO FINAL DE UI/UX DO DOR011
INEMA / FISCALIZAÇÃO / PAUTA DO GESTOR — REGISTROS

MODO DE TRABALHO:
Esta mensagem define as INSTRUÇÕES PERSISTENTES e o PLANO COMPLETO da próxima rodada.

NESTA EXECUÇÃO, FAÇA SOMENTE A FASE 1.

NÃO ALTERE CÓDIGO.
NÃO FAÇA DEPLOY.
NÃO EDITE COMPONENTES.
NÃO COMECE A FASE 2.
NÃO "ADIANTE" NENHUMA IMPLEMENTAÇÃO.

Primeiro:
1. leia integralmente estas instruções;
2. grave-as na memória persistente/instruções do projeto usada por este Work;
3. registre claramente que estas regras deverão governar as próximas fases;
4. responda com um resumo estruturado do que foi memorizado;
5. PARE.

Eu autorizarei explicitamente a FASE 2 depois.

============================================================
CONTEXTO
============================================================

Projeto:
INEMA / ACTO

Módulo:
DOR011 — Fiscalização — Pauta do Gestor / Registros

Ambiente de protótipos:
https://inema.acto.com.br/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor

IMPORTANTE:
Este ambiente é EXCLUSIVAMENTE um protótipo frontend navegável.

É um produto de prototipação em:
- Next.js;
- React;
- HTML;
- CSS;
- JavaScript/TypeScript;
- mocks locais.

NÃO é objetivo desta entrega implementar:
- banco de dados;
- backend produtivo;
- autenticação real;
- autorização corporativa real;
- persistência real;
- GeoBahia real;
- CAR real;
- serviços REST reais;
- storage;
- transações distribuídas;
- integrações de produção.

Quando uma funcionalidade depende disso, devemos SIMULAR corretamente a experiência usando dados mock.

O objetivo é:

REPRESENTAR FIELMENTE NO FRONTEND
como o sistema deverá funcionar.

Portanto:
não penalizar ou tentar "resolver" ausência de backend.
Não transformar esta rodada em engenharia de produção.

============================================================
FONTES DE VERDADE VISUAL E FUNCIONAL
============================================================

Usar estas fontes em conjunto:

1. PDF ORIGINAL DOR011
Fonte de verdade funcional/documental.

O PDF contém também PROTÓTIPOS DE MÉDIA FIDELIDADE.

Esses protótipos NÃO precisam ser copiados pixel a pixel.

O próprio documento informa que:

"Imagens meramente ilustrativas para apresentação de campos e botões.
Pode haver divergências de layout com o sistema."

Portanto:

PDF/DOR011 define:
- estrutura;
- campos;
- ações;
- hierarquia conceitual;
- arquétipos;
- conteúdo;
- comportamento;
- nomenclatura.

2. DESIGN SYSTEM OFICIAL DO PROJETO

Página:
https://inema.acto.com.br/?rota=seia-v2&tela=design-system

ESTA É A PRINCIPAL REFERÊNCIA PARA IMPLEMENTAÇÃO VISUAL.

Existem nessa página componentes, padrões, assets e exemplos
JÁ IMPLEMENTADOS NO PROJETO.

REGRA MANDATÓRIA:

NÃO RECRIAR COMPONENTES QUE JÁ EXISTEM NO DESIGN SYSTEM.

Antes de construir qualquer coisa:
LOCALIZAR O COMPONENTE EXISTENTE.

Devemos adaptar:
- dados;
- conteúdo;
- configuração;
- props;
- composição;

e NÃO reproduzir manualmente um componente "parecido".

3. FIGMA FILAMENT 3 — REFERÊNCIA SECUNDÁRIA

https://www.figma.com/design/nC1dpVy3akBMdb3XcWZhj1/Filament-3---Design-System--Community-?node-id=8-1029&t=z5BafwKoa0nDGc1T-1

Usar SE NECESSÁRIO para compreender:
- anatomia;
- comportamento;
- composição;
- estados;
- densidade;
- pattern de Filament.

ATENÇÃO:

O Figma usa laranja genérico do Filament.

NÃO copiar a identidade cromática do Figma.

Aplicar:
- estrutura/pattern Filament;
+
- identidade/tokens INEMA.

Primary = verde institucional do projeto.
Destructive = vermelho do DS.
Warning = token warning do DS.
Focus/active = tokens verdes oficiais.

============================================================
PRINCÍPIO CENTRAL DESTA RODADA
============================================================

Até agora vários elementos do DOR011 foram implementados
"parecidos com" o Design System.

Isso não é mais suficiente.

Nesta rodada o objetivo é:

USAR O DESIGN SYSTEM REAL.

Antes de editar:

- Card
- Modal
- Dialog
- Table
- Data Grid
- Button
- Badge
- Tabs
- Select
- Popover
- Section
- Empty State
- Toolbar
- Pagination
- File Upload
- Checkbox
- Radio
- Form Field

procurar primeiro o componente oficial existente.

Só criar componente novo se:

1. não existir equivalente no DS;
2. não for possível compor o comportamento com primitives existentes;
3. isso estiver documentado no mapeamento da FASE 2.

============================================================
CORREÇÕES VISUAIS/FUNCIONAIS JÁ DEFINIDAS
============================================================

Estas decisões devem ser memorizadas agora.

------------------------------------------------------------
A. TABS SUPERIORES
------------------------------------------------------------

A estrutura atual das tabs será refinada.

Usar o padrão canônico de Tabs do Design System / Filament:

- container único arredondado;
- tabs internas;
- tab ativa com superfície suave;
- sem underline longo como solução principal;
- tokens INEMA;
- horizontal scroll no estreito.

Labels:

Todos

Denúncia [RD]
Emergência [RE]
Alerta [RA]
Comunicado [RC]
Técnico [RT]
Ofício [OF]
Alerta de Condicionantes [AC]

IMPORTANTE:

O DOR NÃO manda mostrar apenas RD / RE / RA / etc nas tabs.

As siglas isoladas são exigidas para a coluna Tipo do Registro.

Nas guias, usar nome legível + sigla, coerente com os
protótipos de média fidelidade.

Não inventar sigla para "Todos".

------------------------------------------------------------
B. ESPAÇAMENTO APÓS AS TABS
------------------------------------------------------------

A legenda oficial:

"Expanda o grupo para visualizar os filtros e recolha-o quando não precisar utilizá-los."

está atualmente visualmente apertada.

Criar respiro deliberado.

Referência aproximada:
- Tabs → legenda: 8px
- Legenda → Card Filtros: 10–12px

Sem:
- caixa;
- alerta;
- fundo;
- ícone decorativo.

Manter:
- microcopy oficial;
- text-xs;
- muted;
- Dense UI.

------------------------------------------------------------
C. TAG DOR011 NA SIDEBAR
------------------------------------------------------------

Adicionar:

DOR011

ao lado do item:
"Pauta do Gestor - Registros"

Usar EXATAMENTE o mesmo componente/estilo/token das tags
DOR001–DOR007 já existentes no projeto.

Não criar variante.

Garantir:
- alinhamento;
- shrink-0;
- sem quebra;
- sem aumentar desnecessariamente a altura do item.

------------------------------------------------------------
D. FILTROS DE CONSULTA
------------------------------------------------------------

A implementação atual colocou os quatro grupos como superfícies
independentes.

Mudar para o arquétipo apresentado pelo DOR e pelo Design System:

UM ÚNICO CARD:

"Filtros de consulta"

Header do card:
- ícone oficial apropriado;
- título "Filtros de consulta";
- helper/contexto discreto à direita:
  "Combine critérios para refinar os resultados"
  caso este texto já esteja aprovado no projeto/DOR.

Dentro do card:
quatro grupos recolhíveis:

1. Dados do registro
2. Localização
3. Período e situação
4. Classificação

Cada grupo:
- linha interna;
- título;
- helper curto previsto;
- chevron;
- expansão independente.

Footer integrado:
- estado/resumo dos filtros à esquerda;
- "Limpar filtros";
- "Consultar";
- ações à direita.

Não criar quatro cards independentes.

USAR componentes oficiais de:
- Card/Section;
- Accordion/Disclosure;
- Buttons;
- spacing;
- separators.

------------------------------------------------------------
E. DATA GRID / TABELA DE REGISTROS
------------------------------------------------------------

A tabela atual deve ser refinada usando o DATA GRID CANÔNICO
DO DESIGN SYSTEM.

NÃO reconstruir visualmente uma tabela semelhante.

Na FASE 2 localizar:
- componente;
- source file;
- toolbar;
- table;
- header;
- rows;
- empty state;
- footer;
- paginação;
- action buttons;
- badges.

A composição final deve conter:

HEADER DO CARD:
[ícone oficial de tabela/lista] Registros

TOOLBAR:
somente controles necessários ao DOR011.

TABELA:
colunas oficiais.

FOOTER:
contador à esquerda;
paginação/per-page à direita conforme componente.

EMPTY STATE:
usar empty state oficial do Data Grid.

IMPORTANTE:

Não adicionar apenas porque existe no showcase:
- bulk actions;
- seleção de linhas;
- busca extra;
- delete;
- edit;
- filtros duplicados.

Só usar features exigidas pelo DOR011.

------------------------------------------------------------
F. COLUNA DE AÇÕES
------------------------------------------------------------

Na coluna "Ações", usar dois triggers compactos:

1. botão ICON-ONLY de VISUALIZAR
   ícone olho

2. botão ICON-ONLY de MAIS OPÇÕES
   três pontos

NÃO escrever "Ações" dentro do botão de três pontos.

Comportamento:

Olho
→ abre TL003 — Detalhes do registro.

Três pontos
→ abre TL004 — Ações do registro.

Usar icon buttons oficiais do DS.

------------------------------------------------------------
G. TL003 — DETALHES DO REGISTRO
------------------------------------------------------------

A tela existe, mas deverá ser alinhada ao arquétipo do DOR
e ao Modal/Card oficial do Design System.

Usar:

HEADER
- overline:
  "PAUTA DO GESTOR • REGISTROS"
- título compacto:
  "Detalhes do registro"
- fechar X

BODY

Linha de identificação:
[RD] 2026.xxxxxx/INEMA/RD [Situação]

"Dados do registro" em composição oficial de Card/Section.

Apresentar:
- data;
- origem;
- município;
- dias em aberto;
- demandante;
- classificação/eixo;
- descrição;
- coordenada;
conforme aplicabilidade/autorização simulada.

Arquivos anexos:
usar Section/Card do DS.

IMPORTANTE:

Histórico de ações NÃO deve permanecer permanentemente expandido
se o DOR define C031 como botão.

Footer:
- Fechar
- Histórico de ações
- Ações do registro

"Ações do registro"
→ abre TL004.

Preservar:
"Dados demonstrativos. A visualização não altera o registro."
quando previsto na referência aprovada.

Não copiar o wireframe pixel a pixel:
usar Modal + Cards oficiais.

------------------------------------------------------------
H. TL004 — AÇÕES DO REGISTRO
------------------------------------------------------------

O modal atual deve ser refinado.

HEADER:
- overline:
  PAUTA DO GESTOR • REGISTROS
- título:
  Ações do registro
- X

Contexto do registro:
[RD] + número

BODY:
grid compacto de ações.

CADA AÇÃO deve conter:

[ícone] Texto

O protótipo de média fidelidade possui ícones.
Eles ajudam scanning e NÃO são decoração gratuita.

Usar ícones oficiais/Lucide já adotados pelo projeto.

Exemplos de semântica:

Visualizar → Eye
Gerar PDF → Download/File
Geoespacial → MapPin
Adicionar arquivo → Upload/File
Adicionar comentário → Message
Arquivar → Archive
Encaminhar → Send
Formar Processo → Folder
Gerar Ofício → FileText
Converter Registro → Refresh/Arrow
Alterar eixo temático → Layers

Não inventar ícones exóticos.

Preservar:
- enabled/disabled;
- permissões simuladas;
- regras existentes.

Footer:
Fechar.

Usar Modal/Dialog oficial.

------------------------------------------------------------
I. PADRÃO GLOBAL DOS MODAIS
------------------------------------------------------------

TODOS OS MODAIS DO DOR011 devem ser auditados.

Não revisar somente os prints mencionados.

Mapear todos os Dialog/Modal usados por esta funcionalidade.

Exemplos conhecidos:

TL003 — Detalhes
TL004 — Ações
TL005 — Possíveis Duplicidades
TL006 — Desanexar
TL007 — Arquivar
TL008 — Encaminhar
TL009 — Adicionar arquivos
TL011 — Informações geoespaciais
Adicionar comentário
Alterar eixo temático
Conversão
e outros dialogs existentes.

REGRA:

usar o arquétipo oficial correto do Design System.

Não criar uma "casca de modal própria do DOR011".

------------------------------------------------------------
J. TL005 — POSSÍVEIS DUPLICIDADES
------------------------------------------------------------

Revisar usando Modal oficial.

Preservar funcionalidade:

- registro atual;
- candidatos;
- radio selection;
- status/data/município;
- Visualizar;
- regra de referência principal;
- Cancelar;
- Anexar.

Estrutura:

HEADER
BODY
FOOTER

Footer integrado usando tokens oficiais.

Anexar disabled:
usar estado disabled oficial,
não um verde arbitrariamente lavado.

------------------------------------------------------------
K. TL006 — DESANEXAR
------------------------------------------------------------

Revisar para Modal oficial.

Preservar:
- referência principal;
- justificativa obrigatória;
- mensagem de consequência;
- Cancelar;
- Continuar.

Não alterar lógica.

------------------------------------------------------------
L. TL007 — ARQUIVAR
------------------------------------------------------------

Revisar para Modal oficial.

Preservar:
- registro;
- motivo;
- justificativa;
- Cancelar;
- Arquivar.

Arquivar é ação destrutiva.

Usar componente/variant DESTRUCTIVE oficial do DS.

Vermelho semântico oficial.

Não transformar em primary verde.

------------------------------------------------------------
M. TL008 — ENCAMINHAR
------------------------------------------------------------

Revisar para Modal oficial.

Preservar:
- registro;
- destino;
- helper;
- Cancelar;
- Continuar.

Continuar:
primary verde institucional.

------------------------------------------------------------
N. FILE UPLOAD / ADICIONAR ARQUIVO
------------------------------------------------------------

Localizar no DS o componente oficial de File Upload.

O Figma/Filament possui padrão de:
Drag & Drop / Browse.

Se o projeto já possui componente equivalente:
REUTILIZAR.

Não recriar dropzone.

Preservar regras do DOR011.

------------------------------------------------------------
O. CONFIGURAR COLUNAS
------------------------------------------------------------

A implementação atual usa um modal.

O Design System / Filament possui padrão mais leve de:

POPOVER / DROPDOWN DE COLUNAS
ancorado no ícone de configuração da toolbar.

Na FASE 2 verificar se esse componente já existe.

Se existir:
USAR.

Preferência:
transformar Configurar Colunas em popover ancorado à toolbar,
desde que isso não viole regra funcional explícita do DOR.

Popover:
- título "Colunas";
- checkboxes;
- opções contextuais;
- estados obrigatórios/disabled;
- sem modal desnecessário.

Não inventar funcionalidades extras.

------------------------------------------------------------
P. CONFIRMAÇÕES
------------------------------------------------------------

Para confirmações simples ou destrutivas,
usar o confirmation dialog oficial do DS/Filament.

Warning:
- token warning.

Destructive:
- ícone semântico;
- vermelho oficial;
- Confirmar;
- Cancelar.

Não usar Modal completo quando uma confirmação canônica for suficiente.

------------------------------------------------------------
Q. TL011 — INFORMAÇÕES GEOESPACIAIS
------------------------------------------------------------

TEMOS essa tela.

Ela deve ser revisada contra:
- DOR011;
- protótipo de média fidelidade;
- Design System.

IMPORTANTE:
NÃO integrar GeoBahia.

É protótipo frontend.

Usar DADOS MOCK.

Exemplo de cenário demonstrável:

Registro:
2026.000081/INEMA/RD

Referência principal:
-12.9714, -38.5014

Município:
Salvador

Origem:
Registro

Documento relacionado mock:
RAE-2026-000081.pdf

Anexo estruturado mock:
pode possuir referência espacial declarada.

Arquivo comum:
pode aparecer no contexto documental SEM criar coordenada falsa.

A interface deve conseguir demonstrar:

- referência principal;
- referências espaciais adicionais;
- origem da referência;
- município;
- documento relacionado;
- anexos;
- metadados;
- ausência de geolocalização quando o anexo não tiver esse dado.

GeoBahia:
representar ponto futuro de integração.

NÃO chamar API.
NÃO abrir integração real.
NÃO conectar backend.

Se houver botão "Abrir GeoBahia":
usar estado demonstrativo/disabled previsto.

O disabled deve usar token oficial.

Modal:
usar componente oficial do DS.

------------------------------------------------------------
R. CARDS / SECTIONS
------------------------------------------------------------

O projeto possui "Card Padrão".

Usar os componentes oficiais para:

- blocos de detalhamento;
- filtros;
- tabela;
- seções modulares.

Não transformar tudo em card.

Usar card somente onde o arquétipo do DS pede superfície agrupadora.

------------------------------------------------------------
S. CORES
------------------------------------------------------------

Figma Filament usa laranja.

IGNORAR o laranja como identidade.

Estrutura:
Filament.

Identidade:
INEMA.

Usar tokens oficiais existentes.

Não hardcodar verde novo se o token já existir.

------------------------------------------------------------
T. DENSE UI
------------------------------------------------------------

Preservar a filosofia Dense UI.

Não aumentar:
- paddings;
- heights;
- radius;
- gaps;
- headers;

arbitrariamente.

Evitar modal "gigante".

Evitar H1 dentro de modal.

Modal heading deve usar escala própria do componente.

Inputs:
usar alturas oficiais do DS.

Ícones:
tipicamente 16px conforme componente,
não criar ícones oversized.

============================================================
FASE 1 — MEMÓRIA / INSTRUÇÕES
============================================================

EXECUTAR AGORA.

Objetivo:

gravar este conjunto de regras na memória persistente do projeto/Work
para que não se perca com contexto.

Não alterar produto.

Registrar pelo menos:

- objetivo da rodada;
- prioridade Design System;
- obrigação de reutilização de componentes;
- papel do PDF;
- papel dos mocks;
- papel do Figma;
- lista A–T acima;
- proibição de backend;
- fases seguintes.

Depois produzir:

"MEMÓRIA DOR011 — REFINO FINAL"

com resumo do que foi registrado.

E PARAR.

============================================================
FASE 2 — EXPLORAÇÃO + INVENTÁRIO + PLANO
============================================================

SOMENTE APÓS MINHA AUTORIZAÇÃO.

Nesta fase ainda NÃO desenvolver.

1. Abrir:
https://inema.acto.com.br/?rota=seia-v2&tela=design-system

2. Navegar pela página inteira do Design System.

3. Identificar visualmente e no código:

- Card
- Modal/Dialog
- Confirmation Dialog
- Table/Data Grid
- Table Header
- Table Toolbar
- Empty State
- Pagination
- Tabs
- Popover
- Column Picker
- Icon Button
- Button
- Badge
- Select
- Radio
- Checkbox
- File Upload
- Accordion/Section
- Form Field
- Helpers/descriptions
- Disabled state
- destructive/warning variants

4. Para cada componente:
descobrir o arquivo/source real no projeto.

NÃO mapear só por aparência.

5. Inspecionar o Figma Filament se necessário:

https://www.figma.com/design/nC1dpVy3akBMdb3XcWZhj1/Filament-3---Design-System--Community-?node-id=8-1029&t=z5BafwKoa0nDGc1T-1

Usar para compreender detalhes que não estejam claros no showcase local.

6. Relê os protótipos de média fidelidade TL001–TL015 do DOR011.

7. Inspecionar a implementação atual do DOR011.

8. Criar:

DOR011_COMPONENT_MAPPING.md

Tabela obrigatória:

| Área DOR011 | Componente atual | Arquivo atual | Componente DS encontrado | Arquivo DS | Reutilizar/Compor/Criar | Mudança necessária | Risco |

9. Criar:

DOR011_REFINO_PLAN.md

Separar:

A. REUTILIZAR DIRETAMENTE
B. COMPOR COM PRIMITIVES EXISTENTES
C. PRECISA CRIAR
D. NÃO ALTERAR

Para qualquer item em "PRECISA CRIAR":
justificar por que nenhum componente existente serve.

10. Criar inventário de TODOS os dialogs/modais usados pelo DOR011.

11. Fazer segundo plano de execução em ordem segura.

12. PARAR.

NÃO entrar na FASE 3 sem autorização.

============================================================
FASE 3 — DESENVOLVIMENTO
============================================================

SOMENTE APÓS MINHA AUTORIZAÇÃO.

Implementar o plano da FASE 2.

Regras:

- reutilizar DS;
- não redesenhar shell;
- não alterar regras de negócio aprovadas;
- não inventar campos;
- não adicionar backend;
- não criar integrações reais;
- usar mocks;
- não tocar em componentes compartilhados sem necessidade;
- quando tocar, executar regressão.

Implementar primeiro primitives/composição compartilhada,
depois telas.

Ordem recomendada:

1. Tabs
2. Card Filtros
3. Data Grid
4. Ações da tabela
5. TL003
6. TL004
7. padrão global dos modais
8. TL005/TL006/TL007/TL008/TL009
9. Column Popover
10. TL011
11. demais dialogs
12. sidebar DOR011
13. spacing final

============================================================
FASE 4 — REVISÃO / OLHO DE ÁGUIA
============================================================

Após desenvolvimento:

NÃO publicar automaticamente como "pronto".

Revisar adversarialmente.

Comparar lado a lado:

IMPLEMENTAÇÃO
vs
DESIGN SYSTEM
vs
PROTÓTIPOS DOR011.

Verificar:

- os componentes foram realmente reutilizados?
- algum foi recriado desnecessariamente?
- tokens corretos?
- cor correta?
- densidade?
- header/body/footer?
- modais?
- tabs?
- tabela?
- empty states?
- paginação?
- action icons?
- disabled?
- destructive?
- file upload?
- column popover?
- TL003?
- TL004?
- TL011?
- responsividade?
- teclado?
- overflow?
- foco?

Testar:

Desktop Full HD
4K
390px

Interações essenciais:
- tabs;
- filtros;
- expand/recolher;
- consultar;
- limpar;
- visualizar;
- três pontos;
- todos os modais;
- voltar;
- histórico;
- ações;
- duplicidade;
- desanexar;
- arquivar;
- encaminhar;
- upload;
- configurar colunas;
- geoespacial.

Se encontrar erro:
corrigir e revisar novamente.

Só avançar para FASE 5 quando a revisão estiver PASS.

============================================================
FASE 5 — EVIDÊNCIAS + ZIP PARA AUDITORIA EXTERNA
============================================================

SOMENTE se a FASE 4 passar.

Capturar screenshots finais suficientes para auditar:

- tela principal Full HD;
- tela principal 4K;
- 390px;
- tabs;
- filtros fechados;
- filtro expandido;
- Data Grid preenchido;
- empty state;
- TL003;
- TL004;
- TL005;
- TL006;
- TL007;
- TL008;
- upload;
- column popover;
- TL011;
- confirmation destructive;
- estados disabled relevantes.

Não gerar dezenas de imagens redundantes.

Gerar:

PACOTE-AUDITORIA-DOR011-UI-FINAL.zip

Estrutura:

01_requisitos/
- DOR011 original

02_design_system/
- DOR011_COMPONENT_MAPPING.md
- referências/componentes utilizados
- lista dos arquivos DS reutilizados

03_codigo/
- arquivos alterados
- patch/diff
- commit

04_planejamento/
- DOR011_REFINO_PLAN.md
- decisões de implementação

05_qa/
- RELATORIO-QA-VISUAL.md
- RELATORIO-QA-FUNCIONAL.md
- RELATORIO-REGRESSAO.md
- RELATORIO-BUILD.md

06_evidencias/
- screenshots finais

07_logs/
- TypeScript
- build
- testes
- Playwright

Criar também:

RESUMO-ENTREGA-UI-FINAL.md

contendo:

- o que foi alterado;
- quais componentes DS foram reutilizados;
- quais precisaram ser compostos;
- quais foram criados e por quê;
- regressões encontradas/corrigidas;
- testes;
- limitações exclusivamente do protótipo.

============================================================
GATE FINAL
============================================================

NÃO declarar:

10/10
homologado integralmente
produção pronta
backend concluído

A entrega será enviada para auditoria independente.

A responsabilidade deste Work é:

1. entender;
2. reutilizar o Design System;
3. implementar;
4. revisar;
5. provar.

============================================================
AGORA
============================================================

EXECUTE SOMENTE A FASE 1.

Grave todas estas instruções na memória persistente do projeto/Work.

Não edite código.

Não navegue ainda.

Não implemente nada.

Depois responda apenas com:

1. confirmação do que foi memorizado;
2. resumo das regras principais;
3. confirmação explícita:
   "FASE 1 concluída. Aguardando autorização para iniciar a FASE 2."

E PARE.
<!-- FIM_BRIEFING_ORIGINAL -->

