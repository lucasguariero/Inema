# 📋 Fila de Testes para Execução Noturna (Overnight) — GLA Inema

> **Líder de QA**: Lucas Guariero  
> **Ambiente de Testes**: https://gla-inema-hml.acto.com.br/  
> **Modo de Operação**: Aguardando acúmulo de ~5 testes para disparo autônomo contínuo.
> **Diretrizes Estritas de Execução**:
> - 🖱️ **Comportamento 100% de Usuário Real**: Interagir apenas com elementos visíveis na tela (nada de inspecionar elementos ocultos, forçar rotas não mapeadas ou manipular console).
> - 🔒 **Integridade do Sistema**: NUNCA apagar parâmetros mestres nem cadastros pré-existentes de terceiros.
> - 📸 **Regra de Prints**: Zero prints se o teste passar limpo. Print cirúrgico apenas se encontrar erro/divergência.
> - 💬 **Padrão de Parecer**: Texto natural, profissional e direto, sem parecer IA e sem gírias.

---

## 📑 Painel Geral da Fila

| # | Módulo / Título do Card | Status na Fila | Pasta de Evidências |
|---|---|:---:|---|
| **01** | Administração ANSLA: Configuração do Tipo de Atividade x Processos em Tramitação | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-ansla-config-tramitacao/` |
| **02** | SISPASS – Meus Perfis – Cadastro e Gestão de Documentação – UE (MR 296) | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-sispass-meus-perfis/` |
| **03** | SISPASS – Adequação da funcionalidade Meus Calendários Anuais | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-sispass-calendarios-anuais/` |
| **04** | CRF – Incapacidade de Produção de Volume Vinculado ao Crédito de Reposição Florestal | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-crf-incapacidade-producao/` |
| **05** | DTRP – Geração do Resumo do Requerimento em PDF (MR 255) | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-dtrp-resumo-pdf/` |
| **06** | ENQ001 – Enquadramento de Atos e Validação Documental | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-enq001-enquadramento/` |
| **07** | ENQ001 – Análise das Etapas do Requerimento e Tratamento de Pendências (spec 049) | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-enq001-analise-etapas/` |
| **08** | DTRP – Etapa 02: Resíduos Perigosos (Questionário DQC e Caracterização) | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-dtrp-etapa02-residuos/` |
| **09** | Certidão de Débito Ambiental – Processos Finalizados (TL008) | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-certidao-processos-finalizados/` |
| **10** | ENQ001 – Pauta Técnica de Enquadramento e Históricos (spec 048) | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-enq001-pauta-tecnica/` |
| **11** | DAE – Requerente – Acesso e Consulta do Parcelamento (DR003 / TL001 / TL002) | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-dae-parcelamento-consulta/` |
| **12** | Certidão de Débito Ambiental – Análise da Solicitação (TL003 / TL004 / TL005) | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-certidao-analise-solicitacao/` |
| **13** | DAE – Requerente – Solicitação de Parcelamento (Wizard 3 Etapas: TL003–TL005) | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-dae-parcelamento-solicitacao/` |
| **14** | Certidão de Débito Ambiental – Análise do Coordenador (TL006 / TL007) | ✅ HOMOLOGADO (100% PASS) | `qa/cards/card-certidao-analise-coordenador/` |

---

## 🧪 Detalhamento dos Testes

---

### Teste 01: 🧭 Configuração do Tipo de Atividade x Processos em Tramitação — ANSLA

- **Link do Protótipo (Figma)**: [Figma - ANSLA Administração (Node 3371-5093)](https://www.figma.com/design/LiFgbupBamKUnN9EtkF7uc/INEMA---Atividade-N%C3%A3o-Sujeitas-ao-Licenciamento-Ambiental?node-id=3371-5093&p=f&t=1Lga3ymhGDF03RFw-0)
- **Documento de Requisitos Relacionado**: `DR005 - Módulo Administrativo - Atividades Não Sujeitas ao Licenciamento Ambiental` (Páginas 1 a 15)
- **Módulo no Sistema**: `Administração › Tipos de Atividade Não Sujeita a Licenciamento Ambiental` (`https://gla-inema-hml.acto.com.br/tipo-atividade-ansla/tipo-atividade-anslas`)
- **Perfis Envolvidos**:
  - Administrador: `000.000.000-00` / `admin123`
  - Analistas / Setores Responsáveis (Pauta Geral / Pauta Técnica)
  - Requerente: para abertura e envio de processos

#### 📌 Regras de Negócio Confirmadas pelo Negócio:
1. **Regra de Congelamento (Processos em Andamento)**:
   - Alterações no cadastro administrativo (documentos exigidos, instruções, setores vinculados) **SÓ devem refletir em processos novos** (que ainda não foram enviados para tramitação).
   - Processos que já estão tramitando mantêm a configuração com a qual foram protocolados (congelam a configuração).
2. **Mudança / Remoção de Setor Responsável**:
   - Caso um setor seja alterado ou removido no cadastro administrativo, os processos que já estavam na pauta desse setor **continuam na pauta do setor de origem até que este finalize a análise**.
   - Apenas os novos processos enviados após a alteração cairão na pauta do novo setor cadastrado.
3. **Ordem de Análise de Setores**:
   - A ordem de análise é **SEMPRE ESTRITAMENTE SEQUENCIAL** (1 setor por posição na fila: Setor 1 → Setor 2 → Setor 3). Não existe análise concorrente/paralela na mesma posição de ordem.

#### 🎯 Cenários de Teste a Executar:
1. **Cenário 1 — Fidelidade Visual ao Figma (Telas TL001 a TL005)**:
   - Acessar `Administração › Tipos de Atividade ANSLA`.
   - Comparar a listagem com o Figma: colunas (Código, Descrição, Situação, Ações).
   - Abrir o formulário de cadastro/edição e validar as 4 abas previstas no Figma:
     - Aba 1: `Criar Atividade Não Sujeitas` (Nome, Situação Ativo/Inativo);
     - Aba 2: `Criar Instruções` (Editor de texto rico);
     - Aba 3: `Documentos e Estudos` (Modal de adicionar documentos, botão de exclusão de vínculo);
     - Aba 4: `Setor` (Modal de adicionar setor com definição de Ordem de Análise sequencial).
2. **Cenário 2 — Ordem de Análise Estritamente Sequencial**:
   - Na aba Setor, tentar vincular dois setores na mesma posição de ordem.
   - Validar se o sistema força a numeração sequencial (1, 2, 3...) ou bloqueia duplicidade de ordem.
3. **Cenário 3 — Regra de Congelamento de Configuração**:
   - Identificar um processo que já esteja em tramitação na pauta de um setor.
   - Realizar uma alteração administrativa no Tipo de Atividade (ex.: adicionar um documento opcional/exigido ou alterar instruções).
   - Conferir se o processo já em tramitação permanece intacto na pauta do setor responsável original, sem sofrer impacto retroativo.
   - Criar um novo requerimento para a mesma atividade e confirmar se este novo processo assume as novas parametrizações.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-ansla-config-tramitacao/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver divergência de tela ou quebra)
- `prints/`

---

### Teste 02: 🦜 SISPASS – Meus Perfis – Cadastro e Gestão de Documentação – UE

