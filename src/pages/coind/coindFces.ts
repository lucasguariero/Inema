export type CoindKind = 'industria' | 'desmantelamento' | 'dutovia';
export type FcePhase = 'LP' | 'LI' | 'LU' | 'LA' | 'LO' | 'AA' | 'Renovacao';
export type FceValue = string | string[] | Record<string, string>[];
export type FceData = Record<string, FceValue>;

export type Condition = {
  key?: string;
  value?: string;
  notValue?: string;
  phase?: FcePhase | FcePhase[];
  notPhase?: FcePhase | FcePhase[];
};

export interface FceField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'integer' | 'textarea' | 'radio' | 'select' | 'checks' | 'table' | 'computed' | 'pending';
  unit?: string;
  required?: boolean | ((data: FceData, phase?: FcePhase) => boolean);
  options?: string[];
  when?: Condition | Condition[];
  hint?: string;
  source?: string;
  comments?: number[];
  columns?: FceField[];
}

export interface FceSection {
  title: string;
  source: string;
  comments?: number[];
  note?: string;
  fields: FceField[];
  documents?: string[];
  whenPhase?: FcePhase | FcePhase[];
}

export interface FceStep {
  title: string;
  sections: FceSection[];
  whenPhase?: FcePhase | FcePhase[];
}

export interface CoindDefinition {
  kind: CoindKind;
  title: string;
  route: string;
  defaultPhase: FcePhase;
  availablePhases: FcePhase[];
  steps: FceStep[];
}

export const yesNo = ['Sim', 'Não'];

export const numberField = (key: string, label: string, unit = '', required = true): FceField => ({ key, label, type: 'number', unit, required });
export const textField = (key: string, label: string, required = true): FceField => ({ key, label, required });
export const countField = (key: string, label: string, required = true): FceField => ({ key, label, type: 'integer', required });
export const choice = (key: string, label: string, options: string[], type: 'radio' | 'select' | 'checks' = 'radio'): FceField => ({ key, label, options, type, required: true });
export const pending = (key: string, label: string, hint: string): FceField => ({ key, label, type: 'pending', hint });

// Catálogo de substâncias perigosas com mapeamento automático de código ONU / CAS (#223, #224, #226)
export const SUBSTANCIAS_ONU_MAP: Record<string, string> = {
  // Explosivas
  'Nitroglicerina': 'ONU 0143 (Classe 1.1D)',
  'Dinamite': 'ONU 0081 (Classe 1.1D)',
  'Fulminato de mercúrio': 'ONU 0135 (Classe 1.1A)',
  'Trinitrotolueno (TNT)': 'ONU 0209 (Classe 1.1D)',
  'Pólvora negra': 'ONU 0027 (Classe 1.1D)',
  // Tóxicas
  'Cloro gasoso': 'ONU 1017 (Classe 2.3)',
  'Amônia anidra': 'ONU 1005 (Classe 2.3)',
  'Ácido cianídrico': 'ONU 1051 (Classe 6.1)',
  'Cianeto de sódio': 'ONU 1689 (Classe 6.1)',
  'Fosgênio': 'ONU 1076 (Classe 2.3)',
  // Inflamáveis CEPRAM II.3
  'Acetona': 'ONU 1090 (Classe 3)',
  'Álcool etílico (Etanol)': 'ONU 1170 (Classe 3)',
  'Gasolina automotiva': 'ONU 1203 (Classe 3)',
  'Hexano': 'ONU 1208 (Classe 3)',
  'GLP - Gás Liquefeito de Petróleo': 'ONU 1075 (Classe 2.1)',
  'Óleo diesel': 'ONU 1202 (Classe 3)',
  'Solvente de nafta': 'ONU 1268 (Classe 3)',
  'Tolueno': 'ONU 1294 (Classe 3)',
  'Xileno': 'ONU 1307 (Classe 3)',
  'Metanol': 'ONU 1230 (Classe 3/6.1)',
  'Outra / Inserir substância não listada': 'Personalizado',
};

