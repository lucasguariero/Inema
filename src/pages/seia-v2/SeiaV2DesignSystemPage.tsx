import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Award,
  Bell,
  Boxes,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleHelp,
  Clock3,
  Code2,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Info,
  Layers,
  LayoutDashboard,
  LoaderCircle,
  MapPin,
  Menu,
  Minus,
  MoreHorizontal,
  MoreVertical,
  Move,
  PanelLeftClose,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FilamentSelect,
  FilamentTabs,
  FilamentWizard,
  InputWrapper,
  Section,
  TableContainer,
} from '@/components/filament';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { ShadcnHeader } from '@/components/seia-v2/shadcn/ShadcnHeader';
import { cn } from '@/lib/utils';
import seiaLogoWhite from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_HORIZONTAL_W.svg';
import seiaLogoColor from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_HORIZONTAL_COR.svg';
import seiaLogoGW from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_HORIZONTAL_G&W.svg';
import seiaIconWhite from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_ICON_W.svg';
import seiaIconColor from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_ICON_COR.svg';
import seiaIconGW from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_ICON_G&W.svg';

type CatalogSection = {
  id: string;
  label: string;
  group: string;
};

const catalogSections: CatalogSection[] = [
  { id: 'overview', label: 'Visão geral', group: 'Começar' },
  { id: 'brand', label: 'Marca e assets', group: 'Fundações' },
  { id: 'colors', label: 'Cores e tokens', group: 'Fundações' },
  { id: 'typography', label: 'Tipografia', group: 'Fundações' },
  { id: 'spacing', label: 'Espaçamento e forma', group: 'Fundações' },
  { id: 'icons', label: 'Ícones', group: 'Fundações' },
  { id: 'buttons', label: 'Botões', group: 'Componentes' },
  { id: 'fields', label: 'Campos e seleção', group: 'Componentes' },
  { id: 'badges', label: 'Badges e estados', group: 'Componentes' },
  { id: 'cards', label: 'Cards e métricas', group: 'Componentes' },
  { id: 'navigation', label: 'Navegação', group: 'Componentes' },
  { id: 'table', label: 'Tabelas', group: 'Componentes' },
  { id: 'wizard', label: 'Wizard', group: 'Componentes' },
  { id: 'feedback', label: 'Feedback e overlays', group: 'Componentes' },
  { id: 'patterns', label: 'Padrões de página', group: 'Composições' },
  { id: 'templates', label: 'Templates de telas', group: 'Composições' },
  { id: 'accessibility', label: 'Acessibilidade', group: 'Diretrizes' },
];

const catalogGroupIcons: Record<string, React.ElementType> = {
  Começar: LayoutDashboard,
  Fundações: SlidersHorizontal,
  Componentes: Boxes,
  Composições: PanelLeftClose,
  Diretrizes: ShieldAlert,
};

const greenTokens = [
  ['50', '#F2F8F5'],
  ['100', '#DDECE5'],
  ['200', '#BBD8CA'],
  ['300', '#8EBBA7'],
  ['400', '#5E987F'],
  ['500', '#35785F'],
  ['600', '#1F6049'],
  ['700', '#0F4C3A'],
  ['800', '#0C3D2F'],
  ['900', '#092F24'],
  ['950', '#041A14'],
] as const;

const semanticTokens = [
  ['Primary', '--color-brand-primary', 'var(--color-brand-primary)'],
  ['Primary Subtle', '--color-brand-primary-subtle', 'var(--color-brand-primary-subtle)'],
  ['Canvas', '--color-surface-canvas', 'var(--color-surface-canvas)'],
  ['Surface', '--color-surface-default', 'var(--color-surface-default)'],
  ['Surface Subtle', '--color-surface-subtle', 'var(--color-surface-subtle)'],
  ['Texto Primário', '--color-text-primary', 'var(--color-text-primary)'],
  ['Texto Secundário', '--color-text-secondary', 'var(--color-text-secondary)'],
  ['Borda Padrão', '--color-border-default', 'var(--color-border-default)'],
  ['Borda Foco', '--color-border-focus', 'var(--color-border-focus)'],
  ['Sucesso', '--color-status-success', 'var(--color-status-success)'],
  ['Alerta', '--color-status-warning', 'var(--color-status-warning)'],
  ['Crítico / Erro', '--color-status-critical', 'var(--color-status-critical)'],
  ['Informativo', '--color-status-info', 'var(--color-status-info)'],
] as const;

const iconCatalog = [
  ['Busca', Search],
  ['Notificação', Bell],
  ['Usuário', UserRound],
  ['Configuração', Settings],
  ['Filtro', Filter],
  ['Visualizar', Eye],
  ['Editar', Edit3],
  ['Excluir', Trash2],
  ['Documento', FileText],
  ['Planilha', FileSpreadsheet],
  ['Download', Download],
  ['Upload', Upload],
  ['Calendário', Calendar],
  ['Localização', MapPin],
  ['Processo', FileCheck],
  ['Segurança', ShieldCheck],
  ['Informação', Info],
  ['Ajuda', CircleHelp],
] as const;

const tableRows = [
  { process: 'SEIA-REG-2026/001245', applicant: 'Verde Vale Energia S.A.', type: 'Licenciamento Ambiental (LP+LI)', status: 'Em análise', unit: 'DILIC', date: '28/09/2026' },
  { process: 'SEIA-REG-2026/001198', applicant: 'Cooperativa Agrícola Rio Vivo', type: 'Outorga Subterrânea', status: 'Pendente', unit: 'DIRRE', date: '25/09/2026' },
  { process: 'SEIA-REG-2026/001132', applicant: 'Bioflora Manejo Sustentável Ltda.', type: 'Autorização de Manejo (AMF)', status: 'Concluído', unit: 'DIBIO', date: '22/09/2026' },
  { process: 'SEIA-REG-2026/001089', applicant: 'Prefeitura Municipal de Lençóis', type: 'Licenciamento Simplificado (LS)', status: 'Vencido', unit: 'DIREC', date: '15/09/2026' },
  { process: 'SEIA-REG-2026/000974', applicant: 'Mineração Serra Dourada S.A.', type: 'Renovação de Licença (RLO)', status: 'Em análise', unit: 'DILIC', date: '10/09/2026' },
];

const fieldClass =
  'w-full h-9 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-sm text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] outline-none transition-colors hover:border-[var(--input-border-hover)] focus:border-[var(--input-border-focus)] focus:ring-2 focus:ring-[var(--color-green-alpha-20)] disabled:cursor-not-allowed disabled:opacity-55';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-canvas)]';

const SectionIntro: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="mb-6 max-w-3xl">
    <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">{title}</h2>
    <p className="mt-1.5 text-sm leading-6 text-[var(--color-text-secondary)]">{description}</p>
  </div>
);

const Specimen: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  badge?: string;
}> = ({ title, description, children, className, badge = 'Componente' }) => (
  <div className={cn('overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] shadow-2xs', className)}>
    <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] px-4 py-3 bg-[var(--color-surface-subtle)]/50">
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">{description}</p>}
      </div>
      <Badge color="gray" size="xs">{badge}</Badge>
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

