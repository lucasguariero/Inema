# DOR011 — Inventário completo de dialogs/modais — FASE 2

Data: 06/10/2026. Projeto: `C:/Users/lguar/projetos/Inema`.

Escopo: inventário AS-IS e plano TO-BE; nenhuma implementação, operação sobre registros ou deploy nesta fase.

## Como a implementação está organizada

Há dois pontos de entrada de UI modal, não um arquivo/modal diferente para cada TL:

1. `src/pages/fiscalizacao/PautaGestorRegistrosPage.tsx:95`: Dialog controlado por `configurando`, dedicado ao TL010 Configurar colunas.
2. `src/pages/fiscalizacao/PautaRegistroDialog.tsx`: Dialog de registro com navegação interna por `visao`, `confirmacao`, `relacionado` e `documento`. A branch normal começa em linha 51. A branch de acesso negado (linha 50) é alternativa mutuamente exclusiva, não uma terceira janela simultânea.

Todos usam `@/components/ui/dialog` (Radix). A branch de registro aplica `.pauta-dialog` + `max-w-3xl`; a classe privada define largura 720px/radius12/overflow, diferente do padrão base radius16/max-w-lg. O picker tem `max-w-lg` adicional, mas compartilha a mesma classe privada. Não tratar isso como ausência de Dialog oficial: a primitive já é a correta, o uso/composição precisa de revisão.

As 22 entradas lógicas abaixo incluem estados condicionais e quatro blocos latentes de integrações bloqueadas. Não são 22 modais separados nem 22 fluxos completos acessíveis no deploy. Histórico atualmente é seção embutida, documentada à parte.

Legenda de evidência:

- **Live + código**: visão aberta na página atual e source conferido, sem enviar/aplicar comando.
- **Código + PDF**: branch/regras conferidas; não executada nesta inspeção. Particularmente TL006 depende de parentesco que não está pré-semeado no fixture inicial.
- **Latente/bloqueado**: bloco textual existe no source, mas trigger normal disabled e guard de acesso impede sua utilização operacional.

## Inventário AS-IS × destino planejado

