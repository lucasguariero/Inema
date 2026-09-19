import React, { useState } from 'react';
import {
 Calendar,
 Clock,
 MapPin,
 Users,
 Shield,
 FileText,
 AlertTriangle,
 CheckCircle2,
 Info,
 CalendarDays,
 Send,
 Plus,
 Search,
 Trash2,
 Eye,
 Check,
 X,
 FileEdit,
 ArrowRight,
 ArrowLeft,
 Filter,
 Layers,
 HelpCircle,
 Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentSelect, FilamentWizard, FilamentTabs } from '@/components/filament';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
 DialogFooter
} from '@/components/ui/dialog';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

// Catálogo de Unidades de Conservação Estaduais do INEMA 
export const UNIDADES_CONSERVACAO_BAHIA = [
 { value: 'UC-CONDURU', label: 'Parque Estadual da Serra do Conduru', categoria: 'Parque Estadual', municipio: 'Uruçuca / Ilhéus', habilitada: true },
 { value: 'UC-SEVEN-SALAS', label: 'Parque Estadual de Sete Passagens', categoria: 'Parque Estadual', municipio: 'Miguel Calmon', habilitada: true },
 { value: 'UC-APA-LITORAL-NORTE', label: 'APA Litoral Norte do Estado da Bahia', categoria: 'Área de Proteção Ambiental', municipio: 'Entre Rios / Conde', habilitada: true },
 { value: 'UC-APA-BAIA-TODOS-SANTOS', label: 'APA da Baía de Todos-os-Santos', categoria: 'Área de Proteção Ambiental', municipio: 'Salvador / Itaparica', habilitada: true },
 { value: 'UC-APA-PRATIGI', label: 'APA de Pratigi', categoria: 'Área de Proteção Ambiental', municipio: 'Ituberá / Nilo Peçanha', habilitada: true },
 { value: 'UC-APA-COROA-VERMELHA', label: 'APA Coroa Vermelha', categoria: 'Área de Proteção Ambiental', municipio: 'Santa Cruz Cabrália', habilitada: true },
 { value: 'UC-PARQUE-ZOOBOTANICO', label: 'Parque Zoobotânico Getúlio Vargas', categoria: 'Parque Estadual', municipio: 'Salvador', habilitada: true },
 { value: 'UC-MONA-CACHOEIRA-FERRO', label: 'Monumento Natural Cachoeira do Ferro Doido', categoria: 'Monumento Natural', municipio: 'Morro do Chapéu', habilitada: false } // Para teste 
];

// Atrativos e áreas de visitação por UC
export const ATRATIVOS_MOCK: Record<string, { value: string; label: string; disponivel: boolean; motivo?: string }[]> = {
 'UC-CONDURU': [
 { value: 'TRILHA-JEQUITIBA', label: 'Trilha do Jequitibá Centenário', disponivel: true },
 { value: 'MIRANTE-SERRA', label: 'Mirante da Serra do Mar', disponivel: true },
 { value: 'CENTRO-VISITANTES', label: 'Auditório e Centro de Visitantes', disponivel: true },
 { value: 'TRILHA-RETIRO', label: 'Trilha do Retiro (Interditada p/ manutenção)', disponivel: false, motivo: 'Obras de recuperação de passadiço' }
 ],
 'UC-SEVEN-SALAS': [
 { value: 'TRILHA-CACHOEIRAS', label: 'Circuito das Sete Quedas', disponivel: true },
 { value: 'CAMPING-CENTRAL', label: 'Área de Camping e Convivência', disponivel: true }
 ],
 'UC-APA-LITORAL-NORTE': [
 { value: 'DUNAS-MANGUE-SECO', label: 'Setor Dunas e Praias de Mangue Seco', disponivel: true },
 { value: 'RIO-ITAPICURU', label: 'Rampa Fluvial Rio Itapicuru', disponivel: true }
 ]
};

// Interface de Solicitação de Agendamento (F-DUC-069-00)
export interface SolicitacaoAgendamento {
 id: string; // AG-2026-001
 protocoloSei?: string;
 ucId: string;
 ucNome: string;
 atrativo: string;
 dataInicio: string;
 dataFim: string;
 horarioInicio: string;
 horarioFim: string;
 classificacao: 'Esportiva' | 'Cultural' | 'Educacional' | 'Religiosa' | 'Recreativa' | 'Científica' | 'Comercial';
 subtipo: string;
 requerenteNome: string;
 requerenteCpfCnpj: string;
 requerenteEmail: string;
 requerenteTelefone: string;
 publicoEstimado: number;
 espectadoresEstimados: number;
 equipeApoio: number;
 cobrancaIngresso: boolean;
 patrocinioComercial: boolean;
 estruturasTemporarias: string[];
 transitoVeiculos: boolean;
 planoSeguranca: boolean;
 estrategiaResiduos: string;
 comunidadesTradicionais: boolean;
 status: 'Em Análise' | 'Reserva Preliminar' | 'Aguardando Complementação' | 'Convertido em Processo' | 'Indeferido' | 'Realizado' | 'Cancelado';
 dataSolicitacao: string;
 redirecionamento?: 'AAD' | 'Pesc' | 'AUI' | 'AAV';
 observacoesGestor?: string;
}

export const AgendamentoVisitacaoPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
 const { isDarkMode } = useTheme();

 // Modo de visualização superior: Formulário Requerente vs Gestor da UC vs Calendário
 const [visaoAtiva, setVisaoAtiva] = useState<'formulario' | 'pauta-gestor' | 'calendario' | 'checkout'>('formulario');

 // Aba ativa do Wizard F-DUC-069-00 (Etapas a )
 const [etapaForm, setEtapaForm] = useState<number>(1);

 // Estados dos campos do formulário
 // UC
 const [ucId, setUcId] = useState('UC-CONDURU');
 // Local e Agenda
 const [atrativo, setAtrativo] = useState('TRILHA-JEQUITIBA');
 const [dataInicio, setDataInicio] = useState('2026-10-15');
 const [dataFim, setDataFim] = useState('2026-10-15');
 const [horarioInicio, setHorarioInicio] = useState('08:00');
 const [horarioFim, setHorarioFim] = useState('14:00');
 const [justificativaHorario, setJustificativaHorario] = useState('');
 const [horarioMontagem, setHorarioMontagem] = useState('07:00');
 const [horarioDesmontagem, setHorarioDesmontagem] = useState('15:00');
 const [isPeriodica, setIsPeriodica] = useState(false);
 const [diasRecorrencia, setDiasRecorrencia] = useState<string[]>([]);

 // Responsáveis
 const [tipoResponsavel, setTipoResponsavel] = useState<'requerente' | 'organizadora' | 'produtora'>('requerente');
 const [requerenteNome, setRequerenteNome] = useState('Associação de Ecoturismo da Bahia');
 const [requerenteCpfCnpj, setRequerenteCpfCnpj] = useState('12.345.678/0001-90');
 const [requerenteEmail, setRequerenteEmail] = useState('contato@ecoturismoba.org.br');
 const [requerenteTelefone, setRequerenteTelefone] = useState('(71) 3344-5566');

 // Caracterização e Triagem
 const [classificacao, setClassificacao] = useState<'Esportiva' | 'Cultural' | 'Educacional' | 'Religiosa' | 'Recreativa' | 'Científica' | 'Comercial'>('Educacional');
 const [subtipoAtividade, setSubtipoAtividade] = useState('Visita Pedagógica de Campo');
 const [temFinalidadeDidatica, setTemFinalidadeDidatica] = useState(false);
 const [temColetaMaterial, setTemColetaMaterial] = useState(false);
 const [temPesquisaCientifica, setTemPesquisaCientifica] = useState(false);
 const [temCaptacaoComercial, setTemCaptacaoComercial] = useState(false);

 // Público e Caráter
 const [publicoEstimado, setPublicoEstimado] = useState(45);
 const [espectadoresEstimados, setEspectadoresEstimados] = useState(0);
 const [equipeApoio, setEquipeApoio] = useState(4);
 const [cobrancaIngresso, setCobrancaIngresso] = useState(false);
 const [patrocinioComercial, setPatrocinioComercial] = useState(false);

 // Infraestrutura, Veículos e Resíduos
 const [estruturasSelecionadas, setEstruturasSelecionadas] = useState<string[]>(['Tenda de Apoio 3x3', 'Banheiro Químico']);
 const [transitoVeiculos, setTransitoVeiculos] = useState(true);
 const [justificativaVeiculos, setJustificativaVeiculos] = useState('Van de transporte dos alunos até o estacionamento do Centro de Visitantes.');
 const [planoSeguranca, setPlanoSeguranca] = useState(true);
 const [estrategiaResiduos, setEstrategiaResiduos] = useState('Recolhimento integral com sacolas biodegradáveis e destinação externa.');
 const [comunidadesTradicionais, setComunidadesTradicionais] = useState(false);

 // Declarações
 const [declaracaoCiencia, setDeclaracaoCiencia] = useState(true);

 // Base de solicitações cadastradas (para Pauta do Gestor e Calendário)
 const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAgendamento[]>([
 {
 id: 'AG-2026-001',
 ucId: 'UC-CONDURU',
 ucNome: 'Parque Estadual da Serra do Conduru',
 atrativo: 'Trilha do Jequitibá Centenário',
 dataInicio: '2026-10-10',
 dataFim: '2026-10-10',
 horarioInicio: '08:00',
 horarioFim: '12:00',
 classificacao: 'Educacional',
 subtipo: 'Trabalho de Conclusão de Curso em Ecologia',
 requerenteNome: 'Universidade Estadual de Santa Cruz - UESC',
 requerenteCpfCnpj: '13.448.922/0001-30',
 requerenteEmail: 'biologia@uesc.br',
 requerenteTelefone: '(73) 3680-5000',
 publicoEstimado: 25,
 espectadoresEstimados: 0,
 equipeApoio: 2,
 cobrancaIngresso: false,
 patrocinioComercial: false,
 estruturasTemporarias: ['Kit primeiros socorros'],
 transitoVeiculos: false,
 planoSeguranca: true,
 estrategiaResiduos: 'Retirada total pelo grupo',
 comunidadesTradicionais: false,
 status: 'Reserva Preliminar',
 dataSolicitacao: '15/09/2026'
 },
 {
 id: 'AG-2026-002',
 ucId: 'UC-CONDURU',
 ucNome: 'Parque Estadual da Serra do Conduru',
 atrativo: 'Mirante da Serra do Mar',
 dataInicio: '2026-10-18',
 dataFim: '2026-10-18',
 horarioInicio: '07:00',
 horarioFim: '16:00',
 classificacao: 'Esportiva',
 subtipo: 'Trekking e Corrida de Montanha Serra do Conduru',
 requerenteNome: 'Ilhéus Trail Runners',
 requerenteCpfCnpj: '33.112.445/0001-88',
 requerenteEmail: 'contato@trailrunners.com.br',
 requerenteTelefone: '(73) 99122-3344',
 publicoEstimado: 120,
 espectadoresEstimados: 80,
 equipeApoio: 15,
 cobrancaIngresso: true,
 patrocinioComercial: true,
 estruturasTemporarias: ['Pórtico inflável', 'Tenda médica', 'Banheiro químico', 'Gerador de energia'],
 transitoVeiculos: true,
 planoSeguranca: true,
 estrategiaResiduos: 'Contratação de equipe de varrição',
 comunidadesTradicionais: false,
 status: 'Em Análise',
 dataSolicitacao: '16/09/2026'
 },
 {
 id: 'AG-2026-003',
 ucId: 'UC-APA-LITORAL-NORTE',
 ucNome: 'APA Litoral Norte do Estado da Bahia',
 atrativo: 'Setor Dunas e Praias de Mangue Seco',
 dataInicio: '2026-09-12',
 dataFim: '2026-09-12',
 horarioInicio: '09:00',
 horarioFim: '17:00',
 classificacao: 'Cultural',
 subtipo: 'Passeio Comunitário e Mostra de Artesanato',
 requerenteNome: 'Associação de Moradores de Mangue Seco',
 requerenteCpfCnpj: '08.991.234/0001-12',
 requerenteEmail: 'mangueseco@assoc.org',
 requerenteTelefone: '(75) 3422-1100',
 publicoEstimado: 60,
 espectadoresEstimados: 100,
 equipeApoio: 8,
 cobrancaIngresso: false,
 patrocinioComercial: false,
 estruturasTemporarias: ['Tendas de artesanato'],
 transitoVeiculos: false,
 planoSeguranca: true,
 estrategiaResiduos: 'Ecopontos instalados',
 comunidadesTradicionais: true,
 status: 'Realizado',
 dataSolicitacao: '01/09/2026'
 }
 ]);

 // Modal de mensagens operacionais e regras
 const [modalState, setModalState] = useState<{
 isOpen: boolean;
 tipo: 'sucesso' | 'erro' | 'aviso' | 'redirecionamento' | 'confirmacao';
 codigo: string;
 titulo: string;
 mensagem: string;
 acaoSecundaria?: () => void;
 }>({
 isOpen: false,
 tipo: 'sucesso',
 codigo: '',
 titulo: '',
 mensagem: ''
 });

 // Solicitação selecionada para detalhamento ou check-out
 const [solicitacaoEmFoco, setSolicitacaoEmFoco] = useState<SolicitacaoAgendamento | null>(null);

 // Check-out / Encerramento 
 const [checkoutDescricao, setCheckoutDescricao] = useState('');
 const [checkoutOcorrencias, setCheckoutOcorrencias] = useState('Nenhuma irregularidade observada. Área desmobilizada e limpa.');
 const [checkoutLimpezaOk, setCheckoutLimpezaOk] = useState(true);

 // Handler para avançar etapa com validações
 const handleAvancarEtapa = () => {
 if (etapaForm === 1) {
 // Validar UC selecionada e elegibilidade
 const ucObj = UNIDADES_CONSERVACAO_BAHIA.find((u) => u.value === ucId);
 if (ucObj && !ucObj.habilitada) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Unidade Não Habilitada',
 mensagem: 'A Unidade de Conservação selecionada não está habilitada para este tipo de agendamento.'
 });
 return;
 }
 }

 if (etapaForm === 2) {
 // Validar atrativo interditado
 const listaAtrativos = ATRATIVOS_MOCK[ucId] || [];
 const atrativoObj = listaAtrativos.find((a) => a.value === atrativo);
 if (atrativoObj && !atrativoObj.disponivel) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Local Indisponível',
 mensagem: `A área ou atrativo selecionado encontra-se indisponível no período solicitado: ${atrativoObj.motivo}.`
 });
 return;
 }

 // Validar conflito de agenda
 const conflito = solicitacoes.find(
 (s) => s.ucId === ucId && s.atrativo === atrativo && s.dataInicio === dataInicio && s.status !== 'Cancelado'
 );
 if (conflito) {
 setModalState({
 isOpen: true,
 tipo: 'aviso',
 codigo: '',
 titulo: 'Conflito de Agenda Detectado',
 mensagem: `Já existe atividade registrada (${conflito.id} - ${conflito.classificacao}) para o mesmo local e data informada. Deseja verificar outro horário ou prosseguir com análise de concorrência?`
 });
 // não bloqueia estritamente, mas avisa
 }

 // Validar horário fora de funcionamento
 if (horarioInicio < '07:00' || horarioFim > '18:00') {
 if (!justificativaHorario.trim()) {
 setModalState({
 isOpen: true,
 tipo: 'aviso',
 codigo: '',
 titulo: 'Horário Fora do Padrão',
 mensagem: 'O horário informado está fora do funcionamento regular da UC (07h às 18h). Justifique a necessidade no campo correspondente.'
 });
 return;
 }
 }
 }

 if (etapaForm === 3) {
 // Responsáveis obrigatórios
 if (!requerenteNome.trim() || !requerenteCpfCnpj.trim() || !requerenteEmail.trim()) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Campos Obrigatórios',
 mensagem: 'Preencha os dados obrigatórios do responsável pela atividade para continuar.'
 });
 return;
 }
 }

 if (etapaForm === 4) {
 // Triagem automática com outros processos
 if (classificacao === 'Educacional' && temColetaMaterial) {
 setModalState({
 isOpen: true,
 tipo: 'redirecionamento',
 codigo: '',
 titulo: 'Redirecionamento para Atividades Didáticas (AAD Tipo 2)',
 mensagem: 'Atividades didáticas com coleta/captura de espécimes biológicos exigem processo formal de AAD. O sistema pode redirecionar seu cadastro aproveitando todos os dados.',
 acaoSecundaria: () => {
 if (onNavigate) onNavigate('uc-atividades-didaticas');
 }
 });
 return;
 }

 if (temPesquisaCientifica || classificacao === 'Científica') {
 setModalState({
 isOpen: true,
 tipo: 'redirecionamento',
 codigo: '',
 titulo: 'Redirecionamento para Pesquisa Científica (Pesc)',
 mensagem: 'Projetos científicos e acadêmicos com metodologia e relatórios devem ser tramitados pelo módulo Pesc.',
 acaoSecundaria: () => {
 if (onNavigate) onNavigate('uc-pesquisa-cientifica');
 }
 });
 return;
 }

 if (temCaptacaoComercial) {
 setModalState({
 isOpen: true,
 tipo: 'aviso',
 codigo: '',
 titulo: 'Captação Comercial de Imagens (AUI)',
 mensagem: 'A captação de imagens para finalidade comercial, publicitária ou monetizada exigirá processo específico de Autorização de Uso de Imagem (AUI).'
 });
 }
 }

 setEtapaForm((prev) => Math.min(prev + 1, 7));
 };

 // Handler para salvar rascunho 
 const handleSalvarRascunho = () => {
 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Rascunho Salvo com Sucesso',
 mensagem: 'Seu formulário preliminar de agendamento foi salvo. O rascunho permanecerá disponível por 30 dias para edição.'
 });
 };

 // Handler para envio da solicitação
 const handleEnviarSolicitacao = () => {
 if (!declaracaoCiencia) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Declaração Obrigatória',
 mensagem: 'É obrigatório aceitar a declaração de ciência de que o agendamento não possui caráter autorizativo .'
 });
 return;
 }

 const novoId = `AG-2026-00${solicitacoes.length + 1}`;
 const novaSol: SolicitacaoAgendamento = {
 id: novoId,
 ucId,
 ucNome: UNIDADES_CONSERVACAO_BAHIA.find((u) => u.value === ucId)?.label || ucId,
 atrativo: ATRATIVOS_MOCK[ucId]?.find((a) => a.value === atrativo)?.label || atrativo,
 dataInicio,
 dataFim,
 horarioInicio,
 horarioFim,
 classificacao,
 subtipo: subtipoAtividade,
 requerenteNome,
 requerenteCpfCnpj,
 requerenteEmail,
 requerenteTelefone,
 publicoEstimado,
 espectadoresEstimados,
 equipeApoio,
 cobrancaIngresso,
 patrocinioComercial,
 estruturasTemporarias: estruturasSelecionadas,
 transitoVeiculos,
 planoSeguranca,
 estrategiaResiduos,
 comunidadesTradicionais,
 status: 'Em Análise',
 dataSolicitacao: '18/09/2026'
 };

 setSolicitacoes([novaSol, ...solicitacoes]);

 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Agendamento Enviado com Sucesso',
 mensagem: `Solicitação ${novoId} enviada com sucesso! Ela foi encaminhada para a análise da gestão da Unidade de Conservação. O envio preliminar não autoriza a atividade . Acompanhe pela aba 'Pauta do Gestor'.`
 });

 // Resetar ou mudar para Pauta
 setEtapaForm(1);
 setVisaoAtiva('pauta-gestor');
 };

 // Ações do Gestor da UC na Pauta 
 const handleAcaoGestor = (id: string, acao: 'confirmar-reserva' | 'solicitar-complemento' | 'converter-processo' | 'indeferir') => {
 setSolicitacoes((prev) =>
 prev.map((s) => {
 if (s.id !== id) return s;
 if (acao === 'confirmar-reserva') return { ...s, status: 'Reserva Preliminar' };
 if (acao === 'solicitar-complemento') return { ...s, status: 'Aguardando Complementação' };
 if (acao === 'converter-processo') return { ...s, status: 'Convertido em Processo' };
 if (acao === 'indeferir') return { ...s, status: 'Indeferido' };
 return s;
 })
 );

 if (acao === 'confirmar-reserva') {
 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Reserva Preliminar Registrada',
 mensagem: 'Reserva preliminar registrada com sucesso . O calendário da UC foi atualizado.'
 });
 } else if (acao === 'solicitar-complemento') {
 setModalState({
 isOpen: true,
 tipo: 'aviso',
 codigo: '',
 titulo: 'Complementação Solicitada',
 mensagem: 'O gestor da UC solicitou complementação de informações ou documentos ao requerente .'
 });
 } else if (acao === 'converter-processo') {
 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Convertido em Processo Formal',
 mensagem: 'A solicitação foi convertida em processo formal SEI-BA (AAV/APV ou AAD) com reaproveitamento integral dos dados .'
 });
 } else if (acao === 'indeferir') {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Indeferimento Preventivo',
 mensagem: 'A solicitação foi indeferida preventivamente pelo gestor da UC com registro de motivação no histórico .'
 });
 }
 };

 // Check-out / Concluir atividade 
 const handleConcluirCheckout = () => {
 if (!solicitacaoEmFoco) return;
 setSolicitacoes((prev) =>
 prev.map((s) => (s.id === solicitacaoEmFoco.id ? { ...s, status: 'Realizado' } : s))
 );
 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Check-out Registrado com Sucesso',
 mensagem: `A atividade ${solicitacaoEmFoco.id} foi encerrada. O atrativo encontra-se liberado na agenda da UC.`
 });
 setVisaoAtiva('pauta-gestor');
 setSolicitacaoEmFoco(null);
 };

 return (
 <div className="space-y-6">
      {/* CABEÇALHO DO MÓDULO */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Agendamento de Atividades de Visitação em UC
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Pré-reserva, triagem operacional de uso público, calendário de ocupação e prevenção de conflitos de agenda.
        </p>
      </div>

      {/* NAVEGAÇÃO DE ABAS OFICIAL GLA (FILAMENT) */}
      <FilamentTabs
        tabs={[
          { id: 'formulario', label: 'Solicitar Agendamento' },
          {
            id: 'pauta-gestor',
            label: 'Pauta do Gestor',
            badge: solicitacoes.filter((s) => s.status === 'Em Análise').length || undefined
          },
          { id: 'calendario', label: 'Calendário da UC' }
        ]}
        activeTab={visaoAtiva}
        onChange={(tabId) => {
          if (tabId === 'formulario') {
            setEtapaForm(1);
          }
          setVisaoAtiva(tabId as any);
        }}
        className="mb-6"
      />

      {/* ========================================================================= */}
      {/* VISÃO 1: FORMULÁRIO DE AGENDAMENTO (F-DUC-069-00) COM STEPPER ETAPAS 1 A 7 */}
      {/* ========================================================================= */}
      {visaoAtiva === 'formulario' && (
        <div className="space-y-6">
          {/* AVISO INSTITUCIONAL NÃO-AUTORIZATIVO */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3.5 rounded-lg flex items-start gap-3">
            
            <div className="text-xs text-amber-900 dark:text-amber-200 space-y-0.5 leading-relaxed">
              <span className="font-semibold">Regra Geral Importante : </span>
              O agendamento não possui caráter autorizativo. A realização da atividade dependerá da confirmação da gestão da Unidade de Conservação e do cumprimento dos requisitos aplicáveis.
            </div>
          </div>

          {/* STEPPER DE ETAPAS DO WIZARD (PADRÃO OFICIAL GLA INEMA) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <FilamentWizard
              steps={[
                { id: 1, label: 'Unidade' },
                { id: 2, label: 'Local e Agenda' },
                { id: 3, label: 'Responsáveis' },
                { id: 4, label: 'Caracterização' },
                { id: 5, label: 'Público' },
                { id: 6, label: 'Infraestrutura' },
                { id: 7, label: 'Revisão e Envio' }
              ]}
              currentStep={etapaForm}
              onStepClick={(step) => setEtapaForm(step)}
            />
          </div>

 {/* CONTEÚDO DA ETAPA DO FORMULÁRIO */}
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 {/* ETAPA 1: SELEÇÃO DA UNIDADE DE CONSERVAÇÃO */}
 {etapaForm === 1 && (
 <>
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Seleção da Unidade de Conservação Estadual</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Selecione a UC estadual administrada pelo INEMA para verificação de elegibilidade .
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4 pt-5">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1.5 sm:col-span-2">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Unidade de Conservação (UC) *
 </label>
 <FilamentSelect
 value={ucId}
 onChange={(val) => setUcId(val)}
 options={UNIDADES_CONSERVACAO_BAHIA.map((u) => ({
 value: u.value,
 label: `${u.label} (${u.categoria}) — ${u.municipio}`
 }))}
 placeholder="Selecione a Unidade de Conservação..."
 className="w-full text-xs"
 />
 <p className="text-[10px] text-slate-400">
 Catálogo oficial de UCs parametrizado pela CGEUC/DISUC/INEMA .
 </p>
 </div>

 {/* Detalhes da UC Selecionada */}
 {(() => {
 const selectedUc = UNIDADES_CONSERVACAO_BAHIA.find((u) => u.value === ucId);
 if (!selectedUc) return null;
 return (
 <div className="sm:col-span-2 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
 <div className="flex items-center justify-between">
 <span className="font-semibold text-slate-800 dark:text-slate-200">
 {selectedUc.label}
 </span>
 <Badge
 variant="outline"
 className={cn(
 "text-[10px]",
 selectedUc.habilitada
 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
 : "bg-red-50 text-red-700 border-red-200"
 )}
 >
 {selectedUc.habilitada ? 'Habilitada no CEUC' : 'Não Habilitada'}
 </Badge>
 </div>
 <p className="text-slate-500">
 <strong>Categoria:</strong> {selectedUc.categoria} | <strong>Município(s):</strong> {selectedUc.municipio}
 </p>
 {!selectedUc.habilitada && (
 <p className="text-red-600 font-medium">
 Aviso: Esta unidade está com agendamento online suspenso temporariamente no CEUC.
 </p>
 )}
 </div>
 );
 })()}
 </div>
 </CardContent>
 </>
 )}

 {/* ETAPA 2: LOCAL PRETENDIDO E AGENDA */}
 {etapaForm === 2 && (
 <>
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Local Pretendido, Atrativo e Agenda</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Defina o atrativo/trilha, datas, horários e períodos de montagem/desmobilização.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4 pt-5">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {/* Atrativo */}
 <div className="space-y-1.5 sm:col-span-2">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Atrativo / Trilha / Equipamento de Uso Público *
 </label>
 <FilamentSelect
 value={atrativo}
 onChange={(val) => setAtrativo(val)}
 options={(ATRATIVOS_MOCK[ucId] || []).map((a) => ({
 value: a.value,
 label: a.label
 }))}
 placeholder="Selecione o atrativo..."
 className="w-full text-xs"
 />
 <p className="text-[10px] text-slate-400">
 Cadastro de Áreas de Visitação ativas.
 </p>
 </div>

 {/* Datas */}
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Data de Início da Atividade *
 </label>
 <input
 type="date"
 value={dataInicio}
 onChange={(e) => setDataInicio(e.target.value)}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Data de Término da Atividade *
 </label>
 <input
 type="date"
 value={dataFim}
 onChange={(e) => setDataFim(e.target.value)}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 {/* Horários da Atividade */}
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Horário de Início (Visitação) *
 </label>
 <input
 type="time"
 value={horarioInicio}
 onChange={(e) => setHorarioInicio(e.target.value)}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Horário de Término (Visitação) *
 </label>
 <input
 type="time"
 value={horarioFim}
 onChange={(e) => setHorarioFim(e.target.value)}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 {/* Montagem e Desmontagem */}
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Início da Montagem / Carga
 </label>
 <input
 type="time"
 value={horarioMontagem}
 onChange={(e) => setHorarioMontagem(e.target.value)}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 <p className="text-[10px] text-slate-400">Entrada prévia de apoio.</p>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Fim da Desmontagem / Limpeza
 </label>
 <input
 type="time"
 value={horarioDesmontagem}
 onChange={(e) => setHorarioDesmontagem(e.target.value)}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 <p className="text-[10px] text-slate-400">Desmobilização final.</p>
 </div>

 {/* Justificativa caso fora do horário */}
 {(horarioInicio < '07:00' || horarioFim > '18:00') && (
 <div className="sm:col-span-2 space-y-1.5 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md border border-amber-200 dark:border-amber-800">
 <label className="text-xs font-semibold text-amber-900 dark:text-amber-200">
 Justificativa para Atividade Fora do Horário Regular (07h às 18h) *
 </label>
 <input
 type="text"
 value={justificativaHorario}
 onChange={(e) => setJustificativaHorario(e.target.value)}
 placeholder="Informe a justificativa técnica/operacional da visita noturna ou matutina..."
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>
 )}
 </div>
 </CardContent>
 </>
 )}

 {/* ETAPA 3: RESPONSÁVEIS PELA ATIVIDADE */}
 {etapaForm === 3 && (
 <>
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Identificação dos Responsáveis pela Atividade</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Preencha os dados do Requerente, Entidade Organizadora e Produtora quando houver.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4 pt-5">
 <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
 <Button
 type="button"
 size="sm"
 variant={tipoResponsavel === 'requerente' ? 'default' : 'outline'}
 onClick={() => setTipoResponsavel('requerente')}
 className="text-xs"
 >
 Requerente Principal
 </Button>
 <Button
 type="button"
 size="sm"
 variant={tipoResponsavel === 'organizadora' ? 'default' : 'outline'}
 onClick={() => setTipoResponsavel('organizadora')}
 className="text-xs"
 >
 Entidade Organizadora
 </Button>
 <Button
 type="button"
 size="sm"
 variant={tipoResponsavel === 'produtora' ? 'default' : 'outline'}
 onClick={() => setTipoResponsavel('produtora')}
 className="text-xs"
 >
 Empresa Produtora
 </Button>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1.5 sm:col-span-2">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Razão Social / Nome Completo *
 </label>
 <input
 type="text"
 value={requerenteNome}
 onChange={(e) => setRequerenteNome(e.target.value)}
 placeholder="Nome do responsável ou entidade..."
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 CPF ou CNPJ *
 </label>
 <input
 type="text"
 value={requerenteCpfCnpj}
 onChange={(e) => setRequerenteCpfCnpj(e.target.value)}
 placeholder="00.000.000/0000-00"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Telefone de Contato *
 </label>
 <input
 type="text"
 value={requerenteTelefone}
 onChange={(e) => setRequerenteTelefone(e.target.value)}
 placeholder="(00) 00000-0000"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5 sm:col-span-2">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 E-mail de Contato *
 </label>
 <input
 type="email"
 value={requerenteEmail}
 onChange={(e) => setRequerenteEmail(e.target.value)}
 placeholder="responsavel@dominio.com.br"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>
 </div>
 </CardContent>
 </>
 )}

 {/* ETAPA 4: CARACTERIZAÇÃO E TRIAGEM */}
 {etapaForm === 4 && (
 <>
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Caracterização da Atividade e Triagem de Fluxo</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Definição da natureza da atividade com verificação de sobreposição e redirecionamento.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-5 pt-5">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Classificação da Atividade *
 </label>
 <FilamentSelect
 value={classificacao}
 onChange={(val: any) => setClassificacao(val)}
 options={[
 { value: 'Educacional', label: 'Educacional / Escolar / Didática' },
 { value: 'Esportiva', label: 'Esportiva / Corrida / Trekking' },
 { value: 'Cultural', label: 'Cultural / Artística / Mostra' },
 { value: 'Religiosa', label: 'Religiosa / Peregrinação' },
 { value: 'Recreativa', label: 'Recreativa / Reunião Familiar' },
 { value: 'Científica', label: 'Científica / Acadêmica' },
 { value: 'Comercial', label: 'Comercial / Uso Promocional' }
 ]}
 placeholder="Classifique a atividade..."
 className="w-full text-xs"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Subtipo / Nome Específico do Evento *
 </label>
 <input
 type="text"
 value={subtipoAtividade}
 onChange={(e) => setSubtipoAtividade(e.target.value)}
 placeholder="Ex.: Aula de Campo de Botânica"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>
 </div>

 {/* PAINEL DE PERGUNTAS DE TRIAGEM AUTOMÁTICA */}
 <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
 <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
 <Sparkles className="w-3.5 h-3.5 text-teal-600" />
 Critérios de Triagem Normativa (INEMA Portaria 25.753/2022)
 </h3>

 <div className="space-y-2 text-xs">
 {/* Checkbox AAD Coleta */}
 <label className="flex items-start gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={temColetaMaterial}
 onChange={(e) => setTemColetaMaterial(e.target.checked)}
 className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
 />
 <div>
 <span className="font-semibold text-slate-700 dark:text-slate-300">
 A atividade didática envolve coleta, captura ou manipulação de espécimes biológicos / minerais?
 </span>
 <p className="text-[11px] text-slate-500">
 Se marcado, ativará redirecionamento automático para Atividade Didática Tipo 2 (AAD - ).
 </p>
 </div>
 </label>

 {/* Checkbox Pesquisa */}
 <label className="flex items-start gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={temPesquisaCientifica}
 onChange={(e) => setTemPesquisaCientifica(e.target.checked)}
 className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
 />
 <div>
 <span className="font-semibold text-slate-700 dark:text-slate-300">
 A atividade integra projeto formal de pesquisa científica/pós-graduação?
 </span>
 <p className="text-[11px] text-slate-500">
 Se marcado, redirecionará para Autorização de Pesquisa Científica (Pesc - ).
 </p>
 </div>
 </label>

 {/* Checkbox Imagem Comercial */}
 <label className="flex items-start gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={temCaptacaoComercial}
 onChange={(e) => setTemCaptacaoComercial(e.target.checked)}
 className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
 />
 <div>
 <span className="font-semibold text-slate-700 dark:text-slate-300">
 Haverá captação de imagens para fins comerciais, publicitários ou produções monetizadas?
 </span>
 <p className="text-[11px] text-slate-500">
 Exigirá complementação com processo de Autorização de Uso de Imagem (AUI / ).
 </p>
 </div>
 </label>
 </div>
 </div>
 </CardContent>
 </>
 )}

 {/* ETAPA 5: PÚBLICO E CARÁTER */}
 {etapaForm === 5 && (
 <>
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Público Estimado, Divulgação e Caráter Comercial</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Dimensionamento do contingente humano e verificação de cobrança ou patrocínio.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4 pt-5">
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Participantes Diretos *
 </label>
 <input
 type="number"
 min="1"
 value={publicoEstimado}
 onChange={(e) => setPublicoEstimado(Number(e.target.value))}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 <p className="text-[10px] text-slate-400">Alunos, atletas ou visitantes.</p>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Espectadores Previstos
 </label>
 <input
 type="number"
 min="0"
 value={espectadoresEstimados}
 onChange={(e) => setEspectadoresEstimados(Number(e.target.value))}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 <p className="text-[10px] text-slate-400">Público assistente/plateia.</p>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Equipe de Apoio e Monitores
 </label>
 <input
 type="number"
 min="0"
 value={equipeApoio}
 onChange={(e) => setEquipeApoio(Number(e.target.value))}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 <p className="text-[10px] text-slate-400">Instrutores e brigada.</p>
 </div>
 </div>

 {/* CARÁTER COMERCIAL */}
 <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
 <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
 Caráter Comercial e Financiamento
 </h4>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
 <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
 <input
 type="checkbox"
 checked={cobrancaIngresso}
 onChange={(e) => setCobrancaIngresso(e.target.checked)}
 className="rounded text-teal-600 focus:ring-teal-500"
 />
 <span className="text-slate-700 dark:text-slate-300">
 Haverá cobrança de taxa de inscrição ou ingresso?
 </span>
 </label>

 <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
 <input
 type="checkbox"
 checked={patrocinioComercial}
 onChange={(e) => setPatrocinioComercial(e.target.checked)}
 className="rounded text-teal-600 focus:ring-teal-500"
 />
 <span className="text-slate-700 dark:text-slate-300">
 Haverá patrocínio comercial ou estande de marcas?
 </span>
 </label>
 </div>
 </div>
 </CardContent>
 </>
 )}

 {/* ETAPA 6: INFRAESTRUTURA, VEÍCULOS E RESÍDUOS */}
 {etapaForm === 6 && (
 <>
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Infraestrutura, Equipamentos, Veículos e Resíduos</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Estruturas provisórias, trânsito interno, mitigação de impactos e plano de segurança.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4 pt-5">
 {/* Estruturas temporárias */}
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Estruturas Temporárias e Equipamentos
 </label>
 <div className="flex flex-wrap gap-2 pt-1">
 {[
 'Tenda de Apoio 3x3',
 'Banheiro Químico',
 'Gerador de Energia',
 'Sonorização / Caixa de Som',
 'Pórtico ou Gradil',
 'Palco Desmontável',
 'Mesa / Cadeiras'
 ].map((item) => {
 const selecionado = estruturasSelecionadas.includes(item);
 return (
 <button
 key={item}
 type="button"
 onClick={() => {
 if (selecionado) {
 setEstruturasSelecionadas(estruturasSelecionadas.filter((i) => i !== item));
 } else {
 setEstruturasSelecionadas([...estruturasSelecionadas, item]);
 }
 }}
 className={cn(
 "px-2.5 py-1 text-xs rounded-full border transition-all",
 selecionado
 ? "bg-teal-700 text-white border-teal-700 font-semibold"
 : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
 )}
 >
 {item}
 </button>
 );
 })}
 </div>
 </div>

 {/* Trânsito de veículos */}
 <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
 <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
 <input
 type="checkbox"
 checked={transitoVeiculos}
 onChange={(e) => setTransitoVeiculos(e.target.checked)}
 className="rounded text-teal-600 focus:ring-teal-500"
 />
 Haverá trânsito ou circulação de veículos motorizados no interior da UC?
 </label>
 {transitoVeiculos && (
 <input
 type="text"
 value={justificativaVeiculos}
 onChange={(e) => setJustificativaVeiculos(e.target.value)}
 placeholder="Justifique o trânsito, quantidade de veículos e itinerário interno..."
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 )}
 </div>

 {/* Resíduos e Limpeza */}
 <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Estratégia de Gerenciamento de Resíduos Sólidos e Limpeza *
 </label>
 <textarea
 rows={2}
 value={estrategiaResiduos}
 onChange={(e) => setEstrategiaResiduos(e.target.value)}
 placeholder="Descreva a coleta, separação, sacolas e destinação externa dos resíduos pós-evento..."
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 {/* Comunidades Tradicionais */}
 <label className="flex items-center gap-2 cursor-pointer text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
 <input
 type="checkbox"
 checked={comunidadesTradicionais}
 onChange={(e) => setComunidadesTradicionais(e.target.checked)}
 className="rounded text-teal-600 focus:ring-teal-500"
 />
 <span className="text-slate-700 dark:text-slate-300">
 A atividade ocorrerá em área habitada ou de uso costumeiro por Comunidades Tradicionais (Quilombolas/Povos Indígenas/Marisqueiras)?
 </span>
 </label>
 </CardContent>
 </>
 )}

 {/* ETAPA 7: REVISÃO, DECLARAÇÕES E ENVIO */}
 {etapaForm === 7 && (
 <>
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Revisão Consolidada, Declarações e Envio</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Confira o resumo geral da solicitação antes de enviar para análise do gestor.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4 pt-5 text-xs">
 {/* RESUMO POR BLOCOS */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
 <div>
 <span className="text-slate-400 block text-[11px]">Unidade de Conservação:</span>
 <strong className="text-slate-800 dark:text-slate-200">
 {UNIDADES_CONSERVACAO_BAHIA.find((u) => u.value === ucId)?.label}
 </strong>
 </div>

 <div>
 <span className="text-slate-400 block text-[11px]">Atrativo / Trilha:</span>
 <strong className="text-slate-800 dark:text-slate-200">
 {ATRATIVOS_MOCK[ucId]?.find((a) => a.value === atrativo)?.label || atrativo}
 </strong>
 </div>

 <div>
 <span className="text-slate-400 block text-[11px]">Período e Horário:</span>
 <span className="text-slate-700 dark:text-slate-300">
 {dataInicio} a {dataFim} ({horarioInicio} às {horarioFim})
 </span>
 </div>

 <div>
 <span className="text-slate-400 block text-[11px]">Classificação:</span>
 <span className="text-slate-700 dark:text-slate-300">
 {classificacao} — {subtipoAtividade}
 </span>
 </div>

 <div>
 <span className="text-slate-400 block text-[11px]">Responsável / Solicitante:</span>
 <span className="text-slate-700 dark:text-slate-300">
 {requerenteNome} ({requerenteCpfCnpj})
 </span>
 </div>

 <div>
 <span className="text-slate-400 block text-[11px]">Público Total Previsto:</span>
 <span className="text-slate-700 dark:text-slate-300">
 {publicoEstimado + espectadoresEstimados + equipeApoio} pessoas ({publicoEstimado} participantes)
 </span>
 </div>
 </div>

 {/* DECLARAÇÃO INSTITUCIONAL OBRIGATÓRIA */}
 <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20 space-y-2">
 <label className="flex items-start gap-2.5 cursor-pointer">
 <input
 type="checkbox"
 checked={declaracaoCiencia}
 onChange={(e) => setDeclaracaoCiencia(e.target.checked)}
 className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
 />
 <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
 Declaro estar ciente de que esta solicitação de agendamento <strong>não possui caráter autorizativo</strong> e não substitui atos de autorização formal, portarias ou licenças exigíveis . Comprometo-me a cumprir as normas do Plano de Manejo da UC e as diretrizes do INEMA.
 </span>
 </label>
 </div>
 </CardContent>
 </>
 )}

 {/* BOTÕES DE NAVEGAÇÃO DO WIZARD */}
 <CardFooter className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
 {etapaForm > 1 ? (
 <Button
 variant="outline"
 size="sm"
 onClick={() => setEtapaForm((prev) => prev - 1)}
 className="text-xs"
 >
 <ArrowLeft className="w-3.5 h-3.5 mr-1" />
 Voltar
 </Button>
 ) : (
 <div></div>
 )}

 <div className="flex items-center gap-2">
 <Button
 variant="outline"
 size="sm"
 onClick={handleSalvarRascunho}
 className="text-xs"
 >
 Salvar Rascunho 
 </Button>

 {etapaForm < 7 ? (
 <Button
 variant="default"
 size="sm"
 onClick={handleAvancarEtapa}
 className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
 >
 Avançar
 <ArrowRight className="w-3.5 h-3.5 ml-1" />
 </Button>
 ) : (
 <Button
 variant="default"
 size="sm"
 onClick={handleEnviarSolicitacao}
 className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
 >
 <Send className="w-3.5 h-3.5 mr-1" />
 Enviar Solicitação
 </Button>
 )}
 </div>
 </CardFooter>
 </Card>
 </div>
 )}

 {/* ========================================================================= */}
 {/* VISÃO 2: PAUTA DO GESTOR DA UC */}
 {/* ========================================================================= */}
 {visaoAtiva === 'pauta-gestor' && (
 <div className="space-y-4">
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
 <div>
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pauta de Análise e Triagem do Gestor da UC</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Controle de solicitações recebidas, validação de capacidade de carga, reservas preliminares e conversão formal.
 </CardDescription>
 </div>
 <Badge variant="outline" className="text-xs font-mono">
 {solicitacoes.length} solicitações na pauta
 </Badge>
 </CardHeader>

 <CardContent className="p-0">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
 <tr>
 <th className="py-3 px-4">Cód. Solicitação</th>
 <th className="py-3 px-4">Unidade / Atrativo</th>
 <th className="py-3 px-4">Data e Horário</th>
 <th className="py-3 px-4">Requerente / Classificação</th>
 <th className="py-3 px-4">Público</th>
 <th className="py-3 px-4">Status</th>
 <th className="py-3 px-4 text-right">Ações do Gestor</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
 {solicitacoes.map((sol) => (
 <tr key={sol.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
 <td className="py-3 px-4 font-mono font-semibold text-teal-700 dark:text-teal-400">
 {sol.id}
 </td>
 <td className="py-3 px-4">
 <div className="font-medium text-slate-800 dark:text-slate-200">{sol.ucNome}</div>
 <div className="text-[11px] text-slate-500">{sol.atrativo}</div>
 </td>
 <td className="py-3 px-4 font-mono text-[11px]">
 <div>{sol.dataInicio}</div>
 <div className="text-slate-400">{sol.horarioInicio} às {sol.horarioFim}</div>
 </td>
 <td className="py-3 px-4">
 <div className="font-medium">{sol.requerenteNome}</div>
 <Badge variant="outline" className="text-[10px] mt-0.5">
 {sol.classificacao}
 </Badge>
 </td>
 <td className="py-3 px-4 font-semibold">
 {sol.publicoEstimado} pessoas
 </td>
 <td className="py-3 px-4">
 <Badge
 variant="outline"
 className={cn(
 "text-[10px]",
 sol.status === 'Em Análise' && "bg-amber-50 text-amber-700 border-amber-200",
 sol.status === 'Reserva Preliminar' && "bg-emerald-50 text-emerald-700 border-emerald-200",
 sol.status === 'Aguardando Complementação' && "bg-blue-50 text-blue-700 border-blue-200",
 sol.status === 'Convertido em Processo' && "bg-purple-50 text-purple-700 border-purple-200",
 sol.status === 'Indeferido' && "bg-red-50 text-red-700 border-red-200",
 sol.status === 'Realizado' && "bg-slate-100 text-slate-700 border-slate-300"
 )}
 >
 {sol.status}
 </Badge>
 </td>
 <td className="py-3 px-4 text-right">
 <div className="flex items-center justify-end gap-1">
 {sol.status === 'Em Análise' && (
 <>
 <Button
 variant="outline"
 size="sm"
 onClick={() => handleAcaoGestor(sol.id, 'confirmar-reserva')}
 title="Confirmar Reserva Preliminar"
 className="h-7 text-[11px] text-emerald-700 border-emerald-300 hover:bg-emerald-50"
 >
 Pré-Reservar
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={() => handleAcaoGestor(sol.id, 'converter-processo')}
 title="Converter em Processo Formal SEI-BA"
 className="h-7 text-[11px] text-purple-700 border-purple-300 hover:bg-purple-50"
 >
 Processo SEI
 </Button>
 </>
 )}

 {sol.status === 'Reserva Preliminar' && (
 <Button
 variant="outline"
 size="sm"
 onClick={() => {
 setSolicitacaoEmFoco(sol);
 setVisaoAtiva('checkout');
 }}
 title="Registrar Check-out e Encerramento pós-evento "
 className="h-7 text-[11px] text-blue-700 border-blue-300 hover:bg-blue-50"
 >
 Check-out
 </Button>
 )}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </CardContent>
 </Card>
 </div>
 )}

 {/* ========================================================================= */}
 {/* VISÃO 3: CALENDÁRIO DA UC */}
 {/* ========================================================================= */}
 {visaoAtiva === 'calendario' && (
 <div className="space-y-4">
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
 <div>
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Calendário de Uso Público da UC (Outubro / 2026)</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Visão consolidada de ocupação, reservas preliminares e prevenção de conflitos de horário.
 </CardDescription>
 </div>
 </CardHeader>

 <CardContent className="p-4">
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 {solicitacoes.map((sol) => (
 <div
 key={sol.id}
 className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2 text-xs"
 >
 <div className="flex items-center justify-between">
 <Badge variant="outline" className="font-mono text-[10px]">
 {sol.dataInicio}
 </Badge>
 <Badge
 variant="outline"
 className={cn(
 "text-[10px]",
 sol.status === 'Reserva Preliminar' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
 )}
 >
 {sol.status}
 </Badge>
 </div>

 <div>
 <h4 className="font-semibold text-slate-900 dark:text-slate-100">{sol.subtipo}</h4>
 <p className="text-[11px] text-slate-500 mt-0.5">{sol.atrativo}</p>
 </div>

 <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
 <span>{sol.horarioInicio} - {sol.horarioFim}</span>
 <span className="font-semibold">{sol.publicoEstimado} visitantes</span>
 </div>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </div>
 )}

 {/* ========================================================================= */}
 {/* VISÃO 4: CHECK-OUT / ENCERRAMENTO OPERACIONAL */}
 {/* ========================================================================= */}
 {visaoAtiva === 'checkout' && solicitacaoEmFoco && (
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Registro de Check-out e Encerramento Operacional</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Encerramento pós-atividade, comprovação de desmobilização e liberação do atrativo.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4 pt-5 text-xs">
 <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
 <div><strong>Solicitação:</strong> {solicitacaoEmFoco.id} — {solicitacaoEmFoco.subtipo}</div>
 <div><strong>Atrativo:</strong> {solicitacaoEmFoco.atrativo} ({solicitacaoEmFoco.ucNome})</div>
 <div><strong>Requerente:</strong> {solicitacaoEmFoco.requerenteNome}</div>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
 Relatório de Ocorrências e Condições do Atrativo
 </label>
 <textarea
 rows={3}
 value={checkoutOcorrencias}
 onChange={(e) => setCheckoutOcorrencias(e.target.value)}
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
 <input
 type="checkbox"
 checked={checkoutLimpezaOk}
 onChange={(e) => setCheckoutLimpezaOk(e.target.checked)}
 className="rounded text-teal-600 focus:ring-teal-500"
 />
 Confirmo que todo o lixo, resíduos e estruturas temporárias foram removidos integralmente.
 </label>
 </CardContent>
 <CardFooter className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
 <Button
 variant="outline"
 size="sm"
 onClick={() => setVisaoAtiva('pauta-gestor')}
 className="text-xs"
 >
 Cancelar
 </Button>
 <Button
 variant="default"
 size="sm"
 onClick={handleConcluirCheckout}
 disabled={!checkoutLimpezaOk}
 className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
 >
 <Check className="w-3.5 h-3.5 mr-1" />
 Finalizar Check-out
 </Button>
 </CardFooter>
 </Card>
 )}

 {/* MODAL INSTITUCIONAL DE FEEDBACK E REGRAS */}
 <Dialog open={modalState.isOpen} onOpenChange={(open) => setModalState((prev) => ({ ...prev, isOpen: open }))}>
 <DialogContent className="sm:max-w-md">
 <DialogHeader>
 <div className="flex items-center gap-2 mb-1">
 {modalState.tipo === 'sucesso' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
 {modalState.tipo === 'erro' && <AlertTriangle className="w-5 h-5 text-red-600" />}
 {modalState.tipo === 'aviso' && <Info className="w-5 h-5 text-blue-600" />}
 {modalState.tipo === 'redirecionamento' && <Sparkles className="w-5 h-5 text-purple-600" />}
 <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
 {modalState.titulo}
 </DialogTitle>
 
 </div>
 <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
 {modalState.mensagem}
 </DialogDescription>
 </DialogHeader>

 <DialogFooter className="flex gap-2 sm:justify-end mt-4">
 {modalState.tipo === 'redirecionamento' && modalState.acaoSecundaria ? (
 <>
 <Button
 variant="outline"
 size="sm"
 onClick={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
 className="text-xs"
 >
 Continuar Agendamento
 </Button>
 <Button
 variant="default"
 size="sm"
 onClick={() => {
 setModalState((prev) => ({ ...prev, isOpen: false }));
 modalState.acaoSecundaria?.();
 }}
 className="bg-purple-700 hover:bg-purple-800 text-white text-xs"
 >
 Ir para Processo Dedicado
 </Button>
 </>
 ) : (
 <Button
 variant="default"
 size="sm"
 onClick={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
 className="bg-teal-700 hover:bg-teal-800 text-white text-xs"
 >
 OK
 </Button>
 )}
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>
 );
};

export default AgendamentoVisitacaoPage;
