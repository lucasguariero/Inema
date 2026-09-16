import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileText,
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
        return <Badge variant="emerald" dot>Concluído</Badge>;
      case 'Auto de Infração':
        return <Badge variant="rose" dot>Auto Lavrado</Badge>;
      case 'Notificado':
        return <Badge variant="amber" dot>Notificado</Badge>;
      case 'Vistoria Agendada':
        return <Badge variant="blue" dot>Vistoria Agendada</Badge>;
      case 'Em Análise':
        return <Badge variant="amber" dot>Em Análise Técnica</Badge>;
      default:
        return <Badge variant="secondary" dot>Registrado</Badge>;
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
          <span>Portal do Cidadão</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Consultas</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Consulta Cidadão</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Acompanhamento de Denúncias e Emergências
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Consulte protocolos vinculados, visualize histórico de fiscalização e faça o download de comprovantes oficiais.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.('cidadao')}
              className="gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Nova Denúncia
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.('emergencia-externa')}
              className="gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 whitespace-nowrap shrink-0"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              Comunicar Acidente
            </Button>
          </div>
        </div>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-slate-200/90 dark:border-slate-800 p-4">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Total de Registros</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {registros.length}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Na base de acompanhamento</span>
        </Card>

        <Card className="border-slate-200/90 dark:border-slate-800 p-4">
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block uppercase">Emergências (RE)</span>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">
            {registros.filter((r) => r.tipo === 'RE').length}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Acidentes químicos autuados</span>
        </Card>

        <Card className="border-slate-200/90 dark:border-slate-800 p-4">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">Denúncias (RD)</span>
          <div className="text-2xl font-black text-emerald-800 dark:text-emerald-400 mt-1">
            {registros.filter((r) => r.tipo === 'RD').length}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Em apuração ou vistoria</span>
        </Card>

        <Card className="border-slate-200/90 dark:border-slate-800 p-4">
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block uppercase">Concluídos</span>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1">
            {registros.filter((r) => r.status === 'Concluído').length}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Processos finalizados</span>
        </Card>
      </div>

      {/* Barra de Filtros */}
      <Card className="border-slate-200/90 dark:border-slate-800 p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Busca por texto */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={buscaTexto}
              onChange={(e) => setBuscaTexto(e.target.value)}
              placeholder="Buscar por protocolo (ex: 2026.000142), município ou palavra-chave..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
            />
          </div>

          {/* Filtro por Tipo */}
          <div>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as any)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none font-medium"
            >
              <option value="TODOS">Todos os Tipos (RD e RE)</option>
              <option value="RD">Apenas Denúncias (RD)</option>
              <option value="RE">Apenas Emergências (RE)</option>
            </select>
          </div>

          {/* Filtro por Município */}
          <div>
            <select
              value={filtroMunicipio}
              onChange={(e) => setFiltroMunicipio(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
            >
              <option value="TODOS">Todos os Municípios</option>
              {MUNICIPIOS_BAHIA.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

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
