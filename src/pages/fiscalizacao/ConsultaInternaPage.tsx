import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileText,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  ChevronRight,
  UserCheck,
  Download,
  Share2,
  Layers,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Eye,
  FileSpreadsheet,
  Building,
  User
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { REGISTROS_MOCK_INICIAIS, RegistroFiscalizacao, MUNICIPIOS_BAHIA } from '@/data/fiscalizacaoMock';
import { useTheme } from '@/context/ThemeContext';

const FISCAIS_DIFIS = [
  'Eng. Carlos Andrade (DIFIS/Emergências)',
  'Bióloga Fernanda Mattos (UR Barreiras)',
  'Inspetor Marcos Ribeiro (DIFIS/Industrial)',
  'Fiscal Rodrigo Santos (UR Metropolitana)',
  'Eng. Luciana Prado (UR Litoral Sul)',
  'Técnico Valter Queiroz (DIFIS/Call Center)'
];

export const ConsultaInternaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();

  const [registros, setRegistros] = useState<RegistroFiscalizacao[]>(REGISTROS_MOCK_INICIAIS);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'RD' | 'RE'>('TODOS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [filtroPrioridade, setFiltroPrioridade] = useState('TODOS');
  const [filtroUR, setFiltroUR] = useState('TODOS');

  // Modais
  const [dossieAberto, setDossieAberto] = useState<RegistroFiscalizacao | null>(null);
  const [designarModalReg, setDesignarModalReg] = useState<RegistroFiscalizacao | null>(null);
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState(FISCAIS_DIFIS[0]);

  // Filtros
  const registrosFiltrados = useMemo(() => {
    return registros.filter((r) => {
      const matchBusca =
        busca === '' ||
        r.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
        r.municipio.toLowerCase().includes(busca.toLowerCase()) ||
        r.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        r.infratorOuResponsavel.toLowerCase().includes(busca.toLowerCase()) ||
        (r.tecnicoResponsavel && r.tecnicoResponsavel.toLowerCase().includes(busca.toLowerCase()));

      const matchTipo = filtroTipo === 'TODOS' || r.tipo === filtroTipo;
      const matchStatus = filtroStatus === 'TODOS' || r.status === filtroStatus;
      const matchPrioridade = filtroPrioridade === 'TODOS' || r.prioridade === filtroPrioridade;
      const matchUR = filtroUR === 'TODOS' || r.unidadeRegional === filtroUR;

      return matchBusca && matchTipo && matchStatus && matchPrioridade && matchUR;
    });
  }, [registros, busca, filtroTipo, filtroStatus, filtroPrioridade, filtroUR]);

  const handleSalvarDesignacao = () => {
    if (!designarModalReg) return;
    setRegistros((prev) =>
      prev.map((reg) =>
        reg.id === designarModalReg.id
          ? {
              ...reg,
              tecnicoResponsavel: tecnicoSelecionado,
              status: reg.status === 'Registrado' || reg.status === 'Em Triagem' ? 'Em Análise' : reg.status,
              historico: [
                ...reg.historico,
                {
                  data: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR').slice(0, 5),
                  titulo: 'Técnico Designado',
                  descricao: `Processo distribuído para condução técnica de ${tecnicoSelecionado}.`,
                  responsavel: 'Coordenação DIFIS'
                }
              ]
            }
          : reg
      )
    );
    setDesignarModalReg(null);
  };

  const getStatusBadge = (status: RegistroFiscalizacao['status']) => {
    switch (status) {
      case 'Concluído':
        return <Badge variant="emerald" dot>Concluído</Badge>;
      case 'Auto de Infração':
        return <Badge variant="rose" dot>Auto Lavrado</Badge>;
      case 'Notificado':
        return <Badge variant="amber" dot>Notificado</Badge>;
      case 'Vistoria Agendada':
        return <Badge variant="blue" dot>Vistoria Agendada</Badge>;
      case 'Em Análise':
        return <Badge variant="amber" dot>Em Análise</Badge>;
      default:
        return <Badge variant="secondary" dot>Triagem</Badge>;
    }
  };

  const getPrioridadeBadge = (prioridade: RegistroFiscalizacao['prioridade']) => {
    switch (prioridade) {
      case 'Crítica':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse">Crítica</span>;
      case 'Alta':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Alta</span>;
      case 'Média':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Média</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Normal</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Topo & Breadcrumb */}
      <div className="flex flex-col gap-2">
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="hover:text-emerald-700 cursor-pointer" onClick={() => onNavigate?.('relatorios')}>
            Início
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Fiscalização</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Consultas</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Painel Interno DIFIS</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-2xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex flex-wrap items-center gap-2">
                Painel de Operações DIFIS
                <Badge variant="emerald">Ambiente Técnico</Badge>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Pauta técnica centralizada de denúncias ambientais, emergências químicas e distribuição de vistorias.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate?.('atendente')}
              className="gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Nova Denúncia
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate?.('emergencia-interna')}
              className="gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900 whitespace-nowrap shrink-0"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              Autuar Emergência (RE)
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => alert('Exportando Pauta Operacional DIFIS para planilha Excel...')}
              className="gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
              Exportar Pauta
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs da Operação */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="border-slate-200/90 dark:border-slate-800 p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pauta Ativa</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {registros.length}
          </div>
          <span className="text-[10px] text-slate-500">Casos na fila DIFIS</span>
        </Card>

        <Card className="border-slate-200/90 dark:border-slate-800 p-4 bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/60">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">Emergências Químicas</span>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">
            {registros.filter((r) => r.tipo === 'RE').length}
          </div>
          <span className="text-[10px] text-rose-600/80">Monitoramento 24h</span>
        </Card>

        <Card className="border-slate-200/90 dark:border-slate-800 p-4">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Vistorias Agendadas</span>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1">
            {registros.filter((r) => r.status === 'Vistoria Agendada').length}
          </div>
          <span className="text-[10px] text-slate-500">Equipes em campo</span>
        </Card>

        <Card className="border-slate-200/90 dark:border-slate-800 p-4">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Autos / Notificações</span>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
            {registros.filter((r) => r.status === 'Auto de Infração' || r.status === 'Notificado').length}
          </div>
          <span className="text-[10px] text-slate-500">Lavrados no mês</span>
        </Card>

        <Card className="border-slate-200/90 dark:border-slate-800 p-4">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Concluídos</span>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
            {registros.filter((r) => r.status === 'Concluído').length}
          </div>
          <span className="text-[10px] text-slate-500">Arquivados/Saneados</span>
        </Card>
      </div>

      {/* Barra de Filtros Avançados */}
      <Card className="border-slate-200/90 dark:border-slate-800 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Busca por texto */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por protocolo, infrator, fiscal ou município..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
            />
          </div>

          {/* Tipo */}
          <div>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as any)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none font-medium"
            >
              <option value="TODOS">Tipo: Todos</option>
              <option value="RD">Apenas Denúncias (RD)</option>
              <option value="RE">Apenas Emergências (RE)</option>
            </select>
          </div>

          {/* Unidade Regional */}
          <div>
            <select
              value={filtroUR}
              onChange={(e) => setFiltroUR(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
            >
              <option value="TODOS">Todas as Unidades Regionais</option>
              <option value="UR Metropolitana">UR Metropolitana</option>
              <option value="UR Oeste">UR Oeste (Barreiras)</option>
              <option value="UR Litoral Sul">UR Litoral Sul (Ilhéus)</option>
              <option value="UR Chapada">UR Chapada Diamantina</option>
              <option value="UR São Francisco">UR São Francisco (Juazeiro)</option>
            </select>
          </div>

          {/* Prioridade */}
          <div>
            <select
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
            >
              <option value="TODOS">Prioridade: Todas</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabela de Operações DIFIS */}
      <Card className="border-slate-200/90 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Protocolo / Tipo</th>
                <th className="py-3 px-4">Objeto / Ocorrência</th>
                <th className="py-3 px-4">Município / UR</th>
                <th className="py-3 px-4">Prioridade</th>
                <th className="py-3 px-4">Fiscal Responsável</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhuma ocorrência encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                registrosFiltrados.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {r.protocolo}
                      </div>
                      <div className="mt-0.5">
                        <Badge variant={r.tipo === 'RE' ? 'rose' : 'emerald'}>
                          {r.tipo} • {r.tipoNome}
                        </Badge>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-800 dark:text-slate-200 font-medium truncate" title={r.descricao}>
                        {r.descricao}
                      </p>
                      <span className="text-[11px] text-slate-400 block truncate">
                        Alvo: {r.infratorOuResponsavel}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {r.municipio}
                      </div>
                      <span className="text-[11px] text-slate-400">{r.unidadeRegional}</span>
                    </td>

                    <td className="py-3 px-4">{getPrioridadeBadge(r.prioridade)}</td>

                    <td className="py-3 px-4">
                      {r.tecnicoResponsavel ? (
                        <span className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {r.tecnicoResponsavel}
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                          Pendente de Designação
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">{getStatusBadge(r.status)}</td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDesignarModalReg(r)}
                          className="h-8 px-2 text-[11px] font-semibold"
                          title="Designar Técnico"
                        >
                          <User className="w-3 h-3" />
                          Designar
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setDossieAberto(r)}
                          className="h-8 px-2 text-[11px] font-semibold gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Dossiê
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Designar Fiscal Técnico */}
      <Dialog open={!!designarModalReg} onOpenChange={(open) => !open && setDesignarModalReg(null)}>
        {designarModalReg && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Designar Técnico Responsável
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 pt-1">
                Atribua o processo <strong>{designarModalReg.protocolo}</strong> para um fiscal da DIFIS.
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Selecione o Fiscal / Analista de Pauta
                </label>
                <select
                  value={tecnicoSelecionado}
                  onChange={(e) => setTecnicoSelecionado(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-100 outline-none font-medium"
                >
                  {FISCAIS_DIFIS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Município:</strong> {designarModalReg.municipio}</p>
                <p><strong>Objeto:</strong> {designarModalReg.descricao}</p>
                <p><strong>Unidade Regional:</strong> {designarModalReg.unidadeRegional}</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setDesignarModalReg(null)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSalvarDesignacao}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Confirmar Designação
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Modal: Dossiê Completo */}
      <Dialog open={!!dossieAberto} onOpenChange={(open) => !open && setDossieAberto(null)}>
        {dossieAberto && (
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant={dossieAberto.tipo === 'RE' ? 'rose' : 'emerald'}>
                  {dossieAberto.tipoNome}
                </Badge>
                {getStatusBadge(dossieAberto.status)}
                {getPrioridadeBadge(dossieAberto.prioridade)}
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 pt-1">
                Dossiê Técnico: {dossieAberto.protocolo}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Autuado em {dossieAberto.dataRegistro} • Origem: {dossieAberto.origem}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">
                  Dados do Processo e Localização
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 block">Responsável / Infrator:</span>
                    <strong>{dossieAberto.infratorOuResponsavel}</strong>
                    {dossieAberto.cpfCnpj && <span className="text-[11px] block text-slate-500">CNPJ: {dossieAberto.cpfCnpj}</span>}
                  </div>
                  <div>
                    <span className="text-slate-400 block">Técnico Encarregado:</span>
                    <strong>{dossieAberto.tecnicoResponsavel || 'Não atribuído'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Município / Local:</span>
                    <strong>{dossieAberto.municipio} • {dossieAberto.localidade}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Unidade Regional:</span>
                    <strong>{dossieAberto.unidadeRegional}</strong>
                  </div>
                </div>
              </div>

              {dossieAberto.substancia && (
                <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                  <h4 className="font-bold text-rose-800 dark:text-rose-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    Produto Perigoso Envolvido
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-slate-800 dark:text-slate-200">
                    <div>
                      <span className="text-slate-400 block">Substância:</span>
                      <strong>{dossieAberto.substancia}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Nº ONU:</span>
                      <strong className="font-mono">{dossieAberto.onu}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Volume Estimado:</span>
                      <strong className="text-rose-600">{dossieAberto.volumeAproximado}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Histórico / Tramitação */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">
                  Histórico de Tramitação e Despachos
                </h4>
                <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                  {dossieAberto.historico.map((h, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{h.data}</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{h.responsavel}</span>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{h.titulo}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{h.descricao}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex-row justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Imprimindo Dossiê Completo do processo ${dossieAberto.protocolo}...`)}
                className="gap-1.5 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar Dossiê (PDF)
              </Button>
              <Button size="sm" onClick={() => setDossieAberto(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
