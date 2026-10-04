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
  FileText,
  FileCheck,
  FileSignature,
  FileCode,
  Lock,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Tag,
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
  MOCK_DOCUMENTOS_TERMOS,
  MOCK_UNIDADES,
  DocumentoTermoItem,
  NaturezaDocTermo,
} from '@/data/faunaMock';

const VARIAVEIS_DISPONIVEIS = [
  { tag: '[NOME_ANIMAL]', desc: 'Nome ou identificação complementar' },
  { tag: '[CODIGO_ANIMAL]', desc: 'Código oficial UR-XXX-000001' },
  { tag: '[ESPECIE_ANIMAL]', desc: 'Nome científico e popular da espécie' },
  { tag: '[UNIDADE_INEMA]', desc: 'Nome do CETAS ou Regional' },
  { tag: '[DESTINO_EXTERNO]', desc: 'Nome da ASAS, Zoo ou Criadouro' },
  { tag: '[DATA_ATUAL]', desc: 'Data do evento por extenso' },
  { tag: '[RESPONSAVEL_TECNICO]', desc: 'Nome e CRMV/CRBio do técnico' },
  { tag: '[ENTREGADOR_AUTUADO]', desc: 'Nome e CPF do cidadão ou autuado' },
];

const SIGNATARIOS_OPCOES = [
  'Técnico Responsável do INEMA',
  'Coordenador do CETAS',
  'Entregador / Cidadão',
  'Agente Autuante (COPPA / PM / DIFIS)',
  'Fiel Depositário',
  'Responsável Técnico do Destino',
  'Testemunhas',
];

interface DocumentosTermosPageProps {
  onNavigate?: (route: string) => void;
}

