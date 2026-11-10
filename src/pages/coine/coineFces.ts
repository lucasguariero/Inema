export type FceKind = 'eolica' | 'solar' | 'datacenter' | 'turismo';
export type FceValue = string | string[] | Record<string, string>[];
export type FceData = Record<string, FceValue>;
export type Condition = { key: string; value?: string; notValue?: string };
export interface FceField {
  key: string; label: string;
  type?: 'text' | 'number' | 'integer' | 'textarea' | 'radio' | 'select' | 'checks' | 'table' | 'computed' | 'pending';
  unit?: string; required?: boolean | ((data: FceData) => boolean); options?: string[]; when?: Condition | Condition[];
  hint?: string; source?: string; comments?: number[];
  columns?: FceField[];
}
export interface FceSection { title: string; source: string; comments?: number[]; note?: string; fields: FceField[]; documents?: string[] }
export interface FceStep { title: string; sections: FceSection[] }
export interface FceDefinition { kind: FceKind; title: string; route: string; steps: FceStep[] }
export const yesNo = ['Sim', 'Não'];
export const numberField = (key: string, label: string, unit = '', required = true): FceField => ({key, label, type:'number', unit, required});
export const textField = (key: string, label: string, required = true): FceField => ({key, label, required});
export const countField = (key: string, label: string, required = true): FceField => ({key, label, type:'integer', required});
export const choice = (key: string, label: string, options: string[], type: 'radio' | 'select' | 'checks' = 'radio'): FceField => ({key,label,options,type,required:true});
export const pending = (key: string, label: string, hint: string): FceField => ({key,label,type:'pending',hint});
const areaHint = 'Valor declarado no requerimento. A conexão com o formulário de origem e a conferência do shape não estão disponíveis nesta demonstração.';

