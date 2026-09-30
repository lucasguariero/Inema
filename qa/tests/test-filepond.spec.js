const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('test filepond upload', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const dummyExe = path.resolve('qa/cards/card-03-emergencia-interna/arquivo-invalido.exe');
  fs.writeFileSync(dummyExe, 'MZ9000');

  console.log('Testando upload de .exe...');
  const fileInput = page.locator('input.filepond--browser').first();
  await fileInput.setInputFiles(dummyExe);
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-filepond-exe.png' });

  // Print text inside filepond
  const fpText = await page.$eval('.filepond--root', el => el.innerText);
  console.log('FILEPOND TEXT:', fpText);
});
