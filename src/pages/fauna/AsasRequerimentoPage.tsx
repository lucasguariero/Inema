import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Save,
  Send,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Check,
  FileText,
  MapPin,
  Clock,
  History,
  Layers,
  Trash2,
  Eye,
  Info,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import {
  AsasItem,
  CategoriaAsas,
  SituacaoAsas,
  BiomaBahia,
  BaciaHidrograficaBahia,
  UnidadeRegionalBahia,
  PoligonoDelimitacaoAsas
} from '@/types/faunaR3R4';
import { saveAsasItem, getAsasList } from '@/data/faunaR3R4Mock';
import { PerfilDemonstrativoFauna } from './AsasListPage';

interface AsasRequerimentoPageProps {
  asasId?: string;
  modo: 'novo' | 'existente' | 'editar' | 'ver';
  onVoltar: () => void;
  perfilAtivo: PerfilDemonstrativoFauna;
  onConcluido?: (item: AsasItem) => void;
}

const TABS_REQUERIMENTO = [
  { id: 0, label: '1. Requerimento & Categoria' },
  { id: 1, label: '2. Propriedade & Localização' },
  { id: 2, label: '3. Documentação Anexa' },
  { id: 3, label: '4. Solturas Realizadas' },
  { id: 4, label: '5. Histórico e Trâmites' }
];

