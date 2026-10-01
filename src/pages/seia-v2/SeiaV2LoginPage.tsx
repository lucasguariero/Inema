import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Globe,
  Sun,
  Moon,
  Loader2,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { useTheme } from '@/context/ThemeContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Import official logos
import logoHorizontalWhite from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_HORIZONTAL_W.svg';
import logoHorizontalColor from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_HORIZONTAL_COR.svg';
import logoIconWhite from '@/assets/seia-plataforma/svg/SEIA Plataforma - Logo EXP_ICON_W.svg';

interface SeiaV2LoginPageProps {
  onLoginSuccess?: (role: string) => void;
  onNavigate?: (route: string) => void;
}

export const SeiaV2LoginPage: React.FC<SeiaV2LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [cpf, setCpf] = useState('123.456.789-00');
  const [password, setPassword] = useState('inema@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [transitionStatus, setTransitionStatus] = useState('Iniciando sessão segura...');
  const [selectedRole, setSelectedRole] = useState<'servidor' | 'gestor' | 'cidadao'>('servidor');
  
  // Modals
  const [cadastroModalOpen, setCadastroModalOpen] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
  };

  const handleSelectPreset = (role: 'servidor' | 'gestor' | 'cidadao') => {
    setSelectedRole(role);
    if (role === 'servidor') {
      setCpf('123.456.789-00');
      setPassword('inema@2026');
    } else if (role === 'gestor') {
      setCpf('987.654.321-00');
      setPassword('inema@2026');
    } else {
      setCpf('456.789.012-33');
      setPassword('cidadao@2026');
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      setTransitionProgress(0);
      setTransitionStatus('Iniciando sessão segura...');
      return;
    }

    const timer = setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(selectedRole);
      } else if (onNavigate) {
        onNavigate('inicio');
      } else {
        window.location.href = '/?rota=seia-v2&tela=inicio';
      }
    }, 1050);

    return () => {
      clearTimeout(timer);
    };
  }, [isTransitioning, onLoginSuccess, onNavigate, selectedRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Feedback no botão e transição fluida para tela cheia
    setTimeout(() => {
      setIsLoading(false);
      setIsTransitioning(true);
    }, 280);
  };

  const handlePublicServices = () => {
    if (onNavigate) {
      onNavigate('cidadao');
    } else {
      window.location.href = '/?rota=seia-v2&tela=cidadao';
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2 bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
      {/* TRANSIÇÃO MODERNA E INSTITUCIONAL (PADRÃO SEIA V2 / ZERO AI SLOP) */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07241C] text-white animate-in fade-in duration-300">
          {/* Imagem de Fundo (Cachoeira da Fumaça / Chapada Diamantina) */}
          <div
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-55 scale-105 transition-transform duration-1000 ease-out"
            style={{
              backgroundImage: "url('/images/inema-banner.jpeg')",
            }}
          />

          {/* Gradiente Institucional Degradê Suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#041A14] via-[#0A3327]/90 to-[#07251C]/95 backdrop-blur-[2px]" />

          {/* Container Central com Animação Fluida & Minimalista */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-[430px] w-full px-6 animate-in fade-in zoom-in-95 duration-400 ease-out text-center">
            {/* Logo Central (10% menor) */}
            <div className="relative mb-8">
              <img
                src={logoHorizontalWhite}
                alt="INEMA - Governo da Bahia"
                className="relative h-14 sm:h-18 md:h-20 w-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
              />
            </div>

            {/* Spinner Elegante em Branco (Inspirado no loader orbital suave) */}
            <div className="relative flex items-center justify-center w-14 h-14 mb-5">
              {/* Pulso orbital suave */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-25" />
              {/* Spinner circular fino em branco puro */}
              <svg className="w-12 h-12 animate-spin text-white" viewBox="0 0 50 50">
                <circle
                  className="opacity-20"
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  className="opacity-95"
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="75"
                  strokeDashoffset="55"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* PAINEL ESQUERDO (Banner Institucional com Overlay Verde Inema - Estilo GLA) */}
      <div className="relative hidden lg:flex flex-col justify-center items-center p-12 overflow-hidden bg-[#0A3327] text-white">
        {/* Imagem de Fundo (Cachoeira da Fumaça / Chapada Diamantina) */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60 transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: "url('/images/inema-banner.jpeg')",
          }}
        />

        {/* Gradiente Institucional Degradê */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06241B] via-[#0F4C3A]/85 to-[#0A3327]/90 backdrop-blur-[0.5px]" />

        {/* Logo Institucional Centralizado e Proeminente */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-md text-center">
          <img
            src={logoHorizontalWhite}
            alt="INEMA - Governo da Bahia"
            className="h-24 sm:h-28 md:h-32 w-auto drop-shadow-xl"
          />
        </div>
      </div>

      {/* PAINEL DIREITO (Formulário Filament Auth) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative bg-white dark:bg-slate-950">
        {/* Topo Direito: Theme Toggle & Logo Mobile */}
        <div className="flex items-center justify-between w-full">
          <div className="lg:hidden flex items-center gap-2">
            <img
              src={isDarkMode ? logoHorizontalWhite : logoHorizontalColor}
              alt="SEIA"
              className="h-9 w-auto"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={toggleDarkMode}
              type="button"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Container Central do Form */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          {/* Cabeçalho do Card */}
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Faça login
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              ou{' '}
              <button
                type="button"
                onClick={() => setCadastroModalOpen(true)}
                className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
              >
                Cadastre-se como usuário clicando aqui!
              </button>
            </p>
          </div>

          {/* Seletor Rápido de Perfis de Demonstração (Demo Fill) */}
          <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
              <span>Usuário Padrão de Demonstração:</span>
              <span className="text-[10px] text-slate-400">Clique para alternar</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectPreset('servidor')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedRole === 'servidor'
                    ? 'bg-[#0F4C3A] text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Servidor / RT
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('gestor')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedRole === 'gestor'
                    ? 'bg-[#0F4C3A] text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Gestor Área
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('cidadao')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedRole === 'cidadao'
                    ? 'bg-[#0F4C3A] text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Cidadão
              </button>
            </div>
          </div>

          {/* Formulário Oficial com Componentes Padrão Filament */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo CPF com InputWrapper */}
            <InputWrapper label="CPF" required>
              <input
                type="text"
                required
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent border-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none font-mono"
              />
            </InputWrapper>

            {/* Campo Senha com InputWrapper e toggle de visibilidade */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Senha<span className="text-rose-500 ml-0.5">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordModalOpen(true)}
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                >
                  Esqueceu sua senha?
                </button>
              </div>
              <InputWrapper
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
                    title={showPassword ? "Ocultar senha" : "Ver senha"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent border-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
              </InputWrapper>
            </div>

            {/* Checkbox Lembrar de Mim */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0F4C3A] focus:ring-[#0F4C3A] border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <span>Lembrar de mim</span>
              </label>
            </div>

            {/* Botão Primário de Login */}
            <Button
              type="submit"
              disabled={isLoading || isTransitioning}
              className="w-full bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold text-xs sm:text-sm h-10 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading || isTransitioning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando no SEIA...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </Button>
          </form>

          {/* Divisor OU */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative px-3 bg-white dark:bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              OU
            </span>
          </div>

          {/* Bloco de Serviços Públicos Cidadão */}
          <div className="space-y-3 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Não tem acesso ao sistema? Consulte licenças, registre uma denúncia ambiental ou uma emergência química no portal público.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={handlePublicServices}
              className="w-full border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#0F4C3A] dark:text-emerald-400" />
              <span>Ir para os Serviços Online</span>
            </Button>
          </div>
        </div>

        {/* Rodapé discreto em cantinho mostrando que a versão é ambiente de homologação / não oficial */}
        <div className="text-center lg:text-right text-[10px] text-slate-400 dark:text-slate-600 font-mono">
          Ambiente de Homologação / Demonstração • Versão não oficial
        </div>
      </div>

      {/* MODAL: Cadastre-se como usuário */}
      <Dialog open={cadastroModalOpen} onOpenChange={setCadastroModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0F4C3A]" />
              <span>Novo Cadastro de Usuário — SEIA V2</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <InputWrapper label="Tipo de Cadastro">
              <select className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 focus:outline-none dark:text-slate-100 cursor-pointer">
                <option value="cidadao">Pessoa Física / Requerente Cidadão</option>
                <option value="rt">Responsável Técnico (CREA / CRBio / CRQ)</option>
                <option value="pj">Representante Legal de Empresa (PJ)</option>
                <option value="orgao">Servidor Municipal / Órgão Conveniado</option>
              </select>
            </InputWrapper>

            <InputWrapper label="Nome Completo">
              <input
                type="text"
                placeholder="Seu nome completo"
                className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              />
            </InputWrapper>

            <div className="grid grid-cols-2 gap-3">
              <InputWrapper label="CPF">
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                />
              </InputWrapper>
              <InputWrapper label="Telefone / WhatsApp">
                <input
                  type="text"
                  placeholder="(71) 99999-0000"
                  className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                />
              </InputWrapper>
            </div>

            <InputWrapper label="E-mail Principal">
              <input
                type="email"
                placeholder="seu.email@exemplo.com.br"
                className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              />
            </InputWrapper>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300">
              Você receberá um link de ativação com confirmação de identidade por e-mail e SMS.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCadastroModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setCadastroModalOpen(false);
                setFeedbackMessage('Cadastro enviado! Verifique seu e-mail para ativar.');
              }}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold"
            >
              Criar Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Esqueceu sua senha */}
      <Dialog open={forgotPasswordModalOpen} onOpenChange={setForgotPasswordModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#0F4C3A]" />
              <span>Recuperação de Senha</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              Informe seu CPF para enviarmos as instruções de redefinição de senha para o seu e-mail cadastrado.
            </p>

            <InputWrapper label="CPF Cadastrado">
              <input
                type="text"
                defaultValue={cpf}
                placeholder="000.000.000-00"
                className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              />
            </InputWrapper>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setForgotPasswordModalOpen(false)}>
              Voltar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setForgotPasswordModalOpen(false);
                setFeedbackMessage('Instruções de recuperação enviadas com sucesso!');
              }}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold"
            >
              Enviar Instruções
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SeiaV2LoginPage;
