const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function inspectEnvironments() {
  const browser = await chromium.launch({ headless: true });
  const printsDir = path.resolve(__dirname, '..', 'prints_roteiro');
  if (!fs.existsSync(printsDir)) fs.mkdirSync(printsDir, { recursive: true });

  const credentials = {
    login: '000.000.000-00',
    pass: 'admin123'
  };

  const envs = [
    {
      name: 'hml_legado',
      loginUrl: 'https://gla-inema-hml.acto.com.br/login',
      label: 'GLA Legado (HML)'
    },
    {
      name: 'dev_novo',
      loginUrl: 'https://gla-inema-dev.acto.com.br/',
      label: 'GLA Novo / Dev'
    }
  ];

  for (const env of envs) {
    console.log(`\n==============================================`);
    console.log(`Iniciando inspeção: ${env.label} (${env.loginUrl})`);
    console.log(`==============================================`);

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await page.goto(env.loginUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);

      // Print do Login
      const loginPrint = path.join(printsDir, `${env.name}_01_login.png`);
      await page.screenshot({ path: loginPrint });
      console.log(`Print login salvo: ${loginPrint}`);

      // Verificar campos de login (se já estiver logado ou se tiver form)
      const inputCpf = page.locator('input[type="text"], input[name*="cpf"], input[name*="login"], input[id*="cpf"]').first();
      const inputPass = page.locator('input[type="password"]').first();
      const btnEntrar = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Acessar"), input[type="submit"]').first();

      if (await inputCpf.count() > 0 && await inputPass.count() > 0) {
        console.log(`Preenchendo credenciais em ${env.label}...`);
        await inputCpf.fill(credentials.login);
        await inputPass.fill(credentials.pass);
        await page.waitForTimeout(500);
        await btnEntrar.click();
        await page.waitForTimeout(4000);
      } else {
        console.log(`Já logado ou campos de login não convencionais.`);
      }

      console.log(`URL pós-login: ${page.url()}`);
      const homePrint = path.join(printsDir, `${env.name}_02_pos_login.png`);
      await page.screenshot({ path: homePrint });
      console.log(`Print pós-login salvo: ${homePrint}`);

      // Pegar estrutura do sidebar / menu
      const navTexts = await page.locator('nav, aside, #sidebar, .sidebar, .fi-sidebar').allInnerTexts();
      console.log(`Estrutura menu resumida (${env.name}):`, navTexts.join(' ').substring(0, 300));

      // Se tiver menu, tentar capturar mais uma tela de listagem / processos
      const linkProcessos = page.locator('a:has-text("Processo"), a:has-text("Regulação"), a:has-text("Fiscalização"), a:has-text("Pauta")').first();
      if (await linkProcessos.count() > 0) {
        const linkHref = await linkProcessos.getAttribute('href');
        console.log(`Clicando ou navegando para: ${linkHref || 'primeiro link relevante'}`);
        await linkProcessos.click();
        await page.waitForTimeout(3000);
        const screenPrint = path.join(printsDir, `${env.name}_03_modulo.png`);
        await page.screenshot({ path: screenPrint });
        console.log(`Print módulo salvo: ${screenPrint}`);
      }

    } catch (e) {
      console.error(`Erro ao inspecionar ${env.label}:`, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\nInspeção concluída com sucesso!');
  process.exit(0);
}

inspectEnvironments();
