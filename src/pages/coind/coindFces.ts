export type CoindKind = 'industria' | 'desmantelamento' | 'dutovia';
export type FcePhase = 'LP' | 'LI' | 'LU' | 'LA' | 'LO' | 'AA' | 'Renovacao';
export type FceValue = string | string[] | Record<string, string>[];
export type FceData = Record<string, FceValue>;

export type Condition = {
  key?: string;
  value?: string;
  notValue?: string;
  notIn?: string[];
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
  compute?: (data: FceData, phase?: FcePhase) => string;
}

export interface FceSection {
  title: string;
  source: string;
  comments?: number[];
  note?: string;
  fields: FceField[];
  documents?: string[];
  whenPhase?: FcePhase | FcePhase[];
  when?: Condition | Condition[];
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

export const numberField = (key: string, label: string, unit = '', required = true): FceField => ({
  key,
  label,
  type: 'number',
  unit,
  required,
});

export const textField = (key: string, label: string, required = true): FceField => ({
  key,
  label,
  required,
});

export const countField = (key: string, label: string, required = true): FceField => ({
  key,
  label,
  type: 'integer',
  required,
});

export const choice = (
  key: string,
  label: string,
  options: string[],
  type: 'radio' | 'select' | 'checks' = 'radio',
  required = true
): FceField => ({
  key,
  label,
  options,
  type,
  required,
});

export const pending = (key: string, label: string, hint: string): FceField => ({
  key,
  label,
  type: 'pending',
  hint,
});

export const computedField = (
  key: string,
  label: string,
  compute: (data: FceData, phase?: FcePhase) => string,
  unit = '',
  hint?: string
): FceField => ({
  key,
  label,
  type: 'computed',
  unit,
  compute,
  hint,
});

/**
 * Sem catálogo normativo CEPRAM II.3 / ONU verificável no repositório; mantido vazio
 * para evitar dados químicos presumidos (#223, #224).
 */
export const SUBSTANCIAS_ONU_MAP: Record<string, string> = {};

const UNIDADES_SELECAO = ['ton', 'kg', 'm³', 'L', 'un', 'Outra (digitar na unidade livre)'];

const TRATAMENTO_EFLUENTES_OPCOES = [
  'ETE própria (físico-química e biológica)',
  'Fossa séptica',
  'Caixa separadora',
  'CETREL',
  'Sem tratamento',
];

const CONTROLE_EMISSOES_OPCOES = [
  'Queimador de baixo NOx',
  'Filtro de mangas',
  'Lista parametrizada SEIA (pendente)',
  'Outros',
];

const CLASSES_ABNT_2024 = [
  'Classe I (perigoso)',
  'Classe II (não perigoso)',
  'Classe II A (não inerte)',
  'Classe II B (inerte)',
];

const CONTATOS_EMERGENCIA_COLUNAS: FceField[] = [
  choice('tipoContato', 'Tipo de contato', ['Próprio', 'Terceiro'], 'select'),
  textField('documento', 'CPF (Próprio) / CNPJ (Terceiro)'),
  textField('nomeRazao', 'Nome (Próprio) / Razão Social (Terceiro)'),
  textField('cargoFuncaoRt', 'Cargo ou função (Próprio) / Nome do RT (Terceiro)'),
  textField('telefone', 'Telefone'),
  textField('email', 'E-mail'),
];

const SUBSTANCIA_RISCO_COLUNAS: FceField[] = [
  {
    ...choice('substancia', 'Substância', ['Inserir substância não listada'], 'select'),
    comments: [223],
    hint: 'Catálogo CEPRAM II.3 pendente de integração; selecione entrada manual (#223).',
  },
  textField('nomeSubstanciaManual', 'Nome da substância'),
  {
    ...textField('codigoOnu', 'ONU / FISPQ'),
    comments: [224],
    hint: 'Informar código ONU/FISPQ manualmente enquanto a consulta oficial estiver pendente (#224).',
  },
  textField('estadoFisico', 'Estado', false),
  numberField('mmla', 'MMLA', 't', false),
  numberField('mr', 'MR', 't', false),
  numberField('fp', 'FP', '', false),
];

const ENERGY_DEMAND_FIELDS: Array<{ source: string; key: string; label: string; unit: string }> = [
  { source: 'Rede concessionária', key: 'demandaEnergiaRede', label: 'Demanda prevista — Rede concessionária', unit: 'kWh/mês' },
  { source: 'Gás natural', key: 'demandaEnergiaGas', label: 'Demanda prevista — Gás natural', unit: 'm³/mês' },
  { source: 'GLP', key: 'demandaEnergiaGlp', label: 'Demanda prevista — GLP', unit: 'kg/mês' },
  { source: 'Biomassa ou lenha', key: 'demandaEnergiaBiomassa', label: 'Demanda prevista — Biomassa ou lenha', unit: 't/mês' },
  { source: 'Solar', key: 'demandaEnergiaSolar', label: 'Demanda prevista — Solar', unit: 'kWh/mês' },
  { source: 'Outra', key: 'demandaEnergiaOutra', label: 'Demanda prevista — Outra fonte', unit: 'unidade declarada' },
];

const formatBrNumber = (n: number, maxDigits = 4) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: maxDigits }).format(n);

