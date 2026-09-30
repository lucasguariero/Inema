<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Enums\Width;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

/**
 * GLA INEMA - Admin Panel Provider (Filament 5.x / 4.x Compatible)
 * 
 * Configuração central do painel administrativo do GLA Inema, definindo
 * paleta de cores institucional, navegação, agrupamento e widgets globais.
 */
class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->font('Inter')
            ->brandLogo(asset('assets/logo-inema-color.png'))
            ->darkModeBrandLogo(asset('assets/logo-inema-white.png'))
            ->brandLogoHeight('2.25rem')
            ->favicon(asset('favicon.ico'))
            ->maxContentWidth(Width::SevenExtraLarge)
            ->sidebarCollapsibleOnDesktop()
            ->databaseNotifications()
            ->colors([
                // Cor primária institucional Inema (Verde Institucional Oficial #0F4C3A)
                'primary' => [
                    50 => '#f0fdf4',
                    100 => '#dcfce7',
                    200 => '#bbf7d0',
                    300 => '#86efac',
                    400 => '#4ade80',
                    500 => '#0F4C3A',
                    600 => '#0c3d2e',
                    700 => '#092f24',
                    800 => '#07241b',
                    900 => '#051913',
                    950 => '#020d0a',
                ],
                'gray' => Color::Slate,
                'danger' => Color::Rose,
                'warning' => Color::Amber,
                'success' => Color::Emerald,
                'info' => Color::Sky,
            ])
            ->navigationGroups([
                'Início / Área de Trabalho',
                'Atendimento e Cadastros',
                'Recursos Hídricos',
                'Flora e Vegetação',
                'Fauna',
                'Fiscalização e Controle',
                'Conservação e Socioambiental',
                'Monitoramento e Informação Ambiental',
                'Gestão Institucional',
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                \App\Filament\Widgets\StatsOverviewWidget::class,
                \App\Filament\Widgets\AgingEstoqueChart::class,
                \App\Filament\Widgets\TempoMedioAnaliseChart::class,
                \App\Filament\Widgets\ProcessosVencidosChart::class,
                \App\Filament\Widgets\ProcessosVencidosTableWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
