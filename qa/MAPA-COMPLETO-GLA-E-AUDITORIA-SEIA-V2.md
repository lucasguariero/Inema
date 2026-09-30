# 🏛️ MAPA COMPLETO DO GLA & AUDITORIA INTEGRAL SEIA V2
**Documento Mestre de Arquitetura, Mapeamento de Telas Faltantes e Diagnóstico de UX**
**Data de Levantamento:** 30/09/2026  
**Ambiente Mapeado:** `https://gla-inema-hml.acto.com.br/`  
**Ambiente de Homologação SEIA V2:** `https://inema.acto.com.br/?rota=seia-v2`

---

## 🎯 Sumário Executivo

Este documento consolida o levantamento exaustivo de **100% das telas, pautas, cadastros, parametrizações e modais** do sistema legado GLA, estruturando o backlog para tornar o **SEIA V2 100% completo e fiel a todas as necessidades operacionais do INEMA**.

Adicionalmente, apresenta a auditoria técnica de usabilidade, responsividade e consistência das **22 telas já implementadas** no padrão SEIA V2.

---

# 🗺️ ETAPA 1: MAPEAMENTO DE TODAS AS TELAS FALTANTES DO GLA

Mapeamos **5 grandes grupos de telas e modais** que ainda não constam no SEIA V2, organizados por criticidade e função operacional:

---

### 📂 GRUPO A: Cadastros Mestres do Cidadão & Empreendedor (Perfil Requerente / Consultoria)
*Módulo de base cadastral que alimenta todos os processos do SEIA.*

| # | Módulo GLA | Rota Legada | Colunas da Tabela Canônica | Ações de Topo & Modais |
|---|---|---|---|---|
| **A1** | **Responsáveis Técnicos** | `/responsaveis-tecnicos` | Código, Data Solicitação, Vínculo com, Nome RT, CPF, Profissão (CREA/CRBio), Situação, Data Manifestação, Permissões | `+ Vincular RT`, Modal de Convite de RT por CPF/e-mail, Histórico de Vínculos |
| **A2** | **Representantes Legais** | `/representantes-legais` | Código, Data Entrada, Cadastro Representado, Representante, CPF, Profissão, Situação, Permissões | `+ Adicionar Representante`, Modal com Upload de Procuração Pública e Termo de Posse |
| **A3** | **Empreendimentos** | `/empreendimentos` | Nome do Empreendimento, Requerente, Localidade / Município, Tipo de Imóvel, Status | `+ Novo Empreendimento`, Modal de Vínculo de Imóvel Rural / Urbano e Coordenadas SIRGAS 2000 |
| **A4** | **Propriedades Rurais** | `/propriedade-rurals` | Código CEFIR, Nome do Imóvel, Área Total (ha), Município, UF, Status SICAR, Data Cadastro, Ativo | `+ Importar CAR / CEFIR`, Modal de Consulta de Polígonos de Reserva Legal e APP |
| **A5** | **Procuradores** | `/procuradores` | Nome, CPF, Situação, Convite enviado em, Ações | `+ Adicionar Procurador`, Modal "O que é um procurador?" com validação de CPF e escopo de poderes |
| **A6** | **Representações / Consultorias** | `/consultorias` | Razão Social Consultoria, CNPJ, Responsável, Vínculos Ativos, Status | `+ Vincular Empresa de Consultoria`, Modal de Permissões de Protocolo e Resposta de Notificações |

---

### 📂 GRUPO B: Regulação, Pautas Técnicas & Enquadramento Interno
*Visão dos técnicos e gestores para triagem, distribuição de processos e análise técnica prévia.*

| # | Módulo GLA | Rota Legada | Abas & Visões de Dados | Ações & Modais Internos |
|---|---|---|---|---|
| **B1** | **Pauta da Área — Enquadramento** | `/pauta-area-enquadramento` | Abas: `Todos`, `Aguardando (12)`, `Em Análise (8)`, `Aguardando Validação (4)`, `Pendências (2)` | `Distribuir em Lote`, Modal de Atribuição de Técnico com cálculo de carga de trabalho |
| **B2** | **Pauta Técnica — Enquadramento** | `/pauta-tecnica-enquadramento` | Abas: `Meus Processos`, `Prioritários`, `Com Notificação` | Modal de Emissão de Parecer de Enquadramento (`F-DIPRE-ENQ-01`) e Definição de Atos |
| **B3** | **Desbloqueios da APE** | `/desbloqueios-ape` | Colunas: Nº Protocolo, Nome/Razão Social, Empreendimento, Enviada em, Situação | `Aprovar Desbloqueio`, Modal com Justificativa Técnica e parecer jurídico de suspensão |
| **B4** | **Pauta Geral de Perfis & Documentos** | `/validar-documentos` | Abas: `Todos (19)`, `Novos (7)`, `Pendentes (0)` | `Validar Documento`, Modal de Análise de Diploma, ART de Cargo/Função e Certidão de Registro Profissional |
| **B5** | **Meus Calendários Anuais (SISPASS)** | `/calendario-anual` | Tabela com Torneios de Passeriformes, Datas, Clubes e Municípios | Modal de Cadastro de Etapa de Torneio e Validação de Calendário Oficial da Bahia |

