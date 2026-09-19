import React, { useState } from 'react';
import {
 Calendar,
 Users,
 Car,
 Clock,
 Search,
 Plus,
 Trash2,
 AlertCircle,
 CheckCircle2,
 Info,
 CalendarDays,
 FileCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentSelect } from '@/components/filament';
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
import { UNIDADES_REGIONAIS_INEMA } from './CadastroPlantonistaPage';

// Plantonistas cadastrados no sistema disponíveis para escala
export interface PlantonistaDisponivel {
 id: string;
 nome: string;
 cpf: string;
 telefoneInstitucional: string;
 telefonePlantonista: string;
 unidadeRegional: string;
}

export const PLANTONISTAS_BASE_MOCK: PlantonistaDisponivel[] = [
 {
 id: 'PLANT-001',
 nome: 'Carlos Eduardo Silveira',
 cpf: '123.456.789-00',
 telefoneInstitucional: '(71) 3118-4200',
 telefonePlantonista: '(71) 99123-4567',
 unidadeRegional: 'UR-SALVADOR'
 },
 {
 id: 'PLANT-002',
 nome: 'Mariana Costa Ribeiro',
 cpf: '234.567.890-11',
 telefoneInstitucional: '(75) 3602-1200',
 telefonePlantonista: '(71) 98765-4321',
 unidadeRegional: 'UR-FEIRA'
 },
 {
 id: 'PLANT-003',
 nome: 'Roberto Alves Mendonça',
 cpf: '345.678.901-22',
 telefoneInstitucional: '(71) 3118-4500',
 telefonePlantonista: '(75) 99888-1122',
 unidadeRegional: 'UR-SALVADOR'
 },
 {
 id: 'PLANT-004',
 nome: 'Ana Flávia Castro Souza',
 cpf: '456.789.012-33',
 telefoneInstitucional: '(74) 3611-3000',
 telefonePlantonista: '(74) 98111-2233',
 unidadeRegional: 'UR-JUAZEIRO'
 }
];

export interface ItemPlantonistaEscala {
 id: string;
 plantonistaId: string;
 nome: string;
 cpf: string;
 telefoneInstitucional: string;
 telefonePlantonista: string;
}

export interface EscalaCadastrada {
 id: string;
 dataInicio: string; // YYYY-MM-DD
 dataFim: string; // YYYY-MM-DD
 unidadeRegional: string;
 plantonistas: ItemPlantonistaEscala[];
 motorista?: string;
 telefoneMotorista?: string;
 numeroHoras?: string;
 numeroEquivalente?: string;
 status: 'Ativa' | 'Concluída' | 'Prevista';
}

