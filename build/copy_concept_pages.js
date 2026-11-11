const fs = require('fs');
const path = require('path');

const distIndex = path.resolve('dist/index.html');
if (fs.existsSync(distIndex)) {
  const concepts = [
    'conceito-01',
    'conceito-02',
    'conceito-03',
    'proposta-01',
    'proposta-02',
    'inema-light',
    'inema-forest',
    'proposta-verde-azul',
    'proposta-verde',
    'proposta-branca',
    'sidebar-verde-azul',
    'sidebar-verde',
    'sidebar-branca',
    'seia-v2',
    'tales',
    'cotic',
    'ceuc',
    'relatorios',
    'regulacao',
  ];
  for (const c of concepts) {
    // 1. Arquivo plano dist/conceito-01.html (para cleanUrls)
    fs.copyFileSync(distIndex, path.resolve(`dist/${c}.html`));

    // 2. Diretório dist/conceito-01/index.html (para trailing slashes ou subpastas)
    const dir = path.resolve(`dist/${c}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(distIndex, path.resolve(`dist/${c}/index.html`));
    console.log(`Created dist/${c}.html and dist/${c}/index.html`);
  }

  const cerhRoutes = [
    'cerh',
    'cerh/consulta',
    'cerh/demo/resumo',
    'cerh/demo/uso-da-agua',
    'cerh/demo/barragem',
    'cerh/demo/intervencao',
    'cerh/demo/captacao-superficial',
    'cerh/demo/captacao-subterranea',
    'cerh/demo/lancamento-efluentes',
  ];
  for (const r of cerhRoutes) {
    const filePath = path.resolve(`dist/${r}.html`);
    const fileDir = path.dirname(filePath);
    if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });
    fs.copyFileSync(distIndex, filePath);

    const dir = path.resolve(`dist/${r}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(distIndex, path.resolve(`dist/${r}/index.html`));
    console.log(`Created dist/${r}.html and dist/${r}/index.html`);
  }
}

const galeriaHtml = path.resolve('public/galeria.html');
if (fs.existsSync(galeriaHtml)) {
  const galeriaDir = path.resolve('dist/galeria');
  if (!fs.existsSync(galeriaDir)) fs.mkdirSync(galeriaDir, { recursive: true });
  fs.copyFileSync(galeriaHtml, path.resolve('dist/galeria/index.html'));
  console.log('Created dist/galeria/index.html');
}
