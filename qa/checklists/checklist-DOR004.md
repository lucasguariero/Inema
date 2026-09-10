# Checklist de Teste e Homologação — DOR004 (Emergência Química Externa)

> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Card**: 4 - Fiscalização - Registro de Emergência externa  
> **Data de Homologação**: 09/09/2026  
> **Líder de QA**: Lucas Guariero  
> **Status Geral**: ✅ **APROVADO / HOMOLOGADO COM SUCESSO (100%)**  
> **RE Gerado**: `2026.000004/INEMA/RE`  
> **Comunicante de Teste**: Giovani (`529.982.247-25`)

---

## 👥 Perfis e Credenciais de Teste Utilizados

| Perfil | Login / CPF | Senha | Finalidade no Teste | Status |
|---|---|---|---|---|
| **Usuário Externo** | `529.982.247-25` | Simulação Gov.br | Registro inicial, envio de relatórios (Conclusivo e RPEQ), rascunho e exclusão | **OK** |
| **Gestor** | `111.111.111-11` | `gestor123` | Correção de vínculo para "Sim" e Associação de técnico plantonista | **OK** |
| **Call Center** | `123.456.789-01` | `@Callcenter123` | Associação de técnico plantonista (permissão unificada com perfil Gestor) | **OK** |

---

## 📋 Matriz de Execução e Evidências

### Bloco 1: Entrar & Autenticação Externa
- [x] **1.1** Acessar `/servicos-online` sem autenticação prévia — *Evidência: `qa/screenshots/01-portal.png`*
- [x] **1.2** Clicar em *"Registrar Emergência Química"*
- [x] **1.3** Validar que abre modal explicativo sem redirecionar imediatamente — *Evidência: `qa/screenshots/02-modal-explicativo.png`*
- [x] **1.4** Clicar em *"Simular autenticação"* (Gov.br HML) — *Evidência: `qa/screenshots/03-autenticacao-cpf.png`*
- [x] **1.5** Verificar se tela abre com CPF já preenchido e clicar em *"Entrar"* — *Redirecionado para `/servicos-online/emergencia-quimica/nova`*

### Bloco 2: Abertura & Identificação Inicial
- [x] **2.1** Cabeçalho exibe `"Nº de Registro: A gerar na finalização"` (não gera RE na abertura, divergindo propositalmente da DOR003 interna) — *Evidência: `qa/screenshots/04-formulario-aberto.png`*
- [x] **2.2** Recarregar a página (`F5`) e validar que mantém o mesmo rascunho sem duplicar registro (chave única por CPF)
- [x] **2.3** Validar que o campo *"Técnico plantonista"* **NÃO** está visível para o usuário externo (RN030 / CA035) — *Aprovado (count = 0)*

### Bloco 3: Informações sobre a Empresa & Vínculo
- [x] **3.1** Vínculo = *"Sim"*: exibe campos *"Nome da empresa"* (máx 500 carac.) e *"Cargo"* (máx 200 carac.) — *Evidência: `qa/screenshots/05-vinculo-sim.png`*
- [x] **3.2** Vínculo = *"Não"*: exibe combobox *"Você está comunicando como"* com as opções: *Cidadão comum*, *Força Policial*, *Outras instituições* — *Evidência: `qa/screenshots/06-vinculo-nao.png`*
- [x] **3.3** Selecionar *"Outras instituições"*: abre campo obrigatório *"Instituição"* (máx 500 carac.)
- [x] **3.4** Campo *"Sabe informar o nome da empresa responsável pela emergência química?"* permanece visível em ambos os cenários (RN005) — *Aprovado*
- [x] **3.5** Configuração para prosseguir: Vínculo = *"Não"* / Classificação = *"Cidadão comum"*

### Bloco 4: Preenchimento, Validações & Finalização
- [x] **4.1** Comunicante: campos Nome, CPF e E-mail bloqueados para edição; Telefone editável
- [x] **4.2** Data/Hora da Constatação: bloqueia datas futuras nativamente no componente (classe `fi-disabled`)
- [x] **4.3** Tipo da Emergência: selecionado *"Outros"* -> abriu campo de descrição obrigatória *"Descrição do tipo"* (RN028)
- [x] **4.4** Anexos: upload de PDF realizado com sucesso; legenda informativa fixa MSG005 validada
- [x] **4.5** CEP: preenchido `40020-000` -> completou automaticamente Salvador - BA, Centro, Rua Chile
- [x] **4.6** Área Atingida: selecionadas 3 opções (*Área Urbana*, *Recurso Hídrico*, *Rodovia*); 4ª opção bloqueada automaticamente (máx 3 áreas, RN012)
- [x] **4.7** Coordenadas: deixadas em branco para teste dos alertas de validação
- [x] **4.8** Validação 1 (`MSG001`): com campos obrigatórios vazios, sistema alerta e foca no campo
- [x] **4.9** Validação 2 (`MSG002`): alerta de ausência de coordenadas exibido em modal — *Evidência: `qa/screenshots/09-modal-coordenadas-msg002.png`*
- [x] **4.10** Validação 3 (`MSG003`): modal de confirmação definitiva — clicado em *"Não"*, dados foram preservados intactos — *Evidência: `qa/screenshots/10-modal-confirmacao-msg003.png`*
- [x] **4.11** Finalização: clicado em *"Sim"*, registro finalizado gerando o RE `2026.000004/INEMA/RE` (`MSG004`)
- [x] **4.12** Pós-finalização: tela convertida para modo leitura, botões *Finalizar* e *Excluir* ocultados, e seção *Relatórios* exibida — *Evidência: `qa/screenshots/11-pos-finalizacao-re.png`*

