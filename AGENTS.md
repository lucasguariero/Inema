## Gestão de Fauna Silvestre (DR009, DR010, DR012 + DR008) — Publicação Oficial Homologada (03/11/2026)

Autorização de publicação cumprida: entrega homologada localmente com 100% de conformidade normativa nos Documentos de Requisitos DR009 v1.3 (ASAS), DR010 v1.2 (Mapa de ASAS e Destinações), DR012 v1.1 (Guardião e TGAS) e integração DR008 (Admissão e Termo de Soltura e Destinação). Publicado no domínio canônico https://inema.acto.com.br. Novo deployment READY e promovido. Predecessor/rollback registrado: `dpl_Hz4CrcxUKXrauBdKverfX5Rrap4V`.

Veredito Oficial:
GESTAO DE FAUNA SILVESTRE — NORMATIVE & COMPREHENSIVE COMPLIANCE APPROVED (47/47 PASS) / 12 SCREENS VALIDATED / INTEGRATION DR008 TESTED / DEPLOYED TO PRODUCTION

Itens validados pós-publicação (100% PASS):
1. DR009 v1.3 (Áreas de Soltura de Animais Silvestres - ASAS):
   - TL001 (Listagem de ASAS): Tabela canônica GLA com contadores de status, pesquisa textual debounced, coerência estrita entre validade e situação (ASAS-000.001 com certificado vencido em 10/05/2026 e ASAS-000.002 ativa), e ação exclusiva de cadastro legado da CGFAU (RN-037).
   - TL002 (Requerimento e Cadastro): 5 abas completas (Requerimento & Categoria com ART, Propriedade com CEFIR e bioma, Documentação, Histórico de Solturas e Trilha de Auditoria). Validação vetorial de KML com MSG003/RN-008.
   - TL003 (Vistoria F-TEC-133): Vistoria técnica in loco, parecer, inventário de recintos e capacidade zootécnica.
   - TL004 (Gestão e Decisão da CGFAU): Ciclo de vida completo (Deferimento, Renovação RN-025, Suspensão RN-027, Substituição de RT RN-038 e relatórios trimestrais RN-034).
   - Documentos A4: DOC001 (Certificado de ASAS), DOC002 (Notificação de Indeferimento com prazo recursal de 10 dias úteis) e DOC003 (Termo de Compromisso Anexo V).
2. DR010 v1.2 (Mapa de ASAS e Destinações):
   - Representação Cartográfica e Listagem Lateral (RN-003): Áreas em complementação ou aguardando termo unificadas sob a categoria "Em análise" (badge cinza), com a situação original do DR009 preservada no cadastro e exibida com transparência no Drawer.
   - Exclusão Rigorosa (CA003): Áreas Indeferidas e Desativadas excluídas do mapa e da listagem lateral.
   - Contadores da Legenda (CA002): Reconciliados 1-a-1 com as 6 áreas canônicas com delimitação vetorial efetiva (Ativas: 1, Vencidas: 1, Suspensas: 1, Em análise: 3).
   - Camadas e Contingência: Camadas de Biomas, UCs, Hidrografia e limites do CEFIR com alternância reativa e modo offline contingencial com aviso MSG002.
   - Clusterização em Macroescala (CA005): Agrupamento regional em escala estadual com rótulo sóbrio `Salvador / RMS (40 ASAS)` e dissolução automática em centróides locais no zoom de detalhe.
   - Drawer TL002 e Controle de Acesso (RN-001): Ficha resumida com histórico de solturas e tela de bloqueio impeditivo com aviso de sigilo para perfil Requerente.
3. DR012 v1.1 (Guardião de Animais Silvestres / TGAS):
   - TL001 (Listagem de Guardiões): Indicadores dinâmicos de cota (x/5 ocupados) e badges de situação regulamentar.
   - TL002 (Formulário F-TEC-187): Validação de 5 animais por CPF (RN-006 / MSG003) e bloqueio no mesmo endereço (RN-006 / MSG004) sem badge conflitante.
   - TL003 (Análise e Vistoria): Checklist documental e laudo de vistoria in loco (RN-007 / DOC003).
   - TL004 (Vínculo ao TGAS): Seleção de animais aptos com exigência de 2 assinaturas (RN-017) e emissão de Laudo Técnico CETAS em Lote DOC002 (RN-013).
   - CA022 (Sequência Completa E2E e Estado Persistido): Inclusão de 3º animal em TGAS vigente (Dr. Marcelo Sampaio) bloqueada com MSG008 sem laudo veterinário assinado, liberada com Laudo DOC002 e persistida no storage como TGAS Vigente com cota 3/5.
   - TL005 (Acompanhamento e Ocorrências): Controle de relatórios semestrais com CRMV (RN-021) e registros de óbito (30d necropsia) e fuga (5d úteis).
   - TL006 (Encerramento do TGAS): 8 hipóteses da RN-026 rigorosamente alinhadas, iniciando com a Hipótese I (Morte do responsável com prazo de comunicação de 30d e realocação de 120d) e hipóteses de infração/maus-tratos com apreensão cautelar imediata (RN-027).
   - Documentos A4: DOC001 (TGAS com QR Code e cláusulas de guarda) e DOC003 (Notificação Técnica de Adequação).
4. Integração Mandatória DR008 / DR009 / DR012:
   - Bloqueio Clínico (RN-030 / CA018): Animais internados bloqueados para emissão com aviso MSG010.
   - ASAS com Certificado Vencido (RN-026 / CA013): Elegível para seleção no Termo de Soltura com alerta instrutivo MSG011.
   - Vínculo com Guardião (RN-012): Seleção de guardião exibe cota calculada real (vagas restantes) e sincronização automática do endereço do recinto nos campos de saída do TSD.
   - Trava Biológica (RN-013): Espécime apto à soltura plena (`ani-001`) bloqueado para guarda com validação biológica específica RN-013, inibindo emissão do TSD.
   - Conclusão da Destinação: Animal inapto com laudo atestado (`ani-005`) conclui o TSD (`TSD-2026-0015`) e atualiza formalmente o vínculo ao `TGAS-2026/0012` com cota 3/5.
5. Higiene Visual e Anti-AI-Slop:
   - Zero anotações técnicas de QA, códigos de teste ou fixtures na interface pública.
   - Cores institucionais do padrão SEIA V2 / GLA (`#0F4C3A`, verde institucional).
   - Viewport mobile 390px validado sem overflow horizontal (`scrollWidth <= clientWidth`).
6. Módulos protegidos (Assinatura Eletrônica, Requerimento Ambiental Unificado, Conselho Gestor, COTIC, COINE BESS e 5 FCEs, Fiscalização RFA/RAE/DOR014/DOR011, CEUC, CERH e Regulação): 100% íntegros e funcionais online.
7. Rollback documentado: `npx vercel rollback dpl_Hz4CrcxUKXrauBdKverfX5Rrap4V --yes --scope guariero`.

---

## Assinatura Eletrônica — Hotfix Visual Final publicado no domínio oficial (29/10/2026)

Autorização cumprida: dois ajustes visuais aprovados pela auditoria externa corrigidos e publicados no domínio canônico https://inema.acto.com.br. Novo deployment READY e promovido: `dpl_Hz4CrcxUKXrauBdKverfX5Rrap4V`; predecessor/rollback registrado: `dpl_EYoH95CHtJGPo9A2NPYqBwDbgE3F`.

Itens validados pós-publicação (100% PASS):
1. Tela "A Assinar": remoção da altura artificial (`stableHeight={false}`) no container da tabela quando há apenas dois registros pendentes. O card acompanha o conteúdo de forma compacta e natural (34px de altura de corpo), mantendo toolbar e tabela íntegras, sem modificar globalmente o TableContainer.
2. Consulta Pública de Autenticidade: campos "Requerente / Interessado" e "Município" corrigidos com estrutura canônica vertical (`flex-col gap-1`, rótulo uppercase com ícone e valor destacado em linha separada sem concatenação).
3. Consulta Pública de Autenticidade: aviso demonstrativo simplificado (`bg-amber-50`), eliminando citações nominativas e jargões técnicos desnecessários, mantendo com clareza o aviso de simulação demonstrativa do protótipo SEIA.
4. Validação visual em 1440, 1920 e 390 px executada localmente e online com 100% PASS.
5. Módulos protegidos (Regulação, Fiscalização RFA, Conselho Gestor, Fauna, CERH, COINE): 100% íntegros online.
6. Rollback documentado: `npx vercel rollback dpl_EYoH95CHtJGPo9A2NPYqBwDbgE3F --yes --scope guariero`.
7. Pacote de entrega: `outputs/INEMA-ASSINATURA-ELETRONICA-HOTFIX-FINAL.zip` (SHA-256: `6516440777f0d0de660037d87c88f5c881411a9a119a1b7ede698a92447698f8`).
8. Sem commit ou push.

---

## Assinatura Eletrônica — Auditoria Anti-AI-Slop, Refinamento UX/UI e Publicação Oficial (29/10/2026)

Autorização de publicação cumprida: demanda de Thays + Matheus (29/10/2026) implementada, auditada e publicada no domínio canônico https://inema.acto.com.br. Novo deployment READY e promovido: `dpl_EYoH95CHtJGPo9A2NPYqBwDbgE3F`; predecessor/rollback registrado: `dpl_DDhe6cyMtCCZZAt9M4sZ1Xe71Re3`.

Veredito Oficial:
ASSINATURA ELETRÔNICA — UX/UI APPROVED / ISOLATED NAVIGATION / PUBLISHED / ONLINE VALIDATED / INSTITUTIONAL HOMOLOGATION PENDING

Itens validados pós-publicação (100% PASS):
- UX01 (Cabeçalho do Workspace): Remoção do escudo decorativo ShieldCheck antes do título h1; título dinâmico conforme a aba ("A Assinar", "Documentos & Atos", "Parametrização por Etapa"); subtítulo institucional sóbrio; botão "Reset" renomeado para "Reiniciar cenário"; identidade do servidor logado limpa e sem ícone UserCheck; alinhamento flex responsivo.
- UX02 (Sidebar Exclusiva): Exatamente 2 itens ("A Assinar" e "Documentos & Atos") sem badges descartáveis ("Novo", "SEIA"); botão "Assistente INEMA" ocultado no escopo exclusivo de assinatura.
- UX03 (Aba Parametrização & Deep Links): Sincronização automática com query param `&aba=parametrizacao`, histórico popstate funcional, recarga F5 direta na aba e breadcrumb contextual `Início › Assinatura Eletrônica › Parametrização por Etapa`.
- UX04 (Tabelas): Coluna de Ações da tabela "Documentos & Atos" com botão "Ver A4" em `whitespace-nowrap` sem quebra de linhas; tabela de "Parametrização por Etapa" encapsulada em container com rolagem horizontal (`overflow-x-auto`).
- UX05 (Higiene Textual Anti-AI-Slop): Eliminação de termos em inglês e simplificação de avisos de simulação.
- UX06 (Consulta Pública de Autenticidade): Topbar com logo oficial do INEMA (`/logo.svg`), banner de demonstração discreto (`bg-amber-50`), retorno canônico para `/?rota=a-assinar&escopo=assinatura-eletronica` e validação de código fictício funcional.
- UX07 (Selo A4 & Modal Documento): Selo A4 com padding compacto (`p-3.5 sm:p-4`) e QR Code proporcional (`w-16 h-16 sm:w-20 sm:h-20`); signatários em linhas horizontais compactas; margem de segurança `mr-8` na topbar do modal prevenindo sobreposição do botão fechar.
- Responsividade: Validação sem overflow horizontal em 1920, 1024, 768, 390 e 375 px.
- Módulos protegidos (COTIC, Conselho Gestor, COINE, Fiscalização RFA/RAE, CERH, Fauna e Regulação): 100% íntegros e funcionais online.
- Rollback documentado: `npx vercel rollback dpl_DDhe6cyMtCCZZAt9M4sZ1Xe71Re3 --yes --scope guariero`.
- Pacote de entrega: `outputs/INEMA-ASSINATURA-ELETRONICA-REFINAMENTO-FINAL-PUBLICACAO.zip` (SHA-256: `3bf3b220e51947b1c5618a6c35d42ff04b00cc45bdfde3dfbffea2d747a5f416`).
- Sem commit ou push.

---

## Requerimento Ambiental Unificado — Alinhamento dos 3 Selects da Etapa 2 publicado no domínio oficial (29/10/2026)

Autorização de publicação cumprida: solicitação de Tainá (29/10/2026) implementada e publicada no domínio canônico https://inema.acto.com.br. Novo deployment READY e promovido: `dpl_DDhe6cyMtCCZZAt9M4sZ1Xe71Re3`; predecessor/rollback registrado: `dpl_5mXRpeDQXq5ykJhvQwmjY5BBRNZB`.

