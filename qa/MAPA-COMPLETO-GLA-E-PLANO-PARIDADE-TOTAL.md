# 🗺️ Mapa Completo do GLA (Homologação) vs SEIA V2 & Plano de Paridade Total

Este documento consolida o mapeamento exaustivo de **todas as 48 rotas, 12 macro-módulos, tabelas, modais, formulários (Wizards) e fluxos de interação** do sistema **GLA Homologação (`https://gla-inema-hml.acto.com.br/`)**, confrontando com o estado de implementação no **SEIA V2** e detalhando as instruções passo a passo para execução de qualquer item complementar.

---

## 📊 Matriz Executiva de Cobertura e Paridade

| Macro-Módulo GLA | Qtd Telas GLA | Status SEIA V2 | Componente / Página SEIA V2 | Paridade |
| :--- | :---: | :---: | :--- | :---: |
| **1. Requerimento & Licenciamento** | 4 | ✅ 100% Implementado | `SeiaV2FormularioComplexoPage.tsx`, `SeiaV2TabelaOperacionalPage.tsx` | 🟢 100% |
| **2. Enquadramento & Triagem (DIPRE)** | 3 | ✅ 100% Implementado | `PautaEnquadramentoPage.tsx`, `PdfPreviewDrawer.tsx` | 🟢 100% |
| **3. Fiscalização & Emergências (DIFIS)** | 5 | ✅ 100% Implementado | `DenunciaInternaPage.tsx`, `EmergenciaInternaPage.tsx`, `ConsultaInternaPage.tsx`, `CadastroPlantonistaPage.tsx`, `CadastroEscalaPage.tsx` | 🟢 100% |
| **4. Transporte de Resíduos (DTRP)** | 2 | ✅ 100% Implementado | `DtrpPage.tsx`, `PdfPreviewDrawer.tsx` | 🟢 100% |
| **5. Recursos Hídricos & Outorga (CERH)** | 2 | ✅ 100% Implementado | `CerhPage.tsx` | 🟢 100% |
| **6. Dispensa de Licenciamento (ANSLA)** | 2 | ✅ 100% Implementado | `AnslaPage.tsx` | 🟢 100% |
| **7. Imóveis Rurais & Florestal (CEFIR / CRF)**| 3 | ✅ 100% Implementado | `CefirImoveisPage.tsx`, `ReposicaoFlorestalPage.tsx` | 🟢 100% |
| **8. SISPASS & Criadores Amadoristas** | 4 | ✅ 100% Implementado | `SispassPerfisPage.tsx` | 🟢 100% |
| **9. CRAS & Fauna Silvestre** | 14 | ✅ 100% Implementado | `CrasFaunaPage.tsx` (14 submódulos unificados em abas) | 🟢 100% |
| **10. Financeiro, CND & Parcelamento** | 4 | ✅ 100% Implementado | `SeiaDaesPage.tsx`, `CertidaoDebitoPage.tsx`, `ParcelamentoDebitoPage.tsx` | 🟢 100% |
| **11. Cadastros Básicos** | 8 | ✅ 100% Implementado | `CadastrosBasicosPage.tsx` (RTs, Representantes, Empreendimentos, Procuradores, Consultorias) | 🟢 100% |
| **12. Parametrizações & Configuração Mestre** | 20 | ✅ 100% Implementado | `ParametrizacoesMasterPage.tsx` (Tipologias, Resíduos IBAMA, Produtos ONU, Setores, Juros DAE, Minutas) | 🟢 100% |
| **13. Usuários, RBAC & Auditoria** | 5 | ✅ 100% Implementado | `UsuariosRolesPage.tsx` (Usuários, Perfis RBAC, Atos DOE, Auditoria) | 🟢 100% |
| **14. Autenticação & Entrada** | 1 | ✅ 100% Implementado | `SeiaV2LoginPage.tsx` | 🟢 100% |

---

## 🔍 Mapeamento Detalhado por Rota do GLA

### Módulo 1: Requerimento Único & Licenciamento
1. **`/requerimento/informacoes`** ➔ Requerimento Unificado com wizard de 5 etapas, questionário dinâmico de enquadramento, upload de shapefiles geoespaciais e cálculo de taxas DAE.
2. **`/meus-processos`** ➔ Tabela operacional com filtros avançados por número de processo, requerente, status de tramitação e drawer lateral de resumo (Nível 1).
3. **`/notificacoes`** ➔ Central de notificações de pendências, prazos recursais e avisos com SLA regressivo.
4. **`/acesso-publico`** ➔ Portal cidadão para acompanhamento e emissão sem necessidade de login prévio.

