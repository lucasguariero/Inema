# Checklist de QA — RFP: Implementação do Documento Final

## 1. Identificação do Card
- **Título**: Implementação do Documento Final – RFP
- **Módulo**: Regulação / Registro de Floresta de Produção (RFP)
- **Tipo**: Documento Final / Relatório PDF
- **Status**: REPROVADO (Ajuste de Layout)

---

## 2. Matriz de Reteste & Cenários
- [x] **CT01 — Gerar Documento Final em PDF**: Gerado sem erro após concluir o requerimento.
- [x] **CT02 — Substituição dos Parâmetros**: Nome, CPF, Matrícula, ITR, Área, Espécie, Incremento, Volume, Chave devidamente preenchidos.
- [x] **CT03 — Autenticidade do Documento**: Chave e QR Code autenticam na tela pública.
- [ ] **CT04 — Fidelidade de Layout e Quebras de Página (REPROVADO)**:
  - Quebra de página desnecessária empurrando apenas o QR Code para a página 2.
  - Página 2 sem cabeçalho institucional (Brasão e Marca INEMA).

---

## 3. Evidências (anexos.zip)
- Print 01 - Pagina 1 do Comprovante RFP com dados preenchidos.png
- Print 02 - Segunda pagina isolada com QR Code e sem cabecalho institucional.png
- RFP_2026007000007_RFP.pdf
