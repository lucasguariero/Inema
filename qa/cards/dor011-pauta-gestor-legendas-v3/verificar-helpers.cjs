const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1920,height:1080}});
 await page.goto((process.env.PAUTA_BASE||'http://127.0.0.1:3000/')+'?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor');
 for(const group of ['Dados do registro','Localização','Período e situação','Classificação'])await page.getByRole('button',{name:'Expandir '+group}).click();
 await page.getByRole('button',{name:'Origem',exact:true}).click();await page.getByRole('option',{name:'Ofício',exact:true}).click();
 const readings=[];
 const collect=async()=>readings.push(...await page.locator('[data-leg]').evaluateAll(es=>{
  const rgb=v=>v.match(/[\d.]+/g).map(Number);const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  return es.filter(e=>e.getClientRects().length).map(e=>{let parent=e;while(parent&&getComputedStyle(parent).backgroundColor==='rgba(0, 0, 0, 0)')parent=parent.parentElement;
   const color=getComputedStyle(e).color,bg=parent?getComputedStyle(parent).backgroundColor:'rgb(255, 255, 255)';const a=lum(rgb(color)),b=lum(rgb(bg));
   return {leg:e.dataset.leg,text:e.textContent,color,bg,contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),font:getComputedStyle(e).fontSize,line:getComputedStyle(e).lineHeight,wrap:e.scrollWidth<=e.clientWidth};});
 }));
 await collect();
 await page.goto('http://127.0.0.1:3000/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor');
 await page.getByRole('button',{name:/^Ações de/}).first().click();await page.getByRole('dialog').getByRole('button',{name:'Visualizar',exact:true}).click();await page.getByRole('link',{name:'-12.910000, -38.350000',exact:true}).first().click();await collect();
 expect(readings.every(r=>r.contrast>=4.5&&r.font==='12px'&&r.line==='16px'&&r.wrap)).toBe(true);
 fs.writeFileSync(path.join(__dirname,'logs','helpers-computed.json'),JSON.stringify({date:new Date().toISOString(),scope:'Helpers dos quatro grupos e LEG024 no TL011, Light FullHD; não auditoria WCAG integral.',readings},null,2));
 console.log('PASS helpers text-xs, line-height16, wrapping e contraste mínimo: '+Math.min(...readings.map(r=>r.contrast)).toFixed(2)+':1');await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
