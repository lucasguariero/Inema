# DOR011 — entrega de desenvolvimento da FASE 3

Data: 06/10/2026. Repositório: `C:/Users/lguar/projetos/Inema`.

Status: implementação local concluída, pronta para revisão adversarial, **sem aprovação final**. Executada somente a autorização do anexo `a89c25ed-cc88-47d1-91a3-89fcec54db33/Texto colado.txt`, seguindo o plano da FASE 2. Não foi feito deploy, push, commit, ZIP ou avanço para a FASE 4/5.

Baseline de código: `39297055bbf496bc5fe04b6f3e28146ea29da9e6`. Mudanças preexistentes em `.gitignore`, `AGENTS.md`, `MEMORY.md`, `REFACTOR.md` e documentos da FASE 1/2 foram preservadas. Apenas o estado dos gates foi atualizado nos dois arquivos de instruções/memória.

## 1. Arquivos de implementação modificados

| Arquivo | Alteração |
|---|---|
| `src/components/filament/Tabs.tsx` | Variante contained opt-in, semântica tablist, associação ao painel, foco roving e teclado; default underline intacto. |
| `src/pages/fiscalizacao/PautaFiltros.tsx` | Card único oficial, Sections internos e footer integrado; resumo derivado dos critérios existentes. |
| `src/pages/fiscalizacao/PautaGestorRegistrosPage.tsx` | Labels das guias, header Registros, Eye/dots, Empty State e picker ancorado com rascunho. |
| `src/pages/fiscalizacao/PautaRegistroDialog.tsx` | Anatomia dos dialogs, detalhes/histórico sob demanda, ícones das ações, radio/tabela de duplicidades, confirmações e seleção local de arquivos. |
| `src/pages/fiscalizacao/pautaGestor.css` | Remoção da geometria uniforme privada de modal e do workaround de checkbox antigo. |

Documentação desta entrega: este relatório; atualização de gates em `AGENTS.md` e `MEMORY.md`; checklist e verificações em `qa/cards/dor011-fase3-desenvolvimento/`.

Não alterados: `src/lib/pautaGestor.ts`, `src/lib/pautaColunas.ts`, `src/data/pautaGestorMock.ts`, primitive global Dialog, Button/Badge/Select/Section/Table/DropdownMenu, shell, rotas e menu. Os arquivos de domínio/colunas/mocks, Dialog global, `src/App.tsx` e `src/data/navigationConfig.json` foram comparados com HEAD pelo script de desenvolvimento.

## 2. Componentes DS efetivamente reutilizados

- `@/components/filament/Tabs`: FilamentTabs.
- `@/components/ui/card`: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
- `@/components/filament/Section`: Section.
- `@/components/filament/InputWrapper`: InputWrapper.
- `@/components/filament/Select`: FilamentSelect.
- `@/components/filament/Table`: TableContainer e TableToolbar.
- `@/components/common/GlaTable`: GlaTable, GlaTableHead, GlaTh, GlaTableBody, GlaTableRow e GlaTd.
- `@/components/ui/button`: Button, incluindo gray, primary, danger e warning existentes.
- `@/components/ui/badge`: Badge com variantes oficiais e classe SLA laranja tokenizada já existente.
- `@/components/ui/dialog`: Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription e DialogFooter.
- `@/components/ui/dropdown-menu`: DropdownMenu, Trigger, Content, CheckboxItem, Item, Label e Separator.
- `@/components/gla/primitives/GlaRadioGroup`: GlaRadioGroup para escolha única da duplicidade.
- Ícones Lucide já presentes no projeto; nenhum asset novo de identidade.

GlaCheckbox não precisou ser reimplementado: a composição preferencial do picker utiliza o CheckboxItem oficial do DropdownMenu. Não foi necessário criar Popover, DataGrid, PautaModal, Upload ou outro componente autônomo.

## 3. Extensão compartilhada

Somente FilamentTabs recebeu extensão: `variant="contained"`, `id` e `panelId`, todos opcionais. Continua usando `underline` por padrão e preserva as APIs `tabs`/`items`.

Na variante nova: Left/Right, Home/End, aria-selected, tabIndex 0/-1, foco visível verde e rolagem horizontal até a guia selecionada. Atalhos modificados, como Ctrl+Home, não são interceptados. Renderização SSR das duas APIs no modo default foi comparada exatamente com a versão HEAD, sem diferença de markup/classes.

Nenhuma primitive global de Dialog ou outro consumidor foi editado. A comparação SSR não substitui o teste visual de telas consumidoras na FASE 4.

## 4. Composições locais e sequência executada