| ID | Visão / referência | Trigger e estado atual | Conteúdo e footer atuais | Evidência | Composição futura, sem regra nova | Risco de regressão |
|---|---|---|---|---|---|---|
| D01 | TL003 — Detalhes do Registro | Lista→Ações→Visualizar; `visao='visualizar'` | Título/número; Dados, Descrição, Coordenada, Arquivos e Histórico em Section separados; Voltar condicional/Fechar/X | Live + código; `PautaRegistroDialog.tsx:55` | Dialog oficial; overline/identidade Badge; dados integrados e anexos; histórico sob demanda; footer Fechar/Histórico de ações/Ações do registro; Eye passa a abrir diretamente | Dados pessoais, aplicabilidade, contexto e foco |
| D02 | TL004 — Ações do Registro | `abrir(r,'acoes')`; botão textual More+Ações | Grid 2 colunas de Button gray md sem ícones; enabled/disabled por política; Fechar/X | Live + código; `PautaRegistroDialog.tsx:54` | Dialog oficial compacto, identidade e ações ícone+label; semântica danger de Archive; dots icon-only abre esta visão | Permissão e bloqueio externo não podem se perder |
| D03 | TL005 — Possíveis Duplicidades | Badge-contador da coluna; `visao='duplicados'` | LEG016; radios/candidato número+situação+data+município; Visualizar; regra pai mais antigo/processo; Cancelar/Anexar disabled/X | Live + código; `PautaRegistroDialog.tsx:65` | Dialog + listagem/tabela oficial + GlaRadioGroup/Badge/Button. Mesmos candidatos e helper | Seleção única, autorização, pai e preservar seleção ao voltar |
| D04 | TL006 — Desanexar | Ação só quando `podeExecutar` e há `r.pai`; `visao='desanexar'` | Referência principal + textarea Justificativa obrigatória/LEG019; Cancelar/Desanexar; erro MSG020; confirma depois | Código + PDF; `PautaRegistroDialog.tsx:72,113` | Dialog oficial com consequência prevista, Cancelar/Continuar e confirmação compacta seguinte | Não desanexar no primeiro CTA; membros/versões/histórico |
| D05 | TL007 — Arquivar | TL004→Arquivar; `visao='arquivar'` | Select motivo/LEG017, descrição só Outros/LEG018, justificativa/LEG019; Cancelar/Arquivar primary; MSG009/010 | Live + código; `PautaRegistroDialog.tsx:73,114` | Mesmos campos e condições; Dialog oficial, Arquivar danger e confirmação danger | Motivo/Outros/justificativa e status só após confirmar |
| D06 | TL008 — Encaminhar | TL004→Encaminhar; `visao='encaminhar'` | Select Destino autorizado; não há helper atual; Cancelar/Encaminhar disabled sem seleção | Live + código; `PautaRegistroDialog.tsx:74,119` | Dialog oficial; helper previsto TL008, Cancelar/Continuar primary e confirmação posterior | Destino autorizado e ausência de envio prematuro |
| D07 | TL009 — Adicionar arquivo | TL004→Adicionar arquivo; `visao='arquivos'` | Input file oculto múltiplo + Button browse, LEG023, formatos, tabela arquivos/tamanho/ações; remover só pendentes; Cancelar/Adicionar disabled vazio | Live + código; `PautaRegistroDialog.tsx:77,122` | Composição oficial mínima InputWrapper+Button+input file nativo+Browse/drop+TableContainer/GlaTable; nenhuma regra/storage nova | Vazio/proibido/múltiplos, URLs de sessão e cancelamento |
| D08 | TL010 — Configurar colunas | Toolbar→Configurar colunas; `configurando`/`rascunhoColunas` | DialogHeader + LEG021, GlaCheckbox contextual; Ações/Duplicados checked+disabled quando mandatórios; Cancelar/Aplicar | Live + código; `PautaGestorRegistrosPage.tsx:95` | DropdownMenu ancorado com CheckboxItem e draft/aplicar/cancelar; título Colunas. Fallback Dialog oficial se menu não preservar acessibilidade | Aplicar indevido ao clicar/fechar, obrigatórios e dados protegidos |
| D09 | TL011 — Visualizar informações geoespaciais | Coordenada nos detalhes→`visao='geo'`; ação de integração em TL004 fica disabled | Principal/fonte/município/coordenada; referências adicionais; documentos/anexos com metadados; LEG024; integração pendente; Abrir GeoBahia disabled; Voltar/Cancelar/X | Live + código; `PautaRegistroDialog.tsx:91` | Dialog/Section/lista oficial mantendo todo o conteúdo, não integração externa | Prioridade de referência, origem e metadados simulados |
| D10 | Alterar eixo temático | TL004→ação elegível; `visao='eixo'` | Eixo/Subitem obrigatórios, LEG011, reset de subitem; Cancelar/Salvar disabled sem par válido | Live + código; `PautaRegistroDialog.tsx:75,120` | Mesmos Wrapper/Select/Button em Dialog canônico | Elegibilidade e par eixo/subitem |
| D11 | Adicionar comentário | TL004→Adicionar comentário; `visao='comentario'` | Textarea Comentário + LEG020, Cancelar/Adicionar comentário disabled vazio | Live + código; `PautaRegistroDialog.tsx:76,121` | Dialog/Wrapper/Button oficiais; comentário continua evento sem alterar situação | Não adicionar mudança operacional ou novo campo |
| D12 | Registro/Processo relacionado | Visualizar candidato TL005→`relacionado` | Número/data/município; tipo/status/descrição só registro; Section; Voltar/X | Live + código (processo candidato); `PautaRegistroDialog.tsx:53` | Mesma primitive, contexto do candidato e retorno à seleção original | Autorização do candidato e seleção/página preservadas |
| D13 | Documento relacionado / metadados de anexo | Visualizar/Visualizar metadados TL011→`documento` | Tipo/identificador, origem/nome, conteúdo demonstrativo; Voltar/X | Live + código; `PautaRegistroDialog.tsx:53` | Mesma primitive/Section; não leitor fictício de arquivo oficial | Não afirmar extração de coordenadas do PDF |
| D14 | Acesso negado | Guard `!itemAutorizado`/`acessoRestrito`/candidato não autorizado | DialogTitle Acesso negado, MSG003, Fechar/X; ramo alternativo | Código; `PautaRegistroDialog.tsx:50` | Dialog oficial compacto, mensagem/foco; preservar guarda | Vazamento de dados e foco ao retorno |
| D15 | Confirmação — Anexar | Anexar TL005 com alvo selecionado→`confirmacao.acao='anexar'` | Mesmo dialog largo, MSG016, Cancelar/Confirmar primary | Código + PDF; `PautaRegistroDialog.tsx:43,108,112` | Composição compacta Dialog+Button, contexto e confirmação sem novo wrapper | Cancelar não muda parentesco; comando único e versão |
| D16 | Confirmação — Desanexar | Continuar/Desanexar TL006 só após justificativa→`confirmacao.acao='desanexar'` | Mesmo dialog largo, MSG019, Cancelar/Confirmar primary | Código + PDF; `PautaRegistroDialog.tsx:43,108,113` | Confirmação canônica com consequência e semântica adequada; mesmo payload obrigatório | Grupo, justificativa, concorrência e retorno |
| D17 | Confirmação — Arquivar | Arquivar TL007 válido→`confirmacao.acao='arquivar'` | Mesmo dialog largo, MSG011; Confirmar atual primary incorreto | Código + PDF; `PautaRegistroDialog.tsx:43,108,114` | Dialog compacto, ícone/CTA danger oficial; Cancelar neutro; mensagem preservada | Arquivamento não pode acontecer antes nem duas vezes |
| D18 | Confirmação — Encaminhar | Destino selecionado TL008→`confirmacao.acao='encaminhar'` | Texto Encaminhar para destino; Cancelar/Confirmar primary | Código + PDF; `PautaRegistroDialog.tsx:43,108,119` | Dialog compacto, destino/contexto, primary; sem destinatário novo | Não encaminhar para fora do catálogo autorizado |
| D19 | Gerar PDF — bloco explicativo | `visao='pdf'` existe, trigger disabled RN043 e guard restringe | Texto sobre dependência documental; não emite PDF | Latente/bloqueado; `PautaRegistroDialog.tsx:87` | Manter bloqueio; se exibido por caminho permitido futuro, só Dialog/mensagem oficiais | Não simular emissão oficial por print do navegador |
| D20 | Formar Processo — bloco explicativo | `visao='processo'`, trigger disabled PE003 e guard restringe | Texto de definição externa, todos relacionados/referência; sem criação | Latente/bloqueado; `PautaRegistroDialog.tsx:88` | Nenhuma implementação do fluxo pendente | Não inventar processo/identificador/formulário |
| D21 | Gerar Ofício — bloco explicativo | `visao='oficio'`, trigger disabled RN041 e guard restringe | Modelo/numeração/fluxo pendentes; sem emitir ou mudar status | Latente/bloqueado; `PautaRegistroDialog.tsx:89` | Nenhuma implementação do fluxo pendente | Modelo e documento oficial fictícios |
| D22 | Converter Registro — bloco explicativo | `visao='converter'`, trigger disabled RN044 e guard restringe | Razão do bloqueio; não há form de tipoDestino ativo | Latente/bloqueado; `PautaRegistroDialog.tsx:90` | Nenhuma liberação ou novo select arbitrário | Tipo destino e regra externa inexistentes |

