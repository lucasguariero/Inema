# DOR011 — Plano de refino final — FASE 2

Data: 06/10/2026. Raiz: `C:/Users/lguar/projetos/Inema`.

Status: plano pronto; FASE 3 NÃO autorizada e NÃO iniciada. Este arquivo NÃO é ordem de execução automática. Só uma autorização explícita posterior permite implementar.

## Base e precedência

1. Pedido atual e `docs/DOR011_REFINO_FINAL_INSTRUCOES.md` governam os gates desta rodada.
2. DOR011 original governa campos, conteúdo, regras, fluxos, aplicabilidade e TL001–TL015; wireframes são ilustrativos, não paleta nem medidas pixel-perfect.
3. DS vivo e componentes reais governam anatomia, identidade INEMA, densidade e estados.
4. Figma Filament é referência secundária de composição/comportamento. Laranja NÃO substitui primary verde `#0F4C3A`; laranja de SLA continua existindo por requisito e por tokens INEMA.
5. Casca permanece `AppShell` legado. NÃO importar topbar/sidebar SEIA V2 para a Pauta.

Fontes auditadas e tabela elemento por elemento: `DOR011_COMPONENT_MAPPING.md`. Inventário completo de dialogs: `DOR011_DIALOG_INVENTORY.md`.

## Resumo da exploração

O catálogo foi percorrido integralmente: visão geral, marca/assets, cores/tokens, tipografia, espaçamento/forma, ícones, botões, campos/seleção, badges, cards, navegação, tabela, wizard, feedback/overlays, padrões, cinco templates e acessibilidade. A confirmação e o painel de notificações foram abertos para examinar a anatomia real. Esses exemplos não autorizam incluir notificações, métricas ou bulk actions no DOR011.

Pronto para reuso: Card completo, Section recolhível, Dialog Radix, DropdownMenu com checkboxes, Button com tamanho icon e cor danger, Badge, InputWrapper, FilamentSelect, GlaTable*, GlaCheckbox e GlaRadioGroup.

Diferenças importantes que impedem substituições automáticas:

- O catálogo vivo ainda mostra `FilamentTabs` underline. Existe `GlaTabs.segmented` no código, mas não é a variante exposta por FilamentTabs. A decisão nova de tabs contidas deve ser opt-in; não converter todas as tabs do projeto.
- O Data Grid do catálogo é uma composição de TableContainer + marcação local + controles. Não há uma tabela única pronta com regras DOR011 embutidas. A Pauta já reutiliza TableContainer/TableToolbar/GlaTable*.
- A confirmação oficial é uma composição Dialog+Button, não um wrapper ConfirmationDialog exportado.
- `GlaPagination` existe, mas fixa início da faixa em 1 e não contém per-page. Não perder a faixa correta da página 2 ao “reusar”.
- Não há FileUpload/Dropzone genérico funcional: o upload no template público é só visual. A seleção/validação TL009 já existe e permite composição mínima sem infraestrutura nova.
- Não há export genérico Popover/ColumnPicker. DropdownMenu é equivalente existente para seleção de colunas; o popup interno de FilamentSelect não é um primitive genérico.

## A. REUTILIZAR DIRETAMENTE

