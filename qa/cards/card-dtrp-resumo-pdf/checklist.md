# Checklist de Homologação — DTRP: Geração do Resumo do Requerimento em PDF (MR 255)

> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Módulo**: Declaração de Transportes › Requerimentos (`/dtrp-requerimento/dtrp-requerimentos`)  
> **Data**: 2026-09-10  
> **Líder de QA**: Lucas Guariero  
> **Status**: ✅ **APROVADO / HOMOLOGADO (100% PASS)**

---

## 📋 Matriz de Testes Executada

### Bloco 1: Disponibilidade do Documento e Condição de Exibição (RNG-038)
- [x] **1.1** Requerimento finalizado (Status `Novo`): botão `"Baixar resumo em PDF"` disponível no topo da tela de visualização.
- [x] **1.2** Requerimento em rascunho: botão de resumo em PDF não é apresentado, respeitando a regra de que o documento só é gerado após a conclusão.
- [x] **1.3** Download do arquivo: geração em tempo real disparando download direto de arquivo PDF válido (`application/pdf`, ~1 MB).

### Bloco 2: Estrutura Institucional do PDF (Figma Node 119-9846 e MR 255)
- [x] **2.1** Cabeçalho oficial com Brasão do Estado da Bahia, logo do INEMA e título: `"Resumo da DTRP - Declaração de Transporte de Resíduos Perigosos"`.
- [x] **2.2** Seção `IDENTIFICAÇÃO E RASTREABILIDADE`: Número do Requerimento SEIA formatado (`2026.010.000010/INEMA/DTRP`), Status, Validade da DTRP (*"Contada da emissão oficial"*).
- [x] **2.3** Seção `ENTIDADE DESTINATÁRIA`: Razão Social, Tipo (rural/urbano), e-mail, logradouro e municípios atendidos.
- [x] **2.4** Seção `PONTOS DE GERAÇÃO / COLETA`: Logradouro, CEP, coordenadas geográficas e órgão/processo.
- [x] **2.5** Seção `TRANSPORTADORAS`: Razão Social, CNPJ, localidade e número de processo do órgão emissor.
- [x] **2.6** Seção `TRATAMENTO, DISPOSIÇÃO E SINIR`: Tratamentos selecionados, indicação de cadastro SINIR e comprovante.

### Bloco 3: Resíduos e Declaração de Aceite (Página 2)
- [x] **3.1** Tabela de `RESÍDUOS E CARACTERIZAÇÃO`: Código, Denominação do Resíduo, Periculosidade (Classe I - Perigoso), Quantidade (t/ano), Estado Físico, Acondicionamento e Veículo de transporte.
- [x] **3.2** Seção `DECLARAÇÃO E ACEITE`: Texto integral da declaração de responsabilidade com registro de auditoria (*"Aceito eletronicamente"* e usuário responsável).
- [x] **3.3** Marca d'água oficial do Brasão de Armas da Bahia e rodapé padronizado SEIA/INEMA com paginação e data/hora de geração.
