<?php

namespace App\Filament\Resources;

use App\Models\DenunciaAmbiental;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DenunciaAmbientalResource extends Resource
{
    protected static ?string $model = DenunciaAmbiental::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';
    protected static ?string $navigationGroup = 'Fiscalização Ambiental (DIFIS)';
    protected static ?string $navigationLabel = 'Denúncias Ambientais';
    protected static ?string $modelLabel = 'Denúncia Ambiental';
    protected static ?string $pluralModelLabel = 'Denúncias Ambientais';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Wizard::make([
                    Forms\Components\Wizard\Step::make('1. Dados Gerais da Denúncia')
                        ->icon('heroicon-m-document-text')
                        ->schema([
                            Forms\Components\Section::make('Origem e Identificação')
                                ->schema([
                                    Forms\Components\Select::make('origem_denuncia')
                                        ->label('Origem da Denúncia')
                                        ->options([
                                            'cidadao' => 'Cidadão / Ouvidoria Externa',
                                            'ministerio_publico' => 'Ministério Público (MPBA / MPF)',
                                            'policia_ambiental' => 'Polícia Ambiental (COPPA)',
                                            'inema_interno' => 'Fiscalização de Ofício INEMA',
                                            'prefeitura' => 'Órgão Municipal de Meio Ambiente',
                                        ])
                                        ->required(),

                                    Forms\Components\TextInput::make('protocolo')
                                        ->label('Nº de Protocolo SEI / Ouvidoria')
                                        ->placeholder('Ex: 021.1234.2026.0001234-56')
                                        ->maxLength(60),

                                    Forms\Components\Toggle::make('sigilo_solicitado')
                                        ->label('Solicitação de Sigilo de Identidade')
                                        ->default(true)
                                        ->helperText('Garante que a identidade do denunciante não seja exibida nos autos públicos.'),
                                ])->columns(2),

                            Forms\Components\Section::make('Dados do Denunciante (Caso não anônimo)')
                                ->schema([
                                    Forms\Components\TextInput::make('denunciante_nome')
                                        ->label('Nome Completo')
                                        ->maxLength(255),

                                    Forms\Components\TextInput::make('denunciante_cpf_cnpj')
                                        ->label('CPF ou CNPJ')
                                        ->mask('999.999.999-99'),

                                    Forms\Components\TextInput::make('denunciante_telefone')
                                        ->label('Telefone para Contato')
                                        ->tel(),

                                    Forms\Components\TextInput::make('denunciante_email')
                                        ->label('E-mail')
                                        ->email(),
                                ])->columns(2)->collapsed(),
                        ]),

                    Forms\Components\Wizard\Step::make('2. Localização e Tipologia')
                        ->icon('heroicon-m-map-pin')
                        ->schema([
                            Forms\Components\Section::make('Local do Ocorrido')
                                ->schema([
                                    Forms\Components\Select::make('municipio')
                                        ->label('Município')
                                        ->searchable()
                                        ->options([
                                            'Salvador' => 'Salvador',
                                            'Feira de Santana' => 'Feira de Santana',
                                            'Vitória da Conquista' => 'Vitória da Conquista',
                                            'Camaçari' => 'Camaçari',
                                            'Juazeiro' => 'Juazeiro',
                                            'Ilhéus' => 'Ilhéus',
                                            'Porto Seguro' => 'Porto Seguro',
                                            'Barreiras' => 'Barreiras',
                                            'Luís Eduardo Magalhães' => 'Luís Eduardo Magalhães',
                                        ])
                                        ->required(),

                                    Forms\Components\Select::make('bioma')
                                        ->label('Bioma Afetado')
                                        ->options([
                                            'mata_atlantica' => 'Mata Atlântica',
                                            'caatinga' => 'Caatinga',
                                            'cerrado' => 'Cerrado',
                                            'zona_costeira' => 'Zona Costeira / Marinho',
                                        ])
                                        ->required(),

                                    Forms\Components\TextInput::make('coordenada_latitude')
                                        ->label('Latitude (SIRGAS 2000)')
                                        ->placeholder('-12.9714'),

                                    Forms\Components\TextInput::make('coordenada_longitude')
                                        ->label('Longitude (SIRGAS 2000)')
                                        ->placeholder('-38.5014'),

                                    Forms\Components\Textarea::make('ponto_referencia')
                                        ->label('Ponto de Referência / Acesso')
                                        ->rows(2)
                                        ->columnSpanFull(),
                                ])->columns(2),

                            Forms\Components\Section::make('Tipologia Infracional')
                                ->schema([
                                    Forms\Components\CheckboxList::make('tipologias')
                                        ->label('Classificação Preliminar da Infração')
                                        ->options([
                                            'desmatamento' => 'Desmatamento e Supressão Vegetal Não Autorizada',
                                            'fauna' => 'Tráfico, Captura ou Maus-tratos de Animais Silvestres',
                                            'recursos_hidricos' => 'Captação Clandestina / Desvio de Recursos Hídricos',
                                            'poluicao' => 'Lançamento Irregular de Efluentes / Poluição Atmosférica',
                                            'minerao' => 'Extração Mineral Clandestina (Areia/Argila/Cascalho)',
                                            'loteamento' => 'Loteamento Clandestino em APP ou Unidade de Conservação',
                                        ])
                                        ->columns(2)
                                        ->required(),
                                ]),
                        ]),

                    Forms\Components\Wizard\Step::make('3. Caracterização e Evidências')
                        ->icon('heroicon-m-camera')
                        ->schema([
                            Forms\Components\Section::make('Descrição Fática')
                                ->schema([
                                    Forms\Components\Textarea::make('descricao_fatos')
                                        ->label('Relato Detalhado dos Fatos')
                                        ->helperText('Informe data de início, frequência da ocorrência, maquinário envolvido e infratores conhecidos.')
                                        ->rows(4)
                                        ->required()
                                        ->columnSpanFull(),

                                    Forms\Components\TextInput::make('suposto_infrator')
                                        ->label('Suposto Autor da Infração (Nome / Razão Social)')
                                        ->placeholder('Pessoa física ou jurídica responsável'),

                                    Forms\Components\Select::make('urgencia')
                                        ->label('Grau de Urgência Preliminar')
                                        ->options([
                                            'baixa' => 'Baixa (Fato pretérito sem dano contínuo)',
                                            'media' => 'Média (Fato recente)',
                                            'alta' => 'Alta (Em andamento / Dano iminente)',
                                            'critica' => 'Crítica (Risco à vida ou perda irreparável)',
                                        ])
                                        ->default('media')
                                        ->required(),
                                ])->columns(2),

                            Forms\Components\Section::make('Anexos e Registros Fotográficos')
                                ->schema([
                                    Forms\Components\FileUpload::make('anexos')
                                        ->label('Fotos, Vídeos, Documentos e Coordenadas GPS')
                                        ->multiple()
                                        ->maxFiles(10)
                                        ->maxSize(51200)
                                        ->directory('denuncias/anexos')
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
                Tables\Columns\TextColumn::make('protocolo')
                    ->label('Protocolo')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),

                Tables\Columns\TextColumn::make('municipio')
                    ->label('Município')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('urgencia')
                    ->label('Urgência')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'critica' => 'danger',
                        'alta' => 'warning',
                        'media' => 'info',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'concluida' => 'success',
                        'em_apuracao' => 'warning',
                        'triagem' => 'info',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Data Registro')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('urgencia')
                    ->options([
                        'critica' => 'Crítica',
                        'alta' => 'Alta',
                        'media' => 'Média',
                        'baixa' => 'Baixa',
                    ]),
                Tables\Filters\SelectFilter::make('municipio'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDenunciasAmbientais::route('/'),
            'create' => Pages\CreateDenunciaAmbiental::route('/create'),
            'edit' => Pages\EditDenunciaAmbiental::route('/{record}/edit'),
        ];
    }
}