| Ordem aprovada | Entrega de desenvolvimento |
|---|---|
| 0 — Baseline | Estado preexistente registrado; contratos e suítes anteriores preservados; build/TypeScript de referência sem erros. |
| 1 — Tabs | Oito guias com nome + sigla; Todos sem sigla; contained opt-in; RA/AC continuam clicáveis e vazias. |
| 2 — Filtros | Um Card “Filtros de consulta”, grupos independentes recolhidos, LEG oficial sem fundo e footer Limpar/Consultar. Aplicabilidade original preservada, inclusive Classificação ausente em OF. |
| 3 — Registros | TableContainer/Toolbar/GlaTable existentes, header com ícone, sem novo grid/busca/bulk action. Ordenação, paginação, colunas e SLA preservados. |
| 4 — Triggers | Eye icon-only abre TL003; dots icon-only abre TL004; labels acessíveis incluem o número do registro. |
| 5 — Dialog | Header/contexto/body/footer oficiais; largura por arquétipo; corpo longo rolável e footer separado; formas curtas mantêm overflow para o Select absoluto existente. |
| 6 — TL003 | Dados e anexos; histórico aberto somente pelo botão; footer Fechar / Histórico de ações / Ações do registro. |
| 7 — TL004 | Grid de ações com ícone + texto; trigger Arquivar gray + Archive; bloqueios e permissões existentes mantidos. |
| 8 — TL005/TL006 | Tabela e rádio oficiais; detalhes relacionados com Voltar; justificativa/consequência/Continuar; algoritmo de parentesco e comandos intactos. |
| 9 — TL007/TL008 | CTA e confirmação Arquivar danger; Outros condicional; destino autorizado e Continuar primary; quatro confirmações usam Dialog oficial compacto. |
| 10 — TL009 | Input nativo múltiplo, Button/Wrapper, área de drop e tabela existentes; browse/drop compartilham o mesmo pipeline de validação; URLs apenas de sessão. |
| 11 — TL010 | DropdownMenu ancorado com draft, CheckboxItem obrigatório disabled, Cancelar/Aplicar, teclado e margem de colisão de 16px. |
| 12 — TL011 e branches | Mesma anatomia oficial para contexto espacial, documento/registro relacionado, eixo, comentário e negado; dados e metadados preservados; GeoBahia disabled. |
| 13 — Fechamento local | Tipagem/build, verificações de desenvolvimento e rodada visual limitada desktop/390px; erros locais corrigidos. Não equivale à auditoria adversarial A–T integral. |

O resumo dos filtros é derivado dos mesmos critérios aceitos por `filtrosDaConsulta`; não acrescenta campo, indicador de negócio nem pills. Grupos fechados continuam fora da consulta segundo a regra já existente.

## 5. Desvios e decisões

- Nenhum desvio de escopo ou componente autônomo novo.
- Adendo externo aplicado: Arquivar é neutro na TL004 e destrutivo somente no CTA TL007 e confirmação.
- Picker ancorado mostrou draft, cancelamento, Esc e Apply por teclado funcionais; não foi necessário o fallback Dialog.
- Mantida a aplicabilidade original dos quatro grupos por guia, sem forçar campos não aplicáveis em OF ou RA/AC.
- Uploader é composição local; não representa envio a backend/storage. Arrastar/soltar usa o mesmo validador de seleção. O gesto real de drop ainda precisa ser exercitado na FASE 4.
- `impeccable` orientou a conferência da família visual e o lote de correções; `ponytail` manteve o reuso mínimo, sem nova dependência ou infraestrutura.

## 6. Problemas encontrados e corrigidos durante desenvolvimento

1. Composição do footer do DropdownMenu sobrescrevia a cor de texto do Button primário. Correção local preserva os tokens oficiais em default/hover/focus. Cor observada após correção: branco sobre `rgb(15, 76, 58)`; foco por teclado conferido.
2. Handler de Home/End da variante contained interceptava também Ctrl+Home. Agora ignora modificadores; retorno ao topo conferido no navegador.
3. Picker encostava na borda do viewport estreito; usado `collisionPadding={16}` da primitive oficial. Limites conferidos em 390px.
4. Um erro temporário de parêntese na composição de leitura foi corrigido antes de avançar; tipagem posterior e final sem erro.

Geometria privada uniforme removida. Popup de Origem e Motivo do arquivamento permaneceu visível; Esc do Select não fechou o Dialog. Retorno de foco ao acionador da tabela conferido.

## 7. Validação preliminar — resultados desta rodada

| Verificação | Resultado observado |
|---|---|
| `npx tsc --noEmit --pretty false` | Exit 0; nenhum diagnóstico TypeScript. |
| `npm run build` | Exit 0; Vite 8.3.0, 2742 módulos, build em 3,51s. Aviso de chunk acima de 500kB já existia na baseline; não alterado nesta rodada. |
| `node qa/cards/dor011-fase3-desenvolvimento/checks.cjs` | Exit 0. Default Tabs idêntico à baseline, APIs tabs/items, contained/ARIA, arquivos protegidos, SLA, RA/AC, escopo, colunas obrigatórias e formatos. |
| `git diff --check` | Sem erros de whitespace; avisos de normalização LF/CRLF do Git. |
| Navegador local | Sem mensagens error/warn no recorte de console consultado ao final. |