- [ ] `@/components/ui/card`: Card, CardHeader, CardTitle, CardDescription, CardContent e CardFooter para a superfície única de filtros, sem novo “PautaCard”.
- [ ] `@/components/filament/Section`: `compact`, `collapsible`, `defaultCollapsed`, `onCollapsedChange`, description e footer. Acordeões existentes permanecem independentes.
- [ ] `@/components/filament/InputWrapper`: labels, required, hints, valid/feedback. Inputs/textarea nativos dentro do wrapper são composição canônica, não campo novo.
- [ ] `@/components/filament/Select`: FilamentSelect existente, altura h-9, busca e teclado, mesmos catálogos/dependências/aplicabilidade.
- [ ] `@/components/filament/Table`: TableContainer com heading/description/toolbar/pagination e TableToolbar só com os controles exigidos.
- [ ] `@/components/common/GlaTable`: GlaTable, Head, Th, Body, Row, Td; não criar outro grid nem copiar o HTML do showcase.
- [ ] `@/components/ui/button`: sm32/md36, icon32, primary/gray/danger/warning, disabled e asChild. `color="danger"` é a opção explícita; alias destructive hoje corresponde a outlined, não deve ser remapeado globalmente.
- [ ] `@/components/ui/badge`: primary/gray/success/warning/danger/info e tamanhos oficiais; não criar nova variante para DOR011 ou status de exemplo.
- [ ] `@/components/ui/dialog`: Dialog, Content, Header, Title, Description, Footer, X/overlay/focus trap existentes. Não substituir por GlaModal, cuja implementação tem contrato de foco diferente.
- [ ] `@/components/ui/dropdown-menu`: Root, Trigger, Content, CheckboxItem, Label, Separator para o picker ancorado.
- [ ] `@/components/gla/primitives/GlaRadioGroup`: seleção única de candidatos, labels e teclado nativo; `GlaCheckbox` permanece disponível onde o contexto for formulário, não menu.
- [ ] Lucide existente: Filter/List, Eye, MoreHorizontal, Upload, Archive, Send, MapPin, FileText, Folder, MessageSquare, Layers e ícone convencional de conversão. Não instalar família/dependência nova.

O reuso acima não é autorização para modificar defaults das primitives. Primeiro usar as APIs/slots já existentes.

## B. COMPOR COM PRIMITIVES EXISTENTES

### B1. Tabs superiores

- [ ] Preservar `FilamentTabs` e seu contrato `tabs/items`, activeTab e onChange.
- [ ] Acrescentar variante contida opt-in no componente existente, aproveitando a anatomia já implementada em `GlaTabs.segmented`; default continua underline e nenhum consumidor antigo é convertido.
- [ ] Usar tokens de superfície/borda/texto/active INEMA, tab ativa suave, rolagem horizontal local e labels completos: Todos; Denúncia [RD]; Emergência [RE]; Alerta [RA]; Comunicado [RC]; Técnico [RT]; Ofício [OF]; Alerta de Condicionantes [AC]. Não inventar sigla de Todos.
- [ ] A variante deve explicitar tablist/tab, aria-selected e associação ao painel, com foco/navegação por teclado coerentes. Não mudar fluxo de consulta/limpeza de critérios ao trocar guia.
- [ ] Não criar TabsDOR011 nem duplicar GlaTabs em um novo arquivo. Não “corrigir” todas as tabs do DS como efeito colateral.

Justificativa da pequena extensão: GlaTabs.segmented já resolve a anatomia, mas FilamentTabs, exigido na base da Pauta e mostrado no catálogo, não expõe variante. Transportar somente essa opção é menos arriscado que trocar a família da tela ou alterar a aparência default de todos os consumidores. Esta decisão não significa que Tabs não exista.

### B2. Card “Filtros de consulta”

- [ ] Compor um Card oficial com header/título/ícone apropriado e helper previsto em TL002, sem pill de título.
- [ ] Reusar os quatro Section como disclosures internos planos, removendo apenas aparência de quatro cards via composição local. Não introduzir novo Accordion.
- [ ] Preservar grupos recolhidos por padrão, expansão independente, IDs/keys, estado dos campos e callback de aberto/recolhido.
- [ ] Section monta/desmonta conteúdo ao recolher: valores continuam no estado externo; a recomposição não pode reinicializar grupos inadvertidamente nem alterar `filtrosDaConsulta`.
- [ ] Footer oficial: resumo do estado atual dos critérios, Limpar filtros e Consultar. O resumo é derivado, não novo indicador de negócio nem lista de pills.
- [ ] Preservar LEG022 text-xs muted sem fundo/ícone. As margens 8px/12px já existem; reaplicar somente se a nova composição as deslocar. Não ampliar título→tabs.
- [ ] Manter overflow suficiente para FilamentSelect; Card/Section usam overflow-hidden por default, e Select tem menu absoluto não portalizado. Resolver no uso/composição, não mudando o Select global.

