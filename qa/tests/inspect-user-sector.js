const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/users', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Ver colunas da tabela de usuários
  const ths = await page.locator('table th').allInnerTexts();
  console.log('Colunas /users:', ths.map(t => t.trim()).filter(Boolean));

  // Clicar em Editar no primeiro usuário (Admin) ou Gestor para ver os campos (Setor, Perfil, etc.)
  const editBtn = page.locator('table tbody tr').first().locator('a:has-text("Editar"), button:has-text("Editar")');
  if (await editBtn.count() > 0) {
    await editBtn.click();
    await page.waitForTimeout(2000);
    console.log('Edit User URL:', page.url());
    
    // Pegar todos os campos e selects do formulário
    const userFields = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('label, select, input')).map(el => ({
        tag: el.tagName,
        text: el.innerText ? el.innerText.trim() : '',
        name: el.getAttribute('name'),
        value: el.value || null
      }));
    });
    console.log('Campos do usuário:\n', JSON.stringify(userFields.filter(f => f.text || f.name), null, 2));
  }

  await browser.close();
})();
