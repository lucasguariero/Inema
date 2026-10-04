import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Eye,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Compass,
  Building2,
  ShieldAlert,
  FileText,
  FileCheck,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { Section } from '@/components/filament/Section';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { GlaDrawer } from '@/components/gla/layout/GlaDrawer';
import { cn } from '@/lib/utils';
import {
  MOCK_PROCEDENCIAS,
  MOCK_DOCUMENTOS_TERMOS,
  ProcedenciaItem,
  TipoProcedencia,
} from '@/data/faunaMock';

const TIPOS_PROCEDENCIA: TipoProcedencia[] = [
  'Entrega voluntária',
  'Apreensão',
  'Resgate',
  'Transferência',
];

const ORGAOS_INSTITUICOES_OPCOES = [
  'COPPA - Polícia Militar da Bahia',
  'PRF - Polícia Rodoviária Federal',
  'DIFIS / INEMA (Fiscalização Estadual)',
  'IBAMA - Instituto Brasileiro do Meio Ambiente',
  'Polícia Civil da Bahia (DEMA)',
  'Corpo de Bombeiros Militar da Bahia (CBMBA)',
  'Prefeitura Municipal / Guarda Ambiental',
];

interface ProcedenciaAnimalPageProps {
  onNavigate?: (route: string) => void;
}

