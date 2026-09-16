import React, { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  MapPin,
  User,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Wand2,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink,
  Info
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
import { MUNICIPIOS_BAHIA } from '@/data/fiscalizacaoMock';
import { useTheme } from '@/context/ThemeContext';

interface CoordenadaItem {
  id: string;
  tipo: string;
  lat: string;
  lng: string;
}

export const DenunciaInternaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();

  // Seção 1: Detalhes do Registro
  const [origem, setOrigem] = useState('');
  const [orgaoInterveniente, setOrgaoInterveniente] = useState('');
  const [numeroOriginal, setNumeroOriginal] = useState('');
  const [dataHoraComunicado, setDataHoraComunicado] = useState(
    new Date().toISOString().slice(0, 16)
  );

  // Seção 2: Ocorrência
  const [dataInicio, setDataInicio] = useState('2026-09-15');
  const [dataFim, setDataFim] = useState('2026-09-16');
  const [tipologiaDano, setTipologiaDano] = useState('Desmatamento não autorizado');
  const [descricao, setDescricao] = useState('');
  const [arquivos, setArquivos] = useState<{ nome: string; tamanho: string }[]>([]);

  // Seção 3: Localização
  const [municipio, setMunicipio] = useState('Salvador');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [pontoReferencia, setPontoReferencia] = useState('');
  const [complementoLocal, setComplementoLocal] = useState('');
  const [coordenadas, setCoordenadas] = useState<CoordenadaItem[]>([
    { id: '1', tipo: 'Geográfica / Grau Decimal', lat: '-12.9714', lng: '-38.5014' }
  ]);
  const [novaCoordTipo, setNovaCoordTipo] = useState('Geográfica / Grau Decimal');
  const [novaCoordLat, setNovaCoordLat] = useState('');
  const [novaCoordLng, setNovaCoordLng] = useState('');

  // Seção 4: Denunciante
  const [identificado, setIdentificado] = useState<'SIM' | 'NÃO'>('NÃO');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [nomeDenunciante, setNomeDenunciante] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Modais de Controle
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [numeroRDGerado, setNumeroRDGerado] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [rascunhoSalvo, setRascunhoSalvo] = useState(false);

  // Preencher Exemplo
  const handlePreencherExemplo = () => {
    setOrigem('Ouvidoria');
    setNumeroOriginal('OUV-BA-2026-9812');
    setDataHoraComunicado(new Date().toISOString().slice(0, 16));
    setDataInicio('2026-09-12');
    setDataFim('2026-09-15');
    setTipologiaDano('Desmatamento não autorizado');
    setDescricao(
      'Constatada derrubada de vegetação nativa com trator de esteira em área de mata ciliar adjacente a nascente. Há indícios de loteamento clandestino com abertura de picadas e queima de resíduos florestais.'
    );
    setArquivos([
      { nome: 'fotos_vistoria_preliminar.pdf', tamanho: '4.2 MB' },
      { nome: 'coordenadas_gleba_cerrado.kml', tamanho: '180 KB' }
    ]);
    setMunicipio('Barreiras');
    setCep('47800-000');
    setEndereco('Estrada Velha de Angical, Km 14');
    setBairro('Zona Rural - Bacia do Rio Branco');
    setPontoReferencia('Próximo à ponte de madeira sobre o Riacho Fundo, entrada à direita da cerca branca.');
    setComplementoLocal('Área de Preservação Permanente (APP)');
    setCoordenadas([
      { id: '1', tipo: 'Geográfica / Grau Decimal', lat: '-12.145821', lng: '-45.002341' }
    ]);
    setIdentificado('SIM');
    setCpfCnpj('029.481.935-12');
    setNomeDenunciante('Marcos Vinícius Guimarães');
    setTelefone('(77) 99812-4402');
    setEmail('marcos.guimaraes@agrotech.ba.gov.br');
  };

  const handleLimpar = () => {
    setOrigem('');
    setOrgaoInterveniente('');
    setNumeroOriginal('');
    setDescricao('');
    setArquivos([]);
    setEndereco('');
    setBairro('');
    setPontoReferencia('');
    setCep('');
    setComplementoLocal('');
    setIdentificado('NÃO');
    setCpfCnpj('');
    setNomeDenunciante('');
    setTelefone('');
    setEmail('');
  };

  const handleAddCoordenada = () => {
    if (!novaCoordLat || !novaCoordLng) return;
    setCoordenadas((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        tipo: novaCoordTipo,
        lat: novaCoordLat,
        lng: novaCoordLng
      }
    ]);
    setNovaCoordLat('');
    setNovaCoordLng('');
  };

  const handleRemoveCoordenada = (id: string) => {
    setCoordenadas((prev) => prev.filter((c) => c.id !== id));
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
    const num = `2026.${seq}/INEMA/RD`;
    setNumeroRDGerado(num);
    setIsSuccessModalOpen(true);
  };

  const handleCopiarProtocolo = () => {
    navigator.clipboard.writeText(numeroRDGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
      {/* Topo Oficial (Breadcrumb está exclusivamente na Topbar) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Cadastro de Denúncia Ambiental (DOR001)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Módulo de atendimento interno para triagem e autuação de comunicados ambientais.
          </p>
        </div>

        {/* Ações de Topo */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
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
            className="gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs"
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
        </div>
      </div>

      {/* Alerta de Rascunho Salvo */}
      {rascunhoSalvo && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Rascunho salvo com sucesso! As informações permanecerão retidas por 24 horas no sistema.</span>
        </div>
      )}

      {/* Formulário Principal */}
      <form onSubmit={handleFinalizar} className="space-y-6">
        {/* CARD 1: Detalhes do Registro */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                  1
                </span>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Detalhes do Registro
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Canais formais de entrada e dados do comunicado recebido pelo INEMA.
                  </CardDescription>
                </div>
              </div>
              <Badge variant="emerald" dot>
                Nº Previsto: 2026.XXXXXX/INEMA/RD
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Origem do Comunicado <span className="text-rose-500">*</span>
              </label>
              <select
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              >
                <option value="">Selecione a origem...</option>
                <option value="Call center">Call center</option>
                <option value="Correspondência">Correspondência</option>
                <option value="E-mail">E-mail</option>
                <option value="Ofício">Ofício</option>
                <option value="Ouvidoria">Ouvidoria</option>
                <option value="Presencial">Presencial</option>
                <option value="SEI">SEI</option>
                <option value="Telefone">Telefone</option>
              </select>
            </div>

            {origem === 'Ofício' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Órgão Interveniente <span className="text-rose-500">*</span>
                </label>
                <select
                  value={orgaoInterveniente}
                  onChange={(e) => setOrgaoInterveniente(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                >
                  <option value="">Selecione o órgão...</option>
                  <option value="IBAMA">IBAMA</option>
                  <option value="Ministério Público Estadual (MP-BA)">Ministério Público Estadual (MP-BA)</option>
                  <option value="Polícia Militar / COPPA">Polícia Militar / COPPA</option>
                  <option value="Polícia Rodoviária Federal">Polícia Rodoviária Federal</option>
                  <option value="Prefeitura Municipal">Prefeitura Municipal</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Número Original do Documento {origem === 'Ofício' && <span className="text-rose-500">*</span>}
              </label>
              <input
                type="text"
                value={numeroOriginal}
                onChange={(e) => setNumeroOriginal(e.target.value)}
                placeholder="Ex: OF-2026/0491 ou OUV-9812"
                required={origem === 'Ofício'}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
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
          </CardContent>
        </Card>

        {/* CARD 2: Ocorrência */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                2
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Ocorrência Ambiental
                </CardTitle>
                <CardDescription className="text-xs">
                  Tipologia do dano, datas de constatação, narrativa dos fatos e evidências.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Data Inicial da Ocorrência <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Data Final (se contínua)
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipologia Principal da Infração <span className="text-rose-500">*</span>
                </label>
                <select
                  value={tipologiaDano}
                  onChange={(e) => setTipologiaDano(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                >
                  <option value="Desmatamento não autorizado">Desmatamento não autorizado</option>
                  <option value="Poluição Hídrica / Lançamento de Efluentes">Poluição Hídrica / Lançamento de Efluentes</option>
                  <option value="Queimada irregular ou Incêndio Florestal">Queimada irregular ou Incêndio Florestal</option>
                  <option value="Cativeiro ou Tráfico de Fauna Silvestre">Cativeiro ou Tráfico de Fauna Silvestre</option>
                  <option value="Intervenção em Área de Preservação Permanente (APP)">Intervenção em APP / Manguezal</option>
                  <option value="Mineração sem licença ambiental">Mineração sem licença ambiental</option>
                  <option value="Poluição do Ar / Emissões Clandestinas">Poluição do Ar / Emissões Clandestinas</option>
                  <option value="Descarte irregular de Resíduos Perigosos">Descarte irregular de Resíduos Perigosos</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Descrição Circunstanciada dos Fatos <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {descricao.length} / 7.000 caracteres
                </span>
              </div>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                maxLength={7000}
                required
                rows={4}
                placeholder="Descreva minuciosamente o que foi presenciado, autores presumíveis, dimensões da área afetada, equipamentos utilizados e danos visíveis..."
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none leading-relaxed"
              />
            </div>

            {/* Anexos e Evidências */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Anexos e Evidências (.pdf, .jpg, .png, .mp4, .kml, .kmz, .zip)
              </label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center hover:border-emerald-500 dark:hover:border-emerald-600 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                <UploadCloud className="w-8 h-8 mx-auto text-emerald-700 dark:text-emerald-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Limite máximo de 50MB por arquivo. Fotos geolocalizadas facilitam a fiscalização.
                </p>
              </div>

              {arquivos.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {arquivos.map((arq, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs border border-slate-200/80 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">{arq.nome}</span>
                        <span className="text-[10px] text-slate-400">({arq.tamanho})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setArquivos((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CARD 3: Localização */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                3
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Localização Geográfica
                </CardTitle>
                <CardDescription className="text-xs">
                  Município, logradouro, coordenadas geográficas e referências terrestres.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Município da Bahia <span className="text-rose-500">*</span>
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  CEP (opcional)
                </label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Bairro / Distrito / Povoado
                </label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Ex: Zona Rural / Povoado de Lagoa Clara"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Endereço / Logradouro / Estrada <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                  placeholder="Ex: Rodovia BA-099, Km 42 ou Rua das Palmeiras, nº 10"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ponto de Referência <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={pontoReferencia}
                  onChange={(e) => setPontoReferencia(e.target.value)}
                  required
                  placeholder="Ex: Atrás da cerâmica São Francisco, entrada à esquerda da ponte"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* Coordenadas Geográficas */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Coordenadas Geográficas (Permite múltiplos pontos)
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">RN008: Aceita valor zero se rural</span>
              </div>

              {/* Lista de Coordenadas */}
              {coordenadas.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 text-xs border border-slate-200 dark:border-slate-700"
                >
                  <span className="text-slate-600 dark:text-slate-300 font-mono">
                    [{c.tipo}] Lat: <strong>{c.lat}</strong> | Lng: <strong>{c.lng}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCoordenada(c.id)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Inserção de nova coordenada */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                <div>
                  <select
                    value={novaCoordTipo}
                    onChange={(e) => setNovaCoordTipo(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="Geográfica / Grau Decimal">Geográfica / Grau Decimal</option>
                    <option value="Grau / Minuto / Segundo (GMS)">GMS</option>
                    <option value="UTM 23">UTM 23</option>
                    <option value="UTM 24">UTM 24</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    value={novaCoordLat}
                    onChange={(e) => setNovaCoordLat(e.target.value)}
                    placeholder="Latitude (ex: -12.9714)"
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-slate-800 dark:text-slate-100 outline-none font-mono"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={novaCoordLng}
                    onChange={(e) => setNovaCoordLng(e.target.value)}
                    placeholder="Longitude (ex: -38.5014)"
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-slate-800 dark:text-slate-100 outline-none font-mono"
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCoordenada}
                    className="w-full text-xs gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD 4: Denunciante */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center shadow-2xs">
                  4
                </span>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Identificação do Denunciante
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Opção de sigilo garantida pela Lei de Acesso à Informação (LAI).
                  </CardDescription>
                </div>
              </div>

              {/* Toggle Identificado */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIdentificado('NÃO')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    identificado === 'NÃO'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Anônimo
                </button>
                <button
                  type="button"
                  onClick={() => setIdentificado('SIM')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    identificado === 'SIM'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Identificado
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5">
            {identificado === 'NÃO' ? (
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  <strong>Garantia de Anonimato:</strong> A denúncia foi assinalada como anônima. Os dados do
                  denunciante não constarão em nenhum relatório público ou despacho técnico. A fiscalização
                  apurará os fatos com base exclusiva nas coordenadas e descrição fornecidas.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    CPF / CNPJ
                  </label>
                  <input
                    type="text"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nome Completo / Razão Social <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nomeDenunciante}
                    onChange={(e) => setNomeDenunciante(e.target.value)}
                    required
                    placeholder="Nome do denunciante"
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Telefone / Celular <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                    placeholder="(00) 00000-0000"
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    E-mail para Acompanhamento
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="denunciante@exemplo.com"
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-4 pb-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Ao finalizar, um número oficial de Registro de Denúncia (RD) será gerado.
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
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm px-6"
              >
                Finalizar e Tramitar Denúncia
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>

      {/* Modal de Confirmação de Finalização */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Confirmar Finalização de Denúncia
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
              Após a confirmação, o Registro de Denúncia (RD) será emitido formalmente e encaminhado
              à pauta da Diretoria de Fiscalização (DIFIS). Não será possível alterar os dados principais após o envio.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
            <p><strong>Município:</strong> {municipio}</p>
            <p><strong>Tipologia:</strong> {tipologiaDano}</p>
            <p><strong>Denunciante:</strong> {identificado === 'SIM' ? nomeDenunciante : 'Anônimo (Sigilo Total)'}</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsConfirmModalOpen(false)}>
              Revisar Dados
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmarEnvio}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Confirmar e Gerar RD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Sucesso */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-lg text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center mb-2 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Denúncia Cadastrada com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              O comunicado foi protocolado e encaminhado automaticamente para triagem da equipe técnica DIFIS.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 my-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <span className="text-[11px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
              Número Oficial do Protocolo (RD)
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl md:text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
                {numeroRDGerado}
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
            {copiado && <p className="text-[10px] text-emerald-600 font-semibold">Protocolo copiado para a área de transferência!</p>}
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
              Novo Cadastro
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsSuccessModalOpen(false);
                onNavigate?.('consulta-interna');
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Ver na Pauta DIFIS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
