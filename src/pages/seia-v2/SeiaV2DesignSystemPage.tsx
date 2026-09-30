import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Bell,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Info,
  LayoutDashboard,
  LoaderCircle,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  Search,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  UserRound,
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
import seiaIconWhite from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_ICON_W.svg';

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
  ['Canvas', '--color-surface-canvas', 'var(--color-surface-canvas)'],
  ['Surface', '--color-surface-default', 'var(--color-surface-default)'],
  ['Texto', '--color-text-primary', 'var(--color-text-primary)'],
  ['Borda', '--color-border-default', 'var(--color-border-default)'],
  ['Sucesso', '--color-status-success', 'var(--color-status-success)'],
  ['Alerta', '--color-status-warning', 'var(--color-status-warning)'],
  ['Crítico', '--color-status-critical', 'var(--color-status-critical)'],
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
  ['Arquivo', FileText],
  ['Download', Download],
  ['Upload', Upload],
  ['Ajuda', CircleHelp],
] as const;

const tableRows = [
  { process: 'SEIA-REG-2026/001245', applicant: 'Verde Vale Energia S.A.', type: 'Licenciamento', status: 'Em análise', unit: 'DILIC' },
  { process: 'SEIA-REG-2026/001198', applicant: 'Cooperativa Rio Vivo', type: 'Outorga', status: 'Pendente', unit: 'DIRRE' },
  { process: 'SEIA-REG-2026/001132', applicant: 'Bioflora Manejo Ltda.', type: 'Autorização', status: 'Concluído', unit: 'DIBIO' },
  { process: 'SEIA-REG-2026/001089', applicant: 'Município de Lençóis', type: 'Licenciamento', status: 'Vencido', unit: 'DIREC' },
];

const fieldClass = 'w-full h-9 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-sm text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] outline-none transition-colors hover:border-[var(--input-border-hover)] focus:border-[var(--input-border-focus)] focus:ring-2 focus:ring-[var(--color-green-alpha-20)] disabled:cursor-not-allowed disabled:opacity-55';
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-canvas)]';

const SectionIntro: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="mb-5 max-w-3xl">
    <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">{title}</h2>
    <p className="mt-1.5 text-sm leading-6 text-[var(--color-text-secondary)]">{description}</p>
  </div>
);

