import type { DocumentRecord } from './types';
// Text-only A4 documents follow the portal's existing core-PDF pattern. No official template/signature is fabricated.
export function planDocument(title: string, lines: string[], at: string, isPublic = false): DocumentRecord {
 const wrapped=lines.flatMap(line=>{
  if(!line)return ['']; const words=line.split(/\s+/).flatMap(w=>w.match(/.{1,85}/g)||[]),out:string[]=[];let row='';
  for(const word of words){if((row+' '+word).length>85){if(row)out.push(row);row=word;}else row=row?row+' '+word:word;}if(row)out.push(row);return out;
 });
 const pages:string[][]=[];for(let i=0;i<Math.max(1,wrapped.length);i+=40)pages.push(wrapped.slice(i,i+40));
 return {id:crypto.randomUUID(),title,at,pages,public:isPublic,kind:title};
}
export function documentPdf(doc: DocumentRecord): Blob {
 const escape=(s:string)=>Array.from(s.replace(/[–—·]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'")).map(c=>'\\()'.includes(c)?'\\'+c:c.charCodeAt(0)>126&&c.charCodeAt(0)<=255?'\\'+c.charCodeAt(0).toString(8).padStart(3,'0'):c.charCodeAt(0)>=32&&c.charCodeAt(0)<=126?c:'-').join('');
 const objects:string[]=['<< /Type /Catalog /Pages 2 0 R >>',`<< /Type /Pages /Count ${doc.pages.length} /Kids [${doc.pages.map((_,i)=>`${5+i*2} 0 R`).join(' ')}] >>`,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
 doc.pages.forEach((lines,i)=>{
  const text=(s:string,x:number,y:number,size:number,bold=false)=>`BT /${bold?'F2':'F1'} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escape(s)}) Tj ET`;
  const stream=[text('INEMA / NOVO SEIA — CONSELHO GESTOR',50,793,11,true),text('DEMONSTRAÇÃO — SEM VALIDADE LEGAL',50,774,10,true),text(doc.title,50,752,11,true),...lines.map((s,j)=>text(s,50,725-j*15,10)),text('Conteúdo fictício. Sem assinatura, protocolo ou envio institucional.',50,46,8),text(`Página ${i+1} de ${doc.pages.length}`,465,30,8)].join('\n');
  objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6+i*2} 0 R >>`,`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
 });
 let pdf='%PDF-1.4\n';const offsets:number[]=[];objects.forEach((o,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${o}\nendobj\n`;});const xref=pdf.length;pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
 return new Blob([pdf],{type:'application/pdf'});
}
export function downloadBlob(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
