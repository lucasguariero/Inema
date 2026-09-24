import React, { useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Building2,
  FileText,
  UserCheck,
  Calendar,
  Clock,
  Layers,
  History,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { TramitacaoItem, PautaItem } from '@/data/regulacaoMock';
import { cn } from '@/lib/utils';

interface DetalhesCompletosModalProps {
  isOpen: boolean;
  onClose: () => void;
  origem: 'tramitacoes' | 'pauta';
  item: TramitacaoItem | PautaItem | null;
  onVoltarAoResumo?: () => void;
}

export const DetalhesCompletosModal: React.FC<DetalhesCompletosModalProps> = ({
  isOpen,
  onClose,
  origem,
  item,
  onVoltarAoResumo,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isTramitacao = origem === 'tramitacoes' && 'dataTramitacao' in item;
  const tramitacao = isTramitacao ? (item as TramitacaoItem) : null;
  const pauta = !isTramitacao ? (item as PautaItem) : null;

  const processo = item.processo;
  const interessado = item.interessado;
  const situacao = isTramitacao ? tramitacao?.situacao : pauta?.situacaoAtual;
  const unidade = isTramitacao ? tramitacao?.unidade : pauta?.unidadeAtual;
  const equipeLider = isTramitacao ? tramitacao?.liderEquipe : pauta?.tecnicoAtual || pauta?.liderEquipe;
  const membros = item.membrosEquipe || [];

  // Mock dados complementares canônicos
  const requerimentoVinculado = '2024.REQ.' + Math.floor(100000 + Math.random() * 900000);
  const empreendimento = 'Complexo Agrossilvopastoril e Hídrico ' + (item.municipio || 'Bahia');
  const dataFormacao = '18/02/2023';

  // Atos Vinculados Mock
  const atosVinculados = isTramitacao && tramitacao
    ? [
        {
          ato: tramitacao.ato,
          tipologia: tramitacao.tipologia,
          situacaoPropria: tramitacao.situacao,
        },
        {
          ato: 'Aprovação da Localização da Reserva Legal (ARL)',
          tipologia: 'Reserva Legal / Florestal',
          situacaoPropria: 'RL APROVADA',
        },
      ]
    : pauta
    ? pauta.atos.map((atoNome, idx) => ({
        ato: atoNome,
        tipologia: pauta.tipologia,
        situacaoPropria: idx === 0 ? pauta.situacaoAtual : 'EM ANÁLISE TÉCNICA',
      }))
    : [];

  // Histórico de Tramitação Mock (Bloco 5)
  const historicoTramitacao = [
    {
      dataHora: '20/09/2026 14:32',
      ocorrencia: 'Despacho Técnico emitido com parecer favorável condicionado',
      situacao: situacao || 'EM ANÁLISE TÉCNICA',
      responsavel: equipeLider,
      destinatario: 'Coordenação Setorial / DIRRE',
      observacao: 'Análise técnica finalizada com deferimento das diretrizes ambientais.',
    },
    {
      dataHora: '05/08/2026 09:15',
      ocorrencia: 'Juntada de esclarecimentos e complementação cadastral',
      situacao: 'REVISADO',
      responsavel: 'Requerente / Sistema SEIA',
      destinatario: unidade || 'DIRRE/COASP',
      observacao: 'Documentação comprobatória de reserva legal anexada.',
    },
    {
      dataHora: '12/05/2026 16:40',
      ocorrencia: 'Emissão de Notificação de Comunicação Técnica',
      situacao: 'NOTIFICADO',
      responsavel: equipeLider,
      destinatario: interessado,
      observacao: 'Solicitação de adequação do memorial descritivo da área.',
    },
  ];

  // Histórico de Comunicação Mock (Bloco 6 - Bloco Separado!)
  const historicoComunicacao = [
    {
      dataHora: '12/05/2026 16:42',
      tipo: 'Notificação Eletrônica SEIA nº 2026/0491',
      descricao: 'Disponibilização da notificação técnica de adequação do memorial com prazo de 30 dias para manifestação.',
    },
    {
      dataHora: '18/02/2023 11:05',
      tipo: 'Aviso de Formação de Processo',
      descricao: 'Confirmação automática de abertura e formação de processo SEIA gerada após validação documental.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#0F4C3A] tracking-wider uppercase bg-[#0F4C3A]/10 px-2 py-0.5 rounded">
                  Detalhamento Completo • SEIA
                </span>
                <span className="text-xs text-slate-400 font-mono">•</span>
                <span className="text-xs text-slate-500">Origem: {origem === 'tramitacoes' ? 'Tramitações no período' : 'Acompanhamento da pauta'}</span>
              </div>
              <h2 className="text-lg font-bold font-mono text-slate-900 mt-1">
                {processo}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {interessado}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onVoltarAoResumo && (
                <button
                  type="button"
                  onClick={onVoltarAoResumo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Voltar ao resumo</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Corpo com os 7 Blocos Canônicos */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
            {/* BLOCO 1: IDENTIFICAÇÃO */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                <Building2 className="w-4 h-4 text-[#0F4C3A]" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  1. Identificação do Processo
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Número do Processo</span>
                  <span className="font-mono font-bold text-slate-900 block mt-0.5">{processo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Requerimento Vinculado</span>
                  <span className="font-mono font-semibold text-slate-800 block mt-0.5">{requerimentoVinculado}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Data de Formação</span>
                  <span className="font-medium text-slate-800 block mt-0.5">{dataFormacao}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Interessado / Razão Social</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">{interessado}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Município</span>
                  <span className="font-medium text-slate-800 block mt-0.5">{item.municipio}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Empreendimento</span>
                  <span className="font-medium text-slate-800 block mt-0.5">{empreendimento}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Tipologia</span>
                  <span className="font-medium text-slate-800 block mt-0.5">{item.tipologia}</span>
                </div>
              </div>
            </section>

            {/* BLOCO 2: REGISTRO SELECIONADO (Exibido quando aplicável ou focado) */}
            {isTramitacao && tramitacao ? (
              <section className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <FileText className="w-4 h-4 text-[#0F4C3A]" />
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    2. Registro Selecionado (Tramitação em Foco)
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Ato / Atividade</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{tramitacao.ato}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Data da Tramitação</span>
                      <span className="font-medium text-slate-800 block mt-0.5">{tramitacao.dataTramitacao}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Situação Registrada</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
                        {tramitacao.situacao}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Unidade do Registro</span>
                      <span className="font-medium text-slate-800 block mt-0.5">{tramitacao.unidade}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Responsável Institucional / Líder</span>
                      <span className="font-semibold text-slate-900 block mt-0.5">{tramitacao.liderEquipe}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Observação do Despacho</span>
                    <p className="mt-1 p-2.5 rounded bg-white border border-slate-200 text-slate-700 leading-relaxed font-sans">
                      {tramitacao.resumoDespacho || 'Ocorrência registrada no sistema SEIA conforme deliberação da equipe técnica responsável.'}
                    </p>
                  </div>
                </div>
              </section>
            ) : (
              <section className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>Acesso originado pela <strong>Pauta</strong>: foco principal na situação e atribuição atuais do processo.</span>
                </div>
              </section>
            )}

            {/* BLOCO 3: SITUAÇÃO ATUAL */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                <UserCheck className="w-4 h-4 text-[#0F4C3A]" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  3. Situação Atual do Processo
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Situação Geral</span>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded text-xs font-bold bg-[#E2ECE9] text-[#0F4C3A] border border-[#0F4C3A]/20">
                    {situacao}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Unidade Atual</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">{unidade}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Equipe / Técnico Atual</span>
                  <span
                    className={cn(
                      'block mt-0.5 font-semibold',
                      equipeLider === 'Sem atribuição técnica' ? 'text-amber-700 italic' : 'text-slate-900'
                    )}
                  >
                    {equipeLider}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Última Movimentação</span>
                  <span className="font-medium text-slate-800 block mt-0.5">
                    {isTramitacao ? tramitacao?.dataTramitacao : pauta?.ultimaMovimentacao}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Dias Sem Movimentação</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {item.diasSemMovimentacao} dias
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Atualização da Consulta</span>
                  <span className="font-medium text-slate-600 block mt-0.5">22/09/2026 às 10:00</span>
                </div>
              </div>
            </section>

            {/* BLOCO 4: ATOS VINCULADOS */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                <Layers className="w-4 h-4 text-[#0F4C3A]" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  4. Atos Vinculados ({atosVinculados.length})
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Ato / Atividade Requerida</th>
                      <th className="py-2.5 px-4">Tipologia</th>
                      <th className="py-2.5 px-4">Situação Própria do Ato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {atosVinculados.map((ato, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-900">{ato.ato}</td>
                        <td className="py-2.5 px-4 text-slate-600">{ato.tipologia}</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                            {ato.situacaoPropria}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* BLOCO 5: HISTÓRICO DE TRAMITAÇÃO */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                <History className="w-4 h-4 text-[#0F4C3A]" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  5. Histórico de Tramitação
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 whitespace-nowrap">Data / Hora</th>
                      <th className="py-2.5 px-3">Ocorrência</th>
                      <th className="py-2.5 px-3">Situação</th>
                      <th className="py-2.5 px-3">Responsável</th>
                      <th className="py-2.5 px-3">Destinatário</th>
                      <th className="py-2.5 px-3">Observação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {historicoTramitacao.map((h, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{h.dataHora}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{h.ocorrencia}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {h.situacao}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{h.responsavel}</td>
                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{h.destinatario}</td>
                        <td className="py-2.5 px-3 text-slate-500 max-w-[200px] truncate" title={h.observacao}>{h.observacao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* BLOCO 6: HISTÓRICO DE COMUNICAÇÃO (BLOCO SEPARADO!) */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                <MessageSquare className="w-4 h-4 text-[#0F4C3A]" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  6. Histórico de Comunicação (Notificações e Ofícios)
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4 whitespace-nowrap">Data / Hora</th>
                      <th className="py-2.5 px-4">Tipo da Comunicação</th>
                      <th className="py-2.5 px-4">Descrição da Ocorrência</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {historicoComunicacao.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">{c.dataHora}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-800">{c.tipo}</td>
                        <td className="py-2.5 px-4 text-slate-600 leading-relaxed">{c.descricao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* BLOCO 7: TEMPOS E PRAZOS */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                <Clock className="w-4 h-4 text-[#0F4C3A]" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  7. Tempos e Prazos do Processo
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Tempo em Análise Técnica</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">48 dias</span>
                  <span className="text-[10px] text-slate-500">Período com equipe técnica</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Tempo Aguardando Resposta</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">30 dias</span>
                  <span className="text-[10px] text-slate-500">Prazos de notificação requerente</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Espécie do Prazo</span>
                  <span className="text-xs font-semibold text-slate-800 block mt-0.5">Análise Regulatória Conclusiva</span>
                  <span className="text-[10px] text-slate-500">Portaria INEMA 25.753/2022</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Situação do Prazo</span>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    No prazo (Vence em 15/11/2026)
                  </span>
                </div>
              </div>

              {/* Nota Informativa sobre Concorrência de Prazos */}
              <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-lg text-slate-600 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Nota metodológica:</strong> Atos diferentes vinculados ao mesmo processo podem estar em análise técnica e aguardando resposta simultaneamente. Os tempos são apresentados de forma concorrente e não exclusiva.
                </span>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="text-[11px] text-slate-500">
              Dados auditados via SEIA • Sem dados pessoais/anexos nesta visualização
            </div>
            <div className="flex items-center gap-2">
              {onVoltarAoResumo && (
                <button
                  type="button"
                  onClick={onVoltarAoResumo}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                >
                  Voltar ao resumo
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#0F4C3A] text-white hover:bg-[#0c3d2e] transition-colors shadow-2xs cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
