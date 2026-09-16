import React, { useState } from 'react';
import {
  Flame,
  AlertOctagon,
  Building2,
  Phone,
  Truck,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Wand2,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  FileCheck,
  Lock,
  UploadCloud,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentSelect } from '@/components/filament';
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
import { cn } from '@/lib/utils';

const AREAS_ATINGIDAS_EXTERNA = [
  { id: 'urbana', label: 'Área Urbana' },
  { id: 'rural', label: 'Área Rural' },
  { id: 'hidrico', label: 'Recurso Hídrico / Rio / Mar' },
  { id: 'rodovia', label: 'Rodovia' },
  { id: 'uc', label: 'Unidade de Conservação' },
  { id: 'tradicional', label: 'Comunidade Tradicional' }
];

export const EmergenciaExternaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();

  // Pós-finalização
  const [registroFinalizado, setRegistroFinalizado] = useState(false);
  const [protocoloGerado, setProtocoloGerado] = useState('');

  // Bloco 2: Comunicante Gov.br (Nome, CPF e Email bloqueados para edição; Telefone editável)
  const [nomeComunicante] = useState('Giovani Santana de Oliveira');
  const [cpfComunicante] = useState('529.982.247-25');
  const [emailComunicante] = useState('giovani.santana@empresa.com.br');
  const [telefoneComunicante, setTelefoneComunicante] = useState('(71) 98842-1090');

  // Bloco 3: Informações sobre Empresa & Vínculo (DOR004)
  const [vinculoEmpresa, setVinculoEmpresa] = useState<'Sim' | 'Não'>('Sim');
  const [empresaNome, setEmpresaNome] = useState('Petroquímica Camaçari S.A.');
  const [cargoEmpresa, setCargoEmpresa] = useState('Gerente de Operações Químicas');
  const [comunicandoComo, setComunicandoComo] = useState<'Cidadão comum' | 'Força Policial' | 'Outras instituições'>('Cidadão comum');
  const [outraInstituicao, setOutraInstituicao] = useState('');
  const [sabeEmpresaResponsavel, setSabeEmpresaResponsavel] = useState<'Sim' | 'Não'>('Sim');

  // Bloco 4: Dados do Acidente
  const [dataHoraAcidente, setDataHoraAcidente] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [tipoEmergencia, setTipoEmergencia] = useState('Tombamento de Carga Perigosa em Rodovia');
  const [descricaoTipoOutros, setDescricaoTipoOutros] = useState('');

  // Produto Químico
  const [substancia, setSubstancia] = useState(SUBSTANCIAS_QUIMICAS[0].nome);
  const [onu, setOnu] = useState(SUBSTANCIAS_QUIMICAS[0].onu);
  const [volumeVazado, setVolumeVazado] = useState('5.000 Litros');
  const [houveVazamentoAgua, setHouveVazamentoAgua] = useState<'SIM' | 'NÃO'>('NÃO');

  // Localização & Área Atingida (Máx 3 opções, RN012)
  const [municipio, setMunicipio] = useState('Simões Filho');
  const [cep, setCep] = useState('43700-000');
  const [localidade, setLocalidade] = useState('BR-324, Km 598 - Sentido Salvador');
  const [pontoReferencia, setPontoReferencia] = useState('Próximo ao pedágio da Viabahia');
  const [areasAtingidas, setAreasAtingidas] = useState<string[]>(['urbana', 'rodovia']);
  const [erroAreas, setErroAreas] = useState<string | null>(null);
  const [latitude, setLatitude] = useState('-12.7845');
  const [longitude, setLongitude] = useState('-38.4021');

  // Relatórios pós-finalização enviados
  const [conclusivoEnviado, setConclusivoEnviado] = useState(false);
  const [rpeqEnviado, setRpeqEnviado] = useState(false);

  // Modais
  const [isMsg002ModalOpen, setIsMsg002ModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const handleSubstanciaChange = (nome: string) => {
    setSubstancia(nome);
    const found = SUBSTANCIAS_QUIMICAS.find((s) => s.nome === nome);
    if (found) setOnu(found.onu);
  };

  const handleToggleArea = (id: string) => {
    if (registroFinalizado) return;
    setErroAreas(null);
    if (areasAtingidas.includes(id)) {
      setAreasAtingidas(areasAtingidas.filter((a) => a !== id));
    } else {
      // RN012: Máximo 3 áreas
      if (areasAtingidas.length >= 3) {
        setErroAreas('Limite atingido: você pode selecionar no máximo 3 áreas atingidas (RN012).');
        return;
      }
      setAreasAtingidas([...areasAtingidas, id]);
    }
  };

  const handlePreencherExemplo = () => {
    setTelefoneComunicante('(71) 99123-5566');
    setVinculoEmpresa('Sim');
    setEmpresaNome('Bahia Química Logística Integrada S.A.');
    setCargoEmpresa('Gerente de Logística e Cargas Perigosas');
    setDataHoraAcidente(new Date().toISOString().slice(0, 16));
    setTipoEmergencia('Tombamento de Carga Perigosa em Rodovia');
    handleSubstanciaChange('Gasolina Comum / Aditivada');
    setVolumeVazado('4.200 Litros');
    setHouveVazamentoAgua('NÃO');
    setMunicipio('Simões Filho');
    setCep('43700-000');
    setLocalidade('BR-324, Km 602 - Perto da entrada do CIA Sul');
    setPontoReferencia('Acostamento logo após a passarela de pedestres');
    setAreasAtingidas(['urbana', 'rodovia', 'hidrico']);
    setLatitude('-12.784512');
    setLongitude('-38.402194');
  };

  const handleLimpar = () => {
    setTelefoneComunicante('');
    setLocalidade('');
    setPontoReferencia('');
    setVolumeVazado('');
    setAreasAtingidas([]);
    setLatitude('');
    setLongitude('');
  };

  const handleFinalizar = (e: React.FormEvent) => {
    e.preventDefault();

    if (areasAtingidas.length === 0) {
      setErroAreas('Selecione ao menos 1 área atingida (RN012).');
      return;
    }

    if (!latitude || !longitude) {
      setIsMsg002ModalOpen(true);
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmarFinalizacao = () => {
    setIsConfirmModalOpen(false);
    setIsMsg002ModalOpen(false);
    const seq = Math.floor(100000 + Math.random() * 900000);
    const num = `2026.${seq}/INEMA/RE`;
    setProtocoloGerado(num);
    setRegistroFinalizado(true);
    setIsSuccessModalOpen(true);
  };

  const handleCopiarProtocolo = () => {
    navigator.clipboard.writeText(protocoloGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Topo Oficial (DOR004: Nº de Registro a gerar na finalização) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Comunicação de Emergência Química Externa (DOR004)
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold shadow-2xs">
              <span>
                {registroFinalizado ? `Nº de Registro: ${protocoloGerado}` : 'Nº de Registro: A gerar na finalização'}
              </span>
            </div>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Canal oficial para empresas transportadoras, indústrias e cidadãos comunicarem acidentes químicos ao INEMA.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {!registroFinalizado && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreencherExemplo}
                className="gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs"
              >
                <Wand2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Preencher Exemplo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLimpar}
                className="gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpar
              </Button>
            </>
          )}

          {registroFinalizado && (
            <Badge color="success" dot className="text-xs py-1 px-3">
              Status: Emergência Registrada
            </Badge>
          )}
        </div>
      </div>

      {/* Formulário Principal */}
      <form onSubmit={handleFinalizar} className="space-y-6">
        {/* CARD 1: Dados do Comunicante (Gov.br - Bloqueados para edição exceto telefone) */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                  1
                </span>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Dados do Comunicante (Gov.br)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Identificação autenticada. Nome, CPF e E-mail são protegidos contra alteração (DOR004).
                  </CardDescription>
                </div>
              </div>
              <Badge color="gray" className="gap-1 text-[11px]">
                <Lock className="w-3 h-3" />
                Autenticado via Gov.br
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                value={nomeComunicante}
                readOnly
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3 py-2.5 text-slate-700 dark:text-slate-300 cursor-not-allowed opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                CPF
              </label>
              <input
                type="text"
                value={cpfComunicante}
                readOnly
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3 py-2.5 font-mono text-slate-700 dark:text-slate-300 cursor-not-allowed opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={emailComunicante}
                readOnly
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3 py-2.5 text-slate-700 dark:text-slate-300 cursor-not-allowed opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Telefone para Contato <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={telefoneComunicante}
                disabled={registroFinalizado}
                onChange={(e) => setTelefoneComunicante(e.target.value)}
                required
                placeholder="(71) 90000-0000"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* CARD 2: Vínculo com a Empresa Responsável (DOR004 - Bloco 3) */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                2
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Informações sobre a Empresa & Vínculo
                </CardTitle>
                <CardDescription className="text-xs">
                  Declaração de vínculo empregatício e dados da instituição responsável (DOR004).
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Possui vínculo com a empresa responsável? <span className="text-rose-500">*</span>
                </label>
                <FilamentSelect
                  value={vinculoEmpresa}
                  disabled={registroFinalizado}
                  onChange={(val) => setVinculoEmpresa(val as any)}
                  options={[
                    { value: 'Sim', label: 'Sim (Funcionário / Contratado)' },
                    { value: 'Não', label: 'Não' },
                  ]}
                />
              </div>

              {/* Vínculo = Sim */}
              {vinculoEmpresa === 'Sim' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nome da Empresa (máx. 500 carac.) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={empresaNome}
                      disabled={registroFinalizado}
                      maxLength={500}
                      onChange={(e) => setEmpresaNome(e.target.value)}
                      required
                      placeholder="Razão Social da empresa responsável"
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Cargo / Função (máx. 200 carac.) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cargoEmpresa}
                      disabled={registroFinalizado}
                      maxLength={200}
                      onChange={(e) => setCargoEmpresa(e.target.value)}
                      required
                      placeholder="Ex: Gerente de Operações / Motorista"
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>
                </>
              )}

              {/* Vínculo = Não */}
              {vinculoEmpresa === 'Não' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Você está comunicando como: <span className="text-rose-500">*</span>
                    </label>
                    <FilamentSelect
                      value={comunicandoComo}
                      disabled={registroFinalizado}
                      onChange={(val) => setComunicandoComo(val as any)}
                      options={[
                        { value: 'Cidadão comum', label: 'Cidadão comum' },
                        { value: 'Força Policial', label: 'Força Policial (PM / PRF / CBMBA)' },
                        { value: 'Outras instituições', label: 'Outras instituições' },
                      ]}
                    />
                  </div>

                  {comunicandoComo === 'Outras instituições' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Instituição (máx. 500 carac.) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={outraInstituicao}
                        disabled={registroFinalizado}
                        maxLength={500}
                        onChange={(e) => setOutraInstituicao(e.target.value)}
                        required
                        placeholder="Nome do órgão ou entidade"
                        className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Pergunta permanente visível em ambos os cenários (RN005) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sabe informar o nome da empresa responsável pela emergência química? (RN005)
              </label>
              <FilamentSelect
                value={sabeEmpresaResponsavel}
                disabled={registroFinalizado}
                onChange={(val) => setSabeEmpresaResponsavel(val as any)}
                options={['Sim', 'Não']}
                className="w-full md:w-1/3"
              />
            </div>
          </CardContent>
        </Card>

        {/* CARD 3: Detalhes do Sinistro & Produto Químico */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                3
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Caracterização do Evento Químico
                </CardTitle>
                <CardDescription className="text-xs">
                  Tipologia, substâncias envolvidas, volume derramado e risco hídrico.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Data e Hora da Constatação <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={dataHoraAcidente}
                disabled={registroFinalizado}
                onChange={(e) => setDataHoraAcidente(e.target.value)}
                max={new Date().toISOString().slice(0, 16)}
                required
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tipo da Emergência Química <span className="text-rose-500">*</span>
              </label>
              <FilamentSelect
                value={tipoEmergencia}
                disabled={registroFinalizado}
                onChange={(val) => setTipoEmergencia(val)}
                options={[
                  'Tombamento de Carga Perigosa em Rodovia',
                  'Vazamento em Instalação Industrial / Polo',
                  'Explosão / Incêndio com Produtos Químicos',
                  'Derrame em Rio, Lagoa, Estuário ou Mar',
                  'Ruptura ou Furo em Duto / Oleoduto',
                  'Outros',
                ]}
              />
            </div>

            {tipoEmergencia === 'Outros' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Descrição do Tipo (RN028) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={descricaoTipoOutros}
                  disabled={registroFinalizado}
                  onChange={(e) => setDescricaoTipoOutros(e.target.value)}
                  required
                  placeholder="Especifique a tipologia do sinistro..."
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Produto Químico / Substância <span className="text-rose-500">*</span>
              </label>
              <FilamentSelect
                value={substancia}
                disabled={registroFinalizado}
                onChange={(val) => handleSubstanciaChange(val)}
                options={SUBSTANCIAS_QUIMICAS.map((s) => ({
                  value: s.nome,
                  label: `${s.nome} (ONU ${s.onu})`,
                }))}
                searchable
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Número ONU
              </label>
              <input
                type="text"
                value={onu}
                readOnly
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3 py-2.5 font-mono text-slate-700 dark:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Volume Vazado / Derramado <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={volumeVazado}
                disabled={registroFinalizado}
                onChange={(e) => setVolumeVazado(e.target.value)}
                required
                placeholder="Ex: 5.000 Litros"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Atingiu curso d'água / manancial? <span className="text-rose-500">*</span>
              </label>
              <FilamentSelect
                value={houveVazamentoAgua}
                disabled={registroFinalizado}
                onChange={(val) => setHouveVazamentoAgua(val as any)}
                options={[
                  { value: 'NÃO', label: 'Não' },
                  { value: 'SIM', label: 'Sim (Risco Crítico a Recursos Hídricos)' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* CARD 4: Localização e Áreas Atingidas (Máx 3 opções, RN012) */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                4
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Localização Geográfica e Áreas Atingidas
                </CardTitle>
                <CardDescription className="text-xs">
                  Município, logradouro e restrição de até 3 áreas afetadas (RN012).
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Município <span className="text-rose-500">*</span>
                </label>
                <FilamentSelect
                  value={municipio}
                  disabled={registroFinalizado}
                  onChange={(val) => setMunicipio(val)}
                  options={MUNICIPIOS_BAHIA}
                  searchable
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  CEP (busca automática Correios)
                </label>
                <input
                  type="text"
                  value={cep}
                  disabled={registroFinalizado}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="40020-000"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rodovia / KM ou Endereço <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={localidade}
                  disabled={registroFinalizado}
                  onChange={(e) => setLocalidade(e.target.value)}
                  required
                  placeholder="Ex: BR-324, Km 598"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Ponto de Referência <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={pontoReferencia}
                disabled={registroFinalizado}
                onChange={(e) => setPontoReferencia(e.target.value)}
                required
                placeholder="Ex: Próximo à praça de pedágio, sentido Salvador"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            {/* Áreas Atingidas: Máximo 3 opções (RN012) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Áreas Atingidas (RN012) <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Selecione no máximo 3 áreas afetadas pelo acidente.
                  </p>
                </div>
                <Badge color={areasAtingidas.length === 3 ? 'warning' : 'primary'}>
                  {areasAtingidas.length} / 3 selecionadas
                </Badge>
              </div>

              {erroAreas && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {erroAreas}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                {AREAS_ATINGIDAS_EXTERNA.map((area) => {
                  const isChecked = areasAtingidas.includes(area.id);
                  return (
                    <button
                      key={area.id}
                      type="button"
                      disabled={registroFinalizado}
                      onClick={() => handleToggleArea(area.id)}
                      className={cn(
                        "p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer",
                        isChecked
                          ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-900 dark:text-blue-200 shadow-2xs font-semibold"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300"
                      )}
                    >
                      <span className="text-xs">{area.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Latitude (SIRGAS 2000)
                </label>
                <input
                  type="text"
                  value={latitude}
                  disabled={registroFinalizado}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-12.7845"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Longitude (SIRGAS 2000)
                </label>
                <input
                  type="text"
                  value={longitude}
                  disabled={registroFinalizado}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="-38.4021"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>
          </CardContent>

          {!registroFinalizado && (
            <CardFooter className="pt-4 pb-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                O número oficial do Registro de Emergência (RE) será gerado após a confirmação.
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLimpar}
                  className="text-xs font-semibold"
                >
                  Limpar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="font-bold text-xs shadow-sm px-6 bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Finalizar Comunicação de Emergência (MSG003)
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </form>

      {/* BLOCO 5: Seção Relatórios Pós-Finalização (DOR004 - Bloco 5) */}
      {registroFinalizado && (
        <Card className="border-slate-200/90 dark:border-slate-800 animate-in fade-in">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Relatórios Técnicos da Emergência (Bloco 5)
                </CardTitle>
                <CardDescription className="text-xs">
                  Envio de relatórios técnicos obrigatórios para instrução processual do sinistro.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            {/* Relatório Conclusivo */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Relatório Conclusivo de Atendimento
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Relatório com o encerramento das medidas mitigadoras e destinação dos resíduos.
                </p>
              </div>
              <Button
                size="sm"
                variant={conclusivoEnviado ? 'outline' : 'primary'}
                onClick={() => {
                  setConclusivoEnviado(true);
                  alert('Relatório Conclusivo em PDF anexado com sucesso!');
                }}
                className="gap-1.5 text-xs font-semibold"
              >
                {conclusivoEnviado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <UploadCloud className="w-3.5 h-3.5" />}
                {conclusivoEnviado ? 'Relatório Enviado' : 'Enviar Relatório Conclusivo'}
              </Button>
            </div>

            {/* RPEQ: Condicionado a Vínculo = Sim */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Relatório Preliminar de Emergência Química (RPEQ)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {vinculoEmpresa === 'Sim'
                    ? 'Obrigatório para empresa transportadora ou geradora em até 48 horas.'
                    : 'O Relatório Preliminar de Emergência Química (RPEQ) é solicitado apenas a quem declarou vínculo com a empresa responsável.'}
                </p>
              </div>

              {vinculoEmpresa === 'Sim' ? (
                <Button
                  size="sm"
                  variant={rpeqEnviado ? 'outline' : 'primary'}
                  onClick={() => {
                    setRpeqEnviado(true);
                    alert('RPEQ em PDF anexado com sucesso!');
                  }}
                  className="gap-1.5 text-xs font-semibold"
                >
                  {rpeqEnviado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <UploadCloud className="w-3.5 h-3.5" />}
                  {rpeqEnviado ? 'RPEQ Enviado' : 'Enviar RPEQ'}
                </Button>
              ) : (
                <Badge color="gray">Bloqueado (Sem Vínculo Declarado)</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal MSG002: Alerta Sem Coordenadas */}
      <Dialog open={isMsg002ModalOpen} onOpenChange={setIsMsg002ModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Alerta de Coordenadas (MSG002)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
              A ausência de coordenadas em rodovia ou área rural pode atrasar o direcionamento das equipes de plantão do INEMA. Deseja prosseguir sem informar as coordenadas?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsMsg002ModalOpen(false)}>
              Voltar e Preencher
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setIsMsg002ModalOpen(false);
                setIsConfirmModalOpen(true);
              }}
            >
              Continuar Mesmo Assim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal MSG003: Confirmação Definitiva */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Finalizar Comunicação de Emergência (MSG003)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
              Após confirmar, a ocorrência será protocolada formalmente no INEMA e não será mais possível alterar os dados informados. Deseja finalizar?
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-xs space-y-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <p><strong>Município:</strong> {municipio}</p>
            <p><strong>Substância:</strong> {substancia} (ONU {onu})</p>
            <p><strong>Volume:</strong> {volumeVazado}</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsConfirmModalOpen(false)}>
              Revisar Dados
            </Button>
            <Button
              size="sm"
              variant="primary"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleConfirmarFinalizacao}
            >
              Sim, Finalizar Comunicação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal MSG004: Sucesso com RE Gerado */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-lg text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-2 shadow-sm">
            <Flame className="w-8 h-8" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Emergência Química Registrada com Sucesso! (MSG004)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              O sinistro foi formalmente comunicado e encaminhado com prioridade ao plantão DIFIS/INEMA.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 my-2 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-center space-y-2">
            <span className="text-[11px] uppercase font-bold text-rose-800 dark:text-rose-300 tracking-wider">
              Número Oficial do Registro (RE)
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl md:text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
                {protocoloGerado}
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
            {copiado && <p className="text-[10px] text-rose-600 font-semibold">Protocolo copiado para a área de transferência!</p>}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsSuccessModalOpen(false);
                onNavigate?.('consulta-externa');
              }}
            >
              Ir para Meus Registros
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Permanecer no Registro (Modo Leitura)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
