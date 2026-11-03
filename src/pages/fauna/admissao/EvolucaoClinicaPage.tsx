import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  Activity,
  Plus,
  Check,
  AlertCircle,
  Clock,
  HeartCrack,
  Send,
  Calendar,
  User,
  Scale,
  FileCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { Section } from '@/components/filament/Section';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
  MOCK_EVOLUCOES_CLINICAS,
  notificarAtualizacaoDadosFauna,
} from '@/data/faunaAdmissaoMock';
import {
  MOCK_ANIMAIS,
  AnimalItem,
  StatusAnimal,
} from '@/data/faunaMock';
import {
  EvolucaoClinicaItem,
  DesfechoClinicoTipo,
  DestinoFinalTipo,
} from '@/types/faunaAdmissao';

interface EvolucaoClinicaPageProps {
  animalIdPreselecionado?: string;
  onVoltar: () => void;
  onIrParaAvaliacao?: (animalId: string) => void;
  onIrParaObito?: (animalId: string, trNumero: string) => void;
  onIrParaSoltura?: (animalId: string) => void;
}

export const EvolucaoClinicaPage: React.FC<EvolucaoClinicaPageProps> = ({
  animalIdPreselecionado,
  onVoltar,
  onIrParaAvaliacao,
  onIrParaObito,
  onIrParaSoltura,
}) => {
  // Animais internados ou em tratamento
  const animaisComHistoricoClinico = useMemo(() => {
    return MOCK_ANIMAIS.filter(
      (a) =>
        a.sufixoCl ||
        a.status === 'Internado' ||
        a.status === 'Alta Médica' ||
        a.status === 'Em isolamento' ||
        a.status === 'Em quarentena'
    );
  }, []);

  const [animalSelecionadoId, setAnimalSelecionadoId] = useState<string>(
    animalIdPreselecionado || animaisComHistoricoClinico[0]?.id || MOCK_ANIMAIS[1]?.id || ''
  );

  const animalAtual = useMemo(() => {
    return (
      MOCK_ANIMAIS.find((a) => a.id === animalSelecionadoId) ||
      animaisComHistoricoClinico[0] ||
      MOCK_ANIMAIS[1]
    );
  }, [animalSelecionadoId, animaisComHistoricoClinico]);

  // Lista de evoluções do animal selecionado
  const evolucoesDoAnimal = useMemo(() => {
    return MOCK_EVOLUCOES_CLINICAS.filter((evo) => evo.animalId === animalAtual?.id);
  }, [animalAtual]);

  // Form de Nova Evolução
  const [modalNovaEvolucao, setModalNovaEvolucao] = useState<boolean>(false);
  const [novoVeterinario, setNovoVeterinario] = useState<string>('Dra. Gabriela Santos (CRMV/BA 4821)');
  const [novoPesoKg, setNovoPesoKg] = useState<string>('10.25');
  const [novoTratamento, setNovoTratamento] = useState<string>('Manutenção de polivitamínico e curativo diário.');
  const [novaConduta, setNovaConduta] = useState<string>('Aferição de deambulação e repouso orientado.');
  const [novaEvolucaoTexto, setNovaEvolucaoTexto] = useState<string>(
    'Animal ativo, alimentando-se normalmente com boa aceitação. Apoio pleno do membro pélvico.'
  );
  const [novasObservacoes, setNovasObservacoes] = useState<string>('');

  // Painel de Desfecho Clínico (RN-024, RN-025, CA027)
  const [tipoDesfecho, setTipoDesfecho] = useState<DesfechoClinicoTipo>('Alta Médica');
  const [subTipoDestino, setSubTipoDestino] = useState<DestinoFinalTipo>('Soltura');
  const [destinoDescricao, setDestinoDescricao] = useState<string>('Recinto de Reabilitação e Aclimação de Carnívoros');
  const [justificativaAlta, setJustificativaAlta] = useState<string>(
    'Paciente restabelecido clínica e funcionalmente. Consolidação óssea completa e ausência de dor ou claudicação.'
  );
  const [modalConfirmacaoAlta, setModalConfirmacaoAlta] = useState<boolean>(false);
  const [sucessoMensagem, setSucessoMensagem] = useState<string | null>(null);

  // Adicionar Nova Evolução
  const handleAdicionarEvolucao = () => {
    if (!novoTratamento.trim() || !novaConduta.trim() || !novaEvolucaoTexto.trim()) {
      return;
    }

    const novaEvo: EvolucaoClinicaItem = {
      id: `evo-${Date.now()}`,
      animalId: animalAtual.id,
      dataHora: `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      veterinario: novoVeterinario,
      pesoKg: parseFloat(novoPesoKg) || undefined,
      tratamento: novoTratamento,
      conduta: novaConduta,
      evolucao: novaEvolucaoTexto,
      observacoes: novasObservacoes || undefined,
    };

    MOCK_EVOLUCOES_CLINICAS.unshift(novaEvo);
    notificarAtualizacaoDadosFauna();
    setModalNovaEvolucao(false);
    setSucessoMensagem('Evolução clínica registrada com sucesso no prontuário do paciente!');
  };

  // Confirmar Desfecho de Alta Médica (RN-025, CA027)
  const handleConfirmarAltaMedica = () => {
    if (!animalAtual) return;

    // Atualiza status do animal para 'Alta Médica' (NÃO emite soltura e NÃO encerra histórico)
    animalAtual.status = 'Alta Médica';

    // Grava como evolução final de alta
    const evoAlta: EvolucaoClinicaItem = {
      id: `evo-${Date.now()}`,
      animalId: animalAtual.id,
      dataHora: `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      veterinario: novoVeterinario,
      pesoKg: parseFloat(novoPesoKg) || undefined,
      tratamento: 'Alta médica hospitalar concedida.',
      conduta: 'Encaminhamento para recinto de manutenção/reabilitação para posterior destinação.',
      evolucao: `ALTA MÉDICA HOSPITALAR: ${justificativaAlta}`,
      observacoes: 'Animal liberado do internamento clínico. Permanece sob custódia aguardando destinação técnica (RN-025).',
    };
    MOCK_EVOLUCOES_CLINICAS.unshift(evoAlta);
    notificarAtualizacaoDadosFauna();

    setModalConfirmacaoAlta(false);
    setSucessoMensagem(
      'Alta Médica formalizada com sucesso! O animal teve seu status atualizado para "Alta Médica" e permanece sob custódia até destinação posterior (RN-025, CA027).'
    );
  };

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
                TL004 — Evolução Clínica e Desfecho Hospitalar
              </h1>
              <Badge variant="outline" className="text-xs bg-rose-50 text-rose-800 border-rose-300 font-mono">
                {animalAtual?.numeroDigital || animalAtual?.codigo}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Acompanhamento diário da internação, procedimentos terapêuticos e parecer de alta médica ou destinação.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onIrParaAvaliacao && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onIrParaAvaliacao(animalAtual.id)}
              className="text-slate-700 border-slate-300"
            >
              Ficha Clínica (TL003)
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => setModalNovaEvolucao(true)}
            className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nova Evolução Diária
          </Button>
        </div>
      </div>

      {/* Sucesso / Feedback */}
      {sucessoMensagem && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-lg flex items-center justify-between gap-2 text-emerald-800 dark:text-emerald-300 text-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{sucessoMensagem}</span>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setSucessoMensagem(null)}
            className="text-emerald-700"
          >
            Fechar
          </Button>
        </div>
      )}

      {/* SELETOR DE ANIMAL E CABEÇALHO */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full sm:w-2/3">
            <InputWrapper label="Selecione o Animal em Tratamento Clínico" required>
              <select
                value={animalSelecionadoId}
                onChange={(e) => setAnimalSelecionadoId(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {animaisComHistoricoClinico.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.numeroDigital || a.codigo} — {a.especieNomePopular} ({a.especieNomeCientifico}) — TR:{' '}
                    {a.numeroTr || 'S/N'} — Status: {a.status}
                  </option>
                ))}
              </select>
            </InputWrapper>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Status Clínico Atual:</span>
            <Badge
              variant="outline"
              className={`font-bold px-2.5 py-1 text-xs ${
                animalAtual?.status === 'Alta Médica'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}
            >
              {animalAtual?.status}
            </Badge>
          </div>
        </div>

        {/* Resumo Rápido */}
        {animalAtual && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Prontuário Digital:</span>
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
              <span className="text-slate-500 block text-[11px]">Condição Entrada:</span>
              <span className="text-slate-800 dark:text-slate-200">{animalAtual.condicaoEntrada}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Atitude Clínica:</span>
              <span className="text-slate-800 dark:text-slate-200">{animalAtual.atitude || 'Hipoativo'}</span>
            </div>
          </div>
        )}
      </div>

      {/* 1. TIMELINE DE EVOLUÇÕES CLÍNICAS ACUMULADAS (RN-023) */}
      <Section
        title={`1. Histórico Cronológico de Evoluções Clínicas (${evolucoesDoAnimal.length} registros)`}
        description="Acompanhamento diário da evolução terapêutica, prescrições ministradas e parâmetros biométricos."
      >
        <div className="space-y-4 pt-2">
          {evolucoesDoAnimal.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
              Nenhuma evolução clínica registrada ainda para este paciente. Clique em "Nova Evolução Diária" para iniciar.
            </div>
          ) : (
            <div className="relative border-l-2 border-emerald-500/30 ml-4 space-y-6 py-2">
              {evolucoesDoAnimal.map((evo, idx) => (
                <div key={evo.id} className="relative pl-6">
                  {/* Ponto na timeline */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0F4C3A] border-2 border-white shadow-xs" />

                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5">
                    {/* Linha de topo */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs border-b border-slate-100 dark:border-slate-700/60 pb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{evo.dataHora}</span>
                        {idx === 0 && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px]">
                            Última Evolução
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                        {evo.pesoKg && (
                          <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
                            <Scale className="w-3.5 h-3.5 text-slate-400" />
                            {evo.pesoKg} kg
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {evo.veterinario}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                          Tratamento / Medicamentos:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                          {evo.tratamento}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                          Conduta Terapêutica:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                          {evo.conduta}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                          Parecer e Evolução Clínica:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800 font-medium">
                          {evo.evolucao}
                        </p>
                      </div>
                    </div>

                    {evo.observacoes && (
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <strong>Obs:</strong> {evo.observacoes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* 2. PAINEL DE DESFECHO CLÍNICO (RN-024, RN-025, RN-027, CA027) */}
      <Section
        title="2. Desfecho Hospitalar / Alta Clínica e Destinação"
        description="Formalização do desfecho do internamento. A Alta Médica atesta a recuperação clínica mas NÃO emite soltura nem encerra a guarda institucional (RN-025, CA027)."
      >
        <div className="space-y-4 pt-2">
          {/* Seletor de Tipo de Desfecho */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Opção 1: Alta Médica */}
            <div
              data-testid="card-alta-medica"
              onClick={() => setTipoDesfecho('Alta Médica')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                tipoDesfecho === 'Alta Médica'
                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  1. Alta Médica Hospitalar
                </span>
                {tipoDesfecho === 'Alta Médica' && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Animal clinicamente recuperado. Status muda para "Alta Médica" e permanece sob custódia na unidade (RN-025).
              </p>
            </div>

            {/* Opção 2: Destinação / Soltura */}
            <div
              onClick={() => setTipoDesfecho('Destinação')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                tipoDesfecho === 'Destinação'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-indigo-600" />
                  2. Destinação / Soltura
                </span>
                {tipoDesfecho === 'Destinação' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Encaminhamento para Termo de Soltura e Destinação (TL006), ASAS ou transferência interestadual.
              </p>
            </div>

            {/* Opção 3: Óbito na Clínica */}
            <div
              onClick={() => setTipoDesfecho('Óbito')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                tipoDesfecho === 'Óbito'
                  ? 'border-slate-800 bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-400'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <HeartCrack className="w-4 h-4 text-rose-600" />
                  3. Óbito Durante Internamento
                </span>
                {tipoDesfecho === 'Óbito' && <Check className="w-4 h-4 text-slate-800" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Constatação de óbito hospitalar. Direciona para TL005 com geração do código de cadáver [Nº TR]-OB00.
              </p>
            </div>
          </div>

          {/* Painel Específico: ALTA MÉDICA (RN-025, CA027) */}
          {tipoDesfecho === 'Alta Médica' && (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
                <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-950 font-bold mb-0.5">
                    Regra Institucional RN-025 & Critério de Aceite CA027:
                  </strong>
                  A <strong>Alta Médica</strong> comprova exclusivamente o encerramento do protocolo terapêutico e a
                  recuperação da aptidão física do paciente. Ela <strong>NÃO</strong> emite Termo de Soltura/Destinação e{' '}
                  <strong>NÃO</strong> encerra o histórico do animal. O espécime permanece registrado com status{' '}
                  <strong className="underline">Alta Médica</strong> até posterior destinação técnica.
                </div>
              </div>

              <InputWrapper label="Parecer Justificativo da Alta Médica *" required>
                <textarea
                  rows={3}
                  value={justificativaAlta}
                  onChange={(e) => setJustificativaAlta(e.target.value)}
                  className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg"
                />
              </InputWrapper>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  onClick={() => setModalConfirmacaoAlta(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                >
                  <FileCheck className="w-4 h-4 mr-1.5" />
                  Formalizar Alta Médica Hospitalar
                </Button>
              </div>
            </div>
          )}

          {/* Painel Específico: DESTINAÇÃO */}
          {tipoDesfecho === 'Destinação' && (
            <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-200 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputWrapper label="Modalidade de Destinação">
                  <select
                    value={subTipoDestino}
                    onChange={(e) => setSubTipoDestino(e.target.value as DestinoFinalTipo)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Soltura">Soltura Técnica / Monitorada</option>
                    <option value="Recinto">Recinto de Manutenção / Aclimação</option>
                    <option value="Transferência">Transferência Interinstitucional</option>
                    <option value="Guardião">Fiel Depositário / Termo de Guarda</option>
                  </select>
                </InputWrapper>

                <InputWrapper label="Local de Destino / Propriedade">
                  <input
                    type="text"
                    value={destinoDescricao}
                    onChange={(e) => setDestinoDescricao(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div className="flex justify-end pt-2">
                {subTipoDestino === 'Soltura' && onIrParaSoltura ? (
                  <Button
                    size="sm"
                    onClick={() => onIrParaSoltura(animalAtual.id)}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white"
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    Emitir Termo de Soltura e Destinação (TL006)
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      animalAtual.status = 'Destinação';
                      setSucessoMensagem('Destinação registrada no prontuário!');
                    }}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    Registrar Encaminhamento
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Painel Específico: ÓBITO */}
          {tipoDesfecho === 'Óbito' && (
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 space-y-3 text-xs">
              <p className="text-slate-700">
                O registro de óbito hospitalar exige lavratura formal com geração automática da numeração de cadáver{' '}
                <strong className="font-mono">{animalAtual?.numeroTr || 'TR'}-OBxx</strong>, laudo necroscópico e destinação da carcaça.
              </p>

              <div className="flex justify-end pt-2">
                {onIrParaObito && (
                  <Button
                    size="sm"
                    onClick={() => onIrParaObito(animalAtual.id, animalAtual.numeroTr || '')}
                    className="bg-slate-900 hover:bg-black text-white"
                  >
                    <HeartCrack className="w-4 h-4 mr-1.5" />
                    Ir para Registro de Óbito (TL005)
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* MODAL: NOVA EVOLUÇÃO DIÁRIA */}
      {/* ========================================================================= */}
      <Dialog open={modalNovaEvolucao} onOpenChange={setModalNovaEvolucao}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0F4C3A]">
              <Activity className="w-5 h-5 text-emerald-600" />
              Nova Evolução Clínica Diária
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-1">
              Registro terapêutico do paciente{' '}
              <strong className="font-mono">{animalAtual?.numeroDigital || animalAtual?.codigo}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <InputWrapper label="Veterinário Responsável *" required>
                <input
                  type="text"
                  value={novoVeterinario}
                  onChange={(e) => setNovoVeterinario(e.target.value)}
                  className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                />
              </InputWrapper>

              <InputWrapper label="Peso Atual (kg)" hint="Aferição do dia">
                <input
                  type="text"
                  value={novoPesoKg}
                  onChange={(e) => setNovoPesoKg(e.target.value)}
                  className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg font-mono"
                />
              </InputWrapper>
            </div>

            <InputWrapper label="Tratamento / Medicamentos Ministrados *" required>
              <input
                type="text"
                value={novoTratamento}
                onChange={(e) => setNovoTratamento(e.target.value)}
                placeholder="Ex: Enrofloxacina 5mg/kg IM, Meloxicam 0.1mg/kg oral"
                className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
              />
            </InputWrapper>

            <InputWrapper label="Conduta Imediata *" required>
              <input
                type="text"
                value={novaConduta}
                onChange={(e) => setNovaConduta(e.target.value)}
                placeholder="Ex: Troca de curativo cirúrgico, manter imobilização"
                className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
              />
            </InputWrapper>

            <InputWrapper label="Parecer da Evolução Clínica *" required>
              <textarea
                rows={3}
                value={novaEvolucaoTexto}
                onChange={(e) => setNovaEvolucaoTexto(e.target.value)}
                placeholder="Descreva apetite, fezes, movimentação, cicatrização e resposta à medicação..."
                className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg"
              />
            </InputWrapper>

            <InputWrapper label="Observações Adicionais">
              <input
                type="text"
                value={novasObservacoes}
                onChange={(e) => setNovasObservacoes(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
              />
            </InputWrapper>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setModalNovaEvolucao(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleAdicionarEvolucao}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
            >
              Salvar Evolução
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL: CONFIRMAÇÃO DE ALTA MÉDICA (RN-025, CA027) */}
      {/* ========================================================================= */}
      <Dialog open={modalConfirmacaoAlta} onOpenChange={setModalConfirmacaoAlta}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-800">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Confirmação de Alta Médica (RN-025)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-2">
              Você está prestes a conceder Alta Médica ao paciente{' '}
              <strong className="font-mono">{animalAtual?.numeroDigital || animalAtual?.codigo}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1.5 text-emerald-950">
            <div className="font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Critério de Aceite CA027 Verificado:
            </div>
            <p className="text-[11px] text-slate-600">
              O status do animal será modificado para <strong>Alta Médica</strong>. O espécime não receberá Termo de Soltura nesta etapa e
              continuará sob custódia do INEMA na unidade aguardando deliberação de destinação.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setModalConfirmacaoAlta(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmarAltaMedica}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
            >
              Confirmar Alta Médica
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
