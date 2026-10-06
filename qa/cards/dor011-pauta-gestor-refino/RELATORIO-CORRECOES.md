# Correções — DOR011 Refino v1

Base desta rodada: ef2665d40f8ac7301b603d554a2d9649b4cac08d. O commit final e o patch ficam em 02_codigo do pacote. Escopo: Pauta do Gestor - Registros, sem redesign.

## Execução técnica

- Consulta, órgãos, setores, contadores, duplicidades e ações passam pela sessão e pela autorização de cada item. A consulta não contém condição literal DIFIS. Fixtures de contraste incluem 3 registros OUTRO; nenhum deles aparece na sessão DIFIS.
- Município usa os 417 códigos do [IBGE](https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios?orderBy=nome); catálogo congelado no código, com busca sem acento. [Contrato oficial da API](https://servicodados.ibge.gov.br/api/docs/localidades).
- TL005 adiciona Visualizar ao lado de cada candidato; abre leitura dentro do mesmo modal e preserva seleção/contexto ao voltar. Não cria nova rota.
- TL011 inclui identificação/origem dos documentos e referências com coordenadas. Fixtures RAE, RFA, Nota Técnica, PTAD, ATN e desdobramento; ausência de documento é apresentada explicitamente. GeoBahia continua indisponível.
- Colunas opcionais são contextuais; obrigatoriedade de Ações e Duplicados depende da operação/relação disponível, conforme RN028/TL010, não das antigas expectativas genéricas. RE não oferece Eixo; RT não oferece Denunciante/Comunicante.
- RN047 deixa de ter default permissivo. Tipos/status/relação e destinos precisam de política explícita; a política atual é demonstrativa e NÃO a matriz corporativa. Operações sem contrato ficam bloqueadas.
- Ordenar: Mais recentes / Mais antigos na toolbar; cabeçalho e controle compartilham estado, preservado na paginação/filtros/modal.
- Mantidos AND, pesquisa exata, palavra completa, quatro painéis recolhidos, limpeza de filtros inaplicáveis, validação de datas/CPF/CNPJ/coord. Limpar filtros aguarda nova consulta, conforme BOT002 (não altera resultados automaticamente).
- Mantidos limites SLA 0/89/90/149/150/180/181/190. Não foi introduzida fórmula corporativa imaginada para pausas/encerramentos.
- Anexar/desanexar/arquivar/encaminhar/eixo/comentário mantêm snapshot, versão e histórico no mock. Duplo clique e conflito local testados; não são garantias distribuídas.
- 19 extensões preservadas; seleção múltipla, remoção de seleção não enviada, nomes longos e arquivos vazios demonstrados. O DOR não proíbe tamanho zero, então não se inventou essa restrição. Exclusão de documento persistido não foi criada.
- FilamentSelect compartilhado recebeu Tab/Shift+Tab, Enter/Space quando aplicável, Escape, setas, Home/End, seleção ativa, foco/ARIA e busca sem acento; sem nova dependência.

## Preservação

AppShell, Header, Sidebar, menu, rota, densidade, tabela e estilos de contêiner existentes não foram redesenhados. Pills decorativas/KPIs/gradientes novos não foram adicionados. Usados Button/Badge/InputWrapper/FilamentSelect/Section/TableContainer/GlaTable/Dialog existentes.

As skills impeccable e ponytail orientaram a preservação da identidade e a solução por reuso; pdf foi usado para conferir o documento e seus conflitos. Nenhum componente extra de layout foi criado.

## O que não foi convertido em “concluído”

Veja LIMITACOES-E-BLOQUEIOS.md e a matriz. PDF real, GeoBahia, CAR real, serviços documentais, persistência e autenticação continuam ausentes; formar processo/ofício/conversão e regras corporativas dependem de definições externas. A trilha não declara nota, homologação ou cobertura integral.
