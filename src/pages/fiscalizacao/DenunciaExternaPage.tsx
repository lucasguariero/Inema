import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  Camera,
  CheckCircle2,
  Lock,
  UserCheck,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Navigation,
  FileCheck2,
  TreePine,
  Waves,
  Flame,
  Bird,
  Factory,
  HelpCircle,
  UploadCloud,
  X
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

const CATEGORIAS_DENUNCIA = [
  { id: 'desmatamento', label: 'Derrubada de Árvores / Desmatamento', icon: TreePine, desc: 'Corte de mata nativa, motosserras em áreas protegidas' },
  { id: 'poluicao_hidrica', label: 'Rio, Mar ou Lagoa Poluídos', icon: Waves, desc: 'Esgoto clandestino, manchas de óleo, lixo em mananciais' },
  { id: 'queimada', label: 'Queimadas e Fogo em Vegetação', icon: Flame, desc: 'Incêndio em mata, queima de pastagem ou lixo a céu aberto' },
  { id: 'animais', label: 'Tráfico ou Maus Tratos a Animais', icon: Bird, desc: 'Pássaros e bichos silvestres engaiolados para venda' },
  { id: 'industria', label: 'Fumaça ou Poluição Industrial', icon: Factory, desc: 'Odores fortes, chaminés sem filtro, resíduos tóxicos' },
  { id: 'outros', label: 'Outras Agressões Ambientais', icon: HelpCircle, desc: 'Mineração ilegal, aterro clandestino em praia ou dunas' }
];