- **Merge Request / PR**: [MR 296](https://git.acto.com.br/inema/inema/-/merge_requests/296) (Dev: Matheus Ariel)
- **Módulo no Sistema**:
  - Usuário Externo: `SISPASS › Meus Perfis › Cadastrar Novo Perfil` (`https://gla-inema-hml.acto.com.br/meus-perfis`)
  - Analista Interno: `SISPASS › Pauta Geral de Perfis` (`https://gla-inema-hml.acto.com.br/validar-documentos`)
- **Perfis de Teste**:
  - Requerente / Usuário Externo (Pessoa Física com vínculos PJ / Responsável Técnico)
  - Analista SISPASS / Admin

#### 📌 Regras de Negócio e Definições Alinhadas:
1. **Item 7 (CNPJ)**:
   - No perfil **Associação**, a seleção de CNPJ foi **mantida** (campo chamado apenas `CNPJ *`), oferecendo apenas os CNPJs vinculados ao CPF do requerente. A "Titularidade" foi removida.
2. **Itens 5 e 6 (Rótulos do Comprovante de Residência)**:
   - Para **Criador Amador**: `"Comprovante de residência, expedido nos últimos 60 (sessenta) dias"`.
   - Para **Associação**: `"Comprovante de residência, expedido nos últimos 60 (sessenta) dias"`.
   - Para **Criador Comercial**: `"Comprovante de Residência, expedido nos últimos 60 (sessenta) dias, do representante legal."`.
3. **Catálogo & Documentos em Tabela (Item 1)**:
   - Uploads individuais foram substituídos por tabela com colunas: `Nome do Documento` | `Situação` | `Ações` (Visualizar, Baixar, Excluir).
   - O upload acontece em modal/janela ao clicar no botão de anexar. Não há drag-and-drop ("Arraste e solte").
4. **Documento de Identificação Pessoal (Item 2)**:
   - Nenhum perfil pede anexo de "Documento oficial de identificação com foto e CPF", "CPF" ou "RG". Os dados são recuperados automaticamente do Cadastro Básico da Pessoa (inclusive representante legal PJ).
5. **Criador Amador (Itens 3 e 4)**:
   - Campo "Responsável Técnico" **removido**.
   - Campo de coordenadas renomeado para: `"Longitude da Entrada do Criadouro"` (junto com Latitude da Entrada do Criadouro).
   - Documento único: Comprovante de residência nos últimos 60 dias.
6. **Criador Comercial (Item 6)**:
   - Exatamente 5 documentos na tabela:
     1. Alvará de localização e funcionamento fornecido pelo órgão municipal;
     2. Autorização de uso e manejo de fauna;
     3. Contrato social;
     4. Documento de Identificação com foto e CPF, do representante legal;
     5. Comprovante de Residência, expedido nos últimos 60 (sessenta) dias, do representante legal.
   - Os 2 documentos de Responsável Técnico foram retirados da lista de anexos do criador comercial.
7. **Associação de Passeriformes / Torneios (Itens 7, 8 e 9)**:
   - Formulário em 2 Etapas (`Etapa 1` e `Etapa 2`):
     - `Etapa 1`: Tipo de Perfil, CNPJ *, Responsável Técnico *, CTF *. Anexar os documentos obrigatórios e clicar em "Próximo".
     - `Etapa 2`: Cadastro de Associados liberado. Campo `CPF do Associado *` e botão `+ Adicionar`. Tabela lista Nome/Razão Social, CPF/CNPJ, CTF, Ano Licença, Situação do vínculo e Ação de excluir.
   - Erro 500 eliminado na finalização da Associação e na limpeza de campos. Operação atômica (ou grava tudo ou não grava nada).

#### 🎯 Cenários de Teste a Executar:
1. **Cenário 1 — Perfil Responsável Técnico**:
   - Entrar em `Meus Perfis › Cadastrar Novo Perfil` e escolher "Responsável Técnico".
   - Conferir campo CRMV * e tabela com exatamente os 2 documentos:
     - Carteirinha do Conselho Regional de Medicina Veterinária – CRMV;
     - Certidão Negativa emitida pelo CRMV.
2. **Cenário 2 — Perfil Criador Amador**:
   - Selecionar "Criador amador de passeriformes/Homologações".
   - Validar: CTF *, Latitude e Longitude da Entrada do Criadouro.
   - Validar ausência do campo "Responsável Técnico".
   - Conferir documento único de Comprovante de residência nos últimos 60 dias.
3. **Cenário 3 — Perfil Criador Comercial**:
   - Selecionar "Criador comercial de passeriformes/Exposições".
   - Validar campos: Responsável Técnico, Titularidade, CNPJ, CTF.
   - Validar na tabela a presença exata dos 5 documentos (sem documentos de RT).
4. **Cenário 4 — Perfil Associação (Fluxo Completo de 2 Etapas)**:
   - Selecionar "Associação de passeriforme/Torneios".
   - Validar: sem campo Titularidade; presença do campo CNPJ com listagem de vínculos válidos.
   - Anexar os documentos da Etapa 1 e clicar em Próximo.
   - Validar habilitação da Etapa 2 (Cadastro de Associados).
   - Inserir CPF de criador amador deferido, adicionar na tabela e clicar em "Enviar Para Validação".
   - Conferir ausência de erro 500 e transição correta de status.
5. **Cenário 5 — Cenários Negativos de Validação**:
   - Tentar enviar sem anexar documento obrigatório → validar bloqueio com aviso em tela.
   - Informar CTF com menos de 7 dígitos → validar máscara/bloqueio.
   - Tentar associar CPF que não possui cadastro de criador amador deferido → validar recusa do sistema.
   - Tentar reenviar após correção → validar que não ocorre o erro de "já possui uma documentação cadastrada".
6. **Cenário 6 — Visão do Analista (SISPASS › Pauta Geral de Perfis)**:
   - Entrar com perfil analista/admin em `SISPASS › Pauta Geral de Perfis`.
   - Abrir o perfil submetido e validar a seção "Documento de Identificação (Cadastro Básico da Pessoa)", confirmando que os dados do requerente e do RT são carregados do cadastro básico sem necessidade de anexo avulso.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-sispass-meus-perfis/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver falha)
- `prints/`

---

### Teste 03: 📅 SISPASS – Adequação da funcionalidade Meus Calendários Anuais

- **Link do Protótipo (Figma)**: [Figma - SISPASS Calendários Anuais (Node 386-1908)](https://www.figma.com/design/CVKLSZQWH5rehf1fe3e6gq/SISPASS?node-id=386-1908&t=6GIcdEhmYiB6rXvk-1)
- **Módulo no Sistema**:
  - Requerente / Associação: `SISPASS › Meus Calendários Anuais` (`https://gla-inema-hml.acto.com.br/calendario-anual`)
  - Analista Interno: `SISPASS › Validar Calendário Anual` (`https://gla-inema-hml.acto.com.br/validacao-calendario-anual`)
- **Devs / Autores**: Eduardo Piasson / Matheus / Lucas Guariero

#### 📌 Regras de Negócio e Mudança de Escopo:
1. **RN01 – Nomenclatura da Coluna de Fotos**:
   - Na listagem de fotos/arquivos do evento, a coluna deve se chamar obrigatoriamente: `"Fotos a serem anexadas"` (substituindo o antigo "Nome do Documento").
   - Ações mantidas por linha: Visualizar, Download e Excluir.
2. **RN02 – Histórico de Tramitação (Visão do Usuário Externo)**:
   - O campo/coluna **"Analista Responsável" deve ser REMOVIDO** do modal de Histórico de Tramitação no perfil do usuário externo.
   - O histórico deve exibir exclusivamente: `Data/Hora`, `Endereço`, `Resultado`, `Justificativa` e `Visualizar Laudo Técnico`.
3. **RN03 & RN04 – Identificação do Local e Preenchimento Automático do Laudo Técnico**:
   - A identificação do local utilizada na geração do Laudo Técnico deve considerar obrigatoriamente o **Ponto de Referência** no formato: `Nome do Local do Evento - Ponto de referência`.
4. **Mudança de Escopo — Análise por Endereço (Decisão Mestre-Detalhe)**:
   - Na grid de endereços do cadastro/edição, inclusão de duas novas colunas:
     - `Laudo Técnico`: ícone para visualização do laudo técnico anexado e vinculado ao respectivo endereço.
     - `Situação`: apresenta a situação da análise do endereço (`Pendente` antes da análise; `Aprovado` ou `Recusado` após decisão do analista).
   - Tela interna `"Validar Calendário Anual"`: reformulada para mestre-detalhe (analista seleciona o endereço, confere os dados e aprova/reprova individualmente com justificativa).
   - Botão `"Finalizar Análise"`: regra de rollup (Deferido somente se todos os endereços forem aprovados; Indeferido se algum for recusado).
   - Cadastro externo: formulário em etapa única com endereços adicionados incrementalmente.
5. **Correções de Layout e Validações Pendentes**:
   - Seção de Espécies integrada aos campos do lado esquerdo (sem divisão visual isolada no lado direito).
   - Campos de anexo de documentos listados dentro de tabela (padrão Flora).
   - Campos de endereço com `*` de obrigatório conforme protótipo do Figma.
   - O botão "Adicionar" do endereço deve ficar posicionado **APÓS** o campo de anexo do Laudo Técnico Assinado (não permitindo registrar endereço/calendário sem o laudo técnico).
   - Correção do erro ao salvar quando já existe endereço cadastrado (não retornar falsamente que não existe endereço).

#### 🎯 Cenários de Teste a Executar:
1. **Cenário 1 — Nomenclatura e Layout de Fotos (Figma Node 386-1908)**:
   - Acessar `SISPASS › Meus Calendários Anuais › Cadastrar Calendário`.
   - Validar a seção de espécies integrada no fluxo à esquerda.
   - Validar a coluna de fotos do evento com o nome exato: `"Fotos a serem anexadas"`.
   - Garantir que a expressão antiga "Nome do Documento" não aparece em nenhum componente da lista.
2. **Cenário 2 — Cadastro de Endereços, Laudo Técnico e Obrigatoriedades**:
   - Conferir asteriscos `*` de obrigatoriedade nos campos de endereço.
   - Validar que o botão "Adicionar" está posicionado após o anexo do Laudo Técnico Assinado.
   - Tentar adicionar o endereço sem anexar o Laudo Técnico → validar bloqueio.
   - Anexar o laudo, preencher Nome do Local e Ponto de Referência e adicionar o endereço.
   - Conferir na grid de endereços: coluna `Laudo Técnico` com ícone clicável de visualização e coluna `Situação` com valor `Pendente`.
3. **Cenário 3 — Histórico de Tramitação sem Analista Responsável**:
   - Abrir o modal de Histórico de Tramitação do calendário.
   - Validar que as colunas exibidas são apenas: `Data/Hora`, `Endereço`, `Resultado`, `Justificativa`, `Visualizar Laudo Técnico`.
   - Confirmar a ausência total do nome ou campo do `Analista Responsável`.
4. **Cenário 4 — Geração do Laudo Técnico com Ponto de Referência**:
   - Acionar a geração ou visualização do Laudo Técnico automático.
   - Conferir se o campo de identificação do local contém: `Nome do Local do Evento - Ponto de referência`.
5. **Cenário 5 — Análise Interna por Endereço (SISPASS › Validar Calendário Anual)**:
   - Acessar com perfil de Analista a tela `Validar Calendário Anual`.
   - Validar comportamento mestre-detalhe por endereço: aprovar um endereço e reprovar outro.
   - Acionar "Finalizar Análise" e validar o rollup do resultado final do calendário.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-sispass-calendarios-anuais/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver erro)
- `prints/`

---

### Teste 04: 🌲 CRF – Incapacidade de Produção de Volume Vinculado ao Crédito de Reposição Florestal

- **Módulo no Sistema**: `Reposição Florestal › Reposição Florestal` (`https://gla-inema-hml.acto.com.br/reposicao-florestal/reposicao-florestals` ou `Iniciar Requerimento` › Reposição Florestal)
- **Perfil de Acesso Obrigatório**:
  - Usuário: **Admin INEMA** (CPF `000.000.000-00` / `admin123`)
  - *Motivo*: O crédito está vinculado diretamente ao solicitante Admin. Se logar com outro usuário, o campo de crédito ficará vazio (comportamento correto do sistema).
