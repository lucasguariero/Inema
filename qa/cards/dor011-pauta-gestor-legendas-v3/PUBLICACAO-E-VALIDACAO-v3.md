# Publicação e validação — DOR011 v3

Código publicado: `1f021d14dc9ad54fcad6562274a118470b60d511`, com exportação Git limpa do frontend/configuração. Não incluiu .gitignore privado, REFACTOR.md ou arquivos pessoais/credenciais. Snapshot final do pacote contém o mesmo código de produto; commit documental final pode ser diferente, com equivalência de fontes verificada pelo empacotador.

Deployment dedicado v3: `dpl_3kJgngbxtZAtRZExNPWnRUvtknL5`, READY.

- Exclusivo: https://inema-a6vt4ei9r-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor
- Principal: https://inema.acto.com.br/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor
- V2 intacta: https://inema-bhst82wyo-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor
- V1 intacta: https://inema-15rbqfulv-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor

Bundle cloud v3 `/assets/index-1z-Wjnu6.js`; CSS `/assets/index-BOfsDSQL.css`. Ambos identificados no HTML principal; bundle conferido também no HTML da URL exclusiva pela requisição Vercel autenticada. Proteção da URL exclusiva preservada, sem inserir bypass/credencial no pacote. Hashes de output cloud/local não precisam ser iguais por diferenças de contexto de build; equivalência de código é o contrato verificado.

Publicação: primeira tentativa manual sem scope explícito respondeu “Not authorized” embora CLI retornasse exit0; **não foi considerada deploy válido**. Identidade/projeto consultados, segunda tentativa com `--scope guariero` concluiu READY. Git push também gerou deploy automático; após os commits documentais, alias principal é restabelecido para o deployment manual validado. Nenhum deployment anterior é apagado/republicado.

Smoke final no principal: **12/12** verificações existentes, console 0; **3/3** casos direcionados (TL011/anexos, Select Escape em SEIA V2 e paginação/RA/AC); **26/26** casos LEG direcionados, incluindo as 23 individuais, LEG002 ausente/Órgão preservado, disabled/pending e evidências agrupadas. Somente dados frontend simulados; não há escrita em HML/backend.

Capturas finais TL011: Print 29 FullHD e Print30 390px, incluindo rodapé e botão disabled. Outros screenshots produção LEG016/020/021/023 também disponíveis na pasta de trabalho. HTML exclusivo/v1/v2 e inspeções Vercel em logs; v2 mantém `/assets/index-BJvPcLXY.js`. QA local de helpers: 12px/16px, wrapping e contraste mínimo medido **7.24:1** para filtros e LEG024, não WCAG integral.

Tentativa de usar gh para leitura de status falhou porque CLI não está instalado; status/deployment confirmado pela CLI Vercel já disponível. Não foi instalado conector/CLI ou alterada permissão.

Este relatório documenta publicação/testes de protótipo, não homologação do DOR011 ou das integrações pendentes.
