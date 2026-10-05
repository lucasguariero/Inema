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
  Settings,
  Phone,
  Mail,
  MapPin,
  Building2,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { Section } from '@/components/filament/Section';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { GlaDrawer } from '@/components/gla/layout/GlaDrawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  MOCK_UNIDADES,
  MOCK_TIPOS_UNIDADE,
  UnidadeItem,
  TipoUnidadeItem,
  NaturezaUnidade,
} from '@/data/faunaMock';

const MUNICIPIOS_BAHIA = [
  'Salvador',
  'Feira de Santana',
  'Vitória da Conquista',
  'Porto Seguro',
  'Ilhéus',
  'Itabuna',
  'Camaçari',
  'Juazeiro',
  'Barreiras',
  'Jequié',
  'Alagoinhas',
  'Teixeira de Freitas',
  'Andaraí',
  'Lençóis',
  'Mucugê',
  'Valença',
  'Paulo Afonso',
  'Santo Antônio de Jesus',
  'Senhor do Bonfim',
  'Luís Eduardo Magalhães',
];

interface UnidadesDestinosPageProps {
  onNavigate?: (route: string) => void;
}

export const UnidadesDestinosPage: React.FC<UnidadesDestinosPageProps> = ({ onNavigate }) => {
  // Estado de navegação: 'listagem' (TL001) | 'formulario' (TL002)
  const [viewMode, setViewMode] = useState<'listagem' | 'formulario'>('listagem');

  // Base de dados local
  const [unidades, setUnidades] = useState<UnidadeItem[]>(MOCK_UNIDADES);
  const [tiposUnidade, setTiposUnidade] = useState<TipoUnidadeItem[]>(MOCK_TIPOS_UNIDADE);

  // Filtros da Listagem (TL001)
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroNatureza, setFiltroNatureza] = useState<string>('todos');
  const [filtroSituacao, setFiltroSituacao] = useState<string>('todos');

  // Gaveta de detalhes (Drawer Nível 1)
  const [drawerUnidade, setDrawerUnidade] = useState<UnidadeItem | null>(null);

  // Modal TL003 (Parametrização de Tipos)
  const [isModalTiposOpen, setIsModalTiposOpen] = useState(false);
  const [novoTipoNome, setNovoTipoNome] = useState('');
  const [novoTipoNatureza, setNovoTipoNatureza] = useState<NaturezaUnidade>('Destino externo');
  const [novoTipoAdmissao, setNovoTipoAdmissao] = useState(false);
  const [novoTipoDestinacao, setNovoTipoDestinacao] = useState(true);
  const [novoTipoRecintos, setNovoTipoRecintos] = useState(false);
  const [formNovoTipoAberto, setFormNovoTipoAberto] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // ESTADO DO FORMULÁRIO TL002 (NOVO / EDITAR)
  // Regra de Ouro DR004:
  // Ordem EXATA: Tipo ➔ Nome ➔ Município ➔ Responsável ➔ Telefone ➔ E-mail
  // Responsável é texto livre obrigatório (*)
  // PROIBIDO exibir ou exigir: Capacidade, Autorização e Validade
  // -------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campos na Ordem Exata
  const [formTipoId, setFormTipoId] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formMunicipio, setFormMunicipio] = useState('Salvador');
  const [formResponsavel, setFormResponsavel] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formEmail, setFormEmail] = useState('');

  // Campos para Destino Externo
  const [formCpfCnpj, setFormCpfCnpj] = useState('');
  const [formRazaoSocial, setFormRazaoSocial] = useState('');
  const [formEndereco, setFormEndereco] = useState('');
  const [formLatitude, setFormLatitude] = useState('');
  const [formLongitude, setFormLongitude] = useState('');
  const [formRestricoesDestino, setFormRestricoesDestino] = useState('');

  // Situação
  const [formSituacao, setFormSituacao] = useState<'Ativo' | 'Inativo'>('Ativo');

  // Erros de validação
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Tipo selecionado atualmente para derivar a Natureza
  const tipoSelecionado = useMemo(() => {
    return tiposUnidade.find((t) => t.id === formTipoId);
  }, [tiposUnidade, formTipoId]);

  const isDestinoExterno = tipoSelecionado?.natureza === 'Destino externo';

  // Iniciar inclusão
  const handleNovoRegistro = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTipoId(tiposUnidade[0]?.id || '');
    setFormNome('');
    setFormMunicipio('Salvador');
    setFormResponsavel('');
    setFormTelefone('');
    setFormEmail('');
    setFormCpfCnpj('');
    setFormRazaoSocial('');
    setFormEndereco('');
    setFormLatitude('');
    setFormLongitude('');
    setFormRestricoesDestino('');
    setFormSituacao('Ativo');
    setFormErrors({});
    setViewMode('formulario');
  };

  // Iniciar edição
  const handleEditarRegistro = (und: UnidadeItem) => {
    setIsEditing(true);
    setEditingId(und.id);
    setFormTipoId(und.tipoUnidadeId);
    setFormNome(und.nome);
    setFormMunicipio(und.municipio);
    setFormResponsavel(und.responsavel);
    setFormTelefone(und.telefone);
    setFormEmail(und.email);
    setFormCpfCnpj(und.cpfCnpj || '');
    setFormRazaoSocial(und.razaoSocial || '');
    setFormEndereco(und.endereco || '');
    setFormLatitude(und.latitude || '');
    setFormLongitude(und.longitude || '');
    setFormRestricoesDestino(und.restricoesDestino || '');
    setFormSituacao(und.situacao);
    setFormErrors({});
    if (drawerUnidade) setDrawerUnidade(null);
    setViewMode('formulario');
  };

  // Alternar situação ativo/inativo
  const handleAlternarSituacao = (id: string) => {
    setUnidades((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nova = u.situacao === 'Ativo' ? 'Inativo' : 'Ativo';
          showToast(`Situação da unidade "${u.nome}" alterada para ${nova}.`);
          return { ...u, situacao: nova };
        }
        return u;
      })
    );
  };

  // Validação estrita do DR004
  const validarFormulario = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formTipoId) errors.formTipoId = 'Selecione o tipo de unidade.';
    if (!formNome.trim()) errors.formNome = 'Informe o nome da unidade ou destino (até 150 caracteres).';
    if (!formMunicipio) errors.formMunicipio = 'Selecione o município.';
    if (!formResponsavel.trim()) {
      errors.formResponsavel = 'O responsável é de preenchimento obrigatório (*).';
    }
    if (!formTelefone.trim()) errors.formTelefone = 'Informe o telefone de contato obrigatório.';
    if (!formEmail.trim() || !formEmail.includes('@')) {
      errors.formEmail = 'Informe um e-mail de contato válido.';
    }

    if (isDestinoExterno) {
      if (!formCpfCnpj.trim()) errors.formCpfCnpj = 'Informe o CPF ou CNPJ do titular do destino externo.';
      if (!formRazaoSocial.trim()) errors.formRazaoSocial = 'Informe a Razão Social ou Nome do Titular.';
      if (!formEndereco.trim()) errors.formEndereco = 'Informe o endereço completo do destino externo.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Salvar registro
  const handleSalvar = () => {
    if (!validarFormulario()) {
      showToast('Preencha todos os campos obrigatórios (*) para prosseguir.');
      return;
    }

    const tipo = tiposUnidade.find((t) => t.id === formTipoId);
    const natureza = tipo ? tipo.natureza : 'Destino externo';

    if (isEditing && editingId) {
      setUnidades((prev) =>
        prev.map((u) => {
          if (u.id === editingId) {
            return {
              ...u,
              tipoUnidadeId: formTipoId,
              tipoUnidadeNome: tipo?.nome || u.tipoUnidadeNome,
              nome: formNome.trim(),
              municipio: formMunicipio,
              uf: 'BA',
              responsavel: formResponsavel.trim(),
              telefone: formTelefone.trim(),
              email: formEmail.trim(),
              natureza,
              cpfCnpj: isDestinoExterno ? formCpfCnpj.trim() : undefined,
              razaoSocial: isDestinoExterno ? formRazaoSocial.trim() : undefined,
              endereco: isDestinoExterno ? formEndereco.trim() : undefined,
              latitude: isDestinoExterno && formLatitude.trim() ? formLatitude.trim() : undefined,
              longitude: isDestinoExterno && formLongitude.trim() ? formLongitude.trim() : undefined,
              restricoesDestino: isDestinoExterno && formRestricoesDestino.trim() ? formRestricoesDestino.trim() : undefined,
              situacao: formSituacao,
            };
          }
          return u;
        })
      );
      showToast(`Unidade "${formNome}" atualizada com sucesso!`);
    } else {
      const nova: UnidadeItem = {
        id: `und-${Date.now().toString().slice(-4)}`,
        tipoUnidadeId: formTipoId,
        tipoUnidadeNome: tipo?.nome || 'Unidade',
        nome: formNome.trim(),
        municipio: formMunicipio,
        uf: 'BA',
        responsavel: formResponsavel.trim(),
        telefone: formTelefone.trim(),
        email: formEmail.trim(),
        natureza,
        cpfCnpj: isDestinoExterno ? formCpfCnpj.trim() : undefined,
        razaoSocial: isDestinoExterno ? formRazaoSocial.trim() : undefined,
        endereco: isDestinoExterno ? formEndereco.trim() : undefined,
        latitude: isDestinoExterno && formLatitude.trim() ? formLatitude.trim() : undefined,
        longitude: isDestinoExterno && formLongitude.trim() ? formLongitude.trim() : undefined,
        restricoesDestino: isDestinoExterno && formRestricoesDestino.trim() ? formRestricoesDestino.trim() : undefined,
        situacao: formSituacao,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
      };
      setUnidades((prev) => [nova, ...prev]);
      showToast(`Unidade "${formNome}" cadastrada com sucesso!`);
    }

    setViewMode('listagem');
  };

  // Salvar novo tipo de unidade no modal TL003
  const handleSalvarNovoTipo = () => {
    if (!novoTipoNome.trim()) {
      showToast('Informe o nome do novo tipo de unidade.');
      return;
    }
    const novoTipo: TipoUnidadeItem = {
      id: `tu-${Date.now().toString().slice(-4)}`,
      nome: novoTipoNome.trim(),
      natureza: novoTipoNatureza,
      permiteAdmissao: novoTipoAdmissao,
      permiteDestinacao: novoTipoDestinacao,
      permiteRecintos: novoTipoRecintos,
      situacao: 'Ativo',
    };
    setTiposUnidade((prev) => [...prev, novoTipo]);
    setNovoTipoNome('');
    setFormNovoTipoAberto(false);
    showToast(`Tipo "${novoTipo.nome}" cadastrado com sucesso!`);
  };

  // Filtros aplicados
  const unidadesFiltradas = useMemo(() => {
    return unidades.filter((u) => {
      const matchBusca =
        !busca.trim() ||
        u.nome.toLowerCase().includes(busca.toLowerCase()) ||
        u.municipio.toLowerCase().includes(busca.toLowerCase()) ||
        u.responsavel.toLowerCase().includes(busca.toLowerCase()) ||
        u.tipoUnidadeNome.toLowerCase().includes(busca.toLowerCase());

      const matchTipo = filtroTipo === 'todos' || u.tipoUnidadeId === filtroTipo;
      const matchNatureza = filtroNatureza === 'todos' || u.natureza === filtroNatureza;
      const matchSituacao = filtroSituacao === 'todos' || u.situacao === filtroSituacao;

      return matchBusca && matchTipo && matchNatureza && matchSituacao;
    });
  }, [unidades, busca, filtroTipo, filtroNatureza, filtroSituacao]);

  const activeFilterCount =
    (filtroTipo !== 'todos' ? 1 : 0) +
    (filtroNatureza !== 'todos' ? 1 : 0) +
    (filtroSituacao !== 'todos' ? 1 : 0);

  const handleLimparFiltros = () => {
    setBusca('');
    setFiltroTipo('todos');
    setFiltroNatureza('todos');
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
                Unidades e Destinos
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Cadastro de unidades internas do INEMA, zoológicos, ASAS e criadouros de destinação da fauna silvestre.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalTiposOpen(true)}
                className="text-xs h-9 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Settings className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Tipos de Unidade
              </Button>
              <Button
                variant="primary"
                onClick={handleNovoRegistro}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs text-xs sm:text-sm h-9 px-4 font-semibold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Nova Unidade/Destino
              </Button>
            </div>
          </div>

          {/* Tabela de Unidades e Destinos */}
          <TableContainer
            toolbar={
              <TableToolbar
                searchPlaceholder="Buscar por nome, tipo, município ou responsável..."
                searchValue={busca}
                onSearchChange={setBusca}
                activeFilterCount={activeFilterCount}
                filters={
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200/80">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tipo de Unidade</label>
                      <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todos os Tipos</option>
                        {tiposUnidade.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Natureza</label>
                      <select
                        value={filtroNatureza}
                        onChange={(e) => setFiltroNatureza(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todas as Naturezas</option>
                        <option value="Unidade do INEMA">Unidade do INEMA</option>
                        <option value="Destino externo">Destino externo</option>
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
                    Exibindo <span className="font-bold text-slate-800">{unidadesFiltradas.length}</span> de {unidades.length} unidades
                  </div>
                }
              />
            }
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold select-none">
                  <th className="py-2.5 px-4">Nome da Unidade / Destino</th>
                  <th className="py-2.5 px-4">Tipo de Unidade</th>
                  <th className="py-2.5 px-3">Município / UF</th>
                  <th className="py-2.5 px-3">Situação</th>
                  <th className="py-2.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unidadesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Info className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-semibold text-slate-700">Nenhuma unidade encontrada</p>
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
                  unidadesFiltradas.map((und) => (
                    <tr key={und.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                      {/* Nome */}
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-slate-900 block">{und.nome}</span>
                      </td>

                      {/* Tipo de Unidade */}
                      <td className="py-2.5 px-4">
                        <span className="font-medium text-slate-800 block">{und.tipoUnidadeNome}</span>
                      </td>

                      {/* Município / UF */}
                      <td className="py-2.5 px-3">
                        <span className="text-slate-700 font-medium">
                          {und.municipio} / {und.uf}
                        </span>
                      </td>

                      {/* Situação */}
                      <td className="py-2.5 px-3">
                        <Badge color={und.situacao === 'Ativo' ? 'success' : 'gray'} size="sm" dot>
                          {und.situacao}
                        </Badge>
                      </td>

                      {/* Ações */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDrawerUnidade(und)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Visualizar detalhes da unidade"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditarRegistro(und)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Editar unidade"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAlternarSituacao(und.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title={und.situacao === 'Ativo' ? 'Inativar unidade' : 'Ativar unidade'}
                          >
                            {und.situacao === 'Ativo' ? (
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
                Salvar {isDestinoExterno ? 'Destino' : 'Unidade'}
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Editar: ${formNome}` : 'Nova Unidade ou Destino de Fauna'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Preencha os dados institucionais, localização e contatos da unidade.
            </p>
          </div>

          {/* SEÇÃO 1: Identificação e Localização */}
          <Section
            title="Identificação, Localização e Contatos"
            description="Informações cadastrais e dados para contato institucional."
          >
            <div className="space-y-4 pt-2">
              {/* Alerta de Natureza Derivada */}
              {tipoSelecionado && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>
                      Natureza cadastral vinculada ao tipo:{' '}
                      <strong className="text-slate-800">{tipoSelecionado.natureza}</strong>
                    </span>
                  </div>
                  <Badge color={tipoSelecionado.natureza === 'Unidade do INEMA' ? 'primary' : 'gray'} size="sm">
                    {tipoSelecionado.natureza}
                  </Badge>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Tipo de Unidade (Select OBG) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Unidade <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formTipoId}
                    onChange={(e) => setFormTipoId(e.target.value)}
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formTipoId ? 'border-rose-400' : 'border-slate-300'
                    )}
                  >
                    <option value="">Selecione o tipo de unidade...</option>
                    {tiposUnidade.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome} ({t.natureza})
                      </option>
                    ))}
                  </select>
                  {formErrors.formTipoId && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formTipoId}</span>
                  )}
                </div>

                {/* 2. Nome da Unidade/Destino (Texto OBG até 150 caracteres) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da Unidade ou Destino <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={150}
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="ex: CETAS Salvador (Cabula) ou Parque Zoobotânico"
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formNome ? 'border-rose-400' : 'border-slate-300'
                    )}
                  />
                  {formErrors.formNome && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formNome}</span>
                  )}
                </div>

                {/* 3. Município (Select OBG) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Município (Bahia) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formMunicipio}
                    onChange={(e) => setFormMunicipio(e.target.value)}
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formMunicipio ? 'border-rose-400' : 'border-slate-300'
                    )}
                  >
                    {MUNICIPIOS_BAHIA.map((mun) => (
                      <option key={mun} value={mun}>
                        {mun} - BA
                      </option>
                    ))}
                  </select>
                  {formErrors.formMunicipio && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formMunicipio}</span>
                  )}
                </div>

                {/* 4. Responsável (Texto livre OBRIGATÓRIO com *) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Responsável <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={120}
                    value={formResponsavel}
                    onChange={(e) => setFormResponsavel(e.target.value)}
                    placeholder="Nome completo do responsável"
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formResponsavel ? 'border-rose-400' : 'border-slate-300'
                    )}
                  />
                  {formErrors.formResponsavel && (
                    <span className="text-[11px] text-rose-600 mt-0.5 block">{formErrors.formResponsavel}</span>
                  )}
                </div>

                {/* 5. Telefone (Texto formatado OBG) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone de Contato <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formTelefone ? 'border-rose-400' : 'border-slate-300'
                    )}
                  />
                  {formErrors.formTelefone && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formTelefone}</span>
                  )}
                </div>

                {/* 6. E-mail (Texto formatado OBG) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail Institucional <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="contato@unidade.ba.gov.br"
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formEmail ? 'border-rose-400' : 'border-slate-300'
                    )}
                  />
                  {formErrors.formEmail && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formEmail}</span>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* SEÇÃO: Dados Complementares para Destino Externo (Condicional) */}
          {isDestinoExterno && (
            <Section
              title="Dados Complementares do Destino Externo"
              description="Exigidos para zoológicos, criadouros particulares e áreas de soltura (ASAS)."
            >
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CPF ou CNPJ */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pessoa Física / Jurídica (CPF ou CNPJ) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formCpfCnpj}
                      onChange={(e) => setFormCpfCnpj(e.target.value)}
                      placeholder="00.000.000/0000-00 ou 000.000.000-00"
                      className={cn(
                        'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                        formErrors.formCpfCnpj ? 'border-rose-400' : 'border-slate-300'
                      )}
                    />
                    {formErrors.formCpfCnpj && (
                      <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formCpfCnpj}</span>
                    )}
                  </div>

                  {/* Razão Social / Nome do Titular */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Razão Social / Nome do Titular <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formRazaoSocial}
                      onChange={(e) => setFormRazaoSocial(e.target.value)}
                      placeholder="Nome completo do titular ou razão social da instituição"
                      className={cn(
                        'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                        formErrors.formRazaoSocial ? 'border-rose-400' : 'border-slate-300'
                      )}
                    />
                    {formErrors.formRazaoSocial && (
                      <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formRazaoSocial}</span>
                    )}
                  </div>

                  {/* Endereço Completo */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Endereço Completo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formEndereco}
                      onChange={(e) => setFormEndereco(e.target.value)}
                      placeholder="Logradouro, número, bairro, zona rural/rodovia e CEP"
                      className={cn(
                        'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                        formErrors.formEndereco ? 'border-rose-400' : 'border-slate-300'
                      )}
                    />
                    {formErrors.formEndereco && (
                      <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formEndereco}</span>
                    )}
                  </div>

                  {/* Coordenadas Geográficas (Opcional) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Latitude (Graus Decimais)
                    </label>
                    <input
                      type="text"
                      value={formLatitude}
                      onChange={(e) => setFormLatitude(e.target.value)}
                      placeholder="ex: -12.9714"
                      className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Longitude (Graus Decimais)
                    </label>
                    <input
                      type="text"
                      value={formLongitude}
                      onChange={(e) => setFormLongitude(e.target.value)}
                      placeholder="ex: -38.5014"
                      className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    />
                  </div>

                  {/* Restrições do Destino */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Restrições do Destino Externo
                    </label>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={formRestricoesDestino}
                      onChange={(e) => setFormRestricoesDestino(e.target.value)}
                      placeholder="Descreva restrições operacionais para recebimento de fauna (ex: aceita apenas passeriformes, exige quarentena prévia, limite de espécies...)"
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    />
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Texto livre descritivo para apoiar os termos de destinação do CETAS.
                    </span>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* SEÇÃO: Situação Cadastral */}
          <Section
            title="Situação Cadastral"
            description="Controle de ativação da unidade no sistema integrado do INEMA."
          >
            <div className="pt-2 flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Unidade Habilitada / Ativa</span>
                <span className="text-[11px] text-slate-500">
                  Unidades inativas não podem ser selecionadas para novas admissões ou termos de destinação.
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
              Salvar {isDestinoExterno ? 'Destino' : 'Unidade'}
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GAVETA DE DETALHES (DRAWER NÍVEL 1) */}
      {/* ========================================================= */}
      {drawerUnidade && (
        <GlaDrawer
          isOpen={true}
          onClose={() => setDrawerUnidade(null)}
          title={drawerUnidade.nome}
          subtitle={`${drawerUnidade.tipoUnidadeNome} · ${drawerUnidade.municipio}/${drawerUnidade.uf}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setDrawerUnidade(null)} className="text-xs">
                Fechar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleEditarRegistro(drawerUnidade)}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Editar Unidade
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-xs text-slate-700">
            {/* Badges Principais */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100">
              <Badge color={drawerUnidade.situacao === 'Ativo' ? 'success' : 'gray'} dot size="sm">
                {drawerUnidade.situacao}
              </Badge>
              <Badge color={drawerUnidade.natureza === 'Unidade do INEMA' ? 'primary' : 'gray'} size="sm">
                {drawerUnidade.natureza}
              </Badge>
            </div>

            {/* Informações Básicas */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Identificação & Localização
              </h4>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[11px] block">Tipo de Unidade</span>
                  <span className="font-semibold text-slate-800">{drawerUnidade.tipoUnidadeNome}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Município / UF</span>
                  <span className="font-semibold text-slate-800">
                    {drawerUnidade.municipio} / {drawerUnidade.uf}
                  </span>
                </div>
                {drawerUnidade.endereco && (
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[11px] block">Endereço Completo</span>
                    <span className="text-slate-700">{drawerUnidade.endereco}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Responsável e Contatos */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Responsável Oficial & Contatos
              </h4>
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C3A] shrink-0" />
                  <span className="font-semibold text-slate-800">{drawerUnidade.responsavel}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{drawerUnidade.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{drawerUnidade.email}</span>
                </div>
              </div>
            </div>

            {/* Se Destino Externo: Titular e Restrições */}
            {drawerUnidade.natureza === 'Destino externo' && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Dados do Destino Externo
                </h4>
                <div className="space-y-2.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {drawerUnidade.cpfCnpj && (
                    <div>
                      <span className="text-slate-400 text-[11px] block">CPF / CNPJ Titular</span>
                      <span className="font-mono font-semibold text-slate-800">{drawerUnidade.cpfCnpj}</span>
                    </div>
                  )}
                  {drawerUnidade.razaoSocial && (
                    <div>
                      <span className="text-slate-400 text-[11px] block">Razão Social / Nome</span>
                      <span className="text-slate-800 font-medium">{drawerUnidade.razaoSocial}</span>
                    </div>
                  )}
                  {(drawerUnidade.latitude || drawerUnidade.longitude) && (
                    <div>
                      <span className="text-slate-400 text-[11px] block">Coordenadas Geográficas</span>
                      <span className="font-mono text-slate-700">
                        {drawerUnidade.latitude}, {drawerUnidade.longitude}
                      </span>
                    </div>
                  )}
                  {drawerUnidade.restricoesDestino && (
                    <div className="pt-1">
                      <span className="text-slate-400 text-[11px] block">Restrições de Recebimento</span>
                      <p className="text-slate-700 bg-amber-50/70 p-2 rounded border border-amber-200/80 text-[11px] mt-1">
                        {drawerUnidade.restricoesDestino}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 text-[11px] text-slate-400">
              Cadastrado em: {drawerUnidade.dataCadastro}
            </div>
          </div>
        </GlaDrawer>
      )}

      {/* ========================================================= */}
      {/* MODAL TL003: PARAMETRIZAÇÃO DE TIPOS DE UNIDADE */}
      {/* ========================================================= */}
      <Dialog open={isModalTiposOpen} onOpenChange={setIsModalTiposOpen}>
        <DialogContent className="max-w-3xl bg-white p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Parametrização de Tipos de Unidade
            </DialogTitle>
            <p className="text-xs text-slate-500 mt-1">
              Defina as permissões operacionais para admissão, destinação e gestão de recintos de cada categoria de unidade.
            </p>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Tabela de Tipos Cadastrados */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                  <tr>
                    <th className="py-2 px-3">Tipo de Unidade</th>
                    <th className="py-2 px-3">Natureza</th>
                    <th className="py-2 px-2 text-center">Admissão?</th>
                    <th className="py-2 px-2 text-center">Destinação?</th>
                    <th className="py-2 px-2 text-center">Recintos?</th>
                    <th className="py-2 px-2 text-center">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tiposUnidade.map((tipo) => (
                    <tr key={tipo.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{tipo.nome}</td>
                      <td className="py-2.5 px-3">
                        <Badge color={tipo.natureza === 'Unidade do INEMA' ? 'primary' : 'gray'} size="xs">
                          {tipo.natureza}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {tipo.permiteAdmissao ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {tipo.permiteDestinacao ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {tipo.permiteRecintos ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <Badge color={tipo.situacao === 'Ativo' ? 'success' : 'gray'} size="xs" dot>
                          {tipo.situacao}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formulário para Inclusão de Novo Tipo */}
            {formNovoTipoAberto ? (
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800">Cadastrar Novo Tipo de Unidade</span>
                  <Button variant="ghost" size="xs" onClick={() => setFormNovoTipoAberto(false)} className="text-xs">
                    Cancelar
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nome do Tipo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={novoTipoNome}
                      onChange={(e) => setNovoTipoNome(e.target.value)}
                      placeholder="ex: Centro de Pesquisa ou RPPN"
                      className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Natureza</label>
                    <select
                      value={novoTipoNatureza}
                      onChange={(e) => setNovoTipoNatureza(e.target.value as NaturezaUnidade)}
                      className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 text-slate-800"
                    >
                      <option value="Unidade do INEMA">Unidade do INEMA</option>
                      <option value="Destino externo">Destino externo</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={novoTipoAdmissao}
                      onChange={(e) => setNovoTipoAdmissao(e.target.checked)}
                      className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                    />
                    <span>Permite Admissão</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={novoTipoDestinacao}
                      onChange={(e) => setNovoTipoDestinacao(e.target.checked)}
                      className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                    />
                    <span>Permite Destinação</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={novoTipoRecintos}
                      onChange={(e) => setNovoTipoRecintos(e.target.checked)}
                      className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                    />
                    <span>Permite Recintos</span>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSalvarNovoTipo}
                    className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8"
                  >
                    Salvar Tipo
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormNovoTipoAberto(true)}
                className="text-xs h-8 text-slate-700 border-dashed border-slate-300 w-full"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Adicionar Novo Tipo de Unidade
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsModalTiposOpen(false)} className="text-xs">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
