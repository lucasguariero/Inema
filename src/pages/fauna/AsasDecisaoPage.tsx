import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  FileText,
  ShieldCheck,
  Building,
  Upload,
  Calendar,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AsasItem, SituacaoAsas } from '@/types/faunaR3R4';
import { saveAsasItem, getAsasById } from '@/data/faunaR3R4Mock';
import { FaunaDocumentModal, TipoDocumentoFauna } from './FaunaDocumentModal';
import { PerfilDemonstrativoFauna } from './AsasListPage';

interface AsasDecisaoPageProps {
  asasId: string;
  onVoltar: () => void;
  perfilAtivo: PerfilDemonstrativoFauna;
  onConcluido?: () => void;
}

export const AsasDecisaoPage: React.FC<AsasDecisaoPageProps> = ({
  asasId,
  onVoltar,
  perfilAtivo,
  onConcluido
}) => {
  const asas = getAsasById(asasId);

  // Estados dos Modais
  const [modalDocAberto, setModalDocAberto] = useState<boolean>(false);
  const [tipoDocModal, setTipoDocModal] = useState<TipoDocumentoFauna>('DR009-DOC001');

  // Ações de Gestão
  const [justificativaDecisao, setJustificativaDecisao] = useState<string>('');
  const [modalSuspenderAberto, setModalSuspenderAberto] = useState<boolean>(false);
  const [modalReativarAberto, setModalReativarAberto] = useState<boolean>(false);
  const [modalDesativarAberto, setModalDesativarAberto] = useState<boolean>(false);
  const [modalRenovarAberto, setModalRenovarAberto] = useState<boolean>(false);
  const [modalTrocarRtAberto, setModalTrocarRtAberto] = useState<boolean>(false);

  // Destinação individual de animais para desativação (RN-027)
  const [destinacoesAnimais, setDestinacoesAnimais] = useState<Record<string, string>>({
    'anim-101': 'CETAS Salvador',
    'anim-102': 'Soltura em Natureza na ASAS Fazenda Boa Esperança'
  });

  // Troca de RT
  const [novoRtNome, setNovoRtNome] = useState<string>('Dra. Camila Toledo');
  const [novaArtNumero, setNovaArtNumero] = useState<string>('ART-2026-990011');
  const [novaArtValidade, setNovaArtValidade] = useState<string>('2028-10-15');

  if (!asas) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Área de Soltura não encontrada.</p>
        <Button onClick={onVoltar} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  // Deferimento (Decisão Favorável CGFAU)
  const handleDeferir = () => {
    const hoje = new Date();
    const emissao = hoje.toLocaleDateString('pt-BR');
    const validadeData = new Date(hoje.getFullYear() + 2, hoje.getMonth(), hoje.getDate());
    const validade = validadeData.toLocaleDateString('pt-BR');

    const atualizada: AsasItem = {
      ...asas,
      situacao: 'Aguardando termo',
      dataEmissaoCertificado: emissao,
      dataValidadeCertificado: validade,
      documentos: {
        ...asas.documentos,
        termoCompromissoAssinado: undefined // Aguardando anexo assinado
      },
      historico: [
        ...asas.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: 'Dr. Herickles Almado',
          papel: 'Coordenador CGFAU',
          acao: `Requerimento Deferido. Certificado DOC001 emitido com validade até ${validade}. Emitido DOC003 Termo de Compromisso (Situação: Aguardando termo).`
        }
      ]
    };

    saveAsasItem(atualizada);
    alert('Decisão Favorável homologada! O Certificado DOC001 e o Termo de Compromisso DOC003 foram gerados.');
  };

  // Indeferimento (Decisão Desfavorável CGFAU)
  const handleIndeferir = () => {
    if (!justificativaDecisao.trim()) {
      alert('A fundamentação do indeferimento é obrigatória.');
      return;
    }

    const atualizada: AsasItem = {
      ...asas,
      situacao: 'Indeferida',
      historico: [
        ...asas.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: 'Dr. Herickles Almado',
          papel: 'Coordenador CGFAU',
          acao: `Requerimento Indeferido com emissão de DOC002 Notificação de Indeferimento. Registro somente leitura. Motivo: ${justificativaDecisao}`
        }
      ]
    };

    saveAsasItem(atualizada);
    alert('Requerimento Indeferido. A notificação formal DOC002 foi emitida.');
  };

  // Anexar Termo de Compromisso e Ativar ASAS
  const handleAtivarAposTermo = () => {
    const atualizada: AsasItem = {
      ...asas,
      situacao: 'Ativa',
      documentos: {
        ...asas.documentos,
        termoCompromissoAssinado: 'Termo_Compromisso_Anexo_V_Assinado.pdf'
      },
      historico: [
        ...asas.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: 'Dr. Herickles Almado',
          papel: 'Coordenador CGFAU',
          acao: 'Termo de Compromisso assinado homologado. Área de Soltura ativada plenamente no SEIA.'
        }
      ]
    };

    saveAsasItem(atualizada);
    alert('Termo de Compromisso anexado com sucesso! A ASAS agora está Ativa.');
  };

  // Suspensão da ASAS (RN-027)
  const handleConfirmarSuspensao = () => {
    if (!justificativaDecisao.trim()) {
      alert('Informe o motivo da suspensão.');
      return;
    }

    const atualizada: AsasItem = {
      ...asas,
      situacao: 'Suspensa',
      motivoSuspensao: justificativaDecisao,
      historico: [
        ...asas.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: 'Dr. Herickles Almado',
          papel: 'Coordenador CGFAU',
          acao: `Área de Soltura Suspensa pela CGFAU. Motivo: ${justificativaDecisao}`,
          justificativa: justificativaDecisao
        }
      ]
    };

    saveAsasItem(atualizada);
    setModalSuspenderAberto(false);
    setJustificativaDecisao('');
    alert('Área de Soltura Suspensa. Solturas no DR008 estão bloqueadas para esta ASAS.');
  };

  // Reativação da ASAS
  const handleConfirmarReativacao = () => {
    const atualizada: AsasItem = {
      ...asas,
      situacao: 'Ativa',
      motivoSuspensao: undefined,
      historico: [
        ...asas.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: 'Dr. Herickles Almado',
          papel: 'Coordenador CGFAU',
          acao: `Área de Soltura Reativada após saneamento das pendências. Motivo: ${justificativaDecisao}`,
          justificativa: justificativaDecisao
        }
      ]
    };

    saveAsasItem(atualizada);
    setModalReativarAberto(false);
    setJustificativaDecisao('');
    alert('Área de Soltura Reativada com sucesso!');
  };

  // Renovação da ASAS (RN-025: +2 anos pela CGFAU sem vistoria obrigatória)
  const handleConfirmarRenovacao = () => {
    const validadeOriginal = asas.dataValidadeCertificado ? new Date(asas.dataValidadeCertificado) : new Date();
    const novaValidadeAno = validadeOriginal.getFullYear() + 2;
    const novaValidade = `10/05/${novaValidadeAno}`;

    const atualizada: AsasItem = {
      ...asas,
      situacao: 'Ativa',
      dataValidadeCertificado: novaValidade,
      historico: [
        ...asas.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: 'Dr. Herickles Almado',
          papel: 'Coordenador CGFAU',
          acao: `Certificado Renovado pela CGFAU por mais 2 anos. Nova validade: ${novaValidade}. Sem necessidade de nova vistoria (RN-025).`
        }
      ]
    };

    saveAsasItem(atualizada);
    setModalRenovarAberto(false);
    alert(`Certificado de ASAS Renovado com sucesso até ${novaValidade}!`);
  };

  // Desativação Definitiva com Destinação Individual de Animais (RN-027)
  const handleConfirmarDesativacao = () => {
    const atualizada: AsasItem = {
      ...asas,
      situacao: 'Desativada',
      historico: [
        ...asas.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: 'Dr. Herickles Almado',
          papel: 'Coordenador CGFAU',
          acao: `Área de Soltura Desativada definitivamente. Animais em recinto destinados individualmente: ${JSON.stringify(
            destinacoesAnimais
          )}.`
        }
      ]
    };

    saveAsasItem(atualizada);
    setModalDesativarAberto(false);
    alert('Área de Soltura Desativada definitivamente.');
    onVoltar();
  };

  // Substituição de RT (RN-038: Mantém validade original)
  const handleConfirmarTrocaRt = () => {
    const atualizada: AsasItem = {
      ...asas,
      responsavelTecnico: {
        nome: novoRtNome,
        formacao: 'Médica Veterinária',
        conselhoClasse: 'CRMV/BA',
        numeroRegistro: '9982',
        artNumero: novaArtNumero,
        artValidade: novaArtValidade
      },
      historico: [
        ...asas.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: 'Dr. Herickles Almado',
          papel: 'Coordenador CGFAU',
          acao: `Substituição de Responsável Técnico homologada para ${novoRtNome} (ART ${novaArtNumero}). Validade do certificado mantida inalterada (${asas.dataValidadeCertificado}).`
        }
      ]
    };

    saveAsasItem(atualizada);
    setModalTrocarRtAberto(false);
    alert('Responsável Técnico substituído com sucesso, preservando a validade original do certificado.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12" data-testid="pagina-asas-decisao">
      {/* Topbar com Retorno */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onVoltar}
            data-testid="btn-voltar-decisao"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Voltar"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#0F4C3A]">
                {asas.numero}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {asas.categoria}
              </Badge>
              <Badge
                variant={
                  asas.situacao === 'Ativa'
                    ? 'success'
                    : asas.situacao === 'Certificado vencido' || asas.situacao === 'Indeferida'
                    ? 'danger'
                    : asas.situacao === 'Suspensa'
                    ? 'warning'
                    : 'gray'
                }
                dot
              >
                {asas.situacao}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Decisão, Certificado e Gestão da Área
            </h1>
            <p className="text-xs text-slate-500">
              Imóvel: <strong>{asas.propriedade.nome}</strong> · {asas.propriedade.municipio} / BA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {asas.dataEmissaoCertificado && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTipoDocModal('DR009-DOC001');
                setModalDocAberto(true);
              }}
              data-testid="btn-ver-certificado-a4"
              className="text-xs gap-1.5 h-9 text-[#0F4C3A]"
            >
              <FileText className="w-3.5 h-3.5" /> Ver Certificado A4 (DOC001)
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTipoDocModal('DR009-DOC003');
              setModalDocAberto(true);
            }}
            data-testid="btn-ver-termo-compromisso-a4"
            className="text-xs gap-1.5 h-9"
          >
            <FileText className="w-3.5 h-3.5" /> Termo Compromisso (DOC003)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTipoDocModal('DR009-DOC002');
              setModalDocAberto(true);
            }}
            data-testid="btn-ver-indeferimento-a4"
            className="text-xs gap-1.5 h-9 text-rose-700"
          >
            <FileText className="w-3.5 h-3.5" /> Notificação Indeferimento (DOC002)
          </Button>
        </div>
      </div>

      {/* Resumo da Vistoria In Loco Realizada */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />
            <span>Parecer da Vistoria Técnica F-TEC-133</span>
          </h3>
          {asas.vistoria ? (
            <Badge variant={asas.vistoria.resultado === 'Favorável' ? 'success' : 'danger'}>
              Resultado: {asas.vistoria.resultado}
            </Badge>
          ) : (
            <Badge variant="warning">Vistoria Pendente</Badge>
          )}
        </div>

        {asas.vistoria ? (
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <p>
              <strong>Laudo Oficial:</strong> {asas.vistoria.numero} — Data:{' '}
              {asas.vistoria.data} (Equipe: {asas.vistoria.equipe.join(', ')})
            </p>
            <p>
              <strong>Vegetação Nativa:</strong> {asas.vistoria.vegetacaoPct}% ({asas.vistoria.vegetacaoHa} ha)
            </p>
            <p>
              <strong>Espécies Adequadas Recomendadas:</strong> {asas.vistoria.especiesAdequadasTexto}
            </p>
            <p className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <strong>Conclusão Técnica:</strong> {asas.vistoria.justificativa}
            </p>
          </div>
        ) : (
          <p className="text-slate-500">
            Esta área ainda não possui registro de vistoria F-TEC-133 concluído. A decisão final requer a
            homologação do laudo técnico.
          </p>
        )}
      </div>

      {/* BLOCO DECISÓRIO INICIAL (Se Em análise ou Aguardando termo) */}
      {(asas.situacao === 'Em análise' || asas.situacao === 'Aguardando termo' || asas.situacao === 'Em cadastro') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            Despacho Decisório da Coordenação de Fauna (CGFAU)
          </h3>

          {asas.situacao === 'Aguardando termo' ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded-xl space-y-3 text-amber-950 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Parecer Favorável Homologado — Aguardando Anexo do Termo de Compromisso Assinado</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                O Certificado DOC001 foi gerado com sucesso. Para que a ASAS passe ao estado <strong>Ativa</strong> e
                fique plenamente apta para solturas no DR008, anexe o Termo de Compromisso (Anexo V) assinado pelo
                proprietário:
              </p>
              <div className="pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAtivarAposTermo}
                  data-testid="btn-anexar-termo-ativar"
                  className="bg-[#0F4C3A] text-white text-xs gap-1.5 h-9"
                >
                  <Upload className="w-3.5 h-3.5" /> Anexar Termo Assinado e Ativar ASAS
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Opção 1: Deferimento */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Deferir Requerimento de ASAS</span>
                </div>
                <p className="text-[11px] text-emerald-950 leading-relaxed">
                  Emite o Certificado DOC001 válido por 2 anos, gera o Termo de Compromisso DOC003 e coloca o processo
                  na situação <strong>Aguardando termo</strong>.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDeferir}
                  data-testid="btn-deferir-asas"
                  className="w-full bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white text-xs h-9"
                >
                  Homologar Parecer Favorável (Deferir)
                </Button>
              </div>

              {/* Opção 2: Indeferimento */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-rose-700" />
                  <span>Indeferir Requerimento</span>
                </div>
                <p className="text-[11px] text-rose-950 leading-relaxed">
                  Emite a Notificação formal DOC002 e coloca o processo em <strong>Indeferida</strong> com status de
                  somente leitura.
                </p>
                <textarea
                  rows={2}
                  value={justificativaDecisao}
                  onChange={(e) => setJustificativaDecisao(e.target.value)}
                  placeholder="Fundamentação obrigatória do indeferimento..."
                  className="w-full rounded-lg border border-rose-200 bg-white p-2 text-xs"
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleIndeferir}
                  data-testid="btn-indeferir-asas"
                  className="w-full text-xs h-9"
                >
                  Indeferir Requerimento (DOC002)
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BLOCO DE GESTÃO DO CICLO DE VIDA (Se Ativa, Suspensa ou Certificado Vencido) */}
      {(asas.situacao === 'Ativa' || asas.situacao === 'Suspensa' || asas.situacao === 'Certificado vencido') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            Ações de Gestão e Ciclo de Vida da ASAS (CGFAU)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* 1. Renovar Certificado (+2 anos, RN-025) */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-2">
              <div>
                <span className="font-bold block text-slate-900 dark:text-slate-100">Renovação Bienal</span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Renovação direta por 2 anos pela CGFAU sem nova vistoria obrigatória (RN-025).
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalRenovarAberto(true)}
                data-testid="btn-abrir-renovacao-asas"
                className="text-xs h-8 w-full border-emerald-600 text-[#0F4C3A]"
              >
                Renovar Certificado
              </Button>
            </div>

            {/* 2. Suspender ou Reativar */}
            {asas.situacao === 'Suspensa' ? (
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold block text-emerald-900">Reativar ASAS</span>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    Restabelece a aptidão da área após saneamento das pendências.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setModalReativarAberto(true)}
                  data-testid="btn-abrir-reativacao-asas"
                  className="text-xs h-8 w-full bg-[#0F4C3A] text-white"
                >
                  Reativar Área
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold block text-amber-900">Suspender ASAS</span>
                  <p className="text-[10px] text-amber-700 mt-0.5">
                    Bloqueia solturas no DR008 em caso de irregularidades (RN-027).
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalSuspenderAberto(true)}
                  data-testid="btn-abrir-suspensao-asas"
                  className="text-xs h-8 w-full text-amber-800 border-amber-300"
                >
                  Suspender
                </Button>
              </div>
            )}

            {/* 3. Substituir Responsável Técnico (RN-038) */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-2">
              <div>
                <span className="font-bold block text-slate-900 dark:text-slate-100">Substituir RT</span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Atualiza RT com nova ART, mantendo validade original da certidão (RN-038).
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalTrocarRtAberto(true)}
                data-testid="btn-abrir-troca-rt-asas"
                className="text-xs h-8 w-full"
              >
                Substituir RT
              </Button>
            </div>

            {/* 4. Desativação Definitiva (RN-027) */}
            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 flex flex-col justify-between space-y-2">
              <div>
                <span className="font-bold block text-rose-900">Desativação Definitiva</span>
                <p className="text-[10px] text-rose-700 mt-0.5">
                  Exige destinação individual de cada animal em recinto (RN-027).
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setModalDesativarAberto(true)}
                data-testid="btn-abrir-desativacao-asas"
                className="text-xs h-8 w-full"
              >
                Desativar ASAS
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Relatórios Trimestrais de Acompanhamento (Para Categorias II e III) */}
      {(asas.categoria === 'Categoria II' || asas.categoria === 'Categoria III') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Relatórios Trimestrais do Responsável Técnico (RN-034)
              </h3>
              <p className="text-[11px] text-slate-500">
                Atrasos na entrega geram alerta no sistema; a suspensão só ocorre por decisão formal da CGFAU.
              </p>
            </div>
            <Badge variant="outline">
              Vigência Máxima de Reabilitação: 12 meses (+12 prorrogáveis)
            </Badge>
          </div>

          <table className="w-full text-left border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Período Trimestral</th>
                <th className="p-3">Data de Envio</th>
                <th className="p-3">Responsável Técnico</th>
                <th className="p-3">ART Vinculada</th>
                <th className="p-3">Status</th>
                <th className="p-3">Resumo do Manejo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {asas.relatoriosTrimestrais.map((rel) => (
                <tr key={rel.id}>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{rel.trimestre} / {rel.ano}</td>
                  <td className="p-3 font-mono">{rel.dataEnvio}</td>
                  <td className="p-3">{rel.responsavelTecnico}</td>
                  <td className="p-3 font-mono">{rel.artNumero}</td>
                  <td className="p-3">
                    <Badge variant={rel.status === 'Entregue' ? 'success' : 'danger'}>
                      {rel.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{rel.resumoManejo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL SUSPENDER ASAS */}
      {modalSuspenderAberto && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-amber-900 uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Suspender Área de Soltura (RN-027)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Ao suspender a ASAS, ela deixará imediatamente de ser elegível para receber novos animais no DR008.
              Informe a motivação formal:
            </p>
            <textarea
              rows={3}
              value={justificativaDecisao}
              onChange={(e) => setJustificativaDecisao(e.target.value)}
              placeholder="Ex: Atraso na entrega de relatórios trimestrais e necessidade de reforma estrutural..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalSuspenderAberto(false)}>
                Cancelar
              </Button>
              <Button variant="warning" size="sm" onClick={handleConfirmarSuspensao}>
                Confirmar Suspensão
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REATIVAR ASAS */}
      {modalReativarAberto && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-emerald-900 uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Reativar Área de Soltura</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Confirme a reativação da ASAS após a regularização das pendências que causaram a suspensão:
            </p>
            <textarea
              rows={3}
              value={justificativaDecisao}
              onChange={(e) => setJustificativaDecisao(e.target.value)}
              placeholder="Descreva a comprovação do saneamento das pendências..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalReativarAberto(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmarReativacao} className="bg-[#0F4C3A] text-white">
                Confirmar Reativação
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RENOVAR CERTIFICADO (+2 ANOS) */}
      {modalRenovarAberto && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Renovação de Certificado ASAS (RN-025)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Conforme a regra RN-025, a renovação por mais 2 anos é concedida diretamente pela CGFAU sem exigência de
              nova vistoria técnica in loco, avaliando a regularidade cadastral e dos relatórios anteriores.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px]">
              Nova vigência calculada: <strong>+ 2 (dois) anos adicionais</strong> a partir da data de vencimento.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalRenovarAberto(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmarRenovacao} className="bg-[#0F4C3A] text-white">
                Homologar Renovação
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUBSTITUIR RT (RN-038) */}
      {modalTrocarRtAberto && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />
              <span>Substituição de Responsável Técnico (RN-038)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              O novo profissional assumirá a responsabilidade técnica da ASAS. O certificado é reemitido mantendo
              estritamente a data de validade original anterior.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nome do Novo RT</label>
                <input
                  type="text"
                  value={novoRtNome}
                  onChange={(e) => setNovoRtNome(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nova ART de Cargo/Função</label>
                <input
                  type="text"
                  value={novaArtNumero}
                  onChange={(e) => setNovaArtNumero(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Validade da Nova ART</label>
                <input
                  type="date"
                  value={novaArtValidade}
                  onChange={(e) => setNovaArtValidade(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalTrocarRtAberto(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmarTrocaRt} className="bg-[#0F4C3A] text-white">
                Homologar Troca de RT
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DESATIVAÇÃO DEFINITIVA COM DESTINAÇÃO DE ANIMAIS (RN-027) */}
      {modalDesativarAberto && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-rose-900 uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Desativação Definitiva de ASAS (RN-027)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              A desativação definitiva é irreversível. Para áreas de Categoria II ou III, é obrigatório registrar a
              destinação individual de cada animal que se encontra em reabilitação ou aclimatação nos recintos:
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase">
                Destinação Individual dos Animais Abrigados:
              </h4>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1">
                  1. Mico-estrela (anim-101) — Recinto Primatas:
                </label>
                <select
                  value={destinacoesAnimais['anim-101']}
                  onChange={(e) =>
                    setDestinacoesAnimais({ ...destinacoesAnimais, 'anim-101': e.target.value })
                  }
                  className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs"
                >
                  <option value="CETAS Salvador">Retorno ao CETAS Salvador</option>
                  <option value="Outra ASAS">Transferência para outra ASAS II/III</option>
                  <option value="Soltura em Natureza">Soltura imediata autorizada</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1">
                  2. Papagaio-do-mangue (anim-102) — Recinto Aves:
                </label>
                <select
                  value={destinacoesAnimais['anim-102']}
                  onChange={(e) =>
                    setDestinacoesAnimais({ ...destinacoesAnimais, 'anim-102': e.target.value })
                  }
                  className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs"
                >
                  <option value="Soltura em Natureza na ASAS Fazenda Boa Esperança">
                    Soltura em Natureza na ASAS Fazenda Boa Esperança
                  </option>
                  <option value="CETAS Salvador">Retorno ao CETAS Salvador</option>
                  <option value="Outra ASAS">Transferência para outra ASAS II/III</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalDesativarAberto(false)}>
                Cancelar
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmarDesativacao}>
                Confirmar Desativação Definitiva
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualizador A4 de Documentos */}
      {modalDocAberto && (
        <FaunaDocumentModal
          isOpen={modalDocAberto}
          onClose={() => setModalDocAberto(false)}
          tipo={tipoDocModal}
          asas={asas}
        />
      )}
    </div>
  );
};
