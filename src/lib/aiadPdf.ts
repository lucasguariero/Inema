import { getInfractions, infractionSummary } from './aiad';
import { AIAD_LOGO_JPEG_HEX } from './aiadPdfLogo';
import { type Aiad, coordinateText, getCoordsList, composedText, ROLES, FUNDAMENTO, cleanFactsDescription, formatAiadDisplayNumber, formatAiadDisplayProcess } from './aiad';

export const OFICIAL_FOOTER_ADDRESS = 'Avenida Luís Viana Filho, 6ª Avenida, nº 600 - CAB - CEP.: 41.745-900 - SALVADOR/BA';
export const OFICIAL_FOOTER_CONTACT = 'Para maiores informações sobre questões relacionadas ao meio ambiente, ligue de segunda a sexta-feira, das 09h00 às 16h00 Tel. (71) 3118-4509, 3118-4510, 3118-4588 e 3118-4593 E-mail: atend@inema.ba.gov.br';
export const SEIA_ORIENTATION = 'Para consultar as orientações e realizar o envio da defesa ou do recurso, acesse o Sistema SEIA por meio do site [inserir site] ou escaneie o QR Code ao lado.';

const WIN_ANSI_MAP: Record<string, string> = {
  'á': '\\341', 'à': '\\340', 'â': '\\342', 'ã': '\\343',
  'é': '\\351', 'ê': '\\352', 'í': '\\355',
  'ó': '\\363', 'ô': '\\364', 'õ': '\\365', 'ú': '\\372', 'ü': '\\374', 'ç': '\\347',
  'Á': '\\301', 'À': '\\300', 'Â': '\\302', 'Ã': '\\303',
  'É': '\\311', 'Ê': '\\312', 'Í': '\\315',
  'Ó': '\\323', 'Ô': '\\324', 'Õ': '\\325', 'Ú': '\\332', 'Ç': '\\307',
  'ª': '\\252', 'º': '\\272', '°': '\\260', '§': '\\247',
  '—': '\\227', '–': '\\226', '“': '\\223', '”': '\\224', '‘': '\\221', '’': '\\222',
  '•': '\\225', '…': '\\205', '′': "'", '″': '"'
};

function escapePdfText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÇªº°§—–“”‘’•…′″]/g, ch => WIN_ANSI_MAP[ch] || ch)
    .replace(/[^\x20-\x7e]/g, '?');
}