### B3. Data Grid “Registros”

- [ ] `TableContainer.heading` recebe composição Registros + ícone oficial de lista/tabela. Não criar card externo em volta da tabela já encapsulada.
- [ ] Preservar TableToolbar e seus únicos controles relevantes: ordenar e configurar colunas. Sem busca extra/bulk/seleção de linhas/edit/delete/filtros duplicados.
- [ ] Manter GlaTable* e colunas oficiais/contextuais. Refinar tokens/alinhamento sem outro componente DataGrid.
- [ ] Compor footer com contador à esquerda, per-page e navegação à direita. Manter faixa `inicio + 1` até mínimo da página, total, resets e estado disabled dos extremos.
- [ ] Não substituir por GlaPagination sem suportar a faixa/per-page. Nesta rodada, preferir manter a composição correta do slot com Button+FilamentSelect, evitando alteração de API compartilhada.
- [ ] Empty State é composição leve dentro do TableContainer, usando padrão do catálogo e as mensagens oficiais; não exportar novo componente apenas para envolver texto.
- [ ] RA/AC continuam clicáveis e vazios. Nenhum resultado (MSG001) não é a mesma situação que guia sem dados (MSG004) ou erro de filtros (MSG005/006).
- [ ] Manter semáforo: 0–89 gray/sem destaque forte, 90–149 warning amarelo, 150–180 laranja de tokens INEMA, 181+ danger. Nunca reduzir quatro intervalos a três cores.

### B4. Triggers da tabela

- [ ] Reusar Button size icon para Eye e MoreHorizontal 16px; nomes acessíveis contextualizados pelo número do registro.
- [ ] Eye abre a visão TL003; dots abre TL004. Não criar menu novo de ações além do Dialog especificado.
- [ ] Preservar captura do trigger, restauração de foco e posição/guia/página/ordenação da lista.
- [ ] Preservar botão-contador Badge da coluna Duplicados e candidato/autorização já calculados.

### B5. TL003 + histórico sob demanda

- [ ] Dialog oficial com overline PAUTA DO GESTOR • REGISTROS, título Detalhes do registro, X existente e linha tipo+número+situação.
- [ ] Reunir data/origem/município/dias/demandante/classificação/descrição/coordenada em composição de Dados do registro, sem multiplicar cards por cada campo.
- [ ] Aplicabilidade e `verDemandante` permanecem; não mostrar dado protegido em título, resumo ou candidatos.
- [ ] Anexos em Section/Card oficial; manter ausência de arquivo/URL honestamente indicada.
- [ ] Trocar histórico permanentemente expandido por botão C031 que abre visão sob demanda dentro do mesmo fluxo Dialog. Usar os eventos já existentes, não novo serviço de auditoria.
- [ ] Footer Fechar / Histórico de ações / Ações do registro; C032 abre TL004. Voltar restaura TL003 e contexto.

### B6. TL004 e casca canônica de todos os dialogs

- [ ] Reusar Dialog; header/identidade e grid compacto Button com ícone+label por ação.
- [ ] Preservar `podeExecutar`, `BLOQUEIOS_ACOES`, permissões, visibilidade/disabled e razões. Não habilitar GeoBahia, PDF, Ofício, Processo ou Conversão porque o layout foi refinado.
- [ ] Retirar geometria privada uniforme `.pauta-dialog` (720px, radius12, overflow global). Cada composição usa os tamanhos/slots oficiais de Dialog conforme volume de conteúdo; radius16 permanece o da primitive.
- [ ] Não criar casca modal DOR011, overlay/focus trap paralelos, novo GlaModal ou várias camadas simultâneas de Dialog para navegação interna.
- [ ] Corpo longo pode rolar dentro dos limites da composição, mantendo header/footer alcançáveis; avisos e confirmações curtas não herdam o tamanho de uma ficha longa.
- [ ] Rever também acesso negado, documento relacionado, registro/processo relacionado, eixo e comentário, não somente TL003/TL004.

