import json

with open(r'c:\Users\lguar\projetos\Inema\scripts\cpdirre_sample.json', encoding='utf-8') as f:
    sample = json.load(f)

# Build TramitacaoItem list
tramitacoes = []
for idx, s in enumerate(sample):
    situacao = s['status']
    # Map common status or preserve exact
    tramitacoes.append({
        'id': f'tram-{idx+1:03d}',
        'processo': s['processo'],
        'dataTramitacao': s['dataTramitacao'],
        'interessado': s['interessado'],
        'unidade': s['coordenacao'] if s['coordenacao'] else 'COASP',
        'ato': s['ato'],
        'familiaAto': 'Outros' if s['ato'] in ['NOT', 'NOTC', 'Carta', 'Ofício', 'Despacho'] else ('Florestal / CEFIR' if 'RL' in s['ato'] or 'Vegetação' in s['ato'] or 'Reserva' in s['ato'] else 'Licenciamento / Regularização'),
        'situacao': s['status'],
        'municipio': 'Salvador' if idx % 4 == 0 else ('Barreiras' if idx % 4 == 1 else ('Ilhéus' if idx % 4 == 2 else 'Feira de Santana')),
        'tipologia': 'Agrossilvopastoril' if idx % 3 == 0 else ('Infraestrutura / Energia' if idx % 3 == 1 else 'Mineração / Indústria'),
        'liderEquipe': s['tecnicoLider'],
        'membrosEquipe': s['equipe'],
        'ano': 2024,
        'diasSemMovimentacao': (idx * 7 + 4) % 45,
        'prazoExcedido': ((idx * 7 + 4) % 45) > 30,
        'resumoDespacho': f"Tramitação registrada via {s['sistema']} referente ao ato {s['ato']} com parecer técnico.",
        'etapaAtual': 'Instrução e Análise Conclusiva' if s['status'] in ['CONCLUÍDO', 'REVISADO'] else 'Aguardando Providências'
    })

# Build PautaItem list
pauta = []
for idx, s in enumerate(sample[:20]):
    dias = (idx * 9 + 3) % 95
    prazo = 'No prazo' if dias <= 20 else ('Atenção' if dias <= 30 else 'Prazo Excedido')
    pauta.append({
        'id': f'pauta-{idx+1:03d}',
        'processo': s['processo'],
        'interessado': s['interessado'],
        'unidadeAtual': s['coordenacao'] if s['coordenacao'] else 'COASP',
        'tecnicoAtual': s['tecnicoLider'],
        'situacaoAtual': s['status'],
        'qtdAtos': 1 if idx % 3 == 0 else (2 if idx % 3 == 1 else 3),
        'atos': [s['ato']] if idx % 2 == 0 else [s['ato'], 'Despacho'],
        'ultimaMovimentacao': s['dataTramitacao'],
        'diasSemMovimentacao': dias,
        'situacaoPrazo': prazo,
        'municipio': 'Salvador' if idx % 4 == 0 else ('Barreiras' if idx % 4 == 1 else ('Ilhéus' if idx % 4 == 2 else 'Feira de Santana')),
        'tipologia': 'Agrossilvopastoril' if idx % 3 == 0 else ('Infraestrutura / Energia' if idx % 3 == 1 else 'Mineração / Indústria'),
        'liderEquipe': s['tecnicoLider'],
        'membrosEquipe': s['equipe'],
        'observacoes': f"Processo em acompanhamento ativo na DIRRE/{s['coordenacao']}."
    })

