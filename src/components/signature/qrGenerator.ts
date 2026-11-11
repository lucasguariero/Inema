/**
 * Gerador de QR Code vetorial em TypeScript puro (sem dependências externas)
 * Implementação padrão QR Code Modelo 2 para codificação de URLs demonstrativas do SEIA.
 * Suporta até ~120 caracteres em modo Byte (Versão 4 a 6) com Correção de Erro Nível M.
 */

// Reed-Solomon GF(256) com polinômio 0x11d (285)
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    EXP_TABLE[i + 255] = x;
    LOG_TABLE[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }
})();

function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
}

function rsComputePoly(ecCount: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < ecCount; i++) {
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gfMul(poly[j], EXP_TABLE[i]);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  return poly;
}

function rsCalculateEC(data: Uint8Array, ecCount: number): Uint8Array {
  const genPoly = rsComputePoly(ecCount);
  const remainder = new Uint8Array(ecCount);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[ecCount - 1] = 0;
    for (let j = 0; j < ecCount; j++) {
      remainder[j] ^= gfMul(genPoly[j], factor);
    }
  }
  return remainder;
}

// Configuração simplificada para Version 4-M (33x33) até 64 bytes
// e Version 5-M (37x37) até 86 bytes
interface QrConfig {
  version: number;
  size: number;
  dataCapacity: number;
  ecCount: number;
  alignPos: number[];
}

const CONFIG_V4_M: QrConfig = {
  version: 4,
  size: 33,
  dataCapacity: 64,
  ecCount: 36,
  alignPos: [6, 26],
};

const CONFIG_V5_M: QrConfig = {
  version: 5,
  size: 37,
  dataCapacity: 86,
  ecCount: 48,
  alignPos: [6, 30],
};

const CONFIG_V6_M: QrConfig = {
  version: 6,
  size: 41,
  dataCapacity: 108,
  ecCount: 56,
  alignPos: [6, 34],
};

export function generateQrMatrix(text: string): boolean[][] {
  const enc = new TextEncoder();
  const rawBytes = enc.encode(text);

  // Escolhe a versão adequada
  let cfg = CONFIG_V4_M;
  if (rawBytes.length > 60) cfg = CONFIG_V5_M;
  if (rawBytes.length > 80) cfg = CONFIG_V6_M;

  const N = cfg.size;
  const matrix: (boolean | null)[][] = Array.from({ length: N }, () => Array(N).fill(null));

  // 1. Finder patterns (cantos)
  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[r0 + r][c0 + c] = isBorder || isInner;
      }
    }
    // Separator em branco
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const row = r0 + r;
        const col = c0 + c;
        if (row >= 0 && row < N && col >= 0 && col < N) {
          if (r === -1 || r === 7 || c === -1 || c === 7) {
            matrix[row][col] = false;
          }
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, N - 7);
  drawFinder(N - 7, 0);

  // 2. Alignment pattern
  if (cfg.alignPos.length >= 2) {
    const ar = cfg.alignPos[1];
    const ac = cfg.alignPos[1];
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2;
        const isCenter = r === 0 && c === 0;
        matrix[ar + r][ac + c] = isBorder || isCenter;
      }
    }
  }

  // 3. Timing patterns
  for (let i = 8; i < N - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
  }

  // Dark module
  matrix[4 * cfg.version + 9][8] = true;

  // Reserva de Format Info
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
  }
  for (let i = 0; i < 8; i++) {
    if (matrix[8][N - 1 - i] === null) matrix[8][N - 1 - i] = false;
    if (matrix[N - 1 - i][8] === null) matrix[N - 1 - i][8] = false;
  }

  // 4. Codificação de dados em Modo Byte (0100)
  const bitBuffer: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bitBuffer.push((val >> i) & 1);
    }
  };

  pushBits(0b0100, 4); // Byte mode indicator
  pushBits(rawBytes.length, 8); // Character count (8 bits para V1-V9)
  for (const b of rawBytes) {
    pushBits(b, 8);
  }

  // Terminator (4 zeros)
  const maxDataBits = cfg.dataCapacity * 8;
  const termLen = Math.min(4, maxDataBits - bitBuffer.length);
  pushBits(0, termLen);

  // Alinhamento para byte completo
  while (bitBuffer.length % 8 !== 0) {
    bitBuffer.push(0);
  }

  // Pad bytes (0xEC, 0x11)
  const padPatterns = [0b11101100, 0b00010001];
  let padIdx = 0;
  while (bitBuffer.length < maxDataBits) {
    pushBits(padPatterns[padIdx % 2], 8);
    padIdx++;
  }

  // Converte bits para Uint8Array
  const dataBytes = new Uint8Array(cfg.dataCapacity);
  for (let i = 0; i < cfg.dataCapacity; i++) {
    let byteVal = 0;
    for (let b = 0; b < 8; b++) {
      byteVal = (byteVal << 1) | bitBuffer[i * 8 + b];
    }
    dataBytes[i] = byteVal;
  }

  // Calcula Error Correction Codewords (EC)
  const ecBytes = rsCalculateEC(dataBytes, cfg.ecCount);

  // Intercala dados e EC
  const allCodewords = new Uint8Array(dataBytes.length + ecBytes.length);
  allCodewords.set(dataBytes, 0);
  allCodewords.set(ecBytes, dataBytes.length);

  // 5. Preenche dados na matriz em zigue-zague
  let bitIdx = 0;
  const totalBits = allCodewords.length * 8;

  let right = N - 1;
  let upward = true;

  while (right > 0) {
    if (right === 6) right--; // Pula timing pattern vertical

    const cols = [right, right - 1];
    const rowStart = upward ? N - 1 : 0;
    const rowEnd = upward ? -1 : N;
    const rowStep = upward ? -1 : 1;

    for (let r = rowStart; r !== rowEnd; r += rowStep) {
      for (const c of cols) {
        if (matrix[r][c] === null) {
          let bit = 0;
          if (bitIdx < totalBits) {
            const bytePos = Math.floor(bitIdx / 8);
            const bitPos = 7 - (bitIdx % 8);
            bit = (allCodewords[bytePos] >> bitPos) & 1;
            bitIdx++;
          }

          // Aplica Máscara Padrão 0: (row + col) % 2 === 0
          const mask = (r + c) % 2 === 0;
          matrix[r][c] = (bit === 1) !== mask;
        }
      }
    }

    upward = !upward;
    right -= 2;
  }

  // 6. Escreve Format Information para Nível M, Máscara 0 (BCH 15,5 com máscara 0x5412)
  // Format String para M / Mask 0: 0b100000011001110 ^ 0b101010000010010 = 0b001010011011100
  const formatBits = [0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0];

  // Top-left format info
  for (let i = 0; i < 6; i++) matrix[8][i] = formatBits[i] === 1;
  matrix[8][7] = formatBits[6] === 1;
  matrix[8][8] = formatBits[7] === 1;
  matrix[7][8] = formatBits[8] === 1;
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = formatBits[i] === 1;

  // Bottom & Right format info
  for (let i = 0; i < 7; i++) matrix[N - 1 - i][8] = formatBits[i] === 1;
  for (let i = 7; i < 15; i++) matrix[8][N - 15 + i] = formatBits[i] === 1;

  // Converte nulls residuais para false
  return matrix.map((row) => row.map((cell) => cell ?? false));
}
