import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  Check,
  AlertTriangle,
  Stethoscope,
  Tag,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Activity,
  HeartCrack,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { Section } from '@/components/filament/Section';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
  MOCK_TERMOS_RECEBIMENTO,
  MOCK_TRIAGENS,
  gerarProximoNumeroDigital,
  notificarAtualizacaoDadosFauna,
} from '@/data/faunaAdmissaoMock';
import {
  MOCK_ANIMAIS,
  MOCK_ESPECIES,
  AnimalItem,
  StatusAnimal,
  MarcacaoFisicaItem,
  SexoAnimal,
} from '@/data/faunaMock';
import {
  RegistroTriagemItem,
  EncaminhamentoTriagem,
} from '@/types/faunaAdmissao';

interface TriagemMarcacaoPageProps {
  trIdPreselecionado?: string;
  onVoltar: () => void;
  onConcluirTriagem: (animalId: string, encaminhamento: EncaminhamentoTriagem) => void;
  onIrParaClinica?: (animalId: string) => void;
  onIrParaObito?: (animalId: string, trNumero: string) => void;
}

export const TriagemMarcacaoPage: React.FC<TriagemMarcacaoPageProps> = ({
  trIdPreselecionado,
  onVoltar,
  onConcluirTriagem,
  onIrParaClinica,
  onIrParaObito,
}) => {
  // Lista de TRs disponíveis com triagem pendente ou em andamento
  const trsComPendencia = useMemo(() => {
    return MOCK_TERMOS_RECEBIMENTO.filter(
      (tr) => tr.tipoUnidade === 'CETAS' && tr.animais.some((a) => (a.saldoPendenteTriagem ?? a.quantidadeTotal) > 0)
    );
  }, []);

  const [trSelecionadoId, setTrSelecionadoId] = useState<string>(
    trIdPreselecionado || (trsComPendencia[0]?.id ?? MOCK_TERMOS_RECEBIMENTO[0]?.id ?? '')
  );

  const trAtual = useMemo(() => {
    return MOCK_TERMOS_RECEBIMENTO.find((tr) => tr.id === trSelecionadoId) || trsComPendencia[0];
  }, [trSelecionadoId, trsComPendencia]);

  // Linhas do TR
  const [linhaSelecionadaId, setLinhaSelecionadaId] = useState<string>(
    trAtual?.animais[0]?.id || ''
  );

  const linhaAtual = useMemo(() => {
    return trAtual?.animais.find((a) => a.id === linhaSelecionadaId) || trAtual?.animais[0];
  }, [trAtual, linhaSelecionadaId]);

  // Form states
  const [especieId, setEspecieId] = useState<string>(linhaAtual?.especieId || 'esp-006');
  const [sexo, setSexo] = useState<'Macho' | 'Fêmea' | 'Indeterminado'>('Indeterminado');
  const [faixaEtaria, setFaixaEtaria] = useState<'Neonato' | 'Filhote' | 'Jovem' | 'Adulto' | 'Idoso'>('Adulto');
  const [condicaoEntrada, setCondicaoEntrada] = useState<'Saudável' | 'Mutilado/Ferido' | 'Doente' | 'Óbito'>('Saudável');
  const [pesoGramas, setPesoGramas] = useState<string>('42');
  const [identificacaoComplementar, setIdentificacaoComplementar] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');

  // Sinais clínicos preliminares e Encaminhamento (RN-012, RN-016, RN-019, RN-020)
  const [apresentaSinaisClinicos, setApresentaSinaisClinicos] = useState<boolean>(false);
  const [encaminhamento, setEncaminhamento] = useState<EncaminhamentoTriagem>('Quarentena');

  // Marcações físicas oficiais (RN-007, RN-008, RN-014, RN-017: AN, MC, T)
  const [marcacoes, setMarcacoes] = useState<MarcacaoFisicaItem[]>([]);
  const [novaMarcacaoTipo, setNovaMarcacaoTipo] = useState<'Microchip' | 'Anilha' | 'Tatuagem'>('Anilha');
  const [novaMarcacaoNumero, setNovaMarcacaoNumero] = useState<string>('');
  const [novaMarcacaoLocal, setNovaMarcacaoLocal] = useState<string>('Tarso direito');

  // Dialogs & Avisos
  const [avisoDivergenciaEspecie, setAvisoDivergenciaEspecie] = useState<boolean>(false);
  const [justificativaDivergenciaEspecie, setJustificativaDivergenciaEspecie] = useState<string>('');
  const [avisoReadmissaoModal, setAvisoReadmissaoModal] = useState<boolean>(false);
  const [readmissaoProntuarioDetectado, setReadmissaoProntuarioDetectado] = useState<string>('');
  const [animalReadmitido, setAnimalReadmitido] = useState<AnimalItem | null>(null);
  const [modalExcessoSaldoAberto, setModalExcessoSaldoAberto] = useState<boolean>(false);
  const [justificativaExcessoSaldo, setJustificativaExcessoSaldo] = useState<string>('');
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [sucessoModal, setSucessoModal] = useState<boolean>(false);
  const [animalCriadoInfo, setAnimalCriadoInfo] = useState<{ id: string; numeroDigital: string; encaminhamento: EncaminhamentoTriagem } | null>(null);

  // Efeito ao trocar de linha do TR: sincronizar espécie padrão
  React.useEffect(() => {
    if (linhaAtual) {
      setEspecieId(linhaAtual.especieId);
      if (linhaAtual.condicaoAnimal === 'Mutilado/Ferido' || linhaAtual.condicaoAnimal === 'Doente') {
        setCondicaoEntrada(linhaAtual.condicaoAnimal);
        setApresentaSinaisClinicos(true);
        setEncaminhamento('Internamento');
      } else if (linhaAtual.condicaoAnimal === 'Óbito') {
        setCondicaoEntrada('Óbito');
        setEncaminhamento('Óbito');
      } else {
        setCondicaoEntrada('Saudável');
        setApresentaSinaisClinicos(false);
        setEncaminhamento('Quarentena');
      }
    }
  }, [linhaAtual]);

  // Efeito para ajustar encaminhamento automático ao alterar sinais clínicos (RN-019 / RN-020)
  const handleToggleSinaisClinicos = (comSinais: boolean) => {
    setApresentaSinaisClinicos(comSinais);
    if (comSinais) {
      // Se possui sinais, sugere internamento hospitalar com sufixo -CL
      if (encaminhamento === 'Quarentena' || encaminhamento === 'Soltura imediata') {
        setEncaminhamento('Internamento');
      }
    } else {
      // Se não possui sinais, padrão é quarentenário
      if (encaminhamento === 'Internamento' || encaminhamento === 'Isolamento') {
        setEncaminhamento('Quarentena');
      }
    }
  };

  // Verificação de divergência de espécie (RN-005, RN-014, MSG005)
  const handleMudarEspecie = (novaEspecieId: string) => {
    setEspecieId(novaEspecieId);
    if (linhaAtual && novaEspecieId !== linhaAtual.especieId) {
      setAvisoDivergenciaEspecie(true);
    }
  };

  // Adicionar Marcação Física com verificação de readmissão (RN-006, RN-017, RN-031, MSG008, MSG011)
  const handleAdicionarMarcacao = () => {
    const cod = novaMarcacaoNumero.trim();
    if (!cod) {
      setErroValidacao('Informe o código da marcação antes de adicionar.');
      return;
    }

    // Validação de duplicidade na lista local
    if (marcacoes.some((m) => m.numero.toLowerCase() === cod.toLowerCase())) {
      setErroValidacao(`A marcação "${cod}" já foi adicionada para este animal.`);
      return;
    }

    // RN-017 / CA010 / MSG008: Verificar se a marcação física ativa já existe em outro animal ATIVO
    const animalComMarcacaoAtiva = MOCK_ANIMAIS.find(
      (a) =>
        a.situacao === 'Ativo' &&
        a.status !== 'Soltura' &&
        a.status !== 'Óbito' &&
        a.status !== 'Destinação' &&
        a.marcacoesFisicas?.some((m) => m.situacao === 'Ativa' && m.numero.toLowerCase() === cod.toLowerCase())
    );

    if (animalComMarcacaoAtiva) {
      setErroValidacao(
        `MSG008: A marcação física ${cod} já está ativa no animal ${animalComMarcacaoAtiva.numeroDigital || animalComMarcacaoAtiva.codigo}. Duplicidade de marcação física ativa não permitida.`
      );
      return;
    }

    // RN-031 / CA019 / MSG011: Reconhecer animal preexistente (readmissão de animal solto/transferido ou pelo nº digital)
    const animalExistente = MOCK_ANIMAIS.find(
      (a) =>
        a.marcacoesFisicas?.some((m) => m.numero.toLowerCase() === cod.toLowerCase()) ||
        a.numeroDigital?.toLowerCase() === cod.toLowerCase() ||
        a.codigo.toLowerCase() === cod.toLowerCase()
    );

    if (animalExistente) {
      setAnimalReadmitido(animalExistente);
      setReadmissaoProntuarioDetectado(animalExistente.numeroDigital || animalExistente.codigo);
      setAvisoReadmissaoModal(true);
      return;
    }

    // Se não for readmissão ou após confirmação, adiciona
    setMarcacoes((prev) => [
      ...prev,
      {
        id: `marc-${Date.now()}`,
        tipo: novaMarcacaoTipo,
        numero: cod,
        dataAplicacao: new Date().toLocaleDateString('pt-BR'),
        situacao: 'Ativa',
      },
    ]);
    setNovaMarcacaoNumero('');
    setErroValidacao(null);
  };

  const handleRemoverMarcacao = (id: string) => {
    setMarcacoes((prev) => prev.filter((m) => m.id !== id));
  };

  // Salvar Triagem & Individualização (RN-003, RN-004, RN-013, RN-014, RN-015, RN-016, RN-031)
  const handleSalvarTriagem = () => {
    setErroValidacao(null);

    if (!trAtual) {
      setErroValidacao('Selecione um Termo de Recebimento válido.');
      return;
    }

    // RN-014 / MSG005: Divergência de espécie exige justificativa técnica obrigatória
    if (linhaAtual && especieId !== linhaAtual.especieId && !justificativaDivergenciaEspecie.trim()) {
      setErroValidacao(
        `MSG005: A espécie identificada diverge da declarada no TR (${linhaAtual.especieNomePopular}). Justificativa técnica obrigatória.`
      );
      setAvisoDivergenciaEspecie(true);
      return;
    }

    // RN-014 / CA006 / MSG004: Validação de cotas de individualização com justificativa
    const saldoDisponivel = linhaAtual?.saldoPendenteTriagem ?? linhaAtual?.quantidadeTotal ?? 1;
    if (saldoDisponivel <= 0 && !justificativaExcessoSaldo.trim()) {
      setModalExcessoSaldoAberto(true);
      return;
    }

    const especieObj = MOCK_ESPECIES.find((e) => e.id === especieId);
    if (!especieObj) {
      setErroValidacao('Selecione uma espécie válida.');
      return;
    }

    const nomePopularEspecie =
      especieObj.nomesPopulares?.find((n) => n.principal)?.nome ||
      especieObj.nomesPopulares?.[0]?.nome ||
      especieObj.nomeCientifico;

    // RN-016: Internamento gera sufixo -CL
    const requerSufixoCl = encaminhamento === 'Internamento';

    // Mapeamento do status final do animal
    let statusAnimalFinal: StatusAnimal = 'Aguardando triagem';
    switch (encaminhamento) {
      case 'Quarentena':
        statusAnimalFinal = 'Em quarentena';
        break;
      case 'Isolamento':
        statusAnimalFinal = 'Em isolamento';
        break;
      case 'Internamento':
        statusAnimalFinal = 'Internado';
        break;
      case 'Soltura imediata':
        statusAnimalFinal = 'Soltura';
        break;
      case 'Óbito':
        statusAnimalFinal = 'Óbito';
        break;
    }

    // -------------------------------------------------------------------------
    // CASO READMISSÃO (RN-031 / CA019)
    // -------------------------------------------------------------------------
    if (animalReadmitido) {
      const numDigitalOriginal = animalReadmitido.numeroDigital || animalReadmitido.codigo;
      animalReadmitido.status = statusAnimalFinal;
      animalReadmitido.unidadeAtualId = trAtual.unidadeId;
      animalReadmitido.unidadeAtualNome = trAtual.unidadeNome;
      animalReadmitido.numeroTr = trAtual.numeroTr;
      if (!animalReadmitido.trHistorico) {
        animalReadmitido.trHistorico = [];
      }
      if (!animalReadmitido.trHistorico.includes(trAtual.numeroTr)) {
        animalReadmitido.trHistorico.push(trAtual.numeroTr);
      }
      // Adicionar novas marcações se houver
      for (const m of marcacoes) {
        if (!animalReadmitido.marcacoesFisicas.some((mf) => mf.numero.toLowerCase() === m.numero.toLowerCase())) {
          animalReadmitido.marcacoesFisicas.push(m);
        }
      }

      // Decrementar saldo do TR
      if (linhaAtual && linhaAtual.saldoPendenteTriagem !== undefined) {
        linhaAtual.saldoPendenteTriagem = Math.max(0, linhaAtual.saldoPendenteTriagem - 1);
        trAtual.situacaoTr =
          trAtual.animais.every((a) => (a.saldoPendenteTriagem ?? 0) === 0)
            ? 'Triagem Concluída'
            : 'Triagem em Andamento';
      }

      // Registrar triagem vinculada
      const novoRegistroTriagem: RegistroTriagemItem = {
        id: `tri-${Date.now()}`,
        trId: trAtual.id,
        trNumero: trAtual.numeroTr,
        linhaTrId: linhaAtual?.id || 'linha-01',
        animalId: animalReadmitido.id,
        numeroDigital: numDigitalOriginal,
        sufixoCl: requerSufixoCl,
        especieId: animalReadmitido.especieId,
        especieNomeCientifico: animalReadmitido.especieNomeCientifico,
        especieNomePopular: animalReadmitido.especieNomePopular,
        sexo: animalReadmitido.sexo,
        faixaEtaria: (animalReadmitido.faixaEtaria === 'Indeterminada' ? 'Indeterminado' : animalReadmitido.faixaEtaria) as any,
        marcacoes: animalReadmitido.marcacoesFisicas,
        identificacaoComplementar: animalReadmitido.identificacaoComplementar,
        procedencia: trAtual.fatoGerador,
        localOrigem: `${trAtual.localOrigemMunicipio} / ${trAtual.localOrigemUf}`,
        condicaoTriagem: condicaoEntrada,
        apresentaSinalClinico: apresentaSinaisClinicos,
        encaminhamento,
        responsavelTriagem: trAtual.recebedorNome,
        dataHoraTriagem: `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
        observacoes: `[Readmissão vinculada ao histórico preexistente] ${observacoes}${justificativaDivergenciaEspecie ? ` | Justificativa taxonômica: ${justificativaDivergenciaEspecie}` : ''}${justificativaExcessoSaldo ? ` | Justificativa cota excedente: ${justificativaExcessoSaldo}` : ''}`.trim(),
      };
      MOCK_TRIAGENS.unshift(novoRegistroTriagem);
      notificarAtualizacaoDadosFauna();

      setAnimalCriadoInfo({
        id: animalReadmitido.id,
        numeroDigital: numDigitalOriginal,
        encaminhamento,
      });
      setSucessoModal(true);
      return;
    }

    // -------------------------------------------------------------------------
    // CASO NOVO ANIMAL
    // -------------------------------------------------------------------------
    const numeroDigitalGerado = gerarProximoNumeroDigital(2026, requerSufixoCl);
    const novoAnimalId = `ani-${Date.now()}`;

    // 1. Inserir animal na base única (DR001)
    const novoAnimalItem: AnimalItem = {
      id: novoAnimalId,
      codigo: numeroDigitalGerado,
      unidadeRegional: trAtual.unidadeNome,
      especieId: especieObj.id,
      especieNomeCientifico: especieObj.nomeCientifico,
      especieNomePopular: nomePopularEspecie,
      grupoAnimal: especieObj.grupoAnimal,
      identificacaoAConfirmar: false,
      sexo,
      faixaEtaria,
      origemUf: trAtual.localOrigemUf,
      origemMunicipio: trAtual.localOrigemMunicipio,
      marcacoesFisicas: marcacoes,
      unidadeAtualId: trAtual.unidadeId,
      unidadeAtualNome: trAtual.unidadeNome,
      procedenciaId: 'proc-01',
      procedenciaNome: trAtual.fatoGerador,
      status: statusAnimalFinal,
      sigilo: false,
      candidatoGuarda: false,
      condicaoEntrada,
      atitude: apresentaSinaisClinicos ? 'Hipoativo' : 'Ativo',
      temperamento: 'Normal',
      estadoNutricional: 'Normal',
      numeroTr: trAtual.numeroTr,
      numeroDigital: numeroDigitalGerado,
      sufixoCl: requerSufixoCl,
      trHistorico: [trAtual.numeroTr],
      dataAdmissao: new Date().toLocaleDateString('pt-BR'),
      situacao: 'Ativo',
      identificacaoComplementar,
      observacoes: `${observacoes}${justificativaDivergenciaEspecie ? ` | Justificativa taxonômica: ${justificativaDivergenciaEspecie}` : ''}${justificativaExcessoSaldo ? ` | Justificativa cota excedente: ${justificativaExcessoSaldo}` : ''}`.trim(),
    };
    MOCK_ANIMAIS.unshift(novoAnimalItem);

    // 2. Decrementar saldo do TR
    if (linhaAtual && linhaAtual.saldoPendenteTriagem !== undefined) {
      linhaAtual.saldoPendenteTriagem = Math.max(0, linhaAtual.saldoPendenteTriagem - 1);
      trAtual.situacaoTr =
        trAtual.animais.every((a) => (a.saldoPendenteTriagem ?? 0) === 0)
          ? 'Triagem Concluída'
          : 'Triagem em Andamento';
    }

    // 3. Registrar na tabela de triagens
    const novoRegistroTriagem: RegistroTriagemItem = {
      id: `tri-${Date.now()}`,
      trId: trAtual.id,
      trNumero: trAtual.numeroTr,
      linhaTrId: linhaAtual?.id || 'linha-01',
      animalId: novoAnimalId,
      numeroDigital: numeroDigitalGerado,
      sufixoCl: requerSufixoCl,
      especieId: especieObj.id,
      especieNomeCientifico: especieObj.nomeCientifico,
      especieNomePopular: nomePopularEspecie,
      sexo,
      faixaEtaria,
      marcacoes,
      identificacaoComplementar,
      procedencia: trAtual.fatoGerador,
      localOrigem: `${trAtual.localOrigemMunicipio} / ${trAtual.localOrigemUf}`,
      condicaoTriagem: condicaoEntrada,
      apresentaSinalClinico: apresentaSinaisClinicos,
      encaminhamento,
      responsavelTriagem: trAtual.recebedorNome,
      dataHoraTriagem: `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      observacoes,
    };
    MOCK_TRIAGENS.unshift(novoRegistroTriagem);
    notificarAtualizacaoDadosFauna();

    setAnimalCriadoInfo({
      id: novoAnimalId,
      numeroDigital: numeroDigitalGerado,
      encaminhamento,
    });
    setSucessoModal(true);
  };

  return (
    <div className="space-y-4 w-full pb-12">
      {/* Barra Superior de Navegação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onVoltar}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Voltar ao Painel"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              TL002 — Triagem, Marcação e Individualização
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Individualização de espécimes a partir do Termo de Recebimento (TR), aferição biométrica e encaminhamento clínico.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSalvarTriagem}
            className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs font-semibold text-xs h-8"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Concluir Triagem & Gerar Prontuário
          </Button>
        </div>
      </div>

      {/* Erro de Validação */}
      {erroValidacao && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 rounded-lg flex items-start gap-2 text-rose-800 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <span className="font-bold">Atenção na validação: </span>
            {erroValidacao}
          </div>
        </div>
      )}

      {/* Aviso de Readmissão Confirmada (RN-031 / CA019) */}
      {animalReadmitido && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-300 dark:border-indigo-800 rounded-lg flex items-center justify-between text-indigo-900 dark:text-indigo-200 text-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Readmissão Identificada (RN-031 / CA019):</strong> Vinculando novo TR ao prontuário preexistente{' '}
              <span className="font-mono font-bold text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200">
                {animalReadmitido.numeroDigital || animalReadmitido.codigo}
              </span>{' '}
              (sem duplicar cadastro na base DR001).
            </span>
          </div>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setAnimalReadmitido(null)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Desvincular
          </Button>
        </div>
      )}

      {/* 1. SELEÇÃO DO TR E LOTE DE ORIGEM (RN-003, RN-004) */}
      <Section
        title="1. Origem do Animal: Termo de Recebimento (TR)"
        description="Selecione o TR institucional cadastrado e o lote de admissão correspondente."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="md:col-span-2">
            <InputWrapper label="Termo de Recebimento (TR) *" required>
              <select
                value={trSelecionadoId}
                onChange={(e) => setTrSelecionadoId(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {trsComPendencia.map((tr) => (
                  <option key={tr.id} value={tr.id}>
                    {tr.numeroTr} — {tr.unidadeNome} ({tr.fatoGerador} - {tr.dataRecebimento}) — Saldo:{' '}
                    {tr.animais.reduce((acc, a) => acc + (a.saldoPendenteTriagem ?? a.quantidadeTotal), 0)} a triar
                  </option>
                ))}
              </select>
            </InputWrapper>
          </div>

          <div>
            <InputWrapper label="Lote / Espécie Declarada no TR *" required>
              <select
                value={linhaSelecionadaId}
                onChange={(e) => setLinhaSelecionadaId(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {trAtual?.animais.map((linha) => (
                  <option key={linha.id} value={linha.id}>
                    {linha.especieNomePopular} ({linha.especieNomeCientifico}) — Restam{' '}
                    {linha.saldoPendenteTriagem ?? linha.quantidadeTotal} espécime(s)
                  </option>
                ))}
              </select>
            </InputWrapper>
          </div>
        </div>

        {/* Resumo do TR Selecionado */}
        {trAtual && (
          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-500 block text-[11px]">Unidade de Entrada:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {trAtual.unidadeNome} ({trAtual.unidadeSigla})
                </span>
              </div>
              <div className="border-l border-slate-300 h-6 mx-1" />
              <div>
                <span className="text-slate-500 block text-[11px]">Fato Gerador:</span>
                <Badge variant="outline" className="font-medium text-slate-700">
                  {trAtual.fatoGerador}
                </Badge>
              </div>
              <div className="border-l border-slate-300 h-6 mx-1" />
              <div>
                <span className="text-slate-500 block text-[11px]">Documento Origem:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {trAtual.documentoApreensaoNumero || 'Não informado'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Saldo Pendente no Lote:</span>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-900 border-amber-300 font-bold px-2.5 py-0.5"
              >
                {linhaAtual?.saldoPendenteTriagem ?? linhaAtual?.quantidadeTotal} indivíduo(s)
              </Badge>
            </div>
          </div>
        )}
      </Section>

      {/* 2. DADOS BIOLÓGICOS E TAXONOMIA (RN-005, RN-009, RN-011) */}
      <Section
        title="2. Individualização Biológica e Taxonomia"
        description="Identificação da espécie, sexo, estágio de desenvolvimento e biometria inicial."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Espécie */}
          <div className="sm:col-span-2">
            <InputWrapper label="Espécie Identificada na Triagem *" required>
              <select
                data-testid="select-especie-triagem"
                value={especieId}
                onChange={(e) => handleMudarEspecie(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {MOCK_ESPECIES.map((esp) => {
                  const nomePop =
                    esp.nomesPopulares?.find((n) => n.principal)?.nome ||
                    esp.nomesPopulares?.[0]?.nome ||
                    esp.nomeCientifico;
                  return (
                    <option key={esp.id} value={esp.id}>
                      {nomePop} ({esp.nomeCientifico}) — {esp.classe}
                    </option>
                  );
                })}
              </select>
            </InputWrapper>
          </div>

          {/* Sexo */}
          <div>
            <InputWrapper label="Sexo *" required>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value as any)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
                <option value="Indeterminado">Indeterminado</option>
              </select>
            </InputWrapper>
          </div>

          {/* Faixa Etária */}
          <div>
            <InputWrapper label="Faixa Etária / Estágio *" required>
              <select
                value={faixaEtaria}
                onChange={(e) => setFaixaEtaria(e.target.value as any)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                <option value="Neonato">Neonato</option>
                <option value="Filhote">Filhote</option>
                <option value="Jovem">Jovem</option>
                <option value="Adulto">Adulto</option>
                <option value="Idoso">Idoso</option>
              </select>
            </InputWrapper>
          </div>

          {/* Biometria Inicial / Peso */}
          <div>
            <InputWrapper label="Peso Inicial (g ou kg)" hint="Aferido em balança de precisão">
              <input
                type="text"
                value={pesoGramas}
                onChange={(e) => setPesoGramas(e.target.value)}
                placeholder="Ex: 45 g ou 1.2 kg"
                className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
              />
            </InputWrapper>
          </div>

          {/* Condição de Entrada */}
          <div>
            <InputWrapper label="Condição de Entrada *" required>
              <select
                value={condicaoEntrada}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setCondicaoEntrada(val);
                  if (val === 'Óbito') {
                    setApresentaSinaisClinicos(true);
                    setEncaminhamento('Óbito');
                  } else if (val === 'Mutilado/Ferido' || val === 'Doente') {
                    setApresentaSinaisClinicos(true);
                    setEncaminhamento('Internamento');
                  }
                }}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                <option value="Saudável">Saudável</option>
                <option value="Mutilado/Ferido">Mutilado/Ferido</option>
                <option value="Doente">Doente</option>
                <option value="Óbito">Óbito na chegada / triagem</option>
              </select>
            </InputWrapper>
          </div>

          {/* Identificação Complementar */}
          <div className="sm:col-span-2">
            <InputWrapper label="Identificação Complementar / Particularidades">
              <input
                type="text"
                value={identificacaoComplementar}
                onChange={(e) => setIdentificacaoComplementar(e.target.value)}
                placeholder="Ex: Falha na asa direita, plumagem descolorida, etc."
                className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
              />
            </InputWrapper>
          </div>
        </div>
      </Section>

      {/* 3. MARCAÇÃO FÍSICA E ANILHAMENTO (RN-006, RN-007, RN-008, RN-014) */}
      <Section
        title="3. Marcação Física do Espécime (Anilha, Microchip, Tatuagem)"
        description="Aplicação ou leitura de dispositivo de rastreabilidade individual. A triagem verifica automaticamente se a marcação já existe no sistema para alertar readmissão."
      >
        <div className="space-y-4 pt-2">
          {/* Formulário de Adicionar Marcação */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <div>
              <InputWrapper label="Tipo de Marcação">
                <select
                  value={novaMarcacaoTipo}
                  onChange={(e) => setNovaMarcacaoTipo(e.target.value as any)}
                  className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Anilha">Anilha (AN)</option>
                  <option value="Microchip">Microchip (MC)</option>
                  <option value="Tatuagem">Tatuagem (T)</option>
                </select>
              </InputWrapper>
            </div>

            <div className="sm:col-span-2">
              <InputWrapper
                label="Código / Número da Marcação *"
                hint="Digite para validar contra duplicidade e histórico"
              >
                <input
                  type="text"
                  value={novaMarcacaoNumero}
                  onChange={(e) => setNovaMarcacaoNumero(e.target.value)}
                  placeholder="Ex: AN-BA-2026-9041 ou MC-981098102345678"
                  className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg font-mono"
                />
              </InputWrapper>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAdicionarMarcacao}
                className="w-full h-9 border-[#0F4C3A] text-[#0F4C3A] hover:bg-emerald-50"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Adicionar Marcação
              </Button>
            </div>
          </div>

          {/* Tabela de Marcações Adicionadas */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Código / Numeração</th>
                  <th className="px-3 py-2">Data Aplicação</th>
                  <th className="px-3 py-2">Situação</th>
                  <th className="px-3 py-2 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {marcacoes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-slate-400 italic">
                      Nenhuma marcação física adicionada ainda. O animal receberá o Número Digital oficial (000.000/AAAA).
                    </td>
                  </tr>
                ) : (
                  marcacoes.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="font-semibold text-slate-800">
                          {m.tipo}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {m.numero}
                      </td>
                      <td className="px-3 py-2 text-slate-600">{m.dataAplicacao}</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px]">
                          {m.situacao}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleRemoverMarcacao(m.id)}
                          className="text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* 4. SINAIS CLÍNICOS E DIRECIONAMENTO (RN-012, RN-016, RN-019, RN-020) */}
      <Section
        title="4. Triagem Clínica Preliminar e Encaminhamento Institucional"
        description="A presença de sinais clínicos evidentes direciona obrigatoriamente para internamento hospitalar (com sufixo -CL) ou isolamento epidemiológico."
      >
        <div className="space-y-4 pt-2">
          {/* Toggle de Sinais Clínicos (RN-012) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#0F4C3A]" />
                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                  O animal apresenta sinais clínicos evidentes, ferimentos ou apatia?
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Conforme RN-016 e RN-019: espécimes que demandam internamento hospitalar recebem o sufixo{' '}
                <strong className="text-slate-800 dark:text-slate-200 font-mono">-CL</strong> no Número Digital e
                são encaminhados para a Avaliação Clínica (TL003).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={!apresentaSinaisClinicos ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleToggleSinaisClinicos(false)}
                className={
                  !apresentaSinaisClinicos
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'text-slate-700'
                }
              >
                Não (Assintomático)
              </Button>
              <Button
                type="button"
                variant={apresentaSinaisClinicos ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleToggleSinaisClinicos(true)}
                className={
                  apresentaSinaisClinicos
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'text-slate-700'
                }
              >
                Sim (Apresenta Sinais)
              </Button>
            </div>
          </div>

          {/* Seleção do Encaminhamento Pós-Triagem (RN-019, CA012) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Opção 1: Quarentena */}
            <div
              onClick={() => {
                if (!apresentaSinaisClinicos) setEncaminhamento('Quarentena');
              }}
              className={`p-3 rounded-xl border transition-all ${
                apresentaSinaisClinicos
                  ? 'opacity-40 bg-slate-50 border-slate-200 cursor-not-allowed'
                  : encaminhamento === 'Quarentena'
                  ? 'border-[#0F4C3A] bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-[#0F4C3A]/20 cursor-pointer'
                  : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">1. Quarentena</span>
                {encaminhamento === 'Quarentena' && <Check className="w-4 h-4 text-[#0F4C3A]" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {apresentaSinaisClinicos
                  ? 'Indisponível: animais com sinais clínicos devem ser isolados ou internados.'
                  : 'Padrão para animais assintomáticos. Segue para quarentenário sem sufixo clínico.'}
              </p>
            </div>

            {/* Opção 2: Internamento (-CL) */}
            <div
              onClick={() => {
                if (apresentaSinaisClinicos) setEncaminhamento('Internamento');
              }}
              className={`p-3 rounded-xl border transition-all ${
                !apresentaSinaisClinicos
                  ? 'opacity-40 bg-slate-50 border-slate-200 cursor-not-allowed'
                  : encaminhamento === 'Internamento'
                  ? 'border-rose-600 bg-rose-50/40 dark:bg-rose-950/20 ring-2 ring-rose-600/20 cursor-pointer'
                  : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-rose-700">2. Internamento (-CL)</span>
                {encaminhamento === 'Internamento' && <Check className="w-4 h-4 text-rose-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {!apresentaSinaisClinicos
                  ? 'Indisponível: reservado a animais com sinais clínicos ou lesões.'
                  : 'Gera sufixo -CL e abre prontuário clínico (TL003).'}
              </p>
            </div>

            {/* Opção 3: Isolamento */}
            <div
              onClick={() => {
                if (apresentaSinaisClinicos) setEncaminhamento('Isolamento');
              }}
              className={`p-3 rounded-xl border transition-all ${
                !apresentaSinaisClinicos
                  ? 'opacity-40 bg-slate-50 border-slate-200 cursor-not-allowed'
                  : encaminhamento === 'Isolamento'
                  ? 'border-amber-600 bg-amber-50/40 dark:bg-amber-950/20 ring-2 ring-amber-600/20 cursor-pointer'
                  : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-800">3. Isolamento</span>
                {encaminhamento === 'Isolamento' && <Check className="w-4 h-4 text-amber-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {!apresentaSinaisClinicos
                  ? 'Indisponível: reservado a animais com suspeita infectocontagiosa/sinais clínicos.'
                  : 'Suspeita infectocontagiosa ou risco sanitário elevado. Avaliação facultativa.'}
              </p>
            </div>

            {/* Opção 4: Óbito / Soltura imediata */}
            <div
              onClick={() => {
                if (condicaoEntrada === 'Óbito') {
                  setEncaminhamento('Óbito');
                } else if (!apresentaSinaisClinicos) {
                  setEncaminhamento('Soltura imediata');
                }
              }}
              className={`p-3 rounded-xl border transition-all ${
                condicaoEntrada !== 'Óbito' && apresentaSinaisClinicos
                  ? 'opacity-40 bg-slate-50 border-slate-200 cursor-not-allowed'
                  : (encaminhamento === 'Soltura imediata' || encaminhamento === 'Óbito')
                  ? 'border-slate-800 bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-400 cursor-pointer'
                  : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">
                  {condicaoEntrada === 'Óbito' ? '4. Registro de Óbito' : '4. Soltura Imediata'}
                </span>
                {(encaminhamento === 'Soltura imediata' || encaminhamento === 'Óbito') && (
                  <Check className="w-4 h-4 text-slate-800" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {condicaoEntrada === 'Óbito'
                  ? 'Gera código de carcaça e direciona para necropsia / descarte (TL005).'
                  : apresentaSinaisClinicos
                  ? 'Indisponível: animais com sinais clínicos não são aptos para soltura imediata.'
                  : 'Para animais saudáveis de vida livre aptos para soltura técnica direta.'}
              </p>
            </div>
          </div>

          {/* Observações da Triagem */}
          <InputWrapper label="Observações Técnicas da Triagem">
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Descreva detalhes comportamentais, escore de estresse ou recomendações específicas..."
              className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg"
            />
          </InputWrapper>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* MODAL MSG005: AVISO DE DIVERGÊNCIA DE ESPÉCIE */}
      {/* ========================================================================= */}
      <Dialog open={avisoDivergenciaEspecie} onOpenChange={setAvisoDivergenciaEspecie}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              MSG005: Divergência de Espécie Detectada
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-2">
              A espécie selecionada pelo técnico de triagem:{' '}
              <strong className="text-slate-900">
                {(() => {
                  const espSel = MOCK_ESPECIES.find((e) => e.id === especieId);
                  const nomeP = espSel?.nomesPopulares?.find((n) => n.principal)?.nome || espSel?.nomesPopulares?.[0]?.nome || espSel?.nomeCientifico;
                  return `${nomeP} (${espSel?.nomeCientifico})`;
                })()}
              </strong>{' '}
              diverge da declarada na lavratura do Termo de Recebimento:{' '}
              <strong className="text-slate-900">
                {linhaAtual?.especieNomePopular} ({linhaAtual?.especieNomeCientifico})
              </strong>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-2">
            <p>
              Conforme a RN-005 e RN-014, a reclassificação taxonômica é aceita mediante <strong>justificativa técnica obrigatória</strong>,
              mantendo a rastreabilidade com o TR original de admissão.
            </p>
            <InputWrapper label="Justificativa Técnica da Divergência Taxonômica *" required>
              <textarea
                rows={2}
                value={justificativaDivergenciaEspecie}
                onChange={(e) => setJustificativaDivergenciaEspecie(e.target.value)}
                placeholder="Ex: Identificação morfológica em exame detalhado divergente do pré-cadastro visual na apreensão..."
                className="w-full text-xs p-2 text-slate-800 bg-white border border-amber-300 rounded-lg"
              />
            </InputWrapper>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (linhaAtual) setEspecieId(linhaAtual.especieId);
                setJustificativaDivergenciaEspecie('');
                setAvisoDivergenciaEspecie(false);
              }}
            >
              Reverter para Espécie do TR
            </Button>
            <Button
              size="sm"
              disabled={!justificativaDivergenciaEspecie.trim()}
              onClick={() => {
                if (!justificativaDivergenciaEspecie.trim()) return;
                setAvisoDivergenciaEspecie(false);
              }}
              className="bg-amber-700 hover:bg-amber-800 text-white"
            >
              Confirmar Reclassificação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL MSG004: EXCESSO DE SALDO DO TR COM JUSTIFICATIVA OBRIGATÓRIA (CA006) */}
      {/* ========================================================================= */}
      <Dialog open={modalExcessoSaldoAberto} onOpenChange={setModalExcessoSaldoAberto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              MSG004: Saldo do TR Excedido
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-2">
              A quantidade individualizada na triagem excede o total registrado no Termo de Recebimento ({trAtual?.numeroTr}) para este lote.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 text-xs text-rose-900 space-y-2">
            <p>
              Conforme a <strong>RN-014</strong> e o critério <strong>CA006</strong>, a inclusão de espécime excedente à cota declarada
              exige justificativa técnica obrigatória para prosseguir.
            </p>
            <InputWrapper label="Justificativa Técnica do Excesso de Cota *" required>
              <textarea
                rows={2}
                value={justificativaExcessoSaldo}
                onChange={(e) => setJustificativaExcessoSaldo(e.target.value)}
                placeholder="Ex: Filhote camuflado na gaiola de transporte não contabilizado na contagem rápida inicial de lavratura..."
                className="w-full text-xs p-2 text-slate-800 bg-white border border-rose-300 rounded-lg"
              />
            </InputWrapper>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setModalExcessoSaldoAberto(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={!justificativaExcessoSaldo.trim()}
              onClick={() => {
                if (!justificativaExcessoSaldo.trim()) return;
                setModalExcessoSaldoAberto(false);
                handleSalvarTriagem();
              }}
              className="bg-rose-700 hover:bg-rose-800 text-white"
            >
              Prosseguir com Justificativa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL MSG011: ALERTA DE READMISSÃO */}
      {/* ========================================================================= */}
      <Dialog open={avisoReadmissaoModal} onOpenChange={setAvisoReadmissaoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-700">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              MSG011: Confirmação de Readmissão de Animal
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-2">
              Animal com identificação física / marcação já cadastrado no acervo do sistema:
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs space-y-1">
            <div className="font-bold text-indigo-900">
              Prontuário Anterior: <span className="font-mono">{readmissaoProntuarioDetectado}</span>
            </div>
            <div className="text-indigo-800">
              Marcação consultada:{' '}
              <span className="font-mono font-semibold">{novaMarcacaoNumero}</span>
            </div>
            <p className="text-[11px] text-slate-600 pt-1">
              Conforme a RN-006, o sistema vinculará o histórico preexistente ao novo Termo de Recebimento ({trAtual?.numeroTr}),
              registrando o evento como <strong>Readmissão Institucional</strong>.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setAvisoReadmissaoModal(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setMarcacoes((prev) => [
                  ...prev,
                  {
                    id: `marc-${Date.now()}`,
                    tipo: novaMarcacaoTipo,
                    numero: novaMarcacaoNumero.trim(),
                    dataAplicacao: new Date().toLocaleDateString('pt-BR'),
                    situacao: 'Ativa',
                  },
                ]);
                setNovaMarcacaoNumero('');
                setAvisoReadmissaoModal(false);
              }}
              className="bg-indigo-700 hover:bg-indigo-800 text-white"
            >
              Confirmar Readmissão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL DE SUCESSO E TRANSIÇÃO */}
      {/* ========================================================================= */}
      <Dialog open={sucessoModal} onOpenChange={setSucessoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0F4C3A]">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Triagem e Individualização Concluídas!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-2">
              O espécime foi individualizado e inserido com sucesso na base única de animais da fauna.
            </DialogDescription>
          </DialogHeader>

          {animalCriadoInfo && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Número Digital Oficial:</span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded border border-emerald-300">
                  {animalCriadoInfo.numeroDigital}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Termo de Recebimento:</span>
                <span className="font-mono font-semibold text-slate-800">{trAtual?.numeroTr}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Encaminhamento Pós-Triagem:</span>
                <Badge
                  variant="outline"
                  className={
                    animalCriadoInfo.encaminhamento === 'Internamento'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : animalCriadoInfo.encaminhamento === 'Óbito'
                      ? 'bg-slate-200 text-slate-900 border-slate-400'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }
                >
                  {animalCriadoInfo.encaminhamento}
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSucessoModal(false);
                onConcluirTriagem(animalCriadoInfo?.id || '', animalCriadoInfo?.encaminhamento || 'Quarentena');
              }}
            >
              Voltar ao Painel
            </Button>

            {animalCriadoInfo?.encaminhamento === 'Internamento' && onIrParaClinica && (
              <Button
                size="sm"
                onClick={() => {
                  setSucessoModal(false);
                  onIrParaClinica(animalCriadoInfo.id);
                }}
                className="bg-rose-700 hover:bg-rose-800 text-white"
              >
                <Stethoscope className="w-4 h-4 mr-1.5" />
                Ir para Avaliação Clínica (TL003)
              </Button>
            )}

            {animalCriadoInfo?.encaminhamento === 'Óbito' && onIrParaObito && (
              <Button
                size="sm"
                onClick={() => {
                  setSucessoModal(false);
                  onIrParaObito(animalCriadoInfo.id, trAtual?.numeroTr || '');
                }}
                className="bg-slate-900 hover:bg-black text-white"
              >
                <HeartCrack className="w-4 h-4 mr-1.5" />
                Registrar Óbito (TL005)
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