## Histórico: não é um modal atualmente

`PautaRegistroDialog.tsx:60` renderiza Histórico como Section sempre expandida dentro de TL003. Não existe uma visão `historico` atual nem outro Dialog exportado para isso.

O requisito C031 é um botão. A futura implementação deve usar o MESMO Dialog/Section existente para leitura sob demanda dos eventos; isso é uma nova visão de composição, não novo componente/modal proprietário nem nova regra. O botão Ações do registro C032 também deve levar a TL004 preservando a lista de origem.

## O que NÃO conta como modal DOR011

- TL001/TL002 são pauta/filtros; TL012/TL013/TL014/TL015 são estados/variação da página, não dialogs.
- Popups de FilamentSelect são listbox/combobox internos da primitive; devem ser testados dentro de Dialog, mas não contam como telas modal distintas.
- Pauta sem acesso (`PautaGestorRegistrosPage.tsx:77`) apresenta MSG003 na página, sem modal.
- Busca, perfil, notificações e modal de demonstração do Design System não pertencem ao inventário funcional DOR011 e não devem ser transplantados para a Pauta.
- Arquivo com URL disponível abre/download via link de sessão; isso não é modal implementado de leitura documental. Arquivo indisponível permanece disabled/texto sem link fictício.

## Navegação e invariantes para todos os estados

