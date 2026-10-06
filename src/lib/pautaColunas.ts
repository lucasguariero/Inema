import type { GuiaPauta, RegistroPauta } from '@/data/pautaGestorMock';
import { aplicaEm, duplicidades, podeExecutar, ACOES, type AcaoPauta, type SessaoPauta } from './pautaGestor';

export const COLUNAS = { tipo: 'Tipo do Registro', data: 'Data', numero: 'Nº do Registro', dias: 'Dias em Aberto', status: 'Status/Situação', municipio: 'Municípios', acoes: 'Ações', duplicados: 'Duplicados', eixo: 'Eixo Temático', demandante: 'Denunciante/Comunicante' };
export type Coluna = keyof typeof COLUNAS;
export const COLUNAS_PADRAO = Object.keys(COLUNAS).slice(0, 8) as Coluna[];
export function colunasAplicaveis(guia: GuiaPauta, sessao: SessaoPauta): Coluna[] {
  return (Object.keys(COLUNAS) as Coluna[]).filter(c => c === 'eixo' ? aplicaEm(guia, ['RD', 'RT', 'RC', 'RA']) : c === 'demandante' ? !!sessao.verDemandante && aplicaEm(guia, ['RD', 'RE', 'RC']) : true);
}
export function colunasObrigatorias(linhas: RegistroPauta[], registros: RegistroPauta[], sessao: SessaoPauta): Coluna[] {
  return [
    ...(linhas.some(r => (Object.keys(ACOES) as AcaoPauta[]).some(a => podeExecutar(sessao, r, a))) ? ['acoes' as const] : []),
    ...(linhas.some(r => r.pai || r.processo || duplicidades(r, registros, undefined, sessao).length) ? ['duplicados' as const] : []),
  ];
}
