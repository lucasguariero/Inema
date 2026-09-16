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
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  FileCheck
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

export const EmergenciaExternaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();

  // Dados do Comunicante / Empresa
  const [razaoSocial, setRazaoSocial] = useState('Petrobras Distribuidora / Transpetro');
  const [cnpj, setCnpj] = useState('33.000.167/0001-01');
  const [nomeContato, setNomeContato] = useState('Rodrigo Alencar');
  const [telefone24h, setTelefone24h] = useState('(71) 98144-8800');
  const [email, setEmail] = useState('plantao.emergencia@empresa.com.br');

  // Dados do Acidente
  const [dataHoraAcidente, setDataHoraAcidente] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [tipoModal, setTipoModal] = useState('Transporte Rodoviário (Caminhão/Carreta)');
  const [placas, setPlacas] = useState('OKY-3921 / Tanque');

  // Produto Químico
  const [substancia, setSubstancia] = useState(SUBSTANCIAS_QUIMICAS[0].nome);
  const [onu, setOnu] = useState(SUBSTANCIAS_QUIMICAS[0].onu);
  const [volumeVazado, setVolumeVazado] = useState('5.000 Litros');
  const [houveVazamentoAgua, setHouveVazamentoAgua] = useState<'SIM' | 'NÃO'>('NÃO');

  // Localização
  const [municipio, setMunicipio] = useState('Simões Filho');
  const [localidade, setLocalidade] = useState('BR-324, Km 598 - Sentido Salvador');
  const [pontoReferencia, setPontoReferencia] = useState('Próximo ao pedágio da Viabahia');
  const [empresaResposta, setEmpresaResposta] = useState('Ambipar Response (Acionada no local)');

  // Modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [protocoloGerado, setProtocoloGerado] = useState('');
  const [copiado, setCopiado] = useState(false);

  const handleSubstanciaChange = (nome: string) => {
    setSubstancia(nome);
    const found = SUBSTANCIAS_QUIMICAS.find((s) => s.nome === nome);
    if (found) setOnu(found.onu);
  };

  const handlePreencherExemplo = () => {
    setRazaoSocial('Bahia Química Logística Integrada S.A.');
    setCnpj('08.441.921/0001-34');
    setNomeContato('Eng. Marcelo Fonseca');
    setTelefone24h('(71) 99123-5566');
    setEmail('emergencias@bahiaquimica.com.br');
    setDataHoraAcidente(new Date().toISOString().slice(0, 16));
    setTipoModal('Transporte Rodoviário (Caminhão/Carreta)');
    setPlacas('PLQ-4B12 / Carreta RQK-1190');
    handleSubstanciaChange('Gasolina Comum / Aditivada');
    setVolumeVazado('4.200 Litros');
    setHouveVazamentoAgua('NÃO');
    setMunicipio('Simões Filho');
    setLocalidade('BR-324, Km 602 - Perto da entrada do CIA Sul');
    setPontoReferencia('Acostamento logo após a passarela de pedestres');
    setEmpresaResposta('WGRA Gerenciamento de Riscos Ambientais');
  };

  const handleLimpar = () => {
    setRazaoSocial('');
    setCnpj('');
    setNomeContato('');
    setTelefone24h('');
    setLocalidade('');
    setPontoReferencia('');
    setVolumeVazado('');
  };

  const handleFinalizar = (e: React.FormEvent) => {
    e.preventDefault();
    const seq = Math.floor(100000 + Math.random() * 900000);
    const num = `2026.${seq}/INEMA/RE`;
    setProtocoloGerado(num);
    setIsSuccessModalOpen(true);
  };

  const handleCopiarProtocolo = () => {
    navigator.clipboard.writeText(protocoloGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Topo & Breadcrumb */}
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="hover:text-emerald-700 cursor-pointer" onClick={() => onNavigate?.('relatorios')}>
            Início
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Fiscalização Externa</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Emergências Químicas</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Registro Externo (DOR004)</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center justify-center shadow-2xs">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Comunicação de Emergência Química (DOR004)
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Canal oficial para empresas transportadoras, indústrias e operadores comunicarem acidentes com produtos químicos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>

      {/* Alerta de Obrigatoriedade Legal */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
          <strong>Aviso Regulatório Obrigatório:</strong> De acordo com a Lei Estadual nº 10.431/06 e regulamentações do
          CEPRAM, acidentes ambientais com produtos químicos perigosos devem ser informados <strong>imediatamente</strong> ao
          INEMA. A omissão de comunicação sujeita a empresa infratora a sanções gravíssimas e agravamento de multas.
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleFinalizar} className="space-y-6">
        {/* Bloco 1: Dados da Empresa Comunicante */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              1. Identificação da Empresa e Contato de Plantão
            </CardTitle>
            <CardDescription className="text-xs">
              Dados da transportadora ou geradora do produto para contato imediato pelos técnicos do INEMA.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Razão Social da Empresa Responsável <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                CNPJ da Empresa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                required
                placeholder="00.000.000/0000-00"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nome do Responsável / Plantonista <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nomeContato}
                onChange={(e) => setNomeContato(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Telefone de Emergência 24h <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={telefone24h}
                onChange={(e) => setTelefone24h(e.target.value)}
                required
                placeholder="(00) 00000-0000"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                E-mail Corporativo <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bloco 2: Produto e Acidente */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              2. Caracterização do Acidente e Produto Químico
            </CardTitle>
            <CardDescription className="text-xs">
              Detalhes técnicos da carga perigosa e momento da ocorrência.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Data e Hora do Acidente <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={dataHoraAcidente}
                  onChange={(e) => setDataHoraAcidente(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Modal de Transporte
                </label>
                <select
                  value={tipoModal}
                  onChange={(e) => setTipoModal(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="Transporte Rodoviário (Caminhão/Carreta)">Transporte Rodoviário (Caminhão/Carreta)</option>
                  <option value="Indústria / Planta Fabril">Indústria / Planta Fabril</option>
                  <option value="Duto / Oleoduto / Gasoduto">Duto / Oleoduto / Gasoduto</option>
                  <option value="Transporte Aquaviário / Porto">Transporte Aquaviário / Porto</option>
                  <option value="Ferroviário">Ferroviário</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Identificação do Veículo / Placas
                </label>
                <input
                  type="text"
                  value={placas}
                  onChange={(e) => setPlacas(e.target.value)}
                  placeholder="Ex: ABC-1234 / Tanque 02"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Substância Química Transportada <span className="text-rose-500">*</span>
                </label>
                <select
                  value={substancia}
                  onChange={(e) => handleSubstanciaChange(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none font-medium"
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
                  Volume Estimado Liberado <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={volumeVazado}
                  onChange={(e) => setVolumeVazado(e.target.value)}
                  required
                  placeholder="Ex: 2.000 Litros"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none font-bold text-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Atingiu Curso d'Água?
                </label>
                <select
                  value={houveVazamentoAgua}
                  onChange={(e) => setHouveVazamentoAgua(e.target.value as 'SIM' | 'NÃO')}
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="NÃO">NÃO (Solo / Asfalto)</option>
                  <option value="SIM">SIM (Rio / Lagoa / Galeria)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bloco 3: Local do Acidente e Resposta */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              3. Local do Acidente & Empresa de Contenção Emergencial
            </CardTitle>
            <CardDescription className="text-xs">
              Localização exata para deslocamento da equipe pericial do INEMA.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Município da Bahia <span className="text-rose-500">*</span>
                </label>
                <select
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
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
                  Rodovia, Km ou Logradouro <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={localidade}
                  onChange={(e) => setLocalidade(e.target.value)}
                  required
                  placeholder="Ex: BR-324, Km 598"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ponto de Referência <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={pontoReferencia}
                  onChange={(e) => setPontoReferencia(e.target.value)}
                  required
                  placeholder="Ex: Próximo à praça de pedágio ou posto de gasolina"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Empresa Especializada de Resposta Acionada
                </label>
                <input
                  type="text"
                  value={empresaResposta}
                  onChange={(e) => setEmpresaResposta(e.target.value)}
                  placeholder="Ex: Ambipar, WGRA, SOS Emergências..."
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4 pb-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              A emissão deste formulário formaliza a comunicação prevista em lei.
            </span>
            <Button
              type="submit"
              className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm px-7"
            >
              Emitir Comunicação de Emergência (RE)
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Modal de Sucesso */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-lg text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 mx-auto flex items-center justify-center mb-2 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Comunicação Protocolada com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              O INEMA foi notificado oficialmente. Guarde o número de protocolo abaixo para apresentação aos fiscais.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 my-2 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-center space-y-2">
            <span className="text-[11px] uppercase font-bold text-rose-800 dark:text-rose-300 tracking-wider">
              Número de Protocolo Oficial (RE)
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
            {copiado && <p className="text-[10px] text-emerald-600 font-semibold">Copiado com sucesso!</p>}
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
              Nova Comunicação
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsSuccessModalOpen(false);
                onNavigate?.('consulta-externa');
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Acompanhar no Portal Cidadão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
