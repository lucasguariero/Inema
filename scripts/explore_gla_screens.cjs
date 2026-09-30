const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    console.log('1. Acessando https://gla-inema-hml.acto.com.br/login...');
    await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle', timeout: 30000 });

    const inputCpf = page.locator('input[type="text"]').first();
    const inputPass = page.locator('input[type="password"]').first();
    const btnEntrar = page.locator('button[type="submit"]').first();

    if (await inputCpf.count() > 0) {
      await inputCpf.fill('000.000.000-00');
      await inputPass.fill('admin123');
      await btnEntrar.click();
      await page.waitForTimeout(4000);
    }

    console.log('2. Logado com sucesso. URL atual:', page.url());

    // Clica em todos os botões de acordeão da sidebar para abrir todos os grupos
    const groupButtons = await page.locator('aside button, .fi-sidebar button, nav button').all();
    console.log(`Encontrados ${groupButtons.length} botões na sidebar.`);
    for (const btn of groupButtons) {
      try {
        await btn.click({ timeout: 1000 });
        await page.waitForTimeout(150);
      } catch (e) {}
    }

    // Extrai todo o HTML da sidebar e todos os links
    const sidebarData = await page.evaluate(() => {
      const groups = [];
      const groupEls = document.querySelectorAll('.fi-sidebar-group, aside > div, aside section, nav > div');
      
      const allLinks = Array.from(document.querySelectorAll('aside a, nav a, .fi-sidebar a')).map(a => {
        return {
          label: a.innerText.trim().replace(/\n+/g, ' '),
          href: a.getAttribute('href')
        };
      });

      return {
        allLinks,
        fullText: document.querySelector('aside, .fi-sidebar, nav')?.innerText || ''
      };
    });

    console.log('3. Links extraídos do GLA:');
    console.log(JSON.stringify(sidebarData.allLinks, null, 2));

    const outputPath = path.resolve(__dirname, '../qa/gla_screens_full_dump.json');
    fs.writeFileSync(outputPath, JSON.stringify(sidebarData, null, 2));
    console.log('Salvo com sucesso em:', outputPath);

  } catch (err) {
    console.error('Erro na exploração do GLA:', err);
  } finally {
    await browser.close();
  }
}

main();