- **Massa de Dados Pré-Homologada**:
  - Requerimento de Crédito: nº `2026.000005`
  - Saldo Disponível: `500 m³`
  - Imóvel Vinculado: `Fazenda São João - Gleba A`
  - Status na listagem: `Rascunho` (comportamento esperado: a busca é habilitada pelo indicador interno de "crédito definitivo", não pelo status da listagem).

#### 📌 Regras de Negócio e Base de Cálculo (Art. 51 do Decreto nº 15.180/2014):
1. **Fórmula de Cálculo da Regularização**:
   - Valor Unitário Base: `R$ 18,00 / m³`.
   - Adicional do Art. 51: `20%` sobre o valor base.
   - **Exemplo de Cálculo para 100 m³**:
     - Valor Base: `100 m³ * R$ 18,00 = R$ 1.800,00`
     - Adicional 20%: `R$ 1.800,00 * 0,20 = R$ 360,00`
     - Valor Total Devido ao FERFA: `R$ 2.160,00`.
2. **Regra de Unicidade dos 20%**:
   - Caso seja criado um segundo requerimento utilizando o saldo remanescente do mesmo crédito, o saldo deve ser debitado corretamente e **o adicional de 20% NÃO deve incidir novamente** (aplica-se apenas uma vez por crédito).
3. **Modalidades de Cumprimento (RNG001 & RNG002)**:
   - Exclusivamente: Crédito de Reposição Florestal (CRF), Participação em Projetos de Fomento Florestal e Recolhimento pecuniário ao FERFA.
   - A modalidade "Participação em Projetos de Fomento Florestal" deve aparecer na tela, porém desabilitada (habilitação exclusiva por parametrização).
4. **Campos Read-Only em Branco (Comportamento Esperado)**:
   - Os campos `Portaria` e `Processo Administrativo` permanecem vazios por padrão (são somente leitura), pois o fluxo de Reserva Futura não coleta esses dados. Não apontar como bug.

#### 🎯 Cenários de Teste a Executar:
1. **Cenário 1 — Fluxo Principal do Requerimento**:
   - **Passo 1**: Selecionar "Quem sou eu? → Requerente" + Empreendimento `DTRP Demonstração`.
   - **Passo 2**: Marcar a opção `"Incapacidade de produção de volume de produto florestal vinculado ao crédito de reposição florestal"` e selecionar Grande Consumidor = `"Não"`.
   - **Passo 3**: No campo de busca, pesquisar por `000005` e selecionar o crédito `2026.000005`. Anexar os documentos técnicos obrigatórios: Relatório Comprobatório e ART (arquivos PDF até 10 MB).
   - **Passo 4**: Conferir o saldo exibido de `500 m³`. Informar o volume não produzido (ex.: `100 m³`) e preencher o motivo da incapacidade.
   - **Passo 5**: Validar a memória de cálculo (`R$ 2.160,00`), aceitar a declaração de veracidade das informações e acionar o botão de finalizar.
2. **Cenário 2 — Validação de Limites de Volume (Cenário Negativo)**:
   - Testar informar Volume maior que o saldo (`Volume > 500 m³`) → validar que o sistema bloqueia o avanço.
   - Testar informar Volume zero ou negativo (`Volume <= 0`) → validar bloqueio com mensagem de valor inválido.
3. **Cenário 3 — Bloqueio sem Declaração de Veracidade ou sem PDFs**:
   - Tentar finalizar sem marcar a declaração de veracidade → validar disparo de `MSG006` (*"É necessário declarar ciência sobre a veracidade das informações para finalizar o requerimento."*).
   - Tentar finalizar sem anexar o Relatório Comprobatório ou a ART → validar disparo de `MSG012` (*"Há documentos obrigatórios não enviados. Verifique os documentos pendentes antes de finalizar."*).
4. **Cenário 4 — Segundo Requerimento e Regra de Débito de Saldo**:
   - Abrir novo requerimento buscando o mesmo crédito `2026.000005`.
   - Conferir se o saldo foi debitado (ex.: `500 m³ - 100 m³ = 400 m³`).
   - Informar novo volume não produzido e conferir se os 20% do Art. 51 **não incidiram novamente**.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-crf-incapacidade-producao/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver erro)
- `prints/`

---

### Teste 05: 📄 DTRP – Geração do Resumo do Requerimento em PDF

