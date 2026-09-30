<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OcorrenciaFiscalizacaoResource\Pages;
use App\Models\OcorrenciaFiscalizacao;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\FileUpload;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Actions\EditAction;
use Filament\Support\Enums\FontWeight;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Builder;

/**
 * Recurso de Operações DIFIS - Fiscalização e Atendimento a Emergências Químicas
 * 
 * Filament Resource 5.x / 4.x que implementa a pauta técnica centralizada de
 * fiscalização ambiental do INEMA.
 */
class OcorrenciaFiscalizacaoResource extends Resource
{
    protected static ?string $model = OcorrenciaFiscalizacao::class;

    protected static ?string $navigationIcon = 'heroicon-o-shield-check';

    protected static ?string $navigationGroup = 'Fiscalização';

    protected static ?string $navigationLabel = 'Painel Interno DIFIS';

    protected static ?string $modelLabel = 'Ocorrência DIFIS';

    protected static ?string $pluralModelLabel = 'Ocorrências DIFIS';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        // Badge numérico de ocorrências ativas (3 na demonstração)
        return '3';
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }

    /**
     * Esquema do Formulário de Fiscalização (Sections e Grid do Filament)
     */
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('1. Detalhes do Comunicado e Nível de Severidade')
                    ->description('Origem do acionamento e classificação de risco operacional.')
                    ->icon('heroicon-m-document-text')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('protocolo')
                                ->label('Protocolo Oficial')
                                ->default(fn () => '2026.' . str_pad((string) rand(100, 999999), 6, '0', STR_PAD_LEFT) . '/INEMA/RE')
                                ->disabled()
                                ->dehydrated(),

                            Select::make('tipo')
                                ->label('Tipo de Ocorrência')
                                ->options([
                                    'RD' => 'RD • Denúncia Ambiental',
                                    'RE' => 'RE • Emergência Química',
                                ])
                                ->required()
                                ->default('RE'),

                            Select::make('prioridade')
                                ->label('Nível de Severidade')
                                ->options([
                                    'Crítica' => 'Nível 3 (Crítico)',
                                    'Alta' => 'Nível 2 (Alto)',
                                    'Média' => 'Nível 1 (Médio)',
                                    'Normal' => 'Normal',
                                ])
                                ->required()
                                ->default('Crítica'),
                        ]),

                        Grid::make(3)->schema([
                            Select::make('origem_chamado')
                                ->label('Origem do Acionamento')
                                ->options([
                                    'Call center (Plantão 24h)' => 'Call center (Plantão 24h)',
                                    'Corpo de Bombeiros Militar (CBMBA)' => 'Corpo de Bombeiros Militar (CBMBA)',
                                    'Polícia Rodoviária Federal (PRF)' => 'Polícia Rodoviária Federal (PRF)',
                                    'Defesa Civil Estadual (CORDEC)' => 'Defesa Civil Estadual (CORDEC)',
                                    'Empresa Geradora / Transportadora' => 'Empresa Geradora / Transportadora',
                                    'Comunidade / Cidadão' => 'Comunidade / Cidadão',
                                ])
                                ->required(),

                            DateTimePicker::make('data_hora_comunicado')
                                ->label('Data e Hora do Comunicado')
                                ->default(now())
                                ->required(),

                            TextInput::make('comunicante_nome')
                                ->label('Nome do Comunicante / Órgão')
                                ->placeholder('Ex: Subtenente Lima (CBMBA)')
                                ->required(),
                        ]),
                    ]),

                Section::make('2. Localização, Envolvidos e Cargas Químicas')
                    ->description('Coordenadas, empresa responsável e substâncias envolvidas no sinistro.')
                    ->icon('heroicon-m-map-pin')
                    ->schema([
                        Grid::make(3)->schema([
                            Select::make('municipio')
                                ->label('Município')
                                ->options([
                                    'Salvador' => 'Salvador',
                                    'Candeias' => 'Candeias',
                                    'Camaçari' => 'Camaçari',
                                    'Simões Filho' => 'Simões Filho',
                                    'Feira de Santana' => 'Feira de Santana',
                                    'Barreiras' => 'Barreiras',
                                    'Ilhéus' => 'Ilhéus',
                                    'Vitória da Conquista' => 'Vitória da Conquista',
                                    'Juazeiro' => 'Juazeiro',
                                ])
                                ->searchable()
                                ->required(),

                            TextInput::make('localidade')
                                ->label('Rodovia / Bairro / Referência')
                                ->placeholder('Ex: BA-522, Km 18')
                                ->required(),

                            Select::make('unidade_regional')
                                ->label('Unidade Regional (UR)')
                                ->options([
                                    'UR Metropolitana' => 'UR Metropolitana',
                                    'UR Oeste' => 'UR Oeste (Barreiras)',
                                    'UR Litoral Sul' => 'UR Litoral Sul (Ilhéus)',
                                    'UR Chapada' => 'UR Chapada Diamantina',
                                    'UR São Francisco' => 'UR São Francisco (Juazeiro)',
                                ])
                                ->required(),
                        ]),

                        Grid::make(3)->schema([
                            TextInput::make('infrator_ou_responsavel')
                                ->label('Empresa / Infrator Alvo')
                                ->placeholder('Ex: Transquímica Logística Ltda')
                                ->required(),

                            TextInput::make('cnpj_empresa')
                                ->label('CNPJ / CPF')
                                ->placeholder('00.000.000/0001-00'),

                            TextInput::make('substancia')
                                ->label('Substância Envolvida (RE)')
                                ->placeholder('Ex: Ácido Sulfúrico (ONU 1830)'),
                        ]),

                        Textarea::make('descricao')
                            ->label('Descrição da Ocorrência e Impacto Constatado')
                            ->rows(4)
                            ->columnSpanFull()
                            ->required(),
                    ]),

                Section::make('3. Ações de Resposta, Contenção e Destinação Técnica')
                    ->description('Medidas emergenciais adotadas em campo e fiscal designado.')
                    ->icon('heroicon-m-wrench-screwdriver')
                    ->schema([
                        Grid::make(2)->schema([
                            Select::make('tecnico_responsavel')
                                ->label('Fiscal Designado (DIFIS)')
                                ->options([
                                    'Eng. Carlos Andrade (DIFIS)' => 'Eng. Carlos Andrade (DIFIS)',
                                    'Bióloga Fernanda Mattos (UR Barreiras)' => 'Bióloga Fernanda Mattos (UR Barreiras)',
                                    'Inspetor Marcos Ribeiro (DIFIS)' => 'Inspetor Marcos Ribeiro (DIFIS)',
                                    'Fiscal Rodrigo Santos' => 'Fiscal Rodrigo Santos',
                                    'Eng. Luciana Prado (UR Ilhéus)' => 'Eng. Luciana Prado (UR Ilhéus)',
                                ]),

                            Select::make('status')
                                ->label('Status Inicial do Processo')
                                ->options([
                                    'Registrado' => 'Registrado',
                                    'Em Análise' => 'Em Análise',
                                    'Vistoria Agendada' => 'Vistoria Agendada',
                                    'Notificado' => 'Notificado',
                                    'Auto de Infração' => 'Auto de Infração',
                                    'Concluído' => 'Concluído',
                                ])
                                ->default('Em Análise')
                                ->required(),
                        ]),

                        Textarea::make('medidas_adotadas')
                            ->label('Medidas Emergenciais / Notificações Adotadas')
                            ->rows(3)
                            ->columnSpanFull(),

                        FileUpload::make('anexos')
                            ->label('Documentos, Fotos e Laudos da Fiscalização')
                            ->multiple()
                            ->directory('fiscalizacao-anexos')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    /**
     * Tabela de Fiscalização DIFIS (Colunas, Filtros e Ações de Linha do Filament)
     */
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('protocolo')
                    ->label('Protocolo / Tipo')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->copyable()
                    ->description(fn ($record) => $record->tipo . ' • ' . ($record->tipo === 'RE' ? 'Emergência Química' : 'Denúncia Ambiental')),

                TextColumn::make('descricao')
                    ->label('Objeto / Ocorrência')
                    ->limit(45)
                    ->tooltip(fn ($record) => $record->descricao)
                    ->description(fn ($record) => 'Alvo: ' . $record->infrator_ou_responsavel),

                TextColumn::make('municipio')
                    ->label('Município / UR')
                    ->sortable()
                    ->description(fn ($record) => $record->unidade_regional),

                TextColumn::make('prioridade')
                    ->label('Prioridade')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Crítica' => 'danger',
                        'Alta' => 'warning',
                        'Média' => 'info',
                        default => 'gray',
                    }),

                TextColumn::make('tecnico_responsavel')
                    ->label('Fiscal Responsável')
                    ->default('Pendente')
                    ->badge(fn ($state) => $state === 'Pendente')
                    ->color(fn ($state) => $state === 'Pendente' ? 'warning' : 'gray')
                    ->icon(fn ($state) => $state !== 'Pendente' ? 'heroicon-m-user-circle' : null),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Concluído' => 'success',
                        'Auto de Infração' => 'danger',
                        'Notificado', 'Em Análise' => 'warning',
                        'Vistoria Agendada' => 'info',
                        default => 'gray',
                    }),
            ])
            ->filters([
                SelectFilter::make('tipo')
                    ->label('Tipo de Ocorrência')
                    ->options([
                        'RE' => 'Emergências Químicas (RE)',
                        'RD' => 'Denúncias Ambientais (RD)',
                    ]),

                SelectFilter::make('unidade_regional')
                    ->label('Unidade Regional')
                    ->options([
                        'UR Metropolitana' => 'UR Metropolitana',
                        'UR Oeste' => 'UR Oeste (Barreiras)',
                        'UR Litoral Sul' => 'UR Litoral Sul (Ilhéus)',
                        'UR Chapada' => 'UR Chapada Diamantina',
                        'UR São Francisco' => 'UR São Francisco (Juazeiro)',
                    ]),

                SelectFilter::make('prioridade')
                    ->label('Prioridade')
                    ->options([
                        'Crítica' => 'Crítica',
                        'Alta' => 'Alta',
                        'Média' => 'Média',
                        'Normal' => 'Normal',
                    ]),

                SelectFilter::make('status')
                    ->label('Status do Processo')
                    ->options([
                        'Em Análise' => 'Em Análise',
                        'Vistoria Agendada' => 'Vistoria Agendada',
                        'Notificado' => 'Notificado',
                        'Auto de Infração' => 'Auto de Infração',
                        'Concluído' => 'Concluído',
                    ]),
            ])
            ->actions([
                Action::make('designar')
                    ->label('Designar')
                    ->icon('heroicon-m-user-plus')
                    ->color('gray')
                    ->outlined()
                    ->form([
                        Select::make('tecnico_responsavel')
                            ->label('Selecione o Fiscal da DIFIS')
                            ->options([
                                'Eng. Carlos Andrade (DIFIS)' => 'Eng. Carlos Andrade (DIFIS/Plantão)',
                                'Bióloga Fernanda Mattos (UR Barreiras)' => 'Bióloga Fernanda Mattos (UR Barreiras)',
                                'Inspetor Marcos Ribeiro (DIFIS)' => 'Inspetor Marcos Ribeiro (DIFIS)',
                                'Fiscal Rodrigo Santos' => 'Fiscal Rodrigo Santos',
                                'Eng. Luciana Prado (UR Ilhéus)' => 'Eng. Luciana Prado (UR Ilhéus)',
                            ])
                            ->required(),
                    ])
                    ->action(function (array $data, OcorrenciaFiscalizacao $record): void {
                        $record->update([
                            'tecnico_responsavel' => $data['tecnico_responsavel'],
                            'status' => 'Em Análise',
                        ]);

                        Notification::make()
                            ->title('Técnico Designado com Sucesso')
                            ->body("Ocorrência {$record->protocolo} atribuída a {$data['tecnico_responsavel']}.")
                            ->success()
                            ->send();
                    }),

                ViewAction::make('dossie')
                    ->label('Dossiê')
                    ->icon('heroicon-m-eye')
                    ->color('gray'),
            ])
            ->headerActions([
                Action::make('nova_denuncia')
                    ->label('Nova Denúncia')
                    ->icon('heroicon-m-plus-circle')
                    ->color('gray')
                    ->url(fn () => static::getUrl('create', ['tipo' => 'RD'])),

                Action::make('autuar_emergencia')
                    ->label('Autuar Emergência (RE)')
                    ->icon('heroicon-m-exclamation-triangle')
                    ->color('danger')
                    ->url(fn () => static::getUrl('create', ['tipo' => 'RE'])),

                Action::make('exportar_pauta')
                    ->label('Exportar Pauta')
                    ->icon('heroicon-m-arrow-down-tray')
                    ->color('gray')
                    ->action(function () {
                        Notification::make()
                            ->title('Exportando Pauta DIFIS')
                            ->body('A planilha consolidada está sendo gerada...')
                            ->info()
                            ->send();
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOcorrencias::route('/'),
            'create' => Pages\CreateOcorrencia::route('/create'),
            'view' => Pages\ViewOcorrencia::route('/{record}'),
            'edit' => Pages\EditOcorrencia::route('/{record}/edit'),
        ];
    }
}