Itens validados pós-publicação (100% PASS):
- Requerimento Ambiental Unificado (Etapa 2 — Enquadramento da Atividade): os três selects existentes (`Tipologia Principal da Atividade *`, `Grupo do ato administrativo ambiental *` e `Tipo de Ato Requerido *`) foram alinhados lado a lado na mesma linha no desktop (grid 12 colunas dividido em 4 + 4 + 4).
- Alinhamento vertical e dimensional perfeito: coordenadas `y` idênticas (373.64px), altura padrão de 36px e gaps uniformes de 16px.
- Responsividade: em mobile (390px) e telas menores, os selects adaptam-se com empilhamento vertical suave sem truncamento de texto nem overflow horizontal (`scrollWidth <= clientWidth`).
- Reatividade e interatividade preservadas: troca de grupo filtra atos DIRRE dinamicamente e atualiza o card institucional de ato (`ATOS_CATALOGO`).
- Módulos protegidos (COTIC T-08, Conselho Gestor, COINE, Fiscalização, CERH, Fauna e Regulação): 100% íntegros e funcionais online.
- Rollback documentado: `npx vercel rollback dpl_5mXRpeDQXq5ykJhvQwmjY5BBRNZB --yes --scope guariero`.
- Sem commit ou push.

---

## Rodada 02 — Conselho Gestor + Refinamentos UX/UI + Requerimento Unificado publicados no domínio oficial (29/10/2026)

Autorização de publicação cumprida: Rodada 02 publicada no domínio canônico https://inema.acto.com.br. Novo deployment READY e promovido: `dpl_5mXRpeDQXq5ykJhvQwmjY5BBRNZB`; predecessor/rollback registrado: `dpl_A6DxPRzppodAJ3Xhp79Lo1ZGts3c`.

Itens validados pós-publicação (100% PASS):
- Requerimento Ambiental Unificado: Card lateral "Resumo do Requerimento" ausente nas etapas 1 a 4 (formulário em largura total contínua); renderizado exclusivamente na Etapa 5 de Revisão sem o badge redundante de progresso ("Etapa X de 5"). Dados úteis (Requerente, Ato, Intervenções, RT) íntegros e reativos.
- Topbar institucional: Logo INEMA padronizado em 36px de altura (`h-9`), alinhado verticalmente com contraste aprimorado.
- FilamentWizard responsivo em tablet 768px: Rolagem horizontal suave com snap e divisórias em chevron sem truncamento.
- Cabeçalhos e botões de retorno canônicos: `SeiaV2PageHeader` com botão `ArrowLeft` ergonômico (target 44x44px) e largura padronizada em `max-w-7xl mx-auto` nas telas de Denúncia Interna e Emergência Interna.
- Tipografia limpa e Anti-AI-slop: Remoção de numeração descartável (`1.1.`, `1.2.`) e eliminação de ícones decorativos soltos antes de títulos (`h2`/`h3`).
- Conselho Gestor (DOR0031 e DOR0032): 10 ajustes de Hérikles e CEUC homologados (justificativa de plenárias RN028/MSG016, origens SEI-BA/WhatsApp com protocolo condicional RN017, descrição resumida de ações opcional, dados cadastrais desduplicados, Total de Cadeiras na consulta pública RN026, edição do técnico e trava DG sem assinatura RN002, Select RPGA RN029, notificação ao gestor na pauta RN006/MSG011, justificativa de convocatória RN007/MSG012).
- Módulos protegidos (COTIC T-01 a T-08, COINE BESS e 5 FCEs, Fiscalização DOR014/RFA/RAE, CEUC, CERH, Fauna e Regulação): 100% íntegros e funcionais online.
- Rollback documentado: `npx vercel rollback dpl_A6DxPRzppodAJ3Xhp79Lo1ZGts3c --yes --scope guariero`.
- Sem commit ou push.

---

## COTIC / Tainá — Correção T-08 publicada no domínio oficial (29/10/2026)

Autorização de publicação pontual cumprida: unificação da navegação de Denúncias e Emergências (T-08) publicada no domínio canônico https://inema.acto.com.br. Novo deployment READY e promovido: `dpl_A6DxPRzppodAJ3Xhp79Lo1ZGts3c`; predecessor/rollback registrado: `dpl_H2tQF1k5FtH2PGzuAZbNtFPFr2ot`.

Itens validados pós-publicação (100% PASS):
- Sidebar de Fiscalização consolidada com 6 itens (`Minhas Denúncias`, `Minhas Emergências`, `Denúncia Cidadão`, `Minhas Análises`, `Transporte de Resíduos (DTRP)`, `Associar Técnico`), eliminando `Nova Denúncia` e `Nova Emergência` como entradas avulsas.
- Listagens de Denúncias e Emergências com CTAs primários para criação de formulários.
- Botões de retorno funcionais para as respectivas listagens.
- Rotas de criação e recarga (F5) íntegras sem desvios de contexto.
- Item ativo da sidebar canonicamente associado ao módulo pai.
- Preservação de rascunhos em LocalStorage e dados entre etapas.
- Integridade total (HTTP 200 e DOM renderizado) das 5 frentes de 29/10, dos 5 FCEs da COINE e dos módulos históricos (CEUC, CERH, Fauna, RFA/RAE, DOR014, DOR003, Regulação).
- Rollback: `npx vercel rollback dpl_H2tQF1k5FtH2PGzuAZbNtFPFr2ot --yes --scope guariero`.
- Sem commit ou push.

---

## COINE — BESS LP publicado no domínio oficial (28/10/2026)

Autorização humana posterior (“sim pow”) para domínio oficial substituiu a limitação anterior a Preview. URL https://inema.acto.com.br/?rota=coine-bess&escopo=coine . Deployment dpl_8QqPx98LDf4m7hkywXXkE3btbpzq READY/promovido; rollback dpl_1iRreUxXQ2TQ7Vtj7cPGrbGC13Ne. Publicação aditiva preserva116arquivos da produção SHA-idênticos, acrescenta6BESS e regra exclusiva antesfilesystem/cleanUrls. Não promover artefato isolado sobre todoportal.56testes no candidato final e56oficiais PASS, mais116hashesoficiaisPASS. Não houve commit/push ou inclusão da frente COTIC pausada. D01–D10 abertos; sem backend/protocolo/envio/rascunhopersistente. Relatório outputs/coine-bess-oficial/RESULTADO.md. Não iniciar outra missão automaticamente.

---

## COINE — BESS LP publicado exclusivamente como Preview (28/10/2026)

Autorização humana posterior cumprida apenas para o candidato visual isolado: dpl_4fcZHzPmSXrSXMwYcbdg2u8cHTDf READY/Preview em inema-512kq7ghn-guariero.vercel.app. Shareable Link específico criado, proteção geral intacta.69verificações externasPASS(46funcionais+23acesso/assets/arquivosprivados), desktop/mobile, contextos sem login/cookies iniciais. Produção inema.acto.com.br permanece dpl_1iRreUxXQ2TQ7Vtj7cPGrbGC13Ne. Sem promoção/commit/push. D01–D10 abertos. Relatório outputs/coine-bess-visual-final/publicacao/RESULTADO_PUBLICACAO.md; usar link compartilhável entregue na conversa, não publicar arquivos .private nem dados de acesso. Autorizações locais históricas abaixo foram superadas somente para este Preview. Não iniciar nova missão.

---

## COINE — BESS LP revisado localmente no Work (28/10/2026)

Escopo exclusivamente BESS LP, cinco etapas existentes. COTIC/Tainá está pausada; Eólica, Solar, Data Center e Turismo/Lazer fora desta execução. NÃO há autorização de deploy/commit/push para BESS. As autorizações históricas abaixo não se aplicam a esta frente.

Correções em src/pages/coine/CoineBessLpPage.tsx e CSS local coine-bess-lp.css: associação label/campo, erros técnicos, wizard sem falsa conclusão, inventário acústico com edição, revisão completa e foco restaurado nos modais. Catálogos sem opções oficiais desabilitados; documentos apenas referências sem vínculo fictício. Enviar FCE indisponível; Concluir demonstração separado, sem envio/protocolo/gravação. Dados conservados apenas durante a navegação da sessão; rascunho informa que não grava. D01–D10 permanecem abertos, inclusive unidade, bacia provisória, documentos, resíduos, acústica e contrato do hospedeiro.

Relatório e evidências: outputs/coine-bess-lp-revisao-work-2026-10-28/RELATORIO_FINAL.md. 92 cenários técnicos PASS (46 navegador +20 domínio +16 teclado/a11y +10 smoke protegidos); TypeScript/build Vite isolado PASS. Não equivale a homologação dos 32 oráculos documentais (14 PASS /18 não verificados integralmente). Matriz60 reconciliada por atributo. Baseline379:378 originais idênticos, um BESS modificado, um CSS adicionado. Sem mudanças de AppShell/DS/rotas/módulos protegidos. Figma lido no cache disponível; sem alegar nova varredura online. ZIP: outputs/INEMA-COINE-BESS-LP-REVISAO-WORK-2026-10-28.zip. Não iniciar outra frente automaticamente.

---

## Fiscalização (RFA + RAE) — Missão 04 refinada e publicada (27/10/2026)

Autorização de publicação cumprida: correções UX/UI aprovadas dos relatórios DOR008 (RFA) e DOR009 (RAE) publicadas no domínio canônico https://inema.acto.com.br. Novo deployment READY/promovido dpl_1iRreUxXQ2TQ7Vtj7cPGrbGC13Ne; predecessor/rollback dpl_65t7v9HAAoHfDPanQqQjG3dMvPLt.

Itens validados:
- Sidebar: nomes abreviados para RFA e RAE, com title acessível completo em tooltip.
- Formulários: substituição da barra horizontal extensa por índice lateral sticky em desktop (>=1024px) com scrollspy ativo e seletor compacto em mobile/tablet (<1024px) com InputWrapper e ChevronDown institucional (altura 36px).
- RAE: correção de truncamento em "Processo originador e processos relacionados", quebrando em 2 linhas completas sem sobreposição.
- Modal Documento A4: controle de zoom encapsulado em InputWrapper com ChevronDown, mantendo select nativo para testes e acessibilidade.
- Tabela de Listagem: TableContainer canônico com heading, description, badges com dot e paginação no rodapé do card.
- Validação online: testes automatizados em produção executados com 100% PASS. Módulos protegidos (Conselho Gestor, Fauna Silvestre, CERH, AIAD, CEUC e Regulação) 100% íntegros e funcionando.
- Patch incremental UTF-8 sem BOM: outputs/fiscalizacao-rfa-rae-missao04/MISSAO04_FECHAMENTO_RFA_RAE.patch (SHA256: 5911fbb778d62f9d180944e417c4a098a0eda5250322fcc81d9d989b18684f6c).
- Pacote incremental: outputs/INEMA-RFA-RAE-MISSAO04-FECHAMENTO-INCREMENTAL.zip (SHA256: 4b71affd4cd4a916930a7352f4f29470ca3ab59543787d19f7cdbd4b04ed4d7f).

Rotas oficiais:
- https://inema.acto.com.br/?rota=fisc-rfa&escopo=fiscalizacao
- https://inema.acto.com.br/?rota=fisc-rae&escopo=fiscalizacao

Rollback documentado: npx vercel rollback dpl_65t7v9HAAoHfDPanQqQjG3dMvPLt --yes --scope guariero.

---

## Conselho Gestor — Painel/Consulta Pública e prévia PDF corrigidos e publicados (27/10/2026)

Autorização da missão curta e mensagens humanas durante a execução: corrigir/publish duas listagens, verificar dúvida de Hérikles sobre PDF bloqueado e publicar antes da reunião. Novo deployment READY/promovido dpl_65t7v9HAAoHfDPanQqQjG3dMvPLt; predecessor/rollback dpl_CoCf2YH7yKG2XFYEhZhazHAhrmGs. Candidato visual C6yP3iX7ysFQJQbEctGvFFvprRjy ficou superado pela exceção CSP e não foi promovido.

Painel com toolbar/ordenação e paginação no card canônico, contagem única, ações fixas visíveis no desktop e scroll local no mobile. Consulta Pública com logo/tokens, largura e toolbar responsiva, links Button asChild e retorno ao Painel. Shared Table recebeu prop opcional pagination usando GlaTableContainer; demais chamadas sem mudança de comportamento.

Dúvida do áudio/imagem: reprodução real no Chrome confirmou frame-src bloqueando blob PDF no AnexoI; download funcionava. Acrescentada somente política CSP para cinco rotas Conselho, igual à existente para PDFs de Fiscalização. Políticas anteriores e demais rotas idênticas. Prévia funciona em produção no Chrome, sem violação e com bytes/sha PDF preservados. Não alterado motorPDF. Usuário deve recarregar aba antiga Ctrl+F5 para nova política.