### B7. TL005, TL006, TL007, TL008 e confirmações

- [ ] TL005: contexto, tabela/lista densa com seleção radio, número, status, data, município e Visualizar, helper de pai/processo; Cancelar/Anexar. Preservar seleção ao ir/voltar e algoritmo mais antigo/processo pai.
- [ ] TL006: referência principal, justificativa obrigatória, consequência e Cancelar/Continuar; confirmar só depois. Não executar desanexação no primeiro CTA.
- [ ] TL007: mesmos motivo/Outros/descrição/justificativa. Arquivar e confirmação usam danger oficial, não primary.
- [ ] TL008: destino autorizado + helper do TL008, Cancelar/Continuar verde, confirmação depois. Não criar destinatários.
- [ ] Quatro confirmações existentes — anexar, desanexar, arquivar, encaminhar — usam composição compacta Dialog+Button, não novo ConfirmationDialog.
- [ ] Preservar mensagens oficiais, snapshot de versões, trava enviado, ausência de mudança em Cancelar e registro único do histórico.

### B8. TL009 — upload mínimo, sem nova infraestrutura

- [ ] Reusar o input file nativo, InputWrapper, Button e estado de arquivos já presentes; compor área visual Browse/Drag & Drop de acordo com o padrão do catálogo/Figma.
- [ ] O catálogo NÃO contém FileUpload funcional. Por isso não existe dropzone pronto a reaproveitar, mas as primitives + comportamento nativo já permitem a composição; não extrair um novo componente genérico nesta rodada.
- [ ] Browse acessível por teclado e drag/drop chegam ao MESMO validador `arquivoPermitido` e MESMO estado File[]; mensagens/formatos/required são os do DOR, não os do template cidadão.
- [ ] Sem limite inventado de 15MB ou 50MB, preview artificial, extração de coordenadas/PDF, upload remoto ou storage.
- [ ] Lista oficial de selecionados/existentes, nomes longos/tamanho, remoção só de seleção pendente, CTA disabled vazio e cancelamento sem efeito.
- [ ] Preservar URLs locais e semântica de sessão. Não afirmar persistência após refresh.

### B9. TL010 — Column Picker ancorado

- [ ] Compor DropdownMenu controlado + Trigger oficial + Content/Label “Colunas” + CheckboxItem + LEG021 + Cancelar/Aplicar.
- [ ] Checked changes só alteram rascunho. Impedir fechamento automático ao selecionar checkbox; aplicar somente no botão Aplicar; Cancelar/Esc/fechar fora descartam rascunho.
- [ ] Reusar `colunasAplicaveis`/`colunasObrigatorias`: Ações e Duplicados checked+disabled QUANDO a regra exige, não sempre.
- [ ] Manter ordem canônica e dados pessoais protegidos.
- [ ] Validar teclado e footer de botões dentro do menu, portal/collision, retorno ao trigger e 390px. Não converter semanticamente um formulário em menu inacessível.
- [ ] Se a composição DropdownMenu não suportar corretamente Apply/Cancel e teclado na validação futura, manter Dialog oficial funcional como fallback, registrar o motivo e não criar Popover proprietário silenciosamente.

### B10. TL011 e demais visões

- [ ] Usar Dialog/Section e lista/tabela oficial para principal, adicionais, fonte, município, documentos e anexos. Não remover metadados para encurtar o modal.
- [ ] Preservar prioridade registro→documento→anexo→município e sua natureza de mock local.
- [ ] Coordenada clicável abre a inspeção geoespacial local; botão de integração continua disabled por RN055.
- [ ] Documentos/metadados de anexo abrem subvisão e voltam sem perder contexto. URLs indisponíveis não viram links fictícios.
- [ ] Nenhuma API GeoBahia/CAR, datum corporativo novo, extração automática ou documento oficial inventado.
- [ ] Eixo, comentário e acesso negado só recebem anatomia/estados oficiais, não regras/fields novos.
- [ ] Branches PDF/Processo/Ofício/Conversão permanecem bloqueadas. NÃO converter blocos explicativos latentes em implementações de fluxo.