export const LISTA_EXPLOSIVAS = [
  'Nitroglicerina',
  'Dinamite',
  'Fulminato de mercúrio',
  'Trinitrotolueno (TNT)',
  'Pólvora negra',
  'Outra / Inserir substância não listada',
];

export const LISTA_TOXICAS = [
  'Cloro gasoso',
  'Amônia anidra',
  'Ácido cianídrico',
  'Cianeto de sódio',
  'Fosgênio',
  'Outra / Inserir substância não listada',
];

export const LISTA_INFLAMAVEIS_CEPRAM = [
  'Acetona',
  'Álcool etílico (Etanol)',
  'Gasolina automotiva',
  'Hexano',
  'GLP - Gás Liquefeito de Petróleo',
  'Óleo diesel',
  'Solvente de nafta',
  'Tolueno',
  'Xileno',
  'Metanol',
  'Outra / Inserir substância não listada',
];

// 1. FCE DE INDÚSTRIA (#261 - #276, #283)
export const industria: CoindDefinition = {
  kind: 'industria',
  title: 'FCE de Indústria',
  route: 'coind-industria',
  defaultPhase: 'LO',
  availablePhases: ['LP', 'LI', 'LU', 'LO', 'Renovacao'],
  steps: [
    {
      title: 'Identificação e recursos hídricos',
      sections: [
        {
          title: 'Abastecimento de água industrial',
          source: '157:982',
          comments: [261],
          fields: [
            {
              ...choice('fonteAgua', 'Fonte de abastecimento de água', ['Subterrâneo', 'Superficial', 'Caminhão-Pipa', 'Concessionária'], 'radio'),
              comments: [261],
            },
            numberField('consumoMedio', 'Consumo médio de água', 'm³/dia'),
            numberField('vazaoHoraria', 'Vazão de captação', 'm³/h'),
            {
              ...textField('portariaOutorga', 'Número da portaria de outorga ou dispensa', false),
              when: { key: 'fonteAgua', notValue: 'Concessionária' },
              hint: 'Opcional para concessionária pública; obrigatório quando houver captação própria em corpo hídrico.',
            },
          ],
          documents: ['Outorga de direito de uso de recursos hídricos ou dispensa — ATEND'],
        },
        {
          title: 'Efluentes industriais e sanitários',
          source: '157:982',
          comments: [262, 263, 264],
          whenPhase: ['LI', 'LU', 'LO', 'Renovacao'],
          note: 'Esta aba é exibida especificamente a partir da Licença de Instalação (LI). Não é exigida na LP (#262).',
          fields: [
            {
              ...choice('descarteEfluente', 'Haverá descarte de efluentes tratados em corpo receptor?', yesNo),
              comments: [263],
            },
            {
              ...choice('corpoReceptor', 'Corpo receptor final', ['Rio / Riacho', 'Solo / Infiltração', 'Rede pública com ETE', 'Não se aplica'], 'select'),
              comments: [263],
              hint: 'Opção "Não se aplica" incluída conforme item #263 para casos de recirculação ou evaporação total.',
            },
            {
              key: 'tabelaEfluentes',
              label: 'Caracterização e lançamento de efluentes',
              type: 'table',
              required: (_d, phase) => phase === 'LU' || phase === 'LO',
              comments: [264],
              hint: 'Obrigatória na Licença de Unificação (LU) e Operação (LO) (#264).',
              columns: [
                textField('tipoEfluente', 'Tipo de efluente (sanitário/industrial)'),
                numberField('vazaoEfluente', 'Vazão média', 'm³/dia'),
                textField('sistemaTratamento', 'Sistema de tratamento adotado'),
                textField('corpoReceptorRow', 'Corpo receptor'),
              ],
            },
          ],
          documents: ['Projeto executivo do sistema de tratamento de efluentes líquidos (LI) — ATEND'],
        },
      ],
    },
    {
      title: 'Resíduos sólidos e produtos perigosos',
      sections: [
        {
          title: 'Resíduos sólidos industriais (ABNT NBR 10004:2024)',
          source: '157:991',
          comments: [265, 266],
          fields: [
            {
              key: 'tabelaResiduosAbnt',
              label: 'Classificação de resíduos conforme ABNT NBR 10004:2024',
              type: 'table',
              required: (_d, phase) => phase !== 'LP' && phase !== 'LI',
              comments: [265, 266],
              hint: 'Classificação segundo ABNT NBR 10004:2024 (#265). O preenchimento detalhado não é obrigatório SOMENTE na LP e LI (#266); obrigatório na LO e LU.',
              columns: [
                textField('origemResiduo', 'Origem / Processo gerador'),
                textField('classificacaoAbnt', 'Classe ABNT (Classe I - Perigoso / Classe II A - Não inerte / Classe II B - Inerte)'),
                numberField('geracaoMensal', 'Geração estimada', 't/mês'),
                textField('armazenamento', 'Forma de armazenamento temporário'),
                textField('destinacaoFinal', 'Destinação final ambientalmente adequada'),
              ],
            },
          ],
          documents: ['Plano de Gerenciamento de Resíduos Sólidos — PGRS — ATEND'],
        },
        {
          title: 'Plano de Gerenciamento de Resíduos Sólidos (CEPRAM 4578/2017)',
          source: '157:997',
          comments: [267, 268, 269, 270, 271, 272],
          fields: [
            {
              ...textField('numeroPgrs', 'Número / Identificação do PGRS vigente'),
              required: (_d, phase) => phase !== 'LP',
              comments: [267],
              hint: 'PGRS conforme Deliberação CEPRAM 4578/2017 (NT-01/2017). Não é obrigatório na LP (#267); obrigatório nas demais fases.',
            },
            {
              ...textField('periodicidadeRevisaoPgrs', 'Periodicidade de revisão e atualização do PGRS', false),
              hint: 'Prazo regulamentar de 5 anos (#268, #272).',
              comments: [268, 272],
            },
            {
              ...textField('metasMinimizacao', 'Metas de minimização de resíduos e reutilização', false),
              type: 'textarea',
              comments: [269],
              hint: 'Campo opcional (#269).',
            },
            {
              ...textField('logisticaReversa', 'Sistemas de logística reversa aplicáveis', false),
              type: 'textarea',
              comments: [270],
              hint: 'Campo opcional (#270).',
            },
            {
              ...textField('reaproveitamentoEnergetico', 'Reaproveitamento energético ou coprocessamento', false),
              type: 'textarea',
              comments: [271],
              hint: 'Campo opcional (#271).',
            },
          ],
          documents: ['Anotação de Responsabilidade Técnica (ART) do PGRS — ATEND'],
        },
        {
          title: 'Substâncias perigosas e inflamáveis (CEPRAM II.3)',
          source: '107:1901',
          comments: [223, 224, 226, 227],
          fields: [
            {
              key: 'tabelaExplosivas',
              label: 'Substâncias explosivas',
              type: 'table',
              required: false,
              comments: [226],
              hint: 'Tabela segregada para substâncias com propriedades explosivas (#226).',
              columns: [
                { ...choice('substancia', 'Substância', LISTA_EXPLOSIVAS, 'select'), comments: [223] },
                { ...textField('codigoOnu', 'Código ONU / Classe'), hint: 'Preenchido automaticamente ao selecionar a substância (#224).' },
                numberField('capacidadeArmazenada', 'Capacidade armazenada', 'kg'),
                textField('localArmazenamento', 'Local / Edificação de armazenamento'),
              ],
            },
            {
              key: 'tabelaToxicas',
              label: 'Substâncias tóxicas',
              type: 'table',
              required: false,
              comments: [226],
              hint: 'Tabela segregada para substâncias com propriedades tóxicas (#226).',
              columns: [
                { ...choice('substancia', 'Substância', LISTA_TOXICAS, 'select'), comments: [223] },
                { ...textField('codigoOnu', 'Código ONU / Classe'), hint: 'Preenchido automaticamente ao selecionar a substância (#224).' },
                numberField('capacidadeArmazenada', 'Capacidade armazenada', 't'),
                textField('localArmazenamento', 'Forma de contenção'),
              ],
            },
            {
              key: 'tabelaInflamaveis',
              label: 'Substâncias inflamáveis (Listagem CEPRAM II.3)',
              type: 'table',
              required: false,
              comments: [223, 224, 226],
              hint: 'Tabela segregada para substâncias inflamáveis com base no Anexo II.3 do CEPRAM (#223, #226). Código ONU preenchido automaticamente (#224).',
              columns: [
                { ...choice('substancia', 'Substância', LISTA_INFLAMAVEIS_CEPRAM, 'select'), comments: [223] },
                { ...textField('codigoOnu', 'Código ONU / Classe'), hint: 'Preenchido automaticamente ao selecionar a substância (#224).' },
                numberField('capacidadeArmazenada', 'Capacidade máxima de armazenamento', 'm³'),
                textField('tipoRecipiente', 'Tipo de tanque / recipiente'),
              ],
            },
          ],
          documents: [
            'Plano de Ação de Emergência — PAE (obrigatório para produtos perigosos) — ATEND (#227)',
            'Estudo de Análise de Risco (EAR) e PGR integrado — ATEND',
          ],
        },
      ],
    },
    {
      title: 'Comunidades, emergência e programas',
      sections: [
        {
          title: 'Povos e comunidades tradicionais',
          source: '170:989',
          comments: [274],
          fields: [
            {
              ...choice('interferenciaTradicional', 'Há sobreposição ou proximidade com Povos e Comunidades Tradicionais?', yesNo),
              comments: [274],
            },
            {
              ...choice('tipoComunidade', 'Tipo de comunidade identificada', ['Indígena', 'Quilombola', 'Fundo e Fecho de Pasto', 'Pescadores Artesanais', 'Outros'], 'checks'),
              when: { key: 'interferenciaTradicional', value: 'Sim' },
              comments: [274],
            },
            {
              ...numberField('distanciaComunidade', 'Distância até a comunidade mais próxima', 'km'),
              when: { key: 'interferenciaTradicional', value: 'Sim' },
            },
            {
              ...textField('medidasMitigadorasTradicional', 'Medidas de mitigação ou anuência prévia', false),
              type: 'textarea',
              when: { key: 'interferenciaTradicional', value: 'Sim' },
            },
          ],
          documents: ['Estudo do Componente Indígena / Quilombola ou manifestação de órgãos intervenientes — ATEND'],
        },
        {
          title: 'Contatos de emergência (LO e renovações)',
          source: '63:3501',
          comments: [228, 229, 273],
          whenPhase: ['LI', 'LU', 'LA', 'LO', 'Renovacao'],
          note: 'Não é exibido na fase LP (#229). Aplicável em LO, LI, LU e renovações (#228, #273). Permite adicionar múltiplos contatos próprios e terceiros.',
          fields: [
            {
              key: 'contatosEmergencia',
              label: 'Contatos de emergência cadastrados',
              type: 'table',
              required: true,
              comments: [228, 273],
              columns: [
                choice('tipoContato', 'Tipo de contato', ['Próprio', 'Terceiro'], 'select'),
                textField('documento', 'Documento (CPF ou CNPJ)'),
                textField('nomeRazao', 'Nome / Razão Social'),
                textField('cargoFuncaoRt', 'Cargo, Função ou Nome do RT'),
                textField('telefone', 'Telefone 24h'),
                textField('email', 'E-mail'),
              ],
            },
          ],
        },
        {
          title: 'Planos e programas ambientais',
          source: '157:1006',
          comments: [275, 276],
          fields: [
            {
              ...textField('programasPrevistosLp', 'Programas ambientais propostos para implantação', true),
              type: 'textarea',
              when: { phase: 'LP' },
              comments: [276],
              hint: 'Exibido somente no cenário LP (#276). Nas demais fases, o acompanhamento é feito via tabela de planos executados.',
            },
            {
              ...textField('justificativaProgramasLp', 'Justificativa e objetivos dos programas propostos', false),
              type: 'textarea',
              when: { phase: 'LP' },
              comments: [276],
              hint: 'Exibido somente no cenário LP (#276).',
            },
            {
              key: 'tabelaPlanosExecutados',
              label: 'Planos Elaborados / Executados Durante a Vigência da Licença',
              type: 'table',
              required: true,
              when: { notPhase: 'LP' },
              comments: [275, 276],
              hint: 'Adicionado campo alfanumérico para o usuário inserir em tabela os Planos Elaborados/Executados Durante a Vigência da Licença (a tabela não deve ser exibida em caso de LP) (#275).',
              columns: [
                textField('nomePlano', 'Nome do Plano / Programa ambiental'),
                textField('protocoloAtend', 'Órgão de controle / Protocolo ATEND'),
                textField('faseExecucao', 'Fase de execução (elaboração / em monitoramento / concluído)'),
                textField('statusRelatorio', 'Status da entrega do relatório de monitoramento'),
              ],
            },
          ],
          documents: ['Relatórios de cumprimento de condicionantes da licença anterior — ATEND'],
        },
      ],
    },
    {
      title: 'Revisão e conclusão',
      sections: [],
    },
  ],
};