TypeScript/build PASS.65verificações oficiais PASS:30direcionadas em1440/1920/390;12CGUC→ICG;7CEUC/AIAD/Regulação/menu;6Fauna;9headersporrota;1prévia/download.116assets SHA conferidos;6antes/6depois/6oficiais mais PDF antes/depois revisados.5arquivos intencionais alterados:ConselhoPage.tsx,PortalPages.tsx,ui.tsx,conselho.css,vercel.json.373/378produtos/config/assets idênticos; nenhuma edição paralela detectada ou revertida. Regras/dados/18outras telas/DS/Fauna/módulos anteriores preservados no alcance verificado. Sem commit/push.

Rotas oficiais:
- https://inema.acto.com.br/?rota=uc-conselhos&escopo=conselho-gestor
- https://inema.acto.com.br/?rota=uc-conselho-publico

Relatório outputs/conselho-gestor-correcao-painel-publico/RELATORIO_FINAL.md. Pacote outputs/INEMA-CONSELHO-GESTOR-CORRECAO-PAINEL-PUBLICO.zip, SHA256 4c7091e738faa43e4b1100a5bde0d19a6b9ec9f700f6ac31a4530f8dfd06f798, CRC/manifesto PASS. Não inclui áudio privado ou cookies Vercel. Protótipos demonstrativos, pendências institucionais inalteradas. Não iniciar outra missão automaticamente.

---

## Conselho Gestor — publicação final validada (27/10/2026)

Autorização humana final substituiu o bloqueio histórico apenas para esta publicação consolidada. Novo candidato criado a partir do workspace atual, com Mission03B e ajuste final de abas conferidos; V2 antigo NÃO promovido. Projeto Vercel inema / prj_deyQDHHxlFQg5xFFk8BSh5LcAA0r / guariero. Deployment dpl_CoCf2YH7yKG2XFYEhZhazHAhrmGs READY e promovido ao domínio oficial; predecessor conferido imediatamente antes: dpl_3m9N5mipwb6jCgb8TUvCzDq4ugSo.

Links oficiais validados sem cookie de acesso Vercel:
- https://inema.acto.com.br/?rota=uc-conselhos&escopo=conselho-gestor
- https://inema.acto.com.br/?rota=uc-conselho-implementacao&escopo=conselho-gestor&conselho-id=cg-uc-001

TypeScript/build PASS. Local231, candidato131, oficial231 verificações PASS: no portal são187 funcionais/navegação +44 acesso/renderização, sem alegar reexecução da matriz212/457. CGUC→ICG12etapas PASS; abas30casos em375/390/768/1440/1920 PASS. Regressões de Fauna, CEUC, AIAD, Regulação, Pauta/Validação/Explorador, DOR001, CERH e RFA/RAE aprovadas no alcance ensaiado.116assets públicos SHA-idênticos no candidato e domínio.14screenshots oficiais de viewport revisados; sem redesign ou nova engenhariaPDF.

Baseline378 produtos/config/assets preservados por hash até a validação final, sem edição de fontes de produto nesta publicação. Fauna/CustomSelect posteriores preservados; nenhuma edição concorrente monitorada durante a missão. Única diferença anterior ao preflight, em relação ao checkpoint de abas: .vercelignore com exclusões de outputs/ZIP/TAR mantidas. Nenhum snapshot restaurado, commit, push ouPR.24pendências institucionais e integrações reais continuam abertas.

Rollback documentado: vercel rollback dpl_3m9N5mipwb6jCgb8TUvCzDq4ugSo --yes --scope guariero; confirmar domínio/ID/READY e repetir smoke tests. Não foi necessário executar rollback.

Relatório outputs/conselho-gestor-publicacao-final/RELATORIO_FINAL.md. Pacote outputs/INEMA-CONSELHO-GESTOR-PUBLICACAO-FINAL-EVIDENCIAS.zip:1354668 bytes, 114 entradas, SHA256 7e68115ed688b9a751ae2c0b8e0e871bf3dbae6257a93ea73c5cb26f673aa863, CRC/manifesto PASS. Cookies privados e capturas legadas excluídos. Estado CONSELHO GESTOR — PUBLISHED / ONLINE VALIDATED / UX/UI APPROVED / INSTITUTIONAL HOMOLOGATION PENDING. Não iniciar outra missão automaticamente.

---

## Conselho Gestor — ajuste final de abas da Missão03B (27/10/2026)

Pronto para aprovação visual externa; DEPLOY BLOCKED. Ajuste autorizado somente da navegação principal: posição por limites de abas completas, snap horizontal, controles discretos anterior/próximo, “Mais seções...” apenas quando houver overflow e foco preservado por teclado. FilamentTabs canônico intacto; sem alteração de rotas, conteúdo, regras, formulários, dados ou Fauna. Somente ConselhoPage.tsx e conselho.css modificados. Baseline378:376fontes/config/assets idênticos e2alterados, sem mudanças paralelas durante este ajuste.

TypeScript/build isolado PASS;30testes direcionados PASS em375/390/768/1440/1920, incluindo8abasICG e9CGUC por teclado, Home/End/setas, controles sem troca de rota e redimensionamento.10screenshots antes+10depois e5pranchas visualmente inspecionadas; usar viewport real, não fullPage. Não foi feita nova auditoria extensa nem regressão de outros fluxos.

Pacote incremental: outputs/INEMA-CONSELHO-GESTOR-MISSAO03B-AJUSTE-ABAS.zip; 1884289bytes, 47entradas, SHA-256 3080d4181c264726b4dc36b3d420541c83c3853b7444d3ed340afcb3dcd32b78; CRC/manifesto PASS. Relatório em outputs/conselho-gestor-missao03b-ajuste-abas/RELATORIO.md. Nenhum commit/push/PR/deploy/promoção. Aguardar aprovação visual externa e nova autorização; não promover V2 nem iniciar próxima missão automaticamente.

---

Recibo final Missão03B: 104932502 bytes, 707 entradas, SHA-256 da53301e8793eca914423eae96995b4078f963af08532e2f7287190fd6b22181; CRC e manifesto verificados. Pacote final emitido para auditoria externa; versões PRELIMINAR-NAO-EMITIDO são históricas e não devem ser usadas.

## Conselho Gestor — Missão 03B concluída localmente (27/10/2026)

CONSELHO GESTOR — DESIGN SYSTEM REFINED / VISUAL AUDIT PENDING / DEPLOY BLOCKED.

Oito fontes de interface em src/pages/uc/conselho refinados. Select Filament canônico em todos os tamanhos de lista; contexto/perfil/relógio agrupados; abas 40/44 px com alinhamento após fonte; hierarquia de ações, campos e registros mobile. Domínio, dados, persistência, permissões, documentos, rotas e matriz457 preservados. SHA matriz127729522a23bfb4f359f1cfd2e8bd17785c4265683174e9294b1c0f9edc5afd confirmado. 24 pendências institucionais intactas.

90 verificações funcionais/UX reexecutadas; mais77 casos de interação em7configurações e4comparações canônicas PASS. Mais7regressões funcionais protegidas PASS;22comparações renderizadas idênticas.180capturas principais de viewport,40anteriores e180fullPage suplementares. fullPage altera scrollLeft das abas no Chromium: NÃO usar essas imagens para aprovar navegação. Captura viewport preserva o estado;77casos e180vistas reexecutados após último ajuste visual. Não equivalem a457testes ou212novas sessões. TypeScript/build isolado PASS no checkpoint, sem scripts que sobrescrevam HTML/public/dist.

Baseline378:361idênticos,8alterações desta missão e9alterações paralelas observadas emFauna/CustomSelect preservadas e excluídas do incremental. Trabalho paralelo continua; não restaurar snapshot nem presumir congelamento. Componentes canônicos Filament/AppShell não editados. Capturas brutas legadas permanecem privadas. Falhas de harness e zoom documentadas; emulação de viewport equivalente200% e WebKit não certificam aparelho físico/WCAG universal. Sem nova engenharia PDF.

Relatório: outputs/conselho-gestor-missao03b/RELATORIO_FINAL.md. Pacote: outputs/INEMA-CONSELHO-GESTOR-MISSAO03B-DESIGN-SYSTEM-REFINEMENT.zip, com recibo externo SHA/CRC. Nenhum deploy, promoção V2, commit, push ou PR. V2 é somente baseline histórico e a aprovação visual anterior foi revogada. Aguardar auditoria externa e nova autorização; não iniciar missão seguinte nem promoção automaticamente.

---

## Conselho Gestor — Missão 03B: refinamento local autorizado

Autorização humana atual: auditar e corrigir UX/UI das 20 telas conforme DS real. A aprovação visual anterior foi revogada. Escopo somente src/pages/uc/conselho e artefatos de auditoria. Sem alterar domínio, regras, dados, contratos, persistência, PDFs, rotas, Fauna ou demais módulos. Build/testes locais autorizados, com saída isolada para não sobrescrever artefatos paralelos. NÃO publicar/promover V2, commit, push ou PR. V2 é baseline histórico. Evidências em outputs/conselho-gestor-missao03b. Preservar o trabalho de Fauna; alterações paralelas devem ser discriminadas por hashes, nunca revertidas.

---

## Conselho Gestor — Missão 03: promoção adiada por orientação humana

Pacote de pré-publicação concluído: outputs/INEMA-CONSELHO-GESTOR-MISSAO03-PUBLICACAO-EVIDENCIAS.zip, 65.620.718 bytes, 435 entradas, SHA-256 e371f9f3593df9dc4caa915bf8375547b0113ade3442eeb16df0617c4ceb2ec6. CRC e manifesto verificados. Candidato V2 READY preservado; 90 verificações Conselho PASS, 122 verificações funcionais protegidas PASS, 180 capturas em nove perfis e 11 pranchas revisadas. Quatro falhas de harness legado do Explorador permanecem pré-existentes e discriminadas; não declarar essas suítes inteiramente aprovadas. Nenhuma promoção, commit, push ou PR. Relatório em outputs/conselho-gestor-missao03/RELATORIO_EXECUTIVO.md. Gate humano de congelamento de Fauna continua pendente; não promover automaticamente.

O usuário confirmou que Gestão de Fauna DR008/R2 ainda está em finalização e revisão técnica, com AnimaisPage.tsx e faunaMock.ts em adaptação à integração DR001/R1 → DR008/R2. NÃO reverter, sobrescrever ou descartar essas alterações. Preservar o candidato validado V2 dpl_6zPsC4XNoeeeVmvuQHcg7Gnd4Xtm sem promovê-lo. Continuar somente evidências e atividades sem conflito com Fauna; NÃO reconstruir o workspace em edição. Após congelamento humano, reconciliar as alterações e repetir a regressão antes de retomar a promoção. A autorização original de publicação permanece condicionada a esse novo gate; não promover automaticamente apenas por observar hashes temporariamente estáveis.

Candidato: https://inema-dvwjp8ca1-guariero.vercel.app, READY, protegido pelo acesso Vercel. Produção anterior registrada: dpl_3m9N5mipwb6jCgb8TUvCzDq4ugSo. Nenhuma promoção desta missão. Evidências em outputs/conselho-gestor-missao03.

---

## Conselho Gestor — Missão 03: publicação controlada autorizada

Autorização humana atual: publicar CGUC/ICG aprovados 02+02B no projeto Vercel existente, validar candidato e domínio oficial, proteger alterações posteriores/Fauna, registrar rollback e ZIP de evidências. Sem redesign, reconstrução, commit/push/PR ou nova missão. Gate: não promover se houver conflito, falha crítica ou mudança paralela não reconciliada. Evidências: outputs/conselho-gestor-missao03. A proibição de deploy das missões antigas abaixo foi substituída somente para esta publicação autorizada.

---

## Conselho Gestor — Missão 02B concluída localmente (26/10/2026)

CONSELHO GESTOR — UX/UI REFINED / EXTERNAL AUDIT PENDING / DEPLOY NOT AUTHORIZED

UX01–UX05 corrigidos: alertas em cartões no mobile, wizard completo/compacto legível com seis etapas, retornos redundantes removidos, ações documentais visíveis e indicadores sem reticências. Equivalentes comprovados nas listas públicas e foco/rolagem de teclado tratados localmente. Exatamente cinco fontes de interface em src/pages/uc/conselho alterados; domínio, contratos, permissões, dados, documentos, CEUC, DS e AppShell intactos.