## C. PRECISA CRIAR

Nenhum NOVO COMPONENTE AUTÔNOMO é imprescindível para este escopo depois da busca integral. Isso não significa que todos os padrões estejam prontos como exports:

| Lacuna real | Por que não usar cegamente o existente | Solução mínima prevista | Novo componente? |
|---|---|---|---|
| Variante contida de FilamentTabs | Contrato atual só underline; GlaTabs.segmented existe em outra família e não é o export canônico adotado pela Pauta | Estender FilamentTabs com variante opt-in usando anatomia existente; default preservado | NÃO; extensão limitada do componente existente |
| FileUpload funcional Drag & Drop/Browse genérico | Amostra DS é div sem input/handlers; uploads de outras telas são locais e com regras específicas | Compor InputWrapper+Button+input file nativo com a seleção/validação TL009 já existente | NÃO; composição local do fluxo existente |
| ConfirmationDialog exportado | O próprio exemplo canônico é Dialog+Button | Compor nas quatro confirmações sem nova casca | NÃO |
| EmptyState / ColumnPicker exportados | Amostras não são exports; nomes não encontrados em src | Compor TableContainer ou DropdownMenu com primitives existentes | NÃO |
| Paginação pronta com faixa/per-page DOR011 | GlaPagination não recebe início/per-page | Preservar composição correta do slot, não corrigir todos os consumidores | NÃO |

Nenhuma dependência, gerador de formulário/grid, framework de modal ou abstraction layer novo está planejado. Se surgir uma exigência impossível de compor na FASE 3, documentar a lacuna e confrontá-la com este gate antes de ampliar a superfície de componentes. Não declarar “componente ausente” sem nova busca.

## D. NÃO ALTERAR

- [ ] AppShell/Sidebar/breadcrumb legado, topbar, navegação de outros módulos, URL principal ou links congelados de entregas anteriores.
- [ ] Tag DOR011 já existente, microcopy oficial e respiro LEG022 já corrigido; título→tabs está fora do ajuste.
- [ ] `pautaGestor.ts`, `pautaColunas.ts` e cálculo de SLA/parentesco/permissões/versões como efeito colateral visual.
- [ ] Pesquisa AND por palavras completas sem acento, número completo, filtros abertos por RN006/007 e manutenção de resultados válidos em erro.
- [ ] Origens, órgãos, setores, municípios, áreas, UC, eixos/subitens, emergências, situações e destinos: nenhum catálogo novo.
- [ ] Escopo DIFIS/OUTRO, proteção de demandante, candidatos autorizados e elegibilidade de ações.
- [ ] RA/AC vazios e guias sempre clicáveis; fixtures de limites e mensagens MSG/LEG existentes.
- [ ] Defaults compartilhados de FilamentTabs, TableContainer/Toolbar, Dialog, Section, Select, Button, Badge, GlaTable/GlaPagination.
- [ ] Telas do redesign, Dashboard Gerencial aprovada, Design System shell e outras solicitações dos analistas.
- [ ] Backend, banco, autenticação/autorização real, storage, APIs, serviços documentais, GeoBahia/CAR e contratos corporativos.
- [ ] Pendências documentais: RN009×LEG002, F003/RT, RN006/007, PE001/002/003 e inconsistência do rodapé. Não “resolver” com regras inventadas.
- [ ] Bulk actions, seleção múltipla da lista, busca extra, edit/delete, métricas, notificações ou pills de título porque aparecem no showcase.

## Ordem segura de execução — FUTURA FASE 3

Todas as tarefas abaixo estão PENDENTES e só começam após autorização. Validar cada incremento antes de passar ao próximo; não fazer deploy automático.

