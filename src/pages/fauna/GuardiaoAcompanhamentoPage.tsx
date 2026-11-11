import React, { useState } from 'react';
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Plus,
  FileText,
  Clock,
  Camera,
  Upload,
  HeartCrack,
  ShieldAlert,
  Send,
  Building,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { SeiaV2PageHeader } from '@/components/seia-v2/SeiaV2PageHeader';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  GuardiaoItem,
  OcorrenciaGuardiao,
  RelatorioSemestralGuardiao,
  TgasDocumento
} from '@/types/faunaR3R4';
import { saveGuardiaoItem, getGuardiaoById } from '@/data/faunaR3R4Mock';
import { FaunaDocumentModal, TipoDocumentoFauna } from './FaunaDocumentModal';

interface GuardiaoAcompanhamentoPageProps {
  guardiaoId: string;
  onVoltar: () => void;
  perfilAtivo: 'cgfau' | 'cetas' | 'requerente';
  onConcluido?: () => void;
}

export const GuardiaoAcompanhamentoPage: React.FC<GuardiaoAcompanhamentoPageProps> = ({
  guardiaoId,
  onVoltar,
  perfilAtivo,
  onConcluido
}) => {
  const guardiao = getGuardiaoById(guardiaoId);

  const [modalDocAberto, setModalDocAberto] = useState<boolean>(false);
  const [tipoDocModal, setTipoDocModal] = useState<TipoDocumentoFauna>('DR012-DOC003');

  // Estados dos Modais
  const [modalNovaOcorrenciaAberto, setModalNovaOcorrenciaAberto] = useState<boolean>(false);
  const [modalNovoRelatorioAberto, setModalNovoRelatorioAberto] = useState<boolean>(false);

  // Formulário Nova Ocorrência
  const [tipoOcorrencia, setTipoOcorrencia] = useState<
    'Óbito' | 'Fuga / Furto' | 'Nascimento' | 'Transporte Veterinário' | 'Outro Transporte' | 'Substituição de Marcação'
  >('Óbito');
  const [animalOcorrenciaId, setAnimalOcorrenciaId] = useState<string>(
    guardiao?.tgasVigente?.animaisSobGuarda?.[0]?.animalId || ''
  );
  const [descricaoOcorrencia, setDescricaoOcorrencia] = useState<string>('');
  const [boNumero, setBoNumero] = useState<string>('');

  // Formulário Novo Relatório Semestral
  const [periodoRelatorio, setPeriodoRelatorio] = useState<string>('1º Semestre 2026');
  const [vetRelatorio, setVetRelatorio] = useState<string>('Dra. Laura Neves - CRMV/BA 7891');

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

  const relatorios = guardiao.relatoriosSemestrais || [];
  const ocorrencias = guardiao.ocorrencias || [];

  // Registrar Nova Ocorrência
  const handleSalvarOcorrencia = () => {
    if (!descricaoOcorrencia.trim()) {
      alert('Descreva os detalhes da ocorrência.');
      return;
    }

    if (tipoOcorrencia === 'Fuga / Furto' && !boNumero.trim()) {
      alert('Para ocorrências de fuga ou furto, o Boletim de Ocorrência policial em até 5 dias úteis é obrigatório.');
      return;
    }

    const animalAlvo = guardiao.tgasVigente?.animaisSobGuarda.find((a) => a.animalId === animalOcorrenciaId);

    const novaOcorr: OcorrenciaGuardiao = {
      id: `ocorr-${Date.now()}`,
      dataRegistro: new Date().toLocaleDateString('pt-BR'),
      dataOcorrencia: new Date().toLocaleDateString('pt-BR'),
      tipo: tipoOcorrencia,
      animalId: animalAlvo?.animalId,
      animalNome: animalAlvo?.nomeComum,
      descricao: descricaoOcorrencia,
      prazoComunicacaoHoras: 48,
      dentroDoPrazo: true,
      boletimOcorrenciaNumero: boNumero.trim() || undefined,
      status: 'Concluída'
    };

    // RN-017 / RN-018: Óbito, fuga ou furto alteram a situação do animal e exigem exclusão + termo substituto
    let tgasAtualizado = guardiao.tgasVigente;
    let historicoTgasAtualizado = [...guardiao.historicoTgas];

    if (tipoOcorrencia === 'Óbito' || tipoOcorrencia === 'Fuga / Furto') {
      if (guardiao.tgasVigente && animalAlvo) {
        // Marca o termo anterior como Substituído
        const termoAntigoSubstituido: TgasDocumento = {
          ...guardiao.tgasVigente,
          situacao: 'Substituído'
        };
        historicoTgasAtualizado.unshift(termoAntigoSubstituido);

        // Novo termo substituto excluindo o animal
        const restantes = guardiao.tgasVigente.animaisSobGuarda.filter(
          (a) => a.animalId !== animalAlvo.animalId
        );

        tgasAtualizado = {
          ...guardiao.tgasVigente,
          id: `tgas-subst-${Date.now()}`,
          numero: `${guardiao.tgasVigente.numero}-SUBST`,
          termoAnteriorSubstituido: guardiao.tgasVigente.numero,
          animaisSobGuarda: restantes,
          situacao: 'Vigente'
        };
      }
    }

    const atualizado: GuardiaoItem = {
      ...guardiao,
      tgasVigente: tgasAtualizado,
      historicoTgas: historicoTgasAtualizado,
      ocorrencias: [novaOcorr, ...ocorrencias]
    };

    saveGuardiaoItem(atualizado);
    setModalNovaOcorrenciaAberto(false);
    setDescricaoOcorrencia('');
    setBoNumero('');
    alert(
      tipoOcorrencia === 'Óbito' || tipoOcorrencia === 'Fuga / Furto'
        ? `Ocorrência registrada! Conforme RN-017/018, o animal foi baixado e um TGAS substituto (${tgasAtualizado?.numero}) foi emitido referenciando o anterior.`
        : 'Ocorrência comunicada com sucesso dentro do prazo regulamentar.'
    );
  };

  // Submeter Novo Relatório Semestral
  const handleSalvarRelatorioSemestral = () => {
    const novoRel: RelatorioSemestralGuardiao = {
      id: `rel-sem-${Date.now()}`,
      dataEnvio: new Date().toLocaleDateString('pt-BR'),
      periodoSemestral: periodoRelatorio,
      veterinarioNome: vetRelatorio,
      veterinarioCrmv: 'CRMV/BA 7891',
      status: 'Regular',
      animaisInspecionados: (guardiao.tgasVigente?.animaisSobGuarda || []).map((a) => ({
        animalId: a.animalId,
        marcacaoFisicaConferida: true,
        condicaoSanitaria: 'Excelente estado de saúde e plumagem intacta',
        fotoAnimalUrl: 'foto_inspecao_recente.jpg'
      })),
      fotoRecintoUrl: 'foto_recinto_semestral.jpg',
      observacoesManejo: 'Alimentação balanceada com frutas e sementes; recinto higienizado diariamente.'
    };

    const atualizado: GuardiaoItem = {
      ...guardiao,
      relatoriosSemestrais: [novoRel, ...relatorios]
    };

    saveGuardiaoItem(atualizado);
    setModalNovoRelatorioAberto(false);
    alert('Relatório semestral homologado com atestado veterinário e conferência de anilhas/microchips!');
  };

  return (
    <div className="space-y-6 w-full pb-12" data-testid="pagina-guardiao-acompanhamento">
      {/* Header Canônico SEIA V2 */}
      <SeiaV2PageHeader
        title="Acompanhamento e Registro de Ocorrências"
        subtitle={`Guardião: ${guardiao.requerente.nomeOuRazaoSocial} · CPF: ${guardiao.requerente.cpfCnpj} · Recinto: ${guardiao.recinto.municipio} / BA`}
        badge={
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-[#0F4C3A] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {guardiao.tgasVigente?.numero || 'TGAS VIGENTE'}
            </span>
            <Badge variant="outline" className="text-xs">
              {guardiao.recinto.municipio} / BA
            </Badge>
            <Badge variant={guardiao.tgasVigente?.situacao === 'Vigente' ? 'success' : 'warning'} dot>
              {guardiao.tgasVigente?.situacao || 'Sem termo'}
            </Badge>
          </div>
        }
        backButton={{
          onClick: onVoltar,
          label: 'Voltar',
          title: 'Voltar',
          dataTestId: 'btn-voltar-acompanhamento'
        }}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTipoDocModal('DR012-DOC003');
                setModalDocAberto(true);
              }}
              data-testid="btn-ver-notificacao-a4"
              className="text-xs gap-1.5 h-9"
            >
              <FileText className="w-3.5 h-3.5" /> Notificação Adequação (DOC003)
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalNovaOcorrenciaAberto(true)}
              data-testid="btn-abrir-modal-ocorrencia"
              className="text-xs gap-1.5 h-9 border-amber-400 text-amber-900 hover:bg-amber-50"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Comunicar Ocorrência (48h)
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalNovoRelatorioAberto(true)}
              data-testid="btn-abrir-modal-relatorio"
              className="text-xs gap-1.5 h-9 bg-[#0F4C3A] text-white"
            >
              <Plus className="w-3.5 h-3.5" /> Enviar Relatório Semestral
            </Button>
          </div>
        }
      />

      {/* 1. RELATÓRIOS SEMESTRAIS E PRORROGAÇÃO ANUAL (RN-015 / RN-016) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Relatórios Semestrais Obrigatórios e Prorrogação Anual (RN-015 / RN-016)
            </h3>
            <p className="text-[11px] text-slate-500">
              Submissão a cada 6 meses com conferência de anilhas/microchips e laudo assinado por Médico Veterinário.
            </p>
          </div>
          <Badge variant="outline">
            Vigência Atual: {guardiao.tgasVigente?.dataValidade || '12 meses'}
          </Badge>
        </div>

        {/* Alerta de Regra Crucial: Atraso bloqueia prorrogação mas não encerra (RN-015) */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950 flex items-start gap-2.5 text-[11px]">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Regra Mandatória RN-015:</strong> Caso o relatório semestral não seja submetido no prazo, a
            prorrogação anual automática fica bloqueada e é emitida notificação de advertência. O atraso{' '}
            <strong>NÃO encerra o termo automaticamente</strong>, resguardando o bem-estar dos animais até deliberação da CGFAU.
          </div>
        </div>

        {relatorios.length === 0 ? (
          <div className="p-6 border border-dashed border-slate-300 rounded-xl text-center text-slate-400">
            Nenhum relatório semestral submetido ainda. Clique em "Enviar Relatório Semestral" acima.
          </div>
        ) : (
          <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Período Semestral</th>
                <th className="p-3">Data de Envio</th>
                <th className="p-3">Médico Veterinário (CRMV)</th>
                <th className="p-3">Conferência de Marcações</th>
                <th className="p-3">Status</th>
                <th className="p-3">Parecer Clínico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {relatorios.map((rel) => (
                <tr key={rel.id}>
                  <td className="p-3 font-semibold text-slate-800">{rel.periodoSemestral}</td>
                  <td className="p-3 font-mono">{rel.dataEnvio}</td>
                  <td className="p-3">{rel.veterinarioNome}</td>
                  <td className="p-3">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Conferidas
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge variant={rel.status === 'Regular' ? 'success' : 'warning'}>
                      {rel.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-slate-600">{rel.observacoesManejo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 2. REGISTRO DE OCORRÊNCIAS (RN-017 A RN-024) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Registro de Ocorrências e Prazos Oficiais
            </h3>
            <p className="text-[11px] text-slate-500">
              Prazos regulamentares: Óbito (48h / necropsia 30 dias úteis), Fuga (48h / BO 5 dias úteis), Transporte
              (antecedência 60 dias).
            </p>
          </div>
        </div>

        {ocorrencias.length === 0 ? (
          <div className="p-6 border border-dashed border-slate-300 rounded-xl text-center text-slate-400">
            Nenhuma ocorrência registrada para este guardião até o momento.
          </div>
        ) : (
          <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Tipo de Ocorrência</th>
                <th className="p-3">Animal Envolvido</th>
                <th className="p-3">Prazo Regulamentar</th>
                <th className="p-3">Descrição dos Fatos</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ocorrencias.map((oc) => (
                <tr key={oc.id}>
                  <td className="p-3 font-mono">{oc.dataOcorrencia}</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        oc.tipo === 'Óbito' || oc.tipo === 'Fuga / Furto' ? 'danger' : 'warning'
                      }
                    >
                      {oc.tipo}
                    </Badge>
                  </td>
                  <td className="p-3 font-semibold">{oc.animalNome || '-'}</td>
                  <td className="p-3 font-mono text-emerald-800 font-bold">
                    {oc.dentroDoPrazo ? 'Comunicado em < 48h' : 'Fora do Prazo'}
                  </td>
                  <td className="p-3 text-slate-600">
                    {oc.descricao}
                    {oc.boletimOcorrenciaNumero && (
                      <span className="block font-mono text-[10px] text-slate-400">
                        BO: {oc.boletimOcorrenciaNumero}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant="success">Processada</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 3. HISTÓRICO DE TERMOS SUBSTITUÍDOS */}
      {guardiao.historicoTgas.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            3. Histórico de Versões do TGAS Substituídas (RN-025)
          </h3>
          <p className="text-[11px] text-slate-500">
            Conforme a norma, a exclusão ou inclusão de animais gera um TGAS substituto com referência expressa ao anterior.
          </p>

          <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Número do TGAS</th>
                <th className="p-3">Data de Emissão</th>
                <th className="p-3">Animais Vinculados</th>
                <th className="p-3">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guardiao.historicoTgas.map((t) => (
                <tr key={t.id}>
                  <td className="p-3 font-mono font-bold text-slate-700">{t.numero}</td>
                  <td className="p-3 font-mono">{t.dataEmissao}</td>
                  <td className="p-3">{t.animaisSobGuarda.length} animais</td>
                  <td className="p-3">
                    <Badge variant="gray">Substituído</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL COMUNICAR OCORRÊNCIA */}
      {modalNovaOcorrenciaAberto && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Comunicação Obrigatória de Ocorrência (48h)</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Tipo de Evento *</label>
                <select
                  value={tipoOcorrencia}
                  onChange={(e) => setTipoOcorrencia(e.target.value as any)}
                  data-testid="select-tipo-ocorrencia"
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold"
                >
                  <option value="Óbito">Óbito (comunicação 48h / necropsia 30 dias)</option>
                  <option value="Fuga / Furto">Fuga ou Furto (comunicação 48h / BO 5 dias)</option>
                  <option value="Nascimento">Nascimento (reprodução proibida)</option>
                  <option value="Transporte Veterinário">Transporte Veterinário de Urgência</option>
                  <option value="Outro Transporte">Mudança de Domicílio / Outro Transporte (≥ 60 dias)</option>
                  <option value="Substituição de Marcação">Substituição de Marcação Física</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Animal Envolvido *</label>
                <select
                  value={animalOcorrenciaId}
                  onChange={(e) => setAnimalOcorrenciaId(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs"
                >
                  {(guardiao.tgasVigente?.animaisSobGuarda || []).map((an) => (
                    <option key={an.animalId} value={an.animalId}>
                      {an.nomeComum} ({an.numeroDigital} — {an.codigoMarcacao})
                    </option>
                  ))}
                </select>
              </div>

              {tipoOcorrencia === 'Fuga / Furto' && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Número do Boletim de Ocorrência (BO Policial) *
                  </label>
                  <input
                    type="text"
                    value={boNumero}
                    onChange={(e) => setBoNumero(e.target.value)}
                    placeholder="Ex: BO-PCBA-2026/001928"
                    className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Descrição Circunstanciada dos Fatos *</label>
                <textarea
                  rows={3}
                  value={descricaoOcorrencia}
                  onChange={(e) => setDescricaoOcorrencia(e.target.value)}
                  placeholder="Relate data, hora, causas prováveis e providências adotadas..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalNovaOcorrenciaAberto(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSalvarOcorrencia}
                data-testid="btn-confirmar-ocorrencia"
                className="bg-[#0F4C3A] text-white"
              >
                Registrar Ocorrência
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO RELATÓRIO SEMESTRAL */}
      {modalNovoRelatorioAberto && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Submissão de Relatório Semestral de Guarda</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Período Semestral *</label>
                <input
                  type="text"
                  value={periodoRelatorio}
                  onChange={(e) => setPeriodoRelatorio(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Médico Veterinário Responsável (CRMV) *
                </label>
                <input
                  type="text"
                  value={vetRelatorio}
                  onChange={(e) => setVetRelatorio(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700">Conferência dos Animais:</span>
                <p className="text-[10px] text-slate-500">
                  O veterinário atesta que inspecionou pessoalmente os{' '}
                  {guardiao.tgasVigente?.animaisSobGuarda.length} animais e confirmou a integridade das marcações físicas.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalNovoRelatorioAberto(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSalvarRelatorioSemestral}
                data-testid="btn-confirmar-relatorio-semestral"
                className="bg-[#0F4C3A] text-white"
              >
                Submeter Relatório
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal A4 de Notificação Técnica DOC003 */}
      <FaunaDocumentModal
        isOpen={modalDocAberto}
        onClose={() => setModalDocAberto(false)}
        tipo={tipoDocModal}
        guardiao={guardiao}
        tgas={guardiao.tgasVigente}
      />
    </div>
  );
};
