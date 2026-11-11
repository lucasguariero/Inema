import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  Check,
  Send,
  FileText,
  AlertTriangle,
  Building,
  Printer,
  ShieldAlert,
  TreePine,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { Section } from '@/components/filament/Section';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
  MOCK_TERMOS_SOLTURA,
  gerarProximoNumeroTermoSoltura,
  registrarTransferenciaInterna,
  notificarAtualizacaoDadosFauna,
} from '@/data/faunaAdmissaoMock';
import {
  MOCK_ANIMAIS,
  MOCK_UNIDADES,
  AnimalItem,
} from '@/data/faunaMock';
import {
  TermoSolturaDestinacaoItem,
  DestinoFinalTipo,
} from '@/types/faunaAdmissao';
import {
  getAsasList,
  getGuardioesList,
  saveGuardiaoItem,
} from '@/data/faunaR3R4Mock';
import { AsasItem, GuardiaoItem, AnimalIndicadoGuardiao } from '@/types/faunaR3R4';

interface TermoSolturaEncerramentoPageProps {
  animalIdPreselecionado?: string;
  onVoltar: () => void;
  onConcluir?: (numeroTermo: string) => void;
}

export const TermoSolturaEncerramentoPage: React.FC<TermoSolturaEncerramentoPageProps> = ({
  animalIdPreselecionado,
  onVoltar,
  onConcluir,
}) => {
  // Lista de animais candidatos para saída/soltura
  const [animalSelecionadoId, setAnimalSelecionadoId] = useState<string>(
    animalIdPreselecionado || MOCK_ANIMAIS[0]?.id || ''
  );

  const animalAtual = useMemo(() => {
    return MOCK_ANIMAIS.find((a) => a.id === animalSelecionadoId) || MOCK_ANIMAIS[0];
  }, [animalSelecionadoId]);

  // RN-030, CA018, MSG010: Bloqueio de encerramento se animal internado sem desfecho
  const estaInternadoAtivo = useMemo(() => {
    return animalAtual?.status === 'Internado';
  }, [animalAtual]);

  // Número oficial do Termo gerado (RN-026, CA016)
  const [numeroTermo] = useState<string>(() => gerarProximoNumeroTermoSoltura(2026));

  // Form states
  const [destinacaoFinal, setDestinacaoFinal] = useState<DestinoFinalTipo>('Soltura');
  const [modalidadeTransferencia, setModalidadeTransferencia] = useState<'Interna' | 'Externa'>('Interna');
  const [unidadeDestinoInemaId, setUnidadeDestinoInemaId] = useState<string>('und-02');
  const [motivoTransferencia, setMotivoTransferencia] = useState<string>(
    'Continuidade do protocolo de reabilitação e aclimatação biológica em recinto de grande porte.'
  );

  const [dataSaida, setDataSaida] = useState<string>(new Date().toLocaleDateString('pt-BR'));
  const [localSaida, setLocalSaida] = useState<string>(
    'ASAS Fazenda Boa Esperança (Andaraí / Bacia Hidrográfica do Rio Paraguaçu)'
  );
  const [responsavelSaida, setResponsavelSaida] = useState<string>(
    'Dr. Thiago Moreira - CRMV/BA 5512'
  );
  const [condicaoAnimalSaida, setCondicaoAnimalSaida] = useState<string>(
    'Excelente condição física e sanitária, voo simétrico com plumagem íntegra. Teste de aversão e alimentação natural aprovado.'
  );
  const [instituicaoDestino, setInstituicaoDestino] = useState<string>(
    'ASAS Fazenda Boa Esperança'
  );
  const [observacoes, setObservacoes] = useState<string>(
    'Soltura branda com período de ambientação em recinto de aclimatação e monitoramento com telemetria.'
  );

  // Listas integradas com DR009 e DR012
  const listaAsas = useMemo(() => getAsasList(), []);
  const listaGuardioes = useMemo(() => getGuardioesList(), []);
  const [selectedAsasId, setSelectedAsasId] = useState<string>('asas-001');
  const [selectedGuardiaoId, setSelectedGuardiaoId] = useState<string>('guard-001');

  const selectedAsas = useMemo(() => {
    return listaAsas.find((a) => a.id === selectedAsasId);
  }, [listaAsas, selectedAsasId]);

  const selectedGuardiao = useMemo(() => {
    return listaGuardioes.find((g) => g.id === selectedGuardiaoId);
  }, [listaGuardioes, selectedGuardiaoId]);

  const handleSelectAsas = (asasId: string) => {
    setSelectedAsasId(asasId);
    const a = listaAsas.find((item) => item.id === asasId);
    if (a) {
      setLocalSaida(`${a.numero} — ${a.propriedade.nome} (${a.propriedade.municipio}/BA — ${a.propriedade.bioma})`);
      setInstituicaoDestino(a.propriedade.nome);
    }
  };

  const handleSelectGuardiao = (guardiaoId: string) => {
    setSelectedGuardiaoId(guardiaoId);
    const g = listaGuardioes.find((item) => item.id === guardiaoId);
    if (g) {
      setInstituicaoDestino(`Guardião: ${g.requerente.nomeOuRazaoSocial} (${g.requerente.cpfCnpj}) — TGAS: ${g.tgasVigente?.numero || 'Em processo'}`);
      setLocalSaida(`${g.recinto.endereco}, ${g.recinto.municipio}/BA`);
    }
  };

  // Modais e Feedback
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [sucessoModal, setSucessoModal] = useState<boolean>(false);
  const [transferenciaInternaConcluida, setTransferenciaInternaConcluida] = useState<boolean>(false);
  const [detalhesTransferencia, setDetalhesTransferencia] = useState<{
    origem: string;
    destino: string;
    data: string;
    responsavel: string;
    trNumero: string;
    numeroDigital: string;
    motivo: string;
  } | null>(null);
  const [mostrarPreviewDocumento, setMostrarPreviewDocumento] = useState<boolean>(false);

  // Unidades do INEMA para transferência interna (RN-037 / CA029)
  const unidadesInema = useMemo(() => {
    return MOCK_UNIDADES.filter(
      (u) => u.natureza === 'Unidade do INEMA' && u.id !== (animalAtual?.unidadeAtualId || 'und-01')
    );
  }, [animalAtual]);

  // Emissão do Termo de Soltura e Encerramento / Transferência Interna (RN-026, RN-030, RN-037, CA016, CA018, CA029)
  const handleEmitirTermo = () => {
    setErroValidacao(null);

    // RN-030 / CA018 / MSG010: Bloqueio estrito se o animal estiver internado para Saída Definitiva / TSD
    if (!isTransferenciaInterna && estaInternadoAtivo) {
      setErroValidacao(
        'MSG010: Não é possível emitir Termo de Soltura para animal com atendimento clínico pendente de desfecho. Conceda a Alta Médica no prontuário antes de prosseguir com a destinação.'
      );
      return;
    }

    if (!responsavelSaida.trim()) {
      setErroValidacao('Informe o profissional responsável técnico pela saída/movimentação.');
      return;
    }

    // =========================================================================
    // CASO 1: TRANSFERÊNCIA INTERNA ENTRE UNIDADES DO INEMA (RN-037, CA029)
    // =========================================================================
    if (destinacaoFinal === 'Transferência' && modalidadeTransferencia === 'Interna') {
      const unidadeOrigemId = animalAtual.unidadeAtualId || 'und-01';
      const unidadeOrigemNome = animalAtual.unidadeAtualNome || animalAtual.unidadeRegional || 'CETAS Salvador (Cabula)';

      if (!unidadeDestinoInemaId) {
        setErroValidacao('Selecione a unidade do INEMA destinatária da transferência.');
        return;
      }

      if (unidadeDestinoInemaId === unidadeOrigemId) {
        setErroValidacao(`A unidade de destino não pode ser a mesma unidade de origem (${unidadeOrigemNome}). Movimentação inválida.`);
        return;
      }

      const unidDestino = MOCK_UNIDADES.find((u) => u.id === unidadeDestinoInemaId);
      if (!unidDestino) {
        setErroValidacao('Selecione a unidade do INEMA destinatária da transferência.');
        return;
      }

      if (!motivoTransferencia.trim()) {
        setErroValidacao('Informe a justificativa técnica / motivo da transferência interna.');
        return;
      }

      const res = registrarTransferenciaInterna({
        animalId: animalAtual.id,
        unidadeDestinoId: unidadeDestinoInemaId,
        responsavel: responsavelSaida,
        motivo: motivoTransferencia,
        dataMovimentacao: dataSaida,
      });

      if (!res.sucesso) {
        setErroValidacao(res.mensagem);
        return;
      }

      setDetalhesTransferencia({
        origem: res.origemNome || unidadeOrigemNome,
        destino: res.destinoNome || unidDestino.nome,
        data: dataSaida,
        responsavel: responsavelSaida,
        trNumero: animalAtual.numeroTr || 'TR-N/A',
        numeroDigital: animalAtual.numeroDigital || animalAtual.codigo,
        motivo: motivoTransferencia,
      });
      notificarAtualizacaoDadosFauna();
      setTransferenciaInternaConcluida(true);
      setSucessoModal(true);
      return;
    }

    // =========================================================================
    // CASO 2: SOLTURA, TRANSFERÊNCIA EXTERNA, RECINTO OU GUARDIÃO (RN-026, RN-030)
    // =========================================================================
    if (!localSaida.trim()) {
      setErroValidacao('Informe o local de soltura/destino do animal.');
      return;
    }

    // RN-013 / CA017 / DR012: Animal destinado a Guardião deve ser inapto à soltura e possuir Laudo do CETAS
    if (destinacaoFinal === 'Guardião') {
      if (!animalAtual.candidatoGuarda) {
        setErroValidacao(
          'Validação Específica RN-013 (Portaria art. 16): O animal selecionado (' +
            animalAtual.especieNomePopular +
            ' - ' +
            (animalAtual.numeroDigital || animalAtual.codigo) +
            ') possui aptidão favorável para Soltura Plena em ASAS. A destinação a Guardião (TGAS) é privativa de animais com Laudo do CETAS atestando a impossibilidade definitiva de retorno à vida livre. Selecione um animal com laudo de inaptidão emitido (ex: ani-005 - Papagaio-verdadeiro).'
        );
        return;
      }
      if (!animalAtual.laudoVeterinarioAssinado && animalAtual.candidatoGuarda) {
        setErroValidacao(
          `MSG008: O animal ${animalAtual.numeroDigital || animalAtual.codigo} não possui Laudo Técnico do CETAS assinado. Emita ou anexe o laudo antes de vincular o animal. (RN-013)`
        );
        return;
      }
      if (!selectedGuardiaoId) {
        setErroValidacao('Selecione o guardião habilitado destinatário.');
        return;
      }
    }

    if (destinacaoFinal === 'Transferência' && modalidadeTransferencia === 'Externa' && !instituicaoDestino.trim()) {
      setErroValidacao('Informe a instituição externa destinatária para transferência externa.');
      return;
    }

    const marcacaoFormatada =
      animalAtual?.marcacoesFisicas && animalAtual.marcacoesFisicas.length > 0
        ? animalAtual.marcacoesFisicas.map((m) => `${m.tipo}-${m.numero}`).join(' · ')
        : 'Sem anilha/chip';

    const novoTermo: TermoSolturaDestinacaoItem = {
      id: `tsd-${Date.now()}`,
      numeroTermo,
      animalId: animalAtual.id,
      trNumero: animalAtual.numeroTr || 'TR-N/A',
      numeroDigital: animalAtual.numeroDigital || animalAtual.codigo,
      marcacao: marcacaoFormatada,
      dataSaida,
      localSaida,
      responsavelSaida,
      condicaoAnimalSaida,
      destinacaoFinal,
      modalidadeTransferencia: destinacaoFinal === 'Transferência' ? modalidadeTransferencia : undefined,
      instituicaoDestino: destinacaoFinal !== 'Soltura' ? instituicaoDestino : undefined,
      statusFinal: destinacaoFinal === 'Soltura' ? 'Soltura' : 'Destinação',
      observacoes,
    };

    MOCK_TERMOS_SOLTURA.unshift(novoTermo);
    notificarAtualizacaoDadosFauna();

    // Atualiza status do animal no acervo do DR008 para desfecho terminal (RN-030)
    animalAtual.status = destinacaoFinal === 'Soltura' ? 'Soltura' : 'Destinação';
    (animalAtual as unknown as Record<string, unknown>).destinacaoFinal = destinacaoFinal;

    // Se o desfecho for Guardião, atualiza o vínculo do animal no TGAS do guardião e decrementa vaga
    if (destinacaoFinal === 'Guardião') {
      const g = listaGuardioes.find((item) => item.id === selectedGuardiaoId);
      if (g && g.tgasVigente) {
        const jaVinculado = g.tgasVigente.animaisSobGuarda.some(
          (a) => a.animalId === animalAtual.id || a.numeroDigital === animalAtual.numeroDigital
        );
        if (!jaVinculado) {
          const novoVinculo: AnimalIndicadoGuardiao = {
            animalId: animalAtual.id,
            numeroDigital: animalAtual.numeroDigital || animalAtual.codigo,
            nomeComum: animalAtual.especieNomePopular,
            nomeCientifico: animalAtual.especieNomeCientifico || '',
            grupo: 'Aves',
            sexo: animalAtual.sexo || 'Indeterminado',
            tipoMarcacao: (animalAtual as unknown as { tipoMarcacao?: string }).tipoMarcacao || 'Anilha Fechada',
            codigoMarcacao: marcacaoFormatada,
            situacaoAnimal: 'Sob guarda',
            laudoTecnicoId: 'laudo-doc002-cetas-01',
            tsdNumero: numeroTermo
          };
          const guardiaoAtualizado: GuardiaoItem = {
            ...g,
            tgasVigente: {
              ...g.tgasVigente,
              animaisSobGuarda: [...g.tgasVigente.animaisSobGuarda, novoVinculo]
            }
          };
          saveGuardiaoItem(guardiaoAtualizado);
        }
      }
    }

    setTransferenciaInternaConcluida(false);
    setSucessoModal(true);
  };

  const isTransferenciaInterna = destinacaoFinal === 'Transferência' && modalidadeTransferencia === 'Interna';

  return (
    <div className="space-y-4 w-full pb-12">
      {/* Barra Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onVoltar}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Termo de Soltura e Destinação (TSD)
              </h1>
              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-800 border-emerald-300 font-mono">
                {isTransferenciaInterna ? 'Guia de Movimentação Interna' : numeroTermo}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTransferenciaInterna
                ? 'Transferência entre unidades do INEMA com preservação do TR original e histórico aberto (RN-037 & CA029).'
                : 'Encerramento oficial do ciclo de acolhimento do espécime com emissão do Termo de Soltura / Destinação Institucional.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={!isTransferenciaInterna && estaInternadoAtivo}
            onClick={handleEmitirTermo}
            className={`text-white shadow-sm font-semibold disabled:opacity-50 ${
              isTransferenciaInterna
                ? 'bg-indigo-700 hover:bg-indigo-800'
                : 'bg-[#0F4C3A] hover:bg-[#0c3d2e]'
            }`}
          >
            {isTransferenciaInterna ? (
              <>
                <Send className="w-4 h-4 mr-1.5" />
                Registrar Transferência Interna
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                Emitir TSD & Concluir Saída
              </>
            )}
          </Button>
        </div>
      </div>

      {/* BLOQUEIO DE ENCERRAMENTO (RN-030, CA018, MSG010) */}
      {!isTransferenciaInterna && estaInternadoAtivo && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 dark:border-rose-800 rounded-xl flex items-start gap-3 text-rose-900 dark:text-rose-200 text-xs">
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sm block">
              MSG010: Bloqueio de Encerramento — Atendimento Clínico Ativo
            </span>
            <p>
              Não é possível emitir Termo de Soltura ou Destinação para animal com status{' '}
              <strong className="underline">Internado</strong>. O espécime possui atendimento hospitalar ativo pendente
              de alta médica ou parecer de desfecho (RN-030 e CA018).
            </p>
            <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium pt-1">
              Para desbloquear a emissão, acerte o desfecho concedendo a <strong>Alta Médica</strong> na tela de Evolução
              Clínica (TL004).
            </p>
          </div>
        </div>
      )}

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

      {/* SELETOR DE ANIMAL */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <InputWrapper label="Selecione o Animal para Saída / Destinação *" required>
              <select
                data-testid="select-animal-saida"
                value={animalSelecionadoId}
                onChange={(e) => setAnimalSelecionadoId(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {MOCK_ANIMAIS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.numeroDigital || a.codigo} — {a.especieNomePopular} ({a.especieNomeCientifico}) — TR:{' '}
                    {a.numeroTr || 'S/N'} — Status: {a.status}
                  </option>
                ))}
              </select>
            </InputWrapper>
          </div>

          <div>
            <InputWrapper label="Número do Termo / Guia">
              <div className="h-9 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg flex items-center font-mono font-bold text-xs text-[#0F4C3A]">
                {isTransferenciaInterna ? `GUIA-INT-${animalAtual?.numeroTr || 'TR'}` : numeroTermo}
              </div>
            </InputWrapper>
          </div>
        </div>

        {/* Resumo do Animal Selecionado */}
        {animalAtual && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Número Digital:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {animalAtual.numeroDigital || animalAtual.codigo}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Espécie:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {animalAtual.especieNomePopular}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">TR Origem:</span>
              <span className="font-mono text-slate-700">{animalAtual.numeroTr || 'TR-N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Status Atual:</span>
              <Badge
                variant="outline"
                className={`font-semibold text-xs ${
                  animalAtual.status === 'Internado'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {animalAtual.status}
              </Badge>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Marcações Físicas:</span>
              <span className="font-mono text-slate-700">
                {animalAtual.marcacoesFisicas && animalAtual.marcacoesFisicas.length > 0
                  ? animalAtual.marcacoesFisicas.map((m) => `${m.tipo}-${m.numero}`).join(', ')
                  : 'S/ marcação'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 1. MODALIDADE DE DESTINAÇÃO FINAL */}
      <Section
        title="1. Modalidade e Diretriz de Destinação (RN-025, RN-026, RN-037)"
        description="Definição da natureza da saída do espécime sob custódia estadual."
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Opção 1: Soltura */}
            <div
              data-testid="card-soltura-tecnica"
              onClick={() => {
                setDestinacaoFinal('Soltura');
                const a = listaAsas.find((item) => item.id === selectedAsasId) || listaAsas[0];
                if (a) {
                  setLocalSaida(`${a.numero} — ${a.propriedade.nome} (${a.propriedade.municipio}/BA — ${a.propriedade.bioma})`);
                  setInstituicaoDestino(a.propriedade.nome);
                }
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                destinacaoFinal === 'Soltura'
                  ? 'border-[#0F4C3A] bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-[#0F4C3A]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <TreePine className="w-4 h-4 text-[#0F4C3A]" />
                  Soltura Técnica (ASAS)
                </span>
                {destinacaoFinal === 'Soltura' && <Check className="w-4 h-4 text-[#0F4C3A]" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Área de Soltura cadastrada pelo INEMA com anilhamento e monitoramento pós-soltura.
              </p>
            </div>

            {/* Opção 2: Recinto / Cativeiro */}
            <div
              onClick={() => setDestinacaoFinal('Recinto')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                destinacaoFinal === 'Recinto'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-indigo-600" />
                  Cativeiro / Zoológico
                </span>
                {destinacaoFinal === 'Recinto' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Zoológicos ou criadouros conservacionistas autorizados (animais sem aptidão para vida livre).
              </p>
            </div>

            {/* Opção 3: Transferência */}
            <div
              data-testid="card-transferencia"
              onClick={() => setDestinacaoFinal('Transferência')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                destinacaoFinal === 'Transferência'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-indigo-600" />
                  Transferência
                </span>
                {destinacaoFinal === 'Transferência' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Movimentação entre unidades do INEMA (sem novo TR) ou transferência externa (com TSD).
              </p>
            </div>

            {/* Opção 4: Guardião */}
            <div
              data-testid="card-guardiao-depositario"
              onClick={() => {
                setDestinacaoFinal('Guardião');
                const g = listaGuardioes.find((item) => item.id === selectedGuardiaoId) || listaGuardioes[0];
                if (g) {
                  setLocalSaida(`${g.recinto.endereco}, ${g.recinto.municipio}/BA`);
                  setInstituicaoDestino(`Guardião: ${g.requerente.nomeOuRazaoSocial} (${g.requerente.cpfCnpj}) — TGAS: ${g.tgasVigente?.numero || 'Em processo'}`);
                }
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                destinacaoFinal === 'Guardião'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Guardião de Fauna Silvestre (TGAS - DR012)
                </span>
                {destinacaoFinal === 'Guardião' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Guarda de animais não aptos à soltura sob responsabilidade de guardião habilitado com TGAS (DR012).
              </p>
            </div>
          </div>

          {/* Sub-Seleção Exclusiva para Transferência (RN-037 & CA029) */}
          {destinacaoFinal === 'Transferência' && (
            <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-indigo-600" />
                  Modalidade de Transferência (RN-037)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalidadeTransferencia('Interna')}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                      modalidadeTransferencia === 'Interna'
                        ? 'bg-indigo-700 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-indigo-900 border border-indigo-200'
                    }`}
                  >
                    Transferência Interna (Unidade do INEMA)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalidadeTransferencia('Externa')}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                      modalidadeTransferencia === 'Externa'
                        ? 'bg-indigo-700 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-indigo-900 border border-indigo-200'
                    }`}
                  >
                    Transferência Externa (Outra Instituição)
                  </button>
                </div>
              </div>

              {modalidadeTransferencia === 'Interna' ? (
                <div className="text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
                  <strong className="block text-indigo-950 dark:text-indigo-100 font-bold mb-1">
                    Diretriz Canônica RN-037 e Critério de Aceite CA029:
                  </strong>
                  Na transferência entre unidades do INEMA (ex.: CETAS Salvador para CETAS Recôncavo, CETAS Oeste ou Zoológico),{' '}
                  <strong>NÃO é gerado novo TR</strong>. O animal mantém o Número do TR inicial (
                  <span className="font-mono font-bold text-indigo-900">{animalAtual?.numeroTr || 'TR-N/A'}</span>) e o
                  Número Digital (<span className="font-mono font-bold text-indigo-900">{animalAtual?.numeroDigital || 'S/N'}</span>). A
                  movimentação é registrada no TR de origem com unidade de origem, unidade de destino, data e responsável.
                  A unidade de destino passa a visualizar o animal (RN-034) e o{' '}
                  <strong className="underline">histórico individual NÃO é encerrado</strong>.
                </div>
              ) : (
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <strong className="block text-slate-900 dark:text-white font-bold mb-1">
                    Transferência para Outra Instituição (RN-037 / RN-030):
                  </strong>
                  Na transferência para instituições externas (criadouros, universidades ou zoológicos fora do INEMA), é emitido
                  o <strong>Termo de Soltura/Destinação (RN-026)</strong> e o histórico é encerrado com o status final{' '}
                  <strong>Destinação (RN-030)</strong>.
                </div>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* 2. DADOS DO LOCAL / UNIDADE E RESPONSÁVEL TÉCNICO */}
      <Section
        title={isTransferenciaInterna ? '2. Unidades Envolvidas e Responsável pela Transferência Interna' : '2. Local da Soltura / Destino e Responsável Técnico'}
        description={isTransferenciaInterna ? 'Definição da unidade receptora do INEMA e averbação da movimentação no TR.' : 'Identificação da área geográfica ou instituição acolhedora e emissor do termo.'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {isTransferenciaInterna ? (
            <>
              <div>
                <InputWrapper label="Unidade de Origem (Atual)">
                  <input
                    type="text"
                    disabled
                    value={animalAtual?.unidadeAtualNome || 'CETAS Salvador (Cabula)'}
                    className="w-full h-9 text-xs px-2.5 text-slate-700 bg-slate-100 border border-slate-300 rounded-lg cursor-not-allowed font-medium"
                  />
                </InputWrapper>
              </div>

              <div className="sm:col-span-2">
                <InputWrapper label="Unidade do INEMA de Destino *" required>
                  <select
                    data-testid="select-unidade-destino-inema"
                    value={unidadeDestinoInemaId}
                    onChange={(e) => setUnidadeDestinoInemaId(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-900 bg-white border border-indigo-400 rounded-lg font-bold"
                  >
                    {unidadesInema.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} ({u.sigla}) — {u.municipio}/{u.uf}
                      </option>
                    ))}
                  </select>
                </InputWrapper>
              </div>

              <div>
                <InputWrapper label="Data da Transferência *" required>
                  <input
                    type="text"
                    value={dataSaida}
                    onChange={(e) => setDataSaida(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div className="sm:col-span-2">
                <InputWrapper label="Responsável pelo Transporte / Despacho *" required>
                  <input
                    type="text"
                    value={responsavelSaida}
                    onChange={(e) => setResponsavelSaida(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div className="sm:col-span-3">
                <InputWrapper label="Motivo / Justificativa da Transferência Interna *" required>
                  <textarea
                    rows={2}
                    value={motivoTransferencia}
                    onChange={(e) => setMotivoTransferencia(e.target.value)}
                    placeholder="Ex: Capacidade de recinto excedida no CETAS Salvador; transferência para o CETAS Recôncavo para reabilitação avançada."
                    className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>
            </>
          ) : (
            <>
              {destinacaoFinal === 'Soltura' && (
                <>
                  <div className="sm:col-span-2">
                    <InputWrapper label="Vincular a ASAS Cadastrada (DR009) *">
                      <select
                        value={selectedAsasId}
                        onChange={(e) => handleSelectAsas(e.target.value)}
                        className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-emerald-400 rounded-lg font-medium"
                      >
                        {listaAsas.map((a) => {
                          const isBloqueada = ['Suspensa', 'Desativada', 'Indeferida'].includes(a.situacao);
                          return (
                            <option
                              key={a.id}
                              value={a.id}
                              disabled={isBloqueada}
                            >
                              {a.numero} — {a.propriedade.nome} ({a.propriedade.municipio}/BA) — {a.categoria} [{a.situacao}]
                              {isBloqueada ? ' (Bloqueada)' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </InputWrapper>
                  </div>

                  <div>
                    <InputWrapper label="Status / Situação da ASAS">
                      <div className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            selectedAsas?.situacao === 'Ativa'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : selectedAsas?.situacao?.toLowerCase() === 'certificado vencido'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          {selectedAsas?.situacao || 'N/A'}
                        </Badge>
                      </div>
                    </InputWrapper>
                  </div>

                  {selectedAsas?.situacao?.toLowerCase() === 'certificado vencido' && (
                    <div
                      data-testid="alerta-msg011-certificado-vencido"
                      className="sm:col-span-3 p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs flex items-start gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>MSG011 (RN-026): Certificado Bienal Vencido</strong>
                        <p className="mt-0.5">
                          O certificado da ASAS {selectedAsas.numero} está vencido desde {selectedAsas.dataValidadeCertificado || '10/05/2026'}. Conforme a RN-026, a soltura pode ser registrada e a CGFAU será alertada.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {destinacaoFinal === 'Guardião' && (
                <>
                  <div className="sm:col-span-2">
                    <InputWrapper label="Vincular a Guardião Habilitado (DR012) *">
                      <select
                        data-testid="select-guardiao-tgas"
                        value={selectedGuardiaoId}
                        onChange={(e) => handleSelectGuardiao(e.target.value)}
                        className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-indigo-400 rounded-lg font-medium"
                      >
                        {listaGuardioes.map((g) => {
                          const cota = g.tgasVigente?.animaisSobGuarda?.length || 0;
                          const cotaCheia = cota >= 5;
                          const naoHabilitado = g.situacao !== 'Habilitado';
                          return (
                            <option
                              key={g.id}
                              value={g.id}
                              disabled={cotaCheia || naoHabilitado}
                            >
                              {g.numeroCadastro} — {g.requerente.nomeOuRazaoSocial} ({g.recinto.municipio}/BA) — Cota: {cota}/5
                              {cotaCheia ? ' (Cota 5/5 Cheia - RN-012)' : ''}
                              {naoHabilitado ? ' (Aguardando Habilitação)' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </InputWrapper>
                  </div>

                  <div>
                    <InputWrapper label="Cota Disponível (RN-012)">
                      <div
                        data-testid="badge-cota-guardiao"
                        className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-xs font-semibold text-indigo-900"
                      >
                        {selectedGuardiao ? `${5 - (selectedGuardiao.tgasVigente?.animaisSobGuarda?.length || 0)} vaga(s) restante(s)` : 'N/A'}
                      </div>
                    </InputWrapper>
                  </div>

                  {selectedGuardiao && (
                    <div
                      data-testid="card-info-guardiao-tgas"
                      className="sm:col-span-3 p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-950 text-xs flex items-start gap-2"
                    >
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Integração com DR012 — Guardião Habilitado (RN-012 / RN-017)</strong>
                        <p className="mt-0.5">
                          O Guardião {selectedGuardiao.requerente.nomeOuRazaoSocial} possui capacidade para {5 - (selectedGuardiao.tgasVigente?.animaisSobGuarda?.length || 0)} animal(is) adicional(is) (Cota atual: {selectedGuardiao.tgasVigente?.animaisSobGuarda?.length || 0}/5). A vinculação definitiva gera o Termo de Guarda de Animais Silvestres — TGAS Anexo III (RN-017 / DOC001).
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Verificação de Elegibilidade do Animal para Guardião (DR012 RN-013 / DOC002) */}
                  {!animalAtual?.candidatoGuarda ? (
                    <div
                      data-testid="alerta-incompatibilidade-guardiao"
                      className="sm:col-span-3 p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-950 text-xs flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-900">Incompatibilidade Biológica & Normativa (DR012 RN-013 / Portaria art. 16)</strong>
                        <p className="mt-0.5 text-rose-800">
                          O animal selecionado (<strong>{animalAtual?.especieNomePopular} - {animalAtual?.numeroDigital || animalAtual?.codigo}</strong>) possui parecer técnico favorável para <strong>Soltura Plena na Natureza em ASAS</strong> e plena capacidade de voo e vida livre. Conforme DR012 RN-013, a destinação a Guardião (TGAS) é privativa de animais com Laudo Técnico do CETAS justificando a <strong>impossibilidade definitiva de soltura</strong>.
                        </p>
                        <p className="mt-1 font-semibold text-rose-900">
                          Para destinar a Guardião, selecione um animal inapto para vida livre no seletor de animais no topo da tela (ex: Papagaio-verdadeiro - 000.045/2026).
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      data-testid="card-laudo-cetas-guardiao"
                      className="sm:col-span-3 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-950 text-xs flex items-start gap-2.5"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-900">Laudo Técnico do CETAS Homologado (DR012 RN-013 / DOC002)</strong>
                        <p className="mt-0.5 text-emerald-800">
                          Animal <strong>{animalAtual.especieNomePopular} ({animalAtual.numeroDigital})</strong> possui Laudo Técnico emitido pelo CETAS (Dr. Alberto Vinícius Dantas - CRMV/BA 3110) atestando: <em>"Animal senil com imprinting humano irreversível decorrente de longo cativeiro doméstico irregular e incapacidade de forrageamento independente. Inapto para vida livre. Apto para concessão de guarda sob TGAS."</em>
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-emerald-900">
                          <Badge variant="outline" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-300">
                            DOC002 Assinado
                          </Badge>
                          <span>Aptidão exclusiva para Termo de Guarda (TGAS)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="sm:col-span-2">
                <InputWrapper label={destinacaoFinal === 'Guardião' ? "Endereço do Recinto de Custódia (DR012) *" : "Local de Soltura / Área Cadastrada *"} required>
                  <input
                    data-testid="input-local-saida-destino"
                    type="text"
                    value={localSaida}
                    onChange={(e) => setLocalSaida(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div>
                <InputWrapper label="Data Efetiva da Saída *" required>
                  <input
                    type="text"
                    value={dataSaida}
                    onChange={(e) => setDataSaida(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div className="sm:col-span-2">
                <InputWrapper label="Responsável Técnico pela Emissão / Saída *" required>
                  <input
                    type="text"
                    value={responsavelSaida}
                    onChange={(e) => setResponsavelSaida(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              {destinacaoFinal !== 'Soltura' && (
                <div>
                  <InputWrapper label="Instituição / Depositário Destinatário *" required>
                    <input
                      data-testid="input-instituicao-destino"
                      type="text"
                      value={instituicaoDestino}
                      onChange={(e) => setInstituicaoDestino(e.target.value)}
                      className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                    />
                  </InputWrapper>
                </div>
              )}

              <div className="sm:col-span-3">
                <InputWrapper label="Parecer de Aptidão Biológica e Comportamental *" required>
                  <textarea
                    rows={2}
                    value={condicaoAnimalSaida}
                    onChange={(e) => setCondicaoAnimalSaida(e.target.value)}
                    className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div className="sm:col-span-3">
                <InputWrapper label="Observações e Protocolo de Destinação">
                  <textarea
                    rows={2}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>
            </>
          )}
        </div>
      </Section>

      {/* MODAL DE SUCESSO: DIFERENCIA TRANSFERÊNCIA INTERNA DE DESTINAÇÃO TERMINAL */}
      <Dialog open={sucessoModal} onOpenChange={setSucessoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0F4C3A]">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              {transferenciaInternaConcluida
                ? 'Transferência Interna Registrada com Sucesso!'
                : 'Termo de Soltura e Destinação (TSD) Emitido com Sucesso!'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-2">
              {transferenciaInternaConcluida
                ? 'A movimentação foi averbada no TR original com sucesso. Conforme a RN-037 e CA029, o histórico permanece aberto e o animal foi transferido na rede INEMA.'
                : 'O ciclo de admissão foi formalmente encerrado com a emissão do Termo de Soltura e Destinação (TSD - DR008).'}
            </DialogDescription>
          </DialogHeader>

          {transferenciaInternaConcluida && detalhesTransferencia ? (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-indigo-800 font-semibold">Tipo:</span>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-900 border-indigo-300">
                  Transferência Interna INEMA (RN-037)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">TR Preservado:</span>
                <span className="font-mono font-bold text-indigo-950 text-sm">
                  {detalhesTransferencia.trNumero}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Número Digital Preservado:</span>
                <span className="font-mono font-bold text-indigo-950 text-sm">
                  {detalhesTransferencia.numeroDigital}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Origem:</span>
                <span className="text-slate-800 font-medium">{detalhesTransferencia.origem}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Destino:</span>
                <span className="text-indigo-900 font-bold">{detalhesTransferencia.destino}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Responsável:</span>
                <span className="text-slate-800">{detalhesTransferencia.responsavel}</span>
              </div>
              <div className="text-[11px] text-indigo-800 pt-1 border-t border-indigo-200">
                <strong>Status do Histórico:</strong> Aberto (Visibilidade transferida para {detalhesTransferencia.destino})
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-emerald-200 pb-1.5">
                <span className="text-emerald-900 font-bold">Documento Emitido:</span>
                <Badge variant="outline" className="bg-emerald-100 text-[#0F4C3A] border-emerald-300 font-bold">
                  TSD — Termo de Soltura e Destinação (DR008)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Número Oficial do TSD:</span>
                <span className="font-mono font-bold text-[#0F4C3A] text-sm" data-testid="span-numero-oficial-tsd">{numeroTermo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Espécime Destinado:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {animalAtual?.especieNomePopular} ({animalAtual?.numeroDigital || animalAtual?.codigo})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Modalidade:</span>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-900 border-emerald-300">
                  {destinacaoFinal === 'Guardião' ? 'Guardião de Fauna Silvestre (TGAS - DR012)' : destinacaoFinal}
                </Badge>
              </div>
              {destinacaoFinal === 'Guardião' ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Guardião Habilitado:</span>
                    <span className="font-semibold text-slate-900">Dr. Marcelo Ribeiro Sampaio</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Vínculo ao Termo TGAS:</span>
                    <span className="font-mono font-bold text-indigo-900">TGAS-2026/0012 (Averbado)</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-emerald-200 pt-1 text-[11px]">
                    <span className="text-slate-600">Cota Atualizada:</span>
                    <span className="font-semibold text-emerald-800">3 de 5 animais ocupados (2 vagas restantes)</span>
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-slate-600 pt-1 border-t border-emerald-200">
                  <strong>Local de Soltura:</strong> {localSaida}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {!transferenciaInternaConcluida && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSucessoModal(false);
                  setMostrarPreviewDocumento(true);
                }}
              >
                <Printer className="w-4 h-4 mr-1.5" />
                Visualizar Termo Impresso
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => {
                setSucessoModal(false);
                if (onConcluir) onConcluir(numeroTermo);
                else onVoltar();
              }}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
            >
              Voltar ao Painel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
