<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

/**
 * Gráfico de Aging do Estoque de Processos
 * 
 * Filament ChartWidget gerando o gráfico de faixas temporais (0-15d, 16-30d, etc).
 */
class AgingEstoqueChart extends ChartWidget
{
    protected static ?string $heading = 'Aging do Estoque';

    protected static ?int $sort = 2;

    protected static ?string $maxHeight = '280px';

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'Processos em Estoque',
                    'data' => [412, 678, 945, 612, 403, 198],
                    'backgroundColor' => [
                        '#10B981', // 0-15 dias
                        '#0D9488', // 16-30 dias
                        '#F59E0B', // 31-60 dias
                        '#EA580C', // 61-90 dias
                        '#E11D48', // 91-180 dias
                        '#BE123C', // > 180 dias
                    ],
                    'borderRadius' => 6,
                ],
            ],
            'labels' => ['0-15 dias', '16-30 dias', '31-60 dias', '61-90 dias', '91-180 dias', '> 180 dias'],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
