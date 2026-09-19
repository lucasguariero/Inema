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
 dataAulaCampo: string;
 quantidadeAlunos: number;
 status: 'Em Análise' | 'Autorizado' | 'Com Pendências' | 'Indeferido';
 autorizacaoNumero?: string;
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
 dataAulaCampo: '20/10/2026 a 22/10/2026',
 quantidadeAlunos: 18,
 status: 'Em Análise',
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
 dataAulaCampo: '14/10/2026',
 quantidadeAlunos: 32,
 status: 'Autorizado',
 autorizacaoNumero: 'AAD-INEMA nº 084/2026'
 }
 ]);

 // Processo selecionado para análise
 const [processoSelecionado, setProcessoSelecionado] = useState<ProcessoAAD>(processos[0]);

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
 <div className="font-mono font-semibold text-teal-700 dark:text-teal-400">{p.id}</div>
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
 "p-4 rounded-xl border-2 cursor-pointer transition-all space-y-1.5",
 tipoDidatica === 'tipo1'
 ? "border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 shadow-xs"
 : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-70 hover:opacity-100"
 )}
 >
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
 
 AAD Tipo 1 — Sem Coleta de Material
 </span>
 <Badge variant="outline" className="text-[10px] bg-teal-100 text-teal-800 border-teal-300">
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
 "p-4 rounded-xl border-2 cursor-pointer transition-all space-y-1.5",
 tipoDidatica === 'tipo2'
 ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 shadow-xs"
 : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-70 hover:opacity-100"
 )}
 >
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
 
 AAD Tipo 2 — Com Coleta e Captura de Espécimes
 </span>
 <Badge variant="outline" className="text-[10px] bg-purple-100 text-purple-800 border-purple-300">
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
 <div className="space-y-3 bg-purple-50/60 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mt-2">
 <div className="flex items-center justify-between">
 <h3 className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
 
 Especificação de Coleta / Captura Didática
 </h3>
 <Badge variant="outline" className="text-[10px] text-purple-700 border-purple-300 font-mono">
 Critérios Especiais
 </Badge>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
 <div className="space-y-1.5">
 <label className="font-semibold text-purple-900 dark:text-purple-200">
 Grupo Taxonômico Objeto da Coleta *
 </label>
 <input
 type="text"
 value={grupoTaxonomico}
 onChange={(e) => setGrupoTaxonomico(e.target.value)}
 placeholder="Ex.: Briófitas epífitas / Insetos aquáticos"
 className="w-full text-xs h-9 px-3 rounded-md border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5">
 <label className="font-semibold text-purple-900 dark:text-purple-200">
 Método e Instrumentos de Captura / Coleta *
 </label>
 <input
 type="text"
 value={metodoCaptura}
 onChange={(e) => setMetodoCaptura(e.target.value)}
 placeholder="Ex.: Rede entomológica, pinça botânica, frascos com álcool 70%"
 className="w-full text-xs h-9 px-3 rounded-md border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
 />
 </div>

 <div className="space-y-1.5 sm:col-span-2">
 <label className="font-semibold text-purple-900 dark:text-purple-200">
 Coleção Científica / Herbário de Destinação Obrigatória *
 </label>
 <input
 type="text"
 value={colecaoCientifica}
 onChange={(e) => setColecaoCientifica(e.target.value)}
 placeholder="Ex.: Herbário da UEFS ou Museu de Zoologia da UFBA"
 className="w-full text-xs h-9 px-3 rounded-md border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
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
 className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
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
 {abaAtiva === 'analise' && (
 <div className="space-y-6">
 <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono font-bold text-sm text-teal-800 dark:text-teal-300">
 {processoSelecionado.id}
 </span>
 <Badge variant="outline" className="text-[10px] font-mono">
 {processoSelecionado.numeroRequerimento}
 </Badge>
 <Badge
 variant="outline"
 className={cn(
 "text-[10px]",
 processoSelecionado.tipo.includes('Tipo 1')
 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
 : "bg-purple-50 text-purple-700 border-purple-200"
 )}
 >
 {processoSelecionado.tipo}
 </Badge>
 </div>
 <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
 {processoSelecionado.disciplina} — {processoSelecionado.instituicao}
 </h2>
 <p className="text-slate-500">
 <strong>Docente:</strong> {processoSelecionado.professorResponsavel} | <strong>Participantes:</strong> {processoSelecionado.quantidadeAlunos} alunos
 </p>
 </div>

 <div className="text-right">
 <Badge
 variant="outline"
 className={cn(
 "text-xs px-2.5 py-0.5",
 processoSelecionado.status === 'Autorizado' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
 )}
 >
 {processoSelecionado.status}
 </Badge>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
 {/* DETALHES E METODOLOGIA */}
 <div className="lg:col-span-2 space-y-4">
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
 Plano Didático e Diretrizes de Campo
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-3 pt-4">
 <div>
 <span className="font-semibold text-slate-700 dark:text-slate-300 block">Objetivo Pedagógico:</span>
 <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
 Aplicação prática dos conceitos teóricos de ecologia e taxonomia vegetal/animal em ecossistema de Mata Atlântica preservado.
 </p>
 </div>

 {processoSelecionado.coletaDetalhes && (
 <div className="bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800 space-y-1.5">
 <div className="font-bold text-purple-900 dark:text-purple-200">
 Detalhamento de Coleta Autorizada (Tipo 2):
 </div>
 <p><strong>Grupo:</strong> {processoSelecionado.coletaDetalhes.grupoTaxonomico}</p>
 <p><strong>Método:</strong> {processoSelecionado.coletaDetalhes.metodoCaptura}</p>
 <p><strong>Destino:</strong> {processoSelecionado.coletaDetalhes.colecaoCientifica}</p>
 </div>
 )}
 </CardContent>
 </Card>
 </div>

 {/* DECISÃO DA AUTORIZAÇÃO */}
 <div>
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Decisão de Autorização AAD</CardTitle>
 </CardHeader>
 <CardContent className="space-y-4 pt-4">
 {processoSelecionado.autorizacaoNumero ? (
 <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-2">
 <div className="font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
 <Check className="w-4 h-4 text-emerald-600" />
 Autorização Didática Concedida!
 </div>
 <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
 {processoSelecionado.autorizacaoNumero}
 </p>
 <Button variant="outline" size="sm" className="w-full text-xs font-medium">
 <Download className="w-3.5 h-3.5 mr-1" />
 Baixar Certificado AAD
 </Button>
 </div>
 ) : (
 <div className="space-y-2">
 <p className="text-slate-500 leading-relaxed">
 O parecer do gestor indicou compatibilidade plena com o zoneamento da UC.
 </p>
 <Button
 variant="default"
 size="sm"
 onClick={handleAutorizarAAD}
 className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
 >
 <Check className="w-3.5 h-3.5 mr-1" />
 Deferir e Emitir Autorização
 </Button>
 </div>
 )}
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 )}

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
 className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
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
