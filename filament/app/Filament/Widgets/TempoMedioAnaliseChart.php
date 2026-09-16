<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

/**
 * Gráfico de Tempo Médio de Análise (dias)
 * 
 * Filament ChartWidget gerando a evolução temporal do tempo médio de análise.
 */
class TempoMedioAnaliseChart extends ChartWidget
{
    protected static ?string $heading = 'Tempo Médio de Análise (dias)';

    protected static ?int $sort = 3;

    protected static ?string $maxHeight = '280px';

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'Média Geral (dias)',
                    'data' => [48, 45, 42, 39, 36, 32],
                    'borderColor' => '#0073C4',
                    'backgroundColor' => 'rgba(0, 115, 196, 0.1)',
                    'fill' => true,
                    'tension' => 0.35,
                ],
                [
                    'label' => 'Meta Regulatória (30d)',
                    'data' => [30, 30, 30, 30, 30, 30],
                    'borderColor' => '#10B981',
                    'borderDash' => [5, 5],
                    'fill' => false,
                ],
            ],
            'labels' => ['Out/23', 'Nov/23', 'Dez/23', 'Jan/24', 'Fev/24', 'Mar/24'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
