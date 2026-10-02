import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  Palette,
  LayoutGrid,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Clock,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Eye,
  Check,
  Zap,
  MousePointerClick,
  MessageSquareQuote,
  MonitorPlay
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface RoteiroItem {
  id: string;
  titulo: string;
  tempoSugerido: string;
  rotaUrl: string;
  tagMapeada: string;
  oQueFalar: string;
  oQueMostrar: string[];
  argumentoDeOuro: string;
}

interface RoteiroBloco {
  id: string;
  numero: string;
  titulo: string;
  subtitulo: string;
  tempoTotal: string;
  cor: string;
  itens: RoteiroItem[];
}

const ROTEIRO_DATA: RoteiroBloco[] = [
  {
    id: 'bloco-1-abertura-parceria',
    numero: '01',
    titulo: 'Abertura & Conexão com a Inspeção do Legado',
    subtitulo: 'Posicionamento estratégico: de UX para UX, sem passar tela a tela.',
    tempoTotal: '1:30 min',
    cor: '#0F4C3A',
    itens: [
      {
        id: 'abertura-ux-tales',
        titulo: 'Alinhamento de Propósito: O Motor de Design para o seu Trabalho',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Início & Posicionamento',
        oQueFalar:
          '“Fala Tales! Tudo bem? Cara, eu sei que você está bem focado aí na inspeção das telas e dos fluxos do Inema legado — que é um trabalho essencial pra gente mapear as fricções cognitivas, redundâncias de campos e a lógica de trabalho dos analistas.\n\nPra nossa conversa de hoje, eu não vou te cansar passando tela a tela de um sistema inteiro. Como você é de UX, eu quero te mostrar a infraestrutura e a arquitetura de interface que nós construímos aqui no SEIA V2: montamos um Design System vivo, definimos os padrões fundamentais de interação e deixamos essa base 100% pronta para plugar com velocidade exatamente as telas e jornadas que você for refinando na sua inspeção.\n\nVou compartilhar minha tela pra você ver como estruturamos essa fundação.”',
        oQueMostrar: [
          'Compartilhar a tela já no ambiente oficial do SEIA V2: inema.acto.com.br/?rota=seia-v2.',
          'Destacar a sobriedade institucional da topbar (100% de largura) e a fluidez do novo Shell de navegação.',
          'Explicar que a meta da call é alinhar a esteira de implementação para as telas que ele for inspecionando.',
        ],
        argumentoDeOuro:
          'Nós não criamos telas isoladas: criamos um sistema de design escalável que absorve qualquer fluxo que o Tales desenhar sem retrabalho de componentes.',
      },
    ],
  },
  {
    id: 'bloco-2-design-system',
    numero: '02',
    titulo: 'Design System Oficial INEMA & Fundações de UI',
    subtitulo: 'Tokens semânticos, densidade compacta (36px/32px), grid de 8pt, WCAG e Dark Mode nativo.',
    tempoTotal: '3:30 min',
    cor: '#1b5e20',
    itens: [
      {
        id: 'ds-fundacoes-tokens',
        titulo: 'Fundações Atômicas, Paleta Institucional e Acessibilidade',
        tempoSugerido: '1:45 min',
        rotaUrl: '/?rota=seia-v2&tela=design-system',
        tagMapeada: 'Design System / Fundações',
        oQueFalar:
          '“Tales, começando pela nossa fonte de verdade: construímos um ambiente autônomo do Design System oficial do INEMA, documentando desde as fundações atômicas até componentes complexos.\n\nQuero destacar 4 decisões de UX que tomamos aqui:\n1. Identidade Institucional sem Ruído: Fixamos a paleta no verde oficial (#0F4C3A), eliminando qualquer roxo, gradientes chamativos ou teals genéricos que costumam poluir sistemas de governo.\n2. Tipografia Modular: Usamos a Inter com escala tipográfica modular rígida, e todos os processos, protocolos SEI e valores em fonte monoespacial tabular (font-mono tabular-nums).\n3. Consistência Geométrica: Grid de 8pt, rounded-xl (12px) rigoroso para contêineres e rounded-lg (8px) para controles interativos.\n4. Acessibilidade & Dark Mode: Contraste validado em WCAG AA e dark mode nativo neutro em carvão/ardósia, pensado para analistas com longas jornadas de trabalho diário.”',
        oQueMostrar: [
          'Abrir a rota do Design System (/tela=design-system).',
          'Rolar brevemente pelas seções de Cores e Tokens, destacando as variáveis CSS semânticas.',
          'Alternar para o Dark Mode (ícone de lua na topbar) e voltar para o Light Mode demonstrando a harmonia de contraste.',
        ],
        argumentoDeOuro:
          'O Design System é a nossa linguagem comum: elimina subjetividade visual e garante conformidade de acessibilidade (WCAG AA) em todo o sistema.',
      },
      {
        id: 'ds-densidade-componentes',
        titulo: 'Densidade de Informação (Dense UI) & Componentes Reutilizáveis',
        tempoSugerido: '1:45 min',
        rotaUrl: '/?rota=seia-v2&tela=design-system',
        tagMapeada: 'Componentes & Densidade',
        oQueFalar:
          '“Um ponto que eu sei que você repara muito na inspeção do legado é o desperdício de espaço vertical e horizontal. O analista precisa rolar a página inteira pra ver 3 campos.\n\nNo SEIA V2, nós adotamos uma densidade compacta inspirada no Filament: alturas de controle de 36px e 32px nos botões e inputs (InputWrapper e FilamentSelect), badges semânticos com status dots, seções recolhíveis (Section) e cards de KPI com micro-sparklines.\n\nIsso aumenta drasticamente a área útil da tela sem gerar cansaço visual, permitindo ao usuário processar dados com muito mais rapidez.”',
        oQueMostrar: [
          'Mostrar a seção de Botões e Inputs com prefixos/sufixos, anéis de foco suaves e alturas compactas (h-9 e h-8).',
          'Mostrar os Badges semânticos com dots coloridos (sucesso, aviso, perigo, info).',
          'Destacar a biblioteca de componentes limpos: zero HTML descartável, tudo modularizado.',
        ],
        argumentoDeOuro:
          'Como já temos os componentes refinados, quando o Tales terminar de desenhar uma tela no Figma, a conversa técnica será em cima de blocos prontos.',
      },
    ],
  },
  {
    id: 'bloco-3-arquetipos-interacao',
    numero: '03',
    titulo: 'Os 3 Arquétipos de Interação (Como Resolvemos o Legado)',
    subtitulo: 'Data Grids com Drawers, Stepper em Chevron SVG e Dashboards Sóbrios.',
    tempoTotal: '4:30 min',
    cor: '#004d40',
    itens: [
      {
        id: 'arquetipo-pautas-tabelas',
        titulo: 'Arquétipo 1: Pautas Operacionais & Data Grids (Tabelas com Contexto)',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=pauta-area',
        tagMapeada: 'Pauta da Área / Tabela',
        oQueFalar:
          '“Tales, em vez de repassar 20 telas parecidas, vou te mostrar os 3 arquétipos fundamentais que cobrem 95% das necessidades do legado:\n\nO primeiro arquétipo são as Pautas e Data Grids (aqui na Pauta da Área). No legado, o técnico sofre com tabelas pesadas, sem filtros dinâmicos e com popups que quebram o fluxo de raciocínio.\n\nAqui nós resolvemos isso com a Tabela Canônica:\n- Toolbar com busca em tempo real debounced e filtros dinâmicos que exibem contagem ativa em badges.\n- Badges semânticos de SLA com dots coloridos pra identificar na hora processos críticos ou no prazo.\n- Ações contextuais que abrem gavetas laterais (Drawers) ou modais refinados, permitindo analisar detalhes sem que o técnico perca a posição ou o contexto na listagem.”',
        oQueMostrar: [
          'Abrir a rota /tela=pauta-area (mostrar abas de Pauta da Área vs Em Análise Técnica ativadas instantaneamente).',
          'Digitar no campo de busca da tabela e mostrar a toolbar com contagem de filtros.',
          'Destacar a tipografia monoespacial nos números SEI e a leitura confortável das linhas.',
        ],
        argumentoDeOuro:
          'Reduz a fricção operacional diária: o analista encontra, tria e despacha processos sem recarregar páginas e sem perder a sua fila de trabalho.',
      },
      {
        id: 'arquetipo-formularios-wizard',
        titulo: 'Arquétipo 2: Formulários Modulares & Wizard com Stepper SVG',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=formulario',
        tagMapeada: 'Requerimento / Wizard',
        oQueFalar:
          '“O segundo arquétipo são os Formulários Complexos. No legado, o usuário enfrenta páginas com 70 a 80 campos jogados na mesma tela, gerando abandono e erros frequentes.\n\nNossa solução de UX foi o componente FilamentWizard com divisórias em chevron institucional SVG:\n- Fatiamos a complexidade em etapas lógicas e digestíveis (Identificação, Tipologia, Recursos Hídricos, Documentos).\n- O usuário sempre sabe exatamente em que etapa está, o que concluiu e o que falta preencher, com validação instantânea e salvamento de rascunhos.\n- Seções modulares recolhíveis (Section) para informações complementares, com botão limpo de retorno à pauta no topo.”',
        oQueMostrar: [
          'Abrir a rota /tela=formulario (Requerimento Unificado) ou /tela=ansla-dispensa.',
          'Avançar pelas etapas do Stepper oficial com chevron institucional.',
          'Apontar os cards agrupados em Section com ícones discretos e campos bem alinhados.',
        ],
        argumentoDeOuro:
          'Transforma fluxos burocráticos pesados em jornadas guiadas passo a passo, reduzindo a taxa de erros e retrabalho de análise técnica.',
      },
      {
        id: 'arquetipo-dashboards-kpis',
        titulo: 'Arquétipo 3: Dashboards & Métricas de Produtividade Sóbrias',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Dashboard / Visão Executiva',
        oQueFalar:
          '“O terceiro arquétipo é a Visão Executiva e a Gestão Diária. No legado há uma grande escassez de visibilidade sobre pendências e prazos.\n\nAqui nós implementamos o padrão de KpiCards Sóbrios:\n- Títulos em caixa alta discreta (text-[11px] uppercase), valores em font-mono tabular-nums de alto contraste e micro-sparklines de tendência.\n- Zero ilustrações genéricas ou caixas coloridas berrantes: é uma interface densa, informativa e profissional, feita para tomada rápida de decisão pelo gestor e pelo técnico.”',
        oQueMostrar: [
          'Voltar à rota /tela=inicio.',
          'Passar o cursor sobre as 6 métricas de entrada (Mensagens, Notificações, Prazos, Requerimentos, Vencimentos, Rascunhos).',
          'Mostrar o Comunicado Oficial padronizado com referência normativa e o grid de Acesso Rápido limpo.',
        ],
        argumentoDeOuro:
          'Visibilidade gerencial imediata: métricas operacionais reais que dão clareza de prioridades no primeiro segundo de acesso ao sistema.',
      },
    ],
  },
  {
    id: 'bloco-4-handover-parceria',
    numero: '04',
    titulo: 'Handover & Fluxo de Implementação Contínua',
    subtitulo: 'Como transformar as telas revisadas pelo Tales em telas reais prontas no SEIA V2.',
    tempoTotal: '2:00 min',
    cor: '#0F4C3A',
    itens: [
      {
        id: 'parceria-fluxo-continuo',
        titulo: 'Alinhamento da Esteira: Da Inspeção/Figma do Tales para o SEIA V2',
        tempoSugerido: '2:00 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Handover & Parceria',
        oQueFalar:
          '“Tales, essa é a arquitetura que está operando hoje no SEIA V2, já compilada, testada e publicada no link oficial inema.acto.com.br.\n\nA grande vantagem prática para o seu trabalho de UX é que você tem total liberdade de desenhar os fluxos na sua inspeção do legado sabendo que a base técnica já está resolvida.\n\nConforme você for concluindo a inspeção de cada lote de telas (seja Regulação, Fiscalização, Recursos Hídricos ou Cadastros), a gente pega as telas que você revisar e pluga diretamente dentro dessa estrutura de componentes.\n\nComo você prefere que a gente organize esse fluxo de repasse? Quer que a gente defina lotes de telas por sprint ou você prefere validar as jornadas principais primeiro no Figma?”',
        oQueMostrar: [
          'Deixar a tela na página inicial ou no Design System para responder a eventuais dúvidas técnicas ou de UI.',
          'Abrir o microfone para ouvir as impressões do Tales e co-definir o formato da parceria.',
        ],
        argumentoDeOuro:
          'Alinhamento perfeito de papéis: o Tales foca em UX research, fluxos e regras do legado, e nós garantimos a implementação fiel e rápida no SEIA V2.',
      },
    ],
  },
];

