// DOR.001 v1.2 §17.3 e catálogos oficiais. Complementos recebidos preservados.
export const CATEGORIAS = [
  {
    "id": "1",
    "label": "Atividade de lazer, recreação e saúde em contato com a natureza",
    "description": "Praticada individualmente ou em grupo, com fins primordialmente lúdicos."
  },
  {
    "id": "2",
    "label": "Atividade esportiva",
    "description": "Com fins lúdicos, para condicionamento físico ou para treinamento de atletas, orientadas ou não por profissionais habilitados."
  },
  {
    "id": "3",
    "label": "Atividade de desenvolvimento pessoal ou interpessoal",
    "description": "Com fins terapêuticos, de autoconhecimento ou de fortalecimento de habilidades individuais ou coletivas, contemplando práticas orientadas ou não."
  },
  {
    "id": "4",
    "label": "Atividades culturais",
    "description": "Relacionadas ao conhecimento tradicional, manifestações artísticas ou práticas religiosas das comunidades locais ou tradicionais (ex.: mostra artística, museu ou biblioteca itinerante, show, performance, peça teatral, práticas religiosas)."
  },
  {
    "id": "5",
    "label": "Atividade guiada para fins turísticos",
    "description": "Vinculada ao acompanhamento, orientação e transmissão de informações aos visitantes sobre os atrativos naturais ou culturais, organizada por prestadores de serviços turísticos ou condutores de visitantes credenciados."
  },
  {
    "id": "6",
    "label": "Atividade de natureza comunitária, de interesse público ou institucional",
    "description": "Promovida por órgãos públicos, coletivos locais, organizações da sociedade civil, dentre outras, cuja motivação principal se vincula à dinâmica social e cultural (ex.: reunião comunitária, curso, palestra, seminário, feira, reunião de conselho ambiental, ação social ou campanha de interesse público, atividade de livre manifestação de pensamento, evento oficial cívico, militar ou de forças de segurança pública)."
  },
  {
    "id": "7",
    "label": "Atividade com finalidade privada ou corporativa",
    "description": "Promovida por indivíduos, empresas ou organizações, em que a UC é utilizada como espaço logístico ou cênico para ações não diretamente relacionadas aos seus atributos ambientais (ex.: festa ou comemoração particular, reunião, dinâmica de grupo corporativa, curso, palestra, seminário, feira de negócios)."
  },
  {
    "id": "8",
    "label": "Atividade de visitação com objetivo educacional (educação não-formal)",
    "description": "Estruturada de modo a atingir objetivos cognitivos, comportamentais ou atitudinais propostos, realizada por instituição habilitada a oferecer atividade de educação não-formal."
  },
  {
    "id": "9",
    "label": "Atividade Didática Tipo 1",
    "description": "Atividade caracterizada pela finalidade de contato com o meio e educação ambiental, em qualquer nível de ensino. Condição do Tipo 1: não realizar coleta de material biológico ou abiótico (Portaria INEMA nº 25.753/2022)."
  },
  {
    "id": "10",
    "label": "Atividade Didática Tipo 2",
    "description": "Atividade com finalidade didática em campo, no âmbito do ensino superior e técnico, podendo envolver coleta ou captura de material biológico ou abiótico (Portaria INEMA nº 25.753/2022)."
  },
  {
    "id": "11",
    "label": "Pesquisa em Unidade de Conservação",
    "description": "Qualquer atividade relacionada a pesquisas, bioprospecção ou desenvolvimento tecnológico, não compreendidas as atividades relacionadas à visitação (Portaria INEMA nº 25.753/2022)."
  }
] as const;
export const MENSAGENS = {
  "MSG001": "Esta etapa identifica sua necessidade e direciona você ao formulário correto. As informações detalhadas serão solicitadas somente quando aplicáveis.",
  "MSG002": "Seus dados de identificação foram recuperados do cadastro. Confira as informações antes de continuar.",
  "MSG003": "Esta Unidade de Conservação não está habilitada para esta solicitação no momento.",
  "MSG004": "O local selecionado está indisponível no período informado. Consulte outro local ou data.",
  "MSG005": "A data informada está fora do prazo mínimo para este tipo de atividade. Próxima data possível: [data].",
  "MSG006": "Selecione o tipo de atividade ou evento que pretende realizar na Unidade de Conservação para que o sistema direcione sua solicitação.",
  "MSG007": "Sua atividade será analisada pela equipe responsável para definição do enquadramento.",
  "MSG008": "Pelas condições informadas, sua atividade depende de solicitação de autorização. Você será direcionado ao formulário correspondente.",
  "MSG009": "Pelas condições informadas, sua atividade pode ser dispensada de solicitação de autorização ao INEMA. A dispensa está condicionada ao espaço disponível na data requerida e à capacidade da área de visitação. Consulte a administração da UC.",
  "MSG010": "Pelas respostas informadas, sua solicitação continuará no formulário de Atividade/Evento em Unidade de Conservação.",
  "MSG011": "Pelas respostas informadas, sua solicitação continuará no formulário de Atividade Didática.",
  "MSG012": "Pelas respostas informadas, sua solicitação continuará no formulário de Pesquisa Científica.",
  "MSG013": "Sua solicitação será direcionada ao processo correspondente. Os dados já informados serão reaproveitados.",
  "MSG014": "Antes de iniciar o preenchimento, confira a lista de documentos obrigatórios e complementares do processo.",
  "MSG015": "Os dados comuns já informados foram carregados automaticamente no próximo formulário.",
  "MSG016": "Rascunho salvo com sucesso."
};
export const LEGENDAS = {
  "LEG001": "Etapa comum usada para identificar a necessidade do usuário e direcionar ao processo adequado.",
  "LEG002": "Identificação obtida do cadastro do usuário; não deve ser redigitada quando já estiver disponível.",
  "LEG003": "Selecione a UC onde pretende realizar a atividade.",
  "LEG004": "Selecione o local cadastrado na UC quando essa informação for necessária à triagem.",
  "LEG005": "Responda o que pretende realizar. O sistema usará essa informação para abrir o formulário correto.",
  "LEG006": "Descrição livre, com limite de caracteres, quando não houver categoria correspondente.",
  "LEG007": "Situações que, se marcadas, implicam a abertura de processo de Solicitação de Autorização.",
  "LEG008": "Hipótese em que a atividade pode ser dispensada de solicitação de autorização ao INEMA, observadas as condicionantes de espaço disponível e capacidade.",
  "LEG009": "Informe a data pretendida para início da atividade.",
  "LEG010": "Antecedência mínima exigida entre a abertura da solicitação e o início da atividade, variável conforme o tipo de atividade.",
  "LEG011": "Primeira data que atende ao prazo mínimo do tipo de atividade.",
  "LEG012": "Fluxo de autorização de visitação/evento descrito na Autorização para Visitação.",
  "LEG013": "Fluxo descrito na Autorização para Realização de Atividades Didáticas, Tipo 1 ou Tipo 2, conforme a Portaria INEMA nº 25.753/2022.",
  "LEG014": "Fluxo descrito na Autorização para Realização de Pesquisa Científica em UC.",
  "LEG015": "Processo correlato acionado quando aplicável.",
  "LEG016": "Formulário que apresenta somente os campos e documentos compatíveis com o processo identificado pela triagem."
};

