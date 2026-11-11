export const ARTIGO_254_INTRO = 'toda ação ou omissão, voluntária ou involuntária, que viole as regras jurídicas de uso, gozo, promoção, proteção e recuperação do meio ambiente e resulte em:';

export const CLAUSES: Record<string, string[]> = {
  '254': [
    'I - risco de poluição ou degradação;',
    'II - efetiva poluição ou degradação ambiental;',
    'III - emissão, lançamento ou liberação de efluentes líquidos, gasosos ou resíduos sólidos em desacordo com os padrões estabelecidos ou capaz de ultrapassar padrões de qualidade ambiental.',
    'I — risco de poluição ou degradação do meio ambiente;',
    'II — efetiva poluição ou degradação ambiental;',
    'III — emissão, lançamento ou liberação de efluentes líquidos, gasosos ou resíduos sólidos em desacordo com os padrões estabelecidos, e/ou que tornem ou possam tornar ultrapassados os padrões de qualidade ambiental.'
  ],
  '254pu': [
    'I - ausência ou desacordo de licenças;',
    'II - descumprimento de normas;',
    'III - condicionantes;',
    'IV - TCRA;',
    'V - termo de compromisso;',
    'VI - determinações ambientais;',
    'VII - embaraço à fiscalização;',
    'VIII - inobservância da legislação;',
    'IX - informação falsa ou omitida;',
    'X - irregularidade cadastral;',
    'XI - falta de registro no SEIA.',
    'I — executar obras, instalar, implantar, alterar, testar ou operar equipamentos ou empreendimentos, bem como exercer atividades ou explorar recursos naturais sem as necessárias anuências, autorizações, licenças ambientais ou registros, ou em desacordo com eles;',
    'II — inobservar ou deixar de cumprir normas regulamentares e exigências técnicas ou administrativas dos órgãos executores do SISEMA, SEGREH ou CEPRAM;',
    'III — descumprir condicionantes ou prazos de notificações, anuências, autorizações, licenças ou autos de infração;',
    'IV — descumprir compromissos do TCRA;',
    'V — descumprir obrigações, condições ou prazos de termo de compromisso com o INEMA;',
    'VI — deixar de atender determinação dos órgãos executores do SISEMA ou CEPRAM, inclusive quanto a planos de controle, medidas mitigadoras ou monitoramento;',
    'VII — impedir, dificultar ou causar embaraço à fiscalização;',
    'VIII — inobservar a legislação de controle ambiental;',
    'IX — prestar informação falsa, adulterar dados técnicos ou deixar de apresentá-los no prazo;',
    'X — falta ou irregularidade de inscrição em cadastros ambientais;',
    'XI — falta de registro nos cadastros que compõem o SEIA, quando legalmente exigido.'
  ],
  '255': [
    'I - captação ou uso sem outorga;',
    'II - poços;',
    'III - obras que afetem recursos hídricos;',
    'IV - fraude de medições;',
    'V - interferência em corpos hídricos;',
    'VI - infração à legislação hídrica;',
    'VII - lançamento sem outorga.',
    'I — captar, derivar ou utilizar recursos hídricos sem outorga, quando exigível, ou em desacordo com suas condições;',
    'II — perfurar poços sem manifestação prévia do órgão gestor ou operá-los sem outorga;',
    'III — realizar atividades, serviços ou obras sem outorga, ou em desacordo com ela, que possam afetar corpos hídricos, aquíferos ou o regime das águas;',
    'IV — fraudar medições dos volumes utilizados ou declarar valores divergentes;',
    'V — interferir em leitos e corpos hídricos para extração mineral ou de materiais sem autorização;',
    'VI — infringir a Lei, suas disposições regulamentares, instruções ou procedimentos dos órgãos competentes;',
    'VII — lançar esgotos, despejos ou resíduos sólidos, líquidos ou gasosos em corpos hídricos sem a respectiva outorga.'
  ],
};

export const ESTADUAL_ARTIGOS = [
  { value: '254', label: 'Art. 254 — Ação ou omissão com poluição ou degradação' },
  { value: '254pu', label: 'Art. 254, Parágrafo Único — Infrações administrativas gerais e cadastrais' },
  { value: '255', label: 'Art. 255 — Infrações ao regime de recursos hídricos e outorga' }
];

export const FEDERAL_NOTICE = 'Catálogo federal completo pendente de fornecimento. Nenhum enquadramento legal foi inventado; assinatura indisponível nesta fonte conforme RN015/RN035.';

export const articleText = (article: string) => {
  const heading = article === '254' ? `Art. 254 — ${ARTIGO_254_INTRO}` : article === '254pu' ? 'Art. 254, Parágrafo Único' : article === '255' ? 'Art. 255' : '';
  return heading && CLAUSES[article] ? `${heading}\n${CLAUSES[article].slice(0, 3).join('\n')}` : '';
};

export const CRITERIOS_250 = [
 'I — espontânea contenção, redução ou reparação da degradação ambiental pelo infrator',
 'II — ato costumeiro de população tradicional à qual pertença o infrator',
 'III — não ter cometido infração anteriormente', 'IV — baixo grau de escolaridade do infrator',
 'V — colaboração com os técnicos encarregados da fiscalização e do controle ambiental',
 'VI — comunicação imediata do infrator às autoridades competentes'
];
export const CRITERIOS_251 = [
 'I — infração à noite, em domingos, feriados ou local de difícil acesso e carente de infraestrutura',
 'II — infração em Unidade de Conservação ou área de preservação permanente', 'III — infração que atingiu propriedade de terceiro',
 'IV — danos em bens materiais', 'V — reincidência ou infração continuada', 'VI — tentativa dolosa de eximir-se da responsabilidade',
 'VII — ato cometido para obter vantagem pecuniária ou coagindo terceiro para execução material',
 'VIII — adulteração de análises e resultados que prejudique a avaliação dos níveis de emissão',
 'IX — atingimento de espécies nativas raras, endêmicas, vulneráveis, de importância econômica ou ameaçadas',
 'X — necessidade de evacuar a população, ainda que momentaneamente', 'XI — exposição da saúde pública ou do meio ambiente a perigo',
 'XII — tornar área urbana ou rural imprópria para ocupação humana', 'XIII — danos permanentes ao meio ambiente ou à saúde humana'
];
export const PENALIDADES: Record<string, string[]> = {
 leve: ['Advertência','Multa'],
 grave: ['Advertência','Multa','Embargo Temporário','Destruição de fornos para produção de carvão vegetal','Interdição Temporária','Apreensão'],
 gravissima: ['Advertência','Multa','Embargo Temporário','Embargo Definitivo','Demolição','Interdição Temporária','Interdição Definitiva']
};
