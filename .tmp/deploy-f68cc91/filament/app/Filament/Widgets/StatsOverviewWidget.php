<?php

namespace App\Filament\Widgets;

use App\Models\Processo;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

/**
 * Widget de Estatísticas Gerais do GLA INEMA
 * 
 * Filament 5.x / 4.x StatsOverviewWidget implementando os 6 KPIs oficiais
 * da Dashboard com sparklines, deltas percentuais e cores estritas de requisito.
 */
class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Protocolados', '1.245')
                ->description('+12% vs. mês ant.')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->chart([10, 14, 12, 19, 17, 24, 28]),

            Stat::make('Em Análise', '2.356')
                ->description('-3% vs. mês ant.')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->color('gray')
                ->chart([25, 22, 24, 18, 20, 16, 15]),

            Stat::make('Pendentes', '873')
                ->description('+8% vs. mês ant.')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('warning') // Laranja/Amber conforme regra de negócio
                ->chart([12, 15, 18, 14, 22, 25, 29]),

            Stat::make('Vencidos', '189')
                ->description('-15% vs. mês ant.')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->color('danger') // Vermelho/Rose conforme regra de negócio
                ->chart([35, 30, 28, 25, 22, 20, 18]),

            Stat::make('Concluídos', '3.421')
                ->description('+18% vs. mês ant.')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->chart([15, 18, 22, 28, 30, 35, 42]),

            Stat::make('Atos Concedidos', '2.980')
                ->description('+14% vs. mês ant.')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->chart([14, 16, 20, 25, 28, 32, 38]),
        ];
    }
}