export const eolica: FceDefinition = {
  kind:'eolica', title:'FCE de Energia Eólica', route:'coine-eolica', steps:[
    {title:'Parques e aerogeradores', sections:[
      {title:'Complexo eólico',source:'93:1973',comments:[187],fields:[
        countField('parques','Parques eólicos do complexo'), numberField('potenciaTotal','Potência total prevista','MW'),
        {...numberField('areaTotal','Área total do empreendimento','ha'),hint:areaHint,comments:[187]},
      ]},
      {title:'Aerogeradores',source:'93:1976',comments:[188],fields:[
        countField('geradores','Quantidade estimada de aerogeradores'),numberField('potenciaUnitaria','Potência nominal unitária','MW'),
        numberField('alturaHub','Altura do hub ou torre','m'),numberField('diametroRotor','Diâmetro do rotor','m'),
        numberField('areaBase','Área da base','m²'),numberField('areaPracas','Área das praças dos aerogeradores','ha'),
        numberField('distanciaTorres','Distância média entre torres','m'),countField('torresAnemometricas','Torres anemométricas'),
        numberField('alturaAnemometricas','Altura das torres anemométricas','m'),
        {key:'ocupacao',label:'Ocupação de área de geradores por hectare',type:'computed',unit:'ha/torre',comments:[188],hint:'Área total do empreendimento (ha) ÷ quantidade de aerogeradores. Não é calculada quando a quantidade é zero.'},
      ]},
      {title:'Layout e ruído',source:'93:1979',comments:[189,190],fields:[
        pending('distanciaEdificacao','Distância mais próxima entre aerogerador e edificação','Depende do processamento geoespacial do layout. Nenhuma distância ou sobreposição foi calculada.'),
        numberField('ruidoApta','Nível de ruído estimado na APTA','dBA'),
      ],documents:['Layout georreferenciado dos aerogeradores — ATEND','Estudo de modelagem de ruído — ATEND','Estudo do efeito estroboscópico (sombreamento) — ATEND'],note:'A interseção com áreas restritas e a eventual anuência dependem da validação do analista e de integração geoespacial.'},
    ]},
    {title:'Subestação e conexão',sections:[
      {title:'Rede interna de média tensão',source:'93:1983',fields:[choice('tipoRede','Tipo da rede',['Aérea','Subterrânea']),numberField('tensaoRede','Tensão nominal','kV'),numberField('extensaoRede','Extensão total da rede','km')]},
      {title:'Subestação elevadora',source:'93:1983',fields:[{...textField('descricaoSe','Descrição de funcionamento'),type:'textarea'},textField('tensaoSe','Tensão nominal de entrada e saída'),numberField('areaSe','Área total da subestação','ha'),{...textField('sistemasSe','Sistemas auxiliares'),type:'textarea',hint:'Transmissão, proteção, telecomunicações e geração auxiliar.'}]},
      {title:'Conexão à rede',source:'93:1986',comments:[191,192],fields:[textField('acessoRede','Linha de transmissão ou subestação de acesso (concessionária/ONS)'),{...textField('alternativasConexao','Justificativa das alternativas de transmissão'),type:'textarea'}],documents:['Diagrama unifilar executivo — ATEND','Arranjo geral da subestação elevadora — ATEND']},
    ]},
    {title:'Obras, acessos e água',sections:[
      {title:'Canteiro de obras',source:'93:1990',comments:[193,194],fields:[numberField('areaCanteiro','Área do canteiro','ha'),{...choice('esgotamento','Esgotamento sanitário',['Fossa séptica','ETE compactada','Concessionária','Outros'],'select'),comments:[193,159]},textField('residuosObra','Gestão de resíduos sólidos da obra')]},
      {title:'Acessos e logística',source:'93:1990',fields:[numberField('acessosExistentes','Acessos existentes adequados','km'),numberField('novosAcessos','Novos acessos permanentes','km'),numberField('larguraVias','Largura das vias','m')]},
      {title:'Terra e água',source:'93:1990',comments:[195],fields:[numberField('corte','Volume de corte','m³'),numberField('aterro','Volume de aterro','m³'),{...choice('origemAgua','Origem da água',['Concessionária','Carro-pipa','Captação superficial','Captação subterrânea'],'select'),comments:[195,160]},numberField('vazaoAgua','Vazão consumida','m³/dia'),numberField('bombeamento','Regime de bombeamento','h/dia')],documents:['Bota-fora e jazidas de empréstimo — referência documental']},
    ]},
    {title:'Alternativas e custos',sections:[
      {title:'Alternativas e hipótese de não instalação',source:'94:2003',comments:[197],fields:[{...textField('justificativaAlternativa','Justificativa da alternativa preferencial (físico, biótico e socioeconômico)'),type:'textarea'},{...textField('naoInstalacao','Justificativa da hipótese de não instalação'),type:'textarea'}],documents:['Análise comparativa do arranjo geral dos aerogeradores','Análise da hipótese de não instalação (LP)']},
      {title:'Mão de obra, prazo e custo',source:'94:2006',comments:[198],fields:[countField('trabalhadoresPlanejamento','Trabalhadores na fase de planejamento'),{...countField('maoObraDireta','Mão de obra direta na instalação'),comments:[198,167]}, {...countField('maoObraIndireta','Mão de obra indireta na instalação'),comments:[198,167]},countField('trabalhadoresOperacao','Trabalhadores na operação'),numberField('prazo','Prazo de implantação','meses'),numberField('custoTotal','Custo total do empreendimento','R$'),{...textField('associados','Empreendimentos colocalizados ou associados (FV, BESS, LT)',false),type:'textarea'}],documents:['Cronograma físico-financeiro previsto (LP)','Memória de cálculo por etapa']},
    ]},
    {title:'Resumo',sections:[]},
  ],
};