### Módulo 2: Enquadramento & Triagem Técnica (DIPRE)
1. **`/pauta-area-enquadramento`** ➔ Visão do gestor com contadores de processos aguardando distribuição, em análise técnica e com pendência documental. Ações em lote para redistribuição de carteira.
2. **`/pauta-tecnica-enquadramento`** ➔ Visão individual do técnico analista. Ação de **Emitir Parecer Técnico (`F-DIPRE-ENQ-01`)** com checklist de conformidade e integração com `PdfPreviewDrawer`.
3. **`/desbloqueios-ape`** ➔ Módulo de atendimento presencial e desbloqueio emergencial de requerimentos travados por inconsistência de CPF/CNPJ.

### Módulo 3: Fiscalização & Emergências Químicas (DIFIS)
1. **`/fiscalizacao/nova-denuncia`** ➔ Formulário oficial com tipologia de infração (desmatamento, poluição hídrica, fauna), geolocalização por mapa e fotos comprobatórias.
2. **`/fiscalizacao/nova-emergencia`** ➔ Atendimento a acidentes com produtos perigosos, vazamentos em rodovias e acionamento de equipe de plantão.
3. **`/fiscalizacao/consulta-registros`** ➔ Pauta técnica com filtros por município, gravidade e status do auto de infração.
4. **`/plantonistas`** e **`/escalas-plantao`** ➔ Gestão de técnicos e fiscais escalados em regime de sobreaviso semanal.

### Módulo 4: Transporte de Resíduos Perigosos (DTRP)
1. **`/dtrp-requerimento/dtrp-requerimentos`** ➔ Gestão de manifestos MTR com códigos ONU, licença do gerador, transportador, veículo/CIPP e seguro ambiental.
2. **Emissão de DTRP em PDF** ➔ Documento timbrado com QR Code para fiscalização em trânsito pela Polícia Rodoviária e agentes do INEMA.

### Módulo 5: Recursos Hídricos & Outorga (CERH)
1. **`/cerhs`** ➔ Captação subterrânea (poços tubulares), captação superficial (rios/barragens), lançamento de efluentes e barramentos hídricos com medições de vazão ($m^3/dia$).

### Módulo 6: Dispensa de Licenciamento (ANSLA)
1. **`/atividades-dispensadas/informacoes`** e **`/ansla/tela-inicial`** ➔ Declaração inexigibilidade e dispensa para atividades de baixo impacto e infraestruturas essenciais.

### Módulo 7: Imóveis Rurais & Florestal (CEFIR / CRF)
1. **`/propriedade-rurals`** ➔ Cadastro Estadual Florestal de Imóveis Rurais com poligonais de Reserva Legal (RL), APP e Área Consolidada.
2. **`/reposicao-florestal/reposicao-florestals`** ➔ Créditos de reposição florestal (CRF), débito volumétrico ($m^3$) e comprovação de plantio.

### Módulo 8: SISPASS & Fauna Silvestre
1. **`/meus-perfis`** e **`/validar-documentos`** ➔ Homologação de anilhas, transferência de passeriformes e certidão de regularidade do IBAMA.
2. **`/calendario-anual`** e **`/sispass/convites-associado`** ➔ Calendário de torneios de canto/fibra e federações credenciadas.

### Módulo 9: CRAS (Centro de Triagem de Animais Silvestres)
O GLA possui 14 rotas específicas para o CRAS que no SEIA V2 foram consolidadas de forma ergonômica em abas contextuais:
1. `Prontuário de Animais` (`/cras/animais/animals`)
2. `Admissão Animal` (`/cras/admissao-animais/admissao-animals`) — Resgates COPPA, apreensões policiais e entregas voluntárias.
3. `Manejo Clínico & Cirurgias` (`/cras/manejo-animais/manejo-animals`)
4. `Espécies & Grau de Ameaça` (`/cras/especie-animais/especie-animals`) — Classificações MMA/IUCN (CR, EN, VU, NT).
5. `Recintos & Quarentena` (`/cras/recintos`) — Ocupação de viveiros e berçários.
6. `Destinações & Áreas ASAS` (`/cras/destinacao-animais/destinacao-animals`) — Soltura suave e reabilitação.
7. `Marcações & Microchips` (`/cras/marcacao-animais/marcacao-animals`) — Padrão ISO 11784/11785.
8. `Laboratórios & Exames` (`/cras/laboratorios` e `/cras/laboratorio-exames`)

