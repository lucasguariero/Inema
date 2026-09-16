<?php

namespace App\Filament\Resources;

use App\Models\EmergenciaQuimica;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class EmergenciaQuimicaResource extends Resource
{
    protected static ?string $model = EmergenciaQuimica::class;

    protected static ?string $navigationIcon = 'heroicon-o-fire';
    protected static ?string $navigationGroup = 'Fiscalização Ambiental (DIFIS)';
    protected static ?string $navigationLabel = 'Emergências Químicas';
    protected static ?string $modelLabel = 'Emergência Química';
    protected static ?string $pluralModelLabel = 'Emergências Químicas';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Wizard::make([
                    Forms\Components\Wizard\Step::make('1. Identificação do Evento Crítico')
                        ->icon('heroicon-m-exclamation-triangle')
                        ->schema([
                            Forms\Components\Section::make('Dados da Comunicação')
                                ->schema([
                                    Forms\Components\DateTimePicker::make('data_hora_acidente')
                                        ->label('Data e Hora do Sinistro')
                                        ->required()
                                        ->default(now()),

                                    Forms\Components\Select::make('tipo_acidente')
                                        ->label('Tipo de Ocorrência')
                                        ->options([
                                            'tombamento' => 'Tombamento de Carga Perigosa em Rodovia',
                                            'vazamento_industrial' => 'Vazamento em Instalação Industrial / Polo',
                                            'explosao_incendio' => 'Explosão / Incêndio com Produtos Químicos',
                                            'derrame_aquatico' => 'Derrame em Rio, Lagoa, Estuário ou Mar',
                                            'ruptura_duto' => 'Ruptura ou Furo em Duto / Oleoduto',
                                        ])
                                        ->required(),

                                    Forms\Components\TextInput::make('rodovia_km')
                                        ->label('Rodovia / KM ou Logradouro')
                                        ->placeholder('Ex: BR-324, KM 585')
                                        ->required(),

                                    Forms\Components\Select::make('municipio')
                                        ->label('Município')
                                        ->searchable()
                                        ->options([
                                            'Candeias' => 'Candeias',
                                            'Camaçari' => 'Camaçari',
                                            'Dias d\'Ávila' => 'Dias d\'Ávila',
                                            'São Francisco do Conde' => 'São Francisco do Conde',
                                            'Salvador' => 'Salvador',
                                            'Feira de Santana' => 'Feira de Santana',
                                            'Simões Filho' => 'Simões Filho',
                                            'Jequié' => 'Jequié',
                                        ])
                                        ->required(),
                                ])->columns(2),

                            Forms\Components\Section::make('Empresa Responsável / Transportadora')
                                ->schema([
                                    Forms\Components\TextInput::make('empresa_razao_social')
                                        ->label('Razão Social / Transportadora')
                                        ->required(),

                                    Forms\Components\TextInput::make('empresa_cnpj')
                                        ->label('CNPJ')
                                        ->mask('99.999.999/9999-99'),

                                    Forms\Components\TextInput::make('responsavel_local')
                                        ->label('Representante / Técnico no Local')
                                        ->maxLength(255),

                                    Forms\Components\TextInput::make('contato_plantao')
                                        ->label('Telefone do Plantão de Emergência')
                                        ->tel()
                                        ->required(),
                                ])->columns(2),
                        ]),

                    Forms\Components\Wizard\Step::make('2. Caracterização Química e Contaminação')
                        ->icon('heroicon-m-beaker')
                        ->schema([
                            Forms\Components\Section::make('Substâncias Envolvidas')
                                ->schema([
                                    Forms\Components\TextInput::make('nome_produto')
                                        ->label('Nome Comercial / Químico')
                                        ->placeholder('Ex: Óleo Diesel B S10 / Ácido Sulfúrico')
                                        ->required(),

                                    Forms\Components\TextInput::make('numero_onu')
                                        ->label('Número ONU')
                                        ->placeholder('Ex: 1202')
                                        ->maxLength(4)
                                        ->required(),

                                    Forms\Components\TextInput::make('numero_risco')
                                        ->label('Número de Risco (Painel de Segurança)')
                                        ->placeholder('Ex: 30 / 80')
                                        ->maxLength(6),

                                    Forms\Components\Select::make('classe_risco')
                                        ->label('Classe de Risco (ONU)')
                                        ->options([
                                            '3' => 'Classe 3 - Líquidos Inflamáveis',
                                            '8' => 'Classe 8 - Substâncias Corrosivas',
                                            '6.1' => 'Classe 6.1 - Substâncias Tóxicas',
                                            '2.1' => 'Classe 2.1 - Gases Inflamáveis',
                                            '9' => 'Classe 9 - Substâncias Perigosas Diversas',
                                        ])
                                        ->required(),

                                    Forms\Components\TextInput::make('volume_estimado')
                                        ->label('Volume / Peso Estimado Derramado')
                                        ->placeholder('Ex: 15.000 Litros')
                                        ->required(),
                                ])->columns(2),

                            Forms\Components\Section::make('Corpos Hídricos e Vulnerabilidade')
                                ->schema([
                                    Forms\Components\Toggle::make('atingiu_corpo_hidrico')
                                        ->label('Atingiu curso d\'água ou manancial de abastecimento?')
                                        ->helperText('Prioridade máxima caso haja captação para abastecimento público.')
                                        ->reactive(),

                                    Forms\Components\TextInput::make('nome_rio_manancial')
                                        ->label('Nome do Rio, Riacho ou Represa Afetada')
                                        ->visible(fn (Forms\Get $get) => $get('atingiu_corpo_hidrico')),

                                    Forms\Components\Toggle::make('vitimas_fatais')
                                        ->label('Houve vítimas fatais ou feridos graves?'),

                                    Forms\Components\Toggle::make('necessidade_evacuacao')
                                        ->label('Houve evacuação de comunidade / bloqueio viário total?'),
                                ])->columns(2),
                        ]),

                    Forms\Components\Wizard\Step::make('3. Medidas Mitigadoras e Plano de Ação')
                        ->icon('heroicon-m-shield-check')
                        ->schema([
                            Forms\Components\Section::make('Forças de Resposta Acionadas')
                                ->schema([
                                    Forms\Components\CheckboxList::make('orgaos_presentes')
                                        ->label('Órgãos já presentes ou notificados')
                                        ->options([
                                            'bombeiros' => 'Corpo de Bombeiros Militar (CBMBA)',
                                            'prf_pm' => 'Polícia Rodoviária Federal / PMBA',
                                            'defesa_civil' => 'Defesa Civil Estadual / Municipal',
                                            'embasa' => 'EMBASA (Companhia de Águas e Saneamento)',
                                            'inema_plantao' => 'Plantão DIFIS / INEMA',
                                            'empresa_emergencia' => 'Empresa Especializada em Resposta a Emergências (Ambipar/Suatrans)',
                                        ])
                                        ->columns(2),
                                ]),

                            Forms\Components\Section::make('Contenção e Destinação')
                                ->schema([
                                    Forms\Components\Textarea::make('acoes_imediatas')
                                        ->label('Ações Imediatas de Contenção Adotadas')
                                        ->placeholder('Descreva uso de barreiras absorventes, diques de contenção, transbordo de produto...')
                                        ->rows(3)
                                        ->columnSpanFull(),

                                    Forms\Components\FileUpload::make('fotos_ocorrencia')
                                        ->label('Fotos do Local, Caminhão, Placas de Risco e Contenção')
                                        ->multiple()
                                        ->maxFiles(8)
                                        ->directory('emergencias/anexos')
                                        ->columnSpanFull(),
                                ]),
                        ]),
                ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Hora Sinistro')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('municipio')
                    ->label('Município')
                    ->searchable(),

                Tables\Columns\TextColumn::make('nome_produto')
                    ->label('Produto Envolvido')
                    ->description(fn (EmergenciaQuimica $record): string => "ONU: {$record->numero_onu}"),

                Tables\Columns\IconColumn::make('atingiu_corpo_hidrico')
                    ->label('Manancial Afetado')
                    ->boolean()
                    ->trueIcon('heroicon-o-exclamation-triangle')
                    ->trueColor('danger')
                    ->falseIcon('heroicon-o-check-circle')
                    ->falseColor('success'),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status Resposta')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'controlado' => 'success',
                        'em_atendimento' => 'danger',
                        'monitoramento' => 'warning',
                        default => 'gray',
                    }),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('atingiu_corpo_hidrico')
                    ->label('Risco a Recursos Hídricos'),
                Tables\Filters\SelectFilter::make('municipio'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEmergenciasQuimicas::route('/'),
            'create' => Pages\CreateEmergenciaQuimica::route('/create'),
            'edit' => Pages\EditEmergenciaQuimica::route('/{record}/edit'),
        ];
    }
}
