# 🎯 Fila de Homologação e Testes Automatizados — GLA Inema

> **Líder de QA**: Lucas Guariero  
> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Padrão de Execução**: Autonomia Total Overnight (Zero Interrupção, Auto-Approval)

---

## 📋 Painel da Fila de Cards

| # | Card / Funcionalidade | Tipo | Status | Checklist / Especificação |
|---|---|---|:---:|---|
| **04** | Fiscalização — Registro de Emergência Externa (DOR004) | Nova Funcionalidade | ✅ **HOMOLOGADO (100% PASS)** | [checklist-DOR004.md](qa/checklists/checklist-DOR004.md) |
| **03** | Fiscalização — Registro de Emergência Interna (DOR003) | Nova Funcionalidade | ⏳ **PRONTO NA FILA** | [checklist-DOR003.md](qa/checklists/checklist-DOR003.md) |
| **05** | ANSLA — Silos e Armazéns (Rótulos, Navegação e Validações) | Correção de Bug / Reteste | ⏳ **PRONTO NA FILA** | [checklist-ANSLA-silos-armazens.md](qa/checklists/checklist-ANSLA-silos-armazens.md) |

---

## 🛠️ Suíte de Utilitários e Infraestrutura de QA

- **Monitor de Rede & Console F12**: [`qa/utils/qa-helper.js`](qa/utils/qa-helper.js) (intercepta HTTP >= 400, falhas de rede e erros de console).
- **Macro Auto-Enter Overnight**: [`AUTO_ENTER_ANTIGRAVITY.bat`](AUTO_ENTER_ANTIGRAVITY.bat) e [`scripts/macro_auto_enter.ps1`](scripts/macro_auto_enter.ps1).
- **Diretrizes e Padrão Oficial de Relatório**: [`AGENTS.md`](AGENTS.md).
