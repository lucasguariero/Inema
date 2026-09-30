import re, os

files = [
    'src/pages/uc/PesquisaCientificaPage.tsx',
    'src/pages/uc/AtividadesDidaticasPage.tsx',
    'src/pages/uc/AutorizacaoVisitacaoPage.tsx',
    'src/pages/uc/AgendamentoVisitacaoPage.tsx',
    'src/pages/fiscalizacao/CadastroPlantonistaPage.tsx',
    'src/pages/fiscalizacao/CadastroEscalaPage.tsx'
]

for fpath in files:
    print('=== ' + fpath + ' ===')
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    h1s = re.findall(r'<h1[^>]*>.*?</h1>', content, re.DOTALL)
    for h in h1s:
        print('  H1:', h.strip().replace('\n', ' '))
            
    card_titles = re.findall(r'<CardTitle[^>]*>.*?</CardTitle>', content, re.DOTALL)
    for ct in card_titles:
        print('  CardTitle:', ct.strip().replace('\n', ' ')[:90])
