import React, { useState } from 'react';
import { 
  RegistroFiscalizacaoExterno, 
  TipoRelatorioRegulatorio 
} from '../types/fiscalizacao-externa';

interface FormCadastroEmergenciaProps {
  onSuccess?: (registro: RegistroFiscalizacaoExterno) => void;
  onCancel?: () => void;
}

export const FormCadastroEmergencia: React.FC<FormCadastroEmergenciaProps> = ({
  onSuccess,
  onCancel
}) => {
  // Estado do Comunicante Gov.br (RN002)
  const [nomeRazaoSocial] = useState('Giovani Silva');
  const [cpfCnpj] = useState('529.982.247-25');
  const [email] = useState('giovani.silva@exemplo.com.br');
  const [telefone, setTelefone] = useState('(71) 98845-1234');
  const [outroTelefone, setOutroTelefone] = useState('');

  // Vínculo Empresarial (RN003 e RN004)
  const [vinculoEmpresa, setVinculoEmpresa] = useState<'SIM' | 'NÃO'>('NÃO');
  const [nomeEmpresaTrabalho, setNomeEmpresaTrabalho] = useState('');
  const [cargo, setCargo] = useState('');
  const [classificacaoSemVinculo, setClassificacaoSemVinculo] = useState('Cidadão comum');
  const [outrasInstituicoesNome, setOutrasInstituicoesNome] = useState('');
  const [empresaResponsavelInformada, setEmpresaResponsavelInformada] = useState('');

  // Detalhes da Ocorrência (RN008, RN027, RN028)
  const [dataHoraConstatacao, setDataHoraConstatacao] = useState('');
  const [tipoEmergenciaQuimica, setTipoEmergenciaQuimica] = useState('');
  const [descricaoTipoOutros, setDescricaoTipoOutros] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anexosIniciais, setAnexosIniciais] = useState<File[]>([]);

  // Localização (RN010, RN026)
  const [municipio, setMunicipio] = useState('Salvador');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [pontoReferencia, setPontoReferencia] = useState('');
  const [descricaoCenario, setDescricaoCenario] = useState('');

  // Áreas Atingidas (RN012, RN013 - seleção de 1 a 3 itens)
  const [areasAtingidas, setAreasAtingidas] = useState<string[]>([]);

  // Coordenadas Geográficas (RN011, BOT002)
  const [coordenadas, setCoordenadas] = useState<{
    id: string;
    tipo: string;
    latitude: string;
    longitude: string;
    latDecimal: string;
    lngDecimal: string;
  }[]>([]);
  const [novaCoordTipo, setNovaCoordTipo] = useState('Geográfica / Grau Decimal');
  const [novaCoordLat, setNovaCoordLat] = useState('');
  const [novaCoordLng, setNovaCoordLng] = useState('');

  // Modais de Controle
  const [modalMsg001, setModalMsg001] = useState(false);
  const [modalMsg002, setModalMsg002] = useState(false);
  const [modalMsg003, setModalMsg003] = useState(false);
  const [modalMsg004, setModalMsg004] = useState(false);
  const [modalMsg007, setModalMsg007] = useState(false);
  const [registroFinalizado, setRegistroFinalizado] = useState<RegistroFiscalizacaoExterno | null>(null);

  // Lista dos 15 tipos de emergência química do catálogo oficial (RN027)
  const TIPOS_EMERGENCIA = [
    'Acidente no transporte rodoviário de produtos químicos',
    'Acidente em via férrea',
    'Acidente industrial em planta química ou petroquímica',
    'Incidente no modal aquaviário ou terminal marítimo',
    'Lançamento ou descarte irregular de efluentes ou produtos químicos',
    'Vazamento em sistema subterrâneo de combustíveis',
    'Ocorrência com produto químico perigoso em ETA/ETE',
    'Efluente de barragem de rejeitos',
    'Efluente de barragem de aterro industrial ou sanitário',
    'Ruptura ou falha em sistema de contenção',
    'Mortandade de peixes ou fauna aquática por contaminação',
    'Pluma de contaminação',
    'Mancha de origem desconhecida',
    'Afloramento de contaminantes',
    'Outros'
  ];

  // Lista dos 14 itens do catálogo de Área Atingida (RN013)
  const AREAS_CATALOGO = [
    'Área Urbana',
    'Distrito',
    'Assentamento Rural',
    'Comunidade Indígena',
    'Área Industrial',
    'Dutovia',
    'Colônia de Pescadores',
    'Comunidade Tradicional',
    'Povoado',
    'Posto de Combustível',
    'Recurso Hídrico',
    'Rodovia',
    'Área de Marinha',
    'Unidade de Conservação'
  ];

  // Busca simulada de CEP (RN026)
  const handleCepChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    const masked = raw.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(masked);
    if (raw === '40020000') {
      setMunicipio('Salvador');
      setBairro('Centro');
      setEndereco('Rua Chile');
      setPontoReferencia('Próximo à Praça Castro Alves');
    } else if (raw === '42800000') {
      setMunicipio('Camaçari');
      setBairro('Polo Petroquímico');
      setEndereco('Via Matoim');
    }
  };

  // Toggle Área Atingida (máximo 3, RN012)
  const toggleArea = (area: string) => {
    if (areasAtingidas.includes(area)) {
      setAreasAtingidas(areasAtingidas.filter(a => a !== area));
    } else {
      if (areasAtingidas.length < 3) {
        setAreasAtingidas([...areasAtingidas, area]);
      }
    }
  };

  // Incluir Coordenada (BOT002)
  const adicionarCoordenada = () => {
    if (!novaCoordLat && !novaCoordLng) return;
    setCoordenadas([
      ...coordenadas,
      {
        id: Math.random().toString(36).substring(7),
        tipo: novaCoordTipo,
        latitude: novaCoordLat,
        longitude: novaCoordLng,
        latDecimal: novaCoordLat,
        lngDecimal: novaCoordLng
      }
    ]);
    setNovaCoordLat('');
    setNovaCoordLng('');
  };

  // Disparo de Finalização (BOT001)
  const handleIniciarFinalizacao = () => {
    // Validação de obrigatórios (RN002, RN003, RN004, RN008, RN010, RN012, RN028 -> MSG001)
    if (
      !telefone ||
      (vinculoEmpresa === 'SIM' && (!nomeEmpresaTrabalho || !cargo)) ||
      (vinculoEmpresa === 'NÃO' && classificacaoSemVinculo === 'Outras instituições' && !outrasInstituicoesNome) ||
      !dataHoraConstatacao ||
      !tipoEmergenciaQuimica ||
      (tipoEmergenciaQuimica === 'Outros' && !descricaoTipoOutros) ||
      !descricao ||
      !municipio ||
      !endereco ||
      !pontoReferencia ||
      areasAtingidas.length === 0
    ) {
      setModalMsg001(true);
      return;
    }

    // Validação de coordenadas (RN011 -> MSG002)
    if (coordenadas.length === 0) {
      setModalMsg002(true);
      return;
    }

    // Modal de Confirmação Definitiva (MSG003)
    setModalMsg003(true);
  };

  // Execução Definitiva do Cadastro (RN006, RN007, RN015)
  const executarFinalizacao = () => {
    setModalMsg003(false);
    setModalMsg002(false);

    // Gerar RE padrão ano.sequencial/INEMA/RE (RN006)
    const numeroAleatorio = Math.floor(100000 + Math.random() * 900000);
    const numeroRE = `2026.${numeroAleatorio}/INEMA/RE`;

    const novoRegistro: RegistroFiscalizacaoExterno = {
      id: 're-' + Date.now(),
      numeroRegistro: numeroRE,
      tipoRegistro: 'Emergência Química (RE)',
      dataHoraCadastro: new Date().toLocaleString('pt-BR', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }),
      dataHoraIso: new Date().toISOString(),
      municipio,
      status: 'Emergência Registrada',
      tipoEmergenciaQuimica,
      descricaoTipoOutros: tipoEmergenciaQuimica === 'Outros' ? descricaoTipoOutros : undefined,
      descricao,
      pontoReferencia,
      endereco,
      bairro,
      numero,
      cep,
      descricaoCenario,
      areasAtingidas,
      coordenadas,
      comunicante: {
        nomeRazaoSocial,
        cpfCnpj,
        telefone,
        outroTelefone,
        email,
        vinculoEmpresa,
        nomeEmpresaTrabalho: vinculoEmpresa === 'SIM' ? nomeEmpresaTrabalho : undefined,
        cargo: vinculoEmpresa === 'SIM' ? cargo : undefined,
        classificacaoSemVinculo: vinculoEmpresa === 'NÃO' ? classificacaoSemVinculo : undefined,
        outrasInstituicoesNome: classificacaoSemVinculo === 'Outras instituições' ? outrasInstituicoesNome : undefined,
        empresaResponsavelInformada
      },
      relatoriosAnexados: [],
      historico: [
        {
          id: 'hist-' + Date.now(),
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: nomeRazaoSocial + ' (Gov.br)',
          acao: 'Registro de Emergência Química Finalizado pelo Comunicante Externo',
          detalhes: `Status atribuído: Emergência Registrada. Protocolo: ${numeroRE}`
        }
      ]
    };

    // Sincronizar com o LocalStorage compartilhado
    try {
      const chave = 'INEMA_SEIA_REGISTROS_EXTERNOS';
      const existentesStr = localStorage.getItem(chave);
      const existentes: RegistroFiscalizacaoExterno[] = existentesStr ? JSON.parse(existentesStr) : [];
      const atualizados = [novoRegistro, ...existentes];
      localStorage.setItem(chave, JSON.stringify(atualizados));
    } catch (err) {
      console.error('Erro ao persistir registro externo no LocalStorage:', err);
    }

    setRegistroFinalizado(novoRegistro);
    setModalMsg004(true);
    if (onSuccess) onSuccess(novoRegistro);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16">
      {/* Banner de Identificação e Protocolo */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Fluxo Externo (DOR004) - Portal do Cidadão Gov.br</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Cadastro de Emergência Química
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comunique acidentes e ocorrências químicas para atuação emergencial das equipes do INEMA
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-right">
          <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">Nº de Registro</span>
          <span className="text-base font-bold text-emerald-800">
            {registroFinalizado ? registroFinalizado.numeroRegistro : 'A gerar na finalização'}
          </span>
          <span className="block text-[11px] text-slate-500">
            Status: <strong className="text-amber-700">{registroFinalizado ? registroFinalizado.status : 'Rascunho'}</strong>
          </span>
        </div>
      </div>

      {/* Cartão Gov.br Comunicante Identificado */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-inema-green text-white flex items-center justify-center font-bold text-sm shadow-xs">
            GS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">{nomeRazaoSocial}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">Gov.br Ouro</span>
            </div>
            <span className="text-xs text-slate-500">CPF: {cpfCnpj} | {email}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-emerald-700">lock</span>
          <span>Dados validados e protegidos (RN002)</span>
        </div>
      </div>

      {/* Formulário Principal */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        
        {/* Seção 1: Informações sobre a Empresa & Vínculo */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2.5 text-inema-green font-bold text-base border-b pb-2">
            <span className="material-symbols-outlined text-xl">business</span>
            <h2>1. Informações sobre a Empresa</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Você possui vínculo com a empresa responsável pela ocorrência? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="vinculoEmpresa"
                    checked={vinculoEmpresa === 'SIM'}
                    onChange={() => setVinculoEmpresa('SIM')}
                    className="text-inema-green focus:ring-inema-green"
                  />
                  <span>Sim</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="vinculoEmpresa"
                    checked={vinculoEmpresa === 'NÃO'}
                    onChange={() => setVinculoEmpresa('NÃO')}
                    className="text-inema-green focus:ring-inema-green"
                  />
                  <span>Não</span>
                </label>
              </div>
            </div>

            {/* Condicional SIM: Empresa e Cargo (RN003) */}
            {vinculoEmpresa === 'SIM' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da empresa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={500}
                    value={nomeEmpresaTrabalho}
                    onChange={(e) => setNomeEmpresaTrabalho(e.target.value)}
                    placeholder="Descreva o nome da empresa em que você trabalha"
                    className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">LEG009 - Descreva o nome da empresa em que você trabalha</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cargo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="Descreva o cargo atual que você exerce"
                    className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">LEG010 - Descreva o cargo atual que você exerce</span>
                </div>
              </div>
            )}

            {/* Condicional NÃO: Combobox Cidadão Comum, Força Policial, Outras (RN004) */}
            {vinculoEmpresa === 'NÃO' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Você está comunicando como: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={classificacaoSemVinculo}
                    onChange={(e) => setClassificacaoSemVinculo(e.target.value)}
                    className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
                  >
                    <option value="Cidadão comum">Cidadão comum</option>
                    <option value="Força Policial">Força Policial</option>
                    <option value="Outras instituições">Outras instituições</option>
                  </select>
                </div>
                {classificacaoSemVinculo === 'Outras instituições' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome da Instituição <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={500}
                      value={outrasInstituicoesNome}
                      onChange={(e) => setOutrasInstituicoesNome(e.target.value)}
                      placeholder="Descreva o nome da instituição"
                      className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">LEG011 - Descreva o nome da instituição</span>
                  </div>
                )}
              </div>
            )}

            {/* Campo Opcional Permanente (RN005) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Sabe informar o nome da empresa responsável pela emergência química? (Opcional)
              </label>
              <input
                type="text"
                maxLength={500}
                value={empresaResponsavelInformada}
                onChange={(e) => setEmpresaResponsavelInformada(e.target.value)}
                placeholder="Caso saiba, informe a razão social ou nome fantasia da empresa causadora"
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">RN005 - Aceita até 500 caracteres. Não substitui os dados obrigatórios de vínculo.</span>
            </div>
          </div>
        </div>

        {/* Seção 2: Dados do Comunicante */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-inema-green font-bold text-base border-b pb-2">
            <span className="material-symbols-outlined text-xl">person</span>
            <h2>2. Dados do Comunicante</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome / Razão Social <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled
                value={nomeRazaoSocial}
                className="w-full text-xs bg-slate-100 text-slate-600 rounded-lg border-slate-200 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CPF / CNPJ</label>
              <input
                type="text"
                disabled
                value={cpfCnpj}
                className="w-full text-xs bg-slate-100 text-slate-600 rounded-lg border-slate-200 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telefone / Celular <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Outro Telefone / Celular</label>
              <input
                type="text"
                value={outroTelefone}
                onChange={(e) => setOutroTelefone(e.target.value)}
                placeholder="(00) 0000-0000"
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full text-xs bg-slate-100 text-slate-600 rounded-lg border-slate-200 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Seção 3: Detalhes da Ocorrência */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-inema-green font-bold text-base border-b pb-2">
            <span className="material-symbols-outlined text-xl">warning</span>
            <h2>3. Detalhes da Ocorrência</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data e hora da Constatação <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                max={new Date().toISOString().slice(0, 16)}
                value={dataHoraConstatacao}
                onChange={(e) => setDataHoraConstatacao(e.target.value)}
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">LEG001 - Registre aqui a data e hora em que foi observada a emergência</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo da Emergência Química <span className="text-red-500">*</span>
              </label>
              <select
                value={tipoEmergenciaQuimica}
                onChange={(e) => setTipoEmergenciaQuimica(e.target.value)}
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              >
                <option value="">-- Selecione o Tipo no Catálogo Oficial (RN027) --</option>
                {TIPOS_EMERGENCIA.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condicional Outros (RN028) */}
          {tipoEmergenciaQuimica === 'Outros' && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descrição do tipo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={500}
                value={descricaoTipoOutros}
                onChange={(e) => setDescricaoTipoOutros(e.target.value)}
                placeholder="Especifique detalhadamente a tipologia da ocorrência"
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">RN028 - Obrigatório quando selecionado 'Outros'</span>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Descrição do Fato <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{descricao.length} / 7.000 caracteres</span>
            </div>
            <textarea
              rows={4}
              maxLength={7000}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva aqui seu relato em detalhes sobre a emergência, produtos envolvidos, riscos aparentes e pessoas atingidas..."
              className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">LEG002 - Descreva aqui seu relato em detalhes sobre a emergência</span>
          </div>

          {/* Anexos Iniciais (RN009 / MSG005) */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Anexos e Evidências da Ocorrência (Opcional)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Adicione arquivos que complementem ou documentem a demanda ou o fato, como capturas de conversas, vídeos e fotos (LEG003).
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setAnexosIniciais([...anexosIniciais, ...Array.from(e.target.files)]);
                }
              }}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-inema-sage file:text-inema-green hover:file:bg-inema-sage-dark"
            />
            <p className="text-[10px] text-slate-500 mt-2 p-2 bg-white rounded border border-slate-200">
              <strong>MSG005 (Orientação fixa):</strong> São aceitos documentos de texto (.pdf, .doc, .docx, .txt), imagens (.jpeg, .jpg, .png, .bmp), planilhas (.xls, .xlsx), multimídia (.mp3, .mp4), shape (.shp, .shx, .dbf, .prj), .kml, .kmz e .zip.
            </p>
          </div>
        </div>

        {/* Seção 4: Localização e Áreas Atingidas */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-inema-green font-bold text-base border-b pb-2">
            <span className="material-symbols-outlined text-xl">pin_drop</span>
            <h2>4. Localização da Ocorrência</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Município <span className="text-red-500">*</span>
              </label>
              <select
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              >
                <option value="Salvador">Salvador</option>
                <option value="Camaçari">Camaçari</option>
                <option value="Feira de Santana">Feira de Santana</option>
                <option value="Simões Filho">Simões Filho</option>
                <option value="Candeias">Candeias</option>
                <option value="Dias d'Ávila">Dias d'Ávila</option>
                <option value="Lauro de Freitas">Lauro de Freitas</option>
                <option value="Ilhéus">Ilhéus</option>
                <option value="Itabuna">Itabuna</option>
                <option value="Vitória da Conquista">Vitória da Conquista</option>
                <option value="Barreiras">Barreiras</option>
                <option value="Juazeiro">Juazeiro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">CEP (Auto-preenchimento)</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => handleCepChange(e.target.value)}
                placeholder="40020-000"
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Ex: 40020-000 preenche Salvador Centro</span>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Endereço / Local <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Logradouro, rodovia, km ou identificação física"
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Bairro</label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Bairro ou localidade"
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Número</label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="S/N se não houver"
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ponto de Referência <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={1000}
                value={pontoReferencia}
                onChange={(e) => setPontoReferencia(e.target.value)}
                placeholder="Próximo a empresas, pontes, postos ou marcos geográficos"
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
            </div>
          </div>

          {/* Áreas Atingidas (RN012 / RN013 / RN031) */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700">
                Área Atingida (Selecione de 1 a 3 opções) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-bold text-inema-green bg-inema-sage px-2 py-0.5 rounded-full">
                {areasAtingidas.length} de 3 selecionadas
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {AREAS_CATALOGO.map((area) => {
                const isSelected = areasAtingidas.includes(area);
                const isDisabled = !isSelected && areasAtingidas.length >= 3;
                return (
                  <label
                    key={area}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-inema-green bg-inema-sage/40 text-inema-green font-semibold'
                        : isDisabled
                        ? 'opacity-40 border-slate-200 cursor-not-allowed text-slate-400'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => toggleArea(area)}
                      className="rounded text-inema-green focus:ring-inema-green"
                    />
                    <span>{area}</span>
                    {area === 'Comunidade Tradicional' && (
                      <span className="material-symbols-outlined text-xs text-slate-400" title="LEG013: Ribeirinha, Quilombo, Pescadores e outros...">info</span>
                    )}
                    {area === 'Unidade de Conservação' && (
                      <span className="material-symbols-outlined text-xs text-slate-400" title="LEG014: Parques, APA entre outros...">info</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Descrição do Cenário (Opcional)
            </label>
            <textarea
              rows={2}
              maxLength={1000}
              value={descricaoCenario}
              onChange={(e) => setDescricaoCenario(e.target.value)}
              placeholder="Descreva a área ou o cenário da área atingida (LEG012)"
              className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
            />
          </div>

          {/* Seção Coordenadas Geográficas (RN011 / BOT002) */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-inema-green">explore</span>
                <span className="text-xs font-bold text-slate-800">Coordenadas Geográficas (Opcional)</span>
              </div>
              <span className="text-[11px] text-slate-500">Caso não saiba, pode preencher com zero (LEG007)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={novaCoordTipo}
                onChange={(e) => setNovaCoordTipo(e.target.value)}
                className="text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              >
                <option value="Geográfica / Grau Decimal">Geográfica / Grau Decimal</option>
                <option value="Grau/Min/Seg">Grau/Min/Seg</option>
                <option value="UTM 23">UTM 23</option>
                <option value="UTM 24">UTM 24</option>
              </select>
              <input
                type="text"
                maxLength={10}
                value={novaCoordLat}
                onChange={(e) => setNovaCoordLat(e.target.value)}
                placeholder="Latitude (ex: -12.9714)"
                className="text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={10}
                  value={novaCoordLng}
                  onChange={(e) => setNovaCoordLng(e.target.value)}
                  placeholder="Longitude (ex: -38.5014)"
                  className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
                />
                <button
                  type="button"
                  onClick={adicionarCoordenada}
                  className="px-3 py-1.5 bg-inema-green text-white text-xs font-semibold rounded-lg hover:bg-inema-green-hover shrink-0"
                >
                  + Incluir
                </button>
              </div>
            </div>

            {/* Listagem de Coordenadas Adicionadas */}
            {coordenadas.length > 0 && (
              <div className="space-y-1 pt-2">
                {coordenadas.map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-700">
                      #{i + 1} [{c.tipo}]: Lat {c.latitude}, Long {c.longitude}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCoordenadas(coordenadas.filter(item => item.id !== c.id))}
                      className="text-red-600 hover:text-red-800 text-xs font-bold"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé de Ações (BOT001 e BOT003) */}
        <div className="p-6 bg-slate-50 flex items-center justify-between rounded-b-xl gap-3">
          <button
            type="button"
            onClick={() => setModalMsg007(true)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            <span>Excluir Emergência</span>
          </button>

          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleIniciarFinalizacao}
              className="px-6 py-2 bg-inema-green text-white rounded-lg text-xs font-bold hover:bg-inema-green-hover shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Finalizar Emergência</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal MSG001: Campos Obrigatórios */}
      {modalMsg001 && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">priority_high</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Atenção</h3>
              <p className="text-sm text-slate-600 font-semibold">
                Preencher campos obrigatórios!
              </p>
              <p className="text-xs text-slate-500">
                Por favor, confira os campos marcados com asterisco vermelho (*) antes de concluir o cadastro.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalMsg001(false)}
              className="w-full py-2 bg-inema-green text-white font-bold rounded-lg text-xs hover:bg-inema-green-hover"
            >
              Entendido, vou revisar
            </button>
          </div>
        </div>
      )}

      {/* Modal MSG002: Alerta de Ausência de Coordenadas */}
      {modalMsg002 && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">location_off</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Ausência de Coordenadas</h3>
              <p className="text-xs text-slate-600">
                Informamos que a ausência desse dado pode comprometer a apuração da Emergência Química registrada! Deseja continuar?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalMsg002(false)}
                className="flex-1 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50"
              >
                Adicionar Coordenadas
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalMsg002(false);
                  setModalMsg003(true);
                }}
                className="flex-1 py-2 bg-inema-green text-white font-bold rounded-lg text-xs hover:bg-inema-green-hover"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal MSG003: Confirmação Definitiva */}
      {modalMsg003 && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">help_outline</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Confirmar Finalização</h3>
              <p className="text-xs text-slate-600">
                Após finalizar o registro da emergência química, não será possível realizar alterações! Deseja continuar?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalMsg003(false)}
                className="flex-1 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50"
              >
                Não
              </button>
              <button
                type="button"
                onClick={executarFinalizacao}
                className="flex-1 py-2 bg-inema-green text-white font-bold rounded-lg text-xs hover:bg-inema-green-hover"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal MSG004: Sucesso de Finalização */}
      {modalMsg004 && registroFinalizado && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Registro Concluído</h3>
              <p className="text-xs text-slate-600">
                Registro de Emergência Química cadastrado com sucesso!
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2 font-bold text-inema-green text-sm">
                Nº de Registro: {registroFinalizado.numeroRegistro}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                O status inicial é <strong>Emergência Registrada</strong>. Acompanhe a tramitação pela Consulta de Registros Externos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalMsg004(false);
                window.location.href = '/consulta-externa.html';
              }}
              className="w-full py-2 bg-inema-green text-white font-bold rounded-lg text-xs hover:bg-inema-green-hover"
            >
              Ir para Consulta de Registros
            </button>
          </div>
        </div>
      )}

      {/* Modal MSG007: Excluir Registro Definitivamente */}
      {modalMsg007 && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Excluir Registro</h3>
              <p className="text-xs text-slate-600">
                Deseja excluir o registro de emergência definitivamente? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalMsg007(false)}
                className="flex-1 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50"
              >
                Não
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalMsg007(false);
                  window.location.reload();
                }}
                className="flex-1 py-2 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FormCadastroEmergencia;
