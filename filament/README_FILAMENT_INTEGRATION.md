# 📘 Manual de Integração Filament PHP 5.x — Sistema GLA / Fiscalização INEMA

Este documento serve como guia completo de transição e integração direta entre o protótipo funcional aprovado (desenvolvido em React + Tailwind) e o backend oficial do INEMA construído em **Laravel + Filament PHP 5.x / 4.x (TALL Stack)**.

---

## 1. Visão Geral da Arquitetura

O design system deste projeto foi integralmente adaptado para seguir os padrões visuais, convenções de tokens e classes semânticas do **Filament 5.x** (CSS Hooks oficiais):

| Componente Filament | CSS Hook Oficial | Correspondente no Protótipo |
| :--- | :--- | :--- |
| `<x-filament::button>` | `.fi-btn`, `.fi-btn-color-*`, `.fi-btn-size-*` | `src/components/ui/button.tsx` |
| `<x-filament::badge>` | `.fi-badge`, `.fi-badge-color-*` | `src/components/ui/badge.tsx` |
| `<x-filament::section>` | `.fi-section`, `.fi-section-header`, `.fi-section-content` | `src/components/filament/Section.tsx` & `card.tsx` |
| `<x-filament::input.wrapper>` | `.fi-input-wrp`, `.fi-input-wrp-label` | `src/components/filament/InputWrapper.tsx` |
| `StatsOverviewWidget` & `Stat::make()` | `.fi-wi-stats-overview`, `.fi-wi-stats-overview-stat` | `src/components/filament/StatsOverviewWidget.tsx` |
| `TableBuilder` | `.fi-ta-ctn`, `.fi-ta-table`, `.fi-ta-header-toolbar`, `.fi-ta-row` | `src/components/filament/Table.tsx` |

---

## 2. Estrutura de Arquivos PHP Prontos (`filament/app/`)

Todos os arquivos PHP necessários já estão criados e estruturados segundo as convenções do Laravel e do Filament:

```text
filament/app/
├── Providers/Filament/
│   └── AdminPanelProvider.php          # Configuração do Painel (Cores INEMA, Inter, Grupos de Menu)
└── Filament/
    ├── Resources/
    │   ├── OcorrenciaFiscalizacaoResource.php   # Painel DIFIS (Gestão de Ocorrências, Filtros e Ações)
    │   ├── DenunciaAmbientalResource.php        # Formulário Wizard DOR001 (Denúncia Ambiental)
    │   └── EmergenciaQuimicaResource.php        # Formulário Wizard DOR004 / RE (Emergência Química)
    └── Widgets/
        ├── StatsOverviewWidget.php              # 6 KPIs com Sparklines e Cores Oficiais
        ├── AgingEstoqueChart.php                # Gráfico de Barras: Aging do Estoque
        ├── TempoMedioAnaliseChart.php           # Gráfico de Linha: Tempo Médio de Análise
        ├── ProcessosVencidosChart.php           # Gráfico Horizontal: Vencidos por Unidade
        └── ProcessosVencidosTableWidget.php     # Tabela: Top 5 Processos Vencidos
```

---

## 3. Como Importar e Ativar no Laravel

### Passo 1: Configurar Cores e Painel no `AdminPanelProvider.php`

Copie o conteúdo de `filament/app/Providers/Filament/AdminPanelProvider.php` ou integre em seu `app/Providers/Filament/AdminPanelProvider.php`:

```php
use Filament\Support\Colors\Color;

public function panel(Panel $panel): Panel
{
    return $panel
        ->default()
        ->id('admin')
        ->path('admin')
        ->brandName('INEMA • Fiscalização')
        ->colors([
            'primary' => [
                50 => '#f0f7fd',
                100 => '#e0effb',
                200 => '#b9dff7',
                300 => '#7cc4f1',
                400 => '#36a5e8',
                500 => '#0073C4', // Azul Institucional INEMA
                600 => '#0066b3',
                700 => '#005291',
                800 => '#00467a',
                900 => '#003b65',
                950 => '#002642',
            ],
            'gray' => Color::Slate,
            'danger' => Color::Rose,
            'warning' => Color::Amber,
            'success' => Color::Emerald,
            'info' => Color::Sky,
        ])
        ->font('Inter')
        ->sidebarCollapsibleOnDesktop()
        ->widgets([
            \App\Filament\Widgets\StatsOverviewWidget::class,
            \App\Filament\Widgets\AgingEstoqueChart::class,
            \App\Filament\Widgets\TempoMedioAnaliseChart::class,
            \App\Filament\Widgets\ProcessosVencidosChart::class,
            \App\Filament\Widgets\ProcessosVencidosTableWidget::class,
        ]);
}
```

### Passo 2: Copiar as Resources e Widgets

Copie as pastas `filament/app/Filament/Resources/` e `filament/app/Filament/Widgets/` diretamente para o diretório `app/Filament/` do seu projeto Laravel.

### Passo 3: Migrations / Models Necessários

As Resources esperam os seguintes Models (com seus respectivos relacionamentos padrão):
- `App\Models\OcorrenciaFiscalizacao`
- `App\Models\DenunciaAmbiental`
- `App\Models\EmergenciaQuimica`
- `App\Models\Processo`

---

## 4. Regras de Negócio Implementadas no Layout

1. **Agrupamento de Menus**:
   - `Fiscalização Ambiental (DIFIS)`:
     - `Painel Operacional DIFIS` (Ocorrências, tramitação, designação e dossiê)
     - `Denúncias Ambientais` (Formulário DOR001 com Wizard em 3 etapas)
     - `Emergências Químicas` (Formulário DOR004 com dados de ONU, risco e contenção)
2. **Design de Cores Institucionais**:
   - Primária: `#0073C4` (Azul GovBA/INEMA)
   - Estados de urgência / status:
     - Crítica / Vencido: `danger` (Vermelho/Rosa)
     - Alta / Em Apuração: `warning` (Âmbar/Laranja)
     - Média / Triagem: `info` (Azul Céu)
     - Concluída / Regular: `success` (Esmeralda)
3. **Padrão de Tabelas Filament**:
   - Toolbar com busca global e filtros suspensos (`SelectFilter`).
   - Ações de linha individuais com ícones Heroicons.
   - Bulk actions em grupos (`BulkActionGroup`).
