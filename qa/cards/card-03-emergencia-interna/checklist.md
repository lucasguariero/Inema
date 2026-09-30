# Checklist de Teste — DOR003: Fiscalização - Registro de Emergência Interna

**Card:** 3- Fiscalização- Registro de Emergência interna (DOR003)  
**Ambiente:** `https://gla-inema-hml.acto.com.br/`  
**Data da Homologação:** 10/09/2026  
**Status Geral:** ✅ **RESOLVIDO / HOMOLOGADO COM SUCESSO**  
**RE de Teste Criado e Validado:** `2026.000017/INEMA/RE`

---

## 1. Cadastro de Plantonista & Duplicidade (Admin)
- [x] Login com Admin (`000.000.000-00` / `admin123`)
- [x] Acesso a `Administração › Fiscalização › Plantonistas › Cadastrar Plantonista`
- [x] Selecionar técnico já cadastrado e salvar
- [x] **Validação**: Sistema recusa com alerta de duplicidade informando que o técnico já está cadastrado como plantonista (`Print 01 - Recusa duplicidade plantonista.png`).

---

## 2. Cadastro de Escala de Plantão & Validações (Admin)
- [x] Acesso a `Administração › Fiscalização › Escalas de Plantão › Cadastrar Escala`
- [x] Seleção de Plantonista (Bruno Carvalho) e Município coberto (Salvador)
- [x] **Validação Datas Invertidas**: Início 20/09/2026 e Fim 08/09/2026 recusado com a mensagem `"O fim do plantão não pode ser anterior ao início."` (`Print 01`).
- [x] **Gravação Válida**: Início 01/10/2026 a 15/10/2026 gravada com sucesso (`Print 03 - Escala salva com sucesso.png`).
- [x] **Filtros na Listagem**: Filtro "Vigente em" aplicado para 15/09/2026 (exibe escalas ativas - `Print 02`) e para 15/11/2026 (retorna estado vazio "Sem registros" - `Print 05`).
- [!] **Observação (Fora do Escopo)**: Ao tentar duplicar período para um mesmo plantonista, a aplicação estoura Erro 500 (`UniqueConstraintViolationException`) em vez de validação amigável.

---

## 3. Segurança e Grupos de Usuários
- [x] Acesso a `Administração › Segurança › Usuários`
- [x] Visualização do grupo "Equipe de Call Center" e usuários vinculados (`Print 06 - Seguranca usuarios Call Center.png`).

---

## 4. Geração Automática do Número do RE
- [x] Acesso a `Fiscalização › Nova Emergência` como Gestor (`111.111.111-11`)
- [x] Número do RE já visível no cabeçalho antes do preenchimento (`Print 07 - Numero RE gerado antes de preencher.png`).
- [x] Ao recarregar (F5), um novo número sequencial é gerado e o anterior descartado (`Print 08 - F5 gera novo numero RE sequencial.png`).

---

## 5. Validações do Formulário de Emergência Química
- [x] **Origem da Denúncia**: 8 opções disponíveis conforme requisito; selecionado Call Center.
- [x] **Data/Hora Futura**: Bloqueio de data futura (`Print 09 - Recusa data futura.png`).
- [x] **Tipo "Outros"**: Exibição dinâmica obrigatória do campo de descrição livre; limpeza do texto ao trocar de tipo (`Print 10 - Tipo Outros descricao obrigatoria.png`).
- [x] **Anexos**: Arquivos não suportados recusados pelo componente com aviso de tipo inválido (`Print 11 - Recusa anexo invalido MSG005.png`); anexo PDF aceito com sucesso.
- [x] **CEP 40020-000**: Preenchimento automático de Salvador, Rua Chile, Centro (`Print 12 - Preenchimento automatico CEP.png`).
- [x] **Áreas Atingidas**: Seleção de 3 áreas com bloqueio ao tentar marcar a 4ª (`Print 13 - Limite 3 areas atingidas.png`).
- [x] **Coordenadas**: Decimal Latitude -12.9777 e Longitude -38.5016 preenchidas (`Print 14 - Coordenadas preenchidas.png`).
- [x] **Comunicante**: Vínculo "Não" abre campo da empresa responsável (`Print 15 - Comunicante vinculo Nao empresa.png`).

---

## 6. Validações de Finalização
- [x] **Campos Vazios**: Bloqueio com alerta MSG001 (`Print 16 - Bloqueio campos obrigatorios MSG001.png`).
- [x] **Sem Coordenadas**: Exibição do alerta modal MSG002 ("Coordenadas não informadas...") com ação "Voltar e informar" (`Print 03`).
- [x] **Confirmação MSG003**: Clicar "Não, revisar" mantém a tela e dados intactos (`Print 19 - Clicar Nao mantem tela.png`).
- [x] **Conclusão com Sucesso**: Clicar "Sim, finalizar" grava o registro gerando RE `2026.000017/INEMA/RE`, exibindo notificação MSG004 e atualizando status para "Emergência Registrada" (`Print 04`).

---

## 7. Associação de Técnico Plantonista (Gestor)
- [x] Acesso a `Fiscalização › Associar Técnico`
- [x] Localização do RE `2026.000017/INEMA/RE`
- [x] Plantonistas de Salvador (Bruno Carvalho e Carla Mendes) ordenados no modal (`Print 21 - Plantonistas ordenados no topo.png`).
- [x] Associação de Bruno Carvalho salva com sucesso; situação transiciona para "Análise Técnica" (`Print 22 - Status Analise Tecnica.png`).

---

## 8. Notificação e Ciência pelo Plantonista (Bruno Carvalho)
- [x] Login com Bruno Carvalho (`196.000.000-42` / `@Plantao123`)
- [x] Badge numérico no menu `Fiscalização › Minhas Análises` e notificação no cabeçalho.
- [x] Registro `2026.000017/INEMA/RE` com indicador `• Aguardando sua ciência`.
- [x] Ao visualizar os detalhes da análise, ciência formal é registrada com carimbo de data/hora (`10/09/2026 12:54`) e contador do menu decresce (`Print 05`).

---

## 9. Informações Adicionais e Exclusão (Gestor)
- [x] Login como Gestor; abertura do RE em `Minhas Emergências`.
- [x] 4 seções principais bloqueadas em modo somente leitura e botão Finalizar desabilitado (`Print 25 - RE finalizada somente leitura.png`).
- [x] Registro de 2 informações adicionais acumulativas com data/hora e autor (`Print 06`).
- [x] Botão `Excluir Emergência` abre modal de confirmação MSG007 (`Print 07`).
- [x] "Não" preserva o registro intacto; "Sim, excluir" remove definitivamente o RE da listagem (`Print 28 - Registro excluido com sucesso.png`).