Baseline real: 376 arquivos; 370 idênticos, cinco alterações desta missão e uma mudança posterior independente em src/pages/fauna/admissao/AdmissaoPainelPage.tsx preservada e excluída do incremental. FaunaMock, AnimaisPage, App e navigationConfig posteriores já existentes no início também preservados. Não restaurar o snapshot antigo sobre o workspace atual.

TypeScript/build PASS. Reexecução rastreável dos 212 cenários no alcance dos harnesses existentes (55 RN, 98 grupos, 25 MSG com seis referências UI, 14 LEG conjuntas e 20 TL); não equivalem a 212 sessões independentes. Mais 30 verificações UX PASS em Chromium desktop/mobile e WebKit mobile. 180 capturas finais em nove configurações, 40 anteriores e comparativos; pranchas e estados revisados. CSS zoom200 é aproximação, não aparelho físico nem certificação WCAG.

Regressão: 22 comparações protegidas idênticas, incluindo Fauna; suítes dos módulos anteriores registradas. W1 da toolbar antiga continua FAIL no baseline e corrente por rejeitar scroll vertical mobile; suíte específica mobile/A4 PASS. Não declarar essa suíte inteira aprovada. Matriz457 e L01–L24 byte-idênticas; nenhum fechamento institucional novo.

Pacote: outputs/INEMA-CONSELHO-GESTOR-MISSAO02B-REFINO-UXUI.zip. SHA-256: 6af5d3d8bced027914cbb07c24024531138504338287400a0bb0f658cb046bee. 471 entradas; CRC e todos os hashes do manifesto PASS. Relatório em outputs/conselho-gestor-missao02b/RELATORIO_EXECUTIVO.md. Preview local 4402: ?rota=uc-conselhos&escopo=conselho-gestor; ICG ?rota=uc-conselho-implementacao&conselho-id=cg-uc-001.

Nenhum deploy, commit, push, PR ou publicação. Aguardar auditoria externa e autorização específica. Não iniciar nova missão.

---

## Conselho Gestor — Missão 02B autorizada: refinamento local

Autorização atual: corrigir UX01–UX05, auditar as20telas, testes e pacote incremental. Sem alterar domínio, contratos, permissões, persistência, PDFs ou outros módulos; preservar alterações posteriores, especialmente Fauna. Não reexecutar F00–F09. Nenhum deploy, commit, push, PR ou publicação. Instruções humanas em C:/Users/lguar/.codex/attachments/d87af5f9-3bf2-4541-82aa-1adbe0084ccf/Texto colado.txt. Evidências em outputs/conselho-gestor-missao02b.

---

## Conselho Gestor — checkpoint isolado; Fauna posterior preservada

Duas edições posteriores em src/data/faunaMock.ts e src/pages/fauna/AnimaisPage.tsx foram preservadas no workspace e excluídas do snapshot desta missão. A cópia de auditoria usa os originais verificados do baseline para esses arquivos. Não restaurar o workspace nem incorporar Fauna a esta entrega. Contagens de integridade referem-se ao checkpoint testado; relatório e hashes discriminam o estado atual.

---

## Conselho Gestor — Missão 02 concluída localmente (26/10/2026)

CONSELHO GESTOR — IMPLEMENTATION COMPLETE / EXTERNAL AUDIT PENDING / DEPLOY NOT AUTHORIZED

F00–F09 executadas localmente. As 20 telas (11 CGUC e 9 ICG) compartilham dados de UC, conselho, composição, nomeação, posse, mandato e histórico. Adaptador CEUC opcional por ID; não mudar o contrato legado por conveniência. Código em src/pages/uc/conselho: 16 fontes novos. Seis pontes localizadas; 16 HTMLs gerados apenas para sincronização do menu. Baseline de 351 arquivos: 329 idênticos.

Persistência IndexedDB inema-conselho-gestor-demo-v1, com revisão concorrente, Blob, SHA-256 e proteção de armazenamento incompatível. Dados temporais guardados em UTC e apresentados no fuso Bahia. Perfis e relógio na interface são controles fictícios da demonstração, sem autenticação institucional.

457 registros reconciliados: 212 implementados/testados, 198 demonstrativos sem ensaio individual por linha, 14 integrações pendentes, 15 modelos integrais ausentes e 18 contextuais não aplicáveis. Não chamar isso de 457 testes. Os 212 cenários demonstrativos têm referências a evidências reais: 55 regras/197 asserções, 98 grupos de campos, 25 mensagens (19 gatilhos e 6 referências UI), 14 legendas e 20 telas. Mais 25 verificações de fundação, 19 invariantes, 64 verificações de navegador e 160 capturas responsivas. TypeScript, build e snapshot aprovados.

Oito pranchas responsivas e cinco de estados/modal revisadas. Desktop 1440/1920, mobile 375/390/393, tablet 768, modo escuro e CSS zoom 200%. WebKit e Android emulados, sem aparelho físico ou certificação WCAG. Dezoito páginas PDF entre documentos, impressão e downloads renderizadas e revisadas. O DS local é a referência visual; os DORs não fornecem Figma.

Vinte comparações protegidas idênticas. Regressões de Fiscalização, CERH, DOR001, Pauta, CEUC, AIAD e Regulação registradas. Suíte mobile/A4 do Explorador passou antes/depois. A suíte antiga da toolbar mantém W1 falha nos dois builds porque rejeita scroll vertical mobile; não alterar nem declarar esse teste aprovado. Demais módulos preservados no escopo auditado.

L01–L24 tratadas individualmente em 06-pendencias, sem homologação. Ausentes Excalidraw, 22 modelos integrais, planilha de 46 UCs e regimento auxiliar. Não usar o PNG residual DOR0021. A demonstração tem quatro UCs do CEUC, sem inventar 46 registros. Manter as hipóteses explícitas sobre status, datas, quórum, procurador/FJ, feriados, recondução, privacidade e IAM.

Criação mantém Não criado conforme RN006 na demonstração. Reserva do Poder Público conta uma instituição; cronograma tem 11 etapas e janela exata de 48 horas. Parâmetros são específicos de cada conselho, sem norma global REVISSMA. Requerimentos instruídos/aprovados são protegidos contra reescrita e as aprovações guardam histórico. Política demonstrativa impede que nova nomeação sobrescreva ICG anterior ainda aberto. Portais filtram por instituição e projeção pública por allowlist.

Snapshot exportado sanitiza somente fixtures legadas da cópia, preservando os novos fontes byte a byte. Capturas privadas de módulos antigos ficam fora do ZIP; métricas e hashes são exportados. A reprodução da comparação histórica exige o baseline privado. Ver manifesto e recibo externo.

Pacote: outputs/INEMA-CONSELHO-GESTOR-DOR0031-DOR0032-MISSAO02-IMPLEMENTACAO-AUDITORIA.zip. Relatório: outputs/conselho-gestor-missao02/RELATORIO_EXECUTIVO.md. Demonstração local: http://127.0.0.1:4391/?rota=uc-conselhos&escopo=conselho-gestor e rota uc-conselho-implementacao com conselho-id=cg-uc-001.

Nenhum deploy, preview público, commit, push, PR, envio ou serviço institucional real. Aguardar auditoria externa e autorização específica para publicação. Não iniciar outra missão automaticamente.


---

## Conselho Gestor — Missão 02 local autorizada (26/10/2026)

Autorização humana atual: implementar integralmente DOR0031/DOR0032, F00–F09, testes/revisão/regressão e ZIP de auditoria local. DEPLOY/PUSH/PUBLICAÇÃO NÃO AUTORIZADOS. Plano canônico imutável em outputs/conselho-gestor-missao01; execução e progresso em outputs/conselho-gestor-missao02. Seguir os 457 registros e 212 cenários sem alegar equivalência entre contagens. Tratar L01–L24 individualmente, com simulação segura e explícita. Sem integrações reais, e-mail, assinatura/protocolo institucional, preview público, commit ou PR. Preservar legado; CEUC pode receber somente projeção demonstrativa aditiva contratada. Avançar entre fases sem novos prompts operacionais. Não marcar complete antes de testes, revisão e ZIP. Histórico abaixo preservado; gates antigos de planning-only substituídos somente para esta missão.

---

## Conselho Gestor — Release4 — Missão01 concluída (26/10/2026)

CONSELHO GESTOR — PLANNING COMPLETE / IMPLEMENTATION NOT AUTHORIZED. Autorização atual SOMENTE leitura/auditoria/documentação/memória/ZIP; sem implementar, editar produto, build, deploy, commit/push/PR. Não reutilizar autorizações históricas. Handoff canônico: outputs/conselho-gestor-missao01/LEIA_PRIMEIRO.md, DOCUMENTO_MESTRE.md e MEMORIA_EXECUCAO.md.

DOR0031/DOR0032 v1.0 de21/10/2026 lidos integralmente;27+23 páginas renderizadas,54tabelas.20telas(11+9),457registros,55RN,25MSG,14LEG,20linhasaçõessemBOToficial,98gruposcampos/254entradasauxiliares;212cenários PLANNED/NOT RUN. Excalidraw CGUC/ICG não encontrado. Residual PNG de DOR0021 não usado. DS React/AppShell vigentes preservados; inventário13reuso/8adaptação/12composiçõesnovas. CEUC possui3status e abaConselhoplaceholder, não8estados nem integração pronta.24lacunas registradas; hipóteses não homologadas. Plano futuroF00–F09 sequencial, publicação gate separado. Produto byte-idêntico ao baseline desta missão. ZIP: outputs/INEMA-CONSELHO-GESTOR-DOR0031-DOR0032-MISSAO01-PLANEJAMENTO-AUDITORIA.zip, com manifesto e recibo externo. Parar após handoff; aguardar autorização expressa de desenvolvimento. Histórico abaixo preservado integralmente.

---

## Fiscalização — Missão 03 encerrada: publicada e validada online

DOR008 + DOR009 — PUBLISHED / ONLINE VALIDATED / TECHNICALLY AUDITED / INSTITUTIONAL HOMOLOGATION PENDING.

Deployment ativo e alias verificado: dpl_3m9N5mipwb6jCgb8TUvCzDq4ugSo, guariero/inema, inema.acto.com.br. RFA: /?rota=fisc-rfa&escopo=fiscalizacao; RAE: /?rota=fisc-rae&escopo=fiscalizacao. Rollback anterior READY: dpl_6QKfa5S9ZEX1akumC1KmnikioQTx; procedimento em outputs/fiscalizacao-dor008-dor009-missao03/ROLLBACK.md. Autorização M03 cumprida, substituindo exclusivamente os gates históricos desta entrega.

208 verificações online PASS, 107 registros de campos separados; 277 cenários demonstrativos agrupados PASS, 54 institucionais pendentes. TypeScript/build PASS. Quatro PDFs/16 páginas A4 e 217 capturas oficiais revisados. Dezoito comparações protegidas do conteúdo principal idênticas. Duas suítes legadas do Explorador mantêm cinco asserções falhas preexistentes; nenhuma regressão crítica nova identificada. Única alteração M03 de produto: duas políticas CSP de vercel.json restritas às rotas RFA/RAE; 388/389 arquivos monitorados idênticos. Nenhum commit/push, integração institucional real ou mudança no Explorador.

Entrega: outputs/INEMA-DOR008-DOR009-MISSAO03-PUBLICACAO-EVIDENCIAS.zip; SHA-256 0444e68cf45fada9862f495cc583b9443276b4ae2014188cf9c196f40119f24d. Recibo externo .receipt.json; 871 entradas, CRC e hashes verificados. Relatório em outputs/fiscalizacao-dor008-dor009-missao03/RELATORIO_EXECUTIVO.md. Não iniciar refinamentos/nova missão sem pedido humano. Histórico abaixo preservado; a seção antiga 'em validação' descreve etapa anterior, não o estado atual.

---

## Fiscalização — Missão03 autorizada e em validação

Autorização humana expressa para publicar DOR008/RFA e DOR009/RAE no projeto existente guariero/inema, domínio inema.acto.com.br. Pedido integral: outputs/fiscalizacao-dor008-dor009-missao03/AUTORIZACAO_ORIGINAL.md. Esta autorização substitui os gates históricos de DEPLOY NOT AUTHORIZED somente para essa composição02+02B+02C. Não refazer telas, não alterar módulos protegidos, não fazer commit/push ou serviço institucional real. Baseline389 coincide com02C. Produção anterior confirmada dpl_6QKfa5S9ZEX1akumC1KmnikioQTx; candidatoV1 nunca promovido, CSP bloqueou PDF anexado. Única correção autorizada comprovada: duas exceçõesCSP por query rota fisc-rfa/fisc-rae em vercel.json; demais políticas preservadas. V2 dpl_3m9N5mipwb6jCgb8TUvCzDq4ugSo em validação; ainda NÃO declarar publicação concluída. Guardar promoção até gate, reler domínio para evitar publicação concorrente, testar domínio oficial e gerar ZIP. Histórico abaixo preservado.

