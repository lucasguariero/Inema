import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  MapPin,
  Building2,
  PhoneCall,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Plus,
  Trash2,
  Truck,
  Droplets,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { MUNICIPIOS_BAHIA, SUBSTANCIAS_QUIMICAS } from '@/data/fiscalizacaoMock';
import { useTheme } from '@/context/ThemeContext';

export const EmergenciaInternaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();

  // 1. Detalhes do Registro
  const [origem, setOrigem] = useState('Call center (Plantão 24h)');
  const [dataHoraComunicado, setDataHoraComunicado] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [severidade, setSeveridade] = useState<'Nível 3 (Crítico)' | 'Nível 2 (Alto)' | 'Nível 1 (Médio)'>('Nível 3 (Crítico)');
  const [comunicanteNome, setComunicanteNome] = useState('');
  const [comunicanteTelefone, setComunicanteTelefone] = useState('');

  // 2. Empresa Responsável
  const [empresaResponsavel, setEmpresaResponsavel] = useState('');
  const [cnpjEmpresa, setCnpjEmpresa] = useState('');
  const [tipoTransporte, setTipoTransporte] = useState('Rodoviário (Carreta Tanque)');
  const [placaVeiculo, setPlacaVeiculo] = useState('');

  // 3. Produto Químico
  const [substanciaSelecionada, setSubstanciaSelecionada] = useState(SUBSTANCIAS_QUIMICAS[2].nome);
  const [onu, setOnu] = useState(SUBSTANCIAS_QUIMICAS[2].onu);
  const [classeRisco, setClasseRisco] = useState(SUBSTANCIAS_QUIMICAS[2].classe);
  const [volumeTotal, setVolumeTotal] = useState('30.000 Litros');
  const [volumeVazado, setVolumeVazado] = useState('8.500 Litros');
  const [atingiuCorpoHidrico, setAtingiuCorpoHidrico] = useState<'SIM' | 'NÃO'>('SIM');
  const [nomeCorpoHidrico, setNomeCorpoHidrico] = useState('Riacho Água Fria (afluente Rio Joanes)');
  const [haVitimas, setHaVitimas] = useState<'SIM' | 'NÃO'>('NÃO');

  // 4. Localização
  const [municipio, setMunicipio] = useState('Candeias');
  const [localidade, setLocalidade] = useState('Rodovia BA-522, Km 14');
  const [pontoReferencia, setPontoReferencia] = useState('Próximo ao trevo de acesso à Refinaria Mataripe');
  const [latitude, setLatitude] = useState('-12.6719');
  const [longitude, setLongitude] = useState('-38.5442');

  // 5. Plano de Resposta Emergencial
  const [empresaContencao, setEmpresaContencao] = useState('Ambipar Response / SOS');
  const [medidasAdotadas, setMedidasAdotadas] = useState('');
  const [tecnicoDesignado, setTecnicoDesignado] = useState('Eng. Carlos Andrade (DIFIS/Plantonista)');

  // Modais
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [protocoloREGerado, setProtocoloREGerado] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [rascunhoSalvo, setRascunhoSalvo] = useState(false);

  const handleSubstanciaChange = (nome: string) => {
    setSubstanciaSelecionada(nome);
    const found = SUBSTANCIAS_QUIMICAS.find((s) => s.nome === nome);
    if (found) {
      setOnu(found.onu);
      setClasseRisco(found.classe);
    }
  };

  const handlePreencherExemplo = () => {
    setOrigem('Call center (Plantão 24h)');
    setDataHoraComunicado(new Date().toISOString().slice(0, 16));
    setSeveridade('Nível 3 (Crítico)');
    setComunicanteNome('Subtenente Lima (Corpo de Bombeiros Militar)');
    setComunicanteTelefone('(71) 98822-1930');
    setEmpresaResponsavel('Petroquímica do Nordeste S.A.');
    setCnpjEmpresa('13.882.114/0001-92');
    setTipoTransporte('Rodoviário (Carreta Tanque)');
    setPlacaVeiculo('BAH-8F22 / Reboque RQK-9A10');
    handleSubstanciaChange('Ácido Sulfúrico');
    setVolumeTotal('32.000 Litros');
    setVolumeVazado('14.000 Litros');
    setAtingiuCorpoHidrico('SIM');
    setNomeCorpoHidrico('Rio Jacuípe (Margem Direita)');
    setHaVitimas('NÃO');
    setMunicipio('Candeias');
    setLocalidade('BA-522, Km 18 - Sentido Polo Petroquímico');
    setPontoReferencia('Curva do Engenho, logo após o viaduto da ferrovia');
    setLatitude('-12.671944');
    setLongitude('-38.544211');
    setEmpresaContencao('Ambipar Emergency Response');
    setMedidasAdotadas(
      'Instalação de barreiras de contenção com manta absorvente e aplicação de cal virgem para neutralização do pH do efluente ácido. Válvula de fundo da carreta estancada pela equipe especializada.'
    );
    setTecnicoDesignado('Eng. Carlos Andrade (DIFIS/Plantonista)');
  };

  const handleLimpar = () => {
    setEmpresaResponsavel('');
    setCnpjEmpresa('');
    setPlacaVeiculo('');
    setVolumeVazado('');
    setLocalidade('');
    setPontoReferencia('');
    setMedidasAdotadas('');
  };

  const handleSalvarRascunho = () => {
    setRascunhoSalvo(true);
    setTimeout(() => setRascunhoSalvo(false), 4000);
  };

  const handleFinalizar = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const handleConfirmarEnvio = () => {
    setIsConfirmModalOpen(false);
    const seq = Math.floor(100000 + Math.random() * 900000);
    const num = `2026.${seq}/INEMA/RE`;
    setProtocoloREGerado(num);
    setIsSuccessModalOpen(true);
  };

  const handleCopiarProtocolo = () => {
    navigator.clipboard.writeText(protocoloREGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Topo & Breadcrumb */}
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="hover:text-emerald-700 cursor-pointer" onClick={() => onNavigate?.('relatorios')}>
            Início
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Fiscalização</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Emergências Químicas</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Cadastro Interno (DOR003)</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center justify-center shadow-2xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                Atendimento a Emergência Química (RE)
                <Badge variant="rose" dot>
                  Plantão DIFIS 24h
                </Badge>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Registro operacional de acidentes com produtos perigosos para acionamento de resposta rápida e perícia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePreencherExemplo}
              className="gap-1.5 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Preencher Exemplo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLimpar}
              className="gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpar
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSalvarRascunho}
              className="gap-1.5 text-xs font-semibold"
            >
              Salvar Rascunho
            </Button>
          </div>
        </div>
      </div>

      {rascunhoSalvo && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Rascunho de Emergência Química salvo! Equipe notificada preventivamente.</span>
        </div>
      )}

      {/* Formulário Principal */}
      <form onSubmit={handleFinalizar} className="space-y-6">
        {/* Bloco 1: Detalhes do Acidente e Gravidade */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Detalhes do Comunicado e Nível de Severidade
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Origem do acionamento e classificação inicial de risco.
                  </CardDescription>
                </div>
              </div>

              {/* Severidade Pills */}
              <div className="flex items-center gap-1.5">
                {(['Nível 1 (Médio)', 'Nível 2 (Alto)', 'Nível 3 (Crítico)'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeveridade(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      severidade === lvl
                        ? lvl === 'Nível 3 (Crítico)'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : lvl === 'Nível 2 (Alto)'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Origem do Chamado <span className="text-rose-500">*</span>
              </label>
              <select
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              >
                <option value="Call center (Plantão 24h)">Call center (Plantão 24h)</option>
                <option value="Corpo de Bombeiros Militar (CBMBA)">Corpo de Bombeiros Militar (CBMBA)</option>
                <option value="Polícia Rodoviária Federal (PRF)">Polícia Rodoviária Federal (PRF)</option>
                <option value="Defesa Civil Estadual (CORDEC)">Defesa Civil Estadual (CORDEC)</option>
                <option value="Empresa Geradora / Transportadora">Empresa Geradora / Transportadora</option>
                <option value="Comunidade / Cidadão">Comunidade / Cidadão</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Data e Hora do Comunicado <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={dataHoraComunicado}
                onChange={(e) => setDataHoraComunicado(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nome do Comunicante <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={comunicanteNome}
                onChange={(e) => setComunicanteNome(e.target.value)}
                required
                placeholder="Nome e cargo de quem ligou"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Telefone de Contato Direto <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={comunicanteTelefone}
                onChange={(e) => setComunicanteTelefone(e.target.value)}
                required
                placeholder="(00) 00000-0000"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bloco 2: Empresa e Carga Perigosa */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Empresa Responsável & Produto Químico Envolvido
                </CardTitle>
                <CardDescription className="text-xs">
                  Substância perigosa, identificação ONU, classe de risco e volumes sob ameaça.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Empresa / Transportadora Responsável <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={empresaResponsavel}
                  onChange={(e) => setEmpresaResponsavel(e.target.value)}
                  required
                  placeholder="Razão social da geradora ou transportadora"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  CNPJ da Empresa
                </label>
                <input
                  type="text"
                  value={cnpjEmpresa}
                  onChange={(e) => setCnpjEmpresa(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Placas do Veículo
                </label>
                <input
                  type="text"
                  value={placaVeiculo}
                  onChange={(e) => setPlacaVeiculo(e.target.value)}
                  placeholder="Ex: ABC-1D23 / Carreta"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* Ficha da Substância Química */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  Classificação do Produto Perigoso
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Substância Química <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={substanciaSelecionada}
                    onChange={(e) => handleSubstanciaChange(e.target.value)}
                    required
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  >
                    {SUBSTANCIAS_QUIMICAS.map((s) => (
                      <option key={s.onu} value={s.nome}>
                        {s.nome} (ONU {s.onu})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Número ONU
                  </label>
                  <input
                    type="text"
                    value={onu}
                    readOnly
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-3 py-2.5 text-slate-700 dark:text-slate-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Classe de Risco
                  </label>
                  <input
                    type="text"
                    value={classeRisco}
                    readOnly
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-3 py-2.5 text-slate-700 dark:text-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Volume Total da Carga
                  </label>
                  <input
                    type="text"
                    value={volumeTotal}
                    onChange={(e) => setVolumeTotal(e.target.value)}
                    placeholder="Ex: 30.000 Litros"
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Volume Estimado Vazado <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={volumeVazado}
                    onChange={(e) => setVolumeVazado(e.target.value)}
                    required
                    placeholder="Ex: 10.000 Litros"
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none font-bold text-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Atingiu Recursos Hídricos? <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={atingiuCorpoHidrico}
                    onChange={(e) => setAtingiuCorpoHidrico(e.target.value as 'SIM' | 'NÃO')}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none font-bold"
                  >
                    <option value="SIM">SIM (Crítico)</option>
                    <option value="NÃO">NÃO (Contido no solo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Há Vítimas Humanas?
                  </label>
                  <select
                    value={haVitimas}
                    onChange={(e) => setHaVitimas(e.target.value as 'SIM' | 'NÃO')}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="NÃO">NÃO</option>
                    <option value="SIM">SIM (Socorro Acionado)</option>
                  </select>
                </div>
              </div>

              {atingiuCorpoHidrico === 'SIM' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nome do Corpo Hídrico Afetado <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nomeCorpoHidrico}
                    onChange={(e) => setNomeCorpoHidrico(e.target.value)}
                    required
                    placeholder="Ex: Rio Paraguaçu, Riacho das Pedras, Lençol freático..."
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none font-medium"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bloco 3: Localização & Medidas de Resposta */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Localização Geográfica & Ações Emergenciais Adotadas
                </CardTitle>
                <CardDescription className="text-xs">
                  Posicionamento para vistoria e plano de contingência no local do acidente.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Município <span className="text-rose-500">*</span>
                </label>
                <select
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                >
                  {MUNICIPIOS_BAHIA.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rodovia / Km / Bairro / Distrito Industrial <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={localidade}
                  onChange={(e) => setLocalidade(e.target.value)}
                  required
                  placeholder="Ex: BA-522, Km 14 - Candeias"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ponto de Referência <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={pontoReferencia}
                  onChange={(e) => setPontoReferencia(e.target.value)}
                  required
                  placeholder="Ex: Próximo à entrada da fábrica"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Latitude
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-12.6719"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Longitude
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="-38.5442"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none font-mono"
                />
              </div>
            </div>

            {/* Resposta e Contenção */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Empresa de Atendimento Emergencial Acionada
                </label>
                <input
                  type="text"
                  value={empresaContencao}
                  onChange={(e) => setEmpresaContencao(e.target.value)}
                  placeholder="Ex: Ambipar Response, WGRA, SOS..."
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Técnico / Fiscal DIFIS Designado de Plantão <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={tecnicoDesignado}
                  onChange={(e) => setTecnicoDesignado(e.target.value)}
                  required
                  placeholder="Nome do analista encarregado da ocorrência"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Medidas Imediatas de Contenção Adotadas no Local
              </label>
              <textarea
                value={medidasAdotadas}
                onChange={(e) => setMedidasAdotadas(e.target.value)}
                rows={3}
                placeholder="Descreva as medidas preliminares: barreiras absorventes, diques de terra, isolamento da área, recolhimento de solo contaminado..."
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-slate-100 outline-none leading-relaxed"
              />
            </div>
          </CardContent>

          <CardFooter className="pt-4 pb-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              O registro gerará número oficial <strong>2026.XXXXXX/INEMA/RE</strong> com prioridade de despacho.
            </span>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={handleSalvarRascunho} className="text-xs font-semibold">
                Salvar Rascunho
              </Button>
              <Button
                type="submit"
                className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm px-6"
              >
                Autuar Registro de Emergência (RE)
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>

      {/* Modal de Confirmação */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <Flame className="w-5 h-5" />
              Confirmar Autuação de Emergência Química
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
              Você está registrando formalmente uma Emergência Química com severidade <strong>{severidade}</strong>.
              O alerta será transmitido para a Coordenação DIFIS e equipe técnica regional.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
            <p><strong>Substância:</strong> {substanciaSelecionada} (ONU {onu})</p>
            <p><strong>Empresa:</strong> {empresaResponsavel}</p>
            <p><strong>Local:</strong> {localidade} - {municipio}</p>
            <p><strong>Corpo Hídrico:</strong> {atingiuCorpoHidrico === 'SIM' ? nomeCorpoHidrico : 'Não atingido'}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsConfirmModalOpen(false)}>
              Revisar
            </Button>
            <Button size="sm" onClick={handleConfirmarEnvio} className="bg-rose-700 hover:bg-rose-800 text-white font-bold">
              Confirmar e Autuar RE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Sucesso */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-lg text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 mx-auto flex items-center justify-center mb-2 shadow-sm">
            <Flame className="w-8 h-8" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Emergência Química Autuada com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Registro formal expedido e encaminhado para os técnicos de campo da DIFIS.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 my-2 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-center space-y-2">
            <span className="text-[11px] uppercase font-bold text-rose-800 dark:text-rose-300 tracking-wider">
              Número Oficial da Emergência (RE)
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl md:text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
                {protocoloREGerado}
              </span>
              <button
                type="button"
                onClick={handleCopiarProtocolo}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs transition-colors"
                title="Copiar Protocolo"
              >
                {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copiado && <p className="text-[10px] text-emerald-600 font-semibold">Copiado para a área de transferência!</p>}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsSuccessModalOpen(false);
                handleLimpar();
              }}
            >
              Novo Registro
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsSuccessModalOpen(false);
                onNavigate?.('consulta-interna');
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Ver no Painel DIFIS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