// Solar shares only the sections expressly confirmed by #204/205 and the source canvas.
export const solar: FceDefinition = {
  kind:'solar',title:'FCE de Energia Solar',route:'coine-solar',steps:[
    {title:'Parques e placas fotovoltaicas',sections:[
      {title:'Complexo solar',source:'94:2008',comments:[199,200,206],fields:[countField('parques','Número de parques solares'),numberField('potenciaTotal','Potência total prevista','MW'),{...numberField('areaTotal','Área total do empreendimento','ha'),hint:areaHint}]},
      {title:'Placas fotovoltaicas',source:'94:2009',comments:[201,202],fields:[countField('placas','Quantidade estimada de placas fotovoltaicas'),{...numberField('potenciaUnitaria','Potência nominal unitária','MW'),hint:'MW é a unidade visível no modelo do Figma; a adequação da unidade para as placas continua pendente de confirmação pela COINE.'},countField('eletrocentros','Número de eletrocentros')]},
      {title:'Layout georreferenciado do projeto',source:'94:2010',comments:[203],fields:[pending('distanciaEdificacao','Distância da placa até as edificações','Depende do processamento geoespacial do projeto. Nenhuma distância ou sobreposição foi calculada.')],documents:['Layout georreferenciado do projeto — ATEND'],note:'Análise espacial e anuência em áreas restritas dependem dos serviços institucionais e da validação do analista.'},
    ]},
    {title:'Subestação e conexão',sections:eolica.steps[1].sections.map(s=>({...s,source:s.source==='93:1986'?'94:2013':'94:2012',comments:[204],documents:undefined}))},
    {title:'Obras, acessos e água',sections:eolica.steps[2].sections.map(s=>({...s,source:'94:2015',comments:[205]}))},
    {title:'Alternativas e custos',sections:eolica.steps[3].sections.map(s=>({...s,source:s.source==='94:2003'?'94:2022':'94:2023',comments:[],documents:s.documents?.map(d=>d.replace('dos aerogeradores','do projeto solar')),fields:s.fields.map(f=>f.key==='associados'?{...f,label:'Empreendimentos colocalizados ou associados'}:f)}))},
    {title:'Resumo',sections:[]},
  ],
};

