const fs = require('fs');

const files = [
  'src/pages/uc/PesquisaCientificaPage.tsx',
  'src/pages/uc/AgendamentoVisitacaoPage.tsx',
  'src/pages/uc/AtividadesDidaticasPage.tsx',
  'src/pages/uc/AutorizacaoVisitacaoPage.tsx',
  'src/pages/fiscalizacao/CadastroPlantonistaPage.tsx',
  'src/pages/fiscalizacao/CadastroEscalaPage.tsx'
];

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  
  // 1. Remove any icon inside CardTitle
  const cardTitleRegex = /<CardTitle className="[^"]*">\s*<[A-Za-z0-9]+ className="[^"]*" \/>\s*([^<]+)\s*<\/CardTitle>/g;
  let count = 0;
  text = text.replace(cardTitleRegex, (m, p1) => {
    count++;
    return '<CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">' + p1.trim() + '</CardTitle>';
  });

  // 2. Remove any icon inside h1
  const h1Regex = /(<h1[^>]*>)\s*<[A-Za-z0-9]+ className="[^"]*" \/>\s*/g;
  text = text.replace(h1Regex, '$1');

  fs.writeFileSync(file, text, 'utf8');
  console.log(file + ': ' + count + ' CardTitles cleaned');
}