export const DenunciaExternaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();

  // Modo de Identificação
  const [modalEscolhaTipo, setModalEscolhaTipo] = useState(false);
  const [tipoEnvio, setTipoEnvio] = useState<'anonima' | 'identificada'>('anonima');

  // Dados do Cidadão (se identificado)
  const [nomeCidadao, setNomeCidadao] = useState('Mariana Costa dos Santos');
  const [cpfCidadao, setCpfCidadao] = useState('718.332.905-44');
  const [emailCidadao, setEmailCidadao] = useState('mariana.costa@email.com');
  const [telefoneCidadao, setTelefoneCidadao] = useState('(71) 98712-3344');

  // Campos da Ocorrência
  const [categoria, setCategoria] = useState('desmatamento');
  const [quandoOcorreu, setQuandoOcorreu] = useState('Esta semana');
  const [descricao, setDescricao] = useState('');
  const [municipio, setMunicipio] = useState('Camaçari');
  const [localizacaoTexto, setLocalizacaoTexto] = useState('');
  const [pontoReferencia, setPontoReferencia] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [gpsAtivo, setGpsAtivo] = useState(false);
  const [fotos, setFotos] = useState<{ nome: string; tamanho: string }[]>([]);

  // Modais de Resultado
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [protocoloGerado, setProtocoloGerado] = useState('');
  const [copiado, setCopiado] = useState(false);

  // Preencher Exemplo
  const handlePreencherExemplo = () => {
    setTipoEnvio('identificada');
    setCategoria('poluicao_hidrica');
    setQuandoOcorreu('Ontem');
    setDescricao(
      'Forte odor químico e descarte contínuo de líquido escuro e oleoso saindo de tubulação irregular diretamente na foz do Rio Jacuípe. Peixes mortos avistados na margem.'
    );
    setMunicipio('Camaçari');
    setLocalizacaoTexto('Próximo à foz do Rio Jacuípe, acesso pela via lateral da ponte');
    setPontoReferencia('Atrás da associação de pescadores, perto do píer de madeira');
    setLatitude('-12.701294');
    setLongitude('-38.152841');
    setGpsAtivo(true);
    setFotos([
      { nome: 'foto_mancha_oleosa_rio.jpg', tamanho: '2.4 MB' },
      { nome: 'video_tubulacao_efluente.mp4', tamanho: '14.8 MB' }
    ]);
  };

  const handleLimpar = () => {
    setDescricao('');
    setLocalizacaoTexto('');
    setPontoReferencia('');
    setLatitude('');
    setLongitude('');
    setGpsAtivo(false);
    setFotos([]);
  };

  const handlePegarGps = () => {
    setGpsAtivo(true);
    // Coordenada simulada de alta precisão
    setLatitude('-12.698421');
    setLongitude('-38.150912');
  };

  const handleFinalizar = (e: React.FormEvent) => {
    e.preventDefault();
    const seq = Math.floor(100000 + Math.random() * 900000);
    const prot = `2026.${seq}/INEMA/RD`;
    setProtocoloGerado(prot);
    setIsSuccessModalOpen(true);
  };

  const handleCopiarProtocolo = () => {
    navigator.clipboard.writeText(protocoloGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Breadcrumb & Topo */}
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="hover:text-emerald-700 cursor-pointer" onClick={() => onNavigate?.('relatorios')}>
            Início
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Portal do Cidadão</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Denúncias</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Formulário Cidadão (DOR002)</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Canal de Denúncia Ambiental Cidadã
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Registre agressões ao meio ambiente no Estado da Bahia de forma rápida, segura e com opção de sigilo total.
            </p>
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

      {/* Escolha do Tipo de Denúncia (Banner Interativo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => setTipoEnvio('anonima')}
          className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
            tipoEnvio === 'anonima'
              ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              tipoEnvio === 'anonima'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Denúncia Anônima</h3>
              {tipoEnvio === 'anonima' && <Badge variant="emerald">Selecionado</Badge>}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Nenhum dado pessoal é solicitado ou registrado. Garantia legal de anonimato absoluto.
            </p>
          </div>
        </div>

        <div
          onClick={() => setTipoEnvio('identificada')}
          className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
            tipoEnvio === 'identificada'
              ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              tipoEnvio === 'identificada'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Denúncia Identificada (Gov.br)</h3>
              {tipoEnvio === 'identificada' && <Badge variant="emerald">Selecionado</Badge>}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Permite acompanhar o andamento da fiscalização por e-mail e acessar despachos do processo.
            </p>
          </div>
        </div>
      </div>

      {/* Se identificado: Dados do Cidadão Autenticado */}
      {tipoEnvio === 'identificada' && (
        <Card className="border-emerald-200/80 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/20">
          <CardHeader className="py-3.5 px-5 border-b border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                Autenticado via Gov.br (Dados Importados)
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Nome do Cidadão</span>
              <strong className="text-slate-800 dark:text-slate-200">{nomeCidadao}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">CPF</span>
              <strong className="text-slate-800 dark:text-slate-200">{cpfCidadao}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">E-mail</span>
              <strong className="text-slate-800 dark:text-slate-200">{emailCidadao}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Telefone</span>
              <strong className="text-slate-800 dark:text-slate-200">{telefoneCidadao}</strong>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário Cidadão */}
      <form onSubmit={handleFinalizar} className="space-y-6">
        {/* Escolha do Tipo de Ocorrência */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              1. O que você gostaria de denunciar?
            </CardTitle>
            <CardDescription className="text-xs">
              Selecione a categoria que melhor representa a infração que você presenciou.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATEGORIAS_DENUNCIA.map((cat) => {
                const Icon = cat.icon;
                const isSelected = categoria === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoria(cat.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/60 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {cat.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight pl-1">
                      {cat.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detalhes e Descrição */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              2. Detalhes da Ocorrência
            </CardTitle>
            <CardDescription className="text-xs">
              Conte com suas palavras o que está acontecendo e quando ocorreu.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quando ocorreu ou começou a acontecer? <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['Hoje', 'Ontem', 'Esta semana', 'Há mais de 1 mês', 'Ocorre com frequência / Diariamente'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuandoOcorreu(q)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      quandoOcorreu === q
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Descreva o que aconteceu <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">{descricao.length}/7.000</span>
              </div>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                rows={4}
                maxLength={7000}
                placeholder="Exemplo: Há caminhões despejando entulho e queimando resíduos toda noite perto do manguezal. A fumaça preta está sufocando as casas próximas..."
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none leading-relaxed"
              />
            </div>

            {/* Fotos e Vídeos */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Fotos ou Vídeos como Evidência (Opcional, mas muito importante!)
              </label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500 transition-colors">
                <Camera className="w-8 h-8 mx-auto text-emerald-700 dark:text-emerald-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Toque para tirar foto ou selecionar da galeria
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Fotos nítidas de placas, veículos ou da área ajudam os fiscais.</p>
              </div>

              {fotos.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {fotos.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200/80 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <Camera className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">{f.nome}</span>
                        <span className="text-[10px] text-slate-400">({f.tamanho})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFotos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Onde Fica o Local? */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  3. Onde fica o local da infração?
                </CardTitle>
                <CardDescription className="text-xs">
                  Informe a cidade e pontos de referência para que a equipe chegue ao local correto.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePegarGps}
                className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold border-emerald-300 dark:border-emerald-800"
              >
                <Navigation className="w-3.5 h-3.5" />
                {gpsAtivo ? 'Localização GPS Obtida' : 'Usar minha localização GPS'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Endereço, Rua, Povoado ou Rodovia <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={localizacaoTexto}
                  onChange={(e) => setLocalizacaoTexto(e.target.value)}
                  required
                  placeholder="Ex: Rodovia BA-099, Km 28 ou Estrada da Areia Branca"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Ponto de Referência Marcante <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={pontoReferencia}
                onChange={(e) => setPontoReferencia(e.target.value)}
                required
                placeholder="Ex: Em frente à mercearia do Seu Antônio, portão azul logo após a ponte de cimento"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>

            {gpsAtivo && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
                <span className="text-emerald-800 dark:text-emerald-300 font-mono">
                  GPS Gravado: Lat <strong>{latitude}</strong> | Lng <strong>{longitude}</strong>
                </span>
                <Badge variant="emerald">Precisão 8m</Badge>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-4 pb-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {tipoEnvio === 'anonima'
                ? 'Sua denúncia será enviada sob sigilo total sem identificação.'
                : `Denúncia vinculada ao CPF ${cpfCidadao}.`}
            </span>
            <Button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm px-7"
            >
              Enviar Denúncia ao INEMA
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Modal de Sucesso */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-lg text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center mb-2 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Denúncia Enviada com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Obrigado por ajudar a proteger o patrimônio ambiental da Bahia. Sua colaboração foi registrada.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 my-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <span className="text-[11px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
              Chave / Protocolo de Acompanhamento (RD)
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
              Fazer Outra Denúncia
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