- **Link do Protótipo (Figma)**: [Figma - DTRP Resumo PDF (Node 119-9846)](https://www.figma.com/design/AMKTzGfzcfkVB4Bj79JCg5/INEMA---Regula%C3%A7%C3%A3o--apresenta%C3%A7%C3%A3o-?node-id=119-9846&t=sIEBqaeQjwnkCvfK-1)
- **Merge Request / PR**: [MR 255](https://git.acto.com.br/inema/inema/-/merge_requests/255) (Dev: Daniela Vargas)
- **Módulo no Sistema**: `Declaração de Transportes › Requerimentos` (`https://gla-inema-hml.acto.com.br/dtrp-requerimento/dtrp-requerimentos` ou `Iniciar Requerimento` › DTRP)
- **Documento de Referência**: PDF oficial do SEIA/INEMA com espelho completo da DTRP (`2026.002.000002/INEMA/REQ`).

#### 📌 Regras de Negócio e Requisitos de Layout (RNG-026 a RNG-038):
1. **RNG-026 & RNG-029 – Fidelidade Integral ao Cadastro**:
   - O documento em PDF gerado deve consolidar 100% das informações das 3 etapas do requerimento exatamente como gravadas no momento da finalização.
2. **RNG-027 & RNG-028 – Suporte a Múltiplos Registros e Caracterização**:
   - O PDF deve suportar a exibição de **múltiplos endereços de pontos de geração/coleta** (com coordenadas geográficas Lat/Long, logradouro, bairro, CEP e ID do gerador).
   - O PDF deve suportar **múltiplas empresas transportadoras** (Nome/Razão Social, CNPJ, processo/órgão emissor).
   - O PDF deve suportar **múltiplos resíduos transportados**, apresentando individualmente cada resíduo acompanhado de sua respectiva caracterização na tabela da Página 2:
     - `Código / Resíduo` | `Periculosidade` (ex: Classe I - Perigoso) | `Quantidade (t/ano)` | `Estado físico` (Líquido, Gases, Sólido) | `Acondicionamento` | `Veículo`.
3. **RNG-030 – Identificação Institucional e Rastreabilidade**:
   - Cabeçalho institucional do Governo da Bahia / INEMA.
   - Título oficial: `"Resumo da DTRP"` e subtítulo com a numeração no padrão SEIA: `"Declaração de Transporte de Resíduos Perigosos · [Número]/INEMA/REQ"`.
   - Seção de Identificação: Nº do Requerimento SEIA, Status, Finalizado em (data/hora), Validade da DTRP (*"Contada da emissão oficial"*), Chave única de rastreamento (UUID).
4. **Tratamento, Disposição e SINIR**:
   - Tratamentos/Disposições selecionados (ex.: Armazenamento, Processamento a Plasma Térmico, Reprocessamento de solventes), indicando se possui cadastro no SINIR e comprovante aplicável.
5. **Declaração de Conformidade e Auditoria de Aceite**:
   - Exibição integral do texto de responsabilidade legal aceito pelo usuário.
   - Tabela de auditoria: Aceite (*"Aceito eletronicamente"*), Usuário responsável (login/nome) e Data e hora do aceite.
   - Rodapé padrão em todas as páginas: `SEIA/INEMA · Documento gerado em [data hora] · Chave: [UUID] · Página X`.
6. **RNG-038 – Disponibilidade de Download**:
   - Botão ou link de visualização e download do Resumo do Requerimento em PDF disponível na tela de acompanhamento/visualização após a finalização do processo.

#### 🎯 Cenários de Teste a Executar:
1. **Cenário 1 — Finalização de DTRP com Múltiplos Elementos**:
   - Acessar o fluxo de DTRP.
   - Cadastrar um requerimento contendo:
     - Ao menos 2 pontos de geração/coleta com coordenadas geográficas;
     - Ao menos 2 transportadoras autorizadas;
     - Ao menos 2 resíduos perigosos distintos com caracterizações completas (ex.: D002 corrosivo e D004 tóxico);
     - Seleções de tratamento/disposição final e declaração de aceite confirmada.
   - Finalizar o requerimento e conferir a geração do protocolo no padrão SEIA.
2. **Cenário 2 — Disponibilidade e Download do PDF**:
   - Na tela de visualização do requerimento finalizado, acionar a opção de gerar/baixar o "Resumo do Requerimento".
   - Conferir se o arquivo PDF é gerado e baixado sem erro (HTTP 200, content-type `application/pdf`).
3. **Cenário 3 — Auditoria Visual e Textual do PDF (Confronto com Figma & PDF Modelo)**:
   - Extrair o conteúdo do PDF gerado e comparar com o modelo institucional:
     - Cabeçalho institucional e título Resumo da DTRP;
     - Chave UUID de rastreabilidade presente;
     - Dados completos do requerente e empreendimento destinatário;
     - Tabela de resíduos com as colunas completas e valores corretos;
     - Texto da Declaração de Conformidade e dados de aceite eletrônico com data/hora e usuário;
     - Rodapé com numeração de páginas e identificação SEIA/INEMA.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-dtrp-resumo-pdf/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver erro)
- `prints/`


---

### Teste 06: ⚖️ ENQ001 – Implementar Enquadramento de Atos e Validação Documental

- **Documento de Requisitos (PDF)**: `DOR-ENQ001 Enquadramento v1.4` (78 páginas)
- **Módulo no Sistema**: `Enquadramento / Pauta Técnica / Pauta da Área` (`https://gla-inema-hml.acto.com.br/`)
- **Atores e Perfis de Acesso**:
  - Técnico ATEND: `000.000.000-00` / `admin123` (ou usuário com perfil técnico de atendimento)
  - Coordenador ATEND: `111.111.111-11` / `gestor123`
  - Requerente (Usuário Externo): para acompanhamento, pagamento de taxa e envio de documentação complementar
- **Telas Principais Envolvidas**:
  - `TL001` / `TL002`: Pauta da Área - Enquadramento (`Aguardando Enquadramento`, distribuição e retenção)
  - `TL003`: Pauta Técnica - Enquadramento (`Aguardando`, `Em Análise`, `Aguardando Validação Prévia`, `Em Validação`, `Pendências`)
  - `TL009`: Efetuar Enquadramento – 5ª Aba: **"Enquadramento"** (Campos C280 a C316)
  - Modal `Documentos Vinculados` (Campos C317 a C327)
  - `TL010`: Analisar Documentação (Campos C328 a C347)

#### 📌 Regras de Negócio e Pontos Críticos do Enquadramento (Spec 050):
1. **Catálogo de Atos Ambientais (~30 atos)**:
   - Semeado com fórmulas de cálculo de taxa (fixo, por área, por unidade, por faixa, por classe/grupo) e relação de documentos exigidos (Portaria INEMA nº 11.292/2016).
2. **5ª Aba "Enquadramento" (no fluxo de Efetuar Enquadramento)**:
   - Apresenta seção de **Atos Recomendados** (sugestivos e não vinculantes, com rastreabilidade da pergunta/resposta que originou a sugestão).
   - Permite **busca e seleção manual de atos ambientais** adicionais.
   - **Obrigatoriedade de Ato Principal (RNG-016 / RNG-069)**: Deve possuir **exatamente 1 ato principal** definido. O sistema bloqueia a finalização se houver 0 ou mais de 1 ato principal.
   - **Competência Municipal por Ato (RNG-025 a RNG-027 / RNG-065 e RNG-066)**:
     - Checkbox por ato indicando competência municipal.
     - Ato municipal NÃO entra na cobrança estadual, NÃO exige envio de documentos ao INEMA e NÃO vai para validação prévia estadual.
     - Se **todos** os atos forem municipais: encerra/cancela o fluxo no INEMA sem cobrança e notifica o requerente.
     - Se **parte** dos atos for municipal: segue o fluxo estadual apenas para os atos do INEMA.
   - **Modal "Documentos Vinculados"**:
     - Cada ato enquadrado tem sua própria lista de documentos.
     - Carrega documentos obrigatórios parametrizados e permite adicionar documentos complementares.
     - Ao excluir um ato, remove documentos vinculados exclusivamente a ele (RNG-020).
   - **Informações de Pagamento e Taxas (RNG-077 a RNG-092)**:
     - Cálculo automático: soma das taxas dos atos + taxa de publicação de R$ 500,00 quando aplicável.
     - Benefício tarifário: solicitação é declaratória (RNG-021) e exige decisão explícita da ATEND antes de finalizar (conceder/não conceder/complementar).
     - Checkbox "Aplicar isenção de taxa" para usuário autorizado.
   - **Modal "Definir Destino dos Atos" (RNG-029 a RNG-032)**:
     - Antes da conclusão, abre modal para definir a coordenação/área responsável por cada ato (com sugestão automática orientativa).
     - Destino é obrigatório para todos os atos estaduais.
   - **Finalização do Enquadramento**:
     - Atualiza status para **"Enquadrado"** e gera o DAE/boleto.
3. **Validação Documental — Tela "Analisar Documentação" (TL010)**:
   - Disponibilizada após confirmação automática do pagamento via SEFAZ e envio dos documentos pelo requerente (Status: **"Aguardando Validação Prévia"** → ao abrir: **"Em Validação Prévia"**).
   - Lista consolidada de documentos de ambas as origens: (1) Requerimento original e (2) Enviados pós-enquadramento.
   - Decisão individual por documento: **Aprovar** ou **Reprovar** (com justificativa individual obrigatória por item reprovado - RNG-038 / MSG004).
   - Reprovação gera status **"Pendência de Validação"** liberando apenas os reprovados para substituição pelo requerente (sem novo boleto).
   - Quando 100% dos documentos forem aprovados, o status atualiza para **"Validado"**.
4. **Formação do Processo Administrativo (RNG-043 a RNG-047)**:
   - Gera número oficial na máscara: `AAAA.NNN.NNNNNN/INEMA/SIGLA_DO_ATO-NNNNN` (ex: `2026.001.000878/INEMA/LIC-00878`).
   - Atualiza status para **"Processo Formado"** (bloqueia cancelamento).
   - Encaminha cada ato para a coordenação/área definida no enquadramento (com o ato principal como referência de liderança).

#### 🎯 Cenários de Teste a Executar:
- **Cenário 1 — Pauta da Área / Pauta Técnica e Aba Enquadramento (TL001 a TL009)**:
  - Validar recebimento do requerimento, retenção e início do enquadramento (status transita para "Sendo Enquadrado").
  - Na 5ª aba Enquadramento, testar atos recomendados e adição manual de atos.
  - Testar validação de Ato Principal: tentar finalizar sem ato principal ou com mais de 1 (deve bloquear com MSG033).
  - Testar Modal de Documentos Vinculados: inclusão e exclusão de atos e documentos exclusivos.
- **Cenário 2 — Competência Municipal**:
  - Testar marcação de ato municipal em requerimento misto (taxa estadual não soma o ato municipal).
  - Testar requerimento com 100% dos atos municipais (encerramento do fluxo no INEMA sem cobrança).
- **Cenário 3 — Cálculos de Taxas e Benefício Tarifário**:
  - Conferir fórmulas de taxas (PPV 30%, APE por hectare, perfuração de poço R$ 1.000, taxa de publicação R$ 500).
  - Tentar finalizar com benefício tarifário pendente de decisão (bloqueio com MSG047).
  - Aplicar decisão e validar recálculo em tempo real.
- **Cenário 4 — Modal Destino dos Atos e Finalização**:
  - Acionar Finalizar Enquadramento → validar abertura do modal "Definir Destino dos Atos".
  - Confirmar destinos e validar transição de status para "Enquadrado".
- **Cenário 5 — Tela Analisar Documentação (TL010) e Pendência**:
  - Iniciar validação documental (status "Em Validação Prévia").
  - Testar reprovação de documento sem justificativa (bloqueio com MSG004).
  - Reprovar com justificativa individual → validar status "Pendência de Validação".
  - Aprovar 100% dos documentos → validar status "Validado".
- **Cenário 6 — Formação do Processo Administrativo**:
  - Concluir validação e acionar formação do processo.
  - Validar geração do número institucional do processo na máscara oficial (`.../INEMA/SIGLA-NNNNN`).
  - Validar status "Processo Formado" e encaminhamento aos setores responsáveis.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-enq001-enquadramento/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver divergência ou erro)
- `prints/`

---

### Teste 07: 📝 ENQ001 – Efetuar Enquadramento – Análise das Etapas e Tratamento de Pendências (Spec 049)

- **Documento de Requisitos / Spec**: Spec 049 (Páginas 41–57)
- **Módulo no Sistema**: `Pauta da Área → Pauta Técnica → Efetuar Enquadramento` (`https://gla-inema-hml.acto.com.br/`)
- **Telas no Escopo**:
  - `TL005` – Identificação
  - `TL006` – Tipo de Solicitação
  - `TL007` – Localização (Empreendimento / Imóvel e Geoespacial)
  - `TL008` – Questionário Vinculado ao Ato
  - `TL008-Detalhe` – Detalhe de Documentos Rejeitados (Págs. 53–55)
  - `Modal C270` – Modal de Rejeição de Itens do Requerimento (Págs. 56–57)
- **Perfis Envolvidos**:
  - Usuário Interno / Técnico ATEND: `000.000.000-00` / `admin123`
  - Requerente / Usuário Externo: para cumprimento e saneamento das pendências

#### 📌 Regras de Negócio e Pontos Críticos (Spec 049):
1. **Transição de Status & Bloqueio Paralelo (RNG-002 / RNG-007)**:
   - Ao clicar em "Efetuar Enquadramento", o status transita para **"Sendo Enquadrado"**.
   - O usuário externo fica com a edição bloqueada enquanto o técnico estiver analisando.
2. **Cabeçalho Fixo Informativo (C144–C153)**:
   - Exibe fixamente em todas as abas: Nº Requerimento, Nº Processo ("Não formado" até virar processo), CPF/CNPJ, Razão Social, Empreendimento, CEFIR/CAR, Atos Vinculados, Município e Representante/Procurador.
3. **Análise das 4 Etapas Iniciais em Somente-Leitura (RNG-008)**:
   - `01. Identificação`: dados cadastrais, perfil em "Quem sou eu?" (Requerente, Representante Legal PJ, Procurador PF/PJ), dados do representado e contato.
   - `02. Tipo de Solicitação`: regularização ambiental ou atos declaratórios com texto explicativo/ajuda.
   - `03. Localização`: tipo de vínculo (Empreendimento / Imóvel Rural), zona, coordenadas, área, endereço, mapa com camada de geometria geoespacial e documentos vinculados.
   - `04. Questionário`: navegação de etapas internas dinâmicas, perguntas e respostas preenchidas pelo requerente.
