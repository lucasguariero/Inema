import React, { useState } from 'react';
import {
 UserCheck,
 Search,
 Save,
 RotateCcw,
 Trash2,
 AlertCircle,
 CheckCircle2,
 Info,
 X,
 Plus,
 Edit2
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
import { MUNICIPIOS_BAHIA } from '@/data/fiscalizacaoMock';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

// Catálogo de Unidades Regionais (URs) do INEMA
export const UNIDADES_REGIONAIS_INEMA = [
 { value: 'UR-SALVADOR', label: 'UR Salvador / Metropolitana' },
 { value: 'UR-FEIRA', label: 'UR Feira de Santana' },
 { value: 'UR-JUAZEIRO', label: 'UR Juazeiro / São Francisco' },
 { value: 'UR-BARREIRAS', label: 'UR Barreiras / Oeste' },
 { value: 'UR-VITORIA-CONQUISTA', label: 'UR Vitória da Conquista / Sudoeste' },
 { value: 'UR-ILHEUS', label: 'UR Ilhéus / Litoral Sul' },
 { value: 'UR-EUNAPOLIS', label: 'UR Eunápolis / Extremo Sul' },
 { value: 'UR-SEABRA', label: 'UR Seabra / Chapada Diamantina' },
 { value: 'UR-SENHOR-BONFIM', label: 'UR Senhor do Bonfim / Norte' }
];

// Base mock do Cadastro Básico de Servidores/Técnicos do INEMA (para importação via )
export const CADASTRO_BASICO_SERVIDORES = [
 {
 cpf: '123.456.789-00',
 nome: 'Carlos Eduardo Silveira',
 telefone: '(71) 99123-4567',
 email: 'carlos.silveira@inema.ba.gov.br'
 },
 {
 cpf: '234.567.890-11',
 nome: 'Mariana Costa Ribeiro',
 telefone: '(71) 98765-4321',
 email: 'mariana.ribeiro@inema.ba.gov.br'
 },
 {
 cpf: '345.678.901-22',
 nome: 'Roberto Alves Mendonça',
 telefone: '(75) 99888-1122',
 email: 'roberto.mendonca@inema.ba.gov.br'
 },
 {
 cpf: '456.789.012-33',
 nome: 'Juliana Pires Albuquerque',
 telefone: '(73) 99777-3344',
 email: 'juliana.albuquerque@inema.ba.gov.br'
 },
 {
 cpf: '567.890.123-44',
 nome: 'Lucas Guariero',
 telefone: '(71) 99292-4740',
 email: 'lucas.guariero@inema.ba.gov.br'
 }
];

export interface Plantonista {
 id: string;
 nome: string;
 cpf: string;
 telefoneInstitucional: string;
 telefonePlantonista: string;
 email: string;
 unidadeRegional: string;
 areasAbrangencia: string[];
 temVinculoEscala?: boolean; // Para validação 
}

export const CadastroPlantonistaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
 const { isDarkMode } = useTheme();

 // Estado do formulário
 const [nome, setNome] = useState('');
 const [cpf, setCpf] = useState('');
 const [telefoneInstitucional, setTelefoneInstitucional] = useState('');
 const [telefonePlantonista, setTelefonePlantonista] = useState('');
 const [email, setEmail] = useState('');
 const [unidadeRegional, setUnidadeRegional] = useState('');
 const [areasAbrangencia, setAreasAbrangencia] = useState<string[]>([]);
 const [novoMunicipio, setNovoMunicipio] = useState('');

 // Modo de edição após recuperação
 const [isModoEdicao, setIsModoEdicao] = useState(false);
 const [plantonistaEmEdicaoId, setPlantonistaEmEdicaoId] = useState<string | null>(null);

 // Lista de técnicos plantonistas já cadastrados no sistema
 const [plantonistasCadastrados, setPlantonistasCadastrados] = useState<Plantonista[]>([
 {
 id: 'PLANT-001',
 nome: 'Carlos Eduardo Silveira',
 cpf: '123.456.789-00',
 telefoneInstitucional: '(71) 3118-4200',
 telefonePlantonista: '(71) 99123-4567',
 email: 'carlos.silveira@inema.ba.gov.br',
 unidadeRegional: 'UR-SALVADOR',
 areasAbrangencia: ['Salvador', 'Lauro de Freitas', 'Camaçari', 'Simões Filho'],
 temVinculoEscala: true
 },
 {
 id: 'PLANT-002',
 nome: 'Mariana Costa Ribeiro',
 cpf: '234.567.890-11',
 telefoneInstitucional: '(75) 3602-1200',
 telefonePlantonista: '(71) 98765-4321',
 email: 'mariana.ribeiro@inema.ba.gov.br',
 unidadeRegional: 'UR-FEIRA',
 areasAbrangencia: ['Feira de Santana', 'Alagoinhas', 'Serrinha'],
 temVinculoEscala: false
 }
 ]);

 // Diálogos de feedback e mensagens normativas do 
 const [modalState, setModalState] = useState<{
 isOpen: boolean;
 tipo: 'erro' | 'sucesso' | 'aviso' | 'confirmacao-exclusao' | 'vinculo-exclusao';
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

 // Limpar formulário para novo cadastro
 const handleLimpar = () => {
 setNome('');
 setCpf('');
 setTelefoneInstitucional('');
 setTelefonePlantonista('');
 setEmail('');
 setUnidadeRegional('');
 setAreasAbrangencia([]);
 setNovoMunicipio('');
 setIsModoEdicao(false);
 setPlantonistaEmEdicaoId(null);
 };

 // Importação por Nome ou CPF do cadastro básico
 const handleImportarCadastroBasico = (termo: string, tipo: 'nome' | 'cpf') => {
 const limpo = termo.trim().toLowerCase();
 if (!limpo) return;

 const servidor = CADASTRO_BASICO_SERVIDORES.find((s) => {
 if (tipo === 'cpf') {
 const cpfNum = s.cpf.replace(/\D/g, '');
 const termoNum = limpo.replace(/\D/g, '');
 return cpfNum === termoNum || s.cpf.toLowerCase() === limpo;
 }
 return s.nome.toLowerCase().includes(limpo);
 });

 if (servidor) {
 setNome(servidor.nome);
 setCpf(servidor.cpf);
 setTelefonePlantonista(servidor.telefone);
 setEmail(servidor.email);
 } else {
 setModalState({
 isOpen: true,
 tipo: 'aviso',
 codigo: '',
 titulo: 'Cadastro não encontrado',
 mensagem: 'Não existe cadastro para o plantonista informado.'
 });
 }
 };

 // Adicionar município na área de abrangência
 const handleAdicionarMunicipio = () => {
 if (!novoMunicipio) return;
 if (!areasAbrangencia.includes(novoMunicipio)) {
 setAreasAbrangencia([...areasAbrangencia, novoMunicipio]);
 }
 setNovoMunicipio('');
 };

 // Remover município da área de abrangência
 const handleRemoverMunicipio = (mun: string) => {
 setAreasAbrangencia(areasAbrangencia.filter((m) => m !== mun));
 };

 // Salvar cadastro do plantonista
 const handleSalvar = () => {
 // Obrigatoriedade integral
 if (
 !nome.trim() ||
 !cpf.trim() ||
 !telefoneInstitucional.trim() ||
 !telefonePlantonista.trim() ||
 !email.trim() ||
 !unidadeRegional ||
 areasAbrangencia.length === 0
 ) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Validação de Campos',
 mensagem: 'Campo obrigatório não preenchido!'
 });
 return;
 }

 // Prevenção de duplicidade por Nome, CPF e Telefone (exceto se em edição do mesmo registro)
 const plantonistaDuplicado = plantonistasCadastrados.find((p) => {
 if (isModoEdicao && p.id === plantonistaEmEdicaoId) return false;
 const mesmoCpf = p.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, '');
 const mesmoNome = p.nome.trim().toLowerCase() === nome.trim().toLowerCase();
 const mesmoTelefone = p.telefonePlantonista.replace(/\D/g, '') === telefonePlantonista.replace(/\D/g, '');
 return mesmoCpf || (mesmoNome && mesmoTelefone);
 });

 if (plantonistaDuplicado) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Prevenção de Duplicidade',
 mensagem: 'Técnico já cadastrado.'
 });
 return;
 }

 if (isModoEdicao && plantonistaEmEdicaoId) {
 // Atualização controlada
 setPlantonistasCadastrados((prev) =>
 prev.map((p) =>
 p.id === plantonistaEmEdicaoId
 ? {
 ...p,
 telefoneInstitucional,
 unidadeRegional,
 areasAbrangencia
 }
 : p
 )
 );
 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Atualização Concluída',
 mensagem: 'Cadastro salvo com sucesso!'
 });
 } else {
 // Novo registro
 const novoPlantonista: Plantonista = {
 id: `PLANT-${String(plantonistasCadastrados.length + 1).padStart(3, '0')}`,
 nome,
 cpf,
 telefoneInstitucional,
 telefonePlantonista,
 email,
 unidadeRegional,
 areasAbrangencia,
 temVinculoEscala: false
 };
 setPlantonistasCadastrados((prev) => [...prev, novoPlantonista]);
 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Gravação Realizada',
 mensagem: 'Cadastro salvo com sucesso!'
 });
 }
 };

 // Recuperar cadastro pelo CPF
 const handleRecuperar = () => {
 if (!cpf.trim()) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'CPF Obrigatório',
 mensagem: 'Informe o CPF do técnico para realizar a recuperação do cadastro.'
 });
 return;
 }

 const cpfBusca = cpf.replace(/\D/g, '');
 const encontrado = plantonistasCadastrados.find((p) => p.cpf.replace(/\D/g, '') === cpfBusca);

 if (encontrado) {
 setNome(encontrado.nome);
 setCpf(encontrado.cpf);
 setTelefoneInstitucional(encontrado.telefoneInstitucional);
 setTelefonePlantonista(encontrado.telefonePlantonista);
 setEmail(encontrado.email);
 setUnidadeRegional(encontrado.unidadeRegional);
 setAreasAbrangencia(encontrado.areasAbrangencia);
 setIsModoEdicao(true);
 setPlantonistaEmEdicaoId(encontrado.id);
 } else {
 setModalState({
 isOpen: true,
 tipo: 'aviso',
 codigo: '',
 titulo: 'Recuperação não encontrada',
 mensagem: 'Não existe cadastro para o plantonista informado.'
 });
 }
 };

 // Excluir cadastro
 const handleSolicitarExclusao = () => {
 if (!plantonistaEmEdicaoId && !cpf.trim()) {
 setModalState({
 isOpen: true,
 tipo: 'erro',
 codigo: '',
 titulo: 'Plantonista não identificado',
 mensagem: 'Recupere ou selecione um cadastro de plantonista existente antes de solicitar a exclusão.'
 });
 return;
 }

 const cpfBusca = cpf.replace(/\D/g, '');
 const encontrado = plantonistasCadastrados.find(
 (p) => p.id === plantonistaEmEdicaoId || p.cpf.replace(/\D/g, '') === cpfBusca
 );

 if (!encontrado) {
 setModalState({
 isOpen: true,
 tipo: 'aviso',
 codigo: '',
 titulo: 'Cadastro não localizado',
 mensagem: 'Não existe cadastro para o plantonista informado.'
 });
 return;
 }

 // Verificar integridade de exclusão (vínculos com escalas ou registros)
 if (encontrado.temVinculoEscala) {
 setModalState({
 isOpen: true,
 tipo: 'vinculo-exclusao',
 codigo: '',
 titulo: 'Vínculo Identificado',
 mensagem: 'Existe registro vinculado a esse plantonista, devemos excluir esse registro?'
 });
 } else {
 setModalState({
 isOpen: true,
 tipo: 'confirmacao-exclusao',
 codigo: '',
 titulo: 'Confirmação de Exclusão',
 mensagem: 'Deseja excluir o cadastro do plantonista?'
 });
 }
 };

 // Execução definitiva da exclusão
 const handleConfirmarExclusaoDefinitiva = () => {
 const cpfBusca = cpf.replace(/\D/g, '');
 setPlantonistasCadastrados((prev) =>
 prev.filter((p) => p.id !== plantonistaEmEdicaoId && p.cpf.replace(/\D/g, '') !== cpfBusca)
 );
 handleLimpar();
 setModalState({
 isOpen: true,
 tipo: 'sucesso',
 codigo: '',
 titulo: 'Operação Concluída',
 mensagem: 'Exclusão realizada com sucesso.'
 });
 };

 return (
 <div className="space-y-6">
 {/* CABEÇALHO DO MÓDULO */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
 <div>
 <div className="flex items-center gap-2">
 <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
 Cadastro de Plantonista
 </h1>
 {isModoEdicao && (
 <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
 Modo Edição
 </span>
 )}
 </div>
 <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
 Registro e gerenciamento de técnicos plantonistas com importação do cadastro básico e definição de abrangência.
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
 onClick={handleLimpar}
 className="text-xs font-semibold bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white shadow-xs"
 >
 <Plus className="w-3.5 h-3.5 mr-1" />
 Novo Cadastro
 </Button>
 </div>
 </div>

 {/* FORMULÁRIO */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 space-y-6">
 <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dados do Técnico Plantonista</CardTitle>
 <CardDescription className="text-xs text-slate-500">
 Preencha o Nome ou CPF para carregar automaticamente os dados funcionais a partir do Cadastro Básico.
 </CardDescription>
 </CardHeader>

 <CardContent className="pt-4 space-y-4">
 {/* LINHA 1: NOME E CPF */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="sm:col-span-2 space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Nome do Técnico Plantonista *</span>
 
 </label>
 <div className="relative flex items-center">
 <input
 type="text"
 disabled={isModoEdicao}
 value={nome}
 onChange={(e) => setNome(e.target.value)}
 placeholder="Digite o nome para importar do cadastro básico"
 className={cn(
 "w-full text-xs h-9 px-3 pr-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors",
 isModoEdicao && "bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
 )}
 />
 {!isModoEdicao && (
 <button
 type="button"
 onClick={() => handleImportarCadastroBasico(nome, 'nome')}
 title="Buscar no cadastro básico"
 className="absolute right-2 text-slate-400 hover:text-teal-600 transition-colors"
 >
 <Search className="w-4 h-4" />
 </button>
 )}
 </div>
 <p className="text-[10px] text-slate-400">
 Digite o nome do técnico para importar os dados do cadastro básico .
 </p>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>CPF *</span>
 
 </label>
 <div className="relative flex items-center">
 <input
 type="text"
 disabled={isModoEdicao}
 value={cpf}
 onChange={(e) => setCpf(e.target.value)}
 placeholder="000.000.000-00"
 className={cn(
 "w-full text-xs h-9 px-3 pr-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors",
 isModoEdicao && "bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
 )}
 />
 {!isModoEdicao && (
 <button
 type="button"
 onClick={() => handleImportarCadastroBasico(cpf, 'cpf')}
 title="Buscar no cadastro básico"
 className="absolute right-2 text-slate-400 hover:text-teal-600 transition-colors"
 >
 <Search className="w-4 h-4" />
 </button>
 )}
 </div>
 <p className="text-[10px] text-slate-400">
 Importação e chave de consulta .
 </p>
 </div>
 </div>

 {/* LINHA 2: CONTATOS */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Telefone Institucional *</span>
 
 </label>
 <input
 type="text"
 value={telefoneInstitucional}
 onChange={(e) => setTelefoneInstitucional(e.target.value)}
 placeholder="(71) 3118-0000"
 className="w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
 />
 
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Telefone do Plantonista *</span>
 
 </label>
 <input
 type="text"
 disabled={isModoEdicao}
 value={telefonePlantonista}
 onChange={(e) => setTelefonePlantonista(e.target.value)}
 placeholder="(71) 90000-0000"
 className={cn(
 "w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors",
 isModoEdicao && "bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
 )}
 />
 
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>E-mail *</span>
 
 </label>
 <input
 type="email"
 disabled={isModoEdicao}
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="tecnico@inema.ba.gov.br"
 className={cn(
 "w-full text-xs h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors",
 isModoEdicao && "bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
 )}
 />
 
 </div>
 </div>

 {/* LINHA 3: UNIDADE REGIONAL (UR) */}
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
 <span>Unidade Regional (UR) *</span>
 
 </label>
 <FilamentSelect
 value={unidadeRegional}
 onChange={(val) => setUnidadeRegional(val)}
 options={UNIDADES_REGIONAIS_INEMA}
 placeholder="Selecione a Unidade Regional do plantonista"
 className="w-full text-xs"
 />
 <p className="text-[10px] text-slate-400">
 Seleção única obrigatória. Catálogo oficial parametrizado pelo INEMA.
 </p>
 </div>

 {/* LINHA 4: ÁREA DE ABRANGÊNCIA DA UR (MULTISSELEÇÃO - ) */}
 <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
 <div className="flex items-center justify-between">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
 <span>Área de Abrangência da UR (Municípios da Bahia) *</span>
 <Badge variant="outline" className="text-[10px] py-0 px-1.5">
 {areasAbrangencia.length} selecionado(s)
 </Badge>
 </label>
 
 </div>

 <div className="flex gap-2">
 <div className="flex-1">
 <FilamentSelect
 value={novoMunicipio}
 onChange={(val) => setNovoMunicipio(val)}
 options={MUNICIPIOS_BAHIA.map((m) => ({ value: m, label: m }))}
 placeholder="Escolha um município para incluir na área de abrangência..."
 className="w-full text-xs"
 />
 </div>
 <Button
 type="button"
 variant="outline"
 size="sm"
 onClick={handleAdicionarMunicipio}
 disabled={!novoMunicipio}
 className="text-xs h-9"
 >
 <Plus className="w-3.5 h-3.5 mr-1" />
 Adicionar
 </Button>
 </div>

 {/* TAGS DE MUNICÍPIOS SELECIONADOS */}
 {areasAbrangencia.length > 0 ? (
 <div className="flex flex-wrap gap-1.5 p-2.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 max-h-32 overflow-y-auto">
 {areasAbrangencia.map((mun) => (
 <span
 key={mun}
 className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
 >
 {mun}
 <button
 type="button"
 onClick={() => handleRemoverMunicipio(mun)}
 className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
 title={`Remover ${mun}`}
 >
 <X className="w-3 h-3" />
 </button>
 </span>
 ))}
 </div>
 ) : (
 <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/30 p-2.5 rounded border border-amber-200 dark:border-amber-900/40 flex items-center gap-2">
 <AlertCircle className="w-4 h-4 shrink-0" />
 <span>Ao menos uma área de abrangência (município) deve ser selecionada para permitir a gravação.</span>
 </div>
 )}
 </div>
 </CardContent>

 {/* BARRA DE AÇÕES: */}
 <CardFooter className="pt-3 pb-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50/60 dark:bg-slate-900/40 rounded-b-lg">
 <div className="flex items-center gap-2">
 <Button
 type="button"
 variant="default"
 size="sm"
 onClick={handleSalvar}
 className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold h-8"
 >
 
 Salvar
 </Button>

 <Button
 type="button"
 variant="outline"
 size="sm"
 onClick={handleRecuperar}
 className="text-xs font-medium h-8"
 >
 
 Recuperar
 </Button>
 </div>

 <div>
 <Button
 type="button"
 variant="ghost"
 size="sm"
 onClick={handleSolicitarExclusao}
 className="text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 h-8"
 >
 
 Excluir
 </Button>
 </div>
 </CardFooter>
 </Card>
 </div>

 {/* LATERAL: LISTA DE PLANTONISTAS CADASTRADOS & GUIA RÁPIDO */}
 <div className="space-y-6">
 <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
 <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold flex items-center justify-between text-slate-900 dark:text-slate-100">
 <span>Plantonistas Registrados</span>
 <Badge variant="secondary" className="text-xs font-bold">
 {plantonistasCadastrados.length}
 </Badge>
 </CardTitle>
 <CardDescription className="text-xs text-slate-500">
 Clique para recuperar e editar conforme regras de gestão.
 </CardDescription>
 </CardHeader>

 <CardContent className="pt-3 p-0">
 <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
 {plantonistasCadastrados.map((plant) => {
 const urLabel = UNIDADES_REGIONAIS_INEMA.find((u) => u.value === plant.unidadeRegional)?.label || plant.unidadeRegional;
 return (
 <div
 key={plant.id}
 className={cn(
 "p-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer",
 plantonistaEmEdicaoId === plant.id && "bg-teal-50/60 dark:bg-teal-950/30 border-l-3 border-teal-600"
 )}
 onClick={() => {
 setNome(plant.nome);
 setCpf(plant.cpf);
 setTelefoneInstitucional(plant.telefoneInstitucional);
 setTelefonePlantonista(plant.telefonePlantonista);
 setEmail(plant.email);
 setUnidadeRegional(plant.unidadeRegional);
 setAreasAbrangencia(plant.areasAbrangencia);
 setIsModoEdicao(true);
 setPlantonistaEmEdicaoId(plant.id);
 }}
 >
 <div className="flex items-start justify-between">
 <div>
 <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{plant.nome}</div>
 <div className="text-[11px] text-slate-500 font-mono mt-0.5">CPF: {plant.cpf}</div>
 </div>
 {plant.temVinculoEscala && (
 <Badge variant="outline" className="text-[9px] text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 border-blue-200">
 Em escala
 </Badge>
 )}
 </div>

 <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">
 <span className="font-semibold text-slate-700 dark:text-slate-300">{urLabel}</span>
 </div>

 <div className="mt-1 text-[10px] text-slate-500 truncate">
 {plant.areasAbrangencia.join(', ')}
 </div>
 </div>
 );
 })}
 </div>
 </CardContent>
 </Card>

 {/* PAINEL INFORMATIVO DAS REGRAS DO */}
 <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
 <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
 
 Diretrizes Funcionais
 </div>
 <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px] list-disc pl-4 leading-relaxed">
 <li>• Nome/CPF consultam o cadastro básico e preenchem contatos.</li>
 <li>• Todos os campos e ao menos um município são obrigatórios.</li>
 <li>• Impede duplicidade de plantonista por Nome, CPF e Telefone.</li>
 <li>• Confirmação de exclusão com alerta de integridade para registros vinculados.</li>
 <li>• Ao recuperar, somente telefone institucional, UR e áreas podem ser alterados.</li>
 </ul>
 </div>
 </div>
 </div>

 {/* DIÁLOGO PADRONIZADO DE MENSAGENS E CONFIRMAÇÕES DO */}
 <Dialog open={modalState.isOpen} onOpenChange={(open) => !open && setModalState((prev) => ({ ...prev, isOpen: false }))}>
 <DialogContent className="sm:max-w-md">
 <DialogHeader>
 <div className="flex items-center gap-2 mb-1">
 {modalState.tipo === 'sucesso' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
 {modalState.tipo === 'erro' && <AlertCircle className="w-5 h-5 text-red-600" />}
 {modalState.tipo === 'aviso' && <Info className="w-5 h-5 text-blue-600" />}
 {(modalState.tipo === 'confirmacao-exclusao' || modalState.tipo === 'vinculo-exclusao') && (
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
 {modalState.tipo === 'confirmacao-exclusao' || modalState.tipo === 'vinculo-exclusao' ? (
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
 className="bg-teal-700 hover:bg-teal-800 text-xs"
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

export default CadastroPlantonistaPage;
