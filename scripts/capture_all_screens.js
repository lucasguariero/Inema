const { chromium, devices } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const iPhone = devices['iPhone 13'];
const printsDir = path.resolve('public/galeria-prints');
if (!fs.existsSync(printsDir)) fs.mkdirSync(printsDir, { recursive: true });

async function run() {
  console.log('Iniciando preview local do Vite na porta 4173...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      const out = data.toString();
      if (out.includes('4173')) resolve();
    });
    setTimeout(resolve, 3000);
  });

  const browser = await chromium.launch({ headless: true });

  const desktopScenarios = [
    { id: '01-dashboard-azul-petroleo', title: 'Dashboard Executivo - Sidebar Azul Petróleo (#0c4353)', category: 'dashboard', url: 'http://localhost:4173/?route=relatorios&theme=verde-azul&dark=false', livePath: '/?route=relatorios&theme=verde-azul' },
    { id: '02-dashboard-verde', title: 'Dashboard Executivo - Sidebar Verde Floresta (#0F4C3A)', category: 'dashboard', url: 'http://localhost:4173/?route=relatorios&theme=verde&dark=false', livePath: '/?route=relatorios&theme=verde' },
    { id: '03-dashboard-branca', title: 'Dashboard Executivo - Sidebar Branca Institucional', category: 'dashboard', url: 'http://localhost:4173/?route=relatorios&theme=branca&dark=false', livePath: '/?route=relatorios&theme=branca' },
    { id: '04-dashboard-dark', title: 'Dashboard Executivo - Modo Escuro (Dark Mode)', category: 'dashboard', url: 'http://localhost:4173/?route=relatorios&theme=verde-azul&dark=true', isDark: true, livePath: '/?route=relatorios&dark=true' },
    { id: '05-dashboard-filtros', title: 'Dashboard Executivo - Painel Lateral de Filtros Avançados', category: 'dashboard', url: 'http://localhost:4173/?route=relatorios&dark=false', openFilter: true, livePath: '/?route=relatorios' },
    { id: '06-relatorios-antigo', title: 'Relatórios Gerenciais - Versão Antiga Sincronizada (Doc Requisitos)', category: 'dashboard', url: 'http://localhost:4173/relatorios-antigo.html', livePath: '/relatorios-antigo' },
    { id: '07-denuncia-interna-light', title: 'Fiscalização: Denúncia Interna (DOR001 - Atendente)', category: 'fiscalizacao-interna', url: 'http://localhost:4173/?route=atendente&dark=false', livePath: '/?route=atendente' },
    { id: '08-denuncia-interna-dark', title: 'Fiscalização: Denúncia Interna (DOR001 - Dark Mode)', category: 'fiscalizacao-interna', url: 'http://localhost:4173/?route=atendente&dark=true', isDark: true, livePath: '/?route=atendente&dark=true' },
    { id: '09-denuncia-externa-light', title: 'Fiscalização: Denúncia Cidadão (DOR002 - Anônima/Identificada)', category: 'fiscalizacao-cidadao', url: 'http://localhost:4173/?route=cidadao&dark=false', livePath: '/?route=cidadao' },
    { id: '10-denuncia-externa-dark', title: 'Fiscalização: Denúncia Cidadão (DOR002 - Dark Mode)', category: 'fiscalizacao-cidadao', url: 'http://localhost:4173/?route=cidadao&dark=true', isDark: true, livePath: '/?route=cidadao&dark=true' },
    { id: '11-emergencia-interna-light', title: 'Emergência Química: Cadastro Interno (DOR003 - Plantão DIFIS 24h)', category: 'fiscalizacao-interna', url: 'http://localhost:4173/?route=emergencia-interna&dark=false', livePath: '/?route=emergencia-interna' },
    { id: '12-emergencia-interna-dark', title: 'Emergência Química: Cadastro Interno (DOR003 - Dark Mode)', category: 'fiscalizacao-interna', url: 'http://localhost:4173/?route=emergencia-interna&dark=true', isDark: true, livePath: '/?route=emergencia-interna&dark=true' },
    { id: '13-emergencia-externa-light', title: 'Emergência Química: Comunicação Externa (DOR004 - Transportador/Indústria)', category: 'fiscalizacao-cidadao', url: 'http://localhost:4173/?route=emergencia-externa&dark=false', livePath: '/?route=emergencia-externa' },
    { id: '14-emergencia-externa-dark', title: 'Emergência Química: Comunicação Externa (DOR004 - Dark Mode)', category: 'fiscalizacao-cidadao', url: 'http://localhost:4173/?route=emergencia-externa&dark=true', isDark: true, livePath: '/?route=emergencia-externa&dark=true' },
    { id: '15-consulta-externa-light', title: 'Acompanhamento Cidadão: Consulta de Denúncias e Emergências', category: 'fiscalizacao-cidadao', url: 'http://localhost:4173/?route=consulta-externa&dark=false', livePath: '/?route=consulta-externa' },
    { id: '16-consulta-externa-dark', title: 'Acompanhamento Cidadão: Consulta Cidadão (Dark Mode)', category: 'fiscalizacao-cidadao', url: 'http://localhost:4173/?route=consulta-externa&dark=true', isDark: true, livePath: '/?route=consulta-externa&dark=true' },
    { id: '17-consulta-interna-light', title: 'Operações DIFIS: Painel Técnico Centralizado e Pauta Fiscal', category: 'fiscalizacao-interna', url: 'http://localhost:4173/?route=consulta-interna&dark=false', livePath: '/?route=consulta-interna' },
    { id: '18-consulta-interna-dark', title: 'Operações DIFIS: Painel Técnico Centralizado (Dark Mode)', category: 'fiscalizacao-interna', url: 'http://localhost:4173/?route=consulta-interna&dark=true', isDark: true, livePath: '/?route=consulta-interna&dark=true' }
  ];

  const mobileScenarios = [
    { id: 'm01-dashboard-mobile-light', title: 'Mobile: Dashboard Executivo (iPhone 13 - Modo Claro)', category: 'mobile', route: 'relatorios', isDark: false, livePath: '/?route=relatorios' },
    { id: 'm02-dashboard-mobile-dark', title: 'Mobile: Dashboard Executivo (iPhone 13 - Dark Mode)', category: 'mobile', route: 'relatorios', isDark: true, livePath: '/?route=relatorios&dark=true' },
    { id: 'm03-denuncia-interna-mobile-light', title: 'Mobile: Denúncia Interna DOR001 (iPhone 13 - Modo Claro)', category: 'mobile', route: 'atendente', isDark: false, livePath: '/?route=atendente' },
    { id: 'm04-denuncia-interna-mobile-dark', title: 'Mobile: Denúncia Interna DOR001 (iPhone 13 - Dark Mode)', category: 'mobile', route: 'atendente', isDark: true, livePath: '/?route=atendente&dark=true' },
    { id: 'm05-denuncia-externa-mobile-light', title: 'Mobile: Denúncia Cidadão DOR002 (iPhone 13 - Modo Claro)', category: 'mobile', route: 'cidadao', isDark: false, livePath: '/?route=cidadao' },
    { id: 'm06-denuncia-externa-mobile-dark', title: 'Mobile: Denúncia Cidadão DOR002 (iPhone 13 - Dark Mode)', category: 'mobile', route: 'cidadao', isDark: true, livePath: '/?route=cidadao&dark=true' },
    { id: 'm07-emergencia-interna-mobile-light', title: 'Mobile: Emergência Química DOR003 (iPhone 13 - Modo Claro)', category: 'mobile', route: 'emergencia-interna', isDark: false, livePath: '/?route=emergencia-interna' },
    { id: 'm08-emergencia-interna-mobile-dark', title: 'Mobile: Emergência Química DOR003 (iPhone 13 - Dark Mode)', category: 'mobile', route: 'emergencia-interna', isDark: true, livePath: '/?route=emergencia-interna&dark=true' },
    { id: 'm09-consulta-externa-mobile-light', title: 'Mobile: Consulta Cidadão (iPhone 13 - Modo Claro)', category: 'mobile', route: 'consulta-externa', isDark: false, livePath: '/?route=consulta-externa' },
    { id: 'm10-consulta-externa-mobile-dark', title: 'Mobile: Consulta Cidadão (iPhone 13 - Dark Mode)', category: 'mobile', route: 'consulta-externa', isDark: true, livePath: '/?route=consulta-externa&dark=true' },
    { id: 'm11-consulta-interna-mobile-light', title: 'Mobile: Painel Técnico DIFIS (iPhone 13 - Modo Claro)', category: 'mobile', route: 'consulta-interna', isDark: false, livePath: '/?route=consulta-interna' },
    { id: 'm12-consulta-interna-mobile-dark', title: 'Mobile: Painel Técnico DIFIS (iPhone 13 - Dark Mode)', category: 'mobile', route: 'consulta-interna', isDark: true, livePath: '/?route=consulta-interna&dark=true' }
  ];

  const galleryItems = [];

  // 1. Captura Desktop
  console.log('--- Capturando Desktop (1440x900) ---');
  for (const item of desktopScenarios) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: item.isDark ? 'dark' : 'light'
    });
    const page = await context.newPage();
    await page.goto(item.url, { waitUntil: 'networkidle' });

    if (item.openFilter) {
      try {
        const filterBtn = page.getByRole('button', { name: /filtros/i }).first();
        if (await filterBtn.isVisible()) {
          await filterBtn.click();
          await page.waitForTimeout(600);
        }
      } catch (e) {
        console.log('Erro ao clicar no filtro:', e.message);
      }
    }

    await page.waitForTimeout(500);
    const fileName = `${item.id}.png`;
    const targetFile = path.join(printsDir, fileName);
    await page.screenshot({ path: targetFile });
    console.log(`[Desktop OK] ${fileName}`);

    galleryItems.push({
      id: item.id,
      fileName,
      title: item.title,
      category: item.category,
      device: 'Desktop (1440x900)',
      isDark: !!item.isDark,
      liveUrl: `https://inema-six.vercel.app${item.livePath}`
    });

    await context.close();
  }

  // 2. Captura Mobile iPhone 13
  console.log('--- Capturando Mobile iPhone 13 (390x844) ---');
  for (const item of mobileScenarios) {
    const context = await browser.newContext({
      ...iPhone,
      colorScheme: item.isDark ? 'dark' : 'light'
    });
    const page = await context.newPage();
    const url = `http://localhost:4173/?route=${item.route}&dark=${item.isDark}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const fileName = `${item.id}.png`;
    const targetFile = path.join(printsDir, fileName);
    await page.screenshot({ path: targetFile });
    console.log(`[Mobile OK] ${fileName}`);

    galleryItems.push({
      id: item.id,
      fileName,
      title: item.title,
      category: item.category,
      device: 'Mobile iPhone 13 (390x844)',
      isDark: !!item.isDark,
      liveUrl: `https://inema-six.vercel.app${item.livePath}`
    });

    await context.close();
  }

  await browser.close();
  server.kill();

  // Salvar manifesto dos prints para a página HTML
  fs.writeFileSync('public/galeria-manifest.json', JSON.stringify(galleryItems, null, 2), 'utf8');
  console.log('Capturas concluídas! Total de prints:', galleryItems.length);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
