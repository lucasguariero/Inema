import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Save,
  UploadCloud,
  FileText,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  MapPin,
  Trees,
  FileCheck
} from 'lucide-react';
import {
  GlaCard,
  GlaCardHeader,
  GlaCardTitle,
  GlaCardDescription,
  GlaButton,
  GlaBadge,
  GlaInput,
  GlaSelect,
  GlaTabs,
  GlaNotification
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

  // Configuração das Abas do CEUC (DOR036)
  const TABS_CONFIG = [
    {
      id: 'gerais',
      label: 'Informações Gerais e Territoriais',
      badge: 'Ativa'
    },
    {
      id: 'instrumentos',
      label: 'Instrumentos de Gestão',
      badge: 'Em breve'
    },
    {
      id: 'zonas',
      label: 'Zonas de Manejo e Áreas de Visitação',
      badge: 'Em breve'
    },
    {
      id: 'conselho',
      label: 'Conselho Gestor e Equipe',
      badge: 'Em breve'
    },
    {
      id: 'infraestrutura',
      label: 'Infraestrutura e Serviços',
      badge: 'Em breve'
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

      {/* 1. CABEÇALHO DO FORMULÁRIO (BREADCRUMB + TÍTULO COM BADGES DE STATUS) */}
      <div className="space-y-1.5">
        {/* Breadcrumb canônico exigido pelo requisito */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span>Gestão de UC</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span>Cadastros Básicos</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span>CEUC</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            Cadastro de Unidade de Conservação
          </span>
        </div>

        {/* Título Principal e Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isEdicao ? uc.nome : 'Nova Unidade de Conservação'}
              </h1>
              {isEdicao ? (
                <>
                  <GlaBadge variant="neutral" size="sm" mono>
                    {uc.codigoCeu}
                  </GlaBadge>
                  <GlaBadge variant="success" size="sm" dot>
                    Cadastrada
                  </GlaBadge>
                </>
              ) : (
                <GlaBadge variant="warning" size="sm" dot>
                  Em Preenchimento
                </GlaBadge>
              )}
              <GlaBadge variant="primary" size="sm">
                CEUC / INEMA
              </GlaBadge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isEdicao
                ? 'Edição dos parâmetros cadastrais, espaciais e normativos da Unidade de Conservação.'
                : 'Preencha as informações para registrar uma nova Unidade de Conservação no Sistema Estadual.'}
            </p>
          </div>

          {/* Botão Superior para Voltar à Lista */}
          <div className="shrink-0">
            <GlaButton
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              onClick={onVoltar}
            >
              Voltar à Lista
            </GlaButton>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE ABAS CANÔNICA DO FILAMENT (GLATABS) */}
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
              <div className="flex items-center gap-2">
                <GlaCardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Dados Básicos e Enquadramento Legal
                </GlaCardTitle>
                <GlaBadge variant="neutral" size="xs">
                  Obrigatório
                </GlaBadge>
              </div>
              <GlaCardDescription>
                Identificação institucional, siglas oficiais, datas de criação e atos normativos no SEUC/SNUC.
              </GlaCardDescription>
            </GlaCardHeader>

            <div className="space-y-5 pt-2">
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

                {/* Categoria de Manejo */}
                <div>
                  <GlaSelect
                    label="Categoria de Manejo (SNUC) *"
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
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-[#0F4C3A] shrink-0" />
                          <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                            {normaCriacaoArquivo}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNormaCriacaoArquivo(null)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                          title="Remover arquivo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
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
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-[#0F4C3A] shrink-0" />
                          <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                            {normaAlteracaoArquivo}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNormaAlteracaoArquivo(null)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                          title="Remover arquivo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
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
            </div>
          </GlaCard>

          {/* SEÇÃO 2: INFORMAÇÕES GEOGRÁFICAS E TERRITORIAIS */}
          <GlaCard className="border-slate-200 dark:border-slate-800 shadow-sm">
            <GlaCardHeader>
              <div className="flex items-center gap-2">
                <GlaCardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Informações Geográficas e Territoriais
                </GlaCardTitle>
                <GlaBadge variant="neutral" size="xs">
                  Delimitação & Espaço
                </GlaBadge>
              </div>
              <GlaCardDescription>
                Área declarada em hectares, biomas incidentes, bacias hidrográficas (RPGA) e situação fundiária.
              </GlaCardDescription>
            </GlaCardHeader>

            <div className="space-y-5 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                {/* Situação Fundiária: Percentual Regularizado */}
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

              {/* Municípios Abrangidos (Seleção Múltipla com Tags) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Municípios Abrangidos
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
                  {municipios.map((mun) => (
                    <span
                      key={mun}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                    >
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {mun}
                      <button
                        type="button"
                        onClick={() => handleRemoverMunicipio(mun)}
                        className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                        title={`Remover ${mun}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Campo inline para adicionar novos municípios */}
                  <div className="flex items-center gap-1.5">
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
                      className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                    />
                    <button
                      type="button"
                      onClick={handleAdicionarMunicipio}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 hover:text-slate-900 cursor-pointer"
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

              {/* Situação Fundiária: Descrição do Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Situação e Histórico Fundiário
                </label>
                <textarea
                  rows={3}
                  value={descricaoSituacaoFundiaria}
                  onChange={(e) => setDescricaoSituacaoFundiaria(e.target.value)}
                  placeholder="Descreva o estágio das desapropriações, terras devolutas e conflitos de posse..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-colors shadow-2xs"
                />
              </div>
            </div>
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
