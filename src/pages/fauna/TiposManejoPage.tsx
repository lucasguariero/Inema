import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  FileText,
  FileSignature,
  FileCheck,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  ListOrdered,
  PlusCircle,
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
  MOCK_TIPOS_MANEJO,
  MOCK_DOCUMENTOS_TERMOS,
  TipoManejoItem,
  CampoAdicionalManejo,
} from '@/data/faunaMock';

const TIPOS_DADO_OPCOES = ['Texto', 'Numérico', 'Data', 'Seleção', 'Booleano'] as const;

interface TiposManejoPageProps {
  onNavigate?: (route: string) => void;
}

export const TiposManejoPage: React.FC<TiposManejoPageProps> = ({ onNavigate }) => {
  // Estado de navegação: 'listagem' (TL001) | 'formulario' (TL002)
  const [viewMode, setViewMode] = useState<'listagem' | 'formulario'>('listagem');

  // Base de dados local
  const [manejos, setManejos] = useState<TipoManejoItem[]>(MOCK_TIPOS_MANEJO);

  // Filtros TL001
  const [busca, setBusca] = useState('');
  const [filtroMultiplos, setFiltroMultiplos] = useState<string>('todos');
  const [filtroAnexo, setFiltroAnexo] = useState<string>('todos');
  const [filtroTermo, setFiltroTermo] = useState<string>('todos');
  const [filtroSituacao, setFiltroSituacao] = useState<string>('todos');

  // Drawer Nível 1
  const [drawerManejo, setDrawerManejo] = useState<TipoManejoItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // ESTADO DO FORMULÁRIO TL002 (NOVO / EDITAR)
  // Regra de Ouro DR006:
  // - "Exige anexo", "Exige termo" e "Permite múltiplos animais"
  //   vêm DESLIGADAS por padrão (default false)
  // - Tabela editável de Campos Adicionais
  // -------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campos
  const [formNome, setFormNome] = useState('');
  const [formDescricao, setFormDescricao] = useState('');

  // Regra de Ouro: Padrão false para os 3 toggles
  const [formPermiteMultiplos, setFormPermiteMultiplos] = useState(false);
  const [formExigeAnexo, setFormExigeAnexo] = useState(false);
  const [formDocumentosExigidos, setFormDocumentosExigidos] = useState<string[]>([]);
  const [formExigeTermo, setFormExigeTermo] = useState(false);
  const [formTermoExigidoId, setFormTermoExigidoId] = useState('');

  // Tabela Editável de Campos Adicionais
  const [formCamposAdicionais, setFormCamposAdicionais] = useState<CampoAdicionalManejo[]>([]);

  // Situação
  const [formSituacao, setFormSituacao] = useState<'Ativo' | 'Inativo'>('Ativo');

  // Erros
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Lista de termos emitidos disponíveis (DR007)
  const termosEmitidosDisponiveis = useMemo(() => {
    return MOCK_DOCUMENTOS_TERMOS.filter((d) => d.natureza === 'Termo emitido');
  }, []);

  // Iniciar inclusão
  const handleNovoRegistro = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormNome('');
    setFormDescricao('');
    // Padrão DESLIGADO conforme Regra de Ouro
    setFormPermiteMultiplos(false);
    setFormExigeAnexo(false);
    setFormDocumentosExigidos([]);
    setFormExigeTermo(false);
    setFormTermoExigidoId('');
    setFormCamposAdicionais([]);
    setFormSituacao('Ativo');
    setFormErrors({});
    setViewMode('formulario');
  };

  // Iniciar edição
  const handleEditarRegistro = (m: TipoManejoItem) => {
    setIsEditing(true);
    setEditingId(m.id);
    setFormNome(m.nome);
    setFormDescricao(m.descricao || '');
    setFormPermiteMultiplos(m.permiteMultiplosAnimais);
    setFormExigeAnexo(m.exigeAnexo);
    setFormDocumentosExigidos(m.documentosExigidos || []);
    setFormExigeTermo(m.exigeTermo);
    setFormTermoExigidoId(m.termoExigidoId || '');
    setFormCamposAdicionais([...m.camposAdicionais]);
    setFormSituacao(m.situacao);
    setFormErrors({});
    if (drawerManejo) setDrawerManejo(null);
    setViewMode('formulario');
  };

  // Alternar situação
  const handleAlternarSituacao = (id: string) => {
    setManejos((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nova = m.situacao === 'Ativo' ? 'Inativo' : 'Ativo';
          showToast(`Situação do manejo "${m.nome}" alterada para ${nova}.`);
          return { ...m, situacao: nova };
        }
        return m;
      })
    );
  };

  // Manipulação da Tabela de Campos Adicionais
  const handleAdicionarCampoAdicional = () => {
    const novoCampo: CampoAdicionalManejo = {
      id: `ca-${Date.now().toString().slice(-4)}`,
      nome: '',
      tipoDado: 'Texto',
      unidadeMedida: '',
      obrigatorio: false,
      ordemExibicao: formCamposAdicionais.length + 1,
    };
    setFormCamposAdicionais((prev) => [...prev, novoCampo]);
  };

  const handleRemoverCampoAdicional = (id: string) => {
    setFormCamposAdicionais((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAtualizarCampo = (
    id: string,
    field: keyof CampoAdicionalManejo,
    value: any
  ) => {
    setFormCamposAdicionais((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Toggle documento exigido
  const handleToggleDocExigido = (docId: string) => {
    setFormDocumentosExigidos((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  // Validação
  const validarFormulario = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formNome.trim()) errors.formNome = 'Informe o nome do tipo de manejo (até 100 caracteres).';
    if (formExigeAnexo && formDocumentosExigidos.length === 0) {
      errors.formDocumentos = 'Selecione ao menos um documento quando a exigência de anexo estiver ativa.';
    }
    if (formExigeTermo && !formTermoExigidoId) {
      errors.formTermo = 'Selecione o termo emitido obrigatório.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Salvar
  const handleSalvar = () => {
    if (!validarFormulario()) {
      showToast('Preencha os campos obrigatórios para salvar o manejo.');
      return;
    }

    const termo = termosEmitidosDisponiveis.find((t) => t.id === formTermoExigidoId);

    if (isEditing && editingId) {
      setManejos((prev) =>
        prev.map((m) => {
          if (m.id === editingId) {
            return {
              ...m,
              nome: formNome.trim(),
              descricao: formDescricao.trim() || undefined,
              permiteMultiplosAnimais: formPermiteMultiplos,
              exigeAnexo: formExigeAnexo,
              documentosExigidos: formExigeAnexo ? formDocumentosExigidos : undefined,
              exigeTermo: formExigeTermo,
              termoExigidoId: formExigeTermo ? formTermoExigidoId : undefined,
              termoExigidoNome: formExigeTermo ? termo?.nome : undefined,
              camposAdicionais: formCamposAdicionais.filter((c) => c.nome.trim().length > 0),
              situacao: formSituacao,
            };
          }
          return m;
        })
      );
      showToast(`Manejo "${formNome}" atualizado com sucesso!`);
    } else {
      const novo: TipoManejoItem = {
        id: `man-${Date.now().toString().slice(-4)}`,
        nome: formNome.trim(),
        descricao: formDescricao.trim() || undefined,
        permiteMultiplosAnimais: formPermiteMultiplos,
        exigeAnexo: formExigeAnexo,
        documentosExigidos: formExigeAnexo ? formDocumentosExigidos : undefined,
        exigeTermo: formExigeTermo,
        termoExigidoId: formExigeTermo ? formTermoExigidoId : undefined,
        termoExigidoNome: formExigeTermo ? termo?.nome : undefined,
        camposAdicionais: formCamposAdicionais.filter((c) => c.nome.trim().length > 0),
        situacao: formSituacao,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
      };
      setManejos((prev) => [novo, ...prev]);
      showToast(`Manejo "${formNome}" cadastrado com sucesso!`);
    }

    setViewMode('listagem');
  };

  // Filtros aplicados
  const manejosFiltrados = useMemo(() => {
    return manejos.filter((m) => {
      const matchBusca =
        !busca.trim() ||
        m.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (m.descricao && m.descricao.toLowerCase().includes(busca.toLowerCase()));

      const matchMultiplos =
        filtroMultiplos === 'todos' ||
        (filtroMultiplos === 'sim' && m.permiteMultiplosAnimais) ||
        (filtroMultiplos === 'nao' && !m.permiteMultiplosAnimais);

      const matchAnexo =
        filtroAnexo === 'todos' ||
        (filtroAnexo === 'sim' && m.exigeAnexo) ||
        (filtroAnexo === 'nao' && !m.exigeAnexo);

      const matchTermo =
        filtroTermo === 'todos' ||
        (filtroTermo === 'sim' && m.exigeTermo) ||
        (filtroTermo === 'nao' && !m.exigeTermo);

      const matchSituacao = filtroSituacao === 'todos' || m.situacao === filtroSituacao;

      return matchBusca && matchMultiplos && matchAnexo && matchTermo && matchSituacao;
    });
  }, [manejos, busca, filtroMultiplos, filtroAnexo, filtroTermo, filtroSituacao]);

  const activeFilterCount =
    (filtroMultiplos !== 'todos' ? 1 : 0) +
    (filtroAnexo !== 'todos' ? 1 : 0) +
    (filtroTermo !== 'todos' ? 1 : 0) +
    (filtroSituacao !== 'todos' ? 1 : 0);

  const handleLimparFiltros = () => {
    setBusca('');
    setFiltroMultiplos('todos');
    setFiltroAnexo('todos');
    setFiltroTermo('todos');
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
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Tipos de Manejo
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Cadastro dos protocolos de manejo clínico, biométrico, anilhamento, transferência e soltura de fauna.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                onClick={handleNovoRegistro}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs text-xs sm:text-sm h-9 px-4 font-semibold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Novo Tipo de Manejo
              </Button>
            </div>
          </div>

          {/* Tabela de Manejos */}
          <TableContainer
            toolbar={
              <TableToolbar
                searchPlaceholder="Buscar por tipo de manejo ou descrição..."
                searchValue={busca}
                onSearchChange={setBusca}
                activeFilterCount={activeFilterCount}
                filters={
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200/80">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Múltiplos Animais?</label>
                      <select
                        value={filtroMultiplos}
                        onChange={(e) => setFiltroMultiplos(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todos</option>
                        <option value="sim">Sim (Lote)</option>
                        <option value="nao">Não (Individual)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Exige Anexo?</label>
                      <select
                        value={filtroAnexo}
                        onChange={(e) => setFiltroAnexo(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todos</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Exige Termo?</label>
                      <select
                        value={filtroTermo}
                        onChange={(e) => setFiltroTermo(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todos</option>
                        <option value="sim">Sim</option>
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
                    Exibindo <span className="font-bold text-slate-800">{manejosFiltrados.length}</span> de {manejos.length} protocolos
                  </div>
                }
              />
            }
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold select-none">
                  <th className="py-2.5 px-4">Tipo de Manejo</th>
                  <th className="py-2.5 px-3 text-center">Múltiplos Animais?</th>
                  <th className="py-2.5 px-3 text-center">Exige Anexo?</th>
                  <th className="py-2.5 px-3 text-center">Exige Termo?</th>
                  <th className="py-2.5 px-3">Situação</th>
                  <th className="py-2.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {manejosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Info className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-semibold text-slate-700">Nenhum tipo de manejo encontrado</p>
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
                  manejosFiltrados.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                      {/* Nome */}
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-slate-900 block">{m.nome}</span>
                        {m.descricao && (
                          <span className="text-[11px] text-slate-400 truncate block max-w-sm">
                            {m.descricao}
                          </span>
                        )}
                      </td>

                      {/* Múltiplos */}
                      <td className="py-2.5 px-3 text-center">
                        {m.permiteMultiplosAnimais ? (
                          <Badge color="success" size="xs">
                            Sim
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Não</span>
                        )}
                      </td>

                      {/* Exige Anexo */}
                      <td className="py-2.5 px-3 text-center">
                        {m.exigeAnexo ? (
                          <Badge color="warning" size="xs">
                            Sim
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Não</span>
                        )}
                      </td>

                      {/* Exige Termo */}
                      <td className="py-2.5 px-3 text-center">
                        {m.exigeTermo ? (
                          <Badge color="primary" size="xs">
                            Sim
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Não</span>
                        )}
                      </td>

                      {/* Situação */}
                      <td className="py-2.5 px-3">
                        <Badge color={m.situacao === 'Ativo' ? 'success' : 'gray'} size="sm" dot>
                          {m.situacao}
                        </Badge>
                      </td>

                      {/* Ações */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDrawerManejo(m)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Visualizar detalhes do manejo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditarRegistro(m)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Editar manejo"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAlternarSituacao(m.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title={m.situacao === 'Ativo' ? 'Inativar' : 'Ativar'}
                          >
                            {m.situacao === 'Ativo' ? (
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
                Salvar Tipo de Manejo
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Editar: ${formNome}` : 'Novo Tipo de Manejo de Fauna'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Defina os parâmetros operacionais, regras de documentação e campos customizados do formulário de manejo.
            </p>
          </div>

          {/* SEÇÃO 1: Identificação */}
          <Section
            title="1. Identificação do Manejo"
            description="Nome único do protocolo e descrição técnica para os técnicos de campo."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome do Tipo de Manejo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="ex: Avaliação Clínica e Biométrica ou Soltura Monitorada"
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formNome ? 'border-rose-400' : 'border-slate-300'
                    )}
                  />
                  {formErrors.formNome && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formNome}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descrição e Finalidade
                  </label>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Descreva a finalidade clínica ou operacional do manejo..."
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 2: Regras Operacionais e Chaves */}
          <Section
            title="2. Regras Operacionais e Chaves"
            description="Habilite as chaves operacionais e vínculos documentais conforme a necessidade deste manejo."
          >
            <div className="space-y-4 pt-2">
              <div className="space-y-3">
                {/* 1. Permite Múltiplos Animais */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Permite Múltiplos Animais (Manejo em Lote)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Permite executar este protocolo de manejo para múltiplos animais simultaneamente.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormPermiteMultiplos((prev) => !prev)}
                    className="cursor-pointer"
                  >
                    {formPermiteMultiplos ? (
                      <ToggleRight className="w-6 h-6 text-[#0F4C3A]" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* 2. Exige Anexo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">Exige Anexo Documental</span>
                      <span className="text-[11px] text-slate-500">
                        Exige o upload de documentos comprobatórios ou laudos técnicos.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormExigeAnexo((prev) => !prev)}
                      className="cursor-pointer"
                    >
                      {formExigeAnexo ? (
                        <ToggleRight className="w-6 h-6 text-[#0F4C3A]" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {formExigeAnexo && (
                    <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Documentos Exigidos <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {MOCK_DOCUMENTOS_TERMOS.filter((d) => d.natureza === 'Documento anexado').map((doc) => (
                          <label
                            key={doc.id}
                            className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded hover:bg-white"
                          >
                            <input
                              type="checkbox"
                              checked={formDocumentosExigidos.includes(doc.id)}
                              onChange={() => handleToggleDocExigido(doc.id)}
                              className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                            />
                            <span className="truncate">{doc.nome}</span>
                          </label>
                        ))}
                      </div>
                      {formErrors.formDocumentos && (
                        <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formDocumentos}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Exige Termo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">
                        Exige Emissão de Termo Oficial
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Gera minuta e termo oficial para assinatura ao concluir o manejo.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormExigeTermo((prev) => !prev)}
                      className="cursor-pointer"
                    >
                      {formExigeTermo ? (
                        <ToggleRight className="w-6 h-6 text-[#0F4C3A]" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {formExigeTermo && (
                    <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Termo Emitido Obrigatório <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formTermoExigidoId}
                        onChange={(e) => setFormTermoExigidoId(e.target.value)}
                        className="w-full sm:w-80 h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800"
                      >
                        <option value="">Selecione o termo oficial...</option>
                        {termosEmitidosDisponiveis.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nome} ({t.versaoVigente})
                          </option>
                        ))}
                      </select>
                      {formErrors.formTermo && (
                        <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formTermo}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 3: Campos Customizados do Formulário (Tabela Editável) */}
          <Section
            title="3. Campos Customizados do Formulário de Manejo"
            description="Cadastre atributos clínicos, biométricos e operacionais específicos deste manejo."
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">
                  Atributos Dinâmicos ({formCamposAdicionais.length})
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAdicionarCampoAdicional}
                  className="text-xs h-8 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Adicionar Campo Adicional
                </Button>
              </div>

              {formCamposAdicionais.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300 space-y-2">
                  <ListOrdered className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">Nenhum campo customizado adicionado</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Caso este manejo colete dados específicos (ex.: peso, temperatura, escore, anilha), clique no botão acima para incluir campos dinâmicos.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                      <tr>
                        <th className="py-2.5 px-3">Nome do Campo</th>
                        <th className="py-2.5 px-3">Tipo de Dado</th>
                        <th className="py-2.5 px-3">Unidade de Medida</th>
                        <th className="py-2.5 px-2 text-center">Obrigatório?</th>
                        <th className="py-2.5 px-2 text-center">Ordem</th>
                        <th className="py-2.5 px-2 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formCamposAdicionais.map((campo, index) => (
                        <tr key={campo.id} className="hover:bg-slate-50/50">
                          {/* Nome do Campo */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={campo.nome}
                              onChange={(e) => handleAtualizarCampo(campo.id, 'nome', e.target.value)}
                              placeholder="ex: Peso Corporal"
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded px-2 text-slate-800"
                            />
                          </td>

                          {/* Tipo de Dado */}
                          <td className="py-2 px-3">
                            <select
                              value={campo.tipoDado}
                              onChange={(e) => handleAtualizarCampo(campo.id, 'tipoDado', e.target.value)}
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded px-2 text-slate-800"
                            >
                              {TIPOS_DADO_OPCOES.map((td) => (
                                <option key={td} value={td}>
                                  {td}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Unidade de Medida */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={campo.unidadeMedida || ''}
                              onChange={(e) => handleAtualizarCampo(campo.id, 'unidadeMedida', e.target.value)}
                              placeholder="ex: gramas, cm, doses"
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded px-2 text-slate-800"
                            />
                          </td>

                          {/* Obrigatório */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={campo.obrigatorio}
                              onChange={(e) => handleAtualizarCampo(campo.id, 'obrigatorio', e.target.checked)}
                              className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                            />
                          </td>

                          {/* Ordem */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min={1}
                              value={campo.ordemExibicao}
                              onChange={(e) =>
                                handleAtualizarCampo(campo.id, 'ordemExibicao', parseInt(e.target.value) || 1)
                              }
                              className="w-14 h-8 text-xs text-center bg-white border border-slate-300 rounded px-1 text-slate-800"
                            />
                          </td>

                          {/* Remover */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoverCampoAdicional(campo.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                              title="Remover campo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Section>

          {/* SEÇÃO 4: Situação Cadastral */}
          <Section
            title="4. Situação Cadastral"
            description="Controle de ativação do protocolo de manejo no sistema."
          >
            <div className="pt-2 flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Protocolo de Manejo Ativo</span>
                <span className="text-[11px] text-slate-500">
                  Manejos inativos não ficam disponíveis no prontuário ou eventos do animal.
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
              Salvar Tipo de Manejo
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GAVETA DE DETALHES (DRAWER NÍVEL 1) */}
      {/* ========================================================= */}
      {drawerManejo && (
        <GlaDrawer
          isOpen={true}
          onClose={() => setDrawerManejo(null)}
          title={drawerManejo.nome}
          subtitle={`Protocolo de Manejo · Cadastrado em ${drawerManejo.dataCadastro}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setDrawerManejo(null)} className="text-xs">
                Fechar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleEditarRegistro(drawerManejo)}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Editar Manejo
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-xs text-slate-700">
            {/* Badges Principais */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100">
              <Badge color={drawerManejo.situacao === 'Ativo' ? 'success' : 'gray'} dot size="sm">
                {drawerManejo.situacao}
              </Badge>
              {drawerManejo.permiteMultiplosAnimais && (
                <Badge color="success" size="sm">
                  Permite Manejo em Lote
                </Badge>
              )}
              {drawerManejo.exigeAnexo && (
                <Badge color="warning" size="sm">
                  Exige Anexo
                </Badge>
              )}
              {drawerManejo.exigeTermo && (
                <Badge color="primary" size="sm">
                  Exige Termo Oficial
                </Badge>
              )}
            </div>

            {/* Descrição */}
            {drawerManejo.descricao && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Finalidade do Protocolo
                </h4>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700 leading-relaxed">
                  {drawerManejo.descricao}
                </p>
              </div>
            )}

            {/* Termo Vinculado */}
            {drawerManejo.exigeTermo && drawerManejo.termoExigidoNome && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Termo Emitido Vinculado
                </h4>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2 text-slate-800 font-semibold">
                  <FileSignature className="w-4 h-4 text-[#0F4C3A]" />
                  <span>{drawerManejo.termoExigidoNome}</span>
                </div>
              </div>
            )}

            {/* Campos Adicionais */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Campos Customizados ({drawerManejo.camposAdicionais.length})
              </h4>
              {drawerManejo.camposAdicionais.length === 0 ? (
                <span className="text-slate-400">Nenhum campo customizado configurado.</span>
              ) : (
                <div className="space-y-1.5">
                  {drawerManejo.camposAdicionais.map((campo) => (
                    <div
                      key={campo.id}
                      className="p-2 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{campo.nome}</span>
                        {campo.unidadeMedida && (
                          <span className="text-[10px] text-slate-400">({campo.unidadeMedida})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">{campo.tipoDado}</span>
                        {campo.obrigatorio && (
                          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            OBG
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              Cadastrado em: {drawerManejo.dataCadastro}
            </div>
          </div>
        </GlaDrawer>
      )}
    </div>
  );
};
