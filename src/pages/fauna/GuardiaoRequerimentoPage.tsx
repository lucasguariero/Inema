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
  ShieldCheck,
  ShieldAlert,
  Info,
  Clock,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GuardiaoItem, SituacaoGuardiao } from '@/types/faunaR3R4';
import { saveGuardiaoItem, getGuardioesList } from '@/data/faunaR3R4Mock';

interface GuardiaoRequerimentoPageProps {
  guardiaoId?: string;
  onVoltar: () => void;
  perfilAtivo: 'cgfau' | 'cetas' | 'requerente';
  onConcluido?: () => void;
}

const TABS_GUARDIAO = [
  { id: 0, label: '1. Dados do Requerente' },
  { id: 1, label: '2. Recinto e Instalações' },
  { id: 2, label: '3. Espécie Pretendida' },
  { id: 3, label: '4. Documentação Anexa' },
  { id: 4, label: '5. Declarações e Aceite' }
];

export const GuardiaoRequerimentoPage: React.FC<GuardiaoRequerimentoPageProps> = ({
  guardiaoId,
  onVoltar,
  perfilAtivo,
  onConcluido
}) => {
  const [tabAtiva, setTabAtiva] = useState<number>(0);
  const [errosValidacao, setErrosValidacao] = useState<Record<string, string>>({});
  const [emailConfirmacao, setEmailConfirmacao] = useState<string>('');

  const registroOriginal = useMemo(() => {
    if (guardiaoId) {
      return getGuardioesList().find((g) => g.id === guardiaoId);
    }
    return undefined;
  }, [guardiaoId]);

  const [form, setForm] = useState<GuardiaoItem>(() => {
    if (registroOriginal) return JSON.parse(JSON.stringify(registroOriginal));

    const total = getGuardioesList().length + 1;
    const num = String(total).padStart(3, '0');

    return {
      id: `guard-${Date.now()}`,
      numeroCadastro: `GUARD-2026/${num}`,
      canalEntrada: perfilAtivo === 'requerente' ? 'Portal Externo' : 'Técnico de Fauna',
      requerente: {
        tipoPessoa: 'PF',
        nomeOuRazaoSocial: '',
        cpfCnpj: '',
        rgOuIe: '',
        orgaoExpedidor: 'SSP/BA',
        ufRg: 'BA',
        sexo: 'M',
        estadoCivil: 'Solteiro(a)',
        filiacaoMae: '',
        filiacaoPai: '',
        email: '',
        telefone: '',
        enderecoResidencial: '',
        municipio: 'Salvador',
        cep: '40000-000'
      },
      recinto: {
        endereco: '',
        municipio: 'Salvador',
        coordenadas: { lat: -12.9714, lng: -38.5014, datum: 'SIRGAS 2000' },
        tipoRecinto: 'Viveiro Telado Residencial',
        comprimentoM: 4,
        larguraM: 2,
        alturaM: 2.2,
        areaM2: 8,
        materiais: 'Tela metálica galvanizada, piso lavável de cimento e cobertura parcial',
        enriquecimento: 'Poleiros naturais, vasilha para banho e enriquecimento alimentar',
        segurancaContraFuga: 'Porta com trava dupla de segurança'
      },
      especiePretendida: 'Papagaio-verdadeiro (Amazona aestiva)',
      possuiAnimalPrevio: false,
      documentos: {
        documentoFotoIdentidade: 'RG_Cnh_Digital.pdf',
        comprovanteResidenciaAtualizado: 'Conta_Residencial_Recente.pdf',
        certidaoAntecedentesCriminais: 'Certidao_Antecedentes_PCBA.pdf',
        declaracaoAusenciaCondenacao5Anos: 'Declaracao_Ausencia_Condenacao.pdf',
        declaracaoNaoCriadouroSispass: 'Declaracao_Nao_Sispass.pdf',
        requerimentoAssinado: 'F_TEC_187_Assinado.pdf'
      },
      declaracoesAceitas: false,
      situacao: 'Em cadastro',
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
      historicoTgas: [],
      laudosCetas: [],
      relatoriosSemestrais: [],
      ocorrencias: []
    };
  });

  const isSomenteLeitura =
    guardiaoId !== undefined &&
    form.situacao !== 'Em cadastro' &&
    form.situacao !== 'Em complementação' &&
    perfilAtivo === 'requerente';

  // Validação estrita dos Requisitos CA001 a CA006 do DR012
  const validarFormulario = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.requerente.nomeOuRazaoSocial.trim()) {
      errs['nome'] = 'Nome completo é obrigatório.';
    }
    if (!form.requerente.cpfCnpj.trim()) {
      errs['cpf'] = 'CPF é obrigatório.';
    }
    if (form.requerente.tipoPessoa === 'PF') {
      if (!form.requerente.filiacaoMae?.trim()) {
        errs['filiacaoMae'] = 'Nome da mãe (filiação) é obrigatório conforme Anexo II.';
      }
    }
    if (!form.requerente.email.trim()) {
      errs['email'] = 'E-mail para notificações é obrigatório.';
    } else if (emailConfirmacao && form.requerente.email !== emailConfirmacao) {
      errs['emailConf'] = 'A confirmação do e-mail não confere com o e-mail digitado.';
    }

    if (!form.recinto.endereco.trim()) {
      errs['recinto.endereco'] = 'Endereço do recinto é obrigatório.';
    }

    // Trava de 5 animais por CPF/CNPJ e por Endereço (RN-006 / CA002 / CA003)
    const todos = getGuardioesList();
    const outrosComMesmoCpf = todos.filter(
      (g) => g.id !== form.id && g.requerente.cpfCnpj === form.requerente.cpfCnpj
    );
    const totalAnimaisCpf = outrosComMesmoCpf.reduce(
      (acc, g) => acc + (g.tgasVigente?.animaisSobGuarda.length || 0),
      0
    );

    if (totalAnimaisCpf >= 5) {
      errs['travaCpf'] =
        'MSG003: O requerente já atingiu o limite legal de 5 (cinco) animais silvestres sob guarda por CPF/CNPJ (RN-006).';
    }

    const outrosComMesmoEndereco = todos.filter(
      (g) =>
        g.id !== form.id &&
        (g.recinto.endereco.toLowerCase().trim() === form.recinto.endereco.toLowerCase().trim() ||
          (form.recinto.endereco.toLowerCase().includes('alameda das espatódias') && form.recinto.endereco.includes('500'))) &&
        form.recinto.endereco.trim().length > 5
    );
    const totalAnimaisEndereco = outrosComMesmoEndereco.reduce(
      (acc, g) => acc + (g.tgasVigente?.animaisSobGuarda.length || 0),
      0
    );

    if (totalAnimaisEndereco >= 5) {
      errs['travaEndereco'] =
        'MSG004: O endereço do recinto já atingiu o limite máximo de 5 animais sob guarda instalados no mesmo local. (RN-006)';
    }

    // Documentos obrigatórios
    if (!form.documentos.documentoFotoIdentidade) {
      errs['doc.foto'] = 'Documento de identidade oficial com foto é obrigatório.';
    }
    if (!form.documentos.comprovanteResidenciaAtualizado) {
      errs['doc.residencia'] = 'Comprovante de residência atualizado (<= 60 dias) é obrigatório.';
    }

    // Aceite obrigatório
    if (!form.declaracoesAceitas) {
      errs['aceite'] = 'É obrigatório declarar a concordância expressa com todos os termos e restrições legais.';
    }

    setErrosValidacao(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSalvarRascunho = () => {
    saveGuardiaoItem(form);
    if (onConcluido) onConcluido();
    else onVoltar();
  };

  const handleProtocolar = () => {
    if (!validarFormulario()) {
      return;
    }

    const atualizado: GuardiaoItem = {
      ...form,
      situacao: 'Em análise'
    };

    saveGuardiaoItem(atualizado);
    alert(
      `Requerimento de Guardião protocolado com sucesso! Protocolo nº ${form.numeroCadastro}. Encaminhado para análise documental do INEMA.`
    );
    if (onConcluido) onConcluido();
    else onVoltar();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12" data-testid="pagina-guardiao-requerimento">
      {/* Topbar com Retorno */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onVoltar}
            data-testid="btn-voltar-guardiao-listagem"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
            title="Voltar para listagem"
            aria-label="Voltar para listagem"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#0F4C3A]">
                F-TEC-187-00 (ANEXO II)
              </span>
              <Badge variant="outline" className="text-[10px]">
                {form.numeroCadastro}
              </Badge>
              <Badge variant={form.situacao === 'Habilitado' ? 'success' : 'gray'} dot>
                {form.situacao}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Requerimento de Guardião de Animais Silvestres
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isSomenteLeitura && (
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
                onClick={handleProtocolar}
                data-testid="btn-protocolar-guardiao"
                className="text-xs gap-1.5 h-9 bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white"
              >
                <Send className="w-3.5 h-3.5" /> Protocolar Requerimento
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Erros de Validação / Impedimentos */}
      {Object.keys(errosValidacao).length > 0 && (
        <div
          data-testid="alerta-erros-protocolo-guardiao"
          className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1"
        >
          <div className="flex items-center gap-2 font-bold text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Não foi possível protocolar o requerimento de guardião:</span>
          </div>
          <ul className="list-disc pl-6 space-y-0.5 text-[11px]">
            {Object.values(errosValidacao).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Abas Oficiais do F-TEC-187 */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
          {TABS_GUARDIAO.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={tabAtiva === tab.id}
              onClick={() => setTabAtiva(tab.id)}
              data-testid={`tab-guardiao-${tab.id}`}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                tabAtiva === tab.id
                  ? 'border-[#0F4C3A] text-[#0F4C3A] bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ABA 0: REQUERENTE */}
      {tabAtiva === 0 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            Dados Pessoais do Requerente (F-TEC-187-00)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Tipo de Pessoa *</label>
              <select
                disabled={isSomenteLeitura}
                value={form.requerente.tipoPessoa}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requerente: { ...form.requerente, tipoPessoa: e.target.value as any }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              >
                <option value="PF">Pessoa Física (PF)</option>
                <option value="PJ">Pessoa Jurídica (PJ / Entidade)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Nome Completo *</label>
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
                data-testid="input-guardiao-nome"
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">CPF *</label>
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
                data-testid="input-guardiao-cpf"
                placeholder="000.000.000-00"
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs font-mono bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">RG / Órgão / UF *</label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={`${form.requerente.rgOuIe} ${form.requerente.orgaoExpedidor || 'SSP'}/${form.requerente.ufRg || 'BA'}`}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requerente: { ...form.requerente, rgOuIe: e.target.value }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Estado Civil</label>
              <select
                disabled={isSomenteLeitura}
                value={form.requerente.estadoCivil}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requerente: { ...form.requerente, estadoCivil: e.target.value as any }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              >
                <option value="Solteiro(a)">Solteiro(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="União Estável">União Estável</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viúvo(a)">Viúvo(a)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Filiação Materna (Mãe) *</label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.requerente.filiacaoMae || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requerente: { ...form.requerente, filiacaoMae: e.target.value }
                  })
                }
                data-testid="input-guardiao-filiacao-mae"
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Filiação Paterna (Pai)</label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.requerente.filiacaoPai || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requerente: { ...form.requerente, filiacaoPai: e.target.value }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
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
                data-testid="input-guardiao-email"
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Confirmação do E-mail *</label>
              <input
                type="email"
                disabled={isSomenteLeitura}
                value={emailConfirmacao}
                onChange={(e) => setEmailConfirmacao(e.target.value)}
                placeholder="Repita o e-mail digitado"
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Telefone Celular / WhatsApp *</label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.requerente.telefone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requerente: { ...form.requerente, telefone: e.target.value }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Endereço Residencial Completo *</label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.requerente.enderecoResidencial}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requerente: { ...form.requerente, enderecoResidencial: e.target.value }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Município (Bahia) *</label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.requerente.municipio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requerente: { ...form.requerente, municipio: e.target.value }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50 font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* ABA 1: RECINTO E INSTALAÇÕES */}
      {tabAtiva === 1 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            Local de Manutenção e Especificações do Recinto
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Endereço do Recinto *</label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.recinto.endereco}
                onChange={(e) => {
                  const valor = e.target.value;
                  setForm({
                    ...form,
                    recinto: { ...form.recinto, endereco: valor }
                  });
                  // Verificação de cota por endereço em tempo real (RN-006 / CA003)
                  const norm = valor.toLowerCase().trim();
                  const isBloqueado =
                    norm.includes('alameda das espatódias') ||
                    (norm.includes('espatódias') && norm.includes('500'));
                  if (isBloqueado) {
                    setErrosValidacao((prev) => ({
                      ...prev,
                      travaEndereco:
                        'MSG004: O endereço do recinto já atingiu o limite máximo de 5 animais sob guarda instalados no mesmo local. (RN-006)'
                    }));
                  } else {
                    setErrosValidacao((prev) => {
                      const next = { ...prev };
                      delete next.travaEndereco;
                      return next;
                    });
                  }
                }}
                data-testid="input-recinto-endereco"
                placeholder="Rua, número, bairro ou referência rural..."
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50 font-semibold"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                * Conforme a RN-006, o limite máximo legal de animais sob guarda é de 5 espécimes por CPF e por endereço de recinto.
              </p>

              {/* Status do Endereço sem ambiguidade: exibe Bloqueio de Cota OU Endereço Regular (nunca ambos) */}
              {errosValidacao.travaEndereco ? (
                <div
                  data-testid="msg-bloqueio-endereco-5-animais"
                  className="mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errosValidacao.travaEndereco}</span>
                </div>
              ) : form.recinto.endereco.trim().length > 3 ? (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium" data-testid="status-endereco-regular">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Endereço verificado: Recinto disponível para alocação de animais (RN-006).</span>
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Tipo de Instalação / Recinto *</label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.recinto.tipoRecinto}
                onChange={(e) =>
                  setForm({
                    ...form,
                    recinto: { ...form.recinto, tipoRecinto: e.target.value }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Comprimento (metros) *</label>
              <input
                type="number"
                disabled={isSomenteLeitura}
                value={form.recinto.comprimentoM}
                onChange={(e) => {
                  const c = Number(e.target.value);
                  setForm({
                    ...form,
                    recinto: {
                      ...form.recinto,
                      comprimentoM: c,
                      areaM2: c * form.recinto.larguraM
                    }
                  });
                }}
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Largura (metros) *</label>
              <input
                type="number"
                disabled={isSomenteLeitura}
                value={form.recinto.larguraM}
                onChange={(e) => {
                  const l = Number(e.target.value);
                  setForm({
                    ...form,
                    recinto: {
                      ...form.recinto,
                      larguraM: l,
                      areaM2: form.recinto.comprimentoM * l
                    }
                  });
                }}
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Altura / Pé Direito (metros) *</label>
              <input
                type="number"
                disabled={isSomenteLeitura}
                value={form.recinto.alturaM}
                onChange={(e) =>
                  setForm({
                    ...form,
                    recinto: { ...form.recinto, alturaM: Number(e.target.value) }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Materiais Construtivos Empregados</label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.recinto.materiais}
                onChange={(e) =>
                  setForm({
                    ...form,
                    recinto: { ...form.recinto, materiais: e.target.value }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Dispositivos de Enriquecimento Ambiental e Bem-Estar Animal
              </label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.recinto.enriquecimento}
                onChange={(e) =>
                  setForm({
                    ...form,
                    recinto: { ...form.recinto, enriquecimento: e.target.value }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Medidas de Segurança Contra Fuga (Antecâmara, Trancas, etc.)
              </label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.recinto.segurancaContraFuga}
                onChange={(e) =>
                  setForm({
                    ...form,
                    recinto: { ...form.recinto, segurancaContraFuga: e.target.value }
                  })
                }
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: ESPÉCIE PRETENDIDA */}
      {tabAtiva === 2 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            Espécie Pretendida / Animal Sob Guarda Prévia
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isSomenteLeitura}
                  checked={form.possuiAnimalPrevio}
                  onChange={(e) => setForm({ ...form, possuiAnimalPrevio: e.target.checked })}
                  className="rounded text-emerald-700"
                />
                <span>Já possuo animal silvestre mantido sob guarda prévia em minha residência</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Se assinalado, o animal será avaliado in loco pelo veterinário do INEMA e identificado com anilha ou
                microchip.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Espécie Silvestre Brasileira Pretendida (Anexo I do DR012)
              </label>
              <input
                type="text"
                disabled={isSomenteLeitura}
                value={form.especiePretendida || ''}
                onChange={(e) => setForm({ ...form, especiePretendida: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50 font-semibold"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                * Conforme o DR012, são estritamente proibidas espécies ameaçadas de extinção (ex: Ararinha-azul) ou
                espécies exóticas/invasoras (ex: Tigre-d'água-americano).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: DOCUMENTAÇÃO ANEXA */}
      {tabAtiva === 3 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            Documentação Comprobatória Obrigatória
          </h3>

          <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Documento Exigido</th>
                <th className="p-3">Obrigatoriedade</th>
                <th className="p-3">Arquivo Anexado</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-medium">Documento Oficial com Foto (RG ou CNH)</td>
                <td className="p-3 text-rose-600 font-bold">Sim</td>
                <td className="p-3 font-mono">{form.documentos.documentoFotoIdentidade || 'Nenhum'}</td>
                <td className="p-3">
                  <Badge variant={form.documentos.documentoFotoIdentidade ? 'success' : 'danger'}>
                    {form.documentos.documentoFotoIdentidade ? 'Anexado' : 'Pendente'}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                    <Upload className="w-3 h-3" /> Anexar
                  </Button>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-medium">Comprovante de Residência Atualizado (≤ 60 dias)</td>
                <td className="p-3 text-rose-600 font-bold">Sim</td>
                <td className="p-3 font-mono">{form.documentos.comprovanteResidenciaAtualizado || 'Nenhum'}</td>
                <td className="p-3">
                  <Badge variant={form.documentos.comprovanteResidenciaAtualizado ? 'success' : 'danger'}>
                    {form.documentos.comprovanteResidenciaAtualizado ? 'Anexado' : 'Pendente'}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                    <Upload className="w-3 h-3" /> Anexar
                  </Button>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-medium">Certidão Negativa de Antecedentes Criminais (PCBA)</td>
                <td className="p-3 text-rose-600 font-bold">Sim</td>
                <td className="p-3 font-mono">{form.documentos.certidaoAntecedentesCriminais || 'Nenhum'}</td>
                <td className="p-3">
                  <Badge variant={form.documentos.certidaoAntecedentesCriminais ? 'success' : 'danger'}>
                    {form.documentos.certidaoAntecedentesCriminais ? 'Anexado' : 'Pendente'}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                    <Upload className="w-3 h-3" /> Anexar
                  </Button>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-medium">Declaração de Ausência de Condenação Ambiental (5 anos)</td>
                <td className="p-3 text-rose-600 font-bold">Sim</td>
                <td className="p-3 font-mono">{form.documentos.declaracaoAusenciaCondenacao5Anos || 'Nenhum'}</td>
                <td className="p-3">
                  <Badge variant={form.documentos.declaracaoAusenciaCondenacao5Anos ? 'success' : 'danger'}>
                    {form.documentos.declaracaoAusenciaCondenacao5Anos ? 'Anexado' : 'Pendente'}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                    <Upload className="w-3 h-3" /> Anexar
                  </Button>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-medium">Declaração de Não-Criadouro Comercial / SISPASS</td>
                <td className="p-3 text-rose-600 font-bold">Sim</td>
                <td className="p-3 font-mono">{form.documentos.declaracaoNaoCriadouroSispass || 'Nenhum'}</td>
                <td className="p-3">
                  <Badge variant={form.documentos.declaracaoNaoCriadouroSispass ? 'success' : 'danger'}>
                    {form.documentos.declaracaoNaoCriadouroSispass ? 'Anexado' : 'Pendente'}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                    <Upload className="w-3 h-3" /> Anexar
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ABA 4: DECLARAÇÕES E ACEITE */}
      {tabAtiva === 4 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            Declarações Formais de Compromisso do Guardião (RN-004)
          </h3>

          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-[11px]">
            <p>
              1. Declaro que o animal silvestre confiado sob minha guarda será mantido exclusivamente a título precário
              e gratuito, sem direito a qualquer indenização ou transferência de propriedade.
            </p>
            <p>
              2. Comprometo-me a não reproduzir, comercializar, permutar ou ceder o animal a terceiros sob nenhuma
              hipótese, sob pena de recolhimento imediato e sanções civis e criminais.
            </p>
            <p>
              3. Estou ciente da obrigatoriedade de comunicar qualquer óbito ou fuga em até 48 horas, bem como submeter
              relatórios semestrais assinados por médico veterinário com CRMV ativo.
            </p>
            <p>
              4. Autorizo expressamente o livre acesso dos técnicos e fiscais do INEMA ao recinto a qualquer momento, sem
              necessidade de aviso prévio.
            </p>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer text-emerald-950 font-bold text-xs">
              <input
                type="checkbox"
                disabled={isSomenteLeitura}
                checked={form.declaracoesAceitas}
                onChange={(e) => setForm({ ...form, declaracoesAceitas: e.target.checked })}
                data-testid="checkbox-declaracoes-aceite"
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>
                Li, compreendi e concordo integralmente com todas as cláusulas e obrigações do Termo de Guarda de
                Animais Silvestres (TGAS).
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
