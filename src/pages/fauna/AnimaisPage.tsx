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
  ShieldAlert,
  ShieldCheck,
  Tag,
  MapPin,
  Building2,
  History,
  Activity,
  HeartPulse,
  Home,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  MOCK_ANIMAIS,
  MOCK_ESPECIES,
  MOCK_UNIDADES,
  MOCK_PROCEDENCIAS,
  AnimalItem,
  MarcacaoFisicaItem,
  StatusAnimal,
  SexoAnimal,
  FaixaEtariaAnimal,
  GrupoAnimal,
} from '@/data/faunaMock';

const REGIONAIS_BAHIA = [
  { sigla: 'UR-MET', nome: 'UR Metropolitana (Salvador / RMS)' },
  { sigla: 'UR-SUL', nome: 'UR Sul (Ilhéus / Porto Seguro / Itabuna)' },
  { sigla: 'UR-OES', nome: 'UR Oeste (Barreiras / Luís Eduardo)' },
  { sigla: 'UR-NOR', nome: 'UR Norte (Juazeiro / Senhor do Bonfim)' },
  { sigla: 'UR-SUD', nome: 'UR Sudoeste (Vitória da Conquista / Jequié)' },
  { sigla: 'UR-REC', nome: 'UR Recôncavo (Feira de Santana / Cruz das Almas)' },
  { sigla: 'UR-CHP', nome: 'UR Chapada Diamantina (Lençóis / Seabra)' },
] as const;

const TIPOS_MARCACAO_OPCOES = ['Microchip', 'Anilha', 'Tatuagem', 'Brinco', 'Colar'] as const;
const SITUACOES_MARCACAO_OPCOES = ['Ativa', 'Perdida', 'Danificada'] as const;
const SEXOS_OPCOES: SexoAnimal[] = ['Macho', 'Fêmea', 'Indeterminado'];
const FAIXAS_ETARIAS_OPCOES: FaixaEtariaAnimal[] = ['Filhote', 'Jovem', 'Adulto', 'Senil', 'Indeterminada'];
const STATUS_ANIMAL_OPCOES: StatusAnimal[] = ['Em Quarentena', 'Em Tratamento', 'Apto para Soltura', 'Destinado', 'Óbito'];

interface AnimaisPageProps {
  onNavigate?: (route: string) => void;
}

