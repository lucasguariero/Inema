# Segurança — pendência preexistente

Reexecução de npm audit --json em 06/10/2026: **1 HIGH**, source-map-js **1.2.1**, transitiva via PostCSS/Tailwind. Exit 1 preservado em npm-audit.json/log, cadeia em source-map-cadeia.json/log. package.json e package-lock.json não mudaram em relação à base v2; problema preexistente, não introduzido pelas legendas.

Aviso retornado pelo audit: GHSA-68fv-2mgg-jv7q, CVSS 7.5, offsets maliciosos em indexed source maps podem provocar bloqueio do event loop/negação de serviço; versões <1.2.2 afetadas. Não foi demonstrado exploit/exposição em produção. Fonte primária: https://github.com/advisories/GHSA-68fv-2mgg-jv7q.

Tratamento em tarefa separada: atualização transitiva direcionada para versão corrigida, avaliação de consumo de mapas não confiáveis, repetição de build e regressões. Nenhum update global nesta rodada.

Autorização frontend é simulação, não fronteira de segurança. Implementação definitiva exige validação no servidor de sessão/perfil/escopo/operação. Vercel protection das URLs exclusivas é preservada. Pacote exclui .env/.git/.vercel/node_modules, credenciais e alterações privadas preexistentes. Evidências contêm apenas dados mock.
