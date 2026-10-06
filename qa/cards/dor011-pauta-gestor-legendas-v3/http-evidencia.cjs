const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const url='https://inema.acto.com.br/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor';const r=await fetch(url);if(!r.ok)throw Error('HTTP '+r.status);const html=await r.text();
 const bundle=html.match(/src="(\/assets\/index-[\w-]+\.js)"/)[1],css=html.match(/href="(\/assets\/index-[\w-]+\.css)"/)[1];
 fs.writeFileSync(path.join(__dirname,'logs','html-producao-final.html'),html);
 fs.writeFileSync(path.join(__dirname,'logs','http-publicado.json'),JSON.stringify({date:new Date().toISOString(),url,status:r.status,bundle,css},null,2));
 console.log(JSON.stringify({status:r.status,bundle,css}));
})().catch(e=>{console.error(e);process.exitCode=1;});