// 2. FCE DE DESMANTELAMENTO / AUTORIZAÇÃO AMBIENTAL (AA) (#234 - #241, #283)
export const desmantelamento: CoindDefinition = {
  kind: 'desmantelamento',
  title: 'FCE de Desmantelamento / Autorização Ambiental (AA)',
  route: 'coind-desmantelamento',
  defaultPhase: 'AA',
  availablePhases: ['AA'],
  steps: [
    {
      title: 'Enquadramento e objeto da autorização',
      sections: [
        {
          title: 'Identificação da Autorização Ambiental (AA)',
          source: '111:1931',
          comments: [234, 235],
          fields: [
            {
              ...choice('motivoAa', 'Motivo da Autorização Ambiental', [
                'Teste Industrial',
                'Teste para Incorporação',
                'Teste para Queima',
                'Desativação Parcial',
                'Desativação Total',
                'Intervenção de Área Contaminada',
                'Remediação de Área Contaminada',
              ], 'select'),
              comments: [235],
              hint: 'A lista é parametrizada conforme o enquadramento formal da ATEND (#235).',
            },
            {
              ...textField('descricaoObjetoAa', 'Descreva detalhadamente o objeto da autorização ambiental', true),
              type: 'textarea',
              comments: [232, 235],
              hint: 'Descrição obrigatória em todas as fases da solicitação (#232, #235).',
            },
          ],
          documents: ['Requerimento de Autorização Ambiental e Certidão de Uso do Solo — ATEND'],
        },
        {
          title: 'Substâncias, metodologias e destinação',
          source: '63:3501',
          comments: [236, 237, 238],
          fields: [
            {
              ...textField('caracterizacaoSubstancias', 'Caracterização de substâncias, metodologias e destinação', true),
              type: 'textarea',
              comments: [236, 237, 238],
              hint: 'Campo obrigatório para a Autorização Ambiental (#236, #237, #238): caracterização técnica das substâncias residuais, metodologia de neutralização/descontaminação e destinação ambientalmente segura.',
            },
            {
              ...textField('cronogramaDesativacao', 'Cronograma previsto de desativação / intervenção', true),
              type: 'textarea',
              comments: [233],
              hint: 'Obrigatório para todas as modalidades de desativação e remediação (#233).',
            },
          ],
          documents: [
            'Plano de Desativação e Encerramento de Atividades — ATEND',
            'Plano de Intervenção ou Remediação de Área Contaminada aprovado — ATEND',
          ],
        },
      ],
    },
    {
      title: 'Estruturas, interferências e áreas',
      sections: [
        {
          title: 'Estruturas objeto de desmantelamento ou intervenção',
          source: '113:1940',
          comments: [240, 241],
          note: 'Todos os campos de quantificação desta seção foram definidos como opcionais (#241).',
          fields: [
            {
              ...choice('estruturasIntervencao', 'Estruturas envolvidas na intervenção', ['Linha de Transmissão', 'Pistas', 'APP', 'Outros'], 'checks'),
              comments: [240],
              hint: 'Estruturas adicionadas: Linha de Transmissão, Pistas, APP e Outros (#240).',
            },
            {
              ...numberField('extensaoLinha', 'Extensão de linha de transmissão a ser desmantelada', 'km', false),
              when: { key: 'estruturasIntervencao', value: 'Linha de Transmissão' },
              comments: [241],
            },
            {
              ...numberField('areaPistas', 'Área de pistas ou acessos a recuperar', 'm²', false),
              when: { key: 'estruturasIntervencao', value: 'Pistas' },
              comments: [241],
            },
            {
              ...numberField('areaApp', 'Área de intervenção em APP', 'ha', false),
              when: { key: 'estruturasIntervencao', value: 'APP' },
              comments: [241],
            },
            {
              ...numberField('volumeSoloRemover', 'Volume estimado de solo/entulho a ser removido', 'm³', false),
              comments: [241],
            },
          ],
          documents: [
            'Levantamento planialtimétrico da área de intervenção — ATEND',
            'Plano de Recuperação de Áreas Degradadas (PRAD) — ATEND',
          ],
        },
        {
          title: 'Resíduos gerados no desmantelamento',
          source: '94:2035',
          comments: [209, 210, 211],
          fields: [
            {
              key: 'tabelaResiduosDesmantelamento',
              label: 'Quantitativo diário e mensal de resíduos do desmantelamento',
              type: 'table',
              required: true,
              comments: [209],
              hint: 'Deve informar a quantidade diária recebida/gerada para CADA tipo de resíduo (#209).',
              columns: [
                textField('tipoResiduo', 'Tipo de resíduo gerado'),
                numberField('qtdDiaria', 'Quantidade diária gerada', 't/dia'),
                numberField('qtdMensal', 'Quantidade mensal estimada', 't/mês'),
                textField('horarioTransporte', 'Horário preferencial de transporte'),
              ],
            },
            {
              ...choice('tipoVeiculoTransporte', 'Tipos de veículos utilizados para remoção', [
                'Caminhão Baú',
                'Caminhão Tanque',
                'Caminhão Caçamba Basculante',
                'Carreta Graneleira',
                'Veículo Utilitário / VUC',
                'Outro',
              ], 'checks'),
              comments: [210, 211],
            },
          ],
          documents: ['Manifesto de Transporte de Resíduos (MTR) e Certificado de Destinação — ATEND'],
        },
      ],
    },
    {
      title: 'Revisão e conclusão',
      sections: [],
    },
  ],
};

