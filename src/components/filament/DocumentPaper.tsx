import React from 'react';

export function DocumentPaper({ title, process, lines, index, total, scale = 1, highlight = text => text }: {
  title: string; process: string; lines: string[]; index: number; total: number; scale?: number;
  highlight?: (text: string) => React.ReactNode;
}) {
  return <section className="fi-document-page" aria-label={`Página ${index + 1} de ${total}`} style={{ transform: `scale(${scale})` }}>
    <header><p className="fi-document-watermark">DEMONSTRAÇÃO · SEM VALIDADE LEGAL</p><p className="fi-document-institution">INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS</p><h3>{title}</h3><p className="fi-document-process">Processo {process}</p></header>
    <div className="fi-document-page-body">{lines.map((line, i) => /^\d+(?:\.\d+)*\.\s/.test(line)
      ? <h4 key={i}>{highlight(line)}</h4>
      : <p key={i} className={/^(Interessado|Requerente|Empreendimento|Município|Referência|Ato):/.test(line) ? 'fi-document-metadata' : undefined}>{highlight(line)}</p>)}</div>
    <footer><span>Conteúdo fictício para avaliação do protótipo. Sem assinatura.</span><span>{index + 1} / {total}</span></footer>
  </section>;
}
