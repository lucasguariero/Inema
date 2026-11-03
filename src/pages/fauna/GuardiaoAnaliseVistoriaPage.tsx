import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Save,
  Camera,
  Upload,
  ShieldCheck,
  FileText,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GuardiaoItem } from '@/types/faunaR3R4';
import { saveGuardiaoItem, getGuardiaoById } from '@/data/faunaR3R4Mock';

interface GuardiaoAnaliseVistoriaPageProps {
  guardiaoId: string;
  onVoltar: () => void;
  perfilAtivo: 'cgfau' | 'cetas' | 'requerente';
  onConcluido?: () => void;
}

export const GuardiaoAnaliseVistoriaPage: React.FC<GuardiaoAnaliseVistoriaPageProps> = ({
  guardiaoId,
  onVoltar,
  perfilAtivo,
  onConcluido
}) => {
  const guardiao = getGuardiaoById(guardiaoId);

  const [dataVistoria, setDataVistoria] = useState<string>(
    guardiao?.vistoria?.data || new Date().toISOString().slice(0, 10)
  );
  const [equipeVistoria, setEquipeVistoria] = useState<string>(
    guardiao?.vistoria?.equipe?.join(', ') || 'Dr. Thiago Moreira (CRMV/BA 5512)'
  );
  const [resultado, setResultado] = useState<'Favorável' | 'Em adequação' | 'Desfavorável'>(
    guardiao?.vistoria?.resultado || 'Favorável'
  );
  const [parecer, setParecer] = useState<string>(
    guardiao?.vistoria?.parecer ||
      'Recinto em excelente estado de higienização, segurança contra fuga e enriquecimento ambiental instalado.'
  );
  const [prazoAdequacao, setPrazoAdequacao] = useState<number>(guardiao?.vistoria?.prazoAdequacaoDias || 60);
  const [fotos, setFotos] = useState<string[]>(
    guardiao?.vistoria?.fotos || ['foto_recinto_01.jpg', 'foto_recinto_seguranca.jpg']
  );
  const [complementacaoTexto, setComplementacaoTexto] = useState<string>('');

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

  const handleSolicitarComplementacao = () => {
    if (!complementacaoTexto.trim()) {
      alert('Digite o texto da complementação documental solicitada.');
      return;
    }

    const atualizado: GuardiaoItem = {
      ...guardiao,
      situacao: 'Em complementação',
      complementacaoSolicitada: complementacaoTexto
    };

    saveGuardiaoItem(atualizado);
    alert('Notificação de complementação enviada ao requerente sem prazo fixo.');
    if (onConcluido) onConcluido();
    else onVoltar();
  };

  const handleHomologarVistoria = () => {
    if (fotos.length === 0) {
      alert('É obrigatório anexar fotos do recinto na vistoria.');
      return;
    }

    // RN-007: Só vistoria favorável habilita
    let novaSituacao = guardiao.situacao;
    if (resultado === 'Favorável') novaSituacao = 'Habilitado';
    else if (resultado === 'Em adequação') novaSituacao = 'Em adequação';
    else if (resultado === 'Desfavorável') novaSituacao = 'Indeferido';

    const atualizado: GuardiaoItem = {
      ...guardiao,
      situacao: novaSituacao,
      vistoria: {
        data: dataVistoria,
        equipe: equipeVistoria.split(',').map((s) => s.trim()).filter(Boolean),
        resultado,
        parecer,
        prazoAdequacaoDias: resultado === 'Em adequação' ? prazoAdequacao : undefined,
        fotos
      }
    };

    saveGuardiaoItem(atualizado);
    alert(
      resultado === 'Favorável'
        ? 'Vistoria Favorável homologada! O Guardião está Habilitado para indicação de animais no CETAS.'
        : `Vistoria concluída com parecer ${resultado}. Situação do cadastro atualizada para: ${novaSituacao}.`
    );
    if (onConcluido) onConcluido();
    else onVoltar();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12" data-testid="pagina-guardiao-analise-vistoria">
      {/* Topbar com Retorno */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onVoltar}
            data-testid="btn-voltar-analise"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
            title="Voltar"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#0F4C3A]">
                {guardiao.numeroCadastro}
              </span>
              <Badge variant={guardiao.situacao === 'Habilitado' ? 'success' : 'gray'} dot>
                {guardiao.situacao}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Análise Documental e Vistoria In Loco
            </h1>
            <p className="text-xs text-slate-500">
              Requerente: <strong>{guardiao.requerente.nomeOuRazaoSocial}</strong> · {guardiao.recinto.municipio} / BA
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleHomologarVistoria}
          data-testid="btn-homologar-vistoria-guardiao"
          className="text-xs gap-1.5 h-9 bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Homologar Vistoria
        </Button>
      </div>

      {/* 1. Análise Documental */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />
          <span>1. Conferência e Análise Documental Técnica</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold block">Documento de Identidade</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {guardiao.documentos.documentoFotoIdentidade}
              </span>
            </div>
            <Badge variant="success" dot>Conferido</Badge>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold block">Comprovante de Residência</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {guardiao.documentos.comprovanteResidenciaAtualizado} (≤ 60 dias)
              </span>
            </div>
            <Badge variant="success" dot>Conferido</Badge>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold block">Antecedentes Criminais</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {guardiao.documentos.certidaoAntecedentesCriminais}
              </span>
            </div>
            <Badge variant="success" dot>Nada Consta</Badge>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold block">Débitos Ambientais (IBAMA/INEMA)</span>
              <span className="text-[10px] text-slate-400 font-mono">Certidões CND Válidas</span>
            </div>
            <Badge variant="success" dot>Regular</Badge>
          </div>
        </div>

        {/* Solicitação de Complementação */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-800 dark:text-slate-200">
            Necessidade de Complementação Documental?
          </h4>
          <p className="text-[11px] text-slate-500">
            Conforme a norma, solicitações de complementação não possuem prazo fixo para atendimento.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Descreva a complementação exigida..."
              value={complementacaoTexto}
              onChange={(e) => setComplementacaoTexto(e.target.value)}
              className="flex-1 h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSolicitarComplementacao}
              className="h-8 text-xs"
            >
              Solicitar Complementação
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Vistoria In Loco no Recinto */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#0F4C3A]" />
          <span>2. Registro de Vistoria Oficial no Recinto</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Data da Vistoria *</label>
            <input
              type="date"
              value={dataVistoria}
              onChange={(e) => setDataVistoria(e.target.value)}
              className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Equipe / Médico Veterinário Vistoriador *
            </label>
            <input
              type="text"
              value={equipeVistoria}
              onChange={(e) => setEquipeVistoria(e.target.value)}
              className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Resultado Conclusivo da Vistoria (RN-007) *
            </label>
            <div className="flex flex-wrap items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-800">
                <input
                  type="radio"
                  name="resultadoVistoriaGuardiao"
                  value="Favorável"
                  checked={resultado === 'Favorável'}
                  onChange={() => setResultado('Favorável')}
                  data-testid="radio-vistoria-guardiao-favoravel"
                  className="text-emerald-700"
                />
                <span>Favorável (Habilita o Guardião)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-800">
                <input
                  type="radio"
                  name="resultadoVistoriaGuardiao"
                  value="Em adequação"
                  checked={resultado === 'Em adequação'}
                  onChange={() => setResultado('Em adequação')}
                  data-testid="radio-vistoria-guardiao-adequacao"
                  className="text-amber-700"
                />
                <span>Em adequação (Exige prazo de reformas)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-800">
                <input
                  type="radio"
                  name="resultadoVistoriaGuardiao"
                  value="Desfavorável"
                  checked={resultado === 'Desfavorável'}
                  onChange={() => setResultado('Desfavorável')}
                  data-testid="radio-vistoria-guardiao-desfavoravel"
                  className="text-rose-700"
                />
                <span>Desfavorável (Indeferimento)</span>
              </label>
            </div>
          </div>

          {resultado === 'Em adequação' && (
            <div className="sm:col-span-2 p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <label className="block text-[11px] font-bold text-amber-900">
                Prazo Estipulado para Adequação das Instalações (dias):
              </label>
              <input
                type="number"
                value={prazoAdequacao}
                onChange={(e) => setPrazoAdequacao(Number(e.target.value))}
                className="w-28 h-8 rounded-lg border border-amber-300 bg-white px-2.5 font-bold text-xs"
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Parecer Técnico Detalhado da Vistoria *
            </label>
            <textarea
              rows={3}
              value={parecer}
              onChange={(e) => setParecer(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Fotos Comprobatórias do Recinto (Mínimo 1)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {fotos.map((f, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 flex items-center gap-1.5 font-mono text-[11px]"
                >
                  <Camera className="w-3 h-3 text-emerald-700" />
                  <span>{f}</span>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFotos([...fotos, `foto_adicional_${Date.now()}.jpg`])}
                className="h-8 text-[11px] gap-1"
              >
                <Upload className="w-3 h-3" /> Anexar Foto
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
