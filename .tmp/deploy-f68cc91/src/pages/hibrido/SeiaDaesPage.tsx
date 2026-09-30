import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Printer,
  Copy,
  X,
  FileText,
  DollarSign,
  Building,
  Calendar,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import {
  GlaTableContainer,
  GlaTable,
  GlaTableHead,
  GlaTh,
  GlaTableBody,
  GlaTableRow,
  GlaTd,
  GlaPagination
} from '@/components/common/GlaTable';
import { StatsOverviewWidget } from '@/components/filament/StatsOverviewWidget';
import { MOCK_DAES, DaeItem } from '@/data/hibridoMock';

interface SeiaDaesPageProps {
  onNavigate?: (route: string) => void;
}

export const SeiaDaesPage: React.FC<SeiaDaesPageProps> = ({ onNavigate }) => {
  const [daes, setDaes] = useState<DaeItem[]>(MOCK_DAES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('TODOS');
  const [selectedSituacao, setSelectedSituacao] = useState<string>('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modais
  const [daeVisualizando, setDaeVisualizando] = useState<DaeItem | null>(null);
  const [modalNovaEmissaoAberta, setModalNovaEmissaoAberta] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form State para Novo DAE
  const [novoDae, setNovoDae] = useState({
    tipo: 'Taxa' as DaeItem['tipo'],
    requerente: '',
    tecnico: 'Clarisse Dias Cruz',
    vencimento: '30/10/2026',
    valor: '',
    processoVinculado: '',
    descricao: ''
  });

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Filtragem
  const filteredDaes = useMemo(() => {
    return daes.filter(item => {
      const matchSearch =
        searchTerm === '' ||
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.requerente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.processoVinculado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipo = selectedTipo === 'TODOS' || item.tipo === selectedTipo;
      const matchSituacao = selectedSituacao === 'TODOS' || item.situacao === selectedSituacao;

      return matchSearch && matchTipo && matchSituacao;
    });
  }, [daes, searchTerm, selectedTipo, selectedSituacao]);

  const totalPages = Math.ceil(filteredDaes.length / itemsPerPage) || 1;
  const paginatedDaes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDaes.slice(start, start + itemsPerPage);
  }, [filteredDaes, currentPage]);

  // Cálculos de Resumo
  const totalArrecadado = useMemo(() => {
    return daes
      .filter(d => d.situacao === 'Pago')
      .reduce((acc, curr) => acc + curr.valor, 0);
  }, [daes]);

  const totalAberto = useMemo(() => {
    return daes
      .filter(d => d.situacao === 'Emitido')
      .reduce((acc, curr) => acc + curr.valor, 0);
  }, [daes]);

  const stats = [
    {
      label: 'Total Arrecadado (Pagos)',
      value: `R$ ${totalArrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      description: `${daes.filter(d => d.situacao === 'Pago').length} guias compensadas`,
      descriptionIcon: CheckCircle2,
      color: 'success' as const
    },
    {
      label: 'DAEs em Aberto (Emitidos)',
      value: `R$ ${totalAberto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      description: `${daes.filter(d => d.situacao === 'Emitido').length} guias aguardando pagamento`,
      descriptionIcon: Clock,
      color: 'warning' as const
    },
    {
      label: 'DAEs Vencidos / Cobrança',
      value: `${daes.filter(d => d.situacao === 'Vencido').length} guia`,
      description: 'Passível de inscrição em dívida ativa',
      descriptionIcon: AlertTriangle,
      color: 'danger' as const
    },
    {
      label: 'Volume Total Gerado',
      value: daes.length.toString(),
      description: 'Documentos emitidos no exercício',
      descriptionIcon: FileSpreadsheet,
      color: 'gray' as const
    }
  ];

  const handleSalvarNovoDae = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoDae.requerente || !novoDae.valor) {
      alert('Preencha os campos obrigatórios do DAE.');
      return;
    }

    const valorNum = parseFloat(novoDae.valor.replace(',', '.'));
    const novoItem: DaeItem = {
      id: `dae-${Date.now()}`,
      codigo: `0${Math.floor(1000 + Math.random() * 9000)}`,
      emissao: new Date().toLocaleDateString('pt-BR'),
      tipo: novoDae.tipo,
      requerente: novoDae.requerente,
      tecnico: novoDae.tecnico,
      vencimento: novoDae.vencimento,
      valor: isNaN(valorNum) ? 150.00 : valorNum,
      situacao: 'Emitido',
      processoVinculado: novoDae.processoVinculado || '2026.001.000000/INEMA',
      descricao: novoDae.descricao || 'Taxa de análise técnica de licenciamento'
    };

    setDaes([novoItem, ...daes]);
    setModalNovaEmissaoAberta(false);
    showToast(`DAE Nº ${novoItem.codigo} emitido com sucesso!`);
    setNovoDae({
      tipo: 'Taxa',
      requerente: '',
      tecnico: 'Clarisse Dias Cruz',
      vencimento: '30/10/2026',
      valor: '',
      processoVinculado: '',
      descricao: ''
    });
  };

  const copiarLinhaDigitavel = (codigo: string) => {
    const linha = `85890000001-2  ${codigo}000000-4  20260900000-8  00102963000-9`;
    navigator.clipboard?.writeText(linha);
    showToast('Linha digitável copiada para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      {/* 1. TOAST DE FEEDBACK */}
      {feedbackToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{feedbackToast}</span>
          </div>
          <button
            onClick={() => setFeedbackToast(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. CABEÇALHO COM AÇÕES PRIMÁRIAS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Gestão de DAEs — Arrecadação Estadual
            </h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              SEFAZ-BA / INEMA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Emissão, consulta, controle de baixas e conciliação bancária de taxas ambientais e multas
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => showToast('Simulação: Arquivo de Retorno bancário (CNAB 240) processado com 0 inconsistências.')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Arquivo de Retorno</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Exportação de relatório em PDF gerada com sucesso.')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setModalNovaEmissaoAberta(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Emitir Novo DAE</span>
          </button>
        </div>
      </div>

      {/* 3. CARDS DE RESUMO ESTATÍSTICO (FILAMENT WIDGET) */}
      <StatsOverviewWidget stats={stats} columns={4} />

      {/* 4. TABELA DENSA COM CONTAINER FILAMENT */}
      <GlaTableContainer
        heading="Documentos de Arrecadação Emitidos"
        description="Relação oficial de guias bancárias vinculadas a processos do SEIA"
        badge={`${filteredDaes.length} guias listadas`}
        toolbar={
          <div className="px-5 py-3 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Campo de Busca */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por código, interessado, processo SEI..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0F4C3A] focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filtros Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Tipo:</span>
              </div>
              <select
                value={selectedTipo}
                onChange={(e) => {
                  setSelectedTipo(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-slate-700 focus:outline-none focus:border-[#0F4C3A]"
              >
                <option value="TODOS">Todos os tipos</option>
                <option value="Taxa">Taxa</option>
                <option value="Multa">Multa</option>
                <option value="Outorga">Outorga</option>
                <option value="Análise">Análise</option>
              </select>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-2">
                <span>Situação:</span>
              </div>
              <select
                value={selectedSituacao}
                onChange={(e) => {
                  setSelectedSituacao(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-slate-700 focus:outline-none focus:border-[#0F4C3A]"
              >
                <option value="TODOS">Todas as situações</option>
                <option value="Pago">Pago</option>
                <option value="Emitido">Emitido</option>
                <option value="Vencido">Vencido</option>
              </select>

              {(searchTerm || selectedTipo !== 'TODOS' || selectedSituacao !== 'TODOS') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTipo('TODOS');
                    setSelectedSituacao('TODOS');
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-rose-600 font-semibold cursor-pointer"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
        }
        pagination={
          <GlaPagination
            currentCount={paginatedDaes.length}
            totalCount={filteredDaes.length}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            entityName="guias DAE"
          />
        }
      >
        <GlaTable>
          <GlaTableHead>
            <tr>
              <GlaTh>Código DAE</GlaTh>
              <GlaTh>Tipo</GlaTh>
              <GlaTh>Requerente / Interessado</GlaTh>
              <GlaTh>Processo Vinculado</GlaTh>
              <GlaTh>Emissão</GlaTh>
              <GlaTh>Vencimento</GlaTh>
              <GlaTh align="right">Valor (R$)</GlaTh>
              <GlaTh align="center">Situação</GlaTh>
              <GlaTh align="center">Ações</GlaTh>
            </tr>
          </GlaTableHead>
          <GlaTableBody>
            {paginatedDaes.length === 0 ? (
              <GlaTableRow>
                <GlaTd colSpan={9} className="text-center py-8 text-slate-500">
                  Nenhum DAE encontrado com os filtros selecionados.
                </GlaTd>
              </GlaTableRow>
            ) : (
              paginatedDaes.map((dae) => {
                const isPago = dae.situacao === 'Pago';
                const isEmitido = dae.situacao === 'Emitido';
                const isVencido = dae.situacao === 'Vencido';

                return (
                  <GlaTableRow key={dae.id}>
                    {/* Código */}
                    <GlaTd>
                      <div className="flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono font-bold text-slate-800">
                          {dae.codigo}
                        </span>
                      </div>
                    </GlaTd>

                    {/* Tipo */}
                    <GlaTd>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {dae.tipo}
                      </span>
                    </GlaTd>

                    {/* Requerente */}
                    <GlaTd>
                      <div className="max-w-[220px]">
                        <div className="font-semibold text-slate-900 truncate" title={dae.requerente}>
                          {dae.requerente}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Técnico: {dae.tecnico}
                        </div>
                      </div>
                    </GlaTd>

                    {/* Processo Vinculado */}
                    <GlaTd>
                      <span className="font-mono text-[11px] text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        {dae.processoVinculado}
                      </span>
                    </GlaTd>

                    {/* Emissão */}
                    <GlaTd>
                      <span className="text-slate-600 font-mono text-[11px]">
                        {dae.emissao}
                      </span>
                    </GlaTd>

                    {/* Vencimento */}
                    <GlaTd>
                      <span className={`font-mono text-[11px] font-semibold ${isVencido ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                        {dae.vencimento}
                      </span>
                    </GlaTd>

                    {/* Valor */}
                    <GlaTd align="right">
                      <span className="font-mono font-bold text-slate-900">
                        R$ {dae.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </GlaTd>

                    {/* Situação */}
                    <GlaTd align="center">
                      {isPago && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Pago</span>
                        </span>
                      )}
                      {isEmitido && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Emitido</span>
                        </span>
                      )}
                      {isVencido && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Vencido</span>
                        </span>
                      )}
                    </GlaTd>

                    {/* Ações */}
                    <GlaTd align="center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDaeVisualizando(dae)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Visualizar Espelho do DAE"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => showToast(`Segunda via gerada para o DAE Nº ${dae.codigo}`)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Baixar 2ª Via do Boleto (PDF)"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </GlaTd>
                  </GlaTableRow>
                );
              })
            )}
          </GlaTableBody>
        </GlaTable>
      </GlaTableContainer>

      {/* 5. MODAL ESPELHO OFICIAL DO DAE (VISUALIZAÇÃO COMPLETA) */}
      {daeVisualizando && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header do Modal */}
            <div className="px-6 py-4 bg-[#0F4C3A] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    Documento de Arrecadação Estadual — DAE Nº {daeVisualizando.codigo}
                  </h3>
                  <p className="text-[10px] text-emerald-200">
                    Governo do Estado da Bahia • Secretaria da Fazenda • INEMA
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDaeVisualizando(null)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo do DAE */}
            <div className="p-6 space-y-5 text-xs text-slate-800 max-h-[75vh] overflow-y-auto">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Situação da Guia:</span>
                  <div className="font-bold text-sm mt-0.5">
                    {daeVisualizando.situacao === 'Pago' ? (
                      <span className="text-emerald-700">PAGO — Autenticação Bancária Registrada</span>
                    ) : daeVisualizando.situacao === 'Emitido' ? (
                      <span className="text-amber-700">EMITIDO — Aguardando Compensação Bancária</span>
                    ) : (
                      <span className="text-rose-700">VENCIDO — Necessário emissão de 2ª via atualizada</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Data de Emissão:</span>
                  <div className="font-mono font-bold mt-0.5">{daeVisualizando.emissao}</div>
                </div>
              </div>

              {/* Informações do Contribuinte */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                <div className="font-bold text-xs text-slate-900 border-b border-slate-100 pb-2">
                  Dados do Contribuinte / Requerente
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Razão Social / Nome</span>
                    <span className="font-semibold text-slate-800">{daeVisualizando.requerente}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Processo Vinculado</span>
                    <span className="font-mono font-semibold text-slate-800">{daeVisualizando.processoVinculado}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Técnico Responsável</span>
                    <span className="font-semibold text-slate-800">{daeVisualizando.tecnico}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tipo do Débito</span>
                    <span className="font-semibold text-slate-800">{daeVisualizando.tipo}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Discriminação da Receita</span>
                  <span className="text-slate-700">{daeVisualizando.descricao}</span>
                </div>
              </div>

              {/* Valores e Vencimento */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Vencimento</span>
                  <span className="text-sm font-mono font-bold text-slate-900">{daeVisualizando.vencimento}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Valor Principal</span>
                  <span className="text-sm font-mono font-semibold text-slate-700">
                    R$ {daeVisualizando.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-right">
                  <span className="text-[10px] text-emerald-800 block uppercase font-bold">Total a Recolher</span>
                  <span className="text-base font-mono font-bold text-[#0F4C3A]">
                    R$ {daeVisualizando.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Código de Barras e Linha Digitável Simulado */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2.5 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Linha Digitável (FEBRABAN)</span>
                  <button
                    type="button"
                    onClick={() => copiarLinhaDigitavel(daeVisualizando.codigo)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F4C3A] hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Linha</span>
                  </button>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg font-mono text-center text-xs font-bold text-slate-800 select-all tracking-wider">
                  85890000001-2 &nbsp; {daeVisualizando.codigo}000000-4 &nbsp; 20260900000-8 &nbsp; 00102963000-9
                </div>

                {/* Código de barras gráfico simulado */}
                <div className="pt-2 flex flex-col items-center justify-center">
                  <div className="h-10 w-full max-w-sm flex items-center justify-between gap-[2px] opacity-80">
                    {Array.from({ length: 55 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 h-full"
                        style={{ width: idx % 3 === 0 ? '4px' : idx % 2 === 0 ? '2px' : '1px' }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1">Autenticação Mecânica / Via do Contribuinte</span>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setDaeVisualizando(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Fechar
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir DAE Oficial</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL DE EMISSÃO DE NOVO DAE */}
      {modalNovaEmissaoAberta && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#0F4C3A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-emerald-300" />
                <h3 className="text-sm font-bold">Emitir Novo Documento de Arrecadação (DAE)</h3>
              </div>
              <button
                onClick={() => setModalNovaEmissaoAberta(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarNovoDae} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tipo de Documento / Receita *
                </label>
                <select
                  value={novoDae.tipo}
                  onChange={(e) => setNovoDae({ ...novoDae, tipo: e.target.value as any })}
                  className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-slate-800 focus:bg-white focus:border-[#0F4C3A] focus:outline-none"
                >
                  <option value="Taxa">Taxa de Licenciamento Ambiental</option>
                  <option value="Multa">Multa / Auto de Infração DIFIS</option>
                  <option value="Outorga">Taxa de Outorga de Recursos Hídricos</option>
                  <option value="Análise">Taxa Complementar de Análise Técnica</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Requerente / Razão Social *
                </label>
                <input
                  type="text"
                  required
                  value={novoDae.requerente}
                  onChange={(e) => setNovoDae({ ...novoDae, requerente: e.target.value })}
                  placeholder="Ex: Fazenda Boa Esperança Agropecuária Ltda"
                  className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-slate-800 focus:bg-white focus:border-[#0F4C3A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Processo Vinculado (SEI / CERH)
                  </label>
                  <input
                    type="text"
                    value={novoDae.processoVinculado}
                    onChange={(e) => setNovoDae({ ...novoDae, processoVinculado: e.target.value })}
                    placeholder="2026.001.000000/INEMA"
                    className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-slate-800 font-mono focus:bg-white focus:border-[#0F4C3A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Valor a Recolher (R$) *
                  </label>
                  <input
                    type="text"
                    required
                    value={novoDae.valor}
                    onChange={(e) => setNovoDae({ ...novoDae, valor: e.target.value })}
                    placeholder="Ex: 1500,00"
                    className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-slate-800 font-mono font-bold focus:bg-white focus:border-[#0F4C3A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Data de Vencimento *
                </label>
                <input
                  type="text"
                  value={novoDae.vencimento}
                  onChange={(e) => setNovoDae({ ...novoDae, vencimento: e.target.value })}
                  className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-slate-800 font-mono focus:bg-white focus:border-[#0F4C3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Discriminação / Justificativa do Débito
                </label>
                <textarea
                  rows={2}
                  value={novoDae.descricao}
                  onChange={(e) => setNovoDae({ ...novoDae, descricao: e.target.value })}
                  placeholder="Descrição da taxa, ato ou vistoria técnica aplicável..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:bg-white focus:border-[#0F4C3A] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalNovaEmissaoAberta(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Confirmar e Emitir Guia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