4. **Reprovação Item a Item com Justificativa Obrigatória (RNG-009 / MSG004)**:
   - O técnico pode **Aprovar** ou **Reprovar** cada etapa.
   - A reprovação exige selecionar os itens específicos reprovados e preencher **justificativa individual para cada um**. Bloqueia justificativa genérica.
5. **Geração de Pendência e Edição Restrita (RNG-010 / RNG-011 / MSG035)**:
   - Ao concluir a reprovação, o status transita para **"Pendência de Enquadramento"**.
   - O requerente é notificado (MSG035) com a lista exata do que foi reprovado e o motivo.
   - Na tela de correção do requerente, **APENAS os campos explicitamente reprovados ficam editáveis**; o restante do requerimento permanece totalmente travado.
6. **Regra Específica de Correção de Localização (RNG-011)**:
   - Se a pendência for de Localização (dados cadastrais/geometria), a correção **NÃO é feita diretamente no formulário do requerimento**.
   - O requerente deve acessar o módulo de **Cadastro do Empreendimento** vinculado, aplicar a alteração e retornar ao requerimento. O sistema recarrega automaticamente os dados atualizados.
7. **Documentos Vinculados nesta Etapa (RNG-008 / C221–C223 / C235–C237)**:
   - Disponibilizados nesta fase **apenas para visualização e download**. A análise formal de aprovação/reprovação documental ocorre no CARD 4 (Validação Prévia pós-pagamento).
8. **Persistência da Análise e Histórico (RNG-012 / RNG-048 / MSG015 / MSG023)**:
   - Os dados analisados persistem na navegação (Anterior/Próximo) e entre sessões.
   - Ao salvar a etapa, emite confirmação de sucesso MSG023. Se tentar sair com alterações não salvas, alerta via MSG015.
   - Histórico de tramitações rastreia todas as idas e vindas entre técnico e requerente.

#### 🎯 Cenários de Teste a Executar:
- **Cenário 01 — Acesso, Identificação e Tipo de Solicitação**: Iniciar enquadramento (status "Sendo Enquadrado", bloqueio externo, cabeçalho fixo com "Não formado", dados de representação e contato).
- **Cenário 02 — Localização e Correção via Cadastro do Empreendimento**: Visualizar mapa geoespacial e documentos; reprovar item de localização; verificar bloqueio de edição direta e atualização automática após ajuste no cadastro do empreendimento.
- **Cenário 03 — Questionário Dinâmico e Reprovação Parcial**: Navegar pelas perguntas/respostas; aprovar etapa; reprovar perguntas específicas mantendo outras válidas.
- **Cenário 04 — Justificativa Individual e Atendimento da Pendência**: Tentar reprovar sem justificativa individual (bloqueio MSG004); concluir reprovação (status "Pendência de Enquadramento"); validar que requerente só edita campos reprovados e reenvio volta para ATEND (MSG038).
- **Cenário 05 — Navegação, Validações e Persistência**: Navegar entre abas Anterior/Próximo; alerta de saída sem salvar (MSG015); persistência das decisões salvas (MSG023).
- **Cenário 06 — Detalhe Documental e Histórico de Pendências**: Conferir tabela de anexos e declarações (C248–C269) e rastreabilidade no Histórico de Tramitações.
- **Cenário 07 — Bloqueio de Finalização Incompleta**: Tentar finalizar enquadramento sem avaliar etapas obrigatórias ou com reprovações pendentes (bloqueio com MSG008).

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-enq001-analise-etapas/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver divergência ou erro)
- `prints/`

---

### Teste 08: ☣️ DTRP – Etapa 02: Resíduos Perigosos (Questionário DQC e Caracterização)

- **Link do Protótipo (Figma)**: [Figma - DTRP Apresentação (Node 119-9846)](https://www.figma.com/design/AMKTzGfzcfkVB4Bj79JCg5/INEMA---Regula%C3%A7%C3%A3o--apresenta%C3%A7%C3%A3o-?node-id=119-9846&t=sIEBqaeQjwnkCvfK-1)
- **Módulo no Sistema**: Declaração de Transporte de Resíduos Perigosos (DTRP) › Requerimento › Etapa 02 (Questionário DQC) e Modal Caracterizar Resíduos.
- **Telas no Escopo**: `TL002 – Etapa 02 (Questionário DQC)` e `Modal Caracterizar Resíduos`.
- **Perfis Envolvidos**:
  - Requerente / Usuário Externo: `000.000.000-00` / `admin123` (ou usuário logado no portal).

#### 📌 Regras de Negócio e Pontos Críticos:
1. **Tratamento e Disposição Final (RF01 / RNG-021)**:
   - Apresenta relação parametrizada de formas de tratamento e disposição final em checkboxes.
   - Permite seleção múltipla. Campo de busca filtra opções por nome sem desmarcar itens já selecionados.
2. **Seleção de Resíduos Perigosos (RF02 / RNG-015 / RNG-016)**:
   - Catálogo estritamente baseado na **ABNT NBR 10.004**.
   - Proibido cadastro manual livre durante o preenchimento.
   - Exibe no mínimo Código, Nome do Resíduo e Periculosidade.
   - Busca por nome, código ou palavra-chave preservando os já selecionados.
3. **Cadastro SINIR (Sim/Não & Upload PDF)**:
   - Campo indicativo de cadastro no Sistema Nacional de Informações sobre a Gestão dos Resíduos Sólidos (SINIR).
   - Se selecionado "Sim": upload condicional obrigatório de comprovante em formato PDF.
4. **Gerenciamento e Caracterização Individual Obrigatória (RF03 / RNG-018 / RNG-019 / RNG-020)**:
   - Cada resíduo selecionado DEVE ser caracterizado individualmente pelo **Modal Caracterizar Resíduos**.
   - Dados obrigatórios da caracterização:
     - Quantidade média anual transportada;
     - Estado físico;
     - Acondicionamento;
     - Tipo de veículo transportador.
   - Ações por resíduo:
     - **Visualizar**: modo leitura;
     - **Editar**: reabre modal com dados preenchidos;
     - **Excluir**: confirmação MSG012. Se o resíduo já possuir caracterização vinculada, exibir alerta de confirmação específico MSG013: *"Este resíduo possui caracterização vinculada. Ao excluí-lo, a caracterização também será removida. Deseja continuar?"*.
5. **Condições Estritas para Avanço à Etapa 03 (RF04 / RNG-022)**:
   - Pelo menos 1 forma de tratamento/disposição selecionada (MSG008 se faltar);
   - Pelo menos 1 resíduo perigoso selecionado (MSG009 se faltar);
   - 100% dos resíduos selecionados devidamente caracterizados (MSG010 se houver pendência);
   - Todos os campos obrigatórios da caracterização preenchidos (MSG011).
6. **Alerta Limite LAC**:
   - Informativo e não bloqueante conforme parametrização.
7. **Navegação & Rascunho (RF04 / RNG-004 / MSG014 / MSG015)**:
   - Salvar Rascunho grava dados com sucesso (MSG014).
   - Botão Anterior retorna à Etapa 01 preservando tudo.
   - Botão Cancelar solicita confirmação se houver dados não salvos (MSG015).

#### 🎯 Cenários de Teste a Executar:
- **Cenário 1 — Formas de Tratamento e Disposição Final**: Selecionar múltiplas opções; filtrar no campo de pesquisa e confirmar preservação dos itens marcados.
- **Cenário 2 — Catálogo NBR 10.004 e Campo SINIR**: Buscar resíduos por código/palavra-chave; vincular ao formulário; testar campo SINIR com opção "Não" e opção "Sim" (validando upload de PDF obrigatório).
- **Cenário 3 — Modal Caracterizar Resíduos**: Preencher caracterização (quantidade, estado físico, acondicionamento, tipo de veículo); tentar salvar com campo em branco (validar MSG011); salvar com sucesso.
- **Cenário 4 — Gerenciamento e Exclusão com Caracterização Vinculada**: Testar ações Visualizar e Editar; tentar excluir resíduo com caracterização e validar alerta específico MSG013.
- **Cenário 5 — Validações Bloqueantes de Avanço**: Tentar clicar em Próximo sem tratamento (MSG008), sem resíduo (MSG009) e com resíduo não caracterizado (MSG010).
- **Cenário 6 — Rascunho e Navegação entre Etapas**: Salvar rascunho (MSG014); voltar para Etapa 01 via Anterior e retornar à Etapa 02 confirmando dados preservados; avançar com sucesso para a Etapa 03.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-dtrp-etapa02-residuos/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver divergência ou erro)
- `prints/`

---

### Teste 09: ⚖️ Certidão de Débito Ambiental – Processos Finalizados (TL008)

- **Módulo no Sistema**: `Análise › Processos Finalizados` (`https://gla-inema-hml.acto.com.br/`)
- **Tela no Escopo**: `TL008 – Processos Finalizados` (Opção do menu lateral sob o agrupador "Análise").
- **Perfis Envolvidos**:
  - Usuário Interno / Técnico ATEND: `000.000.000-00` / `admin123`
  - Coordenador / Gestor: `111.111.111-11` / `gestor123`

#### 📌 Regras de Negócio e Pontos Críticos:
1. **Menu & Acesso (C001 / RG001)**:
   - Item "Processos Finalizados" visível no menu lateral sob o agrupador `Análise`.
   - Acesso restrito aos perfis internos autorizados.
2. **Grid de Processos Finalizados (C003–C008)**:
   - Lista exclusivamente os processos concluídos de Certidão de Débito Ambiental.
   - Colunas obrigatórias:
     - `Nº Processo`: formato `0000.000000/0000-00` ou máscara oficial institucional;
     - `Data Conclusão`: formato `DD/MM/AAAA`;
     - `Ato`: "Certidão de Débito Ambiental";
     - `Técnico`: nome do técnico responsável pela análise;
     - `Etapa`: status/etapa final do processo.
