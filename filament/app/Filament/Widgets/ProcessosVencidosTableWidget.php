<?php

namespace App\Filament\Widgets;

use App\Models\Processo;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class ProcessosVencidosTableWidget extends BaseWidget
{
    protected static ?string $heading = 'Processos Vencidos (Top 5)';
    protected static ?int $sort = 5;
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                // In production, Processo::query()->where('vencido', true)->orderByDesc('dias_atraso')->limit(5)
                Processo::query()->where('status', 'Vencido')
            )
            ->columns([
                Tables\Columns\TextColumn::make('numero_processo')
                    ->label('Nº Processo')
                    ->searchable()
                    ->weight('medium')
                    ->copyable(),

                Tables\Columns\TextColumn::make('unidade_responsavel')
                    ->label('Unidade Responsável')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('tecnico_designado')
                    ->label('Técnico Designado')
                    ->placeholder('Não atribuído'),

                Tables\Columns\TextColumn::make('dias_atraso')
                    ->label('Dias em Atraso')
                    ->badge()
                    ->color('danger')
                    ->formatStateUsing(fn (string $state): string => "{$state} dias"),

                Tables\Columns\TextColumn::make('data_vencimento')
                    ->label('Vencimento')
                    ->date('d/m/Y'),
            ])
            ->actions([
                Tables\Actions\Action::make('visualizar')
                    ->label('Abrir')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->url(fn (Processo $record): string => route('filament.admin.resources.processos.view', $record)),
            ])
            ->paginated(false);
    }
}
