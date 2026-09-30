# Checklist de Homologação — Card 14: Certidão de Débito Ambiental – Análise do Coordenador (TL006 / TL007)

## 📌 Contexto do Teste
- **Ambiente**: https://gla-inema-hml.acto.com.br/
- **Módulos / Rotas**:
  - `Análise › Minha Pauta` (`/minha-pauta-certidao-debito`)
  - `Análise › Processos Finalizados` (`/processos-finalizados-certidao-debito`)
- **Telas Inspecionadas**:
  - `TL006` — Minha Pauta (Coordenador)
  - `TL007` — Analisar Certidão de Débito Ambiental - Coordenador
  - `TL008` — Processos Finalizados (Recepção pós-assinatura)

---

## 🎯 Itens Validados

### 1. Minha Pauta do Coordenador (TL006 / C001–C010)
- [x] Acesso concedido ao perfil de Coordenador/Gestor (`11111111111`) e Administrador na rota `/minha-pauta-certidao-debito`.
- [x] Tabela de processos renderizada com as colunas oficiais:
  - `Nº do Processo`
  - `Data`
  - `Ato` ("Certidão de Débito Ambiental")
  - `Requerente`
  - `Etapa`
  - Menu de `Ações`
- [x] Campo de pesquisa textual rápida integrado.
- [x] Tratamento de estado vazio ("Sem registros" / "Nenhum resultado").

### 2. Dados Consolidados & Painel de Pendências (TL007 / C001–C012)
- [x] Cabeçalho em somente leitura com dados consolidados do requerente (CPF/CNPJ, Razão Social, E-mail, Telefone e Endereço completo).
- [x] Painel de pendências apuradas exibindo Processo, Origem das Pendências, Dívida Ativa e Valor consolidado.

### 3. Ações da Coordenação na Certidão (TL007 / C013–C017)
- [x] **Visualização em Rascunho (C013)**: Renderização do documento prévio contendo a marca d'água **"RASCUNHO"**, sem emissão definitiva.
- [x] **Devolução para o Técnico (C014)**: Ação "Devolver" desvinculando o processo da coordenação e retornando diretamente para a pauta individual do técnico responsável.
- [x] **Download Oficial da Certidão (C015)**: Ação "Download da certidão" emitindo o documento oficial conforme o enquadramento apurado (Negativa, Positiva ou Positiva com Efeito Negativo).
- [x] **Upload & Assinatura Digital (C016–C017)**: Suporte ao upload do documento assinado externamente e à execução da assinatura digital direta no sistema.
- [x] **Finalização e Tramitação**: Conclusão da etapa de coordenação com disponibilização ao requerente e migração do processo para a listagem de "Processos Finalizados" (`/processos-finalizados-certidao-debito`).

---

## 🏁 Veredito Final
- **Status**: ✅ **100% APROVADO**
- **Divergências ou Bloqueios**: Nenhum.
