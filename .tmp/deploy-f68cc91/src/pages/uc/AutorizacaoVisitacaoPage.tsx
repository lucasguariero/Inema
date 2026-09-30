import React, { useState } from 'react';
import {
 FileCheck2,
 FileText,
 Clock,
 MapPin,
 CheckCircle2,
 AlertCircle,
 AlertTriangle,
 Upload,
 Eye,
 Send,
 Download,
 Search,
 Filter,
 Users,
 ShieldCheck,
 Building,
 Check,
 X,
 FileSpreadsheet,
 ArrowRight,
 ArrowLeft,
 ChevronRight,
 Calendar,
 Layers,
 Sparkles,
 Plus,
 Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentSelect, FilamentTabs } from '@/components/filament';
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
import { UNIDADES_CONSERVACAO_BAHIA, ATRATIVOS_MOCK } from './AgendamentoVisitacaoPage';

// Lista de documentos oficiais para instrução AAV (F-DUC-066-00)
export interface DocumentoInstrucao {
 id: string;
 codigo: string;
 nome: string;
 obrigatorio: boolean;
 status: 'Pendente' | 'Enviado' | 'Validado' | 'Recusado';
 arquivoNome?: string;
 tamanho?: string;
}

export const DOCUMENTOS_AAV_PADRAO: DocumentoInstrucao[] = [
 { id: 'doc-1', codigo: 'F-DUC-067', nome: 'Termo de Compromisso e Responsabilidade Ambiental', obrigatorio: true, status: 'Enviado', arquivoNome: 'termo_compromisso_assinado.pdf', tamanho: '420 KB' },
 { id: 'doc-2', codigo: 'F-DUC-068', nome: 'Plano Detalhado da Atividade / Evento em UC', obrigatorio: true, status: 'Enviado', arquivoNome: 'plano_atividades_serra_conduru.pdf', tamanho: '1.8 MB' },
 { id: 'doc-3', codigo: 'F-DUC-068-R', nome: 'Termo de Reconhecimento e Assunção de Riscos', obrigatorio: true, status: 'Enviado', arquivoNome: 'termo_risco_participantes.pdf', tamanho: '310 KB' },
 { id: 'doc-4', codigo: 'DOC-ART', nome: 'ART / RRT do Responsável Técnico do Evento', obrigatorio: true, status: 'Enviado', arquivoNome: 'art_crea_ba_882910.pdf', tamanho: '520 KB' },
 { id: 'doc-5', codigo: 'DOC-POL', nome: 'Apólice de Seguro de Acidentes Pessoais dos Participantes', obrigatorio: true, status: 'Enviado', arquivoNome: 'apolice_seguro_bradesco.pdf', tamanho: '890 KB' },
 { id: 'doc-6', codigo: 'DOC-BOM', nome: 'Anuência do Corpo de Bombeiros Militar (CBM-BA)', obrigatorio: false, status: 'Pendente' },
 { id: 'doc-7', codigo: 'DOC-MUN', nome: 'Alvará / Licença do Município de Localização', obrigatorio: false, status: 'Pendente' }
];

export interface ProcessoAAV {
 id: string; // ex.: SEI-021.9982.2026.001928-11
 numeroSolicitacao: string;
 ucId: string;
 ucNome: string;
 zonaAmortecimento: boolean;
 requerente: string;
 cpfCnpj: string;
 eventoTitulo: string;
 dataEvento: string;
 publicoTotal: number;
 dataAbertura: string;
 prazoDiasRestantes: number; // SLA 20 dias 
 status: 'Em Instrução' | 'Análise Técnica' | 'Em Validação Jurídica' | 'Emitido/Portaria' | 'Indeferido' | 'Aguardando Complementação';
 portariaNumero?: string;
 parecerTecnico?: string;
}

export const AutorizacaoVisitacaoPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
 const { isDarkMode } = useTheme();

 // Visualização ativa: Lista de Processos vs Detalhe/Análise vs Novo Requerimento
 const [abaAtiva, setAbaAtiva] = useState<'painel' | 'analise' | 'novo-requerimento'>('painel');

 // Processos mock AAV
 const [processos, setProcessos] = useState<ProcessoAAV[]>([
 {
 id: 'SEI-021.9982.2026.001928-11',
 numeroSolicitacao: 'AAV-2026-0042',
 ucId: 'UC-CONDURU',
 ucNome: 'Parque Estadual da Serra do Conduru',
 zonaAmortecimento: false,
 requerente: 'Federação Baiana de Montanhismo e Ecoturismo',
 cpfCnpj: '14.890.123/0001-44',
 eventoTitulo: 'Circuito Estadual de Ecoturismo e Corrida em Trilha Conduru 2026',
 dataEvento: '25/10/2026 a 27/10/2026',
 publicoTotal: 180,
 dataAbertura: '05/09/2026',
 prazoDiasRestantes: 7, // Em contagem regressiva para 20 dias
 status: 'Análise Técnica',
 parecerTecnico: 'Área com capacidade de suporte compatível com zoneamento ZUS. Recomendada aprovação condicionada a brigada de incêndio.'
 },
 {
 id: 'SEI-021.3411.2026.000845-92',
 numeroSolicitacao: 'AAV-2026-0038',
 ucId: 'UC-APA-LITORAL-NORTE',
 ucNome: 'APA Litoral Norte do Estado da Bahia',
 zonaAmortecimento: true,
 requerente: 'EcoAventura Produções Ltda',
 cpfCnpj: '22.333.444/0001-55',
 eventoTitulo: 'Festival de Cultura Caiçara e Ecoturismo de Mangue Seco',
 dataEvento: '12/11/2026',
 publicoTotal: 350,
 dataAbertura: '28/08/2026',
 prazoDiasRestantes: 2,
 status: 'Aguardando Complementação'
 },
 {
 id: 'SEI-021.5543.2026.000109-12',
 numeroSolicitacao: 'AAV-2026-0029',
 ucId: 'UC-CONDURU',
 ucNome: 'Parque Estadual da Serra do Conduru',
 zonaAmortecimento: false,
 requerente: 'Instituto Terra Mãe',
 cpfCnpj: '09.112.334/0001-09',
 eventoTitulo: 'Vivência de Imersão e Observação de Avifauna',
 dataEvento: '02/10/2026',
 publicoTotal: 30,
 dataAbertura: '10/08/2026',
 prazoDiasRestantes: 0,
 status: 'Emitido/Portaria',
 portariaNumero: 'Portaria INEMA/DISUC nº 148/2026'
 }
 ]);

 // Processo selecionado para análise técnica e decisão
 const [processoSelecionado, setProcessoSelecionado] = useState<ProcessoAAV>(processos[0]);

 // Checklist de análise técnica do gestor
 const [checklistTecnico, setChecklistTecnico] = useState({
 conformidadeZoneamento: true,
 capacidadeCargaOk: true,
 planoEmergenciaAprovado: true,
 ausenciaImpactoFauna: true,
 mitigacaoResiduosSuficiente: true,
 necessidadeAnuenciaDireg: true
 });

 // Parecer e decisão
 const [parecerTexto, setParecerTexto] = useState(processoSelecionado.parecerTecnico || '');
 const [condicionantesTexto, setCondicionantesTexto] = useState(
 '1. Limite estrito de 180 participantes nas trilhas monitoradas.\n2. Proibido qualquer som amplificado após as 18h.\n3. Presença obrigatória de 2 guias credenciados pelo INEMA.'
 );

 // Estados do Modal de Nova Solicitação de Evento
 const [modalNovoAberto, setModalNovoAberto] = useState(false);
 const [novoEventoTitulo, setNovoEventoTitulo] = useState('');
 const [novoRequerente, setNovoRequerente] = useState('');
 const [novoCpfCnpj, setNovoCpfCnpj] = useState('');
 const [novoUcId, setNovoUcId] = useState('UC-CONDURU');
 const [novoDataEvento, setNovoDataEvento] = useState('2026-11-20');
 const [novoPublico, setNovoPublico] = useState('100');
 const [novoZonaAmortecimento, setNovoZonaAmortecimento] = useState(false);

 const handleCriarNovoProcessoAAV = () => {
 if (!novoEventoTitulo || !novoRequerente) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Campos Obrigatórios',
 mensagem: 'Informe o título do evento e o nome do requerente para autuar o processo.'
 });
 return;
 }

 const proxId = processos.length + 45;
 const novoProc: ProcessoAAV = {
 id: `SEI-021.7744.2026.000${proxId}-22`,
 numeroSolicitacao: `AAV-2026-00${proxId}`,
 ucId: novoUcId,
 ucNome: novoUcId === 'UC-CONDURU' ? 'Parque Estadual da Serra do Conduru' : 'APA Litoral Norte do Estado da Bahia',
 zonaAmortecimento: novoZonaAmortecimento,
 requerente: novoRequerente,
 cpfCnpj: novoCpfCnpj || '00.000.000/0001-00',
 eventoTitulo: novoEventoTitulo,
 dataEvento: novoDataEvento,
 publicoTotal: Number(novoPublico) || 100,
 dataAbertura: '19/09/2026',
 prazoDiasRestantes: 20,
 status: 'Análise Técnica',
 parecerTecnico: ''
 };

 setProcessos([novoProc, ...processos]);
 setProcessoSelecionado(novoProc);
 setModalNovoAberto(false);
 setNovoEventoTitulo('');
 setNovoRequerente('');

 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Processo AAV Autuado com Sucesso',
 mensagem: `Processo formal ${novoProc.id} (${novoProc.numeroSolicitacao}) aberto no SEI-BA! SLA regulamentar de 20 dias iniciado.`
 });
 };

 // Modais de feedback
 const [modalState, setModalState] = useState<{
 isOpen: boolean;
 tipo: 'sucesso' | 'erro' | 'aviso' | 'confirmacao';
 codigo: string;
 titulo: string;
 mensagem: string;
 }>({
 isOpen: false,
 tipo: 'sucesso',
 codigo: '',
 titulo: '',
 mensagem: ''
 });

 // Ação: Emitir Portaria / Deferir
 const handleEmitirPortaria = () => {
 const numPortaria = `Portaria INEMA/DISUC nº ${Math.floor(Math.random() * 200 + 100)}/2026`;
 setProcessos((prev) =>
 prev.map((p) =>
 p.id === processoSelecionado.id
 ? { ...p, status: 'Emitido/Portaria', portariaNumero: numPortaria, parecerTecnico: parecerTexto }
 : p
 )
 );
 setProcessoSelecionado((prev) => ({
 ...prev,
 status: 'Emitido/Portaria',
 portariaNumero: numPortaria,
 parecerTecnico: parecerTexto
 }));

 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Autorização Formal Emitida',
 mensagem: `Documento emitido e disponibilizado ao interessado! Gerada ${numPortaria} com publicação SEI-BA e extrato oficial de autorização .`
 });
 };

 // Ação: Solicitar Complementação
 const handleSolicitarComplementacao = () => {
 setProcessos((prev) =>
 prev.map((p) => (p.id === processoSelecionado.id ? { ...p, status: 'Aguardando Complementação' } : p))
 );
 setProcessoSelecionado((prev) => ({ ...prev, status: 'Aguardando Complementação' }));

 setModalState({
 isOpen: true,
 tipo: 'aviso',
 codigo: '',
 titulo: 'Notificação de Complementação',
 mensagem: 'Há pendências documentais ou técnicas . O interessado foi notificado via sistema e e-mail institucional.'
 });
 };

 // Ação: Indeferimento
 const handleIndeferir = () => {
 setProcessos((prev) =>
 prev.map((p) => (p.id === processoSelecionado.id ? { ...p, status: 'Indeferido' } : p))
 );
 setProcessoSelecionado((prev) => ({ ...prev, status: 'Indeferido' }));

 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Processo Indeferido',
 mensagem: 'Solicitação indeferida formalmente. Motivação técnica registrada no SEI-BA com abertura de prazo recursal de 10 dias .'
 });
 };

 return (
 <div className="space-y-6">
      {/* CABEÇALHO DO MÓDULO COM BOTÃO DE AÇÃO PRIMÁRIA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Autorização Prévia para Realização de Atividades ou Eventos em UC
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Processamento formal, instrução documental, análise técnica e emissão de portaria autorizativa.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalNovoAberto(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F4C3A] hover:bg-[#0c3d2e] rounded-md shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nova Solicitação de Evento
        </button>
      </div>

      {/* NAVEGAÇÃO DE ABAS OFICIAL GLA (FILAMENT) */}
      <FilamentTabs
        tabs={[
          { id: 'painel', label: 'Painel de Processos', badge: processos.length },
          { id: 'analise', label: 'Análise e Portaria' }
        ]}
        activeTab={abaAtiva}
        onChange={(tabId) => {
          if (tabId === 'analise' && !processoSelecionado) {
            setProcessoSelecionado(processos[0]);
          }
          setAbaAtiva(tabId as any);
        }}
        className="mb-6"
      />

 {/* ========================================================================= */}
 {/* ABA 1: PAINEL DE PROCESSOS AAV COM CONTROLE DE SLA E SEI-BA */}
 {/* ========================================================================= */}
 {abaAtiva === 'painel' && (
 <div className="space-y-4">
 {/* CARDS DE INDICADORES / SLA 20 DIAS */}
 <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
 <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
 <CardContent className="p-4 flex items-center justify-between">
 <div>
 <p className="text-[11px] text-slate-500 font-medium">Processos em Análise</p>
 <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
 {processos.filter((p) => p.status === 'Análise Técnica').length}
 </p>
 </div>
 
 </CardContent>
 </Card>

 <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
 <CardContent className="p-4 flex items-center justify-between">
 <div>
 <p className="text-[11px] text-slate-500 font-medium">Portarias Emitidas</p>
 <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
 {processos.filter((p) => p.status === 'Emitido/Portaria').length}
 </p>
 </div>
 
 </CardContent>
 </Card>

 <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
 <CardContent className="p-4 flex items-center justify-between">
 <div>
 <p className="text-[11px] text-slate-500 font-medium">Com Pendências</p>
 <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
 {processos.filter((p) => p.status === 'Aguardando Complementação').length}
 </p>
 </div>
 
 </CardContent>
 </Card>

 <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
 <CardContent className="p-4 flex items-center justify-between">
 <div>
 <p className="text-[11px] text-slate-500 font-medium">SLA Médio INEMA</p>
 <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
 14 dias <span className="text-[10px] font-normal text-slate-400">/ máx 20</span>
 </p>
 </div>
 
 </CardContent>
 </Card>
 </div>

 {/* TABELA DE PROCESSOS AAV */}
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
 <div>
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Painel de Processos Administrativos AAV (SEI-BA)</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Rastreabilidade integral entre requerimento, parecer técnico, atos e prazos.
 </CardDescription>
 </div>
 </CardHeader>

 <CardContent className="p-0">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
 <tr>
 <th className="py-3 px-4">Processo SEI / Req.</th>
 <th className="py-3 px-4">Unidade de Conservação</th>
 <th className="py-3 px-4">Evento / Requerente</th>
 <th className="py-3 px-4">Data do Evento</th>
 <th className="py-3 px-4">Público</th>
 <th className="py-3 px-4">Prazo SLA </th>
 <th className="py-3 px-4">Status</th>
 <th className="py-3 px-4 text-right">Ação</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
 {processos.map((p) => (
 <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
 <td className="py-3 px-4">
 <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">{p.id}</div>
 <div className="text-[10px] text-slate-400 font-mono">{p.numeroSolicitacao}</div>
 </td>
 <td className="py-3 px-4">
 <div className="font-medium text-slate-800 dark:text-slate-200">{p.ucNome}</div>
 {p.zonaAmortecimento && (
 <Badge variant="outline" className="text-[9px] text-amber-600 bg-amber-50 py-0">
 Zona de Amortecimento
 </Badge>
 )}
 </td>
 <td className="py-3 px-4">
 <div className="font-medium max-w-xs truncate">{p.eventoTitulo}</div>
 <div className="text-[11px] text-slate-500">{p.requerente}</div>
 </td>
 <td className="py-3 px-4 font-mono text-[11px]">
 {p.dataEvento}
 </td>
 <td className="py-3 px-4 font-semibold">
 {p.publicoTotal} pessoas
 </td>
 <td className="py-3 px-4">
 {p.status === 'Emitido/Portaria' ? (
 <span className="text-slate-400 text-[11px]">Concluído</span>
 ) : (
 <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
 {p.prazoDiasRestantes} dias restantes
 </span>
 )}
 </td>
 <td className="py-3 px-4">
 <Badge
 variant="outline"
 className={cn(
 "text-[10px]",
 p.status === 'Análise Técnica' && "bg-amber-50 text-amber-700 border-amber-200",
 p.status === 'Emitido/Portaria' && "bg-emerald-50 text-emerald-700 border-emerald-200",
 p.status === 'Aguardando Complementação' && "bg-blue-50 text-blue-700 border-blue-200",
 p.status === 'Indeferido' && "bg-red-50 text-red-700 border-red-200"
 )}
 >
 {p.status}
 </Badge>
 </td>
 <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProcessoSelecionado(p);
                        setParecerTexto(p.parecerTecnico || '');
                        setAbaAtiva('analise');
                      }}
                      className="h-7 text-xs font-medium text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Analisar
                    </Button>
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
 {/* ABA 2: ANÁLISE TÉCNICA E DECISÃO / MINUTA DE PORTARIA */}
 {/* ========================================================================= */}
 {abaAtiva === 'analise' && (
 <div className="space-y-6">
 {/* CABEÇALHO DO PROCESSO EM ANÁLISE */}
 <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono font-bold text-sm text-teal-800 dark:text-teal-300">
 {processoSelecionado.id}
 </span>
 <Badge variant="outline" className="text-[10px] font-mono">
 {processoSelecionado.numeroSolicitacao}
 </Badge>
 <Badge
 variant="outline"
 className={cn(
 "text-[10px]",
 processoSelecionado.status === 'Emitido/Portaria' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
 )}
 >
 {processoSelecionado.status}
 </Badge>
 </div>
 <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
 {processoSelecionado.eventoTitulo}
 </h2>
 <p className="text-slate-500">
 <strong>UC:</strong> {processoSelecionado.ucNome} | <strong>Requerente:</strong> {processoSelecionado.requerente} ({processoSelecionado.cpfCnpj})
 </p>
 </div>

 <div className="text-right shrink-0">
 <span className="text-slate-400 block text-[11px]">Prazo de Resposta do INEMA :</span>
 <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
 {processoSelecionado.prazoDiasRestantes} dias restantes (de 20 dias)
 </span>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* COLUNA ESQUERDA (2 COLS): DOCUMENTAÇÃO E CHECKLIST TÉCNICO */}
 <div className="lg:col-span-2 space-y-6">
 {/* INSTRUÇÃO DOCUMENTAL */}
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <div className="flex items-center justify-between">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Instrução Documental Obrigatória (F-DUC-066-00)</CardTitle>
 <Badge variant="outline" className="text-[10px]">
 {DOCUMENTOS_AAV_PADRAO.filter((d) => d.status === 'Enviado').length} de {DOCUMENTOS_AAV_PADRAO.length} anexados
 </Badge>
 </div>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Documentos formais exigidos para comprovação de responsabilidade e mitigação de impactos.
 </CardDescription>
 </CardHeader>
 <CardContent className="p-0">
 <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
 {DOCUMENTOS_AAV_PADRAO.map((doc) => (
 <div key={doc.id} className="p-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
 <div className="flex items-center gap-2.5">
 <FileText className="w-4 h-4 text-slate-400" />
 <div>
 <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
 <span>{doc.nome}</span>
 <Badge variant="outline" className="text-[9px] font-mono py-0">
 {doc.codigo}
 </Badge>
 </div>
 {doc.arquivoNome && (
 <span className="text-[11px] text-slate-500 font-mono">
 {doc.arquivoNome} ({doc.tamanho})
 </span>
 )}
 </div>
 </div>

 <div className="flex items-center gap-2">
 <Badge
 variant="outline"
 className={cn(
 "text-[10px]",
 doc.status === 'Enviado' && "bg-emerald-50 text-emerald-700 border-emerald-200",
 doc.status === 'Pendente' && "bg-slate-100 text-slate-600"
 )}
 >
 {doc.status}
 </Badge>
 {doc.status === 'Enviado' && (
 <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-600">
 <Eye className="w-3.5 h-3.5" />
 </Button>
 )}
 </div>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>

 {/* CHECKLIST TÉCNICO E PARECER */}
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Análise Técnica e Checklist Normativo (F-DUC-070-00)</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Parecer do Gestor da UC sobre conformidade territorial, zoneamento e salvaguardas.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4 pt-4 text-xs">
 {/* Checklist */}
 <div className="space-y-2 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
 <h4 className="font-semibold text-slate-800 dark:text-slate-200">
 Verificação de Conformidade pelo Gestor
 </h4>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={checklistTecnico.conformidadeZoneamento}
 onChange={(e) => setChecklistTecnico({ ...checklistTecnico, conformidadeZoneamento: e.target.checked })}
 className="rounded text-teal-600 focus:ring-teal-500"
 />
 <span>Compatível com Zoneamento do Plano de Manejo</span>
 </label>

 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={checklistTecnico.capacidadeCargaOk}
 onChange={(e) => setChecklistTecnico({ ...checklistTecnico, capacidadeCargaOk: e.target.checked })}
 className="rounded text-teal-600 focus:ring-teal-500"
 />
 <span>Capacidade de suporte da trilha respeitada</span>
 </label>

 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={checklistTecnico.planoEmergenciaAprovado}
 onChange={(e) => setChecklistTecnico({ ...checklistTecnico, planoEmergenciaAprovado: e.target.checked })}
 className="rounded text-teal-600 focus:ring-teal-500"
 />
 <span>Plano de resgate e brigada de emergência ok</span>
 </label>

 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={checklistTecnico.mitigacaoResiduosSuficiente}
 onChange={(e) => setChecklistTecnico({ ...checklistTecnico, mitigacaoResiduosSuficiente: e.target.checked })}
 className="rounded text-teal-600 focus:ring-teal-500"
 />
 <span>Plano de resíduos e limpeza suficiente</span>
 </label>
 </div>
 </div>

 {/* Texto do Parecer */}
 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Conclusão do Parecer Técnico Estruturado (F-DUC-070-00)
 </label>
 <textarea
 rows={3}
 value={parecerTexto}
 onChange={(e) => setParecerTexto(e.target.value)}
 placeholder="Redija a fundamentação técnica para concessão ou recusa da autorização..."
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>
 </CardContent>
 </Card>
 </div>

 {/* COLUNA DIREITA (1 COL): DECISÃO, CONDICIONANTES E PORTARIA */}
 <div className="space-y-6">
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Decisão e Minuta de Portaria</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 F-DUC-072-00 Minuta de Portaria e atos conclusivos da DIREG/INEMA.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4 pt-4 text-xs">
 {processoSelecionado.portariaNumero ? (
 <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-2">
 <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
 <CheckCircle2 className="w-4 h-4 text-emerald-600" />
 Autorização Emitida!
 </div>
 <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
 {processoSelecionado.portariaNumero}
 </p>
 <p className="text-[11px] text-slate-600 dark:text-slate-400">
 Ato administrativo formal assinado e publicado no Diário Oficial / SEI-BA.
 </p>
 <Button variant="outline" size="sm" className="w-full text-xs font-medium mt-1">
 <Download className="w-3.5 h-3.5 mr-1" />
 Baixar Portaria em PDF
 </Button>
 </div>
 ) : (
 <>
 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Condicionantes Ambientais da Portaria
 </label>
 <textarea
 rows={4}
 value={condicionantesTexto}
 onChange={(e) => setCondicionantesTexto(e.target.value)}
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 <p className="text-[10px] text-slate-400">
 Regras obrigatórias que integrarão a minuta de portaria .
 </p>
 </div>

 <div className="space-y-2 pt-2">
 <Button
 variant="default"
 size="sm"
 onClick={handleEmitirPortaria}
 className="w-full bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold"
 >
 <Check className="w-3.5 h-3.5 mr-1" />
 Emitir Portaria de Autorização
 </Button>

 <Button
 variant="outline"
 size="sm"
 onClick={handleSolicitarComplementacao}
 className="w-full text-xs font-medium text-blue-700 border-blue-300 hover:bg-blue-50"
 >
 <AlertCircle className="w-3.5 h-3.5 mr-1" />
 Solicitar Complementação
 </Button>

 <Button
 variant="outline"
 size="sm"
 onClick={handleIndeferir}
 className="w-full text-xs font-medium text-red-600 border-red-200 hover:bg-red-50"
 >
 <X className="w-3.5 h-3.5 mr-1" />
 Indeferir Processo
 </Button>
 </div>
 </>
 )}
 </CardContent>
 </Card>

 {/* RECURSO ADMINISTRATIVO */}
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50/50 dark:bg-slate-900/40">
 <CardHeader className="pb-2">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Rito Recursal e Prazos</CardTitle>
 </CardHeader>
 <CardContent className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
 <p>• Prazo para análise e emissão: <strong>20 dias</strong> .</p>
 <p>• Em caso de indeferimento, caberá recurso administrativo em até <strong>10 dias</strong>.</p>
 <p>• Tramitação integral sincronizada com SEI-BA.</p>
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 )}

 {/* MODAL: NOVA SOLICITAÇÃO DE EVENTO / AUTORIZAÇÃO PRÉVIA (AAV) */}
 <Dialog open={modalNovoAberto} onOpenChange={setModalNovoAberto}>
 <DialogContent className="sm:max-w-lg">
 <DialogHeader>
 <div className="flex items-center gap-2">
 <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
 Nova Solicitação de Autorização Prévia (AAV)
 </DialogTitle>
 <Badge variant="outline" className="text-[10px] font-mono">F-DUC-068-00</Badge>
 </div>
 <DialogDescription className="text-xs text-slate-500 pt-1">
 Cadastre as informações da atividade/evento para autuação no SEI-BA e início do SLA de 20 dias.
 </DialogDescription>
 </DialogHeader>

 <div className="space-y-3.5 py-2 text-xs">
 <div className="space-y-1">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Título do Evento / Atividade *
 </label>
 <input
 type="text"
 value={novoEventoTitulo}
 onChange={(e) => setNovoEventoTitulo(e.target.value)}
 placeholder="Ex.: Trilha Ecológica Noturna da Biodiversidade"
 className="w-full h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div className="space-y-1">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Nome do Requerente / Entidade *
 </label>
 <input
 type="text"
 value={novoRequerente}
 onChange={(e) => setNovoRequerente(e.target.value)}
 placeholder="Ex.: Instituto de Ecoturismo da Bahia"
 className="w-full h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div className="space-y-1">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 CNPJ / CPF do Responsável
 </label>
 <input
 type="text"
 value={novoCpfCnpj}
 onChange={(e) => setNovoCpfCnpj(e.target.value)}
 placeholder="00.000.000/0001-00"
 className="w-full h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 <div className="space-y-1 sm:col-span-2">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Unidade de Conservação *
 </label>
 <select
 value={novoUcId}
 onChange={(e) => setNovoUcId(e.target.value)}
 className="w-full h-8 px-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
 >
 <option value="UC-CONDURU">Parque Estadual da Serra do Conduru</option>
 <option value="UC-APA-LITORAL-NORTE">APA Litoral Norte do Estado da Bahia</option>
 <option value="UC-CHAPADA-DIAMANTINA">APA Serra do Barbado / Chapada</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Público Total
 </label>
 <input
 type="number"
 value={novoPublico}
 onChange={(e) => setNovoPublico(e.target.value)}
 className="w-full h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>
 </div>

 <div className="flex items-center gap-2 pt-1">
 <input
 type="checkbox"
 id="checkZANovo"
 checked={novoZonaAmortecimento}
 onChange={(e) => setNovoZonaAmortecimento(e.target.checked)}
 className="rounded border-slate-300 text-[#0F4C3A] focus:ring-[#0F4C3A]"
 />
 <label htmlFor="checkZANovo" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
 A atividade incide em Zona de Amortecimento (ZA) da UC
 </label>
 </div>
 </div>

 <DialogFooter className="flex gap-2 sm:justify-end mt-2">
 <Button
 variant="outline"
 size="sm"
 onClick={() => setModalNovoAberto(false)}
 className="text-xs"
 >
 Cancelar
 </Button>
 <Button
 variant="default"
 size="sm"
 onClick={handleCriarNovoProcessoAAV}
 className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold"
 >
 Autuar Processo no SEI-BA
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 {/* DIÁLOGO / MODAL DE MENSAGENS NORMATIVAS */}
 <Dialog open={modalState.isOpen} onOpenChange={(open) => setModalState((prev) => ({ ...prev, isOpen: open }))}>
 <DialogContent className="sm:max-w-md">
 <DialogHeader>
 <div className="flex items-center gap-2 mb-1">
 {modalState.tipo === 'sucesso' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
 {modalState.tipo === 'erro' && <AlertCircle className="w-5 h-5 text-red-600" />}
 {modalState.tipo === 'aviso' && <Info className="w-5 h-5 text-blue-600" />}
 <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
 {modalState.titulo}
 </DialogTitle>
 </div>
 <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
 {modalState.mensagem}
 </DialogDescription>
 </DialogHeader>

 <DialogFooter className="flex gap-2 sm:justify-end mt-4">
 <Button
 variant="default"
 size="sm"
 onClick={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
 className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold"
 >
 OK
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>
 );
};

export default AutorizacaoVisitacaoPage;
