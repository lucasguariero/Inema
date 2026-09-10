# Checklist de Teste e Homologação — DOR003 (Emergência Química Interna)

> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Card**: 3 - Fiscalização - Registro de Emergência interna  
> **Data**: 2026-09-09  
> **Líder de QA**: Lucas Guariero  
> **Status Geral**: 🟡 Em Fila / Pronto para Execução

---

## 👥 Perfis e Credenciais de Teste

| Perfil | CPF | Senha | Finalidade no Teste |
|---|---|---|---|
| **Admin** | `000.000.000-00` | `admin123` | Parametrização: Cadastro de Plantonista, Escala de Plantão e Permissões |
| **Gestor** | `111.111.111-11` | `gestor123` | Abertura do RE interno, preenchimento, finalização, info adicional e exclusão |
| **Call Center** | `123.456.789-01` | `@Callcenter123` | Associação do técnico plantonista na fila de atendimento |
| **Plantonista (Bruno Carvalho)** | `196.000.000-42` | `@Plantao123` | Verificação de Minhas Análises, sino de notificações e PDF anexo |

---

## 📋 Matriz de Testes — DOR003

### Bloco 1: Parametrização de Plantonistas (Admin)
- [ ] **1.1** Login como Admin (`000.000.000-00` / `admin123`)
- [ ] **1.2** Acessar *Administração › Fiscalização › Plantonistas › Cadastrar Plantonista*
- [ ] **1.3** Selecionar um técnico na lista e salvar
- [ ] **1.4** Tentar cadastrar o mesmo técnico novamente -> validar que o sistema recusa a duplicidade

### Bloco 2: Parametrização de Escala de Plantão (Admin)
- [ ] **2.1** Acessar *Administração › Fiscalização › Escalas de Plantão › Cadastrar Escala*
- [ ] **2.2** Selecionar o plantonista cadastrado
- [ ] **2.3** Em *Municípios cobertos*, selecionar Salvador (e opcionalmente outros)
- [ ] **2.4** Definir Início: `08/09/2026` e Fim: `20/09/2026`
- [ ] **2.5** Teste de validação: inverter datas (Fim anterior ao Início) -> sistema deve recusar
- [ ] **2.6** Salvar a escala de plantão com datas válidas
- [ ] **2.7** Testar filtro *Vigente em*:
  - Data `15/09/2026` -> a escala deve aparecer
  - Data `15/10/2026` -> a escala NÃO deve aparecer

### Bloco 3: Segurança e Usuário Call Center (Admin)
- [ ] **3.1** Acessar *Administração › Segurança › Usuários*
- [ ] **3.2** Localizar usuário Call Center e validar atribuição ao grupo *Equipe de Call Center*

### Bloco 4: Abertura de Nova Emergência Interna (Gestor)
- [ ] **4.1** Login como Gestor (`111.111.111-11` / `gestor123`)
- [ ] **4.2** Acessar *Fiscalização › Nova Emergência*
- [ ] **4.3** Validar no cabeçalho o número `2026.0000XX/INEMA/RE` gerado na abertura (RN002 / CA002)
- [ ] **4.4** Recarregar a página (`F5`) e validar que um NOVO número é gerado a cada abertura (RN001)

### Bloco 5: Preenchimento do Formulário Interno
- [ ] **5.1** Campo *Origem*: validar as 8 opções da RN004 e selecionar *Call Center*
- [ ] **5.2** Data/Hora do comunicado: informar data entre `08/09` e `20/09/2026`; testar data futura -> deve recusar
- [ ] **5.3** Tipo da Emergência: selecionar *Outros* -> validar campo de descrição obrigatório (RN024)
- [ ] **5.4** Trocar para outro tipo -> validar que a descrição personalizada não é gravada
- [ ] **5.5** Anexos: enviar PDF e validar legenda informativa fixa MSG005
- [ ] **5.6** CEP: digitar `40020-000` -> autocompletar Salvador - BA, Centro, Rua Chile (RN019)
- [ ] **5.7** Área Atingida: marcar 3 opções; tentar a 4ª -> bloqueio imediato (máx. 3 áreas, RN010)
- [ ] **5.8** Tooltips de área: conferir textos em *Comunidade Tradicional* e *Unidade de Conservação* (RN029)
- [ ] **5.9** Coordenadas múltiplas:
  - 1ª coordenada em Grau Decimal: Lat `-12.9777` / Long `-38.5016`
  - Clicar em *Incluir nova coordenada*
  - 2ª coordenada em UTM 23S: E `550000` / N `8565000`
- [ ] **5.10** Comunicante: máscara dinâmica telefone fixo vs celular; Vínculo = Não exibe *Nome da empresa* (RN025/RN026)

### Bloco 6: Validações e Finalização da Emergência
- [ ] **6.1** Validação 1: clicar em *Finalizar Emergência* com obrigatório vazio -> `MSG001` com destaque no campo
- [ ] **6.2** Validação 2: com obrigatórios preenchidos e sem coordenadas -> modal de alerta `MSG002`
- [ ] **6.3** Validação 3: exibição do modal `MSG003` -> clicar em *Não* -> preserva dados intactos
- [ ] **6.4** Finalização: clicar em *Sim* na `MSG003` -> exibir `MSG004` com o número do RE
- [ ] **6.5** Validar atribuição do status **Emergência Registrada**

### Bloco 7: Associação do Técnico Plantonista (Call Center / Gestor)
- [ ] **7.1** Acessar *Fiscalização › Associar Técnico*
- [ ] **7.2** Localizar o RE gerado na fila
- [ ] **7.3** Clicar em *Associar técnico* e verificar a ordenação dos técnicos:
  - 1º plantonistas em Salvador
  - 2º plantonistas nos demais municípios
- [ ] **7.4** Selecionar técnico e salvar -> status altera para **Análise Técnica**

### Bloco 8: Alertas e Caixa de Análises do Plantonista (Bruno Carvalho)
- [ ] **8.1** Login como Bruno Carvalho (`196.000.000-42` / `@Plantao123`)
- [ ] **8.2** Acessar *Fiscalização › Minhas Análises*: verificar indicador numérico vermelho no menu
- [ ] **8.3** Abrir sino de notificações: aviso em vermelho com botão *Abrir*
- [ ] **8.4** Clicar em *Abrir*: abre a tela com o registro e o contador no menu diminui imediatamente
- [ ] **8.5** Validar recebimento de e-mail / alerta com o formulário do RE em PDF anexado (RN016 / RN017)

### Bloco 9: Informações Adicionais e Exclusão (Gestor)
- [ ] **9.1** Login como Gestor (`111.111.111-11`)
- [ ] **9.2** Acessar *Fiscalização › Minhas Emergências* e clicar em *Abrir* no RE finalizado
- [ ] **9.3** Validar modo leitura: 4 primeiras seções bloqueadas e botão Finalizar ausente
- [ ] **9.4** Seção *Informações Adicionais*: registrar 1ª informação; registrar 2ª informação
- [ ] **9.5** Validar que ficam acumuladas abaixo com autor e data, sem alterar a descrição original do RE
- [ ] **9.6** Clicar em *Excluir Emergência* -> validar modal `MSG007` -> clicar em *Não* -> dados preservados
- [ ] **9.7** Clicar em *Excluir Emergência* -> responder *Sim* -> validar exclusão definitiva do registro
