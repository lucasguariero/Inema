import type { SelectOption } from '@/components/filament';

export type AtoCategoryId = 'licencas' | 'autorizacoes' | 'outorga' | 'declaratorios';
export type AtoCategoryLabel = 'Licenças' | 'Autorizações' | 'Outorga' | 'Declaratórios';

export interface SeiaV2AtoItem {
  key: string;
  label: string;
  categoryId: AtoCategoryId;
  category: AtoCategoryLabel;
  rowIndex: number;
  order: number;
}

export const SEIA_V2_ATO_CATEGORIES: ReadonlyArray<{ id: AtoCategoryId; label: AtoCategoryLabel; count: number }> = [
  { id: 'licencas', label: 'Licenças', count: 19 },
  { id: 'autorizacoes', label: 'Autorizações', count: 16 },
  { id: 'outorga', label: 'Outorga', count: 9 },
  { id: 'declaratorios', label: 'Declaratórios', count: 9 },
];

/**
 * Catálogo integral dos 53 atos da tabela "ATOS ADMINISTRATIVOS AMBIENTAIS"
 * (Modelo_página_SEIA.docx, 22 linhas x 4 colunas), preservando classificação
 * e ordem originais, com chaves internas únicas para atos repetidos (PPV / RC).
 */
export const SEIA_V2_ATOS: ReadonlyArray<SeiaV2AtoItem> = [
  {
    "key": "licencas:01:licena-prvia-lp",
    "label": "Licença Prévia - LP",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 3,
    "order": 1
  },
  {
    "key": "licencas:02:licena-de-instalao-li",
    "label": "Licença de Instalação- LI",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 4,
    "order": 2
  },
  {
    "key": "licencas:03:licena-de-operao-lo",
    "label": "Licença de operação - LO",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 5,
    "order": 3
  },
  {
    "key": "licencas:04:licena-ambiental-nica-lau",
    "label": "Licença Ambiental Única-LAU",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 6,
    "order": 4
  },
  {
    "key": "licencas:05:licena-ambiental-por-adeso-e-compromisso-lac",
    "label": "Licença Ambiental por Adesão e Compromisso - LAC",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 7,
    "order": 5
  },
  {
    "key": "licencas:06:licena-de-operao-corretiva-loc",
    "label": "Licença de Operação Corretiva -LOC",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 8,
    "order": 6
  },
  {
    "key": "licencas:07:licena-ambiental-especial-lae",
    "label": "Licença Ambiental Especial - LAE",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 9,
    "order": 7
  },
  {
    "key": "licencas:08:prorrogao-de-prazo-de-validade-ppv",
    "label": "Prorrogação de Prazo de Validade - PPV",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 10,
    "order": 8
  },
  {
    "key": "licencas:09:reviso-de-condicionante-rc",
    "label": "Revisão de Condicionante -RC",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 11,
    "order": 9
  },
  {
    "key": "licencas:10:renovao-de-licena-de-operao-rlo",
    "label": "Renovação de Licença de Operação - RLO",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 12,
    "order": 10
  },
  {
    "key": "licencas:11:renovao-de-licena-prvia-rlp",
    "label": "Renovação de Licença Prévia -RLP",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 13,
    "order": 11
  },
  {
    "key": "licencas:12:renovao-de-licena-de-implantao-rli",
    "label": "Renovação de Licença de Implantação - RLI",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 14,
    "order": 12
  },
  {
    "key": "licencas:13:renovao-de-licena-ambiental-nica-rlau",
    "label": "Renovação de Licença Ambiental Única -RLAU",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 15,
    "order": 13
  },
  {
    "key": "licencas:14:renovao-de-licena-licena-ambiental-por-adeso-e-compromisso-rlac",
    "label": "Renovação de Licença Licença Ambiental por Adesão e Compromisso RLAC",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 16,
    "order": 14
  },
  {
    "key": "licencas:15:renovao-licena-de-operao-corretiva-rloc",
    "label": "Renovação Licença de Operação Corretiva RLOC",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 17,
    "order": 15
  },
  {
    "key": "licencas:16:licena-de-ampliao-la",
    "label": "Licença de Ampliação -LA",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 18,
    "order": 16
  },
  {
    "key": "licencas:17:lp-li",
    "label": "LP+LI",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 19,
    "order": 17
  },
  {
    "key": "licencas:18:li-lo",
    "label": "LI+LO",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 20,
    "order": 18
  },
  {
    "key": "licencas:19:lic",
    "label": "LIC",
    "categoryId": "licencas",
    "category": "Licenças",
    "rowIndex": 21,
    "order": 19
  },
  {
    "key": "autorizacoes:01:autorizao-de-corte-de-floresta-de-produo-acfp",
    "label": "Autorização de Corte de Floresta de Produção - ACFP",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 3,
    "order": 1
  },
  {
    "key": "autorizacoes:02:autorizao-de-relocao-de-reserva-legal-arrl",
    "label": "Autorização de Relocação de Reserva Legal - ARRL",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 4,
    "order": 2
  },
  {
    "key": "autorizacoes:03:autorizao-ambiental-aa",
    "label": "Autorização Ambiental - AA",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 5,
    "order": 3
  },
  {
    "key": "autorizacoes:04:autorizao-de-supresso-de-vegetao-asv",
    "label": "Autorização de Supressão de Vegetação - ASV",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 6,
    "order": 4
  },
  {
    "key": "autorizacoes:05:autorizao-de-manejo-de-fauna-amf",
    "label": "Autorização de Manejo de Fauna - AMF",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 7,
    "order": 5
  },
  {
    "key": "autorizacoes:06:asa",
    "label": "ASA",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 8,
    "order": 6
  },
  {
    "key": "autorizacoes:07:autorizao-de-plano-de-manejo-florestal-sustentvel-apmf",
    "label": "Autorização de plano de Manejo Florestal Sustentável - APMF",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 9,
    "order": 7
  },
  {
    "key": "autorizacoes:08:autorizao-de-explorao-de-manejo-florestal-sustentvel-epmf",
    "label": "Autorização de Exploração de Manejo Florestal Sustentável -EPMF",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 10,
    "order": 8
  },
  {
    "key": "autorizacoes:09:reconhecimento-de-volume-florestal-remanescente-rvfr",
    "label": "Reconhecimento de Volume Florestal Remanescente - RVFR",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 11,
    "order": 9
  },
  {
    "key": "autorizacoes:10:emisso-de-crdito-de-vomule-florestal-ecvf",
    "label": "Emissão de Crédito de Vomule Florestal - ECVF",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 12,
    "order": 10
  },
  {
    "key": "autorizacoes:11:transferncia-de-crdito-de-volume-florestal-tcvf",
    "label": "Transferência de Crédito de Volume Florestal -TCVF",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 13,
    "order": 11
  },
  {
    "key": "autorizacoes:12:aproveitamento-de-material-lenhoso-aml",
    "label": "Aproveitamento de Material Lenhoso -AML",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 14,
    "order": 12
  },
  {
    "key": "autorizacoes:13:prorrogao-de-prazo-de-validade-ppv",
    "label": "Prorrogação de Prazo de Validade - PPV",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 15,
    "order": 13
  },
  {
    "key": "autorizacoes:14:reviso-de-condicionantes-rc",
    "label": "Revisão de Condicionantes -RC",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 16,
    "order": 14
  },
  {
    "key": "autorizacoes:15:renovao-de-autorizao-ambiental-raa",
    "label": "Renovação de Autorização Ambiental -RAA",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 17,
    "order": 15
  },
  {
    "key": "autorizacoes:16:autorizaes-de-uso-e-manejo-de-fauna-silvestre-am-sisfauna",
    "label": "Autorizações de Uso e Manejo de Fauna Silvestre – AM - SISFAUNA:",
    "categoryId": "autorizacoes",
    "category": "Autorizações",
    "rowIndex": 18,
    "order": 16
  },
  {
    "key": "outorga:01:outorga-de-uso-de-recurso-hdrico",
    "label": "Outorga de uso de recurso hídrico",
    "categoryId": "outorga",
    "category": "Outorga",
    "rowIndex": 3,
    "order": 1
  },
  {
    "key": "outorga:02:alterao-de-outorga-de-direito-de-uso-de-recursos-hdrico",
    "label": "Alteração de Outorga de direito de uso de recursos hídrico",
    "categoryId": "outorga",
    "category": "Outorga",
    "rowIndex": 4,
    "order": 2
  },
  {
    "key": "outorga:03:declarao-de-reserva-de-disponibilidade-hdrica",
    "label": "Declaração de Reserva de disponibilidade hídrica",
    "categoryId": "outorga",
    "category": "Outorga",
    "rowIndex": 5,
    "order": 3
  },
  {
    "key": "outorga:04:outorga-preventiva-de-uso-de-recurso-hdrico",
    "label": "Outorga Preventiva de uso de recurso hídrico",
    "categoryId": "outorga",
    "category": "Outorga",
    "rowIndex": 6,
    "order": 4
  },
  {
    "key": "outorga:05:prorrogao-de-prazo-de-validade-ppv",
    "label": "Prorrogação de Prazo de Validade - PPV",
    "categoryId": "outorga",
    "category": "Outorga",
    "rowIndex": 7,
    "order": 5
  },
  {
    "key": "outorga:06:renovao-de-outorga-de-direito-de-uso-de-recurso-hdrico",
    "label": "Renovação de Outorga de direito de uso de recurso hídrico",
    "categoryId": "outorga",
    "category": "Outorga",
    "rowIndex": 8,
    "order": 6
  },
  {
    "key": "outorga:07:autorizao-para-perfurao-de-poo",
    "label": "Autorização para perfuração de poço",
    "categoryId": "outorga",
    "category": "Outorga",
    "rowIndex": 9,
    "order": 7
  },
  {
    "key": "outorga:08:dispensa-de-outorga-de-direito-de-uso-de-recurso-hdrico",
    "label": "Dispensa de Outorga de direito de uso de recurso hídrico",
    "categoryId": "outorga",
    "category": "Outorga",
    "rowIndex": 10,
    "order": 8
  },
  {
    "key": "outorga:09:reviso-de-condicionante-rc",
    "label": "Revisão de Condicionante -RC",
    "categoryId": "outorga",
    "category": "Outorga",
    "rowIndex": 11,
    "order": 9
  },
  {
    "key": "declaratorios:01:declarao-de-transporte-de-resduos-perigosos-dtrp",
    "label": "Declaração de Transporte de Resíduos Perigosos - DTRP",
    "categoryId": "declaratorios",
    "category": "Declaratórios",
    "rowIndex": 4,
    "order": 1
  },
  {
    "key": "declaratorios:02:declarao-de-inexigibilidades",
    "label": "Declaração de Inexigibilidades",
    "categoryId": "declaratorios",
    "category": "Declaratórios",
    "rowIndex": 5,
    "order": 2
  },
  {
    "key": "declaratorios:03:declarao-de-queima-controlada-dqc",
    "label": "Declaração de Queima Controlada - DQC",
    "categoryId": "declaratorios",
    "category": "Declaratórios",
    "rowIndex": 6,
    "order": 3
  },
  {
    "key": "declaratorios:04:declarao-de-interveno-em-rea-protegida-diap",
    "label": "Declaração de Intervenção em Área Protegida - DIAP",
    "categoryId": "declaratorios",
    "category": "Declaratórios",
    "rowIndex": 7,
    "order": 4
  },
  {
    "key": "declaratorios:05:registro-de-floresta-de-rfp",
    "label": "Registro de Floresta de RFP",
    "categoryId": "declaratorios",
    "category": "Declaratórios",
    "rowIndex": 8,
    "order": 5
  },
  {
    "key": "declaratorios:06:registro-de-corte-de-floresta-de-produo-rcfp",
    "label": "Registro de Corte de Floresta de Produção -RCFP",
    "categoryId": "declaratorios",
    "category": "Declaratórios",
    "rowIndex": 9,
    "order": 6
  },
  {
    "key": "declaratorios:07:autorizao-por-procedimento-especial-de-licenciamento-ape",
    "label": "Autorização por Procedimento Especial de Licenciamento -APE",
    "categoryId": "declaratorios",
    "category": "Declaratórios",
    "rowIndex": 10,
    "order": 7
  },
  {
    "key": "declaratorios:08:reposio-florestal",
    "label": "REPOSIÇÃO FLORESTAL",
    "categoryId": "declaratorios",
    "category": "Declaratórios",
    "rowIndex": 11,
    "order": 8
  },
  {
    "key": "declaratorios:09:dispensa-de-licenciamento-ambiental-dla",
    "label": "Dispensa de Licenciamento Ambiental - DLA",
    "categoryId": "declaratorios",
    "category": "Declaratórios",
    "rowIndex": 12,
    "order": 9
  }
];

export const SEIA_V2_ATO_BY_KEY: Record<string, SeiaV2AtoItem> = Object.fromEntries(
  SEIA_V2_ATOS.map((item) => [item.key, item])
);

export const SEIA_V2_ATO_OPTIONS: SelectOption[] = SEIA_V2_ATOS.map((item) => ({
  value: item.key,
  label: item.label,
  group: item.category,
}));