// 3. FCE DE DUTOVIA (#251 - #260, #283)
export const dutovia: CoindDefinition = {
  kind: 'dutovia',
  title: 'FCE de Dutovia',
  route: 'coind-dutovia',
  defaultPhase: 'LP',
  availablePhases: ['LP', 'LI', 'LA', 'LO'],
  steps: [
    {
      title: 'Traçado, faixa de servidão e extensão',
      sections: [
        {
          title: 'Geometria do traçado e extensão',
          source: '113:1937',
          comments: [251, 256],
          fields: [
            {
              ...numberField('extensaoDuto', 'Extensão do duto', 'km', true),
              comments: [251, 256],
              hint: 'Extensão informada no requerimento / traçado geoespacial (#251, #256).',
            },
            {
              ...choice('tipoInstalacaoDuto', 'Tipo de assentamento do duto', ['Subterrâneo (enterrado)', 'Aéreo (suportes)', 'Submarino / Subaquático', 'Misto']),
            },
            {
              ...numberField('diametroNominalDuto', 'Diâmetro nominal do duto', 'pol'),
            },
          ],
          documents: ['Traçado georreferenciado da diretriz do duto (shapefile) — ATEND'],
        },
        {
          title: 'Faixa de servidão',
          source: '113:1937',
          comments: [253, 254, 255],
          fields: [
            {
              ...numberField('larguraFaixaServidao', 'Largura da faixa de servidão', 'm', true),
              comments: [253],
            },
            {
              ...choice('faixaInterceptaAreasRestritas', 'A faixa de servidão intercepta áreas restritas ou de preservação?', yesNo),
              comments: [254],
            },
            {
              ...textField('usoOcupacaoFaixa', 'Uso e ocupação da faixa de servidão'),
              type: 'textarea',
              comments: [255],
              hint: 'Descreva a destinação, acessos e restrições na faixa de servidão (#255).',
            },
          ],
        },
      ],
    },
    {
      title: 'Operação, pressão e produto transportado',
      sections: [
        {
          title: 'Parâmetros operacionais do projeto',
          source: '113:1943',
          comments: [259, 260],
          fields: [
            {
              ...numberField('pressaoNominal', 'Pressão nominal do Projeto', 'kgf/cm²', true),
              comments: [259],
              hint: 'Pressão nominal de operação do duto (#259).',
            },
            {
              ...numberField('vazaoProjeto', 'Vazão do projeto', 'm³/h', true),
              comments: [260],
              hint: 'Vazão máxima prevista de escoamento (#260).',
            },
            {
              ...choice('produtoTransportado', 'Produto transportado', [
                'Gás natural',
                'Petróleo cru',
                'Derivados de petróleo (combustíveis)',
                'Biocombustíveis (Etanol/Biodiesel)',
                'Mineroduto (polpa de minério)',
                'Produtos químicos / perigosos',
                'Água bruta industrial',
                'Outros',
              ], 'select'),
            },
          ],
          documents: ['Fluxograma de processo e memorial descritivo dos sistemas de bombeamento/compressão — ATEND'],
        },
        {
          title: 'Detalhamento executivo e travessias (somente em LA)',
          source: '113:1937',
          comments: [252],
          whenPhase: ['LA'],
          note: 'Esta seção é aplicável especificamente na Licença de Alteração (LA) (#252).',
          fields: [
            {
              key: 'tabelaTravessias',
              label: 'Travessias e cruzamentos especiais de dutos',
              type: 'table',
              required: true,
              comments: [252],
              columns: [
                textField('tipoTravessia', 'Tipo (curso d’água / rodovia / ferrovia)'),
                textField('metodoExecutivo', 'Método construtivo (Perfuração Direcional / Vala a céu aberto)'),
                numberField('extensaoTravessia', 'Extensão do trecho', 'm'),
                textField('profundidadeEnterrio', 'Profundidade mínima de cobertura (m)'),
              ],
            },
          ],
          documents: ['Projeto executivo das travessias aprovado pela concessionária ou órgão rodoviário — ATEND'],
        },
        {
          title: 'Área de influência e entorno (10 km)',
          source: '94:2050',
          comments: [215, 216],
          fields: [
            {
              ...choice('interferenciaRaio10km', 'Foram identificadas comunidades ou infraestruturas críticas no raio de 10 km?', yesNo),
              comments: [215, 216],
              hint: 'Raio de análise de 10 km conforme diretriz do formulário (#215, #216).',
            },
            {
              ...textField('descricaoEntorno10km', 'Descrição das interferências no raio de 10 km', false),
              type: 'textarea',
              when: { key: 'interferenciaRaio10km', value: 'Sim' },
              comments: [215, 216],
            },
          ],
          documents: [
            'Estudo de Dispersão e Análise de Risco com abrangência de 10 km — ATEND',
            'Plano de Atendimento a Emergências (PAE) para vazamento em dutovia — ATEND',
          ],
        },
      ],
    },
    {
      title: 'Revisão e conclusão',
      sections: [],
    },
  ],
};