### Bloco 5: Relatórios & Correção de Vínculo pelo Gestor
- [x] **5.1** Seção Relatórios inicial: constam *Conclusivo* e *Complementar*. RPEQ exibe mensagem `"O Relatório Preliminar de Emergência Química (RPEQ) é solicitado apenas a quem declarou vínculo com a empresa responsável"`
- [x] **5.2** Envio de PDF no *Relatório Conclusivo*, página recarregada e conferida a persistência do envio — *Evidência: `qa/screenshots/12-pos-envio-conclusivo.png`*
- [x] **5.3** Login efetuado como **Gestor** (`111.111.111-11` / `gestor123`) — *Evidência: `qa/screenshots/14-dashboard-gestor.png`*
- [x] **5.4** Acesso a *Fiscalização > Associar Técnico*, busca do RE `2026.000004/INEMA/RE` e abertura da ação *"Corrigir vínculo"* — *Evidência: `qa/screenshots/20-gestor-modal-vinculo-antes.png`*
- [x] **5.5** Alteração do vínculo para *"Sim"*, preenchimento de Empresa (*Petroquímica Camaçari S.A.*) e Cargo (*Gerente de Operações Químicas*), salvando com sucesso — *Evidências: `qa/screenshots/21-gestor-modal-vinculo-preenchido.png` e `22-gestor-pos-salvar-correcao.png`*
- [x] **5.6** Retorno ao portal externo com o CPF do comunicante: RPEQ agora surge liberado com upload ativo — *Evidência: `qa/screenshots/24-rpeq-pos-correcao-liberado.png`*
- [x] **5.7** Envio do PDF no **RPEQ**: upload concluído e toast de confirmação exibido com sucesso — *Evidência: `qa/screenshots/25-rpeq-enviado-sucesso.png`*

### Bloco 6: Associação do Técnico Plantonista
- [x] **6.1** Acesso à pauta de *Fiscalização > Associar Técnico* — *Evidência: `qa/screenshots/15-associar-tecnico-gestor.png`*
- [x] **6.2** Validação de que o RE externo `2026.000004/INEMA/RE` aparece na fila de atendimento com status *Emergência Registrada*
- [x] **6.3** Clique em *"Associar técnico"*: abertura do modal de indicação — *Evidência: `qa/screenshots/28-modal-associar-tecnico.png`*
- [x] **6.4** Validação da ordenação dos técnicos: plantonistas de Salvador listados no topo (*Carla Mendes*, *Zuleica Andrade*, *Ana Beatriz Rocha*, *Bruno Carvalho*), seguidos dos demais municípios — *Evidência: `qa/screenshots/29-lista-tecnicos-ordenacao.png`*
- [x] **6.5** Seleção do técnico (*Carla Mendes*) e salvamento da associação
- [x] **6.6** Validação da transição de status: registro atualizado para **Análise Técnica** com alertas enviados — *Evidência: `qa/screenshots/30-tecnico-associado-status-analise.png`*

### Bloco 7: Consulta, Rascunho & Exclusão
- [x] **7.1** Retorno ao portal do comunicante via Gov.br (CPF `529.982.247-25`)
- [x] **7.2** Consulta em *Meus Registros*: RE `2026.000004/INEMA/RE` exibe badge **Análise Técnica** — *Evidência: `qa/screenshots/31-meus-registros-analise-tecnica.png`*
- [x] **7.3** Criação de novo rascunho via *"Nova Emergência Química"* com preenchimento de campos parciais
- [x] **7.4** Recarregamento de página: validação de persistência automática do rascunho — *Evidência: `qa/screenshots/32-rascunho-recuperado.png`*
- [x] **7.5** Clique em *"Excluir Emergência"*: validação do modal `MSG007` com alerta `"Deseja excluir o registro de emergência definitivamente? Esta ação não pode ser desfeita"` — *Evidência: `qa/screenshots/33-modal-exclusao-msg007.png`*
- [x] **7.6** Confirmação da exclusão: rascunho excluído definitivamente e retorno limpo para *Meus Registros* — *Evidência: `qa/screenshots/34-pos-exclusao-rascunho.png`*

---

## 🏆 Parecer Final de QA

A implementação do **Card 4 (DOR004) — Fiscalização: Registro de Emergência Externa** está **HOMOLOGADA COM SUCESSO**. Todas as regras de negócio, limites de campos, mensagens de validação, fluxos assíncronos de rascunho, bloqueios de segurança do comunicante, correção de vínculo e integração com a pauta interna de plantonistas funcionaram exatamente conforme a especificação do card.
