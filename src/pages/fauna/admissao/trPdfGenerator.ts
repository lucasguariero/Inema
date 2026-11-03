/**
 * INEMA / NOVO SEIA - GESTÃO DE FAUNA (DR008 / R2)
 * Gerador de Arquivo PDF Dedicado para o Termo de Recebimento (DOC001)
 * Modelo Oficial F-TEC-205-00 conforme Seção 6.2, Figura 2 e RNF-102.
 * 
 * Gera documento PDF vetorial autêntico (%PDF-1.4) em formato A4 Retrato,
 * com margens de 1,5 cm, Arial/Helvetica nos tamanhos normativos,
 * codificação WinAnsiEncoding para acentuação pt-BR, quebra de texto automática
 * sem truncamento, repetição de cabeçalho na paginação e assinaturas agrupadas.
 */

import { TermoRecebimentoItem, LinhaPreCadastroTR } from '@/types/faunaAdmissao';

export interface TextOp {
  type: 'text';
  text: string;
  x: number;
  y: number;
  size: number;
  bold?: boolean;
}

export interface RectOp {
  type: 'rect';
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: [number, number, number]; // RGB 0-1
  stroke?: [number, number, number];
}

export interface LineOp {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type DrawOp = TextOp | RectOp | LineOp;

// Dimensões A4 em pontos (72 pt/polegada)
// 1,5 cm = 15 mm = 15 / 25.4 * 72 = 42.5197 pt
export const PAGE_W = 595.28;
export const PAGE_H = 841.89;
export const MARGIN_LEFT = 42.52;
export const MARGIN_RIGHT = PAGE_W - 42.52; // 552.76 pt
export const CONTENT_W = MARGIN_RIGHT - MARGIN_LEFT; // 510.24 pt
export const MARGIN_TOP = 42.52;
export const MARGIN_BOTTOM = 42.52;
export const BOTTOM_LIMIT = PAGE_H - MARGIN_BOTTOM - 25; // Limite útil antes do rodapé

/**
 * Mapeia caracteres pt-BR Unicode para códigos octais em WinAnsiEncoding / PDF literal string
 */
export function escapePdfText(s: string): string {
  if (!s) return '';

  const charMap: Record<string, string> = {
    'á': '\\341', 'à': '\\340', 'â': '\\342', 'ã': '\\343', 'ä': '\\344',
    'é': '\\351', 'è': '\\350', 'ê': '\\352', 'ë': '\\353',
    'í': '\\355', 'ì': '\\354', 'î': '\\356', 'ï': '\\357',
    'ó': '\\363', 'ò': '\\362', 'ô': '\\364', 'õ': '\\365', 'ö': '\\366',
    'ú': '\\372', 'ù': '\\371', 'û': '\\373', 'ü': '\\374',
    'ç': '\\347',
    'Á': '\\301', 'À': '\\300', 'Â': '\\302', 'Ã': '\\303', 'Ä': '\\304',
    'É': '\\311', 'È': '\\310', 'Ê': '\\312', 'Ë': '\\313',
    'Í': '\\315', 'Ì': '\\314', 'Î': '\\316', 'Ï': '\\317',
    'Ó': '\\323', 'Ò': '\\322', 'Ô': '\\324', 'Õ': '\\325', 'Ö': '\\326',
    'Ú': '\\332', 'Ù': '\\331', 'Û': '\\333', 'Ü': '\\334',
    'Ç': '\\307',
    'º': '\\272', 'ª': '\\252',
    '–': '-', '—': '-', '·': '-',
    '“': '"', '”': '"', '‘': "'", '’': "'", '″': '"', '′': "'",
    '(': '\\(', ')': '\\)', '\\': '\\\\',
  };

  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (charMap[ch] !== undefined) {
      out += charMap[ch];
    } else {
      const code = ch.charCodeAt(0);
      if (code >= 32 && code <= 126) {
        out += ch;
      } else if (code > 126 && code <= 255) {
        out += '\\' + code.toString(8).padStart(3, '0');
      } else {
        out += ' ';
      }
    }
  }
  return out;
}

/**
 * Quebra texto em múltiplas linhas respeitando largura máxima de caracteres
 */