// 1. FCE DE INDÚSTRIA — COIND (Frames #27-#64, #223-#231, #283)
export const industria: CoindDefinition = {
  kind: 'industria',
  title: 'FCE de Indústria e Serviços',
  route: 'coind-industria',
  defaultPhase: 'LI',
  availablePhases: ['LP', 'LI', 'LU', 'LA', 'LO', 'Renovacao'],
  steps: [
    {
      title: 'Processo e insumos',
      sections: [
        {
          title: 'Processo produtivo',
          source: '47:1816',
          comments: [27, 33, 34, 35],
          note: 'LP (#35) e LU (#33) mantêm os mesmos campos da LI. Na RLO/LO (#27, #34), os dados da fase anterior são exibidos apenas para revisão conforme integração.',
          fields: [
            {
              ...textField('descricaoEtapas', 'Descrição das etapas do processo'),
              type: 'textarea',
              comments: [27, 33, 34, 35],
            },
            {
              ...textField('historicoExpansoes', 'Histórico de expansões do período'),
              type: 'textarea',
              when: { phase: 'Renovacao' },
              comments: [27],
              hint: 'Na RLO, o histórico pode chegar automaticamente do processo anterior em modo de visualização quando integrado (#27).',
            },
          ],
          documents: ['Fluxograma projetado / atualizado — ATEND (#33, #34, #35)'],
        },
        {
          title: 'Matérias-primas',
          source: '47:1816',
          comments: [28, 29, 30],
          note: 'Divisão em tabela própria para matérias-primas (#29). MSG-23: caso a unidade do Decreto 14.024/12 não atenda, informe livremente em Unidade livre.',
          fields: [
            {
              key: 'tabelaMateriasPrimas',
              label: 'Matérias-primas',
              type: 'table',
              required: false,
              comments: [28, 29, 30],
              columns: [
                textField('materiaPrima', 'Matéria-prima'),
                numberField('consumoMensal', 'Consumo estimado/mês'),
                choice('unidadeMedida', 'Unidade de medida', UNIDADES_SELECAO, 'select'),
                textField('unidadeLivre', 'Unidade livre (MSG-23)', false),
                textField('formaArmazenamento', 'Forma de armazenamento', false),
              ],
            },
          ],
        },
        {
          title: 'Insumos',
          source: '47:1816',
          comments: [28, 29, 30],
          note: 'Tabela segregada para insumos (#29). Forma de armazenamento é opcional (#30).',
          fields: [
            {
              key: 'tabelaInsumos',
              label: 'Insumos e reagentes',
              type: 'table',
              required: false,
              comments: [28, 29, 30],
              columns: [
                textField('insumo', 'Insumo ou reagente'),
                numberField('consumoMensal', 'Consumo estimado/mês'),
                choice('unidadeMedida', 'Unidade de medida', UNIDADES_SELECAO, 'select'),
                textField('unidadeLivre', 'Unidade livre (MSG-23)', false),
                textField('formaArmazenamento', 'Forma de armazenamento', false),
              ],
            },
          ],
        },
        {
          title: 'Produtos finais e subprodutos',
          source: '47:1816',
          comments: [30, 31, 32],
          fields: [
            {
              key: 'tabelaProdutos',
              label: 'Produtos',
              type: 'table',
              required: false,
              comments: [30, 31, 32],
              columns: [
                textField('produto', 'Produto'),
                numberField('quantidade', 'Quantidade'),
                choice('unidadeMedida', 'Unidade de medida', UNIDADES_SELECAO, 'select'),
                textField('unidadeLivre', 'Unidade livre', false),
                textField('armazenamentoFinal', 'Onde o produto ficará armazenado até a destinação final?', false),
              ],
            },
            {
              key: 'tabelaSubprodutos',
              label: 'Subprodutos',
              type: 'table',
              required: false,
              columns: [
                textField('subproduto', 'Subproduto'),
                numberField('quantidade', 'Quantidade'),
                choice('unidadeMedida', 'Unidade de medida', UNIDADES_SELECAO, 'select'),
                textField('armazenamentoTemporario', 'Armazenamento temporário', false),
              ],
            },
            numberField('capacidadeNominal', 'Capacidade nominal projetada', 'ton/mês'),
            {
              ...numberField('producaoMediaPeriodo', 'Produção média do período', 'ton/mês'),
              when: { phase: ['LO', 'Renovacao'] },
            },
            {
              ...textField('subprodutosPrevistos', 'Subprodutos previstos / balanço de massa e destinação', false),
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      title: 'Água, energia e outorga',
      sections: [
        {
          title: 'Abastecimento de água',
          source: '47:1844',
          comments: [36, 42],
          fields: [
            {
              ...choice(
                'fonteAgua',
                'Fonte de abastecimento',
                ['Captação Subterrânea (Poço)', 'Captação superficial (rio)', 'Rede pública ou concessionária', 'Outro'],
                'radio'
              ),
              comments: [36, 42],
            },
            numberField('demandaAgua', 'Demanda prevista', 'm³/dia'),
          ],
        },
        {
          title: 'Outorga de direito de uso',
          source: '47:1844',
          comments: [37, 38, 41],
          when: { key: 'fonteAgua', notValue: 'Rede pública ou concessionária' },
          note: 'Oculta quando a fonte for Rede pública ou concessionária (#38). Caso o número de portaria inserido não seja reconhecido automaticamente, anexar PDF da portaria.',
          fields: [
            {
              ...textField('portariaOutorga', 'Nº do requerimento/processo ou PORTARIA da outorga'),
              comments: [37, 38],
              hint: 'Caso o sistema não reconheça automaticamente a portaria informada, anexar o PDF da portaria na aba Documentos Obrigatórios (#38).',
            },
          ],
          documents: [
            'PDF da portaria de outorga (quando não reconhecida automaticamente) — ATEND (#38)',
            'Comprovante de cumprimento da outorga (aplicável na RLO) — ATEND (#41)',
          ],
        },
        {
          title: 'Consumo energético',
          source: '47:1844',
          comments: [39, 40],
          fields: [
            {
              ...choice(
                'fontesEnergia',
                'Fontes energéticas',
                ['Rede concessionária', 'Gás natural', 'GLP', 'Biomassa ou lenha', 'Solar', 'Outra'],
                'checks'
              ),
              comments: [39, 40],
            },
            ...ENERGY_DEMAND_FIELDS.map(entry => ({
              ...numberField(entry.key, entry.label, entry.unit),
              when: { key: 'fontesEnergia', value: entry.source },
              comments: [40],
            })),
            computedField(
              'demandaEnergiaTotal',
              'Demanda total prevista (automático)',
              data => {
                const selected = Array.isArray(data.fontesEnergia) ? (data.fontesEnergia as string[]) : [];
                if (!selected.length) return 'Selecione uma ou mais fontes energéticas';
                let total = 0;
                let filledCount = 0;
                for (const entry of ENERGY_DEMAND_FIELDS) {
                  if (!selected.includes(entry.source)) continue;
                  const n = parseNumber(String(data[entry.key] || ''));
                  if (n !== undefined) {
                    total += n;
                    filledCount += 1;
                  }
                }
                return filledCount ? `${formatBrNumber(total)} (soma das ${filledCount} fonte(s) informada(s))` : 'Aguardando preenchimento das demandas';
              },
              '',
              'Calculado automaticamente a partir da demanda de cada fonte energética selecionada (#40).'
            ),
          ],
        },
      ],
    },
    {
      title: 'Efluentes e emissões',
      sections: [
        {
          title: 'Efluentes líquidos',
          source: '47:1862',
          comments: [43, 44, 45, 49, 50],
          note: 'O laudo de monitoramento de efluentes foi removido deste formulário e permanece na aba Documentos Obrigatórios (ATEND) (#45, #49).',
          fields: [
            numberField('vazaoEfluentes', 'Vazão prevista', 'm³/dia'),
            {
              ...choice('sistemaTratamento', 'Projeto do sistema de tratamento', TRATAMENTO_EFLUENTES_OPCOES, 'select'),
              comments: [43, 44],
              hint: 'As opções parametrizáveis completas vêm do banco do SEIA (#43).',
            },
            {
              ...pending(
                'corpoHidrico',
                'Corpo Hídrico',
                'Cadastro GEOBahia / AID não conectado nesta demonstração. Campo oculto para Fossa séptica, Caixa separadora, Sem tratamento e CETREL (#44).'
              ),
              when: {
                key: 'sistemaTratamento',
                notIn: ['Fossa séptica', 'Caixa separadora', 'Sem tratamento', 'CETREL'],
              },
              comments: [44],
            },
          ],
          documents: ['Laudo de monitoramento de efluentes (múltiplos arquivos permitidos na RLO) — ATEND (#45, #49, #50)'],
        },
        {
          title: 'Emissões atmosféricas',
          source: '47:1865',
          comments: [46, 47, 50],
          note: 'Avaliação isocinética e opacidade removida conforme #46. MSG-21: vazão opcional na LP/LI/LU e obrigatória na LO e RLO.',
          fields: [
            {
              key: 'tabelaEmissoes',
              label: 'Chaminés e fontes de emissão',
              type: 'table',
              required: false,
              comments: [47],
              columns: [
                textField('chamineFonte', 'Chaminé ou fonte'),
                textField('poluentes', 'Poluentes'),
                {
                  ...numberField('vazaoGasosa', 'Vazão', 'Nm³/h', false),
                  required: (_d, p) => p === 'LO' || p === 'Renovacao',
                },
                {
                  ...choice('sistemaControle', 'Sistema de controle', CONTROLE_EMISSOES_OPCOES, 'select'),
                  comments: [47],
                },
                textField('outroSistemaControle', 'Descrição (se Outros)', false),
              ],
            },
          ],
          documents: ['Histórico de documentos de emissões (múltiplos arquivos na RLO) — ATEND (#50)'],
        },
        {
          title: 'Ruídos e vibrações',
          source: '47:1865',
          comments: [48, 50],
          fields: [
            {
              ...textField('fontesRuidos', 'Fontes geradoras, atenuação projetada e controle', true),
              type: 'textarea',
              required: (_d, p) => p !== 'Renovacao',
              comments: [48],
            },
          ],
          documents: ['Histórico de laudos de ruído (NBR 10.151 — múltiplos arquivos permitidos na RLO) — ATEND (#50)'],
        },
      ],
    },
    {
      title: 'Resíduos e contaminação',
      sections: [
        {
          title: 'Resíduos sólidos (ABNT/NBR 10004:2024)',
          source: '47:1880',
          comments: [51, 52, 53],
          note: 'PGRS movido para Documentos Obrigatórios (#51). Classificação ABNT/NBR 10004:2024 (#53). MSG-22: SINIR/MTR não obrigatórios na LI e LO.',
          fields: [
            {
              key: 'tabelaResiduos',
              label: 'Resíduos sólidos',
              type: 'table',
              required: false,
              comments: [53],
              columns: [
                choice('classeAbnt', 'Classe ABNT/NBR 10004:2024', CLASSES_ABNT_2024, 'select'),
                textField('tipoResiduo', 'Tipo de resíduo'),
                numberField('quantidade', 'Quantidade', 'ton/mês'),
                textField('acondicionamento', 'Acondicionamento'),
                textField('destinacaoFinal', 'Destinação final'),
              ],
            },
            {
              key: 'tabelaResiduosConstrucaoCivil',
              label: 'Resíduos da Construção Civil',
              type: 'table',
              required: false,
              comments: [52],
              columns: [
                textField('tipoResiduoRcc', 'Tipo / Classificação do resíduo (RCC)'),
                numberField('quantidade', 'Quantidade'),
                choice('unidadeMedida', 'Unidade', ['ton', 'm³', 'kg'], 'select'),
                textField('destinacaoFinal', 'Acondicionamento e destinação final'),
              ],
            },
          ],
          documents: ['Plano de Gerenciamento de Resíduos Sólidos (PGRS) — ATEND (#51)'],
        },
        {
          title: 'Transporte de resíduos',
          source: '47:1889',
          comments: [54, 57, 62, 63, 64],
          whenPhase: ['LO', 'Renovacao'],
          note: 'Seção removida na LI (#54). Na LO (#57, #63), o preenchimento e anexo são opcionais, sendo obrigatório anexar caso haja licença anterior.',
          fields: [
            {
              ...textField('transporteResiduos', 'Transportadores identificados / Manifestos do período', false),
              type: 'textarea',
              required: (_d, p) => p === 'Renovacao',
              comments: [57, 62],
            },
          ],
          documents: ['Licenças ambientais das transportadoras (somente PDF; obrigatório na RLO e quando houver licença anterior na LO) — ATEND (#57, #63, #64)'],
        },
        {
          title: 'Informações sobre Áreas Contaminadas',
          source: '47:1889',
          comments: [55, 56, 58, 59, 60, 64],
          whenPhase: ['LP', 'LI', 'LU', 'LA', 'LO'],
          note: 'Na LI (#56), o campo de Medidas de Prevenção (#55) foi removido. Na LO (#58, #60), o preenchimento e o laudo são opcionais caso não exista licença anterior.',
          fields: [
            {
              ...textField('medidasContencaoMitigacao', 'Medidas de contenção e mitigação', false),
              type: 'textarea',
              when: { notPhase: 'LI' },
              comments: [55, 56, 59, 60],
              hint: 'Deixado não obrigatório na LO; anexar laudo caso possua licença anterior (#58, #60).',
            },
          ],
          documents: ['Laudo de integridade das estruturas e bacias de contenção (somente PDF; opcional na LO se sem licença anterior) — ATEND (#58, #64)'],
        },
        {
          title: 'Manutenção e Integridade do Solo',
          source: '47:1895',
          comments: [61, 62, 64],
          whenPhase: ['Renovacao'],
          fields: [
            {
              ...textField('manutencaoContencoes', 'Manutenção das contenções e investigações do período'),
              type: 'textarea',
              comments: [61],
            },
          ],
          documents: ['Laudo de integridade das estruturas e bacias de contenção (somente PDF) — ATEND (#64)'],
        },
      ],
    },
    {
      title: 'Riscos e PGR',
      whenPhase: ['LI', 'LU', 'LA', 'LO', 'Renovacao'],
      sections: [
        {
          title: 'Triagem e Índice de Risco (CEPRAM II.3)',
          source: '107:1901',
          comments: [223, 224, 226, 229],
          note: 'Esta aba não é exibida na LP (#229). Tabelas segregadas (#226) para entrada manual (#223/#224) enquanto o catálogo normativo oficial CEPRAM II.3 / ONU não é integrado.',
          fields: [
            {
              key: 'tabelaSubstanciasExplosivas',
              label: 'Substâncias explosivas',
              type: 'table',
              required: false,
              comments: [223, 224, 226],
              columns: SUBSTANCIA_RISCO_COLUNAS,
            },
            {
              key: 'tabelaSubstanciasToxicas',
              label: 'Substâncias tóxicas',
              type: 'table',
              required: false,
              comments: [223, 224, 226],
              columns: SUBSTANCIA_RISCO_COLUNAS,
            },
            {
              key: 'tabelaSubstanciasInflamaveis',
              label: 'Substâncias inflamáveis (CEPRAM II.3)',
              type: 'table',
              required: false,
              comments: [223, 224, 226],
              columns: SUBSTANCIA_RISCO_COLUNAS,
            },
          ],
        },
        {
          title: 'Gerenciamento de risco (NT-01/2017)',
          source: '47:1901',
          comments: [225, 227, 230, 231],
          fields: [],
          documents: [
            'LI: Análise preliminar de perigos e diretrizes do PGR — ATEND (#230)',
            'LO: PGR implementado, Autoavaliação do PGR com plano de ação e PAE — ATEND (#225, #227)',
            'RLO: PGR atualizado, Autoavaliação, Relatório e Cronograma de reanálise de risco — ATEND (#231)',
          ],
          note: 'Todos os documentos de gerenciamento de risco são solicitados em Documentos Obrigatórios (ATEND), exigindo assinatura digital do Coordenador da CTGA (CTGA-01).',
        },
        {
          title: 'Contatos de Emergência',
          source: '63:3501',
          comments: [228, 229],
          whenPhase: ['LI', 'LU', 'LA', 'LO', 'Renovacao'],
          note: 'Adicione um ou mais contatos Próprios (CPF, nome, cargo/função, telefone, e-mail) ou Terceiros (CNPJ, razão social, RT, telefone, e-mail) (#228). Exibido em LI, LU, LA, LO e renovações; oculto na LP (#229).',
          fields: [
            {
              key: 'contatosEmergencia',
              label: 'Contatos de emergência cadastrados',
              type: 'table',
              required: true,
              comments: [228, 229],
              columns: CONTATOS_EMERGENCIA_COLUNAS,
            },
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

// 2. FCE DE DESMANTELAMENTO / AUTORIZAÇÃO AMBIENTAL — COIND (#232-#239, #283)
export const desmantelamento: CoindDefinition = {
  kind: 'desmantelamento',
  title: 'FCE de Desmantelamento / Autorização Ambiental (AA)',
  route: 'coind-desmantelamento',
  defaultPhase: 'AA',
  availablePhases: ['AA'],
  steps: [
    {
      title: 'Autorização Ambiental e processo',
      sections: [
        {
          title: 'Identificação da Autorização Ambiental (AA)',
          source: '111:1931',
          comments: [234, 235, 238],
          fields: [
            {
              ...choice(
                'motivoAa',
                'Motivo da Autorização Ambiental',
                [
                  'Teste Industrial',
                  'Teste para Incorporação',
                  'Teste para Queima',
                  'Desativação Parcial',
                  'Desativação Total',
                  'Intervenção de Área Contaminada',
                  'Remediação de Área Contaminada',
                ],
                'select'
              ),
              comments: [235],
              hint: 'Na operação real, vem pré-preenchido conforme o enquadramento especificado pela ATEND; lista parametrizada (#235).',
            },
            {
              ...textField('descricaoObjetoAa', 'Descreva detalhadamente o objeto da autorização ambiental'),
              type: 'textarea',
              comments: [235],
            },
            {
              ...textField('caracterizacaoSubstancias', 'Caracterização de substâncias, metodologias e destinação'),
              type: 'textarea',
              comments: [238],
            },
          ],
        },
        {
          title: 'Processo produtivo',
          source: '111:1914',
          comments: [232, 233, 236, 237],
          fields: [
            {
              ...textField('descricaoEtapas', 'Descrição resumida das etapas'),
              type: 'textarea',
              comments: [232, 237],
            },
          ],
          documents: ['Fluxograma produtivo (PDF) — obrigatório em todas as fases — ATEND (#233, #236)'],
        },
        {
          title: 'Matérias-primas e reagentes',
          source: '111:1914',
          note: 'MSG-23: se a unidade do Decreto 14.024/12 não servir para o insumo, digite livremente em Unidade de medida.',
          fields: [
            {
              key: 'tabelaMateriasPrimas',
              label: 'Matérias-primas e reagentes',
              type: 'table',
              required: false,
              columns: [
                textField('materiaPrima', 'Matéria-prima'),
                numberField('consumoMensal', 'Consumo/mês'),
                textField('unidadeMedida', 'Unidade de medida'),
                textField('formaArmazenamento', 'Forma de armazenamento', false),
              ],
            },
          ],
        },
        {
          title: 'Produtos e subprodutos',
          source: '111:1914',
          fields: [
            {
              key: 'tabelaProdutos',
              label: 'Produtos e subprodutos',
              type: 'table',
              required: false,
              columns: [
                textField('produto', 'Produto ou subproduto'),
                numberField('capacidadeInstalada', 'Capacidade instalada', 'ton/mês'),
                choice('estadoFisico', 'Estado físico', ['Sólido', 'Líquido', 'Gasoso'], 'select'),
                textField('embalagem', 'Embalagem', false),
                textField('destinacao', 'Destinação'),
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Água e energia',
      sections: [
        {
          title: 'Consumo energético',
          source: '63:3501',
          comments: [40],
          fields: [
            choice('fontesEnergia', 'Fontes de energia (renováveis e não renováveis)', ['Rede concessionária', 'Gás natural', 'Biomassa ou lenha', 'Solar', 'Outra'], 'checks'),
            numberField('consumoEletricoMedio', 'Consumo elétrico médio', 'kWh/mês'),
            numberField('potenciaInstalada', 'Potência instalada', 'kW'),
          ],
        },
        {
          title: 'Abastecimento de água e outorga',
          source: '63:3501',
          fields: [
            choice('origemAgua', 'Origem da água', ['Poço tubular', 'Captação superficial', 'Rede pública ou concessionária'], 'radio'),
            numberField('vazaoConsumida', 'Vazão consumida', 'm³/dia'),
            choice('possuiOutorga', 'Possui outorga do INEMA?', yesNo, 'radio'),
            {
              ...textField('portariaOutorga', 'Nº da portaria de outorga'),
              when: { key: 'possuiOutorga', value: 'Sim' },
            },
          ],
        },
      ],
    },
    {
      title: 'Efluentes e emissões',
      sections: [
        {
          title: 'Efluentes líquidos',
          source: '63:3501',
          fields: [
            numberField('vazaoEfluenteIndustrial', 'Vazão de efluente industrial', 'm³/dia'),
            numberField('vazaoEfluenteSanitario', 'Vazão de efluente sanitário', 'm³/dia'),
            choice('tipoTratamento', 'Tipo de tratamento', TRATAMENTO_EFLUENTES_OPCOES, 'select'),
            pending('corpoHidricoReceptor', 'Corpo hídrico receptor', 'Cadastro GEOBahia / AID não conectado nesta demonstração.'),
          ],
        },
        {
          title: 'Emissões atmosféricas e ruídos',
          source: '63:3501',
          fields: [
            {
              key: 'tabelaEmissoes',
              label: 'Emissões atmosféricas',
              type: 'table',
              required: false,
              columns: [
                textField('fonteEmissao', 'Fonte de emissão'),
                textField('poluentes', 'Poluentes (MP, SOx, NOx, CO, COV)'),
                numberField('vazaoGasosa', 'Vazão do efluente gasoso', 'Nm³/h', false),
                textField('sistemaControle', 'Sistema de controle ambiental'),
              ],
            },
            {
              ...textField('ruidosControle', 'Ruídos: fontes geradoras e controle', false),
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      title: 'Resíduos e documentação AA',
      sections: [
        {
          title: 'Resíduos sólidos (ABNT NBR 10004:2024)',
          source: '111:1929',
          note: 'MSG-22: o cadastro no SINIR e o MTR não são obrigatórios para envio na LI e na LO.',
          fields: [
            {
              key: 'tabelaResiduosDesmantelamento',
              label: 'Resíduos sólidos',
              type: 'table',
              required: false,
              columns: [
                choice('classeAbnt', 'Classe ABNT', CLASSES_ABNT_2024, 'select'),
                textField('tipoResiduo', 'Tipo de resíduo'),
                numberField('quantidade', 'Quantidade', 'ton/mês'),
                textField('acondicionamento', 'Acondicionamento'),
                textField('destinacaoFinal', 'Destinação final'),
              ],
            },
          ],
        },
        {
          title: 'Documentos específicos da Autorização Ambiental',
          source: '111:1929',
          comments: [239],
          fields: [],
          note: 'A seção fixa "Desativação e demolição (IN INEMA 002/2021)" foi removida conforme #239: somente documentos específicos ao Motivo da AA selecionado são requeridos na aba Documentos Obrigatórios (ATEND).',
          documents: ['Documentos específicos conforme Motivo da AA enquadrado pela ATEND (#239)'],
        },
      ],
    },
    {
      title: 'Revisão e conclusão',
      sections: [],
    },
  ],
};

// 3. FCE DE DUTOVIA — COIND (#240, #241, #249-#256, #259-#276, #283)
export const dutovia: CoindDefinition = {
  kind: 'dutovia',
  title: 'FCE de Dutovia',
  route: 'coind-dutovia',
  defaultPhase: 'LP',
  availablePhases: ['LP', 'LI', 'LU', 'LA', 'LO', 'Renovacao'],
  steps: [
    {
      title: 'Engenharia e traçado',
      sections: [
        {
          title: 'Traçado e geoprocessamento',
          source: '113:1934',
          comments: [256],
          fields: [
            pending('eixoDutovia', 'Eixo da dutovia (SIRGAS 2000)', 'Upload vetorial e validação espacial (RN-G-04 / RN-G-05) dependem do serviço geoespacial.'),
            computedField(
              'extensaoInformada',
              'Extensão informada',
              (data, phase) => {
                const base = parseNumber(String(data.extensaoDuto || '')) || 0;
                const amp = phase === 'LA' ? parseNumber(String(data.extensaoAmpliacao || '')) || 0 : 0;
                const total = base + amp;
                return total > 0 ? `${formatBrNumber(total)} km` : 'Não calculado';
              },
              'km',
              'Rótulo atualizado para "Extensão informada" (#256).'
            ),
            numberField('trechosAereos', 'Trechos aéreos', 'km', false),
            numberField('trechosEnterrados', 'Trechos enterrados', 'km', false),
            countField('valvulasBloqueio', 'Válvulas de bloqueio', false),
            countField('estacoesPig', 'Estações de lançamento e recebimento de PIG', false),
          ],
        },
        {
          title: 'Faixa de servidão',
          source: '113:1937',
          comments: [251, 252, 253, 254, 255],
          fields: [
            {
              ...numberField('extensaoDuto', 'Extensão do duto', 'km', true),
              comments: [251],
            },
            {
              ...numberField('extensaoAmpliacao', 'Extensão de ampliação', 'km', false),
              when: { phase: 'LA' },
              comments: [252],
              hint: 'Campo exibido somente na Licença de Alteração (LA) (#252).',
            },
            {
              ...numberField('larguraFaixaServidao', 'Largura da faixa de servidão', 'm', true),
              comments: [253],
            },
            computedField(
              'extensaoTotalFaixa',
              'Extensão total da faixa de servidão',
              (data, phase) => {
                const base = parseNumber(String(data.extensaoDuto || ''));
                if (base === undefined) return 'Não calculado';
                const amp = phase === 'LA' ? parseNumber(String(data.extensaoAmpliacao || '')) || 0 : 0;
                return `${formatBrNumber(base + amp)} km`;
              },
              'km',
              'Nomenclatura atualizada para incluir "de servidão" (#255).'
            ),
            computedField(
              'areaTotalFaixa',
              'Área total da faixa de servidão',
              (data, phase) => {
                const base = parseNumber(String(data.extensaoDuto || ''));
                const larg = parseNumber(String(data.larguraFaixaServidao || ''));
                if (base === undefined || larg === undefined) return 'Não calculado';
                const amp = phase === 'LA' ? parseNumber(String(data.extensaoAmpliacao || '')) || 0 : 0;
                return `${formatBrNumber(((base + amp) * larg) / 10)} ha`;
              },
              'ha'
            ),
            {
              ...choice('faixaCompartilhada', 'A faixa de servidão é compartilhada com outras dutovias?', yesNo, 'radio'),
              comments: [254],
            },
            {
              key: 'tabelaFaixaCompartilhada',
              label: 'Dutovias compartilhadas',
              type: 'table',
              when: { key: 'faixaCompartilhada', value: 'Sim' },
              required: true,
              columns: [
                textField('empresaProprietaria', 'Empresa proprietária'),
                textField('produtoTransportado', 'Produto transportado'),
                textField('trechoComum', 'Trecho comum'),
              ],
            },
          ],
        },
        {
          title: 'Cruzamentos e interseções',
          source: '113:1940',
          comments: [240],
          fields: [
            {
              key: 'tabelaCruzamentos',
              label: 'Cruzamentos e interseções',
              type: 'table',
              required: false,
              comments: [240],
              columns: [
                {
                  ...choice(
                    'tipoCruzamento',
                    'Tipo',
                    ['Rio', 'Rodovia', 'Ferrovia', 'Pontilhão', 'Comunidade', 'Linha de Transmissão', 'Pistas', 'APP', 'Outros'],
                    'select'
                  ),
                  comments: [240],
                },
                textField('descricaoCruzamento', 'Descrição'),
                textField('localizacaoKm', 'Localização (km)'),
              ],
            },
          ],
        },
        {
          title: 'Parâmetros operacionais',
          source: '113:1943',
          comments: [241, 259, 260],
          note: 'Todos os campos de parâmetros operacionais são opcionais (#241).',
          fields: [
            numberField('capacidadeTransporteAnual', 'Capacidade de transporte anual', 'm³/ano', false),
            {
              ...numberField('vazaoProjeto', 'Vazão do projeto', 'Nm³/h', false),
              comments: [260],
            },
            numberField('diametroNominalDuto', 'Diâmetro nominal', 'pol', false),
            numberField('espessuraParede', 'Espessura da parede', 'mm', false),
            textField('materialDuto', 'Material', false),
            {
              ...numberField('pressaoNominalProjeto', 'Pressão nominal do Projeto', 'bar', false),
              comments: [259],
            },
            numberField('temperaturaOperacao', 'Temperatura de operação', '°C', false),
            textField('protecaoCatodica', 'Proteção catódica', false),
          ],
          documents: ['FISPQ das substâncias transportadas — ATEND'],
        },
      ],
    },
    {
      title: 'Água e efluentes',
      whenPhase: ['LI'],
      sections: [
        {
          title: 'Água para manutenção, inspeção e teste hidrostático',
          source: '157:982',
          comments: [261, 262],
          note: 'Aba exibida somente na Licença de Instalação (LI) (#262).',
          fields: [
            {
              ...choice('fonteAgua', 'Fonte de abastecimento', ['Subterrâneo', 'Superficial', 'Caminhão-Pipa', 'Concessionária'], 'select'),
              comments: [261],
            },
            numberField('volumeEstimadoAgua', 'Volume estimado', 'm³/evento'),
          ],
        },
        {
          title: 'Efluentes de inspeções, purgas e emergências',
          source: '157:985',
          comments: [263],
          fields: [
            {
              ...textField('correntesGeradas', 'Correntes geradas (qualitativa e quantitativa)'),
              type: 'textarea',
            },
            choice(
              'sistemaTratamento',
              'Sistema de tratamento',
              [
                'ETE própria (físico-química e biológica)',
                'Fossa séptica e filtro anaeróbio',
                'Caixa separadora água e óleo (SAO)',
                'Neutralização e precipitação',
                'CETREL ou rede coletora de terceiros',
                'Sem tratamento',
                'Outro',
              ],
              'select'
            ),
            {
              ...choice(
                'corpoReceptorDescarte',
                'Corpo receptor do descarte',
                ['Corpo hídrico (seleção GEOBahia pendente)', 'Não se aplica'],
                'select'
              ),
              comments: [263],
              hint: 'Opção "Não se aplica" inserida para casos sem descarte (#263). O cadastro completo de corpos hídricos depende do GEOBahia.',
            },
          ],
        },
      ],
    },
    {
      title: 'Emissões e resíduos',
      sections: [
        {
          title: 'Emissões atmosféricas',
          source: '157:988',
          comments: [264],
          fields: [
            {
              ...textField('estimativaEmissoes', 'Estimativa de emissões em operações e despressurizações'),
              type: 'textarea',
              hint: 'Inclua emissões pontuais, fugitivas e purgas de manutenção.',
            },
            textField('sistemasControleQueimadores', 'Sistemas de controle ou queimadores'),
            {
              ...numberField('vazaoEmissoesPurgadores', 'Vazão das emissões em purgadores', 'Nm³/h', false),
              required: (_d, p) => p === 'LU' || p === 'LO' || p === 'Renovacao',
              comments: [264],
              hint: 'Obrigatória na LU, LO e RLO (#264 / MSG-21); opcional nas fases LP e LI.',
            },
          ],
        },
        {
          title: 'Resíduos sólidos',
          source: '157:991',
          comments: [265, 266],
          note: 'Resíduos de manutenção, pigging e eventos emergenciais. Classificação ABNT NBR 10004:2024 (#265). Não obrigatórios somente na LP e LI (#266).',
          fields: [
            {
              key: 'tabelaResiduosDutovia',
              label: 'Resíduos sólidos (ABNT NBR 10004:2024)',
              type: 'table',
              required: (_d, p) => p !== 'LP' && p !== 'LI',
              comments: [265, 266],
              columns: [
                choice('classeAbnt', 'Classe ABNT 10004:2024', CLASSES_ABNT_2024, 'select'),
                textField('tipoResiduo', 'Tipo de resíduo'),
                numberField('quantidade', 'Quantidade', 'ton/ano'),
                textField('acondicionamento', 'Acondicionamento'),
                textField('destinacaoFinal', 'Destinação final'),
              ],
            },
            {
              ...textField('locaisArmazenamento', 'Locais de armazenamento temporário'),
              type: 'textarea',
            },
            {
              ...textField('logisticaTransporte', 'Logística de transporte dos resíduos'),
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      title: 'Riscos e PGR',
      sections: [
        {
          title: 'Proteção emergencial e histórico',
          source: '157:1000',
          comments: [249, 250],
          fields: [
            {
              ...textField('travamentoDeteccaoVazamentos', 'Sistema de travamento automático de válvulas e detecção de vazamentos'),
              type: 'textarea',
            },
            {
              ...choice('eventosEmergenciaisOpcao', 'Eventos emergenciais no período da última RLO', ['Informar ocorrências', 'Não se aplica'], 'radio'),
              when: { phase: 'Renovacao' },
              comments: [249],
            },
            {
              ...textField('eventosEmergenciaisDescricao', 'Descrição dos eventos emergenciais no período'),
              type: 'textarea',
              when: [{ phase: 'Renovacao' }, { key: 'eventosEmergenciaisOpcao', value: 'Informar ocorrências' }],
              comments: [249],
            },
          ],
          documents: ['RLO: Relatórios de emergência — ATEND (#250)'],
        },
        {
          title: 'PGR e reanálise de riscos (CEPRAM 4578/2017 - NT-01/2017)',
          source: '157:997',
          comments: [267, 268, 269, 270, 271, 272],
          fields: [],
          documents: [
            'PGR conforme CEPRAM 4578/2017 - NT-01/2017 (obrigatório em todas as fases exceto LP) — ATEND (#267)',
            'Cronograma de reanálise de risco — 5 anos (opcional) — ATEND (#268, #269, #272)',
            'Última reanálise de riscos (opcional) — ATEND (#270)',
            'Autoavaliação do PGR com plano de ação (opcional) — ATEND (#271)',
          ],
          note: 'O PGR, as reanálises e os planos exigem a assinatura digital do Coordenador da CTGA (CTGA-01).',
        },
        {
          title: 'Contatos de Emergência (LO e renovações)',
          source: '157:997',
          comments: [273],
          whenPhase: ['LO', 'Renovacao'],
          note: 'Adicione um ou mais contatos Próprios ou Terceiros (#273).',
          fields: [
            {
              key: 'contatosEmergencia',
              label: 'Contatos de emergência cadastrados',
              type: 'table',
              required: true,
              comments: [273],
              columns: CONTATOS_EMERGENCIA_COLUNAS,
            },
          ],
        },
      ],
    },
    {
      title: 'Comunidades e educação ambiental',
      sections: [
        {
          title: 'Comunidades em áreas vulneráveis',
          source: '170:989',
          comments: [274],
          fields: [
            {
              key: 'tabelaComunidades',
              label: 'Comunidades no entorno da faixa de servidão',
              type: 'table',
              required: false,
              comments: [274],
              columns: [
                choice('tipoComunidade', 'Tipo', ['Comunidade', 'Terra indígena', 'Quilombola', 'Povos e Comunidades Tradicionais'], 'select'),
                textField('nomeComunidade', 'Nome'),
                numberField('distanciaFaixa', 'Distância da faixa', 'm'),
              ],
            },
          ],
        },
        {
          title: 'Medidas, comunicação e planos',
          source: '157:1006',
          comments: [275, 276],
          fields: [
            {
              ...textField('medidasMitigadoras', 'Medidas mitigadoras e compensatórias'),
              type: 'textarea',
              when: { phase: 'LP' },
              comments: [276],
              hint: 'Exibido apenas na LP; nas demais fases utilize a tabela de planos abaixo (#276).',
            },
            {
              ...textField('planoComunicacaoSocial', 'Plano de comunicação social'),
              type: 'textarea',
              when: { phase: 'LP' },
              comments: [276],
            },
            {
              key: 'tabelaPlanosExecutados',
              label: 'Planos Elaborados/Executados Durante a Vigência da Licença',
              type: 'table',
              required: true,
              when: { notPhase: 'LP' },
              comments: [275, 276],
              hint: 'Tabela exibida nas fases pós-LP para listagem alfanumérica dos planos elaborados/executados durante a vigência (#275).',
              columns: [textField('planoExecutado', 'Plano Elaborado / Executado')],
            },
          ],
        },
        {
          title: 'Educação ambiental',
          source: '157:1006',
          fields: [],
          documents: [
            'Programas de educação ambiental — ATEND (assinatura digital CTGA-01)',
            'Plano de ação — ATEND',
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

function matchesCondition(c: Condition, data: FceData, currentPhase?: FcePhase): boolean {
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
    const strArr = Array.isArray(val)
      ? val.filter((v): v is string => typeof v === 'string')
      : null;
    if (c.value !== undefined) {
      return strArr ? strArr.includes(c.value) : val === c.value;
    }
    if (c.notValue !== undefined) {
      return strArr
        ? strArr.length > 0 && !strArr.includes(c.notValue)
        : val !== undefined && val !== '' && val !== c.notValue;
    }
    if (c.notIn !== undefined) {
      if (strArr) return !strArr.some(v => c.notIn!.includes(v));
      return typeof val !== 'string' || !c.notIn.includes(val);
    }
  }
  return true;
}

export function visibleField(field: FceField, data: FceData, currentPhase?: FcePhase): boolean {
  if (!field.when) return true;
  const conditions = Array.isArray(field.when) ? field.when : [field.when];
  return conditions.every(c => matchesCondition(c, data, currentPhase));
}

export function visibleSection(section: FceSection, currentPhase?: FcePhase, data: FceData = {}): boolean {
  if (section.whenPhase) {
    const allowed = Array.isArray(section.whenPhase) ? section.whenPhase : [section.whenPhase];
    if (currentPhase && !allowed.includes(currentPhase)) return false;
  }
  if (section.when) {
    const conditions = Array.isArray(section.when) ? section.when : [section.when];
    if (!conditions.every(c => matchesCondition(c, data, currentPhase))) return false;
  }
  return true;
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
  if (!visibleStep(step, phase)) return errors;
  for (const s of step.sections) {
    if (!visibleSection(s, phase, data)) continue;
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