export const coindDefinitions: Record<CoindKind, CoindDefinition> = {
  industria,
  desmantelamento,
  dutovia,
};

// Funções de visibilidade e cálculo
export function visibleField(field: FceField, data: FceData, currentPhase?: FcePhase): boolean {
  if (!field.when) return true;
  const conditions = Array.isArray(field.when) ? field.when : [field.when];
  return conditions.every(c => {
    if (c.phase !== undefined) {
      const allowed = Array.isArray(c.phase) ? c.phase : [c.phase];
      if (currentPhase && !allowed.includes(currentPhase)) return false;
    }
    if (c.notPhase !== undefined) {
      const forbidden = Array.isArray(c.notPhase) ? c.notPhase : [c.notPhase];
      if (currentPhase && forbidden.includes(currentPhase)) return false;
    }
    if (c.key !== undefined) {
      const val = data[c.key];
      if (c.value !== undefined) return val === c.value;
      if (c.notValue !== undefined) return val !== undefined && val !== '' && val !== c.notValue;
    }
    return true;
  });
}

export function visibleSection(section: FceSection, currentPhase?: FcePhase): boolean {
  if (!section.whenPhase) return true;
  const allowed = Array.isArray(section.whenPhase) ? section.whenPhase : [section.whenPhase];
  return currentPhase ? allowed.includes(currentPhase) : true;
}