export const DocumentosTermosPage: React.FC<DocumentosTermosPageProps> = ({ onNavigate }) => {
  // Estado de tela: 'listagem' (TL001) | 'formulario' (TL002)
  const [viewMode, setViewMode] = useState<'listagem' | 'formulario'>('listagem');

  // Base de dados local
  const [documentos, setDocumentos] = useState<DocumentoTermoItem[]>(MOCK_DOCUMENTOS_TERMOS);

  // Filtros TL001
  const [busca, setBusca] = useState('');
  const [filtroNatureza, setFiltroNatureza] = useState<string>('todos');
  const [filtroAssinatura, setFiltroAssinatura] = useState<string>('todos');
  const [filtroAnexoObrigatorio, setFiltroAnexoObrigatorio] = useState<string>('todos');
  const [filtroSituacao, setFiltroSituacao] = useState<string>('todos');

  // Drawer Nível 1
  const [drawerDoc, setDrawerDoc] = useState<DocumentoTermoItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // ESTADO DO FORMULÁRIO TL002 (NOVO / EDITAR)
  // Regra de Ouro DR007:
  // - Natureza TRAVA após o primeiro uso/salvamento (disabled na edição com aviso)
  // - Versão gerada pelo sistema (somente leitura)
  // - Validade expressa em DIAS
  // -------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [naturezaTravada, setNaturezaTravada] = useState(false);

  // Campos
  const [formNatureza, setFormNatureza] = useState<NaturezaDocTermo>('Documento anexado');
  const [formNome, setFormNome] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [formUnidadesTipo, setFormUnidadesTipo] = useState<'todas' | 'especificas'>('todas');
  const [formUnidadesSelecionadas, setFormUnidadesSelecionadas] = useState<string[]>([]);
  const [formAnexoObrigatorio, setFormAnexoObrigatorio] = useState(false);

  // Campos específicos de Termo Emitido
  const [formModeloTermo, setFormModeloTermo] = useState('');
  const [formVersaoVigente, setFormVersaoVigente] = useState('v1.0');
  const [formInicioVigencia, setFormInicioVigencia] = useState(new Date().toLocaleDateString('pt-BR'));
  const [formValidadeDias, setFormValidadeDias] = useState<number>(365);
  const [formExigeAssinatura, setFormExigeAssinatura] = useState(false);
  const [formFormaAssinatura, setFormFormaAssinatura] = useState<'Digital Gov.br' | 'Upload assinado' | 'Ambas'>('Digital Gov.br');
  const [formSignatarios, setFormSignatarios] = useState<string[]>([SIGNATARIOS_OPCOES[0]]);

  // Situação
  const [formSituacao, setFormSituacao] = useState<'Ativo' | 'Inativo'>('Ativo');

  // Erros
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isTermoEmitido = formNatureza === 'Termo emitido';

  // Iniciar criação
  const handleNovoRegistro = () => {
    setIsEditing(false);
    setEditingId(null);
    setNaturezaTravada(false);
    setFormNatureza('Documento anexado');
    setFormNome('');
    setFormDescricao('');
    setFormUnidadesTipo('todas');
    setFormUnidadesSelecionadas([]);
    setFormAnexoObrigatorio(false);
    setFormModeloTermo('');
    setFormVersaoVigente('v1.0');
    setFormInicioVigencia(new Date().toLocaleDateString('pt-BR'));
    setFormValidadeDias(365);
    setFormExigeAssinatura(false);
    setFormFormaAssinatura('Digital Gov.br');
    setFormSignatarios([SIGNATARIOS_OPCOES[0]]);
    setFormSituacao('Ativo');
    setFormErrors({});
    setViewMode('formulario');
  };

  // Iniciar edição
  const handleEditarRegistro = (doc: DocumentoTermoItem) => {
    setIsEditing(true);
    setEditingId(doc.id);
    setNaturezaTravada(doc.travadoEdicao);
    setFormNatureza(doc.natureza);
    setFormNome(doc.nome);
    setFormDescricao(doc.descricao || '');
    if (doc.unidadesAplicaveis === 'todas') {
      setFormUnidadesTipo('todas');
      setFormUnidadesSelecionadas([]);
    } else {
      setFormUnidadesTipo('especificas');
      setFormUnidadesSelecionadas(doc.unidadesAplicaveis);
    }
    setFormAnexoObrigatorio(doc.anexoObrigatorio);
    setFormModeloTermo(doc.modeloTermo || '');
    setFormVersaoVigente(doc.versaoVigente);
    setFormInicioVigencia(doc.inicioVigencia || new Date().toLocaleDateString('pt-BR'));
    setFormValidadeDias(doc.validadeDias || 365);
    setFormExigeAssinatura(doc.exigeAssinatura);
    setFormFormaAssinatura(doc.formaAssinatura || 'Digital Gov.br');
    setFormSignatarios(doc.signatarios || [SIGNATARIOS_OPCOES[0]]);
    setFormSituacao(doc.situacao);
    setFormErrors({});
    if (drawerDoc) setDrawerDoc(null);
    setViewMode('formulario');
  };

  // Alternar situação
  const handleAlternarSituacao = (id: string) => {
    setDocumentos((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nova = d.situacao === 'Ativo' ? 'Inativo' : 'Ativo';
          showToast(`Situação de "${d.nome}" alterada para ${nova}.`);
          return { ...d, situacao: nova };
        }
        return d;
      })
    );
  };

  // Inserir tag no modelo de termo
  const handleInserirVariavel = (tag: string) => {
    setFormModeloTermo((prev) => prev + ` ${tag}`);
  };

  // Toggle signatário
  const handleToggleSignatario = (sig: string) => {
    setFormSignatarios((prev) =>
      prev.includes(sig) ? prev.filter((s) => s !== sig) : [...prev, sig]
    );
  };

  // Toggle unidade
  const handleToggleUnidade = (uid: string) => {
    setFormUnidadesSelecionadas((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  // Validação
  const validarFormulario = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formNome.trim()) errors.formNome = 'Informe o nome do documento ou termo.';
    if (formUnidadesTipo === 'especificas' && formUnidadesSelecionadas.length === 0) {
      errors.formUnidades = 'Selecione pelo menos uma unidade aplicável.';
    }

    if (isTermoEmitido) {
      if (!formModeloTermo.trim()) {
        errors.formModeloTermo = 'O modelo do termo é obrigatório para termos emitidos (RN-003).';
      }
      if (!formInicioVigencia.trim()) {
        errors.formInicioVigencia = 'A data de início de vigência é obrigatória.';
      }
      if (!formValidadeDias || formValidadeDias <= 0) {
        errors.formValidadeDias = 'A validade em dias deve ser um número positivo maior que zero.';
      }
      if (formExigeAssinatura && formSignatarios.length === 0) {
        errors.formSignatarios = 'Selecione ao menos um signatário obrigatório.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Salvar
  const handleSalvar = () => {
    if (!validarFormulario()) {
      showToast('Preencha os campos obrigatórios para salvar o registro.');
      return;
    }

    const unidadesAplicaveis = formUnidadesTipo === 'todas' ? 'todas' : formUnidadesSelecionadas;

    if (isEditing && editingId) {
      setDocumentos((prev) =>
        prev.map((d) => {
          if (d.id === editingId) {
            // Incrementar versão minor se termo emitido foi editado
            let novaVersao = d.versaoVigente;
            if (d.natureza === 'Termo emitido') {
              const num = parseFloat(d.versaoVigente.replace('v', '')) || 1.0;
              novaVersao = `v${(num + 0.1).toFixed(1)}`;
            }

            return {
              ...d,
              nome: formNome.trim(),
              descricao: formDescricao.trim() || undefined,
              unidadesAplicaveis,
              anexoObrigatorio: formAnexoObrigatorio,
              modeloTermo: isTermoEmitido ? formModeloTermo.trim() : undefined,
              versaoVigente: novaVersao,
              inicioVigencia: isTermoEmitido ? formInicioVigencia : undefined,
              validadeDias: isTermoEmitido ? formValidadeDias : undefined,
              exigeAssinatura: isTermoEmitido ? formExigeAssinatura : false,
              formaAssinatura: isTermoEmitido && formExigeAssinatura ? formFormaAssinatura : undefined,
              signatarios: isTermoEmitido && formExigeAssinatura ? formSignatarios : undefined,
              situacao: formSituacao,
              travadoEdicao: true, // Trava após salvar
            };
          }
          return d;
        })
      );
      showToast(`Documento/Termo "${formNome}" atualizado com sucesso!`);
    } else {
      const novo: DocumentoTermoItem = {
        id: `doc-${Date.now().toString().slice(-4)}`,
        nome: formNome.trim(),
        natureza: formNatureza,
        descricao: formDescricao.trim() || undefined,
        unidadesAplicaveis,
        anexoObrigatorio: formAnexoObrigatorio,
        modeloTermo: isTermoEmitido ? formModeloTermo.trim() : undefined,
        versaoVigente: 'v1.0',
        inicioVigencia: isTermoEmitido ? formInicioVigencia : undefined,
        validadeDias: isTermoEmitido ? formValidadeDias : undefined,
        exigeAssinatura: isTermoEmitido ? formExigeAssinatura : false,
        formaAssinatura: isTermoEmitido && formExigeAssinatura ? formFormaAssinatura : undefined,
        signatarios: isTermoEmitido && formExigeAssinatura ? formSignatarios : undefined,
        situacao: formSituacao,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
        travadoEdicao: true,
      };
      setDocumentos((prev) => [novo, ...prev]);
      showToast(`Documento/Termo "${formNome}" cadastrado com sucesso!`);
    }

    setViewMode('listagem');
  };

  // Filtros aplicados
  const documentosFiltrados = useMemo(() => {
    return documentos.filter((d) => {
      const matchBusca =
        !busca.trim() ||
        d.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (d.descricao && d.descricao.toLowerCase().includes(busca.toLowerCase()));

      const matchNatureza = filtroNatureza === 'todos' || d.natureza === filtroNatureza;
      const matchAssinatura =
        filtroAssinatura === 'todos' ||
        (filtroAssinatura === 'sim' && d.exigeAssinatura) ||
        (filtroAssinatura === 'nao' && !d.exigeAssinatura);
      const matchAnexo =
        filtroAnexoObrigatorio === 'todos' ||
        (filtroAnexoObrigatorio === 'sim' && d.anexoObrigatorio) ||
        (filtroAnexoObrigatorio === 'nao' && !d.anexoObrigatorio);
      const matchSituacao = filtroSituacao === 'todos' || d.situacao === filtroSituacao;

      return matchBusca && matchNatureza && matchAssinatura && matchAnexo && matchSituacao;
    });
  }, [documentos, busca, filtroNatureza, filtroAssinatura, filtroAnexoObrigatorio, filtroSituacao]);

  const activeFilterCount =
    (filtroNatureza !== 'todos' ? 1 : 0) +
    (filtroAssinatura !== 'todos' ? 1 : 0) +
    (filtroAnexoObrigatorio !== 'todos' ? 1 : 0) +
    (filtroSituacao !== 'todos' ? 1 : 0);

  const handleLimparFiltros = () => {
    setBusca('');
    setFiltroNatureza('todos');
    setFiltroAssinatura('todos');
    setFiltroAnexoObrigatorio('todos');
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
                  DR007
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  CADASTRO TRANSVERSAL
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Documentos e Termos
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Cadastro transversal de tipos de documentos anexados e termos emitidos para a gestão de fauna silvestre.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                onClick={handleNovoRegistro}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs text-xs sm:text-sm h-9 px-4 font-semibold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Novo Documento/Termo
              </Button>
            </div>
          </div>

          {/* KPI Cards Sóbrios */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Total Cadastrado</span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-1">{documentos.length}</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Documentos e termos</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Termos Emitidos</span>
              <p className="text-xl font-bold font-mono text-[#0F4C3A] mt-1">
                {documentos.filter((d) => d.natureza === 'Termo emitido').length}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Gerados pelo sistema</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Documentos Anexados</span>
              <p className="text-xl font-bold font-mono text-slate-700 mt-1">
                {documentos.filter((d) => d.natureza === 'Documento anexado').length}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Laudos e guias de upload</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Exigem Assinatura</span>
              <p className="text-xl font-bold font-mono text-blue-700 mt-1">
                {documentos.filter((d) => d.exigeAssinatura).length}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Com fluxo de signatários</span>
            </div>
          </div>

          {/* Tabela de Documentos e Termos */}
          <TableContainer
            toolbar={
              <TableToolbar
                searchPlaceholder="Buscar por nome do documento ou finalidade..."
                searchValue={busca}
                onSearchChange={setBusca}
                activeFilterCount={activeFilterCount}
                filters={
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200/80">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Natureza</label>
                      <select
                        value={filtroNatureza}
                        onChange={(e) => setFiltroNatureza(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todas as Naturezas</option>
                        <option value="Termo emitido">Termo emitido</option>
                        <option value="Documento anexado">Documento anexado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Exige Assinatura?</label>
                      <select
                        value={filtroAssinatura}
                        onChange={(e) => setFiltroAssinatura(e.target.value)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 focus:ring-1 focus:ring-[#0F4C3A]"
                      >
                        <option value="todos">Todos</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Anexo Obrigatório?</label>
                      <select
                        value={filtroAnexoObrigatorio}
                        onChange={(e) => setFiltroAnexoObrigatorio(e.target.value)}
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
                    Exibindo <span className="font-bold text-slate-800">{documentosFiltrados.length}</span> de {documentos.length} itens
                  </div>
                }
              />
            }
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold select-none">
                  <th className="py-2.5 px-4">Nome do Documento / Termo</th>
                  <th className="py-2.5 px-3">Natureza</th>
                  <th className="py-2.5 px-3">Versão</th>
                  <th className="py-2.5 px-3">Anexo Obrigatório?</th>
                  <th className="py-2.5 px-4">Assinatura</th>
                  <th className="py-2.5 px-3">Situação</th>
                  <th className="py-2.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Info className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-semibold text-slate-700">Nenhum documento ou termo encontrado</p>
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
                  documentosFiltrados.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                      {/* Nome */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          {doc.natureza === 'Termo emitido' ? (
                            <FileSignature className="w-4 h-4 text-[#0F4C3A] shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <div>
                            <span className="font-semibold text-slate-900 block">{doc.nome}</span>
                            {doc.descricao && (
                              <span className="text-[11px] text-slate-400 truncate block max-w-sm">
                                {doc.descricao}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Natureza */}
                      <td className="py-2.5 px-3">
                        <Badge
                          color={doc.natureza === 'Termo emitido' ? 'primary' : 'gray'}
                          size="sm"
                        >
                          {doc.natureza}
                        </Badge>
                      </td>

                      {/* Versão */}
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {doc.versaoVigente}
                        </span>
                      </td>

                      {/* Anexo Obrigatório */}
                      <td className="py-2.5 px-3">
                        {doc.anexoObrigatorio ? (
                          <Badge color="warning" size="xs">
                            Sim (Obrigatório)
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Não</span>
                        )}
                      </td>

                      {/* Assinatura */}
                      <td className="py-2.5 px-4">
                        {doc.exigeAssinatura ? (
                          <div className="space-y-0.5">
                            <Badge color="info" size="xs">
                              {doc.formaAssinatura || 'Exige Assinatura'}
                            </Badge>
                            {doc.validadeDias && (
                              <span className="text-[11px] text-slate-500 block">
                                Validade: <strong>{doc.validadeDias} dias</strong>
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">Não exige</span>
                        )}
                      </td>

                      {/* Situação */}
                      <td className="py-2.5 px-3">
                        <Badge color={doc.situacao === 'Ativo' ? 'success' : 'gray'} size="sm" dot>
                          {doc.situacao}
                        </Badge>
                      </td>

                      {/* Ações */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDrawerDoc(doc)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Visualizar detalhes do documento/termo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditarRegistro(doc)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Editar documento/termo"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAlternarSituacao(doc.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title={doc.situacao === 'Ativo' ? 'Inativar' : 'Ativar'}
                          >
                            {doc.situacao === 'Ativo' ? (
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
                DR007 — Formulário de Documento ou Termo
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
                Salvar {isTermoEmitido ? 'Termo Emitido' : 'Documento Anexado'}
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Editar: ${formNome}` : 'Novo Documento ou Termo de Fauna'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cadastre o padrão documental para a rotina de admissão, triagem, transferência e soltura de fauna silvestre.
            </p>
          </div>

          {/* SEÇÃO 1: Identificação e Natureza Documental */}
          <Section
            title="1. Natureza e Identificação do Modelo"
            description="Defina se o tipo documental é anexado pelo usuário ou emitido pelo sistema com minuta."
          >
            <div className="space-y-4 pt-2">
              {/* Aviso da Regra de Ouro se Natureza estiver Travada */}
              {isEditing && naturezaTravada && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs flex items-center gap-2.5 text-amber-800">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Natureza Travada (RN-001):</strong> Este modelo documental já foi salvo e possui
                    aplicabilidade no sistema. A natureza não pode ser alterada para preservar o histórico jurídico.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Natureza */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Natureza do Registro <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={isEditing && naturezaTravada}
                    value={formNatureza}
                    onChange={(e) => setFormNatureza(e.target.value as NaturezaDocTermo)}
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      isEditing && naturezaTravada && 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200'
                    )}
                  >
                    <option value="Documento anexado">Documento anexado (Upload externo / Laudos)</option>
                    <option value="Termo emitido">Termo emitido (Gerado pelo sistema / Minuta oficial)</option>
                  </select>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Oficial do Documento / Termo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={150}
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="ex: Termo de Entrega Voluntária de Animal Silvestre (TEVAS)"
                    className={cn(
                      'w-full h-9 text-xs bg-white border rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formNome ? 'border-rose-400' : 'border-slate-300'
                    )}
                  />
                  {formErrors.formNome && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formNome}</span>
                  )}
                </div>

                {/* Descrição / Finalidade */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descrição e Finalidade Operacional
                  </label>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Descreva as hipóteses de uso, base legal e exigência nos fluxos de fauna..."
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                </div>
              </div>

              {/* Unidades Aplicáveis */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Unidades Aplicáveis (RN-007)
                </label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="unidadesTipo"
                      checked={formUnidadesTipo === 'todas'}
                      onChange={() => setFormUnidadesTipo('todas')}
                      className="text-[#0F4C3A] focus:ring-[#0F4C3A]"
                    />
                    <span>Aplicável a todas as Unidades do INEMA e Destinos</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="unidadesTipo"
                      checked={formUnidadesTipo === 'especificas'}
                      onChange={() => setFormUnidadesTipo('especificas')}
                      className="text-[#0F4C3A] focus:ring-[#0F4C3A]"
                    />
                    <span>Restrito a unidades específicas</span>
                  </label>
                </div>

                {formUnidadesTipo === 'especificas' && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {MOCK_UNIDADES.map((und) => (
                      <label
                        key={und.id}
                        className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded hover:bg-white"
                      >
                        <input
                          type="checkbox"
                          checked={formUnidadesSelecionadas.includes(und.id)}
                          onChange={() => handleToggleUnidade(und.id)}
                          className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                        />
                        <span className="truncate">
                          {und.nome} ({und.municipio})
                        </span>
                      </label>
                    ))}
                    {formErrors.formUnidades && (
                      <span className="text-[11px] text-rose-600 col-span-2">{formErrors.formUnidades}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Anexo Obrigatório */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Anexo Obrigatório</span>
                  <span className="text-[11px] text-slate-500">
                    Se ativado, o sistema exigirá o upload do documento no fluxo operacional para prosseguir.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormAnexoObrigatorio((prev) => !prev)}
                  className="cursor-pointer"
                >
                  {formAnexoObrigatorio ? (
                    <ToggleRight className="w-6 h-6 text-[#0F4C3A]" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </Section>

          {/* SEÇÃO 2: Configurações Exclusivas de Termo Emitido (Condicional) */}
          {isTermoEmitido && (
            <Section
              title="2. Minuta do Termo, Vigência e Assinatura Digital"
              description="Configurações aplicáveis exclusivamente a termos gerados pelo sistema com preenchimento automático."
            >
              <div className="space-y-4 pt-2">
                {/* Editor de Modelo de Termo com Tags */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Modelo do Termo (Minuta com Variáveis) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Clique nas variáveis para inserir no texto</span>
                  </div>

                  {/* Barra de Variáveis Rápidas */}
                  <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-slate-100 rounded-lg border border-slate-200">
                    {VARIAVEIS_DISPONIVEIS.map((v) => (
                      <button
                        key={v.tag}
                        type="button"
                        onClick={() => handleInserirVariavel(v.tag)}
                        className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-white text-[#0F4C3A] hover:bg-emerald-50 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                        title={v.desc}
                      >
                        + {v.tag}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={6}
                    value={formModeloTermo}
                    onChange={(e) => setFormModeloTermo(e.target.value)}
                    placeholder="Digite a minuta oficial do termo utilizando as tags de variáveis dinâmicas..."
                    className={cn(
                      'w-full text-xs font-mono bg-white border rounded-lg p-3 text-slate-800 leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]',
                      formErrors.formModeloTermo ? 'border-rose-400' : 'border-slate-300'
                    )}
                  />
                  {formErrors.formModeloTermo && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.formModeloTermo}</span>
                  )}
                </div>

                {/* Versão e Vigência */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Versão Vigente (Sistema)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formVersaoVigente}
                      className="w-full h-8 text-xs font-mono font-bold bg-slate-100 border border-slate-200 rounded-md px-2 text-slate-700 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Gerada automaticamente (RN-004).</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Início da Vigência <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formInicioVigencia}
                      onChange={(e) => setFormInicioVigencia(e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Validade do Termo (em DIAS) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={3650}
                        value={formValidadeDias}
                        onChange={(e) => setFormValidadeDias(parseInt(e.target.value) || 0)}
                        className="w-full h-8 text-xs bg-white border border-slate-300 rounded-md px-2 pr-12 text-slate-800"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-medium">
                        dias
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Regra de Ouro: expressa em DIAS.</span>
                  </div>
                </div>

                {/* Exige Assinatura */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">Exige Assinatura Digital</span>
                      <span className="text-[11px] text-slate-500">
                        Habilita a coleta de assinaturas eletrônicas Gov.br ou validação de upload assinado.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormExigeAssinatura((prev) => !prev)}
                      className="cursor-pointer"
                    >
                      {formExigeAssinatura ? (
                        <ToggleRight className="w-6 h-6 text-[#0F4C3A]" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {formExigeAssinatura && (
                    <div className="p-3.5 bg-slate-50/80 rounded-lg border border-slate-200 space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Forma de Assinatura
                        </label>
                        <select
                          value={formFormaAssinatura}
                          onChange={(e) => setFormFormaAssinatura(e.target.value as any)}
                          className="w-full sm:w-64 h-8 text-xs bg-white border border-slate-300 rounded-md px-2 text-slate-800"
                        >
                          <option value="Digital Gov.br">Digital Gov.br</option>
                          <option value="Upload assinado">Upload de Termo Físico Assinado</option>
                          <option value="Ambas">Ambas as formas permitidas</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Signatários Obrigatórios
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {SIGNATARIOS_OPCOES.map((sig) => (
                            <label
                              key={sig}
                              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded hover:bg-white"
                            >
                              <input
                                type="checkbox"
                                checked={formSignatarios.includes(sig)}
                                onChange={() => handleToggleSignatario(sig)}
                                className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                              />
                              <span>{sig}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* SEÇÃO 3: Situação Cadastral */}
          <Section
            title="3. Situação Cadastral"
            description="Controle de ativação do documento ou termo no ecossistema do INEMA."
          >
            <div className="pt-2 flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Modelo Ativo no Sistema</span>
                <span className="text-[11px] text-slate-500">
                  Modelos inativos deixam de ser listados para novas emissões ou solicitações de anexo.
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
              Salvar {isTermoEmitido ? 'Termo Emitido' : 'Documento Anexado'}
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GAVETA DE DETALHES (DRAWER NÍVEL 1) */}
      {/* ========================================================= */}
      {drawerDoc && (
        <GlaDrawer
          isOpen={true}
          onClose={() => setDrawerDoc(null)}
          title={drawerDoc.nome}
          subtitle={`${drawerDoc.natureza} · Versão ${drawerDoc.versaoVigente}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setDrawerDoc(null)} className="text-xs">
                Fechar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleEditarRegistro(drawerDoc)}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Editar Modelo
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-xs text-slate-700">
            {/* Badges Principais */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100">
              <Badge color={drawerDoc.situacao === 'Ativo' ? 'success' : 'gray'} dot size="sm">
                {drawerDoc.situacao}
              </Badge>
              <Badge color={drawerDoc.natureza === 'Termo emitido' ? 'primary' : 'gray'} size="sm">
                {drawerDoc.natureza}
              </Badge>
              <Badge color="info" size="sm">
                Versão {drawerDoc.versaoVigente}
              </Badge>
            </div>

            {/* Descrição */}
            {drawerDoc.descricao && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Descrição / Finalidade
                </h4>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700 leading-relaxed">
                  {drawerDoc.descricao}
                </p>
              </div>
            )}

            {/* Se Termo Emitido: Minuta e Validade */}
            {drawerDoc.natureza === 'Termo emitido' && (
              <div className="space-y-3">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Modelo da Minuta Oficial
                  </h4>
                  <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto border border-slate-800">
                    {drawerDoc.modeloTermo}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Início da Vigência</span>
                    <span className="font-semibold text-slate-800">{drawerDoc.inicioVigencia || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Validade Operacional</span>
                    <span className="font-semibold text-slate-800">
                      {drawerDoc.validadeDias ? `${drawerDoc.validadeDias} dias` : 'Indeterminada'}
                    </span>
                  </div>
                </div>

                {drawerDoc.exigeAssinatura && (
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Assinatura Digital & Signatários
                    </h4>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Forma de Assinatura</span>
                        <span className="font-semibold text-slate-800">{drawerDoc.formaAssinatura}</span>
                      </div>
                      {drawerDoc.signatarios && (
                        <div>
                          <span className="text-slate-400 text-[11px] block mb-1">Signatários Obrigatórios:</span>
                          <div className="flex flex-wrap gap-1">
                            {drawerDoc.signatarios.map((s) => (
                              <Badge key={s} color="gray" size="xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Unidades Aplicáveis */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Unidades Aplicáveis
              </h4>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {drawerDoc.unidadesAplicaveis === 'todas' ? (
                  <span className="font-medium text-slate-800">Todas as Unidades do INEMA e Destinos</span>
                ) : (
                  <div className="space-y-1">
                    {drawerDoc.unidadesAplicaveis.map((uid) => {
                      const u = MOCK_UNIDADES.find((x) => x.id === uid);
                      return (
                        <div key={uid} className="text-slate-700">
                          • {u ? `${u.nome} (${u.municipio})` : uid}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              Cadastrado em: {drawerDoc.dataCadastro}
            </div>
          </div>
        </GlaDrawer>
      )}
    </div>
  );
};