function wrapLines(text: string, maxLen = 88): string[] {
  const words = (text || '').split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if (!current) {
      current = w;
    } else if ((current + ' ' + w).length <= maxLen) {
      current += ' ' + w;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function buildAiadPdfBytes(a: Aiad): Uint8Array {
  const f = a.fields;
  const isDraft = a.status === 'rascunho' || !a.number;
  const now = new Date();
  const printTimestamp = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR');
  const coordsList = getCoordsList(f);

  const makePageStream = (viaLabel: string): string[] => {
    let lines: string[] = [];
    const pages: string[] = [];

    // Background and margins: 595.28 x 841.89 (A4)
    // Box border
    lines.push('0.2 0.4 0.3 RG'); // green tone
    lines.push('1.5 w');
    lines.push('36 36 523.28 769.89 re S');

    // Header bar (verde institucional #0F4C3A)
    lines.push('0.058 0.298 0.227 rg'); // #0F4C3A
    lines.push('36 746 523.28 59.89 re f');

    // Logomarca derivada do arquivo oficial, com o nome do auto ao lado.
    lines.push('q 85 0 0 27 45 765 cm /Logo Do Q');
    lines.push('BT');
    lines.push('1 1 1 rg');
    lines.push('/F2 8.5 Tf');
    lines.push('140 777 Td');
    lines.push(`(${escapePdfText('AUTO DE INFRAÇÃO — ADVERTÊNCIA')}) Tj`);
    lines.push('ET');

    // Right side header info (Via e Identificação)
    lines.push('BT');
    lines.push('1 1 1 rg');
    lines.push('/F2 8.5 Tf');
    lines.push('370 792 Td');
    lines.push(`(${escapePdfText(viaLabel)}) Tj`);
    lines.push('/F1 7.5 Tf');
    lines.push('0 -12 Td');
    lines.push(`(${escapePdfText(a.number ? `Auto: ${formatAiadDisplayNumber(a.number)}` : 'RASCUNHO EM ELABORAÇÃO')}) Tj`);
    lines.push('0 -11 Td');
    lines.push(`(${escapePdfText(`Processo: ${(a.process ? formatAiadDisplayProcess(a.process) : 'Sem processo vinculado')}`)}) Tj`);
    lines.push('ET');

    // Faixa Demonstrativa
    lines.push('0.95 0.92 0.82 rg');
    lines.push('36 730 523.28 14 re f');
    lines.push('0.7 0.6 0.3 RG 0.5 w');
    lines.push('36 730 523.28 14 re S');
    lines.push('BT');
    lines.push('/F2 7.5 Tf');
    lines.push('0.35 0.25 0.05 rg');
    lines.push('185 734 Td');
    lines.push(`(${escapePdfText('MODELO DEMONSTRATIVO — SEM VALIDADE LEGAL')}) Tj`);
    lines.push('ET');

    const header = [...lines];
    const finishPage = () => {
    // Rodapé oficial da RN071
    lines.push('0.7 0.7 0.7 RG');
    lines.push('0.5 w');
    lines.push('45 143 505 0.5 re S');

    lines.push('BT');
    lines.push('/F1 6.5 Tf');
    lines.push('0.3 0.3 0.3 rg');
    lines.push('45 133 Td');
    for (const row of [OFICIAL_FOOTER_ADDRESS, ...wrapLines(OFICIAL_FOOTER_CONTACT, 105), ...wrapLines(SEIA_ORIENTATION, 105), 'QR Code: destino oficial pendente de definição.', `Impressão: ${printTimestamp} | ${viaLabel}`]) {
      lines.push(`(${escapePdfText(row)}) Tj`);
      lines.push('0 -10 Td');
    }
    lines.push('ET');

    // Marca d'água de rascunho ajustada para aparecer integralmente na página (centralizada e translúcida)
    if (isDraft) {
      lines.push('q');
      lines.push('/GS1 gs');
      lines.push('0.2 0.2 0.2 rg');
      lines.push('BT');
      lines.push('/F2 26 Tf');
      lines.push('0.7660 0.6428 -0.6428 0.7660 90 250 Tm');
      lines.push(`(${escapePdfText('RASCUNHO — MODELO DEMONSTRATIVO')}) Tj`);
      lines.push('ET');
      lines.push('Q');
    }

      pages.push(lines.join('\n'));
    };
    let y = 712;
    const ensure = (height: number) => {
      if (y - height < 155) { finishPage(); lines = [...header]; y = 712; }
    };
    const writeSection = (title: string) => {
      ensure(30);
      lines.push('0.058 0.298 0.227 rg');
      lines.push(`36 ${y - 4} 523.28 15 re f`);
      lines.push('BT');
      lines.push('/F2 8.5 Tf');
      lines.push('1 1 1 rg');
      lines.push(`45 ${y} Td`);
      lines.push(`(${escapePdfText(title.toUpperCase())}) Tj`);
      lines.push('ET');
      y -= 18;
    };

    const writeRow = (label: string, value: string, boldVal = false) => {
      const valStr = value || '—';
      const wrapped = wrapLines(valStr, 72);
      ensure(wrapped.length * 11 + 2);
      lines.push('BT');
      lines.push('/F2 8.5 Tf');
      lines.push('0.2 0.2 0.2 rg');
      lines.push(`45 ${y} Td`);
      lines.push(`(${escapePdfText(label)}:) Tj`);
      lines.push(boldVal ? '/F2 8.5 Tf' : '/F1 8.5 Tf');
      lines.push('0 0 0 rg');
      lines.push('130 0 Td');
      lines.push(`(${escapePdfText(wrapped[0])}) Tj`);
      for (let i = 1; i < wrapped.length; i++) {
        lines.push('0 -11 Td');
        lines.push(`(${escapePdfText(wrapped[i])}) Tj`);
      }
      lines.push('ET');
      y -= wrapped.length * 11 + 2;
    };

    const writeParagraph = (text: string) => {
      for (const line of wrapLines(text, 88)) {
        ensure(16);
        lines.push('BT', '/F1 8 Tf', '0 0 0 rg', `45 ${y} Td`, `(${escapePdfText(line)}) Tj`, 'ET');
        y -= 10.5;
      }
      y -= 5;
    };

    // 1. Identificação do Auto e Processo
    writeSection('1. Identificação do Auto e Processo');
    writeRow('Número do Auto', a.number ? formatAiadDisplayNumber(a.number) : 'Rascunho em elaboração (sem número)', true);
    writeRow('Processo Originador', (a.process ? formatAiadDisplayProcess(a.process) : 'Sem processo vinculado'));
    writeRow('Processo do Auto', a.relatedProcess ? formatAiadDisplayProcess(a.relatedProcess) : 'Aguardando formação');
    writeRow('Data de Elaboração', f.date || '—');
    y -= 3;

    // 2. Identificação da Pessoa Autuada
    writeSection('2. Identificação da Pessoa Autuada');
    writeRow('Nome / Razão Social', f.name || '—', true);
    writeRow('CPF / CNPJ', f.document || '—');
    writeRow('Endereço', `${f.address || ''}, CEP: ${f.cep || ''}`);
    writeRow('Município / UF', `${f.city || ''} / ${f.uf || ''}`);
    writeRow('Contatos', `E-mail: ${f.email || '—'} | Tel: ${f.phone || '—'}`);
    if (f.enterprise) writeRow('Empreendimento', f.enterprise);
    y -= 3;

    // 3. Descrição da Infração e Constatação
    writeSection('3. Descrição da Infração e Constatação');
    writeRow('Data da Constatação', f.inspectionDate || '—');
    writeRow('Horário da Constatação', f.inspectionTime ? `${f.inspectionTime} h` : '—');
    writeRow('Local da Inspeção', `${f.inspection || ''} — ${f.inspectionAddress || ''}, ${f.inspectionCity || ''}/${f.inspectionUf || ''}`);
    y -= 2;
    writeParagraph(`Texto Composto do Auto: ${composedText(a)}`);
    if (f.facts) {
      writeParagraph(`Fatos Constatados: ${cleanFactsDescription(f.facts)}`);
    }
    y -= 3;

    // 4. Coordenadas Geográficas
    writeSection('4. Coordenadas Geográficas');
    coordsList.forEach((c, idx) => {
      writeRow(`Ponto #${idx + 1} (${c.type.toUpperCase()})`, `${coordinateText(c)} [${c.validated ? 'VALIDADA' : 'PENDENTE'}]`);
    });
    y -= 3;

    // 5. Dispositivo Normativo e Prazos
    writeSection('5. Dispositivo Normativo e Prazos Legais');
    writeParagraph(`Fundamento Legal: ${FUNDAMENTO}`);
    getInfractions(f).forEach((infraction, index) => { writeParagraph(`Infração ${index + 1}`); infractionSummary(infraction).split('\n').forEach(line => writeParagraph(line)); });
    writeParagraph('Defesa: Prazo para defesa junto ao INEMA: 20 dias da ciência do Auto, de acordo com o Art. 192, I, da Lei 10.431 de 20/12/2006.');
    writeParagraph('Recurso: Prazo para recurso ao CEPRAM: 20 dias da decisão do INEMA, de acordo com o Art. 192, II, da Lei 10.431 de 20/12/2006.');
    y -= 3;

    // 6. Assinaturas Eletrônicas Institucionais
    writeSection('6. Assinaturas Eletrônicas Institucionais');
    const techSig = a.signatures.find(s => s.role === 'tecnico');
    const coordSig = a.signatures.find(s => s.role === 'coordenacao');
    writeRow('Autoridade Fiscalizadora', techSig ? `${techSig.user} em ${new Date(techSig.at).toLocaleString('pt-BR')} (Hash: ${techSig.hash.slice(0, 24)}...)` : 'Aguardando assinatura técnica');
    writeRow('Coordenação Técnica', coordSig ? `${coordSig.user} em ${new Date(coordSig.at).toLocaleString('pt-BR')} (Hash: ${coordSig.hash.slice(0, 24)}...)` : 'Aguardando validação da Coordenação');

    finishPage();
    return pages;
  };

  const streams = [...makePageStream('1ª via - Cliente'), ...makePageStream('2ª via INEMA')];
  const objects: string[] = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  const resourceId = 3;
  const pageIds = streams.map((_, i) => 4 + i * 2);
  const logoId = 4 + streams.length * 2;
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${streams.length} >>`;
  objects[resourceId] = `<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >> >> /XObject << /Logo ${logoId} 0 R >> /ExtGState << /GS1 << /Type /ExtGState /ca 0.22 /CA 0.22 /BM /Multiply >> >> >>`;
  streams.forEach((stream, i) => {
    const id = pageIds[i];
    objects[id] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources ${resourceId} 0 R /Contents ${id + 1} 0 R >>`;
    objects[id + 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });
  const logoStream = AIAD_LOGO_JPEG_HEX + '>';
  objects[logoId] = `<< /Type /XObject /Subtype /Image /Width 397 /Height 126 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${logoStream.length} >>\nstream\n${logoStream}\nendstream`;
  let pdfStr = '%PDF-1.4\n% demo\n';
  const offsets: number[] = [];
  for (let i = 1; i < objects.length; i++) {
    offsets[i] = pdfStr.length;
    pdfStr += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefOffset = pdfStr.length;
  pdfStr += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objects.length; i++) pdfStr += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  pdfStr += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const encoder = new TextEncoder();
  return encoder.encode(pdfStr);
}

export function downloadAiadPdf(a: Aiad): boolean {
  try {
    const bytes = buildAiadPdfBytes(a);
    const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = a.number
      ? `Auto_Infracao_${a.number.replace(/[\/\\:]/g, '_')}.pdf`
      : `Auto_Infracao_Rascunho_${a.id.slice(-6)}.pdf`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch (e) {
    console.error('Falha ao gerar PDF:', e);
    return false;
  }
}
