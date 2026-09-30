const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Roteiro de Apresentação — Inema & GLA</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 18mm 18mm 18mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      font-size: 13.5px;
      background-color: #ffffff;
    }
    .header {
      border-bottom: 2px solid #0F4C3A;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0F4C3A;
      letter-spacing: -0.02em;
    }
    .header .subtitle {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .info-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0F4C3A;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 18px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      font-size: 12.5px;
    }
    .info-box p {
      margin: 0;
    }
    .info-box strong {
      color: #0F4C3A;
    }
    .info-box .full-width {
      grid-column: span 2;
      color: #475569;
      font-size: 12px;
      padding-top: 4px;
      border-top: 1px dashed #cbd5e1;
    }
    .section {
      margin-bottom: 18px;
    }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #0F4C3A;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-subtitle {
      font-size: 11.5px;
      color: #64748b;
      margin-bottom: 8px;
      font-style: italic;
    }
    .speech-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #16a34a;
      border-radius: 6px;
      padding: 12px 14px;
      font-size: 13px;
      color: #166534;
      line-height: 1.55;
      margin-bottom: 10px;
    }
    .speech-box.primary {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #0F4C3A;
      color: #0f172a;
    }
    .grid-items {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin-top: 10px;
    }
    .item-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .item-card h4 {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .item-card .action {
      background: #eff6ff;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 11.5px;
      color: #1e40af;
      margin-top: 6px;
      display: inline-block;
      font-weight: 500;
    }
    .checklist-box {
      background: #fafafa;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 10px 14px;
      margin-top: 16px;
    }
    .checklist-box h4 {
      font-size: 12.5px;
      font-weight: 700;
      color: #374151;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .checklist-items {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      font-size: 12px;
      color: #4b5563;
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .checkbox {
      width: 13px;
      height: 13px;
      border: 1.5px solid #9ca3af;
      border-radius: 3px;
      display: inline-block;
    }
    .footer {
      margin-top: 16px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      padding-top: 8px;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <h1>📋 Roteiro de Apresentação — Alinhamento Inema & GLA</h1>
      <div class="subtitle">Guia de Apoio Operacional • Acto / Inema</div>
    </div>
  </div>

  <div class="info-box">
    <p><strong>Ambiente de Demo:</strong> https://gla-inema-dev.acto.com.br/</p>
    <p><strong>Credenciais:</strong> CPF: 000.000.000-00 | Senha: admin123</p>
    <div class="full-width">
      💡 <strong>Dica Pré-Apresentação:</strong> Deixe a aba previamente aberta e logada antes de iniciar o compartilhamento de tela.
    </div>
  </div>

  <!-- PARTE 1 -->
  <div class="section">
    <div class="section-title">1. Abertura & Reconhecimento do Figma</div>
    <div class="section-subtitle">Logo após a fala da Thays (sem compartilhar a tela ainda — cerca de 30 a 45 segundos)</div>
    
    <div class="speech-box primary">
      "Perfeito, Thays. Pessoal, antes de puxar a tela aqui do ambiente de desenvolvimento, nós demos uma olhada no protótipo Figma que vocês mandaram e identificamos vários pontos funcionais bem interessantes ali.<br><br>
      Chamou bastante a atenção a preocupação em deixar tudo mais direto: a parte de alertas e prazos bem visível logo de entrada, os serviços principais centralizados para o usuário não se perder, e atalhos rápidos para as ações mais frequentes do dia a dia.<br><br>
      Essa linha de raciocínio de vocês de encurtar caminho e dar clareza bate 100% com o que a gente está construindo aqui. Vou compartilhar a tela agora com o nosso ambiente de desenvolvimento para vocês verem como essa base já está funcionando."
    </div>
  </div>

  <!-- PARTE 2 -->
  <div class="section">
    <div class="section-title">2. Tour ao Vivo: gla-inema-dev.acto.com.br</div>
    <div class="section-subtitle">Compartilhando a tela já no painel logado (cerca de 2 a 3 minutos)</div>

    <div class="speech-box primary" style="margin-bottom: 8px;">
      "Puxando aqui pro nosso ambiente de desenvolvimento: o GLA já é construído em Filament, mas o que nós fizemos aqui foi dar uma boa modernizada no design, no layout e nos componentes, deixando a navegação bem mais limpa e prática no dia a dia:"
    </div>

    <div class="grid-items">
      <div class="item-card">
        <h4>🔹 1. Menu Lateral (Identidade Visual & Filtro Dinâmico)</h4>
        <p>"No menu lateral, repaginamos a identidade visual e adicionamos esse campo de filtro dinâmico no topo. Basta começar a digitar o nome do módulo e o menu filtra na hora, agilizando bastante a rotina de quem usa o sistema com frequência."</p>
        <div class="action">👉 Ação na tela: Digite algo rápido no campo "Filtrar menu..." (ex: "Processos" ou "Pesquisa") para demonstrar a filtragem em tempo real.</div>
      </div>

      <div class="item-card">
        <h4>🔹 2. Barra Superior (Breadcrumb, Alinhamento & Busca Global)</h4>
        <p>"Na barra superior, clareamos o layout trazendo ela pro branco, afinamos todos os alinhamentos e incluímos o breadcrumb para o usuário sempre saber exatamente onde está navegando. Além disso, adicionamos a busca global rápida com atalho de teclado (Ctrl + K)."</p>
        <div class="action">👉 Ação na tela: Aponte o breadcrumb e pressione Ctrl + K (ou clique na busca) para abrir o modal de pesquisa global.</div>
      </div>

      <div class="item-card">
        <h4>🔹 3. Painel Inicial (Cards de Acesso Rápido)</h4>
        <p>"Na tela inicial, refinamos a estrutura dos cards de acesso rápido, padronizando os blocos e ícones para deixar a navegação de entrada ainda mais intuitiva e agradável de bater o olho."</p>
        <div class="action">👉 Ação na tela: Passe o cursor pelos cards centrais (Dados Pessoais, Empreendimentos, CERH, Reposição Florestal, etc.).</div>
      </div>

      <div class="item-card">
        <h4>🔹 4. Tabelas & Listagens (Legibilidade & Badges Semânticos)</h4>
        <p>"E nas tabelas e listagens, trabalhamos o espaçamento e a clareza dos dados, com badges de status bem visíveis e uma leitura muito mais confortável no dia a dia."</p>
        <div class="action">👉 Ação na tela: Abra uma listagem/módulo para demonstrar o visual limpo da tabela e das tags de status.</div>
      </div>
    </div>
  </div>

  <!-- PARTE 3 -->
  <div class="section" style="page-break-inside: avoid;">
    <div class="section-title">3. O Gancho Final (Proposta Colaborativa de Evolução)</div>
    <div class="section-subtitle">Fechamento da sua fala abrindo para a validação do cliente (cerca de 45 segundos)</div>

    <div class="speech-box primary">
      "A gente notou que o desenho de vocês no Figma focou bastante na lógica e no fluxo de trabalho prático, sem necessariamente se prender à estrutura de componentes ou à tecnologia do Filament — o que é natural.<br><br>
      Por isso, a nossa ideia é justamente <strong>unir o melhor das duas coisas</strong>: pegar essa visão funcional que vocês desenharam e reconstruir dentro do Filament, refinando a usabilidade e aproveitando esses novos componentes e padrões visuais que mostramos aqui.<br><br>
      <strong>O que vocês acham dessa proposta? Se fizer sentido para vocês</strong>, a gente já puxa esse trabalho e traz na próxima reunião um protótipo navegável unindo essas duas frentes para validarmos juntos."
    </div>
  </div>

  <!-- CHECKLIST -->
  <div class="checklist-box" style="page-break-inside: avoid;">
    <h4>📌 Checklist Rápido de Palco</h4>
    <div class="checklist-items">
      <div class="checklist-item"><span class="checkbox"></span> Monitor em resolução padrão (zoom 100%)</div>
      <div class="checklist-item"><span class="checkbox"></span> Aba do gla-inema-dev já aberta e logada</div>
      <div class="checklist-item"><span class="checkbox"></span> Notificações do Windows/Slack pausadas</div>
      <div class="checklist-item"><span class="checkbox"></span> Roteiro aberto na tela secundária ou celular</div>
    </div>
  </div>

  <div class="footer">
    Documento confidencial para alinhamento estratégico • GLA & INEMA 2026
  </div>

</body>
</html>
`;

async function generate() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  let outputPath = path.join(__dirname, 'ROTEIRO_APRESENTACAO.pdf');
  try {
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        bottom: '15mm',
        left: '15mm',
        right: '15mm'
      }
    });
    console.log('PDF atualizado com sucesso em: ' + outputPath);
  } catch (err) {
    if (err.code === 'EBUSY') {
      outputPath = path.join(__dirname, 'ROTEIRO_APRESENTACAO_v2.pdf');
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15mm',
          bottom: '15mm',
          left: '15mm',
          right: '15mm'
        }
      });
      console.log('Arquivo original estava aberto pelo leitor. PDF salvo como: ' + outputPath);
    } else {
      throw err;
    }
  } finally {
    await browser.close();
  }
}

generate().catch(err => {
  console.error('Erro ao gerar PDF:', err);
  process.exit(1);
});
