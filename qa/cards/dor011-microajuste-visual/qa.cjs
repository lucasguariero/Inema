const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const output = __dirname;
const base = process.env.PAUTA_BASE || 'http://127.0.0.1:3000/';
const baseline = process.env.PAUTA_BASELINE === '1';
const styles = el => {
  const s = getComputedStyle(el);
  return Object.fromEntries(['fontSize', 'fontFamily', 'fontWeight', 'letterSpacing', 'lineHeight', 'borderRadius', 'color', 'backgroundColor', 'padding', 'flexShrink', 'whiteSpace'].map(k => [k, s[k]]));
};
(async () => {
  fs.mkdirSync(path.join(output, 'prints'), { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const measurements = [];
  for (const [width, height] of [[1920, 1080], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${base}?rota=fisc-pauta-gestor-registros`);
    const legend = page.locator('[data-leg="22"]');
    await expect(legend).toHaveText('Expanda o grupo para visualizar os filtros e recolha-o quando não precisar utilizá-los.');
    const metrics = await legend.evaluate(el => {
      const tabs = document.querySelector('.pauta-gestor .fi-tabs').getBoundingClientRect();
      const title = document.querySelector('.pauta-gestor h1').getBoundingClientRect();
      const box = el.getBoundingClientRect();
      const first = el.nextElementSibling.getBoundingClientRect();
      const s = getComputedStyle(el);
      return { titleToTabs: tabs.top - title.bottom, tabsToLegend: box.top - tabs.bottom, legendToFilters: first.top - box.bottom, fontSize: s.fontSize, color: s.color, background: s.backgroundColor, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    if (!baseline) {
      assert.equal(metrics.tabsToLegend, 8);
      assert.equal(metrics.legendToFilters, 12);
      assert.equal(metrics.fontSize, '12px');
      assert.equal(metrics.background, 'rgba(0, 0, 0, 0)');
      assert.equal(metrics.overflow, false);
    }
    await expect(page.getByRole('tab')).toHaveCount(8);
    await expect(page.getByRole('button', { name: /^Expandir / })).toHaveCount(4);
    await expect(page.locator('.pauta-gestor tbody tr')).toHaveCount(10);
    if (width < 1024) await page.getByRole('button', { name: 'Menu principal', exact: true }).click();
    const item = page.locator('#menu-fisc-pauta-gestor-registros');
    const itemBox = await item.boundingBox();
    if (!baseline) {
      const badge = item.getByText('DOR011', { exact: true });
      await expect(badge).toBeVisible();
      const activeStyle = await badge.evaluate(styles);
      assert.equal(activeStyle.flexShrink, '0');
      assert.equal(activeStyle.whiteSpace, 'nowrap');
      const aligned = await badge.evaluate(el => {
        const badge = el.getBoundingClientRect(), item = el.parentElement.getBoundingClientRect();
        return Math.abs(item.y + item.height / 2 - badge.y - badge.height / 2) < 1 && badge.right <= item.right;
      });
      assert.ok(aligned, 'badge central e contido no item');
      // Compare the existing inactive DR tag renderer; data and shared component are not modified.
      const reference = page.locator('#menu-fauna-especies span').last();
      const referenceStyle = await reference.evaluate(styles);
      assert.equal(activeStyle.fontSize, referenceStyle.fontSize);
      assert.equal(activeStyle.fontFamily, referenceStyle.fontFamily);
      assert.equal(activeStyle.borderRadius, referenceStyle.borderRadius);
      assert.equal(activeStyle.padding, referenceStyle.padding);
    }
    measurements.push({ width, height, ...metrics, sidebarHeight: itemBox.height });
    await page.screenshot({ path: path.join(output, 'prints', `${baseline ? 'Antes' : 'Print'} ${width === 1920 ? '01' : '02'} - ${width}px tabs legenda e tag.png`), animations: 'disabled' });
    if (width < 1024) {
      await page.getByRole('button', { name: 'Menu principal', exact: true }).click();
      if (!baseline) await page.screenshot({ path: path.join(output, 'prints', 'Print 03 - 390px orientacao filtros.png'), animations: 'disabled' });
    }
    for (const tab of ['RA', 'AC']) {
      await page.getByRole('tab', { name: tab, exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Não há dados disponíveis', exact: true })).toBeVisible();
      await expect(legend).toHaveCount(0);
    }
  }
  assert.equal(errors.length, 0, errors.join('\n'));
  const beforePath = path.join(output, 'baseline.json');
  if (!baseline && fs.existsSync(beforePath)) {
    const before = JSON.parse(fs.readFileSync(beforePath));
    measurements.forEach((m, i) => {
      assert.equal(m.titleToTabs, before.measurements[i].titleToTabs);
      assert.equal(m.sidebarHeight, before.measurements[i].sidebarHeight);
      assert.equal(m.color, before.measurements[i].color);
    });
  }
  const report = { base, measurements, errors, status: 'PASS' };
  fs.writeFileSync(path.join(output, baseline ? 'baseline.json' : process.env.PAUTA_BASE ? 'resultado-producao.json' : 'resultado-local.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exitCode = 1; });
