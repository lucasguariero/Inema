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
import { CustomSelect, SelectOption } from './CustomSelect';
import { SeiaV2Breadcrumb } from './SeiaV2Breadcrumb';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface SeiaV2TabelaOperacionalPageProps {
  onNavigate?: (route: string) => void;
}

export const SeiaV2TabelaOperacionalPage: React.FC<SeiaV2TabelaOperacionalPageProps> = ({ onNavigate }) => {
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
        return <Badge color="success" dot size="xs">{label}</Badge>;
      case 'analise':
        return <Badge color="warning" dot size="xs">{label}</Badge>;
      case 'pendencia':
        return <Badge color="info" dot size="xs">{label}</Badge>;
      case 'indeferido':
        return <Badge color="danger" dot size="xs">{label}</Badge>;
    }
  };

  const statusOptions: SelectOption[] = [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'analise', label: 'Em Análise Técnica' },
    { value: 'pendencia', label: 'Pendência do Requerente' },
    { value: 'deferido', label: 'Portaria / Deferido' },
    { value: 'indeferido', label: 'Indeferido (Recurso)' },
  ];

  const diretoriaOptions: SelectOption[] = [
    { value: 'todos', label: 'Todas as Diretorias' },
    { value: 'dirre', label: 'DIRRE • Regulação e Outorga' },
    { value: 'difis', label: 'DIFIS • Fiscalização' },
    { value: 'disuc', label: 'DISUC • Unidades Conservação' },
    { value: 'dipre', label: 'DIPRE • Recursos Hídricos' },
  ];

  const perPageOptions: SelectOption[] = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
  ];

  return (
    <div className="space-y-5">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <SeiaV2Breadcrumb
            items={[
              { label: 'Início', href: '/?rota=seia-v2&tela=inicio' },
              { label: 'Atendimento e Cadastros', href: '/?rota=seia-v2&tela=inicio' },
              { label: 'Pauta de Processos' },
            ]}
          />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Pauta Geral de Processos e Atos (SEIA V2)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Listagem unificada e controle operacional dos processos de regulação, fiscalização e outorga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Exportando pauta em formato Excel (XLSX)...')}
            className="text-xs h-9 font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-[var(--color-text-link)]" />
            <span>Exportar XLSX</span>
          </Button>
          {onNavigate && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('formulario')}
              className="text-xs h-9 font-semibold bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs"
            >
              <span>+ Novo Requerimento</span>
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TABELA OPERACIONAL CANÔNICA (TABLE CONTAINER + TOOLBAR)   */}
      {/* ========================================================= */}
      <TableContainer
        toolbar={
          <TableToolbar
            searchPlaceholder="Filtrar por SEI, requerente, município..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilterCount={(statusFilter !== 'todos' ? 1 : 0) + (diretoriaFilter !== 'todos' ? 1 : 0)}
            filters={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                <div className="lg:col-span-5">
                  <CustomSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusOptions}
                    placeholder="Todos os Status"
                  />
                </div>
                <div className="lg:col-span-5">
                  <CustomSelect
                    value={diretoriaFilter}
                    onChange={setDiretoriaFilter}
                    options={diretoriaOptions}
                    placeholder="Todas as Diretorias"
                  />
                </div>
                <div className="lg:col-span-2 flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusFilter('todos');
                      setDiretoriaFilter('todos');
                    }}
                    className="w-full text-xs h-9"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            }
            actions={
              selectedIds.length > 0 ? (
                <div className="flex items-center gap-2 text-xs">
                  <Badge color="primary" size="xs">
                    {selectedIds.length} selecionados
                  </Badge>
                  <Button size="xs" variant="primary" className="bg-[#0F4C3A] text-white">
                    Distribuir em Lote
                  </Button>
                  <Button size="xs" variant="ghost" onClick={() => setSelectedIds([])}>
                    Desmarcar
                  </Button>
                </div>
              ) : null
            }
          />
        }
        pagination={
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>Exibindo <strong>1 a {filteredProcessos.length}</strong> de <strong>142</strong> processos</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <span>Por página:</span>
                <div className="w-18">
                  <CustomSelect
                    value={String(itemsPerPage)}
                    onChange={(v) => setItemsPerPage(Number(v))}
                    options={perPageOptions}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 h-7 w-7"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <Button size="xs" variant="primary" className="h-7 px-2.5 font-bold font-mono bg-[#0F4C3A] text-white">
                1
              </Button>
              <Button size="xs" variant="outline" className="h-7 px-2.5 font-mono">
                2
              </Button>
              <Button size="xs" variant="outline" className="h-7 px-2.5 font-mono">
                3
              </Button>
              <span className="px-1 text-slate-400">...</span>
              <Button size="xs" variant="outline" className="h-7 px-2.5 font-mono">
                15
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1 h-7 w-7"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        }
      >
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
              <th className="p-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === filteredProcessos.length &&
                    filteredProcessos.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 dark:border-slate-700 text-[#0F4C3A] focus:ring-[#0F4C3A]"
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
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProcessos.map((proc) => {
              const isSelected = selectedIds.includes(proc.id);

              return (
                <tr
                  key={proc.id}
                  className={`transition-colors duration-150 ease-in-out ${
                    isSelected ? 'bg-[#0F4C3A]/5 hover:bg-[#0F4C3A]/10 dark:bg-emerald-950/20' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(proc.id)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all duration-150 cursor-pointer"
                    />
                  </td>

                  <td className="p-3">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {proc.sei}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{proc.requerente}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {proc.empreendimento} • <strong className="text-slate-600 dark:text-slate-300">{proc.municipio}</strong>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{proc.tipoAto}</span>
                  </td>

                  <td className="p-3">
                    <div className="font-mono text-slate-600 dark:text-slate-400">{proc.dataEntrada}</div>
                    <div className="mt-0.5">
                      {proc.slaDiasRestantes <= 5 ? (
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                          SLA: {proc.slaDiasRestantes}d restantes!
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          SLA: {proc.slaDiasRestantes}d restantes
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    {getStatusBadge(proc.status, proc.statusLabel)}
                  </td>

                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {proc.analista}
                  </td>

                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setSelectedProcesso(proc)}
                        className="p-1.5 text-slate-400 hover:text-[#0F4C3A] dark:hover:text-emerald-400"
                        title="Visualizar Detalhes"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="p-1.5 text-[#0F4C3A] dark:text-emerald-400 hover:bg-[#0F4C3A]/10"
                        title="Parecer Técnico"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        title="Histórico de Tramitação"
                      >
                        <History className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredProcessos.length === 0 && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-slate-400 dark:text-slate-500">
                  Nenhum processo encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableContainer>

      {/* ========================================================= */}
      {/* MODAL DE DETALHES DO PROCESSO (PADRÃO FILAMENT MODAL)     */}
      {/* ========================================================= */}
      {selectedProcesso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header do Modal */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {selectedProcesso.sei}
                  </span>
                  {getStatusBadge(selectedProcesso.status, selectedProcesso.statusLabel)}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedProcesso.tipoAto}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProcesso(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Requerente
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                    {selectedProcesso.requerente}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Empreendimento & Município
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                    {selectedProcesso.empreendimento} • {selectedProcesso.municipio}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Data de Entrada no Sistema
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 mt-0.5 block">
                    {selectedProcesso.dataEntrada}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Técnico Responsável
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 mt-0.5 block">
                    {selectedProcesso.analista} (DIRRE/COASP)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  Última Tramitação Registrada
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Processo distribuído para análise técnica conforme Resolução CEPRAM nº 4.579/2018. Vistoria técnica realizada e aguardando complementação do laudo hidrogeológico pelo requerente.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>SLA Legal: restam <strong>{selectedProcesso.slaDiasRestantes} dias</strong> para conclusão do ato.</span>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProcesso(null)}
              >
                Fechar
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Gerando Extrato do Processo ${selectedProcesso.sei}`)}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  <span>Extrato PDF</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => alert(`Redirecionando para SEI-BA: ${selectedProcesso.sei}`)}
                  className="bg-[#0F4C3A] text-white"
                >
                  <span>Abrir no SEI-BA</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
