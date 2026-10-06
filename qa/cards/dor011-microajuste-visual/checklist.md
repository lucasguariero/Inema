# Microajuste visual DOR011 — 06/10/2026

- [x] Somente espaçamento da orientação dos filtros e tag do item da sidebar.
- [x] Orientação oficial preservada literalmente, sem ícone, fundo ou card; 12px e token muted existente.
- [x] Tabs → orientação: 8px; orientação → primeiro grupo: 12px (Full HD e 390px).
- [x] Título → tabs: 20px antes e depois, sem alteração.
- [x] DOR011 via `badge` da configuração central: renderer da sidebar inalterado, sem nova variante.
- [x] Tag shrink-0 / nowrap / centralizada e contida no item; altura do item preservada: 32px desktop e 28px mobile.
- [x] Nenhuma regra, fluxo, filtro, tabela ou comportamento modificado.
- [x] Build e TypeScript: exit 0; aviso de bundle grande preexistente permanece fora do escopo.
- [x] QA visual local em 1920×1080 e 390×844, sem overflow horizontal ou erros de página.
- [x] Guias RA/AC vazias e filtros inicialmente recolhidos preservados.
- [x] Regressão local existente: 48/48 verificações aprovadas, console 0.

A orientação solicitada como “LEG016” está identificada oficialmente como LEG022 no código. Nenhum identificador ou texto foi alterado. O estado atual da configuração não contém tags DOR001–DOR007 em Fiscalização; reutilizou-se exatamente o renderer central que já exibe os códigos existentes (DR001–DR007 em Fauna), sem acrescentar outras tags ou modificar estilos compartilhados.

O build sincroniza os menus HTML legados automaticamente: a única diferença nesses arquivos é a mesma tag DOR011. Não há código funcional novo.

Evidências: `baseline.json`, `resultado-local.json`, `resultado-producao.json`; prints em `prints/`. Logs de build, TypeScript e regressão existentes em `../dor011-pauta-gestor-legendas-v3/logs/microvisual-*`.
