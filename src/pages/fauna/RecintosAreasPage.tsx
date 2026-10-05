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
  Home,
  Building,
  ShieldCheck,
  Activity,
  Layers,
  Wrench,
  ToggleLeft,
  ToggleRight,
  Maximize2,
  Users,
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
  MOCK_RECINTOS,
  MOCK_UNIDADES,
  MOCK_ESPECIES,
  RecintoItem,
  EstadoSanitarioRecinto,
  SituacaoOperacionalRecinto,
} from '@/data/faunaMock';

const TIPOS_RECINTO_OPCOES = [
  'Quarentena',
  'Triagem',
  'Reabilitação',
  'Berçário',
  'Recinto de Exposição',
  'Clínica Veterinária',
] as const;

const ESTADOS_SANITARIOS_OPCOES: EstadoSanitarioRecinto[] = [
  'Adequado',
  'Em Desinfecção',
  'Quarentena Sanitária',
  'Contaminado',
];

interface RecintosAreasPageProps {
  onNavigate?: (route: string) => void;
}

export const RecintosAreasPage: React.FC<RecintosAreasPageProps> = ({ onNavigate }) => {
  // Estado de navegação: 'listagem' (TL001) | 'formulario' (TL002)
  const [viewMode, setViewMode] = useState<'listagem' | 'formulario'>('listagem');

  // Base de dados local
  const [recintos, setRecintos] = useState<RecintoItem[]>(MOCK_RECINTOS);

  // Unidades válidas que permitem recintos (DR004)
  const unidadesComRecinto = useMemo(() => {
    return MOCK_UNIDADES.filter(
      (u) =>
        u.tipoUnidadeNome.includes('CETAS') ||
        u.tipoUnidadeNome.includes('Zoológico') ||
        u.tipoUnidadeNome.includes('Criatório')
    );
  }, []);

  // Filtros TL001
  const [busca, setBusca] = useState('');
  const [filtroUnidade, setFiltroUnidade] = useState<string>('todos');
  const [filtroTipoRecinto, setFiltroTipoRecinto] = useState<string>('todos');
  const [filtroSituacaoOp, setFiltroSituacaoOp] = useState<string>('todos');
  const [filtroEstadoSanitario, setFiltroEstadoSanitario] = useState<string>('todos');

  // Drawer Nível 1
  const [drawerRecinto, setDrawerRecinto] = useState<RecintoItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // ESTADO DO FORMULÁRIO TL002 (NOVO / EDITAR)
  // Regras de Ouro DR005:
  // - "Capacidade" e "Espécies Permitidas" são OBRIGATÓRIAS SOMENTE se Unidade for Zoológico
  // - Ocupação e Situação Operacional calculadas (somente leitura)
  // - Campo "Manutenção" removido; reformas/obras registradas em "Observação"
  // - Código gerado REC-NNNN somente leitura
  // -------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campos
  const [formCodigo, setFormCodigo] = useState('REC-0006');
  const [formNomeLocal, setFormNomeLocal] = useState('');
  const [formUnidadeId, setFormUnidadeId] = useState(unidadesComRecinto[0]?.id || '');
  const [formTipoRecinto, setFormTipoRecinto] = useState<'Quarentena' | 'Triagem' | 'Reabilitação' | 'Berçário' | 'Recinto de Exposição' | 'Clínica Veterinária'>('Quarentena');
  const [formAreaM2, setFormAreaM2] = useState<number>(30.0);
  const [formCapacidade, setFormCapacidade] = useState<number>(10);
  const [formEspeciesPermitidas, setFormEspeciesPermitidas] = useState<string[]>([]);
  const [formPossuiRestricao, setFormPossuiRestricao] = useState(false);
  const [formEstadoSanitario, setFormEstadoSanitario] = useState<EstadoSanitarioRecinto>('Adequado');
  const [formOcupacaoAtual, setFormOcupacaoAtual] = useState<number>(0);
  const [formObservacao, setFormObservacao] = useState('');
  const [formSituacao, setFormSituacao] = useState<'Ativo' | 'Inativo'>('Ativo');

  // Erros
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Unidade selecionada atualmente
  const unidadeSelecionada = useMemo(() => {
    return unidadesComRecinto.find((u) => u.id === formUnidadeId);
  }, [unidadesComRecinto, formUnidadeId]);

  // Regra de Ouro: Identificar se é Zoológico
  const isZoologico = unidadeSelecionada?.tipoUnidadeNome.toLowerCase().includes('zoológico') || false;

  // Cálculo da Situação Operacional derivada (somente leitura)
  const situacaoOperacionalCalculada: SituacaoOperacionalRecinto = useMemo(() => {
    if (formEstadoSanitario === 'Contaminado' || formEstadoSanitario === 'Em Desinfecção') {
      return 'Indisponível';
    }
    if (formCapacidade > 0) {
      const taxa = formOcupacaoAtual / formCapacidade;
      if (taxa >= 1) return 'Lotado';
      if (taxa >= 0.8) return 'Quase Lotado';
    }
    return 'Disponível';
  }, [formOcupacaoAtual, formCapacidade, formEstadoSanitario]);

  // Iniciar criação
  const handleNovoRegistro = () => {
    setIsEditing(false);
    setEditingId(null);
    const proximoNum = recintos.length + 1;
    setFormCodigo(`REC-${proximoNum.toString().padStart(4, '0')}`);
    setFormNomeLocal('');
    setFormUnidadeId(unidadesComRecinto[0]?.id || '');
    setFormTipoRecinto('Quarentena');
    setFormAreaM2(35.0);
    setFormCapacidade(15);
    setFormEspeciesPermitidas([]);
    setFormPossuiRestricao(false);
    setFormEstadoSanitario('Adequado');
    setFormOcupacaoAtual(0);
    setFormObservacao('');
    setFormSituacao('Ativo');
    setFormErrors({});
    setViewMode('formulario');
  };

  // Iniciar edição
  const handleEditarRegistro = (r: RecintoItem) => {
    setIsEditing(true);
    setEditingId(r.id);
    setFormCodigo(r.codigo);
    setFormNomeLocal(r.nomeLocal);
    setFormUnidadeId(r.unidadeId);
    setFormTipoRecinto(r.tipoRecinto);
    setFormAreaM2(r.areaM2);
    setFormCapacidade(r.capacidade);
    setFormEspeciesPermitidas(r.especiesPermitidas || []);
    setFormPossuiRestricao(r.possuiRestricao);
    setFormEstadoSanitario(r.estadoSanitario);
    setFormOcupacaoAtual(r.ocupacaoAtual);
    setFormObservacao(r.observacao || '');
    setFormSituacao(r.situacao);
    setFormErrors({});
    if (drawerRecinto) setDrawerRecinto(null);
    setViewMode('formulario');
  };

  // Alternar situação
  const handleAlternarSituacao = (id: string) => {
    setRecintos((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nova = r.situacao === 'Ativo' ? 'Inativo' : 'Ativo';
          showToast(`Situação de "${r.nomeLocal}" alterada para ${nova}.`);
          return { ...r, situacao: nova };
        }
        return r;
      })
    );
  };

  // Toggle espécie permitida
  const handleToggleEspecie = (espId: string) => {
    setFormEspeciesPermitidas((prev) =>
      prev.includes(espId) ? prev.filter((id) => id !== espId) : [...prev, espId]
    );
  };

  // Validação estrita DR005
  const validarFormulario = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formNomeLocal.trim()) errors.formNomeLocal = 'Informe o nome local do recinto na unidade.';
    if (!formUnidadeId) errors.formUnidadeId = 'Selecione a unidade do recinto.';

    // Área Física é opcional; se preenchida, deve ser positiva
    if (formAreaM2 !== undefined && formAreaM2 !== null && formAreaM2 < 0) {
      errors.formAreaM2 = 'A área física em m² não pode ser negativa.';
    }

    // Se Zoológico, Capacidade e Espécies são OBRIGATÓRIAS
    if (isZoologico) {
      if (!formCapacidade || formCapacidade <= 0) {
        errors.formCapacidade = 'Para Zoológicos, a capacidade máxima é obrigatória.';
      }
      if (formEspeciesPermitidas.length === 0) {
        errors.formEspecies = 'Para Zoológicos, a definição de espécies permitidas é obrigatória.';
      }
    }

    // Bloqueio de redução de capacidade abaixo da ocupação atual (se houver ocupação)
    if (isEditing && formCapacidade > 0 && formCapacidade < formOcupacaoAtual) {
      errors.formCapacidade = `A capacidade (${formCapacidade}) não pode ser inferior à ocupação atual (${formOcupacaoAtual} animais).`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Salvar
  const handleSalvar = () => {
    if (!validarFormulario()) {
      showToast('Preencha os campos obrigatórios para salvar o recinto.');
      return;
    }

    const unidade = MOCK_UNIDADES.find((u) => u.id === formUnidadeId);
    const unidadeNome = unidade ? unidade.nome : 'Unidade';

    if (isEditing && editingId) {
      setRecintos((prev) =>
        prev.map((r) => {
          if (r.id === editingId) {
            return {
              ...r,
              nomeLocal: formNomeLocal.trim(),
              unidadeId: formUnidadeId,
              unidadeNome,
              tipoRecinto: formTipoRecinto,
              areaM2: formAreaM2,
              capacidade: formCapacidade,
              especiesPermitidas: formEspeciesPermitidas.length > 0 ? formEspeciesPermitidas : undefined,
              possuiRestricao: formPossuiRestricao,
              estadoSanitario: formEstadoSanitario,
              situacaoOperacional: situacaoOperacionalCalculada,
              observacao: formObservacao.trim() || undefined,
              situacao: formSituacao,
            };
          }
          return r;
        })
      );
      showToast(`Recinto "${formNomeLocal}" atualizado com sucesso!`);
    } else {
      const novo: RecintoItem = {
        id: `rec-${Date.now().toString().slice(-4)}`,
        codigo: formCodigo,
        nomeLocal: formNomeLocal.trim(),
        unidadeId: formUnidadeId,
        unidadeNome,
        tipoRecinto: formTipoRecinto,
        areaM2: formAreaM2,
        capacidade: formCapacidade,
        especiesPermitidas: formEspeciesPermitidas.length > 0 ? formEspeciesPermitidas : undefined,
        possuiRestricao: formPossuiRestricao,
        estadoSanitario: formEstadoSanitario,
        ocupacaoAtual: 0,
        situacaoOperacional: situacaoOperacionalCalculada,
        observacao: formObservacao.trim() || undefined,
        situacao: formSituacao,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
      };
      setRecintos((prev) => [novo, ...prev]);
      showToast(`Recinto "${formNomeLocal}" cadastrado com sucesso!`);
    }

    setViewMode('listagem');
  };

  // Filtros aplicados
  const recintosFiltrados = useMemo(() => {
    return recintos.filter((r) => {
      const matchBusca =
        !busca.trim() ||
        r.nomeLocal.toLowerCase().includes(busca.toLowerCase()) ||
        r.codigo.toLowerCase().includes(busca.toLowerCase()) ||
        r.unidadeNome.toLowerCase().includes(busca.toLowerCase());

      const matchUnidade = filtroUnidade === 'todos' || r.unidadeId === filtroUnidade;
      const matchTipo = filtroTipoRecinto === 'todos' || r.tipoRecinto === filtroTipoRecinto;
      const matchSituacaoOp = filtroSituacaoOp === 'todos' || r.situacaoOperacional === filtroSituacaoOp;
      const matchEstadoSan = filtroEstadoSanitario === 'todos' || r.estadoSanitario === filtroEstadoSanitario;

      return matchBusca && matchUnidade && matchTipo && matchSituacaoOp && matchEstadoSan;
    });
  }, [recintos, busca, filtroUnidade, filtroTipoRecinto, filtroSituacaoOp, filtroEstadoSanitario]);

  const activeFilterCount =
    (filtroUnidade !== 'todos' ? 1 : 0) +
    (filtroTipoRecinto !== 'todos' ? 1 : 0) +
    (filtroSituacaoOp !== 'todos' ? 1 : 0) +
    (filtroEstadoSanitario !== 'todos' ? 1 : 0);

  const handleLimparFiltros = () => {
    setBusca('');
    setFiltroUnidade('todos');
    setFiltroTipoRecinto('todos');
    setFiltroSituacaoOp('todos');
    setFiltroEstadoSanitario('todos');
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
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Recintos e Áreas
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Cadastro de recintos, gaiolões, viveiros e áreas de quarentena das unidades do INEMA e zoológicos.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                onClick={handleNovoRegistro}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs text-xs sm:text-sm h-9 px-4 font-semibold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Novo Recinto/Área
              </Button>
            </div>
          </div>

          {/* Tabela de Recintos */}
          <TableContainer
            toolbar={
              <TableToolbar
                searchPlaceholder="Buscar por código REC, nome do recinto ou unidade..."
                searchValue={busca}
                onSearchChange={setBusca}
                activeFilterCount={activeFilterCount}
                filters={
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200/80">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Unidade</label>
                      <select
                        value={filtroUnidade}
                        onChange={(e) => setFiltroUnidade(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todas as Unidades</option>
                        {unidadesComRecinto.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tipo de Recinto</label>
                      <select
                        value={filtroTipoRecinto}
                        onChange={(e) => setFiltroTipoRecinto(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todos os Tipos</option>
                        {TIPOS_RECINTO_OPCOES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Situação Operacional</label>
                      <select
                        value={filtroSituacaoOp}
                        onChange={(e) => setFiltroSituacaoOp(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todas as Situações</option>
                        <option value="Disponível">Disponível</option>
                        <option value="Quase Lotado">Quase Lotado</option>
                        <option value="Lotado">Lotado</option>
                        <option value="Indisponível">Indisponível</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Estado Sanitário</label>
                      <select
                        value={filtroEstadoSanitario}
                        onChange={(e) => setFiltroEstadoSanitario(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todos os Estados</option>
                        {ESTADOS_SANITARIOS_OPCOES.map((es) => (
                          <option key={es} value={es}>
                            {es}
                          </option>
                        ))}
                      </select>
                    </div>

                    {activeFilterCount > 0 && (
                      <div className="sm:col-span-4 flex justify-end">
                        <Button variant="ghost" size="xs" onClick={handleLimparFiltros} className="text-xs text-slate-600">
                          Limpar Filtros ({activeFilterCount})
                        </Button>
                      </div>
                    )}
                  </div>
                }
                actions={
                  <div className="text-xs text-slate-500 font-medium">
                    Exibindo <span className="font-bold text-slate-800">{recintosFiltrados.length}</span> de {recintos.length} recintos
                  </div>
                }
              />
            }
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold select-none">
                  <th className="py-2.5 px-4">Código</th>
                  <th className="py-2.5 px-4">Nome Local</th>
                  <th className="py-2.5 px-4">Unidade</th>
                  <th className="py-2.5 px-3">Tipo de Recinto</th>
                  <th className="py-2.5 px-3 text-center">Ocupação / Cap.</th>
                  <th className="py-2.5 px-3">Situação Operacional</th>
                  <th className="py-2.5 px-3">Situação</th>
                  <th className="py-2.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recintosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Info className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-semibold text-slate-700">Nenhum recinto encontrado</p>
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
                  recintosFiltrados.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                      {/* Código */}
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-800">
                        {rec.codigo}
                      </td>

                      {/* Nome Local */}
                      <td className="py-2.5 px-4 font-semibold text-slate-900">
                        {rec.nomeLocal}
                      </td>

                      {/* Unidade */}
                      <td className="py-2.5 px-4 text-slate-600">
                        {rec.unidadeNome}
                      </td>

                      {/* Tipo */}
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-slate-700">{rec.tipoRecinto}</span>
                      </td>

                      {/* Ocupação / Capacidade */}
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-mono font-semibold text-slate-800">
                          {rec.ocupacaoAtual} / {rec.capacidade > 0 ? rec.capacidade : '—'}
                        </span>
                      </td>

                      {/* Situação Operacional */}
                      <td className="py-2.5 px-3">
                        <Badge
                          color={
                            rec.situacaoOperacional === 'Disponível'
                              ? 'success'
                              : rec.situacaoOperacional === 'Quase Lotado'
                              ? 'warning'
                              : rec.situacaoOperacional === 'Lotado'
                              ? 'danger'
                              : 'gray'
                          }
                          size="xs"
                        >
                          {rec.situacaoOperacional}
                        </Badge>
                      </td>

                      {/* Situação */}
                      <td className="py-2.5 px-3">
                        <Badge color={rec.situacao === 'Ativo' ? 'success' : 'gray'} size="sm" dot>
                          {rec.situacao}
                        </Badge>
                      </td>

                      {/* Ações */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDrawerRecinto(rec)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Visualizar detalhes do recinto"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditarRegistro(rec)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Editar recinto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAlternarSituacao(rec.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title={rec.situacao === 'Ativo' ? 'Inativar' : 'Ativar'}
                          >
                            {rec.situacao === 'Ativo' ? (
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
                Salvar Recinto
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Editar: ${formNomeLocal} (${formCodigo})` : 'Novo Recinto ou Área de Fauna'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cadastre as especificações estruturais, sanitárias e limitações zoológicas do recinto da unidade.
            </p>
          </div>

          {/* SEÇÃO 1: Identificação e Unidade */}
          <Section
            title="1. Identificação Física e Lotação Estrutural"
            description="Código oficial do sistema, identificação local e associação à unidade."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Código */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código do Recinto (Sistema)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formCodigo}
                    className="w-full h-9 text-xs font-mono font-bold bg-slate-100 border border-slate-200 rounded-lg px-2.5 text-slate-700 cursor-not-allowed"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Gerado automaticamente pelo sistema.</span>
                </div>

                {/* Nome Local */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Local / Identificação Física <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={formNomeLocal}
                    onChange={(e) => setFormNomeLocal(e.target.value)}
                    placeholder="ex: Gaiolão de Psittaciformes 01 ou Recinto de Felinos"
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formNomeLocal ? 'border-rose-400' : 'border-slate-300'
                    )}
                  />
                  {formErrors.formNomeLocal && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formNomeLocal}</span>
                  )}
                </div>

                {/* Unidade */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unidade do Recinto <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formUnidadeId}
                    onChange={(e) => setFormUnidadeId(e.target.value)}
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  >
                    {unidadesComRecinto.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} ({u.tipoUnidadeNome})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Recinto */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Recinto <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formTipoRecinto}
                    onChange={(e) => setFormTipoRecinto(e.target.value as any)}
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  >
                    {TIPOS_RECINTO_OPCOES.map((tr) => (
                      <option key={tr} value={tr}>
                        {tr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 2: Dimensões, Capacidade e Espécies Permitidas */}
          <Section
            title="2. Dimensões Físicas e Capacidade"
            description="Dimensões estruturais e parâmetros de lotação do recinto."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Área m² */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Área Física (m²)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={formAreaM2}
                      onChange={(e) => setFormAreaM2(parseFloat(e.target.value) || 0)}
                      className={cn(
                        'w-full h-9 text-xs bg-white border rounded-lg px-2.5 pr-10 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                        formErrors.formAreaM2 ? 'border-rose-400' : 'border-slate-300'
                      )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                      m²
                    </span>
                  </div>
                  {formErrors.formAreaM2 && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formAreaM2}</span>
                  )}
                </div>

                {/* Capacidade */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Capacidade Máxima {isZoologico && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formCapacidade}
                    onChange={(e) => setFormCapacidade(parseInt(e.target.value) || 0)}
                    placeholder={isZoologico ? 'Obrigatório para Zoológico' : 'Opcional'}
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formCapacidade ? 'border-rose-400' : 'border-slate-300'
                    )}
                  />
                  {formErrors.formCapacidade && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formCapacidade}</span>
                  )}
                </div>

                {/* Ocupação Atual (Calculada e Readonly) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ocupação Atual <span className="text-slate-400 font-normal">(Somente Leitura)</span>
                  </label>
                  <div className="h-9 px-3 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-slate-800">
                      {formOcupacaoAtual} animais
                    </span>
                    {formCapacidade > 0 && (
                      <span className="text-[11px] text-slate-500 font-medium">
                        {Math.round((formOcupacaoAtual / formCapacidade) * 100)}%
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Calculada pelos animais alocados no recinto.
                  </span>
                </div>

                {/* Situação Operacional (Calculada e Readonly) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Situação Operacional <span className="text-slate-400 font-normal">(Somente Leitura)</span>
                  </label>
                  <div className="h-9 px-3 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">{situacaoOperacionalCalculada}</span>
                    <Badge
                      color={
                        situacaoOperacionalCalculada === 'Disponível'
                          ? 'success'
                          : situacaoOperacionalCalculada === 'Quase Lotado'
                          ? 'warning'
                          : situacaoOperacionalCalculada === 'Lotado'
                          ? 'danger'
                          : 'gray'
                      }
                      size="xs"
                    >
                      {situacaoOperacionalCalculada}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Calculada automaticamente por ocupação e estado sanitário.
                  </span>
                </div>
              </div>

              {/* Espécies Permitidas */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Espécies Permitidas {isZoologico && <span className="text-rose-500">* (Obrigatório para Zoológico)</span>}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Selecione as espécies que podem habitar este recinto
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 max-h-48 overflow-y-auto">
                  {MOCK_ESPECIES.map((esp) => (
                    <label
                      key={esp.id}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded hover:bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={formEspeciesPermitidas.includes(esp.id)}
                        onChange={() => handleToggleEspecie(esp.id)}
                        className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                      <div className="truncate">
                        <span className="italic font-medium">{esp.nomeCientifico}</span>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {esp.nomesPopulares[0]?.nome}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                {formErrors.formEspecies && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formEspecies}</span>
                )}
              </div>
            </div>
          </Section>

          {/* SEÇÃO 3: Estado Sanitário e Observação */}
          <Section
            title="3. Estado Sanitário e Observação"
            description="Condição sanitária e anotações técnicas do recinto."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Estado Sanitário */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estado Sanitário do Recinto <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formEstadoSanitario}
                    onChange={(e) => setFormEstadoSanitario(e.target.value as EstadoSanitarioRecinto)}
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  >
                    {ESTADOS_SANITARIOS_OPCOES.map((es) => (
                      <option key={es} value={es}>
                        {es}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Possui Restrição? */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Possui restrição?</span>
                    <span className="text-[11px] text-slate-500">
                      Indica barreiras especiais ou necessidade de contenção reforçada.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormPossuiRestricao((prev) => !prev)}
                    className="cursor-pointer"
                  >
                    {formPossuiRestricao ? (
                      <ToggleRight className="w-6 h-6 text-[#0F4C3A]" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Observação */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Observação
                  </label>
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={formObservacao}
                    onChange={(e) => setFormObservacao(e.target.value)}
                    placeholder="Anotações técnicas, histórico estrutural ou detalhes sanitários do recinto..."
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 4: Situação Cadastral */}
          <Section
            title="4. Situação Cadastral"
            description="Controle de ativação do recinto para alocações no sistema."
          >
            <div className="pt-2 flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Recinto Ativo</span>
                <span className="text-[11px] text-slate-500">
                  Recintos inativos não aparecem na listagem de alocação de animais.
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
              Salvar Recinto
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GAVETA DE DETALHES (DRAWER NÍVEL 1) */}
      {/* ========================================================= */}
      {drawerRecinto && (
        <GlaDrawer
          isOpen={true}
          onClose={() => setDrawerRecinto(null)}
          title={drawerRecinto.nomeLocal}
          subtitle={`${drawerRecinto.codigo} · ${drawerRecinto.unidadeNome}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setDrawerRecinto(null)} className="text-xs">
                Fechar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleEditarRegistro(drawerRecinto)}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Editar Recinto
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-xs text-slate-700">
            {/* Badges Principais */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100">
              <Badge color={drawerRecinto.situacao === 'Ativo' ? 'success' : 'gray'} dot size="sm">
                {drawerRecinto.situacao}
              </Badge>
              <Badge
                color={
                  drawerRecinto.situacaoOperacional === 'Disponível'
                    ? 'success'
                    : drawerRecinto.situacaoOperacional === 'Quase Lotado'
                    ? 'warning'
                    : drawerRecinto.situacaoOperacional === 'Lotado'
                    ? 'danger'
                    : 'gray'
                }
                size="sm"
              >
                {drawerRecinto.situacaoOperacional}
              </Badge>
              <Badge
                color={
                  drawerRecinto.estadoSanitario === 'Adequado'
                    ? 'success'
                    : drawerRecinto.estadoSanitario === 'Em Desinfecção'
                    ? 'info'
                    : drawerRecinto.estadoSanitario === 'Quarentena Sanitária'
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
                dot
              >
                {drawerRecinto.estadoSanitario}
              </Badge>
            </div>

            {/* Informações Físicas */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Dimensões & Lotação
              </h4>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[11px] block">Tipo de Recinto</span>
                  <span className="font-semibold text-slate-800">{drawerRecinto.tipoRecinto}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Área Total</span>
                  <span className="font-semibold font-mono text-slate-800">{drawerRecinto.areaM2} m²</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Ocupação Atual</span>
                  <span className="font-semibold font-mono text-slate-800">
                    {drawerRecinto.ocupacaoAtual} animais
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Capacidade Máxima</span>
                  <span className="font-semibold font-mono text-slate-800">
                    {drawerRecinto.capacidade > 0 ? `${drawerRecinto.capacidade} animais` : 'Livre'}
                  </span>
                </div>
              </div>
            </div>

            {/* Espécies Permitidas */}
            {drawerRecinto.especiesPermitidas && drawerRecinto.especiesPermitidas.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Espécies Permitidas
                </h4>
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {drawerRecinto.especiesPermitidas.map((espId) => {
                    const esp = MOCK_ESPECIES.find((e) => e.id === espId);
                    return (
                      <div key={espId} className="text-slate-800">
                        • <span className="italic font-medium">{esp ? esp.nomeCientifico : espId}</span> (
                        {esp ? esp.nomesPopulares[0]?.nome : ''})
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Observações */}
            {drawerRecinto.observacao && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Observações
                </h4>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700 leading-relaxed">
                  {drawerRecinto.observacao}
                </p>
              </div>
            )}

            <div className="pt-2 text-[11px] text-slate-400">
              Cadastrado em: {drawerRecinto.dataCadastro}
            </div>
          </div>
        </GlaDrawer>
      )}
    </div>
  );
};
