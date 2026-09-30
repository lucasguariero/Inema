const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  const printsDir = path.join(__dirname, '..', 'qa', 'cards', 'card-05-consulta-externa', 'prints');
  fs.mkdirSync(printsDir, { recursive: true });

  const url = 'file:///' + path.resolve(__dirname, '..', 'src', 'consulta-externa.html').replace(/\\/g, '/');
  await page.goto(url);

  // Print 01: Tela de Consulta e Listagem
  await page.screenshot({ path: path.join(printsDir, 'Print 01 - Consulta de Registros Externos e Filtros.png') });

  // Print 02: Filtro condicional RE
  await page.selectOption('#filtroTipoRegistro', 'Emergência Química (RE)');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(printsDir, 'Print 02 - Filtro Tipo da Emergencia Quimica Habilitado para RE.png') });

  // Print 03: Validação de Datas MSG001
  await page.fill('#filtroDataInicial', '2026-09-08');
  await page.fill('#filtroDataFinal', '2026-09-01');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(printsDir, 'Print 03 - Validacao de Periodo Invalido MSG001.png') });

  // Limpar filtros e abrir Drawer
  await page.click('button:has-text("Limpar filtros")');
  await page.waitForTimeout(300);
  await page.click('button[title*="Visualizar registro"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(printsDir, 'Print 04 - Visualizacao Protegida Somente Leitura RN010.png') });

  // Fechar drawer e abrir modal de anexo
  await page.click('button:has-text("Fechar Visualização")');
  await page.waitForTimeout(200);
  await page.click('button[title*="Anexar Relatórios Regulatórios"]');
  await page.waitForTimeout(200);
  await page.click('button:has-text("Anexar Relatório Conclusivo")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(printsDir, 'Print 05 - Modal de Anexo de Relatorio Conclusivo.png') });

  // Confirmar anexo
  const filePath = path.join(__dirname, '..', 'package.json');
  await page.setInputFiles('#modalAnexoInputArquivo', filePath);
  await page.click('#modalAnexarRelatorio button:has-text("Anexar")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(printsDir, 'Print 06 - Confirmacao de Envio MSG007.png') });

  await browser.close();
  console.log('Screenshots generated successfully in', printsDir);
}

run().catch(console.error);
