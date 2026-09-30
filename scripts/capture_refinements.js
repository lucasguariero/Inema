const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('Navegando para http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const brainDir = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4';

  // 1. Sidebar Footer com Botão Assistente Inema
  await page.screenshot({
    path: path.resolve(brainDir, '34-sidebar-assistente-inema.png'),
    clip: { x: 0, y: 750, width: 320, height: 330 }
  });
  console.log('Screenshot 34 (Sidebar Assistente Inema) salvo.');

  // 2. Topbar sem Live Sync e sem ícone Home
  await page.screenshot({
    path: path.resolve(brainDir, '35-topbar-no-livesync-no-home.png'),
    clip: { x: 280, y: 0, width: 1640, height: 75 }
  });
  console.log('Screenshot 35 (Topbar sem Live Sync e Home) salvo.');

  // 3. Abrir o Menu Dropdown de Perfil para verificar o Email que não quebra
  // Clicar no botão do perfil (Lucas Manager)
  const profileButton = await page.$('button:has-text("Lucas Manager")');
  if (profileButton) {
    await profileButton.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.resolve(brainDir, '36-profile-dropdown-email-fixed.png'),
      clip: { x: 1550, y: 0, width: 360, height: 300 }
    });
    console.log('Screenshot 36 (Profile Dropdown Email Fixed) salvo.');
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