const ifYes = (key: string): Condition => ({key,value:'Sim'});
export const datacenter: FceDefinition = {
  kind:'datacenter',title:'FCE de Data Center',route:'coine-datacenter',steps:[
    {title:'Energia, carga de TI e PUE',sections:[
      {title:'Demanda elétrica e capacidade',source:'65:3625',comments:[81,82,83],fields:[
        numberField('areaInstalada','Área total instalada','ha'),numberField('potenciaEletrica','Potência elétrica total instalada','MW'),
        choice('arranjo','Arranjo construtivo',['Containers modulares outdoor','Edificação de alvenaria dedicada']),
        {...countField('containers','Containers'),when:{key:'arranjo',value:'Containers modulares outdoor'},source:'65:3652'},
        {...choice('subestacao','A subestação é dedicada ou já existente?',['Dedicada','Já existente']),comments:[83]},
        {...textField('nomeSubestacao','Nome da subestação existente'),when:{key:'subestacao',value:'Já existente'}},
        {...numberField('potenciaSubestacao','Potência da subestação'),hint:'A unidade da potência não foi especificada no comentário #83; confirmar com a COINE.'},
      ],note:'Cenário inicial LP. Módulos de expansão são específicos da LA e não são solicitados nesta demonstração.'},
      {title:'UPS e BESS internos',source:'65:3625',comments:[84],fields:[
        choice('usaUpsBess','Haverá uso de UPS e BESS?',yesNo),
        {...textField('tecnologiaUps','Tecnologia de UPS'),when:ifYes('usaUpsBess')},
        {...numberField('potenciaUps','Potência de UPS','MVA'),when:ifYes('usaUpsBess')},
        {...pending('quimicaBess','Química do BESS interno','O catálogo completo não consta no material recebido. A seleção institucional permanece pendente.'),when:ifYes('usaUpsBess')},
        {...numberField('capacidadeBess','Capacidade do BESS','MWh'),when:ifYes('usaUpsBess')},
      ]},
      {title:'Eficiência energética (PUE)',source:'65:3628',fields:[numberField('pue','PUE projetado ou medido')]},
    ]},
    {title:'Geradores e emissões',sections:[
      {title:'Grupos geradores',source:'65:3657',comments:[85],fields:[choice('usaGerador','Haverá uso de gerador de emergência?',yesNo),
        {...countField('geradores','Quantidade de geradores'),when:ifYes('usaGerador')},
        {...numberField('potenciaGerador','Potência unitária','kVA'),when:ifYes('usaGerador')},
        {...numberField('potenciaParque','Potência total do parque','MVA'),when:ifYes('usaGerador')},
        {...pending('combustivel','Combustível','O catálogo não está disponível integralmente; não foi presumida uma seleção a partir do exemplo preenchido.'),when:ifYes('usaGerador')},
        {...numberField('autonomia','Autonomia de operação','h'),when:ifYes('usaGerador')},
        {...numberField('regimeTestes','Regime de testes por unidade','h/mês'),when:ifYes('usaGerador')},
      ]},
      {title:'Tancagem e contenção',source:'65:3657',comments:[86],fields:[choice('usaTancagem','Haverá tancagem ou contenção?',yesNo),
        {...choice('tipoTancagem','Tipo de tancagem',['Subterrânea','Superfície (aérea)']),when:ifYes('usaTancagem')},
        {...numberField('capacidadeTanque','Capacidade total','m³'),when:ifYes('usaTancagem')},
        {...textField('sistemaContencao','Sistema de contenção'),when:ifYes('usaTancagem')},
      ]},
      {title:'Emissões atmosféricas',source:'65:3660',comments:[87,88,89],fields:[choice('emissao','Haverá emissão atmosférica?',yesNo),
        {...choice('poluentes','Poluentes emitidos',['NOx','CO','Material particulado','SO₂','Outros'],'checks'),when:ifYes('emissao')},
        {...numberField('vazaoGas','Vazão do efluente gasoso por chaminé','Nm³/h',false),when:ifYes('emissao'),hint:'Não obrigatória no cenário inicial LP. O Figma registra obrigatoriedade na LO e RLO.'},
        {...pending('laudoChamine','Laudo de medição isocinética de chaminé','Referência documental. Sem gerador a combustível, este item permanece oculto. O documento original não é vinculado neste protótipo.'),when:[ifYes('usaGerador'),ifYes('emissao')]},
      ]},
    ]},
    {title:'Resfriamento, água e WUE',sections:[
      {title:'Tecnologia e fluidos refrigerantes',source:'65:3663',comments:[90],fields:[choice('resfriamento','Sistema principal',['Chilled water com dry coolers','Resfriamento evaporativo','Torres de resfriamento','Resfriamento líquido direto','Imersão em fluido dielétrico','Ar (CRAC)','Outro'],'select'),textField('fluidos','Fluidos refrigerantes e GWP'),numberField('cargaRefrigerante','Carga total de refrigerante','kg')],documents:['Plano de prevenção de emissões fugitivas e detecção de vazamentos']},
      {title:'Balanço hídrico',source:'65:3666',comments:[91,277],fields:[choice('fonteAgua','Fonte de abastecimento',['Captação superficial','Poço','Concessionária pública']),numberField('demandaMedia','Demanda média','m³/dia'),numberField('demandaPico','Demanda máxima de pico','m³/dia'),{...textField('portariaOutorga','Número da portaria de outorga ou concessão'),required:(d: FceData)=>d.fonteAgua!=='Concessionária pública',comments:[91,277],hint:'Obrigatório para poço ou captação superficial; opcional quando abastecido por concessionária pública (#277).'},numberField('volumeReutilizado','Volume de água reutilizada','m³/dia')],documents:['Balanço hídrico completo — ATEND']},
      {title:'Eficiência hídrica (WUE)',source:'65:3666',fields:[numberField('wue','WUE projetado ou medido','L/kWh'),{...numberField('reposicaoRefrigerante','Reposição de fluido refrigerante anual','m³'),source:'66:3675'}]},
    ]},
    {title:'Diagnóstico acústico',sections:[
      {title:'Inventário de fontes sonoras',source:'66:3681',comments:[278],fields:[{key:'fontesSonoras',label:'Fontes sonoras',type:'table',required:true,columns:[textField('equipamento','Equipamento ou fonte'),countField('quantidade','Quantidade'),numberField('lwa','LWA unitário','dBA')]}]},
      {title:'Receptores e atenuação',source:'66:3684',comments:[92,93,94],fields:[numberField('distanciaReceptor','Distância ao receptor sensível mais próximo','m'),numberField('ruidoReceptor','Nível de ruído acumulado modelado no receptor','dBA'),choice('tonais','Presença de componentes tonais (zumbido de baixa frequência)',yesNo)],documents:['Espectro de frequências por fonte — ATEND','Medição do ruído residual (baseline) na APTA — ATEND','Plano de atenuação física (barreiras ou enclausuramento) — ATEND'],note:'Os valores declarados não substituem a avaliação acústica. Não foi presumido um limite universal de ruído.'},
    ]},
    {title:'Riscos, resíduos e programas',sections:[
      {title:'Detecção e supressão de incêndio',source:'66:3688',comments:[96,98,279],fields:[choice('deteccao','Detecção',['Fumaça a laser (VESDA)','Off-gas de baterias','Elevação de temperatura','Outro'],'checks'),pending('agenteSupressao','Agente de supressão automática','A lista completa de agentes depende do catálogo institucional. Nenhum agente foi pré-selecionado.')],documents:['PGR e PAEA específicos para infraestrutura crítica — ATEND'],note:'AVCB é previsto na LO e RLO (#98); não é exigido no cenário LP.'},
      {title:'Resíduos, e-waste e baterias',source:'66:3691',comments:[97],fields:[textField('residuosEletronicos','Resíduos eletroeletrônicos (servidores e placas)'),textField('bateriasOleos','Baterias usadas e óleos lubrificantes')],documents:['PGRS e contratos de destinação de e-waste — ATEND'],note:'O acompanhamento do MTR e da rastreabilidade de e-waste (SINIR) na RLO depende do analista; não há consulta real.'},
      {title:'Monitoramento e expansão',source:'66:3691',comments:[95],fields:[{...textField('monitoramento','Programa de monitoramento contínuo de PUE e WUE',false),type:'textarea',hint:'Obrigatório na RLO; opcional neste cenário LP.'},{...textField('expansao','Plano de expansão modular'),type:'textarea'}]},
    ]},
    {title:'Revisão e conclusão',sections:[]},
  ],
};

