# Checklist de QA — SISPASS: Substituição da Pauta Geral de Documentos pela Pauta Geral de Perfis

## 1. Identificação do Card
- **Título**: SISPASS: Substituição da Pauta Geral de Documentos pela Pauta Geral de Perfis
- **Módulo**: SISPASS / Pauta Geral e Análise de Perfis
- **Status do Card**: RESOLVIDO / APROVADO (com pendência de Coordenadas/Shapefile movida para card separado conforme decisão do Enrique Prieto)

---

## 2. Itens Validados com Sucesso (Escopo Entregue)
- [x] **Nomenclatura & Colunas**:
  - Pauta Geral de Perfis apresentada corretamente (Print 01).
  - Coluna "Tipo de Perfil" substituindo "Tipo" (Print 01).
  - Coluna "Data da Validação" preenchida apenas após a finalização da análise (Print 01).
- [x] **Relação de Documentos por Perfil (RG010)**:
  - Documentos restritos e específicos para o perfil em análise (ex: Responsável Técnico com identificação, CRMV e certidão negativa) sem vazar documentos de outros perfis vinculados (Print 02).
- [x] **Histórico de Tramitação do Perfil**:
  - Disponível na tela de análise com eventos detalhados (data, usuário, campo, valor anterior e novo valor) (Print 03).
- [x] **Não Vinculação do Analista ao Acessar/Iniciar (RG005)**:
  - Visualizar a tela de análise não vincula o analista ao processo; coluna Analista permanece vazia na Pauta Geral (Print 04 e Print 06).
  - Vinculação ocorre exclusivamente ao clicar em "Finalizar Análise".
- [x] **Remoção de Salvar Rascunho**:
  - Botão "Salvar Rascunho" removido; apenas "Cancelar", "Reprovar Campos do Cadastro" e "Finalizar Análise" disponíveis (Print 05).
- [x] **Cancelamento sem Persistência Parcial**:
  - Sair ou cancelar no meio da análise mantém todos os documentos em status Pendente limpo (Print 05).

---

## 3. Deliberação sobre Coordenadas Geográficas / Shapefile
- **Achado de Coordenadas (Maria Eduarda / Bruno)**: Coordenadas truncadas em 2 casas decimais e perfil Deferido que não volta para análise ao editar coordenadas (Cenários 08 a 10).
- **Diretriz Oficial (Enrique Prieto - 6 dias atrás)**:
  > *"Qualquer validação que ficar pendente desta demanda relacionado ao Shapefile, deve-se criar um novo card, pois será tratado assim que a equipe de negócio do Inema decidir sobre a ferramenta que será usada nas validações entre shapefile e endereço. cc @bruno @thays.dias"*
- **Conclusão**: O card principal está **APROVADO**, e o comportamento de coordenadas/georreferenciamento deve ser acompanhado no card específico da ferramenta de shapefile/geo.
