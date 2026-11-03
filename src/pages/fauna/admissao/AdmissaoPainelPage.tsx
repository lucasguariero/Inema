import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Printer,
  Stethoscope,
  Activity,
  HeartCrack,
  Send,
  Eye,
  RefreshCw,
  Building2,
  TreePine,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ClipboardCheck,
  Download,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomSelect } from '@/components/seia-v2/CustomSelect';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { cn } from '@/lib/utils';
import {
  MOCK_TERMOS_RECEBIMENTO,
  MOCK_TRIAGENS,
  MOCK_AVALIACOES_CLINICAS,
  MOCK_EVOLUCOES_CLINICAS,
  MOCK_REGISTROS_OBITO,
  MOCK_TERMOS_SOLTURA,
  subscribeDadosFauna,
  getFaunaDataVersion,
} from '@/data/faunaAdmissaoMock';
import {
  MOCK_ANIMAIS,
  MOCK_UNIDADES,
} from '@/data/faunaMock';
import { TermoRecebimentoNovoPage } from './TermoRecebimentoNovoPage';
import { TermoRecebimentoDocumento } from './TermoRecebimentoDocumento';
import { TriagemMarcacaoPage } from './TriagemMarcacaoPage';
import { AvaliacaoClinicaPage } from './AvaliacaoClinicaPage';
import { EvolucaoClinicaPage } from './EvolucaoClinicaPage';
import { RegistroObitoPage } from './RegistroObitoPage';
import { TermoSolturaEncerramentoPage } from './TermoSolturaEncerramentoPage';

export type SubViewType =
  | 'painel'
  | 'novo-tr'
  | 'doc001'
  | 'triagem'
  | 'avaliacao-clinica'
  | 'evolucao-clinica'
  | 'registro-obito'
  | 'termo-soltura';

export const SUBVIEWS_VALIDAS: SubViewType[] = [
  'painel',
  'novo-tr',
  'doc001',
  'triagem',
  'avaliacao-clinica',
  'evolucao-clinica',
  'registro-obito',
  'termo-soltura',
];

export type AbaPainel = 'trs' | 'triagem' | 'clinica' | 'saidas' | 'siscetas';

export const ABAS_VALIDAS: AbaPainel[] = ['trs', 'triagem', 'clinica', 'saidas', 'siscetas'];

export type PerfilAcessoFauna = 'gestor' | 'veterinario' | 'biologo' | 'recepcao';

export const PERFIS_VALIDOS: PerfilAcessoFauna[] = ['gestor', 'veterinario', 'biologo', 'recepcao'];

export const PERFIS_FAUNA: { id: PerfilAcessoFauna; label: string; desc: string; papel: string }[] = [
  { id: 'gestor', label: 'Gestor de Fauna', desc: 'Acesso irrestrito a todas as etapas, auditoria e SISCETAS', papel: 'Visão Plena' },
  { id: 'veterinario', label: 'Médico Veterinário', desc: 'Foco em Avaliação Clínica, Evoluções Diárias e Alta Médica', papel: 'Clínica & Evolução' },
  { id: 'biologo', label: 'Biólogo', desc: 'Foco em Determinação Taxonômica, Anilhamento e Microchips', papel: 'Triagem & Biometria' },
  { id: 'recepcao', label: 'Agente de Recepção', desc: 'Foco em Emissão de TR, Cadastro de Entregador e Apreensão', papel: 'Recepção & TR' },
];

interface TelaAcessoRestritoProps {
  perfil: PerfilAcessoFauna;
  subView: string;
  motivo: string;
  onVoltar: () => void;
  onTrocarPerfil: (p: PerfilAcessoFauna) => void;
}

const TelaAcessoRestrito: React.FC<TelaAcessoRestritoProps> = ({
  perfil,
  subView,
  motivo,
  onVoltar,
  onTrocarPerfil,
}) => {
  return (
    <div
      data-testid="bloqueio-perfil-acesso-direto"
      className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900 shadow-sm text-center space-y-4"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-[11px] font-bold tracking-wide uppercase">
        Simulação de Perfis (DEMO) · Acesso Restrito
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Acesso Operacional Não Autorizado por URL Direta
      </h2>
      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
        {motivo}
      </p>
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-[11px] text-slate-500 max-w-md mx-auto">
        Perfil ativo na sessão demonstrativa: <strong className="text-slate-800 dark:text-slate-200">{perfil}</strong> | Tela solicitada: <code className="font-mono">{subView}</code>
      </div>
      <div className="pt-3 flex justify-center gap-3">
        <Button
          variant="outline"
          onClick={onVoltar}
          className="text-xs font-semibold"
        >
          Voltar ao Painel Geral
        </Button>
        <Button
          onClick={() => onTrocarPerfil('gestor')}
          className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold"
        >
          Alternar para Gestor (Visão Plena)
        </Button>
      </div>
    </div>
  );
};

interface AdmissaoPainelPageProps {
  onNavigate?: (route: string) => void;
}