---

## Fiscalização — Missão 02C encerrada localmente

PDF EDITORIAL CORRECTION COMPLETE / EXTERNAL AUDIT PENDING / DEPLOY NOT AUTHORIZED.

Entrega: outputs/INEMA-DOR008-DOR009-MISSAO02C-ACABAMENTO-PDF.zip. Relatório: outputs/fiscalizacao-dor008-dor009-missao02c/01-relatorio/RELATORIO_FINAL.md. Somente ReportDocument.tsx alterado no produto; 388/389 arquivos monitorados preservados. Datas pt-BR e instantes em America/Bahia; histórico civil sem deslocamento; estados técnicos da consulta traduzidos; fuso no rodapé. Quatro PDFs finais/16 páginas A4 e quatro anteriores/16 páginas revisados. Zero ISO ou estados técnicos em inglês nos quatro finais. UTC/auditoria/contratos/anexos preservados. TypeScript/build e suites105/278/28/19, datas68 e navegadorPDF13 PASS; 18 comparações protegidas idênticas.

Formulários não alterados: usam fuso do navegador. Correspondência literal comprovada em America/Bahia; fora dela, documento fica Bahia e formulário mantém representação local do mesmo instante. Diferença registrada em timezone-matrix.json, sem alegar igualdade literal em todos os fusos. Sem deploy, commit ou push. Preview local4385, rotasfisc-rfa/fisc-rae. Encerrar; aguardar auditoria externa/nova autorização. Histórico abaixo preservado integralmente.

---

## Fiscalização — Missão 02B encerrada localmente

**APROVADO NO ESCOPO DEMONSTRATIVO LOCAL / EXTERNAL AUDIT PENDING / DEPLOY NOT AUTHORIZED.** Parecer e limites em outputs/fiscalizacao-dor008-dor009-missao02b/01-auditoria/RELATORIO_AUDITORIA.md. 277 cenários PASS, 54 INSTITUTIONAL PENDING preservados, zero NOT TESTED na lista de 331; 107 campos derivados verificados individualmente; 438 registros reconciliados. Oito fontes alterados somente nos relatórios, 381 arquivos monitorados idênticos. TypeScript/build PASS; 496 asserções canônicas e 239 transcrições separadas; 18 comparações protegidas pixel-idênticas. 279 PNGs revisados em 35 pranchas e 6 PDFs/25 páginas A4. Falhas legadas do Explorador e limites de emulação/PDF headless explicitados no parecer, sem alterar esse módulo.

ZIP incremental: outputs/INEMA-DOR008-DOR009-MISSAO02B-FECHAMENTO-10-10.zip; recibo externo com SHA/CRC. O nome não atribui nota. Missão02 e pacotes anteriores permanecem congelados. Demonstração em http://127.0.0.1:4375/?rota=fisc-rfa e ?rota=fisc-rae enquanto preview local ativo. Sem deploy, commit, push ou serviço real. PARAR após entrega, aguardar auditoria externa/nova autorização humana. Histórico abaixo preservado integralmente.

---

## Fiscalização — Missão02B autorizada (24/10/2026)

AUDITORIA RIGOROSA + CORREÇÕES PONTUAIS COMPROVADAS / DEPLOY NOT AUTHORIZED. Pedido integral em outputs/fiscalizacao-dor008-dor009-missao02b/AUTORIZACAO_ORIGINAL.md. Fechar48legendas/mensagens com gatilho real, auditar107campos, revisarDS/regras e regressão sem reconstrução/novo masterplan. Preservar o ZIPMissão02 congelado e seus outputs; testes isolados emMissão02B. Somente alterações comprovadas emRFA/RAE, sem tocarExplorador/outros módulos. Não fabricar277PASS nem homologação; parecer finalAPROVADO ouAJUSTES AINDA NECESSÁRIOS. Nenhum deploy/commit/push/serviço real. Histórico abaixo preservado.

---

## Fiscalização DOR008 + DOR009 — Missão02 encerrada localmente (24/10/2026)

DOR008 + DOR009 — IMPLEMENTATION COMPLETE / EXTERNAL AUDIT PENDING / DEPLOY NOT AUTHORIZED.

F00–F10 executadas no escopo demonstrativo. Documentação canônica: outputs/fiscalizacao-dor008-dor009-missao02/LEIA_PRIMEIRO.md e01-resumo/RELATORIO_EXECUTIVO.md. RFA/RAE navegáveis em127.0.0.1:4372, rotas fisc-rfa/fisc-rae.496asserções funcionais/domínio/navegador/layout PASS+239transcrições documentais separadas; TypeScript/build PASS.438registros reconciliados;331cenários229PASS,54INSTITUTIONAL PENDING,48NOT TESTED. Não alegar438testes nem331PASS.6PDF/23A4,90capturas canônicas+28complementares e18comparações protegidas sem diferença na área comparada. Falha legada Android393doExplorador reproduzida nobaseline; módulo não alterado.

370arquivosbaseline:350idênticos,4pontes e16menus gerados;19novos fontes isolados em src/pages/fiscalizacao/relatorios. RFAdevolvido restrito provisórioP01; RAEintegral somente autor.15pendências institucionais abertas. Storage local/numeração/GeoServer/IAM/assinatura/encaminhamento são demonstrativos, sem serviço real. Histórico Git prévio preservado.

Pacote final: outputs/INEMA-FISCALIZACAO-DOR008-DOR009-MISSAO02-IMPLEMENTACAO-AUDITORIA.zip, com recibo externoSHA/CRC. Snapshot exportado sanitiza fixtures legadas somente na cópia, novos fontes byte-idênticos; não sobrescrever dados do workspace com a exportação. Baseline privado e capturas legadas com dados pessoais não distribuídos. Nenhum deploy/preview público/commit/push/PR/email/assinatura real nesta missão.

PARAR após entrega: aguardar auditoria externa ou nova autorização humana; não publicar, não iniciar outra missão. O histórico abaixo foi preservado integralmente.

---

## DOR008 + DOR009 — Missão02 local autorizada

Autorização humana atual: executar implementação local integral F00–F10 dos dois relatórios, testes/revisão/regressão e pacote auditável. DEPLOY NÃO AUTORIZADO. Fontes e plano imutáveis em outputs/fiscalizacao-dor008-dor009-missao01. Registro vigente em outputs/fiscalizacao-dor008-dor009-missao02/AUTORIZACAO.md. Autorizações antigas de outros módulos não se aplicam. Regras/IDs por DOR; RFA devolvido restrito e RAE devolvido integral somente ao autor. Nenhum envio/serviço/assinatura/numeração real; hipóteses documentadas permanecem demonstrativas. Preservar demais módulos e pacotes. Executar sem novos prompts operacionais, parar antes de publicar. Histórico abaixo preservado.

---

## Fiscalização DOR008 + DOR009 — Missão01 encerrada (23/10/2026)

DOR008 + DOR009 — PLANNING COMPLETE / IMPLEMENTATION NOT AUTHORIZED / DEPLOY NOT AUTHORIZED

Documentação canônica: outputs/fiscalizacao-dor008-dor009-missao01/LEIA_PRIMEIRO.md e CONTEXTO_PERSISTENTE.md. RFA v1.5/RAE v1.2, ambos22/10/2026; leitura integral e39páginas renderizadas (RFA17versus18informadas, RAE22).438registros de rastreabilidade,331cenários agrupados PLANNED/NOT RUN;35grupos de dependências,24instâncias propostas de composição,11fases F00–F10,15pendências. Zero alteração em370arquivos monitorados de produto. Sem build/testes de produto/implementação/commit/push/deploy. Prazo26/10condicionado,estimativa30–46h semgarantia. Não herdar regras AIAD; RFA/RAE distintos e IDs compostos. Próxima execução só com autorização expressa. Histórico abaixo intacto.

---

## Fiscalização — DOR008 + DOR009 — Missão01 vigente (23/10/2026)

PLANNING ONLY / IMPLEMENTATION NOT AUTHORIZED / DEPLOY NOT AUTHORIZED. Ler outputs/fiscalizacao-dor008-dor009-missao01/CONTEXTO_PERSISTENTE.md e PEDIDO_ORIGINAL.md antes de qualquer trabalho. Somente memória/documentação/auditoria de leitura; sem código, dados, testes modificadores, build, instalação, commit, push ou deploy. Prazo solicitado26/10/2026 sujeito a viabilidade. RFA e RAE distintos, IDs sempre compostos; não usar DOR013 como norma. Preservar todas as missões e módulos anteriores. Histórico abaixo intacto. Ao finalizar planejamento,parar e aguardar autorização expressa.

---

## CERH Missão 03 — publicação encerrada (23/10/2026)

INEMA CERH — PUBLISHED / ONLINE VALIDATED / INSTITUTIONAL HOMOLOGATION PENDING

Portal https://inema.acto.com.br/?rota=cerh; deployment dpl_6QKfa5S9ZEX1akumC1KmnikioQTx READY/promovido.230 verificações de navegador oficiais PASS;16 capturas protegidas pixel-idênticas;7 PDFs/13 páginas A4 com aviso. Rollback anterior dpl_2ZqRokyaFJweuMxcekB7oTKLDKga READY. Única correção de preparação: duas variáveis translate no @media print de src/pages/seia-v2/cerh/cerh.css. Demais fontes/configuração preservadas;M01/M02 congeladas. Relatório e evidências em outputs/cerh-missao03 e ZIP INEMA-CERH-MISSAO03-PUBLICACAO-EVIDENCIAS.zip. Sem novas integrações reais. Nenhum refinamento adicional autorizado; aguardar homologação institucional/nova solicitação. Histórico abaixo preservado integralmente.

---

## CERH Missão 03 — publicação controlada autorizada (23/10/2026)

AUTORIZAÇÃO EXPRESSA atual: publicar integralmente o CERH auditado no projeto existente guariero/inema, validar candidato antes de promover e confirmar produção/rollback. Pedido integral em outputs/cerh-missao03/AUTORIZACAO_ORIGINAL.md. Esta autorização substitui somente o gate histórico DEPLOY NOT AUTHORIZED desta entrega. Não iniciar refinamentos ou novos módulos. Preservar ZIP Missão02 congelado e todas as fontes/limites institucionais. Registrar preflight, versão ativa imediatamente antes da promoção, testes locais/candidato/oficial e ZIP Missão03. Interromper promoção se houver risco de sobrescrever versão posterior. Nenhum commit/push ou integração real autorizado.

---

## CERH Missão 02 — entrega local encerrada (23/10/2026)

INEMA CERH — IMPLEMENTATION COMPLETE / EXTERNAL AUDIT PENDING / DEPLOY NOT AUTHORIZED

F00–F10 concluídas no escopo demonstrativo local. Leia outputs/cerh-missao02/LEIA_PRIMEIRO.md, RELATORIO_EXECUTIVO e FINISH_VERDICT. Pacote congelado: outputs/INEMA-CERH-MISSAO02-IMPLEMENTACAO-AUDITORIA.zip; SHA-256 41ee92940ff45f63ecc24d744a4a2364e3a41d3a0096c5c36657234cdfed9102. CRC e759 hashes conferidos. 32 superfícies (20 adaptadas/12 novas composições), 37 fontes modificadas/17 novas/1 removida. 76 cenários com verificações PASS;69 testes de domínio;TypeScript/build e snapshot PASS;199 imagens/43 pranchas/11 páginas documentais renderizadas. Matriz2191 reconciliada distingue testes agrupados de RN individual NOT TESTED. Regressões finais Pauta/DOR e smoke local documentados;266 arquivos fora do CERH/pontes preservados por hashes.

Nenhum deploy, preview público, commit, push, PR, backend ou integração real. Q002 somente contrato/adaptador DP01–37; demais pendências institucionais em06-pendencias. AppShell/DS preservados; foco de drawers opt-in com padrão antigo para outros módulos. Certificados/relatórios de demonstração sem validade legal. Imutabilidade da Missão01 conferida.

PARAR: aguardar auditoria externa ou nova autorização. Não alterar o pacote congelado, iniciar outra missão ou reutilizar autorizações históricas de deploy. O conteúdo abaixo é histórico e foi preservado integralmente.

---

## CERH Missão 02 — implementação local autorizada (23/10/2026)

Autorização expressa atual substitui gates históricos de planning-only SOMENTE no CERH. Executar F00–F10, testar/corrigir/auditar e gerar ZIP integral local. Sem deploy, preview público, commit, push, PR, integrações reais ou alterações em módulos alheios. Fonte: outputs/cerh-missao02/AUTORIZACAO_ORIGINAL.md; plano imutável em outputs/cerh-missao01. Decisões demonstrativas reversíveis podem ser tomadas sem novas aprovações. Q002: contratos/adaptação mínima, sem reconstrução integral. Certificado deve ser demonstrativo sem aparência de autenticação institucional. Baseline renovado antes de fontes em outputs/cerh-missao02/07-integridade.