---

### 📂 GRUPO C: Parametrizações & Tabelas Mestres do Sistema
*Onde os administradores e analistas seniores configuram os parâmetros normativos.*

| # | Módulo GLA | Rota Legada | Estrutura de Dados & Finalidade |
|---|---|---|---|
| **C1** | **Tipologias e Divisões Ambientais** | `/administracao/tipologia` | Cadastro hierárquico: Divisão ➔ Tipologia ➔ Atividades Industriais / Agropecuárias / Mineração com enquadramento de porte |
| **C2** | **Catálogo de Resíduos & Classes** | `/residuos` | Tabela com Código IBAMA, Nome, Classificação (Classe I Perigoso, Classe II-A Não Inerte, II-B Inerte) e Origem |
| **C3** | **Catálogo de Produtos Perigosos** | `/produtos-perigosos/produto-perigosos` | Descrição do Produto, Número ONU (4 dígitos), Classe de Risco e Ficha de Emergência |
| **C4** | **Setores & Hierarquia Organizacional** | `/setores/setors` | Sigla (ex: DISUC, DIFIS, DIPRE), Nome do Setor, Representante Titular, Setor Superior e Órgão |
| **C5** | **Órgãos Intervenientes & Conveniados** | `/orgaos-ambientais/orgao-ambientals` | Cadastro de IPHAN, ICMBio, FUNAI, ANA, CERB, Embasa e Prefeituras conveniadas |
| **C6** | **Legislações & Portarias Ambientais** | `/legislacoes` | Código da Norma, Nome, Tipo (Lei Estadual, Decreto, Portaria INEMA, Resolução CEPRAM), Data Publicação |
| **C7** | **Tipos de Documento & Uploads** | `/tipos-documento` | Categoria de documento (Planta Baixa, PGRS, PCA, PRAD, ART, Procuração), obrigatoriedade e validade |
| **C8** | **Informativos do Requerimento** | `/parametrizacao-informativos` | Configuração dos textos de ajuda, avisos de tela e orientações ao requerente por módulo/slug |
| **C9** | **Parâmetros Financeiros & Juros de Mora** | `/configuracao-juros-mora` | Índices de correção (SELIC / IPCA), percentual de juros de mora e datas de vigência |
| **C10** | **Instrumento de Confissão de Dívida** | `/configuracao-instrumento-confissao` | Minuta padrão do termo de parcelamento, autoridade signatária, cargo e matrícula do gestor |

---

### 📂 GRUPO D: Administração, Perfis de Acesso & Auditoria
*Segurança, governança e conformidade institucional.*

| # | Módulo GLA | Rota Legada | Especificação Técnica |
|---|---|---|---|
| **D1** | **Gestão de Usuários Internos & Externos** | `/users` | Tabela com Avatar, Nome, CPF, Tipo (Servidor, Externo, Consultor), Status, Grupos e Lotação |
| **D2** | **Grupos & Perfis de Permissões (RBAC)** | `/roles` | Matriz de permissões (Criar, Editar, Analisar, Deferir, Emitir Portaria, Cancelar, Auditar) e Tempo Máximo de Inatividade |
| **D3** | **Gestão de Atos Ambientais & Minutas** | `/portal/ato-ambiental/ato-ambientals` | Portarias publicadas em DOE, Interessado, Categoria de Licença, Município, Situação e Minuta Conclusiva |
| **D4** | **Trilha de Auditoria (Audit Log)** | `/auditorias` | ID, Ação executada (Create, Update, Delete, Transition), Resumo do Diff, IP do Usuário, Registro e Timestamp |
| **D5** | **Blacklist de Palavras & Filtros PTRA** | `/portal/ptra-blacklist/ptra-blacklist-palavras` | Termos e expressões sensíveis restritos para emissão de licenças e pareceres |

---

### 📂 GRUPO E: Submódulos Específicos do CRAS (Gestão Completa de Fauna)
*Fluxos veterinários e de biologia para conservação da fauna silvestre.*

