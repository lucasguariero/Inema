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
  BookOpen,
  ShieldAlert,
  SlidersHorizontal,
  RotateCcw,
  History,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  FileText,
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
  MOCK_ESPECIES,
  EspecieItem,
  NomePopularItem,
  ClassificacaoAmeacaItem,
  GrupoAnimal,
  GRUPOS_ANIMAIS,
  LISTAS_OFICIAIS,
  CATEGORIAS_AMEACA,
} from '@/data/faunaMock';

interface EspeciesTaxonomiaPageProps {
  onNavigate?: (route: string) => void;
}

export const EspeciesTaxonomiaPage: React.FC<EspeciesTaxonomiaPageProps> = ({ onNavigate }) => {
  // Estado de tela: 'listagem' (TL001) | 'formulario' (TL002)
  const [viewMode, setViewMode] = useState<'listagem' | 'formulario'>('listagem');

  // Base de dados local com o mock
  const [especies, setEspecies] = useState<EspecieItem[]>(MOCK_ESPECIES);

  // Filtros da Listagem (TL001)
  const [busca, setBusca] = useState('');
  const [filtroGrupo, setFiltroGrupo] = useState<string>('todos');
  const [filtroAmeaca, setFiltroAmeaca] = useState<string>('todos'); // 'todos' | 'ameacadas' | 'nao-ameacadas'
  const [filtroExotica, setFiltroExotica] = useState<string>('todos'); // 'todos' | 'sim' | 'nao'
  const [filtroSituacao, setFiltroSituacao] = useState<string>('todos'); // 'todos' | 'Ativo' | 'Inativo'
  const [filtroStatusRegistro, setFiltroStatusRegistro] = useState<string>('todos'); // 'todos' | 'definitivo' | 'rascunho'

  // Gaveta de detalhes (Drawer Nível 1)
  const [drawerEspecie, setDrawerEspecie] = useState<EspecieItem | null>(null);

  // Modal de Histórico de Auditoria
  const [historicoEspecie, setHistoricoEspecie] = useState<EspecieItem | null>(null);

  // Notificação toast temporária
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // ESTADO DO FORMULÁRIO TL002 (NOVO / EDITAR)
  // -------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campos do DR002
  const [formNomeCientifico, setFormNomeCientifico] = useState('');
  const [formAutorAno, setFormAutorAno] = useState('');
  const [formTaxonSuperior, setFormTaxonSuperior] = useState(false);
  const [formClasse, setFormClasse] = useState('');
  const [formOrdem, setFormOrdem] = useState('');
  const [formFamilia, setFormFamilia] = useState('');
  const [formGenero, setFormGenero] = useState('');
  const [formGrupoAnimal, setFormGrupoAnimal] = useState<GrupoAnimal>('Aves');
  const [formNomesPopulares, setFormNomesPopulares] = useState<NomePopularItem[]>([
    { id: 'np-init-1', nome: '', principal: true },
  ]);
  const [formClassificacoesAmeaca, setFormClassificacoesAmeaca] = useState<ClassificacaoAmeacaItem[]>([]);
  const [formExoticaInvasora, setFormExoticaInvasora] = useState(false); // Padrão DESLIGADO (RN-009)
  const [formRestricoesSoltura, setFormRestricoesSoltura] = useState(''); // OBRIGATÓRIO texto livre (RN-010)
  const [formObservacoes, setFormObservacoes] = useState('');
  const [formJustificativaEdicao, setFormJustificativaEdicao] = useState('');
  const [formStatusOriginal, setFormStatusOriginal] = useState<'rascunho' | 'definitivo'>('rascunho');

  // Abre formulário para criação limpa
  const handleNovoRegistro = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormNomeCientifico('');
    setFormAutorAno('');
    setFormTaxonSuperior(false);
    setFormClasse('');
    setFormOrdem('');
    setFormFamilia('');
    setFormGenero('');
    setFormGrupoAnimal('Aves');
    setFormNomesPopulares([{ id: 'np-new-1', nome: '', principal: true }]);
    setFormClassificacoesAmeaca([]);
    setFormExoticaInvasora(false);
    setFormRestricoesSoltura('');
    setFormObservacoes('');
    setFormJustificativaEdicao('');
    setFormStatusOriginal('rascunho');
    setViewMode('formulario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Abre formulário para edição de item existente
  const handleEditarRegistro = (esp: EspecieItem) => {
    setIsEditing(true);
    setEditingId(esp.id);
    setFormNomeCientifico(esp.nomeCientifico);
    setFormAutorAno(esp.autorAno || '');
    setFormTaxonSuperior(esp.taxonSuperior);
    setFormClasse(esp.classe);
    setFormOrdem(esp.ordem);
    setFormFamilia(esp.familia);
    setFormGenero(esp.genero);
    setFormGrupoAnimal(esp.grupoAnimal);
    setFormNomesPopulares(
      esp.nomesPopulares.length > 0
        ? esp.nomesPopulares.map((np) => ({ ...np }))
        : [{ id: 'np-edit-1', nome: '', principal: true }]
    );
    setFormClassificacoesAmeaca(esp.classificacoesAmeaca.map((ca) => ({ ...ca })));
    setFormExoticaInvasora(esp.exoticaInvasora);
    setFormRestricoesSoltura(esp.restricoesSoltura || '');
    setFormObservacoes(esp.observacoes || '');
    setFormJustificativaEdicao(esp.justificativaEdicao || '');
    setFormStatusOriginal(esp.statusRegistro);
    setViewMode('formulario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Adicionar / Remover / Alterar Nomes Populares
  const handleAddNomePopular = () => {
    setFormNomesPopulares((prev) => [
      ...prev,
      { id: `np-${Date.now()}`, nome: '', principal: prev.length === 0 },
    ]);
  };

  const handleRemoveNomePopular = (id: string) => {
    if (formNomesPopulares.length <= 1) {
      showToast('A espécie deve possuir ao menos um nome popular.');
      return;
    }
    setFormNomesPopulares((prev) => {
      const filtered = prev.filter((np) => np.id !== id);
      // Se removeu o principal, marca o primeiro como principal
      if (!filtered.some((np) => np.principal) && filtered.length > 0) {
        filtered[0].principal = true;
      }
      return filtered;
    });
  };

  const handleUpdateNomePopular = (id: string, text: string) => {
    setFormNomesPopulares((prev) =>
      prev.map((np) => (np.id === id ? { ...np, nome: text } : np))
    );
  };

  const handleSetPrincipalNomePopular = (id: string) => {
    setFormNomesPopulares((prev) =>
      prev.map((np) => ({ ...np, principal: np.id === id }))
    );
  };

  // Adicionar / Remover Classificações de Ameaça (Regra de Ouro: Sem duplicação na UI)
  const handleAddClassificacaoAmeaca = () => {
    // Valida se já preencheu todas as listas oficiais
    const usedLists = formClassificacoesAmeaca.map((c) => c.listaOficial);
    const available = LISTAS_OFICIAIS.find((l) => !usedLists.includes(l));
    const nextList = available || LISTAS_OFICIAIS[0];

    setFormClassificacoesAmeaca((prev) => [
      ...prev,
      {
        id: `ca-${Date.now()}`,
        listaOficial: nextList,
        categoria: CATEGORIAS_AMEACA[0],
        atoNormativoAno: 'Portaria MMA nº 148/2022',
      },
    ]);
  };

  const handleRemoveClassificacaoAmeaca = (id: string) => {
    setFormClassificacoesAmeaca((prev) => prev.filter((ca) => ca.id !== id));
  };

  const handleUpdateClassificacaoAmeaca = (
    id: string,
    field: keyof ClassificacaoAmeacaItem,
    val: string
  ) => {
    setFormClassificacoesAmeaca((prev) =>
      prev.map((ca) => (ca.id === id ? { ...ca, [field]: val } : ca))
    );
  };

  // Salvar formulário (Rascunho ou Definitivo)
  const handleSalvar = (statusDestino: 'rascunho' | 'definitivo') => {
    if (!formNomeCientifico.trim()) {
      showToast('Preencha o Nome Científico da espécie.');
      return;
    }
    const duplicada = especies.some(
      (e) =>
        e.id !== editingId &&
        e.nomeCientifico.trim().toLowerCase() === formNomeCientifico.trim().toLowerCase()
    );
    if (duplicada) {
      showToast('Já existe uma espécie cadastrada com este Nome Científico.');
      return;
    }
    if (!formClasse.trim() || !formOrdem.trim() || !formFamilia.trim() || !formGenero.trim()) {
      showToast('Preencha todos os campos da classificação taxonômica (Classe, Ordem, Família, Gênero).');
      return;
    }
    const nomesValidos = formNomesPopulares.filter((np) => np.nome.trim() !== '');
    if (nomesValidos.length === 0) {
      showToast('Informe ao menos um Nome Popular válido.');
      return;
    }
    if (!nomesValidos.some((np) => np.principal)) {
      nomesValidos[0].principal = true;
    }
    // Restrições de soltura é obrigatório (RN-010)
    if (!formRestricoesSoltura.trim()) {
      showToast('O campo Restrições de Soltura é obrigatório.');
      return;
    }
    // Justificativa obrigatória para edição excepcional de registro definitivo (RN-016)
    if (isEditing && formStatusOriginal === 'definitivo' && !formJustificativaEdicao.trim()) {
      showToast('A justificativa é obrigatória para alteração de registros definitivos.');
      return;
    }

    // Calcula se é considerada ameaçada com base nas classificações
    const hasAmeaca = formClassificacoesAmeaca.some((ca) =>
      ca.categoria.includes('CR') ||
      ca.categoria.includes('EN') ||
      ca.categoria.includes('VU') ||
      ca.categoria.includes('Apêndice I')
    );

    if (isEditing && editingId) {
      // Edição
      setEspecies((prev) =>
        prev.map((esp) => {
          if (esp.id === editingId) {
            return {
              ...esp,
              nomeCientifico: formNomeCientifico.trim(),
              autorAno: formAutorAno.trim() || undefined,
              taxonSuperior: formTaxonSuperior,
              classe: formClasse.trim(),
              ordem: formOrdem.trim(),
              familia: formFamilia.trim(),
              genero: formGenero.trim(),
              grupoAnimal: formGrupoAnimal,
              nomesPopulares: nomesValidos,
              classificacoesAmeaca: formClassificacoesAmeaca,
              ameacada: hasAmeaca,
              exoticaInvasora: formExoticaInvasora,
              restricoesSoltura: formRestricoesSoltura.trim(),
              observacoes: formObservacoes.trim() || undefined,
              justificativaEdicao: formJustificativaEdicao.trim() || undefined,
              statusRegistro: statusDestino,
              atualizadoEm: new Date().toLocaleDateString('pt-BR'),
            };
          }
          return esp;
        })
      );
      showToast(`Espécie "${formNomeCientifico}" atualizada com sucesso!`);
    } else {
      // Nova espécie
      const novoCodigo = `ESP-${String(especies.length + 1).padStart(4, '0')}`;
      const novaEspecie: EspecieItem = {
        id: `esp-${Date.now()}`,
        codigo: novoCodigo,
        nomeCientifico: formNomeCientifico.trim(),
        autorAno: formAutorAno.trim() || undefined,
        taxonSuperior: formTaxonSuperior,
        classe: formClasse.trim(),
        ordem: formOrdem.trim(),
        familia: formFamilia.trim(),
        genero: formGenero.trim(),
        grupoAnimal: formGrupoAnimal,
        nomesPopulares: nomesValidos,
        classificacoesAmeaca: formClassificacoesAmeaca,
        ameacada: hasAmeaca,
        exoticaInvasora: formExoticaInvasora,
        restricoesSoltura: formRestricoesSoltura.trim(),
        observacoes: formObservacoes.trim() || undefined,
        statusRegistro: statusDestino,
        situacao: 'Ativo',
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
      };
      setEspecies((prev) => [novaEspecie, ...prev]);
      showToast(`Espécie "${formNomeCientifico}" cadastrada com sucesso (${novoCodigo})!`);
    }

    setViewMode('listagem');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Alternar situação Ativo / Inativo
  const handleToggleSituacao = (esp: EspecieItem) => {
    const novaSituacao = esp.situacao === 'Ativo' ? 'Inativo' : 'Ativo';
    setEspecies((prev) =>
      prev.map((item) =>
        item.id === esp.id ? { ...item, situacao: novaSituacao } : item
      )
    );
    showToast(`Situação da espécie "${esp.nomeCientifico}" alterada para ${novaSituacao}.`);
  };

  // -------------------------------------------------------------
  // FILTRAGEM DE REGISTROS NA LISTAGEM (TL001)
  // -------------------------------------------------------------
  const especiesFiltradas = useMemo(() => {
    return especies.filter((esp) => {
      // Busca textual por nome científico ou nomes populares
      if (busca.trim()) {
        const termo = busca.toLowerCase().trim();
        const bateCientifico = esp.nomeCientifico.toLowerCase().includes(termo);
        const batePopular = esp.nomesPopulares.some((np) =>
          np.nome.toLowerCase().includes(termo)
        );
        const bateFamilia = esp.familia.toLowerCase().includes(termo);
        const bateCodigo = esp.codigo.toLowerCase().includes(termo);
        if (!bateCientifico && !batePopular && !bateFamilia && !bateCodigo) {
          return false;
        }
      }

      // Grupo Animal
      if (filtroGrupo !== 'todos' && esp.grupoAnimal !== filtroGrupo) {
        return false;
      }

      // Ameaça
      if (filtroAmeaca === 'ameacadas' && !esp.ameacada) return false;
      if (filtroAmeaca === 'nao-ameacadas' && esp.ameacada) return false;

      // Exótica / Invasora
      if (filtroExotica === 'sim' && !esp.exoticaInvasora) return false;
      if (filtroExotica === 'nao' && esp.exoticaInvasora) return false;

      // Situação
      if (filtroSituacao !== 'todos' && esp.situacao !== filtroSituacao) return false;

      // Status do Registro (definitivo / rascunho)
      if (filtroStatusRegistro !== 'todos' && esp.statusRegistro !== filtroStatusRegistro) return false;

      return true;
    });
  }, [especies, busca, filtroGrupo, filtroAmeaca, filtroExotica, filtroSituacao, filtroStatusRegistro]);

  const activeFilterCount =
    (filtroGrupo !== 'todos' ? 1 : 0) +
    (filtroAmeaca !== 'todos' ? 1 : 0) +
    (filtroExotica !== 'todos' ? 1 : 0) +
    (filtroSituacao !== 'todos' ? 1 : 0) +
    (filtroStatusRegistro !== 'todos' ? 1 : 0);

  const handleLimparFiltros = () => {
    setBusca('');
    setFiltroGrupo('todos');
    setFiltroAmeaca('todos');
    setFiltroExotica('todos');
    setFiltroSituacao('todos');
    setFiltroStatusRegistro('todos');
  };

  return (
    <div className="space-y-6">
      {/* Toast de Notificação */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#0F4C3A] text-white text-xs sm:text-sm font-medium rounded-xl shadow-lg border border-emerald-600/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* VISTA 1: TL001 - LISTAGEM DE ESPÉCIES                    */}
      {/* ========================================================= */}
      {viewMode === 'listagem' && (
        <div className="space-y-6">
          {/* Cabeçalho da Página */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Espécies e Taxonomia
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Cadastro de espécies, taxonomia e categorias de ameaça para a gestão de fauna silvestre do INEMA.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                onClick={handleNovoRegistro}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs text-xs sm:text-sm h-9 px-4 font-semibold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Nova Espécie
              </Button>
            </div>
          </div>

          {/* Tabela Oficial de Espécies */}
          <TableContainer
            toolbar={
              <TableToolbar
                searchPlaceholder="Buscar por nome científico, nome popular ou família..."
                searchValue={busca}
                onSearchChange={setBusca}
                activeFilterCount={activeFilterCount}
                filters={
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200/80">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Grupo Animal</label>
                      <select
                        value={filtroGrupo}
                        onChange={(e) => setFiltroGrupo(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todos os Grupos</option>
                        {GRUPOS_ANIMAIS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Grau de Ameaça</label>
                      <select
                        value={filtroAmeaca}
                        onChange={(e) => setFiltroAmeaca(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todas as Espécies</option>
                        <option value="ameacadas">Apenas Ameaçadas</option>
                        <option value="nao-ameacadas">Não Ameaçadas / Menos Preocupante</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Exótica / Invasora</label>
                      <select
                        value={filtroExotica}
                        onChange={(e) => setFiltroExotica(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todas</option>
                        <option value="sim">Sim (Exótica/Invasora)</option>
                        <option value="nao">Não (Nativa)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Situação / Status</label>
                      <div className="flex gap-2">
                        <select
                          value={filtroSituacao}
                          onChange={(e) => setFiltroSituacao(e.target.value)}
                          className="w-1/2 h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                        >
                          <option value="todos">Situação</option>
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                        </select>
                        <select
                          value={filtroStatusRegistro}
                          onChange={(e) => setFiltroStatusRegistro(e.target.value)}
                          className="w-1/2 h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                        >
                          <option value="todos">Registro</option>
                          <option value="definitivo">Definitivo</option>
                          <option value="rascunho">Rascunho</option>
                        </select>
                      </div>
                    </div>

                    {activeFilterCount > 0 && (
                      <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleLimparFiltros}
                          className="text-xs text-[#0F4C3A] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Limpar todos os filtros ({activeFilterCount})
                        </button>
                      </div>
                    )}
                  </div>
                }
                actions={
                  <div className="text-xs text-slate-500 font-medium">
                    Exibindo <span className="font-bold text-slate-800">{especiesFiltradas.length}</span> de {especies.length} espécies
                  </div>
                }
              />
            }
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold select-none">
                  <th className="py-2.5 px-4">Nome Científico</th>
                  <th className="py-2.5 px-4">Nome Popular</th>
                  <th className="py-2.5 px-4 hidden md:table-cell">Família</th>
                  <th className="py-2.5 px-3">Grupo</th>
                  <th className="py-2.5 px-4">Grau de Ameaça</th>
                  <th className="py-2.5 px-3 hidden lg:table-cell">Exótica?</th>
                  <th className="py-2.5 px-3">Situação</th>
                  <th className="py-2.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {especiesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Info className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-semibold text-slate-700">Nenhuma espécie encontrada</p>
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
                  especiesFiltradas.map((esp) => {
                    const nomePrincipal = esp.nomesPopulares.find((np) => np.principal)?.nome || esp.nomesPopulares[0]?.nome || '—';
                    const outrosNomesCount = Math.max(0, esp.nomesPopulares.length - 1);

                    return (
                      <tr key={esp.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                        {/* Nome Científico */}
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold italic text-slate-900 text-xs sm:text-sm">
                              {esp.nomeCientifico}
                            </span>
                            {esp.taxonSuperior && (
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                Táxon Sup.
                              </span>
                            )}
                            {esp.statusRegistro === 'rascunho' && (
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                Rascunho
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Nome Popular */}
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {nomePrincipal}
                        </td>

                        {/* Família */}
                        <td className="py-2.5 px-4 hidden md:table-cell text-slate-700 text-xs font-medium">
                          {esp.familia}
                        </td>

                        {/* Grupo */}
                        <td className="py-2.5 px-3">
                          <Badge color="gray" size="sm" className="font-medium text-[11px]">
                            {esp.grupoAnimal}
                          </Badge>
                        </td>

                        {/* Grau de Ameaça (Mais Restritivo) */}
                        <td className="py-2.5 px-4">
                          {(() => {
                            if (!esp.classificacoesAmeaca || esp.classificacoesAmeaca.length === 0) {
                              return <span className="text-slate-400 text-[11px]">Não avaliada</span>;
                            }
                            // Ordem de gravidade: CR (1) > EN (2) > VU (3) > NT (4) > LC (5) > Apêndice I (6) > Outros (7)
                            const rankCategory = (cat: string) => {
                              const c = cat.toUpperCase();
                              if (c.includes('CR')) return 1;
                              if (c.includes('EN')) return 2;
                              if (c.includes('VU')) return 3;
                              if (c.includes('NT')) return 4;
                              if (c.includes('LC')) return 5;
                              if (c.includes('APÊNDICE I') || c.includes('APENDICE I')) return 6;
                              return 7;
                            };

                            const sorted = [...esp.classificacoesAmeaca].sort(
                              (a, b) => rankCategory(a.categoria) - rankCategory(b.categoria)
                            );
                            const mostRestrictive = sorted[0];
                            const isCritico = mostRestrictive.categoria.includes('CR') || mostRestrictive.categoria.includes('Apêndice I');
                            const isAmeacado = mostRestrictive.categoria.includes('EN') || mostRestrictive.categoria.includes('VU');

                            return (
                              <span
                                className={cn(
                                  'text-[10px] px-2 py-0.5 rounded border font-mono tracking-tight font-semibold inline-block whitespace-nowrap',
                                  isCritico
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                                    : isAmeacado
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                )}
                                title={`${mostRestrictive.listaOficial}: ${mostRestrictive.categoria} (${mostRestrictive.atoNormativoAno})`}
                              >
                                {mostRestrictive.categoria}
                              </span>
                            );
                          })()}
                        </td>

                        {/* Exótica / Invasora */}
                        <td className="py-2.5 px-3 hidden lg:table-cell">
                          {esp.exoticaInvasora ? (
                            <Badge color="danger" size="sm" dot>
                              Sim
                            </Badge>
                          ) : (
                            <span className="text-slate-400 text-xs">Não</span>
                          )}
                        </td>

                        {/* Situação */}
                        <td className="py-2.5 px-3">
                          <Badge color={esp.situacao === 'Ativo' ? 'success' : 'gray'} size="sm" dot>
                            {esp.situacao}
                          </Badge>
                        </td>

                        {/* Ações */}
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setDrawerEspecie(esp)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Visualizar detalhes da espécie"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditarRegistro(esp)}
                              className="p-1.5 text-[#0F4C3A] hover:text-[#0c3d2e] hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                              title="Editar espécie"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleSituacao(esp)}
                              className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                              title={esp.situacao === 'Ativo' ? 'Inativar espécie' : 'Reativar espécie'}
                            >
                              {esp.situacao === 'Ativo' ? (
                                <ToggleRight className="w-4 h-4 text-emerald-700" />
                              ) : (
                                <ToggleLeft className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setHistoricoEspecie(esp)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Histórico de alterações"
                            >
                              <History className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </TableContainer>
        </div>
      )}

      {/* ========================================================= */}
      {/* VISTA 2: TL002 - NOVO / EDITAR ESPÉCIE (FORMULÁRIO DENSE) */}
      {/* ========================================================= */}
      {viewMode === 'formulario' && (
        <div className="space-y-6 max-w-5xl">
          {/* Barra Superior de Retorno & Ações */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('listagem')}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar à Listagem</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('listagem')}
                className="text-xs h-9"
              >
                Cancelar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSalvar('rascunho')}
                className="text-xs h-9 border-slate-300 text-slate-700"
              >
                Salvar Rascunho
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSalvar('definitivo')}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold text-xs h-9 px-4 shadow-xs"
              >
                Salvar Definitivo
              </Button>
            </div>
          </div>

          {/* Título do Formulário */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {isEditing ? `Editar Espécie: ${formNomeCientifico || 'Sem Nome'}` : 'Nova Espécie da Fauna Silvestre'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Preencha os dados taxonômicos, nomes populares, listas de ameaça e regras de soltura conforme Portaria INEMA e convenções internacionais.
            </p>
          </div>

          {/* Seção 1: Identificação Taxonômica (C001 a C005) */}
          <Section
            title="1. Classificação Taxonômica Oficial"
            description="Informações científicas, família, gênero e enquadramento zoológico."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
              {/* C001 - Nome Científico */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Nome Científico <span className="text-rose-500">*</span>
                </label>
                <InputWrapper>
                  <input
                    type="text"
                    value={formNomeCientifico}
                    onChange={(e) => setFormNomeCientifico(e.target.value)}
                    placeholder="ex: Ara ararauna ou Panthera onca"
                    className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm italic font-medium text-slate-900 placeholder:text-slate-400 placeholder:not-italic focus:outline-none"
                  />
                </InputWrapper>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Padrão binominal (Gênero + epíteto específico em itálico).
                </span>
              </div>

              {/* C002 - Autor e Ano */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Autor e Ano</label>
                <InputWrapper>
                  <input
                    type="text"
                    value={formAutorAno}
                    onChange={(e) => setFormAutorAno(e.target.value)}
                    placeholder="ex: (Linnaeus, 1758)"
                    className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </InputWrapper>
                <span className="text-[11px] text-slate-500 mt-1 block">Opcional.</span>
              </div>

              {/* C003 - Táxon Superior */}
              <div className="flex flex-col justify-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800 select-none">
                  <input
                    type="checkbox"
                    checked={formTaxonSuperior}
                    onChange={(e) => setFormTaxonSuperior(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0F4C3A] focus:ring-[#0F4C3A] border-slate-300"
                  />
                  <span>Registro em Táxon Superior</span>
                </label>
                <span className="text-[11px] text-slate-500 ml-6">
                  Para gênero ou família sem identificação específica da espécie.
                </span>
              </div>

              {/* C004 - Classe, Ordem, Família, Gênero */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Classe <span className="text-rose-500">*</span>
                </label>
                <InputWrapper>
                  <input
                    type="text"
                    value={formClasse}
                    onChange={(e) => setFormClasse(e.target.value)}
                    placeholder="ex: Aves, Mammalia, Reptilia"
                    className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </InputWrapper>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Ordem <span className="text-rose-500">*</span>
                </label>
                <InputWrapper>
                  <input
                    type="text"
                    value={formOrdem}
                    onChange={(e) => setFormOrdem(e.target.value)}
                    placeholder="ex: Psittaciformes, Carnivora"
                    className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </InputWrapper>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Família <span className="text-rose-500">*</span>
                </label>
                <InputWrapper>
                  <input
                    type="text"
                    value={formFamilia}
                    onChange={(e) => setFormFamilia(e.target.value)}
                    placeholder="ex: Psittacidae, Felidae"
                    className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </InputWrapper>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Gênero <span className="text-rose-500">*</span>
                </label>
                <InputWrapper>
                  <input
                    type="text"
                    value={formGenero}
                    onChange={(e) => setFormGenero(e.target.value)}
                    placeholder="ex: Ara, Panthera, Bothrops"
                    className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm italic text-slate-900 placeholder:text-slate-400 placeholder:not-italic focus:outline-none"
                  />
                </InputWrapper>
              </div>

              {/* C005 - Grupo Animal */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Grupo Animal <span className="text-rose-500">*</span>
                </label>
                <FilamentSelect
                  value={formGrupoAnimal}
                  onChange={(val) => setFormGrupoAnimal(val as GrupoAnimal)}
                  options={GRUPOS_ANIMAIS.map((g) => ({ value: g, label: g }))}
                  placeholder="Selecione o grupo..."
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Classificação macro utilizada pelos relatórios gerenciais e estatísticas do CETAS.
                </span>
              </div>
            </div>
          </Section>

          {/* Seção 2: Nomes Populares (C006) */}
          <Section
            title="2. Nomes Populares da Espécie"
            description="Cadastre as denominações regionais da espécie na Bahia e no Brasil. Exatamente um deve ser marcado como Principal."
            headerActions={
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddNomePopular}
                className="text-xs h-8 text-[#0F4C3A] border-[#0F4C3A]/30 hover:bg-[#0F4C3A]/5 font-semibold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Adicionar Nome
              </Button>
            }
          >
            <div className="p-4 space-y-3">
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="py-2 px-3 w-16 text-center">Principal</th>
                      <th className="py-2 px-3">Nome Popular Regional</th>
                      <th className="py-2 px-3 w-20 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formNomesPopulares.map((np, idx) => (
                      <tr key={np.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 text-center">
                          <input
                            type="radio"
                            name="nomePopularPrincipal"
                            checked={np.principal}
                            onChange={() => handleSetPrincipalNomePopular(np.id)}
                            className="w-4 h-4 text-[#0F4C3A] focus:ring-[#0F4C3A] cursor-pointer"
                            title="Marcar como nome popular principal"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <InputWrapper className="w-full">
                            <input
                              type="text"
                              value={np.nome}
                              onChange={(e) => handleUpdateNomePopular(np.id, e.target.value)}
                              placeholder={`ex: ${idx === 0 ? 'Arara-canindé' : 'Arara-amarela'}`}
                              className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                            />
                          </InputWrapper>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveNomePopular(np.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Remover nome"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500">
                O nome popular principal é utilizado nas listagens resumidas de animais e pesquisas rápidas.
              </p>
            </div>
          </Section>

          {/* Seção 3: Classificações de Ameaça em Listas Oficiais (C007) */}
          <Section
            title="3. Classificações de Ameaça (Listas Oficiais)"
            description="Vincule as classificações de conservação vigentes."
            headerActions={
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddClassificacaoAmeaca}
                className="text-xs h-8 text-[#0F4C3A] border-[#0F4C3A]/30 hover:bg-[#0F4C3A]/5 font-semibold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Adicionar Classificação
              </Button>
            }
          >
            <div className="p-4 space-y-3">
              {formClassificacoesAmeaca.length === 0 ? (
                <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                  <ShieldAlert className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-700">Nenhuma classificação oficial vinculada</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Caso a espécie conste na Lista Nacional (MMA), Estadual (Bahia), CITES ou IUCN, clique no botão acima para adicionar.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddClassificacaoAmeaca}
                    className="mt-3 text-xs"
                  >
                    + Vincular Lista Oficial
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                        <th className="py-2.5 px-3 w-48">Lista Oficial (Fonte)</th>
                        <th className="py-2.5 px-3 w-56">Categoria de Ameaça</th>
                        <th className="py-2.5 px-3">Ato Normativo / Ano</th>
                        <th className="py-2.5 px-3 w-16 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formClassificacoesAmeaca.map((ca) => (
                        <tr key={ca.id} className="hover:bg-slate-50/50">
                          {/* Lista Oficial */}
                          <td className="py-2 px-3">
                            <select
                              value={ca.listaOficial}
                              onChange={(e) =>
                                handleUpdateClassificacaoAmeaca(ca.id, 'listaOficial', e.target.value)
                              }
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                            >
                              {LISTAS_OFICIAIS.map((lo) => (
                                <option key={lo} value={lo}>
                                  {lo}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Categoria de Ameaça (ÚNICA DENTRO DA TABELA, SEM DUPLICAÇÃO FORA) */}
                          <td className="py-2 px-3">
                            <select
                              value={ca.categoria}
                              onChange={(e) =>
                                handleUpdateClassificacaoAmeaca(ca.id, 'categoria', e.target.value)
                              }
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                            >
                              {CATEGORIAS_AMEACA.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Ato Normativo / Ano */}
                          <td className="py-2 px-3">
                            <InputWrapper className="w-full">
                              <input
                                type="text"
                                value={ca.atoNormativoAno}
                                onChange={(e) =>
                                  handleUpdateClassificacaoAmeaca(ca.id, 'atoNormativoAno', e.target.value)
                                }
                                placeholder="ex: Portaria MMA nº 148/2022"
                                className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                              />
                            </InputWrapper>
                          </td>

                          {/* Remover */}
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveClassificacaoAmeaca(ca.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              title="Remover classificação"
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

          {/* Seção 4: Regras Ecológicas, Manejo e Soltura (C008 e C009) */}
          <Section
            title="4. Regras Ecológicas & Restrições de Soltura"
            description="Critérios operacionais para quarentena, destinação e reintegração da espécie na natureza."
          >
            <div className="p-4 space-y-4">
              {/* C008 - Exótica / Invasora */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">Espécie Exótica ou Invasora</span>
                    {formExoticaInvasora && (
                      <Badge color="danger" size="sm">
                        Alto Risco Ecológico
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Indica espécie não nativa com restrição estrita de soltura e exigência de autorização especial.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formExoticaInvasora}
                    onChange={(e) => setFormExoticaInvasora(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0F4C3A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F4C3A]"></div>
                </label>
              </div>

              {/* C009 - Restrições de Soltura */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-800">
                    Restrições de Soltura <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {formRestricoesSoltura.length} caracteres
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formRestricoesSoltura}
                  onChange={(e) => setFormRestricoesSoltura(e.target.value)}
                  placeholder="Descreva as restrições aplicáveis (ex.: bacia hidrográfica permitida, proibição total de soltura, quarentena mínima de 30 dias, exames sanitários obrigatórios para Clamidiose/PCR)..."
                  className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] text-slate-900 placeholder:text-slate-400 leading-relaxed"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Campo obrigatório para orientar os laudos de destinação e soltura.
                </span>
              </div>
            </div>
          </Section>

          {/* Seção 5: Observações e Justificativa de Edição (C010 e C011) */}
          <Section
            title="5. Observações & Auditoria"
            description="Informações complementares e justificativa formal de alteração."
          >
            <div className="p-4 space-y-4">
              {/* C010 - Observações */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Observações Gerais da Espécie
                </label>
                <textarea
                  rows={3}
                  value={formObservacoes}
                  onChange={(e) => setFormObservacoes(e.target.value)}
                  placeholder="Informações complementares sobre biologia, histórico de apreensões ou manejo no CETAS (até 2.000 caracteres)..."
                  className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* C011 - Justificativa de Edição Excepcional (Apenas se editando registro definitivo) */}
              {isEditing && formStatusOriginal === 'definitivo' && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="text-xs font-bold text-amber-900">
                      Justificativa de Alteração <span className="text-rose-500">*</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Este registro já foi salvo como Definitivo. Qualquer alteração em dados taxonômicos ou regras de soltura exige justificativa expressa.
                  </p>
                  <textarea
                    rows={2}
                    value={formJustificativaEdicao}
                    onChange={(e) => setFormJustificativaEdicao(e.target.value)}
                    placeholder="Informe detalhadamente o motivo da alteração cadastral..."
                    className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900"
                  />
                </div>
              )}
            </div>
          </Section>

          {/* Rodapé de Ações do Formulário */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Campos marcados com <span className="text-rose-500 font-bold">*</span> são de preenchimento obrigatório.
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('listagem')}
                className="text-xs h-9"
              >
                Cancelar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSalvar('rascunho')}
                className="text-xs h-9 border-slate-300 text-slate-700"
              >
                Salvar Rascunho
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSalvar('definitivo')}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold text-xs h-9 px-5 shadow-xs"
              >
                Salvar Definitivo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DRAWER LATERAL DE DETALHES (NÍVEL 1)                       */}
      {/* ========================================================= */}
      <GlaDrawer
        isOpen={drawerEspecie !== null}
        onClose={() => setDrawerEspecie(null)}
        title={drawerEspecie ? drawerEspecie.nomeCientifico : 'Detalhes da Espécie'}
        subtitle={drawerEspecie ? `${drawerEspecie.codigo} · ${drawerEspecie.nomesPopulares.find((n) => n.principal)?.nome || 'Sem nome popular'}` : ''}
        width="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDrawerEspecie(null)}
              className="text-xs"
            >
              Fechar
            </Button>
            {drawerEspecie && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = drawerEspecie;
                  setDrawerEspecie(null);
                  handleEditarRegistro(target);
                }}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Editar Espécie
              </Button>
            )}
          </div>
        }
      >
        {drawerEspecie && (
          <div className="space-y-5 text-xs text-slate-700">
            {/* Status e Tags */}
            <div className="flex flex-wrap items-center gap-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <Badge color={drawerEspecie.situacao === 'Ativo' ? 'success' : 'gray'} dot>
                {drawerEspecie.situacao}
              </Badge>
              <Badge color={drawerEspecie.statusRegistro === 'definitivo' ? 'primary' : 'gray'}>
                Registro {drawerEspecie.statusRegistro === 'definitivo' ? 'Definitivo' : 'Rascunho'}
              </Badge>
              {drawerEspecie.exoticaInvasora && (
                <Badge color="danger">Exótica / Invasora</Badge>
              )}
              {drawerEspecie.taxonSuperior && (
                <Badge color="warning">Táxon Superior</Badge>
              )}
            </div>

            {/* 1. Taxonomia */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 border-b pb-1">
                Classificação Taxonômica
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Classe:</span>
                  <span className="font-semibold text-slate-800">{drawerEspecie.classe}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Ordem:</span>
                  <span className="font-semibold text-slate-800">{drawerEspecie.ordem}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Família:</span>
                  <span className="font-semibold text-slate-800">{drawerEspecie.familia}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Gênero:</span>
                  <span className="font-semibold italic text-slate-800">{drawerEspecie.genero}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Grupo Animal:</span>
                  <span className="font-semibold text-slate-800">{drawerEspecie.grupoAnimal}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Autor / Ano:</span>
                  <span className="font-mono text-slate-800">{drawerEspecie.autorAno || '—'}</span>
                </div>
              </div>
            </div>

            {/* 2. Nomes Populares */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 border-b pb-1">
                Nomes Populares ({drawerEspecie.nomesPopulares.length})
              </h4>
              <ul className="space-y-1">
                {drawerEspecie.nomesPopulares.map((np) => (
                  <li key={np.id} className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-200/60">
                    <span className="font-medium text-slate-800">{np.nome}</span>
                    {np.principal && (
                      <span className="text-[10px] font-semibold text-[#0F4C3A] bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        Principal
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Classificações de Ameaça */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 border-b pb-1">
                Classificações em Listas Oficiais
              </h4>
              {drawerEspecie.classificacoesAmeaca.length === 0 ? (
                <p className="text-slate-400 italic">Sem classificação de ameaça vinculada.</p>
              ) : (
                <div className="space-y-1.5">
                  {drawerEspecie.classificacoesAmeaca.map((ca) => (
                    <div key={ca.id} className="p-2 rounded bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{ca.listaOficial}</span>
                        <Badge color={ca.categoria.includes('CR') || ca.categoria.includes('Apêndice I') ? 'danger' : 'warning'} size="xs">
                          {ca.categoria}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
                        Ato: {ca.atoNormativoAno}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Restrições de Soltura */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 border-b pb-1">
                Restrições de Soltura
              </h4>
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-950 leading-relaxed font-medium">
                {drawerEspecie.restricoesSoltura}
              </div>
            </div>

            {/* 5. Observações */}
            {drawerEspecie.observacoes && (
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 border-b pb-1">
                  Observações Gerais
                </h4>
                <p className="text-slate-600 leading-relaxed p-2.5 bg-slate-50 rounded border border-slate-200">
                  {drawerEspecie.observacoes}
                </p>
              </div>
            )}

            {/* Metadados */}
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Cadastrado em: {drawerEspecie.dataCadastro}</span>
              {drawerEspecie.atualizadoEm && <span>Atualizado em: {drawerEspecie.atualizadoEm}</span>}
            </div>
          </div>
        )}
      </GlaDrawer>

      {/* ========================================================= */}
      {/* MODAL DE HISTÓRICO DE AUDITORIA                           */}
      {/* ========================================================= */}
      {historicoEspecie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#0F4C3A]" />
                <h3 className="font-bold text-slate-900 text-sm">Histórico de Alterações</h3>
              </div>
              <button
                type="button"
                onClick={() => setHistoricoEspecie(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Registro: <strong className="italic">{historicoEspecie.nomeCientifico}</strong> ({historicoEspecie.codigo})
              </p>

              <div className="space-y-2 border-l-2 border-emerald-600 pl-3">
                <div className="text-[11px]">
                  <span className="font-bold text-slate-800">Criação do Registro</span>
                  <span className="text-slate-400 block font-mono">{historicoEspecie.dataCadastro} às 10:14 por Biólogo / Analista DISUC</span>
                  <span className="text-slate-500">Status inicial: {historicoEspecie.statusRegistro}</span>
                </div>
                {historicoEspecie.atualizadoEm && (
                  <div className="text-[11px] pt-1">
                    <span className="font-bold text-slate-800">Revisão Taxonômica & Classificações</span>
                    <span className="text-slate-400 block font-mono">{historicoEspecie.atualizadoEm} às 16:42 por Coordenação de Fauna</span>
                    {historicoEspecie.justificativaEdicao && (
                      <span className="text-amber-800 block italic bg-amber-50 p-1.5 rounded mt-1">
                        "{historicoEspecie.justificativaEdicao}"
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setHistoricoEspecie(null)} className="text-xs">
                Fechar Histórico
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
