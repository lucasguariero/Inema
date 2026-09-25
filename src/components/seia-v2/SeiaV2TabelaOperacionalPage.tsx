import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  FileEdit,
  History,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Calendar,
  Layers,
  FileSpreadsheet,
  X,
  ExternalLink
} from 'lucide-react';

interface ProcessoItem {
  id: string;
  sei: string;
  requerente: string;
  empreendimento: string;
  municipio: string;
  tipoAto: string;
  dataEntrada: string;
  slaDiasRestantes: number;
  status: 'deferido' | 'analise' | 'pendencia' | 'indeferido';
  statusLabel: string;
  analista: string;
}

export const SeiaV2TabelaOperacionalPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [diretoriaFilter, setDiretoriaFilter] = useState('todos');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProcesso, setSelectedProcesso] = useState<ProcessoItem | null>(null);

  const mockProcessos: ProcessoItem[] = [
    {
      id: 'p-1',
      sei: '020.12948.2026/0014',
      requerente: 'Agropecuária Vale Verde S.A.',
      empreendimento: 'Fazenda Rio Grande - Gleba A',
      municipio: 'Barreiras',
      tipoAto: 'Licença de Instalação (LI) + Outorga',
      dataEntrada: '14/01/2026',
      slaDiasRestantes: 4,
      status: 'analise',
      statusLabel: 'Em Análise Técnica',
      analista: 'Carlos Albuquerque',
    },
    {
      id: 'p-2',
      sei: '020.11409.2026/0009',
      requerente: 'Complexo Eólico Ventos da Bahia',
      empreendimento: 'Parque Eólico Serra Pelada',
      municipio: 'Gentio do Ouro',
      tipoAto: 'Supressão Vegetal (ASV)',
      dataEntrada: '08/02/2026',
      slaDiasRestantes: 8,
      status: 'pendencia',
      statusLabel: 'Pendência Requerente',
      analista: 'Juliana Prado',
    },
    {
      id: 'p-3',
      sei: '020.08920.2026/0032',
      requerente: 'Mineração Diamantina Ltda.',
      empreendimento: 'Mina Morro Alto',
      municipio: 'Lençóis',
      tipoAto: 'Renovação de LO',
      dataEntrada: '19/12/2025',
      slaDiasRestantes: 35,
      status: 'deferido',
      statusLabel: 'Portaria Emitida',
      analista: 'Carlos Albuquerque',
    },
    {
      id: 'p-4',
      sei: '020.13840.2026/0041',
      requerente: 'Consórcio Rodoviário do Oeste',
      empreendimento: 'Duplicação BA-459 Trecho II',
      municipio: 'Luís Eduardo Magalhães',
      tipoAto: 'Outorga Subterrânea',
      dataEntrada: '22/02/2026',
      slaDiasRestantes: 18,
      status: 'analise',
      statusLabel: 'Análise Hidrológica',
      analista: 'Marcos Vinícius',
    },
    {
      id: 'p-5',
      sei: '020.05112.2026/0088',
      requerente: 'Indústria Química Camaçari S.A.',
      empreendimento: 'Polo Petroquímico Bloco F',
      municipio: 'Camaçari',
      tipoAto: 'Licença de Alteração (LA)',
      dataEntrada: '03/01/2026',
      slaDiasRestantes: 0,
      status: 'indeferido',
      statusLabel: 'Indeferido (Prazo Recursal)',
      analista: 'Roberto Neves',
    },
    {
      id: 'p-6',
      sei: '020.14910.2026/0002',
      requerente: 'Solar Fotovoltaica Juazeiro I',
      empreendimento: 'Usina Mandacaru Solar',
      municipio: 'Juazeiro',
      tipoAto: 'Licença Prévia (LP)',
      dataEntrada: '01/03/2026',
      slaDiasRestantes: 45,
      status: 'analise',
      statusLabel: 'Triagem Inicial',
      analista: 'Juliana Prado',
    },
    {
      id: 'p-7',
      sei: '020.09841.2026/0073',
      requerente: 'Siderúrgica Vale do São Francisco',
      empreendimento: 'Planta de Laminação Norte',
      municipio: 'Simões Filho',
      tipoAto: 'Renovação de LO',
      dataEntrada: '11/11/2025',
      slaDiasRestantes: 60,
      status: 'deferido',
      statusLabel: 'Concluído / Ativo',
      analista: 'Carlos Albuquerque',
    },
    {
      id: 'p-8',
      sei: '020.12004.2026/0019',
      requerente: 'Cooperativa Agrícola de Irecê',
      empreendimento: 'Silo e Unidade de Secagem',
      municipio: 'Irecê',
      tipoAto: 'Dispensa de Licença (DLA)',
      dataEntrada: '25/02/2026',
      slaDiasRestantes: 12,
      status: 'deferido',
      statusLabel: 'Certidão Emitida',
      analista: 'Aline Matos',
    },
  ];

  const filteredProcessos = mockProcessos.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.sei.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.requerente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.municipio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProcessos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProcessos.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: ProcessoItem['status'], label: string) => {
    switch (status) {
      case 'deferido':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {label}
          </span>
        );
      case 'analise':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            {label}
          </span>
        );
      case 'pendencia':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
            <AlertTriangle className="w-3 h-3 text-sky-600" />
            {label}
          </span>
        );
      case 'indeferido':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            {label}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Início</span>
            <span>/</span>
            <span>Atendimento e Cadastros</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Pauta de Processos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Pauta Geral de Processos e Atos (SEIA V2)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Listagem unificada e controle operacional dos processos de regulação, fiscalização e outorga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exportando pauta em formato Excel (XLSX)...')}
            className="h-9 px-3 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Exportar XLSX</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FILTROS AVANÇADOS NO TOPO (PADRÃO FILAMENT TABLES)        */}
      {/* ========================================================= */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Busca Rápida */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por SEI, requerente, município..."
              className="w-full h-9 pl-8 pr-3 text-xs bg-slate-50/50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]"
            />
          </div>

          {/* Filtro de Status */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]"
            >
              <option value="todos">Todos os Status</option>
              <option value="analise">Em Análise Técnica</option>
              <option value="pendencia">Pendência do Requerente</option>
              <option value="deferido">Portaria / Deferido</option>
              <option value="indeferido">Indeferido</option>
            </select>
          </div>

          {/* Filtro de Diretoria */}
          <div className="lg:col-span-3">
            <select
              value={diretoriaFilter}
              onChange={(e) => setDiretoriaFilter(e.target.value)}
              className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]"
            >
              <option value="todos">Todas as Diretorias</option>
              <option value="dirre">DIRRE • Regulação</option>
              <option value="difis">DIFIS • Fiscalização</option>
              <option value="disuc">DISUC • Unidades Conservação</option>
              <option value="dipre">DIPRE • Recursos Hídricos</option>
            </select>
          </div>

          {/* Ação Limpar */}
          <div className="lg:col-span-2 flex items-center justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('todos');
                setDiretoriaFilter('todos');
              }}
              className="h-9 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors w-full"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-[#0F4C3A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">{selectedIds.length}</span>
              <span>processos selecionados para ação em lote.</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2.5 py-1 text-[11px] font-bold bg-[#0F4C3A] text-white rounded hover:bg-[#0b382b]">
                Distribuir em Lote
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 text-[11px] text-slate-600 hover:underline"
              >
                Desmarcar todos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* TABELA OPERACIONAL DENSE UI (FILAMENT DATA GRID)          */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredProcessos.length &&
                      filteredProcessos.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
                  />
                </th>
                <th className="p-3">Processo / Protocolo SEI</th>
                <th className="p-3">Requerente / Empreendimento</th>
                <th className="p-3">Ato Requerido</th>
                <th className="p-3">Entrada & SLA</th>
                <th className="p-3">Status</th>
                <th className="p-3">Responsável</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProcessos.map((proc) => {
                const isSelected = selectedIds.includes(proc.id);

                return (
                  <tr
                    key={proc.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelected ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(proc.id)}
                        className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                    </td>

                    <td className="p-3">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {proc.sei}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-800">{proc.requerente}</div>
                      <div className="text-[11px] text-slate-500">
                        {proc.empreendimento} • <strong className="text-slate-600">{proc.municipio}</strong>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-medium text-slate-700">{proc.tipoAto}</span>
                    </td>

                    <td className="p-3">
                      <div className="font-mono text-slate-600">{proc.dataEntrada}</div>
                      <div className="mt-0.5">
                        {proc.slaDiasRestantes <= 5 ? (
                          <span className="text-[10px] font-bold text-rose-600">
                            SLA: {proc.slaDiasRestantes}d restantes!
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            SLA: {proc.slaDiasRestantes}d restantes
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      {getStatusBadge(proc.status, proc.statusLabel)}
                    </td>

                    <td className="p-3 text-slate-600">
                      {proc.analista}
                    </td>

                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedProcesso(proc)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          title="Visualizar Detalhes"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-emerald-50 text-[#0F4C3A] transition-colors"
                          title="Parecer Técnico"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Histórico de Tramitação"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProcessos.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    Nenhum processo encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* RODAPÉ DA TABELA: PAGINAÇÃO COMPLETA                      */}
        {/* ========================================================= */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Exibindo <strong>1 a {filteredProcessos.length}</strong> de <strong>142</strong> processos</span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <span>Por página:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="h-7 px-2 border border-slate-200 rounded bg-white text-xs text-slate-700"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="px-2.5 py-1 rounded bg-[#0F4C3A] text-white font-bold font-mono text-xs">
              1
            </button>
            <button className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 font-mono text-xs">
              2
            </button>
            <button className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 font-mono text-xs">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 font-mono text-xs">
              15
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL DE DETALHES DO PROCESSO (PADRÃO FILAMENT MODAL)     */}
      {/* ========================================================= */}
      {selectedProcesso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header do Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {selectedProcesso.sei}
                  </span>
                  {getStatusBadge(selectedProcesso.status, selectedProcesso.statusLabel)}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedProcesso.tipoAto}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProcesso(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Requerente
                  </span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                    {selectedProcesso.requerente}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Empreendimento & Município
                  </span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                    {selectedProcesso.empreendimento} • {selectedProcesso.municipio}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Data de Entrada no Sistema
                  </span>
                  <span className="text-slate-700 mt-0.5 block">
                    {selectedProcesso.dataEntrada}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Técnico Responsável
                  </span>
                  <span className="text-slate-700 mt-0.5 block">
                    {selectedProcesso.analista} (DIRRE/COASP)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Última Tramitação Registrada
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Processo distribuído para análise técnica conforme Resolução CEPRAM nº 4.579/2018. Vistoria técnica realizada e aguardando complementação do laudo hidrogeológico pelo requerente.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>SLA Legal: restam <strong>{selectedProcesso.slaDiasRestantes} dias</strong> para conclusão do ato.</span>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedProcesso(null)}
                className="h-9 px-4 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Fechar
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Gerando Extrato do Processo ${selectedProcesso.sei}`)}
                  className="h-9 px-3.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                  <span>Extrato PDF</span>
                </button>
                <button
                  onClick={() => alert(`Redirecionando para SEI-BA: ${selectedProcesso.sei}`)}
                  className="h-9 px-4 text-xs font-bold bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Abrir no SEI-BA</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
