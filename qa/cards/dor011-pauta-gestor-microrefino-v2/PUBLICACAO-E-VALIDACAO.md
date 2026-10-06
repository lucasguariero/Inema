# Publicação e validação — DOR011 v2
Código: dc2f06e9c42ce81dd45cfeff823a4cc9e6281fda. Contém microcorreções 870ad5a e paginação dc2f06e.
Base v1: ff91135c02ed61a30145b9636d94d440dc5e1b46.

Publicação final a partir de exportação Git limpa desse commit: não incorporou .gitignore modificado nem REFACTOR.md particulares do usuário. O projeto Vercel foi identificado pela configuração existente, sem alteração de proteção/autenticação. Logs de publicações intermediárias foram preservados; somente deploy-reprodutivel identifica a entrega final.

- Deployment final READY: dpl_D63zi4w3XrS3e9L8MNeLzbTFBud7.
- URL dedicada/congelada desta versão: https://inema-bhst82wyo-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor
- Principal consolidado validado: https://inema.acto.com.br/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor
- Bundle publicado: /assets/index-BJvPcLXY.js; CSS /assets/index-DTvrwqyO.css.
- v1 anterior preservada: https://inema-15rbqfulv-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor

URL dedicada pode exigir login Vercel conforme proteção já configurada. A verificação de HTML desse deployment usou vercel curl, com credencial gerenciada pela CLI, não exportada. O domínio principal foi testado anonimamente no navegador.
12 fluxos UI e P01–P03: todos aprovados no principal; P01 compara bundle final. Capturas 29/30 confirmadas manualmente. HTML real do principal e do deployment em 06_logs.
Build local e cloud geram hashes diferentes de assets; não é alegada equivalência binária entre ambientes. A rastreabilidade vem da exportação Git limpa, metadados de deployment e testes do ambiente efetivamente publicado. O fechamento documental posterior não altera src/public/build/dependências/configuração em relação ao commit publicado (assert no empacotamento).
O snapshot do ZIP é limitado às fontes necessárias do frontend/QA, sem histórico Git ou arquivos particulares. Para reprodução byte a byte do contexto completo do build remoto, recuperar o commit no Git e usar o ambiente Vercel correspondente; a reprodução local no snapshot verifica comportamento, não igualdade de hashes.