export const turismo: FceDefinition = {
  kind:'turismo',title:'FCE de Turismo e Lazer',route:'coine-turismo',steps:[
    {title:'Projetos e geometria',sections:[
      {title:'Quantitativos urbanísticos da planta geral',source:'66:3697',comments:[99,100,111],fields:[countField('lotes','Lotes ou unidades individuais'),{...numberField('areaTotal','Área total do empreendimento','ha'),source:'66:3714'},numberField('areaLivre','Área livre de uso público e verdes','ha'),numberField('areaComercial','Área comercial e de serviços','ha'),pending('localizacao','Localização do empreendimento','Informação automática do requerimento / FCE Geral (#99). O contrato de origem ainda não está conectado.')],documents:['Planta geral urbanística (PDF ou shape)','Projeto paisagístico preliminar (LP) — ATEND','Levantamento planialtimétrico georreferenciado (escala ≤ 1:2000)']},
      {title:'Vetores georreferenciados',source:'66:3700',comments:[101,102,103],fields:[pending('poligonal','Localização e poligonal do empreendimento','Recuperação do requerimento pendente. Nenhum arquivo foi vinculado nem houve cálculo de área.'),pending('usoSolo','Uso do solo e restrições (APP, RL, UC, ZA, Mata Atlântica)','Recuperação do requerimento pendente. Não foram verificadas sobreposições.')],documents:['Vetores georreferenciados — ATEND'],note:'O acionamento de anuência em UC ou zona de amortecimento depende da validação do analista. Não há consulta geoespacial real.'},
    ]},
    {title:'Drenagem e terraplenagem',sections:[
      {title:'Drenagem pluvial e superficial',source:'66:3703',comments:[104,105],fields:[],documents:['Projeto de drenagem pluvial — ATEND'],note:'O dimensionamento da drenagem e os volumes de terraplenagem são campos da LI (#104). Não são exigidos no cenário inicial LP.'},
      {title:'Terraplenagem e movimentação do solo',source:'66:3703',comments:[104,106],fields:[],documents:['Projeto de terraplenagem e estabilização — ATEND'],note:'Documento referenciado, sujeito ao enquadramento da ATEND. Esta tela não solicita novamente o arquivo.'},
    ]},
    {title:'Abastecimento e esgotamento',sections:[
      {title:'Abastecimento de água',source:'66:3706',comments:[107,280],fields:[choice('fonteAgua','Fonte de abastecimento',['Rede pública','Poço artesiano','Vertente','Lagoa','Riacho','Rio','Outros']),numberField('consumoHora','Consumo estimado de água por hora','m³/h'),numberField('consumoDia','Consumo estimado de água por dia','m³/dia'),choice('usosAgua','Usos da água',['Humano','Irrigação','Piscinas','Combate a incêndio','Industrial'],'checks'),{...textField('cartaAgua','Número da carta de viabilidade de abastecimento'),when:{key:'fonteAgua',value:'Rede pública'}},{...textField('portariaOutorgaAgua','Número da portaria de outorga',false),when:{key:'fonteAgua',notValue:'Rede pública'},comments:[280],hint:'Opcional; aplicável quando a captação não for rede pública (#280).'}]},
      {title:'Esgotamento sanitário',source:'66:3709',comments:[281,282],fields:[{key:'efluentes',label:'Efluentes e destinação',type:'table',columns:[textField('origem','Origem'),textField('coleta','Sistema de coleta'),numberField('vazao','Vazão','m³/dia'),textField('tratamento','Sistema de tratamento'),textField('destino','Destino final')]},{...choice('sistemaEsgoto','Sistema de esgotamento',['Coleta pública com ETE da concessionária','ETE própria','Outros']),comments:[281]},{...textField('cartaEsgoto','Número da carta de viabilidade de esgotamento'),when:{key:'sistemaEsgoto',value:'Coleta pública com ETE da concessionária'}},{...pending('corpoReceptor','Corpo receptor','O catálogo GEOBahia e a verificação de localização na AID não estão conectados. Aplicável para lançamento em corpo hídrico receptor.'),when:{key:'sistemaEsgoto',notValue:'Coleta pública com ETE da concessionária'}},{...textField('portariaEsgotoOutorga','Número da portaria de outorga ou dispensa'),when:{key:'sistemaEsgoto',notValue:'Coleta pública com ETE da concessionária'},required:(d: FceData)=>d.sistemaEsgoto==='ETE própria'||(d.sistemaEsgoto==='Outros'&&!!d.corpoReceptor),comments:[282],hint:'Obrigatório para intervenção em corpo hídrico com lançamento em corpo receptor (ETE própria e demais soluções com intervenção hídrica) (#282).'}]},
    ]},
    {title:'Suprimento de energia',sections:[
      {title:'Suprimento e fontes de energia',source:'66:3712',fields:[textField('concessionaria','Linha de distribuição / concessionária'),numberField('tensao','Tensão de distribuição','kV'),textField('geradoresEmergencia','Grupos geradores de emergência',false),textField('outrasFontes','Outras fontes de energia',false)]},
    ]},
    {title:'Impactos e PBA',sections:[
      {title:'Matriz de impactos ambientais',source:'67:3730',comments:[108],fields:[],documents:['Matriz de impactos ambientais — ATEND'],note:'A matriz é solicitada em Documentos Obrigatórios (#108); não foi duplicada como tabela de preenchimento no FCE.'},
      {title:'Plano Básico Ambiental (PBA)',source:'67:3733',comments:[109,110],fields:[],documents:['PBA completo — ATEND'],note:'A intervenção em APP pertence ao FCE único (#109). Não é repetida neste formulário específico.'},
    ]},
    {title:'Revisão e conclusão',sections:[]},
  ],
};
export const fceDefinitions: Record<FceKind,FceDefinition> = {eolica,solar,datacenter,turismo};

