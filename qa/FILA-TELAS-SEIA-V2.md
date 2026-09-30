# 🏛️ Fila de Execução de Telas — GLA para SEIA V2

> **Auditoria de Telas Realizada em**: Setembro de 2026  
> **Fonte Homologada**: `https://gla-inema-hml.acto.com.br/` (GLA Legado / Filament)  
> **Destino**: `https://inema.acto.com.br/?rota=seia-v2` (SEIA V2 Oficial)  
> **Padrão Obrigatório**: [Design System SEIA V2](https://inema.acto.com.br/?rota=seia-v2&tela=design-system#templates)

---

## 🎯 Ordem de Prioridade para Implementação

A ordem foi calibrada pelo **impacto regulatório e visibilidade executiva perante os analistas e diretores do INEMA** (DIRRE, DIFIS, DIBIO, DIPRE e Financeiro).

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  P1 (Crítica): Recursos Hídricos (CERH), Transporte de Resíduos (DTRP) e Reposição │
│  P2 (Alta):    Certidões de Débito (CND), Dispensa (ANSLA) e Parcelamento         │
│  P3 (Média):   Fauna/CRAS (Animais), Imóveis Rurais (CEFIR) e SISPASS             │
│  P4 (Suporte): Catálogo de Tipologias, Potencial Poluidor e Resíduos              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Detalhamento da Fila de Telas

### 🔴 PRIORIDADE 1 — Telas Críticas (Executar Primeiro)

| ID | Nome do Módulo / Tela | Rota Legada GLA | Template SEIA V2 Recomendado | Diretoria Envolvida | Complexidade |
|:---:|---|---|---|:---:|:---:|
| **TL-01** | **CERH — Cadastro Estadual de Recursos Hídricos / Outorga** | `/cerhs` | **Template 3 (Formulário/Wizard)** + **Template 2 (Pauta)** | DIPRE / DIRRE | Alta |
| **TL-02** | **DTRP — Declaração de Transporte de Resíduos Perigosos** | `/dtrp-requerimento/dtrp-requerimentos` | **Template 3 (Formulário/Wizard)** + **Template 4 (Ficha com Abas)** | DIFIS | Média-Alta |
| **TL-03** | **Reposição Florestal & Créditos Florestais (CRF)** | `/reposicao-florestal/reposicao-florestals` | **Template 2 (Pauta Operacional)** + **Template 4 (Ficha com Abas)** | DIBIO / DIRRE | Média-Alta |

---

### 🟠 PRIORIDADE 2 — Telas de Alta Demanda e Arrecadação

| ID | Nome do Módulo / Tela | Rota Legada GLA | Template SEIA V2 Recomendado | Diretoria Envolvida | Complexidade |
|:---:|---|---|---|:---:|:---:|
| **TL-04** | **Certidão de Débito Ambiental (CND Negativa/Positiva)** | `/certidao-debito-ambiental` | **Template 5 (Portal Cidadão)** + **Template 2 (Pauta de Análise)** | Financeiro / Atendimento | Média |
| **TL-05** | **ANSLA — Atividades Não Sujeitas a Licenciamento (Dispensa)** | `/atividades-dispensadas/informacoes` | **Template 3 (Stepper Simples)** | DIRRE / DILIC | Média |
| **TL-06** | **Parcelamento de Débitos e Multas Ambientais** | `/parcelamento` | **Template 3 (Wizard de Simulação + Termo)** | Financeiro / PROJU | Média |

---

### 🟡 PRIORIDADE 3 — Biodiversidade, Fauna e Cadastros Especializados

| ID | Nome do Módulo / Tela | Rota Legada GLA | Template SEIA V2 Recomendado | Diretoria Envolvida | Complexidade |
|:---:|---|---|---|:---:|:---:|
| **TL-07** | **CRAS — Prontuário, Admissão e Manejo de Animais Silvestres** | `/cras/animais/animals` | **Template 4 (Ficha Clínica com Abas)** + **Template 2 (Pauta)** | DIBIO / Fauna | Alta |
| **TL-08** | **Cadastro de Empreendimentos e Imóveis Rurais (CEFIR/CAR)** | `/empreendimentos`, `/propriedade-rurals` | **Template 4 (Ficha com Abas e Mapas)** | DIRRE | Média |
| **TL-09** | **SISPASS — Validação de Documentos de Criadores Amadores** | `/meus-perfis`, `/validar-documentos` | **Template 2 (Pauta de Perfis)** | DIBIO / Fauna | Média |

---

### 🟢 PRIORIDADE 4 — Cadastros Básicos & Parametrizações

| ID | Nome do Módulo / Tela | Rota Legada GLA | Template SEIA V2 Recomendado | Diretoria Envolvida | Complexidade |
|:---:|---|---|---|:---:|:---:|
| **TL-10** | **Catálogos de Tipologia, Portes e Potencial Poluidor** | `/administracao/tipologia` | **Template 2 (Tabela / Data Grid de Parâmetros)** | DTI / Regulação | Baixa |
| **TL-11** | **Catálogo de Resíduos e Produtos Perigosos** | `/residuos`, `/produtos-perigosos` | **Template 2 (Tabela / Data Grid de Parâmetros)** | DTI / Fiscalização | Baixa |

---

## 🛠️ Instruções de Execução Segundo o Design System SEIA V2

Para cada tela a ser executada a partir desta fila:

### 1. Seleção e Enquadramento no Arquétipo Canônico
- **Dashboard / Painel**: Usar **Template 1** (`KpiCard` com sparklines, filtros temporais e gráficos de barras/pizza sem ícones colados em títulos).
- **Listagem / Pauta Operacional**: Usar **Template 2** (`FilamentTabs` para visões de pauta, `TableContainer` com toolbar, busca com debounce, filtros dinâmicos, status pills com dot e paginação).
- **Formulário com Múltiplas Etapas**: Usar **Template 3** (Barra oficial do documento `F-DUC` ou `F-DIFIS` com botão de retorno limpo `← Voltar aos Registros`, stepper `FilamentWizard` em chevron SVG institucional e seções modulares `Section`).
- **Detalhamento / Processo Individual**: Usar **Template 4** (Card de identificação de protocolo em `font-mono`, `FilamentTabs` para dados/tramitação/documentos e linha do tempo).
- **Serviço Externo para o Cidadão**: Usar **Template 5** (Formulário direto, linguagem simplificada, upload drag-and-drop e destaque do protocolo gerado).

### 2. Padrões Visuais Invioláveis (Zero AI Slop)
- **Cor Primária**: Estritamente o verde institucional `#0F4C3A` (`bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white`). Proibido usar roxo/púrpura ou teal genérico.
- **Botões de Ação**: Botões primários de criação (`+ Novo Requerimento`, `+ Nova Declaração`) ficam no canto superior direito do cabeçalho. NUNCA transformar botões de criação em abas de navegação.
- **Tipografia & Protocolos**: Protocolos SEI-BA, CERH, DTRP e CPF/CNPJ sempre em `font-mono`.
- **Badges Semânticos**:
  - `success`: Verde institucional suave (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - `warning`: Âmbar institucional (`bg-amber-50 text-amber-700 border-amber-200`)
  - `danger`: Vermelho suave (`bg-rose-50 text-rose-700 border-rose-200`)
  - `info`: Azul institucional (`bg-sky-50 text-sky-700 border-sky-200`)
  - `gray`: Neutro institucional (`bg-slate-100 text-slate-700 border-slate-200`)

### 3. Ciclo de Validação e Publicação
1. **Compilação**: Executar `npm run build` e garantir 0 erros TypeScript.
2. **Inspeção Visual Autônoma**: Executar Playwright em 1920x1080px e inspecionar os prints gerados via `view_file`.
3. **Deploy Simultâneo**: `git commit`, `git push origin main` e `npx vercel --prod --yes`.
4. **Verificação em Produção**: Validar ao vivo no link oficial `https://inema.acto.com.br/?rota=seia-v2`.
