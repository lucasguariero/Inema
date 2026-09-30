import React from 'react';
import {
  FilePlus2,
  FolderKanban,
  AlertTriangle,
  Eye,
  ArrowRight,
  Contact,
  Building2,
  Droplets,
  FileText,
  Globe,
  User,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SeiaV2InicioPageProps {
  onNavigate?: (route: string) => void;
}

export const SeiaV2InicioPage: React.FC<SeiaV2InicioPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Título Principal */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Início
        </h1>

        <div className="mt-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            Bem-vindo, Admin INEMA
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            O que deseja fazer hoje no SEIA?
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Você tem <span className="font-semibold text-slate-700 dark:text-slate-300">31 notificações</span> e{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">13 não lidas</span>.
          </p>
        </div>
      </div>

      {/* Barra de Ações Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="primary"
          onClick={() => onNavigate && onNavigate('formulario')}
          className="h-10 text-xs font-semibold bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-2xs flex items-center justify-center gap-2 rounded-lg"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>+ Novo Requerimento</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => onNavigate && onNavigate('tabela')}
          className="h-10 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs flex items-center justify-center gap-2 rounded-lg"
        >
          <FolderKanban className="w-4 h-4 text-slate-500" />
          <span>Ir para Meus Processos</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => onNavigate && onNavigate('atendente')}
          className="h-10 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs flex items-center justify-center gap-2 rounded-lg"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
          <span>Registrar Denúncia</span>
        </Button>
      </div>

      {/* Grid de Métricas / Status (6 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Mensagens não lidas */}
        <div className="rounded-xl p-4.5 border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">
              Mensagens não lidas
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
              13
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('tabela')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 mt-3 transition-colors text-left w-fit"
          >
            <span>Visualizar</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notificações não respondidas */}
        <div className="rounded-xl p-4.5 border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
              Notificações não respondidas
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
              00
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('tabela')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 mt-3 transition-colors text-left w-fit"
          >
            <span>Visualizar</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notificações aguardando resposta */}
        <div className="rounded-xl p-4.5 border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Notificações aguardando resposta
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
              03
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('tabela')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 mt-3 transition-colors text-left w-fit"
          >
            <span>Visualizar</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Requerimentos em análise */}
        <div className="rounded-xl p-4.5 border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Requerimentos em análise
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
              38
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('tabela')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 mt-3 transition-colors text-left w-fit"
          >
            <span>Visualizar</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Licenças próximas do vencimento */}
        <div className="rounded-xl p-4.5 border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Licenças próximas do vencimento
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
              03
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('tabela')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 mt-3 transition-colors text-left w-fit"
          >
            <span>Visualizar</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rascunhos */}
        <div className="rounded-xl p-4.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Rascunhos
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
              39
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('formulario')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 mt-3 transition-colors text-left w-fit"
          >
            <span>Visualizar</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Aviso Importante */}
      <div className="rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
          Aviso Importante
        </h3>
        
        <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 mb-1.5">
          Está disponível a nova versão do requerimento único.
        </p>
        
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
          Todos os atos administrativos necessários à regularização ambiental de atividades ou empreendimentos devem ser solicitados no mesmo requerimento.
        </p>

        <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside ml-1">
          <li>Renovação ou alteração de licença ambiental;</li>
          <li>Renovação, alteração ou cancelamento de outorga de uso de água;</li>
          <li>Prorrogação de prazo de validade de atos administrativos do INEMA;</li>
          <li>Revisão de condicionantes;</li>
          <li>Novas licenças, autorizações, outorgas de uso de água e atos florestais;</li>
          <li>Alteração de Razão Social e Transferência de Titularidade.</li>
        </ol>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
          Os atos declaratórios de regularização ambiental também devem ser feitos utilizando o requerimento único.
        </p>
      </div>

      {/* Seção Acesso Rápido */}
      <div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Acesso rápido
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
          Atalhos para as funcionalidades disponíveis para o seu perfil.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Dados Pessoais */}
          <div className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#0F4C3A] text-white flex items-center justify-center">
                <Contact className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">
                Dados Pessoais
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                Complete e mantenha seus dados cadastrais atualizados.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('cadastros-basicos')}
              className="text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400 hover:underline flex items-center gap-1 w-fit group"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Empreendimentos */}
          <div className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#0F4C3A] text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">
                Empreendimentos
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                Gerencie os seus empreendimentos cadastrados.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('cadastros-basicos')}
              className="text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400 hover:underline flex items-center gap-1 w-fit group"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* CERH */}
          <div className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#0F4C3A] text-white flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">
                CERH
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                Cadastro Estadual de Recursos Hídricos.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('cerh')}
              className="text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400 hover:underline flex items-center gap-1 w-fit group"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* DTRP */}
          <div className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#0F4C3A] text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">
                DTRP
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                Declarações de Transporte de Resíduos Perigosos.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('dtrp')}
              className="text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400 hover:underline flex items-center gap-1 w-fit group"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Reposição Florestal */}
          <div className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#0F4C3A] text-white flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">
                Reposição Florestal
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                Acompanhe suas obrigações de reposição florestal.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('reposicao-florestal')}
              className="text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400 hover:underline flex items-center gap-1 w-fit group"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Pessoa Física */}
          <div className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#0F4C3A] text-white flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">
                Pessoa Física
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                Consulte e gerencie pessoas físicas.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('cadastros-basicos')}
              className="text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400 hover:underline flex items-center gap-1 w-fit group"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