export const AsasRequerimentoPage: React.FC<AsasRequerimentoPageProps> = ({
  asasId,
  modo,
  onVoltar,
  perfilAtivo,
  onConcluido
}) => {
  const [tabAtiva, setTabAtiva] = useState<number>(0);
  const [errosValidacao, setErrosValidacao] = useState<Record<string, string>>({});
  const [kmlForaBahia, setKmlForaBahia] = useState<boolean>(false);
  const [justificativaEdicao, setJustificativaEdicao] = useState<string>('');
  const [modalJustificativaAberto, setModalJustificativaAberto] = useState<boolean>(false);

  // Registro inicial carregado ou modelo em branco
  const registroOriginal = useMemo(() => {
    if (asasId) {
      const todos = getAsasList();
      return todos.find((a) => a.id === asasId);
    }
    return undefined;
  }, [asasId]);

  // Estado do formulário
  const [form, setForm] = useState<AsasItem>(() => {
    if (registroOriginal) return JSON.parse(JSON.stringify(registroOriginal));

    const totalAtual = getAsasList().length + 1;
    const numSeq = String(totalAtual).padStart(3, '0');

    return {
      id: `asas-${Date.now()}`,
      numero: modo === 'existente' ? `ASAS-LEG-${numSeq}` : `ASAS-000.${numSeq}`,
      processoSei: '015.1102.2026.00' + Math.floor(10000 + Math.random() * 90000) + '-00',
      canalEntrada: perfilAtivo === 'requerente' ? 'Portal Externo' : 'Técnico de Fauna',
      requerente: {
        tipoPessoa: 'PF',
        nomeOuRazaoSocial: 'Geraldo Antunes Bastos',
        cpfCnpj: '456.789.123-45',
        rgOuIe: 'MG-12.456.789',
        email: 'geraldo.bastos@agroba.com.br',
        telefone: '(71) 98877-6655'
      },
      categoria: 'Categoria I',
      justificativaCategoria: 'Área destinada exclusivamente à soltura e aclimatação de aves e passeriformes.',
      propriedade: {
        nome: 'Fazenda Boa Esperança do Paraguaçu',
        tipoPropriedade: 'Imóvel Próprio',
        numeroCefir: 'BA-2901007-0044123',
        municipio: 'Andaraí',
        cep: '46830-000',
        localizacaoDescritiva: 'Estrada Velha de Andaraí, Km 14',
        bioma: 'Caatinga',
        bacia: 'Rio Paraguaçu',
        ur: 'URCH'
      },
      responsavelTecnico: {
        nome: '',
        formacao: 'Médico Veterinário',
        conselhoClasse: 'CRMV/BA',
        numeroRegistro: '',
        artNumero: '',
        artValidade: ''
      },
      delimitacao: {
        tipo: 'CEFIR',
        areaHa: 450.0,
        centro: { lat: -12.8, lng: -41.33, datum: 'SIRGAS 2000', xPct: 53.5, yPct: 54.0 },
        pontos: [
          [-12.78, -41.35],
          [-12.79, -41.31],
          [-12.82, -41.32],
          [-12.81, -41.36]
        ],
        valido: true,
        dataDefinicao: new Date().toLocaleDateString('pt-BR')
      },
      documentos: {
        cefir: 'CEFIR_Cadastrado.pdf',
        autorizacaoProprietario: 'Titulo_Propriedade.pdf',
        croqui: 'Croqui_Acesso.pdf'
      },
      situacao: modo === 'existente' ? 'Ativa' : 'Em cadastro',
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
      solturas: [],
      relatoriosTrimestrais: [],
      historico: [
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: perfilAtivo === 'cgfau' ? 'Dr. Herickles Almado (CGFAU)' : 'Usuário do Sistema',
          papel: perfilAtivo === 'cgfau' ? 'Coordenador CGFAU' : 'Requerente',
          acao: modo === 'existente' ? 'Cadastro de ASAS Existente pelo CGFAU' : 'Início do Preenchimento de Requerimento'
        }
      ],
      recintos: []
    };
  });

  const isSomenteLeitura = modo === 'ver' || form.situacao === 'Indeferida' || form.situacao === 'Desativada';

  // Validação estrita conforme CA001 a CA007 do DR009
  const validarFormulario = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.requerente.nomeOuRazaoSocial.trim()) {
      errs['requerente.nome'] = 'Nome ou Razão Social é obrigatório.';
    }
    if (!form.requerente.cpfCnpj.trim()) {
      errs['requerente.cpfCnpj'] = 'CPF ou CNPJ é obrigatório.';
    }
    if (!form.propriedade.nome.trim()) {
      errs['propriedade.nome'] = 'Nome da Propriedade / Imóvel é obrigatório.';
    }
    if (!form.propriedade.municipio.trim()) {
      errs['propriedade.municipio'] = 'Município na Bahia é obrigatório.';
    }

    // RN-005, RN-015: Categoria II e III exigem Responsável Técnico e ART
    if (form.categoria === 'Categoria II' || form.categoria === 'Categoria III') {
      if (!form.responsavelTecnico?.nome.trim()) {
        errs['rt.nome'] = 'Responsável Técnico é obrigatório para Categorias II e III.';
      }
      if (!form.responsavelTecnico?.artNumero.trim()) {
        errs['rt.artNumero'] = 'Número da ART é obrigatório para Categorias II e III.';
      }
      if (!form.documentos.art) {
        errs['docs.art'] = 'Upload da ART é obrigatório para Categorias II e III.';
      }
      if (!form.documentos.planoTrabalho) {
        errs['docs.planoTrabalho'] = 'Upload do Plano de Trabalho é obrigatório para Categorias II e III.';
      }
    }

    // Delimitação obrigatória para protocolo
    if (!form.delimitacao || !form.delimitacao.valido) {
      errs['delimitacao'] = 'Delimitação geográfica válida é obrigatória para o protocolo.';
    }

    // RN-008 / MSG003: Bloqueio estrito se o polígono estiver fora da Bahia (ex: Minas Gerais)
    if (kmlForaBahia) {
      errs['delimitacao_kml'] =
        'MSG003: A delimitação é inválida ou está fora do Estado da Bahia. Verifique o arquivo ou o desenho. (RN-008)';
    }

    setErrosValidacao(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSalvarRascunho = () => {
    const atualizado: AsasItem = {
      ...form,
      historico: [
        ...form.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: perfilAtivo === 'cgfau' ? 'Dr. Herickles Almado (CGFAU)' : 'Operador do Sistema',
          papel: perfilAtivo,
          acao: 'Rascunho do requerimento atualizado'
        }
      ]
    };
    saveAsasItem(atualizado);
    setForm(atualizado);
    if (onConcluido) onConcluido(atualizado);
    else onVoltar();
  };

  const handleProtocolar = () => {
    if (!validarFormulario()) {
      setTabAtiva(form.categoria !== 'Categoria I' && !form.responsavelTecnico?.artNumero ? 0 : 1);
      return;
    }

    const atualizado: AsasItem = {
      ...form,
      situacao: 'Em análise',
      dataProtocolo: new Date().toLocaleDateString('pt-BR'),
      historico: [
        ...form.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: form.requerente.nomeOuRazaoSocial,
          papel: 'Requerente',
          acao: `Requerimento protocolado com sucesso sob nº ${form.numero}. Encaminhado para análise documental da CGFAU.`
        }
      ]
    };

    saveAsasItem(atualizado);
    setForm(atualizado);
    if (onConcluido) onConcluido(atualizado);
    else onVoltar();
  };

  const handleReenviarComplementacao = () => {
    const atualizado: AsasItem = {
      ...form,
      situacao: 'Em análise',
      complementacaoPendente: undefined,
      historico: [
        ...form.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: form.requerente.nomeOuRazaoSocial,
          papel: 'Requerente',
          acao: `Complementação atendida e processo reenviado para análise mantendo o nº ${form.numero}.`
        }
      ]
    };

    saveAsasItem(atualizado);
    setForm(atualizado);
    if (onConcluido) onConcluido(atualizado);
    else onVoltar();
  };

  const handleSalvarComJustificativa = () => {
    if (!justificativaEdicao.trim()) {
      alert('A justificativa da alteração de dados cadastrais é obrigatória (RN-031).');
      return;
    }

    const atualizado: AsasItem = {
      ...form,
      historico: [
        ...form.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: perfilAtivo === 'cgfau' ? 'Dr. Herickles Almado (CGFAU)' : 'Técnico de Fauna',
          papel: perfilAtivo,
          acao: 'Alteração cadastral homologada com justificativa',
          justificativa: justificativaEdicao
        }
      ]
    };

    saveAsasItem(atualizado);
    setForm(atualizado);
    setModalJustificativaAberto(false);
    if (onConcluido) onConcluido(atualizado);
    else onVoltar();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" data-testid="pagina-asas-requerimento">
      {/* Topbar com Retorno Limpo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onVoltar}
            data-testid="btn-voltar-asas-listagem"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Voltar para a listagem"
            aria-label="Voltar para a listagem"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#0F4C3A] dark:text-emerald-400">
                {form.numero}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {form.categoria}
              </Badge>
              <Badge
                variant={
                  form.situacao === 'Ativa'
                    ? 'success'
                    : form.situacao === 'Certificado vencido' || form.situacao === 'Indeferida'
                    ? 'danger'
                    : form.situacao === 'Suspensa'
                    ? 'warning'
                    : 'gray'
                }
                dot
              >
                {form.situacao}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {modo === 'novo'
                ? 'Novo Requerimento de ASAS'
                : modo === 'existente'
                ? 'Cadastro de ASAS Existente (CGFAU)'
                : `Requerimento: ${form.propriedade.nome || form.numero}`}
            </h1>
          </div>
        </div>

        {/* Ações Primárias da Barra */}
        <div className="flex items-center gap-2">
          {!isSomenteLeitura && (
            <>
              {form.situacao === 'Em cadastro' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSalvarRascunho}
                    data-testid="btn-salvar-rascunho-asas"
                    className="text-xs gap-1.5 h-9"
                  >
                    <Save className="w-3.5 h-3.5" /> Salvar Rascunho
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleProtocolar}
                    data-testid="btn-protocolar-asas"
                    className="text-xs gap-1.5 h-9 bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white"
                  >
                    <Send className="w-3.5 h-3.5" /> Protocolar Requerimento
                  </Button>
                </>
              )}

              {form.situacao === 'Em complementação' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSalvarRascunho}
                    className="text-xs gap-1.5 h-9"
                  >
                    <Save className="w-3.5 h-3.5" /> Salvar Rascunho
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleReenviarComplementacao}
                    data-testid="btn-reenviar-complementacao-asas"
                    className="text-xs gap-1.5 h-9 bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white"
                  >
                    <Send className="w-3.5 h-3.5" /> Reenviar Complementação
                  </Button>
                </>
              )}

              {['Ativa', 'Aguardando termo', 'Suspensa', 'Em análise'].includes(form.situacao) && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setModalJustificativaAberto(true)}
                  data-testid="btn-salvar-alteracoes-justificadas-asas"
                  className="text-xs gap-1.5 h-9 bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white"
                >
                  <Save className="w-3.5 h-3.5" /> Salvar Alterações
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Aviso de Complementação Solicitada (se aplicável) */}
      {form.situacao === 'Em complementação' && form.complementacaoPendente && (
        <div
          data-testid="alerta-complementacao-pendente"
          className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Complementação Técnica Solicitada pela CGFAU:</h4>
            <p className="leading-relaxed">{form.complementacaoPendente}</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium pt-1">
              * Conforme a norma oficial, não há prazo fixo estipulado para o atendimento desta complementação.
            </p>
          </div>
        </div>
      )}

      {/* Alerta de Validação com Erros */}
      {Object.keys(errosValidacao).length > 0 && (
        <div
          data-testid="alerta-erros-validacao-asas"
          className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-900 dark:text-rose-200 space-y-1"
        >
          <div className="flex items-center gap-2 font-bold text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Não foi possível protocolar o requerimento. Corrija as pendências:</span>
          </div>
          <ul className="list-disc pl-6 space-y-0.5 text-[11px]">
            {Object.values(errosValidacao).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Abas Oficiais do Requerimento (1 a 5) */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
          {TABS_REQUERIMENTO.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={tabAtiva === tab.id}
              onClick={() => setTabAtiva(tab.id)}
              data-testid={`tab-requerimento-${tab.id}`}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                tabAtiva === tab.id
                  ? 'border-[#0F4C3A] text-[#0F4C3A] bg-emerald-50/50 dark:bg-emerald-950/30'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTEÚDO DAS ABAS */}

      {/* ABA 0: REQUERIMENTO & CATEGORIA */}
      {tabAtiva === 0 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              Identificação do Requerente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Tipo de Pessoa *</label>
                <select
                  disabled={isSomenteLeitura}
                  value={form.requerente.tipoPessoa}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      requerente: { ...form.requerente, tipoPessoa: e.target.value as 'PF' | 'PJ' }
                    })
                  }
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs"
                >
                  <option value="PF">Pessoa Física (PF)</option>
                  <option value="PJ">Pessoa Jurídica (PJ)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Nome Completo / Razão Social *
                </label>
                <input
                  type="text"
                  disabled={isSomenteLeitura}
                  value={form.requerente.nomeOuRazaoSocial}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      requerente: { ...form.requerente, nomeOuRazaoSocial: e.target.value }
                    })
                  }
                  data-testid="input-requerente-nome"
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {form.requerente.tipoPessoa === 'PF' ? 'CPF *' : 'CNPJ *'}
                </label>
                <input
                  type="text"
                  disabled={isSomenteLeitura}
                  value={form.requerente.cpfCnpj}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      requerente: { ...form.requerente, cpfCnpj: e.target.value }
                    })
                  }
                  data-testid="input-requerente-cpf"
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {form.requerente.tipoPessoa === 'PF' ? 'RG / Órgão Expedidor' : 'Inscrição Estadual'}
                </label>
                <input
                  type="text"
                  disabled={isSomenteLeitura}
                  value={form.requerente.rgOuIe}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      requerente: { ...form.requerente, rgOuIe: e.target.value }
                    })
                  }
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">E-mail para Notificações *</label>
                <input
                  type="email"
                  disabled={isSomenteLeitura}
                  value={form.requerente.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      requerente: { ...form.requerente, email: e.target.value }
                    })
                  }
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              Classificação e Categoria da ASAS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Categoria Solicitada *</label>
                <select
                  disabled={isSomenteLeitura}
                  value={form.categoria}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoria: e.target.value as CategoriaAsas
                    })
                  }
                  data-testid="select-categoria-asas"
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs font-semibold"
                >
                  <option value="Categoria I">Categoria I — Soltura Imediata (Área Natural)</option>
                  <option value="Categoria II">Categoria II — Aclimatação (com Recintos)</option>
                  <option value="Categoria III">Categoria III — Readaptação / Centro Avançado</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  * Categorias II e III também podem receber solturas imediatas (RN-005).
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Justificativa Técnica da Categoria Pretendida
                </label>
                <textarea
                  rows={2}
                  disabled={isSomenteLeitura}
                  value={form.justificativaCategoria || ''}
                  onChange={(e) => setForm({ ...form, justificativaCategoria: e.target.value })}
                  placeholder="Descreva as condições estruturais e objetivos conservacionistas da propriedade..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Seção de Responsável Técnico (Obrigatório para II e III) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />
                <span>Responsável Técnico (RT) — Obrigatório para Categorias II e III</span>
              </h4>
              {form.categoria === 'Categoria I' && (
                <Badge variant="outline" className="text-[10px]">Opcional na Categoria I</Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nome do Profissional *</label>
                <input
                  type="text"
                  disabled={isSomenteLeitura}
                  value={form.responsavelTecnico?.nome || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      responsavelTecnico: {
                        ...(form.responsavelTecnico || {
                          formacao: 'Biólogo',
                          conselhoClasse: 'CRBio',
                          artNumero: '',
                          artValidade: '',
                          numeroRegistro: ''
                        }),
                        nome: e.target.value
                      }
                    })
                  }
                  data-testid="input-rt-nome"
                  className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white px-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Conselho / Registro *</label>
                <input
                  type="text"
                  disabled={isSomenteLeitura}
                  value={`${form.responsavelTecnico?.conselhoClasse || 'CRMV/BA'} ${form.responsavelTecnico?.numeroRegistro || ''}`}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      responsavelTecnico: {
                        ...(form.responsavelTecnico || {
                          formacao: 'Médico Veterinário',
                          artNumero: '',
                          artValidade: '',
                          nome: ''
                        }),
                        conselhoClasse: 'CRMV/BA',
                        numeroRegistro: e.target.value
                      }
                    })
                  }
                  placeholder="Ex: CRMV/BA 4890"
                  className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white px-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Número da ART *</label>
                <input
                  type="text"
                  disabled={isSomenteLeitura}
                  value={form.responsavelTecnico?.artNumero || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      responsavelTecnico: {
                        ...(form.responsavelTecnico || {
                          formacao: 'Biólogo',
                          conselhoClasse: 'CRBio',
                          nome: '',
                          numeroRegistro: '',
                          artValidade: ''
                        }),
                        artNumero: e.target.value
                      }
                    })
                  }
                  data-testid="input-rt-art"
                  placeholder="Ex: ART-2026-004412"
                  className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white px-2.5 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 1: PROPRIEDADE & LOCALIZAÇÃO */}
      {tabAtiva === 1 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              Dados do Imóvel Rural
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nome da Propriedade / Fazenda *</label>
                <input
                  type="text"
                  disabled={isSomenteLeitura}
                  value={form.propriedade.nome}
                  onChange={(e) =>
                    setForm({ ...form, propriedade: { ...form.propriedade, nome: e.target.value } })
                  }
                  data-testid="input-propriedade-nome"
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Vínculo com o Imóvel *</label>
                <select
                  disabled={isSomenteLeitura}
                  value={form.propriedade.tipoPropriedade}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      propriedade: {
                        ...form.propriedade,
                        tipoPropriedade: e.target.value as any
                      }
                    })
                  }
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs"
                >
                  <option value="Imóvel Próprio">Imóvel Próprio</option>
                  <option value="Imóvel de Terceiros (com anuência)">Imóvel de Terceiros (com anuência)</option>
                  <option value="Posse">Posse</option>
                  <option value="Concessão / Uso">Concessão / Uso</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Número CEFIR *</label>
                <input
                  type="text"
                  disabled={isSomenteLeitura}
                  value={form.propriedade.numeroCefir || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      propriedade: { ...form.propriedade, numeroCefir: e.target.value }
                    })
                  }
                  placeholder="Ex: BA-2901007-..."
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Município (Bahia) *</label>
                <input
                  type="text"
                  disabled={isSomenteLeitura}
                  value={form.propriedade.municipio}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      propriedade: { ...form.propriedade, municipio: e.target.value }
                    })
                  }
                  data-testid="input-propriedade-municipio"
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">CEP</label>
                <input
                  type="text"
                  disabled={isSomenteLeitura}
                  value={form.propriedade.cep}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      propriedade: { ...form.propriedade, cep: e.target.value }
                    })
                  }
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Atributos Ambientais Calculados */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              Atributos Ambientais e Regionais (Preenchimento Automático)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">Bioma</label>
                <select
                  disabled={isSomenteLeitura}
                  value={form.propriedade.bioma}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      propriedade: { ...form.propriedade, bioma: e.target.value as BiomaBahia }
                    })
                  }
                  className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white px-2.5 text-xs font-medium"
                >
                  <option value="Caatinga">Caatinga</option>
                  <option value="Cerrado">Cerrado</option>
                  <option value="Mata Atlântica">Mata Atlântica</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">Bacia Hidrográfica</label>
                <select
                  disabled={isSomenteLeitura}
                  value={form.propriedade.bacia}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      propriedade: { ...form.propriedade, bacia: e.target.value as BaciaHidrograficaBahia }
                    })
                  }
                  className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white px-2.5 text-xs font-medium"
                >
                  <option value="Rio Paraguaçu">Rio Paraguaçu</option>
                  <option value="Rio São Francisco">Rio São Francisco</option>
                  <option value="Rio de Contas">Rio de Contas</option>
                  <option value="Rio Itapicuru">Rio Itapicuru</option>
                  <option value="Rio Pardo">Rio Pardo</option>
                  <option value="Rio Grande">Rio Grande</option>
                  <option value="Rio Cachoeira">Rio Cachoeira</option>
                  <option value="Rio Una">Rio Una</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">Unidade Regional (UR)</label>
                <select
                  disabled={isSomenteLeitura}
                  value={form.propriedade.ur}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      propriedade: { ...form.propriedade, ur: e.target.value as UnidadeRegionalBahia }
                    })
                  }
                  className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white px-2.5 text-xs font-medium"
                >
                  <option value="URCH">URCH (Chapada)</option>
                  <option value="URES">URES (Litoral Leste)</option>
                  <option value="UROE">UROE (Oeste)</option>
                  <option value="URPD">URPD (Paraguaçu-Delta)</option>
                  <option value="URPS">URPS (Porto Seguro)</option>
                  <option value="URRC">URRC (Rio de Contas)</option>
                  <option value="URSF">URSF (São Francisco)</option>
                  <option value="URSO">URSO (Sudoeste)</option>
                  <option value="URSU">URSU (Sul)</option>
                </select>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              * A alteração manual de Bioma, Bacia ou UR exige justificativa formal de localização (RN-005).
            </p>
          </div>

          {/* Delimitação Geográfica e Polígono */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Delimitação Cartográfica da Área de Soltura
              </h4>
              <Badge variant="success" className="text-[10px]">
                Área Calculada: {form.delimitacao?.areaHa || 0} ha
              </Badge>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="font-medium text-slate-600">Origem da Delimitação:</span>
                <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                  {form.delimitacao?.tipo || 'CEFIR Integrado'}
                </span>
                <span className="text-slate-400">|</span>
                <span>Coordenadas Centroide (SIRGAS 2000):</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  Lat {form.delimitacao?.centro.lat || -12.8}, Long {form.delimitacao?.centro.lng || -41.33}
                </span>
              </div>

              {/* Simulação visual do polígono no mapa */}
              <div className="h-44 w-full bg-[#E9EFE6] dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 relative overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 400 160" className="w-full h-full">
                  {/* Grid de fundo */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Polígono do Imóvel */}
                  <polygon
                    points="80,30 280,20 320,120 120,140"
                    fill="#10b981"
                    fillOpacity="0.2"
                    stroke="#059669"
                    strokeWidth="2"
                  />
                  {/* Reserva Legal */}
                  <polygon
                    points="140,50 250,45 270,100 160,110"
                    fill="#059669"
                    fillOpacity="0.4"
                    stroke="#047857"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {/* Ponto Central GPS */}
                  <circle cx="200" cy="80" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="210" y="84" fontSize="10" fill="#1e293b" fontWeight="bold">
                    Ponto Central da ASAS
                  </text>
                </svg>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                <span>Resultado da Validação do Arquivo KML (Parser Geográfico RN-008):</span>
                {kmlForaBahia ? (
                  <Badge variant="danger" dot data-testid="badge-status-geometria-invalida">
                    Geometria Inválida: Vértices fora da malha estadual da Bahia (RN-008 / MSG003)
                  </Badge>
                ) : (
                  <Badge variant="success" dot data-testid="badge-status-geometria-valida">
                    Geometria Válida: Todos os vértices situados na Bahia (SIRGAS 2000)
                  </Badge>
                )}
              </div>

              {/* Detalhamento Técnico: Diferenciação entre Simulação Geográfica e Validação Efetiva de KML */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] space-y-1.5 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Arquivo KML Carregado:</span>
                  <span className="font-mono">{kmlForaBahia ? 'delimitacao_divisa_mg_invalida.kml' : 'delimitacao_fazenda_boa_esperanca.kml'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Validação Vetorial dos Vértices:</span>
                  <span>{kmlForaBahia ? 'Vértice 03 [Lat -16.1245°, Long -42.1890°] intercepta Minas Gerais' : '4 vértices conferidos dentro da Bahia'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Método de Checagem:</span>
                  <span>Parser GeoJSON / Interseção com Malha Territorial IBGE-SEI (RN-008)</span>
                </div>
              </div>

              {/* Botões de Simulação Comportamental (CA003) */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-testid="btn-simular-kml-fora-bahia-mg"
                  onClick={() => {
                    setKmlForaBahia(true);
                    setErrosValidacao((prev) => ({
                      ...prev,
                      delimitacao_kml:
                        'MSG003: A delimitação é inválida ou está fora do Estado da Bahia. Verifique o arquivo ou o desenho. (RN-008)'
                    }));
                  }}
                  className="h-6 text-[10px] px-2 text-rose-800 border-rose-300 bg-rose-50 hover:bg-rose-100 cursor-pointer"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  Carregar KML de Teste (Interseção com Minas Gerais)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-testid="btn-restaurar-kml-valido-ba"
                  onClick={() => {
                    setKmlForaBahia(false);
                    setErrosValidacao((prev) => {
                      const next = { ...prev };
                      delete next.delimitacao_kml;
                      return next;
                    });
                  }}
                  className="h-6 text-[10px] px-2 text-emerald-800 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  Restabelecer KML Válido (Bahia)
                </Button>
              </div>

              {kmlForaBahia && (
                <div
                  data-testid="msg-bloqueio-kml-fora-bahia"
                  className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    MSG003: A delimitação é inválida ou está fora do Estado da Bahia. Verifique o arquivo ou o desenho. (RN-008)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: DOCUMENTAÇÃO ANEXA */}
      {tabAtiva === 2 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              Documentos Obrigatórios do Requerimento
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Formatos aceitos: PDF, JPG ou PNG. Documentos com prazo de validade devem ser acompanhados da data de
              vencimento.
            </p>

            <table className="w-full text-left border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">Documento Exigido</th>
                  <th className="p-3">Obrigatoriedade</th>
                  <th className="p-3">Arquivo Anexado</th>
                  <th className="p-3">Validade</th>
                  <th className="p-3">Situação</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3 font-medium">Recibo de Inscrição no CEFIR</td>
                  <td className="p-3 text-rose-600 font-bold">Sim</td>
                  <td className="p-3 font-mono">{form.documentos.cefir || 'Nenhum'}</td>
                  <td className="p-3 text-slate-400">Indeterminada</td>
                  <td className="p-3">
                    <Badge variant={form.documentos.cefir ? 'success' : 'danger'}>
                      {form.documentos.cefir ? 'Anexado' : 'Pendente'}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                      <Upload className="w-3 h-3" /> Anexar
                    </Button>
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-medium">Título de Propriedade ou Posse</td>
                  <td className="p-3 text-rose-600 font-bold">Sim</td>
                  <td className="p-3 font-mono">{form.documentos.autorizacaoProprietario || 'Nenhum'}</td>
                  <td className="p-3 text-slate-400">Indeterminada</td>
                  <td className="p-3">
                    <Badge variant={form.documentos.autorizacaoProprietario ? 'success' : 'danger'}>
                      {form.documentos.autorizacaoProprietario ? 'Anexado' : 'Pendente'}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                      <Upload className="w-3 h-3" /> Anexar
                    </Button>
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-medium">Croqui de Acesso e Localização</td>
                  <td className="p-3 text-rose-600 font-bold">Sim</td>
                  <td className="p-3 font-mono">{form.documentos.croqui || 'Nenhum'}</td>
                  <td className="p-3 text-slate-400">-</td>
                  <td className="p-3">
                    <Badge variant={form.documentos.croqui ? 'success' : 'danger'}>
                      {form.documentos.croqui ? 'Anexado' : 'Pendente'}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                      <Upload className="w-3 h-3" /> Anexar
                    </Button>
                  </td>
                </tr>

                {/* Exigências para Categoria II e III */}
                {(form.categoria === 'Categoria II' || form.categoria === 'Categoria III') && (
                  <>
                    <tr className="bg-emerald-50/30">
                      <td className="p-3 font-medium">
                        ART do Responsável Técnico (Cat. II e III)
                      </td>
                      <td className="p-3 text-rose-600 font-bold">Sim</td>
                      <td className="p-3 font-mono">{form.documentos.art || 'Nenhum'}</td>
                      <td className="p-3 font-mono">2027-10-15</td>
                      <td className="p-3">
                        <Badge variant={form.documentos.art ? 'success' : 'danger'}>
                          {form.documentos.art ? 'Anexado' : 'Pendente'}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                          <Upload className="w-3 h-3" /> Anexar
                        </Button>
                      </td>
                    </tr>

                    <tr className="bg-emerald-50/30">
                      <td className="p-3 font-medium">Plano de Trabalho e Manejo de Fauna</td>
                      <td className="p-3 text-rose-600 font-bold">Sim</td>
                      <td className="p-3 font-mono">{form.documentos.planoTrabalho || 'Nenhum'}</td>
                      <td className="p-3 text-slate-400">Vigência ASAS</td>
                      <td className="p-3">
                        <Badge variant={form.documentos.planoTrabalho ? 'success' : 'danger'}>
                          {form.documentos.planoTrabalho ? 'Anexado' : 'Pendente'}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                          <Upload className="w-3 h-3" /> Anexar
                        </Button>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Análise Documental pelo Técnico (Certidões Ambientais) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Análise Documental — Consulta de Antecedentes Ambientais (RN-015)
            </h4>
            <p className="text-[11px] text-slate-500">
              Certidões negativas consultadas e anexadas diretamente pelo Técnico de Fauna do INEMA.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold block">Certidão Negativa IBAMA</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {form.documentos.certidaoIbama || 'Certidao_Negativa_IBAMA_Valida.pdf'}
                  </span>
                </div>
                <Badge variant="success" dot>Regular</Badge>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold block">Certidão Negativa INEMA (ASCAI)</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {form.documentos.certidaoAscai || 'Certidao_Negativa_ASCAI_INEMA.pdf'}
                  </span>
                </div>
                <Badge variant="success" dot>Regular</Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: SOLTURAS REALIZADAS (SOMENTE LEITURA - DR008) */}
      {tabAtiva === 3 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Solturas Realizadas Nesta Área (Integração DR008)
              </h3>
              <p className="text-[11px] text-slate-500">
                Histórico de espécimes silvestres recebidos e soltos sob supervisão do INEMA.
              </p>
            </div>
            <Badge variant="outline">
              Total de Solturas: {form.solturas.reduce((acc, s) => acc + s.quantidade, 0)} animais
            </Badge>
          </div>

          {form.solturas.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-medium">Nenhuma soltura registrada para esta propriedade.</p>
              <p className="text-[11px] mt-1">
                Registros são alimentados automaticamente quando o CETAS emite Termos de Soltura (DR008).
              </p>
            </div>
          ) : (
            <table className="w-full text-left border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">Data</th>
                  <th className="p-3">Espécie</th>
                  <th className="p-3">Grupo</th>
                  <th className="p-3">Quantidade</th>
                  <th className="p-3">Unidade de Origem</th>
                  <th className="p-3">Termo de Soltura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {form.solturas.map((s) => (
                  <tr key={s.id}>
                    <td className="p-3 font-mono">{s.data}</td>
                    <td className="p-3">
                      <strong>{s.especie}</strong> (<em>{s.nomeCientifico}</em>)
                    </td>
                    <td className="p-3">{s.grupo}</td>
                    <td className="p-3 font-bold text-emerald-800">{s.quantidade}</td>
                    <td className="p-3">{s.unidadeOrigem}</td>
                    <td className="p-3 font-mono text-[#0F4C3A] font-bold">{s.termoSolturaNumero}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ABA 4: HISTÓRICO E TRÂMITES */}
      {tabAtiva === 4 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-xs">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Linha do Tempo de Auditoria e Eventos (RN-025)
            </h3>
            <p className="text-[11px] text-slate-500">
              Registro cronológico inalterável de todas as etapas, vistorias, despachos e justificativas.
            </p>
          </div>

          <div className="space-y-3">
            {form.historico.map((h) => (
              <div
                key={h.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#0F4C3A] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{h.acao}</span>
                    <span className="font-mono text-[10px] text-slate-400">{h.dataHora}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Usuário: <strong>{h.usuario}</strong> ({h.papel})
                  </p>
                  {h.justificativa && (
                    <div className="mt-1.5 p-2 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-950 text-[11px]">
                      <strong>Justificativa registrada:</strong> {h.justificativa}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Justificativa Mandatória para Edições Posteriores (RN-031) */}
      {modalJustificativaAberto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Justificativa de Alteração Cadastral (RN-031)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Este requerimento já foi protocolado. Conforme a regra RN-031, qualquer modificação de dados cadastrais,
              responsável técnico ou localização exige justificativa formal para constar na trilha de auditoria.
            </p>

            <textarea
              rows={4}
              value={justificativaEdicao}
              onChange={(e) => setJustificativaEdicao(e.target.value)}
              placeholder="Digite a justificativa detalhada para esta alteração..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 p-3 text-xs"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalJustificativaAberto(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSalvarComJustificativa}
                className="text-xs bg-[#0F4C3A] text-white"
              >
                Confirmar Alteração
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
