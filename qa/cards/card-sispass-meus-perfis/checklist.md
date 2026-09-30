# Checklist de Homologação — SISPASS: Meus Perfis – Cadastro e Gestão de Documentação – UE (MR 296)

> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Módulo**: SISPASS › Meus Perfis (`/meus-perfis`) e Pauta Geral de Perfis (`/validar-documentos`)  
> **Data**: 2026-09-10  
> **Líder de QA**: Lucas Guariero  
> **Status**: ✅ **APROVADO / HOMOLOGADO (100% PASS)**

---

## 📋 Matriz de Testes Executada

### Bloco 1: Estrutura Geral e Catálogo Documental (Itens 1 e 2)
- [x] **1.1** Documentos em tabela: campos de upload individuais substituídos por tabela padronizada com colunas `Nome do Documento`, `Obrigatório`, `Situação` e `Ações`. Drag-and-drop completamente removido da tela.
- [x] **1.2** Documento de identificação pessoal: nenhum perfil exige anexo avulso de RG/CPF.
- [x] **1.3** Pauta de análise interna (`/validar-documentos`): seção `"Documento de Identificação (Cadastro Básico da Pessoa)"` recupera e exibe automaticamente a identificação oficial do requerente e do RT.

### Bloco 2: Perfil Criador Amador de Passeriformes (Itens 3, 4 e 5)
- [x] **2.1** Campo "Responsável Técnico" removido do formulário de Criador Amador.
- [x] **2.2** Coordenadas: campos renomeados para `"Latitude da Entrada do Criadouro*"` e `"Longitude da Entrada do Criadouro*"`.
- [x] **2.3** Documento único na tabela: `"Documento de comprovante de residência, expedido nos últimos 60 (sessenta) dias."`.

### Bloco 3: Perfil Criador Comercial de Passeriformes (Item 6)
- [x] **3.1** Campos cadastrais: `Responsável Técnico*`, `Titularidade*` (Pessoa Física / Jurídica), `CPF/CNPJ*` e `CTF*`.
- [x] **3.2** Tabela com exatamente os 5 documentos da PJ previstos no requisito:
  1. Alvará de localização e funcionamento fornecido pelo órgão municipal;
  2. Autorização de uso e manejo de fauna;
  3. Contrato social;
  4. Documento de identificação com foto e CPF, do representante legal;
  5. Comprovante de residência, expedido nos últimos 60 (sessenta) dias, do representante legal.
- [x] **3.3** Remoção dos 2 documentos de RT da grade de anexos do criador comercial.

### Bloco 4: Perfil Associação de Passeriformes (Itens 7, 8 e 9)
- [x] **4.1** Titularidade removida do cabeçalho da Associação.
- [x] **4.2** Campo `CNPJ*` mantido, listando exclusivamente os CNPJs vinculados ao CPF do usuário logado.
- [x] **4.3** Estrutura em 2 etapas: `Etapa 1` (Dados cadastrais e tabela de documentos) e `Etapa 2` (Cadastro de Associados).
- [x] **4.4** Prevenção de erro 500: formulário estável na alternância de perfis e operação atômica de gravação.

### Bloco 5: Perfil Responsável Técnico
- [x] **5.1** Campo `CRMV*` obrigatório.
- [x] **5.2** Tabela com exatamente os 2 documentos: `Carteirinha do CRMV` e `Certidão Negativa emitida pelo CRMV`.
