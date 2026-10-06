import { diasEmAberto, type GuiaPauta, type RegistroPauta, type StatusRegistro } from '@/data/pautaGestorMock';
import proj4 from 'proj4';

export const MSG = {
  1: 'Nenhum registro foi encontrado para os critérios informados.',
  2: 'Não foi possível consultar os registros. Os filtros foram mantidos para uma nova tentativa.',
  3: 'Você não possui permissão para realizar esta ação.',
  4: 'Não há dados disponíveis para esta guia.',
  5: 'Informe a data inicial e a data final. A data final não pode ser anterior à data inicial.',
  6: 'Informe uma coordenada válida para o formato selecionado.',
  7: 'Arquivo adicionado com sucesso.',
  8: 'Não foi possível adicionar o arquivo. Verifique o arquivo e tente novamente.',
  9: 'Selecione o motivo e informe a justificativa do arquivamento.',
  10: 'Descreva o motivo do arquivamento ao selecionar Outros.',
  11: 'Deseja arquivar este registro?',
  12: 'Registro arquivado com sucesso.',
  13: 'Não foi possível arquivar o registro. Tente novamente.',
  14: 'Registro encaminhado com sucesso.',
  15: 'Não foi possível encaminhar o registro. Tente novamente.',
  16: 'Deseja anexar o item selecionado a este registro?',
  17: 'Item anexado com sucesso.',
  18: 'Não foi possível anexar o item. Nenhuma relação foi criada.',
  19: 'Deseja desanexar os registros relacionados?',
  20: 'Informe a justificativa para desanexar os registros.',
  21: 'Registros desanexados e devolvidos à Pauta do Gestor – Registros para análise.',
  22: 'Não foi possível desanexar os registros. A relação foi mantida.',
  23: 'Processo formado com sucesso.',
  24: 'Ofício gerado com sucesso.',
  25: 'Não foi possível gerar o PDF do registro. Tente novamente.',
  26: 'Deseja converter este registro para {tipoDestino}?',
  27: 'Registro convertido para {tipoDestino} com sucesso.',
  28: 'Comentário adicionado com sucesso.',
  29: 'Eixo temático alterado com sucesso.',
  30: 'O registro foi atualizado por outro usuário. Atualize a consulta e tente novamente.',
  31: 'Não foi possível concluir a ação. Nenhuma alteração foi realizada.',
  32: 'O arquivo selecionado possui formato não permitido.',
  33: 'Não foi possível abrir as informações geoespaciais porque o registro não possui coordenada nem município informado.',
  34: 'Não foi possível acessar o GeoBahia. Tente novamente.',
} as const;
export const ORIGENS = ['Call Center', 'Correspondência', 'E-mail', 'Ofício', 'Presencial', 'Ouvidoria', 'SEI', 'Telefone'];
export const ORIGENS_COM_SETOR = ['Call Center', 'E-mail', 'Ofício', 'Presencial', 'SEI', 'Telefone'];
export const EIXOS: Record<string, string[]> = {
  Saneamento: ['Lixão', 'Esgoto doméstico'], Indústria: ['Resíduos Sólidos', 'Efluentes', 'Poluição do Ar'],
  Mineração: ['Garimpo', 'Extração de Gemas'], 'Recursos Hídricos': ['Rios', 'Lagos', 'Lagoas', 'Poços'],
  'Fauna Silvestre': ['Caça', 'Tráfico', 'Pesca predatória'], 'Vegetação nativa': ['Desmatamento', 'Incêndio'],
};
export const EMERGENCIAS = ['Acidente no transporte rodoviário de produtos químicos', 'Acidente em via férrea', 'Acidente industrial em planta química ou petroquímica', 'Incidente no modal aquaviário ou terminal marítimo', 'Lançamento ou descarte irregular de efluentes ou produtos químicos', 'Vazamento em sistema subterrâneo de armazenamento de combustíveis', 'Ocorrência com produto químico perigoso em ETA/ETE', 'Efluente de barragem de rejeitos', 'Efluente de barragem de aterro industrial ou sanitário', 'Ruptura ou falha em sistema de contenção', 'Mortandade de peixes ou fauna aquática por contaminação química', 'Pluma de contaminação', 'Mancha de origem desconhecida', 'Afloramento de contaminantes', 'Outros'];
// Mesmo catálogo utilizado no protótipo de Emergência Interna; não é cadastro corporativo.
export const AREAS = ['Área Urbana / Residencial', 'Área Rural / Povoado', 'Recurso Hídrico / Manancial', 'Rodovia / Faixa de Domínio', 'Unidade de Conservação (UC)', 'Comunidade Tradicional'];
export const STATUS: StatusRegistro[] = ['Anexado', 'Arquivado', 'Encaminhado', 'Processo formado', 'Registrado', 'Relacionado', 'Em Análise Técnica', 'Ofício Gerado'];
export type GrupoFiltro = 'dados' | 'localizacao' | 'periodo' | 'classificacao';
export interface FiltrosPauta {
  origem: string; orgao: string; setor: string; numero: string; palavra: string; demandante: string;
  municipio: string; formato: string; coordenada: string; area: string; uc: string;
  inicial: string; final: string; status: string; dias: string; eixo: string; subitem: string; emergencia: string;
}
export const FILTROS_VAZIOS: FiltrosPauta = { origem: '', orgao: '', setor: '', numero: '', palavra: '', demandante: '', municipio: '', formato: 'Grau Decimal', coordenada: '', area: '', uc: '', inicial: '', final: '', status: '', dias: '', eixo: '', subitem: '', emergencia: '' };
const CAMPOS_GRUPOS: Record<GrupoFiltro, (keyof FiltrosPauta)[]> = {
  dados: ['origem', 'orgao', 'setor', 'numero', 'palavra', 'demandante'],
  localizacao: ['municipio', 'coordenada', 'formato', 'area', 'uc'],
  periodo: ['inicial', 'final', 'status', 'dias'], classificacao: ['eixo', 'subitem', 'emergencia'],
};
export function aplicaEm(guia: GuiaPauta, tipos: string[]) { return guia === 'Todos' || tipos.includes(guia); }
export function limparInaplicaveis(f: FiltrosPauta, guia: GuiaPauta): FiltrosPauta {
  const next = { ...f };
  if (!aplicaEm(guia, ['RD', 'RE', 'RC'])) next.origem = next.orgao = next.setor = '';
  if (!aplicaEm(guia, ['RD', 'RE', 'RC', 'RT'])) next.demandante = '';
  if (!aplicaEm(guia, ['RD', 'RE', 'RA', 'RT'])) next.area = '';
  if (!aplicaEm(guia, ['RT', 'RD', 'RE'])) next.uc = '';
  if (!aplicaEm(guia, ['RD', 'RT', 'RC', 'RA'])) next.eixo = next.subitem = '';
  if (!aplicaEm(guia, ['RE'])) next.emergencia = '';
  if (!ORIGENS_COM_SETOR.includes(next.origem) || !aplicaEm(guia, ['RD'])) next.setor = '';
  return next;
}
export function filtrosDaConsulta(f: FiltrosPauta, abertos: Record<GrupoFiltro, boolean>): FiltrosPauta {
  const next = { ...FILTROS_VAZIOS };
  for (const grupo of Object.keys(CAMPOS_GRUPOS) as GrupoFiltro[]) if (abertos[grupo]) {
    for (const campo of CAMPOS_GRUPOS[grupo]) next[campo] = f[campo];
  }
  return next;
}
export function normalizar(texto: string) { return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
export function documentoValido(texto: string): boolean {
  const v = texto.replace(/\D/g, '');
  if (![11, 14].includes(v.length) || /^(\d)\1+$/.test(v)) return false;
  const digitos = [...v].map(Number);
  for (let passo = 0; passo < 2; passo++) {
    const n = v.length - 2 + passo;
    const pesos = v.length === 11 ? Array.from({ length: n }, (_, i) => n + 1 - i) : Array.from({ length: n }, (_, i) => ((n - i - 1) % 8) + 2);
    const resto = digitos.slice(0, n).reduce((s, d, i) => s + d * pesos[i], 0) % 11;
    if (digitos[n] !== (resto < 2 ? 0 : 11 - resto)) return false;
  }
  return true;
}
export function validarFiltros(f: FiltrosPauta): string {
  if ((!!f.inicial !== !!f.final) || (f.inicial && f.final < f.inicial)) return MSG[5];
  if (/^[\d.\-/\s]+$/.test(f.demandante) && !documentoValido(f.demandante)) return 'Informe um CPF ou CNPJ válido.';
  if (f.coordenada && !lerCoordenada(f.coordenada, f.formato)) return MSG[6];
  return '';
}
export function lerCoordenada(texto: string, formato: string): { lat: number; lng: number } | null {
  let lat: number, lng: number;
  if (formato === 'Grau Decimal') {
    const partes = texto.trim().includes(';') ? texto.trim().split(';').map(p => p.trim().replace(',', '.')) : texto.trim().split(/[,\s]+/);
    if (partes.length !== 2 || partes.some(p => !/^[+-]?\d+(?:\.\d+)?$/.test(p))) return null;
    [lat, lng] = partes.map(Number);
  } else if (formato === 'Grau/Minuto/Segundo') {
    const m = texto.trim().match(/^(\d{1,2})[°º]\s*(\d{1,2})['′]\s*(\d{1,2}(?:[.,]\d+)?)["″]\s*([NS])\s*[;,]?\s*(\d{1,3})[°º]\s*(\d{1,2})['′]\s*(\d{1,2}(?:[.,]\d+)?)["″]\s*([EWO])$/i);
    if (!m) return null;
    const nums = [m[1], m[2], m[3], m[5], m[6], m[7]].map(p => Number(p.replace(',', '.')));
    if ([nums[1], nums[2], nums[4], nums[5]].some(n => n >= 60)) return null;
    lat = (nums[0] + nums[1] / 60 + nums[2] / 3600) * (m[4].toUpperCase() === 'S' ? -1 : 1);
    lng = (nums[3] + nums[4] / 60 + nums[5] / 3600) * (['W', 'O'].includes(m[8].toUpperCase()) ? -1 : 1);
  } else if (formato === 'UTM') {
    // Referência WGS84 da fixture. O datum corporativo depende do contrato GeoBahia.
    const m = texto.trim().match(/^(\d{1,2})\s*([NS])\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/i);
    if (!m) return null;
    const zona = Number(m[1]), e = Number(m[3]), n = Number(m[4]);
    const sul = m[2].toUpperCase() === 'S';
    if (zona < 1 || zona > 60 || e < 100000 || e > 900000 || n < 0 || n > 10000000) return null;
    try { [lng, lat] = proj4(`+proj=utm +zone=${zona} ${sul ? '+south' : ''} +datum=WGS84 +units=m +no_defs`, 'EPSG:4326', [e, n]); }
    catch { return null; }
    if (lat < -80 || lat > 84 || (sul && lat > 0) || (!sul && lat < 0)) return null;
  } else return null;
  if (![lat, lng].every(Number.isFinite)) return null;
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
}
export function consultarPauta(registros: RegistroPauta[], guia: GuiaPauta, f: FiltrosPauta): RegistroPauta[] {
  const palavras = normalizar(f.palavra).match(/[\p{L}\p{N}]+/gu) || [];
  return registros.filter(r => {
    if (r.escopo !== 'DIFIS' || (guia !== 'Todos' && r.tipo !== guia)) return false;
    for (const campo of ['origem', 'orgao', 'setor', 'municipio', 'status', 'area', 'uc', 'eixo', 'subitem', 'emergencia'] as const) if (f[campo] && f[campo] !== r[campo]) return false;
    if (f.numero && normalizar(f.numero.trim()) !== normalizar(r.numero)) return false;
    if (f.inicial && (r.data < f.inicial || r.data > f.final)) return false;
    if (f.demandante && !normalizar(r.demandante).includes(normalizar(f.demandante.trim()))) return false;
    const texto = new Set(normalizar(`${r.descricao} ${r.endereco} ${r.bairro} ${r.demandante}`).match(/[\p{L}\p{N}]+/gu));
    if (!palavras.every(p => texto.has(p))) return false;
    if (f.dias) {
      const dias = diasEmAberto(r);
      if (f.dias === '0-89' ? dias >= 90 : f.dias === '90-149' ? dias < 90 || dias >= 150 : f.dias === '150-180' ? dias < 150 || dias > 180 : dias < 181) return false;
    }
    if (f.coordenada) {
      const p = lerCoordenada(f.coordenada, f.formato), c = r.coordenada || r.coordenadaDocumento;
      if (!p || !c) return false;
      const car = CARS_SIMULADOS.find(item => dentroPoligono(p, item.poligono));
      if (car ? !dentroPoligono(c, car.poligono) : Math.abs(p.lat - c.lat) > 0.00001 || Math.abs(p.lng - c.lng) > 0.00001) return false;
    }
    return true;
  });
}

export interface ProcessoPauta { id: string; numero: string; data: string; municipio: string; coordenada?: { lat: number; lng: number }; escopo: string; }
export const PROCESSOS_SIMULADOS: ProcessoPauta[] = [{ id: 'processo-simulado-1', numero: '2025.000041/INEMA/PROCESSO', data: '2025-11-10', municipio: 'Salvador', coordenada: { lat: -12.91, lng: -38.35 }, escopo: 'DIFIS' }];
export function duplicidades(registro: RegistroPauta, todos: RegistroPauta[], processos: ProcessoPauta[] = PROCESSOS_SIMULADOS): (RegistroPauta | ProcessoPauta)[] {
  const coincidem = (outro: RegistroPauta | ProcessoPauta) => {
    if (outro.id === registro.id || outro.id === registro.pai || outro.escopo !== registro.escopo) return false;
    if ('pai' in outro && registro.pai && outro.pai === registro.pai) return false;
    const coordenada = !!registro.coordenada && !!outro.coordenada && registro.coordenada.lat === outro.coordenada.lat && registro.coordenada.lng === outro.coordenada.lng;
    const municipio = !!registro.municipio && normalizar(outro.municipio) === normalizar(registro.municipio);
    if (!('tipo' in outro)) return coordenada || municipio;
    return coordenada || municipio || (['cep', 'endereco', 'bairro'] as const).some(c => registro[c].trim() && normalizar(registro[c]) === normalizar(outro[c]));
  };
  return [...todos, ...processos].filter(coincidem);
}

export type AcaoPauta = 'visualizar' | 'pdf' | 'geo' | 'arquivos' | 'encaminhar' | 'oficio' | 'eixo' | 'arquivar' | 'processo' | 'converter' | 'comentario' | 'desanexar' | 'anexar';
export const ACOES: Record<AcaoPauta, string> = { visualizar: 'Visualizar', pdf: 'Gerar PDF', geo: 'GeoBahia', arquivos: 'Arquivos', encaminhar: 'Encaminhar', oficio: 'Gerar Ofício', eixo: 'Alterar Eixo', arquivar: 'Arquivar', processo: 'Formar Processo', converter: 'Converter', comentario: 'Adicionar comentário', desanexar: 'Desanexar', anexar: 'Anexar' };
export interface SessaoPauta { interno: boolean; autenticado: boolean; escopo: string; usuario: string; perfil: string; gestor: boolean; permissoes: AcaoPauta[]; }
export const SESSAO_SIMULADA: SessaoPauta = { interno: true, autenticado: true, escopo: 'DIFIS', usuario: 'Lucas Manager (simulado)', perfil: 'Gestor DIFIS', gestor: true, permissoes: Object.keys(ACOES) as AcaoPauta[] };
export function acessoPauta(s: SessaoPauta) { return s.autenticado && s.interno && s.permissoes.includes('visualizar'); }
export function podeExecutar(s: SessaoPauta, r: RegistroPauta, acao: AcaoPauta): boolean {
  if (!acessoPauta(s) || s.escopo !== r.escopo || !s.permissoes.includes(acao)) return false;
  if (['visualizar', 'pdf', 'geo', 'comentario'].includes(acao)) return true;
  if (r.status === 'Arquivado') return false;
  if (acao === 'desanexar') return s.gestor && !!r.pai;
  if (acao === 'converter') return ['RD', 'RE', 'RT'].includes(r.tipo) && !r.pai && !r.processo;
  if (acao === 'processo') return !r.processo;
  if (acao === 'eixo') return ['RD', 'RT', 'RC', 'RA'].includes(r.tipo);
  if (acao === 'oficio') return r.status !== 'Ofício Gerado';
  return true;
}
export interface ComandoPauta {
  acao: AcaoPauta; id: string; versao: number; versoes: Record<string, number>;
  destino?: string; justificativa?: string; motivo?: string; descricaoMotivo?: string;
  eixo?: string; subitem?: string; comentario?: string;
  arquivos?: RegistroPauta['arquivos']; tipoDestino?: RegistroPauta['tipo'];
}
export function executarComando(registros: RegistroPauta[], comando: ComandoPauta, sessao: SessaoPauta, processos: ProcessoPauta[] = PROCESSOS_SIMULADOS): { registros: RegistroPauta[]; mensagem: string } {
  const registro = registros.find(r => r.id === comando.id);
  if (!registro || !podeExecutar(sessao, registro, comando.acao)) throw new Error(MSG[3]);
  if (registro.versao !== comando.versao) throw new Error(MSG[30]);
  const next = structuredClone(registros);
  const atual = next.find(r => r.id === comando.id)!;
  let envolvidos = [atual];
  let mensagem: string = MSG[31];
  if (comando.acao === 'anexar') {
    const alvo = duplicidades(registro, registros, processos).find(r => r.id === comando.destino);
    if (!alvo) throw new Error(MSG[18]);
    const grupo = (r: RegistroPauta) => next.filter(item => item.id === r.id || (!!r.pai && (item.pai === r.pai || item.id === r.pai)));
    envolvidos = [...new Map([...grupo(atual), ...('tipo' in alvo ? grupo(next.find(r => r.id === alvo.id)!) : [])].map(r => [r.id, r])).values()];
    const paisProcesso = [...new Set(envolvidos.map(r => r.processo).filter(Boolean))];
    if (!('tipo' in alvo)) paisProcesso.push(alvo.id);
    if (new Set(paisProcesso).size > 1) throw new Error(MSG[18]);
    const pai = paisProcesso[0] || [...envolvidos].sort((a, b) => a.data.localeCompare(b.data) || a.numero.localeCompare(b.numero))[0].id;
    for (const r of envolvidos) { r.pai = pai; r.processo = paisProcesso[0]; r.status = r.id === pai ? 'Relacionado' : 'Anexado'; }
    mensagem = MSG[17];
  } else if (comando.acao === 'desanexar') {
    if (!comando.justificativa?.trim()) throw new Error(MSG[20]);
    envolvidos = next.filter(r => r.pai === atual.pai || r.id === atual.pai);
    for (const r of envolvidos) { delete r.pai; delete r.processo; r.status = 'Em Análise Técnica'; }
    mensagem = MSG[21];
  } else if (comando.acao === 'arquivar') {
    if (!comando.motivo || !comando.justificativa?.trim()) throw new Error(MSG[9]);
    if (!MOTIVOS_ARQUIVAMENTO.includes(comando.motivo)) throw new Error(MSG[9]);
    if (comando.motivo === 'Outros' && !comando.descricaoMotivo?.trim()) throw new Error(MSG[10]);
    atual.status = 'Arquivado'; mensagem = MSG[12];
  } else if (comando.acao === 'encaminhar') {
    if (!DESTINOS_SIMULADOS.includes(comando.destino || '')) throw new Error(MSG[15]);
    atual.responsavel = comando.destino!; atual.status = 'Encaminhado'; mensagem = MSG[14];
  } else if (comando.acao === 'eixo') {
    if (!comando.eixo || !EIXOS[comando.eixo]?.includes(comando.subitem || '')) throw new Error(MSG[31]);
    atual.eixo = comando.eixo; atual.subitem = comando.subitem!; mensagem = MSG[29];
  } else if (comando.acao === 'comentario') {
    if (!comando.comentario?.trim()) throw new Error(MSG[31]);
    mensagem = MSG[28];
  } else if (comando.acao === 'arquivos') {
    if (!comando.arquivos?.length || comando.arquivos.some(f => !arquivoPermitido(f.nome))) throw new Error(MSG[32]);
    atual.arquivos.push(...comando.arquivos); mensagem = MSG[7];
  } else {
    // Documentos/fluxos sem contrato não geram identificadores ou modelos oficiais fictícios.
    throw new Error(MSG[31]);
  }
  for (const r of envolvidos) {
    const antes = registros.find(item => item.id === r.id)!;
    if (r.escopo !== sessao.escopo) throw new Error(MSG[3]);
    if (comando.versoes[r.id] !== antes.versao) throw new Error(MSG[30]);
    const resumo = (item: RegistroPauta) => `${item.status}; responsável: ${item.responsavel}; referência: ${item.pai || 'sem relação'}; eixo: ${item.eixo || '—'}/${item.subitem || '—'}; arquivos: ${item.arquivos.length}`;
    r.historico.push({ data: new Date().toISOString(), acao: ACOES[comando.acao], usuario: sessao.usuario, perfil: sessao.perfil, anterior: resumo(antes), novo: comando.comentario?.trim() || resumo(r), justificativa: [comando.motivo, comando.descricaoMotivo, comando.justificativa].filter(Boolean).join(' — ') || undefined, resultado: 'Sucesso' });
    r.versao++;
  }
  return { registros: next, mensagem };
}
export const MOTIVOS_ARQUIVAMENTO = ['Não é demanda ambiental', 'Informações insuficientes', 'Encaminhamento externo', 'Outros'];
// Destinos já usados nos protótipos DIFIS; somente demonstração autorizada, não cadastro oficial.
export const DESTINOS_SIMULADOS = ['DIFIS', 'Coordenação de Fiscalização', 'UR Metropolitana'];
export const EXTENSOES_ARQUIVOS = ['pdf', 'doc', 'docx', 'txt', 'jpeg', 'jpg', 'png', 'bmp', 'xls', 'xlsx', 'mp3', 'mp4', 'shp', 'shx', 'dbf', 'prj', 'kml', 'kmz', 'zip'];
export function arquivoPermitido(nome: string) { return EXTENSOES_ARQUIVOS.includes(nome.split('.').pop()?.toLowerCase() || ''); }

export const CARS_SIMULADOS = [{ id: 'SIMULADO-CAR-001', poligono: [[-38.351, -12.911], [-38.349, -12.911], [-38.349, -12.909], [-38.351, -12.909]] }];
export function dentroPoligono(p: { lat: number; lng: number }, poligono: number[][]): boolean {
  let dentro = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const [xi, yi] = poligono[i], [xj, yj] = poligono[j];
    const produto = (p.lng - xi) * (yj - yi) - (p.lat - yi) * (xj - xi);
    if (Math.abs(produto) < 1e-12 && p.lng >= Math.min(xi, xj) && p.lng <= Math.max(xi, xj) && p.lat >= Math.min(yi, yj) && p.lat <= Math.max(yi, yj)) return true;
    if ((yi > p.lat) !== (yj > p.lat) && p.lng < (xj - xi) * (p.lat - yi) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}
export function referenciaEspacial(r: RegistroPauta): { municipio: string; coordenada?: { lat: number; lng: number }; fonte: string } | null {
  if (r.coordenada) return { municipio: r.municipio, coordenada: r.coordenada, fonte: 'Registro' };
  if (r.coordenadaDocumento) return { municipio: r.municipio, coordenada: r.coordenadaDocumento, fonte: r.coordenadaDocumento.documento };
  return r.municipio ? { municipio: r.municipio, fonte: 'Município' } : null;
}