// Parâmetros de demonstração: não representam homologação INEMA/PROJUR.
export const PARAMETROS = {
  version: 'dor001-v1.2-demo1', calendarVersion: 'segunda-sexta-sem-feriados',
  days: { visitacao: 30, tipo1: 20, tipo2: 45, pesquisa: 45 }, holidays: [] as string[],
  daysByUc: {} as Record<string, Partial<Record<'visitacao'|'tipo1'|'tipo2'|'pesquisa',number>>>,
  otherLimit: 500, cancelledDrafts: true,
  blocks: [{ ucId: 'UC-CONDURU', localId: 'MIRANTE-SERRA', from: '2027-06-01', to: '2027-06-03', reason: 'Manutenção — cenário demonstrativo, sem consulta ao CEUC.' }],
};
export const REQUERENTE = { id: 'requerente-demo', name: 'Pessoa Requerente de Demonstração', cpf: '000.000.000-00', email: 'requerente@example.invalid', phone: '(00) 00000-0000' };
export const CONDICOES = [
  { key: 'regular', label: 'Uso regular da área de visitação', help: 'Uso regular dos atrativos ou da infraestrutura durante a atividade. A periodicidade depende de definição da área.' },
  { key: 'restricted', label: 'Restrição de uso por outros visitantes', help: 'Restrição total ou parcial do uso da área de visitação.' },
  { key: 'structure', label: 'Estrutura temporária ou equipamento específico', help: 'Instalação de estrutura temporária ou uso de equipamento específico pelo próprio requerente.' },
  { key: 'people', label: 'Participação de mais de 20 pessoas', help: 'Inclui equipe de apoio, participantes e espectadores.' },
] as const;
