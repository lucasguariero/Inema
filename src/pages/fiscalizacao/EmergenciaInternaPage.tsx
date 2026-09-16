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
  Wand2,
  ChevronRight,
  Plus,
  Trash2,
  Truck,
  Droplets,
  ShieldCheck,
  FileText,
  HelpCircle,
  Clock,
  Send,
  UploadCloud,
  FileDown
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

const AREAS_ATINGIDAS_OPCOES = [
  { id: 'urbana', label: 'Área Urbana / Residencial' },
  { id: 'rural', label: 'Área Rural / Povoado' },
  { id: 'hidrico', label: 'Recurso Hídrico / Manancial' },
  { id: 'rodovia', label: 'Rodovia / Faixa de Domínio' },
  {
    id: 'uc',
    label: 'Unidade de Conservação (UC)',
    tooltip: 'RN029: Áreas de proteção integral ou uso sustentável sob tutela estadual/federal.'
  },
  {
    id: 'tradicional',
    label: 'Comunidade Tradicional',
    tooltip: 'RN029: Terras indígenas, quilombolas ou comunidades ribeirinhas/pesqueiras.'
  }
];

interface InfoAdicional {
  autor: string;
  data: string;
  texto: string;
}

export const EmergenciaInternaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();

  // RN002 / CA002: Número RE provisório gerado na abertura
  const [numeroREProvisorio] = useState(() => `2026.0000${Math.floor(10 + Math.random() * 89)}/INEMA/RE`);

  // Estado de Finalização (Pós-finalização: modo leitura)
  const [registroFinalizado, setRegistroFinalizado] = useState(false);
  const [protocoloREGerado, setProtocoloREGerado] = useState('');

  // 1. Detalhes do Comunicado (DOR003 - RN004)
  const [origem, setOrigem] = useState('Call Center');
  const [dataHoraComunicado, setDataHoraComunicado] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [tipoEmergencia, setTipoEmergencia] = useState('Tombamento de Carga Perigosa em Rodovia');
  const [descricaoTipoOutros, setDescricaoTipoOutros] = useState('');
  const [severidade, setSeveridade] = useState<'Nível 3 (Crítico)' | 'Nível 2 (Alto)' | 'Nível 1 (Médio)'>('Nível 3 (Crítico)');

  // 2. Comunicante (DOR003 - RN025, RN026)
  const [comunicanteNome, setComunicanteNome] = useState('');
  const [comunicanteTelefone, setComunicanteTelefone] = useState('');
  const [vinculoEmpresa, setVinculoEmpresa] = useState<'Sim' | 'Não'>('Sim');
  const [cargoEmpresa, setCargoEmpresa] = useState('');
  const [sabeEmpresaResponsavel, setSabeEmpresaResponsavel] = useState<'Sim' | 'Não'>('Sim');

  // 3. Empresa Responsável & Produto
  const [empresaResponsavel, setEmpresaResponsavel] = useState('');
  const [cnpjEmpresa, setCnpjEmpresa] = useState('');
  const [substanciaSelecionada, setSubstanciaSelecionada] = useState(SUBSTANCIAS_QUIMICAS[2].nome);
  const [onu, setOnu] = useState(SUBSTANCIAS_QUIMICAS[2].onu);
  const [classeRisco, setClasseRisco] = useState(SUBSTANCIAS_QUIMICAS[2].classe);
  const [volumeVazado, setVolumeVazado] = useState('8.500 Litros');
  const [atingiuCorpoHidrico, setAtingiuCorpoHidrico] = useState<'SIM' | 'NÃO'>('SIM');
  const [nomeCorpoHidrico, setNomeCorpoHidrico] = useState('Riacho Água Fria');

  // 4. Localização & Áreas Atingidas (DOR003 - RN010, RN019, RN029)
  const [municipio, setMunicipio] = useState('Candeias');
  const [cep, setCep] = useState('43800-000');
  const [localidade, setLocalidade] = useState('Rodovia BA-522, Km 14');
  const [pontoReferencia, setPontoReferencia] = useState('Próximo ao trevo de acesso à Refinaria Mataripe');
  const [areasAtingidas, setAreasAtingidas] = useState<string[]>(['rodovia', 'hidrico']);
  const [erroAreas, setErroAreas] = useState<string | null>(null);
  const [latitude, setLatitude] = useState('-12.6719');
  const [longitude, setLongitude] = useState('-38.5442');

  // 5. Informações Adicionais Pós-Finalização (DOR003 - Bloco 9 / RN016)
  const [infosAdicionais, setInfosAdicionais] = useState<InfoAdicional[]>([
    {
      autor: 'Gestor Plantonista (DIFIS)',
      data: '16/09/2026 14:10',
      texto: 'Equipe da Ambipar confirmou o acionamento de contenção com barreira absorvente.'
    }
  ]);
  const [novaInfoTexto, setNovaInfoTexto] = useState('');

  // Modais de Controle
  const [isMsg002ModalOpen, setIsMsg002ModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
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

  const handleToggleArea = (id: string) => {
    if (registroFinalizado) return;
    setErroAreas(null);
    if (areasAtingidas.includes(id)) {
      setAreasAtingidas(areasAtingidas.filter((a) => a !== id));
    } else {
      // RN010: Bloqueio no máximo 3 áreas
      if (areasAtingidas.length >= 3) {
        setErroAreas('Bloqueio: Seleção máxima de 3 áreas atingidas atingida (RN010).');
        return;
      }
      setAreasAtingidas([...areasAtingidas, id]);
    }
  };

  const handlePreencherExemplo = () => {
    setOrigem('Call Center');
    setDataHoraComunicado(new Date().toISOString().slice(0, 16));
    setTipoEmergencia('Tombamento de Carga Perigosa em Rodovia');
    setSeveridade('Nível 3 (Crítico)');
    setComunicanteNome('Subtenente Lima (Corpo de Bombeiros Militar)');
    setComunicanteTelefone('(71) 98822-1930');
    setVinculoEmpresa('Não');
    setSabeEmpresaResponsavel('Sim');
    setEmpresaResponsavel('Petroquímica do Nordeste S.A.');
    setCnpjEmpresa('13.882.114/0001-92');
    handleSubstanciaChange('Ácido Sulfúrico');
    setVolumeVazado('14.000 Litros');
    setAtingiuCorpoHidrico('SIM');
    setNomeCorpoHidrico('Rio Jacuípe (Margem Direita)');
    setMunicipio('Candeias');
    setCep('43800-000');
    setLocalidade('BA-522, Km 18 - Sentido Polo Petroquímico');
    setPontoReferencia('Curva do Engenho, logo após o viaduto da ferrovia');
    setAreasAtingidas(['rodovia', 'hidrico', 'rural']);
    setLatitude('-12.671944');
    setLongitude('-38.544211');
  };

  const handleLimpar = () => {
    setComunicanteNome('');
    setComunicanteTelefone('');
    setEmpresaResponsavel('');
    setCnpjEmpresa('');
    setLocalidade('');
    setPontoReferencia('');
    setVolumeVazado('');
    setAreasAtingidas([]);
    setLatitude('');
    setLongitude('');
  };

  const handleSalvarRascunho = () => {
    setRascunhoSalvo(true);
    setTimeout(() => setRascunhoSalvo(false), 4000);
  };

  const handleFinalizar = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de Áreas Atingidas
    if (areasAtingidas.length === 0) {
      setErroAreas('Selecione pelo menos 1 área atingida (RN010).');
      return;
    }

    // MSG002: Sem coordenadas
    if (!latitude || !longitude) {
      setIsMsg002ModalOpen(true);
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmarEnvio = () => {
    setIsConfirmModalOpen(false);
    setIsMsg002ModalOpen(false);
    setProtocoloREGerado(numeroREProvisorio);
    setRegistroFinalizado(true);
    setIsSuccessModalOpen(true);
  };

  const handleAdicionarInfoAdicional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaInfoTexto.trim()) return;

    const agora = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR').slice(0, 5);
    setInfosAdicionais([
      ...infosAdicionais,
      {
        autor: 'Técnico Plantonista (Bruno Carvalho)',
        data: agora,
        texto: novaInfoTexto.trim()
      }
    ]);
    setNovaInfoTexto('');
  };

  const handleCopiarProtocolo = () => {
    navigator.clipboard.writeText(protocoloREGerado || numeroREProvisorio);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
      {/* Topo Oficial com Número Provisório NA ABERTURA (DOR003 - RN002 / CA002) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Cadastro de Emergência Química Interna (DOR003)
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Nº do Registro: {protocoloREGerado || numeroREProvisorio}</span>
            </div>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Atendimento emergencial a acidentes com produtos perigosos — Gestão DIFIS/INEMA.
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
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSalvarRascunho}
                className="gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs"
              >
                Salvar Rascunho
              </Button>
            </>
          )}

          {registroFinalizado && (
            <Badge color="success" dot className="text-xs py-1 px-3">
              Status: Emergência Registrada (RN004)
            </Badge>
          )}
        </div>
      </div>

      {rascunhoSalvo && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Rascunho de Emergência Química salvo! Equipe de plantão notificada preventivamente.</span>
        </div>
      )}

      {/* Formulário Principal */}
      <form onSubmit={handleFinalizar} className="space-y-6">
        {/* CARD 1: Detalhes do Comunicado e Origem (DOR003 - RN004) */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                  1
                </span>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Detalhes do Comunicado e Origem
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Origem do acionamento e canal de comunicação oficial (RN004).
                  </CardDescription>
                </div>
              </div>

              {/* Severidade Pills */}
              <div className="flex items-center gap-1.5">
                {(['Nível 1 (Médio)', 'Nível 2 (Alto)', 'Nível 3 (Crítico)'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    disabled={registroFinalizado}
                    onClick={() => setSeveridade(lvl)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                      severidade === lvl
                        ? lvl === 'Nível 3 (Crítico)'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : lvl === 'Nível 2 (Alto)'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    )}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Origem do Comunicado (RN004) <span className="text-rose-500">*</span>
              </label>
              <FilamentSelect
                value={origem}
                disabled={registroFinalizado}
                onChange={(val) => setOrigem(val)}
                options={[
                  'Call Center',
                  'E-mail',
                  'Ofício',
                  'Ouvidoria',
                  'Presencial',
                  'SEI',
                  'Telefone',
                  'Outros',
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Data e Hora do Comunicado <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={dataHoraComunicado}
                disabled={registroFinalizado}
                onChange={(e) => setDataHoraComunicado(e.target.value)}
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
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Descrição do Tipo da Emergência (RN024) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={descricaoTipoOutros}
                  disabled={registroFinalizado}
                  onChange={(e) => setDescricaoTipoOutros(e.target.value)}
                  required
                  placeholder="Especifique a tipologia detalhada do acidente químico..."
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* CARD 2: Identificação do Comunicante & Vínculo (DOR003 - RN025, RN026) */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                2
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Dados do Comunicante e Vínculo com a Empresa
                </CardTitle>
                <CardDescription className="text-xs">
                  Informações de contato e declaração de vínculo institucional (DOR003).
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nome do Comunicante <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={comunicanteNome}
                disabled={registroFinalizado}
                onChange={(e) => setComunicanteNome(e.target.value)}
                required
                placeholder="Nome de quem prestou a informação"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Telefone de Contato (máscara dinâmica) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={comunicanteTelefone}
                disabled={registroFinalizado}
                onChange={(e) => setComunicanteTelefone(e.target.value)}
                required
                placeholder="(71) 90000-0000 ou (71) 3000-0000"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Possui vínculo com a empresa responsável? <span className="text-rose-500">*</span>
              </label>
              <FilamentSelect
                value={vinculoEmpresa}
                disabled={registroFinalizado}
                onChange={(val) => setVinculoEmpresa(val as any)}
                options={[
                  { value: 'Sim', label: 'Sim (Funcionário / Prestador)' },
                  { value: 'Não', label: 'Não (Cidadão / Força Policial)' },
                ]}
              />
            </div>

            {vinculoEmpresa === 'Sim' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cargo / Função na Empresa
                </label>
                <input
                  type="text"
                  value={cargoEmpresa}
                  disabled={registroFinalizado}
                  onChange={(e) => setCargoEmpresa(e.target.value)}
                  placeholder="Ex: Supervisor de Segurança / Motorista"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            )}

            {vinculoEmpresa === 'Não' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Sabe informar o nome da empresa responsável? (RN026)
                </label>
                <FilamentSelect
                  value={sabeEmpresaResponsavel}
                  disabled={registroFinalizado}
                  onChange={(val) => setSabeEmpresaResponsavel(val as any)}
                  options={['Sim', 'Não']}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* CARD 3: Caracterização Química & Empresa */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                3
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Substância Envolvida e Empresa Responsável
                </CardTitle>
                <CardDescription className="text-xs">
                  Dados de ONU, risco químico e volume derramado.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Empresa Responsável / Transportadora
              </label>
              <input
                type="text"
                value={empresaResponsavel}
                disabled={registroFinalizado}
                onChange={(e) => setEmpresaResponsavel(e.target.value)}
                placeholder="Razão Social ou Nome Fantasia"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                CNPJ da Empresa
              </label>
              <input
                type="text"
                value={cnpjEmpresa}
                disabled={registroFinalizado}
                onChange={(e) => setCnpjEmpresa(e.target.value)}
                placeholder="00.000.000/0000-00"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Produto Químico / Substância <span className="text-rose-500">*</span>
              </label>
              <FilamentSelect
                value={substanciaSelecionada}
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
                Classe de Risco (ONU)
              </label>
              <input
                type="text"
                value={classeRisco}
                readOnly
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3 py-2.5 text-slate-700 dark:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Volume Estimado Derramado <span className="text-rose-500">*</span>
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
          </CardContent>
        </Card>

        {/* CARD 4: Localização e Áreas Atingidas (RN010, RN029) */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                4
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Localização e Áreas Atingidas
                </CardTitle>
                <CardDescription className="text-xs">
                  Município, logradouro, coordenadas e restrição de até 3 áreas afetadas (RN010).
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
                  CEP (autocompletar Correios)
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
                  Rodovia / KM ou Logradouro <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={localidade}
                  disabled={registroFinalizado}
                  onChange={(e) => setLocalidade(e.target.value)}
                  required
                  placeholder="Ex: BR-324, KM 585"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>

            {/* Áreas Atingidas: Máximo 3 opções (RN010) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Áreas Atingidas (RN010) <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Selecione no máximo 3 áreas afetadas pelo sinistro químico.
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
                {AREAS_ATINGIDAS_OPCOES.map((area) => {
                  const isChecked = areasAtingidas.includes(area.id);
                  return (
                    <button
                      key={area.id}
                      type="button"
                      disabled={registroFinalizado}
                      onClick={() => handleToggleArea(area.id)}
                      title={area.tooltip}
                      className={cn(
                        "p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer",
                        isChecked
                          ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-900 dark:text-blue-200 shadow-2xs font-semibold"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300"
                      )}
                    >
                      <span className="text-xs">{area.label}</span>
                      {area.tooltip && (
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coordenadas Geográficas */}
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
                  placeholder="-12.6719"
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
                  placeholder="-38.5442"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>
          </CardContent>

          {!registroFinalizado && (
            <CardFooter className="pt-4 pb-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                A finalização atribui automaticamente o status de <strong>Emergência Registrada</strong>.
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSalvarRascunho}
                  className="text-xs font-semibold"
                >
                  Salvar Rascunho
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="font-bold text-xs shadow-sm px-6 bg-rose-600 hover:bg-rose-700"
                >
                  Finalizar Registro de Emergência (MSG003)
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </form>

      {/* BLOCO 9: Informações Adicionais Pós-Finalização (DOR003 - Bloco 9 / RN016) */}
      {registroFinalizado && (
        <Card className="border-slate-200/90 dark:border-slate-800 animate-in fade-in">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Informações Adicionais do Plantão (Bloco 9 / RN016)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Adicione notas operacionais e andamento das providências sem alterar a descrição original.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            {/* Lista de notas acumuladas */}
            <div className="space-y-2.5">
              {infosAdicionais.map((info, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span>{info.autor}</span>
                    <span>{info.data}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{info.texto}</p>
                </div>
              ))}
            </div>

            {/* Inserir nova nota */}
            <form onSubmit={handleAdicionarInfoAdicional} className="pt-2 flex gap-3">
              <input
                type="text"
                value={novaInfoTexto}
                onChange={(e) => setNovaInfoTexto(e.target.value)}
                placeholder="Inserir nota técnica adicional sobre a resposta ao sinistro..."
                className="flex-1 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 outline-none"
              />
              <Button type="submit" variant="primary" size="sm" className="gap-1 text-xs">
                <Send className="w-3.5 h-3.5" />
                Adicionar
              </Button>
            </form>
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
              A ausência de coordenadas em área rural ou rodovia compromete a mobilização imediata das forças de resposta a emergências químicas. Deseja prosseguir sem coordenadas?
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

      {/* Modal MSG003: Confirmação de Finalização */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
              Finalizar Emergência Química (MSG003)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
              Deseja finalizar o registro de emergência química? O status será alterado para <strong>Emergência Registrada</strong> e os plantonistas receberão notificação imediata.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-xs space-y-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <p><strong>Nº Provisório:</strong> {numeroREProvisorio}</p>
            <p><strong>Município:</strong> {municipio}</p>
            <p><strong>Produto:</strong> {substanciaSelecionada} (ONU {onu})</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsConfirmModalOpen(false)}>
              Revisar Dados
            </Button>
            <Button
              size="sm"
              variant="primary"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleConfirmarEnvio}
            >
              Sim, Finalizar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal MSG004: Sucesso de Finalização */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-lg text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-2 shadow-sm">
            <Flame className="w-8 h-8" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Emergência Registrada com Sucesso! (MSG004)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Registro formal autuado e pauta de plantão acionada com prioridade operacional.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 my-2 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-center space-y-2">
            <span className="text-[11px] uppercase font-bold text-rose-800 dark:text-rose-300 tracking-wider">
              Número Oficial do Registro de Emergência (RE)
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
            {copiado && <p className="text-[10px] text-rose-600 font-semibold">Número do RE copiado com sucesso!</p>}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsSuccessModalOpen(false);
                onNavigate?.('consulta-interna');
              }}
            >
              Voltar à Consulta de Registros
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Manter no Registro (Modo Leitura)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
