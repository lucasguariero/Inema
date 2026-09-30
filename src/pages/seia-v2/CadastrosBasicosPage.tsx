import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Building2,
  Trees,
  FileSignature,
  Briefcase,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Mail,
  FileText,
  Shield,
  MapPin,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, TabItem } from '@/components/filament/Tabs';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface CadastrosBasicosPageProps {
  onNavigate?: (route: string) => void;
}

export const CadastrosBasicosPage: React.FC<CadastrosBasicosPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('rt');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const tabs: TabItem[] = [
    { id: 'rt', label: 'Responsáveis Técnicos', badge: '14', badgeColor: 'primary' },
    { id: 'representantes', label: 'Representantes Legais', badge: '8', badgeColor: 'primary' },
    { id: 'empreendimentos', label: 'Empreendimentos', badge: '32', badgeColor: 'default' },
    { id: 'propriedades', label: 'Propriedades Rurais (CEFIR)', badge: '19', badgeColor: 'default' },
    { id: 'procuradores', label: 'Procuradores', badge: '6', badgeColor: 'default' },
    { id: 'consultorias', label: 'Consultorias Ambientais', badge: '5', badgeColor: 'default' },
  ];

  // MOCK DATA - RESPONSÁVEIS TÉCNICOS
  const rtList = [
    {
      codigo: 'RT-BA-2026-0012',
      nome: 'Eng. Roberto Albuquerque Silva',
      cpf: '712.983.105-44',
      profissao: 'Engenheiro Agrônomo',
      orgaoClasse: 'CREA-BA 051982/D',
      art: 'ART-BA-2026-8819234 (Ativa)',
      vinculo: 'Agropecuária Vale Verde S.A.',
      situacao: 'Habilitado & Vigente',
      statusColor: 'success',
      dataSolicitacao: '14/01/2026',
      dataManifestacao: '16/01/2026 (Aceite assinado)',
      permissoes: 'Elaborar e protocolar estudos, responder notificações'
    },
    {
      codigo: 'RT-BA-2026-0045',
      nome: 'Bióloga Camila Meireles Pires',
      cpf: '402.119.852-09',
      profissao: 'Bióloga Especialista em Fauna',
      orgaoClasse: 'CRBio 04918-08/D',
      art: 'TRT-BA-2026-019234 (Ativa)',
      vinculo: 'Complexo Eólico do São Francisco',
      situacao: 'Aguardando Aceite',
      statusColor: 'warning',
      dataSolicitacao: '28/09/2026',
      dataManifestacao: 'Pendente de assinatura',
      permissoes: 'Manejo de fauna, laudos de monitoramento'
    },
    {
      codigo: 'RT-BA-2025-0819',
      nome: 'Eng. Ambiental Marcos Vinicius Torres',
      cpf: '881.042.934-21',
      profissao: 'Engenheiro Ambiental e Sanitarista',
      orgaoClasse: 'CREA-BA 084129/D',
      art: 'ART-BA-2025-449102 (Ativa)',
      vinculo: 'Cetrel S.A. Tratamento de Resíduos',
      situacao: 'Habilitado & Vigente',
      statusColor: 'success',
      dataSolicitacao: '10/08/2025',
      dataManifestacao: '12/08/2025 (Aceite assinado)',
      permissoes: 'PGRS, efluentes e monitoramento de emissões'
    }
  ];

  // MOCK DATA - REPRESENTANTES LEGAIS
  const representantesList = [
    {
      codigo: 'REP-2026-003',
      nome: 'Eduardo Guimarães Mendonça',
      cpf: '219.840.115-90',
      profissao: 'Administrador / Diretor Executivo',
      cadastroRepresentado: 'Petroquímica Camaçari S.A. (CNPJ 04.892.112/0001-90)',
      dataEntrada: '05/01/2026',
      situacao: 'Ativo com Poderes Plenos',
      statusColor: 'success',
      documentoComprobatorio: 'Contrato Social Registrado na JUCEB nº 29381029',
      permissoes: 'Assinatura digital de termos de compromisso, parcelamentos e outorgas'
    },
    {
      codigo: 'REP-2026-011',
      nome: 'Dra. Vanessa Cavalcante Costa',
      cpf: '551.902.348-12',
      profissao: 'Advogada / Sócia Administradora',
      cadastroRepresentado: 'Mineração Vale do Jacuípe Ltda.',
      dataEntrada: '18/03/2026',
      situacao: 'Ativo',
      statusColor: 'success',
      documentoComprobatorio: 'Procuração Pública por Instrumento Notarial',
      permissoes: 'Defesa em autos de infração e requerimento de licenças'
    }
  ];

  // MOCK DATA - EMPREENDIMENTOS
  const empreendimentosList = [
    {
      id: 'EMP-BA-290320-001',
      nome: 'Complexo Agroindustrial Vale Verde - Planta Barreiras',
      requerente: 'Agropecuária Vale Verde S.A.',
      localidade: 'Barreiras / BA — Rodovia BR-242 km 45',
      tipoImovel: 'Imóvel Rural (CEFIR BA-2903201-98AF234190)',
      coordenadas: '-12.148500, -45.002100 (SIRGAS 2000)',
      tipologiaPrincipal: 'Agroindústria de Beneficiamento de Grãos e Soja',
      status: 'Regular / Em Operação',
      statusColor: 'success'
    },
    {
      id: 'EMP-BA-291160-004',
      nome: 'Parque Eólico Serra do Assuruá - Fase II',
      requerente: 'Complexo Eólico do São Francisco S.A.',
      localidade: 'Gentio do Ouro / BA — Serra da Canabrava',
      tipoImovel: 'Imóvel Rural Múltiplo',
      coordenadas: '-11.432100, -42.781200 (SIRGAS 2000)',
      tipologiaPrincipal: 'Geração de Energia Eólica (Potência 180 MW)',
      status: 'Em Licenciamento (LI)',
      statusColor: 'info'
    },
    {
      id: 'EMP-BA-290570-002',
      nome: 'Unidade de Tratamento e Destinação de Resíduos Industriais',
      requerente: 'Cetrel S.A. Tratamento de Efluentes',
      localidade: 'Camaçari / BA — Polo Industrial de Camaçari',
      tipoImovel: 'Imóvel Urbano Industrial',
      coordenadas: '-12.698400, -38.321900 (SIRGAS 2000)',
      tipologiaPrincipal: 'Tratamento e Disposição de Resíduos Perigosos Classe I',
      status: 'Licença Vigente (LO)',
      statusColor: 'success'
    }
  ];

  // MOCK DATA - PROPRIEDADES RURAIS (CEFIR)
  const propriedadesList = [
    {
      codigoCefir: 'BA-2903201-98AF234190',
      nomeImovel: 'Fazenda Boa Esperança - Gleba Primavera',
      areaTotal: '1.450,80 ha',
      municipio: 'Barreiras / BA',
      reservaLegal: '290,16 ha (20,00% Aprovada)',
      app: '48,50 ha (Preservada)',
      statusSicar: 'Inscrito e Homologado',
      statusColor: 'success',
      dataCadastro: '12/05/2023',
      ativo: 'Sim'
    },
    {
      codigoCefir: 'BA-2918407-11BC894412',
      nomeImovel: 'Fazenda Santa Helena do Jacuípe',
      areaTotal: '820,40 ha',
      municipio: 'Riachão do Jacuípe / BA',
      reservaLegal: '164,08 ha (Em Análise)',
      app: '32,10 ha (Com PRAD)',
      statusSicar: 'Pendente de Validação',
      statusColor: 'warning',
      dataCadastro: '04/11/2024',
      ativo: 'Sim'
    }
  ];

  // MOCK DATA - PROCURADORES
  const procuradoresList = [
    {
      id: 'PROC-2026-008',
      nome: 'Dr. Leonardo Santos Bastos',
      cpf: '619.442.890-33',
      oab: 'OAB-BA 48.912',
      vinculo: 'Agropecuária Vale Verde S.A.',
      situacao: 'Vigente até 31/12/2027',
      statusColor: 'success',
      conviteEnviado: '10/01/2026',
      poderes: 'Representação administrativa, vista de autos e protocolo de recursos'
    },
    {
      id: 'PROC-2026-014',
      nome: 'Dra. Mariana Farias Sampaio',
      cpf: '331.890.124-77',
      oab: 'OAB-BA 55.419',
      vinculo: 'Cetrel S.A.',
      situacao: 'Vigente até 15/06/2026',
      statusColor: 'success',
      conviteEnviado: '15/02/2026',
      poderes: 'Assinatura de termos de ajustamento e representação no CEPRAM'
    }
  ];

  // MOCK DATA - CONSULTORIAS
  const consultoriasList = [
    {
      id: 'CONS-2026-002',
      razaoSocial: 'Biosfera Consultoria & Engenharia Ambiental Ltda.',
      cnpj: '18.912.441/0001-80',
      responsavelTecnico: 'Eng. Roberto Albuquerque Silva (CREA-BA 051982)',
      processosVinculados: '14 processos ativos',
      situacao: 'Homologada',
      statusColor: 'success',
      municipio: 'Salvador / BA'
    },
    {
      id: 'CONS-2026-007',
      razaoSocial: 'EcoNordeste Estudos e Licenciamento Ambiental',
      cnpj: '33.109.844/0001-22',
      responsavelTecnico: 'Bióloga Camila Meireles Pires (CRBio 04918-08)',
      processosVinculados: '8 processos ativos',
      situacao: 'Homologada',
      statusColor: 'success',
      municipio: 'Feira de Santana / BA'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb Padrão */}
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Cadastros Básicos & Vínculos', route: 'cadastros-basicos' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Cadastros Mestres & Gestão de Vínculos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Base centralizada de Responsáveis Técnicos (ART), Representantes Legais, Empreendimentos, Imóveis Rurais (CEFIR) e Procuradores.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Button variant="outline" size="sm" className="text-xs h-9 w-full sm:w-auto">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Exportar Base</span>
          </Button>

          {activeTab === 'rt' && (
            <Button
              onClick={() => setActiveModal('novo-rt')}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>+ Vincular Responsável Técnico</span>
            </Button>
          )}

          {activeTab === 'representantes' && (
            <Button
              onClick={() => setActiveModal('novo-rep')}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>+ Adicionar Representante Legal</span>
            </Button>
          )}

          {activeTab === 'empreendimentos' && (
            <Button
              onClick={() => setActiveModal('novo-emp')}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>+ Novo Empreendimento</span>
            </Button>
          )}

          {activeTab === 'propriedades' && (
            <Button
              onClick={() => setActiveModal('novo-cefir')}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>+ Importar CAR / CEFIR</span>
            </Button>
          )}

          {activeTab === 'procuradores' && (
            <Button
              onClick={() => setActiveModal('novo-proc')}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>+ Adicionar Procurador</span>
            </Button>
          )}

          {activeTab === 'consultorias' && (
            <Button
              onClick={() => setActiveModal('nova-cons')}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>+ Vincular Consultoria</span>
            </Button>
          )}
        </div>
      </div>

      {/* KPIs de Cadastros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Responsáveis Técnicos"
          value="14 Ativos"
          trend="100% com ART Vigente"
          trendType="up"
          icon={UserCheck}
          chartData={[8, 10, 11, 12, 12, 13, 14]}
        />
        <KpiCard
          title="Empreendimentos Cadastrados"
          value="32 Plantas"
          trend="Indústria, Agro & Energia"
          trendType="neutral"
          icon={Building2}
          chartData={[20, 22, 25, 27, 29, 30, 32]}
        />
        <KpiCard
          title="Área em Imóveis Rurais"
          value="48.250 ha"
          trend="CEFIR Homologado"
          trendType="up"
          icon={Trees}
          chartData={[30, 35, 38, 42, 45, 46, 48]}
        />
        <KpiCard
          title="Procurações Vigentes"
          value="06 Válidas"
          trend="Poderes Plenos SEIA"
          trendType="neutral"
          icon={FileSignature}
          chartData={[4, 4, 5, 5, 6, 6, 6]}
        />
      </div>

      {/* Abas Principais de Navegação */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* TABELA MESTRE UNIFICADA (TABLE CONTAINER + TOOLBAR) */}
      <TableContainer
        toolbar={
          <TableToolbar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar por nome, CPF/CNPJ, conselho de classe, imóvel ou código..."
            actions={
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Exibindo registros ativos
              </span>
            }
          />
        }
      >
        {activeTab === 'rt' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Código / Registro</th>
                <th className="py-3 px-4">Responsável Técnico / CPF</th>
                <th className="py-3 px-4">Conselho & ART / TRT</th>
                <th className="py-3 px-4">Vínculo com Empresa</th>
                <th className="py-3 px-4">Situação & Manifestação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rtList
                .filter(
                  (rt) =>
                    !searchTerm ||
                    rt.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rt.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rt.cpf.includes(searchTerm) ||
                    rt.art.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rt.vinculo.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((rt) => (
                  <tr key={rt.codigo} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {rt.codigo}
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">Solicitado: {rt.dataSolicitacao}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{rt.nome}</div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{rt.cpf} • {rt.profissao}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{rt.orgaoClasse}</div>
                      <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">{rt.art}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{rt.vinculo}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">{rt.permissoes}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color={rt.statusColor as any} dot size="xs">
                        {rt.situacao}
                      </Badge>
                      <div className="text-[10px] text-slate-400 mt-1">{rt.dataManifestacao}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => {
                          setSelectedItem(rt);
                          setActiveModal('detalhes-rt');
                        }}
                        className="text-[#0F4C3A] dark:text-emerald-400"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Ficha RT</span>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {activeTab === 'representantes' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Representante Legal / CPF</th>
                <th className="py-3 px-4">Cadastro Representado</th>
                <th className="py-3 px-4">Documento Comprobatório</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {representantesList
                .filter(
                  (rep) =>
                    !searchTerm ||
                    rep.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rep.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rep.cpf.includes(searchTerm) ||
                    rep.cadastroRepresentado.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((rep) => (
                  <tr key={rep.codigo} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {rep.codigo}
                      <div className="text-[10px] text-slate-400 font-normal">{rep.dataEntrada}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{rep.nome}</div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{rep.cpf} • {rep.profissao}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {rep.cadastroRepresentado}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {rep.documentoComprobatorio}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color={rep.statusColor as any} dot size="xs">
                        {rep.situacao}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="xs" className="text-[#0F4C3A] dark:text-emerald-400">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        <span>Termo</span>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {activeTab === 'empreendimentos' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Código / Empreendimento</th>
                <th className="py-3 px-4">Requerente / Detentor</th>
                <th className="py-3 px-4">Localidade & Coordenadas</th>
                <th className="py-3 px-4">Tipologia Principal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {empreendimentosList
                .filter(
                  (emp) =>
                    !searchTerm ||
                    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.requerente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.localidade.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] text-slate-500 font-bold block">{emp.id}</span>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{emp.nome}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {emp.requerente}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 dark:text-slate-200">{emp.localidade}</div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{emp.coordenadas}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {emp.tipologiaPrincipal}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color={emp.statusColor as any} dot size="xs">
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="xs" className="text-[#0F4C3A] dark:text-emerald-400">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Ficha</span>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {activeTab === 'propriedades' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Código CEFIR / Imóvel</th>
                <th className="py-3 px-4">Área Total</th>
                <th className="py-3 px-4">Município</th>
                <th className="py-3 px-4">Reserva Legal & APP</th>
                <th className="py-3 px-4">Status SICAR</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {propriedadesList
                .filter(
                  (prop) =>
                    !searchTerm ||
                    prop.codigoCefir.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    prop.nomeImovel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    prop.municipio.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((prop) => (
                  <tr key={prop.codigoCefir} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">{prop.codigoCefir}</span>
                      <div className="text-slate-600 dark:text-slate-300">{prop.nomeImovel}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {prop.areaTotal}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {prop.municipio}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 dark:text-slate-200">RL: {prop.reservaLegal}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">APP: {prop.app}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color={prop.statusColor as any} dot size="xs">
                        {prop.statusSicar}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="xs" className="text-[#0F4C3A] dark:text-emerald-400">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span>Polígonos</span>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {activeTab === 'procuradores' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Código / Nome</th>
                <th className="py-3 px-4">CPF / OAB</th>
                <th className="py-3 px-4">Outorgante Representado</th>
                <th className="py-3 px-4">Poderes Delegados</th>
                <th className="py-3 px-4">Vigência</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {procuradoresList
                .filter(
                  (proc) =>
                    !searchTerm ||
                    proc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    proc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    proc.cpf.includes(searchTerm) ||
                    proc.vinculo.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((proc) => (
                  <tr key={proc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {proc.nome}
                      <span className="font-mono text-[10px] text-slate-400 block font-normal">{proc.id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {proc.cpf}
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{proc.oab}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {proc.vinculo}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                      {proc.poderes}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color={proc.statusColor as any} dot size="xs">
                        {proc.situacao}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="xs" className="text-[#0F4C3A] dark:text-emerald-400">
                        <FileSignature className="w-3.5 h-3.5 mr-1" />
                        <span>Procuração</span>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {activeTab === 'consultorias' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Código / Razão Social</th>
                <th className="py-3 px-4">CNPJ</th>
                <th className="py-3 px-4">Responsável Técnico</th>
                <th className="py-3 px-4">Processos Ativos</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {consultoriasList
                .filter(
                  (cons) =>
                    !searchTerm ||
                    cons.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    cons.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    cons.cnpj.includes(searchTerm) ||
                    cons.responsavelTecnico.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((cons) => (
                  <tr key={cons.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] text-slate-400 block font-normal">{cons.id}</span>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{cons.razaoSocial}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{cons.municipio}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {cons.cnpj}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                      {cons.responsavelTecnico}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {cons.processosVinculados}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color={cons.statusColor as any} dot size="xs">
                        {cons.situacao}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="xs" className="text-[#0F4C3A] dark:text-emerald-400">
                        <Briefcase className="w-3.5 h-3.5 mr-1" />
                        <span>Contratos</span>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </TableContainer>

      {/* MODAL 1: NOVO RESPONSÁVEL TÉCNICO */}
      {activeModal === 'novo-rt' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0F4C3A] dark:text-emerald-400 uppercase">F-CAD-RT-01</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">Vincular Responsável Técnico (ART)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <InputWrapper label="CPF do Profissional" required hint="O profissional receberá convite digital para aceite no SEIA">
                <input type="text" placeholder="000.000.000-00" className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
              </InputWrapper>

              <div className="grid grid-cols-2 gap-3">
                <InputWrapper label="Conselho de Classe" required>
                  <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option>CREA-BA (Engenharia / Agronomia)</option>
                    <option>CRBio-08 (Biologia)</option>
                    <option>CRQ-VII (Química)</option>
                    <option>CRBio / Outros</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Número de Registro no Conselho" required>
                  <input type="text" placeholder="Ex: 051982/D" className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </InputWrapper>
              </div>

              <InputWrapper label="Número da ART / TRT / RRT Vinculada" required>
                <input type="text" placeholder="Ex: ART-BA-2026-0912441" className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
              </InputWrapper>

              <InputWrapper label="Escopo de Atribuições" required>
                <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <option>Poderes Totais (Elaborar, protocolar, responder notificações e assinar laudos)</option>
                  <option>Apenas Elaboração e Acompanhamento Técnico</option>
                  <option>Específico para Manejo de Fauna (CRAS / ASAS)</option>
                </select>
              </InputWrapper>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancelar</Button>
              <Button size="sm" onClick={() => setActiveModal(null)} className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white">
                Enviar Convite de Vinculação
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DETALHES DO RT */}
      {activeModal === 'detalhes-rt' && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500">{selectedItem.codigo}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedItem.nome}</h3>
              </div>
              <Badge variant={selectedItem.statusColor as any}>{selectedItem.situacao}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">CPF / Registro:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedItem.cpf} • {selectedItem.orgaoClasse}</p>
              </div>
              <div>
                <span className="text-slate-500">Anotação de Responsabilidade:</span>
                <p className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">{selectedItem.art}</p>
              </div>
              <div className="col-span-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-500 font-semibold">Poderes e Permissões no SEIA:</span>
                <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">{selectedItem.permissoes}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" onClick={() => setActiveModal(null)} className="bg-[#0F4C3A] text-white">Fechar Ficha</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
