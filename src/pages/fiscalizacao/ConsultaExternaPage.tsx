import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileText,
  FilePlus2,
  AlertOctagon,
  Flame,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  ExternalLink,
  Download,
  X,
  AlertTriangle,
  Building,
  Calendar,
  Eye
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsOverviewWidget, InputWrapper, FilamentSelect } from '@/components/filament';
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

export const ConsultaExternaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();

  const [registros] = useState<RegistroFiscalizacao[]>(REGISTROS_MOCK_INICIAIS);
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'RD' | 'RE'>('TODOS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [filtroMunicipio, setFiltroMunicipio] = useState('TODOS');

  // Detalhes / Modal
  const [registroSelecionado, setRegistroSelecionado] = useState<RegistroFiscalizacao | null>(null);

  // Filtros combinados
  const registrosFiltrados = useMemo(() => {
    return registros.filter((reg) => {
      const matchTexto =
        buscaTexto === '' ||
        reg.protocolo.toLowerCase().includes(buscaTexto.toLowerCase()) ||
        reg.municipio.toLowerCase().includes(buscaTexto.toLowerCase()) ||
        reg.descricao.toLowerCase().includes(buscaTexto.toLowerCase()) ||
        (reg.substancia && reg.substancia.toLowerCase().includes(buscaTexto.toLowerCase()));

      const matchTipo = filtroTipo === 'TODOS' || reg.tipo === filtroTipo;
      const matchStatus = filtroStatus === 'TODOS' || reg.status === filtroStatus;
      const matchMunicipio = filtroMunicipio === 'TODOS' || reg.municipio === filtroMunicipio;

      return matchTexto && matchTipo && matchStatus && matchMunicipio;
    });
  }, [registros, buscaTexto, filtroTipo, filtroStatus, filtroMunicipio]);

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
        return <Badge color="warning" dot>Em Análise Técnica</Badge>;
      default:
        return <Badge color="gray" dot>Registrado</Badge>;
    }
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Topo Oficial (Breadcrumb está exclusivamente na Topbar) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Acompanhamento de Denúncias e Emergências
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Consulte protocolos vinculados, visualize histórico de fiscalização e faça o download de comprovantes oficiais.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('cidadao')}
            className="gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <FilePlus2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            Nova Denúncia
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('emergencia-externa')}
            className="gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Comunicar Acidente
          </Button>
        </div>
      </div>

      {/* Mini KPIs (Filament StatsOverviewWidget) */}
      <StatsOverviewWidget
        columns={4}
        stats={[
          {
            label: 'Total de Registros',
            value: registros.length,
            description: 'Na base de acompanhamento',
            color: 'gray',
          },
          {
            label: 'Emergências (RE)',
            value: registros.filter((r) => r.tipo === 'RE').length,
            description: 'Acidentes químicos autuados',
            color: 'danger',
          },
          {
            label: 'Denúncias (RD)',
            value: registros.filter((r) => r.tipo === 'RD').length,
            description: 'Em apuração ou vistoria',
            color: 'success',
          },
          {
            label: 'Concluídos',
            value: registros.filter((r) => r.status === 'Concluído').length,
            description: 'Processos finalizados',
            color: 'info',
          },
        ]}
      />

      {/* Barra de Filtros (Filament Form / Filter Container) */}
      <div className="fi-section rounded-xl bg-white shadow-xs ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10 p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Busca por texto */}
          <div className="md:col-span-2">
            <InputWrapper prefixIcon={Search}>
              <input
                type="text"
                value={buscaTexto}
                onChange={(e) => setBuscaTexto(e.target.value)}
                placeholder="Buscar por protocolo (ex: 2026.000142), município ou palavra-chave..."
                className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </InputWrapper>
          </div>

          {/* Filtro por Tipo */}
          <div>
            <FilamentSelect
              value={filtroTipo}
              onChange={(val) => setFiltroTipo(val as any)}
              options={[
                { value: 'TODOS', label: 'Todos os Tipos (RD e RE)' },
                { value: 'RD', label: 'Apenas Denúncias (RD)' },
                { value: 'RE', label: 'Apenas Emergências (RE)' },
              ]}
            />
          </div>

          {/* Filtro por Município */}
          <div>
            <FilamentSelect
              value={filtroMunicipio}
              onChange={(val) => setFiltroMunicipio(val)}
              options={[
                { value: 'TODOS', label: 'Todos os Municípios' },
                ...MUNICIPIOS_BAHIA.map((m) => ({ value: m, label: m })),
              ]}
              searchable
            />
          </div>
        </div>
      </div>

      {/* Lista de Registros */}
      <div className="space-y-3">
        {registrosFiltrados.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-slate-300 dark:border-slate-800">
            <FileText className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Nenhum registro encontrado
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verifique os filtros aplicados ou o número do protocolo digitado.
            </p>
          </Card>
        ) : (
          registrosFiltrados.map((reg) => (
            <Card
              key={reg.id}
              className="border-slate-200/90 dark:border-slate-800 hover:shadow-sm transition-all overflow-hidden"
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {reg.protocolo}
                    </span>
                    <Badge variant={reg.tipo === 'RE' ? 'rose' : 'emerald'}>
                      {reg.tipoNome}
                    </Badge>
                    {getStatusBadge(reg.status)}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Registrado em: {reg.dataRegistro}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {reg.descricao}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {reg.municipio} • {reg.localidade}
                    </span>
                    {reg.substancia && (
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                        <Flame className="w-3.5 h-3.5" />
                        {reg.substancia} (ONU {reg.onu})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRegistroSelecionado(reg)}
                    className="text-xs font-semibold gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ver Detalhes e Andamento
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Detalhes & Linha do Tempo */}
      <Dialog open={!!registroSelecionado} onOpenChange={(open) => !open && setRegistroSelecionado(null)}>
        {registroSelecionado && (
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant={registroSelecionado.tipo === 'RE' ? 'rose' : 'emerald'}>
                  {registroSelecionado.tipoNome}
                </Badge>
                {getStatusBadge(registroSelecionado.status)}
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 pt-1">
                Protocolo: {registroSelecionado.protocolo}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Registrado em {registroSelecionado.dataRegistro} via {registroSelecionado.origem}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-5 text-xs">
              {/* Resumo da Ocorrência */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">
                  Descrição dos Fatos
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {registroSelecionado.descricao}
                </p>
                <div className="pt-2 grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block">Município / Local:</span>
                    <strong>{registroSelecionado.municipio} - {registroSelecionado.localidade}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Unidade Regional:</span>
                    <strong>{registroSelecionado.unidadeRegional}</strong>
                  </div>
                </div>
              </div>

              {/* Linha do Tempo (Timeline) */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Linha do Tempo e Andamento dos Fiscais
                </h4>

                <div className="relative pl-6 border-l-2 border-emerald-500/40 space-y-4">
                  {registroSelecionado.historico.map((h, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900"></div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{h.data}</span>
                        <span className="font-medium text-slate-500 dark:text-slate-400">{h.responsavel}</span>
                      </div>
                      <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5">
                        {h.titulo}
                      </h5>
                      <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 leading-relaxed">
                        {h.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex-row justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Comprovante Oficial do Protocolo ${registroSelecionado.protocolo} emitido com autenticação digital INEMA.`)}
                className="gap-1.5 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar Comprovante (PDF)
              </Button>
              <Button size="sm" onClick={() => setRegistroSelecionado(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
