import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  Check,
  HeartCrack,
  FileText,
  AlertTriangle,
  Upload,
  Building2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Paperclip,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { Section } from '@/components/filament/Section';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
  MOCK_REGISTROS_OBITO,
  MOCK_TERMOS_RECEBIMENTO,
  gerarProximoNumeroCadaver,
  notificarAtualizacaoDadosFauna,
} from '@/data/faunaAdmissaoMock';
import {
  MOCK_ANIMAIS,
  AnimalItem,
} from '@/data/faunaMock';
import {
  RegistroObitoItem,
  DestinacaoCarcacaTipo,
} from '@/types/faunaAdmissao';

interface RegistroObitoPageProps {
  animalIdPreselecionado?: string;
  trNumeroPreselecionado?: string;
  onVoltar: () => void;
  onConcluir?: (numeroCadaver: string) => void;
}

const DESTINACOES_CARCACA: DestinacaoCarcacaTipo[] = [
  'Universidades',
  'Laboratórios',
  'Centros de Pesquisa',
  'Museus',
  'Empresas de Limpeza',
  'Descarte',
  'Outros',
];

export const RegistroObitoPage: React.FC<RegistroObitoPageProps> = ({
  animalIdPreselecionado,
  trNumeroPreselecionado,
  onVoltar,
  onConcluir,
}) => {
  // Lista de animais candidatos a óbito (internados, triagem, ou todos)
  const [animalSelecionadoId, setAnimalSelecionadoId] = useState<string>(
    animalIdPreselecionado || MOCK_ANIMAIS[0]?.id || ''
  );

  const animalAtual = useMemo(() => {
    return MOCK_ANIMAIS.find((a) => a.id === animalSelecionadoId) || MOCK_ANIMAIS[0];
  }, [animalSelecionadoId]);

  // TR de referência (do animal selecionado ou do prop)
  const trNumero = useMemo(() => {
    return trNumeroPreselecionado || animalAtual?.numeroTr || MOCK_TERMOS_RECEBIMENTO[0]?.numeroTr || 'CTS-000.032';
  }, [trNumeroPreselecionado, animalAtual]);

  // Número de Cadáver gerado no padrão [Nº TR]-OB00 (RN-028, CA017)
  const [numeroCadaverGerado] = useState<string>(() => gerarProximoNumeroCadaver(trNumero));

  // Form states (RN-027, RN-029, CA030)
  const [dataObito, setDataObito] = useState<string>(new Date().toLocaleDateString('pt-BR'));
  const [momentoObito, setMomentoObito] = useState<'Na chegada' | 'Durante a triagem' | 'Durante o tratamento'>(
    animalAtual?.condicaoEntrada === 'Óbito' ? 'Na chegada' : 'Durante o tratamento'
  );
  const [diagnosticoPosMorte, setDiagnosticoPosMorte] = useState<string>(
    'Choque séptico secundário a politraumatismo / fratura exposta grave com necrose tecidual.'
  );
  const [laudoArquivoNome, setLaudoArquivoNome] = useState<string>('Laudo_Necropsia_Oficial_2026.pdf');
  const [laudoAnexado, setLaudoAnexado] = useState<boolean>(true);

  // Destinação da carcaça (RN-029, CA030)
  const [destinacaoCarcaca, setDestinacaoCarcaca] = useState<DestinacaoCarcacaTipo>('Universidades');
  const [instituicaoDestinataria, setInstituicaoDestinataria] = useState<string>(
    'Departamento de Zoologia e Anatomia Animal - UFBA'
  );
  const [destinacaoOutrosDescricao, setDestinacaoOutrosDescricao] = useState<string>('');
  const [dataEntregaCarcaca, setDataEntregaCarcaca] = useState<string>(new Date().toLocaleDateString('pt-BR'));
  const [observacoes, setObservacoes] = useState<string>(
    'Material biológico preservado em formalina 10% para compor acervo científico de anatomia comparada.'
  );

  // Feedback & Erros
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [sucessoModal, setSucessoModal] = useState<boolean>(false);

  // Salvar Óbito
  const handleSalvar = () => {
    setErroValidacao(null);

    // CA030: Se a destinação NÃO for 'Descarte', a instituição destinatária é OBRIGATÓRIA
    if (destinacaoCarcaca !== 'Descarte' && !instituicaoDestinataria.trim()) {
      setErroValidacao(
        'CA030: Para destinações institucionais (Universidades, Laboratórios, Museus, Centros de Pesquisa, etc.), a identificação da Instituição Destinatária é OBRIGATÓRIA.'
      );
      return;
    }

    // Se 'Outros', exige descrição obrigatória
    if (destinacaoCarcaca === 'Outros' && !destinacaoOutrosDescricao.trim()) {
      setErroValidacao('Para a opção "Outros", a descrição detalhada do destino da carcaça é obrigatória.');
      return;
    }

    if (!diagnosticoPosMorte.trim()) {
      setErroValidacao('Informe a causa mortis ou diagnóstico pós-morte preliminar.');
      return;
    }

    // Cria registro de óbito
    const novoRegistro: RegistroObitoItem = {
      id: `ob-${Date.now()}`,
      animalId: animalAtual?.id,
      trId: animalAtual?.numeroTr || 'tr-001',
      trNumero,
      numeroCadaver: numeroCadaverGerado, // RN-028, CA017
      numeroDigital: animalAtual?.numeroDigital || animalAtual?.codigo,
      dataObito,
      momentoObito,
      diagnosticoPosMorte,
      laudoNecroscopicoNome: laudoAnexado ? laudoArquivoNome : undefined,
      destinacaoCarcaca,
      instituicaoDestinataria: destinacaoCarcaca !== 'Descarte' ? instituicaoDestinataria : undefined,
      destinacaoOutrosDescricao: destinacaoCarcaca === 'Outros' ? destinacaoOutrosDescricao : undefined,
      dataEntregaCarcaca,
      observacoes,
    };

    MOCK_REGISTROS_OBITO.unshift(novoRegistro);
    notificarAtualizacaoDadosFauna();

    // Atualiza status do animal no DR001
    if (animalAtual) {
      animalAtual.status = 'Óbito';
      animalAtual.numeroCadaver = numeroCadaverGerado;
    }

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
                TL005 — Registro de Óbito e Destinação da Carcaça
              </h1>
              <Badge variant="outline" className="text-xs bg-slate-100 text-slate-900 border-slate-300 font-mono">
                {numeroCadaverGerado}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Geração de numeração de cadáver oficial [Nº TR]-OB00, necropsia e destinação técnico-científica da carcaça.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSalvar}
            className="bg-slate-900 hover:bg-black text-white shadow-sm font-semibold"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Concluir Registro de Óbito
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

      {/* SELEÇÃO DO ANIMAL / TR */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <InputWrapper label="Selecione o Animal para Registro de Óbito">
              <select
                value={animalSelecionadoId}
                onChange={(e) => setAnimalSelecionadoId(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {MOCK_ANIMAIS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.numeroDigital || a.codigo} — {a.especieNomePopular} ({a.especieNomeCientifico}) — TR:{' '}
                    {a.numeroTr || 'S/N'}
                  </option>
                ))}
              </select>
            </InputWrapper>
          </div>

          <div>
            <InputWrapper label="Numeração Oficial de Cadáver (RN-028, CA017)">
              <div className="h-9 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg flex items-center font-mono font-bold text-xs text-rose-700">
                {numeroCadaverGerado}
              </div>
            </InputWrapper>
          </div>
        </div>

        {/* Resumo do Espécime */}
        {animalAtual && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Termo de Recebimento:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{trNumero}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Espécie:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {animalAtual.especieNomePopular} ({animalAtual.especieNomeCientifico})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Número Digital Original:</span>
              <span className="font-mono text-slate-700">{animalAtual.numeroDigital || animalAtual.codigo}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Status Anterior:</span>
              <Badge variant="outline" className="text-xs">
                {animalAtual.status}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* 1. DADOS DO EVENTO E NECROPSIA (RN-027, RN-028) */}
      <Section
        title="1. Circunstâncias do Óbito e Causa Mortis (RN-027)"
        description="Identificação do momento oficial do óbito e laudo necroscópico."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Momento do Óbito (RN-027: Na chegada, Durante a triagem, Durante o tratamento) */}
          <div>
            <InputWrapper label="Momento Oficial do Óbito *" required>
              <select
                value={momentoObito}
                onChange={(e) => setMomentoObito(e.target.value as any)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
              >
                <option value="Na chegada">Na chegada (admissão imediata no TR)</option>
                <option value="Durante a triagem">Durante a triagem preliminar</option>
                <option value="Durante o tratamento">Durante o tratamento / internamento clínico</option>
              </select>
            </InputWrapper>
          </div>

          <div>
            <InputWrapper label="Data da Constatação *" required>
              <input
                type="text"
                value={dataObito}
                onChange={(e) => setDataObito(e.target.value)}
                className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
              />
            </InputWrapper>
          </div>

          <div>
            <InputWrapper label="Laudo Necroscópico Anexado">
              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="checkbox"
                  id="chk-laudo"
                  checked={laudoAnexado}
                  onChange={(e) => setLaudoAnexado(e.target.checked)}
                  className="rounded text-slate-800 focus:ring-slate-800"
                />
                <label htmlFor="chk-laudo" className="text-xs text-slate-700 cursor-pointer">
                  Anexar Laudo de Necropsia
                </label>
              </div>
            </InputWrapper>
          </div>

          {/* Causa Mortis */}
          <div className="sm:col-span-3">
            <InputWrapper label="Diagnóstico Pós-Morte / Causa Mortis *" required>
              <textarea
                rows={2}
                value={diagnosticoPosMorte}
                onChange={(e) => setDiagnosticoPosMorte(e.target.value)}
                placeholder="Descreva as alterações macroscópicas, lesões viscerais e conclusão do óbito..."
                className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg"
              />
            </InputWrapper>
          </div>

          {laudoAnexado && (
            <div className="sm:col-span-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-slate-500" />
                <span className="font-mono text-slate-800 dark:text-slate-200">{laudoArquivoNome}</span>
                <span className="text-slate-400">(PDF, 890 KB)</span>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px]">
                Anexo Válido
              </Badge>
            </div>
          )}
        </div>
      </Section>

      {/* 2. DESTINAÇÃO DA CARCAÇA (RN-029, CA030) */}
      <Section
        title="2. Destinação Oficial da Carcaça e Instituição Destinatária (RN-029, CA030)"
        description="Encaminhamento do cadáver para fins de ensino, pesquisa científica ou descarte sanitário."
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Destinação */}
            <div>
              <InputWrapper label="Destinação da Carcaça *" required>
                <select
                  value={destinacaoCarcaca}
                  onChange={(e) => {
                    const val = e.target.value as DestinacaoCarcacaTipo;
                    setDestinacaoCarcaca(val);
                    if (val === 'Descarte') {
                      setInstituicaoDestinataria('');
                    } else if (!instituicaoDestinataria) {
                      setInstituicaoDestinataria('Universidade Federal da Bahia (UFBA)');
                    }
                  }}
                  className="w-full h-9 text-xs px-2.5 text-slate-800 bg-white border border-slate-300 rounded-lg font-medium"
                >
                  {DESTINACOES_CARCACA.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </InputWrapper>
            </div>

            {/* Instituição Destinatária (Obrigatória se NÃO for Descarte) */}
            <div className="sm:col-span-2">
              <InputWrapper
                label={`Instituição Destinatária ${destinacaoCarcaca !== 'Descarte' ? '*' : '(Opcional se Descarte)'}`}
                required={destinacaoCarcaca !== 'Descarte'}
                hint={
                  destinacaoCarcaca === 'Descarte'
                    ? 'Conforme CA030: facultativo para descarte em aterro sanitário ou incineração'
                    : 'Conforme CA030: OBRIGATÓRIA para universidades, museus e institutos de pesquisa'
                }
              >
                <input
                  data-testid="input-instituicao-destinataria"
                  type="text"
                  value={instituicaoDestinataria}
                  onChange={(e) => setInstituicaoDestinataria(e.target.value)}
                  placeholder={
                    destinacaoCarcaca === 'Descarte'
                      ? 'Ex: Aterro Sanitário Municipal de Salvador / Central de Incineração'
                      : 'Ex: Museu de Zoologia - Universidade Estadual de Feira de Santana (UEFS)'
                  }
                  className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                />
              </InputWrapper>
            </div>

            {/* Se 'Outros', descrição obrigatória */}
            {destinacaoCarcaca === 'Outros' && (
              <div className="sm:col-span-3 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200">
                <InputWrapper label="Descrição do Destino (Outros) *" required>
                  <input
                    type="text"
                    value={destinacaoOutrosDescricao}
                    onChange={(e) => setDestinacaoOutrosDescricao(e.target.value)}
                    placeholder="Especifique a destinação acordada..."
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>
            )}

            <div>
              <InputWrapper label="Data de Saída / Entrega da Carcaça">
                <input
                  type="text"
                  value={dataEntregaCarcaca}
                  onChange={(e) => setDataEntregaCarcaca(e.target.value)}
                  className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                />
              </InputWrapper>
            </div>

            <div className="sm:col-span-2">
              <InputWrapper label="Observações de Encaminhamento">
                <input
                  type="text"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                />
              </InputWrapper>
            </div>
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMAÇÃO DE ÓBITO */}
      {/* ========================================================================= */}
      <Dialog open={sucessoModal} onOpenChange={setSucessoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Registro de Óbito Concluído
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-2">
              O espécime teve seu óbito registrado e numeração de cadáver atribuída com sucesso.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Número de Cadáver Oficial:</span>
              <span className="font-mono font-bold text-rose-800 text-sm">{numeroCadaverGerado}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Termo de Recebimento:</span>
              <span className="font-mono font-semibold text-slate-800">{trNumero}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Destinação da Carcaça:</span>
              <Badge variant="outline" className="text-slate-800 border-slate-400">
                {destinacaoCarcaca}
              </Badge>
            </div>
            {instituicaoDestinataria && (
              <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                <strong>Destinatário:</strong> {instituicaoDestinataria}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => {
                setSucessoModal(false);
                if (onConcluir) onConcluir(numeroCadaverGerado);
                else onVoltar();
              }}
              className="w-full bg-slate-900 hover:bg-black text-white"
            >
              Voltar ao Painel Geral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
