import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  Check,
  Stethoscope,
  Activity,
  FileText,
  Upload,
  Paperclip,
  Trash2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { Section } from '@/components/filament/Section';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
  MOCK_AVALIACOES_CLINICAS,
} from '@/data/faunaAdmissaoMock';
import {
  MOCK_ANIMAIS,
  AnimalItem,
} from '@/data/faunaMock';
import {
  AvaliacaoClinicaItem,
  AtitudeClinica,
  TemperamentoClinico,
  EstadoNutricionalClinico,
  HidratacaoClinica,
  ExameComplementarTipo,
  EXAMES_COMPLEMENTARES_LISTA,
  LaudoExameAnexo,
} from '@/types/faunaAdmissao';

interface AvaliacaoClinicaPageProps {
  animalIdPreselecionado?: string;
  onVoltar: () => void;
  onIrParaEvolucao?: (animalId: string) => void;
}

export const AvaliacaoClinicaPage: React.FC<AvaliacaoClinicaPageProps> = ({
  animalIdPreselecionado,
  onVoltar,
  onIrParaEvolucao,
}) => {
  // Lista de animais elegíveis para avaliação clínica (com -CL ou internados ou quarentena/isolamento)
  const animaisElegiveis = useMemo(() => {
    return MOCK_ANIMAIS.filter(
      (a) =>
        a.sufixoCl ||
        a.status === 'Internado' ||
        a.status === 'Em isolamento' ||
        a.status === 'Em quarentena' ||
        a.codigo.includes('-CL')
    );
  }, []);

  const [animalSelecionadoId, setAnimalSelecionadoId] = useState<string>(
    animalIdPreselecionado || animaisElegiveis[0]?.id || MOCK_ANIMAIS[1]?.id || ''
  );

  const animalAtual = useMemo(() => {
    return MOCK_ANIMAIS.find((a) => a.id === animalSelecionadoId) || animaisElegiveis[0] || MOCK_ANIMAIS[1];
  }, [animalSelecionadoId, animaisElegiveis]);

  // Avaliação preexistente (se houver)
  const avaliacaoExistente = useMemo(() => {
    return MOCK_AVALIACOES_CLINICAS.find((av) => av.animalId === animalAtual?.id);
  }, [animalAtual]);

  // Form states (RN-021, RN-022)
  const [veterinarioResponsavel, setVeterinarioResponsavel] = useState<string>(
    avaliacaoExistente?.veterinarioResponsavel || 'Dr. Alberto Vinícius Dantas'
  );
  const [crmv, setCrmv] = useState<string>(avaliacaoExistente?.crmv || 'CRMV/BA 3110');
  const [dataEntradaClinica, setDataEntradaClinica] = useState<string>(
    avaliacaoExistente?.dataEntradaClinica || new Date().toLocaleDateString('pt-BR')
  );

  // Parâmetros obrigatórios específicos (RN-022)
  const [atitude, setAtitude] = useState<AtitudeClinica>(
    avaliacaoExistente?.atitude || (animalAtual?.atitude as AtitudeClinica) || 'Hipoativo'
  );
  const [temperamento, setTemperamento] = useState<TemperamentoClinico>(
    avaliacaoExistente?.temperamento || 'Em alerta'
  );
  const [estadoNutricional, setEstadoNutricional] = useState<EstadoNutricionalClinico>(
    avaliacaoExistente?.estadoNutricional || 'Magro'
  );
  const [hidratacao, setHidratacao] = useState<HidratacaoClinica>(
    avaliacaoExistente?.hidratacao || 'Desidratado'
  );
  const [grauDesidratacao, setGrauDesidratacao] = useState<string>(
    avaliacaoExistente?.grauDesidratacao || 'Desidratação moderada estimada em 6% a 8%'
  );

  // Anamnese e Exame Físico (Campo Único)
  const [anamnese, setAnamnese] = useState<string>(
    avaliacaoExistente?.anamneseHistorico ||
      'Animal apreendido em trânsito com sinais de traumatismo em membro pélvico. Histórico de trauma contuso.'
  );
  const [exameFisico, setExameFisico] = useState<string>(
    avaliacaoExistente?.exameFisico ||
      'Mucosas hipocoradas, turgor cutâneo reduzido. À palpação de membro pélvico, constata-se dor aguda, crepitação e edema local.'
  );

  // Exames Complementares (RN-022, CA026)
  const [examesComplementares, setExamesComplementares] = useState<ExameComplementarTipo[]>(
    avaliacaoExistente?.examesComplementares || ['Imagem', 'Hemograma']
  );
  const [examesOutrosDescricao, setExamesOutrosDescricao] = useState<string>(
    avaliacaoExistente?.examesOutrosDescricao || ''
  );

  // Laudos / Anexos
  const [laudos, setLaudos] = useState<LaudoExameAnexo[]>(
    avaliacaoExistente?.laudos || [
      {
        id: 'laud-01',
        exameTipo: 'Imagem (Radiografia Digital)',
        arquivoNome: 'RX_LEOPARDUS_FEMUR_ESQ_20261012.pdf',
        tamanhoKb: 1420,
        dataUpload: '12/10/2026 17:30',
      },
    ]
  );
  const [novoLaudoTipo, setNovoLaudoTipo] = useState<string>('Hemograma Completo');
  const [novoLaudoNome, setNovoLaudoNome] = useState<string>('Laudo_Hemograma_2026.pdf');

  // Diagnósticos e Conduta
  const [diagnosticoSuspeito, setDiagnosticoSuspeito] = useState<string>(
    avaliacaoExistente?.diagnosticoSuspeito || 'Fratura óssea fechada em membro pélvico.'
  );
  const [diagnosticoDefinitivo, setDiagnosticoDefinitivo] = useState<string>(
    avaliacaoExistente?.diagnosticoDefinitivo || 'Fratura diafisária completa do fêmur esquerdo.'
  );
  const [condutaClinica, setCondutaClinica] = useState<string>(
    avaliacaoExistente?.condutaClinica ||
      'Imobilização provisória, analgesia com cloridrato de tramadol 3mg/kg e anti-inflamatório. Preparo para procedimento cirúrgico ortopédico.'
  );
  const [restricoes, setRestricoes] = useState<string>(
    avaliacaoExistente?.restricoes || 'Acomodação estrita em recinto de contenção clínica, sem poleiro alto.'
  );
  const [observacoes, setObservacoes] = useState<string>(avaliacaoExistente?.observacoes || '');

  // Feedback e Erros
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [sucessoModal, setSucessoModal] = useState<boolean>(false);

  // Toggle exame complementar
  const handleToggleExame = (tipo: ExameComplementarTipo) => {
    if (examesComplementares.includes(tipo)) {
      setExamesComplementares((prev) => prev.filter((t) => t !== tipo));
    } else {
      setExamesComplementares((prev) => [...prev, tipo]);
    }
  };

  // Simular upload de laudo
  const handleAdicionarLaudo = () => {
    if (!novoLaudoNome.trim()) return;
    setLaudos((prev) => [
      ...prev,
      {
        id: `laud-${Date.now()}`,
        exameTipo: novoLaudoTipo,
        arquivoNome: novoLaudoNome.trim(),
        tamanhoKb: Math.floor(Math.random() * 800) + 200,
        dataUpload: new Date().toLocaleDateString('pt-BR'),
      },
    ]);
    setNovoLaudoNome('');
  };

  const handleRemoverLaudo = (id: string) => {
    setLaudos((prev) => prev.filter((l) => l.id !== id));
  };

  // Salvar Avaliação Clínica
  const handleSalvar = () => {
    setErroValidacao(null);

    // Validação de CRMV e Veterinário
    if (!veterinarioResponsavel.trim() || !crmv.trim()) {
      setErroValidacao('Informe o nome do médico veterinário responsável e o respectivo número de CRMV.');
      return;
    }

    // CA026: Se selecionar "Outros" em exames complementares, a descrição textual é OBRIGATÓRIA
    if (examesComplementares.includes('Outros') && !examesOutrosDescricao.trim()) {
      setErroValidacao('CA026: A opção "Outros" em exames complementares exige o preenchimento da descrição textual.');
      return;
    }

    // Validação de Grau de Desidratação se desidratado
    if (hidratacao === 'Desidratado' && !grauDesidratacao.trim()) {
      setErroValidacao('Para animais desidratados, informe a estimativa do grau de desidratação (ex: leve 5%, moderada 7%, grave >10%).');
      return;
    }

    if (!exameFisico.trim()) {
      setErroValidacao('O exame físico detalhado é obrigatório para registrar a avaliação clínica.');
      return;
    }

    const novaAvaliacao: AvaliacaoClinicaItem = {
      id: avaliacaoExistente?.id || `av-${Date.now()}`,
      animalId: animalAtual.id,
      trNumero: animalAtual.numeroTr || 'TR-N/A',
      numeroDigital: animalAtual.numeroDigital || animalAtual.codigo,
      dataEntradaClinica,
      veterinarioResponsavel,
      crmv,
      atitude,
      temperamento,
      estadoNutricional,
      hidratacao,
      grauDesidratacao: hidratacao === 'Desidratado' ? grauDesidratacao : undefined,
      anamneseHistorico: anamnese,
      exameFisico,
      examesComplementares,
      examesOutrosDescricao: examesComplementares.includes('Outros') ? examesOutrosDescricao : undefined,
      laudos,
      diagnosticoSuspeito,
      diagnosticoDefinitivo,
      condutaClinica,
      restricoes,
      observacoes,
    };

    // Atualizar no mock dataset
    const idx = MOCK_AVALIACOES_CLINICAS.findIndex((a) => a.animalId === animalAtual.id);
    if (idx >= 0) {
      MOCK_AVALIACOES_CLINICAS[idx] = novaAvaliacao;
    } else {
      MOCK_AVALIACOES_CLINICAS.unshift(novaAvaliacao);
    }

    // Atualizar parâmetros biométricos do animal no DR001
    animalAtual.atitude = atitude;
    animalAtual.temperamento = temperamento;
    animalAtual.estadoNutricional = estadoNutricional;

    setSucessoModal(true);
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
                TL003 — Avaliação Clínica Hospitalar
              </h1>
              <Badge variant="outline" className="text-xs bg-rose-50 text-rose-800 border-rose-300 font-mono">
                {animalAtual?.numeroDigital || animalAtual?.codigo}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prontuário clínico oficial para espécimes internados com sufixo -CL ou em isolamento sanitário.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onIrParaEvolucao && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onIrParaEvolucao(animalAtual.id)}
              className="text-[#0F4C3A] border-[#0F4C3A]"
            >
              <Activity className="w-4 h-4 mr-1.5" />
              Ver Evoluções (TL004)
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleSalvar}
            className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-sm font-semibold"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Salvar Avaliação Clínica
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

      {/* SELETOR DE ANIMAL INTERNADO */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full sm:w-2/3">
            <InputWrapper label="Selecione o Animal Internado / em Tratamento (-CL)" required>
              <select
                value={animalSelecionadoId}
                onChange={(e) => setAnimalSelecionadoId(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {animaisElegiveis.map((a) => (
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
              className="bg-rose-50 text-rose-800 border-rose-300 font-bold px-2.5 py-1 text-xs"
            >
              {animalAtual?.status}
            </Badge>
          </div>
        </div>

        {/* Card do Paciente */}
        {animalAtual && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
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
              <span className="text-slate-500 block text-[11px]">Termo de Recebimento:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {animalAtual.numeroTr || 'TR-N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Sexo / Faixa Etária:</span>
              <span className="text-slate-800 dark:text-slate-200">
                {animalAtual.sexo} · {animalAtual.faixaEtaria}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Marcação Física:</span>
              <span className="font-mono text-slate-700">
                {animalAtual.marcacoesFisicas && animalAtual.marcacoesFisicas.length > 0
                  ? animalAtual.marcacoesFisicas.map((m) => `${m.tipo}-${m.numero}`).join(', ')
                  : 'S/ marcação'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Data Admissão:</span>
              <span className="text-slate-800 dark:text-slate-200">{animalAtual.dataAdmissao}</span>
            </div>
          </div>
        )}
      </div>

      {/* 1. DADOS DO RESPONSÁVEL TÉCNICO */}
      <Section
        title="1. Identificação do Responsável Técnico Veterinário"
        description="Médico veterinário responsável pela avaliação clínica e admissão hospitalar."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="sm:col-span-2">
            <InputWrapper label="Médico(a) Veterinário(a) Responsável *" required>
              <input
                type="text"
                value={veterinarioResponsavel}
                onChange={(e) => setVeterinarioResponsavel(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
              />
            </InputWrapper>
          </div>

          <div>
            <InputWrapper label="CRMV / UF *" required hint="Ex: CRMV/BA 3110">
              <input
                type="text"
                value={crmv}
                onChange={(e) => setCrmv(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg font-mono"
              />
            </InputWrapper>
          </div>
        </div>
      </Section>

      {/* 2. AVALIAÇÃO FÍSICA E BIOMÉTRICA (RN-022) */}
      <Section
        title="2. Avaliação Geral e Escore Clínico (RN-022)"
        description="Parâmetros estritos conforme especificação: Atitude (e não Comportamento), Temperamento, Estado Nutricional Único e Hidratação."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Atitude (RN-022: Ativo, Hipoativo, Prostrado) */}
          <div>
            <InputWrapper
              label="Atitude Clínica *"
              required
              hint="Termo oficial RN-022 (não usar Comportamento)"
            >
              <select
                value={atitude}
                onChange={(e) => setAtitude(e.target.value as AtitudeClinica)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                <option value="Ativo">Ativo</option>
                <option value="Hipoativo">Hipoativo</option>
                <option value="Prostrado">Prostrado</option>
              </select>
            </InputWrapper>
          </div>

          {/* Temperamento */}
          <div>
            <InputWrapper label="Temperamento *" required>
              <select
                value={temperamento}
                onChange={(e) => setTemperamento(e.target.value as TemperamentoClinico)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                <option value="Manso">Manso</option>
                <option value="Agressivo">Agressivo</option>
                <option value="Em alerta">Em alerta</option>
              </select>
            </InputWrapper>
          </div>

          {/* Estado Nutricional (Campo Único) */}
          <div>
            <InputWrapper
              label="Estado Nutricional *"
              required
              hint="Campo único sem duplicar escores"
            >
              <select
                value={estadoNutricional}
                onChange={(e) => setEstadoNutricional(e.target.value as EstadoNutricionalClinico)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                <option value="Caquético">Caquético</option>
                <option value="Magro">Magro</option>
                <option value="Normal">Normal</option>
                <option value="Sobrepeso">Sobrepeso</option>
                <option value="Obeso">Obeso</option>
              </select>
            </InputWrapper>
          </div>

          {/* Hidratação */}
          <div>
            <InputWrapper label="Hidratação *" required>
              <select
                value={hidratacao}
                onChange={(e) => setHidratacao(e.target.value as HidratacaoClinica)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                <option value="Hidratado">Hidratado</option>
                <option value="Desidratado">Desidratado</option>
              </select>
            </InputWrapper>
          </div>

          {/* Grau de desidratação se desidratado */}
          {hidratacao === 'Desidratado' && (
            <div className="sm:col-span-4 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
              <InputWrapper
                label="Grau e Caracterização da Desidratação *"
                required
                hint="Descreva turgor cutâneo, enoftalmia ou estimativa percentual"
              >
                <input
                  type="text"
                  value={grauDesidratacao}
                  onChange={(e) => setGrauDesidratacao(e.target.value)}
                  placeholder="Ex: Desidratação moderada (estimada em 7%, turgor cutâneo reduzido)"
                  className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                />
              </InputWrapper>
            </div>
          )}
        </div>
      </Section>

      {/* 3. ANAMNESE E EXAME FÍSICO DETALHADO */}
      <Section
        title="3. Anamnese e Exame Físico Detalhado"
        description="Campo aberto único para registro do exame físico sistematizado (sistemas cardiovascular, respiratório, digestório, osteomuscular, neurológico e tegumentar)."
      >
        <div className="space-y-4 pt-2">
          <InputWrapper label="Anamnese / Histórico Circunstancial de Entrada">
            <textarea
              rows={2}
              value={anamnese}
              onChange={(e) => setAnamnese(e.target.value)}
              placeholder="Histórico prévio de cativeiro ou resgate em rodovia, tempo decorrido, sinais relatados..."
              className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg"
            />
          </InputWrapper>

          <InputWrapper label="Exame Físico Geral e Específico *" required>
            <textarea
              rows={4}
              value={exameFisico}
              onChange={(e) => setExameFisico(e.target.value)}
              placeholder="Descreva inspeção geral, ausculta cardiopulmonar, palpação abdominal, avaliação de membros e cavidade oral..."
              className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg font-mono text-[11px]"
            />
          </InputWrapper>
        </div>
      </Section>

      {/* 4. EXAMES COMPLEMENTARES E LAUDOS (CA026) */}
      <Section
        title="4. Exames Complementares Solicitados e Laudos Técnicos"
        description="Seleção das modalidades diagnósticas solicitadas. A escolha de 'Outros' exige descrição detalhada (CA026)."
      >
        <div className="space-y-4 pt-2">
          {/* Checkboxes de Exames */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            {EXAMES_COMPLEMENTARES_LISTA.map((tipo) => {
              const checked = examesComplementares.includes(tipo);
              return (
                <label
                  key={tipo}
                  className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer border text-xs transition-colors ${
                    checked
                      ? 'border-[#0F4C3A] bg-emerald-50/60 dark:bg-emerald-950/20 text-[#0F4C3A] font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleExame(tipo)}
                    className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                  />
                  <span>{tipo}</span>
                </label>
              );
            })}
          </div>

          {/* CA026: Campo obrigatório se 'Outros' selecionado */}
          {examesComplementares.includes('Outros') && (
            <div className="p-3 bg-emerald-50/40 border border-emerald-300 rounded-xl">
              <InputWrapper
                label="Descrição Obrigatória dos Exames Adicionais (Outros) *"
                required
                hint="Critério de Aceite CA026: especifique o tipo, finalidade e laboratório credenciado"
              >
                <input
                  type="text"
                  value={examesOutrosDescricao}
                  onChange={(e) => setExamesOutrosDescricao(e.target.value)}
                  placeholder="Ex: Coproparasitológico por flutuação e sedimentação / PCR para Mycoplasma"
                  className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                />
              </InputWrapper>
            </div>
          )}

          {/* Anexos e Laudos */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Laudos Periciais e Resultados Anexados ({laudos.length}):
            </span>

            {/* Simulação de Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <InputWrapper label="Tipo do Laudo">
                  <input
                    type="text"
                    value={novoLaudoTipo}
                    onChange={(e) => setNovoLaudoTipo(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div className="sm:col-span-2">
                <InputWrapper label="Nome do Arquivo (PDF ou Imagem)">
                  <input
                    type="text"
                    value={novoLaudoNome}
                    onChange={(e) => setNovoLaudoNome(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg font-mono"
                  />
                </InputWrapper>
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAdicionarLaudo}
                  className="w-full h-9 border-[#0F4C3A] text-[#0F4C3A] hover:bg-emerald-50"
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  Anexar Laudo
                </Button>
              </div>
            </div>

            {/* Tabela de Laudos */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-3 py-2">Tipo de Exame</th>
                    <th className="px-3 py-2">Arquivo</th>
                    <th className="px-3 py-2">Tamanho</th>
                    <th className="px-3 py-2">Data Upload</th>
                    <th className="px-3 py-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {laudos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-3 text-center text-slate-400 italic">
                        Nenhum arquivo ou laudo pericial anexado até o momento.
                      </td>
                    </tr>
                  ) : (
                    laudos.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">
                          {l.exameTipo}
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-600 flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                          {l.arquivoNome}
                        </td>
                        <td className="px-3 py-2 text-slate-500">{l.tamanhoKb} KB</td>
                        <td className="px-3 py-2 text-slate-500">{l.dataUpload}</td>
                        <td className="px-3 py-2 text-right">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleRemoverLaudo(l.id)}
                            className="text-rose-600 hover:text-rose-800"
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
        </div>
      </Section>

      {/* 5. DIAGNÓSTICO, CONDUTA E PRESCRIÇÃO */}
      <Section
        title="5. Diagnósticos, Conduta Clínica e Prescrição Terapêutica"
        description="Parecer técnico final da avaliação e conduta inicial de internamento."
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputWrapper label="Diagnóstico Suspeito / Provisório">
              <input
                type="text"
                value={diagnosticoSuspeito}
                onChange={(e) => setDiagnosticoSuspeito(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
              />
            </InputWrapper>

            <InputWrapper label="Diagnóstico Definitivo (se confirmado)">
              <input
                type="text"
                value={diagnosticoDefinitivo}
                onChange={(e) => setDiagnosticoDefinitivo(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg font-semibold"
              />
            </InputWrapper>
          </div>

          <InputWrapper label="Conduta Clínica, Medicamentos e Procedimentos *" required>
            <textarea
              rows={3}
              value={condutaClinica}
              onChange={(e) => setCondutaClinica(e.target.value)}
              placeholder="Protocolo de fluidoterapia, antibióticos, analgésicos, dosagens e frequências..."
              className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg"
            />
          </InputWrapper>

          <InputWrapper label="Restrições de Manejo / Alojamento Clínico">
            <input
              type="text"
              value={restricoes}
              onChange={(e) => setRestricoes(e.target.value)}
              placeholder="Ex: Piso antiderrapante, isolamento sonoro, vedação contra correntes de ar..."
              className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
            />
          </InputWrapper>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* MODAL DE SUCESSO */}
      {/* ========================================================================= */}
      <Dialog open={sucessoModal} onOpenChange={setSucessoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0F4C3A]">
              <Check className="w-5 h-5 text-emerald-600" />
              Avaliação Clínica Salva com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-2">
              Os dados clínicos do paciente{' '}
              <strong className="font-mono">{animalAtual?.numeroDigital || animalAtual?.codigo}</strong> foram
              gravados no histórico institucional.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
            <div>
              <strong>Veterinário:</strong> {veterinarioResponsavel} ({crmv})
            </div>
            <div>
              <strong>Diagnóstico:</strong> {diagnosticoDefinitivo || diagnosticoSuspeito}
            </div>
            <div>
              <strong>Atitude:</strong> {atitude} · <strong>Nutricional:</strong> {estadoNutricional}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setSucessoModal(false)}>
              Permanecer na Tela
            </Button>
            {onIrParaEvolucao && (
              <Button
                size="sm"
                onClick={() => {
                  setSucessoModal(false);
                  onIrParaEvolucao(animalAtual.id);
                }}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
              >
                <Activity className="w-4 h-4 mr-1.5" />
                Ir para Evolução Clínica (TL004)
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