Interações verificadas na implementação local:

- Setas/Home/End das tabs, RA/AC vazias e retorno a Todos.
- Grupos de filtros independentes, Origem/Select, Esc, ausência de recorte em desktop e 390px.
- Página 2 com faixa 11–13 de 13 e retorno à página 1.
- Eye/dots, histórico sob demanda, Voltar e retorno de foco.
- Duplicidade com rádio preservado ao visualizar e voltar; Cancelar na confirmação preserva seleção. Anexar/desanexar exercitados somente no estado local, com registro mais antigo como referência e retorno a Em Análise Técnica. Mocks de origem não editados.
- Arquivar vazio mostra MSG009; Outros exige descrição (MSG010); CTA/confirmar danger. Cancelar preserva dados e status, sem executar a operação.
- Encaminhar sem destino disabled; seleção apenas dos destinos autorizados; Cancelar na confirmação preserva a escolha.
- Seleção nativa de arquivo: JSON rejeitado (MSG032), TXT aceito, remoção pendente desabilita envio; TXT readicionado produz link blob local nos detalhes. Estado descartado ao recarregar.
- Picker: marcar não fecha nem aplica; Cancelar/Esc descartam draft; Ações obrigatórias disabled; End/Enter no item Aplicar aplica; ordem de colunas preservada.
- TL011 aberto pela coordenada; documento relacionado e Voltar mantêm contexto; GeoBahia disabled.
- Em 390×844: documento sem overflow horizontal global, dialogs dentro do viewport, corpo longo com scroll e footer acessível; tabela/tabs têm scroll local. Não houve mudança do shell.

As suítes anteriores foram preservadas, não removidas nem enfraquecidas. Não foram executadas por outro automatizador de navegador nesta sessão; os testes de navegador foram feitos pela ferramenta de navegação disponível. A FASE 4 deve reaproveitar suas assertions funcionais e adequar somente os seletores alterados de fato.

### Capturas preliminares

Arquivos JPEG nativos do navegador, em `qa/cards/dor011-fase3-desenvolvimento/prints/`. São provas de desenvolvimento, não o conjunto final de evidências da FASE 5.

| Arquivo | Vista |
|---|---|
| `Print 01 - Pauta desktop.jpg` | Tabs, legenda, Card único e grid no shell legado, viewport 1920×1080. |
| `Print 02 - Detalhes desktop.jpg` | TL003, seções e footer com histórico sob demanda. |
| `Print 03 - Acoes desktop.jpg` | TL004, ícones, Arquivar neutro e integrações disabled. |
| `Print 04 - Colunas desktop.jpg` | Picker ancorado e Aplicar corrigido. |
| `Print 05 - Pauta mobile 390.jpg` | Tabs/filtros/grid com scroll local. |
| `Print 06 - Detalhes mobile 390.jpg` | Dialog longo com body scroll e footer separado. |
| `Print 07 - Acoes mobile 390.jpg` | Grid de ações refluído em uma coluna. |
| `Print 08 - Arquivar mobile 390.jpg` | Outros, justificativa e CTA danger. |
| `Print 09 - Colunas mobile 390.jpg` | Picker dentro do viewport com margem e foco em Aplicar. |

## 8. Pontos obrigatórios para a FASE 4

1. Confrontar A–T e todos TL001–TL015 / 22 branches do inventário com PDF e DS; não aprovar somente a página inicial.
2. Revisão visual adversarial em Full HD, 4K e 390px, incluindo todos os estados warning/disabled/destructive, valores longos, mensagens e Empty States distintos.
3. Matriz completa de permissões/escopos, filhos/pai/processo, concorrência simulada, duplo envio e histórico único; confirmar que as assertions prévias continuam atendidas.
4. Regressão visual de consumidores underline nas telas UC/Regulação/SEIA V2 e DS, além da comparação SSR já realizada.
5. Teclado/focus trap completo, Shift+Tab/Tab, Esc aninhado, clique fora e retorno ao trigger após cada branch; seleção de colunas por teclado e contexto sem dados.
6. Select absoluto em dialogs com viewport mais baixo/teclado virtual: verificar recorte e rolagem dos formulários curtos sem quebrar o popup.
7. Upload múltiplo, gesto real de drag/drop, re-seleção, vazio, formatos, cancelamento e revogação de URLs nos cenários de erro; nenhum storage real.
8. TL011 com ausência de coordenada/município e documentos diversos; integrações bloqueadas; conteúdo/documento/contexto protegidos.
9. Paginação, per-page, ordenação e consulta com erros de data/CPF/coordenada; dependências Origem→Órgão/Setor e Eixo→Subitem; valores ao recolher/reabrir.

Nenhuma nota de qualidade arbitrária, PASS adversarial ou homologação de backend é declarada aqui.

**FASE 3 concluída. Implementação pronta para revisão adversarial da FASE 4. Aguardando autorização.**
