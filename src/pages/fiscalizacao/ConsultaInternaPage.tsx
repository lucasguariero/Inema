import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileText,
  FilePlus2,
  Gavel,
  FileDown,
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
  StatsOverviewWidget,
  TableContainer,
  TableToolbar,
  InputWrapper,
} from '@/components/filament';
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
import { cn } from '@/lib/utils';

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
        return <Badge color="success" dot>Concluído</Badge>;
      case 'Auto de Infração':
        return <Badge color="danger" dot>Auto Lavrado</Badge>;
      case 'Notificado':
        return <Badge color="warning" dot>Notificado</Badge>;
      case 'Vistoria Agendada':
        return <Badge color="info" dot>Vistoria Agendada</Badge>;
      case 'Em Análise':
        return <Badge color="warning" dot>Em Análise</Badge>;
      default:
        return <Badge color="gray" dot>Triagem</Badge>;
    }
  };

  const getPrioridadeBadge = (prioridade: RegistroFiscalizacao['prioridade']) => {
    switch (prioridade) {
      case 'Crítica':
        return <Badge color="danger">Crítica</Badge>;
      case 'Alta':
        return <Badge color="warning">Alta</Badge>;
      case 'Média':
        return <Badge color="info">Média</Badge>;
      default:
        return <Badge color="gray">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
      {/* Topo Oficial (Breadcrumb está exclusivamente na Topbar) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Painel de Operações DIFIS
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Pauta técnica centralizada de denúncias ambientais, emergências químicas e distribuição de vistorias.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate?.('atendente')}
            className="gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <FilePlus2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            Nova Denúncia
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate?.('emergencia-interna')}
            className="gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <Gavel className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Autuar Emergência (RE)
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => alert('Exportando Pauta Operacional DIFIS para planilha Excel...')}
            className="gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
            Exportar Pauta
          </Button>
        </div>
      </div>

      {/* KPIs da Operação (Filament StatsOverviewWidget) */}
      <StatsOverviewWidget
        columns={5}
        stats={[
          {
            label: 'Pauta Ativa',
            value: registros.length,
            description: 'Casos na fila DIFIS',
            color: 'gray',
          },
          {
            label: 'Emergências Químicas',
            value: registros.filter((r) => r.tipo === 'RE').length,
            description: 'Monitoramento 24h',
            color: 'danger',
          },
          {
            label: 'Vistorias Agendadas',
            value: registros.filter((r) => r.status === 'Vistoria Agendada').length,
            description: 'Equipes em campo',
            color: 'info',
          },
          {
            label: 'Autos / Notificações',
            value: registros.filter((r) => r.status === 'Auto de Infração' || r.status === 'Notificado').length,
            description: 'Lavrados no mês',
            color: 'warning',
          },
          {
            label: 'Concluídos',
            value: registros.filter((r) => r.status === 'Concluído').length,
            description: 'Arquivados/Saneados',
            color: 'success',
          },
        ]}
      />

      {/* Tabela de Operações DIFIS (Filament Resource Table: fi-ta) */}
      <TableContainer
        toolbar={
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Busca por texto */}
              <div className="lg:col-span-2">
                <InputWrapper prefixIcon={Search}>
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por protocolo, infrator, fiscal ou município..."
                    className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </InputWrapper>
              </div>

              {/* Tipo */}
              <div>
                <InputWrapper>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value as any)}
                    className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="TODOS">Tipo: Todos</option>
                    <option value="RD">Apenas Denúncias (RD)</option>
                    <option value="RE">Apenas Emergências (RE)</option>
                  </select>
                </InputWrapper>
              </div>

              {/* Unidade Regional */}
              <div>
                <InputWrapper>
                  <select
                    value={filtroUR}
                    onChange={(e) => setFiltroUR(e.target.value)}
                    className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="TODOS">Todas as Unidades Regionais</option>
                    <option value="UR Metropolitana">UR Metropolitana</option>
                    <option value="UR Oeste">UR Oeste (Barreiras)</option>
                    <option value="UR Litoral Sul">UR Litoral Sul (Ilhéus)</option>
                    <option value="UR Chapada">UR Chapada Diamantina</option>
                    <option value="UR São Francisco">UR São Francisco (Juazeiro)</option>
                  </select>
                </InputWrapper>
              </div>

              {/* Prioridade */}
              <div>
                <InputWrapper>
                  <select
                    value={filtroPrioridade}
                    onChange={(e) => setFiltroPrioridade(e.target.value)}
                    className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="TODOS">Prioridade: Todas</option>
                    <option value="Crítica">Crítica</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Normal">Normal</option>
                  </select>
                </InputWrapper>
              </div>
            </div>
          </div>
        }
      >
        <table className="fi-ta-table w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="fi-ta-header-cell py-3.5 px-4 font-semibold whitespace-nowrap">Protocolo / Tipo</th>
              <th className="fi-ta-header-cell py-3.5 px-4 font-semibold">Objeto / Ocorrência</th>
              <th className="fi-ta-header-cell py-3.5 px-4 font-semibold whitespace-nowrap">Município / UR</th>
              <th className="fi-ta-header-cell py-3.5 px-4 font-semibold whitespace-nowrap">Prioridade</th>
              <th className="fi-ta-header-cell py-3.5 px-4 font-semibold whitespace-nowrap">Fiscal Responsável</th>
              <th className="fi-ta-header-cell py-3.5 px-4 font-semibold whitespace-nowrap">Status</th>
              <th className="fi-ta-header-cell py-3.5 px-4 text-right font-semibold whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  Nenhuma ocorrência encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((r) => (
                <tr
                  key={r.id}
                  className="fi-ta-row hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="fi-ta-cell py-3.5 px-4 align-top">
                    <div className="font-mono font-semibold text-slate-900 dark:text-white">
                      {r.protocolo}
                    </div>
                    <div className="mt-1">
                      <span className={cn(
                        "fi-badge inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ring-1 ring-inset",
                        r.tipo === 'RE'
                          ? "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60"
                          : "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                      )}>
                        {r.tipo} &bull; {r.tipoNome}
                      </span>
                    </div>
                  </td>

                  <td className="fi-ta-cell py-3.5 px-4 max-w-xs align-top">
                    <p className="text-slate-900 dark:text-slate-100 font-medium truncate" title={r.descricao}>
                      {r.descricao}
                    </p>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                      Alvo: {r.infratorOuResponsavel}
                    </span>
                  </td>

                  <td className="fi-ta-cell py-3.5 px-4 align-top whitespace-nowrap">
                    <div className="text-slate-900 dark:text-slate-100 font-medium">
                      {r.municipio}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{r.unidadeRegional}</span>
                  </td>

                  <td className="fi-ta-cell py-3.5 px-4 align-top whitespace-nowrap">{getPrioridadeBadge(r.prioridade)}</td>

                  <td className="fi-ta-cell py-3.5 px-4 align-top whitespace-nowrap">
                    {r.tecnicoResponsavel ? (
                      <span className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                        <span>{r.tecnicoResponsavel}</span>
                      </span>
                    ) : (
                      <span className="fi-badge inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20">
                        Pendente
                      </span>
                    )}
                  </td>

                  <td className="fi-ta-cell py-3.5 px-4 align-top whitespace-nowrap">{getStatusBadge(r.status)}</td>

                  <td className="fi-ta-cell py-3.5 px-4 text-right align-top whitespace-nowrap">
                    <div className="fi-ta-actions flex items-center justify-end gap-1.5">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setDesignarModalReg(r)}
                        className="font-medium cursor-pointer shadow-2xs gap-1"
                        title="Designar Técnico"
                      >
                        <User className="w-3 h-3 text-slate-500" />
                        Designar
                      </Button>
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => setDossieAberto(r)}
                        className="font-medium gap-1 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        Dossiê
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableContainer>

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