| Ordem | Camada | Dependência / componentes | Autovalidação necessária antes de avançar |
|---|---|---|---|
| 0 | Congelar baseline e contratos | Capturar estado/diff preexistente e ler estes três documentos | Nenhuma mudança alheia incorporada; fixtures/escopos conhecidos; testes anteriores identificados sem presumir PASS atual |
| 1 | Extensão mínima de Tabs | FilamentTabs, anatomia GlaTabs.segmented | Build; DOR oito guias/labels/RA/AC, teclado/scroll; regressão do default nas telas consumidoras |
| 2 | Card de filtros | Card* + Section + InputWrapper/Select/Button existentes | Build; quatro grupos independentes/recolhidos, dependências, valores preservados, LEG022 e selects sem clipping |
| 3 | Data Grid | TableContainer.heading/Toolbar + GlaTable* + Badge | Build; colunas/ordenação/per-page/faixa, todos limites SLA, Empty States oficiais e nenhuma feature extra |
| 4 | Eye + dots | Button icon + estado abrir/restaurar foco | Build; destino correto de cada trigger e contexto da lista preservado |
| 5 | Anatomia oficial de Dialog | Dialog* existente, sem geometria privada uniforme | Build; overlay/X/Esc/focus trap/retorno, limites de conteúdo por arquétipo, sem regressão de Dialog global |
| 6 | TL003 + histórico | Dialog*, Badge, Section/Card, Button | Build; campos aplicáveis, anexos, histórico só sob demanda e footer oficial |
| 7 | TL004 | Dialog*, Button, Lucide | Build; ação por ação, ícone/label/semântica, permissões e bloqueios preservados |
| 8 | TL005/TL006 | GlaRadioGroup, GlaTable*, InputWrapper, Dialog* | Build; seleção+Voltar, pai mais antigo/processo, justificar/desanexar, cancelar/confirmação/concorrência sem alteração indevida |
| 9 | TL007/TL008 + quatro confirmações | Button danger/primary/warning, Select/Wrapper, Dialog compacto | Build; Outros/justificativa/destino, Cancelar/Continuar, vermelho de arquivo e envio único |
| 10 | TL009 | Composição mínima InputWrapper+Button+native file + TableContainer/GlaTable | Build; browse/drop/teclado, múltiplos/vazio/proibido/remoção pendente, cancelamento e URLs de sessão |
| 11 | TL010 | DropdownMenu + CheckboxItem + Button + estado draft existente | Build; obrigatórios/contexto, Cancelar/Esc não aplicam, aplicar mantém ordem, teclado/footer/portal no estreito |
| 12 | TL011 + demais branches | Dialog/Section/Table/Button; documento/relacionado/eixo/comentário/negado | Build; origem principal/adicional, metadados, retorno, ausência de coordenada/município e integrações bloqueadas |
| 13 | Revisão de toda a rodada | Auditoria A–T, PDF×DS×implementação; todos dialogs e TL012–015 | Fechar erros locais e regressões; não iniciar pacote final nem publicar como pronto |

Depois da implementação, a FASE 4 exige revisão adversarial e PASS explícito. Só então a FASE 5 pode produzir evidências finais/ZIP. Este plano não dá autorização para nenhuma das duas nem para deploy.

## Riscos de regressão em componentes compartilhados

