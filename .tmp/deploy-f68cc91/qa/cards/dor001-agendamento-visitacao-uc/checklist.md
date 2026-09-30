# Checklist Interno de Homologacao - DOR001 (Agendamento de Visitacao em UC)

- **Tela / Modulo**: Modulo Gestao de Unidades de Conservacao > Agendamento de Visitacao (F-DUC-069-00)
- **Documento de Referencia**: DOR001 - Agendamento de Atividades de Visitacao em UC
- **Data da Validacao**: 18/09/2026
- **Status Geral**: APROVADO

---

## Mapeamento de Regras de Negocio (RN)
- [x] **RN001 - Protocolo Nao Autorizativo**: Exibicao do banner explicativo e exigencia de declaracao no envio (MSG001/MSG007).
- [x] **RN002 / RN003 - Elegibilidade e Catalogo de UCs**: Validacao de habilitacao no CEUC e listagem parametrizada pela CGEUC/DISUC.
- [x] **RN004 / RN005 - Atrativo e Interdicao**: Bloqueio preventivo caso a trilha ou atrativo esteja sob manutencao (MSG004).
- [x] **RN006 - Conflito de Agenda**: Alerta de sobreposicao de data/horario/local com outras atividades (MSG005).
- [x] **RN007 - Horario de Funcionamento**: Exigencia de justificativa caso a visita ocorra fora do horario regular (07h as 18h) (MSG006).
- [x] **RN008 - Periodo de Montagem/Desmontagem**: Campos dedicados a carga, descarga e desmobilizacao.
- [x] **RN009 - Atividade Periodica**: Suporte a recorrencia e intervalo de realizacao.
- [x] **RN010 - Classificacao da Atividade**: Selecao da tipologia (Educacional, Esportiva, Cultural, etc.).
- [x] **RN011 - Triagem e Sombreamento com AAD**: Alerta de redirecionamento quando houver coleta/captura de especimes (DOR003).
- [x] **RN012 - Triagem e Sombreamento com Pesquisa**: Redirecionamento quando se tratar de projeto cientifico formal (DOR004).
- [x] **RN013 - Triagem e Sombreamento com AUI**: Alerta de captacao comercial de imagem.
- [x] **RN014 - Carater Comercial**: Declaracao de cobranca de ingresso e patrocinio (MSG009).
- [x] **RN015 - Publico e Capacidade de Carga**: Dimensionamento de participantes, espectadores e equipe de apoio.
- [x] **RN016 a RN021 - Infraestrutura, Veiculos, Seguranca e Residuos**: Estruturas temporarias, transito veicular, mitigacao de residuos e comunidades tradicionais.
- [x] **RN022 - Reserva Preliminar**: Registro operacional na pauta sem substituir portaria formal (MSG013).
- [x] **RN023 - Reaproveitamento de Dados**: Conversao para processo formal SEI-BA (MSG014).
- [x] **RN024 - Historico de Decisoes e Complementacoes**: Acoes do gestor (MSG012/MSG015).
- [x] **RN025 - Salvamento de Rascunho**: Persistencia preliminar da solicitacao.
- [x] **RN026 - Numeracao da Solicitacao**: Codigo proprio (padrao AG-YYYY-XXX).

---

## Telas Mapeadas (TL)
- [x] **TL001**: Tela inicial com orientacoes e navegacao
- [x] **TL002**: Selecao da UC e elegibilidade
- [x] **TL003**: Local pretendido, atrativo e agenda
- [x] **TL004**: Responsaveis pela atividade
- [x] **TL005**: Caracterizacao da atividade e triagem
- [x] **TL006**: Publico estimado e carater comercial
- [x] **TL007**: Infraestrutura, equipamentos e residuos
- [x] **TL008**: Revisao consolidada, declaracoes e envio
- [x] **TL009**: Pauta de Analise do Gestor da UC
- [x] **TL010**: Calendario de Uso Publico da UC
- [x] **TL012**: Check-out e encerramento pos-atividade