ts_code = f"""export interface TramitacaoItem {{
  id: string;
  processo: string;
  dataTramitacao: string;
  interessado: string;
  unidade: string;
  ato: string;
  familiaAto: string;
  situacao: string;
  municipio: string;
  tipologia: string;
  liderEquipe: string;
  membrosEquipe: string[];
  ano: number;
  diasSemMovimentacao: number;
  prazoExcedido: boolean;
  resumoDespacho: string;
  etapaAtual: string;
}}

export interface PautaItem {{
  id: string;
  processo: string;
  interessado: string;
  unidadeAtual: string;
  tecnicoAtual: string;
  situacaoAtual: string;
  qtdAtos: number;
  atos: string[];
  ultimaMovimentacao: string;
  diasSemMovimentacao: number;
  situacaoPrazo: 'No prazo' | 'Atenção' | 'Prazo Excedido';
  municipio: string;
  tipologia: string;
  liderEquipe: string;
  membrosEquipe: string[];
  observacoes: string;
}}

export interface FiltrosTramitacao {{
  unidades: string[];
  dataInicio: string;
  dataFim: string;
  atos: string[];
  situacoes: string[];
  tecnicos: string[];
  papelEquipe: 'qualquer' | 'lider' | 'membro';
  processo: string;
  interessado: string;
  municipios: string[];
  tipologias: string[];
}}

export const FILTROS_INICIAIS: FiltrosTramitacao = {{
  unidades: [],
  dataInicio: '2024-01-01',
  dataFim: '2024-12-31',
  atos: [],
  situacoes: [],
  tecnicos: [],
  papelEquipe: 'qualquer',
  processo: '',
  interessado: '',
  municipios: [],
  tipologias: []
}};

export interface FiltrosPauta {{
  busca: string;
  prazo: string;
  unidade: string;
  tecnico: string;
  situacao: string;
}}

export const FILTROS_PAUTA_INICIAIS: FiltrosPauta = {{
  busca: '',
  prazo: 'todos',
  unidade: 'todas',
  tecnico: 'todos',
  situacao: 'todas'
}};

export const LISTA_UNIDADES = [
  'COASP',
  'CGDIS',
  'COMIN',
  'CGF',
  'CEG',
  'CRH',
  'DIRRE/CGF',
  'DIRRE/CEG',
  'DILIC/UR-OESTE',
  'DILIC/UR-SUL',
  'DILIC/UR-METRO'
];

export const LISTA_SISTEMAS = ['SEI', 'SEIA', 'DOF', 'CERBERUS', 'SINAFLOR'];

export const LISTA_ATOS = [
  'Despacho',
  'NOT',
  'Autorização de Supressão de Vegetação (ASV)',
  'Autorização por procedimento especial (APE)',
  'Autorizações para o Manejo de Fauna',
  'Homologação de pátio',
  'Carta',
  'Auto de Infração Advertência (AIAD)',
  'Ofício',
  'Aprovação da Relocação da Reserva Legal (ARRL)',
  'Aprovação da Localização da Reserva Legal (ARL)',
  'Licença Prévia (LP)',
  'Licença de Instalação (LI)',
  'Licença de Operação (LO)'
];

export const LISTA_SITUACOES = [
  'CONCLUÍDO',
  'NOTIFICADO',
  'HOMOLOGAÇÃO DOF+',
  'AUTUADO',
  'REVISADO',
  'ARQUIVADO',
  'RL APROVADA',
  'NOTIFICAÇÃO DE COMUNICAÇÃO',
  'EM ANÁLISE TÉCNICA',
  'AGUARDANDO PARECER TÉCNICO',
  'DEFERIDO',
  'CANCELADO',
  'INDEFERIDO'
];

export const LISTA_TECNICOS = [
  'JOSELICE LEONE LIMA FONSECA',
  'WENDELL VILAS BOAS SANTOS',
  'RUTE DE OLIVEIRA SANTANA',
  'MAGDA RANIELE RODRIGUES MAGALHAES',
  'THOMAZ BORGES ARARIPE BARBOSA',
  'GENI DE SENA DIAS URPIA',
  'ADELINA DE OLIVEIRA E SILVA',
  'CAMILA DAPHINY PEREIRA VITORIO',
  'MARIA CRISTINA GOMES SANCHES',
  'SARAH PATRICIA LIMA NUNES',
  'CLARISSE DIAS CRUZ',
  'ANDRESSA CRISTINA RIBEIRO ASSUNCAO',
  'FELIPE DOS SANTOS DE OLIVEIRA',
  'Sem atribuição técnica'
];

export const LISTA_MUNICIPIOS = [
  'Barreiras',
  'Ilhéus',
  'Juazeiro',
  'Salvador',
  'Caetité',
  'Feira de Santana',
  'Vitória da Conquista',
  'Luís Eduardo Magalhães',
  'Porto Seguro',
  'Camaçari'
];

export const LISTA_TIPOLOGIAS = [
  'Agrossilvopastoril',
  'Mineração',
  'Energia Eólica',
  'Infraestrutura Rodoviária',
  'Indústria Química',
  'Recursos Hídricos',
  'Empreendimentos Turísticos'
];

export const LISTA_FAMILIAS = [
  'Todas as Famílias',
  'Florestal / CEFIR',
  'Licenciamento / Regularização',
  'Outros'
];

export const MOCK_TRAMITACOES: TramitacaoItem[] = {json.dumps(tramitacoes, indent=2, ensure_ascii=False)};

export const MOCK_PAUTA: PautaItem[] = {json.dumps(pauta, indent=2, ensure_ascii=False)};

// 4 KPIS OFICIAIS DO EXCEL (CPDIRRE - ABA MONITORAMENTO GERAL)
export const MOCK_RESUMO_DIRRE = {{
  totalProcessos: 12151,
  totalAtos: 12151,
  maiorTramitacaoMes: 482,
  menorTramitacaoMes: 15,
  mediaMensal: 347,
  processosConcluidos: 7391,
  processosNotificados: 2688
}};

// DADOS DOS GRÁFICOS DO EXCEL - MONITORAMENTO GERAL
export const MOCK_SISTEMAS_DONUT = [
  {{ name: 'SEI', value: 6697, percentual: 55.1 }},
  {{ name: 'SEIA', value: 3975, percentual: 32.7 }},
  {{ name: 'DOF', value: 1217, percentual: 10.0 }},
  {{ name: 'CERBERUS', value: 174, percentual: 1.4 }},
  {{ name: 'SINAFLOR', value: 84, percentual: 0.8 }}
];

export const MOCK_STATUS_BARRA = [
  {{ name: 'CONCLUÍDO', total: 7391 }},
  {{ name: 'NOTIFICADO', total: 2688 }},
  {{ name: 'HOMOLOGAÇÃO DOF+', total: 748 }},
  {{ name: 'AUTUADO', total: 308 }},
  {{ name: 'REVISADO', total: 282 }},
  {{ name: 'ARQUIVADO', total: 254 }},
  {{ name: 'RL APROVADA', total: 199 }}
];

export const MOCK_ATOS_DISTRIBUICAO = [
  {{ ato: 'Despacho', total: 3352 }},
  {{ ato: 'NOT', total: 1469 }},
  {{ ato: 'Supressão (ASV)', total: 995 }},
  {{ ato: 'Proc. Especial (APE)', total: 971 }},
  {{ ato: 'Manejo Fauna', total: 947 }},
  {{ ato: 'Homologação Pátio', total: 752 }},
  {{ ato: 'Carta / Ofício', total: 1051 }},
  {{ ato: 'Infração (AIAD)', total: 472 }},
  {{ ato: 'Reserva Legal (ARL)', total: 335 }}
];

export const MOCK_TECNICOS_COMPARATIVO = [
  {{ tecnico: 'JOSELICE LEONE', atos: 2947, processos: 2810 }},
  {{ tecnico: 'WENDELL VILAS BOAS', atos: 1254, processos: 1190 }},
  {{ tecnico: 'RUTE DE OLIVEIRA', atos: 964, processos: 920 }},
  {{ tecnico: 'MAGDA RANIELE', atos: 915, processos: 880 }},
  {{ tecnico: 'THOMAZ BORGES', atos: 865, processos: 840 }},
  {{ tecnico: 'GENI DE SENA', atos: 712, processos: 690 }},
  {{ tecnico: 'ADELINA DE OLIVEIRA', atos: 512, processos: 495 }},
  {{ tecnico: 'CAMILA DAPHINY', atos: 510, processos: 480 }},
  {{ tecnico: 'MARIA CRISTINA', atos: 467, processos: 450 }},
  {{ tecnico: 'SARAH PATRICIA', atos: 466, processos: 440 }}
];

export const MOCK_EVOLUCAO_MENSAL_DIRRE = [
  {{ mes: 'Jan', ano2023: 210, ano2024: 315 }},
  {{ mes: 'Fev', ano2023: 180, ano2024: 290 }},
  {{ mes: 'Mar', ano2023: 295, ano2024: 412 }},
  {{ mes: 'Abr', ano2023: 310, ano2024: 445 }},
  {{ mes: 'Mai', ano2023: 350, ano2024: 482 }}, // Pico: 482
  {{ mes: 'Jun', ano2023: 320, ano2024: 390 }},
  {{ mes: 'Jul', ano2023: 280, ano2024: 360 }},
  {{ mes: 'Ago', ano2023: 310, ano2024: 410 }},
  {{ mes: 'Set', ano2023: 290, ano2024: 375 }},
  {{ mes: 'Out', ano2023: 240, ano2024: 330 }},
  {{ mes: 'Nov', ano2023: 190, ano2024: 280 }},
  {{ mes: 'Dez', ano2023: 85, ano2024: 15 }}    // Menor: 15
];

export const MOCK_SITUACOES_PAUTA = [
  {{ name: 'CONCLUÍDO', value: 1240, percentual: 32.3 }},
  {{ name: 'NOTIFICADO', value: 890, percentual: 23.2 }},
  {{ name: 'REVISADO', value: 650, percentual: 16.9 }},
  {{ name: 'RL APROVADA', value: 520, percentual: 13.5 }},
  {{ name: 'EM ANÁLISE TÉCNICA', value: 340, percentual: 8.9 }},
  {{ name: 'AUTUADO', value: 200, percentual: 5.2 }}
];

export const MOCK_FAIXAS_DIAS_PAUTA = [
  {{ faixa: 'Até 15 dias', quantidade: 1450 }},
  {{ faixa: '16 a 30 dias', quantidade: 1120 }},
  {{ faixa: '31 a 60 dias', quantidade: 780 }},
  {{ faixa: '61 a 90 dias', quantidade: 310 }},
  {{ faixa: 'Mais de 90 dias', quantidade: 180 }}
];

export const MOCK_EVOLUCAO_MENSAL = [
  {{ mes: 'Jan', total: 315, atos: 330 }},
  {{ mes: 'Fev', total: 290, atos: 305 }},
  {{ mes: 'Mar', total: 412, atos: 430 }},
  {{ mes: 'Abr', total: 445, atos: 460 }},
  {{ mes: 'Mai', total: 482, atos: 482 }},
  {{ mes: 'Jun', total: 390, atos: 405 }},
  {{ mes: 'Jul', total: 360, atos: 375 }},
  {{ mes: 'Ago', total: 410, atos: 425 }},
  {{ mes: 'Set', total: 375, atos: 390 }},
  {{ mes: 'Out', total: 330, atos: 345 }},
  {{ mes: 'Nov', total: 280, atos: 295 }},
  {{ mes: 'Dez', total: 15, atos: 15 }}
];

export const MOCK_DISTRIBUICAO_UNIDADE = [
  {{ unidade: 'COASP', total: 6850 }},
  {{ unidade: 'DIRRE/CGF', total: 2150 }},
  {{ unidade: 'DIRRE/CEG', total: 1420 }},
  {{ unidade: 'DIRRE/CRH', total: 980 }},
  {{ unidade: 'CGDIS', total: 450 }},
  {{ unidade: 'DILIC/UR-SUL', total: 301 }}
];

export const MOCK_ATIVIDADES_TECNICO = [
  {{ tecnico: 'JOSELICE LEONE LIMA FONSECA', unidade: 'COASP', processosParticipacao: 2810, registrosParticipacao: 2947 }},
  {{ tecnico: 'WENDELL VILAS BOAS SANTOS', unidade: 'COASP', processosParticipacao: 1190, registrosParticipacao: 1254 }},
  {{ tecnico: 'RUTE DE OLIVEIRA SANTANA', unidade: 'COASP', processosParticipacao: 920, registrosParticipacao: 964 }},
  {{ tecnico: 'MAGDA RANIELE RODRIGUES MAGALHAES', unidade: 'COASP', processosParticipacao: 880, registrosParticipacao: 915 }},
  {{ tecnico: 'THOMAZ BORGES ARARIPE BARBOSA', unidade: 'COASP', processosParticipacao: 840, registrosParticipacao: 865 }},
  {{ tecnico: 'GENI DE SENA DIAS URPIA', unidade: 'COASP', processosParticipacao: 690, registrosParticipacao: 712 }},
  {{ tecnico: 'ADELINA DE OLIVEIRA E SILVA', unidade: 'COASP', processosParticipacao: 495, registrosParticipacao: 512 }},
  {{ tecnico: 'CAMILA DAPHINY PEREIRA VITORIO', unidade: 'COASP', processosParticipacao: 480, registrosParticipacao: 510 }},
  {{ tecnico: 'MARIA CRISTINA GOMES SANCHES', unidade: 'COASP', processosParticipacao: 450, registrosParticipacao: 467 }},
  {{ tecnico: 'SARAH PATRICIA LIMA NUNES', unidade: 'COASP', processosParticipacao: 440, registrosParticipacao: 466 }},
  {{ tecnico: 'CLARISSE DIAS CRUZ', unidade: 'COASP', processosParticipacao: 380, registrosParticipacao: 395 }}
];

export const MOCK_ANUAL_DIRRE = [
  {{ familia: 'Florestal / CEFIR', ato: 'Aprovação da Localização da Reserva Legal (ARL)', situacao: 'RL APROVADA', registros: 335, concluidosPublicados: 310 }},
  {{ familia: 'Florestal / CEFIR', ato: 'Autorização de Supressão de Vegetação (ASV)', situacao: 'REVISADO', registros: 995, concluidosPublicados: 850 }},
  {{ familia: 'Licenciamento / Regularização', ato: 'Autorização por procedimento especial (APE)', situacao: 'CONCLUÍDO', registros: 971, concluidosPublicados: 940 }},
  {{ familia: 'Outros', ato: 'Despacho Normativo', situacao: 'CONCLUÍDO', registros: 3352, concluidosPublicados: 3352 }},
  {{ familia: 'Outros', ato: 'Notificação Técnica (NOT)', situacao: 'NOTIFICADO', registros: 1469, concluidosPublicados: 1200 }},
  {{ familia: 'Florestal / CEFIR', ato: 'Homologação de pátio (DOF+)', situacao: 'HOMOLOGAÇÃO DOF+', registros: 752, concluidosPublicados: 748 }}
];
"""

with open(r'c:\Users\lguar\projetos\Inema\src\data\regulacaoMock.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print('Updated src/data/regulacaoMock.ts successfully!')