export function visibleStep(step: FceStep, currentPhase?: FcePhase): boolean {
  if (!step.whenPhase) return true;
  const allowed = Array.isArray(step.whenPhase) ? step.whenPhase : [step.whenPhase];
  return currentPhase ? allowed.includes(currentPhase) : true;
}

export function isFieldRequired(field: FceField, data: FceData, phase?: FcePhase): boolean {
  if (typeof field.required === 'function') return field.required(data, phase);
  return !!field.required;
}

export function parseNumber(value: string): number | undefined {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return undefined;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : undefined;
}

export function numericError(value: string, integer = false): string | undefined {
  if (!value.trim()) return;
  const n = parseNumber(value);
  if (n === undefined) return 'Informe um número não negativo, usando vírgula ou ponto como separador decimal.';
  if (integer && !Number.isInteger(n)) return 'Informe uma quantidade inteira.';
}

export function activeFields(section: FceSection, data: FceData, phase?: FcePhase): FceField[] {
  return section.fields.filter(f => visibleField(f, data, phase));
}

export function fieldError(field: FceField, data: FceData, phase?: FcePhase): string | undefined {
  if (!visibleField(field, data, phase) || field.type === 'pending' || field.type === 'computed') return;
  const isReq = isFieldRequired(field, data, phase);
  const value = data[field.key];
  if (isReq && (!value || (typeof value === 'string' ? !value.trim() : !value.length))) return 'Preencha este campo.';
  if (field.type === 'integer' || field.type === 'number') return numericError(String(value || ''), field.type === 'integer');
  if (field.type === 'table') {
    for (const row of (Array.isArray(value) ? value : []) as Record<string, string>[]) {
      for (const column of field.columns || []) {
        const error = fieldError(column, row, phase);
        if (error) return `${column.label}: ${error}`;
      }
    }
  }
}

export function stepErrors(step: FceStep, data: FceData, phase?: FcePhase): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const s of step.sections) {
    if (!visibleSection(s, phase)) continue;
    for (const f of activeFields(s, data, phase)) {
      const error = fieldError(f, data, phase);
      if (error) errors[f.key] = error;
      if (
        f.options?.some(o => /^(outro|outra)/i.test(o)) &&
        (typeof data[f.key] === 'string'
          ? /^(outro|outra)/i.test(String(data[f.key]))
          : Array.isArray(data[f.key]) && (data[f.key] as string[]).some(v => /^(outro|outra)/i.test(v))) &&
        !String(data[f.key + 'Descricao'] || '').trim()
      ) {
        errors[f.key + 'Descricao'] = 'Descreva a opção informada.';
      }
    }
  }
  return errors;
}
