import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  X,
  Bell,
  Info,
  FileText,
  UserCheck,
  AlertCircle,
  Eye
} from 'lucide-react';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableContainer } from '@/components/filament';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export interface NotificacaoItem {
  id: string;
  titulo: string;
  categoria?: 'Processo' | 'Usuário';
  recebidaEm: string;
  isRead: boolean;
  hasAbrir?: boolean;
  detalhes?: {
    processo?: string;
    requerente?: string;
    descricao: string;
    tipo: string;
    linkAcao?: string;
    linkTexto?: string;
  };
}

interface NotificacoesPageProps {
  onNavigate?: (route: string) => void;
}

export const NotificacoesPage: React.FC<NotificacoesPageProps> = ({ onNavigate }) => {
  const [notificacoes, setNotificacoes] = useState<NotificacaoItem[]>([
    {
      id: 'notif-1',
      titulo: 'Relatório pronto',
      recebidaEm: '18/09/2026 14:57',
      isRead: false,
      hasAbrir: false,
      detalhes: {
        tipo: 'Relatório do Sistema',
        descricao: 'A consolidação mensal de processos em tramitação foi concluída e está disponível para download no painel gerencial.',
        linkTexto: 'Baixar Relatório',
      },
    },
    {
      id: 'notif-2',
      titulo: 'Relatório pronto',
      recebidaEm: '18/09/2026 14:56',
      isRead: false,
      hasAbrir: false,
      detalhes: {
        tipo: 'Relatório do Sistema',
        descricao: 'Exportação da base de dados de outorgas hídricas gerada com sucesso.',
      },
    },
    {
      id: 'notif-3',
      titulo: 'Relatório pronto',
      recebidaEm: '18/09/2026 14:55',
      isRead: false,
      hasAbrir: false,
      detalhes: {
        tipo: 'Relatório do Sistema',
        descricao: 'Relatório analítico de compensação florestal concluído sem inconformidades.',
      },
    },
    {
      id: 'notif-4',
      titulo: 'Requerimento 2026.029.000029/INEMA/TS0002 recebido',
      categoria: 'Processo',
      recebidaEm: '18/09/2026 07:36',
      isRead: false,
      hasAbrir: false,
      detalhes: {
        processo: '020.12948.2026/0014',
        requerente: 'Agropecuária Vale Verde S.A.',
        tipo: 'Licenciamento Ordinário',
        descricao: 'Requerimento registrado no protocolo SEIA e distribuído para conferência documental pela Coordenação de Atendimento.',
        linkTexto: 'Ver Processo',
        linkAcao: 'tabela',
      },
    },
    {
      id: 'notif-5',
      titulo: 'Requerimento 2026.027.000027/INEMA/TS0002 recebido',
      categoria: 'Processo',
      recebidaEm: '17/09/2026 22:45',
      isRead: false,
      hasAbrir: false,
      detalhes: {
        processo: '020.11409.2026/0009',
        requerente: 'Complexo Eólico Ventos da Bahia',
        tipo: 'Autorização de Supressão Vegetal (ASV)',
        descricao: 'Requerimento de ASV recebido pelo sistema. Aguardando validação de taxa DAE.',
        linkTexto: 'Ver Processo',
        linkAcao: 'tabela',
      },
    },
    {
      id: 'notif-6',
      titulo: 'Requerimento 2026.026.000026/INEMA/TS0002 recebido',
      categoria: 'Processo',
      recebidaEm: '17/09/2026 22:29',
      isRead: false,
      hasAbrir: false,
      detalhes: {
        processo: '020.08920.2026/0032',
        requerente: 'Mineração Diamantina Ltda.',
        tipo: 'Renovação de LO',
        descricao: 'Protocolo de renovação tempestivo registrado dentro do prazo legal de 120 dias.',
        linkTexto: 'Ver Processo',
        linkAcao: 'tabela',
      },
    },
    {
      id: 'notif-7',
      titulo: 'Alteração no seu perfil SISPASS homologado',
      categoria: 'Usuário',
      recebidaEm: '17/09/2026 06:05',
      isRead: false,
      hasAbrir: true,
      detalhes: {
        tipo: 'Gestão de Criadores Amadoristas',
        descricao: 'A solicitação de transferência de anilhas e alteração de plantel foi deferida pelo setor técnico de fauna.',
        linkTexto: 'Acessar SISPASS',
        linkAcao: 'sispass',
      },
    },
    {
      id: 'notif-8',
      titulo: 'Alteração no seu perfil SISPASS homologado',
      categoria: 'Usuário',
      recebidaEm: '17/09/2026 06:05',
      isRead: false,
      hasAbrir: true,
      detalhes: {
        tipo: 'Cadastro de Passeriformes',
        descricao: 'Atualização cadastral de criador amador homologada com emissão de nova licença anual.',
        linkTexto: 'Acessar SISPASS',
        linkAcao: 'sispass',
      },
    },
    {
      id: 'notif-9',
      titulo: 'Enquadramento concluído',
      categoria: 'Processo',
      recebidaEm: '15/09/2026 17:08',
      isRead: false,
      hasAbrir: false,
      detalhes: {
        processo: '020.13840.2026/0041',
        requerente: 'Consórcio Rodoviário do Oeste',
        tipo: 'Enquadramento Ambiental',
        descricao: 'O processo foi enquadrado na Classe 4 com necessidade de EIA/RIMA e audiência pública regional.',
        linkTexto: 'Ver Enquadramento',
        linkAcao: 'enquadramento',
      },
    },
    {
      id: 'notif-10',
      titulo: 'Boleto do requerimento 2026.021.000021/INEMA/TS0002',
      categoria: 'Processo',
      recebidaEm: '15/09/2026 17:08',
      isRead: false,
      hasAbrir: false,
      detalhes: {
        processo: '020.05112.2026/0088',
        requerente: 'Indústria Química Camaçari S.A.',
        tipo: 'DAE / Taxa Ambiental',
        descricao: 'Boleto bancário DAE nº 89123-2026 emitido para quitação dos custos de vistoria técnica.',
        linkTexto: 'Ver DAEs',
        linkAcao: 'seia-daes',
      },
    },
    {
      id: 'notif-11',
      titulo: 'Requerimento 2026.021.000021/INEMA/TS0002 recebido',
      categoria: 'Processo',
      recebidaEm: '15/09/2026 17:04',
      isRead: false,
      hasAbrir: false,
      detalhes: {
        processo: '020.05112.2026/0088',
        requerente: 'Indústria Química Camaçari S.A.',
        tipo: 'Licença de Alteração',
        descricao: 'Requerimento submetido pelo procurador cadastrado.',
      },
    },
    {
      id: 'notif-12',
      titulo: 'Você foi indicado como procurador',
      categoria: 'Usuário',
      recebidaEm: '15/09/2026 15:59',
      isRead: false,
      hasAbrir: false,
      detalhes: {
        tipo: 'Procuração Eletrônica',
        descricao: 'A empresa Agropecuária Vale Verde S.A. outorgou procuração eletrônica para representação em processos ambientais perante o INEMA.',
        linkTexto: 'Ver Procurações',
        linkAcao: 'cad-procurador',
      },
    },
    {
      id: 'notif-13',
      titulo: 'Parecer técnico emitido para o processo 020.12948.2026/0014',
      categoria: 'Processo',
      recebidaEm: '12/09/2026 11:20',
      isRead: false,
      hasAbrir: true,
      detalhes: {
        processo: '020.12948.2026/0014',
        requerente: 'Agropecuária Vale Verde S.A.',
        tipo: 'Análise Técnica Conclusiva',
        descricao: 'Parecer técnico favorável emitido pelo analista ambiental responsável. Encaminhado para minuta de portaria.',
        linkTexto: 'Visualizar Parecer',
        linkAcao: 'tabela',
      },
    },
    {
      id: 'notif-14',
      titulo: 'Relatório pronto',
      recebidaEm: '10/09/2026 19:36',
      isRead: true,
      hasAbrir: false,
      detalhes: {
        tipo: 'Relatório do Sistema',
        descricao: 'Histórico de monitoramento de efluentes gerado em formato PDF assinado.',
      },
    },
    {
      id: 'notif-15',
      titulo: 'Você foi convidado como responsável técnico',
      categoria: 'Usuário',
      recebidaEm: '09/09/2026 15:49',
      isRead: true,
      hasAbrir: true,
      detalhes: {
        tipo: 'Responsabilidade Técnica (ART)',
        descricao: 'O empreendimento Solar Fotovoltaica Juazeiro I vinculou sua ART ao processo de Licença Prévia.',
        linkTexto: 'Ver Meus Vínculos',
        linkAcao: 'responsaveis-tecnicos',
      },
    },
    {
      id: 'notif-16',
      titulo: 'Auto de Infração nº 2026-0819 lavrado',
      categoria: 'Processo',
      recebidaEm: '05/09/2026 16:40',
      isRead: true,
      hasAbrir: true,
      detalhes: {
        processo: '020.03810.2026/0002',
        requerente: 'Fazenda Santa Tereza',
        tipo: 'Fiscalização Ambiental',
        descricao: 'Auto de Infração e Termo de Embargo homologados pela coordenação de fiscalização regional.',
        linkTexto: 'Ver Fiscalização',
        linkAcao: 'consulta-interna',
      },
    },
    {
      id: 'notif-17',
      titulo: 'Certidão de Débito Ambiental emitida nº CDA-2026/0149',
      categoria: 'Processo',
      recebidaEm: '01/09/2026 10:15',
      isRead: true,
      hasAbrir: true,
      detalhes: {
        processo: 'CDA-2026/0149',
        requerente: 'Cooperativa Agrícola de Irecê',
        tipo: 'Certidão Negativa de Débito',
        descricao: 'Certidão Negativa emitida com validade de 90 dias a contar da expedição.',
        linkTexto: 'Abrir Certidão',
        linkAcao: 'certidao-debito',
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState<'todos' | 'Processo' | 'Usuário'>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'lidas' | 'nao-lidas'>('todos');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<NotificacaoItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contagem de filtros ativos
  const activeFilterCount = (categoriaFilter !== 'todos' ? 1 : 0) + (statusFilter !== 'todos' ? 1 : 0);

  // Marcar como lida individualmente
  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotificacoes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    showToast('Notificação marcada como lida.');
  };

  // Marcar todas como lidas
  const handleMarkAllAsRead = () => {
    setNotificacoes((prev) => prev.map((item) => ({ ...item, isRead: true })));
    showToast('Todas as notificações foram marcadas como lidas.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filtragem
  const filteredNotificacoes = useMemo(() => {
    return notificacoes.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.categoria && item.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.detalhes?.processo && item.detalhes.processo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategoria =
        categoriaFilter === 'todos' || item.categoria === categoriaFilter;

      const matchStatus =
        statusFilter === 'todos' ||
        (statusFilter === 'lidas' && item.isRead) ||
        (statusFilter === 'nao-lidas' && !item.isRead);

      return matchSearch && matchCategoria && matchStatus;
    });
  }, [notificacoes, searchTerm, categoriaFilter, statusFilter]);

  // Paginação
  const totalFiltered = filteredNotificacoes.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalFiltered);
  const paginatedItems = filteredNotificacoes.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#0F4C3A] text-white px-4 py-3 rounded-lg shadow-lg text-sm animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Notificações', route: 'notificacoes' },
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Notificações
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {notificacoes.some((n) => !n.isRead) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-9 font-medium text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-[#0F4C3A] dark:text-emerald-400" />
              <span>Marcar todas como lidas</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabela de Notificações Canônica do GLA */}
      <TableContainer noScroll>
        {/* Barra superior com Título e Ferramentas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-100 dark:border-slate-800 relative bg-white dark:bg-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Painel de Notificações
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {filteredNotificacoes.length} registros
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comunicações formais, atos de trâmite e avisos do sistema
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Campo Pesquisar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 pl-9 pr-7 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A] w-52 sm:w-64 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          {/* Botão de Filtro com Contador (Padrão GLA) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`h-9 px-3 rounded-lg border flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeFilterCount > 0 || showFilterDropdown
                  ? 'border-[#0F4C3A] bg-[#0F4C3A]/5 text-[#0F4C3A] dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'
              }`}
              title="Filtros"
            >
              <Filter className="w-3.5 h-3.5" />
              <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                activeFilterCount > 0
                  ? 'bg-[#0F4C3A] text-white dark:bg-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {activeFilterCount}
              </span>
            </button>

            {/* Menu Dropdown de Filtros */}
            {showFilterDropdown && (
              <div className="absolute right-0 top-11 z-30 w-72 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Filtrar Notificações</span>
                  <button
                    onClick={() => setShowFilterDropdown(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Categoria
                  </label>
                  <select
                    value={categoriaFilter}
                    onChange={(e) => {
                      setCategoriaFilter(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                  >
                    <option value="todos">Todas as categorias</option>
                    <option value="Processo">Processo</option>
                    <option value="Usuário">Usuário</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                  >
                    <option value="todos">Todos os status</option>
                    <option value="nao-lidas">Não lidas</option>
                    <option value="lidas">Lidas</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoriaFilter('todos');
                      setStatusFilter('todos');
                      setCurrentPage(1);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                  <Button
                    size="xs"
                    variant="primary"
                    onClick={() => setShowFilterDropdown(false)}
                    className="bg-[#0F4C3A] text-white hover:bg-[#0c3d2e]"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabela de Dados */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20">
                <th className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 w-[46%]">
                  Título
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 w-[14%]">
                  Categoria
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 w-[16%]">
                  Recebida em
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 w-[10%]">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 text-right w-[16%]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    Nenhuma notificação encontrada com os critérios informados.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Título */}
                    <td className="py-3.5 px-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-normal">
                      <span
                        className="cursor-pointer hover:text-[#0F4C3A] dark:hover:text-emerald-400 transition-colors"
                        onClick={() => setSelectedNotification(item)}
                      >
                        {item.titulo}
                      </span>
                    </td>

                    {/* Categoria */}
                    <td className="py-3.5 px-4 text-xs">
                      {item.categoria ? (
                        <Badge color="gray" size="xs">
                          {item.categoria}
                        </Badge>
                      ) : null}
                    </td>

                    {/* Recebida em */}
                    <td className="py-3.5 px-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal whitespace-nowrap">
                      {item.recebidaEm}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-xs">
                      {item.isRead ? (
                        <Badge color="gray" size="xs">
                          Lida
                        </Badge>
                      ) : (
                        <Badge color="warning" size="xs" dot>
                          Não lida
                        </Badge>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        {item.hasAbrir && (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => setSelectedNotification(item)}
                            className="h-7 text-xs font-medium text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:text-[#0F4C3A] dark:hover:text-emerald-400"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            <span>Abrir</span>
                          </Button>
                        )}

                        {!item.isRead ? (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={(e) => handleMarkAsRead(item.id, e)}
                            className="h-7 text-xs font-medium text-[#0F4C3A] hover:bg-[#0F4C3A]/10 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            <span>Marcar lida</span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setSelectedNotification(item)}
                            className="h-7 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            <span>Visualizar</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação Canônica do GLA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
          <div>
            Exibindo{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">
              {totalFiltered > 0 ? startIndex + 1 : 0} a {endIndex}
            </strong>{' '}
            de{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">
              {totalFiltered}
            </strong>{' '}
            resultados
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>por página</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A] cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </TableContainer>

      {/* Modal / Dialog de Detalhes da Notificação */}
      <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="pr-8">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {selectedNotification?.categoria && (
                <Badge color="gray" size="xs">
                  {selectedNotification.categoria}
                </Badge>
              )}
              {selectedNotification?.isRead ? (
                <Badge color="gray" size="xs">
                  Lida
                </Badge>
              ) : (
                <Badge color="warning" size="xs" dot>
                  Nova Notificação
                </Badge>
              )}
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                • {selectedNotification?.recebidaEm}
              </span>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {selectedNotification?.titulo}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Notificação oficial gerada pela plataforma SEIA / GLA.
            </DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-3.5 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {selectedNotification.detalhes?.tipo && (
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {selectedNotification.detalhes.tipo}
                  </div>
                  {selectedNotification.detalhes.processo && (
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                      Processo SEI: <strong>{selectedNotification.detalhes.processo}</strong>
                    </div>
                  )}
                  {selectedNotification.detalhes.requerente && (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Requerente: {selectedNotification.detalhes.requerente}
                    </div>
                  )}
                </div>
              )}

              <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                {selectedNotification.detalhes?.descricao || 'Sem descrição adicional para este aviso.'}
              </p>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {selectedNotification && !selectedNotification.isRead && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleMarkAsRead(selectedNotification.id);
                    setSelectedNotification((prev) => (prev ? { ...prev, isRead: true } : null));
                  }}
                  className="w-full sm:w-auto text-xs h-8 text-[#0F4C3A] border-[#0F4C3A]/30 hover:bg-[#0F4C3A]/5"
                >
                  <Check className="w-3.5 h-3.5 mr-1 text-[#0F4C3A]" />
                  Marcar como lida
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {selectedNotification?.detalhes?.linkAcao && onNavigate && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    const target = selectedNotification.detalhes?.linkAcao;
                    setSelectedNotification(null);
                    if (target) onNavigate(target);
                  }}
                  className="w-full sm:w-auto text-xs h-8 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  {selectedNotification.detalhes?.linkTexto || 'Acessar'}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedNotification(null)}
                className="w-full sm:w-auto text-xs h-8"
              >
                Fechar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
