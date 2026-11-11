import type { RfaReport } from './types';
import type { Plan, Picture, Op } from './ReportDocument';
import { attendanceParts } from './attendanceTime';
import { coordFingerprint } from './fixtures';

type SectionRows = { title: string; rows: [string, string][] };
const W=595.276,H=841.89,L=24,R=W-24,BOTTOM=H-57,BLUE='#007cbc',INK='#14243d',BORDER='#cbd5e1',PALE='#eef2f5';

// Presentation of Naiane's two PNGs; all values still come from the existing report contract.
export async function planRfaDocument(r:RfaReport,pictures:Picture[],sections:SectionRows[],loadPicture:(src:string)=>Promise<Picture>,date:(v:string)=>string):Promise<Plan> {
 const c=r.content,canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!,pages:Op[][]=[];let current:Op[]=[],y=0,heading='';
 const wrap=(value:string,width:number,size=8.5,bold=false)=>{ctx.font=`${bold?'bold ':''}${size}px Arial`;const lines:string[]=[];let line='';for(const paragraph of(value||'Não informado').split('\n')){for(const word of paragraph.split(/\s+/)){if(line&&ctx.measureText(line+word).width>width){lines.push(line.trim());line='';}for(const ch of word){if(ctx.measureText(line+ch).width>width){lines.push(line.trim());line='';}line+=ch;}line+=' ';}if(line.trim())lines.push(line.trim());line='';}return lines.length?lines:['Não informado'];};
 const text=(value:string,x:number,at:number,size=8.5,bold=false,color=INK)=>current.push({type:'text',text:value,x,y:at,size,bold,color});
 const box=(x:number,at:number,w:number,h:number,fill='#ffffff',stroke=BORDER)=>current.push({type:'text',text:'',x,y:at,size:1,box:{x,y:at,w,h,fill,stroke}});
 const bar=(title:string)=>{box(L,y,R-L,19,BLUE,BLUE);text(title,L+8,y+13,10,true,'#ffffff');y+=24;};
 const fresh=(continued=false)=>{current=[];pages.push(current);current.push({type:'image',image:0,x:L,y:18,w:88,h:88*pictures[0].height/pictures[0].width});text('RELATÓRIO DE FISCALIZAÇÃO AMBIENTAL – RFA',151,31,11.5,true);text(`RFA ${r.number?'nº '+r.number:'— Rascunho sem número definitivo'} · v${r.version}`,151,49,9,true);text(`Situação demonstrativa: ${r.status}`,151,64,8.5,true);text('DEMONSTRAÇÃO — SEM VALIDADE LEGAL',L,84,8,true);y=97;if(continued&&heading)bar(heading+' — continuação');};
 const section=(title:string)=>{heading=title;if(y+85>BOTTOM)fresh(false);bar(title);};
 const table=(headers:string[],rows:string[][],ratios:number[],labels:number[]=[])=>{
  const widths=ratios.map(n=>(R-L)*n/ratios.reduce((a,b)=>a+b,0));
  const row=(values:string[],header=false)=>{const size=8.3,lh=10.8,lines=widths.map((w,i)=>wrap(values[i]||'Não informado',w-12,size,header||labels.includes(i)));let offset=0;const max=Math.max(...lines.map(x=>x.length));while(offset<max){if(y+23>BOTTOM){fresh(true);if(headers.length&&!header)row(headers,true);}const capacity=Math.max(1,Math.floor((BOTTOM-y-10)/lh)),count=Math.min(max-offset,capacity),height=Math.max(21,count*lh+10);let x=L;for(let col=0;col<widths.length;col++){box(x,y,widths[col],height,header||labels.includes(col)?PALE:'#ffffff');lines[col].slice(offset,offset+count).forEach((line,i)=>text(line,x+6,y+12+i*lh,size,header||labels.includes(col)));x+=widths[col];}y+=height;offset+=count;if(offset<max){fresh(true);if(headers.length)row(headers,true);}}};
  if(headers.length)row(headers,true);if(rows.length){for(const values of rows)row(values);}else{if(y+23>BOTTOM){fresh(true);if(headers.length)row(headers,true);}box(L,y,R-L,21);text('Nenhum registro',L+6,y+13,8.3);y+=21;}y+=8;
 };
 const keyValues=(rows:[string,string][])=>{const groups:string[][]=[];for(let i=0;i<rows.length;i+=2)groups.push([rows[i][0],rows[i][1],rows[i+1]?.[0]||'—',rows[i+1]?.[1]||'—']);table([],groups,[.18,.35,.17,.30],[0,2]);};
 fresh();
 const mode=c.geo?({success:'Consulta demonstrativa concluída',empty:'Consulta demonstrativa sem ocorrências',partial:'Consulta demonstrativa parcialmente indisponível',unavailable:'Consulta demonstrativa indisponível'}[c.geo.mode])+'; '+date(c.geo.at)+(c.geo.coordinateFingerprint!==coordFingerprint(c.coordinates)?'; dados desatualizados após edição das coordenadas':''):'Consulta não realizada';
 table(['Processo originador / indexado','Contexto geoespacial demonstrativo'],[[c.originator||'Não vinculado',mode]],[.4,.6]);
 section('1. ATENDIMENTO');const start=attendanceParts(c.attendance.start),end=attendanceParts(c.attendance.end);
 table(['Data de início','Hora de início','Data de término','Hora de término'],[[start.date?date(start.date):'',start.time,end.date?date(end.date):'',end.time]],[1,1,1,1]);
 section('2. IDENTIFICAÇÃO');keyValues([['Nome/Razão social',c.person.name],['CPF/CNPJ',c.person.document],['Endereço',c.person.address],['Complemento',c.person.complement],['CEP',c.person.cep],['E-mail',c.person.email],['Telefone',c.person.phone]]);
 table(['Participantes da inspeção','Função','Telefone','E-mail'],c.participants.map(p=>[p.name,p.job+(p.responsible?' — responsável':''),p.phone,p.email]),[.28,.28,.17,.27]);
 section('3. LOCAL DA INSPEÇÃO');keyValues([['Endereço/local',c.location.address],['Número',c.location.number],['Município',c.location.municipality],['Referência',c.location.reference]]);
 table(['Formato / referencial','Coordenada original','Coordenada decimal'],c.coordinates.map(p=>[p.format+' / '+p.datum,p.original,`${p.lat} / ${p.lng}`]),[.25,.4,.35]);
 if(c.geo)table(['Camada / regra / ponto','Valores selecionados','Situação demonstrativa'],c.geo.layers.map(layer=>[`${layer.layer}; ${layer.rule}; ${layer.coordinateId}`,layer.values.filter(v=>v.selected).map(v=>v.text).join('; ')||'Nenhum selecionado',({ok:'Disponível',empty:'Sem ocorrências',unavailable:'Indisponível — dados anteriores sem atualização'}[layer.status])]),[.32,.48,.2]);
 section('4. HISTÓRICO');table(['Processo incorporado','Data','Tipo','Informações incorporadas'],c.history.map(x=>[x.process,date(x.date),x.type,x.detail]),[.23,.14,.23,.40]);
 section('5. DESCRIÇÃO DA INSPEÇÃO');table([],[[c.description]],[1]);
 const images=c.attachments.filter(a=>a.mime.startsWith('image/'));
 for(let i=0;i<images.length;i+=2){const pair=images.slice(i,i+2),loaded:Picture[]=[];for(const a of pair){const url=URL.createObjectURL(a.blob);try{loaded.push(await loadPicture(url));}finally{URL.revokeObjectURL(url);}}
  const imageW=(R-L-12)/2,heights=loaded.map(p=>Math.min(150,imageW*p.height/p.width)),captionLines=pair.map(a=>wrap(`${a.name}. ${a.description}. Incluído em ${date(a.at)}. Local registrado: ${c.location.address}.`,imageW,8));const blockHeight=Math.max(...heights)+Math.max(...captionLines.map(x=>x.length))*11+18;
  if(y+Math.min(blockHeight,250)>BOTTOM)fresh(true);
  for(let j=0;j<loaded.length;j++){const p=loaded[j],image= pictures.push(p)-1,x=L+j*(imageW+12),h=heights[j],w=h*p.width/p.height;current.push({type:'image',image,x:x+(imageW-w)/2,y,w,h});}y+=Math.max(...heights)+12;
  const maxCaption=Math.max(...captionLines.map(x=>x.length));for(let line=0;line<maxCaption;line++){if(y+12>BOTTOM)fresh(true);captionLines.forEach((ls,j)=>{if(ls[line])text(ls[line],L+j*(imageW+12),y,8);});y+=11;}y+=9;
 }
 section('6. CONCLUSÃO E DESDOBRAMENTOS');table(['Conclusão técnica'],[[c.conclusion]],[1]);table(['Desdobramentos selecionados','Situação'],c.outcomes.map(x=>[x,'Seleção demonstrativa; sem encaminhamento institucional']),[.6,.4]);
 section('7. INFRAÇÕES');
 const infractions=sections.filter(x=>/^Infração \d+$/.test(x.title));
 table(['Nº','Caracterização da Infração','Dispositivo, critérios e dados associados','Outras normas'],infractions.map((s,i)=>[String(i+1),s.rows.find(x=>x[0]==='Caracterização textual')?.[1]||'',s.rows.filter(x=>!['Caracterização textual','Outras normas'].includes(x[0])).map(([k,v])=>k+': '+(v||'Não informado')).join('\n'),s.rows.find(x=>x[0]==='Outras normas')?.[1]||'']),[.05,.25,.51,.19]);
 section('8. NOTIFICAÇÕES');const notifications=sections.filter(x=>/^Notificação \d+$/.test(x.title));
 table(['Nº','Resumo e informações da notificação','Situação'],notifications.map((s,i)=>[String(i+1),s.rows.map(([k,v])=>k+': '+(v||'Não informado')).join('\n'),'Registro demonstrativo; sem envio']),[.05,.75,.2]);
 section('9. ANEXOS');table(['Nº','Arquivo / descrição','Formato / tamanho','Inclusão / autor'],c.attachments.map((a,i)=>[String(i+1),a.name+'\n'+a.description,a.format+'; '+a.size.toLocaleString('pt-BR')+' bytes',date(a.at)+'\n'+a.user]),[.05,.44,.18,.33]);
 section('10. RESPONSABILIDADE TÉCNICA');const responsibility=sections.find(x=>x.title==='Responsabilidade técnica');table(['Campo','Informação'],responsibility?.rows||[],[.28,.72]);
 const stamp=date(new Date().toISOString());pages.forEach((p,i)=>{p.push({type:'text',text:'',x:L,y:H-48,size:1,box:{x:L,y:H-48,w:R-L,h:0.5,stroke:'#64748b'}},{type:'text',text:'Documento demonstrativo. Sem assinatura ou validade institucional.',x:L,y:H-35,size:7,color:INK},{type:'text',text:'Impressão: '+stamp+' — Bahia (UTC-03:00).',x:L,y:H-23,size:7,color:INK},{type:'text',text:`Página ${i+1} de ${pages.length}`,x:R-68,y:H-23,size:7,color:INK});});
 return {pages,pictures};
}
