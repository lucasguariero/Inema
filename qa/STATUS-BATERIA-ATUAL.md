# Bateria atual - PARA TESTE GLA - 21/09/2026

## Objetivo da revisão

Revalidar todos os resultados parciais e reprovados depois de mapear permissões, dependências e fluxos no ADMIN. Corrigir qualquer parecer causado por teste incompleto.

## Cards em revalidação

1. Financeiro - Parcelamento - Pauta e Distribuição
2. DAE - Requerente - Efetivação e Acompanhamento do Parcelamento
3. Cadastro de Templates de Documentos
4. DAE - Técnico - Pauta de Análise do Parcelamento
5. Implementação do Documento Final - RFP
6. Ajustes SISPASS - Associação e Calendário
7. DAE - Técnico - Análise da Solicitação de Parcelamento
8. REG010 - Seleção do Empreendimento e Verificações de Supressão e Outorga
9. LAC - Roteiro, Emergências e Base Operacional

## Ponto atual

- Revisão integral iniciada em 22/09/2026.
- Permissões auditadas: o grupo `Usuário Externo` já possui `Efetivar` e `Visualizar` em Requerimentos > Parcelamento. O ADMIN possui todas as permissões, mas não recebe menu/rota funcional de parcelamento nem de templates. A indisponibilidade desses módulos não foi causada por falta de permissão do usuário de teste.
- Parcelamento: os quatro cards continuam reprovados. A página do requerente permanece em `Em breve`, e nem a pauta da área nem a pauta técnica aparecem para o ADMIN, apesar das permissões existentes.
- Templates: continua reprovado. O ADMIN possui as permissões, porém não há entrada de menu e a rota testada retorna 404.
- Documento final RFP: continua reprovado. O documento e o certificado são gerados e autenticados, mas a segunda página fica sem o cabeçalho e o rodapé institucional exigidos pelo card.
- SISPASS: resultado anterior não pode ser tratado como falha completa. A retirada do CTF e a restrição do anexo em PDF passaram; o restante ficou sem execução por falta de associação/CNPJ vinculado ao usuário Lucas. Preparação de massa e reteste completo ainda pendentes.
- REG010: o fluxo foi revisado. O cadastro de empreendimento rural usa `Imóveis Vinculados` por preenchimento manual; a propriedade rural ativa com CEFIR criada separadamente não é oferecida para vínculo. A APE também não permite informar o CEFIR manualmente quando não encontrado, embora o critério do card exija essa alternativa. A reprovação continua válida.
- LAC: aprovado no reteste. O card limita o escopo à TL006; os campos completos de Base Operacional pertencem a outro PBI. O upload ZIP com SHP/SHX/DBF/PRJ em SIRGAS 2000 foi aceito, as opções Próprio/Terceiros e os campos condicionais foram validados, e o cenário sem Base Operacional foi finalizado no requerimento `2026.046.000046/INEMA/REQ` com encaminhamento à ATEND.
- RFP gerado: requerimento 2026.044.000044/INEMA/REQ, certificado 2026.007.000007/RFP.

## Próxima ação

Finalizar o requerimento LAC preparado, criar/vincular uma massa de associação SISPASS pelo fluxo permitido e repetir os cenários restantes. Ações finais que gravam dados, alteram permissões ou excluem registros exigem confirmação imediatamente antes do clique.
