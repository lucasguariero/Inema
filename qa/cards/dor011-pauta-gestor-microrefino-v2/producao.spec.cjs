const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
const url='https://inema.acto.com.br/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor';
const shots=path.join(__dirname,'prints-producao');fs.mkdirSync(shots,{recursive:true});
const open=async(page,name)=>{await page.getByRole('button',{name:/^Ações de/}).first().click();await page.getByRole('button',{name,exact:true}).click();};
test('P01 TL011 publicada inclui anexos comuns, fontes e metadados explícitos',async({page})=>{
 await page.goto(url);await expect(page.locator('h1')).toContainText('Pauta do Gestor - Registros');
 const html=await (await page.request.get(url)).text();expect(html).toContain('/assets/index-BJvPcLXY.js');
 fs.writeFileSync(path.join(__dirname,'logs','html-producao-final.html'),html);
 await open(page,'Adicionar arquivo');await page.locator('input[type=file]').setInputFiles({name:'auditoria-anexo-comum.txt',mimeType:'text/plain',buffer:Buffer.from('Arquivo comum sem metadados geoespaciais')});
 await page.getByRole('button',{name:'Adicionar arquivo',exact:true}).click();await open(page,'Visualizar');
 await page.getByRole('link',{name:'-12.910000, -38.350000',exact:true}).first().click();
 const d=page.getByRole('dialog');await expect(d.getByText('comprovante-recebimento.pdf',{exact:true})).toBeVisible();
 await expect(d.getByText('auditoria-anexo-comum.txt',{exact:true})).toBeVisible();
 await expect(d.getByText(/Anexo · nota-tecnica-localizacao.pdf/)).toBeVisible();
 await expect(d.getByRole('link',{name:'Visualizar',exact:true})).toHaveAttribute('href',/^blob:/);
 await expect(d.getByRole('button',{name:'Abrir GeoBahia',exact:true})).toBeDisabled();
 await page.screenshot({path:path.join(shots,'Print 29 - Producao TL011 FullHD.png'),animations:'disabled'});
 await d.getByRole('button',{name:'Visualizar metadados',exact:true}).click();await expect(d.getByText(/Não houve leitura ou extração/)).toBeVisible();
 await d.getByRole('button',{name:'Voltar',exact:true}).click();await page.setViewportSize({width:390,height:844});
 await d.getByRole('button',{name:'Abrir GeoBahia',exact:true}).scrollIntoViewIfNeeded();
 await expect(d.getByRole('button',{name:'Cancelar',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:path.join(shots,'Print 30 - Producao TL011 390px rodape.png'),animations:'disabled'});
});
test('P02 Select no modal SEIA V2: primeiro Escape fecha Select, segundo fecha modal',async({page})=>{
 await page.goto('https://inema.acto.com.br/?rota=seia-v2&tela=usuarios-roles');
 await page.getByRole('button',{name:/Novo Usuário/}).click();
 const s=page.locator('.fi-select-trigger:visible').first();await s.click();await expect(page.getByRole('listbox')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('listbox')).toHaveCount(0);await expect(s).toBeFocused();
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('P03 paginação condicional publicada e guias RA/AC vazias',async({page})=>{
 await page.goto(url);await expect(page.getByRole('button',{name:'Próxima página',exact:true})).toHaveCount(1);
 for(const tab of ['RD','RA','AC']){
  await page.getByRole('tab',{name:tab,exact:true}).click();await expect(page.getByRole('button',{name:'Próxima página',exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Página anterior',exact:true})).toHaveCount(0);
  if(tab!=='RD'){await expect(page.getByText('Não há dados disponíveis para esta guia.',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Configurar colunas'})).toHaveCount(0);}
 }
});
