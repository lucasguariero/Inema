/** A4 exports for the CERH demo, using browser font metrics and core PDF fonts. No service or dependency. */
export interface CerhPdfDocument { title:string; metadata:string[]; columns?:string[]; rows?:string[][]; sections?:{title:string;rows:[string,string|undefined][]}[]; footer:string; logoUrl:string }
export async function cerhPdf(doc:CerhPdfDocument) {
 const landscape=!!doc.columns&&doc.columns.length>5;
 const W=landscape?841.89:595.276,H=landscape?595.276:841.89,L=42,R=42,B=65;
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;
 const measure=(t:string,size:number,bold=false)=>{ctx.font=(bold?'bold ':'')+size+'px Arial';return ctx.measureText(t).width;};
 const wrap=(t:string,width:number,size:number,bold=false)=>{
   const result:string[]=[];let line='';
   for(const word of (t||'—').split(/\s+/)){
     if(line&&measure(line+' '+word,size,bold)>width){result.push(line);line='';}
     for(const ch of word){if(line&&measure(line+ch,size,bold)>width){result.push(line);line='';}line+=ch;}
     line+=' ';
   }
   if(line.trim())result.push(line.trim());return result;
 };
 const escape=(t:string)=>Array.from(t.replace(/[–—]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'")).map(c=>{const n=c.charCodeAt(0);return '\\()'.includes(c)?'\\'+c:n>126&&n<=255?'\\'+n.toString(8).padStart(3,'0'):n>=32&&n<=126?c:'-';}).join('');
 let logo:Uint8Array|undefined,logoWidth=0,logoHeight=0;
 try {
  const img=new Image();img.src=doc.logoUrl;await img.decode();
  canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0);
  const raw=atob(canvas.toDataURL('image/jpeg',.9).split(',')[1]);logo=Uint8Array.from(raw,c=>c.charCodeAt(0));logoWidth=canvas.width;logoHeight=canvas.height;
 } catch { /* Text INEMA remains in the header when an asset cannot be decoded. */ }
 const pages:string[][]=[];let commands:string[]=[],y=H-42;
 const text=(t:string,x:number,baseline:number,size=10,bold=false,gray=0)=>commands.push(gray+' g BT /'+(bold?'F2':'F1')+' '+size+' Tf 1 0 0 1 '+x.toFixed(2)+' '+baseline.toFixed(2)+' Tm ('+escape(t)+') Tj ET');
 const line=(x:number,y1:number,x2:number,y2:number)=>commands.push('0.78 G .4 w '+x+' '+y1+' m '+x2+' '+y2+' l S');
 const heading=()=>{
   commands=[];pages.push(commands);y=H-42;
   if(logo){const h=54*logoHeight/logoWidth;commands.push('q 54 0 0 '+h+' '+L+' '+(y-h+8)+' cm /Logo Do Q');}
   else text('INEMA',L,y,14,true);
   const titleLines=wrap(doc.title,W-L-R-72,13,true);
   titleLines.forEach((t,n)=>text(t,L+72,y-n*17,13,true));y-=Math.max(46,titleLines.length*17+10);
   text('DEMONSTRAÇÃO — SEM VALIDADE LEGAL',L,y,8,true,.35);y-=18;
   for(const m of doc.metadata)for(const t of wrap(m,W-L-R,9)){text(t,L,y,9);y-=13;}
   line(L,y-4,W-R,y-4);y-=22;
 };
 const ensure=(height:number)=>{if(y-height<B)heading();};
 heading();
 if(doc.columns&&doc.rows){
   const cols=doc.columns,n=cols.length,width=(W-L-R)/n;
   const tableHeader=()=>{
    const lines=cols.map(c=>wrap(c,width-10,8,true));const height=Math.max(...lines.map(l=>l.length))*11+12;
    commands.push('.94 g '+L+' '+(y-height)+' '+(W-L-R)+' '+height+' re f');
    lines.forEach((list,c)=>list.forEach((t,j)=>text(t,L+c*width+5,y-12-j*11,8,true)));y-=height;line(L,y,W-R,y);
   };
   tableHeader();
   for(const row of doc.rows){
    const cells=cols.map((_,c)=>wrap(row[c]||'—',width-10,8));
    const height=Math.max(...cells.map(l=>l.length))*11+12;
    if(y-height<B){heading();tableHeader();}
    cells.forEach((list,c)=>list.forEach((t,j)=>text(t,L+c*width+5,y-12-j*11,8)));
    y-=height;line(L,y,W-R,y);
   }
   ensure(30);y-=20;text('Total ('+doc.rows.length+' registros)',L,y,9,true);
 }
 for(const section of doc.sections||[]){
   const sectionHeight=section.rows.reduce((sum,[k,v])=>sum+wrap((k?k+': ':'')+(v||'—'),W-L-R,10).length*14+6,35);
   ensure(sectionHeight < H-240 ? sectionHeight : 55);for(const t of wrap(section.title,W-L-R,11,true)){text(t,L,y,11,true);y-=15;}y-=6;
   for(const [label,value] of section.rows){
     const lines=wrap((label?label+': ':'')+(value||'—'),W-L-R,10);
     for(const t of lines){if(y-16<B){heading();text(section.title+' (continuação)',L,y,11,true);y-=23;}text(t,L,y,10);y-=14;}
     y-=6;
   }
   y-=12;
 }
 pages.forEach((page,n)=>{commands=page;line(L,48,W-R,48);const footer=wrap(doc.footer,W-L-R-50,7);footer.slice(0,3).forEach((t,j)=>text(t,L,37-j*9,7,false,.35));text((n+1)+' / '+pages.length,W-R-30,37,8,false,.35);});
 // Object streams use ASCII escapes; only the optional JPEG uses binary bytes.
 const objects:(string|Uint8Array)[]=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids ['+pages.map((_,i)=>(6+i*2)+' 0 R').join(' ')+'] /Count '+pages.length+' >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
 const enc=new TextEncoder();
 const bytes=(s:string)=>enc.encode(s);
 const concat=(parts:Uint8Array[])=>{const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;parts.forEach(p=>{out.set(p,offset);offset+=p.length;});return out;};
 if(logo)objects.push(concat([bytes('<< /Type /XObject /Subtype /Image /Width '+logoWidth+' /Height '+logoHeight+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+logo.length+' >>\nstream\n'),logo,bytes('\nendstream')]));
 else objects.push('<< >>');
 pages.forEach((page,i)=>{const stream=page.join('\n');objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+W+' '+H+'] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> '+(logo?'/XObject << /Logo 5 0 R >> ':'')+'>> /Contents '+(7+i*2)+' 0 R >>','<< /Length '+bytes(stream).length+' >>\nstream\n'+stream+'\nendstream');});
 const chunks:Uint8Array[]=[bytes('%PDF-1.4\n')],offsets:number[]=[];let length=chunks[0].length;
 objects.forEach((obj,n)=>{offsets.push(length);const part=concat([bytes((n+1)+' 0 obj\n'),typeof obj==='string'?bytes(obj):obj,bytes('\nendobj\n')]);chunks.push(part);length+=part.length;});
 const xref=length;chunks.push(bytes('xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'+offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF'));
 return new Blob([concat(chunks).buffer as ArrayBuffer],{type:'application/pdf'});
}
export async function downloadDocument(name:string,doc:CerhPdfDocument) {const blob=await cerhPdf(doc),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
