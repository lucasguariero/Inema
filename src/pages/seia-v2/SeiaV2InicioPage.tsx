import React from 'react';
import {
  Plus,
  FolderKanban,
  AlertTriangle,
  ArrowRight,
  Contact,
  Building2,
  Droplets,
  FileText,
  Globe,
  User,
  CheckCircle2,
  Clock,
  Mail,
  BellOff,
  CalendarClock,
  FileEdit,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronRight,
  Flame,
  FileCheck2,
  Layers,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SeiaV2InicioPageProps {
  onNavigate?: (route: string) => void;
}

export const SeiaV2InicioPage: React.FC<SeiaV2InicioPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full space-y-6 lg:space-y-7 pb-16 animate-in fade-in duration-200">
      {/* 1. HERO HEADER INSTITUCIONAL */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Lado Esquerdo: Saudação & Contexto do Usuário */}
          <div className="space-y-2 max-w-3xl">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Bem-vindo, Admin INEMA
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Painel unificado de regulação e fiscalização ambiental. Selecione uma ação prioritária ou gerencie seus processos abaixo.
              </p>
            </div>
          </div>

          {/* Lado Direito: Ações Rápidas Principais */}
          <div className="flex flex-col sm:flex-row xl:flex-col gap-2.5 shrink-0 sm:self-start xl:self-center w-full sm:w-auto xl:w-72">
            <Button
              variant="primary"
              onClick={() => onNavigate && onNavigate('formulario')}
              className="h-10 text-xs font-semibold bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs flex items-center justify-center gap-2 rounded-lg transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Novo Requerimento Único</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => onNavigate && onNavigate('tabela')}
              className="h-10 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs flex items-center justify-center gap-2 rounded-lg transition-colors cursor-pointer"
            >
              <FolderKanban className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Ir para Meus Processos</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => onNavigate && onNavigate('atendente')}
              className="h-10 text-xs font-semibold text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/40 shadow-2xs flex items-center justify-center gap-2 rounded-lg transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
              <span>Registrar Denúncia / Ocorrência</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. GRID DE 6 MÉTRICAS / STATUS (1 LINHA COMPLETA NO DESKTOP FULL HD) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 w-full">
        {/* 1. Mensagens não lidas */}
        <div className="rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mensagens
              </span>
              <Badge color="info" size="xs" dot>Novas</Badge>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                13
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                Não lidas na caixa
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('tabela')}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 transition-colors w-full cursor-pointer"
          >
            <span>Visualizar</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 2. Notificações não respondidas */}
        <div className="rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Notificações
              </span>
              <Badge color="danger" size="xs" dot>Pendente</Badge>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                00
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                Não respondidas
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('tabela')}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 transition-colors w-full cursor-pointer"
          >
            <span>Visualizar</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3. Notificações aguardando resposta */}
        <div className="rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Prazos
              </span>
              <Badge color="warning" size="xs" dot>Em prazo</Badge>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                03
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                Aguardando resposta
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('tabela')}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 transition-colors w-full cursor-pointer"
          >
            <span>Visualizar</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4. Requerimentos em análise */}
        <div className="rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Requerimentos
              </span>
              <Badge color="primary" size="xs" dot>Ativo</Badge>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                38
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                Em análise técnica
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('tabela')}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 transition-colors w-full cursor-pointer"
          >
            <span>Visualizar</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 5. Licenças próximas do vencimento */}
        <div className="rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Vencimentos
              </span>
              <Badge color="warning" size="xs" dot>&lt; 30 dias</Badge>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                03
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                Próximas do limite
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('tabela')}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 transition-colors w-full cursor-pointer"
          >
            <span>Visualizar</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 6. Rascunhos */}
        <div className="rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Rascunhos
              </span>
              <Badge color="gray" size="xs">Em aberto</Badge>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                39
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                Rascunhos pendentes
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('formulario')}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 transition-colors w-full cursor-pointer"
          >
            <span>Continuar</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3. SEÇÃO CENTRAL: AVISO IMPORTANTE */}
      <div className="w-full">
        {/* CARD AVISO IMPORTANTE */}
        <div className="w-full rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between overflow-hidden">
          {/* Card Header no padrão do Design System */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 px-6 py-3.5 bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              Portaria Conjunta INEMA nº 25.753/2022
            </span>
            <Badge color="primary" size="xs">Requerimento Unificado</Badge>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                Está disponível a nova versão do Requerimento Único
              </h3>

              <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 mt-2.5 leading-relaxed">
                Todos os atos administrativos necessários à regularização ambiental de atividades ou empreendimentos devem ser solicitados no mesmo requerimento unificado.
              </p>

              {/* Grid dos 6 atos administrativos integrados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-2xs">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#0F4C3A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Renovação ou alteração de licença ambiental (LP, LI, LO);</span>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-2xs">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#0F4C3A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Renovação, alteração ou outorga de uso de água (CERH);</span>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-2xs">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#0F4C3A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Prorrogação de prazo de validade de atos do INEMA;</span>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-2xs">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#0F4C3A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Revisão e cumprimento de condicionantes ambientais;</span>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-2xs">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#0F4C3A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Novas licenças, outorgas e atos florestais (ASV/CRF);</span>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-2xs">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#0F4C3A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Alteração de Razão Social e Transferência de Titularidade.</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
                * Os atos declaratórios de regularização ambiental (ANSLA) também devem ser iniciados utilizando o fluxo unificado.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                Precisa de ajuda com o novo formulário?
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate && onNavigate('formulario')}
                  className="text-xs sm:text-sm font-semibold h-9 rounded-lg cursor-pointer"
                >
                  Guia do Requerente
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate && onNavigate('formulario')}
                  className="text-xs sm:text-sm font-semibold bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white h-9 rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Preencher Agora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SEÇÃO ACESSO RÁPIDO (GRID DE 6 ITENS ALINHADO E EXPANSIVO) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              Acesso Rápido
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Atalhos operacionais diretos para os cadastros e módulos regulatórios vinculados ao seu perfil.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
          {/* 1. Dados Pessoais */}
          <div
            onClick={() => onNavigate && onNavigate('cadastros-basicos')}
            className="rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-[#0F4C3A] dark:hover:border-emerald-600/70 hover:shadow-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-950/50 dark:text-emerald-300 flex items-center justify-center group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors duration-150 mb-3.5">
                <Contact className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 transition-colors">
                Dados Pessoais
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                Complete e mantenha seus dados cadastrais, RTs e procuradores atualizados.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Empreendimentos */}
          <div
            onClick={() => onNavigate && onNavigate('cadastros-basicos')}
            className="rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-[#0F4C3A] dark:hover:border-emerald-600/70 hover:shadow-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-950/50 dark:text-emerald-300 flex items-center justify-center group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors duration-150 mb-3.5">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 transition-colors">
                Empreendimentos
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                Gerencie seus empreendimentos, poligonais e unidades operacionais.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. CERH */}
          <div
            onClick={() => onNavigate && onNavigate('cerh')}
            className="rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-[#0F4C3A] dark:hover:border-emerald-600/70 hover:shadow-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-950/50 dark:text-emerald-300 flex items-center justify-center group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors duration-150 mb-3.5">
                <Droplets className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 transition-colors">
                CERH
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                Cadastro Estadual de Recursos Hídricos e declarações de outorga.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. DTRP */}
          <div
            onClick={() => onNavigate && onNavigate('dtrp')}
            className="rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-[#0F4C3A] dark:hover:border-emerald-600/70 hover:shadow-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-950/50 dark:text-emerald-300 flex items-center justify-center group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors duration-150 mb-3.5">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 transition-colors">
                DTRP
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                Declarações de Transporte de Resíduos Perigosos e rotas MTR.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Reposição Florestal */}
          <div
            onClick={() => onNavigate && onNavigate('reposicao-florestal')}
            className="rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-[#0F4C3A] dark:hover:border-emerald-600/70 hover:shadow-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-950/50 dark:text-emerald-300 flex items-center justify-center group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors duration-150 mb-3.5">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 transition-colors">
                Reposição Florestal
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                Acompanhe obrigações de reposição, saldo florestal e certificados CRF.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Pessoa Física */}
          <div
            onClick={() => onNavigate && onNavigate('cadastros-basicos')}
            className="rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-[#0F4C3A] dark:hover:border-emerald-600/70 hover:shadow-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-950/50 dark:text-emerald-300 flex items-center justify-center group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors duration-150 mb-3.5">
                <User className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0F4C3A] dark:group-hover:text-emerald-400 transition-colors">
                Pessoa Física
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                Consulte e gerencie pessoas físicas, representantes e procuradores legais.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0F4C3A] dark:text-emerald-400">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