export const ProcedenciaAnimalPage: React.FC<ProcedenciaAnimalPageProps> = ({ onNavigate }) => {
  // Estado de navegação: 'listagem' (TL001) | 'formulario' (TL002)
  const [viewMode, setViewMode] = useState<'listagem' | 'formulario'>('listagem');

  // Base de dados local
  const [procedencias, setProcedencias] = useState<ProcedenciaItem[]>(MOCK_PROCEDENCIAS);

  // Filtros TL001
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroPadrao, setFiltroPadrao] = useState<string>('todos');
  const [filtroSituacao, setFiltroSituacao] = useState<string>('todos');

  // Drawer Nível 1
  const [drawerProc, setDrawerProc] = useState<ProcedenciaItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // ESTADO DO FORMULÁRIO TL002 (NOVO / EDITAR)
  // Regras de Ouro DR003:
  // - Transferência é Tipo único; modalidades são tratadas por Subtipo
  // - Campo "Ocorrência" REMOVIDO do sistema; usar estritamente "Observação"
  // - "Unidade de origem" habilitada SOMENTE para Transferência
  // - Regra de Admissão: "Anexar documento? Sim / Não" -> Se Não, Pendência obrigatória
  // -------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campos
  const [formTipo, setFormTipo] = useState<TipoProcedencia>('Entrega voluntária');
  const [formSubtipo, setFormSubtipo] = useState('');
  const [formDescricaoUso, setFormDescricaoUso] = useState('');
  const [formSubtipoPadrao, setFormSubtipoPadrao] = useState(false);

  // Informações Exigidas na Admissão
  const [formExigeOrgao, setFormExigeOrgao] = useState(false);
  const [formExigeResponsavel, setFormExigeResponsavel] = useState(true);
  const [formExigeUnidadeOrigem, setFormExigeUnidadeOrigem] = useState(false);
  const [formExigeObservacao, setFormExigeObservacao] = useState(true); // Exclusivo Observação, Ocorrência eliminada

  // Órgãos Permitidos
  const [formOrgaosPermitidos, setFormOrgaosPermitidos] = useState<string[]>([]);

  // Documentos Exigidos
  const [formDocumentosExigidos, setFormDocumentosExigidos] = useState<string[]>([]);

  // Simulação da Regra de Admissão de Documentos (Sim/Não com Pendência)
  const [simularAnexoAdmissao, setSimularAnexoAdmissao] = useState<'sim' | 'nao'>('sim');
  const [simularJustificativaPendencia, setSimularJustificativaPendencia] = useState('');

  // Código SISCETAS
  const [formCodigoSiscetas, setFormCodigoSiscetas] = useState('');

  // Situação
  const [formSituacao, setFormSituacao] = useState<'Ativo' | 'Inativo'>('Ativo');

  // Erros
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isTransferencia = formTipo === 'Transferência';

  // Iniciar inclusão
  const handleNovoRegistro = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTipo('Entrega voluntária');
    setFormSubtipo('');
    setFormDescricaoUso('');
    setFormSubtipoPadrao(false);
    setFormExigeOrgao(false);
    setFormExigeResponsavel(true);
    setFormExigeUnidadeOrigem(false);
    setFormExigeObservacao(true);
    setFormOrgaosPermitidos([]);
    setFormDocumentosExigidos([]);
    setFormCodigoSiscetas('');
    setFormSituacao('Ativo');
    setFormErrors({});
    setViewMode('formulario');
  };

  // Iniciar edição
  const handleEditarRegistro = (p: ProcedenciaItem) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormTipo(p.tipo);
    setFormSubtipo(p.subtipo);
    setFormDescricaoUso(p.descricaoUso || '');
    setFormSubtipoPadrao(p.subtipoPadrao);
    setFormExigeOrgao(p.exigeOrgaoInstituicao);
    setFormExigeResponsavel(p.exigeResponsavel);
    setFormExigeUnidadeOrigem(p.tipo === 'Transferência' ? p.exigeUnidadeOrigem : false);
    setFormExigeObservacao(p.exigeObservacao);
    setFormOrgaosPermitidos(p.orgaosPermitidos || []);
    setFormDocumentosExigidos(p.documentosExigidos || []);
    setFormCodigoSiscetas(p.codigoSiscetas || '');
    setFormSituacao(p.situacao);
    setFormErrors({});
    if (drawerProc) setDrawerProc(null);
    setViewMode('formulario');
  };

  // Alternar situação
  const handleAlternarSituacao = (id: string) => {
    setProcedencias((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nova = p.situacao === 'Ativo' ? 'Inativo' : 'Ativo';
          showToast(`Situação de "${p.subtipo}" alterada para ${nova}.`);
          return { ...p, situacao: nova };
        }
        return p;
      })
    );
  };

  // Toggle órgão
  const handleToggleOrgao = (org: string) => {
    setFormOrgaosPermitidos((prev) =>
      prev.includes(org) ? prev.filter((o) => o !== org) : [...prev, org]
    );
  };

  // Toggle documento
  const handleToggleDocumento = (docId: string) => {
    setFormDocumentosExigidos((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  // Quando o tipo muda para algo diferente de Transferência, desativa Unidade de Origem
  const handleMudarTipo = (novoTipo: TipoProcedencia) => {
    setFormTipo(novoTipo);
    if (novoTipo !== 'Transferência') {
      setFormExigeUnidadeOrigem(false);
    }
  };

  // Validação
  const validarFormulario = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formSubtipo.trim()) {
      errors.formSubtipo = 'Informe o subtipo de procedência (até 150 caracteres).';
    }

    if (formExigeOrgao && formOrgaosPermitidos.length === 0) {
      errors.formOrgaos = 'Selecione ao menos um órgão permitido quando a opção Órgão/Instituição estiver ativa.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Salvar
  const handleSalvar = () => {
    if (!validarFormulario()) {
      showToast('Preencha os campos obrigatórios para salvar a procedência.');
      return;
    }

    if (isEditing && editingId) {
      setProcedencias((prev) =>
        prev.map((p) => {
          if (p.id === editingId) {
            return {
              ...p,
              tipo: formTipo,
              subtipo: formSubtipo.trim(),
              descricaoUso: formDescricaoUso.trim() || undefined,
              subtipoPadrao: formSubtipoPadrao,
              exigeOrgaoInstituicao: formExigeOrgao,
              exigeResponsavel: formExigeResponsavel,
              exigeUnidadeOrigem: isTransferencia ? formExigeUnidadeOrigem : false,
              exigeObservacao: formExigeObservacao,
              orgaosPermitidos: formExigeOrgao ? formOrgaosPermitidos : undefined,
              documentosExigidos: formDocumentosExigidos.length > 0 ? formDocumentosExigidos : undefined,
              codigoSiscetas: formCodigoSiscetas.trim() || undefined,
              situacao: formSituacao,
            };
          }
          return p;
        })
      );
      showToast(`Procedência "${formSubtipo}" atualizada com sucesso!`);
    } else {
      const nova: ProcedenciaItem = {
        id: `proc-${Date.now().toString().slice(-4)}`,
        tipo: formTipo,
        subtipo: formSubtipo.trim(),
        descricaoUso: formDescricaoUso.trim() || undefined,
        subtipoPadrao: formSubtipoPadrao,
        exigeOrgaoInstituicao: formExigeOrgao,
        exigeResponsavel: formExigeResponsavel,
        exigeUnidadeOrigem: isTransferencia ? formExigeUnidadeOrigem : false,
        exigeObservacao: formExigeObservacao,
        orgaosPermitidos: formExigeOrgao ? formOrgaosPermitidos : undefined,
        documentosExigidos: formDocumentosExigidos.length > 0 ? formDocumentosExigidos : undefined,
        codigoSiscetas: formCodigoSiscetas.trim() || undefined,
        situacao: formSituacao,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
      };
      setProcedencias((prev) => [nova, ...prev]);
      showToast(`Procedência "${formSubtipo}" cadastrada com sucesso!`);
    }

    setViewMode('listagem');
  };

  // Filtros aplicados
  const procedenciasFiltradas = useMemo(() => {
    return procedencias.filter((p) => {
      const matchBusca =
        !busca.trim() ||
        p.subtipo.toLowerCase().includes(busca.toLowerCase()) ||
        p.tipo.toLowerCase().includes(busca.toLowerCase()) ||
        (p.descricaoUso && p.descricaoUso.toLowerCase().includes(busca.toLowerCase())) ||
        (p.codigoSiscetas && p.codigoSiscetas.toLowerCase().includes(busca.toLowerCase()));

      const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo;
      const matchPadrao =
        filtroPadrao === 'todos' ||
        (filtroPadrao === 'sim' && p.subtipoPadrao) ||
        (filtroPadrao === 'nao' && !p.subtipoPadrao);
      const matchSituacao = filtroSituacao === 'todos' || p.situacao === filtroSituacao;

      return matchBusca && matchTipo && matchPadrao && matchSituacao;
    });
  }, [procedencias, busca, filtroTipo, filtroPadrao, filtroSituacao]);

  const activeFilterCount =
    (filtroTipo !== 'todos' ? 1 : 0) +
    (filtroPadrao !== 'todos' ? 1 : 0) +
    (filtroSituacao !== 'todos' ? 1 : 0);

  const handleLimparFiltros = () => {
    setBusca('');
    setFiltroTipo('todos');
    setFiltroPadrao('todos');
    setFiltroSituacao('todos');
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODO LISTAGEM (TL001) */}
      {/* ========================================================= */}
      {viewMode === 'listagem' && (
        <div className="space-y-6">
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  DR003
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  CADASTRO TRANSVERSAL
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Procedência Animal
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Cadastro transversal dos tipos e subtipos de origem da fauna admitida nos centros de triagem e resgate do INEMA.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                onClick={handleNovoRegistro}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs text-xs sm:text-sm h-9 px-4 font-semibold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Nova Procedência
              </Button>
            </div>
          </div>

          {/* KPI Cards Sóbrios */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Tipos Principais</span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-1">4</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Entrega, Apreensão, Resgate, Transferência</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Subtipos Cadastrados</span>
              <p className="text-xl font-bold font-mono text-[#0F4C3A] mt-1">{procedencias.length}</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Modalidades específicas</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Subtipos Padrão</span>
              <p className="text-xl font-bold font-mono text-emerald-700 mt-1">
                {procedencias.filter((p) => p.subtipoPadrao).length}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Seleção inicial na admissão</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Procedências Ativas</span>
              <p className="text-xl font-bold font-mono text-blue-700 mt-1">
                {procedencias.filter((p) => p.situacao === 'Ativo').length}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Disponíveis para uso</span>
            </div>
          </div>

          {/* Tabela de Procedências */}
          <TableContainer
            toolbar={
              <TableToolbar
                searchPlaceholder="Buscar por tipo, subtipo, descrição ou código SISCETAS..."
                searchValue={busca}
                onSearchChange={setBusca}
                activeFilterCount={activeFilterCount}
                filters={
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200/80">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tipo de Procedência</label>
                      <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todos os Tipos</option>
                        {TIPOS_PROCEDENCIA.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subtipo Padrão?</label>
                      <select
                        value={filtroPadrao}
                        onChange={(e) => setFiltroPadrao(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todos</option>
                        <option value="sim">Sim (Padrão)</option>
                        <option value="nao">Não</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Situação</label>
                      <select
                        value={filtroSituacao}
                        onChange={(e) => setFiltroSituacao(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todas as Situações</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                      </select>
                    </div>

                    {activeFilterCount > 0 && (
                      <div className="sm:col-span-3 flex justify-end">
                        <Button variant="ghost" size="xs" onClick={handleLimparFiltros} className="text-xs text-slate-600">
                          Limpar Filtros ({activeFilterCount})
                        </Button>
                      </div>
                    )}
                  </div>
                }
                actions={
                  <div className="text-xs text-slate-500 font-medium">
                    Exibindo <span className="font-bold text-slate-800">{procedenciasFiltradas.length}</span> de {procedencias.length} subtipos
                  </div>
                }
              />
            }
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold select-none">
                  <th className="py-2.5 px-4">Tipo de Procedência</th>
                  <th className="py-2.5 px-4">Subtipo Cadastrado</th>
                  <th className="py-2.5 px-3">Subtipo Padrão?</th>
                  <th className="py-2.5 px-4">Informações Exigidas na Admissão</th>
                  <th className="py-2.5 px-3">Cód. SISCETAS</th>
                  <th className="py-2.5 px-3">Situação</th>
                  <th className="py-2.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {procedenciasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Info className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-semibold text-slate-700">Nenhuma procedência encontrada</p>
                        <p className="text-xs text-slate-400">
                          Tente redefinir os filtros ou utilize outro termo de pesquisa.
                        </p>
                        {activeFilterCount > 0 && (
                          <Button variant="outline" size="sm" onClick={handleLimparFiltros} className="mt-2">
                            Limpar Filtros
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  procedenciasFiltradas.map((proc) => (
                    <tr key={proc.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                      {/* Tipo */}
                      <td className="py-2.5 px-4">
                        <Badge
                          color={
                            proc.tipo === 'Apreensão'
                              ? 'danger'
                              : proc.tipo === 'Resgate'
                              ? 'warning'
                              : proc.tipo === 'Transferência'
                              ? 'info'
                              : 'success'
                          }
                          size="sm"
                        >
                          {proc.tipo}
                        </Badge>
                      </td>

                      {/* Subtipo */}
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-slate-900 block">{proc.subtipo}</span>
                        {proc.descricaoUso && (
                          <span className="text-[11px] text-slate-400 truncate block max-w-sm">
                            {proc.descricaoUso}
                          </span>
                        )}
                      </td>

                      {/* Padrão */}
                      <td className="py-2.5 px-3">
                        {proc.subtipoPadrao ? (
                          <Badge color="primary" size="xs">
                            Padrão
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Não</span>
                        )}
                      </td>

                      {/* Exigências */}
                      <td className="py-2.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {proc.exigeOrgaoInstituicao && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              Órgão/Inst.
                            </span>
                          )}
                          {proc.exigeResponsavel && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              Responsável
                            </span>
                          )}
                          {proc.exigeUnidadeOrigem && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                              Unidade Origem
                            </span>
                          )}
                          {proc.exigeObservacao && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              Observação
                            </span>
                          )}
                        </div>
                      </td>

                      {/* SISCETAS */}
                      <td className="py-2.5 px-3">
                        {proc.codigoSiscetas ? (
                          <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {proc.codigoSiscetas}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Situação */}
                      <td className="py-2.5 px-3">
                        <Badge color={proc.situacao === 'Ativo' ? 'success' : 'gray'} size="sm" dot>
                          {proc.situacao}
                        </Badge>
                      </td>

                      {/* Ações */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDrawerProc(proc)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Visualizar detalhes da procedência"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditarRegistro(proc)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Editar procedência"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAlternarSituacao(proc.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title={proc.situacao === 'Ativo' ? 'Inativar' : 'Ativar'}
                          >
                            {proc.situacao === 'Ativo' ? (
                              <ToggleRight className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </TableContainer>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODO FORMULÁRIO (TL002 - NOVO / EDITAR) */}
      {/* ========================================================= */}
      {viewMode === 'formulario' && (
        <div className="space-y-6">
          {/* Topo do Formulário */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('listagem')}
                className="text-xs h-8 text-slate-600 border-slate-300"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Voltar à Listagem
              </Button>
              <div className="h-4 w-px bg-slate-300" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                DR003 — Formulário de Procedência Animal
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('listagem')}
                className="text-xs h-9 px-3"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSalvar}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 px-4 font-semibold shadow-xs"
              >
                Salvar Procedência
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Editar: ${formSubtipo}` : 'Nova Procedência de Fauna'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure o tipo, subtipo e os requisitos documentais e institucionais exigidos no momento da admissão do animal.
            </p>
          </div>

          {/* SEÇÃO 1: Tipo e Subtipo */}
          <Section
            title="1. Classificação do Tipo e Subtipo"
            description="Transferência é tipo único; modalidades específicas de origem devem ser cadastradas como subtipo."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Procedência <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formTipo}
                    onChange={(e) => handleMudarTipo(e.target.value as TipoProcedencia)}
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  >
                    {TIPOS_PROCEDENCIA.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Regra de Ouro: tipos consolidados na base única da DISUC.
                  </span>
                </div>

                {/* Subtipo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subtipo de Procedência <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={150}
                    value={formSubtipo}
                    onChange={(e) => setFormSubtipo(e.target.value)}
                    placeholder="ex: Entrega Espontânea por Cidadão ou Apreensão COPPA"
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formSubtipo ? 'border-rose-400' : 'border-slate-300'
                    )}
                  />
                  {formErrors.formSubtipo && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formSubtipo}</span>
                  )}
                </div>

                {/* Descrição de Uso */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descrição de Uso e Orientações Técnicas
                  </label>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={formDescricaoUso}
                    onChange={(e) => setFormDescricaoUso(e.target.value)}
                    placeholder="Instruções para o técnico ou atendente no momento de registrar a entrada..."
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                </div>

                {/* Subtipo Padrão & SISCETAS */}
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="subtipoPadraoCheck"
                    checked={formSubtipoPadrao}
                    onChange={(e) => setFormSubtipoPadrao(e.target.checked)}
                    className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                  />
                  <label htmlFor="subtipoPadraoCheck" className="text-xs text-slate-700 cursor-pointer">
                    <strong>Definir como Subtipo Padrão</strong> (pré-selecionado na Admissão - RN-005)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código de Correspondência SISCETAS
                  </label>
                  <input
                    type="text"
                    value={formCodigoSiscetas}
                    onChange={(e) => setFormCodigoSiscetas(e.target.value)}
                    placeholder="ex: EV-CID-01 ou APR-POL-02 (opcional - RN-013)"
                    className="w-full h-9 text-xs font-mono bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 2: Informações Exigidas na Admissão */}
          <Section
            title="2. Informações e Controles Exigidos na Admissão"
            description="Campos habilitados na tela de entrada do animal. Ocorrência foi substituída por Observação."
          >
            <div className="space-y-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Campos Obrigatórios / Exigidos:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Órgão / Instituição */}
                  <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formExigeOrgao}
                      onChange={(e) => setFormExigeOrgao(e.target.checked)}
                      className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A] mt-0.5"
                    />
                    <div>
                      <strong className="block text-slate-800">Órgão / Instituição de Entrega</strong>
                      <span className="text-[11px] text-slate-500">
                        Exige a seleção da autoridade policial ou órgão ambiental parceiro.
                      </span>
                    </div>
                  </label>

                  {/* Responsável */}
                  <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formExigeResponsavel}
                      onChange={(e) => setFormExigeResponsavel(e.target.checked)}
                      className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A] mt-0.5"
                    />
                    <div>
                      <strong className="block text-slate-800">Responsável pela Entrega / Cidadão</strong>
                      <span className="text-[11px] text-slate-500">
                        Exige dados de identificação da pessoa física entregadora.
                      </span>
                    </div>
                  </label>

                  {/* Unidade de Origem (Condicional SOMENTE para Transferência - RN-007) */}
                  <label
                    className={cn(
                      'flex items-start gap-2 text-xs cursor-pointer',
                      !isTransferencia ? 'opacity-40 cursor-not-allowed' : 'text-slate-700'
                    )}
                  >
                    <input
                      type="checkbox"
                      disabled={!isTransferencia}
                      checked={isTransferencia && formExigeUnidadeOrigem}
                      onChange={(e) => setFormExigeUnidadeOrigem(e.target.checked)}
                      className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A] mt-0.5"
                    />
                    <div>
                      <strong className="block text-slate-800">Unidade de Origem (Exclusivo Transferência)</strong>
                      <span className="text-[11px] text-slate-500">
                        Habilitado SOMENTE para subtipos de Transferência (RN-007).
                      </span>
                    </div>
                  </label>

                  {/* Observação (Substitui Ocorrência - Regra de Ouro) */}
                  <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formExigeObservacao}
                      onChange={(e) => setFormExigeObservacao(e.target.checked)}
                      className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A] mt-0.5"
                    />
                    <div>
                      <strong className="block text-slate-800">Observação Técnica</strong>
                      <span className="text-[11px] text-slate-500">
                        Regra de Ouro: O campo &quot;Ocorrência&quot; foi removido; campo padronizado como Observação.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Lista de Órgãos Permitidos (se ativado) */}
              {formExigeOrgao && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Órgãos e Instituições Permitidos <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Selecione as entidades que utilizam este subtipo</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {ORGAOS_INSTITUICOES_OPCOES.map((org) => (
                      <label
                        key={org}
                        className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded hover:bg-white"
                      >
                        <input
                          type="checkbox"
                          checked={formOrgaosPermitidos.includes(org)}
                          onChange={() => handleToggleOrgao(org)}
                          className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                        />
                        <span>{org}</span>
                      </label>
                    ))}
                  </div>
                  {formErrors.formOrgaos && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formOrgaos}</span>
                  )}
                </div>
              )}
            </div>
          </Section>

          {/* SEÇÃO 3: Documentos Exigidos & Salvaguarda de Anexo */}
          <Section
            title="3. Documentos Obrigatórios & Regra de Anexo na Admissão"
            description="Vinculação aos tipos do DR007 e regra mandatória de pendência documental se não houver anexo."
          >
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Documentos Exigidos para este Subtipo (DR007)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  {MOCK_DOCUMENTOS_TERMOS.map((doc) => (
                    <label
                      key={doc.id}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded hover:bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={formDocumentosExigidos.includes(doc.id)}
                        onChange={() => handleToggleDocumento(doc.id)}
                        className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                      <div className="truncate">
                        <span className="font-semibold block">{doc.nome}</span>
                        <span className="text-[11px] text-slate-400">{doc.natureza}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Box Demonstrativo da Regra de Ouro da Admissão */}
              <div className="p-3.5 bg-amber-50/70 rounded-lg border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Regra de Ouro no Fluxo de Admissão de Fauna:</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Na Admissão, a anexação documental segue a regra: <strong>&quot;Anexar documento? Sim / Não&quot;</strong>.
                  Caso o técnico responda <strong>&quot;Não&quot;</strong>, o campo <strong>&quot;Pendência Documental&quot;</strong> torna-se
                  automaticamente <strong>OBRIGATÓRIO</strong> com justificativa registrada em ata.
                </p>

                {/* Simulador Interativo da Regra */}
                <div className="p-3 bg-white rounded-md border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-800">
                    <span>Simulação: Anexar documento na admissão agora?</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="simularAnexo"
                        checked={simularAnexoAdmissao === 'sim'}
                        onChange={() => setSimularAnexoAdmissao('sim')}
                        className="text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                      <span>Sim (Upload do arquivo)</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="simularAnexo"
                        checked={simularAnexoAdmissao === 'nao'}
                        onChange={() => setSimularAnexoAdmissao('nao')}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-rose-700 font-semibold">Não (Gerar Pendência)</span>
                    </label>
                  </div>

                  {simularAnexoAdmissao === 'nao' && (
                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-[11px] font-semibold text-rose-700 mb-1">
                        Motivo da Pendência Documental <span className="text-rose-500">* (Obrigatório)</span>
                      </label>
                      <input
                        type="text"
                        value={simularJustificativaPendencia}
                        onChange={(e) => setSimularJustificativaPendencia(e.target.value)}
                        placeholder="Informe a justificativa (ex: Cidadão não portava termo no momento do resgate)..."
                        className="w-full h-8 text-xs bg-rose-50/50 border border-rose-300 rounded-md px-2 text-slate-800 focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 4: Situação Cadastral */}
          <Section
            title="4. Situação Cadastral"
            description="Controle de ativação do subtipo de procedência no sistema."
          >
            <div className="pt-2 flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Subtipo Habilitado / Ativo</span>
                <span className="text-[11px] text-slate-500">
                  Subtipos inativos não são apresentados no combobox da tela de admissão.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormSituacao((prev) => (prev === 'Ativo' ? 'Inativo' : 'Ativo'))}
                className="cursor-pointer"
              >
                {formSituacao === 'Ativo' ? (
                  <ToggleRight className="w-6 h-6 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-400" />
                )}
              </button>
            </div>
          </Section>

          {/* Rodapé do Formulário */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <Button variant="outline" size="sm" onClick={() => setViewMode('listagem')} className="text-xs h-9">
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSalvar}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 px-4 font-semibold shadow-xs"
            >
              Salvar Procedência
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GAVETA DE DETALHES (DRAWER NÍVEL 1) */}
      {/* ========================================================= */}
      {drawerProc && (
        <GlaDrawer
          isOpen={true}
          onClose={() => setDrawerProc(null)}
          title={drawerProc.subtipo}
          subtitle={`Tipo: ${drawerProc.tipo} · Código SISCETAS: ${drawerProc.codigoSiscetas || 'N/A'}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setDrawerProc(null)} className="text-xs">
                Fechar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleEditarRegistro(drawerProc)}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Editar Procedência
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-xs text-slate-700">
            {/* Badges Principais */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100">
              <Badge color={drawerProc.situacao === 'Ativo' ? 'success' : 'gray'} dot size="sm">
                {drawerProc.situacao}
              </Badge>
              <Badge color="primary" size="sm">
                {drawerProc.tipo}
              </Badge>
              {drawerProc.subtipoPadrao && (
                <Badge color="info" size="sm">
                  Subtipo Padrão
                </Badge>
              )}
            </div>

            {/* Descrição */}
            {drawerProc.descricaoUso && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Descrição e Hipóteses de Uso
                </h4>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700 leading-relaxed">
                  {drawerProc.descricaoUso}
                </p>
              </div>
            )}

            {/* Exigências de Admissão */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Informações Exigidas na Admissão
              </h4>
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <span>Órgão / Instituição de Entrega:</span>
                  <strong>{drawerProc.exigeOrgaoInstituicao ? 'Sim' : 'Não'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Responsável pela Entrega / Cidadão:</span>
                  <strong>{drawerProc.exigeResponsavel ? 'Sim' : 'Não'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Unidade de Origem:</span>
                  <strong>{drawerProc.exigeUnidadeOrigem ? 'Sim (Transferência)' : 'Não'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Observação Técnica:</span>
                  <strong>{drawerProc.exigeObservacao ? 'Sim' : 'Não'}</strong>
                </div>
              </div>
            </div>

            {/* Órgãos Permitidos */}
            {drawerProc.orgaosPermitidos && drawerProc.orgaosPermitidos.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Órgãos e Instituições Autorizados
                </h4>
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {drawerProc.orgaosPermitidos.map((org) => (
                    <div key={org} className="text-slate-800">
                      • {org}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documentos Exigidos */}
            {drawerProc.documentosExigidos && drawerProc.documentosExigidos.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Documentos Obrigatórios na Entrada
                </h4>
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {drawerProc.documentosExigidos.map((docId) => {
                    const doc = MOCK_DOCUMENTOS_TERMOS.find((d) => d.id === docId);
                    return (
                      <div key={docId} className="text-slate-800">
                        • {doc ? doc.nome : docId}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 text-[11px] text-slate-400">
              Cadastrado em: {drawerProc.dataCadastro}
            </div>
          </div>
        </GlaDrawer>
      )}
    </div>
  );
};
