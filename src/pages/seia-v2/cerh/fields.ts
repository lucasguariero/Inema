import { purposeKey } from './administration';
import type { Fields, Identification, PointData, UseType } from './types';
import { bodyTypes, captureSituations, municipalities, otherUses, providers, productionUnits, services, situations, works } from './catalogs';
export interface FieldSpec {
  key: string; label: string; kind?: 'number' | 'date' | 'textarea' | 'select' | 'radio' | 'multi';
  required?: boolean; options?: string[]; unit?: string; positive?: boolean; integer?: boolean;
  min?: number; max?: number; hint?: string;
  mask?: 'cpf' | 'cnpj' | 'phone' | 'cep';
}
export function maskValue(value: string, mask: NonNullable<FieldSpec['mask']>) {
  const digits = value.replace(/\D/g, '');
  const pattern = mask === 'cpf' ? '###.###.###-##' : mask === 'cnpj' ? '##.###.###/####-##' : mask === 'cep' ? '#####-###' : digits.length > 10 ? '(##) #####-####' : '(##) ####-####';
  let index = 0, result = '';
  for (const character of pattern) {
    if (index >= digits.length) break;
    result += character === '#' ? digits[index++] : character;
  }
  return result;
}
// Identity is not the venture holder or the optional contact for the application.
export function applicantDetails(i: Identification) {
  return i.role === 'Requerente'
    ? { name: i.actorName, document: i.actorDocument, address: i.actorAddress, email: i.actorEmail }
    : { name: i.representedName, document: i.representedDocument, address: i.representedAddress, email: i.representedEmail };
}
export const str = (data: Fields, key: string): string => typeof data[key] === 'string' ? data[key] : '';
export const list = (data: Fields, key: string): string[] => Array.isArray(data[key]) ? data[key] : [];
const text = (key: string, label: string, required = true): FieldSpec => ({ key, label, required });
const number = (key: string, label: string, unit?: string, required = true, positive = false): FieldSpec => ({ key, label, kind: 'number', unit, required, positive });
const select = (key: string, label: string, options: string[], required = true): FieldSpec => ({ key, label, kind: 'select', options, required });
const yesNo = (key: string, label: string): FieldSpec => ({ key, label, kind: 'radio', options: ['Sim', 'Não'], required: true });
export function pumpFields(t: Fields): FieldSpec[] {
  return [yesNo('pump', 'Utiliza bomba?'), ...(t.pump === 'Sim' ? [number('pumpFlow', 'Vazão nominal da bomba', 'm³/h'), number('pumpHead', 'Altura manométrica', 'm.c.a.'), number('pumpPower', 'Potência do motor', 'cv'), select('pumpType', 'Tipo da bomba', ['Submersa', 'Centrífuga'])] : t.pump === 'Não' ? [select('noPump', 'Forma de captação sem bombeamento', ['Por gravidade — tubulação', 'Por gravidade — canal de derivação', 'Outra forma sem bombeamento']), ...(t.noPump === 'Outra forma sem bombeamento' ? [{ ...text('noPumpDescription', 'Descrição da forma de captação'), kind: 'textarea' as const }] : [])] : [])];
}
export function barragemFields(t: Fields): FieldSpec[] {
  return [{ ...number('snisb', 'Código SNISB', undefined, false), integer: true }, text('damName', 'Nome da barragem'), select('damType', 'Tipo de barramento', ['Barramento de regularização de vazão', 'Barramento de regularização de nível']), select('situation', 'Situação da barragem', situations), number('height', 'Altura máxima da barragem', 'm', true, true), number('volume', 'Volume máximo do reservatório', 'm³', true, true), number('guaranteedFlow', 'Vazão regularizada com 90% de garantia', 'm³/dia', false, true)];
}
export function intervencaoFields(t: Fields): FieldSpec[] {
  const hydraulic = t.category === 'Obras Hidráulicas';
  const hydro = hydraulic && ['Desvio', 'Retificação/Canalização'].includes(str(t, 'work'));
  return [select('category', 'Tipo de intervenção', ['Obras Hidráulicas', 'Serviços', 'Aquicultura em tanque rede']), select('situation', 'Situação da intervenção', situations),
    ...(hydraulic ? [select('work', 'Obra hidráulica', works), ...(t.work === 'Outros' ? [{ ...text('workDescription', 'Descrição da obra'), kind: 'textarea' as const }] : [])] : []),
    ...(t.category === 'Serviços' ? [select('service', 'Serviços', services), ...(t.service === services[2] ? [{ ...text('serviceDescription', 'Descrição'), kind: 'textarea' as const }] : [])] : []),
    ...(hydro ? [yesNo('pch', 'Faz Aproveitamento Hidrelétrico em PCH?'), number('power', 'Potência Instalada Total', 'MW'), yesNo('operating', 'Está em Operação?'), ...(t.operating === 'Sim' ? [{ ...text('startDate', 'Data de Início da Operação'), kind: 'date' as const }, number('energy', 'Produção Anual Efetivamente Verificada', 'MWh')] : [])] : []),
    ...['quantity', 'quality', 'waterRegime'].map((key, i): FieldSpec => ({ key, label: ['A intervenção altera a quantidade de água?', 'A intervenção altera a qualidade da água?', 'A intervenção altera o regime das águas?'][i], kind: 'radio', options: ['Sim', 'Não', 'Não sei informar'], required: true }))];
}
export function superficialFields(t: Fields): FieldSpec[] {
  return [yesNo('reservoir', 'Captação em reservatório de barragem?'), ...(t.reservoir === 'Sim' ? [text('damName', 'Nome da barragem')] : []), select('situation', 'Situação da captação', captureSituations), { ...text('startDate', 'Data de início da captação'), kind: 'date' }, ...pumpFields(t)];
}
export function subterraneaFields(t: Fields): FieldSpec[] {
  return [text('aquifer', 'Sistema Aquífero', false), select('nature', 'Natureza do poço', ['Poço Tubular', 'Poço Escavado']), select('situation', 'Situação da captação', captureSituations), { ...text('startDate', 'Data de início da captação'), kind: 'date' }, number('depth', 'Profundidade', 'm'), number('testFlow', 'Vazão de teste', 'm³/h'), number('staticLevel', 'Nível estático', 'm'), number('dynamicLevel', 'Nível dinâmico', 'm'), ...(t.nature === 'Poço Tubular' ? [{ ...text('appo', 'Informações APPO', false), hint: 'Digite o número APPO' }] : []), ...pumpFields(t)];
}
export function efluenteFields(t: Fields): FieldSpec[] {
  const origins = list(t, 'origins');
  return [select('situation', 'Situação da interferência', situations), { ...text('startDate', 'Data de início do lançamento'), kind: 'date' },
    ...(origins.includes('Esgotamento Sanitário (Abastecimento Público)') ? [select('provider', 'Tipo de prestador', providers)] : []),
    ...(origins.includes('Outros') ? [select('otherUse', 'Outros usos', otherUses), ...(t.otherUse === 'Outro' ? [text('otherTitle', 'Título'), { ...text('otherDescription', 'Descrição'), kind: 'textarea' as const }] : [])] : []),
    yesNo('treated', 'Antes do lançamento, o efluente recebeu tratamento?'), ...(t.treated === 'Sim' ? [select('treatment', 'Tratamento do efluente', ['Preliminar', 'Primário', 'Secundário', 'Terciário'])] : []),
    number('rawDbo', 'DBO bruto (5 dias a 20 °C)', 'mg/L', true, true), number('rawColiform', 'Coliformes termotolerantes bruto', 'UFC/100mL', true, true),
    ...(t.treated === 'Sim' ? [{ ...number('treatedDbo', 'DBO tratado', 'mg/L'), min: 0 }, { ...number('treatedColiform', 'Coliformes termotolerantes tratado', 'UFC/100mL'), min: 0 }] : [])];
}
export const technicalFields = (type: UseType, t: Fields) => ({ BAR: barragemFields, INT: intervencaoFields, SUP: superficialFields, SUB: subterraneaFields, EFL: efluenteFields })[type](t);
export function purposeFields(type: UseType, purpose: string, data: Fields): FieldSpec[] {
  switch (purposeKey(purpose)) {
    case 'Abastecimento público': return [select('provider', 'Tipo de prestador', providers), number('loss', 'Índice de perda', '%'), yesNo('inconsistent', 'Inconsistente?'), { ...number('population', 'População atendida'), integer: true }, { key: 'municipalities', label: 'Municípios atendidos', kind: 'multi', options: municipalities, required: true }];
    case 'Abastecimento industrial': return [text('product', 'Produto'), number('consumption', 'Consumo de água por unidade de produto industrializado', 'm³/dia'), number('daily', 'Produção diária'), number('annual', 'Produção anual'), select('unit', 'Unidade de produção', productionUnits)];
    case 'Mineração': return [text('product', 'Produto'), number('consumption', 'Consumo de água por unidade de produto', 'm³/dia'), number('monthly', 'Consumo mensal'), number('annual', 'Consumo anual'), select('unit', 'Unidade', productionUnits)];
    case 'Mineração – Extração de Areia/Cascalho em leito de rio': return [number('production', 'Produção média mensal', 'm³'), select('ratio', 'Proporção de água na polpa', ['1', '2', '3', '4']), number('volume', 'Volume médio de água', 'm³'), number('moisture', 'Umidade', '%'), number('maximum', 'Produção máxima mensal', 'm³/mês')];
    case 'Termoelétrica': return [text('fuel', 'Combustível principal'), number('power', 'Potência instalada', 'MW'), number('energy', 'Produção mensal de energia', 'MWh'), number('consumption', 'Estimativa de consumo de água', 'm³/mês')];
    case 'Irrigação': return [number('area', 'Área irrigada', 'ha'), text('crop', 'Tipo de cultura'), ...(list(data, 'systems').includes('Outros') ? [text('otherTitle', 'Título — outro sistema'), { ...text('otherDescription', 'Descrição — outro sistema'), kind: 'textarea' as const }] : [])];
    case 'Transposição': return [select('purpose', 'Finalidade da transposição', ['Abastecimento Público', 'Agropecuário', 'Irrigação', 'Aquicultura', 'Industrial', 'Outros']), ...(data.purpose === 'Outros' ? [text('otherTitle', 'Título'), { ...text('otherDescription', 'Descrição'), kind: 'textarea' as const }] : [])];
    case 'Outras': return list(data, 'uses').includes('Outro') ? [text('otherTitle', 'Título'), { ...text('otherDescription', 'Descrição'), kind: 'textarea' }] : [];
    case 'Aproveitamento Hidrelétrico': return type === 'BAR' ? [select('hydroType', 'Tipo de aproveitamento', ["Fio D'água", 'Regularização Diária', 'Regularização Mensal/Anual']), yesNo('diversion', 'Faz desvio de rio?'), ...(data.diversion === 'Sim' ? [number('length', 'Extensão do trecho', 'm', true, true), number('reducedFlow', 'Vazão do trecho reduzido', 'm³/dia', true, true)] : []), yesNo('pch', 'PCH?'), ...(data.pch === 'Sim' ? [number('power', 'Potência Instalada Total', 'MW', true, true)] : []), yesNo('operating', 'Está em Operação?'), ...(data.operating === 'Sim' ? [{ ...text('startDate', 'Data de Início da Operação'), kind: 'date' as const }, number('energy', 'Produção Anual Efetivamente Verificada', 'MWh', true, true)] : [])] : [number('energy', 'Produção Anual Efetivamente Verificada', 'MWh', false)];
    default: return [];
  }
}
export function activeData(type: UseType, data: PointData): PointData {
  const technical = Object.fromEntries(technicalFields(type, data.technical).map(f => [f.key, data.technical[f.key] ?? '']));
  if (type === 'EFL') technical.origins = list(data.technical, 'origins');
  const purposeData: Record<string, Fields> = {};
  for (const purpose of data.purposes) {
    const values = data.purposeData[purpose] || {};
    purposeData[purpose] = Object.fromEntries(purposeFields(type, purpose, values).map(f => [f.key, values[f.key] ?? '']));
    if (purposeKey(purpose) === 'Irrigação') purposeData[purpose].systems = list(values, 'systems');
    if (purposeKey(purpose) === 'Outras') purposeData[purpose].uses = list(values, 'uses');
  }
  return { ...structuredClone(data), location: { ...data.location, datum: 'SIRGAS 2000' }, technical, purposeData, animals: data.purposes.some(p => purposeKey(p) === 'Dessedentação animal') ? data.animals : [], appoFile: type === 'SUB' && data.technical.nature === 'Poço Tubular' ? data.appoFile : undefined };
}