export const AdmissaoPainelPage: React.FC<AdmissaoPainelPageProps> = ({ onNavigate }) => {
  // Controle de versão reativa dos dados de fauna
  const [dataVersion, setDataVersion] = useState<number>(() => getFaunaDataVersion());

  // Subscrição reativa para atualizar KPIs e tabelas imediatamente ao mutar dados
  useEffect(() => {
    const unsubscribe = subscribeDadosFauna(() => {
      setDataVersion(getFaunaDataVersion());
    });
    const handleCustomEvent = () => {
      setDataVersion((v) => v + 1);
    };
    window.addEventListener('fauna-data-updated', handleCustomEvent);
    return () => {
      unsubscribe();
      window.removeEventListener('fauna-data-updated', handleCustomEvent);
    };
  }, []);

  const [subView, setSubView] = useState<SubViewType>(() => {
    if (typeof window !== 'undefined') {
      const s = new URLSearchParams(window.location.search).get('sub') as SubViewType;
      if (s && SUBVIEWS_VALIDAS.includes(s)) return s;
    }
    return 'painel';
  });

  const [selectedTrId, setSelectedTrId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const tr = new URLSearchParams(window.location.search).get('tr-id');
      if (tr) return tr;
    }
    return 'tr-001';
  });

  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const ani = new URLSearchParams(window.location.search).get('animal-id');
      if (ani) return ani;
    }
    return 'ani-002';
  });

  const [abaAtiva, setAbaAtiva] = useState<AbaPainel>(() => {
    if (typeof window !== 'undefined') {
      const a = new URLSearchParams(window.location.search).get('aba') as AbaPainel;
      if (a && ABAS_VALIDAS.includes(a)) return a;
    }
    return 'trs';
  });

  const [perfilAtivo, setPerfilAtivo] = useState<PerfilAcessoFauna>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('perfil') as PerfilAcessoFauna;
      if (p && PERFIS_VALIDOS.includes(p)) {
        return p;
      }
    }
    return 'gestor';
  });

  // Função centralizada para navegação de sub-view com persistência e histórico de URL
  const navegarParaSubView = (
    novaSub: SubViewType,
    params?: { trId?: string; animalId?: string; aba?: AbaPainel }
  ) => {
    setSubView(novaSub);
    if (params?.trId) setSelectedTrId(params.trId);
    if (params?.animalId) setSelectedAnimalId(params.animalId);
    if (params?.aba) setAbaAtiva(params.aba);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (novaSub === 'painel') {
        url.searchParams.delete('sub');
        url.searchParams.delete('tr-id');
        url.searchParams.delete('animal-id');
      } else {
        url.searchParams.set('sub', novaSub);
        if (params?.trId) url.searchParams.set('tr-id', params.trId);
        if (params?.animalId) url.searchParams.set('animal-id', params.animalId);
      }
      if (params?.aba) {
        url.searchParams.set('aba', params.aba);
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  // Alternar abas do painel sincronizando a URL
  const mudarAba = (novaAba: AbaPainel) => {
    setAbaAtiva(novaAba);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('aba', novaAba);
      window.history.pushState({}, '', url.toString());
    }
  };

  // Alternar perfil de acesso demonstrativo e orientar a visão sem poluir o histórico
  const mudarPerfil = (novoPerfil: PerfilAcessoFauna) => {
    setPerfilAtivo(novoPerfil);
    let targetAba = abaAtiva;
    if (novoPerfil === 'veterinario') {
      targetAba = 'clinica';
    } else if (novoPerfil === 'biologo') {
      targetAba = 'triagem';
    } else if (novoPerfil === 'recepcao') {
      targetAba = 'trs';
    }
    setAbaAtiva(targetAba);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('perfil', novoPerfil);
      url.searchParams.set('aba', targetAba);
      // Utiliza replaceState para evitar entradas redundantes no histórico em uma única troca de perfil
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Sincronização reativa com histórico do navegador e parâmetros de URL
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        // Intercepta tentativa de retorno via histórico quando houver formulário não salvo
        if ((window as any).__isFaunaFormDirty) {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('sub', 'novo-tr');
          window.history.pushState({}, '', currentUrl.toString());
          window.dispatchEvent(new CustomEvent('fauna-solicitar-confirmacao-descarte'));
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const s = params.get('sub') as SubViewType;
        setSubView(s && SUBVIEWS_VALIDAS.includes(s) ? s : 'painel');
        const a = params.get('aba') as AbaPainel;
        setAbaAtiva(a && ABAS_VALIDAS.includes(a) ? a : 'trs');
        const tr = params.get('tr-id');
        if (tr) setSelectedTrId(tr);
        const ani = params.get('animal-id');
        if (ani) setSelectedAnimalId(ani);
        const p = params.get('perfil') as PerfilAcessoFauna;
        if (p && PERFIS_VALIDOS.includes(p)) {
          setPerfilAtivo(p);
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Filtros
  const [buscaTexto, setBuscaTexto] = useState<string>('');
  const [filtroUnidade, setFiltroUnidade] = useState<string>('todos');
  const [filtroFatoGerador, setFiltroFatoGerador] = useState<string>('todos');

  // SISCETAS Mock State (RNF-103, PPV-19: Simulação local demonstrativa sem envio federal)
  const [siscetasSimulando, setSiscetasSimulando] = useState<boolean>(false);
  const [siscetasStatusGeral, setSiscetasStatusGeral] = useState<string>(
    'Simulação Local / Fila Offline (PPV-19)'
  );
  const [siscetasLogs, setSiscetasLogs] = useState<
    { id: string; dataHora: string; evento: string; status: 'Sucesso' | 'Falha' | 'Fila Offline'; mensagem: string }[]
  >([
    {
      id: 'log-01',
      dataHora: '12/10/2026 14:36:10',
      evento: 'Entrada de Animais Silvestres (TR)',
      status: 'Fila Offline',
      mensagem:
        'Lote de 150 aves retido em contingência de fila local demonstrativa aguardando credenciais e homologação técnica do SISCETAS/IBAMA (PPV-19). Nenhuma transmissão externa realizada.',
    },
    {
      id: 'log-02',
      dataHora: '14/10/2026 09:16:00',
      evento: 'Entrada Unidade Regional (URCH-000.015)',
      status: 'Fila Offline',
      mensagem:
        'Entrada de espécime resgatado registrada em base estadual; sincronização federal retida em fila offline até conclusão de acordo formal com o IBAMA (PPV-19).',
    },
    {
      id: 'log-03',
      dataHora: '15/10/2026 11:05:22',
      evento: 'Triagem e Individualização (000.124/2026)',
      status: 'Fila Offline',
      mensagem:
        'Individualização e anilhamento AN-XPNH00089 retidos em contingência local aguardando homologação do webservice federal SISCETAS (PPV-19).',
    },
  ]);

  // Cálculos de KPIs reativos com dataVersion
  const kpis = useMemo(() => {
    const totalTrs = MOCK_TERMOS_RECEBIMENTO.length;
    const totalAnimaisRecebidos = MOCK_TERMOS_RECEBIMENTO.reduce((acc, tr) => acc + tr.quantidadeTotal, 0);
    const saldoPendenteTriagem = MOCK_TERMOS_RECEBIMENTO
      .filter((tr) => tr.tipoUnidade === 'CETAS')
      .reduce(
        (acc, tr) => acc + tr.animais.reduce((a, linha) => a + (linha.saldoPendenteTriagem ?? linha.quantidadeTotal), 0),
        0
      );
    const internadosClinica = MOCK_ANIMAIS.filter((a) => a.sufixoCl || a.status === 'Internado').length;
    const solturasDestinacoes = MOCK_TERMOS_SOLTURA.length;
    const obitos = MOCK_REGISTROS_OBITO.length;

    return {
      totalTrs,
      totalAnimaisRecebidos,
      saldoPendenteTriagem,
      internadosClinica,
      solturasDestinacoes,
      obitos,
    };
  }, [dataVersion]);

  // Filtragem de TRs reativa com dataVersion
  const trsFiltrados = useMemo(() => {
    return MOCK_TERMOS_RECEBIMENTO.filter((tr) => {
      const matchBusca =
        !buscaTexto ||
        tr.numeroTr.toLowerCase().includes(buscaTexto.toLowerCase()) ||
        tr.unidadeNome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
        tr.agenteNomeRazaoSocial.toLowerCase().includes(buscaTexto.toLowerCase()) ||
        tr.documentoApreensaoNumero?.toLowerCase().includes(buscaTexto.toLowerCase());

      const matchUnidade = filtroUnidade === 'todos' || tr.unidadeId === filtroUnidade;
      const matchFato = filtroFatoGerador === 'todos' || tr.fatoGerador === filtroFatoGerador;

      return matchBusca && matchUnidade && matchFato;
    });
  }, [buscaTexto, filtroUnidade, filtroFatoGerador, dataVersion]);

  // Simular Sincronização SISCETAS (Modo demonstrativo local)
  const handleSimularSiscetas = () => {
    setSiscetasSimulando(true);
    setTimeout(() => {
      setSiscetasSimulando(false);
      setSiscetasLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          dataHora: `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`,
          evento: 'Reprocessamento em Lote SISCETAS (Modo Demonstrativo Local / RNF-103, PPV-19)',
          status: 'Fila Offline',
          mensagem:
            'Simulação de contingência local executada. Os registros continuam armazenados em fila offline aguardando homologação do webservice federal SISCETAS (PPV-19). Nenhuma chamada externa enviada.',
        },
        ...prev,
      ]);
    }, 1200);
  };

  // Roteamento de Sub-views
  if (subView === 'novo-tr') {
    return (
      <TermoRecebimentoNovoPage
        onVoltar={() => navegarParaSubView('painel')}
        onTrGerado={(novoTr) => {
          navegarParaSubView('doc001', { trId: novoTr.id });
        }}
      />
    );
  }

  if (subView === 'doc001') {
    const termoObj = MOCK_TERMOS_RECEBIMENTO.find((t) => t.id === selectedTrId);
    if (!termoObj) {
      return (
        <div
          data-testid="doc001-nao-encontrado"
          className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-500">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Termo de Recebimento Não Encontrado
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            O identificador de TR <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">"{selectedTrId}"</span> informado na URL não corresponde a nenhum registro oficial ativo na base de dados demonstrativa.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Button
              onClick={() => navegarParaSubView('painel', { aba: 'trs' })}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold"
            >
              Voltar aos Termos de Recebimento
            </Button>
          </div>
        </div>
      );
    }
    return (
      <TermoRecebimentoDocumento
        termo={termoObj}
        onVoltar={() => navegarParaSubView('painel', { aba: 'trs' })}
      />
    );
  }

  if (subView === 'triagem') {
    if (perfilAtivo === 'recepcao') {
      return (
        <TelaAcessoRestrito
          perfil={perfilAtivo}
          subView="Triagem e Individualização (TL002)"
          motivo="O perfil demonstrativo 'Agente de Recepção' possui atribuição restrita à recepção, conferência de custódia e emissão do Termo de Recebimento (TR). Procedimentos de triagem taxonômica, biometria e marcação individualizada (TL002) são atribuições de Biólogos e Médicos Veterinários conforme RN-013 e RN-032."
          onVoltar={() => navegarParaSubView('painel', { aba: 'triagem' })}
          onTrocarPerfil={(p) => mudarPerfil(p)}
        />
      );
    }
    return (
      <TriagemMarcacaoPage
        trIdPreselecionado={selectedTrId}
        onVoltar={() => navegarParaSubView('painel')}
        onConcluirTriagem={(animalId, enc) => {
          navegarParaSubView('painel', {
            animalId,
            aba: enc === 'Internamento' ? 'clinica' : 'triagem',
          });
        }}
        onIrParaClinica={(animalId) => {
          navegarParaSubView('avaliacao-clinica', { animalId });
        }}
        onIrParaObito={(animalId) => {
          navegarParaSubView('registro-obito', { animalId });
        }}
      />
    );
  }

  if (subView === 'avaliacao-clinica') {
    if (perfilAtivo === 'recepcao' || perfilAtivo === 'biologo') {
      return (
        <TelaAcessoRestrito
          perfil={perfilAtivo}
          subView="Ficha de Avaliação Clínica (TL003)"
          motivo={`A Ficha de Avaliação Clínica Hospitalar (TL003) compreende anamnese, exame físico, diagnóstico nosológico e solicitação de exames, constituindo ato privativo de Médico Veterinário (Lei Federal nº 5.517/1968 e RN-022 do DR008). O perfil demonstrativo '${perfilAtivo === 'biologo' ? 'Biólogo' : 'Agente de Recepção'}' não possui autorização clínica para intervenções hospitalares.`}
          onVoltar={() => navegarParaSubView('painel', { aba: 'clinica' })}
          onTrocarPerfil={(p) => mudarPerfil(p)}
        />
      );
    }
    return (
      <AvaliacaoClinicaPage
        animalIdPreselecionado={selectedAnimalId}
        onVoltar={() => navegarParaSubView('painel')}
        onIrParaEvolucao={(animalId) => {
          navegarParaSubView('evolucao-clinica', { animalId });
        }}
      />
    );
  }

  if (subView === 'evolucao-clinica') {
    if (perfilAtivo === 'recepcao' || perfilAtivo === 'biologo') {
      return (
        <TelaAcessoRestrito
          perfil={perfilAtivo}
          subView="Evolução Clínica e Alta Médica (TL004)"
          motivo={`A concessão de Alta Médica e a evolução de prontuário clínico hospitalar (TL004) constituem ato privativo do Médico Veterinário (RN-025 e CA027). O perfil demonstrativo '${perfilAtivo === 'biologo' ? 'Biólogo' : 'Agente de Recepção'}' não pode conceder desospitalização clínica nem atestar aptidão veterinária.`}
          onVoltar={() => navegarParaSubView('painel', { aba: 'clinica' })}
          onTrocarPerfil={(p) => mudarPerfil(p)}
        />
      );
    }
    return (
      <EvolucaoClinicaPage
        animalIdPreselecionado={selectedAnimalId}
        onVoltar={() => navegarParaSubView('painel')}
        onIrParaAvaliacao={(animalId) => {
          navegarParaSubView('avaliacao-clinica', { animalId });
        }}
        onIrParaObito={(animalId) => {
          navegarParaSubView('registro-obito', { animalId });
        }}
        onIrParaSoltura={(animalId) => {
          navegarParaSubView('termo-soltura', { animalId });
        }}
      />
    );
  }

  if (subView === 'registro-obito') {
    if (perfilAtivo === 'recepcao' || perfilAtivo === 'biologo') {
      return (
        <TelaAcessoRestrito
          perfil={perfilAtivo}
          subView="Registro de Óbito e Laudo Necroscópico (TL005)"
          motivo={`O atestado de causa mortis, laudo necroscópico e destinação da carcaça animal (TL005) são atribuições privativas de Médico Veterinário nos termos da RN-027 e RN-028. O perfil demonstrativo '${perfilAtivo === 'biologo' ? 'Biólogo' : 'Agente de Recepção'}' não possui atribuição legal para emissão de laudo cadavérico.`}
          onVoltar={() => navegarParaSubView('painel', { aba: 'saidas' })}
          onTrocarPerfil={(p) => mudarPerfil(p)}
        />
      );
    }
    return (
      <RegistroObitoPage
        animalIdPreselecionado={selectedAnimalId}
        onVoltar={() => navegarParaSubView('painel')}
        onConcluir={() => {
          navegarParaSubView('painel', { aba: 'saidas' });
        }}
      />
    );
  }

  if (subView === 'termo-soltura') {
    if (perfilAtivo === 'recepcao') {
      return (
        <TelaAcessoRestrito
          perfil={perfilAtivo}
          subView="Termo de Soltura e Destinação TSD (TL006)"
          motivo="A emissão do Termo de Soltura e Destinação (TSD - TL006) e a autorização de transferência interna entre CETAS exigem homologação técnica de Biólogo, Médico Veterinário ou Gestor de Fauna (RN-026, RN-030 e RN-037). O perfil Agente de Recepção não possui autorização técnica de soltura."
          onVoltar={() => navegarParaSubView('painel', { aba: 'saidas' })}
          onTrocarPerfil={(p) => mudarPerfil(p)}
        />
      );
    }
    return (
      <TermoSolturaEncerramentoPage
        animalIdPreselecionado={selectedAnimalId}
        onVoltar={() => navegarParaSubView('painel')}
        onConcluir={() => {
          navegarParaSubView('painel', { aba: 'saidas' });
        }}
      />
    );
  }

  // =========================================================================
  // VIEW PRINCIPAL: PAINEL GERENCIAL DE ADMISSÃO (GLA SEIA V2)
  // =========================================================================
  return (
    <div className="space-y-4 w-full pb-12">
      {/* Cabeçalho Institucional Sóbrio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Gestão de Fauna — Admissão Animal & Triagem
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Recepção, triagem biológica, atendimento veterinário e rastreabilidade SISCETAS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('fauna-animais')}
              className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 text-xs h-8"
            >
              Base Única (DR001)
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => navegarParaSubView('novo-tr')}
            className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs font-semibold text-xs h-8"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Novo Termo de Recebimento (TR)
          </Button>
        </div>
      </div>

      {/* Barra de Perfil e Acesso Demonstrativo (Compacta e Sóbria) */}
      <div className="bg-slate-50 dark:bg-slate-800/40 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0F4C3A] shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              SIMULAÇÃO DE PERFIS (DEMO):
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">
              {PERFIS_FAUNA.find((p) => p.id === perfilAtivo)?.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Seletor de Perfil de Acesso">
            {PERFIS_FAUNA.map((p) => {
              const ativo = perfilAtivo === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => mudarPerfil(p.id)}
                  aria-pressed={ativo}
                  title={p.desc}
                  className={cn(
                    'px-2.5 py-0.5 rounded-md font-medium transition-colors text-xs border cursor-pointer h-7',
                    ativo
                      ? 'bg-[#0F4C3A] text-white border-[#0F4C3A] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="text-[11px] text-slate-500 border-t border-slate-200/60 dark:border-slate-700/60 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>{PERFIS_FAUNA.find((p) => p.id === perfilAtivo)?.desc}</span>
          <span className="text-[10px] text-slate-500">
            {perfilAtivo === 'gestor'
              ? 'Alçadas especiais e sigilo judicial sob governança formal da CGFAU.'
              : 'Simulação demonstrativa DR000/DR001/DR008. RBAC corporativo vinculado ao SSO.'}
          </span>
        </div>
      </div>

      {/* Visão Geral em KPIs (Sóbrio, sem sparklines decorativas) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total de TRs
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
            {kpis.totalTrs}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Animais Recebidos
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
            {kpis.totalAnimaisRecebidos}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Saldo a Triar
          </span>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-400 tabular-nums mt-1">
            {kpis.saldoPendenteTriagem}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Internados (-CL)
          </span>
          <div className="text-xl font-bold text-rose-700 dark:text-rose-400 tabular-nums mt-1">
            {kpis.internadosClinica}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Solturas / TSD
          </span>
          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-1">
            {kpis.solturasDestinacoes}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Óbitos Registrados
          </span>
          <div className="text-xl font-bold text-slate-700 dark:text-slate-300 tabular-nums mt-1">
            {kpis.obitos}
          </div>
        </div>
      </div>

      {/* Barra de Abas FilamentTabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto text-xs font-medium">
        <button
          type="button"
          onClick={() => mudarAba('trs')}
          className={`px-3.5 py-2.5 border-b-2 font-semibold flex items-center gap-2 transition-colors ${
            abaAtiva === 'trs'
              ? 'border-[#0F4C3A] text-[#0F4C3A]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          1. Termos de Recebimento (TRs)
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-medium">
            {MOCK_TERMOS_RECEBIMENTO.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => mudarAba('triagem')}
          className={`px-3.5 py-2.5 border-b-2 font-semibold flex items-center gap-2 transition-colors ${
            abaAtiva === 'triagem'
              ? 'border-[#0F4C3A] text-[#0F4C3A]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          2. Triagem e Marcação (TL002)
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-medium">
            {MOCK_TRIAGENS.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => mudarAba('clinica')}
          className={`px-3.5 py-2.5 border-b-2 font-semibold flex items-center gap-2 transition-colors ${
            abaAtiva === 'clinica'
              ? 'border-[#0F4C3A] text-[#0F4C3A]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          3. Atendimento Clínico (-CL)
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-50 text-rose-800 border border-rose-200 font-medium">
            {kpis.internadosClinica}
          </span>
        </button>

        <button
          type="button"
          onClick={() => mudarAba('saidas')}
          className={`px-3.5 py-2.5 border-b-2 font-semibold flex items-center gap-2 transition-colors ${
            abaAtiva === 'saidas'
              ? 'border-[#0F4C3A] text-[#0F4C3A]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send className="w-4 h-4" />
          4. Saídas, Solturas e Óbitos
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-medium">
            {kpis.solturasDestinacoes + kpis.obitos}
          </span>
        </button>

        <button
          type="button"
          onClick={() => mudarAba('siscetas')}
          className={`px-3.5 py-2.5 border-b-2 font-semibold flex items-center gap-2 transition-colors ${
            abaAtiva === 'siscetas'
              ? 'border-[#0F4C3A] text-[#0F4C3A]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          5. Integração SISCETAS
          <span className="ml-1 text-[10px] text-slate-500 font-medium">
            (PPV-19)
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: TERMOS DE RECEBIMENTO (TRs) */}
      {/* ========================================================================= */}
      {abaAtiva === 'trs' && (
        <div className="space-y-4">
          {/* Toolbar de Busca e Filtro */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={buscaTexto}
                onChange={(e) => setBuscaTexto(e.target.value)}
                placeholder="Buscar por Nº TR, responsável, auto..."
                className="w-full h-9 pl-9 pr-3 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto relative">
              <select
                data-testid="filtro-unidade-painel"
                value={filtroUnidade}
                onChange={(e) => setFiltroUnidade(e.target.value)}
                style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0.01, pointerEvents: 'none' }}
                tabIndex={-1}
                aria-hidden="true"
              >
                <option value="todos">Todas as Unidades</option>
                {MOCK_UNIDADES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome} ({u.sigla})
                  </option>
                ))}
              </select>

              <CustomSelect
                dataTestId="custom-select-unidade"
                ariaLabel="Filtrar por Unidade"
                value={filtroUnidade}
                onChange={setFiltroUnidade}
                options={[
                  { value: 'todos', label: 'Todas as Unidades' },
                  ...MOCK_UNIDADES.map((u) => ({
                    value: u.id,
                    label: `${u.nome} (${u.sigla})`,
                  })),
                ]}
                className="w-full sm:w-56"
              />

              <CustomSelect
                dataTestId="custom-select-fato-gerador"
                ariaLabel="Filtrar por Fato Gerador"
                value={filtroFatoGerador}
                onChange={setFiltroFatoGerador}
                options={[
                  { value: 'todos', label: 'Todos os Fatos Geradores' },
                  { value: 'Apreensão', label: 'Apreensão' },
                  { value: 'Entrega voluntária', label: 'Entrega voluntária' },
                  { value: 'Resgate', label: 'Resgate' },
                  { value: 'Transferência', label: 'Transferência' },
                  { value: 'Transferência interestadual', label: 'Transferência interestadual' },
                ]}
                className="w-full sm:w-60"
              />
            </div>
          </div>

          {/* Tabela de TRs */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Nº TR Oficial</th>
                  <th className="px-4 py-3">Unidade / Tipo</th>
                  <th className="px-4 py-3">Data / Hora</th>
                  <th className="px-4 py-3">Fato Gerador / Documento</th>
                  <th className="px-4 py-3">Responsável Entrega</th>
                  <th className="px-4 py-3 text-center">Quant. Total</th>
                  <th className="px-4 py-3 text-center">Saldo a Triar</th>
                  <th className="px-4 py-3">Situação</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {trsFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400 italic">
                      Nenhum Termo de Recebimento encontrado para os critérios selecionados.
                    </td>
                  </tr>
                ) : (
                  trsFiltrados.map((tr) => {
                    const saldoPendente = tr.animais.reduce(
                      (acc, a) => acc + (a.saldoPendenteTriagem ?? a.quantidadeTotal),
                      0
                    );
                    return (
                      <tr key={tr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                          {tr.numeroTr}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold block text-slate-800 dark:text-slate-200">
                            {tr.unidadeSigla}
                          </span>
                          <span className="text-[11px] text-slate-500">{tr.tipoUnidade}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {tr.dataRecebimento} <span className="text-[10px] text-slate-400">{tr.horaRecebimento}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-[10px] font-medium text-slate-700 mb-0.5">
                            {tr.fatoGerador}
                          </Badge>
                          {tr.documentoApreensaoNumero && (
                            <span className="text-[11px] font-mono text-slate-500 block truncate max-w-[140px]">
                              {tr.documentoApreensaoNumero}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                          {tr.agenteNomeRazaoSocial}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white font-mono">
                          {tr.quantidadeTotal}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {tr.tipoUnidade === 'UR' ? (
                            <span className="text-[11px] text-slate-500 italic">Não aplicável (UR)</span>
                          ) : (
                            <Badge
                              variant="outline"
                              className={`font-mono text-xs font-bold ${
                                saldoPendente > 0
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              }`}
                            >
                              {saldoPendente}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {tr.tipoUnidade === 'UR' ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-amber-50 text-amber-800 border-amber-300 font-semibold"
                            >
                              Recepção Regional (RN-036)
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                tr.situacaoTr === 'Triagem Concluída'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : tr.situacaoTr === 'Triagem em Andamento'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                            >
                              {tr.situacaoTr}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="xs"
                              title="Visualizar Termo Oficial F-TEC-205-00 (DOC001)"
                              onClick={() => navegarParaSubView('doc001', { trId: tr.id })}
                              className="text-slate-700 hover:text-slate-900"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1" />
                              PDF
                            </Button>

                            {tr.tipoUnidade === 'CETAS' && saldoPendente > 0 && (
                              perfilAtivo === 'recepcao' ? (
                                <Button
                                  size="xs"
                                  disabled
                                  title="Triagem restrita a Biólogo e Médico Veterinário (RN-013)"
                                  className="bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                >
                                  Triar (Restrito)
                                </Button>
                              ) : (
                                <Button
                                  size="xs"
                                  onClick={() => navegarParaSubView('triagem', { trId: tr.id })}
                                  className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
                                >
                                  Triar
                                </Button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: TRIAGEM E MARCAÇÃO (TL002) */}
      {/* ========================================================================= */}
      {abaAtiva === 'triagem' && (
        <div className="space-y-4">
          {perfilAtivo === 'recepcao' && (
            <div data-testid="aviso-restricao-recepcao" className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Restrição Operacional (Perfil Recepção):</strong> O perfil Agente de Recepção possui acesso de visualização aos registros de triagem. Ações de individualização taxonômica, biometria e marcação são restritas a Biólogos e Médicos Veterinários (RN-013 / RN-032).
              </span>
            </div>
          )}

          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Espécimes Individualizados na Triagem (DR008 / TL002)
              </h2>
              <p className="text-xs text-slate-500">
                Geração do Número Digital oficial (000.000/AAAA), aplicação de anilhas/microchips e triagem clínica.
              </p>
            </div>
            {perfilAtivo === 'recepcao' ? (
              <Button
                size="sm"
                disabled
                title="Triagem restrita a Biólogo e Médico Veterinário (RN-013)"
                className="bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed text-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Nova Triagem (Restrito)
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => navegarParaSubView('triagem')}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Nova Triagem de Animal
              </Button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Número Digital</th>
                  <th className="px-4 py-3">TR Origem</th>
                  <th className="px-4 py-3">Espécie</th>
                  <th className="px-4 py-3">Sexo / Faixa Etária</th>
                  <th className="px-4 py-3">Marcação Física</th>
                  <th className="px-4 py-3">Sinais Clínicos</th>
                  <th className="px-4 py-3">Encaminhamento</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {MOCK_TRIAGENS.map((tri) => (
                  <tr key={tri.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      <span className={tri.sufixoCl ? 'text-rose-700' : 'text-slate-900'}>
                        {tri.numeroDigital}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{tri.trNumero}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold block text-slate-800 dark:text-slate-200">
                        {tri.especieNomePopular}
                      </span>
                      <span className="text-[11px] text-slate-500 italic">{tri.especieNomeCientifico}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {tri.sexo} · {tri.faixaEtaria}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {tri.marcacoes.length > 0
                        ? tri.marcacoes.map((m) => `${m.tipo}-${m.numero}`).join(', ')
                        : 'Sem marcação'}
                    </td>
                    <td className="px-4 py-3">
                      {tri.apresentaSinalClinico ? (
                        <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-300 text-[10px]">
                          Sim (Sinais Evidentes)
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px]">
                          Não (Assintomático)
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          tri.encaminhamento === 'Internamento'
                            ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }
                      >
                        {tri.encaminhamento}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {tri.encaminhamento === 'Internamento' ? (
                        <Button
                          size="xs"
                          onClick={() => navegarParaSubView('avaliacao-clinica', { animalId: tri.animalId })}
                          className="bg-rose-700 hover:bg-rose-800 text-white"
                        >
                          <Stethoscope className="w-3.5 h-3.5 mr-1" />
                          Clínica
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => navegarParaSubView('doc001', { trId: tri.trId })}
                        >
                          Ver TR
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: ATENDIMENTO CLÍNICO (-CL) */}
      {/* ========================================================================= */}
      {abaAtiva === 'clinica' && (
        <div className="space-y-4">
          {perfilAtivo === 'recepcao' && (
            <div data-testid="aviso-restricao-recepcao" className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Restrição Operacional (Perfil Recepção):</strong> O perfil Agente de Recepção possui acesso de visualização aos prontuários clínicos. Avaliações clínicas (TL003), prescrições terapêuticas e altas médicas são privativas de Médicos Veterinários (RN-022 / RN-032).
              </span>
            </div>
          )}

          {perfilAtivo === 'biologo' && (
            <div data-testid="aviso-restricao-biologo" className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800 rounded-xl flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Orientação Técnica (Perfil Biólogo):</strong> Acompanhamento de reabilitação e biometria disponível. Atendimento hospitalar e concessão de Alta Médica (-CL) são privativos de Médicos Veterinários (RN-022 / RN-030).
              </span>
            </div>
          )}

          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Fichas Hospitalares e Animais em Tratamento (-CL)
              </h2>
              <p className="text-xs text-slate-500">
                Avaliação clínica detalhada (TL003), prescrições terapêuticas e histórico acumulado de evolução (TL004).
              </p>
            </div>
            <div className="flex gap-2">
              {perfilAtivo === 'recepcao' || perfilAtivo === 'biologo' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    title="Avaliação clínica hospitalar restrita a Médico Veterinário (Lei 5.517/68)"
                    className="text-slate-400 border-slate-200 cursor-not-allowed text-xs"
                  >
                    Nova Avaliação (Restrito)
                  </Button>
                  <Button
                    size="sm"
                    disabled
                    title="Evoluções diárias e Alta Médica restritas a Médico Veterinário"
                    className="bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed text-xs"
                  >
                    Evoluções (Restrito)
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navegarParaSubView('avaliacao-clinica')}
                    className="text-slate-700"
                  >
                    Nova Avaliação (TL003)
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navegarParaSubView('evolucao-clinica')}
                    className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
                  >
                    Evoluções Diárias (TL004)
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Prontuário (-CL)</th>
                  <th className="px-4 py-3">Espécie</th>
                  <th className="px-4 py-3">Data Entrada</th>
                  <th className="px-4 py-3">Atitude / Escore Nutricional</th>
                  <th className="px-4 py-3">Diagnóstico Definitivo / Suspeito</th>
                  <th className="px-4 py-3">Veterinário Responsável</th>
                  <th className="px-4 py-3">Exames / Laudos</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {MOCK_AVALIACOES_CLINICAS.map((av) => (
                  <tr key={av.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-mono font-bold text-rose-700">{av.numeroDigital}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {MOCK_ANIMAIS.find((a) => a.id === av.animalId)?.especieNomePopular || 'Animal Silvestre'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{av.dataEntradaClinica}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold block text-slate-700">{av.atitude}</span>
                      <span className="text-[11px] text-slate-500">{av.estadoNutricional}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                      {av.diagnosticoDefinitivo || av.diagnosticoSuspeito}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {av.veterinarioResponsavel} <span className="text-[11px] font-mono">({av.crmv})</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px]">
                        {av.laudos.length} laudo(s) anexado(s)
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => navegarParaSubView('avaliacao-clinica', { animalId: av.animalId })}
                        >
                          Ficha
                        </Button>
                        <Button
                          size="xs"
                          onClick={() => navegarParaSubView('evolucao-clinica', { animalId: av.animalId })}
                          className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
                        >
                          Evoluções
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: SAÍDAS, SOLTURAS E ÓBITOS */}
      {/* ========================================================================= */}
      {abaAtiva === 'saidas' && (
        <div className="space-y-6">
          {perfilAtivo === 'recepcao' && (
            <div data-testid="aviso-restricao-recepcao" className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Restrição Operacional (Perfil Recepção):</strong> O perfil Agente de Recepção visualiza os termos emitidos. A formalização de Termos de Soltura (TSD) e laudos de óbito exige homologação técnica de Biólogo ou Médico Veterinário (RN-026 / RN-028).
              </span>
            </div>
          )}

          {/* Seção 1: Termos de Soltura e Destinação (TSD) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Termos de Soltura e Destinação Emitidos (TSD)
                </h3>
                <p className="text-xs text-slate-500">
                  Documentos oficiais de desfecho e encerramento de tutela (TL006).
                </p>
              </div>
              {perfilAtivo === 'recepcao' ? (
                <Button
                  size="sm"
                  disabled
                  title="Emissão de soltura e TSD restrita a Biólogo, Médico Veterinário e Gestor (RN-026)"
                  className="bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed text-xs"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Emitir TSD (Restrito)
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => navegarParaSubView('termo-soltura')}
                  className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Emitir Termo de Soltura (TL006)
                </Button>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Nº Termo TSD</th>
                    <th className="px-4 py-3">Animal / Prontuário</th>
                    <th className="px-4 py-3">Data Saída</th>
                    <th className="px-4 py-3">Modalidade / Destinação</th>
                    <th className="px-4 py-3">Local de Saída / ASAS</th>
                    <th className="px-4 py-3">Responsável Técnico</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {MOCK_TERMOS_SOLTURA.map((tsd) => (
                    <tr key={tsd.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-mono font-bold text-[#0F4C3A]">{tsd.numeroTermo}</td>
                      <td className="px-4 py-3 font-mono text-slate-800">{tsd.numeroDigital}</td>
                      <td className="px-4 py-3 text-slate-600">{tsd.dataSaida}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300">
                          {tsd.destinacaoFinal}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-[200px] truncate">{tsd.localSaida}</td>
                      <td className="px-4 py-3 text-slate-600">{tsd.responsavelSaida}</td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-300">
                          {tsd.statusFinal}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Seção 2: Registros de Óbito e Destinação de Carcaça */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Registros Oficiais de Óbito e Numeração de Cadáver ([Nº TR]-OB00)
                </h3>
                <p className="text-xs text-slate-500">
                  Controle de causa mortis, laudo necroscópico e destinação de carcaça para universidades (TL005).
                </p>
              </div>
              {perfilAtivo === 'recepcao' || perfilAtivo === 'biologo' ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  title="Laudo necroscópico e atestado de óbito restritos a Médico Veterinário (RN-027)"
                  className="text-slate-400 border-slate-200 cursor-not-allowed text-xs"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Registrar Óbito (Restrito)
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navegarParaSubView('registro-obito')}
                  className="text-slate-800 border-slate-300"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Registrar Novo Óbito (TL005)
                </Button>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Número de Cadáver</th>
                    <th className="px-4 py-3">TR Origem</th>
                    <th className="px-4 py-3">Data Óbito</th>
                    <th className="px-4 py-3">Momento Oficial</th>
                    <th className="px-4 py-3">Causa Mortis / Diagnóstico</th>
                    <th className="px-4 py-3">Destinação da Carcaça</th>
                    <th className="px-4 py-3 text-right">Instituição Acolhedora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {MOCK_REGISTROS_OBITO.map((ob) => (
                    <tr key={ob.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-mono font-bold text-rose-700">{ob.numeroCadaver}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{ob.trNumero}</td>
                      <td className="px-4 py-3 text-slate-600">{ob.dataObito}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px]">
                          {ob.momentoObito}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-800 max-w-[200px] truncate">{ob.diagnosticoPosMorte}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{ob.destinacaoCarcaca}</td>
                      <td className="px-4 py-3 text-right text-slate-600 truncate max-w-[180px]">
                        {ob.instituicaoDestinataria || 'Sanitário'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 5: INTEGRAÇÃO SISCETAS (RNF-103) */}
      {/* ========================================================================= */}
      {abaAtiva === 'siscetas' && (
        <div className="space-y-4">
          {/* Painel Institucional Sóbrio de Fila de Contingência */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#0F4C3A] shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Simulação de Fila Local SISCETAS / IBAMA (PPV-19 / RNF-103)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Modo demonstrativo isolado com contingência e fila assíncrona local, sem chamadas externas ao IBAMA.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Status da Fila</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white font-mono">{siscetasStatusGeral}</span>
              </div>

              <Button
                size="sm"
                disabled={siscetasSimulando}
                onClick={handleSimularSiscetas}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${siscetasSimulando ? 'animate-spin' : ''}`} />
                {siscetasSimulando ? 'Sincronizando Lote...' : 'Simular Reprocessamento de Lote'}
              </Button>
            </div>
          </div>

          {/* Logs de Eventos */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Histórico de Eventos e Protocolos de Transmissão ({siscetasLogs.length})
            </h3>

            <div className="space-y-2">
              {siscetasLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{log.evento}</span>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px]">
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{log.mensagem}</p>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">{log.dataHora}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
