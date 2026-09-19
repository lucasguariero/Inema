import React, { useState } from 'react';
import {
 GraduationCap,
 BookOpen,
 FlaskConical,
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
 Check,
 X,
 Layers,
 Sparkles,
 ArrowRight,
 ArrowLeft,
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

export interface ProcessoAAD {
 id: string; // SEI-021.5544.2026.000789-22
 numeroRequerimento: string;
 tipo: 'Tipo 1 - Sem Coleta' | 'Tipo 2 - Com Coleta/Captura';
 instituicao: string;
 curso: string;
 disciplina: string;
 professorResponsavel: string;
 ucId: string;
 ucNome: string;
 atrativo?: string;
 dataAulaCampo: string;
 quantidadeAlunos: number;
 status: 'Em Análise' | 'Autorizado' | 'Com Pendências' | 'Indeferido';
 autorizacaoNumero?: string;
 parecerTecnico?: string;
 condicionantes?: string[];
 coletaDetalhes?: {
 grupoTaxonomico: string;
 metodoCaptura: string;
 colecaoCientifica: string;
 };
}

export const AtividadesDidaticasPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
 const { isDarkMode } = useTheme();

 // Abas: Solicitação vs Painel de Processos AAD vs Análise Técnica
 const [abaAtiva, setAbaAtiva] = useState<'formulario' | 'painel' | 'analise'>('painel');

 // Tipo selecionado no formulário
 const [tipoDidatica, setTipoDidatica] = useState<'tipo1' | 'tipo2'>('tipo1');

 // Campos do formulário
 const [ucId, setUcId] = useState('UC-CONDURU');
 const [atrativo, setAtrativo] = useState('TRILHA-JEQUITIBA');
 const [instituicao, setInstituicao] = useState('Universidade Estadual de Feira de Santana - UEFS');
 const [curso, setCurso] = useState('Ciências Biológicas (Bacharelado)');
 const [disciplina, setDisciplina] = useState('Ecologia Vegetal de Campo');
 const [professorResponsavel, setProfessorResponsavel] = useState('Prof. Dr. Marcos Vinicius Alcantara');
 const [professorCpf, setProfessorCpf] = useState('321.654.987-00');
 const [professorEmail, setProfessorEmail] = useState('marcos.alcantara@uefs.br');
 const [professorTelefone, setProfessorTelefone] = useState('(75) 3161-8000');
 const [quantidadeAlunos, setQuantidadeAlunos] = useState(28);
 const [dataInicio, setDataInicio] = useState('2026-11-04');
 const [dataFim, setDataFim] = useState('2026-11-05');
 const [metodologiaDidatica, setMetodologiaDidatica] = useState(
 'Amostragem fitossociológica não-destrutiva por quadrantes e identificação in loco de epífitas.'
 );

 // Campos específicos do Tipo 2 (Com Coleta/Captura - )
 const [grupoTaxonomico, setGrupoTaxonomico] = useState('Invertebrados aquáticos e briófitas');
 const [metodoCaptura, setMetodoCaptura] = useState('Rede de mão (puçá) e pinças botânicas');
 const [colecaoCientifica, setColecaoCientifica] = useState('Herbário HUEFS - Coleção de Briófitas da Bahia');
 const [termoDoacaoAnexado, setTermoDoacaoAnexado] = useState(true);

 // Base de processos mock AAD
 const [processos, setProcessos] = useState<ProcessoAAD[]>([
 {
 id: 'SEI-021.5544.2026.000789-22',
 numeroRequerimento: 'AAD-2026-0015',
 tipo: 'Tipo 2 - Com Coleta/Captura',
 instituicao: 'UESC',
 curso: 'Biologia e Ecologia Aplicada',
 disciplina: 'Entomologia Geral e Forense',
 professorResponsavel: 'Dra. Carolina Medeiros',
 ucId: 'UC-CONDURU',
 ucNome: 'Parque Estadual da Serra do Conduru',
 atrativo: 'Trilha do Jequitibá Centenário e Mirante da Serra',
 dataAulaCampo: '20/10/2026 a 22/10/2026',
 quantidadeAlunos: 18,
 status: 'Em Análise',
 parecerTecnico: 'Plano didático em conformidade com as diretrizes do Plano de Manejo da UC. Metodologia de amostragem entomológica não letal com armadilhas pitfall viável e compatível com a capacidade de suporte do atrativo.',
 condicionantes: [
 'Entrega obrigatória de relatório síntese das atividades em até 30 (trinta) dias após a aula de campo.',
 'Proibição expressa de descarte de qualquer resíduo sólido nas trilhas ou na área de amortecimento.',
 'Depósito exclusivo dos espécimes coletados na Coleção Entomológica credenciada da UESC com comprovante de tombamento.',
 'Acompanhamento obrigatório de equipe da gestão da UC ou brigada durante a permanência no parque.'
 ],
 coletaDetalhes: {
 grupoTaxonomico: 'Coleoptera e Hymenoptera (insetos de serrapilheira)',
 metodoCaptura: 'Armadilhas pitfall não letais e rede entomológica',
 colecaoCientifica: 'Coleção Entomológica da UESC'
 }
 },
 {
 id: 'SEI-021.1190.2026.000342-10',
 numeroRequerimento: 'AAD-2026-0012',
 tipo: 'Tipo 1 - Sem Coleta',
 instituicao: 'IFBA Ilhéus',
 curso: 'Técnico em Meio Ambiente',
 disciplina: 'Interpretação Ambiental',
 professorResponsavel: 'Prof. Gilberto Guimarães',
 ucId: 'UC-CONDURU',
 ucNome: 'Parque Estadual da Serra do Conduru',
 atrativo: 'Centro de Visitantes e Trilha dos Macacos',
 dataAulaCampo: '14/10/2026',
 quantidadeAlunos: 32,
 status: 'Autorizado',
 autorizacaoNumero: 'AAD-INEMA nº 084/2026',
 parecerTecnico: 'Atividade pedagógica de interpretação ambiental sem coleta de material biológico, em consonância com a Portaria INEMA nº 25.753/2022.',
 condicionantes: [
 'Respeito rigoroso à capacidade de carga máxima da trilha (35 pessoas por turno).',
 'Permanece expressamente vedada a coleta ou translocação de qualquer elemento da flora ou fauna silvestre.'
 ]
 }
 ]);

 // Processo selecionado para análise
 const [processoSelecionado, setProcessoSelecionado] = useState<ProcessoAAD>(processos[0]);

 // Estados da decisão do gestor
 const [parecerGestor, setParecerGestor] = useState(
 'Plano didático em conformidade com as diretrizes do Plano de Manejo da UC. Metodologia compatível com a capacidade de suporte do atrativo e zoneamento ambiental.'
 );
 const [condicionantesTexto, setCondicionantesTexto] = useState(
 '1. Entrega obrigatória de relatório síntese em até 30 dias.\n2. Proibição expressa de descarte de resíduos na UC.\n3. Depósito dos espécimes exclusivamente na coleção científica indicada.\n4. Acompanhamento por condutor ou equipe da UC.'
 );

 // Modais de feedback
 const [modalState, setModalState] = useState<{
 isOpen: boolean;
 tipo: 'sucesso' | 'erro' | 'aviso';
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

 // Handler para submeter formulário de solicitação AAD
 const handleSubmeterAAD = () => {
 if (!instituicao || !disciplina || !professorResponsavel || !dataInicio) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Campos Obrigatórios',
 mensagem: 'Preencha todos os campos obrigatórios da atividade didática para continuar.'
 });
 return;
 }

 if (tipoDidatica === 'tipo2' && (!grupoTaxonomico || !metodoCaptura || !colecaoCientifica)) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Exigência de Coleta (Tipo 2)',
 mensagem: 'Para Atividade Didática Tipo 2, informe o grupo taxonômico, método de captura e a coleção científica de depósito credenciada .'
 });
 return;
 }

 const novoProcesso: ProcessoAAD = {
 id: `SEI-021.8821.2026.000${processos.length + 10}-01`,
 numeroRequerimento: `AAD-2026-00${processos.length + 16}`,
 tipo: tipoDidatica === 'tipo1' ? 'Tipo 1 - Sem Coleta' : 'Tipo 2 - Com Coleta/Captura',
 instituicao,
 curso,
 disciplina,
 professorResponsavel,
 ucId,
 ucNome: UNIDADES_CONSERVACAO_BAHIA.find((u) => u.value === ucId)?.label || ucId,
 dataAulaCampo: `${dataInicio} a ${dataFim}`,
 quantidadeAlunos,
 status: 'Em Análise',
 coletaDetalhes:
 tipoDidatica === 'tipo2'
 ? {
 grupoTaxonomico,
 metodoCaptura,
 colecaoCientifica
 }
 : undefined
 };

 setProcessos([novoProcesso, ...processos]);

 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Solicitação de AAD Registrada',
 mensagem: `Solicitação ${novoProcesso.numeroRequerimento} protocolada com sucesso no SEI-BA (${novoProcesso.id})! Aguarde a análise da CGEUC/INEMA .`
 });

 setAbaAtiva('painel');
 };

 // Ação de autorização pelo gestor
 const handleAutorizarAAD = () => {
 const numAut = `AAD-INEMA nº ${Math.floor(Math.random() * 200 + 100)}/2026`;
 setProcessos((prev) =>
 prev.map((p) => (p.id === processoSelecionado.id ? { ...p, status: 'Autorizado', autorizacaoNumero: numAut } : p))
 );
 setProcessoSelecionado((prev) => ({ ...prev, status: 'Autorizado', autorizacaoNumero: numAut }));

 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Autorização Didática Emitida',
 mensagem: `Documento emitido com sucesso! Gerada ${numAut} para ${processoSelecionado.instituicao}, liberando a aula prática de campo em conformidade com a Portaria INEMA 25.753/2022.`
 });
 };

  // Ação: Solicitar Adequação ao Docente
  const handleSolicitarAdequacaoAAD = () => {
    setProcessos((prev) =>
      prev.map((p) => (p.id === processoSelecionado.id ? { ...p, status: 'Com Pendências' } : p))
    );
    setProcessoSelecionado((prev) => ({ ...prev, status: 'Com Pendências' }));

    setModalState({
      isOpen: true,
      tipo: 'aviso',
      codigo: '',
      titulo: 'Notificação de Pendência Didática',
      mensagem: 'Foram solicitados esclarecimentos metodológicos ao docente responsável. O interessado foi notificado via sistema e SEI-BA.'
    });
  };

  // Ação: Indeferimento da AAD
  const handleIndeferirAAD = () => {
    setProcessos((prev) =>
      prev.map((p) => (p.id === processoSelecionado.id ? { ...p, status: 'Indeferido' } : p))
    );
    setProcessoSelecionado((prev) => ({ ...prev, status: 'Indeferido' }));

    setModalState({
      isOpen: true,
      tipo: 'erro',
      codigo: '',
      titulo: 'Solicitação AAD Indeferida',
      mensagem: 'A solicitação foi indeferida formalmente pelo Gestor da UC. A motivação técnica foi registrada no processo SEI-BA com abertura de prazo recursal.'
    });
  };

 return (
 <div className="space-y-6">
      {/* CABEÇALHO DO MÓDULO */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Autorização para Realização de Atividades Didáticas em UC
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Aulas práticas e saídas de campo universitárias / técnicas: Tipo 1 (sem coleta) e Tipo 2 (com coleta e captura de espécimes).
        </p>
      </div>

      {/* NAVEGAÇÃO DE ABAS OFICIAL GLA (FILAMENT) */}
      <FilamentTabs
        tabs={[
          { id: 'painel', label: 'Processos AAD', badge: processos.length },
          { id: 'formulario', label: 'Nova Solicitação' },
          { id: 'analise', label: 'Análise e Decisão' }
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
 {/* ABA 1: PAINEL DE PROCESSOS AAD */}
 {/* ========================================================================= */}
 {abaAtiva === 'painel' && (
 <div className="space-y-4">
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
 <div>
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Painel de Atividades Didáticas em UCs Estaduais</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Acompanhamento de processos pedagógicos, saídas de campo e cumprimento de condicionantes (Portaria 25.753/2022).
 </CardDescription>
 </div>
 <Badge variant="outline" className="text-xs font-mono">
 {processos.length} processos cadastrados
 </Badge>
 </CardHeader>

 <CardContent className="p-0">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
 <tr>
 <th className="py-3 px-4">Cód. Processo SEI</th>
 <th className="py-3 px-4">Tipo / Enquadramento</th>
 <th className="py-3 px-4">Instituição de Ensino / Curso</th>
 <th className="py-3 px-4">Disciplina / Professor</th>
 <th className="py-3 px-4">Unidade de Conservação</th>
 <th className="py-3 px-4">Período / Alunos</th>
 <th className="py-3 px-4">Status</th>
 <th className="py-3 px-4 text-right">Ação</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
 {processos.map((p) => (
 <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
 <td className="py-3 px-4">
 <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">{p.id}</div>
 <div className="text-[10px] text-slate-400 font-mono">{p.numeroRequerimento}</div>
 </td>
 <td className="py-3 px-4">
 <Badge
 variant="outline"
 className={cn(
 "text-[10px]",
 p.tipo.includes('Tipo 1')
 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
 : "bg-purple-50 text-purple-700 border-purple-200"
 )}
 >
 {p.tipo}
 </Badge>
 </td>
 <td className="py-3 px-4">
 <div className="font-medium text-slate-800 dark:text-slate-200">{p.instituicao}</div>
 <div className="text-[11px] text-slate-500">{p.curso}</div>
 </td>
 <td className="py-3 px-4">
 <div className="font-medium">{p.disciplina}</div>
 <div className="text-[11px] text-slate-500">{p.professorResponsavel}</div>
 </td>
 <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
 {p.ucNome}
 </td>
 <td className="py-3 px-4 font-mono text-[11px]">
 <div>{p.dataAulaCampo}</div>
 <div className="text-slate-500 font-sans font-medium">{p.quantidadeAlunos} alunos</div>
 </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] whitespace-nowrap shrink-0",
                            p.status === 'Em Análise' && "bg-amber-50 text-amber-700 border-amber-200",
                            p.status === 'Autorizado' && "bg-emerald-50 text-emerald-700 border-emerald-200"
                          )}
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProcessoSelecionado(p);
                            setAbaAtiva('analise');
                          }}
                          className="h-7 text-xs font-medium text-[#0F4C3A] border-slate-300 hover:bg-slate-50 whitespace-nowrap shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 shrink-0" />
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
 {/* ABA 2: FORMULÁRIO DE SOLICITAÇÃO AAD (TIPO 1 vs TIPO 2) */}
 {/* ========================================================================= */}
 {abaAtiva === 'formulario' && (
 <div className="space-y-6">
 {/* SELETOR DE ENQUADRAMENTO DIDÁTICO: TIPO 1 vs TIPO 2 */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setTipoDidatica('tipo1')}
            className={cn(
              "p-4 rounded-lg border cursor-pointer transition-all space-y-1.5",
              tipoDidatica === 'tipo1'
                ? "border-[#0F4C3A] bg-[#0F4C3A]/5 dark:bg-[#0F4C3A]/20 shadow-xs ring-1 ring-[#0F4C3A]"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                AAD Tipo 1 — Sem Coleta de Material
              </span>
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                Rito Simplificado
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Aulas práticas de observação, trilhas interpretativas, identificação botânica in loco e atividades sem remoção de amostras biológicas.
            </p>
          </div>

          <div
            onClick={() => setTipoDidatica('tipo2')}
            className={cn(
              "p-4 rounded-lg border cursor-pointer transition-all space-y-1.5",
              tipoDidatica === 'tipo2'
                ? "border-[#0F4C3A] bg-[#0F4C3A]/5 dark:bg-[#0F4C3A]/20 shadow-xs ring-1 ring-[#0F4C3A]"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                AAD Tipo 2 — Com Coleta e Captura de Espécimes
              </span>
              <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-700 border-slate-200">
                Exige Termo de Depósito
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Aulas com coleta de espécimes botânicos, captura temporária de fauna, transporte biológico e tombamento obrigatório em coleção científica.
            </p>
          </div>
 </div>

 {/* FORMULÁRIO OPERACIONAL */}
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dados do Requerimento Didático ({tipoDidatica === 'tipo1' ? 'Tipo 1' : 'Tipo 2'})</CardTitle>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Preencha os dados institucionais, professor responsável e plano metodológico da aula prática.
 </CardDescription>
 </CardHeader>

 <CardContent className="space-y-4 pt-5 text-xs">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1.5 sm:col-span-2">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Instituição de Ensino Superior ou Técnico (IES) *
 </label>
 <input
 type="text"
 value={instituicao}
 onChange={(e) => setInstituicao(e.target.value)}
 placeholder="Ex.: Universidade Federal da Bahia - UFBA"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Curso de Graduação / Técnico *
 </label>
 <input
 type="text"
 value={curso}
 onChange={(e) => setCurso(e.target.value)}
 placeholder="Ex.: Engenharia Florestal"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Disciplina Curricular *
 </label>
 <input
 type="text"
 value={disciplina}
 onChange={(e) => setDisciplina(e.target.value)}
 placeholder="Ex.: Zoologia de Vertebrados"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Professor(a) Responsável / Coordenador(a) *
 </label>
 <input
 type="text"
 value={professorResponsavel}
 onChange={(e) => setProfessorResponsavel(e.target.value)}
 placeholder="Nome completo do docente"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 CPF do Docente *
 </label>
 <input
 type="text"
 value={professorCpf}
 onChange={(e) => setProfessorCpf(e.target.value)}
 placeholder="000.000.000-00"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Unidade de Conservação (UC) *
 </label>
 <FilamentSelect
 value={ucId}
 onChange={(val) => setUcId(val)}
 options={UNIDADES_CONSERVACAO_BAHIA.filter((u) => u.habilitada).map((u) => ({
 value: u.value,
 label: u.label
 }))}
 placeholder="Selecione a UC..."
 className="w-full text-xs"
 />
 </div>

 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Quantidade de Estudantes Participantes *
 </label>
 <input
 type="number"
 min="1"
 value={quantidadeAlunos}
 onChange={(e) => setQuantidadeAlunos(Number(e.target.value))}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Data Início da Aula de Campo *
 </label>
 <input
 type="date"
 value={dataInicio}
 onChange={(e) => setDataInicio(e.target.value)}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Data Fim da Aula de Campo *
 </label>
 <input
 type="date"
 value={dataFim}
 onChange={(e) => setDataFim(e.target.value)}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>
 </div>

 {/* BLOCO ESPECÍFICO DO TIPO 2: COLETA E CAPTURA */}
 {tipoDidatica === 'tipo2' && (
 <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800 mt-2">
 <div className="flex items-center justify-between">
 <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
 Especificação de Coleta / Captura Didática
 </h3>
 <Badge variant="outline" className="text-[10px] text-slate-600 border-slate-200 font-mono">
 Exigência Especial
 </Badge>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Grupo Taxonômico Objeto da Coleta *
 </label>
 <input
 type="text"
 value={grupoTaxonomico}
 onChange={(e) => setGrupoTaxonomico(e.target.value)}
 placeholder="Ex.: Briófitas epífitas / Insetos aquáticos"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#0F4C3A]"
 />
 </div>

 <div className="space-y-1.5">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Método e Instrumentos de Captura / Coleta *
 </label>
 <input
 type="text"
 value={metodoCaptura}
 onChange={(e) => setMetodoCaptura(e.target.value)}
 placeholder="Ex.: Rede entomológica, pinça botânica, frascos com álcool 70%"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#0F4C3A]"
 />
 </div>

 <div className="space-y-1.5 sm:col-span-2">
 <label className="font-semibold text-slate-700 dark:text-slate-300">
 Coleção Científica / Herbário de Destinação Obrigatória *
 </label>
 <input
 type="text"
 value={colecaoCientifica}
 onChange={(e) => setColecaoCientifica(e.target.value)}
 placeholder="Ex.: Herbário da UEFS ou Museu de Zoologia da UFBA"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#0F4C3A]"
 />
 </div>
 </div>
 </div>
 )}
 </CardContent>

 <CardFooter className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
 <Button
 variant="outline"
 size="sm"
 onClick={() => setAbaAtiva('painel')}
 className="text-xs"
 >
 Cancelar
 </Button>
 <Button
 variant="default"
 size="sm"
 onClick={handleSubmeterAAD}
 className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold shadow-xs"
 >
 <Send className="w-3.5 h-3.5 mr-1" />
 Submeter Solicitação AAD
 </Button>
 </CardFooter>
 </Card>
 </div>
 )}

      {/* ========================================================================= */}
      {/* ABA 3: ANÁLISE TÉCNICA E EMISSÃO DE AUTORIZAÇÃO */}
      {/* ========================================================================= */}
      {abaAtiva === 'analise' && (() => {
        const processoFoco = processoSelecionado || processos[0];
        if (!processoFoco) return null;

        return (
          <div className="space-y-6">
            {/* Top Process Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
                      {processoFoco.id}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {processoFoco.numeroRequerimento}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px] font-medium",
                        processoFoco.tipo.includes('Tipo 1')
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                      )}
                    >
                      {processoFoco.tipo}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        processoFoco.status === 'Autorizado' && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
                        processoFoco.status === 'Em Análise' && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
                        processoFoco.status === 'Com Pendências' && "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
                        processoFoco.status === 'Indeferido' && "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                      )}
                    >
                      {processoFoco.status}
                    </Badge>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {processoFoco.disciplina} — {processoFoco.instituicao}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Unidade de Conservação: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{processoFoco.ucNome}</strong> | Docente Responsável: {processoFoco.professorResponsavel} ({processoFoco.curso})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {processoFoco.status === 'Autorizado' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-medium border-slate-300 text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:bg-slate-800"
                      onClick={() => {
                        alert('Download do Certificado formal de AAD emitido pelo INEMA em PDF com assinatura digital.');
                      }}
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Baixar Certificado AAD (PDF)
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAbaAtiva('painel')}
                    className="text-xs font-medium border-slate-300 text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:bg-slate-800"
                  >
                    Voltar aos Processos
                  </Button>
                </div>
              </div>
            </div>

            {/* Grid Principal: Detalhes do Plano Didático (2 Cols) + Parecer e Decisão (1 Col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              {/* COLUNA ESQUERDA (2 COLS): PLANO DIDÁTICO E SALVAGUARDAS */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="py-3.5 px-5 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Plano Didático e Metodologia da Aula Prática
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Caracterização pedagógica e justificativa em conformidade com a Portaria INEMA nº 25.753/2022.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        Objetivo Pedagógico / Ementa de Campo:
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-md border border-slate-200 dark:border-slate-800 leading-relaxed">
                        Aplicação prática dos conceitos teóricos de ecologia e taxonomia vegetal/animal em ecossistema de Mata Atlântica preservado, visando a formação técnica dos discentes por meio de observação in loco e levantamento sistemático.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-medium block">Período da Atividade:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">{processoFoco.dataAulaCampo}</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-medium block">Contingente de Alunos:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">{processoFoco.quantidadeAlunos} alunos matriculados</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-medium block">Local / Atrativo na UC:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">{processoFoco.atrativo || 'Trilhas regulamentadas da UC'}</span>
                      </div>
                    </div>

                    {/* Detalhamento de Coleta (Tipo 2) em tom neutro padrão GLA */}
                    {processoFoco.coletaDetalhes && (
                      <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2.5">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center justify-between">
                          <span>Especificações da Coleta Científica Autorizada (Tipo 2):</span>
                          <Badge variant="outline" className="text-[10px] bg-white dark:bg-slate-800 text-slate-600">
                            Exigência RN010
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[11px]">Grupo Taxonômico Amostrado:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{processoFoco.coletaDetalhes.grupoTaxonomico}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[11px]">Método de Coleta / Captura:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{processoFoco.coletaDetalhes.metodoCaptura}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 block text-[11px]">Coleção Científica Credenciada / Fiel Depositária:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{processoFoco.coletaDetalhes.colecaoCientifica}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Diretrizes de Mínimo Impacto e Segurança Operacional:
                      </h4>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                        <li>Permanência restrita aos limites das trilhas oficiais sem abertura de picadas pioneiras.</li>
                        <li>Proibição de fogueiras, equipamentos sonoros e descarte de quaisquer resíduos na UC.</li>
                        <li>Presença contínua do professor orientador durante todas as etapas das aulas de campo.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* COLUNA DIREITA (1 COL): DECISÃO E MINUTA DE AUTORIZAÇÃO */}
              <div className="space-y-6">
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="py-3.5 px-5 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Decisão e Emissão da Autorização
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Parecer técnico conclusivo e atos do Gestor da UC / INEMA.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 space-y-4">
                    {processoFoco.autorizacaoNumero ? (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Autorização Didática Concedida!
                        </div>
                        <p className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {processoFoco.autorizacaoNumero}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          Ato administrativo formal emitido e comunicado ao interessado com publicação SEI-BA.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs font-medium border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                          onClick={() => {
                            alert('Download do Certificado formal de AAD emitido pelo INEMA em PDF.');
                          }}
                        >
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          Baixar Certificado AAD (PDF)
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                            Parecer Técnico Conclusivo do Gestor:
                          </label>
                          <textarea
                            rows={3}
                            value={parecerGestor}
                            onChange={(e) => setParecerGestor(e.target.value)}
                            className="w-full text-xs p-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#0F4C3A]"
                            placeholder="Fundamente a conformidade técnica com o zoneamento..."
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                            Condicionantes Ambientais Fixadas:
                          </label>
                          <textarea
                            rows={4}
                            value={condicionantesTexto}
                            onChange={(e) => setCondicionantesTexto(e.target.value)}
                            className="w-full text-xs p-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-[11px] focus:ring-1 focus:ring-[#0F4C3A]"
                            placeholder="Enumere as condicionantes do ato..."
                          />
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <Button
                            size="sm"
                            onClick={handleAutorizarAAD}
                            className="w-full bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                            Deferir e Emitir Autorização
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSolicitarAdequacaoAAD}
                            className="w-full text-xs font-medium border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                          >
                            Solicitar Adequação ao Docente
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleIndeferirAAD}
                            className="w-full text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            Indeferir Solicitação
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      })()}

      {/* DIÁLOGO / MODAL DE FEEDBACK */}
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
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold shadow-xs"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
 </Dialog>
 </div>
 );
};

export default AtividadesDidaticasPage;
