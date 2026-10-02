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
    titulo: 'Abertura & Conexão com o Trabalho do Tales',
    subtitulo: 'Conversa direta: alinhar a parceria sem perder tempo passando tela por tela.',
    tempoTotal: '1:30 min',
    cor: '#0F4C3A',
    itens: [
      {
        id: 'abertura-ux-tales',
        titulo: 'Alinhamento Inicial: Como vamos trabalhar juntos',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Início & Alinhamento',
        oQueFalar:
          '“Fala Tales, tudo bem? Vi seu e-mail sobre a revisão que vocês da COTIC estão fazendo nas telas antigas do Inema, achei excelente.\n\nPra gente não perder tempo e nem ficar naquela reunião chata passando tela por tela, eu queria te mostrar a base que a gente montou aqui no SEIA V2.\n\nA ideia é simples: a gente padronizou o visual, os componentes e o jeito que as páginas funcionam. Assim, conforme você for revisando as telas antigas aí, você já sabe exatamente o que a gente tem pronto pra colocar no ar, sem ter que inventar tudo do zero.\n\nVou puxar a tela aqui pra você ver.”',
        oQueMostrar: [
          'Compartilhar a tela já no sistema: inema.acto.com.br/?rota=seia-v2.',
          'Mostrar a navegação limpa e o visual geral sóbrio.',
          'Deixar claro que o objetivo é somar forças com o trabalho que ele já está fazendo.',
        ],
        argumentoDeOuro:
          'A gente não precisa criar tela do zero: tudo que o Tales desenhar na revisão entra direto nessa estrutura.',
      },
    ],
  },
  {
    id: 'bloco-2-design-system',
    numero: '02',
    titulo: 'O Design System (Visual Padronizado)',
    subtitulo: 'Cores oficiais do Inema, componentes prontos e mais espaço útil na tela.',
    tempoTotal: '3:00 min',
    cor: '#1b5e20',
    itens: [
      {
        id: 'ds-fundacoes-tokens',
        titulo: 'Cores Oficiais, Menos Espaço Desperdiçado e Modo Escuro',
        tempoSugerido: '3:00 min',
        rotaUrl: '/?rota=seia-v2&tela=design-system',
        tagMapeada: 'Design System',
        oQueFalar:
          '“A primeira coisa é o nosso Design System. Deixamos tudo padronizado num catálogo só:\n\n1. As cores usam o verde oficial do Inema, sem inventar moda ou colocar cor aleatória.\n2. Os campos e botões são mais compactos. No sistema antigo sobra espaço em branco pra todo lado e o analista tem que ficar rolando a página toda hora. Aqui cabe muito mais informação na tela sem ficar apertado.\n3. E já tem o modo escuro funcionando certinho pra quem passa o dia inteiro analisando processo não cansar a vista.\n\nTudo que a gente precisa de botão, campo de busca, caixas de seleção e avisos já tá pronto e catalogado aqui.”',
        oQueMostrar: [
          'Abrir a tela do Design System (/tela=design-system).',
          'Passar rapidamente pelos botões, campos de texto e tags de status.',
          'Alternar para o Modo Escuro no topo da tela e voltar para o claro para mostrar que funciona liso.',
        ],
        argumentoDeOuro:
          'Tudo que o Tales pensar em termos visuais já tem um bloco correspondente pronto pra gente usar.',
      },
    ],
  },
  {
    id: 'bloco-3-arquetipos-interacao',
    numero: '03',
    titulo: 'Os 3 Tipos de Tela que Resolvem o Sistema',
    subtitulo: 'Tabelas práticas, formulários em etapas e painel inicial limpo.',
    tempoTotal: '4:30 min',
    cor: '#004d40',
    itens: [
      {
        id: 'arquetipo-pautas-tabelas',
        titulo: '1. Tabelas & Pautas (Busca Rápida e Barra Lateral)',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=pauta-area',
        tagMapeada: 'Pautas de Processos',
        oQueFalar:
          '“Nas tabelas e pautas do dia a dia, onde o técnico passa a maior parte do tempo:\n\nO analista digita e a busca já filtra na hora, sem recarregar nada. Os filtros mostram fácil o que tá atrasado ou no prazo com cores bem diretas.\n\nE o principal: quando clica pra ver os detalhes de um processo, em vez de abrir aquele popup chato que tampa a tela toda ou jogar pra outra página, abre uma barra lateral. O técnico vê o que precisa e não perde onde ele tava na lista.”',
        oQueMostrar: [
          'Abrir a Pauta da Área (/tela=pauta-area).',
          'Digitar na busca para mostrar a resposta imediata.',
          'Mostrar as cores claras de status e prazos.',
        ],
        argumentoDeOuro:
          'Chega de popup travando a tela: o analista resolve o processo sem perder a fila de trabalho.',
      },
      {
        id: 'arquetipo-formularios-wizard',
        titulo: '2. Formulários em Etapas (Passo a Passo Simples)',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=formulario',
        tagMapeada: 'Formulários & Requerimento',
        oQueFalar:
          '“Nos formulários, o problema clássico do Inema antigo são aquelas páginas infinitas com 80 campos jogados de uma vez só, que ninguém aguenta preencher.\n\nAqui a gente quebrou em etapas simples: Passo 1, 2, 3. O usuário sabe exatamente onde tá, o que falta preencher, salva rascunho se precisar e não perde o que já digitou. Fica muito mais leve e evita erro.”',
        oQueMostrar: [
          'Abrir o Requerimento Unificado (/tela=formulario) ou Dispensa (/tela=ansla-dispensa).',
          'Avançar de uma etapa pra outra mostrando a barra de passos no topo.',
          'Mostrar os blocos organizados e fáceis de entender.',
        ],
        argumentoDeOuro:
          'Em vez de assustar o usuário com um formulário gigante, a gente guia ele passo a passo.',
      },
      {
        id: 'arquetipo-dashboards-kpis',
        titulo: '3. Painel Inicial (Métricas Diretas ao Ponto)',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Painel Inicial',
        oQueFalar:
          '“E no painel inicial, deixamos bem limpo: os números mais importantes ficam logo no topo — o que tem de novo, o que tá vencendo e o que tá pendente.\n\nSem poluição visual, sem ilustrações ou caixas coloridas sem sentido. O analista bate o olho e já sabe o que tem que priorizar no dia.”',
        oQueMostrar: [
          'Voltar pra tela inicial (/tela=inicio).',
          'Mostrar os números principais e os atalhos rápidos.',
        ],
        argumentoDeOuro:
          'Interface feita pra trabalhar rápido: bateu o olho, já sabe o que precisa fazer.',
      },
    ],
  },
  {
    id: 'bloco-4-handover-parceria',
    numero: '04',
    titulo: 'Fechamento & Como Vamos Tocar',
    subtitulo: 'Combinar a dinâmica: o Tales desenha e a gente sobe direto no SEIA V2.',
    tempoTotal: '2:00 min',
    cor: '#0F4C3A',
    itens: [
      {
        id: 'parceria-fluxo-continuo',
        titulo: 'Próximos Passos: O fluxo de trabalho entre vocês',
        tempoSugerido: '2:00 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Fechamento & Parceria',
        oQueFalar:
          '“Basicamente é isso, Tales. Essa base já tá toda de pé e funcionando no link oficial.\n\nO que eu queria combinar com você é: conforme você e o pessoal da COTIC forem revisando as telas do sistema antigo, vocês não precisam se preocupar em inventar componentes do zero.\n\nVocê me passa o desenho do fluxo como vocês acharem melhor, e eu já vou montando e colocando pra rodar usando esses blocos prontos.\n\nComo fica melhor pra você? A gente combina por partes conforme você for terminando?”',
        oQueMostrar: [
          'Deixar a tela na página inicial ou no Design System.',
          'Ouvir como o Tales prefere tocar e combinar a dinâmica de entrega.',
        ],
        argumentoDeOuro:
          'Você desenha a solução das telas antigas, e a gente sobe direto pro sistema sem burocracia.',
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
