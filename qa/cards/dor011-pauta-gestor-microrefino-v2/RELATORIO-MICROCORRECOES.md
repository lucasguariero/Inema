# DOR011 — microcorreções v2
Data: 06/10/2026. Base v1: ff91135c02ed61a30145b9636d94d440dc5e1b46. Código v2: dc2f06e9c42ce81dd45cfeff823a4cc9e6281fda (inclui 870ad5a277e7b9ca777de435622e9fea830fbc2b).
Escopo: protótipo funcional em memória, AppShell legado e Dense UI preservados. Nenhuma alteração no shell, menu, CSS de Fiscalização, paleta, dependências ou API pública do Select.

## Execução técnica
- RN036/RN054/TL011: ArquivoPauta aceita documento estruturado opcional. Anexos comuns são listados, mas não originam coordenadas. Nota técnica explicitamente simulada contribui com referência quando possui coordenada válida.
- Referências identificam Registro, Documento relacionado ou Anexo e a respectiva fonte. A prioridade existente de registro/documento foi preservada. Anexo válido é alternativa anterior ao fallback municipal. Coordenada inválida é descartada. Não existe parser de PDF/KML/ZIP.
- TL011 reutiliza Section compacta, Button e o mesmo modal. Referência principal evita o heading duplicado. URL disponível permite Visualizar; fixture sem arquivo real mostra Visualizar desabilitado ou Visualizar metadados, sem fingir abertura de PDF.
- Visões de escrita abertas diretamente são negadas quando a política não autoriza. O executor já valida novamente; não foi inventada matriz corporativa RN047.
- Rótulos BOT003, BOT010, BOT017 e BOT023 foram alinhados literalmente. BOT013 inclui Ver duplicados no nome acessível do badge.
- PDF p17/C007: Anterior, Próxima e contador de páginas aparecem somente quando há mais de uma página. Total e seletor de quantidade continuam disponíveis, permitindo reverter 25/50 para 10. Nenhum novo tamanho corporativo foi definido.
- Select compartilhado: Escape do popover é tratado na captura da janela antes do Dialog. Fecha somente o Select aberto e devolve foco; o Escape seguinte fecha o modal. Listener removido no cleanup, sem dependência nova.
- Mocks OUTRO não herdam os documentos/anexos de DIFIS.

## Rastreabilidade
268 IDs preservados na matriz; 93 componentes C relidos individualmente. Constantes MSG001–034 comparadas com transcrição independente do PDF. Texto presente não equivale à execução de serviço.
Arquivos fonte alterados: pautaGestorMock.ts; pautaGestor.ts; PautaRegistroDialog.tsx; PautaGestorRegistrosPage.tsx; Select.tsx. Patch binário e snapshot em 02_codigo.
Skills: ponytail orientou reuso e correção mínima; impeccable orientou a revisão visual sem redesign; pdf orientou a leitura integral da fonte.

## O que não foi entregue
Backend, autenticação, armazenamento, ACL corporativa, GeoBahia, CAR, emissão de PDF, Ofício, PE003 e conversão integral continuam ausentes/bloqueados. A próxima avaliação cabe ao auditor externo.