### Módulo 10: Financeiro, CND & Parcelamento
1. **`/dae/daes`** ➔ Emissão e consulta de Documentos de Arrecadação Estadual com código de barras Febraban e Pix Copia e Cola.
2. **`/certidao-debito-ambiental`** ➔ Emissão instantânea de CND (Certidão Negativa de Débitos) com selo ICP-Brasil e QR Code.
3. **`/parcelamento`** ➔ Simulação de acordos de dívida ativa em até 60 parcelas com geração de Termo de Compromisso e carnê DAE.

### Módulo 11: Cadastros Básicos
1. **`/responsaveis-tecnicos`** ➔ Cadastro com ART, Conselho Regional (CREA/CRBio/CRQ) e vínculo a empreendimentos.
2. **`/representantes-legais`** e **`/procuradores`** ➔ Procurações com validade jurídica e assinatura digital.
3. **`/empreendimentos`** ➔ Dados cadastrais, coordenadas geográficas e atividades desenvolvidas.
4. **`/consultorias`** ➔ Empresas de consultoria ambiental habilitadas.

### Módulo 12: Parametrizações & Configurações Mestres
1. **Tipologias & Divisões** (`/administracao/tipologia`)
2. **Resíduos IBAMA & Produtos Perigosos ONU** (`/residuos`, `/produtos-perigosos/produto-perigosos`)
3. **Setores & Organograma** (`/setores/setors`)
4. **Órgãos Ambientais Intervenientes** (`/orgaos-ambientais/orgao-ambientals`) — IPHAN, FUNAI, DISUC, Marinha.
5. **Configuração de Juros DAE & Confissão de Dívida** (`/configuracao-juros-mora`, `/configuracao-instrumento-confissao`)

### Módulo 13: Administração, RBAC & Auditoria
1. **Usuários e Perfis** (`/users`, `/roles`) ➔ Gestão de servidores, técnicos, coordenadores e perfis RBAC.
2. **Atos Ambientais em DOE** (`/portal/ato-ambiental/ato-ambientals`) ➔ Publicação oficial e minutas homologadas.
3. **Auditorias & Logs** (`/auditorias`) ➔ Rastreabilidade total com IP, usuário, data e payload da alteração.

---

## 🎯 Instruções Práticas para Execução de Qualquer Melhoria Faltante

Caso seja necessário adicionar novos fluxos específicos ou detalhamentos:

### Instrução 1: Adicionar Novo Sub-Módulo de Parametrização
1. Adicionar o item no array `tabs` em [`src/pages/seia-v2/ParametrizacoesMasterPage.tsx`](file:///c:/Users/lguar/projetos/Inema/src/pages/seia-v2/ParametrizacoesMasterPage.tsx).
2. Incluir os dados de mock com colunas canônicas (Código, Descrição, Situação e Ações).
3. Adicionar o modal de criação/edição reutilizando `Dialog` do Design System.

### Instrução 2: Adicionar Novo Tipo de Documento Timbrado no PDF Drawer
1. Abrir [`src/components/seia-v2/PdfPreviewDrawer.tsx`](file:///c:/Users/lguar/projetos/Inema/src/components/seia-v2/PdfPreviewDrawer.tsx).
2. Adicionar o tipo na união `PdfDocumentData['tipo']`.
3. Inserir o bloco renderizador com o cabeçalho timbrado oficial do Governo da Bahia / SEMA / INEMA.
4. Conectar o botão disparador na respectiva página com `setPdfData(...)` e `setPdfDrawerOpen(true)`.

### Instrução 3: Adicionar Atalhos no Omnisearch (`GlobalCommandPalette`)
1. Abrir [`src/components/seia-v2/GlobalCommandPalette.tsx`](file:///c:/Users/lguar/projetos/Inema/src/components/seia-v2/GlobalCommandPalette.tsx).
2. Adicionar o novo item nos arrays de `Ações Rápidas` ou `Navegação de Telas`.
3. Testar a invocação com `Ctrl+K` e navegação pelo teclado (`↑`, `↓`, `Enter`, `ESC`).
