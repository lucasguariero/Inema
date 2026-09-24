import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  UploadCloud,
  FileText,
  Eye,
  X,
  Plus,
  MapPin,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import {
  GlaCard,
  GlaCardHeader,
  GlaCardTitle,
  GlaCardDescription,
  GlaCardContent,
  GlaButton,
  GlaBadge,
  GlaInput,
  GlaSelect,
  GlaTabs,
  GlaNotification,
  GlaModal
} from '@/components/gla';
import { UcItem } from '@/data/ceucMock';

interface CeucFormularioPageProps {
  uc?: UcItem | null;
  onVoltar: () => void;
  onSalvar: (dados: Partial<UcItem>, mensagem: string) => void;
}

export const CeucFormularioPage: React.FC<CeucFormularioPageProps> = ({
  uc,
  onVoltar,
  onSalvar
}) => {
  const isEdicao = !!uc;

  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState('gerais');

  // Estado de notificação local (toast)
  const [toastNotificacao, setToastNotificacao] = useState<string | null>(null);

  // Modal de visualização de anexo
  const [documentoVisualizando, setDocumentoVisualizando] = useState<string | null>(null);

  // Estados dos campos - Seção 1: Dados Básicos e Enquadramento Legal
  const [nome, setNome] = useState(uc?.nome || '');
  const [sigla, setSigla] = useState(uc?.sigla || '');
  const [dataCriacao, setDataCriacao] = useState(uc?.dataCriacao || '1998-08-17');
  const [dataAtualizacao] = useState(
    uc?.dataAtualizacao || new Date().toISOString().split('T')[0]
  );
  const [grupoManejo, setGrupoManejo] = useState(uc?.grupoManejo || 'Proteção Integral');
  const [categoria, setCategoria] = useState(uc?.categoria || 'Parque Estadual');

  // Uploads mockados de documentação normativa
  const [normaCriacaoArquivo, setNormaCriacaoArquivo] = useState<string | null>(
    uc?.normaCriacaoArquivo || (isEdicao ? 'Decreto_Estadual_Regulamentador.pdf' : null)
  );
  const [normaAlteracaoArquivo, setNormaAlteracaoArquivo] = useState<string | null>(
    uc?.normaAlteracaoArquivo || null
  );

  // Estados dos campos - Seção 2: Informações Geográficas e Territoriais
  const [areaHectares, setAreaHectares] = useState(uc?.areaHectares ? String(uc.areaHectares) : '');
  const [bioma, setBioma] = useState(uc?.bioma || 'Caatinga');
  const [populacaoEstimada, setPopulacaoEstimada] = useState(
    uc?.populacaoEstimada !== undefined ? String(uc.populacaoEstimada) : ''
  );
  const [rpga, setRpga] = useState(uc?.rpga || 'RPGA do Rio Paraguaçu');
  const [territorioIdentidade, setTerritorioIdentidade] = useState(
    uc?.territorioIdentidade || 'Piemonte da Diamantina'
  );
  const [municipios, setMunicipios] = useState<string[]>(
    uc?.municipiosAbrangidos || (uc?.municipio ? [uc.municipio] : ['Morro do Chapéu'])
  );
  const [novoMunicipio, setNovoMunicipio] = useState('');
  const [percentualRegularizado, setPercentualRegularizado] = useState(
    uc?.percentualRegularizado ? String(uc.percentualRegularizado) : '85.0'
  );
  const [descricaoSituacaoFundiaria, setDescricaoSituacaoFundiaria] = useState(
    uc?.descricaoSituacaoFundiaria ||
      'Áreas prioritárias com regularização cartorial concluída e compensações em análise.'
  );

  // Validação simples
  const [erros, setErros] = useState<Record<string, string>>({});

  // Manipulação de municípios tags
  const handleAdicionarMunicipio = () => {
    if (!novoMunicipio.trim()) return;
    if (!municipios.includes(novoMunicipio.trim())) {
      setMunicipios([...municipios, novoMunicipio.trim()]);
    }
    setNovoMunicipio('');
  };

  const handleRemoverMunicipio = (mun: string) => {
    setMunicipios(municipios.filter((m) => m !== mun));
  };

  // Salvar Rascunho
  const handleSalvarRascunho = () => {
    const dadosAtualizados: Partial<UcItem> = {
      nome: nome || 'Nova Unidade de Conservação (Rascunho)',
      sigla,
      categoria: categoria as any,
      grupoManejo: grupoManejo as any,
      municipio: municipios[0] || 'A definir',
      municipiosAbrangidos: municipios,
      areaHectares: parseFloat(areaHectares) || 0,
      populacaoEstimada: parseInt(populacaoEstimada, 10) || 0,
      bioma: bioma as any,
      rpga,
      territorioIdentidade,
      percentualRegularizado: parseFloat(percentualRegularizado) || 0,
      descricaoSituacaoFundiaria,
      normaCriacaoArquivo: normaCriacaoArquivo || undefined,
      normaAlteracaoArquivo: normaAlteracaoArquivo || undefined
    };

    onSalvar(dadosAtualizados, 'Rascunho do cadastro salvo com sucesso.');
  };

  // Avançar para Instrumentos de Gestão
  const handleAvancar = () => {
    const novosErros: Record<string, string> = {};
    if (!nome.trim()) {
      novosErros.nome = 'O Nome da Unidade de Conservação é obrigatório.';
    }
    if (!areaHectares || isNaN(Number(areaHectares))) {
      novosErros.areaHectares = 'Informe uma área válida em hectares.';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      setToastNotificacao('Por favor, preencha todos os campos obrigatórios assinalados.');
      return;
    }

    setErros({});
    setActiveTab('instrumentos');
  };

  // Configuração Limpa das Abas do CEUC (DOR036) — Sem badges poluentes de "Em breve"
  const TABS_CONFIG = [
    {
      id: 'gerais',
      label: 'Informações Gerais e Territoriais'
    },
    {
      id: 'instrumentos',
      label: 'Instrumentos de Gestão'
    },
    {
      id: 'zonas',
      label: 'Zonas de Manejo e Áreas de Visitação'
    },
    {
      id: 'conselho',
      label: 'Conselho Gestor e Equipe'
    },
    {
      id: 'infraestrutura',
      label: 'Infraestrutura e Serviços'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toast de Notificação no Canto Superior Direito */}
      {toastNotificacao && (
        <GlaNotification
          type={Object.keys(erros).length > 0 ? 'warning' : 'success'}
          title={Object.keys(erros).length > 0 ? 'Atenção ao Formulário' : 'Operação Realizada'}
          message={toastNotificacao}
          onClose={() => setToastNotificacao(null)}
          duration={5000}
        />
      )}

      {/* Modal de Visualização de Documento Normativo Anexado (RN006) */}
      {documentoVisualizando && (
        <GlaModal
          isOpen={!!documentoVisualizando}
          onClose={() => setDocumentoVisualizando(null)}
          title={`Visualização de Documento: ${documentoVisualizando}`}
          description="Visualizador de atos regulamentares e decretos estaduais do CEUC (DOR036)."
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 font-mono">
                Assinado digitalmente via SEI-BA • Conforme DOE
              </span>
              <GlaButton
                variant="primary"
                size="sm"
                onClick={() => setDocumentoVisualizando(null)}
              >
                Fechar Visualizador
              </GlaButton>
            </div>
          }
        >
          <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] mx-auto flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {documentoVisualizando}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Documento normativo homologado pelo Instituto do Meio Ambiente e Recursos Hídricos (INEMA).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Arquivo validado no repositório oficial
            </div>
          </div>
        </GlaModal>
      )}

      {/* 1. CABEÇALHO DO FORMULÁRIO (SEM BREADCRUMB DUPLICADO + AÇÕES DIRETAS NO TOPO) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isEdicao ? uc.nome : 'Nova Unidade de Conservação'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isEdicao
              ? 'Edição dos parâmetros cadastrais, espaciais e normativos da Unidade de Conservação.'
              : 'Preencha as informações para registrar uma nova Unidade de Conservação no Sistema Estadual.'}
          </p>
        </div>

        {/* Ações Primárias no Cabeçalho (Fim da Rolagem Excessiva) */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <GlaButton
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={onVoltar}
          >
            Voltar à Lista
          </GlaButton>
          <GlaButton
            variant="outline"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5 text-slate-500" />}
            onClick={handleSalvarRascunho}
          >
            Salvar Rascunho
          </GlaButton>
          <GlaButton
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={handleAvancar}
          >
            Avançar
          </GlaButton>
        </div>
      </div>

      {/* 2. BARRA DE ABAS CANÔNICA DO FILAMENT (GLATABS) — LIMPA E ELEGANTE */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-4 pt-1 shadow-2xs">
        <GlaTabs
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId)}
          variant="underline"
        />
      </div>

      {/* 3. CONTEÚDO DINÂMICO CONFORME ABA SELECIONADA */}
      {activeTab === 'gerais' ? (
        <div className="space-y-6">
          {/* SEÇÃO 1: DADOS BÁSICOS E ENQUADRAMENTO LEGAL */}
          <GlaCard className="border-slate-200 dark:border-slate-800 shadow-sm">
            <GlaCardHeader>
              <GlaCardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Dados Básicos e Enquadramento Legal
              </GlaCardTitle>
              <GlaCardDescription>
                Identificação institucional, siglas oficiais, datas de criação e atos normativos no SEUC/SNUC.
              </GlaCardDescription>
            </GlaCardHeader>

            <GlaCardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Nome da UC */}
                <div className="md:col-span-2">
                  <GlaInput
                    label="Nome da Unidade de Conservação *"
                    placeholder="Ex: Parque Estadual do Morro do Chapéu"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (erros.nome) setErros({ ...erros, nome: '' });
                    }}
                    error={erros.nome}
                    hint="Nome oficial conforme decreto ou portaria de criação."
                  />
                </div>

                {/* Sigla / Abreviação */}
                <div>
                  <GlaInput
                    label="Sigla / Abreviação"
                    placeholder="Ex: PE Morro do Chapéu"
                    value={sigla}
                    onChange={(e) => setSigla(e.target.value)}
                    hint="Abreviação para uso em relatórios e mapas."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Data de Criação */}
                <div>
                  <GlaInput
                    type="date"
                    label="Data de Criação"
                    value={dataCriacao}
                    onChange={(e) => setDataCriacao(e.target.value)}
                    hint="Data do ato legal instituidor."
                  />
                </div>

                {/* Data da Última Atualização (Automática) */}
                <div>
                  <GlaInput
                    type="date"
                    label="Última Atualização"
                    value={dataAtualizacao}
                    disabled
                    hint="Preenchimento automático do sistema."
                    suffixText="Auto"
                  />
                </div>

                {/* Grupo de Manejo */}
                <div>
                  <GlaSelect
                    label="Grupo de Manejo *"
                    value={grupoManejo}
                    onChange={(e) => setGrupoManejo(e.target.value)}
                    options={[
                      { value: 'Proteção Integral', label: 'Proteção Integral' },
                      { value: 'Uso Sustentável', label: 'Uso Sustentável' }
                    ]}
                  />
                </div>

                {/* Categoria de Manejo (SEUC/SNUC) */}
                <div>
                  <GlaSelect
                    label="Categoria de Manejo (SEUC/SNUC) *"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as any)}
                    options={[
                      { value: 'Parque Estadual', label: 'Parque Estadual' },
                      { value: 'APA', label: 'Área de Proteção Ambiental (APA)' },
                      { value: 'Estação Ecológica', label: 'Estação Ecológica' },
                      { value: 'Floresta Estadual', label: 'Floresta Estadual' },
                      { value: 'Monumento Natural', label: 'Monumento Natural' },
                      { value: 'Refúgio de Vida Silvestre', label: 'Refúgio de Vida Silvestre' }
                    ]}
                  />
                </div>
              </div>

              {/* Upload de Documentação Normativa */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Upload de Documentação Normativa
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Norma de Criação */}
                  <div className="p-3.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50/60 dark:bg-slate-900/40">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Norma de Criação (DOE / Decreto Regulamentador) *
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Formato aceito: PDF até 15MB.
                        </p>
                      </div>
                      <UploadCloud className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>

                    {normaCriacaoArquivo ? (
                      <div className="mt-3 flex items-center justify-between p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                        <div className="flex items-center gap-2 truncate min-w-0 mr-2">
                          <FileText className="w-4 h-4 text-[#0F4C3A] shrink-0" />
                          <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                            {normaCriacaoArquivo}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setDocumentoVisualizando(normaCriacaoArquivo);
                              setToastNotificacao(`Visualizando documento: ${normaCriacaoArquivo}`);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F4C3A] hover:bg-[#0F4C3A]/10 px-2 py-1 rounded cursor-pointer transition-colors"
                            title="Visualizar documento"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Visualizar
                          </button>
                          <button
                            type="button"
                            onClick={() => setNormaCriacaoArquivo(null)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                            title="Remover arquivo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer shadow-2xs">
                          <Plus className="w-3.5 h-3.5" />
                          Selecionar Arquivo PDF
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setNormaCriacaoArquivo(e.target.files[0].name);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Normas de Alteração / Retificação */}
                  <div className="p-3.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50/60 dark:bg-slate-900/40">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Normas de Alteração / Retificação (Opcional)
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Atos subsequentes de redefinição de limites ou zoneamento.
                        </p>
                      </div>
                      <UploadCloud className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>

                    {normaAlteracaoArquivo ? (
                      <div className="mt-3 flex items-center justify-between p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                        <div className="flex items-center gap-2 truncate min-w-0 mr-2">
                          <FileText className="w-4 h-4 text-[#0F4C3A] shrink-0" />
                          <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                            {normaAlteracaoArquivo}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setDocumentoVisualizando(normaAlteracaoArquivo);
                              setToastNotificacao(`Visualizando documento: ${normaAlteracaoArquivo}`);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F4C3A] hover:bg-[#0F4C3A]/10 px-2 py-1 rounded cursor-pointer transition-colors"
                            title="Visualizar documento"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Visualizar
                          </button>
                          <button
                            type="button"
                            onClick={() => setNormaAlteracaoArquivo(null)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                            title="Remover arquivo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer shadow-2xs">
                          <Plus className="w-3.5 h-3.5" />
                          Selecionar Arquivo PDF
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setNormaAlteracaoArquivo(e.target.files[0].name);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlaCardContent>
          </GlaCard>

          {/* SEÇÃO 2: INFORMAÇÕES GEOGRÁFICAS E TERRITORIAIS */}
          <GlaCard className="border-slate-200 dark:border-slate-800 shadow-sm">
            <GlaCardHeader>
              <GlaCardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Informações Geográficas e Territoriais
              </GlaCardTitle>
              <GlaCardDescription>
                Área declarada em hectares, biomas incidentes, bacias hidrográficas (RPGA), população e situação fundiária.
              </GlaCardDescription>
            </GlaCardHeader>

            <GlaCardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Área Total Declarada */}
                <div>
                  <GlaInput
                    label="Área Total Declarada (ha) *"
                    placeholder="Ex: 46000"
                    value={areaHectares}
                    onChange={(e) => {
                      setAreaHectares(e.target.value);
                      if (erros.areaHectares) setErros({ ...erros, areaHectares: '' });
                    }}
                    error={erros.areaHectares}
                    suffixText="ha"
                    hint="Superfície oficial georreferenciada."
                  />
                </div>

                {/* Bioma Predominante */}
                <div>
                  <GlaSelect
                    label="Bioma Predominante *"
                    value={bioma}
                    onChange={(e) => setBioma(e.target.value as any)}
                    options={[
                      { value: 'Caatinga', label: 'Caatinga' },
                      { value: 'Mata Atlântica', label: 'Mata Atlântica' },
                      { value: 'Cerrado', label: 'Cerrado' }
                    ]}
                    hint="Bioma com maior cobertura na poligonal."
                  />
                </div>

                {/* População Estimada (DOR036) */}
                <div>
                  <GlaInput
                    type="number"
                    label="População Estimada"
                    placeholder="Ex: 42500 ou 0"
                    value={populacaoEstimada}
                    onChange={(e) => setPopulacaoEstimada(e.target.value)}
                    hint="Famílias/Habitantes (vital em Uso Sustentável)."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* RPGA */}
                <div>
                  <GlaSelect
                    label="Região de Planejamento e Gestão das Águas (RPGA)"
                    value={rpga}
                    onChange={(e) => setRpga(e.target.value)}
                    options={[
                      { value: 'RPGA do Rio Paraguaçu', label: 'RPGA do Rio Paraguaçu' },
                      { value: 'RPGA do Litoral Norte', label: 'RPGA do Litoral Norte' },
                      { value: 'RPGA do Rio das Contas', label: 'RPGA do Rio das Contas' },
                      { value: 'RPGA do Rio Itapicuru', label: 'RPGA do Rio Itapicuru' },
                      { value: 'RPGA do Rio Grande', label: 'RPGA do Rio Grande' },
                      { value: 'RPGA do Rio São Francisco', label: 'RPGA do Rio São Francisco' }
                    ]}
                  />
                </div>

                {/* Território de Identidade */}
                <div>
                  <GlaSelect
                    label="Território de Identidade da Bahia"
                    value={territorioIdentidade}
                    onChange={(e) => setTerritorioIdentidade(e.target.value)}
                    options={[
                      { value: 'Piemonte da Diamantina', label: 'Piemonte da Diamantina' },
                      { value: 'Litoral Norte e Agreste Baiano', label: 'Litoral Norte e Agreste Baiano' },
                      { value: 'Baixo Sul', label: 'Baixo Sul' },
                      { value: 'Piemonte do Paraguaçu', label: 'Piemonte do Paraguaçu' },
                      { value: 'Metropolitana de Salvador', label: 'Metropolitana de Salvador' },
                      { value: 'Costa do Descobrimento', label: 'Costa do Descobrimento' }
                    ]}
                  />
                </div>
              </div>

              {/* Municípios Abrangidos (Seleção Múltipla com Tags flex-wrap) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Municípios Abrangidos
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 w-full max-w-full overflow-hidden">
                  {municipios.map((mun) => (
                    <span
                      key={mun}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 max-w-full truncate"
                    >
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{mun}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoverMunicipio(mun)}
                        className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer shrink-0"
                        title={`Remover ${mun}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Campo inline para adicionar novos municípios */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="text"
                      placeholder="Adicionar município..."
                      value={novoMunicipio}
                      onChange={(e) => setNovoMunicipio(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAdicionarMunicipio();
                        }
                      }}
                      className="text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                    />
                    <button
                      type="button"
                      onClick={handleAdicionarMunicipio}
                      className="p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 hover:text-slate-900 cursor-pointer"
                      title="Adicionar"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pressione Enter ou clique no botão + para adicionar municípios à poligonal da UC.
                </p>
              </div>

              {/* Situação Fundiária: Área Regularizada e Observações / Status Fundiário */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <GlaInput
                    label="Área Regularizada (%)"
                    placeholder="Ex: 85.0"
                    value={percentualRegularizado}
                    onChange={(e) => setPercentualRegularizado(e.target.value)}
                    suffixText="%"
                    hint="Percentual com matrícula/titularidade."
                  />
                </div>

                <div className="md:col-span-2">
                  <GlaInput
                    label="Observações / Status Fundiário"
                    placeholder="Ex: Terras públicas estaduais, devolutas em discriminação ou desapropriações em andamento."
                    value={descricaoSituacaoFundiaria}
                    onChange={(e) => setDescricaoSituacaoFundiaria(e.target.value)}
                    hint="Contexto: terras públicas, devolutas, desapropriações ou posseiros."
                  />
                </div>
              </div>
            </GlaCardContent>
          </GlaCard>
        </div>
      ) : (
        /* PLACEHOLDER POLIDO PARA AS DEMAIS ABAS EM BREVE (FASES 3 A 5) */
        <GlaCard className="border-slate-200 dark:border-slate-800 shadow-sm text-center py-12">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] mx-auto flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {TABS_CONFIG.find((t) => t.id === activeTab)?.label}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Esta seção do CEUC (DOR036) está estruturada e será integrada nas próximas fases do módulo com a área de negócios do INEMA.
            </p>
            <div className="pt-2">
              <GlaButton
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                onClick={() => setActiveTab('gerais')}
              >
                Retornar para Informações Gerais
              </GlaButton>
            </div>
          </div>
        </GlaCard>
      )}

      {/* 4. RODAPÉ FIXO DE AÇÕES COM FEEDBACK CANÔNICO */}
      <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-30">
        <div>
          <GlaButton
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5 text-slate-500" />}
            onClick={onVoltar}
          >
            Cancelar / Voltar para a Lista
          </GlaButton>
        </div>

        <div className="flex items-center gap-2.5">
          <GlaButton
            variant="outline"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5 text-slate-500" />}
            onClick={handleSalvarRascunho}
          >
            Salvar Rascunho
          </GlaButton>

          <GlaButton
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={handleAvancar}
          >
            Avançar para Instrumentos de Gestão
          </GlaButton>
        </div>
      </div>
    </div>
  );
};
