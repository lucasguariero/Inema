# Limitações e bloqueios — DOR011 v2
Este pacote é um protótipo frontend em memória. Testes positivos não convertem os itens abaixo em integração implementada.

## Bloqueados por definição
- PE003 / formação de processo: contrato não entregue.
- Ofício: modelo, numeração e perfis completos não definidos (RN041).
- RN047: matriz corporativa definitiva ausente; política de protótipo deny-by-default não é a matriz definitiva.
- F003/RT/Origem e RN009/LEG002: contradições do PDF; não arbitradas.
- PE001/domínio de status e parâmetros definitivos de duplicidade: não entregues.
- Conversão: validação do destino/contrato do fluxo não disponível.

## Mock / parcial
- Sessão autenticada, perfil e escopo locais; não há autenticação corporativa nem autorização de backend.
- Persistência, histórico, versionamento e atomicidade funcionam em memória. Não há transação distribuída, storage ou recuperação de sessão real.
- SLA: cores/faixas e cálculo simples de dias testados; regra integral de prazos/suspensões depende de definição.
- CAR: uma poligonal SIMULADO-CAR-001; não consulta serviço oficial.
- TL011: anexos e fontes disponíveis no mock são mostrados. Upload cria URL blob local, não armazenamento. Não extrai geometria de PDF/KML/ZIP.
- Fallback município existe no algoritmo; acesso geoespacial externo continua indisponível. Não atribuir RN055 integral pela existência do modal.

## Não implementados
GeoBahia real, emissão documental/PDF integral, erros remotos de consulta/upload/arquivo/desanexação/documento/GeoBahia.
Botão desabilitado, texto explicativo, toast ou constante MSG não são serviço.
23 legendas literais não estão reproduzidas na UI; LEG002 bloqueada por contradição. Não adicionados helper texts documentais por vedação do pedido.
D11-R2-02 a D11-R2-11: identidade do achado no relatório externo não fornecida; associação definitiva permanece NÃO VERIFICADA, conforme delta. Isso é distinto dos 268 requisitos da matriz.

## Fora desta rodada
Update de dependências, chunk/performance global, todos os consumidores Select e persistência do formulário mock Novo Usuário. Sem mudanças no AppShell/topbar/sidebar/redesign.
