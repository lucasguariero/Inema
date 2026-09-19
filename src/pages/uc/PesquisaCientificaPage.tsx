import React, { useState } from 'react';
import {
 Microscope,
 BookOpen,
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
 Calendar,
 Building2,
 Bookmark,
 Share2,
 Award,
 PlusCircle,
 Plus,
 Trash2,
 FileSpreadsheet
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
import { UNIDADES_CONSERVACAO_BAHIA } from './AgendamentoVisitacaoPage';

export interface MembroEquipe {
 id: string;
 nome: string;
 funcao: 'Coordenador' | 'Pesquisador Associado' | 'Pós-Graduando' | 'Iniciação Científica' | 'Auxiliar de Campo';
 titulacao: string;
 documento: string;
 instituicao: string;
}

export interface RelatorioPesquisa {
 id: string;
 tipo: 'Relatório Parcial' | 'Relatório Final';
 dataPrevista: string;
 dataEntrega?: string;
 status: 'Pendente' | 'Entregue' | 'Atrasado' | 'Aprovado CGEUC';
 arquivoNome?: string;
 observacoes?: string;
}

export interface PublicacaoPesquisa {
 id: string;
 titulo: string;
 tipo: 'Artigo Científico (Periódico)' | 'Dissertação de Mestrado' | 'Tese de Doutorado' | 'Resumo em Congresso' | 'Capítulo de Livro';
 veiculo: string;
 ano: number;
 doiOuLink: string;
}

export interface ProcessoPesquisa {
 id: string;
 numeroProtocolo: string;
 processoSEI: string;
 tituloProjeto: string;
 areaTematica: string;
 instituicao: string;
 pesquisadorResponsavel: string;
 cpfPesquisador: string;
 lattesPesquisador: string;
 emailPesquisador: string;
 telefonePesquisador: string;
 ucId: string;
 ucNome: string;
 afetaZA: boolean;
 vigenciaMeses: number;
 dataInicioPrevista: string;
 dataTerminoPrevista: string;
 haColeta: boolean;
 grupoTaxonomico?: string;
 metodologiaAmostragem?: string;
 quantidadeAmostras?: string;
 instituicaoDepositaria?: string;
 comiteEticaCEUA?: string;
 registroSisGen?: string;
 licencaFederalSISBIO?: string;
 vinculoPlanoManejo: string;
 resumoProjeto: string;
 equipe: MembroEquipe[];
 relatorios: RelatorioPesquisa[];
 publicacoes: PublicacaoPesquisa[];
 status: 'Rascunho' | 'Em Análise' | 'Aguardando Complementação' | 'Autorizado' | 'Indeferido' | 'Concluído';
 portariaNumero?: string;
 dataEmissaoPortaria?: string;
 dataPublicacaoDOE?: string;
 parecerTecnico?: string;
 condicionantes?: string[];
}

export const MOCK_PESQUISAS: ProcessoPesquisa[] = [
 {
 id: 'pesq-001',
 numeroProtocolo: 'PESQ-2026/0014-BA',
 processoSEI: 'SEI-021.7820.2026.000188-42',
 tituloProjeto: 'Ecologia populacional e variabilidade genética de primatas ameaçados no Parque Estadual da Serra do Conduru',
 areaTematica: 'Zoologia / Conservação da Biodiversidade',
 instituicao: 'UESC',
 pesquisadorResponsavel: 'Dra. Mariana Lins Albuquerque',
 cpfPesquisador: '234.567.890-12',
 lattesPesquisador: 'http://lattes.cnpq.br/4458920194827182',
 emailPesquisador: 'mariana.lins@uesc.br',
 telefonePesquisador: '(73) 98844-3321',
 ucId: 'pesc',
 ucNome: 'Parque Estadual da Serra do Conduru (PESC)',
 afetaZA: true,
 vigenciaMeses: 24,
 dataInicioPrevista: '2026-03-01',
 dataTerminoPrevista: '2028-02-28',
 haColeta: true,
 grupoTaxonomico: 'Mamíferos (Primates - Leontopithecus chrysomelas)',
 metodologiaAmostragem: 'Captura não letal com armadilhas Tomahawk para coleta de ectoparasitas e sangue (0.5ml), biometria e marcação com microchip.',
 quantidadeAmostras: '20 indivíduos com soltura imediata no local de captura.',
 instituicaoDepositaria: 'Coleção Zoológica UESC',
 comiteEticaCEUA: 'CEUA-UESC nº 018/2025',
 registroSisGen: 'SisGen A8920BC',
 licencaFederalSISBIO: 'SISBIO/ICMBio nº 88412-3',
 vinculoPlanoManejo: 'Programa de Pesquisa e Monitoramento da Biodiversidade (Subprograma Fauna Ameaçada - PESC)',
 resumoProjeto: 'O projeto investiga o fluxo gênico e a ecologia comportamental do mico-leão-da-cara-dourada em fragmentos do PESC e corredores ecológicos conectando a Zona de Amortecimento.',
 equipe: [
 {
 id: 'eq-1',
 nome: 'Dra. Mariana Lins Albuquerque',
 funcao: 'Coordenador',
 titulacao: 'Doutora em Zoologia (USP)',
 documento: '234.567.890-12',
 instituicao: 'UESC'
 },
 {
 id: 'eq-2',
 nome: 'Me. Thiago Cerqueira Castro',
 funcao: 'Pós-Graduando',
 titulacao: 'Mestre em Ecologia (UFBA) - Doutorando UESC',
 documento: '345.678.901-23',
 instituicao: 'UESC'
 },
 {
 id: 'eq-3',
 nome: 'Beatriz Fontes Ramos',
 funcao: 'Iniciação Científica',
 titulacao: 'Graduanda em Ciências Biológicas',
 documento: '456.789.012-34',
 instituicao: 'UESC'
 }
 ],
 relatorios: [
 {
 id: 'rel-1',
 tipo: 'Relatório Parcial',
 dataPrevista: '2027-02-28',
 status: 'Pendente',
 observacoes: 'Relatório das campanhas de campo do 1º ano de vigência.'
 },
 {
 id: 'rel-2',
 tipo: 'Relatório Final',
 dataPrevista: '2028-04-30',
 status: 'Pendente',
 observacoes: 'Relatório conclusivo com resultados genéticos consolidados.'
 }
 ],
 publicacoes: [
 {
 id: 'pub-1',
 titulo: 'Diversidade genética preliminar de primatas na Bacia do Rio de Contas',
 tipo: 'Resumo em Congresso',
 veiculo: 'Congresso Brasileiro de Primatologia 2026',
 ano: 2026,
 doiOuLink: 'https://doi.org/10.1016/j.cbprim.2026.04.012'
 }
 ],
 status: 'Autorizado',
 portariaNumero: 'Portaria INEMA nº 25.884/2026',
 dataEmissaoPortaria: '14/02/2026',
 dataPublicacaoDOE: '18/02/2026 (DOE Caderno Executivo p. 34)',
 parecerTecnico: 'Projeto com alto mérito científico alinhado às diretrizes do Plano de Manejo do PESC. Amostragem não letal aprovada pela CEUA e SISBIO. Viabilidade operacional assegurada pela equipe da UC.',
 condicionantes: [
 'Comunicar formalmente à chefia do PESC com antecedência mínima de 5 (cinco) dias úteis antes do ingresso na UC.',
 'Apresentar relatório técnico parcial ao término do 12º mês de vigência da Portaria.',
 'Depositar vouchers ou amostras biológicas na instituição fiel depositária credenciada informando os números de tombo ao INEMA.',
 'Encaminhar cópia digital de todas as publicações científicas e dissertações resultantes para a Biblioteca da CGEUC/INEMA.'
 ]
 },
 {
 id: 'pesq-002',
 numeroProtocolo: 'PESQ-2026/0031-BA',
 processoSEI: 'SEI-021.8490.2026.000305-19',
 tituloProjeto: 'Florística e conservação de briófitas e pteridófitas rupícolas nas serras do Parque Estadual das Sete Passagens',
 areaTematica: 'Botânica / Taxonomia Vegetal',
 instituicao: 'UEFS',
 pesquisadorResponsavel: 'Prof. Dr. Cláudio Augusto Ribeiro',
 cpfPesquisador: '123.456.789-01',
 lattesPesquisador: 'http://lattes.cnpq.br/1122334455667788',
 emailPesquisador: 'claudio.ribeiro@uefs.br',
 telefonePesquisador: '(75) 99122-8877',
 ucId: 'pesp',
 ucNome: 'Parque Estadual das Sete Passagens (PESP)',
 afetaZA: false,
 vigenciaMeses: 12,
 dataInicioPrevista: '2026-04-15',
 dataTerminoPrevista: '2027-04-14',
 haColeta: true,
 grupoTaxonomico: 'Plantas Não Vasculares (Bryophyta) e Monilophyta',
 metodologiaAmostragem: 'Coleta botânica manual de amostras férteis com faca de campo e secagem em estufa para herborização.',
 quantidadeAmostras: 'Até 150 espécimes botânicos para tombamento.',
 instituicaoDepositaria: 'Herbário UEFS',
 registroSisGen: 'SisGen B77610A',
 vinculoPlanoManejo: 'Inventário da Flora das Zonas Intangíveis e Primitivas do PESP',
 resumoProjeto: 'Inventário fisionômico e taxonômico das espécies botânicas que ocorrem nos campos rupestres e paredões quartzíticos do PESP.',
 equipe: [
 {
 id: 'eq-201',
 nome: 'Prof. Dr. Cláudio Augusto Ribeiro',
 funcao: 'Coordenador',
 titulacao: 'Doutor em Botânica (UFMG)',
 documento: '123.456.789-01',
 instituicao: 'UEFS'
 },
 {
 id: 'eq-202',
 nome: 'Mariana Duarte Prado',
 funcao: 'Pós-Graduando',
 titulacao: 'Mestranda do PPG em Botânica da UEFS',
 documento: '567.890.123-45',
 instituicao: 'UEFS'
 }
 ],
 relatorios: [
 {
 id: 'rel-201',
 tipo: 'Relatório Final',
 dataPrevista: '2027-05-30',
 status: 'Pendente',
 observacoes: 'Apresentação da lista de táxons e comprovante de tombo no HUEFS.'
 }
 ],
 publicacoes: [],
 status: 'Em Análise'
 },
 {
 id: 'pesq-003',
 numeroProtocolo: 'PESQ-2025/0089-BA',
 processoSEI: 'SEI-021.6500.2025.001422-90',
 tituloProjeto: 'Dinâmica hidrogeoquímica e vulnerabilidade cárstica na APA Gruta dos Brejões / Vereda do Romão Gramacho',
 areaTematica: 'Geociências / Hidrogeologia Cárstica',
 instituicao: 'UFBA',
 pesquisadorResponsavel: 'Dr. Fernando Sampaio Nogueira',
 cpfPesquisador: '789.012.345-67',
 lattesPesquisador: 'http://lattes.cnpq.br/9988776655443322',
 emailPesquisador: 'fernando.sampaio@ufba.br',
 telefonePesquisador: '(71) 98722-1100',
 ucId: 'apabrejoes',
 ucNome: 'APA Gruta dos Brejões / Vereda do Romão Gramacho',
 afetaZA: true,
 vigenciaMeses: 18,
 dataInicioPrevista: '2025-06-01',
 dataTerminoPrevista: '2026-11-30',
 haColeta: false,
 vinculoPlanoManejo: 'Monitoramento da Qualidade dos Aquíferos Subterrâneos Cársticos',
 resumoProjeto: 'Medição sazonal in situ de parâmetros físico-químicos das águas subterrâneas da bacia do Rio Jacaré e condutos cársticos da Gruta dos Brejões sem remoção de rocha ou espeleotemas.',
 equipe: [
 {
 id: 'eq-301',
 nome: 'Dr. Fernando Sampaio Nogueira',
 funcao: 'Coordenador',
 titulacao: 'Doutor em Geologia Ambiental',
 documento: '789.012.345-67',
 instituicao: 'UFBA'
 }
 ],
 relatorios: [
 {
 id: 'rel-301',
 tipo: 'Relatório Parcial',
 dataPrevista: '2026-06-01',
 status: 'Atrasado',
 observacoes: 'Relatório de 12 meses pendente de entrega pelo pesquisador coordenador.'
 }
 ],
 publicacoes: [],
 status: 'Autorizado',
 portariaNumero: 'Portaria INEMA nº 25.410/2025',
 dataEmissaoPortaria: '20/05/2025',
 dataPublicacaoDOE: '24/05/2025',
 condicionantes: [
 'Não realizar perfurações ou coleta física em espeleotemas ou sedimentos de caverna.',
 'Apresentar relatórios de monitoramento hidroquímico a cada 6 meses.',
 'Notificar o gestor da APA antes de ingressar no sistema cárstico.'
 ]
 }
];

export const PesquisaCientificaPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
 const { isDarkMode } = useTheme();
 const isDark = isDarkMode;

 // Navigation tabs
 const [activeTab, setActiveTab] = useState<'painel' | 'novo-projeto' | 'analise-tecnica' | 'detalhes'>('painel');

 // List of projects
 const [processos, setProcessos] = useState<ProcessoPesquisa[]>(MOCK_PESQUISAS);
 const [selectedProcesso, setSelectedProcesso] = useState<ProcessoPesquisa>(MOCK_PESQUISAS[0]);

 // Filters
 const [filtroStatus, setFiltroStatus] = useState<string>('todos');
 const [filtroArea, setFiltroArea] = useState<string>('todos');
 const [termoBusca, setTermoBusca] = useState<string>('');

 // Form State for New Project (multi-step wizard)
 const [etapaForm, setEtapaForm] = useState<number>(1);
 const [formUcId, setFormUcId] = useState<string>('UC-CONDURU');
 const [formAfetaZA, setFormAfetaZA] = useState<boolean>(false);
 const [formTitulo, setFormTitulo] = useState<string>('');
 const [formAreaTematica, setFormAreaTematica] = useState<string>('Ecologia / Conservação da Biodiversidade');
 const [formVinculoPlanoManejo, setFormVinculoPlanoManejo] = useState<string>('Programa de Pesquisa e Monitoramento da Biodiversidade');
 const [formVigenciaMeses, setFormVigenciaMeses] = useState<number>(12);
 const [formDataInicio, setFormDataInicio] = useState<string>('2026-05-01');
 const [formDataTermino, setFormDataTermino] = useState<string>('2027-04-30');
 const [formResumo, setFormResumo] = useState<string>('');

 // Step 2: Instituicao e Pesquisador
 const [formInstituicao, setFormInstituicao] = useState<string>('Universidade Federal da Bahia - UFBA');
 const [formPesquisador, setFormPesquisador] = useState<string>('Prof. Dr. Marcos Vinícius Neves');
 const [formCpf, setFormCpf] = useState<string>('345.987.123-90');
 const [formLattes, setFormLattes] = useState<string>('http://lattes.cnpq.br/3344556677889900');
 const [formEmail, setFormEmail] = useState<string>('marcos.neves@ufba.br');
 const [formTelefone, setFormTelefone] = useState<string>('(71) 98822-4411');
 const [equipeLista, setEquipeLista] = useState<MembroEquipe[]>([
 {
 id: 'm-1',
 nome: 'Prof. Dr. Marcos Vinícius Neves',
 funcao: 'Coordenador',
 titulacao: 'Doutor em Ecologia',
 documento: '345.987.123-90',
 instituicao: 'UFBA'
 },
 {
 id: 'm-2',
 nome: 'Juliana Castro Alcantara',
 funcao: 'Pós-Graduando',
 titulacao: 'Mestranda em Ecologia e Biomonitoramento',
 documento: '456.123.789-01',
 instituicao: 'UFBA'
 }
 ]);
 const [novoMembroNome, setNovoMembroNome] = useState('');
 const [novoMembroFuncao, setNovoMembroFuncao] = useState<MembroEquipe['funcao']>('Pós-Graduando');
 const [novoMembroTitulacao, setNovoMembroTitulacao] = useState('');
 const [novoMembroDoc, setNovoMembroDoc] = useState('');

 // Step 3: Coleta e Licencas Federais
 const [formHaColeta, setFormHaColeta] = useState<boolean>(false);
 const [formGrupoTaxonomico, setFormGrupoTaxonomico] = useState<string>('');
 const [formMetodologia, setFormMetodologia] = useState<string>('');
 const [formQtdAmostras, setFormQtdAmostras] = useState<string>('');
 const [formInstituicaoDepositaria, setFormInstituicaoDepositaria] = useState<string>('Herbário Alexandre Leal Costa (ALCB - UFBA)');
 const [formCEUA, setFormCEUA] = useState<string>('');
 const [formSisGen, setFormSisGen] = useState<string>('');
 const [formSISBIO, setFormSISBIO] = useState<string>('');

 // Dialogs
 const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState<boolean>(false);
 const [modalSucessoAberto, setModalSucessoAberto] = useState<boolean>(false);
 const [protocoloGerado, setProtocoloGerado] = useState<string>('');
 const [processoSEIGerado, setProcessoSEIGerado] = useState<string>('');

 // Modal para Analise Tecnica Deliberacao
 const [modalDecisaoAberto, setModalDecisaoAberto] = useState<boolean>(false);
 const [tipoDecisao, setTipoDecisao] = useState<'deferir' | 'complementar' | 'indeferir'>('deferir');
 const [textoJustificativa, setTextoJustificativa] = useState<string>('');
 const [mensagemToast, setMensagemToast] = useState<{ tipo: 'sucesso' | 'alerta' | 'erro'; texto: string } | null>(null);

 // Modal para Relatório
 const [modalRelatorioAberto, setModalRelatorioAberto] = useState<boolean>(false);
 const [tipoRelatorioEnvio, setTipoRelatorioEnvio] = useState<'Relatório Parcial' | 'Relatório Final'>('Relatório Parcial');
 const [relatorioArquivo, setRelatorioArquivo] = useState<string>('');

 // Modal para Publicação
 const [modalPublicacaoAberto, setModalPublicacaoAberto] = useState<boolean>(false);
 const [pubTitulo, setPubTitulo] = useState<string>('');
 const [pubTipo, setPubTipo] = useState<PublicacaoPesquisa['tipo']>('Artigo Científico (Periódico)');
 const [pubVeiculo, setPubVeiculo] = useState<string>('');
 const [pubAno, setPubAno] = useState<number>(2026);
 const [pubDoi, setPubDoi] = useState<string>('');

 const ucSelecionada = UNIDADES_CONSERVACAO_BAHIA.find((u) => u.value === formUcId) || UNIDADES_CONSERVACAO_BAHIA[0];

 // Adicionar Membro à equipe
 const handleAdicionarMembro = () => {
 if (!novoMembroNome.trim()) return;
 const novo: MembroEquipe = {
 id: 'eq-' + Date.now(),
 nome: novoMembroNome,
 funcao: novoMembroFuncao,
 titulacao: novoMembroTitulacao || 'Pesquisador',
 documento: novoMembroDoc || 'Não informado',
 instituicao: formInstituicao
 };
 setEquipeLista([...equipeLista, novo]);
 setNovoMembroNome('');
 setNovoMembroTitulacao('');
 setNovoMembroDoc('');
 };

 const handleRemoverMembro = (id: string) => {
 if (equipeLista.find((m) => m.id === id)?.funcao === 'Coordenador') {
 alert('O Coordenador Geral da pesquisa não pode ser removido.');
 return;
 }
 setEquipeLista(equipeLista.filter((m) => m.id !== id));
 };

 // Submeter Requerimento de Pesquisa
 const handleConfirmarSubmissao = () => {
 setModalConfirmacaoAberto(false);
 const novoNumProtocolo = `PESQ-2026/00${processos.length + 42}-BA`;
 const novoSEI = `SEI-021.9120.2026.000${processos.length + 510}-11`;

 const novoProcesso: ProcessoPesquisa = {
 id: 'pesq-' + Date.now(),
 numeroProtocolo: novoNumProtocolo,
 processoSEI: novoSEI,
 tituloProjeto: formTitulo || 'Estudo biogeográfico e caracterização ecológica na Unidade de Conservação',
 areaTematica: formAreaTematica,
 instituicao: formInstituicao,
 pesquisadorResponsavel: formPesquisador,
 cpfPesquisador: formCpf,
 lattesPesquisador: formLattes,
 emailPesquisador: formEmail,
 telefonePesquisador: formTelefone,
 ucId: formUcId,
 ucNome: ucSelecionada.label,
 afetaZA: formAfetaZA,
 vigenciaMeses: formVigenciaMeses,
 dataInicioPrevista: formDataInicio,
 dataTerminoPrevista: formDataTermino,
 haColeta: formHaColeta,
 grupoTaxonomico: formHaColeta ? formGrupoTaxonomico : undefined,
 metodologiaAmostragem: formHaColeta ? formMetodologia : undefined,
 quantidadeAmostras: formHaColeta ? formQtdAmostras : undefined,
 instituicaoDepositaria: formHaColeta ? formInstituicaoDepositaria : undefined,
 comiteEticaCEUA: formCEUA || undefined,
 registroSisGen: formSisGen || undefined,
 licencaFederalSISBIO: formSISBIO || undefined,
 vinculoPlanoManejo: formVinculoPlanoManejo,
 resumoProjeto: formResumo || 'Pesquisa acadêmica focada na dinâmica dos ecossistemas da UC.',
 equipe: equipeLista,
 relatorios: [
 {
 id: 'rel-' + Date.now(),
 tipo: formVigenciaMeses > 12 ? 'Relatório Parcial' : 'Relatório Final',
 dataPrevista: formVigenciaMeses > 12 ? '2027-04-30' : formDataTermino,
 status: 'Pendente',
 observacoes: 'Submissão mandatória conforme Portaria INEMA 25.753/2022.'
 }
 ],
 publicacoes: [],
 status: 'Em Análise'
 };

 setProcessos([novoProcesso, ...processos]);
 setSelectedProcesso(novoProcesso);
 setProtocoloGerado(novoNumProtocolo);
 setProcessoSEIGerado(novoSEI);
 setModalSucessoAberto(true);
 };

 // Executar Deliberação Técnica 
 const handleSalvarDecisao = () => {
 if (!selectedProcesso) return;
 setModalDecisaoAberto(false);

 if (tipoDecisao === 'deferir') {
 const portariaNum = `Portaria INEMA nº 25.${Math.floor(800 + Math.random() * 199)}/2026`;
 const dataHoje = '18/09/2026';
 const updated: ProcessoPesquisa = {
 ...selectedProcesso,
 status: 'Autorizado',
 portariaNumero: portariaNum,
 dataEmissaoPortaria: dataHoje,
 dataPublicacaoDOE: `${dataHoje} (DOE - Caderno Executivo)`,
 parecerTecnico: textoJustificativa || 'Projeto de pesquisa com relevância científica comprovada e plena conformidade com as diretrizes e zoneamento do Plano de Manejo da UC. Atende às normas da Portaria INEMA nº 25.753/2022.',
 condicionantes: [
 'Apresentar Relatório Técnico Parcial/Final ao INEMA/CGEUC no prazo regulamentar.',
 'Notificar formalmente o gestor da UC com antecedência de 5 dias antes de qualquer expedição de campo.',
 'Depositar espécimes coletados na instituição fiel depositária indicada e comprovar o respectivo número de tombo.',
 'Mencionar a autorização do INEMA e a Unidade de Conservação em todas as teses, artigos e publicações resultantes.'
 ]
 };
 setProcessos(processos.map((p) => (p.id === selectedProcesso.id ? updated : p)));
 setSelectedProcesso(updated);
 setMensagemToast({
 tipo: 'sucesso',
 texto: ` Documento emitido com sucesso! ${portariaNum} publicada no Diário Oficial do Estado.`
 });
 } else if (tipoDecisao === 'complementar') {
 const updated: ProcessoPesquisa = {
 ...selectedProcesso,
 status: 'Aguardando Complementação'
 };
 setProcessos(processos.map((p) => (p.id === selectedProcesso.id ? updated : p)));
 setSelectedProcesso(updated);
 setMensagemToast({
 tipo: 'alerta',
 texto: ' Há pendências documentais ou técnicas. Notificação enviada ao pesquisador com prazo de 15 dias.'
 });
 } else {
 const updated: ProcessoPesquisa = {
 ...selectedProcesso,
 status: 'Indeferido'
 };
 setProcessos(processos.map((p) => (p.id === selectedProcesso.id ? updated : p)));
 setSelectedProcesso(updated);
 setMensagemToast({
 tipo: 'erro',
 texto: ' Solicitação indeferida com base na análise técnica. Notificação disponibilizada com prazo recursal de 10 dias.'
 });
 }
 };

 // Enviar Relatório de Pesquisa 
 const handleEnviarRelatorio = () => {
 if (!selectedProcesso) return;
 setModalRelatorioAberto(false);
 const updatedRelatorios = selectedProcesso.relatorios.map((rel) => {
 if (rel.tipo === tipoRelatorioEnvio) {
 return {
 ...rel,
 status: 'Entregue' as const,
 dataEntrega: '18/09/2026',
 arquivoNome: relatorioArquivo || 'relatorio_pesquisa_inema_2026.pdf'
 };
 }
 return rel;
 });

 const updated: ProcessoPesquisa = {
 ...selectedProcesso,
 relatorios: updatedRelatorios,
 status: tipoRelatorioEnvio === 'Relatório Final' ? 'Concluído' : selectedProcesso.status
 };
 setProcessos(processos.map((p) => (p.id === selectedProcesso.id ? updated : p)));
 setSelectedProcesso(updated);
 setMensagemToast({
 tipo: 'sucesso',
 texto: `${tipoRelatorioEnvio} protocolado com sucesso no SEI-BA e encaminhado para validação técnica da CGEUC.`
 });
 };

 // Registrar Publicação Científica Decorrente 
 const handleCadastrarPublicacao = () => {
 if (!selectedProcesso || !pubTitulo.trim()) return;
 setModalPublicacaoAberto(false);
 const novaPub: PublicacaoPesquisa = {
 id: 'pub-' + Date.now(),
 titulo: pubTitulo,
 tipo: pubTipo,
 veiculo: pubVeiculo || 'Periódico Científico Indexado',
 ano: pubAno,
 doiOuLink: pubDoi || 'https://doi.org/10.1590/inema-pesquisa-2026'
 };

 const updated: ProcessoPesquisa = {
 ...selectedProcesso,
 publicacoes: [...selectedProcesso.publicacoes, novaPub]
 };
 setProcessos(processos.map((p) => (p.id === selectedProcesso.id ? updated : p)));
 setSelectedProcesso(updated);
 setMensagemToast({
 tipo: 'sucesso',
 texto: 'Publicação científica vinculada com sucesso ao acervo da Unidade de Conservação !'
 });
 setPubTitulo('');
 setPubVeiculo('');
 setPubDoi('');
 };

 // Filtragem
 const processosFiltrados = processos.filter((p) => {
 if (filtroStatus !== 'todos' && p.status !== filtroStatus) return false;
 if (filtroArea !== 'todos' && !p.areaTematica.toLowerCase().includes(filtroArea.toLowerCase())) return false;
 if (
 termoBusca &&
 !p.tituloProjeto.toLowerCase().includes(termoBusca.toLowerCase()) &&
 !p.pesquisadorResponsavel.toLowerCase().includes(termoBusca.toLowerCase()) &&
 !p.numeroProtocolo.toLowerCase().includes(termoBusca.toLowerCase()) &&
 !p.processoSEI.toLowerCase().includes(termoBusca.toLowerCase())
 ) {
 return false;
 }
 return true;
 });

 return (
 <div className={cn('min-h-screen p-6 transition-colors duration-200', isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900')}>
 {/* Toast Notification */}
 {mensagemToast && (
 <div
 className={cn(
 'fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-lg shadow-xl border text-sm max-w-md animate-in slide-in-from-bottom-5',
 mensagemToast.tipo === 'sucesso' && 'bg-emerald-950 border-emerald-700 text-emerald-100',
 mensagemToast.tipo === 'alerta' && 'bg-amber-950 border-amber-700 text-amber-100',
 mensagemToast.tipo === 'erro' && 'bg-rose-950 border-rose-700 text-rose-100'
 )}
 >
 {mensagemToast.tipo === 'sucesso' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
 {mensagemToast.tipo === 'alerta' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
 {mensagemToast.tipo === 'erro' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
 <div className="flex-1 font-medium">{mensagemToast.texto}</div>
 <button
 onClick={() => setMensagemToast(null)}
 className="text-slate-400 hover:text-white ml-2 text-xs"
 >
 ✕
 </button>
 </div>
 )}

      {/* Breadcrumb & Header com Botão de Ação Primária */}
      {activeTab !== 'novo-projeto' ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Autorização para Realização de Pesquisa Científica em UC
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Protocolo, análise técnica de viabilidade, emissão de Portaria normativa e acompanhamento de relatórios/publicações segundo a Portaria INEMA nº 25.753/2022.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEtapaForm(1);
                setActiveTab('novo-projeto');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F4C3A] hover:bg-[#0c3d2e] rounded-md shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Novo Projeto
            </button>
          </div>

          {/* Navegação por Abas Oficial GLA (Filament) */}
          <FilamentTabs
            tabs={[
              { id: 'painel', label: 'Projetos de Pesquisa', badge: processos.length },
              { id: 'detalhes', label: 'Atos e Relatórios' }
            ]}
            activeTab={activeTab === 'analise-tecnica' ? 'detalhes' : activeTab}
            onChange={(tabId) => {
              if (tabId === 'detalhes' && !selectedProcesso) {
                setSelectedProcesso(processos[0]);
              }
              setActiveTab(tabId as any);
            }}
            className="mb-6"
          />
        </>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Novo Requerimento de Pesquisa Científica
              </h1>
              <span className="text-[10px] font-medium font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                DOR004
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Instrução técnica de projeto para autorização em Unidade de Conservação Estadual (Portaria INEMA nº 25.753/2022).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('painel')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-md transition-colors shrink-0 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar aos Projetos
          </button>
        </div>
      )}

      {/* VIEW 1: PAINEL GERENCIAL */}
      {activeTab === 'painel' && (
        <div className="space-y-6">
          {/* Top Banner Informativo / Base Legal */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex items-start gap-3">
            
            <div className="text-xs space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Diretrizes Regulamentares - Portaria INEMA nº 25.753/2022 & Lei Federal 9.985/2000 (SNUC):
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                A autorização para realização de pesquisa científica em Unidades de Conservação Estaduais é ato formal publicado em Diário Oficial do Estado (DOE) e integrado ao SEI-BA. Toda pesquisa com coleta de espécimes exige indicação de instituição fiel depositária e a entrega de relatórios e publicações decorrentes é obrigatória para a regularidade do pesquisador .
              </p>
            </div>
          </div>

          {/* Cards de Métricas e KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pesquisas Ativas</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">18</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Em 12 UCs da Bahia</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Em Análise Técnica</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">05</p>
                <p className="text-[11px] text-slate-400 mt-0.5">SLA médio: 14 dias</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Relatórios Pendentes</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">03</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">1 com prazo vencido</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Produção Científica</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">42</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Artigos e Teses no acervo</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Busca */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por título, coordenador ou SEI..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 shrink-0 font-medium">Status:</span>
                    <FilamentSelect
                      value={filtroStatus}
                      onChange={(val) => setFiltroStatus(val)}
                      options={[
                        { value: 'todos', label: 'Todos os status' },
                        { value: 'Em Análise', label: 'Em Análise' },
                        { value: 'Autorizado', label: 'Autorizado' },
                        { value: 'Aguardando Complementação', label: 'Aguardando Complementação' },
                        { value: 'Concluído', label: 'Concluído' }
                      ]}
                      className="w-44 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 shrink-0 font-medium">Área:</span>
                    <FilamentSelect
                      value={filtroArea}
                      onChange={(val) => setFiltroArea(val)}
                      options={[
                        { value: 'todos', label: 'Todas as Áreas' },
                        { value: 'Zoologia', label: 'Zoologia' },
                        { value: 'Botânica', label: 'Botânica' },
                        { value: 'Ecologia', label: 'Ecologia' },
                        { value: 'Geociências', label: 'Geociências' }
                      ]}
                      className="w-40 text-xs"
                    />
                  </div>

                  <Button
                    size="sm"
                    className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold shadow-xs ml-auto"
                    onClick={() => {
                      setActiveTab('novo-projeto');
                      setEtapaForm(1);
                    }}
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1" />
                    Novo Projeto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Projetos de Pesquisa */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-100/50 dark:bg-slate-900/50 py-3 px-4 border-b border-slate-200 dark:border-slate-800">
              <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Processos de Pesquisa Científica Cadastrados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[1050px]">
                  <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4 whitespace-nowrap">Protocolo / Processo SEI</th>
                      <th className="py-3 px-4">Projeto / Área Temática</th>
                      <th className="py-3 px-4">Pesquisador / Instituição</th>
                      <th className="py-3 px-4">Unidade de Conservação</th>
                      <th className="py-3 px-4">Coleta / Salvaguarda</th>
                      <th className="py-3 px-4 whitespace-nowrap">Status / Ato</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {processosFiltrados.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap align-top">
                          <span className="font-semibold text-[#0F4C3A] dark:text-emerald-400 block">
                            {item.numeroProtocolo}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-mono">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            {item.processoSEI}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-sm align-top">
                          <span className="font-medium text-slate-900 dark:text-slate-100 block leading-snug">
                            {item.tituloProjeto}
                          </span>
                          <span className="inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                            {item.areaTematica}
                          </span>
                        </td>
                        <td className="py-3 px-4 min-w-[180px] align-top">
                          <span className="font-medium text-slate-900 dark:text-slate-100 block">{item.pesquisadorResponsavel}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">{item.instituicao}</span>
                        </td>
                        <td className="py-3 px-4 min-w-[170px] align-top">
                          <span className="font-medium text-slate-900 dark:text-slate-100 block">{item.ucNome}</span>
                          {item.afetaZA && (
                            <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-300 dark:text-amber-400 mt-1 font-normal">
                              Atinge ZA
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 min-w-[150px] align-top">
                          {item.haColeta ? (
                            <div>
                              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-medium whitespace-nowrap shrink-0 inline-flex items-center">
                                Com Coleta
                              </Badge>
                              {item.instituicaoDepositaria && (
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1 leading-tight">
                                  {item.instituicaoDepositaria}
                                </span>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-300 font-normal whitespace-nowrap shrink-0">
                              Sem Coleta
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap align-top">
                          {item.status === 'Autorizado' && (
                            <div className="flex flex-col items-start gap-1">
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs whitespace-nowrap shrink-0 inline-flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                                <span>Autorizado</span>
                              </Badge>
                              {item.portariaNumero && (
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                                  {item.portariaNumero}
                                </span>
                              )}
                            </div>
                          )}
                          {item.status === 'Em Análise' && (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs whitespace-nowrap shrink-0 inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                              <span>Em Análise</span>
                            </Badge>
                          )}
                          {item.status === 'Aguardando Complementação' && (
                            <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs whitespace-nowrap shrink-0 inline-flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-orange-600" />
                              <span>Complementação</span>
                            </Badge>
                          )}
                          {item.status === 'Concluído' && (
                            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs whitespace-nowrap shrink-0 inline-flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                              <span>Concluído</span>
                            </Badge>
                          )}
                          {item.status === 'Indeferido' && (
                            <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs whitespace-nowrap shrink-0 inline-flex items-center gap-1.5">
                              <X className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                              <span>Indeferido</span>
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap align-top">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2.5 border-slate-300 text-slate-700 hover:bg-slate-50 bg-white whitespace-nowrap shrink-0 inline-flex items-center"
                            onClick={() => {
                              setSelectedProcesso(item);
                              setActiveTab('detalhes');
                            }}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 shrink-0" />
                            <span>Ver Ato</span>
                          </Button>
                          {item.status === 'Em Análise' && (
                            <Button
                              size="sm"
                              className="text-xs h-7 px-2.5 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-medium whitespace-nowrap shrink-0 inline-flex items-center"
                              onClick={() => {
                                setSelectedProcesso(item);
                                setModalDecisaoAberto(true);
                              }}
                            >
                              <span>Analisar</span>
                            </Button>
                          )}
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

      {/* VIEW 2: CADASTRO DE PROJETO CIENTÍFICO */}
      {activeTab === 'novo-projeto' && (
 <div className="space-y-6 max-w-5xl mx-auto">
          {/* Stepper Wizard (Padrão Oficial GLA Inema) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <FilamentWizard
              steps={[
                { id: 1, label: 'Dados Gerais & UC' },
                { id: 2, label: 'Instituição & Equipe' },
                { id: 3, label: 'Coleta & Fiel Depositário' },
                { id: 4, label: 'Cronograma & Localização' },
                { id: 5, label: 'Instrução & Envio' }
              ]}
              currentStep={etapaForm}
              onStepClick={(step) => setEtapaForm(step)}
            />
          </div>

 {/* ETAPA 1: DADOS GERAIS E UNIDADE DE CONSERVAÇÃO */}
 {etapaForm === 1 && (
 <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="bg-slate-100/50 dark:bg-slate-900/50 py-3 px-4 border-b border-slate-200 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Etapa 1: Dados Gerais, Unidade de Conservação e Escopo do Projeto </CardTitle>
 <CardDescription className="text-xs">
 Informe a UC objeto da pesquisa, a correlação com a Zona de Amortecimento e o alinhamento com o Plano de Manejo.
 </CardDescription>
 </CardHeader>
 <CardContent className="p-6 space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Unidade de Conservação Estadual (CEUC)* <span className="text-slate-400 font-normal"></span>
 </label>
 <FilamentSelect
 value={formUcId}
 onChange={(val) => setFormUcId(val)}
 options={UNIDADES_CONSERVACAO_BAHIA.map((u) => ({
 value: u.value,
 label: `${u.label} (${u.categoria} - ${u.municipio})`
 }))}
 />
 <p className="text-[11px] text-slate-400 mt-1">
 Gestão Local: Coordenação Regional CGEUC | Categoria: {ucSelecionada.categoria}
 </p>
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Área Temática Principal* <span className="text-slate-400 font-normal"></span>
 </label>
 <FilamentSelect
 value={formAreaTematica}
 onChange={(val) => setFormAreaTematica(val)}
 options={[
 { value: 'Botânica / Taxonomia e Sistemática Vegetal', label: 'Botânica / Taxonomia e Sistemática Vegetal' },
 { value: 'Zoologia / Mastologia e Ornitologia', label: 'Zoologia / Mastologia e Ornitologia' },
 { value: 'Zoologia / Herpetologia e Ictiologia', label: 'Zoologia / Herpetologia e Ictiologia' },
 { value: 'Ecologia / Conservação da Biodiversidade', label: 'Ecologia / Conservação da Biodiversidade' },
 { value: 'Geociências / Hidrogeologia Cárstica e Espeleologia', label: 'Geociências / Hidrogeologia Cárstica e Espeleologia' },
 { value: 'Gestão Socioambiental e Comunidades Tradicionais', label: 'Gestão Socioambiental e Comunidades Tradicionais' }
 ]}
 />
 </div>
 </div>

 {/* Vínculo com Plano de Manejo */}
 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Vínculo com o Plano de Manejo da UC*
 </label>
 <input
 type="text"
 value={formVinculoPlanoManejo}
 onChange={(e) => setFormVinculoPlanoManejo(e.target.value)}
 placeholder="Ex: Subprograma de Monitoramento da Mastofauna da Zona Primitiva"
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 <p className="text-[11px] text-slate-400 mt-1">
 Conforme , as pesquisas devem estar vinculadas às linhas prioritárias do Plano de Manejo ou programas de conservação da UC.
 </p>
 </div>

 {/* Título do Projeto */}
 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Título do Projeto Científico*
 </label>
 <input
 type="text"
 value={formTitulo}
 onChange={(e) => setFormTitulo(e.target.value)}
 placeholder="Título completo do projeto conforme registrado na instituição de pesquisa..."
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 {/* Resumo e Justificativa */}
 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Resumo Executivo e Objetivos da Pesquisa* <span className="text-slate-400 font-normal"></span>
 </label>
 <textarea
 rows={4}
 value={formResumo}
 onChange={(e) => setFormResumo(e.target.value)}
 placeholder="Descreva de forma clara e objetiva o problema de pesquisa, metodologia sintetizada, área de abrangência e contribuição para a conservação da UC..."
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none"
 />
 </div>

 {/* Zona de Amortecimento e Vigência */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
 <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
 <input
 type="checkbox"
 id="checkZA"
 checked={formAfetaZA}
 onChange={(e) => setFormAfetaZA(e.target.checked)}
 className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
 />
 <label htmlFor="checkZA" className="text-xs cursor-pointer select-none">
 <span className="font-semibold block">Atinge Zona de Amortecimento (ZA)</span>
 <span className="text-[11px] text-slate-500"></span>
 </label>
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Vigência Pretendida*
 </label>
 <select
 value={formVigenciaMeses}
 onChange={(e) => setFormVigenciaMeses(Number(e.target.value))}
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 >
 <option value={6}>6 meses</option>
 <option value={12}>12 meses (Padrão Portaria INEMA 25.753)</option>
 <option value={24}>24 meses (Projetos de Longa Duração / PELD)</option>
 </select>
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Início Previsto em Campo*
 </label>
 <input
 type="date"
 value={formDataInicio}
 onChange={(e) => setFormDataInicio(e.target.value)}
 className="w-full text-xs p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>
 </div>
 </CardContent>
 <CardFooter className="bg-slate-50 dark:bg-slate-900/30 p-4 flex justify-between border-t border-slate-200 dark:border-slate-800">
 <Button variant="outline" size="sm" onClick={() => setActiveTab('painel')}>
 Voltar ao Painel
 </Button>
 <Button
 size="sm"
 className="bg-teal-700 hover:bg-teal-800 text-white"
 onClick={() => {
 if (!formTitulo.trim()) {
 alert(' Preencha os campos obrigatórios para continuar.');
 return;
 }
 setEtapaForm(2);
 }}
 >
 Avançar para Instituição e Equipe
 <ArrowRight className="w-4 h-4 ml-1.5" />
 </Button>
 </CardFooter>
 </Card>
 )}

 {/* ETAPA 2: INSTITUIÇÃO E EQUIPE TÉCNICA */}
 {etapaForm === 2 && (
 <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="bg-slate-100/50 dark:bg-slate-900/50 py-3 px-4 border-b border-slate-200 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Etapa 2: Instituição Técnico-Científica e Equipe de Pesquisa</CardTitle>
 <CardDescription className="text-xs">
 Vínculo institucional, dados do pesquisador coordenador e relação dos membros autorizados a ingressar na UC.
 </CardDescription>
 </CardHeader>
 <CardContent className="p-6 space-y-6">
 {/* Dados da Instituição e Coordenador */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
 <div className="md:col-span-2">
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Instituição de Ensino / Pesquisa Vinculada*
 </label>
 <input
 type="text"
 value={formInstituicao}
 onChange={(e) => setFormInstituicao(e.target.value)}
 placeholder="Ex: Universidade Federal da Bahia - UFBA"
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Pesquisador Coordenador Responsável*
 </label>
 <input
 type="text"
 value={formPesquisador}
 onChange={(e) => setFormPesquisador(e.target.value)}
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 CPF do Coordenador*
 </label>
 <input
 type="text"
 value={formCpf}
 onChange={(e) => setFormCpf(e.target.value)}
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Link do Currículo Lattes*
 </label>
 <input
 type="url"
 value={formLattes}
 onChange={(e) => setFormLattes(e.target.value)}
 placeholder="http://lattes.cnpq.br/..."
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 E-mail e Telefone de Contato*
 </label>
 <div className="grid grid-cols-2 gap-2">
 <input
 type="email"
 value={formEmail}
 onChange={(e) => setFormEmail(e.target.value)}
 placeholder="email@instituicao.br"
 className="text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 <input
 type="text"
 value={formTelefone}
 onChange={(e) => setFormTelefone(e.target.value)}
 placeholder="(71) 99999-0000"
 className="text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>
 </div>
 </div>

 {/* Grid de Membros da Equipe */}
 <div>
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
 Membros da Equipe Científica Autorizados
 </h3>
 <Badge variant="outline" className="text-xs">
 {equipeLista.length} participante(s)
 </Badge>
 </div>

 <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden mb-4">
 <table className="w-full text-left text-xs">
 <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
 <tr>
 <th className="p-2.5">Nome do Pesquisador</th>
 <th className="p-2.5">Função no Projeto</th>
 <th className="p-2.5">Titulação</th>
 <th className="p-2.5">CPF / Documento</th>
 <th className="p-2.5 text-right">Ação</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
 {equipeLista.map((m) => (
 <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
 <td className="p-2.5 font-medium">{m.nome}</td>
 <td className="p-2.5">
 <Badge variant="outline" className="text-[10px]">
 {m.funcao}
 </Badge>
 </td>
 <td className="p-2.5 text-slate-500 dark:text-slate-400">{m.titulacao}</td>
 <td className="p-2.5 text-slate-500 dark:text-slate-400">{m.documento}</td>
 <td className="p-2.5 text-right">
 {m.funcao !== 'Coordenador' && (
 <button
 type="button"
 onClick={() => handleRemoverMembro(m.id)}
 className="text-rose-600 hover:text-rose-700 p-1 text-xs"
 title="Remover participante"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Formulário para Adicionar Membro */}
 <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
 <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-2">
 Adicionar Pesquisador / Aluno à Equipe de Campo:
 </p>
 <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
 <input
 type="text"
 placeholder="Nome completo..."
 value={novoMembroNome}
 onChange={(e) => setNovoMembroNome(e.target.value)}
 className="text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 sm:col-span-2"
 />
 <select
 value={novoMembroFuncao}
 onChange={(e) => setNovoMembroFuncao(e.target.value as MembroEquipe['funcao'])}
 className="text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 >
 <option value="Pesquisador Associado">Pesquisador Associado</option>
 <option value="Pós-Graduando">Pós-Graduando (Mestrado/Doutorado)</option>
 <option value="Iniciação Científica">Iniciação Científica</option>
 <option value="Auxiliar de Campo">Auxiliar de Campo</option>
 </select>
 <Button
 type="button"
 size="sm"
 variant="secondary"
 onClick={handleAdicionarMembro}
 className="text-xs"
 >
 <PlusCircle className="w-3.5 h-3.5 mr-1" />
 Adicionar
 </Button>
 </div>
 </div>
 </div>
 </CardContent>
 <CardFooter className="bg-slate-50 dark:bg-slate-900/30 p-4 flex justify-between border-t border-slate-200 dark:border-slate-800">
 <Button variant="outline" size="sm" onClick={() => setEtapaForm(1)}>
 <ArrowLeft className="w-4 h-4 mr-1.5" />
 Voltar
 </Button>
 <Button
 size="sm"
 className="bg-teal-700 hover:bg-teal-800 text-white"
 onClick={() => setEtapaForm(3)}
 >
 Avançar para Coleta e Salvaguardas
 <ArrowRight className="w-4 h-4 ml-1.5" />
 </Button>
 </CardFooter>
 </Card>
 )}

 {/* ETAPA 3: COLETA, SALVAGUARDAS E FIEL DEPOSITÁRIO */}
 {etapaForm === 3 && (
 <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="bg-slate-100/50 dark:bg-slate-900/50 py-3 px-4 border-b border-slate-200 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Etapa 3: Coleta / Captura de Espécimes, Licenças Federais & Instituição Depositária</CardTitle>
 <CardDescription className="text-xs">
 Validações específicas para acesso a material biológico, patrimônio genético e comitês de ética.
 </CardDescription>
 </CardHeader>
 <CardContent className="p-6 space-y-6">
 {/* Alerta */}
 <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-lg flex items-start gap-3">
 <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
 <div className="text-xs text-amber-900 dark:text-amber-200">
 <span className="font-semibold block">Regra de Negócio - Independência de Autorizações:</span>
 A autorização de pesquisa em Unidade de Conservação emitida pelo INEMA NÃO substitui outras autorizações exigíveis por lei federal, tais como licença SISBIO/ICMBio (para fauna/espécies ameaçadas), parecer do CEUA (animais vertebrados) ou cadastro SisGen (patrimônio genético).
 </div>
 </div>

 {/* Toggle Coleta */}
 <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
 <input
 type="checkbox"
 id="checkColeta"
 checked={formHaColeta}
 onChange={(e) => setFormHaColeta(e.target.checked)}
 className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-5 h-5"
 />
 <div>
 <label htmlFor="checkColeta" className="text-xs font-bold cursor-pointer select-none block">
 A pesquisa científica prevê COLETA, CAPTURA, MARCAÇÃO ou TRANSPORTE de material biológico/geológico? 
 </label>
 <span className="text-[11px] text-slate-500 dark:text-slate-400">
 Caso desmarcado, a pesquisa será tratada como observacional/não invasiva.
 </span>
 </div>
 </div>

 {/* Campos Condicionais de Coleta */}
 {formHaColeta && (
 <div className="space-y-4 p-4 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20">
 <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-2">
 <Sparkles className="w-3.5 h-3.5 text-amber-600" />
 Detalhamento Amostral e Salvaguardas Biológicas
 </h4>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Grupo Taxonômico Objeto da Coleta*
 </label>
 <input
 type="text"
 value={formGrupoTaxonomico}
 onChange={(e) => setFormGrupoTaxonomico(e.target.value)}
 placeholder="Ex: Anfíbios anuros da família Hylidae"
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Quantidade Amostral Estimada*
 </label>
 <input
 type="text"
 value={formQtdAmostras}
 onChange={(e) => setFormQtdAmostras(e.target.value)}
 placeholder="Ex: Máximo de 15 espécimes ou 30 amostras de tecido"
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Metodologia de Captura, Amostragem e Sacrifício (se houver)*
 </label>
 <textarea
 rows={3}
 value={formMetodologia}
 onChange={(e) => setFormMetodologia(e.target.value)}
 placeholder="Descreva as técnicas de campo, armadilhas, protocolo de contenção, anestésico e conservação das amostras..."
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Instituição Científica Fiel Depositária (Herbário / Museu de Zoologia)*
 </label>
 <input
 type="text"
 value={formInstituicaoDepositaria}
 onChange={(e) => setFormInstituicaoDepositaria(e.target.value)}
 placeholder="Ex: Herbário da Universidade Estadual de Santa Cruz (HURB/UESC)"
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 <p className="text-[11px] text-slate-500 mt-1">
 Deverá ser anexada carta de anuência formal da curadoria da instituição depositária aceitando o tombamento.
 </p>
 </div>
 </div>
 )}

 {/* Licenças Federais e Comitês */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Nº da Autorização SISBIO / ICMBio
 </label>
 <input
 type="text"
 value={formSISBIO}
 onChange={(e) => setFormSISBIO(e.target.value)}
 placeholder="Ex: SISBIO nº 78492-1"
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Parecer CEUA (Comitê de Ética)
 </label>
 <input
 type="text"
 value={formCEUA}
 onChange={(e) => setFormCEUA(e.target.value)}
 placeholder="Ex: CEUA-UFBA nº 042/2026"
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Código SisGen (Patrimônio Genético)
 </label>
 <input
 type="text"
 value={formSisGen}
 onChange={(e) => setFormSisGen(e.target.value)}
 placeholder="Ex: SisGen A12B98C"
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>
 </div>
 </CardContent>
 <CardFooter className="bg-slate-50 dark:bg-slate-900/30 p-4 flex justify-between border-t border-slate-200 dark:border-slate-800">
 <Button variant="outline" size="sm" onClick={() => setEtapaForm(2)}>
 <ArrowLeft className="w-4 h-4 mr-1.5" />
 Voltar
 </Button>
 <Button
 size="sm"
 className="bg-teal-700 hover:bg-teal-800 text-white"
 onClick={() => setEtapaForm(4)}
 >
 Avançar para Cronograma & Localização
 <ArrowRight className="w-4 h-4 ml-1.5" />
 </Button>
 </CardFooter>
 </Card>
 )}

 {/* ETAPA 4: CRONOGRAMA & LOCALIZAÇÃO GEOGRÁFICA */}
 {etapaForm === 4 && (
 <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="bg-slate-100/50 dark:bg-slate-900/50 py-3 px-4 border-b border-slate-200 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Etapa 4: Cronograma de Expedições de Campo e Localização Geoespacial</CardTitle>
 <CardDescription className="text-xs">
 Planejamento das campanhas na UC e upload de poligonal/coordenadas dos pontos de amostragem.
 </CardDescription>
 </CardHeader>
 <CardContent className="p-6 space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Data Início Estimada das Campanhas
 </label>
 <input
 type="date"
 value={formDataInicio}
 onChange={(e) => setFormDataInicio(e.target.value)}
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Data Término Estimada das Campanhas
 </label>
 <input
 type="date"
 value={formDataTermino}
 onChange={(e) => setFormDataTermino(e.target.value)}
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>
 </div>

 {/* Trilhas e Zonas de Manejo */}
 <div>
 <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Trilhas, Cursos D'água e Zonas de Manejo Pretendidas
 </label>
 <input
 type="text"
 defaultValue="Trilha da Serra, Bacia do Rio de Contas e Zona Primitiva"
 placeholder="Especifique os atrativos, vales ou zonas onde ocorrerão as coletas..."
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>

 {/* Upload Geoespacial */}
 <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2">
 <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
 Upload de Coordenadas dos Pontos Amostrais / Poligonal (SHP / KML / KMZ)
 </span>
 <div className="flex items-center gap-3">
 <input
 type="file"
 id="shpInput"
 className="hidden"
 />
 <label
 htmlFor="shpInput"
 className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-xs font-medium"
 >
 <Upload className="w-4 h-4 text-teal-600" />
 Carregar Arquivo Geoespacial (KML / KMZ)
 </label>
 <span className="text-xs text-slate-400">poligonal_pesquisa_amostragem.kml (Carregado)</span>
 </div>
 </div>
 </CardContent>
 <CardFooter className="bg-slate-50 dark:bg-slate-900/30 p-4 flex justify-between border-t border-slate-200 dark:border-slate-800">
 <Button variant="outline" size="sm" onClick={() => setEtapaForm(3)}>
 <ArrowLeft className="w-4 h-4 mr-1.5" />
 Voltar
 </Button>
 <Button
 size="sm"
 className="bg-teal-700 hover:bg-teal-800 text-white"
 onClick={() => setEtapaForm(5)}
 >
 Avançar para Instrução Documental
 <ArrowRight className="w-4 h-4 ml-1.5" />
 </Button>
 </CardFooter>
 </Card>
 )}

 {/* ETAPA 5: INSTRUÇÃO DOCUMENTAL E SUBMISSÃO */}
 {etapaForm === 5 && (
 <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
 <CardHeader className="bg-slate-100/50 dark:bg-slate-900/50 py-3 px-4 border-b border-slate-200 dark:border-slate-800">
 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">Etapa 5: Instrução Documental Obrigatória e Protocolização</CardTitle>
 <CardDescription className="text-xs">
 Anexe os documentos necessários para a formalização do processo no SEI-BA e validação da CGEUC.
 </CardDescription>
 </CardHeader>
 <CardContent className="p-6 space-y-4">
 <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
 <table className="w-full text-left text-xs">
 <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
 <tr>
 <th className="p-3">Documento Obrigatório</th>
 <th className="p-3">Obrigatoriedade</th>
 <th className="p-3">Status do Arquivo</th>
 <th className="p-3 text-right">Ação</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
 <tr>
 <td className="p-3 font-medium">Projeto de Pesquisa Científica Detalhado (PDF)</td>
 <td className="p-3"><Badge className="bg-teal-700 text-white text-[10px]">Obrigatório</Badge></td>
 <td className="p-3 text-emerald-600 font-medium flex items-center gap-1">
 <CheckCircle2 className="w-3.5 h-3.5" /> projeto_completo_inema_2026.pdf
 </td>
 <td className="p-3 text-right">
 <Button size="sm" variant="ghost" className="h-6 text-xs text-teal-700">Substituir</Button>
 </td>
 </tr>
 <tr>
 <td className="p-3 font-medium">Carta de Anuência Institucional (Coordenação / Reitoria)</td>
 <td className="p-3"><Badge className="bg-teal-700 text-white text-[10px]">Obrigatório</Badge></td>
 <td className="p-3 text-emerald-600 font-medium flex items-center gap-1">
 <CheckCircle2 className="w-3.5 h-3.5" /> anuencia_institucional_ufba.pdf
 </td>
 <td className="p-3 text-right">
 <Button size="sm" variant="ghost" className="h-6 text-xs text-teal-700">Substituir</Button>
 </td>
 </tr>
 <tr>
 <td className="p-3 font-medium">Termo de Compromisso e Responsabilidade do Pesquisador</td>
 <td className="p-3"><Badge className="bg-teal-700 text-white text-[10px]">Obrigatório</Badge></td>
 <td className="p-3 text-emerald-600 font-medium flex items-center gap-1">
 <CheckCircle2 className="w-3.5 h-3.5" /> termo_compromisso_assinado.pdf
 </td>
 <td className="p-3 text-right">
 <Button size="sm" variant="ghost" className="h-6 text-xs text-teal-700">Substituir</Button>
 </td>
 </tr>
 {formHaColeta && (
 <tr>
 <td className="p-3 font-medium">Declaração da Instituição Depositária (Fiel Depositário)</td>
 <td className="p-3"><Badge className="bg-amber-600 text-white text-[10px]">Exigido p/ Coleta</Badge></td>
 <td className="p-3 text-emerald-600 font-medium flex items-center gap-1">
 <CheckCircle2 className="w-3.5 h-3.5" /> declaracao_aceite_herbario.pdf
 </td>
 <td className="p-3 text-right">
 <Button size="sm" variant="ghost" className="h-6 text-xs text-teal-700">Substituir</Button>
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 {/* Resumo do Requerimento */}
 <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-2 text-xs">
 <p className="font-bold text-slate-800 dark:text-slate-200">Resumo da Solicitação para Protocolo:</p>
 <p><span className="font-semibold">Projeto:</span> {formTitulo || 'Não preenchido'}</p>
 <p><span className="font-semibold">UC:</span> {ucSelecionada.label} | <span className="font-semibold">Vigência:</span> {formVigenciaMeses} meses</p>
 <p><span className="font-semibold">Coordenador:</span> {formPesquisador} ({formInstituicao})</p>
 <p><span className="font-semibold">Coleta:</span> {formHaColeta ? `Sim (${formGrupoTaxonomico || 'Prevista'})` : 'Não (Observacional)'}</p>
 </div>
 </CardContent>
 <CardFooter className="bg-slate-50 dark:bg-slate-900/30 p-4 flex justify-between border-t border-slate-200 dark:border-slate-800">
 <Button variant="outline" size="sm" onClick={() => setEtapaForm(4)}>
 <ArrowLeft className="w-4 h-4 mr-1.5" />
 Voltar
 </Button>
 <div className="space-x-2">
 <Button
 variant="outline"
 size="sm"
 onClick={() => {
 setMensagemToast({
 tipo: 'sucesso',
 texto: 'Rascunho do projeto salvo no sistema. É possível retomar o preenchimento mais tarde.'
 });
 }}
 >
 Salvar Rascunho
 </Button>
 <Button
 size="sm"
 className="bg-teal-700 hover:bg-teal-800 text-white"
 onClick={() => setModalConfirmacaoAberto(true)}
 >
 <Send className="w-4 h-4 mr-1.5" />
 Enviar e Protocolar no SEI-BA
 </Button>
 </div>
 </CardFooter>
 </Card>
 )}
 </div>
 )}

 {/* VIEW 3: ATO E GESTÃO PÓS-AUTORIZAÇÃO */}
 {activeTab === 'detalhes' && (() => {
   const processoFoco = selectedProcesso || processos[0];
   if (!processoFoco) return null;

   return (
     <div className="space-y-6">
          {/* Top Process Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
                    {processoFoco.numeroProtocolo}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {processoFoco.processoSEI}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs font-medium',
                      processoFoco.status === 'Autorizado' && 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
                      processoFoco.status === 'Em Análise' && 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
                      processoFoco.status === 'Concluído' && 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
                      processoFoco.status === 'Indeferido' && 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                    )}
                  >
                    {processoFoco.status}
                  </Badge>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {processoFoco.tituloProjeto}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Unidade de Conservação: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{processoFoco.ucNome}</strong> | Coordenador: {processoFoco.pesquisadorResponsavel} ({processoFoco.instituicao})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {processoFoco.status === 'Em Análise' && (
                  <Button
                    size="sm"
                    className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold shadow-xs"
                    onClick={() => setModalDecisaoAberto(true)}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                    Realizar Análise Técnica
                  </Button>
                )}
                {processoFoco.status === 'Autorizado' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-medium border-slate-300 text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:bg-slate-800"
                      onClick={() => {
                        alert('Download da Portaria oficial em PDF gerada com assinatura digital do INEMA.');
                      }}
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Baixar Portaria (PDF)
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold shadow-xs"
                      onClick={() => setModalRelatorioAberto(true)}
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      Enviar Relatório
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Seção 1: Certidão / Portaria Formal de Autorização */}
          {processoFoco.status === 'Autorizado' && (
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <CardHeader className="py-3.5 px-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {processoFoco.portariaNumero || 'Portaria de Autorização Científica'}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Publicado no Diário Oficial do Estado: {processoFoco.dataPublicacaoDOE || 'Publicado'} • Fundamentação: Portaria INEMA nº 25.753/2022
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-xs font-medium self-start sm:self-auto"
                  >
                    Vigência Ativa
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs mb-1.5">
                    Parecer Técnico Conclusivo:
                  </h4>
                  <div className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-md border border-slate-200 dark:border-slate-800 leading-relaxed">
                    {processoFoco.parecerTecnico}
                  </div>
                </div>

                {processoFoco.condicionantes && processoFoco.condicionantes.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs mb-2">
                      Condicionantes Ambientais Fixadas no Ato:
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300">
                      {processoFoco.condicionantes.map((cond, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {cond}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Seção 2: Acompanhamento de Relatórios Parciais e Finais */}
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Controle de Relatórios Técnicos Parciais e Finais
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Obrigação regulamentar do pesquisador coordenador para prestação de contas dos resultados.
                </CardDescription>
              </div>
              {processoFoco.status === 'Autorizado' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-medium border-slate-300 text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 self-start sm:self-auto"
                  onClick={() => setModalRelatorioAberto(true)}
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Protocolar Relatório
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Tipo do Relatório</th>
                      <th className="px-4 py-3 font-semibold">Prazo Regulamentar</th>
                      <th className="px-4 py-3 font-semibold">Data de Protocolo</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Arquivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {processoFoco.relatorios.map((rel) => (
                      <tr key={rel.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{rel.tipo}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{rel.dataPrevista}</td>
                        <td className="px-4 py-3 text-slate-500">{rel.dataEntrega || 'Pendente'}</td>
                        <td className="px-4 py-3">
                          {rel.status === 'Entregue' && (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-medium">
                              Entregue / Em Análise
                            </Badge>
                          )}
                          {rel.status === 'Pendente' && (
                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[11px] font-medium">
                              Aguardando Período
                            </Badge>
                          )}
                          {rel.status === 'Atrasado' && (
                            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[11px] font-medium">
                              Atrasado
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {rel.arquivoNome ? (
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-700 hover:text-[#0F4C3A]">
                              <Download className="w-3.5 h-3.5 mr-1" /> Baixar
                            </Button>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Seção 3: Registro de Publicações e Produtos Científicos Decorrentes */}
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Publicações e Produtos Científicos Resultantes
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Artigos em periódicos, dissertações, teses e patentes decorrentes da autorização da UC.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs font-medium border-slate-300 text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 self-start sm:self-auto"
                onClick={() => setModalPublicacaoAberto(true)}
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                Vincular Publicação
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              {processoFoco.publicacoes.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Nenhuma publicação científica vinculada até o momento. O pesquisador deve cadastrar os artigos publicados com a citação institucional do INEMA.
                </div>
              ) : (
                <div className="space-y-3">
                  {processoFoco.publicacoes.map((pub) => (
                    <div
                      key={pub.id}
                      className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">{pub.titulo}</span>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Badge variant="outline" className="text-[10px] bg-white dark:bg-slate-800">{pub.tipo}</Badge>
                          <span>{pub.veiculo} ({pub.ano})</span>
                        </div>
                      </div>
                      <a
                        href={pub.doiOuLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0F4C3A] dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px] shrink-0 font-medium"
                      >
                        <Share2 className="w-3 h-3" />
                        Ver DOI / Link
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
   );
 })()}

 {/* MODAL 1: CONFIRMAÇÃO DE SUBMISSÃO COM */}
 <Dialog open={modalConfirmacaoAberto} onOpenChange={setModalConfirmacaoAberto}>
 <DialogContent className="max-w-md">
 <DialogHeader>
 <DialogTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
 <AlertTriangle className="w-5 h-5 text-amber-500" />
 Confirmação de Protocolização
 </DialogTitle>
 <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
 O envio da solicitação não implica deferimento automático. Deseja continuar?
 </DialogDescription>
 </DialogHeader>
 <div className="py-2 text-xs text-slate-600 dark:text-slate-300 space-y-2">
 <p>
 Ao confirmar, o projeto será autuado no SEI-BA e distribuído para análise do Gestor da UC e equipe técnica da CGEUC/DISUC.
 </p>
 <p className="font-semibold text-amber-700 dark:text-amber-400">
 As atividades de campo somente poderão ocorrer após publicação formal da Portaria no Diário Oficial do Estado (DOE).
 </p>
 </div>
 <DialogFooter className="gap-2">
 <Button variant="outline" size="sm" onClick={() => setModalConfirmacaoAberto(false)}>
 Cancelar
 </Button>
 <Button
 size="sm"
 className="bg-teal-700 hover:bg-teal-800 text-white"
 onClick={handleConfirmarSubmissao}
 >
 Confirmar e Protocolar
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 {/* MODAL 2: SUCESSO DE SUBMISSÃO COM */}
 <Dialog open={modalSucessoAberto} onOpenChange={setModalSucessoAberto}>
 <DialogContent className="max-w-md text-center">
 <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600">
 <CheckCircle2 className="w-6 h-6" />
 </div>
 <DialogHeader className="text-center">
 <DialogTitle className="text-base text-emerald-950 dark:text-emerald-100 text-center">
 Solicitação registrada com sucesso!
 </DialogTitle>
 <DialogDescription className="text-xs text-center">
 Aguarde a manifestação do Gestor da UC e análise técnica conclusiva do INEMA.
 </DialogDescription>
 </DialogHeader>
 <div className="my-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs space-y-1 font-mono text-left border border-slate-200 dark:border-slate-800">
 <p className="text-slate-500">Número de Protocolo: <strong className="text-teal-700 dark:text-teal-400">{protocoloGerado}</strong></p>
 <p className="text-slate-500">Processo SEI-BA: <strong className="text-slate-800 dark:text-slate-200">{processoSEIGerado}</strong></p>
 </div>
 <DialogFooter className="justify-center">
 <Button
 size="sm"
 className="bg-teal-700 hover:bg-teal-800 text-white"
 onClick={() => {
 setModalSucessoAberto(false);
 setActiveTab('painel');
 }}
 >
 Ir para o Painel de Pesquisas
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 {/* MODAL 3: ANÁLISE TÉCNICA E DELIBERAÇÃO */}
 <Dialog open={modalDecisaoAberto} onOpenChange={setModalDecisaoAberto}>
 <DialogContent className="max-w-xl">
 <DialogHeader>
 <DialogTitle className="text-base flex items-center gap-2">
 <ShieldCheck className="w-5 h-5 text-teal-600" />
 Análise Técnica e Deliberação - CGEUC/DISUC 
 </DialogTitle>
 <DialogDescription className="text-xs">
 Avaliação de mérito, zoneamento do Plano de Manejo e emissão de Portaria conclusiva.
 </DialogDescription>
 </DialogHeader>
 <div className="space-y-4 py-2 text-xs">
 <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
 <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedProcesso.tituloProjeto}</p>
 <p className="text-slate-500 mt-0.5">UC: {selectedProcesso.ucNome} | Coordenador: {selectedProcesso.pesquisadorResponsavel}</p>
 </div>

 <div>
 <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Decisão da CGEUC / Diretoria:
 </label>
 <div className="grid grid-cols-3 gap-2">
 <Button
 type="button"
 size="sm"
 variant={tipoDecisao === 'deferir' ? 'default' : 'outline'}
 className={cn(tipoDecisao === 'deferir' && 'bg-emerald-700 hover:bg-emerald-800 text-white')}
 onClick={() => setTipoDecisao('deferir')}
 >
 <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
 Deferir (Emitir Portaria)
 </Button>
 <Button
 type="button"
 size="sm"
 variant={tipoDecisao === 'complementar' ? 'default' : 'outline'}
 className={cn(tipoDecisao === 'complementar' && 'bg-amber-600 hover:bg-amber-700 text-white')}
 onClick={() => setTipoDecisao('complementar')}
 >
 <AlertTriangle className="w-3.5 h-3.5 mr-1" />
 Complementação
 </Button>
 <Button
 type="button"
 size="sm"
 variant={tipoDecisao === 'indeferir' ? 'default' : 'outline'}
 className={cn(tipoDecisao === 'indeferir' && 'bg-rose-700 hover:bg-rose-800 text-white')}
 onClick={() => setTipoDecisao('indeferir')}
 >
 <X className="w-3.5 h-3.5 mr-1" />
 Indeferir
 </Button>
 </div>
 </div>

 <div>
 <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
 Fundamentação / Parecer Técnico Estruturado:
 </label>
 <textarea
 rows={4}
 value={textoJustificativa}
 onChange={(e) => setTextoJustificativa(e.target.value)}
 placeholder="Registre os fundamentos biológicos, impacto sobre a UC, capacidade de suporte e termos da Portaria..."
 className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
 />
 </div>
 </div>
 <DialogFooter className="gap-2">
 <Button variant="outline" size="sm" onClick={() => setModalDecisaoAberto(false)}>
 Fechar
 </Button>
 <Button
 size="sm"
 className="bg-teal-700 hover:bg-teal-800 text-white"
 onClick={handleSalvarDecisao}
 >
 Salvar Deliberação
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 {/* MODAL 4: PROTOCOLO DE RELATÓRIO */}
 <Dialog open={modalRelatorioAberto} onOpenChange={setModalRelatorioAberto}>
 <DialogContent className="max-w-md">
 <DialogHeader>
 <DialogTitle className="text-base flex items-center gap-2">
 <Upload className="w-5 h-5 text-teal-600" />
 Protocolar Relatório de Pesquisa 
 </DialogTitle>
 <DialogDescription className="text-xs">
 Envio formal de prestação de contas dos trabalhos de campo e laboratório.
 </DialogDescription>
 </DialogHeader>
 <div className="space-y-3 py-2 text-xs">
 <div>
 <label className="font-semibold block mb-1">Tipo de Relatório:</label>
 <select
 value={tipoRelatorioEnvio}
 onChange={(e) => setTipoRelatorioEnvio(e.target.value as any)}
 className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
 >
 <option value="Relatório Parcial">Relatório Técnico Parcial (Anual/Semestral)</option>
 <option value="Relatório Final">Relatório Final Conclusivo</option>
 </select>
 </div>

 <div>
 <label className="font-semibold block mb-1">Arquivo do Relatório (PDF):</label>
 <input
 type="text"
 value={relatorioArquivo}
 onChange={(e) => setRelatorioArquivo(e.target.value)}
 placeholder="relatorio_pesquisa_inema_2026.pdf"
 className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
 />
 </div>
 </div>
 <DialogFooter className="gap-2">
 <Button variant="outline" size="sm" onClick={() => setModalRelatorioAberto(false)}>
 Cancelar
 </Button>
 <Button
 size="sm"
 className="bg-teal-700 hover:bg-teal-800 text-white"
 onClick={handleEnviarRelatorio}
 >
 Protocolar Relatório
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 {/* MODAL 5: VINCULAR PUBLICAÇÃO CIENTÍFICA */}
 <Dialog open={modalPublicacaoAberto} onOpenChange={setModalPublicacaoAberto}>
 <DialogContent className="max-w-md">
 <DialogHeader>
 <DialogTitle className="text-base flex items-center gap-2">
 <BookOpen className="w-5 h-5 text-teal-600" />
 Cadastrar Publicação Científica Vinculada 
 </DialogTitle>
 <DialogDescription className="text-xs">
 Mencione a publicação gerada a partir da autorização emitida pelo INEMA.
 </DialogDescription>
 </DialogHeader>
 <div className="space-y-3 py-2 text-xs">
 <div>
 <label className="font-semibold block mb-1">Título da Publicação / Artigo*:</label>
 <input
 type="text"
 value={pubTitulo}
 onChange={(e) => setPubTitulo(e.target.value)}
 placeholder="Ex: Novos registros de flora rupestre na Chapada Diamantina..."
 className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
 />
 </div>

 <div className="grid grid-cols-2 gap-2">
 <div>
 <label className="font-semibold block mb-1">Tipo de Produção:</label>
 <select
 value={pubTipo}
 onChange={(e) => setPubTipo(e.target.value as any)}
 className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
 >
 <option value="Artigo Científico (Periódico)">Artigo Científico (Periódico)</option>
 <option value="Dissertação de Mestrado">Dissertação de Mestrado</option>
 <option value="Tese de Doutorado">Tese de Doutorado</option>
 <option value="Resumo em Congresso">Resumo em Congresso</option>
 <option value="Capítulo de Livro">Capítulo de Livro</option>
 </select>
 </div>

 <div>
 <label className="font-semibold block mb-1">Ano:</label>
 <input
 type="number"
 value={pubAno}
 onChange={(e) => setPubAno(Number(e.target.value))}
 className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
 />
 </div>
 </div>

 <div>
 <label className="font-semibold block mb-1">Periódico / Revista / Evento:</label>
 <input
 type="text"
 value={pubVeiculo}
 onChange={(e) => setPubVeiculo(e.target.value)}
 placeholder="Ex: Biota Neotropica / Acta Botanica Brasilica"
 className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
 />
 </div>

 <div>
 <label className="font-semibold block mb-1">DOI ou Link Eletrônico:</label>
 <input
 type="text"
 value={pubDoi}
 onChange={(e) => setPubDoi(e.target.value)}
 placeholder="https://doi.org/10.1590/..."
 className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
 />
 </div>
 </div>
 <DialogFooter className="gap-2">
 <Button variant="outline" size="sm" onClick={() => setModalPublicacaoAberto(false)}>
 Cancelar
 </Button>
 <Button
 size="sm"
 className="bg-teal-700 hover:bg-teal-800 text-white"
 onClick={handleCadastrarPublicacao}
 >
 Cadastrar Publicação
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>
 );
};

export default PesquisaCientificaPage;
