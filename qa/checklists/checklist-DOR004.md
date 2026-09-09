# Checklist de Teste e Homologação — DOR004 (Emergência Química Externa)

> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Card**: 4 - Fiscalização - Registro de Emergência externa  
> **Data**: 2026-09-09  
> **Líder de QA**: Lucas Guariero  
> **Status Geral**: Em Execução

---

## 👥 Perfis e Credenciais de Teste

| Perfil | Login / CPF | Senha | Finalidade no Teste |
|---|---|---|---|
| **Usuário Externo** | Gerado automaticamente | Simulação Gov.br | Registro, consulta, envio de relatórios e rascunho |
| **Gestor** | `111.111.111-11` | `gestor123` | Corrigir vínculo da empresa na pauta/associação |
| **Call Center** | `123.456.789-01` | `@Callcenter123` | Associar técnico plantonista (ordenação Salvador/demais) |

---

## 📋 Matriz de Execução Passo a Passo

### Bloco 1: Entrar & Autenticação Externa
- [ ] **1.1** Acessar `/servicos-online` sem autenticação prévia
- [ ] **1.2** Clicar em *"Registrar Emergência Química"*
- [ ] **1.3** Validar que abre modal explicativo sem redirecionar imediatamente
- [ ] **1.4** Clicar em *"Simular autenticação"* (Gov.br HML)
- [ ] **1.5** Verificar se tela abre com CPF já preenchido e clicar em *"Entrar"*

### Bloco 2: Abertura & Identificação Inicial
- [ ] **2.1** Verificar cabeçalho: deve constar `"Nº de Registro: A gerar na finalização"` (não gera número na abertura)
- [ ] **2.2** Recarregar a página (`F5`) e validar que mantém o mesmo rascunho sem duplicar registro
- [ ] **2.3** Validar que o campo *"Técnico plantonista"* **NÃO** está visível para o usuário externo (RN030 / CA035)

### Bloco 3: Informações sobre a Empresa & Vínculo
- [ ] **3.1** Testar Vínculo = *"Sim"*: validar que surgem campos *"Nome da empresa"* (até 500 carac.) e *"Cargo"* (até 200 carac.) obrigatórios
- [ ] **3.2** Testar Vínculo = *"Não"*: validar que surge classificação (*Cidadão comum*, *Força Policial*, *Outras instituições*)
- [ ] **3.3** Selecionar *"Outras instituições"*: validar que abre campo obrigatório *"Instituição"* (até 500 carac.)
- [ ] **3.4** Validar se *"Sabe informar o nome da empresa responsável?"* permanece visível em ambos os cenários (RN005)
- [ ] **3.5** Configurar para prosseguir: Vínculo = *"Não"* / Classificação = *"Cidadão comum"*

### Bloco 4: Preenchimento, Validações & Finalização
- [ ] **4.1** Comunicante: validar que Nome, CPF e E-mail estão bloqueados para edição; Telefone editável
- [ ] **4.2** Constatação: tentar informar data futura -> sistema deve recusar
- [ ] **4.3** Tipo da Emergência: selecionar *"Outros"* -> deve abrir campo de descrição obrigatória (RN028)
- [ ] **4.4** Anexos: enviar um arquivo PDF e verificar legenda informativa fixa MSG005
- [ ] **4.5** CEP: preencher `40020-000` -> deve preencher automaticamente endereço e município
- [ ] **4.6** Área Atingida: marcar 3 opções; tentar a 4ª -> deve bloquear (máx 3 áreas, RN012)
- [ ] **4.7** Tooltips: verificar tooltip em *Comunidade Tradicional* e *Unidade de Conservação* (RN031)
- [ ] **4.8** Coordenadas: deixar em branco
- [ ] **4.9** Validação 1: clicar em *"Finalizar Emergência"* com obrigatório vazio -> `MSG001` ("Preencher campos obrigatórios!") com destaque no campo
- [ ] **4.10** Validação 2: com obrigatórios preenchidos e sem coordenadas -> `MSG002` ("Informamos que a ausência desse dado pode comprometer...")
- [ ] **4.11** Validação 3: exibição de `MSG003` -> clicar em *"Não"* -> preserva dados intactos
- [ ] **4.12** Finalização: clicar em *"Sim"* na `MSG003` -> exibir `MSG004` com número do RE (`AAAA.sequencial6/INEMA/RE`)
- [ ] **4.13** Pós-finalização: formulário em modo leitura, botões Finalizar/Excluir somem, seção Relatórios surge

### Bloco 5: Relatórios & Correção de Vínculo pelo Gestor
- [ ] **5.1** Na seção Relatórios: validar que constam *Conclusivo* e *Complementar*. RPEQ **NÃO** deve aparecer (apenas aviso de restrição de vínculo)
- [ ] **5.2** Enviar PDF no Relatório Conclusivo, recarregar página e checar persistência do anexo
- [ ] **5.3** Logout e Login como **Gestor** (`111.111.111-11` / `gestor123`)
- [ ] **5.4** Acessar *Fiscalização > Associar Técnico*, localizar o RE e clicar em *"Corrigir vínculo"*
- [ ] **5.5** Alterar vínculo para *"Sim"*, preencher empresa e cargo, salvar
- [ ] **5.6** Retornar ao portal externo com o mesmo CPF: em *Meus registros > Abrir*, verificar se o **RPEQ** agora aparece liberado
- [ ] **5.7** Enviar PDF no RPEQ e validar upload com sucesso

### Bloco 6: Associação do Técnico Plantonista (Call Center)
- [ ] **6.1** Login como **Call Center** (`123.456.789-01` / `@Callcenter123`)
- [ ] **6.2** Acessar *Fiscalização > Associar Técnico*
- [ ] **6.3** Validar que o RE externo aparece na fila junto aos internos
- [ ] **6.4** Validar ordenação da lista de técnicos: 1º plantonistas em Salvador, 2º plantonistas nos demais municípios
- [ ] **6.5** Selecionar técnico, associar e salvar
- [ ] **6.6** Validar que o status do RE é alterado para **Análise Técnica**

### Bloco 7: Consulta, Rascunho & Exclusão
- [ ] **7.1** Retornar ao portal externo com o CPF do comunicante
- [ ] **7.2** Acessar *Meus registros*: validar que o RE exibe status **Análise Técnica**
- [ ] **7.3** Clicar em *"Nova Emergência Química"*, preencher campos parciais (sem finalizar)
- [ ] **7.4** Sair do sistema, logar novamente com o mesmo CPF -> validar que o rascunho é recuperado
- [ ] **7.5** Clicar em *"Excluir Emergência"* -> validar exibição de `MSG007` -> confirmar -> validar exclusão definitiva do rascunho

---

## 🐞 Registro de Ocorrências / Bugs Encontrados
*(Será preenchido conforme a execução dos testes)*