3. **Filtro de Busca (C002)**:
   - Permite localizar processos concluídos por número do processo ou CPF/CNPJ do requerente.
4. **Coluna Ações (C009)**:
   - Menu de contexto / botões por linha:
     - **Visualizar**: consulta dos dados e do parecer técnico;
     - **Baixar**: download da certidão emitida em PDF;
     - **Reabrir Processo**: ação específica para reabrir processo finalizado.
5. **Ciclo Completo de Vida do Processo**:
   - O processo só deve ingressar na listagem de "Processos Finalizados" após percorrer todas as etapas:
     1. `Pauta da Área` → retenção ou distribuição para o técnico;
     2. `Pauta Técnico` → análise técnica (enquadramento em Negativa, Positiva ou Positiva com Efeito Negativo);
     3. `Pauta Coordenador` → validação e assinatura digital do coordenador;
     4. Conclusão formal do fluxo.

#### 🎯 Cenários de Teste a Executar:
- **Cenário 01 — Consulta à Grid de Processos Finalizados**: Acessar Análise › Processos Finalizados; conferir estrutura visual da grid, colunas e cabeçalhos conforme TL008.
- **Cenário 02 — Filtro e Localização de Processo**: Pesquisar por número do processo existente e por CPF/CNPJ; validar retorno imediato do registro.
- **Cenário 03 — Ações do Processo Concluído**: Abrir menu de Ações da linha; validar opções Visualizar, Baixar e presença do botão **"Reabrir Processo"**.
- **Cenário 04 — Conclusão de Ponta a Ponta**: Finalizar um processo de Certidão pelo Coordenador e validar sua aparição imediata na tela de Processos Finalizados.
- **Cenário 05 — Integridade dos Dados e Download**: Abrir a visualização do processo na grid; conferir consistência de técnico responsável, data de conclusão e baixar certidão gerada.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-certidao-processos-finalizados/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver divergência ou erro)
- `prints/`

---

### Teste 10: 📑 ENQ001 – Pauta Técnica de Enquadramento e Históricos (Spec 048)

- **Documento de Requisitos / Spec**: Spec 048 (Páginas 32–40)
- **Módulo no Sistema**: `Análise › Enquadramento › Pauta Técnica` (`https://gla-inema-hml.acto.com.br/pauta-tecnica-enquadramento`)
- **Telas no Escopo**:
  - `TL003` – Pauta Técnica (Listagem com abas por status, filtros, configuração de colunas persistida e paginação)
  - `Modal C099` – Modal de Ações "Outros" (Efetuar Enquadramento, Analisar Documentação, Tramitar, Devolver, Cancelar, Ver Histórico)
  - `TL003-Histórico` – Modal de Histórico de Tramitações (Cabeçalho expandido com CPF/CNPJ, CEFIR/CAR e abas)
  - `TL004` – Aba Histórico de Notificações (Comunicações com o requerente)
- **Perfis Envolvidos**:
  - Usuário Interno / Técnico ATEND: `000.000.000-00` / `admin123`
  - Coordenador / Gestor: `111.111.111-11` / `gestor123`

#### 📌 Regras de Negócio e Pontos Críticos:
1. **Fila Individual do Técnico (RNG-001 a RNG-006 / C072)**:
   - Após retenção ou distribuição, o requerimento é exibido na Pauta Técnica associada ao técnico responsável.
   - Status inicial: `"Aguardando Enquadramento"`.
2. **Abas Pré-setadas por Status (C073–C078)**:
   - `Todos`: todos os requerimentos vinculados à área ATEND (Aguardando Enquadramento, Sendo Enquadrado, Enquadrado, Aguardando Validação Prévia, Em Validação Prévia, Validado, Processo Formado, Pendência de Enquadramento, Pendência de Validação).
   - `Aguardando`: requerimentos vinculados ao técnico cujo enquadramento ainda não foi iniciado.
   - `Em Análise`: enquadramento em andamento com status `"Sendo Enquadrado"`.
   - `Aguardando Validação Prévia`: requerimentos enquadrados com documentação enviada e pagamento confirmado via SEFAZ.
   - `Em Validação`: validação documental em andamento com status `"Em Validação Prévia"`.
   - `Pendências`: requerimentos com pendência aguardando ação do requerente (`Pendência de Enquadramento` ou `Pendência de Validação`).
3. **Colunas da Grid e Configuração Persistida (C080–C087)**:
   - Colunas: Requerimento, Data Abertura, Requerente, Empreendimento, Atos, Situação, Ações.
   - Reordenar/configurar colunas: persistência por usuário no banco de dados (`se_preferencia_tabela`), preservada após logout e novo login.
4. **Controle de Ações do Requerimento (C088–C093 / C099–C106)**:
   - `Visualizar`: somente leitura, sem assumir responsabilidade nem alterar status (RNG-003).
   - `Efetuar Enquadramento`: transita status para `"Sendo Enquadrado"` e bloqueia edição externa (RNG-007).
   - `Analisar Documentação`: liberado apenas em status `"Aguardando Validação Prévia"`, transitando para `"Em Validação Prévia"` (RNG-036).
   - `Tramitar Requerimento`: encaminha para outro técnico da ATEND; exige justificativa obrigatória (MSG006); confirmação MSG014; sucesso MSG020 com preservação dos dados preenchidos.
   - `Devolver Requerimento`: devolve para a Pauta da Área; confirmação MSG013; sucesso MSG021; remove vínculo com o técnico.
   - `Cancelar Requerimento`: permitido apenas para perfis autorizados (Coordenação/Diretoria); exige justificativa (MSG005); confirmação MSG011; sucesso MSG025; bloqueado após `"Processo Formado"` (RNG-045).
5. **Histórico de Tramitações e Notificações (TL003 / TL004 / C107–C136)**:
   - Cabeçalho informativo fixo: CPF/CNPJ, Nome/Razão Social, Empreendimento, Nº Requerimento, CEFIR/CAR (ou `"-"`), Atos Vinculados.
   - Aba 1 (`Histórico de Tramitação`): Data e Hora, Situação, Ação Vinculada, Usuário, Ações (Visualizar Detalhes).
   - Aba 2 (`Histórico de Notificação`): Data, Usuário, Mensagem resumida, Ação (Visualizar Comunicação integral).
   - Paginação, contador e quantidade por página em ambos os históricos.

#### 🎯 Cenários de Teste a Executar:
- **Cenário 01 — Consulta da Pauta, Abas e Persistência de Colunas**: Navegar pelas 6 abas; testar busca rápida (por número, CPF/CNPJ, requerente); configurar visibilidade de colunas, efetuar logout/login e conferir persistência da configuração.
- **Cenário 02 — Ação Visualizar e Modais de Ações**: Abrir visualização (conferir que status e técnico não são alterados); fechar modal Outros sem executar ação.
- **Cenário 03 — Tramitação entre Técnicos com Justificativa**: Testar tentativa de tramitar sem preencher justificativa (bloqueio com MSG006); preencher justificativa, confirmar e validar encaminhamento para outro técnico com MSG020.
- **Cenário 04 — Devolução para Pauta da Área**: Acionar Devolver Requerimento; confirmar no modal MSG013; validar sucesso MSG021, remoção do vínculo com o técnico e reaparição na Pauta da Área.
- **Cenário 05 — Cancelamento e Bloqueio pós-Processo Formado**: Testar cancelamento sem justificativa (bloqueio MSG005); cancelar com justificativa (MSG025); validar bloqueio da ação de cancelamento em requerimentos com status Processo Formado.
- **Cenário 06 — Modal de Histórico de Tramitações e Notificações**: Abrir histórico de um requerimento; validar cabeçalho completo (CPF/CNPJ, CEFIR/CAR); alternar entre aba Tramitação e aba Notificação; abrir detalhes de uma tramitação/comunicação.
- **Cenário 07 — Reflexo de Status e Filtros Específicos**: Validar transições de status (Aguardando Enquadramento → Sendo Enquadrado → Pendências) e consistência das abas pré-setadas.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-enq001-pauta-tecnica/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver divergência ou erro)
- `prints/`

---

### Teste 11: 💳 DAE – Requerente – Acesso e Consulta do Parcelamento (DR003 / TL001 / TL002)

- **Documento de Requisitos / Spec**: `DR003 – Módulo Financeiro – Parcelamento - UE` (Páginas 1 a 25)
- **Módulo no Sistema**:
  - `Requerimentos › Parcelamento` (Tela Inicial `TL002`)
  - `Meus Processos` (`TL001`)
  - Detalhamento da Solicitação de Parcelamento
- **Perfis Envolvidos**:
  - Usuário Externo / Requerente autenticado no Portal do Usuário Externo

#### 📌 Regras de Negócio e Decisões de Implementação:
1. **Menu & Agrupador Requerimentos (C001 / C002 / RG001)**:
   - Agrupador "Requerimentos" expansível/recolhível no menu lateral do Portal do Usuário Externo.
   - Item "Parcelamento": direciona para a tela inicial de Parcelamento destacando a opção no menu.
2. **Tela Inicial do Parcelamento (TL002 / C003–C008 / RG003)**:
   - Apresenta 4 painéis informativos com conteúdo expansível/recolhível:
     - `Informações`: orientações gerais sobre o parcelamento de débitos administrativos;
     - `Documentação Exigida`: relação de documentos necessários;
     - `Valor`: regras e condições de valores;
     - `Prazos`: prazos aplicáveis ao processo.
   - Botão **"Voltar"** (C003): retorna à tela anterior.
   - Botão **"Solicitar Parcelamento"** (C004): intencionalmente **desabilitado** com selo/badge **"Em breve"** (o fluxo wizard da solicitação é o CARD 2).
