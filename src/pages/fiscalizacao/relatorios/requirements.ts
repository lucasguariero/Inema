// Generated verbatim from the frozen Mission01 matrices. IDs never cross document namespaces.
export const REQUIREMENTS = {
  "DOR008": {
    "RN001": {
      "text": "Somente técnico interno autenticado e autorizado pode criar, editar, excluir rascunho e finalizar RFA.",
      "label": "Acesso à funcionalidade",
      "location": "body[31]/table/row[2]"
    },
    "RN002": {
      "text": "O acesso ao RFA deve ser restrito aos perfis internos autorizados, respeitando as permissões de criação, consulta, edição, exclusão, finalização, devolução e reenvio.",
      "label": "Perfis internos autorizados",
      "location": "body[31]/table/row[3]"
    },
    "RN003": {
      "text": "O RFA deve possuir, no mínimo, os estados Rascunho, Finalizado e Devolvido para ajuste. O rascunho pode ser editado ou excluído pelo elaborador autorizado. O relatório Finalizado fica bloqueado para edição até eventual devolução pelo gestor.",
      "label": "Estados do RFA",
      "location": "body[31]/table/row[4]"
    },
    "RN004": {
      "text": "Ao iniciar o preenchimento, o sistema deve perguntar se o técnico deseja aproveitar um relatório existente.",
      "label": "Aproveitamento de relatório",
      "location": "body[31]/table/row[5]"
    },
    "RN005": {
      "text": "A busca deve aceitar CPF/CNPJ, Nome/Razão social, número do relatório, número do processo, CEFIR/CAR, data, município e unidade de conservação.",
      "label": "Busca de relatório existente",
      "location": "body[31]/table/row[6]"
    },
    "RN006": {
      "text": "Na finalização, gerar número único no padrão 0000/AAAA-0000, com reinício anual. O significado e a sequência dos dois blocos numéricos permanecem pendentes de definição.",
      "label": "Numeração do RFA",
      "location": "body[31]/table/row[7]"
    },
    "RN007": {
      "text": "O RFA deve ser associado a processo originador. Autos de infração e notificações vinculados devem ser recuperados a partir desse processo.",
      "label": "Processo originador",
      "location": "body[31]/table/row[8]"
    },
    "RN008": {
      "text": "Data e hora de término não podem ser anteriores à data e hora de início, e o período não pode estar no futuro.",
      "label": "Período do atendimento",
      "location": "body[31]/table/row[9]"
    },
    "RN009": {
      "text": "O técnico pode informar uma ou mais coordenadas para representar os locais inspecionados.",
      "label": "Múltiplas coordenadas",
      "location": "body[31]/table/row[10]"
    },
    "RN010": {
      "text": "O sistema deve aceitar os formatos Geográfica/Grau Decimal, Grau/Min/Seg, UTM 23 e UTM 24, com latitude e longitude de até 10 caracteres numéricos. Independentemente do formato informado, deve converter e armazenar as coordenadas geográficas em grau decimal, preservando o valor original para auditoria.",
      "label": "Conversão de coordenadas",
      "location": "body[31]/table/row[11]"
    },
    "RN011": {
      "text": "Após o usuário informar ao menos uma coordenada válida e acionar “Consultar dados geoespaciais”, o sistema deve consultar no GeoServer todas as camadas definidas na RN013 e apresentar as ocorrências e sobreposições encontradas. As camadas devem ser consultadas de forma independente, sem aplicação de prioridade entre elas.",
      "label": "Consulta geoespacial no GeoServer",
      "location": "body[31]/table/row[12]"
    },
    "RN012": {
      "text": "Para cada coordenada válida, a consulta deve sempre verificar a localização exata e os elementos situados em um raio de 500 metros nas camadas disponíveis no GeoServer.",
      "label": "Localização exata e raio de consulta",
      "location": "body[31]/table/row[13]"
    },
    "RN013": {
      "text": "A consulta deve contemplar município (toca), bacia hidrográfica (toca), recurso hídrico (raio de 500 m), unidade de conservação (toca), CEFIR/CAR (toca) – distinguir tipologias: imóvel rural ou assentamentos ou povos e comunidades tradicionais, aplicação da Lei da Mata Atlântica (toca), bioma (toca), reserva legal (toca), APP (toca), e sede municipal (trazer a mais próxima).\nO dado de recurso hídrico será apresentado para o técnico selecionar com a opção de importar ou não para o RFA, sendo os demais de importação automática e obrigatória, não apresentado retorno o sistema deverá inserir o texto: Não se aplica.",
      "label": "Dados geoespaciais",
      "location": "body[31]/table/row[14]"
    },
    "RN014": {
      "text": "Empreendimentos, licenças e autorizações relacionados à localização devem ser obtidos das camadas correspondentes publicadas no GeoServer.",
      "label": "Empreendimentos e dados de regulação",
      "location": "body[31]/table/row[15]"
    },
    "RN015": {
      "text": "Ao informar CPF/CNPJ ou Nome/Razão social, consultar cadastros existentes e permitir a seleção do cadastro correspondente, sem sobrescrever dados sem confirmação.",
      "label": "Consulta de pessoa",
      "location": "body[31]/table/row[16]"
    },
    "RN016": {
      "text": "Validar formato e dígitos verificadores do CPF/CNPJ antes da consulta ou gravação.",
      "label": "Validação de CPF/CNPJ",
      "location": "body[31]/table/row[17]"
    },
    "RN017": {
      "text": "A inspeção pode possuir um ou mais participantes, com inclusão e remoção enquanto o RFA estiver em rascunho.",
      "label": "Múltiplos participantes",
      "location": "body[31]/table/row[18]"
    },
    "RN018": {
      "text": "Para executar a consulta de histórico, o técnico deve informar obrigatoriamente CPF/CNPJ, município, data inicial e data final. A data final não pode ser anterior à data inicial.",
      "label": "Consulta de histórico por intervalo",
      "location": "body[31]/table/row[19]"
    },
    "RN019": {
      "text": "Exibir somente resultados que possuam licenças, autorização, auto de infração, notificação ou requerimento em aberto, identificando processo e data.",
      "label": "Conteúdo do histórico",
      "location": "body[31]/table/row[20]"
    },
    "RN020": {
      "text": "Permitir selecionar mais de um resultado e expandir seus detalhes antes de incorporá-los ao relatório.",
      "label": "Seleção do histórico",
      "location": "body[31]/table/row[21]"
    },
    "RN021": {
      "text": "Campos importados de relatório anterior ou histórico devem ser destacados e manter indicação de origem até a finalização.",
      "label": "Dados reaproveitados",
      "location": "body[31]/table/row[22]"
    },
    "RN022": {
      "text": "O RFA pode conter uma ou mais infrações e uma ou mais notificações.",
      "label": "Múltiplas infrações e notificações",
      "location": "body[31]/table/row[23]"
    },
    "RN023": {
      "text": "Nome/Razão social, CPF/CNPJ e endereço devem ser preenchidos a partir da identificação quando forem da mesma pessoa, permitindo alteração justificada quando forem diferentes.",
      "label": "Dados do autuado/destinatário",
      "location": "body[31]/table/row[24]"
    },
    "RN024": {
      "text": "O sistema deve tratar Caracterização da Infração e Dispositivo Normativo Infringido como campos distintos. A Caracterização da Infração deve utilizar as fontes da RN037 e os desdobramentos das RN044 a RN050. O Dispositivo Normativo Infringido deve respeitar a prioridade da RN039 e os desdobramentos das RN041 a RN043. Ao selecionar um artigo, o sistema deve habilitar somente os incisos, parágrafos ou alíneas vinculados a ele.",
      "label": "Seleção dos campos normativos",
      "location": "body[31]/table/row[25]"
    },
    "RN025": {
      "text": "Aceitar JPEG, JPG, PNG, BMP, MP3, MP4, PDF, DOC, DOCX, TXT, XLS, XLSX, SHP, SHX, DBF, PRJ, KML, KMZ e ZIP.",
      "label": "Formatos de anexos",
      "location": "body[31]/table/row[26]"
    },
    "RN026": {
      "text": "Como terceira opção de prioridade do campo Dispositivo Normativo Infringido, o sistema deve disponibilizar campo aberto para descrição de outras normas, com até 500 caracteres. O campo pode ser preenchido mesmo quando houver outro dispositivo normativo selecionado.",
      "label": "Outras normas infringidas",
      "location": "body[31]/table/row[27]"
    },
    "RN027": {
      "text": "Salvar Rascunho deve persistir os dados preenchidos sem gerar número definitivo nem iniciar o encaminhamento.",
      "label": "Salvar rascunho",
      "location": "body[31]/table/row[28]"
    },
    "RN028": {
      "text": "Finalizar Relatório deve validar campos obrigatórios, salvar os dados, gerar o número definitivo, impedir edições não autorizadas e iniciar o fluxo de encaminhamento. Quando o relatório estiver Devolvido para ajuste, a mesma ação deve validar e reenviar os ajustes, preservando o número do RFA.",
      "label": "Finalização e reenvio",
      "location": "body[31]/table/row[29]"
    },
    "RN029": {
      "text": "Excluir deve exigir confirmação e ser permitido somente para rascunho e usuário autorizado. A ação deve ser auditada.",
      "label": "Exclusão",
      "location": "body[31]/table/row[30]"
    },
    "RN030": {
      "text": "O sistema deve registrar o técnico responsável pela emissão do RFA e a data e hora da geração do relatório.",
      "label": "Responsabilidade técnica",
      "location": "body[31]/table/row[31]"
    },
    "RN031": {
      "text": "Registrar criação, alterações, importações, consultas de dados no GeoServer, anexações, exclusão, finalização, encaminhamento, devolução e reenvio.",
      "label": "Auditoria",
      "location": "body[31]/table/row[32]"
    },
    "RN032": {
      "text": "Restringir dados pessoais e documentos conforme perfil, finalidade e vínculo com o processo, inclusive em acesso por endereço eletrônico direto.",
      "label": "Segurança e proteção de dados",
      "location": "body[31]/table/row[33]"
    },
    "RN033": {
      "text": "Quando o GeoServer estiver total ou parcialmente indisponível, o sistema deve apresentar somente uma mensagem de alerta, manter os resultados obtidos nas camadas disponíveis e permitir a continuidade do preenchimento. A indisponibilidade não deve bloquear o preenchimento, o salvamento do rascunho nem a finalização do RFA.",
      "label": "Indisponibilidade do GeoServer",
      "location": "body[31]/table/row[34]"
    },
    "RN034": {
      "text": "O sistema deve disponibilizar os catálogos de Caracterização da Infração (Anexo VI – não obrigatório) e Dispositivo Normativo Infringido (Obrigatória a seleção de ao menos um) conforme as fontes, a ordem e os desdobramentos definidos nas RN037 a RN050.",
      "label": "Catálogo normativo",
      "location": "body[31]/table/row[35]"
    },
    "RN035": {
      "text": "Os campos obrigatórios e as demais pendências impeditivas devem ser destacados antes da finalização; o rascunho pode ser salvo com preenchimento parcial. A indisponibilidade total ou parcial do GeoServer deve gerar somente os alertas previstos na RN033 e não deve impedir a finalização.",
      "label": "Validação para finalização",
      "location": "body[31]/table/row[36]"
    },
    "RN036": {
      "text": "Cada anexo deve registrar nome, formato, tamanho, descrição, usuário, data e hora; arquivos devem passar por validação de segurança antes da disponibilização.",
      "label": "Anexos e evidências",
      "location": "body[31]/table/row[37]"
    },
    "RN037": {
      "text": "Deverá haver a opção para o técnico adicionar uma infração, ao selecionar deverá ser apresentado um campo aberto obrigatório com o título Caracterização da Infração (Anexo VI) – 1000 caracteres; no trecho Anexo VI, do título deste campo, haverá um hiperlink para a página: https://www.legislabahia.ba.gov.br/documentos/decreto-no-14024-de-06-de-junho-de-2012. O sistema deve permitir que o técnico adicione mais de uma infração, e para cada infração adicionada o sistema deve prever as Regras RN038 a RN050.",
      "label": "Caracterização da Infração",
      "location": "body[31]/table/row[38]"
    },
    "RN038": {
      "text": "Ao selecionar o campo de Dispositivo Normativo Infringido, será obrigatória a seleção de ao menos uma das fontes da RN039 e será apresentado o campo artigo 249 (RN044) com os incisos I, II e VI automaticamente já selecionados e bloqueados, não permitindo que sejam desmarcados.",
      "label": "Dispositivo Normativo Infringido",
      "location": "body[31]/table/row[39]"
    },
    "RN039": {
      "text": "O campo Dispositivo Normativo Infringido deve apresentar as fontes nesta ordem: 1 — prioritariamente, a Lei nº 10.431, de 20/12/2006, a nº 11.612 de 08/10/2009, e os arts. 254 e 255 do Regulamento da Lei aprovado pelo Decreto Estadual nº 14.024, de 06/06/2012; 2 — posteriormente, a Lei de Crimes Ambientais, Lei nº 9.605, de 12/02/1998, e o Decreto nº 6.514, de 22/07/2008; 3 — ao selecionar o campo aberto para descrição de outras normas, conforme a RN026, o sistema deverá automaticamente selecionar o Artigo 254, Parágrafo único, Inciso VIII permitindo a digitação de outras normas (500 caracteres).",
      "label": "Prioridade do Dispositivo Normativo Infringido",
      "location": "body[31]/table/row[40]"
    },
    "RN040": {
      "text": "Ao selecionar a fonte 1 da RN039, será obrigatória a seleção do artigo 254 e/ou 255.",
      "label": "Dispositivo Normativo Infringido",
      "location": "body[31]/table/row[41]"
    },
    "RN041": {
      "text": "Ao selecionar o Art. 254 do Regulamento da Lei aprovado pelo Decreto Estadual nº 14.024, de 06/06/2012, deve apresentar como infração administrativa ambiental toda ação ou omissão, voluntária ou involuntária, que viole as regras jurídicas de uso, gozo, promoção, proteção e recuperação do meio ambiente e resulte em: I — risco de poluição ou degradação do meio ambiente; e/ou II — efetiva poluição ou degradação ambiental; e/ou III — emissão, lançamento ou liberação de efluentes líquidos, gasosos ou resíduos sólidos em desacordo com os padrões estabelecidos, e/ou que tornem ou possam tornar ultrapassados os padrões de qualidade ambiental e/ou Parágrafo único, com ao menos um obrigatório.",
      "label": "Dispositivo Normativo Infringido — Art. 254",
      "location": "body[31]/table/row[42]"
    },
    "RN042": {
      "text": "Ao selecionar o parágrafo único do Art. 254, o sistema deve apresentar: I — executar obras, instalar, implantar, alterar, testar ou operar equipamentos ou empreendimentos, bem como exercer atividades ou explorar recursos naturais sem as necessárias anuências, autorizações, licenças ambientais ou registros, ou em desacordo com eles; II — inobservar ou deixar de cumprir normas regulamentares e exigências técnicas ou administrativas dos órgãos executores do SISEMA, SEGREH ou CEPRAM; III — descumprir condicionantes ou prazos de notificações, anuências, autorizações, licenças ou autos de infração; IV — descumprir compromissos do TCRA; V — descumprir obrigações, condições ou prazos de termo de compromisso com o INEMA; VI — deixar de atender determinação dos órgãos executores do SISEMA ou CEPRAM, inclusive quanto a planos de controle, medidas mitigadoras ou monitoramento; VII — impedir, dificultar ou causar embaraço à fiscalização; VIII — inobservar a legislação de controle ambiental; IX — prestar informação falsa, adulterar dados técnicos ou deixar de apresentá-los no prazo; X — falta ou irregularidade de inscrição em cadastros ambientais; XI — falta de registro nos cadastros que compõem o SEIA, quando legalmente exigido, com ao menos um obrigatório.",
      "label": "Dispositivo Normativo Infringido — Art. 254, parágrafo único",
      "location": "body[31]/table/row[43]"
    },
    "RN043": {
      "text": "No campo Dispositivo Normativo Infringido, com base no Art. 255 do Regulamento da Lei aprovado pelo Decreto Estadual nº 14.024, de 06/06/2012, o sistema deve apresentar: I — captar, derivar ou utilizar recursos hídricos sem outorga, quando exigível, ou em desacordo com suas condições; II — perfurar poços sem manifestação prévia do órgão gestor ou operá-los sem outorga; III — realizar atividades, serviços ou obras sem outorga, ou em desacordo com ela, que possam afetar corpos hídricos, aquíferos ou o regime das águas; IV — fraudar medições dos volumes utilizados ou declarar valores divergentes; V — interferir em leitos e corpos hídricos para extração mineral ou de materiais sem autorização; VI — infringir a Lei, suas disposições regulamentares, instruções ou procedimentos dos órgãos competentes; VII — lançar esgotos, despejos ou resíduos sólidos, líquidos ou gasosos em corpos hídricos sem a respectiva outorga, com ao menos um obrigatório.",
      "label": "Dispositivo Normativo Infringido — Art. 255",
      "location": "body[31]/table/row[44]"
    },
    "RN044": {
      "text": "Quando apresentado na tela o Art. 249 (conforme comportamento da RN038), o sistema deve apresentar as seguintes: I -                               as circunstâncias atenuantes e agravantes; II - a gravidade do fato, tendo em vista suas consequências para o meio ambiente; III - os antecedentes do infrator; IV - o porte do empreendimento; V - o grau de compreensão e escolaridade do infrator; VI - tratar-se de infração formal ou material; VII - condição socioeconômica. O técnico poderá selecionar um ou mais e o sistema terá o seguinte comportamento: ao selecionar a opção I o sistema obriga o preenchimento de ao menos um dos artigos 250 (RN046) ou 251 (RN047); ao selecionar a opção II o sistema obriga o preenchimento do artigo 258 (RN049); ao selecionar a opção III, IV, V e/ou VII o sistema obriga o preenchimento de um campo aberto (até 500 caracteres) para cada uma das opções; ao selecionar a opção VI o sistema obriga o preenchimento do artigo 257 (RN048).Com exceção dos incisos I, II e VI, que já estarão automanticamente preenchidos (RN038), os demais incisos serão de preenchimento opcional.",
      "label": "Caracterização da Infração — Art. 249 — critérios para gradação e penalidades",
      "location": "body[31]/table/row[45]"
    },
    "RN045": {
      "text": "Quando o inciso I da RN044 estiver selecionado, o sistema deve exigir o preenchimento de ao menos um dos artigos 250 ou 251. No artigo escolhido, deve ser selecionada ao menos uma opção.",
      "label": "Comportamento dos artigos 250 e 251, quando for selecionada a opção I da RN044",
      "location": "body[31]/table/row[46]"
    },
    "RN046": {
      "text": " Quando apresentado na tela o Art. 250 (conforme comportamento da RN044), o sistema deve apresentar as seguintes opções:\nI - espontânea contenção, redução ou reparação da degradação ambiental pelo infrator; \nII - decorrer, a infração, da prática de ato costumeiro de população tradicional à qual pertença o infrator; III - não ter cometido nenhuma infração anteriormente; IV - baixo grau de escolaridade do infrator; V - colaboração com os técnicos encarregados da fiscalização e do controle ambiental; VI - comunicação imediata do infrator às autoridades competentes.",
      "label": "Caracterização da Infração — Art. 250 — circunstâncias atenuantes",
      "location": "body[31]/table/row[47]"
    },
    "RN047": {
      "text": "Quando apresentado na tela o Art. 251 (conforme comportamento da RN044), o sistema deve apresentar as seguintes opções:\nI - a infração ter ocorrido à noite, em domingos ou dias feriados ou em local de difícil acesso e carente de infraestrutura; II - a infração ter ocorrido em Unidades de Conservação ou em área de preservação permanente; III - ter a infração atingido propriedades de terceiros; IV - ter a infração acarretado danos em bens materiais; V - ser o infrator reincidente ou cometer a infração de forma continuada; VI - a tentativa dolosa de se eximir da responsabilidade; VII - ter o infrator cometido o ato: a) para obter vantagem pecuniária; b) coagindo outrem para execução material da infração. VIII - adulteração de análises e resultados que prejudiquem a correta avaliação dos níveis de emissão;\nIX -                            a infração atingir espécies nativas raras, endêmicas, vulneráveis, de importância econômica ou em perigo de extinção;\nX -                             causar a necessidade de evacuar a população, ainda que momentaneamente;\nXI -                            a infração expor ao perigo a saúde pública ou o meio ambiente;\nXII -                          tornar a área, urbana ou rural, imprópria para ocupação humana;\nXIII -                         causar danos permanentes ao meio ambiente ou à saúde humana. Caso selecionado o inciso VII, o sistema deve apresentar o subitem a e b, obrigando o preenchimento de um ou mais.",
      "label": "Caracterização da Infração — Art. 251 — circunstâncias agravantes",
      "location": "body[31]/table/row[48]"
    },
    "RN048": {
      "text": "Quando apresentado na tela o Art. 257 (conforme comportamento da RN044), o sistema deve apresentar as seguintes opções: I -                               infração formal, assim considerada, dentre outras com iguais características:\n\na) a falta de anuência, autorização, licença ambiental ou registros, em quaisquer de suas modalidades, quando necessários;\n\nb) o descumprimento de prazos para o atendimento de exigências, notificações ou condicionantes, quando não tragam consequências diretas para o meio ambiente;\n\nII -                             infração material: a ação ou a omissão que cause ou possa causar contaminação, poluição e/ou degradação do meio ambiente.\n\nObrigando o preenchimento de apenas um inciso. Caso selecionado o inciso I, o sistema deve apresentar o subitem a e b, obrigando o preenchimento de um ou mais.",
      "label": "Caracterização da Infração — Art. 257 — infração formal ou material",
      "location": "body[31]/table/row[49]"
    },
    "RN049": {
      "text": "Quando apresentado na tela o Art. 258 (conforme comportamento da RN044), o sistema deve apresentar as seguintes opções: I — infração leve; II — infração grave; III — infração gravíssima, obrigado a seleção de apenas um.",
      "label": "Caracterização da Infração — Art. 258 — classificação da gravidade",
      "location": "body[31]/table/row[50]"
    },
    "RN050": {
      "text": "Quando apresentado na tela o Art. 258 (conforme comportamento da RN044), o sistema deve apresentar, logo abaixo dos campos da RN049, os seguintes campos; um campo fechado obrigatório, com o título Penalidade (Anexo VII). As opções de preenchimento desse campo serão apresentadas de acordo com o preenchimento da RN049. Quando for selecionada a opção I da RN049, serão habilitadas as seguintes opções, sendo ao menos um de preenchimento obrigatório: Advertência e Multa; Quando for selecionada a opção II da RN049, serão habilitadas as seguintes opções, sendo ao menos um de preenchimento obrigatório: Advertência, Multa, Embargo Temporário, Destruição de fornos para produção de carvão vegetal, Interdição Temporária, Apreensão; Quando for selecionada a opção III da RN049, serão habilitadas as seguintes opções, sendo ao menos um de preenchimento obrigatório: Advertência, Multa, Embargo Temporário, Embargo Definitivo, Demolição, Interdição Temporária, Interdição Definitiva;",
      "label": "Caracterização da Infração — Art. 258 — enquadramento e aplicação",
      "location": "body[31]/table/row[51]"
    },
    "RN051": {
      "text": "Na descrição da inspeção, aceitar somente arquivos com extensões de imagem previstas na RN025: JPEG, JPG, PNG e BMP. Os demais formatos da RN025 permanecem permitidos apenas na seção Anexos.",
      "label": "Imagens da descrição",
      "location": "body[31]/table/row[52]"
    },
    "RN052": {
      "text": "Autos de Infraçãoe notificações não podem ser incluídos, alterados ou removidos enquanto o RFA estiver Finalizado. Essas alterações somente devem ser habilitadas se o gestor devolver o relatório, mudando seu estado para Devolvido para ajuste.",
      "label": "Alterações após finalização",
      "location": "body[31]/table/row[53]"
    },
    "RN053": {
      "text": "Ao gerar a notificação o sistema deve utilizar o Agente de IA para gerar um resumo do descritivo da notificação (em até 500 caracteres) e esse resumo irá compor o RFA, podendo ser editado. Até que acontece a implementação do Agente de IA, o campo deve ficar aberto e obrigatório, permitindo edição e também com até 500 caracteres. (OBG)",
      "label": "Gerar resumo de notificação",
      "location": "body[31]/table/row[54]"
    },
    "MSG001": {
      "text": "Preencha os campos obrigatórios destacados.",
      "label": "Tentativa de finalizar com dados obrigatórios ausentes.",
      "location": "body[33]/table/row[2]"
    },
    "MSG002": {
      "text": "Rascunho salvo com sucesso.",
      "label": "Rascunho persistido.",
      "location": "body[33]/table/row[3]"
    },
    "MSG003": {
      "text": "Relatório finalizado e encaminhado com sucesso.",
      "label": "Finalização e encaminhamento concluídos.",
      "location": "body[33]/table/row[4]"
    },
    "MSG004": {
      "text": "Deseja excluir definitivamente este rascunho?",
      "label": "Acionamento de Excluir.",
      "location": "body[33]/table/row[5]"
    },
    "MSG005": {
      "text": "Rascunho excluído com sucesso.",
      "label": "Exclusão confirmada e concluída.",
      "location": "body[33]/table/row[6]"
    },
    "MSG006": {
      "text": "Informe um CPF ou CNPJ válido.",
      "label": "Documento com formato ou dígito verificador inválido.",
      "location": "body[33]/table/row[7]"
    },
    "MSG007": {
      "text": "A data e a hora de término não podem ser anteriores ao início.",
      "label": "Período de atendimento inválido.",
      "location": "body[33]/table/row[8]"
    },
    "MSG008": {
      "text": "Informe ao menos uma coordenada válida.",
      "label": "Operação que exige localização sem coordenada válida.",
      "location": "body[33]/table/row[9]"
    },
    "MSG009": {
      "text": "Nenhum histórico foi encontrado para os critérios informados.",
      "label": "Consulta de histórico sem resultados.",
      "location": "body[33]/table/row[10]"
    },
    "MSG010": {
      "text": "Nenhum relatório foi encontrado para os critérios informados.",
      "label": "Busca de relatório existente sem resultados.",
      "location": "body[33]/table/row[11]"
    },
    "MSG011": {
      "text": "Deseja aproveitar os dados selecionados neste relatório?",
      "label": "Importação de relatório ou histórico.",
      "location": "body[33]/table/row[12]"
    },
    "MSG012": {
      "text": "Não foi possível consultar os dados no GeoServer. Continue o preenchimento e tente novamente mais tarde.",
      "label": "Indisponibilidade total do GeoServer.",
      "location": "body[33]/table/row[13]"
    },
    "MSG013": {
      "text": "Não foi possível consultar os dados de empreendimentos, licenças e autorizações no GeoServer. Continue o preenchimento e tente novamente mais tarde.",
      "label": "Indisponibilidade das camadas de regulação.",
      "location": "body[33]/table/row[14]"
    },
    "MSG014": {
      "text": "O arquivo selecionado possui formato não permitido.",
      "label": "Anexo inválido.",
      "location": "body[33]/table/row[15]"
    },
    "MSG015": {
      "text": "Arquivo anexado com sucesso.",
      "label": "Inclusão de anexo concluída.",
      "location": "body[33]/table/row[16]"
    },
    "MSG016": {
      "text": "Não foi possível salvar o relatório. Tente novamente.",
      "label": "Falha ao salvar rascunho ou finalizar.",
      "location": "body[33]/table/row[17]"
    },
    "MSG017": {
      "text": "Você não possui permissão para realizar esta ação.",
      "label": "Acesso ou ação não autorizada.",
      "location": "body[33]/table/row[18]"
    },
    "MSG018": {
      "text": "O relatório será validado, finalizado e encaminhado. Deseja continuar?",
      "label": "Antes de concluir a finalização.",
      "location": "body[33]/table/row[19]"
    },
    "MSG019": {
      "text": "O texto de outras normas deve possuir no máximo 500 caracteres.",
      "label": "Exceder limite de outras normas",
      "location": "body[33]/table/row[20]"
    },
    "MSG020": {
      "text": "Não foi possível excluir o rascunho. Tente novamente.",
      "label": "Falha na exclusão.",
      "location": "body[33]/table/row[21]"
    },
    "MSG021": {
      "text": "O relatório finalizado somente pode ser alterado após devolução pelo gestor.",
      "label": "Tentativa de alterar relatório finalizado.",
      "location": "body[33]/table/row[22]"
    },
    "MSG022": {
      "text": "Não foi possível consultar todas as camadas do GeoServer. Os dados disponíveis foram apresentados.",
      "label": "Consulta parcial no GeoServer.",
      "location": "body[33]/table/row[23]"
    },
    "MSG023": {
      "text": "Informe a data inicial e a data final. A data final não pode ser anterior à data inicial.",
      "label": "Intervalo da consulta histórica inválido ou incompleto.",
      "location": "body[33]/table/row[24]"
    },
    "MSG024": {
      "text": "Os dados geoespaciais foram atualizados com base nas coordenadas informadas.",
      "label": "Consulta geoespacial concluída.",
      "location": "body[33]/table/row[25]"
    },
    "LEG001": {
      "text": "Gerado automaticamente após a finalização.",
      "label": "Número do RFA",
      "location": "body[36]/table/row[2]"
    },
    "LEG002": {
      "text": "Selecione o processo que originou a fiscalização.",
      "label": "Processo(s) indexado(s)",
      "location": "body[36]/table/row[3]"
    },
    "LEG003": {
      "text": "Informe o início e o término da atividade de fiscalização.",
      "label": "Data e hora do atendimento",
      "location": "body[36]/table/row[4]"
    },
    "LEG004": {
      "text": "Informe somente números; o sistema validará o documento.",
      "label": "CPF/CNPJ",
      "location": "body[36]/table/row[5]"
    },
    "LEG005": {
      "text": "Adicione as pessoas que acompanharam a inspeção.",
      "label": "Participantes da inspeção",
      "location": "body[36]/table/row[6]"
    },
    "LEG006": {
      "text": "Informe Geográfica/Grau Decimal, Grau/Min/Seg, UTM 23 ou UTM 24; o sistema converterá para grau decimal.",
      "label": "Coordenadas geográficas",
      "location": "body[36]/table/row[7]"
    },
    "LEG007": {
      "text": "Informe CPF/CNPJ, município, data inicial e data final para consultar ocorrências anteriores.",
      "label": "Histórico",
      "location": "body[36]/table/row[8]"
    },
    "LEG008": {
      "text": "Descreva objetivamente os fatos e evidências observados.",
      "label": "Descrição da inspeção",
      "location": "body[36]/table/row[9]"
    },
    "LEG009": {
      "text": "Registre a avaliação técnica e os encaminhamentos propostos.",
      "label": "Conclusão",
      "location": "body[36]/table/row[10]"
    },
    "LEG010": {
      "text": "Selecione a classificação aplicável a cada infração.",
      "label": "Caracterização da infração",
      "location": "body[36]/table/row[11]"
    },
    "LEG011": {
      "text": "Selecione o artigo e, quando disponível, o inciso, parágrafo ou alínea correspondente.",
      "label": "Dispositivo normativo",
      "location": "body[36]/table/row[12]"
    },
    "LEG012": {
      "text": "Informe outras normas infringidas em até 500 caracteres.",
      "label": "Outras normas",
      "location": "body[36]/table/row[13]"
    },
    "LEG013": {
      "text": "Inclua arquivos relacionados à fiscalização nos formatos permitidos.",
      "label": "Anexos",
      "location": "body[36]/table/row[14]"
    },
    "LEG014": {
      "text": "Campos destacados foram reaproveitados de outra fonte e devem ser conferidos.",
      "label": "Dados importados",
      "location": "body[36]/table/row[15]"
    },
    "LEG015": {
      "text": "Pode ser editado e ainda não possui número definitivo.",
      "label": "Rascunho",
      "location": "body[36]/table/row[16]"
    },
    "LEG016": {
      "text": "Relatório encaminhado e bloqueado para edição até eventual devolução pelo gestor.",
      "label": "Finalizado",
      "location": "body[36]/table/row[17]"
    },
    "LEG017": {
      "text": "Relatório liberado pelo gestor para correção de infrações, notificações e desdobramentos.",
      "label": "Devolvido para ajuste",
      "location": "body[36]/table/row[18]"
    },
    "TL001": {
      "text": "TL001 – Tela de Elaboração do Relatório de Fiscalização Ambiental",
      "label": "Tela de Elaboração do Relatório de Fiscalização Ambiental",
      "location": "body[40]/p"
    },
    "BOT001": {
      "text": "Novo RFA",
      "label": "Cabeçalho",
      "location": "body[43]/table/row[3]"
    },
    "BOT002": {
      "text": "Buscar relatório",
      "label": "Modal de aproveitamento",
      "location": "body[43]/table/row[4]"
    },
    "BOT003": {
      "text": "Aproveitar dados",
      "label": "Resultado da busca",
      "location": "body[43]/table/row[5]"
    },
    "BOT004": {
      "text": "Adicionar participante",
      "label": "Participantes",
      "location": "body[43]/table/row[6]"
    },
    "BOT005": {
      "text": "Adicionar coordenada",
      "label": "Local da inspeção",
      "location": "body[43]/table/row[7]"
    },
    "BOT006": {
      "text": "Consultar dados geoespaciais",
      "label": "Contexto geoespacial",
      "location": "body[43]/table/row[8]"
    },
    "BOT007": {
      "text": "Consultar histórico",
      "label": "Histórico",
      "location": "body[43]/table/row[9]"
    },
    "BOT008": {
      "text": "Adicionar infração",
      "label": "Infrações",
      "location": "body[43]/table/row[10]"
    },
    "BOT009": {
      "text": "Adicionar notificação",
      "label": "Notificações",
      "location": "body[43]/table/row[11]"
    },
    "BOT010": {
      "text": "Adicionar anexo",
      "label": "Anexos",
      "location": "body[43]/table/row[12]"
    },
    "BOT011": {
      "text": "Remover",
      "label": "Itens repetíveis",
      "location": "body[43]/table/row[13]"
    },
    "BOT012": {
      "text": "Salvar rascunho",
      "label": "Rodapé",
      "location": "body[43]/table/row[14]"
    },
    "BOT013": {
      "text": "Finalizar relatório",
      "label": "Rodapé",
      "location": "body[43]/table/row[15]"
    },
    "BOT014": {
      "text": "Excluir rascunho",
      "label": "Rodapé",
      "location": "body[43]/table/row[16]"
    },
    "BOT015": {
      "text": "Cancelar",
      "label": "Modal",
      "location": "body[43]/table/row[17]"
    }
  },
  "DOR009": {
    "RN001": {
      "text": "Somente técnico interno autenticado e autorizado pode criar, editar, excluir rascunho e finalizar RAE.",
      "label": "Acesso à funcionalidade",
      "location": "body[32]/table/row[2]"
    },
    "RN002": {
      "text": "O acesso ao RAE deve ser restrito aos perfis internos autorizados, respeitando as permissões de criação, consulta, edição, exclusão, finalização, devolução e reenvio.",
      "label": "Perfis internos autorizados",
      "location": "body[32]/table/row[3]"
    },
    "RN003": {
      "text": "O RAE deve possuir, no mínimo, os estados Rascunho, Finalizado e Devolvido para ajuste. O rascunho pode ser editado ou excluído pelo elaborador autorizado. O relatório Finalizado fica bloqueado para edição. Quando o gestor devolver o relatório para ajuste ao técnico autor, o estado deve ser alterado para Devolvido para ajuste e todos os campos devem ser habilitados para alteração exclusivamente pelo técnico autor até o reenvio.",
      "label": "Estados do RAE",
      "location": "body[32]/table/row[4]"
    },
    "RN004": {
      "text": "Ao iniciar o preenchimento, o sistema deve perguntar se o técnico deseja aproveitar um relatório existente.",
      "label": "Aproveitamento de relatório",
      "location": "body[32]/table/row[5]"
    },
    "RN005": {
      "text": "A busca deve aceitar CPF/CNPJ, Nome/Razão social, número do relatório, número do processo, CEFIR/CAR, data, município e unidade de conservação.",
      "label": "Busca de relatório existente",
      "location": "body[32]/table/row[6]"
    },
    "RN006": {
      "text": "Na finalização, gerar número único no padrão 0000/AAAA-0000, com reinício anual. O significado e a sequência dos dois blocos numéricos permanecem pendentes de definição.",
      "label": "Numeração do RAE",
      "location": "body[32]/table/row[7]"
    },
    "RN007": {
      "text": "O RAE deve possuir obrigatoriamente um único processo originador. Além do processo originador, o sistema deve permitir a indexação de vários processos relacionados, sem substituir ou alterar o processo originador. Autos de infração e notificações vinculados devem ser recuperados a partir do processo originador.",
      "label": "Processo originador",
      "location": "body[32]/table/row[8]"
    },
    "RN008": {
      "text": "Permitir um ou mais períodos de atendimento, cada um com data, hora inicial e hora final.",
      "label": "Múltiplos atendimentos",
      "location": "body[32]/table/row[9]"
    },
    "RN009": {
      "text": "Em cada período, o término não pode ser anterior ao início e as datas e horas não podem estar no futuro.",
      "label": "Validação do atendimento",
      "location": "body[32]/table/row[10]"
    },
    "RN010": {
      "text": "O RAE deve possuir ao menos uma empresa envolvida e cada empresa registrada deve possuir ao menos um representante. A finalização deve ser impedida enquanto essa condição não for atendida.",
      "label": "Empresas e representantes obrigatórios",
      "location": "body[32]/table/row[11]"
    },
    "RN011": {
      "text": "O RAE deve possuir ao menos um participante do atendimento. O próprio  usuário que iniciou o RAE deve ser este participante– técnico responsável. O Técnico responsável poderá incluir um ou mais técnicos participantes, devendo o sistema adicionar os demais técnicos e considerar o usuário que iniciou o documento como sendo o técnico responsável/líder. O sistema só deve permitir a finalização com ao menos um técnico responsável. A inclusão e a remoção são permitidas durante a edição, desde que a condição seja atendida na finalização.",
      "label": "Participantes obrigatórios",
      "location": "body[32]/table/row[12]"
    },
    "RN012": {
      "text": "O técnico pode informar uma ou mais coordenadas para representar a origem, a trajetória ou as diferentes áreas atingidas pela emergência.",
      "label": "Múltiplas coordenadas",
      "location": "body[32]/table/row[13]"
    },
    "RN013": {
      "text": "O sistema deve aceitar os formatos Geográfica/Grau Decimal, Grau/Min/Seg, UTM 23 e UTM 24, com latitude e longitude de até 10 caracteres numéricos. Independentemente do formato informado, deve converter e armazenar as coordenadas geográficas em grau decimal, preservando o valor original para auditoria.",
      "label": "Conversão de coordenadas",
      "location": "body[32]/table/row[14]"
    },
    "RN014": {
      "text": "Após o usuário informar ao menos uma coordenada válida e acionar “Consultar área atingida”, o sistema deve consultar no GeoServer todas as camadas definidas na RN016 e apresentar as ocorrências e sobreposições encontradas. As camadas devem ser consultadas de forma independente, sem aplicação de prioridade entre elas.",
      "label": "Consulta geoespacial no GeoServer",
      "location": "body[32]/table/row[15]"
    },
    "RN015": {
      "text": "Para cada coordenada válida, a consulta deve sempre verificar a localização exata e os elementos situados em um raio de 500 metros nas camadas disponíveis no GeoServer.",
      "label": "Localização exata e raio de consulta",
      "location": "body[32]/table/row[16]"
    },
    "RN016": {
      "text": "A consulta deve contemplar município (toca), bacia hidrográfica (toca), recurso hídrico (raio de 500 m), unidade de conservação (toca), CEFIR/CAR (toca) – distinguir tipologias: imóvel rural ou assentamentos ou povos e comunidades tradicionais, aplicação da Lei da Mata Atlântica (toca), bioma (toca), reserva legal (toca), APP (toca), e sede municipal (trazer a mais próxima).\nO dado de recurso hídrico será apresentado para o técnico selecionar com a opção de importar ou não para o RAE, sendo os demais de importação automática e obrigatória, não apresentado retorno o sistema deverá inserir o texto: Não se aplica.",
      "label": "Dados geoespaciais",
      "location": "body[32]/table/row[17]"
    },
    "RN017": {
      "text": "Empreendimentos, licenças e autorizações relacionados à localização devem ser obtidos das camadas correspondentes publicadas no GeoServer.",
      "label": "Empreendimentos e dados de regulação",
      "location": "body[32]/table/row[18]"
    },
    "RN018": {
      "text": "Ao informar CPF/CNPJ ou Nome/Razão social, consultar cadastros existentes e permitir a seleção do cadastro correspondente, sem sobrescrever dados sem confirmação.",
      "label": "Consulta de pessoa",
      "location": "body[32]/table/row[19]"
    },
    "RN019": {
      "text": "Validar formato e dígitos verificadores do CPF/CNPJ antes da consulta ou gravação.",
      "label": "Validação de CPF/CNPJ",
      "location": "body[32]/table/row[20]"
    },
    "RN020": {
      "text": "Para executar a consulta de histórico, o técnico deve informar obrigatoriamente CPF/CNPJ, município, data inicial e data final. A data final não pode ser anterior à data inicial.",
      "label": "Consulta de histórico por intervalo",
      "location": "body[32]/table/row[21]"
    },
    "RN021": {
      "text": "Exibir somente resultados que possuam licenças, autorização, auto de infração, notificação ou requerimento em aberto, identificando processo e data.",
      "label": "Conteúdo do histórico",
      "location": "body[32]/table/row[22]"
    },
    "RN022": {
      "text": "Permitir selecionar mais de um resultado e expandir seus detalhes antes de incorporá-los ao relatório.",
      "label": "Seleção do histórico",
      "location": "body[32]/table/row[23]"
    },
    "RN023": {
      "text": "Campos importados de relatório anterior ou histórico devem ser destacados e manter indicação de origem até a finalização.",
      "label": "Dados reaproveitados",
      "location": "body[32]/table/row[24]"
    },
    "RN024": {
      "text": "O RAE pode conter uma ou mais infrações e uma ou mais notificações.",
      "label": "Múltiplas infrações e notificações",
      "location": "body[32]/table/row[25]"
    },
    "RN025": {
      "text": "Nome/Razão social, CPF/CNPJ e endereço devem ser preenchidos a partir da identificação quando forem da mesma pessoa, permitindo alteração justificada quando forem diferentes.",
      "label": "Dados do autuado/destinatário",
      "location": "body[32]/table/row[26]"
    },
    "RN026": {
      "text": "O sistema deve tratar Caracterização da Infração e Dispositivo Normativo Infringido como campos distintos. A Caracterização da Infração deve utilizar as fontes da RN040 e os desdobramentos das RN047 a RN051, RN053 e RN054. O Dispositivo Normativo Infringido deve respeitar a prioridade da RN042 e os desdobramentos das RN044 a RN046. Ao selecionar um artigo, o sistema deve habilitar somente os incisos, parágrafos ou alíneas vinculados a ele.",
      "label": "Seleção dos campos normativos",
      "location": "body[32]/table/row[27]"
    },
    "RN027": {
      "text": "Como terceira opção de prioridade do campo Dispositivo Normativo Infringido, o sistema deve disponibilizar campo aberto para descrição de outras normas, com até 500 caracteres. O campo pode ser preenchido mesmo quando houver outro dispositivo normativo selecionado.",
      "label": "Outras normas infringidas",
      "location": "body[32]/table/row[28]"
    },
    "RN028": {
      "text": "A seção Recomendações é opcional e deve aceitar texto técnico livre com até 7.000 caracteres.",
      "label": "Recomendações",
      "location": "body[32]/table/row[29]"
    },
    "RN029": {
      "text": "Aceitar JPEG, JPG, PNG, BMP, MP3, MP4, PDF, DOC, DOCX, TXT, XLS, XLSX, SHP, SHX, DBF, PRJ, KML, KMZ e ZIP.",
      "label": "Formatos de anexos",
      "location": "body[32]/table/row[30]"
    },
    "RN030": {
      "text": "Salvar Rascunho deve persistir os dados preenchidos sem gerar número definitivo nem iniciar o encaminhamento.",
      "label": "Salvar rascunho",
      "location": "body[32]/table/row[31]"
    },
    "RN031": {
      "text": "Finalizar Relatório deve validar os campos obrigatórios, salvar os dados, gerar o número definitivo, impedir edições não autorizadas e iniciar o fluxo de encaminhamento. Quando o relatório estiver Devolvido para ajuste ao técnico autor, a mesma ação deve validar e reenviar todas as alterações, preservando o número do RAE.",
      "label": "Finalização e reenvio",
      "location": "body[32]/table/row[32]"
    },
    "RN032": {
      "text": "Excluir deve exigir confirmação e ser permitido somente para rascunho e usuário autorizado. A ação deve ser auditada.",
      "label": "Exclusão",
      "location": "body[32]/table/row[33]"
    },
    "RN033": {
      "text": "O sistema deve registrar o técnico responsável pela emissão do RAE e a data e hora da geração do relatório.",
      "label": "Responsabilidade técnica",
      "location": "body[32]/table/row[34]"
    },
    "RN034": {
      "text": "Registrar criação, alterações, importações, consultas de dados no GeoServer, anexações, exclusão, finalização, encaminhamento, devolução e reenvio.",
      "label": "Auditoria",
      "location": "body[32]/table/row[35]"
    },
    "RN035": {
      "text": "Restringir dados pessoais e documentos conforme perfil, finalidade e vínculo com o processo, inclusive em acesso por endereço eletrônico direto.",
      "label": "Segurança e proteção de dados",
      "location": "body[32]/table/row[36]"
    },
    "RN036": {
      "text": "Quando o GeoServer estiver total ou parcialmente indisponível, o sistema deve apresentar somente uma mensagem de alerta, manter os resultados obtidos nas camadas disponíveis e permitir a continuidade do preenchimento. A indisponibilidade não deve bloquear o preenchimento, o salvamento do rascunho nem a finalização do RAE.",
      "label": "Indisponibilidade do GeoServer",
      "location": "body[32]/table/row[37]"
    },
    "RN037": {
      "text": "Para cada infração, o sistema deve disponibilizar separadamente: a) o campo textual Caracterização da Infração, obrigatório, com até 1.000 caracteres; b) o campo Enquadramento no Anexo VI, de seleção opcional; e c) o campo Dispositivo Normativo Infringido, com seleção obrigatória de ao menos uma fonte. Os catálogos normativos devem respeitar as fontes, a ordem e os desdobramentos definidos nas RN040 a RN051, RN053 e RN054.",
      "label": "Catálogo normativo",
      "location": "body[32]/table/row[38]"
    },
    "RN038": {
      "text": "Para finalizar o RAE, o sistema deve exigir: um único processo originador; ao menos um período de atendimento válido; os dados de identificação; ao menos uma empresa envolvida e um representante para cada empresa; ao menos um participante, conforme RN010 e RN011; o endereço/local da emergência; ao menos uma coordenada válida; a descrição da emergência e ao menos uma imagem válida; e a conclusão. Na consulta histórica, data inicial e data final são obrigatórias somente quando a consulta for executada. Quando houver infração, a Caracterização da Infração textual e o Dispositivo Normativo Infringido são obrigatórios, enquanto a seleção do Anexo VI é opcional. Os campos e as pendências impeditivas devem ser destacados antes da finalização; o rascunho pode ser salvo com preenchimento parcial. A indisponibilidade total ou parcial do GeoServer deve gerar somente os alertas previstos na RN036 e não deve impedir a finalização.",
      "label": "Validação para finalização",
      "location": "body[32]/table/row[39]"
    },
    "RN039": {
      "text": "Cada anexo deve registrar nome, formato, tamanho, descrição, usuário, data e hora; arquivos devem passar por validação de segurança antes da disponibilização.",
      "label": "Anexos e evidências",
      "location": "body[32]/table/row[40]"
    },
    "RN040": {
      "text": "Ao adicionar uma infração, o sistema deve apresentar: a) o campo textual “Caracterização da Infração”, obrigatório, com até 1.000 caracteres; e b) o campo “Enquadramento no Anexo VI”, de seleção opcional, com as opções do Anexo VI. No texto “Anexo VI”, o sistema deve disponibilizar hiperlink para https://www.legislabahia.ba.gov.br/documentos/decreto-no-14024-de-06-de-junho-de-2012. O sistema deve permitir mais de uma infração e, para cada infração adicionada, aplicar as RN041 a RN051, RN053 e RN054.",
      "label": "Caracterização da Infração",
      "location": "body[32]/table/row[41]"
    },
    "RN041": {
      "text": "Ao selecionar o campo de Dispositivo Normativo Infringido, será obrigatória a seleção de ao menos uma das fontes da RN042 e será apresentado o campo artigo 249 (RN047) com os incisos I, II e VI automaticamente já selecionados e bloqueados, não permitindo que sejam desmarcados.",
      "label": "Dispositivo Normativo Infringido",
      "location": "body[32]/table/row[42]"
    },
    "RN042": {
      "text": "O campo Dispositivo Normativo Infringido deve apresentar as fontes nesta ordem: 1 — prioritariamente, a Lei nº 10.431, de 20/12/2006, a nº 11.612 de 08/10/2009, e os arts. 254 e 255 do Regulamento da Lei aprovado pelo Decreto Estadual nº 14.024, de 06/06/2012; 2 — posteriormente, a Lei de Crimes Ambientais, Lei nº 9.605, de 12/02/1998, e o Decreto nº 6.514, de 22/07/2008; 3 — ao selecionar o campo aberto para descrição de outras normas, conforme a RN027, o sistema deverá automaticamente selecionar o Artigo 254, Parágrafo único, Inciso VIII permitindo a digitação de outras normas (500 caracteres).",
      "label": "Prioridade do Dispositivo Normativo Infringido",
      "location": "body[32]/table/row[43]"
    },
    "RN043": {
      "text": "Ao selecionar a fonte 1 da RN042, será obrigatória a seleção do artigo 254 e/ou 255.",
      "label": "Dispositivo Normativo Infringido",
      "location": "body[32]/table/row[44]"
    },
    "RN044": {
      "text": "Ao selecionar o Art. 254 do Regulamento da Lei aprovado pelo Decreto Estadual nº 14.024, de 06/06/2012, deve apresentar como infração administrativa ambiental toda ação ou omissão, voluntária ou involuntária, que viole as regras jurídicas de uso, gozo, promoção, proteção e recuperação do meio ambiente e resulte em: I — risco de poluição ou degradação do meio ambiente; e/ou II — efetiva poluição ou degradação ambiental; e/ou III — emissão, lançamento ou liberação de efluentes líquidos, gasosos ou resíduos sólidos em desacordo com os padrões estabelecidos, e/ou que tornem ou possam tornar ultrapassados os padrões de qualidade ambiental e/ou Parágrafo único, com ao menos um obrigatório.",
      "label": "Dispositivo Normativo Infringido — Art. 254",
      "location": "body[32]/table/row[45]"
    },
    "RN045": {
      "text": "Ao selecionar o parágrafo único do Art. 254, o sistema deve apresentar: I — executar obras, instalar, implantar, alterar, testar ou operar equipamentos ou empreendimentos, bem como exercer atividades ou explorar recursos naturais sem as necessárias anuências, autorizações, licenças ambientais ou registros, ou em desacordo com eles; II — inobservar ou deixar de cumprir normas regulamentares e exigências técnicas ou administrativas dos órgãos executores do SISEMA, SEGREH ou CEPRAM; III — descumprir condicionantes ou prazos de notificações, anuências, autorizações, licenças ou autos de infração; IV — descumprir compromissos do TCRA; V — descumprir obrigações, condições ou prazos de termo de compromisso com o INEMA; VI — deixar de atender determinação dos órgãos executores do SISEMA ou CEPRAM, inclusive quanto a planos de controle, medidas mitigadoras ou monitoramento; VII — impedir, dificultar ou causar embaraço à fiscalização; VIII — inobservar a legislação de controle ambiental; IX — prestar informação falsa, adulterar dados técnicos ou deixar de apresentá-los no prazo; X — falta ou irregularidade de inscrição em cadastros ambientais; XI — falta de registro nos cadastros que compõem o SEIA, quando legalmente exigido, com ao menos um obrigatório.",
      "label": "Dispositivo Normativo Infringido — Art. 254, parágrafo único",
      "location": "body[32]/table/row[46]"
    },
    "RN046": {
      "text": "No campo Dispositivo Normativo Infringido, com base no Art. 255 do Regulamento da Lei aprovado pelo Decreto Estadual nº 14.024, de 06/06/2012, o sistema deve apresentar: I — captar, derivar ou utilizar recursos hídricos sem outorga, quando exigível, ou em desacordo com suas condições; II — perfurar poços sem manifestação prévia do órgão gestor ou operá-los sem outorga; III — realizar atividades, serviços ou obras sem outorga, ou em desacordo com ela, que possam afetar corpos hídricos, aquíferos ou o regime das águas; IV — fraudar medições dos volumes utilizados ou declarar valores divergentes; V — interferir em leitos e corpos hídricos para extração mineral ou de materiais sem autorização; VI — infringir a Lei, suas disposições regulamentares, instruções ou procedimentos dos órgãos competentes; VII — lançar esgotos, despejos ou resíduos sólidos, líquidos ou gasosos em corpos hídricos sem a respectiva outorga, com ao menos um obrigatório.",
      "label": "Dispositivo Normativo Infringido — Art. 255",
      "location": "body[32]/table/row[47]"
    },
    "RN047": {
      "text": "Quando apresentado na tela o Art. 249 (conforme comportamento da RN041), o sistema deve apresentar as seguintes: I -                               as circunstâncias atenuantes e agravantes; II - a gravidade do fato, tendo em vista suas consequências para o meio ambiente; III - os antecedentes do infrator; IV - o porte do empreendimento; V - o grau de compreensão e escolaridade do infrator; VI - tratar-se de infração formal ou material; VII - condição socioeconômica. O técnico poderá selecionar um ou mais e o sistema terá o seguinte comportamento: ao selecionar a opção I o sistema obriga o preenchimento de ao menos um dos artigos 250 (RN049) ou 251 (RN050); ao selecionar a opção II o sistema obriga o preenchimento do artigo 258 (RN053); ao selecionar a opção III, IV, V e/ou VII o sistema obriga o preenchimento de um campo aberto (até 500 caracteres) para cada uma das opções; ao selecionar a opção VI o sistema obriga o preenchimento do artigo 257 (RN051).Com exceção dos incisos I, II e VI, que já estarão automanticamente preenchidos (RN041), os demais incisos serão de preenchimento opcional.",
      "label": "Caracterização da Infração — Art. 249 — critérios para gradação e penalidades",
      "location": "body[32]/table/row[48]"
    },
    "RN048": {
      "text": "Quando o inciso I da RN047 estiver selecionado, o sistema deve exigir o preenchimento de ao menos um dos artigos 250 ou 251. No artigo escolhido, deve ser selecionada ao menos uma opção.",
      "label": "Comportamento dos artigos 250 e 251, quando for selecionada a opção I da RN047",
      "location": "body[32]/table/row[49]"
    },
    "RN049": {
      "text": " Quando apresentado na tela o Art. 250 (conforme comportamento da RN047), o sistema deve apresentar as seguintes opções:\nI - espontânea contenção, redução ou reparação da degradação ambiental pelo infrator; \nII - decorrer, a infração, da prática de ato costumeiro de população tradicional à qual pertença o infrator; III - não ter cometido nenhuma infração anteriormente; IV - baixo grau de escolaridade do infrator; V - colaboração com os técnicos encarregados da fiscalização e do controle ambiental; VI - comunicação imediata do infrator às autoridades competentes.",
      "label": "Caracterização da Infração — Art. 250 — circunstâncias atenuantes",
      "location": "body[32]/table/row[50]"
    },
    "RN050": {
      "text": "Quando apresentado na tela o Art. 251 (conforme comportamento da RN047), o sistema deve apresentar as seguintes opções:\nI - a infração ter ocorrido à noite, em domingos ou dias feriados ou em local de difícil acesso e carente de infraestrutura; II - a infração ter ocorrido em Unidades de Conservação ou em área de preservação permanente; III - ter a infração atingido propriedades de terceiros; IV - ter a infração acarretado danos em bens materiais; V - ser o infrator reincidente ou cometer a infração de forma continuada; VI - a tentativa dolosa de se eximir da responsabilidade; VII - ter o infrator cometido o ato: a) para obter vantagem pecuniária; b) coagindo outrem para execução material da infração. VIII - adulteração de análises e resultados que prejudiquem a correta avaliação dos níveis de emissão;\nIX -                            a infração atingir espécies nativas raras, endêmicas, vulneráveis, de importância econômica ou em perigo de extinção;\nX -                             causar a necessidade de evacuar a população, ainda que momentaneamente;\nXI -                            a infração expor ao perigo a saúde pública ou o meio ambiente;\nXII -                          tornar a área, urbana ou rural, imprópria para ocupação humana;\nXIII -                         causar danos permanentes ao meio ambiente ou à saúde humana. Caso selecionado o inciso VII, o sistema deve apresentar o subitem a e b, obrigando o preenchimento de um ou mais.",
      "label": "Caracterização da Infração — Art. 251 — circunstâncias agravantes",
      "location": "body[32]/table/row[51]"
    },
    "RN051": {
      "text": "Quando apresentado na tela o Art. 257 (conforme comportamento da RN047), o sistema deve apresentar as seguintes opções: I -                               infração formal, assim considerada, dentre outras com iguais características:\n\na) a falta de anuência, autorização, licença ambiental ou registros, em quaisquer de suas modalidades, quando necessários;\n\nb) o descumprimento de prazos para o atendimento de exigências, notificações ou condicionantes, quando não tragam consequências diretas para o meio ambiente;\n\nII -                             infração material: a ação ou a omissão que cause ou possa causar contaminação, poluição e/ou degradação do meio ambiente.\n\nObrigando o preenchimento de apenas um inciso. Caso selecionado o inciso I, o sistema deve apresentar o subitem a e b, obrigando o preenchimento de um ou mais.",
      "label": "Caracterização da Infração — Art. 257 — infração formal ou material",
      "location": "body[32]/table/row[52]"
    },
    "RN052": {
      "text": "Ao incluir ou alterar um período de atendimento, o sistema deve verificar sobreposição com os demais períodos informados no mesmo RAE. Quando houver sobreposição, deve apresentar a MSG021 e somente gravar o período se o usuário confirmar explicitamente. Se o usuário cancelar, o período não deve ser gravado e deve permanecer disponível para correção.",
      "label": "Sobreposição de períodos de atendimento",
      "location": "body[32]/table/row[53]"
    },
    "RN053": {
      "text": "Quando apresentado na tela o Art. 258 (conforme comportamento da RN047), o sistema deve apresentar as seguintes opções: I — infração leve; II — infração grave; III — infração gravíssima, obrigado a seleção de apenas um.",
      "label": "Caracterização da Infração — Art. 258 — classificação da gravidade",
      "location": "body[32]/table/row[54]"
    },
    "RN054": {
      "text": "Quando apresentado na tela o Art. 258 (conforme comportamento da RN047), o sistema deve apresentar, logo abaixo dos campos da RN053, os seguintes campos; um campo fechado obrigatório, com o título Penalidade (Anexo VII). As opções de preenchimento desse campo serão apresentadas de acordo com o preenchimento da RN053. Quando for selecionada a opção I da RN053, serão habilitadas as seguintes opções, sendo ao menos um de preenchimento obrigatório: Advertência e Multa; Quando for selecionada a opção II da RN053, serão habilitadas as seguintes opções, sendo ao menos um de preenchimento obrigatório: Advertência, Multa, Embargo Temporário, Destruição de fornos para produção de carvão vegetal, Interdição Temporária, Apreensão; Quando for selecionada a opção III da RN053, serão habilitadas as seguintes opções, sendo ao menos um de preenchimento obrigatório: Advertência, Multa, Embargo Temporário, Embargo Definitivo, Demolição, Interdição Temporária, Interdição Definitiva;",
      "label": "Caracterização da Infração — Art. 258 — enquadramento e aplicação",
      "location": "body[32]/table/row[55]"
    },
    "RN055": {
      "text": "Na descrição da emergência, aceitar somente arquivos com extensões de imagem previstas na RN029: JPEG, JPG, PNG e BMP. Os demais formatos da RN029 permanecem permitidos apenas na seção Anexos.",
      "label": "Imagens da descrição da emergência",
      "location": "body[32]/table/row[56]"
    },
    "RN056": {
      "text": "Nenhum campo do RAE pode ser incluído, alterado ou removido enquanto o relatório estiver Finalizado. Quando o gestor devolver o relatório para ajuste ao técnico autor, todos os campos devem ser habilitados para alteração exclusivamente por esse técnico até o reenvio, incluindo identificação, atendimento, localização, coordenadas, descrição, conclusão, infrações, notificações, desdobramentos, recomendações e anexos.",
      "label": "Alterações após finalização",
      "location": "body[32]/table/row[57]"
    },
    "RN057": {
      "text": "Ao gerar a notificação o sistema deve utilizar o Agente de IA para gerar um resumo do descritivo da notificação (em até 500 caracteres) e esse resumo irá compor o RAE, podendo ser editado. Até que acontece a implementação do Agente de IA, o campo deve ficar aberto e obrigatório, permitindo edição e também com até 500 caracteres. (OBG)",
      "label": "Gerar resumo de notificação",
      "location": "body[32]/table/row[58]"
    },
    "MSG001": {
      "text": "Preencha os campos obrigatórios destacados.",
      "label": "Finalização com obrigatórios ausentes.",
      "location": "body[35]/table/row[2]"
    },
    "MSG002": {
      "text": "Rascunho salvo com sucesso.",
      "label": "Rascunho persistido.",
      "location": "body[35]/table/row[3]"
    },
    "MSG003": {
      "text": "Relatório finalizado e encaminhado com sucesso.",
      "label": "Finalização concluída.",
      "location": "body[35]/table/row[4]"
    },
    "MSG004": {
      "text": "Deseja excluir definitivamente este rascunho?",
      "label": "Acionamento de Excluir.",
      "location": "body[35]/table/row[5]"
    },
    "MSG005": {
      "text": "Rascunho excluído com sucesso.",
      "label": "Exclusão concluída.",
      "location": "body[35]/table/row[6]"
    },
    "MSG006": {
      "text": "Informe um CPF ou CNPJ válido.",
      "label": "Documento inválido.",
      "location": "body[35]/table/row[7]"
    },
    "MSG007": {
      "text": "A data e a hora de término não podem ser anteriores ao início.",
      "label": "Período inválido.",
      "location": "body[35]/table/row[8]"
    },
    "MSG008": {
      "text": "Informe ao menos uma coordenada válida.",
      "label": "Consulta de área sem coordenada.",
      "location": "body[35]/table/row[9]"
    },
    "MSG009": {
      "text": "Nenhum histórico foi encontrado para os critérios informados.",
      "label": "Histórico sem resultado.",
      "location": "body[35]/table/row[10]"
    },
    "MSG010": {
      "text": "Nenhum relatório foi encontrado para os critérios informados.",
      "label": "Busca sem resultado.",
      "location": "body[35]/table/row[11]"
    },
    "MSG011": {
      "text": "Deseja aproveitar os dados selecionados neste relatório?",
      "label": "Antes da importação.",
      "location": "body[35]/table/row[12]"
    },
    "MSG012": {
      "text": "Não foi possível consultar os dados no GeoServer. Continue o preenchimento e tente novamente mais tarde.",
      "label": "Indisponibilidade total do GeoServer.",
      "location": "body[35]/table/row[13]"
    },
    "MSG013": {
      "text": "Não foi possível consultar os dados de empreendimentos, licenças e autorizações no GeoServer. Continue o preenchimento e tente novamente mais tarde.",
      "label": "Indisponibilidade das camadas de regulação.",
      "location": "body[35]/table/row[14]"
    },
    "MSG014": {
      "text": "O arquivo selecionado possui formato não permitido.",
      "label": "Anexo inválido.",
      "location": "body[35]/table/row[15]"
    },
    "MSG015": {
      "text": "Arquivo anexado com sucesso.",
      "label": "Anexação concluída.",
      "location": "body[35]/table/row[16]"
    },
    "MSG016": {
      "text": "Não foi possível salvar o relatório. Tente novamente.",
      "label": "Falha ao salvar ou finalizar.",
      "location": "body[35]/table/row[17]"
    },
    "MSG017": {
      "text": "Você não possui permissão para realizar esta ação.",
      "label": "Acesso não autorizado.",
      "location": "body[35]/table/row[18]"
    },
    "MSG018": {
      "text": "Após a finalização, o relatório seguirá para encaminhamento. Deseja continuar?",
      "label": "Antes de finalizar.",
      "location": "body[35]/table/row[19]"
    },
    "MSG019": {
      "text": "O texto de outras normas deve possuir no máximo 500 caracteres.",
      "label": "Exceder limite de outras normas",
      "location": "body[35]/table/row[20]"
    },
    "MSG020": {
      "text": "Não foi possível excluir o rascunho. Tente novamente.",
      "label": "Falha na exclusão.",
      "location": "body[35]/table/row[21]"
    },
    "MSG021": {
      "text": "O período de atendimento se sobrepõe a outro período informado. Deseja continuar?",
      "label": "Confirmação de sobreposição de atendimento.",
      "location": "body[35]/table/row[22]"
    },
    "MSG022": {
      "text": "Os dados da área atingida foram atualizados com base nas coordenadas informadas.",
      "label": "Consulta geoespacial concluída.",
      "location": "body[35]/table/row[23]"
    },
    "MSG023": {
      "text": "O texto das recomendações deve possuir no máximo 7.000 caracteres.",
      "label": "Limite das recomendações excedido.",
      "location": "body[35]/table/row[24]"
    },
    "MSG024": {
      "text": "Informe ao menos uma empresa envolvida, um representante para cada empresa e um participante do atendimento.",
      "label": "Dados mínimos dos envolvidos ausentes.",
      "location": "body[35]/table/row[25]"
    },
    "MSG025": {
      "text": "Não foi possível consultar todas as camadas do GeoServer. Os dados disponíveis foram apresentados.",
      "label": "Consulta parcial no GeoServer.",
      "location": "body[35]/table/row[26]"
    },
    "MSG026": {
      "text": "Informe a data inicial e a data final. A data final não pode ser anterior à data inicial.",
      "label": "Intervalo da consulta histórica inválido ou incompleto.",
      "location": "body[35]/table/row[27]"
    },
    "MSG027": {
      "text": "Selecione um arquivo nos formatos JPEG, JPG, PNG ou BMP.",
      "label": "Arquivo inválido para a descrição da emergência.",
      "location": "body[35]/table/row[28]"
    },
    "MSG028": {
      "text": "O relatório finalizado somente pode ser alterado pelo técnico autor após devolução para ajuste pelo gestor.",
      "label": "Tentativa de alterar relatório finalizado.",
      "location": "body[35]/table/row[29]"
    },
    "LEG001": {
      "text": "Gerado automaticamente após a finalização.",
      "label": "Número do RAE",
      "location": "body[38]/table/row[2]"
    },
    "LEG002": {
      "text": "Selecione o único processo que originou o atendimento de emergência.",
      "label": "Processo originador",
      "location": "body[38]/table/row[3]"
    },
    "LEG003": {
      "text": "Adicione cada intervalo em que houve atuação da equipe.",
      "label": "Períodos de atendimento",
      "location": "body[38]/table/row[4]"
    },
    "LEG004": {
      "text": "Informe somente números; o sistema validará o documento.",
      "label": "CPF/CNPJ",
      "location": "body[38]/table/row[5]"
    },
    "LEG005": {
      "text": "Adicione ao menos uma empresa relacionada à ocorrência.",
      "label": "Empresa envolvida",
      "location": "body[38]/table/row[6]"
    },
    "LEG006": {
      "text": "Adicione ao menos um representante para cada empresa envolvida.",
      "label": "Representantes",
      "location": "body[38]/table/row[7]"
    },
    "LEG007": {
      "text": "Adicione ao menos uma pessoa que participou do atendimento.",
      "label": "Participantes",
      "location": "body[38]/table/row[8]"
    },
    "LEG008": {
      "text": "Informe Geográfica/Grau Decimal, Grau/Min/Seg, UTM 23 ou UTM 24; o sistema converterá para grau decimal.",
      "label": "Coordenadas geográficas",
      "location": "body[38]/table/row[9]"
    },
    "LEG009": {
      "text": "Acione “Consultar área atingida” para consultar os dados no GeoServer.",
      "label": "Área atingida",
      "location": "body[38]/table/row[10]"
    },
    "LEG010": {
      "text": "Informe CPF/CNPJ, município, data inicial e data final para consultar ocorrências anteriores.",
      "label": "Histórico",
      "location": "body[38]/table/row[11]"
    },
    "LEG011": {
      "text": "Descreva os fatos, a evolução, os impactos e as medidas adotadas; inclua somente imagens JPEG, JPG, PNG ou BMP.",
      "label": "Descrição da emergência",
      "location": "body[38]/table/row[12]"
    },
    "LEG012": {
      "text": "Registre a avaliação técnica e o encerramento do atendimento.",
      "label": "Conclusão",
      "location": "body[38]/table/row[13]"
    },
    "LEG013": {
      "text": "Descreva obrigatoriamente a caracterização da infração em até 1.000 caracteres.",
      "label": "Caracterização da infração",
      "location": "body[38]/table/row[14]"
    },
    "LEG014": {
      "text": "Selecione artigo e respectivos desdobramentos.",
      "label": "Dispositivo normativo",
      "location": "body[38]/table/row[15]"
    },
    "LEG015": {
      "text": "Informe outras normas infringidas em até 500 caracteres.",
      "label": "Outras normas",
      "location": "body[38]/table/row[16]"
    },
    "LEG016": {
      "text": "Registre orientações técnicas, quando necessárias, em até 7.000 caracteres.",
      "label": "Recomendações",
      "location": "body[38]/table/row[17]"
    },
    "LEG017": {
      "text": "Inclua evidências nos formatos JPEG, JPG, PNG, BMP, MP3, MP4, PDF, DOC, DOCX, TXT, XLS, XLSX, SHP, SHX, DBF, PRJ, KML, KMZ ou ZIP.",
      "label": "Anexos",
      "location": "body[38]/table/row[18]"
    },
    "LEG018": {
      "text": "Campos destacados foram reaproveitados e devem ser conferidos.",
      "label": "Dados importados",
      "location": "body[38]/table/row[19]"
    },
    "LEG019": {
      "text": "Relatório editável e ainda sem número definitivo.",
      "label": "Rascunho",
      "location": "body[38]/table/row[20]"
    },
    "LEG020": {
      "text": "Relatório validado e encaminhado conforme o fluxo institucional.",
      "label": "Finalizado",
      "location": "body[38]/table/row[21]"
    },
    "LEG021": {
      "text": "Relatório devolvido pelo gestor com todos os campos liberados para alteração exclusiva do técnico autor até o reenvio.",
      "label": "Devolvido para ajuste",
      "location": "body[38]/table/row[22]"
    },
    "LEG022": {
      "text": "A seleção de enquadramento no Anexo VI é opcional.",
      "label": "Enquadramento no Anexo VI",
      "location": "body[38]/table/row[23]"
    },
    "LEG023": {
      "text": "Selecione um ou mais processos relacionados, sem substituir o processo originador.",
      "label": "Processos indexados",
      "location": "body[38]/table/row[24]"
    },
    "LEG024": {
      "text": "Os campos identificados como obrigatórios devem ser preenchidos antes da finalização.",
      "label": "Campos obrigatórios",
      "location": "body[38]/table/row[25]"
    },
    "TL001": {
      "text": "TL001 – Tela de Elaboração do Relatório de Atendimento de Emergência",
      "label": "Tela de Elaboração do Relatório de Atendimento de Emergência",
      "location": "body[42]/p"
    },
    "BOT001": {
      "text": "Novo RAE",
      "label": "Cabeçalho",
      "location": "body[45]/table/row[3]"
    },
    "BOT002": {
      "text": "Buscar relatório",
      "label": "Modal de aproveitamento",
      "location": "body[45]/table/row[4]"
    },
    "BOT003": {
      "text": "Aproveitar dados",
      "label": "Resultado da busca",
      "location": "body[45]/table/row[5]"
    },
    "BOT004": {
      "text": "Adicionar atendimento",
      "label": "Atendimento",
      "location": "body[45]/table/row[6]"
    },
    "BOT005": {
      "text": "Adicionar empresa",
      "label": "Empresas",
      "location": "body[45]/table/row[7]"
    },
    "BOT006": {
      "text": "\nAdicionar representante",
      "label": "Representantes",
      "location": "body[45]/table/row[8]"
    },
    "BOT007": {
      "text": "\nAdicionar participante",
      "label": "Participantes",
      "location": "body[45]/table/row[9]"
    },
    "BOT008": {
      "text": "Adicionar coordenada",
      "label": "Local da emergência",
      "location": "body[45]/table/row[10]"
    },
    "BOT009": {
      "text": "Consultar área atingida",
      "label": "Área atingida",
      "location": "body[45]/table/row[11]"
    },
    "BOT010": {
      "text": "Consultar histórico",
      "label": "Histórico",
      "location": "body[45]/table/row[12]"
    },
    "BOT011": {
      "text": "Adicionar infração",
      "label": "Infrações",
      "location": "body[45]/table/row[13]"
    },
    "BOT012": {
      "text": "Adicionar notificação",
      "label": "Notificações",
      "location": "body[45]/table/row[14]"
    },
    "BOT013": {
      "text": "Adicionar anexo",
      "label": "Anexos",
      "location": "body[45]/table/row[15]"
    },
    "BOT014": {
      "text": "Remover",
      "label": "Itens repetíveis",
      "location": "body[45]/table/row[16]"
    },
    "BOT015": {
      "text": "Salvar rascunho",
      "label": "Rodapé",
      "location": "body[45]/table/row[17]"
    },
    "BOT016": {
      "text": "Finalizar relatório",
      "label": "Rodapé",
      "location": "body[45]/table/row[18]"
    },
    "BOT017": {
      "text": "\nExcluir rascunho",
      "label": "Rodapé",
      "location": "body[45]/table/row[19]"
    },
    "BOT018": {
      "text": "Cancelar",
      "label": "Modal",
      "location": "body[45]/table/row[20]"
    },
    "BOT019": {
      "text": "Confirmar",
      "label": "Modal de sobreposição",
      "location": "body[45]/table/row[21]"
    }
  }
} as const;