- Manter o foco preso à primitive oficial e devolvido ao trigger ao fechar. A branch normal hoje usa `onCloseAutoFocus`/`onRestoreFocus`; a branch negada precisa ser verificada também.
- Visões internas não alteram guia, filtros aplicados, ordenação, per-page ou posição da lista.
- Voltar de relacionado/documento remove só a subvisão, mantendo seleção/candidatos/contexto. Cancelar confirmação remove só `confirmacao`, sem executar comando.
- `enviado` impede submissão duplicada; `versoes.current` e `registro.versao` protegem concorrência simulada. Não remover essas travas para reorganizar footer.
- Erro de comando mostra MSG correspondente e não produz alteração parcial. Preservar `executarComando` e mensagens.
- Não usar Dialog completo largo para todos os avisos só porque DOR011 tinha um CSS uniforme. Usar a mesma primitive canônica com composição de tamanho/conteúdo correta, sem novo design paralelo.

## Conferência dos TL001–TL015 no PDF original

Páginas físicas, não a numeração incorreta do rodapé:

| TL | Páginas físicas | Conteúdo relido / impacto no plano |
|---|---|---|
| TL001 | 19–20 | Pauta, guias, filtros, grid, SLA e actions; usar estrutura oficial sem copiar paleta ilustrativa |
| TL002 | 21–22 | Filtros expandidos, dois exemplos visuais, um card e quatro grupos; helper de contexto autorizado na imagem |
| TL003 | 23–24 | Detalhes de leitura, identidade, dados, descrição/coordenada/anexos, C031 histórico e C032 ações |
| TL004 | 25–26 | Grid de operações com ícones e regras de aplicabilidade |
| TL005 | 27 | Duplicidades, seleção única, visualização e referência principal |
| TL006 | 28 | Desanexar, justificativa e consequência, progressão/confirmar |
| TL007 | 29 | Arquivar, motivo/Outros, justificativa e semântica destructive |
| TL008 | 30 | Encaminhar para destinatário com helper e progressão |
| TL009 | 31 | Arquivos adicionais, seleção e formatos; não inventar limite do showcase |
| TL010 | 32 | Colunas contextuais/obrigatórias, Cancelar/Aplicar. Wireframe modal não é veto à preferência atual de picker ancorado se preservar regras |
| TL011 | 33 | Referências geoespaciais e documentos relacionados; sem simular integração produtiva |
| TL012 | 34 | RA/AC vazios, clicáveis; MSG004 e ausência de dados sem excluir guia |
| TL013 | 35 | Zero resultados da consulta, MSG001, manter filtros e total zero |
| TL014 | 36 | Período inválido, MSG005, resultados válidos anteriores preservados |
| TL015 | 37 | Versão estreita, mesmos controles/fluxos e rolagens locais |

As páginas 38–39 (botões) e 40 (inconsistências/pendências) também foram relidas para não transformar screenshot ilustrativo em regra extra. Os 16 frames embutidos foram extraídos para `qa/cards/dor011-fase2-inspecao/pdf-reference/` e inspecionados em quatro folhas de contato. São referências do PDF, não evidências finais de implementação/QA.

## Pendências de verificação futura, explicitamente não executadas

- Criar em ambiente local de teste fixture de parentesco para inspecionar TL006 sem primeiro modificar um registro da página viva. O fixture inicial atual não tem pai pré-semeado.
- Abrir as quatro confirmações e validar Cancelar/Confirmar, duplo envio, versão e efeito no mock durante a FASE 3/4 autorizada. Nesta fase os branches foram auditados por código; nenhum comando de negócio foi enviado.
- Sessões alternativas para acesso negado/dados protegidos/colunas obrigatórias condicionais.
- Estado de Geo sem coordenada/documento/anexo/município, arquivo com URL e arquivo indisponível, upload inválido e nomes longos.
- Keyboard completo, 1920×1080/4K/390px, overflow e retorno de foco em todas as visões. Inspeção documental/live atual NÃO é relatório PASS adversarial.

FASE 2 somente. Nenhuma alteração funcional/visual implementada; nenhuma publicação realizada.