export function wrapText(text: string, maxCharsPerLine: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    if (!current) {
      current = w;
    } else if ((current + ' ' + w).length <= maxCharsPerLine) {
      current += ' ' + w;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Gera o plano completo de páginas vetoriais para o Termo de Recebimento DOC001
 * Conforme Modelo Padrão da Figura 2 e Especificação da Seção 6.2 do DR008 v1.2
 */
export function planTrDocument(
  termo: TermoRecebimentoItem,
  usuarioEmissao: string = 'Dra. Gabriela Santos - Matrícula 8841-2',
  dataHoraEmissao: string = new Date().toLocaleString('pt-BR')
): DrawOp[][] {
  const pages: DrawOp[][] = [];
  let currentPage: DrawOp[] = [];
  let currentY = MARGIN_TOP;

  const startNewPage = () => {
    currentPage = [];
    pages.push(currentPage);
    currentY = MARGIN_TOP;

    // Cabeçalho Oficial F-TEC-205-00 (Margens de 1,5 cm)
    // Caixa Externa do Cabeçalho
    currentPage.push({
      type: 'rect',
      x: MARGIN_LEFT,
      y: currentY,
      w: CONTENT_W,
      h: 56,
      stroke: [0.15, 0.15, 0.15],
    });

    // Espaço reservado para futura inserção da logomarca oficial (sem imagem substituta ou simulação gráfica)
    currentPage.push({
      type: 'rect',
      x: MARGIN_LEFT + 6,
      y: currentY + 6,
      w: 48,
      h: 44,
      stroke: [0.75, 0.75, 0.75],
    });

    // Título ao Centro: 12 pt no título (Seção 6.2)
    currentPage.push({
      type: 'text',
      text: 'GOVERNO DO ESTADO DA BAHIA',
      x: MARGIN_LEFT + 72,
      y: currentY + 16,
      size: 8,
      bold: true,
    });
    currentPage.push({
      type: 'text',
      text: 'INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS - INEMA',
      x: MARGIN_LEFT + 72,
      y: currentY + 27,
      size: 8,
    });
    currentPage.push({
      type: 'text',
      text: 'Termo de Recebimento de Animal Silvestre',
      x: MARGIN_LEFT + 72,
      y: currentY + 44,
      size: 12,
      bold: true,
    });

    // Nº do TR em Destaque à Direita (F-TEC-205-00)
    currentPage.push({
      type: 'rect',
      x: MARGIN_RIGHT - 120,
      y: currentY + 6,
      w: 114,
      h: 44,
      fill: [0.93, 0.93, 0.93],
      stroke: [0.3, 0.3, 0.3],
    });
    currentPage.push({
      type: 'text',
      text: 'Nº DO TR',
      x: MARGIN_RIGHT - 112,
      y: currentY + 18,
      size: 8,
      bold: true,
    });
    currentPage.push({
      type: 'text',
      text: termo.numeroTr || 'TR-000.000',
      x: MARGIN_RIGHT - 114,
      y: currentY + 36,
      size: 11,
      bold: true,
    });

    currentY += 62;
  };

  // Helper para desenhar faixa cinza de título de bloco (#D9D9D9)
  const drawBlockHeader = (titulo: string) => {
    // Verifica espaço na página
    if (currentY + 35 > BOTTOM_LIMIT) {
      startNewPage();
    }
    currentPage.push({
      type: 'rect',
      x: MARGIN_LEFT,
      y: currentY,
      w: CONTENT_W,
      h: 16,
      fill: [0.85, 0.85, 0.85], // #D9D9D9
      stroke: [0.25, 0.25, 0.25],
    });
    currentPage.push({
      type: 'text',
      text: titulo,
      x: MARGIN_LEFT + 6,
      y: currentY + 11.5,
      size: 10,
      bold: true,
    });
    currentY += 16;
  };

  // Inicia Página 1
  startNewPage();

  // -------------------------------------------------------------------------
  // 1. BLOCO DE IDENTIFICAÇÃO DA ENTRADA (Figura 2)
  // -------------------------------------------------------------------------
  drawBlockHeader('1. IDENTIFICAÇÃO DA ENTRADA');
  const hIdent = 38;
  currentPage.push({
    type: 'rect',
    x: MARGIN_LEFT,
    y: currentY,
    w: CONTENT_W,
    h: hIdent,
    stroke: [0.25, 0.25, 0.25],
  });

  currentPage.push({
    type: 'text',
    text: `DATA DO RECEBIMENTO: ${termo.dataRecebimento || '--/--/----'}`,
    x: MARGIN_LEFT + 6,
    y: currentY + 13,
    size: 9.5,
    bold: true,
  });
  currentPage.push({
    type: 'text',
    text: `HORA: ${termo.horaRecebimento || '--:--'}`,
    x: MARGIN_LEFT + 220,
    y: currentY + 13,
    size: 9.5,
    bold: true,
  });
  currentPage.push({
    type: 'text',
    text: `LOTE: ${termo.lote ? '(X) Sim   ( ) Nao' : '( ) Sim   (X) Nao'}`,
    x: MARGIN_LEFT + 340,
    y: currentY + 13,
    size: 9.5,
    bold: true,
  });

  currentPage.push({
    type: 'text',
    text: `RECEBIDO PELA UNIDADE: ${termo.unidadeNome || 'CETAS Salvador'} (${termo.unidadeSigla || 'CTS'})`,
    x: MARGIN_LEFT + 6,
    y: currentY + 29,
    size: 9.5,
  });
  currentPage.push({
    type: 'text',
    text: `QTD. TOTAL DE ANIMAIS: ${termo.quantidadeTotal || 0}`,
    x: MARGIN_LEFT + 340,
    y: currentY + 29,
    size: 9.5,
    bold: true,
  });
  currentY += hIdent + 4;

  // -------------------------------------------------------------------------
  // 2. BLOCO DE FATO GERADOR / PROCEDÊNCIA DE ADMISSÃO (Figura 2)
  // -------------------------------------------------------------------------
  drawBlockHeader('2. FATO GERADOR (PROCEDÊNCIA DE ADMISSÃO)');
  const hFato = 42;
  currentPage.push({
    type: 'rect',
    x: MARGIN_LEFT,
    y: currentY,
    w: CONTENT_W,
    h: hFato,
    stroke: [0.25, 0.25, 0.25],
  });

  const opEV = termo.fatoGerador === 'Entrega voluntária' ? '(X)' : '( )';
  const opAp = termo.fatoGerador === 'Apreensão' ? '(X)' : '( )';
  const opRes = termo.fatoGerador === 'Resgate' ? '(X)' : '( )';
  const opTrans = termo.fatoGerador === 'Transferência' ? '(X)' : '( )';
  const opTransInt = termo.fatoGerador === 'Transferência interestadual' ? '(X)' : '( )';

  currentPage.push({
    type: 'text',
    text: `${opEV} ENTREGA VOLUNTÁRIA     ${opAp} APREENSÃO     ${opRes} RESGATE     ${opTrans} TRANSFERÊNCIA     ${opTransInt} TRANSFERÊNCIA INTERESTADUAL`,
    x: MARGIN_LEFT + 6,
    y: currentY + 14,
    size: 8,
    bold: true,
  });

  const instInema = termo.instituicaoResponsavel === 'INEMA' ? '(X)' : '( )';
  const instOutras = termo.instituicaoResponsavel !== 'INEMA' ? '(X)' : '( )';
  const espOutras = termo.instituicaoEspecificar ? `: ${termo.instituicaoEspecificar}` : ': ______________';
  currentPage.push({
    type: 'text',
    text: `Instituição responsável:  ${instInema} INEMA   ${instOutras} OUTRAS${espOutras}`,
    x: MARGIN_LEFT + 6,
    y: currentY + 30,
    size: 8.5,
  });
  currentPage.push({
    type: 'text',
    text: `Órgão/autoridade de origem: ${termo.orgaoOrigem || '–'}`,
    x: MARGIN_LEFT + 280,
    y: currentY + 30,
    size: 8.5,
  });
  currentY += hFato + 4;

  // -------------------------------------------------------------------------
  // 3. BLOCO EM CASO DE APREENSÃO (Figura 2)
  // -------------------------------------------------------------------------
  drawBlockHeader('3. EM CASO DE APREENSÃO');
  const hAp = 40;
  currentPage.push({
    type: 'rect',
    x: MARGIN_LEFT,
    y: currentY,
    w: CONTENT_W,
    h: hAp,
    stroke: [0.25, 0.25, 0.25],
  });

  const isAp = termo.fatoGerador === 'Apreensão';
  const docTipo = isAp ? termo.documentoApreensaoTipo : undefined;
  const docNum = isAp && termo.documentoApreensaoNumero ? termo.documentoApreensaoNumero : '______________';

  const opAi = docTipo === 'Auto de Infração' ? '(X)' : '( )';
  const opTad = docTipo === 'Termo de Apreensão/Depósito' ? '(X)' : '( )';
  const opBo = docTipo === 'Boletim de Ocorrência' ? '(X)' : '( )';

  currentPage.push({
    type: 'text',
    text: `${opAi} Auto de Infração Nº: ${docTipo === 'Auto de Infração' ? docNum : '__________'}      ${opTad} Termo de Apreensão Nº: ${docTipo === 'Termo de Apreensão/Depósito' ? docNum : '__________'}      ${opBo} B.O. Nº: ${docTipo === 'Boletim de Ocorrência' ? docNum : '__________'}`,
    x: MARGIN_LEFT + 6,
    y: currentY + 13,
    size: 8,
  });

  const dataLav = isAp && termo.dataLavratura ? termo.dataLavratura : '__/__/____';
  const compAnex = isAp && termo.comprovanteAnexado ? '(X) Sim   ( ) Não' : '( ) Sim   (X) Não / Pendente';

  currentPage.push({
    type: 'text',
    text: `Data de Lavratura: ${dataLav}`,
    x: MARGIN_LEFT + 6,
    y: currentY + 28,
    size: 8.5,
  });
  currentPage.push({
    type: 'text',
    text: `Comprovante da apreensão anexado no sistema: ${compAnex}`,
    x: MARGIN_LEFT + 200,
    y: currentY + 28,
    size: 8.5,
  });
  currentY += hAp + 4;

  // -------------------------------------------------------------------------
  // 4. BLOCO DADOS DO AGENTE / INSTITUIÇÃO RESPONSÁVEL (Figura 2)
  // -------------------------------------------------------------------------
  drawBlockHeader('4. DADOS DO AGENTE / INSTITUIÇÃO RESPONSÁVEL PELA DESTINAÇÃO');
  const hAgente = 44;
  currentPage.push({
    type: 'rect',
    x: MARGIN_LEFT,
    y: currentY,
    w: CONTENT_W,
    h: hAgente,
    stroke: [0.25, 0.25, 0.25],
  });

  currentPage.push({
    type: 'text',
    text: `Nome / Razão Social: ${termo.agenteNomeRazaoSocial || '–'}`,
    x: MARGIN_LEFT + 6,
    y: currentY + 13,
    size: 8.5,
    bold: true,
  });
  currentPage.push({
    type: 'text',
    text: `RG / Matrícula: ${termo.agenteRgMatricula || '–'}`,
    x: MARGIN_LEFT + 280,
    y: currentY + 13,
    size: 8.5,
  });
  currentPage.push({
    type: 'text',
    text: `CPF / CNPJ: ${termo.agenteCpfCnpj || '–'}`,
    x: MARGIN_LEFT + 400,
    y: currentY + 13,
    size: 8.5,
  });

  currentPage.push({
    type: 'text',
    text: `Logradouro: ${termo.agenteLogradouro || '–'}`,
    x: MARGIN_LEFT + 6,
    y: currentY + 28,
    size: 8.5,
  });
  currentPage.push({
    type: 'text',
    text: `Município/UF: ${termo.agenteMunicipio || '–'} / ${termo.agenteUf || 'BA'}`,
    x: MARGIN_LEFT + 280,
    y: currentY + 28,
    size: 8.5,
  });
  currentPage.push({
    type: 'text',
    text: `CEP: ${termo.agenteCep || '–'}`,
    x: MARGIN_LEFT + 420,
    y: currentY + 28,
    size: 8.5,
  });
  currentY += hAgente + 4;

  // -------------------------------------------------------------------------
  // 5. BLOCO DADOS DO ENTREGADOR (QUANDO HOUVER) (Figura 2)
  // -------------------------------------------------------------------------
  drawBlockHeader('5. DADOS DO ENTREGADOR (QUANDO HOUVER)');
  const hEntregador = 22;
  currentPage.push({
    type: 'rect',
    x: MARGIN_LEFT,
    y: currentY,
    w: CONTENT_W,
    h: hEntregador,
    stroke: [0.25, 0.25, 0.25],
  });

  currentPage.push({
    type: 'text',
    text: `Nome: ${termo.entregadorNome || '–'}`,
    x: MARGIN_LEFT + 6,
    y: currentY + 14,
    size: 8.5,
  });
  currentPage.push({
    type: 'text',
    text: `Documento: ${termo.entregadorDocumento || '–'}`,
    x: MARGIN_LEFT + 280,
    y: currentY + 14,
    size: 8.5,
  });
  currentY += hEntregador + 4;

  // -------------------------------------------------------------------------
  // 6. BLOCO DADOS DO LOCAL DE ORIGEM DO(S) ANIMAL(IS) (Figura 2)
  // -------------------------------------------------------------------------
  drawBlockHeader('6. DADOS DO LOCAL DE ORIGEM DO(S) ANIMAL(IS)');
  const hOrigem = 24;
  currentPage.push({
    type: 'rect',
    x: MARGIN_LEFT,
    y: currentY,
    w: CONTENT_W,
    h: hOrigem,
    stroke: [0.25, 0.25, 0.25],
  });

  currentPage.push({
    type: 'text',
    text: `Logradouro: ${termo.localOrigemLogradouro || '–'}`,
    x: MARGIN_LEFT + 6,
    y: currentY + 15,
    size: 8.5,
  });
  currentPage.push({
    type: 'text',
    text: `Município/UF: ${termo.localOrigemMunicipio || '–'} / ${termo.localOrigemUf || 'BA'}`,
    x: MARGIN_LEFT + 280,
    y: currentY + 15,
    size: 8.5,
  });
  currentPage.push({
    type: 'text',
    text: `CEP: ${termo.localOrigemCep || '–'}`,
    x: MARGIN_LEFT + 420,
    y: currentY + 15,
    size: 8.5,
  });
  currentY += hOrigem + 4;

  // -------------------------------------------------------------------------
  // 7. BLOCO DADOS DO(S) ANIMAL(IS) – PRÉ-CADASTRO (Figura 2 & Seção 6.2)
  // Mínimo de 5 linhas; repetição de cabeçalho na quebra de página
  // -------------------------------------------------------------------------
  const renderTableHeader = () => {
    currentPage.push({
      type: 'rect',
      x: MARGIN_LEFT,
      y: currentY,
      w: CONTENT_W,
      h: 22,
      fill: [0.92, 0.92, 0.92],
      stroke: [0.25, 0.25, 0.25],
    });

    // Subdivisões do cabeçalho da tabela
    currentPage.push({ type: 'text', text: 'Qtd 1', x: MARGIN_LEFT + 2, y: currentY + 10, size: 7.5, bold: true });
    currentPage.push({ type: 'text', text: 'M | F | I', x: MARGIN_LEFT + 2, y: currentY + 18, size: 6.5, bold: true });

    currentPage.push({ type: 'text', text: 'Nome Científico', x: MARGIN_LEFT + 44, y: currentY + 14, size: 7.5, bold: true });
    currentPage.push({ type: 'text', text: 'Nome Popular', x: MARGIN_LEFT + 154, y: currentY + 14, size: 7.5, bold: true });
    currentPage.push({ type: 'text', text: 'Condição 2', x: MARGIN_LEFT + 242, y: currentY + 14, size: 7.5, bold: true });
    currentPage.push({ type: 'text', text: 'Tipo / Nº Marcação', x: MARGIN_LEFT + 292, y: currentY + 14, size: 7.5, bold: true });
    currentPage.push({ type: 'text', text: 'Origem 3', x: MARGIN_LEFT + 372, y: currentY + 14, size: 7.5, bold: true });
    currentPage.push({ type: 'text', text: 'Local Origem / Coordenadas', x: MARGIN_LEFT + 416, y: currentY + 14, size: 7.5, bold: true });

    currentY += 22;
  };

  drawBlockHeader('7. DADOS DO(S) ANIMAL(IS) – PRÉ-CADASTRO');
  renderTableHeader();

  // Lista de animais com mínimo de 5 linhas (Seção 6.2)
  const animaisRaw = termo.animais || [];
  const totalLinhas = Math.max(animaisRaw.length, 5);

  for (let idx = 0; idx < totalLinhas; idx++) {
    const item = animaisRaw[idx];

    // Calcula quebra de linha dos campos para evitar truncamento silencioso por .slice()
    const cientificoLines = item ? wrapText(item.especieNomeCientifico || '–', 22) : ['–'];
    const popularLines = item ? wrapText(item.especieNomePopular || '–', 18) : ['–'];
    const marcacaoLines = item ? wrapText(item.tipoNumeroMarcacao || '–', 16) : ['–'];
    const localLines = item ? wrapText(item.localOrigemPontoOuCoordenadas || '–', 18) : ['–'];

    const maxLines = Math.max(1, cientificoLines.length, popularLines.length, marcacaoLines.length, localLines.length);
    const rowH = item ? Math.max(16, 6 + maxLines * 9.5) : 16;

    // Verifica se a linha cabe na página útil
    if (currentY + rowH > BOTTOM_LIMIT) {
      startNewPage();
      drawBlockHeader('7. DADOS DO(S) ANIMAL(IS) – CONTINUAÇÃO');
      renderTableHeader();
    }

    currentPage.push({
      type: 'rect',
      x: MARGIN_LEFT,
      y: currentY,
      w: CONTENT_W,
      h: rowH,
      stroke: [0.35, 0.35, 0.35],
    });

    if (item) {
      // Quantidade: M / F / I
      const qtdText = termo.lote
        ? `0|0|${item.quantidadeTotal}`
        : `${item.quantidadeMacho || 0}|${item.quantidadeFemea || 0}|${item.quantidadeIndeterminado || 0}`;

      // Condição sigla: S, MF, D, O
      let condSigla = '–';
      if (item.condicaoAnimal === 'Saudável') condSigla = 'S';
      else if (item.condicaoAnimal === 'Mutilado/Ferido') condSigla = 'MF';
      else if (item.condicaoAnimal === 'Doente') condSigla = 'D';
      else if (item.condicaoAnimal === 'Óbito') condSigla = 'O';

      // Origem sigla: VL, CV
      let origSigla = '–';
      if (item.origemAnimal === 'Vida livre') origSigla = 'VL';
      else if (item.origemAnimal === 'Cativeiro') origSigla = 'CV';

      currentPage.push({ type: 'text', text: qtdText, x: MARGIN_LEFT + 3, y: currentY + 11, size: 7.5, bold: true });

      // Renderiza textos com quebra de linha sem perda de informação
      cientificoLines.forEach((linha, lIdx) => {
        currentPage.push({ type: 'text', text: linha, x: MARGIN_LEFT + 44, y: currentY + 10 + lIdx * 9, size: 7.5 });
      });

      popularLines.forEach((linha, lIdx) => {
        currentPage.push({ type: 'text', text: linha, x: MARGIN_LEFT + 154, y: currentY + 10 + lIdx * 9, size: 7.5 });
      });

      currentPage.push({ type: 'text', text: condSigla, x: MARGIN_LEFT + 258, y: currentY + 11, size: 7.5, bold: true });

      marcacaoLines.forEach((linha, lIdx) => {
        currentPage.push({ type: 'text', text: linha, x: MARGIN_LEFT + 292, y: currentY + 10 + lIdx * 9, size: 7 });
      });

      currentPage.push({ type: 'text', text: origSigla, x: MARGIN_LEFT + 386, y: currentY + 11, size: 7.5, bold: true });

      localLines.forEach((linha, lIdx) => {
        currentPage.push({ type: 'text', text: linha, x: MARGIN_LEFT + 416, y: currentY + 10 + lIdx * 9, size: 7 });
      });
    }

    currentY += rowH;
  }
  currentY += 4;

  // -------------------------------------------------------------------------
  // 8. BLOCO DE LEGENDAS (Figura 2)
  // -------------------------------------------------------------------------
  if (currentY + 36 > BOTTOM_LIMIT) {
    startNewPage();
  }
  currentPage.push({
    type: 'text',
    text: '1 - Sexo: M - Macho   F - Femea   I - Indeterminado (no cadastro em lote, a quantidade e impressa em I ate a triagem)',
    x: MARGIN_LEFT + 4,
    y: currentY + 8,
    size: 7,
  });
  currentPage.push({
    type: 'text',
    text: '2 - Condicao do animal: S - Saudavel   MF - Mutilado/Ferido   D - Doente   O - Obito',
    x: MARGIN_LEFT + 4,
    y: currentY + 17,
    size: 7,
  });
  currentPage.push({
    type: 'text',
    text: '3 - Origem do animal: VL - Vida Livre   CV - Cativeiro. Em caso de filhote informar no campo Observacoes.',
    x: MARGIN_LEFT + 4,
    y: currentY + 26,
    size: 7,
  });
  currentY += 32;

  // -------------------------------------------------------------------------
  // 9. BLOCO DE OBSERVAÇÕES (Com Quebra de Linha sem Truncamento)
  // -------------------------------------------------------------------------
  const obsTexto = termo.observacoes || 'Nenhuma observação complementar registrada no momento do recebimento.';
  // Cada linha de observação comporta aprox 110 caracteres
  const obsLinhas = wrapText(obsTexto, 105);
  const hObs = Math.max(28, 14 + obsLinhas.length * 11);

  if (currentY + hObs + 16 > BOTTOM_LIMIT) {
    startNewPage();
  }

  drawBlockHeader('8. OBSERVAÇÕES');
  currentPage.push({
    type: 'rect',
    x: MARGIN_LEFT,
    y: currentY,
    w: CONTENT_W,
    h: hObs,
    stroke: [0.25, 0.25, 0.25],
  });

  obsLinhas.forEach((linha, lIdx) => {
    currentPage.push({
      type: 'text',
      text: linha,
      x: MARGIN_LEFT + 6,
      y: currentY + 12 + lIdx * 11,
      size: 7.5,
    });
  });
  currentY += hObs + 6;

  // -------------------------------------------------------------------------
  // 10. BLOCO DE ASSINATURAS (Sempre na Última Página e Juntas - Seção 6.2)
  // -------------------------------------------------------------------------
  const hAssinaturas = 58;
  if (currentY + hAssinaturas + 30 > BOTTOM_LIMIT) {
    startNewPage();
  }

  drawBlockHeader('9. ASSINATURAS DE CONFORMIDADE E RECEBIMENTO');
  currentPage.push({
    type: 'rect',
    x: MARGIN_LEFT,
    y: currentY,
    w: CONTENT_W,
    h: hAssinaturas,
    stroke: [0.25, 0.25, 0.25],
  });

  const colMeio = MARGIN_LEFT + CONTENT_W / 2;

  // Linhas para assinatura física
  currentPage.push({
    type: 'line',
    x1: MARGIN_LEFT + 16,
    y1: currentY + 34,
    x2: colMeio - 16,
    y2: currentY + 34,
  });
  currentPage.push({
    type: 'line',
    x1: colMeio + 16,
    y1: currentY + 34,
    x2: MARGIN_RIGHT - 16,
    y2: currentY + 34,
  });

  // Assinatura do Responsável pela Destinação (Esquerda)
  currentPage.push({
    type: 'text',
    text: 'Assinatura do Responsavel pela Destinacao:',
    x: MARGIN_LEFT + 16,
    y: currentY + 14,
    size: 7.5,
    bold: true,
  });
  currentPage.push({
    type: 'text',
    text: termo.agenteNomeRazaoSocial || 'Responsavel pela Entrega/Destinacao',
    x: MARGIN_LEFT + 16,
    y: currentY + 44,
    size: 7.5,
  });
  currentPage.push({
    type: 'text',
    text: 'Assinatura Fisica / Carimbo',
    x: MARGIN_LEFT + 16,
    y: currentY + 52,
    size: 6.5,
  });

  // Assinatura do Responsável pelo Recebimento (Direita)
  currentPage.push({
    type: 'text',
    text: 'Assinatura do Responsavel pelo Recebimento:',
    x: colMeio + 16,
    y: currentY + 14,
    size: 7.5,
    bold: true,
  });
  currentPage.push({
    type: 'text',
    text: `${termo.recebedorNome || 'Servidor INEMA'} - ${termo.recebedorMatricula || 'Matr. INEMA'}`,
    x: colMeio + 16,
    y: currentY + 44,
    size: 7.5,
  });
  currentPage.push({
    type: 'text',
    text: 'Assinatura / Carimbo Funcional',
    x: colMeio + 16,
    y: currentY + 52,
    size: 6.5,
  });

  // -------------------------------------------------------------------------
  // 11. RODAPÉ INSTITUCIONAL (Em todas as páginas: "Página X de Y | F-TEC-205-00")
  // -------------------------------------------------------------------------
  const totalPages = pages.length;
  pages.forEach((p, pageIdx) => {
    p.push({
      type: 'line',
      x1: MARGIN_LEFT,
      y1: PAGE_H - MARGIN_BOTTOM - 10,
      x2: MARGIN_RIGHT,
      y2: PAGE_H - MARGIN_BOTTOM - 10,
    });
    p.push({
      type: 'text',
      text: `Termo de Recebimento de Animal Silvestre  |  Emitido em ${dataHoraEmissao} por ${usuarioEmissao}  |  Pagina ${pageIdx + 1} de ${totalPages}  |  F-TEC-205-00`,
      x: MARGIN_LEFT + 12,
      y: PAGE_H - MARGIN_BOTTOM - 2,
      size: 7.5,
    });
  });

  return pages;
}

/**
 * Converte o plano de operações vetoriais em ArrayBuffer / Blob binário %PDF-1.4
 */
export function buildTrPdfBlob(
  termo: TermoRecebimentoItem,
  usuarioEmissao?: string,
  dataHoraEmissao?: string
): Blob {
  const pages = planTrDocument(termo, usuarioEmissao, dataHoraEmissao);
  const enc = new TextEncoder();
  const bytes = (s: string) => enc.encode(s);
  const concat = (list: Uint8Array[]) => {
    const total = list.reduce((acc, curr) => acc + curr.length, 0);
    const res = new Uint8Array(total);
    let offset = 0;
    for (const item of list) {
      res.set(item, offset);
      offset += item.length;
    }
    return res;
  };

  const kids = pages.map((_, i) => `${5 + i * 2} 0 R`).join(' ');
  const objects: (string | Uint8Array)[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  ];

  pages.forEach((page, i) => {
    const streamLines: string[] = [];
    page.forEach((op) => {
      if (op.type === 'text') {
        const fontName = op.bold ? 'F2' : 'F1';
        streamLines.push(
          `0 g BT /${fontName} ${op.size} Tf 1 0 0 1 ${op.x} ${PAGE_H - op.y} Tm (${escapePdfText(op.text)}) Tj ET`
        );
      } else if (op.type === 'rect') {
        const rgbFill = op.fill ? `${op.fill[0]} ${op.fill[1]} ${op.fill[2]} rg` : '';
        const rgbStroke = op.stroke ? `${op.stroke[0]} ${op.stroke[1]} ${op.stroke[2]} RG` : '0.2 RG';
        const paintOp = op.fill && op.stroke ? 'B' : op.fill ? 'f' : 'S';
        streamLines.push(
          `q 0.5 w ${rgbFill} ${rgbStroke} ${op.x} ${PAGE_H - op.y - op.h} ${op.w} ${op.h} re ${paintOp} Q`
        );
      } else if (op.type === 'line') {
        streamLines.push(
          `q 0.5 w 0.2 G ${op.x1} ${PAGE_H - op.y1} m ${op.x2} ${PAGE_H - op.y2} l S Q`
        );
      }
    });

    const streamContent = streamLines.join('\n');
    const streamBytes = bytes(streamContent);
    const pageObjIdx = 5 + i * 2;
    const streamObjIdx = pageObjIdx + 1;

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${streamObjIdx} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>`
    );
    objects.push(
      concat([
        bytes(`<< /Length ${streamBytes.length} >>\nstream\n`),
        streamBytes,
        bytes('\nendstream'),
      ])
    );
  });

  // Montagem do corpo binário do PDF com tabela XREF
  const chunks: Uint8Array[] = [bytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];
  const offsets: number[] = [0];
  let curOffset = chunks[0].length;

  objects.forEach((obj, idx) => {
    offsets.push(curOffset);
    const head = `${idx + 1} 0 obj\n`;
    const tail = '\nendobj\n';
    const body = typeof obj === 'string' ? bytes(obj) : obj;
    chunks.push(bytes(head), body, bytes(tail));
    curOffset += head.length + body.length + tail.length;
  });

  const xrefOffset = curOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  chunks.push(bytes(xref));

  return new Blob([concat(chunks)], { type: 'application/pdf' });
}
