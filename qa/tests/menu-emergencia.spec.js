const { test, expect } = require('@playwright/test');
const path = require('path');

const pages = [
  { name: 'Início', file: 'src/index.html' },
  { name: 'Fiscalização', file: 'src/fiscalizacao.html' },
  { name: 'Emergência Interna', file: 'src/emergencia-quimica.html' },
  { name: 'Emergência Externa', file: 'src/emergencia-quimica-externa.html' },
  { name: 'Consulta Externa', file: 'src/consulta-externa.html' },
  { name: 'Consulta Interna DIFIS', file: 'src/consulta-interna.html' },
  { name: 'Relatórios Gerenciais', file: 'src/relatorios.html' },
  { name: 'Gestão de Fauna', file: 'src/fauna.html' },
];

for (const p of pages) {
  test(`Menu lateral unificado em ${p.name} deve conter o padrão idêntico de navegação`, async ({ page }) => {
    const filePath = path.resolve(__dirname, '../../', p.file);
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(`file:///${filePath.replace(/\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
    await page.setViewportSize({ width: 1280, height: 800 });

    const sidebar = page.locator('#sidebar');
    await expect(sidebar).toBeVisible();

    // Validar itens obrigatórios do menu lateral unificado
    await expect(sidebar.getByText('Início')).toBeVisible();
    await expect(sidebar.getByText('Fiscalização')).toBeVisible();
    await expect(sidebar.getByText('Atendente')).toBeVisible();
    await expect(sidebar.getByText('Denúncia - Cidadão')).toBeVisible();
    await expect(sidebar.getByText('Emergência Externa')).toBeVisible();
    await expect(sidebar.getByText('Emergência Interna')).toBeVisible();
    await expect(sidebar.getByText('Consulta Externa')).toBeVisible();
    await expect(sidebar.getByText('Consulta Interna DIFIS')).toBeVisible();
    await expect(sidebar.getByText('Relatórios Gerenciais')).toBeVisible();
    await expect(sidebar.getByText('✦ Assistente INEMA')).toBeVisible();

    expect(errors).toHaveLength(0);
  });
}

