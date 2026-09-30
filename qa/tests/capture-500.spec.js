const { test } = require('@playwright/test');

async function setFilamentDate(page, inputId, dateIso) {
  await page.evaluate(({ id, val }) => {
    const el = document.getElementById(id);
    const container = el.closest('[x-data]');
    const data = window.Alpine ? window.Alpine.$data(container) : (container._x_dataStack ? container._x_dataStack[0] : null);
    if (data) {
      data.state = val;
    }
  }, { id: inputId, val: dateIso });
}

test('capture 500 exception details', async ({ page }) => {
  let errorHtml = '';
  page.on('response', async res => {
    if (res.status() === 500) {
      try {
        errorHtml = await res.text();
      } catch (e) {}
    }
  });

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Select plantonista
  await page.locator('button#form\\.espl_plan_id').click();
  await page.waitForTimeout(600);
  await page.locator('li[role="option"]:has-text("Bruno Carvalho")').first().click();
  await page.waitForTimeout(600);

  // Select municipio
  await page.locator('button#form\\.municipios').click();
  await page.waitForTimeout(600);
  const searchInput = page.locator('input[placeholder="Comece a digitar para pesquisar..."]:visible').first();
  await searchInput.fill('Salvador');
  await page.waitForTimeout(1000);
  await page.locator('li[role="option"]:has-text("Salvador")').first().click();
  await page.waitForTimeout(600);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // Set dates
  await setFilamentDate(page, 'form.espl_data_inicio', '2026-09-08');
  await setFilamentDate(page, 'form.espl_data_fim', '2026-09-20');
  await page.waitForTimeout(1000);

  // Click Criar
  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(3000);

  // Extract title and error from errorHtml
  if (errorHtml) {
    const titleMatch = errorHtml.match(/<title>(.*?)<\/title>/i);
    console.log('500 TITLE:', titleMatch ? titleMatch[1] : 'no title');
    // Extract Laravel exception message
    const excMatch = errorHtml.match(/class="exception_title"[^>]*>(.*?)<\/span>/s) ||
                     errorHtml.match(/<h1[^>]*>(.*?)<\/h1>/s) ||
                     errorHtml.match(/<span class="text-xl[^>]*>(.*?)<\/span>/s);
    console.log('500 EXCEPTION:', excMatch ? excMatch[1].replace(/<[^>]+>/g, '').trim() : 'no match');
    // Also print first 1000 chars of body or search for exception
    const textSnippet = errorHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 1500);
    console.log('500 TEXT SNIPPET:', textSnippet);
  } else {
    console.log('No 500 captured!');
  }
});
