import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  ClipboardCheck,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  Building,
  RefreshCw,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Users,
  HeartCrack,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { GuardiaoItem, SituacaoGuardiao, SituacaoTgas } from '@/types/faunaR3R4';
import { getGuardioesList, resetFaunaR3R4ToSeed, subscribeFaunaR3R4 } from '@/data/faunaR3R4Mock';
import { FaunaDocumentModal, TipoDocumentoFauna } from './FaunaDocumentModal';

export type GuardiaoSubView =
  | 'listagem'
  | 'requerimento'
  | 'analise-vistoria'
  | 'vinculo-tgas'
  | 'acompanhamento'
  | 'encerramento';

interface GuardiaoListPageProps {
  onAbrirSubView: (subview: GuardiaoSubView, id?: string) => void;
  perfilAtivo: 'cgfau' | 'cetas' | 'requerente';
  onTrocarPerfil: (p: 'cgfau' | 'cetas' | 'requerente') => void;
}

export const GuardiaoListPage: React.FC<GuardiaoListPageProps> = ({
  onAbrirSubView,
  perfilAtivo,
  onTrocarPerfil
}) => {
  const [guardioes, setGuardioes] = useState<GuardiaoItem[]>([]);
  const [busca, setBusca] = useState<string>('');
  const [filtroSituacaoGuardiao, setFiltroSituacaoGuardiao] = useState<string>('todas');
  const [filtroSituacaoTgas, setFiltroSituacaoTgas] = useState<string>('todas');
  const [pagina, setPagina] = useState<number>(1);
  const [porPagina] = useState<number>(10);

  // Modal Visualizador de Documentos A4
  const [modalDocAberto, setModalDocAberto] = useState<boolean>(false);
  const [tipoDocModal, setTipoDocModal] = useState<TipoDocumentoFauna>('DR012-DOC001');
  const [guardiaoSelecionadoDoc, setGuardiaoSelecionadoDoc] = useState<GuardiaoItem | undefined>(undefined);

  useEffect(() => {
    setGuardioes(getGuardioesList());
    const unsub = subscribeFaunaR3R4(() => {
      setGuardioes(getGuardioesList());
    });
    return () => unsub();
  }, []);

  const itensFiltrados = useMemo(() => {
    return guardioes.filter((g) => {
      if (busca) {
        const termo = busca.toLowerCase();
        const match =
          g.numeroCadastro.toLowerCase().includes(termo) ||
          g.requerente.nomeOuRazaoSocial.toLowerCase().includes(termo) ||
          g.requerente.cpfCnpj.includes(termo) ||
          g.recinto.municipio.toLowerCase().includes(termo);
        if (!match) return false;
      }

      if (filtroSituacaoGuardiao !== 'todas' && g.situacao !== filtroSituacaoGuardiao) return false;

      if (filtroSituacaoTgas !== 'todas') {
        if (!g.tgasVigente && filtroSituacaoTgas !== 'Sem termo') return false;
        if (g.tgasVigente && g.tgasVigente.situacao !== filtroSituacaoTgas) return false;
      }

      return true;
    });
  }, [guardioes, busca, filtroSituacaoGuardiao, filtroSituacaoTgas]);

  const totalItens = itensFiltrados.length;
  const totalPaginas = Math.ceil(totalItens / porPagina) || 1;
  const itensPaginados = useMemo(() => {
    const inicio = (pagina - 1) * porPagina;
    return itensFiltrados.slice(inicio, inicio + porPagina);
  }, [itensFiltrados, pagina, porPagina]);

  const handleExportarCsv = () => {
    const headers = [
      'Numero_Cadastro',
      'Guardiao',
      'CPF_CNPJ',
      'Municipio_Recinto',
      'Situacao_Guardiao',
      'Animais_Sob_Guarda',
      'Numero_TGAS',
      'Situacao_TGAS'
    ];
    const rows = itensFiltrados.map((g) => [
      g.numeroCadastro,
      `"${g.requerente.nomeOuRazaoSocial}"`,
      g.requerente.cpfCnpj,
      g.recinto.municipio,
      g.situacao,
      g.tgasVigente?.animaisSobGuarda.length || 0,
      g.tgasVigente?.numero || '-',
      g.tgasVigente?.situacao || 'Sem termo'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `INEMA_GUARDIOES_TGAS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSituacaoGuardiaoBadge = (sit: SituacaoGuardiao) => {
    switch (sit) {
      case 'Habilitado':
        return <Badge variant="success" dot>Habilitado</Badge>;
      case 'Em análise':
        return <Badge variant="gray" dot>Em análise</Badge>;
      case 'Em adequação':
        return <Badge variant="warning" dot>Em adequação</Badge>;
      case 'Em complementação':
        return <Badge variant="warning" dot>Em complementação</Badge>;
      case 'Indeferido':
        return <Badge variant="danger" dot>Indeferido</Badge>;
      case 'Cancelado':
        return <Badge variant="gray" dot>Cancelado</Badge>;
      default:
        return <Badge variant="gray">{sit}</Badge>;
    }
  };

  const getSituacaoTgasBadge = (sit?: SituacaoTgas) => {
    if (!sit) return <span className="text-slate-400">Sem termo</span>;
    switch (sit) {
      case 'Vigente':
        return <Badge variant="success" dot>Vigente</Badge>;
      case 'Aguardando assinatura':
        return <Badge variant="warning" dot>Aguardando assinatura</Badge>;
      case 'Substituído':
        return <Badge variant="gray" dot>Substituído</Badge>;
      case 'Encerrado':
        return <Badge variant="danger" dot>Encerrado</Badge>;
      default:
        return <Badge variant="gray">{sit}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" data-testid="pagina-guardiao-listagem">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Início</span>
            <span>›</span>
            <span>Gestão de Fauna</span>
            <span>›</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Guardiões e Termo de Guarda de Animais Silvestres (TGAS)
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Guardião de Animais Silvestres / TGAS (DR012)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastro, análise, habilitação, emissão de laudos CETAS, termos de guarda e acompanhamento semestral
          </p>
        </div>

        {/* Seletor de Perfil & CTA */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-[11px] font-medium text-slate-500 pl-1.5 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#0F4C3A]" /> Perfil:
            </span>
            <select
              value={perfilAtivo}
              onChange={(e) => onTrocarPerfil(e.target.value as any)}
              data-testid="seletor-perfil-guardiao"
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs rounded-lg px-2 py-1 font-semibold border-none cursor-pointer"
            >
              <option value="cgfau">Coordenador CGFAU</option>
              <option value="cetas">Médico Veterinário CETAS</option>
              <option value="requerente">Requerente / Cidadão</option>
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onAbrirSubView('requerimento')}
            data-testid="btn-novo-requerimento-guardiao"
            className="text-xs gap-1.5 h-9 bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Requerimento de Guardião</span>
          </Button>
        </div>
      </div>

      {/* Toolbar Canônica de Busca e Filtros */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar por número de cadastro, nome do guardião, CPF/CNPJ ou município..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
              data-testid="input-busca-guardiao"
              className="w-full h-9 pl-9 pr-4 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filtroSituacaoGuardiao}
              onChange={(e) => setFiltroSituacaoGuardiao(e.target.value)}
              className="h-9 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3"
            >
              <option value="todas">Situação do Guardião (Todas)</option>
              <option value="Habilitado">Habilitado</option>
              <option value="Em análise">Em análise</option>
              <option value="Em adequação">Em adequação</option>
              <option value="Em complementação">Em complementação</option>
              <option value="Indeferido">Indeferido</option>
            </select>

            <select
              value={filtroSituacaoTgas}
              onChange={(e) => setFiltroSituacaoTgas(e.target.value)}
              className="h-9 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3"
            >
              <option value="todas">Situação TGAS (Todas)</option>
              <option value="Vigente">TGAS Vigente</option>
              <option value="Aguardando assinatura">Aguardando Assinatura</option>
              <option value="Encerrado">Encerrado</option>
              <option value="Sem termo">Sem Termo</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportarCsv}
              data-testid="btn-exportar-planilha-guardiao"
              className="text-xs gap-1.5 h-9"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela de Guardiões e Termos */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold select-none">
                <th className="py-3 px-4">Cadastro</th>
                <th className="py-3 px-4">Guardião / Requerente</th>
                <th className="py-3 px-4">Município do Recinto</th>
                <th className="py-3 px-4">Situação do Cadastro</th>
                <th className="py-3 px-4">Animais Sob Guarda</th>
                <th className="py-3 px-4">Situação do TGAS</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {itensPaginados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Nenhum guardião ou termo de guarda encontrado.
                  </td>
                </tr>
              ) : (
                itensPaginados.map((item) => {
                  const qtdAnimais = item.tgasVigente?.animaisSobGuarda.length || 0;

                  return (
                    <tr
                      key={item.id}
                      data-testid={`linha-guardiao-${item.id}`}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-100">
                        {item.numeroCadastro}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {item.requerente.nomeOuRazaoSocial}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {item.requerente.cpfCnpj}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 dark:text-slate-200 block">
                          {item.recinto.municipio} / BA
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.recinto.areaM2} m² ({item.recinto.tipoRecinto})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{getSituacaoGuardiaoBadge(item.situacao)}</td>
                      <td className="py-3.5 px-4 font-mono">
                        <span
                          className={`font-bold ${
                            qtdAnimais >= 5 ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {qtdAnimais}
                        </span>
                        <span className="text-slate-400 text-[10px]"> / 5 máx</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          {getSituacaoTgasBadge(item.tgasVigente?.situacao)}
                          {item.tgasVigente && (
                            <span className="block font-mono text-[10px] text-slate-400 mt-0.5">
                              {item.tgasVigente.numero}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Visualizar Requerimento */}
                          <button
                            onClick={() => onAbrirSubView('requerimento', item.id)}
                            data-testid={`btn-ver-requerimento-${item.id}`}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#0F4C3A] cursor-pointer"
                            title="Visualizar Requerimento F-TEC-187"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Análise e Vistoria */}
                          {perfilAtivo !== 'requerente' && (
                            <button
                              onClick={() => onAbrirSubView('analise-vistoria', item.id)}
                              data-testid={`btn-analise-vistoria-${item.id}`}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer"
                              title="Análise Documental e Vistoria CGFAU"
                            >
                              <ClipboardCheck className="w-4 h-4" />
                            </button>
                          )}

                          {/* Vínculo de Animais e Emissão do TGAS */}
                          {perfilAtivo !== 'requerente' && item.situacao === 'Habilitado' && (
                            <button
                              onClick={() => onAbrirSubView('vinculo-tgas', item.id)}
                              data-testid={`btn-vinculo-tgas-${item.id}`}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-700 cursor-pointer"
                              title="Indicação de Animais e Termo de Guarda (TGAS)"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          )}

                          {/* Acompanhamento Semestral e Ocorrências */}
                          {item.tgasVigente && (
                            <button
                              onClick={() => onAbrirSubView('acompanhamento', item.id)}
                              data-testid={`btn-acompanhamento-${item.id}`}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 cursor-pointer"
                              title="Acompanhamento Semestral e Ocorrências"
                            >
                              <Activity className="w-4 h-4" />
                            </button>
                          )}

                          {/* Encerramento do TGAS */}
                          {item.tgasVigente && item.tgasVigente.situacao === 'Vigente' && (
                            <button
                              onClick={() => onAbrirSubView('encerramento', item.id)}
                              data-testid={`btn-encerramento-${item.id}`}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Encerramento do TGAS e Retorno ao CETAS"
                            >
                              <HeartCrack className="w-4 h-4" />
                            </button>
                          )}

                          {/* Ver TGAS A4 */}
                          {item.tgasVigente && (
                            <button
                              onClick={() => {
                                setGuardiaoSelecionadoDoc(item);
                                setTipoDocModal('DR012-DOC001');
                                setModalDocAberto(true);
                              }}
                              data-testid={`btn-doc-tgas-${item.id}`}
                              className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 cursor-pointer"
                              title="Visualizar TGAS Oficial em A4"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé e Paginação */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Exibindo <strong>{itensPaginados.length}</strong> de <strong>{totalItens}</strong> guardiões
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              className="text-xs h-8"
            >
              Anterior
            </Button>
            <span className="font-mono px-2">
              Página {pagina} de {totalPaginas}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              className="text-xs h-8"
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Visualizador A4 de Documentos */}
      {modalDocAberto && guardiaoSelecionadoDoc && (
        <FaunaDocumentModal
          isOpen={modalDocAberto}
          onClose={() => setModalDocAberto(false)}
          tipo={tipoDocModal}
          guardiao={guardiaoSelecionadoDoc}
        />
      )}
    </div>
  );
};