export const SeiaV2DesignSystemPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [navFilter, setNavFilter] = useState('');
  const [copiedToken, setCopiedToken] = useState('');
  const [selectValue, setSelectValue] = useState('dilic');
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [wizardStep, setWizardStep] = useState(2);
  const [tableSearch, setTableSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);
  const [radioChoice, setRadioChoice] = useState('interno');
  const [checkboxState, setCheckboxState] = useState(true);
  const [interactiveButtonLoading, setInteractiveButtonLoading] = useState(false);
  const [activeTemplateTab, setActiveTemplateTab] = useState<'dashboard' | 'tabela' | 'formulario' | 'detalhes' | 'cidadao'>('dashboard');

  const filteredSections = useMemo(() => {
    const term = navFilter.trim().toLowerCase();
    if (!term) return catalogSections;
    return catalogSections.filter((section) => `${section.group} ${section.label}`.toLowerCase().includes(term));
  }, [navFilter]);

  const visibleRows = tableRows.filter((row) =>
    `${row.process} ${row.applicant} ${row.type} ${row.status} ${row.unit}`.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const copyToken = async (token: string) => {
    await navigator.clipboard.writeText(token);
    setCopiedToken(token);
    window.setTimeout(() => setCopiedToken(''), 1400);
  };

  const jumpTo = (id: string) => {
    const target = document.getElementById(id);
    const container = document.getElementById('design-system-content');
    if (target && container) {
      const top = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 24;
      container.scrollTo({ top, behavior: 'smooth' });
    }
    setIsMobileSidebarOpen(false);
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen((open) => !open);
    } else {
      setIsSidebarCollapsed((collapsed) => !collapsed);
    }
  };

  const handleInteractiveClick = () => {
    setInteractiveButtonLoading(true);
    setTimeout(() => setInteractiveButtonLoading(false), 1200);
  };

  const groupedSections = filteredSections.reduce<Record<string, CatalogSection[]>>((acc, section) => {
    acc[section.group] = [...(acc[section.group] || []), section];
    return acc;
  }, {});

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)]">
      <ShadcnHeader
        isSidebarCollapsed={isSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {isMobileSidebarOpen && (
          <button
            type="button"
            aria-label="Fechar navegação do Design System"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 z-30 bg-slate-950/55 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Sidebar exclusiva do Design System */}
        <aside
          className={cn(
            'fixed bottom-0 left-0 top-16 z-40 flex shrink-0 flex-col overflow-hidden bg-[var(--sidebar-bg)] transition-[width,transform] duration-200 ease-out lg:static lg:z-auto lg:h-full',
            isMobileSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0',
            isSidebarCollapsed ? 'lg:w-16' : 'lg:w-72'
          )}
        >
          <div className={cn('border-b border-[var(--color-border-subtle)] p-3', isSidebarCollapsed && 'lg:px-2')}>
            {isSidebarCollapsed ? (
              <div className="hidden h-9 items-center justify-center rounded-lg bg-[var(--nav-item-selected-bg)] text-xs font-black text-[var(--nav-item-selected-text)] lg:flex">DS</div>
            ) : (
              <>
                <div className="mb-3 px-1">
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">Design System</p>
                  <p className="text-[10px] font-medium text-[var(--color-text-tertiary)]">SEIA Plataforma · v1.0</p>
                </div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                  <input
                    value={navFilter}
                    onChange={(event) => setNavFilter(event.target.value)}
                    placeholder="Filtrar catálogo"
                    className={cn(fieldClass, 'h-8 pl-8 pr-8 text-xs')}
                    aria-label="Filtrar seções do design system"
                  />
                  {navFilter && (
                    <button onClick={() => setNavFilter('')} className={cn('absolute right-2.5 top-1/2 -translate-y-1/2 rounded text-[var(--color-text-tertiary)]', focusRing)} aria-label="Limpar filtro">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <nav aria-label="Seções do design system" className={cn('flex-1 overflow-y-auto p-3 custom-scrollbar', isSidebarCollapsed && 'lg:px-2')}>
            {isSidebarCollapsed ? (
              <div className="hidden space-y-1 lg:block">
                {Object.entries(groupedSections).map(([group, sections]) => {
                  const GroupIcon = catalogGroupIcons[group] || Boxes;
                  return (
                    <button
                      key={group}
                      type="button"
                      title={group}
                      aria-label={group}
                      onClick={() => jumpTo(sections[0].id)}
                      className="flex h-10 w-full items-center justify-center rounded-lg text-[var(--nav-item-text)] transition-colors hover:bg-[var(--nav-item-hover-bg)] hover:text-[var(--nav-item-selected-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green-alpha-32)]"
                    >
                      <GroupIcon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedSections).map(([group, sections]) => (
                  <div key={group}>
                    <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">{group}</p>
                    <div className="space-y-0.5">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => jumpTo(section.id)}
                          className="w-full rounded-lg px-2 py-1.5 text-left text-xs font-medium text-[var(--nav-item-text)] transition-colors hover:bg-[var(--nav-item-hover-bg)] hover:text-[var(--nav-item-selected-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green-alpha-32)]"
                        >
                          {section.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </nav>

          <div className={cn('shrink-0 border-t border-[var(--color-border-subtle)] p-3', isSidebarCollapsed && 'lg:px-2')}>
            <a
              href="/?rota=seia-v2"
              title="Voltar ao SEIA V2"
              className={cn(
                'flex h-9 items-center rounded-lg text-xs font-semibold text-[var(--nav-item-text)] transition-colors hover:bg-[var(--nav-item-hover-bg)] hover:text-[var(--nav-item-selected-text)]',
                isSidebarCollapsed ? 'justify-center px-0' : 'gap-2 px-2'
              )}
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>Voltar ao SEIA V2</span>}
            </a>
          </div>
        </aside>

        {/* Conteúdo rolável da Documentação */}
        <main id="design-system-content" className="min-w-0 flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto w-full max-w-[1800px] p-4 pb-24 sm:p-6 lg:p-8">
            {/* Header da Documentação */}
            <div className="mb-8 flex flex-col gap-4 border-b border-[var(--color-border-default)] pb-6 2xl:flex-row 2xl:items-end 2xl:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 flex items-center gap-2">
                  <Badge color="success" dot>SEIA V2</Badge>
                  <Badge color="gray">Design System · v1.0</Badge>
                  <Badge color="primary">Filament 3 Native</Badge>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                  Design System INEMA
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
                  Catálogo vivo e referência de engenharia de interface do SEIA Plataforma. Todas as amostras utilizam tokens semânticos, componentes reais e padrões consolidados na Dashboard Gerencial de Regulação.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button color="gray" outlined onClick={() => jumpTo('accessibility')}>
                  <CircleHelp className="h-4 w-4" /> Diretrizes de Acessibilidade
                </Button>
                <Button onClick={() => jumpTo('patterns')}>
                  <LayoutDashboard className="h-4 w-4" /> Ver Composições
                </Button>
              </div>
            </div>

            <div className="min-w-0 space-y-16">
              {/* SEÇÃO: VISÃO GERAL */}
              <section id="overview" className="scroll-mt-8">
                <SectionIntro
                  title="Visão geral"
                  description="Uma única linguagem para os fluxos internos e públicos do INEMA: clara, institucional, acessível e consistente nos modos claro e escuro."
                />
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ['Consistência Estrita', 'Tokens semânticos unificados conectam identidade, componentes e estados sem divergências visuais.', Layers],
                    ['Reuso de Primitivas Reais', 'Os espécimes são instâncias dos componentes que rodam diretamente nas telas do SEIA V2.', Boxes],
                    ['Acessibilidade & Dense UI', 'Contraste WCAG AA, foco visível, navegação por teclado e densidade compacta para alta produtividade.', ShieldCheck],
                  ].map(([title, description, Icon]) => {
                    const CardIcon = Icon as React.ElementType;
                    return (
                      <div key={title as string} className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-5 shadow-2xs">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-primary-subtle)] text-[var(--color-text-link)]">
                          <CardIcon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-3.5 text-sm font-semibold text-[var(--color-text-primary)]">{title as string}</h3>
                        <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{description as string}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* SEÇÃO: MARCA E ASSETS */}
              <section id="brand" className="scroll-mt-8">
                <SectionIntro
                  title="Marca e assets"
                  description="Assinaturas oficiais exportadas do SEIA Plataforma. Em topbars verdes (#0F4C3A), use estritamente as versões brancas."
                />
                <div className="grid gap-4 lg:grid-cols-2">
                  <Specimen title="Logo Horizontal (Versão Branca)" description="Uso em topbar verde institucional e páginas de autenticação.">
                    <div className="flex min-h-36 items-center justify-center rounded-xl bg-[var(--topbar-bg)] p-8">
                      <img src={seiaLogoWhite} alt="SEIA Plataforma Horizontal Branco" className="h-12 max-w-full" />
                    </div>
                  </Specimen>
                  <Specimen title="Símbolo Compacto (Versão Branca)" description="Uso em sidebar recolhida (32px), favicon e espaços reduzidos.">
                    <div className="flex min-h-36 items-center justify-center rounded-xl bg-[var(--topbar-bg)] p-8">
                      <img src={seiaIconWhite} alt="Símbolo SEIA Plataforma Branco" className="h-14 w-14" />
                    </div>
                  </Specimen>
                  <Specimen title="Logo Horizontal (Versão Colorida)" description="Uso em documentos impressos, relatórios gerenciais e fundos claros.">
                    <div className="flex min-h-36 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/40 p-8 border border-dashed border-slate-200 dark:border-slate-700">
                      <img src={seiaLogoColor} alt="SEIA Plataforma Horizontal Color" className="h-12 max-w-full" />
                    </div>
                  </Specimen>
                  <Specimen title="Símbolo Compacto (Versão Colorida)" description="Uso em avatares de sistema, cards e ícones de atalho sobre fundo claro.">
                    <div className="flex min-h-36 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/40 p-8 border border-dashed border-slate-200 dark:border-slate-700">
                      <img src={seiaIconColor} alt="Símbolo SEIA Plataforma Color" className="h-14 w-14" />
                    </div>
                  </Specimen>
                </div>
              </section>

              {/* SEÇÃO: CORES E TOKENS */}
              <section id="colors" className="scroll-mt-8">
                <SectionIntro
                  title="Cores e tokens"
                  description="O verde (#0F4C3A) concentra identidade e ação principal; neutros organizam superfícies. No dark mode, a base é carvão neutro e o verde atua como assinatura."
                />
                <Specimen title="Escala Primária INEMA (Verde Institucional)" description="Clique em qualquer tom para copiar o valor hexadecimal.">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
                    {greenTokens.map(([name, value]) => (
                      <button
                        key={name}
                        onClick={() => copyToken(value)}
                        className="group overflow-hidden rounded-lg border border-[var(--color-border-default)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] transition-all hover:scale-102"
                      >
                        <span className="block h-14" style={{ backgroundColor: value }} />
                        <span className="block bg-[var(--color-surface-default)] px-2 py-2">
                          <span className="block text-[11px] font-semibold text-[var(--color-text-primary)]">{name}</span>
                          <span className="block text-[9px] uppercase text-[var(--color-text-tertiary)]">{copiedToken === value ? 'Copiado!' : value}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </Specimen>

                <Specimen title="Tokens Semânticos Universais" description="Utilize sempre pelo papel semântico, garantindo suporte automático a temas claro e escuro." className="mt-4">
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {semanticTokens.map(([label, token, value]) => (
                      <button
                        key={token}
                        onClick={() => copyToken(token)}
                        className={cn('flex items-center gap-3 rounded-lg border border-[var(--color-border-default)] p-3 text-left transition-colors hover:bg-[var(--color-surface-hover)]', focusRing)}
                      >
                        <span className="h-8 w-8 shrink-0 rounded-lg border border-black/10 shadow-2xs" style={{ backgroundColor: value }} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-[var(--color-text-primary)] truncate">{label}</span>
                          <span className="block truncate text-[10px] text-[var(--color-text-tertiary)] font-mono">{copiedToken === token ? 'Token copiado!' : token}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </Specimen>

                <Specimen title="Escalas Funcionais de Suporte" description="Neutros estruturam hierarquia; Âmbar (Alerta), Vermelho (Crítico) e Azul (Informativo)." className="mt-4">
                  <div className="space-y-4">
                    {[
                      ['Neutro', ['#F8FAFC', '#E2E8F0', '#94A3B8', '#475569', '#0F172A', '#020617']],
                      ['Sucesso', ['#F0FDF4', '#DCFCE7', '#86EFAC', '#22C55E', '#15803D', '#14532D']],
                      ['Alerta', ['#FFFBEB', '#FEF3C7', '#FDE68A', '#F59E0B', '#B45309', '#78350F']],
                      ['Crítico', ['#FEF2F2', '#FEE2E2', '#FECACA', '#EF4444', '#B91C1C', '#7F1D1D']],
                      ['Info', ['#F0F9FF', '#E0F2FE', '#BAE6FD', '#0284C7', '#0369A1', '#0C4A6E']],
                    ].map(([label, colors]) => (
                      <div key={label as string} className="grid items-center gap-2 sm:grid-cols-[80px_1fr]">
                        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">{label as string}</span>
                        <div className="grid grid-cols-6 overflow-hidden rounded-lg border border-[var(--color-border-default)] shadow-2xs">
                          {(colors as string[]).map((color) => (
                            <button
                              key={color}
                              onClick={() => copyToken(color)}
                              className="h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-border-focus)] transition-opacity hover:opacity-90"
                              style={{ backgroundColor: color }}
                              aria-label={`Copiar cor ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Specimen>
              </section>

              {/* SEÇÃO: TIPOGRAFIA */}
              <section id="typography" className="scroll-mt-8">
                <SectionIntro
                  title="Tipografia"
                  description="Inter é a família tipográfica funcional do produto. A hierarquia privilegia leitura rápida, densidade controlada e números tabulares (tabular-nums) em processos e métricas."
                />
                <Specimen title="Escala Tipográfica & Hierarquia">
                  <div className="divide-y divide-[var(--color-border-subtle)]">
                    {[
                      ['Display / Hero', '36 / 44 · 800', 'text-4xl font-extrabold tracking-tight'],
                      ['Título de página (H1)', '30 / 36 · 700', 'text-3xl font-bold tracking-tight'],
                      ['Título de seção (H2)', '20 / 28 · 700', 'text-xl font-bold tracking-tight'],
                      ['Título de card (H3)', '15 / 22 · 600', 'text-sm sm:text-base font-semibold'],
                      ['Corpo de texto padrão', '14 / 24 · 400', 'text-sm leading-6'],
                      ['Legenda / Apoio', '12 / 16 · 500', 'text-xs font-medium'],
                      ['Micro-rótulo / Badge', '10 / 14 · 700 uppercase', 'text-[10px] font-bold uppercase tracking-wider'],
                      ['Dado Tabular / Protocolo', '14 / 20 · 600 font-mono', 'text-sm font-semibold font-mono tabular-nums'],
                    ].map(([label, meta, classes]) => (
                      <div key={label} className="grid gap-2 py-4 sm:grid-cols-[220px_1fr] sm:items-baseline">
                        <div>
                          <p className="text-xs font-semibold text-[var(--color-text-primary)]">{label}</p>
                          <p className="text-[10px] font-mono text-[var(--color-text-tertiary)]">{meta}</p>
                        </div>
                        <p className={cn(classes, 'text-[var(--color-text-primary)] truncate')}>
                          SEIA-REG-2026/001245 · Gestão Ambiental Integrada
                        </p>
                      </div>
                    ))}
                  </div>
                </Specimen>
              </section>

              {/* SEÇÃO: ESPAÇAMENTO E FORMA */}
              <section id="spacing" className="scroll-mt-8">
                <SectionIntro
                  title="Espaçamento e forma"
                  description="A grade modular de 4 px / 8 pt padroniza ritmo, densidade (Dense UI) e áreas de toque nos formulários e tabelas."
                />
                <div className="grid gap-4 lg:grid-cols-2">
                  <Specimen title="Escala de Espaçamento Modular (Grade 4px)">
                    <div className="space-y-3">
                      {[4, 8, 12, 16, 20, 24, 32, 40, 48].map((size) => (
                        <div key={size} className="flex items-center gap-3">
                          <span className="w-12 text-right text-[11px] font-mono tabular-nums text-[var(--color-text-tertiary)]">{size}px</span>
                          <span className="h-3.5 rounded-sm bg-[var(--color-brand-primary)]" style={{ width: `${size * 3}px` }} />
                          <span className="text-[10px] text-[var(--color-text-tertiary)] font-mono">p-{size / 4}</span>
                        </div>
                      ))}
                    </div>
                  </Specimen>
                  <Specimen title="Raios de Arredondamento e Elevação">
                    <div className="grid grid-cols-2 gap-3.5">
                      {[
                        ['6 px (rounded-md)', 'rounded-md', 'Badges e sub-itens'],
                        ['8 px (rounded-lg)', 'rounded-lg', 'Botões e inputs'],
                        ['12 px (rounded-xl)', 'rounded-xl', 'Cards e seções'],
                        ['16 px (rounded-2xl)', 'rounded-2xl', 'Modais e containers'],
                        ['Full (Pill)', 'rounded-full', 'Tags e contadores'],
                      ].map(([label, radius, useCase]) => (
                        <div key={label} className={cn('flex flex-col items-center justify-center p-4 border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] shadow-2xs text-center', radius)}>
                          <span className="text-xs font-semibold text-[var(--color-text-primary)]">{label}</span>
                          <span className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{useCase}</span>
                        </div>
                      ))}
                    </div>
                  </Specimen>
                </div>
              </section>

              {/* SEÇÃO: ÍCONES */}
              <section id="icons" className="scroll-mt-8">
                <SectionIntro
                  title="Ícones"
                  description="Biblioteca Lucide com traço de 1.75px. Tamanhos padronizados: 14/16px em botões e inputs, 20px em seções/headers e 24px em destaques."
                />
                <Specimen title="Catálogo de Ícones Funcionais SEIA">
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {iconCatalog.map(([label, Icon]) => (
                      <div key={label} className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-3 text-center transition-colors hover:border-[var(--color-border-focus)]">
                        <Icon className="h-5 w-5 text-[var(--color-text-secondary)]" strokeWidth={1.75} />
                        <span className="text-[11px] font-medium text-[var(--color-text-tertiary)]">{label}</span>
                      </div>
                    ))}
                  </div>
                </Specimen>
              </section>

              {/* SEÇÃO: BOTÕES */}
              <section id="buttons" className="scroll-mt-8">
                <SectionIntro
                  title="Botões (Buttons)"
                  description="Ações do Filament e shadcn integradas. Verde institucional (#0F4C3A) reservado à ação primária da tela; neutros estruturam ações secundárias."
                />
                <div className="space-y-4">
                  <Specimen title="Variantes de Cor & Hierarquia (Solid vs Outlined)">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Button color="primary">Primário (Salvar)</Button>
                        <Button color="gray">Secundário (Cancelar)</Button>
                        <Button color="primary" outlined>Outlined Primário</Button>
                        <Button color="danger" outlined><Trash2 className="h-4 w-4" /> Excluir</Button>
                        <Button color="warning" outlined><AlertTriangle className="h-4 w-4" /> Pendência</Button>
                        <Button color="success"><Check className="h-4 w-4" /> Concluir</Button>
                        <Button color="gray" variant="ghost"><MoreHorizontal className="h-4 w-4" /> Mais opções</Button>
                      </div>
                    </div>
                  </Specimen>

                  <Specimen title="Tamanhos Padronizados (Dense UI)">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Button size="xs">XS (28px)</Button>
                      <Button size="sm">SM (32px)</Button>
                      <Button size="default">Default / MD (36px)</Button>
                      <Button size="lg">LG (40px)</Button>
                      <Button size="xl">XL (44px)</Button>
                      <Button size="icon" aria-label="Visualizar"><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" color="gray" aria-label="Editar"><Edit3 className="h-4 w-4" /></Button>
                    </div>
                  </Specimen>

                  <Specimen title="Estados Interativos & Loading (Teste ao Clicar)">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button onClick={handleInteractiveClick} disabled={interactiveButtonLoading}>
                        {interactiveButtonLoading ? (
                          <>
                            <LoaderCircle className="h-4 w-4 animate-spin" /> Processando...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" /> Clique para Testar Loading
                          </>
                        )}
                      </Button>
                      <Button disabled color="primary">Primário Desabilitado</Button>
                      <Button disabled color="gray">Secundário Desabilitado</Button>
                      <Button disabled color="danger" outlined>Excluir Desabilitado</Button>
                    </div>
                  </Specimen>
                </div>
              </section>

              {/* SEÇÃO: CAMPOS E SELEÇÃO */}
              <section id="fields" className="scroll-mt-8">
                <SectionIntro
                  title="Campos e formulários (Fields & Controls)"
                  description="Rótulos explícitos, placeholders contextuais, feedback de validação em tempo real e seleção pesquisável (FilamentSelect)."
                />
                <Specimen title="Anatomia Completa de Formulário SEIA">
                  <div className="grid gap-5 md:grid-cols-2">
                    {/* Campo Padrão */}
                    <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                      Número do Processo <span className="text-[var(--color-status-critical)]">*</span>
                      <input className={fieldClass} placeholder="SEIA-REG-2026/000000" defaultValue="SEIA-REG-2026/001245" />
                      <span className="block text-[10px] font-normal text-[var(--color-text-tertiary)]">
                        Identificador único gerado automaticamente pelo protocolo.
                      </span>
                    </label>

                    {/* Select Pesquisável */}
                    <div className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                      <span>Diretoria Responsável</span>
                      <FilamentSelect
                        value={selectValue}
                        onChange={setSelectValue}
                        searchable
                        options={[
                          { value: 'dilic', label: 'DILIC — Diretoria de Licenciamento Ambiental', description: 'Processos de LP, LI, LO e RLO' },
                          { value: 'dirre', label: 'DIRRE — Diretoria de Recursos Hídricos', description: 'Outorgas, CERH e Barragens' },
                          { value: 'dibio', label: 'DIBIO — Diretoria de Biodiversidade', description: 'Autorizações de Fauna e Flora' },
                          { value: 'difis', label: 'DIFIS — Diretoria de Fiscalização', description: 'Autos de infração e denúncias' },
                        ]}
                      />
                    </div>

                    {/* Campo com Ícone de Prefixo */}
                    <div className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                      <span>Município do Empreendimento</span>
                      <InputWrapper prefixIcon={MapPin}>
                        <input className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none" placeholder="Ex: Barreiras" defaultValue="Barreiras" />
                      </InputWrapper>
                    </div>

                    {/* Campo Desabilitado / ReadOnly */}
                    <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-disabled)]">
                      Unidade de Lotação (Bloqueado)
                      <input className={fieldClass} value="DISUC / Coordenação de Unidades" disabled readOnly />
                    </label>

                    {/* Campo com Erro de Validação */}
                    <div className="space-y-1.5 text-xs font-semibold text-[var(--badge-critical-text)]">
                      <span>CPF / CNPJ do Requerente *</span>
                      <InputWrapper valid={false} prefixIcon={AlertCircle}>
                        <input className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm outline-none text-rose-700 dark:text-rose-300" defaultValue="00.000.000/0000" />
                      </InputWrapper>
                      <span className="flex items-center gap-1 text-[10px] font-normal text-[var(--color-status-critical)]">
                        <AlertCircle className="h-3 w-3 shrink-0" /> CNPJ incompleto. Verifique os dígitos verificadores.
                      </span>
                    </div>

                    {/* Textarea */}
                    <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                      Justificativa Técnica
                      <textarea className={cn(fieldClass, 'h-24 resize-y py-2')} placeholder="Descreva os elementos técnicos da solicitação..." defaultValue="Empreendimento enquadrado na Classe 3 conforme porte e potencial poluidor." />
                    </label>
                  </div>

                  {/* Checkbox, Radios e Switch */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--color-border-subtle)] pt-5 text-xs text-[var(--color-text-secondary)]">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checkboxState}
                        onChange={(e) => setCheckboxState(e.target.checked)}
                        className={cn('h-4 w-4 rounded accent-[var(--color-brand-primary)]', focusRing)}
                      />
                      <span>Notificar interessado via SEI-BA</span>
                    </label>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Ambiente:</span>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="radioScope"
                          value="interno"
                          checked={radioChoice === 'interno'}
                          onChange={() => setRadioChoice('interno')}
                          className={cn('h-4 w-4 accent-[var(--color-brand-primary)]', focusRing)}
                        />
                        <span>Interno (GLA)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="radioScope"
                          value="publico"
                          checked={radioChoice === 'publico'}
                          onChange={() => setRadioChoice('publico')}
                          className={cn('h-4 w-4 accent-[var(--color-brand-primary)]', focusRing)}
                        />
                        <span>Público (Cidadão)</span>
                      </label>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={switchOn}
                      onClick={() => setSwitchOn((v) => !v)}
                      className={cn('flex items-center gap-2.5 rounded-md cursor-pointer select-none', focusRing)}
                    >
                      <span className={cn('relative h-5 w-9 rounded-full transition-colors', switchOn ? 'bg-[var(--color-brand-primary)]' : 'bg-slate-300 dark:bg-slate-700')}>
                        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-xs transition-transform', switchOn ? 'translate-x-[18px]' : 'translate-x-0.5')} />
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">Publicação no Diário Oficial</span>
                    </button>
                  </div>
                </Specimen>
              </section>

              {/* SEÇÃO: BADGES E ESTADOS */}
              <section id="badges" className="scroll-mt-8">
                <SectionIntro
                  title="Badges e estados"
                  description="Pills semânticos comunicam status de processo, categoria ou contagem. Cada cor possui significado normativo estrito."
                />
                <div className="space-y-4">
                  <Specimen title="Matriz de Status de Processo (com Dot Indicador)">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Badge color="success" dot>Concluído / Emitido</Badge>
                      <Badge color="warning" dot>Pendente / Complementação</Badge>
                      <Badge color="danger" dot>Vencido / Indeferido</Badge>
                      <Badge color="info" dot>Em Análise Técnica</Badge>
                      <Badge color="primary">Licenciamento LP+LI</Badge>
                      <Badge color="gray">Rascunho</Badge>
                    </div>
                  </Specimen>

                  <Specimen title="Tamanhos e Variantes">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge size="xs" color="primary">XS (10px)</Badge>
                      <Badge size="sm" color="primary">SM (12px - Padrão)</Badge>
                      <Badge size="md" color="primary">MD (14px)</Badge>
                      <Badge color="success">Sem Dot</Badge>
                      <Badge color="danger" dot>Com Dot</Badge>
                    </div>
                  </Specimen>
                </div>
              </section>

              {/* SEÇÃO: CARDS E MÉTRICAS */}
              <section id="cards" className="scroll-mt-8">
                <SectionIntro
                  title="Cards e métricas"
                  description="KpiCards com micro-sparklines e seções recolhíveis (FilamentSection) para organização densa de informação."
                />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <KpiCard title="Protocolados" value="1.245" trend={{ value: '+12%', isPositive: true }} icon={FileText} variant="emerald" />
                  <KpiCard title="Em Análise" value="2.356" trend={{ value: '-3%', isPositive: false }} icon={Clock3} variant="slate" />
                  <KpiCard title="Pendentes" value="873" trend={{ value: '+8%', isPositive: false }} icon={AlertCircle} variant="amber" />
                  <KpiCard title="Vencidos" value="198" trend={{ value: '+15%', isPositive: false }} icon={ShieldAlert} variant="rose" />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <Section heading="Seção Recolhível (Filament Section)" description="Contém blocos de formulário que podem ser colapsados sem perder estado." collapsible icon={SlidersHorizontal} iconColor="primary">
                    <p className="text-xs leading-5 text-[var(--color-text-secondary)]">
                      O cabeçalho preserva o resumo do bloco quando recolhido. Padrão utilizado nas seções de enquadramento e condicionantes do SEIA V2.
                    </p>
                  </Section>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold">Card Padrão shadcn/ui</CardTitle>
                      <CardDescription className="text-xs">Estrutura com cabeçalho, corpo e rodapé integrado.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-600 dark:text-slate-400">
                      Utilizado em painéis de resumo lateral (Drawers) e blocos modulares de detalhamento.
                    </CardContent>
                    <CardFooter className="justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Button color="gray" size="sm">Cancelar</Button>
                      <Button size="sm">Salvar Registro</Button>
                    </CardFooter>
                  </Card>
                </div>
              </section>

              {/* SEÇÃO: NAVEGAÇÃO */}
              <section id="navigation" className="scroll-mt-8">
                <SectionIntro
                  title="Navegação"
                  description="Topbar institucional em 100% da largura, sidebar recolhível com acordeão exclusivo, breadcrumbs e abas (FilamentTabs)."
                />
                <div className="space-y-4">
                  <Specimen title="Topbar SEIA V2 (Header Institucional)">
                    <div className="flex min-h-16 items-center gap-4 rounded-xl bg-[var(--topbar-bg)] px-4 text-white shadow-md">
                      <img src={seiaLogoWhite} alt="SEIA Plataforma" className="h-8 w-auto" />
                      <button className={cn('rounded-lg p-2 hover:bg-white/10 focus-visible:ring-white cursor-pointer', focusRing)} aria-label="Toggle Sidebar">
                        <PanelLeftClose className="h-4 w-4" />
                      </button>
                      <div className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white/80 md:flex">
                        <Search className="h-4 w-4 shrink-0" />
                        <span>Buscar processos, requerimentos SEIA ou atos...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className={cn('rounded-lg p-2 hover:bg-white/10 focus-visible:ring-white relative', focusRing)} aria-label="Notificações">
                          <Bell className="h-4 w-4" />
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/15 text-xs font-bold">LM</span>
                      </div>
                    </div>
                  </Specimen>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Specimen title="Breadcrumb Funcional">
                      <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]" aria-label="Breadcrumb de Exemplo">
                        <a href="/?rota=seia-v2&tela=inicio" className={cn('rounded hover:text-[var(--color-text-link)] hover:underline', focusRing)}>Início</a>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        <a href="/?rota=seia-v2&tela=relatorios" className={cn('rounded hover:text-[var(--color-text-link)] hover:underline', focusRing)}>Regulação</a>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold text-[var(--color-text-primary)]">Dashboard Gerencial</span>
                      </nav>
                    </Specimen>

                    <Specimen title="Abas de Contexto (FilamentTabs)">
                      <FilamentTabs
                        tabs={[
                          { id: 'visao-geral', label: 'Visão Geral' },
                          { id: 'processos', label: 'Processos', badge: 24 },
                          { id: 'documentos', label: 'Documentos' },
                        ]}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                      />
                    </Specimen>
                  </div>
                </div>
              </section>

              {/* SEÇÃO: TABELAS */}
              <section id="table" className="scroll-mt-8">
                <SectionIntro
                  title="Tabelas (Data Grid)"
                  description="Composição canônica do SEIA: busca debounced, filtros rápidos, ações em lote (bulk actions), seleção de linhas, ordenação e paginação."
                />
                <TableContainer
                  toolbar={
                    <div className="flex flex-col gap-3 border-b border-[var(--color-border-subtle)] p-4 md:flex-row md:items-center md:justify-between bg-[var(--color-surface-default)]">
                      <div className="flex flex-wrap items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button color="gray" size="sm" className="flex items-center gap-1.5">
                              <MoreHorizontal className="h-4 w-4" /> Ações em Lote
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Ações Disponíveis</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => alert('Encaminhar lote')}>Encaminhar Processos</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert('Exportar selecionados')}>Exportar em Planilha</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-rose-600">Arquivar Registros</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <Button color="gray" size="sm" className="flex items-center gap-1.5">
                          <Filter className="h-4 w-4" /> Filtros <Badge color="primary" size="xs">2</Badge>
                        </Button>
                      </div>

                      <div className="relative w-full md:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                        <label htmlFor="design-system-table-search-input" className="sr-only">Buscar processos na tabela</label>
                        <input
                          id="design-system-table-search-input"
                          value={tableSearch}
                          onChange={(event) => setTableSearch(event.target.value)}
                          placeholder="Buscar por processo, interessado ou tipo..."
                          className={cn(fieldClass, 'pl-9 text-xs')}
                        />
                      </div>
                    </div>
                  }
                  pagination={
                    <div className="flex w-full flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-[var(--color-text-tertiary)]">
                        Exibindo <strong>{visibleRows.length}</strong> de 98 processos cadastrados
                      </span>
                      <div className="flex items-center gap-1">
                        <Button color="gray" size="xs"><ChevronLeft className="h-3.5 w-3.5" /> Anterior</Button>
                        <Button size="xs">1</Button>
                        <Button color="gray" size="xs">2</Button>
                        <Button color="gray" size="xs">Próxima <ChevronRight className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  }
                >
                  {selectedRows.length > 0 && (
                    <div className="flex items-center justify-between gap-3 bg-[var(--color-brand-primary-subtle)] px-4 py-2 text-xs text-[var(--color-text-link)] border-b border-[var(--color-border-subtle)]">
                      <span className="font-semibold">{selectedRows.length} registro(s) selecionado(s)</span>
                      <button onClick={() => setSelectedRows([])} className={cn('rounded font-semibold hover:underline cursor-pointer', focusRing)}>
                        Limpar seleção
                      </button>
                    </div>
                  )}

                  <table className="w-full min-w-[860px] text-left text-xs">
                    <thead className="border-b border-[var(--table-border)] bg-[var(--table-header-bg)] text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      <tr>
                        <th className="p-4 w-10">
                          <input
                            type="checkbox"
                            aria-label="Selecionar todos os processos"
                            className={cn('h-4 w-4 rounded accent-[var(--color-brand-primary)]', focusRing)}
                            onChange={(event) =>
                              setSelectedRows(event.target.checked ? tableRows.map((r) => r.process) : [])
                            }
                            checked={selectedRows.length === tableRows.length}
                          />
                        </th>
                        <th className="p-4">Processo</th>
                        <th className="p-4">Interessado</th>
                        <th className="p-4">Tipo de Ato</th>
                        <th className="p-4">Unidade</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--table-border)]">
                      {visibleRows.map((row) => (
                        <tr key={row.process} className="transition-colors hover:bg-[var(--table-row-hover)]">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              aria-label={`Selecionar processo ${row.process}`}
                              className={cn('h-4 w-4 rounded accent-[var(--color-brand-primary)]', focusRing)}
                              checked={selectedRows.includes(row.process)}
                              onChange={() =>
                                setSelectedRows((current) =>
                                  current.includes(row.process)
                                    ? current.filter((item) => item !== row.process)
                                    : [...current, row.process]
                                )
                              }
                            />
                          </td>
                          <td className="p-4 font-mono font-semibold text-[var(--color-text-primary)]">{row.process}</td>
                          <td className="p-4 text-[var(--color-text-secondary)]">{row.applicant}</td>
                          <td className="p-4 text-[var(--color-text-secondary)]">{row.type}</td>
                          <td className="p-4 font-semibold text-[var(--color-text-secondary)]">{row.unit}</td>
                          <td className="p-4">
                            <Badge
                              color={
                                row.status === 'Concluído'
                                  ? 'success'
                                  : row.status === 'Pendente'
                                  ? 'warning'
                                  : row.status === 'Vencido'
                                  ? 'danger'
                                  : 'info'
                              }
                              dot
                            >
                              {row.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button color="gray" size="icon" aria-label="Visualizar"><Eye className="h-4 w-4" /></Button>
                              <Button color="gray" size="icon" aria-label="Editar"><Edit3 className="h-4 w-4" /></Button>
                              <Button color="danger" outlined size="icon" aria-label="Excluir"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {visibleRows.length === 0 && (
                    <div className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
                      <Search className="h-8 w-8 text-[var(--color-text-disabled)]" />
                      <h3 className="mt-3 text-sm font-semibold text-[var(--color-text-primary)]">Nenhum processo encontrado</h3>
                      <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">Revise o termo de busca ou limpe os filtros aplicados.</p>
                      <Button color="gray" size="sm" className="mt-4" onClick={() => setTableSearch('')}>Limpar busca</Button>
                    </div>
                  )}
                </TableContainer>
              </section>

              {/* SEÇÃO: WIZARD */}
              <section id="wizard" className="scroll-mt-8">
                <SectionIntro
                  title="Wizard (Stepper em Chevron)"
                  description="Componente FilamentWizard oficial com divisórias em chevron SVG institucional. Etapas concluídas, ativa e futuras diferenciadas com clareza."
                />
                <Specimen title="Requerimento Ambiental Unificado (F-DUC)">
                  <div className="overflow-hidden rounded-xl border border-[var(--color-border-default)]">
                    <FilamentWizard
                      steps={[
                        { id: 1, label: '1. Identificação do Requerente' },
                        { id: 2, label: '2. Enquadramento e Atos' },
                        { id: 3, label: '3. Questionário Técnico' },
                        { id: 4, label: '4. Documentos & Plantas' },
                      ]}
                      currentStep={wizardStep}
                      onStepClick={setWizardStep}
                    />
                    <div className="grid gap-4 p-5 sm:grid-cols-2 bg-[var(--color-surface-default)]">
                      <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                        Razão Social do Empreendimento
                        <input className={fieldClass} placeholder="Nome do empreendimento" defaultValue="Complexo Solar Sertão da Bahia" />
                      </label>
                      <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                        CNPJ / Inscrição Estadual
                        <input className={fieldClass} placeholder="00.000.000/0000-00" defaultValue="12.345.678/0001-90" />
                      </label>
                    </div>
                    <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] p-4 bg-[var(--color-surface-subtle)]/50">
                      <Button color="gray" disabled={wizardStep === 1} onClick={() => setWizardStep((s) => Math.max(1, s - 1))}>
                        <ChevronLeft className="h-4 w-4" /> Etapa Anterior
                      </Button>
                      <span className="text-xs text-slate-500">Etapa {wizardStep} de 4</span>
                      <Button disabled={wizardStep === 4} onClick={() => setWizardStep((s) => Math.min(4, s + 1))}>
                        Próxima Etapa <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Specimen>
              </section>

              {/* SEÇÃO: FEEDBACK E OVERLAYS */}
              <section id="feedback" className="scroll-mt-8">
                <SectionIntro
                  title="Feedback e overlays"
                  description="Banners de alerta, modais de confirmação, dropdown menus e painel de notificações."
                />
                <div className="grid gap-4 lg:grid-cols-2">
                  <Specimen title="Banners de Alerta e Mensagens">
                    <div className="space-y-3">
                      {[
                        [CheckCircle2, 'Solicitação registrada com sucesso no sistema.', 'var(--badge-success-bg)', 'var(--badge-success-text)', 'var(--badge-success-border)'],
                        [AlertTriangle, 'Existem condicionantes técnicas com vencimento em menos de 15 dias.', 'var(--badge-warning-bg)', 'var(--badge-warning-text)', 'var(--badge-warning-border)'],
                        [AlertCircle, 'Acesso restrito: usuário sem permissão para homologação final.', 'var(--badge-critical-bg)', 'var(--badge-critical-text)', 'var(--badge-critical-border)'],
                        [Info, 'O processo foi distribuído automaticamente para a DILIC.', 'var(--badge-info-bg)', 'var(--badge-info-text)', 'var(--badge-info-border)'],
                      ].map(([Icon, text, background, color, border]) => {
                        const AlertIcon = Icon as React.ElementType;
                        return (
                          <div
                            key={text as string}
                            className="flex items-start gap-2.5 rounded-xl border p-3.5 text-xs"
                            style={{ backgroundColor: background as string, color: color as string, borderColor: border as string }}
                          >
                            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
                            <span className="leading-relaxed">{text as string}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Specimen>

                  <Specimen title="Overlays & Diálogos Interativos">
                    <div className="flex flex-wrap gap-2.5">
                      <Button onClick={() => setIsModalOpen(true)}>
                        <ExternalLink className="h-4 w-4" /> Abrir Modal de Encaminhamento
                      </Button>
                      <Button
                        color="gray"
                        aria-expanded={isNotificationOpen}
                        aria-controls="design-system-notifications-panel"
                        onClick={() => setIsNotificationOpen((o) => !o)}
                      >
                        <Bell className="h-4 w-4" /> Notificações <Badge color="danger" size="xs">3</Badge>
                      </Button>
                    </div>

                    {isNotificationOpen && (
                      <div id="design-system-notifications-panel" className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] shadow-xl animate-in fade-in-0 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3 bg-[var(--color-surface-subtle)]">
                          <div>
                            <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Central de Notificações</h4>
                          </div>
                          <button onClick={() => setIsNotificationOpen(false)} className={cn('rounded p-1 hover:bg-slate-200 dark:hover:bg-slate-700', focusRing)} aria-label="Fechar">
                            <X className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                          </button>
                        </div>
                        <div className="divide-y divide-[var(--color-border-subtle)]">
                          {[
                            ['Processo Distribuído', 'O processo SEIA-REG-2026/001245 foi atribuído à sua pauta.', 'Há 5 min'],
                            ['Prazo de Condicionante', 'Empreendimento Rio Vivo possui prazo com vencimento próximo.', 'Há 30 min'],
                            ['Parecer Técnico Aprovado', 'Minuta conclusiva homologada pela diretoria DILIC.', 'Há 2 h'],
                          ].map(([title, desc, time]) => (
                            <div key={title} className="p-3.5 hover:bg-[var(--color-surface-hover)] transition-colors flex gap-3 items-start cursor-pointer">
                              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-primary-subtle)] text-[var(--color-text-link)]">
                                <Bell className="h-3.5 w-3.5" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-[var(--color-text-primary)]">{title}</p>
                                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">{desc}</p>
                              </div>
                              <span className="text-[10px] text-[var(--color-text-tertiary)] whitespace-nowrap">{time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Specimen>
                </div>
              </section>

              {/* SEÇÃO: PADRÕES DE PÁGINA */}
              <section id="patterns" className="scroll-mt-8">
                <SectionIntro
                  title="Padrões de página (Composições)"
                  description="Layouts prontos para dashboards gerenciais, pautas operacionais e formulários complexos, garantindo consistência estrutural."
                />
                <div className="space-y-4">
                  <Specimen title="Padrão 1: Cabeçalho com Breadcrumb e Ações Primárias">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--color-border-subtle)] pb-4">
                      <div>
                        <nav className="mb-2 flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                          <span>Início</span>
                          <ChevronRight className="h-3 w-3" />
                          <span>Regulação</span>
                          <ChevronRight className="h-3 w-3" />
                          <span className="font-semibold text-[var(--color-text-primary)]">Pauta Operacional</span>
                        </nav>
                        <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">Pauta de Processos</h3>
                        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Acompanhe distribuição, prazos regulatórios e responsáveis pela análise.</p>
                      </div>
                      <div className="flex gap-2">
                        <Button color="gray"><Download className="h-4 w-4" /> Exportar Relatório</Button>
                        <Button><Plus className="h-4 w-4" /> Novo Requerimento</Button>
                      </div>
                    </div>
                  </Specimen>

                  <Specimen title="Padrão 2: Dashboard Gerencial Integrada">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        ['Entradas no Mês', '1.245', TrendingUp, 'text-[var(--color-status-success)]', '+12%'],
                        ['Em Análise Técnica', '2.356', Clock3, 'text-[var(--color-status-info)]', '-3%'],
                        ['Vencidos / Críticos', '198', TrendingDown, 'text-[var(--color-status-critical)]', '+15%'],
                      ].map(([label, value, Icon, color, diff]) => {
                        const MetricIcon = Icon as React.ElementType;
                        return (
                          <div key={label as string} className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">{label as string}</span>
                              <MetricIcon className={cn('h-4 w-4', color as string)} />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                              <strong className="text-2xl font-mono font-bold tabular-nums text-[var(--color-text-primary)]">{value as string}</strong>
                              <span className={cn('text-xs font-semibold', color as string)}>{diff as string}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Specimen>
                </div>
              </section>

              {/* SEÇÃO: TEMPLATES DE TELAS */}
              <section id="templates" className="scroll-mt-8">
                <SectionIntro
                  title="Templates de telas (Arquétipos Oficiais)"
                  description="Modelos canônicos de telas completas do SEIA V2. Toda nova funcionalidade deve obrigatoriamente se basear em um destes 5 arquétipos estruturais."
                />

                {/* Seletor de Arquétipos */}
                <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border-subtle)] pb-4 mb-6">
                  {[
                    { id: 'dashboard', label: '1. Dashboard Gerencial', icon: LayoutDashboard },
                    { id: 'tabela', label: '2. Pauta / Data Grid', icon: FileSpreadsheet },
                    { id: 'formulario', label: '3. Formulário / Wizard', icon: FileText },
                    { id: 'detalhes', label: '4. Ficha / Detalhes de Processo', icon: Eye },
                    { id: 'cidadao', label: '5. Portal Cidadão (Público)', icon: Globe },
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTemplateTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTemplateTab(tab.id as any)}
                        className={cn(
                          'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border',
                          isActive
                            ? 'bg-[#0F4C3A] text-white border-[#0F4C3A] shadow-xs'
                            : 'bg-[var(--color-surface-default)] text-[var(--color-text-secondary)] border-[var(--color-border-default)] hover:bg-[var(--color-surface-hover)]'
                        )}
                      >
                        <TabIcon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TEMPLATE 1: DASHBOARD GERENCIAL */}
                {activeTemplateTab === 'dashboard' && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4 text-xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge color="success">Arquétipo Gerencial</Badge>
                        <span className="font-semibold text-[var(--color-text-primary)]">Quando usar:</span>
                        <span className="text-[var(--color-text-secondary)]">Telas de entrada das diretorias (DILIC, DIRRE, DIBIO, DIFIS) e relatórios executivos.</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-tertiary)]">
                        <strong>Regras de Ouro:</strong> Header com seletor temporal e botões de exportação; Grid de 4 a 6 KpiCards com micro-sparklines; Gráficos analíticos abaixo; Zero ícones colados em títulos.
                      </p>
                    </div>

                    <Specimen title="Preview do Template: Dashboard Gerencial" badge="Template 1">
                      <div className="space-y-6 bg-[var(--color-surface-canvas)] p-4 sm:p-6 rounded-xl border border-[var(--color-border-subtle)]">
                        {/* Header do Template */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border-subtle)] pb-4">
                          <div>
                            <nav className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] mb-1">
                              <span>Início</span>
                              <ChevronRight className="h-3 w-3" />
                              <span className="font-semibold text-[var(--color-text-primary)]">Regulação Gerencial</span>
                            </nav>
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Painel Executivo de Processos</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-0.5 text-xs">
                              <button className="px-2.5 py-1 rounded-md bg-[#0F4C3A] text-white font-semibold">30d</button>
                              <button className="px-2.5 py-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">7d</button>
                              <button className="px-2.5 py-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Ano</button>
                            </div>
                            <Button color="gray" size="sm"><Download className="h-3.5 w-3.5" /> Exportar</Button>
                            <Button size="sm"><Plus className="h-3.5 w-3.5" /> Novo Requerimento</Button>
                          </div>
                        </div>

                        {/* Grid de Métricas */}
                        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                          <KpiCard title="Protocolados" value="1.245" trend={{ value: '+12%', isPositive: true }} icon={FileText} variant="emerald" />
                          <KpiCard title="Em Análise" value="2.356" trend={{ value: '-3%', isPositive: false }} icon={Clock3} variant="slate" />
                          <KpiCard title="Pendentes" value="873" trend={{ value: '+8%', isPositive: false }} icon={AlertCircle} variant="amber" />
                          <KpiCard title="Vencidos" value="198" trend={{ value: '+15%', isPositive: false }} icon={ShieldAlert} variant="rose" />
                        </div>

                        {/* Área de Gráficos e Distribuição */}
                        <div className="grid gap-4 lg:grid-cols-3">
                          <div className="lg:col-span-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3 mb-4">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">Entrada vs. Saída de Processos</h4>
                              <Badge color="primary" size="xs">2026</Badge>
                            </div>
                            <div className="h-44 flex items-center justify-center border border-dashed border-[var(--color-border-subtle)] rounded-lg text-xs text-[var(--color-text-tertiary)]">
                              Gráfico de Volume Mensal Integrado
                            </div>
                          </div>

                          <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 shadow-2xs">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] pb-3 mb-4">
                              Distribuição por Diretoria
                            </h4>
                            <div className="space-y-3 text-xs">
                              {[
                                ['DILIC (Licenciamento)', '1.254', '60%'],
                                ['DIRRE (Recursos Hídricos)', '856', '25%'],
                                ['DIBIO (Biodiversidade)', '642', '15%'],
                              ].map(([dir, val, pct]) => (
                                <div key={dir}>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-[var(--color-text-secondary)]">{dir}</span>
                                    <span className="font-semibold text-[var(--color-text-primary)]">{val}</span>
                                  </div>
                                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#0F4C3A] h-full" style={{ width: pct }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Specimen>
                  </div>
                )}

                {/* TEMPLATE 2: PAUTA / DATA GRID */}
                {activeTemplateTab === 'tabela' && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4 text-xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge color="primary">Arquétipo Operacional</Badge>
                        <span className="font-semibold text-[var(--color-text-primary)]">Quando usar:</span>
                        <span className="text-[var(--color-text-secondary)]">Listagens de processos, autos de infração, agendamentos e consultas técnicas.</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-tertiary)]">
                        <strong>Regras de Ouro:</strong> A rota abre sempre na pauta (nunca em form vazio); Toolbar com busca instantânea e filtros; Status semânticos com dot; Paginação no rodapé.
                      </p>
                    </div>

                    <Specimen title="Preview do Template: Pauta Operacional" badge="Template 2">
                      <div className="space-y-4 bg-[var(--color-surface-canvas)] p-4 sm:p-6 rounded-xl border border-[var(--color-border-subtle)]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border-subtle)] pb-4">
                          <div>
                            <nav className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] mb-1">
                              <span>Início</span>
                              <ChevronRight className="h-3 w-3" />
                              <span className="font-semibold text-[var(--color-text-primary)]">Minhas Pendências</span>
                            </nav>
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Processos em Análise Técnica</h3>
                          </div>
                          <Button size="sm"><Plus className="h-3.5 w-3.5" /> Novo Processo</Button>
                        </div>

                        <FilamentTabs
                          tabs={[
                            { id: 'minhas', label: 'Minhas Pendências', badge: 12 },
                            { id: 'unidade', label: 'Pauta da Unidade', badge: 98 },
                            { id: 'concluidos', label: 'Concluídos' },
                          ]}
                          activeTab="minhas"
                          onChange={() => {}}
                        />

                        <TableContainer
                          toolbar={
                            <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border-subtle)]">
                              <div className="flex items-center gap-2">
                                <Button color="gray" size="sm"><MoreHorizontal className="h-4 w-4" /> Ações em Lote</Button>
                                <Button color="gray" size="sm"><Filter className="h-4 w-4" /> Filtros <Badge color="primary" size="xs">1</Badge></Button>
                              </div>
                              <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input placeholder="Buscar por protocolo ou interessado..." className={cn(fieldClass, 'h-8 pl-8 text-xs')} />
                              </div>
                            </div>
                          }
                          pagination={
                            <div className="flex justify-between items-center text-xs text-[var(--color-text-tertiary)]">
                              <span>Exibindo 3 de 12 registros</span>
                              <div className="flex gap-1">
                                <Button color="gray" size="xs">Anterior</Button>
                                <Button size="xs">1</Button>
                                <Button color="gray" size="xs">Próxima</Button>
                              </div>
                            </div>
                          }
                        >
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[var(--table-header-bg)] border-b border-[var(--table-border)] text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                              <tr>
                                <th className="p-3 w-8"><input type="checkbox" className="rounded accent-[#0F4C3A]" /></th>
                                <th className="p-3">Processo SEI</th>
                                <th className="p-3">Interessado</th>
                                <th className="p-3">Ato</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--table-border)]">
                              {tableRows.slice(0, 3).map((r) => (
                                <tr key={r.process} className="hover:bg-[var(--table-row-hover)]">
                                  <td className="p-3"><input type="checkbox" className="rounded accent-[#0F4C3A]" /></td>
                                  <td className="p-3 font-mono font-semibold text-[var(--color-text-primary)]">{r.process}</td>
                                  <td className="p-3 text-[var(--color-text-secondary)]">{r.applicant}</td>
                                  <td className="p-3 text-[var(--color-text-secondary)]">{r.type}</td>
                                  <td className="p-3"><Badge color={r.status === 'Concluído' ? 'success' : r.status === 'Pendente' ? 'warning' : 'info'} dot>{r.status}</Badge></td>
                                  <td className="p-3 text-right">
                                    <div className="flex justify-end gap-1">
                                      <Button color="gray" size="icon"><Eye className="h-3.5 w-3.5" /></Button>
                                      <Button color="gray" size="icon"><Edit3 className="h-3.5 w-3.5" /></Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </TableContainer>
                      </div>
                    </Specimen>
                  </div>
                )}

                {/* TEMPLATE 3: FORMULÁRIO / WIZARD */}
                {activeTemplateTab === 'formulario' && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4 text-xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge color="warning">Arquétipo de Requerimento</Badge>
                        <span className="font-semibold text-[var(--color-text-primary)]">Quando usar:</span>
                        <span className="text-[var(--color-text-secondary)]">Formulários oficiais de licenciamento, outorga, cadastro de UCs e plantonistas.</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-tertiary)]">
                        <strong>Regras de Ouro:</strong> Header de documento com botão de voltar limpo; Stepper em chevron SVG (`FilamentWizard`); Seções modulares (`Section`); Ações fixas no rodapé.
                      </p>
                    </div>

                    <Specimen title="Preview do Template: Requerimento com Stepper" badge="Template 3">
                      <div className="space-y-4 bg-[var(--color-surface-canvas)] p-4 sm:p-6 rounded-xl border border-[var(--color-border-subtle)]">
                        {/* Header de Documento */}
                        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
                          <div className="flex items-center gap-3">
                            <Button color="gray" size="sm" variant="ghost">
                              <ChevronLeft className="h-4 w-4" /> Voltar aos Registros
                            </Button>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#0F4C3A]">F-DUC-069-00</span>
                                <Badge color="gray" size="xs">Rascunho</Badge>
                              </div>
                              <h3 className="text-base font-bold text-[var(--color-text-primary)]">Requerimento de Autorização de Pesquisa</h3>
                            </div>
                          </div>
                          <Button color="gray" size="sm"><Download className="h-3.5 w-3.5" /> Salvar Rascunho</Button>
                        </div>

                        {/* Stepper Oficial */}
                        <div className="overflow-hidden rounded-xl border border-[var(--color-border-default)]">
                          <FilamentWizard
                            steps={[
                              { id: 1, label: '1. Identificação' },
                              { id: 2, label: '2. Dados do Projeto' },
                              { id: 3, label: '3. Anexos & ART' },
                            ]}
                            currentStep={2}
                          />
                          <div className="p-5 space-y-4 bg-[var(--color-surface-default)]">
                            <Section heading="Identificação da Unidade de Conservação" description="Selecione a UC de incidência da pesquisa." icon={Building2} iconColor="primary">
                              <div className="grid gap-4 sm:grid-cols-2 mt-2">
                                <label className="text-xs font-semibold">
                                  Unidade de Conservação (UC) *
                                  <FilamentSelect value="parna" onChange={() => {}} options={['PARNA Chapada Diamantina', 'APA Baía de Todos os Santos', 'PESF Serra do Conduru']} />
                                </label>
                                <label className="text-xs font-semibold">
                                  Coordenador da Pesquisa *
                                  <input className={fieldClass} defaultValue="Dr. Marcos Vinicius Silva" />
                                </label>
                              </div>
                            </Section>
                          </div>
                          <div className="flex justify-between items-center p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]">
                            <Button color="gray"><ChevronLeft className="h-4 w-4" /> Voltar</Button>
                            <Button>Avançar para Documentos <ChevronRight className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                    </Specimen>
                  </div>
                )}

                {/* TEMPLATE 4: DETALHES DE PROCESSO */}
                {activeTemplateTab === 'detalhes' && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4 text-xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge color="info">Arquétipo de Análise / Ficha</Badge>
                        <span className="font-semibold text-[var(--color-text-primary)]">Quando usar:</span>
                        <span className="text-[var(--color-text-secondary)]">Visualização detalhada de processos, consulta cadastral e emissão de pareceres.</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-tertiary)]">
                        <strong>Regras de Ouro:</strong> Card de identificação no topo; Abas contextuais de tramitação; Painel lateral de timeline; CTAs de parecer e notificação.
                      </p>
                    </div>

                    <Specimen title="Preview do Template: Ficha de Processo com Abas" badge="Template 4">
                      <div className="space-y-4 bg-[var(--color-surface-canvas)] p-4 sm:p-6 rounded-xl border border-[var(--color-border-subtle)]">
                        {/* Header do Processo */}
                        <div className="bg-[var(--color-surface-default)] p-5 rounded-xl border border-[var(--color-border-default)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-base font-bold text-[var(--color-text-primary)]">SEIA-REG-2026/001245</span>
                              <Badge color="info" dot>Em Análise Técnica</Badge>
                              <Badge color="primary">Classe 3</Badge>
                            </div>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                              <strong>Interessado:</strong> Verde Vale Energia S.A. · <strong>Lotação:</strong> DILIC (Lucas Manager)
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button color="gray" size="sm"><Edit3 className="h-3.5 w-3.5" /> Solicitar Complementação</Button>
                            <Button size="sm"><FileCheck className="h-3.5 w-3.5" /> Emitir Parecer</Button>
                          </div>
                        </div>

                        {/* Abas de Contexto */}
                        <FilamentTabs
                          tabs={[
                            { id: 'dados', label: 'Dados do Processo' },
                            { id: 'tramitacao', label: 'Histórico de Tramitação', badge: 5 },
                            { id: 'documentos', label: 'Documentos Anexados', badge: 8 },
                            { id: 'condicionantes', label: 'Condicionantes Ambientais' },
                          ]}
                          activeTab="dados"
                          onChange={() => {}}
                        />

                        {/* Conteúdo em 2 Colunas */}
                        <div className="grid gap-4 lg:grid-cols-3">
                          <div className="lg:col-span-2 space-y-4">
                            <Section heading="Resumo do Empreendimento" description="Dados consolidados do requerimento inicial." icon={FileText} iconColor="primary">
                              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                                <div><span className="text-[var(--color-text-tertiary)] block">Atividade:</span><strong>Energia Solar Fotovoltaica</strong></div>
                                <div><span className="text-[var(--color-text-tertiary)] block">Município:</span><strong>Barreiras / BA</strong></div>
                                <div><span className="text-[var(--color-text-tertiary)] block">Área Total:</span><strong>450,00 hectares</strong></div>
                                <div><span className="text-[var(--color-text-tertiary)] block">Vigência Solicitada:</span><strong>5 anos</strong></div>
                              </div>
                            </Section>
                          </div>

                          <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 shadow-2xs">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] pb-3 mb-3">
                              Linha do Tempo
                            </h4>
                            <div className="space-y-3 text-xs">
                              {[
                                ['28/09/2026', 'Distribuído para análise técnica (DILIC)'],
                                ['20/09/2026', 'Protocolado via SEI-BA'],
                                ['18/09/2026', 'DAE compensado pelo financeiro'],
                              ].map(([dt, desc]) => (
                                <div key={dt} className="flex gap-2.5 items-start">
                                  <div className="w-2 h-2 rounded-full bg-[#0F4C3A] mt-1 shrink-0" />
                                  <div>
                                    <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] block">{dt}</span>
                                    <span className="text-[var(--color-text-secondary)]">{desc}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Specimen>
                  </div>
                )}

                {/* TEMPLATE 5: PORTAL CIDADÃO */}
                {activeTemplateTab === 'cidadao' && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4 text-xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge color="success">Arquétipo de Acesso Público</Badge>
                        <span className="font-semibold text-[var(--color-text-primary)]">Quando usar:</span>
                        <span className="text-[var(--color-text-secondary)]">Registro público de denúncias ambientais, emergências químicas e consulta pelo cidadão.</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-tertiary)]">
                        <strong>Regras de Ouro:</strong> Interface sem termos técnicos complexos; Orientação passo a passo; Upload visual com arrastar e soltar; Protocolo gerado em destaque.
                      </p>
                    </div>

                    <Specimen title="Preview do Template: Fluxo Cidadão" badge="Template 5">
                      <div className="max-w-2xl mx-auto space-y-5 bg-[var(--color-surface-canvas)] p-6 rounded-xl border border-[var(--color-border-subtle)]">
                        <div className="text-center space-y-1.5 border-b border-[var(--color-border-subtle)] pb-4">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-[#0F4C3A] dark:text-emerald-400 text-xs font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Canal Oficial de Atendimento ao Cidadão</span>
                          </div>
                          <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Registrar Denúncia Ambiental</h3>
                          <p className="text-xs text-[var(--color-text-secondary)]">Sua manifestação é tratada de forma sigilosa pela equipe técnica de fiscalização.</p>
                        </div>

                        <div className="space-y-4 bg-[var(--color-surface-default)] p-5 rounded-xl border border-[var(--color-border-default)]">
                          <label className="block space-y-1 text-xs font-semibold">
                            Tipo de Ocorrência *
                            <FilamentSelect value="desmate" onChange={() => {}} options={['Desmatamento Ilegal de Vegetação Nativa', 'Poluição de Curso d\'Água', 'Queimada não autorizada']} />
                          </label>

                          <label className="block space-y-1 text-xs font-semibold">
                            Descrição da Ocorrência *
                            <textarea className={cn(fieldClass, 'h-20 py-2')} placeholder="Informe o que aconteceu, pontos de referência e detalhes..." />
                          </label>

                          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                            <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                            <p className="text-xs font-semibold text-[var(--color-text-primary)]">Clique ou arraste fotos e evidências aqui</p>
                            <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Formatos suportados: JPG, PNG, PDF (máx. 15MB)</p>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button color="gray">Cancelar</Button>
                          <Button>Registrar e Gerar Protocolo <ArrowRight className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </Specimen>
                  </div>
                )}
              </section>

              {/* SEÇÃO: DIRETRIZES DE ACESSIBILIDADE */}
              <section id="accessibility" className="scroll-mt-8 pb-12">
                <SectionIntro
                  title="Acessibilidade e conformidade (WCAG 2.1 AA)"
                  description="Critérios mínimos obrigatórios aplicados em todos os componentes e fluxos do SEIA Plataforma."
                />
                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ['Contraste Rigoroso', 'Texto principal com contraste mínimo de 4.5:1 e texto grande/botões com 3:1 em relação ao fundo.'],
                    ['Navegação por Teclado', 'Todos os controles recebem foco visível com ring verde suave e respondem a Tab, Enter, Space e Esc.'],
                    ['Rótulos Persistentes', 'Formulários nunca dependem unicamente de placeholders. Todos os campos possuem labels descritivos.'],
                    ['Design Responsivo', 'Layouts operam sem corte de conteúdo a partir de 320px e tabelas possuem rolagem horizontal suave.'],
                    ['Modo Escuro Neutro', 'O dark mode utiliza tons de carvão e ardósia neutra, evitando cansaço visual e preservando a cor verde institucional.'],
                    ['Redução de Movimento', 'Transições respeitam preferências do sistema operacional via media query prefers-reduced-motion.'],
                  ].map(([title, description]) => (
                    <div key={title} className="flex gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 shadow-2xs">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-status-success)]" />
                      <div>
                        <h3 className="text-xs font-semibold text-[var(--color-text-primary)]">{title}</h3>
                        <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Interativo de Exemplo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Encaminhamento de Processo</DialogTitle>
            <DialogDescription>
              O processo selecionado será formalmente distribuído para a diretoria DILIC.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4 text-xs text-[var(--color-text-secondary)] space-y-1">
            <strong className="block text-[var(--color-text-primary)] font-mono text-sm">SEIA-REG-2026/001245</strong>
            <p>Verde Vale Energia S.A. · Licenciamento Ambiental (LP+LI)</p>
            <p className="text-[10px] text-slate-400">Responsável Atual: Lucas Manager (DILIC)</p>
          </div>
          <DialogFooter className="gap-2">
            <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setIsModalOpen(false)}>Confirmar Encaminhamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SeiaV2DesignSystemPage;
