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
}
