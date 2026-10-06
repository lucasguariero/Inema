# Segurança — pendência preexistente
npm audit --json (06/10/2026): uma vulnerabilidade HIGH em source-map-js 1.2.1, dependência transitiva de PostCSS/Tailwind; exit 1. Não é falha de build e não foi omitida.
package.json e package-lock.json permanecem iguais à base ff91135; a versão já existia antes desta rodada. Ver source-map-cadeia e diff do snapshot.

Impacto conhecido: mapa de fontes indexado com offsets maliciosos pode bloquear o event loop, causando negação de serviço; faixa afetada anterior a 1.2.2, correção em 1.2.2. Não foi demonstrada exploração ou exposição desse caminho em produção neste projeto. [Aviso primário GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).

Tratamento separado recomendado: atualização transitiva direcionada para versão corrigida, investigação de consumo de mapas não confiáveis e repetição do build/regressão. Não foi feito update global nem exploit nesta micro-rodada.
Autorização frontend é simulação, não fronteira de segurança. A versão definitiva precisa validar sessão/perfil/escopo/operação no servidor.
ZIP exclui .env, .git, .vercel, node_modules, credenciais e alterações particulares preexistentes. Capturas contêm somente fixtures de protótipo.