export const CadastroEscalaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
 const { isDarkMode } = useTheme();

 // Campos do formulário
 const [dataInicio, setDataInicio] = useState('2026-09-21');
 const [dataFim, setDataFim] = useState('2026-09-28');
 const [unidadeRegional, setUnidadeRegional] = useState('UR-SALVADOR');
 const [motorista, setMotorista] = useState('');
 const [telefoneMotorista, setTelefoneMotorista] = useState('');
 const [numeroHoras, setNumeroHoras] = useState('168');
 const [numeroEquivalente, setNumeroEquivalente] = useState('1.0');

 // Plantonistas vinculados à escala atual
 const [plantonistasEscala, setPlantonistasEscala] = useState<ItemPlantonistaEscala[]>([
 {
 id: 'item-1',
 plantonistaId: 'PLANT-001',
 nome: 'Carlos Eduardo Silveira',
 cpf: '123.456.789-00',
 telefoneInstitucional: '(71) 3118-4200',
 telefonePlantonista: '(71) 99123-4567'
 }
 ]);

 // Seletor para adicionar novo plantonista à escala
 const [plantonistaSelecionadoId, setPlantonistaSelecionadoId] = useState('');

 // Modo de edição após recuperação
 const [isModoEdicao, setIsModoEdicao] = useState(false);
 const [escalaEmEdicaoId, setEscalaEmEdicaoId] = useState<string | null>(null);

 // Base mock de escalas já cadastradas
 const [escalasCadastradas, setEscalasCadastradas] = useState<EscalaCadastrada[]>([
 {
 id: 'ESC-2026-001',
 dataInicio: '2026-09-14',
 dataFim: '2026-09-21',
 unidadeRegional: 'UR-SALVADOR',
 plantonistas: [
 {
 id: 'item-esc-1',
 plantonistaId: 'PLANT-001',
 nome: 'Carlos Eduardo Silveira',
 cpf: '123.456.789-00',
 telefoneInstitucional: '(71) 3118-4200',
 telefonePlantonista: '(71) 99123-4567'
 }
 ],
 motorista: 'Raimundo Nonato',
 telefoneMotorista: '(71) 98877-6655',
 numeroHoras: '168',
 numeroEquivalente: '1.0',
 status: 'Concluída'
 },
 {
 id: 'ESC-2026-002',
 dataInicio: '2026-09-28',
 dataFim: '2026-10-05',
 unidadeRegional: 'UR-FEIRA',
 plantonistas: [
 {
 id: 'item-esc-2',
 plantonistaId: 'PLANT-002',
 nome: 'Mariana Costa Ribeiro',
 cpf: '234.567.890-11',
 telefoneInstitucional: '(75) 3602-1200',
 telefonePlantonista: '(71) 98765-4321'
 }
 ],
 motorista: 'Jorge Amado Neto',
 telefoneMotorista: '(75) 99112-3344',
 numeroHoras: '168',
 numeroEquivalente: '1.0',
 status: 'Prevista'
 }
 ]);

 // Modais de feedback e regras do 
 const [modalState, setModalState] = useState<{
 isOpen: boolean;
 tipo: 'erro' | 'sucesso' | 'aviso' | 'confirmacao-exclusao';
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

 // Limpar formulário
 const handleNovo = () => {
 setDataInicio('');
 setDataFim('');
 setUnidadeRegional('');
 setMotorista('');
 setTelefoneMotorista('');
 setNumeroHoras('');
 setNumeroEquivalente('');
 setPlantonistasEscala([]);
 setPlantonistaSelecionadoId('');
 setIsModoEdicao(false);
 setEscalaEmEdicaoId(null);
 };

 // Adicionar plantonista e recuperar telefones automaticamente
 const handleAdicionarPlantonista = () => {
 if (!plantonistaSelecionadoId) return;

 // Verificar se o plantonista já está na lista atual
 if (plantonistasEscala.some((p) => p.plantonistaId === plantonistaSelecionadoId)) {
 setModalState({
 isOpen: true,
 tipo: 'aviso',
 codigo: '',
 titulo: 'Plantonista Já Adicionado',
 mensagem: 'Este plantonista já integra a presente escala.'
 });
 return;
 }

 // Verificar sobreposição de períodos em outras escalas
 if (dataInicio && dataFim) {
 const temSobreposicao = escalasCadastradas.some((esc) => {
 if (isModoEdicao && esc.id === escalaEmEdicaoId) return false;
 const coincidePeriodo =
 (dataInicio >= esc.dataInicio && dataInicio <= esc.dataFim) ||
 (dataFim >= esc.dataInicio && dataFim <= esc.dataFim) ||
 (dataInicio <= esc.dataInicio && dataFim >= esc.dataFim);
 return coincidePeriodo && esc.plantonistas.some((p) => p.plantonistaId === plantonistaSelecionadoId);
 });

 if (temSobreposicao) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Sobreposição de Escala',
 mensagem: 'O plantonista selecionado já possui escala cadastrada em período conflitante.'
 });
 return;
 }
 }

 const plantonistaEncontrado = PLANTONISTAS_BASE_MOCK.find((p) => p.id === plantonistaSelecionadoId);
 if (!plantonistaEncontrado) return;

 // Garantir integração automática dos telefones
 const novoItem: ItemPlantonistaEscala = {
 id: `item-${Date.now()}`,
 plantonistaId: plantonistaEncontrado.id,
 nome: plantonistaEncontrado.nome,
 cpf: plantonistaEncontrado.cpf,
 telefoneInstitucional: plantonistaEncontrado.telefoneInstitucional,
 telefonePlantonista: plantonistaEncontrado.telefonePlantonista
 };

 setPlantonistasEscala([...plantonistasEscala, novoItem]);
 setPlantonistaSelecionadoId('');
 };

 // Remover plantonista da escala em edição
 const handleRemoverPlantonista = (idItem: string) => {
 setPlantonistasEscala(plantonistasEscala.filter((p) => p.id !== idItem));
 };

 // Validação de número de horas
 const handleHorasChange = (val: string) => {
 const apenasNumeros = val.replace(/\D/g, '').slice(0, 10);
 setNumeroHoras(apenasNumeros);
 };

 // Validação de número equivalente
 const handleNumeroEquivalenteChange = (val: string) => {
 const permitido = val.replace(/[^0-9.,-]/g, '').slice(0, 10);
 setNumeroEquivalente(permitido);
 };

 // Salvar Escala
 const handleSalvar = () => {
 // Validação integral de campos obrigatórios
 if (!dataInicio || !dataFim || !unidadeRegional || plantonistasEscala.length === 0) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Validação de Campos',
 mensagem: 'Campo obrigatório não preenchido!'
 });
 return;
 }

 // Validar que todos os plantonistas possuem telefones recuperados
 for (const p of plantonistasEscala) {
 if (!p.telefoneInstitucional.trim() || !p.telefonePlantonista.trim()) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Telefones Obrigatórios',
 mensagem: `Campo obrigatório não preenchido! O plantonista ${p.nome} necessita dos telefones integrados.`
 });
 return;
 }
 }

 // Prevenção de duplicidade (mesmo período, mesma UR e mesmo plantonista)
 for (const p of plantonistasEscala) {
 const duplicada = escalasCadastradas.some((esc) => {
 if (isModoEdicao && esc.id === escalaEmEdicaoId) return false;
 return (
 esc.dataInicio === dataInicio &&
 esc.dataFim === dataFim &&
 esc.unidadeRegional === unidadeRegional &&
 esc.plantonistas.some((item) => item.plantonistaId === p.plantonistaId)
 );
 });

 if (duplicada) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Duplicidade Detectada',
 mensagem: `Escala já cadastrada para o período, UR e o plantonista ${p.nome}.`
 });
 return;
 }
 }

 // Gravação ou Atualização
 if (isModoEdicao && escalaEmEdicaoId) {
 setEscalasCadastradas((prev) =>
 prev.map((esc) =>
 esc.id === escalaEmEdicaoId
 ? {
 ...esc,
 dataInicio,
 dataFim,
 unidadeRegional,
 plantonistas: plantonistasEscala,
 motorista,
 telefoneMotorista,
 numeroHoras,
 numeroEquivalente
 }
 : esc
 )
 );
 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Sucesso',
 mensagem: 'Escala atualizada com sucesso!'
 });
 } else {
 const novaEscala: EscalaCadastrada = {
 id: `ESC-2026-00${escalasCadastradas.length + 1}`,
 dataInicio,
 dataFim,
 unidadeRegional,
 plantonistas: plantonistasEscala,
 motorista,
 telefoneMotorista,
 numeroHoras,
 numeroEquivalente,
 status: 'Prevista'
 };
 setEscalasCadastradas([novaEscala, ...escalasCadastradas]);
 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Sucesso',
 mensagem: 'Escala criada com sucesso!'
 });
 }
 };

 // Recuperar Escala 
 const handleRecuperar = (escalaParaRecuperar?: EscalaCadastrada) => {
 let escala: EscalaCadastrada | undefined = escalaParaRecuperar;

 if (!escala) {
 // Buscar pelo período informado
 escala = escalasCadastradas.find(
 (esc) => esc.dataInicio === dataInicio && esc.dataFim === dataFim
 );
 }

 if (escala) {
 setDataInicio(escala.dataInicio);
 setDataFim(escala.dataFim);
 setUnidadeRegional(escala.unidadeRegional);
 setMotorista(escala.motorista || '');
 setTelefoneMotorista(escala.telefoneMotorista || '');
 setNumeroHoras(escala.numeroHoras || '');
 setNumeroEquivalente(escala.numeroEquivalente || '');
 setPlantonistasEscala(escala.plantonistas);
 setIsModoEdicao(true);
 setEscalaEmEdicaoId(escala.id);

 setModalState({
 isOpen: true,
 tipo: 'aviso',
 codigo: '',
 titulo: 'Recuperação Efetuada',
 mensagem: 'Escala já registrada. Dados carregados para visualização ou edição.'
 });
 } else {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Nenhuma Escala Localizada',
 mensagem: 'Não foi encontrada nenhuma escala para o período informado.'
 });
 }
 };

 // Excluir Escala
 const handleExcluir = () => {
 if (!isModoEdicao && !escalaEmEdicaoId) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Aviso',
 mensagem: 'Selecione ou recupere uma escala previamente cadastrada para efetuar a exclusão.'
 });
 return;
 }

 setModalState({
 isOpen: true,
 tipo: 'confirmacao-exclusao',
 codigo: '',
 titulo: 'Confirmação de Exclusão',
 mensagem: 'Deseja excluir a escala do período?'
 });
 };

 // Confirmar exclusão definitiva (SIM na )
 const handleConfirmarExclusaoDefinitiva = () => {
 if (escalaEmEdicaoId) {
 setEscalasCadastradas((prev) => prev.filter((esc) => esc.id !== escalaEmEdicaoId));
 handleNovo();
 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Operação Concluída',
 mensagem: 'Exclusão realizada com sucesso'
 });
 }
 };

 return (
 <div className="space-y-6">
      {/* CABEÇALHO DO MÓDULO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Cadastro de Escala de Plantonistas
            </h1>
            {isModoEdicao && (
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                Edição de Escala
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gerenciamento de escalas semanais, associação de técnicos com contatos integrados e controle de abrangência regional.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('consulta-interna')}
              className="text-xs font-medium border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
            >
              Voltar ao Painel
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleNovo}
            className="text-xs font-semibold bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Nova Escala
          </Button>
        </div>
      </div>

 {/* GRID PRINCIPAL: FORMULÁRIO (ESQUERDA) + HISTÓRICO DE ESCALAS (DIREITA) */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* COLUNA ESQUERDA: FORMULÁRIO */}
 <div className="lg:col-span-2 space-y-6">
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <div className="flex items-center justify-between">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dados Gerais da Escala</CardTitle>
 <span className="text-[11px] text-slate-400 font-mono">
 {plantonistasEscala.length} plantonista(s) associado(s)
 </span>
 </div>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Informe o período da escala (sem horas), selecione a Unidade Regional e adicione os membros.
 </CardDescription>
 </CardHeader>

 <CardContent className="space-y-5 pt-5">
 {/* LINHA 1: PERÍODO DA ESCALA + UNIDADE REGIONAL */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Data Início *</span>
 
 </label>
 <input
 type="date"
 value={dataInicio}
 onChange={(e) => setDataInicio(e.target.value)}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
 />
 <p className="text-[10px] text-slate-400">Início da escala .</p>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Data Fim *</span>
 
 </label>
 <input
 type="date"
 value={dataFim}
 onChange={(e) => setDataFim(e.target.value)}
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
 />
 <p className="text-[10px] text-slate-400">Término da escala .</p>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Unidade Regional (UR) *</span>
 
 </label>
 <FilamentSelect
 value={unidadeRegional}
 onChange={(val) => setUnidadeRegional(val)}
 options={UNIDADES_REGIONAIS_INEMA}
 placeholder="Selecione a UR da escala"
 className="w-full text-xs"
 />
 <p className="text-[10px] text-slate-400">Catálogo oficial INEMA.</p>
 </div>
 </div>

 {/* SEÇÃO DE PLANTONISTAS ASSOCIADOS */}
 <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
 <div>
 <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
 
 Técnicos Plantonistas da Escala *
 </h3>
 <p className="text-[11px] text-slate-500 dark:text-slate-400">
 Adicione múltiplos técnicos. Telefones integrados automaticamente e protegidos de edição direta.
 </p>
 </div>
 
 </div>

 {/* ADICIONAR PLANTONISTA */}
 <div className="flex flex-col sm:flex-row gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
 <div className="flex-1">
 <FilamentSelect
 value={plantonistaSelecionadoId}
 onChange={(val) => setPlantonistaSelecionadoId(val)}
 options={PLANTONISTAS_BASE_MOCK.map((p) => ({
 value: p.id,
 label: `${p.nome} — CPF: ${p.cpf} (${p.unidadeRegional})`
 }))}
 placeholder="Selecione um técnico plantonista cadastrado..."
 className="w-full text-xs"
 />
 </div>
 <Button
 type="button"
 variant="outline"
 size="sm"
 onClick={handleAdicionarPlantonista}
 disabled={!plantonistaSelecionadoId}
 className="text-xs font-medium bg-white dark:bg-slate-800 shrink-0"
 >
 <Plus className="w-3.5 h-3.5 mr-1" />
 Adicionar Plantonista
 </Button>
 </div>

 {/* TABELA DE PLANTONISTAS ADICIONADOS */}
 {plantonistasEscala.length === 0 ? (
 <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
 <Users className="w-6 h-6 text-slate-300 mx-auto mb-1" />
 <p className="text-xs text-slate-500">Nenhum plantonista associado à escala.</p>
 <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
 É obrigatório incluir ao menos um plantonista para salvar.
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
 <table className="w-full text-left text-xs border-collapse">
 <thead className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
 <tr>
 <th className="py-2.5 px-3">Nome do Plantonista</th>
 <th className="py-2.5 px-3">CPF</th>
 <th className="py-2.5 px-3">Tel. Institucional</th>
 <th className="py-2.5 px-3">Tel. Plantonista</th>
 <th className="py-2.5 px-3 text-right">Ação</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
 {plantonistasEscala.map((item) => (
 <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
 <td className="py-2.5 px-3 font-medium flex items-center gap-1.5">
 <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
 {item.nome}
 </td>
 <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
 {item.cpf}
 </td>
 <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
 {item.telefoneInstitucional}
 </td>
 <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
 {item.telefonePlantonista}
 </td>
 <td className="py-2.5 px-3 text-right">
 <button
 type="button"
 onClick={() => handleRemoverPlantonista(item.id)}
 className="text-slate-400 hover:text-red-600 transition-colors p-1"
 title="Remover da escala"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* SEÇÃO DADOS OPCIONAIS (MOTORISTA, HORAS E NÚMERO EQUIVALENTE - ) */}
 <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
 
 Informações Operacionais e Transporte
 </h3>
 
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {/* Motorista da semana */}
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Motorista da Semana</span>
 
 </label>
 <input
 type="text"
 value={motorista}
 onChange={(e) => setMotorista(e.target.value)}
 placeholder="Nome do motorista"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
 />
 <p className="text-[10px] text-slate-400">Opcional .</p>
 </div>

 {/* Telefone do motorista */}
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Telefone do Motorista</span>
 
 </label>
 <input
 type="text"
 value={telefoneMotorista}
 onChange={(e) => setTelefoneMotorista(e.target.value)}
 placeholder="(71) 90000-0000"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
 />
 <p className="text-[10px] text-slate-400">Opcional .</p>
 </div>

 {/* Número de horas */}
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Número de Horas</span>
 
 </label>
 <input
 type="text"
 value={numeroHoras}
 onChange={(e) => handleHorasChange(e.target.value)}
 placeholder="Ex.: 168"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
 />
 <p className="text-[10px] text-slate-400">Somente números até 10 dígitos .</p>
 </div>

 {/* Número equivalente */}
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Número Equivalente</span>
 
 </label>
 <input
 type="text"
 value={numeroEquivalente}
 onChange={(e) => handleNumeroEquivalenteChange(e.target.value)}
 placeholder="Ex.: 1.0 ou 1,5"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
 />
 <p className="text-[10px] text-slate-400">Números e símbolos .</p>
 </div>
 </div>
 </div>
 </CardContent>

 {/* BOTÕES DE AÇÃO: */}
 <CardFooter className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
 <div className="flex items-center gap-2">
 <Button
 variant="default"
 size="sm"
 onClick={handleSalvar}
 className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
 >
 <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
 Salvar Escala
 </Button>

 <Button
 variant="outline"
 size="sm"
 onClick={() => handleRecuperar()}
 className="text-xs font-medium border-slate-300 dark:border-slate-700"
 >
 <Search className="w-3.5 h-3.5 mr-1" />
 Recuperar Escala
 </Button>
 </div>

 {isModoEdicao && (
 <Button
 variant="outline"
 size="sm"
 onClick={handleExcluir}
 className="text-xs font-medium text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
 >
 
 Excluir Escala
 </Button>
 )}
 </CardFooter>
 </Card>
 </div>

 {/* COLUNA DIREITA: ESCALAS CADASTRADAS E DIRETRIZES */}
 <div className="space-y-6">
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <div className="flex items-center justify-between">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
 Escalas Registradas
 </CardTitle>
 <Badge variant="outline" className="text-xs font-mono">
 {escalasCadastradas.length}
 </Badge>
 </div>
 <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
 Clique para recuperar e gerenciar a escala correspondente .
 </CardDescription>
 </CardHeader>

 <CardContent className="p-0">
 <div className="divide-y divide-slate-100 dark:divide-slate-800">
 {escalasCadastradas.map((esc) => {
 const urLabel = UNIDADES_REGIONAIS_INEMA.find((u) => u.value === esc.unidadeRegional)?.label || esc.unidadeRegional;
 const isSelected = escalaEmEdicaoId === esc.id;

 return (
 <div
 key={esc.id}
 onClick={() => handleRecuperar(esc)}
 className={cn(
 "p-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors text-xs",
 isSelected && "bg-teal-50/70 dark:bg-teal-950/30 border-l-4 border-l-teal-600"
 )}
 >
 <div className="flex items-center justify-between">
 <span className="font-semibold text-slate-800 dark:text-slate-200">
 {esc.id}
 </span>
 <Badge
 variant="outline"
 className={cn(
 "text-[10px]",
 esc.status === 'Concluída' && "bg-slate-100 dark:bg-slate-800 text-slate-600",
 esc.status === 'Ativa' && "bg-emerald-50 text-emerald-700 border-emerald-200",
 esc.status === 'Prevista' && "bg-blue-50 text-blue-700 border-blue-200"
 )}
 >
 {esc.status}
 </Badge>
 </div>

 <div className="mt-1.5 flex items-center gap-1 text-slate-600 dark:text-slate-400">
 <Calendar className="w-3.5 h-3.5 text-slate-400" />
 <span>{esc.dataInicio} até {esc.dataFim}</span>
 </div>

 <div className="mt-1 text-slate-500 font-medium truncate">
 {urLabel}
 </div>

 <div className="mt-2 flex flex-wrap gap-1">
 {esc.plantonistas.map((p) => (
 <span
 key={p.id}
 className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded"
 >
 {p.nome.split(' ')[0]}
 </span>
 ))}
 </div>
 </div>
 );
 })}
 </div>
 </CardContent>
 </Card>

 {/* PAINEL DE DIRETRIZES DO */}
 <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50/50 dark:bg-slate-900/40">
 <CardHeader className="pb-2">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Diretrizes Normativas</CardTitle>
 </CardHeader>
 <CardContent className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
 <p>• Período e Unidade Regional são campos obrigatórios para validação.</p>
 <p>• É permitido adicionar múltiplos plantonistas na mesma escala (mínimo de um).</p>
 <p>• Telefones são integrados do cadastro básico e protegidos contra edição direta.</p>
 <p>• Impede duplicidade de período e Unidade Regional, bloqueando sobreposição em datas conflitantes.</p>
 <p>• Exclusão de escala exige confirmação formal prévia.</p>
 </CardContent>
 </Card>
 </div>
 </div>

 {/* DIÁLOGO / MODAL DE MENSAGENS NORMATIVAS */}
 <Dialog open={modalState.isOpen} onOpenChange={(open) => setModalState((prev) => ({ ...prev, isOpen: open }))}>
 <DialogContent className="sm:max-w-md">
 <DialogHeader>
 <div className="flex items-center gap-2 mb-1">
 {modalState.tipo === 'sucesso' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
 {modalState.tipo === 'erro' && <AlertCircle className="w-5 h-5 text-red-600" />}
 {modalState.tipo === 'aviso' && <Info className="w-5 h-5 text-blue-600" />}
 {modalState.tipo === 'confirmacao-exclusao' && (
 <AlertCircle className="w-5 h-5 text-amber-600" />
 )}
 <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
 {modalState.titulo}
 </DialogTitle>
 
 </div>
 <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
 {modalState.mensagem}
 </DialogDescription>
 </DialogHeader>

 <DialogFooter className="flex gap-2 sm:justify-end mt-4">
 {modalState.tipo === 'confirmacao-exclusao' ? (
 <>
 <Button
 variant="outline"
 size="sm"
 onClick={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
 className="text-xs"
 >
 NÃO
 </Button>
 <Button
 variant="destructive"
 size="sm"
 onClick={() => {
 setModalState((prev) => ({ ...prev, isOpen: false }));
 handleConfirmarExclusaoDefinitiva();
 }}
 className="text-xs"
 >
 SIM
 </Button>
 </>
 ) : (
 <Button
 variant="default"
 size="sm"
 onClick={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
 className="bg-teal-700 hover:bg-teal-800 text-xs text-white"
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

export default CadastroEscalaPage;
