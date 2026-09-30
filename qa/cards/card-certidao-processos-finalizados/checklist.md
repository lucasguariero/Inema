# Checklist de Homologação — Card 09: Certidão de Débito Ambiental — Processos Finalizados (TL008)

## 📌 Contexto do Teste
- **Ambiente**: https://gla-inema-hml.acto.com.br/
- **Módulo**: Análise › Processos Finalizados (`/processos-finalizados-certidao-debito`)
- **Telas Inspecionadas**: TL008 — Processos Finalizados

---

## 🎯 Itens Validados

### 1. Menu Lateral & Acesso (C001 / RG001)
- [x] Item "Processos Finalizados" visível sob o agrupador "Análise" no menu lateral.
- [x] Rota acessada: `https://gla-inema-hml.acto.com.br/processos-finalizados-certidao-debito`.
- [x] Acesso concedido conforme perfis internos autorizados (Admin e Gestor/Coordenador).

### 2. Campo de Busca (C002)
- [x] Campo de busca posicionado acima da tabela com placeholder oficial: *"Buscar por Nº do Processo ou CPF/CNPJ"*.
- [x] Campo de pesquisa textual rápida integrado.

### 3. Grid "Processos Finalizados" (C003–C008)
- [x] Tabela renderizada com todas as 5 colunas especificadas:
  - `Nº Processo` (C004)
  - `Data Conclusão` (C005)
  - `Ato` (C006)
  - `Técnico` (C007)
  - `Etapa` (C008)
- [x] Mensagem de estado vazio tratada adequadamente ("Sem registros" / "Nenhum resultado").

### 4. Ciclo e Integração do Processo
- [x] Estrutura pronta para recepção de processos concluídos após tramitação pelas pautas de análise técnica e coordenação.
- [x] Suporte a ações por linha para consulta e download de certidões emitidas.

---

## 🏁 Veredito Final
- **Status**: ✅ **100% APROVADO**
- **Divergências ou Bloqueios**: Nenhum.
