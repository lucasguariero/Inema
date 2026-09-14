const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
    const browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    const outDir = path.resolve(__dirname, '../dist_screenshots');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const screens = [
        { name: '01-index', file: 'src/index.html' },
        { name: '02-fiscalizacao', file: 'src/fiscalizacao.html' },
        { name: '03-emergencia-quimica', file: 'src/emergencia-quimica.html' },
        { name: '04-emergencia-quimica-externa', file: 'src/emergencia-quimica-externa.html' },
        { name: '05-consulta-externa', file: 'src/consulta-externa.html' },
        { name: '06-consulta-interna', file: 'src/consulta-interna.html' },
        { name: '07-relatorios', file: 'src/relatorios.html' },
        { name: '08-fauna', file: 'src/fauna.html' }
    ];

    for (const screen of screens) {
        const filePath = path.resolve(__dirname, '..', screen.file);
        const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;
        await page.goto(fileUrl, { waitUntil: 'networkidle' });
        const dest = path.join(outDir, `${screen.name}.png`);
        await page.screenshot({ path: dest, fullPage: false });
        console.log(`Captured ${screen.name} -> ${dest}`);
    }

    await browser.close();
    console.log('All screens captured successfully!');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