## CERH Missão 01 — planejamento concluído (23/10/2026)

INEMA CERH — PLANNING COMPLETE / IMPLEMENTATION NOT AUTHORIZED / DEPLOY NOT AUTHORIZED

Índice: C:/Users/lguar/projetos/Inema/outputs/cerh-missao01/LEIA_PRIMEIRO.md.
Próxima execução somente após autorização expressa; seguir matriz, masterplan e gates. Q002 UI depende de confirmação de escopo. Produto preservado em 455 arquivos monitorados; nenhuma publicação realizada nesta missão.

# CERH — Missão 01 atual: somente planejamento (23/10/2026)

**CERH — PLANNING ONLY / IMPLEMENTATION NOT AUTHORIZED / DEPLOY NOT AUTHORIZED**

Antes de qualquer trabalho CERH, ler integralmente [cerh-missao01/CERH_PERSISTENT_INSTRUCTIONS.md](outputs/cerh-missao01/CERH_PERSISTENT_INSTRUCTIONS.md) e [pedido integral](outputs/cerh-missao01/CERH_MISSION_ORIGINAL.md). Documentação canônica: `C:/Users/lguar/projetos/Inema/outputs/cerh-missao01`. Cinco DR/DC, Guia de 27 seções, referências DR/DC001; matriz futura em `outputs/cerh-missao01/CERH_REQUIREMENTS_MATRIX.json`. Originais: `C:/Users/lguar/Downloads/reprottipocadastroestadualderecursoshdricoscerh.zip`. Esta missão permite apenas documentação e auditoria somente leitura; não permite implementar, alterar fontes/dados/rotas/componentes, instalar, executar build/testes de produto, commit/push/deploy ou enviar dados externamente. Preservar histórico e todos os módulos. Ao concluir, parar e aguardar autorização expressa. Regras completas e prioridades no briefing, sem substituir fontes por este resumo.

---

# DOR013 v1.1 — Refinamento Final UX/UI, Fidelidade Documental e Publicação Oficial em 21/10/2026

**ENTREGA CONCLUÍDA E PUBLICADA NO ENDEREÇO OFICIAL — `https://inema.acto.com.br/?rota=fisc-aiad&escopo=fiscalizacao`, suítes de teste de domínio (42/42 PASS), suítes de navegador (14/14 PASS), verificação ao vivo em produção (6/6 PASS), TypeScript e bundle Vite aprovados. Sem commit ou push de git.**

Refinamento pontual e autorização de publicação no endereço corporativo executados com total fidelidade:
- **Dropdowns Flutuantes**: remoção de `inlinePopup`, popovers posicionados com `position: absolute !important; z-index: 50 !important;`, mantendo pesquisa e rolagem interna sem alterar a altura dos cards (variação de 0 px comprovada via Playwright).
- **Densidade Visual Administrativa**: padrão Dense UI com espaçamento de 16px entre seções, formulário e simulador compactados.
- **Identidade Documental Neutra e Segura**: remoção de brasão/logotipo redesenhado sem fonte oficial; adoção de cabeçalho tipográfico formal SEMA/INEMA com faixa destacada *"MODELO DEMONSTRATIVO — SEM VALIDADE LEGAL"*; formatação amigável de números e processos na visualização (`formatAiadDisplayNumber` e `formatAiadDisplayProcess`); ação renomeada para *"Baixar PDF Demonstrativo"*; marca d'água de rascunho centralizada.
- **Publicação Oficial**: publicado no projeto mestre `inema` com aliasing automático em `https://inema.acto.com.br/?rota=fisc-aiad&escopo=fiscalizacao`, preservando integralmente os demais módulos institucionais (CERH, CEUC, DTRP, Regulação, Relatórios).
- **Pacote e Integridade**: pacote gerado em `output/PACOTE-AUDITORIA-DOR013-AIAD-v1.1.zip` (SHA-256 externo em `output/PACOTE-AUDITORIA-DOR013-AIAD-v1.1.zip.sha256`, sem autorreferência circular interna).

Resultados finais consolidados:
- 42/42 testes de domínio aprovados (32 de G1 + 10 de G2/G3/G4).
- 14/14 testes de navegador aprovados sobre o bundle real (8 de G1 + 6 de G2/G3/G4).
- 6/6 verificações ao vivo no link de produção aprovadas.
- TypeScript (`npx tsc --noEmit`): exit 0, zero erros.
- Bundle Vite (`npm run build`): exit 0.


O registro original abaixo permanece histórico. As fontes integrais DOR013 v1.1, LEIA-ME e REGISTRO-DIRETRIZES continuam sendo referências, sem reescrita da especificação. Preservar shell legado GLA e componentes aprovados.

---

# DOR013 v1.1 — memória registrada em 21/10/2026; escopo atual somente documentação

**PLANNING ONLY — aguardando autorização explícita para implementação.** Este estado é específico da retomada DOR013 e prevalece sobre comandos históricos/genéricos de execução automática até novo pedido explícito do usuário. A interação de registro não autoriza código, testes/build, protótipos, auditoria da aplicação, commit/push ou publicação.

Memória recuperável: `C:/Users/lguar/Documents/Codex/2026-10-21/seia-v2-inema-registro-de-diretrizes-3/outputs/dor013-v1.1/LEIA-ME.md` e `C:/Users/lguar/Documents/Codex/2026-10-21/seia-v2-inema-registro-de-diretrizes-3/outputs/dor013-v1.1/REGISTRO-DIRETRIZES.md`. Fonte oficial integral: `C:/Users/lguar/Documents/Codex/2026-10-21/seia-v2-inema-registro-de-diretrizes-3/outputs/dor013-v1.1/fontes/DOR013-v1.1-oficial.pdf` (v1.1 de 20/10/2026, 32 páginas; cópia idêntica ao anexo). Manifesto e extração auxiliar na mesma pasta. Catálogo individual de RN001–RN071, MSG001–MSG031, LEG001–LEG016, BOT001–BOT024 e AT001–AT008; resumos não substituem a fonte integral.

Preservar AppShell legado GLA: #0F4C3A, topbar 60 px, sidebar clara 280 px; DS existente e navegação/UX aprovada. Somente Técnico, Coordenação e Diretor da Fiscalização têm operações; demais áreas são referências de fluxo. Formação única em Salvar auto; rascunho sem número/processo; correção preserva identidade e exige novas assinaturas; recebimento distinto da expedição, saída ATEND após prazo; consulta/PDF inclusive rascunho sem efeitos de status. Pendências e conflitos históricos registrados, sem solução presumida. Relatório antigo AIAD v1.2 usa PDF v1.0 e não comprova conformidade v1.1.

Documentação abaixo preservada como contexto histórico e diretrizes de outras frentes. Não iniciar etapas futuras nesta interação de memorização.

---

# CERH / DR001 DIRAN — instruções persistentes e gates da demanda

## Estado vigente — CERH v3 encerrado e empacotado (07/10/2026)

Publicação posterior explicitamente autorizada e concluída em07/10/2026: Vercel dpl_HRUeku4mGqRhzgjENuaBrteqN2x1 READY, domínio inema.acto.com.br, versão inema-pc2teeru6-guariero.vercel.app. Build já aprovado reutilizado, source igual ao manifesto v3, JS/CSS publicados byte-idênticos ao dist, três rotas HTTP200 e navegação CERH/Empreendimento/Uso da água/Usuário e Imóvel conferida, sem erros de console observados. Registro `CERH_PUBLICACAO_v3.md`. Sem novas UI/capturas/suítes/commit/push; ZIPs congelados preservados. Isso não é homologação nem integração real. Nova autorização permitiu somente esta publicação, não reabertura das demandas.

Autorização de92e6d9-414d-42d6-b764-2325411bc7c8: incorporar quatro decisões oficiais da analista e preferência UX do botão superior, preservar seis correções v2, reconciliar docs e gerar diretamente ZIPv3. Não redesign/arquitetura ampla/backend/integração real/commit/push/deploy; não gerar v2.1. Fontes consolidadas em `CERH_DECISOES_ANALISTA_2026-10-07.md`, impacto prévio em `CERH_V3_IMPACT_ANALYSIS.md`, gates/limites em `CERH_ALINHAMENTO_v3.md`.

14 arquivos locais CERH: criação exclusiva pelo empreendimento; Usuário e Imóvel primeira etapa/identificação incorporada/quatro papéis originais; Situação única com lifecycle/classification/tramitation/processSituation separados; empreendimento separado do CERH concluído, que exige solicitação/justificativa/aprovação DIRAM/blocos inclusive Técnico/Conveniado. Rascunho autorizado normal. Botão superior DS é trigger do mesmo fluxo, não segunda implementação. Q-HUM01–04 RESOLVIDAS, Q-HUM05 REMOVIDA, zero Q-HUM pendentes. Restam18 IDs adicionais,17estados parciais/3bloqueados;164/184 atendidos locais. 460 registros-fonte não integralmente reclassificados.

Rodada direcionada53PASS (24 critérios v3); DOR011 integral53PASS. CERH253/256 na execução integral; três falhas na mesma leitura assíncrona do logo do certificado, teste sincronizado sem flexibilizar exigência de logo válido,3/3 retestes específicos aprovados em Full HD/4K/mobile. Não declarar256/256 em uma única execução. Confirmação integral adicional interrompida por solicitação explícita do usuário, exit1 de cancelamento, sem JSON final; não contar como PASS. TypeScript/build finais exit0/zero erros; warning existente de chunk grande. Dez imagens anteriores reutilizadas, nenhuma nova UI/captura/QA. Integridade do diff/bytes/ZIP verificada sem recompilar cópia nem executar testes adicionais.

ZIP final: `output/cerh-auditoria/PACOTE-AUDITORIA-CERH-UX-FINAL-v3.zip`,14.314.140 bytes(13,65MiB),SHA256 `523d33ff1063dd93285640bfb4b86c6b443ef8687b5cb479902d9a1975f591f6`.331 arquivos/330 hashes,source237,29 arquivos no delta(14UI locais),10 evidências v3 abertas/íntegras,PDF79/Guia/14PNGs originais intactos. CRC/hash/escopo/secrets PASS; v1/v2 ZIPs intactos. Sem .env/credenciais/dumps/dependências/caches/builds descartáveis; imagens/logs históricos redundantes permanecem nos ZIPs anteriores, não recopiados. Integridade e SHA256SUMS-v3 ao lado.

Durante diagnóstico local foi observada exposição de uma credencial de serviço em saída de processo. A credencial não foi copiada para os artefatos do pacote. Recomenda-se rotação separadamente.

**PARAR. CERH v3 encerrado; nenhuma execução adicional necessária. Não iniciar testes/capturas/UI/tarefa/deploy nem alterar ZIPs congelados sem novo direcionamento explícito.**

## Histórico — microrefino v2 concluído (07/10/2026)

Autorização56a3e31a-71a2-4cd2-8451-506e853ecf5d: seis microcorreções objetivas implementadas em11 arquivos CERH-locais, sem DS global/shell/DOR/dashboard/Fauna/backend/deploy. Relatório `CERH_MICROREFINO_v2.md`. Confirmação232CERH+53DOR=285PASS,0unexpected/skipped/flaky/errors; TS/build0 na origem e cópia isolada reconstruída pelo diff v1→v2. Separar build e testes: prepare_legacy_pages recopia HTML e causa full reload no Vite. Não enfraquecer assertions.

Pacote final congelado: `output/cerh-auditoria/PACOTE-AUDITORIA-CERH-UX-FINAL-v2.zip`,21.842.650 bytes(20,83MiB),SHA256 `f64baa77c20b62d76371ae6b2e5b23a851547459f953d1b8def4672d36e1e718`.402 arquivos/401 hashes,source231,diff22 arquivos(11UI,7testes/harness existentes,4 novos),8 imagens atuais e50 v1 claramente históricas. CRC/hash/PDF79/14 originais/76 imagens abertas/dimensões/escopo/secrets PASS; relatório de integridade e SHA256SUMS-v2 ao lado. ZIPv1 intacto. Source agregado `0f5f50c5917d1a5991b12c78123404511a2a699fe5ed9175590f506b68bacc9e`.

Q-HUM01–05 e20 IDs adicionais continuam pendentes;18PARCIAIS/4BLOQUEADOS não promovidos. DOR011 permanece pausado, implementação byte-idêntica ao v1. Nenhum commit/push/deploy/homologação/nota10/10. **PARAR: aguardar auditoria externa ou novo direcionamento. Não modificar os ZIPs congelados.** Histórico v1 e regras persistentes seguem abaixo; seus gates/contagens são históricos, não os mais recentes.

