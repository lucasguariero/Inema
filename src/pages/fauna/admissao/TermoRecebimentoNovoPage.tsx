import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  FileText,
  Plus,
  Trash2,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  User,
  MapPin,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  MOCK_ESPECIES,
  MOCK_UNIDADES,
  EspecieItem,
} from '@/data/faunaMock';
import {
  FatoGeradorTR,
  InstituicaoResponsavelTR,
  DocumentoApreensaoTipo,
  CondicaoAnimalTR,
  OrigemAnimalTR,
  LinhaPreCadastroTR,
  TermoRecebimentoItem,
} from '@/types/faunaAdmissao';
import {
  gerarProximoNumeroTR,
  consultarProximoNumeroTR,
  MOCK_TERMOS_RECEBIMENTO,
  notificarAtualizacaoDadosFauna,
} from '@/data/faunaAdmissaoMock';
import { TermoRecebimentoDocumento } from './TermoRecebimentoDocumento';

interface TermoRecebimentoNovoPageProps {
  onVoltar: () => void;
  onTrGerado?: (tr: TermoRecebimentoItem) => void;
}

export const TermoRecebimentoNovoPage: React.FC<TermoRecebimentoNovoPageProps> = ({
  onVoltar,
  onTrGerado,
}) => {
  // Estado de tela: 'formulario' | 'visualizacao_documento' (DOC001)
  const [viewMode, setViewMode] = useState<'formulario' | 'visualizacao_documento'>('formulario');
  const [termoGeradoFinal, setTermoGeradoFinal] = useState<TermoRecebimentoItem | null>(null);

  // Alerta de MSG003 (Apreensão sem comprovante anexo)
  const [modalAvisoMsg003, setModalAvisoMsg003] = useState(false);
  const [mensagemSucessoMsg001, setMensagemSucessoMsg001] = useState<string | null>(null);

  // C002 Unidade de Recebimento
  const [unidadeId, setUnidadeId] = useState<string>('und-01'); // Padrão CETAS Salvador CTS
  const unidadeObj = useMemo(() => {
    return MOCK_UNIDADES.find((u) => u.id === unidadeId) || MOCK_UNIDADES[0];
  }, [unidadeId]);

  // Pré-visualização do Nº DO TR (não editável)
  const proximoNumeroTrPrevisao = useMemo(() => {
    return consultarProximoNumeroTR(unidadeObj.sigla || 'CTS');
  }, [unidadeObj]);

  // C003 Data e Hora
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const horaAgora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const [dataRecebimento, setDataRecebimento] = useState<string>(dataHoje);
  const [horaRecebimento, setHoraRecebimento] = useState<string>(horaAgora);

  // C004 Fato Gerador (Procedência)
  const [fatoGerador, setFatoGerador] = useState<FatoGeradorTR>('Apreensão');
  const [instituicaoResponsavel, setInstituicaoResponsavel] = useState<InstituicaoResponsavelTR>('INEMA');
  const [instituicaoEspecificar, setInstituicaoEspecificar] = useState<string>('');
  const [orgaoOrigem, setOrgaoOrigem] = useState<string>('');

  // C006, C007, C008 Bloco Apreensão
  const [docApreensaoTipo, setDocApreensaoTipo] = useState<DocumentoApreensaoTipo>('Auto de Infração');
  const [docApreensaoNumero, setDocApreensaoNumero] = useState<string>('');
  const [dataLavratura, setDataLavratura] = useState<string>(dataHoje);
  const [comprovanteAnexado, setComprovanteAnexado] = useState<boolean>(false);
  const [comprovanteArquivoNome, setComprovanteArquivoNome] = useState<string>('');

  // C009 Agente / Instituição Responsável (inicia limpo sem dados fictícios automáticos)
  const [agenteNome, setAgenteNome] = useState<string>('');
  const [agenteRgMatricula, setAgenteRgMatricula] = useState<string>('');
  const [agenteCpfCnpj, setAgenteCpfCnpj] = useState<string>('');
  const [agenteLogradouro, setAgenteLogradouro] = useState<string>('');
  const [agenteMunicipio, setAgenteMunicipio] = useState<string>('');
  const [agenteUf, setAgenteUf] = useState<string>('BA');
  const [agenteCep, setAgenteCep] = useState<string>('');

  // C010 Entregador
  const [entregadorNome, setEntregadorNome] = useState<string>('');
  const [entregadorDocumento, setEntregadorDocumento] = useState<string>('');

  // C011 Recebedor (usuário logado / demonstrativo)
  const recebedorNome = 'Dra. Gabriela Santos (Usuário Demonstrativo)';
  const recebedorMatricula = 'CRMV/BA 4821 - Matrícula 8841-2';

  // C012 Local de Origem
  const [localOrigemLogradouro, setLocalOrigemLogradouro] = useState<string>('');
  const [localOrigemMunicipio, setLocalOrigemMunicipio] = useState<string>('');
  const [localOrigemUf, setLocalOrigemUf] = useState<string>('BA');
  const [localOrigemCep, setLocalOrigemCep] = useState<string>('');

  // Contador sequencial em sessão para IDs únicos sem colisão temporal
  const linhaSequenceRef = React.useRef<number>(1);

  // Helper opcional para demonstrações rápidas
  const handlePreencherExemploOficial = () => {
    setAgenteNome('Capitão PM Rodrigo Tavares');
    setAgenteRgMatricula('PMBA 30.412.980');
    setAgenteCpfCnpj('456.789.012-34');
    setAgenteLogradouro('Av. Dorival Caymmi, 1200');
    setAgenteMunicipio('Salvador');
    setAgenteUf('BA');
    setAgenteCep('41635-150');
    setEntregadorNome('Sgt. PM Marcos Valério Santos');
    setEntregadorDocumento('Matrícula 28.112.450');
    setLocalOrigemLogradouro('Feira Livre do Rolo, Tomba');
    setLocalOrigemMunicipio('Feira de Santana');
    setLocalOrigemUf('BA');
    setLocalOrigemCep('44090-000');
    setDocApreensaoNumero('AI-2026-9815-DIFIS');
    setOrgaoOrigem('COPPA - Polícia Militar da Bahia');
    setLote(true);
    setQuantidadeTotalLote(150);
    setLinhasAnimais([
      {
        id: 'linha-init-1',
        especieId: 'esp-006',
        especieNomeCientifico: 'Sicalis flaveola',
        especieNomePopular: 'Canário-da-terra',
        quantidadeMacho: 0,
        quantidadeFemea: 0,
        quantidadeIndeterminado: 150,
        quantidadeTotal: 150,
        condicaoAnimal: 'Saudável',
        origemAnimal: 'Vida livre',
        localOrigemPontoOuCoordenadas: 'Feira Livre do Rolo, Tomba',
        saldoPendenteTriagem: 150,
      },
    ]);
  };

  // C013 Cadastro em Lote?
  const [lote, setLote] = useState<boolean>(false);
  const [quantidadeTotalLote, setQuantidadeTotalLote] = useState<number>(150);

  // C014-C020 Linhas de Animais (Pré-Cadastro inicializado limpo sem espécie fictícia)
  const [linhasAnimais, setLinhasAnimais] = useState<LinhaPreCadastroTR[]>([
    {
      id: 'linha-init-1',
      especieId: '',
      especieNomeCientifico: '',
      especieNomePopular: '',
      quantidadeMacho: 0,
      quantidadeFemea: 0,
      quantidadeIndeterminado: 1,
      quantidadeTotal: 1,
      condicaoAnimal: 'Saudável',
      origemAnimal: 'Vida livre',
      localOrigemPontoOuCoordenadas: '',
      saldoPendenteTriagem: 1,
    },
  ]);

  // C021 Observações
  const [observacoes, setObservacoes] = useState<string>('');
  const [erros, setErros] = useState<Record<string, string>>({});

  // Proteção contra descarte acidental (DR000 / G8.1 / G8-FINAL)
  const [modalConfirmarDescarte, setModalConfirmarDescarte] = useState(false);
  const descarteConfirmadoRef = React.useRef(false);

  const isDirty = useMemo(() => {
    // 1. Unidade e Datas
    if (unidadeId !== 'und-01') return true;
    if (dataRecebimento !== dataHoje) return true;
    if (horaRecebimento !== horaAgora) return true;

    // 2. Fato Gerador e Instituições
    if (fatoGerador !== 'Apreensão') return true;
    if (instituicaoResponsavel !== 'INEMA') return true;
    if (instituicaoEspecificar.trim() !== '') return true;
    if (orgaoOrigem.trim() !== '') return true;

    // 3. Dados de Apreensão
    if (docApreensaoTipo !== 'Auto de Infração') return true;
    if (docApreensaoNumero.trim() !== '') return true;
    if (dataLavratura !== dataHoje) return true;
    if (comprovanteAnexado) return true;
    if (comprovanteArquivoNome.trim() !== '') return true;

    // 4. Dados do Responsável e Endereço Completo
    if (agenteNome.trim() !== '') return true;
    if (agenteRgMatricula.trim() !== '') return true;
    if (agenteCpfCnpj.trim() !== '') return true;
    if (agenteLogradouro.trim() !== '') return true;
    if (agenteMunicipio.trim() !== '') return true;
    if (agenteUf !== 'BA') return true;
    if (agenteCep.trim() !== '') return true;

    // 5. Entregador
    if (entregadorNome.trim() !== '') return true;
    if (entregadorDocumento.trim() !== '') return true;

    // 6. Local de Origem Completo
    if (localOrigemLogradouro.trim() !== '') return true;
    if (localOrigemMunicipio.trim() !== '') return true;
    if (localOrigemUf !== 'BA') return true;
    if (localOrigemCep.trim() !== '') return true;

    // 7. Cadastro em Lote
    if (lote) return true;
    if (quantidadeTotalLote !== 150) return true;

    // 8. Observações
    if (observacoes.trim() !== '') return true;

    // 9. Linhas Adicionadas ou Removidas
    if (linhasAnimais.length !== 1) return true;

    // 10. Espécies, Quantidades e Condição na Linha
    const primeiraLinha = linhasAnimais[0];
    if (primeiraLinha) {
      if (primeiraLinha.especieId !== '') return true;
      if (primeiraLinha.quantidadeMacho !== 0) return true;
      if (primeiraLinha.quantidadeFemea !== 0) return true;
      if (primeiraLinha.quantidadeIndeterminado !== 1) return true;
      if (primeiraLinha.quantidadeTotal !== 1) return true;
      if (primeiraLinha.condicaoAnimal !== 'Saudável') return true;
      if (primeiraLinha.origemAnimal !== 'Vida livre') return true;
      if (
        primeiraLinha.localOrigemPontoOuCoordenadas &&
        primeiraLinha.localOrigemPontoOuCoordenadas.trim() !== ''
      ) {
        return true;
      }
    }

    return false;
  }, [
    unidadeId,
    dataRecebimento,
    horaRecebimento,
    fatoGerador,
    instituicaoResponsavel,
    instituicaoEspecificar,
    orgaoOrigem,
    docApreensaoTipo,
    docApreensaoNumero,
    dataLavratura,
    comprovanteAnexado,
    comprovanteArquivoNome,
    agenteNome,
    agenteRgMatricula,
    agenteCpfCnpj,
    agenteLogradouro,
    agenteMunicipio,
    agenteUf,
    agenteCep,
    entregadorNome,
    entregadorDocumento,
    localOrigemLogradouro,
    localOrigemMunicipio,
    localOrigemUf,
    localOrigemCep,
    lote,
    quantidadeTotalLote,
    observacoes,
    linhasAnimais,
    dataHoje,
    horaAgora,
  ]);

  // Interceptação contra saída acidental via popstate (botão Voltar do browser) ou beforeunload
  useEffect(() => {
    (window as any).__isFaunaFormDirty = isDirty;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !descarteConfirmadoRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handleSolicitarDescarte = () => {
      setModalConfirmarDescarte(true);
    };
    window.addEventListener('fauna-solicitar-confirmacao-descarte', handleSolicitarDescarte);

    return () => {
      (window as any).__isFaunaFormDirty = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('fauna-solicitar-confirmacao-descarte', handleSolicitarDescarte);
    };
  }, [isDirty]);

  const handleTentativaVoltar = () => {
    if (isDirty) {
      setModalConfirmarDescarte(true);
    } else {
      onVoltar();
    }
  };

  // Manipulação de Linhas de Animais — Inicia limpo sem espécie pré-selecionada e com ID único sequencial
  const handleAdicionarLinha = () => {
    linhaSequenceRef.current += 1;
    const novaLinha: LinhaPreCadastroTR = {
      id: `linha-pc-${Date.now()}-${linhaSequenceRef.current}`,
      especieId: '',
      especieNomeCientifico: '',
      especieNomePopular: '',
      quantidadeMacho: 0,
      quantidadeFemea: 0,
      quantidadeIndeterminado: 1,
      quantidadeTotal: 1,
      condicaoAnimal: 'Saudável',
      origemAnimal: 'Vida livre',
      saldoPendenteTriagem: 1,
    };
    setLinhasAnimais((prev) => [...prev, novaLinha]);
  };

  const handleRemoverLinha = (id: string) => {
    if (linhasAnimais.length <= 1) return;
    setLinhasAnimais((prev) => prev.filter((l) => l.id !== id));
  };

  const handleUpdateLinha = (id: string, updates: Partial<LinhaPreCadastroTR>) => {
    setLinhasAnimais((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, ...updates };
          if (
            updates.quantidadeMacho !== undefined ||
            updates.quantidadeFemea !== undefined ||
            updates.quantidadeIndeterminado !== undefined
          ) {
            const m = updated.quantidadeMacho || 0;
            const f = updated.quantidadeFemea || 0;
            const i = updated.quantidadeIndeterminado || 0;
            updated.quantidadeTotal = m + f + i;
            updated.saldoPendenteTriagem = updated.quantidadeTotal;
          }
          return updated;
        }
        return l;
      })
    );
  };

  // Upload Simulado de Comprovante de Apreensão
  const handleSimularUploadComprovante = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setComprovanteAnexado(true);
      setComprovanteArquivoNome(file.name);
    }
  };

  // Cálculo da Quantidade Total do TR
  const quantidadeTotalCalculada = useMemo(() => {
    if (lote) {
      return quantidadeTotalLote || 0;
    }
    return linhasAnimais.reduce((acc, curr) => acc + (curr.quantidadeTotal || 0), 0);
  }, [lote, quantidadeTotalLote, linhasAnimais]);

  // Validação dos Campos Obrigatórios (RN-010)
  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    // Dados do Agente / Instituição responsável (RN-006: todos obrigatórios exceto RG/matrícula)
    if (!agenteNome.trim()) novosErros.agenteNome = 'Nome/Razão Social do responsável é obrigatório.';
    if (!agenteCpfCnpj.trim()) novosErros.agenteCpfCnpj = 'CPF/CNPJ do responsável é obrigatório.';
    if (!agenteLogradouro.trim()) novosErros.agenteLogradouro = 'Logradouro do responsável é obrigatório.';
    if (!agenteMunicipio.trim()) novosErros.agenteMunicipio = 'Município do responsável é obrigatório.';
    if (!agenteUf.trim()) novosErros.agenteUf = 'UF do responsável é obrigatória.';
    if (!agenteCep.trim()) novosErros.agenteCep = 'CEP do responsável é obrigatório.';

    // Local de Origem (RN-007)
    if (!localOrigemMunicipio.trim()) novosErros.localOrigemMunicipio = 'Município de origem é obrigatório.';
    if (!localOrigemUf.trim()) novosErros.localOrigemUf = 'UF de origem é obrigatória.';

    // Fato Gerador Apreensão (RN-005)
    if (fatoGerador === 'Apreensão') {
      if (!docApreensaoNumero.trim()) novosErros.docApreensaoNumero = 'Número do documento de apreensão é obrigatório.';
      if (!dataLavratura.trim()) novosErros.dataLavratura = 'Data de lavratura é obrigatória.';
    }

    // Animais do pré-cadastro (RN-008, RN-009)
    if (lote) {
      if (!quantidadeTotalLote || quantidadeTotalLote < 1) {
        novosErros.quantidadeTotalLote = 'Informe uma quantidade válida para o lote.';
      }
      if (!linhasAnimais[0]?.especieId) {
        novosErros.linhasAnimais = 'Selecione a identificação taxonômica (DR002) para o lote de animais.';
      }
    } else {
      if (linhasAnimais.length === 0) {
        novosErros.linhasAnimais = 'Adicione ao menos uma linha de animal no pré-cadastro.';
      } else if (linhasAnimais.some((l) => !l.especieId || (l.quantidadeTotal || 0) <= 0)) {
        novosErros.linhasAnimais = 'Todas as linhas do pré-cadastro devem possuir espécie válida do DR002 e quantidade superior a zero.';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Ação Executar "Gerar TR" (RN-010, RN-011, DOC001)
  const executarGeracaoTR = () => {
    const sigla = unidadeObj.sigla || 'CTS';
    const numeroTrOficial = gerarProximoNumeroTR(sigla);

    // Ajustar linhas para o caso de lote (RN-008, RN-009: sem fallback fictício)
    let linhasFinais: LinhaPreCadastroTR[] = [];
    if (lote) {
      const espPrincipal = linhasAnimais[0];
      if (!espPrincipal || !espPrincipal.especieId) {
        setErros({ linhasAnimais: 'Selecione a identificação taxonômica para o lote de animais.' });
        return;
      }
      linhasFinais = [
        {
          id: `linha-lote-1`,
          especieId: espPrincipal.especieId,
          especieNomeCientifico: espPrincipal.especieNomeCientifico,
          especieNomePopular: espPrincipal.especieNomePopular,
          quantidadeMacho: 0,
          quantidadeFemea: 0,
          quantidadeIndeterminado: quantidadeTotalLote,
          quantidadeTotal: quantidadeTotalLote,
          condicaoAnimal: 'Saudável',
          origemAnimal: 'Vida livre',
          localOrigemPontoOuCoordenadas: `${localOrigemMunicipio} / ${localOrigemUf}`,
          saldoPendenteTriagem: quantidadeTotalLote,
        },
      ];
    } else {
      linhasFinais = linhasAnimais.map((l) => ({
        ...l,
        saldoPendenteTriagem: l.quantidadeTotal,
      }));
    }

    const pendenteComprovante = fatoGerador === 'Apreensão' && !comprovanteAnexado;

    const novoTR: TermoRecebimentoItem = {
      id: `tr-${Date.now().toString().slice(-4)}`,
      numeroTr: numeroTrOficial,
      unidadeId: unidadeObj.id,
      unidadeNome: unidadeObj.nome,
      unidadeSigla: sigla,
      tipoUnidade: unidadeObj.tipoUnidadeCategoria === 'UR' ? 'UR' : 'CETAS',
      dataRecebimento,
      horaRecebimento,
      lote,
      quantidadeTotal: quantidadeTotalCalculada,
      fatoGerador,
      instituicaoResponsavel,
      instituicaoEspecificar: instituicaoEspecificar.trim() || undefined,
      orgaoOrigem: orgaoOrigem.trim() || undefined,
      documentoApreensaoTipo: fatoGerador === 'Apreensão' ? docApreensaoTipo : undefined,
      documentoApreensaoNumero: fatoGerador === 'Apreensão' ? docApreensaoNumero.trim() : undefined,
      dataLavratura: fatoGerador === 'Apreensão' ? dataLavratura : undefined,
      comprovanteAnexado,
      comprovanteArquivoNome: comprovanteAnexado ? comprovanteArquivoNome : undefined,
      comprovantePendente: pendenteComprovante,
      agenteNomeRazaoSocial: agenteNome.trim(),
      agenteRgMatricula: agenteRgMatricula.trim() || undefined,
      agenteCpfCnpj: agenteCpfCnpj.trim(),
      agenteLogradouro: agenteLogradouro.trim() || undefined,
      agenteMunicipio: agenteMunicipio.trim(),
      agenteUf: agenteUf.trim().toUpperCase(),
      agenteCep: agenteCep.trim() || undefined,
      entregadorNome: entregadorNome.trim() || undefined,
      entregadorDocumento: entregadorDocumento.trim() || undefined,
      recebedorNome,
      recebedorMatricula,
      localOrigemLogradouro: localOrigemLogradouro.trim() || undefined,
      localOrigemMunicipio: localOrigemMunicipio.trim(),
      localOrigemUf: localOrigemUf.trim().toUpperCase(),
      localOrigemCep: localOrigemCep.trim() || undefined,
      animais: linhasFinais,
      observacoes: observacoes.trim() || undefined,
      situacaoTr: unidadeObj.tipoUnidadeCategoria === 'UR' ? 'Gerado' : 'Triagem em Andamento',
      siscetasStatus: 'Pendente (Demonstrativo)',
      siscetasLog: [
        {
          id: `log-${Date.now().toString().slice(-4)}`,
          dataHora: `${dataRecebimento} ${horaRecebimento}`,
          evento: 'Entrada de Animais Silvestres (TR)',
          status: 'Fila Offline',
          mensagem: `Termo ${numeroTrOficial} registrado em contingência de fila local demonstrativa aguardando integração oficial SISCETAS (PPV-19).`,
        },
      ],
    };

    // Salvar na store compartilhada
    MOCK_TERMOS_RECEBIMENTO.unshift(novoTR);
    notificarAtualizacaoDadosFauna();
    setTermoGeradoFinal(novoTR);
    onTrGerado?.(novoTR);

    // MSG001: Termo de Recebimento gerado com sucesso. Número: [nº do TR].
    setMensagemSucessoMsg001(`Termo de Recebimento gerado com sucesso. Número: ${numeroTrOficial}`);
    setViewMode('visualizacao_documento');
  };

  const handleGerarTR = () => {
    if (!validarFormulario()) {
      return;
    }

    // RN-005 / MSG003: Se Apreensão sem anexo, exibe alerta e segue com comprovante pendente
    if (fatoGerador === 'Apreensão' && !comprovanteAnexado) {
      setModalAvisoMsg003(true);
      return;
    }

    executarGeracaoTR();
  };

  return (
    <div className="space-y-6">
      {/* Alerta Modal MSG003 */}
      {modalAvisoMsg003 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Comprovante de Apreensão Pendente (MSG003)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  O comprovante da apreensão não foi anexado. Conforme a RN-005, o Termo de Recebimento será gerado com o status de <strong>Comprovante pendente</strong>, permitindo que o arquivo digitalizado seja incluído posteriormente por um servidor do CETAS ou da Unidade Regional.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalAvisoMsg003(false)}
                className="text-xs h-8 text-slate-700"
              >
                Voltar e Anexar Agora
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setModalAvisoMsg003(false);
                  executarGeracaoTR();
                }}
                className="text-xs h-8 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold"
              >
                Continuar e Gerar TR
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RENDERIZAÇÃO DO DOC001 (VISUALIZAÇÃO DO PDF APÓS GERAÇÃO) */}
      {viewMode === 'visualizacao_documento' && termoGeradoFinal && (
        <div className="space-y-4">
          {mensagemSucessoMsg001 && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-800">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {mensagemSucessoMsg001}
              </span>
              <button
                onClick={() => setMensagemSucessoMsg001(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
              >
                Dispensar
              </button>
            </div>
          )}

          <TermoRecebimentoDocumento
            termo={termoGeradoFinal}
            onVoltar={() => setViewMode('formulario')}
            usuarioEmissao={recebedorNome}
            dataHoraEmissao={`${dataRecebimento} ${horaRecebimento}`}
          />
        </div>
      )}

      {/* RENDERIZAÇÃO DO FORMULÁRIO TL001 */}
      {viewMode === 'formulario' && (
        <div className="space-y-6">
          {/* Topo / Título Institucional */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                data-testid="btn-voltar-topo"
                aria-label="Voltar"
                onClick={handleTentativaVoltar}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Voltar ao Painel"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Novo Termo de Recebimento (TL001)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Entrada formal e pré-cadastro de animais silvestres nos CETAS e Unidades Regionais.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                type="button"
                data-testid="btn-preencher-exemplo"
                onClick={handlePreencherExemploOficial}
                className="text-xs h-8 text-slate-600 border-slate-300 hover:bg-slate-50 font-normal"
                title="Preencher dados de demonstração para testes rápidos de homologação"
              >
                Preencher dados de demonstração
              </Button>
              <Button
                variant="outline"
                size="sm"
                data-testid="btn-cancelar-topo"
                onClick={handleTentativaVoltar}
                className="text-xs h-8 text-slate-600 border-slate-300"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleGerarTR}
                className="text-xs h-8 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold px-4 shadow-xs"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                Gerar TR (DOC001)
              </Button>
            </div>
          </div>

          {/* Banner de Erros de Validação (RN-010) */}
          {Object.keys(erros).length > 0 && (
            <div className="bg-rose-50 border border-rose-300 p-3.5 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-sm text-rose-900 mb-1">
                  Atenção aos campos obrigatórios (RN-010)
                </strong>
                <ul className="list-disc list-inside space-y-0.5">
                  {Object.values(erros).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Destaque do Número Provisório / Unidade */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F4C3A]/10 text-[#0F4C3A] flex items-center justify-center font-bold text-sm">
                TR
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                  Identificador Oficial Previsto (RN-003)
                </span>
                <span className="text-base font-mono font-bold text-slate-900">
                  {proximoNumeroTrPrevisao}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>
                Unidade Recebedora: <strong>{unidadeObj.nome}</strong> ({unidadeObj.sigla})
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BLOCO 1: IDENTIFICAÇÃO E UNIDADE RECEBEDORA */}
          {/* ========================================================================= */}
          <Section
            title="1. Identificação do Recebimento"
            description="Momento da entrada e unidade receptora (CETAS ou Unidade Regional)."
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unidade Recebedora <span className="text-rose-500">*</span>
                </label>
                <select
                  value={unidadeId}
                  onChange={(e) => setUnidadeId(e.target.value)}
                  className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                >
                  {MOCK_UNIDADES.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nome} ({u.sigla || 'INEMA'})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Define o prefixo do TR (RN-002).
                </span>
              </div>

              <div>
                <InputWrapper label="Data do Recebimento" required>
                  <input
                    type="text"
                    value={dataRecebimento}
                    onChange={(e) => setDataRecebimento(e.target.value)}
                    placeholder="dd/mm/aaaa"
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                </InputWrapper>
              </div>

              <div>
                <InputWrapper label="Hora do Recebimento" required>
                  <input
                    type="text"
                    value={horaRecebimento}
                    onChange={(e) => setHoraRecebimento(e.target.value)}
                    placeholder="hh:mm"
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  />
                </InputWrapper>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recebedor (Sessão Demonstrativa)
                </label>
                <div className="w-full h-9 text-xs px-2.5 bg-slate-100 border border-slate-200 rounded-lg flex items-center text-slate-700 font-medium truncate" title={`${recebedorNome} — ${recebedorMatricula}`}>
                  {recebedorNome}
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Matrícula: {recebedorMatricula}
                </span>
              </div>
            </div>
          </Section>

          {/* ========================================================================= */}
          {/* BLOCO 2: FATO GERADOR (PROCEDÊNCIA DE ADMISSÃO) */}
          {/* ========================================================================= */}
          <Section
            title="2. Fato Gerador (Procedência de Admissão)"
            description="Motivação oficial de ingresso dos espécimes conforme o DR003."
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  'Entrega voluntária',
                  'Apreensão',
                  'Resgate',
                  'Transferência',
                  'Transferência interestadual',
                ].map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setFatoGerador(tipo as FatoGeradorTR)}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all cursor-pointer ${
                      fatoGerador === tipo
                        ? 'border-[#0F4C3A] bg-[#0F4C3A]/5 text-[#0F4C3A] font-semibold ring-1 ring-[#0F4C3A]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block">{tipo}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instituição Responsável <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                      <input
                        type="radio"
                        name="instituicao"
                        checked={instituicaoResponsavel === 'INEMA'}
                        onChange={() => setInstituicaoResponsavel('INEMA')}
                        className="text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                      INEMA
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                      <input
                        type="radio"
                        name="instituicao"
                        checked={instituicaoResponsavel === 'Outras'}
                        onChange={() => setInstituicaoResponsavel('Outras')}
                        className="text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                      Outras
                    </label>
                  </div>
                  {instituicaoResponsavel === 'Outras' && (
                    <input
                      type="text"
                      value={instituicaoEspecificar}
                      onChange={(e) => setInstituicaoEspecificar(e.target.value)}
                      placeholder="Especifique a instituição (ex: IBAMA, Polícia Civil)..."
                      className="w-full h-8 text-xs px-2.5 mt-2 border border-slate-300 rounded-lg text-slate-800"
                    />
                  )}
                </div>

                <div>
                  <InputWrapper label="Órgão / Autoridade de Origem">
                    <input
                      type="text"
                      value={orgaoOrigem}
                      onChange={(e) => setOrgaoOrigem(e.target.value)}
                      placeholder="Ex: COPPA - Polícia Militar da Bahia / DIFIS"
                      className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    />
                  </InputWrapper>
                </div>
              </div>
            </div>
          </Section>

          {/* ========================================================================= */}
          {/* BLOCO 3: EM CASO DE APREENSÃO (CONDICIONAL RN-005) */}
          {/* ========================================================================= */}
          {fatoGerador === 'Apreensão' && (
            <Section
              title="3. Dados da Apreensão (Obrigatório para fato gerador Apreensão)"
              description="Informações do auto de apreensão ou boletim de ocorrência (F-TEC-205-00)."
            >
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Documento da Apreensão <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={docApreensaoTipo}
                      onChange={(e) => setDocApreensaoTipo(e.target.value as DocumentoApreensaoTipo)}
                      className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2.5 text-slate-800"
                    >
                      <option value="Auto de Infração">Auto de Infração</option>
                      <option value="Boletim de Ocorrência">Boletim de Ocorrência</option>
                      <option value="Termo de Apreensão/Depósito">Termo de Apreensão/Depósito</option>
                    </select>
                  </div>

                  <div>
                    <InputWrapper
                      label="Número do Documento"
                      required
                      valid={!erros.docApreensaoNumero}
                      hint={erros.docApreensaoNumero ? <span className="text-rose-600 text-xs">{erros.docApreensaoNumero}</span> : undefined}
                    >
                      <input
                        type="text"
                        value={docApreensaoNumero}
                        onChange={(e) => setDocApreensaoNumero(e.target.value)}
                        placeholder="Ex: AI-2026-9815-DIFIS"
                        className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                      />
                    </InputWrapper>
                  </div>

                  <div>
                    <InputWrapper
                      label="Data de Lavratura"
                      required
                      valid={!erros.dataLavratura}
                      hint={erros.dataLavratura ? <span className="text-rose-600 text-xs">{erros.dataLavratura}</span> : undefined}
                    >
                      <input
                        type="text"
                        value={dataLavratura}
                        onChange={(e) => setDataLavratura(e.target.value)}
                        placeholder="dd/mm/aaaa"
                        className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                      />
                    </InputWrapper>
                  </div>
                </div>

                {/* Upload do Comprovante (RN-005: anexo pode ficar pendente) */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Comprovante Digitalizado da Apreensão (Opcional na entrada)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      A ausência do anexo não bloqueia a emissão do TR. O comprovante pode ser anexado posteriormente.
                    </span>
                    {comprovanteAnexado ? (
                      <span className="text-xs text-emerald-700 font-medium mt-1 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Arquivo anexado: {comprovanteArquivoNome}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700 font-medium mt-1 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Nenhum comprovante anexado (Ficará com aviso "Comprovante pendente")
                      </span>
                    )}
                  </div>

                  <div className="shrink-0">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      {comprovanteAnexado ? 'Substituir Anexo' : 'Anexar Comprovante'}
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleSimularUploadComprovante}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* ========================================================================= */}
          {/* BLOCO 4: AGENTE / INSTITUIÇÃO RESPONSÁVEL PELA DESTINAÇÃO */}
          {/* ========================================================================= */}
          <Section
            title="4. Dados do Agente / Instituição Responsável pela Destinação"
            description="Identificação da autoridade, órgão ou cidadão que efetuou a entrega do animal."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <InputWrapper
                  label="Nome / Razão Social do Responsável"
                  required
                  valid={!erros.agenteNome}
                  hint={erros.agenteNome ? <span className="text-rose-600 text-xs">{erros.agenteNome}</span> : undefined}
                >
                  <input
                    type="text"
                    value={agenteNome}
                    onChange={(e) => setAgenteNome(e.target.value)}
                    placeholder="Nome completo ou razão social da instituição"
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div>
                <InputWrapper label="RG / Matrícula Funcional (Opcional)">
                  <input
                    type="text"
                    value={agenteRgMatricula}
                    onChange={(e) => setAgenteRgMatricula(e.target.value)}
                    placeholder="Ex: Matrícula PMBA 30.412"
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div>
                <InputWrapper
                  label="CPF / CNPJ"
                  required
                  valid={!erros.agenteCpfCnpj}
                  hint={erros.agenteCpfCnpj ? <span className="text-rose-600 text-xs">{erros.agenteCpfCnpj}</span> : undefined}
                >
                  <input
                    type="text"
                    value={agenteCpfCnpj}
                    onChange={(e) => setAgenteCpfCnpj(e.target.value)}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg font-mono"
                  />
                </InputWrapper>
              </div>

              <div>
                <InputWrapper label="Município do Responsável" required>
                  <input
                    type="text"
                    value={agenteMunicipio}
                    onChange={(e) => setAgenteMunicipio(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div>
                <InputWrapper label="Estado (UF)" required>
                  <input
                    type="text"
                    value={agenteUf}
                    onChange={(e) => setAgenteUf(e.target.value)}
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg uppercase"
                  />
                </InputWrapper>
              </div>

              <div className="sm:col-span-2">
                <InputWrapper label="Logradouro / Endereço">
                  <input
                    type="text"
                    value={agenteLogradouro}
                    onChange={(e) => setAgenteLogradouro(e.target.value)}
                    placeholder="Rua, número, bairro..."
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>

              <div>
                <InputWrapper label="CEP">
                  <input
                    type="text"
                    value={agenteCep}
                    onChange={(e) => setAgenteCep(e.target.value)}
                    placeholder="00000-000"
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg font-mono"
                  />
                </InputWrapper>
              </div>
            </div>
          </Section>

          {/* ========================================================================= */}
          {/* BLOCO 5 & 6: ENTREGADOR E LOCAL DE ORIGEM */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section
              title="5. Dados do Entregador (Quando houver)"
              description="Pessoa física que compareceu à unidade para entregar o lote."
            >
              <div className="space-y-3 pt-2">
                <InputWrapper label="Nome do Entregador">
                  <input
                    type="text"
                    value={entregadorNome}
                    onChange={(e) => setEntregadorNome(e.target.value)}
                    placeholder="Ex: Sgt. PM Marcos Valério Santos"
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>

                <InputWrapper label="Documento / Matrícula">
                  <input
                    type="text"
                    value={entregadorDocumento}
                    onChange={(e) => setEntregadorDocumento(e.target.value)}
                    placeholder="Ex: Matrícula 28.112.450"
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>
            </Section>

            <Section
              title="6. Local de Origem do(s) Animal(is) *"
              description="Município e ponto de referência geográfica de apreensão ou resgate."
            >
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <InputWrapper
                    label="Município de Origem"
                    required
                    valid={!erros.localOrigemMunicipio}
                    hint={erros.localOrigemMunicipio ? <span className="text-rose-600 text-xs">{erros.localOrigemMunicipio}</span> : undefined}
                  >
                    <input
                      type="text"
                      value={localOrigemMunicipio}
                      onChange={(e) => setLocalOrigemMunicipio(e.target.value)}
                      className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                    />
                  </InputWrapper>

                  <InputWrapper
                    label="UF"
                    required
                    valid={!erros.localOrigemUf}
                    hint={erros.localOrigemUf ? <span className="text-rose-600 text-xs">{erros.localOrigemUf}</span> : undefined}
                  >
                    <input
                      type="text"
                      value={localOrigemUf}
                      onChange={(e) => setLocalOrigemUf(e.target.value)}
                      className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg uppercase"
                    />
                  </InputWrapper>
                </div>

                <InputWrapper label="Ponto de Referência / Logradouro">
                  <input
                    type="text"
                    value={localOrigemLogradouro}
                    onChange={(e) => setLocalOrigemLogradouro(e.target.value)}
                    placeholder="Ex: Feira Livre do Rolo, Margem do Rio Paraguaçu, etc."
                    className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg"
                  />
                </InputWrapper>
              </div>
            </Section>
          </div>

          {/* ========================================================================= */}
          {/* BLOCO 7: DADOS DOS ANIMAIS - PRÉ-CADASTRO (LOTE OU INDIVIDUAL) */}
          {/* ========================================================================= */}
          <Section
            title="7. Dados do(s) Animal(is) — Pré-Cadastro no TR *"
            description="Registro preliminar de espécimes para controle de saldo antes da triagem individual."
          >
            <div className="space-y-4 pt-2">
              {/* Chave Cadastrar em Lote? (RN-009, CA005) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Cadastrar em lote? (RN-009)
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Para apreensões com mais de 100 indivíduos da mesma espécie, registra saldo total simplificado alocado na coluna Indeterminado (I) até a triagem.
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      role="switch"
                      data-testid="check-modo-lote"
                      aria-label="Cadastrar em lote (RN-009)"
                      checked={lote}
                      onChange={(e) => setLote(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0F4C3A] focus:ring-[#0F4C3A]/20 cursor-pointer"
                    />
                    <span>Ativar Modo Lote</span>
                  </label>
                  <div className="flex items-center gap-1 border-l border-slate-300 pl-2.5">
                    <button
                      type="button"
                      data-testid="btn-lote-individual"
                      onClick={() => setLote(false)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                        !lote ? 'bg-[#0F4C3A] text-white' : 'bg-white border text-slate-700'
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      data-testid="btn-lote-sim"
                      onClick={() => setLote(true)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                        lote ? 'bg-[#0F4C3A] text-white' : 'bg-white border text-slate-700'
                      }`}
                    >
                      Lote (100+)
                    </button>
                  </div>
                </div>
              </div>

              {/* Modo Lote: Campo de Quantidade Total Simplificado */}
              {lote ? (
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0F4C3A]" />
                    <span className="text-xs font-bold text-slate-900">
                      Configuração de Lote Volumoso (Ex: 150 aves - Cenário CA005 / CA023)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Espécie Principal do Lote <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={linhasAnimais[0]?.especieId}
                        onChange={(e) => {
                          const esp = MOCK_ESPECIES.find((s) => s.id === e.target.value);
                          if (esp) {
                            handleUpdateLinha(linhasAnimais[0]?.id, {
                              especieId: esp.id,
                              especieNomeCientifico: esp.nomeCientifico,
                              especieNomePopular: esp.nomesPopulares[0]?.nome || 'Espécie',
                            });
                          }
                        }}
                        className="w-full h-9 text-xs bg-white border border-slate-300 rounded-lg px-2 text-slate-800"
                      >
                        {MOCK_ESPECIES.map((esp) => (
                          <option key={esp.id} value={esp.id}>
                            {esp.nomesPopulares[0]?.nome} ({esp.nomeCientifico})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <InputWrapper
                        label="Quantidade Total de Animais no Lote"
                        required
                        valid={!erros.quantidadeTotalLote}
                        hint={erros.quantidadeTotalLote ? <span className="text-rose-600 text-xs">{erros.quantidadeTotalLote}</span> : undefined}
                      >
                        <input
                          type="number"
                          min="1"
                          data-testid="input-qtd-lote"
                          value={quantidadeTotalLote}
                          onChange={(e) => setQuantidadeTotalLote(Number(e.target.value))}
                          className="w-full h-9 text-xs px-2.5 text-slate-800 border border-slate-300 rounded-lg font-bold font-mono"
                        />
                      </InputWrapper>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        No lote, todo o quantitativo é computado temporariamente em I (Indeterminado) até a individualização na triagem.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Modo Individual / Pré-cadastro Multi-linhas */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Linhas de Pré-Cadastro ({linhasAnimais.length})
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      data-testid="btn-adicionar-linha-animal"
                      onClick={handleAdicionarLinha}
                      className="text-xs h-8 text-[#0F4C3A] border-[#0F4C3A]/30 hover:bg-[#0F4C3A]/5 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      + Adicionar Animal (RN-008)
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {linhasAnimais.map((linha, index) => (
                      <div
                        key={linha.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs font-bold text-slate-700">
                            Animal / Grupo #{index + 1}
                          </span>
                          {linhasAnimais.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoverLinha(linha.id)}
                              className="text-rose-600 hover:text-rose-800 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remover
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Espécie (ou Gênero se filhote) <span className="text-rose-500">*</span>
                            </label>
                            <select
                              data-testid={`select-especie-${linha.id}`}
                              value={linha.especieId}
                              onChange={(e) => {
                                const espId = e.target.value;
                                if (!espId) {
                                  handleUpdateLinha(linha.id, {
                                    especieId: '',
                                    especieNomeCientifico: '',
                                    especieNomePopular: '',
                                  });
                                  return;
                                }
                                const esp = MOCK_ESPECIES.find((s) => s.id === espId);
                                if (esp) {
                                  handleUpdateLinha(linha.id, {
                                    especieId: esp.id,
                                    especieNomeCientifico: esp.nomeCientifico,
                                    especieNomePopular: esp.nomesPopulares[0]?.nome || 'Espécie',
                                  });
                                }
                              }}
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded-lg px-2 text-slate-800"
                            >
                              <option value="">-- Selecione a espécie (obrigatório) --</option>
                              {MOCK_ESPECIES.map((esp) => (
                                <option key={esp.id} value={esp.id}>
                                  {esp.nomesPopulares[0]?.nome} ({esp.nomeCientifico})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Condição Física
                            </label>
                            <select
                              value={linha.condicaoAnimal || 'Saudável'}
                              onChange={(e) =>
                                handleUpdateLinha(linha.id, {
                                  condicaoAnimal: e.target.value as CondicaoAnimalTR,
                                })
                              }
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded-lg px-2 text-slate-800"
                            >
                              <option value="Saudável">Saudável</option>
                              <option value="Mutilado/Ferido">Mutilado/Ferido</option>
                              <option value="Doente">Doente</option>
                              <option value="Óbito">Óbito</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Origem do Animal
                            </label>
                            <select
                              value={linha.origemAnimal || 'Vida livre'}
                              onChange={(e) =>
                                handleUpdateLinha(linha.id, {
                                  origemAnimal: e.target.value as OrigemAnimalTR,
                                })
                              }
                              className="w-full h-8 text-xs bg-white border border-slate-300 rounded-lg px-2 text-slate-800"
                            >
                              <option value="Vida livre">Vida livre</option>
                              <option value="Cativeiro">Cativeiro</option>
                            </select>
                          </div>
                        </div>

                        {/* Quantidades por Sexo */}
                        <div className="grid grid-cols-4 gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              Qtd Macho (M)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={linha.quantidadeMacho}
                              onChange={(e) =>
                                handleUpdateLinha(linha.id, {
                                  quantidadeMacho: Number(e.target.value),
                                })
                              }
                              className="w-full h-8 text-xs px-2 text-slate-800 border border-slate-300 rounded"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              Qtd Fêmea (F)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={linha.quantidadeFemea}
                              onChange={(e) =>
                                handleUpdateLinha(linha.id, {
                                  quantidadeFemea: Number(e.target.value),
                                })
                              }
                              className="w-full h-8 text-xs px-2 text-slate-800 border border-slate-300 rounded"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              Indeterminado (I)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={linha.quantidadeIndeterminado}
                              onChange={(e) =>
                                handleUpdateLinha(linha.id, {
                                  quantidadeIndeterminado: Number(e.target.value),
                                })
                              }
                              className="w-full h-8 text-xs px-2 text-slate-800 border border-slate-300 rounded font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              Total desta Linha
                            </label>
                            <div className="h-8 flex items-center px-2 bg-slate-100 rounded text-xs font-bold font-mono text-slate-800">
                              {linha.quantidadeTotal}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* ========================================================================= */}
          {/* BLOCO 9: OBSERVAÇÕES */}
          {/* ========================================================================= */}
          <Section
            title="9. Observações Complementares"
            description="Anotações gerais, circunstâncias do resgate ou presença de filhotes."
          >
            <div className="pt-2">
              <textarea
                rows={3}
                maxLength={2000}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Descreva particularidades do lote, filhotes, condições das gaiolas ou informações do transporte..."
                className="w-full text-xs p-2.5 text-slate-800 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
              />
              <span className="text-[10px] text-slate-400 block text-right mt-1">
                {observacoes.length} / 2.000 caracteres
              </span>
            </div>
          </Section>

          {/* Barra de Ações Inferior */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-600 font-medium">
              Total de animais previstos no TR:{' '}
              <strong className="text-slate-900 font-mono text-sm">{quantidadeTotalCalculada}</strong>
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTentativaVoltar}
                className="text-xs h-9 text-slate-600"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleGerarTR}
                className="text-xs h-9 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold px-5 shadow-xs"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                Gerar TR (DOC001)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Proteção Contra Descarte Acidental de Formulário (DR000 / G8.1) */}
      <Dialog open={modalConfirmarDescarte} onOpenChange={setModalConfirmarDescarte}>
        <DialogContent className="max-w-md" data-testid="modal-descarte-confirmacao">
          <DialogHeader>
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <DialogTitle className="text-base font-bold text-slate-900">
                Descartar alterações não salvas?
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-600 pt-2 leading-relaxed">
              Existem dados preenchidos no formulário do Termo de Recebimento. De acordo com as diretrizes do DR000, o sistema não gera rascunhos em disco. Se você sair agora, todas as informações não salvas serão permanentemente descartadas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalConfirmarDescarte(false)}
              className="text-xs"
            >
              Continuar Editando
            </Button>
            <Button
              type="button"
              size="sm"
              data-testid="btn-confirmar-descarte"
              onClick={() => {
                (window as any).__isFaunaFormDirty = false;
                descarteConfirmadoRef.current = true;
                setModalConfirmarDescarte(false);
                onVoltar();
              }}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Sim, Descartar e Sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
