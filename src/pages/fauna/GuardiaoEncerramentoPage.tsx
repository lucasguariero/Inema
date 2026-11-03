import React, { useState } from 'react';
import {
  ArrowLeft,
  HeartCrack,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Building,
  RotateCcw,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GuardiaoItem, HipoteseEncerramentoTgas } from '@/types/faunaR3R4';
import { saveGuardiaoItem, getGuardiaoById } from '@/data/faunaR3R4Mock';

interface GuardiaoEncerramentoPageProps {
  guardiaoId: string;
  onVoltar: () => void;
  perfilAtivo: 'cgfau' | 'cetas' | 'requerente';
  onConcluido?: () => void;
}

export const GuardiaoEncerramentoPage: React.FC<GuardiaoEncerramentoPageProps> = ({
  guardiaoId,
  onVoltar,
  perfilAtivo,
  onConcluido
}) => {
  const guardiao = getGuardiaoById(guardiaoId);

  // RN-026 oficial do DR012 v1.1: 8 hipóteses canônicas
  const [hipotese, setHipotese] = useState<HipoteseEncerramentoTgas>('I - Morte do responsável');
  
  // C002: Campos obrigatórios de data do fato e da comunicação
  const [dataDoFato, setDataDoFato] = useState<string>('15/10/2026');
  const [dataDaComunicacao, setDataDaComunicacao] = useState<string>('28/10/2026');
  
  // C006: Apreensão cautelar para infrações ambientais (RN-027)
  const [apreensaoCautelar, setApreensaoCautelar] = useState<boolean>(false);
  
  // C004: CETAS de destino para retorno
  const [cetasRetorno, setCetasRetorno] = useState<string>('CETAS Salvador (Cabula)');
  
  // C003: Justificativa detalhada
  const [justificativa, setJustificativa] = useState<string>(
    'Comunicação tempestiva do encerramento com solicitação de recolhimento dos animais sob guarda conforme RN-026 da Portaria INEMA nº 22.129/2021.'
  );
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState<boolean>(false);

  if (!guardiao) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Guardião não encontrado.</p>
        <Button onClick={onVoltar} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  // Hipóteses V, VI e VII acarretam recolhimento imediato (RN-026)
  const isImediato =
    hipotese.startsWith('V -') || hipotese.startsWith('VI -') || hipotese.startsWith('VII -');

  const animais = guardiao.tgasVigente?.animaisSobGuarda || [];

  // C005: Cálculo automático do prazo de 120 dias para hipóteses I a IV
  const prazoRealocacaoTexto = isImediato
    ? 'Recolhimento Imediato (0 dias) — Apreensão Cautelar / Notificação Fiscal'
    : hipotese.startsWith('VIII')
    ? 'Recolhimento Programado pelo CETAS para Projeto de Conservação'
    : '120 dias regulamentares a partir da comunicação (Prazo limite: 25/02/2027)';

  const handleConfirmarEncerramento = () => {
    if (!dataDoFato.trim() || !dataDaComunicacao.trim()) {
      alert('A Data do Fato e a Data da Comunicação são campos obrigatórios (C002 / RN-026).');
      return;
    }

    if (!justificativa.trim()) {
      alert('A descrição circunstanciada dos fatos e fundamentação é obrigatória (C003 / RN-026).');
      return;
    }

    // Readmissão de cada animal no CETAS (DR008 / RN-030)
    const animaisRetornados = animais.map((an, i) => ({
      animalId: an.animalId,
      numeroDigital: an.numeroDigital,
      cetasDestino: cetasRetorno,
      termoRecebimentoTrGerado: `TR-RETORNO-2026/0${10 + i}`,
      dataReadmissaoCetas: new Date().toLocaleDateString('pt-BR')
    }));

    const atualizado: GuardiaoItem = {
      ...guardiao,
      tgasVigente: guardiao.tgasVigente
        ? {
            ...guardiao.tgasVigente,
            situacao: 'Encerrado',
            animaisSobGuarda: [] // Animais desvinculados da guarda
          }
        : undefined,
      encerramento: {
        id: `enc-${Date.now()}`,
        dataEncerramento: new Date().toLocaleDateString('pt-BR'),
        dataDoFato,
        dataDaComunicacao,
        dataLimiteRealocacao: isImediato ? undefined : '25/02/2027',
        hipotese,
        justificativaDetalhada: justificativa,
        prazoRealocacaoDias: isImediato ? 0 : 120,
        recolhimentoImediato: isImediato,
        apreensaoCautelar: isImediato && apreensaoCautelar,
        animaisRetornados,
        concluido: true
      }
    };

    saveGuardiaoItem(atualizado);
    setModalConfirmacaoAberto(false);
    alert(
      `MSG012: Termo de Guarda de Animais Silvestres (${guardiao.tgasVigente?.numero}) encerrado com sucesso! Todos os animais foram devolvidos ao ${cetasRetorno} com emissão de Termos de Recebimento no DR008.`
    );
    if (onConcluido) onConcluido();
    else onVoltar();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12" data-testid="pagina-guardiao-encerramento">
      {/* Topbar Canônica sem ícone decorativo no H1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onVoltar}
            data-testid="btn-voltar-encerramento"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
            title="Voltar"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-rose-700">
                {guardiao.tgasVigente?.numero || 'TGAS'}
              </span>
              <Badge variant="danger" dot>
                Processo de Encerramento (RN-026)
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Encerramento do Termo de Guarda de Animais Silvestres
            </h1>
            <p className="text-xs text-slate-500">
              Guardião: <strong>{guardiao.requerente.nomeOuRazaoSocial}</strong> · CPF:{' '}
              {guardiao.requerente.cpfCnpj}
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={() => setModalConfirmacaoAberto(true)}
          data-testid="btn-abrir-confirmacao-encerramento"
          className="text-xs gap-1.5 h-9"
        >
          Confirmar Encerramento do TGAS
        </Button>
      </div>

      {/* Formulário Oficial de Encerramento (RN-026 / C001 a C007) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 text-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            1. Hipótese Legal de Encerramento (C001 / RN-026 do DR012 v1.1)
          </h2>
          <p className="text-[11px] text-slate-500 mb-3">
            Reconciliado estritamente com a norma oficial: Hipótese I é Morte do Responsável. Nas hipóteses I a IV,
            comunicação em até 30 dias e realocação em até 120 dias; nas hipóteses V a VII, recolhimento imediato pelo CETAS.
          </p>

          <select
            value={hipotese}
            onChange={(e) => {
              const novaHipotese = e.target.value as HipoteseEncerramentoTgas;
              setHipotese(novaHipotese);
              if (novaHipotese.startsWith('V -') || novaHipotese.startsWith('VI -') || novaHipotese.startsWith('VII -')) {
                setApreensaoCautelar(true);
              } else {
                setApreensaoCautelar(false);
              }
            }}
            data-testid="select-hipotese-encerramento"
            className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold bg-slate-50"
          >
            <option value="I - Morte do responsável">I - Morte do responsável (Comunicação 30d / Realocação 120d)</option>
            <option value="II - Impedimento">II - Impedimento do guardião (Comunicação 30d / Realocação 120d)</option>
            <option value="III - Desistência">III - Desistência voluntária pelo guardião (Comunicação 30d / Realocação 120d)</option>
            <option value="IV - Extinção de pessoa jurídica">IV - Extinção de pessoa jurídica guardiã (Comunicação 30d / Realocação 120d)</option>
            <option value="V - Infração ambiental ou crime contra a fauna">
              V - Infração ambiental ou crime contra a fauna (Recolhimento Imediato - RN-026)
            </option>
            <option value="VI - Descumprimento das condicionantes">
              VI - Descumprimento das condicionantes fixadas no TGAS (Recolhimento Imediato - RN-026)
            </option>
            <option value="VII - Maus-tratos ou condições insalubres">
              VII - Maus-tratos ou condições insalubres no recinto (Recolhimento Imediato - RN-026)
            </option>
            <option value="VIII - Necessidade do animal para projeto de conservação">
              VIII - Necessidade do animal para projeto de conservação oficial (Portaria art. 26)
            </option>
          </select>
        </div>

        {/* C002: Data do Fato e Data da Comunicação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Data do Fato Motivo (C002 / RN-026) *
            </label>
            <input
              type="text"
              value={dataDoFato}
              onChange={(e) => setDataDoFato(e.target.value)}
              placeholder="dd/mm/aaaa"
              data-testid="input-data-do-fato"
              className="w-full h-9 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Data em que ocorreu o óbito, desistência ou constatação fiscal.
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Data da Comunicação ao INEMA (C002 / RN-026) *
            </label>
            <input
              type="text"
              value={dataDaComunicacao}
              onChange={(e) => setDataDaComunicacao(e.target.value)}
              placeholder="dd/mm/aaaa"
              data-testid="input-data-da-comunicacao"
              className="w-full h-9 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Limite legal de 30 dias para as hipóteses I a IV.
            </span>
          </div>
        </div>

        {/* C005 & C006: Prazos e Apreensão Cautelar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                Prazo Regulamentar de Realocação dos Animais (C005 / RN-026)
              </span>
              <p className="text-[11px] font-semibold text-[#0F4C3A] dark:text-emerald-400 mt-0.5">
                {prazoRealocacaoTexto}
              </p>
            </div>
            {isImediato && (
              <Badge variant="danger" dot className="self-start sm:self-auto">
                Recolhimento Imediato
              </Badge>
            )}
          </div>

          {/* C006: Apreensão cautelar (RN-027) */}
          {isImediato && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                  Apreensão Cautelar de Todos os Animais (C006 / RN-027)
                </span>
                <span className="text-[10px] text-slate-500">
                  Constatada infração em relação a um dos animais, todos os animais sob guarda são apreendidos cautelarmente.
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={apreensaoCautelar}
                  onChange={(e) => setApreensaoCautelar(e.target.checked)}
                  data-testid="checkbox-apreensao-cautelar"
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-rose-700">Apreensão Lavrada</span>
              </label>
            </div>
          )}
        </div>

        {/* C003: Justificativa */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            2. Descrição Circunstanciada dos Fatos e Justificativa (C003 / RN-026) *
          </h2>
          <textarea
            rows={3}
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            placeholder="Relate detalhadamente os fatos, documentos comprobatórios ou autos de fiscalização que motivam o encerramento do termo..."
            data-testid="textarea-justificativa-encerramento"
            className="w-full rounded-xl border border-slate-200 p-3 text-xs"
          />
        </div>

        {/* C004: Destino dos Animais e CETAS de Retorno */}
        <div>
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              3. Destino dos Animais e CETAS de Retorno (C004 / RN-026)
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500">CETAS de Destino:</span>
              <select
                value={cetasRetorno}
                onChange={(e) => setCetasRetorno(e.target.value)}
                data-testid="select-cetas-retorno"
                className="h-8 text-xs rounded-lg border border-slate-200 px-2 font-semibold bg-slate-50"
              >
                <option value="CETAS Salvador (Cabula)">CETAS Salvador (Cabula)</option>
                <option value="CETAS Porto Seguro">CETAS Porto Seguro</option>
                <option value="CETAS Vitória da Conquista">CETAS Vitória da Conquista</option>
                <option value="CETAS Recôncavo (Cruz das Almas)">CETAS Recôncavo</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mb-3">
            O encerramento do TGAS obriga a devolução de todos os espécimes confiados ao {cetasRetorno}, com emissão
            automática de Termo de Recebimento no DR008 e preservação do Número Digital original.
          </p>

          <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Nº Digital Original</th>
                <th className="p-3">Espécie</th>
                <th className="p-3">Marcação Física</th>
                <th className="p-3">Destino do Animal (C004)</th>
                <th className="p-3">Readmissão DR008</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {animais.map((an) => (
                <tr key={an.animalId}>
                  <td className="p-3 font-mono font-bold text-slate-800">{an.numeroDigital}</td>
                  <td className="p-3">
                    <strong>{an.nomeComum}</strong> (<em>{an.nomeCientifico}</em>)
                  </td>
                  <td className="p-3 font-mono text-emerald-800">
                    {an.tipoMarcacao}: {an.codigoMarcacao}
                  </td>
                  <td className="p-3 font-bold text-slate-800">Retorno ao {cetasRetorno}</td>
                  <td className="p-3">
                    <Badge variant="success" dot>Gera TR de Entrada</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO IRREVERSÍVEL (MSG012) */}
      {modalConfirmacaoAberto && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-800">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase">Confirmação de Encerramento do TGAS (MSG012)</h3>
                <p className="text-[11px] text-slate-500">Ação irreversível de desvinculação da guarda (RN-026)</p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Você confirma o <strong>encerramento definitivo</strong> do Termo de Guarda de Animais Silvestres{' '}
              <strong>{guardiao.tgasVigente?.numero}</strong> concedido a{' '}
              <strong>{guardiao.requerente.nomeOuRazaoSocial}</strong> sob a hipótese{' '}
              <strong>{hipotese}</strong>?
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 space-y-1 text-[11px]">
              <p>• O termo passará imediatamente ao estado <strong>Encerrado</strong>.</p>
              <p>• Prazo de realocação: <strong>{isImediato ? 'Recolhimento Imediato (0d)' : '120 dias regulamentares'}</strong>.</p>
              <p>• Todos os animais serão recolhidos e readmitidos no <strong>{cetasRetorno}</strong> com novo TR no DR008.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalConfirmacaoAberto(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmarEncerramento}
                data-testid="btn-confirmar-encerramento-final"
              >
                Sim, Encerrar Termo e Recolher Animais
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