export const RoteiroApresentacaoPage: React.FC<{ onNavigate?: (route: string) => void }> = ({
  onNavigate,
}) => {
  // Estado de checks salvos em localStorage
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('seia_v2_pitch_checks');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Estado de blocos recolhidos
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({});

  // Cronômetro da Apresentação
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleCheck = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      try {
        localStorage.setItem('seia_v2_pitch_checks', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const resetChecks = () => {
    if (window.confirm('Deseja desmarcar todos os itens do roteiro?')) {
      setCheckedItems({});
      localStorage.removeItem('seia_v2_pitch_checks');
    }
  };

  const toggleBlock = (blockId: string) => {
    setCollapsedBlocks((prev) => ({ ...prev, [blockId]: !prev[blockId] }));
  };

  // Cálculo de progresso
  const totalItens = ROTEIRO_DATA.reduce((acc, b) => acc + b.itens.length, 0);
  const concluidos = Object.values(checkedItems).filter(Boolean).length;
  const percentual = totalItens > 0 ? Math.round((concluidos / totalItens) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Relatórios Gerenciais', route: 'relatorios' },
          { label: 'Roteiro de Apresentação' },
        ]}
        onNavigate={onNavigate}
      />

      {/* HEADER PRINCIPAL / TELEPROMPTER DASHBOARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0F4C3A]/10 dark:bg-emerald-500/20 text-[#0F4C3A] dark:text-emerald-300 border border-[#0F4C3A]/20 flex items-center gap-1.5">
                <MonitorPlay className="w-3.5 h-3.5" />
                <span>Modo Apresentador Ativo</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Apresentação de UX & Design System • <strong>Tales (UX Inema)</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-2">
              Roteiro de Apresentação — SEIA V2 (Foco em UX & Design System)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Guia interativo para demonstrar ao Tales o Design System vivo, os 3 arquétipos fundamentais e como a esteira técnica está pronta para plugar as telas que ele revisar no legado. Sem repassar tela a tela.
            </p>
          </div>

          {/* CRONÔMETRO & AÇÕES RÁPIDAS */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-slate-700">
              <Clock className="w-4 h-4 text-slate-500" />
              <div className="text-left">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tempo Decorrido</div>
                <div className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
                  {formatTimer(timerSeconds)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={cn(
                  'h-8 text-xs font-semibold',
                  isTimerRunning
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50'
                    : 'bg-[#0F4C3A] text-white hover:bg-[#0c3d2e]'
                )}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 mr-1" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 mr-1" /> Iniciar Call
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="h-8 text-xs text-slate-500 hover:text-slate-700"
                title="Zerar cronômetro"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={resetChecks}
              className="h-8 text-xs text-slate-600 dark:text-slate-300"
            >
              Limpar Checks
            </Button>
          </div>
        </div>

        {/* BARRA DE PROGRESSO GLOBAL */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Progresso da Apresentação</span>
              <span className="text-slate-400 font-normal">
                ({concluidos} de {totalItens} tópicos cobertos)
              </span>
            </span>
            <span className="font-mono text-[#0F4C3A] dark:text-emerald-400 text-sm font-bold">
              {percentual}% Concluído
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0F4C3A] dark:bg-emerald-500 h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${percentual}%` }}
            />
          </div>
        </div>
      </div>

      {/* BLOCOS DA APRESENTAÇÃO */}
      <div className="space-y-6">
        {ROTEIRO_DATA.map((bloco) => {
          const isCollapsed = !!collapsedBlocks[bloco.id];
          const itensConcluidosBloco = bloco.itens.filter((it) => checkedItems[it.id]).length;
          const bloco100 = itensConcluidosBloco === bloco.itens.length;

          return (
            <div
              key={bloco.id}
              className={cn(
                'bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs',
                bloco100
                  ? 'border-emerald-300 dark:border-emerald-900/60'
                  : 'border-slate-200 dark:border-slate-800'
              )}
            >
              {/* CABEÇALHO DO BLOCO */}
              <div
                onClick={() => toggleBlock(bloco.id)}
                className="p-5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0F4C3A] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    {bloco.numero}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                        {bloco.titulo}
                      </h2>
                      {bloco100 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Bloco Concluído
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {bloco.subtitulo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                    ⏱️ ~{bloco.tempoTotal}
                  </span>
                  <button
                    type="button"
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 transition-transform duration-200',
                        isCollapsed && '-rotate-90'
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* LISTA DE ITENS DO BLOCO */}
              {!isCollapsed && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {bloco.itens.map((item) => {
                    const isChecked = !!checkedItems[item.id];

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'p-5 transition-all duration-150',
                          isChecked
                            ? 'bg-emerald-50/20 dark:bg-emerald-950/10'
                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                        )}
                      >
                        {/* GRID DE DUAS COLUNAS LADO A LADO */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                          {/* COLUNA 1 (ESQUERDA): CHECKBOX, TÍTULO, ABRIR TELA & O QUE MOSTRAR */}
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <button
                                  type="button"
                                  onClick={() => toggleCheck(item.id)}
                                  className="mt-0.5 shrink-0 cursor-pointer focus:outline-none"
                                  aria-label={`Marcar ${item.titulo} como concluído`}
                                >
                                  {isChecked ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-slate-500 transition-colors" />
                                  )}
                                </button>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3
                                      onClick={() => toggleCheck(item.id)}
                                      className={cn(
                                        'text-sm sm:text-base font-bold cursor-pointer transition-colors',
                                        isChecked
                                          ? 'line-through text-slate-400 dark:text-slate-500'
                                          : 'text-slate-900 dark:text-slate-100 hover:text-[#0F4C3A]'
                                      )}
                                    >
                                      {item.titulo}
                                    </h3>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                                      {item.tempoSugerido}
                                    </span>
                                    <Badge color="gray" dot size="xs">
                                      {item.tagMapeada}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <a
                                href={item.rotaUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-[#0F4C3A] hover:text-white dark:hover:bg-[#0F4C3A] dark:hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors shrink-0"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Abrir Tela</span>
                              </a>
                            </div>

                            {/* O QUE MOSTRAR & CLICAR */}
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                <MousePointerClick className="w-3.5 h-3.5 text-[#0F4C3A] dark:text-emerald-400" />
                                <span>O que mostrar / clicar no compartilhamento:</span>
                              </div>
                              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                {item.oQueMostrar.map((guia, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-[#0F4C3A] dark:text-emerald-400 font-bold mt-0.5">•</span>
                                    <span>{guia}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* COLUNA 2 (DIREITA): COMO VOCÊ VAI FALAR & ARGUMENTO-CHAVE */}
                          <div className="space-y-3.5">
                            {/* O QUE FALAR (SCRIPT FALADO NA VOZ DO LUCAS) */}
                            <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50 space-y-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0F4C3A] dark:text-emerald-400">
                                <MessageSquareQuote className="w-3.5 h-3.5" />
                                <span>Como você vai falar (Direto ao ponto):</span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic font-normal">
                                {item.oQueFalar}
                              </p>
                            </div>

                            {/* ARGUMENTO DE OURO / ENCHANTMENT */}
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 shadow-2xs">
                              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="font-semibold text-emerald-950 dark:text-emerald-100">Argumento-Chave: </strong>
                                <span>{item.argumentoDeOuro}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DICA DE OURO DO APRESENTADOR */}
      <div className="bg-[#0F4C3A] text-white p-6 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-300" />
          <h3 className="text-base font-bold">Dicas Finais pro Lucas brilhar na Call com a Thays</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-emerald-100/90 pt-1">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-1">1. Foco em Valor & Decisão:</strong>
            Deixe claro que o SEIA V2 resolve as dores do analista (menos cliques, sem ruído) e do gestor (visibilidade e relatórios rápidos).
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-1">2. Mostre o Design System:</strong>
            Mostre a página do Design System para ela ver que o projeto tem sustentação e governança visual profissional.
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-1">3. Passe segurança total:</strong>
            Todas as telas estão vivas no link oficial (`inema.acto.com.br`). Se ela pedir pra ver qualquer detalhe, abra na hora!
          </div>
        </div>
      </div>
    </div>
  );
};