3. **Tela Meus Processos (TL001 / C001–C007 / RG012)**:
   - Substituiu o placeholder antigo, listando os processos reais do próprio requerente (alimentada inicialmente pelas fontes do Financeiro: Certidão de Débito e Parcelamento).
   - **Abas de Filtragem Rápida de Status (C001)**:
     - `Todos` (selecionado por padrão);
     - `Rascunho`;
     - `Aguardando Pagamento`;
     - `Em Análise`;
     - `Pendentes` (aba presente no layout, inicia vazia por não haver estado mapeado no momento);
     - `Concluído`.
   - **Colunas da Tabela com Ordenação Crescente/Decrescente (C002–C006)**:
     - `Nº Processo` (texto/máscara ordenável);
     - `Data Formação` (data DD/MM/AAAA ordenável);
     - `Ato` (texto ordenável, ex: Certidão de Débito Ambiental, Parcelamento);
     - `Etapa / Status` (badge colorido ordenável: Rascunho [cinza], Aguardando Pagamento [verde], Em Análise [amarelo], Pendente [vermelho], Concluído [verde escuro]).
   - **Ações na Tabela**:
     - `Visualizar` (ícone de lupa): direciona para a tela de detalhamento/resumo do processo selecionado em modo leitura;
     - `Menu de Ações` (ícone de três pontos verticais ⋮): abre menu suspenso com ações contextuais específicas (ex: Editar, Excluir, Cancelar, Baixar DAE, conforme a situação do processo).
   - **Busca**: campo de busca textual e lupa para filtragem na listagem.
4. **Isolamento de Segurança e Permissões**:
   - Requerente autenticado visualiza exclusivamente os processos vinculados ao seu próprio CPF/CNPJ.
   - Tentativas de acesso direto por URL a processos de terceiros devem ser bloqueadas com segurança.
   - Parâmetro opcional `id` no wizard de Certidão de Débito deve manter compatibilidade integral.

#### 🎯 Cenários de Teste a Executar:
- **Cenário 01 — Acesso via Menu Lateral e Tela Inicial (TL002)**: Expandir agrupador Requerimentos, selecionar Parcelamento e validar destaque na navegação; testar expansão/recolhimento dos 4 painéis (`Informações`, `Documentação Exigida`, `Valor`, `Prazos`); testar botão Voltar.
- **Cenário 02 — Validação do Botão Solicitar Parcelamento (Escopo Card 1)**: Confirmar que o botão "Solicitar Parcelamento" está visível, desabilitado e com o selo/badge "Em breve".
- **Cenário 03 — Grid Meus Processos e Abas de Filtragem de Status (TL001)**: Acessar Meus Processos; validar as 6 abas de status (`Todos` padrão, `Rascunho`, `Aguardando Pagamento`, `Em Análise`, `Pendentes`, `Concluído`); alternar entre abas e conferir filtragem coerente dos registros.
- **Cenário 04 — Ordenação de Colunas e Busca Textual**: Testar ordenação crescente e decrescente nas colunas `Nº Processo`, `Data Formação`, `Ato` e `Etapa / Status`; testar filtro de busca rápida por texto/número.
- **Cenário 05 — Ação Visualizar (Lupa) e Detalhamento do Processo**: Clicar na lupa de um processo; verificar redirecionamento para a tela de detalhamento e exibição dos dados cadastrais/processuais em modo leitura.
- **Cenário 06 — Menu de Ações Contextuais (⋮)**: Clicar no menu de ações dos registros; conferir opções contextuais disponíveis de acordo com o status do processo.
- **Cenário 07 — Isolamento de Segurança por Usuário**: Validar que apenas processos do usuário logado são apresentados; tentar acesso a processo de outro requerente via URL e confirmar bloqueio.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-dae-parcelamento-consulta/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver divergência ou erro)
- `prints/`

---

### Teste 12: ⚖️ Certidão de Débito Ambiental – Análise da Solicitação (TL003 / TL004 / TL005)

- **Módulo no Sistema**: `Análise › Certidão de Débito › Analisar Solicitação de Certidão` (`https://gla-inema-hml.acto.com.br/`)
- **Telas no Escopo**:
  - `TL003 – Analisar Solicitação de Certidão – Aba de Análise` (C001–C015)
  - `TL004 – Modal de Adicionar Pendência` (C001–C008)
  - `TL005 – Analisar Solicitação de Certidão – Aba de Resumo` (C001–C010)
- **Perfis Envolvidos**:
  - Usuário Interno / Técnico Responsável (ou Admin/Gestor com bypass): `000.000.000-00` / `admin123`
  - Requerente: para recebimento da certidão emitida

#### 📌 Regras de Negócio e Pontos Críticos:
1. **Aba "Análise" (TL003 / C001–C015)**:
   - Apresenta cabeçalho informativo em modo somente leitura: Processo Nº, Data da Formação, Ato, CPF/CNPJ, Nome/Razão Social, E-mail, Telefone, Estado/Município, Endereço completo e Contador Geral de dias.
   - Grid "Pendências Vinculadas" com ações de Editar e Excluir antes da finalização.
   - Botão "Adicionar Pendência" (C013) abre modal TL004.
2. **Modal de Adicionar Pendência (TL004 / C001–C008 / RG008 / MSG003)**:
   - Campos:
     - `Número do Processo`: texto livre obrigatório;
     - `Origem da Pendência`: texto livre obrigatório;
     - `Dívida Ativa?`: seleção obrigatória (Sim / Não);
     - `Valor Inicial`: numérico monetário obrigatório.
   - Botão "Salvar / Enviar" valida preenchimento, insere na grid e emite mensagem `MSG003` (*"Pendência adicionada com sucesso."*).
   - Botão "Cancelar" e ícone "X" fecham sem gravar.
3. **Determinação do Tipo de Certidão Emitida (RG009)**:
   - Na aba "Resumo" (TL005), o sistema consolida o resultado das pendências apuradas e define o tipo de certidão:
     - **Certidão Negativa**: emitida quando **NÃO existirem** processos de débito, multa ou dívida ativa vinculados ao CPF/CNPJ.
     - **Certidão Positiva com Efeito Negativo**: emitida quando existirem processos de multa, mas **SEM inscrição em dívida ativa** (`Dívida Ativa = Não`).
     - **Certidão Positiva**: emitida quando existirem processos de multa **inscritos em dívida ativa** (`Dívida Ativa = Sim`).
4. **Visualização, Emissão e Finalização (TL005 / C007 / C010 / MSG004)**:
   - Botão "Visualizar Certidão" realiza o download em PDF da certidão gerada conforme o enquadramento.
   - Botão "Finalizar" conclui a análise, grava as informações e disponibiliza a certidão emitida ao requerente, emitindo `MSG004` (*"Análise concluída com sucesso. A certidão foi gerada e disponibilizada ao requerente."*).
5. **Ações de Pauta e Suporte (RG006 / RG010 / MSG002)**:
   - Botão "Devolver a Pauta Geral": solicita confirmação com `MSG002` (*"Deseja realmente devolver este processo para a Pauta Geral da Área?"*) e desvincula o processo do técnico.
   - Botão "Download do Processo": permite download da documentação e da cópia integral dos autos.

#### 🎯 Cenários de Teste a Executar:
- **Cenário 01 — Dados Cadastrais e Abertura do Modal de Pendência**: Acessar a análise do processo; conferir campos de somente leitura da aba "Análise"; abrir o modal "Adicionar Pendência".
- **Cenário 02 — Inclusão e Gestão de Pendências (RG008)**: Preencher dados da pendência (Processo, Origem, Dívida Ativa, Valor Inicial); salvar e validar `MSG003` e inclusão na grid; testar ações de edição e exclusão de pendência vinculada.
- **Cenário 03 — Devolução para a Pauta da Área (RG006)**: Acionar Devolver a Pauta Geral; validar confirmação `MSG002`; confirmar e validar retorno do processo para a Pauta da Área sem vínculo com o técnico.
- **Cenário 04 — Determinação de Certidão Negativa**: Analisar processo de CPF/CNPJ sem qualquer pendência vinculada; acessar aba "Resumo"; validar determinação de "Certidão Negativa" no painel Conclusão da Análise; pré-visualizar PDF gerado.
- **Cenário 05 — Determinação de Certidão Positiva com Efeito Negativo**: Vincular pendência com `Dívida Ativa = Não`; acessar aba "Resumo"; validar determinação de "Certidão Positiva com Efeito Negativo"; validar PDF gerado.
- **Cenário 06 — Determinação de Certidão Positiva e Finalização**: Vincular pendência com `Dívida Ativa = Sim`; validar determinação de "Certidão Positiva"; acionar "Finalizar"; confirmar gravação com `MSG004`, conclusão da análise e disponibilização ao requerente.
- **Cenário 07 — Download Integral do Processo (RG010)**: Acionar a ação de Download do Processo na pauta ou na análise; validar geração e integridade do arquivo baixado.

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-certidao-analise-solicitacao/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver divergência ou erro)
- `prints/`

---

### Teste 13: 📝 DAE – Requerente – Solicitação de Parcelamento (Wizard 3 Etapas: TL003–TL005)

- **Documento de Requisitos / Spec**: `DR003 – Módulo Financeiro – Parcelamento - UE` (Páginas 9 a 14)
- **Módulo no Sistema**: `Requerimentos › Parcelamento › Solicitar Parcelamento` (`https://gla-inema-hml.acto.com.br/`)
- **Telas no Escopo**:
  - `TL003 – Solicitar Parcelamento – Aba de Participes` (C001–C011)
  - `TL004 – Solicitar Parcelamento – Aba de Processo` (C001–C007)
  - `TL005 – Solicitar Parcelamento – Aba de Resumo` (C001–C007)
