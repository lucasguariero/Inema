# Checklist de Homologação — CRF: Incapacidade de Produção de Volume Vinculado ao Crédito de Reposição Florestal

> **Ambiente**: https://gla-inema-hml.acto.com.br/  
> **Módulo**: Reposição Florestal › Reposições Florestais (`/reposicao-florestal/reposicao-florestals`)  
> **Data**: 2026-09-10  
> **Líder de QA**: Lucas Guariero  
> **Status**: ✅ **APROVADO / HOMOLOGADO (100% PASS)**

---

## 📋 Matriz de Testes Executada

### Bloco 1: Identificação e Acesso
- [x] **1.1** Autenticação com `Admin INEMA` (`000.000.000-00`): seleção de "Quem sou eu? → Requerente" associando o titular do crédito de reposição florestal.
- [x] **1.2** Empreendimento vinculado: seleção de `DTRP Demonstração` com avanço liberado para os questionários.

### Bloco 2: Modalidade e Questionários (Passo 2)
- [x] **2.1** Seleção da modalidade: `"Incapacidade de produção de volume de produto florestal vinculado a crédito de reposição florestal"`.
- [x] **2.2** Pergunta obrigatória de Grande Consumidor (Art. 55 do Decreto BA 18.140/2018): seleção de `"Não"`.
- [x] **2.3** Exibição das opções de motivo da incapacidade: `Incêndio florestal`, `Pragas ou doenças`, `Seca / evento climático`, `Mortalidade do plantio` e `Outro`.
- [x] **2.4** Campos somente leitura por padrão: `Nº da portaria do crédito` e `Nº do processo administrativo` mantidos em branco conforme regra de negócio da Reserva Futura.

### Bloco 3: Memória de Cálculo da Regularização (Art. 51 do Decreto nº 15.180/2014)
- [x] **3.1** Valor unitário base: `R$ 18,00/m³`.
- [x] **3.2** Simulação com `100 m³`:
  - Volume irregular informado: `100,0000 m³`;
  - Valor base (`100 m³ * R$ 18,00`): `R$ 1.800,00`;
  - Percentual adicional Art. 51 (`20%`): `R$ 360,00`;
  - **Valor total devido ao FERFA**: `R$ 2.160,00` (exato).
- [x] **3.3** Termo de Ciência e declaração de veracidade: presença do bloco legal de confirmação obrigatória.