| Superfície | Risco concreto | Contenção / futura verificação |
|---|---|---|
| FilamentTabs | Alterar underline default quebra UC, Regulação, ANSLA, CERH, CEFIR, fauna e outras telas SEIA V2 | Única extensão opt-in planejada. Contratos tabs/items e defaults intactos; amostras UC/Regulação/SEIA V2 e DS conferidas antes/depois |
| GlaTabs | Transformar a alternativa segmentada em outro componente duplica famílias; mudança global pode atingir CEUC | Usar como referência de anatomia, sem alterar o default GlaTabs |
| Dialog | Mudança de padding/radius/max-width/foco global afeta todo o produto; nova casca perde Radix | Não editar primitive global. Retirar só geometria privada DOR; testar todos os estados, Esc e retorno ao trigger |
| Section/Card | Overflow-hidden corta Select; desmontagem/rekey reseta expansão/valores ou critérios ativos | Usar slots/classes locais e preservar keys/onCollapsedChange; abrir select em cada seção e testar reabertura |
| FilamentSelect | Captura de Esc/Tab, busca por acento e menu absoluto dentro de Dialog | Não refatorar Select para este ajuste; validar busca/setas/Home/End/Enter/Esc/Tab dentro e fora de modal |
| TableContainer/Toolbar/GlaTable | Alteração de densidade/default/overflow muda todas as pautas | Usar heading/slots existentes; sem novo grid. Controle de filters do TableToolbar tem badge azul latente: DOR não o ativa; não expandir escopo para corrigir todo DS |
| GlaPagination | Uso direto perde faixa da página 2 e seletor por página | Manter composição existente. Não alterar consumers de Regulação/DAEs |
| Button/Badge | Trocar mapas globais de danger/warning/orange muda semântica de todo produto | Escolher props existentes, preservar classe SLA laranja tokenizada e conferir warning/danger/gray/primary sem copiar paleta Figma |
| GlaCheckbox / DropdownMenu | Check antigo dependia de CSS local; check fecha menu ou footer inacessível aplica sem querer | CheckboxItem existente com draft controlado; Cancelar/Esc/outside descartam; testar obrigatórios e teclado completo |
| PautaRegistroDialog / fluxo | Remontar componente reseta seleção; abrir vários Dialog sobrepostos perde foco; confirmação executa duas vezes | Manter contrato state/comando/versões/enviado/onRestoreFocus, navegar por visões internas e testar cancelar/Voltar/duplo envio |
| Upload | Drop ignora validação do Browse, URLs revogadas cedo, remoção de arquivo existente | Um pipeline de seleção/validação; não mudar domínio; testar os contrastes atuais e rotular corretamente simulação local |

## Base de testes existente para reaproveitar depois

Identificadas, não executadas nesta fase:

- `qa/cards/dor011-pauta-gestor-legendas-v3/refino.spec.cjs`
- `qa/cards/dor011-pauta-gestor-legendas-v3/microrefino.spec.cjs`
- `qa/cards/dor011-pauta-gestor-legendas-v3/legendas.spec.cjs`
- `qa/cards/dor011-microajuste-visual/qa.cjs`

As suítes anteriores incluem regras, escopo/permissões, candidatos, filhos, concorrência, upload, Select/teclado, paginação, TL011 e viewport. A futura rodada deve preservar assertions funcionais e atualizar apenas seletores realmente modificados (Eye/dots, labels de guias, picker e histórico sob demanda). Não eliminar teste porque encontrou regressão. As interações futuras de navegador devem obedecer à ferramenta de navegação disponível e suas instruções; localizar script anterior não autoriza executá-lo por uma tecnologia proibida na sessão.

## Checklist de validação FUTURA, não resultado desta fase

- [ ] Build final sem erros TypeScript/Vite, logs de execução desta rodada — não reutilizar resultado antigo.
- [ ] QA visual Light em 1920×1080, 3840×2160 e 390px; grade e tabs com scroll local, sem ampliar o documento.
- [ ] Todos os dialogs do inventário, header/body/footer e estados de erro/disabled/destructive, não só a página inicial.
- [ ] Teclado, foco visível, Esc interno do select antes do Dialog, restaurar foco e contexto da lista.
- [ ] Mensagens e LEG/C/BOT oficiais; RA/AC, zero resultados e data inválida são cenários distintos.
- [ ] Regras existentes intactas; nenhuma integração real ou operação documental fictícia liberada.
- [ ] Comparação lado a lado DS×PDF×Pauta e regressão de componentes/telas compartilhados afetados.
- [ ] FASE 4 adversarial com PASS antes da FASE 5/ZIP. Sem nota arbitrária ou promessa de homologação real.

## Encerramento da FASE 2

Entregáveis: este plano, `DOR011_COMPONENT_MAPPING.md` e `DOR011_DIALOG_INVENTORY.md`. Somente documentação e referências visuais derivadas do PDF foram geradas nesta fase. Nenhum arquivo de implementação foi alterado; nenhum build, commit/push ou deploy foi iniciado.

FASE 2 concluída. Mapeamento e plano prontos. Aguardando autorização para iniciar a FASE 3.
