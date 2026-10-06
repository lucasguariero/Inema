const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
const base=process.env.PAUTA_BASE||'http://127.0.0.1:3000/';
const url=base+'?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor';
const prints=path.join(__dirname,process.env.PAUTA_BASE?'prints-producao':'prints');fs.mkdirSync(prints,{recursive:true});
// Transcrição independente da lista oficial, PDF original pp. 12–13, conferida no render.
const oficial={
  1:'Selecione a origem registrada.',2:'Disponível quando a origem selecionada for Ofício.',3:'Disponível conforme a origem selecionada.',
  4:'Selecione um município do Estado da Bahia.',5:'Informe a data inicial e a data final do registro.',6:'Informe o identificador completo do registro.',
  7:'Informe uma ou mais palavras completas. A pesquisa desconsidera acentuação e não aceita termos parciais.',8:'Pesquise por nome ou CPF/CNPJ conforme o tipo de registro.',
  9:'Informe uma coordenada em Grau Decimal, Grau/Minuto/Segundo ou UTM.',10:'Selecione uma situação aplicável à guia ativa.',11:'Selecione primeiro o eixo e depois o subitem.',
  12:'Selecione a classificação da área quando aplicável.',13:'Selecione uma faixa de dias em aberto.',14:'Disponível somente para Registro de Emergência.',
  15:'Selecione uma Unidade de Conservação quando aplicável.',16:'Quantidade de registros ou processos com dados de localização correspondentes.',
  17:'Selecione o motivo que fundamenta o arquivamento.',18:'Obrigatória quando o motivo selecionado for Outros.',19:'Informe a justificativa da ação.',
  20:'Registre uma observação sem alterar a situação do registro.',21:'Selecione as colunas que deseja visualizar.',
  22:'Expanda o grupo para visualizar os filtros e recolha-o quando não precisar utilizá-los.',23:'Adicione arquivos que complementem ou documentem o registro.',
  24:'Acesse o GeoBahia para analisar a localização do registro e dos documentos relacionados.'
};
const groups=['Dados do registro','Localização','Período e situação','Classificação'];
const groupIds=[[1,3,6,7,8],[4,9,12,15],[5,10,13],[11,14]];
const pick=async(page,label,value)=>{await page.getByRole('button',{name:label,exact:true}).click();await page.getByRole('option',{name:value,exact:true}).click();};
const open=async(page,name)=>{await page.getByRole('button',{name:/^Ações de/}).first().click();await page.getByRole('dialog').getByRole('button',{name,exact:true}).click();};
const geo=async page=>{await open(page,'Visualizar');await page.getByRole('link',{name:'-12.910000, -38.350000',exact:true}).first().click();};
const check=async(page,n)=>{
  const el=page.locator(`[data-leg="${n}"]`);await expect(el).toHaveCount(1);await expect(el).toBeVisible();await expect(el).toHaveText(oficial[n]);
  const style=await el.evaluate(e=>({font:getComputedStyle(e).fontSize,color:getComputedStyle(e).color,text:e.textContent}));expect(style.font).toBe('12px');
  expect(style.text).not.toMatch(/LEG\d{3}|RN\d{3}|DR\d{3}/);
};
const screenshot=(page,name)=>page.screenshot({path:path.join(prints,name+'.png'),animations:'disabled'});
test.beforeEach(async({page})=>{await page.goto(url);await expect(page.locator('h1')).toContainText('Pauta do Gestor - Registros');});
for(const n of Object.keys(oficial).map(Number).filter(n=>n!==2))test(`LEG${String(n).padStart(3,'0')} texto literal e campo aplicável`,async({page})=>{
  if(n<=15){const index=groupIds.findIndex(ids=>ids.includes(n));await page.getByRole('button',{name:'Expandir '+groups[index]}).click();if(n===3)await pick(page,'Origem','Ofício');}
  else if(n===16)await page.getByRole('button',{name:/^Ver duplicados:/}).first().click();
  else if([17,18,19].includes(n)){await open(page,'Arquivar');if(n===18)await pick(page,'Motivo do arquivamento','Outros');}
  else if(n===20)await open(page,'Adicionar comentário');
  else if(n===21)await page.getByRole('button',{name:'Configurar colunas',exact:true}).click();
  else if(n===23)await open(page,'Adicionar arquivo');
  else if(n===24)await geo(page);
  await check(page,n);await expect(page.locator('[data-leg="2"]')).toHaveCount(0);await expect(page.getByText(oficial[2],{exact:true})).toHaveCount(0);
});
for(const tab of ['Todos','RD','RE','RA','RC','RT','OF','AC'])test('Aplicabilidade negativa e positiva das LEG por guia '+tab,async({page})=>{
  await page.getByRole('tab',{name:tab,exact:true}).click();
  if(['RA','AC'].includes(tab)){await expect(page.locator('[data-leg]')).toHaveCount(0);return;}
  for(const group of groups){const button=page.getByRole('button',{name:'Expandir '+group});if(await button.count())await button.click();}
  const expected=[4,5,6,7,9,10,13,22];
  if(['Todos','RD','RE','RC'].includes(tab))expected.push(1);
  if(['Todos','RD','RE','RC','RT'].includes(tab))expected.push(8);
  if(['Todos','RD','RT','RC'].includes(tab))expected.push(11);
  if(['Todos','RD','RE','RT'].includes(tab))expected.push(12,15);
  if(['Todos','RE'].includes(tab))expected.push(14);
  expect((await page.locator('[data-leg]').evaluateAll(es=>es.map(e=>Number(e.dataset.leg)))).sort((a,b)=>a-b)).toEqual(expected.sort((a,b)=>a-b));
  for(const n of expected)await check(page,n);
});
test('Condições: recolhimento, setor e LEG002 bloqueada sem restringir Órgão',async({page})=>{
  await expect(page.locator('[data-leg]')).toHaveCount(1);await check(page,22);
  await page.getByRole('button',{name:'Expandir Dados do registro'}).click();await expect(page.getByRole('button',{name:'Órgão',exact:true})).toBeVisible();
  await expect(page.locator('[data-leg="3"]')).toHaveCount(0);await pick(page,'Origem','Ofício');await check(page,3);
  await pick(page,'Origem','Ouvidoria');await expect(page.locator('[data-leg="3"]')).toHaveCount(0);
  await page.getByRole('button',{name:'Recolher Dados do registro'}).click();await expect(page.locator('[data-leg]')).toHaveCount(1);
});
test('Ações: Outros, confirmação e contexto não vazam helpers',async({page})=>{
  await open(page,'Arquivar');const d=page.getByRole('dialog');await expect(d.locator('[data-leg="18"]')).toHaveCount(0);
  await pick(page,'Motivo do arquivamento','Outros');await check(page,18);await page.getByRole('textbox',{name:'Descrição do motivo'}).fill('Ensaio de aplicabilidade');
  await page.getByRole('textbox',{name:'Justificativa'}).fill('Ensaio sem envio');await d.getByRole('button',{name:'Arquivar',exact:true}).click();await expect(d.locator('[data-leg]')).toHaveCount(0);
  await d.getByRole('button',{name:'Cancelar',exact:true}).click();await check(page,17);await check(page,18);await check(page,19);
  await page.keyboard.press('Escape');await page.getByRole('button',{name:/^Ver duplicados:/}).first().click();await check(page,16);
  await d.getByRole('button',{name:/^Visualizar /}).first().click();await expect(d.locator('[data-leg]')).toHaveCount(0);await d.getByRole('button',{name:'Voltar',exact:true}).click();await check(page,16);
});
test('Permissões e referência ausente: helper só acompanha controle autorizado',async({page})=>{
  test.skip(!!process.env.PAUTA_BASE,'Harness somente local; sem mutação externa.');
  await page.evaluate(async()=>{const d=await import('/src/lib/pautaGestor.ts'),h=await import('/qa/cards/dor011-pauta-gestor-microrefino-v2/harness.tsx');h.mountSession({...d.SESSAO_SIMULADA,verDemandante:false});});
  await page.locator('#audit-root').getByRole('button',{name:'Expandir Dados do registro'}).click();await expect(page.locator('[data-leg="8"]')).toHaveCount(0);
  await page.goto(url);await page.evaluate(async()=>{const d=await import('/src/lib/pautaGestor.ts'),m=await import('/src/data/pautaGestorMock.ts'),h=await import('/qa/cards/dor011-pauta-gestor-microrefino-v2/harness.tsx');const rows=m.criarRegistrosPauta();h.mountDialog({...rows[0],municipio:'',coordenada:undefined,coordenadaDocumento:undefined,documentos:[],arquivos:[]},rows,d.SESSAO_SIMULADA,'geo');});
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('não possui coordenada nem município');await expect(page.locator('[data-leg="24"]')).toHaveCount(0);await expect(page.getByRole('button',{name:'Abrir GeoBahia'})).toHaveCount(0);
});
test('TL011 disabled neutro e LEG024 não afirmam integração funcional',async({page})=>{
  await geo(page);const button=page.getByRole('button',{name:'Abrir GeoBahia',exact:true});await expect(button).toBeDisabled();await check(page,24);
  await expect(page.getByText('GeoBahia: integração pendente.',{exact:true})).toBeVisible();
  const state=await button.evaluate(e=>({cursor:getComputedStyle(e).cursor,opacity:getComputedStyle(e).opacity,bg:getComputedStyle(e).backgroundColor,href:e.getAttribute('href')}));
  expect(state.cursor).toBe('not-allowed');expect(Number(state.opacity)).toBeLessThan(1);expect(state.bg).not.toBe('rgb(15, 76, 58)');expect(state.href).toBeNull();
});
test('Helpers de ação respeitam campos, desanexação e permissão negada',async({page})=>{
  await open(page,'Arquivar');await pick(page,'Motivo do arquivamento','Outros');await check(page,18);
  await pick(page,'Motivo do arquivamento','Informações insuficientes');await expect(page.locator('[data-leg="18"]')).toHaveCount(0);await page.keyboard.press('Escape');
  await open(page,'Alterar eixo temático');await check(page,11);await page.keyboard.press('Escape');
  if(process.env.PAUTA_BASE)return;
  await page.evaluate(async()=>{const d=await import('/src/lib/pautaGestor.ts'),m=await import('/src/data/pautaGestorMock.ts'),h=await import('/qa/cards/dor011-pauta-gestor-microrefino-v2/harness.tsx');const rows=m.criarRegistrosPauta();h.mountDialog({...rows[0],pai:rows[1].id},rows,d.SESSAO_SIMULADA,'desanexar');});
  await check(page,19);await expect(page.getByRole('textbox',{name:'Justificativa'})).toHaveAttribute('aria-describedby','leg-acao-19');
  await page.goto(url);await page.evaluate(async()=>{const d=await import('/src/lib/pautaGestor.ts'),m=await import('/src/data/pautaGestorMock.ts'),h=await import('/qa/cards/dor011-pauta-gestor-microrefino-v2/harness.tsx');const rows=m.criarRegistrosPauta();h.mountDialog(rows[0],rows,{...d.SESSAO_SIMULADA,permissoes:['visualizar']},'arquivar');});
  await expect(page.getByRole('dialog').getByRole('heading',{name:'Acesso negado'})).toBeVisible();await expect(page.getByRole('dialog').locator('[data-leg]')).toHaveCount(0);
});
for(const [name,width,height] of [['FullHD',1920,1080],['4K',3840,2160],['390px',390,844]])test('Visual '+name+' legibilidade, helpers, rolagem e modais',async({page})=>{
  await page.setViewportSize({width,height});let i=width===1920?1:width===3840?8:12;
  await screenshot(page,`Print ${String(i++).padStart(2,'0')} - ${name} filtros recolhidos LEG022`);
  for(const group of groups)await page.getByRole('button',{name:'Expandir '+group}).click();await pick(page,'Origem','Ofício');
  await page.locator('[data-leg="7"]').scrollIntoViewIfNeeded();await screenshot(page,`Print ${String(i++).padStart(2,'0')} - ${name} LEG001 a LEG015 filtros`);
  for(const el of await page.locator('[data-leg]').all())expect(await el.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  await page.locator('[data-leg="14"]').scrollIntoViewIfNeeded();await screenshot(page,`Print ${String(i++).padStart(2,'0')} - ${name} periodo e classificacao`);
  await page.goto(url);await open(page,'Arquivar');await pick(page,'Motivo do arquivamento','Outros');await page.getByRole('textbox',{name:'Justificativa'}).focus();
  await screenshot(page,`Print ${String(i++).padStart(2,'0')} - ${name} LEG017 LEG018 LEG019 arquivar`);await page.keyboard.press('Escape');
  await geo(page);await check(page,24);const geoButton=page.getByRole('button',{name:'Abrir GeoBahia',exact:true});await geoButton.scrollIntoViewIfNeeded();
  await screenshot(page,`Print ${String(i++).padStart(2,'0')} - ${name} TL011 LEG024 disabled`);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(geoButton).toBeVisible();await expect(page.getByRole('dialog').getByRole('button',{name:'Cancelar',exact:true})).toBeVisible();
});
test('Evidências agrupadas LEG016 LEG020 LEG021 LEG023',async({page})=>{
  await page.getByRole('button',{name:/^Ver duplicados:/}).first().click();await screenshot(page,'Print 17 - FullHD TL005 LEG016');await page.keyboard.press('Escape');
  await open(page,'Adicionar comentário');await screenshot(page,'Print 18 - FullHD comentario LEG020');await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Configurar colunas',exact:true}).click();await screenshot(page,'Print 19 - FullHD configuracao LEG021');await page.keyboard.press('Escape');
  await open(page,'Adicionar arquivo');await screenshot(page,'Print 20 - FullHD arquivos LEG023');
});