export const AnimaisPage: React.FC<AnimaisPageProps> = ({ onNavigate }) => {
  // Estado de navegação: 'listagem' (TL001) | 'formulario' (TL002)
  const [viewMode, setViewMode] = useState<'listagem' | 'formulario'>('listagem');

  // Base de dados local
  const [animais, setAnimais] = useState<AnimalItem[]>(MOCK_ANIMAIS);

  // Filtros TL001
  const [busca, setBusca] = useState('');
  const [filtroUnidade, setFiltroUnidade] = useState<string>('todas');
  const [filtroProcedencia, setFiltroProcedencia] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroSigilo, setFiltroSigilo] = useState<string>('todos');
  const [filtroCandidatoGuarda, setFiltroCandidatoGuarda] = useState<string>('todos');

  // Drawer Nível 1 - Prontuário Animal
  const [drawerAnimal, setDrawerAnimal] = useState<AnimalItem | null>(null);

  // Modal Nível 2 - Histórico de Movimentações e Manejos
  const [modalHistoricoAnimal, setModalHistoricoAnimal] = useState<AnimalItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // ESTADO DO FORMULÁRIO TL002 (NOVO / EDITAR ANIMAL)
  // Regras de Ouro DR001:
  // - Código oficial UR-XXX-000001 gerado pelo sistema (somente leitura)
  // - Marcações físicas em tabela separada
  // - Status, Unidade Atual e Procedência somente leitura / derivados
  // - Sigilo e Candidato à Guarda padrão DESLIGADO (restrito Gestor)
  // -------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 1. Identificação Oficial
  const [formRegional, setFormRegional] = useState<string>('UR-MET');
  const [formCodigo, setFormCodigo] = useState<string>('UR-MET-000006');
  const [formIdentificacaoComplementar, setFormIdentificacaoComplementar] = useState<string>('');

  // 2. Taxonomia (integrada ao DR002)
  const [formEspecieId, setFormEspecieId] = useState<string>('');
  const [formIdentificacaoAConfirmar, setFormIdentificacaoAConfirmar] = useState<boolean>(false);

  // 3. Características Biológicas
  const [formSexo, setFormSexo] = useState<SexoAnimal>('Indeterminado');
  const [formFaixaEtaria, setFormFaixaEtaria] = useState<FaixaEtariaAnimal>('Indeterminada');
  const [formOrigemUf, setFormOrigemUf] = useState<string>('BA');
  const [formOrigemMunicipio, setFormOrigemMunicipio] = useState<string>('Salvador');

  // 4. Marcações Físicas (Tabela Editável Separada - Regra de Ouro DR001)
  const [formMarcacoes, setFormMarcacoes] = useState<MarcacaoFisicaItem[]>([]);

  // 5. Alocação e Origem Operacional (Somente Leitura / Derivado)
  const [formUnidadeAtualId, setFormUnidadeAtualId] = useState<string>('und-01');
  const [formProcedenciaId, setFormProcedenciaId] = useState<string>('proc-01');
  const [formStatus, setFormStatus] = useState<StatusAnimal>('Em Quarentena');

  // 6. Salvaguardas Restritas ao Gestor de Fauna (Padrão DESLIGADO - Regra de Ouro)
  const [formSigilo, setFormSigilo] = useState<boolean>(false);
  const [formJustificativaSigilo, setFormJustificativaSigilo] = useState<string>('');
  const [formCandidatoGuarda, setFormCandidatoGuarda] = useState<boolean>(false);
  const [formObservacoes, setFormObservacoes] = useState<string>('');

  // Erros de validação
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Espécie selecionada e derivação automática do Grupo Taxonômico (RN-005)
  const especieSelecionada = useMemo(() => {
    return MOCK_ESPECIES.find((esp) => esp.id === formEspecieId) || null;
  }, [formEspecieId]);

  const grupoTaxonomicoDerivado: GrupoAnimal | '-' = useMemo(() => {
    return especieSelecionada?.grupoAnimal || '-';
  }, [especieSelecionada]);

  // Atualização dinâmica do código gerado ao trocar a regional
  const handleTrocaRegional = (novaSigla: string) => {
    setFormRegional(novaSigla);
    if (!isEditing) {
      const sufixoRandom = Math.floor(100000 + Math.random() * 900000);
      setFormCodigo(`${novaSigla}-${sufixoRandom}`);
    }
  };

  // Abrir Formulário de Novo Animal
  const handleNovoAnimal = () => {
    setIsEditing(false);
    setEditingId(null);

    const regionalInicial = 'UR-MET';
    const sufixoRandom = Math.floor(100000 + Math.random() * 900000);

    setFormRegional(regionalInicial);
    setFormCodigo(`${regionalInicial}-${sufixoRandom}`);
    setFormIdentificacaoComplementar('');

    setFormEspecieId('');
    setFormIdentificacaoAConfirmar(false);

    setFormSexo('Indeterminado');
    setFormFaixaEtaria('Indeterminada');
    setFormOrigemUf('BA');
    setFormOrigemMunicipio('Salvador');

    // Regra de Ouro: Marcações físicas começam vazias
    setFormMarcacoes([]);

    // Alocação inicial
    setFormUnidadeAtualId('und-01');
    setFormProcedenciaId('proc-01');
    setFormStatus('Em Quarentena');

    // Regra de Ouro DR001: Padrão DESLIGADO para Sigilo e Candidato à Guarda
    setFormSigilo(false);
    setFormJustificativaSigilo('');
    setFormCandidatoGuarda(false);
    setFormObservacoes('');

    setFormErrors({});
    setViewMode('formulario');
  };

  // Abrir Formulário de Edição
  const handleEditarAnimal = (animal: AnimalItem) => {
    setIsEditing(true);
    setEditingId(animal.id);

    setFormRegional(animal.unidadeRegional || 'UR-MET');
    setFormCodigo(animal.codigo);
    setFormIdentificacaoComplementar(animal.identificacaoComplementar || '');

    setFormEspecieId(animal.especieId);
    setFormIdentificacaoAConfirmar(animal.identificacaoAConfirmar);

    setFormSexo(animal.sexo);
    setFormFaixaEtaria(animal.faixaEtaria);
    setFormOrigemUf(animal.origemUf);
    setFormOrigemMunicipio(animal.origemMunicipio);

    setFormMarcacoes([...animal.marcacoesFisicas]);

    setFormUnidadeAtualId(animal.unidadeAtualId);
    setFormProcedenciaId(animal.procedenciaId);
    setFormStatus(animal.status);

    setFormSigilo(animal.sigilo);
    setFormJustificativaSigilo(animal.justificativaSigilo || '');
    setFormCandidatoGuarda(animal.candidatoGuarda);
    setFormObservacoes(animal.observacoes || '');

    setFormErrors({});
    if (drawerAnimal) setDrawerAnimal(null);
    setViewMode('formulario');
  };

  // Manipulação da Tabela de Marcações Físicas
  const handleAdicionarMarcacao = () => {
    const nova: MarcacaoFisicaItem = {
      id: `mf-${Date.now().toString().slice(-4)}`,
      tipo: 'Microchip',
      numero: '',
      dataAplicacao: new Date().toLocaleDateString('pt-BR'),
      situacao: 'Ativa',
    };
    setFormMarcacoes((prev) => [...prev, nova]);
  };

  const handleRemoverMarcacao = (index: number) => {
    setFormMarcacoes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAlterarMarcacao = (
    index: number,
    campo: keyof MarcacaoFisicaItem,
    valor: any
  ) => {
    setFormMarcacoes((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item))
    );
  };

  // Salvar Animal
  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    const erros: Record<string, string> = {};

    if (!formEspecieId) {
      erros.especie = 'A espécie é obrigatória conforme RN-004.';
    }

    if (!formOrigemUf.trim()) {
      erros.origemUf = 'O estado de origem geográfica é obrigatório.';
    }

    if (!formOrigemMunicipio.trim()) {
      erros.origemMunicipio = 'O município de origem geográfica é obrigatório.';
    }

    if (formSigilo && !formJustificativaSigilo.trim()) {
      erros.justificativaSigilo = 'A justificativa do sigilo é obrigatória pelo Gestor (RN-013).';
    }

    // Validar marcações físicas (se houver linhas, o número é obrigatório)
    for (let i = 0; i < formMarcacoes.length; i++) {
      if (!formMarcacoes[i].numero.trim()) {
        erros.marcacoes = `O número da marcação física #${i + 1} é obrigatório.`;
        break;
      }
    }

    if (Object.keys(erros).length > 0) {
      setFormErrors(erros);
      return;
    }

    const especie = MOCK_ESPECIES.find((esp) => esp.id === formEspecieId)!;
    const unidade = MOCK_UNIDADES.find((u) => u.id === formUnidadeAtualId)!;
    const procedencia = MOCK_PROCEDENCIAS.find((p) => p.id === formProcedenciaId)!;
    const regionalObj = REGIONAIS_BAHIA.find((r) => r.sigla === formRegional);

    if (isEditing && editingId) {
      setAnimais((prev) =>
        prev.map((a) => {
          if (a.id === editingId) {
            return {
              ...a,
              identificacaoComplementar: formIdentificacaoComplementar.trim() || undefined,
              especieId: formEspecieId,
              especieNomeCientifico: especie.nomeCientifico,
              especieNomePopular: especie.nomePopular,
              grupoAnimal: especie.grupoAnimal,
              identificacaoAConfirmar: formIdentificacaoAConfirmar,
              sexo: formSexo,
              faixaEtaria: formFaixaEtaria,
              origemUf: formOrigemUf.trim().toUpperCase(),
              origemMunicipio: formOrigemMunicipio.trim(),
              marcacoesFisicas: formMarcacoes,
              sigilo: formSigilo,
              justificativaSigilo: formSigilo ? formJustificativaSigilo.trim() : undefined,
              candidatoGuarda: formCandidatoGuarda,
              observacoes: formObservacoes.trim() || undefined,
            };
          }
          return a;
        })
      );
      showToast(`Prontuário do animal "${formCodigo}" atualizado com sucesso!`);
    } else {
      const novo: AnimalItem = {
        id: `ani-${Date.now().toString().slice(-4)}`,
        codigo: formCodigo,
        unidadeRegional: regionalObj?.nome || formRegional,
        identificacaoComplementar: formIdentificacaoComplementar.trim() || undefined,
        especieId: formEspecieId,
        especieNomeCientifico: especie.nomeCientifico,
        especieNomePopular: especie.nomePopular,
        grupoAnimal: especie.grupoAnimal,
        identificacaoAConfirmar: formIdentificacaoAConfirmar,
        sexo: formSexo,
        faixaEtaria: formFaixaEtaria,
        origemUf: formOrigemUf.trim().toUpperCase(),
        origemMunicipio: formOrigemMunicipio.trim(),
        marcacoesFisicas: formMarcacoes,
        unidadeAtualId: formUnidadeAtualId,
        unidadeAtualNome: unidade.nome,
        procedenciaId: formProcedenciaId,
        procedenciaNome: `${procedencia.tipo} · ${procedencia.subtipo}`,
        status: formStatus,
        sigilo: formSigilo,
        justificativaSigilo: formSigilo ? formJustificativaSigilo.trim() : undefined,
        candidatoGuarda: formCandidatoGuarda,
        observacoes: formObservacoes.trim() || undefined,
        dataAdmissao: new Date().toLocaleDateString('pt-BR'),
        situacao: 'Ativo',
      };
      setAnimais((prev) => [novo, ...prev]);
      showToast(`Animal "${formCodigo}" cadastrado com sucesso na Base Única!`);
    }

    setViewMode('listagem');
  };

  // Filtragem da Listagem TL001
  const animaisFiltrados = useMemo(() => {
    return animais.filter((a) => {
      const matchBusca =
        busca.trim() === '' ||
        a.codigo.toLowerCase().includes(busca.toLowerCase()) ||
        a.especieNomePopular.toLowerCase().includes(busca.toLowerCase()) ||
        a.especieNomeCientifico.toLowerCase().includes(busca.toLowerCase()) ||
        (a.identificacaoComplementar &&
          a.identificacaoComplementar.toLowerCase().includes(busca.toLowerCase())) ||
        a.marcacoesFisicas.some((m) =>
          m.numero.toLowerCase().includes(busca.toLowerCase())
        );

      const matchUnidade =
        filtroUnidade === 'todas' || a.unidadeAtualId === filtroUnidade;

      const matchProcedencia =
        filtroProcedencia === 'todas' || a.procedenciaId === filtroProcedencia;

      const matchStatus = filtroStatus === 'todos' || a.status === filtroStatus;

      const matchSigilo =
        filtroSigilo === 'todos' ||
        (filtroSigilo === 'com-sigilo' && a.sigilo) ||
        (filtroSigilo === 'sem-sigilo' && !a.sigilo);

      const matchGuarda =
        filtroCandidatoGuarda === 'todos' ||
        (filtroCandidatoGuarda === 'sim' && a.candidatoGuarda) ||
        (filtroCandidatoGuarda === 'nao' && !a.candidatoGuarda);

      return (
        matchBusca &&
        matchUnidade &&
        matchProcedencia &&
        matchStatus &&
        matchSigilo &&
        matchGuarda
      );
    });
  }, [
    animais,
    busca,
    filtroUnidade,
    filtroProcedencia,
    filtroStatus,
    filtroSigilo,
    filtroCandidatoGuarda,
  ]);

  const activeFilterCount =
    (filtroUnidade !== 'todas' ? 1 : 0) +
    (filtroProcedencia !== 'todas' ? 1 : 0) +
    (filtroStatus !== 'todos' ? 1 : 0) +
    (filtroSigilo !== 'todos' ? 1 : 0) +
    (filtroCandidatoGuarda !== 'todos' ? 1 : 0);

  const handleLimparFiltros = () => {
    setBusca('');
    setFiltroUnidade('todas');
    setFiltroProcedencia('todas');
    setFiltroStatus('todos');
    setFiltroSigilo('todos');
    setFiltroCandidatoGuarda('todos');
  };

  // Helper de renderização de Badges de Status (sem cores espalhafatosas ou purple)
  const renderStatusBadge = (status: StatusAnimal) => {
    switch (status) {
      case 'Apto para Soltura':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Apto para Soltura
          </span>
        );
      case 'Em Tratamento':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Em Tratamento
          </span>
        );
      case 'Em Quarentena':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Em Quarentena
          </span>
        );
      case 'Destinado':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Destinado
          </span>
        );
      case 'Óbito':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Óbito
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
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
                  DR001
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  BASE ÚNICA DE FAUNA
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Animais
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Prontuário individual de animais silvestres, taxonomia, marcações físicas, alocação e salvaguardas institucionais.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                onClick={handleNovoAnimal}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs text-xs sm:text-sm h-9 px-4 font-semibold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Novo Animal
              </Button>
            </div>
          </div>

          {/* KPI Cards Sóbrios */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Total no Sistema</span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-1">{animais.length}</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Prontuários registrados</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Em Tratamento</span>
              <p className="text-xl font-bold font-mono text-amber-700 mt-1">
                {animais.filter((a) => a.status === 'Em Tratamento').length}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Acompanhamento clínico</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Aptos para Soltura</span>
              <p className="text-xl font-bold font-mono text-emerald-700 mt-1">
                {animais.filter((a) => a.status === 'Apto para Soltura').length}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Reabilitação finalizada</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Com Sigilo Ativo</span>
              <p className="text-xl font-bold font-mono text-slate-700 mt-1">
                {animais.filter((a) => a.sigilo).length}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Acesso restrito gestor</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Candidatos Guarda</span>
              <p className="text-xl font-bold font-mono text-blue-700 mt-1">
                {animais.filter((a) => a.candidatoGuarda).length}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Perfil não soltável</span>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por código (UR-XXX-000001), espécie, chip/anilha, apelido..."
                  className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                />
              </div>

              <div>
                <select
                  value={filtroUnidade}
                  onChange={(e) => setFiltroUnidade(e.target.value)}
                  className="w-full h-9 text-xs bg-slate-50/60 border border-slate-200 rounded-lg px-2.5 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                >
                  <option value="todas">Todas as Unidades</option>
                  {MOCK_UNIDADES.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full h-9 text-xs bg-slate-50/60 border border-slate-200 rounded-lg px-2.5 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                >
                  <option value="todos">Todos os Status</option>
                  {STATUS_ANIMAL_OPCOES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px] font-medium">Procedência:</span>
                  <select
                    value={filtroProcedencia}
                    onChange={(e) => setFiltroProcedencia(e.target.value)}
                    className="h-8 text-xs bg-slate-50 border border-slate-200 rounded-md px-2 text-slate-700"
                  >
                    <option value="todas">Todas as Procedências</option>
                    {MOCK_PROCEDENCIAS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.tipo} - {p.subtipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px] font-medium">Sigilo:</span>
                  <select
                    value={filtroSigilo}
                    onChange={(e) => setFiltroSigilo(e.target.value)}
                    className="h-8 text-xs bg-slate-50 border border-slate-200 rounded-md px-2 text-slate-700"
                  >
                    <option value="todos">Todos</option>
                    <option value="com-sigilo">Com Sigilo Ativo</option>
                    <option value="sem-sigilo">Sem Sigilo</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px] font-medium">Candidato à Guarda:</span>
                  <select
                    value={filtroCandidatoGuarda}
                    onChange={(e) => setFiltroCandidatoGuarda(e.target.value)}
                    className="h-8 text-xs bg-slate-50 border border-slate-200 rounded-md px-2 text-slate-700"
                  >
                    <option value="todos">Todos</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleLimparFiltros}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                >
                  Limpar filtros ({activeFilterCount})
                </button>
              )}
            </div>
          </div>

          {/* Tabela TL001 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Prontuários Cadastrados ({animaisFiltrados.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Padrão Oficial: Código UR gerado pelo sistema · Marcações físicas em tabela separada
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Código Oficial</th>
                    <th className="px-4 py-3">Espécie / Identificação</th>
                    <th className="px-4 py-3">Sexo / Faixa Etária</th>
                    <th className="px-4 py-3">Unidade Atual</th>
                    <th className="px-4 py-3">Procedência</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Indicadores</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {animaisFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        Nenhum animal encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    animaisFiltrados.map((animal) => (
                      <tr key={animal.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono font-semibold text-slate-900 block">
                            {animal.codigo}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {animal.unidadeRegional}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-900 block">
                            {animal.especieNomePopular}
                          </span>
                          <span className="text-[11px] italic text-slate-500 block">
                            {animal.especieNomeCientifico}
                          </span>
                          {animal.identificacaoComplementar && (
                            <span className="text-[10px] text-slate-500 block">
                              Ref: "{animal.identificacaoComplementar}"
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-slate-800 font-medium">
                            {animal.sexo}
                          </span>
                          <span className="text-slate-400 mx-1">·</span>
                          <span className="text-slate-600">
                            {animal.faixaEtaria}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {animal.origemMunicipio}/{animal.origemUf}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-slate-800 font-medium block">
                            {animal.unidadeAtualNome}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Admitido em: {animal.dataAdmissao}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-slate-700 block max-w-xs truncate" title={animal.procedenciaNome}>
                            {animal.procedenciaNome}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {renderStatusBadge(animal.status)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {animal.sigilo ? (
                              <span
                                title="Sigilo Ativo (Restrito ao Gestor)"
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                              >
                                🔒 Sigilo
                              </span>
                            ) : null}
                            {animal.candidatoGuarda ? (
                              <span
                                title="Candidato à Guarda Doméstica / Criadouro"
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200"
                              >
                                🏠 Guarda
                              </span>
                            ) : null}
                            {!animal.sigilo && !animal.candidatoGuarda && (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setDrawerAnimal(animal)}
                              title="Visualizar Prontuário Completo"
                              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setModalHistoricoAnimal(animal)}
                              title="Histórico de Movimentações e Manejos"
                              className="p-1 text-slate-500 hover:text-blue-700 rounded hover:bg-slate-100 cursor-pointer"
                            >
                              <History className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditarAnimal(animal)}
                              title="Editar Prontuário (Gestor)"
                              className="p-1 text-slate-500 hover:text-[#0F4C3A] rounded hover:bg-slate-100 cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODO FORMULÁRIO (TL002 - NOVO / EDITAR ANIMAL) */}
      {/* ========================================================= */}
      {viewMode === 'formulario' && (
        <form onSubmit={handleSalvar} className="space-y-6">
          {/* Barra de Ação Superior */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setViewMode('listagem')}
                className="text-xs h-8 border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Voltar à Listagem
              </Button>
              <div className="h-4 w-px bg-slate-300" />
              <span className="text-xs font-mono text-slate-500">
                DR001 — {isEditing ? 'EDITAR PRONTUÁRIO DE ANIMAL' : 'NOVO ANIMAL NA BASE ÚNICA'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setViewMode('listagem')}
                className="text-xs h-8 text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="text-xs h-8 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold px-4"
              >
                {isEditing ? 'Atualizar Prontuário' : 'Salvar Animal'}
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Editar Animal: ${formCodigo}` : 'Novo Animal (Base Única de Fauna)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Cadastro e atualização de prontuário físico e biológico de espécime silvestre sob custódia do INEMA.
            </p>
          </div>

          {/* SEÇÃO 1: Identificação Oficial do Animal (Regra de Ouro DR001) */}
          <Section
            title="1. Identificação Oficial do Animal (Regra de Ouro DR001)"
            description="O código UR-XXX-000001 é gerado automaticamente pelo sistema a partir da regional e é estritamente de somente leitura."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unidade Regional Competente <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={isEditing}
                    value={formRegional}
                    onChange={(e) => handleTrocaRegional(e.target.value)}
                    className={cn(
                      'w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800',
                      isEditing && 'bg-slate-100 text-slate-500 cursor-not-allowed'
                    )}
                  >
                    {REGIONAIS_BAHIA.map((reg) => (
                      <option key={reg.sigla} value={reg.sigla}>
                        {reg.nome} ({reg.sigla})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Define o prefixo do código oficial (RN-022).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código Oficial do Animal <span className="text-slate-400 font-normal">(Somente Leitura)</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formCodigo}
                    className="w-full h-9 text-xs font-mono font-bold bg-slate-100 border border-slate-300 rounded-lg px-2.5 text-slate-900 cursor-not-allowed"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Regra de Ouro: Gerado pelo sistema (RN-002), independe de microchip.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Identificação Complementar / Apelido
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={formIdentificacaoComplementar}
                    onChange={(e) => setFormIdentificacaoComplementar(e.target.value)}
                    placeholder="Ex: Juma, Lobo-04, Canindé do Parque..."
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Nome informal para facilitação da equipe de manejo.
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 2: Taxonomia (Integrada ao DR002) */}
          <Section
            title="2. Classificação Taxonômica (Integrada ao DR002)"
            description="Vínculo à espécie oficial homologada no catálogo do INEMA com derivação automática de grupo e ameaça."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Espécie / Táxon Homologado (DR002) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formEspecieId}
                    onChange={(e) => setFormEspecieId(e.target.value)}
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.especie ? 'border-rose-400' : 'border-slate-300'
                    )}
                  >
                    <option value="">Selecione a espécie oficial...</option>
                    {MOCK_ESPECIES.map((esp) => (
                      <option key={esp.id} value={esp.id}>
                        {esp.nomePopular} ({esp.nomeCientifico}) · {esp.grupoAnimal}
                      </option>
                    ))}
                  </select>
                  {formErrors.especie && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.especie}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grupo Taxonômico <span className="text-slate-400 font-normal">(Derivado)</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={grupoTaxonomicoDerivado}
                    className="w-full h-9 text-xs bg-slate-100 border border-slate-300 rounded-lg px-2.5 text-slate-700 font-medium cursor-not-allowed"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Derivado automaticamente da espécie (RN-005).
                  </span>
                </div>
              </div>

              {/* Checkbox Táxon a confirmar */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-confirmar"
                  checked={formIdentificacaoAConfirmar}
                  onChange={(e) => setFormIdentificacaoAConfirmar(e.target.checked)}
                  className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
                />
                <label htmlFor="chk-confirmar" className="text-xs text-slate-700 cursor-pointer">
                  Identificação a confirmar (habilitar caso o exemplar tenha sido identificado apenas até nível de Gênero/Família)
                </label>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 3: Características Biológicas e Origem Geográfica */}
          <Section
            title="3. Características Biológicas e Origem Geográfica"
            description="Dados morfológicos do animal e coordenadas/município de resgate em campo (não confundir com procedência)."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sexo <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formSexo}
                    onChange={(e) => setFormSexo(e.target.value as SexoAnimal)}
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800"
                  >
                    {SEXOS_OPCOES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Faixa Etária <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formFaixaEtaria}
                    onChange={(e) => setFormFaixaEtaria(e.target.value as FaixaEtariaAnimal)}
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800"
                  >
                    {FAIXAS_ETARIAS_OPCOES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Origem - Estado (UF) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formOrigemUf}
                    onChange={(e) => setFormOrigemUf(e.target.value.toUpperCase())}
                    placeholder="Ex: BA"
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 uppercase focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                  {formErrors.origemUf && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.origemUf}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Origem - Município <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formOrigemMunicipio}
                    onChange={(e) => setFormOrigemMunicipio(e.target.value)}
                    placeholder="Ex: Salvador, Porto Seguro..."
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                  {formErrors.origemMunicipio && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.origemMunicipio}</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#0F4C3A] shrink-0 mt-0.5" />
                <span>
                  <strong>Atenção à RN-012:</strong> A Origem Geográfica refere-se ao local físico de captura, avistamento ou habitat original na Bahia. Ela é independente da Procedência de Admissão (ex: se o animal foi apreendido em Feira de Santana, mas sua procedência é de entrega voluntária).
                </span>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 4: Regra de Ouro DR001 — Marcações Físicas em Tabela Separada */}
          <Section
            title="4. Marcações Físicas (Regra de Ouro DR001)"
            description="Tabela editável independente do código oficial. Registre microchips, anilhas, brincos ou tatuagens aplicados no exemplar."
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">
                  Transponders e Dispositivos Físicos ({formMarcacoes.length})
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAdicionarMarcacao}
                  className="text-xs h-8 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Adicionar Marcação Física
                </Button>
              </div>

              {formErrors.marcacoes && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  {formErrors.marcacoes}
                </div>
              )}

              {formMarcacoes.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300 space-y-2">
                  <Tag className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">Nenhuma marcação física cadastrada</p>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    Conforme a Regra de Ouro, animais recém-admitidos podem receber microchips ou anilhas posteriormente durante o manejo clínico.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2 text-left">Tipo de Dispositivo</th>
                        <th className="px-3 py-2 text-left">Número Gravado / Código</th>
                        <th className="px-3 py-2 text-left">Data de Aplicação</th>
                        <th className="px-3 py-2 text-left">Situação</th>
                        <th className="px-3 py-2 text-center w-16">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formMarcacoes.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2">
                            <select
                              value={item.tipo}
                              onChange={(e) => handleAlterarMarcacao(idx, 'tipo', e.target.value)}
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded px-2"
                            >
                              {TIPOS_MARCACAO_OPCOES.map((tp) => (
                                <option key={tp} value={tp}>
                                  {tp}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.numero}
                              onChange={(e) => handleAlterarMarcacao(idx, 'numero', e.target.value)}
                              placeholder="ex: 981098102345678"
                              className="w-full h-8 text-xs font-mono bg-white border border-slate-300 rounded px-2"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.dataAplicacao}
                              onChange={(e) => handleAlterarMarcacao(idx, 'dataAplicacao', e.target.value)}
                              placeholder="DD/MM/AAAA"
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={item.situacao}
                              onChange={(e) => handleAlterarMarcacao(idx, 'situacao', e.target.value)}
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded px-2"
                            >
                              {SITUACOES_MARCACAO_OPCOES.map((sit) => (
                                <option key={sit} value={sit}>
                                  {sit}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoverMarcacao(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Remover marcação"
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

          {/* SEÇÃO 5: Alocação, Procedência e Status Operacional */}
          <Section
            title="5. Alocação e Procedência Institucional"
            description="Campos de controle operacional integrados aos módulos DR003 (Procedência) e DR004 (Unidades)."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unidade de Custódia Atual <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formUnidadeAtualId}
                    onChange={(e) => setFormUnidadeAtualId(e.target.value)}
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800"
                  >
                    {MOCK_UNIDADES.filter((u) => u.natureza === 'Unidade do INEMA').map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} ({u.municipio})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Procedência de Admissão (DR003) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formProcedenciaId}
                    onChange={(e) => setFormProcedenciaId(e.target.value)}
                    className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800"
                  >
                    {MOCK_PROCEDENCIAS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.tipo} · {p.subtipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Operacional do Animal <span className="text-slate-400 font-normal">(Somente Leitura)</span>
                  </label>
                  <div className="h-9 flex items-center px-3 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700">
                    {formStatus}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Atualizado via eventos de manejo e triagem (RN-009).
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 6: Salvaguardas e Gestão Restrita (Regra de Ouro DR001) */}
          <Section
            title="6. Salvaguardas e Gestão Restrita (Regra de Ouro DR001)"
            description="Controles restritos ao perfil de Gestor de Fauna do INEMA com toggles desligados por padrão."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Toggle Sigilo */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">Sigilo de Prontuário</span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          RN-013
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Regra de Ouro: Padrão DESLIGADO. Restringe o prontuário contra vazamentos e operações especiais.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormSigilo((prev) => !prev)}
                      className="cursor-pointer"
                    >
                      {formSigilo ? (
                        <ToggleRight className="w-7 h-7 text-[#0F4C3A]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {formSigilo && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-semibold text-slate-700">
                        Justificativa Obrigatória do Sigilo <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formJustificativaSigilo}
                        onChange={(e) => setFormJustificativaSigilo(e.target.value)}
                        placeholder="Informe a motivação jurídica/técnica (ex: espécime alvo de tráfico internacional, operação policial sigilosa)..."
                        className={cn(
                          'w-full text-xs bg-white border rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                          formErrors.justificativaSigilo ? 'border-rose-400' : 'border-slate-300'
                        )}
                      />
                      {formErrors.justificativaSigilo && (
                        <span className="text-[11px] text-rose-600 block">{formErrors.justificativaSigilo}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Toggle Candidato à Guarda */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">Candidato à Guarda</span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-sky-50 text-sky-800 border border-sky-200">
                          RN-014
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Regra de Ouro: Padrão DESLIGADO. Marca espécime com baixa aptidão de soltura para guarda doméstica/fiel depositário.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormCandidatoGuarda((prev) => !prev)}
                      className="cursor-pointer"
                    >
                      {formCandidatoGuarda ? (
                        <ToggleRight className="w-7 h-7 text-[#0F4C3A]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Observações Gerais */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observações e Histórico Clínico Complementar
                </label>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={formObservacoes}
                  onChange={(e) => setFormObservacoes(e.target.value)}
                  placeholder="Descreva particularidades do animal, histórico de saúde, lesões ou recomendações..."
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                />
              </div>
            </div>
          </Section>

          {/* Rodapé de Ações */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setViewMode('listagem')}
              className="text-xs h-9 text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="text-xs h-9 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold px-6 shadow-xs"
            >
              {isEditing ? 'Atualizar Prontuário' : 'Salvar Animal'}
            </Button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* DRAWER LATERAL NÍVEL 1: PRONTUÁRIO DETALHADO DO ANIMAL */}
      {/* ========================================================= */}
      <GlaDrawer
        isOpen={!!drawerAnimal}
        onClose={() => setDrawerAnimal(null)}
        title={
          drawerAnimal ? (
            <div>
              <span className="font-mono text-xs block text-slate-500">
                {drawerAnimal.codigo}
              </span>
              <span className="text-base font-bold text-slate-900">
                {drawerAnimal.especieNomePopular}
              </span>
              <span className="text-xs italic text-slate-500 block">
                {drawerAnimal.especieNomeCientifico}
              </span>
            </div>
          ) : (
            'Prontuário do Animal'
          )
        }
        size="md"
        footer={
          drawerAnimal && (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDrawerAnimal(null)}
                className="text-xs h-8 border-slate-300 text-slate-700"
              >
                Fechar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleEditarAnimal(drawerAnimal)}
                className="text-xs h-8 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Editar Prontuário
              </Button>
            </div>
          )
        }
      >
        {drawerAnimal && (
          <div className="space-y-6 text-xs">
            {/* Badges de Estado */}
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-200">
              {renderStatusBadge(drawerAnimal.status)}
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {drawerAnimal.grupoAnimal}
              </span>
              {drawerAnimal.sigilo && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  🔒 Sigilo Ativo
                </span>
              )}
              {drawerAnimal.candidatoGuarda && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                  🏠 Candidato à Guarda
                </span>
              )}
            </div>

            {/* Informações Básicas */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
                Características Biológicas
              </span>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Sexo:</span>
                  <span className="font-semibold text-slate-800">{drawerAnimal.sexo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Faixa Etária:</span>
                  <span className="font-semibold text-slate-800">{drawerAnimal.faixaEtaria}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Origem Geográfica:</span>
                  <span className="font-semibold text-slate-800">
                    {drawerAnimal.origemMunicipio} / {drawerAnimal.origemUf}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Data de Admissão:</span>
                  <span className="font-semibold text-slate-800">{drawerAnimal.dataAdmissao}</span>
                </div>
              </div>
            </div>

            {/* Alocação e Procedência */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
                Custódia e Procedência
              </span>
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Unidade Atual:</span>
                  <span className="font-semibold text-slate-800">{drawerAnimal.unidadeAtualNome}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Procedência de Entrada:</span>
                  <span className="text-slate-800">{drawerAnimal.procedenciaNome}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Regional do Registro:</span>
                  <span className="text-slate-700">{drawerAnimal.unidadeRegional}</span>
                </div>
              </div>
            </div>

            {/* Marcações Físicas Registradas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Marcações Físicas ({drawerAnimal.marcacoesFisicas.length})
                </span>
              </div>
              {drawerAnimal.marcacoesFisicas.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 text-center">
                  Nenhum transponder ou anilha física cadastrado.
                </div>
              ) : (
                <div className="space-y-2">
                  {drawerAnimal.marcacoesFisicas.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-slate-900 block">{m.numero}</span>
                        <span className="text-[11px] text-slate-500">
                          {m.tipo} · Aplicado em {m.dataAplicacao}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {m.situacao}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sigilo Detalhado */}
            {drawerAnimal.sigilo && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
                <span className="font-semibold text-amber-900 block text-xs">
                  Motivação do Sigilo Institucional
                </span>
                <p className="text-[11px] text-amber-800">
                  {drawerAnimal.justificativaSigilo || 'Sigilo determinado pelo Gestor de Fauna do INEMA.'}
                </p>
              </div>
            )}

            {/* Observações */}
            {drawerAnimal.observacoes && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
                  Observações Clínicas e Comportamentais
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {drawerAnimal.observacoes}
                </p>
              </div>
            )}
          </div>
        )}
      </GlaDrawer>

      {/* ========================================================= */}
      {/* MODAL NÍVEL 2: HISTÓRICO DE MANEJOS E MOVIMENTAÇÕES */}
      {/* ========================================================= */}
      <Dialog
        open={!!modalHistoricoAnimal}
        onOpenChange={(open) => !open && setModalHistoricoAnimal(null)}
      >
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Histórico Operacional: {modalHistoricoAnimal?.codigo}
            </DialogTitle>
          </DialogHeader>

          {modalHistoricoAnimal && (
            <div className="space-y-4 text-xs py-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900">
                  {modalHistoricoAnimal.especieNomePopular}
                </span>{' '}
                <span className="italic text-slate-600">({modalHistoricoAnimal.especieNomeCientifico})</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Custódia atual em: {modalHistoricoAnimal.unidadeAtualNome}
                </span>
              </div>

              <div className="space-y-3">
                <span className="font-semibold text-slate-700 block">Linha do Tempo de Eventos:</span>
                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#0F4C3A]" />
                    <span className="text-[11px] text-slate-400 block font-mono">15/06/2024 · 14:30</span>
                    <span className="font-semibold text-slate-800">Avaliação Clínica e Triagem Inicial</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Realizado exame físico geral, pesagem e triagem parasitológica. Animal alocado no Recinto de Quarentena.
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className="text-[11px] text-slate-400 block font-mono">18/06/2024 · 09:15</span>
                    <span className="font-semibold text-slate-800">Aplicação de Marcação Física</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Transponder microchip estéril implantado na região peitoral com conferência via leitora biométrica.
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span className="text-[11px] text-slate-400 block font-mono">22/07/2024 · 11:00</span>
                    <span className="font-semibold text-slate-800">Transferência para Viveiro de Voo</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Animal transferido do Quarentenário para o Viveiro de Reabilitação para treino muscular pré-soltura.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalHistoricoAnimal(null)}
              className="text-xs h-8 border-slate-300 text-slate-700"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnimaisPage;
