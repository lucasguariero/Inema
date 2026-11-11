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
  MapPin,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { SeiaV2PageHeader } from '@/components/seia-v2/SeiaV2PageHeader';
import {
  GlaTableContainer,
  GlaTable,
  GlaTableHead,
  GlaTh,
  GlaPagination
} from '@/components/common/GlaTable';
import { AsasItem, CategoriaAsas, SituacaoAsas } from '@/types/faunaR3R4';
import {
  getAsasList,
  saveAsasItem,
  resetFaunaR3R4ToSeed,
  subscribeFaunaR3R4
} from '@/data/faunaR3R4Mock';
import { FaunaDocumentModal, TipoDocumentoFauna } from './FaunaDocumentModal';

export type PerfilDemonstrativoFauna = 'cgfau' | 'tecnico' | 'requerente';

interface AsasListPageProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
  onAbrirRequerimento: (id?: string, modo?: 'novo' | 'existente' | 'editar' | 'ver') => void;
  onAbrirVistoria: (id: string) => void;
  onAbrirDecisao: (id: string) => void;
  perfilAtivo: PerfilDemonstrativoFauna;
  onTrocarPerfil: (p: PerfilDemonstrativoFauna) => void;
}

export const AsasListPage: React.FC<AsasListPageProps> = ({
  onNavigate,
  onAbrirRequerimento,
  onAbrirVistoria,
  onAbrirDecisao,
  perfilAtivo,
  onTrocarPerfil
}) => {
  const [items, setItems] = useState<AsasItem[]>([]);
  const [busca, setBusca] = useState<string>('');
  const [filtroSituacao, setFiltroSituacao] = useState<string>('todas');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroUr, setFiltroUr] = useState<string>('todas');
  const [filtroMunicipio, setFiltroMunicipio] = useState<string>('todos');
  const [pagina, setPagina] = useState<number>(1);
  const [porPagina, setPorPagina] = useState<number>(10);
  const [drawerFiltrosAberto, setDrawerFiltrosAberto] = useState<boolean>(false);

  // Modal de visualização de documentos A4
  const [modalDocAberto, setModalDocAberto] = useState<boolean>(false);
  const [tipoDocModal, setTipoDocModal] = useState<TipoDocumentoFauna>('DR009-DOC001');
  const [asasSelecionadaDoc, setAsasSelecionadaDoc] = useState<AsasItem | undefined>(undefined);

  // Mensagem de Feedback/Toast
  const [toastMsg, setToastMsg] = useState<{ tipo: 'ok' | 'err' | 'info'; texto: string } | null>(null);

  useEffect(() => {
    setItems(getAsasList());
    const unsub = subscribeFaunaR3R4(() => {
      setItems(getAsasList());
    });
    return () => unsub();
  }, []);

  const showToast = (tipo: 'ok' | 'err' | 'info', texto: string) => {
    setToastMsg({ tipo, texto });
    setTimeout(() => setToastMsg(null), 4500);
  };

  // RN-001: Requerente externo vê apenas próprios processos
  const itensVisiveisPorPerfil = useMemo(() => {
    if (perfilAtivo === 'requerente') {
      // Simula visualização restrita ao CPF do requerente logado
      return items.filter(
        (a) =>
          a.requerente.cpfCnpj.includes('456.789') ||
          a.requerente.nomeOuRazaoSocial.includes('Geraldo') ||
          a.canalEntrada === 'Portal Externo'
      );
    }
    return items;
  }, [items, perfilAtivo]);

  // Filtros combinados
  const itensFiltrados = useMemo(() => {
    return itensVisiveisPorPerfil.filter((item) => {
      if (busca) {
        const termo = busca.toLowerCase();
        const match =
          item.numero.toLowerCase().includes(termo) ||
          item.propriedade.nome.toLowerCase().includes(termo) ||
          item.requerente.nomeOuRazaoSocial.toLowerCase().includes(termo) ||
          item.requerente.cpfCnpj.includes(termo) ||
          item.propriedade.municipio.toLowerCase().includes(termo);
        if (!match) return false;
      }
      if (filtroSituacao !== 'todas' && item.situacao !== filtroSituacao) return false;
      if (filtroCategoria !== 'todas' && item.categoria !== filtroCategoria) return false;
      if (filtroUr !== 'todas' && item.propriedade.ur !== filtroUr) return false;
      if (filtroMunicipio !== 'todos' && item.propriedade.municipio !== filtroMunicipio) return false;
      return true;
    });
  }, [itensVisiveisPorPerfil, busca, filtroSituacao, filtroCategoria, filtroUr, filtroMunicipio]);

  const totalItens = itensFiltrados.length;
  const totalPaginas = Math.ceil(totalItens / porPagina) || 1;
  const itensPaginados = useMemo(() => {
    const inicio = (pagina - 1) * porPagina;
    return itensFiltrados.slice(inicio, inicio + porPagina);
  }, [itensFiltrados, pagina, porPagina]);

  const handleExportarCsv = () => {
    const headers = ['Numero', 'Propriedade', 'Requerente', 'CPF_CNPJ', 'Categoria', 'Municipio', 'UR', 'Situacao', 'Validade_Certificado'];
    const rows = itensFiltrados.map((a) => [
      a.numero,
      `"${a.propriedade.nome}"`,
      `"${a.requerente.nomeOuRazaoSocial}"`,
      a.requerente.cpfCnpj,
      a.categoria,
      a.propriedade.municipio,
      a.propriedade.ur,
      a.situacao,
      a.dataValidadeCertificado || '-'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `INEMA_ASAS_EXPORT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('ok', 'Planilha de ASAS exportada com sucesso.');
  };

  const getSituacaoBadge = (situacao: SituacaoAsas) => {
    switch (situacao) {
      case 'Ativa':
        return <Badge variant="success" dot>Ativa</Badge>;
      case 'Certificado vencido':
        return <Badge variant="danger" dot>Certificado vencido</Badge>;
      case 'Suspensa':
        return <Badge variant="warning" dot>Suspensa</Badge>;
      case 'Aguardando termo':
        return <Badge variant="info" dot>Aguardando termo</Badge>;
      case 'Em análise':
        return <Badge variant="gray" dot>Em análise</Badge>;
      case 'Em complementação':
        return <Badge variant="warning" dot>Em complementação</Badge>;
      case 'Em cadastro':
        return <Badge variant="gray" dot>Em cadastro</Badge>;
      case 'Indeferida':
        return <Badge variant="danger" dot>Indeferida</Badge>;
      case 'Desativada':
        return <Badge variant="gray" dot>Desativada</Badge>;
      default:
        return <Badge variant="gray">{situacao}</Badge>;
    }
  };

  return (
    <div className="space-y-6 w-full pb-12" data-testid="pagina-asas-listagem">
      {/* Toast Notificação */}
      {toastMsg && (
        <div
          data-testid="toast-notificacao-asas"
          className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-medium flex items-center gap-2 backdrop-blur-xs ${
            toastMsg.tipo === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : toastMsg.tipo === 'err'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-sky-50 border-sky-200 text-sky-900'
          }`}
        >
          {toastMsg.tipo === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          )}
          <span>{toastMsg.texto}</span>
        </div>
      )}

      {/* Header Institucional da Tela */}
      <SeiaV2PageHeader
        title="Áreas de Soltura de Animais Silvestres (ASAS)"
        subtitle="Gestão de propriedades rurais cadastradas para soltura, aclimatação e readaptação de fauna silvestre"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Seletor de Perfil (Para validação de RBAC RN-001 / RN-037) */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-[#0F4C3A]" />
              <span className="text-[11px] font-medium text-slate-500">Perfil:</span>
              <select
                value={perfilAtivo}
                onChange={(e) => onTrocarPerfil(e.target.value as PerfilDemonstrativoFauna)}
                data-testid="seletor-perfil-asas"
                className="bg-transparent text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="cgfau">Coordenador CGFAU</option>
                <option value="tecnico">Técnico de Fauna (INEMA)</option>
                <option value="requerente">Requerente (Portal Externo)</option>
              </select>
            </div>

            {/* Botão Cadastrar ASAS Existente (RN-037: Exclusivo CGFAU) */}
            {perfilAtivo === 'cgfau' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAbrirRequerimento(undefined, 'existente')}
                data-testid="btn-cadastrar-asas-existente"
                className="text-xs gap-1.5 h-9 border-emerald-700 text-[#0F4C3A] hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Cadastrar ASAS Existente</span>
              </Button>
            )}

            {/* Botão Novo Requerimento */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAbrirRequerimento(undefined, 'novo')}
              data-testid="btn-novo-requerimento-asas"
              className="text-xs gap-1.5 h-9 bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Requerimento</span>
            </Button>
          </div>
        }
      />

      {/* Tabela de ASAS Canônica com Toolbar e Paginação GLA */}
      <GlaTableContainer
        heading="Áreas de Soltura Cadastradas"
        description="Relação de propriedades cadastradas, analisadas e homologadas para soltura de fauna"
        toolbar={
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar por número ASAS, nome do imóvel, proprietário ou município..."
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    setPagina(1);
                  }}
                  data-testid="input-busca-asas"
                  className="w-full h-9 pl-9 pr-4 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDrawerFiltrosAberto((prev) => !prev)}
                  data-testid="btn-abrir-drawer-filtros"
                  className={`text-xs gap-1.5 h-9 ${
                    filtroSituacao !== 'todas' || filtroCategoria !== 'todas' || filtroUr !== 'todas'
                      ? 'border-emerald-600 text-[#0F4C3A] bg-emerald-50/50'
                      : ''
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filtros Avançados</span>
                  {(filtroSituacao !== 'todas' || filtroCategoria !== 'todas' || filtroUr !== 'todas') && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportarCsv}
                  data-testid="btn-exportar-planilha-asas"
                  className="text-xs gap-1.5 h-9"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetFaunaR3R4ToSeed();
                    showToast('info', 'Cenário demonstrativo reiniciado com dados originais.');
                  }}
                  title="Reiniciar dados do cenário demonstrativo"
                  className="text-xs h-9 text-slate-500 hover:text-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Drawer / Painel Recolhível de Filtros Avançados */}
            {drawerFiltrosAberto && (
              <div
                data-testid="drawer-filtros-avancados-asas"
                className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
              >
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">Situação</label>
                  <InputWrapper suffixIcon={ChevronDown}>
                    <select
                      value={filtroSituacao}
                      onChange={(e) => {
                        setFiltroSituacao(e.target.value);
                        setPagina(1);
                      }}
                      className="w-full h-8 text-xs bg-transparent border-none appearance-none px-2 pr-6 focus:outline-none cursor-pointer"
                    >
                      <option value="todas">Todas as situações</option>
                      <option value="Ativa">Ativa</option>
                      <option value="Certificado vencido">Certificado vencido</option>
                      <option value="Suspensa">Suspensa</option>
                      <option value="Aguardando termo">Aguardando termo</option>
                      <option value="Em análise">Em análise</option>
                      <option value="Em complementação">Em complementação</option>
                      <option value="Indeferida">Indeferida</option>
                      <option value="Desativada">Desativada</option>
                    </select>
                  </InputWrapper>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">Categoria</label>
                  <InputWrapper suffixIcon={ChevronDown}>
                    <select
                      value={filtroCategoria}
                      onChange={(e) => {
                        setFiltroCategoria(e.target.value);
                        setPagina(1);
                      }}
                      className="w-full h-8 text-xs bg-transparent border-none appearance-none px-2 pr-6 focus:outline-none cursor-pointer"
                    >
                      <option value="todas">Todas as categorias</option>
                      <option value="Categoria I">Categoria I (Soltura imediata)</option>
                      <option value="Categoria II">Categoria II (Aclimatação)</option>
                      <option value="Categoria III">Categoria III (Readaptação)</option>
                    </select>
                  </InputWrapper>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">Unidade Regional (UR)</label>
                  <InputWrapper suffixIcon={ChevronDown}>
                    <select
                      value={filtroUr}
                      onChange={(e) => {
                        setFiltroUr(e.target.value);
                        setPagina(1);
                      }}
                      className="w-full h-8 text-xs bg-transparent border-none appearance-none px-2 pr-6 focus:outline-none cursor-pointer"
                    >
                      <option value="todas">Todas as URs</option>
                      <option value="URCH">URCH (Chapada Diamantina)</option>
                      <option value="URES">URES (Litoral Leste)</option>
                      <option value="UROE">UROE (Oeste)</option>
                      <option value="URPD">URPD (Paraguaçu-Delta)</option>
                      <option value="URPS">URPS (Porto Seguro)</option>
                      <option value="URRC">URRC (Rio de Contas)</option>
                      <option value="URSF">URSF (São Francisco)</option>
                      <option value="URSO">URSO (Sudoeste)</option>
                      <option value="URSU">URSU (Sul)</option>
                    </select>
                  </InputWrapper>
                </div>

                <div className="flex items-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFiltroSituacao('todas');
                      setFiltroCategoria('todas');
                      setFiltroUr('todas');
                      setBusca('');
                      setPagina(1);
                    }}
                    className="w-full h-8 text-[11px]"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
        }
        pagination={
          <GlaPagination
            startIndex={(pagina - 1) * porPagina + 1}
            currentCount={Math.min(pagina * porPagina, totalItens)}
            totalCount={totalItens}
            page={pagina}
            totalPages={totalPaginas}
            onPageChange={(p) => setPagina(p)}
            entityName="áreas de soltura"
          />
        }
      >
        <GlaTable>
          <GlaTableHead>
            <tr>
              <GlaTh>Número ASAS</GlaTh>
              <GlaTh>Propriedade / Imóvel</GlaTh>
              <GlaTh>Requerente</GlaTh>
              <GlaTh>Categoria</GlaTh>
              <GlaTh>Município / UR</GlaTh>
              <GlaTh>Situação</GlaTh>
              <GlaTh>Validade Certificado</GlaTh>
              <GlaTh align="right">Ações</GlaTh>
            </tr>
          </GlaTableHead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {itensPaginados.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <p className="text-sm font-medium">Nenhuma área de soltura encontrada.</p>
                  <p className="text-xs mt-1">Tente ajustar os termos de busca ou filtros aplicados.</p>
                </td>
              </tr>
            ) : (
              itensPaginados.map((item) => (
                <tr
                  key={item.id}
                  data-testid={`linha-asas-${item.id}`}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-3.5 font-mono font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                    {item.numero}
                    {item.processoSei && (
                      <span className="block text-[10px] font-normal text-slate-400">
                        SEI: {item.processoSei}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {item.propriedade.nome}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {item.delimitacao?.areaHa ? `${item.delimitacao.areaHa} ha` : 'Sem polígono'} ·{' '}
                      {item.propriedade.bioma}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="text-slate-800 dark:text-slate-200 block">
                      {item.requerente.nomeOuRazaoSocial}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {item.requerente.cpfCnpj}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <Badge variant="outline" className="text-[10px]">
                      {item.categoria}
                    </Badge>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="text-slate-700 dark:text-slate-300 block">
                      {item.propriedade.municipio}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.propriedade.ur}</span>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">{getSituacaoBadge(item.situacao)}</td>
                  <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {item.dataValidadeCertificado ? (
                      <span
                        className={
                          item.situacao === 'Certificado vencido' ? 'text-rose-600 font-bold' : ''
                        }
                      >
                        {item.dataValidadeCertificado}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Ação Principal: Visualizar Requerimento */}
                      <button
                        onClick={() => onAbrirRequerimento(item.id, 'ver')}
                        data-testid={`btn-ver-asas-${item.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-colors cursor-pointer"
                        title="Visualizar Detalhes do Requerimento"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0F4C3A]" />
                        <span className="hidden sm:inline">Ver Ficha</span>
                      </button>

                      {/* Ações Secundárias Administrativas */}
                      {perfilAtivo !== 'requerente' && (
                        <button
                          onClick={() => onAbrirRequerimento(item.id, 'editar')}
                          data-testid={`btn-editar-asas-${item.id}`}
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
                          title="Editar Dados Cadastrais / Justificar Alteração"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {perfilAtivo !== 'requerente' && (
                        <button
                          onClick={() => onAbrirVistoria(item.id)}
                          data-testid={`btn-vistoria-asas-${item.id}`}
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-sky-700 transition-colors cursor-pointer"
                          title="Registro de Vistoria Oficial (F-TEC-133)"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {perfilAtivo === 'cgfau' && (
                        <button
                          onClick={() => onAbrirDecisao(item.id)}
                          data-testid={`btn-decisao-asas-${item.id}`}
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-700 transition-colors cursor-pointer"
                          title="Decisão, Emissão de Certificado e Situação"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {item.dataEmissaoCertificado && (
                        <button
                          onClick={() => {
                            setAsasSelecionadaDoc(item);
                            setTipoDocModal('DR009-DOC001');
                            setModalDocAberto(true);
                          }}
                          data-testid={`btn-doc-a4-asas-${item.id}`}
                          className="p-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 transition-colors cursor-pointer"
                          title="Visualizar Certificado A4 Oficial"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </GlaTable>
      </GlaTableContainer>

      {/* Modal Visualizador A4 de Documentos */}
      {modalDocAberto && asasSelecionadaDoc && (
        <FaunaDocumentModal
          isOpen={modalDocAberto}
          onClose={() => setModalDocAberto(false)}
          tipo={tipoDocModal}
          asas={asasSelecionadaDoc}
        />
      )}
    </div>
  );
};