## Histórico e regras persistentes CERH

Briefing integral recebido em 06/10/2026: `docs/CERH_UX_INTEGRADO_INSTRUCOES.md`. Ler integralmente antes de qualquer próxima fase do CERH. A memória resumida está na seção 14 de `MEMORY.md`; não substitui o briefing completo.

- Estado atual em 07/10/2026: FASE 5 autorizada pelo anexo 2e9f626a-871a-4f6e-87fb-78d8203605ee e concluída exclusivamente como pacote. ZIP congelado em `output/cerh-auditoria/PACOTE-AUDITORIA-CERH-UX-FINAL-v1.zip`, 20.367.167 bytes, SHA256 `79ca9fbeca983685d5bef1172004d694555fca2816386487165dac19e2ac9a2c`. 353 arquivos, 50 imagens curadas + 14 PNGs originais; CRC/hashes/PDF79/68 imagens e dimensões conferidos. Últimos gates TS/build0, 203 CERH+53 DOR011=256 PASS sem skipped/flaky/unexpected. Source copiado também compilou; patch integrado passou em índice temporário. HEAD base `2e28a8739b8fd7f030f1274fb711acce7afa0b85`, main, mudanças não commitadas documentadas. 162 estados atendidos/18 parciais/4 bloqueados e cinco Q-HUM permanecem. Nada de alteração funcional, backend, redesign, commit/push/deploy/homologação. README/PROMPT/RESUMO/GAPS no pacote; integridade e SHA do ZIP ao lado. PARAR: aguardar auditoria externa/novo direcionamento, não editar o ZIP congelado. DOR011 preservado e pausado.
- Identificador confirmado pela autorização da FASE 2: CERH / DR001 DIRAN, distinto do DR001 de Fauna e do DOR011 de Fiscalização. A menção DR011 na transição não renomeia esta demanda.
- Fontes: PDF original DR001 CERH, Guia UX Integrado ao Empreendimento e `Prtótipos.zip`. Decisões explícitas posteriores do Guia prevalecem apenas nos pontos alterados; PDF governa os demais requisitos; PNGs são AS-IS visual; DS oficial governa anatomia/tokens/densidade; Figma Filament é secundário, sem copiar o laranja.
- Arquitetura obrigatória: Meu Cadastro → Empreendimento → Criar/Editar → Uso da água; um CERH por ponto, múltiplos pontos por empreendimento; cinco tipos; Finalidade como bloco interno do ponto, nunca etapa/menu independente. Menu técnico CERH separado de Requerimentos.
- Entrega é protótipo frontend navegável com mocks locais, sem backend, banco, autenticação/autorização corporativa, geosserviços, CNARH40/SNISB, e-mail, storage ou geração documental oficial reais. Reutilizar componentes DS existentes antes de compor/criar.
- FASE 2: reconciliar integralmente PDF + Guia + 14 PNGs, mapear código/DS, inventário de telas/estados, gaps, conflitos e plano; PARAR. FASE 3 somente com autorização e plano aprovado; FASE 4 revisão adversarial; FASE 5 apenas após PASS explícito/aprovação da FASE 4, com evidências e pacote.
- Não resolver pendências normativas/técnicas por opinião: registrar questões, incluindo limite de barragem em 200.000 m³, pré-classificação, edição autorizada e integrações. Não declarar homologação, produção pronta, integração real ou 10/10.
- Estes gates específicos substituem a execução/publicação automática genérica SOMENTE na demanda CERH. Preservar instruções e implementação de outros módulos.

# DOR011 — Refino final UI/UX: gates explícitos da rodada atual

Instruções persistentes recebidas em 06/10/2026: ler integralmente `docs/DOR011_REFINO_FINAL_INSTRUCOES.md` antes de qualquer trabalho nesta rodada do DOR011. O briefing completo e a lista A–T governam as próximas fases.

- Estado atualizado em 06/10/2026: FASE 2 concluída e aprovada externamente; FASE 3 implementada; FASE 4 explicitamente autorizada, concluída com PASS local e cinco correções. 208 verificações finais aprovadas, TypeScript/build sem erros; seis relatórios DOR011_FASE4_* na raiz. Aguardando autorização explícita para a FASE 5. Não gerar pacote/ZIP final nem fazer deploy antecipadamente; PASS local não é homologação nem 10/10.
- Revisões do DOR011 pausadas por solicitação explícita do usuário em 06/10/2026 para tratar CERH; preservar o estado e os arquivos existentes. Não retomar revisão, implementação ou FASE 5 sem novo direcionamento.
- FASE 2 é somente exploração/inventário/plano e deve parar. FASE 3 exige outra autorização explícita.
- FASE 4 exige revisão adversarial PASS antes da FASE 5 (evidências/ZIP). Não publicar automaticamente como pronto.
- Protótipo frontend com mocks: preservar shell legado e regras aprovadas; reutilizar o Design System real no miolo. PDF governa requisitos, DS governa visual, Figma é referência secundária sem copiar o laranja.
- Não implementar backend, banco, autenticação/autorização real, storage, serviços ou integrações reais GeoBahia/CAR.
- Estes gates específicos substituem a execução/publicação automática genérica abaixo SOMENTE nesta rodada DOR011. Não ampliar o escopo para outras telas.

# Autonomous Execution & Zero-Interruption Rules

- **Total Autonomy & Auto-Approval**: Execute all tasks end-to-end without pausing for trivial questions, micro-approvals, permission dialogs, or intermediate confirmations. Whenever a task is requested, assume "Sim, sempre" for any command, file edit, or verification required to achieve the goal.
- **Proactive Implementation**: Read, create, edit files, and run commands immediately as needed to complete the task. Never ask "Can I run this?" or "Should I proceed?".
- **Engineering Judgment**: When requirements have minor ambiguity, make sensible, industry-standard engineering decisions instead of stopping to ask clarifying questions. Document choices in the final summary.
- **Autonomous Error Resolution**: When a command, test, or build fails, inspect the error output, diagnose the root cause, apply fixes, and re-run automatically until successful.
- **Unattended / Overnight Execution**: Keep tests, scripts, and validations running continuously without blocking for user feedback until all tasks are accomplished.
- **Concise Reporting**: Report back only when significant milestones are achieved ou quando a tarefa for concluída, gerando o parecer final pronto para colar no card/Mattermost.

---

# Diretrizes de Homologação & Testes — GLA Inema

- **NUNCA APAGAR DADOS DO SISTEMA**: É terminantemente proibido deletar registros existentes, cadastros de terceiros, históricos de processos ou configurações do ambiente de homologação (`https://gla-inema-hml.acto.com.br/`).
- **NUNCA APAGAR PARÂMETROS**: Parâmetros mestres e configurações do sistema nunca devem ser deletados, sob hipótese alguma.
- **CAMPOS PARAMETRIZADOS (CRIAR ANTES DE USAR)**:
  - Uma grande quantidade de campos no GLA depende de dados parametrizados (ex.: Responsável Técnico, instituições parceiras, tipos de denúncia/emergência, órgãos intervenientes, etc.).
  - Esses campos não aceitam texto livre arbitrário. Se um teste necessitar de um dado que não consta no combobox/listagem, **ele deve ser previamente cadastrado/criado no módulo de parametrização correspondente** antes de ser selecionado na tela de atendimento.
  - Certifique-se de que a parametrização existe e está ativa antes de executar o fluxo principal.

---

# Padrão Oficial de Organização de Pastas & Relatórios de QA (Acto/Inema)

Para cada card/teste a ser executado, a estrutura de pastas e arquivos DEVE ser rigorosamente padronizada:

### 📁 Estrutura de Pastas por Card (`qa/cards/[identificador-do-card]/`):
```text
qa/cards/[identificador-do-card]/
├── checklist.md             # Checklist interno com o mapeamento e validações (NÃO ANEXAR NO CARD)
├── comentario-card.txt      # Texto pronto e formatado para copiar e colar no card/Mattermost
├── anexos.zip               # Pacote zip contendo APENAS os prints necessários devidamente nomeados
└── prints/                  # Capturas de tela (ex.: "Print 01 - Visualizar bloqueado.png")
```

### 🖼️ Regra de Seleção de Prints (Evidências):
- **O checklist NÃO é anexado no card**: fica apenas arquivado internamente na pasta do teste.
- **Anexar apenas os prints estritamente necessários**: não anexar dezenas de telas triviais. Manter seleção cirúrgica (normalmente 4 a 6 prints relevantes, com contraste e comprovação clara).
- **Se o teste NÃO passar**: anexar obrigatoriamente o print do erro, demonstrando a divergência com o requisito e o comportamento incorreto da tela.
- **Nomenclatura descritiva dos prints**: Sempre no formato:
  - `Print 01 - [Descrição curta do que está sendo comprovado].png`
  - `Print 02 - [Descrição curta].png`

### 📝 Padrão do Texto (`comentario-card.txt`):
```markdown
Fala @[nome-do-dev]! Retestei o card de "[Nome da Funcionalidade / Título do Card]". Segue o resultado:

Resolvido: [Ação executada com dados concretos (valores, cadastros)] e confirmei que [comportamento observado], com a mensagem "[mensagem exata]" (Print 01). Pra contraste, testei [cenário de contraste] (Print 02).
Não resolvido: [Caso algum ponto tenha falhado, descrever exatamente o que aconteceu e o que era esperado] (Print XX).
Fora do escopo deste card: [Bugs periféricos encontrados que não impedem o fechamento do card atual].
Com isso, considero este card resolvido / [ou parecer correspondente].
Fico à disposição se precisar de mais detalhes de qualquer um desses pontos.
```

# 🎯 Padrão Obrigatório de Entregas por Analista (Naiane, Herickles, Thays, Maria)

Trabalhamos com demandas de 4 analistas principais: **Naiane, Herickles, Thays e Maria**. Toda entrega de protótipo deve seguir rigorosamente as seguintes diretrizes:

1. **Padrão Visual Institucional**: Todas as solicitações dos analistas levam **estritamente o padrão visual do sistema legado GLA / Filament** (`#0F4C3A`, verde institucional, tabelas canônicas e abas de contexto).
2. **Link Separado por Solicitação / Task**: Cada entrega concluída recebe um **link exclusivo e dedicado no Vercel** (ex: `inema-regulacao.vercel.app`, `inema-uc.vercel.app`, etc.).
3. **Sidebar Estritamente Focada (Zero Ruído)**:
   - Na sidebar do link entregue ao analista, deve constar **SOMENTE as telas executadas naquela task específica**.
   - É terminantemente proibido exibir na sidebar telas de solicitações anteriores ou de outros analistas (a não ser que o usuário peça explicitamente). O analista precisa desse link limpo para apresentar e validar exclusivamente o seu escopo.
4. **Link Principal Consolidado (`https://inema.acto.com.br`)**:
   - Mantemos o link principal onde a sidebar reúne **todos os módulos e telas já desenvolvidos**, funcionando como o portal mestre integrado da plataforma.
5. **Imutabilidade das Entregas Anteriores**:
   - Links já enviados para solicitações passadas continuam no ar, intocados e congelados no estado em que foram aprovados. Nenhuma nova task pode sobrescrever ou desconfigurar os links anteriores.

---

# 🎨 Diretriz Dual-Track: Solicitações dos Analistas vs Redesign do Inema

Temos duas trilhas de desenvolvimento e apresentação completamente distintas que NUNCA se misturam:

### 1. Trilha de Solicitações dos Analistas (Naiane, Herickles, Thays, Maria)
- **Padrão Visual**: Sistema Legado GLA / Filament (`#0F4C3A`, verde institucional, tabelas canônicas e abas contextuais).
- **Links Separados por Task**: Cada solicitação recebe um link exclusivo e isolado (ex.: `https://inema.acto.com.br/?escopo=regulacao` ou `inema-regulacao.vercel.app`).
- **Sidebar Estritamente Focada**: Exibe **SOMENTE** as telas daquela solicitação específica para apresentação limpa ao analista e gestores.
- **Link Principal Consolidado**: `https://inema.acto.com.br/` reúne todos os módulos já finalizados para visão corporativa integrada.

### 2. Trilha de Solicitações sobre o Redesign do Inema
- **Padrão Visual**: Padrão **shadcn adaptado para Filament** (estilo moderno, paleta slate/azul, dark mode, cartões refinados, métricas modernas e microinterações).
- **Link Separado e Exclusivo**: Mantido em link próprio dedicado exclusivamente a essa frente (ex.: `https://inema-lucas.vercel.app/`).
- **Sidebar do Redesign**: Focada nas telas refinadas dessa proposta de redesign (módulos de Fiscalização e Relatórios Gerenciais refinados), consistente em todas as páginas dessa versão.
- **Isolamento Total**: Alterações das solicitações dos analistas não alteram o link do redesign shadcn, e alterações de redesign não afetam as telas legadas dos analistas.