const Specimen: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, children, className }) => (
  <div className={cn('overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)]', className)}>
    <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] px-4 py-3">
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">{description}</p>}
      </div>
      <Badge color="gray" size="xs">Componente</Badge>
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

  const filteredSections = useMemo(() => {
    const term = navFilter.trim().toLowerCase();
    if (!term) return catalogSections;
    return catalogSections.filter((section) => `${section.group} ${section.label}`.toLowerCase().includes(term));
  }, [navFilter]);

  const visibleRows = tableRows.filter((row) =>
    `${row.process} ${row.applicant} ${row.type} ${row.status}`.toLowerCase().includes(tableSearch.toLowerCase())
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

          <nav aria-label="Seções do design system" className={cn('flex-1 overflow-y-auto p-3', isSidebarCollapsed && 'lg:px-2')}>
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

        <main id="design-system-content" className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1800px] p-4 pb-24 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-[var(--color-border-default)] pb-6 2xl:flex-row 2xl:items-end 2xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 flex items-center gap-2">
            <Badge color="success" dot>SEIA V2</Badge>
            <Badge color="gray">Design System · 1.0</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">Design System INEMA</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
            Biblioteca viva do SEIA Plataforma. Os exemplos abaixo usam os mesmos tokens, componentes e estados da Dashboard Gerencial de Regulação.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button color="gray" outlined onClick={() => jumpTo('accessibility')}>
            <CircleHelp className="h-4 w-4" /> Diretrizes
          </Button>
          <Button onClick={() => jumpTo('patterns')}>
            <LayoutDashboard className="h-4 w-4" /> Ver composições
          </Button>
        </div>
      </div>

      <div className="min-w-0 space-y-14">
          <section id="overview" className="scroll-mt-8">
            <SectionIntro title="Visão geral" description="Uma única linguagem para os fluxos internos e públicos do INEMA: clara, institucional, acessível e consistente nos temas claro e escuro." />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Consistência', 'Tokens semânticos conectam marca, componentes e estados.'],
                ['Reuso real', 'Os espécimes são instâncias dos componentes usados no produto.'],
                ['Acessibilidade', 'Contraste, foco, teclado e mensagens fazem parte da definição.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-5">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-status-success)]" />
                  <h3 className="mt-3 text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="brand" className="scroll-mt-8">
            <SectionIntro title="Marca e assets" description="Assinaturas oficiais exportadas do SEIA Plataforma. Em topbars verdes, use sempre as versões brancas." />
            <div className="grid gap-4 lg:grid-cols-2">
              <Specimen title="Logo horizontal" description="Uso preferencial em topbar e autenticação.">
                <div className="flex min-h-36 items-center justify-center rounded-xl bg-[var(--topbar-bg)] p-8">
                  <img src={seiaLogoWhite} alt="SEIA Plataforma" className="h-14 max-w-full" />
                </div>
              </Specimen>
              <Specimen title="Símbolo" description="Uso em sidebar recolhida e espaços compactos.">
                <div className="flex min-h-36 items-center justify-center rounded-xl bg-[var(--topbar-bg)] p-8">
                  <img src={seiaIconWhite} alt="Símbolo SEIA Plataforma" className="h-16 w-16" />
                </div>
              </Specimen>
            </div>
          </section>

          <section id="colors" className="scroll-mt-8">
            <SectionIntro title="Cores e tokens" description="O verde concentra identidade e ação; neutros organizam conteúdo. No dark mode, a base é carvão e o verde permanece como assinatura." />
            <Specimen title="Escala primária INEMA" description="Primitivos de marca do 50 ao 950.">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
                {greenTokens.map(([name, value]) => (
                  <button key={name} onClick={() => copyToken(value)} className="group overflow-hidden rounded-lg border border-[var(--color-border-default)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]">
                    <span className="block h-14" style={{ backgroundColor: value }} />
                    <span className="block bg-[var(--color-surface-default)] px-2 py-2">
                      <span className="block text-[11px] font-semibold text-[var(--color-text-primary)]">{name}</span>
                      <span className="block text-[9px] uppercase text-[var(--color-text-tertiary)]">{copiedToken === value ? 'Copiado' : value}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Specimen>
            <Specimen title="Tokens semânticos" description="Use pelo papel, nunca pelo valor hexadecimal." className="mt-4">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {semanticTokens.map(([label, token, value]) => (
                  <button key={token} onClick={() => copyToken(token)} className={cn('flex items-center gap-3 rounded-lg border border-[var(--color-border-default)] p-3 text-left transition-colors hover:bg-[var(--color-surface-hover)]', focusRing)}>
                    <span className="h-9 w-9 shrink-0 rounded-lg border border-black/10" style={{ backgroundColor: value }} />
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-[var(--color-text-primary)]">{label}</span>
                      <span className="block truncate text-[10px] text-[var(--color-text-tertiary)]">{copiedToken === token ? 'Token copiado' : token}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Specimen>
            <Specimen title="Escalas de suporte" description="Neutros estruturam superfícies; laranja e vermelho ficam reservados a alerta e criticidade." className="mt-4">
              <div className="space-y-4">
                {[
                  ['Neutro', ['#F8FAFC', '#E2E8F0', '#94A3B8', '#475569', '#0F172A', '#020617']],
                  ['Alerta', ['#FFF7ED', '#FED7AA', '#FB923C', '#EA580C', '#9A3412', '#431407']],
                  ['Crítico', ['#FFF1F2', '#FECDD3', '#FB7185', '#E11D48', '#9F1239', '#4C0519']],
                ].map(([label, colors]) => (
                  <div key={label as string} className="grid items-center gap-2 sm:grid-cols-[72px_1fr]">
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)]">{label as string}</span>
                    <div className="grid grid-cols-6 overflow-hidden rounded-lg border border-[var(--color-border-default)]">
                      {(colors as string[]).map((color) => <button key={color} onClick={() => copyToken(color)} className="h-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-border-focus)]" style={{ backgroundColor: color }} aria-label={`Copiar cor ${color}`} />)}
                    </div>
                  </div>
                ))}
              </div>
            </Specimen>
          </section>

          <section id="typography" className="scroll-mt-8">
            <SectionIntro title="Tipografia" description="Inter é a família funcional do produto. A hierarquia privilegia leitura rápida, densidade controlada e números tabulares." />
            <Specimen title="Escala tipográfica">
              <div className="divide-y divide-[var(--color-border-subtle)]">
                {[
                  ['Título de página', '30 / 36 · 700', 'text-3xl font-bold tracking-tight'],
                  ['Título de seção', '20 / 28 · 700', 'text-xl font-bold tracking-tight'],
                  ['Título de componente', '14 / 20 · 600', 'text-sm font-semibold'],
                  ['Corpo', '14 / 24 · 400', 'text-sm leading-6'],
                  ['Legenda', '12 / 16 · 500', 'text-xs font-medium'],
                  ['Dado tabular', '14 / 20 · 600', 'text-sm font-semibold tabular-nums'],
                ].map(([label, meta, classes]) => (
                  <div key={label} className="grid gap-2 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline">
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text-primary)]">{label}</p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)]">{meta}</p>
                    </div>
                    <p className={cn(classes, 'text-[var(--color-text-primary)]')}>Gestão ambiental orientada por evidências</p>
                  </div>
                ))}
              </div>
            </Specimen>
          </section>

          <section id="spacing" className="scroll-mt-8">
            <SectionIntro title="Espaçamento e forma" description="A base de 4 px controla ritmo, alinhamento, densidade e áreas de toque." />
            <div className="grid gap-4 lg:grid-cols-2">
              <Specimen title="Escala de espaçamento">
                <div className="space-y-3">
                  {[4, 8, 12, 16, 24, 32, 48].map((size) => (
                    <div key={size} className="flex items-center gap-3">
                      <span className="w-8 text-right text-[10px] font-medium tabular-nums text-[var(--color-text-tertiary)]">{size}</span>
                      <span className="h-3 rounded-sm bg-[var(--color-brand-primary)]" style={{ width: `${size * 3}px` }} />
                    </div>
                  ))}
                </div>
              </Specimen>
              <Specimen title="Raios e elevação">
                <div className="grid grid-cols-2 gap-4">
                  {[['8 px', 'rounded-lg'], ['12 px', 'rounded-xl'], ['16 px', 'rounded-2xl'], ['Pill', 'rounded-full']].map(([label, radius]) => (
                    <div key={label} className={cn('flex h-20 items-center justify-center border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] shadow-xs', radius)}>
                      <span className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</span>
                    </div>
                  ))}
                </div>
              </Specimen>
            </div>
          </section>

          <section id="icons" className="scroll-mt-8">
            <SectionIntro title="Ícones" description="Lucide, traço consistente e tamanhos de 16 px em controles, 20 px em destaques e 24 px apenas em superfícies amplas." />
            <Specimen title="Biblioteca funcional">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {iconCatalog.map(([label, Icon]) => (
                  <div key={label} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-3 text-center">
                    <Icon className="h-5 w-5 text-[var(--color-text-secondary)]" strokeWidth={1.8} />
                    <span className="text-[10px] font-medium text-[var(--color-text-tertiary)]">{label}</span>
                  </div>
                ))}
              </div>
            </Specimen>
          </section>

          <section id="buttons" className="scroll-mt-8">
            <SectionIntro title="Botões" description="A hierarquia de ações usa contraste, posição e linguagem direta; cor de status só aparece quando o significado exigir." />
            <Specimen title="Variantes e estados">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Button>Salvar alterações</Button>
                  <Button color="gray">Cancelar</Button>
                  <Button color="primary" outlined>Ver detalhes</Button>
                  <Button color="danger" outlined><Trash2 className="h-4 w-4" /> Excluir</Button>
                  <Button color="gray" variant="ghost"><MoreHorizontal className="h-4 w-4" /> Mais ações</Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="xs">Extra pequeno</Button>
                  <Button size="sm">Pequeno</Button>
                  <Button size="default">Padrão</Button>
                  <Button size="lg">Grande</Button>
                  <Button disabled>Desabilitado</Button>
                  <Button><LoaderCircle className="h-4 w-4 animate-spin" /> Salvando</Button>
                  <Button size="icon" aria-label="Configurações"><Settings className="h-4 w-4" /></Button>
                </div>
              </div>
            </Specimen>
          </section>

          <section id="fields" className="scroll-mt-8">
            <SectionIntro title="Campos e seleção" description="Rótulo sempre visível, placeholder apenas como apoio e mensagens de erro com instrução de recuperação." />
            <Specimen title="Formulário" description="Estados padrão, preenchido, desabilitado, inválido e seleção pesquisável.">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                  Número do processo <span className="text-[var(--color-status-critical)]">*</span>
                  <input className={fieldClass} placeholder="SEIA-REG-AAAA/000000" />
                  <span className="block text-[10px] font-normal text-[var(--color-text-tertiary)]">Use o identificador completo do processo.</span>
                </label>
                <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                  Diretoria responsável
                  <FilamentSelect
                    value={selectValue}
                    onChange={setSelectValue}
                    searchable
                    options={[
                      { value: 'dilic', label: 'DILIC — Licenciamento Ambiental' },
                      { value: 'dirre', label: 'DIRRE — Recursos Hídricos' },
                      { value: 'dibio', label: 'DIBIO — Biodiversidade' },
                    ]}
                  />
                </label>
                <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                  Responsável
                  <input className={fieldClass} value="Analista responsável" readOnly />
                </label>
                <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-disabled)]">
                  Unidade de origem
                  <input className={fieldClass} value="DIFIS / Coordenação" disabled readOnly />
                </label>
                <label className="space-y-1.5 text-xs font-semibold text-[var(--badge-critical-text)]">
                  CPF / CNPJ
                  <InputWrapper valid={false}>
                    <input className="w-full bg-transparent px-3 py-2 text-sm outline-none" value="000.000.000-0" readOnly />
                  </InputWrapper>
                  <span className="flex items-center gap-1 text-[10px] font-normal"><AlertCircle className="h-3 w-3" /> Informe 11 ou 14 dígitos.</span>
                </label>
                <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                  Observações
                  <textarea className={cn(fieldClass, 'h-24 resize-y py-2')} placeholder="Registre informações relevantes para a análise." />
                </label>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-[var(--color-border-subtle)] pt-5 text-xs text-[var(--color-text-secondary)]">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className={cn('h-4 w-4 accent-[var(--color-brand-primary)]', focusRing)} /> Receber notificações</label>
                <label className="flex items-center gap-2"><input type="radio" name="scope" defaultChecked className={cn('h-4 w-4 accent-[var(--color-brand-primary)]', focusRing)} /> Interno</label>
                <label className="flex items-center gap-2"><input type="radio" name="scope" className={cn('h-4 w-4 accent-[var(--color-brand-primary)]', focusRing)} /> Público</label>
                <button
                  role="switch"
                  aria-checked={switchOn}
                  onClick={() => setSwitchOn((value) => !value)}
                  className={cn('flex items-center gap-2 rounded-md', focusRing)}
                >
                  <span className={cn('relative h-5 w-9 rounded-full transition-colors', switchOn ? 'bg-[var(--color-brand-primary)]' : 'bg-[var(--color-neutral-300)]')}>
                    <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-xs transition-transform', switchOn ? 'translate-x-[18px]' : 'translate-x-0.5')} />
                  </span>
                  Publicação automática
                </button>
              </div>
            </Specimen>
          </section>

          <section id="badges" className="scroll-mt-8">
            <SectionIntro title="Badges e estados" description="Pills comunicam estado, categoria ou contagem. Nunca substituem ações nem usam vermelho fora de criticidade." />
            <Specimen title="Estados semânticos">
              <div className="flex flex-wrap items-center gap-2">
                <Badge color="success" dot>Concluído</Badge>
                <Badge color="warning" dot>Pendente</Badge>
                <Badge color="danger" dot>Vencido</Badge>
                <Badge color="info" dot>Em análise</Badge>
                <Badge color="primary">Licenciamento</Badge>
                <Badge color="gray">Rascunho</Badge>
                <Badge color="gray" size="xs">Em breve</Badge>
              </div>
            </Specimen>
          </section>

          <section id="cards" className="scroll-mt-8">
            <SectionIntro title="Cards e métricas" description="Cards agrupam informação relacionada; KPIs preservam leitura tabular, tendência e significado das cores." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard title="Protocolados" value="1.245" trend={{ value: '+12%', isPositive: true }} icon={FileText} variant="emerald" />
              <KpiCard title="Em Análise" value="2.356" trend={{ value: '-3%', isPositive: false }} icon={Clock3} variant="slate" />
              <KpiCard title="Pendentes" value="873" trend={{ value: '+8%', isPositive: false }} icon={AlertCircle} variant="amber" />
              <KpiCard title="Vencidos" value="198" trend={{ value: '+15%', isPositive: false }} icon={ShieldAlert} variant="rose" />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Seção de formulário</CardTitle>
                  <CardDescription>Combina título, descrição, conteúdo e ações.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <input className={fieldClass} placeholder="Campo principal" />
                  <input className={fieldClass} placeholder="Campo complementar" />
                </CardContent>
                <CardFooter className="justify-end gap-2"><Button color="gray">Cancelar</Button><Button>Salvar</Button></CardFooter>
              </Card>
              <Section heading="Seção recolhível" description="Conteúdo secundário que pode ser fechado sem perder contexto." collapsible icon={SlidersHorizontal} iconColor="primary">
                <p className="text-sm leading-6 text-[var(--color-text-secondary)]">Use recolhimento em blocos longos e independentes. O título permanece como resumo do conteúdo.</p>
              </Section>
            </div>
          </section>

          <section id="navigation" className="scroll-mt-8">
            <SectionIntro title="Navegação" description="Topbar institucional, sidebar orientada a módulos, breadcrumbs funcionais, abas e paginação." />
            <div className="space-y-4">
              <Specimen title="Topbar" description="Logo e controle da sidebar à esquerda, busca geral central e ações do usuário à direita.">
                <div className="flex min-h-16 items-center gap-4 rounded-xl bg-[var(--topbar-bg)] px-4 text-[var(--topbar-text)]">
                  <img src="/src/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_HORIZONTAL_W.svg" alt="SEIA Plataforma" className="h-9 w-auto" />
                  <button className={cn('rounded-lg p-2 hover:bg-white/10 focus-visible:ring-white', focusRing)} aria-label="Recolher sidebar"><PanelLeftClose className="h-4 w-4" /></button>
                  <div className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white/75 md:flex">
                    <Search className="h-4 w-4" /> Buscar processos, requerimentos SEIA ou atos...
                  </div>
                  <button className={cn('rounded-lg p-2 hover:bg-white/10 focus-visible:ring-white', focusRing)} aria-label="Notificações"><Bell className="h-4 w-4" /></button>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold">LM</span>
                </div>
              </Specimen>
              <div className="grid gap-4 lg:grid-cols-2">
                <Specimen title="Sidebar e grupos">
                  <div className="mx-auto max-w-sm rounded-xl bg-[var(--sidebar-bg)] p-3 text-xs">
                    {[
                      [LayoutDashboard, 'Dashboard Gerencial', true],
                      [FileText, 'Regulação', false],
                      [ShieldAlert, 'Fiscalização', false],
                      [Settings, 'Administração', false],
                    ].map(([Icon, label, active]) => {
                      const NavIcon = Icon as React.ElementType;
                      return (
                        <button key={label as string} className={cn('mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-medium', focusRing, active ? 'bg-[var(--nav-item-selected-bg)] text-[var(--nav-item-selected-text)]' : 'text-[var(--nav-item-text)] hover:bg-[var(--nav-item-hover-bg)]')}>
                          <NavIcon className="h-4 w-4" /> <span className="flex-1">{label as string}</span> {!active && <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </Specimen>
                <Specimen title="Breadcrumb e abas">
                  <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]" aria-label="Breadcrumb">
                    <a href="/?rota=seia-v2&tela=inicio" className={cn('rounded hover:text-[var(--color-text-link)] hover:underline', focusRing)}>Início</a>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <a href="/?rota=seia-v2&tela=relatorios" className={cn('rounded hover:text-[var(--color-text-link)] hover:underline', focusRing)}>Regulação</a>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="font-semibold text-[var(--color-text-primary)]">Dashboard</span>
                  </nav>
                  <FilamentTabs
                    className="mt-6"
                    tabs={[{ id: 'visao-geral', label: 'Visão geral' }, { id: 'processos', label: 'Processos', badge: 24 }, { id: 'documentos', label: 'Documentos' }]}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                  />
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-4">
                    <span className="text-xs text-[var(--color-text-tertiary)]">1–10 de 98 resultados</span>
                    <div className="flex items-center">
                      {[ChevronLeft, '1', '2', '3', ChevronRight].map((item, index) => typeof item === 'string' ? (
                        <button key={item} className={cn('h-8 min-w-8 border-y border-r border-[var(--color-border-default)] text-xs first:border-l', focusRing, index === 1 ? 'bg-[var(--color-brand-primary-subtle)] font-semibold text-[var(--color-text-link)]' : 'text-[var(--color-text-secondary)]')}>{item}</button>
                      ) : React.createElement(item, { key: index, className: cn('h-8 w-8 border-y border-r border-[var(--color-border-default)] p-2 text-[var(--color-text-secondary)] first:border-l', focusRing) }))}
                    </div>
                  </div>
                </Specimen>
              </div>
            </div>
          </section>

          <section id="table" className="scroll-mt-8">
            <SectionIntro title="Tabelas" description="Busca, filtros, seleção, ordenação, estados, ações e paginação em uma composição responsiva." />
            <TableContainer
              toolbar={
                <div className="flex flex-col gap-3 border-b border-[var(--color-border-subtle)] p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button color="gray" size="sm"><MoreHorizontal className="h-4 w-4" /> Ações em lote</Button>
                    <Button color="gray" size="sm"><Filter className="h-4 w-4" /> Filtros <Badge color="primary" size="xs">2</Badge></Button>
                    <Button color="gray" size="sm"><SlidersHorizontal className="h-4 w-4" /> Colunas</Button>
                  </div>
                  <div className="relative w-full md:max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                    <label htmlFor="design-system-table-search" className="sr-only">Buscar processos na tabela de exemplo</label>
                    <input id="design-system-table-search" value={tableSearch} onChange={(event) => setTableSearch(event.target.value)} placeholder="Buscar na tabela" className={cn(fieldClass, 'pl-9')} />
                  </div>
                </div>
              }
              pagination={
                <div className="flex w-full flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[var(--color-text-tertiary)]">Exibindo {visibleRows.length} de 98 resultados</span>
                  <div className="flex items-center gap-1"><Button color="gray" size="xs"><ChevronLeft className="h-3.5 w-3.5" /> Anterior</Button><Button size="xs">1</Button><Button color="gray" size="xs">2</Button><Button color="gray" size="xs">Próxima <ChevronRight className="h-3.5 w-3.5" /></Button></div>
                </div>
              }
            >
              {selectedRows.length > 0 && (
                <div className="flex items-center justify-between gap-3 bg-[var(--color-brand-primary-subtle)] px-4 py-2 text-xs text-[var(--color-text-link)]">
                  <span className="font-semibold">{selectedRows.length} registro(s) selecionado(s)</span>
                  <button onClick={() => setSelectedRows([])} className={cn('rounded font-semibold hover:underline', focusRing)}>Limpar seleção</button>
                </div>
              )}
              <table className="w-full min-w-[820px] text-left text-xs">
                <thead className="border-b border-[var(--table-border)] bg-[var(--table-header-bg)] text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  <tr>
                    <th className="p-4"><input type="checkbox" aria-label="Selecionar todos os processos" className={cn('h-4 w-4 accent-[var(--color-brand-primary)]', focusRing)} onChange={(event) => setSelectedRows(event.target.checked ? tableRows.map((row) => row.process) : [])} checked={selectedRows.length === tableRows.length} /></th>
                    <th className="p-4">Processo</th><th className="p-4">Interessado</th><th className="p-4">Tipo</th><th className="p-4">Unidade</th><th className="p-4">Status</th><th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--table-border)]">
                  {visibleRows.map((row) => (
                    <tr key={row.process} className="transition-colors hover:bg-[var(--table-row-hover)]">
                      <td className="p-4"><input type="checkbox" aria-label={`Selecionar processo ${row.process}`} className={cn('h-4 w-4 accent-[var(--color-brand-primary)]', focusRing)} checked={selectedRows.includes(row.process)} onChange={() => setSelectedRows((current) => current.includes(row.process) ? current.filter((item) => item !== row.process) : [...current, row.process])} /></td>
                      <td className="p-4 font-semibold text-[var(--color-text-primary)]">{row.process}</td>
                      <td className="p-4 text-[var(--color-text-secondary)]">{row.applicant}</td>
                      <td className="p-4 text-[var(--color-text-secondary)]">{row.type}</td>
                      <td className="p-4 font-semibold text-[var(--color-text-secondary)]">{row.unit}</td>
                      <td className="p-4"><Badge color={row.status === 'Concluído' ? 'success' : row.status === 'Pendente' ? 'warning' : row.status === 'Vencido' ? 'danger' : 'info'} dot>{row.status}</Badge></td>
                      <td className="p-4"><div className="flex justify-end gap-1"><Button color="gray" size="icon" aria-label="Visualizar"><Eye className="h-4 w-4" /></Button><Button color="gray" size="icon" aria-label="Editar"><Edit3 className="h-4 w-4" /></Button><Button color="danger" outlined size="icon" aria-label="Excluir"><Trash2 className="h-4 w-4" /></Button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleRows.length === 0 && (
                <div className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
                  <Search className="h-8 w-8 text-[var(--color-text-disabled)]" />
                  <h3 className="mt-3 text-sm font-semibold text-[var(--color-text-primary)]">Nenhum processo encontrado</h3>
                  <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">Revise o termo de busca ou limpe os filtros ativos.</p>
                  <Button color="gray" size="sm" className="mt-4" onClick={() => setTableSearch('')}>Limpar busca</Button>
                </div>
              )}
            </TableContainer>
          </section>

          <section id="wizard" className="scroll-mt-8">
            <SectionIntro title="Wizard" description="Etapas conectadas por divisórias em chevron, com concluído, atual e futuro claramente diferenciados." />
            <Specimen title="Fluxo de requerimento" description="Clique em uma etapa para revisar os estados.">
              <div className="overflow-hidden rounded-xl border border-[var(--color-border-default)]">
                <FilamentWizard
                  steps={[{ id: 1, label: 'Identificação' }, { id: 2, label: 'Tipo de Solicitação' }, { id: 3, label: 'Questionário' }, { id: 4, label: 'Documentos' }]}
                  currentStep={wizardStep}
                  onStepClick={setWizardStep}
                />
                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">Razão social<input className={fieldClass} placeholder="Nome do empreendimento" /></label>
                  <label className="space-y-1.5 text-xs font-semibold text-[var(--color-text-primary)]">CPF / CNPJ<input className={fieldClass} placeholder="00.000.000/0000-00" /></label>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] p-4">
                  <Button color="gray" disabled={wizardStep === 1} onClick={() => setWizardStep((step) => Math.max(1, step - 1))}><ChevronLeft className="h-4 w-4" /> Voltar</Button>
                  <Button disabled={wizardStep === 4} onClick={() => setWizardStep((step) => Math.min(4, step + 1))}>Avançar <ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </Specimen>
          </section>

          <section id="feedback" className="scroll-mt-8">
            <SectionIntro title="Feedback e overlays" description="Alertas, estados vazios, modal e painel de notificações dão retorno imediato sem perder o contexto." />
            <div className="grid gap-4 lg:grid-cols-2">
              <Specimen title="Mensagens e estados">
                <div className="space-y-3">
                  {[
                    [CheckCircle2, 'Solicitação salva com sucesso.', 'var(--badge-success-bg)', 'var(--badge-success-text)', 'var(--badge-success-border)'],
                    [AlertCircle, 'Existem campos obrigatórios pendentes.', 'var(--badge-warning-bg)', 'var(--badge-warning-text)', 'var(--badge-warning-border)'],
                    [Info, 'A análise será encaminhada para a unidade responsável.', 'var(--badge-info-bg)', 'var(--badge-info-text)', 'var(--badge-info-border)'],
                  ].map(([Icon, text, background, color, border]) => {
                    const AlertIcon = Icon as React.ElementType;
                    return <div key={text as string} className="flex items-start gap-2 rounded-xl border p-3 text-xs" style={{ backgroundColor: background as string, color: color as string, borderColor: border as string }}><AlertIcon className="mt-0.5 h-4 w-4 shrink-0" /><span className="leading-5">{text as string}</span></div>;
                  })}
                </div>
              </Specimen>
              <Specimen title="Overlays interativos">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setIsModalOpen(true)}>Abrir modal</Button>
                  <Button color="gray" aria-expanded={isNotificationOpen} aria-controls="design-system-notifications" onClick={() => setIsNotificationOpen((open) => !open)}><Bell className="h-4 w-4" /> Notificações <Badge color="danger" size="xs">3</Badge></Button>
                </div>
                {isNotificationOpen && (
                  <div id="design-system-notifications" className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] shadow-lg">
                    <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3"><div><h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Notificações</h4><button className={cn('rounded text-[10px] font-semibold text-[var(--color-text-link)] hover:underline', focusRing)}>Marcar todas como lidas</button></div><button onClick={() => setIsNotificationOpen(false)} className={cn('rounded', focusRing)} aria-label="Fechar notificações"><X className="h-4 w-4 text-[var(--color-text-tertiary)]" /></button></div>
                    <div className="divide-y divide-[var(--color-border-subtle)]">
                      {[
                        ['Análise distribuída', 'O processo 001245 foi atribuído a você.', 'Agora'],
                        ['Prazo próximo', 'Uma atividade vence em 2 dias.', '12 min'],
                        ['Exportação concluída', 'O relatório está pronto para download.', '1 h'],
                      ].map(([title, description, time]) => <button key={title} className={cn('flex w-full gap-3 p-4 text-left hover:bg-[var(--color-surface-hover)]', focusRing)}><span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-brand-primary-subtle)] text-[var(--color-text-link)]"><Bell className="h-3.5 w-3.5" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-[var(--color-text-primary)]">{title}</span><span className="mt-0.5 block text-[10px] leading-4 text-[var(--color-text-secondary)]">{description}</span></span><span className="text-[9px] text-[var(--color-text-tertiary)]">{time}</span></button>)}
                    </div>
                  </div>
                )}
              </Specimen>
            </div>
          </section>

          <section id="patterns" className="scroll-mt-8">
            <SectionIntro title="Padrões de página" description="Composições prontas organizam cabeçalho, filtros, conteúdo e ações sem redesenhar cada módulo." />
            <div className="space-y-4">
              <Specimen title="Cabeçalho de página">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <nav className="mb-2 flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]"><span>Início</span><ChevronRight className="h-3 w-3" /><span>Regulação</span><ChevronRight className="h-3 w-3" /><span className="font-semibold text-[var(--color-text-primary)]">Pauta de Processos</span></nav>
                    <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">Pauta de Processos</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Acompanhe distribuição, prazos e responsáveis pela análise.</p>
                  </div>
                  <div className="flex gap-2"><Button color="gray"><Download className="h-4 w-4" /> Exportar</Button><Button><FileText className="h-4 w-4" /> Novo requerimento</Button></div>
                </div>
              </Specimen>
              <Specimen title="Composição de dashboard" description="A mesma linguagem visual da Dashboard Gerencial de Regulação.">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['Entradas', '1.245', TrendingUp, 'text-[var(--color-status-success)]'],
                    ['Em análise', '2.356', Clock3, 'text-[var(--color-status-info)]'],
                    ['Vencidos', '198', TrendingDown, 'text-[var(--color-status-critical)]'],
                  ].map(([label, value, Icon, color]) => {
                    const MetricIcon = Icon as React.ElementType;
                    return <div key={label as string} className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">{label as string}</span><MetricIcon className={cn('h-4 w-4', color as string)} /></div><strong className="mt-2 block text-2xl tabular-nums text-[var(--color-text-primary)]">{value as string}</strong></div>;
                  })}
                </div>
                <div className="mt-3 grid h-48 place-items-center rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] text-center">
                  <div><LayoutDashboard className="mx-auto h-7 w-7 text-[var(--color-text-disabled)]" /><p className="mt-2 text-xs font-semibold text-[var(--color-text-secondary)]">Área para gráficos e análise operacional</p><p className="mt-1 text-[10px] text-[var(--color-text-tertiary)]">Grid, eixos e superfícies usam tokens semânticos.</p></div>
                </div>
              </Specimen>
            </div>
          </section>

          <section id="accessibility" className="scroll-mt-8 pb-8">
            <SectionIntro title="Acessibilidade e uso" description="Critérios mínimos para toda nova interface do SEIA Plataforma." />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Contraste', 'Texto comum com contraste mínimo de 4,5:1 e estados nunca dependentes apenas de cor.'],
                ['Teclado', 'Ordem de foco lógica, controles operáveis e foco visível em todos os componentes.'],
                ['Conteúdo', 'Rótulos persistentes, instruções objetivas e erros que explicam como corrigir.'],
                ['Responsividade', 'Conteúdo preservado em 320 px; tabelas rolam sem cortar ações essenciais.'],
                ['Movimento', 'Transições curtas e funcionais, respeitando preferências de redução de movimento.'],
                ['Temas', 'Light e dark representam o mesmo produto; identidade verde sobre base neutra.'],
              ].map(([title, description]) => (
                <div key={title} className="flex gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-status-success)]" />
                  <div><h3 className="text-xs font-semibold text-[var(--color-text-primary)]">{title}</h3><p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{description}</p></div>
                </div>
              ))}
            </div>
          </section>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar encaminhamento</DialogTitle>
            <DialogDescription>O processo será encaminhado para a unidade DILIC e ficará disponível na pauta do responsável.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4 text-xs text-[var(--color-text-secondary)]">
            <strong className="block text-[var(--color-text-primary)]">SEIA-REG-2026/001245</strong>
            Verde Vale Energia S.A. · Licenciamento Ambiental
          </div>
          <DialogFooter><Button color="gray" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button onClick={() => setIsModalOpen(false)}>Confirmar encaminhamento</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SeiaV2DesignSystemPage;
