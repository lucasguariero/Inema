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
  User,
  History,
  Paperclip,
  UploadCloud,
  X,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  StatsOverviewWidget,
  TableContainer,
  TableToolbar,
  InputWrapper,
  FilamentSelect,
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

const EIXOS_TEMATICOS = [
  'Todos os Eixos',
  'Proteção de Recursos Hídricos e Bacias',
  'Combate ao Desmatamento e Queimadas',
  'Segurança Química e Transporte Perigoso',
  'Fauna Silvestre e Áreas Protegidas (UC/APP)',
  'Poluição Industrial e Mineração'
];

const TIPOS_EMERGENCIA = [
  'Todos os Tipos de Emergência',
  'Tombamento de Carga Perigosa em Rodovia',
  'Vazamento em Instalação Industrial / Polo',
  'Explosão / Incêndio com Produtos Químicos',
  'Derrame em Rio, Lagoa, Estuário ou Mar',
  'Ruptura ou Furo em Duto / Oleoduto',
  'Outros'
];

export const ConsultaInternaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();

  const [registros, setRegistros] = useState<RegistroFiscalizacao[]>(REGISTROS_MOCK_INICIAIS);

  // Filtros Oficiais (DOR005 - RN003, TL001)
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [filtroNumeroRegistro, setFiltroNumeroRegistro] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('TODOS');
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'RD' | 'RE'>('TODOS');
  const [filtroTipoEmergencia, setFiltroTipoEmergencia] = useState('Todos os Tipos de Emergência');
  const [filtroDataInicial, setFiltroDataInicial] = useState('');
  const [filtroDataFinal, setFiltroDataFinal] = useState('');
  const [filtroPalavraChave, setFiltroPalavraChave] = useState('');
  const [filtroEixoTematico, setFiltroEixoTematico] = useState('Todos os Eixos');
  const [filtroTecnico, setFiltroTecnico] = useState('TODOS');
  const [filtroComunicante, setFiltroComunicante] = useState('');
  const [filtroUnidade, setFiltroUnidade] = useState('TODOS');

  // Filtros aplicados em execução (acionados pelo botão Consultar - BOT001)
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'TODOS',
    numero: '',
    municipio: 'TODOS',
    tipo: 'TODOS',
    tipoEmergencia: 'Todos os Tipos de Emergência',
    dataInicial: '',
    dataFinal: '',
    palavraChave: '',
    eixo: 'Todos os Eixos',
    tecnico: 'TODOS',
    comunicante: '',
    unidade: 'TODOS',
  });

  // Mensagens de Alerta (DOR005 - MSG001, MSG002, MSG008)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // Modais
  const [dossieAberto, setDossieAberto] = useState<RegistroFiscalizacao | null>(null);
  const [historicoModalReg, setHistoricoModalReg] = useState<RegistroFiscalizacao | null>(null);
  const [designarModalReg, setDesignarModalReg] = useState<RegistroFiscalizacao | null>(null);
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState(FISCAIS_DIFIS[0]);

  // Modal Anexar Relatório (DOR005 - BOT005, BOT006, BOT007, RN014, RN016)
  const [anexarModalReg, setAnexarModalReg] = useState<RegistroFiscalizacao | null>(null);
  const [tipoRelatorioAnexo, setTipoRelatorioAnexo] = useState<'Preliminar' | 'Conclusivo' | 'Complementar'>('Preliminar');
  const [arquivoRelatorio, setArquivoRelatorio] = useState<File | null>(null);

  // RN011 / LEG012: Indicador de Emergências no status "Emergência Registrada"
  const qtdEmergenciasRegistradas = useMemo(() => {
    return registros.filter(
      (r) => r.tipo === 'RE' && (r.status === 'Registrado' || r.status === 'Em Triagem')
    ).length;
  }, [registros]);

  // Executar Consulta (BOT001, RN005, RN006)
  const handleConsultar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMensagemErro(null);

    // Validação de período (RN005, MSG001, MSG002)
    const hoje = new Date().toISOString().slice(0, 10);
    if (filtroDataInicial && filtroDataFinal && filtroDataInicial > filtroDataFinal) {
      setMensagemErro('A data inicial não pode ser posterior à data final (MSG001).');
      return;
    }
    if ((filtroDataInicial && filtroDataInicial > hoje) || (filtroDataFinal && filtroDataFinal > hoje)) {
      setMensagemErro('O período do registro não pode conter data futura (MSG002).');
      return;
    }

    setAppliedFilters({
      status: filtroStatus,
      numero: filtroNumeroRegistro,
      municipio: filtroMunicipio,
      tipo: filtroTipo,
      tipoEmergencia: filtroTipoEmergencia,
      dataInicial: filtroDataInicial,
      dataFinal: filtroDataFinal,
      palavraChave: filtroPalavraChave,
      eixo: filtroEixoTematico,
      tecnico: filtroTecnico,
      comunicante: filtroComunicante,
      unidade: filtroUnidade,
    });
  };

  // Limpar Filtros (BOT002, RN018)
  const handleLimparFiltros = () => {
    setFiltroStatus('TODOS');
    setFiltroNumeroRegistro('');
    setFiltroMunicipio('TODOS');
    setFiltroTipo('TODOS');
    setFiltroTipoEmergencia('Todos os Tipos de Emergência');
    setFiltroDataInicial('');
    setFiltroDataFinal('');
    setFiltroPalavraChave('');
    setFiltroEixoTematico('Todos os Eixos');
    setFiltroTecnico('TODOS');
    setFiltroComunicante('');
    setFiltroUnidade('TODOS');
    setMensagemErro(null);

    setAppliedFilters({
      status: 'TODOS',
      numero: '',
      municipio: 'TODOS',
      tipo: 'TODOS',
      tipoEmergencia: 'Todos os Tipos de Emergência',
      dataInicial: '',
      dataFinal: '',
      palavraChave: '',
      eixo: 'Todos os Eixos',
      tecnico: 'TODOS',
      comunicante: '',
      unidade: 'TODOS',
    });
  };

  // Filtragem e Ordenação padrão (RN007: primeiro RE em Emergência Registrada)
  const registrosFiltrados = useMemo(() => {
    return registros
      .filter((r) => {
        if (appliedFilters.status !== 'TODOS' && r.status !== appliedFilters.status) return false;
        if (
          appliedFilters.numero &&
          !r.protocolo.toLowerCase().includes(appliedFilters.numero.toLowerCase())
        )
          return false;
        if (appliedFilters.municipio !== 'TODOS' && r.municipio !== appliedFilters.municipio)
          return false;
        if (appliedFilters.tipo !== 'TODOS' && r.tipo !== appliedFilters.tipo) return false;
        if (
          appliedFilters.tipo === 'RE' &&
          appliedFilters.tipoEmergencia !== 'Todos os Tipos de Emergência' &&
          r.tipoNome !== appliedFilters.tipoEmergencia
        )
          return false;
        if (
          appliedFilters.palavraChave &&
          !r.descricao.toLowerCase().includes(appliedFilters.palavraChave.toLowerCase()) &&
          !r.infratorOuResponsavel.toLowerCase().includes(appliedFilters.palavraChave.toLowerCase())
        )
          return false;
        if (appliedFilters.tecnico !== 'TODOS' && r.tecnicoResponsavel !== appliedFilters.tecnico)
          return false;
        if (
          appliedFilters.comunicante &&
          !r.infratorOuResponsavel.toLowerCase().includes(appliedFilters.comunicante.toLowerCase())
        )
          return false;
        if (appliedFilters.unidade !== 'TODOS' && r.unidadeRegional !== appliedFilters.unidade)
          return false;
        return true;
      })
      .sort((a, b) => {
        // RN007: priorizar emergências ainda em status inicial
        const aIsCrit = a.tipo === 'RE' && (a.status === 'Registrado' || a.status === 'Em Triagem');
        const bIsCrit = b.tipo === 'RE' && (b.status === 'Registrado' || b.status === 'Em Triagem');
        if (aIsCrit && !bIsCrit) return -1;
        if (!aIsCrit && bIsCrit) return 1;
        return b.id.localeCompare(a.id);
      });
  }, [registros, appliedFilters]);

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

  const handleAnexarRelatorio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anexarModalReg || !arquivoRelatorio) return;

    // Atualiza histórico do registro (RN016, RN017, MSG008)
    const agora = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR').slice(0, 5);
    setRegistros((prev) =>
      prev.map((reg) =>
        reg.id === anexarModalReg.id
          ? {
              ...reg,
              historico: [
                ...reg.historico,
                {
                  data: agora,
                  titulo: `Relatório ${tipoRelatorioAnexo} Anexado`,
                  descricao: `Arquivo anexado: ${arquivoRelatorio.name} (${(arquivoRelatorio.size / 1024).toFixed(0)} KB)`,
                  responsavel: 'Usuário Interno / DIFIS'
                }
              ]
            }
          : reg
      )
    );

    setAnexarModalReg(null);
    setArquivoRelatorio(null);
    setMensagemSucesso(`Relatório ${tipoRelatorioAnexo} anexado com sucesso (MSG008)!`);
    setTimeout(() => setMensagemSucesso(null), 4000);
  };

  const handleBaixarPdf = (reg: RegistroFiscalizacao) => {
    alert(`Gerando e baixando formulário oficial do ${reg.protocolo} em formato PDF (RN013 / BOT004)...`);
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
        return <Badge color="gray" dot>Emergência Registrada</Badge>;
    }
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Topo Oficial: Título DOR005 e Indicador de Emergências (RN011, LEG012) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Consultar Registros
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Consulta unificada de Denúncias Ambientais (RD) e Registros de Emergência Química (RE) — DIFIS/INEMA.
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
            Nova Denúncia (RD)
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
            onClick={() => alert('Exportando relatório consolidado da consulta para planilha XLS/XLSX...')}
            className="gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
            Exportar Pauta
          </Button>
        </div>
      </div>

      {/* Alertas do Sistema (MSG001, MSG002, MSG008) */}
      {mensagemErro && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{mensagemErro}</span>
        </div>
      )}
      {mensagemSucesso && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Mini Estatísticas Rápidas */}
      <StatsOverviewWidget
        columns={5}
        stats={[
          {
            label: 'Total de Registros',
            value: registros.length,
            description: 'Acervo consultável',
            color: 'gray',
          },
          {
            label: 'Emergências Químicas',
            value: registros.filter((r) => r.tipo === 'RE').length,
            description: `${qtdEmergenciasRegistradas} aguardando atendimento`,
            color: 'danger',
          },
          {
            label: 'Denúncias Ambientais',
            value: registros.filter((r) => r.tipo === 'RD').length,
            description: 'Sob apuração e vistoria',
            color: 'info',
          },
          {
            label: 'Em Análise / Campo',
            value: registros.filter((r) => r.status === 'Em Análise' || r.status === 'Vistoria Agendada').length,
            description: 'Com fiscais designados',
            color: 'warning',
          },
          {
            label: 'Concluídos',
            value: registros.filter((r) => r.status === 'Concluído').length,
            description: 'Autos e despachos emitidos',
            color: 'success',
          },
        ]}
      />

      {/* PAINEL OFICIAL DE FILTROS DA CONSULTA (DOR005 - TL001, RN003) */}
      <Card className="border-slate-200/90 dark:border-slate-800 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Filtros de Pesquisa (DOR005)
              </CardTitle>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Combine os filtros e clique em <strong>Consultar</strong>
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleConsultar} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 1. Status (LEG001) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status / Situação (LEG001)
                </label>
                <FilamentSelect
                  value={filtroStatus}
                  onChange={setFiltroStatus}
                  options={[
                    { value: 'TODOS', label: 'Todos os Status' },
                    { value: 'Registrado', label: 'Emergência Registrada' },
                    { value: 'Em Triagem', label: 'Em Triagem' },
                    { value: 'Em Análise', label: 'Em Análise' },
                    { value: 'Vistoria Agendada', label: 'Vistoria Agendada' },
                    { value: 'Notificado', label: 'Notificado' },
                    { value: 'Auto de Infração', label: 'Auto de Infração' },
                    { value: 'Concluído', label: 'Concluído' },
                  ]}
                />
              </div>

              {/* 2. Número do Registro (LEG002) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número do Registro (LEG002)
                </label>
                <input
                  type="text"
                  value={filtroNumeroRegistro}
                  onChange={(e) => setFiltroNumeroRegistro(e.target.value)}
                  placeholder="Ex: 2026.000001/INEMA/RD"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none shadow-2xs"
                />
              </div>

              {/* 3. Tipo de Registro (LEG004) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Registro (LEG004)
                </label>
                <FilamentSelect
                  value={filtroTipo}
                  onChange={(novoTipo) => {
                    setFiltroTipo(novoTipo as any);
                    if (novoTipo !== 'RE') {
                      setFiltroTipoEmergencia('Todos os Tipos de Emergência');
                    }
                  }}
                  options={[
                    { value: 'TODOS', label: 'Todos os Tipos (RD e RE)' },
                    { value: 'RD', label: 'Apenas Denúncias (RD)' },
                    { value: 'RE', label: 'Apenas Emergências (RE)' },
                  ]}
                />
              </div>

              {/* 4. Tipo da Emergência Química (RN004, LEG005 - Condicional) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo Emergência Química (LEG005)
                </label>
                <FilamentSelect
                  value={filtroTipoEmergencia}
                  onChange={setFiltroTipoEmergencia}
                  disabled={filtroTipo !== 'RE'}
                  options={TIPOS_EMERGENCIA}
                />
              </div>

              {/* 5. Município (LEG003) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Município (LEG003)
                </label>
                <FilamentSelect
                  value={filtroMunicipio}
                  onChange={setFiltroMunicipio}
                  searchable
                  options={[
                    { value: 'TODOS', label: 'Todos os Municípios da Bahia' },
                    ...MUNICIPIOS_BAHIA.map((m) => ({ value: m, label: m })),
                  ]}
                />
              </div>

              {/* 6. Período: Data Inicial (LEG006, RN005) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Data Inicial do Registro
                </label>
                <input
                  type="date"
                  value={filtroDataInicial}
                  onChange={(e) => setFiltroDataInicial(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none shadow-2xs"
                />
              </div>

              {/* 7. Período: Data Final (LEG006, RN005) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Data Final do Registro
                </label>
                <input
                  type="date"
                  value={filtroDataFinal}
                  onChange={(e) => setFiltroDataFinal(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none shadow-2xs"
                />
              </div>

              {/* 8. Palavra-Chave (LEG007, RN022) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Palavra-Chave no Relato (LEG007)
                </label>
                <input
                  type="text"
                  value={filtroPalavraChave}
                  onChange={(e) => setFiltroPalavraChave(e.target.value)}
                  placeholder="Ex: óleo, vazamento, desmate..."
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none shadow-2xs"
                />
              </div>

              {/* 9. Eixo Temático (LEG008) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Eixo Temático Pauta (LEG008)
                </label>
                <FilamentSelect
                  value={filtroEixoTematico}
                  onChange={setFiltroEixoTematico}
                  options={EIXOS_TEMATICOS}
                />
              </div>

              {/* 10. Técnico Plantonista Associado (LEG009) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Técnico Plantonista (LEG009)
                </label>
                <FilamentSelect
                  value={filtroTecnico}
                  onChange={setFiltroTecnico}
                  options={[
                    { value: 'TODOS', label: 'Todos os Fiscais/Técnicos' },
                    ...FISCAIS_DIFIS.map((f) => ({ value: f, label: f })),
                  ]}
                />
              </div>

              {/* 11. Comunicante / Infrator (LEG010, RN022) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Comunicante / Alvo (LEG010)
                </label>
                <input
                  type="text"
                  value={filtroComunicante}
                  onChange={(e) => setFiltroComunicante(e.target.value)}
                  placeholder="Nome, Razão Social ou CPF/CNPJ"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none shadow-2xs"
                />
              </div>

              {/* 12. Unidade de Encaminhamento (LEG011, RN023) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unidade Destino (LEG011)
                </label>
                <FilamentSelect
                  value={filtroUnidade}
                  onChange={setFiltroUnidade}
                  options={[
                    { value: 'TODOS', label: 'Todas as Unidades' },
                    { value: 'SEDE / DIFIS Salvador', label: 'SEDE / DIFIS Salvador' },
                    { value: 'UR Metropolitana', label: 'UR Metropolitana' },
                    { value: 'UR Oeste', label: 'UR Oeste (Barreiras)' },
                    { value: 'UR Litoral Sul', label: 'UR Litoral Sul (Ilhéus)' },
                    { value: 'UR Chapada', label: 'UR Chapada Diamantina' },
                    { value: 'UR São Francisco', label: 'UR São Francisco (Juazeiro)' },
                  ]}
                />
              </div>
            </div>

            {/* BOTÕES DE AÇÃO: Consultar (BOT001) e Limpar filtros (BOT002) */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLimparFiltros}
                className="gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpar Filtros (BOT002)
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5" />
                Consultar (BOT001)
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* RESULTADOS DA LISTAGEM (DOR005 - RN009, RN010) */}
      <TableContainer
        noScroll
        heading={`Registros Encontrados (${registrosFiltrados.length})`}
        description="Listagem ordenada por criticidade e data do registro conforme especificação DOR005."
      >
        <table className="fi-ta-table w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="fi-ta-header-cell py-3 px-3 font-semibold">Nº do Registro</th>
              <th className="fi-ta-header-cell py-3 px-3 font-semibold whitespace-nowrap">Data / Hora</th>
              <th className="fi-ta-header-cell py-3 px-3 font-semibold whitespace-nowrap">Tipo</th>
              <th className="fi-ta-header-cell py-3 px-3 font-semibold">Tipo da Entrada</th>
              <th className="fi-ta-header-cell py-3 px-3 font-semibold">Município / Unidade</th>
              <th className="fi-ta-header-cell py-3 px-3 font-semibold whitespace-nowrap">Status / Situação</th>
              <th className="fi-ta-header-cell py-3 px-3 text-right font-semibold whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  Nenhum registro foi encontrado para os filtros informados (MSG004).
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((r) => (
                <tr
                  key={r.id}
                  className="fi-ta-row hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Número do Registro */}
                  <td className="fi-ta-cell py-3 px-3 align-top">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {r.protocolo}
                    </div>
                    <span
                      title={r.infratorOuResponsavel}
                      className="text-[11px] text-slate-500 dark:text-slate-400 block truncate max-w-[170px] mt-0.5"
                    >
                      Alvo: {r.infratorOuResponsavel}
                    </span>
                  </td>

                  {/* Data e Hora */}
                  <td className="fi-ta-cell py-3 px-3 align-top whitespace-nowrap text-slate-700 dark:text-slate-300">
                    <div className="font-medium">{r.dataAbertura}</div>
                    <span className="text-[10px] text-slate-400">{r.dataHoraRegistro?.slice(11, 16) || '09:30'}</span>
                  </td>

                  {/* Tipo do Registro */}
                  <td className="fi-ta-cell py-3 px-3 align-top whitespace-nowrap">
                    <span
                      className={cn(
                        "fi-badge inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ring-1 ring-inset",
                        r.tipo === 'RE'
                          ? "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60"
                          : "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/60"
                      )}
                    >
                      {r.tipo === 'RE' ? 'Emergência (RE)' : 'Denúncia (RD)'}
                    </span>
                  </td>

                  {/* Tipo da Entrada (Origem) */}
                  <td className="fi-ta-cell py-3 px-3 align-top text-slate-700 dark:text-slate-300">
                    <div className="font-medium leading-snug">{r.origem}</div>
                  </td>

                  {/* Município / Unidade */}
                  <td className="fi-ta-cell py-3 px-3 align-top">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{r.municipio}</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate max-w-[140px]">
                      {r.unidadeRegional}
                    </span>
                  </td>

                  {/* Status / Situação */}
                  <td className="fi-ta-cell py-3 px-3 align-top whitespace-nowrap">
                    {getStatusBadge(r.status)}
                    {r.tecnicoResponsavel && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[130px] mt-0.5">
                        Resp: {r.tecnicoResponsavel.split(' ')[1] || r.tecnicoResponsavel}
                      </span>
                    )}
                  </td>

                  {/* AÇÕES OFICIAIS (BOT003, BOT004, BOT005, BOT006, BOT007, BOT008) */}
                  <td className="fi-ta-cell py-3 px-3 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {/* BOT003: Visualizar Detalhes */}
                      <button
                        type="button"
                        onClick={() => setDossieAberto(r)}
                        title="Visualizar Detalhes do Registro (BOT003)"
                        className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* BOT004: Baixar PDF */}
                      <button
                        type="button"
                        onClick={() => handleBaixarPdf(r)}
                        title="Baixar Formulário Oficial em PDF (BOT004)"
                        className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* BOT005/006/007: Anexar Relatório (Apenas RE) */}
                      {r.tipo === 'RE' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAnexarModalReg(r);
                            setTipoRelatorioAnexo('Preliminar');
                          }}
                          title="Anexar Relatório Preliminar, Conclusivo ou Complementar (BOT005-007)"
                          className="p-1 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* BOT008: Histórico de Eventos */}
                      <button
                        type="button"
                        onClick={() => setHistoricoModalReg(r)}
                        title="Consultar Histórico de Eventos (BOT008 / RN017)"
                        className="p-1 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      {/* Ação de Gestão: Designar Plantonista */}
                      <button
                        type="button"
                        onClick={() => {
                          setDesignarModalReg(r);
                          setTecnicoSelecionado(r.tecnicoResponsavel || FISCAIS_DIFIS[0]);
                        }}
                        title="Designar Técnico Plantonista"
                        className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableContainer>

      {/* MODAL 1: Visualizar Dossiê / Detalhes do Registro (BOT003, RN012) */}
      <Dialog open={!!dossieAberto} onOpenChange={() => setDossieAberto(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {dossieAberto && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                    {dossieAberto.protocolo}
                  </span>
                  {getStatusBadge(dossieAberto.status)}
                </div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {dossieAberto.tipo === 'RE' ? 'Registro de Emergência Química' : 'Registro de Denúncia Ambiental'}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {dossieAberto.tipoNome} • {dossieAberto.municipio} ({dossieAberto.unidadeRegional})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Descrição Fática</div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{dossieAberto.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500">Infrator / Responsável</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {dossieAberto.infratorOuResponsavel}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500">Canal de Origem</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{dossieAberto.origem}</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500">Coordenadas SIRGAS 2000</div>
                    <div className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">{dossieAberto.coordenadas}</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500">Técnico Plantonista</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {dossieAberto.tecnicoResponsavel || 'Não designado'}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => handleBaixarPdf(dossieAberto)}>
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Baixar Formulário em PDF
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setDossieAberto(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Anexar Relatório Técnico (DOR005 - BOT005, BOT006, BOT007, RN014, RN016) */}
      <Dialog open={!!anexarModalReg} onOpenChange={() => setAnexarModalReg(null)}>
        <DialogContent className="max-w-md">
          {anexarModalReg && (
            <form onSubmit={handleAnexarRelatorio}>
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-rose-600" />
                  Anexar Relatório ao Registro
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {anexarModalReg.protocolo} • {anexarModalReg.municipio}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo do Relatório Técnico <span className="text-rose-500">*</span>
                  </label>
                  <FilamentSelect
                    value={tipoRelatorioAnexo}
                    onChange={(val) => setTipoRelatorioAnexo(val as any)}
                    options={[
                      { value: 'Preliminar', label: 'Relatório Preliminar de Emergência Química (RPEQ)' },
                      { value: 'Conclusivo', label: 'Relatório Técnico Conclusivo de Vistoria' },
                      { value: 'Complementar', label: 'Relatório Técnico Complementar' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Arquivo do Relatório <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="file"
                    required
                    onChange={(e) => setArquivoRelatorio(e.target.files?.[0] || null)}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-xl p-2 bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-tight">
                    <strong>Formatos aceitos (MSG012):</strong> JPEG, JPG, PNG, BMP, MP3, MP4, PDF, DOC, DOCX, TXT, XLS, XLSX, SHP, SHX, DBF, PRJ, KML, KMZ e ZIP.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={() => setAnexarModalReg(null)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={!arquivoRelatorio}>
                  <UploadCloud className="w-3.5 h-3.5 mr-1" />
                  Confirmar Envio (MSG007)
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Histórico de Eventos e Auditoria (BOT008, RN017, LEG013) */}
      <Dialog open={!!historicoModalReg} onOpenChange={() => setHistoricoModalReg(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          {historicoModalReg && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  Histórico de Eventos e Tramitação (RN017)
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {historicoModalReg.protocolo} • Exibição em ordem cronológica decrescente.
                </DialogDescription>
              </DialogHeader>

              <div className="py-3">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {historicoModalReg.historico.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {item.titulo}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.data} • {item.responsavel}
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {item.descricao}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button variant="secondary" size="sm" onClick={() => setHistoricoModalReg(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Designar Técnico Plantonista */}
      <Dialog open={!!designarModalReg} onOpenChange={() => setDesignarModalReg(null)}>
        <DialogContent className="max-w-md">
          {designarModalReg && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Designar Técnico Plantonista
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {designarModalReg.protocolo} • {designarModalReg.municipio}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Selecione o Plantonista na Escala Vigente:
                  </label>
                  <FilamentSelect
                    value={tecnicoSelecionado}
                    onChange={(val) => setTecnicoSelecionado(val)}
                    options={FISCAIS_DIFIS}
                    searchable
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setDesignarModalReg(null)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleSalvarDesignacao}>
                  Salvar Designação
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
