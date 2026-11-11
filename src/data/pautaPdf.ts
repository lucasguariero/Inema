/** Local A4 document writer. Core PDF fonts use WinAnsi so Portuguese text stays selectable. */
export function pautaPdf(input: string[] | string[][]) {
  const logical = Array.isArray(input[0]) ? input as string[][] : [input as string[]];
  const width = 595.276, height = 841.89, left = 85.04, right = 56.69, bottom = 82;
  const context = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  const textWidth = (text: string, size: number, bold = false) => {
    if (!context) return text.length * size * .54;
    context.font = `${bold ? 'bold ' : ''}${size}px Arial`; return context.measureText(text).width;
  };
  const escape = (text: string) => Array.from(text.replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'")).map(char => {
    const code = char.charCodeAt(0);
    if ('\\()'.includes(char)) return '\\' + char;
    return code > 126 && code <= 255 ? '\\' + code.toString(8).padStart(3, '0') : code >= 32 && code <= 126 ? char : '-';
  }).join('');
  const streams: string[][] = []; let stream: string[] = [], y = 0;
  const write = (text: string, x: number, baseline: number, size = 12, bold = false, gray = 0, spacing = 0) => {
    stream.push(`${gray} g BT /${bold ? 'F2' : 'F1'} ${size} Tf ${spacing.toFixed(3)} Tw 1 0 0 1 ${x.toFixed(2)} ${baseline.toFixed(2)} Tm (${escape(text)}) Tj ET`);
  };
  const wrap = (text: string, size: number, bold = false, indent = 0) => {
    const lines: string[] = []; let line = '';
    for (const word of text.split(/\s+/).filter(Boolean)) {
      const limit = width - left - right - (lines.length === 0 ? indent : 0);
      if (line && textWidth(`${line} ${word}`, size, bold) > limit) { lines.push(line); line = ''; }
      for (const char of word) {
        const available = width - left - right - (lines.length === 0 ? indent : 0);
        if (textWidth(line + char, size, bold) > available && line) { lines.push(line); line = ''; }
        line += char;
      }
      line += ' ';
    }
    if (line.trim()) lines.push(line.trim());
    return lines.map(line => line.trim());
  };
  const start = (title: string, process: string) => {
    stream = []; streams.push(stream); y = height - 85.04;
    write('DEMONSTRACAO SEM VALIDADE LEGAL', left, y, 9, false, .35); y -= 29;
    for (const line of wrap(title.toLocaleUpperCase('pt-BR'), 14, true)) { write(line, left, y, 14, true); y -= 19; }
    if (process) { write(process, left, y - 4, 10, false, .25); y -= 21; }
    stream.push(`0.8 G .5 w ${left} ${y - 5} m ${width - right} ${y - 5} l S`); y -= 30;
  };
  for (const page of logical.length ? logical : [[]]) {
    const title = page[0] || 'Documento demonstrativo';
    const process = /^Processo:/i.test(page[1] || '') ? page[1] : '';
    start(title, process);
    for (const paragraph of page.slice(process ? 2 : 1)) {
      if (!paragraph.trim()) { y -= 8; continue; }
      const heading = /^\d+(?:\.\d+)*\.\s/.test(paragraph);
      const metadata = /^(Interessado|Requerente|Empreendimento|Município|Referência|Ato|Situa[cç][aã]o|Processo):/i.test(paragraph);
      const size = 12, indent = heading || metadata ? 0 : 35.43;
      if (heading) { if (y < bottom + 66) start(title, process); y -= 10; }
      const lines = wrap(paragraph, size, heading, indent);
      lines.forEach((line, index) => {
        if (y < bottom + 18) start(title, process);
        const x = left + (index === 0 ? indent : 0), space = line.split(' ').length - 1;
        const extra = !heading && !metadata && index < lines.length - 1 && space ? Math.max(0, (width - right - x - textWidth(line, size)) / space) : 0;
        write(line, x, y, size, heading, 0, extra); y -= 18;
      });
      y -= heading || metadata ? 6 : 10;
    }
  }
  streams.forEach((page, i) => {
    stream = page;
    page.push(`0.8 G .5 w ${left} 65 m ${width - right} 65 l S`);
    write('Conteúdo fictício para avaliação do protótipo. Sem assinatura.', left, 48, 8, false, .35);
    write(`${i + 1} / ${streams.length}`, width - right - 32, 48, 9, false, .35);
  });
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', `<< /Type /Pages /Kids [${streams.map((_, i) => `${5 + i * 2} 0 R`).join(' ')}] /Count ${streams.length} >>`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
  streams.forEach((lines, i) => { const content = lines.join('\n'); objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + i * 2} 0 R >>`, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`); });
  let pdf = '%PDF-1.4\n'; const offsets: number[] = [];
  objects.forEach((object, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}
