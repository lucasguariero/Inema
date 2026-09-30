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
    id: 'bloco-1-visao-geral',
    numero: '01',
    titulo: 'Visão Executiva & Propósito do SEIA V2',
    subtitulo: 'Introdução, contextualização da modernização e o novo Shell institucional.',
    tempoTotal: '4 min',
    cor: '#0F4C3A',
    itens: [
      {
        id: 'abertura-contexto',
        titulo: 'Abertura & Posicionamento do Projeto',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Início / Dashboard',
        oQueFalar:
          '“Fala Thays! Tudo bem? Preparei nossa call pra gente repassar em detalhes tudo o que estruturamos pro SEIA V2. Nosso foco principal aqui foi transformar a experiência do sistema: sair de uma interface sobrecarregada e pesada do legado pra uma plataforma fluida, limpa e padronizada. Cada detalhe que você vai ver foi pensado pra dar autonomia pro analista do Inema e previsibilidade pro cidadão, mantendo 100% da segurança jurídica e normativa do órgão.”',
        oQueMostrar: [
          'Mostrar a topbar verde institucional (100% de largura) com a busca rápida centralizada.',
          'Demonstrar a logo oficial do SEIA e a transição limpa para o ícone quando a sidebar é recolhida.',
          'Explicar que o dark mode neutro foi implementado nativamente para analistas que trabalham muitas horas seguidas.',
        ],
        argumentoDeOuro:
          'O SEIA V2 não é só um "redesenho visual": é uma reformulação na arquitetura de uso, reduzindo o tempo de clique e a curva de aprendizado dos técnicos.',
      },
      {
        id: 'novo-shell-navegacao',
        titulo: 'O Novo Shell de Navegação (Zero Ruído)',
        tempoSugerido: '2:30 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Sidebar & Shell',
        oQueFalar:
          '“Thays, dá uma olhada na navegação lateral. Um dos maiores problemas do sistema antigo era aquela sidebar infinita com dezenas de itens soltos que poluíam a tela. No SEIA V2, estruturamos um comportamento inteligente: as seções principais ficam agrupadas, apenas um módulo abre por vez com transição suave, e o analista tem um campo de busca instantânea do menu no topo da sidebar. Se recolher, ela vira uma barra de acesso rápido super compacta.”',
        oQueMostrar: [
          'Abrir e fechar agrupamentos na sidebar (mostrando que apenas 1 fica aberto por vez).',
          'Digitar no campo "Filtrar menu..." (ex: digitar "CERH" ou "Fauna") para demonstrar o filtro em tempo real.',
          'Clicar no botão de recolher a sidebar (ícone compacto) e passar o mouse nos itens para ver os tooltips.',
        ],
        argumentoDeOuro:
          'Apenas 1 agrupamento aberto por vez elimina a rolagem vertical desnecessária e mantém o foco mental do usuário no fluxo de trabalho.',
      },
    ],
  },
  {
    id: 'bloco-2-card-sorting',
    numero: '02',
    titulo: 'Card Sorting & Arquitetura de Informação',
    subtitulo: 'A categorização lógica baseada nos 20 módulos reais mapeados.',
    tempoTotal: '3 min',
    cor: '#1b5e20',
    itens: [
      {
        id: 'card-sorting-modulos',
        titulo: 'Organização dos 20 Módulos Reais do Sistema',
        tempoSugerido: '3 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Estrutura do Menu',
        oQueFalar:
          '“Pra definir essa arquitetura, nós fizemos um estudo profundo de Card Sorting confrontando o edital com a rotina real de uso do GLA e do SEIA. Mapeamos os 20 módulos ativos e organizamos em 4 pilares estratégicos muito claros: 1. Operação Ambiental (o coração do trabalho técnico: regulação, fiscalização, fauna e UCs); 2. Serviços e Receita (tudo o que é voltado ao cidadão e arrecadação/DAEs); 3. Gestão e Controle (relatórios, métricas de produtividade e auditoria); e 4. Configuração do Sistema. Nada ficou solto ou perdido.”',
        oQueMostrar: [
          'Apontar os 4 pilares na sidebar: Operação Ambiental, Serviços e Receita, Gestão e Controle, Configuração do Sistema.',
          'Mostrar como os módulos estão distribuídos dentro de cada pilar de forma coesa (ex: Regulação, Fiscalização, Gestão de Fauna, Biodiversidade).',
        ],
        argumentoDeOuro:
          'Nenhum módulo é genérico: todos os 20 cartões correspondem a telas reais que nós já prototipamos e conectamos na árvore de navegação.',
      },
    ],
  },
  {
    id: 'bloco-3-design-system',
    numero: '03',
    titulo: 'Design System Oficial INEMA (16 Seções Vivas)',
    subtitulo: 'Catálogo de componentes, tokens semânticos, acessibilidade e o Wizard institucional.',
    tempoTotal: '5 min',
    cor: '#004d40',
    itens: [
      {
        id: 'ds-catalogo-geral',
        titulo: 'Ambiente Autônomo de Documentação & Tokens',
        tempoSugerido: '2:30 min',
        rotaUrl: '/?rota=seia-v2&tela=design-system',
        tagMapeada: 'Design System Catálogo',
        oQueFalar:
          '“Agora quero te mostrar a base de tudo isso: o nosso Design System oficial do INEMA. Nós não criamos componentes soltos nem código descartável. Construímos um ambiente completo com 16 seções documentando desde as fundações (paleta institucional #0F4C3A, tipografia modular, contraste WCAG AA, espaçamentos em grid de 8pt) até componentes avançados como tabelas, cards com micro-gráficos e modais. Isso garante que qualquer novo módulo desenvolvido no futuro vai nascer idêntico ao padrão oficial.”',
        oQueMostrar: [
          'Acessar a rota do Design System (destacar que ele possui shell próprio, sem poluir com o menu operacional).',
          'Rolar pelas seções: Cores e tokens, Botões (variantes, tamanhos, loading), Badges semânticos e Cards de KPIs.',
          'Demonstrar a densidade compacta inspirada no Filament (36px/32px), que aproveita ao máximo a área útil da tela.',
        ],
        argumentoDeOuro:
          'Eliminamos qualquer risco de inconsistência visual. O Design System é a garantia de que o projeto escala com qualidade enterprise.',
      },
      {
        id: 'ds-wizard-stepper',
        titulo: 'O Stepper / Wizard Oficial com Chevron SVG',
        tempoSugerido: '2:30 min',
        rotaUrl: '/?rota=seia-v2&tela=design-system',
        tagMapeada: 'Wizard & Formulários',
        oQueFalar:
          '“Um destaque muito importante que quero te mostrar aqui no Design System é o nosso Wizard. Formulários ambientais são longos e cheios de etapas. Criamos o FilamentWizard com divisórias em chevron SVG institucional: o analista ou o requerente sempre sabe exatamente onde está, o que já concluiu e o que falta preencher, com validação de campos obrigatórios e salvamento de rascunho. Esse mesmo componente é a espinha dorsal de todos os requerimentos do sistema.”',
        oQueMostrar: [
          'Ir até a seção "Wizard" no Design System e interagir com as etapas.',
          'Destacar os estados do stepper: etapa concluída (check), etapa ativa (verde institucional) e etapas futuras.',
          'Mostrar a responsividade do stepper e a limpeza visual.',
        ],
        argumentoDeOuro:
          'Zero improviso: o Wizard do SEIA V2 guia o usuário passo a passo com feedback visual instantâneo e conformidade total com as normas do INEMA.',
      },
    ],
  },
  {
    id: 'bloco-4-telas-core',
    numero: '04',
    titulo: 'Repasse das Telas Principais do Core',
    subtitulo: 'Dashboard Gerencial, Pauta de Processos, Requerimento Unificado e Fiscalização.',
    tempoTotal: '8 min',
    cor: '#0f4c3a',
    itens: [
      {
        id: 'core-dashboard',
        titulo: 'Dashboard Gerencial de Regulação',
        tempoSugerido: '2 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Dashboard Gerencial',
        oQueFalar:
          '“Vamos pras telas de produto! Começando pela Dashboard Gerencial. Aqui o gestor e os técnicos têm a visão consolidada em tempo real: total de processos tramitando, taxa de deferimento, alertas de SLA e gráficos de distribuição por tipologia e bacia hidrográfica. Tudo construído com cards interativos de KPI e micro-sparklines de tendência.”',
        oQueMostrar: [
          'Passar o mouse sobre os cards de KPI (Processos em Análise, SLA Médio, Deferimentos).',
          'Mostrar a hierarquia visual clara, sem poluição de cores e com contraste impecável.',
        ],
        argumentoDeOuro:
          'Permite ao diretor e ao coordenador tomar decisões rápidas sem precisar gerar relatórios manuais em planilhas.',
      },
      {
        id: 'core-pauta-tabela',
        titulo: 'Pauta Operacional de Processos (Tabela Canônica)',
        tempoSugerido: '2 min',
        rotaUrl: '/?rota=seia-v2&tela=tabela',
        tagMapeada: 'Pauta de Processos',
        oQueFalar:
          '“Essa é a tela onde o analista passa 90% do dia: a Pauta de Processos. Implementamos a tabela canônica com busca rápida debounced, filtros dinâmicos por status, município e técnico responsável, badges semânticos de SLA (em dia, atenção e crítico) e gaveta lateral de ações rápidas. O analista consegue visualizar o histórico sem perder o contexto da listagem.”',
        oQueMostrar: [
          'Filtrar por status ou digitar no campo de busca.',
          'Destacar a formatação dos números SEI e protocolos em fonte monoespacial limpa.',
          'Mostrar a paginação fluida e as ações por linha.',
        ],
        argumentoDeOuro:
          'Organização cirúrgica dos dados: as informações cruciais (requerente, tipologia, SLA e status) estão visíveis de imediato.',
      },
      {
        id: 'core-requerimento-unificado',
        titulo: 'Requerimento Ambiental Unificado (Wizard Completo)',
        tempoSugerido: '2 min',
        rotaUrl: '/?rota=seia-v2&tela=formulario',
        tagMapeada: 'Requerimento Unificado',
        oQueFalar:
          '“Agora o Requerimento Unificado. Em vez daquele formulário monolítico confuso, dividimos o fluxo em 4 etapas lógicas: Identificação do Empreendimento, Tipologia e Atividades, Documentação & ARTs e Resumo Conclusivo com cálculo de taxa. Note a barra oficial do formulário no topo com o botão de voltar à pauta e salvar rascunho.”',
        oQueMostrar: [
          'Avançar pelas etapas do Wizard usando o botão "Avançar Etapa".',
          'Mostrar os campos agrupados em `Section` com ícones institucionais e validação suave nos inputs.',
          'Demonstrar o resumo final antes do protocolo.',
        ],
        argumentoDeOuro:
          'Reduz drasticamente o índice de erros e pendências no momento da entrada do requerimento.',
      },
      {
        id: 'core-fiscalizacao-daes',
        titulo: 'Fiscalização (Denúncias/Emergências) & Financeiro DAE',
        tempoSugerido: '2 min',
        rotaUrl: '/?rota=seia-v2&tela=seia-daes',
        tagMapeada: 'Fiscalização & DAE',
        oQueFalar:
          '“Cobrimos também toda a esteira de Fiscalização — tanto os fluxos internos de atendimento técnico quanto o formulário público do cidadão pra registrar denúncias e emergências ambientais com upload de fotos e geolocalização. E no módulo Financeiro, unificamos a emissão e baixa de DAEs com status de compensação bancária em tempo real.”',
        oQueMostrar: [
          'Mostrar a pauta financeira de DAEs e os status de pagamento.',
          'Mencionar a integração dos canais cidadão vs técnico interno na fiscalização.',
        ],
        argumentoDeOuro:
          'Rastreabilidade total desde a denúncia na ponta até a autuação e a arrecadação das taxas e multas.',
      },
    ],
  },
  {
    id: 'bloco-5-telas-prioritarias',
    numero: '05',
    titulo: 'Novos Módulos Prioritários do Legado GLA',
    subtitulo: 'As 9 telas-chave do GLA adaptadas com excelência para o padrão SEIA V2.',
    tempoTotal: '10 min',
    cor: '#00695c',
    itens: [
      {
        id: 'prio-cerh',
        titulo: 'CERH — Recursos Hídricos & Outorga de Água',
        tempoSugerido: '2 min',
        rotaUrl: '/?rota=seia-v2&tela=cerh',
        tagMapeada: 'Recursos Hídricos / CERH',
        oQueFalar:
          '“Thays, fizemos um trabalho cirúrgico inspecionando o GLA legado e trouxemos os 9 módulos mais estratégicos pro padrão SEIA V2. O primeiro é o CERH: controle de captações subterrâneas em poços tubulares, captações superficiais em rios, lançamentos de efluentes e pedidos de outorga. Tem o formulário oficial F-DIPRE-CERH-01 estruturado com enquadramento hidrográfico por RPGA (São Francisco, Paraguaçu, etc.) e vazões calculadas em m³/h.”',
        oQueMostrar: [
          'Mostrar a pauta com os 4 KPIs de volume outorgado e poços.',
          'Clicar em "+ Nova Declaração / Outorga" pra exibir o formulário F-DIPRE-CERH-01 no padrão Wizard.',
          'Destacar a precisão técnica dos campos de bacia hidrográfica e coordenadas SIRGAS 2000.',
        ],
        argumentoDeOuro:
          'O CERH é um dos módulos mais cobrados pelo setor produtivo (agro e indústria). O formulário agora é 100% intuitivo.',
      },
      {
        id: 'prio-dtrp',
        titulo: 'DTRP — Transporte de Resíduos Perigosos',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=dtrp',
        tagMapeada: 'Transporte DTRP',
        oQueFalar:
          '“O DTRP é essencial pra fiscalização da DIFIS: controle de manifestos de transporte de cargas perigosas (produtos químicos, solventes, óleos lubrificantes usados). Incluímos a validação de código ONU, certificado CIPP do tanque, condutor com habilitação MOPP e emissão do manifesto com QR Code pra leitura rápida em blitz na rodovia.”',
        oQueMostrar: [
          'Mostrar a listagem de manifestos ativos e cargas em trânsito.',
          'Clicar em "+ Novo Manifesto DTRP" pra mostrar o formulário F-DIFIS-DTRP-045.',
          'Apontar os detalhes de rota rodoviária e apólice de seguro ambiental.',
        ],
        argumentoDeOuro:
          'Segurança para a fiscalização em campo: a polícia ambiental e os fiscais validam o manifesto em segundos pelo QR Code.',
      },
      {
        id: 'prio-crf',
        titulo: 'Reposição Florestal Obrigatória & Créditos (CRF)',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=reposicao-florestal',
        tagMapeada: 'Reposição Florestal CRF',
        oQueFalar:
          '“Pra área de biodiversidade e florestas, implementamos a Reposição Florestal Obrigatória ligada às Autorizações de Supressão Vegetal (ASV). O sistema faz a gestão da conta corrente de créditos florestais em metros estéreos (m³ st), acompanhando o débito do empreendedor e as opções de compensação por plantio próprio ou compra de créditos de fomento.”',
        oQueMostrar: [
          'Mostrar o painel de saldo de créditos florestais (45.200 m³ st) e taxa de adimplência.',
          'Destacar o extrato de débitos vs créditos compensados por processo.',
        ],
        argumentoDeOuro:
          'Fecha o ciclo de compensação ambiental do Estado com total transparência e extrato auditável.',
      },
      {
        id: 'prio-cnd',
        titulo: 'Certidão Negativa de Débito Ambiental (CND)',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=certidao-debito',
        tagMapeada: 'Certidão de Débito CND',
        oQueFalar:
          '“A CND é uma das maiores demandas de balcão do Inema. Criamos uma tela pública e interna onde qualquer cidadão ou empresa digita o CNPJ e, se estiver regular, o sistema gera a certidão na hora em PDF assinado com código de autenticidade e chave criptográfica sha256. Zero fila física, emissão instantânea.”',
        oQueMostrar: [
          'Digitar um CNPJ de teste ou clicar em "Emitir Certidão".',
          'Mostrar a prévia do documento oficial emitido com validade de 90 dias, hash de autenticidade e carimbo oficial.',
        ],
        argumentoDeOuro:
          'Desafoga imediatamente o atendimento do Inema: desburocratização real para empresas em licitações e financiamentos.',
      },
      {
        id: 'prio-fauna-cras',
        titulo: 'CRAS — Gestão de Fauna Silvestre & Prontuários',
        tempoSugerido: '1:30 min',
        rotaUrl: '/?rota=seia-v2&tela=cras',
        tagMapeada: 'CRAS Fauna',
        oQueFalar:
          '“Na gestão de fauna, trouxemos o Centro de Triagem de Animais Silvestres (CRAS). A tela monitora animais em quarentena, taxas de reabilitação e ocupação de recintos. Ao clicar no animal, abre a ficha clínica veterinária completa com identificação por microchip/anilha, procedência de resgate e aptidão pra soltura suave ou reintrodução.”',
        oQueMostrar: [
          'Mostrar os KPIs de fauna (animais em cuidados, solturas realizadas).',
          'Clicar no botão "Prontuário" na linha da Arara-azul-de-lear para abrir o modal de prontuário clínico detalhado.',
        ],
        argumentoDeOuro:
          'Atende a uma área muito sensível e nobre do Inema, com prontuário clínico individualizado e gestão de solturas.',
      },
      {
        id: 'prio-demais-telas',
        titulo: 'ANSLA, Parcelamento de Débitos, CEFIR & SISPASS',
        tempoSugerido: '2 min',
        rotaUrl: '/?rota=seia-v2&tela=parcelamento',
        tagMapeada: 'ANSLA, Parcelamento, CEFIR, SISPASS',
        oQueFalar:
          '“E pra fechar o pacote completo de atendimento ao legado, temos mais 4 telas totalmente funcionais: 1. ANSLA (Declaração de Não-Sujeição ao licenciamento com questionário automatizado); 2. Parcelamento de Débitos (com simulador financeiro de parcelas e geração de DAE de entrada); 3. CEFIR/CAR (cadastro de imóveis rurais e reserva legal); e 4. SISPASS (gestão de criadores amadoristas de passeriformes com anilhas cadastradas).”',
        oQueMostrar: [
          'Abrir a tela de Parcelamento e mostrar o simulador com cálculo de parcelas e desconto de juros.',
          'Mencionar a cobertura completa de ponta a ponta dos módulos regulatórios do órgão.',
        ],
        argumentoDeOuro:
          'Mostra que a plataforma não tem "gaps": todo o ecossistema do Inema foi mapeado e contemplado no mesmo padrão de excelência.',
      },
    ],
  },
  {
    id: 'bloco-6-fechamento',
    numero: '06',
    titulo: 'Fechamento & Próximos Passos',
    subtitulo: 'Homologação, validação com os analistas e próximos marcos.',
    tempoTotal: '3 min',
    cor: '#0F4C3A',
    itens: [
      {
        id: 'fechamento-alinhamento',
        titulo: 'Conclusão & Abertura pra Feedbacks da Thays',
        tempoSugerido: '3 min',
        rotaUrl: '/?rota=seia-v2&tela=inicio',
        tagMapeada: 'Conclusão & Handover',
        oQueFalar:
          '“Thays, esse é o ecossistema consolidado do SEIA V2 até aqui. Temos 21 telas de produto navegáveis, todas construídas sobre o mesmo Design System inviolável, com build validado e deploy contínuo ativo no link oficial inema.acto.com.br. Queria ouvir tuas impressões e alinhar com você os próximos passos: quais analistas você quer que validem cada fluxo primeiro e onde a gente prioriza os próximos ajustes!”',
        oQueMostrar: [
          'Voltar para a tela inicial do SEIA V2.',
          'Deixar a tela aberta na Dashboard Gerencial ou no Design System para responder a perguntas.',
        ],
        argumentoDeOuro:
          'Entrega completa, consistente e pronta pra homologação. A liderança tem em mãos um produto pronto pra encantar a diretoria do Inema.',
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
          { label: 'Início', route: 'inicio' },
          { label: 'Roteiro de Apresentação Executiva (Call Thays)' },
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
                Apresentação Líder de Projeto • <strong>Thays</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-2">
              Roteiro de Apresentação — SEIA V2
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Guia interativo passo a passo para você apresentar na sua voz, marcar os checks em tempo real e abrir as telas em 1 clique durante o compartilhamento de tela.
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
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          {/* CHECKBOX & TÍTULO */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => toggleCheck(item.id)}
                              className="mt-1 shrink-0 cursor-pointer focus:outline-none"
                              aria-label={`Marcar ${item.titulo} como concluído`}
                            >
                              {isChecked ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-slate-500 transition-colors" />
                              )}
                            </button>

                            <div className="space-y-3 flex-1 min-w-0">
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

                              {/* O QUE FALAR (SCRIPT FALADO NA VOZ DO LUCAS) */}
                              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0F4C3A] dark:text-emerald-400">
                                  <MessageSquareQuote className="w-3.5 h-3.5" />
                                  <span>Como você vai falar (Direto ao ponto):</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic font-normal">
                                  {item.oQueFalar}
                                </p>
                              </div>

                              {/* O QUE MOSTRAR & CLICAR */}
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                  <MousePointerClick className="w-3.5 h-3.5" />
                                  <span>O que mostrar / clicar no compartilhamento:</span>
                                </div>
                                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                  {item.oQueMostrar.map((guia, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-[#0F4C3A] dark:text-emerald-400 font-bold mt-0.5">•</span>
                                      <span>{guia}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* ARGUMENTO DE OURO / ENCHANTMENT */}
                              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200">
                                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="font-semibold text-emerald-950 dark:text-emerald-100">Argumento-Chave: </strong>
                                  <span>{item.argumentoDeOuro}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* BOTÃO DE ABRIR TELA EM 1 CLIQUE */}
                          <div className="lg:pl-4 shrink-0 flex items-center">
                            <a
                              href={item.rotaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-[#0F4C3A] hover:text-white dark:hover:bg-[#0F4C3A] dark:hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Abrir Tela</span>
                            </a>
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
