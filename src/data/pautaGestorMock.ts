export const TIPOS_PAUTA = ['Todos', 'RD', 'RE', 'RA', 'RC', 'RT', 'OF', 'AC'] as const;
export type TipoRegistro = Exclude<typeof TIPOS_PAUTA[number], 'Todos'>;
export type GuiaPauta = typeof TIPOS_PAUTA[number];
export type StatusRegistro = 'Registrado' | 'Em Análise Técnica' | 'Encaminhado' | 'Arquivado' | 'Anexado' | 'Relacionado' | 'Processo formado' | 'Ofício Gerado';
export interface HistoricoPauta {
  data: string; acao: string; usuario: string; perfil: string;
  anterior?: string; novo?: string; justificativa?: string; resultado: string;
}
export interface ArquivoPauta { nome: string; tamanho: number; url?: string; }
export interface RegistroPauta {
  id: string; tipo: TipoRegistro; numero: string; data: string; status: StatusRegistro;
  municipio: string; origem: string; orgao: string; setor: string; demandante: string;
  eixo: string; subitem: string; emergencia: string; area: string; uc: string;
  descricao: string; endereco: string; bairro: string; cep: string;
  coordenada?: { lat: number; lng: number }; coordenadaDocumento?: { lat: number; lng: number; documento: string };
  arquivos: ArquivoPauta[]; historico: HistoricoPauta[]; responsavel: string;
  pai?: string; processo?: string; versao: number; escopo: string;
}
export function diasEmAberto(registro: Pick<RegistroPauta, 'data'>, hoje = new Date()): number {
  const agora = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.max(0, Math.floor((agora - Date.parse(`${registro.data}T00:00:00Z`)) / 86400000));
}
export function nivelSla(dias: number): 'gray' | 'warning' | 'orange' | 'danger' {
  return dias < 90 ? 'gray' : dias < 150 ? 'warning' : dias <= 180 ? 'orange' : 'danger';
}
// Fixture exclusivamente do protótipo. RA e AC deliberadamente não têm registros.
export function criarRegistrosPauta(hoje = new Date()): RegistroPauta[] {
  const idades = [0, 21, 89, 90, 95, 149, 150, 180, 181, 190, 205, 238, 30];
  const tipos: TipoRegistro[] = ['RD', 'RE', 'RT', 'RD', 'RC', 'RE', 'RD', 'RT', 'RE', 'RC', 'OF', 'RD', 'RT'];
  const cidades = ['Salvador', 'Camaçari', 'Ilhéus', 'Salvador', 'Feira de Santana', 'Candeias', 'Barreiras', 'Juazeiro', 'Camaçari', 'Ilhéus', 'Porto Seguro', 'Salvador', 'Juazeiro'];
  const descricoes = ['Descarte de resíduos sólidos em área urbana.', 'Vazamento de produto químico em rodovia.', 'Vistoria técnica de recurso hídrico.', 'Descarte de resíduos sólidos na mesma localidade.', 'Comunicação de lançamento de efluentes.', 'Ocorrência de pluma de contaminação.', 'Desmatamento de vegetação nativa.', 'Relatório técnico de poluição do ar.', 'Mortandade de peixes em corpo hídrico.', 'Comunicação de esgoto doméstico.', 'Ofício de acompanhamento de fiscalização.', 'Descarte de resíduos sólidos em área urbana.', 'Vistoria técnica de atividade industrial.'];
  return idades.map((idade, i) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - idade);
    const iso = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
    const tipo = tipos[i];
    return {
      id: `registro-${i + 1}`, tipo, numero: `${data.getFullYear()}.${String(i + 101).padStart(6, '0')}/INEMA/${tipo}`,
      data: iso, status: i === 10 ? 'Ofício Gerado' : i === 7 ? 'Encaminhado' : i % 3 === 0 ? 'Registrado' : 'Em Análise Técnica',
      municipio: cidades[i], origem: ['E-mail', 'Telefone', 'Ofício', 'Presencial'][i % 4],
      orgao: i % 4 === 2 ? 'Prefeitura Municipal' : 'INEMA', setor: i % 2 ? 'Coordenação de Fiscalização' : 'DIFIS',
      demandante: ['Ana Souza (dado simulado)', 'Carlos Santos (dado simulado)', 'Marina Costa (dado simulado)'][i % 3],
      eixo: tipo === 'RE' || tipo === 'OF' ? '' : i % 3 === 0 ? 'Saneamento' : 'Recursos Hídricos',
      subitem: tipo === 'RE' || tipo === 'OF' ? '' : i % 3 === 0 ? 'Lixão' : 'Rios',
      emergencia: tipo === 'RE' ? (i === 1 ? 'Acidente no transporte rodoviário de produtos químicos' : i === 5 ? 'Pluma de contaminação' : 'Mortandade de peixes ou fauna aquática por contaminação química') : '',
      area: i % 2 ? 'Recurso Hídrico / Manancial' : 'Área Urbana / Residencial',
      uc: i === 2 ? 'APA Lagoa Encantada' : '', descricao: descricoes[i],
      endereco: i === 0 || i === 3 || i === 11 ? 'Rua da Paz, local de descarte' : `Localidade de inspeção ${i + 1}`,
      bairro: i === 0 || i === 3 || i === 11 ? 'São Cristóvão' : '', cep: '',
      coordenada: i === 0 || i === 3 || i === 11 ? { lat: -12.91, lng: -38.35 } : i % 2 ? { lat: -12.7 - i / 100, lng: -38.4 - i / 100 } : undefined,
      coordenadaDocumento: i === 2 ? { lat: -14.62, lng: -39.05, documento: 'Nota Técnica' } : undefined,
      arquivos: [], historico: [{ data: `${iso}T12:00:00`, acao: 'Registro', usuario: 'Atendimento DIFIS (simulado)', perfil: 'Interno', novo: 'Registrado', resultado: 'Sucesso' }],
      responsavel: 'DIFIS', versao: 1, escopo: 'DIFIS',
    };
  });
}