---

# 🏛️ PADRÃO MANDATÓRIO DE PROTOTIPAGEM SEIA V2 (DESIGN SYSTEM INVIOLÁVEL)

Todo e qualquer modelo de IA (Antigravity, Gemini, GPT, Claude, etc.) ou engenheiro que for desenvolver ou prototipar telas para o **SEIA V2 (INEMA)** DEVE OBRIGATORIAMENTE seguir estas diretrizes:

### 1. Reuso Obrigatório dos Componentes do Design System (Zero Gambiarra / Zero AI Slop)
- É TERMINANTEMENTE PROIBIDO criar componentes descartáveis, HTML cru sem estilização, estilos inline ad-hoc ou componentes desconectados da identidade visual oficial.
- Toda tela do SEIA V2 deve ser construída importando e reutilizando as primitivas e componentes já refinados do nosso Design System:
  - **Botões (`Button`)**: `src/components/ui/button.tsx` — variantes solid/outlined (`primary` `#0F4C3A`, `gray`, `danger`, `warning`, `success`), tamanhos `xs`, `sm`, `default`/`md`, `lg`, estados loading (`LoaderCircle`) e disabled.
  - **Badges e Status (`Badge`)**: `src/components/ui/badge.tsx` — cores semânticas (`success`, `warning`, `danger`, `info`, `primary`, `gray`), com e sem `dot`.
  - **Inputs & Wrappers (`InputWrapper`)**: `src/components/filament/InputWrapper.tsx` — prefixos/sufixos com ícones ou texto, feedback de validação `valid=false` com mensagem explicativa e foco com anel suave.
  - **Selects Pesquisáveis (`FilamentSelect`)**: `src/components/filament/Select.tsx` — popover com busca em tempo real, teclado e descrições.
  - **Seções Modulares (`Section` / `FilamentSection`)**: `src/components/filament/Section.tsx` — seções recolhíveis (`collapsible`), cabeçalhos com ícones, `headerActions` e `footer`.
  - **Wizard / Stepper (`FilamentWizard`)**: `src/components/filament/Wizard.tsx` — stepper oficial com divisórias em chevron SVG institucional. NUNCA recriar outro stepper.
  - **Tabelas & Data Grid (`TableContainer` / `TableToolbar`)**: `src/components/filament/Table.tsx` — toolbar com busca debounced, filtros com contagem, ações em lote (`DropdownMenu`), seleção múltipla e paginação.
  - **Cards & Métricas (`KpiCard` / `StatsOverviewWidget`)**: `src/components/dashboard/KpiCard.tsx`, `src/components/filament/StatsOverviewWidget.tsx` — métricas com micro-sparklines e tendências.
  - **Navegação & Breadcrumbs (`ShadcnHeader`, `ShadcnSidebar`, `FilamentTabs`, `SeiaV2Breadcrumb`)**: topbar verde em 100% da largura, sidebar com acordeão exclusivo (apenas 1 aberto por vez), abas underline com badges.
  - **Modais & Overlays (`Dialog`, `DropdownMenu`)**: `src/components/ui/dialog.tsx`, `src/components/ui/dropdown-menu.tsx`.

### 2. Criação de Novos Componentes (Baseados Estritamente nos Parâmetros do Design System)
- Caso um fluxo específico necessite de um componente ou padrão que **ainda não exista exatamente pronto**, o agente DEVE criar um novo componente seguindo RIGOROSAMENTE as regras e tokens refinados do Design System:
  - **Cores & Tokens**: Usar as variáveis CSS semânticas (`var(--color-brand-primary)`, `var(--color-surface-default)`, `var(--input-border-focus)`, etc.) e o verde institucional `#0F4C3A` como cor primária.
  - **Geometria & Raios**: `rounded-xl` para containers/cards/seções, `rounded-lg` para botões e inputs, `rounded-md` para badges e popovers, `rounded-full` para pills.
  - **Densidade (Dense UI)**: Alturas padronizadas de `h-9` (36px) ou `h-8` (32px) para botões e inputs, tipografia `text-xs` ou `text-sm`.
  - **Foco & Microinterações**: Transições suaves (`transition-colors duration-150` ou `duration-200`) e foco visível `focus-visible:ring-2 focus-visible:ring-[var(--color-green-alpha-20)]`.
  - **Suporte Dual-Theme**: 100% compatível com Light Mode e Dark Mode neutro (carvão/ardósia).
  - **Assets & Logos**: NUNCA usar caminhos literais com `/src/`. Importar sempre os SVGs oficiais de `src/assets/seia-plataforma/svg/`.
  - **Catálogo de Referência**: A rota viva oficial do Design System é `https://inema.acto.com.br/?rota=seia-v2&tela=design-system`.

---

# 🚀 Padrão Oficial de Prototipagem GLA / INEMA (Super Prompt & Regras de Ouro)

Sempre que o usuário enviar um Documento de Requisito (DORxxx, DRxxx, card, issue, texto ou PDF) para criar ou refatorar protótipos de telas do INEMA/GLA, execute AUTOMATICAMENTE este protocolo de excelência de ponta a ponta:

### 1. Auditoria e Mapeamento de Requisitos (RNs e Telas)
- **Extrair todas as Regras de Negócio (RN001, RN002...)**: salvaguardas, travas de envio, cálculos, prazos/SLAs (ex: SLA 20 dias da DISUC, contagem regressiva, vigência de 12/24 meses).
- **Mapear Telas Operacionais (TL001 a TL007)**: formular a hierarquia exata de navegação e os formulários oficiais integrados (ex: `F-DUC-066`, `F-DUC-067`, `F-DUC-068`, `F-DUC-069`, `F-DUC-070`, `F-DUC-072`).
- **Base Normativa Real**: fundamentar as telas nas portarias reais do INEMA e leis ambientais (ex: Portaria INEMA nº 25.753/2022, Lei do SNUC nº 9.985/2000, integração com processos formais do SEI-BA).
- **Cenários de Contraste**: prever dados e estados de contraste realistas (Deferido/Emitido, Em Análise Técnica, Pendência/Complementação, Indeferido com prazo recursal de 10 dias).

### 2. Arquitetura de Navegação GLA / Filament (Regra de Ouro: Botão vs Aba)
- **NUNCA transformar ações de criação em ABAS**:
  - Expressões como *"Novo Projeto"*, *"Nova Solicitação"*, *"Novo Agendamento"*, *"Cadastrar Plantonista"* **NÃO SÃO ABAS**, são **AÇÕES**.
- **O que são ABAS (`FilamentTabs`)**:
  - São estritamente usadas para alternar **visões de dados ou contextos de consulta/gestão** sobre uma mesma entidade:
    - Ex: `Projetos de Pesquisa (3)` | `Atos e Relatórios` (gestão de relatórios pós-autorização e acervo de teses/artigos).
    - Ex: `Pauta de Agendamentos (1)` | `Calendário da UC` (ocupação de atrativos e prevenção de conflitos).
    - Ex: `Processos AAD (2)` | `Análise e Decisão` (parecer técnico do gestor, condicionantes e emissão).
    - Ex: `Painel de Processos (3)` | `Análise e Portaria` (minuta conclusiva e prazos).
- **O que são BOTÕES PRIMÁRIOS**:
  - O botão de ação primária (ex.: `+ Novo Projeto`, `+ Nova Solicitação`, `+ Novo Agendamento`) deve ficar no **canto superior direito do cabeçalho da página** (ou no header da tabela/filtros), estilizado com o verde oficial do INEMA (`bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white`).
- **Fluxo do Formulário / Wizard**:
  - Ao clicar no botão de criação, a aplicação exibe o formulário/wizard de preenchimento.
  - A barra de abas de listagem NÃO é exibida enquanto o usuário preenche o formulário.
  - O formulário DEVE conter um cabeçalho claro com o código do formulário oficial (ex: `DOR004`, `F-DUC-069-00`) e botão de retorno limpo: `← Voltar aos [Registros]`.
  - Ao enviar ou cancelar, retorna diretamente para a pauta/listagem com o novo registro inserido.
- **Tela Inicial Padrão**:
  - A rota SEMPRE deve abrir na **Pauta / Painel Gerencial de Processos** (visão do gestor/técnico), NUNCA jogar o usuário de cara em um formulário em branco.

### 3. Eliminação Total de AI Slop & Identidade Visual Estrita
- **PROIBIDO paletas artificiais de IA**:
  - **ZERO ROXO / PÚRPURA (`purple`, `violet`)**: O sistema GLA não tem elementos roxos.
  - **ZERO TEAL GENÉRICO (`teal-600/700`)**: Botões primários NUNCA usam teal. Devem usar exclusivamente o verde primário oficial: `#0F4C3A`.
  - **ZERO gradientes artificiais ou fundos chamativos**: Manter superfícies limpas (`bg-white dark:bg-slate-900`, `bg-slate-50 dark:bg-slate-950/40`, bordas `border-slate-200 dark:border-slate-800`).
- **PROIBIDO ícones decorativos antes de títulos textuais**:
  - Nunca colocar `<Award>`, `<BookOpen>`, `<Users>`, `<FlaskConical>` antes de títulos de cards ou cabeçalhos (h1/h2).
  - Títulos devem ser sóbrios, institucionais e em `font-bold` / `font-semibold`.
- **Badges e Tipografia Institucionais**:
  - Protocolos e números de processos (SEI-BA, AAD, AAV, Pesc) SEMPRE em fonte monoespacial (`font-mono`), com cores neutras (`text-slate-800 dark:text-slate-200`).
  - Badges semânticos de status:
    - Verde institucional para Concluído/Autorizado (`bg-emerald-50 text-emerald-700 border-emerald-200`).
    - Âmbar suave para Em Análise (`bg-amber-50 text-amber-700 border-amber-200`).
    - Azul/laranja sóbrio para Pendências/Complementação.
    - Vermelho sutil para Indeferido (`bg-rose-50 text-rose-700 border-rose-200`).
- **Sidebar & Badges de Códigos**:
  - Badges de códigos no menu lateral (`DOR001`, `DOR002`, `DOR006`...): pílula sutil de texto puro sem ícone (`text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700`).
  - NUNCA chamar atenção excessiva ou ficar vermelho/berrante ao navegar.
  - SEM pontos de notificação vermelha no sidebar.

### 4. Ciclo de Execução, Verificação Visual e Publicação Automática
Para qualquer tela criada ou editada:
1. **Build Local**: Rodar `npm run build` e garantir 0 erros de compilação TypeScript/Vite.
2. **Inspeção Visual Autônoma**: Executar script Playwright headless para capturar screenshot em alta resolução da tela e visualizá-lo com `view_file`. Auditar ativamente tipografia, ausência de AI Slop, alinhamentos e contraste.
3. **Commit Padronizado**: `git add .` dos arquivos alterados e `git commit -m "feat(...) ou refactor(...)"`.
4. **Deploy Simultâneo**:
   - `git push origin main`
   - `npx vercel --prod --yes`
5. **Verificação em Produção**: Acessar `https://inema.acto.com.br/` via script de automação, validar ao vivo e emitir o parecer final pronto para uso.

### 5. Protocolo de Validação em Duas Etapas & Handover para Auditoria GPT
Ao concluir a entrega técnica de qualquer protótipo:
1. **Captura em 1920x1080px (Full HD nativo)**: Acessar como usuário o link exclusivo da entrega (`?analista=...`) e capturar todas as abas, sub-visões, gavetas laterais (Drawers Nível 1), modais (Nível 2 rolado, filtros e metadados) e tabelas com casos de contraste.
2. **Empacotamento**: Salvar todos os prints em `qa/cards/[id-do-card]/anexos-1080p-auditoria-gpt.zip`.
3. **Estrutura Obrigatória do Relatório de Entrega (Os 3 Pilares)**:
   - **Pilar 1 — Explicação da Execução Técnica**: O que foi codificado, decisões de arquitetura e regras de negócio implementadas.
   - **Pilar 2 — Explicação Detalhada dos Prints**: Mapeamento de cada imagem com o requisito exato do documento original (DOR/Guia UX/Card) que ela comprova.
   - **Pilar 3 — Declaração Explícita de "O que falta ainda"**: Transparência sobre dados mockados, integrações pendentes com backend real e potenciais débitos técnicos, permitindo ao GPT auditor do usuário confrontar o entendimento do agente com os requisitos antes do fechamento.