export function visibleField(field: FceField, data: FceData): boolean {
  if (!field.when) return true;
  const conditions = Array.isArray(field.when) ? field.when : [field.when];
  return conditions.every(c => {
    const val = data[c.key];
    if (c.value !== undefined) return val === c.value;
    if (c.notValue !== undefined) return val !== undefined && val !== '' && val !== c.notValue;
    return true;
  });
}
export function isFieldRequired(field: FceField, data: FceData): boolean {
  if (typeof field.required === 'function') return field.required(data);
  return !!field.required;
}
export function parseNumber(value: string): number | undefined {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return undefined;
  const n = Number(normalized); return Number.isFinite(n) ? n : undefined;
}
export function numericError(value: string, integer = false): string | undefined {
  if (!value.trim()) return;
  const n = parseNumber(value);
  if (n === undefined) return 'Informe um número não negativo, usando vírgula ou ponto como separador decimal.';
  if (integer && !Number.isInteger(n)) return 'Informe uma quantidade inteira.';
}
export function computedOccupation(data: FceData): string {
  const area = parseNumber(String(data.areaTotal || '')); const count = parseNumber(String(data.geradores || ''));
  return area !== undefined && count !== undefined && count > 0 ? new Intl.NumberFormat('pt-BR',{maximumFractionDigits:4}).format(area/count) : 'Não calculado';
}
export function activeFields(section: FceSection, data: FceData): FceField[] { return section.fields.filter(f=>visibleField(f,data)); }
export function fieldError(field: FceField, data: FceData): string | undefined {
  if (!visibleField(field,data) || field.type === 'pending' || field.type === 'computed') return;
  const isReq = isFieldRequired(field, data);
  const value = data[field.key];
  if (isReq && (!value || (typeof value === 'string' ? !value.trim() : !value.length))) return 'Preencha este campo.';
  if (field.type === 'integer' || field.type === 'number') return numericError(String(value || ''),field.type==='integer');
  if (field.type==='table') {
    for (const row of (Array.isArray(value)? value : []) as Record<string,string>[]) for(const column of field.columns || []) {
      const error = fieldError(column,row); if(error) return `${column.label}: ${error}`;
    }
  }
}
export function stepErrors(step: FceStep, data: FceData): Record<string,string> {
  const errors: Record<string,string> = {};
  for(const s of step.sections) for(const f of activeFields(s,data)) {
    const error=fieldError(f,data); if(error)errors[f.key]=error;
    if(f.options?.some(o=>/^(outro|outra)/i.test(o)) && (typeof data[f.key]==='string' ? /^(outro|outra)/i.test(String(data[f.key])) : Array.isArray(data[f.key]) && (data[f.key] as string[]).some(v=>/^(outro|outra)/i.test(v))) && !String(data[f.key+'Descricao'] || '').trim()) errors[f.key+'Descricao']='Descreva a opção informada.';
  }
  return errors;
}
