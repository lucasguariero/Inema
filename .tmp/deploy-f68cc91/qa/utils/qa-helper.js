const fs = require('fs');
const path = require('path');

/**
 * Anexa listeners na pagina para monitorar e registrar:
 * 1. Erros de Network (HTTP >= 400)
 * 2. Falhas de requisicao (Abort, Timeout, CORS, DNS)
 * 3. Erros do Console do navegador (console.error e excecoes de JS)
 */
function attachNetworkLogger(page, options = {}) {
  const errors = [];
  const logToFile = options.saveLog !== false;
  const logFilePath = options.logFilePath || path.join(process.cwd(), 'qa', 'logs', 'network-errors.log');

  page.on('response', async (response) => {
    const status = response.status();
    if (status >= 400) {
      let bodyPreview = '';
      try {
        const text = await response.text();
        bodyPreview = text.slice(0, 300).replace(/\s+/g, ' ');
      } catch (_) {
        bodyPreview = '[Corpo nao acessivel]';
      }

      const entry = {
        tipo: 'HTTP_ERROR',
        status,
        metodo: response.request().method(),
        url: response.url(),
        corpo: bodyPreview,
        dataHora: new Date().toISOString()
      };
      errors.push(entry);

      console.error(`\x1b[31m[F12 NETWORK ERROR ${status}]\x1b[0m ${entry.metodo} ${entry.url}`);
      if (bodyPreview) console.error(`  ↳ Detalhe: ${bodyPreview}`);
      
      if (logToFile) appendLog(logFilePath, entry);
    }
  });

  page.on('requestfailed', (request) => {
    const entry = {
      tipo: 'REQUEST_FAILED',
      metodo: request.method(),
      url: request.url(),
      motivo: request.failure()?.errorText || 'Desconhecido',
      dataHora: new Date().toISOString()
    };
    errors.push(entry);

    console.error(`\x1b[33m[F12 NETWORK FAILED]\x1b[0m ${entry.metodo} ${entry.url} - Motivo: ${entry.motivo}`);
    if (logToFile) appendLog(logFilePath, entry);
  });

  if (options.logConsole !== false) {
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const entry = {
          tipo: 'CONSOLE_ERROR',
          texto: msg.text(),
          dataHora: new Date().toISOString()
        };
        errors.push(entry);
        console.error(`\x1b[35m[F12 CONSOLE ERROR]\x1b[0m ${entry.texto}`);
        if (logToFile) appendLog(logFilePath, entry);
      }
    });

    page.on('pageerror', (error) => {
      const entry = {
        tipo: 'PAGE_EXCEPTION',
        texto: error.message,
        dataHora: new Date().toISOString()
      };
      errors.push(entry);
      console.error(`\x1b[41m\x1b[37m[F12 PAGE EXCEPTION]\x1b[0m ${entry.texto}`);
      if (logToFile) appendLog(logFilePath, entry);
    });
  }

  return {
    getErrors: () => errors,
    hasErrors: () => errors.length > 0,
    printSummary: () => {
      if (errors.length === 0) {
        console.log('\x1b[32m✔ Nenhum erro de rede ou console (F12) detectado.\x1b[0m');
      } else {
        console.log(`\x1b[31m⚠ Total de ${errors.length} erro(s) capturado(s) no Network/Console!\x1b[0m`);
      }
    }
  };
}

function appendLog(filePath, entry) {
  try {
    const line = `[${entry.dataHora}] [${entry.tipo}] ${entry.status || ''} ${entry.metodo || ''} ${entry.url || entry.texto || ''} ${entry.corpo ? '| ' + entry.corpo : ''}\n`;
    fs.appendFileSync(filePath, line, 'utf8');
  } catch (_) {}
}

module.exports = { attachNetworkLogger };