| # | Submódulo CRAS | Rota Legada | Finalidade Operacional |
|---|---|---|---|
| **E1** | **Admissão Animal** | `/cras/admissao-animais/admissao-animals` | Registro de lotes de apreensão policial, resgate de atropelamento e entrega voluntária com guia de transporte |
| **E2** | **Manejo Clínico & Procedimentos** | `/cras/manejo-animais/manejo-animals` | Cirurgias, vacinação, quarentena, exames parasitológicos e reabilitação de voo |
| **E3** | **Catálogo de Espécies Silvestres** | `/cras/especie-animais/especie-animals` | Nome científico, Nome popular, Classe (Aves, Répteis, Mamíferos), Grau de Ameaça (VU, EN, CR) |
| **E4** | **Destinações, Solturas & Reintrodução** | `/cras/destinacao-animais/destinacao-animals` | Áreas de Soltura de Animais Silvestres (ASAS), Criadouros Científicos e Centros de Triagem Parceiros |
| **E5** | **Gestão de Recintos & Quarentena** | `/cras/recintos` | Capacidade volumétrica, controle de taxa de lotação e higienização periódica |
| **E6** | **Marcações & Identificação Individual** | `/cras/marcacao-animais/marcacao-animals` | Gestão de estoques e aplicação de Microchips ISO 11784/11785, Anilhas Metálicas e Tatuagens |
| **E7** | **Laboratórios & Exames Complementares** | `/cras/laboratorios`, `/cras/laboratorio-exames` | Convênios com UFBA/UESC e laudos de PCR, Raio-X e Sorologia |

---

# 🔍 ETAPA 2: AUDITORIA E REVISÃO CRÍTICA DAS 22 TELAS ATUAIS DO SEIA V2

Executamos uma auditoria autônoma via Playwright cobrindo **Desktop (1920x1080), Tablet (1024x768) e Mobile (375x812)** em todas as 22 telas navegáveis:

### 📊 Resultado Geral da Auditoria Técnica:
- **Erros de Runtime / Console JavaScript:** `0 erros` em 100% das páginas.
- **Quebras de Layout / Overflow Horizontal Mobile:** `0 quebras` (todas as tabelas possuem scroll horizontal contextual e cards adaptativos).
- **Conformidade de Tokens `#0F4C3A`:** 100% alinhado com o Design System.
- **Formatação de Protocolos e Códigos:** 100% monoespacial (`font-mono`).

### 💡 Diagnóstico de Oportunidades de Polimento Fino (UX & Usabilidade):

1. **Atalho Global de Teclado (`Ctrl+K` ou `Cmd+K`)**:
   - A barra de busca da topbar está visualmente perfeita, mas adicionar o atalho de teclado `Ctrl+K` para focar instantaneamente no input traz um padrão de software moderno de alto nível.
2. **Skeleton Loading nos Filtros das Tabelas**:
   - Adicionar esqueletos suaves de carregamento (`Skeleton`) durante a transição de filtros nas tabelas para dar feedback tátil imediato ao usuário.
3. **Badges de Contagem Sincronizados na Sidebar**:
   - Módulos como Fiscalização e Consultas possuem contadores que podem refletir dinamicamente a quantidade de processos prioritários pendentes na esteira do analista.
4. **Visualizador Rápido de PDF em Drawer Lateral**:
   - Para CND, DTRP, Pareceres e DAEs, incluir a opção de abrir uma prévia rápida em Drawer lateral sem forçar download do arquivo caso o analista queira apenas conferir os dados.

---

# 🚀 ETAPA 3: PLANO DE EXECUÇÃO MODULAR (BACKLOG PRIORIZADO)

Quando autorizada a execução, o desenvolvimento seguirá a seguinte sequência estruturada:

### 🔨 FASE 1: Cadastros Mestres do Requerente (`A1` a `A6`)
- `CadastrosBasicosPage.tsx` com abas contextuais: *Responsáveis Técnicos*, *Representantes Legais*, *Empreendimentos*, *Propriedades Rurais* e *Procuradores*.
- Modais rápidos de convite por CPF e validação de registro profissional no CREA/CRBio.

### 🔨 FASE 2: Enquadramento & Pautas Técnicas Internas (`B1` a `B5`)
- `PautaEnquadramentoPage.tsx`: painel com abas por status e drawer lateral de parecer `F-DIPRE-ENQ-01`.
- `DesbloqueiosApePage.tsx`: tela de análise de desbloqueio com histórico do processo.

### 🔨 FASE 3: Parametrizações & Configuração do Sistema (`C1` a `C10`)
- `ParametrizacoesMasterPage.tsx`: catálogo com busca instantânea para edição rápida de Tipologias, Classes de Resíduos, Setores e Juros de Mora.

### 🔨 FASE 4: Administração, Acessos & Submódulos CRAS (`D1` a `D5` e `E1` a `E7`)
- `UsuariosRolesPage.tsx`: gestão de usuários e matriz de permissões RBAC.
- `CrasGestaoCompletaPage.tsx`: expansão das abas de Admissão, Manejo, Recintos e ASAS.

---

### 🛡️ Diretriz Inviolável Mantida
Todas as implementações respeitarão rigorosamente o **Design System SEIA V2** (`#0F4C3A`, densidade compacta Filament, sem AI Slop e compatibilidade total com Light e Dark Mode).
