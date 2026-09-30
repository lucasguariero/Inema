<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

class ProcessosVencidosChart extends ChartWidget
{
    protected static ?string $heading = 'Processos Vencidos por Unidade';
    protected static ?int $sort = 4;
    protected int | string | array $columnSpan = 1;
    protected static ?string $maxHeight = '280px';

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'Processos Vencidos',
                    'data' => [42, 28, 19, 14, 9, 6],
                    'backgroundColor' => [
                        '#DC2626', // UR-SUL
                        '#EA580C', // UR-NORTE
                        '#D97706', // UR-OESTE
                        '#CA8A04', // UR-METROPOLITANA
                        '#65A30D', // UR-CHAPADA
                        '#0284C7', // SEDE/DIFIS
                    ],
                    'borderRadius' => 6,
                ],
            ],
            'labels' => ['UR-SUL', 'UR-NORTE', 'UR-OESTE', 'UR-METROPOLITANA', 'UR-CHAPADA', 'SEDE/DIFIS'],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'indexAxis' => 'y',
            'plugins' => [
                'legend' => [
                    'display' => false,
                ],
            ],
            'scales' => [
                'x' => [
                    'grid' => [
                        'display' => true,
                        'color' => 'rgba(156, 163, 175, 0.1)',
                    ],
                ],
                'y' => [
                    'grid' => [
                        'display' => false,
                    ],
                ],
            ],
        ];
    }
}
