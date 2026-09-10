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

    // Validar itens obrigatórios do menu lateral com padrão Enterprise Navigation
    await expect(sidebar.getByText('Início')).toBeVisible();
    await expect(sidebar.getByText('Fiscalização')).toBeVisible();
    await expect(sidebar.getByText('Denúncias', { exact: true })).toBeVisible();
    await expect(sidebar.getByText('Atendente')).toBeVisible();
    await expect(sidebar.getByText('Formulário Cidadão')).toBeVisible();
    await expect(sidebar.getByText('Emergências Químicas', { exact: true })).toBeVisible();
    await expect(sidebar.getByText('Cadastro Interno')).toBeVisible();
    await expect(sidebar.getByText('Registro Externo')).toBeVisible();
    await expect(sidebar.getByText('Consultas', { exact: true })).toBeVisible();
    await expect(sidebar.getByText('Consulta Cidadão')).toBeVisible();
    await expect(sidebar.getByText('Painel Interno DIFIS')).toBeVisible();
    await expect(sidebar.getByText('Relatórios Gerenciais')).toBeVisible();
    await expect(sidebar.getByText('Corporativo')).toBeVisible();
    await expect(sidebar.getByText('✦ Assistente INEMA')).toBeVisible();

    // Validar ausência de ruídos: sem marcadores/bullets (• ou rounded-full dots) e sem tags "Em breve"
    await expect(sidebar.locator('text=•')).toHaveCount(0);
    await expect(sidebar.locator('text="Em breve"')).toHaveCount(0);
    await expect(sidebar.locator('.rounded-full:not(#sidebarBadgeEmergencias)')).toHaveCount(0);

    expect(errors).toHaveLength(0);
  });
}

