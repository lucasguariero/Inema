# Checklist de Teste e Homologação — DOR005.1 (Consulta de Registros Externos)

> **Ambiente**: https://gla-inema-hml.acto.com.br/ (Clone Vercel: https://inema-six.vercel.app/consulta-externa)  
> **Card**: 5.1 - Fiscalização - Consulta de Registros Externos  
> **Data de Homologação**: 09/09/2026  
> **Líder de QA**: Lucas Guariero  
> **Status Geral**: ✅ **APROVADO / HOMOLOGADO COM SUCESSO (100%)**  
> **Comunicante de Teste**: Giovani Silva (`529.982.247-25`)

---

## 📋 Matriz de Requisitos e Regras de Negócio Testadas

### Bloco 1: Acesso & Escopo de Registros
- [x] **RN001 / RN002**: Apenas registros próprios ou expressamente vinculados ao usuário autenticado (ou portador de credencial válida) são listados.
- [x] **RN019 / MSG011 / MSG012**: Simulação de controle de acesso testada com bloqueio para registros sem permissão (`MSG011`) e sessão expirada (`MSG012`).

### Bloco 2: Filtros de Pesquisa
- [x] **LEG001 a LEG006**: Todos os campos presentes com labels e legendas oficiais.
- [x] **RN003**: Filtros preenchidos são combinados cumulativamente.
- [x] **RN004**: O filtro "Tipo da Emergência Química" (LEG005) permanece desabilitado por padrão e é habilitado **apenas** quando "Tipo de registro" = *Emergência Química (RE)*. Ao retornar para *Todos* ou *RD*, o campo é limpo e desabilitado automaticamente.
- [x] **RN005 / MSG001**: Data inicial posterior à data final dispara o alerta `"A data inicial não pode ser posterior à data final."`.
- [x] **RN005 / MSG002**: Data futura no período dispara o alerta `"O período do registro não pode conter data futura."`.
- [x] **RN016 / BOT002**: Acionamento de "Limpar filtros" restaura todos os campos aos valores padrão e reexecuta a busca geral sem filtros.
- [x] **RN017 / MSG004**: Consulta com filtros sem correspondência exibe a mensagem informativa `"Nenhum registro foi encontrado para os filtros informados."`, mantendo os filtros preenchidos.

### Bloco 3: Listagem, Ordenação & Totalização
- [x] **RN006**: Registros ordenados do mais recente para o mais antigo por padrão.
- [x] **RN007 / LEG007**: Colunas completas: Número do Registro, Data e Hora, Tipo de Registro, Município, Status/Situação e Ações.
- [x] **RN008 / BOT010**: Totalizador de registros exibido e navegação entre páginas preservando filtros.
- [x] **RN022**: Registros com processo formal vinculado exibem link clicável com redirecionamento contextual.

### Bloco 4: Visualização Protegida & PDF
- [x] **RN010 / BOT003**: Ação "Visualizar" abre Drawer lateral em modo somente leitura (sem permissão de edição), ocultando notas técnicas e despachos sigilosos do analista interno.
- [x] **RN011 / BOT004**: Ação "Baixar PDF" gera espelho institucional contendo apenas os dados autorizados ao usuário externo.

### Bloco 5: Anexação de Relatórios Regulatórios
- [x] **RN012 / BOT005**: Relatório Preliminar (RPEQ) habilitado apenas para RE e quando o comunicante declarou vínculo = SIM.
- [x] **RN012 / BOT006**: Relatório Conclusivo habilitado para RE em qualquer status.
- [x] **RN012 / BOT007**: Relatório Complementar habilitado para RE em qualquer status.
- [x] **RN013 / MSG005**: Validação de extensões permitidas (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, MP4, MP3, ZIP, SHP, KML, etc.) e limite de 50MB.
- [x] **RN014 / MSG006**: Tentativa de submissão sem arquivo dispara `"Selecione o tipo de relatório e um arquivo para continuar."`.
- [x] **RN014 / MSG007**: Confirmação prévia exigida com a mensagem `"Deseja anexar este relatório ao registro?"`.
- [x] **RN015 / MSG008**: Sucesso do envio com toast `"Relatório anexado com sucesso."` e registro auditável com identificação do usuário, data e hora.

### Bloco 6: Sincronização em Tempo Real (Estado Compartilhado)
- [x] Ocorrência cadastrada no fluxo externo DOR004 (`src/emergencia-quimica-externa.html`) é persistida em `INEMA_SEIA_REGISTROS_EXTERNOS` e aparece de imediato no topo da tabela do DOR005.1 com status `Emergência Registrada`.