- **Perfis Envolvidos**:
  - Usuário Externo / Requerente autenticado no Portal do Usuário Externo

#### 📌 Regras de Negócio e Pontos Críticos:
1. **Etapa 1: Partícipes (TL003 / RG004–RG009 / RG013–RG016 / MSG001)**:
   - Campo "Quem sou eu?" (C001): seleção por radio button entre `Requerente`, `Representante Legal`, `Procurador de Pessoa Física` ou `Procurador de Pessoa Jurídica`.
   - Se diferente de Requerente: exibe campo dinâmico `CPF do Procurador / Representante Legal` e campo `CPF do Requerente` (C002/C003).
   - Consulta e preenchimento automático de Nome/Razão Social ao informar CPF/CNPJ válido.
   - Botão "Adicionar" (C004): validação obrigatória dos campos (emite `MSG001` *"Preencha os campos obrigatórios do partícipe antes de adicionar"* se incompleto).
   - Bloqueio de duplicidade: não permite adicionar o mesmo CPF/CNPJ mais de uma vez (`RG009`).
   - Grid "Lista de Partícipes" (C005–C011): exibe CPF/CNPJ formatado, Nome/Razão Social, Papel, e ações `Visualizar` (lupa), `Detalhar` (documento) e `Excluir` (lixeira com confirmação `RG013`).
   - Regra mandatória: a solicitação DEVE possuir ao menos 1 participante do tipo `Requerente` (`RG005`).
2. **Etapa 2: Processo (TL004 / C001–C007 / RG002 / RG014)**:
   - Alerta informativo C001: *"Caso não possua o número do processo, solicite a Certidão de Debito."*.
   - Campo "Número do processo" (C002): entrada de texto alfanumérico com o identificador do processo que deseja parcelar.
   - Botão "+ Incluir Processo" (C003): valida preenchimento, busca informações e adiciona linha na grid.
   - Grid de Processos (C004–C007): exibe Número do Processo, Data da Inclusão (DD/MM/AAAA) e ações de Editar (lápis) e Excluir (lixeira com confirmação).
3. **Etapa 3: Resumo e Finalização (TL005 / C001–C007 / RG010 / MSG002 / MSG003)**:
   - Consolidação em modo leitura das duas etapas anteriores: tabela de Partícipes e tabela de Processos/Documentos adicionados.
   - Banner explicativo C006 (`MSG002`): *"As movimentações serão encaminhadas para as partes vinculadas à solicitação e podem ser consultadas em seu cadastro no sistema."*.
   - Checkbox "Termo de Declaração" (C007): declaração obrigatória de veracidade das informações sob as penas da lei.
   - Botão "Finalizar": permanece desabilitado até que o checkbox do Termo de Declaração seja marcado.
   - Ao marcar o checkbox e acionar Finalizar: conclui o envio do pedido e gera a solicitação para acompanhamento em "Meus Processos".
4. **Navegação e Persistência (RG014)**:
   - Ao transitar entre abas via botões `< Anterior` e `Próximo >`, todos os partícipes e processos preenchidos devem persistir intactos.

#### 🎯 Cenários de Teste a Executar:
- **Cenário 01 — Cadastro de Partícipes com Papéis Distintos (TL003)**: Testar seleção de "Requerente", "Representante Legal" e "Procurador"; verificar exibição condicional dos campos de CPF/CNPJ; validar consulta automática de nome; adicionar múltiplos partícipes na grid.
- **Cenário 02 — Validações Negativas de Partícipes**: Tentar adicionar participante com campos vazios (validar bloqueio com `MSG001`); tentar adicionar CPF/CNPJ duplicado (validar bloqueio `RG009`); tentar avançar sem ao menos um "Requerente" (validar bloqueio `RG005`).
- **Cenário 03 — Ações na Grid de Partícipes**: Testar ações `Visualizar` e `Detalhar` em modo leitura; testar `Excluir` confirmando remoção do registro da grid (`RG013`).
- **Cenário 04 — Inclusão de Processos a Parcelar (TL004)**: Visualizar banner C001; inserir número de processo alfanumérico e clicar em "+ Incluir Processo"; validar inserção na grid com data de inclusão correta; testar ações de edição e exclusão.
- **Cenário 05 — Persistência entre Abas**: Navegar para a etapa Processo, retornar à etapa Participantes via `< Anterior` e conferir se todos os partícipes continuam preservados (`RG014`).
- **Cenário 06 — Revisão na Aba de Resumo e Trava do Termo (TL005)**: Conferir tabelas consolidadas de leitura; verificar banner de encaminhamento C006 (`MSG002`); validar que o botão "Finalizar" fica desabilitado sem o aceite do termo.
- **Cenário 07 — Finalização da Solicitação**: Marcar o checkbox "Termo de Declaração"; acionar "Finalizar"; validar conclusão com sucesso e conferir geração da solicitação para acompanhamento em Meus Processos (`RG012`).

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-dae-parcelamento-solicitacao/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver divergência ou erro)
- `prints/`

---

### Teste 14: 👔 Certidão de Débito Ambiental – Análise do Coordenador (TL006 / TL007)

- **Módulo no Sistema**: `Análise › Certidão de Débito › Minha Pauta / Analisar Certidão - Coordenador` (`https://gla-inema-hml.acto.com.br/`)
- **Telas no Escopo**:
  - `TL006 – Minha pauta` (C001–C010)
  - `TL007 – Analisar certidão de Débito Ambiental - Coordenador` (C001–C017)
- **Perfis Envolvidos**:
  - Coordenador / Gestor Tributário: `111.111.111-11` / `gestor123` (ou Admin com bypass)
  - Técnico: para recebimento de processos devolvidos
  - Requerente: para recebimento da certidão assinada/disponibilizada

#### 📌 Regras de Negócio e Pontos Críticos:
1. **Minha Pauta do Coordenador (TL006 / C001–C010)**:
   - Apresenta os processos de Certidão de Débito que foram finalizados pelo técnico e aguardam ação da coordenação.
   - Campo de busca rápida C001: permite filtrar por número do processo ou CPF/CNPJ.
   - Grid com colunas: `Nº Processo`, `Data`, `Ato` ("Certidão de Débito Ambiental"), `Requerente`, `Etapa`, `Prazo` e `Ações`.
   - Coluna Ações (C009): opções de `Assinar`, `Devolver`, `Fechar`, `Visualizar` e `Baixar`.
2. **Tela de Análise da Certidão pelo Coordenador (TL007 / C001–C012)**:
   - Cabeçalho em somente leitura com dados consolidados do requerente e da solicitação (Processo Nº, CPF/CNPJ, Nome/Razão Social, E-mail, Telefone, Estado/Município, Endereço completo).
   - Painel das pendências apuradas: Processo, Origem das Pendências, Dívida Ativa e Valor consolidado.
3. **Visualização em Rascunho com Marca D'água (TL007 / C013)**:
   - Ação "Visualizar Certidão": renderiza o documento em formato de rascunho com a marca d'água **"RASCUNHO"**.
   - Trava de integridade: o documento NÃO deve permitir download oficial nessa prévia de rascunho.
4. **Devolução para a Pauta do Técnico (TL007 / C014)**:
   - Ação "Devolver": desvincula o processo da pauta do coordenador e retorna diretamente para a pauta do técnico responsável para saneamento/revisão.
5. **Download, Upload e Assinatura Digital (TL007 / C015–C017)**:
   - Ação "Download da certidão" (C015): realiza o download do documento oficial conforme a regra das certidões.
   - Ação "Upload da Certidão" (C016): permite anexar o documento assinado externamente.
   - Ação "Assinatura digital" (C017): executa a assinatura digital do documento diretamente no sistema.
   - Após Upload ou Assinatura Digital: a certidão emitida é disponibilizada para download pelo requerente e o processo transita para "Processos Finalizados" (TL008).

#### 🎯 Cenários de Teste a Executar:
- **Cenário 01 — Consulta e Filtro em Minha Pauta (TL006)**: Acessar "Minha pauta" com perfil de Coordenador; filtrar processos por número e CPF/CNPJ; conferir colunas da grid e opções do menu de ações.
- **Cenário 02 — Dados Consolidados da Análise (TL007)**: Abrir a tela de análise do coordenador; validar integridade dos dados cadastrais do requerente e valores das pendências em somente leitura.
- **Cenário 03 — Visualização da Certidão em Rascunho com Marca D'água**: Acionar "Visualizar certidão"; conferir a presença da marca d'água "RASCUNHO" e ausência de download definitivo do documento nessa modalidade.
- **Cenário 04 — Devolver Processo para o Técnico**: Acionar a opção "Devolver"; confirmar ação; verificar que o processo é removido da pauta do coordenador e reaparece na pauta do técnico.
- **Cenário 05 — Download Oficial da Certidão**: Acionar "Download da certidão"; validar geração do arquivo PDF conforme as regras de enquadramento (Negativa, Positiva ou Positiva com Efeito Negativo).
- **Cenário 06 — Upload / Assinatura Digital e Disponibilização**: Realizar a assinatura digital ou upload da certidão assinada; verificar que o processo é concluído, que a certidão é disponibilizada ao requerente e que o processo migra para a listagem de "Processos Finalizados" (TL008).

#### 📁 Pasta de Armazenamento do Teste:
`qa/cards/card-certidao-analise-coordenador/`
- `checklist.md`
- `comentario-card.txt`
- `anexos.zip` (se houver divergência ou erro)
- `prints/`


